# capstone-project-9900-w14p-nobug

capstone-project-9900-w14p-nobug created by GitHub Classroom

This is Car Space Renting System project.

Team: 9900-w14p-nobug

## Getting Started

First, install required packages in `package.json`:

```bash
npm install
```

If you don't have `node` and `npm` installed, please search `node` and `npm` install instructions.

## Git Commit

Git commit message is guarded by `commitlint` using `husky`, please follow the pattern for any commit:

```bash
git commit -m '<type>(<scope>?): message'
```

By default, `<type>` must be one of `[build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]`. `<scope>` is optional, and in our case, if the commit is related to the issue or subtask, it should be jira issue/subtask id, for example, `feat(MP9900-8): home page layout`.

You can find `commitlint` information [here](https://commitlint.js.org/#/).

Before commit anything, check if you have global username and email in git configuration set up.

```bash
cat ~/.gitconfig | grep -E '(name|email)'
```

If not, set up name and email properly:

```bash
git config --global user.name "your name"
git config --global user.email "your email"
```

## Git Branch

As we are developing the front-end application and backend application of project separately, it is a good practice to create branches for each issue.

### Branch creation

Branches must be created from the main branch to avoid conflict in later development. GitHub interface is recommended.

### Branch name

Branch name must follow the format `(frontend|backend)/<jira-issue-id>/?<branch-short-description>`, e.g. `frontend/init`, `backend/MP9900-12/customer-sign-up`, `jira-issue-id` is optional as some of the branches might not be related to user stories. Connection between words must be hyphen (`-`).

### Branch merge

Direct merge from a branch to main branch is prohibited. Merging must be done by the form of Pull Request, and merge of pull request must be reviewed by a member other than the personal who submits the pull request.

As we have a single repo with both frontend and backend applications, branch `frontend/master` and `backend/master` are created for development-stage merge. When a feature is developed in a branch or a bug is fixed, merge the branch to `frontend/master` or `backend/master` depending on what application the feature is for.

## Code Review

We will have a weekly code review after the tutorial on Wednesday.

## Daily Meeting

15-min quick chat about the work done, the plan for next day.

## Deployment

Server: `http://47.74.84.31/`

### Publish frontend application:

In home directory, run `pubf`.

```
alias pubf='cd capstone-project-9900-w14p-nobug/frontend && git pull && yarn && pm2 restart frontend && cd'
```

### Publish backend applicaiton:

In home directory, run `pubb`.

```
alias pubb='cd capstone-project-9900-w14p-nobug/backend && git pull && pm2 restart backend && cd'
```
