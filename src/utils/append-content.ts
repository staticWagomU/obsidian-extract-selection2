/** Insert a separate Markdown block without changing existing text. */
export function appendAt(content: string, selection: string, offset: number): string {
	const before = content.slice(0, offset);
	const after = content.slice(offset);
	const newline = content.includes("\r\n") ? "\r\n" : "\n";
	const separator = before.length === 0 || before.endsWith(newline + newline) ? "" : before.endsWith(newline) ? newline : newline + newline;
	return before + separator + selection + newline + (after ? newline : "") + after;
}

/** ATX and setext headings outside fenced code and YAML frontmatter. */
export function appendHeadings(content: string): { heading: string; level: number; offset: number; line: number }[] {
	const result: { heading: string; level: number; offset: number; line: number }[] = [];
	const lines = content.match(/[^\n]*\n|[^\n]+$/g) ?? [];
	let offset = 0;
	let fence = "";
	let yaml = false;
	for (let line = 0; line < lines.length; line++) {
		const raw = lines[line] ?? "";
		const text = raw.replace(/[\r\n]+$/, "");
		if (line === 0 && text === "---") yaml = true;
		else if (yaml && /^(---|\.\.\.)$/.test(text)) { yaml = false; offset += raw.length; continue; }
		if (!yaml) {
			const marker = text.match(/^ {0,3}(`{3,}|~{3,})/);
			if (marker?.[1]) {
				if (!fence) fence = marker[1];
				else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && text.trim() === marker[1]) fence = "";
			} else if (!fence) {
				const atx = text.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*)|$)/);
				const underline = lines[line + 1]?.trim().match(/^(=+|-+)$/);
				if (atx?.[1]) result.push({ heading: (atx[2] ?? "").replace(/[ \t]+#+[ \t]*$/, ""), level: atx[1].length, offset, line });
				else if (text.trim() && underline) result.push({ heading: text.trim(), level: underline[0][0] === "=" ? 1 : 2, offset, line });
			}
		}
		offset += raw.length;
	}
	return result;
}
