import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(projectDirectory, "output");
const outputPath = path.join(outputDirectory, "ordinary-physics-atlas.html");
const portablePath = path.join(projectDirectory, "普通物理知識圖譜.html");
const pagesPath = path.join(projectDirectory, "index.html");

const result = await build({
  absWorkingDir: projectDirectory,
  entryPoints: ["offline/main.tsx"],
  bundle: true,
  write: false,
  outdir: "offline-build",
  entryNames: "physics-atlas",
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  minify: true,
  legalComments: "none",
  charset: "utf8",
  loader: {
    ".woff": "dataurl",
    ".woff2": "dataurl",
    ".ttf": "dataurl",
    ".png": "dataurl",
    ".svg": "dataurl",
  },
});

const javascript = result.outputFiles.find((file) => file.path.endsWith(".js"));
const stylesheet = result.outputFiles.find((file) => file.path.endsWith(".css"));

if (!javascript || !stylesheet) {
  throw new Error("離線建置沒有產生預期的 JavaScript 與 CSS。");
}

const favicon = await readFile(path.join(projectDirectory, "public", "favicon.png"));
const faviconDataUrl = `data:image/png;base64,${favicon.toString("base64")}`;
const safeJavascript = javascript.text.replaceAll("</script", "<\\/script");

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#080a11">
  <meta name="description" content="物理譜：以 185 個概念與 429 條先修關係呈現的大學普通物理知識圖譜。">
  <title>物理譜｜普通物理知識圖譜</title>
  <link rel="icon" href="${faviconDataUrl}">
  <style>${stylesheet.text}</style>
</head>
<body>
  <div id="root">
    <div style="min-height:100svh;display:grid;place-items:center;background:#080a11;color:#aeb7ce;font:14px system-ui,sans-serif">正在展開物理知識圖譜…</div>
  </div>
  <noscript>此互動知識圖譜需要瀏覽器啟用 JavaScript。</noscript>
  <script>${safeJavascript}</script>
</body>
</html>`;

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(outputPath, html, "utf8"),
  writeFile(portablePath, html, "utf8"),
  writeFile(pagesPath, html, "utf8"),
]);

console.log(portablePath);
