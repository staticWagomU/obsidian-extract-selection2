import { App, TFile, stringifyYaml } from "obsidian";
import type { NoteType, NoteMetadata } from "../types";

export class FrontmatterService {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * コンテンツにフロントマターを追加
	 */
	addFrontmatter(content: string, metadata: NoteMetadata): string {
		const yaml = stringifyYaml(metadata);
		return `---\n${yaml}---\n\n${content}`;
	}

	/**
	 * フロントマターのメタデータを更新
	 */
	async updateMetadata(file: TFile, updates: Partial<NoteMetadata>): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			Object.assign(frontmatter, updates);
		});
	}

	/**
	 * ノートタイプを取得
	 */
	async getNoteType(file: TFile): Promise<NoteType | null> {
		const cache = this.app.metadataCache.getFileCache(file);
		return (cache?.frontmatter?.type as NoteType) || null;
	}

	/**
	 * Structure Note へのリンクを追加
	 */
	async addStructureLink(file: TFile, structureNote: TFile): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const links: string[] = (frontmatter.structure_notes as string[]) || [];
			const newLink = `[[${structureNote.basename}]]`;

			if (!links.includes(newLink)) {
				links.push(newLink);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				frontmatter.structure_notes = links;
			}
		});
	}

	/**
	 * タグを更新（削除と追加）
	 */
	async updateTags(file: TFile, tagsToRemove: string[], tagsToAdd: string[]): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const currentTags: string[] = (frontmatter.tags as string[]) || [];

			// 削除
			const filtered = currentTags.filter((t) => !tagsToRemove.includes(t));

			// 追加（重複なし）
			const newTags = [...new Set([...filtered, ...tagsToAdd])];

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			frontmatter.tags = newTags;
		});
	}
}
