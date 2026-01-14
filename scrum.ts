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
        { criterion: "プレースホルダー展開", verification: "ファイル名・テンプレート変数" },
        { criterion: "フォルダ・テンプレート処理", verification: "自動作成・読込・マージ" },
        { criterion: "DoD全チェック成功", verification: "tsc/lint/build" },
      ],
      status: "done",
    },
    {
      id: "PBI-005",
      story: { role: "Obsidianユーザー", capability: "新コマンド・コンテキストメニュー", benefit: "お気に入りへの素早いアクセス" },
      acceptance_criteria: [
        { criterion: "Extract to Noteコマンド", verification: "TemplateSelectModal→NoteCreatorService" },
        { criterion: "お気に入りコンテキストメニュー", verification: "isFavorite=true直接抽出" },
        { criterion: "UI設定反映", verification: "showEmojiInCommands/showContextMenuItems" },
      ],
      status: "done",
    },
    {
      id: "PBI-006",
      story: { role: "多言語ユーザー", capability: "i18n翻訳更新", benefit: "母国語UI" },
      acceptance_criteria: [
        { criterion: "翻訳キー追加", verification: "en.json/ja.json更新" },
        { criterion: "ハードコードi18n化", verification: "t()関数使用" },
      ],
      status: "done",
    },
    {
      id: "PBI-007",
      story: { role: "開発者", capability: "最終検証とリリース準備", benefit: "リリース品質保証" },
      acceptance_criteria: [
        { criterion: "DoD全チェック成功", verification: "tsc/lint/build全通過" },
        { criterion: "コア機能動作確認", verification: "Extract to Noteコマンド・テンプレート選択・ノート作成" },
        { criterion: "設定画面表示確認", verification: "behavior/ui設定表示・保存" },
        { criterion: "i18n動作確認", verification: "en/ja翻訳適用確認" },
        { criterion: "manifest.json整合性", verification: "version/description/id確認" },
        { criterion: "ビルド成果物確認", verification: "main.js生成・サイズ妥当性" },
        { criterion: "DESIGN.md更新不要確認", verification: "設計書と実装の整合性" },
      ],
      status: "ready",
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
    { number: 3, pbi_id: "PBI-003", goal: "テンプレート選択・編集モーダル", status: "done", subtasks: [] },
    { number: 4, pbi_id: "PBI-004", goal: "ExtractionTemplateノート作成検証・クリーンアップ", status: "done", subtasks: [] },
    { number: 5, pbi_id: "PBI-005", goal: "コマンド・コンテキストメニュー統合", status: "done", subtasks: [] },
    { number: 6, pbi_id: "PBI-006", goal: "i18n翻訳更新（テンプレートUI多言語化）", status: "done", subtasks: [] },
  ],

  retrospectives: [
    { sprint: 1, improvements: [{ action: "TDDアプローチ継続", timing: "immediate", status: "completed", outcome: "型安全性維持" }] },
    { sprint: 2, improvements: [{ action: "サービス層スタブ化", timing: "immediate", status: "completed", outcome: "ビルド通過維持" }] },
    { sprint: 3, improvements: [{ action: "Obsidian UIパターン活用", timing: "immediate", status: "completed", outcome: "UX向上" }] },
    { sprint: 4, improvements: [{ action: "早期実装クリーンアップ", timing: "immediate", status: "completed", outcome: "効率的検証" }] },
    { sprint: 5, improvements: [{ action: "既存コンポーネント統合", timing: "immediate", status: "completed", outcome: "迅速な機能完成" }] },
    { sprint: 6, improvements: [{ action: "i18nパターンの一貫適用", timing: "immediate", status: "completed", outcome: "多言語対応完了" }] },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
