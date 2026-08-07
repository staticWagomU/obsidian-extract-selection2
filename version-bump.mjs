import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

export function bumpReleaseMetadata(targetVersion, manifest, versions) {
	if (!targetVersion) {
		throw new Error("npm_package_version is required");
	}

	const updatedManifest = { ...manifest, version: targetVersion };
	const updatedVersions = {
		...versions,
		[targetVersion]: manifest.minAppVersion,
	};

	return { manifest: updatedManifest, versions: updatedVersions };
}

export function bumpVersionFiles({
	cwd = process.cwd(),
	targetVersion = process.env.npm_package_version,
} = {}) {
	const manifestPath = join(cwd, "manifest.json");
	const versionsPath = join(cwd, "versions.json");
	const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
	const versions = JSON.parse(readFileSync(versionsPath, "utf8"));
	const updated = bumpReleaseMetadata(targetVersion, manifest, versions);

	writeFileSync(manifestPath, `${JSON.stringify(updated.manifest, null, "\t")}\n`);
	writeFileSync(versionsPath, `${JSON.stringify(updated.versions, null, "\t")}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	bumpVersionFiles();
}
