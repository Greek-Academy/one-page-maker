# one-page-maker
1ページャメーカー

# インストール
[React×Firebaseでちゃんと開発するときの環境構築手順と解説](https://zenn.dev/tentel/articles/488dd8765fb059)
```
bun create vite@latest one-page-maker -- --template react-ts
cd one-page-maker
bun install
bun run dev
NG:bunx storybook init --builder @storybook/builder-vite
npx storybook init --builder @storybook/builder-vite
bun run storybook
bun install -D eslint
bun run lint
```

