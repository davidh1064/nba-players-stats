import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("applies conditional object syntax", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("flattens arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("lets a later Tailwind class win over an earlier conflicting one", () => {
    // This is the reason for tailwind-merge: plain concatenation would keep
    // both and leave the winner up to CSS ordering.
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("keeps non-conflicting Tailwind classes together", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("merges a conditional override on top of a base class", () => {
    // The pattern used throughout the components: a base class plus a variant.
    expect(cn("bg-white", { "bg-black": true })).toBe("bg-black");
  });

  it("returns an empty string when given nothing", () => {
    expect(cn()).toBe("");
  });
});
