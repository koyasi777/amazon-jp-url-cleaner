// ==UserScript==
// @name         Amazon.co.jp URL Cleaner 🔗🧹
// @name:ja      Amazon.co.jp URLクリーナー 🔗🧹
// @name:en      Amazon.co.jp URL Cleaner 🔗🧹
// @name:zh-CN   Amazon.co.jp 链接清理器 🔗🧹
// @name:zh-TW   Amazon.co.jp 連結清理器 🔗🧹
// @name:ko      Amazon.co.jp URL 클리너 🔗🧹
// @name:fr      Nettoyeur d’URL Amazon.co.jp 🔗🧹
// @name:es      Limpiador de URL de Amazon.co.jp 🔗🧹
// @name:de      Amazon.co.jp-URL-Cleaner 🔗🧹
// @name:pt-BR   Limpador de URL da Amazon.co.jp 🔗🧹
// @name:ru      Очистка URL Amazon.co.jp 🔗🧹
// @namespace    https://github.com/koyasi777/amazon-jp-url-cleaner
// @version      2.0.0
// @description  Amazon.co.jp URL cleaner userscript that normalizes links by stripping /ref= segments and tracking params for short, clean URLs. Product pages become canonical /dp/ASIN, while search and other pages keep only functional params so filters still work. Hooks History/Location APIs, link clicks and SPA navigation to keep URLs readable, share-friendly and more privacy-respecting at all times.
// @description:ja   Amazon.co.jp 向けの URL クリーナーです。/ref= やトラッキング用クエリなど不要なパラメータを自動削除し、短くクリーンな URL に正規化します。商品ページは /dp/ASIN 形式に統一し、検索結果などは必要な検索条件・機能パラメータだけを残して動作を維持します。History/Location API とリンククリック、SPA 遷移をフックして、常に読みやすく共有しやすい、プライバシー配慮の URL を保ちます。
// @description:en   Amazon.co.jp URL cleaner userscript that normalizes links by stripping /ref= segments and tracking params for short, clean URLs. Product pages become canonical /dp/ASIN, while search and other pages keep only functional params so filters still work. Hooks History/Location APIs, link clicks and SPA navigation to keep URLs readable, share-friendly and more privacy-respecting at all times.
// @description:zh-CN  面向 Amazon.co.jp 的 URL 清理脚本，自动规范化链接，移除 /ref= 片段和各类跟踪查询参数，将网址压缩为简短干净的 URL。商品页统一转换为规范 /dp/ASIN 形式，搜索等页面仅保留必要的功能参数，保证筛选和功能正常。通过拦截 History/Location API、链接点击和 SPA 路由，持续保持网址可读、易分享且更注重隐私。
// @description:zh-TW  面向 Amazon.co.jp 的 URL 清理腳本，自動正規化網址，移除 /ref= 段落與各種追蹤查詢參數，將網址壓縮成簡短乾淨的連結。商品頁會統一轉換為標準 /dp/ASIN 形式，搜尋等頁面只保留必要的功能參數，以維持篩選與功能正常。透過攔截 History/Location API、連結點擊與 SPA 導覽，隨時保持網址易讀、好分享且更重視隱私。
// @description:ko    Amazon.co.jp 전용 URL 클리너 유저스크립트로 /ref= 구간과 각종 추적용 쿼리 파라미터를 자동 제거해 짧고 깔끔한 링크로 만듭니다. 상품 페이지는 표준 /dp/ASIN 형식으로 재구성하고, 검색 등 다른 페이지에서는 필요한 기능 파라미터만 남겨 필터와 기능이 그대로 동작하도록 합니다. History/Location API, 링크 클릭, SPA 내비게이션을 후킹해 항상 읽기 쉽고 공유하기 편하며 프라이버시를 더 잘 보호하는 URL을 유지합니다.
// @description:fr    Userscript de nettoyage d’URL pour Amazon.co.jp qui normalise automatiquement les liens en supprimant les segments /ref= et les paramètres de suivi afin d’obtenir des URL courtes et propres. Les pages produit sont reconstruites au format canonique /dp/ASIN, tandis que les pages de recherche et de navigation ne conservent que les paramètres fonctionnels pour préserver filtres et fonctionnalités. Intercepte les API History/Location, les clics sur les liens et la navigation SPA pour garder des URL lisibles, faciles à partager et plus respectueuses de la confidentialité.
// @description:es    Userscript limpiador de URL para Amazon.co.jp que normaliza automáticamente los enlaces eliminando segmentos /ref= y parámetros de seguimiento para crear URL cortas y limpias. En las páginas de producto reconstruye la URL en el formato canónico /dp/ASIN, y en las páginas de búsqueda u otras solo mantiene los parámetros funcionales para que los filtros y funciones sigan funcionando. Engancha las API de History/Location, los clics en enlaces y la navegación SPA para mantener URL legibles, fáciles de compartir y más respetuosas con la privacidad.
// @description:de    Amazon.co.jp-URL-Cleaner-Userscript, das Links automatisch normalisiert, indem /ref=-Segmente und Tracking-Parameter entfernt werden, sodass kurze, saubere URLs entstehen. Produktseiten werden in die kanonische Form /dp/ASIN umgebaut, während auf Such- und anderen Seiten nur funktionale Parameter erhalten bleiben, damit Filter und Funktionen weiterarbeiten. Hakt sich in History-/Location-APIs, Link-Klicks und SPA-Navigation ein, um URLs dauerhaft lesbar, teilfreundlich und datenschutzfreundlicher zu halten.
// @description:pt-BR Userscript limpador de URL para a Amazon.co.jp que normaliza automaticamente os links removendo segmentos /ref= e parâmetros de rastreamento para gerar URLs curtas e limpas. Em páginas de produto, reconstrói a URL no formato canônico /dp/ASIN; em páginas de busca e navegação mantém apenas os parâmetros funcionais para que filtros e recursos continuem funcionando. Conecta-se às APIs History/Location, aos cliques em links e à navegação SPA para manter URLs legíveis, fáceis de compartilhar e mais amigáveis à privacidade.
// @description:ru    Пользовательский скрипт-очиститель URL для Amazon.co.jp, который автоматически нормализует ссылки, удаляя сегменты /ref= и трекинговые параметры, чтобы получать короткие и чистые URL. Для товарных страниц заново формирует канонический вид /dp/ASIN, а на страницах поиска и навигации сохраняет только функциональные параметры, чтобы фильтры и функции продолжали работать. Перехватывает History/Location API, клики по ссылкам и SPA-навигацию, постоянно поддерживая URL читаемыми, удобными для обмена и более приватными.
// @author       koyasi777
// @license      MIT
// @homepageURL  https://github.com/koyasi777/amazon-jp-url-cleaner
// @supportURL   https://github.com/koyasi777/amazon-jp-url-cleaner/issues
// @icon         https://www.amazon.co.jp/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/koyasi777/amazon-jp-url-cleaner/main/amazon-jp-url-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/koyasi777/amazon-jp-url-cleaner/main/amazon-jp-url-cleaner.user.js
// @match        https://www.amazon.co.jp/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  // --- Configuration -----------------------------------------

  // 【Mode A: 商品ページ用】許可するクエリキー（ホワイトリスト）
  // 必要なパラメータ（アフィリエイトのtagや言語設定など）のみをここに定義。
  // 空配列 [] なら、/dp/ASIN だけの最もクリーンなURLになります。
  const PRODUCT_ALLOW_KEYS = [];

  // 【Mode B: その他ページ用】削除対象パラメータ（ブラックリスト）
  // 検索結果やトップページ等で「機能は壊さずにトラッキングだけ消す」ためのリスト。
  const TRACKING_BLACKLIST = new Set([
    'ref', 'ref_', 'pf_rd_r', 'pf_rd_p', 'pf_rd_m', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
    'pd_rd_r', 'pd_rd_w', 'pd_rd_wg', 'qid', 'sr', 'keywords', // keywordsは検索維持のため例外判定あり
    'dchild', 'crid', 'sprefix', 'field-keywords', 'hvpos', 'hvexid', 'hvnetw',
    'hvrand', 'hvqmt', 'hvbmt', 'hvdev', 'hvdvcmdl', 'hvlocint', 'hvlocphy',
    'hvtargid', 'hydadcr', '_encoding','ie',
  ]);

  // 上記ブラックリストに含まれていても、検索結果ページ等で機能維持のために残すべきキー
  const FUNCTIONAL_KEYS_ON_SEARCH = new Set(['keywords', 'k', 'rh', 'page', 'sort', 'node']);

  // --- Helpers ---------------------------------------------------------------

  /**
   * 安全なURLオブジェクト生成
   * URL.canParse が使えない環境への配慮も含め、パース不可なら例外を投げるかnullを返す
   */
  function toURL(input) {
    const s = String(input);
    // ベースURL解決を厳密に行う
    try {
      return new URL(s, location.href);
    } catch {
      throw new TypeError(`Unparsable URL: ${s}`);
    }
  }

  /**
   * パスからASINを抽出
   * /dp/, /gp/product/, /gp/aw/d/ に対応
   */
  function extractASIN(pathname) {
    const m = pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i);
    return m ? m[1].toUpperCase() : null;
  }

  // --- Core Logic: The Dual-Mode Canonicalizer -------------------------------

  function canonicalize(input) {
    let url;
    try {
      url = toURL(input);
    } catch {
      // パース不能な文字列は触らず返す（安全性優先）
      return String(input);
    }

    // Safety check: amazon.co.jp 以外は絶対に触らない
    if (!/\.amazon\.co\.jp$/i.test(url.hostname)) return url.href;

    const asin = extractASIN(url.pathname);

    // -------------------------------------------------------------------------
    // Strategy A: 商品ページ (Strict Reconstruction)
    // -------------------------------------------------------------------------
    if (asin) {
      // 言語プレフィックス（/-/en/ や /-/es/ 等）があれば保持
      const langPrefixMatch = url.pathname.match(/^\/-\/[^/]+\//);
      const prefix = langPrefixMatch ? langPrefixMatch[0].slice(0, -1) : '';

      // 許可されたクエリだけをホワイトリスト方式で再構築
      const keptParams = new URLSearchParams();
      if (PRODUCT_ALLOW_KEYS.length) {
        const allow = new Set(PRODUCT_ALLOW_KEYS.map(k => k.toLowerCase()));
        for (const [k, v] of url.searchParams) {
          if (allow.has(k.toLowerCase())) keptParams.append(k, v);
        }
      }
      const qs = keptParams.toString();

      // フラグメント(#)は維持しつつ、正規化URLを返す
      return `${url.origin}${prefix}/dp/${asin}${qs ? `?${qs}` : ''}${url.hash}`;
    }

    // -------------------------------------------------------------------------
    // Strategy B: その他ページ (General Cleaning)
    // -------------------------------------------------------------------------
    // 検索結果、トップページ、アカウントサービス等は、ブラックリストにあるゴミだけを除去する。

    // 1. Path Cleaning: URLパス内の /ref=... をカット
    if (url.pathname.includes('/ref=')) {
      url.pathname = url.pathname.split('/ref=')[0];
      if (url.pathname === '') url.pathname = '/';
    }

    // 2. Query Cleaning: トラッキングパラメータの除去
    const isSearchPage = url.pathname.startsWith('/s');
    const keys = Array.from(url.searchParams.keys());

    for (const key of keys) {
      const lowerKey = key.toLowerCase();

      // ref=... は全ページで無条件削除
      if (lowerKey === 'ref' || lowerKey.startsWith('ref_')) {
        url.searchParams.delete(key);
        continue;
      }

      // ブラックリスト判定
      if (
        lowerKey.startsWith('pf_rd_') ||
        lowerKey.startsWith('pd_rd_') ||
        TRACKING_BLACKLIST.has(lowerKey)
      ) {
        // 例外: 検索ページで機能的に必要なキーなら維持 (例: keywords)
        if (isSearchPage && FUNCTIONAL_KEYS_ON_SEARCH.has(lowerKey)) continue;

        url.searchParams.delete(key);
      }
    }

    return url.href;
  }

  // --- Execution & Hooks: Robustness ---------------------------------

  function normalizeHere() {
    const target = canonicalize(location.href);
    if (target !== location.href) {
      try {
        // history.state を維持しつつ URL のみ置換
        history.replaceState(history.state, document.title, target);
      } catch {
        // フォールバック
        history.replaceState(null, '', target);
      }
      return true; // 変更あり
    }
    return false; // 変更なし
  }

  // 1) 初期実行（最速タイミング）
  normalizeHere();

  // 2) History API Hook
  (function hookHistory() {
    const _push = history.pushState;
    const _replace = history.replaceState;

    history.pushState = function (state, title, url) {
      if (url !== undefined && url !== null) {
        try { url = canonicalize(url); } catch {}
        return _push.call(this, state, title, url);
      }
      return _push.call(this, state, title);
    };

    history.replaceState = function (state, title, url) {
      if (url !== undefined && url !== null) {
        try { url = canonicalize(url); } catch {}
        return _replace.call(this, state, title, url);
      } else {
        // 引数なしreplaceでも現在地を浄化
        const target = canonicalize(location.href);
        if (target !== location.href) {
          return _replace.call(this, state, title, target);
        }
        return _replace.call(this, state, title);
      }
    };

    // SPAバック/フォワード時の再正規化
    window.addEventListener('popstate', normalizeHere, { capture: true });
  })();

  // 3) Location API Hook
  (function hookLocation() {
    // ユーティリティ: 同一URLならリロードを防ぐ
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
      // assignフック
      try {
        const descA = Object.getOwnPropertyDescriptor(L, 'assign');
        if (!descA || descA.writable) {
          const _assign = L.assign;
          L.assign = function (url) {
            return safeCallAssignReplace.call(this, _assign, url);
          };
        }
      } catch {}

      // replaceフック
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
      // prototype操作がブロックされた場合のインスタンス直接書き換え
      try {
        const loc = window.location;
        const _assign2 = loc.assign.bind(loc);
        const _replace2 = loc.replace.bind(loc);
        Object.defineProperty(loc, 'assign', {
          value: (url) => safeCallAssignReplace.call(loc, _assign2, url)
        });
        Object.defineProperty(loc, 'replace', {
          value: (url) => safeCallAssignReplace.call(loc, _replace2, url)
        });
      } catch {}
    }
  })();

  // 3.5) Click Event Hook
  (function preNormalizeAnchorClicks() {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // 左クリックのみ
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a) return;

      // 除外: ダウンロード、別タブ、外部リンク属性
      if (a.hasAttribute('download')) return;
      if (a.target === '_blank') return;
      if (/\bexternal\b/i.test(a.rel || '')) return;

      try {
        const u = new URL(a.href, location.href);
        // http/https 以外は無視
        if (!/^https?:$/i.test(u.protocol)) return;
        // Amazon以外は無視
        if (!/\.amazon\.co\.jp$/i.test(u.hostname)) return;

        const c = canonicalize(u);
        // クリーンなURLに書き換えてから遷移させる
        if (c !== a.href) a.href = c;
      } catch {}
    }, { capture: true });
  })();

  // 4) Watchdog
  // Amazonの遅延ロードによるURL再汚染に対抗するため、変更が止まるまで監視する。
  (function watchdog() {
    let ticks = 0;
    let stable = 0; // 連続して変更がなかった回数

    const id = setInterval(() => {
      const changed = normalizeHere();
      // 変更があったらstableカウントをリセット、なければ加算
      stable = changed ? 0 : (stable + 1);

      // 終了条件:
      // 1. 8回連続(約2秒)変更がない = 安定したとみなす
      // 2. または合計40回(約10秒)経過しても終わらない = 強制終了
      if (stable >= 8 || (++ticks > 40 && !changed)) {
        clearInterval(id);
      }
    }, 250);

    // 補助トリガー
    document.addEventListener('DOMContentLoaded', normalizeHere, { once: true });
    window.addEventListener('load', normalizeHere, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') normalizeHere();
    });
  })();

})();
