/**
 * 絵文字カテゴリの型定義
 */
export type EmojiCategory =
	| "thinking"
	| "knowledge"
	| "organization"
	| "status"
	| "nature"
	| "objects"
	| "symbols";

/**
 * 絵文字アイテムの型定義
 */
export interface EmojiItem {
	/** 絵文字文字列 */
	emoji: string;
	/** 英語表示名 */
	name: string;
	/** 検索用キーワード（日英両対応） */
	keywords: string[];
	/** カテゴリ分類 */
	category: EmojiCategory;
}

/**
 * 絵文字カタログ
 * Zettelkasten方式のノート管理に適した絵文字を厳選
 */
export const EMOJI_CATALOG: EmojiItem[] = [
	// Thinking - アイデア・ひらめき
	{
		emoji: "💭",
		name: "Thought bubble",
		keywords: ["thought", "thinking", "idea", "fleeting", "考え", "思考", "アイデア", "メモ"],
		category: "thinking",
	},
	{
		emoji: "💡",
		name: "Light bulb",
		keywords: ["idea", "insight", "inspiration", "bulb", "アイデア", "ひらめき", "発想"],
		category: "thinking",
	},
	{
		emoji: "🧠",
		name: "Brain",
		keywords: ["brain", "mind", "think", "intelligence", "脳", "思考", "知性"],
		category: "thinking",
	},
	{
		emoji: "⚡",
		name: "Lightning",
		keywords: ["flash", "quick", "instant", "lightning", "稲妻", "閃き", "瞬間"],
		category: "thinking",
	},
	{
		emoji: "✨",
		name: "Sparkles",
		keywords: ["sparkle", "magic", "new", "キラキラ", "新しい", "魔法"],
		category: "thinking",
	},
	{
		emoji: "🌟",
		name: "Glowing star",
		keywords: ["star", "important", "highlight", "スター", "重要", "ハイライト"],
		category: "thinking",
	},
	{
		emoji: "💫",
		name: "Dizzy",
		keywords: ["dizzy", "star", "amazing", "めまい", "驚き"],
		category: "thinking",
	},
	{
		emoji: "🔮",
		name: "Crystal ball",
		keywords: ["crystal", "predict", "future", "水晶", "予測", "未来"],
		category: "thinking",
	},

	// Knowledge - 学習・文献
	{
		emoji: "📚",
		name: "Books",
		keywords: ["books", "library", "literature", "study", "本", "図書", "文献", "勉強"],
		category: "knowledge",
	},
	{
		emoji: "📖",
		name: "Open book",
		keywords: ["book", "read", "reading", "open", "本", "読書", "開いた"],
		category: "knowledge",
	},
	{
		emoji: "📕",
		name: "Red book",
		keywords: ["book", "red", "closed", "本", "赤"],
		category: "knowledge",
	},
	{
		emoji: "📗",
		name: "Green book",
		keywords: ["book", "green", "本", "緑"],
		category: "knowledge",
	},
	{
		emoji: "📘",
		name: "Blue book",
		keywords: ["book", "blue", "本", "青"],
		category: "knowledge",
	},
	{
		emoji: "📙",
		name: "Orange book",
		keywords: ["book", "orange", "本", "オレンジ"],
		category: "knowledge",
	},
	{
		emoji: "📓",
		name: "Notebook",
		keywords: ["notebook", "note", "journal", "ノート", "日記"],
		category: "knowledge",
	},
	{
		emoji: "📝",
		name: "Memo",
		keywords: ["memo", "note", "write", "pencil", "メモ", "ノート", "書く"],
		category: "knowledge",
	},
	{
		emoji: "📄",
		name: "Document",
		keywords: ["document", "page", "paper", "ドキュメント", "文書", "ページ"],
		category: "knowledge",
	},
	{
		emoji: "🎓",
		name: "Graduation cap",
		keywords: ["graduation", "study", "education", "卒業", "学習", "教育"],
		category: "knowledge",
	},
	{
		emoji: "🔬",
		name: "Microscope",
		keywords: ["science", "research", "microscope", "科学", "研究", "顕微鏡"],
		category: "knowledge",
	},

	// Organization - 整理・管理
	{
		emoji: "💎",
		name: "Gem stone",
		keywords: ["gem", "diamond", "precious", "permanent", "宝石", "ダイヤ", "貴重", "永続"],
		category: "organization",
	},
	{
		emoji: "🏆",
		name: "Trophy",
		keywords: ["trophy", "achievement", "winner", "トロフィー", "成果", "達成"],
		category: "organization",
	},
	{
		emoji: "🔑",
		name: "Key",
		keywords: ["key", "important", "unlock", "鍵", "重要", "解除"],
		category: "organization",
	},
	{
		emoji: "📌",
		name: "Pushpin",
		keywords: ["pin", "important", "mark", "ピン", "重要", "マーク"],
		category: "organization",
	},
	{
		emoji: "🔖",
		name: "Bookmark",
		keywords: ["bookmark", "save", "mark", "ブックマーク", "保存", "しおり"],
		category: "organization",
	},
	{
		emoji: "🗂️",
		name: "Card index",
		keywords: ["folder", "organize", "index", "file", "フォルダ", "整理", "索引"],
		category: "organization",
	},
	{
		emoji: "📁",
		name: "Folder",
		keywords: ["folder", "directory", "organize", "フォルダ", "ディレクトリ"],
		category: "organization",
	},
	{
		emoji: "📂",
		name: "Open folder",
		keywords: ["folder", "open", "directory", "フォルダ", "開く"],
		category: "organization",
	},
	{
		emoji: "🏷️",
		name: "Label",
		keywords: ["label", "tag", "category", "ラベル", "タグ", "カテゴリ"],
		category: "organization",
	},
	{
		emoji: "🗃️",
		name: "Card file box",
		keywords: ["archive", "storage", "file", "アーカイブ", "保管", "ファイル"],
		category: "organization",
	},

	// Status - 状態・進捗
	{
		emoji: "✅",
		name: "Check mark",
		keywords: ["done", "complete", "check", "完了", "チェック", "済み"],
		category: "status",
	},
	{
		emoji: "⭐",
		name: "Star",
		keywords: ["star", "favorite", "important", "スター", "お気に入り", "重要"],
		category: "status",
	},
	{
		emoji: "🌱",
		name: "Seedling",
		keywords: ["seedling", "new", "grow", "start", "芽", "新しい", "成長", "開始"],
		category: "status",
	},
	{
		emoji: "🌿",
		name: "Herb",
		keywords: ["herb", "growing", "progress", "草", "成長中", "進行"],
		category: "status",
	},
	{
		emoji: "🌳",
		name: "Tree",
		keywords: ["tree", "mature", "complete", "木", "成熟", "完成"],
		category: "status",
	},
	{
		emoji: "🔥",
		name: "Fire",
		keywords: ["fire", "hot", "trending", "urgent", "炎", "熱い", "急ぎ"],
		category: "status",
	},
	{
		emoji: "❄️",
		name: "Snowflake",
		keywords: ["snow", "cold", "frozen", "pause", "雪", "冷たい", "停止"],
		category: "status",
	},
	{
		emoji: "🚧",
		name: "Construction",
		keywords: ["wip", "construction", "building", "工事中", "作成中"],
		category: "status",
	},
	{
		emoji: "⏳",
		name: "Hourglass",
		keywords: ["time", "waiting", "pending", "時間", "待機", "保留"],
		category: "status",
	},
	{
		emoji: "🎯",
		name: "Target",
		keywords: ["target", "goal", "focus", "ターゲット", "目標", "フォーカス"],
		category: "status",
	},

	// Nature - 自然・象徴
	{
		emoji: "🌸",
		name: "Cherry blossom",
		keywords: ["flower", "spring", "sakura", "花", "春", "桜"],
		category: "nature",
	},
	{
		emoji: "🌺",
		name: "Hibiscus",
		keywords: ["flower", "tropical", "花", "トロピカル"],
		category: "nature",
	},
	{
		emoji: "🌻",
		name: "Sunflower",
		keywords: ["flower", "sun", "summer", "ひまわり", "太陽", "夏"],
		category: "nature",
	},
	{
		emoji: "🍀",
		name: "Four leaf clover",
		keywords: ["clover", "luck", "fortune", "クローバー", "幸運"],
		category: "nature",
	},
	{
		emoji: "🌈",
		name: "Rainbow",
		keywords: ["rainbow", "colorful", "hope", "虹", "カラフル", "希望"],
		category: "nature",
	},
	{
		emoji: "☀️",
		name: "Sun",
		keywords: ["sun", "bright", "day", "太陽", "明るい", "日"],
		category: "nature",
	},
	{
		emoji: "🌙",
		name: "Moon",
		keywords: ["moon", "night", "sleep", "月", "夜", "睡眠"],
		category: "nature",
	},
	{
		emoji: "⭐",
		name: "Star",
		keywords: ["star", "night", "sky", "星", "夜空"],
		category: "nature",
	},

	// Objects - オブジェクト
	{
		emoji: "🎨",
		name: "Palette",
		keywords: ["art", "design", "creative", "palette", "アート", "デザイン", "創作"],
		category: "objects",
	},
	{
		emoji: "🎵",
		name: "Music note",
		keywords: ["music", "song", "audio", "音楽", "曲", "音声"],
		category: "objects",
	},
	{
		emoji: "🎬",
		name: "Clapper board",
		keywords: ["movie", "film", "video", "映画", "動画"],
		category: "objects",
	},
	{
		emoji: "📷",
		name: "Camera",
		keywords: ["camera", "photo", "picture", "カメラ", "写真"],
		category: "objects",
	},
	{
		emoji: "💻",
		name: "Laptop",
		keywords: ["computer", "laptop", "tech", "コンピュータ", "ノートPC", "技術"],
		category: "objects",
	},
	{
		emoji: "⌨️",
		name: "Keyboard",
		keywords: ["keyboard", "type", "coding", "キーボード", "入力", "コーディング"],
		category: "objects",
	},
	{
		emoji: "🔧",
		name: "Wrench",
		keywords: ["tool", "fix", "settings", "ツール", "修正", "設定"],
		category: "objects",
	},
	{
		emoji: "⚙️",
		name: "Gear",
		keywords: ["settings", "config", "system", "設定", "システム"],
		category: "objects",
	},
	{
		emoji: "🔗",
		name: "Link",
		keywords: ["link", "connect", "chain", "リンク", "接続", "連鎖"],
		category: "objects",
	},
	{
		emoji: "📎",
		name: "Paperclip",
		keywords: ["clip", "attach", "attachment", "クリップ", "添付"],
		category: "objects",
	},

	// Symbols - 記号
	{
		emoji: "❓",
		name: "Question mark",
		keywords: ["question", "ask", "help", "疑問", "質問", "ヘルプ"],
		category: "symbols",
	},
	{
		emoji: "❗",
		name: "Exclamation mark",
		keywords: ["important", "alert", "attention", "重要", "警告", "注意"],
		category: "symbols",
	},
	{
		emoji: "💬",
		name: "Speech bubble",
		keywords: ["chat", "comment", "discussion", "チャット", "コメント", "議論"],
		category: "symbols",
	},
	{
		emoji: "🔍",
		name: "Magnifying glass",
		keywords: ["search", "find", "look", "検索", "探す", "調べる"],
		category: "symbols",
	},
	{
		emoji: "➡️",
		name: "Right arrow",
		keywords: ["arrow", "next", "forward", "矢印", "次", "進む"],
		category: "symbols",
	},
	{
		emoji: "⬆️",
		name: "Up arrow",
		keywords: ["arrow", "up", "increase", "矢印", "上", "増加"],
		category: "symbols",
	},
	{
		emoji: "🔄",
		name: "Refresh",
		keywords: ["refresh", "reload", "sync", "更新", "リロード", "同期"],
		category: "symbols",
	},
	{
		emoji: "➕",
		name: "Plus",
		keywords: ["plus", "add", "new", "プラス", "追加", "新規"],
		category: "symbols",
	},
	{
		emoji: "➖",
		name: "Minus",
		keywords: ["minus", "remove", "subtract", "マイナス", "削除", "引く"],
		category: "symbols",
	},
	{
		emoji: "ℹ️",
		name: "Information",
		keywords: ["info", "information", "details", "情報", "詳細"],
		category: "symbols",
	},
];
