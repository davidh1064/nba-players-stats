// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import postcss, { type AtRule, type Root, type Rule } from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Asserts on globals.css as compiled by the real Tailwind v4 PostCSS plugin —
 * the same compiler `next build` uses. This is the compiler's output before
 * Next's production optimizer runs; the optimizer later minifies it (e.g. it
 * drops the quotes in [role='button']) but keeps the rules and their layers.
 * jsdom does not apply Tailwind, so a component-level test could not observe
 * any of this.
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

const normalize = (s: string) => s.replace(/'/g, '"').replace(/\s+/g, "");

/** Every compiled rule whose selector list contains `selector` (quote-insensitive). */
function rulesMatching(selector: string): Rule[] {
  const wanted = normalize(selector);
  const found: Rule[] = [];
  compiled.walkRules((rule) => {
    if (rule.selectors.map(normalize).includes(wanted)) found.push(rule);
  });
  return found;
}

function setsPointer(rule: Rule): boolean {
  return rule.nodes.some(
    (node) => node.type === "decl" && node.prop === "cursor" && node.value === "pointer",
  );
}

/** The single rule that gives `selector` a pointer cursor; fails if there is not exactly one. */
function pointerRuleFor(selector: string): Rule {
  const rules = rulesMatching(selector).filter(setsPointer);
  expect(rules, `exactly one cursor:pointer rule for ${selector}`).toHaveLength(1);
  return rules[0];
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
    pointerRuleFor("button:not(:disabled)");
  });

  it('gives enabled role="button" elements a pointer cursor', () => {
    pointerRuleFor("[role='button']:not(:disabled)");
  });

  it("keeps the rule directly inside @layer base, so cursor-* utilities still win", () => {
    // The layer is what makes this rule safe. Unlayered CSS beats every layered
    // utility, and inside @layer utilities its specificity (0,1,1) beats
    // .cursor-default (0,1,0). Either way, a button given `cursor-default` or
    // `cursor-wait` would silently show a pointer. The direct parent must be the
    // base layer itself, which also rules out wrappers like @media print.
    for (const selector of ["button:not(:disabled)", "[role='button']:not(:disabled)"]) {
      const parent = pointerRuleFor(selector).parent;
      expect(parent?.type, `parent of ${selector}`).toBe("atrule");
      expect((parent as AtRule).name).toBe("layer");
      expect((parent as AtRule).params).toBe("base");
    }
  });

  it("does not give disabled buttons a pointer cursor by any selector", () => {
    // A disabled button must not look clickable. Covers the careless forms:
    // a bare selector, which also matches disabled buttons, and explicit
    // disabled selectors.
    const forbidden = [
      "button",
      "[role='button']",
      "button:disabled",
      "button[disabled]",
      "[role='button']:disabled",
      "[role='button'][aria-disabled='true']",
    ];
    for (const selector of forbidden) {
      expect(
        rulesMatching(selector).some(setsPointer),
        `${selector} must not set cursor:pointer`,
      ).toBe(false);
    }
  });
});
