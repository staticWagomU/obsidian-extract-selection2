/**
 * 抽出テンプレート
 */
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

/**
 * Extract Selection設定
 */
export interface ExtractSelectionSettings {
	/** 抽出テンプレート一覧 */
	templates: ExtractionTemplate[];
	/** 動作設定 */
	behavior: BehaviorSettings;
	/** UI設定 */
	ui: UISettings;
}

export interface BehaviorSettings {
	/** 切り出し後に元ノートにリンクを挿入 */
	insertLinkAfterExtract: boolean;
	/** 切り出し後に新規ノートを開く */
	openAfterExtract: boolean;
	/** 共通インデント削除のデフォルト値 */
	defaultRemoveIndent: boolean;
}

export interface UISettings {
	/** コマンドに絵文字を表示 */
	showEmojiInCommands: boolean;
	/** コンテキストメニューにノート操作を表示 */
	showContextMenuItems: boolean;
}
