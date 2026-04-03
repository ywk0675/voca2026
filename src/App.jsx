import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import LoginScreen from "./LoginScreen.jsx";
import { loadProgress, saveProgress, supabase } from "./supabase.js";
import { CATCH_MON_LINES, EGG_DROP, PARTNER_UNLOCK_STARS, getCatchLineById, getCatchStage, rollEggRarity, rollMonsterFromLine } from "./catchMons.jsx";
import { startBGM, stopBGM, sfxCorrect, sfxWrong, sfxHitEnemy, sfxHitPlayer, sfxVictory, sfxDefeat, sfxBattleStart, sfxHatch, sfxEvolveStart, sfxEvolveDone, setMuted, isMuted } from "./audio.js";
import { BOOK_SERIES, getUnitInfo, getWordsForUnit } from "./wordData.js";
import {
  HATCH_DURATIONS_MS,
  createDefaultHatcherySlots,
  createEgg,
  syncHatcherySlots,
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

const ENEMIES = [
  { id:"forgex",   name:"FORGEX",   Sprite:ForgexSprite,   type:"ERASE", typeClr:"#CC4444", color:"#FF4444", hp:70,  atk:8,  def:4,  bgKey:"plains" },
  { id:"blankus",  name:"BLANKUS",  Sprite:BlankusSprite,  type:"BLANK", typeClr:"#888888", color:"#AAAAAA", hp:95,  atk:11, def:7,  bgKey:"library"},
  { id:"confuzor", name:"CONFUZOR", Sprite:ConfuzorSprite, type:"CHAOS", typeClr:"#CC7700", color:"#FF9900", hp:125, atk:15, def:10, bgKey:"cave"   },
  { id:"nullvoid", name:"NULLVOID", Sprite:NullvoidSprite, type:"VOID",  typeClr:"#7700CC", color:"#9944FF", hp:160, atk:18, def:12, bgKey:"void"   },
];

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
  html,body,#root{height:100%;overflow:hidden;}
  html{-webkit-text-size-adjust:100%;text-size-adjust:100%;}
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

  .page{height:100vh;overflow:hidden;display:flex;flex-direction:column;background:var(--bg);}
  .page-y{height:100vh;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;background:var(--bg);}
  .slide-up{animation:slideUp .22s ease;}

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
  }
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#3A2A50;border-radius:2px;}
`;

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
  { emoji:"📚", title:"VOCA MON에 오신 걸 환영해요!", body:"영어 단어를 맞히면서 몬스터를 모으는 게임입니다.\n플레이할수록 더 강하고 멋진 몬스터를 만날 수 있어요." },
  { emoji:"🥚", title:"알이 항상 기다리고 있어요", body:"교재를 선택하고 전투를 진행하면 알을 얻을 수 있습니다.\n알을 부화기에 올리고 직접 깨서 몬스터를 획득하세요." },
  { emoji:"⚔️", title:"틀린 단어도 복수하세요!", body:"틀린 단어는 Revenge Land에 쌓입니다.\n복습 전투에서 다시 맞히면 추가 보상까지 챙길 수 있어요." },
  { emoji:"🏆", title:"진화와 도감 완성을 노리세요", body:"몬스터를 키우고 진화시키면 도감이 완성됩니다.\n오늘 한 판만 더 해도 확실히 성장합니다!", last:true },
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

// Stars display
function Stars({count,max=3,size="md"}) {
  const sz=size==="sm"?"clamp(12px,3vmin,16px)":"clamp(16px,4vmin,22px)";
  return (
    <div style={{display:"flex",gap:2}}>
      {[...Array(max)].map((_,i)=>(
        <span key={i} style={{fontSize:sz}} className={i<count?"star-filled":"star-empty"}>★</span>
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
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#FFD700"}}>🏆 RANKING</div>
        <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888"}}>
          {player?.classCode || "CLASS"}
        </div>
      </div>
      <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#6A5888",textAlign:"center",flexShrink:0}}>
        진화로 완성한 라인이 많을수록 순위가 올라갑니다.
      </div>
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
      <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")} style={{
        padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
        color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612",flexShrink:0}}>
        BACK
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  REVENGE LAND SCREEN (위치 고정 — Rules of Hooks)
function RevengeLandScreen({ wrongWords, setWrongWords, mon, monLv, setMonLv, setMonExp,
  coins, setCoins, pendingEggs, setPendingEggs, addEggToInventory, dailyMissions, setDailyMissions, setScreen, setToast }) {

  // 모든 훅은 최상위에서 선언 (Rules of Hooks)
  const [rMode,    setRMode]    = React.useState(null);
  const [rIdx,     setRIdx]     = React.useState(0);
  const [rSel,     setRSel]     = React.useState(null);
  const [rCorrect, setRCorrect] = React.useState(0);
  const [rStreak,  setRStreak]  = React.useState(0);
  const [rDone,    setRDone]    = React.useState(false);

  const words = wrongWords.slice(0, 10);
  const cur   = words[rIdx];

  // 단어가 없음
  if(words.length === 0) return (
    <div className="crt page slide-up" style={{alignItems:"center",justifyContent:"center",gap:20,
      background:"radial-gradient(ellipse at top,#0A1A0A,#0C0A18)"}}>
      <style>{CSS}</style>
      <div style={{fontSize:"clamp(48px,14vw,80px)"}}>🧹</div>
      <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-lg)",color:"#44FF88",textAlign:"center"}}>복습할 단어가 없습니다</div>
      <div style={{fontFamily:"var(--f-ui)",color:"#6A5888",fontSize:"var(--fs-sm)"}}>틀린 단어를 먼저 쌓아야 Revenge Land가 열립니다.</div>
      <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}>BACK</button>
    </div>
  );

  // 모드 선택
  if(rMode === null) return (
    <div className="crt page slide-up" style={{
      padding:"clamp(14px,3vw,22px)",gap:"clamp(12px,3vh,18px)",alignItems:"center",
      background:"radial-gradient(ellipse at top,#14000A,#0C0A18)"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",flexShrink:0}}>
        <div style={{fontSize:"clamp(36px,10vmin,52px)",animation:"floatBob 2s ease-in-out infinite"}}>⚔️</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#FF6644",marginTop:6}}>REVENGE LAND</div>
        <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#884422",marginTop:4}}>
          {words.length}개 단어가 복수를 기다리고 있습니다
        </div>
      </div>
      <div style={{background:"#1A0A0E",border:"1px solid #3A1A1A",borderRadius:12,
        padding:"10px 16px",width:"100%",maxWidth:340,flexShrink:0}}>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2vmin,10px)",color:"#884422",marginBottom:8}}>클리어 보상</div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          {[{icon:"💰",label:`${words.length*15}G`},{icon:"✨",label:`${words.length*20} EXP`},{icon:"🥚",label:"완벽 클리어 알"}].map((r,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(16px,4.5vmin,22px)"}}>{r.icon}</div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",color:"#FFAA44",marginTop:3}}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:340,flexShrink:0}}>
        {[
          {id:"light", icon:"💧",label:"라이트", desc:"2지선다 + 자동 힌트", clr:"#44AAFF",bg:"linear-gradient(135deg,#081828,#0C2840)"},
          {id:"normal",icon:"⚔️",label:"노멀", desc:"4지선다 기본 모드", clr:"#FF8844",bg:"linear-gradient(135deg,#1A0808,#2A1010)"},
          {id:"hard",  icon:"🔥",label:"챌린지", desc:"4지선다 + 보상 2배", clr:"#FF4444",bg:"linear-gradient(135deg,#1A0010,#2A0020)"},
        ].map(m=>(
          <button key={m.id} onClick={()=>setRMode(m.id)} style={{
            background:m.bg,border:`2px solid ${m.clr}44`,borderRadius:14,
            padding:"clamp(12px,3vw,16px) clamp(14px,3.5vw,20px)",
            display:"flex",alignItems:"center",gap:14,cursor:"pointer",
            boxShadow:"0 3px 0 rgba(0,0,0,0.5)",textAlign:"left"}}>
            <div style={{fontSize:"clamp(22px,6vmin,30px)",flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(12px,3.2vmin,15px)",color:m.clr}}>{m.label}</div>
              <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(9px,2.3vmin,11px)",color:"#664433",marginTop:3}}>{m.desc}</div>
            </div>
            {m.id==="light"&&<div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",
              background:"#44AAFF22",color:"#44AAFF",padding:"3px 8px",borderRadius:6,flexShrink:0}}>추천</div>}
          </button>
        ))}
      </div>
      <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}
        style={{background:"transparent",border:"1px solid #2A1A1A",color:"#443333",width:"100%",maxWidth:340}}>
        BACK
      </button>
    </div>
  );

  // 완료 화면
  if(rDone) {
    const isHard = rMode==="hard";
    const isPerfect = rCorrect === words.length;
    const ratio = rCorrect / words.length;
    const coinReward = Math.round(words.length * 15 * (isHard&&isPerfect?2:1) * (ratio>=0.5?ratio:0.3));
    const expReward  = Math.round(words.length * 20 * (isHard&&isPerfect?2:1) * (ratio>=0.5?ratio:0.3));
    const giveEgg = isPerfect && words.length >= 5;
    return (
      <div className="crt page slide-up" style={{alignItems:"center",justifyContent:"center",gap:16,
        padding:24,background:"radial-gradient(ellipse at top,#0A0A1A,#0C0A18)"}}>
        <style>{CSS}</style>
        <div style={{fontSize:"clamp(48px,14vw,72px)"}}>{isPerfect?"🏆":ratio>=0.5?"⚔️":"💡"}</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-lg)",textAlign:"center",
          color:isPerfect?"#FFD700":ratio>=0.5?"#FF8844":"#9988CC"}}>
          {isPerfect?"완벽 복수!":ratio>=0.5?"잘했어요!":"다시 도전!"}
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
          </div>
        </div>
        <button className="big-btn" style={{
          background:isPerfect?"linear-gradient(135deg,#8800AA,#CC22EE)":"linear-gradient(135deg,#AA2200,#CC4400)",
          width:"100%",maxWidth:280,padding:"clamp(13px,3vmin,17px)"
        }} onClick={()=>{
          setCoins(c=>c+coinReward);
          setMonExp(e=>{const ne=e+expReward;const th=monLv*80;if(ne>=th){setMonLv(l=>l+1);return ne-th;}return ne;});
          if(isPerfect) setWrongWords(prev=>prev.slice(words.length));
          if(giveEgg){
            const rLines=["flame","wave","leaf","bolt"];
            const rewardLine = rLines[Math.floor(Math.random()*rLines.length)];
            addEggToInventory("common", rewardLine, "revenge");
          }
          setDailyMissions(prev=>prev.map(m=>{
            if(m.done) return m;
            if(m.id==="revenge"){const np=Math.min(m.target,m.progress+1);return{...m,progress:np,done:np>=m.target};}
            return m;
          }));
          setToast(isPerfect
            ? `완벽 복수 성공! +${coinReward}G +${expReward}EXP${giveEgg ? " +알 1개" : ""}`
            : `보상 획득! +${coinReward}G +${expReward}EXP`);
          setScreen(mon?"world":"title");
        }}>
          {isPerfect ? "단어 제압 완료" : "보상 받기"}
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
    <div className="crt page slide-up" style={{
      padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.5vh,14px)",
      background:"radial-gradient(ellipse at top,#0A0118,#0C0A18)"}}>
      <style>{CSS}</style>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#FF4444"}}>⚔️ REVENGE</div>
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
          {rMode==="light"?"라이트 모드":rMode==="hard"?"챌린지 모드":"노멀 모드"}로 복수를 진행 중
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
        {opts.map(opt=>{
          const isCorrect=opt===cur?.m;
          const selected=rSel!==null;
          let bg="linear-gradient(135deg,#1C0A28,#28103A)";
          let border="2px solid #4A2060";
          if(selected&&opt===rSel){bg=isCorrect?"linear-gradient(135deg,#0A3A1A,#0A5A22)":"linear-gradient(135deg,#3A0A0A,#5A0A0A)";border=isCorrect?"2px solid #44FF66":"2px solid #FF4444";}
          else if(selected&&isCorrect){bg="linear-gradient(135deg,#0A3A1A,#0A5A22)";border="2px solid #44FF66";}
          return (
            <button key={opt} onClick={()=>{
              if(rSel!==null)return;
              setRSel(opt);
              const correct=opt===cur?.m;
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

// ─────────────────────────────────────────────────────────────────
//  MAIN APP
export default function VocabMon() {
  // [ 로그인 상태 ]
  const [player, setPlayer] = useState(null); // { name, classCode }
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
  const [dmgVal,   setDmgVal]   = useState(null);
  const [curOpts,  setCurOpts]  = useState([]);
  const [wrongCount,setWrongCount]=useState(0);
  const [correctCount,setCorrectCount]=useState(0);
  const [won,      setWon]      = useState(false);
  const [evoAnim,  setEvoAnim]  = useState(false);
  const [showEvoModal,setShowEvoModal]=useState(false);
  const [newMonName,setNewMonName]=useState("");

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

  // Duolingo 미션 시스템
  const [dailyMissions, setDailyMissions] = useState([]); // [{id,label,emoji,target,progress,done}]
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

  const addEggToInventory = useCallback((rarity, lineId, source = "reward") => {
    setEggInventory((prev) => [...prev, createEgg(rarity, lineId, source)]);
  }, []);

  const startEggInSlot = useCallback((slotId, egg) => {
    if (!egg) return false;
    let started = false;
    setHatcherySlots((prev) => prev.map((slot) => {
      if (slot.slotId !== slotId || !slot.unlocked || slot.egg) return slot;
      started = true;
      const startAt = Date.now();
      const duration = HATCH_DURATIONS_MS[egg.rarity] ?? HATCH_DURATIONS_MS.common;
      return {
        ...slot,
        egg,
        startedAt: startAt,
        finishesAt: startAt + duration,
        status: "running",
      };
    }));
    if (started) setEggInventory((prev) => prev.filter((entry) => entry.id !== egg.id));
    return started;
  }, []);

  const unlockNextHatchSlot = useCallback(() => {
    let unlocked = false;
    setHatcherySlots((prev) => prev.map((slot) => {
      if (!unlocked && !slot.unlocked) {
        unlocked = true;
        return { ...slot, unlocked: true };
      }
      return slot;
    }));
    return unlocked;
  }, []);

  const instantFinishFirstSlot = useCallback(() => {
    let finished = false;
    setHatcherySlots((prev) => prev.map((slot) => {
      if (!finished && slot.status === "running" && slot.egg) {
        finished = true;
        return { ...slot, finishesAt: Date.now(), status: "ready" };
      }
      return slot;
    }));
    return finished;
  }, []);

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
    const hatchPayload = {
      mon: caught,
      lineId: rewardEgg.lineId,
      outcome: awarded.outcome,
      reward: awarded.reward,
    };

    setMonsterCollection(awarded.collection);

    if (!lineId) {
      const hatchMeta = getMonsterStageMeta(hatchPayload.mon.id);
      if (hatchMeta) {
        setLineId(hatchMeta.lineId);
        setStageIdx(hatchMeta.stageIndex);
        setMonLv(1);
        setMonExp(0);
      }
    }

    sfxHatch(rewardEgg.rarity);
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


  const logRef = useRef(null);

  // 미션 생성 함수
  function makeDailyMissions() {
    const pool = [
      { id:"correct10", emoji:"✅", label:"정답 10개 맞히기", target:10, progress:0, done:false },
      { id:"correct20", emoji:"🎯", label:"정답 20개 맞히기", target:20, progress:0, done:false },
      { id:"unit1",     emoji:"📘", label:"유닛 1개 완료하기", target:1, progress:0, done:false },
      { id:"combo5",    emoji:"🔥", label:"5연속 정답 달성", target:5, progress:0, done:false },
      { id:"revenge",   emoji:"⚔️", label:"Revenge Land 클리어", target:1, progress:0, done:false },
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
    const today = new Date().toDateString();
    let restoredStreak = 0, restoredLoginDays = 0, restoredLastLogin = "";
    let restoredEggDate = "", restoredShields = 0;
    let migratedCollection = {};
    let restoredLineId = null;

    if (saved) {
      if (saved.unitStars)    setUnitStars(saved.unitStars);
      if (saved.coins)        setCoins(saved.coins);
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
    }
    setStreak(newStreak);

    // 일일 미션 생성 (오늘 날짜 기준)
    const savedMissionDate = saved?.dailyMissionDate || "";
    if (savedMissionDate !== today) {
      setDailyMissions(makeDailyMissions());
    } else {
      setDailyMissions(saved?.dailyMissions || makeDailyMissions());
    }

    // 일일 달걀 상태 복원
    setDailyEggDate(restoredEggDate);

    setPlayer({ name, classCode });

    // 첫 플레이어: 스타터 알 1개 + 튜토리얼
    if (!saved) {
      const starterLines = ["flame","wave","leaf"];
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
    lineId, stageIdx, curBook,
    streak, loginDays, lastLogin,
    caughtMons,
    pendingEggs,
    monsterCollection,
    eggInventory,
    hatcherySlots,
    wrongWords,
    dailyMissions, dailyEggDate, streakShields,
    dailyMissionDate: new Date().toDateString(),
  }), [
    unitStars, monLv, monExp, coins,
    lineId, stageIdx, curBook,
    streak, loginDays, lastLogin,
    caughtMons, pendingEggs, monsterCollection, eggInventory, hatcherySlots,
    wrongWords, dailyMissions, dailyEggDate, streakShields,
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
      setNewMonName(nextStage.name);
      setEvoAnim(false);
      sfxEvolveDone();
      setShowEvoModal(true);
    },1800);
  }

  // Get stars for a unit+stage key
  const getUnitStars = (uid,stg) => unitStars[`${curBook||"ww5"}_${uid}_${stg}`] || 0;

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

  function startBattle(uid, stg=0, bookId=null) {
    const bk = bookId||curBook||"ww5";
    const words = shuffle(getWordsForUnit(bk, uid));
    if(!words.length) return;
    const enemy = getEnemy(uid);
    const effMon = mon;
    if (!effMon) return;
    if(bookId) setCurBook(bookId);
    const scaledEnemy = {...enemy, hp: words.length};
    setCurUnit(uid); setBattleStage(stg); setCurEnemy(scaledEnemy);
    setQueue(words); setWrongQueue([]); setQIdx(0);
    setCurOpts(stg===2 ? getMasterOpts(words[0]) : getOpts(words[0]));
    setPHp(effMon.hp); setEHp(words.length);
    setWrongCount(0); setCorrectCount(0);
    const stgLabel=["EXPLORE","RECALL","MASTER"][stg];
    setLog([
      `A wild ${enemy.name} appeared!`,
      `Stage: ${stgLabel} mode`,
      stg===0 ? "뜻을 보고 영어 단어를 고르세요." : stg===1 ? "소리를 듣고 영어 단어를 고르세요." : "영어 단어 뜻을 직접 떠올리세요.",
    ]);
    setPhase("question"); setSel(null); setComboStr(0); setDmgVal(null);
    sfxBattleStart();
    setScreen("battle");
  }

  function answer(opt) {
    if(phase!=="question"||sel) return;
    setSel(opt); setPhase("anim");
    const word=queue[qIdx];
    // correct answer depends on stage
    const correctAns = battleStage===2 ? word.m : word.w;
    const correct = opt===correctAns;
    const effMon = mon;
    if (!effMon) return;
    const eff = {...effMon, atk:effMon.atk+monLv*2};

    if(correct) {
      const ns=comboStr+1; setComboStr(ns);
      const base=calcDmg(eff.atk,curEnemy.def);
      const final=ns>=3?Math.floor(base*1.65):base;
      const newE=Math.max(0,eHp-1);
      setCorrectCount(c=>c+1);
      setLog(p=>[...p,`${ns>=3?`콤보 ${ns}! `:""}정답 "${battleStage===2?word.m:word.w}" · -${final}HP`]);
      const expGain = 12 + (ns>=3?6:0);
      setFeedback({type:"correct", msg:`정답! +${expGain} EXP${ns>=3?` · 콤보 ${ns}`:""}`});
      setTimeout(()=>setFeedback(null), 800);

      // 미션 진행 업데이트
      setDailyMissions(prev => prev.map(m => {
        if (m.done) return m;
        let np = m.progress;
        if (m.id === "correct10" || m.id === "correct20" || m.id === "words15") np = Math.min(m.target, np + 1);
        if (m.id === "combo5" && ns >= m.target) np = m.target;
        const done = np >= m.target;
        return { ...m, progress: np, done };
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
      const ed=calcDmg(curEnemy.atk,8);
      const newP=Math.max(0,pHp-ed);
      const newWC=wrongCount+1;
      setWrongCount(newWC);
      setWrongQueue(q=>[...q,word]);
      // 영구 오답 저장 (Revenge Land)
      setWrongWords(prev => {
        if (prev.some(x=>x.w===word.w && x.m===word.m)) return prev;
        return [...prev, {w:word.w, m:word.m, def:word.def||"", opts:word.opts||[]}];
      });
      setLog(p=>[...p,`오답 "${battleStage===2?word.m:word.w}" · -${ed}HP`]);
      // VOC-105: 오답 피드백 (랜덤 메시지)
      const revMsgs = [
        "다음엔 꼭 복수하자.",
        "틀린 단어가 Revenge Land에 쌓였습니다.",
        "복수 후보 등록 완료.",
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

  function nextWord(wc=wrongCount) {
    const nxt=qIdx+1;
    if(nxt>=queue.length){endBattle(true,wc);return;}
    setQIdx(nxt);
    const w=queue[nxt];
    setCurOpts(battleStage===2?getMasterOpts(w):getOpts(w));
    setSel(null); setPhase("question");
  }

  function endBattle(didWin, wc=wrongCount) {
    stopBGM();
    if(didWin) sfxVictory(); else sfxDefeat();
    setPhase("end"); setWon(didWin);
    if(didWin){
      const total=queue.length;
      const stars=calcStars(wc,total);
      const key=`${curBook||"ww5"}_${curUnit}_${battleStage}`;
      setUnitStars(prev=>({...prev,[key]:Math.max(prev[key]||0,stars)}));
      const ec=20+curUnit*8; const ex=40+curUnit*12;
      setCoins(c=>c+ec);
      if(!dailyDone){ setDailyDone(true); }
      // Level up check
      const newExp = monExp+ex;
      const threshold = monLv*80;
      if(newExp>=threshold){
        const newLv=monLv+1;
        setMonLv(newLv); setMonExp(newExp-threshold);
        if(evoReady){
          setTimeout(()=>tryEvolve(),800);
        }
      } else { setMonExp(newExp); }
      setLog(p=>[...p,`Victory! +${ec}G +${ex}EXP · ${stars}★`]);

      // 알 보상 + 일일 미션 업데이트
      const totalQ = queue.length;
      const accuracy = totalQ > 0 ? (totalQ - wc) / totalQ : 0;
      const eggRarity = rollEggRarity(accuracy);
      const possLines = EGG_DROP[eggRarity] || EGG_DROP.common;
      const pickedLine = possLines[Math.floor(Math.random() * possLines.length)];
      // 시간 기반 부화 메타: 전투 보상 알은 인벤토리에 추가
      addEggToInventory(eggRarity, pickedLine, "unit_clear");

      // 유닛 클리어 미션 업데이트
      setDailyMissions(prev => prev.map(m => {
        if (m.done) return m;
        if (m.id === "unit1") {
          const np = Math.min(m.target, m.progress + 1);
          return { ...m, progress: np, done: np >= m.target };
        }
        return m;
      }));
    } else {
      setLog(p=>[...p,`${mon.name} fainted...`]);
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
      }),
      answerCorrect: () => {
        if (screen !== "battle" || phase !== "question") return false;
        const word = queue[qIdx];
        if (!word) return false;
        const correctAns = battleStage === 2 ? word.m : word.w;
        answer(correctAns);
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

        {/* Header */}
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>📘 교재 선택</div>
          <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:4}}>
            공부할 교재를 고르세요
          </div>
        </div>

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

        <button data-testid="bookselect-back-button" className="big-btn" onClick={()=>setScreen(mon?"world":"title")}
          style={{padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612",flexShrink:0}}>
          BACK
        </button>
      </div>
    );
  }

  // 로그인 전이면 로그인 화면 표시
  if (!player) return <LoginScreen onLogin={handleLogin} />;

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
    const firstEgg = pendingEggs[0];
    const eggLine = firstEgg ? CATCH_MON_LINES.find(l=>l.lineId===firstEgg.lineId) : null;

    function claimDailyEgg() {
      if (!hasFreeEgg) return;
      const possLines = EGG_DROP.common;
      const lineId2 = possLines[Math.floor(Math.random() * possLines.length)];
      addEggToInventory("common", lineId2, "daily");
      setDailyEggDate(today);
      setToast("무료 알을 받았습니다. 알 탭에서 부화를 시작하세요.");
    }

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

        {/* 시작 버튼 */}
        <button data-testid="title-start-button" className="big-btn" onClick={()=>setScreen(mon?"world":"bookselect")}
          style={{padding:"clamp(13px,3vmin,18px)",fontSize:"clamp(15px,4vmin,18px)",
            color:"#fff",background:"linear-gradient(135deg,#3C7020,#5AA030)",
            boxShadow:"0 5px 0 #1E3A10",flexShrink:0,letterSpacing:1}}>
          {(lineId && totalStars > 0) ? "이어서 플레이" : "게임 시작"}
        </button>

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

        {/* Revenge Land 진입 배너 (오답 3개 이상일 때) */}
        {wrongWords.length >= 3 && (
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
                Revenge Land 입장 가능
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(9px,2.3vmin,11px)",color:"#884422",marginTop:2}}>
                {wrongWords.length}개 단어가 복수를 기다리고 있습니다. 추가 보상도 준비되어 있습니다.
              </div>
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(10px,2.5vmin,12px)",color:"#FF6644",flexShrink:0}}>GO</div>
          </div>
        )}

        {/* 하단 버튼 그리드 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,flexShrink:0}}>
          {[
            {l:"도감", fn:()=>setScreen("collection"), bg:"linear-gradient(135deg,#2A1880,#4A2AAA)"},
            {l:`🥚 알${readyEggCount>0?" !":""}`, fn:()=>setScreen("eggs"), bg:readyEggCount>0?"linear-gradient(135deg,#5A1CA8,#8E4BFF)":"#16122A"},
            {l:`복수${wrongWords.length>0?" !":""}`, fn:()=>setScreen("revenge"), bg:wrongWords.length>0?"linear-gradient(135deg,#3A0800,#660A00)":"#16122A"},
            {l:"랭킹", fn:()=>setScreen("leaderboard"), bg:"linear-gradient(135deg,#1A1400,#2A2200)"},
            {l:`상점 ${caughtMons.length>0?coins+"G":"--"}`, fn:()=>setScreen("shop"), bg:"linear-gradient(135deg,#0A2A1A,#0A4A2A)"},
            {l:"파트너", fn:()=>setScreen("select"), bg:"#16122A"},
            {l:"교재", fn:()=>setScreen("bookselect"), bg:"#16122A"},
          ].map((b,i)=>(
            <button
              key={i}
              data-testid={
                b.l.includes("도감") ? "nav-collection" :
                b.l.includes("알") ? "nav-eggs" :
                b.l.includes("상점") ? "nav-shop" :
                b.l.includes("파트너") ? "nav-select" :
                b.l.includes("교재") ? "nav-bookselect" :
                undefined
              }
              className="big-btn" onClick={b.fn}
              style={{padding:"clamp(9px,2.2vmin,12px) 4px",fontSize:"clamp(11px,3vw,13px)",
                color:"#E0D8FF",background:b.bg,boxShadow:"0 3px 0 #080612"}}>
              {b.l}
            </button>
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
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>PARTNER SELECT</div>
          <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:4}}>
            {ownedPartners.length > 0 ? "보유한 몬스터 중 대표 파트너를 고르세요." : "아직 보유 몬스터가 없습니다. 첫 라인을 선택하세요."}
          </div>
        </div>

        <div style={{width:"100%",maxWidth:540,flex:1,display:"flex",flexDirection:"column",gap:"clamp(8px,2vh,12px)",justifyContent:"flex-start",overflowY:"auto"}}>
          {ownedPartners.length > 0 ? (
            ownedPartners.map(({ line, stage, index, entry }) => {
              const active = mon?.id === stage.id;
              const expBase = Math.max(80, (entry?.level ?? 1) * 80);
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
            CATCH_MON_LINES.map((line) => {
              const starter = line.stages[0];
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
                    borderRadius:14,padding:"clamp(10px,2.2vh,16px)",
                    background:locked ? "#0E0C1A" : `linear-gradient(135deg,#12101E,${starter.color}18)`,
                    border:`2px solid ${locked ? "#1A1828" : starter.color+"55"}`,
                    boxShadow:locked ? "none" : `0 0 20px ${starter.glow}22,0 4px 0 rgba(0,0,0,.6)`,
                    cursor:locked ? "not-allowed" : "pointer",opacity:locked ? .4 : 1,
                    display:"flex",alignItems:"center",gap:"clamp(10px,2.5vw,16px)"
                  }}>
                  <div style={{display:"flex",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    {line.stages.map((st, si)=>(
                      <div key={si} style={{opacity:.4+si*.3,animation:`floatBob ${2.2+si*.4}s ease-in-out infinite`}}>
                        <st.Sprite w={Math.min(32+si*14,Math.max(22+si*10,Math.floor(window.innerWidth*(0.05+si*.02))))}/>
                      </div>
                    ))}
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
            })
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

        <div style={{display:"flex",gap:8,flexShrink:0,width:"100%",maxWidth:520}}>
          <button className="big-btn" onClick={()=>setScreen("title")}
            style={{flex:1,padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
              color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
            BACK
          </button>
        </div>
      </div>
    );
  }

  // World map
  if(screen==="world"&&mon) {
    const bookInfo = BOOK_SERIES.find((b)=>b.id===(curBook||"ww5"));
    const expPct=Math.min(100,(monExp/(monLv*80))*100);
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
              EVOLVING!
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
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#BB66FF",marginBottom:12}}>EVOLUTION!</div>
              <div style={{animation:"floatBob 2s ease-in-out infinite",marginBottom:12}}>
                {(() => { const S=mon?.Sprite; const w=Math.min(96,Math.max(60,Math.floor(window.innerWidth*.2))); return S ? <S w={w}/> : null; })()}
              </div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842",marginBottom:6}}>{newMonName}</div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginBottom:16}}>{mon?.desc}</div>
              <button data-testid="evolution-modal-close" className="big-btn" onClick={()=>setShowEvoModal(false)}
                style={{padding:"clamp(10px,2.5vmin,14px) 28px",fontSize:"var(--fs-sm)",color:"#fff",background:"linear-gradient(135deg,#6600CC,#AA44FF)",boxShadow:"0 4px 0 #330066"}}>
                AWESOME
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

        <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gridAutoRows:"minmax(clamp(52px,11vh,68px),auto)",gap:"clamp(5px,1.5vmin,8px)",overflowY:"auto",minHeight:0}}>
          {[...Array(bookInfo?.units||12)].map((_,i)=>{
            const uid=i+1;
            const u=getUnitInfo(curBook||"ww5", uid);
            const ok=uid===1||Object.keys(unitStars).some(k=>{
              const [bk,un]=k.split("_"); return bk===(curBook||"ww5")&&parseInt(un)===uid-1&&unitStars[k]>=1;
            });
            const bestStars=Math.max(0,...[0,1,2].map(s=>getUnitStars(uid,s)));
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
                style={{borderRadius:10,cursor:ok?"pointer":"not-allowed",opacity:ok?1:.35,background:bestStars===3?"linear-gradient(135deg,#0A1A08,#0A2A0A)":bestStars>0?"#16122A":"#110F1E",border:`2px solid ${bestStars===3?"#44CC7755":bestStars>0?"var(--rim)":"#1A1828"}`,boxShadow:bestStars===3?"0 0 10px rgba(68,204,119,.2),0 3px 0 rgba(0,0,0,.5)":"0 3px 0 rgba(0,0,0,.5)",display:"flex",alignItems:"center",gap:"clamp(5px,1.3vw,9px)",padding:"clamp(7px,1.5vmin,11px) clamp(8px,1.8vw,12px)"}}>
                <span style={{fontSize:"clamp(20px,5vmin,28px)",flexShrink:0,filter:ok?`drop-shadow(0 0 5px ${bestStars>0?"#F5C842":"rgba(255,255,255,.1)"})`:"none"}}>{ok?u.emoji:"🔒"}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2.2vmin,10px)",color:bestStars===3?"#44CC77":"#E8E0F0",marginBottom:2}}>Unit {uid}</div>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"clamp(10px,2.6vmin,12px)",color:"#9080B0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.short}</div>
                  {bestStars>0&&<Stars count={bestStars} size="sm"/>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,flexShrink:0}}>
          {[
            {l:"교재",  fn:()=>setScreen("bookselect"),  bg:"linear-gradient(135deg,#1A3020,#2A5030)", sh:"#0A1810",       dt:"world-bookselect-button"},
            {l:"도감",  fn:()=>setScreen("collection"),  bg:"linear-gradient(135deg,#3A1880,#5A28B8)", sh:"#18083A",       dt:"world-collection-button"},
            {l:`🥚 알${readyEggCount>0?"!":""}`, fn:()=>setScreen("eggs"), bg:readyEggCount>0?"linear-gradient(135deg,#4A1880,#7B2FBE)":"#1C182E", sh:readyEggCount>0?"#200A40":"#080612", dt:"world-eggs-button"},
            {l:"상점",  fn:()=>setScreen("shop"),        bg:"linear-gradient(135deg,#0A2A1A,#0A4A2A)", sh:"#041208"},
            {l:wrongWords.length>0?"복수!":"복수", fn:()=>setScreen("revenge"), bg:wrongWords.length>0?"linear-gradient(135deg,#3A0800,#660A00)":"#1C182E", sh:wrongWords.length>0?"#1A0000":"#080612"},
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
          padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.5vh,16px)",overflow:"hidden"}}>
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
              const locked=req&&getUnitStars(uid,req-1)<1;
              return (
                <div key={stg}
                  data-testid={`unit-stage-${stg}`}
                  role="button"
                  tabIndex={locked ? -1 : 0}
                  aria-disabled={locked}
                  aria-label={`${label}${locked?" (잠김)":""}`}
                  onClick={()=>!locked&&startBattle(uid,stg)}
                  onKeyDown={e=>{if(!locked&&(e.key==="Enter"||e.key===" ")){e.preventDefault();startBattle(uid,stg);}}}
                  className="card-btn"
                  style={{
                    borderRadius:12,padding:"clamp(12px,2.5vh,16px)",
                    background:locked?"#0E0C1A":`linear-gradient(135deg,#14121E,${color}18)`,
                    border:`2px solid ${locked?"#1A1828":stars>0?color+"55":"var(--rim)"}`,
                    cursor:locked?"not-allowed":"pointer",opacity:locked ? .4 : 1,
                    display:"flex",alignItems:"center",gap:12,
                    boxShadow:locked?"none":"0 3px 0 rgba(0,0,0,.5)",
                  }}>
                  <div style={{fontSize:"clamp(24px,5.5vmin,32px)",flexShrink:0}}>{locked?"🔒":icon}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:locked?"#444":color}}>{label}</span>
                      <Stars count={stars} size="sm"/>
                    </div>
                    <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888"}}>{desc}</div>
                    {locked&&<div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#4A3A60",marginTop:4}}>
                      이전 단계를 먼저 클리어하세요.
                    </div>}
                    {!locked&&wrongQueue.length>0&&curUnit===uid&&battleStage===stg&&(
                      <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",
                        color:"#EE4444",marginTop:4,animation:"pulse .8s ease-in-out infinite"}}>
                        오답 {wrongQueue.length}개 복습 필요
                      </div>
                    )}
                  </div>
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

    // What to show in the question panel
    const qPrompt = battleStage===0 ? word?.def
                  : battleStage===1 ? `뜻 ${word?.m}`
                  : `단어 ${word?.w}`;
    const qHint   = battleStage===0 ? `뜻 ${word?.m}` : battleStage===1 ? word?.def : word?.def;

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
        <div style={{position:"relative",flex:"0 0 auto",height:"clamp(160px,30vh,240px)",overflow:"hidden"}}>
          {bgSvg}

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
              : "floatBob 3s ease-in-out infinite"
          }}>
            <curEnemy.Sprite
              w={Math.min(86,Math.max(52,Math.floor(window.innerHeight*.14)))}
              hurt={shakeE}/>
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

          {/* Question card */}
          {word&&(
            <div className="battle-panel" style={{padding:"clamp(9px,2vmin,13px) clamp(10px,2.5vw,15px)",flexShrink:0}}>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",
                color:"#888",marginBottom:5,textTransform:"uppercase",letterSpacing:".04em"}}>
                {battleStage===0?"Definition -> Word":battleStage===1?"Korean -> Word":"Word -> Korean"}
              </div>
              <div data-testid="battle-question-prompt" style={{fontFamily:"var(--f-ui)",fontWeight:800,
                fontSize:"clamp(14px,3.8vmin,17px)",
                color:"#18100E",lineHeight:1.65,wordBreak:"break-word"}}>
                {qPrompt}
              </div>
              <div data-testid="battle-question-hint" style={{marginTop:6,paddingTop:6,borderTop:"2px solid #C8C0B0",
                fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"clamp(11px,2.8vmin,13px)",color:"#7A5A30"}}>
                {qHint}
              </div>
            </div>
          )}

          {/* Answer options */}
          {word&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(5px,1.5vmin,8px)",flexShrink:0}}>
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
          <div ref={logRef} style={{flex:"0 1 auto",maxHeight:"clamp(72px,14vh,104px)",overflowY:"auto",
            background:"#0A0818",borderRadius:8,border:"1px solid var(--rim)",
            padding:"clamp(5px,1.2vmin,8px) 12px"}}>
            {log.slice(-4).map((l,i,a)=>(
              <div key={i} style={{fontFamily:"var(--f-ui)",fontWeight:700,
                fontSize:"clamp(11px,2.8vmin,13px)",
                color:i===a.length-1?"#E8E0FF":"#5A4A78",marginBottom:3,lineHeight:1.5}}>{l}</div>
            ))}
          </div>

          {/* 도망가기 버튼 */}
          <button className="big-btn" onClick={()=>{
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
    return (
      <div data-testid="result-screen" className="crt page slide-up" style={{position:"relative",
        alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",
        background:won?"radial-gradient(ellipse at 50% 30%,#0A2814,#0C0A18)":
                       "radial-gradient(ellipse at 50% 30%,#280808,#0C0A18)"}}>
        <style>{CSS}</style>
        <div style={{marginBottom:12,animation:"floatBob 2.5s ease-in-out infinite"}}>
          <mon.Sprite w={Math.min(100,Math.max(64,Math.floor(window.innerWidth*.2)))}
            fainted={!won}/>
        </div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,4.5vmin,28px)",letterSpacing:2,
          color:won?"#F5C842":"#EE3322",
          textShadow:won?"0 0 28px rgba(245,200,66,.6),3px 3px 0 #6A3A00":"0 0 28px rgba(220,30,10,.6),3px 3px 0 #600000",
          marginBottom:8}}>{won?"VICTORY!":"DEFEAT..."}</div>

        {won&&(
          <div style={{marginBottom:12}}>
            <Stars count={stars} max={3}/>
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

        <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300}}>
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
            <button data-testid="result-retry-button" className="big-btn" onClick={()=>startBattle(curUnit,battleStage,curBook)}
              style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
                background:"linear-gradient(135deg,#2A1880,#4A2AAA)",boxShadow:"0 4px 0 #0A0838"}}>
              다시 도전
            </button>
          )}
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
            <div style={{fontSize:"clamp(36px,10vmin,52px)",marginBottom:10,animation:"floatBob 1.5s ease-in-out infinite"}}>⚔️</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(13px,3.5vmin,16px)",color:"#FF8844",marginBottom:8}}>복수의 기회!</div>
            <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(10px,2.6vmin,12px)",color:"#AA6633",lineHeight:1.6,marginBottom:20}}>
              틀린 단어 <strong style={{color:"#FF6644"}}>{wrongWords.length}개</strong>가 복수를 기다리고 있습니다.<br/>
              지금 Revenge Land에서<br/>
              <strong style={{color:"#FFB844"}}>코인 + 추가 보상</strong>을 챙기세요.
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
                cursor:"pointer",boxShadow:"0 4px 0 #550000",fontWeight:700}}>바로 복수하러 가기</button>
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
          알이 부화했습니다
        </div>
        <div className="egg-pop" style={{marginTop:8}}>
          <Sp w={Math.min(160, window.innerWidth*0.38)}/>
        </div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,5vw,28px)",color:line?.typeClr||"#FFD700",marginTop:4}}>
          {eggHatch.mon.name}
        </div>
        <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(11px,3vw,14px)",color:"#9988CC",textAlign:"center",maxWidth:260,lineHeight:1.5}}>
          {eggHatch.mon.desc}
        </div>
        <div style={{color:"#6A5888",fontSize:"clamp(10px,2.5vw,13px)",marginTop:4}}>
          {line?.type} TYPE
        </div>
        <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(11px,3vw,14px)",color:eggHatch.outcome==="duplicate"?"#FFD37A":"#8FFFC8",textAlign:"center"}}>
          {eggHatch.outcome==="duplicate"
            ? `중복 보상: 라인 EXP +${eggHatch.reward?.lineExp ?? 0}${(eggHatch.reward?.evolutionCores ?? 0) > 0 ? ` · 코어 +${eggHatch.reward.evolutionCores}` : ""}`
            : "NEW 몬스터 등록"}
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

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#D6B2FF"}}>EGG HATCHERY</div>
            <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#7F70A0",marginTop:4}}>
              알을 부화기에 올리고 시간이 끝나면 직접 깨서 몬스터를 획득합니다.
            </div>
          </div>
          <div style={{textAlign:"right",fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#A996D8"}}>
            <div data-testid="eggs-inventory-count">인벤토리 {pendingEggs.length}</div>
            <div data-testid="eggs-running-summary">부화중 {runningEggCount}</div>
            <div data-testid="eggs-ready-summary">수령대기 {readyEggCount}</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,flexShrink:0}}>
          {hatcherySlots.map((slot) => {
            const line = slot.egg ? CATCH_MON_LINES.find((entry) => entry.lineId === slot.egg.lineId) : null;
            const slotLabel = `부화기 ${slot.slotId}`;
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
                      {!slot.unlocked && "잠겨 있음"}
                      {slot.unlocked && !slot.egg && "비어 있음"}
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
                const autoTarget = hatcherySlots.find((slot) => slot.unlocked && !slot.egg);
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
                          {line?.type || "mystery"} 계열 · {formatHatchRemaining({ finishesAt: Date.now() + (HATCH_DURATIONS_MS[egg.rarity] ?? HATCH_DURATIONS_MS.common) })}
                        </div>
                      </div>
                    </div>
                    <button
                      data-testid={`egg-inventory-start-${egg.id}`}
                      className="big-btn"
                      disabled={!autoTarget}
                      onClick={()=>{
                        const targetSlot = hatcherySlots.find((slot) => slot.unlocked && !slot.egg);
                        if (!targetSlot) { setToast("빈 부화기가 없습니다."); return; }
                        if (startEggInSlot(targetSlot.slotId, egg)) {
                          setToast(`${line?.eggEmoji || "🥚"} 알을 부화기 ${targetSlot.slotId}번에 올렸습니다.`);
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
                      {autoTarget ? `부화기 ${autoTarget.slotId}에 올리기` : "빈 부화기 없음"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")} style={{
            flex:1,padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
            BACK
          </button>
          <button data-testid="eggs-home-button" className="big-btn" onClick={()=>setScreen("title")} style={{
            flex:1,padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
            홈으로
          </button>
        </div>
      </div>
    );
  }

// ─────────────────────────────────────────────────────────────────
//  SHOP SCREEN
  if(screen==="shop") {
    const ITEMS = [
      { id:"egg_common",   emoji:"🥚", name:"일반 알",      desc:"Common 라인 중심",         price:50,  rarity:"common" },
      { id:"egg_rare",     emoji:"🥚", name:"레어 알",      desc:"Rare 이상 확률 증가",      price:150, rarity:"rare" },
      { id:"egg_sr",       emoji:"🌙", name:"슈퍼레어 알",  desc:"Shadow/Bolt 라인 중심",    price:350, rarity:"superrare" },
      { id:"hatch_now",    emoji:"⚡", name:"즉시 부화",    desc:"진행 중인 첫 알을 바로 완료", price:80,  action:"hatch" },
      { id:"hatch_slot",   emoji:"🔓", name:"부화기 슬롯",  desc:"잠겨 있는 다음 부화기 해금", price:220, action:"slot" },
      { id:"shield",       emoji:"🛡️", name:"스트릭 실드", desc:"하루 실수 1회를 막아줌",   price:100, action:"shield" },
      { id:"title_warrior",emoji:"🏅", name:"칭호: 단어전사", desc:"이름 옆에 칭호 표시",     price:200, action:"title_warrior" },
    ];

    function buyItem(item) {
      if (coins < item.price) { setToast("코인이 부족합니다."); return; }
      setCoins(c => c - item.price);
      if (item.action === "hatch") {
        if (!instantFinishFirstSlot()) { setCoins(c=>c+item.price); setToast("진행 중인 알이 없습니다."); return; }
        setToast("첫 번째 부화중인 알을 즉시 완료했습니다.");
      } else if (item.action === "slot") {
        if (!unlockNextHatchSlot()) { setCoins(c=>c+item.price); setToast("모든 부화기가 이미 열려 있습니다."); return; }
        setToast("새 부화기 슬롯이 열렸습니다.");
      } else if (item.action === "shield") {
        setStreakShields(s => s + 1);
        setToast("스트릭 실드 +1! 하루 실수 1회를 막아줍니다.");
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
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#44FF88"}}>🛒 SHOP</div>
          <div style={{background:"#1A2A1A",borderRadius:20,padding:"6px 14px",
            border:"1px solid #226633",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:16}}>💰</span>
            <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842",fontWeight:800}}>{coins}G</span>
          </div>
        </div>

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
            const isHatchDisabled = item.action==="hatch" && runningEggCount===0;
            const isSlotDisabled = item.action==="slot" && unlockedHatchSlots>=3;
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

        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <button data-testid="shop-home-button" className="big-btn" onClick={()=>setScreen(mon?"world":"title")} style={{
            flex:1,padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
            BACK
          </button>
          <button className="big-btn" onClick={()=>setScreen("title")} style={{
            flex:1,padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
            홈으로
          </button>
        </div>
      </div>
    );
  }

  // REVENGE LAND 화면
  if(screen==="revenge") return (
    <RevengeLandScreen
      wrongWords={wrongWords} setWrongWords={setWrongWords}
      mon={mon} monLv={monLv} setMonLv={setMonLv} setMonExp={setMonExp}
      coins={coins} setCoins={setCoins}
      pendingEggs={pendingEggs} setPendingEggs={setPendingEggs}
      addEggToInventory={addEggToInventory}
      dailyMissions={dailyMissions} setDailyMissions={setDailyMissions}
      setScreen={setScreen} setToast={setToast}
    />
  );

  // LEADERBOARD 화면
  if(screen==="leaderboard") return (
    <LeaderboardScreen
      player={player} mon={mon} setScreen={setScreen}
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

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>MONSTER DEX</div>
                <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#8C7AAE",marginTop:4}}>
              진화로 최종 완성한 라인 기준 진행률
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div data-testid="dex-progress-completed-lines" style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-sm)",color:"#F5C842"}}>
              {dexProgress.completedLines}/{dexProgress.totalLines}
            </div>
            <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#8C7AAE",marginTop:4}}>
              발견 {dexProgress.ownedMonsters}/{dexProgress.totalMonsters}
            </div>
          </div>
        </div>

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
                          <div style={{fontFamily:"var(--f-ui)",fontSize:"clamp(8px,2vmin,10px)",color:"#7E6A9C",marginTop:3}}>
                            {owned ? `Lv.${entry?.level ?? 1} · 중복 ${entry?.duplicateCount ?? 0}` : `진화 ${index+1}`}
                          </div>
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

        <button data-testid="collection-back-button" className="big-btn" onClick={()=>setScreen(mon?"world":"title")}
          style={{padding:"clamp(10px,2.2vmin,14px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612",marginBottom:8}}>
          BACK
        </button>
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
