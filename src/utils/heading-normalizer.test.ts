import { describe, it, expect } from "vitest";
import { normalizeHeadingLevels } from "./heading-normalizer";

describe("normalizeHeadingLevels", () => {
	// --- 正常系 ---

	it("H3/H4 を H1/H2 に正規化する", () => {
		const input = "### セクションA\n本文テキスト\n#### サブセクション\n詳細テキスト";
		const expected = "# セクションA\n本文テキスト\n## サブセクション\n詳細テキスト";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	it("H2/H3/H4 の3階層を H1/H2/H3 に正規化する", () => {
		const input = "## 大見出し\n### 中見出し\n#### 小見出し";
		const expected = "# 大見出し\n## 中見出し\n### 小見出し";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	it("単一の H5 見出しを H1 に正規化する", () => {
		const input = "##### 深い見出し\n本文";
		const expected = "# 深い見出し\n本文";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	it("見出しの後のスペースとコンテンツを維持する", () => {
		const input = "### 見出し with spaces\n本文";
		const expected = "# 見出し with spaces\n本文";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	// --- 無変換系（そのまま返すべきケース） ---

	it("見出しがない場合はそのまま返す", () => {
		const input = "本文テキスト\n段落";
		expect(normalizeHeadingLevels(input)).toBe(input);
	});

	it("H1 が含まれる場合はそのまま返す（既に正規化済み）", () => {
		const input = "# 見出し\n## 小見出し";
		expect(normalizeHeadingLevels(input)).toBe(input);
	});

	it("空文字列はそのまま返す", () => {
		expect(normalizeHeadingLevels("")).toBe("");
	});

	// --- 境界値 ---

	it("7個以上の # は見出しとして扱わない", () => {
		const input = "####### 無効な見出し\n### 有効な見出し";
		const expected = "####### 無効な見出し\n# 有効な見出し";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	it("# の後にスペースがない行は見出しとして扱わない", () => {
		const input = "###NoSpace\n## 有効な見出し";
		const expected = "###NoSpace\n# 有効な見出し";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	it("空見出し（# + スペースのみ）も正規化する", () => {
		const input = "### \nテキスト";
		const expected = "# \nテキスト";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	it("タブ区切りの見出しも検出する", () => {
		const input = "###\tタブ見出し\n本文";
		const expected = "#\tタブ見出し\n本文";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});

	// --- 対象外の明示（変換しないことを保証） ---

	it("blockquote 内の見出しは変換しない", () => {
		const input = "> ### 引用内見出し\n### 通常見出し";
		// > ### は行頭が > なので見出しとして検出されない
		// ### 通常見出し のみが検出され minLevel=3 → H1 へ
		const expected = "> ### 引用内見出し\n# 通常見出し";
		expect(normalizeHeadingLevels(input)).toBe(expected);
	});
});
