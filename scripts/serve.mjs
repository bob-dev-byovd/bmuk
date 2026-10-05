import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = resolve(projectRoot, option("--dir", "."));
const port = Number(option("--port", process.env.PORT || "5173"));
const host = option("--host", "127.0.0.1");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};
const publicFiles = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "favicon.svg",
  "assets/research-knot.png",
  "framer-embed.html",
  "framer-snippet.html",
]);

const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }
  let relativePath;
  try {
    relativePath =
      decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      ).replace(/^\/+/, "") || "index.html";
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }
  const filePath = resolve(root, relativePath);
  if (!publicFiles.has(relativePath) || !filePath.startsWith(root + sep)) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mime[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `Port ${port} is already in use. Try: npm run dev -- --port ${port + 1}`
      : error.message,
  );
  process.exitCode = 1;
});
server.listen(port, host, () =>
  console.log(
    `BYOVD is ready → http://${host}:${port}\nServing ${root}\nPress Ctrl+C to stop.`,
  ),
);
