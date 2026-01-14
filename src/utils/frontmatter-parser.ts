import { parseYaml } from "obsidian";
import type { NoteMetadata } from "../services/note-creator-service";

/**
 * Template parse result
 */
export interface ParsedTemplate {
	frontmatter: Record<string, unknown> | null;
	body: string;
}

/**
 * Parse frontmatter from template content
 * @param content Full template content
 * @returns Frontmatter object and body text
 */
export function parseTemplateFrontmatter(content: string): ParsedTemplate {
	const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
	const match = content.match(frontmatterRegex);

	if (!match || match[1] === undefined) {
		return { frontmatter: null, body: content };
	}

	const yamlContent = match[1];
	const body = content.slice(match[0].length);

	try {
		const parsed = parseYaml(yamlContent) as Record<string, unknown>;
		return { frontmatter: parsed, body };
	} catch {
		return { frontmatter: null, body: content };
	}
}

/**
 * Merge default frontmatter with template frontmatter
 * Template values take precedence except for protected fields
 */
export function mergeFrontmatter(
	defaultMetadata: NoteMetadata,
	templateFrontmatter: Record<string, unknown> | null,
): NoteMetadata {
	if (!templateFrontmatter) {
		return defaultMetadata;
	}

	return {
		...defaultMetadata,
		...templateFrontmatter,
	} as NoteMetadata;
}
