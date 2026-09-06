import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildIndexNowPayload,
  ensureIndexNowKey,
  readIndexNowKey,
  submitIndexNow,
  urlsFromSitemap,
  validateChangedUrls,
} from "./indexnow";

async function run(): Promise<void> {
  const tempRoot = mkdtempSync(join(tmpdir(), "indexnow-test-"));
  try {
    const publicDir = join(tempRoot, "public");
    const suffix = "0123456789abcdef0123456789abcdef";
    const key = ensureIndexNowKey(publicDir, suffix);
    assert.equal(key, `indexnow-${suffix}`);
    assert.equal(ensureIndexNowKey(publicDir), key);
    assert.deepEqual(readIndexNowKey(publicDir), { key, filename: `${key}.txt` });

    const sitemapUrls = urlsFromSitemap(
      "<urlset><url><loc>https://example.com/</loc></url>" +
        "<url><loc>https://example.com/guides?a=1&amp;b=2</loc></url></urlset>",
    );
    assert.deepEqual(sitemapUrls, [
      "https://example.com/",
      "https://example.com/guides?a=1&b=2",
    ]);
    assert.deepEqual(
      validateChangedUrls("https://example.com/", [
        "https://example.com/new-page",
        "https://example.com/new-page",
      ]),
      ["https://example.com/new-page"],
    );
    assert.throws(
      () => validateChangedUrls("https://example.com/", ["https://other.example/new-page"]),
      /outside the exact HTTPS site/,
    );

    const payload = buildIndexNowPayload("https://example.com/", key, sitemapUrls);
    assert.equal(payload.host, "example.com");
    assert.equal(payload.keyLocation, `https://example.com/${key}.txt`);
    assert.deepEqual(payload.urlList, sitemapUrls);

    let requestedUrl = "";
    let requestedBody = "";
    const status = await submitIndexNow(payload, async (input, init) => {
      requestedUrl = String(input);
      requestedBody = String(init?.body);
      return new Response(null, { status: 202 });
    });
    assert.equal(status, 202);
    assert.equal(requestedUrl, "https://api.indexnow.org/indexnow");
    assert.deepEqual(JSON.parse(requestedBody), payload);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

run()
  .then(() => console.log("IndexNow local tests passed."))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
