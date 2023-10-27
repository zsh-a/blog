---
title: 算法模板
category:
  - 算法
tag:
  - 模板
---

# 模板题

## 0x00排序

### 快速排序

给定你一个长度为n的整数数列。

请你使用快速排序对这个数列按照从小到大进行排序。

并将排好序的数列按顺序输出。

#### 输入格式

输入共两行，第一行包含整数 n。

第二行包含 n 个整数（所有整数均在$1-10^{9}$范围内），表示整个数列。

#### 输出格式

输出共一行，包含 n 个整数，表示排好序的数列。

#### 数据范围

$1≤n≤100000$

#### 输入样例

5
3 1 2 4 5

#### 输出样例

1 2 3 4 5

```cpp
#include<iostream>
using namespace std;
const int M = 1e5 + 10;

int d[M];
void qs(int l,int r){
    if(l >=r )
        return;
    int i = l -1,j = r + 1,pivo = d[l + r >> 1];
    while(i < j){
        while(d[++i] < pivo);
        while(d[--j] > pivo);
        if(i < j) swap(d[i],d[j]);
    }
    qs(l,j);
    qs(j + 1,r);
}
int main(){
    int n;
    scanf("%d",&n);
    for(int i = 0;i < n;i ++ ){
        scanf("%d",&d[i]);
    }
    qs(0,n-1);
    for(int i = 0;i < n;i++)
        printf("%d ",d[i]);
    return 0;
}
```
### 快速选择
```cpp
#include<bits/stdc++.h>
using namespace std;

int d[100010];
int n,k;
int main(){
    cin >> n >> k;
    for(int i = 0;i < n;i++)
        scanf("%d",&d[i]);
    
    int l = 0,r = n - 1;
    srand(time(0));

    // 求第k个数
    while(l < r){
        swap(d[(rand()%(r - l + 1)) + l],d[l]);
        int pivo = d[l];
        int i = l,j = r;
        
        while(i < j){
            while(i < j && d[j] >= pivo)j--;
            d[i] = d[j];
            while(i < j && d[i] <= pivo) i++;
            d[j]  = d[i];
        }
        
        d[i] = pivo;
        
        if(i == k){
            break;
        }else if(i < k){
            l = i + 1;
        }else
            r = i - 1;
    }
    cout << d[k];
}
```


### 归并排序

```cpp
#include<iostream>

using namespace std;
const int M = 1e5 + 10;

int d[M],tmp[M];

void merge_sort(int l,int r){
    if(l >= r) return;
    int mid = l + r >> 1;
    merge_sort(l,mid), merge_sort(mid + 1,r);
    int k = 0,i = l,j = mid + 1;
    while(i <= mid && j <= r){
        if(d[i] <= d[j]) tmp[k++] = d[i++];
        else tmp[k++] = d[j++];
    }
    while(i <= mid) tmp[k++] = d[i++];
    while(j <= r) tmp[k++] = d[j++];
    for(i = l,j = 0;j < k;j++,i++) d[i] = tmp[j];

}


int main(){
    int n;
    scanf("%d",&n);
    for(int i = 0;i < n;i ++ ){
        scanf("%d",&d[i]);
    }
    merge_sort(0,n-1);
    for(int i = 0;i < n;i++)
        printf("%d ",d[i]);
    return 0;
}
```
## 二分
* 有单调性一定可以二分
* 没有单调性不一定不能二分
```cpp
/*
                        check() == true
    |_______________| |_______________|
    l                 ^               r
                     mid
*/

int bs(int l,int r){
    while(l < r){
        int mid = l + r >> 1;
        if(check(mid)) r = mid;
        else l = mid + 1; 
    }
    return l;
}
```
```cpp
/*
     check() == true
    |_______________| |_______________|
    l               ^                 r
                   mid
*/

int bs(int l,int r){
    while(l < r){
        int mid = l + r + 1 >> 1;
        if(check(mid)) l = mid;
        else r = mid - 1; 
    }
    return l;
}
```

## 0x01高精度

### 加法

```cpp
vector<int> add(){

    vector<int> res;
    int c= 0;
    for(int i = 0;i < A.size() || i <B.size();i++){
        if(i < A.size()) c += A[i];
        if(i < B.size()) c += B[i];
        res.push_back(c % 10);
        c/= 10;
    }
    if(c) res.push_back(c);
    return res;
}


```

### 减法

```cpp
vector<int> sub(vector<int>& A,vector<int>& B){
    int c = 0;
    vector<int> res;
    for(int i = 0;i < A.size();i++){
        c = A[i] - c;
        if(i < B.size()) c = c - B[i];
        res.push_back((c + 10) % 10);
        if(c < 0) c = 1; // 有借位
        else c = 0;
    }
    while(res.size() > 1 && res.back()==0) res.pop_back();// 去掉前导 0
    return res;
}
```

### 乘法

```cpp
vector<int> mul(vector<int> A,int b){
    int c = 0;
    vector<int> res;
    for(int i = 0;i < A.size();i++){
        c += A[i]*b;
        res.push_back(c % 10);
        c /= 10;
    }  
    if(c) res.push_back(c);
    return res;
}
```

### 除法

```cpp
vector<int> div(vector<int> A,int b,int& r){

    r = 0;
    vector<int> res;
    for(int i = A.size() -1;i>=0;i--){

        r = r * 10 + A[i];
        res.push_back(r / b);
        r = r % b;
    }

    reverse(res.begin(),res.end());
    while(res.size() > 1 && res.back() == 0) res.pop_back();
    return res;
}

```

## 0x02 前缀和差分

将$[l,r] + c$ 操作变为$O(1)$

### 差分

输入一个长度为n的整数序列。

接下来输入m个操作，每个操作包含三个整数l, r, c，表示将序列中[l, r]之间的每个数加上c。

请你输出进行完所有操作后的序列。

#### 输入格式

第一行包含两个整数n和m。

第二行包含n个整数，表示整数序列。

接下来m行，每行包含三个整数l，r，c，表示一个操作。

#### 输出格式

共一行，包含n个整数，表示最终序列。

#### 数据范围

$1≤n,m≤100000,$  
$1≤l≤r≤n,$  
$−1000≤c≤1000,$  
$−1000≤整数序列中元素的值≤1000$ 

#### 输入样例：
6 3
1 2 2 1 2 1
1 3 1
3 5 1
1 6 1

#### 输出样例：
3 4 5 3 4 2

```cpp
#include<iostream>
using namespace std;

const int M = 1e5 + 10;
int a[M],b[M];
int main(){
    int n,m;
    scanf("%d%d",&n,&m);
    for(int i  =1;i <=n;i++) {
        scanf("%d",&a[i]);
        b[i] = a[i] - a[i-1]; // 计算差分
    }
    while(m--){
        int l,r,c;
        scanf("%d%d%d",&l,&r,&c);
        b[l] += c;
        b[r+1] -= c;

    }
    for(int i = 1;i <=n;i++) b[i] +=b[i-1]; // 求前缀和
    for(int i = 1;i <=n;i++) printf("%d ",b[i]);
    return 0;
}
```

### 矩阵差分

输入一个n行m列的整数矩阵，再输入q个操作，每个操作包含五个整数x1, y1, x2, y2, c，其中(x1, y1)和(x2, y2)表示一个子矩阵的左上角坐标和右下角坐标。

每个操作都要将选中的子矩阵中的每个元素的值加上c。

请你将进行完所有操作后的矩阵输出。

#### 输入格式

第一行包含整数n,m,q。

接下来n行，每行包含m个整数，表示整数矩阵。

接下来q行，每行包含5个整数x1, y1, x2, y2, c，表示一个操作。

#### 输出格式

共 n 行，每行 m 个整数，表示所有操作进行完毕后的最终矩阵。

#### 数据范围

$1≤n,m≤1000,$  
$1≤q≤100000,$  
$1≤x1≤x2≤n,$  
$1≤y1≤y2≤m,$  
$−1000≤c≤1000,$  
$−1000≤矩阵内元素的值≤1000$  

#### 输入样例：

3 4 3  
1 2 2 1  
3 2 2 1  
1 1 1 1  
1 1 2 2 1  
1 3 2 3 2  
3 1 3 4 1  

#### 输出样例：

2 3 4 1  
4 3 4 1  
2 2 2 2  

```cpp
#include<iostream>
using namespace std;

const int M = 1010;
int a[M][M],b[M][M];
// 插入
void insert(int x1,int y1,int x2,int y2,int c){
    b[x1][y1] += c;
    b[x2 + 1][y1] -= c;
    b[x1][y2+1] -= c;
    b[x2+1][y2+1] += c;

}
int main(){
    int n,m,q;
    cin >> n>>m>>q;
    for(int i =1;i <=n;i++)
        for(int j = 1;j <=m;j++)
            scanf("%d",&a[i][j]), insert(i,j,i,j,a[i][j]);


    while(q--){
        int x1,x2,y1,y2,c;
        cin >> x1>>y1>>x2>>y2>>c;
        insert(x1,y1,x2,y2,c);
    }
    for(int i = 1;i <=n;i++)
        for(int j = 1;j <=m;j++)
            b[i][j] += b[i-1][j] + b[i][j-1] - b[i-1][j-1];// 求前缀和
    for(int i = 1;i <=n;i++){

        for(int j = 1;j <=m;j++)
            printf("%d ",b[i][j]);
        printf("\n");

    }

    return 0;
}

```

### 区间离散

假定有一个无限长的数轴，数轴上每个坐标上的数都是0。

现在，我们首先进行 n 次操作，每次操作将某一位置x上的数加c。

近下来，进行 m 次询问，每个询问包含两个整数l和r，你需要求出在区间[l, r]之间的所有数的和。

输入格式
第一行包含两个整数n和m。

接下来 n 行，每行包含两个整数x和c。

再接下里 m 行，每行包含两个整数l和r。

#### 输出格式

共m行，每行输出一个询问中所求的区间内数字和。

#### 数据范围

$−10^9≤x≤10^9,$  
$1≤n,m≤10^5,$  
$−10^9≤l≤r≤10^9,$  
$−10000≤c≤10000$  

#### 输入样例

3 3
1 2
3 6
7 5
1 3
4 6
7 8
#### 输出样例
8
0
5

```cpp
#include<iostream>
using namespace std;
#include<vector>
#include<algorithm>
using PII = pair<int,int>;
const int M = 3e5 + 10;
int a[M],b[M];
vector<int> alls; // 所有使用到的点
vector<PII> add,query;
int find(int x){
    int l = 0,r = alls.size()-1;
    while(l < r){
        int mid = l + r >>1;
        if(alls[mid]>=x) r = mid;
        else l = mid +1;
    }
    return l + 1;
}
int main(){
    ios::sync_with_stdio(false);
    int n,m;
    cin >>n>>m;
    for(int i = 0; i < n;i++){
        int x,y;
        cin >>x>>y;
        add.push_back({x,y});
        alls.push_back(x);
    }
    for(int i = 0;i < m;i++){
        int x,y;
        cin >> x>>y;
        query.push_back({x,y});
        alls.push_back(x);
        alls.push_back(y);
    }
    sort(alls.begin(),alls.end());
    alls.erase(unique(alls.begin(),alls.end()), alls.end()); // 去重

    for(auto it : add){
        int x = find(it.first);
        a[x] += it.second;
    }

    for(int i = 1;i <=alls.size();i++)
        b[i] = b[i-1] + a[i];

    for(auto it : query){
        int x = find(it.first),y = find(it.second);

        cout << b[y] - b[x-1] <<endl;
    }

    return 0;
}

```

## kmp

给定一个模式串S，以及一个模板串P，所有字符串中只包含大小写英文字母以及阿拉伯数字。

模板串P在模式串S中多次作为子串出现。

求出模板串P在模式串S中所有出现的位置的起始下标。

#### 输入格式

第一行输入整数N，表示字符串P的长度。

第二行输入字符串P。

第三行输入整数M，表示字符串S的长度。

第四行输入字符串S。

#### 输出格式

共一行，输出所有出现位置的起始下标（下标从0开始计数），整数之间用空格隔开。

#### 数据范围

$1≤N≤10^4$  
$1≤M≤10^5$  

#### 输入样例

3  
aba  
5  
ababa

#### 输出样例

0 2

```cpp
#include<iostream>
using namespace std;
const int M = 1e5 + 10;
char s[M],p[M];

int ne[M];
int main(){
    int n,m;
    cin >> n >> p + 1>>m >> s + 1;

    /*
        next[] 从1开始, [1,i] 最大前缀与后缀相同长度
        eg:
            p : "ababa"
                 12345
            next 0 1 2 3 4 5
                 0 0 0 1 2 3
    */
    for(int i = 2,j = 0;i <=n;i++){
        // 用 p[j + 1] 和 j[i]  匹配 ， 若失败 则 j = next[j]
        while(j && p[i] != p[j + 1]) j = ne[j];
        if(p[i] == p[j + 1]) j++;
        ne[i] = j;
    }

    for(int i = 1,j = 0;i <=m;i++){

        while(j && s[i] != p[j + 1]) j = ne[j];
        if(s[i] == p[j + 1]) j++;

        if(j == n ){
            // succ
            cout << i - n <<" ";
            j = ne[j];
        }
    }
    return 0;
}
```

## Trie

> 高效存储和查找字符串
维护一个字符串集合，支持两种操作：

“I x”向集合中插入一个字符串x；
“Q x”询问一个字符串在集合中出现了多少次。
共有N个操作，输入的字符串总长度不超过 105，字符串仅包含小写英文字母。

#### 输入格式

第一行包含整数N，表示操作数。

接下来N行，每行包含一个操作指令，指令为”I x”或”Q x”中的一种。

#### 输出格式

对于每个询问指令”Q x”，都要输出一个整数作为结果，表示x在集合中出现的次数。

每个结果占一行。

#### 数据范围

$1≤N≤2∗10^4$

#### 输入样例

5  
I abc  
Q abc  
Q ab  
I ab  
Q ab  

#### 输出样例

1
0
1

```cpp
#include<iostream>
using namespace std;

const int M = 1e5 + 10;

int son[M][26],cnt[M],idx; // idx : 0 表示根节点
char str[M];
void insert(char* str){

    int p = 0;
    for(int i = 0; str[i];i++){
        int u = str[i] - 'a';
        if(!son[p][u]) son[p][u] = ++idx;
        p = son[p][u];
    }
    cnt[p] ++;
}

int query(char* str){
    int p = 0;
    for(int i = 0;str[i];i++){
        int u = str[i] - 'a';
        if(!son[p][u]) return 0;
        p = son[p][u];
    }
    return cnt[p];
}
int main(){
    int n;
    cin >> n;
    while(n--){
        char op;
        cin >> op;
        cin>> str;
        if(op == 'I'){
            insert(str);
        }else{
            cout << query(str) <<"\n";
        }
    }
    return 0;
}
```

## AC自动机
* trie+kmp

### 例题
原题来自：HDU 2222  
给定 n 个长度不超过 50 的由小写英文字母组成的单词准备查询，以及一篇长为 m 的文章，问：文中出现了多少个待查询的单词。多组数据。

#### 输入格式
第一行一个整数 T，表示数据组数； 

对于每组数据，第一行一个整数 n，接下去 n 行表示 n 个单词，最后一行输入一个字符串，表示文章。

#### 输出格式
对于每组数据，输出一个数，表示文中出现了多少个待查询的单词。

#### 数据范围
$1≤n≤10^4,1≤m≤10^6​​$
#### 输入样例：
1  
5  
she  
he  
say  
shr  
her  
yasherhs
#### 输出样例：
3 

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 10010,S = 55,M = 1e6 + 10;

int tr[N*S][26],cnt[N*S],idx;
char str[M];
int q[N*S],ne[N*S];


void insert(){
    int p = 0;
    for(int i = 0;str[i];i++){
        int j = str[i] - 'a';
        if(!tr[p][j]) tr[p][j] = ++idx;
        p = tr[p][j];
    }
    cnt[p]++;
}

void build(){
    int hh = 0,tt = -1;
    
    // 加入初始的节点
    for(int i = 0;i < 26;i++)
        if(tr[0][i]) q[++tt] = tr[0][i];
    // 利用上层节点更新下层
    while(hh <= tt){
        int t = q[hh++];
        
        for(int i = 0;i < 26;i++){
            int c = tr[t][i];
            if(!c) continue;
            int j = ne[t]; // 上层节点的next
            while(j && !tr[j][i]) j = ne[j];
            if(tr[j][i]) j = tr[j][i];
            ne[c] = j;
            q[++tt] = c;
        }
    }
}
int n;
int main(){
    int T;
    cin >> T;
    while(T--){
        memset(tr,0,sizeof tr);
        memset(cnt,0,sizeof cnt);
        idx = 0;
        memset(ne,0,sizeof ne);
        cin >> n;
        for(int i = 0;i < n;i++){
            cin >> str;
            insert();
        }
        build();
        cin >> str;
        int res = 0;
        for(int i = 0,j = 0;str[i];i++){
            int t = str[i] - 'a';
            
            while(j && !tr[j][t]) j = ne[j];
            if(tr[j][t]) j = tr[j][t];
            
            // 加上所有后缀单词的数量
            int p = j;
            while(p){
                res += cnt[p];
                cnt[p] = 0;
                p = ne[p];
            }
            
        }
        cout << res << endl;
    }
    
}
```
* 优化版

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 10010,S = 55,M = 1e6 + 10;

int tr[N*S][26],cnt[N*S],idx;
char str[M];
int q[N*S],ne[N*S];


void insert(){
    int p = 0;
    for(int i = 0;str[i];i++){
        int j = str[i] - 'a';
        if(!tr[p][j]) tr[p][j] = ++idx;
        p = tr[p][j];
    }
    cnt[p]++;
}

void build(){
    int hh = 0,tt = -1;
    
    // 加入初始的节点
    for(int i = 0;i < 26;i++)
        if(tr[0][i]) q[++tt] = tr[0][i];
    // 利用上层节点更新下层
    while(hh <= tt){
        int t = q[hh++];
        
        for(int i = 0;i < 26;i++){
            int p = tr[t][i];
            if(!p) tr[t][i] = tr[ne[t]][i]; // 直接跳回上层节点的i
            else{
                ne[p] = tr[ne[t]][i]; 
                q[++tt] = p;
            }
        }
    }
}
int n;
int main(){
    int T;
    cin >> T;
    while(T--){
        memset(tr,0,sizeof tr);
        memset(cnt,0,sizeof cnt);
        idx = 0;
        memset(ne,0,sizeof ne);
        cin >> n;
        for(int i = 0;i < n;i++){
            cin >> str;
            insert();
        }
        build();
        cin >> str;
        int res = 0;
        for(int i = 0,j = 0;str[i];i++){
            int t = str[i] - 'a';
            j = tr[j][t];
            
            int p = j;
            while(p){
                res += cnt[p];
                cnt[p] = 0;
                p = ne[p];
            }
            
        }
        cout << res << endl;
    }
    
}

```

## 字符串hash
* $O(1)$时间求解某个子串的hash值  
* $base$通常取131或13331

```cpp
#include<iostream>
#include<cstdio>
#include<algorithm>
#include<cstring>

using namespace std;

typedef unsigned long long ULL;
const int N=1000005,base=131;

int n;
char str[N];
ULL p[N],h[N];

ULL get(int l,int r)
{
    return h[r]-h[l-1]*p[r-l+1];
}

int main()
{
    scanf("%s",str+1);
    int len=strlen(str+1);
    p[0]=1;
    for(int i=1;i<=len;i++)
    {
        h[i]=h[i-1]*base+str[i]-'a'+1;
        p[i]=p[i-1]*base;
    }
    
    return 0;
}
```

## 线段树
用于动态维护序列的区间信息  
* 单点修改 update(x, v)
* 区间查询 query(l, r)

存储结构
```cpp
struct Node{
    int l,r;  //区间范围
    int sum,...; // 维护信息,例如，max,min,sum...
}st[N*4];
```

```cpp
void update(int u,int x,int v){
    if(st[u].l == x && st[u].r == x) st[u] = {x,x,v};
    else{
        int mid = st[u].l + st[u].r >> 1;
        if(x <= mid) update(2*u,x,v);
        else update(2*u + 1,x,v);
        pushup(u); // 由子节点更新当前节点
    }
}
```


```cpp
Node query(int u,int l,int r){
    if(st[u].l == l && st[u].r == r) return st[u];
    int mid = st[u].l + st[u].r >> 1;
    if(r <= mid) return query(2*u,l,r);
    else if(l > mid) return query(2*u + 1,l,r);
    else{
        auto left = query(2*u,l,mid);
        auto right = query(2*u + 1,mid + 1,r);
        Node res;
        pushup(res,left,right);
        return res;
    }
}
```

### 例题
给定长度为N的数列A，以及M条指令，每条指令可能是以下两种之一：

1、“1 x y”，查询区间 [x,y] 中的最大连续子段和，即 $\max \limits_{x\leq l\leq r \leq y} \sum_{i=l}^{r} A[i]$  

2、“2 x y”，把 A[x] 改成 y。

对于每个查询指令，输出一个整数表示答案。

#### 输入格式
第一行两个整数N,M。

第二行N个整数A[i]。

接下来M行每行3个整数k,x,y，k=1表示查询（此时如果x>y，请交换x,y），k=2表示修改。

#### 输出格式
对于每个查询指令输出一个整数表示答案。

每个答案占一行。

#### 数据范围
$N≤500000,M≤100000$
#### 输入样例：
5 3  
1 2 -3 4 5  
1 2 3  
2 2 -1  
1 3 2  
#### 输出样例：
2  
-1  
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N = 5e5 + 10;

struct Node{
    int l,r;
    int sum,lmax,rmax,v;
} tr[N * 4];

int n,m;

int w[N];


void pushup(auto& u,auto& l,auto& r){
    u.sum = l.sum + r.sum;
    u.lmax = max(l.lmax,l.sum + r.lmax);
    u.rmax = max(r.rmax,r.sum + l.rmax);
    u.v = max({l.v,r.v,l.rmax + r.lmax});
}
void build(int u,int l,int r){
    if(l == r) tr[u] = {l,r,w[r],w[r],w[r],w[r]};
    else{
        tr[u] = {l,r};
        int mid = l + r >> 1;
        build(u * 2,l,mid),build(u * 2 + 1,mid + 1,r);
        pushup(tr[u],tr[u * 2],tr[u * 2 + 1]);
    }
}

void update(int u,int x,int v){
    if(tr[u].l == x && tr[u].r == x) tr[u] = {x,x,v,v,v,v};
    else{
        int mid = tr[u].l + tr[u].r >> 1;
        if(x <= mid) update(u * 2,x,v);
        else update(u * 2 + 1,x,v);
        pushup(tr[u],tr[u * 2],tr[u * 2 + 1]);
    }
}

Node query(int u,int l,int r){
    if(l <= tr[u].l && r >= tr[u].r) return tr[u];
    int mid = tr[u].l + tr[u].r >> 1;
    if(l > mid) return query(u * 2 + 1,l,r);
    else if(r <= mid) return query(u * 2,l,r);
    else{
        auto a = query(u * 2,l,r),b = query(u * 2 + 1,l,r);
        Node ret{};
        pushup(ret,a,b);
        return ret;
    }
    
}
int main(){
    cin >> n >> m;
    for(int i = 1;i <= n;i++) cin >> w[i];
    build(1,1,n);
    while(m--){
        int k,x,y;
        cin >> k >> x >> y;
        if(k == 1){
            if(x > y) swap(x,y);
            cout << query(1,x,y).v << "\n";
        }else update(1,x,y);
    }
    
}
```
- 区间修改：lazy 标记
- 区间分开时将标记下传

给定一个长度为 N 的数列 A，以及 M 条指令，每条指令可能是以下两种之一：

C l r d，表示把 A[l],A[l+1],…,A[r] 都加上 d。
Q l r，表示询问数列中第 l∼r 个数的和。
对于每个询问，输出一个整数表示答案。

#### 输入格式
第一行两个整数 N,M。

第二行 N 个整数 A[i]。

接下来 M 行表示 M 条指令，每条指令的格式如题目描述所示。

#### 输出格式
对于每个询问，输出一个整数表示答案。

每个答案占一行。

#### 数据范围
$1≤N,M≤10^5$,   
$|d|≤10000$,  
$|A[i]|≤10^9$  
#### 输入样例：
10 5  
1 2 3 4 5 6 7 8 9 10  
Q 4 4  
Q 1 10  
Q 2 4  
C 3 6 3  
Q 2 4
#### 输出样例：
4  
55  
9  
15  
```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 1e5 + 10;
int a[N];
struct Node{
    int l,r;
    long sum,add;
}tr[4 * N];
int n,m;

void pushup(int u){
    tr[u].sum = tr[u* 2].sum + tr[u * 2 + 1].sum;
}
void build(int u,int l,int r){
    if(l == r) tr[u] = {l,r,a[l],0};
    else{
        tr[u] = {l,r};
        int mid = l + r >> 1;
        build(2 * u,l,mid),build(2 * u + 1,mid + 1,r);
        pushup(u);
    }
}

void pushdown(int u){
    auto& t = tr[u],&l = tr[u * 2],&r = tr[u * 2 + 1];
    if(t.add){
        l.sum += t.add * (l.r - l.l + 1);
        r.sum += t.add * (r.r - r.l + 1);
        l.add += t.add;
        r.add += t.add;
        t.add = 0;
    }
}
void update(int u,int l,int r,long c){
    if(l <= tr[u].l && tr[u].r <= r){
        tr[u].sum += c * (tr[u].r - tr[u].l + 1);
        tr[u].add += c;
    }else{
        pushdown(u);
        int mid = tr[u].l + tr[u].r >> 1;
        if(l <= mid) update(2 * u,l,r,c);
        if(r > mid) update(2 * u + 1,l,r,c);
        pushup(u);
    }
}

long query(int u,int l,int r){
    if(tr[u].l >= l && tr[u].r <= r) return tr[u].sum;
    pushdown(u);
    int mid = tr[u].l + tr[u].r >> 1;
    long res = 0;
    if(l <= mid) res += query(u * 2,l,r);
    if(r > mid) res += query(2 * u + 1,l,r);
    return res;
}
int main(){
    cin >> n >> m;
    for(int i = 1;i <= n;i++) cin >> a[i];
    build(1,1,n);
    while(m--){
        char op;
        int l,r;
        cin >> op >> l >> r;
        if(op == 'C'){
            int d;
            cin >> d;
            update(1,l,r,d);
        }else{
            cout << query(1,l,r) << '\n';
        }
    }
}
```


## 并查集

给定一个包含n个点（编号为1~n）的无向图，初始时图中没有边。

现在要进行m个操作，操作共有三种：

“C a b”，在点a和点b之间连一条边，a和b可能相等；
“Q1 a b”，询问点a和点b是否在同一个连通块中，a和b可能相等；
“Q2 a”，询问点a所在连通块中点的数量；

#### 输入格式

第一行输入整数n和m。

接下来m行，每行包含一个操作指令，指令为“C a b”，“Q1 a b”或“Q2 a”中的一种。

#### 输出格式

对于每个询问指令”Q1 a b”，如果a和b在同一个连通块中，则输出“Yes”，否则输出“No”。

对于每个询问指令“Q2 a”，输出一个整数表示点a所在连通块中点的数量

每个结果占一行。

#### 数据范围

$1≤n,m≤10^5$

#### 输入样例

5 5  
C 1 2  
Q1 1 2  
Q2 1  
C 2 5  
Q2 5  

#### 输出样例

Yes  
2  
3  

```cpp
#include<iostream>
using namespace std;

const int M = 1e5 + 10;
int p[M];
int size[M];
int find(int x){
    if(p[x] != x) p[x] = find(p[x]);
    return p[x];
}
int main(){
    int n,m;
    cin >>n>>m;
    for(int i = 1;i <=n;i++)
        p[i] = i,size[i] = 1;

    while(m--){
        char op[3];
        int a,b;
        cin >>op;
        if(op[0] == 'C'){
            cin >>a>>b;
            if(find(a) == find(b)) continue;  // 若在同一集合则跳过
            size[find(b)] += size[find(a)];
            p[find(a)] = find(b);
        }else{
            if(op[1] == '1'){
                cin >>a>>b;
                if(find(a) == find(b)){
                    cout <<"Yes";
                }else
                    cout <<"No";
                cout <<"\n";
            }else{
                cin >>a;
                cout <<size[find(a)] <<'\n';
            }
        }

    }

    return 0;
}
```

## 模拟堆

维护一个集合，初始时集合为空，支持如下几种操作：

"I x"，插入一个数x；
"PM"，输出当前集合中的最小值；
"DM"，删除当前集合中的最小值（数据保证此时的最小值唯一）；
"D k"，删除第k个插入的数；
"C k x"，修改第k个插入的数，将其变为x；
现在要进行N次操作，对于所有第2个操作，输出当前集合的最小值。

#### 输入格式

第一行包含整数N。

接下来N行，每行包含一个操作指令，操作指令为”I x”，”PM”，”DM”，”D k”或”C k x”中的一种。

#### 输出格式

对于每个输出指令“PM”，输出一个结果，表示当前集合中的最小值。

每个结果占一行。

#### 数据范围

$1≤N≤10^5$  
$−10^9≤x≤10^9$  
数据保证合法。

#### 输入样例

8  
I -10  
PM  
I -10  
D 1  
C 2 8  
I 6  
PM  
DM

#### 输出样例

-10  
6

```cpp

#include<iostream>
using namespace std;
#include<algorithm>
#include<cstring>
const int M = 1e5 + 10;
int h[M],size;
int hp[M]; // 堆中下标->插入下标
int ph[M]; // 插入下标->堆中下标


void heap_swap(int x,int y){
    swap(ph[hp[x]],ph[hp[y]]);
    swap(hp[x],hp[y]);
    swap(h[x],h[y]);
}

void down(int x){
    int t = x;
    if(2 * x <= size && h[2 * x] < h[t]) t = 2 * x;
    if(2 * x + 1 <= size && h[2 * x +1] < h[t]) t = 2 * x + 1;
    if(x != t){
        heap_swap(t,x);
        down(t);
    }
}



void up(int x){
    while(x/2 && h[x/2] > h[x]){
        heap_swap(x/2,x);
        x/=2;
    }
}

int main(){
    int n;
    cin >> n;
    string op;
    int m = 0;
    while(n--){
        cin >> op;
        if(op == "I"){
            int x;
            cin >> x;
            h[++size] = x;
            ++m;
            ph[m] = size;
            hp[size] = m;
            up(size);
        }else if(op == "PM"){
            cout << h[1] <<"\n";
        }else if(op == "DM"){
            heap_swap(1,size);
            size--;
            down(1);
        }else if(op == "D"){
            int x;
            cin >> x;
            x = ph[x];  // 保存删除位置
            heap_swap(x,size);
            size--;
            down(x),up(x);
        }else{
            int k,x;
            cin >> k >>x;
            h[ph[k]] = x;
            down(ph[k]),up(ph[k]);
        }
    }

    return 0;
}
```

## 模拟散列表

维护一个集合，支持如下几种操作：

“I x”，插入一个数x；
“Q x”，询问数x是否在集合中出现过；
现在要进行N次操作，对于每个询问操作输出对应的结果。

#### 输入格式

第一行包含整数N，表示操作数量。

接下来N行，每行包含一个操作指令，操作指令为”I x”，”Q x”中的一种。

#### 输出格式

对于每个询问指令“Q x”，输出一个询问结果，如果x在集合中出现过，则输出“Yes”，否则输出“No”。

每个结果占一行。

#### 数据范围

$1≤N≤10^5$  
$−10^9≤x≤10^9$

#### 输入样例

5  
I 1  
I 2  
I 3  
Q 2  
Q 5  

#### 输出样例

Yes  
No  

```cpp
#include<iostream>
using namespace std;
#include<cstring>
const int M = 1e5 + 3;
int h[M],e[M],ne[M],idx;
// chining
void insert(int x){
    int hv = (x % M + M )%M;
    e[idx] = x,ne[idx] = h[hv], h[hv] = idx++;
}
bool find(int x){
    int hv = (x % M + M )%M;
    for(int i = h[hv];i != -1;i = ne[i]){
        if(e[i] == x) return true;
    }
    return false;
}
int main(){
    memset(h,-1,sizeof(int)*M);
    cin.tie(0);
    ios::sync_with_stdio(false);
    int n;
    cin >> n;
    char op;
    int x;
    while(n--){
        cin >> op >> x;
        if(op == 'I') insert(x);
        else {
            if(find(x)) cout <<"Yes";
            else cout <<"No";
            cout <<"\n";

        }

    }


    return 0;
}
```

## 拓扑排序

给定一个n个点m条边的有向图，图中可能存在重边和自环。

请输出任意一个该有向图的拓扑序列，如果拓扑序列不存在，则输出-1。

若一个由图中所有点构成的序列A满足：对于图中的每条边(x, y)，x在A中都出现在y之前，则称A是该图的一个拓扑序列。

#### 输入格式

第一行包含两个整数n和m

接下来m行，每行包含两个整数x和y，表示存在一条从点x到点y的有向边(x, y)。

#### 输出格式

共一行，如果存在拓扑序列，则输出拓扑序列。

否则输出-1。

#### 数据范围

$1≤n,m≤10^5$  

#### 输入样例

3 3  
1 2  
2 3
1 3  

#### 输出样例

1 2 3

```cpp
#include<iostream>
#include<cstring>
#include<algorithm>
using namespace std;
const int M = 2e5 + 10;
int h[M],e[M],ne[M],idx;

int n,m;
int q[M],d[M];
void add(int a,int b){
    e[idx] = b,ne[idx] = h[a],h[a] = idx++;
}
bool topsort(){
    int hh =0 ,tt = -1;

    for(int i = 1;i <= n;i++)
        if(!d[i]) q[++tt] = i;
    while(hh <= tt){
        int t = q[hh++];

        for(int i = h[t];i != -1;i = ne[i]){
            int j = e[i];
            d[j] --;
            if(!d[j]) q[++tt] = j;
        }
    }
    return tt == n-1;
}
int main(){
    cin.tie(0);
    ios::sync_with_stdio(false);
    cin >> n>>m;
    int a,b;
    memset(h,-1,sizeof(h));
    for(int i = 0;i < m;i++){
        cin >> a>> b;
        add(a,b);
        d[b] ++;
    }

    if(topsort()){
        for(int i = 0;i < n;i++)
            cout << q[i] <<" ";
    }else{
        cout <<"-1";
    }

    return 0;
}  
```

## 最短路

### 朴素Dijkstra $O(n^2)$

* 没有负权边
* 稠密图 $m < n^2$
给定一个n个点m条边的有向图，图中可能存在重边和自环，所有边权均为正值。

请你求出1号点到n号点的最短距离，如果无法从1号点走到n号点，则输出-1。

#### 输入格式

第一行包含整数n和m。

接下来m行每行包含三个整数x，y，z，表示存在一条从点x到点y的有向边，边长为z。

#### 输出格式

输出一个整数，表示1号点到n号点的最短距离。

如果路径不存在，则输出-1。

#### 数据范围

$1≤n≤500,$  
$1≤m≤10^5,$  
图中涉及边长均不超过10000。

#### 输入样例

3 3  
1 2 2  
2 3 1  
1 3 4  

#### 输出样例

3

```cpp
#include<iostream>
#include<cstring>
using namespace std;

const int M = 510;
int g[M][M],d[M];
int n,m;
bool st[M];
#define INF 0x7f7f7f7f
int djstra(){

    d[1] =0 ;
    for(int i = 1;i <=n;i++){
        int t = -1;
        for(int j = 1;j <=n;j++){
            if(!st[j] && (t == -1 || d[j] < d[t])) t = j;
        }
        st[t] = 1;

        for(int j = 1;j <=n; j++){
            if(g[t][j] != INF) d[j] = min(d[j],d[t] + g[t][j]);
        }
    }
    if(d[n] == INF) return -1;
    return d[n];
}
int main(){
    cin >> n >> m;

    memset(g,0x7f,sizeof(g));
    memset(d,0x7f,sizeof(d));
    int a,b,c;
    while(m--){
        cin >> a>> b>> c;
        g[a][b] = min(g[a][b],c);
    }

    cout << djstra();

    return 0;
}
```

### 堆优化Dijkstra $O(mlogn)$

* 没有负权边
* 稀疏图
给定一个n个点m条边的有向图，图中可能存在重边和自环，所有边权均为非负值。

请你求出1号点到n号点的最短距离，如果无法从1号点走到n号点，则输出-1。

#### 输入格式

第一行包含整数n和m。

接下来m行每行包含三个整数x，y，z，表示存在一条从点x到点y的有向边，边长为z。

#### 输出格式

输出一个整数，表示1号点到n号点的最短距离。

如果路径不存在，则输出-1。

#### 数据范围

$1≤n,m≤10^5,$  
图中涉及边长均不小于0，且不超过10000。

#### 输入样例

3 3  
1 2 2  
2 3 1  
1 3 4  

#### 输出样例

3

```cpp
#include<iostream>
#include<cstring>
#include<queue>
const int M = 1e5 + 10;
int h[M],e[M],ne[M],idx,w[M];
using namespace std;
void add(int a,int b,int c){
    e[idx] = b,w[idx] = c,ne[idx] = h[a],h[a] = idx++;
}
int n,m;
int d[M];
bool st[M];
#define INF 0x7f7f7f7f
typedef pair<int,int> PII;
int djs(){
    d[1] = 0;
    priority_queue<PII,vector<PII>,greater<PII>> pq;
    pq.push({0,1});
    while(pq.size()){
        auto t= pq.top();pq.pop();
        if(st[t.second]) continue;
        st[t.second] = 1;
        for(int i = h[t.second]; i != -1;i = ne[i]){
            int j = e[i];
            if(d[j] > d[t.second] + w[i]){
                d[j] = d[t.second] + w[i];
                pq.push({d[j],j});
            }
        }
    }
    if(d[n] == INF) return -1;
    return d[n];
}
int main(){
    cin.tie(0);
    ios::sync_with_stdio(false);
    cin >> n >> m;
    int a,b,c;
    memset(h,-1,sizeof(h));
    memset(d,0x7f,sizeof(d));
    while(m--){
        cin>> a>> b>> c;
        add(a,b,c);
    }
    cout << djs();
    return 0;
}
```

### B-F算法 $O(nm)$

* 允许负权边
* 用于求限制k条边的最短路

给定一个n个点m条边的有向图，图中可能存在重边和自环， 边权可能为负数。

请你求出从1号点到n号点的最多经过k条边的最短距离，如果无法从1号点走到n号点，输出impossible。

注意：图中可能 存在负权回路 。

#### 输入格式

第一行包含三个整数n，m，k。

接下来m行，每行包含三个整数x，y，z，表示存在一条从点x到点y的有向边，边长为z。

#### 输出格式

输出一个整数，表示从1号点到n号点的最多经过k条边的最短距离。

如果不存在满足条件的路径，则输出“impossible”。

#### 数据范围

$1≤n,k≤500,$  
$1≤m≤10000,$  
任意边长的绝对值不超过10000。

#### 输入样例

3 3 1
1 2 1  
2 3 1  
1 3 3

#### 输出样例

3

```cpp
#include<iostream>
#include<cstring>
using namespace std;

const int N = 510, M = 1e5 + 10;

struct Edge{
    int a,b,w;
}edges[M];
int n,m,k;
bool st[N];
int d[N];
int backup[N]; // 备份上一次循环的结果

int bf(){
    memset(d,0x7f,sizeof(d));
    d[1] = 0;
    for(int i = 0;i < k;i++){
        memcpy(backup,d,sizeof(d));
        for(int j = 0;j <m;j++){
            // 使用上一次循环结果更新， 防止连续更新
            if(d[edges[j].b] > backup[edges[j].a] + edges[j].w){
                d[edges[j].b] = backup[edges[j].a] + edges[j].w;
            }
        }
    }
    // 由于负权边 d[n] 可能比INF小
    if(d[n] > 0x7f7f7f7f /2) return -1;
    return d[n];
}
int main(){
    cin >> n >> m>>k;
    int a,b,c;
    for(int i = 0;i < m;i++){
        cin >> a>> b >> c;
        edges[i] = {a,b,c};
    }

    int res = bf();
    if(res == -1) cout <<"impossible";
    else cout << res;
    return 0;
}
```

### spfa 平均$O(m)$ 最坏$O(nm)$

> bf算法每次遍历所有边，spfa仅更新距离发生变化的边

```cpp
#include<iostream>
#include<cstring>
#include<queue>
using namespace std;
const int M = 1e5 + 10;

int h[M],e[M],ne[M],w[M],idx;
void add(int a,int b,int c){
    e[idx] = b,w[idx] = c,ne[idx] = h[a],h[a] = idx ++;
}

int n,m;
int d[M];
bool st[M];
int spfa(){
    memset(d,0x7f,sizeof(d));

    d[1] = 0;
    queue<int> q;
    q.push(1);
    st[1] = 1;
    while(q.size()){
        int t = q.front();
        q.pop();
        st[t] = 0;
        for(int i = h[t];i != -1;i = ne[i]){
            int j = e[i];
            if(d[j] > d[t] + w[i]){
                d[j] = d[t] + w[i];
                if(!st[j]) {
                    st[j] = 1;
                    q.push(j);
                }
            }
        }
    }
    if(d[n] > 0x7f7f7f7f /2 ) return -1;
    return d[n];
}
int main(){
    memset(h,-1,sizeof(h));
    cin >> n >> m;
    int a,b,c;
    while(m--){
        cin >> a>>b>>c;
        add(a,b,c);
    }
    int res = spfa();
    if(res == -1) cout <<"impossible";
    else cout << res;

    return 0;
}
```
### spfa找负环
- 判断最短路径的长度是否大于等于n

```cpp
#include<iostream>
#include<cstring>
#include<queue>
using namespace std;
const int M = 1e5 + 10;
const int N = 10010;
int h[M],e[M],ne[M],w[M],idx;
void add(int a,int b,int c){
    e[idx] = b,w[idx] = c,ne[idx] = h[a],h[a] = idx ++;
}

int n,m;
int d[M];
bool st[M];
int cnt[N];
int spfa(){
    queue<int> q;
    for(int i = 1;i <= n;i++){
        q.push(i);
        st[i] = 1;
    }
    while(q.size()){
        int t = q.front();
        q.pop();
        st[t] = 0;
        for(int i = h[t];i != -1;i = ne[i]){
            int j = e[i];
            if(d[j] > d[t] + w[i]){
                d[j] = d[t] + w[i];
                cnt[j] = cnt[t] + 1;
                if(cnt[j] >= n) return true;
                if(!st[j]) {
                    st[j] = 1;
                    q.push(j);
                }
            }
        }
    }
    return false;
}
```



## 最小生成树

### 朴素prim  $O(n^2)$

* 用于稠密图

给定一个n个点m条边的无向图，图中可能存在重边和自环，边权可能为负数。

求最小生成树的树边权重之和，如果最小生成树不存在则输出impossible。

给定一张边带权的无向图G=(V, E)，其中V表示图中点的集合，E表示图中边的集合，n=|V|，m=|E|。

由V中的全部n个顶点和E中n-1条边构成的无向连通子图被称为G的一棵生成树，其中边的权值之和最小的生成树被称为无向图G的最小生成树。

#### 输入格式

第一行包含两个整数n和m。

接下来m行，每行包含三个整数u，v，w，表示点u和点v之间存在一条权值为w的边。

#### 输出格式

共一行，若存在最小生成树，则输出一个整数，表示最小生成树的树边权重之和，如果最小生成树不存在则输出impossible。

#### 数据范围

$1≤n≤500,$  
$1≤m≤10^5,$  
图中涉及边的边权的绝对值均不超过10000。

#### 输入样例

4 5  
1 2 1  
1 3 2  
1 4 3  
2 3 2  
3 4 4  

#### 输出样例

6

```cpp
#include<iostream>
#include<cstring>
using namespace std;
const int M = 510;
const int INF =0x7f7f7f7f;
int g[M][M];
int n,m;
int d[M];
bool st[M];

int prim(){
    int res = 0;
    // 循环n次，每次加入一个点到mst集合
    for(int i = 0; i< n;i++){
        int t = -1;
        for(int j = 1; j<=n;j++){
            if(!st[j] && (t == -1 || d[j] < d[t])) t =  j;
        }
        if(i && d[t] == INF) return -1; 
        st[t] = 1;
        if(i) res += d[t];
        for(int j = 1;j <=n;j++){
            if(g[t][j] != INF){
                d[j] = min(d[j],g[t][j]);
            }
        }
    }
    return res;
}
int main(){
    memset(d,0x7f,sizeof d);
    cin >> n >> m;
    for(int i = 1;i <=n;i++)
        for(int j = 1;j <=n;j++)
            if(i == j) g[i][j] = 0;
            else g[i][j] = INF;
    int a,b,c;
    while(m--){
        cin >> a>>b>>c;
        g[a][b] = g[b][a] = min(g[a][b],c);
    }
    int res = prim();
    if(res == -1) cout << "impossible";
    else cout << res;
    return 0;
}
```

### 克鲁斯卡尔 $O(mlogm)$

* 用于稀疏图
给定一个n个点m条边的无向图，图中可能存在重边和自环，边权可能为负数。

求最小生成树的树边权重之和，如果最小生成树不存在则输出impossible。

给定一张边带权的无向图G=(V, E)，其中V表示图中点的集合，E表示图中边的集合，n=|V|，m=|E|。

由V中的全部n个顶点和E中n-1条边构成的无向连通子图被称为G的一棵生成树，其中边的权值之和最小的生成树被称为无向图G的最小生成树。

#### 输入格式

第一行包含两个整数n和m。

接下来m行，每行包含三个整数u，v，w，表示点u和点v之间存在一条权值为w的边。

#### 输出格式

共一行，若存在最小生成树，则输出一个整数，表示最小生成树的树边权重之和，如果最小生成树不存在则输出impossible。

#### 数据范围

$1≤n≤105,$  
$1≤m≤2∗10^5,$  
图中涉及边的边权的绝对值均不超过1000。

#### 输入样例

4 5  
1 2 1  
1 3 2  
1 4 3  
2 3 2  
3 4 4  

#### 输出样例

6

```cpp
#include<iostream>
#include<cstring>
#include<algorithm>
using namespace std;
const int M = 2e5 + 10;

struct Edge{
    int a,b,w;
    bool operator <(const Edge& e){
        return w < e.w;

    }
}e[M];
int n,m;
int p[M];
int find(int x){
    if(p[x] != x) p[x] = find(p[x]);
    return p[x];
}
int main(){
    cin >> n >> m;
    for(int i = 1;i <=n;i++)
        p[i] = i;
    int a,b,c;
    for(int i = 0; i < m;i++){
        cin >> a>>b>>c;
        e[i] = {a,b,c};
    }

    sort(e,e + m);

    int res = 0,cnt = 0;
    for(int i = 0;i < m;i++){
        a = find(e[i].a),b = find(e[i].b);
        if(a != b){
            p[a] = b;
            cnt ++;
            res += e[i].w;
        };
    }

    if(cnt != n-1) cout <<"impossible";
    else cout << res;

    return 0;
}

```

## 二分图

* 充要条件: 没有奇数环

### 染色法判定二分图

给定一个n个点m条边的无向图，图中可能存在重边和自环。

请你判断这个图是否是二分图。

#### 输入格式

第一行包含两个整数n和m。

接下来m行，每行包含两个整数u和v，表示点u和点v之间存在一条边。

#### 输出格式

如果给定图是二分图，则输出“Yes”，否则输出“No”。

#### 数据范围

$1≤n,m≤10^5$

#### 输入样例

4 4  
1 3  
1 4  
2 3  
2 4

#### 输出样例

Yes

```cpp
#include<iostream>
#include<cstring>
using namespace std;
const int M = 2e5 + 10;
int h[M],e[M],ne[M],idx;

int color[M];
void add(int a,int b){
    e[idx] = b,ne[idx] = h[a],h[a] = idx++;
}
int n,m;

// 将点u染成c色
bool dfs(int u,int c){
    color[u] = c;
    for(int i = h[u];i !=-1;i = ne[i]){
        int j = e[i];
        if(!color[j]){
            if(!dfs(j,3 - c)) return false;
        }else if(color[j] == c) return false;

    }
    return true;
}

int main(){
    memset(h,-1,sizeof h);
    cin >> n>>m;
    int a,b;
    while(m--){
        cin >> a>>b;
        add(a,b),add(b,a);
    }
    bool res = true;
    for(int i = 1;i <=n;i++){
        if(!color[i]){
            if(!dfs(i,1)){
                res = false;
                break;
            }
        }
    }
    if(res) cout << "Yes";
    else cout <<"No";

    return 0;
}
```

### 最大匹配

给定一个二分图，其中左半部包含n1个点（编号1~n1），右半部包含n2个点（编号1~n2），二分图共包含m条边。

数据保证任意一条边的两个端点都不可能在同一部分中。

请你求出二分图的最大匹配数。

> 二分图的匹配：给定一个二分图G，在G的一个子图M中，M的边集{E}中的任意两条边都不依附于同一个顶点，则称M是一个匹配。
> 二分图的最大匹配：所有匹配中包含边数最多的一组匹配被称为二分图的最大匹配，其边数即为最大匹配数。

#### 输入格式

第一行包含三个整数 n1、 n2 和 m。

接下来m行，每行包含两个整数u和v，表示左半部点集中的点u和右半部点集中的点v之间存在一条边。

#### 输出格式

输出一个整数，表示二分图的最大匹配数。

#### 数据范围

$1≤n1,n2≤500,$  
$1≤u≤n1,$  
$1≤v≤n2,$  
$1≤m≤10^5$

#### 输入样例

2 2 4  
1 1  
1 2  
2 1  
2 2

#### 输出样例

2

```cpp
#include<iostream>
#include<cstring>
using namespace std;

const int N = 510,M = 1e5 + 10;
int h[M],e[M],ne[M],idx;
int n1,n2,m;
bool st[N];
int match[N];
void add(int a,int b){
    e[idx] = b,ne[idx]= h[a],h[a] = idx++;
}
// 为x找到对应点
bool find(int x){

    for(int i = h[x]; i != -1; i = ne[i]){
        int j = e[i];
        if(!st[j]){ // 女生j没有访问过
            st[j] = 1;
            if(match[j] == 0 || find(match[j])){ // 女生j没有男友或给j的男友找到新的女友
                match[j] = x;
                return true;
            }
        }
    }
    return false;
}


int main(){
    memset(h,-1,sizeof h);
    cin >> n1>> n2>>m;
    int a,b;
    while(m--){
        cin >> a>>b;
        add(a,b);
    }
    int res = 0;
    for(int i = 1;i <=n1;i++){
        memset(st,0,sizeof st); // 将女生初始化，每个女生仅访问一次
        if(find(i)) res++;
    }
    cout << res;
    return 0;
}
```

## 简单数学

* 对于正整数n，仅有一个大于$\sqrt{n}$的素数

### 筛素数

#### 埃氏筛法 $O(nloglogn)$

```cpp
#include<iostream>
using namespace std;

const int M = 1e6+ 10;
bool st[M];
int prime[M];
int main(){
    int n;

    cin >> n;
    int cnt = 0;
    for(int i =2;i <=n;i++){
        if(!st[i]){
            prime[cnt++];
            for(int j = i;j <=n;j +=i) // 筛掉i的倍数
                st[j] = true;
        }
    }
    cout << cnt;

    return 0;
}
```

#### 线性筛法 $O(n)$

* x只会被最小质因子筛掉

```cpp
#include<iostream>
using namespace std;

const int M = 1e6+ 10;
bool st[M];
int prime[M];
int main(){
    int n;

    cin >> n;
    int cnt = 0;
    for(int i =2;i <=n;i++){
        if(!st[i]) prime[cnt++] = i;
        for(int j = 0;prime[j] <= n/i;j++){
            st[prime[j] * i] = true; // prime[j] 小于i的所有质因子，则prime[j] 为 prime[j]*i 的最小质因子
            if(i % prime[j] == 0) break; // prime[j] 是i的最小质因子,因此，prime[j] 是i*prime[j] 的最小质因子
        }
    }
    cout << cnt;

    return 0;
}
```

### 约数

#### 求约数 $O(n\sqrt{n})$

```cpp
#include<iostream>
#include<algorithm>
#include<vector>
using namespace std;
vector<int> p;

int main(){
    int n;
    cin >> n;
    int x;
    while(n--){
        cin >> x;
        for(int i = 1;i <= x/i;i++){
            if(x % i == 0){
                p.push_back(i);
                if(i != x/i)p.push_back(x/i);
            }

        }
        sort(p.begin(),p.end());
        for(auto a : p)
            cout << a <<" ";
        cout <<"\n";
        p.clear();
    }


    return 0;
}
```

$$算数基本定理:N=\prod_{i=1}p_i^{\alpha_i}$$

#### 约数个数

> $[1,n]$中约数的个数等于每个数倍数的个数$\sum_{i=1}^{n}{\frac{n}{i}} = nlnn$
$$\prod_{i=1}^{n}(\alpha_i+1)$$

```cpp
#include<iostream>
#include<unordered_map>
using namespace std;
const int mod = 1e9 +7;

int n;
int main(){
    unordered_map<int,int> map;
    cin >> n;
    long res = 1;
    while(n--){
        int x;
        cin >> x;
        for(int i = 2;i <=x/i;i++){
            int cnt = 0;
            while(x % i == 0){
                x/=i;
                cnt ++;
            }
            if(cnt) map[i] += cnt;
        }
        if(x > 1) map[x] += 1;
    }
    for(auto a : map){
        res = res *(a.second + 1) %mod;
    }
    cout << res;

    return 0;
}
```

#### 约数之和

$$\prod_{i=1}^{n}\sum_{j=0}p_i^{\alpha_j}$$
给定n个正整数ai，请你输出这些数的乘积的约数之和，答案对109+7取模。

#### 输入格式

第一行包含整数n。

接下来n行，每行包含一个整数ai。

#### 输出格式

输出一个整数，表示所给正整数的乘积的约数之和，答案需对109+7取模。

#### 数据范围

$1≤n≤100,$  
$1≤ai≤2∗109$

#### 输入样例

3  
2  
6  
8
#### 输出样例

252

```cpp
#include<iostream>
#include<unordered_map>
using namespace std;
const int mod = 1e9 + 7;

int main(){
    int n;
    unordered_map<int,int> map;
    long res = 1;
    cin >> n;
    while(n--){
        int x;
        cin >> x;
        for(int i = 2;i <= x/i;i++){
            int cnt = 0;
            while(x % i == 0){
                x/=i;
                cnt ++;
            }
            if(cnt) map[i] += cnt;
        }
        if(x > 1) map[x] += 1;
    }

    for(auto t : map){
        long p = 1;
        int a = t.first,b = t.second;
        while(b--){
            p = (p * a + 1)%mod;
        }
        res = res * p %mod;
    }
    cout << res;
    return 0;
}
```

#### 欧几里得算法

* if d/a,d/b then d/(ax+by)

> $gcd(a,b) = gcd(b,a\ mod \ b)$  
> $gcd(a,b) = gcd(a - c*b)$  
> $d/a,d/b->d/(a-c*b)->d/(a-d*b+c*b)$  
> 公约数集合相同  

### 欧拉函数

* 互质:公约数只有1的两个整数

> $\phi(n):[1,n]中与n互质的数的个数$  
给定n个正整数ai，请你求出每个数的欧拉函数。

#### 欧拉函数的定义

1 ~ n 中与 n 互质的数的个数被称为欧拉函数，记为$\phi(n)$。
若在算数基本定理中， $N=p_1^{a_1}p_2^{a_2}...p_x^{a_x}$ ，则：
$\phi(n) = n\prod_{i=1}^x(1-\frac{1}{p_i})$

#### 输入格式

第一行包含整数n。

接下来n行，每行包含一个正整数ai。

#### 输出格式

输出共n行，每行输出一个正整数ai的欧拉函数。

#### 数据范围

$1≤n≤100,$  
$1≤ai≤2∗10^9$

#### 输入样例

3  
3  
6  
8

#### 输出样例

2  
2  
4

```cpp
#include<iostream>
using namespace std;
int main(){
    int n;
    cin >> n;
    while(n--){
        int x;
        cin >> x;
        int res = x;
        for(int i = 2;i <=x/i;i++)
            if(x % i == 0){
                res = res / i * (i - 1);
                while(x % i == 0){
                    x/=i;
                }
            }
        if(x > 1) res = res /x*(x-1);
        cout << res << endl;
    }
    return 0;
}
```

### 筛法求欧拉函数

给定一个正整数n，求1~n中每个数的欧拉函数之和。

#### 输入格式

共一行，包含一个整数n。

#### 输出格式

共一行，包含一个整数，表示1~n中每个数的欧拉函数之和。

#### 数据范围

$1≤n≤10^6$

#### 输入样例

6

#### 输出样例

12

```cpp
#include<iostream>
using namespace std;

const int M = 1e6 + 10;
bool st[M];
int primes[M];
int cnt;
int phi[M];
int main(){
    int n;
    cin >> n;
    phi[1] = 1;
    for(int i = 2;i <=n;i++){
        if(!st[i]){
            primes[cnt++] = i;
            phi[i] = i-1;
        }
        for(int j = 0;primes[j]<=n/i;j++){
            st[primes[j] * i] = true;
            if(i % primes[j] == 0){
                // primes[j] 为i的质因子
                phi[i * primes[j]] = phi[i]*primes[j];
                break;
            }
            phi[i * primes[j]] = phi[i]*(primes[j] - 1);
        }

    }

    long res = 0;
    for(int i =1;i <=n;i++) res += phi[i];
    cout << res;

    return 0;
}
```

### 欧拉定理

$a,n互质,a^{\phi(n)}\equiv1(mod\ n)$

#### 证明

$let\ [1,n]中与n互质的数为a_1,a_2,...,a_{\phi(n)}$  
$则aa_1,aa_2,...,aa_{\phi(n)}\ mod\ n 与a_1,a_2,...a_{\phi(n)}为同一集合$  
> 反证：若$aa_i=aa_j,则a(a_i-a_j)\equiv0(mod\ n),且a与n互质，则a_i=a_j,矛盾$  
$a^{\phi(n)}(a_1a_2...a_{\phi(n)})\equiv(a_1a_2...a_{\phi(n)}) (mod\ n)$  
$则a^{\phi(n)}\equiv1(mod\ n)$  

### 扩展欧几里得

给定n对正整数ai,bi，对于每对数，求出一组xi,yi，使其满足ai∗xi+bi∗yi=gcd(ai,bi)。
> $d = gcd(b,a-\lfloor{\frac{a}{b}}\rfloor*b,y,x)$  
> $即:x(a-\lfloor{\frac{a}{b}}\rfloor*b)+by = d$  
> $xa+(y-\lfloor{\frac{a}{b}}\rfloor*x) = d$

#### 输入格式

第一行包含整数n。

接下来n行，每行包含两个整数ai,bi。

#### 输出格式

输出共n行，对于每组ai,bi，求出一组满足条件的xi,yi，每组结果占一行。

本题答案不唯一，输出任意满足条件的xi,yi均可。

#### 数据范围

1≤n≤105,
1≤ai,bi≤2∗109

#### 输入样例

2  
4 6  
8 18 

#### 输出样例

-1 1  
-2 1  

```cpp
#include<iostream>
using namespace std;

int exgcd(int a,int b,int&x,int&y){
    if(!b){
        x = 1,y= 0; 
        return a;
    }

    int d = exgcd(b,a%b,y,x);
    y -= a/b*x;
    return d;

}
int main(){
    int n;
    cin >> n;
    while(n--){
        int a,b,x,y;
        cin >> a>>b;
        exgcd(a,b,x,y);
        cout << x<<" "<<y<<endl;
    }


    return 0;
}
```

### 高斯消元

输入一个包含n个方程n个未知数的线性方程组。

方程组中的系数为实数。

求解这个方程组。

#### 输入格式

第一行包含整数n。

接下来n行，每行包含n+1个实数，表示一个方程的n个系数以及等号右侧的常数。

#### 输出格式

如果给定线性方程组存在唯一解，则输出共n行，其中第i行输出第i个未知数的解，结果保留两位小数。

如果给定线性方程组存在无数解，则输出“Infinite group solutions”。

如果给定线性方程组无解，则输出“No solution”。

#### 数据范围

1≤n≤100,
所有输入系数以及常数均保留两位小数，绝对值均不超过100。

#### 输入样例

3  
1.00 2.00 -1.00 -6.00  
2.00 1.00 -3.00 -9.00  
-1.00 -1.00 2.00 7.00  

#### 输出样例

1.00  
-2.00  
3.00

```cpp
#include<bits/stdc++.h>
using namespace std;

const int M = 110;
double m[M][M];
const double esp = 1e-5;
int n;
void out(){
    for(int i = 0;i < n;i++){
        for(int j = 0;j <=n;j++)
            printf("%.2lf ",m[i][j]);
        cout <<"\n";
    }
    cout <<"\n";
}
int solve(){
    int r = 0;
    for(int c = 0;c <n;c++){

        int t = r;
        for(int i = r;i < n;i++)
            if(fabs(m[i][c]) > fabs(m[t][c])) t = i;
        if(fabs(m[t][c]) < esp) continue;
        for(int i = c;i <=n;i++) swap(m[t][i],m[r][i]);
        for(int i = n;i >=c;i--) m[r][i] /= m[r][c];
        for(int i = r + 1;i < n;i++){
            if(fabs(m[i][c]) > esp){
                for(int j = n;j >=c;j--)
                    m[i][j] -= m[r][j]*m[i][c];
            }
        }
        r++;
    }
    if(r < n){
        for(int i = r;i < n;i++)
            if(fabs(m[i][n]) > esp)
                return 2;
        return 1;

    }
    for(int i = n-1;i>=0;i--){
        for(int j = i + 1;j < n;j++)
            m[i][n] -= m[j][n]*m[i][j];
    }

    return 0;
}

int main(){
    cin >> n;
    for(int i = 0;i < n;i++)
        for(int j = 0;j <=n;j++)
            cin >> m[i][j];

    int t = solve();

    if(t == 1) cout <<"Infinite group solutions";
    else if(t == 2)cout <<"No solution";
    else{
        for(int i = 0;i<n;i++)
            printf("%.2lf\n",m[i][n]);

    }
    return 0;
}
```

## 贪心
### 区间选点
#### 题目描述

给定N个闭区间[ai,bi]，请你在数轴上选择尽量少的点，使得每个区间内至少包含一个选出的点。

输出选择的点的最小数量。

位于区间端点上的点也算作区间内。

#### 输入格式
第一行包含整数N，表示区间数。

接下来N行，每行包含两个整数ai,bi，表示一个区间的两个端点。

#### 输出格式
输出一个整数，表示所需的点的最小数量。

#### 数据范围
$1≤N≤10^5$,

$−10^9≤a_i≤b_i≤10^9$

#### 输入样例：
3  
-1 1  
2 4  
3 5 
#### 输出样例：
2
- 与最大不相交区间数量等价
- 区间右端点从小到大排序
- 证明最优解$Opt>= cnt$
  - cnt个点对应不相交的cnt个区间
```cpp
#include<iostream>
#include<algorithm>
#include<cstring>

using  namespace std;

const int N=1e5+10;

struct Range {
    int l,r;
    bool operator<(const Range &W)const{
        return r < W.r;
    }
}ranges[N];

int main(){
    int n;
    cin>>n;
    for(int i=0;i<n;i++)
    {
        int l,r;
        scanf("%d%d",&l,&r);
        ranges[i]={l,r};
    }
    sort(ranges,ranges+n);
    int res = 0,st = -1e9;
    for(int i = 0;i < n;i++){
        if(st < ranges[i].l){
            res++;
            st = ranges[i].r;
        }
    }
    cout<< res <<endl;
    return 0;
}
```

### 区间分组

#### 题目描述
给定 N 个闭区间 [ai,bi]，请你将这些区间分成若干组，使得每组内部的区间两两之间（包括端点）没有交集，并使得组数尽可能小。

输出最小组数。

#### 输入格式
第一行包含整数 N，表示区间数。

接下来 N 行，每行包含两个整数 ai,bi，表示一个区间的两个端点。

#### 输出格式
输出一个整数，表示最小组数。

#### 数据范围
$1≤N≤10^5$,

$−10^9≤a_i≤b_i≤10^9$

#### 输入样例：
3  
-1 1  
2 4  
3 5
#### 输出样例：
2

- 按区间左端点排序
- 从小到大处理每个区间
  - 判断是否能将其放入某个存在的组中 L[i] > max_r
    - 若不存在，则开新组
    - 否则，加入该组并更新max_r
```cpp
#include <algorithm>
#include <iostream>
#include <queue>
using namespace std;
const int N = 1e5 + 10;

int n;
struct range {
  int l, r;
  bool operator<(const range &W) const { return l < W.l; }
} ranges[N];

int main() {
  cin >> n;
  for (int i = 0; i < n; i++) {
    int a, b;
    cin >> a >> b;
    ranges[i] = {a, b};
  }

  sort(ranges, ranges + n);

  priority_queue<int, vector<int>, greater<int>> heap;
  for (int i = 0; i < n; i++) {
    if (heap.empty() || heap.top() >= ranges[i].l)
      heap.push(ranges[i].r); // 如果可以创建一个新的组合
    else {
      heap.pop();
      heap.push(ranges[i].r); // 不能创建一个新的组合，直接替换掉原来的组合
    }
  }
  cout << heap.size() << endl;
  return 0;
}
```
### 区间覆盖
#### 题目描述
给定N个闭区间[ai,bi]以及一个线段区间[s,t]，请你选择尽量少的区间，将指定线段区间完全覆盖。

输出最少区间数，如果无法完全覆盖则输出-1。

#### 输入格式
第一行包含两个整数s和t，表示给定线段区间的两个端点。

第二行包含整数N，表示给定区间数。

接下来N行，每行包含两个整数ai,bi，表示一个区间的两个端点。

#### 输出格式
输出一个整数，表示所需最少区间数。

如果无解，则输出-1。

#### 数据范围
$1≤N≤10^5$,  
$−10^9≤a_i≤b_i≤10^9$,  
$−10^9≤s≤t≤10^9$

#### 输入样例：
1 5  
3  
-1 3  
2 4  
3 5  
#### 输出样例：
2

- 按区间左端点从小到大排序
- 枚举每个区间，在所有能覆盖start的区间中，选择右端点最大的区间，然后将start更新为右端点最大值

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
const int N = 1e5 + 10;

int n;
struct Range{
    int l, r;
    bool operator < (const Range & R) const{
        return l < R.l;
    }
}range[N];

int main(){
    int st, ed;
    cin >> st >> ed >> n;
    for(int i = 0; i < n; i ++) cin >> range[i].l >> range[i].r;

    sort(range, range + n);//将各个区间按左端点从小到大排序

    int res = 0;
    bool flag = false;
    for(int i = 0 ; i < n; i ++){
        int j = i, r = -2e9;
        while(j < n && range[j].l <= st){//找到在指定区间左侧且右端点最靠右的区间
            r = max(r, range[j].r);
            j ++;
        }
        if(r < st){//所有区间的有端点均小于指定区间左端点,即无解
            res = -1;
            break;
        }

        res ++;

        if(r >= ed){//已经找到答案
            flag = true;
            break;
        }

        i = j - 1;
        st = r;
    }

    if(flag) cout << res << endl;
    else cout << "-1" << endl;

    return 0;
}
```