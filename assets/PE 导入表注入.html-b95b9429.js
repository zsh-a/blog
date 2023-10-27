import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as t}from"./app-6f6f0afa.js";const p="/blog/image/PE/dllmain.png",e="/blog/image/PE/import.png",o="/blog/image/PE/pch.png",c="/blog/image/PE/import_table.png",l={},i=t('<p>导入表描述了exe执行时需要加载的dll</p><h2 id="create-a-test-dll" tabindex="-1"><a class="header-anchor" href="#create-a-test-dll" aria-hidden="true">#</a> create a test dll</h2><p><img src="'+p+'" alt="" loading="lazy"><br><code>init()</code> 和 <code>destory()</code>分别在dll加载和dll卸载时调用<br><img src="'+e+'" alt="" loading="lazy"><br><img src="'+o+'" alt="" loading="lazy"><br> dll必须提供导出函数才会被加载</p><h2 id="导入表结构" tabindex="-1"><a class="header-anchor" href="#导入表结构" aria-hidden="true">#</a> 导入表结构</h2><p><img src="'+c+`" alt="导入表结构" loading="lazy"><br> 表中地址均为<code>RVA</code></p><h2 id="inject-code" tabindex="-1"><a class="header-anchor" href="#inject-code" aria-hidden="true">#</a> inject code</h2><h3 id="read-file" tabindex="-1"><a class="header-anchor" href="#read-file" aria-hidden="true">#</a> read file</h3><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code>
DWORD ext_size <span class="token operator">=</span> <span class="token number">0x1000</span><span class="token punctuation">;</span> <span class="token comment">// 文件扩大的大小</span>
FILE<span class="token operator">*</span> g_f <span class="token operator">=</span> <span class="token function">fopen</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">&quot;rb&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">fseek</span><span class="token punctuation">(</span>g_f<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token constant">SEEK_END</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">int</span> file_size <span class="token operator">=</span> <span class="token function">ftell</span><span class="token punctuation">(</span>g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;file size : %d\\n&quot;</span><span class="token punctuation">,</span> file_size<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">auto</span> out_size <span class="token operator">=</span> file_size <span class="token operator">+</span> ext_size<span class="token punctuation">;</span>
BYTE<span class="token operator">*</span> file_buff <span class="token operator">=</span> <span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span><span class="token function">malloc</span><span class="token punctuation">(</span>out_size<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token function">memset</span><span class="token punctuation">(</span>file_buff<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> out_size<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">fseek</span><span class="token punctuation">(</span>g_f<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token constant">SEEK_SET</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">fread</span><span class="token punctuation">(</span>file_buff<span class="token punctuation">,</span> file_size<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">fclose</span><span class="token punctuation">(</span>g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="extend-the-last-section" tabindex="-1"><a class="header-anchor" href="#extend-the-last-section" aria-hidden="true">#</a> extend the last section</h3><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code>PIMAGE_IMPORT_DESCRIPTOR import_table <span class="token operator">=</span> <span class="token punctuation">(</span>PIMAGE_IMPORT_DESCRIPTOR<span class="token punctuation">)</span><span class="token punctuation">(</span>file_buff <span class="token operator">+</span> <span class="token function">RVA2FOV</span><span class="token punctuation">(</span>section_header<span class="token punctuation">,</span> sections_nums<span class="token punctuation">,</span> op_header<span class="token operator">-&gt;</span>DataDirectory<span class="token punctuation">[</span>IMPORT_TABLE<span class="token punctuation">]</span><span class="token punctuation">.</span>VirtualAddress<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">auto</span> last_section_header <span class="token operator">=</span> section_header <span class="token operator">+</span> sections_nums <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">auto</span> old_last_size <span class="token operator">=</span> last_section_header<span class="token operator">-&gt;</span>Misc<span class="token punctuation">.</span>VirtualSize<span class="token punctuation">;</span>
<span class="token keyword">auto</span> N <span class="token operator">=</span> <span class="token function">max</span><span class="token punctuation">(</span>last_section_header<span class="token operator">-&gt;</span>Misc<span class="token punctuation">.</span>VirtualSize<span class="token punctuation">,</span> last_section_header<span class="token operator">-&gt;</span>SizeOfRawData<span class="token punctuation">)</span> <span class="token operator">+</span> ext_size<span class="token punctuation">;</span>
last_section_header<span class="token operator">-&gt;</span>Misc<span class="token punctuation">.</span>VirtualSize <span class="token operator">=</span> last_section_header<span class="token operator">-&gt;</span>SizeOfRawData <span class="token operator">=</span> N<span class="token punctuation">;</span>
last_section_header<span class="token operator">-&gt;</span>Characteristics <span class="token operator">=</span> <span class="token number">0xc0000040</span><span class="token punctuation">;</span>
op_header<span class="token operator">-&gt;</span>SizeOfImage <span class="token operator">+=</span> ext_size<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>Characteristics</code>of<code>section</code>must be<code>0xc0000040</code></strong></p><h3 id="copy-origin-import-table" tabindex="-1"><a class="header-anchor" href="#copy-origin-import-table" aria-hidden="true">#</a> copy origin import table</h3><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token comment">// file offset to virtual offset to address in the last section</span>
<span class="token keyword">auto</span> FOA2RVA <span class="token operator">=</span> <span class="token punctuation">[</span>last_section_header<span class="token punctuation">,</span>file_buff<span class="token punctuation">]</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span> addr<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>DWORD<span class="token punctuation">)</span><span class="token punctuation">(</span>last_section_header<span class="token operator">-&gt;</span>VirtualAddress <span class="token operator">+</span> <span class="token punctuation">(</span>addr <span class="token operator">-</span> <span class="token punctuation">(</span>last_section_header<span class="token operator">-&gt;</span>PointerToRawData <span class="token operator">+</span> file_buff<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

PIMAGE_IMPORT_DESCRIPTOR dest <span class="token operator">=</span> <span class="token punctuation">(</span>PIMAGE_IMPORT_DESCRIPTOR<span class="token punctuation">)</span><span class="token punctuation">(</span>file_buff <span class="token operator">+</span> file_size<span class="token punctuation">)</span><span class="token punctuation">;</span>

op_header<span class="token operator">-&gt;</span>DataDirectory<span class="token punctuation">[</span>IMPORT_TABLE<span class="token punctuation">]</span><span class="token punctuation">.</span>VirtualAddress <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>dest<span class="token punctuation">)</span><span class="token punctuation">;</span>
op_header<span class="token operator">-&gt;</span>DataDirectory<span class="token punctuation">[</span>IMPORT_TABLE<span class="token punctuation">]</span><span class="token punctuation">.</span>Size <span class="token operator">+=</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token operator">*</span>dest<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">auto</span> p <span class="token operator">=</span> dest<span class="token punctuation">;</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> <span class="token operator">*</span><span class="token punctuation">(</span>DWORD<span class="token operator">*</span><span class="token punctuation">)</span>import_table <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">;</span><span class="token operator">++</span>import_table<span class="token punctuation">,</span><span class="token operator">++</span>p<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">memcpy</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span>import_table<span class="token punctuation">,</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token operator">*</span>import_table<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="add-new-import-table-and-int-iat" tabindex="-1"><a class="header-anchor" href="#add-new-import-table-and-int-iat" aria-hidden="true">#</a> add new import table and INT IAT</h2><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token keyword">auto</span> patch <span class="token operator">=</span> p<span class="token punctuation">;</span> <span class="token comment">// the new import talbe fixed later</span>
DWORD<span class="token operator">*</span> int_table <span class="token operator">=</span><span class="token punctuation">(</span>DWORD<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>p <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

DWORD<span class="token operator">*</span> iat_table <span class="token operator">=</span> <span class="token punctuation">(</span>DWORD<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>int_table <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

WORD<span class="token operator">*</span> name <span class="token operator">=</span> <span class="token punctuation">(</span>WORD<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>iat_table <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">memcpy</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&quot;add&quot;</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
iat_table<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> int_table<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>

BYTE<span class="token operator">*</span> dll_addr <span class="token operator">=</span> <span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">memcpy</span><span class="token punctuation">(</span>dll_addr<span class="token punctuation">,</span> dllname<span class="token punctuation">,</span> <span class="token function">strlen</span><span class="token punctuation">(</span>dllname<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// fix new import talbe address</span>
patch<span class="token operator">-&gt;</span>Name <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>dll_addr<span class="token punctuation">)</span><span class="token punctuation">;</span>
patch<span class="token operator">-&gt;</span>FirstThunk <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>iat_table<span class="token punctuation">)</span><span class="token punctuation">;</span>
patch<span class="token operator">-&gt;</span>OriginalFirstThunk <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>int_table<span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="the-whole-code" tabindex="-1"><a class="header-anchor" href="#the-whole-code" aria-hidden="true">#</a> the whole code</h3><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code>
<span class="token keyword">void</span> <span class="token function">injectImportTable</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">char</span><span class="token operator">*</span> filename<span class="token punctuation">,</span><span class="token keyword">const</span> <span class="token keyword">char</span><span class="token operator">*</span> newname<span class="token punctuation">,</span><span class="token keyword">const</span> <span class="token keyword">char</span><span class="token operator">*</span> dllname<span class="token punctuation">)</span> <span class="token punctuation">{</span>

	DWORD ext_size <span class="token operator">=</span> <span class="token number">0x1000</span><span class="token punctuation">;</span>
	FILE<span class="token operator">*</span> g_f <span class="token operator">=</span> <span class="token function">fopen</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">&quot;rb&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token function">fseek</span><span class="token punctuation">(</span>g_f<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token constant">SEEK_END</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">int</span> file_size <span class="token operator">=</span> <span class="token function">ftell</span><span class="token punctuation">(</span>g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;file size : %d\\n&quot;</span><span class="token punctuation">,</span> file_size<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">auto</span> out_size <span class="token operator">=</span> file_size <span class="token operator">+</span> ext_size<span class="token punctuation">;</span>
	BYTE<span class="token operator">*</span> file_buff <span class="token operator">=</span> <span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span><span class="token function">malloc</span><span class="token punctuation">(</span>out_size<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token function">memset</span><span class="token punctuation">(</span>file_buff<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> out_size<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token function">fseek</span><span class="token punctuation">(</span>g_f<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token constant">SEEK_SET</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token function">fread</span><span class="token punctuation">(</span>file_buff<span class="token punctuation">,</span> file_size<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token function">fclose</span><span class="token punctuation">(</span>g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>

	PIMAGE_DOS_HEADER dos_header <span class="token operator">=</span> <span class="token punctuation">(</span>PIMAGE_DOS_HEADER<span class="token punctuation">)</span>file_buff<span class="token punctuation">;</span>
	<span class="token keyword">auto</span> pe_header_offset <span class="token operator">=</span> dos_header<span class="token operator">-&gt;</span>e_lfanew<span class="token punctuation">;</span>
	PIMAGE_NT_HEADERS nt_header <span class="token operator">=</span> <span class="token punctuation">(</span>PIMAGE_NT_HEADERS<span class="token punctuation">)</span><span class="token punctuation">(</span>file_buff <span class="token operator">+</span> pe_header_offset<span class="token punctuation">)</span><span class="token punctuation">;</span>
	PIMAGE_FILE_HEADER file_header <span class="token operator">=</span> <span class="token operator">&amp;</span>nt_header<span class="token operator">-&gt;</span>FileHeader<span class="token punctuation">;</span>

	<span class="token keyword">auto</span> sections_nums <span class="token operator">=</span> file_header<span class="token operator">-&gt;</span>NumberOfSections<span class="token punctuation">;</span>
	PIMAGE_OPTIONAL_HEADER op_header <span class="token operator">=</span> <span class="token operator">&amp;</span>nt_header<span class="token operator">-&gt;</span>OptionalHeader<span class="token punctuation">;</span>

	<span class="token keyword">auto</span> headers_size <span class="token operator">=</span> op_header<span class="token operator">-&gt;</span>SizeOfHeaders<span class="token punctuation">;</span>
	<span class="token keyword">auto</span> image_base <span class="token operator">=</span> op_header<span class="token operator">-&gt;</span>ImageBase<span class="token punctuation">;</span>
	<span class="token keyword">auto</span> image_size <span class="token operator">=</span> op_header<span class="token operator">-&gt;</span>SizeOfImage<span class="token punctuation">;</span>
	PIMAGE_SECTION_HEADER section_header <span class="token operator">=</span> <span class="token function">PIMAGE_SECTION_HEADER</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>op_header <span class="token operator">+</span> file_header<span class="token operator">-&gt;</span>SizeOfOptionalHeader<span class="token punctuation">)</span><span class="token punctuation">;</span>


	<span class="token comment">// extend last section</span>

	PIMAGE_IMPORT_DESCRIPTOR import_table <span class="token operator">=</span> <span class="token punctuation">(</span>PIMAGE_IMPORT_DESCRIPTOR<span class="token punctuation">)</span><span class="token punctuation">(</span>file_buff <span class="token operator">+</span> <span class="token function">RVA2FOV</span><span class="token punctuation">(</span>section_header<span class="token punctuation">,</span> sections_nums<span class="token punctuation">,</span> op_header<span class="token operator">-&gt;</span>DataDirectory<span class="token punctuation">[</span>IMPORT_TABLE<span class="token punctuation">]</span><span class="token punctuation">.</span>VirtualAddress<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	
	<span class="token keyword">auto</span> text_attr <span class="token operator">=</span> section_header<span class="token operator">-&gt;</span>Characteristics<span class="token punctuation">;</span> <span class="token comment">// characteristics of text</span>

	<span class="token keyword">auto</span> last_section_header <span class="token operator">=</span> section_header <span class="token operator">+</span> sections_nums <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
	<span class="token keyword">auto</span> old_last_size <span class="token operator">=</span> last_section_header<span class="token operator">-&gt;</span>Misc<span class="token punctuation">.</span>VirtualSize<span class="token punctuation">;</span>
	<span class="token keyword">auto</span> N <span class="token operator">=</span> <span class="token function">max</span><span class="token punctuation">(</span>last_section_header<span class="token operator">-&gt;</span>Misc<span class="token punctuation">.</span>VirtualSize<span class="token punctuation">,</span> last_section_header<span class="token operator">-&gt;</span>SizeOfRawData<span class="token punctuation">)</span> <span class="token operator">+</span> ext_size<span class="token punctuation">;</span>
	last_section_header<span class="token operator">-&gt;</span>Misc<span class="token punctuation">.</span>VirtualSize <span class="token operator">=</span> last_section_header<span class="token operator">-&gt;</span>SizeOfRawData <span class="token operator">=</span> N<span class="token punctuation">;</span>
	last_section_header<span class="token operator">-&gt;</span>Characteristics <span class="token operator">=</span> <span class="token number">0xc0000040</span><span class="token punctuation">;</span>
	op_header<span class="token operator">-&gt;</span>SizeOfImage <span class="token operator">+=</span> ext_size<span class="token punctuation">;</span>

	<span class="token keyword">auto</span> FOA2RVA <span class="token operator">=</span> <span class="token punctuation">[</span>last_section_header<span class="token punctuation">,</span>file_buff<span class="token punctuation">]</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span> addr<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> <span class="token punctuation">(</span>DWORD<span class="token punctuation">)</span><span class="token punctuation">(</span>last_section_header<span class="token operator">-&gt;</span>VirtualAddress <span class="token operator">+</span> <span class="token punctuation">(</span>addr <span class="token operator">-</span> <span class="token punctuation">(</span>last_section_header<span class="token operator">-&gt;</span>PointerToRawData <span class="token operator">+</span> file_buff<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span><span class="token punctuation">;</span>

	PIMAGE_IMPORT_DESCRIPTOR dest <span class="token operator">=</span> <span class="token punctuation">(</span>PIMAGE_IMPORT_DESCRIPTOR<span class="token punctuation">)</span><span class="token punctuation">(</span>file_buff <span class="token operator">+</span> file_size<span class="token punctuation">)</span><span class="token punctuation">;</span>

	op_header<span class="token operator">-&gt;</span>DataDirectory<span class="token punctuation">[</span>IMPORT_TABLE<span class="token punctuation">]</span><span class="token punctuation">.</span>VirtualAddress <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>dest<span class="token punctuation">)</span><span class="token punctuation">;</span>
	op_header<span class="token operator">-&gt;</span>DataDirectory<span class="token punctuation">[</span>IMPORT_TABLE<span class="token punctuation">]</span><span class="token punctuation">.</span>Size <span class="token operator">+=</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token operator">*</span>dest<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">auto</span> p <span class="token operator">=</span> dest<span class="token punctuation">;</span>
	<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> <span class="token operator">*</span><span class="token punctuation">(</span>DWORD<span class="token operator">*</span><span class="token punctuation">)</span>import_table <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">;</span><span class="token operator">++</span>import_table<span class="token punctuation">,</span><span class="token operator">++</span>p<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token function">memcpy</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span>import_table<span class="token punctuation">,</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token operator">*</span>import_table<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">auto</span> patch <span class="token operator">=</span> p<span class="token punctuation">;</span>

	DWORD<span class="token operator">*</span> int_table <span class="token operator">=</span><span class="token punctuation">(</span>DWORD<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>p <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

	DWORD<span class="token operator">*</span> iat_table <span class="token operator">=</span> <span class="token punctuation">(</span>DWORD<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>int_table <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

	WORD<span class="token operator">*</span> name <span class="token operator">=</span> <span class="token punctuation">(</span>WORD<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>iat_table <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

	<span class="token function">memcpy</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">&quot;add&quot;</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	iat_table<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> int_table<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>

	BYTE<span class="token operator">*</span> dll_addr <span class="token operator">=</span> <span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

	<span class="token function">memcpy</span><span class="token punctuation">(</span>dll_addr<span class="token punctuation">,</span> dllname<span class="token punctuation">,</span> <span class="token function">strlen</span><span class="token punctuation">(</span>dllname<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	patch<span class="token operator">-&gt;</span>Name <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>dll_addr<span class="token punctuation">)</span><span class="token punctuation">;</span>
	patch<span class="token operator">-&gt;</span>FirstThunk <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>iat_table<span class="token punctuation">)</span><span class="token punctuation">;</span>
	patch<span class="token operator">-&gt;</span>OriginalFirstThunk <span class="token operator">=</span> <span class="token function">FOA2RVA</span><span class="token punctuation">(</span><span class="token punctuation">(</span>BYTE<span class="token operator">*</span><span class="token punctuation">)</span>int_table<span class="token punctuation">)</span><span class="token punctuation">;</span>

	g_f <span class="token operator">=</span> <span class="token function">fopen</span><span class="token punctuation">(</span>newname<span class="token punctuation">,</span> <span class="token string">&quot;wb&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token function">fwrite</span><span class="token punctuation">(</span>file_buff<span class="token punctuation">,</span> out_size<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token function">fclose</span><span class="token punctuation">(</span>g_f<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),u=[i];function r(k,d){return s(),a("div",null,u)}const b=n(l,[["render",r],["__file","PE 导入表注入.html.vue"]]);export{b as default};
