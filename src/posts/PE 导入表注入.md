---
title: PE import table inject
tag: PE
---

导入表描述了exe执行时需要加载的dll  

## create a test dll  
![](/image/PE/dllmain.png)  
`init()` 和 `destory()`分别在dll加载和dll卸载时调用  
![](/image/PE/import.png)  
![](/image/PE/pch.png)  
dll必须提供导出函数才会被加载  

## 导入表结构  
![导入表结构](/image/PE/import_table.png)  
表中地址均为`RVA`  

## inject code  

### read file  
```cpp

DWORD ext_size = 0x1000; // 文件扩大的大小
FILE* g_f = fopen(filename, "rb");
fseek(g_f, 0, SEEK_END);
int file_size = ftell(g_f);
printf("file size : %d\n", file_size);
auto out_size = file_size + ext_size;
BYTE* file_buff = (BYTE*)malloc(out_size); memset(file_buff, 0, out_size);
fseek(g_f, 0, SEEK_SET);
fread(file_buff, file_size, 1, g_f);

fclose(g_f);

```
### extend the last section  

```cpp
PIMAGE_IMPORT_DESCRIPTOR import_table = (PIMAGE_IMPORT_DESCRIPTOR)(file_buff + RVA2FOV(section_header, sections_nums, op_header->DataDirectory[IMPORT_TABLE].VirtualAddress));

auto last_section_header = section_header + sections_nums - 1;
auto old_last_size = last_section_header->Misc.VirtualSize;
auto N = max(last_section_header->Misc.VirtualSize, last_section_header->SizeOfRawData) + ext_size;
last_section_header->Misc.VirtualSize = last_section_header->SizeOfRawData = N;
last_section_header->Characteristics = 0xc0000040;
op_header->SizeOfImage += ext_size;

```
**`Characteristics`of`section`must be`0xc0000040`**  

### copy origin import table  

```cpp
// file offset to virtual offset to address in the last section
auto FOA2RVA = [last_section_header,file_buff](BYTE* addr) {
    return (DWORD)(last_section_header->VirtualAddress + (addr - (last_section_header->PointerToRawData + file_buff)));
};

PIMAGE_IMPORT_DESCRIPTOR dest = (PIMAGE_IMPORT_DESCRIPTOR)(file_buff + file_size);

op_header->DataDirectory[IMPORT_TABLE].VirtualAddress = FOA2RVA((BYTE*)dest);
op_header->DataDirectory[IMPORT_TABLE].Size += sizeof(*dest);
auto p = dest;
for (; *(DWORD*)import_table != 0;++import_table,++p) {
    memcpy(p,import_table,sizeof(*import_table));
}
```

## add new import table and INT IAT  

```cpp
auto patch = p; // the new import talbe fixed later
DWORD* int_table =(DWORD*)(p + 2);

DWORD* iat_table = (DWORD*)(int_table + 2);

WORD* name = (WORD*)(iat_table + 2);

memcpy(name + 1, "add", 4);
iat_table[0] = int_table[0] = FOA2RVA((BYTE*)name);

BYTE* dll_addr = (BYTE*)(name + 1 + 2);

memcpy(dll_addr, dllname, strlen(dllname) + 1);
// fix new import talbe address
patch->Name = FOA2RVA((BYTE*)dll_addr);
patch->FirstThunk = FOA2RVA((BYTE*)iat_table);
patch->OriginalFirstThunk = FOA2RVA((BYTE*)int_table);

```

### the whole code  

```cpp

void injectImportTable(const char* filename,const char* newname,const char* dllname) {

	DWORD ext_size = 0x1000;
	FILE* g_f = fopen(filename, "rb");
	fseek(g_f, 0, SEEK_END);
	int file_size = ftell(g_f);
	printf("file size : %d\n", file_size);
	auto out_size = file_size + ext_size;
	BYTE* file_buff = (BYTE*)malloc(out_size); memset(file_buff, 0, out_size);
	fseek(g_f, 0, SEEK_SET);
	fread(file_buff, file_size, 1, g_f);
	fclose(g_f);

	PIMAGE_DOS_HEADER dos_header = (PIMAGE_DOS_HEADER)file_buff;
	auto pe_header_offset = dos_header->e_lfanew;
	PIMAGE_NT_HEADERS nt_header = (PIMAGE_NT_HEADERS)(file_buff + pe_header_offset);
	PIMAGE_FILE_HEADER file_header = &nt_header->FileHeader;

	auto sections_nums = file_header->NumberOfSections;
	PIMAGE_OPTIONAL_HEADER op_header = &nt_header->OptionalHeader;

	auto headers_size = op_header->SizeOfHeaders;
	auto image_base = op_header->ImageBase;
	auto image_size = op_header->SizeOfImage;
	PIMAGE_SECTION_HEADER section_header = PIMAGE_SECTION_HEADER((BYTE*)op_header + file_header->SizeOfOptionalHeader);


	// extend last section

	PIMAGE_IMPORT_DESCRIPTOR import_table = (PIMAGE_IMPORT_DESCRIPTOR)(file_buff + RVA2FOV(section_header, sections_nums, op_header->DataDirectory[IMPORT_TABLE].VirtualAddress));
	
	auto text_attr = section_header->Characteristics; // characteristics of text

	auto last_section_header = section_header + sections_nums - 1;
	auto old_last_size = last_section_header->Misc.VirtualSize;
	auto N = max(last_section_header->Misc.VirtualSize, last_section_header->SizeOfRawData) + ext_size;
	last_section_header->Misc.VirtualSize = last_section_header->SizeOfRawData = N;
	last_section_header->Characteristics = 0xc0000040;
	op_header->SizeOfImage += ext_size;

	auto FOA2RVA = [last_section_header,file_buff](BYTE* addr) {
		return (DWORD)(last_section_header->VirtualAddress + (addr - (last_section_header->PointerToRawData + file_buff)));
	};

	PIMAGE_IMPORT_DESCRIPTOR dest = (PIMAGE_IMPORT_DESCRIPTOR)(file_buff + file_size);

	op_header->DataDirectory[IMPORT_TABLE].VirtualAddress = FOA2RVA((BYTE*)dest);
	op_header->DataDirectory[IMPORT_TABLE].Size += sizeof(*dest);
	auto p = dest;
	for (; *(DWORD*)import_table != 0;++import_table,++p) {
		memcpy(p,import_table,sizeof(*import_table));
	}

	auto patch = p;

	DWORD* int_table =(DWORD*)(p + 2);

	DWORD* iat_table = (DWORD*)(int_table + 2);

	WORD* name = (WORD*)(iat_table + 2);

	memcpy(name + 1, "add", 4);
	iat_table[0] = int_table[0] = FOA2RVA((BYTE*)name);

	BYTE* dll_addr = (BYTE*)(name + 1 + 2);

	memcpy(dll_addr, dllname, strlen(dllname) + 1);
	patch->Name = FOA2RVA((BYTE*)dll_addr);
	patch->FirstThunk = FOA2RVA((BYTE*)iat_table);
	patch->OriginalFirstThunk = FOA2RVA((BYTE*)int_table);

	g_f = fopen(newname, "wb");
	fwrite(file_buff, out_size, 1, g_f);
	fclose(g_f);
}

```