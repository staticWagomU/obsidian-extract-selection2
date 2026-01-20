import { App, TFile, Notice, moment } from "obsidian";
import type { ExtractSelectionSettings, ExtractionTemplate } from "../types/settings";
import { FrontmatterService } from "./frontmatter-service";
import { TemplateService } from "./template-service";
import { FolderService } from "./folder-service";
import { mergeFrontmatter } from "../utils/frontmatter-parser";

/**
 * Note metadata for frontmatter
 */
export interface NoteMetadata {
	created: string;
	tags?: string[];
	source_notes?: string[];
	[key: string]: unknown;
}

/**
 * NoteCreatorService - Creates notes using ExtractionTemplate configuration
 */
export class NoteCreatorService {
	private app: App;
	private settings: ExtractSelectionSettings;
	private frontmatterService: FrontmatterService;
	private templateService: TemplateService;
	private folderService: FolderService;

	constructor(
		app: App,
		settings: ExtractSelectionSettings,
		folderService: FolderService,
		templateService: TemplateService,
		frontmatterService: FrontmatterService,
	) {
		this.app = app;
		this.settings = settings;
		this.folderService = folderService;
		this.templateService = templateService;
		this.frontmatterService = frontmatterService;
	}

	/**
	 * Create a note using an ExtractionTemplate
	 */
	async createNote(
		template: ExtractionTemplate,
		content?: string,
		alias?: string,
		sourceFile?: TFile,
	): Promise<TFile> {
		const title = alias || moment().format("YYYYMMDDHHmmss");
		const folderPath = template.folder || "";

		await this.ensureFolderExistsByPath(folderPath);

		const fileName = this.generateFileName(template, title, alias);
		const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

		const templateResult = await this.templateService.getProcessedTemplateWithFrontmatter(
			template,
			{
				title,
				content: content || "",
				alias,
				date: new Date().toISOString(),
			},
		);

		const defaultMetadata: NoteMetadata = {
			created: new Date().toISOString(),
			tags: [template.name.toLowerCase()],
		};

		// エイリアスが指定されている場合、aliasesフィールドに追加
		if (alias) {
			defaultMetadata.aliases = [alias];
		}

		if (sourceFile) {
			defaultMetadata.source_notes = [`[[${sourceFile.basename}]]`];
		}

		const mergedMetadata = mergeFrontmatter(defaultMetadata, templateResult.frontmatter);

		const finalContent = this.frontmatterService.addFrontmatter(
			templateResult.body || content || "",
			mergedMetadata,
		);

		const file = await this.app.vault.create(filePath, finalContent);

		const icon = template.icon || "📝";
		new Notice(`${icon} Created: ${title}`);

		return file;
	}

	private async ensureFolderExistsByPath(folderPath: string): Promise<void> {
		if (!folderPath) return;

		const existing = this.app.vault.getAbstractFileByPath(folderPath);
		if (existing) return;

		const parentPath = folderPath.split("/").slice(0, -1).join("/");
		if (parentPath) {
			await this.ensureFolderExistsByPath(parentPath);
		}

		const existingAfterParent = this.app.vault.getAbstractFileByPath(folderPath);
		if (!existingAfterParent) {
			try {
				await this.app.vault.createFolder(folderPath);
			} catch {
				// Ignore if folder already exists
			}
		}
	}

	private generateFileName(template: ExtractionTemplate, title: string, alias?: string): string {
		let fileName = template.fileNameFormat || "{{zettel-id}}";
		const sanitizedTitle = title.replace(/[\\/:*?"<>|]/g, "-").trim();

		fileName = fileName.replace(/\{\{date\}\}/g, moment().format("YYYY-MM-DD"));
		fileName = fileName.replace(/\{\{time\}\}/g, moment().format("HH:mm:ss"));
		fileName = fileName.replace(/\{\{datetime\}\}/g, moment().format("YYYY-MM-DD HH:mm:ss"));
		fileName = fileName.replace(/\{\{zettel-id\}\}/g, moment().format("YYYYMMDDHHmmss"));
		fileName = fileName.replace(/\{\{title\}\}/g, sanitizedTitle);
		fileName = fileName.replace(/\{\{alias\}\}/g, alias || sanitizedTitle);

		const fileExtension = template.fileExtension || ".md";
		return `${fileName}${fileExtension}`;
	}
}
