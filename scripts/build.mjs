import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(root, "dist");
const files = ["index.html", "styles.css", "app.js", "data.js", "favicon.svg"];
await mkdir(destination, { recursive: true });
await Promise.all(
  files.map((file) =>
    copyFile(resolve(root, file), resolve(destination, file)),
  ),
);

const [html, css, app, data, favicon] = await Promise.all(
  files.map((file) => readFile(resolve(root, file), "utf8")),
);
// A single-file variant for previewing locally or placing inside an HTML embed.
const script =
  `${data.replace("export const siteData", "const siteData")}\n${app.replace('import { siteData } from "./data.js";', "")}`.replaceAll(
    /<\/script/gi,
    "<\\/script",
  );
const standalone = html
  .replace(
    '<link rel="stylesheet" href="./styles.css" />',
    () => `<style>\n${css}\n</style>`,
  )
  .replace('<script type="module" src="./app.js"></script>', "")
  .replace(
    'href="./favicon.svg"',
    () => `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`,
  )
  .replace(
    "</body>",
    () => `<script type="module">\n${script}\n</script>\n</body>`,
  );
await writeFile(resolve(destination, "framer-embed.html"), standalone);
// srcdoc inherits its parent's base URL; keep fragment links inside this document.
const embeddedDocument = standalone.replace(
  "<head>",
  '<head>\n    <base href="about:srcdoc" />',
);
const srcdoc = embeddedDocument
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");
const documentTitle = (
  html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "BYOVD 연구"
)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");
const snippet = `<iframe title="${documentTitle}" srcdoc="${srcdoc}" style="display:block;width:100%;height:100vh;border:0;background:#090b09;" loading="eager"></iframe>`;
await writeFile(resolve(destination, "framer-snippet.html"), snippet);
console.log(
  "Built dist/ — static site, standalone framer-embed.html and Framer HTML snippet.",
);
