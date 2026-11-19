#!/usr/bin/env node
/**
 * GX Smart — publica um .zip do site estático na Hostinger pela API oficial (developers.hostinger.com),
 * no mesmo fluxo do projeto MDG e da ferramenta hosting_deploy da Hostinger:
 *   1. descobre o usuário da hospedagem pelo domínio;
 *   2. pede credenciais de upload (files/upload-urls) e envia o zip (protocolo TUS, em partes);
 *   3. chama websites/{dominio}/deploy, que extrai o zip e SUBSTITUI o conteúdo do site.
 *
 * Uso:  node scripts/hostinger-publicar.mjs <arquivo.zip>     publica
 *       node scripts/hostinger-publicar.mjs --check           só testa se o token enxerga o site
 * Token: variável HOSTINGER_API_TOKEN ou arquivo .env.hostinger-api na raiz (fora do Git e do zip).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = process.env.HOSTINGER_API_BASE || "https://developers.hostinger.com";
const DOMAIN = process.env.HOSTINGER_DOMAIN || "novo.gxsmart.com.br";
const CHUNK = 10 * 1024 * 1024;

const c = { red: (s) => `\x1b[31m${s}\x1b[0m`, green: (s) => `\x1b[32m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`, dim: (s) => `\x1b[2m${s}\x1b[0m` };
const step = (msg) => console.log(`\n${c.cyan("==>")} ${msg}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readToken() {
  if (process.env.HOSTINGER_API_TOKEN) return process.env.HOSTINGER_API_TOKEN.trim();
  const file = path.join(ROOT, ".env.hostinger-api");
  if (!fs.existsSync(file)) return null;
  const line = fs.readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/).find((l) => l.startsWith("HOSTINGER_API_TOKEN="));
  return line ? line.slice("HOSTINGER_API_TOKEN=".length).trim().replace(/^["']|["']$/g, "") : null;
}

const TOKEN = readToken();
if (!TOKEN) {
  console.error(c.red("Token da Hostinger não configurado. Rode configurar-token.cmd primeiro."));
  process.exit(2);
}

/** Repete quando a rede falha (sem resposta). Erros HTTP não são repetidos aqui. */
async function comRetry(fn, rotulo) {
  for (let tentativa = 1; ; tentativa++) {
    try {
      return await fn();
    } catch (e) {
      const semResposta = e && e.status === undefined && /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket|network|aborted|timeout/i.test(`${e.message} ${e.cause?.code ?? ""}`);
      if (!semResposta || tentativa >= 5) throw e;
      process.stdout.write(c.dim(`\n   conexão falhou (${rotulo}), tentando de novo em ${tentativa * 5}s...`));
      await sleep(tentativa * 5000);
    }
  }
}

async function api(method, route, body) {
  const res = await comRetry(() => fetch(new URL(route, API), {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
      "User-Agent": "gxsmart-deploy-script",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(120_000),
  }), `${method} ${route.split("?")[0].split("/").slice(-2).join("/")}`);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const detail = typeof data === "object" && data ? data.message || data.error || JSON.stringify(data) : text;
    const err = new Error(`HTTP ${res.status} em ${route.split("?")[0]}: ${String(detail).slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function resolveUsername() {
  let data;
  try {
    data = await api("GET", `/api/hosting/v1/websites?domain=${encodeURIComponent(DOMAIN)}`);
  } catch (e) {
    if (e.status === 401) throw new Error("Token inválido ou expirado. Gere outro no hPanel (Conta > API) e rode configurar-token.cmd.");
    throw e;
  }
  const site = (data?.data ?? []).find((w) => w.domain === DOMAIN);
  if (!site?.username) {
    throw new Error(`Este token não enxerga o site ${DOMAIN}. O token precisa ser da conta dona do site e o subdomínio precisa existir como site no hPanel.`);
  }
  return site.username;
}

async function upload(zipPath, username) {
  const creds = await api("POST", "/api/hosting/v1/files/upload-urls", { username, domain: DOMAIN });
  const { url, auth_key: auth, rest_auth_key: authRest } = creds ?? {};
  if (!url || !auth || !authRest) throw new Error("A Hostinger não devolveu credenciais de upload.");

  const size = fs.statSync(zipPath).size;
  const target = `${url.replace(/\/$/, "")}/${encodeURIComponent(path.basename(zipPath))}?override=true`;
  const baseHeaders = { "X-Auth": auth, "X-Auth-Rest": authRest };

  const create = await comRetry(
    () => fetch(target, { method: "POST", headers: { ...baseHeaders, "upload-length": String(size), "upload-offset": "0" }, signal: AbortSignal.timeout(60_000) }),
    "início do upload",
  );
  if (create.status !== 201) throw new Error(`Falha ao iniciar upload (HTTP ${create.status}).`);

  const fd = fs.openSync(zipPath, "r");
  let offset = 0, tentativas = 0;
  try {
    while (offset < size) {
      const len = Math.min(CHUNK, size - offset);
      const buf = Buffer.alloc(len);
      fs.readSync(fd, buf, 0, len, offset);
      try {
        const res = await fetch(target, {
          method: "PATCH",
          headers: { ...baseHeaders, "Tus-Resumable": "1.0.0", "Upload-Offset": String(offset), "Content-Type": "application/offset+octet-stream" },
          body: buf,
          signal: AbortSignal.timeout(180_000),
        });
        if (res.status !== 204 && res.status !== 200) throw new Error(`HTTP ${res.status}`);
        offset = Number(res.headers.get("upload-offset") ?? offset + len);
        tentativas = 0;
        process.stdout.write(`\r   enviado ${(offset / 1048576).toFixed(1)} de ${(size / 1048576).toFixed(1)} MB (${Math.round((offset / size) * 100)}%)   `);
      } catch (e) {
        if (++tentativas > 5) throw new Error(`Upload interrompido: ${e.message}`);
        await sleep(2000 * tentativas);
        const head = await fetch(target, { method: "HEAD", headers: { ...baseHeaders, "Tus-Resumable": "1.0.0" } }).catch(() => null);
        const srvOffset = Number(head?.headers.get("upload-offset"));
        if (Number.isFinite(srvOffset) && srvOffset >= 0) offset = srvOffset;
      }
    }
  } finally {
    fs.closeSync(fd);
  }
  process.stdout.write("\n");
}

async function main() {
  const args = process.argv.slice(2);
  step(`Conectando à Hostinger (${DOMAIN})`);
  const username = await resolveUsername();
  console.log(c.green(`   OK: o token tem acesso ao site ${DOMAIN}.`));
  if (args.includes("--check")) return;

  const zip = args.find((a) => !a.startsWith("--"));
  if (!zip || !fs.existsSync(zip)) throw new Error("Informe o caminho do .zip gerado pelo publicar.");
  const zipName = path.basename(zip);

  step(`Enviando ${zipName} (${(fs.statSync(zip).size / 1048576).toFixed(1)} MB)`);
  await upload(zip, username);

  step("Publicando (a Hostinger extrai o pacote e substitui o conteúdo do site)");
  // Logo após o upload o arquivo pode ainda estar sendo processado: tenta de novo por até 2 minutos em 404.
  for (let tentativa = 1; ; tentativa++) {
    try {
      const r = await api("POST", `/api/hosting/v1/accounts/${username}/websites/${DOMAIN}/deploy`, { archive_path: zipName });
      if (r?.message) console.log(c.dim(`   ${r.message}`));
      break;
    } catch (e) {
      if (e.status !== 404 || tentativa >= 12) throw e;
      process.stdout.write(c.dim(tentativa === 1 ? "   aguardando a Hostinger processar o arquivo " : "."));
      await sleep(10_000);
    }
  }
  console.log(c.green(`\nPublicado! https://${DOMAIN} já está com a versão nova (se aparecer a antiga, Ctrl+F5).`));
}

main().catch((e) => {
  console.error(c.red(`\nErro: ${e.message}`));
  process.exit(1);
});
