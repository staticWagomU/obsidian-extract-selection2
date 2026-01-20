import { App, PluginSettingTab, Setting, ButtonComponent } from "obsidian";
import PageZettelPlugin from "./main";
import type { ExtractSelectionSettings, ExtractionTemplate } from "./types/settings";
import { t } from "./i18n";
import { TemplateEditModal } from "./ui/modals/template-edit-modal";

export const DEFAULT_SETTINGS: ExtractSelectionSettings = {
	templates: [
		{
			id: "default-note",
			name: "Note",
			description: "Basic note extraction",
			icon: "📝",
			folder: "",
			fileNameFormat: "{{zettel-id}}",
			fileExtension: ".md",
			templatePath: "",
			showAliasInput: true,
			isFavorite: false,
			order: 0,
		},
	],
	behavior: {
		insertLinkAfterExtract: true,
		openAfterExtract: false,
		defaultRemoveIndent: false,
	},
	ui: {
		showEmojiInCommands: true,
		showContextMenuItems: true,
	},
};

export class PageZettelSettingTab extends PluginSettingTab {
	plugin: PageZettelPlugin;

	constructor(app: App, plugin: PageZettelPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// テンプレート設定セクション
		this.renderTemplateSection(containerEl);

		// 動作設定セクション
		new Setting(containerEl).setName(t("settings.behavior.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.behavior.insertLinkAfterExtract.name"))
			.setDesc(t("settings.behavior.insertLinkAfterExtract.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.insertLinkAfterExtract)
					.onChange(async (value) => {
						this.plugin.settings.behavior.insertLinkAfterExtract = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.behavior.openAfterExtract.name"))
			.setDesc(t("settings.behavior.openAfterExtract.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.openAfterExtract)
					.onChange(async (value) => {
						this.plugin.settings.behavior.openAfterExtract = value;
						await this.plugin.saveSettings();
					}),
			);

		// UI設定セクション
		new Setting(containerEl).setName(t("settings.ui.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.ui.showEmojiInCommands.name"))
			.setDesc(t("settings.ui.showEmojiInCommands.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showEmojiInCommands)
					.onChange(async (value) => {
						this.plugin.settings.ui.showEmojiInCommands = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.ui.showContextMenuItems.name"))
			.setDesc(t("settings.ui.showContextMenuItems.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showContextMenuItems)
					.onChange(async (value) => {
						this.plugin.settings.ui.showContextMenuItems = value;
						await this.plugin.saveSettings();
					}),
			);
	}

	private renderTemplateSection(containerEl: HTMLElement): void {
		// セクションヘッダー
		new Setting(containerEl)
			.setName(t("settings.templates.heading"))
			.setDesc(t("settings.templates.desc"))
			.setHeading();

		// テンプレート追加ボタン
		new Setting(containerEl).addButton((btn) =>
			btn
				.setButtonText(t("settings.templates.addButton"))
				.setCta()
				.onClick(() => {
					this.openTemplateEditModal();
				}),
		);

		// テンプレート一覧コンテナ
		const templatesContainer = containerEl.createDiv({
			cls: "extract-selection-templates-container",
		});

		this.renderTemplateList(templatesContainer);
	}

	private renderTemplateList(container: HTMLElement): void {
		container.empty();

		const templates = this.plugin.settings.templates;

		if (templates.length === 0) {
			container.createDiv({
				cls: "extract-selection-empty-message",
				text: t("settings.templates.emptyMessage"),
			});
			return;
		}

		// テンプレートを順序でソート
		const sortedTemplates = [...templates].sort((a, b) => a.order - b.order);

		sortedTemplates.forEach((template, index) => {
			this.renderTemplateItem(container, template, index, sortedTemplates.length);
		});
	}

	private renderTemplateItem(
		container: HTMLElement,
		template: ExtractionTemplate,
		index: number,
		totalCount: number,
	): void {
		const itemEl = container.createDiv({
			cls: "extract-selection-template-item",
		});

		// テンプレート情報表示
		const infoEl = itemEl.createDiv({
			cls: "extract-selection-template-info",
		});

		// アイコンと名前
		const nameEl = infoEl.createDiv({
			cls: "extract-selection-template-name",
		});
		if (template.icon) {
			nameEl.createSpan({ text: template.icon + " " });
		}
		nameEl.createSpan({ text: template.name });

		// お気に入りバッジ
		if (template.isFavorite) {
			nameEl.createSpan({
				cls: "extract-selection-favorite-badge",
				text: " ⭐",
			});
		}

		// 説明
		if (template.description) {
			infoEl.createDiv({
				cls: "extract-selection-template-desc",
				text: template.description,
			});
		}

		// フォルダパス
		infoEl.createDiv({
			cls: "extract-selection-template-folder",
			text: `📁 ${template.folder || "/"}`,
		});

		// アクションボタン
		const actionsEl = itemEl.createDiv({
			cls: "extract-selection-template-actions",
		});

		// 上に移動ボタン
		if (index > 0) {
			new ButtonComponent(actionsEl)
				.setIcon("chevron-up")
				.setTooltip(t("settings.templates.moveUpButton"))
				.onClick(() => this.moveTemplate(template.id, -1));
		}

		// 下に移動ボタン
		if (index < totalCount - 1) {
			new ButtonComponent(actionsEl)
				.setIcon("chevron-down")
				.setTooltip(t("settings.templates.moveDownButton"))
				.onClick(() => this.moveTemplate(template.id, 1));
		}

		// 編集ボタン
		new ButtonComponent(actionsEl)
			.setIcon("pencil")
			.setTooltip(t("settings.templates.editButton"))
			.onClick(() => this.openTemplateEditModal(template));

		// 削除ボタン
		new ButtonComponent(actionsEl)
			.setIcon("trash")
			.setTooltip(t("settings.templates.deleteButton"))
			.onClick(() => this.deleteTemplate(template));
	}

	private openTemplateEditModal(existingTemplate?: ExtractionTemplate): void {
		const isNew = !existingTemplate;
		const template: Partial<ExtractionTemplate> = existingTemplate
			? { ...existingTemplate }
			: {
					name: "",
					description: "",
					icon: "",
					folder: "",
					fileNameFormat: "{{zettel-id}}",
					fileExtension: ".md",
					templatePath: "",
					showAliasInput: true,
					isFavorite: false,
				};

		new TemplateEditModal(this.app, template, (savedTemplate) => {
			void this.handleTemplateSave(savedTemplate, isNew, existingTemplate);
		}).open();
	}

	private async handleTemplateSave(
		savedTemplate: Partial<ExtractionTemplate>,
		isNew: boolean,
		existingTemplate?: ExtractionTemplate,
	): Promise<void> {
		if (isNew) {
			// 新規テンプレートを追加
			const newTemplate: ExtractionTemplate = {
				id: crypto.randomUUID(),
				name: savedTemplate.name || "",
				description: savedTemplate.description || "",
				icon: savedTemplate.icon || "",
				folder: savedTemplate.folder || "",
				fileNameFormat: savedTemplate.fileNameFormat || "{{zettel-id}}",
				fileExtension: savedTemplate.fileExtension || ".md",
				templatePath: savedTemplate.templatePath || "",
				showAliasInput: savedTemplate.showAliasInput ?? true,
				isFavorite: savedTemplate.isFavorite ?? false,
				order: this.plugin.settings.templates.length,
			};
			this.plugin.settings.templates.push(newTemplate);
		} else if (existingTemplate) {
			// 既存テンプレートを更新
			const index = this.plugin.settings.templates.findIndex(
				(t) => t.id === existingTemplate.id,
			);
			if (index !== -1) {
				this.plugin.settings.templates[index] = {
					...this.plugin.settings.templates[index],
					...savedTemplate,
				} as ExtractionTemplate;
			}
		}

		await this.plugin.saveSettings();
		this.display(); // 設定画面を再描画
	}

	private async moveTemplate(templateId: string, direction: number): Promise<void> {
		const templates = this.plugin.settings.templates;
		const sortedTemplates = [...templates].sort((a, b) => a.order - b.order);
		const currentIndex = sortedTemplates.findIndex((t) => t.id === templateId);

		if (currentIndex === -1) return;

		const newIndex = currentIndex + direction;
		if (newIndex < 0 || newIndex >= sortedTemplates.length) return;

		// 順序を入れ替え
		const currentTemplate = sortedTemplates[currentIndex];
		const swapTemplate = sortedTemplates[newIndex];

		if (!currentTemplate || !swapTemplate) return;

		const tempOrder = currentTemplate.order;
		currentTemplate.order = swapTemplate.order;
		swapTemplate.order = tempOrder;

		await this.plugin.saveSettings();
		this.display();
	}

	private async deleteTemplate(template: ExtractionTemplate): Promise<void> {
		// eslint-disable-next-line no-alert
		const confirmed = confirm(t("settings.templates.confirmDelete", { name: template.name }));
		if (!confirmed) return;

		this.plugin.settings.templates = this.plugin.settings.templates.filter(
			(t) => t.id !== template.id,
		);

		// 順序を再計算
		const sortedTemplates = [...this.plugin.settings.templates].sort((a, b) => a.order - b.order);
		sortedTemplates.forEach((t, index) => {
			t.order = index;
		});

		await this.plugin.saveSettings();
		this.display();
	}

	/*
	// 以下の旧設定UIはPBI-002で削除予定
	private oldDisplay(): void {
		const { containerEl } = this;
		// Fleeting設定セクション
		new Setting(containerEl).setName(t("settings.noteTypes.fleeting.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.folder.name"))
			.setDesc(t("settings.noteTypes.fleeting.folder.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.fleeting.folder.placeholder"))
					.setValue(this.plugin.settings.fleeting.folder)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.folder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.fileNameFormat.name"))
			.setDesc(t("settings.noteTypes.fleeting.fileNameFormat.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.noteTypes.fleeting.fileNameFormat.placeholder"))
					.setValue(this.plugin.settings.fleeting.fileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.fileNameFormat = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.showAliasInput.name"))
			.setDesc(t("settings.noteTypes.fleeting.showAliasInput.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.fleeting.showAliasInput)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.showAliasInput = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.fleeting.templatePath.name"))
			.setDesc(t("settings.noteTypes.fleeting.templatePath.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.fleeting.templatePath.placeholder"))
					.setValue(this.plugin.settings.fleeting.templatePath)
					.onChange(async (value) => {
						this.plugin.settings.fleeting.templatePath = value;
						await this.plugin.saveSettings();
					});
				new FileSuggest(this.app, text.inputEl);
			});

		this.addFrontmatterPreview(containerEl, "fleeting");

		// Literature設定セクション
		new Setting(containerEl).setName(t("settings.noteTypes.literature.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.folder.name"))
			.setDesc(t("settings.noteTypes.literature.folder.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.literature.folder.placeholder"))
					.setValue(this.plugin.settings.literature.folder)
					.onChange(async (value) => {
						this.plugin.settings.literature.folder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.fileNameFormat.name"))
			.setDesc(t("settings.noteTypes.literature.fileNameFormat.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.noteTypes.literature.fileNameFormat.placeholder"))
					.setValue(this.plugin.settings.literature.fileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.literature.fileNameFormat = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.showAliasInput.name"))
			.setDesc(t("settings.noteTypes.literature.showAliasInput.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.literature.showAliasInput)
					.onChange(async (value) => {
						this.plugin.settings.literature.showAliasInput = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.literature.templatePath.name"))
			.setDesc(t("settings.noteTypes.literature.templatePath.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.literature.templatePath.placeholder"))
					.setValue(this.plugin.settings.literature.templatePath)
					.onChange(async (value) => {
						this.plugin.settings.literature.templatePath = value;
						await this.plugin.saveSettings();
					});
				new FileSuggest(this.app, text.inputEl);
			});

		this.addFrontmatterPreview(containerEl, "literature");

		// Permanent設定セクション
		new Setting(containerEl).setName(t("settings.noteTypes.permanent.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.folder.name"))
			.setDesc(t("settings.noteTypes.permanent.folder.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.permanent.folder.placeholder"))
					.setValue(this.plugin.settings.permanent.folder)
					.onChange(async (value) => {
						this.plugin.settings.permanent.folder = value;
						await this.plugin.saveSettings();
					});
				new FolderSuggest(this.app, text.inputEl);
			});

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.fileNameFormat.name"))
			.setDesc(t("settings.noteTypes.permanent.fileNameFormat.desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("settings.noteTypes.permanent.fileNameFormat.placeholder"))
					.setValue(this.plugin.settings.permanent.fileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.permanent.fileNameFormat = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.showAliasInput.name"))
			.setDesc(t("settings.noteTypes.permanent.showAliasInput.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.permanent.showAliasInput)
					.onChange(async (value) => {
						this.plugin.settings.permanent.showAliasInput = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.noteTypes.permanent.templatePath.name"))
			.setDesc(t("settings.noteTypes.permanent.templatePath.desc"))
			.addText((text) => {
				text.setPlaceholder(t("settings.noteTypes.permanent.templatePath.placeholder"))
					.setValue(this.plugin.settings.permanent.templatePath)
					.onChange(async (value) => {
						this.plugin.settings.permanent.templatePath = value;
						await this.plugin.saveSettings();
					});
				new FileSuggest(this.app, text.inputEl);
			});

		this.addFrontmatterPreview(containerEl, "permanent");

		// 動作設定セクション
		new Setting(containerEl).setName(t("settings.behavior.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.behavior.insertLinkAfterExtract.name"))
			.setDesc(t("settings.behavior.insertLinkAfterExtract.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.insertLinkAfterExtract)
					.onChange(async (value) => {
						this.plugin.settings.behavior.insertLinkAfterExtract = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.behavior.openAfterExtract.name"))
			.setDesc(t("settings.behavior.openAfterExtract.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.openAfterExtract)
					.onChange(async (value) => {
						this.plugin.settings.behavior.openAfterExtract = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.behavior.moveOnPromotion.name"))
			.setDesc(t("settings.behavior.moveOnPromotion.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.behavior.moveOnPromotion)
					.onChange(async (value) => {
						this.plugin.settings.behavior.moveOnPromotion = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.behavior.fileNamePrefix.name"))
			.setDesc(t("settings.behavior.fileNamePrefix.desc"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption("date", t("settings.behavior.fileNamePrefix.options.date"))
					.addOption("zettel-id", t("settings.behavior.fileNamePrefix.options.zettelId"))
					.addOption("none", t("settings.behavior.fileNamePrefix.options.none"))
					.setValue(this.plugin.settings.behavior.fileNamePrefix)
					.onChange(async (value: "date" | "zettel-id" | "none") => {
						this.plugin.settings.behavior.fileNamePrefix = value;
						await this.plugin.saveSettings();
					}),
			);

		// UI設定セクション
		new Setting(containerEl).setName(t("settings.ui.heading")).setHeading();

		new Setting(containerEl)
			.setName(t("settings.ui.showEmojiInCommands.name"))
			.setDesc(t("settings.ui.showEmojiInCommands.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showEmojiInCommands)
					.onChange(async (value) => {
						this.plugin.settings.ui.showEmojiInCommands = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("settings.ui.showContextMenuItems.name"))
			.setDesc(t("settings.ui.showContextMenuItems.desc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.ui.showContextMenuItems)
					.onChange(async (value) => {
						this.plugin.settings.ui.showContextMenuItems = value;
						await this.plugin.saveSettings();
					}),
			);
	}

		const previewEl = setting.settingEl.createDiv({
			cls: "page-zettel-frontmatter-preview",
		});
		previewEl.createEl("pre").createEl("code", {
			text: getDefaultFrontmatterPreview(type),
		});
	}
	*/
}
