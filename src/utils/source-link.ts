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
