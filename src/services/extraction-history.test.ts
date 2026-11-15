import { describe, expect, it, vi } from "vitest";
vi.mock("obsidian", () => ({
	MarkdownView: class {},
	Notice: class {},
	moment: { locale: () => "en" },
}));
import { ExtractionHistory } from "./extraction-history";
import { MarkdownView } from "obsidian";
import type { App, Editor, TFile } from "obsidian";

function setup() {
	const source = { path: "source.md" } as TFile;
	const created = { path: "created.md" } as TFile;
	let text = "link";
	const editor = { getValue: () => text, setValue: (value: string) => { text = value; } } as Editor;
	const view = Object.assign(Object.create(MarkdownView.prototype), { file: source, editor });
	const trashFile = vi.fn(async () => {});
	const process = vi.fn(async (_file, update) => { expect(update("link")).toBe("original"); });
	const read = vi.fn(async (file: TFile): Promise<string> => file === source ? "link" : "extracted");
	const app = {
		workspace: { iterateAllLeaves: (visit: (leaf: unknown) => void) => visit({ view }) },
		vault: { read, process, getAbstractFileByPath: (path: string) => path === source.path ? source : created },
		fileManager: { trashFile },
	} as unknown as App;
	const history = new ExtractionHistory();
	history.record({ source, created, editor, before: "original", after: "link", content: "extracted" });
	return { history, app, editor, trashFile, process, read };
}
describe("extraction undo", () => {
	it("restores the source and trashes the created note only once", async () => {
		const s = setup();
		await s.history.undo(s.app);
		expect(s.editor.getValue()).toBe("original");
		expect(s.trashFile).toHaveBeenCalledTimes(1);
		await s.history.undo(s.app);
		expect(s.trashFile).toHaveBeenCalledTimes(1);
	});
	it("refuses unsaved source edits", async () => {
		const s = setup();
		s.editor.setValue("edited");
		await s.history.undo(s.app);
		expect(s.process).not.toHaveBeenCalled();
		expect(s.trashFile).not.toHaveBeenCalled();
	});
	it("refuses created note edits", async () => {
		const s = setup();
		s.read.mockResolvedValue("edited");
		await s.history.undo(s.app);
		expect(s.process).not.toHaveBeenCalled();
		expect(s.trashFile).not.toHaveBeenCalled();
	});
	it("keeps restored text when trash fails", async () => {
		const s = setup();
		s.trashFile.mockRejectedValue(new Error("trash failed"));
		await s.history.undo(s.app);
		expect(s.editor.getValue()).toBe("original");
	});
});
