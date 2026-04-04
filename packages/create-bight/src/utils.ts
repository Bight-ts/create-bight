import { readdir, readFile, stat, writeFile, mkdir, copyFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";

const TEXT_EXTENSIONS = new Set([
  ".json",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".mts",
  ".cts",
  ".md",
  ".yaml",
  ".yml",
  ".env",
  ".gitignore",
  ".txt",
]);

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function copyTemplateDir(
  sourceDir: string,
  targetDir: string,
  replacements: Record<string, string>,
): Promise<void> {
  await ensureDir(targetDir);
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry.name);
    const renderedName = renderString(entry.name, replacements);
    const targetPath = join(targetDir, renderedName);

    if (entry.isDirectory()) {
      await copyTemplateDir(sourcePath, targetPath, replacements);
      continue;
    }

    await ensureDir(dirname(targetPath));
    if (isTextFile(entry.name)) {
      const content = await readFile(sourcePath, "utf8");
      await writeFile(targetPath, renderString(content, replacements), "utf8");
      continue;
    }

    await copyFile(sourcePath, targetPath);
  }
}

export async function isDirectoryEmpty(path: string): Promise<boolean> {
  try {
    const entries = await readdir(path);
    return entries.length === 0;
  } catch {
    return true;
  }
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export function renderString(
  template: string,
  replacements: Record<string, string>,
): string {
  return Object.entries(replacements).reduce(
    (acc, [token, value]) => acc.replaceAll(token, value),
    template,
  );
}

function isTextFile(fileName: string): boolean {
  const extension = extname(fileName);
  return extension === "" || TEXT_EXTENSIONS.has(extension);
}
