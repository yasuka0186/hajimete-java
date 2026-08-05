# Day 13 公開・納品確認表

確認日: 2026年8月5日

## 成果物

| 種別 | URL／ファイル |
| --- | --- |
| 公開LP | <https://yasuka0186.github.io/hajimete-java/> |
| 無料体験 | <https://yasuka0186.github.io/hajimete-java/trial/> |
| 公開リポジトリ | <https://github.com/yasuka0186/hajimete-java> |
| 要件・仕様書 | `docs/hajimete-java-requirements-package.md` |
| 自動テスト対応表 | `docs/day-11-automated-test-matrix.md` |
| 品質レポート | `docs/day-12-quality-report.md` |
| PC／スマートフォン画像 | `docs/screenshots/` |
| ポートフォリオ掲載文 | `docs/portfolio-description.md` |

## 公開環境確認

| 項目 | 結果 | 備考 |
| --- | --- | --- |
| GitHub Pagesの公開 | 成功 | GitHub Actions run `30999483469` |
| LPと無料体験の表示 | 成功 | 両URLがHTTP 200 |
| 内部リンクとアセット | 成功 | CTA、LP復帰、CSS、JS、OGP、robots、sitemapを確認 |
| 全3問の完了 | 成功 | 公開URLのPlaywrightで確認 |
| コンソールエラー | 成功 | 全3問完了シナリオで0件 |
| Lighthouseモバイル | 成功 | LP 98／100／100／100、無料体験 100／100／100／100 |

## 自動・ローカル確認

| 項目 | 結果 | 備考 |
| --- | --- | --- |
| Vitest必須テスト | 成功 | 36件、Statements 98.8% |
| Playwright必須シナリオ | 成功 | Chromium 25件（コンソール検査を含む） |
| ESLint | 成功 | エラー0件 |
| Stylelint | 成功 | エラー0件 |
| HTML Validator | 成功 | エラー0件 |
| axe重大・深刻な違反 | 成功 | 3状態、該当0件 |
| 360／390／768／1024／1440px | 成功 | E2Eで横スクロールなし |
| キーボード主要操作 | 成功 | E2Eで体験完了まで確認 |

## 実ブラウザ・支援技術

| 対象 | 結果 | 備考 |
| --- | --- | --- |
| Google Chrome最新版 | 確認済み | Chrome 150でローカル・公開環境の主要導線を自動確認 |
| Safari最新版 | 未確認 | WebKit互換確認とは区別する |
| Microsoft Edge最新版 | 未確認 | Chromium互換確認とは区別する |
| Firefox最新版 | 未確認 | Playwright Firefox確認とは区別する |
| VoiceOver | 未確認 | 実際の読み上げ手動確認が必要 |

未確認項目を別ブラウザや自動検査の結果で代用したことにはしない。
