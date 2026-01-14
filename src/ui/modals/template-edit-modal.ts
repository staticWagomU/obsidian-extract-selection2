import { App, Modal, Setting } from "obsidian";
import type { ExtractionTemplate } from "../../types/settings";

export class TemplateEditModal extends Modal {
	private template: Partial<ExtractionTemplate>;
	private onSave: (template: Partial<ExtractionTemplate>) => void;
	private nameInput: HTMLInputElement | null = null;

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
		contentEl.createEl("h2", { text: "Edit Template" });

		// Name field (required)
		new Setting(contentEl)
			.setName("Name")
			.setDesc("Template display name")
			.addText((text) => {
				this.nameInput = text.inputEl;
				text.setValue(this.template.name || "")
					.setPlaceholder("e.g., Fleeting")
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
			.setName("Description (optional)")
			.setDesc("Brief description of the template")
			.addText((text) => {
				text.setValue(this.template.description || "")
					.setPlaceholder("e.g., Quick thought or idea")
					.onChange((value) => {
						this.template.description = value;
					});
			});

		// Icon field (optional)
		new Setting(contentEl)
			.setName("Icon (optional)")
			.setDesc("Emoji icon for the template")
			.addText((text) => {
				text.setValue(this.template.icon || "")
					.setPlaceholder("e.g., 💭")
					.onChange((value) => {
						this.template.icon = value;
					});
			});

		// Folder field (required)
		new Setting(contentEl)
			.setName("Folder")
			.setDesc("Destination folder path")
			.addText((text) => {
				text.setValue(this.template.folder || "")
					.setPlaceholder("e.g., 10-Fleeting")
					.onChange((value) => {
						this.template.folder = value;
					});
			});

		// File name format field (required)
		new Setting(contentEl)
			.setName("File name format")
			.setDesc("Format for the new file name")
			.addText((text) => {
				text.setValue(this.template.fileNameFormat || "")
					.setPlaceholder("e.g., {{zettel-id}}")
					.onChange((value) => {
						this.template.fileNameFormat = value;
					});
			});

		// Template file field (optional)
		new Setting(contentEl)
			.setName("Template file (optional)")
			.setDesc("Path to template file in vault")
			.addText((text) => {
				text.setValue(this.template.templatePath || "")
					.setPlaceholder("e.g., Templates/fleeting.md")
					.onChange((value) => {
						this.template.templatePath = value;
					});
			});

		// Show alias input toggle
		new Setting(contentEl)
			.setName("Show alias input")
			.setDesc("Show alias input modal when extracting")
			.addToggle((toggle) => {
				toggle
					.setValue(this.template.showAliasInput ?? true)
					.onChange((value) => {
						this.template.showAliasInput = value;
					});
			});

		// Action buttons
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Cancel")
					.onClick(() => {
						this.close();
					}),
			)
			.addButton((btn) =>
				btn
					.setButtonText("Save")
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
}
