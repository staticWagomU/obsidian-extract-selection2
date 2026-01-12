import { App, Modal, Setting } from "obsidian";
import type PageZettelPlugin from "../../main";
import { t } from "../../i18n";

export interface AliasInputResult {
	alias: string;
	removeIndent: boolean;
}

export class AliasInputModal extends Modal {
	private plugin: PageZettelPlugin;
	private onSubmit: (result: AliasInputResult) => void;
	private aliasInput: HTMLInputElement | null = null;
	private showRemoveIndent: boolean;
	private removeIndentValue = false;

	constructor(
		app: App,
		plugin: PageZettelPlugin,
		onSubmit: (result: AliasInputResult) => void,
		showRemoveIndent = false,
	) {
		super(app);
		this.plugin = plugin;
		this.onSubmit = onSubmit;
		this.showRemoveIndent = showRemoveIndent;
	}

	onOpen(): void {
		const { contentEl } = this;

		contentEl.empty();
		contentEl.addClass("page-zettel-modal");

		// モーダルタイトル
		contentEl.createEl("h2", { text: t("modals.aliasInput.title") });

		// エイリアス入力
		new Setting(contentEl)
			.setName(t("modals.aliasInput.inputName"))
			.setDesc(t("modals.aliasInput.inputDesc"))
			.addText((text) => {
				this.aliasInput = text.inputEl;
				text.setPlaceholder(t("modals.aliasInput.inputPlaceholder"))
					.onChange(() => {
						// 入力値の変更を監視
					})
					.inputEl.addEventListener("keydown", (event: KeyboardEvent) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							this.handleSubmit();
						} else if (event.key === "Escape") {
							event.preventDefault();
							this.close();
						}
					});

				// モーダルが開いたときにフォーカス
				setTimeout(() => {
					this.aliasInput?.focus();
				}, 10);
			});

		// チェックボックス（Extract時のみ表示）
		if (this.showRemoveIndent) {
			new Setting(contentEl).setName(t("modals.aliasInput.removeIndent")).addToggle((toggle) => {
				toggle.setValue(this.removeIndentValue).onChange((value) => {
					this.removeIndentValue = value;
				});
			});
		}

		// ボタン
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText(t("modals.aliasInput.createButton"))
					.setCta()
					.onClick(() => {
						this.handleSubmit();
					}),
			)
			.addButton((btn) =>
				btn.setButtonText(t("modals.aliasInput.cancelButton")).onClick(() => {
					this.close();
				}),
			);
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	private handleSubmit(): void {
		const alias = this.aliasInput?.value.trim() || "";

		this.onSubmit({
			alias,
			removeIndent: this.removeIndentValue,
		});
		this.close();
	}
}
