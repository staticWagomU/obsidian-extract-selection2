import { describe, expect, it } from "vitest";
import { canPlaceSourceAnchor, sourceAnchor, sourceNoteLink } from "./source-link";

describe("source links", () => {
	it("distinguishes duplicate names and encodes Markdown delimiters", () => {
		expect(sourceNoteLink("folder A/note [x]#(1)%.md", "page-zettel-1")).toBe("[source](/folder%20A/note%20%5Bx%5D%23%281%29%25.md#^page-zettel-1)");
		expect(sourceNoteLink("a/note.md")).not.toBe(sourceNoteLink("b/note.md"));
	});
	it("avoids existing anchors on repeated extraction", () => {
		expect(sourceAnchor("text ^page-zettel-1\n\n^page-zettel-2")).toBe("page-zettel-3");
	});
});

describe("safe anchor admission", () => {
	it.each(["---\ntitle: x\n---\n\ntext", "```js\ntext\n```", "~~~\ntext\n~~~", "- parent\n  - child", "    code", "> quote"])("rejects structured notes before mutation: %s", content => {
		expect(canPlaceSourceAnchor(content, 0, content.length)).toBe(false);
	});
	it("rejects partial paragraphs", () => {
		expect(canPlaceSourceAnchor("hello world", 0, 5)).toBe(false);
	});
	it.each([true, false])("retains a target after extraction, replace=%s", replace => {
		const content = "before\n\nselected\n\nafter";
		const from = content.indexOf("selected");
		const to = from + "selected".length;
		expect(canPlaceSourceAnchor(content, from, to)).toBe(true);
		const id = sourceAnchor(content);
		const result = replace ? content.slice(0, from) + `\n\n[new](/new.md)\n\n^${id}\n\n` + content.slice(to) : content.slice(0, to) + `\n\n^${id}\n\n` + content.slice(to);
		expect(result).toContain(`\n\n^${id}\n\n`);
		expect(sourceNoteLink("source.md", id)).toContain(`#^${id}`);
		expect(result.startsWith("before\n\n")).toBe(true);
		expect(result.endsWith("\n\nafter")).toBe(true);
	});
});
