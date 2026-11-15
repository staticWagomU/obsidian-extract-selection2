import { expect, it } from "vitest";
import { appendAt } from "./append-content";
it("preserves following section and separates blocks", () => {
 expect(appendAt("# A\nold\n# B\nrest", "new", 8)).toBe("# A\nold\n\nnew\n\n# B\nrest");
});
it("appends to an empty note", () => { expect(appendAt("", "new", 0)).toBe("new\n"); });
it("preserves CRLF", () => { expect(appendAt("old\r\n", "new", 5)).toBe("old\r\n\r\nnew\r\n"); });
import { appendHeadings } from "./append-content";
it("ignores YAML and fenced headings and recognizes setext", () => {
 expect(appendHeadings("---\ntitle: x\n---\n```\n# code\n```\nTitle\n=====\n## Child\n").map(h => [h.heading, h.level])).toEqual([["Title", 1], ["Child", 2]]);
});
