# Day 12 SEO・性能・ブラウザ確認

## 確認対象

- 想定公開URL: `https://yasuka0186.github.io/hajimete-java/`
- LP: `/`
- 無料体験: `/trial/`
- Lighthouse: 本番ビルドのローカル配信をモバイル条件で計測

公開はDay 13の対象であるため、Day 12では想定公開URLをmetadata、canonical、sitemapへ設定する。公開URLからの取得確認はDay 13で行う。

## ブラウザ確認の区分

| 対象 | Day 12の確認方法 | 実ブラウザ確認 |
| --- | --- | --- |
| Google Chrome | Chrome 150.0.7871.187で主要導線を自動確認 | 済 |
| Microsoft Edge | Playwright Chromiumで互換エンジン確認 | 未確認（アプリ未導入） |
| Firefox | Playwright Firefoxで主要導線を自動確認 | 未確認（Firefoxアプリ未導入） |
| Safari | Playwright WebKitで互換エンジン確認 | 未確認（Safari 26.5.2の実機操作は未実施） |

互換エンジンの結果をEdge／Safari実ブラウザの確認済みとは扱わず、以下へ分けて記録する。

## 自動検査結果

- axe: LP、無料体験の初期状態・誤答状態の3件で重大・深刻な違反0件
- ブラウザ主要導線: Chrome、Chromium、Firefox、WebKitの4件成功
- コンソール: 上記主要導線でエラー0件
- OGP画像: 1200×630 PNG、70,645 bytes
- HTML Validator、ESLint、Stylelint: エラー0件

## Lighthouse（モバイル）

Lighthouse 13.4.1、Chrome 150、本番ビルドのローカル配信で計測した。

| ページ | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| LP | 100 | 100 | 100 | 100 |
| 無料体験 | 100 | 100 | 100 | 100 |

公開URLでの画像取得、Lighthouse再計測、Chrome以外の対象ブラウザ最新版による手動確認はDay 13時点でも別途必要である。
