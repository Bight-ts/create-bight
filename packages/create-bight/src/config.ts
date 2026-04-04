import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const packageRoot = join(__dirname, "..");
export const templatesRoot = join(packageRoot, "templates");
