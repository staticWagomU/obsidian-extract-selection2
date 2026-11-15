import { App, Editor, MarkdownView, Notice, SuggestModal, TFile } from "obsidian";
import type PageZettelPlugin from "../main";
import { t } from "../i18n";
import { appendAt, appendHeadings } from "../utils/append-content";

class Picker<T> extends SuggestModal<T> {
	constructor(app: App, private items: T[], private label: (item: T) => string, private choose: (item: T) => void, placeholder: string) {
		super(app);
		this.setPlaceholder(placeholder);
	}
	getSuggestions(query: string): T[] {
		return this.items.filter(item => this.label(item).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
	}
	renderSuggestion(item: T, el: HTMLElement): void { el.setText(this.label(item)); }
	onChooseSuggestion(item: T): void { this.choose(item); }
}

export function appendSelection(plugin: PageZettelPlugin, editor: Editor, view: MarkdownView): void {
	const source = view.file;
	const original = editor.getValue();
	const selection = editor.getSelection();
	const from = editor.getCursor("from");
	const to = editor.getCursor("to");
	if (!source || !selection.trim()) { new Notice(t("notices.selectText")); return; }
	const sourcePath = source.path;
	const valid = () => view.file === source && editor.getValue() === original && editor.getRange(from, to) === selection;
	new Picker(plugin.app, plugin.app.vault.getMarkdownFiles().filter(file => file !== source), file => file.path, file => {
		void selectHeading(file).catch(() => { new Notice(t("append.failed")); });
	}, t("append.note")).open();

	async function selectHeading(file: TFile): Promise<void> {
		const content = await plugin.app.vault.read(file);
		const headings = appendHeadings(content);
		const options = [{ label: t("append.end"), offset: content.length }, ...headings.map((heading, index) => {
			const next = headings.slice(index + 1).find(other => other.level <= heading.level);
			return { label: `${"#".repeat(heading.level)} ${heading.heading} (${heading.line + 1})`, offset: next?.offset ?? content.length };
		})];
		new Picker(plugin.app, options, option => option.label, option => {
			void commit(option.offset).catch(() => { new Notice(t("append.failed")); });
		}, t("append.heading")).open();
		async function commit(offset: number): Promise<void> {
			if (!valid() || file === source || plugin.app.workspace.getLeavesOfType("markdown").some(leaf => leaf.view instanceof MarkdownView && leaf.view.file === file && leaf.view.editor.getValue() !== content)) { new Notice(t("append.changed")); return; }
			const link = plugin.app.fileManager.generateMarkdownLink(file, sourcePath);
			await plugin.app.vault.process(file, current => {
				if (current !== content || !valid()) throw new Error("Content changed");
				return appendAt(current, selection, offset);
			});
			if (plugin.settings.behavior.insertLinkAfterExtract && valid()) editor.replaceRange(link, from, to);
			new Notice(t("append.done"));
		}
	}
}
