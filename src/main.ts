import { Editor, MarkdownView, Plugin, Menu } from "obsidian";
import { DEFAULT_SETTINGS, PageZettelSettingTab } from "./settings";
import type { ExtractSelectionSettings } from "./types/settings";
import { FolderService } from "./services/folder-service";
import { TemplateService } from "./services/template-service";
import { FrontmatterService } from "./services/frontmatter-service";
import { NoteCreatorService } from "./services/note-creator-service";
import { extractSelection, extractSelectionWithTemplate } from "./commands/extract-selection-command";
import { t } from "./i18n";

export default class PageZettelPlugin extends Plugin {
	settings: ExtractSelectionSettings;
	noteCreatorService: NoteCreatorService;

	async onload() {
		await this.loadSettings();

		// Initialize folder structure on first load
		const folderService = new FolderService(this.app, this.settings);
		await folderService.initializeAllFolders();

		// Initialize NoteCreatorService
		const templateService = new TemplateService(this.app, this.settings);
		const frontmatterService = new FrontmatterService(this.app);
		this.noteCreatorService = new NoteCreatorService(
			this.app,
			this.settings,
			folderService,
			templateService,
			frontmatterService,
		);

		// Register commands
		this.addCommand({
			// eslint-disable-next-line obsidianmd/commands/no-plugin-id-in-command-id
			id: "extract-selection",
			name: this.settings.ui.showEmojiInCommands
				? `📝 ${t("commands.extractToNote")}`
				: t("commands.extractToNote"),
			icon: "file-plus",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				void extractSelection(this, editor, view);
			},
		});

		// Register context menu items for favorite templates
		if (this.settings.ui.showContextMenuItems) {
			this.registerEvent(
				this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor, view: MarkdownView) => {
					const selection = editor.getSelection();
					if (!selection || selection.trim() === "") {
						return;
					}

					// Add separator before our items
					menu.addSeparator();

					// Add main "Extract to Note" command
					const mainCommandName = this.settings.ui.showEmojiInCommands
						? `📝 ${t("commands.extractToNote")}`
						: t("commands.extractToNote");
					menu.addItem((item) => {
						item
							.setTitle(mainCommandName)
							.setIcon("document")
							.onClick(() => {
								void extractSelection(this, editor, view);
							});
					});

					// Add favorite template shortcuts
					const favoriteTemplates = this.settings.templates
						.filter((template) => template.isFavorite)
						.sort((a, b) => a.order - b.order);

					for (const template of favoriteTemplates) {
						const commandName = this.settings.ui.showEmojiInCommands && template.icon
							? `${template.icon} ${t("contextMenu.extractTo", { name: template.name })}`
							: t("contextMenu.extractTo", { name: template.name });

						menu.addItem((item) => {
							item
								.setTitle(commandName)
								.setIcon("document")
								.onClick(() => {
									void extractSelectionWithTemplate(this, editor, view, template);
								});
						});
					}

					menu.addSeparator();
				}),
			);
		}

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PageZettelSettingTab(this.app, this));
	}

	onunload() {
		// Clean up if needed
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<ExtractSelectionSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
