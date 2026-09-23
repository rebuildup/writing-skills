# writing-skills

AI agent が文章を作成・編集・レビューするときの判断能力を、再利用可能な Agent Skills として体系化するリポジトリです。

単なる文体テンプレート集ではなく、**audience / purpose / context を読み取り、必要な情報を選び、reader-oriented な構造へ変換し、独立した artifact として読み直して検証する**ための writing system を目指します。

## Core principle

> **Think in context. Select for purpose. Compose for the reader. Reread without the context.**

文章は conversation、調査、実装、tool output の縮約ではありません。reader が判断・理解・行動するために必要な内容を選び直し、artifact 単体で意味が通る形へ再構成します。

## Skills

### writing-discipline

reader-facing prose 全般に適用する foundation skill です。

主な対象:

- README / development guide / architecture docs
- ADR / design / specification
- GitHub Issue / Pull Request
- commit message
- code comment / doc comment
- review comment
- release note / migration note
- repository-controlled agent instructions / Skills

共通 pipeline:

1. **Select** — audience / purpose を定め、reader に必要な fact / decision / constraint / rationale を選ぶ
2. **Compose** — 選んだ内容を reader の理解順に standalone prose へ再構成する
3. **Reread** — 元の task や conversation を知らない reader として全文を読み直し、構造・接続・冗長・referent・context dependence を編集する

### natural-japanese

日本語 prose の自然さ・読みやすさ・AI的な定型・翻訳調を扱う specialized skill です。生成前の制約、deterministic lint、構造・読解負荷レビュー、診断・推敲ループを `writing-discipline` の上に追加します。

[coji/natural-japanese](https://github.com/coji/natural-japanese) を upstream とし、runtime surface を MIT attribution 付きで取り込んでいます。

## Installation

利用可能な Skill を確認:

```bash
bunx skills add rebuildup/writing-skills --list
# or
npx skills add rebuildup/writing-skills --list
```

特定の Skill を導入:

```bash
bunx skills add rebuildup/writing-skills --skill writing-discipline
# or
npx skills add rebuildup/writing-skills --skill writing-discipline

# 日本語 prose の自然さ・読みやすさ・AI臭診断も使う場合
bunx skills add rebuildup/writing-skills --skill natural-japanese
# or
npx skills add rebuildup/writing-skills --skill natural-japanese
```

## Repository structure

```text
.
├─ AGENTS.md
├─ README.md
├─ CONTRIBUTING.md
├─ LICENSE
└─ skills/
   ├─ writing-discipline/
   │  └─ SKILL.md
   └─ natural-japanese/
      ├─ SKILL.md
      ├─ references/
      ├─ scripts/
      └─ assets/
```

将来の specialized skill は、foundation の原則を置き換えるのではなく progressive disclosure で追加します。候補には clarity、conciseness、information structure、technical writing、documentation、ADR、Issue、Pull Request、review writing などがあります。

## Development

このリポジトリでは GitHub Issues / Pull Requests と version-oriented release branch を canonical work state とします。

- `main`: released / integrated state
- `release-x-y-z`: target release integration branch
- 1 top-level Issue = 1 number-only ticket branch = 1 ticket PR
- active ticket branch は first meaningful commit 後に Draft PR を持つ
- merge / landing は明示的な authorization がある場合だけ行う

詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## License

MIT License
