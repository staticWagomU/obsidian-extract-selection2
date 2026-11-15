import { describe, expect, it } from "vitest";
import { findHeadingSection } from "./heading-section";

describe("heading sections", () => {
	it("includes children and stops at an equal heading", () => {
		expect(findHeadingSection(["# A", "text", "## Child", "body", "# B"], 1)).toEqual({ from: 0, to: 4 });
	});
	it("uses the closest heading and stops at a parent", () => {
		expect(findHeadingSection(["# A", "## Child", "body", "# B"], 2)).toEqual({ from: 1, to: 3 });
	});
	it.each(["```", "~~~~"])("ignores headings in %s fences", (fence) => {
		expect(findHeadingSection(["# A", fence, "# Fake", fence, "body"], 2)).toEqual({ from: 0, to: 5 });
	});
	it("does not extract a preamble", () => {
		expect(findHeadingSection(["intro", "# A"], 0)).toBeUndefined();
	});
	it("ignores invalid and indented headings", () => {
		expect(findHeadingSection(["# A", "    # Code", "#hashtag", "####### invalid"], 3)).toEqual({ from: 0, to: 4 });
	});
});
