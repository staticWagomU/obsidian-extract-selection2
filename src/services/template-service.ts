import { App, moment, TFile } from "obsidian";
import type { NoteType } from "../types/note-types";
import type { ExtractSelectionSettings } from "../types/settings";
import { parseTemplateFrontmatter } from "../utils/frontmatter-parser";

export interface TemplateVariables {
	title: string;
	content?: string;
	date: string;
	alias?: string;
	[key: string]: string | undefined;
}

/**
 * テンプレート処理結果（フロントマター分離版）
 */
export interface ProcessedTemplateResult {
	frontmatter: Record<string, unknown> | null;
	body: string;
}

export class TemplateService {
	private app: App;
	private settings: ExtractSelectionSettings;

	constructor(app: App, settings: ExtractSelectionSettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * テンプレートを取得して変数を展開
	 */
	async getProcessedTemplate(type: NoteType, variables: TemplateVariables): Promise<string> {
		// 1. テンプレートファイルを読み込み
		const templateContent = await this.loadTemplate(type);

		// 2. テンプレートが存在しない場合はcontentをフォールバック
		if (!templateContent) {
			return variables.content || "";
		}

		// 3. 変数を展開
		return this.expandVariables(templateContent, variables);
	}

	/**
	 * テンプレートを読み込み、フロントマターと本文を分離して変数展開
	 * @returns フロントマターオブジェクトと展開済み本文
	 */
	async getProcessedTemplateWithFrontmatter(
		type: NoteType,
		variables: TemplateVariables,
	): Promise<ProcessedTemplateResult> {
		const templateContent = await this.loadTemplate(type);

		if (!templateContent) {
			return { frontmatter: null, body: variables.content || "" };
		}

		// フロントマターと本文を分離
		const parsed = parseTemplateFrontmatter(templateContent);

		// 本文部分のみ変数展開
		const expandedBody = this.expandVariables(parsed.body, variables);

		return {
			frontmatter: parsed.frontmatter,
			body: expandedBody,
		};
	}

	/**
	 * テンプレートファイルを読み込む
	 */
	private async loadTemplate(type: NoteType): Promise<string | null> {
		// @ts-expect-error PBI-002で削除予定の旧コード
		const templatePath = this.settings[type].templatePath;

		// テンプレートパスが未設定の場合
		if (!templatePath) {
			return null;
		}

		try {
			const file = this.app.vault.getAbstractFileByPath(templatePath);
			if (!file) {
				return null;
			}

			// TFileかどうかチェック
			if (!(file instanceof TFile)) {
				return null;
			}

			const content = await this.app.vault.read(file);
			return content;
		} catch {
			return null;
		}
	}

	/**
	 * テンプレート内の変数を展開
	 */
	private expandVariables(template: string, variables: TemplateVariables): string {
		let result = template;

		// {{title}} の展開
		result = result.replace(/\{\{title\}\}/g, variables.title);

		// {{content}} の展開
		result = result.replace(/\{\{content\}\}/g, variables.content || "");

		// {{alias}} の展開
		result = result.replace(/\{\{alias\}\}/g, variables.alias || "");

		// {{date:FORMAT}} の展開（カスタムフォーマット）
		result = result.replace(/\{\{date:([^}]+)\}\}/g, (match: string, format: string) => {
			try {
				return moment(variables.date).format(format);
			} catch {
				return match; // フォーマット失敗時は元の文字列を返す
			}
		});

		// {{date}} の展開（固定形式: YYYY-MM-DD）
		result = result.replace(/\{\{date\}\}/g, moment().format("YYYY-MM-DD"));

		// {{time}} の展開（固定形式: HH:mm:ss）
		result = result.replace(/\{\{time\}\}/g, moment().format("HH:mm:ss"));

		// {{datetime}} の展開（固定形式: YYYY-MM-DD HH:mm:ss）
		result = result.replace(/\{\{datetime\}\}/g, moment().format("YYYY-MM-DD HH:mm:ss"));

		return result;
	}
}
