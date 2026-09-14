---
name: skill-authoring
description: Use when turning a writing-skills candidate, research issue, or recurring writing problem into a reusable Agent Skill. Researches the domain before writing the Skill, extracts conditional decision rules and failure modes, and requires real-artifact and cold-reader verification before promotion.
---

# Skill Authoring

Writing Skill は一般的な文章術を大量に保存する場所ではない。

目的は、agent が特定の writing problem に遭遇したとき、**何を判断し、何を観察し、どの条件でルールを変え、最終成果物をどう検証するか**を再現可能にすることである。

基本工程:

> **Research → Extract → Contrast → Encode → Trial → Verify**

## 1. Start from the writing problem

SKILL.md を書く前に candidate / Issue / user request を読む。

最初に決める:

- 誰のどんな writing problem を解くか
- 対象 artifact / medium は何か
- reader は誰か
- 何を扱わないか
- foundation / editing / technical artifact / product content / research & evidence / business communication / public editorial / operation & audit のどれに近いか
- 既存 Skill と責務が重複しないか
- 単独 Skill にするほど repeatable な判断があるか

「文章全般をよくする」など、activation condition が曖昧なまま Skill 化しない。

## 2. Research before writing

Skill本文を先に作ってから根拠を後付けしない。

対象に応じて複数sourceを比較する。

### Foundation / editing

優先する:

- established writing / editing literature
- plain-language guidance
- university writing centers / technical communication guidance
- empirical readability / comprehension research when the claim depends on cognition
- multiple strong real-world artifacts

単一style guideの好みを普遍法則にしない。

### Technical / engineering artifact

優先する:

1. artifact/platform の official guidance
2. established engineering documentation practice
3. strong production examples
4. relevant standards / specifications
5. mature open-source examples

README、ADR、API docs、migration guide、Issue、PR等はそれぞれ reader task が異なる。formatを一律化しない。

### Product / UX content

優先する:

- first-party content / UX writing guidance
- actual product surfaces
- accessibility / internationalization guidance
- platform constraints
- error / recovery / transactional state examples

microcopyを単なる短文化として扱わない。

### Research / evidence-sensitive writing

優先する:

- primary sources
- citation / publication standards
- research methodology guidance
- authoritative secondary synthesis
- domain-specific evidence conventions

source fidelity と claim strength を writing style より優先する。

### Business / public / editorial writing

目的・audience・distribution mediumに合う primary artifacts と established guidance を比較する。

一つの企業・媒体・著者のvoiceを一般原則へ昇格しない。

## 3. Separate principle from preference

調査した source が一致しているかを確認する。

### Repeated principle

複数source / artifactで同じ結果が反復し、条件も説明できるなら decision rule 候補にする。

### Context-dependent rule

適用条件を明示する。

例:

- 「短い文にする」ではなく、working-memory負荷やscan性が重要な箇所では複雑な構文を分割する
- 「能動態を使う」ではなく、actorをreaderが知る必要がある場合はactorを明示する
- 「結論から書く」ではなく、reader task が迅速な判断を要求するartifactでは結論やactionを早く提示する

### Preference / house style

特定組織・媒体の規約なら universal rule として保存しない。adapter / reference / project-local policy として扱う。

### Disagreement

source間で意見が割れる場合は平均化しない。

- 何の条件で違うか
- reader / medium / language / riskの違いか
- empirical evidence と editorial preference のどちらか
- current standard と historical convention の違いか

を分離する。

## 4. Extract decision axes

調査結果を百科事典の要約にしない。

agentが実際に判断できる軸へ変換する。

候補:

- audience knowledge
- reader task / desired action
- artifact purpose
- information hierarchy
- claim / evidence relationship
- information density
- sentence / paragraph cognitive load
- terminology precision
- ambiguity / referent resolution
- cohesion / transition
- tone / register
- temporal context
- source fidelity
- uncertainty / confidence expression
- scan vs read behavior
- localization / translation resilience
- medium-specific constraints

domainに不要な軸は削る。

`clear`, `natural`, `professional`, `concise`, `engaging` のような抽象語だけで評価しない。observableな特徴へ分解する。

## 5. Encode the minimum useful Skill

Skillは長い教科書でなくてよい。

最低限、次をagentが自律実行できれば成立する。

1. **When to use** — activation condition
2. **Context / inputs** — 何を読むか
3. **Decision rules** — 条件付きの判断
4. **Failure modes** — 何を避けるか
5. **Verify** — artifactをどう読み直すか
6. **References** — 必要な場合にruntime inputとして開くsource

必要な場合だけ追加する:

- workflow
- examples / counterexamples
- artifact-specific variants
- source priority
- terminology
- last-reviewed
- deterministic checks / evals

文章量やsection数を品質指標にしない。

## 6. Examples need counterexamples

Before / After だけでは「常にAfterの形にすればよい」という過学習を起こしやすい。

非自明な原則には可能なら次を持つ:

- positive example
- negative example
- counterexample: 原則を適用すると逆に悪くなる条件
- boundary case

例:

「冗長を削る」Skillなら、法的条件、safety constraint、migration prerequisite等まで削ってはいけない例を持つ。

## 7. References are evidence, not decoration

reference 名だけを並べない。

sourceを置く場合は、少なくとも何の判断を支えるか分かるようにする。

推奨:

```markdown
- [Reference](https://example.com/)
  - Supports: <decision / observation>
  - Applies when: <context>
  - Caveat: <house style / version / scope>
```

current standard / platform / product guidanceは必要に応じて `last-reviewed` を持つ。

source本文をSkillへ大量複製しない。

## 8. Keep source fidelity separate from prose quality

sourceを要約・変換するSkillでは、文章が自然でも意味が変われば失敗である。

検証時は必要に応じて分離する:

- factual fidelity
- claim strength
- attribution / citation
- omission of material qualifiers
- prose quality
- reader usability

「読みやすくした結果、断定が強くなった」等を許容しない。

## 9. Real-artifact trial

candidateをfirst-class Skillへpromoteする前に、実際のartifactへ適用する。

例:

- README Skill → 実READMEを新規作成/改稿
- PR writing → 実PR description
- error-message → 実際のfailure/recovery state
- research synthesis → 実source setから短いsynthesis
- editing → messy draftを編集

trialではSkillがないbaselineと比較できるとよい。

記録する:

- 何が改善したか
- どのルールが役立たなかったか
- 不足していたcontext
- over-application / under-application
- 新しいfailure mode

## 10. Cold-reader verification

authoring contextを知っているagentの自己評価だけで終えない。

可能なら、元conversation / investigation logを知らないreader視点で確認する。

見るもの:

- artifact単体で目的が分かるか
- missing premiseがないか
- unnecessary history / scaffoldingがないか
- referentが解決するか
- information orderがreader taskに合うか
- terminologyが一貫するか
- source-sensitive textなら意味が保持されるか

重大なSkillでは independent review / cold evaluation を検討する。

## 11. Promotion gate

candidateをfirst-class Skillとして扱う前に最低限確認する。

- problem / activation conditionが明確
- scope boundaryが明確
- researchをSkill本文より先に実施
- 複数sourceまたは十分なprimary evidenceを比較
- generic adviceをconditional decision ruleへ変換
- disagreement / exceptionを無視していない
- important failure mode / counterexampleがある
- real artifactへ適用した
- final artifact自体をreread / verifyした
- source-sensitive taskならfidelityも検証した
- neighboring Skillsとの責務が説明できる

条件を満たせない場合は無理にSkill化せず、research Issueのまま残す。

## 12. Progressive disclosure

最小構成:

```text
skills/<skill-name>/
└─ SKILL.md
```

referenceやvariantが増えた場合だけ:

```text
skills/<skill-name>/
├─ SKILL.md
└─ references/
   └─ ...
```

scripts / evals / fixtures は、repeated deterministic checkやregression caseが見つかってから追加する。

## Prior art

このSkillは `rebuildup/design-skills/skills/skill-authoring` の research-first / minimal-skill / runtime-reference / artifact-verification の考え方をwriting domainへ翻訳している。

Design Skills:
https://github.com/rebuildup/design-skills/tree/main/skills/skill-authoring
