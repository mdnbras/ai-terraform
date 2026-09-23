import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
async function exists(path) { try { await access(path); return true; } catch { return false; } }
if (process.env.AISDLC_SKIP_TERRAFORM_QUALITY === "1") { console.log("Terraform quality gate ignorado por AISDLC_SKIP_TERRAFORM_QUALITY=1."); process.exit(0); }
const files = await readdir(root, { withFileTypes: true });
if (!files.some((entry) => entry.isFile() && entry.name.endsWith(".tf"))) { console.log("WARN: nenhum arquivo .tf na raiz; quality gate Terraform não executado."); process.exit(0); }
const version = spawnSync("terraform", ["version"], { cwd: root, encoding: "utf8", shell: process.platform === "win32" });
if (version.error || version.status !== 0) { console.log("WARN: Terraform CLI não encontrado; quality gate não executado."); process.exit(0); }
const config = JSON.parse(await readFile(join(root, ".kiro", "specialists", "ai-terraform", "quality.json"), "utf8"));
function run(args, label) {
  console.log(`Executando ${label}: terraform ${args.join(" ")}`);
  const result = spawnSync("terraform", args, { cwd: root, stdio: "inherit", shell: process.platform === "win32", env: process.env });
  if (result.error || result.status !== 0) { console.error(result.error?.message ?? `${label} falhou com código ${result.status}.`); process.exit(result.status ?? 1); }
}
run(config.format ?? ["fmt", "-check", "-recursive"], "formatação Terraform");
if (process.env.AISDLC_TERRAFORM_INIT === "1") run(config.init ?? ["init", "-backend=false", "-input=false"], "init sem backend");
if (await exists(join(root, ".terraform"))) run(config.validate ?? ["validate", "-no-color"], "validação Terraform");
else console.log("WARN: diretório não inicializado; terraform validate não executado. Use AISDLC_TERRAFORM_INIT=1 para init -backend=false.");
if (process.env.AISDLC_TERRAFORM_TEST === "1") run(config.test ?? ["test", "-no-color"], "testes Terraform");
console.log("Quality gate Terraform concluído com sucesso.");

