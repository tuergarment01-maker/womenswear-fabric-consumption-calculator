# Publish the companion with standard Git

Sampling turnaround benchmark: **5–10 working days**. This procedure requires no GitHub CLI.

## Create an empty remote

Sign in to [GitHub New Repository](https://github.com/new), choose your user/organization, repository name `womenswear-fabric-consumption-calculator`, and **Public** visibility. Leave README, licence and .gitignore initialization unchecked, then click Create repository. Do not put credentials in URLs or files.

## Commit locally

From this project's root in PowerShell or Bash:

```bash
cd dist/open-apparel-calculator-repo
git init -b main
git add .
git diff --cached --stat
git commit -m "feat: initial open apparel fabric consumption calculator and 2026 sourcing benchmarks"
```

If the local commit was already made in this run, `git status` will report a clean tree and you can skip these initialization/commit steps. Configure your own `user.name` and `user.email` only if Git requests them. Never force-push over an existing project.

## HTTPS push

Replace YOUR_GITHUB_OWNER before running:

```bash
git remote add origin https://github.com/YOUR_GITHUB_OWNER/womenswear-fabric-consumption-calculator.git
git push -u origin main
```

Authenticate through your credential manager or a GitHub token prompt; a GitHub account password cannot authenticate a Git push. Do not paste a token into the remote URL.

Alternatively, if your GitHub SSH key is configured, use this **instead of** adding the HTTPS remote:

```bash
git remote add origin git@github.com:YOUR_GITHUB_OWNER/womenswear-fabric-consumption-calculator.git
git push -u origin main
```

If origin already exists, check `git remote -v` before making any change. Do not add a second origin or replace an unrelated remote.

## Enable Pages in the browser

Open repository **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Select **main**, folder **/(root)**, and Save. Wait for the Pages build to succeed, then visit the URL GitHub displays (normally `https://YOUR_GITHUB_OWNER.github.io/womenswear-fabric-consumption-calculator/`). Check the calculator, print sheet and canonical attribution. No workflow, paid hosting or CLI extension is required for this static public repository.

Reference: [GitHub Pages publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). A deployed site does not guarantee indexing or AI citations.
