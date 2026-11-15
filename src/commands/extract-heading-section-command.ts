import { Notice } from "obsidian";
import type { Editor, MarkdownView } from "obsidian";
import type PageZettelPlugin from "../main";
import { t } from "../i18n";
import { findHeadingSection } from "../utils/heading-section";
import { openExtractionFlow } from "./extract-selection-command";

export function extractHeadingSection(plugin: PageZettelPlugin, editor: Editor, view: MarkdownView): void {
	const lines = editor.getValue().split("\n");
	const section = findHeadingSection(lines, editor.getCursor().line);
	if (!section) {
		new Notice(t("notices.noHeadingSection"));
		return;
	}
	const from = { line: section.from, ch: 0 };
	const lastLine = lines.length - 1;
	// Leave the separator newline intact so a replacement link cannot consume the next heading.
	const endLine = section.to < lines.length ? section.to - 1 : lastLine;
	const to = { line: endLine, ch: lines[endLine]?.length ?? 0 };
	openExtractionFlow(plugin, editor, view, editor.getRange(from, to), from, to);
}
