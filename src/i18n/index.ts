import { moment } from "obsidian";
import * as en from "./locales/en.json";
import * as ja from "./locales/ja.json";

const locales: Record<string, Record<string, unknown>> = { en, ja };

/**
 * Get current locale from Obsidian settings
 * Falls back to 'ja' if locale is not supported
 */
export function getCurrentLocale(): string {
	const lang = moment.locale();
	return locales[lang] ? lang : "ja";
}

/**
 * Translate a key to the current locale
 * Supports nested keys using dot notation (e.g., "commands.extractSelection")
 * Supports variable substitution using {varName} syntax
 */
export function t(key: string, vars?: Record<string, string>): string {
	const locale = getCurrentLocale();
	const keys = key.split(".");
	let value: unknown = locales[locale];

	for (const k of keys) {
		value = (value as Record<string, unknown>)?.[k];
	}

	let result = typeof value === "string" ? value : key;

	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			result = result.replace(`{${k}}`, v);
		}
	}

	return result;
}
