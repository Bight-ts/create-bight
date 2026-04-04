import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(docsRoot, "src", "content", "docs");
const distRoot = path.join(docsRoot, "dist");

const basePath = normalizeBasePath(process.env.BASE_PATH ?? "/");

if (basePath === "/") {
  console.log("[docs] BASE_PATH is '/', skipping internal link normalization.");
  process.exit(0);
}

const routeSet = collectDocsRoutes(contentRoot);
const htmlFiles = walkFiles(distRoot).filter((file) => file.endsWith(".html"));

let rewrittenLinks = 0;

for (const file of htmlFiles) {
  const original = readFileSync(file, "utf8");
  const rewritten = original.replace(
    /\b(href|src)=("([^"]*)"|'([^']*)')/g,
    (match, attribute, quotedValue, doubleQuotedValue, singleQuotedValue) => {
      const value = doubleQuotedValue ?? singleQuotedValue ?? "";
      const next = rewriteInternalUrl(value, routeSet, basePath);

      if (next === value) {
        return match;
      }

      rewrittenLinks += 1;
      const quote = quotedValue[0];
      return `${attribute}=${quote}${next}${quote}`;
    },
  );

  if (rewritten !== original) {
    writeFileSync(file, rewritten);
  }
}

console.log(
  `[docs] Rewrote ${rewrittenLinks} internal link${rewrittenLinks === 1 ? "" : "s"} for base path ${basePath}.`,
);

function normalizeBasePath(value) {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

function collectDocsRoutes(root) {
  const routes = new Set(["/"]);

  for (const file of walkFiles(root)) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) {
      continue;
    }

    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    let route = `/${relative.replace(/\.(md|mdx)$/u, "/")}`;
    route = route.replace(/\/index\/$/u, "/");
    routes.add(route);
  }

  return routes;
}

function rewriteInternalUrl(value, routes, base) {
  if (!value.startsWith("/") || value.startsWith(base)) {
    return value;
  }

  const [pathname, hash = ""] = value.split("#");

  if (!routes.has(pathname)) {
    return value;
  }

  const prefixed = `${base.slice(0, -1)}${pathname}`;
  return hash ? `${prefixed}#${hash}` : prefixed;
}

function walkFiles(root) {
  const files = [];

  for (const entry of readdirSync(root)) {
    const fullPath = path.join(root, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}
