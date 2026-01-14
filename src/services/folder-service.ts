import { App } from "obsidian";
import type { ExtractSelectionSettings } from "../types/settings";

/**
 * FolderService - placeholder until PBI-004 implements ExtractionTemplate-based folder handling
 * TODO: Update to use ExtractionTemplate.folder property
 */
export class FolderService {
	private app: App;
	private settings: ExtractSelectionSettings;

	constructor(app: App, settings: ExtractSelectionSettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * Placeholder: Initialize folders from templates
	 * TODO: Iterate over settings.templates and create folders
	 */
	async initializeAllFolders(): Promise<void> {
		for (const template of this.settings.templates) {
			if (template.folder) {
				await this.ensureFolderExistsByPath(template.folder);
			}
		}
	}

	/**
	 * Ensure folder exists, creating it if necessary
	 */
	private async ensureFolderExistsByPath(folderPath: string): Promise<void> {
		const existing = this.app.vault.getAbstractFileByPath(folderPath);
		if (existing) {
			return;
		}

		// Create parent folders first
		const parentPath = folderPath.split("/").slice(0, -1).join("/");
		if (parentPath) {
			await this.ensureFolderExistsByPath(parentPath);
		}

		// Check again after parent creation
		const existingAfterParent = this.app.vault.getAbstractFileByPath(folderPath);
		if (!existingAfterParent) {
			try {
				await this.app.vault.createFolder(folderPath);
			} catch {
				// Ignore if folder already exists
			}
		}
	}
}
