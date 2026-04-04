import { CATCH_MON_LINES } from "./catchMons.jsx";

export const HATCH_DURATIONS_MS = {
  common: 5 * 60 * 1000,
  rare: 20 * 60 * 1000,
  superrare: 60 * 60 * 1000,
  legendary: 3 * 60 * 60 * 1000,
};

export const DUPLICATE_REWARDS = {
  1: { lineExp: 40, evolutionCores: 0 },
  2: { lineExp: 90, evolutionCores: 0 },
  3: { lineExp: 120, evolutionCores: 1 },
};

export const EVOLUTION_REQUIREMENTS = {
  0: { lineExp: 100, evolutionCores: 0 },
  1: { lineExp: 180, evolutionCores: 1 },
};

function getLineStages(lineId) {
  return CATCH_MON_LINES.find((line) => line.lineId === lineId)?.stages ?? [];
}

function makeSlot(slotId, unlocked = false) {
  return {
    slotId,
    unlocked,
    egg: null,
    startedAt: null,
    finishesAt: null,
    status: "idle",
  };
}

export function createDefaultHatcherySlots() {
  return [makeSlot(1, true), makeSlot(2, false), makeSlot(3, false)];
}

export function normalizeHatcherySlots(slots = []) {
  const defaults = createDefaultHatcherySlots();
  return defaults.map((slot) => {
    const found = slots.find((entry) => entry.slotId === slot.slotId);
    return found ? { ...slot, ...found } : slot;
  });
}

export function createEgg(rarity = "common", lineId, source = "reward") {
  return {
    id: `egg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    rarity,
    lineId,
    source,
    obtainedAt: Date.now(),
  };
}

export function syncHatcherySlots(slots = [], now = Date.now()) {
  return normalizeHatcherySlots(slots).map((slot) => {
    if (!slot.egg || slot.status !== "running" || !slot.finishesAt) return slot;
    if (slot.finishesAt <= now) {
      return { ...slot, status: "ready" };
    }
    return slot;
  });
}

export function getOwnedMonsterIds(collection = {}) {
  return Object.entries(collection)
    .filter(([, value]) => value?.owned)
    .map(([id]) => id);
}

export function migrateMonsterCollection(savedCollection, savedCaughtMons = []) {
  if (savedCollection && Object.keys(savedCollection).length) {
    const next = { ...savedCollection };
    Object.keys(next).forEach((id) => {
      next[id] = {
        ...next[id],
        evolvedOwned: next[id]?.evolvedOwned ?? false,
      };
    });
    return next;
  }

  const next = {};
  savedCaughtMons.forEach((id) => {
    next[id] = {
      owned: true,
      level: 1,
      exp: 0,
      duplicateCount: 0,
      lineExp: 0,
      evolutionCores: 0,
      evolvedOwned: false,
      seenAt: Date.now(),
    };
  });
  return next;
}

export function mergeOwnedIdsIntoCollection(prevCollection = {}, ids = []) {
  const next = { ...prevCollection };
  ids.forEach((id) => {
    next[id] = {
      owned: true,
      level: next[id]?.level ?? 1,
      exp: next[id]?.exp ?? 0,
      duplicateCount: next[id]?.duplicateCount ?? 0,
      lineExp: next[id]?.lineExp ?? 0,
      evolutionCores: next[id]?.evolutionCores ?? 0,
      evolvedOwned: next[id]?.evolvedOwned ?? false,
      seenAt: next[id]?.seenAt ?? Date.now(),
    };
  });
  return next;
}

export function getMonsterStageMeta(monsterId) {
  for (const line of CATCH_MON_LINES) {
    const index = line.stages.findIndex((stage) => stage.id === monsterId);
    if (index !== -1) {
      return {
        lineId: line.lineId,
        line,
        stage: line.stages[index],
        stageIndex: index,
        stageNumber: index + 1,
      };
    }
  }
  return null;
}

export function getEvolutionRequirement(stageIndex) {
  return EVOLUTION_REQUIREMENTS[stageIndex] ?? null;
}

export function getLineResourceState(collection = {}, lineId) {
  const entries = getLineStages(lineId)
    .map((stage) => collection[stage.id])
    .filter(Boolean);

  return {
    lineExp: entries.reduce((max, entry) => Math.max(max, entry?.lineExp ?? 0), 0),
    evolutionCores: entries.reduce((max, entry) => Math.max(max, entry?.evolutionCores ?? 0), 0),
    duplicateCount: entries.reduce((sum, entry) => sum + (entry?.duplicateCount ?? 0), 0),
  };
}

export function applyLineResourceState(prevCollection = {}, lineId, resourceState = {}) {
  const next = { ...prevCollection };
  const stages = getLineStages(lineId);
  stages.forEach((stage) => {
    const existing = next[stage.id];
    if (!existing) return;
    next[stage.id] = {
      ...existing,
      lineExp: resourceState.lineExp ?? existing.lineExp ?? 0,
      evolutionCores: resourceState.evolutionCores ?? existing.evolutionCores ?? 0,
      evolvedOwned: existing.evolvedOwned ?? false,
    };
  });
  return next;
}

export function normalizeCollectionLineResources(collection = {}) {
  let next = { ...collection };
  CATCH_MON_LINES.forEach((line) => {
    const resources = getLineResourceState(next, line.lineId);
    next = applyLineResourceState(next, line.lineId, resources);
  });
  return next;
}

export function isLineFullyEvolved(collection = {}, lineId) {
  const stages = getLineStages(lineId);
  if (!stages.length) return false;
  const finalStage = stages[stages.length - 1];
  return Boolean(collection[finalStage.id]?.owned && collection[finalStage.id]?.evolvedOwned);
}

export function getDexProgress(collection = {}) {
  const totalMonsters = CATCH_MON_LINES.reduce((sum, line) => sum + line.stages.length, 0);
  const ownedMonsters = getOwnedMonsterIds(collection).length;
  const totalLines = CATCH_MON_LINES.length;
  const completedLines = CATCH_MON_LINES.filter((line) => isLineFullyEvolved(collection, line.lineId)).length;
  const discoveredLines = CATCH_MON_LINES.filter((line) =>
    line.stages.some((stage) => collection[stage.id]?.owned)
  ).length;

  return {
    ownedMonsters,
    totalMonsters,
    completedLines,
    totalLines,
    discoveredLines,
  };
}

export function awardCaughtMonster(prevCollection = {}, monster) {
  if (!monster?.id) {
    return { collection: prevCollection, outcome: "none", reward: null };
  }

  const stageMeta = getMonsterStageMeta(monster.id);
  const existing = prevCollection[monster.id];
  const next = { ...prevCollection };

  if (!existing?.owned) {
    const lineResources = getLineResourceState(prevCollection, stageMeta?.lineId);
    next[monster.id] = {
      owned: true,
      level: existing?.level ?? 1,
      exp: existing?.exp ?? 0,
      duplicateCount: existing?.duplicateCount ?? 0,
      lineExp: existing?.lineExp ?? lineResources.lineExp,
      evolutionCores: existing?.evolutionCores ?? lineResources.evolutionCores,
      evolvedOwned: existing?.evolvedOwned ?? false,
      seenAt: existing?.seenAt ?? Date.now(),
      lineId: stageMeta?.lineId ?? null,
      highestStage: stageMeta?.stageNumber ?? 1,
    };
    return {
      collection: next,
      outcome: "new",
      reward: null,
      stageMeta,
    };
  }

  const reward = DUPLICATE_REWARDS[stageMeta?.stageNumber ?? 1] ?? DUPLICATE_REWARDS[1];
  const currentResources = getLineResourceState(prevCollection, stageMeta?.lineId);
  next[monster.id] = {
    ...existing,
    duplicateCount: (existing.duplicateCount ?? 0) + 1,
    lineExp: currentResources.lineExp + reward.lineExp,
    evolutionCores: currentResources.evolutionCores + reward.evolutionCores,
    highestStage: Math.max(existing.highestStage ?? 1, stageMeta?.stageNumber ?? 1),
  };
  const normalized = applyLineResourceState(next, stageMeta?.lineId, {
    lineExp: currentResources.lineExp + reward.lineExp,
    evolutionCores: currentResources.evolutionCores + reward.evolutionCores,
  });

  return {
    collection: normalized,
    outcome: "duplicate",
    reward,
    stageMeta,
  };
}

export function migrateEggState(savedEggInventory, savedHatcherySlots, savedPendingEggs = []) {
  if ((savedEggInventory && savedEggInventory.length) || (savedHatcherySlots && savedHatcherySlots.length)) {
    return {
      eggInventory: savedEggInventory ?? [],
      hatcherySlots: normalizeHatcherySlots(savedHatcherySlots ?? []),
    };
  }

  const now = Date.now();
  const hatcherySlots = createDefaultHatcherySlots();
  const eggInventory = [];
  let firstProgressAssigned = false;

  savedPendingEggs.forEach((oldEgg) => {
    const egg = createEgg(oldEgg.rarity ?? "common", oldEgg.lineId, "legacy");
    egg.obtainedAt = oldEgg.id ?? now;

    const answersLeft = typeof oldEgg.answersLeft === "number" ? oldEgg.answersLeft : 10;
    const hasProgress = answersLeft < 10;

    if (!firstProgressAssigned && hasProgress) {
      const duration = HATCH_DURATIONS_MS[egg.rarity] ?? HATCH_DURATIONS_MS.common;
      const remainingRatio = Math.max(0, Math.min(1, answersLeft / 10));
      const elapsed = duration * (1 - remainingRatio);
      hatcherySlots[0] = {
        ...hatcherySlots[0],
        egg,
        startedAt: now - elapsed,
        finishesAt: now + duration * remainingRatio,
        status: remainingRatio === 0 ? "ready" : "running",
      };
      firstProgressAssigned = true;
      return;
    }

    eggInventory.push(egg);
  });

  return {
    eggInventory,
    hatcherySlots: normalizeHatcherySlots(hatcherySlots),
  };
}
