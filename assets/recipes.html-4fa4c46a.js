import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{r as s,o,c as t,a as l,b as i,d as a,f as r}from"./app-6f6f0afa.js";const d="/blog/image/recipes/process-groups-sessions.png",c={},u=r('<h1 id="linux" tabindex="-1"><a class="header-anchor" href="#linux" aria-hidden="true">#</a> linux</h1><h2 id="信号" tabindex="-1"><a class="header-anchor" href="#信号" aria-hidden="true">#</a> 信号</h2><ul><li>关闭终端进程退出 <ul><li>关闭终端时，虚拟终端进程给bash发送sighup， bash给所有子进程转发sighup</li><li>用 &amp; 运行程序，然后ctrl+D退出终端，让bash读到EOF退出</li></ul></li><li>信号处理 <ul><li>将信号加入<code>task_struct</code>的信号队列中</li><li>从内核态返回时检查队列</li><li>需要在用户态执行信号处理程序 <ul><li>将进程的<code>rip</code>设为信号处理函数地址</li><li>在用户态栈设置栈帧，将返回地址设为<code>sigreturn()</code>系统调用</li><li><code>sigreturn()</code>恢复进程的执行状态</li></ul></li></ul></li><li>shell信号处理<br><img src="'+d+'" alt="" loading="lazy"></li></ul><h2 id="io-uring" tabindex="-1"><a class="header-anchor" href="#io-uring" aria-hidden="true">#</a> io_uring</h2><ul><li>在用户态和内核态采用共享内存的无锁环形队列交换数据</li><li>生产者仅修改队尾指针，消费者仅修改队头指针，不会相互阻塞</li><li>队列仅设计用于单生产者单消费者，用户态对队列并发访问，需要手动保证同步（锁/原子指令）</li><li>内存屏障与顺序性 <ul><li>修改队列状态时，必须保证对队列元素的写入已经完成：compiler barrier</li><li>读取队列状态时，需要获取到最新写入的值。需要使用read barrier保证之前的写入都能被读到，刷新缓存</li></ul></li><li>poll模式 <ul><li>可以通过内核线程同时轮询任务提交队列和设备驱动</li></ul></li></ul><h1 id="并发" tabindex="-1"><a class="header-anchor" href="#并发" aria-hidden="true">#</a> 并发</h1><h2 id="多处理器" tabindex="-1"><a class="header-anchor" href="#多处理器" aria-hidden="true">#</a> 多处理器</h2>',7),h=r("<li>原子性丧失</li><li>顺序写丧失 <ul><li>按照单线程优化代码</li><li>保证对内存的最终一致性</li><li>实现源代码按顺序翻译 <ul><li><code>asm volatile (&quot;&quot;:::&quot;memory&quot;);</code>,内存此时可能会被修改</li><li>使用<code>volatile</code>变量</li></ul></li></ul></li>",2),m={class:"MathJax",jax:"SVG",style:{position:"relative"}},p={style:{"vertical-align":"-0.489ex"},xmlns:"http://www.w3.org/2000/svg",width:"1.364ex",height:"1.489ex",role:"img",focusable:"false",viewBox:"0 -442 603 658","aria-hidden":"true"},_=l("g",{stroke:"currentColor",fill:"currentColor","stroke-width":"0",transform:"scale(1,-1)"},[l("g",{"data-mml-node":"math"},[l("g",{"data-mml-node":"mi"},[l("path",{"data-c":"1D707",d:"M58 -216Q44 -216 34 -208T23 -186Q23 -176 96 116T173 414Q186 442 219 442Q231 441 239 435T249 423T251 413Q251 401 220 279T187 142Q185 131 185 107V99Q185 26 252 26Q261 26 270 27T287 31T302 38T315 45T327 55T338 65T348 77T356 88T365 100L372 110L408 253Q444 395 448 404Q461 431 491 431Q504 431 512 424T523 412T525 402L449 84Q448 79 448 68Q448 43 455 35T476 26Q485 27 496 35Q517 55 537 131Q543 151 547 152Q549 153 557 153H561Q580 153 580 144Q580 138 575 117T555 63T523 13Q510 0 491 -8Q483 -10 467 -10Q446 -10 429 -4T402 11T385 29T376 44T374 51L368 45Q362 39 350 30T324 12T288 -4T246 -11Q199 -11 153 12L129 -85Q108 -167 104 -180T92 -202Q76 -216 58 -216Z"})])])],-1),T=[_],Q=l("mjx-assistive-mml",{unselectable:"on",display:"inline"},[l("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[l("mi",null,"μ")])],-1),g=l("li",null,[l("p",null,"fetch -> issue -> execuate -> commit")],-1),f={class:"MathJax",jax:"SVG",style:{position:"relative"}},x={style:{"vertical-align":"-0.489ex"},xmlns:"http://www.w3.org/2000/svg",width:"1.364ex",height:"1.489ex",role:"img",focusable:"false",viewBox:"0 -442 603 658","aria-hidden":"true"},b=l("g",{stroke:"currentColor",fill:"currentColor","stroke-width":"0",transform:"scale(1,-1)"},[l("g",{"data-mml-node":"math"},[l("g",{"data-mml-node":"mi"},[l("path",{"data-c":"1D707",d:"M58 -216Q44 -216 34 -208T23 -186Q23 -176 96 116T173 414Q186 442 219 442Q231 441 239 435T249 423T251 413Q251 401 220 279T187 142Q185 131 185 107V99Q185 26 252 26Q261 26 270 27T287 31T302 38T315 45T327 55T338 65T348 77T356 88T365 100L372 110L408 253Q444 395 448 404Q461 431 491 431Q504 431 512 424T523 412T525 402L449 84Q448 79 448 68Q448 43 455 35T476 26Q485 27 496 35Q517 55 537 131Q543 151 547 152Q549 153 557 153H561Q580 153 580 144Q580 138 575 117T555 63T523 13Q510 0 491 -8Q483 -10 467 -10Q446 -10 429 -4T402 11T385 29T376 44T374 51L368 45Q362 39 350 30T324 12T288 -4T246 -11Q199 -11 153 12L129 -85Q108 -167 104 -180T92 -202Q76 -216 58 -216Z"})])])],-1),w=[b],v=l("mjx-assistive-mml",{unselectable:"on",display:"inline"},[l("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[l("mi",null,"μ")])],-1),k={class:"MathJax",jax:"SVG",style:{position:"relative"}},y={style:{"vertical-align":"-0.489ex"},xmlns:"http://www.w3.org/2000/svg",width:"1.364ex",height:"1.489ex",role:"img",focusable:"false",viewBox:"0 -442 603 658","aria-hidden":"true"},L=l("g",{stroke:"currentColor",fill:"currentColor","stroke-width":"0",transform:"scale(1,-1)"},[l("g",{"data-mml-node":"math"},[l("g",{"data-mml-node":"mi"},[l("path",{"data-c":"1D707",d:"M58 -216Q44 -216 34 -208T23 -186Q23 -176 96 116T173 414Q186 442 219 442Q231 441 239 435T249 423T251 413Q251 401 220 279T187 142Q185 131 185 107V99Q185 26 252 26Q261 26 270 27T287 31T302 38T315 45T327 55T338 65T348 77T356 88T365 100L372 110L408 253Q444 395 448 404Q461 431 491 431Q504 431 512 424T523 412T525 402L449 84Q448 79 448 68Q448 43 455 35T476 26Q485 27 496 35Q517 55 537 131Q543 151 547 152Q549 153 557 153H561Q580 153 580 144Q580 138 575 117T555 63T523 13Q510 0 491 -8Q483 -10 467 -10Q446 -10 429 -4T402 11T385 29T376 44T374 51L368 45Q362 39 350 30T324 12T288 -4T246 -11Q199 -11 153 12L129 -85Q108 -167 104 -180T92 -202Q76 -216 58 -216Z"})])])],-1),q=[L],M=l("mjx-assistive-mml",{unselectable:"on",display:"inline"},[l("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[l("mi",null,"μ")])],-1),S=r("<li><p><code>mfence</code>将cpu的write buffer写入共享内存</p></li><li><p><strong>内存序用于限制cpu对指令的重排程度，防止单线程指令在多线程下出现错误</strong></p></li><li><p>c++内存模型</p><ul><li><code>memory_order_seq_cst</code><ul><li><code>atomic</code>操作默认参数，要求底层提供顺序一致性模型，不存在指令重排</li></ul></li><li><code>memory_order_release/acquire/consume</code><ul><li>允许cpu或编译器做一定的指令重排，可能产生<strong>wr</strong>,<strong>ww</strong>乱序，需要手动使用<code>release</code>和<code>acquire</code>避免问题</li></ul></li><li><code>memory_order_relaxed</code><ul><li>允许任何重排</li></ul></li><li><code>memory_order_release</code>: store operation <ul><li>保证本行代码之前，任何对内存的读写操作，不能放到本行后面执行</li></ul></li><li><code>memory_order_acquire</code> : load operation <ul><li>保证在本行代码之后，任何对内存的读写操作，不能放到本行之前</li></ul></li><li>compiler barrier <ul><li><code>asm volatile(&quot;&quot;: : :&quot;memory&quot;);</code></li><li><code>std::atomic_thread_fence(std::memory_order_acquire);</code></li></ul></li><li>cpu fence：StoreLoad需要 <ul><li><code>asm volatile(&quot;mfence&quot; ::: &quot;memory&quot;);</code></li><li><code>asm volatile(&quot;lock; addl $0,0(%%rsp)&quot; ::: &quot;memory&quot;, &quot;cc&quot;);</code></li></ul></li></ul></li>",3),B=r(`<h2 id="互斥" tabindex="-1"><a class="header-anchor" href="#互斥" aria-hidden="true">#</a> 互斥</h2><ul><li><p>困难</p><ul><li>不能同时读/写共享内存</li></ul></li><li><p>x64 <code>lock</code> 前缀</p><ul><li>所有<code>lock</code>指令全序关系</li><li><code>lock</code>指令之前的内存写入都可见</li><li>486：锁总线</li><li>对cache line加锁</li></ul></li><li><p>自旋锁</p><ul><li>触发cpu之间的缓存同步，增加延迟</li><li>利用率低</li><li>Scalability差</li><li>获得自旋锁的线程可能被操作系统切换出去</li><li>用于临界区几乎不拥堵，操作系统内核的并发数据结构</li></ul></li><li><p>互斥锁</p><ul><li>把锁放到操作系统中</li><li>加锁失败，切换到其他线程</li></ul></li><li><p>Futex = Spin + Mutex</p><ul><li>先在用户空间自旋</li><li>如果获得锁，直接进入</li><li>未能获得锁，系统调用</li><li>解锁以后也需要系统调用 <ul><li>优化：仅当出现锁拥堵时，进入内核</li></ul></li></ul></li></ul><h2 id="同步" tabindex="-1"><a class="header-anchor" href="#同步" aria-hidden="true">#</a> 同步</h2><ul><li><p>线程同步：<strong>在某个时间点共同达到互相已知的状态</strong></p></li><li><p>条件变量</p><ul><li>等待某个条件成立</li><li>把自旋变为睡眠</li><li>生产者消费者 <ul><li>2个条件变量，防止同类唤醒/notify_all()</li></ul></li><li>面试题<br> 有三种线程，分别打印 &lt;, &gt;, 和 _ 对这些线程进行同步，使得打印出的序列总是 &lt;&gt;&lt;_ 和 &gt;&lt;&gt;_ 组合 <ul><li>考虑打印每种字符的条件(状态机)</li></ul></li></ul></li><li><p>信号量</p><ul><li>带计数器的互斥锁</li></ul></li><li><p>哲学家吃饭问题</p><ul><li>通用的解决方法 <ul><li>使用条件变量等待两个叉子同时可用（分布式同步）</li><li>生产者/消费者：集中式管理（集中式同步） <ul><li>分布式系统常用解决思路</li></ul></li></ul></li></ul></li><li><p>考虑workload，再优化</p></li></ul><h1 id="bug" tabindex="-1"><a class="header-anchor" href="#bug" aria-hidden="true">#</a> BUG</h1><ul><li>防御性编程：assert</li></ul><h2 id="死锁" tabindex="-1"><a class="header-anchor" href="#死锁" aria-hidden="true">#</a> 死锁</h2><ul><li>AA-Deadlock <ul><li>spinlock时发生中断</li><li>在不该打开中断时打开中断</li><li>在不该切换时执行了yield()</li></ul></li><li>ABBA-Deadlock<br> cpp<br> void swap(int i, int j) {<br> spin_lock(&amp;lock[i]);<br> spin_lock(&amp;lock[j]);<br> arr[i] = NULL;<br> arr[j] = arr[i];<br> spin_unlock(&amp;lock[j]);<br> spin_unlock(&amp;lock[i]);<br> }<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>swap(1,2);swap(2,3);swap(3,1)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h3 id="避免死锁" tabindex="-1"><a class="header-anchor" href="#避免死锁" aria-hidden="true">#</a> 避免死锁</h3><ul><li>AA-Deadlock <ul><li>防御性编程</li><li><code>if (holding(lk)) panic();</code></li></ul></li><li>ABBA-Deadlock <ul><li>严格按照固定的顺序获得所有锁 (lock ordering; 消除 “循环等待”)</li></ul></li></ul><h2 id="应对" tabindex="-1"><a class="header-anchor" href="#应对" aria-hidden="true">#</a> 应对</h2>`,11),j=l("li",null,[l("p",null,"Lockdep: 运行时的死锁检查"),l("ul",null,[l("li",null,"为每一个锁确定唯一的 “allocation site”"),l("li",null,"assert: 同一个 allocation site 的锁存在全局唯一的上锁顺序"),l("li",null,"动态维护一个图结构")])],-1),z=l("li",null,[l("p",null,"ThreadSanitizer: 运行时的数据竞争检查"),l("ul",null,[l("li",null,"为所有事件建立 happens-before 关系图"),l("li",null,"如果两个写操作之间没有路径 -> 数据竞争")])],-1),A=l("p",null,"动态程序分析：Sanitizers",-1),V={href:"https://clang.llvm.org/docs/AddressSanitizer.html",target:"_blank",rel:"noopener noreferrer"},D=l("ul",null,[l("li",null,"Buffer (heap/stack/global) overflow, use-after-free, use-after-return, double-free, ...")],-1),C={href:"https://clang.llvm.org/docs/ThreadSanitizer.html",target:"_blank",rel:"noopener noreferrer"},N={href:"https://clang.llvm.org/docs/MemorySanitizer.html",target:"_blank",rel:"noopener noreferrer"},E={href:"https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html",target:"_blank",rel:"noopener noreferrer"};function G(U,H){const e=s("ExternalLinkIcon");return o(),t("div",null,[u,l("ul",null,[h,l("li",null,[i("可见性丧失 "),l("ul",null,[l("li",null,[l("p",null,[i("cpu把所有指令翻译为更小的"),l("mjx-container",m,[(o(),t("svg",p,T)),Q]),i("ops")])]),g,l("li",null,[l("p",null,[i("维护"),l("mjx-container",f,[(o(),t("svg",x,w)),v]),i("ops的有向无环图")])]),l("li",null,[l("p",null,[i("每个周期取出多条"),l("mjx-container",k,[(o(),t("svg",y,q)),M]),i("ops同时执行")])]),S])])]),B,l("ul",null,[j,z,l("li",null,[A,l("ul",null,[l("li",null,[l("a",V,[i("AddressSanitizer"),a(e)]),i(" :非法内存访问 "),D]),l("li",null,[l("a",C,[i("ThreadSanitizer"),a(e)]),i(":数据竞争")]),l("li",null,[l("a",N,[i("MemorySanitizer"),a(e)]),i(": 未初始化的读取")]),l("li",null,[l("a",E,[i("UBSanitizer"),a(e)]),i(": undefined behavior")])])])])])}const F=n(c,[["render",G],["__file","recipes.html.vue"]]);export{F as default};