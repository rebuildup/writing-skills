# Contributing

このリポジトリでは、writing guidanceを単なるprompt断片ではなく、再利用可能で検証可能な Agent Skill として管理します。

## Delivery model

GitHub Issues / Pull Requests と version-oriented release branch を canonical work state とします。

- `main`: released / integrated state
- `release-x-y-z`: target release integration branch
- 1 top-level Issue = 1 number-only ticket branch = 1 ticket PR
- independent ticket PR は target release branch を base にする
- first meaningful ticket commit 後は Draft PR を作成して維持する
- release branch に最初の meaningful integrated difference が入った後は `release-x-y-z -> main` の Draft release PR を作成する
- PR の readiness と merge authorization は別 state とする
- merge / squash / rebase / stacked landing / auto-merge は、対象PRへの明示的な authorization がある場合だけ実行する

## Skill structure

各 Skill は原則として次の形にする。

```text
skills/<skill-name>/
└─ SKILL.md
```

`SKILL.md` は少なくとも `name` と `description` を frontmatter に持つ。

新しい specialized skill は、既存 foundation を無言で置き換えない。共通原理と対象固有の判断を分離し、必要なときだけ progressive disclosure できる粒度にする。

## Writing quality

reader-facing artifact は raw context の serialization として作らない。

基本工程:

1. **Select** — audience / purpose と必要な communicative content を決める
2. **Compose** — reader の理解順に standalone artifact を組み立てる
3. **Reread** — 元の task / conversation を知らない reader として全文を読み直して編集する

内容を追加することを品質改善とみなさない。不要な情報の削除、順序変更、統合、referentの明確化、context dependenceの除去も同等に重要とする。

## Skill change verification

Skill の追加・変更時は最低限次を確認する。

- directory name と frontmatter `name` が一致する
- `description` が activation condition を説明している
- audience / purpose / scope が曖昧でない
- normative rule が example や補足に埋没していない
- source Skill からの移管なら semantic loss がない
- specialized rule と foundation rule が矛盾しない
- conversation / implementation diary / raw investigation log が混入していない
- counterexample や exception が必要な原則を絶対ルールにしていない
- artifact 単体で読み直して自然に理解できる

deterministic check を導入できる成熟度になったら、同じルールを毎回LLM判断へ残さず script / evalへ移す。

## Temporary and reference artifacts

一時的な調査・検証出力は `.tmp/`、外部repositoryの一時参照は `.reference/` を使用する。

これらは canonical source ではなく、commitしない。外部sourceを取り込む場合は license / redistribution / attribution 条件を確認する。

## Scope changes

次は通常の文章編集より大きな変更として扱う。

- repository-wide writing model の変更
- foundation Skill の normative rule の削除・反転
- Skill taxonomy の責務境界変更
- release / branch / merge authorization policy の変更
- external source から取り込んだ原則の license / attribution model の変更

この種の変更では、理由と影響を Issue / design note / ADR 等の適切な canonical artifact に残す。
