// ============================================================
// Type Definitions (DO NOT MODIFY - request human review for schema changes)
// ============================================================

// PBI lifecycle: draft (idea) -> refining (gathering info) -> ready (can start) -> done
type PBIStatus = "draft" | "refining" | "ready" | "done";

// Sprint lifecycle
type SprintStatus = "planning" | "in_progress" | "review" | "done" | "cancelled";

// TDD cycle: pending -> red (test written) -> green (impl done) -> refactoring -> completed
type SubtaskStatus = "pending" | "red" | "green" | "refactoring" | "completed";

// behavioral = changes observable behavior, structural = refactoring only
type SubtaskType = "behavioral" | "structural";

// Commits happen only after tests pass (green/refactoring), never on red
type CommitPhase = "green" | "refactoring";

// When to execute retrospective actions:
//   immediate: Apply within Retrospective (non-production code, single logical change)
//   sprint: Add as subtask to next sprint (process improvements)
//   product: Add as new PBI to Product Backlog (feature additions)
type ImprovementTiming = "immediate" | "sprint" | "product";

type ImprovementStatus = "active" | "completed" | "abandoned";

interface SuccessMetric {
  metric: string;
  target: string;
}

interface ProductGoal {
  statement: string;
  success_metrics: SuccessMetric[];
}

interface AcceptanceCriterion {
  criterion: string;
  verification: string;
}

interface UserStory {
  role: string;
  capability: string;
  benefit: string;
}

interface PBI {
  id: string;
  story: UserStory;
  acceptance_criteria: AcceptanceCriterion[];
  status: PBIStatus;
}

interface Commit {
  hash: string;
  message: string;
  phase: CommitPhase;
}

interface Subtask {
  test: string;
  implementation: string;
  type: SubtaskType;
  status: SubtaskStatus;
  commits: Commit[];
  notes: string[];
}

interface Sprint {
  number: number;
  pbi_id: string;
  goal: string;
  status: SprintStatus;
  subtasks: Subtask[];
}

interface DoDCheck {
  name: string;
  run: string;
}

interface DefinitionOfDone {
  checks: DoDCheck[];
}

interface Improvement {
  action: string;
  timing: ImprovementTiming;
  status: ImprovementStatus;
  outcome: string | null;
}

interface Retrospective {
  sprint: number;
  improvements: Improvement[];
}

interface ScrumDashboard {
  product_goal: ProductGoal;
  product_backlog: PBI[];
  sprint: Sprint | null;
  definition_of_done: DefinitionOfDone;
  completed: Sprint[];
  retrospectives: Retrospective[];
}

// ============================================================
// Dashboard Data (AI edits this section)
// ============================================================

const scrum: ScrumDashboard = {
  product_goal: {
    statement:
      "Obsidianユーザーが選択範囲から柔軟なテンプレートベースでノートを抽出できる汎用プラグインを提供する",
    success_metrics: [
      { metric: "ユーザー定義テンプレート数", target: "無制限" },
      { metric: "コンテキストメニュー応答時間", target: "< 100ms" },
      { metric: "TypeScriptエラー", target: "0件" },
    ],
  },

  product_backlog: [
    {
      id: "PBI-001",
      story: { role: "Obsidianユーザー", capability: "ExtractionTemplate型による新設定構造", benefit: "無制限のユーザー定義テンプレート" },
      acceptance_criteria: [
        { criterion: "ExtractionTemplate interface定義", verification: "types/settings.ts" },
        { criterion: "ExtractSelectionSettings定義", verification: "types/settings.ts" },
        { criterion: "DEFAULT_SETTINGS更新", verification: "settings.ts" },
      ],
      status: "done",
    },
    {
      id: "PBI-002",
      story: { role: "開発者", capability: "不要なZettelkasten固有コード削除", benefit: "コードベースの簡略化" },
      acceptance_criteria: [
        { criterion: "8個のレガシーファイル削除", verification: "ファイル不存在確認" },
        { criterion: "main.tsクリーンアップ", verification: "レガシーコード削除" },
        { criterion: "DoD全チェック成功", verification: "tsc/lint/build" },
      ],
      status: "done",
    },
    {
      id: "PBI-003",
      story: { role: "Obsidianユーザー", capability: "テンプレート選択・編集モーダル", benefit: "直感的UI" },
      acceptance_criteria: [
        {
          criterion: "TemplateSelectModal実装（FuzzySuggestModal継承）",
          verification: "template-select-modal.ts存在、FuzzySuggestModal<ExtractionTemplate>継承、getItems/getItemText/onChooseItem実装"
        },
        {
          criterion: "検索機能動作",
          verification: "name/description/iconでの検索動作、order順のソート"
        },
        {
          criterion: "TemplateEditModal実装（Modal継承）",
          verification: "template-edit-modal.ts存在、全ExtractionTemplateプロパティのフォーム存在"
        },
        {
          criterion: "入力フィールド検証",
          verification: "name/folder/fileNameFormat入力欄、description/icon/templatePath任意欄、showAliasInputトグル、フォルダサジェスト動作"
        },
        {
          criterion: "保存/キャンセル動作",
          verification: "Saveボタンでコールバック実行、Cancelボタンでモーダル閉鎖、Enter/Escapeキー動作"
        },
        {
          criterion: "ファイル名プレビュー表示",
          verification: "fileNameFormat入力時にリアルタイムプレビュー更新（{{date}}/{{time}}/{{datetime}}展開）"
        },
      ],
      status: "ready",
    },
    {
      id: "PBI-004",
      story: { role: "Obsidianユーザー", capability: "ExtractionTemplateベースのノート作成", benefit: "カスタムテンプレート対応" },
      acceptance_criteria: [
        { criterion: "note-creator-service更新", verification: "ExtractionTemplate引数" },
        { criterion: "folder-service更新", verification: "動的フォルダ対応" },
      ],
      status: "draft",
    },
    {
      id: "PBI-005",
      story: { role: "Obsidianユーザー", capability: "新コマンド・コンテキストメニュー", benefit: "お気に入りへの素早いアクセス" },
      acceptance_criteria: [
        { criterion: "extract-selection新フロー", verification: "テンプレート選択モーダル" },
        { criterion: "お気に入りメニュー表示", verification: "isFavorite=true表示" },
      ],
      status: "draft",
    },
    {
      id: "PBI-006",
      story: { role: "多言語ユーザー", capability: "i18n翻訳更新", benefit: "母国語UI" },
      acceptance_criteria: [
        { criterion: "en.json更新", verification: "テンプレート翻訳" },
        { criterion: "ja.json更新", verification: "テンプレート翻訳" },
      ],
      status: "draft",
    },
    {
      id: "PBI-007",
      story: { role: "開発者", capability: "動作検証・ドキュメント", benefit: "リリース品質" },
      acceptance_criteria: [
        { criterion: "ビルド成功", verification: "pnpm build" },
        { criterion: "Lint成功", verification: "pnpm lint" },
      ],
      status: "draft",
    },
  ],

  sprint: {
    number: 3,
    pbi_id: "PBI-003",
    goal: "テンプレート選択・編集モーダルを実装し、直感的なテンプレート管理UIを提供する",
    status: "in_progress",
    subtasks: [
      {
        test: "TemplateSelectModalがFuzzySuggestModal<ExtractionTemplate>を継承し、getItems/getItemText/onChooseItemを実装していることを型レベルで検証",
        implementation: "template-select-modal.ts作成、FuzzySuggestModal継承、テンプレート一覧の取得・表示・選択ロジック実装、order順ソート、name/description/iconでの検索対応",
        type: "behavioral",
        status: "completed",
        commits: [
          { hash: "94f5bf9", message: "feat(ui): implement TemplateSelectModal with fuzzy search", phase: "green" }
        ],
        notes: [
          "DESIGN.mdのテンプレート選択モーダル仕様に準拠",
          "alias-input-modal.tsのModalパターンを参考",
          "ExtractionTemplate型をsrc/types/settings.tsから参照"
        ]
      },
      {
        test: "TemplateEditModalがModal継承し、全ExtractionTemplateプロパティのフォームを持ち、保存/キャンセル/Enterキー/Escapeキー動作を検証",
        implementation: "template-edit-modal.ts作成、Modal継承、name/description/icon/folder/fileNameFormat/templatePath/showAliasInputの入力フィールド実装、保存/キャンセルボタン、キーボードショートカット",
        type: "behavioral",
        status: "completed",
        commits: [
          { hash: "2ca6553", message: "feat(ui): implement TemplateEditModal with form fields", phase: "green" }
        ],
        notes: [
          "DESIGN.mdのテンプレート編集モーダル仕様に準拠",
          "alias-input-modal.tsのフォーム実装パターンを参考",
          "必須フィールド（name/folder/fileNameFormat）と任意フィールド（description/icon/templatePath）の区別"
        ]
      },
      {
        test: "TemplateEditModalにfolderフィールドのフォルダサジェスト機能とfileNameFormatフィールドのリアルタイムプレビュー機能を統合し動作検証",
        implementation: "FolderSuggestをfolderフィールドに統合、fileNameFormatのonChangeでプレビュー更新ロジック実装（{{date}}/{{time}}/{{datetime}}の展開）、プレビュー表示要素の追加",
        type: "behavioral",
        status: "green",
        commits: [],
        notes: [
          "src/ui/suggesters/folder-suggest.ts既存実装を活用",
          "DESIGN.mdのファイル名フォーマット仕様に準拠",
          "プレビュー例: {{date}}-{{title}} → 2025-01-14-私のメモ.md"
        ]
      },
      {
        test: "TypeScript型チェック、Lint、Buildが全て成功することを検証",
        implementation: "pnpm exec tsc --noEmit、pnpm lint、pnpm buildを実行し、全エラーを修正",
        type: "structural",
        status: "pending",
        commits: [],
        notes: [
          "Definition of Doneの全チェック項目を実行",
          "Sprint 2振り返り「依存関係の確認を削除前に実施」を適用"
        ]
      }
    ]
  },

  definition_of_done: {
    checks: [
      { name: "TypeScript型チェック", run: "pnpm exec tsc --noEmit" },
      { name: "Lint", run: "pnpm lint" },
      { name: "Build", run: "pnpm build" },
    ],
  },

  completed: [
    { number: 1, pbi_id: "PBI-001", goal: "ExtractionTemplate型と新設定構造を導入", status: "done", subtasks: [] },
    { number: 2, pbi_id: "PBI-002", goal: "レガシーZettelkastenコード削除", status: "done", subtasks: [] },
  ],

  retrospectives: [
    {
      sprint: 1,
      improvements: [
        { action: "TDDアプローチ継続", timing: "immediate", status: "completed", outcome: "型安全性維持" },
        { action: "関連サブタスク統合", timing: "sprint", status: "completed", outcome: "Sprint2で4タスクに統合" },
      ],
    },
    {
      sprint: 2,
      improvements: [
        { action: "依存関係の確認を削除前に実施", timing: "sprint", status: "active", outcome: null },
        { action: "サービス層のスタブ化パターン適用", timing: "immediate", status: "completed", outcome: "ビルド通過維持" },
      ],
    },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
