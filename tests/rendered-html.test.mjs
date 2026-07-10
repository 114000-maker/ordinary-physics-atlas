import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the physics atlas", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-Hant">/i);
  assert.match(html, /<title>普通物理知識圖譜｜物理譜<\/title>/i);
  assert.match(html, /185 個可評量概念/);
  assert.match(html, /普通物理學知識圖譜/);
  assert.match(html, /搜尋概念、公式或領域/);
});

test("builds identical self-contained pages for offline use and GitHub Pages", async () => {
  const [pagesHtml, portableHtml, outputHtml] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../普通物理知識圖譜.html", import.meta.url), "utf8"),
    readFile(new URL("../output/ordinary-physics-atlas.html", import.meta.url), "utf8"),
  ]);

  assert.equal(pagesHtml, portableHtml);
  assert.equal(pagesHtml, outputHtml);
  assert.match(pagesHtml, /<title>物理譜｜普通物理知識圖譜<\/title>/);
  assert.match(pagesHtml, /<style>[\s\S]+<\/style>/);
  assert.match(pagesHtml, /<script>[\s\S]+<\/script>/);
  assert.doesNotMatch(pagesHtml, /<script[^>]+src=/i);
  assert.doesNotMatch(pagesHtml, /<link[^>]+rel=["']stylesheet["']/i);
});
