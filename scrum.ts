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
        {
          criterion: "Extract to Noteコマンド実装",
          verification: "コマンドパレット実行→TemplateSelectModal表示→テンプレート選択→NoteCreatorService呼出"
        },
        {
          criterion: "お気に入りコンテキストメニュー",
          verification: "右クリック→isFavorite=trueが独立項目表示→直接抽出実行"
        },
        {
          criterion: "NoteCreatorService統合",
          verification: "ExtractionTemplate/選択範囲/エイリアス/オプションを正しく渡す"
        },
        {
          criterion: "UI設定反映",
          verification: "showEmojiInCommands/showContextMenuItems動作確認"
        },
      ],
      status: "ready",
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
    number: 5,
    pbi_id: "PBI-005",
    goal: "TemplateSelectModalとNoteCreatorServiceを統合し、お気に入りテンプレートへの素早いアクセスを実現",
    status: "planning",
    subtasks: [
      {
        test: "extractSelectionコマンドがTemplateSelectModalを開き、選択したテンプレートでNoteCreatorServiceを呼ぶ",
        implementation: "extract-selection-commandを更新してTemplateSelectModal統合とNoteCreatorService呼出を実装",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [
          "TemplateSelectModalはsrc/ui/modals/template-select-modal.tsで既に実装済み",
          "NoteCreatorServiceはsrc/services/note-creator-service.tsで既に実装済み",
          "AliasInputModalはsrc/ui/modals/alias-input-modal.tsで既に実装済み",
          "showAliasInput=trueの場合、AliasInputModalを表示後にNoteCreatorServiceを呼ぶ",
        ],
      },
      {
        test: "isFavorite=trueのテンプレートが右クリックメニューに独立項目として表示され、直接抽出できる",
        implementation: "main.tsにコンテキストメニュー登録処理を追加し、お気に入りテンプレートへのショートカットを実装",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [
          "showContextMenuItems設定がtrueの場合のみ表示",
          "showEmojiInCommands設定がtrueの場合、絵文字を含める",
          "各お気に入りテンプレートは選択されたテンプレートで直接extractSelectionフローを実行",
        ],
      },
      {
        test: "DoD全チェック(tsc/lint/build)が成功する",
        implementation: "TypeScript型チェック、Lint、Buildを実行してエラーを解消",
        type: "structural",
        status: "pending",
        commits: [],
        notes: [
          "pnpm exec tsc --noEmit",
          "pnpm lint",
          "pnpm build",
        ],
      },
    ],
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
    { number: 3, pbi_id: "PBI-003", goal: "テンプレート選択・編集モーダル", status: "done", subtasks: [] },
    { number: 4, pbi_id: "PBI-004", goal: "ExtractionTemplateノート作成検証・クリーンアップ", status: "done", subtasks: [] },
  ],

  retrospectives: [
    { sprint: 1, improvements: [{ action: "TDDアプローチ継続", timing: "immediate", status: "completed", outcome: "型安全性維持" }] },
    { sprint: 2, improvements: [{ action: "サービス層スタブ化", timing: "immediate", status: "completed", outcome: "ビルド通過維持" }] },
    { sprint: 3, improvements: [{ action: "Obsidian UIパターン活用", timing: "immediate", status: "completed", outcome: "UX向上" }] },
    { sprint: 4, improvements: [{ action: "早期実装によるクリーンアップスプリント", timing: "immediate", status: "completed", outcome: "効率的検証" }] },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
