import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import LoginScreen from "./LoginScreen.jsx";
import TeacherDashboard from "./TeacherDashboard.jsx";
import { loadProgress, saveProgress, supabase } from "./supabase.js";
import { CATCH_MON_LINES, EGG_DROP, PARTNER_UNLOCK_STARS, getCatchLineById, getCatchStage, rollEggRarity, rollMonsterFromLine } from "./catchMons.jsx";
import { getMonsterAsset } from "./monsterAssets.js";
import { startBGM, stopBGM, sfxCorrect, sfxWrong, sfxHitEnemy, sfxHitPlayer, sfxVictory, sfxReward, sfxDefeat, sfxBattleStart, sfxHatch, sfxEvolveStart, sfxEvolveDone, setMuted, isMuted } from "./audio.js";
import { BOOK_SERIES, getUnitInfo, getWordsForUnit, getSubStages } from "./wordData.js";
import {
  createDefaultHatcherySlots,
  createEgg,
  syncHatcherySlots,
  getEggRarityMeta,
  getHatchDurationMs,
  getSlotMeta,
  canSlotHatchEgg,
  getNextLockedSlot,
  reduceRunningEggTime,
  migrateMonsterCollection,
  migrateEggState,
  getOwnedMonsterIds,
  mergeOwnedIdsIntoCollection,
  awardCaughtMonster,
  getMonsterStageMeta,
  getEvolutionRequirement,
  getLineResourceState,
  applyLineResourceState,
  normalizeCollectionLineResources,
  isLineFullyEvolved,
  getDexProgress,
} from "./monsterMeta.js";

// ─────────────────────────────────────────────────────────────────
//  PLAYER MONSTERS — face RIGHT naturally (no flip needed)
//  Cute, round, big eyes. Original designs.
// 🖊️  INK LINE
// 🖊️  INK LINE
// INKLET ??pudgy ink ghost, big glossy eyes, tiny quill horn (faces right)
// Legacy partner sprites/EVO_LINES removed after migration to catchMons.jsx.
// Hidden boss and enemy sprites remain in this file because they are still live.
const LexivoreSprite = ({ w=88, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 8px 18px #6622CC88)"}}>
    <rect x="2"  y="16" width="44" height="26" fill="#120022"/>
    <rect x="4"  y="14" width="40" height="28" fill="#1A0033"/>
    <rect x="8"  y="8"  width="32" height="14" fill="#220044"/>
    <rect x="6"  y="10" width="36" height="12" fill="#330066"/>
    <rect x="10" y="2"  width="5"  height="8"  fill="#5522AA"/>
    <rect x="20" y="0"  width="8"  height="10" fill="#8844EE"/>
    <rect x="33" y="2"  width="5"  height="8"  fill="#5522AA"/>
    <rect x="10" y="24" width="4"  height="4"  fill="#4466FF" opacity="0.45"/>
    <rect x="18" y="28" width="4"  height="4"  fill="#00CC88" opacity="0.45"/>
    <rect x="26" y="24" width="4"  height="4"  fill="#FFBB44" opacity="0.45"/>
    <rect x="34" y="28" width="4"  height="4"  fill="#CC88FF" opacity="0.45"/>
    <rect x="8"  y="12" width="9"  height="8"  fill="#5500AA"/>
    <rect x="9"  y="13" width="7"  height="6"  fill="#8833CC"/>
    <rect x="10" y="14" width="3"  height="4"  fill="#F4E8FF"/>
    <rect x="20" y="11" width="10" height="9"  fill="#7700CC"/>
    <rect x="21" y="12" width="8"  height="7"  fill="#AA44EE"/>
    <rect x="23" y="13" width="4"  height="5"  fill="#FFFFFF"/>
    <rect x="31" y="12" width="9"  height="8"  fill="#5500AA"/>
    <rect x="32" y="13" width="7"  height="6"  fill="#8833CC"/>
    <rect x="34" y="14" width="3"  height="4"  fill="#F4E8FF"/>
    <rect x="12" y="20" width="24" height="5"  fill="#000000"/>
    <rect x="14" y="19" width="4"  height="3"  fill="#5522AA" opacity="0.65"/>
    <rect x="22" y="19" width="4"  height="3"  fill="#8844EE" opacity="0.65"/>
    <rect x="30" y="19" width="4"  height="3"  fill="#5522AA" opacity="0.65"/>
    <rect x="10" y="42" width="8"  height="4"  fill="#1A0033"/>
    <rect x="22" y="44" width="6"  height="2"  fill="#220044"/>
    <rect x="30" y="42" width="8"  height="4"  fill="#1A0033"/>
  </svg>
);

const HIDDEN_MON = {
  id:"lexivore", name:"LEXIVORE", Sprite:LexivoreSprite, type:"VOID", typeClr:"#BB66FF",
  color:"#9944EE", glow:"#BB66FF", hp:180, atk:35, def:22, evoLv:null,
  desc:"Devourer of forgotten words.\nUnlocked at 30 stars. Truly legendary.",
  unlockStars: 30,
};

const ForgexSprite = ({ w=80, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 4px 10px #BB224488)"}}>
    <rect x="6"  y="14" width="36" height="24" fill="#FFDDCC"/>
    <rect x="4"  y="16" width="40" height="20" fill="#FFE8D8"/>
    <rect x="4"  y="22" width="40" height="7"  fill="#EE9988"/>
    <rect x="6"  y="15" width="12" height="9"  fill="#880000"/>
    <rect x="20" y="15" width="10" height="9"  fill="#880000"/>
    <rect x="7"  y="16" width="10" height="7"  fill="#CC0000"/>
    <rect x="21" y="16" width="8"  height="7"  fill="#CC0000"/>
    <rect x="8"  y="18" width="4"  height="3"  fill="#1A0000"/>
    <rect x="22" y="18" width="3"  height="3"  fill="#1A0000"/>
    <rect x="10" y="31" width="22" height="4"  fill="#EECCBB"/>
    <rect x="8"  y="37" width="10" height="7"  fill="#FFDDCC"/>
    <rect x="28" y="37" width="10" height="7"  fill="#FFDDCC"/>
  </svg>
);

const BlankusSprite = ({ w=80, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 4px 10px #88888866)"}}>
    <rect x="8"  y="6"  width="32" height="38" fill="#F4F2EC"/>
    <rect x="6"  y="8"  width="36" height="34" fill="#F4F2EC"/>
    <rect x="6"  y="8"  width="8"  height="8"  fill="#E0DED8"/>
    <rect x="8"  y="12" width="10" height="9"  fill="#222"/>
    <rect x="20" y="12" width="9"  height="9"  fill="#222"/>
    <rect x="9"  y="13" width="8"  height="7"  fill="#000"/>
    <rect x="21" y="13" width="7"  height="7"  fill="#000"/>
    <rect x="12" y="24" width="18" height="3"  fill="#E4E0D8"/>
    <rect x="12" y="42" width="10" height="5"  fill="#EAE8E2"/>
    <rect x="26" y="42" width="10" height="5"  fill="#EAE8E2"/>
  </svg>
);

const ConfuzorSprite = ({ w=80, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 4px 10px #CC660044)"}}>
    <rect x="6"  y="12" width="36" height="30" fill="#AA5522"/>
    <rect x="4"  y="14" width="40" height="26" fill="#CC6633"/>
    <rect x="8"  y="18" width="5"  height="7"  fill="#FFBB44" opacity="0.7"/>
    <rect x="16" y="16" width="7"  height="5"  fill="#FFCC66" opacity="0.6"/>
    <rect x="28" y="18" width="5"  height="7"  fill="#FFBB44" opacity="0.7"/>
    <rect x="6"  y="13" width="12" height="10" fill="#FF7700"/>
    <rect x="20" y="13" width="10" height="10" fill="#FF7700"/>
    <rect x="7"  y="14" width="10" height="8"  fill="#FF9900"/>
    <rect x="21" y="14" width="8"  height="8"  fill="#FF9900"/>
    <rect x="8"  y="16" width="4"  height="4"  fill="#1A0500"/>
    <rect x="22" y="16" width="3"  height="4"  fill="#1A0500"/>
    <rect x="8"  y="30" width="28" height="5"  fill="#882200"/>
    <rect x="8"  y="40" width="8"  height="8"  fill="#AA5522"/>
    <rect x="28" y="40" width="8"  height="8"  fill="#AA5522"/>
  </svg>
);

const NullvoidSprite = ({ w=88, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 8px 20px #33006699)"}}>
    <rect x="4"  y="18" width="40" height="28" fill="#110033"/>
    <rect x="2"  y="20" width="44" height="24" fill="#1A0044"/>
    <rect x="8"  y="10" width="32" height="12" fill="#1A0044"/>
    <rect x="6"  y="12" width="36" height="10" fill="#220055"/>
    <rect x="8"  y="0"  width="32" height="14" fill="#1A0044"/>
    <rect x="6"  y="2"  width="36" height="12" fill="#220055"/>
    <rect x="6"  y="4"  width="10" height="8"  fill="#5500AA"/>
    <rect x="18" y="3"  width="10" height="9"  fill="#7700CC"/>
    <rect x="30" y="4"  width="10" height="8"  fill="#5500AA"/>
    <rect x="8"  y="6"  width="4"  height="4"  fill="#CC88FF"/>
    <rect x="21" y="5"  width="4"  height="5"  fill="#FFFFFF"/>
    <rect x="32" y="6"  width="4"  height="4"  fill="#CC88FF"/>
    <rect x="8"  y="11" width="28" height="5"  fill="#000000"/>
    <rect x="10" y="44" width="8"  height="4"  fill="#1A0044"/>
    <rect x="30" y="44" width="8"  height="4"  fill="#1A0044"/>
  </svg>
);

const DIFFICULTY_MODES = [
  { key:"easy",   label:"EASY",   color:"#F5C842", icon:"🌟", timerSec:null },
  { key:"normal", label:"NORMAL", color:"#4488FF", icon:"📘", timerSec:null },
  { key:"hard",   label:"HARD",   color:"#FF4444", icon:"🔥", timerSec:30   },
  { key:"hell",   label:"HELL",   color:"#AA44FF", icon:"💀", timerSec:10   },
];

const ENEMIES = [
  { id:"forgex",   name:"FORGEX",   Sprite:ForgexSprite,   type:"ERASE", typeClr:"#CC4444", color:"#FF4444", hp:70,  atk:8,  def:4,  bgKey:"plains",  artUrl:"/enemies/forgex.png" },
  { id:"blankus",  name:"BLANKUS",  Sprite:BlankusSprite,  type:"BLANK", typeClr:"#888888", color:"#AAAAAA", hp:95,  atk:11, def:7,  bgKey:"library", artUrl:"/enemies/blankus.png" },
  { id:"confuzor", name:"CONFUZOR", Sprite:ConfuzorSprite, type:"CHAOS", typeClr:"#CC7700", color:"#FF9900", hp:125, atk:15, def:10, bgKey:"cave",    artUrl:"/enemies/confuzor.png" },
  { id:"nullvoid", name:"NULLVOID", Sprite:NullvoidSprite, type:"VOID",  typeClr:"#7700CC", color:"#9944FF", hp:160, atk:18, def:12, bgKey:"void",    artUrl:"/enemies/nullvoid.png", boss:true },
];

const ENEMY_TRAITS = {
  forgex: {
    icon:"🧨",
    title:"실수 증폭",
    short:"오답 피해가 커집니다",
    desc:"오답을 먹고 공격력이 올라갑니다. 같은 세션에서 두 번 틀리면 더 거칠어집니다.",
    phase2Text:"FORGEX가 틀린 단어의 흔적을 달궈 2페이즈에 들어갑니다.",
    reward:{ coins:10, lineExp:8 },
    bonusTitle:"실수 복구",
    bonusDesc:"오답 후 다시 흐름을 회복했습니다.",
  },
  blankus: {
    icon:"🕯️",
    title:"기억 삭제",
    short:"힌트를 가립니다",
    desc:"정의와 힌트를 흐리게 만들어 단어 자체 기억을 요구합니다.",
    phase2Text:"BLANKUS가 남은 힌트를 더 짙게 지웁니다.",
    reward:{ coins:12, lineExp:9 },
    bonusTitle:"무힌트 회상",
    bonusDesc:"힌트 없이 3문제 이상 맞혔습니다.",
  },
  confuzor: {
    icon:"🌀",
    title:"혼란 압박",
    short:"시간과 보기를 흔듭니다",
    desc:"콤보가 끊기면 제한 시간이 줄고 보기 순서가 계속 흔들립니다.",
    phase2Text:"CONFUZOR가 보기판을 뒤섞으며 2페이즈에 들어갑니다.",
    reward:{ coins:12, lineExp:10 },
    bonusTitle:"혼란 돌파",
    bonusDesc:"혼란 속에서 3콤보 이상을 만들었습니다.",
  },
  nullvoid: {
    icon:"🌌",
    title:"집중 침식",
    short:"FOCUS를 갉아먹습니다",
    desc:"정답으로 얻는 FOCUS가 줄고, 오답 시 FOCUS가 더 많이 사라집니다.",
    phase2Text:"NULLVOID가 화면을 뒤틀며 보너스 목표를 방해합니다.",
    reward:{ coins:18, lineExp:14 },
    bonusTitle:"공허 관통",
    bonusDesc:"NULLVOID 상대로 FOCUS BURST를 성공시켰습니다.",
  },
};

// ─────────────────────────────────────────────────────────────────
//  UNIT + WORD DATA
// ─────────────────────────────────────────────────────────────────// ─────────────────────────────────────────────────────────────────//  BOOK SERIES + WORD DATA
// Static book/unit/word data moved to src/wordData.js.
const rng       = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const calcDmg   = (atk,def)=>Math.max(4,Math.floor(atk-def*0.4+rng(-3,5)));
const getEnemy  = uid=>ENEMIES[Math.min(Math.floor((uid-1)/3),ENEMIES.length-1)];
const shuffle   = a=>[...a].sort(()=>Math.random()-0.5);
const getOpts   = w=>shuffle(w.opts);
const hpColor   = pct=>pct>50?"#44CC77":pct>25?"#EE9920":"#EE2222";
const ARENA_MAX_TICKETS = 5;
const ARENA_DAILY_FLOOR = 3;
const ARENA_TICKET_REGEN_MS = 60 * 60 * 1000;

function recoverArenaTickets(tickets = ARENA_DAILY_FLOOR, updatedAt = Date.now(), now = Date.now()) {
  const safeTickets = Math.max(0, Math.min(ARENA_MAX_TICKETS, Number(tickets) || 0));
  const safeUpdatedAt = Number(updatedAt) || now;
  if (safeTickets >= ARENA_MAX_TICKETS) return { tickets: safeTickets, updatedAt: now };
  const gained = Math.floor(Math.max(0, now - safeUpdatedAt) / ARENA_TICKET_REGEN_MS);
  if (gained <= 0) return { tickets: safeTickets, updatedAt: safeUpdatedAt };
  const nextTickets = Math.min(ARENA_MAX_TICKETS, safeTickets + gained);
  const nextUpdatedAt = nextTickets >= ARENA_MAX_TICKETS
    ? now
    : safeUpdatedAt + gained * ARENA_TICKET_REGEN_MS;
  return { tickets: nextTickets, updatedAt: nextUpdatedAt };
}

// star unlock thresholds for each first-stage mon
const MON_UNLOCK_STARS = PARTNER_UNLOCK_STARS;
const EVO_UNLOCK_STARS = { 0:0, 1:4, 2:12 }; // stage index ??stars needed to evolve (plus lv)

// Battle backgrounds
const BG_PLAINS = (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
    <rect width="320" height="200" fill="#4A8ADE"/>
    <rect x="20" y="18" width="60" height="16" rx="8" fill="#fff" opacity="0.85"/>
    <rect x="10" y="22" width="30" height="12" rx="6" fill="#fff" opacity="0.85"/>
    <rect x="180" y="24" width="80" height="16" rx="8" fill="#fff" opacity="0.75"/>
    <rect x="250" y="22" width="30" height="14" rx="7" fill="#fff" opacity="0.75"/>
    <ellipse cx="80"  cy="130" rx="80"  ry="40" fill="#4A9A40"/>
    <ellipse cx="230" cy="135" rx="100" ry="45" fill="#3A8A30"/>
    <rect y="140" width="320" height="60" fill="#4AA830"/>
    <rect y="148" width="320" height="52" fill="#3A9820"/>
  </svg>
);
const BG_LIBRARY = (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
    <rect width="320" height="200" fill="#2A1A10"/>
    {[0,40,80,120,160,200,240,280].map(x=>(
      <g key={x}>
        <rect x={x+2} y="0" width="34" height="140" fill={["#3A1A08","#2A1408","#442010"][Math.floor(x/40)%3]}/>
        <rect x={x+4} y="10" width="6" height="120" fill="#DDBB88" opacity="0.15"/>
        <rect x={x+12} y="20" width="6" height="100" fill="#CCAA77" opacity="0.12"/>
        <rect x={x+20} y="15" width="6" height="110" fill="#DDBB88" opacity="0.1"/>
      </g>
    ))}
    <rect y="138" width="320" height="62" fill="#1A0E08"/>
    <rect y="142" width="320" height="58" fill="#221408"/>
    <rect y="138" width="320" height="5"  fill="#AA7744" opacity="0.5"/>
  </svg>
);
const BG_CAVE = (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
    <rect width="320" height="200" fill="#1A1020"/>
    {[10,40,80,130,170,210,255,290].map((x,i)=>(
      <polygon key={x} points={`${x},0 ${x+14},0 ${x+7},${30+i%3*18}`} fill={i%2===0?"#2A1A30":"#221628"}/>
    ))}
    <polygon points="50,80 58,100 42,100"  fill="#4400AA" opacity="0.7"/>
    <polygon points="200,60 210,85 190,85" fill="#0044AA" opacity="0.7"/>
    <rect y="145" width="320" height="55" fill="#2A1A2A"/>
    <rect y="149" width="320" height="51" fill="#221422"/>
  </svg>
);
const BG_VOID = (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
    <rect width="320" height="200" fill="#06040E"/>
    {[[15,10],[45,25],[90,8],[140,18],[200,5],[250,22],[300,12],[30,45],[80,38],[160,42],[220,35],[280,48]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width={i%3===0?2:1} height={i%3===0?2:1} fill="#fff" opacity={0.3+i%5*0.14}/>
    ))}
    <rect y="138" width="320" height="62" fill="#08040E"/>
    <rect y="140" width="320" height="60" fill="#0A0618"/>
    <rect y="138" width="320" height="3"  fill="#3300AA" opacity="0.5"/>
  </svg>
);
const BG_MAP = {plains:BG_PLAINS, library:BG_LIBRARY, cave:BG_CAVE, void:BG_VOID};

// ─────────────────────────────────────────────────────────────────
//  CSS
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{width:100%;height:100%;overflow:hidden;}
  html{-webkit-text-size-adjust:100%;text-size-adjust:100%;}
  img,svg,canvas{max-width:100%;}
  button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

  :root{
    --bg:#0C0A18;
    --panel:#16122A;
    --rim:#2A2440;
    --f-pk:'Press Start 2P',monospace;
    --f-ui:'Nunito',sans-serif;
    --fs-xs:clamp(10px,2.5vmin,12px);
    --fs-sm:clamp(12px,3.2vmin,15px);
    --fs-md:clamp(15px,4vmin,18px);
    --fs-lg:clamp(19px,5vmin,25px);
    --fs-xl:clamp(26px,7vmin,36px);
  }

  .page{width:100%;height:100dvh;min-height:0;overflow:hidden;display:flex;flex-direction:column;background:var(--bg);}
  .page-y{width:100%;height:100dvh;min-height:0;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;background:var(--bg);}
  @supports not (height:100dvh){
    .page,.page-y{height:100vh;}
  }
  .slide-up{animation:slideUp .22s ease;}

  .monster-preview{
    min-height:100vh;
    padding:clamp(16px,3vw,32px);
    color:#F8F0D2;
    background:
      radial-gradient(circle at 12% 8%,rgba(84,202,255,.28) 0,transparent 25%),
      radial-gradient(circle at 86% 14%,rgba(255,198,64,.24) 0,transparent 26%),
      radial-gradient(circle at 56% 72%,rgba(58,255,175,.13) 0,transparent 32%),
      linear-gradient(145deg,#07111D 0%,#0A0713 48%,#12080A 100%);
  }
  .monster-preview::before{
    content:"";
    position:fixed;
    inset:0;
    pointer-events:none;
    background-image:
      linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
    background-size:34px 34px;
    mask-image:radial-gradient(circle at 50% 12%,black 0%,transparent 72%);
  }
  .monster-preview__shell{
    position:relative;
    z-index:1;
    width:100%;
    max-width:1440px;
    margin:0 auto;
  }
  .monster-preview__header{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:18px;
    margin-bottom:24px;
    padding:18px clamp(14px,2.5vw,26px);
    border:1px solid rgba(255,255,255,.12);
    border-radius:28px;
    background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.035));
    box-shadow:0 22px 70px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.2);
    backdrop-filter:blur(14px);
  }
  .monster-preview__eyebrow{
    font-family:var(--f-pk);
    font-size:clamp(8px,1.6vw,12px);
    letter-spacing:.08em;
    color:#78E6FF;
    text-shadow:0 0 18px rgba(120,230,255,.45);
  }
  .monster-preview__title{
    margin-top:10px;
    font-family:var(--f-pk);
    font-size:clamp(24px,5vw,54px);
    line-height:1.14;
    color:#FFF6CD;
    text-shadow:0 0 28px rgba(255,204,85,.42),0 10px 34px rgba(0,0,0,.55);
  }
  .monster-preview__subtitle{
    max-width:820px;
    margin-top:12px;
    font-family:var(--f-ui);
    font-size:clamp(14px,2.3vw,19px);
    font-weight:900;
    line-height:1.55;
    color:#BEEBDB;
  }
  .monster-preview__counter{
    min-width:150px;
    padding:16px 14px;
    border-radius:22px;
    border:1px solid rgba(245,200,66,.4);
    background:radial-gradient(circle at 50% 0%,rgba(245,200,66,.28),rgba(12,13,22,.78) 58%);
    color:#FFE8A1;
    font-family:var(--f-pk);
    font-size:clamp(9px,1.6vw,12px);
    line-height:1.8;
    text-align:right;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 16px 36px rgba(0,0,0,.35);
  }
  .monster-preview__counter span{
    font-size:1.55em;
    color:#FFFFFF;
  }
  .signature-showcase{
    position:relative;
    display:grid;
    grid-template-columns:minmax(280px,.76fr) minmax(560px,1.24fr);
    gap:clamp(16px,2.8vw,28px);
    align-items:center;
    margin-bottom:26px;
    padding:clamp(18px,3vw,32px);
    border:2px solid color-mix(in srgb,var(--line) 68%,white 12%);
    border-radius:34px;
    overflow:hidden;
    background:
      radial-gradient(circle at 78% 38%,color-mix(in srgb,var(--line) 48%,transparent) 0%,transparent 38%),
      linear-gradient(132deg,#061724 0%,#101829 52%,#06070C 100%);
    box-shadow:0 32px 90px rgba(0,0,0,.62),0 0 58px color-mix(in srgb,var(--line) 35%,transparent),inset 0 1px 0 rgba(255,255,255,.22);
  }
  .signature-showcase::before{
    content:"";
    position:absolute;
    inset:-35%;
    background:conic-gradient(from 120deg,transparent,color-mix(in srgb,var(--line) 45%,transparent),transparent,rgba(255,255,255,.2),transparent);
    opacity:.22;
    animation:previewSpin 16s linear infinite;
  }
  .signature-showcase__copy,
  .signature-showcase__stages{
    position:relative;
    z-index:1;
  }
  .signature-showcase__name{
    margin-top:12px;
    font-family:var(--f-pk);
    font-size:clamp(26px,5vw,58px);
    line-height:1.14;
    color:#FFF7D7;
    text-shadow:0 0 30px color-mix(in srgb,var(--line) 62%,transparent);
  }
  .signature-showcase__desc{
    margin-top:14px;
    font-family:var(--f-ui);
    font-weight:900;
    font-size:clamp(14px,2.1vw,20px);
    line-height:1.6;
    color:#C9E9F1;
  }
  .signature-showcase__chips{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin-top:18px;
  }
  .signature-showcase__chips span{
    padding:8px 11px;
    border:1px solid color-mix(in srgb,var(--line) 50%,white 20%);
    border-radius:999px;
    background:rgba(0,0,0,.22);
    color:#FFF6CD;
    font-family:var(--f-ui);
    font-size:12px;
    font-weight:900;
  }
  .signature-showcase__stages{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:14px;
    align-items:start;
  }
  .signature-stage-card{
    position:relative;
    min-height:340px;
    padding:14px 10px 16px;
    border-radius:28px;
    border:1px solid color-mix(in srgb,var(--line) 52%,rgba(255,255,255,.2));
    background:
      radial-gradient(circle at 50% 34%,color-mix(in srgb,var(--line) 50%,transparent),transparent 58%),
      linear-gradient(180deg,color-mix(in srgb,var(--line) 30%,#10202C 70%),#08101A 74%,#04070C);
    box-shadow:0 18px 48px rgba(0,0,0,.46),0 0 26px color-mix(in srgb,var(--line) 22%,transparent),inset 0 1px 0 rgba(255,255,255,.2);
    text-align:center;
    display:grid;
    grid-template-rows:auto 360px auto auto;
    align-items:start;
    animation:previewCardIn .46s ease both;
    animation-delay:var(--delay);
  }
  .signature-stage-card,
  .signature-stage-card:nth-child(2),
  .signature-stage-card:nth-child(3){
    min-height:500px;
  }
  .signature-stage-card:nth-child(2){min-height:500px;}
  .signature-stage-card:nth-child(3){min-height:500px;}
  .signature-stage-card__rank{
    display:inline-flex;
    padding:7px 10px;
    border-radius:999px;
    background:#060B12AA;
    color:var(--line);
    font-family:var(--f-pk);
    font-size:8px;
  }
  .signature-stage-card__art{
    height:360px;
    display:flex;
    align-items:end;
    justify-content:center;
    filter:drop-shadow(0 28px 26px rgba(0,0,0,.48));
    animation:floatBob 2.8s ease-in-out infinite;
  }
  .signature-stage-card__art--illustration{height:360px;}
  .concept-monster-art{
    position:relative;
    flex:0 0 auto;
    width:min(100%,220px);
    aspect-ratio:1;
    overflow:hidden;
    border-radius:26px;
  }
  .signature-stage-card:nth-child(1) .concept-monster-art{width:184px;}
  .signature-stage-card:nth-child(2) .concept-monster-art{width:292px;}
  .signature-stage-card:nth-child(3) .concept-monster-art{width:318px;}
  .concept-monster-art img{
    width:100%;
    height:100%;
    object-fit:contain;
    filter:saturate(1.08) contrast(1.03) drop-shadow(0 22px 22px rgba(0,0,0,.44)) drop-shadow(0 0 28px color-mix(in srgb,var(--line) 32%,transparent));
  }
  .signature-stage-card__name,
  .dex-stage-card__name{
    font-family:var(--f-pk);
    line-height:1.35;
    color:#FFF7D7;
    text-shadow:0 0 18px rgba(255,255,255,.15);
  }
  .signature-stage-card__name{font-size:clamp(8px,1.45vw,12px);}
  .signature-stage-card__name{
    position:absolute;
    left:10px;
    right:10px;
    bottom:58px;
  }
  .signature-stage-card__species,
  .dex-stage-card__species{
    margin-top:6px;
    font-family:var(--f-ui);
    font-weight:900;
    line-height:1.25;
    color:#BBE5EA;
  }
  .signature-stage-card__species{font-size:12px;}
  .signature-stage-card__species{
    position:absolute;
    left:10px;
    right:10px;
    bottom:27px;
  }
  .monster-preview__section-title{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:14px;
    margin:4px 4px 16px;
  }
  .monster-preview__section-title span{
    font-family:var(--f-pk);
    font-size:clamp(14px,2.8vw,24px);
    color:#FFE59B;
  }
  .monster-preview__section-title small{
    max-width:440px;
    text-align:right;
    font-family:var(--f-ui);
    font-size:13px;
    font-weight:900;
    color:#9ECBC9;
  }
  .monster-preview__grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(360px,1fr));
    gap:18px;
    padding-bottom:28px;
  }
  .dex-line-card{
    position:relative;
    overflow:hidden;
    border-radius:30px;
    padding:16px;
    border:1px solid color-mix(in srgb,var(--line) 60%,rgba(255,255,255,.16));
    background:
      radial-gradient(circle at 50% 28%,color-mix(in srgb,var(--line) 28%,transparent) 0%,transparent 44%),
      linear-gradient(154deg,color-mix(in srgb,var(--line-bg) 74%,#050712 26%) 0%,#101321 70%,#06070D 100%);
    box-shadow:0 20px 55px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.18);
    animation:previewCardIn .45s ease both;
    animation-delay:var(--stagger);
  }
  .dex-line-card::before{
    content:"";
    position:absolute;
    inset:-1px;
    background:linear-gradient(115deg,transparent 0%,rgba(255,255,255,.18) 36%,transparent 52%);
    transform:translateX(-80%);
    animation:foilSweep 5.5s ease-in-out infinite;
    opacity:.55;
  }
  .dex-line-card::after{
    content:"";
    position:absolute;
    right:-62px;
    top:-54px;
    width:178px;
    height:178px;
    border-radius:50%;
    background:var(--line);
    opacity:.14;
    filter:blur(6px);
  }
  .dex-line-card__top,
  .dex-line-card__stages{
    position:relative;
    z-index:1;
  }
  .dex-line-card__top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    margin-bottom:12px;
  }
  .dex-line-card__type{
    font-family:var(--f-pk);
    font-size:clamp(8px,1.6vw,11px);
    color:var(--line);
    text-shadow:0 0 16px color-mix(in srgb,var(--line) 60%,transparent);
  }
  .dex-line-card__rarity{
    margin-top:5px;
    font-family:var(--f-ui);
    font-size:12px;
    font-weight:900;
    color:#C9C0E9;
  }
  .dex-line-card__number{
    padding:8px 9px;
    border-radius:12px;
    background:rgba(0,0,0,.24);
    color:#FFE78E;
    font-family:var(--f-pk);
    font-size:8px;
    white-space:nowrap;
  }
  .dex-line-card__stages{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:10px;
  }
  .dex-stage-card{
    min-height:244px;
    padding:9px 6px 11px;
    border-radius:22px;
    border:1px solid color-mix(in srgb,var(--line) 34%,rgba(255,255,255,.12));
    background:
      radial-gradient(circle at 50% 30%,color-mix(in srgb,var(--line) 30%,transparent),transparent 62%),
      linear-gradient(180deg,color-mix(in srgb,var(--line) 18%,#101522 82%),#070A12);
    text-align:center;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 12px 24px rgba(0,0,0,.22);
  }
  .dex-stage-card--2{min-height:270px;}
  .dex-stage-card--3{
    min-height:300px;
    background:
      radial-gradient(circle at 50% 30%,color-mix(in srgb,var(--line) 46%,transparent),transparent 64%),
      linear-gradient(180deg,color-mix(in srgb,var(--line) 28%,#121929 72%),#060912);
  }
  .dex-stage-card__plate{
    position:relative;
    height:156px;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .dex-stage-card--2 .dex-stage-card__plate{height:178px;}
  .dex-stage-card--3 .dex-stage-card__plate{height:204px;}
  .dex-stage-card__halo{
    position:absolute;
    left:50%;
    bottom:18px;
    width:92%;
    height:44%;
    border-radius:50%;
    transform:translateX(-50%);
    background:radial-gradient(ellipse at 50% 54%,color-mix(in srgb,var(--line) 58%,transparent) 0%,transparent 68%);
    filter:blur(.2px);
  }
  .dex-stage-card__sprite{
    position:relative;
    z-index:1;
    display:flex;
    align-items:center;
    justify-content:center;
    filter:drop-shadow(0 22px 18px rgba(0,0,0,.44));
    animation:floatBob 2.7s ease-in-out infinite;
  }
  .dex-stage-card__name{
    min-height:34px;
    font-size:clamp(7px,1.35vw,10px);
  }
  .dex-stage-card__meta{
    margin-top:7px;
    font-family:var(--f-pk);
    font-size:7px;
    color:var(--line);
  }
  .dex-stage-card__species{
    font-size:10px;
    color:#C5BDD9;
  }

  .crt::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;
    background:repeating-linear-gradient(to bottom,transparent 0,transparent 2px,rgba(0,0,0,.08) 2px,rgba(0,0,0,.08) 3px);}

  @keyframes floatBob  {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes shake     {0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}60%{transform:translateX(8px)}}
  @keyframes flashW    {0%,100%{filter:none}33%{filter:brightness(6) saturate(0)}}
  @keyframes dmgPop    {0%{opacity:1;transform:translateY(0) scale(1.3)}100%{opacity:0;transform:translateY(-60px) scale(.7)}}
  @keyframes slideUp   {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes pulse     {0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes blink     {0%,49%{opacity:1}50%,100%{opacity:0}}
  @keyframes comboZoom {0%,100%{transform:scale(1)}40%{transform:scale(1.25)}}
  @keyframes starPop   {0%{transform:scale(0) rotate(-30deg);opacity:0}70%{transform:scale(1.3) rotate(5deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
  @keyframes evoFlash  {0%,100%{opacity:1;filter:none}50%{opacity:0;filter:brightness(8)}}
  @keyframes titleGlow {0%,100%{text-shadow:0 0 20px #F5C842,0 0 60px #F5C84244}50%{text-shadow:0 0 30px #F5C842,0 0 80px #F5C842AA}}
  @keyframes wrongShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  @keyframes previewSpin{to{transform:rotate(360deg)}}
  @keyframes previewCardIn{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
  @keyframes foilSweep{0%,52%{transform:translateX(-82%)}70%,100%{transform:translateX(82%)}}

  @media (max-width:900px){
    .monster-preview__header,
    .signature-showcase,
    .monster-preview__section-title{
      grid-template-columns:1fr;
      flex-direction:column;
      align-items:flex-start;
    }
    .signature-showcase{display:block;}
    .signature-showcase__stages{margin-top:18px;}
    .monster-preview__counter,
    .monster-preview__section-title small{text-align:left;}
    .monster-preview__grid{grid-template-columns:1fr;}
  }
  @media (max-width:560px){
    .monster-preview{padding:12px;}
    .signature-showcase__stages,
    .dex-line-card__stages{grid-template-columns:1fr;}
    .signature-stage-card,
    .signature-stage-card:nth-child(2),
    .signature-stage-card:nth-child(3),
    .dex-stage-card,
    .dex-stage-card--2,
    .dex-stage-card--3{min-height:auto;}
    .signature-stage-card__art{height:220px;}
    .dex-stage-card__plate,
    .dex-stage-card--2 .dex-stage-card__plate,
    .dex-stage-card--3 .dex-stage-card__plate{height:190px;}
  }
/* Attack animations */
/* Attack animations */

  /* PLAYER (left 4%, faces right) charges toward enemy (right 5%) */
  @keyframes playerCharge {
    0%   { transform: translateX(0)     translateY(0);    }
    40%  { transform: translateX(55vw)  translateY(-12%); }
    55%  { transform: translateX(53vw)  translateY(-5%);  }
    75%  { transform: translateX(26vw)  translateY(0);    }
    100% { transform: translateX(0)     translateY(0);    }
  }

  /* ENEMY (right 5%, faces left) charges toward player (left 4%) */
  @keyframes enemyCharge {
    0%   { transform: translateX(0)     translateY(0);    }
    40%  { transform: translateX(-55vw) translateY(-12%); }
    55%  { transform: translateX(-53vw) translateY(-5%);  }
    75%  { transform: translateX(-26vw) translateY(0);    }
    100% { transform: translateX(0)     translateY(0);    }
  }

  /* Hit receiver squish */
  @keyframes hitRecoil {
    0%   { transform: scaleX(1)    scaleY(1);    }
    22%  { transform: scaleX(1.45) scaleY(.55);  }
    50%  { transform: scaleX(.82)  scaleY(1.28); }
    72%  { transform: scaleX(1.1)  scaleY(.92);  }
    100% { transform: scaleX(1)    scaleY(1);    }
  }

  /* Screen flash on impact */
  @keyframes screenFlash {
    0%,100%{ opacity:0    }
    18%    { opacity:0.32 }
    42%    { opacity:0    }
  }

  .battle-panel{background:#ECE6D8;border:3px solid #8A7E6E;border-radius:10px;
    box-shadow:inset 0 2px 0 rgba(255,255,255,0.6),3px 3px 0 rgba(0,0,0,0.4);}

  .move-btn{
    font-family:var(--f-ui);font-size:var(--fs-sm);font-weight:800;
    cursor:pointer;border:2px solid transparent;border-radius:10px;
    padding:clamp(11px,2.5vmin,14px) clamp(10px,2.5vw,14px);
    transition:all .1s;text-align:left;
    background:#16122A;color:#E8E0F0;
    box-shadow:0 3px 0 rgba(0,0,0,0.6);
    line-height:1.5;min-height:48px;width:100%;
  }
  .move-btn:hover:not(:disabled){background:#22203A;transform:translateY(-1px);box-shadow:0 4px 0 rgba(0,0,0,0.6);}
  .move-btn:active:not(:disabled){transform:translateY(1px);box-shadow:0 2px 0 rgba(0,0,0,0.6);}
  .move-btn.correct{background:#0A2A14!important;border-color:#44CC77!important;
    box-shadow:0 0 16px rgba(68,204,119,.5),0 3px 0 #001A0A!important;}
  .move-btn.wrong{background:#2A0A0A!important;border-color:#EE2222!important;
    animation:wrongShake .3s ease!important;}
  .move-btn.reveal{background:#0A2A14!important;border-color:#44CC77!important;}
  .move-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}

  .big-btn{font-family:var(--f-ui);font-weight:900;cursor:pointer;border:none;
    border-radius:10px;transition:all .1s;box-shadow:0 4px 0 rgba(0,0,0,0.5);
    letter-spacing:.02em;min-height:48px;}
  .big-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 rgba(0,0,0,0.5);}
  .big-btn:active{transform:translateY(2px);box-shadow:0 2px 0 rgba(0,0,0,0.5);}

  .screen-topbar{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;align-items:center;gap:10px;width:100%;padding:8px;border:1px solid color-mix(in srgb,var(--accent,#F5C842) 38%,#2A2440);border-radius:12px;background:linear-gradient(135deg,rgba(24,20,44,.94),rgba(14,12,26,.88));box-shadow:0 8px 22px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(12px);flex-shrink:0;}
  .screen-topbar__icon{width:46px;height:46px;border-radius:10px;display:grid;place-items:center;background:radial-gradient(circle at 50% 20%,color-mix(in srgb,var(--accent,#F5C842) 30%,transparent),rgba(255,255,255,.04));border:1px solid color-mix(in srgb,var(--accent,#F5C842) 40%,transparent);overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.1);}
  .screen-topbar__copy{min-width:0;}
  .screen-topbar__title{font-family:var(--f-pk);font-size:clamp(11px,2.7vmin,15px);line-height:1.25;color:var(--accent,#F5C842);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .screen-topbar__subtitle{margin-top:3px;font-family:var(--f-ui);font-size:var(--fs-xs);font-weight:900;color:#9B8EBE;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .nav-chip{min-width:46px;height:42px;border:1px solid #3A2A60;border-radius:10px;background:#120E24;color:#E7DCFF;font-family:var(--f-ui);font-size:var(--fs-xs);font-weight:900;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:5px;box-shadow:0 3px 0 rgba(0,0,0,.45);}
  .nav-chip:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--accent,#F5C842) 60%,#3A2A60);}
  .screen-bottom-nav{display:flex;gap:8px;flex-shrink:0;width:100%;}
  .screen-bottom-nav .nav-chip{flex:1;height:48px;}
  .nav-glyph{width:26px;height:26px;display:block;color:var(--accent,#F5C842);filter:drop-shadow(0 8px 12px rgba(0,0,0,.35));}
  .screen-topbar__icon .nav-glyph{width:28px;height:28px;color:var(--accent,#F5C842);}

  .system-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;flex-shrink:0;}
  .system-card{position:relative;min-height:82px;border:none;border-radius:12px;padding:8px;background:linear-gradient(135deg,#16122A,#211A3A);color:#EAE2FF;box-shadow:0 4px 0 #080612;cursor:pointer;overflow:hidden;text-align:left;display:flex;align-items:center;gap:8px;}
  .system-card::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 82% 12%,var(--accent,#F5C842) 0,transparent 38%);opacity:.2;pointer-events:none;}
  .system-card__icon{position:relative;z-index:1;width:46px;height:54px;flex:0 0 46px;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);}
  .system-card__icon::before{content:"";position:absolute;inset:8px;border-radius:50%;background:color-mix(in srgb,var(--accent,#F5C842) 28%,transparent);filter:blur(8px);}
  .system-card__icon .nav-glyph{position:relative;width:28px;height:28px;}
  .system-card__copy{position:relative;z-index:1;min-width:0;display:flex;flex-direction:column;gap:4px;}
  .system-card__label{font-family:var(--f-ui);font-weight:1000;font-size:clamp(12px,2.8vmin,15px);line-height:1.1;color:#fff;}
  .system-card__meta{font-family:var(--f-ui);font-weight:900;font-size:clamp(9px,2.2vmin,11px);line-height:1.2;color:#AFA2CE;}
  .system-card__badge{position:absolute;right:7px;top:6px;z-index:2;font-family:var(--f-pk);font-size:7px;color:#FFE08A;}
  .system-card:hover{transform:translateY(-2px);box-shadow:0 6px 0 #080612;}
  .system-card:active{transform:translateY(1px);box-shadow:0 2px 0 #080612;}

  .launch-panel{position:relative;display:grid;grid-template-columns:1.1fr .9fr;gap:10px;padding:12px;border-radius:16px;background:linear-gradient(135deg,#151128,#231633);border:1px solid #4B3672;box-shadow:0 8px 24px rgba(0,0,0,.32);overflow:hidden;flex-shrink:0;}
  .launch-panel::before{content:"";position:absolute;inset:auto -10% -65% 18%;height:180px;background:radial-gradient(circle,rgba(245,200,66,.22),transparent 64%);pointer-events:none;}
  .launch-copy{position:relative;z-index:1;min-width:0;}
  .launch-eyebrow{font-family:var(--f-pk);font-size:clamp(7px,1.6vmin,9px);color:#78E6FF;margin-bottom:8px;}
  .launch-title{font-family:var(--f-ui);font-weight:1000;font-size:clamp(18px,4.6vmin,28px);line-height:1.08;color:#FFF4C4;}
  .launch-sub{margin-top:6px;font-family:var(--f-ui);font-weight:900;font-size:var(--fs-xs);line-height:1.45;color:#AFA2CE;}
  .launch-stats{position:relative;z-index:1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;}
  .launch-stat{border-radius:12px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);padding:9px;}
  .launch-stat b{display:block;font-family:var(--f-pk);font-size:clamp(11px,2.8vmin,14px);color:#F5C842;line-height:1.2;}
  .launch-stat span{display:block;margin-top:5px;font-family:var(--f-ui);font-size:var(--fs-xs);font-weight:900;color:#8C7AAE;line-height:1.2;}

  .questline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;flex-shrink:0;}
  .quest-card{position:relative;display:block;border:none;border-radius:14px;padding:11px;background:linear-gradient(135deg,#12101E,#1D1730);border:1px solid color-mix(in srgb,var(--accent,#F5C842) 30%,#2A2440);box-shadow:0 4px 0 #080612;cursor:pointer;text-align:left;overflow:hidden;min-height:112px;}
  .quest-card::before{content:"";position:absolute;right:-28px;top:-34px;width:92px;height:92px;border-radius:50%;background:var(--accent,#F5C842);opacity:.13;filter:blur(2px);}
  .quest-card__top{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;}
  .quest-card__icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);}
  .quest-card__step{font-family:var(--f-pk);font-size:clamp(7px,1.6vmin,9px);color:var(--accent,#F5C842);}
  .quest-card__title{position:relative;display:block;margin-top:9px;font-family:var(--f-ui);font-weight:1000;font-size:clamp(13px,3.1vmin,16px);color:#F4EEFF;line-height:1.1;}
  .quest-card__meta{position:relative;display:block;margin-top:4px;font-family:var(--f-ui);font-weight:900;font-size:var(--fs-xs);color:#9B8EBE;line-height:1.25;}
  .quest-card__cta{position:relative;display:block;margin-top:10px;font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-xs);color:var(--accent,#F5C842);}

  @keyframes rewardRise{0%{opacity:0;transform:translateY(16px) scale(.96)}100%{opacity:1;transform:none}}
  @keyframes rewardPulse{0%,100%{box-shadow:0 6px 0 rgba(0,0,0,.45),0 0 0 rgba(245,200,66,0)}50%{box-shadow:0 6px 0 rgba(0,0,0,.45),0 0 22px rgba(245,200,66,.22)}}
  @keyframes rewardSpark{0%{transform:translateY(8px) scale(.6);opacity:0}40%{opacity:1}100%{transform:translateY(-28px) scale(1.1);opacity:0}}
  .result-shell{position:relative;z-index:1;width:100%;max-width:760px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;}
  .reward-panel{position:relative;width:100%;border-radius:18px;padding:14px;background:linear-gradient(135deg,rgba(20,18,34,.94),rgba(35,22,42,.92));border:1px solid rgba(245,200,66,.32);box-shadow:0 10px 30px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.08);overflow:hidden;animation:rewardRise .38s ease both,rewardPulse 2.8s ease-in-out infinite;}
  .reward-panel::before{content:"";position:absolute;inset:-45% -10% auto 45%;height:160px;background:radial-gradient(circle,rgba(245,200,66,.28),transparent 68%);pointer-events:none;}
  .reward-spark{position:absolute;color:#FFE99A;font-family:var(--f-pk);font-size:9px;animation:rewardSpark 1.4s ease-in-out infinite;pointer-events:none;}
  .reward-title{position:relative;display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;font-family:var(--f-pk);font-size:clamp(9px,2.1vmin,12px);color:#FFE08A;}
  .reward-title span:last-child{font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-xs);color:#9FE9FF;}
  .reward-grid{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;}
  .reward-chip{min-height:76px;border-radius:13px;padding:10px;background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.09);display:flex;flex-direction:column;justify-content:space-between;text-align:left;}
  .reward-chip strong{font-family:var(--f-pk);font-size:clamp(12px,3.1vmin,18px);line-height:1;color:var(--accent,#F5C842);text-shadow:0 0 16px color-mix(in srgb,var(--accent,#F5C842) 45%,transparent);}
  .reward-chip span{font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-xs);color:#B8ACC8;}
  .reward-chip small{font-family:var(--f-ui);font-weight:900;font-size:10px;color:#736486;line-height:1.25;}
  .battle-bonus-result{position:relative;margin-top:10px;border-radius:12px;padding:10px 11px;background:rgba(8,7,18,.72);border:1px solid #302846;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:9px;text-align:left;}
  .battle-bonus-result.complete{border-color:#F5C84288;background:linear-gradient(135deg,rgba(245,200,66,.16),rgba(10,8,20,.76));}
  .battle-bonus-result.enemy{border-color:#78E6FF66;background:linear-gradient(135deg,rgba(120,230,255,.13),rgba(10,8,20,.76));}
  .battle-bonus-result.enemy.complete{border-color:#78E6FFAA;box-shadow:0 0 18px rgba(120,230,255,.16);}
  .battle-bonus-result > span{font-size:15px;line-height:1;}
  .battle-bonus-result div{min-width:0;}
  .battle-bonus-result b{display:block;font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-xs);color:#F5F0FF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .battle-bonus-result div span{display:block;margin-top:2px;font-family:var(--f-ui);font-weight:900;font-size:10px;color:#9E91B8;line-height:1.35;}
  .battle-bonus-result em{font-style:normal;font-family:var(--f-pk);font-size:8px;color:#FFE08A;white-space:nowrap;}
  .result-goal-panel{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:9px;}
  .result-goal-card{border-radius:14px;padding:12px;background:rgba(10,8,20,.72);border:1px solid #2F244A;text-align:left;}
  .result-goal-card b{display:block;font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-sm);color:#F3ECFF;line-height:1.15;}
  .result-goal-card p{margin:5px 0 0;font-family:var(--f-ui);font-weight:900;font-size:var(--fs-xs);line-height:1.4;color:#9C90B4;}
  .mission-mini-list{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
  .mission-mini{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;padding:7px 8px;border-radius:9px;background:#111022;border:1px solid #2A2440;}
  .mission-mini.done{background:#082414;border-color:#2B8A4A66;}
  .mission-mini label{min-width:0;font-family:var(--f-ui);font-weight:900;font-size:var(--fs-xs);color:#CFC4E6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .mission-mini.done label{color:#7FFFA8;text-decoration:line-through;}
  .mission-mini em{font-style:normal;font-family:var(--f-pk);font-size:clamp(8px,2vmin,10px);color:#70647E;white-space:nowrap;}
  .result-next-card{width:100%;border-radius:16px;padding:12px;background:linear-gradient(135deg,rgba(18,48,38,.92),rgba(18,18,34,.92));border:1px solid rgba(120,230,255,.28);text-align:left;}
  .result-next-card b{display:block;font-family:var(--f-pk);font-size:clamp(9px,2.2vmin,12px);color:#78E6FF;margin-bottom:5px;}
  .result-next-card span{font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-sm);line-height:1.35;color:#F7F3FF;}
  .battle-system-strip{display:grid;grid-template-columns:1fr minmax(150px,.72fr);gap:8px;flex-shrink:0;}
  .battle-objective-card,.focus-burst-btn{position:relative;min-height:54px;border-radius:12px;padding:9px 10px;overflow:hidden;text-align:left;}
  .enemy-trait-card{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:9px;align-items:center;min-height:48px;border-radius:12px;padding:8px 10px;background:linear-gradient(135deg,rgba(16,18,34,.96),rgba(18,10,28,.92));border:1px solid color-mix(in srgb,var(--enemy,#78E6FF) 46%,#2A2440);box-shadow:0 4px 0 rgba(0,0,0,.35);overflow:hidden;flex-shrink:0;}
  .enemy-trait-card::before{content:"";position:absolute;right:-34px;top:-40px;width:108px;height:108px;border-radius:50%;background:var(--enemy,#78E6FF);opacity:.12;filter:blur(3px);}
  .enemy-trait-card.phase2{border-color:#FF4F7AAA;background:linear-gradient(135deg,rgba(44,8,28,.96),rgba(16,10,30,.92));animation:rewardPulse 1.9s ease-in-out infinite;}
  .enemy-trait-card > span{position:relative;font-size:clamp(17px,4.4vmin,22px);line-height:1;}
  .enemy-trait-card b{position:relative;display:block;font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-xs);line-height:1.12;color:#F7F0FF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .enemy-trait-card small{position:relative;display:block;margin-top:2px;font-family:var(--f-ui);font-weight:900;font-size:10px;line-height:1.2;color:#9E91B8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .enemy-trait-card em{position:relative;font-style:normal;font-family:var(--f-pk);font-size:8px;color:var(--enemy,#78E6FF);white-space:nowrap;}
  .enemy-skill-banner{position:absolute;left:50%;top:44px;z-index:12;transform:translateX(-50%);width:min(520px,88%);border-radius:14px;padding:9px 12px;background:linear-gradient(135deg,rgba(8,6,18,.92),rgba(24,8,34,.9));border:1px solid color-mix(in srgb,var(--enemy,#78E6FF) 55%,#2A2440);box-shadow:0 16px 36px rgba(0,0,0,.36),0 0 24px color-mix(in srgb,var(--enemy,#78E6FF) 24%,transparent);display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px;align-items:center;animation:feedbackIn .22s ease both;}
  .enemy-skill-banner span{font-size:22px;line-height:1;}
  .enemy-skill-banner b{display:block;font-family:var(--f-pk);font-size:clamp(8px,2vmin,11px);color:var(--enemy,#78E6FF);line-height:1.25;}
  .enemy-skill-banner small{display:block;margin-top:2px;font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-xs);line-height:1.25;color:#F4EEFF;}
  .enemy-art{display:block;object-fit:contain;filter:drop-shadow(0 18px 22px rgba(0,0,0,.55));}
  .enemy-art.phase2{filter:drop-shadow(0 20px 24px rgba(0,0,0,.58)) drop-shadow(0 0 24px rgba(255,62,118,.35));}
  .enemy-aura{position:absolute;inset:12% -8% -6% -8%;z-index:-1;border-radius:50%;background:radial-gradient(circle,var(--enemy,#78E6FF),transparent 62%);opacity:.2;filter:blur(10px);transform:scale(.95);}
  .battle-objective-card{background:linear-gradient(135deg,#111226,#1A1426);border:1px solid #342B4A;}
  .battle-objective-card::before{content:"";position:absolute;right:-24px;top:-28px;width:80px;height:80px;border-radius:50%;background:#F5C842;opacity:.1;}
  .battle-objective-card b{position:relative;display:block;font-family:var(--f-ui);font-weight:1000;font-size:var(--fs-xs);color:#F7F0FF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .battle-objective-card span{position:relative;display:block;margin-top:4px;font-family:var(--f-ui);font-weight:900;font-size:10px;line-height:1.2;color:#8F83AA;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .focus-burst-btn{border:1px solid #2E3A50;background:linear-gradient(135deg,#0C1222,#12172B);color:#DCE9FF;cursor:pointer;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;box-shadow:0 3px 0 rgba(0,0,0,.45);}
  .focus-burst-btn:disabled{cursor:not-allowed;opacity:.72;}
  .focus-burst-btn.ready{border-color:#78E6FF;background:linear-gradient(135deg,#072638,#14304A);box-shadow:0 4px 0 rgba(0,0,0,.45),0 0 18px rgba(120,230,255,.25);animation:rewardPulse 2.1s ease-in-out infinite;}
  .focus-burst-btn b{display:block;font-family:var(--f-pk);font-size:clamp(8px,1.9vmin,10px);color:#78E6FF;line-height:1.2;}
  .focus-burst-btn span{display:block;margin-top:4px;font-family:var(--f-ui);font-weight:900;font-size:10px;color:#8FA3C8;line-height:1.2;}
  .focus-burst-btn strong{font-family:var(--f-pk);font-size:clamp(10px,2.6vmin,13px);color:#F5C842;line-height:1;}
  .focus-meter{position:absolute;left:0;right:0;bottom:0;height:4px;background:#182238;}
  .focus-meter i{display:block;height:100%;background:linear-gradient(90deg,#78E6FF,#F5C842);transition:width .28s ease;border-radius:0 99px 99px 0;}

  /* VOC-101/102: interactive cards */
  .card-btn{transition:transform .12s,box-shadow .12s,background .12s;outline:none;}
  .card-btn:hover:not([aria-disabled="true"]){transform:translateY(-2px);box-shadow:0 6px 0 rgba(0,0,0,.5)!important;}
  .card-btn:active:not([aria-disabled="true"]){transform:translateY(1px);box-shadow:0 2px 0 rgba(0,0,0,.5)!important;}
  .card-btn:focus-visible{outline:2px solid #7755FF;outline-offset:2px;}

  /* VOC-105: feedback overlay */
  @keyframes feedbackIn{0%{opacity:0;transform:translateY(10px) scale(.9)}60%{transform:translateY(-4px) scale(1.05)}100%{opacity:1;transform:none}}
  @keyframes feedbackOut{to{opacity:0;transform:scale(.8)}}

  /* VOC-103: step bar */
  .step-bar{display:flex;align-items:center;gap:4px;padding:6px 12px;
    background:#0E0C1A;border-bottom:1px solid #1E1A2E;flex-shrink:0;overflow-x:auto;}
  .step-bar::-webkit-scrollbar{display:none;}

  /* VOC-106: toast */
  @keyframes toastIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  @keyframes toastOut{to{opacity:0;transform:translateY(20px)}}
  @keyframes mysteryPulse{0%,100%{filter:brightness(0) drop-shadow(0 0 4px #5500BB);opacity:.7}50%{filter:brightness(0) drop-shadow(0 0 12px #9933FF);opacity:1}}
  @keyframes mysteryShimmer{0%,100%{box-shadow:inset 0 0 12px #1A0040,0 0 0 1px #2A1A44}50%{box-shadow:inset 0 0 18px #2A0060,0 0 8px #5500AA44,0 0 0 1px #5500AA66}}

  .star-filled{color:#F5C842;text-shadow:0 0 8px #F5C84288;animation:starPop .3s ease;}
  .star-empty{color:#2A2440;}

  @media(max-width:420px){
    :root{--fs-xs:11px;--fs-sm:13px;--fs-md:15px;--fs-lg:19px;--fs-xl:27px;}
    .move-btn{font-size:13px!important;padding:11px 10px!important;}
    .screen-topbar{grid-template-columns:auto auto minmax(0,1fr);gap:8px;}
    .screen-topbar .nav-chip:last-child{display:none;}
    .screen-topbar__icon{width:40px;height:40px;}
    .system-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
    .system-card{min-height:76px;}
    .launch-panel{grid-template-columns:1fr;}
    .launch-stats{grid-template-columns:repeat(2,minmax(0,1fr));}
    .questline{grid-template-columns:1fr;}
    .quest-card{min-height:94px;}
    .reward-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
    .result-goal-panel{grid-template-columns:1fr;}
    .battle-system-strip{grid-template-columns:1fr;}
    .enemy-trait-card{grid-template-columns:auto minmax(0,1fr);min-height:42px;padding:7px 9px;}
    .enemy-trait-card em{display:none;}
    .enemy-skill-banner{top:38px;width:92%;padding:8px 10px;}
  }
  @media(max-height:700px){
    .nav-chip{height:38px;min-height:38px;font-size:11px;}
    .screen-bottom-nav .nav-chip{height:42px;}
    .screen-topbar{padding:6px;gap:7px;}
    .screen-topbar__icon{width:38px;height:38px;}
    .system-card{min-height:68px;}
    .battle-system-strip{grid-template-columns:1fr 1fr;}
    .battle-objective-card,.focus-burst-btn{min-height:42px;padding:7px 8px;}
    .battle-objective-card span,.focus-burst-btn > span > span{display:none;}
    .enemy-trait-card{min-height:36px;padding:6px 8px;}
    .enemy-trait-card small{display:none;}
    .battle-question-card{padding:8px 10px!important;}
    .battle-question-card [data-testid="battle-question-prompt"]{line-height:1.35!important;}
    .move-btn{min-height:40px!important;padding:8px!important;line-height:1.25!important;}
    .battle-log{display:none;}
    .battle-flee-btn{display:none;}
  }
  @media(max-width:360px){
    .nav-chip{min-width:40px;font-size:10px;}
    .screen-bottom-nav{gap:6px;}
  }
  @media(max-height:480px) and (min-width:600px){
    .battle-options-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;}
    .battle-options-grid .move-btn{font-size:11px!important;}
  }
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#3A2A50;border-radius:2px;}
`;

const NAV_ICON = { dex:"dex", eggs:"eggs", arena:"arena", revenge:"revenge", ranking:"ranking", shop:"shop", partner:"partner", book:"book" };

function NavIcon({ name }) {
  const common = { className:"nav-glyph", viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:1.9, strokeLinecap:"round", strokeLinejoin:"round", "aria-hidden":"true" };
  if (name === "eggs") return <svg {...common}><path d="M12 3c4 3.2 6.2 7.2 6.2 11.1A6.2 6.2 0 0 1 12 20.3a6.2 6.2 0 0 1-6.2-6.2C5.8 10.2 8 6.2 12 3Z"/><path d="M8.4 14.2c1.1.7 2.2.7 3.3 0 1.1-.7 2.2-.7 3.3 0"/></svg>;
  if (name === "arena") return <svg {...common}><path d="m14.5 5 4.5 4.5-9.8 9.8-4.5.7.7-4.5L14.5 5Z"/><path d="m13 6.5 4.5 4.5"/><path d="M5 5l4 4"/><path d="M7 3l4 4"/></svg>;
  if (name === "revenge") return <svg {...common}><path d="M12 3 4.5 6v5.6c0 4.5 3.1 7.8 7.5 9.4 4.4-1.6 7.5-4.9 7.5-9.4V6L12 3Z"/><path d="m9 12 2 2 4-5"/></svg>;
  if (name === "ranking") return <svg {...common}><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5.5a2 2 0 0 0 0 4H8"/><path d="M16 6h2.5a2 2 0 0 1 0 4H16"/><path d="M12 12v4"/><path d="M8.5 20h7"/><path d="M10 16h4"/></svg>;
  if (name === "shop") return <svg {...common}><path d="M6.5 9h11l-.8 10H7.3L6.5 9Z"/><path d="M9 9a3 3 0 0 1 6 0"/><path d="M8 13h8"/><path d="M10 16h4"/></svg>;
  if (name === "partner") return <svg {...common}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/><path d="M17.5 5.5 20 3"/><path d="M6.5 5.5 4 3"/></svg>;
  if (name === "book") return <svg {...common}><path d="M5 4.5h7a3 3 0 0 1 3 3V20a3 3 0 0 0-3-3H5V4.5Z"/><path d="M19 4.5h-4a3 3 0 0 0-3 3"/><path d="M19 4.5V17h-4"/></svg>;
  return <svg {...common}><path d="M5 5.5h6v13H5z"/><path d="M13 5.5h6v13h-6z"/><path d="M8 9h.01"/><path d="M16 9h.01"/><path d="M8 13h.01"/><path d="M16 13h.01"/></svg>;
}

function ScreenTopBar({ title, subtitle, icon, accent = "#F5C842", onBack, onHome, meta }) {
  return (
    <div className="screen-topbar" style={{ "--accent": accent }}>
      <button className="nav-chip" onClick={onBack} aria-label="뒤로가기">← 뒤로</button>
      <span className="screen-topbar__icon" aria-hidden="true">{icon ? <NavIcon name={icon} /> : null}</span>
      <div className="screen-topbar__copy">
        <div className="screen-topbar__title">{title}</div>
        {subtitle && <div className="screen-topbar__subtitle">{subtitle}</div>}
      </div>
      {meta || <button className="nav-chip" onClick={onHome} aria-label="홈으로">홈</button>}
    </div>
  );
}

function ScreenBottomNav({ onBack, onHome, backLabel = "뒤로", homeLabel = "홈" }) {
  return (
    <div className="screen-bottom-nav">
      <button className="nav-chip" onClick={onBack}>← {backLabel}</button>
      <button className="nav-chip" onClick={onHome}>{homeLabel}</button>
    </div>
  );
}

function SystemCard({ label, meta, badge, icon, accent, onClick, testId }) {
  return (
    <button data-testid={testId} className="system-card" onClick={onClick} style={{ "--accent": accent }}>
      {badge && <span className="system-card__badge">{badge}</span>}
      <span className="system-card__icon" aria-hidden="true"><NavIcon name={icon} /></span>
      <span className="system-card__copy">
        <span className="system-card__label">{label}</span>
        <span className="system-card__meta">{meta}</span>
      </span>
    </button>
  );
}

function QuestCard({ step, title, meta, cta, icon, accent, onClick }) {
  return (
    <button className="quest-card" onClick={onClick} style={{ "--accent": accent }}>
      <span className="quest-card__top">
        <span className="quest-card__icon" aria-hidden="true"><NavIcon name={icon} /></span>
        <span className="quest-card__step">{step}</span>
      </span>
      <span className="quest-card__title">{title}</span>
      <span className="quest-card__meta">{meta}</span>
      <span className="quest-card__cta">{cta}</span>
    </button>
  );
}

// HP bar
function HPBar({cur,max}) {
  const pct=Math.max(0,(cur/max)*100);
  const c=hpColor(pct);
  return (
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",color:"#555",minWidth:18}}>HP</span>
      <div style={{flex:1,height:8,background:"#B8B0A0",borderRadius:4,overflow:"hidden",
        border:"1.5px solid #888",boxShadow:"inset 0 1px 2px rgba(0,0,0,.4)"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(180deg,${c}CC,${c})`,
          borderRadius:3,transition:"width .4s ease",boxShadow:"inset 0 1px 0 rgba(255,255,255,.4)"}}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  TUTORIAL OVERLAY
const TUTORIAL_STEPS = [
  { emoji:"📚", title:"첫 목표는 한 유닛 클리어", body:"단어를 맞히고 전투를 끝내면 보상과 성장 재료를 얻습니다.\n짧게 한 판만 해도 진행률이 남아요." },
  { emoji:"🥚", title:"보상은 알과 몬스터로 이어집니다", body:"받은 알은 부화기에 올리세요.\n부화 시간이 끝나면 새 몬스터나 진화 재료를 얻습니다." },
  { emoji:"🧠", title:"틀린 단어는 복습 노트로", body:"실수한 단어는 사라지지 않고 복습 전투로 돌아옵니다.\n맞히면 코인과 경험치를 다시 챙길 수 있어요." },
  { emoji:"🏆", title:"오늘의 루프만 따라가면 됩니다", body:"학습하기, 알 확인하기, 도감 보기.\n타이틀의 세 카드가 매일 다음 행동을 알려줍니다.", last:true },
];

function TutorialOverlay({ step, onNext, onSkip }) {
  if (step < 1 || step > TUTORIAL_STEPS.length) return null;
  const s = TUTORIAL_STEPS[step - 1];
  return (
    <div data-testid="tutorial-overlay" style={{
      position:"fixed",inset:0,zIndex:9999,
      background:"rgba(0,0,0,0.82)",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:"24px"
    }}>
      <div style={{
        background:"linear-gradient(135deg,#1C182E,#2A2044)",
        border:"2px solid #7755FF",
        borderRadius:20,
        padding:"32px 24px 24px",
        maxWidth:340,width:"100%",
        textAlign:"center",
        boxShadow:"0 0 40px rgba(119,85,255,0.4)"
      }}>
        <div style={{fontSize:"clamp(40px,10vmin,56px)",marginBottom:12}}>{s.emoji}</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(13px,3.5vmin,16px)",color:"#EEE8FF",marginBottom:10,lineHeight:1.4,whiteSpace:"pre-line"}}>
          {s.title}
        </div>
        <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(11px,2.8vmin,13px)",color:"#9988CC",lineHeight:1.6,whiteSpace:"pre-line",marginBottom:24}}>
          {s.body}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          {!s.last && (
            <button data-testid="tutorial-skip-button" onClick={onSkip} style={{
              fontFamily:"var(--f-pk)",fontSize:"clamp(10px,2.5vmin,12px)",
              background:"transparent",border:"1px solid #3A3060",color:"#6655AA",
              padding:"8px 16px",borderRadius:10,cursor:"pointer"
            }}>건너뛰기</button>
          )}
          <button data-testid="tutorial-next-button" onClick={onNext} style={{
            fontFamily:"var(--f-pk)",fontSize:"clamp(12px,3vmin,14px)",
            background:"linear-gradient(135deg,#7755FF,#AA44EE)",
            border:"none",color:"#fff",padding:"10px 28px",borderRadius:12,
            cursor:"pointer",boxShadow:"0 4px 0 #3311AA",fontWeight:700
          }}>{s.last ? "시작하기!" : `다음 (${step}/${TUTORIAL_STEPS.length})`}</button>
        </div>
      </div>
    </div>
  );
}

// Nameplate (Pokemon DS style)
function Nameplate({name,typeName,typeClr,hp,maxHp,lv,isEnemy=false}) {
  return (
    <div style={{background:"#F5F0E8",border:"3px solid #A09888",borderRadius:8,
      padding:"6px 10px 8px",boxShadow:"3px 3px 0 rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.8)",
      minWidth:148,maxWidth:210,fontFamily:"var(--f-pk)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,gap:4}}>
        <span style={{fontSize:"clamp(9px,2.4vmin,11px)",color:"#1A1A1A",letterSpacing:.3,lineHeight:1.3}}>{name}</span>
        <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
          {lv!==undefined&&<span style={{fontSize:"clamp(8px,2vmin,10px)",color:"#555"}}>Lv{lv}</span>}
          <span style={{fontSize:"clamp(7px,1.8vmin,9px)",background:typeClr,color:"#fff",
            padding:"2px 5px",borderRadius:4,fontWeight:900}}>{typeName}</span>
        </div>
      </div>
      <HPBar cur={hp} max={maxHp}/>
      {!isEnemy&&<div style={{textAlign:"right",fontSize:"clamp(8px,2vmin,10px)",color:"#666",marginTop:3}}>{hp}/{maxHp}</div>}
    </div>
  );
}

function EnemyVisual({ enemy, w = 88, hurt = false, phase2 = false }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const Sprite = enemy?.Sprite;
  const size = enemy?.boss ? Math.round(w * 1.18) : w;
  if (enemy?.artUrl && !imgFailed) {
    return (
      <img
        className={`enemy-art ${phase2 ? "phase2" : ""}`}
        src={enemy.artUrl}
        alt=""
        draggable={false}
        onError={() => setImgFailed(true)}
        style={{
          width: size,
          height: size,
          opacity: hurt ? .72 : 1,
          transform: phase2 ? "scale(1.06)" : "none",
        }}
      />
    );
  }
  return Sprite ? <Sprite w={size} hurt={hurt}/> : null;
}

// Stars display
function Stars({count,max=3,size="md",color="#F5C842"}) {
  const sz=size==="sm"?"clamp(12px,3vmin,16px)":"clamp(16px,4vmin,22px)";
  return (
    <div style={{display:"flex",gap:2}}>
      {[...Array(max)].map((_,i)=>(
        <span key={i} style={{fontSize:sz,color:i<count?color:undefined,textShadow:i<count?`0 0 8px ${color}88`:undefined}} className={i<count?"star-filled":"star-empty"}>★</span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  VOC-103: STEP BAR
function StepBar({steps, current}) {
  return (
    <div className="step-bar">
      {steps.map((s, i) => {
        const active = i === current;
        const done   = i < current;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{width:12,height:1,background:done?"#7755FF":"#2A2440",flexShrink:0}}/>
            )}
            <div style={{
              fontFamily:"var(--f-pk)",
              fontSize:"clamp(6px,1.4vmin,8px)",
              padding:"3px 8px",
              borderRadius:20,
              whiteSpace:"nowrap",
              flexShrink:0,
              background:active?"#7755FF":done?"#2A1A44":"transparent",
              color:active?"#fff":done?"#9977CC":"#3A3060",
              border:active?"1px solid #9977FF":"1px solid transparent",
            }}>{s}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  VOC-105: FEEDBACK OVERLAY
function FeedbackOverlay({feedback}) {
  if(!feedback) return null;
  const isCorrect = feedback.type === "correct";
  return (
    <div style={{
      position:"absolute",left:0,right:0,top:"50%",transform:"translateY(-50%)",
      zIndex:50,pointerEvents:"none",textAlign:"center",
    }}>
      <div style={{
        display:"inline-block",
        padding:"10px 22px",
        borderRadius:16,
        background:isCorrect?"rgba(10,42,20,.96)":"rgba(42,10,10,.96)",
        border:`2px solid ${isCorrect?"#44CC77":"#EE4444"}`,
        boxShadow:`0 0 24px ${isCorrect?"rgba(68,204,119,.5)":"rgba(238,68,68,.5)"}`,
        fontFamily:"var(--f-ui)",
        fontWeight:900,
        fontSize:"clamp(15px,3.8vmin,20px)",
        color:isCorrect?"#44FF88":"#FF6666",
        animation:"feedbackIn .25s ease forwards",
        letterSpacing:.5,
      }}>
        {feedback.msg}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  VOC-106: TOAST
function Toast({msg, onDone}) {
  useEffect(()=>{
    const t = setTimeout(onDone, 2200);
    return ()=>clearTimeout(t);
  },[]);
  return (
    <div style={{
      position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",
      zIndex:9000,
      background:"#1C182E",
      border:"1px solid #44CC77",
      color:"#44FF88",
      fontFamily:"var(--f-ui)",fontWeight:800,
      fontSize:"clamp(12px,3vmin,14px)",
      padding:"10px 22px",
      borderRadius:30,
      boxShadow:"0 4px 24px rgba(68,204,119,.3)",
      animation:"toastIn .25s ease",
      whiteSpace:"nowrap",
    }}>
      {msg}
    </div>
  );
}

const sumStars = (unitStars = {}) => Object.values(unitStars).reduce((a, b) => a + (Number(b) || 0), 0);
const ownedCount = (collection = {}) => Object.values(collection).filter((entry) => entry?.owned).length;

function calcBattlePower(data = {}) {
  const dex = getDexProgress(data.monsterCollection || {});
  return Math.max(1,
    (data.monLv || 1) * 18 +
    sumStars(data.unitStars) * 6 +
    dex.completedLines * 90 +
    ownedCount(data.monsterCollection) * 12 +
    (data.battleBoost || 0) +
    (data.arenaWins || 0) * 20
  );
}

function getStoryChapter({ totalStars, dexCompleted, arenaWins }) {
  const chapters = [
    {
      id: 1,
      title: "1장. 사라진 단어 코어",
      goal: "별 6개를 모아 첫 단어 코어를 되찾기",
      done: totalStars >= 6,
      reward: "+80G",
    },
    {
      id: 2,
      title: "2장. 반 친구들의 아레나",
      goal: "아레나에서 친구에게 1번 승리하기",
      done: arenaWins >= 1,
      reward: "배틀 티켓 +1",
    },
    {
      id: 3,
      title: "3장. 진화 라인 각성",
      goal: "도감 라인 1개를 최종 진화까지 완성하기",
      done: dexCompleted >= 1,
      reward: "+150G",
    },
    {
      id: 4,
      title: "4장. 배틀왕 예선",
      goal: "아레나 5승 달성하기",
      done: arenaWins >= 5,
      reward: "챔피언 후보",
    },
  ];
  return chapters.find((chapter) => !chapter.done) || {
    id: 5,
    title: "최종장. 단어 리그 챔피언",
    goal: "반 랭킹 1위를 노려보세요",
    done: false,
    reward: "명예",
  };
}

const DEX_HABITATS = [
  "잿빛초원",
  "물결항구",
  "초록수풀",
  "눈꽃동굴",
  "돌무더기산",
  "바람언덕",
  "별빛탑",
  "사전도서관",
  "먹구름섬",
  "모래시계사막",
];

const DEX_SPECIES = [
  ["새싹 단어몬", "도약 단어몬", "수호 단어몬"],
];

const DEX_SPECIES_BY_LINE = {
  vocabmon: ["단어상어 유생", "사전장갑 맹수", "심해 단어군주"],
  flame: ["불씨 여우몬", "화염 여우몬", "왕관 화염몬"],
  wave: ["아기 상어몬", "산호 상어몬", "심해 상어몬"],
  leaf: ["새싹 수호몬", "꽃잎 수호몬", "숲의 거목몬"],
  bolt: ["전류 고양몬", "번개 살쾡몬", "폭풍 호랑몬"],
  shadow: ["달그림자몬", "환영 날개몬", "심연 용군몬"],
  star: ["별가루 정령몬", "혜성 정령몬", "은하 불사몬"],
  ice: ["눈꽃 여우몬", "빙하 늑대몬", "설원 용왕몬"],
  rock: ["조약돌 골렘몬", "바위견 골렘몬", "수정 산맥몬"],
  wind: ["산들새몬", "소용돌이 부엉몬", "폭풍 콘도르몬"],
  toxic: ["젤리 슬라임몬", "독개구리몬", "산성 드래곤몬"],
  metal: ["톱니 꼬마몬", "강철 곰몬", "크롬 용몬"],
  psychic: ["염력 고양몬", "환각 여우몬", "심상 스핑크스몬"],
  crystal: ["수정 요정몬", "프리즘 여우몬", "보석 골렘몬"],
  dragon: ["꼬마 드래곤몬", "비늘 송곳몬", "고대 용왕몬"],
  nature: ["잎벌레몬", "수정 나비몬", "은하 나방몬"],
  lava: ["마그마 민달팽몬", "용암 도롱몬", "화산 불사몬"],
  ancient: ["화석 새끼몬", "고대 랩터몬", "거대 티라노몬"],
  fairy: ["솜토끼몬", "꽃토끼몬", "달빛 토끼여왕몬"],
  ghost: ["수줍 유령몬", "벽통과 유령몬", "왕관 유령몬"],
  sand: ["모래쥐몬", "사막 아르마몬", "열사 도마뱀몬"],
  speed: ["질주 여우몬", "잔상 여우몬", "섬광 레이서몬"],
  cosmic: ["별구름 강아몬", "성운 외계몬", "우주 드레이크몬"],
  dream: ["잠구름몬", "꿈곰몬", "수면 수호몬"],
  dino: ["아기 공룡몬", "날개 공룡몬", "초원 포식몬"],
  angel: ["고리 병아몬", "수호 새몬", "여섯날개몬"],
  candy: ["사탕 젤리몬", "롤리팝 고양몬", "무지개 사탕용몬"],
  music: ["음표 꼬마몬", "선율 새몬", "공명 여우새몬"],
  dark: ["그림자 늑대몬", "별무늬 늑대몬", "공허 하울몬"],
  mech: ["로봇 병아몬", "기어 로봇몬", "거대 메카몬"],
  coral: ["성게 꼬마몬", "불가사리몬", "산호 여왕몬"],
  cloud: ["구름 솜몬", "먹구름몬", "천둥 구름몬"],
  lava2: ["마그마 강아몬", "용암 늑대몬", "분화구 하운드몬"],
  crystal2: ["보석 씨앗몬", "프리즘 골렘몬", "다이아 용녀몬"],
};

const VOCABMON_ANIME_ART = [
  "/monsters/vocabmon/glyphin.png",
  "/monsters/vocabmon/lexigon.png",
  "/monsters/vocabmon/vocarion.png",
];

function ConceptMonsterArt({ stageIndex = 0, name = "VocabMon" }) {
  const src = VOCABMON_ANIME_ART[stageIndex] ?? VOCABMON_ANIME_ART[0];
  return (
    <div className="concept-monster-art">
      <img src={src} alt={`${name} anime illustration`} />
    </div>
  );
}

function getDexNo(lineId, stageIndex = 0) {
  const lineIndex = Math.max(0, CATCH_MON_LINES.findIndex((line) => line.lineId === lineId));
  return String(lineIndex * 3 + stageIndex + 1).padStart(3, "0");
}

function getDexHabitat(lineId) {
  const lineIndex = Math.max(0, CATCH_MON_LINES.findIndex((line) => line.lineId === lineId));
  return DEX_HABITATS[lineIndex % DEX_HABITATS.length];
}

function getDexSpecies(line, stageIndex = 0) {
  const lineIndex = Math.max(0, CATCH_MON_LINES.findIndex((entry) => entry.lineId === line?.lineId));
  const speciesLine = DEX_SPECIES_BY_LINE[line?.lineId] ?? DEX_SPECIES[lineIndex % DEX_SPECIES.length];
  return speciesLine[stageIndex] ?? `${line?.type || "WORD"} 단어몬`;
}

function getRetroDexEntry(line, stage, stageIndex = 0) {
  const baseDesc = (stage?.desc || "").split("\n")[0];
  const habitat = getDexHabitat(line?.lineId);
  const species = getDexSpecies(line, stageIndex);
  const habits = [
    "낯선 단어를 들으면 꼬리를 흔들며 따라 읽는다.",
    "정답 에너지를 모을수록 몸의 무늬가 선명해진다.",
    "친구와 겨룰 때 가장 큰 목소리로 울음소리를 낸다.",
    "오답 노트를 보면 조용히 옆에 앉아 다시 도전하게 한다.",
    "진화 직전에는 도감 화면이 잠깐 번쩍인다고 전해진다.",
  ];
  const lineIndex = Math.max(0, CATCH_MON_LINES.findIndex((entry) => entry.lineId === line?.lineId));
  return `${habitat}에 사는 ${species}. ${baseDesc} ${habits[(lineIndex + stageIndex) % habits.length]}`;
}

function MonsterPreviewScreen() {
  const signatureLine = CATCH_MON_LINES.find((line) => line.lineId === "vocabmon") ?? CATCH_MON_LINES[0];
  return (
    <div className="crt page-y monster-preview">
      <style>{CSS}</style>
      <div className="monster-preview__shell">
        <div className="monster-preview__header">
          <div>
            <div className="monster-preview__eyebrow">
              VOCABMON FIELD DEX
            </div>
            <div className="monster-preview__title">
              Collect, Train, Battle
            </div>
            <div className="monster-preview__subtitle">
              색만 바꾼 복붙 말고, 각 라인마다 생태/실루엣/진화 욕구가 보이게 만든 애니 몬스터 카드 도감
            </div>
          </div>
          <div className="monster-preview__counter">
            <span>{CATCH_MON_LINES.length}</span> LINES<br/><span>{CATCH_MON_LINES.length * 3}</span> MONS
          </div>
        </div>

        {signatureLine && (
          <div className="signature-showcase" style={{"--line":signatureLine.typeClr}}>
            <div className="signature-showcase__copy">
              <div className="monster-preview__eyebrow" style={{color:signatureLine.typeClr}}>
                  SIGNATURE LINE · {signatureLine.type}
              </div>
              <div className="signature-showcase__name">
                {signatureLine.stages[2]?.name}
              </div>
              <div className="signature-showcase__desc">
                단어 에너지를 삼키고 진화하는 심해 단어군주. 작은 알에서 출발해, 친구 배틀에서 꺼내고 싶은 최종형까지 한눈에 보이게 키웠다.
              </div>
              <div className="signature-showcase__chips">
                <span>Starter Core</span>
                <span>3-Stage Evo</span>
                <span>Arena Ready</span>
              </div>
            </div>
            <div className="signature-showcase__stages">
              {signatureLine.stages.map((stage, index) => {
                return (
                  <div className="signature-stage-card" key={stage.id} style={{"--delay":`${index * 90}ms`}}>
                    <div className="signature-stage-card__rank">STAGE {index + 1}</div>
                    <div className="signature-stage-card__art signature-stage-card__art--illustration">
                      <ConceptMonsterArt stageIndex={index} name={stage.name} />
                    </div>
                    <div className="signature-stage-card__name">{stage.name}</div>
                    <div className="signature-stage-card__species">{getDexSpecies(signatureLine, index)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="monster-preview__section-title">
          <span>Vocabmon Line Archive</span>
          <small>진화하면 실루엣이 커지고, 카드에서 꺼내고 싶은 애들로</small>
        </div>

        <div className="monster-preview__grid">
          {CATCH_MON_LINES.map((line, lineIndex) => (
            <div
              className="dex-line-card"
              key={line.lineId}
              style={{
                "--line":line.typeClr,
                "--line-bg":line.typeBg || "#141024",
                "--stagger":`${Math.min(lineIndex, 12) * 35}ms`,
              }}
            >
              <div className="dex-line-card__top">
                <div>
                  <div className="dex-line-card__type">
                    {line.eggEmoji} {line.type}
                  </div>
                  <div className="dex-line-card__rarity">
                    {line.rarityLabel}
                  </div>
                </div>
                <div className="dex-line-card__number">
                  No.{getDexNo(line.lineId, 0)}-{getDexNo(line.lineId, 2)}
                </div>
              </div>
              <div className="dex-line-card__stages">
                {line.stages.map((stage, index) => {
                  const Sp = stage.Sprite;
                  return (
                    <div className={`dex-stage-card dex-stage-card--${index + 1}`} key={stage.id}>
                      <div className="dex-stage-card__plate">
                        <div className="dex-stage-card__halo" />
                        <div className="dex-stage-card__sprite" style={{animationDelay:`${index * 120}ms`}}>
                          <Sp w={index === 2 ? 148 : index === 1 ? 126 : 108}/>
                        </div>
                      </div>
                      <div className="dex-stage-card__name">
                        {stage.name}
                      </div>
                      <div className="dex-stage-card__meta">
                        No.{getDexNo(line.lineId, index)} · EVO {index + 1}
                      </div>
                      <div className="dex-stage-card__species">
                        {getDexSpecies(line, index)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  LEADERBOARD SCREEN (위치 고정 — Rules of Hooks)
function LeaderboardScreen({ player, mon, setScreen }) {
  const [lbData, setLbData] = React.useState(null);
  React.useEffect(()=>{
    if(!supabase){setLbData([]);return;}
    supabase.from("progress")
      .select("name,data")
      .eq("class_code", player.classCode)
      .then(({data})=>{
        if(!data){setLbData([]);return;}
        const rows = data.map(r=>({
          name:r.name,
          dexCompleted: getDexProgress(r.data?.monsterCollection || {}).completedLines,
          stars: Object.values(r.data?.unitStars||{}).reduce((a,b)=>a+b,0),
          monLv: r.data?.monLv||1,
        })).sort((a,b)=>b.dexCompleted-a.dexCompleted||b.stars-a.stars);
        setLbData(rows);
      });
  },[]);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div className="crt page-y slide-up" style={{
      padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2vh,14px)",
      background:"radial-gradient(ellipse at top,#1A1400,#0C0A18)"}}>
      <style>{CSS}</style>
      <ScreenTopBar title="랭킹" subtitle="완성 라인과 별 개수 기준" icon={NAV_ICON.ranking} accent="#FFD700" onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} meta={<div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-xs)",color:"#FFD700",textAlign:"right"}}>{player?.classCode || "CLASS"}</div>} />
      {lbData===null?(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"var(--f-pk)",color:"#4A3A60",fontSize:"var(--fs-sm)"}}>불러오는 중...</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
          {lbData.length===0&&(
            <div style={{textAlign:"center",fontFamily:"var(--f-pk)",color:"#4A3A60",
              fontSize:"var(--fs-sm)",marginTop:40}}>아직 데이터가 없습니다.</div>
          )}
          {lbData.map((row,i)=>{
            const isMe = row.name===player?.name;
            return (
              <div key={i} style={{
                background:isMe?"linear-gradient(135deg,#1A0838,#280A50)":"#16122A",
                border:isMe?"2px solid #7B2FBE":"1px solid #2A2440",
                borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
                display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,5vw,24px)",minWidth:36,textAlign:"center"}}>
                  {i<3?medals[i]:i+1}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:800,
                    fontSize:"clamp(13px,3.5vw,16px)",color:isMe?"#C77DFF":"#E0D8FF",
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {row.name}{isMe?" (ME)":""}
                  </div>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:2}}>
                    Lv.{row.monLv} · {row.stars}★
                  </div>
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,5vw,24px)",color:"#FFD700"}}>{row.dexCompleted}</div>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888"}}>완성</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ScreenBottomNav onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} />
    </div>
  );
}

function ArenaScreen({
  player,
  mon,
  progressSnapshot,
  curBook,
  battleTickets,
  setBattleTickets,
  arenaWins,
  setArenaWins,
  arenaRating,
  setArenaRating,
  setCoins,
  setBattleBoost,
  setScreen,
  setToast,
}) {
  const [opponents, setOpponents] = React.useState(null);
  const [opponent, setOpponent] = React.useState(null);
  const [battle, setBattle] = React.useState(null);
  const [move, setMove] = React.useState(null);
  const [question, setQuestion] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  const myPower = calcBattlePower(progressSnapshot);
  const myTeamCount = ownedCount(progressSnapshot.monsterCollection);

  React.useEffect(() => {
    let cancelled = false;
    async function loadOpponents() {
      if (!supabase) {
        setOpponents([]);
        return;
      }
      const { data } = await supabase
        .from("progress")
        .select("name,data")
        .eq("class_code", player.classCode)
        .neq("name", player.name)
        .limit(30);
      if (cancelled) return;
      const rows = (data || []).map((row) => ({
        name: row.name,
        data: row.data || {},
        power: calcBattlePower(row.data || {}),
        stars: sumStars(row.data?.unitStars || {}),
        dex: getDexProgress(row.data?.monsterCollection || {}),
        teamCount: ownedCount(row.data?.monsterCollection || {}),
      })).sort((a, b) => Math.abs(a.power - myPower) - Math.abs(b.power - myPower));
      setOpponents(rows);
    }
    loadOpponents();
    return () => { cancelled = true; };
  }, [player.classCode, player.name, myPower]);

  function nextQuestion() {
    const unit = Math.max(1, Math.min(12, Math.floor(Math.random() * 12) + 1));
    const words = getWordsForUnit(curBook || "ww5", unit);
    const word = words[Math.floor(Math.random() * words.length)];
    if (!word) return null;
    const promptType = Math.random() > 0.5 ? "meaning" : "definition";
    const correct = promptType === "meaning" ? word.w : word.w;
    return {
      prompt: promptType === "meaning" ? `뜻: ${word.m}` : word.def || `뜻: ${word.m}`,
      correct,
      opts: shuffle(word.opts?.length ? word.opts : [word.w]),
      word,
    };
  }

  function startArenaBattle(nextOpponent) {
    if (!mon) {
      setToast("먼저 파트너 몬스터를 선택하세요.");
      return;
    }
    if (battleTickets <= 0) {
      setToast("배틀 티켓이 부족합니다. 1시간마다 1장씩 회복됩니다.");
      return;
    }
    setBattleTickets((v) => Math.max(0, v - 1));
    setArenaTicketUpdatedAt(Date.now());
    const oppPower = nextOpponent.power;
    const myHp = 90 + Math.floor(myPower / 8);
    const enemyHp = 90 + Math.floor(oppPower / 8);
    setOpponent(nextOpponent);
    setBattle({
      myHp,
      enemyHp,
      myMaxHp: myHp,
      enemyMaxHp: enemyHp,
      combo: 0,
      guard: false,
      turn: 1,
      finished: false,
      log: [`${nextOpponent.name} 트레이너가 승부를 걸어왔습니다.`],
    });
    setMove(null);
    setQuestion(null);
    setSelected(null);
  }

  function pickMove(nextMove) {
    if (!battle || battle.finished) return;
    setMove(nextMove);
    setQuestion(nextQuestion());
    setSelected(null);
  }

  function resolveAnswer(opt) {
    if (!battle || !move || !question || selected) return;
    const correct = opt === question.correct;
    setSelected(opt);
    const nextCombo = correct ? battle.combo + 1 : 0;
    const moveBase = move === "guard" ? 12 : move === "combo" ? 14 + nextCombo * 8 : move === "burst" ? 36 : 20;
    const accuracyBonus = correct ? 1 : move === "burst" ? -0.4 : -0.2;
    const myDamage = Math.max(0, Math.round((moveBase + myPower / 24) * accuracyBonus));
    const nextEnemyHp = Math.max(0, battle.enemyHp - myDamage);
    const nextGuard = move === "guard" && correct;
    const afterPlayer = {
      ...battle,
      enemyHp: nextEnemyHp,
      combo: nextCombo,
      guard: nextGuard,
      log: [
        ...battle.log.slice(-4),
        correct
          ? `${question.word.w} 정답! ${move === "burst" ? "궁극기" : "기술"} 적중 -${myDamage}`
          : `오답. ${opponent.name}이 빈틈을 봅니다.`,
      ],
    };
    if (nextEnemyHp <= 0) {
      finishArena(true, afterPlayer);
      return;
    }
    setBattle(afterPlayer);
    setTimeout(() => enemyTurn(afterPlayer, correct), 650);
  }

  function enemyTurn(current, playerCorrect) {
    const swing = Math.floor(Math.random() * 9);
    const base = 14 + Math.floor(opponent.power / 35) + swing + (playerCorrect ? 0 : 8);
    const damage = Math.max(4, current.guard ? Math.floor(base * 0.45) : base);
    const nextHp = Math.max(0, current.myHp - damage);
    const nextBattle = {
      ...current,
      myHp: nextHp,
      guard: false,
      turn: current.turn + 1,
      log: [...current.log.slice(-4), `${opponent.name}의 반격 -${damage}`],
    };
    if (nextHp <= 0) {
      finishArena(false, nextBattle);
      return;
    }
    setBattle(nextBattle);
    setMove(null);
    setQuestion(null);
    setSelected(null);
  }

  function finishArena(didWin, finalBattle) {
    const ratingDelta = didWin ? Math.max(12, Math.round(opponent.power / Math.max(80, myPower) * 22)) : -8;
    setBattle({
      ...finalBattle,
      finished: true,
      log: [
        ...finalBattle.log.slice(-4),
        didWin ? "아레나 승리! 친구에게 도전 알림을 남겼습니다." : "패배. 팀 세팅과 단어를 더 준비하세요.",
      ],
    });
    if (didWin) {
      const reward = 45 + Math.min(120, Math.floor(opponent.power / 18));
      setCoins((c) => c + reward);
      setArenaWins((w) => w + 1);
      setArenaRating((r) => r + ratingDelta);
      setToast(`아레나 승리! +${reward}G`);
    } else {
      setArenaRating((r) => Math.max(0, r + ratingDelta));
      setToast("아레나 패배. 상점 아이템으로 다시 준비하세요.");
    }
  }

  const moves = [
    { key: "strike", label: "정밀 타격", desc: "안정적인 피해" },
    { key: "guard", label: "실드 워드", desc: "맞히면 다음 피해 감소" },
    { key: "combo", label: "콤보 차지", desc: "연속 정답일수록 강함" },
    { key: "burst", label: "궁극기", desc: "강하지만 오답 리스크 큼" },
  ];

  if (battle && opponent) {
    const myPct = Math.max(0, Math.round((battle.myHp / battle.myMaxHp) * 100));
    const enemyPct = Math.max(0, Math.round((battle.enemyHp / battle.enemyMaxHp) * 100));
    return (
      <div data-testid="arena-battle-screen" className="crt page-y slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:12,
        background:"radial-gradient(ellipse at top,#211000,#0C0A18)"}}>
        <style>{CSS}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#FFB84A"}}>FRIEND ARENA</div>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#8A6A44"}}>TURN {battle.turn}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            { name: player.name, hp: battle.myHp, max: battle.myMaxHp, pct: myPct, color: "#44CC77", sub: `${mon?.name || "PARTNER"} · BP ${myPower}` },
            { name: opponent.name, hp: battle.enemyHp, max: battle.enemyMaxHp, pct: enemyPct, color: "#FF6644", sub: `저장 팀 ${opponent.teamCount}마리 · BP ${opponent.power}` },
          ].map((side) => (
            <div key={side.name} style={{background:"#16122A",border:"1px solid #2A2440",borderRadius:12,padding:12}}>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",color:"#E0D8FF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{side.name}</div>
              <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#7A6A92",marginTop:2}}>{side.sub}</div>
              <div style={{height:10,background:"#0B0914",borderRadius:8,overflow:"hidden",marginTop:10}}>
                <div style={{height:"100%",width:`${side.pct}%`,background:side.color,transition:"width .25s"}} />
              </div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:side.color,marginTop:6}}>{side.hp}/{side.max}</div>
            </div>
          ))}
        </div>

        <div style={{background:"#100D1D",border:"1px solid #2A2440",borderRadius:12,padding:12,minHeight:92}}>
          {battle.log.map((line, i) => (
            <div key={i} style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:i===battle.log.length-1?"#F5C842":"#8C7AAE",lineHeight:1.7}}>
              {line}
            </div>
          ))}
        </div>

        {battle.finished ? (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button className="big-btn" onClick={()=>{setBattle(null);setOpponent(null);}} style={{padding:13,fontSize:"var(--fs-sm)",background:"linear-gradient(135deg,#3A2500,#6A4400)",color:"#fff",boxShadow:"0 4px 0 #1A1000"}}>다른 친구 도전</button>
            <button className="big-btn" onClick={()=>setScreen("title")} style={{padding:13,fontSize:"var(--fs-sm)",background:"#1C182E",color:"#8878AA",boxShadow:"0 4px 0 #080612"}}>홈</button>
          </div>
        ) : question ? (
          <div style={{background:"#ECE6D8",border:"3px solid #8A7E6E",borderRadius:12,padding:12}}>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",color:"#2A1A10",lineHeight:1.5}}>{question.prompt}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
              {question.opts.map((opt, i) => {
                const picked = selected === opt;
                const correct = opt === question.correct;
                return (
                  <button key={`${opt}_${i}`} onClick={()=>resolveAnswer(opt)} disabled={!!selected} style={{
                    border:"2px solid #8A7E6E",borderRadius:10,padding:"12px 8px",
                    background:picked ? (correct ? "#2E8B48" : "#AA3333") : "#fffaf0",
                    color:picked ? "#fff" : "#2A1A10",
                    fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",cursor:selected?"default":"pointer",
                  }}>{opt}</button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {moves.map((m) => (
              <button key={m.key} className="big-btn" onClick={()=>pickMove(m.key)} style={{
                padding:"12px 10px",fontSize:"var(--fs-sm)",background:"linear-gradient(135deg,#242050,#3A2B78)",
                color:"#fff",boxShadow:"0 4px 0 #100A2A",textAlign:"left",
              }}>
                <div>{m.label}</div>
                <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#B8A8E8",marginTop:4}}>{m.desc}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div data-testid="arena-screen" className="crt page-y slide-up" style={{
      padding:"clamp(12px,3vw,20px)",gap:12,
      background:"radial-gradient(ellipse at top,#1F1300,#0C0A18)"}}>
      <style>{CSS}</style>
      <ScreenTopBar title="아레나" subtitle="1시간마다 티켓 1장 회복" icon={NAV_ICON.arena} accent="#FFB84A" onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} meta={<div style={{textAlign:"right",fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#F5C842"}}>티켓 {battleTickets}/{ARENA_MAX_TICKETS}<br/>R {arenaRating}</div>} />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[
          ["내 BP", myPower],
          ["승리", arenaWins],
          ["팀", myTeamCount],
        ].map(([label, value]) => (
          <div key={label} style={{background:"#16122A",border:"1px solid #2A2440",borderRadius:12,padding:10,textAlign:"center"}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#6A5888"}}>{label}</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842",marginTop:6}}>{value}</div>
          </div>
        ))}
      </div>

      {opponents === null ? (
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#6A5888"}}>친구 찾는 중...</div>
      ) : opponents.length === 0 ? (
        <div style={{background:"#16122A",border:"1px solid #2A2440",borderRadius:12,padding:18,textAlign:"center"}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842"}}>아직 도전할 친구가 없습니다.</div>
          <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#8C7AAE",marginTop:10,lineHeight:1.7}}>
            같은 반 코드로 친구가 한 번 이상 저장하면 여기에서 도전할 수 있습니다.
          </div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
          {opponents.map((row) => {
            const diff = row.power - myPower;
            return (
              <button key={row.name} onClick={()=>startArenaBattle(row)} className="big-btn" style={{
                display:"flex",alignItems:"center",gap:12,textAlign:"left",
                padding:"12px",background:diff > 80 ? "linear-gradient(135deg,#3A0800,#641000)" : "linear-gradient(135deg,#1A1433,#2B2458)",
                color:"#fff",boxShadow:"0 4px 0 #080612",
              }}>
                <div style={{fontSize:28}}>{diff > 80 ? "🔥" : diff < -80 ? "🎯" : "⚔️"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{row.name}</div>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#B8A8E8",marginTop:3}}>
                    {row.stars}★ · 도감 완성 {row.dex.completedLines} · 팀 {row.teamCount}
                  </div>
                </div>
                <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842"}}>{row.power}</div>
              </button>
            );
          })}
        </div>
      )}

      <ScreenBottomNav onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  REVENGE LAND SCREEN (위치 고정 — Rules of Hooks)
function RevengeLandScreen({ wrongWords, setWrongWords, wordMemory, setWordMemory, mon, monLv, setMonLv, setMonExp,
  lineId, grantLineResources, coins, setCoins, pendingEggs, setPendingEggs, addEggToInventory,
  dailyMissions, setDailyMissions, weeklyMissions, setWeeklyMissions, setScreen, setToast }) {

  // 모든 훅은 최상위에서 선언 (Rules of Hooks)
  const [rMode,    setRMode]    = React.useState(null);
  const [rIdx,     setRIdx]     = React.useState(0);
  const [rSel,     setRSel]     = React.useState(null);
  const [rCorrect, setRCorrect] = React.useState(0);
  const [rStreak,  setRStreak]  = React.useState(0);
  const [rDone,    setRDone]    = React.useState(false);
  const [rDeckId,  setRDeckId]  = React.useState(null);
  const [rOutcomes,setROutcomes]= React.useState({});
  const [rSessionWords,setRSessionWords]=React.useState([]);

  const decks = buildReviewDecks(wrongWords, wordMemory, "ww5");
  const deckList = [decks.mistakes, decks.due, decks.weak];
  const activeDeck = deckList.find((deck) => deck.id === rDeckId) || deckList.find((deck) => deck.words.length > 0) || deckList[0];
  const deckWords = activeDeck.words.slice(0, 10);
  const words = rMode ? rSessionWords : deckWords;
  const cur   = words[rIdx];

  // 단어가 없음
  if(deckList.every((deck) => deck.words.length === 0)) return (
    <div data-testid="reviewland-empty" className="crt page slide-up" style={{alignItems:"center",justifyContent:"center",gap:20,
      background:"radial-gradient(ellipse at top,#0A1A0A,#0C0A18)"}}>
      <style>{CSS}</style>
      <div style={{fontSize:"clamp(48px,14vw,80px)"}}>🌱</div>
      <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-lg)",color:"#44FF88",textAlign:"center"}}>복습랜드가 조용합니다</div>
      <div style={{fontFamily:"var(--f-ui)",color:"#6A5888",fontSize:"var(--fs-sm)",textAlign:"center",lineHeight:1.6}}>
        새 전투를 진행하면 오답, 복습 예정, 약점 단어가 자동으로 쌓입니다.
      </div>
      <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}>BACK</button>
    </div>
  );

  // 모드 선택
  if(rMode === null) return (
    <div data-testid="reviewland-select" className="crt page slide-up" style={{
      padding:"clamp(14px,3vw,22px)",gap:"clamp(12px,3vh,18px)",alignItems:"center",
      background:"radial-gradient(circle at 50% 0%,rgba(120,230,255,.18),transparent 30%),radial-gradient(circle at 22% 76%,rgba(255,136,68,.16),transparent 28%),radial-gradient(circle at 82% 70%,rgba(199,125,255,.14),transparent 30%),linear-gradient(180deg,#090716,#0C0617 58%,#06040D)"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",flexShrink:0}}>
        <div style={{fontSize:"clamp(44px,11vmin,64px)",animation:"floatBob 2s ease-in-out infinite",filter:"drop-shadow(0 14px 22px rgba(120,230,255,.28))"}}>🧠</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#78E6FF",marginTop:6,textShadow:"0 0 18px rgba(120,230,255,.45)"}}>복습랜드</div>
        <div style={{fontFamily:"var(--f-ui)",fontWeight:1000,fontSize:"var(--fs-xs)",color:"#E7A56A",marginTop:6}}>
          지난 단어를 다시 꺼내면 몬스터가 더 빨리 성장합니다
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:12,width:"100%",maxWidth:720,flexShrink:0}}>
        {deckList.map((deck) => {
          const active = activeDeck.id === deck.id;
          return (
            <button key={deck.id} data-testid={`review-deck-${deck.id}`} onClick={()=>{setRDeckId(deck.id);setRIdx(0);setRSel(null);setRCorrect(0);setRStreak(0);setROutcomes({});setRSessionWords([]);}} style={{
              minHeight:"clamp(118px,15vh,142px)",borderRadius:14,padding:"clamp(11px,1.5vw,15px)",
              background:active?"linear-gradient(135deg,#12364C,#171F46)":"linear-gradient(135deg,#151126,#100D1B)",
              border:`2px solid ${active?"#78E6FF88":"#2A2440"}`,
              color:"#fff",cursor:"pointer",textAlign:"left",boxShadow:active?"0 0 22px rgba(120,230,255,.14),0 4px 0 rgba(0,0,0,.55)":"0 4px 0 rgba(0,0,0,.48)"
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}>
                <span style={{fontSize:"clamp(18px,5vmin,24px)"}}>{deck.icon}</span>
                <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",color:active?"#78E6FF":"#6A5888"}}>{deck.words.length}</span>
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:1000,fontSize:"var(--fs-xs)",color:active?"#F4EEFF":"#D7CCE8",marginTop:8,lineHeight:1.15}}>{deck.title}</div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"10px",color:active?"#A9DCEF":"#9588AA",marginTop:5,lineHeight:1.35}}>{deck.words.length ? deck.desc : deck.empty}</div>
            </button>
          );
        })}
      </div>
      <div style={{background:"linear-gradient(135deg,#271018,#160B16)",border:"1px solid #FF884455",borderRadius:12,
        padding:"clamp(11px,1.8vw,16px) clamp(16px,2.4vw,24px)",width:"100%",maxWidth:560,flexShrink:0,boxShadow:"0 12px 28px rgba(0,0,0,.28)"}}>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",color:"#FF995C",marginBottom:8}}>클리어 보상</div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          {[{icon:"💰",label:`${Math.round(words.length*12)}G`},{icon:"✨",label:`EXP x${activeDeck.expMult}`},{icon:"🧬",label:`라인EXP +${activeDeck.lineExpPerCorrect}/정답`}].map((r,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(16px,4.5vmin,22px)"}}>{r.icon}</div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",color:"#FFAA44",marginTop:3}}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:560,flexShrink:0}}>
        {[
          {id:"light", icon:"💧",label:"라이트", desc:"2지선다 + 자동 힌트", clr:"#44AAFF",bg:"linear-gradient(135deg,#081828,#0C2840)"},
          {id:"normal",icon:"⚔️",label:"노멀", desc:"4지선다 기본 모드", clr:"#FF8844",bg:"linear-gradient(135deg,#1A0808,#2A1010)"},
          {id:"hard",  icon:"🔥",label:"챌린지", desc:"4지선다 + 보상 2배", clr:"#FF4444",bg:"linear-gradient(135deg,#1A0010,#2A0020)"},
        ].map(m=>(
          <button key={m.id} data-testid={`review-mode-${m.id}`} onClick={()=>{ if(deckWords.length){ setRSessionWords(deckWords); setRMode(m.id); } }} disabled={!deckWords.length} style={{
            background:m.bg,border:`2px solid ${m.clr}44`,borderRadius:14,
            padding:"clamp(12px,3vw,16px) clamp(14px,3.5vw,20px)",
            display:"flex",alignItems:"center",gap:14,cursor:"pointer",
              boxShadow:"0 4px 0 rgba(0,0,0,0.55)",textAlign:"left",opacity:deckWords.length?1:.45}}>
            <div style={{fontSize:"clamp(22px,6vmin,30px)",flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(12px,3.2vmin,15px)",color:m.clr}}>{m.label}</div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"clamp(9px,2.3vmin,11px)",color:"#B59BC8",marginTop:3}}>{m.desc}</div>
            </div>
            {m.id==="light"&&<div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",
              background:"#44AAFF22",color:"#44AAFF",padding:"3px 8px",borderRadius:6,flexShrink:0}}>추천</div>}
          </button>
        ))}
      </div>
      <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}
        style={{background:"rgba(12,8,24,.72)",border:"1px solid #2A2340",color:"#8F82AE",width:"100%",maxWidth:560}}>
        BACK
      </button>
    </div>
  );

  // 완료 화면
  if(rDone) {
    const isHard = rMode==="hard";
    const isPerfect = rCorrect === words.length;
    const ratio = rCorrect / words.length;
    const challengeMult = isHard&&isPerfect?2:1;
    const coinReward = Math.round(words.length * 12 * challengeMult * (ratio>=0.5?ratio:0.3));
    const expReward  = Math.round(words.length * 18 * activeDeck.expMult * challengeMult * (ratio>=0.5?ratio:0.3));
    const lineExpReward = Math.round(rCorrect * activeDeck.lineExpPerCorrect * (isPerfect ? 1.25 : 1));
    const coreReward = activeDeck.coreOnPerfect && isPerfect ? 1 : 0;
    const giveEgg = isPerfect && words.length >= 5 && activeDeck.id !== "due";
    return (
      <div data-testid="reviewland-result" className="crt page slide-up" style={{alignItems:"center",justifyContent:"center",gap:16,
        padding:24,background:"radial-gradient(ellipse at top,#0A0A1A,#0C0A18)"}}>
        <style>{CSS}</style>
        <div style={{fontSize:"clamp(48px,14vw,72px)"}}>{isPerfect?"🏆":ratio>=0.5?"⚔️":"💡"}</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-lg)",textAlign:"center",
          color:isPerfect?"#FFD700":ratio>=0.5?"#FF8844":"#9988CC"}}>
          {isPerfect?"완벽 복습!":ratio>=0.5?"기억 회복!":"다시 도전!"}
        </div>
        <div style={{fontFamily:"var(--f-ui)",color:"#9988CC",fontSize:"var(--fs-sm)",textAlign:"center"}}>
          {rCorrect}/{words.length} 정답 ({Math.round(ratio*100)}%)
        </div>
        <div style={{background:"#16122A",border:"1px solid #3A2060",borderRadius:14,
          padding:"14px 20px",width:"100%",maxWidth:280}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(9px,2.2vmin,11px)",color:"#7755AA",marginBottom:10,textAlign:"center"}}>획득 보상</div>
          <div style={{display:"flex",gap:16,justifyContent:"center"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:24}}>💰</div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(9px,2.3vmin,11px)",color:"#FFB844"}}>+{coinReward}G</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:24}}>✨</div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(9px,2.3vmin,11px)",color:"#88CCFF"}}>+{expReward} EXP</div></div>
            {giveEgg&&<div style={{textAlign:"center"}}><div style={{fontSize:24}}>🥚</div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(9px,2.3vmin,11px)",color:"#CC88FF"}}>+알 1개</div></div>}
            {lineExpReward>0&&<div style={{textAlign:"center"}}><div style={{fontSize:24}}>🧬</div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(9px,2.3vmin,11px)",color:"#8DFF9A"}}>+{lineExpReward} LINE</div></div>}
          </div>
        </div>
        <button data-testid="review-claim-button" className="big-btn" style={{
          background:isPerfect?"linear-gradient(135deg,#8800AA,#CC22EE)":"linear-gradient(135deg,#AA2200,#CC4400)",
          width:"100%",maxWidth:280,padding:"clamp(13px,3vmin,17px)"
        }} onClick={()=>{
          setCoins(c=>c+coinReward);
          setMonExp(e=>{const ne=e+expReward;const th=60+monLv*20;if(ne>=th){setMonLv(l=>l+1);return ne-th;}return ne;});
          if(lineExpReward>0 || coreReward>0) grantLineResources?.(lineId, { lineExp: lineExpReward, evolutionCores: coreReward });
          if(rCorrect>0) {
            const clearedKeys = new Set(words.filter((word)=>rOutcomes[word.memoryKey] !== false).map((word)=>word.memoryKey));
            setWrongWords(prev=>prev.filter((word)=>!clearedKeys.has(normalizeReviewWord(word)?.memoryKey)));
          }
          if(giveEgg){
            const rLines=["flame","wave","leaf","bolt"];
            const rewardLine = rLines[Math.floor(Math.random()*rLines.length)];
            addEggToInventory("common", rewardLine, "revenge");
          }
          setDailyMissions(prev=>updateMissionProgress(prev, { revenge: 1, review5: rCorrect }));
          setWeeklyMissions?.(prev=>updateMissionProgress(prev, { weeklyReview: rCorrect }));
          setToast(isPerfect
            ? `완벽 복습! +${coinReward}G +${expReward}EXP · 라인EXP +${lineExpReward}${coreReward ? " · 코어 +1" : ""}`
            : `복습 보상! +${coinReward}G +${expReward}EXP · 라인EXP +${lineExpReward}`);
          setScreen(mon?"world":"title");
        }}>
          {isPerfect ? "기억 안정화 완료" : "보상 받기"}
        </button>
        {!isPerfect&&(
          <button className="big-btn" onClick={()=>{setRIdx(0);setRSel(null);setRCorrect(0);setRStreak(0);setRDone(false);setRMode(null);}}
            style={{background:"transparent",border:"1px solid #2A1A2A",color:"#664466",padding:"10px",width:"100%",maxWidth:280}}>
            다시 도전
          </button>
        )}
      </div>
    );
  }

  // 완료 화면
  const isLight = rMode==="light";
  const allMs = words.map(x=>x.m);
  const wrongChoices = allMs.filter(m=>m!==cur?.m).sort(()=>Math.random()-0.5).slice(0,isLight?1:3);
  const opts = cur ? shuffle([cur.m,...wrongChoices]) : [];

  return (
    <div data-testid="reviewland-quiz" className="crt page slide-up" style={{
      padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.5vh,14px)",
      background:"radial-gradient(ellipse at top,#0A0118,#0C0A18)"}}>
      <style>{CSS}</style>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#78E6FF"}}>{activeDeck.icon} {activeDeck.title}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {rStreak>=2&&<div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",
            background:"linear-gradient(135deg,#FF6600,#FFCC00)",color:"#fff",padding:"2px 8px",borderRadius:8}}>콤보 {rStreak}</div>}
          <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-sm)",color:"#FF8888"}}>{rIdx+1}/{words.length}</div>
          <button onClick={()=>setScreen(mon?"world":"title")} style={{
            fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",
            background:"transparent",border:"1px solid #4A1A1A",color:"#884444",
            padding:"4px 10px",borderRadius:8,cursor:"pointer"}}>나가기</button>
        </div>
      </div>
            {/* 단어 진행바 */}
      <div style={{display:"flex",gap:2,flexShrink:0}}>
        {words.map((_,i)=>(
          <div key={i} style={{flex:1,height:6,borderRadius:2,transition:"background .3s",
            background:i<rIdx?"#3A1A44":i===rIdx?"#FF6644":"#2A1A1A"}}/>
        ))}
      </div>
      <div style={{textAlign:"center",flexShrink:0}}>
        <div style={{fontSize:"clamp(36px,10vmin,54px)",animation:"floatBob 2s ease-in-out infinite"}}>🧠</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",
          color:rMode==="light"?"#44AAFF":rMode==="hard"?"#FF4444":"#FF6644",marginTop:2}}>
          {rMode==="light"?"라이트 모드":rMode==="hard"?"챌린지 모드":"노멀 모드"}로 기억을 복구 중
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#1A0010,#2A0518)",borderRadius:16,
        padding:"clamp(14px,3.5vw,22px)",border:"2px solid #FF444466",textAlign:"center",flexShrink:0}}>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(22px,6vw,34px)",color:"#FF8888",marginBottom:6}}>{cur?.w}</div>
        {cur?.def&&<div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#886688",lineHeight:1.5}}>{cur.def}</div>}
        {isLight&&cur?.m&&(
          <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#4488AA",marginTop:8}}>
            힌트: {cur.m[0]}... ({cur.m.length}글자)
          </div>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(8px,2vw,12px)",flex:1}}>
        {opts.map((opt,i)=>{
          const isCorrect=opt===cur?.m;
          const selected=rSel!==null;
          let bg="linear-gradient(135deg,#1C0A28,#28103A)";
          let border="2px solid #4A2060";
          if(selected&&opt===rSel){bg=isCorrect?"linear-gradient(135deg,#0A3A1A,#0A5A22)":"linear-gradient(135deg,#3A0A0A,#5A0A0A)";border=isCorrect?"2px solid #44FF66":"2px solid #FF4444";}
          else if(selected&&isCorrect){bg="linear-gradient(135deg,#0A3A1A,#0A5A22)";border="2px solid #44FF66";}
          return (
            <button key={opt} data-testid={`review-option-${i}`} onClick={()=>{
              if(rSel!==null)return;
              setRSel(opt);
              const correct=opt===cur?.m;
              setROutcomes(prev=>({...prev,[cur.memoryKey]:correct}));
              setWordMemory(prev=>updateWordMemoryMap(prev, cur, { correct, book: cur.book, unit: cur.unit }));
              if(correct){setRCorrect(c=>c+1);setRStreak(s=>s+1);}
              else setRStreak(0);
              setTimeout(()=>{
                if(rIdx+1>=words.length)setRDone(true);
                else{setRIdx(i=>i+1);setRSel(null);}
              },900);
            }} style={{background:bg,border,borderRadius:14,
              padding:`clamp(12px,3vw,18px) clamp(8px,2vw,12px)`,
              fontFamily:"var(--f-ui)",fontWeight:700,
              fontSize:`clamp(13px,${isLight?"4":"3.5"}vw,${isLight?"19":"17"}px)`,
              color:"#E0D8FF",cursor:selected?"default":"pointer",textAlign:"center",lineHeight:1.3}}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function updateMissionProgress(missions, increments) {
  return (missions || []).map((mission) => {
    if (mission.done) return mission;
    const raw = increments[mission.id];
    const amount = typeof raw === "function" ? raw(mission) : raw;
    if (!amount) return mission;
    const progress = Math.min(mission.target, mission.progress + amount);
    return { ...mission, progress, done: progress >= mission.target };
  });
}

function getMissionWeekKey(date = new Date()) {
  const d = new Date(date);
  const dayFromMonday = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - dayFromMonday);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function makeWeeklyMissions() {
  return [
    { id:"weeklyStars", emoji:"⭐", label:"별 12개 모으기", target:12, progress:0, done:false },
    { id:"weeklyClears", emoji:"🏁", label:"스테이지 5회 클리어", target:5, progress:0, done:false },
    { id:"weeklyHatches", emoji:"🥚", label:"알 3개 부화", target:3, progress:0, done:false },
    { id:"weeklyFocus", emoji:"⚡", label:"집중 폭발 5회 사용", target:5, progress:0, done:false },
    { id:"weeklyReview", emoji:"🧠", label:"복습 단어 25개 안정화", target:25, progress:0, done:false },
  ];
}

function normalizeWeeklyMissions(missions) {
  const saved = new Map((missions || []).map((mission) => [mission.id, mission]));
  return makeWeeklyMissions().map((base) => {
    const old = saved.get(base.id);
    if (!old) return base;
    return {
      ...base,
      progress: Math.min(base.target, old.progress || 0),
      done: !!old.done || (old.progress || 0) >= base.target,
    };
  });
}

function rollBattleObjective(wordsLength = 5) {
  const pool = [
    { id:"perfect", icon:"💎", title:"무결점 클리어", desc:"오답 없이 승리", rewardText:"+12G +8 라인EXP", bonusCoins:12, bonusExp:0, bonusLineExp:8 },
    { id:"combo3", icon:"🔥", title:"콤보 러시", desc:"3연속 정답 달성", rewardText:"+10G +10EXP", bonusCoins:10, bonusExp:10, bonusLineExp:0 },
    { id:"guard", icon:"🛡️", title:"체력 관리", desc:"HP 70% 이상으로 승리", rewardText:"+8G +8EXP", bonusCoins:8, bonusExp:8, bonusLineExp:0 },
  ];
  if (wordsLength >= 5) {
    pool.push({ id:"focus", icon:"⚡", title:"집중 폭발", desc:"FOCUS 스킬 1회 사용", rewardText:"+14G +10 라인EXP", bonusCoins:14, bonusExp:0, bonusLineExp:10 });
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function evaluateBattleObjective(objective, result) {
  if (!objective) return false;
  if (objective.id === "perfect") return result.wrongCount === 0;
  if (objective.id === "combo3") return result.maxCombo >= 3;
  if (objective.id === "guard") return result.hpPct >= 70;
  if (objective.id === "focus") return result.focusBurstUsed;
  return false;
}

function getEnemyTrait(enemyOrId) {
  const id = typeof enemyOrId === "string" ? enemyOrId : enemyOrId?.id;
  return ENEMY_TRAITS[id] || null;
}

function createEnemyBattleState(enemy) {
  return {
    enemyId: enemy?.id || "forgex",
    phase2: false,
    traitTriggered: false,
    wrongHits: 0,
    recoveredAfterWrong: false,
    blankusCorrect: 0,
    confuzorBestCombo: 0,
    nullvoidFocus: false,
  };
}

function getEnemyTimerSec(enemy, difficultyKey) {
  const modeInfo = DIFFICULTY_MODES.find((m) => m.key === difficultyKey);
  if (enemy?.id !== "confuzor") return modeInfo?.timerSec ?? null;
  if (difficultyKey === "easy") return null;
  const base = modeInfo?.timerSec ?? 30;
  return Math.max(8, Math.round(base * 0.8));
}

function getEnemyAdjustedOptions(enemy, word, stage, bookId, unitId, fallbackOptions = []) {
  if (!word || enemy?.id !== "confuzor") return fallbackOptions;
  const answer = stage === 2 ? word.m : word.w;
  const pool = getWordsForUnit(bookId || "ww5", parseInt(unitId || word.unit || 1))
    .filter((item) => item.w !== word.w && item.m !== word.m);
  const sorted = [...pool].sort((a, b) => {
    const aValue = stage === 2 ? a.m : a.w;
    const bValue = stage === 2 ? b.m : b.w;
    const target = stage === 2 ? word.m : word.w;
    const aScore = Math.abs((aValue || "").length - (target || "").length);
    const bScore = Math.abs((bValue || "").length - (target || "").length);
    return aScore - bScore;
  });
  const distractors = sorted.map((item) => stage === 2 ? item.m : item.w).filter(Boolean);
  const unique = [...new Set([answer, ...distractors])].slice(0, 4);
  return shuffle(unique.length >= 2 ? unique : fallbackOptions);
}

function evaluateEnemyBonus(enemy, enemyState, result) {
  const trait = getEnemyTrait(enemy);
  if (!trait || !result?.didWin) return null;
  let completed = false;
  if (enemy?.id === "forgex") completed = !!enemyState?.recoveredAfterWrong;
  if (enemy?.id === "blankus") completed = (enemyState?.blankusCorrect || 0) >= Math.min(3, Math.max(1, result.total || 0));
  if (enemy?.id === "confuzor") completed = result.maxCombo >= 3 || (enemyState?.confuzorBestCombo || 0) >= 3;
  if (enemy?.id === "nullvoid") completed = !!result.focusBurstUsed || !!enemyState?.nullvoidFocus;
  return {
    enemyId: enemy?.id,
    icon: trait.icon,
    title: trait.bonusTitle,
    desc: trait.bonusDesc,
    completed,
    rewardText: `+${trait.reward.coins}G +${trait.reward.lineExp} 라인EXP`,
    coins: completed ? trait.reward.coins : 0,
    lineExp: completed ? trait.reward.lineExp : 0,
  };
}

function getWordMemoryKey(word, fallbackBook = "ww5", fallbackUnit = "u") {
  const book = word?.book || fallbackBook || "ww5";
  const unit = word?.unit || fallbackUnit || "u";
  return `${book}::${unit}::${word?.w || ""}::${word?.m || ""}`;
}

function reviewIntervalDays(streak = 0) {
  if (streak >= 4) return 14;
  if (streak >= 3) return 7;
  if (streak >= 2) return 3;
  return 1;
}

function memoryStatus(mastery = 0, wrong = 0) {
  if (wrong >= 3) return "약점";
  if (mastery >= 100) return "마스터";
  if (mastery >= 70) return "안정";
  if (mastery >= 35) return "학습 중";
  return "불안정";
}

function updateWordMemoryMap(prev, word, { correct, book, unit, now = Date.now() } = {}) {
  if (!word?.w || !word?.m) return prev;
  const memoryKey = word.memoryKey || word.key || getWordMemoryKey(word, book, unit);
  const old = prev?.[memoryKey] || {};
  const nextCorrect = (old.correct || 0) + (correct ? 1 : 0);
  const nextWrong = (old.wrong || 0) + (correct ? 0 : 1);
  const nextStreak = correct ? (old.streak || 0) + 1 : 0;
  const mastery = Math.max(0, Math.min(100, (old.mastery || 0) + (correct ? 28 + Math.min(12, nextStreak * 3) : -32)));
  const nextReviewAt = correct
    ? now + reviewIntervalDays(nextStreak) * 86400000
    : now;
  const bookId = word.book || book || old.book || "ww5";
  const unitId = word.unit || unit || old.unit || "u";
  return {
    ...prev,
    [memoryKey]: {
      key: memoryKey,
      book: bookId,
      unit: unitId,
      w: word.w,
      m: word.m,
      def: word.def || old.def || "",
      opts: word.opts || old.opts || [],
      correct: nextCorrect,
      wrong: nextWrong,
      streak: nextStreak,
      mastery,
      status: memoryStatus(mastery, nextWrong),
      leech: nextWrong >= 3,
      lastSeenAt: now,
      nextReviewAt,
    },
  };
}

function normalizeReviewWord(word, fallbackBook = "ww5") {
  if (!word?.w || !word?.m) return null;
  const normalized = {
    ...word,
    book: word.book || fallbackBook,
    unit: word.unit || "review",
  };
  return {
    ...normalized,
    memoryKey: word.memoryKey || word.key || getWordMemoryKey(normalized, normalized.book, normalized.unit),
  };
}

function dedupeReviewWords(words, fallbackBook = "ww5") {
  const seen = new Set();
  return (words || []).map((word) => normalizeReviewWord(word, fallbackBook)).filter((word) => {
    if (!word) return false;
    const k = word.memoryKey;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function buildReviewDecks(wrongWords = [], wordMemory = {}, fallbackBook = "ww5") {
  const now = Date.now();
  const memoryWords = Object.values(wordMemory || {}).map((entry) => normalizeReviewWord(entry, entry.book || fallbackBook)).filter(Boolean);
  const mistakeWords = dedupeReviewWords([
    ...wrongWords,
    ...memoryWords.filter((word) => (word.wrong || 0) > 0 && (word.mastery || 0) < 70),
  ], fallbackBook);
  const dueWords = dedupeReviewWords(
    memoryWords
      .filter((word) => word.nextReviewAt && word.nextReviewAt <= now && !word.leech)
      .sort((a, b) => (a.nextReviewAt || 0) - (b.nextReviewAt || 0)),
    fallbackBook
  );
  const weakWords = dedupeReviewWords(
    memoryWords
      .filter((word) => word.leech || (word.wrong || 0) >= 2)
      .sort((a, b) => (b.wrong || 0) - (a.wrong || 0)),
    fallbackBook
  );
  return {
    mistakes: {
      id: "mistakes",
      icon: "🧯",
      title: "오답 추적",
      desc: "방금 틀린 단어를 바로 복구",
      empty: "오답이 없습니다",
      expMult: 1.5,
      lineExpPerCorrect: 2,
      words: mistakeWords,
    },
    due: {
      id: "due",
      icon: "🕯️",
      title: "기억 순찰",
      desc: "오늘 다시 꺼내야 하는 단어",
      empty: "오늘 복습 예정 단어가 없습니다",
      expMult: 1.8,
      lineExpPerCorrect: 3,
      words: dueWords,
    },
    weak: {
      id: "weak",
      icon: "👁️",
      title: "약점 보스",
      desc: "여러 번 틀린 단어 집중 공략",
      empty: "약점 보스가 없습니다",
      expMult: 2.2,
      lineExpPerCorrect: 5,
      coreOnPerfect: true,
      words: weakWords,
    },
  };
}

function getMemoryStats(wordMemory = {}, wrongWords = []) {
  const entries = Object.values(wordMemory || {});
  const now = Date.now();
  return {
    total: entries.length,
    due: entries.filter((entry) => entry.nextReviewAt && entry.nextReviewAt <= now && !entry.leech).length,
    weak: entries.filter((entry) => entry.leech || (entry.wrong || 0) >= 2).length,
    mastered: entries.filter((entry) => (entry.mastery || 0) >= 100).length,
    mistakes: wrongWords.length,
  };
}

// ─────────────────────────────────────────────────────────────────
//  MAIN APP
export default function VocabMon() {
  // [ 로그인 상태 ]
  const [player, setPlayer]           = useState(null); // { name, classCode }
  const [teacherMode, setTeacherMode] = useState(false);
  // Core state
  // Core state
  const [screen,  setScreen]  = useState("title");
  const [curBook, setCurBook] = useState(null);
  const [lineId,  setLineId]  = useState(null);
  const [activeGroup, setActiveGroup] = useState("ww"); // book select tab
  const [stageIdx,setStageIdx]= useState(0);
  const [monLv,   setMonLv]   = useState(1);
  const [monExp,  setMonExp]  = useState(0);
  const [coins,   setCoins]   = useState(120);
  const [battleTickets, setBattleTickets] = useState(3);
  const [arenaTicketUpdatedAt, setArenaTicketUpdatedAt] = useState(Date.now());
  const [arenaWins, setArenaWins] = useState(0);
  const [arenaRating, setArenaRating] = useState(1000);
  const [battleBoost, setBattleBoost] = useState(0);
  // Audio
  // Audio
  const [soundOn, setSoundOn] = useState(true);
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setMuted(!next);
    if (next && screen === "battle") startBGM();
  };

  // BGM: battle 화면에서만 재생
  useEffect(() => {
    if (screen === "battle") {
      startBGM();
    } else {
      stopBGM();
    }
    return () => stopBGM();
  }, [screen]);

  // Stars per unit per stage: { "1_0": 2, "1_1": 1, ... }
  const [unitStars, setUnitStars] = useState({});
  // Total stars (sum of all best stars per unit, max 3 each 횞 12 units = 36)
  const totalStars = Object.values(unitStars).reduce((a,b)=>a+b,0);

  // Streak tracking
  const [streak,    setStreak]   = useState(0);
  const [lastLogin, setLastLogin]= useState(null);
  const [loginDays, setLoginDays]= useState(0);
  const [dailyDone, setDailyDone]= useState(false);

  // Battle state
  const [curUnit,  setCurUnit]  = useState(null);
  const [battleStage, setBattleStage] = useState(0); // 0=EXPLORE 1=RECALL 2=MASTER
  const [curSubStage, setCurSubStage] = useState(0); // 0-3=sub, 4=boss
  const [difficulty, setDifficulty] = useState("easy");
  const [timer, setTimer] = useState(null);
  const timerRef = useRef(null);
  const [showDiffModal, setShowDiffModal] = useState(null); // {uid, stg}
  const [curEnemy, setCurEnemy] = useState(null);
  const [queue,    setQueue]    = useState([]);
  const [wrongQueue,setWrongQueue]=useState([]);
  const [qIdx,     setQIdx]     = useState(0);
  const [pHp,      setPHp]      = useState(0);
  const [eHp,      setEHp]      = useState(0);
  const [log,      setLog]      = useState([]);
  const [phase,    setPhase]    = useState("idle");
  const [sel,      setSel]      = useState(null);
  const [shakeP,   setShakeP]   = useState(false);
  const [shakeE,   setShakeE]   = useState(false);
  const [attackP,  setAttackP]  = useState(false); // player charges enemy
  const [attackE,  setAttackE]  = useState(false); // enemy charges player
  const [comboStr, setComboStr] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [battleFocus, setBattleFocus] = useState(0);
  const [focusBurstUsed, setFocusBurstUsed] = useState(false);
  const [battleObjective, setBattleObjective] = useState(null);
  const [enemyBattleState, setEnemyBattleState] = useState(null);
  const [enemyNotice, setEnemyNotice] = useState(null);
  const [dmgVal,   setDmgVal]   = useState(null);
  const [curOpts,  setCurOpts]  = useState([]);
  const [wrongCount,setWrongCount]=useState(0);
  const [correctCount,setCorrectCount]=useState(0);
  const [won,      setWon]      = useState(false);
  const [lastBattleReward, setLastBattleReward] = useState(null);
  const [enemyKills, setEnemyKills] = useState({});
  const [evoAnim,  setEvoAnim]  = useState(false);
  const [showEvoModal,setShowEvoModal]=useState(false);
  const [newMonName,setNewMonName]=useState("");
  const [evoFromName,setEvoFromName]=useState("");

  // VOC-105: 정답/오답 피드백 오버레이
  const [feedback, setFeedback] = useState(null); // {type:"correct"|"wrong", msg:string}
  const [toast, setToast] = useState(null); // string | null

  // 몬스터 수집 메타 상태
  const [monsterCollection, setMonsterCollection] = useState({});
  const [eggInventory, setEggInventory] = useState([]);
  const [hatcherySlots, setHatcherySlots] = useState(createDefaultHatcherySlots());
  const caughtMons = useMemo(() => getOwnedMonsterIds(monsterCollection), [monsterCollection]);
  const setCaughtMons = useCallback((updater) => {
    setMonsterCollection((prev) => {
      const prevIds = getOwnedMonsterIds(prev);
      const nextIds = typeof updater === "function" ? updater(prevIds) : updater;
      return mergeOwnedIdsIntoCollection(prev, nextIds || []);
    });
  }, []);
  const pendingEggs = eggInventory;
  const setPendingEggs = setEggInventory;
  const [eggHatch,      setEggHatch]      = useState(null); // {mon,lineId,outcome,reward} 부화 연출
  const [wrongWords,    setWrongWords]    = useState([]); // 영구 오답 단어
  const [wordMemory,    setWordMemory]    = useState({});

  // Duolingo 미션 시스템
  const [dailyMissions, setDailyMissions] = useState([]); // [{id,label,emoji,target,progress,done}]
  const [weeklyMissions, setWeeklyMissions] = useState([]);
  const [weeklyMissionKey, setWeeklyMissionKey] = useState(getMissionWeekKey());
  const [dailyEggDate,  setDailyEggDate]  = useState(""); // 오늘 달걀 수령 날짜
  const [streakShields, setStreakShields] = useState(0);  // 스트릭 실드 수

  // PWA 설치 프롬프트
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // 튜토리얼 상태
  const [tutorialStep, setTutorialStep] = useState(0); // 0=비활성, 1~N=튜토리얼 단계

  // Revenge Land 프롬프트 상태
  const [showRevengePrompt, setShowRevengePrompt] = useState(false);

  // 서비스워커 등록 + 설치 이벤트 리스너
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = sessionStorage.getItem("pwa_dismissed");
      if (!dismissed) setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setShowInstallBanner(false));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(() => {
      setInstallPrompt(null);
      setShowInstallBanner(false);
    });
  }

  function dismissInstallBanner() {
    sessionStorage.setItem("pwa_dismissed", "1");
    setShowInstallBanner(false);
  }

  const readyEggCount = useMemo(() => hatcherySlots.filter(slot => slot.status === "ready").length, [hatcherySlots]);
  const runningEggCount = useMemo(() => hatcherySlots.filter(slot => slot.status === "running").length, [hatcherySlots]);
  const unlockedHatchSlots = useMemo(() => hatcherySlots.filter(slot => slot.unlocked).length, [hatcherySlots]);

  useEffect(() => {
    if (!hatcherySlots.some(slot => slot.status === "running")) return;
    const timer = setInterval(() => {
      setHatcherySlots((prev) => syncHatcherySlots(prev));
    }, 1000);
    return () => clearInterval(timer);
  }, [hatcherySlots]);

  useEffect(() => {
    const applyRecovery = () => {
      const recovered = recoverArenaTickets(battleTickets, arenaTicketUpdatedAt);
      if (recovered.tickets !== battleTickets) setBattleTickets(recovered.tickets);
      if (recovered.updatedAt !== arenaTicketUpdatedAt) setArenaTicketUpdatedAt(recovered.updatedAt);
    };
    applyRecovery();
    const timer = setInterval(applyRecovery, 60 * 1000);
    return () => clearInterval(timer);
  }, [battleTickets, arenaTicketUpdatedAt]);

  const addEggToInventory = useCallback((rarity, lineId, source = "reward") => {
    setEggInventory((prev) => [...prev, createEgg(rarity, lineId, source)]);
  }, []);

  const startEggInSlot = useCallback((slotId, egg) => {
    if (!egg) return false;
    const syncedSlots = syncHatcherySlots(hatcherySlots);
    const targetSlot = syncedSlots.find((slot) => slot.slotId === slotId && canSlotHatchEgg(slot, egg));
    if (!targetSlot) return false;
    setHatcherySlots(syncedSlots.map((slot) => {
      if (slot.slotId !== slotId) return slot;
      const startAt = Date.now();
      const duration = getHatchDurationMs(egg.rarity);
      return {
        ...slot,
        egg: {
          ...egg,
          hatchMinutes: getEggRarityMeta(egg.rarity).hatchMinutes,
          hatchLevel: getEggRarityMeta(egg.rarity).hatchLevel,
        },
        startedAt: startAt,
        finishesAt: startAt + duration,
        status: "running",
      };
    }));
    setEggInventory((prev) => prev.filter((entry) => entry.id !== egg.id));
    return true;
  }, [hatcherySlots]);

  const unlockNextHatchSlot = useCallback(() => {
    const nextSlot = getNextLockedSlot(hatcherySlots);
    if (!nextSlot) return false;
    setHatcherySlots((prev) => syncHatcherySlots(prev).map((slot) => {
      if (slot.slotId === nextSlot.slotId) {
        const meta = getSlotMeta(slot.slotId);
        return { ...slot, ...meta, unlocked: true };
      }
      return slot;
    }));
    return true;
  }, [hatcherySlots]);

  const boostFirstRunningEgg = useCallback((minutes = 30) => {
    const result = reduceRunningEggTime(hatcherySlots, minutes * 60 * 1000);
    if (!result.applied) return false;
    setHatcherySlots(result.slots);
    return true;
  }, [hatcherySlots]);

  const claimHatchFromSlot = useCallback((slotId) => {
    const syncedSlots = syncHatcherySlots(hatcherySlots);
    const targetSlot = syncedSlots.find((slot) => slot.slotId === slotId && slot.status === "ready" && slot.egg);
    const rewardEgg = targetSlot?.egg ?? null;
    if (!rewardEgg) return false;

    setHatcherySlots(
      syncedSlots.map((slot) =>
        slot.slotId === slotId
          ? { ...slot, egg: null, startedAt: null, finishesAt: null, status: "idle" }
          : slot
      )
    );

    const caught = rollMonsterFromLine(rewardEgg.lineId, getOwnedMonsterIds(monsterCollection));
    if (!caught) return false;

    const awarded = awardCaughtMonster(monsterCollection, caught);
    const hatchLevel = rewardEgg.hatchLevel ?? getEggRarityMeta(rewardEgg.rarity).hatchLevel;
    const leveledCollection = {
      ...awarded.collection,
      [caught.id]: {
        ...awarded.collection[caught.id],
        level: Math.max(awarded.collection[caught.id]?.level ?? 1, hatchLevel),
      },
    };
    const hatchPayload = {
      mon: caught,
      lineId: rewardEgg.lineId,
      rarity: rewardEgg.rarity,
      hatchLevel,
      outcome: awarded.outcome,
      reward: awarded.reward,
    };

    setMonsterCollection(leveledCollection);

    if (!lineId) {
      const hatchMeta = getMonsterStageMeta(hatchPayload.mon.id);
      if (hatchMeta) {
        setLineId(hatchMeta.lineId);
        setStageIdx(hatchMeta.stageIndex);
        setMonLv(hatchLevel);
        setMonExp(0);
      }
    }

    sfxHatch(rewardEgg.rarity);
    setWeeklyMissions(prev => updateMissionProgress(prev, { weeklyHatches: 1 }));
    setTimeout(() => setEggHatch(hatchPayload), 120);
    return true;
  }, [hatcherySlots, lineId, monsterCollection]);

  function formatHatchRemaining(slot) {
    if (!slot?.finishesAt) return "대기";
    const diff = Math.max(0, slot.finishesAt - Date.now());
    const totalMinutes = Math.ceil(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours <= 0) return `${minutes}분`;
    return `${hours}시간 ${minutes}분`;
  }

  function formatDurationFromMs(ms) {
    const totalMinutes = Math.ceil(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours <= 0) return `${minutes}분`;
    if (minutes === 0) return `${hours}시간`;
    return `${hours}시간 ${minutes}분`;
  }


  const logRef = useRef(null);

  // 미션 생성 함수
  function makeDailyMissions() {
    const pool = [
      { id:"correct10", emoji:"✅", label:"정답 10개 맞히기", target:10, progress:0, done:false },
      { id:"correct20", emoji:"🎯", label:"정답 20개 맞히기", target:20, progress:0, done:false },
      { id:"unit1",     emoji:"📘", label:"유닛 1개 완료하기", target:1, progress:0, done:false },
      { id:"combo5",    emoji:"🔥", label:"5연속 정답 달성", target:5, progress:0, done:false },
      { id:"focus1",    emoji:"⚡", label:"집중 폭발 1회 사용", target:1, progress:0, done:false },
      { id:"review5",   emoji:"🧠", label:"복습 단어 5개 안정화", target:5, progress:0, done:false },
      { id:"revenge",   emoji:"🧠", label:"복습랜드 1회 클리어", target:1, progress:0, done:false },
      { id:"words15",   emoji:"🧠", label:"단어 15개 학습", target:15, progress:0, done:false },
    ];
    // 날짜 기준으로 3개 선택 (같은 날 같은 미션)
    const seed = new Date().toDateString();
    let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
    const picks = [];
    const used = new Set();
    for (let i = 0; picks.length < 3; i++) {
      const idx = Math.abs((h + i * 7919)) % pool.length;
      if (!used.has(idx)) { used.add(idx); picks.push({...pool[idx]}); }
    }
    return picks;
  }

  // 로그인 처리: Supabase에서 진행상황 불러오기
  async function handleLogin(name, classCode) {
    const saved = await loadProgress(name, classCode);
    if (saved?.banned) return "banned";
    const today = new Date().toDateString();
    let restoredStreak = 0, restoredLoginDays = 0, restoredLastLogin = "";
    let restoredEggDate = "", restoredShields = 0;
    let migratedCollection = {};
    let restoredLineId = null;

    if (saved) {
      if (saved.unitStars) {
        const migrated = {};
        Object.entries(saved.unitStars).forEach(([k, v]) => {
          const parts = k.split("_");
          const lastPart = parts[parts.length - 1];
          if (!["easy","normal","hard","hell"].includes(lastPart)) {
            migrated[`${k}_easy`] = v;
          } else {
            migrated[k] = v;
          }
        });
        setUnitStars(migrated);
      }
      if (saved.coins)        setCoins(saved.coins);
      if (saved.battleTickets !== undefined) {
        const recovered = recoverArenaTickets(saved.battleTickets, saved.arenaTicketUpdatedAt || Date.now());
        setBattleTickets(recovered.tickets);
        setArenaTicketUpdatedAt(recovered.updatedAt);
      }
      if (saved.arenaWins !== undefined) setArenaWins(saved.arenaWins);
      if (saved.arenaRating !== undefined) setArenaRating(saved.arenaRating);
      if (saved.battleBoost !== undefined) setBattleBoost(saved.battleBoost);
      restoredLineId = saved.lineId && getCatchLineById(saved.lineId) ? saved.lineId : null;
      if (restoredLineId)     setLineId(restoredLineId);
      if (saved.stageIdx !== undefined) setStageIdx(saved.stageIdx);
      if (saved.curBook)      setCurBook(saved.curBook);
      migratedCollection = normalizeCollectionLineResources(
        migrateMonsterCollection(saved.monsterCollection, saved.caughtMons || [])
      );
      setMonsterCollection(migratedCollection);
      const migratedEggState = migrateEggState(saved.eggInventory, saved.hatcherySlots, saved.pendingEggs || []);
      setEggInventory(migratedEggState.eggInventory);
      setHatcherySlots(syncHatcherySlots(migratedEggState.hatcherySlots));
      if (saved.wrongWords)   setWrongWords(saved.wrongWords);
      if (saved.wordMemory)   setWordMemory(saved.wordMemory);
      if (saved.enemyKills)   setEnemyKills(saved.enemyKills);
      if (saved.streakShields) { setStreakShields(saved.streakShields); restoredShields = saved.streakShields; }
      const restoredMonsterId = restoredLineId
        ? (getCatchStage(restoredLineId, saved.stageIdx ?? 0)?.id ?? null)
        : null;
      const restoredMonster = restoredMonsterId ? migratedCollection[restoredMonsterId] : null;
      setMonLv(restoredMonster?.level ?? saved.monLv ?? 1);
      setMonExp(restoredMonster?.exp ?? saved.monExp ?? 0);
      restoredStreak    = saved.streak    || 0;
      restoredLoginDays = saved.loginDays || 0;
      restoredLastLogin = saved.lastLogin || "";
      restoredEggDate   = saved.dailyEggDate || "";
    }

    // 스트릭 업데이트
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak = restoredStreak;
    if (restoredLastLogin !== today) {
      if (restoredLastLogin === yesterday) {
        newStreak = restoredStreak + 1;
      } else if (restoredLastLogin !== "") {
        // 하루 건너뜀 — 스트릭 실드 사용 또는 리셋
        if (restoredShields > 0) {
          newStreak = restoredStreak; // 실드로 유지
          setStreakShields(s => s - 1);
        } else {
          newStreak = 1; // 由ъ뀑
        }
      } else {
        newStreak = 1; // 첫 로그인
      }
      setLoginDays(d => restoredLoginDays + 1);
      setLastLogin(today);
      setBattleTickets((v) => Math.max(v, ARENA_DAILY_FLOOR));
      setArenaTicketUpdatedAt(Date.now());
    }
    setStreak(newStreak);

    // 일일 미션 생성 (오늘 날짜 기준)
    const savedMissionDate = saved?.dailyMissionDate || "";
    if (savedMissionDate !== today) {
      setDailyMissions(makeDailyMissions());
    } else {
      setDailyMissions(saved?.dailyMissions || makeDailyMissions());
    }

    const currentWeekKey = getMissionWeekKey();
    if (saved?.weeklyMissionKey === currentWeekKey && Array.isArray(saved?.weeklyMissions)) {
      setWeeklyMissions(normalizeWeeklyMissions(saved.weeklyMissions));
      setWeeklyMissionKey(currentWeekKey);
    } else {
      setWeeklyMissions(makeWeeklyMissions());
      setWeeklyMissionKey(currentWeekKey);
    }

    // 일일 달걀 상태 복원
    setDailyEggDate(restoredEggDate);

    setPlayer({ name, classCode });

    // 첫 플레이어: 스타터 알 1개 + 튜토리얼
    if (!saved) {
      const starterLines = ["vocabmon","flame","wave","leaf"];
      const starterLine = starterLines[Math.floor(Math.random() * starterLines.length)];
      setEggInventory([createEgg("common", starterLine, "starter")]);
      setTimeout(() => setTutorialStep(1), 400);
    }

    // 진행 있으면 바로 월드로 이동
    const hasProgress = !!(restoredLineId && saved?.curBook);
    if (hasProgress) {
      setScreen("world");
      // 달걀 있으면 알림으로 안내
      const todayStr = new Date().toDateString();
      if ((saved?.dailyEggDate || "") !== todayStr) {
        // 무료 알 안내 토스트 제거 (홈 화면 버튼으로 확인 가능)
      }
      // 스트릭 알림
      if (newStreak > 1) {
        setTimeout(() => setToast(`연속 출석 ${newStreak}일 달성!`), 200);
      }
    }
  }

  // 자동 저장: 필요한 상태 스냅샷으로 Supabase에 저장
  const progressSnapshot = useMemo(() => ({
    unitStars, monLv, monExp, coins,
    battleTickets, arenaTicketUpdatedAt, arenaWins, arenaRating, battleBoost,
    lineId, stageIdx, curBook,
    streak, loginDays, lastLogin,
    caughtMons,
    pendingEggs,
    monsterCollection,
    eggInventory,
    hatcherySlots,
    wrongWords,
    wordMemory,
    enemyKills,
    dailyMissions, weeklyMissions, weeklyMissionKey, dailyEggDate, streakShields,
    dailyMissionDate: new Date().toDateString(),
  }), [
    unitStars, monLv, monExp, coins, battleTickets, arenaTicketUpdatedAt, arenaWins, arenaRating, battleBoost,
    lineId, stageIdx, curBook,
    streak, loginDays, lastLogin,
    caughtMons, pendingEggs, monsterCollection, eggInventory, hatcherySlots,
    wrongWords, wordMemory, enemyKills, dailyMissions, weeklyMissions, weeklyMissionKey, dailyEggDate, streakShields,
  ]);

  useEffect(() => {
    if (!player) return;
    const timeout = setTimeout(() => {
      saveProgress(player.name, player.classCode, progressSnapshot);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [player, progressSnapshot]);

  // BOOK SELECT — sync tab to current book's group when opening
  useEffect(()=>{
    if(screen==="bookselect" && curBook) {
      const g = BOOK_SERIES.find(b=>b.id===curBook)?.group;
      if(g) setActiveGroup(g);
    }
  },[screen]);

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=9999; },[log]);

  // Check daily login
  useEffect(()=>{
    const today = new Date().toDateString();
    if(lastLogin!==today){
      const yesterday=new Date(Date.now()-86400000).toDateString();
      setLoginDays(d=>lastLogin===yesterday?d+1:1);
      setLastLogin(today); setDailyDone(false);
    }
  },[]);

  const mon = lineId ? getCatchStage(lineId, stageIdx) : null;
  const activeMonsterEntry = mon?.id ? monsterCollection[mon.id] : null;
  const activeLineResources = lineId ? getLineResourceState(monsterCollection, lineId) : { lineExp: 0, evolutionCores: 0, duplicateCount: 0 };
  const dexProgress = useMemo(() => getDexProgress(monsterCollection), [monsterCollection]);
  const unlockLine = lid => totalStars >= MON_UNLOCK_STARS[lid];
  const evoRequirement = getEvolutionRequirement(stageIdx);
  const evoLineExp = activeLineResources.lineExp ?? 0;
  const evoCores = activeLineResources.evolutionCores ?? 0;
  const evoMissingLineExp = Math.max(0, (evoRequirement?.lineExp ?? 0) - evoLineExp);
  const evoMissingCores = Math.max(0, (evoRequirement?.evolutionCores ?? 0) - evoCores);
  const evoReady = Boolean(
    mon &&
    mon.evoLv &&
    monLv >= mon.evoLv &&
    totalStars >= EVO_UNLOCK_STARS[stageIdx + 1] &&
    stageIdx < 2 &&
    evoRequirement &&
    evoMissingLineExp === 0 &&
    evoMissingCores === 0
  );

  function grantLineResources(targetLineId, { lineExp = 0, evolutionCores = 0 } = {}) {
    if (!targetLineId) return;
    setMonsterCollection((prev) => {
      const current = getLineResourceState(prev, targetLineId);
      return applyLineResourceState(prev, targetLineId, {
        lineExp: (current.lineExp ?? 0) + lineExp,
        evolutionCores: (current.evolutionCores ?? 0) + evolutionCores,
      });
    });
  }

  function grantActiveMonsterExp(amount) {
    if (!mon?.id || amount <= 0) return { leveled: false, level: monLv, exp: monExp };
    let level = monLv;
    let exp = monExp + amount;
    let leveled = false;
    while (exp >= 60 + level * 20) {
      exp -= 60 + level * 20;
      level += 1;
      leveled = true;
    }
    setMonLv(level);
    setMonExp(exp);
    setMonsterCollection((prev) => ({
      ...prev,
      [mon.id]: {
        ...prev[mon.id],
        owned: true,
        level,
        exp,
        lineId,
        highestStage: Math.max(prev[mon.id]?.highestStage ?? 1, stageIdx + 1),
        evolvedOwned: prev[mon.id]?.evolvedOwned ?? false,
      },
    }));
    return { leveled, level, exp };
  }

  const activateMonster = useCallback((monsterId, options = {}) => {
    const meta = getMonsterStageMeta(monsterId);
    if (!meta) return false;
    const entry = monsterCollection[monsterId];
    setLineId(meta.lineId);
    setStageIdx(meta.stageIndex);
    setMonLv(entry?.level ?? 1);
    setMonExp(entry?.exp ?? 0);
    if (options.goWorld) setScreen("world");
    return true;
  }, [monsterCollection]);

  useEffect(() => {
    if (!mon?.id) return;
    if (!monsterCollection[mon.id]?.owned) return;
    setMonsterCollection((prev) => {
      const current = prev[mon.id];
      if (!current?.owned) return prev;
      if (
        current.level === monLv &&
        current.exp === monExp &&
        current.lineId === lineId &&
        current.highestStage === Math.max(current.highestStage ?? 1, stageIdx + 1)
      ) {
        return prev;
      }
      return {
        ...prev,
        [mon.id]: {
          ...current,
          level: monLv,
          exp: monExp,
          lineId,
          evolvedOwned: current.evolvedOwned ?? false,
          highestStage: Math.max(current.highestStage ?? 1, stageIdx + 1),
        },
      };
    });
  }, [monsterCollection, mon?.id, monLv, monExp, lineId, stageIdx]);

  function tryEvolve() {
    if(!evoReady) return;
    const evoLine = getCatchLineById(lineId);
    const currentStage = evoLine?.stages[stageIdx];
    const nextStage = evoLine?.stages[stageIdx + 1];
    if (!currentStage || !nextStage || !evoRequirement) return;
    sfxEvolveStart();
    setEvoFromName(currentStage.name);
    setNewMonName(nextStage.name);
    setEvoAnim(true);
    setTimeout(()=>{
      setMonsterCollection((prev) => {
        const currentEntry = prev[currentStage.id] || {};
        const nextEntry = prev[nextStage.id] || {};
        const lineResources = getLineResourceState(prev, lineId);
        const spentLineExp = Math.min(lineResources.lineExp ?? 0, evoRequirement.lineExp);
        const spentCores = Math.min(lineResources.evolutionCores ?? 0, evoRequirement.evolutionCores);
        const nextLineExp = Math.max(0, (lineResources.lineExp ?? 0) - spentLineExp);
        const nextCores = Math.max(0, (lineResources.evolutionCores ?? 0) - spentCores);
        const nextCollection = {
          ...prev,
          [currentStage.id]: {
            owned: true,
            level: currentEntry.level ?? monLv,
            exp: currentEntry.exp ?? monExp,
            duplicateCount: currentEntry.duplicateCount ?? 0,
            lineExp: nextLineExp,
            evolutionCores: nextCores,
            evolvedOwned: currentEntry.evolvedOwned ?? false,
            seenAt: currentEntry.seenAt ?? Date.now(),
            lineId,
            highestStage: Math.max(currentEntry.highestStage ?? 1, stageIdx + 1),
          },
          [nextStage.id]: {
            owned: true,
            level: nextEntry.level ?? monLv,
            exp: nextEntry.exp ?? monExp,
            duplicateCount: nextEntry.duplicateCount ?? 0,
            lineExp: nextEntry.lineExp ?? nextLineExp,
            evolutionCores: nextEntry.evolutionCores ?? nextCores,
            evolvedOwned: stageIdx + 1 >= 2 ? true : (nextEntry.evolvedOwned ?? false),
            seenAt: nextEntry.seenAt ?? Date.now(),
            lineId,
            highestStage: Math.max(nextEntry.highestStage ?? 1, stageIdx + 2),
          },
        };
        return applyLineResourceState(nextCollection, lineId, {
          lineExp: nextLineExp,
          evolutionCores: nextCores,
        });
      });
      setStageIdx(s=>s+1);
      setEvoAnim(false);
      sfxEvolveDone();
      setShowEvoModal(true);
    },1800);
  }

  // Get stars for a unit+stage key (aggregates across sub-stages)
  const getUnitStars = (uid, stg, diff="easy") => {
    if (player?.name?.toLowerCase() === "master") return 3;
    const bk = curBook||"ww5";
    const pre = `${bk}_${uid}_${stg}_`;
    const suf = `_${diff}`;
    return Math.max(
      unitStars[`${pre}boss${suf}`] || 0,
      ...[0,1,2,3].map(i => unitStars[`${pre}s${i}${suf}`] || 0),
      unitStars[`${bk}_${uid}_${stg}_${diff}`] || 0  // backward compat
    );
  };

  const isMaster = player?.name?.toLowerCase() === "master";

  function isDifficultyUnlocked(uid, stg, diff) {
    if (isMaster) return true;
    if (diff === "easy") return true;
    if (diff === "normal") return getUnitStars(uid, stg, "easy") >= 1;
    if (diff === "hard")   return getUnitStars(uid, stg, "normal") >= 1;
    if (diff === "hell")   return getUnitStars(uid, stg, "hard") >= 1;
    return false;
  }

  // Calc stars from battle result (only called when didWin=true)
  function calcStars(wc,total) {
    if(wc===0) return 3;
    if(wc<=Math.ceil(total*0.25)) return 2;
    return 1;
  }

  // Build recall opts (Korean ??English: distractors from same unit)
  function getRecallOpts(word) {
    const others = getWordsForUnit(curBook||"ww5", parseInt(word.unit)).filter(w=>w.w!==word.w);
    const shuffled = shuffle(others).slice(0,3);
    return shuffle([word.w, ...shuffled.map(w=>w.w)]);
  }

  // Build master opts (English word shown ??pick Korean meaning)
  function getMasterOpts(word) {
    const others = getWordsForUnit(curBook||"ww5", parseInt(word.unit)).filter(w=>w.w!==word.w);
    const shuffled = shuffle(others).slice(0,3);
    return shuffle([word.m, ...shuffled.map(w=>w.m)]);
  }

  function showEnemyNotice(enemy, title, body) {
    const trait = getEnemyTrait(enemy);
    const notice = {
      id: `${enemy?.id || "enemy"}-${Date.now()}-${Math.random()}`,
      enemyId: enemy?.id,
      icon: trait?.icon || "⚠️",
      title,
      body,
      color: enemy?.color || "#78E6FF",
    };
    setEnemyNotice(notice);
    setTimeout(() => {
      setEnemyNotice((current) => current?.id === notice.id ? null : current);
    }, 2200);
  }

  function buildBattleOptions(word, stg, enemy = curEnemy, bookId = curBook || "ww5", unitId = curUnit) {
    const base = stg === 2 ? getMasterOpts(word) : getOpts(word);
    return getEnemyAdjustedOptions(enemy, word, stg, bookId, unitId || word?.unit, base);
  }

  function startBattle(uid, stg=0, bookId=null, diff="easy", subIdx=0) {
    const bk = bookId||curBook||"ww5";
    const allWords = getWordsForUnit(bk, uid);
    const subStages = getSubStages(bk, uid);
    const words = shuffle(subIdx === 4 ? allWords : (subStages[subIdx] || allWords));
    if(!words.length) return;
    const enemy = getEnemy(uid);
    const effMon = mon;
    if (!effMon) return;
    if(bookId) setCurBook(bookId);
    const scaledEnemy = {...enemy, hp: words.length};
    setDifficulty(diff);
    const trait = getEnemyTrait(enemy);
    setTimer(getEnemyTimerSec(enemy, diff));
    setCurUnit(uid); setBattleStage(stg); setCurSubStage(subIdx); setCurEnemy(scaledEnemy);
    setQueue(words); setWrongQueue([]); setQIdx(0);
    setCurOpts(getEnemyAdjustedOptions(enemy, words[0], stg, bk, uid, stg===2 ? getMasterOpts(words[0]) : getOpts(words[0])));
    setPHp(effMon.hp); setEHp(words.length);
    setWrongCount(0); setCorrectCount(0);
    setLastBattleReward(null);
    setEnemyBattleState(createEnemyBattleState(enemy));
    setEnemyNotice(null);
    setMaxCombo(0);
    setBattleFocus(0);
    setFocusBurstUsed(false);
    const objective = rollBattleObjective(words.length);
    setBattleObjective(objective);
    const stgLabel=["EXPLORE","RECALL","MASTER"][stg];
    const subLabel = subIdx === 4 ? "👑 BOSS" : `Stage ${subIdx+1}`;
    setLog([
      `A wild ${enemy.name} appeared!`,
      `${stgLabel} · ${subLabel}`,
      trait ? `학습 방해자 능력: ${trait.title} - ${trait.short}` : null,
      `보너스 목표: ${objective.title}`,
      stg===0 ? "뜻을 보고 영어 단어를 고르세요." : stg===1 ? "소리를 듣고 영어 단어를 고르세요." : "영어 단어 뜻을 직접 떠올리세요.",
    ].filter(Boolean));
    setPhase("question"); setSel(null); setComboStr(0); setDmgVal(null);
    sfxBattleStart();
    if (trait) showEnemyNotice(enemy, `학습 방해자 능력 · ${trait.title}`, trait.desc);
    setScreen("battle");
  }

  function answer(opt) {
    if(phase!=="question"||sel) return;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const isTimeout = opt === "__timeout__";
    setSel(isTimeout ? null : opt); setPhase("anim");
    const word=queue[qIdx];
    // correct answer depends on stage
    const correctAns = battleStage===2 ? word.m : word.w;
    const correct = !isTimeout && opt===correctAns;
    const effMon = mon;
    if (!effMon) return;
    const eff = {...effMon, atk:effMon.atk+monLv*2};

    if(correct) {
      const ns=comboStr+1; setComboStr(ns);
      setMaxCombo(m => Math.max(m, ns));
      const baseFocusGain = ns >= 3 ? 34 : 24;
      const focusGain = curEnemy?.id === "nullvoid" ? Math.max(1, Math.round(baseFocusGain * 0.7)) : baseFocusGain;
      setBattleFocus(prev => Math.min(100, prev + focusGain));
      const base=calcDmg(eff.atk,curEnemy.def);
      const final=ns>=3?Math.floor(base*1.65):base;
      const newE=Math.max(0,eHp-1);
      const trait = getEnemyTrait(curEnemy);
      const phase2Triggered = enemyBattleState && !enemyBattleState.phase2 && newE > 0 && newE <= Math.ceil(curEnemy.hp * 0.4);
      setCorrectCount(c=>c+1);
      setEnemyBattleState(prev => prev ? ({
        ...prev,
        recoveredAfterWrong: prev.recoveredAfterWrong || (curEnemy?.id === "forgex" && (prev.wrongHits || 0) > 0),
        blankusCorrect: curEnemy?.id === "blankus" ? (prev.blankusCorrect || 0) + 1 : prev.blankusCorrect,
        confuzorBestCombo: curEnemy?.id === "confuzor" ? Math.max(prev.confuzorBestCombo || 0, ns) : prev.confuzorBestCombo,
      }) : prev);
      setWordMemory(prev => updateWordMemoryMap(prev, word, { correct: true, book: curBook || "ww5", unit: curUnit }));
      setLog(p=>[
        ...p,
        `${ns>=3?`콤보 ${ns}! `:""}정답 "${battleStage===2?word.m:word.w}" · -${final}HP`,
        phase2Triggered && trait ? trait.phase2Text : null,
      ].filter(Boolean));
      if (phase2Triggered) {
        setEnemyBattleState(prev => prev ? ({ ...prev, phase2: true, traitTriggered: true }) : prev);
        showEnemyNotice(curEnemy, "2페이즈 돌입", trait?.phase2Text || `${curEnemy.name}의 압박이 강해집니다.`);
        sfxWrong();
      }
      const expGain = 22 + (ns>=3?10:0);
      setFeedback({type:"correct", msg:`정답! +${expGain} EXP${curEnemy?.id==="nullvoid"?" · FOCUS 침식":ns>=3?` · 콤보 ${ns}`:""}`});
      setTimeout(()=>setFeedback(null), 800);

      // 미션 진행 업데이트
      setDailyMissions(prev => updateMissionProgress(prev, {
        correct10: 1,
        correct20: 1,
        words15: 1,
        combo5: (mission) => ns >= mission.target ? mission.target : 0,
      }));

      // 정답: 플레이어가 먼저 공격
      sfxCorrect();
      setAttackP(true);                          // 플레이어 공격 시작
      setTimeout(()=>{
        // 충돌 시점 (진행 35% 지점)
        setShakeE(true);
        setEHp(newE);
        setDmgVal({val:final,correct:true});
        sfxHitEnemy();
      }, 350);
      setTimeout(()=>{ setShakeE(false); }, 750);
      setTimeout(()=>{ setAttackP(false); }, 850); // 플레이어 복귀 완료
      setTimeout(()=>{ setDmgVal(null); }, 1200);
      setTimeout(()=>{ newE<=0?endBattle(true):nextWord(); }, 1050);

    } else {
      setComboStr(0);
      const focusLoss = curEnemy?.id === "nullvoid" ? 30 : 18;
      setBattleFocus(prev => Math.max(0, prev - focusLoss));
      const baseEnemyDmg=calcDmg(curEnemy.atk,8);
      const forgexMult = curEnemy?.id === "forgex" ? (wrongCount + 1 >= 2 ? 1.4 : 1.25) : 1;
      const ed=Math.round(baseEnemyDmg * forgexMult);
      const newP=Math.max(0,pHp-ed);
      const newWC=wrongCount+1;
      setWrongCount(newWC);
      setEnemyBattleState(prev => prev ? ({
        ...prev,
        traitTriggered: true,
        wrongHits: (prev.wrongHits || 0) + 1,
      }) : prev);
      const missedWord = { ...word, book: curBook || "ww5", unit: curUnit, memoryKey: getWordMemoryKey(word, curBook || "ww5", curUnit) };
      setWordMemory(prev => updateWordMemoryMap(prev, missedWord, { correct: false, book: curBook || "ww5", unit: curUnit }));
      setWrongQueue(q=>[...q,missedWord]);
      // 영구 오답 저장 (복습랜드)
      setWrongWords(prev => {
        if (prev.some(x=>x.w===word.w && x.m===word.m)) return prev;
        return [...prev, missedWord];
      });
      const traitLine = curEnemy?.id === "forgex"
        ? `FORGEX 실수 증폭! 피해 x${forgexMult.toFixed(2)}`
        : curEnemy?.id === "nullvoid"
          ? "NULLVOID 집중 침식! FOCUS 추가 감소"
          : null;
      setLog(p=>[...p,`오답 "${battleStage===2?word.m:word.w}" · -${ed}HP`, traitLine].filter(Boolean));
      if (curEnemy?.id === "forgex") {
        showEnemyNotice(curEnemy, "실수 증폭 발동", wrongCount + 1 >= 2 ? "반복 오답으로 공격 피해가 더 크게 올랐습니다." : "오답을 먹고 이번 공격 피해가 증가했습니다.");
      } else if (curEnemy?.id === "nullvoid") {
        showEnemyNotice(curEnemy, "집중 침식 발동", "오답으로 FOCUS가 추가로 무너졌습니다.");
      }
      // VOC-105: 오답 피드백 (랜덤 메시지)
      const revMsgs = [
        "다음엔 복습랜드에서 다시 잡자.",
        "틀린 단어가 복습랜드에 쌓였습니다.",
        "복습 후보 등록 완료.",
        "실수 포착. 다시 도전하세요.",
        "약점 발견. 다음엔 잡습니다.",
      ];
      setFeedback({type:"wrong", msg: revMsgs[Math.floor(Math.random()*revMsgs.length)]});
      setTimeout(()=>setFeedback(null), 1000);

      // 오답: 적이 플레이어로 공격
      sfxWrong();
      setAttackE(true);                          // 적 공격 시작
      setTimeout(()=>{
        // 충돌 시점
        setShakeP(true);
        setPHp(newP);
        setDmgVal({val:ed,correct:false});
        sfxHitPlayer();
      }, 350);
      setTimeout(()=>{ setShakeP(false); }, 750);
      setTimeout(()=>{ setAttackE(false); }, 850); // 적 복귀 완료
      setTimeout(()=>{ setDmgVal(null); }, 1200);
      setTimeout(()=>{ newP<=0?endBattle(false,newWC):nextWord(newWC); }, 1050);
    }
  }

  function useFocusBurst() {
    if (phase !== "question" || sel || battleFocus < 100) return false;
    const word = queue[qIdx];
    if (!word) return false;
    const correctAns = battleStage === 2 ? word.m : word.w;
    setFocusBurstUsed(true);
    if (curEnemy?.id === "nullvoid") {
      setEnemyBattleState(prev => prev ? ({ ...prev, nullvoidFocus: true, traitTriggered: true }) : prev);
    }
    setBattleFocus(0);
    setDailyMissions(prev => updateMissionProgress(prev, { focus1: 1 }));
    setWeeklyMissions(prev => updateMissionProgress(prev, { weeklyFocus: 1 }));
    setLog(p => [...p, "FOCUS BURST! 확신의 일격을 사용했습니다."]);
    setFeedback({ type:"correct", msg:"집중 폭발! 정답을 꿰뚫었습니다." });
    sfxReward();
    setTimeout(() => answer(correctAns), 30);
    return true;
  }

  function nextWord(wc=wrongCount) {
    const nxt=qIdx+1;
    if(nxt>=queue.length){endBattle(true,wc);return;}
    setQIdx(nxt);
    const w=queue[nxt];
    setCurOpts(buildBattleOptions(w, battleStage, curEnemy));
    setSel(null); setPhase("question");
    setTimer(getEnemyTimerSec(curEnemy, difficulty));
  }

  useEffect(() => {
    if (screen !== "battle" || phase !== "question" || timer === null) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setTimeout(() => answer("__timeout__"), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [screen, phase, qIdx]);

  function endBattle(didWin, wc=wrongCount) {
    stopBGM();
    if(didWin) {
      sfxVictory();
      setTimeout(sfxReward, 360);
    } else sfxDefeat();
    setPhase("end"); setWon(didWin);
    if(didWin){
      const total=queue.length;
      const stars=calcStars(wc,total);
      const subLabel = curSubStage === 4 ? "boss" : `s${curSubStage}`;
      const key=`${curBook||"ww5"}_${curUnit}_${battleStage}_${subLabel}_${difficulty}`;
      setUnitStars(prev=>({...prev,[key]:Math.max(prev[key]||0,stars)}));
      const diffMult = {easy:1, normal:1.2, hard:1.5, hell:2}[difficulty] || 1;
      const hpPct = Math.round((pHp / Math.max(1, mon.hp)) * 100);
      const objectiveComplete = evaluateBattleObjective(battleObjective, {
        wrongCount: wc,
        maxCombo,
        focusBurstUsed,
        hpPct,
        stars,
      });
      const enemyBonus = evaluateEnemyBonus(curEnemy, enemyBattleState, {
        didWin,
        wrongCount: wc,
        total,
        maxCombo,
        focusBurstUsed,
      });
      const bonusCoins = objectiveComplete ? (battleObjective?.bonusCoins || 0) : 0;
      const bonusExp = objectiveComplete ? (battleObjective?.bonusExp || 0) : 0;
      const bonusLineExp = objectiveComplete ? (battleObjective?.bonusLineExp || 0) : 0;
      const enemyBonusCoins = enemyBonus?.coins || 0;
      const enemyBonusLineExp = enemyBonus?.lineExp || 0;
      const ec = Math.round((20+curUnit*8) * diffMult) + bonusCoins + enemyBonusCoins;
      const ex = Math.round((40+curUnit*12) * diffMult) + bonusExp;
      setCoins(c=>c+ec);
      if(!dailyDone){ setDailyDone(true); }
      const levelResult = grantActiveMonsterExp(ex);
      const lineExpGain = Math.round((10 + stars * 6) * diffMult) + bonusLineExp + enemyBonusLineExp;
      const coreGain = difficulty === "hell" && stars >= 2 ? 1 : 0;
      grantLineResources(lineId, { lineExp: lineExpGain, evolutionCores: coreGain });
      setEnemyKills(prev => ({ ...prev, [curEnemy.id]: (prev[curEnemy.id] || 0) + 1 }));
      setLog(p=>[
        ...p,
        `Victory! +${ec}G +${ex}EXP · 라인EXP +${lineExpGain}${coreGain ? " · 코어 +1" : ""} · ${stars}★`,
        objectiveComplete ? `보너스 목표 완료! ${battleObjective.rewardText}` : null,
        enemyBonus?.completed ? `적 공략 보너스 완료! ${enemyBonus.rewardText}` : null,
        levelResult.leveled ? `${mon.name} grew to Lv.${levelResult.level}!` : null,
      ].filter(Boolean));

      // 알 보상 + 일일 미션 업데이트
      const totalQ = queue.length;
      const accuracy = totalQ > 0 ? (totalQ - wc) / totalQ : 0;
      let eggRarity = rollEggRarity(accuracy);
      if (difficulty === "hard" && eggRarity === "common") eggRarity = "rare";
      if (difficulty === "hell") {
        if (eggRarity === "common") eggRarity = "rare";
        if (eggRarity === "rare" && Math.random() < 0.3) eggRarity = "superrare";
      }
      const possLines = EGG_DROP[eggRarity] || EGG_DROP.common;
      const pickedLine = possLines[Math.floor(Math.random() * possLines.length)];
      // 시간 기반 부화 메타: 전투 보상 알은 인벤토리에 추가
      addEggToInventory(eggRarity, pickedLine, "unit_clear");

      // 유닛 클리어 미션 업데이트
      setDailyMissions(prev => updateMissionProgress(prev, { unit1: 1 }));
      setWeeklyMissions(prev => updateMissionProgress(prev, {
        weeklyStars: stars,
        weeklyClears: 1,
      }));
      setLastBattleReward({
        won: true,
        stars,
        coins: ec,
        exp: ex,
        lineExp: lineExpGain,
        core: coreGain,
        eggRarity,
        eggLineId: pickedLine,
        wrongCount: wc,
        total,
        maxCombo,
        focusBurstUsed,
        objective: battleObjective ? {
          ...battleObjective,
          completed: objectiveComplete,
        } : null,
        enemyBonus,
        leveled: levelResult.leveled,
        level: levelResult.level,
      });
    } else {
      setLog(p=>[...p,`${mon.name} fainted...`]);
      setLastBattleReward({
        won: false,
        wrongCount: wc,
        total: queue.length,
        maxCombo,
        focusBurstUsed,
        objective: battleObjective ? {
          ...battleObjective,
          completed: false,
        } : null,
        enemyBonus: evaluateEnemyBonus(curEnemy, enemyBattleState, { didWin:false, wrongCount: wc, total: queue.length, maxCombo, focusBurstUsed }),
      });
    }
    setTimeout(()=>{
      setScreen("result");
      // 오답 3개 이상이면 Revenge 프롬프트 (결과 화면 1.5초 후)
      setTimeout(()=>{
        setWrongWords(cur => {
          if (cur.length >= 3) setShowRevengePrompt(true);
          return cur;
        });
      }, 1500);
    }, 1400);
  }

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === "undefined") return;
    window.__VOCAMON_TEST__ = {
      getState: () => ({
        screen,
        player,
        curBook,
        curUnit,
        battleStage,
        lineId,
        stageIdx,
        monId: mon?.id ?? null,
        monLv,
        monExp,
        coins,
        qIdx,
        queueLength: queue.length,
        phase,
        won,
        eggInventoryCount: eggInventory.length,
        readyEggCount,
        runningEggCount,
        dexProgress,
        activeMonsterEntry,
        monsterCollection,
        hatcherySlots,
        dailyMissions,
        weeklyMissions,
        wrongWords,
        wordMemory,
        memoryStats: getMemoryStats(wordMemory, wrongWords),
        lastBattleReward,
        battleFocus,
        battleObjective,
        curEnemyId: curEnemy?.id || null,
        enemyBattleState,
        enemyKills,
        focusBurstUsed,
        maxCombo,
      }),
      chargeFocus: () => {
        if (screen !== "battle") return false;
        setBattleFocus(100);
        return true;
      },
      useFocusBurst: () => useFocusBurst(),
      answerCorrect: () => {
        if (screen !== "battle" || phase !== "question") return false;
        const word = queue[qIdx];
        if (!word) return false;
        const correctAns = battleStage === 2 ? word.m : word.w;
        answer(correctAns);
        return true;
      },
      answerWrong: () => {
        if (screen !== "battle" || phase !== "question") return false;
        const word = queue[qIdx];
        if (!word) return false;
        const correctAns = battleStage === 2 ? word.m : word.w;
        const wrongAns = (curOpts || []).find((option) => option !== correctAns);
        if (!wrongAns) return false;
        answer(wrongAns);
        return true;
      },
      setScreenForTest: (nextScreen) => {
        setScreen(nextScreen);
        return true;
      },
      prepareEvolution: () => {
        if (!lineId || !mon || !evoRequirement) return false;
        setMonsterCollection((prev) => applyLineResourceState(prev, lineId, {
          lineExp: evoRequirement.lineExp,
          evolutionCores: evoRequirement.evolutionCores,
        }));
        if (mon.evoLv) {
          setMonLv((prev) => Math.max(prev, mon.evoLv));
        }
        return true;
      },
      grantStars: (targetTotal = 12) => {
        const bookId = curBook || "ww5";
        setUnitStars((prev) => {
          const next = { ...prev };
          let total = Object.values(next).reduce((sum, value) => sum + value, 0);
          if (total >= targetTotal) return prev;
          for (let uid = 1; uid <= 12 && total < targetTotal; uid += 1) {
            for (let stg = 0; stg < 3 && total < targetTotal; stg += 1) {
              const key = `${bookId}_${uid}_${stg}`;
              const current = next[key] ?? 0;
              const add = Math.min(3 - current, targetTotal - total);
              if (add > 0) {
                next[key] = current + add;
                total += add;
              }
            }
          }
          return next;
        });
        return true;
      },
      forceSave: async () => {
        if (!player) return false;
        return saveProgress(player.name, player.classCode, progressSnapshot);
      },
    };
    return () => {
      delete window.__VOCAMON_TEST__;
    };
  }, [
    screen, player, curBook, curUnit, battleStage, lineId, stageIdx, mon, monLv, monExp, coins,
    qIdx, queue, phase, won, eggInventory.length, readyEggCount, runningEggCount, dexProgress,
    activeMonsterEntry, monsterCollection, hatcherySlots, evoRequirement, progressSnapshot,
    wrongWords, wordMemory, dailyMissions, weeklyMissions, lastBattleReward,
    battleFocus, battleObjective, curEnemy, enemyBattleState, enemyKills, focusBurstUsed, maxCombo, curOpts,
  ]);
  // ─────────────────────────────────────────────────────────────────
  //  SCREENS
  // ─────────────────────────────────────────────────────────────────
  //  SCREENS

  // BOOK SELECT
  if(screen==="bookselect") {
    const GROUPS = [
      { key:"ww",  label:"Wonderful\nWorld",  color:"#F5C842" },
      { key:"bew", label:"1000\nBasic",        color:"#44CC77" },
      { key:"cew", label:"2000\nCore",         color:"#22DDAA" },
      { key:"eew", label:"4000\nEssential",    color:"#FF6644" },
    ];
    const groupBooks = BOOK_SERIES.filter(b=>b.group===activeGroup);
    const activeGroupInfo = GROUPS.find(g=>g.key===activeGroup);

    return (
      <div data-testid="bookselect-screen" className="crt page slide-up" style={{
        padding:"clamp(10px,2.5vw,16px)",gap:"clamp(8px,2vh,12px)",
        background:"radial-gradient(ellipse at 50% -10%,#1A0E2E,#0C0A18)"
      }}>
        <style>{CSS}</style>

        <ScreenTopBar title="교재 선택" subtitle="공부할 교재를 고르세요" icon={NAV_ICON.book} accent="#44CC77" onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} />

        {/* Series tab bar */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,flexShrink:0}}>
          {GROUPS.map(g=>{
            const isActive=activeGroup===g.key;
            const groupStars=Object.entries(unitStars)
              .filter(([k])=>BOOK_SERIES.filter(b=>b.group===g.key).some(b=>k.startsWith(b.id+"_")))
              .reduce((a,[,v])=>a+v,0);
            return (
              <div key={g.key} onClick={()=>setActiveGroup(g.key)} style={{
                borderRadius:10,padding:"8px 4px",textAlign:"center",cursor:"pointer",
                background:isActive?`linear-gradient(135deg,#1C182E,${g.color}33)`:"#12101E",
                border:`2px solid ${isActive?g.color+"88":"#2A2440"}`,
                transition:"all .12s"
              }}>
                <div style={{fontFamily:"var(--f-ui)",fontWeight:900,
                  fontSize:"clamp(9px,2.2vmin,11px)",color:isActive?g.color:"#4A3A60",
                  whiteSpace:"pre-line",lineHeight:1.3}}>{g.label}</div>
                {groupStars>0&&<div style={{fontFamily:"var(--f-pk)",
                  fontSize:"clamp(5px,1.2vmin,7px)",color:"#F5C842",marginTop:3}}>
                  {groupStars}★
                </div>}
              </div>
            );
          })}
        </div>

        {/* Book list for active group */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,overflowY:"auto",minHeight:0}}>
          {groupBooks.map(book=>{
            const bookStars=Object.entries(unitStars)
              .filter(([k])=>k.startsWith(book.id+"_"))
              .reduce((a,[,v])=>a+v,0);
            const maxStars=book.units*3;
            const pct=maxStars?Math.round((bookStars/maxStars)*100):0;
            const isActive=(curBook||"ww5")===book.id;
            return (
              <div key={book.id}
                data-testid={`book-card-${book.id}`}
                onClick={()=>{ setCurBook(book.id); setScreen(mon?"world":"select"); }}
                style={{
                  borderRadius:12,padding:"clamp(11px,2.2vh,16px)",
                  background:isActive?`linear-gradient(135deg,#18142C,${book.color}28)`:"#12101E",
                  border:`2px solid ${isActive?book.color+"99":"#2A2440"}`,
                  boxShadow:isActive?`0 0 18px ${book.color}22,0 4px 0 rgba(0,0,0,.6)`:"0 3px 0 rgba(0,0,0,.5)",
                  cursor:"pointer",display:"flex",alignItems:"center",
                  gap:"clamp(10px,2.5vw,16px)",transition:"all .12s",flexShrink:0
                }}>
                <div style={{fontSize:"clamp(28px,7vmin,38px)",flexShrink:0,
                  filter:`drop-shadow(0 0 6px ${book.color}55)`}}>{book.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",
                      color:book.color}}>{book.subtitle}</span>
                    {isActive&&<span style={{fontFamily:"var(--f-pk)",
                      fontSize:"clamp(6px,1.4vmin,7px)",color:book.color,
                      background:book.color+"22",padding:"2px 6px",borderRadius:6}}>NOW</span>}
                  </div>
                  {/* progress bar */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{flex:1,height:6,background:"#0E0A18",borderRadius:3,overflow:"hidden",
                      border:"1px solid #1A1828"}}>
                      <div style={{height:"100%",borderRadius:3,
                        background:`linear-gradient(90deg,${book.color}77,${book.color})`,
                        width:`${pct}%`,transition:"width .4s ease"}}/>
                    </div>
                    <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",
                      color:"#F5C842",flexShrink:0,minWidth:40}}>{bookStars}/{maxStars}</span>
                  </div>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",
                    color:"#4A3A60"}}>
                    Unit 1~{book.units} · 총 {book.units*20}단어 · {pct}% 완료
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ScreenBottomNav onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} />
      </div>
    );
  }

  // 관리자 모드
  if (teacherMode) return <TeacherDashboard onExit={() => setTeacherMode(false)} />;

  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "monsters") {
    return <MonsterPreviewScreen />;
  }

  // 로그인 전이면 로그인 화면 표시
  if (!player) return (
    <LoginScreen
      onLogin={async (name, classCode) => {
        const result = await handleLogin(name, classCode);
        if (result === "banned") return "🚫 접근이 차단되었습니다. 선생님께 문의하세요.";
        return null;
      }}
      onTeacher={() => setTeacherMode(true)}
    />
  );

  // Toast wrapper helper ??renders on top of any screen
  const toastEl = toast ? <Toast msg={toast} onDone={()=>setToast(null)}/> : null;

  // 튜토리얼 오버레이 (첫 플레이어만)
  if (tutorialStep > 0) {
    return (
      <div className="crt page">
        <style>{CSS}</style>
        <TutorialOverlay
          step={tutorialStep}
          onNext={() => {
            if (tutorialStep >= TUTORIAL_STEPS.length) setTutorialStep(0);
            else setTutorialStep(s => s + 1);
          }}
          onSkip={() => setTutorialStep(0)}
        />
      </div>
    );
  }

  // PWA 설치 프롬프트
  const InstallBanner = () => showInstallBanner ? (
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,zIndex:9999,
      background:"linear-gradient(135deg,#2D1B6B,#1A0533)",
      borderTop:"2px solid #7B2FBE",
      padding:"14px 18px",display:"flex",alignItems:"center",gap:"12px",
      boxShadow:"0 -4px 24px #7B2FBE44",
    }}>
      <img src="/icon-192.png" alt="icon" style={{width:52,height:52,borderRadius:12,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{color:"#fff",fontWeight:700,fontSize:15,lineHeight:1.3}}>
          홈 화면에 추가하고 더 빠르게 시작하세요
        </div>
        <div style={{color:"#C77DFF",fontSize:12,marginTop:2}}>
          앱처럼 바로 실행할 수 있어요.
        </div>
      </div>
      <button onClick={handleInstall} style={{
        background:"#7B2FBE",color:"#fff",border:"none",borderRadius:10,
        padding:"9px 16px",fontWeight:700,fontSize:14,cursor:"pointer",
        whiteSpace:"nowrap",flexShrink:0,
      }}>추가하기</button>
      <button onClick={dismissInstallBanner} style={{
        background:"transparent",color:"#888",border:"none",
        fontSize:20,cursor:"pointer",padding:"4px 6px",flexShrink:0,lineHeight:1,
      }}>×</button>
    </div>
  ) : null;

  // TITLE
  if(screen==="title") {
    const today = new Date().toDateString();
    const hasFreeEgg = dailyEggDate !== today;
    const doneMissions = dailyMissions.filter(m=>m.done).length;
    const allMissionsDone = doneMissions >= dailyMissions.length && dailyMissions.length > 0;
    const weeklyList = weeklyMissions.length > 0 ? weeklyMissions : makeWeeklyMissions();
    const weeklyDone = weeklyList.filter(m=>m.done).length;
    const allWeeklyDone = weeklyDone >= weeklyList.length && weeklyList.length > 0;
    const memoryStats = getMemoryStats(wordMemory, wrongWords);
    const firstEgg = pendingEggs[0];
    const eggLine = firstEgg ? CATCH_MON_LINES.find(l=>l.lineId===firstEgg.lineId) : null;
    const storyChapter = getStoryChapter({
      totalStars,
      dexCompleted: dexProgress.completedLines,
      arenaWins,
    });
    const battlePower = calcBattlePower(progressSnapshot);

    function claimDailyEgg() {
      if (!hasFreeEgg) return;
      const possLines = EGG_DROP.common;
      const lineId2 = possLines[Math.floor(Math.random() * possLines.length)];
      addEggToInventory("common", lineId2, "daily");
      setDailyEggDate(today);
      setToast("무료 알을 받았습니다. 알 탭에서 부화를 시작하세요.");
    }

    const activeBook = BOOK_SERIES.find(b=>b.id===(curBook||"ww5"));
    const primaryCta = readyEggCount > 0
      ? { label:"부화 완료 알 확인", fn:()=>setScreen("eggs") }
      : { label:(lineId && totalStars > 0) ? "학습 계속하기" : "게임 시작", fn:()=>setScreen(mon?"world":"bookselect") };
    const focusCards = [
      {
        step:"01",
        title:"오늘의 학습",
        meta:allMissionsDone ? "미션 완료 · 추가 학습 가능" : `미션 ${doneMissions}/${dailyMissions.length || 3} · ${activeBook?.subtitle || "교재 선택"}`,
        cta:mon ? "월드로 이동" : "교재 고르기",
        icon:NAV_ICON.book,
        accent:"#44CC77",
        fn:()=>setScreen(mon?"world":"bookselect"),
      },
      {
        step:"02",
        title:memoryStats.due > 0 ? "오늘 복습" : memoryStats.weak > 0 ? "약점 공략" : "복습랜드",
        meta:`예정 ${memoryStats.due}개 · 약점 ${memoryStats.weak}개 · 오답 ${memoryStats.mistakes}개`,
        cta:"기억 회복",
        icon:NAV_ICON.revenge,
        accent:"#78E6FF",
        fn:()=>setScreen("revenge"),
      },
      {
        step:"03",
        title:readyEggCount > 0 ? "부화 완료" : "알 관리",
        meta:readyEggCount > 0 ? `${readyEggCount}개 수령 대기` : runningEggCount > 0 ? `${runningEggCount}개 부화 중` : hasFreeEgg ? "오늘의 무료 알 가능" : `보관 ${pendingEggs.length}개`,
        cta:readyEggCount > 0 ? "지금 깨기" : "부화실 열기",
        icon:NAV_ICON.eggs,
        accent:"#FF8844",
        fn:()=>setScreen("eggs"),
      },
      {
        step:"04",
        title:"수집 목표",
        meta:`도감 ${dexProgress.completedLines}/${dexProgress.totalLines} 라인 · 발견 ${dexProgress.ownedMonsters}/${dexProgress.totalMonsters}`,
        cta:"도감 보기",
        icon:NAV_ICON.dex,
        accent:"#C77DFF",
        fn:()=>setScreen("collection"),
      },
    ];

    return (
      <div data-testid="title-screen" className="crt page-y slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.2vh,14px)",
        background:"radial-gradient(ellipse at 40% 0%,#1A0E2E,#0C0A18)"
      }}>
        <style>{CSS}</style>
        {toastEl}
        <InstallBanner/>

        {/* 별 배경 */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none"}}>
          {[...Array(25)].map((_,i)=>(
            <div key={i} style={{position:"absolute",width:i%4===0?2:1,height:i%4===0?2:1,
              background:"#fff",left:`${(i*37+13)%100}%`,top:`${(i*29+7)%100}%`,
              opacity:.06+i%7*.09,borderRadius:"50%",
              animation:`pulse ${1.5+i%4*.7}s ease-in-out infinite`}}/>
          ))}
        </div>

        {/* 상단: 로고 + 스트릭 */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(20px,5vmin,32px)",color:"#F5C842",
              lineHeight:1,letterSpacing:2}}>VOCAB<span style={{color:"#FF5533"}}>MON</span>
            </div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:2}}>
              {player?.name} 님</div>
          </div>
          <div style={{textAlign:"center",background:"#1A1400",borderRadius:14,
            padding:"8px 14px",border:`2px solid ${streak>=7?"#FF9933":"#2A2000"}`}}>
            <div style={{fontSize:"clamp(20px,5vmin,28px)"}}>{streak>=7?"🔥":"📅"}</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(14px,4vmin,20px)",
              color:streak>=7?"#FF9933":"#886633",lineHeight:1}}>{streak}</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:"#6A5888"}}>STREAK</div>
          </div>
        </div>

        <div className="launch-panel">
          <div className="launch-copy">
            <div className="launch-eyebrow">TODAY ROUTE</div>
            <div className="launch-title">{readyEggCount > 0 ? "보상이 기다리고 있어요" : "한 판만 해도 성장합니다"}</div>
            <div className="launch-sub">
              학습, 보상, 수집이 한 흐름으로 이어집니다. 아래 카드 순서대로 진행하면 오늘 할 일이 끝납니다.
            </div>
          </div>
          <div className="launch-stats">
            <div className="launch-stat"><b>{streak}</b><span>연속 출석</span></div>
            <div className="launch-stat"><b>{doneMissions}/{dailyMissions.length || 3}</b><span>오늘 미션</span></div>
            <div className="launch-stat"><b>{memoryStats.due + memoryStats.weak}</b><span>복습 타겟</span></div>
            <div className="launch-stat"><b>{dexProgress.completedLines}</b><span>완성 라인</span></div>
          </div>
        </div>

        {/* 시작 버튼 */}
        <button data-testid="title-start-button" className="big-btn" onClick={primaryCta.fn}
          style={{padding:"clamp(13px,3vmin,18px)",fontSize:"clamp(15px,4vmin,18px)",
            color:"#fff",background:"linear-gradient(135deg,#3C7020,#5AA030)",
            boxShadow:"0 5px 0 #1E3A10",flexShrink:0,letterSpacing:1}}>
          {primaryCta.label}
        </button>

        <div className="questline">
          {focusCards.map(card=>(
            <QuestCard
              key={card.step}
              step={card.step}
              title={card.title}
              meta={card.meta}
              cta={card.cta}
              icon={card.icon}
              accent={card.accent}
              onClick={card.fn}
            />
          ))}
        </div>

        <div style={{background:"linear-gradient(135deg,#1A1024,#241330)",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
          border:"2px solid #7B4A2A88",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#FFB84A"}}>
                {storyChapter.title}
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#C9A878",marginTop:6,lineHeight:1.55}}>
                {storyChapter.goal}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842"}}>BP {battlePower}</div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-xs)",color:"#8C7AAE",marginTop:4}}>
                보상 {storyChapter.reward}
              </div>
            </div>
          </div>
          <button onClick={()=>setScreen("arena")} style={{
            marginTop:10,width:"100%",background:"linear-gradient(135deg,#7A2E0A,#C05A16)",color:"#fff",
            border:"none",borderRadius:10,padding:"10px 12px",fontFamily:"var(--f-ui)",fontWeight:900,
            fontSize:"var(--fs-sm)",cursor:"pointer",boxShadow:"0 4px 0 #3A1200",
          }}>
            친구 아레나 입장 · 티켓 {battleTickets}/{ARENA_MAX_TICKETS}
          </button>
        </div>

        {/* 일일 달걀 */}
        <div style={{background:"#16122A",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
          border:`2px solid ${hasFreeEgg?"#7B2FBE88":"#2A2440"}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:"clamp(28px,7vmin,36px)",animation:hasFreeEgg?"floatBob 2s ease-in-out infinite":"none"}}>
              🥚
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",
                color:hasFreeEgg?"#C77DFF":"#4A3A60"}}>
                <span data-testid="title-daily-egg-claimed-state">{hasFreeEgg ? "오늘의 무료 알" : "오늘의 무료 알 수령 완료"}</span>
              </div>
              {firstEgg && (
                <div style={{marginTop:4}}>
                  <div style={{display:"flex",justifyContent:"space-between",
                    fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#6A5888",marginBottom:3}}>
                    <span>{eggLine?.eggEmoji} {eggLine?.rarityLabel}</span>
                    <span>인벤토리 {pendingEggs.length}개</span>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#8C7AAE"}}>
                    <span data-testid="eggs-running-count">부화중 {runningEggCount}</span>
                    <span data-testid="eggs-ready-count">수령대기 {readyEggCount}</span>
                    <span data-testid="eggs-slot-count">슬롯 {unlockedHatchSlots}/3</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
              {hasFreeEgg && (
                <button data-testid="claim-daily-egg-button" onClick={claimDailyEgg} style={{
                  background:"linear-gradient(135deg,#7B2FBE,#C77DFF)",color:"#fff",
                  border:"none",borderRadius:10,padding:"8px 14px",fontWeight:700,
                  fontSize:"clamp(12px,3vw,14px)",cursor:"pointer",whiteSpace:"nowrap"
                }}>받기!</button>
              )}
              <button data-testid="title-eggs-shortcut-button" onClick={()=>setScreen("eggs")} style={{
                background:"#120E24",color:"#DCCBFF",
                border:"1px solid #3A2A60",borderRadius:10,padding:"8px 14px",fontWeight:700,
                fontSize:"clamp(12px,3vw,14px)",cursor:"pointer",whiteSpace:"nowrap"
              }}>알 탭</button>
            </div>
          </div>
          {pendingEggs.length > 1 && (
            <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#4A3A60",marginTop:6}}>
              +{pendingEggs.length-1}개 대기 중</div>
            )}
        </div>

        {/* 일일 미션 */}
        <div style={{background:"#16122A",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
          border:`2px solid ${allMissionsDone?"#44BB4488":"#2A2440"}`,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",
              color:allMissionsDone?"#44FF88":"#F5C842"}}>
              {allMissionsDone?"오늘의 미션 완료!":"오늘의 미션"}
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#6A5888"}}>
              {doneMissions}/{dailyMissions.length}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {dailyMissions.map(m=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,
                background:m.done?"#0A2A0A":"#0E0C1A",borderRadius:10,padding:"8px 12px",
                border:`1px solid ${m.done?"#44BB4444":"#2A2440"}`}}>
                <div style={{fontSize:"clamp(14px,3.5vmin,18px)"}}>{m.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"clamp(11px,3vw,13px)",
                    color:m.done?"#44FF88":"#C0B8D8",textDecoration:m.done?"line-through":"none"}}>
                    {m.label}
                  </div>
                  {!m.done && m.target > 1 && (
                    <div style={{marginTop:3,height:4,background:"#1A1A2E",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",background:"#7B2FBE",borderRadius:2,
                        width:`${Math.min(100,(m.progress/m.target)*100)}%`,transition:"width 0.3s"}}/>
                    </div>
                  )}
                </div>
                <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(9px,2.5vmin,12px)",
                  color:m.done?"#44FF88":"#4A3A60",whiteSpace:"nowrap"}}>
                  {m.done?"완료!":`${m.progress}/${m.target}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주간 미션 */}
        <div style={{background:"linear-gradient(135deg,#141A24,#1D1528)",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
          border:`2px solid ${allWeeklyDone?"#78E6FF88":"#2A3048"}`,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:10}}>
            <div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:allWeeklyDone?"#78E6FF":"#9FE9FF"}}>
                {allWeeklyDone ? "이번 주 목표 완료!" : "이번 주 성장 목표"}
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-xs)",color:"#8194B8",marginTop:4}}>
                월요일까지 진행
              </div>
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#78E6FF",whiteSpace:"nowrap"}}>
              {weeklyDone}/{weeklyList.length}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(122px,1fr))",gap:7}}>
            {weeklyList.map(m=>(
              <div key={m.id} style={{minHeight:88,display:"flex",flexDirection:"column",gap:6,justifyContent:"space-between",
                background:m.done?"#07222A":"#0E1220",borderRadius:11,padding:"9px 10px",
                border:`1px solid ${m.done?"#78E6FF66":"#263148"}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                  <span style={{fontSize:"clamp(15px,3.8vmin,20px)"}}>{m.emoji}</span>
                  <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",color:m.done?"#78E6FF":"#5E6F92"}}>
                    {m.done ? "DONE" : `${m.progress}/${m.target}`}
                  </span>
                </div>
                <div style={{fontFamily:"var(--f-ui)",fontWeight:1000,fontSize:"var(--fs-xs)",lineHeight:1.25,color:m.done?"#B7F6FF":"#C3CCE6"}}>
                  {m.label}
                </div>
                <div style={{height:4,background:"#1A2234",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",background:m.done?"#78E6FF":"#F5C842",width:`${Math.min(100,(m.progress/m.target)*100)}%`,transition:"width .3s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 복습랜드 진입 배너 */}
        {(memoryStats.due + memoryStats.weak + wrongWords.length) >= 3 && (
          <div onClick={()=>setScreen("revenge")} style={{
            background:"linear-gradient(135deg,#2A0500,#4A0800)",
            border:"2px solid #FF440088",borderRadius:14,padding:"10px 14px",
            display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0,
            animation:"mysteryShimmer 2s ease-in-out infinite",
            boxShadow:"0 0 16px #FF220033"
          }}>
            <div style={{fontSize:"clamp(22px,6vmin,30px)",animation:"floatBob 1.5s ease-in-out infinite"}}>⚔️</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(10px,2.8vmin,13px)",color:"#FF8844"}}>
                복습랜드 보상 가능
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(9px,2.3vmin,11px)",color:"#884422",marginTop:2}}>
                복습 타겟 {memoryStats.due + memoryStats.weak}개와 오답 {wrongWords.length}개가 있습니다. 성장 보상이 준비됐습니다.
              </div>
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(10px,2.5vmin,12px)",color:"#FF6644",flexShrink:0}}>GO</div>
          </div>
        )}

        {/* 하단 시스템 그리드 */}
        <div className="system-grid">
          {[
            {l:"도감", meta:`${dexProgress.completedLines}/${dexProgress.totalLines} 완성`, icon:NAV_ICON.dex, accent:"#C77DFF", fn:()=>setScreen("collection")},
            {l:"알", meta:`대기 ${pendingEggs.length} · 완료 ${readyEggCount}`, badge:readyEggCount>0?"READY":"", icon:NAV_ICON.eggs, accent:"#FF8844", fn:()=>setScreen("eggs")},
            {l:"아레나", meta:`티켓 ${battleTickets}/${ARENA_MAX_TICKETS}`, icon:NAV_ICON.arena, accent:"#FFB84A", fn:()=>setScreen("arena")},
            {l:"복습", meta:`예정 ${memoryStats.due} · 약점 ${memoryStats.weak}`, badge:(memoryStats.due+memoryStats.weak+wrongWords.length)>0?"GO":"", icon:NAV_ICON.revenge, accent:"#78E6FF", fn:()=>setScreen("revenge")},
            {l:"랭킹", meta:`반 ${player?.classCode || ""}`, icon:NAV_ICON.ranking, accent:"#FFD700", fn:()=>setScreen("leaderboard")},
            {l:"상점", meta:`${caughtMons.length>0?coins+"G":"코인 없음"}`, icon:NAV_ICON.shop, accent:"#44FF88", fn:()=>setScreen("shop")},
            {l:"파트너", meta:mon?.name || "선택", icon:NAV_ICON.partner, accent:"#78E6FF", fn:()=>setScreen("select")},
            {l:"교재", meta:BOOK_SERIES.find(b=>b.id===(curBook||"ww5"))?.subtitle || "선택", icon:NAV_ICON.book, accent:"#44CC77", fn:()=>setScreen("bookselect")},
          ].map((b,i)=>(
            <SystemCard
              key={i}
              testId={
                b.l.includes("도감") ? "nav-collection" :
                b.l.includes("알") ? "nav-eggs" :
                b.l.includes("아레나") ? "nav-arena" :
                b.l.includes("상점") ? "nav-shop" :
                b.l.includes("파트너") ? "nav-select" :
                b.l.includes("교재") ? "nav-bookselect" :
                b.l.includes("복습") ? "nav-revenge" :
                undefined
              }
              label={b.l}
              meta={b.meta}
              badge={b.badge}
              icon={b.icon}
              accent={b.accent}
              onClick={b.fn}
            />
          ))}
        </div>
      </div>
    );
  }

  // PARTNER SELECT
  if(screen==="select") {
    const ownedPartners = CATCH_MON_LINES.flatMap((line) =>
      line.stages.map((stage, index) => ({
        line,
        stage,
        index,
        entry: monsterCollection[stage.id],
      }))
    ).filter((item) => item.entry?.owned);

    return (
      <div data-testid="select-screen" className="crt page slide-up" style={{
        alignItems:"center",padding:"clamp(10px,2.5vw,18px)",gap:"clamp(8px,2vh,14px)",
      background:"radial-gradient(ellipse at 50% -10%,#1A0E2E,#0C0A18)"
      }}>
        <style>{CSS}</style>
        <ScreenTopBar title="파트너 선택" subtitle={ownedPartners.length > 0 ? "대표 몬스터를 고르세요" : "첫 라인을 선택하세요"} icon={NAV_ICON.partner} accent="#78E6FF" onBack={()=>setScreen("title")} onHome={()=>setScreen("title")} />

        <div style={{width:"100%",maxWidth:540,flex:1,display:"flex",flexDirection:"column",gap:"clamp(8px,2vh,12px)",justifyContent:"flex-start",overflowY:"auto"}}>
          {ownedPartners.length > 0 ? (
            ownedPartners.map(({ line, stage, index, entry }) => {
              const active = mon?.id === stage.id;
              const expBase = Math.max(80, 60 + (entry?.level ?? 1) * 20);
              const expPct = Math.min(100, ((entry?.exp ?? 0) / expBase) * 100);
              return (
                <div key={stage.id}
                  data-testid={`owned-partner-${stage.id}`}
                  onClick={()=>activateMonster(stage.id, { goWorld: true })}
                  style={{
                    borderRadius:14,padding:"clamp(10px,2.2vh,16px)",
                    background:active
                      ? `linear-gradient(135deg,${line.typeBg},${line.typeClr}33)`
                      : "linear-gradient(135deg,#12101E,#1A1430)",
                    border:`2px solid ${active ? line.typeClr : "#2A2440"}`,
                    boxShadow:active ? `0 0 18px ${line.typeClr}33,0 4px 0 rgba(0,0,0,.6)` : "0 4px 0 rgba(0,0,0,.45)",
                    cursor:"pointer",
                    display:"flex",alignItems:"center",gap:"clamp(10px,2.5vw,16px)"
                  }}>
                  <div style={{animation:`floatBob ${2.2+index*.3}s ease-in-out infinite`,flexShrink:0}}>
                    <stage.Sprite w={Math.min(72,Math.max(48,Math.floor(window.innerWidth*0.14)))}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                      <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:line.typeClr}}>{stage.name}</span>
                      <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:line.rarityClr}}>{line.rarityLabel}</span>
                      {active && <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#F5C842"}}>ACTIVE</span>}
                    </div>
                    <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#8C7AAE",marginBottom:6}}>
                      {line.type} · 진화 {index + 1}단계 · 중복 {entry?.duplicateCount ?? 0}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8}}>
                      <div>
                        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:"#6A5888"}}>LEVEL</div>
                        <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",color:"#E8E0F0"}}>{entry?.level ?? 1}</div>
                      </div>
                      <div>
                        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:"#6A5888"}}>LINE EXP</div>
                        <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",color:"#C77DFF"}}>{entry?.lineExp ?? 0}</div>
                      </div>
                      <div>
                        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:"#6A5888"}}>CORE</div>
                        <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",color:"#FFD37A"}}>{entry?.evolutionCores ?? 0}</div>
                      </div>
                    </div>
                    <div style={{marginTop:8,height:5,background:"#0E0A18",borderRadius:3,overflow:"hidden",border:"1px solid #2A2440"}}>
                      <div style={{height:"100%",width:`${expPct}%`,background:`linear-gradient(90deg,${line.typeClr},#FFFFFF)`,borderRadius:3}}/>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
            <div style={{
              borderRadius:16,
              padding:"clamp(12px,3vw,16px)",
              background:"linear-gradient(135deg,#101B2A,#1A1230)",
              border:"1px solid #2E6A8A66",
              boxShadow:"0 6px 18px rgba(0,0,0,.28)",
              flexShrink:0
            }}>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:1000,fontSize:"clamp(15px,3.8vw,18px)",color:"#EAF8FF"}}>
                첫 파트너 라인을 고르세요
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-xs)",lineHeight:1.45,color:"#8FB6D8",marginTop:4}}>
                처음 선택한 몬스터로 바로 Unit 1을 시작합니다. 나중에 도감에서 보유 몬스터를 파트너로 바꿀 수 있어요.
              </div>
            </div>
            {CATCH_MON_LINES.map((line) => {
              const starter = line.stages[0];
              const starterAsset = getMonsterAsset(starter.id);
              const locked = !unlockLine(line.lineId);
              const needStars = MON_UNLOCK_STARS[line.lineId];
              return (
                <div key={line.lineId}
                  data-testid={`starter-line-${line.lineId}`}
                  onClick={()=>{
                    if (locked) return;
                    const starterMeta = getMonsterStageMeta(starter.id);
                    if (starterMeta && !monsterCollection[starter.id]?.owned) {
                      setMonsterCollection((prev) => awardCaughtMonster(prev, starter).collection);
                    }
                    setLineId(line.lineId);
                    setStageIdx(0);
                    setMonLv(1);
                    setMonExp(0);
                    setScreen("world");
                  }}
                  style={{
                    borderRadius:16,padding:"clamp(12px,2.4vh,18px)",
                    background:locked ? "#0E0C1A" : `linear-gradient(135deg,#12101E,${starter.color}18)`,
                    border:`2px solid ${locked ? "#1A1828" : starter.color+"55"}`,
                    boxShadow:locked ? "none" : `0 0 20px ${starter.glow}22,0 4px 0 rgba(0,0,0,.6)`,
                    cursor:locked ? "not-allowed" : "pointer",opacity:locked ? .4 : 1,
                    display:"flex",alignItems:"center",gap:"clamp(12px,3vw,18px)"
                  }}>
                  <div style={{
                    flexShrink:0,width:"clamp(82px,25vw,118px)",height:"clamp(82px,25vw,118px)",
                    borderRadius:16,display:"grid",placeItems:"center",
                    background:`radial-gradient(circle at 50% 20%,${starter.glow}33,rgba(255,255,255,.04) 58%)`,
                    border:`1px solid ${starter.color}44`,
                    overflow:"hidden"
                  }}>
                    {starterAsset ? (
                      <img src={starterAsset.artUrl} alt="" style={{
                        width:"86%",height:"86%",objectFit:"contain",
                        filter:`drop-shadow(0 12px 16px rgba(0,0,0,.42)) drop-shadow(0 0 14px ${starter.glow}66)`,
                        opacity:locked ? .32 : 1,
                        animation:locked ? "none" : "floatBob 2.4s ease-in-out infinite"
                      }}/>
                    ) : (
                      <starter.Sprite w={Math.min(78,Math.max(58,Math.floor(window.innerWidth*.18)))}/>
                    )}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:starter.color}}>{locked ? "LOCKED" : starter.name}</span>
                      <span style={{fontSize:"clamp(7px,1.8vmin,9px)",background:starter.typeClr,color:"#fff",
                        padding:"2px 6px",borderRadius:6,fontFamily:"var(--f-ui)",fontWeight:900}}>{starter.type}</span>
                    </div>
                    <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888",marginBottom:4}}>
                      {locked ? `${needStars}★ 필요` : `${line.stages[1].name} → ${line.stages[2].name}`}
                    </div>
                    {!locked && (
                      <div style={{display:"flex",gap:10}}>
                        {[["HP",starter.hp,"#44CC77"],["ATK",starter.atk,"#FF8844"],["DEF",starter.def,"#4488FF"]].map(([k,v,c])=>(
                          <div key={k} style={{textAlign:"center"}}>
                            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:"#6A5888"}}>{k}</div>
                            <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",color:c}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </>
          )}

          <div style={{borderRadius:14,padding:"clamp(8px,2vh,12px)",
            background:"linear-gradient(135deg,#0A0818,#1A0844)",
            border:`2px solid ${totalStars>=30?"#BB66FF55":"#2A0888"}`,
            display:"flex",alignItems:"center",gap:12,opacity:totalStars>=30?1:0.5}}>
            <div style={{animation:"floatBob 3s ease-in-out infinite",flexShrink:0}}>
              <LexivoreSprite w={Math.min(62,Math.max(42,Math.floor(window.innerWidth*.13)))}/>
            </div>
            <div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#BB66FF"}}>
                {totalStars>=30?"LEXIVORE":"HIDDEN"}
              </div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888",marginTop:4}}>
                {totalStars>=30?"숨겨진 파트너 해금 완료" : `별 30개 필요 · 현재 ${totalStars}개`}
              </div>
            </div>
          </div>
        </div>

        <div style={{width:"100%",maxWidth:520,flexShrink:0}}>
          <ScreenBottomNav onBack={()=>setScreen("title")} onHome={()=>setScreen("title")} />
        </div>
      </div>
    );
  }

  // World map
  if(screen==="world"&&mon) {
    const bookInfo = BOOK_SERIES.find((b)=>b.id===(curBook||"ww5"));
    const worldMemoryStats = getMemoryStats(wordMemory, wrongWords);
    const expPct=Math.min(100,(monExp/(60+monLv*20))*100);
    return (
      <div data-testid="world-screen" className="crt page slide-up" style={{
        padding:"clamp(7px,2vmin,12px)",gap:"clamp(5px,1.5vmin,9px)",
        background:"radial-gradient(ellipse at 50% 0%,#14102A,#0C0A18)"
      }}>
        <style>{CSS}</style>
        {toastEl}

        {evoAnim&&(
          <div style={{position:"fixed",inset:0,zIndex:1000,
            background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
            animation:"evoFlash 1.8s ease"}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-lg)",color:"#330088",
              textAlign:"center",animation:"pulse .3s ease-in-out infinite"}}>
              아앗!<br/>{evoFromName || mon?.name}의 모습이...!
            </div>
          </div>
        )}

        <div onClick={()=>setScreen("bookselect")} style={{
          display:"flex",alignItems:"center",gap:8,
          background:"linear-gradient(135deg,#1C182E,#241E3A)",
          borderRadius:10,padding:"7px 12px",border:`1px solid ${bookInfo?.color||"#F5C842"}33`,
          cursor:"pointer",flexShrink:0
        }}>
          <span style={{fontSize:"clamp(18px,4vmin,24px)"}}>{bookInfo?.emoji}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",color:bookInfo?.color||"#F5C842"}}>{bookInfo?.title}</div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#6A5888"}}>{bookInfo?.subtitle}</div>
          </div>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#4A3A60"}}>교재 변경</div>
        </div>

        {showEvoModal&&(
          <div data-testid="evolution-modal" style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"var(--panel)",border:"3px solid #BB66FF",borderRadius:16,padding:"clamp(20px,5vmin,32px)",textAlign:"center",maxWidth:340,boxShadow:"0 0 40px rgba(160,80,255,.5)"}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#BB66FF",marginBottom:12}}>축하합니다!</div>
              <div style={{animation:"floatBob 2s ease-in-out infinite",marginBottom:12}}>
                {(() => { const S=mon?.Sprite; const w=Math.min(96,Math.max(60,Math.floor(window.innerWidth*.2))); return S ? <S w={w}/> : null; })()}
              </div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842",marginBottom:6}}>
                {evoFromName}가 {newMonName}로<br/>진화했습니다!
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginBottom:16}}>{mon?.desc}</div>
              <button data-testid="evolution-modal-close" className="big-btn" onClick={()=>setShowEvoModal(false)}
                style={{padding:"clamp(10px,2.5vmin,14px) 28px",fontSize:"var(--fs-sm)",color:"#fff",background:"linear-gradient(135deg,#6600CC,#AA44FF)",boxShadow:"0 4px 0 #330066"}}>
                모험 계속하기
              </button>
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#1C182E",borderRadius:10,padding:"8px 12px",border:"1px solid var(--rim)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{animation:"floatBob 2.5s ease-in-out infinite"}}>
              <mon.Sprite w={Math.min(40,Math.max(28,Math.floor(window.innerWidth*.08)))}/>
            </div>
            <div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                <span data-testid="world-active-mon-name" style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:mon.color}}>{mon.name}</span>
                <span data-testid="world-active-mon-level" style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",color:"#6A5888"}}>Lv.{monLv}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.4vmin,8px)",color:"#9966CC"}}>EXP</span>
                <div style={{width:"clamp(48px,12vw,88px)",height:5,background:"#0E0A18",borderRadius:3,overflow:"hidden",border:"1px solid var(--rim)"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#7733EE,#BB77FF)",borderRadius:3,width:`${expPct}%`,transition:"width .4s ease"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:4,fontFamily:"var(--f-ui)",fontSize:"clamp(7px,1.8vmin,9px)",color:"#8C7AAE"}}>
                <span>라인EXP {activeMonsterEntry?.lineExp ?? 0}</span>
                <span>코어 {activeMonsterEntry?.evolutionCores ?? 0}</span>
              </div>
              <div data-testid="world-evo-ready" style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"clamp(8px,2vmin,10px)",marginTop:2,color:evoReady?"#BB66FF":"#8C7AAE"}}>
                {evoReady
                  ? "EVO READY!"
                  : evoRequirement
                    ? `필요 LINE EXP ${evoLineExp}/${evoRequirement.lineExp} · CORE ${evoCores}/${evoRequirement.evolutionCores}`
                    : "최종 진화 형태"}
              </div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842"}}>💰{coins}G</div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#F5C842"}}>{totalStars}★</div>
          </div>
        </div>

        {!dailyDone&&(
          <div style={{background:"linear-gradient(135deg,#1A1000,#2A1A00)",borderRadius:10,padding:"7px 12px",border:"1px solid #443300",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#FF9933"}}>TODAY MISSION</div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#AA7722",marginTop:2}}>아무 유닛이나 클리어하면 보너스 EXP!</div>
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#FF9933"}}>GO</div>
          </div>
        )}

        <div style={{textAlign:"center",fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#4A3A60",flexShrink:0}}>SELECT UNIT</div>

        <div style={{flex:1,overflowY:"auto",minHeight:0}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"clamp(4px,1.2vmin,7px)"}}>
          {[...Array(bookInfo?.units||12)].map((_,i)=>{
            const uid=i+1;
            const u=getUnitInfo(curBook||"ww5", uid);
            const ok=isMaster||uid===1||Object.keys(unitStars).some(k=>
              k.startsWith(`${curBook||"ww5"}_${uid-1}_`)&&unitStars[k]>=1
            );
            const bestStars=Math.max(0,...[0,1,2].flatMap(s=>DIFFICULTY_MODES.map(m=>getUnitStars(uid,s,m.key))));
            return (
              <div key={uid}
                data-testid={`world-unit-${uid}`}
                role="button"
                tabIndex={ok ? 0 : -1}
                aria-disabled={!ok}
                aria-label={`Unit ${uid}${ok?"":" (잠김)"}`}
                onClick={()=>ok&&setScreen(`unitdetail_${uid}`)}
                onKeyDown={e=>{if(ok&&(e.key==="Enter"||e.key===" ")){e.preventDefault();setScreen(`unitdetail_${uid}`);}}}
                className="card-btn"
                style={{borderRadius:10,cursor:ok?"pointer":"not-allowed",opacity:ok?1:.35,background:bestStars===3?"linear-gradient(135deg,#0A1A08,#0A2A0A)":bestStars>0?"#16122A":"#110F1E",border:`2px solid ${bestStars===3?"#44CC7755":bestStars>0?"var(--rim)":"#1A1828"}`,boxShadow:bestStars===3?"0 0 10px rgba(68,204,119,.2),0 3px 0 rgba(0,0,0,.5)":"0 3px 0 rgba(0,0,0,.5)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:"clamp(6px,1.4vmin,10px) clamp(4px,1vw,8px)",textAlign:"center",minHeight:"clamp(56px,9vh,72px)"}}>
                <span style={{fontSize:"clamp(18px,4.5vmin,26px)",filter:ok?`drop-shadow(0 0 5px ${bestStars>0?"#F5C842":"rgba(255,255,255,.1)"})`:"none"}}>{ok?u.emoji:"🔒"}</span>
                <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",color:bestStars===3?"#44CC77":"#E8E0F0"}}>Unit {uid}</div>
                <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"clamp(8px,2vmin,10px)",color:"#9080B0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{u.short}</div>
                {bestStars>0&&<Stars count={bestStars} size="sm"/>}
              </div>
            );
          })}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,flexShrink:0}}>
          {[
            {l:"교재",  fn:()=>setScreen("bookselect"),  bg:"linear-gradient(135deg,#1A3020,#2A5030)", sh:"#0A1810",       dt:"world-bookselect-button"},
            {l:"도감",  fn:()=>setScreen("collection"),  bg:"linear-gradient(135deg,#3A1880,#5A28B8)", sh:"#18083A",       dt:"world-collection-button"},
            {l:`🥚 알${readyEggCount>0?"!":""}`, fn:()=>setScreen("eggs"), bg:readyEggCount>0?"linear-gradient(135deg,#4A1880,#7B2FBE)":"#1C182E", sh:readyEggCount>0?"#200A40":"#080612", dt:"world-eggs-button"},
            {l:`아레나 ${battleTickets}`, fn:()=>setScreen("arena"), bg:"linear-gradient(135deg,#7A2E0A,#C05A16)", sh:"#3A1200"},
            {l:"상점",  fn:()=>setScreen("shop"),        bg:"linear-gradient(135deg,#0A2A1A,#0A4A2A)", sh:"#041208"},
            {l:(worldMemoryStats.due + worldMemoryStats.weak + wrongWords.length)>0?"복습!":"복습", fn:()=>setScreen("revenge"), bg:(worldMemoryStats.due + worldMemoryStats.weak + wrongWords.length)>0?"linear-gradient(135deg,#08313A,#0C5266)":"#1C182E", sh:(worldMemoryStats.due + worldMemoryStats.weak + wrongWords.length)>0?"#031A22":"#080612", dt:"world-revenge-button"},
            {l:"랭킹",  fn:()=>setScreen("leaderboard"), bg:"linear-gradient(135deg,#1A1400,#2A2000)", sh:"#0A0800"},
            {l:"진화",  fn:tryEvolve, bg:evoReady?"linear-gradient(135deg,#6600CC,#AA44FF)":"#1C182E", sh:evoReady?"#330066":"#080612", disabled:!evoReady, dt:"world-evolve-button"},
            {l:"홈",    fn:()=>setScreen("title"),        bg:"#1C182E",                                 sh:"#080612",       dt:"world-home-button"},
          ].map((b,i)=>(
            <button
              key={i}
              data-testid={b.dt}
              className="big-btn" onClick={b.fn} disabled={b.disabled}
              style={{padding:"clamp(9px,2vmin,12px) 4px",fontSize:"clamp(11px,2.8vmin,13px)",color:b.disabled?"#4A3A60":"#fff",background:b.bg,boxShadow:`0 4px 0 ${b.sh}`,opacity:b.disabled?.4:1}}>
              {b.l}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Unit detail
  if(screen&&screen.startsWith("unitdetail_")&&mon) {
    const uid=parseInt(screen.split("_")[1]);
    const u=getUnitInfo(curBook||"ww5", uid);
    const wordCount=getWordsForUnit(curBook||"ww5", uid).length;
    const subStageWords=getSubStages(curBook||"ww5", uid);
    const STAGE_INFO=[
      {stg:0,label:"EXPLORE",desc:"뜻을 보고 영어 단어를 고르는 단계",color:"#44CC77",icon:"🧭"},
      {stg:1,label:"RECALL", desc:"뜻을 떠올리며 영어 단어를 복습하는 단계",color:"#FF9933",icon:"🗣️",req:1},
      {stg:2,label:"MASTER", desc:"영어 단어 뜻을 스스로 완성하는 단계",color:"#CC66FF",icon:"🏆",req:2},
    ];
    return (
      <div data-testid="unitdetail-screen" className="crt page slide-up" style={{background:"radial-gradient(ellipse at 50% 0%,#14102A,#0C0A18)"}}>
        <style>{CSS}</style>
        <StepBar
          steps={[BOOK_SERIES.find(b=>b.id===(curBook||"ww5"))?.subtitle||"교재", `Unit ${uid}`, "모드 선택"]}
          current={1}
        />
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
          padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.5vh,16px)",overflowY:"auto",overflowX:"hidden",minHeight:0}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"clamp(28px,7vmin,40px)",marginBottom:4}}>{u.emoji}</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>Unit {uid}</div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-sm)",color:"#9080B0",marginTop:2}}>{u.name}</div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:4}}>
              {wordCount}개 단어
            </div>
          </div>

          <div style={{width:"100%",maxWidth:400,display:"flex",flexDirection:"column",gap:10}}>
            {STAGE_INFO.map(({stg,label,desc,color,icon,req})=>{
              const stars=getUnitStars(uid,stg);
              const locked=!isMaster&&req&&getUnitStars(uid,req-1)<1;
              const bk=curBook||"ww5";
              // sub-stage unlock helper
              const isSubUnlocked=(si)=>{
                if(isMaster) return true;
                if(si===0) return true;
                if(si===4){ // boss: needs last regular sub-stage done
                  const lastSi=subStageWords.length-1;
                  return DIFFICULTY_MODES.some(m=>(unitStars[`${bk}_${uid}_${stg}_s${lastSi}_${m.key}`]||0)>=1);
                }
                return DIFFICULTY_MODES.some(m=>(unitStars[`${bk}_${uid}_${stg}_s${si-1}_${m.key}`]||0)>=1);
              };
              const isSubDone=(si)=>{
                const subKey=si===4?"boss":`s${si}`;
                return DIFFICULTY_MODES.some(m=>(unitStars[`${bk}_${uid}_${stg}_${subKey}_${m.key}`]||0)>=1);
              };
              return (
                <div key={stg}
                  data-testid={`unit-stage-${stg}`}
                  className="card-btn"
                  onClick={()=>!locked&&setShowDiffModal({uid,stg,subIdx:0})}
                  style={{
                    borderRadius:12,padding:"clamp(10px,2.2vh,14px)",
                    background:locked?"#0E0C1A":`linear-gradient(135deg,#14121E,${color}18)`,
                    border:`2px solid ${locked?"#1A1828":stars>0?color+"55":"var(--rim)"}`,
                    opacity:locked?.4:1,
                    cursor:locked?"not-allowed":"pointer",
                    boxShadow:locked?"none":"0 3px 0 rgba(0,0,0,.5)",
                  }}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:locked?0:8}}>
                    <div style={{fontSize:"clamp(22px,5vmin,28px)",flexShrink:0}}>{locked?"🔒":icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                        <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:locked?"#444":color}}>{label}</span>
                        <Stars count={stars} size="sm"/>
                      </div>
                      <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888"}}>{desc}</div>
                      <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                        {DIFFICULTY_MODES.map(m=>{
                          const ds=getUnitStars(uid,stg,m.key);
                          if(!isDifficultyUnlocked(uid,stg,m.key)&&ds===0) return null;
                          return <span key={m.key} style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.4vmin,8px)",color:m.color}}>{m.icon}{ds}★</span>;
                        })}
                      </div>
                    </div>
                  </div>
                  {!locked&&(
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {subStageWords.map((_,si)=>{
                        const unlk=isSubUnlocked(si);
                        const done=isSubDone(si);
                        return (
                          <button key={si}
                            onClick={e=>{e.stopPropagation();unlk&&setShowDiffModal({uid,stg,subIdx:si});}}
                            style={{
                              fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",
                              padding:"4px 8px",borderRadius:7,border:`1px solid ${done?color+"88":unlk?"#3A3050":"#1A1828"}`,
                              background:done?`${color}22`:unlk?"#1A1830":"#0E0C18",
                              color:done?color:unlk?"#9080B0":"#3A3050",
                              cursor:unlk?"pointer":"not-allowed",
                            }}>
                            {done?"✓ ":""}S{si+1}
                          </button>
                        );
                      })}
                      {/* Boss button */}
                      {(()=>{
                        const unlk=isSubUnlocked(4);
                        const done=isSubDone(4);
                        return (
                          <button
                            onClick={e=>{e.stopPropagation();unlk&&setShowDiffModal({uid,stg,subIdx:4});}}
                            style={{
                              fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",
                              padding:"4px 8px",borderRadius:7,border:`1px solid ${done?"#F5C84288":unlk?"#4A3820":"#1A1828"}`,
                              background:done?"#F5C84222":unlk?"#1E1810":"#0E0C18",
                              color:done?"#F5C842":unlk?"#AA8833":"#3A3050",
                              cursor:unlk?"pointer":"not-allowed",
                            }}>
                            {done?"✓ ":""}👑Boss
                          </button>
                        );
                      })()}
                    </div>
                  )}
                  {locked&&<div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#4A3A60",marginTop:4,paddingLeft:40}}>
                    이전 단계를 먼저 클리어하세요.
                  </div>}
                  {!locked&&wrongQueue.length>0&&curUnit===uid&&battleStage===stg&&(
                    <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",
                      color:"#EE4444",marginTop:6,animation:"pulse .8s ease-in-out infinite"}}>
                      오답 {wrongQueue.length}개 복습 필요
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {wrongQueue.length>0&&curUnit===uid&&(
            <button className="big-btn" onClick={()=>{
              const wq=shuffle(wrongQueue);
              setQueue(wq); setWrongQueue([]); setQIdx(0);
              setCurOpts(battleStage===2?getMasterOpts(wq[0]):getOpts(wq[0]));
              setCurEnemy(prev=>({...prev,hp:wq.length}));
              setPHp(mon.hp); setEHp(wq.length);
              setWrongCount(0); setCorrectCount(0);
              setPhase("question"); setSel(null); setComboStr(0);
              setLog(["오답 재도전", "틀린 단어만 다시 출제합니다."]);
              setScreen("battle");
            }} style={{width:"100%",maxWidth:400,padding:"clamp(12px,2.5vmin,16px)",
              fontSize:"var(--fs-sm)",color:"#fff",
              background:"linear-gradient(135deg,#881A1A,#BB2222)",boxShadow:"0 4px 0 #440000"}}>
              오답 재도전 ({wrongQueue.length})
            </button>
          )}

          <button data-testid="unitdetail-back-button" className="big-btn" onClick={()=>setScreen("world")}
            style={{width:"100%",maxWidth:400,padding:"clamp(10px,2.2vmin,13px)",
              fontSize:"var(--fs-sm)",color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
            BACK
          </button>

          {showDiffModal && (
            <div style={{position:"fixed",inset:0,zIndex:300,
              display:"flex",alignItems:"center",justifyContent:"center",
              background:"rgba(8,5,18,0.92)",padding:20}}
              onClick={()=>setShowDiffModal(null)}>
              <div onClick={e=>e.stopPropagation()} style={{
                background:"#12101E",border:"2px solid #2A2440",
                borderRadius:20,padding:"clamp(16px,4vw,24px)",
                maxWidth:340,width:"100%",
                boxShadow:"0 0 40px rgba(0,0,0,0.8)"}}>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",color:"#6A5888",marginBottom:4}}>
                    {showDiffModal.subIdx===4?"👑 Boss":showDiffModal.subIdx!=null?`Stage ${showDiffModal.subIdx+1}`:""}
                  </div>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>
                    난이도 선택
                  </div>
                </div>
                {DIFFICULTY_MODES.map(mode=>{
                  const unlocked = isDifficultyUnlocked(showDiffModal.uid, showDiffModal.stg, mode.key);
                  const stars = getUnitStars(showDiffModal.uid, showDiffModal.stg, mode.key);
                  return (
                    <div key={mode.key}
                      onClick={()=>{ if(unlocked){ startBattle(showDiffModal.uid, showDiffModal.stg, null, mode.key, showDiffModal.subIdx ?? 0); setShowDiffModal(null); } }}
                      style={{
                        borderRadius:12,padding:"clamp(10px,2.2vmin,14px)",marginBottom:8,
                        cursor:unlocked?"pointer":"not-allowed",
                        opacity:unlocked?1:0.35,
                        background:`linear-gradient(135deg,#14121E,${mode.color}18)`,
                        border:`2px solid ${stars>0?mode.color+"88":unlocked?mode.color+"44":"#1A1828"}`,
                        boxShadow:stars>0?`0 0 10px ${mode.color}22`:"none",
                      }}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:mode.color}}>
                          {mode.icon} {mode.label}
                        </span>
                        <Stars count={stars} size="sm" color={mode.color}/>
                      </div>
                      {mode.timerSec&&(
                        <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#6A5888"}}>
                          ⏱ {mode.timerSec}초 제한
                        </div>
                      )}
                      {!unlocked&&(
                        <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#4A3A60",marginTop:4}}>
                          이전 난이도 3성을 먼저 달성하세요
                        </div>
                      )}
                    </div>
                  );
                })}
                <button onClick={()=>setShowDiffModal(null)}
                  style={{width:"100%",marginTop:4,padding:"10px",background:"#1C182E",
                    color:"#8878AA",borderRadius:10,border:"none",cursor:"pointer",
                    fontFamily:"var(--f-ui)",fontWeight:700}}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // BATTLE
  if(screen==="battle"&&curEnemy&&mon) {
    const word=queue[qIdx];
    const u=getUnitInfo(curBook||"ww5", curUnit||1);
    const stgColor=["#44CC77","#FF9933","#CC66FF"][battleStage];
    const stgLabel=["EXPLORE","RECALL","MASTER"][battleStage];
    const bgSvg=BG_MAP[curEnemy.bgKey]||BG_PLAINS;
    const enemyTrait = getEnemyTrait(curEnemy);
    const enemyPhase2 = !!enemyBattleState?.phase2;

    // What to show in the question panel
    const isDefOnly = difficulty !== "easy";
    const isBlankusHintHidden = curEnemy.id === "blankus";

    const qPrompt = battleStage===0 ? word?.def
                  : battleStage===1 ? (isDefOnly ? word?.def : `뜻 ${word?.m}`)
                  : `단어 ${word?.w}`;
    const qHint = (isDefOnly || isBlankusHintHidden) ? null
                : battleStage===0 ? `뜻 ${word?.m}`
                : battleStage===1 ? word?.def
                : word?.def;

    return (
      <div data-testid="battle-screen" className="crt page slide-up" style={{background:"#0C0A18"}}>
        <style>{CSS}</style>
        {toastEl}
        {/* VOC-103: 단계 진행바 */}
        <StepBar
          steps={[BOOK_SERIES.find(b=>b.id===(curBook||"ww5"))?.subtitle||"교재", `Unit ${curUnit}`, stgLabel]}
          current={2}
        />

        {/* Battle field */}
        <div style={{position:"relative",flex:"0 0 auto",height:"clamp(96px,22dvh,220px)",overflow:"hidden"}}>
          {bgSvg}
          {enemyNotice&&(
            <div data-testid="enemy-skill-banner" className="enemy-skill-banner" style={{"--enemy": enemyNotice.color}}>
              <span>{enemyNotice.icon}</span>
              <div>
                <b>{enemyNotice.title}</b>
                <small>{enemyNotice.body}</small>
              </div>
            </div>
          )}

          {/* Enemy nameplate ??top left */}
          <div style={{position:"absolute",top:8,left:8,zIndex:3}}>
            <Nameplate name={curEnemy.name} typeName={curEnemy.type} typeClr={curEnemy.typeClr}
              hp={eHp} maxHp={curEnemy.hp} isEnemy/>
          </div>

          {/* Mute button ??top right corner */}
          <button onClick={toggleSound} style={{
            position:"absolute",top:8,right:8,zIndex:10,
            background:"rgba(0,0,0,0.45)",border:"1px solid rgba(255,255,255,0.18)",
            borderRadius:8,padding:"4px 8px",cursor:"pointer",
            fontSize:16,lineHeight:1,color:"#fff"
          }}>{soundOn?"🔊":"🔇"}</button>

          {/* Enemy sprite ??top right
          {/* Enemy sprite — z-index 높여서 attackE 시 플레이어 위에 올라옴 */}
          <div style={{
            position:"absolute",right:"5%",top:"4%",
            zIndex: attackE ? 6 : 2,
            transformOrigin:"center bottom",
            animation: attackE
              ? "enemyCharge .8s cubic-bezier(.3,.7,.4,1) forwards"
              : shakeE
              ? "hitRecoil .4s ease"
              : enemyPhase2
                ? "comboZoom .9s ease-in-out infinite"
                : "floatBob 3s ease-in-out infinite"
          }}>
            <div className="enemy-aura" style={{"--enemy": curEnemy.color, opacity: enemyPhase2 ? .34 : .2}}/>
            <EnemyVisual
              enemy={curEnemy}
              w={Math.min(86,Math.max(52,Math.floor(window.innerHeight*.14)))}
              hurt={shakeE}
              phase2={enemyPhase2}
            />
          </div>

          {/* Damage pop ??appears at receiver location */}
          {dmgVal&&(
            <div style={{position:"absolute",zIndex:10,pointerEvents:"none",
              right:dmgVal.correct?"8%":"auto",
              left:dmgVal.correct?"auto":"8%",
              top:"10%",
              fontFamily:"var(--f-pk)",fontSize:"clamp(13px,3.2vmin,19px)",
              color:dmgVal.correct?"#44FF88":"#FF5544",
              textShadow:"2px 2px 0 #000",animation:"dmgPop 1s ease forwards"}}>
              -{dmgVal.val}
            </div>
          )}

          {/* Screen flash on impact */}
          {shakeE&&(
            <div style={{position:"absolute",inset:0,zIndex:8,pointerEvents:"none",
              background:"#ffffff",animation:"screenFlash .45s ease forwards"}}/>
          )}
          {shakeP&&(
            <div style={{position:"absolute",inset:0,zIndex:8,pointerEvents:"none",
              background:"#FF2200",animation:"screenFlash .45s ease forwards"}}/>
          )}

          {/* Player sprite ??bottom left
          {/* Player sprite — z-index 높여서 attackP 시 적 위에 올라옴 */}
          <div style={{
            position:"absolute",left:"4%",bottom:"24%",
            zIndex: attackP ? 6 : 2,
            transformOrigin:"center bottom",
            animation: attackP
              ? "playerCharge .8s cubic-bezier(.3,.7,.4,1) forwards"
              : shakeP
              ? "hitRecoil .4s ease"
              : "floatBob 2.6s ease-in-out infinite .4s"
          }}>
            <mon.Sprite
              w={Math.min(96,Math.max(58,Math.floor(window.innerHeight*.16)))}
              hurt={shakeP}/>
          </div>

          {/* Player nameplate ??bottom right */}
          <div style={{position:"absolute",bottom:6,right:8,zIndex:3}}>
            <Nameplate name={mon.name} typeName={mon.type} typeClr={mon.typeClr}
              hp={pHp} maxHp={mon.hp} lv={monLv}/>
          </div>

          {/* Combo badge */}
          {comboStr>=2&&(
            <div style={{position:"absolute",top:8,right:8,zIndex:5,
              fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-xs)",
              background:"linear-gradient(135deg,#FF6600,#FFCC00)",
              borderRadius:20,padding:"3px 10px",color:"#fff",
              boxShadow:"0 0 14px rgba(255,140,0,.7)",
              animation:"comboZoom .5s ease-in-out infinite"}}>콤보 {comboStr}</div>
          )}

          {/* Stage badge */}
          <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",zIndex:4,
            fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",
            background:stgColor,color:"#fff",padding:"2px 10px",borderRadius:10,
            boxShadow:"0 2px 0 rgba(0,0,0,.4)"}}>
            {stgLabel}
          </div>
        </div>

        {/* Battle panel */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,
          background:"#0C0A18",padding:"clamp(7px,2vmin,11px)",gap:"clamp(5px,1.5vmin,8px)",
          position:"relative"}}>
          {/* VOC-105: 정답/오답 피드백 오버레이 */}
          <FeedbackOverlay feedback={feedback}/>

          {/* 상단 진행: 단어 진행바 + Unit label */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,gap:6}}>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#9080B0",flexShrink:0}}>
              {u?.emoji} Unit {curUnit}: {u?.name}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"clamp(1px,0.4vmin,2px)",flexShrink:0}}>
              {Array.from({length:queue.length},(_,i)=>(
                <div key={i} style={{
                  width:`clamp(5px,${Math.max(5,Math.min(14,Math.floor(140/queue.length)))}px,14px)`,
                  height:8,
                  borderRadius:2,
                  background: i<qIdx ? "#2A2040"
                            : i===qIdx ? "#FFCC00"
                            : stgColor,
                  border:"1px solid rgba(255,255,255,0.08)",
                  boxShadow: i===qIdx ? "0 0 6px #FFCC00" : "none",
                  transition:"background .2s"
                }}/>
              ))}
              <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#9080B0",marginLeft:4}}>
                {queue.length-qIdx}
              </span>
            </div>
          </div>

          {timer !== null && (() => {
            const maxSec = getEnemyTimerSec(curEnemy, difficulty) || DIFFICULTY_MODES.find(m=>m.key===difficulty)?.timerSec || 30;
            const pct = Math.max(0, (timer / maxSec) * 100);
            const tc = timer <= 5 ? "#FF2222" : timer <= 10 ? "#FF9933" : "#44CC77";
            return (
              <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:tc,
                  minWidth:36, animation:timer<=5?"pulse .5s ease-in-out infinite":"none"}}>
                  {timer}s
                </span>
                <div style={{flex:1,height:7,background:"#1A1828",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:tc,borderRadius:4,
                    transition:"width 1s linear"}}/>
                </div>
                <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",
                  color:DIFFICULTY_MODES.find(m=>m.key===difficulty)?.color}}>
                  {difficulty.toUpperCase()}
                </span>
              </div>
            );
          })()}

          {enemyTrait&&(
            <div data-testid="enemy-trait-card" className={`enemy-trait-card ${enemyPhase2 ? "phase2" : ""}`} style={{"--enemy":curEnemy.color}}>
              <span>{enemyTrait.icon}</span>
              <div>
                <b>학습 방해자 능력 · {enemyTrait.title}</b>
                <small>
                  {curEnemy.id==="blankus" ? "기억 삭제 활성화 · 힌트 숨김" :
                   curEnemy.id==="confuzor" ? "혼란 압박 활성화 · 보기/시간 교란" :
                   curEnemy.id==="nullvoid" ? "집중 침식 활성화 · FOCUS 획득 감소" :
                   `실수 증폭 활성화 · 오답 ${enemyBattleState?.wrongHits || 0}회`}
                </small>
              </div>
              <em>{enemyPhase2 ? "PHASE 2" : "ACTIVE"}</em>
            </div>
          )}

          <div className="battle-system-strip">
            <div className="battle-objective-card" data-testid="battle-objective-card">
              <b>{battleObjective?.icon || "🎯"} {battleObjective?.title || "보너스 목표"}</b>
              <span>{battleObjective?.desc || "이번 전투의 추가 목표"} · {battleObjective?.rewardText || "추가 보상"}</span>
            </div>
            <button
              data-testid="focus-burst-button"
              className={`focus-burst-btn ${battleFocus >= 100 ? "ready" : ""}`}
              disabled={phase !== "question" || !!sel || battleFocus < 100}
              onClick={useFocusBurst}
              title="정답을 맞히며 충전하고, 100%에서 확정 일격을 사용합니다."
            >
              <span>
                <b>FOCUS BURST</b>
                <span>{battleFocus >= 100 ? "사용 가능" : "정답으로 충전"}</span>
              </span>
              <strong>{battleFocus}%</strong>
              <i className="focus-meter" aria-hidden="true"><i style={{width:`${battleFocus}%`}} /></i>
            </button>
          </div>

          {/* Question card */}
          {word&&(
            <div className="battle-panel battle-question-card" style={{padding:"clamp(9px,2vmin,13px) clamp(10px,2.5vw,15px)",flexShrink:0}}>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",
                color:"#888",marginBottom:5,textTransform:"uppercase",letterSpacing:".04em"}}>
                {battleStage===0?"Definition -> Word":battleStage===1?"Korean -> Word":"Word -> Korean"}
                {isBlankusHintHidden&&(
                  <span style={{marginLeft:8,color:"#7B6E8E",fontWeight:1000}}>기억 삭제</span>
                )}
              </div>
              <div data-testid="battle-question-prompt" style={{fontFamily:"var(--f-ui)",fontWeight:800,
                fontSize:"clamp(14px,3.8vmin,17px)",
                color:"#18100E",lineHeight:1.65,wordBreak:"break-word"}}>
                {qPrompt}
              </div>
              {qHint && (
                <div data-testid="battle-question-hint" style={{marginTop:6,paddingTop:6,borderTop:"2px solid #C8C0B0",
                  fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"clamp(11px,2.8vmin,13px)",color:"#7A5A30"}}>
                  {qHint}
                </div>
              )}
            </div>
          )}

          {/* Answer options */}
          {word&&(
            <div className="battle-options-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(5px,1.5vmin,8px)",flexShrink:0}}>
              {curOpts.map((opt,i)=>{
                const correctAns=battleStage===2?word.m:word.w;
                let cls="move-btn";
                if(sel===opt) cls+=opt===correctAns?" correct":" wrong";
                else if(sel&&opt===correctAns) cls+=" reveal";
                return (
                  <button key={i} data-testid={`battle-option-${i}`} data-option={opt} className={cls}
                    disabled={phase!=="question"||!!sel}
                    onClick={()=>answer(opt)}>
                    <span style={{color:"#F5C842",marginRight:6,fontFamily:"var(--f-pk)",
                      fontSize:"clamp(8px,2vmin,10px)"}}>{["A","B","C","D"][i]}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Log */}
          <div ref={logRef} className="battle-log" style={{flex:"0 1 auto",maxHeight:"clamp(72px,14vh,104px)",overflowY:"auto",
            background:"#0A0818",borderRadius:8,border:"1px solid var(--rim)",
            padding:"clamp(5px,1.2vmin,8px) 12px"}}>
            {log.slice(-4).map((l,i,a)=>(
              <div key={i} style={{fontFamily:"var(--f-ui)",fontWeight:700,
                fontSize:"clamp(11px,2.8vmin,13px)",
                color:i===a.length-1?"#E8E0FF":"#5A4A78",marginBottom:3,lineHeight:1.5}}>{l}</div>
            ))}
          </div>

          {/* 도망가기 버튼 */}
          <button className="big-btn battle-flee-btn" onClick={()=>{
            setScreen("world");
          }}
            style={{flexShrink:0,padding:"clamp(10px,2.2vmin,13px)",
              fontSize:"var(--fs-xs)",color:"#FF6644",background:"#1C0E0A",boxShadow:"0 3px 0 #080200",border:"1px solid #442211"}}>
            🏃 도망가기</button>
        </div>
      </div>
    );
  }

  // RESULT
  if(screen==="result"&&mon) {
    const total=queue.length;
    const stars=won?calcStars(wrongCount,total):0;
    const hasWrong=wrongQueue.length>0;
    const resultSubStageCount = curUnit ? getSubStages(curBook||"ww5", curUnit).length : 4;
    const reward = lastBattleReward || {
      won,
      stars,
      coins: 0,
      exp: 0,
      lineExp: 0,
      core: 0,
      wrongCount,
      total,
    };
    const rewardEggLine = reward.eggLineId ? CATCH_MON_LINES.find(l => l.lineId === reward.eggLineId) : null;
    const rewardEggLabel = ({ common:"COMMON", rare:"RARE", superrare:"SUPER", legendary:"LEGEND" })[reward.eggRarity] || "EGG";
    const rewardEggColor = ({ common:"#8DFF9A", rare:"#78E6FF", superrare:"#C77DFF", legendary:"#FFD76A" })[reward.eggRarity] || "#FF8844";
    const resultWeeklyList = weeklyMissions.length > 0 ? weeklyMissions : makeWeeklyMissions();
    const resultDailyDone = dailyMissions.filter(m=>m.done).length;
    const resultWeeklyDone = resultWeeklyList.filter(m=>m.done).length;
    const dexPercent = Math.round((dexProgress.ownedMonsters / Math.max(1, dexProgress.totalMonsters)) * 100);
    const nextHint = readyEggCount > 0
      ? "부화 완료 알이 있어요. 알 탭에서 바로 수집 보상을 열 수 있습니다."
      : hasWrong && won
        ? "오답 복습으로 약점을 줄이면 다음 판 별 3개가 훨씬 쉬워집니다."
        : won && curSubStage < resultSubStageCount - 1
          ? `다음 Stage ${curSubStage + 2}로 이어가면 흐름이 끊기지 않습니다.`
          : won
            ? "보스전에 도전해 큰 보상과 다음 목표를 여세요."
            : "방금 틀린 단어를 다시 보면 다음 전투에서 바로 체감됩니다.";
    return (
      <div data-testid="result-screen" className="crt page-y slide-up" style={{position:"relative",
        alignItems:"stretch",justifyContent:"flex-start",padding:"clamp(14px,3vw,24px)",textAlign:"center",
        background:won?"radial-gradient(ellipse at 50% 30%,#0A2814,#0C0A18)":
                       "radial-gradient(ellipse at 50% 30%,#280808,#0C0A18)"}}>
        <style>{CSS}</style>
        <div className="result-shell">
        <div style={{marginBottom:12,animation:"floatBob 2.5s ease-in-out infinite"}}>
          <mon.Sprite w={Math.min(100,Math.max(64,Math.floor(window.innerWidth*.2)))}
            fainted={!won}/>
        </div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,4.5vmin,28px)",letterSpacing:2,
          color:won?"#F5C842":"#EE3322",
          textShadow:won?"0 0 28px rgba(245,200,66,.6),3px 3px 0 #6A3A00":"0 0 28px rgba(220,30,10,.6),3px 3px 0 #600000",
          marginBottom:8}}>{won?"VICTORY!":"DEFEAT..."}</div>

        {(() => {
          const dm = DIFFICULTY_MODES.find(m=>m.key===difficulty);
          return (
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",
              color:dm?.color,marginBottom:8}}>
              {dm?.icon} {dm?.label} MODE
            </div>
          );
        })()}

        {won&&(
          <div style={{marginBottom:12}}>
            <Stars count={stars} max={3} color={DIFFICULTY_MODES.find(m=>m.key===difficulty)?.color}/>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:6}}>
                {stars===3 ? "PERFECT! 전체 정답" : stars===2 ? "GOOD! 거의 다 맞혔어요" : "CLEAR! 다시 도전해도 좋습니다"}
            </div>
          </div>
        )}

        {hasWrong&&won&&(
          <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-sm)",
            color:"#FF8844",marginBottom:16,
            background:"#1A0E08",padding:"8px 16px",borderRadius:10,border:"1px solid #442200"}}>
            오답 {wrongQueue.length}개 복습 추천!
          </div>
        )}

        {won&&(
          <div className="reward-panel">
            <span className="reward-spark" style={{left:"9%",top:"74%",animationDelay:"0s"}}>✦</span>
            <span className="reward-spark" style={{left:"84%",top:"70%",animationDelay:".25s"}}>✦</span>
            <span className="reward-spark" style={{left:"58%",top:"82%",animationDelay:".48s"}}>✦</span>
            <div className="reward-title">
              <span>획득 보상</span>
              <span>{reward.wrongCount === 0 ? "무결점 클리어" : `정확도 ${Math.max(0, Math.round(((reward.total - reward.wrongCount) / Math.max(1, reward.total)) * 100))}%`}</span>
            </div>
            <div className="reward-grid">
              <div className="reward-chip" style={{"--accent":"#F5C842"}}>
                <span>코인</span>
                <strong>+{reward.coins}G</strong>
                <small>상점/부화기 성장 재화</small>
              </div>
              <div className="reward-chip" style={{"--accent":"#78E6FF"}}>
                <span>몬스터 EXP</span>
                <strong>+{reward.exp}</strong>
                <small>{reward.leveled ? `Lv.${reward.level} 달성` : "파트너 성장"}</small>
              </div>
              <div className="reward-chip" style={{"--accent":"#8DFF9A"}}>
                <span>라인 EXP</span>
                <strong>+{reward.lineExp}</strong>
                <small>{reward.core > 0 ? `진화 코어 +${reward.core}` : "진화 준비"}</small>
              </div>
              <div className="reward-chip" style={{"--accent":rewardEggColor}}>
                <span>알 보상</span>
                <strong>{rewardEggLine?.eggEmoji || "🥚"} {rewardEggLabel}</strong>
                <small>{rewardEggLine?.name || "새 몬스터 후보"}</small>
              </div>
            </div>
            {reward.objective && (
              <div className={`battle-bonus-result ${reward.objective.completed ? "complete" : ""}`}>
                <span>{reward.objective.completed ? "🏆" : "🎯"}</span>
                <div>
                  <b>{reward.objective.title}</b>
                  <span>{reward.objective.completed ? `완료 · ${reward.objective.rewardText}` : `미완료 · ${reward.objective.desc}`}</span>
                </div>
                <em>{reward.objective.completed ? "BONUS" : "NEXT"}</em>
              </div>
            )}
            {reward.enemyBonus && (
              <div className={`battle-bonus-result enemy ${reward.enemyBonus.completed ? "complete" : ""}`} data-testid="enemy-bonus-result">
                <span>{reward.enemyBonus.completed ? "🧠" : reward.enemyBonus.icon}</span>
                <div>
                  <b>적 공략 보너스 · {reward.enemyBonus.title}</b>
                  <span>{reward.enemyBonus.completed ? `완료 · ${reward.enemyBonus.rewardText}` : `미완료 · ${reward.enemyBonus.desc}`}</span>
                </div>
                <em>{reward.enemyBonus.completed ? "HUNT" : "TIP"}</em>
              </div>
            )}
          </div>
        )}

        <div className="result-goal-panel">
          <div className="result-goal-card">
            <b>도감 완성 목표</b>
            <p>발견 {dexProgress.ownedMonsters}/{dexProgress.totalMonsters} · {dexPercent}% 진행</p>
            <div style={{height:6,background:"#191528",borderRadius:99,overflow:"hidden",marginTop:9}}>
              <div style={{height:"100%",width:`${dexPercent}%`,background:"linear-gradient(90deg,#C77DFF,#78E6FF)",borderRadius:99}}/>
            </div>
          </div>
          <div className="result-goal-card">
            <b>미션 진행</b>
            <p>오늘 {resultDailyDone}/{dailyMissions.length || 3} · 이번 주 {resultWeeklyDone}/{resultWeeklyList.length}</p>
            <div className="mission-mini-list">
              {[...dailyMissions.slice(0,1), ...resultWeeklyList.slice(0,1)].map((mission)=>(
                <div key={mission.id} className={`mission-mini ${mission.done ? "done" : ""}`}>
                  <span>{mission.emoji}</span>
                  <label>{mission.label}</label>
                  <em>{mission.done ? "완료" : `${mission.progress}/${mission.target}`}</em>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="result-next-card">
          <b>다음 추천</b>
          <span>{nextHint}</span>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300}}>
          {won && curSubStage < resultSubStageCount - 1 && (
            <button data-testid="result-next-sub-button" className="big-btn"
              onClick={()=>startBattle(curUnit,battleStage,curBook,difficulty,curSubStage+1)}
              style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
                background:"linear-gradient(135deg,#1A5080,#2A80CC)",boxShadow:"0 4px 0 #0A2840"}}>
              다음 단계 (Stage {curSubStage+2} →)
            </button>
          )}
          {won && curSubStage === resultSubStageCount - 1 && (
            <button data-testid="result-boss-button" className="big-btn"
              onClick={()=>startBattle(curUnit,battleStage,curBook,difficulty,4)}
              style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
                background:"linear-gradient(135deg,#806010,#C8A020)",boxShadow:"0 4px 0 #402800"}}>
              👑 보스전 도전!
            </button>
          )}
          {hasWrong&&won&&(
            <button className="big-btn" onClick={()=>{
              setScreen(`unitdetail_${curUnit}`);
            }} style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
              background:"linear-gradient(135deg,#881A1A,#BB2222)",boxShadow:"0 4px 0 #440000"}}>
              오답 복습
            </button>
          )}
          <button data-testid="result-world-button" className="big-btn" onClick={()=>setScreen("world")}
            style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
              background:"linear-gradient(135deg,#3C7020,#5AA030)",boxShadow:"0 4px 0 #1E3A10"}}>
            월드로 돌아가기
          </button>
          {curUnit&&(
            <button data-testid="result-retry-button" className="big-btn" onClick={()=>startBattle(curUnit,battleStage,curBook,difficulty,curSubStage)}
              style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
                background:"linear-gradient(135deg,#2A1880,#4A2AAA)",boxShadow:"0 4px 0 #0A0838"}}>
              다시 도전
            </button>
          )}
        </div>
        </div>

      {showRevengePrompt&&(
        <div data-testid="revenge-prompt-modal" style={{
          position:"fixed",inset:0,zIndex:200,
          display:"flex",alignItems:"center",justifyContent:"center",
          background:"rgba(10,5,20,0.88)",padding:20}}>
          <div style={{
            background:"linear-gradient(135deg,#1A0408,#2A0810)",
            border:"2px solid #FF440066",borderRadius:20,padding:"28px 22px",
            maxWidth:320,width:"100%",textAlign:"center",
            boxShadow:"0 0 40px #FF220033"
          }}>
            <div style={{fontSize:"clamp(36px,10vmin,52px)",marginBottom:10,animation:"floatBob 1.5s ease-in-out infinite"}}>🧠</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(13px,3.5vmin,16px)",color:"#78E6FF",marginBottom:8}}>복습랜드 오픈!</div>
            <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(10px,2.6vmin,12px)",color:"#AA6633",lineHeight:1.6,marginBottom:20}}>
              틀린 단어 <strong style={{color:"#78E6FF"}}>{wrongWords.length}개</strong>가 복습을 기다리고 있습니다.<br/>
              지금 복습랜드에서<br/>
              <strong style={{color:"#FFB844"}}>코인 + 성장 보상</strong>을 챙기세요.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowRevengePrompt(false)} style={{
                flex:1,fontFamily:"var(--f-pk)",fontSize:"clamp(10px,2.5vmin,12px)",
                background:"transparent",border:"1px solid #3A1A1A",color:"#664433",
                padding:"10px 8px",borderRadius:10,cursor:"pointer"}}>닫기</button>
              <button onClick={()=>{setShowRevengePrompt(false);setScreen("revenge");}} style={{
                flex:2,fontFamily:"var(--f-pk)",fontSize:"clamp(12px,3vmin,14px)",
                background:"linear-gradient(135deg,#AA1100,#CC3300)",
                border:"none",color:"#fff",padding:"10px 8px",borderRadius:12,
                cursor:"pointer",boxShadow:"0 4px 0 #550000",fontWeight:700}}>복습하러 가기</button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  }

  // COLLECTION
  // 알 부화 화면
  if(eggHatch) {
    const line = CATCH_MON_LINES.find(l=>l.lineId===eggHatch.lineId);
    const hatchStageMeta = getMonsterStageMeta(eggHatch.mon.id);
    const hatchDexNo = getDexNo(eggHatch.lineId, hatchStageMeta?.stageIndex ?? 0);
    const hatchSpecies = getDexSpecies(line, hatchStageMeta?.stageIndex ?? 0);
    const hatchDexEntry = getRetroDexEntry(line, eggHatch.mon, hatchStageMeta?.stageIndex ?? 0);
    const Sp = eggHatch.mon.Sprite;
    return (
      <div data-testid="egg-hatch-modal" onClick={()=>setEggHatch(null)} style={{
        position:"fixed",inset:0,background:"#000",zIndex:9999,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        gap:20,cursor:"pointer"
      }}>
        <style>{CSS}</style>
        <style>{`
          @keyframes eggPop{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.3) rotate(5deg)}80%{transform:scale(0.9)}100%{transform:scale(1);opacity:1}}
          @keyframes sparkle{0%,100%{opacity:0}50%{opacity:1}}
          .egg-pop{animation:eggPop 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards}
        `}</style>
        {/* sparkle bg */}
        {[...Array(20)].map((_,i)=>(
          <div key={i} style={{
            position:"fixed",
            left:`${(i*37+13)%100}%`,top:`${(i*29+7)%100}%`,
            fontSize:`${8+i%12}px`,
            animation:`sparkle ${1+i%3*0.5}s ${i%4*0.3}s ease-in-out infinite`,
            pointerEvents:"none"
          }}>✦</div>
        ))}
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(14px,4vw,22px)",color:line?.rarityClr||"#FFD700",textAlign:"center"}}>
          {line?.rarityLabel||"Legendary"}
        </div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(20px,6vw,36px)",color:"#FFFFFF",textShadow:`0 0 30px ${line?.eggColor}`,textAlign:"center"}}>
          ... ... ...<br/>아앗! 알이 흔들립니다!
        </div>
        <div className="egg-pop" style={{marginTop:8}}>
          <Sp w={Math.min(160, window.innerWidth*0.38)}/>
        </div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,5vw,28px)",color:line?.typeClr||"#FFD700",marginTop:4}}>
          {eggHatch.mon.name}가 태어났다!
        </div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2.2vw,11px)",color:"#F5C842",textAlign:"center"}}>
          No.{hatchDexNo} · {hatchSpecies}
        </div>
        <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(11px,3vw,14px)",color:"#9988CC",textAlign:"center",maxWidth:300,lineHeight:1.5}}>
          {hatchDexEntry}
        </div>
        <div style={{color:"#6A5888",fontSize:"clamp(10px,2.5vw,13px)",marginTop:4}}>
          {line?.type} TYPE · Lv.{eggHatch.hatchLevel ?? 1}
        </div>
        <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(11px,3vw,14px)",color:eggHatch.outcome==="duplicate"?"#FFD37A":"#8FFFC8",textAlign:"center"}}>
          {eggHatch.outcome==="duplicate"
            ? `이미 만난 몬스터였다! 라인 EXP +${eggHatch.reward?.lineExp ?? 0}${(eggHatch.reward?.evolutionCores ?? 0) > 0 ? ` · 코어 +${eggHatch.reward.evolutionCores}` : ""}`
            : "도감에 새로운 몬스터가 기록됐다!"}
        </div>
        <button data-testid="egg-hatch-confirm-button" className="big-btn" onClick={()=>setEggHatch(null)} style={{
          marginTop:12,background:`linear-gradient(135deg,${line?.typeClr||"#7B2FBE"},${line?.eggColor||"#5533AA"})`,
          color:"#fff",fontSize:"clamp(14px,4vw,18px)"
        }}>
          도감에 등록하기
        </button>
      </div>
    );
  }

  if(screen==="eggs") {
    const emptyUnlockedSlot = hatcherySlots.find((slot) => slot.unlocked && !slot.egg);
    return (
      <div data-testid="eggs-screen" className="crt page-y slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.2vh,14px)",
        background:"radial-gradient(ellipse at top,#120826,#0C0A18)"}}>
        <style>{CSS}</style>
        {toastEl}

        <ScreenTopBar title="알 부화실" subtitle="부화기에 올리고 깨서 몬스터를 획득" icon={NAV_ICON.eggs} accent="#C77DFF" onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} meta={<div style={{textAlign:"right",fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",fontWeight:900,color:"#D6B2FF"}}>
            <div data-testid="eggs-inventory-count">인벤토리 {pendingEggs.length}</div>
            <div data-testid="eggs-running-summary">부화중 {runningEggCount}</div>
            <div data-testid="eggs-ready-summary">수령대기 {readyEggCount}</div>
          </div>} />

        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,flexShrink:0}}>
          {hatcherySlots.map((slot) => {
            const line = slot.egg ? CATCH_MON_LINES.find((entry) => entry.lineId === slot.egg.lineId) : null;
            const slotMeta = getSlotMeta(slot.slotId);
            const allowedText = slotMeta.allowedRarities.map((rarity) => getEggRarityMeta(rarity).shortLabel).join(" ");
            const slotLabel = slot.label || slotMeta.label;
            return (
              <div key={slot.slotId} style={{
                background:"#16122A",
                borderRadius:14,
                padding:"12px 14px",
                border:`1px solid ${slot.unlocked ? "#48336C" : "#2A2440"}`,
                opacity:slot.unlocked ? 1 : 0.6
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div>
                    <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:slot.unlocked?"#E3D6FF":"#5E527A"}}>
                      {slotLabel}
                    </div>
                    <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#7F70A0",marginTop:4}}>
                      {!slot.unlocked && `${slotMeta.desc} · 해금 ${slotMeta.unlockPrice}G`}
                      {slot.unlocked && !slot.egg && `비어 있음 · 허용 ${allowedText}`}
                      {slot.unlocked && slot.status==="running" && `${line?.eggEmoji || "🥚"} ${line?.rarityLabel || "Egg"} · ${formatHatchRemaining(slot)} 남음`}
                      {slot.unlocked && slot.status==="ready" && `${line?.eggEmoji || "🥚"} ${line?.rarityLabel || "Egg"} · 지금 깨기 가능`}
                    </div>
                  </div>
                  {!slot.unlocked && (
                    <button onClick={()=>setScreen("shop")} style={{
                      background:"#120E24",color:"#DCCBFF",border:"1px solid #3A2A60",
                      borderRadius:10,padding:"8px 12px",fontWeight:700,cursor:"pointer"
                    }}>상점에서 열기</button>
                  )}
                  {slot.unlocked && !slot.egg && (
                    <div style={{fontSize:"clamp(28px,7vmin,36px)"}}>🥚</div>
                  )}
                  {slot.unlocked && slot.status==="running" && (
                    <button onClick={()=>setScreen("shop")} style={{
                      background:"linear-gradient(135deg,#304A10,#4D7A20)",color:"#fff",
                      border:"none",borderRadius:10,padding:"8px 12px",fontWeight:700,cursor:"pointer"
                    }}>부스터</button>
                  )}
                  {slot.unlocked && slot.status==="ready" && (
                    <button data-testid={`hatch-claim-slot-${slot.slotId}`} onClick={()=>claimHatchFromSlot(slot.slotId)} style={{
                      background:`linear-gradient(135deg,${line?.typeClr || "#7B2FBE"},${line?.eggColor || "#C77DFF"})`,
                      color:"#fff",border:"none",borderRadius:10,padding:"8px 12px",fontWeight:700,cursor:"pointer"
                    }}>깨기</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{background:"#16122A",borderRadius:14,padding:"12px 14px",border:"1px solid #3A2060",flex:1,minHeight:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#C77DFF"}}>알 인벤토리</div>
            <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#7F70A0"}}>
              빈 슬롯 {emptyUnlockedSlot ? "있음" : "없음"}
            </div>
          </div>
          {pendingEggs.length === 0 ? (
            <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-sm)",color:"#6A5888"}}>
              아직 보유한 알이 없습니다. 유닛 클리어, 리벤지, 상점, 무료 알로 채울 수 있습니다.
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
              {pendingEggs.map((egg) => {
                const line = CATCH_MON_LINES.find((entry) => entry.lineId === egg.lineId);
                const autoTarget = hatcherySlots.find((slot) => canSlotHatchEgg(slot, egg));
                const rarityMeta = getEggRarityMeta(egg.rarity);
                const durationLabel = formatDurationFromMs(getHatchDurationMs(egg.rarity));
                const lockedCompatibleSlot = hatcherySlots.find((slot) => !slot.unlocked && getSlotMeta(slot.slotId).allowedRarities.includes(egg.rarity));
                return (
                  <div key={egg.id} style={{
                    background:"#0E0C1A",
                    borderRadius:12,
                    padding:"10px 12px",
                    border:`1px solid ${line?.eggColor || "#7B2FBE"}44`
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:"clamp(22px,6vmin,30px)"}}>{line?.eggEmoji || "🥚"}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:line?.rarityClr || "#D8D8D8"}}>
                          {line?.rarityLabel || "Common Egg"}
                        </div>
                        <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#8C7AAE",marginTop:2}}>
                          {line?.type || "mystery"} 계열 · {durationLabel} · Lv.{egg.hatchLevel ?? rarityMeta.hatchLevel}
                        </div>
                      </div>
                    </div>
                    <button
                      data-testid={`egg-inventory-start-${egg.id}`}
                      className="big-btn"
                      disabled={!autoTarget}
                      onClick={()=>{
                        const targetSlot = hatcherySlots.find((slot) => canSlotHatchEgg(slot, egg));
                        if (!targetSlot) {
                          setToast(lockedCompatibleSlot ? `${getSlotMeta(lockedCompatibleSlot.slotId).label} 해금이 필요합니다.` : "맞는 빈 부화기가 없습니다.");
                          return;
                        }
                        if (startEggInSlot(targetSlot.slotId, egg)) {
                          setToast(`${line?.eggEmoji || "🥚"} 알을 ${targetSlot.label || getSlotMeta(targetSlot.slotId).label}에 올렸습니다.`);
                        }
                      }}
                      style={{
                        marginTop:10,
                        width:"100%",
                        padding:"10px 12px",
                        fontSize:"var(--fs-sm)",
                        background:autoTarget
                          ? `linear-gradient(135deg,${line?.typeClr || "#5C2E91"},${line?.eggColor || "#9D63FF"})`
                          : "#1A1A2A",
                        boxShadow:autoTarget ? "0 4px 0 rgba(20,10,40,.7)" : "0 4px 0 #080612",
                        color:autoTarget ? "#fff" : "#5A4E72"
                      }}>
                      {autoTarget ? `${autoTarget.label || getSlotMeta(autoTarget.slotId).label}에 올리기` : lockedCompatibleSlot ? "상위 부화기 필요" : "맞는 부화기 없음"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <ScreenBottomNav onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} />
      </div>
    );
  }

// ─────────────────────────────────────────────────────────────────
//  SHOP SCREEN
  if(screen==="shop") {
    const nextHatchSlot = getNextLockedSlot(hatcherySlots);
    const nextHatchSlotMeta = nextHatchSlot ? getSlotMeta(nextHatchSlot.slotId) : null;
    const ITEMS = [
      { id:"egg_common",   emoji:"🥚", name:"일반 알",      desc:"5분 · Common 라인 중심",        price:getEggRarityMeta("common").shopPrice, rarity:"common" },
      { id:"egg_rare",     emoji:"🥚", name:"레어 알",      desc:"20분 · Rare 이상 확률 증가",     price:getEggRarityMeta("rare").shopPrice, rarity:"rare" },
      { id:"egg_sr",       emoji:"🌙", name:"슈퍼레어 알",  desc:"90분 · Shadow/Dragon 계열",     price:getEggRarityMeta("superrare").shopPrice, rarity:"superrare" },
      { id:"egg_legend",   emoji:"✨", name:"레전드 알",    desc:"4시간 · 최상위 도감 라인",       price:getEggRarityMeta("legendary").shopPrice, rarity:"legendary" },
      { id:"hatch_boost",  emoji:"⚡", name:"시간 가속기",  desc:"진행 중인 첫 알의 시간을 30분 단축", price:120, action:"boost_hatch" },
      { id:"hatch_slot",   emoji:"🔓", name:nextHatchSlotMeta ? `${nextHatchSlotMeta.label} 라이선스` : "부화기 슬롯", desc:nextHatchSlotMeta ? nextHatchSlotMeta.desc : "모든 부화기 해금 완료", price:nextHatchSlotMeta?.unlockPrice ?? 9999, action:"slot" },
      { id:"level_candy",  emoji:"🍬", name:"경험 사탕",    desc:"현재 파트너 EXP +120",          price:160, action:"level_candy" },
      { id:"evo_core",     emoji:"🔮", name:"진화 코어",    desc:"현재 라인 EXP +80 · 코어 +1",    price:300, action:"evo_core" },
      { id:"shield",       emoji:"🛡️", name:"스트릭 실드", desc:"하루 실수 1회를 막아줌",   price:100, action:"shield" },
      { id:"arena_ticket",  emoji:"🎫", name:"배틀 티켓",   desc:"친구 아레나 도전권 +3",      price:90,  action:"ticket" },
      { id:"power_band",    emoji:"💪", name:"훈련 밴드",   desc:"아레나 전투력 영구 +35",     price:180, action:"boost" },
      { id:"title_warrior",emoji:"🏅", name:"칭호: 단어전사", desc:"이름 옆에 칭호 표시",     price:200, action:"title_warrior" },
    ];

    function buyItem(item) {
      if (coins < item.price) { setToast("코인이 부족합니다."); return; }
      setCoins(c => c - item.price);
      if (item.action === "boost_hatch") {
        if (!boostFirstRunningEgg(30)) { setCoins(c=>c+item.price); setToast("진행 중인 알이 없습니다."); return; }
        setToast("첫 번째 부화중인 알의 시간이 30분 줄었습니다.");
      } else if (item.action === "slot") {
        if (!unlockNextHatchSlot()) { setCoins(c=>c+item.price); setToast("모든 부화기가 이미 열려 있습니다."); return; }
        setToast(`${nextHatchSlotMeta?.label || "새 부화기"}가 열렸습니다.`);
      } else if (item.action === "level_candy") {
        if (!mon) { setCoins(c=>c+item.price); setToast("먼저 파트너 몬스터가 필요합니다."); return; }
        const result = grantActiveMonsterExp(120);
        setToast(result.leveled ? `${mon.name}가 Lv.${result.level}이 되었습니다!` : `${mon.name} EXP +120!`);
      } else if (item.action === "evo_core") {
        if (!lineId) { setCoins(c=>c+item.price); setToast("먼저 파트너 몬스터가 필요합니다."); return; }
        grantLineResources(lineId, { lineExp: 80, evolutionCores: 1 });
        setToast("진화 재료 획득! 라인 EXP +80 · 코어 +1");
      } else if (item.action === "shield") {
        setStreakShields(s => s + 1);
        setToast("스트릭 실드 +1! 하루 실수 1회를 막아줍니다.");
      } else if (item.action === "ticket") {
        setBattleTickets(t => Math.min(ARENA_MAX_TICKETS, t + 3));
        setArenaTicketUpdatedAt(Date.now());
        setToast(`배틀 티켓 +3! 최대 ${ARENA_MAX_TICKETS}장까지 보유합니다.`);
      } else if (item.action === "boost") {
        setBattleBoost(v => v + 35);
        setToast("훈련 밴드 장착! 아레나 전투력이 올랐습니다.");
      } else if (item.rarity) {
        const possLines = EGG_DROP[item.rarity] || EGG_DROP.common;
        const lineId2 = possLines[Math.floor(Math.random() * possLines.length)];
        addEggToInventory(item.rarity, lineId2, "shop");
        setToast(`${item.emoji} ${item.name} 구매 완료! 알 탭에서 부화를 시작하세요.`);
      } else {
        setToast(`${item.emoji} ${item.name} 구매 완료!`);
      }
    }

    return (
      <div data-testid="shop-screen" className="crt page-y slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.2vh,14px)",
        background:"radial-gradient(ellipse at top,#001A0A,#0C0A18)"}}>
        <style>{CSS}</style>
        {toastEl}
        <ScreenTopBar title="상점" subtitle="알, 부스터, 성장 아이템" icon={NAV_ICON.shop} accent="#44FF88" onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} meta={<div style={{background:"#1A2A1A",borderRadius:10,padding:"7px 10px",border:"1px solid #226633",fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#F5C842"}}>{coins}G</div>} />

        {/* 스트릭 실드 */}
        {streakShields > 0 && (
          <div style={{background:"#0A1A0A",borderRadius:10,padding:"8px 14px",border:"1px solid #33664433",
            fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#44AA66",flexShrink:0}}>
            스트릭 실드 {streakShields}개 보유 중</div>
        )}

        {/* 아이템 목록 */}
        <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
          {ITEMS.map(item => {
            const canBuy = coins >= item.price;
            const isHatchDisabled = item.action==="boost_hatch" && runningEggCount===0;
            const isSlotDisabled = item.action==="slot" && !nextHatchSlot;
            const isDisabled = isHatchDisabled || isSlotDisabled;
            return (
              <div key={item.id} style={{
                background:"#16122A",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
                border:"1px solid #2A2440",display:"flex",alignItems:"center",gap:12,
                opacity: isDisabled ? 0.4 : 1
              }}>
                <div style={{fontSize:"clamp(28px,7vmin,36px)",flexShrink:0}}>{item.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:800,
                    fontSize:"clamp(13px,3.5vw,15px)",color:"#E0D8FF"}}>{item.name}</div>
                  <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",
                    color:"#6A5888",marginTop:2}}>{item.desc}</div>
                </div>
                <button data-testid={`shop-buy-${item.id}`} onClick={()=>!isDisabled&&buyItem(item)} style={{
                  background:canBuy&&!isDisabled
                    ?"linear-gradient(135deg,#226633,#44AA55)"
                    :"#1A1A2A",
                  color:canBuy&&!isDisabled?"#fff":"#4A3A60",
                  border:`1px solid ${canBuy&&!isDisabled?"#44AA5544":"#2A2440"}`,
                  borderRadius:10,padding:"8px 14px",fontWeight:700,
                  fontSize:"clamp(12px,3vw,14px)",cursor:canBuy&&!isDisabled?"pointer":"default",
                  whiteSpace:"nowrap",flexShrink:0
                }}>
                  💰{item.price}G
                </button>
              </div>
            );
          })}
        </div>

        <ScreenBottomNav onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} />
      </div>
    );
  }

  // REVENGE LAND 화면
  if(screen==="revenge") return (
    <RevengeLandScreen
      wrongWords={wrongWords} setWrongWords={setWrongWords}
      wordMemory={wordMemory} setWordMemory={setWordMemory}
      mon={mon} monLv={monLv} setMonLv={setMonLv} setMonExp={setMonExp}
      lineId={lineId} grantLineResources={grantLineResources}
      coins={coins} setCoins={setCoins}
      pendingEggs={pendingEggs} setPendingEggs={setPendingEggs}
      addEggToInventory={addEggToInventory}
      dailyMissions={dailyMissions} setDailyMissions={setDailyMissions}
      weeklyMissions={weeklyMissions} setWeeklyMissions={setWeeklyMissions}
      setScreen={setScreen} setToast={setToast}
    />
  );

  // LEADERBOARD 화면
  if(screen==="leaderboard") return (
    <LeaderboardScreen
      player={player} mon={mon} setScreen={setScreen}
    />
  );

  if(screen==="arena") return (
    <ArenaScreen
      player={player}
      mon={mon}
      progressSnapshot={progressSnapshot}
      curBook={curBook}
      battleTickets={battleTickets}
      setBattleTickets={setBattleTickets}
      arenaWins={arenaWins}
      setArenaWins={setArenaWins}
      arenaRating={arenaRating}
      setArenaRating={setArenaRating}
      setCoins={setCoins}
      setBattleBoost={setBattleBoost}
      setScreen={setScreen}
      setToast={setToast}
    />
  );

  // Collection
  if(screen==="collection") {
    const bookMeta = BOOK_SERIES.find((b) => b.id === (curBook || "ww5"));

    return (
      <div data-testid="collection-screen" className="crt page-y slide-up" style={{
        padding:"clamp(10px,2.5vw,16px)",gap:10,
        background:"radial-gradient(ellipse at top,#1A0A2E,#0C0A18)"}}>
        <style>{CSS}</style>

        <ScreenTopBar title="몬스터 도감" subtitle="최종 진화 라인 기준 진행률" icon={NAV_ICON.dex} accent="#F5C842" onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} meta={<div style={{textAlign:"right"}}>
            <div data-testid="dex-progress-completed-lines" style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-sm)",color:"#F5C842"}}>
              {dexProgress.completedLines}/{dexProgress.totalLines}
            </div>
            <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#8C7AAE",marginTop:4}}>
              발견 {dexProgress.ownedMonsters}/{dexProgress.totalMonsters}
            </div>
          </div>} />

        <div style={{background:"#16122A",borderRadius:12,padding:12,border:"1px solid #7B2FBE44",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#C77DFF",marginBottom:10}}>수집 몬스터</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {CATCH_MON_LINES.map((line) => {
              const lineResources = getLineResourceState(monsterCollection, line.lineId);
              const lineComplete = isLineFullyEvolved(monsterCollection, line.lineId);
              return (
                <div key={line.lineId}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:16}}>{line.eggEmoji}</span>
                    <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:line.typeClr}}>{line.type}</span>
                    <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:line.rarityClr}}>{line.rarityLabel}</span>
                    <span data-testid={`dex-line-${line.lineId}-status`} style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888",marginLeft:"auto"}}>
                      {lineComplete ? "완료" : "미완료"}
                    </span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8}}>
                    {line.stages.map((stage, index) => {
                      const owned = caughtMons.includes(stage.id);
                      const entry = monsterCollection[stage.id];
                      const Sp = stage.Sprite;
                      const dexNo = getDexNo(line.lineId, index);
                      const species = getDexSpecies(line, index);
                      const dexEntry = getRetroDexEntry(line, stage, index);
                      return (
                        <div key={stage.id} style={{
                          textAlign:"center",
                          background:owned ? line.typeBg : "linear-gradient(160deg,#0C0820,#120A2A)",
                          borderRadius:10,
                          padding:"8px 6px",
                          border:`1px solid ${owned ? line.typeClr+"44" : "#2A1A44"}`
                        }}>
                          <div style={{opacity:owned ? 1 : 0.25,animation:owned ? `floatBob ${2+index*.4}s ease-in-out infinite` : "none"}}>
                            <Sp w={Math.min(52,Math.max(34,Math.floor(window.innerWidth*0.11)))}/>
                          </div>
                          <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:owned ? line.typeClr : "#4A2880",marginTop:4}}>
                            {owned ? stage.name : "???"}
                          </div>
                          <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:owned ? "#F5C842" : "#3A2A58",marginTop:4,lineHeight:1.5}}>
                            No.{owned ? dexNo : "???"}<br/>{owned ? species : "미확인 단어몬"}
                          </div>
                          <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(8px,2vmin,10px)",color:"#7E6A9C",marginTop:3}}>
                            {owned ? `Lv.${entry?.level ?? 1} · 중복 ${entry?.duplicateCount ?? 0}` : `진화 ${index+1}`}
                          </div>
                          {owned && (
                            <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(7px,1.8vmin,9px)",color:"#AFA0CC",marginTop:5,lineHeight:1.35,textAlign:"left"}}>
                              {dexEntry}
                            </div>
                          )}
                          <div data-testid={`dex-stage-${stage.id}-evolved-status`} style={{fontFamily:"var(--f-ui)",fontSize:"clamp(7px,1.8vmin,9px)",color:mon?.id===stage.id ? "#F5C842" : "#5E527A",marginTop:3}}>
                            {owned
                              ? (mon?.id===stage.id
                                ? "대표 파트너"
                                : index === 2
                                  ? (entry?.evolvedOwned ? "진화 완성" : "최종형 보유")
                                  : `라인EXP ${lineResources.lineExp ?? 0}`)
                              : "미획득"}
                          </div>
                          {owned && index < 2 && (
                            <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(7px,1.8vmin,9px)",color:"#A996D8",marginTop:3}}>
                              {(() => {
                                const req = getEvolutionRequirement(index);
                                if (!req) return "";
                                const currentLineExp = lineResources.lineExp ?? 0;
                                const currentCores = lineResources.evolutionCores ?? 0;
                                return `진화 필요 ${Math.max(0, req.lineExp - currentLineExp)} EXP · ${Math.max(0, req.evolutionCores - currentCores)} CORE`;
                              })()}
                            </div>
                          )}
                          {owned && index === 2 && (
                            <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(7px,1.8vmin,9px)",color:entry?.evolvedOwned ? "#8FFFC8" : "#FFB36A",marginTop:3}}>
                              {entry?.evolvedOwned ? "도감 완료 인정" : "알/획득만으로는 미완료"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,flexShrink:0}}>
          <div style={{background:"#16122A",borderRadius:12,padding:12,border:"1px solid #3A2060"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#9966CC"}}>알 보관함</div>
              <button onClick={()=>setScreen("eggs")} style={{
                background:"#120E24",color:"#DCCBFF",border:"1px solid #3A2A60",
                borderRadius:8,padding:"6px 10px",fontWeight:700,cursor:"pointer"
              }}>알 탭</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#CFC4EA"}}>
              <div>인벤토리: {pendingEggs.length}</div>
              <div>부화중: {runningEggCount}</div>
              <div>수령대기: {readyEggCount}</div>
              <div>슬롯: {unlockedHatchSlots}/3</div>
            </div>
          </div>

          <div style={{background:totalStars>=30?"linear-gradient(135deg,#1A0838,#280A50)":"#16122A",
            borderRadius:12,padding:12,border:`1px solid ${totalStars>=30?"#BB66FF44":"var(--rim)"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{opacity:totalStars>=30?1:.25,animation:totalStars>=30?"floatBob 2.5s ease-in-out infinite":"none"}}>
                <LexivoreSprite w={Math.min(70,Math.max(48,Math.floor(window.innerWidth*.14)))}/>
              </div>
              <div>
                <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#BB66FF"}}>
                  {totalStars>=30 ? "LEXIVORE" : "HIDDEN"}
                </div>
                <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#8C7AAE",marginTop:4}}>
                  {totalStars>=30 ? `HP ${HIDDEN_MON.hp} · ATK ${HIDDEN_MON.atk} · DEF ${HIDDEN_MON.def}` : `${totalStars}/30 stars to reveal`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{background:"#16122A",borderRadius:12,padding:12,border:"1px solid var(--rim)",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#F5C842",marginBottom:10}}>
            UNIT PROGRESS · {bookMeta?.subtitle || "Book"}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
            {[...Array(12)].map((_,i)=>{
              const uid = i + 1;
              const unit = getUnitInfo(curBook || "ww5", uid);
              const best = Math.max(0,...[0,1,2].map((stage) => getUnitStars(uid, stage)));
              return (
                <div key={uid} style={{textAlign:"center",background:"#0E0C1A",borderRadius:8,padding:"8px 4px"}}>
                  <div style={{fontSize:"clamp(16px,4vmin,22px)"}}>{unit.emoji}</div>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.2vmin,6px)",color:"#6A5888",marginBottom:2}}>U{uid}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:1}}>
                    {[0,1,2].map((j)=>(
                      <span key={j} style={{fontSize:"clamp(8px,2vmin,10px)",color:j<best?"#F5C842":"#2A2440"}}>★</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ScreenBottomNav onBack={()=>setScreen(mon?"world":"title")} onHome={()=>setScreen("title")} />
      </div>
    );
  }

  // VOC-106: screen이 null 등일 때 fallback 렌더 (복구 화면)
  return (
    <div className="crt page" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:24}}>
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}
      <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(14px,4vmin,20px)",color:"#AA88CC",textAlign:"center"}}>
        알 수 없는 화면
      </div>
      <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}
        style={{fontFamily:"var(--f-pk)",fontSize:"clamp(12px,3.5vmin,16px)",
          padding:"12px 32px",borderRadius:12,cursor:"pointer",
          background:"linear-gradient(135deg,#2A1A4A,#3D2060)",
          color:"#C8B8E8",border:"1px solid #4A3A7A",boxShadow:"0 4px 0 #0A0518"}}>
        {mon ? "월드로 돌아가기" : "홈으로"}
      </button>
    </div>
  );
}
