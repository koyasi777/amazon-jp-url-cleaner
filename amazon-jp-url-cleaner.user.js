// ==UserScript==
// @name         Amazon.co.jp 商品URLクリーナー 🔗🧹
// @name:ja      Amazon.co.jp 商品URLクリーナー 🔗🧹
// @name:en      Amazon.co.jp Product URL Cleaner 🔗🧹
// @name:zh-CN   Amazon.co.jp 商品链接清理器 🔗🧹
// @name:zh-TW   Amazon.co.jp 商品連結清理器 🔗🧹
// @name:ko      Amazon.co.jp 상품 URL 클리너 🔗🧹
// @name:fr      Nettoyeur d’URL produit Amazon.co.jp 🔗🧹
// @name:es      Limpiador de URL de productos de Amazon.co.jp 🔗🧹
// @name:de      Amazon.co.jp Produkt-URL-Reiniger 🔗🧹
// @name:pt-BR   Limpador de URL de produtos da Amazon.co.jp 🔗🧹
// @name:ru      Очистка URL товаров Amazon.co.jp 🔗🧹
// @version      1.0.0
// @description         Amazon.co.jpの商品URLを /dp/ASIN に正規化。トラッキングを削除し、必要なら許可したクエリ（例: tag）のみ保持。SPA遷移・履歴API・anchorクリックもフックして常にクリーンなURLを維持。
// @description:ja      Amazon.co.jpの商品URLを /dp/ASIN に正規化。トラッキングを削除し、必要なら許可したクエリ（例: tag）のみ保持。SPA遷移・履歴API・anchorクリックもフックして常にクリーンなURLを維持。
// @description:en      Canonicalize Amazon.co.jp product URLs to /dp/ASIN. Remove tracking and optionally keep allowed params (e.g., tag). Hooks SPA navigation, History API, and anchor clicks to keep URLs clean.
// @description:zh-CN   将 Amazon.co.jp 商品链接规范化为 /dp/ASIN，移除跟踪参数；可保留允许参数（如 tag）。适配 SPA、History API 与链接点击。
// @description:zh-TW   將 Amazon.co.jp 商品連結正規化為 /dp/ASIN，移除追蹤參數；可保留允許的參數（如 tag）。支援 SPA、History API 與連結點擊。
// @description:ko      Amazon.co.jp 상품 URL을 /dp/ASIN 으로 정규화하고 트래킹 파라미터를 제거합니다. 필요 시 허용된 파라미터(tag 등)만 유지. SPA/History API/앵커 클릭 대응.
// @description:fr      Canonise les URL de produits Amazon.co.jp en /dp/ASIN, supprime le tracking et peut garder certains paramètres (ex.: tag). Compatible navigation SPA et History API.
// @description:es      Canonicaliza las URL de productos de Amazon.co.jp a /dp/ASIN. Elimina el tracking y puede conservar parámetros permitidos (p. ej., tag). Funciona con SPA/History API.
// @description:de      Kanonisiert Amazon.co.jp-Produkt-URLs zu /dp/ASIN, entfernt Tracking und kann erlaubte Parameter (z. B. tag) beibehalten. Funktioniert mit SPA/History API.
// @description:pt-BR   Canoniza URLs de produtos da Amazon.co.jp para /dp/ASIN. Remove tracking e pode manter parâmetros permitidos (ex.: tag). Suporta SPA/History API.
// @description:ru      Приводит ссылки товаров Amazon.co.jp к /dp/ASIN, удаляет трекинг; при необходимости сохраняет разрешённые параметры (например, tag). Поддержка SPA/History API.
// @namespace    https://github.com/koyasi777/amazon-jp-url-cleaner
// @author       koyasi777
// @license      MIT
// @homepageURL  https://github.com/koyasi777/amazon-jp-url-cleaner
// @supportURL   https://github.com/koyasi777/amazon-jp-url-cleaner/issues
// @icon         https://www.amazon.co.jp/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/koyasi777/amazon-jp-url-cleaner/main/amazon-jp-url-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/koyasi777/amazon-jp-url-cleaner/main/amazon-jp-url-cleaner.user.js
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/-/*/dp/*
// @match        https://www.amazon.co.jp/gp/product/*
// @match        https://www.amazon.co.jp/-/*/gp/product/*
// @match        https://www.amazon.co.jp/gp/aw/d/*
// @match        https://www.amazon.co.jp/-/*/gp/aw/d/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  // 許可するクエリキー（例: アフィリエイトなら ['tag']）。完全にクリーンにするなら [] のままでOK。
  // 例:
  //  - アフィリエイト: ['tag']
  //  - 言語維持:       ['language']   // 例: ?language=en_US
  //  - 両方:           ['tag','language']
  const KEEP_KEYS = [];

  // --- helpers ---------------------------------------------------------------
  function toURL(input) {
    const s = String(input);
    if (typeof URL.canParse === 'function' && !URL.canParse(s, location.href)) {
      throw new TypeError('Unparsable URL');
    }
    return input instanceof URL ? input : new URL(s, location.href);
  }

  // --- Canonicalizer ---------------------------------------------------------
  function canonicalize(input) {
    let url;
    try {
      url = toURL(input);
    } catch {
      // URL 構築に失敗した場合はそのまま返す
      return String(input);
    }

    // ★ amazon.co.jp 以外のホストは触らない（外部リンク安全弁）
    if (!/\.amazon\.co\.jp$/i.test(url.hostname)) return url.href;

    // dp / gp/product / gp/aw/d の何れかから ASIN を抽出
    const m = url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i);
    if (!m) return url.href; // 対象外は触らない

    const asin = m[1].toUpperCase();

    // 言語プレフィックス（/-/en/ や /-/es/ など）があれば保持
    const langPrefixMatch = url.pathname.match(/^\/-\/[^/]+\//);
    const prefix = langPrefixMatch ? langPrefixMatch[0].slice(0, -1) : ''; // '/-/en'

    // 許可されたクエリだけ残す（既定では全削除、重複値も維持）
    const kept = new URLSearchParams();
    if (KEEP_KEYS.length) {
      const allow = new Set(KEEP_KEYS.map(k => k.toLowerCase()));
      for (const [k, v] of url.searchParams) {
        if (allow.has(k.toLowerCase())) kept.append(k, v);
      }
    }
    const qs = kept.toString();

    // フラグメント（#...）は常に保持
    return `${url.origin}${prefix}/dp/${asin}${qs ? `?${qs}` : ''}${url.hash}`;
  }

  function normalizeHere() {
    const target = canonicalize(location.href);
    if (target !== location.href) {
      try {
        // 既存の history.state / document.title を保持したまま URL だけ置換
        history.replaceState(history.state, document.title, target);
      } catch {
        // 後方互換フォールバック
        history.replaceState(null, '', target);
      }
      return true;
    }
    return false;
  }

  // --- 1) 初期正規化（超早期） -----------------------------------------------
  normalizeHere();

  // --- 2) history API を正しくフック（URLを明示的に差し替えて呼ぶ） ----------
  (function hookHistory() {
    const _push = history.pushState;
    const _replace = history.replaceState;

    history.pushState = function (state, title, url) {
      if (url !== undefined && url !== null) {
        try { url = canonicalize(url); } catch {}
        return _push.call(this, state, title, url);
      }
      // 第3引数未指定の場合は2引数で呼ぶ
      return _push.call(this, state, title);
    };

    history.replaceState = function (state, title, url) {
      if (url !== undefined && url !== null) {
        try { url = canonicalize(url); } catch {}
        return _replace.call(this, state, title, url);
      } else {
        // url 未指定でも現在URLを正規化
        const target = canonicalize(location.href);
        if (target !== location.href) {
          return _replace.call(this, state, title, target);
        }
        // 第3引数未指定の素通し
        return _replace.call(this, state, title);
      }
    };

    window.addEventListener('popstate', normalizeHere, { capture: true });
  })();

  // --- 3) location.assign/replace のフック（フルナビゲーション経路も矯正） ----
  (function hookLocation() {
    // 同一URLなら何もしない（無駄なリロード回避）
    function safeCallAssignReplace(fn, urlLike) {
      try {
        const c = canonicalize(urlLike);
        if (c === location.href) return; // no-op
        return fn.call(this, c);
      } catch {
        return fn.call(this, urlLike);
      }
    }

    try {
      const L = Location.prototype;
      // assign
      try {
        const descA = Object.getOwnPropertyDescriptor(L, 'assign');
        if (!descA || descA.writable) {
          const _assign = L.assign;
          L.assign = function (url) {
            return safeCallAssignReplace.call(this, _assign, url);
          };
        }
      } catch {}
      // replace
      try {
        const descR = Object.getOwnPropertyDescriptor(L, 'replace');
        if (!descR || descR.writable) {
          const _replace = L.replace;
          L.replace = function (url) {
            return safeCallAssignReplace.call(this, _replace, url);
          };
        }
      } catch {}
    } catch {
      // prototype を触れない環境向けフォールバック（インスタンス側）
      try {
        const loc = window.location;
        const _assign2 = loc.assign.bind(loc);
        const _replace2 = loc.replace.bind(loc);
        loc.assign = (url) => safeCallAssignReplace.call(loc, _assign2, url);
        loc.replace = (url) => safeCallAssignReplace.call(loc, _replace2, url);
      } catch {}
    }
  })();

  // --- 3.5) アンカークリックの事前正規化（遷移前に href をクリーン化） -------
  (function preNormalizeAnchorClicks() {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // 左クリックのみ
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // 修飾キー除外

      const a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a) return;

      // ★ ユーザ意図尊重: download / 新規タブ / rel=external は改変しない
      if (a.hasAttribute('download')) return;
      if (a.target === '_blank') return;
      if (/\bexternal\b/i.test(a.rel || '')) return;

      try {
        const u = new URL(a.href, location.href);
        // ★ http(s) 以外は触らない
        if (!/^https?:$/i.test(u.protocol)) return;
        // ★ amazon.co.jp 以外は触らない
        if (!/\.amazon\.co\.jp$/i.test(u.hostname)) return;

        const c = canonicalize(u);
        if (c !== a.href) a.href = c; // 置換して標準ナビゲーションに任せる
      } catch {}
    }, { capture: true });
  })();

  // --- 4) 軽量ウォッチドッグ（短時間だけ監視して最後の付け直しも即矯正） -----
  (function watchdog() {
    let ticks = 0, stable = 0;
    const id = setInterval(() => {
      const changed = normalizeHere();
      stable = changed ? 0 : (stable + 1);
      // 連続8回「変化なし」 or 約10秒経過で自動終了（250ms間隔）
      if (stable >= 8 || (++ticks > 40 && !changed)) clearInterval(id);
    }, 250);

    // ページ表示タイミング/完全読込でも念のため
    document.addEventListener('DOMContentLoaded', normalizeHere, { once: true });
    window.addEventListener('load', normalizeHere, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') normalizeHere();
    });
  })();

})();
