# Amazon.co.jp URL Cleaner 🔗🧹

Amazon.co.jp の長くて読みにくい URL から、`/ref=` や各種トラッキング用クエリパラメータを自動で取り除き、  
**短く・クリーンで・共有しやすく・プライバシーに配慮したリンク**に変換する Userscript です。

- 対象サイト: `https://www.amazon.co.jp/*`
- 主な用途:  
  - Amazon.co.jp の URL 短縮・正規化  
  - `ref` などのトラッキングパラメータ削除  
  - 共有用リンクのクリーンアップ  
  - ブラウザ履歴のノイズ削減 / プライバシー保護
- 対応ブラウザ: Tampermonkey / Violentmonkey / Greasemonkey 等の Userscript マネージャーが動作する主要ブラウザ

---

## ✨ 特長 (Features)

### 1. 商品ページ URL を「/dp/ASIN」形式に正規化

次のような、非常に長い商品 URL:

```text
https://www.amazon.co.jp/Example-Product/dp/B012345678/ref=sr_1_1?pf_rd_p=xxxx&pf_rd_r=yyyy&qid=1234567890&sr=8-1
````

を、自動的に以下のようなシンプルな形に変換します:

```text
https://www.amazon.co.jp/dp/B012345678
```

* `/dp/ASIN` / `/gp/product/ASIN` / `/gp/aw/d/ASIN` などのパターンを認識し、ASIN を抽出
* 言語プレフィックス (`/-/en/`, `/-/es/` など) が付いている場合は、そのプレフィックスを維持
* 必要であれば、アフィリエイトタグなど一部のクエリパラメータだけをホワイトリスト方式で残すことも可能（後述の設定参照）

---

### 2. 検索結果・トップページなどで「機能は維持しつつ」トラッキングだけ削除

検索ページやトップページ・カテゴリページ等では、
**フィルタやソートなどの「機能に必要な」パラメータは残しつつ、トラッキング専用パラメータだけを削除**します。

例:

```text
https://www.amazon.co.jp/s?k=kindle&ref=nb_sb_noss_1&pf_rd_p=xxxx&pf_rd_r=yyyy&page=2&sort=price-asc-rank
```

を以下のようにクリーンアップ:

```text
https://www.amazon.co.jp/s?k=kindle&page=2&sort=price-asc-rank
```

* パス中の `/ref=...` はカット
* `pf_rd_*`, `pd_rd_*`, `qid`, `sr` など、明らかなトラッキング用パラメータを削除
* 検索ページ上では `k`, `keywords`, `rh`, `page`, `sort`, `node` など、検索条件やフィルタに必要なキーだけ特別に保持

---

### 3. SPA / 動的ナビゲーション対応

Amazon.co.jp はシングルページアプリケーション的な振る舞いが多く、
リンククリックや内部遷移で URL が何度も書き換えられます。

本スクリプトは以下をフックして、**常に URL をクリーンな状態に保ちます**:

* `history.pushState` / `history.replaceState` + `popstate` イベント
* `Location.assign` / `Location.replace`
* ページ内リンククリック (`<a href="...">` の左クリック)
* ページ読み込み直後からの監視用タイマー（ウォッチドッグ）

これにより、

* 内部遷移（SPA ナビゲーション）
* 戻る / 進む操作
* 遅延ロード後の URL 汚染

など様々なケースで、**自然に・ほぼリアルタイムに URL が正規化**されます。

---

### 4. プライバシー配慮 & 軽量設計

* 外部サーバーへの通信は一切行いません
* 解析対象は **自分のブラウザ内の URL のみ**
* `@grant none` で動作し、余計な権限を要求しません
* `document-start` でできる限り早期に URL を正規化

---

## 🛠 インストール方法 (Installation)

### 前提: Userscript マネージャーのインストール

ご利用のブラウザに、以下のいずれかの拡張機能をインストールしてください:

* [Tampermonkey](https://www.tampermonkey.net/)
* [Violentmonkey](https://violentmonkey.github.io/)
* [Greasemonkey](https://www.greasespot.net/) など

### スクリプトのインストール

1. 以下の URL をブラウザで開きます:
   `https://raw.githubusercontent.com/koyasi777/amazon-jp-url-cleaner/main/amazon-jp-url-cleaner.user.js`
2. Userscript マネージャーがインストール画面を表示するので「インストール」を選択
3. その後、`https://www.amazon.co.jp/` を開けば自動的にスクリプトが動作します

GitHub リポジトリ:
`https://github.com/koyasi777/amazon-jp-url-cleaner`

---

## 🚀 使い方 (Usage)

基本的には、**インストールするだけで何も操作は不要**です。

1. `https://www.amazon.co.jp/` にアクセス
2. 商品ページや検索結果ページへ移動
3. アドレスバーに表示される URL が自動的に短く・クリーンな形に変わっていきます

共有したいときは、アドレスバーの URL をコピーするだけで OK です。
すでにトラッキング情報等が削除され、**/dp/ASIN 形式や必要最低限のクエリだけが残った URL** になっています。

---

## 🧠 動作仕様の詳細 (Technical Details)

### 対象ホスト

* `*.amazon.co.jp` のみを厳密に判定
* その他のサイト (`amazon.com`, `amazon.de` など) には一切干渉しません

---

### URL 正規化のコアロジック

メイン関数は `canonicalize(input)` です。

1. `new URL(input, location.href)` で URL を厳密にパース

   * パース不能な文字列はそのまま返却（安全側に倒す）
2. ホストが `*.amazon.co.jp` でなければ何もしない
3. パスから ASIN を抽出できるかどうかで、モードを切り替え

---

#### Mode A: 商品ページ用 (Strict Reconstruction)

* パスが `/dp/ASIN`, `/gp/product/ASIN`, `/gp/aw/d/ASIN` のいずれかにマッチした場合
* ASIN を抽出し、**完全に再構築された正規の `/dp/ASIN` URL を生成**

```js
const PRODUCT_ALLOW_KEYS = [];
```

* この配列にクエリキーを列挙すると、それらだけは残して `/dp/ASIN?tag=...` のように付与できます
* 空配列 `[]` の場合は、クエリパラメータを完全に削除し、**最もクリーンな URL** になります

例: アフィリエイトタグを残したい場合

```js
const PRODUCT_ALLOW_KEYS = ['tag'];
```

---

#### Mode B: その他ページ用 (General Cleaning)

商品ページでない場合は、トラッキングパラメータの除去に特化した処理を行います。

1. パス中に `/ref=` が含まれていれば、その手前までで切り捨て
2. クエリパラメータを走査し、以下を基準に削除

```js
const TRACKING_BLACKLIST = new Set([
  'ref', 'ref_', 'pf_rd_r', 'pf_rd_p', 'pf_rd_m', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
  'pd_rd_r', 'pd_rd_w', 'pd_rd_wg', 'qid', 'sr', 'keywords', // keywordsは検索維持のため例外判定あり
  'dchild', 'crid', 'sprefix', 'field-keywords', 'hvpos', 'hvexid', 'hvnetw',
  'hvrand', 'hvqmt', 'hvbmt', 'hvdev', 'hvdvcmdl', 'hvlocint', 'hvlocphy',
  'hvtargid', 'hydadcr', '_encoding', 'ie',
]);
```

* `ref`, `ref_` は全ページで無条件削除
* `pf_rd_*`, `pd_rd_*` など、典型的なリファラ / トラッキング系パラメータを削除
* 検索ページ (`/s` で始まるパス) では、機能維持のため一部キーを例外的に残します:

```js
const FUNCTIONAL_KEYS_ON_SEARCH = new Set(['keywords', 'k', 'rh', 'page', 'sort', 'node']);
```

これにより、

* 検索条件 (`k`, `keywords`)
* フィルタ (`rh`, `node`)
* ソート (`sort`)
* ページング (`page`)

などの**ユーザー操作に直結する機能は壊さず**, トラッキングだけを削除できます。

---

### フックしている API / イベント

#### 1. 初期実行 & ウォッチドッグ

* スクリプト読込直後 (`document-start`) に `normalizeHere()` を実行
* 一定間隔ごとに URL を監視し、変化が止まるまで繰り返しクリーンアップ

```js
// 約 250ms 間隔で最大 ~10 秒
// 8 回連続で変化がない or 40 回経過で監視終了
setInterval(...);
```

また、次のタイミングでも補助的に正規化を実行:

* `DOMContentLoaded`
* `load`
* `visibilitychange` (タブが再度可視状態になったとき)

---

#### 2. History API hook

```js
history.pushState = function (state, title, url) { ... }
history.replaceState = function (state, title, url) { ... }
window.addEventListener('popstate', normalizeHere, { capture: true });
```

* SPA 内部遷移で `pushState` / `replaceState` される URL を事前に `canonicalize`
* `replaceState` が URL なしで呼ばれた場合は、現在の `location.href` 自体を正規化

---

#### 3. Location API hook

`Location.assign` / `Location.replace` をフックし、

* 遷移先 URL を `canonicalize`
* すでに現在 URL と同一になっている場合は **リロードを避ける**

ブラウザやセキュリティポリシーによって `Location.prototype` への書き込みができない場合は、
`window.location` インスタンス自身へのプロパティ定義でフォールバックを試みます。

---

#### 4. クリックイベント hook

```js
document.addEventListener('click', (e) => { ... }, { capture: true });
```

* 左クリックのみ対象 (`button === 0`)
* `Ctrl` / `Shift` / `Meta` / `Alt` キーが押されている場合はスキップ（新規タブ・複数選択などに配慮）
* `<a href>` を `closest` で探索し、Amazon.co.jp かつ `http/https` のみ対象
* `download` 属性付き / `target="_blank"` / `rel="external"` のリンクは除外
* 上記条件を満たす `<a>` の `href` を **遷移前にクリーンな URL に書き換え**

---

## ⚙️ カスタマイズ (Configuration)

上級ユーザー向けに、挙動を一部カスタマイズできるようになっています。
スクリプトの上部にある以下の定数を書き換えてください。

### 商品ページ: 残したいクエリパラメータの指定

```js
const PRODUCT_ALLOW_KEYS = [];
```

例: アフィリエイトタグ `tag` と、ユーザーの言語設定 `language` だけ残す:

```js
const PRODUCT_ALLOW_KEYS = ['tag', 'language'];
```

* 大文字・小文字は無視されます（内部的には小文字化して比較）
* 空配列 `[]` にすると、クエリパラメータは一切残さず、
  `https://www.amazon.co.jp/dp/ASIN` (+ `#hash`) のみになります

---

### その他ページ: 削除したい / 残したいキーの調整

#### ブラックリスト (削除対象):

```js
const TRACKING_BLACKLIST = new Set([...]);
```

* 「明らかにトラッキング目的」と判断できるパラメータはここに追加
* 検索ページ (`/s` パス) では、次の `FUNCTIONAL_KEYS_ON_SEARCH` に含まれるキーは保持されます

#### 検索ページで機能的に必要とみなすキー:

```js
const FUNCTIONAL_KEYS_ON_SEARCH = new Set(['keywords', 'k', 'rh', 'page', 'sort', 'node']);
```

* 検索条件・フィルタ・ページングなど機能維持のために必要なキーを列挙
* ここに追加したキーは、`TRACKING_BLACKLIST` を上書きして保持されます

---

## 🔐 プライバシーと安全性 (Privacy & Safety)

* 本スクリプトは **URL の正規化のみ** を行い、
  ページ内容の送信や外部へのログ送信は一切行いません
* 通信は全てあなたのブラウザ内で完結します
* `@grant none` で、追加の拡張権限を要求しません
* 対象ホストも `*.amazon.co.jp` のみに限定しています

---

## ⚠️ 既知の制限事項 (Known Limitations)

* Amazon 側の仕様変更により、今後新しいパラメータや URL パターンが追加される可能性があります

  * その場合、必要に応じて `TRACKING_BLACKLIST` や `FUNCTIONAL_KEYS_ON_SEARCH` を更新してください
* 他の Amazon 向け拡張機能 / Userscript と URL 書き換えタイミングで競合する可能性があります

  * 一般的には問題なく共存するはずですが、URL が意図しない形になる場合は一時的にどちらかを無効化して状況を確認してください
* モバイルブラウザや一部の環境では、`Location.prototype` へのフックが制限されている場合があります

  * その場合でも可能な範囲でフォールバック処理を行いますが、挙動が 100% 同一でない可能性があります

---

## ❓ トラブルシューティング (FAQ)

**Q. 検索結果ページでフィルタが効かなくなった / 条件が消えることがありますか？**
A. 既定では `k` / `keywords` / `rh` / `node` / `page` / `sort` など機能に必要なキーを残すようにしています。
特定のユースケースで問題が発生する場合は、発生した URL とともに Issue を報告していただけると助かります。

---

**Q. アフィリエイトのタグは残せますか？**
A. はい。`PRODUCT_ALLOW_KEYS` に `tag` を追加することで、商品ページのクエリに `?tag=...` を残せます。

---

**Q. 他の Amazon ドメイン (amazon.com / amazon.de など) でも使いたいです。**
A. 現状は `amazon.co.jp` 専用です。`@match` とホスト判定 (`\.amazon\.co\.jp$`) を調整すれば拡張は可能ですが、
各国ドメインでのパラメータや動作確認が必要になります。

---

## 🤝 開発・貢献 (Contributing)

バグ報告・改善提案・PR は歓迎です。

* リポジトリ:
  `https://github.com/koyasi777/amazon-jp-url-cleaner`
* Issue:
  `https://github.com/koyasi777/amazon-jp-url-cleaner/issues`

提案の際は、可能であれば:

* 問題が再現する具体的な URL
* 期待する動作 / 実際の動作
* 使用ブラウザ / Userscript マネージャーの種類とバージョン

などを記載いただけると、原因特定が非常にスムーズになります。

---

## 📄 ライセンス (License)

* MIT License
* 詳細はリポジトリ内の `LICENSE` を参照してください。

---

## 🌍 English Summary

This userscript **cleans and canonicalizes Amazon.co.jp URLs** by:

* Converting product URLs into the canonical `/dp/ASIN` form
* Stripping `/ref=...` segments and tracking query parameters (`pf_rd_*`, `pd_rd_*`, `qid`, `sr`, etc.)
* Preserving only functional parameters on search pages (e.g. `k`, `keywords`, `page`, `sort`, `node`)
* Hooking History/Location APIs, link clicks, and SPA navigation so URLs stay clean at all times

Just install it in Tampermonkey/Violentmonkey, visit `https://www.amazon.co.jp/`, and your URLs will automatically become **shorter, cleaner, and more privacy-respecting**.
