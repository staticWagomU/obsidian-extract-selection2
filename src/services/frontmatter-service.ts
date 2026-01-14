import { App, TFile, stringifyYaml } from "obsidian";
import type { NoteMetadata } from "./note-creator-service";

export class FrontmatterService {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * Add frontmatter to content
	 */
	addFrontmatter(content: string, metadata: NoteMetadata): string {
		const yaml = stringifyYaml(metadata);
		return `---\n${yaml}---\n\n${content}`;
	}

	/**
	 * Update frontmatter metadata
	 */
	async updateMetadata(file: TFile, updates: Partial<NoteMetadata>): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			Object.assign(frontmatter, updates);
		});
	}

	/**
	 * Add structure link to frontmatter
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
	 * Update tags (remove and add)
	 */
	async updateTags(file: TFile, tagsToRemove: string[], tagsToAdd: string[]): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const currentTags: string[] = (frontmatter.tags as string[]) || [];
			const filtered = currentTags.filter((t) => !tagsToRemove.includes(t));
			const newTags = [...new Set([...filtered, ...tagsToAdd])];
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			frontmatter.tags = newTags;
		});
	}
}
