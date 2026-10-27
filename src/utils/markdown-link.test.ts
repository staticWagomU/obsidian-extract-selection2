import { describe, it, expect } from "vitest";
import { buildMarkdownLink } from "./markdown-link";

describe("buildMarkdownLink", () => {
	it("空白を含まないパスはそのままリンクにする", () => {
		expect(buildMarkdownLink("メモ", "notes/メモ.md")).toBe("[メモ](notes/メモ.md)");
	});

	it("パス中の空白を %20 にエンコードする", () => {
		expect(buildMarkdownLink("My Note", "my folder/My Note.md")).toBe(
			"[My Note](my%20folder/My%20Note.md)",
		);
	});
});
