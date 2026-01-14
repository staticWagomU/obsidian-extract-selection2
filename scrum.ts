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
      story: {
        role: "Obsidianユーザー",
        capability: "ExtractionTemplate型を使用した新しい設定構造",
        benefit: "固定3タイプから無制限のユーザー定義テンプレートに移行できる",
      },
      acceptance_criteria: [
        {
          criterion: "ExtractionTemplate interfaceが9つの必須プロパティを持つ",
          verification: "types/settings.tsにid, name, description, icon, folder, fileNameFormat, templatePath, showAliasInput, isFavorite, orderが定義されている",
        },
        {
          criterion: "ExtractSelectionSettings interfaceがtemplates配列を持つ",
          verification: "types/settings.tsにtemplates: ExtractionTemplate[]が定義されている",
        },
        {
          criterion: "BehaviorSettingsがdefaultRemoveIndentを含む",
          verification: "types/settings.tsのBehaviorSettingsにdefaultRemoveIndent: booleanが定義され、moveOnPromotionとfileNamePrefixが削除されている",
        },
        {
          criterion: "UISettingsがmobileOptimizedを含まない",
          verification: "types/settings.tsのUISettingsにmobileOptimizedプロパティが存在しない",
        },
        {
          criterion: "DEFAULT_SETTINGSが1つのデフォルトテンプレートを含む",
          verification: "settings.tsのDEFAULT_SETTINGS.templatesにid=\"default-note\"のテンプレートが1つ定義されている",
        },
        {
          criterion: "DEFAULT_SETTINGSのbehaviorが新仕様に準拠",
          verification: "settings.tsのDEFAULT_SETTINGS.behaviorにdefaultRemoveIndent: falseが含まれ、moveOnPromotionとfileNamePrefixが存在しない",
        },
        {
          criterion: "DEFAULT_SETTINGSのuiが新仕様に準拠",
          verification: "settings.tsのDEFAULT_SETTINGS.uiにmobileOptimizedが存在しない",
        },
        {
          criterion: "PageZettelSettingsがExtractSelectionSettingsに置き換えられる",
          verification: "types/settings.tsにPageZettelSettingsが存在せず、ExtractSelectionSettingsがエクスポートされている",
        },
      ],
      status: "ready",
    },
    {
      id: "PBI-002",
      story: {
        role: "開発者",
        capability: "不要なZettelkasten固有コードを削除",
        benefit: "コードベースがシンプルになり保守性が向上する",
      },
      acceptance_criteria: [
        {
          criterion: "note-types.ts, promote-note-command.ts等が削除",
          verification: "該当ファイルが存在しない",
        },
        {
          criterion: "main.tsから関連コマンド・ビュー登録が削除",
          verification: "main.tsにorphan/promote関連コードがない",
        },
      ],
      status: "draft",
    },
    {
      id: "PBI-003",
      story: {
        role: "Obsidianユーザー",
        capability: "テンプレート選択・編集モーダル",
        benefit: "直感的なUIでテンプレートを選択・管理できる",
      },
      acceptance_criteria: [
        {
          criterion: "FuzzySuggestModalベースのテンプレート選択UI",
          verification: "template-select-modal.tsが動作する",
        },
        {
          criterion: "Modalベースのテンプレート編集UI",
          verification: "template-edit-modal.tsが動作する",
        },
      ],
      status: "draft",
    },
    {
      id: "PBI-004",
      story: {
        role: "Obsidianユーザー",
        capability: "ExtractionTemplateベースのノート作成",
        benefit: "カスタムテンプレートでノートを作成できる",
      },
      acceptance_criteria: [
        {
          criterion: "note-creator-serviceがExtractionTemplateを受け取る",
          verification: "サービスの引数型がExtractionTemplate",
        },
        {
          criterion: "folder-serviceが動的フォルダをサポート",
          verification: "テンプレートのfolderプロパティが使用される",
        },
      ],
      status: "draft",
    },
    {
      id: "PBI-005",
      story: {
        role: "Obsidianユーザー",
        capability: "新フローに基づくコマンドとコンテキストメニュー",
        benefit: "お気に入りテンプレートへの素早いアクセス",
      },
      acceptance_criteria: [
        {
          criterion: "extract-selectionコマンドが新フローを使用",
          verification: "コマンド実行時にテンプレート選択モーダルが開く",
        },
        {
          criterion: "お気に入りテンプレートがコンテキストメニューに表示",
          verification: "isFavorite=trueのテンプレートがメニューに表示",
        },
      ],
      status: "draft",
    },
    {
      id: "PBI-006",
      story: {
        role: "多言語ユーザー",
        capability: "更新されたi18n翻訳",
        benefit: "新UIが母国語で表示される",
      },
      acceptance_criteria: [
        {
          criterion: "en.jsonに新しい翻訳キーが追加",
          verification: "テンプレート関連の英語翻訳が存在",
        },
        {
          criterion: "ja.jsonに新しい翻訳キーが追加",
          verification: "テンプレート関連の日本語翻訳が存在",
        },
      ],
      status: "draft",
    },
    {
      id: "PBI-007",
      story: {
        role: "開発者",
        capability: "全機能の動作検証とドキュメント更新",
        benefit: "リリース品質の確保",
      },
      acceptance_criteria: [
        {
          criterion: "ビルドが成功する",
          verification: "pnpm build が成功",
        },
        {
          criterion: "Lintが通る",
          verification: "pnpm lint が成功",
        },
      ],
      status: "draft",
    },
  ],

  sprint: {
    number: 1,
    pbi_id: "PBI-001",
    goal: "ExtractionTemplate型と新設定構造を導入し、固定3タイプから無制限テンプレートへの基盤を確立する",
    status: "in_progress",
    subtasks: [
      {
        test: "ExtractionTemplate interfaceが9つの必須プロパティ(id, name, description, icon, folder, fileNameFormat, templatePath, showAliasInput, isFavorite, order)を持つことを検証",
        implementation: "types/settings.tsにExtractionTemplate interfaceを定義",
        type: "behavioral",
        status: "green",
        commits: [],
        notes: [
          "検証方法: types/settings.tsにExtractionTemplate interfaceを追加し、pnpm exec tsc --noEmitで型チェックを実行",
          "実装完了: ExtractionTemplateを9つのプロパティで定義。pnpm buildが成功",
        ],
      },
      {
        test: "BehaviorSettingsにdefaultRemoveIndent: booleanが存在し、moveOnPromotionとfileNamePrefixが削除されていることを検証",
        implementation: "types/settings.tsのBehaviorSettingsを更新: defaultRemoveIndent追加、moveOnPromotion/fileNamePrefix削除",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "UISettingsからmobileOptimizedプロパティが削除されていることを検証",
        implementation: "types/settings.tsのUISettingsを更新: mobileOptimizedを削除",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "ExtractSelectionSettings interfaceがtemplates: ExtractionTemplate[]プロパティを持ち、PageZettelSettingsが存在しないことを検証",
        implementation: "types/settings.tsにExtractSelectionSettings interfaceを定義し、PageZettelSettingsを削除",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "settings.tsのDEFAULT_SETTINGSの型がExtractSelectionSettingsであることを検証",
        implementation: "settings.tsのDEFAULT_SETTINGS型宣言をExtractSelectionSettingsに変更",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "DEFAULT_SETTINGS.templatesにid=\"default-note\"のテンプレートが1つ定義されていることを検証",
        implementation: "settings.tsのDEFAULT_SETTINGSを更新: fleeting/literature/permanentを削除し、templates配列に1つのデフォルトテンプレートを追加",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "DEFAULT_SETTINGS.behaviorにdefaultRemoveIndent: falseが含まれ、moveOnPromotionとfileNamePrefixが存在しないことを検証",
        implementation: "settings.tsのDEFAULT_SETTINGS.behaviorを更新",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "DEFAULT_SETTINGS.uiにmobileOptimizedが存在しないことを検証",
        implementation: "settings.tsのDEFAULT_SETTINGS.uiを更新: mobileOptimizedを削除",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "TypeScript型チェックが成功することを検証(pnpm exec tsc --noEmit)",
        implementation: "型エラーを修正し、すべての型定義が整合性を持つことを確認",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
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

  completed: [],

  retrospectives: [],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
