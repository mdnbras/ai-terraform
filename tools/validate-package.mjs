import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectedName = "ai-terraform";
const errors = [];
async function exists(path) { try { await access(path); return true; } catch { return false; } }
async function filesUnder(path, predicate) { const files = []; for (const entry of await readdir(path, { withFileTypes: true })) { const item = join(path, entry.name); if (entry.isDirectory()) files.push(...await filesUnder(item, predicate)); else if (predicate(entry.name)) files.push(item); } return files; }
function frontmatter(content) { return content.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] ?? null; }
const manifest = JSON.parse(await readFile(join(root, "specialist.json"), "utf8"));
if (manifest.name !== expectedName || !manifest.version) errors.push("Manifesto Terraform inválido.");
if (manifest.entryAgent !== `specialists/${expectedName}/orchestrator`) errors.push("Entry agent Terraform inválido.");
for (const exported of manifest.exports ?? []) if (!await exists(join(root, exported.source))) errors.push(`Export ausente: ${exported.source}`);
const agents = await filesUnder(join(root, ".kiro", "agents"), (name) => name.endsWith(".md"));
for (const path of agents) { const metadata = frontmatter(await readFile(path, "utf8")); for (const field of ["name", "description", "tools", "resources", "includeMcpJson"]) if (!new RegExp(`^${field}:`, "mu").test(metadata ?? "")) errors.push(`Agent sem ${field}: ${path}`); if (!(metadata ?? "").includes('"@jira"') || !(metadata ?? "").includes('"@github"')) errors.push(`Agent sem MCPs obrigatórios: ${path}`); }
const skills = await filesUnder(join(root, ".kiro", "skills"), (name) => name === "SKILL.md");
for (const path of skills) { const metadata = frontmatter(await readFile(path, "utf8")); for (const field of ["name", "description"]) if (!new RegExp(`^${field}:`, "mu").test(metadata ?? "")) errors.push(`Skill sem ${field}: ${path}`); }
const hooks = await filesUnder(join(root, ".kiro", "hooks"), (name) => name.endsWith(".json"));
for (const path of hooks) { try { const hook = JSON.parse(await readFile(path, "utf8")); if (hook.version !== "v1" || !Array.isArray(hook.hooks)) errors.push(`Hook v1 inválido: ${path}`); } catch (error) { errors.push(`JSON inválido em ${path}: ${error.message}`); } }
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length) process.exit(1);
console.log(`Pacote válido: ${agents.length} agents, ${skills.length} skills, ${hooks.length} hook file(s).`);

