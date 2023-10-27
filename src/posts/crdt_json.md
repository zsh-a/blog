---
title: CRDT for json
tag: [crdt,json]
---

# JSON 模型
- 树结构
- 包含两种分支节点
  - Map
    - 子节点无序
    - key : string
  - List
    - 子节点有序
- 叶节点
  - 不可变
  - string
  - number
  - boolean
  - null

# Operational Transformation
## 应用
- Google docs
## 缺陷
- 不支持树结构
- 一些算法支持nested order lists，不支持key-value maps
- Scalability 差
- 依赖单服务器决定全序关系
- $O(N^2k)$
# CRDT
- 支持并发修改，保证并发更新收敛
- 通过添加一些元数据
