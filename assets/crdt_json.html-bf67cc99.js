import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{o as t,c as l,a,f as e,b as Q}from"./app-6f6f0afa.js";const n={},T=e('<h1 id="json-模型" tabindex="-1"><a class="header-anchor" href="#json-模型" aria-hidden="true">#</a> JSON 模型</h1><ul><li>树结构</li><li>包含两种分支节点 <ul><li>Map <ul><li>子节点无序</li><li>key : string</li></ul></li><li>List <ul><li>子节点有序</li></ul></li></ul></li><li>叶节点 <ul><li>不可变</li><li>string</li><li>number</li><li>boolean</li><li>null</li></ul></li></ul><h1 id="operational-transformation" tabindex="-1"><a class="header-anchor" href="#operational-transformation" aria-hidden="true">#</a> Operational Transformation</h1><h2 id="应用" tabindex="-1"><a class="header-anchor" href="#应用" aria-hidden="true">#</a> 应用</h2><ul><li>Google docs</li></ul><h2 id="缺陷" tabindex="-1"><a class="header-anchor" href="#缺陷" aria-hidden="true">#</a> 缺陷</h2>',6),o=a("li",null,"不支持树结构",-1),s=a("li",null,"一些算法支持nested order lists，不支持key-value maps",-1),r=a("li",null,"Scalability 差",-1),d=a("li",null,"依赖单服务器决定全序关系",-1),h={class:"MathJax",jax:"SVG",style:{position:"relative"}},c={style:{"vertical-align":"-0.566ex"},xmlns:"http://www.w3.org/2000/svg",width:"7.785ex",height:"2.452ex",role:"img",focusable:"false",viewBox:"0 -833.9 3440.8 1083.9","aria-hidden":"true"},m=e('<g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D442" d="M740 435Q740 320 676 213T511 42T304 -22Q207 -22 138 35T51 201Q50 209 50 244Q50 346 98 438T227 601Q351 704 476 704Q514 704 524 703Q621 689 680 617T740 435ZM637 476Q637 565 591 615T476 665Q396 665 322 605Q242 542 200 428T157 216Q157 126 200 73T314 19Q404 19 485 98T608 313Q637 408 637 476Z"></path></g><g data-mml-node="mo" transform="translate(763,0)"><path data-c="28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path></g><g data-mml-node="msup" transform="translate(1152,0)"><g data-mml-node="mi"><path data-c="1D441" d="M234 637Q231 637 226 637Q201 637 196 638T191 649Q191 676 202 682Q204 683 299 683Q376 683 387 683T401 677Q612 181 616 168L670 381Q723 592 723 606Q723 633 659 637Q635 637 635 648Q635 650 637 660Q641 676 643 679T653 683Q656 683 684 682T767 680Q817 680 843 681T873 682Q888 682 888 672Q888 650 880 642Q878 637 858 637Q787 633 769 597L620 7Q618 0 599 0Q585 0 582 2Q579 5 453 305L326 604L261 344Q196 88 196 79Q201 46 268 46H278Q284 41 284 38T282 19Q278 6 272 0H259Q228 2 151 2Q123 2 100 2T63 2T46 1Q31 1 31 10Q31 14 34 26T39 40Q41 46 62 46Q130 49 150 85Q154 91 221 362L289 634Q287 635 234 637Z"></path></g><g data-mml-node="mn" transform="translate(975.3,363) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g><g data-mml-node="mi" transform="translate(2530.8,0)"><path data-c="1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path></g><g data-mml-node="mo" transform="translate(3051.8,0)"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g>',1),u=[m],_=a("mjx-assistive-mml",{unselectable:"on",display:"inline"},[a("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[a("mi",null,"O"),a("mo",{stretchy:"false"},"("),a("msup",null,[a("mi",null,"N"),a("mn",null,"2")]),a("mi",null,"k"),a("mo",{stretchy:"false"},")")])],-1),f=a("h1",{id:"crdt",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#crdt","aria-hidden":"true"},"#"),Q(" CRDT")],-1),g=a("ul",null,[a("li",null,"支持并发修改，保证并发更新收敛"),a("li",null,"通过添加一些元数据")],-1);function p(x,H){return t(),l("div",null,[T,a("ul",null,[o,s,r,d,a("li",null,[a("mjx-container",h,[(t(),l("svg",c,u)),_])])]),f,g])}const b=i(n,[["render",p],["__file","crdt_json.html.vue"]]);export{b as default};