---
title: lexcial
tag: 
    - compiler
    - regex
    - NFA
    - DFA
---

## Regex to NFA

### Thompson's Algorithm

![](/image/reg.png)

Using the above basic elements, we can construct NFA recursively.
### Data Struct

```cpp
struct NFA_Node{

    NFA_Node* next_edge1_{nullptr},*next_edge2_{nullptr};
    // every node only have at most two edge in Thompson's Algorithm

    // 
    char value_{0};
    // 1 : accepted state
    // 0 : non-accepted state
    // State state_{}; 
    int id_ = -1;
    void add_edge(NFA_Node* to);
};
```

```cpp
class NFA{
    NFA_Node* start_{nullptr},*end_{nullptr};

public:
    // NFA(NFA_Node* start,NFA_Node* end):start_(start),end_(end){}
    NFA(char ch);
    void concat(NFA* to);
    void star();
    void un(NFA* second);
};
```

### Implement
evaluating a arithmetic expressions:

using a operator number stack and a operand stack.

1. if it's a number, push it on stack
2. if it's a oprand
   - it's `(` : push on the stack
   - it's `)` : pop and evaluate until `(`
   - if the priority of oprand in the top of stack greater than the current oprand, pop and evalation until current priority greater that the top's of stack then push it on stack
3. pop and evaluate the reminder elements in stack

evaluating a regex expression is similar to evaluating arithmetic expressions. The difference is that the star operation only pops one element from the stack. Additionally, the concatenation operation is not denoted by any symbol, so we would have to detect it. We insert `.` into regex to represent concatenation operation.

```cpp
auto isOperand = [](char ch){
    return ch != '(' && ch != '.' && ch != '|';
};


string s;
int prev = 0;
for(int i = 0;i < reg.size() - 1;i++){
    s += reg[i];
    auto next = reg[i + 1];
    if(isOperand(reg[i]) && next != '|' && next != '*' && next != ')'){
        s += '.';
    }
}
s += reg[reg.size() - 1];
```

## NFA to DFA

### Data Struct

```cpp
struct DFA_Node{
    enum class State{
        ACCEPT,NON_ACCEPT
    };
    int id_ = -1;
    State state_{State::NON_ACCEPT};

    vector<DFA_Node*> edges_;
    vector<char> values_;
    void add_edge(char value,DFA_Node* to);
};

struct DFA{
    DFA_Node* start_;
    unordered_map<int,DFA_Node*> id_to_node_;
    //...
};
```

### Sub-Set Construct Algorithm


- *Epsilon Closure*
  find all states can be arrived through $\epsilon$
  ```cpp
    set<int> NFA::epsilon_closure(const set<int>& st){
        auto res = st;

        stack<int> stk;
        for(auto u : st) stk.push(u);
        
        while(stk.size()){
            auto t = stk.top();stk.pop();
            auto node = id_to_node_[t];
            if(node->value_ == NFA_Node::EPSILON){
                if(node->next_edge1_ && !res.count(node->next_edge1_->id_)) {
                    res.insert(node->next_edge1_->id_);
                    stk.push(node->next_edge1_->id_);
                }

                if(node->next_edge2_ && !res.count(node->next_edge2_->id_)) {
                    res.insert(node->next_edge2_->id_);
                    stk.push(node->next_edge2_->id_);
                }
            }
        }
        return res;
    }
  ```

- *Move*
  find all states can be arrived through `value`
  ```cpp
    set<int> NFA::move(char value,const set<int>& st){
        set<int> res;
        for(auto u : st){   
            auto node = id_to_node_[u];
            if(node->value_ == value){
                if(node->next_edge1_) res.insert(node->next_edge1_->id_);
                if(node->next_edge2_) res.insert(node->next_edge2_->id_);
            }
        }
        return res;
    }
  ```

using the above operator, we can achieve sub-set construct algorithm

```
q0 <- epsilon_closure(n0)
R <- {q0}
Q <- q0

while(Q is not empty){
    pop q from Q
    foreach c in character{
        t <- epsilon_closure(move(q,c))
        D[q,c] <- t
        if(t has not in Q)
            Q <- t
    }
}
```

```cpp
DFA* NFA::to_DFA(){
    int idx = 0;

    DFA* dfa = new DFA{};

    struct Hash{
        size_t  operator()(const set<int>& st) const{
            size_t ret = 0;
            for(auto u : st) ret ^= hash<int>{}(u);
            return ret;
        }
    };

    unordered_map<set<int>,int,Hash> set_to_id;
    unordered_map<int,set<int>> id_to_set;

    auto out = [](const set<int> & st){
        cout << "set{";
        for(auto u : st) cout << u <<",";
        cout << "}\n";
    };

    queue<int> q;
    auto q0 = epsilon_closure({start_->id_});

    dfa->id_to_node_[idx] = new DFA_Node{id_:idx};

    id_to_set[idx] = q0;
    set_to_id[q0] = idx++;

    unordered_set<int> inq;

    q.push(0);

    inq.insert(0);

    while(q.size()){
        auto t = q.front();q.pop();
        for(int i = 1;i <= 127;i++){
            auto tt = epsilon_closure(move(i,id_to_set[t]));

            if(!tt.size()) continue;
            // out(tt); cout << char(i) << endl;
            
            if(!set_to_id.count(tt)){
                set_to_id[tt] = idx;
                id_to_set[idx] = tt;
                dfa->id_to_node_[idx] = new DFA_Node{id_:idx};
                idx++;
            }
            auto tt_id = set_to_id[tt];
            // cout << t <<" -> " << tt_id << endl;
            dfa->id_to_node_[t]->add_edge(i,dfa->id_to_node_[tt_id]);

            if(!inq.count(tt_id)){
                q.push(tt_id);
                inq.insert(tt_id);
            }
        }
    }

    for(auto& [k,v] : set_to_id){
        if(k.count(end_->id_)) dfa->id_to_node_[v]->state_ = DFA_Node::State::ACCEPT;
    }
    dfa->start_ = dfa->id_to_node_[0];
    return dfa;
}
```
## Mini-DFA
### Hopcroft Algorithm
1. Initially we place the states of the (not necessarily minimal) DFA into two
equivalence classes: final states and nonfinal states. 
2. We then repeatedly search for
an equivalence class X and an input symbol c such that when given c as input,
the states in X make transitions to states in k > 1 different equivalence classes.
We then partition X into k classes in such a way that all states in a given new class
would move to a member of the same old class on c. 

```cpp
void DFA::_split(vector<set<int>>& all_state,set<int>& cur_set){
    // auto& cur_set = all_state[index];
    if(cur_set.size() == 1) return;
    unordered_map<int,int> state_in_set;

    for(int i = 0; auto& v : all_state){
        for(auto u : v){
            state_in_set[u] = i;
        }
        i++;
    }

    // 
    unordered_map<int,set<int>> setId_to_state;

    bool splited = false;
    for(int i = 1;i <= 127;i++){
        for(auto st : cur_set){

            // if no trans from `st` through `i` char, then add `st` to it's new set.
            bool transed = false;
            for(int j = 0;auto nb : id_to_node_[st]->edges_){
                if(id_to_node_[st]->values_[j] == i){
                    setId_to_state[state_in_set[nb->id_]].insert(st);
                    transed = true;
                }
                j++;
            }
            if(!transed) setId_to_state[state_in_set[st]].insert(st);
        }

        if(setId_to_state.size() > 1){
            all_state.erase(find(all_state.begin(),all_state.end(),cur_set));
            for(auto& [k,v] : setId_to_state){
                all_state.push_back(v);
            }

            for(auto& [k,v] : setId_to_state){
                _split(all_state,v);
            }
            splited = true;
        }
        if(splited) break;

        setId_to_state.clear();
    }
    
}


DFA* DFA::min_DFA(){

    set<int> accepted,non_accepted;

    for(auto& [k,v] : id_to_node_){
        if(v->state_ == DFA_Node::State::ACCEPT) accepted.insert(k);
        else non_accepted.insert(k);
    }

    vector<set<int>> all_state;

    all_state.push_back(non_accepted);
    all_state.push_back(accepted);

    _split(all_state,accepted);
    _split(all_state,non_accepted);

    unordered_map<int,int> state_in_set;

    DFA* dfa = new DFA{};

    for(int i = 0;auto& s : all_state){
        dfa->id_to_node_[i] = new DFA_Node{id_:i};
        for(auto u : s)
            state_in_set[u] = i;
        i++;
    }

    struct Hash{

        size_t operator()(const pair<int,int>& pr) const{
            return hash<int>{}(pr.first) ^ hash<int>{}(pr.second);
        }
    };

    // iterate all of new states
    for(int i = 0;auto& s : all_state){
        // record added edges in case duplication
        unordered_set<pair<int,int>,Hash> record_edge; 
        // iterate all state in old dfa
        for(auto u : s){
            if(id_to_node_[u]->state_ == DFA_Node::State::ACCEPT)
                dfa->id_to_node_[state_in_set[u]]->state_ = DFA_Node::State::ACCEPT;
            // iterate all edges of node
            for(int j = 0;auto nb : id_to_node_[u]->edges_){
                // remove duplication
                // if the edge has not been record then add it 
                if(!record_edge.count({state_in_set[nb->id_],id_to_node_[u]->values_[j]})){
                    dfa->id_to_node_[i]->add_edge(id_to_node_[u]->values_[j],dfa->id_to_node_[state_in_set[nb->id_]]);
                    record_edge.insert({state_in_set[nb->id_],id_to_node_[u]->values_[j]});
                }
                j++;
            }
        }
        i++;
    }

    dfa->start_ = dfa->id_to_node_[state_in_set[0]];
    // reallocate id for every state for sequence
    dfa->alloc_id();
    return dfa;
}
```