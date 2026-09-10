import { createHash, randomUUID } from "crypto";
import { constants } from "fs";
import {
  access,
  mkdir,
  open,
  readFile,
  rename,
  rm
} from "fs/promises";
import path from "path";

const STATE_VERSION = 1;

export const PAGE_LASTMOD_SOURCES = Object.freeze({
  "/": ["index.html", "src/styles/style.css"],
  "/tarifs.html": ["tarifs.html", "src/styles/style.css"],
  "/services.html": ["services.html", "src/styles/services.css"],
  blogPresentation: [
    "views/index.ejs",
    "views/layouts/main.ejs",
    "views/partials/search.ejs",
    "views/partials/header.ejs",
    "views/partials/footer.ejs",
    "public/css/styleBlog.css"
  ]
});

// Baseline issue de l'historique Git au moment de l'implémentation. Elle sert
// uniquement au premier démarrage si le disque persistant ne contient pas encore
// d'état. Git n'est jamais consulté au runtime.
export const INITIAL_PAGE_LASTMOD_STATE = Object.freeze({
  "/": {
    fingerprint: "c2471b328c16d778dcf77e4edc1881f5e2c4df5712678cb2536b86b6478fd212",
    lastmod: "2026-08-09T10:17:55.000Z"
  },
  "/tarifs.html": {
    fingerprint: "8d38af7bed9e66abfb077dc38bd446c833d1ee72b84a153f703059601e73397f",
    lastmod: "2026-08-09T10:17:55.000Z"
  },
  "/services.html": {
    fingerprint: "84955ff856786ba93e04b2463dfedeb151e39fd5f6181241ce597dda10ab5d26",
    lastmod: "2026-08-09T11:01:35.000Z"
  },
  blogPresentation: {
    fingerprint: "3ed6b8879a96f2585fe8d3c867bbb60a8e4865a6253494726556c777b12bfaee",
    lastmod: "2026-06-25T12:37:34.000Z"
  }
});

let cachedState = {
  version: STATE_VERSION,
  pages: structuredClone(INITIAL_PAGE_LASTMOD_STATE)
};

export function getSitemapStatePath(rootDir = process.cwd()) {
  return path.join(
    rootDir,
    "public",
    "uploads",
    ".system",
    "sitemap-state.json"
  );
}

function normalizeRelativePath(filePath) {
  return filePath.split(path.sep).join("/");
}

export async function createFilesFingerprint(
  filePaths,
  { rootDir = process.cwd() } = {}
) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    throw new Error("Au moins un fichier est requis pour calculer une empreinte.");
  }

  const sortedPaths = [...filePaths].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  );
  const hash = createHash("sha256");

  for (const filePath of sortedPaths) {
    const absolutePath = path.resolve(rootDir, filePath);
    const content = await readFile(absolutePath);
    const portablePath = normalizeRelativePath(path.relative(rootDir, absolutePath));

    // Les séparateurs et la taille empêchent les collisions par concaténation.
    hash.update(portablePath, "utf8");
    hash.update("\0", "utf8");
    hash.update(String(content.length), "utf8");
    hash.update("\0", "utf8");
    hash.update(content);
    hash.update("\0", "utf8");
  }

  return hash.digest("hex");
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry.fingerprint === "string" &&
    entry.fingerprint.length > 0 &&
    typeof entry.lastmod === "string" &&
    !Number.isNaN(Date.parse(entry.lastmod))
  );
}

async function loadStateFile(statePath) {
  try {
    const rawState = await readFile(statePath, "utf8");
    const parsedState = JSON.parse(rawState);

    if (
      !parsedState ||
      !parsedState.pages ||
      typeof parsedState.pages !== "object" ||
      Array.isArray(parsedState.pages)
    ) {
      const invalidStateError = new Error("structure JSON invalide");
      invalidStateError.code = "INVALID_STATE";
      throw invalidStateError;
    }

    return { source: "file", state: parsedState };
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        source: "missing",
        state: { version: STATE_VERSION, pages: {} }
      };
    }

    if (error instanceof SyntaxError || error.code === "INVALID_STATE") {
      console.warn(
        `[sitemap] État illisible dans ${statePath}; reconstruction des lastmod.`,
        error.message
      );
      return {
        source: "invalid",
        state: { version: STATE_VERSION, pages: {} }
      };
    }

    throw error;
  }
}

async function writeStateAtomically(statePath, state) {
  const stateDirectory = path.dirname(statePath);
  const temporaryPath = `${statePath}.${process.pid}.${randomUUID()}.tmp`;
  let temporaryFile;

  await mkdir(stateDirectory, { recursive: true });

  try {
    temporaryFile = await open(temporaryPath, "wx");
    await temporaryFile.writeFile(`${JSON.stringify(state, null, 2)}\n`, "utf8");
    await temporaryFile.sync();
    await temporaryFile.close();
    temporaryFile = undefined;
    await rename(temporaryPath, statePath);
  } finally {
    if (temporaryFile) {
      await temporaryFile.close().catch(() => {});
    }
    await rm(temporaryPath, { force: true }).catch(() => {});
  }
}

export async function synchronizePageLastmods({
  rootDir = process.cwd(),
  statePath = getSitemapStatePath(rootDir),
  trackedPages = PAGE_LASTMOD_SOURCES,
  initialState = INITIAL_PAGE_LASTMOD_STATE,
  now = () => new Date()
} = {}) {
  const loaded = await loadStateFile(statePath);
  const synchronizationLastmod = now().toISOString();
  const pages = {};
  let changed =
    loaded.source !== "file" || loaded.state.version !== STATE_VERSION;

  for (const [pageKey, filePaths] of Object.entries(trackedPages)) {
    const fingerprint = await createFilesFingerprint(filePaths, { rootDir });
    const previousEntry = loaded.state.pages[pageKey];
    const baselineEntry = initialState[pageKey];

    if (
      isValidEntry(previousEntry) &&
      previousEntry.fingerprint === fingerprint
    ) {
      const normalizedLastmod = new Date(previousEntry.lastmod).toISOString();
      pages[pageKey] = {
        fingerprint,
        lastmod: normalizedLastmod
      };
      if (normalizedLastmod !== previousEntry.lastmod) changed = true;
      continue;
    }

    const canUseBaseline =
      loaded.source !== "invalid" &&
      isValidEntry(baselineEntry) &&
      baselineEntry.fingerprint === fingerprint;

    pages[pageKey] = {
      fingerprint,
      lastmod: canUseBaseline
        ? new Date(baselineEntry.lastmod).toISOString()
        : synchronizationLastmod
    };
    changed = true;
  }

  if (Object.keys(loaded.state.pages).length !== Object.keys(pages).length) {
    changed = true;
  }

  const nextState = { version: STATE_VERSION, pages };
  cachedState = nextState;

  if (changed) {
    await writeStateAtomically(statePath, nextState);
  }

  return { changed, state: structuredClone(nextState), statePath };
}

export async function getPageLastmodState({
  statePath = getSitemapStatePath()
} = {}) {
  try {
    await access(statePath, constants.R_OK);
    const loaded = await loadStateFile(statePath);
    if (loaded.source === "file") {
      cachedState = loaded.state;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(
        `[sitemap] Lecture de ${statePath} impossible; utilisation de l'état en mémoire.`,
        error.message
      );
    }
  }

  return structuredClone(cachedState);
}
