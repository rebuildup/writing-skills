# natural-japanese integration trial

Issue #21 の first-class Skill promotion 用 trial 記録。

## Source

- Upstream: https://github.com/coji/natural-japanese
- Imported commit: `9a78a42964096da509b8f3e011f0085a5f080151`
- License: MIT
- Upstream itself contains corpus-backed calibration, deterministic fixtures, and published eval material. writing-skills では research corpus 全体を複製せず、runtime surface と provenance だけを保持する。

## Layering decision

`writing-discipline` が audience / purpose / source fidelity / reader order を所有する。 `natural-japanese` はその上で、日本語固有の自然さ、翻訳調、文リズム、読解負荷、語順・読点等を検査・推敲する。

これにより upstream の「結論から書く」等を universal foundation rule として再定義せず、日本語 prose の specialized decision layer として利用できる。

## Real-artifact trial

対象: このリポジトリの `README.md` と Issue #21。

確認観点:

- mixed Japanese/English identifiers を機械的に日本語化しない
- repository-specific facts / commands / identifiers を自然さのために変更しない
- 「短くする」「結論から書く」を無条件適用しない
- AI臭 detector の finding を自動置換指示として扱わない
- reader-facing 日本語部分だけに language-specific review を追加する

結果: foundation と specialization の優先順位を明記すれば、upstream の診断・推敲ループを利用しつつ source fidelity と repository terminology を保持できる。README の既存 foundation 説明は rewrite 対象にせず、新しい Skill catalog 節だけを追加する方針とした。

## Deterministic verification

CI で upstream fixtures に対して `lint.py` を2ケース、`outline.py` と `terms.py` を smoke 実行する。findings 数は quality gate にせず、tool execution failure のみを failure とする。これは upstream の「検出は判断材料であり、自動 reject ではない」という境界を維持する。

## Cold-reader check

最終 review では upstream を知らない reader が、次を `SKILL.md` と `UPSTREAM.md` だけで判断できることを確認する。

1. いつ `natural-japanese` が activate するか
2. `writing-discipline` とどちらが foundation か
3. deterministic finding をどう扱うか
4. upstream provenance と update point は何か
5. runtime に corpus / experiment infrastructure が不要であること
