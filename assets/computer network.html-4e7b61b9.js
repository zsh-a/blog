import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as i,c as l,a,b as t,f as r}from"./app-6f6f0afa.js";const n={},o=a("h1",{id:"tcp",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#tcp","aria-hidden":"true"},"#"),t(" tcp")],-1),s=a("h2",{id:"拥塞控制",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#拥塞控制","aria-hidden":"true"},"#"),t(" 拥塞控制")],-1),m={class:"MathJax",jax:"SVG",style:{position:"relative"}},d={style:{"vertical-align":"-0.452ex"},xmlns:"http://www.w3.org/2000/svg",width:"35.195ex",height:"2.149ex",role:"img",focusable:"false",viewBox:"0 -750 15556 950","aria-hidden":"true"},f=r('<g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">时</text></g><g data-mml-node="mi" transform="translate(1000,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">延</text></g><g data-mml-node="mi" transform="translate(2000,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">带</text></g><g data-mml-node="mi" transform="translate(3000,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">宽</text></g><g data-mml-node="mi" transform="translate(4000,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">积</text></g><g data-mml-node="mo" transform="translate(5277.8,0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(6333.6,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">链</text></g><g data-mml-node="mi" transform="translate(7333.6,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">路</text></g><g data-mml-node="mi" transform="translate(8333.6,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">带</text></g><g data-mml-node="mi" transform="translate(9333.6,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">宽</text></g><g data-mml-node="mo" transform="translate(10555.8,0)"><path data-c="D7" d="M630 29Q630 9 609 9Q604 9 587 25T493 118L389 222L284 117Q178 13 175 11Q171 9 168 9Q160 9 154 15T147 29Q147 36 161 51T255 146L359 250L255 354Q174 435 161 449T147 471Q147 480 153 485T168 490Q173 490 175 489Q178 487 284 383L389 278L493 382Q570 459 587 475T609 491Q630 491 630 471Q630 464 620 453T522 355L418 250L522 145Q606 61 618 48T630 29Z"></path></g><g data-mml-node="mi" transform="translate(11556,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">往</text></g><g data-mml-node="mi" transform="translate(12556,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">返</text></g><g data-mml-node="mi" transform="translate(13556,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">时</text></g><g data-mml-node="mi" transform="translate(14556,0)"><text data-variant="normal" transform="scale(1,-1)" font-size="884px" font-family="serif">延</text></g></g></g>',1),h=[f],c=a("mjx-assistive-mml",{unselectable:"on",display:"inline"},[a("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[a("mi",{mathvariant:"normal"},"时"),a("mi",{mathvariant:"normal"},"延"),a("mi",{mathvariant:"normal"},"带"),a("mi",{mathvariant:"normal"},"宽"),a("mi",{mathvariant:"normal"},"积"),a("mo",null,"="),a("mi",{mathvariant:"normal"},"链"),a("mi",{mathvariant:"normal"},"路"),a("mi",{mathvariant:"normal"},"带"),a("mi",{mathvariant:"normal"},"宽"),a("mo",null,"×"),a("mi",{mathvariant:"normal"},"往"),a("mi",{mathvariant:"normal"},"返"),a("mi",{mathvariant:"normal"},"时"),a("mi",{mathvariant:"normal"},"延")])],-1),u=a("li",null,"如何估计该数值?",-1),x=r('<h3 id="cubic" tabindex="-1"><a class="header-anchor" href="#cubic" aria-hidden="true">#</a> cubic</h3><ul><li><p>不断增加发送窗口，直到出现丢包</p><ul><li>加性增，乘性减</li></ul></li><li><p>不能区分<strong>拥塞丢包</strong>和<strong>错误丢包</strong></p></li><li><p>错误丢包率需要与发送窗口的平方成反比才能正常工作</p><ul><li>估计值偏小，不能占满资源</li></ul></li><li><p>bufferbloat（缓冲区膨胀）</p><ul><li>网络中节点存在buffer</li><li>估计值偏大</li><li>增加网络延迟</li><li>缓冲区被填满而丢包</li></ul></li></ul><h3 id="bbr" tabindex="-1"><a class="header-anchor" href="#bbr" aria-hidden="true">#</a> BBR</h3><ul><li><p>不考虑丢包</p></li><li><p>分别估计带宽和时延</p><ul><li>无法同时测准</li></ul></li><li><p>交替测量带宽和延迟</p><ul><li>用一段时间内的带宽极大值和延迟极小值作为估计值</li></ul></li></ul><ol><li>慢启动 <ul><li>指数增长发送速率，将通道占满</li><li>如果网络中有buffer，把缓冲区填满才会放弃</li></ul></li><li>排空（drain） <ul><li>指数降低发送速率，buffer中的包会被慢慢排空，直到往返延迟不再降低</li></ul></li></ol><ul><li>充分利用带宽，适合高延迟、高带宽的链路</li><li>降低buffer的占用率，从而降低延迟</li></ul><h1 id="quic" tabindex="-1"><a class="header-anchor" href="#quic" aria-hidden="true">#</a> QUIC</h1><h2 id="动机" tabindex="-1"><a class="header-anchor" href="#动机" aria-hidden="true">#</a> 动机</h2><ul><li>TCP需要至少一个rtt握手，tls添加了两个rtt</li><li>队头阻塞时延</li><li>重传模糊 <ul><li>重传的tcp段有相同的序列号</li><li>接收到的ACK不能区分原始包和重传包</li><li>采样RTT不准确</li><li>通过昂贵的timeout检测重传丢失</li></ul></li></ul><h2 id="设计" tabindex="-1"><a class="header-anchor" href="#设计" aria-hidden="true">#</a> 设计</h2><h3 id="连接建立" tabindex="-1"><a class="header-anchor" href="#连接建立" aria-hidden="true">#</a> 连接建立</h3><ul><li>当成功握手之后，client缓存<strong>origin</strong>信息</li><li>接下来的连接相同的origin，client能够无需rtt建立加密连接 <ul><li>数据可以立即发送无需等待server回复</li><li>0-rtt 握手</li></ul></li><li>使用Diffie-Hellman密钥交换算法</li></ul><h3 id="初始握手" tabindex="-1"><a class="header-anchor" href="#初始握手" aria-hidden="true">#</a> 初始握手</h3><ol start="0"><li>server配置长期密钥对config（p,g,K_pub）</li><li>client发送hello到server</li><li>server回复config</li><li>client收到后生成随机数并计算公钥和对称密钥</li><li>client将公钥和加密数据发送给server</li><li>server收到后计算对称密钥</li><li>双方通过各自的额外公钥计算前向安全的通信密钥</li></ol><h3 id="再次连接" tabindex="-1"><a class="header-anchor" href="#再次连接" aria-hidden="true">#</a> 再次连接</h3><ul><li>client已经缓存了config，直接从step.3 开始</li><li>一次一密</li></ul><h3 id="流复用" tabindex="-1"><a class="header-anchor" href="#流复用" aria-hidden="true">#</a> 流复用</h3><ul><li>一个连接可以存在多个流，一个udp包丢失仅会影响该包中的流</li><li>stream IDs标识</li><li></li></ul>',18);function g(p,v){return i(),l("div",null,[o,s,a("ul",null,[a("li",null,[t("最大化时延带宽积 "),a("ul",null,[a("li",null,[a("mjx-container",m,[(i(),l("svg",d,h)),c])])])]),u]),x])}const Q=e(n,[["render",g],["__file","computer network.html.vue"]]);export{Q as default};