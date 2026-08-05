# はじめてJava

「はじめてJava」は、プログラミング完全初心者向けの架空Java学習サービスです。学ぶ順番を示すLPと、文字出力を段階的に学べる全3問の無料体験を制作しました。

- 公開サイト: <https://yasuka0186.github.io/hajimete-java/>
- 無料体験: <https://yasuka0186.github.io/hajimete-java/trial/>
- リポジトリ: <https://github.com/yasuka0186/hajimete-java>

## 制作目的

初心者が感じやすい「何から学べばよいか分からない」「環境構築で止まってしまう」という不安を減らし、ブラウザで最初のコード入力を体験できる導線を設計しました。LPの情報設計に加え、JavaScriptによる回答判定、状態保存、自動テスト、アクセシビリティまでを一つの作品として示しています。

## 主な機能

- 悩み、特徴、6段階ロードマップ、料金、FAQを掲載したサービス紹介LP
- 「コードの一部」から「表示内容の変更」まで段階的に進む全3問
- 前後空白を除いた正誤判定と、誤答内容に応じたヒント
- 正解解説とコンソール風の想定出力
- `localStorage`による入力・進捗保存、自動再開、見直し、再挑戦、リセット
- `Ctrl+Enter`／`Command+Enter`、フォーカス移動、読み上げ、動き軽減への対応
- 360〜1440pxのレスポンシブ表示

Javaコードは実行・コンパイルせず、入力内容をブラウザ内のJavaScriptで判定します。外部APIへ回答を送信しません。

## 使用技術

- HTML5
- SCSS（BEM、foundation／layout／component／project／utility）
- JavaScript（ES Modules）
- Vite
- Vitest、Playwright、axe
- ESLint、Stylelint、HTML Validate
- GitHub Actions、GitHub Pages

## セットアップ

Node.js 20以上を使用します。

```bash
npm install
npx playwright install chromium firefox webkit
npm run dev
```

## ビルド・検証

```bash
npm run build
npm run test:unit
npm run test:coverage
npm run test:e2e
npm run test:a11y
npm run test:browsers
npm run lint
npm run lint:styles
npm run validate:html
```

公開サイトに対してE2Eを実行する場合は、ローカルサーバーを起動せず次のように実行できます。

```bash
PLAYWRIGHT_BASE_URL=https://yasuka0186.github.io/hajimete-java/ npm run test:e2e
```

## 品質確認

- 必須単体テストとE2Eシナリオを自動化
- 判定・ヒント・保存モジュールのステートメントカバレッジ80％以上
- axeの重大・深刻な違反0件
- 本番ビルドのLighthouse 4カテゴリ各90点以上

詳細は[自動テスト対応表](docs/day-11-automated-test-matrix.md)、[Day 12品質レポート](docs/day-12-quality-report.md)、[納品確認表](docs/day-13-delivery-checklist.md)を参照してください。

## 画面

| LP | 無料体験 |
| --- | --- |
| [PC表示](docs/screenshots/lp-desktop.png)／[スマートフォン表示](docs/screenshots/lp-mobile.png) | [PC表示](docs/screenshots/trial-desktop.png)／[スマートフォン表示](docs/screenshots/trial-mobile.png) |

## デモについて

本プロジェクトはポートフォリオ用に制作した架空サービスのデモです。実際の会員登録、決済、Javaコード実行、有料プラン、修了証は提供しません。月額980円プランと次章は準備中表示のみです。

## 関連資料

- [要件・仕様書](docs/hajimete-java-requirements-package.md)
- [情報設計](docs/day-2-information-architecture.md)
- [デザイン基盤](docs/day-3-design-foundation.md)
- [ポートフォリオ掲載文](docs/portfolio-description.md)
