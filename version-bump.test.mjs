import { describe, expect, it } from "vitest";
import { bumpReleaseMetadata } from "./version-bump.mjs";

describe("bumpReleaseMetadata", () => {
	it("adds the target version even when another version uses the same minAppVersion", () => {
		const updated = bumpReleaseMetadata(
			"2.5.0",
			{ version: "2.4.0", minAppVersion: "0.15.0" },
			{ "1.0.0": "0.15.0" },
		);

		expect(updated.manifest.version).toBe("2.5.0");
		expect(updated.versions).toEqual({
			"1.0.0": "0.15.0",
			"2.5.0": "0.15.0",
		});
	});

	it("updates an existing target version to the current minAppVersion", () => {
		const updated = bumpReleaseMetadata(
			"2.5.0",
			{ version: "2.4.0", minAppVersion: "1.8.0" },
			{ "2.5.0": "0.15.0" },
		);

		expect(updated.versions).toEqual({ "2.5.0": "1.8.0" });
	});

	it("requires a target version", () => {
		expect(() =>
			bumpReleaseMetadata(undefined, { minAppVersion: "0.15.0" }, {}),
		).toThrow("npm_package_version is required");
	});
});
