---
title: Parsing
---


## CHOMSKY 文法
### Type 0

- 可以从**任意多**个符号产生**任意多**个符号

`, N E -> and N`

### Type 1
- *monotonic*
  - 左侧符号不多于右侧符号

- *context-sensitive*
  - 左侧仅有一个非终结符，并且替换后顺序不变
  - `Name Comma Name End -> Name and Name End` means `Comma -> and``
  - context 不受影响

### Type 2(context-free)
- 左侧仅有一个非终结符

#### Extended CF grammars
- `Sequence -> Something | Something Sequence` 可以写为 `Something^+`
- `Something^?` zero or one Something


**Book grammar**
```
Book -> Preface Chapter^+ Conclusion
Preface -> "PREFACE" Paragraph+
Chapter -> "CHAPTER" Number Paragraph^+
Paragraph -> Sentence^+
Sentence -> ...
Conclusion -> "CONCLUSION" Paragraph^+
```

### Type 3 (regular grammars,RE)
- 右侧只能包含一个非终结符，且该非终结符在最后
- 仅包含两个规则
  - 一个非终结符产生一个终结符
  - 一个非终结符产生一个终结符并接一个非终结符

- e.g.
  - & == and
  - `Sentence -> t | d | h | List`
  - `List -> t ListTail | d ListTail | h ListTai`
  - `ListTail -> , List | &t | &d | &h`
  - 可以简化为 `S -> (([tdh],)*[tdh]&)?[tdh]`

### Type 4(finite-choice)
- 右边不包含非终结符

