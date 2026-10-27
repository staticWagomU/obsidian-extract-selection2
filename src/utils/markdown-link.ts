/**
 * Build a Markdown link. Spaces in the path are encoded as %20 (same as Obsidian's
 * own Markdown links) because a raw space terminates the link destination.
 * Not encodeURI: it would also percent-encode non-ASCII titles, making links unreadable.
 */
export function buildMarkdownLink(text: string, path: string): string {
	return `[${text}](${path.replace(/ /g, "%20")})`;
}
