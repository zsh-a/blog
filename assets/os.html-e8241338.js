const l=JSON.parse('{"key":"v-08b83e40","path":"/posts/os.html","title":"os","lang":"zh-CN","frontmatter":{"title":"os","tag":["os"],"description":"内存管理 分页虚拟内存 TLB刷新 AARCH64内核和应用程序使用不同页表 页表地址分别存放在TTBR0_EL1和TTBR1_EL1 系统调用无需切换页表 x86_64唯一页表基址存放在CR3 将内核映射到高地址 避免系统调用TLB刷新开销 如何降低TLB刷新开销 为不同的页表打上标签 TLB缓存项都有标签，切换页表不需要刷新TLB x86_64:PCID PCID存储在CR3的低12位 AARCH64:ASID OS为不同进程分配8/16位ASID,将ASID存在TTBR0_EL1的高8/16位","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/os.html"}],["meta",{"property":"og:site_name","content":"博客演示"}],["meta",{"property":"og:title","content":"os"}],["meta",{"property":"og:description","content":"内存管理 分页虚拟内存 TLB刷新 AARCH64内核和应用程序使用不同页表 页表地址分别存放在TTBR0_EL1和TTBR1_EL1 系统调用无需切换页表 x86_64唯一页表基址存放在CR3 将内核映射到高地址 避免系统调用TLB刷新开销 如何降低TLB刷新开销 为不同的页表打上标签 TLB缓存项都有标签，切换页表不需要刷新TLB x86_64:PCID PCID存储在CR3的低12位 AARCH64:ASID OS为不同进程分配8/16位ASID,将ASID存在TTBR0_EL1的高8/16位"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-10-27T16:51:03.000Z"}],["meta",{"property":"article:author","content":"Mr.Hope"}],["meta",{"property":"article:tag","content":"os"}],["meta",{"property":"article:modified_time","content":"2023-10-27T16:51:03.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"os\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-10-27T16:51:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Hope\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"分页虚拟内存","slug":"分页虚拟内存","link":"#分页虚拟内存","children":[{"level":3,"title":"TLB刷新","slug":"tlb刷新","link":"#tlb刷新","children":[]},{"level":3,"title":"如何降低TLB刷新开销","slug":"如何降低tlb刷新开销","link":"#如何降低tlb刷新开销","children":[]},{"level":3,"title":"TLB与多核","slug":"tlb与多核","link":"#tlb与多核","children":[]}]},{"level":2,"title":"纤程","slug":"纤程","link":"#纤程","children":[{"level":3,"title":"Linux纤程支持 : ucontext","slug":"linux纤程支持-ucontext","link":"#linux纤程支持-ucontext","children":[]}]},{"level":2,"title":"共享内存","slug":"共享内存","link":"#共享内存","children":[]},{"level":2,"title":"消息传递","slug":"消息传递","link":"#消息传递","children":[]},{"level":2,"title":"解决临界区问题的三个要求","slug":"解决临界区问题的三个要求","link":"#解决临界区问题的三个要求","children":[]},{"level":2,"title":"互斥访问实现","slug":"互斥访问实现","link":"#互斥访问实现","children":[{"level":3,"title":"Compare And Swap(CAS)","slug":"compare-and-swap-cas","link":"#compare-and-swap-cas","children":[]},{"level":3,"title":"锁实现","slug":"锁实现","link":"#锁实现","children":[]},{"level":3,"title":"死锁","slug":"死锁","link":"#死锁","children":[]}]},{"level":2,"title":"多核与并行","slug":"多核与并行","link":"#多核与并行","children":[{"level":3,"title":"缓存一致性","slug":"缓存一致性","link":"#缓存一致性","children":[]},{"level":3,"title":"内存模型","slug":"内存模型","link":"#内存模型","children":[]}]},{"level":2,"title":"基于inode的文件系统","slug":"基于inode的文件系统","link":"#基于inode的文件系统","children":[]},{"level":2,"title":"基于Table的文件系统","slug":"基于table的文件系统","link":"#基于table的文件系统","children":[{"level":3,"title":"NTFS","slug":"ntfs","link":"#ntfs","children":[]},{"level":3,"title":"FUSE","slug":"fuse","link":"#fuse","children":[]}]},{"level":2,"title":"崩溃一致性","slug":"崩溃一致性","link":"#崩溃一致性","children":[{"level":3,"title":"各种数据结构之间存在依赖关系与一致性要求","slug":"各种数据结构之间存在依赖关系与一致性要求","link":"#各种数据结构之间存在依赖关系与一致性要求","children":[]},{"level":3,"title":"日志","slug":"日志","link":"#日志","children":[]}]},{"level":2,"title":"如何实现VMM","slug":"如何实现vmm","link":"#如何实现vmm","children":[]},{"level":2,"title":"CPU虚拟化","slug":"cpu虚拟化","link":"#cpu虚拟化","children":[{"level":3,"title":"如何处理不会产生Trap的系统指令","slug":"如何处理不会产生trap的系统指令","link":"#如何处理不会产生trap的系统指令","children":[]},{"level":3,"title":"VM和VCPU","slug":"vm和vcpu","link":"#vm和vcpu","children":[]},{"level":3,"title":"QEMU/KVM","slug":"qemu-kvm","link":"#qemu-kvm","children":[]}]},{"level":2,"title":"内存虚拟化","slug":"内存虚拟化","link":"#内存虚拟化","children":[{"level":3,"title":"硬件虚拟化","slug":"硬件虚拟化","link":"#硬件虚拟化","children":[]}]},{"level":2,"title":"IO虚拟化","slug":"io虚拟化","link":"#io虚拟化","children":[{"level":3,"title":"如何实现IO虚拟化","slug":"如何实现io虚拟化","link":"#如何实现io虚拟化","children":[]}]},{"level":2,"title":"中断虚拟化","slug":"中断虚拟化","link":"#中断虚拟化","children":[{"level":3,"title":"virtual CPU interface","slug":"virtual-cpu-interface","link":"#virtual-cpu-interface","children":[]}]},{"level":2,"title":"轻量级虚拟化","slug":"轻量级虚拟化","link":"#轻量级虚拟化","children":[{"level":3,"title":"Fass(Function as a service) and Serverless","slug":"fass-function-as-a-service-and-serverless","link":"#fass-function-as-a-service-and-serverless","children":[]},{"level":3,"title":"基于namespace的限制","slug":"基于namespace的限制","link":"#基于namespace的限制","children":[]}]},{"level":2,"title":"linux容器","slug":"linux容器","link":"#linux容器","children":[{"level":3,"title":"linux namespace","slug":"linux-namespace","link":"#linux-namespace","children":[]}]},{"level":2,"title":"linux收包过程","slug":"linux收包过程","link":"#linux收包过程","children":[]},{"level":2,"title":"linux调试支持：ptrace系统调用","slug":"linux调试支持-ptrace系统调用","link":"#linux调试支持-ptrace系统调用","children":[]},{"level":2,"title":"性能调试","slug":"性能调试","link":"#性能调试","children":[{"level":3,"title":"确定内核执行中耗时较长的函数","slug":"确定内核执行中耗时较长的函数","link":"#确定内核执行中耗时较长的函数","children":[]},{"level":3,"title":"控制流追踪","slug":"控制流追踪","link":"#控制流追踪","children":[]},{"level":3,"title":"静态追踪方法","slug":"静态追踪方法","link":"#静态追踪方法","children":[]},{"level":3,"title":"动态追踪方法","slug":"动态追踪方法","link":"#动态追踪方法","children":[]}]}],"git":{"createdTime":1698425463000,"updatedTime":1698425463000,"contributors":[{"name":"zsh","email":"zsh-a@foxmail.com","commits":1}]},"readingTime":{"minutes":20.68,"words":6205},"filePathRelative":"posts/os.md","localizedDate":"2023年10月27日","excerpt":"<h1> 内存管理</h1>\\n<h2> 分页虚拟内存</h2>\\n<h3> TLB刷新</h3>\\n<ul>\\n<li>\\n<p>AARCH64内核和应用程序使用不同页表</p>\\n<ul>\\n<li>页表地址分别存放在TTBR0_EL1和TTBR1_EL1</li>\\n<li>系统调用无需切换页表</li>\\n</ul>\\n</li>\\n<li>\\n<p>x86_64唯一页表基址存放在CR3</p>\\n<ul>\\n<li>将内核映射到高地址</li>\\n<li>避免系统调用TLB刷新开销</li>\\n</ul>\\n</li>\\n</ul>\\n<h3> 如何降低TLB刷新开销</h3>\\n<ul>\\n<li>\\n<p><strong>为不同的页表打上标签</strong></p>\\n<ul>\\n<li>TLB缓存项都有标签，切换页表不需要刷新TLB</li>\\n</ul>\\n</li>\\n<li>\\n<p><strong>x86_64:PCID</strong></p>\\n<ul>\\n<li>PCID存储在CR3的低12位</li>\\n</ul>\\n</li>\\n<li>\\n<p><strong>AARCH64:ASID</strong></p>\\n<ul>\\n<li>OS为不同进程分配8/16位ASID,将ASID存在TTBR0_EL1的高8/16位</li>\\n</ul>\\n</li>\\n</ul>","autoDesc":true}');export{l as data};
