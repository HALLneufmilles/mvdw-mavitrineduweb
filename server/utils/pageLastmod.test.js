import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { create } from "xmlbuilder2";

import {
  createFilesFingerprint,
  getSitemapStatePath,
  synchronizePageLastmods
} from "./pageLastmod.js";
import {
  buildSitemapXml,
  createPostUrls,
  createStaticUrls
} from "./sitemap.js";

async function createFixture(t) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "mvdw-lastmod-"));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  await mkdir(path.join(rootDir, "pages"), { recursive: true });
  await writeFile(path.join(rootDir, "pages", "page.html"), "<h1>Page</h1>\n");
  await writeFile(path.join(rootDir, "pages", "style.css"), "h1 { color: navy; }\n");
  return rootDir;
}

test("l'empreinte est déterministe et indépendante de l'ordre des chemins", async (t) => {
  const rootDir = await createFixture(t);
  const first = await createFilesFingerprint(
    ["pages/page.html", "pages/style.css"],
    { rootDir }
  );
  const second = await createFilesFingerprint(
    ["pages/style.css", "pages/page.html"],
    { rootDir }
  );

  assert.match(first, /^[a-f0-9]{64}$/);
  assert.equal(second, first);
});

test("l'empreinte normalise CRLF, LF et CR sans masquer un vrai changement", async (t) => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "mvdw-lastmod-eol-"));
  t.after(() => rm(rootDir, { recursive: true, force: true }));
  const variants = {
    lf: "ligne 1\nligne 2\n",
    crlf: "ligne 1\r\nligne 2\r\n",
    cr: "ligne 1\rligne 2\r"
  };

  for (const [directory, content] of Object.entries(variants)) {
    await mkdir(path.join(rootDir, directory), { recursive: true });
    await writeFile(path.join(rootDir, directory, "sample.txt"), content);
  }

  const fingerprints = await Promise.all(
    Object.keys(variants).map((directory) =>
      createFilesFingerprint(["sample.txt"], {
        rootDir: path.join(rootDir, directory)
      })
    )
  );

  assert.equal(fingerprints[0], fingerprints[1]);
  assert.equal(fingerprints[0], fingerprints[2]);

  await writeFile(
    path.join(rootDir, "crlf", "sample.txt"),
    "ligne 1 modifiée\r\nligne 2\r\n"
  );
  const changedFingerprint = await createFilesFingerprint(["sample.txt"], {
    rootDir: path.join(rootDir, "crlf")
  });
  assert.notEqual(changedFingerprint, fingerprints[0]);
});

test("la synchronisation persiste, conserve puis actualise le lastmod", async (t) => {
  const rootDir = await createFixture(t);
  const statePath = getSitemapStatePath(rootDir);
  const trackedPages = {
    "/fixture": ["pages/page.html", "pages/style.css"]
  };
  const fingerprint = await createFilesFingerprint(trackedPages["/fixture"], {
    rootDir
  });
  const initialState = {
    "/fixture": {
      fingerprint,
      lastmod: "2026-01-02T03:04:05.000Z"
    }
  };

  const first = await synchronizePageLastmods({
    rootDir,
    statePath,
    trackedPages,
    initialState,
    now: () => new Date("2026-02-01T00:00:00.000Z")
  });
  const firstJson = await readFile(statePath, "utf8");
  assert.equal(first.state.pages["/fixture"].lastmod, initialState["/fixture"].lastmod);

  const second = await synchronizePageLastmods({
    rootDir,
    statePath,
    trackedPages,
    initialState,
    now: () => new Date("2026-03-01T00:00:00.000Z")
  });
  assert.equal(second.changed, false);
  assert.equal(await readFile(statePath, "utf8"), firstJson);

  await writeFile(
    path.join(rootDir, "pages", "style.css"),
    "h1 { color: teal; }\n"
  );
  const third = await synchronizePageLastmods({
    rootDir,
    statePath,
    trackedPages,
    initialState,
    now: () => new Date("2026-04-05T06:07:08.009Z")
  });

  assert.notEqual(
    third.state.pages["/fixture"].fingerprint,
    first.state.pages["/fixture"].fingerprint
  );
  assert.equal(
    third.state.pages["/fixture"].lastmod,
    "2026-04-05T06:07:08.009Z"
  );

  const systemFiles = await readdir(path.dirname(statePath));
  assert.deepEqual(systemFiles, ["sitemap-state.json"]);
});

test("un JSON invalide est reconstruit avec la date de synchronisation", async (t) => {
  const rootDir = await createFixture(t);
  const statePath = getSitemapStatePath(rootDir);
  const trackedPages = { "/fixture": ["pages/page.html"] };
  const fingerprint = await createFilesFingerprint(trackedPages["/fixture"], {
    rootDir
  });

  await mkdir(path.dirname(statePath), { recursive: true });
  await writeFile(statePath, "{ état invalide");

  const result = await synchronizePageLastmods({
    rootDir,
    statePath,
    trackedPages,
    initialState: {
      "/fixture": {
        fingerprint,
        lastmod: "2026-01-01T00:00:00.000Z"
      }
    },
    now: () => new Date("2026-05-06T07:08:09.010Z")
  });

  assert.equal(
    result.state.pages["/fixture"].lastmod,
    "2026-05-06T07:08:09.010Z"
  );
  const recoveredState = await readFile(statePath, "utf8");
  assert.doesNotThrow(() => JSON.parse(recoveredState));
});

test("la migration v1 restaure les pages statiques et conserve le blog", async (t) => {
  const rootDir = await createFixture(t);
  const statePath = getSitemapStatePath(rootDir);
  const trackedPages = {
    "/": ["pages/page.html"],
    "/tarifs.html": ["pages/page.html"],
    "/services.html": ["pages/style.css"],
    blogPresentation: ["pages/page.html", "pages/style.css"]
  };
  const fingerprints = Object.fromEntries(
    await Promise.all(
      Object.entries(trackedPages).map(async ([pageKey, files]) => [
        pageKey,
        await createFilesFingerprint(files, { rootDir })
      ])
    )
  );
  const incorrectLastmod = "2026-09-10T15:37:39.860Z";
  const initialState = {
    "/": {
      fingerprint: fingerprints["/"],
      lastmod: "2026-08-09T10:17:55.000Z"
    },
    "/tarifs.html": {
      fingerprint: fingerprints["/tarifs.html"],
      lastmod: "2026-08-09T10:17:55.000Z"
    },
    "/services.html": {
      fingerprint: fingerprints["/services.html"],
      lastmod: "2026-08-09T11:01:35.000Z"
    },
    blogPresentation: {
      fingerprint: fingerprints.blogPresentation,
      lastmod: incorrectLastmod
    }
  };
  const versionOneState = {
    version: 1,
    pages: Object.fromEntries(
      Object.entries(fingerprints).map(([pageKey, fingerprint]) => [
        pageKey,
        { fingerprint, lastmod: incorrectLastmod }
      ])
    )
  };

  await mkdir(path.dirname(statePath), { recursive: true });
  await writeFile(statePath, `${JSON.stringify(versionOneState, null, 2)}\n`);

  const migrated = await synchronizePageLastmods({
    rootDir,
    statePath,
    trackedPages,
    initialState,
    now: () => new Date("2026-09-11T00:00:00.000Z")
  });

  assert.equal(migrated.state.version, 2);
  assert.equal(migrated.state.pages["/"].lastmod, initialState["/"].lastmod);
  assert.equal(
    migrated.state.pages["/tarifs.html"].lastmod,
    initialState["/tarifs.html"].lastmod
  );
  assert.equal(
    migrated.state.pages["/services.html"].lastmod,
    initialState["/services.html"].lastmod
  );
  assert.equal(
    migrated.state.pages.blogPresentation.lastmod,
    incorrectLastmod
  );

  const migratedJson = await readFile(statePath, "utf8");
  const secondStart = await synchronizePageLastmods({
    rootDir,
    statePath,
    trackedPages,
    initialState,
    now: () => new Date("2026-09-12T00:00:00.000Z")
  });

  assert.equal(secondStart.changed, false);
  assert.equal(await readFile(statePath, "utf8"), migratedJson);
});

test("le sitemap garde updatedAt pour les articles et le maximum pour /blog", () => {
  const pageState = {
    version: 1,
    pages: {
      "/": { lastmod: "2026-01-01T00:00:00.000Z" },
      "/tarifs.html": { lastmod: "2026-01-02T00:00:00.000Z" },
      "/services.html": { lastmod: "2026-01-03T00:00:00.000Z" },
      blogPresentation: { lastmod: "2026-03-01T00:00:00.000Z" }
    }
  };
  const posts = [
    {
      slug: "article-test",
      updatedAt: new Date("2026-04-01T12:30:00.000Z")
    }
  ];

  const staticUrls = createStaticUrls(pageState, posts);
  const postUrls = createPostUrls(posts);
  const blogUrl = staticUrls.find((url) => url.loc === "/blog");

  assert.equal(blogUrl.lastmod, posts[0].updatedAt.toISOString());
  assert.equal(postUrls[0].lastmod, posts[0].updatedAt.toISOString());
  assert.equal(
    createStaticUrls(pageState, [
      { updatedAt: new Date("2026-02-01T00:00:00.000Z") }
    ]).find((url) => url.loc === "/blog").lastmod,
    pageState.pages.blogPresentation.lastmod
  );

  const xml = buildSitemapXml([...staticUrls, ...postUrls]);
  assert.doesNotThrow(() => create(xml));
  assert.match(xml, /<loc>https:\/\/mavitrineduweb\.fr\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/mavitrineduweb\.fr\/blog<\/loc>/);
  assert.match(
    xml,
    /<loc>https:\/\/mavitrineduweb\.fr\/blog\/post\/article-test<\/loc>/
  );
  assert.match(xml, /<lastmod>2026-04-01T12:30:00\.000Z<\/lastmod>/);
  assert.match(xml, /<priority>1\.0<\/priority>/);
});
