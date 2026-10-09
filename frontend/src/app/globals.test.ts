// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import postcss, { type Root, type Rule } from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Asserts on the stylesheet that actually ships: globals.css compiled by the
 * real Tailwind v4 PostCSS plugin, the same one `next build` uses. jsdom does
 * not apply Tailwind, so a component-level test could not observe this.
 */
const cssPath = fileURLToPath(new URL("./globals.css", import.meta.url));

let compiled: Root;

beforeAll(async () => {
  const result = await postcss([tailwindcss()]).process(
    readFileSync(cssPath, "utf8"),
    { from: cssPath },
  );
  compiled = result.root;
});

/** Every compiled rule whose selector list contains `selector` (quote-insensitive). */
function rulesMatching(selector: string): Rule[] {
  const normalize = (s: string) => s.replace(/'/g, '"').replace(/\s+/g, "");
  const wanted = normalize(selector);
  const found: Rule[] = [];
  compiled.walkRules((rule) => {
    if (rule.selectors.map(normalize).includes(wanted)) found.push(rule);
  });
  return found;
}

function declares(rules: Rule[], prop: string, value: string): boolean {
  return rules.some((rule) =>
    rule.nodes.some(
      (node) => node.type === "decl" && node.prop === prop && node.value === value,
    ),
  );
}

describe("globals.css as compiled by Tailwind v4", () => {
  it("compiles to a non-empty stylesheet", () => {
    // Coverage refusal: if compilation silently produced nothing, every
    // assertion below would be meaningless.
    let count = 0;
    compiled.walkRules(() => {
      count++;
    });
    expect(count).toBeGreaterThan(50);
  });

  it("gives enabled buttons a pointer cursor", () => {
    // Tailwind v3's preflight did this; v4 dropped it and the upgrade codemod
    // did not restore it, so every button showed the arrow cursor.
    expect(
      declares(rulesMatching("button:not(:disabled)"), "cursor", "pointer"),
    ).toBe(true);
  });

  it('gives enabled role="button" elements a pointer cursor', () => {
    expect(
      declares(rulesMatching("[role='button']:not(:disabled)"), "cursor", "pointer"),
    ).toBe(true);
  });

  it("does not give disabled buttons a pointer cursor", () => {
    // A bare `button { cursor: pointer }` would make disabled buttons look
    // clickable; the rule must stay scoped to :not(:disabled).
    expect(declares(rulesMatching("button"), "cursor", "pointer")).toBe(false);
  });
});
