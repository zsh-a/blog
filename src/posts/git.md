## The Three States
- **Modified** : have changed the file but not commited to the database.
-  **Staged** : have marked a modifed file in its current to be your next commit snapshot
-  **Committed** : the data have been stored in local database

## Viewing Your Staged and Unstaged Changes
- `git diff` : compares what is in your working directory with what is in your staging area.
- `git diff --staged` : compares your staged changes to your last commit

## Removing Files
- `git rm PROJECTS.md` : untrack "PROJECTS.md"

- `git rm --cached README` : keep the file on your hard drive but not have Git track it anymore.

## Moving Files
`$ git mv file_from file_to` is equivalent to running something like this:

```shell
$ mv README.md README
$ git rm README.md
$ git add README
```

## Undoing Things
when you commit early and forget to add some files, redo that commit, stage changes, and commit again using `--amend`.

```shell
$ git commit --amend
```
the second commit will replace the first.

## Unstaging a Staged File
- `git restore --staged` : unstage a staged file
- `git restore ` : unmodifying a modified file with git restore


# Git Branching
![](/image/PE/checkout_master.png)
- branch : a pointer to these commited metadata

- HEAD point to current branch

- `git checkout` switch branch  

- `git branch -d ` delete branch

- rename a branch  
  `$ git branch --move bad-branch-name corrected-branch-name`  
  push to remote  
  `$ git push --set-upstream origin corrected-branch-name`


