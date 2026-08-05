# Day 11 自動テスト対応表

仕様書の必須単体テストとE2Eシナリオが、どの自動テストで確認されるかを整理する。

## Vitest

| 必須対象 | テストファイル |
| --- | --- |
| 前後空白・改行の除去、正解・不正解判定 | `tests/unit/answer-validator.test.js` |
| 誤答別ヒント、優先順、共通ヒント | `tests/unit/hint-resolver.test.js` |
| 保存・読み込み、保存破損からの初期化 | `tests/unit/progress-store.test.js` |
| 未完了問題、全問完了、リセット | `tests/unit/progress-store.test.js` |

`npm run test:coverage`では、回答判定・ヒント判定・保存処理のステートメントカバレッジ80％以上を必須とする。

## Playwright必須13シナリオ

| No. | 必須シナリオ | 対応テスト名 |
| --- | --- | --- |
| 1 | LPの主CTAから無料体験へ移動 | `serves both entry pages` |
| 2 | 月額プランは準備中 | `shows the paid plan as unavailable` |
| 3 | 第1問の誤答ヒント | `shows a specific hint for an incorrect trial answer` |
| 4 | 第1問の正解解説と想定出力 | `shows feedback without auto-advancing and advances only with the next button` |
| 5 | 正解後は手動で次へ進む | `shows feedback without auto-advancing and advances only with the next button` |
| 6 | 第1問から第3問まで完了 | `shows the completion screen and restores it after reload` |
| 7 | 全問完了後の結果・学習内容・次章 | `shows the completion screen and restores it after reload` |
| 8 | 入力途中と未完了問題の復元 | `restores an unfinished answer and resumes the unfinished problem after reload` |
| 9 | 完了問題を進捗から見直す | `opens a completed problem read-only and enables editing only after retry` |
| 10 | 再挑戦前は閲覧専用 | `opens a completed problem read-only and enables editing only after retry` |
| 11 | Ctrl／Command＋Enterで判定 | `submits all three answer formats with the keyboard shortcut` |
| 12 | リセットのキャンセルで状態維持 | `keeps state when reset is cancelled and clears it after confirmation` |
| 13 | リセット確定で第1問へ戻る | `keeps state when reset is cancelled and clears it after confirmation` |

このほか、主要5幅、キーボード操作、読み上げ用DOM、壊れた保存データ、保存利用不可、全状態の横スクロールを同じPlaywrightスイートで回帰確認する。
