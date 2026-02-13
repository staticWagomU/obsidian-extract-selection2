/**
 * Normalize heading levels so that the minimum heading level becomes H1.
 * Relative hierarchy is preserved.
 *
 * Only ATX-style headings at the beginning of a line are targeted.
 * Headings inside blockquotes, code blocks, or HTML comments are not handled.
 *
 * Example: "### A\n#### B" → "# A\n## B"
 */
export function normalizeHeadingLevels(text: string): string {
	const lines = text.split("\n");

	// Find the minimum heading level
	let minLevel = 7; // Markdown headings are H1-H6
	for (const line of lines) {
		const match = line.match(/^(#{1,6})\s/);
		if (match) {
			minLevel = Math.min(minLevel, match[1].length);
		}
	}

	// No headings found, or already at H1
	if (minLevel >= 7 || minLevel <= 1) {
		return text;
	}

	const reduction = minLevel - 1;

	return lines
		.map((line) => {
			const match = line.match(/^(#{1,6})(\s.*)/);
			if (!match) {
				return line;
			}
			const currentLevel = match[1].length;
			const newLevel = currentLevel - reduction;
			return "#".repeat(newLevel) + match[2];
		})
		.join("\n");
}
