# はじめてJava

プログラミング完全初心者向けJava学習サービスを題材にした、ポートフォリオ用の架空サービスです。LPと全3問の無料体験ページを制作します。

## Day 1で確定した範囲

- 対象: LP（`/`）、無料体験（`/trial/`）、ブラウザ内での回答判定・進捗保存、テスト、GitHub Pages公開
- 対象外: 会員登録、ログイン、バックエンド、データベース、決済、外部API、Javaコードの実行・コンパイル、実サービス運営
- 技術: HTML5、SCSS、JavaScript（ES Modules）、Vite、Vitest、Playwright、ESLint、Stylelint、HTML Validate
- GitHub Pages: Viteの`base`を`./`とし、プロジェクトサイト配下でもアセット参照が解決される相対パス方針とする

現時点のHTMLは環境確認用の最小ページです。画面設計や機能は制作スケジュールに従ってDay 2以降に追加します。

## セットアップ

```bash
npm install
npx playwright install chromium
```

## コマンド

```bash
npm run dev
npm run build
npm run test:unit
npm run test:e2e
npm run lint
npm run lint:styles
npm run validate:html
```

## デモについて

本プロジェクトはポートフォリオ用に制作する架空サービスのデモです。実際の会員登録、決済、Javaコード実行、有料プランは提供しません。

