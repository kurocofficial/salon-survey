# 送信エラー デバッグチェックリスト

## 1. ブラウザ側の確認

### 開発者ツールでエラー確認
1. F12キーで開発者ツールを開く
2. **Console**タブを確認
   - エラーメッセージの詳細を確認
   - CORS関連のエラーがないか確認
3. **Network**タブを確認
   - 送信リクエストが送られているか確認
   - レスポンスステータス（200, 404, 500など）を確認

## 2. GAS側の確認

### スプレッドシートID設定
```javascript
// Code.gsの6行目を確認
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
```
- [ ] 実際のスプレッドシートIDに置き換えているか
- [ ] スプレッドシートが存在するか
- [ ] アクセス権限があるか

### Webアプリ公開設定
- [ ] 「デプロイ」→「新しいデプロイ」を実行したか
- [ ] 種類：「ウェブアプリ」を選択したか
- [ ] 実行者：「自分」を選択したか
- [ ] アクセスできるユーザー：「全員」を選択したか

### 権限設定
- [ ] 初回実行時に権限を許可したか
- [ ] testFunction()が正常に実行できるか

## 3. テスト手順

### GAS単体テスト
1. Google Apps Scriptで`testFunction`を実行
2. スプレッドシートにテストデータが追加されることを確認
3. 実行ログでエラーがないことを確認

### WebアプリURL確認
1. WebアプリURLにブラウザでアクセス
2. 「ヘアサロンアンケート用GASが正常に動作しています！」と表示されることを確認

### script.js URL確認
1. `script.js`の79行目のURLが正しいWebアプリURLか確認
2. URLの末尾が`/exec`になっているか確認

## 4. よくあるエラーと対処法

### ❌ CORS エラー
**エラー例**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
**対処法**: 
- GASの公開設定で「アクセスできるユーザー」を「全員」に設定
- 新しいデプロイを作成

### ❌ 404 Not Found
**エラー例**: `Failed to fetch` または `404`
**対処法**:
- WebアプリURLが正しいか確認
- デプロイが完了しているか確認

### ❌ 500 Internal Server Error
**エラー例**: `500` エラー
**対処法**:
- スプレッドシートIDが正しいか確認
- GASの実行権限を確認
- testFunction()でエラーが出ないか確認

## 5. 修正後の確認手順

1. 問題を修正
2. GASを保存
3. 新しいデプロイを作成（必要に応じて）
4. WebアプリURLをscript.jsに反映
5. GitHubにプッシュ
6. GitHub Pagesで再テスト

## 緊急時の連絡先
- GASログ: https://script.google.com/
- スプレッドシート: [あなたのスプレッドシートURL]
- GitHub Pages: https://kurocofficial.github.io/salon-survey/