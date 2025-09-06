# Amazon.co.jp 商品URLクリーナー 🔗🧹
**Canonicalize to `/dp/ASIN` · Remove tracking · Optional affiliate `tag` keep · SPA/History-safe**

Amazon.co.jp の商品ページURLを **常に `/dp/ASIN` に正規化** し、`qid`, `ref`, `psc` などのトラッキング/ノイズなクエリを削除します。  
必要に応じて **許可したクエリのみ保持**（例: `tag` でアフィリエイト維持）。SPA遷移・History API・`location.assign/replace`・アンカークリックまでフックし、**画面遷移のたびにURLが汚れない** ようにします。

- 🧼 **クリーンURL**：`/dp/ASIN` へ統一（`/gp/product`, `/gp/aw/d` もOK）
- 🛡️ **最小干渉**：`amazon.co.jp` 以外は不触・`_blank`/`download`/`rel=external` を尊重
- ⚙️ **柔軟**：`KEEP_KEYS` で保持したいクエリをホワイトリスト化（例: `['tag']`）
- ⚡ **軽量**：`document-start` で即時正規化＋短時間ウォッチドッグ
- 🧭 **SPA対応**：History API, `location.assign/replace`, アンカー事前正規化

---

## 🔧 インストール

1. ブラウザに [**Violentmonkey**](https://violentmonkey.github.io/) または [**Tampermonkey**](https://www.tampermonkey.net/) をインストール  
2. こちらのスクリプトをインストール：  
    https://raw.githubusercontent.com/koyasi777/amazon-jp-url-cleaner/main/amazon-jp-url-cleaner.user.js
3. 既定では **全クエリ削除**。アフィリエイト `tag` を残したい場合は下記を編集します：

    ```js
    // 例: アフィリエイトタグを保持する
    const KEEP_KEYS = ['tag'];

    // 言語プレフィックス（/-/en など）は自動保持
    ```

---

## ✨ Before / After

- `https://www.amazon.co.jp/gp/product/B0XXXXXXX?ref_=abc&psc=1&qid=12345`  
  ⮕ `https://www.amazon.co.jp/dp/B0XXXXXXX`
- `https://www.amazon.co.jp/-/en/gp/aw/d/B0YYYYYYYY?tag=myid-22#frag`  
  ⮕ `https://www.amazon.co.jp/-/en/dp/B0YYYYYYYY?tag=myid-22#frag`

> フラグメント（`#...`）は常に保持。`/-/en/` など **言語プレフィックス** も保持します。

---

## 🎯 対応URLパターン

    https://www.amazon.co.jp/dp/*
    https://www.amazon.co.jp/*/dp/*
    https://www.amazon.co.jp/-/*/dp/*
    https://www.amazon.co.jp/gp/product/*
    https://www.amazon.co.jp/-/*/gp/product/*
    https://www.amazon.co.jp/gp/aw/d/*
    https://www.amazon.co.jp/-/*/gp/aw/d/*

---

## ⚙️ 実装のポイント

- **ASIN抽出**：`/dp/ASIN`, `/gp/product/ASIN`, `/gp/aw/d/ASIN`
- **クエリ保持**：`KEEP_KEYS` を小文字比較でホワイトリスト、重複値も維持
- **安全弁**：`amazon.co.jp` のみ処理、外部/別スキームは無改変
- **フック**：`history.pushState/replaceState`, `location.assign/replace`, クリック事前正規化
- **ウォッチドッグ**：初期〜短時間だけ定期チェック（過剰な常駐処理なし）

---

## 🔒 プライバシー

- ネットワーク送信・外部API **なし**。ブラウザ内で完結します。

---

## 🧩 既知の制限

- 対象は **Amazon.co.jp** のみ。他リージョンはスコープ外  
- `ASIN` がURLに含まれない特殊ページは処理対象外

---

## 🏗 開発

- リポジトリ: `amazon-jp-url-cleaner`  
- PR/Issue 歓迎: https://github.com/koyasi777/amazon-jp-url-cleaner/issues

---

## 📜 ライセンス

MIT License © koyasi777

> Disclaimer: 本プロジェクトは Amazon 公式ではなく、Amazon 商標とは関係ありません。
