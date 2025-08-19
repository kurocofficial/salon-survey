# CORSエラーとは？完全解説

## 📖 CORSの基本概念

### CORS（Cross-Origin Resource Sharing）とは
**CORS**は「クロス・オリジン・リソース・シェアリング」の略で、Webブラウザのセキュリティ機能の一つです。

### オリジン（Origin）とは
オリジンは以下の3つの要素で構成されます：
- **プロトコル**（http:// または https://）
- **ドメイン**（example.com）
- **ポート番号**（:80、:443など）

#### オリジンの例
```
https://kurocofficial.github.io:443
├── プロトコル: https://
├── ドメイン: kurocofficial.github.io
└── ポート: 443（httpsのデフォルト）
```

## 🚫 同一オリジンポリシー（Same-Origin Policy）

### なぜ存在するのか
ブラウザは**セキュリティ上の理由**で、異なるオリジン間でのリソース共有を制限しています。

### 制限される例
```javascript
// ❌ 異なるオリジン間でのAjaxリクエストは制限される
// 現在のページ: https://kurocofficial.github.io
fetch('https://script.google.com/macros/s/.../exec') // 別オリジン
```

### 制限されない例
```javascript
// ✅ 同一オリジン間では問題なし
// 現在のページ: https://kurocofficial.github.io
fetch('https://kurocofficial.github.io/api/data') // 同一オリジン
```

## 🔄 CORSの仕組み

### 1. プリフライトリクエスト（Preflight Request）
複雑なリクエスト（POST、カスタムヘッダー等）の前に、ブラウザが自動的に送信する確認リクエスト。

```http
OPTIONS /exec HTTP/1.1
Host: script.google.com
Origin: https://kurocofficial.github.io
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

### 2. サーバーのレスポンス
サーバーは許可する条件をヘッダーで返答します。

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### 3. 実際のリクエスト
許可された場合のみ、実際のPOSTリクエストが送信されます。

## ❌ 今回発生したCORSエラー

### エラーメッセージ
```
Access to fetch at 'https://script.google.com/macros/s/.../exec' 
from origin 'https://kurocofficial.github.io' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### エラーの原因
1. **GitHub Pages**（`https://kurocofficial.github.io`）から
2. **Google Apps Script**（`https://script.google.com`）へ
3. **異なるオリジン間**でのPOSTリクエスト
4. **適切なCORSヘッダーが返されなかった**

## 🛠️ 解決方法

### 方法1: サーバー側でCORSヘッダーを設定
```javascript
// GAS側でヘッダーを設定（今回は失敗）
function doPost(e) {
  return ContentService
    .createTextOutput(result)
    .setHeaders({
      'Access-Control-Allow-Origin': '*'
    });
}
```

### 方法2: no-corsモードを使用（今回の解決策）
```javascript
// フロントエンド側でno-corsモードに変更
fetch(url, {
  method: 'POST',
  mode: 'no-cors', // ← CORSチェックを無効化
  body: JSON.stringify(data)
});
```

## 🔍 no-corsモードの特徴

### メリット
- ✅ CORSエラーが発生しない
- ✅ リクエストは正常に送信される
- ✅ サーバー側の処理は実行される

### デメリット
- ❌ レスポンスの内容を読み取れない
- ❌ エラーハンドリングが困難
- ❌ セキュリティ上の制限が緩くなる

### 使用場面
- フォーム送信など、送信のみが目的の場合
- サーバー側でのデータ処理が主目的の場合
- レスポンスの詳細が不要な場合

## 🌐 CORSが許可される例外

### 1. 単純リクエスト（Simple Request）
以下の条件をすべて満たすリクエストはCORSチェックが緩い：
- メソッド: GET、HEAD、POST
- ヘッダー: 標準的なもののみ
- Content-Type: text/plain、application/x-www-form-urlencoded、multipart/form-data

### 2. 同一オリジン
同じプロトコル・ドメイン・ポートなら制限なし

### 3. サーバーが適切なCORSヘッダーを返す場合

## 🔧 開発時のデバッグ方法

### 1. ブラウザの開発者ツール
```
F12 → Network タブ → リクエストの詳細を確認
- OPTIONS リクエストが送信されているか
- サーバーのレスポンスヘッダーを確認
- エラーメッセージの詳細を確認
```

### 2. CORS専用の拡張機能
- Chrome: "CORS Unblock"
- Firefox: "CORS Everywhere"
（開発時のみ使用推奨）

## 💡 実際のプロジェクトでの対策

### 1. フロントエンド側
```javascript
// プロキシサーバーを経由
fetch('/api/proxy/external-service', options)

// no-corsモード（送信のみ）
fetch(url, { mode: 'no-cors', ...options })
```

### 2. バックエンド側
```javascript
// Express.js の例
app.use(cors({
  origin: ['https://mydomain.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

### 3. 開発環境
```json
// package.json でプロキシ設定
{
  "proxy": "http://localhost:3001"
}
```

## 📚 まとめ

### CORSエラーが発生する理由
1. **セキュリティ**: 悪意のあるサイトからの不正アクセスを防ぐ
2. **ブラウザの制限**: 異なるオリジン間でのリソース共有を制限
3. **プリフライトリクエスト**: 複雑なリクエスト前の事前確認

### 解決のアプローチ
1. **サーバー側**: 適切なCORSヘッダーを設定
2. **クライアント側**: プロキシやno-corsモードを使用
3. **アーキテクチャ**: 同一オリジンでのAPI設計

### 今回のプロジェクトでの教訓
- Google Apps ScriptのCORS設定は複雑
- `no-cors`モードは送信専用の用途に適している
- 本格的なWebアプリケーションでは、適切なバックエンドAPI設計が重要

CORSは Web開発において避けて通れない重要な概念です。セキュリティとユーザビリティのバランスを取りながら、適切な解決策を選択することが大切です。