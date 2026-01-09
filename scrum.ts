// ============================================================
// Dashboard Data (AI edits this section)
// ============================================================

const userStoryRoles = [
  "Obsidianモバイルユーザー",
  "Zettelkasten実践者",
] as const satisfies readonly string[];

const scrum: ScrumDashboard = {
  product_goal: {
    statement:
      "最小限の操作でノートの切り出し・分類・接続を自動化する",
    success_metrics: [
      { metric: "ノート作成のタップ数", target: "3タップ以内" },
      { metric: "Structure Note接続率", target: "80%以上のPermanent Noteが接続済み" },
    ],
  },

  product_backlog: [
    // Phase 1: 基盤構築
    {
      id: "PBI-001",
      story: {
        role: "Zettelkasten実践者",
        capability: "ノートタイプ（Fleeting/Literature/Permanent/Structure/Index）を識別できる",
        benefit: "5種類のノートを適切に分類・管理できる",
      },
      acceptance_criteria: [
        { criterion: "NoteType型が5種類を網羅", verification: "pnpm build が成功" },
        { criterion: "NOTE_TYPE_CONFIGが各タイプの設定を持つ", verification: "型チェック通過" },
        { criterion: "PROMOTION_PATHSで昇格パスが定義", verification: "fleeting→permanent→structure→indexの流れ" },
      ],
      status: "ready",
    },
    {
      id: "PBI-002",
      story: {
        role: "Zettelkasten実践者",
        capability: "フロントマターでノートのメタデータを管理できる",
        benefit: "ノート間の関係性を自動追跡できる",
      },
      acceptance_criteria: [
        { criterion: "FrontmatterServiceでYAML読み書き", verification: "フロントマター追加・更新が動作" },
        { criterion: "getNoteTypeでタイプ取得", verification: "既存ノートからタイプ判定可能" },
        { criterion: "structure_notesリンク管理", verification: "接続追加が反映される" },
      ],
      status: "draft",
    },
    {
      id: "PBI-003",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "選択テキストから新規ノートを作成できる",
        benefit: "デイリーノートから素早くアイデアを切り出せる",
      },
      acceptance_criteria: [
        { criterion: "選択範囲から新規ノート作成", verification: "コマンド実行でノート生成" },
        { criterion: "NoteTypeModalでタイプ選択", verification: "3タイプから選択可能" },
        { criterion: "元ノートにリンク挿入", verification: "設定ONで[[リンク]]置換" },
      ],
      status: "draft",
    },
    {
      id: "PBI-004",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "テンプレートを使ってノートを作成できる",
        benefit: "一貫したフォーマットでノートを管理できる",
      },
      acceptance_criteria: [
        { criterion: "TemplateServiceで変数展開", verification: "{{title}}等が置換される" },
        { criterion: "5タイプ分のテンプレート", verification: "各テンプレートが存在" },
        { criterion: "日付フォーマット対応", verification: "{{date:YYYY-MM-DD}}が展開" },
      ],
      status: "draft",
    },
    {
      id: "PBI-005",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "プラグイン設定をカスタマイズできる",
        benefit: "自分のワークフローに合わせて調整できる",
      },
      acceptance_criteria: [
        { criterion: "SettingsTabでUI表示", verification: "設定タブが開ける" },
        { criterion: "フォルダパス変更可能", verification: "5タイプのフォルダ設定" },
        { criterion: "動作設定トグル", verification: "insertLinkAfterExtract等が切替可能" },
      ],
      status: "draft",
    },

    // Phase 2: 接続管理
    {
      id: "PBI-006",
      story: {
        role: "Zettelkasten実践者",
        capability: "ノートを昇格（Fleeting→Permanent等）できる",
        benefit: "アイデアを段階的に成熟させられる",
      },
      acceptance_criteria: [
        { criterion: "promoteNoteコマンド実装", verification: "昇格が実行される" },
        { criterion: "フロントマター更新", verification: "type/promoted_from/promoted_at反映" },
        { criterion: "フォルダ自動移動", verification: "設定ONで対応フォルダへ移動" },
      ],
      status: "draft",
    },
    {
      id: "PBI-007",
      story: {
        role: "Zettelkasten実践者",
        capability: "Permanent NoteをStructure Noteに接続できる",
        benefit: "知識のネットワークを構築できる",
      },
      acceptance_criteria: [
        { criterion: "ConnectionManager実装", verification: "双方向リンク作成" },
        { criterion: "SuggestionServiceで提案", verification: "タグ・タイトルマッチで候補表示" },
        { criterion: "StructureSuggestModal", verification: "選択またはスキップ可能" },
      ],
      status: "draft",
    },

    // Phase 3: 可視化
    {
      id: "PBI-008",
      story: {
        role: "Zettelkasten実践者",
        capability: "孤立したPermanent Noteを発見できる",
        benefit: "Structure Noteへの接続漏れを防げる",
      },
      acceptance_criteria: [
        { criterion: "OrphanDetector実装", verification: "structure_notes空のノート検出" },
        { criterion: "OrphanView表示", verification: "サイドバーに一覧表示" },
        { criterion: "接続ボタン動作", verification: "ワンタップでStructure提案" },
      ],
      status: "draft",
    },
  ],

  sprint: {
    number: 1,
    pbi_id: "PBI-001",
    goal: "NoteType型定義と設定マップの実装により、5種類のノートタイプを識別可能にする",
    status: "in_progress",
    subtasks: [
      {
        test: "NoteType型が5種類のユニオン型として定義されていることを型レベルで検証",
        implementation: "src/types/note-types.tsにNoteType型を定義（'fleeting' | 'literature' | 'permanent' | 'structure' | 'index'）",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "NoteTypeConfigインターフェースが必須フィールド（label, labelJa, description, icon, folder, template）を持つことを型レベルで検証",
        implementation: "NoteTypeConfigインターフェースを定義し、各フィールドの型を指定",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "NOTE_TYPE_CONFIGが5種類すべてのNoteTypeキーを持ち、各値がNoteTypeConfigインターフェースに準拠することを型レベルで検証",
        implementation: "NOTE_TYPE_CONFIG定数をRecord<NoteType, NoteTypeConfig>型で定義し、5種類の設定を実装",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "PROMOTION_PATHSがすべてのNoteTypeをキーとして持ち、昇格パス（fleeting→permanent, permanent→structure, structure→index, literature→空配列, index→空配列）が正しく定義されていることを型レベルで検証",
        implementation: "PROMOTION_PATHS定数をRecord<NoteType, NoteType[]>型で定義し、仕様通りの昇格パスを実装",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "NoteMetadataインターフェースが必須フィールド（type, created, tags）とオプショナルフィールドを持つことを型レベルで検証",
        implementation: "NoteMetadataインターフェースを定義し、仕様書4.1に従ったフィールドを実装",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "NoteStatus型が3種類のステータス（'draft' | 'reviewed' | 'mature'）を持つことを型レベルで検証",
        implementation: "NoteStatus型を定義",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "pnpm buildが成功し、型エラーがないことを確認",
        implementation: "src/types/index.tsでnote-types.tsから型をエクスポート",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
    ],
  },

  definition_of_done: {
    checks: [
      { name: "Build passes", run: "pnpm build" },
      { name: "Lint passes", run: "pnpm lint" },
      { name: "Format check passes", run: "pnpm format:check" },
    ],
  },

  completed: [],

  retrospectives: [],
};

// ============================================================
// Type Definitions (DO NOT MODIFY - request human review for schema changes)
// ============================================================

// PBI lifecycle: draft (idea) -> refining (gathering info) -> ready (can start) -> done
type PBIStatus = "draft" | "refining" | "ready" | "done";

// Sprint lifecycle
type SprintStatus =
  | "planning"
  | "in_progress"
  | "review"
  | "done"
  | "cancelled";

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
  role: (typeof userStoryRoles)[number];
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

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
