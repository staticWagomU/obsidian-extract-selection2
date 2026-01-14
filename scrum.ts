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
        { criterion: "TemplateSelectModal実装", verification: "FuzzySuggestModal継承" },
        { criterion: "TemplateEditModal実装", verification: "全プロパティフォーム" },
        { criterion: "フォルダサジェスト・プレビュー", verification: "動的UI機能" },
      ],
      status: "done",
    },
    {
      id: "PBI-004",
      story: { role: "Obsidianユーザー", capability: "ExtractionTemplateベースのノート作成", benefit: "カスタムテンプレート対応" },
      acceptance_criteria: [
        {
          criterion: "ファイル名プレースホルダー展開",
          verification: "{{date}}, {{time}}, {{datetime}}, {{zettel-id}}, {{title}}, {{alias}}が正しく展開される"
        },
        {
          criterion: "テンプレートプレースホルダー展開",
          verification: "{{content}}, {{title}}, {{alias}}, {{date}}, {{time}}, {{datetime}}, {{date:FORMAT}}が正しく展開される"
        },
        {
          criterion: "カスタム日付フォーマット対応",
          verification: "{{date:YYYYMMDD}}等のカスタムフォーマットが正しく処理される"
        },
        {
          criterion: "フォルダ自動作成",
          verification: "存在しないフォルダパスが自動的に作成される（ネストされたパス含む）"
        },
        {
          criterion: "テンプレートファイル読込",
          verification: "templatePathが指定された場合、ファイルが読み込まれて変数展開される"
        },
        {
          criterion: "テンプレートなし処理",
          verification: "templatePathが空の場合、contentのみでノートが作成される"
        },
        {
          criterion: "フロントマターマージ",
          verification: "テンプレートのfrontmatterとデフォルトmetadataが正しくマージされる"
        },
        {
          criterion: "source_notes自動付与",
          verification: "sourceFileが提供された場合、frontmatterにsource_notesが追加される"
        },
        {
          criterion: "ファイル名サニタイズ",
          verification: "不正文字（\\/:*?\"<>|）がハイフンに置換される"
        },
        {
          criterion: "空フォルダパス処理",
          verification: "folderが空文字列の場合、vaultルートにファイルが作成される"
        },
        {
          criterion: "作成通知表示",
          verification: "ノート作成後、template.iconとタイトルを含む通知が表示される"
        },
        {
          criterion: "DoD全チェック成功",
          verification: "tsc/lint/build"
        },
      ],
      status: "ready",
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

  sprint: null,

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
    { number: 3, pbi_id: "PBI-003", goal: "テンプレート選択・編集モーダルを実装し、直感的なテンプレート管理UIを提供する", status: "done", subtasks: [] },
  ],

  retrospectives: [
    { sprint: 1, improvements: [{ action: "TDDアプローチ継続", timing: "immediate", status: "completed", outcome: "型安全性維持" }] },
    { sprint: 2, improvements: [{ action: "サービス層スタブ化", timing: "immediate", status: "completed", outcome: "ビルド通過維持" }] },
    { sprint: 3, improvements: [
      { action: "Obsidian UIパターン活用", timing: "immediate", status: "completed", outcome: "FuzzySuggestModal/Setting活用" },
      { action: "リアルタイムプレビュー実装", timing: "immediate", status: "completed", outcome: "UX向上" },
    ]},
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
