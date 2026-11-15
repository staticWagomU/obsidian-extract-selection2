/** Find the innermost preceding ATX heading and include its child sections. */
export function findHeadingSection(lines: string[], cursorLine: number): { from: number; to: number } | undefined {
	const headings: { line: number; level: number }[] = [];
	let fence: { marker: string; length: number } | undefined;
	for (const [line, text] of lines.entries()) {
		const delimiter = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(text);
		if (delimiter) {
			const marker = delimiter[1] ?? "";
			const rest = delimiter[2] ?? "";
			if (fence) {
				if (marker[0] === fence.marker && marker.length >= fence.length && rest.trim() === "") fence = undefined;
			} else if (!(marker[0] === "`" && rest.includes("`"))) {
				fence = { marker: marker[0] ?? "", length: marker.length };
			}
			continue;
		}
		if (fence) continue;
		const heading = /^ {0,3}(#{1,6})(?:[ \t]+|$)/.exec(text);
		if (heading) headings.push({ line, level: heading[1]?.length ?? 1 });
	}
	let current: { line: number; level: number } | undefined;
	for (const heading of headings) {
		if (heading.line <= cursorLine) current = heading;
		else if (current && heading.level <= current.level) return { from: current.line, to: heading.line };
	}
	return current ? { from: current.line, to: lines.length } : undefined;
}
