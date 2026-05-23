import { useRef } from "react";

export const ANIME_MONSTER_ARCHETYPES = [
  "shark",
  "fox",
  "cat",
  "stag",
  "bug",
  "wolf",
  "mech",
  "whale",
  "dragon",
  "spirit",
  "golem",
  "bird",
  "dino",
  "frog",
  "ram",
];

const FALLBACK_CONCEPT = {
  id: "fallback-wispwolf",
  lineId: "fallback-wispwolf",
  name: "Wispwolf",
  archetype: "wolf",
  typeClr: "#5F8CFF",
  eggColor: "#FFE082",
};

const ARCHETYPE_ALIASES = {
  robot: "mech",
  metal: "mech",
  hound: "wolf",
  dog: "wolf",
  deer: "stag",
  beetle: "bug",
  moth: "bug",
  fish: "shark",
  reef: "whale",
  cetacean: "whale",
  ghost: "spirit",
  phantom: "spirit",
  rock: "golem",
  stone: "golem",
  raptor: "bird",
  avian: "bird",
  dinosaur: "dino",
  sauropod: "dino",
  cactus: "dino",
  toad: "frog",
  tadpole: "frog",
  sheep: "ram",
  lamb: "ram",
};

let spriteIdCounter = 0;

function cleanHex(hex, fallback = "#88CCFF") {
  const raw = String(hex || fallback).trim();
  const candidate = raw.startsWith("#") ? raw : `#${raw}`;
  if (/^#[0-9a-f]{3}$/i.test(candidate) || /^#[0-9a-f]{6}$/i.test(candidate)) {
    return candidate;
  }
  return fallback;
}

export function shadeHex(hex, amount = 0) {
  const clean = cleanHex(hex).replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (num & 255) + amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function clampStage(stageIndex = 0) {
  const parsed = Number(stageIndex);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(2, Math.round(parsed)));
}

function slug(value = "monster") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "monster";
}

function hashText(value = "") {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function lineVariant(concept = FALLBACK_CONCEPT) {
  return Math.abs(hashText(`${concept?.lineId || ""}:${concept?.type || ""}:${concept?.name || ""}`)) % 4;
}

export function inferAnimeMonsterArchetype(concept = FALLBACK_CONCEPT) {
  const direct = String(concept?.archetype || concept?.shape || "").toLowerCase();
  const normalizedDirect = ARCHETYPE_ALIASES[direct] || direct;
  if (ANIME_MONSTER_ARCHETYPES.includes(normalizedDirect)) return normalizedDirect;

  const key = [
    concept?.lineId,
    concept?.id,
    concept?.name,
    concept?.type,
    concept?.family,
    concept?.element,
    concept?.archetype,
    concept?.silhouette,
    concept?.signatureShape,
  ].filter(Boolean).join(" ").toLowerCase();

  if (/shark|wave|tide|fang|fin|aqua/.test(key)) return "shark";
  if (/frog|toad|tadpole|rune|spell|pond|bog|chant/.test(key)) return "frog";
  if (/cactus|dino|saur|desert|oasis|prickle|spine/.test(key)) return "dino";
  if (/ram|sheep|lamb|wool|storm charger|cyclone|hoof/.test(key)) return "ram";
  if (/whale|reef|coral|bubble|ocean|glacier|cloud/.test(key)) return "whale";
  if (/fox|flame|ember|candy|speed|dash|fairy|ice/.test(key)) return "fox";
  if (/cat|kit|bolt|psychic|prism|gem/.test(key)) return "cat";
  if (/stag|deer|leaf|nature|bloom|forest|branch/.test(key)) return "stag";
  if (/bug|moth|larv|chrysa|toxic|venom|spike/.test(key)) return "bug";
  if (/wolf|hound|pup|dark|night|void|shadow|lava/.test(key)) return "wolf";
  if (/mech|gear|robot|cog|metal|steel|iron/.test(key)) return "mech";
  if (/dragon|drake|wyrm|dino|ancient|rex/.test(key)) return "dragon";
  if (/spirit|ghost|dream|cosmic|star|void|phant|halo/.test(key)) return "spirit";
  if (/golem|rock|sand|crystal|boulder|fossil|stone/.test(key)) return "golem";
  if (/bird|wing|wind|angel|music|breeze|storm/.test(key)) return "bird";

  return FALLBACK_CONCEPT.archetype;
}

export function getAnimeMonsterPalette(concept = FALLBACK_CONCEPT, stageIndex = 0) {
  const stage = clampStage(stageIndex);
  const stageColor = concept?.stages?.[stage]?.color || concept?.stageColor;
  const base = cleanHex(stageColor || concept?.color || concept?.typeClr || concept?.typeColor || FALLBACK_CONCEPT.typeClr);
  const accent = cleanHex(concept?.accent || concept?.eggColor || concept?.typeClr || shadeHex(base, 48), shadeHex(base, 48));
  return {
    base,
    light: shadeHex(base, 58),
    mid: shadeHex(base, 18),
    dark: shadeHex(base, -54),
    outline: "#101421",
    ink: "#141722",
    accent,
    glow: cleanHex(concept?.aura || concept?.typeClr || base),
  };
}

function useSpriteIds(seed) {
  const ref = useRef(null);
  if (!ref.current) {
    spriteIdCounter += 1;
    ref.current = `anime-mon-${slug(seed)}-${spriteIdCounter}`;
  }
  return ref.current;
}

function AnimeEyes({ x1 = 26, x2 = 38, y = 27, fierce = false, fainted = false, ink = "#141722", accent = "#76F7FF" }) {
  if (fainted) {
    return (
      <>
        <path d={`M ${x1 - 4} ${y - 4} L ${x1 + 4} ${y + 4} M ${x1 + 4} ${y - 4} L ${x1 - 4} ${y + 4}`} stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <path d={`M ${x2 - 4} ${y - 4} L ${x2 + 4} ${y + 4} M ${x2 + 4} ${y - 4} L ${x2 - 4} ${y + 4}`} stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      </>
    );
  }

  const eyeRx = fierce ? 4.2 : 4.8;
  const eyeRy = fierce ? 4.7 : 5.5;
  return (
    <>
      <ellipse cx={x1} cy={y} rx={eyeRx} ry={eyeRy} fill="#FFFFFF" />
      <ellipse cx={x2} cy={y} rx={eyeRx} ry={eyeRy} fill="#FFFFFF" />
      <ellipse cx={x1 + 0.7} cy={y + 0.8} rx={fierce ? 2.15 : 2.75} ry={fierce ? 3 : 3.7} fill={ink} />
      <ellipse cx={x2 + 0.7} cy={y + 0.8} rx={fierce ? 2.15 : 2.75} ry={fierce ? 3 : 3.7} fill={ink} />
      <circle cx={x1 - 1.4} cy={y - 1.7} r="1.15" fill="#FFFFFF" />
      <circle cx={x2 - 1.4} cy={y - 1.7} r="1.15" fill="#FFFFFF" />
      <path d={`M ${x1 - 2.4} ${y + 5.6} Q ${x1 + 0.5} ${y + 7.2} ${x1 + 3.4} ${y + 5.4}`} stroke={accent} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d={`M ${x2 - 2.4} ${y + 5.6} Q ${x2 + 0.5} ${y + 7.2} ${x2 + 3.4} ${y + 5.4}`} stroke={accent} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" />
      {fierce && (
        <>
          <path d={`M ${x1 - 5.4} ${y - 5.7} C ${x1 - 1} ${y - 8} ${x1 + 3.8} ${y - 8.4} ${x1 + 6.4} ${y - 6.7}`} stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M ${x2 - 6.4} ${y - 6.7} C ${x2 - 3.8} ${y - 8.4} ${x2 + 1} ${y - 8} ${x2 + 5.4} ${y - 5.7}`} stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
    </>
  );
}

function AnimeMouth({ x = 32, y = 36, ink = "#141722", fang = false, fainted = false }) {
  if (fainted) {
    return <path d={`M ${x - 5} ${y + 1} C ${x - 2} ${y - 1} ${x + 2} ${y - 1} ${x + 5} ${y + 1}`} stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />;
  }
  return (
    <>
      <path d={`M ${x - 4.5} ${y} Q ${x} ${y + 3.1} ${x + 4.5} ${y}`} stroke={ink} strokeWidth="1.75" fill="none" strokeLinecap="round" />
      {fang && (
        <>
          <path d={`M ${x - 2.4} ${y + 0.7} L ${x - 1.1} ${y + 4.2} L ${x + 0.3} ${y + 0.9} Z`} fill="#FFFFFF" />
          <path d={`M ${x + 2.4} ${y + 0.7} L ${x + 3.7} ${y + 4.1} L ${x + 5.1} ${y + 0.7} Z`} fill="#FFFFFF" />
        </>
      )}
    </>
  );
}

function TypeAura({ color, accent, stage }) {
  const big = stage >= 2;
  const mid = stage >= 1;
  return (
    <g opacity="0.9">
      <ellipse cx="32" cy="42" rx={big ? 25 : mid ? 21 : 17} ry={big ? 14 : mid ? 12 : 9} fill={color} opacity={big ? 0.2 : 0.13} />
      <path d="M12 45 C19 38 27 36 34 39 C42 42 50 40 57 33" stroke={color} strokeWidth={big ? 2.4 : 1.7} fill="none" strokeLinecap="round" opacity="0.34" />
      <circle cx="12" cy="22" r={big ? 3.2 : 2.2} fill={accent} opacity="0.38" />
      <circle cx="53" cy="18" r={mid ? 2.7 : 1.7} fill={color} opacity="0.36" />
      {mid && <circle cx="50" cy="47" r="2.2" fill={accent} opacity="0.3" />}
      {big && <path d="M9 34 C6 29 7 25 11 21 C10 27 13 30 18 32 C14 33 11 34 9 34 Z" fill={accent} opacity="0.26" />}
    </g>
  );
}

function CellShade({ d, color, opacity = 0.5 }) {
  return <path d={d} fill={color} opacity={opacity} />;
}

function StageCrest({ stage, accent, dark }) {
  if (stage <= 0) return null;
  return (
    <>
      <path d="M31 14 C29 8 31 4 36 1 C37 8 35 13 32 17 Z" fill={accent} opacity="0.95" />
      {stage >= 2 && <path d="M38 16 C43 9 50 7 57 10 C52 14 47 19 40 22 Z" fill={dark} opacity="0.9" />}
    </>
  );
}

function VariantDetails({ stage, p, variant }) {
  const opacity = stage >= 2 ? 0.92 : 0.72;
  if (variant === 0) {
    return (
      <g opacity={opacity}>
        <path d="M15 16 C12 10 14 6 20 4 C19 10 21 14 26 17 C21 18 18 18 15 16 Z" fill={p.accent} />
        {stage >= 1 && <circle cx="51" cy="16" r="3.2" fill={p.light} opacity="0.72" />}
      </g>
    );
  }
  if (variant === 1) {
    return (
      <g opacity={opacity}>
        <path d="M11 48 C16 44 22 44 27 49 C21 50 16 52 12 56 Z" fill={p.accent} />
        {stage >= 2 && <path d="M49 13 L57 9 L55 18 Z" fill={p.light} opacity="0.78" />}
      </g>
    );
  }
  if (variant === 2) {
    return (
      <g opacity={opacity}>
        <path d="M49 47 C55 43 59 37 60 29 C62 39 57 50 49 55 Z" fill={p.accent} />
        {stage >= 1 && <path d="M8 27 C7 21 10 17 16 15 C14 20 15 24 20 28 Z" fill={p.light} opacity="0.68" />}
      </g>
    );
  }
  return (
    <g opacity={opacity}>
      <path d="M30 9 C34 5 39 4 44 7 C40 10 36 14 33 19 Z" fill={p.accent} />
      {stage >= 2 && <path d="M18 51 C23 48 29 49 34 54 C27 54 22 56 18 60 Z" fill={p.light} opacity="0.72" />}
    </g>
  );
}

function SharkBody({ ids, stage, p, fainted }) {
  const fierce = stage >= 1;
  return (
    <>
      <path d="M7 38 C6 29 12 22 25 19 C39 16 52 22 60 31 C54 40 41 45 25 45 C15 45 9 42 7 38 Z" fill={p.outline} opacity="0.76" />
      <path d="M8 34 C14 25 26 20 40 21 C50 21 58 26 62 32 C56 38 47 41 37 42 C24 43 13 40 8 34 Z" fill={`url(#${ids}-body)`} />
      <path d="M10 34 L1 27 L5 40 Z" fill={p.dark} />
      <path d="M30 20 L36 7 L41 21 Z" fill={p.dark} />
      <path d="M30 42 L37 54 L43 41 Z" fill={p.dark} opacity="0.92" />
      <CellShade d="M33 25 C43 25 53 28 59 32 C52 36 44 39 33 39 C27 38 23 35 22 32 C24 28 28 26 33 25 Z" color={p.light} opacity="0.62" />
      <AnimeEyes x1={44} x2={53} y={28} fierce={fierce} fainted={fainted} ink={p.ink} accent={p.accent} />
      <path d="M48 35 C51 36 55 36 59 34.5" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" />
      {stage >= 1 && <path d="M18 25 C13 20 11 15 13 10 C19 12 23 16 25 22 Z" fill={p.accent} opacity="0.9" />}
      {stage >= 2 && <path d="M40 20 C46 10 53 7 60 10 C55 15 49 20 42 24 Z" fill={p.accent} opacity="0.9" />}
    </>
  );
}

function WhaleBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M5 39 C6 24 18 16 34 17 C48 18 58 26 60 38 C52 47 37 50 22 48 C12 47 6 44 5 39 Z" fill={p.outline} opacity="0.66" />
      <path d="M7 36 C9 25 20 19 35 20 C48 20 57 27 58 37 C50 43 37 46 24 44 C14 43 8 40 7 36 Z" fill={`url(#${ids}-body)`} />
      <path d="M9 34 C5 29 4 23 8 18 C13 22 15 27 15 34 Z" fill={p.dark} opacity="0.88" />
      <path d="M50 34 C58 29 62 23 62 15 C55 18 49 23 45 31 Z" fill={p.dark} opacity="0.86" />
      <path d="M28 19 C25 10 28 5 34 2 C35 10 33 16 30 20 Z" fill={p.accent} opacity="0.78" />
      <CellShade d="M19 35 C29 40 42 39 52 35 C48 42 36 44 24 42 C17 41 12 38 10 35 C13 35 16 35 19 35 Z" color={p.light} opacity="0.64" />
      <AnimeEyes x1={35} x2={47} y={28} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={43} y={36} ink={p.ink} fainted={fainted} />
      {stage >= 2 && <path d="M16 23 C13 16 16 10 23 7 C23 15 21 20 17 25 Z" fill={p.accent} opacity="0.82" />}
    </>
  );
}

function FoxBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M14 43 C12 30 20 18 32 17 C45 16 52 27 49 41 C46 52 36 57 26 54 C18 52 14 48 14 43 Z" fill={p.outline} opacity="0.68" />
      <path d="M17 41 C15 30 21 22 32 20 C42 19 48 28 46 39 C44 48 36 52 28 50 C22 49 18 46 17 41 Z" fill={`url(#${ids}-body)`} />
      <path d="M21 21 L14 7 L28 15 Z" fill={p.dark} />
      <path d="M39 21 L48 7 L49 24 Z" fill={p.dark} />
      <path d="M45 39 C56 36 60 27 58 18 C53 27 48 32 41 34 Z" fill={p.dark} />
      <path d="M48 36 C55 33 57 28 56 23 C53 29 49 32 44 34 Z" fill={p.accent} opacity="0.74" />
      <ellipse cx="31.5" cy="40" rx="10.5" ry="7.3" fill={p.light} opacity="0.66" />
      <AnimeEyes x1={26} x2={38} y={29} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={32} y={37} ink={p.ink} fang={stage >= 1} fainted={fainted} />
      <StageCrest stage={stage} accent={p.accent} dark={p.dark} />
    </>
  );
}

function CatBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M16 44 C13 32 20 20 32 18 C44 17 51 27 49 40 C47 51 38 56 28 54 C20 53 17 49 16 44 Z" fill={p.outline} opacity="0.67" />
      <path d="M19 41 C17 31 22 23 32 21 C41 20 47 28 45 39 C43 47 36 51 29 50 C23 49 20 46 19 41 Z" fill={`url(#${ids}-body)`} />
      <path d="M21 22 L18 8 L30 17 Z" fill={p.dark} />
      <path d="M41 22 L47 9 L49 24 Z" fill={p.dark} />
      <path d="M45 38 C55 34 57 25 53 18 C52 28 48 32 42 34 Z" fill={p.dark} />
      <path d="M21 43 C16 45 12 49 10 55 C17 54 22 51 26 46 Z" fill={p.accent} opacity="0.78" />
      <ellipse cx="32" cy="40" rx="9.4" ry="6.8" fill={p.light} opacity="0.62" />
      <AnimeEyes x1={27} x2={38} y={29} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={32} y={37} ink={p.ink} fang={stage >= 2} fainted={fainted} />
      {stage >= 1 && <path d="M31 17 C30 10 33 5 38 3 C38 10 36 15 33 19 Z" fill={p.accent} />}
    </>
  );
}

function StagBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M15 45 C13 32 20 21 32 19 C45 18 52 29 49 42 C47 52 38 57 28 55 C20 54 16 50 15 45 Z" fill={p.outline} opacity="0.66" />
      <path d="M18 42 C16 32 22 24 32 22 C42 21 48 30 46 40 C44 48 36 52 29 51 C23 50 19 47 18 42 Z" fill={`url(#${ids}-body)`} />
      <path d="M24 22 C16 16 12 10 12 3 C18 7 22 11 26 17 C29 11 34 6 40 4 C39 12 36 18 31 23 Z" fill={p.dark} />
      <path d="M41 23 C45 15 51 10 59 8 C57 16 52 22 46 27 Z" fill={p.dark} />
      <path d="M17 38 C10 36 5 30 4 22 C12 24 18 29 21 36 Z" fill={p.accent} opacity="0.78" />
      <ellipse cx="31.5" cy="41" rx="9.5" ry="7" fill={p.light} opacity="0.62" />
      <AnimeEyes x1={27} x2={39} y={30} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={33} y={38} ink={p.ink} fainted={fainted} />
      {stage >= 2 && <path d="M32 19 C31 10 35 4 42 1 C42 10 38 16 34 22 Z" fill={p.accent} opacity="0.84" />}
    </>
  );
}

function BugBody({ ids, stage, p, fainted }) {
  return (
    <>
      <ellipse cx="17" cy="29" rx="10" ry="16" fill={p.light} opacity="0.44" transform="rotate(-22 17 29)" />
      <ellipse cx="47" cy="29" rx="10" ry="16" fill={p.light} opacity="0.44" transform="rotate(22 47 29)" />
      <path d="M17 44 C15 31 22 20 33 19 C44 19 50 30 48 43 C46 53 38 57 29 55 C21 53 17 49 17 44 Z" fill={p.outline} opacity="0.65" />
      <path d="M20 41 C18 31 23 23 33 22 C42 22 47 31 45 41 C43 49 36 52 30 51 C24 50 21 47 20 41 Z" fill={`url(#${ids}-body)`} />
      <path d="M27 21 C20 15 16 10 15 4 C23 4 29 10 32 19 Z" fill={p.accent} />
      <path d="M37 21 C43 15 49 10 55 6 C56 14 49 20 40 23 Z" fill={p.accent} />
      <path d="M20 39 C14 40 9 44 7 51 C14 50 20 47 24 43 Z" fill={p.dark} opacity="0.76" />
      <path d="M44 39 C51 40 56 44 58 51 C50 50 45 47 41 43 Z" fill={p.dark} opacity="0.76" />
      <AnimeEyes x1={27} x2={39} y={30} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={33} y={38} ink={p.ink} fang={stage >= 1} fainted={fainted} />
      {stage >= 2 && <ellipse cx="32" cy="13" rx="9" ry="3.2" fill={p.accent} opacity="0.72" />}
    </>
  );
}

function WolfBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M11 43 C10 30 19 20 32 18 C46 17 54 28 51 42 C49 52 39 57 28 55 C18 53 12 49 11 43 Z" fill={p.outline} opacity="0.7" />
      <path d="M15 40 C13 30 21 23 32 21 C43 20 49 29 47 39 C45 47 37 51 29 50 C22 49 16 46 15 40 Z" fill={`url(#${ids}-body)`} />
      <path d="M19 22 L13 6 L29 16 Z" fill={p.dark} />
      <path d="M40 21 L50 6 L50 25 Z" fill={p.dark} />
      <path d="M13 39 C8 35 5 29 6 22 C12 27 16 31 20 35 Z" fill={p.accent} opacity="0.76" />
      <path d="M45 38 C57 37 62 29 60 19 C55 27 50 32 43 34 Z" fill={p.dark} />
      <path d="M26 21 C30 25 35 25 39 21 C38 28 35 31 32 32 C28 30 26 27 26 21 Z" fill={p.light} opacity="0.38" />
      <AnimeEyes x1={27} x2={39} y={29} fierce fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={33} y={37} ink={p.ink} fang fainted={fainted} />
      {stage >= 1 && <path d="M31 18 C29 10 33 5 39 2 C39 10 36 16 33 20 Z" fill={p.accent} opacity="0.88" />}
      {stage >= 2 && <path d="M48 33 C54 29 58 23 59 15 C62 25 56 35 48 39 Z" fill={p.accent} opacity="0.74" />}
    </>
  );
}

function MechBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M14 44 L12 26 L23 14 L42 14 L53 26 L51 44 L40 55 L25 55 Z" fill={p.outline} opacity="0.72" />
      <path d="M17 42 L16 28 L24 18 L40 18 L48 28 L47 42 L38 51 L27 51 Z" fill={`url(#${ids}-body)`} />
      <path d="M24 16 L30 5 L36 16 Z" fill={p.accent} />
      <path d="M40 18 L50 11 L50 25 Z" fill={p.dark} />
      <path d="M16 27 L6 21 L9 36 Z" fill={p.dark} />
      <path d="M22 24 L42 24 L45 30 L19 30 Z" fill={p.light} opacity="0.45" />
      <rect x="24" y="27" width="7" height="6" rx="2.5" fill="#E8FFFC" />
      <rect x="36" y="27" width="7" height="6" rx="2.5" fill="#E8FFFC" />
      {fainted ? (
        <AnimeEyes x1={27.5} x2={39.5} y={30} fainted ink={p.ink} accent={p.accent} />
      ) : (
        <>
          <ellipse cx="27.5" cy="30" rx="2.1" ry="2.5" fill={p.ink} />
          <ellipse cx="39.5" cy="30" rx="2.1" ry="2.5" fill={p.ink} />
        </>
      )}
      <path d="M27 39 L39 39" stroke={p.ink} strokeWidth="2" strokeLinecap="round" />
      {stage >= 2 && <path d="M46 36 C55 34 60 27 61 18 C54 22 49 28 45 35 Z" fill={p.accent} opacity="0.76" />}
    </>
  );
}

function DragonBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M12 41 C10 27 18 14 31 13 C45 12 54 23 52 38 C50 50 39 57 27 55 C18 53 13 49 12 41 Z" fill={p.outline} opacity="0.72" />
      <path d="M15 39 C14 27 20 17 31 16 C42 15 49 24 48 37 C47 48 38 53 28 52 C20 51 15 46 15 39 Z" fill={`url(#${ids}-body)`} />
      <path d="M21 19 L16 5 L28 14 Z" fill={p.accent} />
      <path d="M40 18 L47 4 L49 20 Z" fill={p.accent} />
      <path d="M44 38 C54 36 60 29 62 20 C63 32 56 44 46 47 Z" fill={p.dark} />
      <path d="M13 32 C7 30 3 24 3 17 C11 18 16 24 19 32 Z" fill={p.dark} opacity="0.86" />
      <path d="M44 31 C53 27 59 21 61 13 C52 14 45 20 41 29 Z" fill={p.dark} opacity="0.86" />
      <ellipse cx="31.5" cy="39" rx="10.5" ry="8.1" fill={p.light} opacity="0.62" />
      <AnimeEyes x1={27} x2={39} y={26} fierce={stage >= 1} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={34} y={35} ink={p.ink} fang fainted={fainted} />
      {stage >= 2 && <path d="M28 15 C30 8 35 3 42 1 C41 9 37 14 31 18 Z" fill={p.dark} opacity="0.86" />}
    </>
  );
}

function SpiritBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M15 39 C13 26 21 15 33 15 C46 15 53 27 50 40 C48 50 39 56 31 54 C30 60 25 60 22 54 C17 52 15 47 15 39 Z" fill={p.outline} opacity="0.52" />
      <path d="M18 38 C16 28 22 19 33 19 C44 19 50 29 47 39 C45 47 38 51 31 49 C30 54 26 54 24 49 C20 48 18 44 18 38 Z" fill={`url(#${ids}-body)`} opacity="0.92" />
      <path d="M15 31 C8 28 5 21 8 14 C16 17 20 23 21 31 Z" fill={p.dark} opacity="0.78" />
      <path d="M47 31 C55 28 59 20 56 13 C49 16 44 23 43 31 Z" fill={p.dark} opacity="0.78" />
      <ellipse cx="32" cy="39" rx="10" ry="7" fill={p.light} opacity="0.38" />
      <AnimeEyes x1={27} x2={39} y={30} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={33} y={39} ink={p.ink} fang={stage >= 1} fainted={fainted} />
      {stage >= 2 && <path d="M34 15 C40 7 48 5 56 8 C49 13 43 18 36 21 Z" fill={p.accent} opacity="0.86" />}
    </>
  );
}

function GolemBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M13 45 L11 28 L21 15 L33 11 L45 16 L54 29 L51 45 L40 56 L25 56 Z" fill={p.outline} opacity="0.76" />
      <path d="M17 42 L16 29 L24 19 L33 16 L42 20 L49 30 L47 42 L38 51 L27 51 Z" fill={`url(#${ids}-body)`} />
      <path d="M21 18 L27 8 L34 16 L29 24 Z" fill={p.dark} opacity="0.9" />
      <path d="M42 20 L52 13 L50 27 Z" fill={p.dark} opacity="0.88" />
      <path d="M16 30 L6 25 L8 39 Z" fill={p.dark} opacity="0.86" />
      <path d="M22 35 C28 39 37 39 43 35 C41 43 35 47 29 46 C24 45 21 41 22 35 Z" fill={p.light} opacity="0.45" />
      <AnimeEyes x1={27} x2={39} y={29} fierce={stage >= 1} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={33} y={39} ink={p.ink} fang={stage >= 2} fainted={fainted} />
      {stage >= 2 && <path d="M32 15 L38 3 L44 15 L38 24 Z" fill={p.accent} opacity="0.84" />}
    </>
  );
}

function BirdBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M17 41 C14 29 21 18 33 17 C46 16 53 28 49 41 C46 51 36 56 27 53 C21 51 18 47 17 41 Z" fill={p.outline} opacity="0.66" />
      <path d="M20 39 C18 30 23 22 33 20 C43 20 49 29 46 39 C44 47 36 51 29 50 C24 49 20 45 20 39 Z" fill={`url(#${ids}-body)`} />
      <path d="M21 32 C10 29 4 20 4 9 C17 12 26 20 30 32 Z" fill={p.dark} opacity="0.88" />
      <path d="M43 32 C54 28 60 19 60 8 C48 12 39 20 35 32 Z" fill={p.dark} opacity="0.88" />
      <path d="M29 30 L40 32 L30 37 Z" fill="#FFE18A" />
      <path d="M30 17 C27 11 30 5 36 2 C37 9 35 14 32 19 Z" fill={p.accent} opacity="0.9" />
      <AnimeEyes x1={26} x2={36} y={26} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      {stage >= 2 && <ellipse cx="33" cy="9" rx="10" ry="3.2" fill={p.accent} opacity="0.8" />}
    </>
  );
}

function DinoBody({ ids, stage, p, fainted }) {
  const longNeck = stage >= 2;
  return (
    <>
      <path d="M10 44 C10 32 19 24 33 25 C45 26 54 34 55 44 C48 53 33 56 21 53 C14 51 10 48 10 44 Z" fill={p.outline} opacity="0.7" />
      <path d="M13 42 C14 33 22 28 34 29 C44 30 51 36 51 43 C45 49 33 52 23 50 C17 49 13 46 13 42 Z" fill={`url(#${ids}-body)`} />
      <path d={longNeck ? "M40 28 C43 17 50 10 57 9 C61 10 62 15 59 18 C53 20 49 25 48 34 Z" : "M37 28 C41 21 47 18 52 20 C55 22 55 27 51 30 C47 31 43 31 39 30 Z"} fill={`url(#${ids}-body)`} />
      <path d="M12 39 C6 35 4 29 6 22 C13 25 18 31 20 38 Z" fill={p.dark} opacity="0.82" />
      <path d="M21 29 C23 20 28 14 35 12 C35 19 32 25 28 30 Z" fill={p.dark} />
      <path d="M31 29 C34 20 40 15 47 15 C46 23 42 28 36 31 Z" fill={p.dark} />
      <path d="M42 34 C48 29 54 27 60 30 C56 35 50 38 44 39 Z" fill={p.accent} opacity="0.78" />
      <path d="M25 48 L21 58 M39 48 L44 58" stroke={p.dark} strokeWidth="5.2" strokeLinecap="round" />
      <ellipse cx="32" cy="40" rx="12" ry="7.4" fill={p.light} opacity="0.52" />
      <AnimeEyes x1={longNeck ? 51 : 42} x2={longNeck ? 58 : 50} y={longNeck ? 15 : 25} fierce={stage >= 1} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={longNeck ? 55 : 47} y={longNeck ? 22 : 32} ink={p.ink} fang={stage >= 2} fainted={fainted} />
      {stage >= 1 && <path d="M30 15 C33 10 38 8 44 9 C41 14 36 17 30 18 Z" fill={p.accent} opacity="0.9" />}
    </>
  );
}

function FrogBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M13 43 C12 31 20 22 32 21 C45 20 53 30 51 43 C49 53 39 58 28 56 C19 55 14 50 13 43 Z" fill={p.outline} opacity="0.66" />
      <path d="M16 41 C15 32 22 26 32 25 C42 24 49 32 48 41 C46 49 38 53 29 52 C22 51 17 47 16 41 Z" fill={`url(#${ids}-body)`} />
      <ellipse cx="24" cy="24" rx="8" ry="7.2" fill={`url(#${ids}-body)`} />
      <ellipse cx="41" cy="24" rx="8" ry="7.2" fill={`url(#${ids}-body)`} />
      <path d="M17 42 C9 43 4 49 3 57 C12 57 18 53 22 47 Z" fill={p.dark} opacity="0.82" />
      <path d="M47 42 C55 43 60 49 61 57 C52 57 46 53 42 47 Z" fill={p.dark} opacity="0.82" />
      <ellipse cx="32" cy="42" rx="11" ry="8" fill={p.light} opacity="0.64" />
      <ellipse cx="32" cy="36" rx={stage >= 2 ? 8.5 : 5.8} ry={stage >= 2 ? 7 : 4.8} fill={p.accent} opacity="0.52" />
      <AnimeEyes x1={24} x2={41} y={24} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <path d="M25 38 C30 42 36 42 41 38" stroke={p.ink} strokeWidth="1.9" fill="none" strokeLinecap="round" />
      {stage >= 1 && <path d="M18 25 C11 21 8 15 10 8 C17 11 21 17 22 24 Z" fill={p.accent} opacity="0.76" />}
      {stage >= 2 && <path d="M43 22 C50 15 57 13 63 16 C58 21 52 26 44 28 Z" fill={p.accent} opacity="0.78" />}
      {stage >= 2 && <circle cx="32" cy="17" r="4.2" fill={p.light} opacity="0.76" />}
    </>
  );
}

function RamBody({ ids, stage, p, fainted }) {
  return (
    <>
      <path d="M12 42 C10 30 19 20 33 20 C47 20 55 31 52 43 C49 53 37 57 25 54 C17 52 13 48 12 42 Z" fill={p.outline} opacity="0.66" />
      <path d="M16 40 C14 31 22 24 33 24 C44 24 50 32 48 41 C46 49 37 52 27 50 C20 49 16 46 16 40 Z" fill={`url(#${ids}-body)`} />
      <circle cx="22" cy="31" r="8.6" fill={p.light} opacity="0.82" />
      <circle cx="32" cy="27" r="9.5" fill={p.light} opacity="0.82" />
      <circle cx="43" cy="31" r="8.6" fill={p.light} opacity="0.82" />
      <path d="M20 25 C12 20 11 10 19 6 C16 14 18 19 25 21 Z" fill={p.dark} />
      <path d="M43 25 C52 20 53 10 45 6 C48 14 46 19 39 21 Z" fill={p.dark} />
      <path d="M16 39 C8 36 5 29 7 20 C14 26 19 31 22 38 Z" fill={p.accent} opacity="0.72" />
      <path d="M43 41 C51 38 57 32 60 24 C61 34 55 44 46 48 Z" fill={p.dark} opacity="0.78" />
      <path d="M24 48 L21 58 M39 48 L42 58" stroke={p.dark} strokeWidth="5" strokeLinecap="round" />
      <AnimeEyes x1={27} x2={38} y={32} fierce={stage >= 2} fainted={fainted} ink={p.ink} accent={p.accent} />
      <AnimeMouth x={33} y={40} ink={p.ink} fang={stage >= 2} fainted={fainted} />
      {stage >= 1 && <path d="M28 18 C30 10 36 5 44 4 C43 12 38 18 31 21 Z" fill={p.accent} opacity="0.86" />}
      {stage >= 2 && <path d="M9 31 C5 24 7 17 13 12 C12 21 15 27 21 32 Z" fill={p.accent} opacity="0.68" />}
    </>
  );
}

const BODY_RENDERERS = {
  shark: SharkBody,
  fox: FoxBody,
  cat: CatBody,
  stag: StagBody,
  bug: BugBody,
  wolf: WolfBody,
  mech: MechBody,
  whale: WhaleBody,
  dragon: DragonBody,
  spirit: SpiritBody,
  golem: GolemBody,
  bird: BirdBody,
  dino: DinoBody,
  frog: FrogBody,
  ram: RamBody,
};

function AnimeMonsterFigure({ concept, stageIndex, fainted = false }) {
  const stage = clampStage(stageIndex);
  const archetype = inferAnimeMonsterArchetype(concept);
  const p = getAnimeMonsterPalette(concept, stage);
  const seed = `${concept?.lineId || concept?.id || concept?.name || "monster"}-${archetype}-${stage}`;
  const ids = useSpriteIds(seed);
  const Body = BODY_RENDERERS[archetype] || BODY_RENDERERS[FALLBACK_CONCEPT.archetype];
  const scale = [0.82, 0.94, 1.08][stage];
  const yShift = [7, 3, -1][stage];
  const variant = lineVariant(concept);

  return (
    <>
      <defs>
        <linearGradient id={`${ids}-body`} x1="18" y1="8" x2="49" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={shadeHex(p.light, 18)} />
          <stop offset="48%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
        <radialGradient id={`${ids}-aura`} cx="50%" cy="48%" r="54%">
          <stop offset="0%" stopColor={shadeHex(p.glow, 64)} stopOpacity="0.58" />
          <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r={stage >= 2 ? 29 : 24} fill={`url(#${ids}-aura)`} opacity={stage >= 2 ? 0.72 : 0.5} />
      <TypeAura color={p.glow} accent={p.accent} stage={stage} />
      <g transform={`translate(${32 - 32 * scale} ${yShift + 32 - 32 * scale}) scale(${scale})`}>
        <VariantDetails stage={stage} p={p} variant={variant} />
        <Body ids={ids} stage={stage} p={p} fainted={fainted} />
      </g>
    </>
  );
}

export function AnimeMonsterSprite({ concept = FALLBACK_CONCEPT, stageIndex = 0, w = 64, flipped = false, hurt = false, fainted = false, title }) {
  const stage = clampStage(stageIndex);
  const palette = getAnimeMonsterPalette(concept, stage);
  const name = title || concept?.stages?.[stage]?.name || concept?.name || FALLBACK_CONCEPT.name;
  const transform = `${flipped ? "scaleX(-1)" : ""} ${fainted ? "rotate(-13deg) translateY(6px)" : ""}`.trim() || undefined;

  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 64 64"
      role="img"
      aria-label={name}
      style={{
        display: "inline-block",
        overflow: "visible",
        transform,
        transformOrigin: "50% 58%",
        opacity: fainted ? 0.46 : 1,
        filter: hurt
          ? "brightness(2.15) saturate(0.35) drop-shadow(0 0 12px #ff4d5f)"
          : `drop-shadow(0 9px 14px rgba(0,0,0,.34)) drop-shadow(0 0 16px ${palette.glow}66)`,
        transition: "filter 120ms ease, opacity 140ms ease, transform 160ms ease",
      }}
    >
      <title>{name}</title>
      <AnimeMonsterFigure concept={concept} stageIndex={stage} fainted={fainted} />
    </svg>
  );
}

export function createAnimeMonsterSprite(concept = FALLBACK_CONCEPT, stageIndex = 0) {
  const fixedConcept = concept || FALLBACK_CONCEPT;
  const fixedStage = clampStage(stageIndex);

  return function CreatedAnimeMonsterSprite(props) {
    return <AnimeMonsterSprite concept={fixedConcept} stageIndex={fixedStage} {...props} />;
  };
}

export default createAnimeMonsterSprite;
