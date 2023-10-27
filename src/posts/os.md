---
title: os
tag:
  - os
---

# 内存管理

## 分页虚拟内存

### TLB刷新
- AARCH64内核和应用程序使用不同页表
  
  - 页表地址分别存放在TTBR0_EL1和TTBR1_EL1
  - 系统调用无需切换页表

- x86_64唯一页表基址存放在CR3
  - 将内核映射到高地址
  - 避免系统调用TLB刷新开销

### 如何降低TLB刷新开销
- **为不同的页表打上标签**
  -  TLB缓存项都有标签，切换页表不需要刷新TLB

- **x86_64:PCID**
  - PCID存储在CR3的低12位
- **AARCH64:ASID**
  - OS为不同进程分配8/16位ASID,将ASID存在TTBR0_EL1的高8/16位

### TLB与多核
- 需要刷新其他核的TLB吗？
  - 一个进程可能在多个核上运行
- 如何知道需要刷新哪些核心?
  - 通过系统的调度信息
- 怎么刷新其他核?
  - x86_64 ：发送IPI中断某个核，通知他主动刷新
  - AARCH64 : 可在local CPU上刷新其他核TLB

# 进程与线程
## 纤程
### Linux纤程支持 : ucontext
- `makecontext` 创建新ucontext
- `setcontext`  纤程切换
- `getcontext` 保存当前ucontext

# IPC
## 共享内存
- 操作系统为两个进程映射共同的内存区域
- 需要轮询是否有数据到达，导致资源浪费
## 消息传递
- 通过内核消息传递机制发送和接收消息
- `Send(message)` `Recv(message)` 会阻塞进程，不会浪费资源
- `Send` 可以非阻塞，增大通信带宽，引入超时机制防止资源浪费

# 同步
## 解决临界区问题的三个要求
- **互斥访问**：同一时刻仅有一个进程可以进入临界区
- **有限等待**：当一个进程在申请进入临界区后，必须在有限的时间获得许可进入临界区，不能无限等待
- **空闲让进**：当没有进程在临界区中时，必须在请求进入临界区的进程中选择一个进入临界区，保证程序正常推进

## 互斥访问实现
- **关中断**：保证执行过程不被打断. *仅适用于单核*
### Compare And Swap(CAS)
```c
int CAS(int* addr,int expected,int new_value){
    int tmp = *addr;
    if(*addr == expected)
        *addr = new_value;
    return tmp;
}
```
CAS为硬件原子操作：
- Intel锁总线实现
- ARM：采用Load Link, Store Condition
  ```asm
  retry: 
    ldxr x0,addr #ll
    cmp x0,expected
    bne out
    stxr x1,new_value,addr #sc
    cbnx x1,retry
  out:
  ```
  修改时看addr是否被修改过，若修改过则重试


### 锁实现

#### 自旋锁(Spinlock)
lock操作
```c
while(atomic_CAS(lock,0,1) != 0);
```
unlock
```c
*lock = 0;
```
- 可能出现饥饿现象
#### 排号锁(Ticket Lock)
- 保证竞争者的公平性
- 根据竞争者到达的先后顺序传递锁

**lock操作**

```c
// 拿号
my_ticket = atomic_FAA(&lock->next,1); // fetch and add 

// 等号
while(lock->owner != my_ticket);
```
**unlock操作**
```c
lock->owner++;
```
#### 读写锁
- 多个读者不互斥
- 读者与写者互斥

##### 读者优先
```c
struct rw_lock{
    int reader;
    struct lock reader_lock; // 锁住reader变量
    struct lock writer_lock;
};

void lock_reader(struct rw_lock* lock){
    lock(&lock->reader_lock);
    lock->reader++;
    if(lock->reader == 1)
        lock(&lock->writer_lock);
    unlock(&lock->reader_lock);
}

void unlock_reader(struct rw_lock* lock){
    lock(&lock->reader_lock);
    lock->reader--;
    if(lock->reader == 0)
        unlock(&lock->writer_lock);
    unlock(&lock->reader_lock);
}

void lock_writer(struct rw_lock* lock){
    lock(&lock->writer_lock);
}

void unlock_writer(struct rw_lock* lock){
    unlock(&lock->writer_lock);
}
```
- 需要一个reader_lock保护reader变量，如何提高读者性能

**Read Copy Update(RCU)**
- 减少读者进入临界区的操作，提高读者效率

硬件原子操作
1. 最大128bit
2. 锁总线，性能瓶颈

链表删除节点
![](/image/os/link%20list%20delete.png)

**局限**
- 需要将源数据复制一份，导致内存消耗
- 删除后的节点不能立即删除，因为可能有读者正在读

**RCU宽限期**
- 需要知道进入临界区和离开临界区的时间
- 当最后一个访问旧值的读者离开临界区后释放内存

### 死锁
**原因**
- 互斥访问
- 持有并等待
- 资源非抢占
- 循环等待

#### 检测死锁与回复
找到资源分配图中的环
- kill所有进程
- kill一个进程
- 全部回滚到前面状态

#### 死锁预防
1. 避免互斥访问：通过其他手段（ie:代理执行）
2. 不允许持有并等待：一次申请所有资源
    - 可能带来活锁(live lock)
    - ![](/image/os/live_lock.png)

3. 资源允许抢占：需要考虑如何恢复（取决于场景）
4. 打破循环等待

#### 死锁避免
银行家算法

## 多核与并行
**并行加速比（理论上限）**
Amdahl's Law
$$s = \frac{1}{(1-p)+p/s}$$
> $p:$可并行部分所占比例
> $s:$并行核心数

多核访问共享数据导致性能断崖

### 缓存一致性
#### MSI状态
![](/image/os/modified.png)
![](/image/os/shared.png)
![](/image/os/invalid.png)

![](/image/os/cache.png)

多cpu对单一缓存行竞争导致性能下降

**MCS lock**
- 避免多核对于单一缓存行的竞争
![](/image/os/mcs.png)

```c
struct mcs_node{
    volatile struct mcs_node* next;
    volatile int flag;
};

struct mcs_lock{
    struct mcs_node* tail;
};
__thread struct mcs_node my_node;

void lock(struct mcs_lock* lock){
    struct mcs_node* me = &my_node;
    struct mcs_node* tail = 0;
    me->next = NULL;
    me->flag = WATTING;
    tail = atomic_XCHG(&lock->tail,me);

    if(tail){
        barrier();
        tail->next = me;
        while(me->flag != GRANTED);

    }else{
        me->flag = GRANTED;
    }
    barrier();
}

void unlock(struct mcs_lock* lock){
    struct mcs_node* me = &my_node;
    barrier();
    if(!me->next){
        if(atomic_CAS(&lock->tail,me,0) == me)
            return;
        while(!me->next);
    }
    me->next->flag = GRANTED;
}
```
- unlock操作仅写一个私缓存行，不存在高度竞争的全局缓存行

在非一致内存访问(NUMA)下，在临界区访问多cache行导致性能下降

![](/image/os/numa.png)
- 跨节点的缓存一致性协议开销巨大(cpu需要访问其他节点的cache取回数据)

**NUMA-aware设计：cohort**
- 先获取每节点的本地锁，在获取全局锁
- 成功获取全局锁，释放时将其传递给**本地等待队列**的下一位
- 全局锁在一段时间内只在一个节点内部传递

### 内存模型

#### 严格一致性模型(Strict Consistency)
- 对任意地址的读操作都能读到这个地址最近一次写的数据  
- 访存操作顺序与全局时钟顺序一致  
- 有唯一的执行结果

#### 顺序一致性(Sequential Consistency)
- 不要求操作按照真实的时间顺序全局可见  
- 执行结果必须与一个全局的顺序一致
- 在调度下具有多种结果

#### TSO(Total Store Ordering)
- 对不同地址**RR**,**RW**,**WW**顺序可以保证
- **WR**的顺序不能保证


- CPU存在乱序执行  
  CPU写cache后需要执行缓存一致性算法，为了提升性能，在CPU与cache之间增加一个**Load/Store Buffer**,CPU写数据首先写入**Buffer**,之后将数据批量写入cache，减少缓存一致性算法执行次数。但是导致了写延时，所以导致**WR**的顺序不能保证
#### 弱一致性模型
- 不保证任何对不同地址的读写操作顺序  
ARM采用弱一致性模型，为了保证读写顺序，ARM提供了`barrier()`保证执行顺序。在`lock`时需要加`barrier`

# 文件与存储
## 基于inode的文件系统
- 字符/块设备文件
  - 记录设备的Major(表示设备类型)和minor(表示设备编号)号
  - 可以作为系统调用参数
- FIFO文件
  - 命名管道，用于进程通信
  - 提供一个标识符，对该文件操作都在内存中，实现了`read()`,`write()`等接口
- SOCK文件
  - UNIX域套接字，用于进程间通信
  - 通过**socket**API创建，当进程位于不同机器上时，仅需要修改少部分代码

这些方式复用了文件API，通过文件API实现不同的功能.  
> everything is a file.

## 基于Table的文件系统
### NTFS
![](/image/os/ntfs.png)

- 每个文件在MFT中保留一项，记录了文件的元数据
- 查询文件仅需变量MFT，查询速度快  eg:everything
- 文件较小时可以内嵌在MFT中


![](/image/os/filesystem.png)

![](/image/os/clone.png)
- 使用COW实现快照功能
  - 将inode复制一份作为快照
  - 标记数据块为COW

### FUSE
![](/image/os/fuse.png)
- 在用户态实现文件系统，eg：将百度网盘映射到文件系统

## 崩溃一致性
### 各种数据结构之间存在依赖关系与一致性要求
- inode中保存的文件大小，应该与其索引中保存的数据块个数相匹配- inode中保存的链接数，应与指向其的目录项个数相同
- 超级块中保存的文件系统大小，应该与文件系统所管理的空间大小相同  
- 所有inode分配表中标记为空闲的inode均未被使用;标记为已用的inode均可以通过文件系统操作访问

**系统崩溃情况下这些数据可能不一致**

### 日志
- 在文件操作之前，先将操作记录在日志中
- 所有操作记录完毕后，提交日志
- 再对文件进行操作

**问题**
- 每个操作都要写硬盘，内存缓存机制无意义
- 每个修改需要拷贝新数据到日志
- 相同块的修改被记录多次

**解决方案**
- 利用内存的页缓存：将日志保存在内存中，文件操作之前将日志写入磁盘
- 批量处理日志减少磁盘读写：将多个文件操作合并，每个修改的块仅需记录一次

**日志提交**
- 定时触发
  - 每一段时间触发一次
  - 日志达到一定数量触发一次

- 用户触发
  - 应用程序调用`fsync()`

# 系统虚拟化

- 操作系统的接口层次
  - ISA层
    - 用户ISA：用户态可执行 eg:`mov, add`
    - 系统ISA：特权态可执行 eg:`msr`
  - ABI
    - 提供操作系统服务或硬件功能
    - 包含用户ISA和syscall
  - API
    - 不同用户态库提供的接口
    - 包含库接口和用户ISA eg:`libc`

- 虚拟机监控器(VMM/Hypervisor)
  - 向上层虚拟机暴漏其所需的ISA
  - 可同时运行多台虚拟机(VM)
  - 需要VMM实现系统ISA的功能：eg：切换内核页表寄存器(TTBR1)

## 如何实现VMM

- 实现系统ISA
系统ISA设计时仅考虑只有一个人调，不允许多个人执行，要实现让多个人调用系统ISA，当运行系统ISA时，不能由硬件真正运行系统ISA

![](/image/os/trap.png)
1. 捕捉所有系统ISA并陷入(Trap)
2. 由具体指令实现相应虚拟化
   - 控制虚拟处理器行为
   - 控制虚拟内存行为
   - 控制设备行为
3. 回到虚拟机继续执行

## CPU虚拟化
![](/image/os/vis1.png)
- 将VMM运行在EL1
- 将guest操作系统和其进程运行在EL0
- 当操作系统执行ISA指令时Trap进入EL1的VMM由VMM模拟实现
- ![](/image/os/vis11.png)

x86和arm有些指令不能虚拟化(在EL0和EL1下执行效果不一样),在用户态执行被当作`NOP`指令，不会产生Trap

### 如何处理不会产生Trap的系统指令
1. 解释执行
2. 二级制翻译
3. 半虚拟化
4. 硬件虚拟化(修改硬件)

#### 1.解释执行
- 用软件对所有的虚拟机代码模拟执行
  - 不区分是否敏感指令
  - 没有虚拟机指令直接在硬件上执行
- 在内存中维护虚拟机的状态
![](/image/os/trap1.png)

pros
- 解决了敏感函数不Trap问题
- 可以模拟不同ISA的虚拟机
- 实现简单

cons
- 执行速度慢，一条指令会被模拟为多条指令

#### 2.二级制翻译
- 提出两个加速技术
  - 执行前**批量翻译**虚拟机指令
  - **缓存**已经翻译的指令
- 使用基本块(Basic Block)为翻译粒度
![](/image/os/trap2.png)

cons:
- 不能处理自修改的代码(eg:jvm)
- 中断插入粒度变大
  - 模拟执行可在任意指令位置插入中毒
  - 二进制翻译只能在Basic Block边界插入中断(执行Basic Block时VMM没有介入)

#### 3.半虚拟化
- 让VMM提供接口给虚拟机，称为**Hypercall**
- 修改guest操作系统源码，将敏感指令替换为**Hypercall**

cons
- 需要修改操作系统源码

#### 4.硬件虚拟化
- x86和arm引入了虚拟化特权级
- x86引入了**root mode**和**non-root mode**
  - intel 推出了VT-x硬件虚拟化扩展
  - **root mode**是最高特权级，控制物理资源
  - VMM运行在**root mode**,虚拟机运行在**non-root mode**
  - 两个mode内都有4个特权级：ring0-ring3

- arm引入了EL2
  - VMM运行在EL2
  - EL2是最高特权级，控制物理资源
  - VMM的操作系统和应用程序分别运行在EL1和EL0

#### VT-x
![](/image/os/trap41.png)

##### Virtual Machine Control Structure(VMCS)
- VMM提供给硬件的内存页(4KB)
  - 记录当前VM的运行状态

- VM Entry
  - 硬件自动将当前CPU中的VMM状态保存到VMCS
  - 硬件自动从VMCS中加载VM状态到CPU

- VM　Exit
  - 硬件自动将当前CPU中的VM状态保存到VMCS
  - 硬件自动从VMCS中加载VMM状态到CPU

- 包含6个部分
  - Guest-state area:发生VM exit时，CPU的状态会被硬件自动保存至该区域;发生VM Entry时，硬件自动从该区域加载状态至CPU中
  - Host-state area:发生VM exit时，硬件自动从该区域加载状态至CPU中;发生VM Entry时，CPU的状态会被自动保存至该区域
  - VM-execution control fields :控制Non-root模式中虚拟机的行为
  - VM-exit control fields :控制VM exit的行为
  - VM-entry control fields :控制VM entry的行为
  - VM-exit information fields : VM Exit的原因和相关信息（只读区域)

1. VMXON 开启VT-x
2. VMLAUNCH 进入虚拟机(加载虚拟机的状态)
3. 当遇到满足VMEXIT指令 -> VMM ring0, VMM执行该指令
4. VMRESUME 回到虚拟机

**x86修改CPU为了给VM一个新环境，arm修改虚拟机为了给VMM一个新环境**
#### ARM虚拟化
![](/image/os/armvirtual.png)
- VM Entry
  - 使用ERET指令从VMM进入VM
  - 进入VM之前VMM需要主动加载VM的运行状态(各种寄存器)

- VM Exit
  - 虚拟机执行敏感指令或收到中断
  - 以Exception、IRQ、FIQ形式回到VMM
  - VMM主动保存VM的状态

- VM Exit时VMM可以访问VM的EL0和EL1寄存器

### VM和VCPU
- VM  
  - 静态部分：内存，设备等
  - 动态部分：VCPU

- VCPU
  - 用线程模拟CPU
  - 虚拟寄存器
    - PC
    - 通用寄存器
    - ...
  - 切换VCPU时切换到其虚拟寄存器

### QEMU/KVM
- qemu运行在用户态，实现策略
  - 也提供虚拟设备支持

- KVM以linux内核模块运行，实现机制
  - 可以直接使用linux的功能(内存管理，进程调度)
  - 使用硬件虚拟化功能

- KVM捕捉所有敏感指令和事件，传递给QEMU
- KVM不提供设备虚拟化，需要使用QEMU的虚拟设备

- 1个虚拟机对应1个QEMU进程
- VM的VCPU对应QEMU的线程

- QEMU使用`/dev/kvm`与内核态的KVM通信
  - 使用ioctl向KVM传递命令：`CREATE_VM`,`CREATE_VCPU`,`KVM_RUN`...
  - 创建虚拟机所需的运行环境(memory,VCPU,...)后调用`KVM_RUN`进入**non-root mode**执行
![](/image/os/kvm.png)

```c
#include <sys/ioctl.h>
#include <linux/kvm.h>

  int fd = open("/dev/kvm");
  ioctl(fd,KVM_CREATE_VM);
  ioctl(fd,KVM_CREATE_VCPU);
  while(1){
    ioctl(fd,KVM_RUN); // 进入内核 -> 返回到VM
    // VM执行到敏感指令 -> trap kernel -> KVM [-> qemu]
    reason = get_exit_reason();
    switch(reason){
      case ...

    }
  }
```

#### ioctl(fd,KVM_RUN)
- ARM
  - KVM主动加载VCPU的所有状态
  - 使用`eret`进入VM

- x86
  - KVM找到VCPU对应的VMCS
  - 使用指令加载VMCS
  - `VMLAUNCH`/`VMRESUME`进入**non-root node**
    - 硬件自动同步状态
    - PC = VMCS->GUEST_RIP

#### IO处理流程


![](/image/os/kvmio.png)

## 内存虚拟化
- 为虚拟机提供虚拟的物理地址空间

- 三种地址
  - Guest Virtual Address(GVA)
    - 虚拟机内进程使用的虚拟地址
  - Guest Physical Address(GPA)
    - 虚拟机内使用的假物理地址
  - Host Physical Address(HPA)
    - 真实的物理地址
    - GPA需要翻译为HPA

- 实现内存虚拟化
  - 影子页表(Shadow Page Table):为每个进程提供一个`GVA->HPA`的页表
  - 直接页表(Direct Page Table):告诉VM运行在虚拟机中
  - 硬件虚拟化

### 硬件虚拟化

- Intel Extended Page Table(EPT)
- ARM Stage-2 Page Table(第二阶段页表)
- 新页表
  - 将GPA翻译为HPA
  - 被VMM控制
  - 每个VM有一个对应页表

#### 翻译过程
![](/image/os/step2.png)
- Guest Page Table 中保存 GPA
- Host Page Table 中保存 HPA
- 共24次访存

#### TLB刷新
- 刷TLB相关指令
  - 清空全部 `TLBI VMALLS12E1IS`
  - 清空指定GVA `TLBI VAE1IS`
  - 情况指定GPA `TLBI IPAS2E1IS`
#### 如何处理缺页异常
- 第一阶段缺页异常
  - 调用VM的Page fault handler
  - 不会引起VM **Trap**
- 第二阶段缺页异常
  - VM Trap，直接调用VMM的Page fault handler

pros：
- 不需要捕捉Guest Page Table的更新
- 减少内存开销：每个VM对应一个页表

cons：
- TLB miss时性能开销大

## IO虚拟化
- 为VM提供虚拟设备
- 隔离不同VM对设备的访问
- 提高物理设备的利用率

### 如何实现IO虚拟化
- 设备模拟
- 半虚拟化
- 设备直通

#### 设备模拟
- OS与设备交互的接口
  - 模拟寄存器(中断)
  - 捕捉MMIO,PIO指令

- 软件模拟方式
  - 将PIO指令替换为系统调用
  - MMIO对应内存的第二阶段页表设为invalid(Trap)

- 硬件虚拟化方式
  - 硬件捕捉PIO指令
  - MMIO对应内存的第二阶段页表设为invalid

![](/image/os/netemu1.png)
![](/image/os/netemu2.png)

#### 半虚拟化
- VM知道自己运行在虚拟环境
- VM运行**front-end**
- VMM运行**back-end**
- VMM给VM提供**Hypercall**
- 通过共享内存传递指令和数据

![](/image/os/netemu3.png)
- **back-end**可以在内核中实现

![](/image/os/netemu4.png)

pros:
- 多个MMIO/PIO指令可以整合为一次Hypercall

cons:
- 需要修改操作系统内核

#### 设备直通
- 由于网卡直接访问**HPA**,可能造成恶意读写
- 让网卡访问**GPA**,VM只能访问自己的内存

**增加IOMMU**

![](/image/os/iommu.png)

![](/image/os/iommu2.png)

**设备独占问题**

- single root i/o virtualization
  - 在物理层实现设备虚拟化
  - 能够创建多个Virtual Function(VF),每个VM分配一个VF
  - 物理设备称为Physical Function(PF),由Host管理
  
  - 需要特定硬件(IOMMU等)支持

## 中断虚拟化

- VMM完成IO操作(DMA)后通知VM
- VMM在`VM ENTRY`时插入中断

### virtual CPU interface

- GIC为VM提供硬件功能
  - VM通过virtual CPU interface与GIC交互
  - VMM通过physical CPU interface与GIC交互

- 插入中断
- 通过**GIC List Register**插入中断号

![](/image/os/int.png)
- v4中，VMM需要通知GIC当前的调度信息，GIC才能将中断插入正确的CPU

## 轻量级虚拟化
### Fass(Function as a service) and Serverless
- 现有方案：虚拟机
  - Function执行时创建虚拟机
  - Function执行完销毁虚拟机

- 过于重量级，启动延时高

- 不用虚拟化方案
  - window server允许多个用户同时访问远程桌面
  - 缺点：缺少文件隔离

**chroot**

- 为每个执行环境提供独立的文件系统视图
- 改变进程的根目录

简单实现
- 内核为每个用户保存其根目录
- 注意检查`../`

### 基于namespace的限制

- 通过文件系统的namespace限制用户

- 可以在其他层(inode number)限制用户

问题
- 如何共享部分文件(`ls`)

## linux容器
- 由linux内核提供资源隔离
- 安全隔离：`linux namespace`
- 性能隔离：`linux cgroup`

### linux namespace
- 每种**linux namespace**封装一种全局资源

1. mount namespace

- 在内核分别记录每个NS对于挂载点的修改
- 访问挂载点时，根据当前NS的记录访问文件


- 每个NS有独立的NS文件系统树
- 修改挂载点只会修改自己的NS树

- 实现了文件的共享

2. IPC namespace

- 每个IPC对象只能属于一个NS
- 进程只能在当前NS中寻找IPC对象

3. network namespace

linux 对多IP的支持
- 内核中创建一个虚拟交换机
- VM的网卡连接到交换机上

Linux namespace

- 每个NS拥有一套独立的网络资源(ip,网络设备)
- 新的NS默认仅有loopback设备
- NS中的网卡连接到虚拟交换机上

- 通过ARP协议将多个ip与物理网卡MAC地址绑定，实现收多个ip的数据包

4. PID namespace
- 每个namespace只能看到自己namespace得到PID
- parent NS可以看到child NS的PID，反之不行
- 子NS中进程在父NS中也有PID
- 子NS中进程无法向外部发送信号

5. user namespace

- 隔离用户权限
- 对NS内外UID和GID映射
- 每个NS都有UID为0的root用户，映射为外部的其他UID，在NS外部无root权限

6. UTS namespace

- 每个NS拥有自己的hostname

7. Cgroup(control group) namespace
- 实现资源隔离
- 将线程分组，对每组线程多种物理资源监控

# 网络协议栈

## linux收包过程

![](/image/os/linuxnet.png)

1. DMA将数据传送到内核RX缓冲区
2. 触发中断
3. cpu收到中断,触发中断处理程序(上半部)
  - 分配`sk_buff`数据结构，将数据帧copy到接收队列
  - 发出**NET_RX_SOFTIRQ**软中断，通知内核接收到数据帧

4. 内核在合适的时机(返回用户态之前)检查softirq队列并处理软中断(进入下半部)
5. 将接收队列的数据帧copy到`sk_buff`缓冲区中
6. 根据数据包的类型，调用对应的协议处理函数
  - TCP会将数据copy到socket的**Recv-Q**,唤醒等待在socket上的线程
  - 用户调用`recv(buff)`将数据copy到用户态

# 操作系统调试
- 中断程序运行读取内部状态
- 获取程序异常退出原因
- 动态修改程序状态
- 控制追踪流

## linux调试支持：ptrace系统调用
1. 子进程通过`PTRACE_TRACEME`将调试权交给父进程，父进程可以读取，修改子进程的状态
2. 通过`PTRACE_ATTACH`调试指定进程


**GDB捕捉异常信号**

GDB等待子进程事件，子进程发生时间后会通知父进程
   - `PTRACE_GETSIGINFO`获取被调试进程signal
   - `PTRACE_GETREGS`获取被调试进程的RIP

**断点**

- 断点异常指令
  - 在执行到特定指令时，触发断点异常陷入内核
  - x86: `int 3`, AARCH64: `BKP`

- 单步调试
  - 在用户态执行一条指令后立即陷入内核
  - x86 Trap flag

1. `PTRACE_POKETEXT`修改进程代码为断点指令
2. 子进程执行到断点，触发断点异常，产生`SIGTRAP`signal并通知GDB

**内存断点**
- 基本实现
  - 将内存地址所在页设为只读
  - 访问时触发page fault
  - 对该页所有的写操作均导致page fault

- 断点寄存器
  - 当访存地址为寄存器中的值时，触发断点异常

**远程调试**

![](/image/os/remotedebug.png)

- GDB客户端负责指令发送
  - GDB远端串行协议(GDB remote serial protocol,RSP)

- GDB stub 控制调试应用

## 性能调试

### 确定内核执行中耗时较长的函数
  
**硬件计数器**
- 监控程序执行过程中处理器发生某些事件的次数
  - e.g., 执行指令数量，缓存失效次数

- 方法1：获取事件发生次数
  - 设置事件类型，打开计数器
  - 一段时间后读取计数器
  - 缺点：可能涉及对源代码修改(插桩)

- 方法2：采样
  - 设置事件类型，打开计数器
  - 当计数器溢出时，产生中断
    - 在中断处理中获取地址信息
    - 清空计数器，等待下一次中断
  - 每经过一定cycle触发一次中断，统计中断时指令地址，获取这些地址属于哪些函数

#### linux 性能计数器采样支持

- 性能相关事件 perf events
  - 以event的抽象暴露性能计数器
  - perf_event_open通知内核需要使用哪些计数器
  - 采样过程有内核完成
  - 采样结果放入内核与用户共享内存中

- 前端工具perf
  - perf工具包包装常见的性能分析方法
  - `perf record -e cycles <app>`
  - `perf report`

#### 基于中断采样的缺点
- 采样获取的指令地址不准确
  - 中断发送需要时间，CPU收到中断时的指令地址可能有偏移
  - 乱序执行

### 控制流追踪

- 软件方法backtrace追踪
  - 问题：编译器优化去除栈帧

- 硬件的控制流追踪
  - 记录jmp、call、中断导致跳转的前后位置
  - e.g.Last Branch Record(intel)
    - 两组寄存器分别构成栈，记录最近N次跳转信息

  - `perf record -e cycles -g <app>`
  - `perf report`

### 静态追踪方法
- 在代码编写时插桩
  - 打印

- 预置静态追踪函数
  - e.g.,linux Tracepoint

- 缺点
  - 修改跟踪点需要重新编译
  - 有些函数没有tracepoint
### 动态追踪方法
- 程序运行时，在不确定的代码位置插入一段动态指定的追踪函数
- e.g.,linux kprobe，类似于断点调试

1. 使用断点指令替换原指令
2. 执行时产生异常
3. 调用handler
4. 恢复原指令，单步调试
5. 重新设置断点指令，返回继续执行

```c
ssize_t vfs_read(struct file* file,char *buff,size_t count,loff_t*pos); 
```
- 检查count的大小  
  `perf probe --add 'vfs_read count=%dx:u64'`