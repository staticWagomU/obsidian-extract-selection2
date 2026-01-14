# Extract Selection Plugin - 新設計書

## 概要

選択範囲からノートを切り出す汎用的なObsidianプラグイン。ユーザーが自由に「抽出テンプレート」を定義し、コンテキストメニューやコマンドパレットから素早くノートを作成できる。

---

## 設計思想

### 現行設計からの変更点

| 項目 | 現行設計 | 新設計 |
|------|---------|-------|
| ノートタイプ | 固定3種類（Fleeting/Literature/Permanent） | ユーザー定義（無制限） |
| 設定構造 | タイプごとに固定フィールド | 動的な配列構造 |
| コンテキストメニュー | 3タイプ固定表示 | 汎用コマンド + お気に入り |
| 昇格機能 | あり（Fleeting→Permanent） | **削除** |
| 孤立ノート検出 | あり | **削除**（Zettelkasten特有機能のため） |

### コア原則

1. **汎用性**: Zettelkastenに限定せず、あらゆるノート作成ワークフローに対応
2. **シンプルさ**: 1つの目的（選択範囲の抽出）に集中
3. **拡張性**: ユーザーが自由にテンプレートを追加可能
4. **使いやすさ**: お気に入り機能で頻繁に使うテンプレートに素早くアクセス

---

## データ構造

### ExtractionTemplate（抽出テンプレート）

```typescript
export interface ExtractionTemplate {
  /** 一意識別子（UUID） */
  id: string;

  /** 表示名（モーダル・メニューに表示） */
  name: string;

  /** 説明文（モーダルに表示、任意） */
  description: string;

  /** アイコン（絵文字、任意） */
  icon: string;

  /** 保存先フォルダパス */
  folder: string;

  /** ファイル名フォーマット */
  fileNameFormat: string;

  /** テンプレートファイルパス（Vault内の.mdファイル） */
  templatePath: string;

  /** エイリアス入力モーダルを表示するか */
  showAliasInput: boolean;

  /** お気に入り（コンテキストメニューに独立表示） */
  isFavorite: boolean;

  /** 表示順序 */
  order: number;
}
```

### 設定構造

```typescript
export interface ExtractSelectionSettings {
  /** 抽出テンプレート一覧 */
  templates: ExtractionTemplate[];

  /** 動作設定 */
  behavior: BehaviorSettings;

  /** UI設定 */
  ui: UISettings;
}

export interface BehaviorSettings {
  /** 抽出後に元の選択範囲をリンクに置換 */
  insertLinkAfterExtract: boolean;

  /** 抽出後に新規ノートを開く */
  openAfterExtract: boolean;

  /** 共通インデント削除のデフォルト値 */
  defaultRemoveIndent: boolean;
}

export interface UISettings {
  /** コマンド名に絵文字を表示 */
  showEmojiInCommands: boolean;

  /** コンテキストメニューに項目を表示 */
  showContextMenuItems: boolean;
}
```

### デフォルト設定

```typescript
export const DEFAULT_SETTINGS: ExtractSelectionSettings = {
  templates: [
    {
      id: "default-note",
      name: "Note",
      description: "Basic note extraction",
      icon: "📝",
      folder: "",
      fileNameFormat: "{{zettel-id}}",
      templatePath: "",
      showAliasInput: true,
      isFavorite: false,
      order: 0,
    },
  ],
  behavior: {
    insertLinkAfterExtract: true,
    openAfterExtract: false,
    defaultRemoveIndent: false,
  },
  ui: {
    showEmojiInCommands: true,
    showContextMenuItems: true,
  },
};
```

---

## ファイル名フォーマット

### プレースホルダー

| プレースホルダー | 説明 | 例 |
|-----------------|------|-----|
| `{{date}}` | 日付（YYYY-MM-DD） | `2025-01-14` |
| `{{time}}` | 時刻（HHmmss） | `153000` |
| `{{datetime}}` | 日時（YYYY-MM-DD-HHmmss） | `2025-01-14-153000` |
| `{{title}}` | エイリアス | `私のメモ` |
| `{{date:FORMAT}}` | カスタム日付フォーマット | `{{date:YYYYMMDD}}` → `20250114` |

### 例

| フォーマット | 結果（エイリアス: "私のメモ"） |
|-------------|------------------------------|
| `{{date}}-{{title}}` | `2025-01-14-私のメモ.md` |
| `{{title}}` | `私のメモ.md` |

---

## テンプレートファイル仕様

### プレースホルダー

| プレースホルダー | 説明 |
|-----------------|------|
| `{{content}}` | 選択範囲のテキスト |
| `{{title}}` | ファイル名（拡張子なし） |
| `{{alias}}` | エイリアス（入力された場合） |
| `{{date}}` | 作成日（YYYY-MM-DD） |
| `{{time}}` | 作成時刻（HH:mm:ss） |
| `{{datetime}}` | 作成日時（YYYY-MM-DD HH:mm:ss） |
| `{{date:FORMAT}}` | カスタム日付フォーマット |

### テンプレート例

```markdown
---
created: {{datetime}}
tags:
  - note
---

{{content}}
```

### フロントマターのマージ動作

テンプレートにフロントマターがある場合、そのまま使用される。`{{content}}`がない場合は、フロントマターの後に選択範囲が挿入される。

---

## UI設計

### 設定画面

```
┌─────────────────────────────────────────────────────────────┐
│  Extract Selection Settings                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Extraction Templates                                 │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │ 📝 Note                              ★ ⋮ ↕   │ │   │
│  │  │ Basic note extraction                        │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │ 💭 Fleeting                          ☆ ⋮ ↕   │ │   │
│  │  │ Quick thought or idea                        │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │ 📚 Literature                        ☆ ⋮ ↕   │ │   │
│  │  │ Quote from external source                   │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  │  [+ Add Template]                                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Behavior                                            │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Insert link after extract          [toggle: ON]    │   │
│  │ Open note after extract            [toggle: OFF]   │   │
│  │ Remove indent by default           [toggle: OFF]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ UI                                                  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Show emoji in commands             [toggle: ON]    │   │
│  │ Show context menu items            [toggle: ON]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

★ = お気に入り（塗りつぶし）
☆ = お気に入りではない（枠のみ）
⋮ = メニュー（編集・削除）
↕ = ドラッグハンドル（並び替え）
```

### テンプレート編集モーダル

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Template                                        [×]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Name                                                       │
│  [Fleeting                                              ]   │
│                                                             │
│  Description (optional)                                     │
│  [Quick thought or idea                                 ]   │
│                                                             │
│  Icon (optional)                                            │
│  [💭                                                    ]   │
│                                                             │
│  Folder                                                     │
│  [10-Fleeting                                      ] [📁]   │
│                                                             │
│  File name format                                           │
│  [{{zettel-id}}                                         ]   │
│  Preview: 20250114153000.md                                 │
│                                                             │
│  Template file (optional)                                   │
│  [Templates/fleeting.md                            ] [📄]   │
│                                                             │
│  [✓] Show alias input                                       │
│                                                             │
│                              [Cancel]         [Save]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### テンプレート選択モーダル（抽出時）

```
┌─────────────────────────────────────────────────────────────┐
│  Extract to...                                              │
├─────────────────────────────────────────────────────────────┤
│  [Search templates...                                   ]   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 📝 Note                                               │ │
│  │ Basic note extraction                                 │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ 💭 Fleeting                                           │ │
│  │ Quick thought or idea                                 │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ 📚 Literature                                         │ │
│  │ Quote from external source                            │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### エイリアス入力モーダル

```
┌─────────────────────────────────────────────────────────────┐
│  Enter alias                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Alias (optional)                                           │
│  [                                                      ]   │
│                                                             │
│  [✓] Remove common indent                                   │
│                                                             │
│                              [Cancel]       [Create]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## コマンド設計

### コマンド一覧

| コマンドID | 名前 | 説明 |
|-----------|------|------|
| `extract-selection` | Extract to Note | テンプレート選択モーダルを開いて抽出 |

### コンテキストメニュー構成

テキスト選択時の右クリックメニュー:

```
┌─────────────────────────────┐
│ ...                         │
├─────────────────────────────┤
│ 📝 Extract to Note          │  ← 常に表示（汎用コマンド）
├─────────────────────────────┤
│ 💭 Extract to Fleeting      │  ← お気に入りテンプレート
│ 📚 Extract to Literature    │  ← お気に入りテンプレート
├─────────────────────────────┤
│ ...                         │
└─────────────────────────────┘
```

**動作**:
- **Extract to Note**: テンプレート選択モーダルを開く
- **Extract to [Template]**: 直接そのテンプレートで抽出（モーダルスキップ）

---

## 処理フロー

### 抽出フロー（汎用コマンド）

```
テキスト選択
    ↓
「Extract to Note」コマンド実行
    ↓
テンプレート選択モーダル表示
    ↓
テンプレート選択
    ↓
showAliasInput = true?
    ├─ Yes → エイリアス入力モーダル表示
    │         ↓
    │        エイリアス入力（任意）
    │        インデント削除オプション選択
    │         ↓
    └─ No  → デフォルト値を使用

    ↓
ノート作成
    ├─ フォルダ存在確認・作成
    ├─ ファイル名生成
    ├─ テンプレート展開
    └─ ファイル作成
    ↓
insertLinkAfterExtract = true?
    └─ Yes → 元の選択範囲をリンクに置換
    ↓
openAfterExtract = true?
    └─ Yes → 新規ノートを開く
    ↓
完了通知
```

### 抽出フロー（お気に入りショートカット）

```
テキスト選択
    ↓
コンテキストメニューからお気に入りテンプレート選択
    ↓
showAliasInput = true?
    ├─ Yes → エイリアス入力モーダル表示
    └─ No  → デフォルト値を使用
    ↓
ノート作成（以下同じ）
```

---

## ファイル構成（新設計）

```
src/
├── main.ts                          # プラグインエントリーポイント
├── settings.ts                      # 設定タブUI（大幅改修）
├── types/
│   ├── index.ts                     # 型エクスポート
│   └── settings.ts                  # 設定型定義（新規）
├── commands/
│   └── extract-selection-command.ts # 抽出コマンド（改修）
├── services/
│   ├── template-service.ts          # テンプレート処理（維持）
│   ├── note-creator-service.ts      # ノート作成（改修）
│   ├── folder-service.ts            # フォルダ管理（簡略化）
│   └── frontmatter-service.ts       # フロントマター処理（維持）
├── ui/
│   ├── modals/
│   │   ├── template-select-modal.ts # テンプレート選択（新規）
│   │   ├── template-edit-modal.ts   # テンプレート編集（新規）
│   │   └── alias-input-modal.ts     # エイリアス入力（維持）
│   ├── suggesters/
│   │   ├── folder-suggest.ts        # フォルダサジェスト（維持）
│   │   └── file-suggest.ts          # ファイルサジェスト（維持）
│   └── components/
│       └── template-list.ts         # 設定画面のテンプレートリスト（新規）
├── utils/
│   ├── frontmatter-parser.ts        # フロントマターパース（維持）
│   └── uuid.ts                      # UUID生成（新規）
└── i18n/
    ├── index.ts                     # i18n設定
    └── locales/
        ├── en.json                  # 英語翻訳（改修）
        └── ja.json                  # 日本語翻訳（改修）
```

### 削除するファイル

```
src/
├── types/
│   └── note-types.ts                # 固定ノートタイプ定義 → 削除
├── commands/
│   └── promote-note-command.ts      # 昇格コマンド → 削除
├── services/
│   ├── promotion-service.ts         # 昇格サービス → 削除
│   └── orphan-detector-service.ts   # 孤立検出サービス → 削除
├── core/
│   └── note-manager.ts              # 旧ノートマネージャー → 削除
├── ui/
│   ├── modals/
│   │   ├── note-type-modal.ts       # タイプ選択モーダル → 削除
│   │   └── quick-capture-modal.ts   # クイックキャプチャ → 削除
│   └── views/
│       └── orphan-view.ts           # 孤立ノートビュー → 削除
```

---

## 実装フェーズ

### Phase 1: 型定義・設定構造の移行

- [ ] `types/settings.ts` - 新しいExtractionTemplate型定義
- [ ] `settings.ts` - DEFAULT_SETTINGS更新

### Phase 2: 不要コード削除

- [ ] `note-types.ts` 削除
- [ ] `promote-note-command.ts` 削除
- [ ] `promotion-service.ts` 削除
- [ ] `orphan-detector-service.ts` 削除
- [ ] `orphan-view.ts` 削除
- [ ] `note-type-modal.ts` 削除
- [ ] `quick-capture-modal.ts` 削除
- [ ] `note-manager.ts` 削除
- [ ] main.tsから関連コマンド・ビュー登録削除

### Phase 3: 新UI実装

- [ ] `template-select-modal.ts` - FuzzySuggestModal継承
- [ ] `template-edit-modal.ts` - Modal継承
- [ ] `template-list.ts` - 設定画面用コンポーネント
- [ ] `settings.ts` - 新しい設定画面UI

### Phase 4: サービス改修

- [ ] `note-creator-service.ts` - ExtractionTemplateベースに改修
- [ ] `folder-service.ts` - 簡略化（動的フォルダのみ）
- [ ] `template-service.ts` - 必要に応じて調整

### Phase 5: コマンド・メニュー改修

- [ ] `extract-selection-command.ts` - 新フローに改修
- [ ] `main.ts` - コマンド登録・コンテキストメニュー改修

### Phase 6: i18n更新

- [ ] `en.json` - 翻訳キー更新
- [ ] `ja.json` - 翻訳キー更新

### Phase 7: テスト・ドキュメント

- [ ] 動作テスト
- [ ] README更新

---

## 補足

### マークダウンリンク形式

リンク形式: `[表示名](相対パス/ファイル名.md)`

| 状況 | 生成されるリンク |
|------|----------------|
| エイリアスあり | `[エイリアス名](Folder/20250114153000.md)` |
| エイリアスなし | `[20250114153000](Folder/20250114153000.md)` |

### 共通インデント削除

選択範囲の各行から最小共通インデントを削除:

```
入力:
    - Item 1
      - Sub item
    - Item 2

出力:
- Item 1
  - Sub item
- Item 2
```

### テンプレートが未設定の場合

テンプレートファイルが指定されていない場合:
- 選択範囲のテキストのみでノートを作成
- フロントマターは生成しない（シンプルなテキストファイル）
