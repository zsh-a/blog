---
title: db
tag: [db,database]
---
# 索引
- hash 索引
- B tree

    - 将sex放在索引数据中
        ```sql
        CREATE INDEX btree_idx_age ON titanic_survivor(age) USING BTREE INCLUDE (sex);
        ```
    - 对节点修改树结构变化复杂，需要加锁
    - 不适合distinct value cardinality小数据
- 跳表
    - 跳表通过一个概率值来决定是否需要添加上层节点，实现起来，变化比较局部
    - 内存的需求相对于 B 树更少
    - 缓存不友好
    - 逆向查询($age < 40$) -> 双向链表
- 位图
    ```
    sex:    bitmap
    male:   10001111
    female: 01110000
    ```
    - 不适用于高并发环境

# 执行模式
- materialization(备忘录模式)
    - 将所有RowSet一次性处理返回
    - 占用内存大
- iterator模式
    - 算子间调用开销大
    - block算子需要将中间结构暂存到文件系统
- batch
    - 一次处理多个数据
    - 利用SIMD
    - 切合列存，适用于OLAP 查询语句
# 算子
## Sort
- `ORDER BY`
- `DISTINCT`
### 外部归并
- 至少需要3页内存，2输入缓冲,1输出缓冲
- 3页内存: $2n*(1 + log_2n)$ 次IO
- b页内存: $2n * ( 1 + log_{b-1}(n/b) )$ 次IO
    - 每次合并$b - 1$页
### B+Tree
- 查找到相应节点，顺序读取

## 聚合(aggregation)
- `COUNT`
- `AVG`
### 排序
- 按`GROUP BY`键排序
### hash
- 内存占用大
#### 外部hash
- b页内存，1页输入缓冲，b-1页分区（partition）
- 分配到 $hash\_fun(key) \% (b - 1)$页中，页写满后写入到文件
- 扫描一遍将数据分为b-1个文件
- 如果每个文件大小在b页以内，对于每个文件使用hash实现聚合
    - 如果大于b页，换个hash函数将每个文件再次b-1个文件
    - k层分区可以处理$b^k$页数据

## JOIN
- 考虑两个表A: $M$页，$m$个row,B: $N$页，$n$个row，假设$M < N,m < n$

### NestedLoopJoin
- 内存无限
    ```python
    for row_a in table_a.rows:
        for row_b in table_b.rows:
            if join_condition(row_a,row_b):
                emit(process_tuple(row_a,row_b))
    ```
    - IO复杂度：$O(M + N)$
- 一次只能读取一页
    ```python
    for block_a in table_a.blocks:
        for block_b in table_b.blocks:
            for row_a in block_a.rows:
                for row_b in block_b.rows:
                    if join_condition(row_a,row_b):
                        emit(process_tuple(row_a,row_b))
    ```
    - IO复杂度：$M+M*N$
    - 应将较小的表放在外层循环
- NestedLoopIndexJoin：在B表相应的join key上建立索引
    - IO复杂度：$M+m*C$

### SortMergeJoin

- 根据join key排序
- 双指针
- IO复杂度：$M + N + 2M*log2M + 2N*log2N$
- 一旦排序后，上层的语句可能都能获益

### HashJoin
- 对较小的表A建立hash表
- 对B表顺序读取，查询hash表
- IO复杂度
    - 表A可以放入内存：$M+N$
    - 外部hash： $3*(M+N)$
        - Partition phase：$2*(M + N)$
        - probing phase：$M + N$
# 优化器
数据库元数据 + 语法树 -> 物理算子执行计划
- IO
- 内存
- CPU cycle
- 整体优化
## Query Rewrite
- 根据预定义的规则重写
- 优化掉无意义操作
- Projections push down
    - 把用到的column向下推送到叶节点，减少扫描后数据大小
- Predicates push down
    - 把过滤条件向下推送
    - 若相应column有索引，全表扫描->索引扫描
- Impossible/Unnecessary Predicates
    ```sql
    SELECT * FROM table1
    WHERE
    val BETWEEN 1 AND 50   
    OR val BETWEEN 45 AND 100;
    ```
    优化后
    ```sql
    SELECT * FROM table1
    WHERE val BETWEEN 1 AND 100;
    ```
    ```sql
    SELECT
    id, name, class_id
    FROM (
        SELECT * FROM students
        ORDER BY id --无效排序
    ) t
    ORDER BY class_id;
    ```

## 多表join
- n个表join可能性$4^n$
- 在资源限制内，找到较优解
### Heuristic approach
- left-deep-tree
    - 所有右子树必须为实体表
    - 如果使左边result set较小，建立hash表存放在内存中，所有右子树表仅需一遍全表扫描
    - 不能同时执行多个join
- Cardinality Estimation
    - 决定join顺序
    - $Selection\ cardinality: SC(P, R)$
        - predicate为P，对于表R，大约有多少row输出
        - 需要统计表元信息：1）总行数 2）有多少个distinct value
    - 假设均匀分布
    -   ```sql
        SELECT * FROM student WHERE major = 'CS';
        ```
        $SC(P, R) = N_R * SEL(P, R)$

        SEL：每个row满足P的概率
        
        假设major's distinct value为10，则$SEL(major = ‘CS’, student) = 10\%$

        如果$N_R=100$，则$SC(P, R)=10$

    - 若$P:age > 30$
        - $SEL(age > 30, student)=\frac{age > 30\ distinct\ value}{distinct\ value}$
    - 若$P:age = 30 and major = 'C'$，假设相互独立
        - $SEL(age = 30,major = 'CS', student)=SEL(age = 30, student) * SEL(major = 'CS', student)$
    - disjunction
        - $SEL(age = 30 \cup major = 'CS', student) = SEL(age = 30, student) + SEL(major = ‘CS’, student) - SEL(age = 30, student) * SEL(major = 'CS', student)$
    - join cardinality
        ```sql
        SELECT * FROM R1, R2 WHERE R1.a = R2.a;
        ```
        $JC(R1, R2, R1.a = R2.a) = N_R * N_S / max(V(a, R), V(a, S))$
        - $V(a, R):the \ number\ of\ distinct \ value \ for\ column\ a\ in\ table R$

    - 改进，采用直方图（Histogram）统计
    - [HyperLogLog](https://en.wikipedia.org/wiki/HyperLogLog)
- Cost Model
  - 对于每个Physical operator根据cardinality计算cost
  - SequentialScan
    - 顺序IO
    - $Cost = NumRowsInTable * RowWidth * SEQ\_SCAN\_UNIT\_COST$
  - IndexScan 
    - 随机IO
    - $Cost = SelectionCardinality * RowWidth * INDEX\_SCAN\_UNIT\_COST$
  - coefficient 设置
    - mini-benchmark模拟
  
- Optimizer 
  - 不同operator对上层operator cost有影响，eg: sort,index
  - 求解使得root operator 的aggregated cost最小的physical operator tree
  - 有依赖的背包问题
# 事务
对数据操作集合
- atomicity
- durability：事务执行成功->被持久化
- consistency：事务的执行保持数据库一致性
- isolation：并发事务不会感知到其他事务存在

## 隔离级别
<!-- naive：对数据加锁，限制并发 -->
提供多种隔离性的级别，越严格的隔离级别越接近全局锁，越宽松的隔离级别越能提高并发
- read uncommitted
  - 在一个事务中，允许读取其他事务未提交的数据
  - dirty read
  - 不需要加锁
- read committed
  - 在一个事务中，只能够读取到其他事务已经提交的数据
  - 可能读取到不一致的值，违反了隔离性，nonrepeatable read
- repeatable read
  - 能读取已经提交的数据，且可以重复查询这些数据，并且，在重复查询之间，不允许其他事务对这些数据进行写操作
  - phantom read(幻读)，在一个事务中，当查询了一组数据后，再次发起相同查询，却发现满足条件的数据被另一个提交的事务改变了
- serializable
  - 所有的事务必须按照一定顺序执行
## 实现
### 加锁实现机制(Lock-based protocols)
- naive 全局锁
  - 降低锁粒度
- 不同类型锁
  - S-lock：只读
  - X-lock：读写

#### 两阶段加锁机制(Two-phase locking protocol)
1. 获取锁阶段(growing phase)：在这个过程中，事务只能不断地获取新的锁，但不能释放锁。
2. 释放锁阶段(shrinking phase)：在这个过程中，事务只能逐渐释放锁，并且无权再获取新的锁。
- 不能避免死锁，需要死锁检测机制
- 可能遇到连锁回滚(cascading rollback)
#### 严格的两阶段加锁(strict two-phase locking protocol)
- 对于独占锁(X-lock)必须等到事务结束时才释放
- 避免其他事务对未提交的数据进行读写操作，因此也避免了连锁回滚

### 时间戳机制(Timestamp-based protocols)
- 加锁：通过比较哪个事务先获得锁决定事务执行顺序
  - 系统记录每个事务开启时间$TS(T_i)$
  - 假设$T_i$ 和$T_j$的时间戳分别为 $TS(T_i)$及 $TS(T_j)$，数据库系统需要保证无论如何调度实现，都和序列化执行$T_i,T_j$一致
- W-timestamp(A)：对于数据 A，最近一次被某个事务修改的时间戳。
- R-timestamp(A)：对于数据 A，最近一次被某个事务读取的时间戳。
  
对于事务 $T_i$ 要读取数据 A read(A):

- 如果 $TS(T_i) < W-timestamp(A)$，说明A被一个 $TS$ 比 $T_i$ 更大的事务改写过，但 Ti 只能读取比自身 $TS$ 小的数据。因此 $T_i$ 的读取请求会被拒绝，$T_i$ 会被回滚。
- 如果 $TS(T_i) > W-timestamp(A)$，说明 A 最近一次被修改小于 $TS(T_i)$，因此读取成功，并且，R-timestamp(A)被改写为 $TS(T_i)$。

对于事务 Ti 要修改数据 A write(A)
- 如果 $TS(T_i) < R-timestamp(A)$，说明 A 已经被一个更大 TS 的事务读取了，$T_i$ 对 A 的修改就没有意义了，因此 $T_i$ 的修改请求会被拒绝，$T_i$ 会被回滚。
- 如果 $TS(T_i) < W-timestamp(A)，说明 A 已经被一个更大 TS 的事务修改了$，$T_i$ 对 A 的修改就没有意义了，因此 $T_i$ 的修改请求会被拒绝，$T_i$ 会被回滚。
- 其他情况下，$T_i$ 的修改会被接受，同时 W-timestamp(A)会被改写为$TS(T_i)$。

有可能导致饥饿(starvation)，不停失败然后重试

托马斯的修改规则(Thomas’ write rule)
- 果 $TS(T_i) < W-timestamp(A)，$T_i$的修改没有意义，该操作被忽略

### 多版本并发控制 Multi-Version Concurrency Control (MVCC)
- 因为锁和时间戳机制都是通过阻塞或者回滚冲突的事务来确保事务的有序性，将所有数据的历史版本记录下来避免回滚


#### 多版本时间戳(Multi-Version Timestamp Ordering)
- 对于每个数据$Q$，系统会保存一系列版本数据，每个$Q_x$保存以下信息
  - data
  - W-TS($Q_x$)：$Q_x$被创建的时间戳
  - R-TS($Q_x$)：最近一次被某个事务 $T_j$ 读取成功的时间戳，即 TS($T_j$)
- 对于事务$T_i$，对数据$Q$的操作
  - 首先找到$W-TS(Q)\le TS(T_i)$的最大值$Q_x$
  - read：读取成功
  - write
    - 如果$TS(T_i) < R-TS(Q_x)$，说明有一个更新的事务已经读取数据，则写失败，回滚$T_i$
    - 如果$TS(T_i) = W-TS(Q_x)$，直接覆盖原值
    - 如果$TS(T_i) > R-TS(Q_x)$，则创建一个新版本
  - 读操作不会失败和等待
  - 读操作需要更新$R-TS(Q_k)$，产生两次磁盘IO
  - 写操作失败时要求回滚

#### 多版本两阶段加锁(Multi-Version Two-Phase Locking)
- 区分只读事务和读写事务
- 有更新的事务会遵循两阶段加锁，不同的写事务可以等待不需要回滚
- 对于只读事务，与多版本时间戳一致
- 对于有更新的事务
  - read：获得数据的共享锁，并读取最新版本
  - write
    - 获取数据独占锁并创建一个新版本，并把版本时间戳设为无穷
    - 当事务要提交时，将所有创建的数据时间戳设为$TS-Counter + 1$，并同时更新系统时间戳为$TS-Counter + 1$
#### 缺陷
- 额外存储和计算开销
  - 保存历史版本，快速定位到正确版本
  - 定期清理老版本数据
- 多线程竞争时间戳分配

### 快照隔离(Snapshot Isolation)
- 看作是对每一个事务，分配了一个独有的数据库快照
- 提供了“太多”的隔离性
- T1: 把所有的白子变成黑子`UPDATE color = 'black' FROM marbles WHERE color = 'white'`。T2:把所有的黑子变成白子。
  - 并发情况下，两个事务更新的数据不同，因此都会视为成功，导致黑白互换
  - 序列化执行下，要么全黑，要么全白

# 单机到分布式
## 存储
- 将数据均匀分发到多个节点上
  - consistent hashing
    ![](/image/db/con_hash.jpg)
    - 当有节点增加或删除时，减少数据迁移
    1. 环形hash空间：将key映射到$2^{32}$个桶空间中
    2. 将机器映射到环上
    3. 按照顺时针将数据存储到对应机器上
    - 分布不均衡：加入虚拟机器节点
- leader节点存储全部的元数据（分布式元数据、基础元数据），用于数据分发，sql编译和优化
- 每个worker保留本地数据的元数据，用于sql执行

## 数据处理
- 减少leader节点执行算子的复杂度

### 分布式算子
- **Merge**
  - 将下层算子读取的数据发送到leader节点
- **Redistribute**
  - worker节点将数据发送到另一个worker节点
- **Broadcast**
  - worker节点将数据广播到所有worker节点

### 实现

- **Select (select * from table)**
![](/image/db/select.png)

- **Filter(select * from table where CONDITION)**
  - 将filter算子放在worker节点
![](/image/db/filter.png)

- **Sort(select * from table order by COLUMN)**
  - 在leader节点多路归并：heap
![](/image/db/sort.png)

- **Join (select * from table1, table2 where table1.col1 = table2.col2)**
  - 对每个worker节点table1数据，根据col1的hash做redistribute，同时对table2的col2的hash做redistribute，具有相同hash的col1和col2会汇聚到同一节点，因此，local join可以得到正确结果
  ![](/image/db/join.png)
  - 如果table1以col1作为key分发，可以省略redistribute步骤，同理，table2相同
  - 如果join涉及大表，将较小的表Broadcast到每个worker节点
  ![](/image/db/join_big.png)

## 分布式事务
分布式事务 = 并发控制+原子提交

需要协调分布式节点的执行
- **Centralized**: Global "traffic cop"
- **Decentralized**：节点自组织
### 原子提交协议
- Two-Phase Commit (Common)
- Three-Phase Commit (Uncommon)
- Paxos (Common)
- Raft (Common)
- ZAB (Apache Zookeeper)
- Viewstamped Replication (first probably correct protocol)

#### Two-Phase Commit
![](/image/db/2pc.jpg)
- client send *Commit* request
1. coordinator send *Prepare*，询问当前事务是否可以提交
   - 如果可以提交，reply *OK*，否则reply *Abort*
   - 如果coordinator收到*Abort*，则发送*Abort*给client
2. coordinator 发送*Commit*给所有参与者
   - 参与者响应*OK*，coordinator能发送提交成功到client

- 所有节点持久化当前阶段状态，用于崩溃后恢复
- 节点阻塞，直到能够确定下一个操作

#### Paxos
所有节点对某个决议达成一致

coordinator提议一个结果（eg. commit,abort）,参与者投票该决议是否通过

- coordinator：**proposer**
- participants：**acceptors**

1. client发送*Commit*请求给proposer，proposer发送*Propose*给其他节点
   - 如果一个acceptor没有以更大的逻辑时间戳发送*Agree*，则发送*Agree*，否则发送*Reject*
2. 一旦大多数acceptors发送*Agree*，则proposer发送*Commit*，proposer等待直到接收到大多数*Accept*，向client发送提交成功

### 实现高可用和原子提交
- TC和worker都采用raft复制
- 在复制的services之间使用两阶段提交
- 


# 日志

*多个事务修改的数据存在同一缓冲页中*

缓冲池管理策略
- *steal policy*
  - 一个事务是否可以将未提交的数据写入磁盘
  - **STEAL**：STEAL Is allowed
  - **NO-STEAL**: Is not allowed
- *force policy*
  - 是否要求一个事务对数据的修改在提交时写入磁盘
  - **FORCE**：Is required
  - **NO-FORCE**: Is not required

- **NO-STEAL** + **FORCE**
  - 不需要undo回滚的事务，因为没有修改写入磁盘
  - 不需要redo已提交的事务，因为修改已经保证落盘
  - 写回磁盘时，如果缓冲页中存在未提交的修改，需要将该页复制一份
  - 要求事务所有需要修改的数据必须能够放入内存
## Shadow Paging
  - 包含两份数据库copy
  - *master*：仅包含已提交事务的更改
  - *shadow*：用于未提交事务的更改
  - 当事务提交时，原子的切换shadow为新的master
  ![](/image/db/shadow.png)

  - **Undo**：删除shadow页
  - **Redo**：Not needed at all
  - copy页表开销大
    - 使用B+tree结构
    - 只需copy叶节点路径上的页
  - commit开销大
    - flush 每个更新的页，页表，根
    - 数据碎片化
    - 需要垃圾收集
    - 仅支持一个写事务
## Journal File
- 当一个事务修改一个页时，copy原始页到一个journal文件
- 重启后，如果journal文件存在，undo未提交的事务
## WRITE-AHEAD LOG

shadowing page需要执行非连续页的随机写

将随机写转化为顺序写

![](/image/db/wal.png)

- 将所有变化记录在log文件
- log包含足够的信息执行undo和redo
- 确保log落盘后flush页缓冲
- **STEAL** + **NO-FORCE**


### CHECKPOINTS
- 周期性写入`<CHECKPOINT>`到log文件，表示之前事务已经落盘

