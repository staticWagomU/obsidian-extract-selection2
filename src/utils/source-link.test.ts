import { describe, expect, it } from "vitest";
import { sourceAnchor, sourceNoteLink } from "./source-link";

describe("source links", () => {
	it("distinguishes duplicate names and encodes Markdown delimiters", () => {
		expect(sourceNoteLink("folder A/note [x]#(1)%.md", "page-zettel-1")).toBe("[source](/folder%20A/note%20%5Bx%5D%23%281%29%25.md#^page-zettel-1)");
		expect(sourceNoteLink("a/note.md")).not.toBe(sourceNoteLink("b/note.md"));
	});
	it("avoids existing anchors on repeated extraction", () => {
		expect(sourceAnchor("text ^page-zettel-1\n\n^page-zettel-2")).toBe("page-zettel-3");
	});
});
