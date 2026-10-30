import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";

const root = new URL("../dist/", import.meta.url);
const origin = "https://angelo-francisco.github.io";
const base = "/angelx/";
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}
const files = walk(root.pathname);
const pages = files.filter((file) => file.endsWith(".html"));
function target(url) {
  assert.equal(url.origin, origin);
  assert.ok(url.pathname.startsWith(base), `URL outside base: ${url}`);
  let path = join(
    root.pathname,
    decodeURIComponent(url.pathname.slice(base.length)),
  );
  if (existsSync(path) && statSync(path).isDirectory())
    path = join(path, "index.html");
  assert.ok(existsSync(path), `Missing target: ${url}`);
  return path;
}

test("all generated pages have metadata, CSP, shared navigation and working local links/assets", () => {
  assert.ok(pages.length >= 4, "No meaningful site output");
  let navigation;
  for (const file of pages) {
    const $ = load(readFileSync(file, "utf8"));
    assert.equal($("html").attr("lang"), "pt-PT", file);
    assert.ok($("title").text().trim(), file);
    assert.ok($('meta[name="description"]').attr("content")?.trim(), file);
    assert.equal($("h1").length, 1, file);
    const canonical = new URL($('link[rel="canonical"]').attr("href"));
    assert.equal(target(canonical), file);
    assert.equal($('meta[property="og:url"]').attr("content"), canonical.href);
    assert.equal(
      $('link[type="application/rss+xml"]').attr("href"),
      `${origin}${base}rss.xml`,
    );
    const csp = $('meta[http-equiv="Content-Security-Policy" i]').attr(
      "content",
    );
    assert.ok(csp?.includes("object-src 'none'"), file);
    assert.ok(csp?.includes("script-src"), file);
    assert.ok(!csp?.includes("'unsafe-inline'"), file);
    const nav = $(".site-header").html();
    assert.ok(nav, file);
    navigation ??= nav;
    assert.equal(nav, navigation, `Different navigation: ${file}`);
    $("[href], [src]").each((_, element) => {
      const value = $(element).attr("href") ?? $(element).attr("src");
      if (!value || /^(mailto:|tel:|data:)/.test(value)) return;
      const url = new URL(value, canonical);
      if (url.origin !== origin) {
        assert.equal(url.protocol, "https:", value);
        return;
      }
      const path = target(url);
      if (url.hash && path.endsWith(".html")) {
        const document = load(readFileSync(path, "utf8"));
        assert.ok(
          document("[id]")
            .toArray()
            .some(
              (node) =>
                document(node).attr("id") ===
                decodeURIComponent(url.hash.slice(1)),
            ),
          `Broken anchor: ${url}`,
        );
      }
    });
  }
});

test("RSS and sitemap reference published pages under the correct base path", () => {
  const rss = load(readFileSync(new URL("rss.xml", root), "utf8"), {
    xmlMode: true,
  });
  assert.equal(rss("channel > link").text(), `${origin}${base}`);
  const items = rss("item");
  const posts = walk(
    new URL("../src/content/blog/", import.meta.url).pathname,
  ).filter((file) => /\.(md|mdx)$/.test(file));
  assert.ok(posts.length > 0);
  assert.equal(
    items.length,
    posts.length,
    "RSS must contain every published post",
  );
  assert.equal(rss("channel > language").text(), "pt-PT");
  let previousDate = Infinity;
  items.each((_, item) => {
    target(new URL(rss(item).find("link").text()));
    const date = Date.parse(rss(item).find("pubDate").text());
    assert.ok(date <= previousDate, "RSS not sorted newest first");
    previousDate = date;
  });
  const index = load(readFileSync(new URL("sitemap-index.xml", root), "utf8"), {
    xmlMode: true,
  });
  const maps = index("loc");
  assert.ok(maps.length > 0);
  maps.each((_, map) => {
    const sitemap = load(
      readFileSync(target(new URL(index(map).text())), "utf8"),
      { xmlMode: true },
    );
    assert.equal(sitemap("url > loc").length, pages.length);
    sitemap("url > loc").each((_, loc) => target(new URL(sitemap(loc).text())));
  });
});

test("publication artifact contains no development configuration or credentials", () => {
  for (const file of files) {
    assert.ok(
      !/(^|\/)(\.env(?:\..*)?|package\.json|bun\.lock|.*\.map|.*\.pem|.*\.key)$/.test(
        file,
      ),
      file,
    );
    if (/\.(html|js|css|xml)$/.test(file)) {
      assert.ok(
        !/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{36,}|AKIA[A-Z0-9]{16}/.test(
          readFileSync(file, "utf8"),
        ),
        `Credential pattern in ${file}`,
      );
    }
  }
});
