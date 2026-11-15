import { describe, expect, it } from "vitest";
import { normalizeExtractionMode, resolveExtractionMode } from "./extraction-mode";

describe("template extraction mode", () => {
	it("keeps legacy templates responsive to global settings", () => {
		expect(resolveExtractionMode(undefined, true)).toBe("link");
		expect(resolveExtractionMode(undefined, false)).toBe("copy");
		expect(resolveExtractionMode("inherit", false)).toBe("copy");
	});
	it("honors each explicit mode regardless of the global toggle", () => {
		for (const mode of ["link", "copy", "embed"]) {
			expect(resolveExtractionMode(mode, true)).toBe(mode);
			expect(resolveExtractionMode(mode, false)).toBe(mode);
		}
	});
	it("migrates missing and invalid persisted values to inherit", () => {
		for (const value of [undefined, null, "", "invalid", 3]) {
			expect(normalizeExtractionMode(value)).toBe("inherit");
		}
	});
});
