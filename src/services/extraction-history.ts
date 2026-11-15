import { MarkdownView, Notice } from "obsidian";
import type { App, Editor, TFile } from "obsidian";
import { t } from "../i18n";

interface Extraction {
	source: TFile;
	created: TFile;
	editor: Editor;
	before: string;
	after: string;
	content: string;
}

/** One session-local successful extraction. No persistent vault content. */
export class ExtractionHistory {
	private latest: Extraction | undefined;
	private busy = false;

	record(entry: Extraction): void {
		this.latest = entry;
	}

	async undo(app: App): Promise<void> {
		if (this.busy) return;
		const entry = this.latest;
		if (!entry) {
			new Notice(t("notices.noExtraction"));
			return;
		}
		this.busy = true;
		try {
			const unchanged = () => {
				let valid = entry.editor.getValue() === entry.after;
				let sourceOpen = false;
				app.workspace.iterateAllLeaves((leaf) => {
					if (leaf.view instanceof MarkdownView &&
						(leaf.view.file === entry.source || leaf.view.file === entry.created)) {
						if (leaf.view.file === entry.source && leaf.view.editor === entry.editor) sourceOpen = true;
						const expected = leaf.view.file === entry.source ? entry.after : entry.content;
						if (leaf.view.editor.getValue() !== expected) valid = false;
					}
				});
				return valid && sourceOpen &&
					app.vault.getAbstractFileByPath(entry.source.path) === entry.source &&
					app.vault.getAbstractFileByPath(entry.created.path) === entry.created;
			};
			if (!unchanged() ||
				await app.vault.read(entry.source) !== entry.after ||
				await app.vault.read(entry.created) !== entry.content || !unchanged()) {
				new Notice(t("notices.undoChanged"));
				return;
			}
			// Atomic source comparison protects against writes while reads were pending.
			await app.vault.process(entry.source, (current) => {
				if (current !== entry.after || !unchanged()) throw new Error("Source changed");
				return entry.before;
			});
			// Restore first: a trash failure must never lose the extracted text.
			entry.editor.setValue(entry.before);
			this.latest = undefined;
			if (await app.vault.read(entry.created) !== entry.content) {
				new Notice(t("notices.undoFailed"));
				return;
			}
			let createdUnchanged = app.vault.getAbstractFileByPath(entry.created.path) === entry.created;
			app.workspace.iterateAllLeaves((leaf) => {
				if (leaf.view instanceof MarkdownView && leaf.view.file === entry.created &&
					leaf.view.editor.getValue() !== entry.content) createdUnchanged = false;
			});
			if (!createdUnchanged) {
				new Notice(t("notices.undoFailed"));
				return;
			}
			await app.fileManager.trashFile(entry.created);
			new Notice(t("notices.undoDone"));
		} catch {
			new Notice(t("notices.undoFailed"));
		} finally {
			this.busy = false;
		}
	}
}
