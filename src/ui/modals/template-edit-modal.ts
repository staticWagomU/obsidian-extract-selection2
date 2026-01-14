import { App, Modal, Setting, moment } from "obsidian";
import type { ExtractionTemplate } from "../../types/settings";
import { FolderSuggest } from "../suggesters/folder-suggest";
import { t } from "../../i18n";

export class TemplateEditModal extends Modal {
	private template: Partial<ExtractionTemplate>;
	private onSave: (template: Partial<ExtractionTemplate>) => void;
	private nameInput: HTMLInputElement | null = null;
	private previewEl: HTMLElement | null = null;

	constructor(
		app: App,
		template: Partial<ExtractionTemplate>,
		onSave: (template: Partial<ExtractionTemplate>) => void,
	) {
		super(app);
		this.template = { ...template };
		this.onSave = onSave;
	}

	onOpen(): void {
		const { contentEl } = this;

		contentEl.empty();
		contentEl.addClass("extract-selection-modal");

		// Modal title
		contentEl.createEl("h2", { text: t("modals.templateEdit.title") });

		// Name field (required)
		new Setting(contentEl)
			.setName(t("modals.templateEdit.name.label"))
			.setDesc(t("modals.templateEdit.name.desc"))
			.addText((text) => {
				this.nameInput = text.inputEl;
				text.setValue(this.template.name || "")
					.setPlaceholder(t("modals.templateEdit.name.placeholder"))
					.onChange((value) => {
						this.template.name = value;
					});

				// Auto-focus on name field
				setTimeout(() => {
					this.nameInput?.focus();
				}, 10);
			});

		// Description field (optional)
		new Setting(contentEl)
			.setName(t("modals.templateEdit.description.label"))
			.setDesc(t("modals.templateEdit.description.desc"))
			.addText((text) => {
				text.setValue(this.template.description || "")
					.setPlaceholder(t("modals.templateEdit.description.placeholder"))
					.onChange((value) => {
						this.template.description = value;
					});
			});

		// Icon field (optional)
		new Setting(contentEl)
			.setName(t("modals.templateEdit.icon.label"))
			.setDesc(t("modals.templateEdit.icon.desc"))
			.addText((text) => {
				text.setValue(this.template.icon || "")
					.setPlaceholder(t("modals.templateEdit.icon.placeholder"))
					.onChange((value) => {
						this.template.icon = value;
					});
			});

		// Folder field (required)
		new Setting(contentEl)
			.setName(t("modals.templateEdit.folder.label"))
			.setDesc(t("modals.templateEdit.folder.desc"))
			.addText((text) => {
				text.setValue(this.template.folder || "")
					.setPlaceholder(t("modals.templateEdit.folder.placeholder"))
					.onChange((value) => {
						this.template.folder = value;
					});

				// Add folder suggester
				new FolderSuggest(this.app, text.inputEl);
			});

		// File name format field (required)
		const fileNameSetting = new Setting(contentEl)
			.setName(t("modals.templateEdit.fileNameFormat.label"))
			.setDesc(t("modals.templateEdit.fileNameFormat.desc"))
			.addText((text) => {
				text.setValue(this.template.fileNameFormat || "")
					.setPlaceholder(t("modals.templateEdit.fileNameFormat.placeholder"))
					.onChange((value) => {
						this.template.fileNameFormat = value;
						this.updatePreview();
					});
			});

		// Add preview element
		this.previewEl = fileNameSetting.descEl.createDiv({
			cls: "setting-item-description",
		});
		this.updatePreview();

		// Template file field (optional)
		new Setting(contentEl)
			.setName(t("modals.templateEdit.templatePath.label"))
			.setDesc(t("modals.templateEdit.templatePath.desc"))
			.addText((text) => {
				text.setValue(this.template.templatePath || "")
					.setPlaceholder(t("modals.templateEdit.templatePath.placeholder"))
					.onChange((value) => {
						this.template.templatePath = value;
					});
			});

		// Show alias input toggle
		new Setting(contentEl)
			.setName(t("modals.templateEdit.showAliasInput.label"))
			.setDesc(t("modals.templateEdit.showAliasInput.desc"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.template.showAliasInput ?? true)
					.onChange((value) => {
						this.template.showAliasInput = value;
					});
			});

		// Favorite toggle
		new Setting(contentEl)
			.setName(t("modals.templateEdit.isFavorite.label"))
			.setDesc(t("modals.templateEdit.isFavorite.desc"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.template.isFavorite ?? false)
					.onChange((value) => {
						this.template.isFavorite = value;
					});
			});

		// Action buttons
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText(t("modals.templateEdit.cancelButton"))
					.onClick(() => {
						this.close();
					}),
			)
			.addButton((btn) =>
				btn
					.setButtonText(t("modals.templateEdit.saveButton"))
					.setCta()
					.onClick(() => {
						this.handleSave();
					}),
			);

		// Keyboard shortcuts
		this.scope.register([], "Enter", (evt) => {
			evt.preventDefault();
			this.handleSave();
			return false;
		});

		this.scope.register([], "Escape", (evt) => {
			evt.preventDefault();
			this.close();
			return false;
		});
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	private handleSave(): void {
		// Validate required fields
		if (!this.template.name?.trim()) {
			return;
		}
		if (!this.template.folder?.trim() && this.template.folder !== "") {
			return;
		}
		if (!this.template.fileNameFormat?.trim()) {
			return;
		}

		this.onSave(this.template);
		this.close();
	}

	private updatePreview(): void {
		if (!this.previewEl) {
			return;
		}

		const format = this.template.fileNameFormat || "";
		const preview = this.expandPlaceholders(format);
		this.previewEl.setText(t("modals.templateEdit.fileNameFormat.preview", { preview }));
	}

	private expandPlaceholders(format: string): string {
		const now = moment();

		// Expand placeholders with example values
		return format
			.replace(/{{zettel-id}}/g, now.format("YYYYMMDDHHmmss"))
			.replace(/{{datetime}}/g, now.format("YYYY-MM-DD-HHmmss"))
			.replace(/{{date}}/g, now.format("YYYY-MM-DD"))
			.replace(/{{time}}/g, now.format("HHmmss"))
			.replace(/{{title}}/g, "example-title");
	}
}
