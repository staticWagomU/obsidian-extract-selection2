/** Vault-absolute Markdown destinations avoid ambiguous duplicate note names. */
export function sourceNoteLink(path: string, blockId?: string): string {
	const destination = path.split("/").map(part => encodeURIComponent(part).replace(/[!'()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)).join("/");
	return `[source](/${destination}${blockId ? `#^${blockId}` : ""})`;
}

/** A dedicated paragraph keeps the target after the extracted text is replaced. */
export function sourceAnchor(content: string): string {
	let index = 1;
	while (content.includes(`^page-zettel-${index}`)) index++;
	return `page-zettel-${index}`;
}

/** Conservative admission: only complete paragraphs in unstructured notes. */
export function canPlaceSourceAnchor(content: string, from: number, to: number): boolean {
	if (from < 0 || to <= from || to > content.length) return false;
	// Reject structured notes rather than guess Markdown container boundaries.
	if (/^(?:\uFEFF)?---\s*(?:\r?\n|$)/.test(content)) return false;
	if (/^(?:[ \t]*(?:`{3,}|~{3,}|>|[-+*]\s|\d+[.)]\s)| {4}|\t)/m.test(content)) return false;
	const before = content.slice(0, from);
	const after = content.slice(to);
	return (before === "" || /\n\s*\n$/.test(before)) &&
		(after === "" || /^\r?\n\s*\n/.test(after));
}
