# はじめてJava

プログラミング完全初心者向けJava学習サービスを題材にした、ポートフォリオ用の架空サービスです。LPと全3問の無料体験ページを制作します。

## Day 1で確定した範囲

- 対象: LP（`/`）、無料体験（`/trial/`）、ブラウザ内での回答判定・進捗保存、テスト、GitHub Pages公開
- 対象外: 会員登録、ログイン、バックエンド、データベース、決済、外部API、Javaコードの実行・コンパイル、実サービス運営
- 技術: HTML5、SCSS、JavaScript（ES Modules）、Vite、Vitest、Playwright、ESLint、Stylelint、HTML Validate
- GitHub Pages: Viteの`base`を`./`とし、プロジェクトサイト配下でもアセット参照が解決される相対パス方針とする

Day 2の情報設計は[`docs/day-2-information-architecture.md`](docs/day-2-information-architecture.md)、Day 3のデザイントークンと共通部品方針は[`docs/day-3-design-foundation.md`](docs/day-3-design-foundation.md)にまとめています。Day 6までにLP全体を完成し、Day 7〜10で無料体験の学習フローと品質調整、Day 11で必須単体テスト・E2E・カバレッジ判定を整備しました。テストの要件対応は[`docs/day-11-automated-test-matrix.md`](docs/day-11-automated-test-matrix.md)にまとめています。

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
npm run test:coverage
npm run test:e2e
npm run lint
npm run lint:styles
npm run validate:html
```

## 自動テスト

- Vitest: 回答判定、誤答ヒント、保存・復元・リセット、破損データ、境界値
- Coverage: 判定・ヒント・保存の主要3モジュールでステートメント80％以上を必須化
- Playwright: 仕様書の必須13シナリオに加え、レスポンシブ、キーボード、例外復旧を確認

Day 11完了時点の結果は、Vitestとカバレッジ、Chromium版Playwrightの全件成功を確認する。実行件数とカバレッジ数値は実行環境で変化しうるため、上記コマンドの出力を正とする。

## デモについて

本プロジェクトはポートフォリオ用に制作する架空サービスのデモです。実際の会員登録、決済、Javaコード実行、有料プランは提供しません。
