import { Editor, MarkdownView, Notice, TFile } from "obsidian";
import type PageZettelPlugin from "../main";
import type { ExtractionTemplate } from "../types/settings";
import { t } from "../i18n";
import { TemplateSelectModal } from "../ui/modals/template-select-modal";
import { AliasInputModal } from "../ui/modals/alias-input-modal";

/**
 * Extract selection command - Opens TemplateSelectModal and creates note using NoteCreatorService
 */
export async function extractSelection(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
): Promise<void> {
	const selection = editor.getSelection();

	if (!selection || selection.trim() === "") {
		new Notice(t("notices.selectText"));
		return;
	}

	// Open TemplateSelectModal
	const templates = plugin.settings.templates;
	new TemplateSelectModal(
		plugin.app,
		templates,
		(template) => {
			void handleTemplateSelection(plugin, editor, view, template, selection);
		},
	).open();
}

/**
 * Extract selection with a specific template (for context menu shortcuts)
 */
export async function extractSelectionWithTemplate(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
	template: ExtractionTemplate,
): Promise<void> {
	const selection = editor.getSelection();

	if (!selection || selection.trim() === "") {
		new Notice(t("notices.selectText"));
		return;
	}

	await handleTemplateSelection(plugin, editor, view, template, selection);
}

/**
 * Handle template selection and create note
 */
async function handleTemplateSelection(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
	template: ExtractionTemplate,
	selection: string,
): Promise<void> {
	// If showAliasInput is true, show AliasInputModal
	if (template.showAliasInput) {
		new AliasInputModal(
			plugin.app,
			plugin,
			(result) => {
				void createNoteAndHandlePostActions(
					plugin,
					editor,
					view,
					template,
					selection,
					result.alias,
					result.removeIndent,
				);
			},
			true, // showRemoveIndent
		).open();
	} else {
		// Use default values
		const removeIndent = plugin.settings.behavior.defaultRemoveIndent;
		await createNoteAndHandlePostActions(
			plugin,
			editor,
			view,
			template,
			selection,
			"",
			removeIndent,
		);
	}
}

/**
 * Create note and handle post-extraction actions
 */
async function createNoteAndHandlePostActions(
	plugin: PageZettelPlugin,
	editor: Editor,
	view: MarkdownView,
	template: ExtractionTemplate,
	selection: string,
	alias: string,
	removeIndent: boolean,
): Promise<void> {
	// Remove common indent if requested
	let processedContent = selection;
	if (removeIndent) {
		processedContent = removeCommonIndent(selection);
	}

	// Get source file
	const sourceFile = view.file;

	// Create note using NoteCreatorService
	const createdFile = await plugin.noteCreatorService.createNote(
		template,
		processedContent,
		alias,
		sourceFile || undefined,
	);

	// Handle insertLinkAfterExtract
	if (plugin.settings.behavior.insertLinkAfterExtract) {
		const linkText = alias || createdFile.basename;
		const relativePath = getRelativePath(sourceFile, createdFile);
		const link = `[${linkText}](${relativePath})`;
		editor.replaceSelection(link);
	}

	// Handle openAfterExtract
	if (plugin.settings.behavior.openAfterExtract) {
		await plugin.app.workspace.getLeaf(false).openFile(createdFile);
	}
}

/**
 * Remove common indent from selection
 */
function removeCommonIndent(text: string): string {
	const lines = text.split("\n");
	if (lines.length === 0) return text;

	// Find minimum indent (excluding empty lines)
	let minIndent = Number.POSITIVE_INFINITY;
	for (const line of lines) {
		if (line.trim() === "") continue;
		const indent = line.match(/^\s*/)?.[0].length || 0;
		minIndent = Math.min(minIndent, indent);
	}

	if (minIndent === Number.POSITIVE_INFINITY || minIndent === 0) {
		return text;
	}

	// Remove common indent
	return lines.map((line) => line.slice(minIndent)).join("\n");
}

/**
 * Get relative path from source file to created file
 */
function getRelativePath(sourceFile: TFile | null, createdFile: TFile): string {
	if (!sourceFile) {
		return createdFile.path;
	}

	// For Obsidian, we can use the path directly as it handles relative paths
	// But we'll keep it simple and use the full path
	return createdFile.path;
}
