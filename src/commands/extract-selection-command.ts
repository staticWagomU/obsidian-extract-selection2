import { Editor, MarkdownView, Notice } from "obsidian";
import type PageZettelPlugin from "../main";
import { t } from "../i18n";

/**
 * Extract selection command - placeholder until PBI-003/PBI-005 implement new template-based flow
 * TODO: Implement with ExtractionTemplate-based modal (PBI-003) and new command flow (PBI-005)
 */
export async function extractSelection(
	plugin: PageZettelPlugin,
	editor: Editor,
	_view: MarkdownView,
): Promise<void> {
	const selection = editor.getSelection();

	if (!selection || selection.trim() === "") {
		new Notice(t("notices.selectText"));
		return;
	}

	// Placeholder: Show notice that feature is being reimplemented
	new Notice("This feature is being reimplemented");
}
