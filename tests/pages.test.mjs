import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const projectUrl = new URL("https://bob-dev-byovd.github.io/bmuk/");

test("GitHub Pages serves the source without Jekyll processing", async () => {
  await access(new URL("../.nojekyll", import.meta.url));
});

test("local page assets resolve inside the GitHub Pages project path", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => !/^(?:#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(value));

  assert.ok(references.length >= 3, "the page must reference its local assets");
  for (const reference of references) {
    const resolved = new URL(reference, projectUrl);
    assert.equal(resolved.origin, projectUrl.origin);
    assert.ok(resolved.pathname.startsWith("/bmuk/"), reference);
    await access(new URL("../" + reference, import.meta.url));
  }
});

test("the application data import stays relative to the deployed module", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /import \{ siteData \} from "\.\/data\.js";/);
  assert.equal(
    new URL("./data.js", new URL("app.js", projectUrl)).href,
    "https://bob-dev-byovd.github.io/bmuk/data.js",
  );
});
