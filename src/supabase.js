import { createClient } from "@supabase/supabase-js";

function cleanEnvValue(value) {
  return String(value || "").trim().replace(/^["']|["']$/g, "");
}

const SUPABASE_URL = cleanEnvValue(import.meta.env.VITE_SUPABASE_URL);
const SUPABASE_ANON = cleanEnvValue(import.meta.env.VITE_SUPABASE_ANON ?? import.meta.env.VITE_SUPABASE_ANON_KEY);

const isConfigured = SUPABASE_URL.startsWith("https://");
const SUPABASE_TIMEOUT_MS = 2500;

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

function getProgressKey(name, classCode) {
  return `voca_${normalizeClassCode(classCode)}_${normalizePlayerName(name)}`;
}

function getLegacyProgressKey(name, classCode) {
  return `voca_${classCode}_${name}`;
}

function normalizePlayerName(name) {
  return String(name || "").trim().toLowerCase();
}

function normalizeClassCode(classCode) {
  return String(classCode || "").trim().toUpperCase();
}

function loadLocalProgress(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function saveLocalProgress(key, gameData) {
  try {
    localStorage.setItem(key, JSON.stringify(gameData));
    return true;
  } catch {
    return false;
  }
}

function getSavedAt(data) {
  const time = Date.parse(data?.savedAt || "");
  return Number.isFinite(time) ? time : 0;
}

function pickNewestProgress(...items) {
  return items.filter(Boolean).reduce((best, item) => {
    if (!best) return item;
    return getSavedAt(item) > getSavedAt(best) ? item : best;
  }, null);
}

function findLocalProgress(name, classCode) {
  const normalizedName = normalizePlayerName(name);
  const normalizedClassCode = normalizeClassCode(classCode);
  const canonicalKey = getProgressKey(name, classCode);
  const keys = new Set([canonicalKey, getLegacyProgressKey(name, classCode)]);

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith("voca_")) continue;
      const [, storedClassCode, ...storedNameParts] = key.split("_");
      if (normalizeClassCode(storedClassCode) !== normalizedClassCode) continue;
      if (normalizePlayerName(storedNameParts.join("_")) !== normalizedName) continue;
      keys.add(key);
    }
  } catch {
    return loadLocalProgress(canonicalKey);
  }

  const best = pickNewestProgress(...[...keys].map(loadLocalProgress));
  if (best) saveLocalProgress(canonicalKey, best);
  return best;
}

function withTimeout(promise, fallback) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(() => resolve(fallback), SUPABASE_TIMEOUT_MS);
    }),
  ]);
}

export async function loadProgress(name, classCode) {
  const localData = findLocalProgress(name, classCode);
  if (!isConfigured) return localData;

  try {
    const { data, error } = await withTimeout(
      supabase
        .from("progress")
        .select("data,updated_at")
        .eq("class_code", normalizeClassCode(classCode))
        .ilike("name", normalizePlayerName(name))
        .order("updated_at", { ascending: false })
        .limit(5),
      { data: null, error: new Error("Supabase load timed out") }
    );
    if (error || !data) return localData;
    const remoteData = pickNewestProgress(...data.map((row) => ({
      ...row.data,
      savedAt: row.data?.savedAt || row.updated_at,
    })));
    return pickNewestProgress(remoteData, localData);
  } catch {
    return localData;
  }
}

export async function saveProgress(name, classCode, gameData) {
  const key = getProgressKey(name, classCode);
  const dataToSave = { ...gameData, savedAt: new Date().toISOString() };
  const localSaved = saveLocalProgress(key, dataToSave);
  if (!isConfigured) return localSaved;

  try {
    const { error } = await withTimeout(
      supabase
        .from("progress")
        .upsert(
          {
            name: normalizePlayerName(name),
            class_code: normalizeClassCode(classCode),
            data: dataToSave,
            updated_at: dataToSave.savedAt,
          },
          { onConflict: "name,class_code" }
        ),
      { error: new Error("Supabase save timed out") }
    );
    return !error || localSaved;
  } catch {
    return localSaved;
  }
}
