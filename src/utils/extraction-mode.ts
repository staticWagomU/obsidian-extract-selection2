import type { ExtractionMode } from "../types/settings";

export function normalizeExtractionMode(value: unknown): ExtractionMode {
	return value === "link" || value === "copy" || value === "embed" ? value : "inherit";
}

export function resolveExtractionMode(value: unknown, insertLink: boolean): Exclude<ExtractionMode, "inherit"> {
	const mode = normalizeExtractionMode(value);
	return mode === "inherit" ? (insertLink ? "link" : "copy") : mode;
}
