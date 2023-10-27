---
title: 杂记
tag: [杂记,linux]
---

# linux

## 信号
- 关闭终端进程退出
  - 关闭终端时，虚拟终端进程给bash发送sighup， bash给所有子进程转发sighup
  - 用 & 运行程序，然后ctrl+D退出终端，让bash读到EOF退出
- 信号处理
  - 将信号加入`task_struct`的信号队列中
  - 从内核态返回时检查队列
  - 需要在用户态执行信号处理程序
    - 将进程的`rip`设为信号处理函数地址
    - 在用户态栈设置栈帧，将返回地址设为`sigreturn()`系统调用
    - `sigreturn()`恢复进程的执行状态
- shell信号处理
    ![](/image/recipes/process-groups-sessions.png)

## io_uring
- 在用户态和内核态采用共享内存的无锁环形队列交换数据
- 生产者仅修改队尾指针，消费者仅修改队头指针，不会相互阻塞
- 队列仅设计用于单生产者单消费者，用户态对队列并发访问，需要手动保证同步（锁/原子指令）
- 内存屏障与顺序性
  - 修改队列状态时，必须保证对队列元素的写入已经完成：compiler barrier
  - 读取队列状态时，需要获取到最新写入的值。需要使用read barrier保证之前的写入都能被读到，刷新缓存
- poll模式
  - 可以通过内核线程同时轮询任务提交队列和设备驱动


# 并发
## 多处理器
- 原子性丧失
- 顺序写丧失
  - 按照单线程优化代码
  - 保证对内存的最终一致性
  - 实现源代码按顺序翻译
    - `asm volatile ("":::"memory");`,内存此时可能会被修改
    - 使用`volatile`变量
- 可见性丧失
  - cpu把所有指令翻译为更小的$\mu$ops
  - fetch -> issue -> execuate -> commit
  - 维护$\mu$ops的有向无环图
  - 每个周期取出多条$\mu$ops同时执行
  - `mfence`将cpu的write buffer写入共享内存

  - **内存序用于限制cpu对指令的重排程度，防止单线程指令在多线程下出现错误**
  - c++内存模型
    - `memory_order_seq_cst`
      - `atomic`操作默认参数，要求底层提供顺序一致性模型，不存在指令重排
    - `memory_order_release/acquire/consume`
      - 允许cpu或编译器做一定的指令重排，可能产生**wr**,**ww**乱序，需要手动使用`release`和`acquire`避免问题
    - `memory_order_relaxed`
      - 允许任何重排
    - `memory_order_release`: store operation
      - 保证本行代码之前，任何对内存的读写操作，不能放到本行后面执行
    - `memory_order_acquire` : load operation
      - 保证在本行代码之后，任何对内存的读写操作，不能放到本行之前
    - compiler barrier
      - `asm volatile("": : :"memory");`
      -  `std::atomic_thread_fence(std::memory_order_acquire);`
    - cpu fence：StoreLoad需要
      - `asm volatile("mfence" ::: "memory");`
      - `asm volatile("lock; addl $0,0(%%rsp)" ::: "memory", "cc");`

## 互斥
- 困难
  - 不能同时读/写共享内存
- x64 `lock` 前缀
  - 所有`lock`指令全序关系
  - `lock`指令之前的内存写入都可见
  - 486：锁总线
  - 对cache line加锁
- 自旋锁
  - 触发cpu之间的缓存同步，增加延迟
  - 利用率低
  - Scalability差
  - 获得自旋锁的线程可能被操作系统切换出去
  - 用于临界区几乎不拥堵，操作系统内核的并发数据结构
- 互斥锁
  - 把锁放到操作系统中
  - 加锁失败，切换到其他线程

- Futex = Spin + Mutex
  - 先在用户空间自旋
  - 如果获得锁，直接进入
  - 未能获得锁，系统调用
  - 解锁以后也需要系统调用
    - 优化：仅当出现锁拥堵时，进入内核

## 同步
- 线程同步：**在某个时间点共同达到互相已知的状态**

- 条件变量
  - 等待某个条件成立
  - 把自旋变为睡眠
  - 生产者消费者
    - 2个条件变量，防止同类唤醒/notify_all()
  - 面试题
    有三种线程，分别打印 <, >, 和 _ 对这些线程进行同步，使得打印出的序列总是 <><_ 和 ><>_ 组合
    - 考虑打印每种字符的条件(状态机)

- 信号量
  - 带计数器的互斥锁

- 哲学家吃饭问题
  - 通用的解决方法
    - 使用条件变量等待两个叉子同时可用（分布式同步）
    - 生产者/消费者：集中式管理（集中式同步）
      - 分布式系统常用解决思路

- 考虑workload，再优化

# BUG
- 防御性编程：assert

## 死锁
- AA-Deadlock
  - spinlock时发生中断
  - 在不该打开中断时打开中断
  - 在不该切换时执行了yield()
- ABBA-Deadlock
  cpp
  void swap(int i, int j) {
    spin_lock(&lock[i]);
    spin_lock(&lock[j]);
    arr[i] = NULL;
    arr[j] = arr[i];
    spin_unlock(&lock[j]);
    spin_unlock(&lock[i]);
  }
  ```
  swap(1,2);swap(2,3);swap(3,1)

### 避免死锁
- AA-Deadlock
  - 防御性编程
  - `if (holding(lk)) panic();`
- ABBA-Deadlock
  - 严格按照固定的顺序获得所有锁 (lock ordering; 消除 “循环等待”)

## 应对

- Lockdep: 运行时的死锁检查
  - 为每一个锁确定唯一的 “allocation site”
  - assert: 同一个 allocation site 的锁存在全局唯一的上锁顺序
  - 动态维护一个图结构

- ThreadSanitizer: 运行时的数据竞争检查
  - 为所有事件建立 happens-before 关系图
  - 如果两个写操作之间没有路径 -> 数据竞争

- 动态程序分析：Sanitizers
  - [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) :非法内存访问 
    - Buffer (heap/stack/global) overflow, use-after-free, use-after-return, double-free, ...
  - [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html):数据竞争
  - [MemorySanitizer](https://clang.llvm.org/docs/MemorySanitizer.html): 未初始化的读取
  - [UBSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html): undefined behavior