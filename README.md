# はじめてJava

プログラミング完全初心者向けJava学習サービスを題材にした、ポートフォリオ用の架空サービスです。LPと全3問の無料体験ページを制作します。

## Day 1で確定した範囲

- 対象: LP（`/`）、無料体験（`/trial/`）、ブラウザ内での回答判定・進捗保存、テスト、GitHub Pages公開
- 対象外: 会員登録、ログイン、バックエンド、データベース、決済、外部API、Javaコードの実行・コンパイル、実サービス運営
- 技術: HTML5、SCSS、JavaScript（ES Modules）、Vite、Vitest、Playwright、ESLint、Stylelint、HTML Validate
- GitHub Pages: Viteの`base`を`./`とし、プロジェクトサイト配下でもアセット参照が解決される相対パス方針とする

Day 2の情報設計は[`docs/day-2-information-architecture.md`](docs/day-2-information-architecture.md)、Day 3のデザイントークンと共通部品方針は[`docs/day-3-design-foundation.md`](docs/day-3-design-foundation.md)にまとめています。Day 6までにLP全体を完成し、Day 7で無料体験の画面基盤、Day 8で回答判定とフィードバック、Day 9で保存・見直し・完了フロー、Day 10でフォーカス・読み上げ・エラー・レスポンシブ品質を調整しました。自動テストの仕上げ以降は制作スケジュールに従って追加します。

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
