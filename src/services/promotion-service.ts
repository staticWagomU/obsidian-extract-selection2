import { App, TFile } from "obsidian";
import { NoteType } from "../types/note-types";
import { FrontmatterService } from "./frontmatter-service";
import { FolderService } from "./folder-service";
import type { ExtractSelectionSettings } from "../types/settings";

export class PromotionService {
	private app: App;
	private frontmatterService: FrontmatterService;
	private folderService: FolderService;
	private settings: ExtractSelectionSettings;

	constructor(app: App, settings: ExtractSelectionSettings) {
		this.app = app;
		this.settings = settings;
		this.frontmatterService = new FrontmatterService(app);
		this.folderService = new FolderService(app, settings);
	}

	/**
	 * ノートを昇格する
	 * フロントマター更新 (type, promoted_from, promoted_at, tags) + フォルダ移動（設定により制御）
	 */
	async promoteNote(file: TFile, fromType: NoteType, toType: NoteType): Promise<void> {
		// 1. フロントマター更新
		await this.frontmatterService.updateMetadata(file, {
			type: toType,
			promoted_from: fromType,
			promoted_at: new Date().toISOString(),
		});

		// 2. タグ更新: 旧タイプタグを削除、新タイプタグを追加
		await this.frontmatterService.updateTags(
			file,
			[`type/${fromType}`],
			[`type/${toType}`, "promoted"],
		);

		// 3. フォルダ移動（moveOnPromotion設定が有効な場合のみ）
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
		if ((this.settings.behavior as any).moveOnPromotion) {
			const targetFolder = await this.folderService.ensureFolderExists(toType);
			const newPath = `${targetFolder}/${file.name}`;

			await this.app.vault.rename(file, newPath);
		}
	}
}
