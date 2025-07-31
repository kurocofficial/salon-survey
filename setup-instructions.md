# セットアップ手順

## 1. Googleスプレッドシート連携の設定

### Google Apps Scriptの設定
1. [Google Apps Script](https://script.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. `google-apps-script.js` の内容をコピー&ペースト
4. スクリプトを保存

### スプレッドシートの準備
1. 新しいGoogleスプレッドシートを作成
2. スプレッドシートのIDをコピー（URLの `/d/` と `/edit` の間の部分）
3. Google Apps Scriptの `YOUR_SPREADSHEET_ID` を実際のIDに置き換え

### Webアプリとして公開
1. Google Apps Scriptで「デプロイ」→「新しいデプロイ」
2. 種類：「ウェブアプリ」を選択
3. 実行者：「自分」
4. アクセスできるユーザー：「全員」
5. デプロイをクリック
6. 生成されたWebアプリURLをコピー

### script.jsの更新
1. `script.js` の `YOUR_SCRIPT_ID` を実際のWebアプリURLに置き換え

## 2. Vercelでのデプロイ

### 前提条件
- Vercelアカウントの作成
- GitHubリポジトリの準備

### デプロイ手順
1. プロジェクトをGitHubにプッシュ
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Vercelでプロジェクトをインポート
3. 自動デプロイが完了

## 3. ローカル開発環境

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 4. トラブルシューティング

### CORS エラーが発生する場合
- Google Apps Scriptの公開設定を確認
- アクセス権限が「全員」になっているか確認

### データが送信されない場合
- ブラウザの開発者ツールでネットワークタブを確認
- Google Apps Scriptのログでエラーをチェック

### スプレッドシートにデータが表示されない場合
- スプレッドシートIDが正しいか確認
- Google Apps Scriptの実行権限を確認