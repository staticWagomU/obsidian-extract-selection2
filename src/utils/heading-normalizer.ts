/**
 * Normalize heading levels so that the minimum heading level becomes H1.
 * Relative hierarchy is preserved.
 *
 * Only ATX-style headings at the beginning of a line are targeted.
 * Headings inside blockquotes, code blocks, or HTML comments are not handled.
 *
 * Example: "### A\n#### B" → "# A\n## B"
 */
export function normalizeHeadingLevels(_text: string): string {
	throw new Error("Not implemented");
}
