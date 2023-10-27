---
title: distributed system
tag: [distributed system,db,database]
---

- fault tolerance
  - replicated servers
- consistency

- performance
  - Load imbalance
  - Slowest-of-N latency

# GFS
- 自动错误恢复
- 用于大文件顺序访问

## 架构
- coordinator：追踪文件名
- chunkservers：存储64 MB chunks
- 每个chunk有3个副本
### coordinator state
- file name ->
  - array of chunk handles (nv)
- chunk handle ->
  - version (nv)
  - list of chunkservers (v)
  - primary (v)
  - lease time (v)

nv: state also written to disk


# Raft
- 一个容错系统依赖单一实体做出关键决策
- 实现容错和test-and-set服务
  - 复制：可能存在网络分区，多个brain
    - 无法区分**server crashed**和**network broken**
## 大多数投票
- 最多只有一个分区存在大多数，打破对称性
- $2f+1$个服务器能容忍$f$个服务器失败

## 流程
1. client 发送command到leader
2. leader 向log添加command
3. leader 向followers发送AppendEntries RPCs
4. followers向log添加command
5. leader等待直到大多数回复**committed**
6. leader 执行该命令，回复client
7. leader在下一次AppendEntries中捎带commit信息
8. 当leader commit时，followers执行Entry

### leader选举
- 确保所有副本执行相同命令，相同顺序

- 为leader确定顺序，new leader -> new term
  - 一个term最多一个leader，可能没有leader

- leader选举时机
  - 当没有收到**election timeout**消息时，增加`currentTerm`，尝试收集投票 
    - 可能导致无用选举
- 如何确保一个term中只有一个leader?
  - leader必须获得大多数票
  - 每个server在一个term仅会投一票
    - 若自己为候选人，则投给自己
    - 否则，投给第一个要求选票者
  - 只有一个server能够获得大多数票

- server如何知道最新选举的leader?
  - leader 发送有最大term 的**AppendEntries**心跳消息
  - 如果收到**AppendEntries**，则知道最新的leader
  - 心跳消息会抑制新的选举启动
    - 必须小于leader选举timeout
- 可能出现选票分散情况，leader选举一致失败
  - 为选举timeout增加随机性
  - **随机性打破对称性**
  - 随机性延迟在网络协议中经常出现

- 如何选择选举timeout?
  - 至少几个心跳间隔，避免不需要的选举
  - 随机部分足够长，确保有一个能成功
  - 足够短，确保快速响应

- 如果旧的leader没有意识到新的leader?
  - 可能旧leader没有收到选举消息
  - 可能不在大多数分区内
  - 旧leader将会收到更新的term 在AppendEntries中并下台，或者不能得到大多数回复，所以不会commit或执行新的log
  - 少数部分可能收到旧leader的AppendEntries，可能导致log分叉

### log
- leader选举后client仅与leader交互
- 一个leader失败后可能的异常情况
  - 不一致副本
  - 丢失操作
  - 重复操作
- 一个log entry仅能执行同一个command

- 强制followers与新leader的log保持一致
  - 每个followers删除log尾部与leader不一致的部分

- 确保选择的leader具有所有已提交的log
  - RequestVote handler 仅将票投给最新的log
    - 在最后的log entry 有更大的term
    - 相同的last term 并且相同或更长的log


### 持久化

- 修复策略
  - 使用一个新server替换
    - 传输所有log
  - 重启crashed server
    - 恢复持久化的状态

- 持久化状态
  - `log[]`
    - 确保committed log 保持一致
  - `votedFor`
    - 避免投出多票
  - `currentTerm`
- 优化磁盘写入
  - batch
  - battery-backed RAM
  - lazy 

- crash+reboot 恢复
  - redo 整个log
    - 速度慢
  - 使用snapshot，redo snapshot 之后的log


### log 压缩 和 Snapshots 

- 不能丢弃的log
  - committed 但未执行
  - 不清楚是否committed

- 周期性创建**snapshot**
  - 持久化raft状态和snapshot 
  - 丢弃snapshot之前的log
- 如果follower的log处于leader的log之前
  - follower离线一段时间，leader已经丢弃之前的log
  - `InstallSnapshot` RPC，设置状态

- 对于big DB，
- 数据以B-Tree存储在disk中
  - 无需显式Snapshot，因为数据已经存在


### linearizability
- 强一致性，与单个server行为一致
- 所有操作存在一个全序关系匹配实际时间，并且每个读操作都会最新写入的值
- 而顺序一致性仅要求本地的顺序性，偏序关系

### 重复RPC检测

- 如果RPC超时
  - server is dead or request was dropped：re-send
  - server executed, but reply was lost: re-send is dangerous

- 使用k/v维护已执行的RPC


### 只读操作
- Raft必须commit只读操作log，因为可能出现split brain


- 减少只读操作commit
  - leases，设置时间限制
  - 当leader每次得到**AppendEntries**大多数时，可以设置一段时间不需要将只读操作加入log
  - a new leader不能执行put操作知道lease过期
  - followers 记录最后一次响应AppendEntries的时间，并将其告诉new leader

# cache一致性
## 一致性协议
- 共享一个lock server(LS)，每个文件一把锁
- cache数据仅当持有锁时
- acquire lock -> read from shared storage
- write to shared storage -> release lock

## 原子性
- 对于相应的系统调用（create file, remove file, rename, &c），获取所有操作数据的锁
- 当所有操作完成时释放锁

## 崩溃恢复
- write-ahead logging
- 每个worker在shared storage中有自己的log file
- 当节点持有锁时发生崩溃
  - LS 发送revoke，无响应
  - LS超时，告知节点从log中恢复
    - 读取log
    - 执行log中操作
    - 告知LS完成，LS release节点持有的锁

- Paxos or Raft 复制 LS

# Spanner：分布式事务
- paxos之上的两阶段提交
- 同步时间：只读事务

