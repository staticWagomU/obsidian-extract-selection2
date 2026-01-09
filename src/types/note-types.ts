/**
 * Zettelkasten ノートタイプ
 */
export type NoteType = "fleeting" | "literature" | "permanent" | "structure" | "index";

/**
 * ノートタイプごとの設定
 */
export interface NoteTypeConfig {
	/** 表示ラベル */
	label: string;
	/** 日本語ラベル */
	labelJa: string;
	/** 説明文 */
	description: string;
	/** アイコン（絵文字） */
	icon: string;
	/** 保存先フォルダ */
	folder: string;
	/** テンプレートファイル名 */
	template: string;
}

/**
 * 全ノートタイプの設定マップ
 */
export const NOTE_TYPE_CONFIG: Record<NoteType, NoteTypeConfig> = {
	fleeting: {
		label: "Fleeting Note",
		labelJa: "一時メモ",
		description: "Quick thought or idea to process later",
		icon: "💭",
		folder: "10-Fleeting",
		template: "fleeting-template.md",
	},
	literature: {
		label: "Literature Note",
		labelJa: "文献ノート",
		description: "Notes from external sources (books, articles)",
		icon: "📚",
		folder: "20-Literature",
		template: "literature-template.md",
	},
	permanent: {
		label: "Permanent Note",
		labelJa: "永続ノート",
		description: "Atomic, interconnected knowledge unit",
		icon: "💎",
		folder: "30-Permanent",
		template: "permanent-template.md",
	},
	structure: {
		label: "Structure Note",
		labelJa: "構造ノート",
		description: "Map of Content (MOC) organizing notes",
		icon: "🗂️",
		folder: "40-Structure",
		template: "structure-template.md",
	},
	index: {
		label: "Index Note",
		labelJa: "インデックス",
		description: "Top-level entry point",
		icon: "📋",
		folder: "50-Index",
		template: "index-template.md",
	},
};

/**
 * 昇格パス定義
 * キー: 元のタイプ, 値: 昇格可能なタイプの配列
 */
export const PROMOTION_PATHS: Record<NoteType, NoteType[]> = {
	fleeting: ["permanent"],
	literature: [], // Literature は独立（昇格なし）
	permanent: ["structure"],
	structure: ["index"],
	index: [],
};

/**
 * ノートの成熟度ステータス
 */
export type NoteStatus = "draft" | "reviewed" | "mature";

/**
 * ノートのメタデータ（フロントマター）
 */
export interface NoteMetadata {
	type: NoteType;
	created: string; // ISO 8601
	tags: string[];

	// オプショナル
	source_notes?: string[]; // 元ノートへのリンク
	structure_notes?: string[]; // 所属 Structure Note
	status?: NoteStatus;
	promoted_from?: NoteType;
	promoted_at?: string;

	// Literature 固有
	source_type?: "book" | "article" | "video" | "podcast" | "other";
	source_title?: string;
	source_author?: string;
	source_url?: string;
}
