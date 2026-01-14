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
        {
          criterion: "8個のレガシーファイル削除完了",
          verification: "note-types.ts, promote-note-command.ts, promotion-service.ts, orphan-detector-service.ts, orphan-view.ts, note-type-modal.ts, quick-capture-modal.ts, note-manager.tsが存在しない",
        },
        {
          criterion: "main.tsからレガシーインポート削除",
          verification: "NoteManager, PromotionService, promoteNote, OrphanView, QuickCaptureModal, NoteTypeModal, NoteTypeのインポートが存在しない",
        },
        {
          criterion: "main.tsからレガシーサービス初期化削除",
          verification: "noteManager, promotionServiceプロパティとその初期化コードが存在しない",
        },
        {
          criterion: "main.tsからOrphanViewビュー登録削除",
          verification: "OrphanView registerView呼び出しとリボンアイコン登録が存在しない",
        },
        {
          criterion: "main.tsからレガシーコマンド削除",
          verification: "promote-note, quick-fleeting, create-new-noteコマンドが存在しない",
        },
        {
          criterion: "main.tsからレガシーコンテキストメニュー削除",
          verification: "extractToFleeting/Literature/Permanent、promoteNoteのコンテキストメニューアイテムが存在しない",
        },
        {
          criterion: "main.tsからレガシーヘルパーメソッド削除",
          verification: "activateOrphanView, createNoteAndOpenメソッドが存在しない",
        },
        {
          criterion: "TypeScript型チェック成功",
          verification: "pnpm exec tsc --noEmit がエラーなしで完了",
        },
      ],
      status: "done",
    },
    {
      id: "PBI-003",
      story: { role: "Obsidianユーザー", capability: "テンプレート選択・編集モーダル", benefit: "直感的UI" },
      acceptance_criteria: [
        { criterion: "テンプレート選択UI", verification: "template-select-modal.ts" },
        { criterion: "テンプレート編集UI", verification: "template-edit-modal.ts" },
      ],
      status: "draft",
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
    number: 2,
    pbi_id: "PBI-002",
    goal: "Zettelkasten固有のレガシーコードを完全削除し、Extract Selection汎用プラグインの基盤を確立する",
    status: "review",
    subtasks: [
      {
        test: "8個のレガシーファイルが存在しないこと",
        implementation: "note-types.ts, promote-note-command.ts, promotion-service.ts, orphan-detector-service.ts, orphan-view.ts, note-type-modal.ts, quick-capture-modal.ts, note-manager.ts を削除",
        type: "structural",
        status: "completed",
        commits: [
          {
            hash: "ded03e0",
            message: "refactor: delete 8 legacy Zettelkasten files",
            phase: "green",
          },
        ],
        notes: ["RED: Verify that the 8 legacy files exist before deletion", "GREEN: All 8 legacy files deleted successfully"],
      },
      {
        test: "main.tsにレガシー依存関係が存在しないこと (import, service初期化, ビュー登録)",
        implementation: "NoteManager, PromotionService, promoteNote, OrphanView, QuickCaptureModal, NoteTypeModal, NoteType のインポート削除、noteManager/promotionServiceプロパティと初期化コード削除、OrphanView registerView呼び出しとリボンアイコン登録削除",
        type: "structural",
        status: "completed",
        commits: [
          {
            hash: "11b784d",
            message: "refactor: remove legacy dependencies from main.ts",
            phase: "green",
          },
        ],
        notes: ["RED: Identified legacy imports (lines 4-5, 11-14, 16), properties (lines 21-22), service initialization (lines 33-34), view registration (line 48), and ribbon icon (lines 51-53)", "GREEN: Removed all legacy dependencies from main.ts - imports, properties, service initialization, view registration, and ribbon icon"],
      },
      {
        test: "main.tsにレガシー機能が存在しないこと (コマンド, コンテキストメニュー, ヘルパーメソッド)",
        implementation: "promote-note, quick-fleeting, create-new-noteコマンド削除、extractToFleeting/Literature/Permanent・promoteNoteコンテキストメニューアイテム削除、activateOrphanView, createNoteAndOpenメソッド削除",
        type: "structural",
        status: "completed",
        commits: [
          {
            hash: "e3eda54",
            message: "refactor: remove legacy features from main.ts",
            phase: "green",
          },
        ],
        notes: ["RED: Identified legacy commands (lines 46-112), context menu items (lines 114-197), and helper methods (lines 210-243)", "GREEN: Removed all legacy commands, context menu items, helper methods, and unused imports from main.ts"],
      },
      {
        test: "pnpm exec tsc --noEmit がエラーなく完了すること",
        implementation: "TypeScript型チェックを実行し、すべての型エラーを解決",
        type: "structural",
        status: "completed",
        commits: [],
        notes: ["RED: Running type check to identify remaining errors after legacy code removal", "GREEN: tsc --noEmit, pnpm lint, pnpm build all passed successfully"],
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
    {
      number: 1,
      pbi_id: "PBI-001",
      goal: "ExtractionTemplate型と新設定構造を導入",
      status: "done",
      subtasks: [], // 9 subtasks完了: 9e234e4→0fa8348 (詳細はgit log参照)
    },
  ],

  retrospectives: [
    {
      sprint: 1,
      improvements: [
        { action: "TDDアプローチ(tsc --noEmit)継続", timing: "immediate", status: "completed", outcome: "型安全性維持" },
        { action: "@ts-expect-errorで技術的負債マーク", timing: "immediate", status: "completed", outcome: "削除範囲明確化" },
        { action: "関連サブタスク統合", timing: "sprint", status: "active", outcome: null },
        { action: "リファクタリングコミットに理由記録", timing: "sprint", status: "active", outcome: null },
      ],
    },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
