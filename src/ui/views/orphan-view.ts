import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import { OrphanDetectorService } from "../../services/orphan-detector-service";

export const VIEW_TYPE_ORPHAN = "orphan-permanent-view";

export class OrphanView extends ItemView {
	private orphanDetectorService: OrphanDetectorService;
	private orphanNotes: TFile[] = [];

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.orphanDetectorService = new OrphanDetectorService(this.app);
	}

	getViewType(): string {
		return VIEW_TYPE_ORPHAN;
	}

	getDisplayText(): string {
		return "孤立 Permanent Notes";
	}

	getIcon(): string {
		return "unlink";
	}

	async onOpen(): Promise<void> {
		await this.refresh();
	}

	async onClose(): Promise<void> {
		// Clean up if needed
	}

	/**
	 * ビューをリフレッシュして孤立ノートを再取得
	 */
	async refresh(): Promise<void> {
		this.orphanNotes = await this.orphanDetectorService.getOrphanPermanentNotes();
		this.renderView();
	}

	/**
	 * ビューのコンテンツを描画
	 */
	private renderView(): void {
		const container = this.containerEl.children[1];
		if (!container) {
			return;
		}
		container.empty();
		container.addClass("orphan-view-container");

		// ヘッダーとリフレッシュボタン
		const header = container.createDiv({ cls: "orphan-view-header" });
		header.createEl("h4", { text: "孤立 Permanent Notes" });

		const refreshButton = header.createEl("button", {
			text: "更新",
			cls: "orphan-view-refresh-button",
		});
		refreshButton.addEventListener("click", () => {
			void this.refresh();
		});

		// 孤立ノートリスト
		if (this.orphanNotes.length === 0) {
			container.createDiv({
				text: "孤立したPermanent Noteはありません",
				cls: "orphan-view-empty",
			});
		} else {
			const listContainer = container.createDiv({ cls: "orphan-view-list" });

			for (const note of this.orphanNotes) {
				const item = listContainer.createDiv({ cls: "orphan-view-item" });

				const link = item.createEl("a", {
					text: note.basename,
					cls: "orphan-view-note-link",
				});

				link.addEventListener("click", (e) => {
					e.preventDefault();
					void this.app.workspace.getLeaf(false).openFile(note);
				});
			}
		}
	}
}
