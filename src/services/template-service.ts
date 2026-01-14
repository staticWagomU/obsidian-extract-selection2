import { App, moment, TFile } from "obsidian";
import type { ExtractSelectionSettings, ExtractionTemplate } from "../types/settings";
import { parseTemplateFrontmatter } from "../utils/frontmatter-parser";

export interface TemplateVariables {
	title: string;
	content?: string;
	date: string;
	alias?: string;
	[key: string]: string | undefined;
}

/**
 * Template processing result with separated frontmatter
 */
export interface ProcessedTemplateResult {
	frontmatter: Record<string, unknown> | null;
	body: string;
}

/**
 * TemplateService - placeholder until PBI-004 implements ExtractionTemplate-based processing
 * TODO: Update methods to accept ExtractionTemplate instead of type string
 */
export class TemplateService {
	private app: App;
	private settings: ExtractSelectionSettings;

	constructor(app: App, settings: ExtractSelectionSettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * Get processed template with variables expanded
	 * TODO: Update to accept ExtractionTemplate
	 */
	async getProcessedTemplate(template: ExtractionTemplate, variables: TemplateVariables): Promise<string> {
		const templateContent = await this.loadTemplate(template);

		if (!templateContent) {
			return variables.content || "";
		}

		return this.expandVariables(templateContent, variables);
	}

	/**
	 * Load template and separate frontmatter from body
	 * TODO: Update to accept ExtractionTemplate
	 */
	async getProcessedTemplateWithFrontmatter(
		template: ExtractionTemplate,
		variables: TemplateVariables,
	): Promise<ProcessedTemplateResult> {
		const templateContent = await this.loadTemplate(template);

		if (!templateContent) {
			return { frontmatter: null, body: variables.content || "" };
		}

		const parsed = parseTemplateFrontmatter(templateContent);
		const expandedBody = this.expandVariables(parsed.body, variables);

		return {
			frontmatter: parsed.frontmatter,
			body: expandedBody,
		};
	}

	/**
	 * Load template file content
	 */
	private async loadTemplate(template: ExtractionTemplate): Promise<string | null> {
		const templatePath = template.templatePath;

		if (!templatePath) {
			return null;
		}

		try {
			const file = this.app.vault.getAbstractFileByPath(templatePath);
			if (!file || !(file instanceof TFile)) {
				return null;
			}

			return await this.app.vault.read(file);
		} catch {
			return null;
		}
	}

	/**
	 * Expand template variables
	 */
	private expandVariables(template: string, variables: TemplateVariables): string {
		let result = template;

		result = result.replace(/\{\{title\}\}/g, variables.title);
		result = result.replace(/\{\{content\}\}/g, variables.content || "");
		result = result.replace(/\{\{alias\}\}/g, variables.alias || "");

		// {{date:FORMAT}} custom format
		result = result.replace(/\{\{date:([^}]+)\}\}/g, (match: string, format: string) => {
			try {
				return moment(variables.date).format(format);
			} catch {
				return match;
			}
		});

		result = result.replace(/\{\{date\}\}/g, moment().format("YYYY-MM-DD"));
		result = result.replace(/\{\{time\}\}/g, moment().format("HH:mm:ss"));
		result = result.replace(/\{\{datetime\}\}/g, moment().format("YYYY-MM-DD HH:mm:ss"));

		return result;
	}
}
