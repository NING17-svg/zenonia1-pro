import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_FILE_PATTERN = /^(indexnow-[A-Za-z0-9-]{8,119})\.txt$/;

type Fetcher = typeof fetch;

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

function decodeXmlText(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function publicKeyFiles(publicDir: string): string[] {
  if (!existsSync(publicDir)) return [];
  return readdirSync(publicDir).filter((name) => KEY_FILE_PATTERN.test(name)).sort();
}

export function ensureIndexNowKey(publicDir: string, randomHex?: string): string {
  mkdirSync(publicDir, { recursive: true });
  const existing = publicKeyFiles(publicDir);
  if (existing.length > 1) throw new Error("multiple IndexNow key files found");
  if (existing.length === 1) return readIndexNowKey(publicDir).key;

  const suffix = randomHex ?? randomBytes(16).toString("hex");
  if (!/^[a-f0-9]{32}$/i.test(suffix)) {
    throw new Error("IndexNow random suffix must be 32 hexadecimal characters");
  }
  const key = `indexnow-${suffix.toLowerCase()}`;
  writeFileSync(resolve(publicDir, `${key}.txt`), key, { encoding: "utf8", flag: "wx" });
  return key;
}

export function readIndexNowKey(publicDir: string): { key: string; filename: string } {
  const files = publicKeyFiles(publicDir);
  if (files.length !== 1) {
    throw new Error(`expected one IndexNow key file, found ${files.length}`);
  }
  const filename = files[0];
  const key = filename.slice(0, -4);
  const content = readFileSync(resolve(publicDir, filename), "utf8").trim();
  if (content !== key) throw new Error("IndexNow key file content must match its filename");
  return { key, filename };
}

export function urlsFromSitemap(xml: string): string[] {
  const urls = [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)].map((match) =>
    decodeXmlText(match[1].trim()),
  );
  if (urls.length === 0) throw new Error("sitemap contains no <loc> URLs");
  return urls;
}

function canonicalSiteUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new Error("--site-url must be a clean HTTPS origin");
  }
  if (url.pathname !== "/") throw new Error("--site-url must not contain a path");
  return url;
}

export function validateChangedUrls(siteUrl: string, values: string[]): string[] {
  const site = canonicalSiteUrl(siteUrl);
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== site.hostname || url.port !== site.port) {
      throw new Error(`URL is outside the exact HTTPS site: ${value}`);
    }
    if (url.username || url.password || url.hash) {
      throw new Error(`URL contains unsupported credentials or fragment: ${value}`);
    }
    const normalized = url.toString();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(normalized);
    }
  }
  if (unique.length === 0) throw new Error("no changed URLs supplied");
  if (unique.length > 10_000) throw new Error("IndexNow accepts at most 10,000 URLs per request");
  return unique;
}

export function buildIndexNowPayload(
  siteUrl: string,
  key: string,
  urls: string[],
): IndexNowPayload {
  const site = canonicalSiteUrl(siteUrl);
  return {
    host: site.hostname,
    key,
    keyLocation: new URL(`${key}.txt`, site).toString(),
    urlList: validateChangedUrls(site.toString(), urls),
  };
}

export async function submitIndexNow(
  payload: IndexNowPayload,
  fetcher: Fetcher = fetch,
): Promise<number> {
  const response = await fetcher(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return response.status;
}

interface SubmitOptions {
  siteUrl: string;
  urls: string[];
  fromSitemap: boolean;
  submit: boolean;
}

function parseSubmitOptions(args: string[]): SubmitOptions {
  let siteUrl = "";
  const urls: string[] = [];
  let fromSitemap = false;
  let submit = false;
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--site-url") siteUrl = args[++index] ?? "";
    else if (value === "--url") urls.push(args[++index] ?? "");
    else if (value === "--from-sitemap") fromSitemap = true;
    else if (value === "--submit") submit = true;
    else throw new Error(`unknown argument: ${value}`);
  }
  if (!siteUrl) throw new Error("--site-url is required");
  if (fromSitemap && urls.length > 0) {
    throw new Error("use either --from-sitemap or explicit --url values");
  }
  if (!fromSitemap && urls.length === 0) {
    throw new Error("use --from-sitemap or supply at least one --url");
  }
  return { siteUrl, urls, fromSitemap, submit };
}

async function runSubmit(args: string[], fetcher: Fetcher = fetch): Promise<string> {
  const options = parseSubmitOptions(args);
  const site = canonicalSiteUrl(options.siteUrl);
  let urls = options.urls;
  if (options.fromSitemap) {
    const sitemapResponse = await fetcher(new URL("sitemap.xml", site));
    if (!sitemapResponse.ok) throw new Error(`sitemap returned HTTP ${sitemapResponse.status}`);
    urls = urlsFromSitemap(await sitemapResponse.text());
  }
  const { key } = readIndexNowKey(resolve(process.cwd(), "public"));
  const payload = buildIndexNowPayload(site.toString(), key, urls);
  if (!options.submit) return `IndexNow: dry-run, ${payload.urlList.length} URLs ready.`;

  const status = await submitIndexNow(payload, fetcher);
  if (status === 200) return `IndexNow: submitted ${payload.urlList.length} URLs (HTTP 200).`;
  if (status === 202) {
    return `IndexNow: accepted ${payload.urlList.length} URLs; key validation pending (HTTP 202).`;
  }
  return `IndexNow: warning, submission was not accepted (HTTP ${status}).`;
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  if (command === "setup") {
    ensureIndexNowKey(resolve(process.cwd(), "public"));
    console.log("IndexNow: key file ready.");
    return;
  }
  if (command !== "submit") throw new Error("command must be setup or submit");
  console.log(await runSubmit(args));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    if (process.argv[2] === "submit") {
      console.log(`IndexNow: warning, ${message}`);
      process.exitCode = 0;
    } else {
      console.error(`IndexNow: setup failed, ${message}`);
      process.exitCode = 1;
    }
  });
}
