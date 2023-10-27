---
title: raft implement notice
tag: [distributed,raft]
---

1. server should convert to `follower` and set `currentTerm` to be `args's Term`, when receive a RPC message
2. when a `follower` is disconnected from cluster, connecting back later, it's term is large than the others. It will send requestVote to others (include `leader`), then current `leader` convert to `follow`, starting a new election. It will eventually convert to `leader`. Connected `follower` cannot acquire votes because `Election restriction`