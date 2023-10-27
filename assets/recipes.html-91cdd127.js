const e=JSON.parse('{"key":"v-70064ec9","path":"/posts/recipes.html","title":"杂记","lang":"zh-CN","frontmatter":{"title":"杂记","tag":["杂记","linux"],"description":"linux 信号 关闭终端进程退出 关闭终端时，虚拟终端进程给bash发送sighup， bash给所有子进程转发sighup 用 &amp; 运行程序，然后ctrl+D退出终端，让bash读到EOF退出 信号处理 将信号加入task_struct的信号队列中 从内核态返回时检查队列 需要在用户态执行信号处理程序 将进程的rip设为信号处理函数地址 在用户态栈设置栈帧，将返回地址设为sigreturn()系统调用 sigreturn()恢复进程的执行状态 shell信号处理","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/recipes.html"}],["meta",{"property":"og:site_name","content":"博客演示"}],["meta",{"property":"og:title","content":"杂记"}],["meta",{"property":"og:description","content":"linux 信号 关闭终端进程退出 关闭终端时，虚拟终端进程给bash发送sighup， bash给所有子进程转发sighup 用 &amp; 运行程序，然后ctrl+D退出终端，让bash读到EOF退出 信号处理 将信号加入task_struct的信号队列中 从内核态返回时检查队列 需要在用户态执行信号处理程序 将进程的rip设为信号处理函数地址 在用户态栈设置栈帧，将返回地址设为sigreturn()系统调用 sigreturn()恢复进程的执行状态 shell信号处理"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-10-27T16:51:03.000Z"}],["meta",{"property":"article:author","content":"Mr.Hope"}],["meta",{"property":"article:tag","content":"杂记"}],["meta",{"property":"article:tag","content":"linux"}],["meta",{"property":"article:modified_time","content":"2023-10-27T16:51:03.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"杂记\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-10-27T16:51:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Hope\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"信号","slug":"信号","link":"#信号","children":[]},{"level":2,"title":"io_uring","slug":"io-uring","link":"#io-uring","children":[]},{"level":2,"title":"多处理器","slug":"多处理器","link":"#多处理器","children":[]},{"level":2,"title":"互斥","slug":"互斥","link":"#互斥","children":[]},{"level":2,"title":"同步","slug":"同步","link":"#同步","children":[]},{"level":2,"title":"死锁","slug":"死锁","link":"#死锁","children":[{"level":3,"title":"避免死锁","slug":"避免死锁","link":"#避免死锁","children":[]}]},{"level":2,"title":"应对","slug":"应对","link":"#应对","children":[]}],"git":{"createdTime":1698425463000,"updatedTime":1698425463000,"contributors":[{"name":"zsh","email":"zsh-a@foxmail.com","commits":1}]},"readingTime":{"minutes":4.37,"words":1310},"filePathRelative":"posts/recipes.md","localizedDate":"2023年10月27日","excerpt":"<h1> linux</h1>\\n<h2> 信号</h2>\\n<ul>\\n<li>关闭终端进程退出\\n<ul>\\n<li>关闭终端时，虚拟终端进程给bash发送sighup， bash给所有子进程转发sighup</li>\\n<li>用 &amp; 运行程序，然后ctrl+D退出终端，让bash读到EOF退出</li>\\n</ul>\\n</li>\\n<li>信号处理\\n<ul>\\n<li>将信号加入<code>task_struct</code>的信号队列中</li>\\n<li>从内核态返回时检查队列</li>\\n<li>需要在用户态执行信号处理程序\\n<ul>\\n<li>将进程的<code>rip</code>设为信号处理函数地址</li>\\n<li>在用户态栈设置栈帧，将返回地址设为<code>sigreturn()</code>系统调用</li>\\n<li><code>sigreturn()</code>恢复进程的执行状态</li>\\n</ul>\\n</li>\\n</ul>\\n</li>\\n<li>shell信号处理<br>\\n<img src=\\"/image/recipes/process-groups-sessions.png\\" alt=\\"\\" loading=\\"lazy\\"></li>\\n</ul>","autoDesc":true}');export{e as data};