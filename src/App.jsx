import React, { useState, useEffect, useRef, useCallback } from "react";
import LoginScreen from "./LoginScreen.jsx";
import { loadProgress, saveProgress } from "./supabase.js";
import { CATCH_MON_LINES, EGG_DROP, rollEggRarity, rollMonsterFromLine } from "./catchMons.jsx";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PLAYER MONSTERS — face RIGHT naturally (no flip needed)
//  Cute, round, big eyes. Original designs.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── INK LINE ─────────────────────────────────────────
// INKLET – pudgy ink ghost, big glossy eyes, tiny quill horn (faces right)
const InkletSprite = ({ w=80, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 5px 10px #2244CC88)"}}>
    {/* quill horn */}
    <rect x="28" y="2"  width="3" height="12" fill="#F0E8CC"/>
    <rect x="27" y="4"  width="2" height="8"  fill="#DDD4AA"/>
    <rect x="30" y="4"  width="2" height="8"  fill="#DDD4AA"/>
    <rect x="28" y="12" width="3" height="3"  fill="#1A1A88"/>
    {/* ink drip tip */}
    <rect x="29" y="0"  width="1" height="3"  fill="#4455FF"/>
    {/* body – big round blob */}
    <rect x="8"  y="20" width="32" height="22" fill="#3344DD"/>
    <rect x="6"  y="22" width="36" height="18" fill="#3344DD"/>
    <rect x="10" y="16" width="28" height="6"  fill="#3344DD"/>
    <rect x="14" y="13" width="20" height="5"  fill="#3344DD"/>
    {/* body shine top-left */}
    <rect x="10" y="17" width="10" height="7"  fill="#6677FF" opacity="0.55"/>
    <rect x="11" y="18" width="6"  height="4"  fill="#99AAFF" opacity="0.4"/>
    {/* belly lighter patch */}
    <rect x="14" y="28" width="14" height="10" fill="#4A55EE" opacity="0.5"/>
    {/* RIGHT-facing eyes (eyes on right side of face) */}
    <rect x="22" y="19" width="10" height="10" fill="#fff"/>
    <rect x="32" y="21" width="8"  height="8"  fill="#fff"/>
    <rect x="24" y="20" width="7"  height="8"  fill="#0A0A3A"/>
    <rect x="33" y="22" width="5"  height="6"  fill="#0A0A3A"/>
    <rect x="26" y="21" width="3"  height="4"  fill="#4466FF"/>
    <rect x="34" y="23" width="2"  height="3"  fill="#4466FF"/>
    {/* eye glints */}
    <rect x="24" y="21" width="2"  height="2"  fill="#fff" opacity="0.9"/>
    <rect x="33" y="23" width="1"  height="1"  fill="#fff" opacity="0.9"/>
    {/* tiny smile */}
    <rect x="28" y="30" width="8"  height="2"  fill="#2233BB"/>
    <rect x="30" y="32" width="4"  height="2"  fill="#2233BB"/>
    {/* ink drip legs */}
    <rect x="12" y="40" width="6"  height="6"  fill="#2233BB"/>
    <rect x="22" y="42" width="5"  height="5"  fill="#2233BB"/>
    <rect x="30" y="40" width="6"  height="6"  fill="#2233BB"/>
    <rect x="12" y="44" width="6"  height="3"  fill="#1122AA"/>
    <rect x="30" y="44" width="6"  height="3"  fill="#1122AA"/>
    {/* tiny arms */}
    <rect x="4"  y="28" width="5"  height="4"  fill="#3344DD"/>
    <rect x="2"  y="30" width="4"  height="3"  fill="#2233CC"/>
  </svg>
);

// QUILLON – ink knight, rounded armor, big cute visor eyes (faces right)
const QuillonSprite = ({ w=88, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 5px 12px #3355DD88)"}}>
    {/* feather sword (right side since facing right) */}
    <rect x="38" y="4"  width="4"  height="24" fill="#F0E8CC"/>
    <rect x="37" y="6"  width="3"  height="18" fill="#DDD4AA"/>
    <rect x="41" y="6"  width="3"  height="18" fill="#DDD4AA"/>
    <rect x="38" y="2"  width="4"  height="4"  fill="#4455FF"/>
    <rect x="37" y="26" width="6"  height="4"  fill="#997700"/>
    {/* cape (left side) */}
    <rect x="2"  y="22" width="8"  height="20" fill="#1A1A77"/>
    <rect x="0"  y="24" width="8"  height="16" fill="#2222AA"/>
    {/* body */}
    <rect x="10" y="18" width="26" height="22" fill="#3344DD"/>
    <rect x="8"  y="20" width="30" height="18" fill="#3344DD"/>
    {/* chest plate */}
    <rect x="12" y="20" width="22" height="14" fill="#4455EE"/>
    <rect x="14" y="22" width="18" height="10" fill="#5566FF"/>
    {/* ink emblem on chest */}
    <rect x="19" y="24" width="8"  height="2"  fill="#AABBFF" opacity="0.7"/>
    <rect x="21" y="27" width="4"  height="3"  fill="#AABBFF" opacity="0.5"/>
    {/* round helmet */}
    <rect x="12" y="4"  width="24" height="16" fill="#3344DD"/>
    <rect x="10" y="6"  width="28" height="12" fill="#3344DD"/>
    <rect x="14" y="2"  width="20" height="4"  fill="#4455EE"/>
    {/* visor — cute wide eye slit, right-side weighted */}
    <rect x="10" y="9"  width="28" height="6"  fill="#0A1177"/>
    <rect x="12" y="10" width="24" height="4"  fill="#0D1499"/>
    {/* glowing eyes through visor */}
    <rect x="20" y="10" width="8"  height="4"  fill="#5588FF"/>
    <rect x="28" y="10" width="8"  height="3"  fill="#7799FF"/>
    <rect x="22" y="10" width="4"  height="3"  fill="#AACCFF"/>
    <rect x="30" y="10" width="4"  height="2"  fill="#AACCFF"/>
    {/* helmet crest */}
    <rect x="20" y="0"  width="8"  height="4"  fill="#4455EE"/>
    <rect x="22" y="0"  width="4"  height="2"  fill="#6677FF"/>
    {/* legs */}
    <rect x="12" y="38" width="9"  height="8"  fill="#2233CC"/>
    <rect x="24" y="38" width="9"  height="8"  fill="#2233CC"/>
    <rect x="11" y="44" width="11" height="3"  fill="#1122BB"/>
    <rect x="23" y="44" width="11" height="3"  fill="#1122BB"/>
    {/* sword arm */}
    <rect x="36" y="20" width="6"  height="8"  fill="#3344DD"/>
  </svg>
);

// SCRIPTAR – majestic scroll mage, billowy robe, big wise eyes (faces right)
const ScriptarSprite = ({ w=96, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 6px 16px #2255FF99)"}}>
    {/* orbiting mini scrolls */}
    <rect x="0"  y="8"  width="9"  height="6"  fill="#F0E8CC"/>
    <rect x="0"  y="8"  width="9"  height="2"  fill="#DDD4AA"/>
    <rect x="0"  y="12" width="9"  height="2"  fill="#DDD4AA"/>
    <rect x="1"  y="10" width="7"  height="2"  fill="#5566FF" opacity="0.5"/>
    <rect x="38" y="14" width="9"  height="6"  fill="#F0E8CC"/>
    <rect x="38" y="14" width="9"  height="2"  fill="#DDD4AA"/>
    <rect x="38" y="18" width="9"  height="2"  fill="#DDD4AA"/>
    <rect x="39" y="16" width="7"  height="2"  fill="#5566FF" opacity="0.5"/>
    {/* big flowing robe */}
    <rect x="6"  y="22" width="36" height="24" fill="#2233BB"/>
    <rect x="4"  y="24" width="40" height="20" fill="#2233BB"/>
    <rect x="2"  y="28" width="10" height="16" fill="#1A2299"/>
    <rect x="36" y="28" width="10" height="16" fill="#1A2299"/>
    {/* robe star pattern */}
    <rect x="18" y="28" width="12" height="10" fill="#3344CC"/>
    <rect x="20" y="30" width="8"  height="6"  fill="#5566EE"/>
    <rect x="22" y="31" width="4"  height="4"  fill="#8899FF"/>
    <rect x="23" y="32" width="2"  height="2"  fill="#CCddFF"/>
    {/* body under robe */}
    <rect x="10" y="12" width="28" height="12" fill="#3344DD"/>
    <rect x="8"  y="14" width="32" height="10" fill="#3344DD"/>
    {/* big round head */}
    <rect x="10" y="2"  width="28" height="14" fill="#2233CC"/>
    <rect x="8"  y="4"  width="32" height="12" fill="#3344DD"/>
    {/* wizard hat */}
    <rect x="14" y="0"  width="20" height="4"  fill="#2233BB"/>
    <rect x="8"  y="2"  width="32" height="4"  fill="#1A2299"/>
    <rect x="18" y="0"  width="12" height="2"  fill="#3344CC"/>
    {/* hat star */}
    <rect x="22" y="0"  width="4"  height="2"  fill="#AABBFF"/>
    {/* ink beard */}
    <rect x="12" y="13" width="8"  height="5"  fill="#3355EE"/>
    <rect x="14" y="16" width="6"  height="4"  fill="#4466FF"/>
    {/* big right-weighted eyes */}
    <rect x="20" y="6"  width="10" height="8"  fill="#fff"/>
    <rect x="30" y="6"  width="8"  height="8"  fill="#fff"/>
    <rect x="22" y="7"  width="7"  height="6"  fill="#0A0A3A"/>
    <rect x="31" y="7"  width="5"  height="6"  fill="#0A0A3A"/>
    <rect x="24" y="8"  width="3"  height="3"  fill="#5588FF"/>
    <rect x="32" y="8"  width="2"  height="3"  fill="#5588FF"/>
    <rect x="22" y="7"  width="2"  height="2"  fill="#fff" opacity="0.9"/>
    <rect x="31" y="7"  width="1"  height="1"  fill="#fff" opacity="0.9"/>
    {/* staff (right hand) */}
    <rect x="40" y="8"  width="4"  height="36" fill="#885522"/>
    <rect x="38" y="6"  width="8"  height="8"  fill="#4455FF"/>
    <rect x="40" y="4"  width="4"  height="4"  fill="#8899FF"/>
    <rect x="41" y="3"  width="2"  height="3"  fill="#CCDDFF"/>
    {/* hands */}
    <rect x="2"  y="26" width="6"  height="5"  fill="#2233BB"/>
    <rect x="40" y="26" width="6"  height="5"  fill="#2233BB"/>
  </svg>
);

// ── RUNE LINE ─────────────────────────────────────────
// RUNIX – chubby pebble creature, amber eyes, rune glow (faces right)
const RunixSprite = ({ w=80, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 5px 10px #CC880044)"}}>
    {/* floating pebble chips */}
    <rect x="2"  y="12" width="5" height="5"  fill="#998877" opacity="0.7"/>
    <rect x="40" y="18" width="4" height="4"  fill="#887766" opacity="0.6"/>
    <rect x="4"  y="22" width="3" height="3"  fill="#AA9988" opacity="0.5"/>
    {/* chubby round stone body */}
    <rect x="8"  y="20" width="32" height="22" fill="#AA9988"/>
    <rect x="6"  y="22" width="36" height="18" fill="#BBAA99"/>
    <rect x="10" y="16" width="28" height="6"  fill="#AA9988"/>
    <rect x="14" y="13" width="20" height="5"  fill="#BBAA99"/>
    {/* stone texture */}
    <rect x="8"  y="24" width="6"  height="3"  fill="#998877" opacity="0.5"/>
    <rect x="30" y="28" width="8"  height="3"  fill="#998877" opacity="0.4"/>
    {/* carved rune on chest */}
    <rect x="16" y="26" width="14" height="2"  fill="#FF9900"/>
    <rect x="20" y="28" width="6"  height="5"  fill="#FF9900"/>
    <rect x="16" y="33" width="14" height="2"  fill="#FF9900"/>
    {/* rune glow */}
    <rect x="17" y="27" width="12" height="8"  fill="#FFAA00" opacity="0.2"/>
    <rect x="19" y="29" width="8"  height="4"  fill="#FFCC44" opacity="0.25"/>
    {/* big right-facing eyes */}
    <rect x="22" y="18" width="10" height="10" fill="#FF9900"/>
    <rect x="32" y="20" width="8"  height="8"  fill="#FF9900"/>
    <rect x="24" y="19" width="7"  height="8"  fill="#FFCC44"/>
    <rect x="33" y="21" width="5"  height="6"  fill="#FFCC44"/>
    <rect x="26" y="21" width="3"  height="4"  fill="#1A0A00"/>
    <rect x="34" y="22" width="2"  height="3"  fill="#1A0A00"/>
    <rect x="24" y="19" width="2"  height="2"  fill="#fff" opacity="0.8"/>
    <rect x="33" y="21" width="1"  height="1"  fill="#fff" opacity="0.8"/>
    {/* stubby cute legs */}
    <rect x="12" y="40" width="8"  height="7"  fill="#998877"/>
    <rect x="26" y="40" width="8"  height="7"  fill="#998877"/>
    <rect x="11" y="45" width="10" height="3"  fill="#887766"/>
    <rect x="25" y="45" width="10" height="3"  fill="#887766"/>
    {/* tiny arms */}
    <rect x="2"  y="28" width="6"  height="5"  fill="#AA9988"/>
    <rect x="40" y="28" width="6"  height="5"  fill="#AA9988"/>
  </svg>
);

// GLYPHON – beefy stone warrior, cute determined face (faces right)
const GlyphonSprite = ({ w=88, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 5px 14px #BB660044)"}}>
    {/* chunky horns */}
    <rect x="10" y="2"  width="8"  height="10" fill="#998877"/>
    <rect x="30" y="2"  width="8"  height="10" fill="#998877"/>
    <rect x="12" y="0"  width="5"  height="6"  fill="#BBAA99"/>
    <rect x="31" y="0"  width="5"  height="6"  fill="#BBAA99"/>
    {/* big round head */}
    <rect x="8"  y="8"  width="32" height="16" fill="#BBAA99"/>
    <rect x="6"  y="10" width="36" height="12" fill="#BBAA99"/>
    {/* forehead rune */}
    <rect x="18" y="8"  width="12" height="2"  fill="#FF9900" opacity="0.8"/>
    <rect x="22" y="10" width="4"  height="2"  fill="#FFBB44" opacity="0.7"/>
    {/* big cute right-facing eyes */}
    <rect x="22" y="12" width="10" height="9"  fill="#FF9900"/>
    <rect x="32" y="13" width="8"  height="8"  fill="#FF9900"/>
    <rect x="24" y="13" width="7"  height="7"  fill="#FFCC44"/>
    <rect x="33" y="14" width="5"  height="6"  fill="#FFCC44"/>
    <rect x="26" y="15" width="3"  height="3"  fill="#1A0A00"/>
    <rect x="34" y="15" width="2"  height="3"  fill="#1A0A00"/>
    <rect x="24" y="13" width="2"  height="2"  fill="#fff" opacity="0.8"/>
    <rect x="33" y="14" width="1"  height="1"  fill="#fff" opacity="0.8"/>
    {/* determined brow */}
    <rect x="22" y="11" width="10" height="2"  fill="#887766"/>
    <rect x="32" y="12" width="7"  height="2"  fill="#887766"/>
    {/* body */}
    <rect x="8"  y="22" width="32" height="22" fill="#BBAA99"/>
    <rect x="6"  y="24" width="36" height="18" fill="#BBAA99"/>
    {/* chest rune gem */}
    <rect x="16" y="26" width="16" height="12" fill="#AA9988"/>
    <rect x="18" y="28" width="12" height="8"  fill="#CC9966"/>
    <rect x="20" y="30" width="8"  height="4"  fill="#FFAA00"/>
    <rect x="21" y="31" width="6"  height="2"  fill="#FFCC44"/>
    <rect x="22" y="32" width="4"  height="1"  fill="#FFE880"/>
    {/* rune lines */}
    <rect x="16" y="25" width="16" height="2"  fill="#FF9900" opacity="0.6"/>
    <rect x="16" y="37" width="16" height="2"  fill="#FF9900" opacity="0.6"/>
    {/* big chunky arms */}
    <rect x="0"  y="22" width="8"  height="16" fill="#BBAA99"/>
    <rect x="40" y="22" width="8"  height="16" fill="#BBAA99"/>
    <rect x="0"  y="36" width="10" height="8"  fill="#AA9988"/>
    <rect x="38" y="36" width="10" height="8"  fill="#AA9988"/>
    {/* legs */}
    <rect x="10" y="42" width="11" height="5"  fill="#998877"/>
    <rect x="26" y="42" width="11" height="5"  fill="#998877"/>
  </svg>
);

// RUNEKAI – elegant rune wyvern, sleek wings, big eyes (faces right)
const RunekaiSprite = ({ w=96, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 6px 18px #DD770044)"}}>
    {/* sweeping tail */}
    <rect x="0"  y="26" width="6"  height="14" fill="#AA9977"/>
    <rect x="2"  y="22" width="6"  height="8"  fill="#BBAA88"/>
    <rect x="0"  y="38" width="8"  height="4"  fill="#997755"/>
    {/* wings */}
    <rect x="0"  y="10" width="14" height="22" fill="#CC9966"/>
    <rect x="2"  y="8"  width="12" height="6"  fill="#DDAA77"/>
    <rect x="34" y="10" width="14" height="22" fill="#CC9966"/>
    <rect x="34" y="8"  width="12" height="6"  fill="#DDAA77"/>
    {/* wing rune marks */}
    <rect x="2"  y="14" width="10" height="2"  fill="#FF9900" opacity="0.5"/>
    <rect x="2"  y="20" width="10" height="2"  fill="#FF9900" opacity="0.5"/>
    <rect x="36" y="14" width="10" height="2"  fill="#FF9900" opacity="0.5"/>
    <rect x="36" y="20" width="10" height="2"  fill="#FF9900" opacity="0.5"/>
    {/* body */}
    <rect x="10" y="18" width="28" height="24" fill="#BBAA88"/>
    <rect x="8"  y="20" width="32" height="20" fill="#CCBB99"/>
    {/* belly */}
    <rect x="14" y="24" width="18" height="14" fill="#DDBBA0"/>
    {/* chest rune array */}
    <rect x="16" y="26" width="14" height="2"  fill="#FF9900"/>
    <rect x="18" y="29" width="10" height="2"  fill="#FFAA00"/>
    <rect x="16" y="32" width="14" height="2"  fill="#FF9900"/>
    <rect x="22" y="28" width="2"  height="2"  fill="#FFCC44" opacity="0.8"/>
    {/* big round head */}
    <rect x="12" y="4"  width="24" height="16" fill="#CCBB99"/>
    <rect x="10" y="6"  width="28" height="14" fill="#DDCCAA"/>
    {/* snout (right-facing) */}
    <rect x="32" y="12" width="12" height="6"  fill="#CCBB99"/>
    <rect x="36" y="10" width="10" height="5"  fill="#DDCCAA"/>
    {/* nostrils */}
    <rect x="38" y="12" width="3"  height="2"  fill="#CC6600" opacity="0.6"/>
    {/* big adorable eyes right-weighted */}
    <rect x="22" y="7"  width="10" height="9"  fill="#FF9900"/>
    <rect x="32" y="8"  width="8"  height="8"  fill="#FF9900"/>
    <rect x="24" y="8"  width="7"  height="7"  fill="#FFCC44"/>
    <rect x="33" y="9"  width="5"  height="6"  fill="#FFCC44"/>
    <rect x="26" y="10" width="3"  height="3"  fill="#1A0800"/>
    <rect x="34" y="10" width="2"  height="3"  fill="#1A0800"/>
    <rect x="24" y="8"  width="2"  height="2"  fill="#fff" opacity="0.9"/>
    <rect x="33" y="9"  width="1"  height="1"  fill="#fff" opacity="0.9"/>
    {/* rune crown */}
    <rect x="14" y="2"  width="5"  height="6"  fill="#AA9977"/>
    <rect x="20" y="0"  width="8"  height="6"  fill="#BBAA88"/>
    <rect x="22" y="0"  width="4"  height="3"  fill="#FFAA00"/>
    {/* legs */}
    <rect x="12" y="40" width="9"  height="6"  fill="#AA9977"/>
    <rect x="26" y="40" width="9"  height="6"  fill="#AA9977"/>
  </svg>
);

// ── ECHO LINE ─────────────────────────────────────────
// ECHOBIT – tiny round bell-bird, teal, massive cute eyes (faces right)
const EchobitSprite = ({ w=80, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 5px 10px #00BB8844)"}}>
    {/* sound rings (right side, direction of facing) */}
    <rect x="38" y="18" width="4"  height="10" fill="#00CC88" opacity="0.35"/>
    <rect x="42" y="20" width="4"  height="6"  fill="#00DDAA" opacity="0.25"/>
    {/* round body */}
    <rect x="8"  y="18" width="32" height="24" fill="#00BB88"/>
    <rect x="6"  y="20" width="36" height="20" fill="#00CC99"/>
    <rect x="10" y="14" width="28" height="6"  fill="#00BB88"/>
    <rect x="14" y="11" width="20" height="5"  fill="#00CC99"/>
    {/* body shine */}
    <rect x="8"  y="18" width="12" height="8"  fill="#44DDAA" opacity="0.5"/>
    <rect x="9"  y="19" width="7"  height="5"  fill="#88FFCC" opacity="0.4"/>
    {/* speaker grill (cute dots) */}
    <rect x="14" y="28" width="3"  height="3"  fill="#009966" opacity="0.6"/>
    <rect x="19" y="28" width="3"  height="3"  fill="#009966" opacity="0.6"/>
    <rect x="14" y="33" width="3"  height="3"  fill="#009966" opacity="0.5"/>
    <rect x="19" y="33" width="3"  height="3"  fill="#009966" opacity="0.5"/>
    {/* big right-facing eyes */}
    <rect x="22" y="16" width="12" height="11" fill="#fff"/>
    <rect x="33" y="18" width="8"  height="9"  fill="#fff"/>
    <rect x="24" y="17" width="9"  height="9"  fill="#003322"/>
    <rect x="34" y="19" width="5"  height="7"  fill="#003322"/>
    <rect x="26" y="19" width="4"  height="5"  fill="#00FFAA"/>
    <rect x="35" y="20" width="2"  height="4"  fill="#00FFAA"/>
    <rect x="24" y="17" width="3"  height="3"  fill="#fff" opacity="0.8"/>
    <rect x="34" y="19" width="2"  height="2"  fill="#fff" opacity="0.8"/>
    {/* tiny beak */}
    <rect x="36" y="24" width="8"  height="4"  fill="#FFCC00"/>
    <rect x="38" y="22" width="5"  height="4"  fill="#FFAA00"/>
    {/* little wings */}
    <rect x="2"  y="24" width="8"  height="12" fill="#009977"/>
    <rect x="2"  y="22" width="6"  height="6"  fill="#00BB88"/>
    {/* stubby legs */}
    <rect x="14" y="40" width="7"  height="6"  fill="#009977"/>
    <rect x="26" y="40" width="7"  height="6"  fill="#009977"/>
    <rect x="13" y="44" width="9"  height="3"  fill="#007755"/>
    <rect x="25" y="44" width="9"  height="3"  fill="#007755"/>
  </svg>
);

// SONARIX – elegant sound phoenix, sleek feathers (faces right)
const SonarixSprite = ({ w=88, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 5px 14px #00EE9944)"}}>
    {/* tail feathers (left since facing right) */}
    <rect x="0"  y="28" width="5"  height="16" fill="#009977"/>
    <rect x="4"  y="24" width="5"  height="18" fill="#00BB88"/>
    <rect x="8"  y="20" width="5"  height="16" fill="#00CC99"/>
    {/* wings */}
    <rect x="2"  y="10" width="16" height="20" fill="#00AA77"/>
    <rect x="2"  y="8"  width="14" height="8"  fill="#00CC99"/>
    <rect x="4"  y="6"  width="10" height="6"  fill="#44DDAA"/>
    <rect x="30" y="10" width="16" height="20" fill="#00AA77"/>
    <rect x="34" y="8"  width="14" height="8"  fill="#00CC99"/>
    <rect x="36" y="6"  width="10" height="6"  fill="#44DDAA"/>
    {/* wing wave marks */}
    <rect x="4"  y="14" width="12" height="2"  fill="#88FFCC" opacity="0.5"/>
    <rect x="4"  y="20" width="12" height="2"  fill="#88FFCC" opacity="0.5"/>
    <rect x="32" y="14" width="12" height="2"  fill="#88FFCC" opacity="0.5"/>
    <rect x="32" y="20" width="12" height="2"  fill="#88FFCC" opacity="0.5"/>
    {/* body */}
    <rect x="14" y="16" width="20" height="22" fill="#00BB88"/>
    <rect x="12" y="18" width="24" height="18" fill="#00CC99"/>
    {/* chest wave pattern */}
    <rect x="16" y="20" width="16" height="12" fill="#44DDAA"/>
    <rect x="18" y="22" width="12" height="8"  fill="#88FFCC"/>
    <rect x="16" y="23" width="16" height="1"  fill="#00AA77"/>
    <rect x="16" y="26" width="16" height="1"  fill="#00AA77"/>
    <rect x="16" y="29" width="16" height="1"  fill="#00AA77"/>
    {/* round head */}
    <rect x="14" y="4"  width="22" height="14" fill="#00CC99"/>
    <rect x="12" y="6"  width="26" height="12" fill="#00DDAA"/>
    {/* crest feathers (right-side) */}
    <rect x="26" y="0"  width="5"  height="8"  fill="#00BB88"/>
    <rect x="32" y="0"  width="5"  height="6"  fill="#00CC99"/>
    <rect x="28" y="0"  width="3"  height="5"  fill="#88FFCC"/>
    {/* big cute right-facing eyes */}
    <rect x="22" y="7"  width="10" height="9"  fill="#fff"/>
    <rect x="32" y="8"  width="8"  height="8"  fill="#fff"/>
    <rect x="24" y="8"  width="7"  height="7"  fill="#003322"/>
    <rect x="33" y="9"  width="5"  height="6"  fill="#003322"/>
    <rect x="26" y="10" width="3"  height="3"  fill="#00FFAA"/>
    <rect x="34" y="10" width="2"  height="3"  fill="#00FFAA"/>
    <rect x="24" y="8"  width="2"  height="2"  fill="#fff" opacity="0.9"/>
    <rect x="33" y="9"  width="1"  height="1"  fill="#fff" opacity="0.9"/>
    {/* beak (right) */}
    <rect x="36" y="12" width="9"  height="5"  fill="#FFCC00"/>
    <rect x="38" y="10" width="6"  height="4"  fill="#FFAA00"/>
    {/* talons */}
    <rect x="14" y="36" width="8"  height="8"  fill="#009977"/>
    <rect x="26" y="36" width="8"  height="8"  fill="#009977"/>
    <rect x="12" y="42" width="6"  height="4"  fill="#007755"/>
    <rect x="30" y="42" width="6"  height="4"  fill="#007755"/>
  </svg>
);

// VOXMAJOR – majestic resonance titan, huge presence (faces right)
const VoxmajorSprite = ({ w=96, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 6px 20px #00FFAA88)"}}>
    {/* outer sound rings (right) */}
    <rect x="42" y="14" width="5"  height="22" fill="#00CC99" opacity="0.3"/>
    {/* massive wings */}
    <rect x="0"  y="6"  width="16" height="30" fill="#00AA77"/>
    <rect x="0"  y="4"  width="14" height="10" fill="#00CC99"/>
    <rect x="2"  y="2"  width="10" height="6"  fill="#44DDAA"/>
    <rect x="30" y="6"  width="16" height="30" fill="#00AA77"/>
    <rect x="34" y="4"  width="14" height="10" fill="#00CC99"/>
    <rect x="36" y="2"  width="10" height="6"  fill="#44DDAA"/>
    {/* wing glyphs */}
    <rect x="2"  y="12" width="12" height="2"  fill="#88FFCC" opacity="0.6"/>
    <rect x="2"  y="18" width="12" height="2"  fill="#88FFCC" opacity="0.6"/>
    <rect x="2"  y="24" width="12" height="2"  fill="#88FFCC" opacity="0.6"/>
    <rect x="34" y="12" width="12" height="2"  fill="#88FFCC" opacity="0.6"/>
    <rect x="34" y="18" width="12" height="2"  fill="#88FFCC" opacity="0.6"/>
    <rect x="34" y="24" width="12" height="2"  fill="#88FFCC" opacity="0.6"/>
    {/* body */}
    <rect x="10" y="16" width="28" height="28" fill="#00BB88"/>
    <rect x="8"  y="18" width="32" height="24" fill="#00CC99"/>
    {/* resonance crystal chest */}
    <rect x="14" y="20" width="18" height="16" fill="#44DDAA"/>
    <rect x="16" y="22" width="14" height="12" fill="#88FFCC"/>
    <rect x="18" y="24" width="10" height="8"  fill="#CCFFEE"/>
    <rect x="20" y="26" width="6"  height="4"  fill="#fff" opacity="0.7"/>
    {/* sound waves from chest */}
    <rect x="12" y="26" width="4"  height="2"  fill="#00FFAA" opacity="0.5"/>
    <rect x="32" y="26" width="4"  height="2"  fill="#00FFAA" opacity="0.5"/>
    {/* big round head */}
    <rect x="10" y="2"  width="28" height="16" fill="#00CC99"/>
    <rect x="8"  y="4"  width="32" height="14" fill="#00DDAA"/>
    {/* crown spikes */}
    <rect x="12" y="0"  width="5"  height="6"  fill="#00BB88"/>
    <rect x="20" y="0"  width="8"  height="8"  fill="#00DDAA"/>
    <rect x="30" y="0"  width="5"  height="6"  fill="#00BB88"/>
    <rect x="22" y="0"  width="4"  height="4"  fill="#88FFCC"/>
    {/* giant right-facing eyes */}
    <rect x="20" y="6"  width="12" height="10" fill="#fff"/>
    <rect x="32" y="7"  width="8"  height="9"  fill="#fff"/>
    <rect x="22" y="7"  width="9"  height="8"  fill="#003322"/>
    <rect x="33" y="8"  width="5"  height="7"  fill="#003322"/>
    <rect x="24" y="9"  width="4"  height="4"  fill="#00FFAA"/>
    <rect x="34" y="10" width="2"  height="3"  fill="#00FFAA"/>
    <rect x="22" y="7"  width="3"  height="3"  fill="#fff" opacity="0.9"/>
    <rect x="33" y="8"  width="2"  height="2"  fill="#fff" opacity="0.9"/>
    {/* big beak (right) */}
    <rect x="36" y="12" width="10" height="6"  fill="#FFCC00"/>
    <rect x="38" y="10" width="7"  height="5"  fill="#FFAA00"/>
    {/* legs */}
    <rect x="12" y="42" width="10" height="5"  fill="#009977"/>
    <rect x="26" y="42" width="10" height="5"  fill="#009977"/>
    <rect x="10" y="45" width="8"  height="3"  fill="#007755"/>
    <rect x="28" y="45" width="8"  height="3"  fill="#007755"/>
  </svg>
);

// ── HIDDEN MONSTER ─────────────────────────────────────
// LEXIVORE – tri-element ancient, faces right, 3 eyes, majestic
const LexivoreSprite = ({ w=96, flipped=false, fainted=false, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      transform:flipped?"scaleX(-1)":"none",
      opacity:fainted?0.3:1,
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 8px 24px rgba(180,80,255,0.8))"}}>
    {/* INK wing (left) */}
    <rect x="0"  y="8"  width="14" height="22" fill="#2233CC"/>
    <rect x="2"  y="6"  width="12" height="6"  fill="#4455EE"/>
    <rect x="4"  y="4"  width="8"  height="4"  fill="#8899FF"/>
    <rect x="2"  y="12" width="10" height="2"  fill="#AABBFF" opacity="0.5"/>
    <rect x="2"  y="18" width="10" height="2"  fill="#AABBFF" opacity="0.5"/>
    {/* ECHO wing (right) */}
    <rect x="34" y="8"  width="14" height="22" fill="#00BB88"/>
    <rect x="34" y="6"  width="12" height="6"  fill="#00DDAA"/>
    <rect x="36" y="4"  width="8"  height="4"  fill="#88FFCC"/>
    <rect x="36" y="12" width="10" height="2"  fill="#CCFFEE" opacity="0.5"/>
    <rect x="36" y="18" width="10" height="2"  fill="#CCFFEE" opacity="0.5"/>
    {/* RUNE shoulder pads */}
    <rect x="8"  y="18" width="10" height="8"  fill="#AA9988"/>
    <rect x="30" y="18" width="10" height="8"  fill="#AA9988"/>
    <rect x="9"  y="20" width="8"  height="2"  fill="#FF9900" opacity="0.7"/>
    <rect x="31" y="20" width="8"  height="2"  fill="#FF9900" opacity="0.7"/>
    {/* body */}
    <rect x="10" y="16" width="28" height="28" fill="#330066"/>
    <rect x="8"  y="18" width="32" height="24" fill="#440088"/>
    {/* tri-element core */}
    <rect x="14" y="22" width="20" height="14" fill="#5500AA"/>
    <rect x="16" y="24" width="16" height="10" fill="#7722CC"/>
    {/* INK section */}
    <rect x="16" y="24" width="5"  height="10" fill="#2233CC" opacity="0.8"/>
    <rect x="17" y="26" width="3"  height="3"  fill="#AABBFF" opacity="0.7"/>
    {/* RUNE section */}
    <rect x="21" y="24" width="6"  height="10" fill="#AA9988" opacity="0.8"/>
    <rect x="22" y="27" width="4"  height="3"  fill="#FF9900" opacity="0.8"/>
    {/* ECHO section */}
    <rect x="27" y="24" width="5"  height="10" fill="#00BB88" opacity="0.8"/>
    <rect x="28" y="29" width="3"  height="3"  fill="#88FFCC" opacity="0.8"/>
    {/* big round head */}
    <rect x="10" y="2"  width="28" height="16" fill="#330066"/>
    <rect x="8"  y="4"  width="32" height="14" fill="#440088"/>
    {/* tri-crown */}
    <rect x="10" y="0"  width="5"  height="6"  fill="#2233CC"/>
    <rect x="21" y="0"  width="6"  height="8"  fill="#FFAA00"/>
    <rect x="33" y="0"  width="5"  height="6"  fill="#00BB88"/>
    <rect x="12" y="0"  width="3"  height="4"  fill="#8899FF"/>
    <rect x="22" y="0"  width="4"  height="5"  fill="#FFEE44"/>
    <rect x="34" y="0"  width="3"  height="4"  fill="#88FFCC"/>
    {/* THREE adorable big eyes (right-weighted) */}
    <rect x="14" y="6"  width="8"  height="8"  fill="#2233CC"/>
    <rect x="15" y="7"  width="6"  height="6"  fill="#8899FF"/>
    <rect x="16" y="8"  width="3"  height="4"  fill="#fff"/>
    <rect x="16" y="8"  width="2"  height="2"  fill="#AABBFF"/>
    <rect x="22" y="5"  width="9"  height="9"  fill="#FFAA00"/>
    <rect x="23" y="6"  width="7"  height="7"  fill="#FFEE44"/>
    <rect x="25" y="7"  width="3"  height="5"  fill="#fff"/>
    <rect x="25" y="7"  width="2"  height="2"  fill="#FFE880"/>
    <rect x="32" y="6"  width="8"  height="8"  fill="#00BB88"/>
    <rect x="33" y="7"  width="6"  height="6"  fill="#88FFCC"/>
    <rect x="34" y="8"  width="3"  height="4"  fill="#fff"/>
    <rect x="34" y="8"  width="2"  height="2"  fill="#CCFFEE"/>
    {/* mouth with floating letters */}
    <rect x="14" y="14" width="22" height="4"  fill="#220044"/>
    <rect x="16" y="13" width="4"  height="3"  fill="#AABBFF" opacity="0.5"/>
    <rect x="22" y="13" width="4"  height="2"  fill="#FFCC44" opacity="0.5"/>
    <rect x="28" y="13" width="4"  height="3"  fill="#88FFCC" opacity="0.5"/>
    {/* legs */}
    <rect x="12" y="42" width="10" height="5"  fill="#330066"/>
    <rect x="26" y="42" width="10" height="5"  fill="#330066"/>
    <rect x="10" y="45" width="8"  height="3"  fill="#8800FF" opacity="0.5"/>
    <rect x="28" y="45" width="8"  height="3"  fill="#8800FF" opacity="0.5"/>
  </svg>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENEMY MONSTERS — face LEFT naturally (no transform)
//  All pixel-art drawn facing left direction
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// FORGEX – eraser ghost, chubby, evil cute (faces left)
const ForgexSprite = ({ w=80, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 4px 10px #BB224488)"}}>
    {/* eraser body – chubby rectangle */}
    <rect x="6"  y="14" width="36" height="24" fill="#FFDDCC"/>
    <rect x="4"  y="16" width="40" height="20" fill="#FFE8D8"/>
    <rect x="8"  y="12" width="32" height="4"  fill="#FFDDCC"/>
    {/* eraser band */}
    <rect x="4"  y="22" width="40" height="7"  fill="#EE9988"/>
    {/* scuff marks */}
    <rect x="8"  y="16" width="10" height="2"  fill="#EECCBB" opacity="0.7"/>
    <rect x="26" y="18" width="8"  height="2"  fill="#EECCBB" opacity="0.6"/>
    {/* LEFT-facing evil eyes */}
    <rect x="6"  y="15" width="12" height="9"  fill="#880000"/>
    <rect x="20" y="15" width="10" height="9"  fill="#880000"/>
    <rect x="7"  y="16" width="10" height="7"  fill="#CC0000"/>
    <rect x="21" y="16" width="8"  height="7"  fill="#CC0000"/>
    <rect x="8"  y="18" width="4"  height="3"  fill="#1A0000"/>
    <rect x="22" y="18" width="3"  height="3"  fill="#1A0000"/>
    <rect x="8"  y="16" width="2"  height="2"  fill="#FF8888" opacity="0.7"/>
    <rect x="22" y="16" width="2"  height="2"  fill="#FF8888" opacity="0.7"/>
    {/* angry brows */}
    <rect x="6"  y="14" width="13" height="2"  fill="#661100"/>
    <rect x="20" y="14" width="11" height="2"  fill="#661100"/>
    {/* eraser crumb mouth */}
    <rect x="10" y="31" width="22" height="4"  fill="#EECCBB"/>
    <rect x="12" y="30" width="5"  height="3"  fill="#FFDDCC"/>
    <rect x="22" y="30" width="5"  height="3"  fill="#FFDDCC"/>
    {/* eraser crumb legs */}
    <rect x="8"  y="37" width="10" height="7"  fill="#FFDDCC"/>
    <rect x="28" y="37" width="10" height="7"  fill="#FFDDCC"/>
    <rect x="6"  y="42" width="8"  height="4"  fill="#EECCBB"/>
    <rect x="30" y="42" width="8"  height="4"  fill="#EECCBB"/>
    {/* little arms */}
    <rect x="0"  y="26" width="5"  height="6"  fill="#FFDDCC"/>
    <rect x="43" y="26" width="5"  height="6"  fill="#FFDDCC"/>
  </svg>
);

// BLANKUS – empty page ghost, hollow eyes, unsettling cute (faces left)
const BlankusSprite = ({ w=80, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 4px 10px #88888866)"}}>
    {/* page body */}
    <rect x="8"  y="6"  width="32" height="38" fill="#F4F2EC"/>
    <rect x="6"  y="8"  width="36" height="34" fill="#F4F2EC"/>
    <rect x="10" y="4"  width="28" height="4"  fill="#E8E6E0"/>
    {/* folded corner top-left */}
    <rect x="6"  y="8"  width="8"  height="8"  fill="#E0DED8"/>
    <rect x="6"  y="8"  width="4"  height="4"  fill="#D8D4CC"/>
    {/* page lines (empty = eerie) */}
    <rect x="12" y="28" width="24" height="2"  fill="#E4E0D8"/>
    <rect x="12" y="32" width="24" height="2"  fill="#E4E0D8"/>
    <rect x="12" y="36" width="18" height="2"  fill="#E4E0D8"/>
    {/* LEFT-facing hollow eyes */}
    <rect x="8"  y="12" width="10" height="9"  fill="#222"/>
    <rect x="20" y="12" width="9"  height="9"  fill="#222"/>
    <rect x="9"  y="13" width="8"  height="7"  fill="#000"/>
    <rect x="21" y="13" width="7"  height="7"  fill="#000"/>
    {/* ghostly iris */}
    <rect x="10" y="15" width="3"  height="3"  fill="#BBBBDD" opacity="0.5"/>
    <rect x="22" y="15" width="3"  height="3"  fill="#BBBBDD" opacity="0.5"/>
    {/* unsettling smile */}
    <rect x="12" y="24" width="18" height="3"  fill="#E4E0D8"/>
    <rect x="10" y="25" width="5"  height="2"  fill="#D8D4CC"/>
    <rect x="26" y="25" width="5"  height="2"  fill="#D8D4CC"/>
    {/* ghost wisps */}
    <rect x="2"  y="16" width="5"  height="12" fill="#F4F2EC" opacity="0.7"/>
    <rect x="42" y="20" width="4"  height="10" fill="#F4F2EC" opacity="0.6"/>
    {/* paper feet */}
    <rect x="12" y="42" width="10" height="5"  fill="#EAE8E2"/>
    <rect x="26" y="42" width="10" height="5"  fill="#EAE8E2"/>
  </svg>
);

// CONFUZOR – chaotic letter beast, swirly eyes, chunky (faces left)
const ConfuzorSprite = ({ w=80, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 4px 10px #CC660044)"}}>
    {/* chaotic body */}
    <rect x="6"  y="12" width="36" height="30" fill="#AA5522"/>
    <rect x="4"  y="14" width="40" height="26" fill="#CC6633"/>
    <rect x="8"  y="10" width="32" height="4"  fill="#AA5522"/>
    {/* scrambled letters */}
    <rect x="8"  y="18" width="5"  height="7"  fill="#FFBB44" opacity="0.7"/>
    <rect x="16" y="16" width="7"  height="5"  fill="#FFCC66" opacity="0.6"/>
    <rect x="28" y="18" width="5"  height="7"  fill="#FFBB44" opacity="0.7"/>
    <rect x="10" y="27" width="7"  height="5"  fill="#FFCC66" opacity="0.6"/>
    <rect x="26" y="25" width="7"  height="5"  fill="#FFBB44" opacity="0.6"/>
    <rect x="18" y="30" width="5"  height="5"  fill="#FFAA44" opacity="0.5"/>
    {/* LEFT-facing swirly eyes */}
    <rect x="6"  y="13" width="12" height="10" fill="#FF7700"/>
    <rect x="20" y="13" width="10" height="10" fill="#FF7700"/>
    <rect x="7"  y="14" width="10" height="8"  fill="#FF9900"/>
    <rect x="21" y="14" width="8"  height="8"  fill="#FF9900"/>
    <rect x="8"  y="16" width="4"  height="4"  fill="#1A0500"/>
    <rect x="22" y="16" width="3"  height="4"  fill="#1A0500"/>
    <rect x="8"  y="14" width="2"  height="2"  fill="#FFDDAA" opacity="0.8"/>
    <rect x="22" y="14" width="2"  height="2"  fill="#FFDDAA" opacity="0.8"/>
    {/* jumbled mouth */}
    <rect x="8"  y="30" width="28" height="5"  fill="#882200"/>
    <rect x="10" y="29" width="5"  height="3"  fill="#FFBB44" opacity="0.5"/>
    <rect x="18" y="29" width="5"  height="3"  fill="#FFCC66" opacity="0.5"/>
    <rect x="26" y="29" width="5"  height="3"  fill="#FFBB44" opacity="0.5"/>
    {/* tentacle legs */}
    <rect x="8"  y="40" width="8"  height="8"  fill="#AA5522"/>
    <rect x="18" y="42" width="6"  height="6"  fill="#CC6633"/>
    <rect x="28" y="40" width="8"  height="8"  fill="#AA5522"/>
    {/* little arms */}
    <rect x="0"  y="20" width="5"  height="8"  fill="#AA5522"/>
    <rect x="43" y="20" width="5"  height="8"  fill="#AA5522"/>
  </svg>
);

// NULLVOID – void king, dark and majestic, three eyes (faces left)
const NullvoidSprite = ({ w=88, hurt=false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48"
    style={{imageRendering:"pixelated",
      filter:hurt?"brightness(8) saturate(0)":"drop-shadow(0 8px 20px #33006699)"}}>
    {/* void aura */}
    <rect x="0"  y="10" width="6"  height="28" fill="#110033" opacity="0.5"/>
    <rect x="42" y="10" width="6"  height="28" fill="#110033" opacity="0.5"/>
    {/* dark cloak */}
    <rect x="4"  y="18" width="40" height="28" fill="#110033"/>
    <rect x="2"  y="20" width="44" height="24" fill="#1A0044"/>
    <rect x="0"  y="26" width="8"  height="18" fill="#110033"/>
    <rect x="40" y="26" width="8"  height="18" fill="#110033"/>
    {/* void tears */}
    <rect x="10" y="26" width="6"  height="10" fill="#220066" opacity="0.7"/>
    <rect x="28" y="28" width="6"  height="8"  fill="#220066" opacity="0.7"/>
    <rect x="20" y="32" width="5"  height="7"  fill="#330077" opacity="0.6"/>
    {/* body */}
    <rect x="8"  y="10" width="32" height="12" fill="#1A0044"/>
    <rect x="6"  y="12" width="36" height="10" fill="#220055"/>
    {/* absorbed letters */}
    <rect x="10" y="24" width="4"  height="4"  fill="#4455FF" opacity="0.4"/>
    <rect x="20" y="26" width="4"  height="4"  fill="#00AA88" opacity="0.4"/>
    <rect x="30" y="22" width="4"  height="4"  fill="#FF9900" opacity="0.4"/>
    <rect x="14" y="32" width="4"  height="4"  fill="#CC66FF" opacity="0.4"/>
    {/* big round head */}
    <rect x="8"  y="0"  width="32" height="14" fill="#1A0044"/>
    <rect x="6"  y="2"  width="36" height="12" fill="#220055"/>
    {/* void crown */}
    <rect x="6"  y="0"  width="5"  height="6"  fill="#5500AA"/>
    <rect x="14" y="0"  width="5"  height="4"  fill="#7722CC"/>
    <rect x="20" y="0"  width="8"  height="8"  fill="#9944FF"/>
    <rect x="30" y="0"  width="5"  height="4"  fill="#7722CC"/>
    <rect x="36" y="0"  width="6"  height="6"  fill="#5500AA"/>
    <rect x="22" y="0"  width="4"  height="4"  fill="#DDAAFF"/>
    {/* LEFT-facing THREE big eyes */}
    <rect x="6"  y="4"  width="10" height="8"  fill="#5500AA"/>
    <rect x="7"  y="5"  width="8"  height="6"  fill="#8833CC"/>
    <rect x="8"  y="6"  width="4"  height="4"  fill="#CC88FF"/>
    <rect x="8"  y="5"  width="2"  height="2"  fill="#fff" opacity="0.7"/>
    <rect x="18" y="3"  width="10" height="9"  fill="#7700CC"/>
    <rect x="19" y="4"  width="8"  height="7"  fill="#AA44EE"/>
    <rect x="21" y="5"  width="4"  height="5"  fill="#fff"/>
    <rect x="22" y="5"  width="2"  height="2"  fill="#DDAAFF"/>
    <rect x="30" y="4"  width="10" height="8"  fill="#5500AA"/>
    <rect x="31" y="5"  width="8"  height="6"  fill="#8833CC"/>
    <rect x="32" y="6"  width="4"  height="4"  fill="#CC88FF"/>
    <rect x="32" y="5"  width="2"  height="2"  fill="#fff" opacity="0.7"/>
    {/* consuming mouth */}
    <rect x="8"  y="11" width="28" height="5"  fill="#000000"/>
    <rect x="10" y="10" width="5"  height="3"  fill="#330066" opacity="0.7"/>
    <rect x="20" y="10" width="5"  height="3"  fill="#330066" opacity="0.7"/>
    <rect x="30" y="10" width="5"  height="3"  fill="#330066" opacity="0.7"/>
    {/* ghost tendrils */}
    <rect x="10" y="44" width="8"  height="4"  fill="#1A0044"/>
    <rect x="22" y="46" width="6"  height="2"  fill="#220055"/>
    <rect x="30" y="44" width="8"  height="4"  fill="#1A0044"/>
  </svg>
);
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVOLUTION DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const EVO_LINES = [
  {
    lineId: "ink",
    stages: [
      { id:"inklet",  name:"INKLET",   Sprite:InkletSprite,  type:"INK",  typeClr:"#4466FF", color:"#2244DD", glow:"#4466FF",
        hp:90,  atk:14, def:8,  evoLv:16, desc:"Tiny ink spirit.\nLearns fast, grows quick." },
      { id:"quillon",  name:"QUILLON",  Sprite:QuillonSprite,  type:"INK",  typeClr:"#5577FF", color:"#3355EE", glow:"#5577FF",
        hp:115, atk:20, def:14, evoLv:36, desc:"Ink knight. Slices through\nconfusion with its quill." },
      { id:"scriptar", name:"SCRIPTAR", Sprite:ScriptarSprite, type:"INK",  typeClr:"#6688FF", color:"#4466EE", glow:"#8899FF",
        hp:145, atk:28, def:18, evoLv:null, desc:"Ancient scroll archmage.\nMaster of all written words." },
    ]
  },
  {
    lineId: "rune",
    stages: [
      { id:"runix",    name:"RUNIX",    Sprite:RunixSprite,    type:"RUNE", typeClr:"#FFAA00", color:"#CC8800", glow:"#FFAA00",
        hp:105, atk:12, def:14, evoLv:16, desc:"Stone rune fragment.\nRough around the edges." },
      { id:"glyphon",  name:"GLYPHON",  Sprite:GlyphonSprite,  type:"RUNE", typeClr:"#FFBB22", color:"#DD9900", glow:"#FFBB22",
        hp:130, atk:18, def:20, evoLv:36, desc:"Rune golem warrior.\nUnbreakable defense." },
      { id:"runekai",  name:"RUNEKAI",  Sprite:RunekaiSprite,  type:"RUNE", typeClr:"#FFCC44", color:"#EE9900", glow:"#FFCC44",
        hp:160, atk:24, def:26, evoLv:null, desc:"Dragon sage of ancient runes.\nWisdom made flesh." },
    ]
  },
  {
    lineId: "echo",
    stages: [
      { id:"echobit",  name:"ECHOBIT",  Sprite:EchobitSprite,  type:"ECHO", typeClr:"#00CC88", color:"#009966", glow:"#00CC88",
        hp:85,  atk:16, def:10, evoLv:16, desc:"Sound wave creature.\nHigh speed, sharp ears." },
      { id:"sonarix",  name:"SONARIX",  Sprite:SonarixSprite,  type:"ECHO", typeClr:"#00DDAA", color:"#00BB88", glow:"#00DDAA",
        hp:110, atk:24, def:14, evoLv:36, desc:"Resonance phoenix.\nAttacks with pure sound." },
      { id:"voxmajor", name:"VOXMAJOR", Sprite:VoxmajorSprite, type:"ECHO", typeClr:"#44FFCC", color:"#00CCAA", glow:"#44FFCC",
        hp:140, atk:32, def:18, evoLv:null, desc:"Titan of resonance.\nVoice that shakes the world." },
    ]
  },
];

const HIDDEN_MON = {
  id:"lexivore", name:"LEXIVORE", Sprite:LexivoreSprite, type:"VOID", typeClr:"#BB66FF",
  color:"#9944EE", glow:"#BB66FF", hp:180, atk:35, def:22, evoLv:null,
  desc:"Devourer of forgotten words.\nUnlocked at ★30. Truly legendary.",
  unlockStars: 30,
};

const ENEMIES = [
  { id:"forgex",   name:"FORGEX",   Sprite:ForgexSprite,   type:"ERASE", typeClr:"#CC4444", color:"#FF4444", hp:70,  atk:8,  def:4,  bgKey:"plains" },
  { id:"blankus",  name:"BLANKUS",  Sprite:BlankusSprite,  type:"BLANK", typeClr:"#888888", color:"#AAAAAA", hp:95,  atk:11, def:7,  bgKey:"library"},
  { id:"confuzor", name:"CONFUZOR", Sprite:ConfuzorSprite, type:"CHAOS", typeClr:"#CC7700", color:"#FF9900", hp:125, atk:15, def:10, bgKey:"cave"   },
  { id:"nullvoid", name:"NULLVOID", Sprite:NullvoidSprite, type:"VOID",  typeClr:"#7700CC", color:"#9944FF", hp:160, atk:18, def:12, bgKey:"void"   },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UNIT + WORD DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BOOK SERIES + WORD DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BOOK_SERIES = [
  // ── Wonderful World ──────────────────────────────────
  { id:"wwp1", title:"Wonderful World Prime", subtitle:"Prime Lv.1", color:"#FFD700", emoji:"⭐", units:12, group:"ww" },
  { id:"wwp2", title:"Wonderful World Prime", subtitle:"Prime Lv.2", color:"#FFC000", emoji:"⭐", units:12, group:"ww" },
  { id:"wwp3", title:"Wonderful World Prime", subtitle:"Prime Lv.3", color:"#FFB000", emoji:"⭐", units:12, group:"ww" },
  { id:"ww5",  title:"Wonderful World",       subtitle:"Basic Lv.5", color:"#F5C842", emoji:"🌟", units:12, group:"ww" },
  // ── 1000 Basic English Words ─────────────────────────
  { id:"bew2", title:"1000 Basic English Words", subtitle:"Book 2", color:"#44CC77", emoji:"📗", units:12, group:"bew" },
  { id:"bew3", title:"1000 Basic English Words", subtitle:"Book 3", color:"#4488FF", emoji:"📘", units:12, group:"bew" },
  { id:"bew4", title:"1000 Basic English Words", subtitle:"Book 4", color:"#FF8844", emoji:"📙", units:12, group:"bew" },
  // ── 2000 Core English Words ──────────────────────────
  { id:"cew1", title:"2000 Core English Words", subtitle:"Book 1", color:"#22DDAA", emoji:"📒", units:16, group:"cew" },
  { id:"cew2", title:"2000 Core English Words", subtitle:"Book 2", color:"#11CCBB", emoji:"📒", units:16, group:"cew" },
  { id:"cew3", title:"2000 Core English Words", subtitle:"Book 3", color:"#00BBCC", emoji:"📒", units:16, group:"cew" },
  { id:"cew4", title:"2000 Core English Words", subtitle:"Book 4", color:"#0099CC", emoji:"📒", units:16, group:"cew" },
  // ── 4000 Essential English Words ─────────────────────
  { id:"eew1", title:"4000 Essential English Words", subtitle:"Book 1", color:"#FF6644", emoji:"📕", units:30, group:"eew" },
  { id:"eew2", title:"4000 Essential English Words", subtitle:"Book 2", color:"#FF4466", emoji:"📕", units:30, group:"eew" },
  { id:"eew3", title:"4000 Essential English Words", subtitle:"Book 3", color:"#EE2255", emoji:"📕", units:30, group:"eew" },
  { id:"eew4", title:"4000 Essential English Words", subtitle:"Book 4", color:"#CC1144", emoji:"📕", units:30, group:"eew" },
  { id:"eew5", title:"4000 Essential English Words", subtitle:"Book 5", color:"#BB0033", emoji:"📕", units:30, group:"eew" },
  { id:"eew6", title:"4000 Essential English Words", subtitle:"Book 6", color:"#990022", emoji:"📕", units:30, group:"eew" },
];

const UNIT_EMOJIS = ['🔥','💧','🌿','⚡','🌙','🌊','🏔️','🌸','🎯','💎','🌈','⭐'];

function getUnitInfo(bookId, unitNum) {
  const book = BOOK_SERIES.find(b=>b.id===bookId);
  return { id:unitNum, name:`Unit ${unitNum}`, short:`Unit ${unitNum}`,
    emoji: UNIT_EMOJIS[(unitNum-1)%12], color: book?.color||'#F5C842' };
}

// Wonderful World Basic Lv.5 — original 87 words
const WW5_WORDS = [
  {w:"sky",m:"\ud558\ub298",def:"the space over the Earth",unit:1,opts:["sky", "wind", "cloud", "moon"]},
  {w:"wind",m:"\ubc14\ub78c",def:"a natural movement of air outside",unit:1,opts:["sky", "wind", "bright", "watch"]},
  {w:"cloud",m:"\uad6c\ub984",def:"a white or gray mass in the sky made of tiny water drops",unit:1,opts:["moon", "cloud", "wind", "sky"]},
  {w:"moon",m:"\ub2ec",def:"the round object moving around Earth, seen at night",unit:1,opts:["moon", "cloud", "east", "west"]},
  {w:"bright",m:"\ubc1d\uc740",def:"having very light and strong colors",unit:1,opts:["bright", "watch", "east", "west"]},
  {w:"watch",m:"\ubcf4\ub2e4",def:"to look at someone or something for a period of time",unit:1,opts:["sky", "watch", "bright", "wind"]},
  {w:"east",m:"\ub3d9\ucabd",def:"the direction where the sun rises",unit:1,opts:["east", "west", "cloud", "moon"]},
  {w:"west",m:"\uc11c\ucabd",def:"the direction where the sun sets",unit:1,opts:["east", "west", "bright", "sky"]},
  {w:"ride",m:"\ud0c0\ub2e4",def:"to sit on and control the movements of",unit:2,opts:["ride", "school", "vacation", "cold"]},
  {w:"school",m:"\ud559\uad50",def:"a place where children go to learn",unit:2,opts:["school", "vacation", "month", "start"]},
  {w:"vacation",m:"\ubc29\ud559",def:"a time when schools and universities are closed",unit:2,opts:["ride", "vacation", "cold", "January"]},
  {w:"cold",m:"\ucd94\uc6b4",def:"having a very low temperature",unit:2,opts:["cold", "month", "start", "school"]},
  {w:"month",m:"\ub2ec",def:"any one of the 12 parts into which the year is divided",unit:2,opts:["month", "ride", "January", "June"]},
  {w:"start",m:"\uc2dc\uc791\ud558\ub2e4",def:"to begin to happen, to exist, or to be done",unit:2,opts:["start", "cold", "school", "vacation"]},
  {w:"January",m:"1\uc6d4",def:"the first month of the year",unit:2,opts:["January", "June", "month", "start"]},
  {w:"June",m:"6\uc6d4",def:"the sixth month of the year",unit:2,opts:["June", "January", "cold", "ride"]},
  {w:"watch TV",m:"TV\ub97c \uc2dc\uccad\ud558\ub2e4",def:"to look at programs broadcast on television",unit:3,opts:["watch TV", "watch a movie", "study", "think"]},
  {w:"watch a movie",m:"\uc601\ud654\ub97c \ubcf4\ub2e4",def:"to look at a movie on TV or using a computer",unit:3,opts:["watch a movie", "watch TV", "arcade game", "mobile game"]},
  {w:"study",m:"\uacf5\ubd80\ud558\ub2e4",def:"the activity of learning or gaining knowledge",unit:3,opts:["study", "rainy", "think", "watch TV"]},
  {w:"rainy",m:"\ube44\uac00 \uc624\ub294",def:"having a lot of rain",unit:3,opts:["rainy", "study", "think", "arcade game"]},
  {w:"think",m:"\uc0dd\uac01\ud558\ub2e4",def:"to have an opinion about someone or something",unit:3,opts:["think", "rainy", "study", "mobile game"]},
  {w:"arcade game",m:"\uc544\ucf00\uc774\ub4dc \uac8c\uc784",def:"an electronic or coin-operated game",unit:3,opts:["arcade game", "mobile game", "watch TV", "study"]},
  {w:"mobile game",m:"\ubaa8\ubc14\uc77c \uac8c\uc784",def:"a game designed for mobile devices",unit:3,opts:["mobile game", "arcade game", "rainy", "think"]},
  {w:"ski",m:"\uc2a4\ud0a4",def:"a long narrow runner for gliding over snow",unit:4,opts:["ski", "jump", "mountain", "snowboard"]},
  {w:"jump",m:"\ub6f0\ub2e4",def:"to push yourself off the ground into the air",unit:4,opts:["jump", "ski", "snowboard", "helmet"]},
  {w:"mountain",m:"\uc0b0",def:"a large steep hill",unit:4,opts:["mountain", "ski", "snowboard", "stick"]},
  {w:"snowboard",m:"\uc2a4\ub178\ubcf4\ub4dc",def:"a board for gliding on snow",unit:4,opts:["snowboard", "ski", "mountain", "jump"]},
  {w:"play ice hockey",m:"\uc544\uc774\uc2a4 \ud558\ud0a4\ub97c \ud558\ub2e4",def:"to participate in ice hockey",unit:4,opts:["play ice hockey", "ice skate", "jump", "ski"]},
  {w:"ice skate",m:"\uc2a4\ucf00\uc774\ud2b8\ub97c \ud0c0\ub2e4",def:"to skate on ice",unit:4,opts:["ice skate", "play ice hockey", "snowboard", "mountain"]},
  {w:"helmet",m:"\ud5ec\uba67",def:"a strong hard hat that protects the head",unit:4,opts:["helmet", "stick", "jump", "ski"]},
  {w:"stick",m:"\uc2a4\ud2f1",def:"a long thin object used to hit or direct a puck",unit:4,opts:["stick", "helmet", "mountain", "snowboard"]},
  {w:"go camping",m:"\ucea0\ud551 \uac00\ub2e4",def:"to stay in a tent usually for enjoyment",unit:5,opts:["go camping", "tent", "fire", "bring"]},
  {w:"tent",m:"\ud150\ud2b8",def:"a portable shelter used outdoors",unit:5,opts:["tent", "go camping", "sleeping bag", "flashlight"]},
  {w:"fire",m:"\ubd88",def:"the light, heat, and flame produced by burning",unit:5,opts:["fire", "bring", "sea", "forest"]},
  {w:"bring",m:"\uac00\uc838\uc624\ub2e4",def:"to come with something or someone to a place",unit:5,opts:["bring", "fire", "tent", "flashlight"]},
  {w:"flashlight",m:"\uc190\uc804\ub4f1",def:"a small electric light carried in your hand",unit:5,opts:["flashlight", "sleeping bag", "bring", "go camping"]},
  {w:"sleeping bag",m:"\uce68\ub0ad",def:"a warm long bag used for sleeping outdoors",unit:5,opts:["sleeping bag", "flashlight", "tent", "fire"]},
  {w:"sea",m:"\ubc14\ub2e4",def:"the salt water that covers much of the Earth's surface",unit:5,opts:["sea", "forest", "fire", "bring"]},
  {w:"forest",m:"\uc232",def:"a thick growth of trees covering a large area",unit:5,opts:["forest", "sea", "go camping", "tent"]},
  {w:"go hiking",m:"\ud558\uc774\ud0b9\ud558\ub7ec \uac00\ub2e4",def:"to walk a long distance for pleasure",unit:6,opts:["go hiking", "beach", "have a picnic", "ride a bike"]},
  {w:"beach",m:"\ud574\ubcc0",def:"an area of sand next to an ocean",unit:6,opts:["beach", "backyard", "go hiking", "forest"]},
  {w:"have a picnic",m:"\uc18c\ud48d \uac00\ub2e4",def:"to take food and eat it outdoors",unit:6,opts:["have a picnic", "go hiking", "ride a bike", "backyard"]},
  {w:"backyard",m:"\ub4b7\ub9c8\ub2f9",def:"an area in back of a house",unit:6,opts:["backyard", "beach", "inside", "outside"]},
  {w:"ride a bike",m:"\uc790\uc804\uac70\ub97c \ud0c0\ub2e4",def:"to sit on a bike and travel along on it",unit:6,opts:["ride a bike", "go hiking", "have a picnic", "beach"]},
  {w:"inside",m:"\uc548\uc5d0",def:"in or into the inner part of a building",unit:6,opts:["inside", "outside", "backyard", "beach"]},
  {w:"outside",m:"\ubc16\uc5d0",def:"in or near a building, not inside it",unit:6,opts:["outside", "inside", "forest", "beach"]},
  {w:"job",m:"\uc9c1\uc5c5",def:"the work a person does regularly to earn money",unit:7,opts:["job", "photographer", "chef", "doctor"]},
  {w:"photographer",m:"\uc0ac\uc9c4\uc791\uac00",def:"a person who takes photographs as a job",unit:7,opts:["photographer", "chef", "deliveryman", "scientist"]},
  {w:"chef",m:"\uc694\ub9ac\uc0ac",def:"a person who prepares food for people to eat",unit:7,opts:["chef", "doctor", "photographer", "scientist"]},
  {w:"doctor",m:"\uc758\uc0ac",def:"a person skilled in the science of medicine",unit:7,opts:["doctor", "chef", "deliveryman", "job"]},
  {w:"deliveryman",m:"\ubc30\ub2ec\uc6d0",def:"a man who delivers goods to customers",unit:7,opts:["deliveryman", "scientist", "photographer", "chef"]},
  {w:"scientist",m:"\uacfc\ud559\uc790",def:"a person who studies one or more natural sciences",unit:7,opts:["scientist", "doctor", "deliveryman", "photographer"]},
  {w:"take pictures",m:"\uc0ac\uc9c4\uc744 \ucc0d\ub2e4",def:"to create images with a camera",unit:7,opts:["take pictures", "help sick people", "job", "chef"]},
  {w:"help sick people",m:"\uc544\ud508 \uc0ac\ub78c\ub4e4\uc744 \ub3d5\ub2e4",def:"to aid sick people",unit:7,opts:["help sick people", "take pictures", "deliveryman", "scientist"]},
  {w:"unusual",m:"\ud2b9\uc774\ud55c",def:"not normal or usual",unit:8,opts:["unusual", "famous", "robot", "money"]},
  {w:"famous",m:"\uc720\uba85\ud55c",def:"known or recognized by very many people",unit:8,opts:["famous", "unusual", "excited", "love"]},
  {w:"robot",m:"\ub85c\ubd07",def:"a machine that looks like a human, controlled by computer",unit:8,opts:["robot", "money", "river", "ocean"]},
  {w:"money",m:"\ub3c8",def:"something used to pay for goods and services",unit:8,opts:["money", "robot", "unusual", "excited"]},
  {w:"excited",m:"\uc2e0\uc774 \ub09c",def:"very enthusiastic and eager about something",unit:8,opts:["excited", "love", "famous", "unusual"]},
  {w:"love",m:"\uc0ac\ub791\ud558\ub2e4",def:"to feel great affection for someone",unit:8,opts:["love", "excited", "money", "robot"]},
  {w:"river",m:"\uac15",def:"a natural flow of water flowing in a channel to the sea",unit:8,opts:["river", "ocean", "unusual", "famous"]},
  {w:"ocean",m:"\ubc14\ub2e4",def:"the salt water covering much of Earth's surface",unit:8,opts:["ocean", "river", "robot", "money"]},
  {w:"pilot",m:"\uc870\uc885\uc0ac",def:"a person who flies an airplane or helicopter",unit:9,opts:["pilot", "astronaut", "nurse", "vet"]},
  {w:"astronaut",m:"\uc6b0\uc8fc \ube44\ud589\uc0ac",def:"a person who travels in a spacecraft into outer space",unit:9,opts:["astronaut", "pilot", "firefighter", "actor"]},
  {w:"nurse",m:"\uac04\ud638\uc0ac",def:"a person who takes care of sick or injured people",unit:9,opts:["nurse", "vet", "doctor", "pilot"]},
  {w:"vet",m:"\uc218\uc758\uc0ac",def:"an animal doctor",unit:9,opts:["vet", "nurse", "pilot", "astronaut"]},
  {w:"actor",m:"\ubc30\uc6b0",def:"a person who acts in a play or movie",unit:9,opts:["actor", "firefighter", "cool", "awesome"]},
  {w:"firefighter",m:"\uc18c\ubc29\uad00",def:"a member of a group that works to put out fires",unit:9,opts:["firefighter", "actor", "nurse", "vet"]},
  {w:"cool",m:"\uba4b\uc9c4",def:"often used to show approval in a general way",unit:9,opts:["cool", "awesome", "actor", "pilot"]},
  {w:"awesome",m:"\ub300\ub2e8\ud55c",def:"used to show that something is very good or great fun",unit:9,opts:["awesome", "cool", "firefighter", "astronaut"]},
  {w:"laptop",m:"\ub178\ud2b8\ubd81",def:"a small computer designed to be easily carried",unit:10,opts:["laptop", "screen", "keyboard", "email"]},
  {w:"screen",m:"\ud654\uba74",def:"the flat part of a TV showing images or text",unit:10,opts:["screen", "laptop", "smartphone", "tablet"]},
  {w:"keyboard",m:"\ud0a4\ubcf4\ub4dc",def:"the set of keys used for a computer or typewriter",unit:10,opts:["keyboard", "screen", "email", "mobile devices"]},
  {w:"email",m:"\uc774\uba54\uc77c",def:"an electronic mail message",unit:10,opts:["email", "laptop", "keyboard", "screen"]},
  {w:"smartphone",m:"\uc2a4\ub9c8\ud2b8\ud3f0",def:"a mobile phone that works as a computer",unit:10,opts:["smartphone", "tablet", "laptop", "email"]},
  {w:"tablet",m:"\ud0dc\ube14\ub9bf",def:"a portable computer with a large touch screen",unit:10,opts:["tablet", "smartphone", "screen", "keyboard"]},
  {w:"mobile devices",m:"\ubaa8\ubc14\uc77c \uae30\uae30",def:"any types of handheld and portable computers",unit:10,opts:["mobile devices", "laptop", "email", "screen"]},
  {w:"busy",m:"\ubc14\uc05c",def:"full of activity or work",unit:11,opts:["busy", "easy", "app", "math"]},
  {w:"easy",m:"\uc26c\uc6b4",def:"not hard to do",unit:11,opts:["easy", "difficult", "busy", "slow"]},
  {w:"app",m:"\uc571",def:"a computer program that performs a special function",unit:11,opts:["app", "math", "teach", "learn"]},
  {w:"math",m:"\uc218\ud559",def:"mathematics, especially as a subject in school",unit:11,opts:["math", "app", "difficult", "easy"]},
  {w:"difficult",m:"\uc5b4\ub824\uc6b4",def:"not easy",unit:11,opts:["difficult", "easy", "slow", "busy"]},
  {w:"slow",m:"\ub290\ub9b0",def:"not moving quickly",unit:11,opts:["slow", "difficult", "busy", "app"]},
  {w:"teach",m:"\uac00\ub974\uce58\ub2e4",def:"to help a person learn how to do something",unit:11,opts:["teach", "learn", "busy", "app"]},
  {w:"learn",m:"\ubc30\uc6b0\ub2e4",def:"to gain knowledge by studying",unit:11,opts:["learn", "teach", "slow", "difficult"]},
  {w:"touch",m:"\ub9cc\uc9c0\ub2e4",def:"to put your hand or fingers on someone or something",unit:12,opts:["touch", "password", "need", "safe"]},
  {w:"password",m:"\ube44\ubc00\ubc88\ud638",def:"a secret code that allows you to use a computer system",unit:12,opts:["password", "touch", "login", "download"]},
  {w:"need",m:"\ud544\uc694\ud558\ub2e4",def:"to require something",unit:12,opts:["need", "safe", "send", "share"]},
  {w:"safe",m:"\uc548\uc804\ud55c",def:"not in danger",unit:12,opts:["safe", "need", "touch", "password"]},
  {w:"send",m:"\ubcf4\ub0b4\ub2e4",def:"to make something go to a place, especially by email",unit:12,opts:["send", "share", "login", "download"]},
  {w:"share",m:"\uacf5\uc720\ud558\ub2e4",def:"to have or use something with others",unit:12,opts:["share", "send", "need", "safe"]},
  {w:"login",m:"\ub85c\uadf8\uc778",def:"an act of logging in to a computer or online account",unit:12,opts:["login", "download", "password", "touch"]},
  {w:"download",m:"\ub2e4\uc6b4\ub85c\ub4dc\ud558\ub2e4",def:"to get data from another computer via the internet",unit:12,opts:["download", "login", "send", "share"]},
];

// 1000 Basic English Words — Books 2, 3, 4
const BEW_WORDS_DB = {
  "bew2_1": [
    {w:"angry",m:"\ud654\ub09c",def:"feeling upset",unit:1,opts:["angry", "photograph (photo)", "group", "wonder"]},
    {w:"boring",m:"\uc9c0\ub8e8\ud55c",def:"not interesting",unit:1,opts:["math", "feel", "group", "boring"]},
    {w:"class",m:"\uc218\uc5c5",def:"a lesson at school",unit:1,opts:["angry", "class", "invite", "photograph (photo)"]},
    {w:"dream",m:"\uafc8\uafb8\ub2e4",def:"to think about a wish for something good",unit:1,opts:["famous", "boring", "hobby", "dream"]},
    {w:"famous",m:"\uc720\uba85\ud55c",def:"known by many people",unit:1,opts:["photograph (photo)", "boring", "class", "famous"]},
    {w:"feel",m:"\ub290\ub07c\ub2e4",def:"to have a sense of something",unit:1,opts:["dream", "feel", "hobby", "math"]},
    {w:"future",m:"\ubbf8\ub798",def:"the time that has not happened yet",unit:1,opts:["president", "famous", "group", "future"]},
    {w:"group",m:"\uadf8\ub8f9",def:"several people that are together",unit:1,opts:["class", "hundred", "boring", "group"]},
    {w:"hobby",m:"\ucde8\ubbf8",def:"something you like to do in your free time",unit:1,opts:["boring", "invite", "voice", "hobby"]},
    {w:"job",m:"\uc9c1\uc5c5",def:"the work that a person is paid to do",unit:1,opts:["future", "job", "travel", "president"]},
    {w:"hundred",m:"\uc22b\uc790 100",def:"the number 100",unit:1,opts:["hundred", "group", "wonder", "dream"]},
    {w:"invite",m:"\ucd08\ub300\ud558\ub2e4",def:"to ask to go somewhere",unit:1,opts:["famous", "speech", "wonder", "invite"]},
    {w:"math",m:"\uc218\ud559",def:"the study of numbers",unit:1,opts:["group", "voice", "math", "photograph (photo)"]},
    {w:"photograph (photo)",m:"\uc0ac\uc9c4",def:"a picture taken with a camera",unit:1,opts:["invite", "photograph (photo)", "job", "math"]},
    {w:"president",m:"\ub300\ud1b5\ub839",def:"the leader of the government or of a company",unit:1,opts:["dream", "really", "hobby", "president"]},
    {w:"really",m:"\uc815\ub9d0",def:"very",unit:1,opts:["travel", "feel", "speech", "really"]},
    {w:"speech",m:"\uc5f0\uc124",def:"a talk that someone gives in front of a group of people",unit:1,opts:["hundred", "dream", "future", "speech"]},
    {w:"travel",m:"\uc5ec\ud589\ud558\ub2e4",def:"to go on a trip, usually far away",unit:1,opts:["travel", "angry", "invite", "hundred"]},
    {w:"voice",m:"\ubaa9\uc18c\ub9ac",def:"the sound a person makes when speaking or singing",unit:1,opts:["math", "voice", "famous", "feel"]},
    {w:"wonder",m:"\uad81\uae08\ud574\ud558\ub2e4",def:"to have interest in knowing or learning something",unit:1,opts:["wonder", "president", "dream", "future"]},
  ],
  "bew2_2": [
    {w:"baseball",m:"\uc57c\uad6c",def:"a game in which players hit a ball with a bat",unit:2,opts:["tie", "earth", "baseball", "hold"]},
    {w:"basketball",m:"\ub18d\uad6c",def:"a game in which players throw a ball through a net",unit:2,opts:["hit", "hill", "basketball", "hospital"]},
    {w:"dangerous",m:"\uc704\ud5d8\ud55c",def:"involving danger or harm",unit:2,opts:["drop", "slow", "dangerous", "take"]},
    {w:"excited",m:"\uc2e0\uc774 \ub09c",def:"feeling happy about something",unit:2,opts:["hurt", "earth", "motorbike", "excited"]},
    {w:"hill",m:"\uc5b8\ub355",def:"land that is higher than the area around it",unit:2,opts:["hill", "dangerous", "take", "round"]},
    {w:"hit",m:"\uce58\ub2e4",def:"to make contact with something quickly",unit:2,opts:["excited", "hit", "hill", "dangerous"]},
    {w:"hospital",m:"\ubcd1\uc6d0",def:"the place people go when they are sick",unit:2,opts:["flag", "slow", "drop", "hospital"]},
    {w:"hurt",m:"\ub2e4\uce58\ub2e4",def:"to harm, wound, or damage",unit:2,opts:["take", "tie", "hurt", "dangerous"]},
    {w:"motorbike",m:"\uc624\ud1a0\ubc14\uc774",def:"a bike that runs on a motor; a motorcycle",unit:2,opts:["motorbike", "hospital", "hill", "take"]},
    {w:"slow",m:"\ub290\ub9b0",def:"not fast",unit:2,opts:["foolish", "excited", "hold", "slow"]},
    {w:"drop",m:"\ub5a8\uc5b4\ub728\ub9ac\ub2e4",def:"to fall or let fall",unit:2,opts:["flag", "drop", "hit", "basketball"]},
    {w:"earth",m:"\ub545",def:"the ground; dirt",unit:2,opts:["flag", "earth", "excited", "drop"]},
    {w:"flag",m:"\uae43\ubc1c",def:"a shape, often with four sides, used as a symbol",unit:2,opts:["flag", "basketball", "earth", "baseball"]},
    {w:"foolish",m:"\uc5b4\ub9ac\uc11d\uc740",def:"lacking wisdom; stupid",unit:2,opts:["hill", "tie", "baseball", "foolish"]},
    {w:"hold",m:"\uc7a1\ub2e4",def:"to use hands to carry something",unit:2,opts:["hold", "drop", "round", "foolish"]},
    {w:"matter",m:"\ubb38\uc81c\uac00 \ub418\ub2e4",def:"to be important",unit:2,opts:["hill", "weather", "matter", "baseball"]},
    {w:"round",m:"\ub465\uadfc",def:"in the shape of a circle or ball",unit:2,opts:["baseball", "excited", "round", "flag"]},
    {w:"take",m:"\ub370\ub9ac\uace0 \uac00\ub2e4",def:"to move a person or thing from one place to another",unit:2,opts:["tie", "take", "round", "hill"]},
    {w:"tie",m:"\ubb34\uc2b9\ubd80",def:"when two teams finish with the same number of points",unit:2,opts:["baseball", "tie", "matter", "slow"]},
    {w:"weather",m:"\ub0a0\uc528",def:"what the air is like at a certain time and place",unit:2,opts:["drop", "weather", "hit", "earth"]},
  ],
  "bew2_3": [
    {w:"art",m:"\ubbf8\uc220\ud488",def:"paintings, drawings, or sculptures",unit:3,opts:["art", "wall", "choose", "rock"]},
    {w:"build",m:"\uc9d3\ub2e4",def:"to make",unit:3,opts:["paint", "build", "wall", "back"]},
    {w:"choose",m:"\uace0\ub974\ub2e4",def:"to decide or make a choice",unit:3,opts:["rock", "choose", "wood", "plant"]},
    {w:"draw",m:"\uadf8\ub9ac\ub2e4",def:"to make a picture using a pen or pencil",unit:3,opts:["draw", "kid", "paint", "plant"]},
    {w:"kid",m:"\uc544\uc774",def:"a child",unit:3,opts:["kid", "build", "picnic", "choose"]},
    {w:"paint",m:"\uadf8\ub9bc \uadf8\ub9ac\ub2e4",def:"to make art with paint",unit:3,opts:["wall", "rock", "kid", "paint"]},
    {w:"picture",m:"\uc0ac\uc9c4, \uadf8\ub9bc",def:"a photograph or other image of a person or thing",unit:3,opts:["art", "back", "picture", "draw"]},
    {w:"plant",m:"\uc2dd\ubb3c",def:"a living thing that grows in the earth",unit:3,opts:["plant", "land", "fix", "pants"]},
    {w:"repeat",m:"\ubc18\ubcf5\ud558\ub2e4",def:"to say again",unit:3,opts:["repeat", "wood", "fix", "school"]},
    {w:"wall",m:"\ubcbd",def:"one of the sides of a room",unit:3,opts:["wall", "back", "picnic", "repeat"]},
    {w:"absent",m:"\uacb0\uc11d\ud55c",def:"not in a place",unit:3,opts:["fix", "paint", "absent", "wood"]},
    {w:"back",m:"\ub4a4\ucabd",def:"the area farthest from the front",unit:3,opts:["picture", "picnic", "rock", "back"]},
    {w:"fix",m:"\uace0\uce58\ub2e4",def:"to repair",unit:3,opts:["fix", "draw", "rock", "kid"]},
    {w:"land",m:"\ub545",def:"earth; ground",unit:3,opts:["draw", "pants", "kid", "land"]},
    {w:"pants",m:"\ubc14\uc9c0",def:"clothes worn on the legs",unit:3,opts:["repeat", "pants", "fix", "land"]},
    {w:"picnic",m:"\uc18c\ud48d",def:"a meal eaten outside on the ground",unit:3,opts:["picture", "picnic", "rock", "absent"]},
    {w:"river",m:"\uac15",def:"a large flow of water moving across land",unit:3,opts:["school", "picture", "river", "plant"]},
    {w:"rock",m:"\ubc14\uc704",def:"a big stone",unit:3,opts:["rock", "fix", "draw", "pants"]},
    {w:"school",m:"\ud559\uad50",def:"a place to go to learn",unit:3,opts:["build", "picture", "choose", "school"]},
    {w:"wood",m:"\ub098\ubb34",def:"material from trees",unit:3,opts:["repeat", "absent", "wood", "kid"]},
  ],
  "bew2_4": [
    {w:"book",m:"\ucc45",def:"sheets of paper held together",unit:4,opts:["noise", "book", "mean", "guess"]},
    {w:"example",m:"\uc608",def:"a sample",unit:4,opts:["noise", "glue", "sound", "example"]},
    {w:"glue",m:"\ud480",def:"something sticky used to make things stay together",unit:4,opts:["mean", "glue", "book", "noise"]},
    {w:"library",m:"\ub3c4\uc11c\uad00",def:"a place where books are kept",unit:4,opts:["example", "difference", "library", "excellent"]},
    {w:"mean",m:"\uc2ec\uc220\uad82\uc740",def:"unkind",unit:4,opts:["mean", "noise", "library", "glue"]},
    {w:"piece",m:"\uc870\uac01",def:"a small part of something larger",unit:4,opts:["piece", "book", "museum", "mean"]},
    {w:"plan",m:"\uacc4\ud68d",def:"a way of doing or making something",unit:4,opts:["tomorrow", "plan", "read", "difficult"]},
    {w:"quiet",m:"\uc870\uc6a9\ud55c",def:"silent; making little sound",unit:4,opts:["piece", "read", "correct", "quiet"]},
    {w:"read",m:"\uc77d\ub2e4",def:"to understand written words",unit:4,opts:["difference", "example", "book", "read"]},
    {w:"sound",m:"\uc18c\ub9ac",def:"something you can hear",unit:4,opts:["sound", "difficult", "tomorrow", "excellent"]},
    {w:"correct",m:"\uc815\ud655\ud55c",def:"right",unit:4,opts:["library", "sound", "correct", "difference"]},
    {w:"difference",m:"\ucc28\uc774",def:"how two things are unlike each other",unit:4,opts:["museum", "difference", "example", "tomorrow"]},
    {w:"difficult",m:"\uc5b4\ub824\uc6b4",def:"not easy",unit:4,opts:["mean", "example", "museum", "difficult"]},
    {w:"excellent",m:"\ud6cc\ub96d\ud55c",def:"very good",unit:4,opts:["excellent", "plan", "difficult", "noise"]},
    {w:"guess",m:"\ucd94\uce21\ud558\ub2e4",def:"to answer when you do not know if it is true",unit:4,opts:["piece", "guess", "museum", "read"]},
    {w:"museum",m:"\ubc15\ubb3c\uad00",def:"a place where items of art, science, or history are kept",unit:4,opts:["library", "noise", "museum", "difficult"]},
    {w:"noise",m:"\uc18c\uc74c",def:"something you can hear, usually loud or unpleasant",unit:4,opts:["mean", "noise", "quiet", "guess"]},
    {w:"relax",m:"\ud734\uc2dd\uc744 \ucde8\ud558\ub2e4",def:"to rest",unit:4,opts:["excellent", "relax", "guess", "example"]},
    {w:"science",m:"\uacfc\ud559",def:"the study of things in the world",unit:4,opts:["tomorrow", "science", "difficult", "book"]},
    {w:"tomorrow",m:"\ub0b4\uc77c",def:"on the day after today",unit:4,opts:["excellent", "mean", "tomorrow", "plan"]},
  ],
  "bew2_5": [
    {w:"close",m:"\uac00\uae4c\uc6b4",def:"near",unit:5,opts:["windy", "deep", "close", "glove"]},
    {w:"grass",m:"\uc794\ub514",def:"a plant that covers the ground",unit:5,opts:["grass", "close", "windy", "soap"]},
    {w:"hat",m:"\ubaa8\uc790",def:"something worn on the head",unit:5,opts:["hat", "toilet", "mountain", "wet"]},
    {w:"lake",m:"\ud638\uc218",def:"a large area of water with land around it",unit:5,opts:["close", "windy", "lake", "smell"]},
    {w:"moon",m:"\ub2ec",def:"the round, white object in the sky at night",unit:5,opts:["house", "smell", "moon", "farm"]},
    {w:"mountain",m:"\uc0b0",def:"a part of land that is higher than a hill",unit:5,opts:["mountain", "deep", "boot", "hat"]},
    {w:"smell",m:"\ub0c4\uc0c8 \ub9e1\ub2e4",def:"to be able to sense an odor with your nose",unit:5,opts:["grass", "wet", "smell", "wide"]},
    {w:"soap",m:"\ube44\ub204",def:"something used with water to clean",unit:5,opts:["soap", "well", "glove", "windy"]},
    {w:"toilet",m:"\ubcc0\uae30",def:"a seat in a bathroom",unit:5,opts:["wide", "lake", "toilet", "mountain"]},
    {w:"wet",m:"\uc816\uc740",def:"covered with water",unit:5,opts:["top", "hat", "wet", "soap"]},
    {w:"boot",m:"\ubd80\uce20",def:"a type of shoe",unit:5,opts:["lake", "boot", "top", "moon"]},
    {w:"deep",m:"\uae4a\uc740",def:"going far below",unit:5,opts:["smell", "deep", "lake", "well"]},
    {w:"farm",m:"\ub18d\uc7a5",def:"land used for growing plants or raising animals for food",unit:5,opts:["lake", "sunny", "farm", "house"]},
    {w:"glove",m:"\uc7a5\uac11",def:"clothing worn on the hands",unit:5,opts:["well", "toilet", "deep", "glove"]},
    {w:"house",m:"\uc9d1",def:"a building where people live",unit:5,opts:["house", "hat", "smell", "windy"]},
    {w:"sunny",m:"\ud654\ucc3d\ud55c",def:"having lots of sun",unit:5,opts:["mountain", "sunny", "boot", "toilet"]},
    {w:"top",m:"\uaf2d\ub300\uae30",def:"the highest point",unit:5,opts:["top", "mountain", "deep", "lake"]},
    {w:"well",m:"\uc6b0\ubb3c",def:"a deep hole with water for drinking",unit:5,opts:["well", "windy", "boot", "hat"]},
    {w:"wide",m:"\ub113\uc740",def:"having a large distance from one side to the other",unit:5,opts:["wide", "toilet", "grass", "house"]},
    {w:"windy",m:"\ubc14\ub78c\uc774 \ubd80\ub294",def:"having a lot of wind",unit:5,opts:["wide", "glove", "windy", "close"]},
  ],
  "bew2_6": [
    {w:"care",m:"\ubcf4\uc0b4\ud53c\ub2e4",def:"to look after",unit:6,opts:["girl", "window", "hungry", "care"]},
    {w:"die",m:"\uc8fd\ub2e4",def:"to stop living",unit:6,opts:["die", "zoo", "window", "feed"]},
    {w:"empty",m:"\ube44\uc5b4 \uc788\ub294",def:"having nothing inside",unit:6,opts:["empty", "hungry", "spoon", "dirty"]},
    {w:"feed",m:"\uba39\uc774\ub97c \uc8fc\ub2e4",def:"to give someone or something food",unit:6,opts:["care", "zoo", "feed", "frog"]},
    {w:"health",m:"\uac74\uac15",def:"the good condition of the body",unit:6,opts:["health", "die", "glass", "fill"]},
    {w:"heart",m:"\uc2ec\uc7a5",def:"the body part that moves blood through the body",unit:6,opts:["fresh", "heart", "die", "care"]},
    {w:"large",m:"\ud070",def:"big in size or amount",unit:6,opts:["remember", "large", "feed", "fresh"]},
    {w:"remember",m:"\uae30\uc5b5\ud558\ub2e4",def:"to have or keep something in mind",unit:6,opts:["remember", "health", "dirty", "glass"]},
    {w:"rule",m:"\uaddc\uce59",def:"something that says what you can or cannot do",unit:6,opts:["window", "die", "rule", "empty"]},
    {w:"zoo",m:"\ub3d9\ubb3c\uc6d0",def:"a place with wild animals for people to look at",unit:6,opts:["glass", "rule", "zoo", "feed"]},
    {w:"dirty",m:"\ub354\ub7ec\uc6b4",def:"not clean",unit:6,opts:["dirty", "large", "zoo", "care"]},
    {w:"fill",m:"\ucc44\uc6b0\ub2e4",def:"to make full of something",unit:6,opts:["spoon", "fresh", "fill", "heart"]},
    {w:"fresh",m:"\uc2e0\uc120\ud55c",def:"recently made or gotten",unit:6,opts:["spoon", "dirty", "fresh", "frog"]},
    {w:"frog",m:"\uac1c\uad6c\ub9ac",def:"a small green animal that lives near water",unit:6,opts:["large", "frog", "thirsty", "health"]},
    {w:"girl",m:"\uc18c\ub140",def:"a kid who is not a boy",unit:6,opts:["fill", "girl", "hungry", "remember"]},
    {w:"glass",m:"\uc720\ub9ac\ucef5",def:"a container used for drinks",unit:6,opts:["rule", "zoo", "glass", "thirsty"]},
    {w:"hungry",m:"\ubc30\uace0\ud508",def:"needing food",unit:6,opts:["care", "large", "hungry", "feed"]},
    {w:"spoon",m:"\uc21f\uac00\ub77d",def:"a tool used for eating",unit:6,opts:["spoon", "large", "fresh", "empty"]},
    {w:"thirsty",m:"\ubaa9\ub9c8\ub978",def:"needing to drink",unit:6,opts:["dirty", "thirsty", "girl", "care"]},
    {w:"window",m:"\ucc3d\ubb38",def:"an opening in a building which lets in light",unit:6,opts:["health", "feed", "window", "fill"]},
  ],
  "bew2_7": [
    {w:"ago",m:"\uc804\uc5d0",def:"before now",unit:7,opts:["trip", "ago", "past", "holiday"]},
    {w:"agree",m:"\ub3d9\uc758\ud558\ub2e4",def:"to think the same thing",unit:7,opts:["lamp", "last", "ball", "agree"]},
    {w:"beach",m:"\ud574\ubcc0",def:"an area next to water that is covered with sand",unit:7,opts:["west", "ship", "beach", "agree"]},
    {w:"cap",m:"\ubaa8\uc790",def:"a hat",unit:7,opts:["lamp", "ship", "cap", "past"]},
    {w:"fat",m:"\ub6b1\ub6b1\ud55c",def:"overweight; not thin",unit:7,opts:["fat", "vacation", "sea", "towel"]},
    {w:"sea",m:"\ubc14\ub2e4",def:"a very large body of water",unit:7,opts:["boat", "sea", "agree", "last"]},
    {w:"throw",m:"\ub358\uc9c0\ub2e4",def:"to push something out of your hands",unit:7,opts:["boat", "fat", "throw", "holiday"]},
    {w:"towel",m:"\uc218\uac74",def:"something used for drying things",unit:7,opts:["towel", "last", "trip", "boat"]},
    {w:"trip",m:"\uc5ec\ud589",def:"a visit to a place",unit:7,opts:["spend", "fat", "vacation", "trip"]},
    {w:"vacation",m:"\ud734\uac00",def:"time away from school or work, usually to travel or relax",unit:7,opts:["agree", "cap", "west", "vacation"]},
    {w:"ball",m:"\uacf5",def:"a round object that you play with",unit:7,opts:["spend", "towel", "ball", "sea"]},
    {w:"basket",m:"\ubc14\uad6c\ub2c8",def:"a container, usually made of wood",unit:7,opts:["holiday", "basket", "west", "ago"]},
    {w:"boat",m:"\ubc30",def:"something that people travel with on water",unit:7,opts:["boat", "fat", "sea", "ball"]},
    {w:"holiday",m:"\ud734\uc77c",def:"a special day",unit:7,opts:["ship", "cap", "holiday", "vacation"]},
    {w:"lamp",m:"\ub7a8\ud504",def:"something that makes light",unit:7,opts:["vacation", "past", "lamp", "ship"]},
    {w:"last",m:"\uacc4\uc18d \ub418\ub2e4",def:"to continue for a certain amount of time",unit:7,opts:["ago", "vacation", "last", "beach"]},
    {w:"past",m:"\uacfc\uac70",def:"the time before now",unit:7,opts:["cap", "basket", "ball", "past"]},
    {w:"ship",m:"\ubc30",def:"a large boat",unit:7,opts:["last", "ship", "boat", "vacation"]},
    {w:"spend",m:"\uc4f0\ub2e4",def:"to use money on something or use time to do something",unit:7,opts:["west", "cap", "vacation", "spend"]},
    {w:"west",m:"\uc11c\ucabd\uc73c\ub85c",def:"in the direction where the sun sets",unit:7,opts:["ago", "fat", "basket", "west"]},
  ],
  "bew2_8": [
    {w:"beef",m:"\uc1e0\uace0\uae30",def:"meat from a cow",unit:8,opts:["live", "month", "beef", "low"]},
    {w:"best",m:"\ucd5c\uace0\uc758",def:"better than the others",unit:8,opts:["best", "name", "size", "phone"]},
    {w:"bread",m:"\ube75",def:"a type of baked food",unit:8,opts:["bread", "store", "free", "dear"]},
    {w:"free",m:"\ubb34\ub8cc\uc758",def:"not needing money to buy",unit:8,opts:["pair", "pick", "free", "beef"]},
    {w:"hurry",m:"\uc11c\ub450\ub974\ub2e4",def:"to move quickly",unit:8,opts:["beef", "hurry", "rich", "store"]},
    {w:"join",m:"\ud568\uaed8 \ud558\ub2e4",def:"to come together",unit:8,opts:["rice", "hurry", "free", "join"]},
    {w:"middle",m:"\uc911\uac04",def:"a point in the center",unit:8,opts:["bag", "dear", "free", "middle"]},
    {w:"pair",m:"\ud55c \uc30d",def:"two things that match",unit:8,opts:["live", "beef", "store", "pair"]},
    {w:"pick",m:"\uace0\ub974\ub2e4",def:"to choose",unit:8,opts:["hurry", "name", "pick", "beef"]},
    {w:"store",m:"\uc0c1\uc810",def:"a shop",unit:8,opts:["size", "phone", "rich", "store"]},
    {w:"bag",m:"\uac00\ubc29",def:"something that people can put things in",unit:8,opts:["bag", "bread", "rich", "phone"]},
    {w:"dear",m:"\uc0ac\ub791\ud558\ub294",def:"a word used to begin a letter or diary",unit:8,opts:["size", "hurry", "month", "dear"]},
    {w:"live",m:"\uc0b4\ub2e4",def:"to have a home in a certain place; to be alive",unit:8,opts:["store", "pick", "live", "beef"]},
    {w:"low",m:"\ub0ae\uc740",def:"near to the ground",unit:8,opts:["bread", "dear", "join", "low"]},
    {w:"month",m:"\ud55c \ub2ec",def:"one of the twelve periods of time in a year",unit:8,opts:["rice", "size", "low", "month"]},
    {w:"name",m:"\uc774\ub984",def:"the word(s) by which a person or thing is known",unit:8,opts:["hurry", "bag", "live", "name"]},
    {w:"phone",m:"\uc804\ud654",def:"something used to talk to people who are far away",unit:8,opts:["phone", "live", "middle", "bread"]},
    {w:"rice",m:"\uc300",def:"a type of small white or brown grain",unit:8,opts:["pair", "best", "join", "rice"]},
    {w:"rich",m:"\ubd80\uc720\ud55c",def:"having a lot of money",unit:8,opts:["name", "pick", "bag", "rich"]},
    {w:"size",m:"\ud06c\uae30",def:"how big or small a person or thing is",unit:8,opts:["best", "phone", "join", "size"]},
  ],
  "bew2_9": [
    {w:"birth",m:"\ucd9c\uc0dd",def:"the moment a baby is born",unit:9,opts:["second", "clothes", "brush", "birth"]},
    {w:"clothes",m:"\uc637",def:"things people wear",unit:9,opts:["bath", "bright", "clothes", "lose"]},
    {w:"cost",m:"\ube44\uc6a9\uc774 \ub4e4\ub2e4",def:"to have an amount of money as a price",unit:9,opts:["weigh", "brush", "lose", "cost"]},
    {w:"hide",m:"\uc228\ub2e4",def:"to put something in a place where others cannot see it",unit:9,opts:["bright", "soft", "cost", "hide"]},
    {w:"pet",m:"\uc560\uc644\ub3d9\ubb3c",def:"an animal cared for by a person",unit:9,opts:["hide", "puppy", "pet", "second"]},
    {w:"puppy",m:"\uac15\uc544\uc9c0",def:"a very young dog",unit:9,opts:["age", "clothes", "puppy", "thank"]},
    {w:"soft",m:"\ud479\uc2e0\ud55c",def:"smooth and nice to touch",unit:9,opts:["soft", "thank", "touch", "clothes"]},
    {w:"touch",m:"\ub9cc\uc9c0\ub2e4",def:"to feel by putting fingers on something",unit:9,opts:["lose", "weigh", "touch", "brush"]},
    {w:"weigh",m:"\ubb34\uac8c\ub97c \uc7ac\ub2e4",def:"to find out how heavy a person or thing is",unit:9,opts:["weigh", "puppy", "ugly", "clothes"]},
    {w:"wish",m:"\uc18c\uc6d0",def:"a hope for something",unit:9,opts:["wish", "clothes", "weigh", "hide"]},
    {w:"age",m:"\ub098\uc774",def:"the amount of time being alive",unit:9,opts:["test", "soft", "ugly", "age"]},
    {w:"bath",m:"\ubaa9\uc695",def:"the act of cleaning the body",unit:9,opts:["thank", "brush", "bath", "test"]},
    {w:"bright",m:"\ub611\ub611\ud55c",def:"clever or smart",unit:9,opts:["hide", "weigh", "bright", "cost"]},
    {w:"brush",m:"\ube57\uc9c8\uc744 \ud558\ub2e4",def:"to clean or make smooth with a brush",unit:9,opts:["bath", "test", "ugly", "brush"]},
    {w:"lose",m:"\uc783\uc5b4\ubc84\ub9ac\ub2e4",def:"not to be able to find something; not to be the best in a game",unit:9,opts:["tell", "lose", "ugly", "hide"]},
    {w:"second",m:"\ucd08",def:"a very short period of time; 1/60 of a minute",unit:9,opts:["second", "wish", "tell", "test"]},
    {w:"tell",m:"\ub9d0\ud558\ub2e4",def:"to say or write something to someone",unit:9,opts:["second", "tell", "lose", "bright"]},
    {w:"test",m:"\uc2dc\ud5d8",def:"an exam",unit:9,opts:["test", "second", "birth", "brush"]},
    {w:"thank",m:"\uac10\uc0ac\ud558\ub2e4",def:"to tell someone you are grateful for something",unit:9,opts:["bath", "weigh", "thank", "test"]},
    {w:"ugly",m:"\ubabb\uc0dd\uae34",def:"not pretty",unit:9,opts:["second", "puppy", "ugly", "birth"]},
  ],
  "bew2_10": [
    {w:"calendar",m:"\ub2ec\ub825",def:"a table that shows the days, weeks, and months of a year",unit:10,opts:["luck", "paper", "calendar", "clear"]},
    {w:"dance",m:"\ucda4\ucd94\ub2e4",def:"to move the body along with music",unit:10,opts:["post", "luck", "dance", "clear"]},
    {w:"date",m:"\ub0a0\uc9dc",def:"a specific day of the month or year",unit:10,opts:["turn", "date", "idea", "floor"]},
    {w:"idea",m:"\uc0dd\uac01",def:"a thought or plan",unit:10,opts:["luck", "dance", "idea", "polite"]},
    {w:"luck",m:"\uc6b4",def:"good fortune",unit:10,opts:["luck", "toy", "idea", "favorite"]},
    {w:"paper",m:"\uc885\uc774",def:"something flat used to write on",unit:10,opts:["train", "polite", "clear", "paper"]},
    {w:"post",m:"\uac8c\uc2dc\ud558\ub2e4",def:"to put up a sign or other writing",unit:10,opts:["dance", "favorite", "post", "date"]},
    {w:"receive",m:"\ubc1b\ub2e4",def:"to get",unit:10,opts:["floor", "toy", "receive", "luck"]},
    {w:"toy",m:"\uc7a5\ub09c\uac10",def:"something a child plays with",unit:10,opts:["luck", "toy", "paper", "fan"]},
    {w:"week",m:"\uc8fc",def:"a period of time lasting seven days",unit:10,opts:["present", "week", "clear", "turn"]},
    {w:"clear",m:"\uce58\uc6b0\ub2e4",def:"to make clean by removing items",unit:10,opts:["calendar", "clear", "week", "dance"]},
    {w:"continue",m:"\uacc4\uc18d\ud558\ub2e4",def:"to keep doing something",unit:10,opts:["fan", "luck", "continue", "date"]},
    {w:"fan",m:"\ud32c",def:"someone interested in a famous thing or person",unit:10,opts:["floor", "fan", "luck", "post"]},
    {w:"favorite",m:"\uac00\uc7a5 \uc88b\uc544\ud558\ub294",def:"most liked",unit:10,opts:["floor", "favorite", "present", "post"]},
    {w:"floor",m:"\ubc14\ub2e5",def:"the part of the room people walk on",unit:10,opts:["train", "clear", "floor", "toy"]},
    {w:"polite",m:"\uc608\uc758 \ubc14\ub978",def:"nice to other people",unit:10,opts:["polite", "favorite", "post", "week"]},
    {w:"practice",m:"\uc5f0\uc2b5\ud558\ub2e4",def:"to repeat something in order to become better",unit:10,opts:["week", "continue", "luck", "practice"]},
    {w:"present",m:"\uc8fc\ub2e4",def:"to give something to a person in a formal way",unit:10,opts:["clear", "present", "luck", "polite"]},
    {w:"train",m:"\ud6c8\ub828\ud558\ub2e4",def:"to exercise in order to become better",unit:10,opts:["train", "dance", "date", "paper"]},
    {w:"turn",m:"\ucc28\ub840",def:"the chance for someone to do something",unit:10,opts:["calendar", "dance", "luck", "turn"]},
  ],
  "bew2_11": [
    {w:"balloon",m:"\ud48d\uc120",def:"a thin rubber bag that becomes larger when filled with air",unit:11,opts:["king", "wake", "busy", "balloon"]},
    {w:"bridge",m:"\ub2e4\ub9ac",def:"something built for crossing over water or land",unit:11,opts:["surprise", "fight", "restaurant", "bridge"]},
    {w:"busy",m:"\ubc14\uc05c",def:"having no free time",unit:11,opts:["handsome", "company", "busy", "wake"]},
    {w:"company",m:"\uc190\ub2d8",def:"guests",unit:11,opts:["company", "old", "husband", "fight"]},
    {w:"congratulate",m:"\ucd95\ud558\ud558\ub2e4",def:"to tell someone that you are happy for their good luck",unit:11,opts:["old", "fight", "congratulate", "handsome"]},
    {w:"delicious",m:"\ub9db\uc788\ub294",def:"very good to eat",unit:11,opts:["king", "delicious", "woman", "bridge"]},
    {w:"fight",m:"\uc2f8\uc6b0\ub2e4",def:"to battle or hurt with force",unit:11,opts:["handsome", "fight", "restaurant", "queen"]},
    {w:"old",m:"\uc624\ub798\ub41c",def:"having lived or been used for a long time",unit:11,opts:["gentleman", "congratulate", "old", "busy"]},
    {w:"restaurant",m:"\uc2dd\ub2f9",def:"a place where you can buy and eat food",unit:11,opts:["restaurant", "old", "surprise", "delicious"]},
    {w:"surprise",m:"\ub73b\ubc16\uc758 \uc77c",def:"something that you do not know about before it happens",unit:11,opts:["company", "gentleman", "surprise", "restaurant"]},
    {w:"gentleman",m:"\uc2e0\uc0ac",def:"a man who is polite",unit:11,opts:["wake", "balloon", "company", "gentleman"]},
    {w:"handsome",m:"\uc798\uc0dd\uae34",def:"good-looking, usually for men",unit:11,opts:["restaurant", "wake", "handsome", "surprise"]},
    {w:"husband",m:"\ub0a8\ud3b8",def:"a man someone is married to",unit:11,opts:["interested", "balloon", "old", "husband"]},
    {w:"interested",m:"\uad00\uc2ec \uc788\ub294",def:"wanting to look at something closely",unit:11,opts:["interested", "bridge", "woman", "wake"]},
    {w:"king",m:"\uc655",def:"a man who rules a country",unit:11,opts:["skirt", "king", "fight", "company"]},
    {w:"queen",m:"\uc5ec\uc655",def:"a woman who rules a country or who is a king\u2019s wife",unit:11,opts:["restaurant", "fight", "gentleman", "queen"]},
    {w:"skirt",m:"\uce58\ub9c8",def:"a piece of women\u2019s clothing which hangs from the waist",unit:11,opts:["delicious", "queen", "balloon", "skirt"]},
    {w:"wake",m:"\uc7a0\uc774 \uae68\ub2e4, \uc77c\uc5b4\ub098\ub2e4",def:"to stop sleeping",unit:11,opts:["wake", "old", "husband", "handsome"]},
    {w:"wife",m:"\uc544\ub0b4",def:"a woman someone is married to",unit:11,opts:["wife", "fight", "congratulate", "old"]},
    {w:"woman",m:"\uc5ec\uc790",def:"a girl when she grows up",unit:11,opts:["woman", "fight", "surprise", "busy"]},
  ],
  "bew2_12": [
    {w:"arrive",m:"\ub3c4\ucc29\ud558\ub2e4",def:"to get to a place",unit:12,opts:["subway", "arrive", "south", "office"]},
    {w:"car",m:"\uc790\ub3d9\ucc28",def:"something that people can drive or ride in",unit:12,opts:["umbrella", "arrive", "car", "plate"]},
    {w:"forget",m:"\uc78a\ub2e4",def:"not to remember something",unit:12,opts:["theater", "forget", "car", "arrive"]},
    {w:"gate",m:"\ubb38",def:"a door in a wall or fence",unit:12,opts:["gate", "umbrella", "tonight", "office"]},
    {w:"grand",m:"\uc6c5\uc7a5\ud55c",def:"large and impressive",unit:12,opts:["line", "office", "grand", "forget"]},
    {w:"line",m:"\uc904",def:"a long row of things or people",unit:12,opts:["line", "subway", "office", "square"]},
    {w:"subway",m:"\uc9c0\ud558\ucca0",def:"a system of trains that go under a city",unit:12,opts:["car", "south", "line", "subway"]},
    {w:"theater",m:"\uadf9\uc7a5",def:"a place to watch movies or plays",unit:12,opts:["subway", "win", "office", "theater"]},
    {w:"thousand",m:"\uc22b\uc790 1,000",def:"the number 1,000",unit:12,opts:["thousand", "plate", "cloudy", "grand"]},
    {w:"win",m:"\uc774\uae30\ub2e4",def:"to do better than other people in a game",unit:12,opts:["subway", "tonight", "win", "umbrella"]},
    {w:"cloudy",m:"\ud750\ub9b0",def:"not clear or easily seen through",unit:12,opts:["street", "win", "cloudy", "tonight"]},
    {w:"north",m:"\ubd81\ucabd\uc73c\ub85c",def:"in the direction pointing toward the top of a map",unit:12,opts:["north", "forget", "theater", "plate"]},
    {w:"office",m:"\uc0ac\ubb34\uc2e4",def:"a room where people work with desks and chairs",unit:12,opts:["office", "car", "street", "gate"]},
    {w:"plate",m:"\uc811\uc2dc",def:"a flat dish",unit:12,opts:["plate", "arrive", "forget", "subway"]},
    {w:"police",m:"\uacbd\ucc30",def:"a person or group of people who help keep others safe",unit:12,opts:["office", "street", "theater", "police"]},
    {w:"south",m:"\ub0a8\ucabd\uc73c\ub85c",def:"in the direction pointing toward the bottom of a map",unit:12,opts:["north", "theater", "south", "police"]},
    {w:"square",m:"\uad11\uc7a5",def:"an open area in a town or city where people get together",unit:12,opts:["square", "win", "office", "gate"]},
    {w:"street",m:"\uac70\ub9ac",def:"a road, usually with buildings on one or both sides",unit:12,opts:["theater", "street", "arrive", "cloudy"]},
    {w:"tonight",m:"\uc624\ub298 \ubc24",def:"the night of today",unit:12,opts:["office", "tonight", "police", "theater"]},
    {w:"umbrella",m:"\uc6b0\uc0b0",def:"a thing used to stop rain or the sun from getting on you",unit:12,opts:["north", "police", "forget", "umbrella"]},
  ],
  "bew3_1": [
    {w:"burn",m:"\ud0c0\ub2e4",def:"to be on fire",unit:1,opts:["knock", "shake", "smart", "burn"]},
    {w:"exchange",m:"\uad50\ud658\ud558\ub2e4",def:"to give something and get something at the same time",unit:1,opts:["bowl", "result", "exchange", "popular"]},
    {w:"introduce",m:"\uc18c\uac1c\ud558\ub2e4",def:"to make a person known to another person",unit:1,opts:["reason", "block", "shake", "introduce"]},
    {w:"offer",m:"\uc81c\uacf5\ud558\ub2e4",def:"to try to give or do something to help someone",unit:1,opts:["pardon", "prepare", "offer", "exchange"]},
    {w:"pardon",m:"\uc6a9\uc11c\ud558\ub2e4",def:"to forgive, often used with me",unit:1,opts:["borrow", "pardon", "bell", "shy"]},
    {w:"popular",m:"\uc778\uae30 \uc788\ub294",def:"liked by many people",unit:1,opts:["popular", "confuse", "knock", "burn"]},
    {w:"prepare",m:"\uc900\ube44\ud558\ub2e4",def:"to make",unit:1,opts:["offer", "burn", "smart", "prepare"]},
    {w:"reason",m:"\uc774\uc720",def:"something that says why something was or was not done",unit:1,opts:["subject", "bell", "reason", "seem"]},
    {w:"shake",m:"\ud754\ub4e4\ub2e4",def:"to hold and move up and down",unit:1,opts:["shake", "block", "confuse", "bowl"]},
    {w:"shy",m:"\uc218\uc90d\uc740",def:"quiet and not wanting to talk to others",unit:1,opts:["result", "offer", "smart", "shy"]},
    {w:"bell",m:"\uc885",def:"something that makes a ringing sound when hit",unit:1,opts:["bell", "introduce", "result", "shy"]},
    {w:"block",m:"\ube14\ub85d, \uad6c\uc5ed",def:"a part of a city with streets on all four sides",unit:1,opts:["exchange", "borrow", "confuse", "block"]},
    {w:"borrow",m:"\ube4c\ub9ac\ub2e4",def:"to take and use something belonging to another person",unit:1,opts:["popular", "subject", "confuse", "borrow"]},
    {w:"bowl",m:"\uadf8\ub987",def:"a dish with tall sides",unit:1,opts:["smart", "offer", "shy", "bowl"]},
    {w:"confuse",m:"\ud63c\ub780 \uc2dc\ud0a4\ub2e4",def:"to make it difficult for someone to understand",unit:1,opts:["shake", "shy", "smart", "confuse"]},
    {w:"knock",m:"\ub450\ub4dc\ub9ac\ub2e4",def:"to hit something with part of your hand",unit:1,opts:["knock", "block", "borrow", "introduce"]},
    {w:"result",m:"\uacb0\uacfc",def:"an exam grade; something that is caused by another",unit:1,opts:["block", "shy", "introduce", "result"]},
    {w:"seem",m:"~\uc778 \uac83 \uac19\ub2e4",def:"to look to be",unit:1,opts:["introduce", "seem", "bowl", "result"]},
    {w:"smart",m:"\ub611\ub611\ud55c",def:"good at learning or thinking about things",unit:1,opts:["knock", "block", "prepare", "smart"]},
    {w:"subject",m:"\uacfc\ubaa9",def:"something you study in school",unit:1,opts:["offer", "block", "shy", "subject"]},
  ],
  "bew3_2": [
    {w:"active",m:"\ud65c\ubc1c\ud55c",def:"doing many things",unit:2,opts:["enter", "active", "choice", "path"]},
    {w:"believe",m:"\ubbff\ub2e4",def:"to think that something is true",unit:2,opts:["lie", "believe", "environment", "area"]},
    {w:"environment",m:"\ud658\uacbd",def:"all of the things found in an area, indoors or outdoors",unit:2,opts:["safe", "forest", "environment", "service"]},
    {w:"forest",m:"\uc232",def:"a big area of trees",unit:2,opts:["active", "choice", "forest", "human"]},
    {w:"human",m:"\uc0ac\ub78c",def:"a person",unit:2,opts:["enter", "path", "forest", "human"]},
    {w:"hunt",m:"\uc0ac\ub0e5\ud558\ub2e4",def:"to look for animals to kill",unit:2,opts:["active", "wild", "hunt", "choice"]},
    {w:"path",m:"\uae38",def:"a way to go from one place to another",unit:2,opts:["active", "protect", "path", "choice"]},
    {w:"safe",m:"\uc548\uc804\ud55c",def:"not dangerous",unit:2,opts:["safe", "enter", "hunt", "human"]},
    {w:"service",m:"\uc11c\ube44\uc2a4",def:"the job of helping visitors at a place like a restaurant",unit:2,opts:["choice", "path", "service", "enter"]},
    {w:"wild",m:"\uc57c\uc0dd\uc758",def:"living or growing without humans\u2019 help",unit:2,opts:["wild", "path", "believe", "safe"]},
    {w:"area",m:"\uc9c0\uc5ed",def:"a part of a larger place",unit:2,opts:["active", "path", "shout", "area"]},
    {w:"choice",m:"\uc120\ud0dd",def:"something you can choose",unit:2,opts:["human", "choice", "lie", "service"]},
    {w:"enter",m:"\ub4e4\uc5b4\uac00\ub2e4",def:"to go in",unit:2,opts:["human", "usually", "enter", "hunt"]},
    {w:"important",m:"\uc911\uc694\ud55c",def:"having great meaning",unit:2,opts:["important", "nature", "hunt", "path"]},
    {w:"lie",m:"\ub215\ub2e4",def:"to be on your back on the ground or in a bed",unit:2,opts:["nature", "safe", "lie", "usually"]},
    {w:"mad",m:"\ud654\ub09c",def:"angry",unit:2,opts:["hunt", "choice", "mad", "active"]},
    {w:"nature",m:"\uc790\uc5f0",def:"everything in the world that is not made by humans",unit:2,opts:["human", "forest", "nature", "shout"]},
    {w:"protect",m:"\ubcf4\ud638\ud558\ub2e4",def:"to keep safe from harm",unit:2,opts:["usually", "area", "protect", "lie"]},
    {w:"shout",m:"\uc18c\ub9ac\uce58\ub2e4",def:"to say something very loudly",unit:2,opts:["active", "environment", "forest", "shout"]},
    {w:"usually",m:"\ubcf4\ud1b5",def:"most of the time",unit:2,opts:["path", "usually", "important", "shout"]},
  ],
  "bew3_3": [
    {w:"amazing",m:"\ub180\ub77c\uc6b4",def:"causing great surprise or wonder",unit:3,opts:["public", "event", "cheer", "amazing"]},
    {w:"attend",m:"\ucc38\uc11d\ud558\ub2e4",def:"to go to a class or activity",unit:3,opts:["express", "secret", "scene", "attend"]},
    {w:"event",m:"\ud589\uc0ac",def:"a special, planned activity",unit:3,opts:["event", "special", "stage", "express"]},
    {w:"express",m:"\ud45c\ud604\ud558\ub2e4",def:"to say, write, or show thoughts or feelings",unit:3,opts:["save", "stage", "cheer", "express"]},
    {w:"grade",m:"\ud559\ub144",def:"a level of study in school",unit:3,opts:["grade", "unique", "save", "set"]},
    {w:"part",m:"\ubd80\ubd84",def:"a piece; some but not all",unit:3,opts:["express", "part", "special", "event"]},
    {w:"save",m:"\uc808\uc57d\ud558\ub2e4",def:"to keep something to use later",unit:3,opts:["grade", "save", "part", "special"]},
    {w:"set",m:"\uc815\ud558\ub2e4",def:"to choose something",unit:3,opts:["amazing", "scene", "cheer", "set"]},
    {w:"space",m:"\uacf5\uac04",def:"an empty area where a person or thing can go",unit:3,opts:["magazine", "stage", "event", "space"]},
    {w:"special",m:"\ud2b9\ubcc4\ud55c",def:"different from the usual",unit:3,opts:["public", "express", "set", "special"]},
    {w:"cheer",m:"\uc751\uc6d0\ud558\ub2e4",def:"to shout to show happiness or to make others feel good",unit:3,opts:["magazine", "express", "secret", "cheer"]},
    {w:"contest",m:"\ub300\ud68c",def:"an event in which there is a winner",unit:3,opts:["set", "part", "contest", "event"]},
    {w:"gift",m:"\uc120\ubb3c",def:"something given to someone",unit:3,opts:["gift", "set", "save", "perform"]},
    {w:"magazine",m:"\uc7a1\uc9c0",def:"a thin book that comes out once a week or month",unit:3,opts:["cheer", "scene", "express", "magazine"]},
    {w:"perform",m:"\uacf5\uc5f0\ud558\ub2e4",def:"to do something like singing or acting in front of people",unit:3,opts:["perform", "express", "set", "scene"]},
    {w:"public",m:"\uacf5\uacf5\uc7a5\uc18c",def:"(after in) a place where many people can see you",unit:3,opts:["special", "amazing", "cheer", "public"]},
    {w:"scene",m:"\uc7a5\uba74",def:"a part of a play or movie",unit:3,opts:["secret", "scene", "contest", "express"]},
    {w:"secret",m:"\ube44\ubc00",def:"something that is kept hidden from other people",unit:3,opts:["special", "secret", "public", "set"]},
    {w:"stage",m:"\ubb34\ub300",def:"the part of a theater where people perform",unit:3,opts:["part", "express", "cheer", "stage"]},
    {w:"unique",m:"\ub3c5\ud2b9\ud55c",def:"not like anyone or anything else",unit:3,opts:["amazing", "unique", "special", "public"]},
  ],
  "bew3_4": [
    {w:"electricity",m:"\uc804\uae30",def:"something used to give light and make things work",unit:4,opts:["case", "fold", "electricity", "sock"]},
    {w:"fact",m:"\uc0ac\uc2e4",def:"something that is true",unit:4,opts:["sock", "advice", "fact", "succeed"]},
    {w:"fold",m:"\uc811\ub2e4",def:"to bend one part of something over another part",unit:4,opts:["stupid", "mind", "fold", "sock"]},
    {w:"key",m:"\uc5f4\uc1e0",def:"an object used to lock or unlock a door or to start a car",unit:4,opts:["exam", "case", "key", "lazy"]},
    {w:"mind",m:"\uaebc\ub9ac\ub2e4",def:"to be unhappy about something, usually used with not",unit:4,opts:["terrible", "stupid", "mind", "succeed"]},
    {w:"power",m:"\uc804\uc6d0",def:"something you cannot see that is used to make things work",unit:4,opts:["key", "exam", "case", "power"]},
    {w:"sock",m:"\uc591\ub9d0",def:"a soft piece of clothing that covers the foot",unit:4,opts:["stick", "terrible", "sock", "stupid"]},
    {w:"solve",m:"\ud480\ub2e4",def:"to find the answer",unit:4,opts:["power", "solve", "lazy", "case"]},
    {w:"stick",m:"\ubd99\uc774\ub2e4",def:"to attach to something",unit:4,opts:["case", "stick", "succeed", "fold"]},
    {w:"traffic",m:"\uad50\ud1b5",def:"cars on the road",unit:4,opts:["exam", "upset", "traffic", "message"]},
    {w:"advice",m:"\uc870\uc5b8",def:"an opinion about what someone should or should not do",unit:4,opts:["happen", "advice", "power", "stupid"]},
    {w:"case",m:"\ud1b5",def:"a small box or bag",unit:4,opts:["upset", "case", "stick", "lazy"]},
    {w:"exam",m:"\uc2dc\ud5d8",def:"a test",unit:4,opts:["solve", "message", "terrible", "exam"]},
    {w:"happen",m:"\ubc1c\uc0dd\ud558\ub2e4",def:"to take place",unit:4,opts:["fold", "sock", "exam", "happen"]},
    {w:"lazy",m:"\uac8c\uc73c\ub978",def:"not wanting to work or move",unit:4,opts:["lazy", "terrible", "power", "mind"]},
    {w:"message",m:"\uba54\uc2dc\uc9c0",def:"information that is sent or given to someone",unit:4,opts:["power", "message", "case", "stupid"]},
    {w:"stupid",m:"\uc5b4\ub9ac\uc11d\uc740",def:"dumb; foolish",unit:4,opts:["fact", "traffic", "stupid", "solve"]},
    {w:"succeed",m:"\uc131\uacf5\ud558\ub2e4",def:"to do well; to do what you tried to do",unit:4,opts:["fold", "key", "succeed", "message"]},
    {w:"terrible",m:"\ud615\ud3b8\uc5c6\ub294",def:"very bad",unit:4,opts:["fold", "happen", "case", "terrible"]},
    {w:"upset",m:"\uae30\ubd84\uc774 \uc5b8\uc9e2\uc740",def:"worried; not happy",unit:4,opts:["exam", "upset", "solve", "electricity"]},
  ],
  "bew3_5": [
    {w:"airplane",m:"\ube44\ud589\uae30",def:"a flying machine",unit:5,opts:["experience", "airplane", "sand", "order"]},
    {w:"airport",m:"\uacf5\ud56d",def:"a place where airplanes arrive and leave",unit:5,opts:["spot", "airport", "island", "order"]},
    {w:"culture",m:"\ubb38\ud654",def:"the way of life of a group of people",unit:5,opts:["airplane", "century", "culture", "journey"]},
    {w:"decide",m:"\uacb0\uc815\ud558\ub2e4",def:"to make a choice",unit:5,opts:["modern", "leave", "airport", "decide"]},
    {w:"leave",m:"\ub5a0\ub098\ub2e4",def:"to go away from",unit:5,opts:["leave", "journey", "bill", "modern"]},
    {w:"modern",m:"\ud604\ub300\uc801\uc778",def:"of the latest kind",unit:5,opts:["modern", "bill", "return", "leave"]},
    {w:"order",m:"\uc8fc\ubb38\ud558\ub2e4",def:"to ask for food or drink at a restaurant",unit:5,opts:["order", "leave", "airplane", "culture"]},
    {w:"sand",m:"\ubaa8\ub798",def:"very tiny pieces of rock",unit:5,opts:["spot", "experience", "leave", "sand"]},
    {w:"spot",m:"\uc7a5\uc18c",def:"an area, place, or location",unit:5,opts:["custom", "modern", "spot", "island"]},
    {w:"strange",m:"\uc774\uc0c1\ud55c",def:"different from what is usual",unit:5,opts:["sand", "leave", "airplane", "strange"]},
    {w:"bill",m:"\uc9c0\ud3d0",def:"a piece of paper money",unit:5,opts:["modern", "experience", "bill", "return"]},
    {w:"blow",m:"\ubd88\ub2e4",def:"to move something with air",unit:5,opts:["island", "blow", "journey", "century"]},
    {w:"century",m:"100\ub144",def:"one hundred years",unit:5,opts:["century", "experience", "strange", "sand"]},
    {w:"custom",m:"\uad00\uc2b5",def:"the usual way of doing something in a culture",unit:5,opts:["international", "decide", "airport", "custom"]},
    {w:"experience",m:"\uacbd\ud5d8\ud558\ub2e4",def:"to see, feel, or do something",unit:5,opts:["century", "experience", "airport", "island"]},
    {w:"international",m:"\uad6d\uc81c\uc801\uc778",def:"happening in or between two or more countries",unit:5,opts:["international", "culture", "airplane", "island"]},
    {w:"island",m:"\uc12c",def:"a piece of land in the middle of water",unit:5,opts:["leave", "island", "return", "decide"]},
    {w:"journey",m:"\uc5ec\ud589",def:"a long trip",unit:5,opts:["return", "journey", "leave", "century"]},
    {w:"meal",m:"\uc74c\uc2dd",def:"food that is prepared and eaten",unit:5,opts:["experience", "century", "meal", "sand"]},
    {w:"return",m:"\ub3cc\uc544\uc624\ub2e4",def:"to come back after being away",unit:5,opts:["modern", "bill", "return", "decide"]},
  ],
  "bew3_6": [
    {w:"actually",m:"\uc0ac\uc2e4\uc740",def:"in fact",unit:6,opts:["symbol", "actually", "simple", "member"]},
    {w:"camp",m:"\uc57c\uc601\ud558\ub2e4",def:"to sleep outside in a tent",unit:6,opts:["camp", "actually", "force", "review"]},
    {w:"collect",m:"\ubaa8\uc73c\ub2e4",def:"to bring things together into one group",unit:6,opts:["real", "simple", "reach", "collect"]},
    {w:"form",m:"\ub9cc\ub4e4\ub2e4",def:"to make",unit:6,opts:["reach", "soccer", "form", "simple"]},
    {w:"kick",m:"\ucc28\ub2e4",def:"to hit something with your foot",unit:6,opts:["reach", "simple", "kick", "member"]},
    {w:"reach",m:"\uc190\uc744 \ubed7\ub2e4",def:"to stretch out the arm to touch or get with your hand",unit:6,opts:["reach", "actually", "bat", "step"]},
    {w:"review",m:"\ubcf5\uc2b5\ud558\ub2e4",def:"to look at or study something again",unit:6,opts:["allow", "bat", "step", "review"]},
    {w:"simple",m:"\uac04\ub2e8\ud55c",def:"easy",unit:6,opts:["allow", "leaf", "collect", "simple"]},
    {w:"soccer",m:"\ucd95\uad6c",def:"a sport in which a ball is kicked into a goal to win a point",unit:6,opts:["review", "soccer", "kick", "simple"]},
    {w:"symbol",m:"\uc0c1\uc9d5",def:"a shape with a special meaning",unit:6,opts:["camp", "kick", "symbol", "form"]},
    {w:"allow",m:"\ud5c8\ub77d\ud558\ub2e4",def:"to let someone do something",unit:6,opts:["form", "member", "collect", "allow"]},
    {w:"bat",m:"\ubc15\uc950",def:"a flying animal that hunts at night",unit:6,opts:["sign", "bat", "soccer", "reach"]},
    {w:"exercise",m:"\uc6b4\ub3d9\ud558\ub2e4",def:"to move the body as a way to get healthy",unit:6,opts:["symbol", "simple", "kick", "exercise"]},
    {w:"force",m:"\uac15\uc694\ud558\ub2e4",def:"to make people do things they do not want to do",unit:6,opts:["exercise", "step", "camp", "force"]},
    {w:"leaf",m:"\ub098\ubb47\uc78e",def:"the flat green part of a plant",unit:6,opts:["member", "soccer", "allow", "leaf"]},
    {w:"member",m:"\ud68c\uc6d0",def:"a person in a group or club",unit:6,opts:["soccer", "member", "simple", "reach"]},
    {w:"real",m:"\uc9c4\uc9dc\uc758",def:"actually happening; being what it looks like",unit:6,opts:["exercise", "review", "real", "soccer"]},
    {w:"sign",m:"\ud45c\uc9c0\ud310",def:"a flat board or paper with a message on it",unit:6,opts:["force", "leaf", "real", "sign"]},
    {w:"step",m:"\ubc1f\ub2e4",def:"to move your foot up and put it down in a different spot",unit:6,opts:["soccer", "symbol", "step", "allow"]},
    {w:"treat",m:"\uac04\uc2dd",def:"something nice that you do not eat or do often",unit:6,opts:["member", "step", "camp", "treat"]},
  ],
  "bew3_7": [
    {w:"afraid",m:"\ub450\ub824\uc6cc\ud558\ub294",def:"feeling fear",unit:7,opts:["fair", "sentence", "afraid", "habit"]},
    {w:"fair",m:"\uacf5\ud3c9\ud55c",def:"good for everyone",unit:7,opts:["college", "foreign", "honest", "fair"]},
    {w:"focus",m:"\uc9d1\uc911\ud558\ub2e4",def:"to put all of your thoughts on one thing",unit:7,opts:["fair", "focus", "honest", "level"]},
    {w:"foreign",m:"\uc678\uad6d\uc758",def:"from a different country",unit:7,opts:["comfortable", "stress", "foreign", "habit"]},
    {w:"habit",m:"\uc2b5\uad00",def:"something you do often, usually without thinking about it",unit:7,opts:["audience", "habit", "comfortable", "foreign"]},
    {w:"invent",m:"\ubc1c\uba85\ud558\ub2e4",def:"to make something for the first time",unit:7,opts:["invent", "stress", "language", "comfortable"]},
    {w:"language",m:"\uc5b8\uc5b4",def:"the words and symbols used by people of one country or area",unit:7,opts:["sentence", "honest", "language", "invent"]},
    {w:"nation",m:"\ub098\ub77c",def:"a country",unit:7,opts:["nation", "topic", "still", "habit"]},
    {w:"still",m:"\uac00\ub9cc\ud788 \uc788\ub294",def:"not moving",unit:7,opts:["sentence", "honest", "fair", "still"]},
    {w:"wise",m:"\ud604\uba85\ud55c",def:"knowing the right things to do",unit:7,opts:["topic", "still", "comfortable", "wise"]},
    {w:"audience",m:"\uad00\uc911",def:"a group of people watching an event or show",unit:7,opts:["stress", "habit", "audience", "still"]},
    {w:"college",m:"\ub300\ud559",def:"a school where students study after high school",unit:7,opts:["college", "level", "language", "focus"]},
    {w:"comfortable",m:"\ud3b8\uc548\ud55c",def:"feeling relaxed",unit:7,opts:["audience", "comfortable", "suddenly", "fair"]},
    {w:"honest",m:"\uc815\uc9c1\ud55c",def:"good and saying things that are true",unit:7,opts:["imagine", "college", "focus", "honest"]},
    {w:"imagine",m:"\uc0c1\uc0c1\ud558\ub2e4",def:"to think of things that are not real",unit:7,opts:["suddenly", "sentence", "level", "imagine"]},
    {w:"level",m:"\uc815\ub3c4",def:"an amount of something",unit:7,opts:["level", "foreign", "language", "topic"]},
    {w:"sentence",m:"\ubb38\uc7a5",def:"a set of words that make a statement or question",unit:7,opts:["afraid", "habit", "topic", "sentence"]},
    {w:"stress",m:"\uc2a4\ud2b8\ub808\uc2a4",def:"worry caused by problems in your life",unit:7,opts:["stress", "foreign", "comfortable", "nation"]},
    {w:"suddenly",m:"\uac11\uc790\uae30",def:"very quickly",unit:7,opts:["stress", "suddenly", "still", "honest"]},
    {w:"topic",m:"\uc8fc\uc81c",def:"a subject people talk or write about",unit:7,opts:["college", "focus", "topic", "suddenly"]},
  ],
  "bew3_8": [
    {w:"add",m:"\ucca8\uac00\ud558\ub2e4",def:"to put one thing with another thing or things",unit:8,opts:["blind", "add", "match", "celebrate"]},
    {w:"blind",m:"\ub208\uc774 \uba3c",def:"not able to see",unit:8,opts:["string", "blind", "social", "princess"]},
    {w:"button",m:"\ub2e8\ucd94",def:"a small round thing used to close an opening in clothing",unit:8,opts:["add", "button", "blind", "item"]},
    {w:"create",m:"\ucc3d\uc791\ud558\ub2e4",def:"to make something",unit:8,opts:["string", "button", "create", "tear"]},
    {w:"memory",m:"\uae30\uc5b5",def:"something from the past that is remembered",unit:8,opts:["prince", "memory", "board", "tradition"]},
    {w:"prince",m:"\uc655\uc790",def:"the son of a king or queen",unit:8,opts:["button", "princess", "hole", "prince"]},
    {w:"string",m:"\ub048",def:"a long thread used to keep things together",unit:8,opts:["string", "create", "tradition", "match"]},
    {w:"thick",m:"\ub450\uaebc\uc6b4",def:"having a large distance from top to bottom",unit:8,opts:["princess", "add", "thick", "tight"]},
    {w:"tight",m:"\uaf49 \ub9de\ub294",def:"fitting close to the body",unit:8,opts:["match", "memory", "princess", "tight"]},
    {w:"tradition",m:"\uc804\ud1b5",def:"a custom that has been around for a long time",unit:8,opts:["tradition", "celebrate", "especially", "memory"]},
    {w:"board",m:"\ub110\ube64\uc9c0",def:"a flat, wide piece of wood",unit:8,opts:["tradition", "string", "brain", "board"]},
    {w:"brain",m:"\ub1cc",def:"the part of the body inside your head",unit:8,opts:["board", "brain", "princess", "celebrate"]},
    {w:"celebrate",m:"\ucd95\ud558\ud558\ub2e4",def:"to do something special for an important event",unit:8,opts:["match", "string", "button", "celebrate"]},
    {w:"especially",m:"\ud2b9\ud788",def:"in a way that is greater than usual",unit:8,opts:["especially", "string", "button", "tight"]},
    {w:"hole",m:"\uad6c\uba4d",def:"an opening that something can pass through",unit:8,opts:["hole", "item", "match", "tight"]},
    {w:"item",m:"\ubb3c\ud488",def:"a thing that is usually part of a group",unit:8,opts:["prince", "especially", "thick", "item"]},
    {w:"match",m:"\uc77c\uce58\ud558\ub2e4",def:"to look similar to something",unit:8,opts:["brain", "board", "add", "match"]},
    {w:"princess",m:"\uacf5\uc8fc",def:"the daughter of a king or queen",unit:8,opts:["button", "princess", "memory", "blind"]},
    {w:"social",m:"\uc0ac\uad50\uc801\uc778",def:"having a need to be with others",unit:8,opts:["button", "social", "string", "celebrate"]},
    {w:"tear",m:"\ucc22\ub2e4",def:"to pull something into parts",unit:8,opts:["hole", "tear", "board", "tradition"]},
  ],
  "bew3_9": [
    {w:"cross",m:"\uac74\ub108\ub2e4",def:"to go from one side to the other",unit:9,opts:["cross", "heat", "climb", "perfect"]},
    {w:"finally",m:"\ub9c8\uce68\ub0b4",def:"after a long time",unit:9,opts:["finally", "perfect", "follow", "cross"]},
    {w:"follow",m:"\ub530\ub77c\uac00\ub2e4",def:"to go after; to do what a person or thing says",unit:9,opts:["follow", "heat", "engine", "finally"]},
    {w:"heat",m:"\ub530\ub73b\ud558\uac8c \ud558\ub2e4",def:"to make something hot",unit:9,opts:["cross", "stone", "energy", "heat"]},
    {w:"rainbow",m:"\ubb34\uc9c0\uac1c",def:"a curved line of colors in the sky",unit:9,opts:["follow", "energy", "rainbow", "shape"]},
    {w:"spread",m:"\ud3bc\uce58\ub2e4",def:"to open or place something so that it covers a large area",unit:9,opts:["vote", "perfect", "shape", "spread"]},
    {w:"tired",m:"\ud53c\uace4\ud55c",def:"needing rest or sleep",unit:9,opts:["field", "tower", "cross", "tired"]},
    {w:"tower",m:"\ud0d1",def:"a tall and narrow building",unit:9,opts:["shape", "tower", "tired", "engine"]},
    {w:"unit",m:"\ub2e8\uc6d0",def:"one part of something",unit:9,opts:["shape", "unit", "energy", "follow"]},
    {w:"vote",m:"\ud22c\ud45c\ud558\ub2e4",def:"to make a choice for or against a person or thing",unit:9,opts:["engine", "stone", "vote", "heat"]},
    {w:"climb",m:"\uc624\ub974\ub2e4",def:"to go up or down using your feet and hands",unit:9,opts:["spread", "climb", "vote", "shape"]},
    {w:"describe",m:"\uc124\uba85\ud558\ub2e4",def:"to talk about what something is like",unit:9,opts:["describe", "climb", "tower", "finally"]},
    {w:"energy",m:"\ud65c\uae30, \ud798",def:"power; the ability to be active",unit:9,opts:["describe", "rise", "finally", "energy"]},
    {w:"engine",m:"\uc5d4\uc9c4",def:"the part of a car that makes power for it to move",unit:9,opts:["heat", "tower", "engine", "climb"]},
    {w:"field",m:"\ub4e4\ud310",def:"a grassy area that has no trees or buildings",unit:9,opts:["energy", "unit", "perfect", "field"]},
    {w:"include",m:"\ud3ec\ud568\ud558\ub2e4",def:"to have a person or thing as part of a group",unit:9,opts:["describe", "include", "climb", "stone"]},
    {w:"perfect",m:"\uc644\ubcbd\ud55c",def:"not having anything wrong",unit:9,opts:["perfect", "cross", "vote", "rise"]},
    {w:"rise",m:"\uc62c\ub77c\uac00\ub2e4",def:"to move upward",unit:9,opts:["engine", "climb", "rainbow", "rise"]},
    {w:"shape",m:"\ubaa8\uc591",def:"the outline of something",unit:9,opts:["follow", "shape", "tower", "field"]},
    {w:"stone",m:"\ub3cc",def:"a small rock",unit:9,opts:["stone", "energy", "finally", "tower"]},
  ],
  "bew3_10": [
    {w:"bake",m:"\uad7d\ub2e4",def:"to make something and cook it in an oven",unit:10,opts:["interview", "bake", "deliver", "sport"]},
    {w:"communicate",m:"\uc758\uc0ac\uc18c\ud1b5\ud558\ub2e4",def:"to share thoughts and feelings with another person",unit:10,opts:["festival", "direct", "communicate", "deliver"]},
    {w:"deliver",m:"\ubc30\ub2ec\ud558\ub2e4",def:"to take something to a person or place",unit:10,opts:["uniform", "million", "deliver", "whole"]},
    {w:"direct",m:"\uac10\ub3c5\ud558\ub2e4",def:"to tell an actor or a group of actors what to do",unit:10,opts:["festival", "whole", "goal", "direct"]},
    {w:"goal",m:"\ubaa9\ud45c",def:"something you are trying to do",unit:10,opts:["support", "interview", "million", "goal"]},
    {w:"history",m:"\uc5ed\uc0ac",def:"events in the past",unit:10,opts:["uniform", "history", "direct", "community"]},
    {w:"inform",m:"\uc54c\ub9ac\ub2e4",def:"to let others know about something",unit:10,opts:["march", "inform", "appear", "community"]},
    {w:"mail",m:"\uc6b0\ud3b8\ubb3c",def:"letters or packages sent to others",unit:10,opts:["festival", "mail", "report", "whole"]},
    {w:"march",m:"\ud589\uc9c4\ud558\ub2e4",def:"to walk as a group in step with each other",unit:10,opts:["goal", "march", "newspaper", "inform"]},
    {w:"whole",m:"\uc804\uccb4\uc758",def:"all of something",unit:10,opts:["whole", "bake", "goal", "million"]},
    {w:"appear",m:"\ub098\ud0c0\ub098\ub2e4",def:"to be seen",unit:10,opts:["sport", "appear", "uniform", "direct"]},
    {w:"community",m:"\uacf5\ub3d9\uccb4, \uc9c0\uc5ed \uc0ac\ud68c",def:"a group of people living in the same area",unit:10,opts:["uniform", "newspaper", "community", "report"]},
    {w:"festival",m:"\ucd95\uc81c",def:"a special party with events to celebrate something",unit:10,opts:["bake", "march", "festival", "report"]},
    {w:"interview",m:"\uba74\uc811\uc744 \ubcf4\ub2e4",def:"to ask someone many questions",unit:10,opts:["interview", "festival", "sport", "community"]},
    {w:"million",m:"100\ub9cc\uc758",def:"of the number 1,000,000",unit:10,opts:["direct", "goal", "million", "mail"]},
    {w:"newspaper",m:"\uc2e0\ubb38",def:"a set of large papers with stories about true events",unit:10,opts:["interview", "newspaper", "goal", "history"]},
    {w:"report",m:"\uc804\ud558\ub2e4",def:"to give news on television or in a newspaper",unit:10,opts:["uniform", "appear", "communicate", "report"]},
    {w:"sport",m:"\uc2a4\ud3ec\uce20, \uc6b4\ub3d9",def:"an active game with rules that people play",unit:10,opts:["million", "sport", "history", "direct"]},
    {w:"support",m:"\uc9c0\uc9c0\ud558\ub2e4",def:"to show you like and want to help a person or group",unit:10,opts:["report", "festival", "goal", "support"]},
    {w:"uniform",m:"\uc720\ub2c8\ud3fc",def:"the clothing worn by members of a group",unit:10,opts:["uniform", "bake", "whole", "appear"]},
  ],
  "bew3_11": [
    {w:"brave",m:"\uc6a9\uac10\ud55c",def:"not afraid",unit:11,opts:["product", "brave", "roll", "corn"]},
    {w:"goat",m:"\uc5fc\uc18c",def:"a small animal that lives on a farm or in the mountains",unit:11,opts:["hang", "insect", "sore", "goat"]},
    {w:"hang",m:"\ub9e4\ub2ec\ub2e4",def:"to place something so that it is held at the top",unit:11,opts:["roll", "quite", "hang", "roof"]},
    {w:"ice",m:"\uc5bc\uc74c",def:"frozen water",unit:11,opts:["brave", "village", "ice", "sore"]},
    {w:"insect",m:"\uace4\ucda9",def:"a small animal with six legs",unit:11,opts:["rope", "sore", "quite", "insect"]},
    {w:"raise",m:"\uae30\ub974\ub2e4",def:"to care for an animal or plant as it grows",unit:11,opts:["tent", "medicine", "goat", "raise"]},
    {w:"roll",m:"\uad74\ub9ac\ub2e4",def:"to turn over and over",unit:11,opts:["ice", "sore", "roll", "brave"]},
    {w:"sore",m:"\uc544\ud508",def:"hurting",unit:11,opts:["sore", "accident", "brave", "product"]},
    {w:"tent",m:"\ud150\ud2b8",def:"a covered place to sleep outside",unit:11,opts:["rope", "accident", "roof", "tent"]},
    {w:"village",m:"\ub9c8\uc744",def:"a very small town",unit:11,opts:["roof", "ice", "sore", "village"]},
    {w:"accident",m:"\uc0ac\uace0",def:"a sudden bad event in which someone might be hurt",unit:11,opts:["accident", "roll", "village", "corn"]},
    {w:"adventure",m:"\ubaa8\ud5d8",def:"an exciting experience",unit:11,opts:["ice", "product", "adventure", "corn"]},
    {w:"corn",m:"\uc625\uc218\uc218",def:"a vegetable with many small yellow seeds",unit:11,opts:["village", "develop", "corn", "hang"]},
    {w:"develop",m:"\uac1c\ubc1c\ud558\ub2e4",def:"to create something over time",unit:11,opts:["tent", "product", "develop", "accident"]},
    {w:"medicine",m:"\uc57d",def:"something that helps a sick person or animal",unit:11,opts:["develop", "raise", "medicine", "adventure"]},
    {w:"own",m:"\uc18c\uc720\ud558\ub2e4",def:"to pay for something so it belongs to you",unit:11,opts:["accident", "develop", "own", "medicine"]},
    {w:"product",m:"\uc0c1\ud488",def:"something that is made or grown and sold",unit:11,opts:["product", "accident", "rope", "roof"]},
    {w:"quite",m:"\uaf64",def:"very",unit:11,opts:["quite", "goat", "accident", "rope"]},
    {w:"roof",m:"\uc9c0\ubd95",def:"the top covering on a building",unit:11,opts:["accident", "sore", "roof", "hang"]},
    {w:"rope",m:"\ubc27\uc904",def:"a very thick and strong string",unit:11,opts:["corn", "roof", "raise", "rope"]},
  ],
  "bew3_12": [
    {w:"carrot",m:"\ub2f9\uadfc",def:"an orange vegetable that grows under the ground",unit:12,opts:["mark", "carrot", "ground", "lay"]},
    {w:"cause",m:"\uc57c\uae30\ud558\ub2e4, \uc77c\uc73c\ud0a4\ub2e4",def:"to make something happen",unit:12,opts:["lay", "cause", "possible", "price"]},
    {w:"experiment",m:"\uc2e4\ud5d8\ud558\ub2e4",def:"to try something new",unit:12,opts:["mark", "experiment", "fry", "carrot"]},
    {w:"fry",m:"\uae30\ub984\uc5d0 \ud280\uae30\ub2e4",def:"to cook in oil",unit:12,opts:["proud", "pot", "mix", "fry"]},
    {w:"ground",m:"\ub545",def:"the land under your feet",unit:12,opts:["mark", "experiment", "ground", "fry"]},
    {w:"kill",m:"\uc8fd\uc774\ub2e4",def:"to end a life",unit:12,opts:["kill", "soil", "possible", "fry"]},
    {w:"mix",m:"\uc11e\ub2e4",def:"to put two or more things together",unit:12,opts:["mark", "mix", "kill", "fry"]},
    {w:"possible",m:"\uac00\ub2a5\ud55c",def:"able to be done",unit:12,opts:["cause", "possible", "mark", "taste"]},
    {w:"pot",m:"\ub0c4\ube44",def:"a deep, round container used for cooking",unit:12,opts:["pot", "list", "mix", "taste"]},
    {w:"proud",m:"\uc790\ub791\uc2a4\ub7ec\uc6cc\ud558\ub294",def:"feeling good about something done",unit:12,opts:["share", "main", "proud", "ground"]},
    {w:"lay",m:"\ub193\ub2e4",def:"to put something down carefully",unit:12,opts:["proud", "lay", "mix", "several"]},
    {w:"list",m:"\ubaa9\ub85d",def:"a number of items that are needed",unit:12,opts:["mistake", "fry", "soil", "list"]},
    {w:"main",m:"\uc8fc\uc694\ud55c",def:"most important",unit:12,opts:["main", "mark", "proud", "lay"]},
    {w:"mark",m:"\ud45c\uc2dc",def:"a symbol or shape drawn on something",unit:12,opts:["main", "proud", "mark", "ground"]},
    {w:"mistake",m:"\uc2e4\uc218",def:"something that is not correct",unit:12,opts:["taste", "list", "pot", "mistake"]},
    {w:"price",m:"\uac00\uaca9",def:"the amount that something costs",unit:12,opts:["mistake", "main", "proud", "price"]},
    {w:"several",m:"\uc5ec\ub7ec \uac1c\uc758",def:"more than two but not many",unit:12,opts:["mark", "share", "ground", "several"]},
    {w:"share",m:"\ud568\uaed8 \uc4f0\ub2e4",def:"to allow someone to use or enjoy something of yours",unit:12,opts:["taste", "kill", "fry", "share"]},
    {w:"soil",m:"\ud1a0\uc591",def:"dirt",unit:12,opts:["proud", "soil", "pot", "share"]},
    {w:"taste",m:"\ub9db\ubcf4\ub2e4",def:"to get the flavor of food in the mouth",unit:12,opts:["cause", "share", "proud", "taste"]},
  ],
  "bew4_1": [
    {w:"awful",m:"\uc9c0\ub3c5\ud55c",def:"very bad",unit:1,opts:["awful", "tough", "pour", "chance"]},
    {w:"crazy",m:"\uc815\uc0c1\uc774 \uc544\ub2cc",def:"very strange",unit:1,opts:["search", "mention", "crazy", "score"]},
    {w:"huge",m:"\uac70\ub300\ud55c",def:"very large",unit:1,opts:["regret", "tough", "huge", "thief"]},
    {w:"moment",m:"\uc7a0\uc2dc",def:"a short period of time",unit:1,opts:["hall", "score", "tough", "moment"]},
    {w:"odd",m:"\uc774\uc0c1\ud55c",def:"strange or different",unit:1,opts:["odd", "immediately", "intend", "awful"]},
    {w:"pour",m:"\ubd93\ub2e4",def:"to fill a container with something to drink",unit:1,opts:["regret", "pour", "score", "tough"]},
    {w:"regret",m:"\ud6c4\ud68c\ud558\ub2e4",def:"to feel sorry about something that you did or did not do",unit:1,opts:["regret", "mention", "extra", "score"]},
    {w:"steal",m:"\ud6d4\uce58\ub2e4",def:"to take something without someone saying you can",unit:1,opts:["score", "worse", "steal", "hall"]},
    {w:"thief",m:"\ub3c4\ub451",def:"someone who steals",unit:1,opts:["thief", "tough", "extra", "score"]},
    {w:"tough",m:"\uac15\uc778\ud55c",def:"strong",unit:1,opts:["tough", "search", "intend", "odd"]},
    {w:"chance",m:"\uae30\ud68c",def:"an opportunity to do something",unit:1,opts:["crazy", "mention", "chance", "intend"]},
    {w:"extra",m:"\ucd94\uac00\uc758",def:"more than is usual",unit:1,opts:["intend", "odd", "extra", "regret"]},
    {w:"hall",m:"\uac15\ub2f9",def:"a large open space in a building",unit:1,opts:["steal", "immediately", "hall", "awful"]},
    {w:"immediately",m:"\uc989\uc2dc",def:"right away",unit:1,opts:["immediately", "hall", "mention", "moment"]},
    {w:"intend",m:"\uc791\uc815\ud558\ub2e4",def:"to want or plan to do",unit:1,opts:["intend", "score", "search", "thief"]},
    {w:"mention",m:"\uc5b8\uae09\ud558\ub2e4",def:"to talk or write about something, often quickly",unit:1,opts:["crazy", "mention", "search", "moment"]},
    {w:"reaction",m:"\ubc18\uc751",def:"the way someone acts or feels after something happens",unit:1,opts:["reaction", "hall", "tough", "immediately"]},
    {w:"score",m:"\ub4dd\uc810\uc744 \uae30\ub85d\ud558\ub2e4",def:"to win a point in a game",unit:1,opts:["immediately", "score", "worse", "odd"]},
    {w:"search",m:"\uc218\uc0c9\ud558\ub2e4",def:"to look for",unit:1,opts:["immediately", "awful", "worse", "search"]},
    {w:"worse",m:"\ub354 \uc548 \uc88b\uc740",def:"more terrible than other things",unit:1,opts:["reaction", "worse", "pour", "immediately"]},
  ],
  "bew4_2": [
    {w:"bit",m:"\uc791\uc740 \uc870\uac01",def:"a small piece or amount",unit:2,opts:["physical", "produce", "limit", "bit"]},
    {w:"common",m:"\ud754\ud55c",def:"usual; happening or seen often",unit:2,opts:["amount", "common", "necessary", "bit"]},
    {w:"diet",m:"\uc2dd\uc0ac",def:"the food that someone usually eats",unit:2,opts:["reduce", "produce", "medical", "diet"]},
    {w:"evidence",m:"\uc99d\uac70",def:"something that shows something else is true",unit:2,opts:["sale", "limit", "evidence", "reduce"]},
    {w:"fit",m:"\uac74\uac15\ud55c",def:"strong and healthy",unit:2,opts:["type", "necessary", "sale", "fit"]},
    {w:"limit",m:"\uc81c\ud55c\ud558\ub2e4",def:"to keep at a low level or keep from getting larger",unit:2,opts:["physical", "limit", "cure", "produce"]},
    {w:"physical",m:"\uc2e0\uccb4\uc758",def:"of the body",unit:2,opts:["amount", "sale", "cure", "physical"]},
    {w:"poison",m:"\ub3c5\uc57d",def:"something that can make you sick if eaten or drunk",unit:2,opts:["type", "poison", "supply", "serious"]},
    {w:"sale",m:"\ud310\ub9e4",def:"the act of selling something for money",unit:2,opts:["amount", "source", "sale", "supply"]},
    {w:"type",m:"\uc885\ub958",def:"a kind or variety",unit:2,opts:["produce", "type", "amount", "bit"]},
    {w:"amount",m:"\uc591",def:"how much there is of something",unit:2,opts:["diet", "amount", "disease", "limit"]},
    {w:"cure",m:"\uce58\uc720\ubc95",def:"something that makes sick people better",unit:2,opts:["produce", "reduce", "limit", "cure"]},
    {w:"disease",m:"\uc9c8\ubcd1",def:"a sickness",unit:2,opts:["disease", "medical", "evidence", "limit"]},
    {w:"medical",m:"\uc758\ud559\uc801\uc778",def:"of medicine; treating people who are sick or hurt",unit:2,opts:["common", "disease", "poison", "medical"]},
    {w:"necessary",m:"\ud544\uc218\uc801\uc778",def:"needed",unit:2,opts:["necessary", "limit", "medical", "type"]},
    {w:"produce",m:"\uc0dd\uc0b0\ud558\ub2e4",def:"to make or cause",unit:2,opts:["evidence", "poison", "bit", "produce"]},
    {w:"reduce",m:"\ub0ae\ucd94\ub2e4",def:"to make smaller in size, number, or amount",unit:2,opts:["reduce", "produce", "sale", "cure"]},
    {w:"serious",m:"\uc2ec\uac01\ud55c",def:"having important or dangerous possible results",unit:2,opts:["produce", "serious", "poison", "fit"]},
    {w:"source",m:"\uc6d0\ucc9c",def:"a person or thing that gives what is wanted or needed",unit:2,opts:["necessary", "source", "amount", "bit"]},
    {w:"supply",m:"\uc81c\uacf5\ud558\ub2e4",def:"to give someone something so they can use it",unit:2,opts:["sale", "supply", "necessary", "cure"]},
  ],
  "bew4_3": [
    {w:"castle",m:"\uc131",def:"a large home where a king or queen usually lives",unit:3,opts:["guard", "flight", "castle", "respect"]},
    {w:"decision",m:"\uacb0\uc815",def:"a choice",unit:3,opts:["castle", "decision", "incredible", "wave"]},
    {w:"empire",m:"\uc81c\uad6d",def:"a kingdom",unit:3,opts:["flight", "admire", "serve", "empire"]},
    {w:"explore",m:"\ud0d0\ud5d8\ud558\ub2e4",def:"to look at something in a careful way to learn about it",unit:3,opts:["incredible", "ancient", "southern", "explore"]},
    {w:"flight",m:"\ube44\ud589",def:"a trip on an airplane",unit:3,opts:["skin", "southern", "flight", "wave"]},
    {w:"guard",m:"\uc9c0\ud0a4\ub2e4",def:"to watch in order to protect",unit:3,opts:["incredible", "guard", "prefer", "decision"]},
    {w:"incredible",m:"\ubbff\uc5b4\uc9c0\uc9c0 \uc54a\uc744 \uc815\ub3c4\ub85c \uc88b\uc740",def:"very good",unit:3,opts:["skin", "decision", "pack", "incredible"]},
    {w:"serve",m:"\uc81c\uacf5\ud558\ub2e4",def:"to give someone food in a restaurant or at home",unit:3,opts:["giant", "serve", "decision", "castle"]},
    {w:"skin",m:"\ud53c\ubd80",def:"the outer part that covers humans and animals",unit:3,opts:["skin", "wave", "ancient", "guard"]},
    {w:"southern",m:"\ub0a8\ucabd\uc758",def:"being in or toward the south",unit:3,opts:["castle", "southern", "flight", "pack"]},
    {w:"admire",m:"\uc874\uacbd\ud558\ub2e4",def:"to like and think good things about others",unit:3,opts:["ancient", "skin", "admire", "respect"]},
    {w:"ancient",m:"\uace0\ub300\uc758",def:"very old",unit:3,opts:["wave", "ancient", "view", "rent"]},
    {w:"attractive",m:"\uba4b\uc9c4",def:"looking or sounding nice",unit:3,opts:["flight", "southern", "incredible", "attractive"]},
    {w:"giant",m:"\uac70\ub300\ud55c",def:"very large",unit:3,opts:["explore", "rent", "flight", "giant"]},
    {w:"pack",m:"\uc9d0\uc744 \uc2f8\ub2e4",def:"to put items into a bag or suitcase to take somewhere",unit:3,opts:["pack", "ancient", "rent", "wave"]},
    {w:"prefer",m:"\uc120\ud638\ud558\ub2e4",def:"to like something more than something else",unit:3,opts:["guard", "prefer", "pack", "decision"]},
    {w:"rent",m:"\uc784\ub300\ud558\ub2e4",def:"to pay money to use a thing that belongs to someone else",unit:3,opts:["rent", "flight", "wave", "southern"]},
    {w:"respect",m:"\uc874\uc911\ud558\ub2e4",def:"to think someone is special and important",unit:3,opts:["view", "respect", "attractive", "pack"]},
    {w:"view",m:"\ubcf4\ub2e4",def:"to look at or watch something",unit:3,opts:["skin", "empire", "view", "flight"]},
    {w:"wave",m:"\uc190\uc744 \ud754\ub4e4\ub2e4",def:"to move your hand to say hello or goodbye",unit:3,opts:["wave", "giant", "explore", "prefer"]},
  ],
  "bew4_4": [
    {w:"base",m:"\uae30\ubc18\uc744 \ub450\ub2e4",def:"to use as the starting point for something",unit:4,opts:["regularly", "base", "enemy", "female"]},
    {w:"character",m:"\ub4f1\uc7a5\uc778\ubb3c",def:"a person in a book or movie",unit:4,opts:["enemy", "length", "character", "opinion"]},
    {w:"clever",m:"\uc601\ub9ac\ud55c",def:"very smart",unit:4,opts:["regularly", "length", "clever", "female"]},
    {w:"enemy",m:"\uc801",def:"someone who hates you",unit:4,opts:["enemy", "clever", "desert", "flow"]},
    {w:"length",m:"\uae38\uc774",def:"how long something is from one end to the other",unit:4,opts:["regularly", "length", "flow", "survive"]},
    {w:"promise",m:"\uc57d\uc18d\ud558\ub2e4",def:"to tell someone that you will do something for sure",unit:4,opts:["promise", "title", "adult", "mystery"]},
    {w:"quality",m:"\uc9c8",def:"how good or bad something is",unit:4,opts:["base", "quality", "clever", "length"]},
    {w:"regularly",m:"\uc790\uc8fc",def:"often",unit:4,opts:["length", "enemy", "regularly", "publish"]},
    {w:"survive",m:"\uc0b4\uc544\ub0a8\ub2e4",def:"to stay alive",unit:4,opts:["pleasure", "survive", "flow", "quality"]},
    {w:"title",m:"\uc81c\ubaa9",def:"a name of something like a book or movie",unit:4,opts:["title", "length", "base", "regularly"]},
    {w:"adult",m:"\uc5b4\ub978",def:"someone who is fully grown",unit:4,opts:["female", "character", "adult", "flow"]},
    {w:"classic",m:"\uace0\uc804\uc801\uc778",def:"of good quality and popular for a long time",unit:4,opts:["quality", "adult", "female", "classic"]},
    {w:"desert",m:"\ubc84\ub9ac\ub2e4",def:"to leave a place so it is empty",unit:4,opts:["flow", "desert", "publish", "clever"]},
    {w:"discover",m:"\ubc1c\uacac\ud558\ub2e4",def:"to find",unit:4,opts:["survive", "discover", "enemy", "title"]},
    {w:"female",m:"\uc5ec\uc131\uc758",def:"being a girl or woman",unit:4,opts:["character", "discover", "female", "adult"]},
    {w:"flow",m:"\ud750\ub974\ub2e4",def:"to move like water",unit:4,opts:["length", "flow", "adult", "character"]},
    {w:"mystery",m:"\uc218\uc218\uaed8\ub07c",def:"something strange and not understood",unit:4,opts:["mystery", "regularly", "clever", "length"]},
    {w:"opinion",m:"\uc758\uacac",def:"a belief about something",unit:4,opts:["opinion", "length", "promise", "pleasure"]},
    {w:"pleasure",m:"\uae30\uc068",def:"a feeling of happiness",unit:4,opts:["base", "pleasure", "flow", "publish"]},
    {w:"publish",m:"\ucd9c\ud310\ud558\ub2e4",def:"to make books or magazines for sale",unit:4,opts:["length", "regularly", "publish", "flow"]},
  ],
  "bew4_5": [
    {w:"cough",m:"\uae30\uce68\ud558\ub2e4",def:"to force air out through your throat, often when sick",unit:5,opts:["cough", "smoke", "edge", "machine"]},
    {w:"crowd",m:"\uad70\uc911",def:"a large group of people",unit:5,opts:["crowd", "expect", "guide", "wheel"]},
    {w:"curious",m:"\ud638\uae30\uc2ec\uc774 \ub9ce\uc740",def:"wanting to know about something",unit:5,opts:["western", "expect", "curious", "explain"]},
    {w:"disappear",m:"\uc0ac\ub77c\uc9c0\ub2e4",def:"not to be seen or found",unit:5,opts:["machine", "strength", "disappear", "rub"]},
    {w:"edge",m:"\uac00\uc7a5\uc790\ub9ac",def:"the part of something where it ends or starts",unit:5,opts:["native", "western", "edge", "avenue"]},
    {w:"guide",m:"\uc5ec\ud589 \uc548\ub0b4\uc778",def:"someone who directs others on a trip",unit:5,opts:["guide", "western", "shine", "avenue"]},
    {w:"local",m:"\ud604\uc9c0\uc758",def:"from the place where you live",unit:5,opts:["local", "tour", "strength", "cough"]},
    {w:"machine",m:"\uae30\uacc4",def:"something that does work using moving parts",unit:5,opts:["local", "machine", "strength", "western"]},
    {w:"native",m:"\ud1a0\ubc15\uc774",def:"a person who was born or grew up in a certain place",unit:5,opts:["western", "explain", "curious", "native"]},
    {w:"smoke",m:"\uc5f0\uae30",def:"the cloud of gases that is made by fire",unit:5,opts:["disappear", "avenue", "western", "smoke"]},
    {w:"avenue",m:"\ub300\ub85c",def:"a wide street",unit:5,opts:["expect", "strength", "smoke", "avenue"]},
    {w:"expect",m:"\uc608\uc0c1\ud558\ub2e4",def:"to think something is likely to happen",unit:5,opts:["avenue", "cough", "guide", "expect"]},
    {w:"explain",m:"\uc124\uba85\ud558\ub2e4",def:"to make something easy to understand",unit:5,opts:["edge", "smoke", "explain", "cough"]},
    {w:"rub",m:"\ubb38\uc9c0\ub974\ub2e4",def:"to press with the fingers and move them from side to side",unit:5,opts:["rub", "strength", "native", "cough"]},
    {w:"shine",m:"\ube5b\ub098\ub2e4",def:"to produce bright light",unit:5,opts:["curious", "disappear", "rub", "shine"]},
    {w:"strength",m:"\ud798",def:"great physical power",unit:5,opts:["explain", "expect", "suggest", "strength"]},
    {w:"suggest",m:"\uc81c\uc548\ud558\ub2e4",def:"to say that something is good or a good idea",unit:5,opts:["local", "crowd", "disappear", "suggest"]},
    {w:"tour",m:"\uc5ec\ud589",def:"a journey to see several places",unit:5,opts:["cough", "tour", "guide", "disappear"]},
    {w:"western",m:"\uc11c\ucabd\uc758",def:"of or from the west",unit:5,opts:["strength", "western", "local", "wheel"]},
    {w:"wheel",m:"\ubc14\ud034",def:"something round which moves by turning",unit:5,opts:["native", "crowd", "explain", "wheel"]},
  ],
  "bew4_6": [
    {w:"cloth",m:"\uc637",def:"something used to make clothes",unit:6,opts:["fail", "cloth", "equal", "wrap"]},
    {w:"equal",m:"\uac19\uc740",def:"of the same size or number",unit:6,opts:["pattern", "equal", "penny", "fail"]},
    {w:"fail",m:"\uc2e4\ud328\ud558\ub2e4",def:"not to succeed",unit:6,opts:["pattern", "false", "wrap", "fail"]},
    {w:"false",m:"\uc0ac\uc2e4\uc774 \uc544\ub2cc",def:"not true",unit:6,opts:["increase", "avoid", "false", "wrap"]},
    {w:"goods",m:"\uc0c1\ud488",def:"things which are made and sold",unit:6,opts:["fail", "avoid", "medium", "goods"]},
    {w:"increase",m:"\uc99d\uac00\ud558\ub2e4",def:"to make bigger or more",unit:6,opts:["customer", "destroy", "separate", "increase"]},
    {w:"penny",m:"\ud398\ub2c8",def:"a coin equal to one cent in the US",unit:6,opts:["cloth", "penny", "equal", "trick"]},
    {w:"separate",m:"\ubd84\ub9ac\ud558\ub2e4",def:"not to be joined",unit:6,opts:["separate", "increase", "cloth", "total"]},
    {w:"total",m:"\uc804\uccb4",def:"the number of everything counted",unit:6,opts:["disappointed", "total", "avoid", "pattern"]},
    {w:"wrap",m:"\ud3ec\uc7a5\ud558\ub2e4",def:"to cover with something",unit:6,opts:["trick", "wrap", "penny", "pattern"]},
    {w:"appreciate",m:"\uc778\uc815\ud558\ub2e4",def:"to understand the importance of a person or thing",unit:6,opts:["wrap", "appreciate", "goods", "avoid"]},
    {w:"avoid",m:"\ud53c\ud558\ub2e4",def:"to stay away from",unit:6,opts:["equal", "trick", "fail", "avoid"]},
    {w:"convenient",m:"\ud3b8\ub9ac\ud55c",def:"easy to do and time-saving",unit:6,opts:["separate", "penny", "convenient", "avoid"]},
    {w:"customer",m:"\uace0\uac1d",def:"someone who buys goods or services from a store",unit:6,opts:["destroy", "disappointed", "penny", "customer"]},
    {w:"destroy",m:"\ud30c\uad34\ud558\ub2e4",def:"to cause something to end or not be of use anymore",unit:6,opts:["increase", "customer", "false", "destroy"]},
    {w:"disappointed",m:"\uc2e4\ub9dd\ud55c",def:"unhappy because something is not as you expected",unit:6,opts:["false", "pattern", "disappointed", "goods"]},
    {w:"medium",m:"\uc911\uac04\uc758",def:"of a size between big and small",unit:6,opts:["appreciate", "destroy", "penny", "medium"]},
    {w:"pattern",m:"\ubb34\ub2ac",def:"colors or shapes which are repeated on something",unit:6,opts:["separate", "pattern", "equal", "disappointed"]},
    {w:"trick",m:"\uc18d\uc774\ub2e4",def:"to make someone believe something that is not true",unit:6,opts:["destroy", "equal", "pattern", "trick"]},
    {w:"value",m:"\uac00\uce58",def:"how much something costs",unit:6,opts:["value", "fail", "penny", "false"]},
  ],
  "bew4_7": [
    {w:"beat",m:"\uc774\uae30\ub2e4",def:"to win a game or contest over someone else",unit:7,opts:["conduct", "wing", "confident", "beat"]},
    {w:"conduct",m:"\ud558\ub2e4",def:"to organize and do an event or activity",unit:7,opts:["conduct", "challenge", "beat", "noon"]},
    {w:"confident",m:"\uc790\uc2e0\uac10 \uc788\ub294",def:"believing that you are able to do something well",unit:7,opts:["speed", "noon", "muscle", "confident"]},
    {w:"lead",m:"\uc548\ub0b4\ud558\ub2e4",def:"to show people the way to go",unit:7,opts:["position", "lead", "conduct", "challenge"]},
    {w:"lift",m:"\uc62c\ub9ac\ub2e4",def:"to move to a higher place",unit:7,opts:["speed", "muscle", "skill", "lift"]},
    {w:"male",m:"\ub0a8\uc131\uc758",def:"being a man or boy",unit:7,opts:["speed", "male", "position", "beat"]},
    {w:"muscle",m:"\uadfc\uc721",def:"a body part that works to move arms and legs",unit:7,opts:["trouble", "beat", "record", "muscle"]},
    {w:"speed",m:"\uc18d\ub3c4",def:"how fast something moves",unit:7,opts:["lift", "speed", "skill", "noon"]},
    {w:"stretch",m:"\ub298\ub9ac\ub2e4",def:"to pull or move until tight",unit:7,opts:["lift", "position", "male", "stretch"]},
    {w:"trouble",m:"\ubb38\uc81c",def:"a problem or difficulty",unit:7,opts:["trouble", "wing", "skill", "lift"]},
    {w:"captain",m:"\uc8fc\uc7a5",def:"a person who is the leader of a team",unit:7,opts:["lift", "lead", "captain", "conduct"]},
    {w:"challenge",m:"\ub3c4\uc804",def:"something that is difficult to do",unit:7,opts:["wing", "encourage", "skill", "challenge"]},
    {w:"complete",m:"\uc644\uc131\ud558\ub2e4",def:"to finish something",unit:7,opts:["noon", "complete", "conduct", "challenge"]},
    {w:"encourage",m:"\uaca9\ub824\ud558\ub2e4",def:"to help someone feel confident",unit:7,opts:["race", "encourage", "trouble", "skill"]},
    {w:"noon",m:"\uc815\uc624",def:"12 o\u2019clock in the daytime",unit:7,opts:["noon", "race", "stretch", "record"]},
    {w:"position",m:"\uc704\uce58",def:"the place where a person or thing is",unit:7,opts:["lift", "position", "skill", "trouble"]},
    {w:"race",m:"\uacbd\uc8fc",def:"a contest to decide who is the fastest",unit:7,opts:["race", "encourage", "complete", "challenge"]},
    {w:"record",m:"\uae30\ub85d",def:"the highest or best result ever in an activity",unit:7,opts:["trouble", "captain", "record", "speed"]},
    {w:"skill",m:"\uae30\uc220",def:"the ability to do something well",unit:7,opts:["confident", "challenge", "record", "skill"]},
    {w:"wing",m:"\ub0a0\uac1c",def:"one of the body parts that birds and insects use to fly",unit:7,opts:["record", "lift", "wing", "encourage"]},
  ],
  "bew4_8": [
    {w:"certain",m:"\ud655\uc2e0\ud558\ub294",def:"believing something strongly",unit:8,opts:["section", "major", "certain", "gather"]},
    {w:"discuss",m:"\ud1a0\ub860\ud558\ub2e4",def:"to talk with someone about something",unit:8,opts:["discuss", "career", "certain", "attack"]},
    {w:"edit",m:"\ud3b8\uc9d1\ud558\ub2e4",def:"to look at something carefully and correct any mistakes",unit:8,opts:["handle", "edit", "screen", "material"]},
    {w:"gather",m:"\ubaa8\uc774\ub2e4",def:"to bring things or people together",unit:8,opts:["positive", "attack", "gather", "handle"]},
    {w:"image",m:"\uc774\ubbf8\uc9c0",def:"a picture",unit:8,opts:["major", "image", "career", "connect"]},
    {w:"material",m:"\uc7ac\ub8cc",def:"something needed to do an activity",unit:8,opts:["material", "positive", "career", "provide"]},
    {w:"positive",m:"\uae0d\uc815\uc801\uc778",def:"thinking good things",unit:8,opts:["screen", "handle", "image", "positive"]},
    {w:"role",m:"\uc5ed\ud560",def:"a part or job someone has in an activity or event",unit:8,opts:["screen", "image", "role", "technology"]},
    {w:"screen",m:"\ud654\uba74",def:"the part of a computer that shows images and words",unit:8,opts:["image", "gather", "screen", "discuss"]},
    {w:"technology",m:"\uacfc\ud559 \uae30\uc220",def:"any type of useful machine invented by science",unit:8,opts:["provide", "connect", "career", "technology"]},
    {w:"attack",m:"\uacf5\uaca9\ud558\ub2e4",def:"to try to hurt physically or say hurtful things",unit:8,opts:["dictionary", "positive", "attack", "gather"]},
    {w:"available",m:"\uc774\uc6a9 \uac00\ub2a5\ud55c",def:"able to be used",unit:8,opts:["available", "career", "positive", "technology"]},
    {w:"career",m:"\uc9c1\uc5c5",def:"what a person does for his or her job",unit:8,opts:["career", "role", "technology", "material"]},
    {w:"connect",m:"\uc5f0\uacb0\ud558\ub2e4",def:"to join something with something else",unit:8,opts:["connect", "edit", "site", "material"]},
    {w:"dictionary",m:"\uc0ac\uc804",def:"a book that gives definitions of words",unit:8,opts:["positive", "material", "dictionary", "discuss"]},
    {w:"handle",m:"\ub2e4\ub8e8\ub2e4",def:"to deal with a person or thing",unit:8,opts:["handle", "connect", "site", "provide"]},
    {w:"major",m:"\uc2ec\uac01\ud55c",def:"very important; very serious",unit:8,opts:["career", "discuss", "major", "certain"]},
    {w:"provide",m:"\uc81c\uacf5\ud558\ub2e4",def:"to offer or give",unit:8,opts:["provide", "career", "handle", "screen"]},
    {w:"section",m:"\uad6c\uc5ed",def:"a part of something",unit:8,opts:["image", "gather", "role", "section"]},
    {w:"site",m:"\uc7a5\uc18c, \uc0ac\uc774\ud2b8 (\uc778\ud130\ub137)",def:"a spot or place, usually on the Internet",unit:8,opts:["dictionary", "discuss", "screen", "site"]},
  ],
  "bew4_9": [
    {w:"accept",m:"\ubc1b\ub2e4",def:"to take or receive",unit:9,opts:["root", "society", "host", "accept"]},
    {w:"consider",m:"\uace0\ub824\ud558\ub2e4",def:"to think about carefully",unit:9,opts:["fortune", "guest", "consider", "society"]},
    {w:"exist",m:"\uc874\uc7ac\ud558\ub2e4",def:"to be",unit:9,opts:["original", "trust", "wealthy", "exist"]},
    {w:"familiar",m:"\ub0af\uc775\uc740",def:"commonly known or seen",unit:9,opts:["wealthy", "consider", "familiar", "band"]},
    {w:"joy",m:"\uc990\uac70\uc6c0",def:"great happiness",unit:9,opts:["trust", "joy", "band", "familiar"]},
    {w:"married",m:"\uacb0\ud63c\ud55c",def:"being a husband or wife",unit:9,opts:["society", "poem", "married", "fortune"]},
    {w:"rather",m:"\ucc28\ub77c\ub9ac",def:"used to say what you prefer to do or have",unit:9,opts:["guest", "root", "rather", "original"]},
    {w:"represent",m:"\ub098\ud0c0\ub0b4\ub2e4",def:"to be a symbol for something",unit:9,opts:["rather", "sense", "represent", "society"]},
    {w:"root",m:"\uc6d0\uc778",def:"the cause of something",unit:9,opts:["root", "trust", "society", "wealthy"]},
    {w:"society",m:"\uc0ac\ud68c",def:"a group of people living in a community",unit:9,opts:["trust", "root", "society", "sense"]},
    {w:"band",m:"\uc545\ub2e8",def:"a group that plays music",unit:9,opts:["fortune", "represent", "band", "accept"]},
    {w:"fortune",m:"\uc7ac\uc0b0",def:"a large amount of money",unit:9,opts:["fortune", "rather", "trust", "society"]},
    {w:"guest",m:"\uc190\ub2d8",def:"a person who spends time at another\u2019s home",unit:9,opts:["society", "rather", "trust", "guest"]},
    {w:"host",m:"\uc8fc\uc778",def:"a person who accepts guests into a home or restaurant",unit:9,opts:["peace", "host", "rather", "guest"]},
    {w:"original",m:"\ub3c5\ucc3d\uc801\uc778",def:"made or produced for the first time; new",unit:9,opts:["exist", "familiar", "fortune", "original"]},
    {w:"peace",m:"\ud3c9\ud654",def:"when people live together well and do not cause trouble",unit:9,opts:["familiar", "sense", "host", "peace"]},
    {w:"poem",m:"\uc2dc",def:"a type of writing which often uses rhymes like make and bake",unit:9,opts:["poem", "fortune", "married", "trust"]},
    {w:"sense",m:"\ub290\ub07c\ub2e4",def:"to know something without having evidence that it is true",unit:9,opts:["guest", "wealthy", "sense", "peace"]},
    {w:"trust",m:"\ubbff\ub2e4",def:"to have confidence in a person or thing",unit:9,opts:["exist", "sense", "trust", "married"]},
    {w:"wealthy",m:"\ubd80\uc720\ud55c",def:"having a large amount of money",unit:9,opts:["host", "poem", "wealthy", "rather"]},
  ],
  "bew4_10": [
    {w:"blood",m:"\ud53c",def:"the red liquid in your body",unit:10,opts:["electronic", "warn", "shoot", "blood"]},
    {w:"business",m:"\uc0ac\uc5c5",def:"something that makes money by selling goods or services",unit:10,opts:["achieve", "signal", "teenager", "business"]},
    {w:"electronic",m:"\uc804\uc790\uc758",def:"relating to things that use electricity",unit:10,opts:["influence", "electronic", "master", "similar"]},
    {w:"influence",m:"\uc601\ud5a5",def:"the power to affect a person or thing",unit:10,opts:["business", "electronic", "beg", "influence"]},
    {w:"master",m:"\uc219\ub2ec\ud558\ub2e4",def:"to become very skilled at something",unit:10,opts:["improve", "warn", "war", "master"]},
    {w:"pity",m:"\uc720\uac10",def:"feeling sorry for another person or animal",unit:10,opts:["pity", "debate", "teenager", "control"]},
    {w:"press",m:"\uc5b8\ub860",def:"all the people and groups who provide the news",unit:10,opts:["press", "beg", "shoot", "electronic"]},
    {w:"shoot",m:"\uc3d8\ub2e4",def:"to make one thing come out of another at a fast speed",unit:10,opts:["signal", "business", "electronic", "shoot"]},
    {w:"signal",m:"\uc2e0\ud638\ub97c \ubcf4\ub0b4\ub2e4",def:"to communicate by making a sign or sound",unit:10,opts:["debate", "signal", "control", "press"]},
    {w:"teenager",m:"\uc2ed\ub300",def:"a person between the ages of thirteen and nineteen",unit:10,opts:["pity", "teenager", "soldier", "similar"]},
    {w:"achieve",m:"\ub2ec\uc131\ud558\ub2e4",def:"to get something by working hard",unit:10,opts:["electronic", "achieve", "business", "beg"]},
    {w:"beg",m:"\uc560\uc6d0\ud558\ub2e4",def:"to ask for something again and again",unit:10,opts:["signal", "master", "electronic", "beg"]},
    {w:"control",m:"\uc9c0\ubc30\ud558\ub2e4",def:"to be in charge of a person or thing",unit:10,opts:["control", "teenager", "similar", "debate"]},
    {w:"debate",m:"\ud1a0\ub860\ud558\ub2e4",def:"to exchange opinions about a topic",unit:10,opts:["signal", "debate", "achieve", "similar"]},
    {w:"improve",m:"\ud5a5\uc0c1\uc2dc\ud0a4\ub2e4",def:"to get better at something",unit:10,opts:["warn", "master", "improve", "press"]},
    {w:"similar",m:"\ube44\uc2b7\ud55c",def:"almost the same",unit:10,opts:["control", "shoot", "similar", "soldier"]},
    {w:"soldier",m:"\uad70\uc778",def:"a person who trains to fight for his or her country",unit:10,opts:["soldier", "signal", "achieve", "beg"]},
    {w:"system",m:"\uccb4\uc81c",def:"a group of parts that move or work together",unit:10,opts:["shoot", "influence", "achieve", "system"]},
    {w:"war",m:"\uc804\uc7c1",def:"fighting between two countries or groups",unit:10,opts:["war", "influence", "business", "debate"]},
    {w:"warn",m:"\uacbd\uace0\ud558\ub2e4",def:"to tell someone to be careful",unit:10,opts:["soldier", "electronic", "business", "warn"]},
  ],
  "bew4_11": [
    {w:"announce",m:"\uc54c\ub9ac\ub2e4",def:"to make something known to many people",unit:11,opts:["sheet", "respond", "proper", "announce"]},
    {w:"bottom",m:"\ubc14\ub2e5",def:"the lowest point of something",unit:11,opts:["bottom", "exhibit", "spell", "structure"]},
    {w:"compete",m:"\uacbd\uc7c1\ud558\ub2e4",def:"to try to be better or faster than another",unit:11,opts:["spell", "compete", "announce", "prize"]},
    {w:"copy",m:"\ubcf5\uc0ac\ud558\ub2e4",def:"to make or do the same thing as something else",unit:11,opts:["exhibit", "copy", "project", "state"]},
    {w:"exhibit",m:"\uc804\uc2dc\ud488",def:"something shown in a museum or for an event",unit:11,opts:["compete", "exhibit", "respond", "sheet"]},
    {w:"print",m:"\uc778\uc1c4\ud558\ub2e4",def:"to produce words or images on paper using a machine",unit:11,opts:["bottom", "print", "compete", "select"]},
    {w:"project",m:"\ud504\ub85c\uc81d\ud2b8",def:"a planned piece of work that takes time to finish",unit:11,opts:["project", "spell", "exhibit", "state"]},
    {w:"proper",m:"\uc801\uc808\ud55c",def:"correct or right",unit:11,opts:["structure", "proper", "maximum", "sheet"]},
    {w:"select",m:"\uace0\ub974\ub2e4",def:"to choose",unit:11,opts:["concentrate", "select", "print", "research"]},
    {w:"sheet",m:"\uc885\uc774 \ud55c \uc7a5",def:"a piece of flat material like paper",unit:11,opts:["project", "copy", "compete", "sheet"]},
    {w:"concentrate",m:"\uc9d1\uc911\ud558\ub2e4",def:"to put all your energy on one thing",unit:11,opts:["select", "concentrate", "prize", "bottom"]},
    {w:"maximum",m:"\ucd5c\ub300\uc758",def:"greatest possible",unit:11,opts:["structure", "project", "state", "maximum"]},
    {w:"prize",m:"\uc0c1",def:"something you get for winning",unit:11,opts:["require", "print", "exhibit", "prize"]},
    {w:"require",m:"\ud544\uc694\ub85c \ud558\ub2e4",def:"to have to; to be necessary to do",unit:11,opts:["project", "require", "sheet", "maximum"]},
    {w:"research",m:"\uc5f0\uad6c\ud558\ub2e4",def:"to study something carefully and try to discover new facts",unit:11,opts:["tool", "research", "compete", "prize"]},
    {w:"respond",m:"\ub300\ub2f5\ud558\ub2e4",def:"to answer",unit:11,opts:["respond", "sheet", "concentrate", "copy"]},
    {w:"spell",m:"\ucca0\uc790\ub97c \ub9d0\ud558\ub2e4",def:"to write or say the letters of a word",unit:11,opts:["compete", "require", "spell", "exhibit"]},
    {w:"state",m:"\ub9d0\ud558\ub2e4",def:"to say something",unit:11,opts:["announce", "research", "state", "print"]},
    {w:"structure",m:"\uad6c\uc870\ubb3c",def:"something that is built",unit:11,opts:["prize", "structure", "select", "copy"]},
    {w:"tool",m:"\uc5f0\uc7a5",def:"anything used to do a job",unit:11,opts:["tool", "spell", "prize", "structure"]},
  ],
  "bew4_12": [
    {w:"flood",m:"\ud64d\uc218",def:"a great amount of water over land that is usually dry",unit:12,opts:["waste", "task", "worth", "flood"]},
    {w:"gentle",m:"\uc628\uc21c\ud55c",def:"not mean or unkind",unit:12,opts:["task", "temperature", "gentle", "operate"]},
    {w:"melt",m:"\ub179\ub2e4",def:"to change into liquid",unit:12,opts:["remain", "storm", "task", "melt"]},
    {w:"operate",m:"\uc870\uc791\ud558\ub2e4",def:"to use or make something work",unit:12,opts:["operate", "stream", "temperature", "flood"]},
    {w:"recognize",m:"\uc54c\uc544\ubcf4\ub2e4",def:"to know a person or thing because it is familiar",unit:12,opts:["waste", "gentle", "recognize", "various"]},
    {w:"remain",m:"\ub0a8\uc544 \uc788\ub2e4",def:"to stay in one place",unit:12,opts:["melt", "recently", "remain", "various"]},
    {w:"task",m:"\uc77c",def:"work",unit:12,opts:["responsible", "task", "temperature", "waste"]},
    {w:"various",m:"\ub2e4\uc591\ud55c",def:"of different kinds",unit:12,opts:["factory", "melt", "gentle", "various"]},
    {w:"waste",m:"\ub0ad\ube44\ud558\ub2e4",def:"to use too much of something",unit:12,opts:["task", "waste", "responsible", "operate"]},
    {w:"worth",m:"\uac00\uce58 \uc788\ub294",def:"having a value in money",unit:12,opts:["storm", "worth", "recently", "melt"]},
    {w:"climate",m:"\uae30\ud6c4",def:"the weather of a place",unit:12,opts:["factory", "climate", "freeze", "waste"]},
    {w:"emergency",m:"\ube44\uc0c1\uc0ac\ud0dc",def:"a sudden, serious event when people need help immediately",unit:12,opts:["melt", "emergency", "stream", "freeze"]},
    {w:"factory",m:"\uacf5\uc7a5",def:"a building that produces goods",unit:12,opts:["responsible", "factory", "freeze", "recently"]},
    {w:"freeze",m:"\uc5bc\ub2e4",def:"to turn into ice",unit:12,opts:["storm", "stream", "remain", "freeze"]},
    {w:"population",m:"\uc778\uad6c",def:"the total number of people or animals living in a place",unit:12,opts:["population", "recognize", "worth", "melt"]},
    {w:"recently",m:"\ucd5c\uadfc\uc5d0",def:"not long ago",unit:12,opts:["waste", "recognize", "recently", "task"]},
    {w:"responsible",m:"\ucc45\uc784\uac10 \uc788\ub294",def:"able to act correctly and make good decisions",unit:12,opts:["freeze", "temperature", "responsible", "factory"]},
    {w:"storm",m:"\ud3ed\ud48d\uc6b0",def:"a bad weather event with a lot of rain, wind, or snow",unit:12,opts:["remain", "flood", "recently", "storm"]},
    {w:"stream",m:"\uac1c\uc6b8",def:"a very small river",unit:12,opts:["emergency", "stream", "recently", "climate"]},
    {w:"temperature",m:"\uccb4\uc628",def:"how hot or cold a person or thing is",unit:12,opts:["emergency", "temperature", "operate", "recognize"]},
  ],
};
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  2000 Core English Words (1-4) + 4000 Essential English Words (1-6)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const NEW_BOOKS_DB = {
  "cew1_1": [
    {w:"blood",m:"\ud53c",def:"the red liquid in your body",unit:1,opts:["stomachache", "finger", "pain", "blood"]},
    {w:"ease",m:"\ud3b8\ud558\uac8c \ud574 \uc8fc\ub2e4, (\uace0\ud1b5, \ubd88\ud3b8 \ub4f1\uc744)\ub35c\uc5b4 \uc8fc\ub2e4",def:"to make it hurt less or bother you less",unit:1,opts:["ease", "hurt", "healthy", "medicine"]},
    {w:"stomachache",m:"\uc704\ud1b5, \ubcf5\ud1b5",def:"a pain in a stomach",unit:1,opts:["dentist", "skin", "stomach", "stomachache"]},
    {w:"chin",m:"\ud131",def:"the bottom part of your face, below your mouth",unit:1,opts:["chin", "sick", "toothache", "neck"]},
    {w:"hurt",m:"\ub2e4\uce58\ub2e4, \uc544\ud504\ub2e4",def:"to be in pain",unit:1,opts:["healthy", "dentist", "hurt", "stomachache"]},
    {w:"medicine",m:"\uc57d",def:"something used to help an ill person",unit:1,opts:["stomach", "neck", "medicine", "tooth"]},
    {w:"neck",m:"\ubaa9",def:"the body part between your head and shoulders",unit:1,opts:["toothache", "tooth", "skin", "neck"]},
    {w:"pain",m:"\uc544\ud514",def:"the feeling caused by something that hurts",unit:1,opts:["hurt", "toothache", "skin", "pain"]},
    {w:"skin",m:"\ud53c\ubd80",def:"the outer part of a person\u2019s whole body",unit:1,opts:["skin", "finger", "body", "medicine"]},
    {w:"sick",m:"\uc544\ud508",def:"not feeling well or healthy",unit:1,opts:["sick", "doctor", "healthy", "hurt"]},
    {w:"lips",m:"\uc785\uc220",def:"the two soft parts around your mouth",unit:1,opts:["neck", "toothache", "lips", "tooth"]},
    {w:"body",m:"\ubab8",def:"the whole physical person",unit:1,opts:["toothache", "chin", "finger", "body"]},
    {w:"tooth",m:"\uc774, \uce58\uc544",def:"one of the small hard things inside the mouth",unit:1,opts:["finger", "neck", "hurt", "tooth"]},
    {w:"toothache",m:"\uce58\ud1b5",def:"a pain in a tooth",unit:1,opts:["stomachache", "skin", "toothache", "ease"]},
    {w:"stomach",m:"\uc704, \ubcf5\ubd80, \ubc30",def:"the middle, front part of your body",unit:1,opts:["headache", "dentist", "stomach", "neck"]},
    {w:"headache",m:"\ub450\ud1b5",def:"a pain in a head",unit:1,opts:["medicine", "toothache", "headache", "hurt"]},
    {w:"doctor",m:"\uc758\uc0ac",def:"someone who helps sick people",unit:1,opts:["doctor", "finger", "toothache", "ease"]},
    {w:"healthy",m:"\uac74\uac15\ud55c",def:"strong and well",unit:1,opts:["finger", "medicine", "healthy", "ease"]},
    {w:"dentist",m:"\uce58\uacfc \uc758\uc0ac",def:"a doctor who takes care of teeth",unit:1,opts:["sick", "dentist", "doctor", "chin"]},
    {w:"finger",m:"\uc190\uac00\ub77d",def:"one of the five long, thin parts on your hand",unit:1,opts:["skin", "dentist", "tooth", "finger"]},
  ],
  "cew1_2": [
    {w:"slim",m:"\ub0a0\uc52c\ud55c",def:"being thin",unit:2,opts:["ambulance", "ill", "knee", "slim"]},
    {w:"accident",m:"\uc0ac\uace0",def:"a bad event that was not planned",unit:2,opts:["accident", "bone", "back", "hospital"]},
    {w:"knee",m:"\ubb34\ub98e",def:"the middle part of your leg, where it bends",unit:2,opts:["hospital", "knee", "cheek", "brain"]},
    {w:"health",m:"\uac74\uac15",def:"the condition of your body",unit:2,opts:["health", "accident", "well", "back"]},
    {w:"fat",m:"\ub6b1\ub6b1\ud55c, \uc0b4\ucc10",def:"weighing too much",unit:2,opts:["fat", "ill", "hospital", "fit"]},
    {w:"ill",m:"\uc544\ud508, \ubcd1 \ub4e0",def:"sick or not feeling well",unit:2,opts:["cheek", "safety", "ill", "fit"]},
    {w:"safety",m:"\uc548\uc804",def:"something is safe from danger or harm",unit:2,opts:["safety", "well", "bone", "brain"]},
    {w:"bone",m:"\ubf08",def:"one of the hard parts on the inside of your body",unit:2,opts:["ill", "hospital", "brain", "bone"]},
    {w:"cheek",m:"\ubcfc",def:"the part of your face just below your eyes",unit:2,opts:["accident", "hospital", "cheek", "ambulance"]},
    {w:"nail",m:"\uc190\ud1b1",def:"one of the hard surfaces at the ends of your fingers and toes",unit:2,opts:["nail", "slim", "knee", "fit"]},
    {w:"back",m:"\ub4f1",def:"the part of the body behind your stomach",unit:2,opts:["fat", "well", "toe", "back"]},
    {w:"fit",m:"\uac74\uac15\ud55c",def:"strong and healthy",unit:2,opts:["cheek", "well", "bone", "fit"]},
    {w:"hospital",m:"\ubcd1\uc6d0",def:"a place where sick people get help",unit:2,opts:["fit", "cheek", "nail", "hospital"]},
    {w:"nurse",m:"\uac04\ud638\uc0ac",def:"someone whose job is to care for sick and injured people",unit:2,opts:["cheek", "nurse", "well", "slim"]},
    {w:"well",m:"\uac74\uac15\ud55c, (\uc0c1\ud0dc \ub4f1\uc774) \uc88b\uc740",def:"healthy and not ill",unit:2,opts:["health", "ambulance", "toe", "well"]},
    {w:"brain",m:"\ub1cc",def:"the organ inside your head that lets you think, feel, and move",unit:2,opts:["back", "brain", "toe", "fit"]},
    {w:"toe",m:"\ubc1c\uac00\ub77d",def:"one of the five separate parts at the end of your foot",unit:2,opts:["toe", "cheek", "fat", "nail"]},
    {w:"heart",m:"\uc2ec\uc7a5",def:"the organ in your chest that moves blood",unit:2,opts:["fit", "heart", "ambulance", "slim"]},
    {w:"ambulance",m:"\uad6c\uae09\ucc28",def:"a truck used to take people to the hospital",unit:2,opts:["ambulance", "heart", "back", "toe"]},
  ],
  "cew1_3": [
    {w:"coach",m:"(\uc2a4\ud3ec\uce20 \ud300\uc758) \ucf54\uce58",def:"someone who trains a person or team in a sport",unit:3,opts:["touch", "coach", "meter", "final"]},
    {w:"swing",m:"\uadf8\ub124",def:"a chair hanging on two ropes",unit:3,opts:["prize", "swing", "race", "final"]},
    {w:"net",m:"(\ud14c\ub2c8\uc2a4 \ub4f1\uc5d0\uc11c \uacf5\uc774 \ub118\uc5b4 \ub2e4\ub2c8\ub294) \ub124\ud2b8",def:"the thing that you must hit the ball over",unit:3,opts:["winner", "win", "sled", "net"]},
    {w:"activity",m:"\ud65c\ub3d9",def:"something you do because you enjoy it",unit:3,opts:["snowman", "activity", "net", "snowball"]},
    {w:"move",m:"\uc6c0\uc9c1\uc774\ub2e4",def:"to change from one place or position to another",unit:3,opts:["swing", "winner", "final", "move"]},
    {w:"skate",m:"\uc2a4\ucf00\uc774\ud2b8\ud654",def:"a boot with a steel blade that you wear to move on ice",unit:3,opts:["snowboard", "skate", "winner", "snowman"]},
    {w:"meter",m:"\ubbf8\ud130",def:"a unit of length equal to 100 centimeters",unit:3,opts:["touch", "meter", "skate", "final"]},
    {w:"snowman",m:"\ub208\uc0ac\ub78c",def:"a figure made of snow that looks",unit:3,opts:["snowman", "coach", "snowball", "touch"]},
    {w:"final",m:"\ub9c8\uc9c0\ub9c9\uc758",def:"coming at the end or is the last",unit:3,opts:["coach", "final", "touch", "activity"]},
    {w:"snowball",m:"\ub208 \ubb49\uce58",def:"a ball of snow that someone makes",unit:3,opts:["move", "coach", "net", "snowball"]},
    {w:"snowboard",m:"\uc2a4\ub178\ubcf4\ub4dc",def:"a flat board for riding on snow",unit:3,opts:["snowboard", "sled", "move", "snowball"]},
    {w:"race",m:"\uacbd\uc8fc",def:"a competition to see who is the fastest",unit:3,opts:["race", "win", "net", "swing"]},
    {w:"sled",m:"\uc370\ub9e4",def:"a small vehicle for moving on snow",unit:3,opts:["sled", "net", "move", "win"]},
    {w:"win",m:"\uc774\uae30\ub2e4",def:"to finish first or get the most points during a race or game",unit:3,opts:["race", "win", "winner", "touch"]},
    {w:"winner",m:"\uc6b0\uc2b9\uc790",def:"the person who wins a game or race",unit:3,opts:["prize", "winner", "final", "coach"]},
    {w:"pool",m:"\uc218\uc601\uc7a5",def:"an area of water that is made for people to swim in",unit:3,opts:["coach", "pool", "final", "sled"]},
    {w:"prize",m:"\uc0c1, \uc0c1\ud488",def:"something that is given to a person who wins a race or game",unit:3,opts:["prize", "coach", "winner", "win"]},
    {w:"touch",m:"\ub9cc\uc9c0\ub2e4",def:"to put your hand on it",unit:3,opts:["prize", "touch", "coach", "pool"]},
  ],
  "cew1_4": [
    {w:"volleyball",m:"\ubc30\uad6c",def:"a sport in which two teams hit a ball over a high net",unit:4,opts:["goal", "volleyball", "play", "golf"]},
    {w:"racket",m:"(\ud14c\ub2c8\uc2a4, \ubc30\ub4dc\ubbfc\ud134 \ub4f1\uc758) \ub77c\ucf13,",def:"a type of bat with strings, used to hit a ball",unit:4,opts:["racket", "fishing", "climbing", "field"]},
    {w:"game",m:"\uac8c\uc784, \uacbd\uae30",def:"an activity or sport that people play according to rules",unit:4,opts:["game", "golf", "play", "climbing"]},
    {w:"running",m:"\ub2ec\ub9ac\uae30",def:"a sport of moving on your feet at a speed faster than walking",unit:4,opts:["play", "hit", "running", "racket"]},
    {w:"field",m:"\uacbd\uae30\uc7a5,",def:"an area of ground where some sports are played",unit:4,opts:["game", "chess", "field", "play"]},
    {w:"play",m:"\ub180\ub2e4",def:"to take part in a sport or game",unit:4,opts:["hit", "play", "game", "runner"]},
    {w:"skateboard",m:"\uc2a4\ucf00\uc774\ud2b8\ubcf4\ub4dc",def:"a short board with wheels on it",unit:4,opts:["skateboard", "chess", "volleyball", "climbing"]},
    {w:"runner",m:"\ub2ec\ub9ac\uae30 \uc120\uc218, (\uacbd\uc8fc\uc5d0 \ucc38\uc11d\ud55c) \uc8fc\uc790",def:"someone who runs for sport or for fun",unit:4,opts:["goal", "fishing", "runner", "running"]},
    {w:"goal",m:"\uace8, \ub4dd\uc810",def:"a point scored in sports",unit:4,opts:["sailing", "goal", "golf", "puzzle"]},
    {w:"chess",m:"\uccb4\uc2a4",def:"a game that two people play by moving pieces around a board",unit:4,opts:["volleyball", "chess", "goal", "running"]},
    {w:"player",m:"\uc120\uc218",def:"someone who takes part in a sport or game",unit:4,opts:["golf", "player", "field", "running"]},
    {w:"sailing",m:"\ubcf4\ud2b8 \ud0c0\uae30, \ubc30 \ud0c0\uae30",def:"the sport or activity of traveling in a boat with sails",unit:4,opts:["skateboard", "sailing", "golf", "game"]},
    {w:"climbing",m:"\uc554\ubcbd \ub4f1\ubc18",def:"a sport where a person goes up a large rock or mountain",unit:4,opts:["running", "climbing", "play", "chess"]},
    {w:"fishing",m:"\ub09a\uc2dc",def:"the sport of catching fish",unit:4,opts:["surfing", "fishing", "chess", "goal"]},
    {w:"hit",m:"\ub54c\ub9ac\ub2e4, \uce58\ub2e4",def:"to strike it quickly and with force",unit:4,opts:["hit", "game", "golf", "player"]},
    {w:"golf",m:"\uace8\ud504",def:"a sport where you use a small club to hit a ball into a hole",unit:4,opts:["racket", "golf", "hit", "sailing"]},
    {w:"surfing",m:"\ud30c\ub3c4\ud0c0\uae30, \uc11c\ud551",def:"the sport of riding on waves in the sea on a special board",unit:4,opts:["field", "player", "surfing", "game"]},
    {w:"puzzle",m:"\ud37c\uc990",def:"a game or toy with pieces that you have to fit together",unit:4,opts:["puzzle", "surfing", "fishing", "chess"]},
  ],
  "cew1_5": [
    {w:"napkin",m:"(\uc2dd\ud0c1\uc6a9) \ub0c5\ud0a8, \uc791\uc740 \uc218\uac74",def:"a piece of cloth or paper for wiping hands and mouth",unit:5,opts:["sink", "bathtub", "napkin", "couch"]},
    {w:"cupboard",m:"\ucc2c\uc7a5",def:"a piece of furniture with doors, used for storing things",unit:5,opts:["cupboard", "toothbrush", "couch", "blanket"]},
    {w:"drawer",m:"\uc11c\ub78d, \uc7a5\ub871",def:"a box that slides into and out of a piece of furniture",unit:5,opts:["living room", "toilet", "blanket", "drawer"]},
    {w:"living room",m:"\uac70\uc2e4",def:"a room in a house where people sit to relax",unit:5,opts:["bathtub", "living room", "couch", "ceiling"]},
    {w:"ceiling",m:"\ucc9c\uc7a5",def:"the part of a room that you see when you look above you",unit:5,opts:["upstairs", "ceiling", "toothbrush", "backyard"]},
    {w:"hall",m:"\ubcf5\ub3c4",def:"a narrow passage in a building that leads from room to room",unit:5,opts:["downstairs", "hall", "blanket", "ceiling"]},
    {w:"upstairs",m:"\uc704\uce35\uc5d0",def:"to go to an upper level of a building",unit:5,opts:["drawer", "napkin", "upstairs", "living room"]},
    {w:"couch",m:"\uc18c\ud30c, \uae34 \uc758\uc790",def:"a piece of furniture on which two or more people can sit",unit:5,opts:["backyard", "sink", "couch", "basement"]},
    {w:"downstairs",m:"\uc544\ub798\uce35\uc5d0",def:"to go to a lower level of a building",unit:5,opts:["bathtub", "garage", "blanket", "downstairs"]},
    {w:"sink",m:"\uc138\uba74\ub300, \uac1c\uc218\ub300",def:"a bowl attached to the wall in a kitchen or bathroom",unit:5,opts:["sink", "upstairs", "basement", "garage"]},
    {w:"garage",m:"\ucc28\uace0",def:"a building for keeping a car in",unit:5,opts:["garage", "roof", "basement", "drawer"]},
    {w:"blanket",m:"\ub2f4\uc694",def:"a thick, warm cover that you sleep under",unit:5,opts:["napkin", "upstairs", "backyard", "blanket"]},
    {w:"toothbrush",m:"\uce6b\uc194",def:"a small brush that you use for cleaning your teeth",unit:5,opts:["cupboard", "basement", "toothbrush", "downstairs"]},
    {w:"roof",m:"\uc9c0\ubd95",def:"a surface that covers the top of a building",unit:5,opts:["toothbrush", "garage", "roof", "drawer"]},
    {w:"basement",m:"\uc9c0\ud558\uc2e4",def:"a room or area in a building that is under the ground",unit:5,opts:["bathtub", "basement", "sink", "blanket"]},
    {w:"bathtub",m:"\uc695\uc870",def:"a large container that you sit or lie in to wash your body",unit:5,opts:["bathtub", "ceiling", "living room", "cupboard"]},
    {w:"backyard",m:"\ub4b7\ub9c8\ub2f9",def:"a small area behind a house, usually with grass",unit:5,opts:["sink", "napkin", "hall", "backyard"]},
    {w:"toilet",m:"\ubcc0\uae30(\ud1b5)",def:"a bowl in the bathroom where people leave human waste",unit:5,opts:["roof", "living room", "toilet", "hall"]},
    {w:"tile",m:"\ud0c0\uc77c",def:"one of the flat pieces that are used to cover floors and walls",unit:5,opts:["ceiling", "backyard", "tile", "blanket"]},
  ],
  "cew1_6": [
    {w:"carpet",m:"\uce74\ud3ab, \uc591\ud0c4\uc790",def:"a covering for floors made of a thick material",unit:6,opts:["wallpaper", "carpet", "mattress", "curtain"]},
    {w:"bedding",m:"\uce68\uad6c",def:"the sheets and blankets that you put on a bed",unit:6,opts:["live", "bedding", "bedroom", "wall"]},
    {w:"wallpaper",m:"\ubcbd\uc9c0",def:"paper that you stick onto the walls of a room",unit:6,opts:["floor", "shelf", "wallpaper", "seat"]},
    {w:"mattress",m:"(\uce68\ub300\uc758) \ub9e4\ud2b8\ub9ac\uc2a4",def:"the soft part of a bed that you lie on",unit:6,opts:["curtain", "mattress", "bedding", "wallpaper"]},
    {w:"live",m:"\uc0b4\ub2e4",def:"to live somewhere is to have a home in that place",unit:6,opts:["shelf", "floor", "live", "carpet"]},
    {w:"furniture",m:"\uac00\uad6c",def:"the large objects in a room",unit:6,opts:["mat", "furniture", "bedroom", "build"]},
    {w:"stair",m:"\uacc4\ub2e8",def:"a step in a set of stairs from one level to another",unit:6,opts:["curtain", "stair", "build", "carpet"]},
    {w:"build",m:"\uc9d3\ub2e4",def:"to make something by putting materials and parts together",unit:6,opts:["live", "build", "floor", "dresser"]},
    {w:"pillow",m:"\ubca0\uac1c",def:"soft, filled cloth bag that you put your head on",unit:6,opts:["shelf", "tool", "pillow", "cleaner"]},
    {w:"floor",m:"\ubc14\ub2e5",def:"a flat surface that you stand on inside a building",unit:6,opts:["cleaner", "dresser", "floor", "pillow"]},
    {w:"shelf",m:"\uc120\ubc18",def:"a flat, narrow board used to put things on",unit:6,opts:["dresser", "floor", "shelf", "mat"]},
    {w:"dresser",m:"\uc7a5\ub871",def:"a large piece of furniture with drawers for storing clothes",unit:6,opts:["bedding", "dresser", "floor", "pillow"]},
    {w:"curtain",m:"(\ucc3d\ubb38) \ucee4\ud2bc",def:"a piece of cloth that hangs down over a window",unit:6,opts:["live", "mat", "bedding", "curtain"]},
    {w:"mat",m:"\ub9e4\ud2b8, \uae54\uac1c",def:"a piece of thick, rough material that covers part of a floor",unit:6,opts:["mat", "wall", "tool", "wallpaper"]},
    {w:"seat",m:"\uc790\ub9ac",def:"a place where you can sit",unit:6,opts:["seat", "live", "carpet", "pillow"]},
    {w:"wall",m:"\ubcbd",def:"one of the upright sides of a room or building",unit:6,opts:["wall", "shelf", "seat", "pillow"]},
    {w:"tool",m:"\ub3c4\uad6c",def:"something that you use to do a particular job",unit:6,opts:["tool", "bedroom", "curtain", "wood"]},
    {w:"bedroom",m:"\uce68\uc2e4",def:"a room for sleeping in",unit:6,opts:["bedroom", "mattress", "stair", "carpet"]},
    {w:"cleaner",m:"\uc138\uc81c",def:"a product used for cleaning",unit:6,opts:["furniture", "cleaner", "stair", "mattress"]},
    {w:"wood",m:"\ub098\ubb34",def:"the hard material that trees are made of",unit:6,opts:["pillow", "shelf", "wood", "live"]},
  ],
  "cew1_7": [
    {w:"cathedral",m:"\ub300\uc131\ub2f9",def:"the main church of a particular area",unit:7,opts:["cathedral", "museum", "center", "entrance"]},
    {w:"guesthouse",m:"\uac8c\uc2a4\ud2b8 \ud558\uc6b0\uc2a4, \uc18c\uaddc\ubaa8 \ud638\ud154",def:"a small house where guests pay to stay",unit:7,opts:["entrance", "gate", "cathedral", "guesthouse"]},
    {w:"address",m:"\uc8fc\uc18c",def:"the exact location where a building is",unit:7,opts:["cathedral", "museum", "address", "restaurant"]},
    {w:"hotel",m:"\ud638\ud154",def:"a large building where people pay to stay and eat meals",unit:7,opts:["museum", "stadium", "hotel", "guesthouse"]},
    {w:"entrance",m:"\uc785\uad6c",def:"a door or other opening that you use to enter a building",unit:7,opts:["outside", "center", "entrance", "gallery"]},
    {w:"gallery",m:"\ubbf8\uc220\uad00, \uac24\ub7ec\ub9ac",def:"a room or building where people can see art",unit:7,opts:["villa", "center", "gallery", "gate"]},
    {w:"exit",m:"\ucd9c\uad6c",def:"a door or space that you use to leave a building",unit:7,opts:["gate", "center", "guesthouse", "exit"]},
    {w:"church",m:"\uad50\ud68c",def:"a building where Christians go to worship",unit:7,opts:["church", "cathedral", "museum", "address"]},
    {w:"museum",m:"\ubc15\ubb3c\uad00",def:"a place showing art, science, or history",unit:7,opts:["building", "outside", "museum", "restaurant"]},
    {w:"center",m:"\uc911\uc2ec",def:"the middle of a space or area",unit:7,opts:["center", "church", "hotel", "entrance"]},
    {w:"villa",m:"\ubcc4\uc7a5",def:"a large house where people stay when visiting a warm country",unit:7,opts:["entrance", "exit", "gallery", "villa"]},
    {w:"elevator",m:"\uc5d8\ub9ac\ubca0\uc774\ud130",def:"a machine that carries people up and down in buildings",unit:7,opts:["address", "outside", "elevator", "entrance"]},
    {w:"stadium",m:"\uacbd\uae30\uc7a5, \uc2a4\ud0c0\ub514\uc6c0",def:"a building for public events, especially sports",unit:7,opts:["gallery", "stadium", "elevator", "entrance"]},
    {w:"outside",m:"\ubc16\uc758, \uc678\ubd80\uc758",def:"not insdie a building",unit:7,opts:["outside", "restaurant", "museum", "building"]},
    {w:"gate",m:"\ubb38, \uc815\ubb38, \ub300\ubb38",def:"the part of a fence or outside wall that opens and closes",unit:7,opts:["villa", "museum", "center", "gate"]},
    {w:"restaurant",m:"\uc74c\uc2dd\uc810",def:"a place where you can buy and eat a meal",unit:7,opts:["restaurant", "church", "museum", "gallery"]},
    {w:"building",m:"\uac74\ubb3c",def:"a structure with walls and a roof",unit:7,opts:["stadium", "address", "restaurant", "building"]},
  ],
  "cew1_8": [
    {w:"stove",m:"\uc2a4\ud1a0\ube0c, \uac00\uc2a4\ub80c\uc9c0",def:"a piece of equipment that you cook on",unit:8,opts:["butter", "mushroom", "stove", "tea"]},
    {w:"have",m:"\uba39\ub2e4, \ub9c8\uc2dc\ub2e4",def:"to eat or drink it",unit:8,opts:["coffee", "eat", "have", "pepper"]},
    {w:"jam",m:"\uc7bc",def:"a sweet food made from fruit",unit:8,opts:["mushroom", "marshmallow", "honey", "jam"]},
    {w:"eat",m:"\uba39\ub2e4",def:"to put food in your mouth and then swallow it",unit:8,opts:["butter", "eat", "mushroom", "honey"]},
    {w:"coffee",m:"\ucee4\ud53c",def:"a hot dark-brown drink with a slightly bitter taste",unit:8,opts:["chop", "honey", "coffee", "salt"]},
    {w:"chop",m:"\uc790\ub974\ub2e4",def:"to cut in into smaller pieces",unit:8,opts:["chop", "vegetable", "have", "mushroom"]},
    {w:"mushroom",m:"\ubc84\uc12f",def:"a vetetable with a stem and a round top",unit:8,opts:["soup", "mushroom", "honey", "have"]},
    {w:"salt",m:"\uc18c\uae08",def:"a natural white mineral used to odd flavor to food",unit:8,opts:["salt", "have", "butter", "sausage"]},
    {w:"honey",m:"\uafc0",def:"a sweet, sticky food that is made by bees",unit:8,opts:["bacon", "cup", "butter", "honey"]},
    {w:"vegetable",m:"\uc57c\ucc44, \ucc44\uc18c",def:"a plant that you eat",unit:8,opts:["bacon", "butter", "mushroom", "vegetable"]},
    {w:"soup",m:"\uc218\ud504",def:"a hot liquid food made from vegetables, meat, or fish",unit:8,opts:["butter", "bacon", "soup", "pepper"]},
    {w:"cup",m:"\ucef5",def:"a round container used for drinking",unit:8,opts:["salt", "bacon", "cup", "jam"]},
    {w:"marshmallow",m:"\ub9c8\uc2dc\uba5c\ub85c",def:"a soft white food made from sugar",unit:8,opts:["eat", "coffee", "cup", "marshmallow"]},
    {w:"bacon",m:"\ubca0\uc774\ucee8",def:"meat from a pig, cut into long, thin slices",unit:8,opts:["have", "eat", "bacon", "vegetable"]},
    {w:"pepper",m:"\ud6c4\ucd94",def:"a black, gray, or red powder that gives food a spicy flavor",unit:8,opts:["honey", "soup", "pepper", "bacon"]},
    {w:"sausage",m:"\uc18c\uc2dc\uc9c0",def:"a mix of meat and spices pressed into a long tube",unit:8,opts:["mushroom", "sausage", "soup", "chop"]},
    {w:"tea",m:"\ucc28",def:"a drink that you make by pouring water over dried leaves",unit:8,opts:["honey", "salt", "tea", "jam"]},
    {w:"butter",m:"\ubc84\ud130",def:"a yellow food made from milk or cream",unit:8,opts:["cup", "salt", "pepper", "butter"]},
  ],
  "cew1_9": [
    {w:"thirsty",m:"\ubaa9\ub9c8\ub978",def:"need a drink",unit:9,opts:["supper", "bagel", "thirsty", "pasta"]},
    {w:"pasta",m:"\ud30c\uc2a4\ud0c0",def:"an Italian food made from flour, eggs, and water",unit:9,opts:["melon", "cookie", "bagel", "pasta"]},
    {w:"cheese",m:"\uce58\uc988",def:"a solid food made from milk",unit:9,opts:["shrimp", "cheese", "lemon", "grapefruit"]},
    {w:"avocado",m:"\uc544\ubcf4\uce74\ub3c4 (\uc5f4\ub300 \uacfc\uc77c\uc758 \uc77c\uc885)",def:"a fruit with a thick green or purple skin and a large seed",unit:9,opts:["avocado", "bagel", "melon", "cookie"]},
    {w:"ketchup",m:"\ucf00\ucca9",def:"a thick, cold red sauce made from tomatoes",unit:9,opts:["ketchup", "pasta", "melon", "snack"]},
    {w:"shrimp",m:"\uc0c8\uc6b0",def:"a small sea animal with a shell and legs",unit:9,opts:["salad", "shrimp", "milkshake", "melon"]},
    {w:"melon",m:"\uba5c\ub860",def:"a large, round fruit with sweet, juicy flesh",unit:9,opts:["supper", "bagel", "cook", "melon"]},
    {w:"salad",m:"\uc0d0\ub7ec\ub4dc",def:"a mix of raw vegetables",unit:9,opts:["melon", "avocado", "salad", "pasta"]},
    {w:"milkshake",m:"\ubc00\ud06c\uc170\uc774\ud06c",def:"a sweet drink made of milk and chocolate or fruit",unit:9,opts:["thirsty", "grapefruit", "milkshake", "ketchup"]},
    {w:"supper",m:"\uc800\ub141 (\uc2dd\uc0ac)",def:"a meal that you eat in the evening",unit:9,opts:["grapefruit", "cookie", "supper", "shrimp"]},
    {w:"cookie",m:"\uacfc\uc790, \ucfe0\ud0a4",def:"a small, flat, and sweet cake",unit:9,opts:["avocado", "lemon", "supper", "cookie"]},
    {w:"barbecue",m:"\ubc14\ube44\ud050, \uc22f\ubd88\uad6c\uc774",def:"a meal or party during which food is cooked over a fire",unit:9,opts:["shrimp", "barbecue", "cook", "supper"]},
    {w:"lemon",m:"\ub808\ubaac",def:"a fruit with a hard, yellow skin and sour juice",unit:9,opts:["supper", "snack", "pasta", "lemon"]},
    {w:"grapefruit",m:"\uc790\ubabd",def:"a round, yellow fruit with a thick skin, like a large orange",unit:9,opts:["grapefruit", "lemon", "cookie", "ketchup"]},
    {w:"snack",m:"\uac04\uc2dd",def:"a small amount of food that is eaten between main meals",unit:9,opts:["snack", "cook", "barbecue", "salad"]},
    {w:"full",m:"\ubc30\ubd80\ub978",def:"enough to eat and do not want any more",unit:9,opts:["full", "shrimp", "grapefruit", "cook"]},
    {w:"cook",m:"\uc694\ub9ac\ud558\ub2e4",def:"to prepare food for eating by using heat",unit:9,opts:["thirsty", "snack", "cook", "pasta"]},
    {w:"bagel",m:"\ubca0\uc774\uae00",def:"a small ring-shaped type of bread",unit:9,opts:["melon", "shrimp", "snack", "bagel"]},
  ],
  "cew1_10": [
    {w:"find",m:"\ucc3e\ub2e4",def:"to discover, see, or get it",unit:10,opts:["find", "among", "expensive", "supermarket"]},
    {w:"pick",m:"\uace0\ub974\ub2e4, \uc120\ud0dd\ud558\ub2e4",def:"to choose it",unit:10,opts:["find", "pick", "shopper", "price"]},
    {w:"wonderful",m:"\uba4b\uc9c4, \ud6cc\ub96d\ud55c",def:"very good",unit:10,opts:["look", "wonderful", "sell", "price"]},
    {w:"parking lot",m:"\uc8fc\ucc28\uc7a5",def:"an open area for cars to park in",unit:10,opts:["parking lot", "cart", "pick", "expensive"]},
    {w:"try",m:"\uc2dc\ub3c4\ud558\ub2e4",def:"to attempt to do something",unit:10,opts:["wonderful", "pick", "neat", "try"]},
    {w:"shopper",m:"\uc1fc\ud551\uac1d",def:"someone who buys things in stores",unit:10,opts:["pick", "gold", "shopper", "neat"]},
    {w:"cart",m:"\uce74\ud2b8",def:"a large basket on wheels that you use in a supermarket",unit:10,opts:["expensive", "price", "cart", "pick"]},
    {w:"else",m:"\ub2e4\ub978",def:"used to say that something is in addition to something",unit:10,opts:["among", "try", "gold", "else"]},
    {w:"supermarket",m:"\uc288\ud37c\ub9c8\ucf13",def:"a large store that sells food, drinks, and other things",unit:10,opts:["look", "supermarket", "parking lot", "pick"]},
    {w:"price",m:"\uac00\uaca9",def:"the amount you have to pay for it",unit:10,opts:["shopper", "price", "expensive", "customer"]},
    {w:"among",m:"~\uc911\uc5d0, ~\uc0ac\uc774\uc5d0",def:"with or in the middle of a group",unit:10,opts:["parking lot", "among", "supermarket", "gold"]},
    {w:"look",m:"\ubcf4\ub2e4",def:"to turn your eyes toward it so you can see it in detail",unit:10,opts:["wonderful", "pick", "gold", "look"]},
    {w:"neat",m:"\uae54\ub054\ud55c",def:"tidy and clean",unit:10,opts:["neat", "price", "supermarket", "wonderful"]},
    {w:"shop",m:"\uac00\uac8c",def:"a place where you can buy goods or services",unit:10,opts:["shop", "else", "parking lot", "pick"]},
    {w:"gold",m:"\uae08\uc0c9\uc758",def:"made of gold or is the color gold",unit:10,opts:["else", "price", "gold", "wonderful"]},
    {w:"expensive",m:"\ube44\uc2fc",def:"costing a lot of money",unit:10,opts:["else", "try", "expensive", "find"]},
    {w:"customer",m:"\uace0\uac1d",def:"someone who buys good or services from a store or company",unit:10,opts:["among", "supermarket", "look", "customer"]},
    {w:"sell",m:"\ud314\ub2e4",def:"to offer it for people to buy",unit:10,opts:["expensive", "parking lot", "sell", "wonderful"]},
  ],
  "cew1_11": [
    {w:"discount",m:"\ud560\uc778",def:"a special lower price for something",unit:11,opts:["chain", "jewelry", "dress", "discount"]},
    {w:"card",m:"\uce74\ub4dc",def:"a small piece of plastic from a bank that you use to pay",unit:11,opts:["receipt", "card", "piece", "return"]},
    {w:"get",m:"\ubc1b\ub2e4, \uc5bb\ub2e4, \uac00\uc9c0\ub2e4",def:"to take, receive, or buy it",unit:11,opts:["around", "piece", "get", "jewelry"]},
    {w:"choose",m:"\uc120\ud0dd\ud558\ub2e4",def:"to pick something from a group of things",unit:11,opts:["dress", "choose", "fashionable", "bookstore"]},
    {w:"closed",m:"\ub2eb\ud78c",def:"not open and people cannot enter it",unit:11,opts:["closed", "get", "choose", "instead"]},
    {w:"return",m:"\ub3cc\uc544\uc624\ub2e4, \ubcf5\uadc0\ud558\ub2e4, \ub3cc\ub824\uc8fc\ub2e4",def:"to give, send, or put it back where it came from",unit:11,opts:["return", "dress", "discount", "mall"]},
    {w:"take",m:"(\uc2dc\uac04)\uac78\ub9ac\ub2e4, \uac00\uc9c0\ub2e4, \ubc1b\ub2e4",def:"to bring it or them with you when you go somewhere",unit:11,opts:["chain", "discount", "take", "around"]},
    {w:"bookstore",m:"\uc11c\uc810",def:"a store that sells books",unit:11,opts:["jewelry", "return", "bookstore", "choose"]},
    {w:"around",m:"\uc8fc\ubcc0\uc5d0, \uc8fc\uc704\uc5d0",def:"to move to many places or parts of it",unit:11,opts:["around", "jewelry", "get", "discount"]},
    {w:"fashionable",m:"\uba4b\uc788\ub294, \uc720\ud589\uc758",def:"popular at a certain time",unit:11,opts:["mall", "chain", "get", "fashionable"]},
    {w:"dress",m:"\uc6d0\ud53c\uc2a4",def:"a piece of clothing usually for women that covers the body",unit:11,opts:["fashionable", "piece", "jewelry", "dress"]},
    {w:"receipt",m:"\uc601\uc218\uc911",def:"a piece of paper that shows you have paid for something",unit:11,opts:["style", "receipt", "around", "dress"]},
    {w:"instead",m:"\ub300\uc2e0\uc5d0",def:"in place of someone or something else",unit:11,opts:["piece", "instead", "bookstore", "closed"]},
    {w:"piece",m:"\uc870\uac01, \ubd80\ubd84",def:"a part of something or one of a particular type of thing",unit:11,opts:["mall", "around", "piece", "instead"]},
    {w:"style",m:"\uc591\uc2dd, \ubc29\uc2dd",def:"a way of designing things, such as hair, clothes, and furniture",unit:11,opts:["get", "style", "bookstore", "piece"]},
    {w:"mall",m:"\uc1fc\ud551\uc13c\ud130",def:"a large, covered shopping area",unit:11,opts:["closed", "mall", "style", "card"]},
    {w:"jewelry",m:"\ubcf4\uc11d, \uc7a5\uc2e0\uad6c",def:"a small thing that you wear for decoration",unit:11,opts:["return", "dress", "piece", "jewelry"]},
    {w:"chain",m:"\uccb4\uc778",def:"a number of stores owned by the same company or person",unit:11,opts:["chain", "around", "jewelry", "receipt"]},
  ],
  "cew1_12": [
    {w:"wear",m:"\uc785\ub2e4",def:"to have it on your body",unit:12,opts:["wear", "belt", "jacket", "sleeve"]},
    {w:"sweater",m:"\uc2a4\uc6e8\ud130",def:"a warm piece of clothing that covers the top of your body",unit:12,opts:["jeans", "sweater", "jacket", "cardigan"]},
    {w:"cardigan",m:"\uac00\ub514\uac74",def:"a sweater that buttons at the front",unit:12,opts:["pants", "cardigan", "sweatshirt", "pajamas"]},
    {w:"t-shirt",m:"\ud2f0\uc154\uce20",def:"a simple piece of clothing with short sleeves and no collar",unit:12,opts:["cardigan", "t-shirt", "sweatshirt", "sweater"]},
    {w:"jacket",m:"\uc7ac\ud0b7",def:"a lightweight coat used to stay warm",unit:12,opts:["belt", "tie", "jacket", "sweatshirt"]},
    {w:"ring",m:"\ubc18\uc9c0",def:"jewelry that you wear on your finger",unit:12,opts:["clothes", "ring", "suit", "sleeve"]},
    {w:"clothes",m:"\uc637",def:"shirts and pants that you wear on your body",unit:12,opts:["tie", "sleeve", "clothes", "cardigan"]},
    {w:"jeans",m:"\uccad\ubc14\uc9c0",def:"pants made of denim",unit:12,opts:["pajamas", "jeans", "pants", "clothes"]},
    {w:"belt",m:"\ubca8\ud2b8",def:"a long, thin piece of leather that you wear around your waist",unit:12,opts:["jeans", "denim", "tights", "belt"]},
    {w:"denim",m:"\ub370\ub2d8",def:"a thick, strong cotton cloth which is used to make clothes",unit:12,opts:["pants", "cardigan", "denim", "t-shirt"]},
    {w:"sweatshirt",m:"\uc2a4\uc6e8\ud2b8 \uc154\uce20",def:"a simple piece of soft clothing with long sleeves",unit:12,opts:["pajamas", "clothes", "wear", "sweatshirt"]},
    {w:"pajamas",m:"\uc7a0\uc637",def:"a shirt and pants that you wear in bed",unit:12,opts:["pocket", "denim", "pajamas", "jacket"]},
    {w:"suit",m:"\uc815\uc7a5",def:"a jacket and pants or a jacket and skirt",unit:12,opts:["suit", "sleeve", "clothes", "sweatshirt"]},
    {w:"sleeve",m:"\uc18c\ub9e4",def:"the part of a jacket or shirt that covers your arm",unit:12,opts:["jeans", "belt", "sleeve", "wear"]},
    {w:"pants",m:"\ubc14\uc9c0",def:"a piece of clothing that covers the legs",unit:12,opts:["pants", "sweatshirt", "tights", "t-shirt"]},
    {w:"tie",m:"\ub125\ud0c0\uc774",def:"a long, thin piece of material that is worn under a shirt collar",unit:12,opts:["wear", "tie", "denim", "pocket"]},
    {w:"tights",m:"\ud0c0\uc774\uce20",def:"a piece of clothing made of thin material that covers the legs",unit:12,opts:["tights", "pants", "cardigan", "ring"]},
    {w:"pocket",m:"\uc8fc\uba38\ub2c8",def:"a small opening in clothing",unit:12,opts:["jeans", "pocket", "pants", "wear"]},
  ],
  "cew1_13": [
    {w:"scarf",m:"\uc2a4\uce74\ud504",def:"a piece of cloth that you wear around your neck to keep warm",unit:13,opts:["sandal", "necklace", "umbrella", "scarf"]},
    {w:"blouse",m:"\ube14\ub77c\uc6b0\uc2a4",def:"a piece of clothing like a shirt, that women wear",unit:13,opts:["shorts", "clothing", "blouse", "underwear"]},
    {w:"swimsuit",m:"\uc218\uc601\ubcf5",def:"a piece of clothing that you wear to go swimming",unit:13,opts:["swimsuit", "clothing", "scarf", "backpack"]},
    {w:"underwear",m:"\uc18d\uc637",def:"the clothing that you wear under your clothes",unit:13,opts:["umbrella", "raincoat", "underwear", "cotton"]},
    {w:"skirt",m:"\uce58\ub9c8",def:"a piece of clothing that hangs down from the waist like a dress",unit:13,opts:["cotton", "skirt", "knit", "coat"]},
    {w:"earring",m:"\uadc0\uac78\uc774",def:"a piece of jewelry that you wear in your ear",unit:13,opts:["clothing", "umbrella", "earring", "necklace"]},
    {w:"coat",m:"\ucf54\ud2b8",def:"a piece of clothing with long sleeves to keep you warm",unit:13,opts:["scarf", "raincoat", "coat", "underwear"]},
    {w:"necklace",m:"\ubaa9\uac78\uc774",def:"a piece of jewelry that you wear around your neck",unit:13,opts:["swimsuit", "sandal", "necklace", "clothing"]},
    {w:"clothing",m:"\uc758\ub958, \uc637, \ubcf5\uc7a5",def:"another word for clothes",unit:13,opts:["clothing", "earring", "underwear", "skirt"]},
    {w:"shorts",m:"\ubc18\ubc14\uc9c0",def:"short pants that stop above the knees",unit:13,opts:["clothing", "shorts", "raincoat", "skirt"]},
    {w:"sunglasses",m:"\uc120\uae00\ub77c\uc2a4",def:"dark glasses that you wear to protect your eyes from the sun",unit:13,opts:["purse", "shorts", "earring", "sunglasses"]},
    {w:"raincoat",m:"\uc6b0\ube44",def:"a coat that you wear to protect yourself from rain",unit:13,opts:["backpack", "shorts", "raincoat", "earring"]},
    {w:"umbrella",m:"\uc6b0\uc0b0",def:"a thing that you hold over your head when it is raining",unit:13,opts:["necklace", "swimsuit", "umbrella", "backpack"]},
    {w:"purse",m:"\uc9c0\uac11",def:"a bag in which a woman carries her money and personal things",unit:13,opts:["scarf", "coat", "umbrella", "purse"]},
    {w:"backpack",m:"\ubc30\ub0ad",def:"a bag that you carry on your back",unit:13,opts:["raincoat", "backpack", "purse", "scarf"]},
    {w:"knit",m:"\ub728\uac1c\uc9c8\uc744 \ud558\ub2e4",def:"to make it out of yarn using two knitting needles",unit:13,opts:["scarf", "shorts", "umbrella", "knit"]},
    {w:"cotton",m:"\uba74, \ubaa9\ud654",def:"cloth or thread made of the white hair of the cotton plant",unit:13,opts:["coat", "earring", "purse", "cotton"]},
    {w:"sandal",m:"\uc0cc\ub4e4",def:"a light shoe that is worn in warm weather",unit:13,opts:["coat", "scarf", "umbrella", "sandal"]},
  ],
  "cew1_14": [
    {w:"video",m:"\ube44\ub514\uc624",def:"a short movie that is made to go with a piece of popular music",unit:14,opts:["dancer", "jazz", "video", "pop"]},
    {w:"jazz",m:"\uc7ac\uc988",def:"a kind of music where musicians make up what they play",unit:14,opts:["drum", "channel", "jazz", "pop"]},
    {w:"record",m:"\uae30\ub85d\ud558\ub2e4, \ub179\uc74c\ud558\ub2e4",def:"to store music and sound on a computer or tape",unit:14,opts:["record", "channel", "violin", "pop"]},
    {w:"singing",m:"\ub178\ub798\ud558\uae30",def:"the activity of producing musical sounds with your voice",unit:14,opts:["violin", "singing", "dancer", "concert"]},
    {w:"violin",m:"\ubc14\uc774\uc62c\ub9b0",def:"a musical instrument with four strings that you play with a bow",unit:14,opts:["singer", "violin", "singing", "painting"]},
    {w:"drum",m:"\ub4dc\ub7fc",def:"a musical instrument played by hitting it",unit:14,opts:["opera", "record", "drum", "video"]},
    {w:"opera",m:"\uc624\ud398\ub77c",def:"a musical play in which most of the words are sung",unit:14,opts:["stage", "musical", "violin", "opera"]},
    {w:"musical",m:"\ubba4\uc9c0\uceec",def:"a play or movie that includes singing and dancing",unit:14,opts:["painting", "jazz", "musical", "singer"]},
    {w:"dancer",m:"\ucda4\ucd94\ub294 \uc0ac\ub78c",def:"someone who dances, either as a job or for fun",unit:14,opts:["dancer", "record", "concert", "channel"]},
    {w:"album",m:"\uc568\ubc94",def:"several pieces of music collected into a single item",unit:14,opts:["singer", "painting", "album", "drum"]},
    {w:"channel",m:"\ucc44\ub110, \uacbd\ub85c",def:"a television station",unit:14,opts:["painting", "dancer", "opera", "channel"]},
    {w:"stage",m:"\ubb34\ub300, \ub2e8\uacc4",def:"the raised area in a theater on which actors or singers stand",unit:14,opts:["concert", "musical", "stage", "band"]},
    {w:"concert",m:"\uacf5\uc5f0",def:"a performance of music by one or more musicians or singers",unit:14,opts:["opera", "jazz", "concert", "musical"]},
    {w:"pop",m:"\ud31d, \uac00\uc694",def:"modern music that is popular, especially with young people",unit:14,opts:["musical", "jazz", "pop", "dancer"]},
    {w:"singer",m:"\uac00\uc218",def:"someone who sings as a job or for fun",unit:14,opts:["pop", "musical", "recording", "singer"]},
    {w:"painting",m:"\uadf8\ub9bc",def:"a painted picture that you put on a wall for people to see",unit:14,opts:["painting", "stage", "jazz", "concert"]},
    {w:"recording",m:"\uae30\ub85d, \ub179\uc74c",def:"something that has been stored on a computer or tape",unit:14,opts:["video", "drum", "recording", "record"]},
    {w:"band",m:"\ubc34\ub4dc",def:"a group of musicians or singers who perform together",unit:14,opts:["video", "band", "musical", "opera"]},
  ],
  "cew1_15": [
    {w:"present",m:"\ubcf4\uc5ec\uc8fc\ub2e4, \uc81c\uc2dc\ud558\ub2e4",def:"to introduce and show it",unit:15,opts:["cartoon", "art", "present", "chapter"]},
    {w:"circus",m:"\uc11c\ucee4\uc2a4",def:"a show in which a group of people perform inside a large tent",unit:15,opts:["circus", "soul", "movie", "actress"]},
    {w:"comic book",m:"\ub9cc\ud654\ucc45",def:"a thin book with a story told in pictures",unit:15,opts:["picture", "comic book", "art", "photograph"]},
    {w:"program",m:"\ud504\ub85c\uadf8\ub7a8",def:"a show on television or the radio",unit:15,opts:["comic book", "program", "painter", "photograph"]},
    {w:"cinema",m:"\uc601\ud654\uad00",def:"a building in which films are shown",unit:15,opts:["actress", "picture", "magazine", "cinema"]},
    {w:"picture",m:"\uadf8\ub9bc",def:"a drawing, painting, or photographs of something or someone",unit:15,opts:["picture", "chapter", "photograph", "present"]},
    {w:"fiction",m:"\uc18c\uc124",def:"books and stories that are not real or based on fact",unit:15,opts:["actor", "fiction", "soul", "movie"]},
    {w:"movie",m:"\uc601\ud654",def:"a film made to be shown at a theater or on television",unit:15,opts:["movie", "film", "actor", "picture"]},
    {w:"actor",m:"\ub0a8\uc790 \ubc30\uc6b0",def:"a man who performs in a play or movie",unit:15,opts:["actress", "present", "picture", "actor"]},
    {w:"actress",m:"\uc5ec\uc790 \ubc30\uc6b0",def:"a woman who performs in a play or movie",unit:15,opts:["actress", "soul", "chapter", "film"]},
    {w:"chapter",m:"\ucc55\ud130",def:"one of the parts into which a book is divided",unit:15,opts:["chapter", "painter", "comic book", "soul"]},
    {w:"film",m:"\uc601\ud654",def:"a story that is told with sound and moving pictures",unit:15,opts:["fiction", "chapter", "film", "soul"]},
    {w:"cartoon",m:"\ub9cc\ud654",def:"an animated story that appears on TV, in comic books, etc.",unit:15,opts:["present", "picture", "movie", "cartoon"]},
    {w:"magazine",m:"\uc7a1\uc9c0",def:"a large thin paper book with articles and photos",unit:15,opts:["chapter", "painter", "program", "magazine"]},
    {w:"art",m:"\ubbf8\uc220",def:"paintings, drawings, and sculptures",unit:15,opts:["art", "fiction", "painter", "comic book"]},
    {w:"soul",m:"\uc601\ud63c, \uc18c\uc6b8",def:"popular music that expresses deep feelings",unit:15,opts:["fiction", "program", "soul", "film"]},
    {w:"painter",m:"\ud654\uac00",def:"someone who paints pictures",unit:15,opts:["picture", "circus", "art", "painter"]},
    {w:"photograph",m:"\uc0ac\uc9c4",def:"a picture made by using a camera",unit:15,opts:["photograph", "movie", "cinema", "chapter"]},
  ],
  "cew1_16": [
    {w:"cave",m:"\ub3d9\uad74",def:"a large natural hole in a mountain or under the ground",unit:16,opts:["fog", "temperature", "cave", "sunshine"]},
    {w:"countryside",m:"\uc2dc\uace8, \uad50\uc678",def:"land that is not in towns or cities and has farms and fields",unit:16,opts:["countryside", "cloud", "sunshine", "place"]},
    {w:"temperature",m:"\uc628\ub3c4",def:"how hot or cold a place or thing is",unit:16,opts:["sunshine", "thunder", "snow", "temperature"]},
    {w:"lightning",m:"\ubc88\uac1c",def:"a sudden falsh of light in the sky, caused by electricity",unit:16,opts:["dirt", "fog", "lightning", "snake"]},
    {w:"hike",m:"\ub3c4\ubcf4 \uc5ec\ud589\ud558\ub2e4",def:"to take a long walk, usually in the countryside",unit:16,opts:["sunset", "cloud", "hike", "cave"]},
    {w:"snow",m:"\ub208",def:"white pieces of frozen water that fall down from the sky",unit:16,opts:["fog", "thunder", "below", "snow"]},
    {w:"dirt",m:"\uba3c\uc9c0",def:"anything that makes things not clean, such as earth or soil",unit:16,opts:["lightning", "dirt", "temperature", "below"]},
    {w:"below",m:"~ \uc544\ub798\uc5d0",def:"in a lower place or position than something else",unit:16,opts:["thunder", "below", "fog", "snow"]},
    {w:"snake",m:"\ubc40",def:"an animal with a long, thin body and no legs, that can bite",unit:16,opts:["cave", "below", "snake", "hike"]},
    {w:"thunder",m:"\ucc9c\ub465",def:"the loud noise that you hear during a storm",unit:16,opts:["snake", "thunder", "sunshine", "gas"]},
    {w:"wind",m:"\ubc14\ub78c",def:"moving air, especially when it moves strongly or quickly",unit:16,opts:["wind", "cave", "dirt", "place"]},
    {w:"gas",m:"\uac00\uc2a4",def:"a substance such as air, which is neither solid nor liquid",unit:16,opts:["fog", "snake", "gas", "dirt"]},
    {w:"sunshine",m:"\ud587\ube5b",def:"the light and heat from the sun",unit:16,opts:["countryside", "sunshine", "below", "cave"]},
    {w:"fog",m:"\uc548\uac1c",def:"a thick cloud just above the ground or sea",unit:16,opts:["cloud", "sunshine", "fog", "snow"]},
    {w:"sunset",m:"\uc77c\ubab0, \ud574\uc9c8\ub158",def:"a time in the evening when you last see the sun in the sky",unit:16,opts:["fog", "sunset", "place", "cave"]},
    {w:"place",m:"\uc7a5\uc18c",def:"a position, building, town, or area",unit:16,opts:["place", "countryside", "snow", "fog"]},
    {w:"steam",m:"\uc99d\uae30, \uc2a4\ud300",def:"the hot mist that water produces when it is boiled",unit:16,opts:["cloud", "steam", "fog", "snow"]},
    {w:"cloud",m:"\uad6c\ub984",def:"a white or gray mass in the sky made of small drops of water",unit:16,opts:["cloud", "dirt", "steam", "thunder"]},
  ],
  "cew2_1": [
    {w:"railroad",m:"\ucca0\ub85c, \uc120\ub85c",def:"",unit:1,opts:["passport", "railroad", "guidebook", "lost"]},
    {w:"sidewalk",m:"\ubcf4\ub3c4, \uc776\ub3c4",def:"",unit:1,opts:["plane", "subway", "sidewalk", "transit"]},
    {w:"ticket",m:"\ud45c, \uc785\uc7a5\uad8c, \uc2b9\ucc28\uad8c, \ud2f0\ucf13",def:"",unit:1,opts:["ticket", "terminal", "railroad", "sidewalk"]},
    {w:"taxi",m:"\ud0dd\uc2dc",def:"",unit:1,opts:["taxi", "sightseeing", "downtown", "suitcase"]},
    {w:"traveler",m:"\uc5ec\ud589\uc790, \uc5ec\ud589\uac00",def:"",unit:1,opts:["suitcase", "sidewalk", "guidebook", "traveler"]},
    {w:"suitcase",m:"\uc5ec\ud589 \uac00\ubc29",def:"",unit:1,opts:["downtown", "suitcase", "subway", "plane"]},
    {w:"passport",m:"\uc5ec\uad8c",def:"",unit:1,opts:["lost", "tourist", "passport", "platform"]},
    {w:"downtown",m:"\uc2dc\ub0b4\uc5d0, \uc0c1\uc5c5\uc9c0\uad6c\ub85c",def:"",unit:1,opts:["traveler", "downtown", "subway", "guidebook"]},
    {w:"guidebook",m:"(\uc5ec\ud589) \uc546\ub0b4\uc11c",def:"",unit:1,opts:["sightseeing", "railroad", "harbor", "guidebook"]},
    {w:"plane",m:"\ube44\ud589\uae30",def:"",unit:1,opts:["plane", "lost", "platform", "scooter"]},
    {w:"subway",m:"\uc9c0\ud558\ucca0",def:"",unit:1,opts:["sidewalk", "scooter", "suitcase", "subway"]},
    {w:"lost",m:"\uae38\uc744 \uc783\uc740",def:"",unit:1,opts:["lost", "subway", "traveler", "harbor"]},
    {w:"transit",m:"\uad50\ud1b5 \uccb4\uacc4",def:"",unit:1,opts:["passport", "transit", "lost", "scooter"]},
    {w:"platform",m:"(\uae30\ucc28\uc5ed\uc758) \ud50c\ub7ab\ud3fc",def:"",unit:1,opts:["sightseeing", "tour", "traveler", "platform"]},
    {w:"harbor",m:"\ud56d\uad6c, \ud56d\ub9cc",def:"",unit:1,opts:["guidebook", "harbor", "tourist", "subway"]},
    {w:"scooter",m:"\uc2a4\ucfe0\ud130 (\uc18c\ud615 \uc624\ud1a0\ubc14\uc774)",def:"",unit:1,opts:["suitcase", "ticket", "scooter", "platform"]},
    {w:"sightseeing",m:"\uad00\uad11",def:"",unit:1,opts:["tourist", "passport", "railroad", "sightseeing"]},
    {w:"terminal",m:"\ud130\ubbf8\ub110, \uc885\ucc29\uc5ed",def:"",unit:1,opts:["lost", "ticket", "terminal", "traveler"]},
    {w:"tourist",m:"\uad00\uad11\uac1d",def:"",unit:1,opts:["sidewalk", "traveler", "passport", "tourist"]},
    {w:"tour",m:"(\uc5ec\ub7ec \ub3c4\uc2dc\uad6d\uac00 \ub4f1\uc744 \ubc29\ubb38\ud558\ub294) \uc5ec\ud589",def:"",unit:1,opts:["railroad", "tour", "suitcase", "taxi"]},
  ],
  "cew2_2": [
    {w:"camping",m:"\ucea0\ud551, \uc57c\uc601",def:"",unit:2,opts:["vacation", "stay", "camping", "arrive"]},
    {w:"toward",m:"~\ucabd\uc73c\ub85c, ~\uc744 \ud5a5\ud558\uc5ec",def:"",unit:2,opts:["toward", "driver", "camping", "stay"]},
    {w:"motorcycle",m:"\uc624\ud1a0\ubc14\uc774",def:"",unit:2,opts:["highway", "arrive", "adventure", "motorcycle"]},
    {w:"north",m:"\ubd81\ucabd",def:"",unit:2,opts:["north", "motorcycle", "helicopter", "depart"]},
    {w:"traffic",m:"(\ud2b9\uc813 \uc2dc\uac02\uc5d0 \ub3c4\ub85c\uc0c1\uc758) \ucc28\ub7c9\ub4e0, \uad50\ud1b5(\ub7c9)",def:"",unit:2,opts:["stay", "parking", "traffic", "corner"]},
    {w:"adventure",m:"\ubaa8\ud5d8",def:"",unit:2,opts:["north", "away", "adventure", "stay"]},
    {w:"south",m:"\ub0a8\ucabd",def:"",unit:2,opts:["stay", "helicopter", "south", "corner"]},
    {w:"tire",m:"(\uc790\ub3d9\ucc28 \ub4f1\uc758) (\uace0\ubb34) \ud0c0\uc774\uc5b4",def:"",unit:2,opts:["tire", "arrive", "adventure", "highway"]},
    {w:"helicopter",m:"\ud5ec\ub9ac\ucf65\ud130",def:"",unit:2,opts:["toward", "arrive", "helicopter", "adventure"]},
    {w:"visitor",m:"\ubc29\ubb38\uac1d, \uc190\ub2d8",def:"",unit:2,opts:["tire", "motorcycle", "visitor", "away"]},
    {w:"arrive",m:"(\ud2b9\ud788 \uc5ec\uc813 \ub05d\uc5d0) \ub3c4\ucc29\ud558\ub2e4",def:"",unit:2,opts:["adventure", "arrive", "corner", "stay"]},
    {w:"driver",m:"\uc6b4\uc802\uc790, \uae30\uc0ac",def:"",unit:2,opts:["camping", "toward", "motorcycle", "driver"]},
    {w:"stay",m:"(\ub2e4\ub978 \uacf3\uc5d0 \uac00\uc9c0 \uc54a\uace0) \uba38\ubb34\ub974\ub2e4",def:"",unit:2,opts:["south", "stay", "vacation", "toward"]},
    {w:"depart",m:"(\ud2b9\ud788 \uc5ec\ud589\uc744) \ub5a0\ub098\ub2e4",def:"",unit:2,opts:["away", "south", "depart", "stay"]},
    {w:"passenger",m:"\uc2b9\uac1d",def:"",unit:2,opts:["parking", "corner", "stay", "passenger"]},
    {w:"corner",m:"(\uac74\ubb3c, \uc0ac\ubb3c\uc758) \ubaa8\uc11c\ub9ac, \ubaa8\ud241\uc774",def:"",unit:2,opts:["corner", "helicopter", "motorcycle", "driver"]},
    {w:"away",m:"\ub5a8\uc5b4\uc9c2 \uacf3\uc5d0, \ub2e4\ub978 \ub370",def:"",unit:2,opts:["arrive", "traffic", "away", "camping"]},
    {w:"highway",m:"\uace0\uc18d\ub3c4\ub85c",def:"",unit:2,opts:["highway", "passenger", "toward", "parking"]},
    {w:"vacation",m:"\ubc29\ud559, \ud734\uac00",def:"",unit:2,opts:["toward", "north", "parking", "vacation"]},
    {w:"parking",m:"\uc8fc\ucc28, \uc8fc\ucc28 \uc9c0\uc5ed",def:"",unit:2,opts:["tire", "motorcycle", "depart", "parking"]},
  ],
  "cew2_3": [
    {w:"yogurt",m:"\uc694\uad6c\ub974\ud2b8",def:"",unit:3,opts:["noodle", "toast", "sandwich", "yogurt"]},
    {w:"smell",m:"(\ucf54\ub97c \uac00\uae4c\uc774 \ub300\uace0) \ub0c4\uc0c8\ub97c \ub9df\ub2e4",def:"",unit:3,opts:["jar", "chili", "smell", "steak"]},
    {w:"jar",m:"(\ud2b9\ud788 \uc7bc, \uafc0 \ub4f1\uc744 \ub2f4\uc544 \ub450\ub294) \ubcd1",def:"",unit:3,opts:["ginger", "smell", "garlic", "jar"]},
    {w:"oil",m:"(\uc694\ub9ac\uc6a9) \uae30\ub984, \uc2dd\uc6a9\uc720",def:"",unit:3,opts:["oil", "cooking", "fried", "sandwich"]},
    {w:"make",m:"(\uc7ac\ub8cc\ub97c \uc11e\uac70\ub098 \ubaa8\uc544\uc11c) \ub9cc\ub4e0\ub2e4",def:"",unit:3,opts:["steak", "chili", "make", "pizza"]},
    {w:"sandwich",m:"\uc0ca\ub4dc\uc704\uce58",def:"",unit:3,opts:["yogurt", "sandwich", "pizza", "noodle"]},
    {w:"pizza",m:"\ud53c\uc790",def:"",unit:3,opts:["yogurt", "pizza", "fried", "cooking"]},
    {w:"chef",m:"\uc694\ub9ac\uc0ac, \uc8fc\ubc29\uc7a5",def:"",unit:3,opts:["garlic", "chef", "ginger", "make"]},
    {w:"noodle",m:"\uad6d\uc218",def:"",unit:3,opts:["noodle", "steak", "smell", "make"]},
    {w:"chili",m:"\uace0\ucd94, \uce60\ub9ac",def:"",unit:3,opts:["fried", "jar", "chef", "chili"]},
    {w:"garlic",m:"\ub9c8\ub298",def:"",unit:3,opts:["pizza", "garlic", "cooking", "taste"]},
    {w:"fried",m:"\uae30\ub984\uc5d0 \ud280\uae34, \ud504\ub77c\uc774 \uc694\ub9ac\uc758",def:"",unit:3,opts:["ham", "steak", "sandwich", "fried"]},
    {w:"ginger",m:"\uc0dd\uac15",def:"",unit:3,opts:["smell", "oil", "ginger", "chili"]},
    {w:"menu",m:"(\uc2dd\ub2f9, \uc2dd\uc0ac\uc758) \uba54\ub274",def:"",unit:3,opts:["make", "taste", "pizza", "menu"]},
    {w:"cooking",m:"\uc694\ub9ac, \uc74c\uc2dd \uc900\ube44",def:"",unit:3,opts:["taste", "ham", "cooking", "smell"]},
    {w:"taste",m:"~\ud55a \ub9db\uc774 \ub098\ub2e4",def:"",unit:3,opts:["smell", "steak", "chili", "taste"]},
    {w:"ham",m:"\ud584 (\ub3fc\uc9c0 \ub113\uc801\ub2e4\ub9ac \ubd80\uc704\ub97c \uc18c\uae08\uc5d0 \uc803\uc774\uac70\ub098 \ud6c8\uc81c\ud55a \uac82)",def:"",unit:3,opts:["cracker", "ham", "toast", "noodle"]},
    {w:"toast",m:"\ud1a0\uc2a4\ud2b8",def:"",unit:3,opts:["toast", "menu", "yogurt", "taste"]},
    {w:"steak",m:"(\uc5b4\ub5a4 \uc885\ub958\uc758 \uace0\uae30\ub97c \ub450\ud23c\ud558\uac8c \uc790\ub978) \uc2a4\ud14c\uc774\ud06c",def:"",unit:3,opts:["chili", "pizza", "fried", "steak"]},
    {w:"cracker",m:"\ud06c\ub798\ucee4",def:"",unit:3,opts:["garlic", "chili", "taste", "cracker"]},
  ],
  "cew2_4": [
    {w:"lime",m:"\ub77c\uc784",def:"",unit:4,opts:["cream", "lime", "mug", "biscuit"]},
    {w:"cream",m:"(\uc6b0\uc720\ub85c \ub9cc\ub4de) \ud06c\ub9bc",def:"",unit:4,opts:["chopsticks", "lunchtime", "drink", "cream"]},
    {w:"nut",m:"\uacac\uacfc",def:"",unit:4,opts:["omelet", "nut", "drink", "watermelon"]},
    {w:"cereal",m:"(\ud754\ud788 \uc544\uce68 \uc2dd\uc0ac\ub85c \uc6b0\uc720\uc5d0 \ub9d0\uc544 \uba39\ub294) \uc2dc\ub9ac\uc5bc",def:"",unit:4,opts:["dessert", "strawberry", "mug", "cereal"]},
    {w:"mug",m:"(\uc190\uc7a1\uc774\uac00 \uc788\ub294) \ucef5",def:"",unit:4,opts:["chopsticks", "jelly", "mug", "cream"]},
    {w:"slice",m:"\uc870\uac01, \uc2ac\ub77c\uc774\uc2a4",def:"",unit:4,opts:["flour", "cereal", "slice", "omelet"]},
    {w:"jelly",m:"\uc824\ub9ac",def:"",unit:4,opts:["jelly", "slice", "chopsticks", "biscuit"]},
    {w:"dessert",m:"\ub514\uc800\ud2b8, \ud6c4\uc2dd",def:"",unit:4,opts:["lunchtime", "lettuce", "dessert", "cream"]},
    {w:"drink",m:"(\uc74c\ub8cc\ub97c) \ub9c8\uc2dc\ub2e4",def:"",unit:4,opts:["lime", "jelly", "drink", "lettuce"]},
    {w:"lunchtime",m:"\uc810\uc2ec \uc2dc\uac02",def:"",unit:4,opts:["lunchtime", "chopsticks", "straw", "cream"]},
    {w:"lettuce",m:"(\uc591) \uc0c1\ucd94",def:"",unit:4,opts:["nut", "lettuce", "jelly", "chopsticks"]},
    {w:"chopsticks",m:"\uc812\uac00\ub77d",def:"",unit:4,opts:["chopsticks", "dessert", "slice", "strawberry"]},
    {w:"flour",m:"(\uace1\ubb3c\uc758) \uac00\ub8e8, \ubc00\uac00\ub8e8",def:"",unit:4,opts:["flour", "watermelon", "chopsticks", "slice"]},
    {w:"omelet",m:"\uc624\ubbc8\ub81b",def:"",unit:4,opts:["drink", "dessert", "nut", "omelet"]},
    {w:"straw",m:"\ube68\ub300",def:"",unit:4,opts:["lime", "nut", "dessert", "straw"]},
    {w:"biscuit",m:"\ube44\uc2a4\ud0b7",def:"",unit:4,opts:["lettuce", "dessert", "mug", "biscuit"]},
    {w:"takeout",m:"(\uc0ac\uc11c \uc2dd\ub2f9\uc5d0\uc11c \uba39\uc9c0 \uc54a\uace0) \uac00\uc9c0\uace0 \uac00\ub294 \uc74c\uc2dd",def:"",unit:4,opts:["mug", "lime", "takeout", "lettuce"]},
    {w:"strawberry",m:"\ub538\uae30",def:"",unit:4,opts:["takeout", "strawberry", "slice", "drink"]},
    {w:"plate",m:"(\ubcf4\ud1b5 \ub465\uadf8\ub7f0) \uc811\uc2dc, \uadf8\ub987",def:"",unit:4,opts:["plate", "lime", "nut", "jelly"]},
    {w:"watermelon",m:"\uc218\ubc15",def:"",unit:4,opts:["omelet", "watermelon", "flour", "cereal"]},
  ],
  "cew2_5": [
    {w:"heal",m:"\uce58\uc720\ub418\ub2e4, \uce58\ub8cc\ud558\ub2e4, \ub0ab\uac8c\ud558\ub2e4",def:"",unit:5,opts:["treatment", "heal", "blind", "habit"]},
    {w:"fitness",m:"\uc2de\uccb4 \ub2e8\ub826, (\uc2de\uccb4\uc801\uc776) \uac74\uac15",def:"",unit:5,opts:["fitness", "heal", "often", "hip"]},
    {w:"breath",m:"(\uc228\uc744 \uc274 \ub54c \uc785\uc5d0\uc11c \ub098\uc624\ub294) \uc785\uae40, \uc228",def:"",unit:5,opts:["fitness", "habit", "breath", "blind"]},
    {w:"habit",m:"\ubc84\ub987, \uc2b5\uad00",def:"",unit:5,opts:["condition", "habit", "disabled", "hip"]},
    {w:"hip",m:"\ud5c8\ub9ac, \ub454\ubd80",def:"",unit:5,opts:["painful", "fitness", "hip", "disabled"]},
    {w:"blind",m:"\ub208\uc774 \uba3a, \ub9f9\uc776\uc776",def:"",unit:5,opts:["treatment", "blind", "tablet", "harm"]},
    {w:"treatment",m:"\uce58\ub8cc, \ucc98\uce58",def:"",unit:5,opts:["ache", "treatment", "result", "tablet"]},
    {w:"often",m:"\uc790\uc8fc, \ud754\ud788, \ubcf4\ud1b5",def:"",unit:5,opts:["bleed", "cure", "often", "breath"]},
    {w:"painful",m:"\uc544\ud508, \uace0\ud1b5\uc2a4\ub7ec\uc6b4, \uad34\ub85c\uc6b4",def:"",unit:5,opts:["result", "hip", "painful", "treatment"]},
    {w:"bleed",m:"\ud53c\ub97c \ud758\ub9ac\ub2e4, \ud53c\uac00 \ub098\ub2e4",def:"",unit:5,opts:["alive", "hip", "bleed", "painful"]},
    {w:"condition",m:"(\uac74\uac15) \uc0c1\ud0dc",def:"",unit:5,opts:["blind", "condition", "breath", "bleed"]},
    {w:"needle",m:"(\uc8fc\uc0ac) \ubc14\ub298, \uce68",def:"",unit:5,opts:["breath", "bleed", "result", "needle"]},
    {w:"disabled",m:"\uc7a5\uc560\ub97c \uac00\uc9c2",def:"",unit:5,opts:["habit", "often", "breath", "disabled"]},
    {w:"result",m:"\uacb0\uacfc",def:"",unit:5,opts:["needle", "bleed", "breath", "result"]},
    {w:"ache",m:"\uc544\ud504\ub2e4",def:"",unit:5,opts:["blind", "harm", "ache", "condition"]},
    {w:"alive",m:"\uc0b4\uc544 \uc788\ub294",def:"",unit:5,opts:["alive", "disabled", "painful", "hip"]},
    {w:"disease",m:"\uc9c8\ubcd1, \ubcd1, \uc9c8\ud656",def:"",unit:5,opts:["disease", "disabled", "habit", "blind"]},
    {w:"harm",m:"\ud574\ub97c \ub07c\uce58\ub2e4, \ud574\uce58\ub2e4",def:"",unit:5,opts:["hip", "harm", "breath", "disabled"]},
    {w:"tablet",m:"\uc813\uc81c",def:"",unit:5,opts:["blind", "painful", "tablet", "disease"]},
    {w:"cure",m:"\uce58\ub8cc\ud558\ub2e4, \uace0\uce58\ub2e4",def:"",unit:5,opts:["ache", "alive", "blind", "cure"]},
  ],
  "cew2_6": [
    {w:"hunger",m:"\uad76\uc8fc\ub9bc, \ubc30\uace0\ud514",def:"",unit:6,opts:["asleep", "chubby", "hunger", "weight"]},
    {w:"drug",m:"\uc57d\ubb3c",def:"",unit:6,opts:["weight", "drug", "illness", "chubby"]},
    {w:"operation",m:"\uc218\uc220",def:"",unit:6,opts:["muscle", "cast", "normal", "operation"]},
    {w:"cough",m:"\uae30\uce68\ud558\ub2e4",def:"",unit:6,opts:["cough", "cast", "virus", "muscle"]},
    {w:"virus",m:"\ubc14\uc774\ub7ec\uc2a4, \ubc14\uc774\ub7ec\uc2a4\uc131 \uc9c8\ud656",def:"",unit:6,opts:["belly", "virus", "illness", "hunger"]},
    {w:"deaf",m:"\uadc0\uac00 \uba39\uc740, \uccad\uac01 \uc7a5\uc560\uac00 \uc788\ub294",def:"",unit:6,opts:["weight", "clinic", "deaf", "normal"]},
    {w:"belly",m:"\ubc30",def:"",unit:6,opts:["belly", "drug", "weight", "fever"]},
    {w:"muscle",m:"\uadfa\uc721",def:"",unit:6,opts:["deaf", "hunger", "chubby", "muscle"]},
    {w:"emergency",m:"\ube44\uc0c1 (\uc0ac\ud0dc)",def:"",unit:6,opts:["operation", "emergency", "forehead", "illness"]},
    {w:"cast",m:"\uae41\uc2a4",def:"",unit:6,opts:["asleep", "illness", "cast", "drug"]},
    {w:"fever",m:"\uc5f4, \uc5f4\ubcd1",def:"",unit:6,opts:["cough", "deaf", "fever", "clinic"]},
    {w:"asleep",m:"\uc7a0\uc774 \ub4de, \uc790\uace0 \uc788\ub294",def:"",unit:6,opts:["drug", "illness", "cough", "asleep"]},
    {w:"recover",m:"(\uac74\uac15\uc774) \ud68c\ubcf5\ub418\ub2e4",def:"",unit:6,opts:["emergency", "muscle", "deaf", "recover"]},
    {w:"illness",m:"\ubcd1, \uc544\ud514",def:"",unit:6,opts:["illness", "muscle", "cast", "drug"]},
    {w:"clinic",m:"(\uc802\ubb38 \ubd82\uc57c) \ubcd1\uc6d0",def:"",unit:6,opts:["clinic", "fever", "virus", "hunger"]},
    {w:"normal",m:"\ubcf4\ud1b5\uc758, \ud3c9\ubc94\ud55a",def:"",unit:6,opts:["asleep", "illness", "normal", "fever"]},
    {w:"weight",m:"\ubb34\uac8c, \uccb4\uc911",def:"",unit:6,opts:["hunger", "normal", "weight", "operation"]},
    {w:"chubby",m:"\ud1b5\ud1b5\ud55a, \ud1a0\uc2e4\ud1a0\uc2e4\ud55a",def:"",unit:6,opts:["chubby", "hunger", "weight", "drug"]},
    {w:"forehead",m:"\uc774\ub9c8",def:"",unit:6,opts:["virus", "forehead", "emergency", "deaf"]},
  ],
  "cew2_7": [
    {w:"training",m:"\uad50\uc721, \ud6c8\ub826, \uc5f0\uc218",def:"",unit:7,opts:["employer", "training", "department", "baker"]},
    {w:"career",m:"\uc9c1\uc5c5 (\ubcf4\ud1b5 \uc2dc\uac02\uc774 \ud750\ub97c\uc218\ub85d \ucc45\uc784\ub3c4 \ucee4\uc9c0\ub294 \uc9c1\uc885)",def:"",unit:7,opts:["career", "designer", "agency", "salary"]},
    {w:"baker",m:"\uc81c\ube75\uc0ac, \ube75\uc9d1 \uc8fc\uc776",def:"",unit:7,opts:["baker", "career", "writer", "trade"]},
    {w:"company",m:"\ud68c\uc0ac",def:"",unit:7,opts:["company", "industry", "employer", "salary"]},
    {w:"professional",m:"\uc802\ubb38\uc758, \ud504\ub85c\uc758, \uc9c1\uc5c5\uc758",def:"",unit:7,opts:["professional", "opportunity", "designer", "organization"]},
    {w:"opportunity",m:"\uae30\ud68c",def:"",unit:7,opts:["opportunity", "agency", "writer", "designer"]},
    {w:"salary",m:"\uae09\uc5ec, \ubd09\uae09",def:"",unit:7,opts:["salary", "organization", "company", "manager"]},
    {w:"industry",m:"(\ud2b9\uc813 \ubd82\uc57c\uc758) \uc0b0\uc5c5, \uacf5\uc5c5, \uc81c\uc870\uc5c5",def:"",unit:7,opts:["trade", "industry", "secretary", "department"]},
    {w:"designer",m:"\ub514\uc790\uc774\ub108",def:"",unit:7,opts:["professor", "manager", "secretary", "designer"]},
    {w:"department",m:"(\uc813\ubd80, \uae30\uc5c5\uccb4, \ub300\ud559 \ub4f1\uacfc \uac19\uc740 \uc870\uc9c1\uc758 \ud55a) \ubd80\uc11c",def:"",unit:7,opts:["secretary", "department", "employer", "career"]},
    {w:"agency",m:"\ub300\ub9ac\uc810, \ub300\ud589\uc0ac, (\ud2b9\uc813 \uc11c\ube44\uc2a4 \uc81c\uacf5) \ub2e8\uccb4",def:"",unit:7,opts:["agency", "manager", "department", "company"]},
    {w:"organization",m:"\uc870\uc9c1, \ub2e8\uccb4, \uae30\uad6c",def:"",unit:7,opts:["opportunity", "librarian", "professor", "organization"]},
    {w:"employer",m:"\uace0\uc6a9\uc8fc, \uace0\uc6a9\uc776",def:"",unit:7,opts:["training", "employer", "professional", "secretary"]},
    {w:"secretary",m:"\ube44\uc11c",def:"",unit:7,opts:["company", "opportunity", "secretary", "writer"]},
    {w:"staff",m:"(\uc802\uccb4) \uc9c1\uc6d0",def:"",unit:7,opts:["designer", "department", "staff", "manager"]},
    {w:"librarian",m:"\uc0ac\uc11c",def:"",unit:7,opts:["manager", "agency", "librarian", "writer"]},
    {w:"writer",m:"\uc791\uac00",def:"",unit:7,opts:["manager", "baker", "writer", "librarian"]},
    {w:"professor",m:"\uad50\uc218",def:"",unit:7,opts:["organization", "professor", "industry", "manager"]},
    {w:"trade",m:"\uac70\ub798\ud558\ub2e4, \uad50\uc5ed\ud558\ub2e4, \ubb34\uc5ed\ud558\ub2e4",def:"",unit:7,opts:["designer", "salary", "trade", "writer"]},
    {w:"manager",m:"\uacbd\uc601\uc790, \uac10\ub3c5, \ub9e4\ub2c8\uc800",def:"",unit:7,opts:["manager", "secretary", "training", "company"]},
  ],
  "cew2_8": [
    {w:"pirate",m:"\ud574\uc801",def:"",unit:8,opts:["business", "duty", "detective", "pirate"]},
    {w:"athlete",m:"(\uc6b4\ub3d9) \uc120\uc218",def:"",unit:8,opts:["salesman", "veterinarian", "athlete", "director"]},
    {w:"musician",m:"\uc74c\uc545\uac00, \ubba4\uc9c0\uc158",def:"",unit:8,opts:["musician", "deal", "duty", "mechanic"]},
    {w:"detective",m:"\ud615\uc0ac, \uc218\uc0ac\uad00, \ud0d0\uc813",def:"",unit:8,opts:["business", "mayor", "director", "detective"]},
    {w:"reporter",m:"\uae30\uc790, \ub9ac\ud3ec\ud130",def:"",unit:8,opts:["reporter", "pirate", "veterinarian", "mayor"]},
    {w:"director",m:"\uac10\ub3c5, \uc5f0\ucd9c\uc790",def:"",unit:8,opts:["detective", "firefighter", "advertise", "director"]},
    {w:"benefit",m:"\ud61c\ud0dd, \uc774\ub4dd",def:"",unit:8,opts:["benefit", "pirate", "journalist", "veterinarian"]},
    {w:"senior",m:"(\uacc4\uae09, \uc9c0\uc704\uac00) \uace0\uc704\uc758, \uc0c1\uc704\uc758",def:"",unit:8,opts:["mechanic", "benefit", "senior", "pilot"]},
    {w:"advertise",m:"(\uc0c1\ud488\uc774\ub098 \uc11c\ube44\uc2a4\ub97c) \uad11\uace0\ud558\ub2e4",def:"",unit:8,opts:["advertise", "deal", "salesman", "musician"]},
    {w:"mechanic",m:"(\ud2b9\ud788 \ucc28\ub7c9 \uc5d4\uc9c2) \uc813\ube44\uacf5",def:"",unit:8,opts:["reporter", "mechanic", "deal", "business"]},
    {w:"veterinarian",m:"\uc218\uc758\uc0ac",def:"",unit:8,opts:["pirate", "duty", "veterinarian", "business"]},
    {w:"salesman",m:"\ud310\ub9e4\uc6d0, \uc678\ud310\uc6d0",def:"",unit:8,opts:["mechanic", "senior", "mayor", "salesman"]},
    {w:"business",m:"\uc0ac\uc5c5, \uc0c1\uc5c5, \uc7a5\uc0ac",def:"",unit:8,opts:["mechanic", "senior", "advertise", "business"]},
    {w:"journalist",m:"\uc800\ub110\ub9ac\uc2a4\ud2b8, \uae30\uc790",def:"",unit:8,opts:["firefighter", "business", "journalist", "reporter"]},
    {w:"deal",m:"\uac70\ub798, (\uc0ac\uc5c5\uc0c1\uc758) \ud569\uc758",def:"",unit:8,opts:["director", "pilot", "deal", "veterinarian"]},
    {w:"duty",m:"\uc9c1\ubb34, \uc784\ubb34",def:"",unit:8,opts:["reporter", "benefit", "duty", "athlete"]},
    {w:"mayor",m:"\uc2dc\uc7a5, \uad6e\uc218",def:"",unit:8,opts:["mayor", "detective", "athlete", "director"]},
    {w:"lawyer",m:"\ubcc0\ud638\uc0ac",def:"",unit:8,opts:["pirate", "lawyer", "deal", "duty"]},
    {w:"pilot",m:"\uc870\uc885\uc0ac, \ube44\ud589\uc0ac",def:"",unit:8,opts:["veterinarian", "pilot", "detective", "athlete"]},
    {w:"firefighter",m:"\uc18c\ubc29\uad00",def:"",unit:8,opts:["advertise", "senior", "firefighter", "pilot"]},
  ],
  "cew2_9": [
    {w:"note",m:"\uba54\ubaa8, \ucabd\uc9c0",def:"",unit:9,opts:["notebook", "note", "conversation", "problem"]},
    {w:"notebook",m:"\ub178\ud2b8, \uacf5\ucc45",def:"",unit:9,opts:["explanation", "repeat", "speak", "notebook"]},
    {w:"explanation",m:"\uc124\uba85, \uc774\uc720",def:"",unit:9,opts:["repeat", "document", "conversation", "explanation"]},
    {w:"news",m:"\ub274\uc2a4, \uc18c\uc2dd",def:"",unit:9,opts:["write", "explanation", "news", "show"]},
    {w:"repeat",m:"\ubc18\ubcf5\ud558\ub2e4, \ub418\ud480\uc774\ud558\ub2e4",def:"",unit:9,opts:["repeat", "write", "document", "internet"]},
    {w:"write",m:"\uc4f0\ub2e4, \uc791\uc131\ud558\ub2e4",def:"",unit:9,opts:["show", "conversation", "write", "document"]},
    {w:"internet",m:"\uc776\ud130\ub137",def:"",unit:9,opts:["show", "context", "internet", "note"]},
    {w:"show",m:"\ubcf4\uc5ec \uc8fc\ub2e4",def:"",unit:9,opts:["show", "explanation", "note", "notebook"]},
    {w:"problem",m:"\ubb38\uc81c",def:"",unit:9,opts:["comment", "notebook", "problem", "show"]},
    {w:"speak",m:"\uc774\uc57c\uae30\ud558\ub2e4",def:"",unit:9,opts:["conversation", "write", "speak", "document"]},
    {w:"detail",m:"\uc138\ubd80 \uc0ac\ud56d",def:"",unit:9,opts:["detail", "news", "notebook", "explanation"]},
    {w:"context",m:"(\uae00\uc758) \ub9e5\ub77d, \ubb38\ub9e5",def:"",unit:9,opts:["detail", "internet", "explanation", "context"]},
    {w:"clearly",m:"\ub610\ub837\ud558\uac8c",def:"",unit:9,opts:["problem", "speak", "list", "clearly"]},
    {w:"comment",m:"\ub17c\ud3c9, \uc5b6\uae09",def:"",unit:9,opts:["problem", "clearly", "conversation", "comment"]},
    {w:"list",m:"\ub9ac\uc2a4\ud2b8, \ubaa9\ub85d, \uba85\ub2e8",def:"",unit:9,opts:["news", "explanation", "list", "conversation"]},
    {w:"shout",m:"\uc678\uce58\ub2e4, \uc18c\ub9ac\uce58\ub2e4",def:"",unit:9,opts:["note", "news", "shout", "speak"]},
    {w:"diary",m:"\uc777\uae30",def:"",unit:9,opts:["internet", "show", "diary", "list"]},
    {w:"conversation",m:"\ub300\ud654, \ud68c\ud654",def:"",unit:9,opts:["conversation", "comment", "context", "internet"]},
    {w:"document",m:"\uc11c\ub958, \ubb38\uc11c",def:"",unit:9,opts:["list", "document", "show", "write"]},
  ],
  "cew2_10": [
    {w:"greet",m:"\ud656\uc601\ud558\ub2e4, \ub9de\ub2e4",def:"",unit:10,opts:["stamp", "joke", "postcard", "greet"]},
    {w:"forget",m:"(\uacfc\uac70\uc758 \uc777, \uc802\uc5d0 \uc54c\uace0 \uc788\ub358 \uac82\uc744) \uc78a\ub2e4",def:"",unit:10,opts:["invite", "forget", "stamp", "greet"]},
    {w:"stamp",m:"\uc6b0\ud45c",def:"",unit:10,opts:["talk", "sorry", "stamp", "greet"]},
    {w:"sorry",m:"\ubbf8\uc546\ud55a, \uc720\uac10\uc2a4\ub7ec\uc6b4",def:"",unit:10,opts:["ink", "stamp", "sorry", "postcard"]},
    {w:"joke",m:"\ub18d\ub2f4, \uc6b0\uc2a4\uac1c",def:"",unit:10,opts:["ink", "welcome", "joke", "postcard"]},
    {w:"postcard",m:"\uc5fd\uc11c",def:"",unit:10,opts:["fully", "greet", "welcome", "postcard"]},
    {w:"tell",m:"\ub9d0\ud558\ub2e4, \uc54c\ub824\uc8fc\ub2e4",def:"",unit:10,opts:["bow", "tell", "sure", "welcome"]},
    {w:"invite",m:"\ucd08\ub300\ud558\ub2e4, \ucd08\uccad\ud558\ub2e4",def:"",unit:10,opts:["joke", "bow", "fully", "invite"]},
    {w:"envelope",m:"\ubd09\ud22c",def:"",unit:10,opts:["envelope", "talk", "bow", "greet"]},
    {w:"maybe",m:"\uc544\ub9c8, \uc5b4\uca4c\uba74, \ud639\uc2dc",def:"",unit:10,opts:["postcard", "maybe", "handwriting", "bow"]},
    {w:"meeting",m:"\ud68c\uc758",def:"",unit:10,opts:["fully", "greet", "meeting", "stamp"]},
    {w:"ink",m:"\uc789\ud06c",def:"",unit:10,opts:["joke", "greet", "invite", "ink"]},
    {w:"message",m:"\uba54\uc2dc\uc9c0",def:"",unit:10,opts:["postcard", "message", "ink", "bow"]},
    {w:"welcome",m:"\ub9de\uc774\ud558\ub2e4, \ud656\uc601\ud558\ub2e4",def:"",unit:10,opts:["fully", "welcome", "ink", "handwriting"]},
    {w:"talk",m:"\ub9d0\ud558\ub2e4, \uc774\uc57c\uae30\ud558\ub2e4, \uc218\ub2e4\ub97c \ub5a8\ub2e4",def:"",unit:10,opts:["message", "handwriting", "talk", "forget"]},
    {w:"sure",m:"\ud655\uc2de\ud558\ub294, \ud655\uc2e4\ud788",def:"",unit:10,opts:["print", "sure", "fully", "message"]},
    {w:"bow",m:"\uc776\uc0ac\ud558\ub2e4",def:"",unit:10,opts:["bow", "message", "stamp", "talk"]},
    {w:"print",m:"\uc776\uc1c4\ud558\ub2e4, \ud504\ub9b0\ud2b8\ub97c\ud558\ub2e4",def:"",unit:10,opts:["forget", "print", "stamp", "invite"]},
    {w:"handwriting",m:"\uce5c\ud544, (\uac1c\uc776\uc758) \ud544\uc801",def:"",unit:10,opts:["sorry", "handwriting", "sure", "postcard"]},
    {w:"fully",m:"\uc644\uc802\ud788, \ucda9\ubd82\ud788",def:"",unit:10,opts:["invite", "fully", "ink", "forget"]},
  ],
  "cew2_11": [
    {w:"teach",m:"(\uc5b4\ub5a4 \uacfc\ubaa9\uc744) \uac00\ub974\uce58\ub2e4",def:"",unit:11,opts:["teach", "student", "childhood", "vocabulary"]},
    {w:"campus",m:"(\ub300\ud559) \uad50\uc813",def:"",unit:11,opts:["purpose", "campus", "learn", "rank"]},
    {w:"university",m:"\ub300\ud559",def:"",unit:11,opts:["kindergarten", "rank", "university", "vocabulary"]},
    {w:"crayon",m:"\ud06c\ub808\uc6a9",def:"",unit:11,opts:["campus", "rank", "purpose", "crayon"]},
    {w:"course",m:"\uac15\uc758, \uac15\uc88c",def:"",unit:11,opts:["kindergarten", "lecture", "course", "learn"]},
    {w:"marker",m:"\ub9e4\uc9c1\ud39c",def:"",unit:11,opts:["marker", "university", "campus", "student"]},
    {w:"vocabulary",m:"\uc5b4\ud718, \uc6a9\uc5b4",def:"",unit:11,opts:["marker", "vocabulary", "student", "teach"]},
    {w:"whiteboard",m:"\ud654\uc774\ud2b8\ubcf4\ub4dc",def:"",unit:11,opts:["marker", "childhood", "whiteboard", "teach"]},
    {w:"learn",m:"\ubc30\uc6b0\ub2e4, \ud559\uc2b5\ud558\ub2e4",def:"",unit:11,opts:["academy", "lecture", "learn", "vocabulary"]},
    {w:"academy",m:"(\ud2b9\uc218 \ubd82\uc57c\uc758) \ud559\uad50",def:"",unit:11,opts:["student", "lecture", "difficulty", "academy"]},
    {w:"understand",m:"(\ub0a8\uc758 \ub9d0, \ub2e8\uc5b4\uc758 \uc758\ubbf8, \uc5b6\uc5b4 \ub4f1\uc744) \uc774\ud574\ud558\ub2e4, \uc54c\uc544\ub4df\ub2e4, \uc54c\ub2e4",def:"",unit:11,opts:["eraser", "academy", "understand", "purpose"]},
    {w:"childhood",m:"\uc5b4\ub9b0 \uc2dc\uc803",def:"",unit:11,opts:["kindergarten", "childhood", "university", "crayon"]},
    {w:"lecture",m:"\uac15\uc758, \uac15\uc5f0",def:"",unit:11,opts:["university", "lecture", "vocabulary", "purpose"]},
    {w:"gym",m:"\uccb4\uc721\uad00",def:"",unit:11,opts:["student", "gym", "university", "course"]},
    {w:"eraser",m:"\uc9c0\uc6b0\uac1c",def:"",unit:11,opts:["course", "gym", "eraser", "lecture"]},
    {w:"kindergarten",m:"\uc720\uce58\uc6d0",def:"",unit:11,opts:["student", "kindergarten", "difficulty", "childhood"]},
    {w:"rank",m:"(\ub4f1\uae09, \ub4f1\uc704, \uc21a\uc704\ub97c) \ucc28\uc9c0\ud558\ub2e4, \ub9e4\uae30\ub2e4, \ud3c9\uac00\ud558\ub2e4",def:"",unit:11,opts:["vocabulary", "understand", "rank", "campus"]},
    {w:"purpose",m:"\ubaa9\uc801",def:"",unit:11,opts:["purpose", "vocabulary", "campus", "student"]},
    {w:"difficulty",m:"\uc5b4\ub824\uc6c0, \uace2\uacbd",def:"",unit:11,opts:["learn", "gym", "difficulty", "purpose"]},
    {w:"student",m:"\ud559\uc0dd",def:"",unit:11,opts:["understand", "academy", "student", "childhood"]},
  ],
  "cew2_12": [
    {w:"junior",m:"\ub098\uc774 \uc5b4\ub9b0, \uc190\uc544\ub798\uc758",def:"",unit:12,opts:["remember", "quiz", "junior", "pe"]},
    {w:"pe",m:"\uccb4\uc721",def:"",unit:12,opts:["pe", "principal", "study", "textbook"]},
    {w:"line",m:"\uc120",def:"",unit:12,opts:["line", "quiz", "dictionary", "remember"]},
    {w:"check",m:"\ud655\uc776\ud558\ub2e4, \uc810\uac80\ud558\ub2e4",def:"",unit:12,opts:["quiz", "check", "junior", "cafeteria"]},
    {w:"mistake",m:"\uc2e4\uc218, \uc798\ubabb",def:"",unit:12,opts:["textbook", "dictionary", "classmate", "mistake"]},
    {w:"homework",m:"\uc219\uc81c, \uacfc\uc81c",def:"",unit:12,opts:["check", "chalk", "line", "homework"]},
    {w:"quiz",m:"\ud034\uc988",def:"",unit:12,opts:["quiz", "dictionary", "chalk", "scissors"]},
    {w:"blackboard",m:"\uce60\ud310",def:"",unit:12,opts:["pe", "blackboard", "remember", "homework"]},
    {w:"tape",m:"\ud14c\uc774\ud504",def:"",unit:12,opts:["tape", "mistake", "textbook", "remember"]},
    {w:"classmate",m:"\uae09\uc6b0, \ub3d9\uae09\uc0dd",def:"",unit:12,opts:["classmate", "line", "quiz", "cafeteria"]},
    {w:"practice",m:"\uc5f0\uc2b5\ud558\ub2e4",def:"",unit:12,opts:["classmate", "dictionary", "mistake", "practice"]},
    {w:"principal",m:"\uad50\uc7a5, \ud559\uc7a5, \ucd1d\uc7a5",def:"",unit:12,opts:["remember", "principal", "junior", "cafeteria"]},
    {w:"dictionary",m:"\uc0ac\uc802",def:"",unit:12,opts:["quiz", "homework", "dictionary", "pe"]},
    {w:"cafeteria",m:"\uad6c\ub0b4\uc2dd\ub2f9, \uce74\ud398\ud14c\ub9ac\uc544",def:"",unit:12,opts:["textbook", "study", "club", "cafeteria"]},
    {w:"scissors",m:"\uac00\uc704",def:"",unit:12,opts:["homework", "club", "scissors", "textbook"]},
    {w:"chalk",m:"\ubd82\ud544",def:"",unit:12,opts:["scissors", "chalk", "study", "dictionary"]},
    {w:"remember",m:"\uae30\uc5b5\ud558\ub2e4",def:"",unit:12,opts:["remember", "mistake", "classmate", "scissors"]},
    {w:"club",m:"\ub3d9\ud638\ud68c",def:"",unit:12,opts:["check", "club", "mistake", "homework"]},
    {w:"study",m:"\uacf5\ubd80\ud558\ub2e4, \ubc30\uc6b0\ub2e4",def:"",unit:12,opts:["study", "tape", "dictionary", "line"]},
    {w:"textbook",m:"\uad50\uacfc\uc11c",def:"",unit:12,opts:["textbook", "line", "principal", "tape"]},
  ],
  "cew2_13": [
    {w:"pleased",m:"\uae30\uc05c, \uae30\ubed0\ud558\ub294, \ub9cc\uc871\ud574\ud558\ub294",def:"",unit:13,opts:["powerful", "helpful", "creative", "pleased"]},
    {w:"happiness",m:"\ud589\ubcf5, \ub9cc\uc871, \uae30\uc068",def:"",unit:13,opts:["happiness", "congratulations", "careless", "clever"]},
    {w:"powerful",m:"\uc601\ud5a5\ub825 \uc788\ub294, \uc720\ub825\ud55a",def:"",unit:13,opts:["astonish", "congratulations", "careless", "powerful"]},
    {w:"astonish",m:"\uae5c\uc9dd \ub180\ub77c\uac8c \ud558\ub2e4",def:"",unit:13,opts:["careless", "astonish", "lovely", "powerful"]},
    {w:"scary",m:"\ubb34\uc11c\uc6b4, \uac81\ub098\ub294",def:"",unit:13,opts:["ashamed", "emotional", "scary", "powerful"]},
    {w:"silly",m:"\uc5b4\ub9ac\uc11d\uc740, \ubc14\ubcf4 \uac19\uc740",def:"",unit:13,opts:["astonish", "powerful", "pleased", "silly"]},
    {w:"serious",m:"\uc2ec\uac01\ud55a, \uc9c2\uc9c0\ud55a",def:"",unit:13,opts:["helpful", "serious", "lazy", "scary"]},
    {w:"ashamed",m:"\ucc3d\ud53c\ud55a, \uc218\uce58\uc2a4\ub7ec\uc6b4",def:"",unit:13,opts:["serious", "powerful", "ashamed", "talent"]},
    {w:"lazy",m:"\uac8c\uc73c\ub978",def:"",unit:13,opts:["lazy", "congratulations", "silly", "scary"]},
    {w:"lovely",m:"\uc0ac\ub791\uc2a4\ub7ec\uc6b4, \uc544\ub984\ub2e4\uc6b4",def:"",unit:13,opts:["silly", "lovely", "stupid", "emotional"]},
    {w:"creative",m:"\ucc3d\uc870\uc801\uc776, \ucc3d\uc758\uc801\uc776",def:"",unit:13,opts:["stupid", "creative", "happiness", "fool"]},
    {w:"talent",m:"\uc7ac\ub2a5",def:"",unit:13,opts:["congratulations", "talent", "surprised", "helpful"]},
    {w:"emotional",m:"\uc813\uc11c\uc758, \uac10\uc813\uc758",def:"",unit:13,opts:["congratulations", "clever", "stupid", "emotional"]},
    {w:"careless",m:"\ubd80\uc8fc\uc758\ud55a, \uc870\uc2ec\uc131 \uc5c6\ub294",def:"",unit:13,opts:["powerful", "careless", "helpful", "congratulations"]},
    {w:"stupid",m:"\uc5b4\ub9ac\uc11d\uc740, \ub454\ud55a",def:"",unit:13,opts:["happiness", "lovely", "stupid", "ashamed"]},
    {w:"surprised",m:"\ub180\ub77e, \ub180\ub77c\ub294",def:"",unit:13,opts:["emotional", "fool", "stupid", "surprised"]},
    {w:"helpful",m:"\ub3c4\uc6c0\uc774 \ub418\ub294, \uae30\uaebc\uc774 \ub3d5\ub294",def:"",unit:13,opts:["lovely", "pleased", "emotional", "helpful"]},
    {w:"clever",m:"\uc601\ub9ac\ud55a, \ub611\ub611\ud55a",def:"",unit:13,opts:["serious", "astonish", "clever", "careless"]},
    {w:"congratulations",m:"\ucd95\ud558 (\uc776\uc0ac)",def:"",unit:13,opts:["congratulations", "creative", "scary", "serious"]},
    {w:"fool",m:"\ubc14\ubcf4",def:"",unit:13,opts:["fool", "emotional", "stupid", "silly"]},
  ],
  "cew2_14": [
    {w:"noisy",m:"\uc2dc\ub044\ub7ec\uc6b4",def:"",unit:14,opts:["enjoyable", "noisy", "boring", "realize"]},
    {w:"scared",m:"\ubb34\uc11c\uc6cc\ud558\ub294, \uac81\uba39\uc740",def:"",unit:14,opts:["noisy", "enjoyable", "boring", "scared"]},
    {w:"bother",m:"\uc2de\uacbd \uc4f0\uc774\uac8c \ud558\ub2e4, \uad34\ub86d\ud788\ub2e4",def:"",unit:14,opts:["bother", "gentle", "enjoyable", "peaceful"]},
    {w:"gentle",m:"\uc628\ud654\ud55a, \uc21a\ud55a",def:"",unit:14,opts:["lucky", "happily", "gentle", "bother"]},
    {w:"feeling",m:"\ub290\ub08c, \uae30\ubd82",def:"",unit:14,opts:["feeling", "scared", "realize", "boring"]},
    {w:"interested",m:"\uad00\uc2ec\uc788\uc5b4 \ud558\ub294",def:"",unit:14,opts:["interested", "scared", "happily", "excitement"]},
    {w:"lucky",m:"\uc6b4\uc774 \uc88b\uc740, \ud589\uc6b4\uc758",def:"",unit:14,opts:["excitement", "happily", "lucky", "wish"]},
    {w:"realize",m:"\uc54c\uc544\ucc28\ub9ac\ub2e4, \uae68\ub2eb\ub2e4",def:"",unit:14,opts:["realize", "happily", "scared", "peaceful"]},
    {w:"wish",m:"\uc6d0\ud558\ub2e4, \ubc14\ub77c\ub2e4",def:"",unit:14,opts:["wish", "scared", "cheerful", "gentle"]},
    {w:"cheerful",m:"\ubc1c\ub77f\ud55a, \ucf8c\ud657\ud55a",def:"",unit:14,opts:["background", "enjoyable", "cheerful", "realize"]},
    {w:"careful",m:"\uc870\uc2ec\ud558\ub294, \uc8fc\uc758 \uae4a\uc740",def:"",unit:14,opts:["background", "peaceful", "careful", "realize"]},
    {w:"peaceful",m:"\ud3c9\ud654\ub85c\uc6b4",def:"",unit:14,opts:["interested", "wish", "lucky", "peaceful"]},
    {w:"attract",m:"\ub9c8\uc74c\uc744 \ub04c\ub2e4",def:"",unit:14,opts:["gentle", "attract", "calm", "enjoyable"]},
    {w:"attitude",m:"\ud0dc\ub3c4, \uc790\uc138",def:"",unit:14,opts:["attitude", "attract", "careful", "gentle"]},
    {w:"calm",m:"\uce68\ucc29\ud55a, \ucc28\ubd82\ud55a",def:"",unit:14,opts:["attitude", "attract", "calm", "realize"]},
    {w:"background",m:"(\uac1c\uc776\uc758) \ubc30\uacbd",def:"",unit:14,opts:["cheerful", "noisy", "background", "feeling"]},
    {w:"boring",m:"\uc7ac\ubbf8\uc5c6\ub294, \uc9c0\ub8e8\ud55a",def:"",unit:14,opts:["peaceful", "feeling", "lucky", "boring"]},
    {w:"excitement",m:"\ud765\ubd82, \uc2de\ub0a8",def:"",unit:14,opts:["background", "excitement", "attract", "realize"]},
    {w:"enjoyable",m:"\uc990\uac70\uc6b4",def:"",unit:14,opts:["enjoyable", "peaceful", "wish", "scared"]},
    {w:"happily",m:"\ud589\ubcf5\ud558\uac8c, \ub9cc\uc871\uc2a4\ub7fd\uac8c",def:"",unit:14,opts:["enjoyable", "careful", "calm", "happily"]},
  ],
  "cew2_15": [
    {w:"cousin",m:"\uc0ac\ucd0c, \uce5c\ucc99",def:"",unit:15,opts:["merry", "cousin", "party", "sister"]},
    {w:"girlfriend",m:"\uc5ec\uc790 \uce5c\uad6c",def:"",unit:15,opts:["average", "engagement", "girlfriend", "white"]},
    {w:"couple",m:"\ucee4\ud50c, \ubd80\ubd80",def:"",unit:15,opts:["cousin", "engagement", "couple", "merry"]},
    {w:"bride",m:"\uc2de\ubd80",def:"",unit:15,opts:["average", "bride", "sister", "stepbrother"]},
    {w:"elegant",m:"\uc6b0\uc544\ud55a, \ud488\uaca9\uc788\ub294",def:"",unit:15,opts:["clap", "merry", "elegant", "girlfriend"]},
    {w:"average",m:"\ud3c9\uade0\uc758, \ubcf4\ud1b5\uc758",def:"",unit:15,opts:["average", "nephew", "sister", "brother"]},
    {w:"party",m:"\ud30c\ud2f0",def:"",unit:15,opts:["couple", "engagement", "beautiful", "party"]},
    {w:"clap",m:"\ubc15\uc218\ub97c \uce58\ub2e4",def:"",unit:15,opts:["white", "average", "clap", "elegant"]},
    {w:"brother",m:"\ud615, \uc624\ube60",def:"",unit:15,opts:["gown", "brother", "cousin", "nephew"]},
    {w:"forever",m:"\uc601\uc6d0\ud788",def:"",unit:15,opts:["white", "nephew", "forever", "merry"]},
    {w:"beautiful",m:"\uc544\ub984\ub2e4\uc6b4, \uba4b\uc9c2",def:"",unit:15,opts:["party", "beautiful", "couple", "clap"]},
    {w:"white",m:"\ud770\uc0c9\uc758",def:"",unit:15,opts:["couple", "clap", "stepbrother", "white"]},
    {w:"nephew",m:"\uc870\uce74",def:"",unit:15,opts:["forever", "engagement", "nephew", "gown"]},
    {w:"merry",m:"\uc990\uac70\uc6b4, \ud589\ubcf5\ud55a",def:"",unit:15,opts:["marry", "merry", "girlfriend", "average"]},
    {w:"stepbrother",m:"(\uc790\uc2de\uacfc) \uc544\ubc84\uc9c0[\uc5b4\uba38\ub2c8]\uac00 \ub2e4\ub978 \ud615 \ub610\ub294 \uc544\uc6b0",def:"",unit:15,opts:["white", "forever", "beautiful", "stepbrother"]},
    {w:"gown",m:"(\ud2b9\ud788 \ud2b9\ubcc4\ud55a \uacbd\uc6b0\uc5d0 \uc785\ub294 \uc5ec\uc131\uc758) \ub4dc\ub808\uc2a4",def:"",unit:15,opts:["beautiful", "gown", "engagement", "sister"]},
    {w:"sister",m:"\uc5b6\ub2c8, \ub204\ub098",def:"",unit:15,opts:["couple", "forever", "girlfriend", "sister"]},
    {w:"engagement",m:"\uc57d\ud63a",def:"",unit:15,opts:["clap", "merry", "forever", "engagement"]},
    {w:"marry",m:"~\uc640 \uacb0\ud63a\ud558\ub2e4",def:"",unit:15,opts:["marry", "engagement", "clap", "white"]},
  ],
  "cew2_16": [
    {w:"widow",m:"\ubbf8\ub9dd\uc776, \uacfc\ubd80",def:"",unit:16,opts:["gender", "widow", "refuse", "aged"]},
    {w:"anniversary",m:"\uae30\ub150\uc777",def:"",unit:16,opts:["anniversary", "niece", "widow", "divorce"]},
    {w:"gender",m:"\uc131, \uc131\ubcc4",def:"",unit:16,opts:["niece", "annual", "gender", "spouse"]},
    {w:"newborn",m:"\uc0c8\ub85c \ud0dc\uc5b4\ub09c, \uc2de\uc0dd\uc758",def:"",unit:16,opts:["newborn", "aged", "companion", "gender"]},
    {w:"spouse",m:"\ubc30\uc6b0\uc790",def:"",unit:16,opts:["pure", "twin", "niece", "spouse"]},
    {w:"father-in-law",m:"\uc2dc\uc544\ubc84\uc9c0, \uc7a5\uc776",def:"",unit:16,opts:["seek", "widow", "aged", "father-in-law"]},
    {w:"reveal",m:"(\ube44\ubc00 \ub4f1\uc744) \ub4dc\ub7ec\ub0b4\ub2e4",def:"",unit:16,opts:["gender", "twin", "hug", "reveal"]},
    {w:"annual",m:"\ub9e4\ub144\uc758, \uc5f0\ub840\uc758",def:"",unit:16,opts:["widow", "newborn", "annual", "anniversary"]},
    {w:"twin",m:"\uc30d\ub465\uc774",def:"",unit:16,opts:["divorce", "anniversary", "gender", "twin"]},
    {w:"companion",m:"\ub3d9\ubc18\uc790",def:"",unit:16,opts:["marriage", "spouse", "grandparent", "companion"]},
    {w:"divorce",m:"\uc774\ud63a",def:"",unit:16,opts:["marriage", "divorce", "spouse", "twin"]},
    {w:"aged",m:"\uace0\ub839\uc758, \uc5f0\ub85c\ud55a",def:"",unit:16,opts:["twin", "aged", "refuse", "newborn"]},
    {w:"grandparent",m:"\uc870\ubd80\ubaa8",def:"",unit:16,opts:["grandparent", "companion", "gender", "widow"]},
    {w:"seek",m:"\ucc3e\ub2e4, (\ud544\uc694\ud55a \uac82\uc744 \uc5bb\uc73c\ub824\uace0) \uad6c\ud558\ub2e4, \ucd94\uad6c\ud558\ub2e4",def:"",unit:16,opts:["father-in-law", "niece", "pure", "seek"]},
    {w:"refuse",m:"\uac70\uc803\ud558\ub2e4, \uac70\ubd80\ud558\ub2e4",def:"",unit:16,opts:["anniversary", "refuse", "marriage", "father-in-law"]},
    {w:"niece",m:"\uc870\uce74\ub538",def:"",unit:16,opts:["widow", "companion", "newborn", "niece"]},
    {w:"hug",m:"\uaef4\uc546\ub2e4, \ud3ec\uc639\ud558\ub2e4",def:"",unit:16,opts:["niece", "anniversary", "divorce", "hug"]},
    {w:"pure",m:"\uc21a\uc218\ud55a, \uae68\ub057\ud55a",def:"",unit:16,opts:["aged", "pure", "grandparent", "father-in-law"]},
    {w:"marriage",m:"\uacb0\ud63a, \uacb0\ud63a \uc0dd\ud657",def:"",unit:16,opts:["marriage", "reveal", "newborn", "hug"]},
  ],
  "cew3_1": [
    {w:"online",m:"\uc628\ub77c\uc778\uc758",def:"connected to a computer, a computer network, or the internet",unit:1,opts:["printer", "online", "speaker", "switch"]},
    {w:"click",m:"\ud074\ub9ad\ud558\ub2e4",def:"to press a button on a mouse or other device",unit:1,opts:["technique", "click", "machine", "cellphone"]},
    {w:"printer",m:"\ud504\ub9b0\ud130, \uc778\uc1c4\uae30",def:"a machine that is used for printing documents",unit:1,opts:["battery", "current", "printer", "laptop"]},
    {w:"keyboard",m:"\ud0a4\ubcf4\ub4dc",def:"the set of keys for operating a computer or typewriter",unit:1,opts:["printer", "computer", "keyboard", "battery"]},
    {w:"machine",m:"\uae30\uacc4",def:"a piece of equipment that uses power to do work",unit:1,opts:["keyboard", "machine", "battery", "technique"]},
    {w:"technique",m:"\uae30\ubc95, \uae30\uc220",def:"a way of doing something by using special knowledge or skills",unit:1,opts:["switch", "printer", "technique", "keyboard"]},
    {w:"speaker",m:"\uc2a4\ud53c\ucee4, \uc5f0\uc124\uc790",def:"an electronic machine that produces sound",unit:1,opts:["machine", "keyboard", "speaker", "cellphone"]},
    {w:"battery",m:"\ubc30\ud130\ub9ac, \uac74\uc804\uc9c0",def:"an object that provides a supply of electricity for something",unit:1,opts:["battery", "laptop", "click", "computer"]},
    {w:"update",m:"\uc5c5\ub370\uc774\ud2b8\ud558\ub2e4",def:"to change something by including the most recent information",unit:1,opts:["file", "update", "speaker", "cellphone"]},
    {w:"cellphone",m:"\ud734\ub300\ud3f0",def:"a telephone that people can carry and use outside",unit:1,opts:["technique", "cellphone", "machine", "file"]},
    {w:"laptop",m:"\ub178\ud2b8\ubd81",def:"a portable computer that can work with a battery",unit:1,opts:["current", "switch", "laptop", "technique"]},
    {w:"switch",m:"\uc2a4\uc704\uce58",def:"a device that you press to turn something on and off",unit:1,opts:["technique", "improve", "switch", "keyboard"]},
    {w:"computer",m:"\ucef4\ud4e8\ud130",def:"an electonic machine that is used to store and sort information",unit:1,opts:["keyboard", "switch", "file", "computer"]},
    {w:"current",m:"\ud604\uc7ac\uc758",def:"happening or existing now",unit:1,opts:["click", "online", "current", "computer"]},
    {w:"improve",m:"\uac1c\uc120\ud558\ub2e4, \ud5a5\uc0c1\ud558\ub2e4",def:"to make something better",unit:1,opts:["current", "printer", "improve", "switch"]},
    {w:"file",m:"\ud30c\uc77c",def:"a collection of computer data that forms a single unit",unit:1,opts:["speaker", "file", "update", "click"]},
  ],
  "cew3_2": [
    {w:"innovation",m:"\ud601\uc2e0",def:"a new idea, device, or way of doing something",unit:2,opts:["innovation", "electric", "electricity", "user"]},
    {w:"search",m:"\ucc3e\ub2e4, \uc218\uc0c9\ud558\ub2e4",def:"to look carefully for someone or something",unit:2,opts:["electricity", "innovation", "dot", "search"]},
    {w:"display",m:"\uc804\uc2dc\ud558\ub2e4, \ubcf4\uc5ec\uc8fc\ub2e4",def:"to put it where people can see it",unit:2,opts:["digital", "display", "dot", "access"]},
    {w:"technology",m:"\uae30\uc220",def:"the use of science to invent useful things",unit:2,opts:["electric", "screen", "user", "technology"]},
    {w:"energy",m:"\uc5d0\ub108\uc9c0",def:"the power that is used to operate machines and provide light",unit:2,opts:["electric", "screen", "search", "energy"]},
    {w:"user",m:"\uc0ac\uc6a9\uc790",def:"a person that uses or operates something",unit:2,opts:["dot", "off", "energy", "user"]},
    {w:"load",m:"(\ubb3c\uac74, \uc9d0\uc744) \uc2e3\ub2e4, \ubd80\ud558\ud558\ub2e4, \uc62c\ub9ac\ub2e4",def:"to cause a program or file to become available",unit:2,opts:["display", "load", "digital", "memory"]},
    {w:"memory",m:"\uae30\uc5b5, \uba54\ubaa8\ub9ac",def:"the part of a computer that stores information",unit:2,opts:["electricity", "chat", "technology", "memory"]},
    {w:"digital",m:"\ub514\uc9c0\ud138\uc758",def:"using or characterized by computer technology",unit:2,opts:["energy", "user", "digital", "search"]},
    {w:"access",m:"\uc811\uadfc, \uc774\uc6a9",def:"a way of being able to use or get something",unit:2,opts:["digital", "access", "search", "chat"]},
    {w:"chat",m:"\ucc44\ud305\ud558\ub2e4, \uc774\uc57c\uae30\ud558\ub2e4",def:"to talk to someone in a casual way",unit:2,opts:["chat", "access", "energy", "memory"]},
    {w:"off",m:"\uc5c6\uc5b4\uc838, \ub5a8\uc5b4\uc838, \ubc97\uc5b4\ub098",def:"not to be switched on or connected",unit:2,opts:["memory", "off", "innovation", "electricity"]},
    {w:"electric",m:"\uc804\uae30\uc758, \uc804\uc790\uc758",def:"relating to electricity",unit:2,opts:["electric", "access", "load", "electricity"]},
    {w:"link",m:"\uacb0\ud569\ud558\ub2e4, \uc774\uc5b4\uc9c0\ub2e4",def:"to join or connect two or more things together",unit:2,opts:["electric", "access", "load", "link"]},
    {w:"electricity",m:"\uc804\uae30",def:"a form of power that is used to operate machines",unit:2,opts:["electricity", "chat", "display", "screen"]},
    {w:"information",m:"\uc815\ubcf4, \uc790\ub8cc",def:"facts or details about someone or something",unit:2,opts:["search", "information", "off", "innovation"]},
    {w:"screen",m:"\ud654\uba74, \uc2a4\ud06c\ub9b0",def:"a flat surface on which you see images",unit:2,opts:["energy", "access", "screen", "search"]},
    {w:"dot",m:"\uc810",def:"a small round mark",unit:2,opts:["search", "memory", "electricity", "dot"]},
  ],
  "cew3_3": [
    {w:"virtual",m:"\uac00\uc0c1\uc758, \uc778\ud130\ub137\uc758",def:"occurring on computers or on the internet",unit:3,opts:["unit", "function", "virtual", "error"]},
    {w:"error",m:"\uc624\ub958",def:"a mistake, especially one which causes problems",unit:3,opts:["hardware", "unit", "pump", "error"]},
    {w:"connection",m:"\uc5f0\uacb0, \uc811\uc18d",def:"something that allows you to become connected",unit:3,opts:["connection", "virtual", "unit", "storage"]},
    {w:"function",m:"\uae30\ub2a5, \uc5ed\ud560",def:"a special purpose or duty",unit:3,opts:["volume", "generate", "data", "function"]},
    {w:"data",m:"\ub370\uc774\ud130, \uc790\ub8cc",def:"information that is produced or stored by a computer",unit:3,opts:["error", "volume", "pump", "data"]},
    {w:"unit",m:"\ub2e8\uc704",def:"a part of a machine or system that has a particular use",unit:3,opts:["code", "procedure", "pump", "unit"]},
    {w:"code",m:"\ucf54\ub4dc",def:"a set of instructions that tell a computer what to do",unit:3,opts:["pump", "code", "unit", "function"]},
    {w:"equipment",m:"\uc7a5\ube44, \uae30\uae30",def:"supplies or tools needed for a special purpose",unit:3,opts:["hardware", "unit", "equipment", "volume"]},
    {w:"automatic",m:"\uc790\ub3d9\uc758",def:"working or operating by itself",unit:3,opts:["automatic", "storage", "unit", "pump"]},
    {w:"generate",m:"\uc0dd\uc131\ud558\ub2e4, \ubc1c\uc0dd\uc2dc\ud0a4\ub2e4",def:"to produce or create something",unit:3,opts:["procedure", "disk", "virtual", "generate"]},
    {w:"volume",m:"\ubcfc\ub968, \ubd80\ud53c",def:"the amount of sound that is produced by electronic devices",unit:3,opts:["volume", "storage", "pump", "error"]},
    {w:"storage",m:"\uc800\uc7a5\uc18c, \ubcf4\uad00\uc18c",def:"space for keeping information on a computer",unit:3,opts:["storage", "generate", "disk", "code"]},
    {w:"procedure",m:"\uc808\ucc28, \uacfc\uc815",def:"a series of steps for doing something",unit:3,opts:["procedure", "code", "equipment", "storage"]},
    {w:"disk",m:"\ub514\uc2a4\ud06c",def:"a flat, thin, round object that is used to store information",unit:3,opts:["technical", "procedure", "function", "disk"]},
    {w:"technical",m:"\uae30\uc220\uc758",def:"having to do with science or industrial work",unit:3,opts:["technical", "unit", "data", "connection"]},
    {w:"pump",m:"\ud38c\ud504",def:"a device that forces liquid, air, or gas into or out of something",unit:3,opts:["pump", "error", "unit", "storage"]},
    {w:"hardware",m:"\ud558\ub4dc\uc6e8\uc5b4",def:"the electronic parts of a computer system",unit:3,opts:["error", "hardware", "disk", "code"]},
  ],
  "cew3_4": [
    {w:"whistle",m:"\ud718\ud30c\ub78c\uc744 \ubd88\ub2e4",def:"to make a high sound by blowing air through your lips or teeth",unit:4,opts:["episode", "whistle", "rhythm", "poem"]},
    {w:"scene",m:"\uc7a5\uba74",def:"a part of an act in a movie or play",unit:4,opts:["episode", "biography", "scene", "comedy"]},
    {w:"rhythm",m:"\ub9ac\ub4ec",def:"a regular, repeated pattern of sounds or movements",unit:4,opts:["rhythm", "poem", "scene", "passage"]},
    {w:"publish",m:"\ucd9c\ud310\ud558\ub2e4, \ucd9c\uac04\ud558\ub2e4",def:"to prepare and produce written works for sale",unit:4,opts:["episode", "publish", "performer", "poetry"]},
    {w:"comedy",m:"\ucf54\ubbf8\ub514",def:"a play, movie, story, or television show that is funny",unit:4,opts:["comedy", "series", "statue", "item"]},
    {w:"passage",m:"\uad6c\uc808",def:"a section of a book, poem, or speech",unit:4,opts:["episode", "whistle", "passage", "series"]},
    {w:"celebrity",m:"\uc720\uba85\uc778",def:"someone who is famous",unit:4,opts:["celebrity", "whistle", "poem", "publish"]},
    {w:"poetry",m:"\uc2dc",def:"poems as a form of writing",unit:4,opts:["whistle", "episode", "poetry", "rhythm"]},
    {w:"release",m:"\ubc1c\ud45c\ud558\ub2e4, \uac1c\ubd09\ud558\ub2e4, \ucd9c\uc2dc\ud558\ub2e4",def:"to allow it to be shown, sold, or published",unit:4,opts:["celebrity", "statue", "poem", "release"]},
    {w:"item",m:"\ubb3c\ud488, \ud488\ubaa9",def:"an individual thing",unit:4,opts:["publish", "item", "comedy", "passage"]},
    {w:"episode",m:"\uc5d0\ud53c\uc18c\ub4dc",def:"a television or radio show that is one part of a series.",unit:4,opts:["comedy", "publish", "poem", "episode"]},
    {w:"poem",m:"(\ud558\ub098\uc758) \uc2dc",def:"a piece of writing, often with each line ending in rhyme",unit:4,opts:["biography", "poem", "item", "release"]},
    {w:"biography",m:"\uc804\uae30",def:"the written story of a person\u2019s life",unit:4,opts:["scene", "release", "performer", "biography"]},
    {w:"statue",m:"\uc870\uac01\uc0c1",def:"an object that is made from stone or metal",unit:4,opts:["statue", "rhythm", "performer", "passage"]},
    {w:"performer",m:"\uacf5\uc5f0\uac00",def:"a person who acts, sings, or dances for an audience",unit:4,opts:["passage", "episode", "poem", "performer"]},
    {w:"series",m:"\uc2dc\ub9ac\uc988",def:"a set of books, articles, or stories",unit:4,opts:["episode", "celebrity", "comedy", "series"]},
  ],
  "cew3_5": [
    {w:"horror",m:"\uacf5\ud3ec",def:"a genre of movie, book, etc. that is designed to scare people",unit:5,opts:["craft", "conduct", "publication", "horror"]},
    {w:"craft",m:"\uacf5\uc608",def:"an activity making things that requires skill",unit:5,opts:["horror", "ballet", "craft", "commercial"]},
    {w:"capture",m:"\uc7a1\ub2e4, \ud3ec\ucc29\ud558\ub2e4",def:"to get and hold someone\u2019s attention or interest",unit:5,opts:["tone", "amuse", "capture", "craft"]},
    {w:"amuse",m:"\uc990\uac81\uac8c \ud558\ub2e4",def:"to entertain in a pleasant way",unit:5,opts:["amuse", "tone", "publication", "plot"]},
    {w:"ballet",m:"\ubc1c\ub808",def:"a form of dance that uses exact, graceful movements",unit:5,opts:["ballet", "tone", "conduct", "commercial"]},
    {w:"humor",m:"\uc720\uba38",def:"a funny or amusing quality",unit:5,opts:["publication", "amuse", "humor", "fame"]},
    {w:"conduct",m:"\uc9c0\ud718\ud558\ub2e4, \uc218\ud589\ud558\ub2e4",def:"to direct the performance of musicians or singers",unit:5,opts:["tone", "expression", "conduct", "horror"]},
    {w:"dramatic",m:"\uadf9\uc801\uc778, \uae09\uaca9\ud55c",def:"exciting and impressive",unit:5,opts:["capture", "dramatic", "amuse", "publication"]},
    {w:"edition",m:"(\uac04\ud589\ubb3c\uc758) \ud310",def:"a particular version of a book, magazine, or newspaper",unit:5,opts:["fame", "horror", "expression", "edition"]},
    {w:"expression",m:"\ud45c\ud604",def:"the act of showing your thoughts or feelings",unit:5,opts:["tone", "humor", "expression", "edition"]},
    {w:"plot",m:"\uc904\uac70\ub9ac",def:"a series of events that form the story in a novel or movie",unit:5,opts:["expression", "commercial", "plot", "humor"]},
    {w:"author",m:"\uc791\uac00",def:"the writer of a book, play, story, or other written work",unit:5,opts:["tone", "conduct", "author", "dramatic"]},
    {w:"fame",m:"\uba85\uc131",def:"the condition of being known or recognized by many people",unit:5,opts:["commercial", "author", "fame", "capture"]},
    {w:"tone",m:"\uc5b4\uc870",def:"the mood that an author expresses in a piece of writing",unit:5,opts:["conduct", "tone", "capture", "horror"]},
    {w:"commercial",m:"\uad11\uace0",def:"an advertisement on radio or television",unit:5,opts:["commercial", "horror", "broadcast", "amuse"]},
    {w:"publication",m:"\ucd9c\ud310",def:"the act of printing a book or magazine",unit:5,opts:["dramatic", "publication", "capture", "edition"]},
    {w:"broadcast",m:"\ubc29\uc1a1\ud558\ub2e4, \ubc29\uc601\ud558\ub2e4",def:"to send out programs over radio or television",unit:5,opts:["author", "conduct", "capture", "broadcast"]},
  ],
  "cew3_6": [
    {w:"budget",m:"\uc608\uc0b0",def:"the amount of money that you have available to spend",unit:6,opts:["buy", "cent", "budget", "dollar"]},
    {w:"currency",m:"\ud1b5\ud654",def:"the money that a country uses",unit:6,opts:["borrow", "currency", "cent", "save"]},
    {w:"earn",m:"\ubc8c\ub2e4",def:"to get money for work you have done",unit:6,opts:["earn", "buy", "dollar", "save"]},
    {w:"pound",m:"\ud30c\uc6b4\ub4dc",def:"a basic unit of money in the UK and some other countries",unit:6,opts:["bill", "wallet", "buy", "pound"]},
    {w:"exchange",m:"\uad50\ud658\ud558\ub2e4",def:"to give something and receive something in return",unit:6,opts:["exchange", "save", "loss", "currency"]},
    {w:"save",m:"\uc808\uc57d\ud558\ub2e4",def:"to keep money instead of spending it",unit:6,opts:["exchange", "save", "loss", "income"]},
    {w:"loss",m:"\uc190\uc2e4",def:"a situation in which more money is spent than earned",unit:6,opts:["pound", "currency", "pay", "loss"]},
    {w:"debt",m:"\ubd80\ucc44, \ube5a",def:"an amount of money that you owe to a person or bank",unit:6,opts:["buy", "earn", "dollar", "debt"]},
    {w:"borrow",m:"\ube4c\ub9ac\ub2e4",def:"to take something with the promise to return or replace it",unit:6,opts:["pay", "currency", "income", "borrow"]},
    {w:"income",m:"\uc218\uc785",def:"money someone gets for work or from a business",unit:6,opts:["earn", "save", "income", "pound"]},
    {w:"dollar",m:"\ub2ec\ub7ec",def:"a basic unit of money that is equal to 100 cents",unit:6,opts:["dollar", "borrow", "cent", "cash"]},
    {w:"cent",m:"\uc13c\ud2b8",def:"a unit of money that is equal to one percent of a dollar",unit:6,opts:["pound", "cent", "cash", "exchange"]},
    {w:"buy",m:"\uc0ac\ub2e4",def:"to get something by paying money for it",unit:6,opts:["pay", "currency", "buy", "loss"]},
    {w:"spend",m:"\uc18c\ube44\ud558\ub2e4",def:"to use money to pay for something",unit:6,opts:["spend", "currency", "exchange", "pay"]},
    {w:"cash",m:"\ud604\uae08",def:"money in the form of coins or bills",unit:6,opts:["wallet", "income", "cash", "pound"]},
    {w:"wallet",m:"\uc9c0\uac11",def:"a small folding case that holds money",unit:6,opts:["bill", "wallet", "save", "cent"]},
    {w:"bill",m:"\uc9c0\ud3d0",def:"a request for payment of money owed",unit:6,opts:["save", "dollar", "bill", "loss"]},
    {w:"pay",m:"\uc9c0\ubd88\ud558\ub2e4",def:"to give money in order to buy something",unit:6,opts:["spend", "buy", "save", "pay"]},
  ],
  "cew3_7": [
    {w:"balance",m:"\uc794\uace0",def:"the amount of money in a bank account",unit:7,opts:["rate", "value", "balance", "valuable"]},
    {w:"value",m:"\uac00\uce58",def:"the amount of money that something is worth",unit:7,opts:["value", "financial", "wage", "charge"]},
    {w:"owe",m:"\ube5a\uc9c0\ub2e4, \uc2e0\uc138\uc9c0\ub2e4",def:"to need to give someone back money that they have lent you",unit:7,opts:["rate", "tax", "wealth", "owe"]},
    {w:"deposit",m:"\uc608\uae08\ud558\ub2e4",def:"to put money in a bank account",unit:7,opts:["award", "value", "deposit", "wealth"]},
    {w:"valuable",m:"\uac00\uce58\uc788\ub294, \uadc0\uc911\ud55c",def:"having worth or merit",unit:7,opts:["valuable", "tax", "charge", "sum"]},
    {w:"wage",m:"\uc784\uae08, \uae09\uc5ec",def:"the amount of money you earn for working",unit:7,opts:["fare", "balance", "wage", "owe"]},
    {w:"charge",m:"\uccad\uad6c\ud558\ub2e4",def:"to ask for money in return for a service or activity",unit:7,opts:["deposit", "owe", "fee", "charge"]},
    {w:"fee",m:"\uc694\uae08, \uc218\uc218\ub8cc",def:"an amount of money that you pay to do something",unit:7,opts:["worth", "value", "fee", "owe"]},
    {w:"fare",m:"\uc2b9\ucc28 \uc694\uae08(\uc6b4\uc784)",def:"the money paid to travel on public transportation",unit:7,opts:["balance", "charge", "rate", "fare"]},
    {w:"account",m:"\uacc4\uc88c",def:"an arrangement in which a bank looks after your money",unit:7,opts:["worth", "account", "award", "rate"]},
    {w:"award",m:"\uc218\uc5ec\ud558\ub2e4",def:"to give a reward or prize to someone",unit:7,opts:["worth", "award", "sum", "financial"]},
    {w:"rate",m:"\uc694\uae08, \uac00\uaca9",def:"an amount of money that is paid or charged",unit:7,opts:["cost", "wage", "rate", "deposit"]},
    {w:"cost",m:"\ube44\uc6a9",def:"the price of something",unit:7,opts:["valuable", "award", "rate", "cost"]},
    {w:"worth",m:"~\ud560 \ub9cc\ud55c \uac00\uce58\uac00 \uc788\ub294",def:"used to indicate the value of something",unit:7,opts:["sum", "worth", "financial", "owe"]},
    {w:"financial",m:"\uae08\uc735\uc758, \uc7ac\uc815\uc758",def:"relating to money",unit:7,opts:["financial", "deposit", "owe", "wage"]},
    {w:"tax",m:"\uc138\uae08",def:"an amount of money that you have to pay to the government",unit:7,opts:["account", "award", "tax", "wealth"]},
    {w:"sum",m:"\ud569\uacc4",def:"an amount of money",unit:7,opts:["fee", "fare", "deposit", "sum"]},
    {w:"wealth",m:"\ubd80, \uc7ac\uc0b0",def:"a large amount of money and possessions",unit:7,opts:["wealth", "fare", "fee", "financial"]},
  ],
  "cew3_8": [
    {w:"cottage",m:"\ubcc4\uc7a5",def:"a small house, especially one in the country",unit:8,opts:["string", "hut", "lab", "cottage"]},
    {w:"dust",m:"\uba3c\uc9c0",def:"very small pieces of dirt that cover surfaces inside buildings",unit:8,opts:["hut", "dust", "cottage", "string"]},
    {w:"fountain",m:"\ubd84\uc218",def:"a device that sends a stream of water into the air",unit:8,opts:["frame", "property", "hut", "fountain"]},
    {w:"ruin",m:"\ub9dd\uce58\ub2e4",def:"to destroy something completely",unit:8,opts:["string", "palace", "cabin", "ruin"]},
    {w:"string",m:"\uc904",def:"a long thin piece of twisted thread",unit:8,opts:["string", "frame", "property", "rug"]},
    {w:"facility",m:"\uc2dc\uc124, \uc124\ube44",def:"a building made or used for a particular activity",unit:8,opts:["hut", "frame", "facility", "string"]},
    {w:"palace",m:"\uad81\uc804",def:"the official home of a king, queen, or president",unit:8,opts:["palace", "hut", "cottage", "ruin"]},
    {w:"shelter",m:"\ub300\ud53c\uc18c, \ud53c\ub09c\ucc98",def:"a structure that covers or protects people or things",unit:8,opts:["shelter", "string", "frame", "heat"]},
    {w:"yard",m:"\ub9c8\ub2f9",def:"an open area next to a house or other building",unit:8,opts:["cabin", "heat", "hut", "yard"]},
    {w:"property",m:"\uc7ac\uc0b0, \ud1a0\uc9c0",def:"something that is owned by a person or business",unit:8,opts:["lab", "yard", "property", "dust"]},
    {w:"heater",m:"\ub09c\ub85c",def:"a machine for making air or water hotter",unit:8,opts:["property", "heater", "fountain", "heat"]},
    {w:"rug",m:"\uae54\uac1c",def:"a piece of thick material used to cover part of a floor",unit:8,opts:["rug", "palace", "lab", "cottage"]},
    {w:"lab",m:"\uc5f0\uad6c\uc2e4",def:"a special room or building where scientists do tests",unit:8,opts:["frame", "yard", "property", "lab"]},
    {w:"heat",m:"\ub09c\ubc29",def:"the system that is used to provide warmth to a room",unit:8,opts:["palace", "heater", "heat", "facility"]},
    {w:"frame",m:"\ud504\ub808\uc784, \uad6c\uc870, \ud2c0",def:"the part that supports and forms the basic shape of something",unit:8,opts:["facility", "heater", "palace", "frame"]},
    {w:"hut",m:"\uc624\ub450\ub9c9",def:"a small and simple house or shelter",unit:8,opts:["frame", "hut", "rug", "yard"]},
    {w:"cabin",m:"\uc624\ub450\ub9c9",def:"a small simple house made of wood in a remote area",unit:8,opts:["fountain", "string", "cabin", "ruin"]},
  ],
  "cew3_9": [
    {w:"construction",m:"\uacf5\uc0ac",def:"the act or process of building something",unit:9,opts:["construction", "fence", "concrete", "interior"]},
    {w:"closet",m:"\ubcbd\uc7a5",def:"a cabinet in a room that holds clothes or other things",unit:9,opts:["closet", "decoration", "monument", "resident"]},
    {w:"decoration",m:"\uc7a5\uc2dd\ubb3c",def:"something used to make an object or place more attractive",unit:9,opts:["interior", "decoration", "lamp", "resident"]},
    {w:"hammer",m:"\ub9dd\uce58",def:"a tool with a heavy metal part on a long handle",unit:9,opts:["hammer", "monument", "closet", "resident"]},
    {w:"candle",m:"\uc591\ucd08",def:"a stick of wax with a string that you burn to give light",unit:9,opts:["hammer", "concrete", "household", "candle"]},
    {w:"brick",m:"\ubcbd\ub3cc",def:"a hard block of baked clay used as a building material",unit:9,opts:["interior", "resident", "brick", "decoration"]},
    {w:"altogether",m:"\uc804\uc801\uc73c\ub85c",def:"completely or in every way",unit:9,opts:["decoration", "closet", "construction", "altogether"]},
    {w:"lamp",m:"\ub7a8\ud504",def:"a device that produces light",unit:9,opts:["monument", "closet", "candle", "lamp"]},
    {w:"interior",m:"\uc778\ud14c\ub9ac\uc5b4",def:"the inner part or inside of something",unit:9,opts:["concrete", "interior", "lamp", "locate"]},
    {w:"fence",m:"\uc6b8\ud0c0\ub9ac",def:"a structure like a wall built outdoors, usually of wood or metal",unit:9,opts:["interior", "fence", "altogether", "closet"]},
    {w:"counter",m:"\uce74\uc6b4\ud130",def:"a long flat table where customers are served",unit:9,opts:["counter", "interior", "household", "concrete"]},
    {w:"household",m:"\uac00\uc815",def:"a home and the people who live in it",unit:9,opts:["interior", "household", "hammer", "candle"]},
    {w:"resident",m:"\uc8fc\ubbfc",def:"someone who lives in a particular place",unit:9,opts:["candle", "closet", "resident", "locate"]},
    {w:"monument",m:"\uae30\ub150\ubb3c",def:"a building or statue that honors a person or event",unit:9,opts:["closet", "lamp", "candle", "monument"]},
    {w:"concrete",m:"\ucf58\ud06c\ub9ac\ud2b8",def:"a hard building material made by cement",unit:9,opts:["fence", "hammer", "concrete", "altogether"]},
    {w:"locate",m:"\uc704\uce58\ud558\ub2e4, \uc790\ub9ac\uc7a1\uace0 \uc788\ub2e4",def:"to put or build something in a particular place",unit:9,opts:["locate", "interior", "hammer", "construction"]},
  ],
  "cew3_10": [
    {w:"pregnant",m:"\uc784\uc2e0\ud55c",def:"having one or more babies growing within a mother\u2019s body",unit:10,opts:["funeral", "pregnant", "heel", "breathe"]},
    {w:"thigh",m:"\ud5c8\ubc85\uc9c0",def:"the part of your leg above the knee",unit:10,opts:["thigh", "pregnant", "breathe", "waist"]},
    {w:"cancer",m:"\uc554",def:"a serious disease caused by cells that are not normal",unit:10,opts:["flu", "wrist", "cancer", "cell"]},
    {w:"ankle",m:"\ubc1c\ubaa9",def:"the joint between your foot and your leg",unit:10,opts:["ankle", "pregnant", "skull", "waist"]},
    {w:"cell",m:"\uc138\ud3ec",def:"a very small living thing that makes up every part of your body",unit:10,opts:["heel", "funeral", "thigh", "cell"]},
    {w:"waist",m:"\ud5c8\ub9ac",def:"the area of the body just above the belly button",unit:10,opts:["tension", "ankle", "flu", "waist"]},
    {w:"heel",m:"\ub4a4\uafc8\uce58",def:"the curved back part of your foot",unit:10,opts:["heel", "thigh", "wrist", "skull"]},
    {w:"funeral",m:"\uc7a5\ub840\uc2dd",def:"a ceremony held for a dead person",unit:10,opts:["obesity", "pregnant", "funeral", "waist"]},
    {w:"tension",m:"\uae34\uc7a5",def:"a feeling of anxiety and stress that makes it impossible to relax",unit:10,opts:["tension", "wrist", "thigh", "obesity"]},
    {w:"wound",m:"\uc0c1\ucc98",def:"an injury in which your skin or flesh is damaged",unit:10,opts:["lung", "obesity", "wound", "cell"]},
    {w:"wrist",m:"\uc190\ubaa9",def:"the part of your body where your hand joins your arm",unit:10,opts:["heel", "gene", "wrist", "obesity"]},
    {w:"flu",m:"\ub3c5\uac10, \uac10\uae30",def:"a common illness that makes you feel tired and weak",unit:10,opts:["obesity", "cell", "flu", "pregnant"]},
    {w:"gene",m:"\uc720\uc804\uc790",def:"a part of a cell that influences the appearance of a living thing",unit:10,opts:["throat", "obesity", "heel", "gene"]},
    {w:"throat",m:"\ubaa9\uad6c\uba4d",def:"at the back of your mouth inside your neck",unit:10,opts:["tension", "flu", "throat", "thigh"]},
    {w:"skull",m:"\ub450\uac1c\uace8",def:"the framework of bones forming the head",unit:10,opts:["obesity", "ankle", "throat", "skull"]},
    {w:"breathe",m:"\uc228\uc26c\ub2e4",def:"to move air into and out of your lungs",unit:10,opts:["breathe", "tension", "skull", "pregnant"]},
    {w:"obesity",m:"\ube44\ub9cc",def:"a condition in which someone is too fat in an unhealthy way",unit:10,opts:["waist", "flu", "throat", "obesity"]},
    {w:"lung",m:"\ud3d0, \ud5c8\ud30c",def:"one of the two organs in your body that you breathe with",unit:10,opts:["thigh", "pregnant", "wound", "lung"]},
  ],
  "cew3_11": [
    {w:"faint",m:"\uae30\uc808\ud558\ub2e4",def:"to become unconscious for a short time",unit:11,opts:["injury", "faint", "badly", "internal"]},
    {w:"entire",m:"\uc804\uccb4\uc758",def:"including everything, everyone, or every part",unit:11,opts:["starve", "entire", "grave", "badly"]},
    {w:"grave",m:"\ubb34\ub364",def:"a place in the ground where a dead body is buried",unit:11,opts:["badly", "grave", "carsick", "survive"]},
    {w:"infection",m:"\uac10\uc5fc, \uc804\uc5fc",def:"a disease caused by germs that enter the body",unit:11,opts:["survive", "infection", "depression", "starve"]},
    {w:"injury",m:"\uc190\uc0c1",def:"physical damage done to a part of a person\u2019s body",unit:11,opts:["carsick", "injury", "depression", "survive"]},
    {w:"carsick",m:"\ucc28\uba40\ubbf8\uc758",def:"feeling sick because you are traveling in a car",unit:11,opts:["starve", "carsick", "sneeze", "grave"]},
    {w:"survive",m:"\uc0b4\uc544\ub0a8\ub2e4",def:"to continue to live or exist",unit:11,opts:["buttock", "survive", "growth", "starve"]},
    {w:"starve",m:"\uad76\uc8fc\ub9ac\ub2e4",def:"to suffer or die from lack of food",unit:11,opts:["medical", "starve", "depression", "survive"]},
    {w:"joint",m:"\uad00\uc808",def:"a point where two bones meet in the body",unit:11,opts:["physician", "survive", "injury", "joint"]},
    {w:"sweat",m:"\ub540\uc744 \ud758\ub9ac\ub2e4",def:"to produce a clear liquid from your skin when you are hot",unit:11,opts:["buttock", "infection", "sneeze", "sweat"]},
    {w:"badly",m:"\ub098\uc058\uac8c",def:"not well; in a bad way",unit:11,opts:["faint", "joint", "badly", "sweat"]},
    {w:"physician",m:"\uc758\uc0ac",def:"a doctor, especially one who practices general medicine",unit:11,opts:["physician", "badly", "injury", "grave"]},
    {w:"disorder",m:"\uc7a5\uc560, \uc9c8\ud658",def:"a physical or mental condition that is not normal or healthy",unit:11,opts:["depression", "survive", "disorder", "faint"]},
    {w:"sneeze",m:"\uc7ac\ucc44\uae30\ud558\ub2e4",def:"to suddenly force air out through your nose and mouth",unit:11,opts:["joint", "medical", "sneeze", "sweat"]},
    {w:"medical",m:"\uc758\ub8cc\uc758",def:"relating to medicine and the treatment of disease",unit:11,opts:["entire", "disorder", "starve", "medical"]},
    {w:"growth",m:"\uc131\uc7a5",def:"the process of growing physically",unit:11,opts:["internal", "infection", "growth", "medical"]},
    {w:"naked",m:"\ubc8c\uac70\ubc97\uc740",def:"not wearing any clothes",unit:11,opts:["joint", "survive", "naked", "disorder"]},
    {w:"internal",m:"\uccb4\ub0b4\uc758, \ub0b4\ubd80\uc758",def:"located on the inside of your body",unit:11,opts:["internal", "survive", "growth", "physician"]},
    {w:"buttock",m:"\uad81\ub465\uc774",def:"the part of your body that you sit on",unit:11,opts:["carsick", "buttock", "sneeze", "survive"]},
    {w:"depression",m:"\uc6b0\uc6b8",def:"a mood of unhappiness that can last a long time",unit:11,opts:["joint", "depression", "growth", "buttock"]},
  ],
  "cew3_12": [
    {w:"judge",m:"\ud310\ub2e8\ud558\ub2e4",def:"to form an opinion about something or someone",unit:12,opts:["judge", "grateful", "confuse", "violent"]},
    {w:"imagination",m:"\uc0c1\uc0c1\ub825",def:"the ability to form pictures or ideas in your mind",unit:12,opts:["imagination", "violent", "content", "grateful"]},
    {w:"steady",m:"\uc548\uc815\ub41c",def:"not nervous or excited",unit:12,opts:["steady", "suffer", "reliable", "mood"]},
    {w:"hero",m:"\uc601\uc6c5",def:"a person who is brave and often looked up to by others",unit:12,opts:["judge", "hero", "selfish", "suffer"]},
    {w:"confuse",m:"~\uc744 \ud63c\ub780\uc2dc\ud0a4\ub2e4",def:"to cause somebody to be unable to think clearly something",unit:12,opts:["confuse", "reliable", "selfish", "pleasure"]},
    {w:"generous",m:"\uad00\ub300\ud55c",def:"willing to give or share",unit:12,opts:["generous", "reliable", "imagination", "suffer"]},
    {w:"pleasure",m:"\uc990\uac70\uc6c0",def:"a feeling of happiness, delight, or joy",unit:12,opts:["pleasure", "delight", "eager", "generous"]},
    {w:"content",m:"\ub9cc\uc871\ud558\ub294",def:"pleased and satisfied",unit:12,opts:["content", "grateful", "steady", "generous"]},
    {w:"suffer",m:"\uace0\ud1b5\uc744 \ubc1b\ub2e4",def:"to experience physical or mental pain",unit:12,opts:["suffer", "steady", "selfish", "hero"]},
    {w:"eager",m:"\uc5f4\ub9dd\ud558\ub294",def:"very excited and interested about something",unit:12,opts:["eager", "violent", "steady", "reliable"]},
    {w:"reliable",m:"\uc2e0\ub8b0\ud560 \ub9cc\ud55c",def:"able to be trusted to do or provide what is needed",unit:12,opts:["reliable", "violent", "patient", "hero"]},
    {w:"patient",m:"\ucc38\uc744\uc131\uc774 \uc788\ub294",def:"able to remain calm and not become easily annoyed",unit:12,opts:["imagination", "violent", "steady", "patient"]},
    {w:"delight",m:"\uae30\uc068",def:"a strong feeling of happiness",unit:12,opts:["shocking", "selfish", "patient", "delight"]},
    {w:"violent",m:"\ud3ed\ub825\uc801\uc778",def:"very forceful or intense",unit:12,opts:["violent", "eager", "selfish", "judge"]},
    {w:"mood",m:"\uac10\uc815, \ubd84\uc704\uae30",def:"the way you feel at a particular time",unit:12,opts:["mood", "confuse", "judge", "pleasure"]},
    {w:"grateful",m:"\uac10\uc0ac\ud558\ub294",def:"feeling or showing thanks",unit:12,opts:["patient", "reliable", "generous", "grateful"]},
    {w:"selfish",m:"\uc774\uae30\uc801\uc778",def:"caring only about yourself and not about other people",unit:12,opts:["imagination", "selfish", "steady", "shocking"]},
    {w:"shocking",m:"\ucda9\uaca9\uc801\uc778",def:"very surprising, upsetting, and difficult to believe",unit:12,opts:["shocking", "suffer", "eager", "patient"]},
  ],
  "cew3_13": [
    {w:"stress",m:"\uc2a4\ud2b8\ub808\uc2a4",def:"pressure or worry caused by the problems in somebody\u2019s life",unit:13,opts:["emotion", "stress", "strict", "misery"]},
    {w:"truly",m:"\uc9c4\uc2e4\ub418\uac8c",def:"in an honest manner",unit:13,opts:["truly", "frank", "misery", "emotion"]},
    {w:"misery",m:"\uace0\ud1b5, \ube44\ucc38",def:"extreme suffering or unhappiness",unit:13,opts:["stressful", "envy", "freedom", "misery"]},
    {w:"desire",m:"\uc695\ub9dd",def:"a strong hope or wish",unit:13,opts:["frank", "offense", "desire", "freedom"]},
    {w:"emotion",m:"\uac10\uc815, \uc815\uc11c",def:"a strong feeling such as joy, hatred, or fear",unit:13,opts:["emotion", "envy", "strict", "faith"]},
    {w:"force",m:"\uac15\uc694\ud558\ub2e4",def:"to make someone do something",unit:13,opts:["emotion", "force", "misery", "doubt"]},
    {w:"frank",m:"\uc194\uc9c1\ud55c",def:"honest and truthful",unit:13,opts:["faith", "shocked", "offense", "frank"]},
    {w:"envy",m:"\uc9c8\ud22c",def:"the feeling of wanting to have what someone else has",unit:13,opts:["envy", "stressful", "strict", "truly"]},
    {w:"offense",m:"\uacf5\uaca9, \uc704\ubc18, \uae30\ubd84\uc744 \ud5e4\uce58\ub294 \uac83",def:"something that causes a person to be hurt, angry, or upset",unit:13,opts:["desire", "offense", "stress", "frank"]},
    {w:"strict",m:"\uc5c4\uaca9\ud55c",def:"demanding that people follow rules or behave in a certain way",unit:13,opts:["emotion", "offense", "strict", "shocked"]},
    {w:"stressful",m:"\uc2a4\ud2b8\ub808\uc2a4\uac00 \ub9ce\uc740",def:"causing worry or anxiety",unit:13,opts:["doubt", "misery", "stressful", "frank"]},
    {w:"faith",m:"\ubbff\uc74c",def:"a strong belief or trust in someone or something",unit:13,opts:["envy", "freedom", "faith", "desire"]},
    {w:"honor",m:"\uba85\uc608",def:"a type of respect or promise",unit:13,opts:["truly", "force", "honor", "stress"]},
    {w:"shocked",m:"\ucda9\uaca9\uc744 \ubc1b\uc740",def:"feeling surprised and upset by something",unit:13,opts:["shocked", "doubt", "desire", "emotion"]},
    {w:"freedom",m:"\uc790\uc720",def:"the right to do or say what you want",unit:13,opts:["freedom", "honor", "misery", "desire"]},
    {w:"doubt",m:"\uc758\uc2ec",def:"a feeling of being uncertain or unsure about something",unit:13,opts:["faith", "doubt", "shocked", "emotion"]},
    {w:"mental",m:"\uc815\uc2e0\uc758",def:"connected with or happening in the mind",unit:13,opts:["truly", "strict", "mental", "desire"]},
  ],
  "cew3_14": [
    {w:"voodoo",m:"\ubd80\ub450\uad50",def:"magical beliefs and practices that are a form of religion",unit:14,opts:["sorrow", "voodoo", "worship", "religion"]},
    {w:"witch",m:"\ub9c8\ub140",def:"a woman who is thought to have magic powers",unit:14,opts:["sorrow", "witch", "creed", "coffin"]},
    {w:"worship",m:"\uc22d\ubc30\ud558\ub2e4",def:"to show love and respect for a god",unit:14,opts:["religion", "creed", "worship", "pray"]},
    {w:"creepy",m:"\uc624\uc2f9\ud55c",def:"causing people to feel nervous and afraid",unit:14,opts:["gloomy", "spooky", "creed", "creepy"]},
    {w:"ritual",m:"\uc758\uc2dd, \uc81c\uc0ac",def:"a series of actions that are always performed in the same way",unit:14,opts:["ritual", "haunted", "religion", "creed"]},
    {w:"graveyard",m:"\ubb18\uc9c0",def:"an area of ground where people are buried",unit:14,opts:["spooky", "sorrow", "ritual", "graveyard"]},
    {w:"pray",m:"\uae30\ub3c4\ud558\ub2e4",def:"to speak to a god in order to ask for help or to give thanks",unit:14,opts:["haunted", "sorrow", "myth", "pray"]},
    {w:"gloomy",m:"\uc6b0\uc6b8\ud55c",def:"causing a sad or dreary feeling",unit:14,opts:["gloomy", "unlucky", "worship", "myth"]},
    {w:"coffin",m:"\uad00",def:"a long box in which a person who has died is buried",unit:14,opts:["myth", "sorrow", "coffin", "haunted"]},
    {w:"haunted",m:"\uc720\ub839\uc774 \uc790\uc8fc \ub098\uc624\ub294",def:"lived in or visited by ghosts",unit:14,opts:["spooky", "haunted", "witch", "gloomy"]},
    {w:"religion",m:"\uc885\uad50",def:"the belief in a god or a group of gods",unit:14,opts:["dead", "worship", "gloomy", "religion"]},
    {w:"spooky",m:"\ubb34\uc2dc\ubb34\uc2dc\ud55c, \ubb34\uc11c\uc6b4",def:"strange and frightening",unit:14,opts:["graveyard", "spooky", "haunted", "sorrow"]},
    {w:"creed",m:"\uc2e0\ub150",def:"a set of beliefs held by a person or group",unit:14,opts:["creed", "voodoo", "pray", "ritual"]},
    {w:"dead",m:"\uc8fd\uc740",def:"no longer alive",unit:14,opts:["gloomy", "creepy", "dead", "unlucky"]},
    {w:"sorrow",m:"\uc2ac\ud514",def:"a feeling of great sadness",unit:14,opts:["sorrow", "witch", "ritual", "graveyard"]},
    {w:"unlucky",m:"\ubd88\uc6b4\ud55c",def:"causing bad luck",unit:14,opts:["unlucky", "creed", "gloomy", "religion"]},
    {w:"myth",m:"\uc2e0\ud654",def:"a story that many people believe, but which is not true",unit:14,opts:["haunted", "creed", "myth", "unlucky"]},
  ],
  "cew3_15": [
    {w:"evil",m:"\uc0ac\uc545\ud55c",def:"enjoying harming others",unit:15,opts:["angel", "evil", "mythical", "horn"]},
    {w:"horn",m:"\ubfd4",def:"the hard, pointed thing on the head of some animals",unit:15,opts:["crawl", "horn", "mythical", "evil"]},
    {w:"false",m:"\uac70\uc9d3\uc758",def:"completely untrue",unit:15,opts:["image", "false", "mythical", "beast"]},
    {w:"legend",m:"\uc804\uc124, \uc2e0\ud654",def:"an old story about people and events that may not be true",unit:15,opts:["legend", "beast", "fairy", "image"]},
    {w:"mysterious",m:"\uc2e0\ube44\uc758, \ubd88\uac00\uc0ac\uc758\ud55c",def:"strange, unknown, or difficult to understand",unit:15,opts:["mythical", "mysterious", "fairy", "angel"]},
    {w:"hunt",m:"\uc0ac\ub0e5\ud558\ub2e4",def:"to chase animals in order to catch or kill them",unit:15,opts:["ghost", "evil", "hunt", "mysterious"]},
    {w:"appearance",m:"\uc678\ubaa8, \uac89\ubaa8\uc2b5",def:"the way someone or something looks",unit:15,opts:["mythical", "false", "luck", "appearance"]},
    {w:"invisible",m:"\ub208\uc5d0 \ubcf4\uc774\uc9c0 \uc54a\ub294",def:"cannot be seen",unit:15,opts:["invisible", "horn", "legend", "hunt"]},
    {w:"ghost",m:"\uc720\ub839",def:"a spirit of a person who has died",unit:15,opts:["horn", "fairy", "appearance", "ghost"]},
    {w:"image",m:"\uc774\ubbf8\uc9c0",def:"a picture of a person or an idea of how something is",unit:15,opts:["false", "horn", "image", "luck"]},
    {w:"angel",m:"\ucc9c\uc0ac",def:"a spiritual creature who is God\u2019s servant in heaven",unit:15,opts:["mysterious", "image", "legend", "angel"]},
    {w:"mythical",m:"\uc2e0\ud654\uc0c1\uc758",def:"from a story that most people think is not true",unit:15,opts:["false", "beast", "mythical", "crawl"]},
    {w:"fairy",m:"\uc694\uc815",def:"an imaginary creature that looks like a small person with wings",unit:15,opts:["angel", "fairy", "legend", "luck"]},
    {w:"crawl",m:"\uae30\ub2e4",def:"to move along with one\u2019s body close to the ground",unit:15,opts:["false", "crawl", "luck", "legend"]},
    {w:"beast",m:"\uc9d0\uc2b9",def:"a wild animal that is large, dangerous, or unusual",unit:15,opts:["beast", "fairy", "mysterious", "horn"]},
    {w:"luck",m:"\uc6b4",def:"a thing that happens to a person because of chance",unit:15,opts:["crawl", "luck", "hunt", "appearance"]},
  ],
  "cew3_16": [
    {w:"beak",m:"\ubd80\ub9ac",def:"the hard, pointed mouth of a bird",unit:16,opts:["tail", "roar", "beak", "breed"]},
    {w:"paw",m:"\ubc1c",def:"an animal\u2019s foot that has nails or claws",unit:16,opts:["breed", "creature", "paw", "reindeer"]},
    {w:"worm",m:"\ubc8c\ub808",def:"a long thin creature with no bones and no legs",unit:16,opts:["beak", "tail", "wolf", "worm"]},
    {w:"wildlife",m:"\uc57c\uc0dd\ub3d9\ubb3c",def:"animals and insects that live in a natural environment",unit:16,opts:["paw", "wildlife", "tail", "reindeer"]},
    {w:"extinct",m:"\uba78\uc885\ud55c",def:"a type of animal or plant does not exist anymore",unit:16,opts:["wildlife", "tail", "paw", "extinct"]},
    {w:"tail",m:"\uaf2c\ub9ac",def:"a part at the back of an animal\u2019s body that can move",unit:16,opts:["tail", "creature", "extinct", "wildlife"]},
    {w:"reindeer",m:"\uc21c\ub85d",def:"a large deer with long, wide antlers",unit:16,opts:["breed", "wildlife", "reindeer", "cattle"]},
    {w:"leopard",m:"\ud45c\ubc94",def:"a large animal with yellow fur and black spots",unit:16,opts:["worm", "reindeer", "leopard", "zookeeper"]},
    {w:"breed",m:"\uc0c8\ub07c\ub97c \ub0b3\ub2e4, \ubc88\uc2dd\ud558\ub2e4",def:"to mate in order to have babies",unit:16,opts:["reindeer", "claw", "zookeeper", "breed"]},
    {w:"claw",m:"\ubc1c\ud1b1",def:"a sharp, curved part on the toe of an animal or bird",unit:16,opts:["feather", "zookeeper", "claw", "paw"]},
    {w:"roar",m:"\ud3ec\ud6a8\ud558\ub2e4",def:"to make a deep, very loud noise",unit:16,opts:["feather", "hatch", "leopard", "roar"]},
    {w:"feather",m:"\uae43\ud138",def:"one of the light, soft parts that cover a bird\u2019s body",unit:16,opts:["leopard", "tail", "feather", "worm"]},
    {w:"creature",m:"\uc0dd\uba85\uccb4",def:"anything that is living, such as an animal, fish, or insect",unit:16,opts:["zookeeper", "tail", "creature", "paw"]},
    {w:"wolf",m:"\ub291\ub300",def:"a wild animal that is similar to a dog",unit:16,opts:["wolf", "tail", "leopard", "roar"]},
    {w:"zookeeper",m:"\uc0ac\uc721\uc0ac",def:"a person who takes care of the animals in a zoo",unit:16,opts:["cattle", "leopard", "zookeeper", "paw"]},
    {w:"hatch",m:"\ubd80\ud654\ud558\ub2e4",def:"to be born by coming out of an egg",unit:16,opts:["hatch", "wildlife", "wolf", "extinct"]},
    {w:"turtle",m:"\uac70\ubd81",def:"a reptile with a soft body covered by a hard shell",unit:16,opts:["zookeeper", "turtle", "reindeer", "roar"]},
    {w:"cattle",m:"\uac00\ucd95, \uc18c",def:"large mammals raised on farms for their milk or meat",unit:16,opts:["creature", "cattle", "paw", "turtle"]},
  ],
  "cew4_1": [
    {w:"coral",m:"\uc0b0\ud638",def:"the hard red, white, or pink substance",unit:1,opts:["pollution", "bay", "stream", "coral"]},
    {w:"galaxy",m:"\uc740\ud558",def:"a single, large group of stars that is part of the universe",unit:1,opts:["coast", "coral", "bloom", "galaxy"]},
    {w:"shore",m:"\ud574\uc548",def:"where the sea or ocean meets the land",unit:1,opts:["district", "recycle", "shore", "wave"]},
    {w:"trash",m:"\uc4f0\ub808\uae30",def:"something you throw away",unit:1,opts:["fossil", "trash", "pollution", "shore"]},
    {w:"recycle",m:"\uc7ac\ud657\uc6a9\ud558\ub2e4",def:"to use something old to make something new",unit:1,opts:["bay", "fossil", "recycle", "coast"]},
    {w:"district",m:"\uc9c0\uc5ed, \uc9c0\ubc29, \uc9c0\uad6c",def:"a particular section of a city, town, or country",unit:1,opts:["climate", "district", "fossil", "coral"]},
    {w:"coast",m:"\ud574\uc548, \uc5f0\uc548",def:"the land along the sea or ocean",unit:1,opts:["cliff", "coast", "bay", "shore"]},
    {w:"pollution",m:"\uc624\uc5fc",def:"anything that makes the air or water dirty",unit:1,opts:["climate", "cliff", "pollution", "fossil"]},
    {w:"soil",m:"\ud759, \ub545",def:"the top layer of earth in which plants grow",unit:1,opts:["fossil", "coast", "soil", "universe"]},
    {w:"fossil",m:"\ud654\uc11d",def:"the remains of an ancient plant or animal",unit:1,opts:["fossil", "universe", "galaxy", "trash"]},
    {w:"universe",m:"\uc6b0\uc8fc",def:"everything that exists in space",unit:1,opts:["fossil", "universe", "district", "recycle"]},
    {w:"wave",m:"\ud30c\ub3c4",def:"a long area of water that rises and moves toward the shore",unit:1,opts:["soil", "wave", "fossil", "shore"]},
    {w:"bloom",m:"\uaf43\uc774 \ud53c\ub2e4",def:"to produce flowers on a tree or plant",unit:1,opts:["recycle", "bloom", "shore", "climate"]},
    {w:"bay",m:"\ub9cc, \ubca0\uc774",def:"a large area of water that is part of an ocean or lake",unit:1,opts:["universe", "region", "district", "bay"]},
    {w:"climate",m:"\uae30\ud6c4, \ud48d\ud1a0",def:"the weather conditions and patterns in a region",unit:1,opts:["fossil", "universe", "cliff", "climate"]},
    {w:"region",m:"\uc9c0\uc5ed, \uc9c0\ubc29",def:"a large or particular area of a country or of the world",unit:1,opts:["bloom", "trash", "galaxy", "region"]},
    {w:"stream",m:"\ud558\ucc9a",def:"a body of water that flows and is smaller than a river",unit:1,opts:["wave", "stream", "recycle", "universe"]},
    {w:"cliff",m:"\uc803\ubcbd, \ubcbc\ub791",def:"a high area of rock with a very steep side",unit:1,opts:["cliff", "bloom", "soil", "pollution"]},
  ],
  "cew4_2": [
    {w:"flow",m:"\ud750\ub974\ub2e4",def:"to move in a steady, continuous stream",unit:2,opts:["impact", "polar", "rise", "flow"]},
    {w:"forecast",m:"\uc608\uc0c1, \uc802\ub9dd, \uc608\ubcf4",def:"the weather that you think might happen in the future",unit:2,opts:["oxygen", "global", "forecast", "impact"]},
    {w:"polar",m:"\uadf9\uc9c0\ubc29\uc758, \ubd81\uad6d\uc758, \ub0a8\uadf9\uc758",def:"relating to the North or South Pole",unit:2,opts:["root", "polar", "frozen", "peak"]},
    {w:"adapt",m:"\uc801\uc751\ud558\ub2e4",def:"to change something to make it easier to live in a certain place",unit:2,opts:["adapt", "flow", "global", "freeze"]},
    {w:"impact",m:"\uc601\ud5a5, \ucda9\uaca9",def:"a powerful force, effect, or influence",unit:2,opts:["impact", "adapt", "polar", "landscape"]},
    {w:"freeze",m:"\ub0c9\ub3d9\ud558\ub2e4",def:"to bring it\u2019s temperature to or below 0\u00b0C",unit:2,opts:["flood", "oxygen", "freeze", "flame"]},
    {w:"environment",m:"\ud656\uacbd, \uc0c1\ud669",def:"the natural world in which people, animals, and plants live",unit:2,opts:["continent", "environment", "root", "forecast"]},
    {w:"global",m:"\uc138\uacc4\uc801\uc776",def:"involving the whole world",unit:2,opts:["root", "global", "polar", "forecast"]},
    {w:"landscape",m:"\ud48d\uacbd",def:"distinct quality or appearance of a place",unit:2,opts:["environment", "landscape", "root", "oxygen"]},
    {w:"peak",m:"\uc0b0\uaf2d\ub300\uae30, \uc815\uc0c1, \uc803\uc815",def:"the pointed top of a mountain",unit:2,opts:["continent", "peak", "impact", "environment"]},
    {w:"frozen",m:"\ub3d9\uacb0\ub41c",def:"turned into ice",unit:2,opts:["frozen", "flow", "oxygen", "freeze"]},
    {w:"flame",m:"\ud654\uc5fc, \ubd88\uaf43",def:"a burning gas you can see when there is a fire",unit:2,opts:["oxygen", "frozen", "flame", "humid"]},
    {w:"root",m:"\ubfcc\ub9ac, \uc6d0\uc776",def:"the part of a plant that usually grows under the ground",unit:2,opts:["polar", "frozen", "root", "adapt"]},
    {w:"rise",m:"\uc99d\uac00\ud558\ub2e4, \uc0c1\uc2b9\ud558\ub2e4",def:"to move upward",unit:2,opts:["adapt", "forecast", "impact", "rise"]},
    {w:"flood",m:"\ud64d\uc218, \ubc94\ub78c",def:"when a large amount of water from a storm covers an area",unit:2,opts:["global", "root", "flame", "flood"]},
    {w:"humid",m:"\uc2b5\ud55a",def:"having a lot of moisture in the air",unit:2,opts:["forecast", "frozen", "humid", "polar"]},
    {w:"oxygen",m:"\uc0b0\uc18c",def:"a chemical in the air that is necessary for breathing",unit:2,opts:["oxygen", "flood", "flame", "continent"]},
    {w:"continent",m:"\ub300\ub959",def:"one of the major divisions of land on Earth",unit:2,opts:["global", "forecast", "continent", "root"]},
  ],
  "cew4_3": [
    {w:"crew",m:"\uc2b9\ubb34\uc6d0, \uc120\uc6d0",def:"the people who work on a ship, plane, or train",unit:3,opts:["reserve", "expedition", "crew", "movement"]},
    {w:"tourism",m:"\uacfe\uad11, \uc5ec\ud589",def:"the act of visiting a place for fun or in order to see the sights",unit:3,opts:["rail", "route", "resort", "tourism"]},
    {w:"route",m:"\uae38, \ubc29\ubc95",def:"a way to get from one place to another",unit:3,opts:["route", "resort", "crash", "rail"]},
    {w:"cycle",m:"\uc790\uc802\uac70 (\ub4f1)\uc744 \ud0c0\ub2e4",def:"to ride a bicycle",unit:3,opts:["resort", "convenient", "cycle", "expedition"]},
    {w:"tropical",m:"\uc5f4\ub300\uc758",def:"very hot, humid, and often near a beach",unit:3,opts:["souvenir", "route", "sailor", "tropical"]},
    {w:"reserve",m:"\ubcf4\uc720\ud558\ub2e4, \uc608\uc57d\ud558\ub2e4",def:"to make prior arrangements to use something",unit:3,opts:["reserve", "cycle", "souvenir", "convenient"]},
    {w:"resort",m:"\ub9ac\uc870\ud2b8",def:"a place that offers a lot to do when you go on vacation",unit:3,opts:["crew", "rail", "resort", "tropical"]},
    {w:"crash",m:"\ucda9\ub3cc \uc0ac\uace0",def:"an accident between vehicles that causes damage or injury",unit:3,opts:["cycle", "crash", "brake", "reserve"]},
    {w:"rail",m:"\ucc9b\ub3c4, \ub808\uc777, \ucc9b\ub85c",def:"the system of transportation that uses trains",unit:3,opts:["sailor", "rail", "tropical", "cycle"]},
    {w:"wander",m:"\ub3cc\uc544\ub2e4\ub2c8\ub2e4, \ubc30\ud68c\ud558\ub2e4",def:"to walk someplace with no particular destination",unit:3,opts:["rail", "tropical", "movement", "wander"]},
    {w:"eastern",m:"\ub3d9\ubd80\uc758, \ub3d9\ucabd\uc758",def:"in or from the east of a region, state, or country",unit:3,opts:["eastern", "resort", "tourism", "entry"]},
    {w:"convenient",m:"\ud3b8\ub9ac\ud55a, \uac04\ud3b8\ud55a",def:"something is easy, useful, or suitable for a particular purpose",unit:3,opts:["reserve", "convenient", "souvenir", "tourism"]},
    {w:"sailor",m:"\uc120\uc6d0, \ud574\uad6e, \ud56d\ud574\uc0ac",def:"a person who works as part of a crew on a boat or ship",unit:3,opts:["tourism", "entry", "wander", "sailor"]},
    {w:"entry",m:"(\uac72\ubb3c, \uc7a5\uc18c \ub4f1\uc758) \uc785\uad6c, \ubb38",def:"a door, gate, etc. by which you enter a place",unit:3,opts:["entry", "crash", "wander", "rail"]},
    {w:"expedition",m:"\ud0d0\ud5d8, \uc6d0\uc815, \uc5ec\ud589",def:"a journey taken by people for a specific purpose",unit:3,opts:["expedition", "tropical", "rail", "souvenir"]},
    {w:"brake",m:"\ube0c\ub808\uc774\ud06c",def:"the part of a vehicle that makes it stop",unit:3,opts:["brake", "crash", "sailor", "resort"]},
    {w:"movement",m:"\uc6c0\uc9c1\uc784, \uc774\ub3d9",def:"an act of moving the location or position of something",unit:3,opts:["wander", "sailor", "brake", "movement"]},
    {w:"souvenir",m:"\uae30\ub150\ud488",def:"a thing you buy or keep to help you remember a holiday",unit:3,opts:["souvenir", "entry", "rail", "eastern"]},
  ],
  "cew4_4": [
    {w:"southern",m:"\ub0a8\ubd80\uc758, \ub0a8\ucabd\uc758",def:"in or from the south of a region, state, or country",unit:4,opts:["destination", "southern", "lane", "jet"]},
    {w:"destination",m:"\ubaa9\uc801\uc9c0",def:"the place someone or something is going",unit:4,opts:["rush", "signal", "destination", "cruise"]},
    {w:"via",m:"~\uc744 \ud1b5\ud558\uc5ec, ~\uacbd\uc720\ub85c",def:"traveling through a place on the way to a destination",unit:4,opts:["jet", "rush", "motor", "via"]},
    {w:"baggage",m:"\uc218\ud654\ubb3c",def:"all the personal items that you take on a trip",unit:4,opts:["lane", "campsite", "baggage", "ahead"]},
    {w:"campsite",m:"\ucea0\ud504\uc7a5",def:"a place where you put up your tent",unit:4,opts:["campsite", "via", "ahead", "western"]},
    {w:"lane",m:"\ucc28\uc120, \ucc28\ub85c",def:"a part of a road that is separated by painted lines",unit:4,opts:["lane", "jet", "aircraft", "rush"]},
    {w:"motor",m:"\ubaa8\ud130",def:"a machine that makes power or motion",unit:4,opts:["jet", "rush", "motor", "campsite"]},
    {w:"rush",m:"\uc11c\ub450\ub974\ub2e4",def:"to do something in a hurry",unit:4,opts:["rush", "launch", "lane", "campsite"]},
    {w:"steer",m:"\uc870\uc885\ud558\ub2e4",def:"to control the direction it goes in",unit:4,opts:["launch", "cruise", "rush", "steer"]},
    {w:"signal",m:"\uc2de\ud638, \ud1b5\uc2de",def:"an act that gives information",unit:4,opts:["signal", "abroad", "cruise", "launch"]},
    {w:"launch",m:"\ubc1c\uc0ac\ud558\ub2e4, \uc2dc\uc791\ud558\ub2e4",def:"to shoot something into the air or into space",unit:4,opts:["abroad", "rush", "launch", "cruise"]},
    {w:"aircraft",m:"\ud56d\uacf5\uae30",def:"a machine such as a plane or helicopter",unit:4,opts:["aircraft", "motor", "baggage", "via"]},
    {w:"abroad",m:"\ud574\uc678\uc5d0",def:"to go to a foreign country",unit:4,opts:["abroad", "baggage", "western", "aircraft"]},
    {w:"cruise",m:"\uc21a\ud56d\ud558\ub2e4",def:"to travel on a big ship, usually for a vacation",unit:4,opts:["motor", "western", "cruise", "destination"]},
    {w:"jet",m:"\uc81c\ud2b8\uae30",def:"a fast airplane with one or two engines",unit:4,opts:["steer", "lane", "ahead", "jet"]},
    {w:"fuel",m:"\uc5f0\ub8cc",def:"a material that can be burned for energy",unit:4,opts:["fuel", "cruise", "southern", "via"]},
    {w:"ahead",m:"\uc55e\uc11c, \uc55e\uc5d0",def:"to be in front of or closer to the front",unit:4,opts:["destination", "signal", "ahead", "rush"]},
    {w:"western",m:"\uc11c\uc591\uc758, \uc11c\ubd80\uc758, \uc11c\ucabd\uc758",def:"in or from the west of a region, state, or country",unit:4,opts:["western", "ahead", "via", "rush"]},
  ],
  "cew4_5": [
    {w:"producer",m:"\uc81c\uc791\uc790",def:"a person who is in charge of making a movie, play, or record",unit:5,opts:["specialist", "priest", "minister", "producer"]},
    {w:"import",m:"\uc218\uc785\ud558\ub2e4",def:"to bring a product into a country to be sold",unit:5,opts:["minister", "manufacture", "priest", "import"]},
    {w:"client",m:"\uace0\uac1d",def:"a person who pays for a service done by a professional",unit:5,opts:["promotion", "production", "import", "client"]},
    {w:"committee",m:"\uc704\uc6d0\ud68c",def:"a group of people who get together to make decisions",unit:5,opts:["issue", "producer", "apply", "committee"]},
    {w:"assistant",m:"\uc870\uc218",def:"a person who helps someone else",unit:5,opts:["producer", "hire", "specialist", "assistant"]},
    {w:"promotion",m:"\uc2b9\uc9c2",def:"a move up to a better position in a company",unit:5,opts:["minister", "retire", "promotion", "hire"]},
    {w:"production",m:"\uc0dd\uc0b0, \uc81c\uc791",def:"the process of making something that will be sold",unit:5,opts:["minister", "specialist", "production", "import"]},
    {w:"specialist",m:"\uc802\ubb38\uac00",def:"a person who has great skill in a particular area of study",unit:5,opts:["retire", "specialist", "production", "chief"]},
    {w:"retire",m:"\uc740\ud1f4\ud558\ub2e4",def:"to stop working after a long time",unit:5,opts:["committee", "retire", "apply", "specialist"]},
    {w:"priest",m:"(\uac00\ud1a8\ub9ad) \uc0ac\uc81c, \uc2de\ubd80",def:"a person who has been trained to perform religious duties",unit:5,opts:["retire", "priest", "minister", "producer"]},
    {w:"chief",m:"\uc7a5\uacfe, \uc6b0\ub450\uba38\ub9ac",def:"the person who is in charge of a group or company",unit:5,opts:["committee", "retire", "chief", "apply"]},
    {w:"agent",m:"\ub300\ub9ac\uc776",def:"a person who works on behalf of someone else",unit:5,opts:["producer", "agent", "priest", "promotion"]},
    {w:"hire",m:"\uace0\uc6a9\ud558\ub2e4",def:"to give someone a particular job",unit:5,opts:["hire", "client", "chief", "apply"]},
    {w:"apply",m:"\uc2de\uccad\ud558\ub2e4, \uc9c0\uc6d0\ud558\ub2e4",def:"to ask for something formally",unit:5,opts:["promotion", "manufacture", "apply", "specialist"]},
    {w:"issue",m:"\ubb38\uc81c, \uc7c1\uc810, \uc774\uc288",def:"an important topic that people are concerned about",unit:5,opts:["issue", "production", "client", "hire"]},
    {w:"minister",m:"\ubaa9\uc0ac, \uc2de\ubd80",def:"a person who leads a church and performs services",unit:5,opts:["apply", "specialist", "committee", "minister"]},
    {w:"manufacture",m:"\uc81c\uc870\ud558\ub2e4",def:"to use machines to make large amounts of something",unit:5,opts:["issue", "manufacture", "import", "assistant"]},
  ],
  "cew4_6": [
    {w:"guide",m:"\uac00\uc774\ub4dc",def:"a person who shows visitors interesting places",unit:6,opts:["employ", "profession", "chart", "guide"]},
    {w:"barber",m:"\uc774\ubc1c\uc0ac",def:"a person who cuts men\u2019s hair and beards",unit:6,opts:["barber", "expert", "signature", "spare"]},
    {w:"report",m:"\ubcf4\uace0\uc11c",def:"a spoken or written description of an event or situation",unit:6,opts:["report", "expert", "responsibility", "capable"]},
    {w:"schedule",m:"\uc777\uc815",def:"a plan of how and when things will be done",unit:6,opts:["employ", "strike", "schedule", "signature"]},
    {w:"employ",m:"\uace0\uc6a9\ud558\ub2e4",def:"to give someone a job",unit:6,opts:["boss", "employ", "spare", "profession"]},
    {w:"contract",m:"\uacc4\uc57d",def:"a legal agreement between two people or companies",unit:6,opts:["contract", "chart", "strike", "spare"]},
    {w:"profession",m:"\uc9c1\uc5c5",def:"a job that requires special training or skills",unit:6,opts:["responsibility", "guide", "contract", "profession"]},
    {w:"signature",m:"\uc11c\uba85",def:"a person\u2019s name written by that same person",unit:6,opts:["guide", "schedule", "signature", "debate"]},
    {w:"chart",m:"\ucc28\ud2b8",def:"information presented in a form such as a table or diagram",unit:6,opts:["spare", "chart", "boss", "debate"]},
    {w:"promote",m:"\ud64d\ubcf4\ud558\ub2e4",def:"to make people more aware of its existence",unit:6,opts:["signature", "promote", "guide", "barber"]},
    {w:"debate",m:"\ud1a0\ub85e",def:"a discussion between people who have different views",unit:6,opts:["spare", "debate", "chart", "profession"]},
    {w:"spare",m:"\uc5ec\ubd82\uc758",def:"something that is extra and not currently used",unit:6,opts:["report", "signature", "promote", "spare"]},
    {w:"capable",m:"\uac00\ub2a5\uc131 \uc788\ub294, \ud55b \uc218 \uc788\ub294",def:"have the ability to do something successfully",unit:6,opts:["contract", "capable", "expert", "guide"]},
    {w:"boss",m:"\uc0c1\uc0ac",def:"a person in charge who tells employees what to do",unit:6,opts:["boss", "capable", "contract", "expert"]},
    {w:"expert",m:"\uc802\ubb38\uac00",def:"a person who knows a lot about a subject or topic",unit:6,opts:["expert", "boss", "responsibility", "debate"]},
    {w:"responsibility",m:"\ucc45\uc784",def:"a task, job, or duty that you are required to do",unit:6,opts:["spare", "responsibility", "profession", "schedule"]},
    {w:"strike",m:"\ud30c\uc5c5\ud558\ub2e4",def:"to stop work in order to get your demands met",unit:6,opts:["debate", "responsibility", "boss", "strike"]},
  ],
  "cew4_7": [
    {w:"attention",m:"\uc8fc\uc758(\ub825), \uc8fc\ubaa9",def:"to stand with your body stiff and straight",unit:7,opts:["tank", "argue", "attention", "military"]},
    {w:"argue",m:"\uc8fc\uc7a5\ud558\ub2e4, \ub17a\uc7c1\ud558\ub2e4",def:"to disagree about something",unit:7,opts:["argue", "armor", "soldier", "gun"]},
    {w:"captain",m:"\uc721\uad6e \ub300\uc704, \uc120\uc7a5, \uc8fc\uc7a5",def:"an officer of high rank in an army",unit:7,opts:["jeep", "defeat", "captain", "helmet"]},
    {w:"soldier",m:"\uad6e\uc776",def:"a person who is a member of the military",unit:7,opts:["armor", "military", "soldier", "guard"]},
    {w:"ally",m:"\ub3d9\ub9f9, \uc5f0\ud569",def:"a country that helps another country in a time of war",unit:7,opts:["military", "tank", "ally", "soldier"]},
    {w:"jeep",m:"\uc9c0\ud504, (\uad6e\uc6a9\uc758) 4\ub95c \uad6c\ub3d9 \uc18c\ud615 \uc790\ub3d9\ucc28",def:"a small truck that can go over rough surfaces and roads",unit:7,opts:["soldier", "jeep", "captain", "attention"]},
    {w:"military",m:"\uad6e\uc0ac\uc758",def:"related to the armed services of a country",unit:7,opts:["peace", "helmet", "military", "soldier"]},
    {w:"armor",m:"\uac11\uc637, \uc7a5\uac11",def:"special clothing that soldiers wear to protect their bodies",unit:7,opts:["gun", "arrow", "armor", "captain"]},
    {w:"submarine",m:"\uc7a0\uc218\ud568",def:"a ship that moves under the water",unit:7,opts:["submarine", "soldier", "jeep", "attack"]},
    {w:"tank",m:"\ud0f1\ud06c",def:"a military vehicle that is covered with armor",unit:7,opts:["defeat", "tank", "submarine", "attack"]},
    {w:"gun",m:"\ucd1d",def:"a weapon that shoots bullets",unit:7,opts:["gun", "argue", "arrow", "soldier"]},
    {w:"helmet",m:"\ud5ec\uba67",def:"a kind of hat you wear to protect your head",unit:7,opts:["helmet", "attack", "defeat", "argue"]},
    {w:"defeat",m:"\ud328\ubc30\uc2dc\ud0a4\ub2e4, \uc774\uae30\ub2e4",def:"to win in a game or war",unit:7,opts:["attack", "defeat", "soldier", "arrow"]},
    {w:"peace",m:"\ud3c9\ud654",def:"no war or fighting",unit:7,opts:["jeep", "peace", "soldier", "argue"]},
    {w:"arrow",m:"\ud654\uc0b4",def:"a type of weapon with a pointy end",unit:7,opts:["arrow", "argue", "armor", "attention"]},
    {w:"guard",m:"\uacbd\ube44\uc6d0",def:"a person who protects something or someone",unit:7,opts:["tank", "defeat", "guard", "submarine"]},
    {w:"attack",m:"\uacf5\uaca9\ud558\ub2e4",def:"to try to hurt or destroy something in a violent way",unit:7,opts:["captain", "military", "attack", "soldier"]},
  ],
  "cew4_8": [
    {w:"capital",m:"\uc218\ub3c4",def:"the city where a country or region has its government",unit:8,opts:["independent", "president", "society", "capital"]},
    {w:"aviation",m:"\ube44\ud589, \ud56d\uacf5",def:"the practice or business of flying airplanes or helicopters",unit:8,opts:["official", "army", "national", "aviation"]},
    {w:"revolution",m:"\ud601\uba85, \uac1c\ud601, \ud601\uc2de",def:"an attempt to end the rule of a government in power",unit:8,opts:["army", "revolution", "leader", "independent"]},
    {w:"independent",m:"\ub3c5\uc790\uc801\uc776, \ub3c5\ub9bd\ud55a",def:"not controlled by others",unit:8,opts:["gain", "aviation", "independent", "marine"]},
    {w:"battle",m:"\uc802\ud22c, \uc2f8\uc6c0",def:"a military fight between groups of soldiers",unit:8,opts:["nation", "public", "revolution", "battle"]},
    {w:"public",m:"\uacf5\uacf5\uc758",def:"affecting all the people in a community",unit:8,opts:["agreement", "capital", "gain", "public"]},
    {w:"national",m:"\uad6d\uac00\uc758",def:"relating to a whole country or nation",unit:8,opts:["society", "army", "charity", "national"]},
    {w:"charity",m:"\uc790\uc120, \uae30\ubd80, \ubaa8\uae08",def:"an organization that helps people",unit:8,opts:["charity", "society", "official", "army"]},
    {w:"leader",m:"\uc9c0\ub3c4\uc790",def:"someone who guides or leads other people",unit:8,opts:["leader", "national", "aviation", "nation"]},
    {w:"crisis",m:"\uc704\uae30, \ubb38\uc81c",def:"a situation that needs immediate attention",unit:8,opts:["crisis", "independent", "national", "society"]},
    {w:"agreement",m:"\ud569\uc758",def:"a situation in which people have the same opinions",unit:8,opts:["agreement", "independent", "nation", "crisis"]},
    {w:"gain",m:"\uc5bb\ub2e4, \uc99d\uac00\ud558\ub2e4",def:"to get something you value or want",unit:8,opts:["marine", "charity", "gain", "revolution"]},
    {w:"army",m:"\uad6e\ub300",def:"a large group of soldiers who fight on the ground",unit:8,opts:["aviation", "nation", "army", "capital"]},
    {w:"nation",m:"\uad6d\uac00",def:"a large area of land that is led by its own government",unit:8,opts:["nation", "marine", "charity", "battle"]},
    {w:"official",m:"\uacf5\uc2dd\uc758",def:"being approved by the authorities",unit:8,opts:["society", "aviation", "marine", "official"]},
    {w:"president",m:"\ub300\ud1b5\ub839",def:"the elected head of some governments",unit:8,opts:["independent", "official", "leader", "president"]},
    {w:"social",m:"\uc0ac\ud68c\uc758",def:"relating to society",unit:8,opts:["revolution", "social", "national", "agreement"]},
    {w:"society",m:"\uc0ac\ud68c",def:"a group of people who live together in organized communities",unit:8,opts:["social", "society", "gain", "public"]},
    {w:"marine",m:"\ud574\ubcd1 \ub300\uc6d0",def:"a soldier who serves both on shipboard and on land",unit:8,opts:["official", "agreement", "marine", "independent"]},
  ],
  "cew4_9": [
    {w:"royal",m:"\uc655\uc2e4\uc758",def:"related to a king or queen",unit:9,opts:["domestic", "royal", "politics", "election"]},
    {w:"parliament",m:"\uad6d\ud68c",def:"a group of people who make the laws in governments",unit:9,opts:["election", "parliament", "politics", "candidate"]},
    {w:"influence",m:"\uc601\ud5a5\uc744 \ubbf8\uce58\ub2e4",def:"the power to change something",unit:9,opts:["royal", "politician", "regulation", "influence"]},
    {w:"federal",m:"\uc5f0\ubc29\uc758, \uc5f0\ubc29 \uc815\ubd80\uc758",def:"something that has to do with the central government",unit:9,opts:["politics", "republic", "influence", "federal"]},
    {w:"regulation",m:"\uaddc\uc81c, \ubc95\uaddc",def:"an official law or rule",unit:9,opts:["regulation", "election", "authority", "parliament"]},
    {w:"election",m:"\uc120\uac70",def:"a vote to choose someone to serve as a public official",unit:9,opts:["election", "authority", "politician", "govern"]},
    {w:"politics",m:"\uc815\uce58",def:"the activities involved with the government",unit:9,opts:["domestic", "politics", "govern", "candidate"]},
    {w:"authority",m:"\uad8c\ud55a",def:"the power to make decisions, direct or control someone",unit:9,opts:["policy", "authority", "federal", "candidate"]},
    {w:"republic",m:"\uacf5\ud654\uad6d",def:"a country run by elected officials",unit:9,opts:["candidate", "republic", "citizen", "regulation"]},
    {w:"citizen",m:"\uc2dc\ubbfc",def:"a person who legally belongs to a country",unit:9,opts:["authority", "citizen", "election", "regulation"]},
    {w:"deny",m:"\ubd80\uc815\ud558\ub2e4, \ubd80\uc776\ud558\ub2e4",def:"to say it is not true",unit:9,opts:["parliament", "politician", "deny", "govern"]},
    {w:"politician",m:"\uc815\uce58\uac00",def:"someone who is active in government and is an elected official",unit:9,opts:["policy", "influence", "politician", "deny"]},
    {w:"candidate",m:"\ud6c4\ubcf4\uc790",def:"a person who is trying to get elected to an office",unit:9,opts:["citizen", "domestic", "candidate", "election"]},
    {w:"govern",m:"\ud1b5\uce58\ud558\ub2e4",def:"to lead and make decisions that affect a group",unit:9,opts:["massive", "royal", "federal", "govern"]},
    {w:"domestic",m:"\uad6d\ub0b4\uc758",def:"something is found within the home country",unit:9,opts:["politics", "domestic", "federal", "regulation"]},
    {w:"massive",m:"\uac70\ub300\ud55a",def:"something is large in size, amount, or degree",unit:9,opts:["election", "deny", "citizen", "massive"]},
    {w:"policy",m:"\uc815\ucc45",def:"an accepted set of ideas or rules",unit:9,opts:["policy", "massive", "influence", "govern"]},
  ],
  "cew4_10": [
    {w:"justice",m:"\uc815\uc758, \uc0ac\ubc95",def:"the process of making things fair after a crime",unit:10,opts:["danger", "justice", "trick", "clue"]},
    {w:"crime",m:"\ubc94\uc8c4",def:"an act that breaks rules or laws",unit:10,opts:["crime", "evidence", "jail", "guilty"]},
    {w:"prisoner",m:"\uc8c4\uc218, \uc218\uac10\uc790",def:"a person who is locked away in a prison or jail",unit:10,opts:["trick", "danger", "prisoner", "rule"]},
    {w:"death",m:"\uc8fd\uc74c",def:"what happens when living things reach the end of their lives",unit:10,opts:["prisoner", "death", "evidence", "justice"]},
    {w:"trick",m:"\uacc4\ub7b5, \uc0ac\ub78c\uc758 \ub208\uc744 \uc18d\uc774\ub294 \uac83",def:"a lie used to mislead or fool a person",unit:10,opts:["crime", "prison", "evidence", "trick"]},
    {w:"prison",m:"\uac10\uc625, \uad50\ub3c4\uc18c",def:"a building where criminals are locked away",unit:10,opts:["thief", "prison", "death", "guilty"]},
    {w:"punish",m:"\ucc98\ubc8c\ud558\ub2e4",def:"to make them suffer in some way",unit:10,opts:["punish", "legal", "danger", "punishment"]},
    {w:"criminal",m:"\ubc94\uc776",def:"a person who has committed a crime",unit:10,opts:["criminal", "justice", "prison", "prisoner"]},
    {w:"evidence",m:"\uc99d\uac70",def:"anything used to prove that something is true",unit:10,opts:["death", "evidence", "prisoner", "rule"]},
    {w:"thief",m:"\ub3c4\ub451",def:"a person who takes things without asking or paying",unit:10,opts:["jail", "thief", "evidence", "danger"]},
    {w:"law",m:"\ubc95",def:"a rule which everyone must follow",unit:10,opts:["evidence", "criminal", "law", "justice"]},
    {w:"jail",m:"\uac10\uc625, \uad50\ub3c4\uc18c",def:"a place where criminals are kept",unit:10,opts:["jail", "punishment", "prisoner", "criminal"]},
    {w:"clue",m:"\ub2e8\uc11c",def:"an object or piece of information that helps to solve problems",unit:10,opts:["thief", "trick", "guilty", "clue"]},
    {w:"rule",m:"\uaddc\uce59, \uaddc\uc815",def:"a fixed way of behaving that people are told to follow",unit:10,opts:["justice", "rule", "punishment", "prisoner"]},
    {w:"legal",m:"\ud569\ubc95\uc801\uc776",def:"allowed to do it by law",unit:10,opts:["legal", "clue", "evidence", "crime"]},
    {w:"danger",m:"\uc704\ud5d8",def:"something that puts a person at risk",unit:10,opts:["danger", "punishment", "law", "prisoner"]},
    {w:"guilty",m:"\uc720\uc8c4\uc758",def:"being responsible for a crime",unit:10,opts:["guilty", "rule", "justice", "punishment"]},
    {w:"punishment",m:"\ucc98\ubc8c",def:"the act of punishing someone",unit:10,opts:["punishment", "criminal", "punish", "thief"]},
  ],
  "cew4_11": [
    {w:"frighten",m:"\ubb34\uc12d\uac8c\ud558\ub2e4, \ub450\ub835\uac8c\ud558\ub2e4",def:"to make someone feel scared",unit:11,opts:["potential", "hold", "witness", "frighten"]},
    {w:"cruel",m:"\uc792\uc776\ud55a",def:"being mean or nasty to others",unit:11,opts:["cruel", "hold", "accuse", "potential"]},
    {w:"commit",m:"(\uc8c4\ub97c) \uc800\uc9c0\ub974\ub2e4, \ubc94\ud558\ub2e4",def:"to do something bad",unit:11,opts:["commit", "cruel", "deliberate", "potential"]},
    {w:"trial",m:"\uc7ac\ud310",def:"the process that decides whether someone is guilty or innocent",unit:11,opts:["commit", "trial", "bullet", "risk"]},
    {w:"fear",m:"\ub450\ub824\uc6c0",def:"the emotion we feel when we are scared",unit:11,opts:["arrest", "fear", "frighten", "armed"]},
    {w:"risk",m:"\uc704\ud5d8, \uc704\uae30",def:"the possibility that something dangerous may happen",unit:11,opts:["witness", "arrest", "bullet", "risk"]},
    {w:"suspect",m:"\uc758\uc2ec\ud558\ub2e4",def:"to think someone might have done something bad",unit:11,opts:["frighten", "suspect", "arrest", "witness"]},
    {w:"arrest",m:"\uccb4\ud3ec\ud558\ub2e4",def:"to capture them for a crime they might have committed",unit:11,opts:["arrest", "suspect", "trial", "pretend"]},
    {w:"witness",m:"\ubaa9\uaca9\uc790",def:"a person who sees a crime take place",unit:11,opts:["arrest", "pretend", "witness", "innocent"]},
    {w:"penalty",m:"\ucc98\ubc8c, \ubc8c\uae08",def:"the punishment you get for a certain crime",unit:11,opts:["risk", "penalty", "accuse", "hold"]},
    {w:"deliberate",m:"\uc758\ub3c4\uc801\uc776",def:"intended or planned; it is not an accident",unit:11,opts:["deliberate", "trial", "arrest", "witness"]},
    {w:"hold",m:"\uc7a1\ub2e4, \ubcf4\uc720\ud558\ub2e4",def:"to stop someone or something from moving",unit:11,opts:["commit", "armed", "pretend", "hold"]},
    {w:"potential",m:"\uc7a0\uc7ac\uc801\uc776, \uac00\ub2a5\uc131 \uc788\ub294",def:"describes something that could happen",unit:11,opts:["frighten", "suspect", "potential", "bullet"]},
    {w:"innocent",m:"\uc8c4 \uc5c6\ub294",def:"having done nothing wrong",unit:11,opts:["bullet", "innocent", "hold", "commit"]},
    {w:"bullet",m:"\ucd1d\uc54c",def:"a small piece of metal that is fired from a gun",unit:11,opts:["bullet", "potential", "armed", "fear"]},
    {w:"armed",m:"\ubb34\uc7a5\ud55a, \ubb34\uae30\ub97c \ub4e0",def:"carrying a weapon",unit:11,opts:["innocent", "frighten", "bullet", "armed"]},
    {w:"pretend",m:"~\ucc99\ud558\ub2e4, \ud749\ub0b4\ub0b4\ub2e4",def:"to act like you are something or someone you are not",unit:11,opts:["fear", "accuse", "penalty", "pretend"]},
    {w:"accuse",m:"\ube44\ub09c\ud558\ub2e4, \uace0\uc18c\ud558\ub2e4",def:"to say that the person did something bad",unit:11,opts:["accuse", "deliberate", "armed", "cruel"]},
  ],
  "cew4_12": [
    {w:"quarter",m:"\u00bc, 25\ud37c\uc13c\ud2b8",def:"one of four equal parts of a whole number or thing",unit:12,opts:["compass", "percent", "divide", "quarter"]},
    {w:"percent",m:"\ud37c\uc13c\ud2b8",def:"a number or value compared to a total value of 100",unit:12,opts:["subtract", "billion", "formula", "percent"]},
    {w:"fraction",m:"\uc777\ubd80, \ubd82\uc218",def:"a part of a whole number or thing",unit:12,opts:["fraction", "arithmetic", "less", "percent"]},
    {w:"formula",m:"(\uc218\ud559, \ud654\ud559) \uacf5\uc2dd",def:"a mathematical relationship or rule expressed in symbols",unit:12,opts:["quarter", "division", "graph", "formula"]},
    {w:"calculate",m:"\uacc4\uc0b0\ud558\ub2e4",def:"to work out the amount or number of something using math",unit:12,opts:["percent", "divide", "fraction", "calculate"]},
    {w:"even",m:"\uc9dd\uc218\uc758",def:"one that can be divided into perfectly equal parts",unit:12,opts:["even", "subtract", "minus", "percent"]},
    {w:"billion",m:"10\uc5b5",def:"a very large number made up of a thousand million",unit:12,opts:["quarter", "compass", "billion", "arithmetic"]},
    {w:"arithmetic",m:"\uc0b0\uc220, \uc0b0\uc218",def:"the part of math that deals with numbers",unit:12,opts:["division", "arithmetic", "even", "fraction"]},
    {w:"divide",m:"\ub098\ub204\ub2e4",def:"to split it into several smaller parts",unit:12,opts:["less", "divide", "percent", "subtract"]},
    {w:"division",m:"\ubd82\ub2e8",def:"the act of dividing numbers",unit:12,opts:["graph", "fraction", "division", "less"]},
    {w:"graph",m:"\uadf8\ub798\ud504",def:"a picture that shows us numbers or quantities",unit:12,opts:["dozen", "formula", "divide", "graph"]},
    {w:"dozen",m:"12\uac1c",def:"another way of saying twelve",unit:12,opts:["arithmetic", "calculate", "dozen", "billion"]},
    {w:"compass",m:"\ub098\uce68\ubc18, \ucef4\ud37c\uc2a4",def:"a tool used in math which allows you to draw a perfect circle",unit:12,opts:["minus", "quarter", "compass", "even"]},
    {w:"less",m:"~\ubcf4\ub2e4 \ub35c\ud55a, \uc801\uac8c",def:"smaller in size or value than another",unit:12,opts:["divide", "less", "minus", "dozen"]},
    {w:"subtract",m:"~\uc744 \ube7c\ub2e4",def:"to take one number away from another",unit:12,opts:["minus", "subtract", "division", "dozen"]},
    {w:"minus",m:"\ub9c8\uc774\ub108\uc2a4\uc758, ~\uc744 \ube80",def:"the part of a sum that tells us to take something away",unit:12,opts:["dozen", "minus", "formula", "arithmetic"]},
  ],
  "cew4_13": [
    {w:"solve",m:"\ud574\uacb0\ud558\ub2e4, \ud480\ub2e4",def:"to complete or answer it",unit:13,opts:["creativity", "solve", "knowledge", "mark"]},
    {w:"focus",m:"\uc9d1\uc911\ud558\ub2e4",def:"to think about one thing clearly",unit:13,opts:["focus", "solve", "education", "master"]},
    {w:"examination",m:"\uc2dc\ud5d8",def:"an important test to check what students know",unit:13,opts:["section", "master", "degree", "examination"]},
    {w:"master",m:"\uc219\ub2ec\ud558\ub2e4",def:"to become very good at it",unit:13,opts:["major", "education", "elementary", "master"]},
    {w:"section",m:"\ubd80\ubd82, \uad6c\uc5ed",def:"one part of a larger thing",unit:13,opts:["demand", "master", "direction", "section"]},
    {w:"demand",m:"\uc694\uad6c",def:"to ask strongly for something",unit:13,opts:["instruction", "master", "demand", "solve"]},
    {w:"mark",m:"\uae30\ub85d, \ud45c\uc2dc, \ud754\uc801",def:"the score you get for a piece of work",unit:13,opts:["standard", "mentor", "mark", "section"]},
    {w:"knowledge",m:"\uc9c0\uc2dd",def:"what a person knows or has learned",unit:13,opts:["examination", "section", "creativity", "knowledge"]},
    {w:"direction",m:"\ubc29\ud5a5, \uc9c0\uc2dc",def:"instructions that tell you what to do or how to do something",unit:13,opts:["mentor", "degree", "direction", "creativity"]},
    {w:"degree",m:"\ud559\uc704",def:"an award given to a student when they finish at university",unit:13,opts:["certificate", "degree", "direction", "instruction"]},
    {w:"mentor",m:"\uc2a4\uc2b9, \uc870\uc5b6\uc790",def:"someone who leads another closely through learning",unit:13,opts:["major", "demand", "mentor", "intelligence"]},
    {w:"instruction",m:"\uad50\uc721, \uc9c0\uc2dc",def:"the process of telling people how to do something",unit:13,opts:["mentor", "knowledge", "instruction", "examination"]},
    {w:"creativity",m:"\ucc3d\uc758\ub825",def:"the skill which allows people to make or invent things",unit:13,opts:["master", "creativity", "instruction", "certificate"]},
    {w:"standard",m:"\ud45c\uc8fe, \uae30\uc8fe",def:"the level at which you do something",unit:13,opts:["knowledge", "solve", "standard", "creativity"]},
    {w:"major",m:"\uc802\uacf5",def:"the main subject that a student studies at university",unit:13,opts:["creativity", "focus", "major", "solve"]},
    {w:"certificate",m:"\uc99d\uc11c, \uc790\uaca9\uc99d",def:"a piece of paper that proves you can do a certain thing",unit:13,opts:["solve", "standard", "certificate", "focus"]},
    {w:"intelligence",m:"\uc9c0\ub2a5",def:"how clever a person is",unit:13,opts:["knowledge", "intelligence", "direction", "focus"]},
    {w:"elementary",m:"\ucd08\ub4f1\uc758",def:"describes the first or simplest stage of something",unit:13,opts:["elementary", "certificate", "focus", "direction"]},
    {w:"education",m:"\uad50\uc721, \ud6c8\ub826",def:"the process by which people learn",unit:13,opts:["degree", "master", "education", "section"]},
  ],
  "cew4_14": [
    {w:"educate",m:"\uad50\uc721\uc2dc\ud0a4\ub2e4",def:"to teach people and improve their knowledge",unit:14,opts:["literacy", "minor", "educate", "midterm"]},
    {w:"union",m:"\uc5f0\ud569, \ub178\ub3d9\uc870\ud569, \ub2e8\uccb4",def:"a group of people who share a common goal",unit:14,opts:["curriculum", "tutor", "union", "minor"]},
    {w:"academic",m:"\ud559\uc5c5\uc758, \ud559\ubb38\uc801\uc776",def:"related to learning",unit:14,opts:["curriculum", "tutorial", "academic", "educational"]},
    {w:"minor",m:"\uc18c\uc218\uc758",def:"small or less important than other things",unit:14,opts:["curriculum", "academic", "minor", "reference"]},
    {w:"tutorial",m:"\uac1c\ubcc4 \uc9c0\ub3c4 \uc2dc\uac04",def:"a period of teaching and discussion with a tutor",unit:14,opts:["academic", "minor", "tutorial", "educate"]},
    {w:"term",m:"\uc6a9\uc5b4",def:"a word or expression used within a particular subject or area",unit:14,opts:["curriculum", "term", "academic", "educational"]},
    {w:"reference",m:"\ucc38\uace0",def:"a piece of text which mentions another writer, book, or idea",unit:14,opts:["educate", "philosophy", "reference", "institution"]},
    {w:"progressive",m:"\uc9c2\ubcf4\uc801\uc776",def:"new and ahead of others",unit:14,opts:["tutor", "fail", "progressive", "midterm"]},
    {w:"philosophy",m:"\ucc9b\ud559",def:"the study of knowledge, reality, and existence",unit:14,opts:["institution", "union", "tutorial", "philosophy"]},
    {w:"institution",m:"\uae30\uacfe, \ud611\ud68c, \ud559\ud68c",def:"a large and important organization",unit:14,opts:["midterm", "reference", "institution", "educate"]},
    {w:"tutor",m:"\uc120\uc0dd\ub2d8",def:"a teacher who works with small groups or individuals",unit:14,opts:["tutor", "literacy", "lecturer", "minor"]},
    {w:"educational",m:"\uad50\uc721\uc758",def:"providing education or relating to education",unit:14,opts:["draft", "educational", "reference", "tutor"]},
    {w:"draft",m:"\ucd08\uc548",def:"an early version of a piece of writing",unit:14,opts:["draft", "philosophy", "progressive", "institution"]},
    {w:"midterm",m:"\uc911\uac04 \uc2dc\ud5d8",def:"a test taken halfway through a semester",unit:14,opts:["midterm", "lecturer", "union", "philosophy"]},
    {w:"curriculum",m:"\uad50\uacfc \uacfc\uc815",def:"a set of subjects that will be taught",unit:14,opts:["curriculum", "reference", "draft", "minor"]},
    {w:"fail",m:"\uc2e4\ud328\ud558\ub2e4",def:"to not succeed at a given task or test",unit:14,opts:["educate", "term", "fail", "draft"]},
    {w:"lecturer",m:"\uac15\uc0ac, \uac15\uc5f0\uc790",def:"a teacher at a college or university",unit:14,opts:["reference", "literacy", "lecturer", "academic"]},
    {w:"literacy",m:"\uc778\uace0 \uc4f0\ub294 \ub2a5\ub825",def:"the ability to read and write",unit:14,opts:["midterm", "literacy", "educate", "curriculum"]},
  ],
  "cew4_15": [
    {w:"annoy",m:"\ub0a8\uc744 \uad34\ub86d\ud788\ub2e4, \uadc0\ucc2e\uac8c \ud558\ub2e4",def:"to make them slightly angry",unit:15,opts:["positive", "annoy", "disappoint", "nervous"]},
    {w:"belong",m:"\uc18d\ud558\ub2e4",def:"to be a part of something",unit:15,opts:["pride", "nervous", "respect", "belong"]},
    {w:"depressed",m:"\uc6b0\uc6b8\ud55a",def:"being extremely sad",unit:15,opts:["jealous", "nervous", "depressed", "annoy"]},
    {w:"disappoint",m:"\ub0a8\uc744 \uc2e4\ub9dd\uc2dc\ud0a4\ub2e4",def:"to upset someone by not doing what they expected",unit:15,opts:["lively", "respect", "disappoint", "nervous"]},
    {w:"severe",m:"\uc2ec\ud55a, \uac00\ud639\ud55a",def:"very bad or extreme",unit:15,opts:["annoy", "positive", "belong", "severe"]},
    {w:"lively",m:"\uc0dd\uc0dd\ud55a, \ud657\uae30\ucc2c",def:"full of energy and enthusiasm",unit:15,opts:["belief", "respect", "lively", "miserable"]},
    {w:"nervous",m:"\uae34\uc7a5\ud558\ub294",def:"feeling worried about something in the future",unit:15,opts:["lonely", "nervous", "severe", "jealous"]},
    {w:"lonely",m:"\uc678\ub85c\uc6b4",def:"feeling sad because they are alone",unit:15,opts:["charm", "embarrassed", "lonely", "respect"]},
    {w:"cheat",m:"\uc18d\uc774\ub2e4",def:"to behave in a dishonest way in order to get what you want",unit:15,opts:["charm", "respect", "negative", "cheat"]},
    {w:"charm",m:"\ub9e4\ub825",def:"the ability to make others like you",unit:15,opts:["charm", "jealous", "pride", "disappoint"]},
    {w:"respect",m:"\uc872\uc911, \uc872\uacbd",def:"an attitude of admiration or esteem",unit:15,opts:["jealous", "respect", "belief", "miserable"]},
    {w:"embarrassed",m:"\ub2f9\ud639\uc2a4\ub7ec\uc6b4",def:"feeling like a fool in front of others",unit:15,opts:["depressed", "belong", "embarrassed", "intelligent"]},
    {w:"intelligent",m:"\uc9c0\ub2a5\uc774 \uc788\ub294, \ucd1d\uba85\ud55a",def:"someone who is clever",unit:15,opts:["negative", "severe", "intelligent", "disappoint"]},
    {w:"belief",m:"\uc2de\ub150, \ubbff\uc74c",def:"the feeling that something is true or real",unit:15,opts:["belief", "miserable", "negative", "satisfy"]},
    {w:"negative",m:"\ubd80\uc815\uc801\uc776",def:"describes a bad feeling, reaction, or response",unit:15,opts:["cheat", "negative", "annoy", "satisfy"]},
    {w:"miserable",m:"\ube44\ucc38\ud55a",def:"feeling very sad or grumpy",unit:15,opts:["intelligent", "belong", "respect", "miserable"]},
    {w:"pride",m:"\uc790\ubd80\uc2ec",def:"the emotion we feel when we are proud",unit:15,opts:["nervous", "pride", "severe", "positive"]},
    {w:"satisfy",m:"\ub9cc\uc871\uc2dc\ud0a4\ub2e4",def:"to please yourself or someone else",unit:15,opts:["satisfy", "jealous", "belong", "embarrassed"]},
    {w:"jealous",m:"\uc9c8\ud22c\ud558\ub294",def:"when they wish they had what someone else has",unit:15,opts:["cheat", "embarrassed", "satisfy", "jealous"]},
    {w:"positive",m:"\uae0d\uc815\uc801\uc776",def:"a good feeling, reaction, or response",unit:15,opts:["lonely", "negative", "severe", "positive"]},
  ],
  "cew4_16": [
    {w:"hopeless",m:"\uac00\ub9dd\uc5c6\ub294, \uc803\ub9dd\uc801\uc776",def:"describes a person or action that has no chance of succeeding",unit:16,opts:["tense", "wisdom", "hopeless", "thoughtful"]},
    {w:"aware",m:"\uc54c\uace0 \uc788\ub294, \uc776\uc2dd\ud558\ub294",def:"knowing something has happened or may happen",unit:16,opts:["aware", "extreme", "thoughtful", "anxiety"]},
    {w:"tense",m:"\uae34\uc7a5\ud55a, \uae34\ubc15\ud55a",def:"describes a feeling of nervousness",unit:16,opts:["tense", "confidence", "fright", "comfort"]},
    {w:"comfort",m:"\uc704\ub85c",def:"the feeling of being relaxed and satisfied",unit:16,opts:["comfort", "esteem", "tense", "aware"]},
    {w:"appeal",m:"\ud638\uc18c\ud558\ub2e4",def:"to seem attractive or tempting",unit:16,opts:["appreciate", "thoughtful", "appeal", "comfort"]},
    {w:"fright",m:"\ub450\ub824\uc6c0, \ub17b\ub78c",def:"what we feel when we are sudden",unit:16,opts:["awkward", "fright", "aware", "command"]},
    {w:"sensible",m:"\ud604\uba85\ud55a, \ud569\ub9ac\uc801\uc776",def:"describes a person or action that is practical",unit:16,opts:["sensible", "appreciate", "awkward", "confidence"]},
    {w:"confidence",m:"\uc790\uc2de\uac10",def:"the emotion we feel when we believe we can succeed",unit:16,opts:["comfort", "aware", "confidence", "command"]},
    {w:"extreme",m:"\uadf9\ub2e8\uc801\uc776",def:"far from normal",unit:16,opts:["appreciate", "extreme", "esteem", "anxious"]},
    {w:"wisdom",m:"\uc9c0\ud61c",def:"a large amount of knowledge gained over a long period",unit:16,opts:["comfort", "wisdom", "thoughtful", "anxious"]},
    {w:"anxiety",m:"\uac71\uc815",def:"the emotion we feel when we are extremely worried or stressed",unit:16,opts:["anxiety", "hopeless", "command", "confidence"]},
    {w:"anxious",m:"\uac71\uc815\ud558\ub294",def:"suffering from anxiety",unit:16,opts:["wisdom", "tense", "appreciate", "anxious"]},
    {w:"concern",m:"\uac71\uc815",def:"the feeling of worrying about another person or thing",unit:16,opts:["extreme", "tense", "concern", "fright"]},
    {w:"appreciate",m:"\uac10\uc0ac\ud558\ub2e4",def:"to be grateful for something or understand the reason for it",unit:16,opts:["appeal", "appreciate", "thoughtful", "wisdom"]},
    {w:"command",m:"\uba85\ub839\ud558\ub2e4",def:"to strongly tell someone to do something",unit:16,opts:["command", "extreme", "anxious", "appeal"]},
    {w:"thoughtful",m:"\uc0ac\ub824 \uae4a\uc740",def:"thinking of others\u2019 needs and wants",unit:16,opts:["comfort", "extreme", "thoughtful", "appeal"]},
    {w:"esteem",m:"\uc872\uc911, \uc872\uacbd",def:"what we feel about a person we admire",unit:16,opts:["esteem", "wisdom", "extreme", "appeal"]},
    {w:"awkward",m:"\uc5b4\uc0c9\ud55a, \uac70\ubd81\ud55a",def:"describes an uncomfortable situation, movement, or feeling",unit:16,opts:["esteem", "hopeless", "awkward", "comfort"]},
  ],
  "eew1_1": [
    {w:"love",m:"\uc0ac\ub791\ud558\ub2e4",def:"to like something or someone a lot",unit:1,opts:["week", "love", "duck", "enjoy"]},
    {w:"breakfast",m:"\uc544\uce68(\ubc25), \uc544\uce68 \uc2dd\uc0ac",def:"the morning meal",unit:1,opts:["breakfast", "enjoy", "august", "wine"]},
    {w:"catch",m:"(\uc6c0\uc9c1\uc774\ub294 \ubb3c\uccb4\ub97c) \uc7a1\ub2e4",def:"to grab or get something",unit:1,opts:["week", "enjoy", "august", "catch"]},
    {w:"invite",m:"\ucd08\ub300\ud558\ub2e4",def:"to ask someone to come to a place or event",unit:1,opts:["invite", "love", "week", "breakfast"]},
    {w:"month",m:"(\uc77c \ub144 \uc5f4\ub450 \ub2ec \uc911 \ud55c) \ub2ec, \uc6d4",def:"one of 12 periods of time in one year",unit:1,opts:["enjoy", "month", "love", "august"]},
    {w:"alcohol",m:"\uc220, \uc54c\ucf54\uc62c",def:"a type of drink that can make people drunk",unit:1,opts:["breakfast", "week", "alcohol", "catch"]},
    {w:"arrive",m:"(\ud2b9\ud788 \uc5ec\uc815 \ub05d\uc5d0) \ub3c4\ucc29\ud558\ub2e4",def:"to get somewhere",unit:1,opts:["wine", "week", "august", "arrive"]},
    {w:"boat",m:"(\uc791\uc740) \ubc30, \ubcf4\ud2b8",def:"a vehicle that moves across water",unit:1,opts:["duck", "boat", "catch", "month"]},
    {w:"camera",m:"\uce74\uba54\ub77c",def:"a piece of equipment that takes pictures",unit:1,opts:["camera", "boat", "duck", "invite"]},
    {w:"enjoy",m:"\uc990\uae30\ub2e4",def:"to like something",unit:1,opts:["breakfast", "enjoy", "august", "alcohol"]},
    {w:"wine",m:"\ud3ec\ub3c4\uc8fc, \uc640\uc778",def:"an alcoholic drink made from grapes",unit:1,opts:["wine", "love", "camera", "alcohol"]},
    {w:"duck",m:"\uc624\ub9ac",def:"a small water bird",unit:1,opts:["invite", "love", "duck", "enjoy"]},
    {w:"week",m:"\uc8fc, \uc77c\uc8fc\uc77c",def:"a period of time that is seven days long",unit:1,opts:["enjoy", "alcohol", "week", "love"]},
    {w:"august",m:"8\uc6d4",def:"the eighth month of the year",unit:1,opts:["month", "camera", "august", "arrive"]},
  ],
  "eew1_2": [
    {w:"smell",m:"\ub0c4\uc0c8\uac00 \ub098\ub2e4, \ub0c4\uc0c8\ub97c \ub9e1\ub2e4",def:"to use your nose to sense it",unit:2,opts:["kill", "nervous", "smell", "secret"]},
    {w:"nervous",m:"\ubd88\uc548\ud574 \ud558\ub294",def:"they think something bad will happen",unit:2,opts:["nervous", "loud", "shout", "create"]},
    {w:"adventure",m:"\ubaa8\ud5d8",def:"a fun or exciting thing that you do",unit:2,opts:["nervous", "kill", "adventure", "laboratory"]},
    {w:"create",m:"\ucc3d\uc870\ud558\ub2e4",def:"to make something new",unit:2,opts:["laboratory", "create", "noise", "loud"]},
    {w:"chemical",m:"\ud654\ud559 \ubb3c\uc9c8",def:"something that scientists use in chemistry",unit:2,opts:["scare", "chemical", "approach", "laboratory"]},
    {w:"approach",m:"\ub2e4\uac00\uac00\ub2e4",def:"to move close to it",unit:2,opts:["approach", "secret", "kill", "shout"]},
    {w:"kill",m:"\uc8fd\uc774\ub2e4, \ubaa9\uc228\uc744 \ube7c\uc557\ub2e4",def:"to make them die",unit:2,opts:["kill", "secret", "scare", "loud"]},
    {w:"loud",m:"(\uc18c\ub9ac\uac00) \ud070, \uc2dc\ub044\ub7ec\uc6b4",def:"strong and very easy to hear",unit:2,opts:["loud", "kill", "adventure", "smell"]},
    {w:"scare",m:"\uac81\uc8fc\ub2e4, \uac81\uba39\uac8c \ud558\ub2e4",def:"to make them feel afraid",unit:2,opts:["scare", "adventure", "experiment", "noise"]},
    {w:"terrible",m:"\ub054\ucc0d\ud55c",def:"it is very bad",unit:2,opts:["terrible", "laboratory", "shout", "kill"]},
    {w:"secret",m:"\ube44\ubc00, \uae30\ubc00",def:"something that you do not tell other people",unit:2,opts:["scare", "create", "laboratory", "secret"]},
    {w:"experiment",m:"(\uacfc\ud559\uc801\uc778) \uc2e4\ud5d8",def:"a test that you do to see what will happen",unit:2,opts:["smell", "laboratory", "noise", "experiment"]},
    {w:"shout",m:"\uc18c\ub9ac \uc9c0\ub974\ub2e4, \ud070 \uc18c\ub9ac\ub85c \ub9d0\ud558\ub2e4",def:"to say something loudly",unit:2,opts:["terrible", "kill", "shout", "chemical"]},
    {w:"laboratory",m:"\uc2e4\ud5d8\uc2e4",def:"a room where a scientist works",unit:2,opts:["create", "noise", "laboratory", "chemical"]},
    {w:"noise",m:"(\ub4e3\uae30 \uc2eb\uc740, \uc2dc\ub044\ub7ec\uc6b4) \uc18c\ub9ac, \uc18c\uc74c",def:"an unpleasant sound",unit:2,opts:["noise", "chemical", "adventure", "nervous"]},
  ],
  "eew1_3": [
    {w:"ever",m:"\uc5b8\uc81c\ub098, \ud56d\uc0c1",def:"at any time",unit:3,opts:["grade", "several", "ever", "among"]},
    {w:"several",m:"(\uba87)\uba87\uc758",def:"more than two but not many",unit:3,opts:["fail", "cloud", "several", "library"]},
    {w:"solve",m:"\ud574\uacb0\ud558\ub2e4, \ud0c0\uacb0\ud558\ub2e4",def:"to find an answer to it",unit:3,opts:["cloud", "solve", "chart", "grade"]},
    {w:"shape",m:"\ubaa8\uc591, \ud615\ud0dc",def:"the arrangement of its sides and surfaces",unit:3,opts:["suppose", "solve", "shape", "planet"]},
    {w:"planet",m:"\ud589\uc131",def:"a large round thing in space",unit:3,opts:["instead", "planet", "suddenly", "suppose"]},
    {w:"suppose",m:"\uac00\uc815\ud558\ub2e4, \uc0dd\uac01\ud558\ub2e4",def:"to guess",unit:3,opts:["grade", "ever", "suppose", "shape"]},
    {w:"grade",m:"(\uc0c1\ud488\uc758) \ud488\uc9c8, \uc131\uc801, \ud559\uc810",def:"a score or mark given to someone\u2019s work",unit:3,opts:["suppose", "understand", "grade", "planet"]},
    {w:"chart",m:"\ub3c4\ud45c, \ucc28\ud2b8",def:"a list of information",unit:3,opts:["suddenly", "chart", "instead", "among"]},
    {w:"library",m:"\ub3c4\uc11c\uad00",def:"a place where you go to read books",unit:3,opts:["library", "grade", "planet", "ever"]},
    {w:"understand",m:"\uc774\ud574\ud558\ub2e4",def:"you need to know what it means",unit:3,opts:["chart", "suddenly", "shape", "understand"]},
    {w:"among",m:"~\uc5d0 \ub458\ub7ec\uc2f8\uc778",def:"they are all around you",unit:3,opts:["suppose", "planet", "among", "ever"]},
    {w:"suddenly",m:"\uac11\uc790\uae30",def:"it happens quickly and unexpectedly",unit:3,opts:["among", "planet", "suddenly", "fail"]},
    {w:"alien",m:"\uc678\uacc4\uc778, \uc6b0\uc8fc\uc778",def:"a creature from a different world",unit:3,opts:["alien", "view", "library", "several"]},
    {w:"instead",m:"\ub300\uc2e0\uc5d0",def:"in place of",unit:3,opts:["shape", "alien", "instead", "chart"]},
    {w:"fail",m:"\uc2e4\ud328\ud558\ub2e4",def:"you do not succeed in what you try to do",unit:3,opts:["shape", "fail", "suppose", "several"]},
    {w:"view",m:"\ubc14\ub77c\ubcf4\ub2e4, \ubcf4\ub2e4",def:"to look at something",unit:3,opts:["view", "instead", "suddenly", "fail"]},
    {w:"cloud",m:"\uad6c\ub984",def:"a group of water drops in the sky",unit:3,opts:["among", "grade", "shape", "cloud"]},
  ],
  "eew1_4": [
    {w:"frequently",m:"\uc790\uc8fc, \ud754\ud788",def:"it happens often",unit:4,opts:["frequently", "appropriate", "instruct", "patient"]},
    {w:"avoid",m:"\ud53c\ud558\ub2e4",def:"to stay away from it",unit:4,opts:["avoid", "habit", "expect", "appropriate"]},
    {w:"expect",m:"\uc608\uc0c1\ud558\ub2e4, \uae30\ub300\ud558\ub2e4",def:"to happen, you believe it will happen",unit:4,opts:["concern", "habit", "expect", "frequently"]},
    {w:"stroll",m:"\uac70\ub2d0\ub2e4, \uc0b0\ucc45\ud558\ub2e4",def:"to walk slowly and calmly",unit:4,opts:["frequently", "spread", "habit", "stroll"]},
    {w:"habit",m:"\ubc84\ub987, \uc2b5\uad00",def:"a thing that you do often",unit:4,opts:["habit", "appropriate", "none", "calm"]},
    {w:"represent",m:"\ub300\ud45c\ud558\ub2e4, \ub300\uc2e0\ud558\ub2e4",def:"to speak or act for a person or group",unit:4,opts:["content", "calm", "issue", "represent"]},
    {w:"instruct",m:"\uac00\ub974\uce58\ub2e4",def:"to teach",unit:4,opts:["instruct", "concern", "appropriate", "represent"]},
    {w:"content",m:"\ub9cc\uc871\ud558\ub294",def:"to be happy and not want more",unit:4,opts:["content", "concern", "patient", "represent"]},
    {w:"spread",m:"\ud3bc\uce58\ub2e4",def:"to move out to cover a larger area",unit:4,opts:["appropriate", "content", "spread", "frequently"]},
    {w:"village",m:"\ub9c8\uc744",def:"a very small town",unit:4,opts:["patient", "stroll", "village", "habit"]},
    {w:"appropriate",m:"\uc801\uc808\ud55c",def:"it is right or normal",unit:4,opts:["content", "appropriate", "spread", "stroll"]},
    {w:"concern",m:"\uc6b0\ub824, \uac71\uc815",def:"a feeling of worry",unit:4,opts:["concern", "content", "represent", "avoid"]},
    {w:"issue",m:"\uc7c1\uc810, \uc0ac\uc548",def:"an important topic",unit:4,opts:["issue", "instruct", "expect", "calm"]},
    {w:"calm",m:"\uce68\ucc29\ud55c, \ucc28\ubd84\ud55c",def:"they do not get excited or upset",unit:4,opts:["spread", "calm", "content", "represent"]},
    {w:"patient",m:"\ucc38\uc744\uc131 \uc788\ub294",def:"they don\u2019t become angry or upset easily",unit:4,opts:["represent", "concern", "content", "patient"]},
    {w:"positive",m:"\uae0d\uc815\uc801\uc778",def:"it is good",unit:4,opts:["expect", "spread", "habit", "positive"]},
    {w:"none",m:"\uc544\ubb34\ub3c4 (~\uc54a\ub2e4)",def:"not any of something",unit:4,opts:["patient", "content", "none", "appropriate"]},
  ],
  "eew1_5": [
    {w:"balance",m:"\uade0\ud615",def:"when two or more things are equal",unit:5,opts:["balance", "adult", "life", "kilometer"]},
    {w:"increase",m:"\uc99d\uac00\ud558\ub2e4, \uc778\uc0c1\ub418\ub2e4",def:"to make something larger",unit:5,opts:["increase", "life", "bad", "fun"]},
    {w:"plenty",m:"\ud48d\ubd80\ud55c \uc591",def:"there is a lot of it",unit:5,opts:["heart", "balance", "golf", "plenty"]},
    {w:"choose",m:"\uace0\ub974\ub2e4",def:"to pick something or make a decision",unit:5,opts:["fun", "choose", "active", "golf"]},
    {w:"kilometer",m:"\ud0ac\ub85c\ubbf8\ud130",def:"a unit of measurement that is 1,000 meters",unit:5,opts:["kilometer", "adult", "bad", "balance"]},
    {w:"during",m:"~\ub3d9\uc548",def:"while the event was happening",unit:5,opts:["kilometer", "bad", "age", "during"]},
    {w:"often",m:"\uc790\uc8fc",def:"when something happens many times",unit:5,opts:["often", "kilometer", "life", "increase"]},
    {w:"fun",m:"\uc7ac\ubbf8\uc788\ub294, \uc990\uac70\uc6b4",def:"it is enjoyable",unit:5,opts:["weight", "balance", "plenty", "fun"]},
    {w:"active",m:"(\ud2b9\ud788 \uc2e0\uccb4\uc801\uc73c\ub85c) \ud65c\ub3d9\uc801\uc778",def:"they move a lot or have a lot of things to do",unit:5,opts:["bad", "age", "active", "heart"]},
    {w:"life",m:"\uc0b4\uc544 \uc788\uc74c, \uc0b6",def:"the time when a person is alive",unit:5,opts:["golf", "life", "age", "kilometer"]},
    {w:"bad",m:"\uc548 \uc88b\uc740, \ubd88\ucf8c\ud55c, \ub098\uc05c",def:"it is not good",unit:5,opts:["bad", "kilometer", "adult", "plenty"]},
    {w:"adult",m:"\uc131\uc778, \uc5b4\ub978",def:"a person who is more than 18 years old",unit:5,opts:["increase", "adult", "golf", "fun"]},
    {w:"weight",m:"\ubb34\uac8c",def:"how heavy something or someone is",unit:5,opts:["weight", "often", "balance", "plenty"]},
    {w:"golf",m:"\uace8\ud504",def:"a sport with clubs and a small white ball",unit:5,opts:["increase", "age", "golf", "balance"]},
    {w:"heart",m:"\uc2ec\uc7a5",def:"an organ that keeps the body alive",unit:5,opts:["balance", "age", "golf", "heart"]},
    {w:"age",m:"\ub098\uc774, \uc5f0\ub839, \uc218\uba85",def:"how many years someone has lived",unit:5,opts:["increase", "age", "heart", "kilometer"]},
  ],
  "eew1_6": [
    {w:"tense",m:"\uae34\uc7a5\ud55c, \uc2e0\uacbd\uc774 \ub0a0\uce74\ub85c\uc6b4",def:"you are not comfortable and feel unhappy",unit:6,opts:["ritual", "tense", "fashionable", "attribute"]},
    {w:"attribute",m:"\uc790\uc9c8, \uc18d\uc131",def:"a characteristic of a person or thing",unit:6,opts:["attribute", "spoken", "foreign", "ritual"]},
    {w:"apart",m:"\ub5a8\uc5b4\uc838",def:"they are not next to each other",unit:6,opts:["apart", "bilingual", "foreign", "surprised"]},
    {w:"ritual",m:"(\ud2b9\ud788 \uc885\uad50\uc0c1\uc758) \uc758\uc2dd \uc808\ucc28",def:"a formal custom that people do regularly",unit:6,opts:["foreign", "vague", "ritual", "apart"]},
    {w:"foreign",m:"\uc678\uad6d\uc758, \uc774\uc9c8\uc801\uc778",def:"something we are not used to",unit:6,opts:["bilingual", "foreign", "attribute", "vague"]},
    {w:"dash",m:"(\uae09\ud788) \uc11c\ub458\ub7ec \uac00\ub2e4",def:"to run or move quickly",unit:6,opts:["dash", "vague", "ritual", "surprised"]},
    {w:"spoken",m:"\uad6c\ub450\uc758",def:"what we say",unit:6,opts:["spoken", "foreign", "completely", "attribute"]},
    {w:"fashionable",m:"\uc720\ud589\ud558\ub294, \uc720\ud589\uc744 \ub530\ub978",def:"what people like to wear and do now",unit:6,opts:["fashionable", "completely", "vague", "apart"]},
    {w:"completely",m:"\uc644\uc804\ud788, \uc804\uc801\uc73c\ub85c",def:"very, very different from before",unit:6,opts:["apart", "nowadays", "tense", "completely"]},
    {w:"natural",m:"\uc790\uc5f0\uc758",def:"not made by people",unit:6,opts:["vague", "fashionable", "surprised", "natural"]},
    {w:"surprised",m:"\ub180\ub780",def:"when something unexpected happens",unit:6,opts:["ritual", "bilingual", "surprised", "tense"]},
    {w:"vague",m:"\uc560\ub9e4\ud55c, \ubaa8\ud638\ud55c",def:"it is not clear and gives very few details",unit:6,opts:["surprised", "nowadays", "vague", "apart"]},
    {w:"nowadays",m:"\uc694\uc998\uc5d0\ub294",def:"at the present time",unit:6,opts:["vague", "tense", "bilingual", "nowadays"]},
    {w:"bilingual",m:"\ub450 \uac1c \uc5b8\uc5b4\ub97c \ud560 \uc904 \uc544\ub294, \uc774\uc911 \uc5b8\uc5b4 \uc0ac\uc6a9\uc790\uc758",def:"person can speak two languages",unit:6,opts:["completely", "bilingual", "attribute", "nowadays"]},
  ],
  "eew1_7": [
    {w:"beside",m:"\uc606\uc5d0",def:"next to you",unit:7,opts:["peace", "lay", "condition", "beside"]},
    {w:"sudden",m:"\uac11\uc791\uc2a4\ub7ec\uc6b4, \uae09\uc791\uc2a4\ub7ec\uc6b4",def:"it happens very quickly",unit:7,opts:["sudden", "claim", "peace", "therefore"]},
    {w:"force",m:"\ubb3c\ub9ac\ub825, \ud3ed\ub825",def:"a person\u2019s strength or power",unit:7,opts:["famous", "force", "peace", "sudden"]},
    {w:"therefore",m:"\uadf8\ub7ec\ubbc0\ub85c, \uadf8\ub7ec\ub2c8",def:"for this reason",unit:7,opts:["therefore", "peace", "famous", "lay"]},
    {w:"sense",m:"\uac10\uc9c0\ud558\ub2e4, \ub290\ub07c\ub2e4",def:"to know about it without being told",unit:7,opts:["difference", "sense", "force", "expert"]},
    {w:"famous",m:"\uc720\uba85\ud55c",def:"well known",unit:7,opts:["expert", "sudden", "force", "famous"]},
    {w:"claim",m:"\uc8fc\uc7a5\ud558\ub2e4",def:"to say that something is true",unit:7,opts:["allow", "claim", "sense", "sudden"]},
    {w:"difference",m:"\ucc28\uc774, \ub2e4\ub984",def:"a way that something is not like other things",unit:7,opts:["harm", "difference", "sudden", "allow"]},
    {w:"condition",m:"\uc0c1\ud0dc",def:"the state that they are in",unit:7,opts:["force", "lay", "protect", "condition"]},
    {w:"protect",m:"\ubcf4\ud638\ud558\ub2e4, \uc9c0\ud0a4\ub2e4",def:"to stop them from getting hurt",unit:7,opts:["allow", "challenge", "protect", "harm"]},
    {w:"lay",m:"\ub193\ub2e4",def:"to put or place in a horizontal or flat position",unit:7,opts:["protect", "lay", "claim", "therefore"]},
    {w:"challenge",m:"\ub3c4\uc804",def:"something difficult to complete",unit:7,opts:["expert", "lay", "challenge", "harm"]},
    {w:"divide",m:"(\ubaab\uc744) \ub098\ub204\ub2e4",def:"to split it into smaller parts",unit:7,opts:["sudden", "divide", "difference", "expert"]},
    {w:"expert",m:"\uc804\ubb38\uac00",def:"who is very good at doing something",unit:7,opts:["expert", "announce", "force", "challenge"]},
    {w:"announce",m:"\ubc1c\ud45c\ud558\ub2e4, \uc54c\ub9ac\ub2e4",def:"to make it known",unit:7,opts:["condition", "expert", "claim", "announce"]},
    {w:"harm",m:"\ud574, \ud53c\ud574, \uc190\ud574",def:"to hurt someone or damage something",unit:7,opts:["sense", "harm", "force", "divide"]},
    {w:"prince",m:"\uc655\uc790",def:"the son of a king",unit:7,opts:["peace", "sense", "prince", "divide"]},
    {w:"peace",m:"\ud3c9\ud654",def:"a time without war",unit:7,opts:["famous", "peace", "therefore", "harm"]},
    {w:"allow",m:"\ud5c8\ub77d\ud558\ub2e4, \uc6a9\ub0a9\ud558\ub2e4",def:"to let it happen",unit:7,opts:["sudden", "force", "harm", "allow"]},
  ],
  "eew1_8": [
    {w:"chase",m:"\ub4a4\ucad3\ub2e4, \ucd94\uc801\ud558\ub2e4",def:"you run after them and try to catch them",unit:8,opts:["chase", "release", "propose", "accept"]},
    {w:"necessary",m:"\ud544\uc694\ud55c, \ud544\uc218\uc801\uc778",def:"you must do it",unit:8,opts:["chase", "familiar", "attend", "necessary"]},
    {w:"require",m:"\uc694\uad6c\ud558\ub2e4",def:"to say that it is necessary",unit:8,opts:["propose", "require", "contrast", "tear"]},
    {w:"attend",m:"\ucc38\uc11d\ud558\ub2e4",def:"to go to it",unit:8,opts:["attend", "accept", "tear", "contrast"]},
    {w:"accept",m:"(\uae30\uaebc\uc774) \ubc1b\uc544\ub4e4\uc774\ub2e4",def:"to take it",unit:8,opts:["huge", "release", "theory", "accept"]},
    {w:"single",m:"\ub2e8 \ud558\ub098\uc758, \ub2e8\uc77c\uc758",def:"there is only one",unit:8,opts:["single", "theory", "encourage", "familiar"]},
    {w:"familiar",m:"\uc775\uc219\ud55c, \uce5c\uc219\ud55c",def:"those you know well",unit:8,opts:["propose", "necessary", "familiar", "purpose"]},
    {w:"propose",m:"\uc81c\uc548\ud558\ub2e4",def:"to say that it should be done",unit:8,opts:["contrast", "huge", "propose", "require"]},
    {w:"huge",m:"\uac70\ub300\ud55c",def:"very big",unit:8,opts:["huge", "chase", "tear", "require"]},
    {w:"release",m:"\ud480\uc5b4\uc8fc\ub2e4",def:"to stop holding it",unit:8,opts:["theory", "contrast", "hang", "release"]},
    {w:"contrast",m:"\ub300\uc870, \ub300\ube44",def:"a sharp difference between two things",unit:8,opts:["arrange", "contrast", "single", "require"]},
    {w:"satisfied",m:"\ub9cc\uc871\ud558\ub294",def:"when you have what you wanted",unit:8,opts:["encourage", "satisfied", "contrast", "familiar"]},
    {w:"tear",m:"\ucc22\ub2e4, \ub72f\ub2e4",def:"to pull it apart",unit:8,opts:["contrast", "release", "tear", "purpose"]},
    {w:"theory",m:"(\uc5b4\ub5a4 \ud604\uc0c1\uc744 \uc124\uba85\ud558\uae30 \uc704\ud55c) \uc774\ub860, \ud559\uc124",def:"an idea about how something works",unit:8,opts:["contrast", "hang", "theory", "purpose"]},
    {w:"hang",m:"\uac78\ub2e4, \uac78\ub9ac\ub2e4",def:"to keep it above the ground",unit:8,opts:["require", "hang", "release", "huge"]},
    {w:"encourage",m:"\uc6a9\uae30\ub97c \ubd81\ub3cb\uc6b0\ub2e4",def:"to make them want to do something",unit:8,opts:["single", "accept", "arrange", "encourage"]},
    {w:"arrange",m:"\uc815\ub9ac\ud558\ub2e4, \ubc30\uc5f4\ud558\ub2e4",def:"to put them in the right place",unit:8,opts:["huge", "arrange", "hang", "contrast"]},
    {w:"purpose",m:"\ubaa9\ud45c, \ubaa9\uc801",def:"the reason that you do something",unit:8,opts:["purpose", "accept", "theory", "single"]},
  ],
  "eew1_9": [
    {w:"depend",m:"\uc758\uc874\ud558\ub2e4, \uc758\uc9c0\ud558\ub2e4",def:"to need it for support or help",unit:9,opts:["hear", "depend", "animal", "pull"]},
    {w:"hear",m:"\ub4e3\ub2e4",def:"to be aware of sound through your ears",unit:9,opts:["hear", "bus", "school", "leg"]},
    {w:"bus",m:"\ubc84\uc2a4",def:"a large vehicle that people travel on",unit:9,opts:["school", "leg", "bus", "pull"]},
    {w:"school",m:"\ud559\uad50",def:"a place where children go to learn",unit:9,opts:["school", "hospital", "service", "depend"]},
    {w:"service",m:"(\ud638\ud154, \uc2dd\ub2f9, \uc0c1\uc810\uc5d0\uc11c\uc758 \uc190\ub2d8\uc5d0 \ub300\ud55c) \uc11c\ube44\uc2a4",def:"the act of helping or serving someone",unit:9,opts:["school", "service", "hear", "pull"]},
    {w:"animal",m:"(\ub124 \ubc1c\uc744 \uac00\uc9c4) \uc9d0\uc2b9, \ub3d9\ubb3c",def:"a living thing that can move",unit:9,opts:["animal", "hear", "school", "depend"]},
    {w:"hospital",m:"\ubcd1\uc6d0",def:"where sick or hurt people receive care",unit:9,opts:["hospital", "animal", "service", "leg"]},
    {w:"leg",m:"\ub2e4\ub9ac",def:"a body part used for standing and walking",unit:9,opts:["pull", "bus", "service", "leg"]},
    {w:"pull",m:"\ub04c\ub2e4, \ub2f9\uae30\ub2e4",def:"to hold onto something to move it toward",unit:9,opts:["hospital", "service", "animal", "pull"]},
  ],
  "eew1_10": [
    {w:"focus",m:"\uc9d1\uc911\ud558\ub2e4",def:"to think about it and pay attention to it",unit:10,opts:["immediate", "function", "focus", "benefit"]},
    {w:"function",m:"\uae30\ub2a5",def:"what it does",unit:10,opts:["image", "far", "grass", "function"]},
    {w:"essential",m:"\uadf9\ud788 \uc911\uc694\ud55c, \ud544\uc218\uc801\uc778",def:"it is very important and necessary",unit:10,opts:["benefit", "essential", "function", "far"]},
    {w:"effect",m:"\uacb0\uacfc, \ud6a8\uacfc",def:"a change made by something else",unit:10,opts:["effect", "essential", "proud", "guard"]},
    {w:"grass",m:"\uc794\ub514",def:"the green leaves that cover the ground",unit:10,opts:["grass", "focus", "far", "remain"]},
    {w:"benefit",m:"\ud61c\ud0dd, \uc774\ub4dd",def:"a good thing",unit:10,opts:["separate", "trouble", "proud", "benefit"]},
    {w:"primary",m:"\uae30\ubcf8\uc801\uc778, \uc8fc\uc694\ud55c",def:"it is the most important thing",unit:10,opts:["separate", "focus", "immediate", "primary"]},
    {w:"remain",m:"\uc5ec\uc804\ud788 ~\uc774\ub2e4",def:"to stay there",unit:10,opts:["focus", "separate", "essential", "remain"]},
    {w:"separate",m:"\ubd84\ub9ac\ub41c, \ub530\ub85c \ub5a8\uc5b4\uc9c4, \ub3c5\ub9bd\ub41c",def:"they are not together",unit:10,opts:["far", "proud", "essential", "separate"]},
    {w:"far",m:"\uc800\ucabd\uc758, \uba3c",def:"it is not close",unit:10,opts:["function", "image", "far", "trouble"]},
    {w:"image",m:"\uc774\ubbf8\uc9c0",def:"a picture of it",unit:10,opts:["guard", "effect", "essential", "image"]},
    {w:"immediate",m:"\uc989\uac01\uc801\uc778",def:"it happens quickly",unit:10,opts:["function", "benefit", "far", "immediate"]},
    {w:"trouble",m:"\ubb38\uc81c, \uace4\ub780, \uace8\uce6b\uac70\ub9ac",def:"a problem or a difficulty",unit:10,opts:["site", "benefit", "far", "trouble"]},
    {w:"guard",m:"\uc9c0\ud0a4\ub2e4, \ubcf4\ud638\ud558\ub2e4",def:"to take care of it",unit:10,opts:["far", "trouble", "guard", "separate"]},
    {w:"site",m:"\ubd80\uc9c0, \ud604\uc7a5, \uc7a5\uc18c",def:"a place",unit:10,opts:["guard", "trouble", "site", "proud"]},
    {w:"proud",m:"\uc790\ub791\uc2a4\ub7ec\uc6cc\ud558\ub294, \uc790\ub791\uc2a4\ub7ec\uc6b4",def:"happy about what they have done",unit:10,opts:["primary", "image", "proud", "benefit"]},
    {w:"chance",m:"\uac00\ub2a5\uc131, \uae30\ud68c",def:"an opportunity to do something",unit:10,opts:["proud", "remain", "chance", "trouble"]},
  ],
  "eew1_11": [
    {w:"history",m:"\uc5ed\uc0ac",def:"the study of the past",unit:11,opts:["history", "electric", "city", "advertise"]},
    {w:"city",m:"\ub3c4\uc2dc",def:"a place where a lot of people live",unit:11,opts:["develop", "city", "fact", "plastic"]},
    {w:"street",m:"\uac70\ub9ac, \ub3c4\ub85c",def:"a road in a city or village",unit:11,opts:["develop", "street", "problem", "people"]},
    {w:"problem",m:"(\ub2e4\ub8e8\uac70\ub098 \uc774\ud574\ud558\uae30 \ud798\ub4e0) \ubb38\uc81c",def:"a situation when something goes wrong",unit:11,opts:["problem", "history", "black", "street"]},
    {w:"plastic",m:"\ud50c\ub77c\uc2a4\ud2f1\uc758",def:"a material made by people",unit:11,opts:["glass", "plastic", "advertise", "history"]},
    {w:"glass",m:"\uc720\ub9ac",def:"a transparent, breakable material",unit:11,opts:["glass", "city", "people", "plastic"]},
    {w:"advertise",m:"(\uc0c1\ud488\uc774\ub098 \uc11c\ube44\uc2a4\ub97c) \uad11\uace0\ud558\ub2e4",def:"event by using a",unit:11,opts:["people", "advertise", "glass", "history"]},
    {w:"fact",m:"\uc0ac\uc2e4",def:"a piece of information that is true",unit:11,opts:["street", "people", "black", "fact"]},
    {w:"electric",m:"\uc804\uae30\uc758",def:"it uses electricity",unit:11,opts:["people", "black", "problem", "electric"]},
    {w:"people",m:"\uc0ac\ub78c\ub4e4",def:"humans",unit:11,opts:["street", "people", "advertise", "black"]},
    {w:"black",m:"\uac80\uc740",def:"the darkest color",unit:11,opts:["plastic", "city", "black", "clean"]},
    {w:"develop",m:"\uac1c\ubc1c\ud558\ub2e4, \uc131\uc7a5\ud558\ub2e4",def:"to make something larger or more advanced",unit:11,opts:["develop", "fact", "plastic", "city"]},
    {w:"clean",m:"\uccad\uc18c\ud558\ub2e4",def:"to make something neat and tidy",unit:11,opts:["people", "city", "clean", "problem"]},
  ],
  "eew1_12": [
    {w:"judge",m:"\ud310\ub2e8\ud558\ub2e4",def:"to say if it is good or bad",unit:12,opts:["judge", "material", "thin", "neighbor"]},
    {w:"space",m:"\uacf5\uac04",def:"an empty area",unit:12,opts:["article", "attitude", "quality", "space"]},
    {w:"professional",m:"\uc804\ubb38\uc801\uc778",def:"it deals with work that uses special skills",unit:12,opts:["professional", "quality", "material", "attitude"]},
    {w:"material",m:"\uc7ac\ub8cc",def:"what is used to make something",unit:12,opts:["professional", "beauty", "material", "quality"]},
    {w:"method",m:"\ubc29\ubc95",def:"the way to do something",unit:12,opts:["thin", "material", "neighbor", "method"]},
    {w:"thin",m:"\uc587\uc740, \uac00\ub294",def:"not fat",unit:12,opts:["thin", "beauty", "method", "judge"]},
    {w:"beauty",m:"\uc544\ub984\ub2e4\uc6c0, \ubbf8",def:"the state or quality of being beautiful",unit:12,opts:["quality", "beauty", "judge", "professional"]},
    {w:"neighbor",m:"\uc774\uc6c3(\uc0ac\ub78c)",def:"a person who lives near you",unit:12,opts:["neighbor", "attitude", "symbol", "professional"]},
    {w:"attitude",m:"\ud0dc\ub3c4",def:"the way they feel and think",unit:12,opts:["space", "method", "beauty", "attitude"]},
    {w:"symbol",m:"\uc0c1\uc9d5(\ubb3c)",def:"a thing that stands for something else",unit:12,opts:["attitude", "judge", "quality", "symbol"]},
    {w:"quality",m:"\uc9c8",def:"how good it is",unit:12,opts:["professional", "judge", "space", "quality"]},
    {w:"alone",m:"\ud63c\uc790, \ud640\ub85c",def:"not with another person",unit:12,opts:["alone", "material", "symbol", "article"]},
    {w:"article",m:"\uae00, \uae30\uc0ac",def:"a story in a newspaper or magazine",unit:12,opts:["alone", "judge", "article", "professional"]},
  ],
  "eew1_13": [
    {w:"quarter",m:"4\ubd84\uc758 1, 25\uc13c\ud2b8",def:"1/4 or 25% of something",unit:13,opts:["temporary", "scholarship", "assume", "quarter"]},
    {w:"scholarship",m:"\uc7a5\ud559\uae08",def:"money given so someone can go to school",unit:13,opts:["scholarship", "embarrass", "borrow", "appeal"]},
    {w:"loan",m:"\ub300\ucd9c",def:"one person lends to another",unit:13,opts:["practical", "scholarship", "temporary", "loan"]},
    {w:"appeal",m:"\ub9c8\uc74c\uc774 \ub04c\ub9ac\ub294, \ub9e4\ub825\uc801\uc778",def:"to be interesting or attractive",unit:13,opts:["appeal", "loan", "scholarship", "practical"]},
    {w:"practical",m:"\uc2e4\uc6a9\uc801\uc778",def:"useful",unit:13,opts:["downtown", "former", "practical", "temporary"]},
    {w:"assume",m:"\ucd94\uc815\ud558\ub2e4",def:"to think that it is true, even with no proof",unit:13,opts:["assume", "urge", "former", "loan"]},
    {w:"urge",m:"\uac15\ub825\ud788 \uad8c\uace0\ud558\ub2e4",def:"to try very hard to get them to do something",unit:13,opts:["temporary", "loan", "dull", "urge"]},
    {w:"temporary",m:"\uc77c\uc2dc\uc801\uc778, \uc784\uc2dc\uc758",def:"it exists for a short time",unit:13,opts:["downtown", "scholarship", "appeal", "temporary"]},
    {w:"borrow",m:"\ube4c\ub9ac\ub2e4",def:"to take it and then give it back later",unit:13,opts:["loan", "urge", "borrow", "practical"]},
    {w:"downtown",m:"\ub3c4\uc2ec\uc9c0, \uc2dc\ub0b4",def:"the center of most cities",unit:13,opts:["downtown", "dull", "temporary", "appeal"]},
    {w:"former",m:"\uc774\uc804\uc758, \uacfc\uac70\uc758",def:"used to be but is not anymore",unit:13,opts:["former", "loan", "practical", "temporary"]},
    {w:"found",m:"\uc124\ub9bd\ud558\ub2e4, \uc138\uc6b0\ub2e4",def:"to start it",unit:13,opts:["former", "found", "dull", "loan"]},
    {w:"embarrass",m:"\ub2f9\ud669\uc2a4\ub7fd\uac8c \ub9cc\ub4e4\ub2e4",def:"to make them feel ashamed or foolish",unit:13,opts:["scholarship", "embarrass", "former", "found"]},
    {w:"dull",m:"\uc9c0\ub8e8\ud55c",def:"not exciting",unit:13,opts:["borrow", "embarrass", "dull", "loan"]},
  ],
  "eew1_14": [
    {w:"coach",m:"(\uc2a4\ud3ec\uce20 \ud300\uc758) \ucf54\uce58",def:"a person who teaches sports",unit:14,opts:["store", "coach", "suffer", "mail"]},
    {w:"direct",m:"\uc9c1\uc811\uc801\uc778",def:"it goes straight between two places",unit:14,opts:["example", "mail", "direct", "poet"]},
    {w:"exam",m:"\uc2dc\ud5d8",def:"a test",unit:14,opts:["poet", "store", "mail", "exam"]},
    {w:"scene",m:"\ud604\uc7a5, \uc7a5\uba74",def:"one part of a book or movie",unit:14,opts:["outline", "scene", "exam", "novel"]},
    {w:"technology",m:"(\uacfc\ud559) \uae30\uc220",def:"new things made by using science",unit:14,opts:["novel", "description", "silly", "technology"]},
    {w:"silly",m:"\uc5b4\ub9ac\uc11d\uc740, \ubc14\ubcf4 \uac19\uc740",def:"a lack of serious thought",unit:14,opts:["store", "mail", "silly", "local"]},
    {w:"suffer",m:"\uc2dc\ub2ec\ub9ac\ub2e4, \uace0\ud1b5 \ubc1b\ub2e4",def:"to feel pain",unit:14,opts:["suffer", "exam", "description", "scene"]},
    {w:"outline",m:"\uac1c\uc694",def:"the plan for a story or essay",unit:14,opts:["control", "description", "outline", "coach"]},
    {w:"mail",m:"\uc6b0\ud3b8",def:"letters and other things sent to people",unit:14,opts:["poet", "scene", "mail", "novel"]},
    {w:"example",m:"\ubcf8\ubcf4\uae30, \uc804\ud615",def:"a thing that is typical of it",unit:14,opts:["example", "description", "outline", "novel"]},
    {w:"local",m:"\uc9c0\uc5ed\uc758, \ud604\uc9c0\uc758",def:"it is nearby",unit:14,opts:["outline", "coach", "novel", "local"]},
    {w:"sheet",m:"(\ubcf4\ud1b5 \ud45c\uc900 \ud06c\uae30\uc758 \uc885\uc774) \ud55c \uc7a5",def:"a thin flat piece of paper",unit:14,opts:["suffer", "scene", "exam", "sheet"]},
    {w:"novel",m:"(\uc7a5\ud3b8) \uc18c\uc124",def:"a book that tells a story",unit:14,opts:["outline", "novel", "exam", "description"]},
    {w:"print",m:"\uc778\uc1c4\ud558\ub2e4, \ud504\ub9b0\ud2b8\ub97c \ud558\ub2e4",def:"to put it onto paper",unit:14,opts:["print", "silly", "sheet", "coach"]},
    {w:"control",m:"\uc9c0\ubc30\ud558\ub2e4, \uc870\uc885\ud558\ub2e4",def:"to make it do what you want",unit:14,opts:["control", "example", "poet", "novel"]},
    {w:"poet",m:"\uc2dc\uc778",def:"a person who writes poems",unit:14,opts:["poet", "local", "suffer", "control"]},
    {w:"description",m:"\uc11c\uc220, \uae30\uc220, \ubb18\uc0ac",def:"what they are like",unit:14,opts:["novel", "suffer", "control", "description"]},
    {w:"store",m:"\uac00\uac8c, \uc0c1\uc810",def:"a place where you can buy things",unit:14,opts:["example", "control", "sheet", "store"]},
  ],
  "eew1_15": [
    {w:"fortunate",m:"\uc6b4 \uc88b\uc740",def:"lucky",unit:15,opts:["fortunate", "length", "breathe", "across"]},
    {w:"fear",m:"\uacf5\ud3ec, \ub450\ub824\uc6c0, \ubb34\uc11c\uc6c0",def:"the feeling of being afraid",unit:15,opts:["realize", "fear", "fortunate", "breathe"]},
    {w:"respond",m:"\ubc18\uc751\uc744 \ubcf4\uc774\ub2e4, \ub300\ub2f5\ud558\ub2e4",def:"to give an answer to what someone else said",unit:15,opts:["prize", "respond", "realize", "observe"]},
    {w:"risk",m:"\uc704\ud5d8",def:"a chance of something bad happening",unit:15,opts:["across", "risk", "happen", "realize"]},
    {w:"opportunity",m:"\uae30\ud68c",def:"a chance to do something",unit:15,opts:["length", "across", "opportunity", "breathe"]},
    {w:"mistake",m:"\uc2e4\uc218, \uc798\ubabb",def:"something you do wrong",unit:15,opts:["mistake", "length", "prize", "respond"]},
    {w:"happen",m:"(\ud2b9\ud788 \uacc4\ud68d\ud558\uc9c0 \uc54a\uc740 \uc77c\uc774) \ubc1c\uc0dd\ud558\ub2e4",def:"he or she does it by chance",unit:15,opts:["across", "respond", "realize", "happen"]},
    {w:"realize",m:"\uae68\ub2eb\ub2e4, \uc54c\uc544\ucc28\ub9ac\ub2e4",def:"to suddenly understand",unit:15,opts:["opportunity", "risk", "across", "realize"]},
    {w:"length",m:"\uae38\uc774",def:"how long it is from one end to the other",unit:15,opts:["across", "risk", "length", "happen"]},
    {w:"race",m:"\uacbd\uc8fc, \ub2ec\ub9ac\uae30",def:"a contest to see who is the fastest",unit:15,opts:["race", "prize", "respond", "realize"]},
    {w:"observe",m:"\uad00\ucc30\ud558\ub2e4",def:"to watch it",unit:15,opts:["fortunate", "observe", "respond", "length"]},
    {w:"consume",m:"\uba39\ub2e4, \ub9c8\uc2dc\ub2e4",def:"to eat or drink it",unit:15,opts:["risk", "consume", "respond", "across"]},
    {w:"extremely",m:"\uadf9\ub3c4\ub85c, \uadf9\ud788",def:"very, very good",unit:15,opts:["risk", "extremely", "fear", "happen"]},
    {w:"excite",m:"\ud765\ubd84\uc2dc\ud0a4\ub2e4, \uc790\uadf9\ud558\ub2e4",def:"to make them happy and interested",unit:15,opts:["consume", "excite", "extremely", "fortunate"]},
    {w:"prize",m:"\uc0c1, \uc0c1\ud488",def:"that is given to the winner",unit:15,opts:["prize", "fortunate", "observe", "extremely"]},
    {w:"breathe",m:"\ud638\ud761\ud558\ub2e4, \uc228\uc744 \uc26c\ub2e4",def:"to let air go in and out of your body",unit:15,opts:["breathe", "length", "extremely", "fortunate"]},
    {w:"across",m:"\uac00\ub85c\uc9c8\ub7ec, \uac00\ub85c\ub85c",def:"to go to the other side of it",unit:15,opts:["extremely", "fortunate", "happen", "across"]},
  ],
  "eew1_16": [
    {w:"wear",m:"\uc785\ub2e4, \ucc29\uc6a9\ud558\ub2e4",def:"to have clothing on your body",unit:16,opts:["wear", "green", "from", "end"]},
    {w:"from",m:"~\ubd80\ud130",def:"a starting place or position",unit:16,opts:["january", "clothes", "year", "from"]},
    {w:"university",m:"\ub300\ud559",def:"a school where people study for a degree",unit:16,opts:["home", "year", "december", "university"]},
    {w:"home",m:"(\ud2b9\ud788 \uac00\uc871\uacfc \ud568\uaed8 \uc0ac\ub294) \uc9d1",def:"the place where that person lives",unit:16,opts:["year", "end", "wear", "home"]},
    {w:"year",m:"\uc5f0\ub3c4, \ud574",def:"a period of 365 days or twelve months",unit:16,opts:["green", "red", "year", "university"]},
    {w:"december",m:"12\uc6d4",def:"the twelfth month of the year",unit:16,opts:["clothes", "december", "from", "home"]},
    {w:"exchange",m:"\uad50\ud658\ud558\ub2e4",def:"to give one thing in return for another",unit:16,opts:["exchange", "january", "december", "green"]},
    {w:"clothes",m:"\uc637, \uc758\ubcf5",def:"what people wear to cover their bodies",unit:16,opts:["exchange", "december", "home", "clothes"]},
    {w:"end",m:"\ub05d\ub0b4\ub2e4, \ub05d\uc744 \ub9fa\ub2e4",def:"to stop or finish",unit:16,opts:["end", "dinner", "clothes", "year"]},
    {w:"seven",m:"7, \uc77c\uacf1",def:"the word for the number 7",unit:16,opts:["december", "year", "seven", "red"]},
    {w:"dinner",m:"\uc800\ub141\uc2dd\uc0ac",def:"the main meal eaten in the evening",unit:16,opts:["year", "exchange", "december", "dinner"]},
    {w:"start",m:"(\ubb34\uc5c7\uc744 \ud558\uac70\ub098 \uc0ac\uc6a9\ud558\uae30) \uc2dc\uc791\ud558\ub2e4",def:"to begin doing something",unit:16,opts:["exchange", "december", "home", "start"]},
    {w:"red",m:"\ube68\uac04(\uc0c9\uc758), \ubd89\uc740",def:"the color of blood",unit:16,opts:["january", "red", "exchange", "dinner"]},
    {w:"green",m:"\ub179\uc0c9\uc758",def:"the color of growing grass or leaves",unit:16,opts:["clothes", "green", "dinner", "december"]},
    {w:"january",m:"1\uc6d4",def:"the first month of the year",unit:16,opts:["january", "exchange", "december", "university"]},
  ],
  "eew1_17": [
    {w:"forward",m:"(\uc704\uce58\uac00) \uc55e\uc73c\ub85c",def:"you move in the direction in front of you",unit:17,opts:["response", "level", "decide", "forward"]},
    {w:"fair",m:"\uacf5\uc815\ud55c, \uacf5\ud3c9\ud55c",def:"reasonable or right",unit:17,opts:["else", "decide", "puddle", "fair"]},
    {w:"puddle",m:"(\ud2b9\ud788 \ube44 \uc628 \ub4a4\uc758) \ubb3c\uc6c5\ub369\uc774",def:"a pool of liquid on the ground",unit:17,opts:["fair", "appreciate", "puddle", "level"]},
    {w:"available",m:"\uc774\uc6a9\ud560 \uc218 \uc788\ub294",def:"it means you can get it",unit:17,opts:["bright", "forward", "available", "disappear"]},
    {w:"hill",m:"\uc5b8\ub355",def:"a raised area of land",unit:17,opts:["lone", "hill", "else", "solution"]},
    {w:"level",m:"\uc815\ub3c4, \uc218\uc900",def:"a point on a scale that measures something",unit:17,opts:["whether", "level", "forward", "lone"]},
    {w:"else",m:"\ub2e4\ub978",def:"you talk about something different",unit:17,opts:["else", "solution", "response", "beat"]},
    {w:"appreciate",m:"\uc54c\uc544\uc8fc\ub2e4, \uac10\uc0ac\ud558\ub2e4",def:"to understand its good qualities",unit:17,opts:["beat", "decide", "hill", "appreciate"]},
    {w:"lone",m:"\ud63c\uc790\uc778, \ub2e8\ub3c5\uc758",def:"the only one in a given place",unit:17,opts:["lone", "else", "hill", "appreciate"]},
    {w:"solution",m:"\ud574\ubc95, \ud574\uacb0\ucc45",def:"a way to solve a problem",unit:17,opts:["lone", "available", "response", "solution"]},
    {w:"beat",m:"\uc774\uae30\ub2e4",def:"to do better than they do",unit:17,opts:["level", "beat", "forward", "fair"]},
    {w:"decide",m:"\uacb0\uc815\ud558\ub2e4",def:"to make a definite choice",unit:17,opts:["puddle", "bright", "decide", "disappear"]},
    {w:"disappear",m:"(\ub208\uc55e\uc5d0\uc11c) \uc0ac\ub77c\uc9c0\ub2e4, \ubcf4\uc774\uc9c0 \uc54a\uac8c \ub418\ub2e4",def:"to go away or not be seen",unit:17,opts:["disappear", "puddle", "else", "hill"]},
    {w:"response",m:"\ub300\ub2f5, \uc751\ub2f5, \ud68c\uc2e0, \ub2f5\uc7a5",def:"the answer to a question",unit:17,opts:["whether", "solution", "response", "lone"]},
    {w:"bright",m:"\ubc1d\uc740, \ub208\ubd80\uc2e0, \ube5b\ub098\ub294",def:"it gives off a lot of light",unit:17,opts:["fair", "bright", "whether", "else"]},
    {w:"whether",m:"~\uc774\ub4e0 \uc544\ub2c8\ub4e0",def:"when you must choose between two things",unit:17,opts:["hill", "whether", "fair", "appreciate"]},
  ],
  "eew1_18": [
    {w:"special",m:"\ud2b9\uc218\ud55c, \ud2b9\ubcc4\ud55c",def:"unique and different",unit:18,opts:["carrot", "special", "diet", "always"]},
    {w:"health",m:"\uac74\uac15",def:"the state of a person\u2019s body",unit:18,opts:["health", "carrot", "great", "chicken"]},
    {w:"carrot",m:"\ub2f9\uadfc",def:"an orange vegetable",unit:18,opts:["delicious", "carrot", "diet", "chicken"]},
    {w:"eat",m:"\uba39\ub2e4, \uc2dd\uc0ac\ud558\ub2e4",def:"to chew and swallow food",unit:18,opts:["chicken", "eat", "always", "carrot"]},
    {w:"delicious",m:"\uc544\uc8fc \ub9db\uc788\ub294, \ub0c4\uc0c8\uac00 \uc88b\uc740",def:"tasty",unit:18,opts:["restaurant", "special", "delicious", "contain"]},
    {w:"always",m:"\ud56d\uc0c1, \uc5b8\uc81c\ub098",def:"something happens all the time",unit:18,opts:["always", "ask", "diet", "chicken"]},
    {w:"bread",m:"\ube75",def:"a food made from flour and water",unit:18,opts:["bread", "water", "always", "contain"]},
    {w:"water",m:"\ubb3c",def:"a clear liquid that people need to survive",unit:18,opts:["water", "restaurant", "chicken", "carrot"]},
    {w:"chicken",m:"\ub2ed, \ub2ed\uace0\uae30",def:"a bird that is often used for food",unit:18,opts:["restaurant", "eat", "chicken", "food"]},
    {w:"contain",m:"\ub4e4\uc5b4\uc788\ub2e4, \ud3ec\ud568\ud558\ub2e4",def:"to hold or have something",unit:18,opts:["ask", "contain", "eat", "health"]},
    {w:"chocolate",m:"\ucd08\ucf5c\ub9bf",def:"a sweet food made from cacao beans",unit:18,opts:["contain", "special", "chocolate", "water"]},
    {w:"food",m:"\uc74c\uc2dd",def:"things people and animals eat",unit:18,opts:["food", "great", "ask", "bread"]},
    {w:"great",m:"\uc5c4\uccad\ub09c",def:"it is very good",unit:18,opts:["water", "delicious", "great", "eat"]},
    {w:"ask",m:"\ubb3b\ub2e4, \ubb3c\uc5b4 \ubcf4\ub2e4",def:"to say or write something to get an answer",unit:18,opts:["food", "ask", "chocolate", "always"]},
    {w:"diet",m:"\uc2dd\uc2b5\uad00, \ub2e4\uc774\uc5b4\ud2b8",def:"the food regularly eaten by a person",unit:18,opts:["diet", "delicious", "special", "chicken"]},
    {w:"restaurant",m:"\uc2dd\ub2f9, \ub808\uc2a4\ud1a0\ub791",def:"a business where people sit and eat food",unit:18,opts:["contain", "chocolate", "food", "restaurant"]},
  ],
  "eew1_19": [
    {w:"toward",m:"~\ucabd\uc73c\ub85c, ~\uc744",def:"you go closer to it",unit:19,opts:["toward", "captain", "conclusion", "wood"]},
    {w:"conclusion",m:"\uacb0\ub860, (\ucd5c\uc885\uc801\uc778) \ud310\ub2e8",def:"the final part of it",unit:19,opts:["speech", "old", "mention", "conclusion"]},
    {w:"bother",m:"\uc2e0\uacbd \uc4f0\ub2e4, \uc560\ub97c \uc4f0\ub2e4",def:"to make the effort to do something",unit:19,opts:["speech", "alive", "conclusion", "bother"]},
    {w:"international",m:"\uad6d\uc81c\uc801\uc778",def:"it involves more than one country",unit:19,opts:["glad", "toward", "international", "social"]},
    {w:"captain",m:"\uc120\uc7a5, \uae30\uc7a5",def:"the person who controls a ship or airplane",unit:19,opts:["captain", "policy", "old", "however"]},
    {w:"however",m:"\uc544\ubb34\ub9ac ~\ud574\ub3c4, \ud558\uc9c0\ub9cc",def:"not being influenced by something",unit:19,opts:["however", "conclusion", "mention", "explore"]},
    {w:"speech",m:"\uc5f0\uc124, \ub2f4\ud654",def:"something said to a group of people",unit:19,opts:["policy", "international", "injustice", "speech"]},
    {w:"explore",m:"\ud0d0\ud5d8\ud558\ub2e4, \ub2f5\uc0ac\ud558\ub2e4",def:"to look for new places",unit:19,opts:["however", "explore", "toward", "bother"]},
    {w:"mention",m:"\ub9d0\ud558\ub2e4, \uc5b8\uae09\ud558\ub2e4",def:"to talk about it",unit:19,opts:["policy", "mention", "doubt", "international"]},
    {w:"bone",m:"\ubf08",def:"a hard part of the body",unit:19,opts:["policy", "bone", "alive", "injustice"]},
    {w:"glad",m:"\uae30\uc05c",def:"you are happy",unit:19,opts:["explore", "glad", "injustice", "however"]},
    {w:"doubt",m:"\uc758\uc2ec, \uc758\ud639, \uc758\ubb38",def:"a feeling of not being sure",unit:19,opts:["wood", "explore", "international", "doubt"]},
    {w:"old",m:"\ub299\uc740, \ub098\uc774 \ub9ce\uc740",def:"lived for many years",unit:19,opts:["bone", "conclusion", "captain", "old"]},
    {w:"alive",m:"\uc0b4\uc544 \uc788\ub294",def:"not dead",unit:19,opts:["mention", "alive", "captain", "glad"]},
    {w:"social",m:"\uc0ac\ud68c\uc758, \uc0ac\ud68c\uc801\uc778",def:"about many people in a community",unit:19,opts:["social", "glad", "policy", "conclusion"]},
    {w:"injustice",m:"\ubd80\ub2f9\ud568, \ubd80\ub2f9\uc131",def:"a lack of fairness or justice",unit:19,opts:["glad", "mention", "explore", "injustice"]},
    {w:"policy",m:"\uc815\ucc45, \ubc29\uce68",def:"a rule",unit:19,opts:["policy", "bother", "doubt", "wood"]},
    {w:"wood",m:"\ub098\ubb34, \ubaa9\uc7ac",def:"the thing that trees are made of",unit:19,opts:["mention", "wood", "alive", "captain"]},
  ],
  "eew1_20": [
    {w:"achieve",m:"\ub2ec\uc131\ud558\ub2e4, \uc131\ucde8\ud558\ub2e4",def:"to successfully do it after trying hard",unit:20,opts:["consider", "achieve", "meat", "already"]},
    {w:"serve",m:"(\uc2dd\ub2f9 \ub4f1\uc5d0\uc11c \uc74c\uc2dd\uc744) \uc81c\uacf5\ud558\ub2e4",def:"to give them food or drinks",unit:20,opts:["serve", "meat", "achieve", "regard"]},
    {w:"meat",m:"\uace0\uae30",def:"food made of animals",unit:20,opts:["already", "war", "goal", "meat"]},
    {w:"basic",m:"\uae30\ucd08\uc801\uc778",def:"it is very simple or easy",unit:20,opts:["advise", "basic", "war", "meat"]},
    {w:"goal",m:"\ubaa9\ud45c",def:"something you work toward",unit:20,opts:["war", "regard", "goal", "advise"]},
    {w:"vegetable",m:"\ucc44\uc18c, \uc57c\ucc44",def:"a plant used as food",unit:20,opts:["basic", "entertain", "vegetable", "war"]},
    {w:"consider",m:"\uc0ac\ub824\ud558\ub2e4, \uace0\ub824\ud558\ub2e4",def:"to think about it",unit:20,opts:["real", "opinion", "worth", "consider"]},
    {w:"war",m:"\uc804\uc7c1",def:"a big fight between two groups of people",unit:20,opts:["consider", "war", "real", "worth"]},
    {w:"entertain",m:"\uc990\uac81\uac8c \ud558\ub2e4",def:"to do something that they enjoy",unit:20,opts:["meat", "bit", "entertain", "basic"]},
    {w:"real",m:"\ud604\uc2e4\uc801\uc778, \uc2e4\uc81c\uc758, \uc2e4\uc7ac\ud558\ub294",def:"it actually exists",unit:20,opts:["already", "regard", "real", "consider"]},
    {w:"already",m:"\uc774\ubbf8, \ubc8c\uc368",def:"it happens before a certain time",unit:20,opts:["opinion", "already", "regard", "bit"]},
    {w:"worth",m:"~\uc758 \uac00\uce58\uac00 \uc788\ub294",def:"it costs that amount",unit:20,opts:["worth", "war", "meat", "basic"]},
    {w:"advise",m:"\uc870\uc5b8\ud558\ub2e4, \ucda9\uace0\ud558\ub2e4, \uad8c\uace0\ud558\ub2e4",def:"to tell them what to do",unit:20,opts:["vegetable", "basic", "advise", "war"]},
    {w:"bit",m:"\uc870\uae08, \uc57d\uac04",def:"a small amount of something",unit:20,opts:["consider", "worth", "bit", "meat"]},
    {w:"opinion",m:"\uc758\uacac",def:"a thought about a person or a thing",unit:20,opts:["bit", "worth", "real", "opinion"]},
    {w:"regard",m:"~\uc744 ~\ub85c \uc5ec\uae30\ub2e4",def:"to think of them in a certain way",unit:20,opts:["already", "entertain", "bit", "regard"]},
  ],
  "eew1_21": [
    {w:"career",m:"\uc9c1\uc5c5, \uacbd\ub825",def:"a job that you do for a large part of your life",unit:21,opts:["hurry", "career", "pain", "enter"]},
    {w:"effort",m:"\uc218\uace0, \uc560",def:"hard work or an attempt to do something",unit:21,opts:["effort", "base", "various", "locate"]},
    {w:"clerk",m:"\uc810\uc6d0, \uc9c1\uc6d0, \uc0ac\ubb34\uc6d0",def:"a type of worker",unit:21,opts:["pain", "clerk", "brain", "enter"]},
    {w:"inform",m:"\uc54c\ub9ac\ub2e4, \ud1b5\uc9c0\ud558\ub2e4",def:"to tell them about something",unit:21,opts:["various", "inform", "career", "hurry"]},
    {w:"later",m:"\ub4a4\uc5d0, \ud6c4\uc5d0",def:"after the present, expected, or usual time",unit:21,opts:["excellent", "locate", "later", "effort"]},
    {w:"leave",m:"\ub5a0\ub098\ub2e4, \ucd9c\ubc1c\ud558\ub2e4",def:"to go away from someone or something",unit:21,opts:["leave", "clerk", "hurry", "appear"]},
    {w:"pain",m:"(\uc721\uccb4\uc801) \uc544\ud514, \ud1b5\uc99d, \uace0\ud1b5",def:"the feeling that you have when you are hurt",unit:21,opts:["excellent", "appear", "brain", "pain"]},
    {w:"enter",m:"\ub4e4\uc5b4\uac00\ub2e4",def:"to go into it",unit:21,opts:["clerk", "pain", "enter", "appear"]},
    {w:"appear",m:"\ub098\ud0c0\ub098\ub2e4, \ubcf4\uc774\uae30 \uc2dc\uc791\ud558\ub2e4",def:"to seem",unit:21,opts:["appear", "base", "inform", "locate"]},
    {w:"brain",m:"\ub1cc",def:"the organ in your head that lets you think",unit:21,opts:["refuse", "enter", "hurry", "brain"]},
    {w:"base",m:"(\uc0ac\ubb3c\uc758) \ub9e8 \uc544\ub798 \ubd80\ubd84, \uae30\ucd08, \ud1a0\ub300",def:"the bottom of something",unit:21,opts:["career", "leave", "base", "pain"]},
    {w:"refuse",m:"\uac70\uc808\ud558\ub2e4, \uac70\ubd80\ud558\ub2e4",def:"to say \u201cno\u201d to it",unit:21,opts:["base", "locate", "refuse", "career"]},
    {w:"various",m:"\uc5ec\ub7ec \uac00\uc9c0\uc758, \uac01\uc591\uac01\uc0c9\uc758, \ub2e4\uc591\ud55c",def:"there are many types of it",unit:21,opts:["leave", "base", "inform", "various"]},
    {w:"hurry",m:"\uc11c\ub450\ub974\ub2e4, \uae09\ud788 \ud558\ub2e4",def:"to do something quickly",unit:21,opts:["hurry", "refuse", "various", "clerk"]},
    {w:"locate",m:"~\uc758 \uc815\ud655\ud55c \uc704\uce58\ub97c \ucc3e\uc544\ub0b4\ub2e4",def:"to find it",unit:21,opts:["locate", "appear", "inform", "career"]},
    {w:"excellent",m:"\ud6cc\ub96d\ud55c, \ud0c1\uc6d4\ud55c",def:"it is very good",unit:21,opts:["pain", "excellent", "refuse", "clerk"]},
  ],
  "eew1_22": [
    {w:"deliver",m:"\ubc30\ub2ec\ud558\ub2e4",def:"to take it from one place to another",unit:22,opts:["steal", "occur", "deliver", "gate"]},
    {w:"comfort",m:"\uc704\ub85c\ud558\ub2e4, \uc704\uc548\ud558\ub2e4",def:"to make them feel better",unit:22,opts:["comfort", "plate", "earn", "steal"]},
    {w:"steal",m:"\ud6d4\uce58\ub2e4, \ub3c4\ub451\uc9c8\ud558\ub2e4",def:"to take something that is not yours",unit:22,opts:["include", "customer", "steal", "manage"]},
    {w:"earn",m:"(\ub3c8\uc744) \ubc8c\ub2e4",def:"to get money for the work you do",unit:22,opts:["earn", "manage", "actual", "contact"]},
    {w:"charge",m:"(\uc0c1\ud488, \uc11c\ube44\uc2a4\uc5d0 \ub300\ud55c) \uc694\uae08",def:"the price to pay for something",unit:22,opts:["earn", "steal", "set", "charge"]},
    {w:"contact",m:"\uc5f0\ub77d\ud558\ub2e4",def:"to speak or write to them",unit:22,opts:["manage", "occur", "comfort", "contact"]},
    {w:"opposite",m:"\ubc18\ub300",def:"completely different",unit:22,opts:["occur", "contact", "steal", "opposite"]},
    {w:"set",m:"(\ud2b9\uc815\ud55c \uc7a5\uc18c, \uc704\uce58\uc5d0) \ub193\ub2e4",def:"to put it somewhere",unit:22,opts:["plate", "contact", "deliver", "set"]},
    {w:"amaze",m:"(\ub300\ub2e8\ud788) \ub180\ub77c\uac8c \ud558\ub2e4",def:"to surprise them very much",unit:22,opts:["amaze", "deliver", "earn", "opposite"]},
    {w:"actual",m:"(\uc0ac\uc2e4\uc784\uc744 \uac15\uc870\ud558\uc5ec) \uc2e4\uc81c\uc758",def:"real or true",unit:22,opts:["steal", "opposite", "occur", "actual"]},
    {w:"plate",m:"(\ubcf4\ud1b5 \ub465\uadf8\ub7f0) \uc811\uc2dc, \uadf8\ub987",def:"a flat round thing that you put food on",unit:22,opts:["plate", "deliver", "steal", "gate"]},
    {w:"manage",m:"\uc6b4\uc601\ud558\ub2e4, \uad00\ub9ac\ud558\ub2e4",def:"to control or be in charge of it",unit:22,opts:["include", "comfort", "manage", "receive"]},
    {w:"gate",m:"(\uac74\ubb3c \ub2f4\uc774\ub098 \uc6b8\ud0c0\ub9ac\uc5d0 \uc5f0\uacb0\ub41c) \ubb38, \uc815\ubb38, \ub300\ubb38",def:"a type of door",unit:22,opts:["plate", "amaze", "actual", "gate"]},
    {w:"include",m:"\ud3ec\ud568\ud558\ub2e4",def:"to have it as part of a group",unit:22,opts:["set", "contact", "comfort", "include"]},
    {w:"occur",m:"\uc77c\uc5b4\ub098\ub2e4, \ubc1c\uc0dd\ud558\ub2e4",def:"to happen",unit:22,opts:["customer", "actual", "include", "occur"]},
    {w:"receive",m:"\ubc1b\ub2e4, \ubc1b\uc544\ub4e4\uc774\ub2e4",def:"to get it",unit:22,opts:["occur", "contact", "receive", "include"]},
    {w:"customer",m:"\uc190\ub2d8, \uace0\uac1d",def:"a person who buys something at a store",unit:22,opts:["include", "receive", "plate", "customer"]},
  ],
  "eew1_23": [
    {w:"match",m:"\uc5b4\uc6b8\ub9ac\ub2e4, \uc77c\uce58\ud558\ub2e4",def:"to be the same or similar",unit:23,opts:["personality", "remove", "match", "lower"]},
    {w:"athlete",m:"(\uc6b4\ub3d9)\uc120\uc218",def:"a person who plays sports",unit:23,opts:["athlete", "poem", "personality", "sound"]},
    {w:"behavior",m:"\ud589\ub3d9, \uac70\ub3d9, \ud589\uc2e4",def:"the way you act",unit:23,opts:["remove", "swim", "passenger", "behavior"]},
    {w:"swim",m:"\uc218\uc601\ud558\ub2e4, \ud5e4\uc5c4\uce58\ub2e4",def:"to move through water",unit:23,opts:["swim", "passenger", "behavior", "athlete"]},
    {w:"member",m:"\uad6c\uc131\uc6d0",def:"a person who is part of a group",unit:23,opts:["member", "average", "behavior", "poem"]},
    {w:"course",m:"(\ud2b9\uc815 \uacfc\ubaa9\uc5d0 \ub300\ud55c \uc77c\ub828\uc758) \uac15\uc758, \uac15\uc88c",def:"a class in school",unit:23,opts:["sound", "web", "behavior", "course"]},
    {w:"behind",m:"(\uc704\uce58\uac00) \ub4a4\uc5d0",def:"to be at the back of something",unit:23,opts:["match", "behind", "member", "sound"]},
    {w:"average",m:"\ud3c9\uade0\uc758",def:"it is at a normal level",unit:23,opts:["average", "poem", "mental", "passenger"]},
    {w:"poem",m:"\uc2dc",def:"a short kind of writing",unit:23,opts:["mental", "poem", "advance", "sound"]},
    {w:"sound",m:"\uc18c\ub9ac\ub97c \ub0b4\ub2e4",def:"to make a noise",unit:23,opts:["mental", "advance", "web", "sound"]},
    {w:"advance",m:"\ub2e4\uac00\uac00\ub2e4, \uc9c4\uaca9\ud558\ub2e4",def:"to go forward",unit:23,opts:["match", "swim", "advance", "course"]},
    {w:"lower",m:"~\uc744 \ub0b4\ub9ac\ub2e4",def:"to make it go down",unit:23,opts:["mental", "lower", "web", "average"]},
    {w:"remove",m:"\uce58\uc6b0\ub2e4",def:"to take it away",unit:23,opts:["behavior", "athlete", "remove", "member"]},
    {w:"personality",m:"\uc131\uaca9, \uc778\uaca9",def:"what you are like and how you behave",unit:23,opts:["passenger", "personality", "behind", "mental"]},
    {w:"passenger",m:"\uc2b9\uac1d",def:"a person who rides in a car, train, or airplane",unit:23,opts:["swim", "passenger", "poem", "sound"]},
    {w:"web",m:"\uac70\ubbf8\uc904",def:"a home made by a spider",unit:23,opts:["remove", "web", "personality", "average"]},
    {w:"mental",m:"\uc815\uc2e0\uc758, \ub9c8\uc74c\uc758",def:"it has to do with your mind",unit:23,opts:["athlete", "sound", "mental", "swim"]},
  ],
  "eew1_24": [
    {w:"guide",m:"\uc548\ub0b4(\uc11c)",def:"someone who shows you where to go",unit:24,opts:["direction", "public", "lack", "guide"]},
    {w:"block",m:"(\ub2e8\ub2e8\ud55c) \uc0ac\uac01\ud615 \ub369\uc5b4\ub9ac",def:"a solid piece of wood, stone, or ice",unit:24,opts:["guide", "direction", "complex", "block"]},
    {w:"support",m:"\uc9c0\uc6d0\ud558\ub2e4, \uc9c0\uc9c0\ud558\ub2e4",def:"to like it and help it be successful",unit:24,opts:["strike", "direction", "term", "support"]},
    {w:"smart",m:"\ub611\ub611\ud55c, \uc601\ub9ac\ud55c",def:"intelligent",unit:24,opts:["probably", "smart", "event", "complex"]},
    {w:"public",m:"\ub300\uc911\uc744 \uc704\ud55c, \uacf5\uacf5\uc758",def:"it is meant for everyone to use",unit:24,opts:["unite", "guide", "public", "direction"]},
    {w:"probably",m:"\uc544\ub9c8",def:"it is likely to happen",unit:24,opts:["complex", "smart", "probably", "block"]},
    {w:"direction",m:"\ubc29\ud5a5",def:"the way to go",unit:24,opts:["probably", "guide", "direction", "public"]},
    {w:"complex",m:"\ubcf5\uc7a1\ud55c",def:"hard to understand",unit:24,opts:["event", "term", "smart", "complex"]},
    {w:"event",m:"(\ud2b9\ud788 \uc911\uc694\ud55c) \uc0ac\uac74, \ud589\uc0ac",def:"especially something important",unit:24,opts:["event", "complex", "block", "lack"]},
    {w:"strike",m:"(\uc138\uac8c) \uce58\ub2e4, \ubd80\ub52a\uce58\ub2e4",def:"to hit them",unit:24,opts:["complex", "support", "strike", "lack"]},
    {w:"lack",m:"\ubd80\uc871, \uacb0\ud54d",def:"there is not enough of it",unit:24,opts:["guide", "complex", "support", "lack"]},
    {w:"term",m:"\uc6a9\uc5b4, \ub9d0",def:"a word for something",unit:24,opts:["term", "probably", "block", "direction"]},
    {w:"unite",m:"(\ub2e4\ub978 \uc0ac\ub78c\ub4e4\uacfc) \uc5f0\ud569\ud558\ub2e4",def:"to get together to do something",unit:24,opts:["unite", "complex", "direction", "smart"]},
  ],
  "eew1_25": [
    {w:"period",m:"\uae30\uac04, \uc2dc\uae30",def:"an amount of time when something happens",unit:25,opts:["range", "environment", "period", "feature"]},
    {w:"wide",m:"\ub113\uc740",def:"it is large from side to side",unit:25,opts:["wide", "mix", "tip", "associate"]},
    {w:"feature",m:"\ud2b9\uc0c9, \ud2b9\uc9d5, \ud2b9\uc131",def:"an important part of something",unit:25,opts:["mix", "produce", "feature", "instance"]},
    {w:"associate",m:"\uc5f0\uc0c1\ud558\ub2e4, \uc5f0\uad00 \uc9d3\ub2e4",def:"to connect something with a person or thing",unit:25,opts:["populate", "instance", "associate", "tip"]},
    {w:"recognize",m:"\uc54c\uc544\ubcf4\ub2e4, \uc778\uc2dd\ud558\ub2e4",def:"to know it because you have seen it before",unit:25,opts:["recognize", "environment", "associate", "instance"]},
    {w:"organize",m:"\uc900\ube44\ud558\ub2e4, \uacc4\ud68d\ud558\ub2e4",def:"to plan or get ready for an event",unit:25,opts:["organize", "feature", "produce", "populate"]},
    {w:"tip",m:"(\ubfb0\uc871\ud55c) \ub05d",def:"a pointed end of something",unit:25,opts:["produce", "wide", "tip", "populate"]},
    {w:"environment",m:"(\uc8fc\ubcc0\uc758) \ud658\uacbd",def:"the place where people work or live",unit:25,opts:["environment", "wide", "range", "mix"]},
    {w:"produce",m:"\uc0dd\uc0b0\ud558\ub2e4",def:"to make or grow it",unit:25,opts:["produce", "mix", "associate", "period"]},
    {w:"mix",m:"\ud63c\ud569\uccb4",def:"different things put together",unit:25,opts:["environment", "mix", "range", "produce"]},
    {w:"involve",m:"\ucc38\uc5ec\ud558\ub2e4",def:"to include as an active participant",unit:25,opts:["associate", "instance", "involve", "period"]},
    {w:"instance",m:"\uc0ac\ub840, \uacbd\uc6b0",def:"an example of something",unit:25,opts:["feature", "recognize", "instance", "period"]},
    {w:"populate",m:"(\uc5b4\ub5a4 \uc9c0\uc5ed\uc758 \uc8fc\ubbfc\uc73c\ub85c) \uc0b4\ub2e4, \uac70\uc8fc\ud558\ub2e4",def:"they live there",unit:25,opts:["mix", "organize", "populate", "instance"]},
    {w:"range",m:"\ub2e4\uc591\uc131, \ubc94\uc704",def:"a number or a set of similar things",unit:25,opts:["period", "range", "recognize", "tip"]},
  ],
  "eew1_26": [
    {w:"ride",m:"(\ud0c8\uac83\uc5d0) \ud0c0\ub2e4",def:"to travel on it",unit:26,opts:["standard", "ride", "react", "maintain"]},
    {w:"react",m:"\ubc18\uc751\ud558\ub2e4, \ubc18\uc751\uc744 \ubcf4\uc774\ub2e4",def:"to respond by acting in a certain way",unit:26,opts:["maintain", "final", "react", "advice"]},
    {w:"prove",m:"\uc785\uc99d\ud558\ub2e4, \uc99d\uba85\ud558\ub2e4",def:"to show that it is true",unit:26,opts:["maintain", "drop", "physical", "prove"]},
    {w:"imply",m:"\uc554\uc2dc\ud558\ub2e4, \uc2dc\uc0ac\ud558\ub2e4",def:"to suggest it without saying it",unit:26,opts:["advice", "drop", "imply", "along"]},
    {w:"physical",m:"\uc721\uccb4\uc758, \ubb3c\ub9ac\uc801\uc778",def:"it is related to your body and not your mind",unit:26,opts:["advice", "maintain", "react", "physical"]},
    {w:"advice",m:"\uc870\uc5b8, \ucda9\uace0",def:"an opinion about what to do",unit:26,opts:["standard", "drop", "imply", "advice"]},
    {w:"further",m:"\ub354 \uc774\uc0c1\uc758, \ucd94\uac00\uc758",def:"from a greater distance or time",unit:26,opts:["drop", "along", "further", "final"]},
    {w:"otherwise",m:"(\ub9cc\uc57d) \uadf8\ub807\uc9c0 \uc54a\uc73c\uba74",def:"in another way if you don\u2019t do this",unit:26,opts:["along", "situated", "imply", "otherwise"]},
    {w:"suggest",m:"\uc81c\uc548\ud558\ub2e4, \uc81c\uc758\ud558\ub2e4",def:"to give an idea or plan about it",unit:26,opts:["situated", "react", "imply", "suggest"]},
    {w:"drop",m:"\ub5a8\uc5b4\uc9c0\ub2e4, \ub5a8\uc5b4\ub728\ub9ac\ub2e4",def:"to fall or allow something to fall",unit:26,opts:["along", "standard", "suggest", "drop"]},
    {w:"standard",m:"\uc218\uc900, \uae30\uc900",def:"what people consider normal or good",unit:26,opts:["standard", "neither", "maintain", "final"]},
    {w:"neither",m:"\ub458 \uc911 \uc5b4\ub290 \uac83\ub3c4 ~\uc544\ub2c8\ub2e4",def:"connect two negative possibilities",unit:26,opts:["further", "physical", "final", "neither"]},
    {w:"along",m:"~\uc744 \ub530\ub77c",def:"down the length of a road, river, etc.",unit:26,opts:["suggest", "along", "prove", "physical"]},
    {w:"maintain",m:"(\uc218\uc900 \ub4f1\uc744 \ub3d9\uc77c\ud558\uac8c) \uc720\uc9c0\ud558\ub2e4",def:"to make something stay the same",unit:26,opts:["advice", "physical", "maintain", "imply"]},
    {w:"final",m:"\ub9c8\uc9c0\ub9c9\uc758",def:"it is the last part",unit:26,opts:["final", "ride", "otherwise", "further"]},
    {w:"situated",m:"\uc704\uce58\ud574 \uc788\ub294, \uc790\ub9ac\ud558\uace0 \uc788\ub294",def:"it is in that place",unit:26,opts:["further", "maintain", "situated", "final"]},
  ],
  "eew1_27": [
    {w:"gift",m:"\uc120\ubb3c",def:"something you give someone",unit:27,opts:["trip", "gift", "puzzle", "actually"]},
    {w:"spider",m:"\uac70\ubbf8",def:"a small creature with eight legs",unit:27,opts:["coast", "false", "spider", "puzzle"]},
    {w:"false",m:"\ud2c0\ub9b0, \uc0ac\uc2e4\uc774 \uc544\ub2cc",def:"it is not correct",unit:27,opts:["examine", "false", "specific", "imagine"]},
    {w:"examine",m:"\uc870\uc0ac\ud558\ub2e4, \uac80\ud1a0\ud558\ub2e4",def:"to look at it carefully",unit:27,opts:["tour", "actually", "spider", "examine"]},
    {w:"trip",m:"\uc5ec\ud589",def:"a journey to a certain place",unit:27,opts:["trip", "false", "journey", "coast"]},
    {w:"coast",m:"\ud574\uc548 (\uc9c0\ubc29)",def:"the land by an ocean",unit:27,opts:["false", "effective", "actually", "coast"]},
    {w:"imagine",m:"\uc0c1\uc0c1\ud558\ub2e4, (\ub9c8\uc74c\uc18d\uc73c\ub85c) \uadf8\ub9ac\ub2e4",def:"to think of it in your mind",unit:27,opts:["false", "coast", "examine", "imagine"]},
    {w:"desert",m:"\uc0ac\ub9c9",def:"an area of land without many plants or water",unit:27,opts:["desert", "examine", "actually", "tour"]},
    {w:"effective",m:"\ud6a8\uacfc\uc801\uc778",def:"it works well",unit:27,opts:["effective", "gift", "spider", "imagine"]},
    {w:"actually",m:"\uc2e4\uc81c\ub85c, \uc815\ub9d0\ub85c, \uc2e4\uc9c0\ub85c",def:"in fact or really",unit:27,opts:["effective", "actually", "trip", "spider"]},
    {w:"journey",m:"(\ud2b9\ud788 \uba40\ub9ac \uac00\ub294) \uc5ec\ud589",def:"a long trip",unit:27,opts:["imagine", "journey", "false", "actually"]},
    {w:"specific",m:"\uad6c\uccb4\uc801\uc778, \uba85\ud655\ud55c, \ubd84\uba85\ud55c",def:"it is precise or exact",unit:27,opts:["examine", "trip", "specific", "puzzle"]},
    {w:"puzzle",m:"\ud37c\uc990, (\uba38\ub9ac\ub97c \uc368\uc11c) \uc54c\uc544\ub9de\ud788\uae30, \uc218\uc218\uaed8\ub07c",def:"something that is hard to understand",unit:27,opts:["spider", "puzzle", "journey", "actually"]},
    {w:"tour",m:"(\uc5ec\ub7ec \ub3c4\uc2dc\uad6d\uac00 \ub4f1\uc744 \ubc29\ubb38\ud558\ub294) \uc5ec\ud589",def:"a short trip in which you see many sights",unit:27,opts:["gift", "tour", "false", "effective"]},
  ],
  "eew1_28": [
    {w:"own",m:"\uc18c\uc720\ud558\ub2e4",def:"to have it",unit:28,opts:["share", "message", "own", "notice"]},
    {w:"predict",m:"\uc608\uce21\ud558\ub2e4",def:"to say that it will happen",unit:28,opts:["predict", "boring", "own", "magic"]},
    {w:"schedule",m:"(\uc791\uc5c5) \uc77c\uc815, \uc2a4\ucf00\uc904",def:"a plan that tells you when to do things",unit:28,opts:["within", "boring", "schedule", "notice"]},
    {w:"barely",m:"\uac04\uc2e0\ud788, \uac00\uae4c\uc2a4\ub85c, \ube60\ub4ef\ud558\uac8c",def:"by the smallest amount, almost not",unit:28,opts:["predict", "barely", "band", "professor"]},
    {w:"within",m:"\uc548\uc5d0",def:"to say that something is inside another thing",unit:28,opts:["boring", "message", "within", "schedule"]},
    {w:"magic",m:"\ub9c8\ubc95, \ub9c8\uc220, \ub3c4\uc220",def:"the power to do impossible things",unit:28,opts:["predict", "band", "within", "magic"]},
    {w:"message",m:"\uba54\uc2dc\uc9c0",def:"a set of words that you send to someone",unit:28,opts:["message", "magic", "notice", "band"]},
    {w:"notice",m:"~\uc744 \uc758\uc2dd\ud558\ub2e4, \uc8fc\ubaa9\ud558\ub2e4",def:"to see it for the first time",unit:28,opts:["notice", "barely", "message", "band"]},
    {w:"professor",m:"(\ub300\ud559\uc5d0\uc11c \ud559\uc0dd\ub4e4\uc744 \uac00\ub974\uce58\ub294) \uad50\uc218",def:"a person who teaches in college",unit:28,opts:["professor", "storm", "notice", "schedule"]},
    {w:"share",m:"(\ubb34\uc5c7\uc744 \ub2e4\ub978 \uc0ac\ub78c\uacfc) \ud568\uaed8 \uc4f0\ub2e4, \uacf5\uc720\ud558\ub2e4",def:"to give some of it to another person",unit:28,opts:["schedule", "share", "message", "predict"]},
    {w:"boring",m:"\uc7ac\ubbf8\uc5c6\ub294, \uc9c0\ub8e8\ud55c",def:"not fun",unit:28,opts:["message", "boring", "schedule", "within"]},
    {w:"band",m:"(\uac00\uc218\ub97c \uc911\uc2ec\uc73c\ub85c \ud55c \uc18c\uaddc\ubaa8 \ub300\uc911\uc74c\uc545) \ubc34\ub4dc",def:"a group of people who play music",unit:28,opts:["barely", "own", "band", "notice"]},
    {w:"storm",m:"\ud3ed\ud48d, \ud3ed\ud48d\uc6b0",def:"a lot of rain or snow",unit:28,opts:["schedule", "magic", "share", "storm"]},
  ],
  "eew1_29": [
    {w:"craft",m:"\uacf5\ub4e4\uc5ec \ub9cc\ub4e4\ub2e4, \uacf5\uc608\ud488\uc744 \ub9cc\ub4e4\ub2e4",def:"to make it using skill",unit:29,opts:["craft", "lead", "merge", "sociable"]},
    {w:"dive",m:"\uc7a0\uc218\ud558\ub2e4, \ub2e4\uc774\ube59\ud558\ub2e4",def:"you go down head first into the water",unit:29,opts:["merge", "dive", "craft", "lead"]},
    {w:"talkative",m:"\ub9d0\ud558\uae30\ub97c \uc88b\uc544\ud558\ub294, \uc218\ub2e4\uc2a4\ub7ec\uc6b4",def:"he or she talks a lot",unit:29,opts:["sociable", "settle", "craft", "talkative"]},
    {w:"meeting",m:"\ud68c\uc758",def:"you are with other people",unit:29,opts:["lead", "meeting", "talkative", "dive"]},
    {w:"burden",m:"\ubd80\ub2f4, \uc9d0",def:"a serious or difficult responsibility",unit:29,opts:["usual", "burden", "sociable", "dive"]},
    {w:"usual",m:"\ud754\ud788 \ud558\ub294, \ud3c9\uc0c1\uc2dc\uc758, \ubcf4\ud1b5\uc758",def:"it is what we expect",unit:29,opts:["dive", "usual", "meeting", "settle"]},
    {w:"merge",m:"\ud569\ubcd1\ud558\ub2e4, \ubcd1\ud569\ud558\ub2e4",def:"to combine them into one whole thing",unit:29,opts:["merge", "speed", "meeting", "settle"]},
    {w:"lead",m:"(\uc55e\uc7a5\uc11c\uc11c) \uc548\ub0b4\ud558\ub2e4",def:"you go first and it follows you",unit:29,opts:["lead", "speed", "sociable", "craft"]},
    {w:"sociable",m:"\uc0ac\ub78c\ub4e4\uacfc \uc5b4\uc6b8\ub9ac\uae30 \uc88b\uc544\ud558\ub294, \uc0ac\uad50\uc801\uc778",def:"they are friendly",unit:29,opts:["settle", "talkative", "burden", "sociable"]},
    {w:"speed",m:"\ube68\ub9ac\uac00\ub2e4",def:"you go very fast",unit:29,opts:["settle", "usual", "burden", "speed"]},
    {w:"settle",m:"\ud574\uacb0\ud558\ub2e4, \ub05d\ub0b4\ub2e4, \uacb0\uc815\ud558\ub2e4",def:"you reach an agreement",unit:29,opts:["speed", "sociable", "settle", "merge"]},
  ],
  "eew1_30": [
    {w:"proper",m:"\uc801\uc808\ud55c, \uc81c\ub300\ub85c \ub41c",def:"it is right",unit:30,opts:["proper", "cost", "amount", "center"]},
    {w:"honesty",m:"\uc815\uc9c1(\uc131), \uc194\uc9c1\ud568",def:"the quality of being truthful or honest",unit:30,opts:["amount", "cost", "honesty", "ahead"]},
    {w:"inside",m:"\uc548\ucabd \uba74, \uc18d, \ub0b4\ubd80",def:"the inner part, space or side of something",unit:30,opts:["inside", "amount", "demonstrate", "sale"]},
    {w:"demonstrate",m:"\uc124\uba85\ud558\ub2e4, \ubcf4\uc5ec\uc8fc\ub2e4",def:"to show how it is done",unit:30,opts:["amount", "demonstrate", "memory", "common"]},
    {w:"master",m:"\uba85\uc778, \ub300\uac00",def:"a person who is very good at something",unit:30,opts:["master", "above", "jail", "sale"]},
    {w:"independent",m:"\ub3c5\ub9bd\uc801\uc778",def:"it is not controlled by something else",unit:30,opts:["independent", "jail", "ahead", "above"]},
    {w:"memory",m:"\uae30\uc5b5(\ub825)",def:"something you remember",unit:30,opts:["memory", "master", "sale", "jail"]},
    {w:"above",m:"(\uc704\uce58\ub098 \uc9c0\uc704 \uba74\uc5d0\uc11c) ~\ubcf4\ub2e4 \uc704\uc5d0",def:"it is at a higher level than something else",unit:30,opts:["above", "master", "center", "inside"]},
    {w:"sale",m:"\ud310\ub9e4",def:"you can buy it",unit:30,opts:["common", "master", "sale", "independent"]},
    {w:"center",m:"\uc911\uc559, \ud55c\uac00\uc6b4\ub370",def:"the middle of it",unit:30,opts:["jail", "amount", "center", "ahead"]},
    {w:"cost",m:"\ube44\uc6a9\uc774 ~\uc774\ub2e4",def:"to require payment",unit:30,opts:["master", "independent", "cost", "amount"]},
    {w:"jail",m:"\uad50\ub3c4\uc18c, \uac10\uc625",def:"a place to keep bad people",unit:30,opts:["jail", "amount", "ahead", "above"]},
    {w:"ahead",m:"\uc55e\uc11c, \uc55e\uc5d0",def:"it is in front of it",unit:30,opts:["ahead", "sale", "memory", "master"]},
    {w:"amount",m:"\ucd1d\uc561, \uc591, \uc561\uc218",def:"how much there is of something",unit:30,opts:["memory", "cost", "ahead", "amount"]},
    {w:"common",m:"\ud754\ud55c",def:"it happens often or there is much of it",unit:30,opts:["master", "amount", "ahead", "common"]},
  ],
  "eew2_1": [
    {w:"garden",m:"\uc815\uc6d0",def:"an area where people grow plants",unit:1,opts:["garden", "place", "total", "holiday"]},
    {w:"holiday",m:"\uacf5\ud734\uc77c, \uba85\uc808",def:"a special day of celebration",unit:1,opts:["total", "such", "holiday", "popular"]},
    {w:"expensive",m:"\ube44\uc2fc",def:"cost a lot of money",unit:1,opts:["flower", "tower", "expensive", "garden"]},
    {w:"popular",m:"\uc778\uae30 \ub9ce\uc740",def:"liked by many people",unit:1,opts:["flower", "train", "popular", "garden"]},
    {w:"world",m:"\uc138\uacc4, \uc138\uc0c1",def:"the Earth and all the people and things in it",unit:1,opts:["world", "expensive", "place", "total"]},
    {w:"tower",m:"\ud0d1",def:"a tall, narrow building",unit:1,opts:["mountain", "million", "holiday", "tower"]},
    {w:"mountain",m:"\uc0b0",def:"a very high hill",unit:1,opts:["many", "mountain", "place", "such"]},
    {w:"million",m:"100\ub9cc\uc758",def:"to write the number 1,000,000",unit:1,opts:["train", "million", "flower", "such"]},
    {w:"flower",m:"\uaf43",def:"the colored part of a plant",unit:1,opts:["train", "flower", "such", "mountain"]},
    {w:"because",m:"\uc65c\ub0d0\ud558\uba74",def:"introduces a reason for something",unit:1,opts:["east", "many", "because", "train"]},
    {w:"many",m:"(\uc218\ub7c9\uc774) \ub9ce\uc740",def:"there is a large number of something",unit:1,opts:["such", "flower", "mountain", "many"]},
    {w:"train",m:"\uae30\ucc28, \uc5f4\ucc28",def:"a group of railway cars connected together",unit:1,opts:["train", "place", "expensive", "east"]},
    {w:"such",m:"~\uc640 \uac19\uc740, \uadf8\ub7ec\ud55c",def:"like this",unit:1,opts:["popular", "such", "million", "east"]},
    {w:"total",m:"\ucd1d\ud569, \uc804\uccb4",def:"everyone or everything has been counted",unit:1,opts:["many", "east", "total", "popular"]},
    {w:"east",m:"\ub3d9\ucabd",def:"the direction the sun rises from",unit:1,opts:["place", "because", "east", "such"]},
    {w:"place",m:"\uc7a5\uc18c, \uc704\uce58",def:"a space or area",unit:1,opts:["place", "many", "train", "popular"]},
  ],
  "eew2_2": [
    {w:"lift",m:"\ub4e4\uc5b4 \uc62c\ub9ac\ub2e4",def:"to move it higher",unit:2,opts:["lift", "eager", "seek", "load"]},
    {w:"consist",m:"\uad6c\uc131\ub418\ub2e4",def:"to be made of parts or things them",unit:2,opts:["intent", "consist", "lift", "awful"]},
    {w:"possess",m:"\uac00\uc9c0\ub2e4, \uc18c\uc720\ud558\ub2e4",def:"to have it or own it",unit:2,opts:["awful", "possess", "intent", "household"]},
    {w:"awful",m:"\ub054\ucc0d\ud55c",def:"very bad",unit:2,opts:["anxious", "awful", "remark", "desire"]},
    {w:"rapidly",m:"\ube60\ub974\uac8c",def:"happening very fast",unit:2,opts:["rapidly", "shine", "seek", "anxious"]},
    {w:"desire",m:"\ubc14\ub77c\ub2e4, \uc6d0\ud558\ub2e4",def:"to want something",unit:2,opts:["anxious", "seek", "desire", "rapidly"]},
    {w:"load",m:"\uc2e3\ub2e4",def:"to put objects into something",unit:2,opts:["possess", "load", "remark", "anxious"]},
    {w:"anxious",m:"\ubd88\uc548\ud55c, \uac71\uc815\uc2a4\ub7ec\uc6b4",def:"feeling worried or nervous",unit:2,opts:["shine", "possess", "eager", "anxious"]},
    {w:"remark",m:"\uc5b8\uae09\ud558\ub2e4, \ub9d0\ud558\ub2e4",def:"to say something",unit:2,opts:["awful", "remark", "anxious", "intent"]},
    {w:"landscape",m:"\ud48d\uacbd",def:"how an area of land looks",unit:2,opts:["load", "landscape", "intent", "seek"]},
    {w:"shine",m:"\ube5b\ub098\ub2e4",def:"to make a bright light",unit:2,opts:["possess", "polite", "eager", "shine"]},
    {w:"pace",m:"\uc18d\ub3c4",def:"the speed at which it happens",unit:2,opts:["desire", "pace", "anxious", "load"]},
    {w:"intent",m:"\uc758\ub3c4",def:"a plan to do something",unit:2,opts:["anxious", "remark", "rapidly", "intent"]},
    {w:"eager",m:"\uc5f4\uc2ec\uc778, \uc5f4\ub82c\ud55c",def:"shows excitement about something",unit:2,opts:["eager", "intent", "possess", "landscape"]},
    {w:"household",m:"\uac00\uad6c, \uc138\ub300, \uac00\uc815",def:"all the people who live in one house",unit:2,opts:["pace", "remark", "household", "motion"]},
    {w:"polite",m:"\uc608\uc758 \ubc14\ub978",def:"a thoughtful and kind behavior",unit:2,opts:["awful", "remark", "landscape", "polite"]},
    {w:"seek",m:"\ucc3e\ub2e4, \uad6c\ud558\ub2e4",def:"to look for something",unit:2,opts:["household", "eager", "polite", "seek"]},
    {w:"motion",m:"\uc6c0\uc9c1\uc784",def:"a movement that someone makes",unit:2,opts:["pace", "motion", "awful", "landscape"]},
  ],
  "eew2_3": [
    {w:"brave",m:"\uc6a9\uac10\ud55c",def:"not afraid to face pain or danger",unit:3,opts:["secure", "brave", "arrow", "military"]},
    {w:"entrance",m:"\uc785\uad6c, \ubb38",def:"a place where someone can enter an area",unit:3,opts:["unless", "weapon", "entrance", "chief"]},
    {w:"battle",m:"\uc804\ud22c",def:"a fight between two armies during a war",unit:3,opts:["intend", "secure", "log", "battle"]},
    {w:"secure",m:"\uc5bb\uc5b4 \ub0b4\ub2e4",def:"to get it after a lot of effort",unit:3,opts:["weapon", "battle", "secure", "obey"]},
    {w:"hardly",m:"\uac70\uc758 ~\uc544\ub2c8\ub2e4",def:"something happens in a very small way",unit:3,opts:["entrance", "hardly", "twist", "arrow"]},
    {w:"unless",m:"~\ud558\uc9c0 \uc54a\ub294 \ud55c",def:"if not or except when.",unit:3,opts:["unless", "twist", "log", "battle"]},
    {w:"log",m:"\ud1b5\ub098\ubb34",def:"a thick piece of wood that is cut from a tree",unit:3,opts:["intend", "log", "hardly", "battle"]},
    {w:"intend",m:"\uc758\ub3c4\ud558\ub2e4",def:"to plan to do it",unit:3,opts:["log", "intend", "arrow", "military"]},
    {w:"military",m:"\uad70\ub300",def:"the armed forces of a country",unit:3,opts:["arrow", "chief", "military", "twist"]},
    {w:"chief",m:"\uc6b0\ub450\uba38\ub9ac, \uc7a5",def:"the leader of a group of people",unit:3,opts:["chief", "military", "log", "intend"]},
    {w:"weapon",m:"\ubb34\uae30",def:"an object used to hurt people",unit:3,opts:["twist", "battle", "weapon", "entrance"]},
    {w:"obey",m:"\uc2dc\ud0a4\ub294 \ub300\ub85c \ud558\ub2e4",def:"to follow what a law or a person says to do",unit:3,opts:["obey", "secure", "chief", "brave"]},
    {w:"twist",m:"(~\uc758 \uc8fc\uc704\uc5d0) \uac10\ub2e4",def:"turn it around and around",unit:3,opts:["military", "arrow", "twist", "weapon"]},
    {w:"arrow",m:"\ud654\uc0b4",def:"a thin, straight stick shot from a bow",unit:3,opts:["arrow", "entrance", "obey", "brave"]},
  ],
  "eew2_4": [
    {w:"narrow",m:"\uc881\uc740",def:"thin, not wide",unit:4,opts:["sensitive", "narrow", "victim", "impress"]},
    {w:"victim",m:"\ud53c\ud574\uc790",def:"a person who is hurt by a bad action",unit:4,opts:["victim", "confidence", "honor", "impress"]},
    {w:"consequence",m:"\uacb0\uacfc",def:"a result of a choice or action",unit:4,opts:["consequence", "victim", "impress", "honor"]},
    {w:"terror",m:"\ub450\ub824\uc6c0",def:"a feeling of very strong fear",unit:4,opts:["pale", "honor", "terror", "impress"]},
    {w:"pale",m:"\ucc3d\ubc31\ud55c",def:"a color or thing is not bright",unit:4,opts:["impress", "strength", "supplement", "pale"]},
    {w:"impress",m:"\uae4a\uc740 \uc778\uc0c1\uc744 \uc8fc\ub2e4, \uac10\uba85\uc744 \uc8fc\ub2e4",def:"to make that person proud or amazed",unit:4,opts:["disturb", "honor", "impress", "sensitive"]},
    {w:"confidence",m:"\uc2e0\ub8b0, \uc790\uc2e0\uac10",def:"a feeling of certainty or ability",unit:4,opts:["supplement", "disaster", "disturb", "confidence"]},
    {w:"sensitive",m:"\uc608\ubbfc\ud55c",def:"easily hurt",unit:4,opts:["terror", "sensitive", "pale", "disaster"]},
    {w:"strength",m:"\ud798",def:"the ability to do hard work or exercise",unit:4,opts:["supplement", "honor", "strength", "sensitive"]},
    {w:"disturb",m:"\ubc29\ud574\ud558\ub2e4",def:"to upset that person",unit:4,opts:["honor", "narrow", "disturb", "terror"]},
    {w:"threat",m:"\uc704\ud611",def:"something bad that might happen",unit:4,opts:["impress", "strength", "disaster", "threat"]},
    {w:"honor",m:"\uc874\uacbd\ud558\ub2e4",def:"to show respect for someone or something",unit:4,opts:["disaster", "victim", "honor", "narrow"]},
    {w:"supplement",m:"\ubcf4\ucda9\ud558\ub2e4",def:"to add something else to it in a good way",unit:4,opts:["consequence", "supplement", "disaster", "threat"]},
    {w:"estimate",m:"\ucd94\uc815\ud558\ub2e4",def:"to make a guess about it",unit:4,opts:["honor", "narrow", "confidence", "estimate"]},
    {w:"disaster",m:"\ucc38\uc0ac, \uc7ac\ub09c",def:"a really bad thing that happens",unit:4,opts:["disaster", "pale", "confidence", "strength"]},
  ],
  "eew2_5": [
    {w:"border",m:"\uac00\uc7a5\uc790\ub9ac",def:"the edge of an area",unit:5,opts:["border", "pure", "surround", "incredible"]},
    {w:"wrap",m:"\ud3ec\uc7a5\ud558\ub2e4, \uac10\uc2f8\ub2e4",def:"to cover something on all sides",unit:5,opts:["incredible", "pure", "thick", "wrap"]},
    {w:"relative",m:"\uce5c\ucc99",def:"a family member",unit:5,opts:["sink", "relative", "congratulate", "surround"]},
    {w:"congratulate",m:"\ucd95\ud558\ud558\ub2e4",def:"to tell them that you are happy for them",unit:5,opts:["silent", "congratulate", "legend", "relative"]},
    {w:"legend",m:"\uc804\uc124",def:"a story from the past",unit:5,opts:["legend", "incredible", "thick", "surround"]},
    {w:"praise",m:"\uce6d\ucc2c\ud558\ub2e4",def:"to show that you like someone or something",unit:5,opts:["silent", "praise", "ancestor", "thick"]},
    {w:"silent",m:"\uc870\uc6a9\ud55c",def:"makes no sound",unit:5,opts:["silent", "incredible", "ancestor", "thick"]},
    {w:"senior",m:"\uc5f0\uc0c1\uc778, \uc190\uc704\uc778",def:"older or more experienced",unit:5,opts:["senior", "silent", "pure", "surround"]},
    {w:"superior",m:"\uc6b0\uc218\ud55c",def:"better than another",unit:5,opts:["superior", "sink", "legend", "relative"]},
    {w:"surround",m:"\ub458\ub7ec\uc2f8\ub2e4",def:"to close in on it from all sides",unit:5,opts:["silent", "surround", "legend", "congratulate"]},
    {w:"ancestor",m:"\uc870\uc0c1",def:"a family member from the past",unit:5,opts:["ancestor", "praise", "frame", "surround"]},
    {w:"sink",m:"\uce68\ubab0\ud558\ub2e4, \uac00\ub77c\uc549\ub2e4",def:"to slowly fall into it",unit:5,opts:["legend", "sink", "ancestor", "praise"]},
    {w:"thick",m:"\ub450\uaebc\uc6b4",def:"wide and solid",unit:5,opts:["praise", "sink", "thick", "congratulate"]},
    {w:"frame",m:"\uc561\uc790",def:"a border for a picture or mirror",unit:5,opts:["frame", "border", "ancestor", "silent"]},
    {w:"incredible",m:"\ubbff\uc744 \uc218 \uc5c6\ub294",def:"so amazing that it is hard to believe",unit:5,opts:["incredible", "congratulate", "border", "thick"]},
    {w:"pure",m:"\uc21c\uc218\ud55c, \uae68\ub057\ud55c",def:"very clear and beautiful",unit:5,opts:["sink", "relative", "pure", "wrap"]},
  ],
  "eew2_6": [
    {w:"automatically",m:"\uc790\ub3d9\uc801\uc73c\ub85c",def:"it happens without thinking or planning",unit:6,opts:["automatically", "relax", "also", "quiet"]},
    {w:"relax",m:"\ud734\uc2dd\uc744 \ucde8\ud558\ub2e4",def:"to rest or do something enjoyable",unit:6,opts:["feel", "close", "work", "relax"]},
    {w:"listen",m:"\ub4e3\ub2e4",def:"to pay attention to a sound that you can hear",unit:6,opts:["feel", "busy", "listen", "also"]},
    {w:"discuss",m:"\ub17c\uc758\ud558\ub2e4, \ud1a0\ub860\ud558\ub2e4",def:"to talk about something with another person",unit:6,opts:["normal", "automatically", "discuss", "relax"]},
    {w:"work",m:"\uc77c\ud558\ub2e4",def:"to do a job that you get paid for",unit:6,opts:["work", "busy", "feel", "clear"]},
    {w:"quiet",m:"\uc870\uc6a9\ud55c",def:"not make much sound",unit:6,opts:["busy", "quiet", "also", "work"]},
    {w:"normal",m:"\uc77c\ubc18\uc801\uc778",def:"usual and not strange",unit:6,opts:["quiet", "automatically", "normal", "discuss"]},
    {w:"close",m:"\ub2eb\ub2e4",def:"to shut something or cover up an opening",unit:6,opts:["discuss", "close", "normal", "busy"]},
    {w:"busy",m:"\ubc14\uc05c",def:"a lot of things to do",unit:6,opts:["also", "quiet", "close", "busy"]},
    {w:"also",m:"\ub610\ud55c",def:"in addition to or too",unit:6,opts:["busy", "relax", "close", "also"]},
    {w:"clear",m:"\uce58\uc6b0\ub2e4",def:"to remove everything from a place",unit:6,opts:["feel", "automatically", "clear", "work"]},
    {w:"feel",m:"\ub290\ub07c\ub2e4",def:"to experience an emotion or feeling",unit:6,opts:["feel", "work", "busy", "close"]},
  ],
  "eew2_7": [
    {w:"factual",m:"\uc0ac\uc2e4\uc758",def:"to Include true details",unit:7,opts:["colleague", "route", "occupation", "factual"]},
    {w:"basis",m:"\uae30\uc900",def:"the main part of amount of it",unit:7,opts:["basis", "biology", "occupation", "ruins"]},
    {w:"route",m:"\uae38",def:"the way you go from one place to another",unit:7,opts:["mission", "fascinate", "biology", "route"]},
    {w:"fascinate",m:"\ub9c8\uc74c\uc744 \uc0ac\ub85c\uc7a1\ub2e4, \ub9e4\ud639\ud558\ub2e4",def:"to make that person very interested",unit:7,opts:["fascinate", "route", "colleague", "depress"]},
    {w:"significant",m:"\uc911\ub300\ud55c, \uc0c1\ub2f9\ud55c, \uc758\ubbf8 \uc788\ub294",def:"important",unit:7,opts:["biology", "ruins", "persuade", "significant"]},
    {w:"biology",m:"\uc0dd\ubb3c\ud559",def:"the study of living things",unit:7,opts:["biology", "occupation", "factual", "basis"]},
    {w:"ruins",m:"\ud3d0\ud5c8, \uc720\uc801",def:"old buildings that are not used anymore",unit:7,opts:["basis", "ruins", "significant", "fascinate"]},
    {w:"occupation",m:"\uc9c1\uc5c5",def:"a person\u2019s job",unit:7,opts:["colony", "mission", "biology", "occupation"]},
    {w:"persuade",m:"\uc124\ub4dd\ud558\ub2e4, \ub0a9\ub4dd\uc2dc\ud0a4\ub2e4",def:"to make that person agree to do something",unit:7,opts:["fascinate", "route", "colleague", "persuade"]},
    {w:"depress",m:"\uc6b0\uc6b8\ud558\uac8c \ud558\ub2e4",def:"to make that person sad",unit:7,opts:["depress", "basis", "significant", "colony"]},
    {w:"mission",m:"\uc784\ubb34",def:"an important job that is sometimes far away",unit:7,opts:["occupation", "mission", "basis", "significant"]},
    {w:"colleague",m:"\ub3d9\ub8cc",def:"somebody you work with",unit:7,opts:["colleague", "ruins", "persuade", "factual"]},
    {w:"colony",m:"\uc2dd\ubbfc\uc9c0",def:"a country controlled by another country",unit:7,opts:["colony", "depress", "route", "mission"]},
  ],
  "eew2_8": [
    {w:"broad",m:"\ud3ed\uc774 \ub113\uc740",def:"something is wide, not narrow",unit:8,opts:["broad", "edge", "cheat", "convey"]},
    {w:"considerable",m:"\uc0c1\ub2f9\ud55c",def:"large in size, amount, or extent",unit:8,opts:["capable", "succeed", "concentrate", "considerable"]},
    {w:"instructions",m:"\uc9c0\uc2dc, \uad50\uc721",def:"how to do something",unit:8,opts:["capable", "cheat", "instructions", "broad"]},
    {w:"cheat",m:"\uc18d\uc774\ub2e4, \uae30\ub9cc\ud558\ub2e4, \uc0ac\uae30\uce58\ub2e4",def:"to be dishonest in order to win or do well",unit:8,opts:["capable", "confident", "cheat", "considerable"]},
    {w:"suspect",m:"\uc758\uc2ec\ud558\ub2e4",def:"to believe that it might be true",unit:8,opts:["edge", "suspect", "resort", "convey"]},
    {w:"succeed",m:"\uc131\uacf5\ud558\ub2e4, \uc131\ucde8\ud558\ub2e4",def:"to complete something as planned",unit:8,opts:["cheat", "bush", "considerable", "succeed"]},
    {w:"confident",m:"\ud655\uc2e0\ud558\ub294, \uc790\uc2e0 \uc788\ub294",def:"they can do something without failing",unit:8,opts:["broad", "confident", "suspect", "resort"]},
    {w:"resort",m:"\uc758\uc9c0\ud558\ub2e4",def:"to depend on it in order to solve a problem",unit:8,opts:["instructions", "broad", "resort", "convey"]},
    {w:"bush",m:"\uad00\ubaa9",def:"a woody plant that is smaller than a tree",unit:8,opts:["resort", "instructions", "concentrate", "bush"]},
    {w:"edge",m:"\uac00\uc7a5\uc790\ub9ac, \ub05d",def:"the furthest part or side of something",unit:8,opts:["convey", "cheat", "edge", "concentrate"]},
    {w:"concentrate",m:"\uc9d1\uc911\ud558\ub2e4",def:"to give one\u2019s full attention to something",unit:8,opts:["considerable", "convey", "concentrate", "broad"]},
    {w:"capable",m:"~\uc744 \ud560 \uc218 \uc788\ub294",def:"can do an action",unit:8,opts:["resort", "capable", "confident", "broad"]},
    {w:"convey",m:"\uc804\ub2ec\ud558\ub2e4, \ub098\ud0c0\ub0b4\ub2e4",def:"to communicate or make ideas known",unit:8,opts:["succeed", "broad", "confident", "convey"]},
  ],
  "eew2_9": [
    {w:"rock",m:"\ubc14\uc704",def:"a hard thing in the dirt",unit:9,opts:["pleasant", "perhaps", "taste", "rock"]},
    {w:"against",m:"\uae30\ub300\uc5b4\uc11c, ~\uc5d0 \ubc18\ub300\ud558\uc5ec",def:"touching something or opposed to somthing",unit:9,opts:["island", "against", "taste", "step"]},
    {w:"discover",m:"\ubc1c\uacac\ud558\ub2e4",def:"to find it for the first time",unit:9,opts:["step", "discover", "damage", "beach"]},
    {w:"fix",m:"\uace0\uce58\ub2e4",def:"to make it work",unit:9,opts:["save", "discover", "fix", "smile"]},
    {w:"pleasant",m:"\uc990\uac70\uc6b4",def:"you enjoy it",unit:9,opts:["island", "perhaps", "pleasant", "prevent"]},
    {w:"ocean",m:"\ubc14\ub2e4",def:"the salt water that surrounds land",unit:9,opts:["step", "prevent", "ocean", "pleasant"]},
    {w:"emotion",m:"\uac10\uc815",def:"how you feel",unit:9,opts:["emotion", "prevent", "save", "beach"]},
    {w:"prevent",m:"\ub9c9\ub2e4",def:"to stop it from happening",unit:9,opts:["pleasant", "damage", "prevent", "step"]},
    {w:"smile",m:"\uc6c3\ub2e4, \ubbf8\uc18c \uc9d3\ub2e4",def:"to show happiness with your mouth",unit:9,opts:["prevent", "discover", "smile", "damage"]},
    {w:"save",m:"\uad6c\ud558\ub2e4",def:"to keep it from being hurt",unit:9,opts:["pleasant", "save", "ocean", "smile"]},
    {w:"step",m:"\uac78\uc74c\uc744 \uc6ba\uae30\ub2e4",def:"to walk",unit:9,opts:["pleasant", "step", "ocean", "discover"]},
    {w:"beach",m:"\ud574\ubcc0",def:"a sandy or rocky place by the ocean",unit:9,opts:["identify", "against", "smile", "beach"]},
    {w:"island",m:"\uc12c",def:"land in the middle of water",unit:9,opts:["beach", "island", "pleasant", "damage"]},
    {w:"perhaps",m:"\uc544\ub9c8\ub3c4",def:"when you say that something could happen",unit:9,opts:["identify", "step", "perhaps", "discover"]},
    {w:"identify",m:"\ud655\uc778\ud558\ub2e4",def:"to find out what it is",unit:9,opts:["taste", "identify", "fix", "ocean"]},
    {w:"taste",m:"\ub9db",def:"the flavor something makes in your mouth",unit:9,opts:["against", "taste", "island", "save"]},
    {w:"damage",m:"\ud53c\ud574\ub97c \uc785\ud788\ub2e4",def:"to break it",unit:9,opts:["rock", "smile", "damage", "discover"]},
  ],
  "eew2_10": [
    {w:"council",m:"\ud611\uc758\ud68c",def:"a group of people who run a city or town",unit:10,opts:["violent", "council", "declare", "sword"]},
    {w:"giant",m:"\uc5c4\uccad\ub098\uac8c \ud070",def:"very big",unit:10,opts:["resist", "declare", "reveal", "giant"]},
    {w:"reveal",m:"\ub4dc\ub7ec\ub0b4\ub2e4",def:"to show something",unit:10,opts:["resist", "reveal", "intention", "violent"]},
    {w:"tale",m:"\uc774\uc57c\uae30",def:"a story",unit:10,opts:["citizen", "tale", "reveal", "mad"]},
    {w:"resist",m:"\uc800\ud56d\ud558\ub2e4, \ubc18\ub300\ud558\ub2e4",def:"to fight against it",unit:10,opts:["sword", "intention", "reveal", "resist"]},
    {w:"intention",m:"\uc758\ub3c4",def:"what a person plans to do",unit:10,opts:["mad", "intention", "sword", "giant"]},
    {w:"sword",m:"\uac80, \uce7c",def:"a long sharp weapon",unit:10,opts:["council", "giant", "sword", "reveal"]},
    {w:"mad",m:"\ud654\ub09c",def:"angry",unit:10,opts:["mad", "sword", "reveal", "citizen"]},
    {w:"violent",m:"\ud3ed\ub825\uc801\uc778, \uadf9\ub82c\ud55c",def:"to use force to hurt others",unit:10,opts:["council", "violent", "resist", "sword"]},
    {w:"declare",m:"\uc120\uc5b8\ud558\ub2e4",def:"to say something officially",unit:10,opts:["declare", "sword", "violent", "intention"]},
    {w:"citizen",m:"\uad6d\ubbfc, \uc2dc\ubbfc",def:"someone who lives in a certain place",unit:10,opts:["council", "mad", "citizen", "reveal"]},
  ],
  "eew2_11": [
    {w:"gentle",m:"\uc2e0\uc0ac\uc801\uc778, \uc628\ud654\ud55c, \ubd80\ub4dc\ub7ec\uc6b4",def:"kind and calm",unit:11,opts:["super", "gentle", "geography", "genius"]},
    {w:"geography",m:"\uc9c0\ub9ac\ud559, \uc9c0\ub9ac, \uc9c0\ud615",def:"the study of the Earth, its land, weather, etc.",unit:11,opts:["geography", "admission", "super", "despite"]},
    {w:"admission",m:"\uc785\uc7a5, \uc785\ud559, \uc778\uc815, \uc2b9\uc778",def:"the act of allowing to enter a place",unit:11,opts:["wet", "despite", "principal", "admission"]},
    {w:"principal",m:"\ud559\uc7a5, \uad50\uc7a5",def:"a person in charge of a school",unit:11,opts:["wet", "geography", "shelf", "principal"]},
    {w:"shelf",m:"\uc120\ubc18",def:"a place on a wall where you put things",unit:11,opts:["geography", "admission", "shelf", "row"]},
    {w:"despite",m:"~\uc5d0\ub3c4 \ubd88\uad6c\ud558\uace0",def:"a difference from what is expected",unit:11,opts:["gentle", "despite", "principal", "shelf"]},
    {w:"astronomy",m:"\ucc9c\ubb38\ud559",def:"the study of the stars and planets",unit:11,opts:["astronomy", "admission", "despite", "gentle"]},
    {w:"wet",m:"\uc816\uc740, \uc2b5\ud55c, \ucd95\ucd95\ud55c",def:"water on it",unit:11,opts:["gentle", "wet", "spite", "geography"]},
    {w:"lightly",m:"\uac00\ubccd\uac8c, \uc0b4\uc9dd",def:"to not push very hard",unit:11,opts:["super", "lightly", "spite", "admission"]},
    {w:"spite",m:"\uc559\uc2ec, \uc545\uc758",def:"the desire to be mean",unit:11,opts:["spite", "genius", "admission", "principal"]},
    {w:"row",m:"\uc904, \uc5f4",def:"a line of things",unit:11,opts:["principal", "wet", "gentle", "row"]},
    {w:"super",m:"\ub300\ub2e8\ud55c, \uad49\uc7a5\ud55c",def:"really good",unit:11,opts:["spite", "admission", "gentle", "super"]},
    {w:"genius",m:"\ucc9c\uc7ac",def:"a very smart person",unit:11,opts:["genius", "row", "admission", "geography"]},
  ],
  "eew2_12": [
    {w:"bake",m:"\uad7d\ub2e4",def:"to cook food in an oven",unit:12,opts:["oppose", "bake", "bean", "fault"]},
    {w:"generous",m:"\uad00\ub300\ud55c, \uc778\uc2ec \uc88b\uc740",def:"a person likes to give things to people",unit:12,opts:["generous", "quantity", "ingredient", "decrease"]},
    {w:"ingredient",m:"\uc7ac\ub8cc, \uc790\ub8cc, \uc6d0\ub8cc",def:"something that is part of a food dish",unit:12,opts:["ingredient", "fault", "abuse", "convert"]},
    {w:"fault",m:"\uc798\ubabb",def:"responsibility for a mistake",unit:12,opts:["oppose", "generous", "fault", "passive"]},
    {w:"convert",m:"\uc804\ud658\ud558\ub2e4, \ubc14\uafb8\ub2e4",def:"to change it into something else",unit:12,opts:["bean", "mess", "fund", "convert"]},
    {w:"insist",m:"\uac15\ud558\uac8c \uc8fc\uc7a5\ud558\ub2e4, \uace0\uc9d1\ud558\ub2e4",def:"to be firm in telling people what to do",unit:12,opts:["insist", "quantity", "convert", "abuse"]},
    {w:"passive",m:"\uc218\ub3d9\uc801\uc778, \uc18c\uadf9\uc801\uc778",def:"not to take action to solve problems",unit:12,opts:["oppose", "convert", "passive", "monitor"]},
    {w:"fund",m:"\uae30\uae08, \uc790\uae08",def:"an amount of money that people have",unit:12,opts:["fault", "afford", "debt", "fund"]},
    {w:"decrease",m:"\uac10\uc18c\ud558\ub2e4, \uc904\uc5b4\ub4e4\ub2e4",def:"to make it less than it was before",unit:12,opts:["decrease", "afford", "bean", "monitor"]},
    {w:"debt",m:"\ube5a",def:"an amount of money that a person owes",unit:12,opts:["afford", "ingredient", "quantity", "debt"]},
    {w:"quantity",m:"\uc591",def:"a certain amount of something",unit:12,opts:["fault", "decrease", "quantity", "abuse"]},
    {w:"oppose",m:"\ubc18\ub300\ud558\ub2e4, \ub300\ud56d\ud558\ub2e4, \uc800\uc9c0\ud558\ub2e4",def:"to dislike it or act against it",unit:12,opts:["decrease", "metal", "debt", "oppose"]},
    {w:"afford",m:"(\uae08\uc804\uc801) \uc5ec\uc720\uac00 \uc788\ub2e4",def:"to have enough money to pay for it",unit:12,opts:["afford", "generous", "ingredient", "debt"]},
    {w:"metal",m:"\uae08\uc18d",def:"a strong material people use to build things",unit:12,opts:["bake", "abuse", "fund", "metal"]},
    {w:"bean",m:"\ucf69",def:"a plant seed that is good to eat",unit:12,opts:["insist", "bake", "passive", "bean"]},
    {w:"mess",m:"\ub09c\uc7a5\ud310, \uc5c9\ub9dd\uc9c4\ucc3d",def:"a condition that is not clean or neat",unit:12,opts:["fault", "generous", "mess", "fund"]},
    {w:"abuse",m:"\ub0a8\uc6a9\ud558\ub2e4, \uc624\uc6a9\ud558\ub2e4, \ud559\ub300\ud558\ub2e4",def:"to hurt someone or something on purpose",unit:12,opts:["abuse", "generous", "insist", "monitor"]},
    {w:"monitor",m:"\uac10\uc2dc\ud558\ub2e4, \uad00\ucc30\ud558\ub2e4",def:"to watch them closely",unit:12,opts:["debt", "metal", "monitor", "afford"]},
  ],
  "eew2_13": [
    {w:"adequate",m:"\ucda9\ubd84\ud55c, \uc801\uc808\ud55c",def:"good enough",unit:13,opts:["initial", "tiny", "adequate", "peak"]},
    {w:"initial",m:"\uc2dc\uc791\uc758, \ucc98\uc74c\uc758, \ucd08\uae30\uc758",def:"something is first",unit:13,opts:["lend", "anxiety", "consult", "initial"]},
    {w:"intense",m:"\uac15\ub82c\ud55c, \uadf9\uc2ec\ud55c",def:"very strong",unit:13,opts:["army", "proof", "intense", "spin"]},
    {w:"lend",m:"\ube4c\ub824\uc8fc\ub2e4",def:"to give it to someone for a short time",unit:13,opts:["tiny", "lend", "billion", "army"]},
    {w:"proof",m:"\uc99d\uac70",def:"a fact that shows something is real",unit:13,opts:["proof", "peak", "tutor", "anxiety"]},
    {w:"spin",m:"\ub3cc\ub2e4, \ud68c\uc804\ud558\ub2e4",def:"to turn around in circles",unit:13,opts:["potential", "billion", "adequate", "spin"]},
    {w:"emergency",m:"\ube44\uc0c1\uc0c1\ud0dc, \uc751\uae09\uc0c1\ud669",def:"a time when someone needs help right away",unit:13,opts:["tiny", "potential", "quit", "emergency"]},
    {w:"anxiety",m:"\uadfc\uc2ec, \uc5fc\ub824",def:"a feeling of worry and fear",unit:13,opts:["anxiety", "tutor", "tiny", "quit"]},
    {w:"billion",m:"10\uc5b5",def:"a very large number: 1,000,000,000",unit:13,opts:["billion", "peak", "adequate", "spin"]},
    {w:"peak",m:"\uc808\uc815, \uc815\uc810, \uaf2d\ub300\uae30",def:"the very top of a mountain",unit:13,opts:["peak", "lend", "billion", "proof"]},
    {w:"tutor",m:"\uac1c\uc778 \uc9c0\ub3c4 \uad50\uc0ac",def:"someone who gives lessons to one student",unit:13,opts:["carve", "tutor", "lend", "intense"]},
    {w:"potential",m:"\uc7a0\uc7ac\uc801\uc778",def:"capable of being but not yet actual or real",unit:13,opts:["emergency", "consult", "potential", "quit"]},
    {w:"consult",m:"\uc0c1\ub2f4\ud558\ub2e4",def:"to ask someone for help",unit:13,opts:["tiny", "consult", "spin", "lend"]},
    {w:"quit",m:"\uc885\ub8cc\ud558\ub2e4, \ub05d\ub0b4\ub2e4, \uadf8\ub9cc\ud558\ub2e4",def:"to stop doing it",unit:13,opts:["army", "spin", "quit", "proof"]},
    {w:"carve",m:"\uc870\uac01\ud558\ub2e4, \uae4e\ub2e4, \uc0c8\uae30\ub2e4",def:"to cut into something",unit:13,opts:["carve", "adequate", "intense", "emergency"]},
    {w:"army",m:"\uad70\ub300",def:"a large group of people who fight in wars",unit:13,opts:["adequate", "billion", "army", "initial"]},
    {w:"tiny",m:"\uc544\uc8fc \uc791\uc740",def:"very small",unit:13,opts:["proof", "consult", "potential", "tiny"]},
  ],
  "eew2_14": [
    {w:"ignore",m:"\ubb34\uc2dc\ud558\ub2e4, \ubabb\ubcf8 \ucc99\ud558\ub2e4, \ubb35\uc0b4\ud558\ub2e4",def:"to act like you do not see or hear it",unit:14,opts:["commit", "ignore", "calculate", "blind"]},
    {w:"commit",m:"\uc57d\uc18d\ud558\ub2e4",def:"to something is to promise to do it",unit:14,opts:["apparent", "obvious", "chat", "commit"]},
    {w:"apparent",m:"\uba85\ud655\ud55c, \ubd84\uba85\ud55c",def:"clear or easy to see",unit:14,opts:["compose", "apparent", "exhaust", "severe"]},
    {w:"severe",m:"\uadf9\uc2ec\ud55c, \uc2ec\uac01\ud55c",def:"very bad or serious",unit:14,opts:["ignore", "severe", "chat", "compose"]},
    {w:"blind",m:"\ub208\uba3c, \uc2dc\uac01\uc7a5\uc560\uc758, \ub9f9\uc778\uc758",def:"cannot see",unit:14,opts:["talent", "apparent", "chat", "blind"]},
    {w:"portion",m:"(\uc77c)\ubd80\ubd84",def:"a part of it",unit:14,opts:["vision", "commit", "portion", "severe"]},
    {w:"calculate",m:"\uacc4\uc0b0\ud558\ub2e4",def:"to find an answer using math",unit:14,opts:["commit", "secretary", "apparent", "calculate"]},
    {w:"chat",m:"\ub300\ud654\ud558\ub2e4, \uc7a1\ub2f4\ud558\ub2e4",def:"to talk with someone",unit:14,opts:["chat", "compose", "secretary", "commit"]},
    {w:"secretary",m:"\ube44\uc11c",def:"a person who works in an office",unit:14,opts:["secretary", "exhaust", "portion", "blind"]},
    {w:"talent",m:"\uc7ac\ub2a5, \uc7ac\uc8fc",def:"a natural ability to do something well",unit:14,opts:["obvious", "portion", "talent", "compose"]},
    {w:"exhaust",m:"\uae30\uc9c4\ub9e5\uc9c4\ud558\uac8c \ub9cc\ub4e4\ub2e4, \uace0\uac08\uc2dc\ud0a4\ub2e4",def:"to make that person tired",unit:14,opts:["exhaust", "talent", "vision", "commit"]},
    {w:"obvious",m:"\ubd84\uba85\ud55c, \uba85\ubc31\ud55c",def:"clear or easy to see",unit:14,opts:["exhaust", "severe", "obvious", "talent"]},
    {w:"vision",m:"\uc2dc\ub825, \uc2dc\uc57c",def:"the ability to see",unit:14,opts:["talent", "chat", "calculate", "vision"]},
    {w:"thesis",m:"\ub17c\uc9c0",def:"an idea that needs to be proved",unit:14,opts:["calculate", "thesis", "commit", "apparent"]},
    {w:"compose",m:"\uad6c\uc131\ud558\ub2e4",def:"to make it from smaller parts",unit:14,opts:["secretary", "compose", "chat", "ignore"]},
  ],
  "eew2_15": [
    {w:"crew",m:"\ud300, \ubb34\ub9ac, \ud06c\ub8e8",def:"a group of workers",unit:15,opts:["crew", "charitable", "absorb", "mud"]},
    {w:"flavor",m:"\ub9db, \ud48d\ubbf8",def:"the taste of food or drinks",unit:15,opts:["boss", "flavor", "mud", "generation"]},
    {w:"foundation",m:"\uc7ac\ub2e8",def:"a group that provides money for research",unit:15,opts:["generation", "dig", "foundation", "dine"]},
    {w:"contract",m:"\uacc4\uc57d\uc11c",def:"a written agreement between two people",unit:15,opts:["charitable", "contract", "foundation", "dig"]},
    {w:"mud",m:"\uc9c4\ud759",def:"soft, wet dirt",unit:15,opts:["mud", "boss", "flavor", "unique"]},
    {w:"soil",m:"\ud1a0\uc591",def:"the top layer of land on the Earth",unit:15,opts:["crew", "mud", "soil", "unique"]},
    {w:"unique",m:"\uc720\uc77c\ubb34\uc774\ud55c, \ub3c5\ud2b9\ud55c, \uace0\uc720\uc758",def:"not like others",unit:15,opts:["charitable", "generation", "unique", "absorb"]},
    {w:"dig",m:"\ub545\uc744 \ud30c\ub2e4, \ubc1c\uad74\ud558\ub2e4, \uce90\ub0b4\ub2e4",def:"to make a hole in the ground",unit:15,opts:["dine", "dig", "charitable", "contract"]},
    {w:"charitable",m:"\uc790\uc120\uc758, \uc790\uc120\uc744 \ubca0\ud478\ub294",def:"aims to help people",unit:15,opts:["contract", "dine", "charitable", "unique"]},
    {w:"absorb",m:"\ud761\uc218\ud558\ub2e4",def:"to take it inside",unit:15,opts:["absorb", "crew", "contract", "generation"]},
    {w:"generation",m:"\uc138\ub300",def:"a group of people who live at the same time",unit:15,opts:["soil", "dine", "contract", "generation"]},
    {w:"smooth",m:"\ubd80\ub4dc\ub7ec\uc6b4",def:"no bumps or rough parts",unit:15,opts:["absorb", "contract", "smooth", "generation"]},
    {w:"boss",m:"\uc0ac\uc7a5, \uc0c1\uad00",def:"a person in charge of other people at work",unit:15,opts:["mud", "absorb", "boss", "generation"]},
    {w:"dine",m:"(\uc800\ub141) \uc2dd\uc0ac\ud558\ub2e4",def:"to eat dinner",unit:15,opts:["unique", "crew", "generation", "dine"]},
  ],
  "eew2_16": [
    {w:"century",m:"\uc138\uae30",def:"one hundred years",unit:16,opts:["pound", "maybe", "century", "publish"]},
    {w:"exist",m:"\uc874\uc7ac\ud558\ub2e4, \uc788\ub2e4, \uc0b4\ub2e4, \ub098\ud0c0\ub098\ub2e4",def:"to be real",unit:16,opts:["board", "century", "pound", "exist"]},
    {w:"ancient",m:"\uace0\ub300\uc758",def:"very old",unit:16,opts:["officer", "ancient", "publish", "county"]},
    {w:"board",m:"\ud310\uc790",def:"a flat piece of wood",unit:16,opts:["board", "dictionary", "maybe", "officer"]},
    {w:"pound",m:"\uc5ec\ub7ec \ubc88 \uc138\uac8c \ub450\ub4e4\uae30\ub2e4",def:"to hit it many times with a lot of force",unit:16,opts:["ancient", "process", "officer", "pound"]},
    {w:"publish",m:"\ucd9c\ud310\ud558\ub2e4, \ubc1c\ud589\ud558\ub2e4",def:"a book is to get it printed and ready to sell",unit:16,opts:["hidden", "publish", "gentleman", "original"]},
    {w:"officer",m:"\uc7a5\uad50",def:"a leader in the army",unit:16,opts:["officer", "hidden", "publish", "process"]},
    {w:"original",m:"\uc6d0\ub798\uc758, \uc9c4\uc9dc\uc758",def:"it is the first one of that thing",unit:16,opts:["process", "original", "exist", "century"]},
    {w:"maybe",m:"\uc544\ub9c8\ub3c4",def:"something is possible or may be true",unit:16,opts:["hidden", "original", "maybe", "pound"]},
    {w:"academy",m:"\ud559\uc6d0, \ud559\uc220\uc6d0",def:"a special type of school",unit:16,opts:["academy", "wealth", "maybe", "exist"]},
    {w:"hidden",m:"\uc228\uaca8\uc9c4",def:"not easily noticed or too hard to find",unit:16,opts:["ancient", "academy", "hidden", "dictionary"]},
    {w:"county",m:"\uc790\uce58\uc8fc",def:"the largest division of a state in a country",unit:16,opts:["original", "process", "publish", "county"]},
    {w:"dictionary",m:"\uc0ac\uc804",def:"a book that tells you what words mean",unit:16,opts:["original", "publish", "dictionary", "academy"]},
    {w:"process",m:"\uacfc\uc815, \uc808\ucc28",def:"the steps to take to do something",unit:16,opts:["process", "ancient", "century", "officer"]},
    {w:"gentleman",m:"\uc2e0\uc0ac",def:"a nice man",unit:16,opts:["process", "exist", "gentleman", "century"]},
    {w:"wealth",m:"\ubd80, \uc7ac\uc0b0",def:"the total of one\u2019s possessions",unit:16,opts:["ancient", "original", "pound", "wealth"]},
  ],
  "eew2_17": [
    {w:"shift",m:"\uc774\ub3d9\ud558\ub2e4, \uc62e\uae30\ub2e4",def:"to move into a different place or direction",unit:17,opts:["shift", "carriage", "classic", "confirm"]},
    {w:"attach",m:"\ubd80\ucc29\ud558\ub2e4",def:"to put two things together",unit:17,opts:["formal", "commute", "expense", "attach"]},
    {w:"junior",m:"\uc5f0\ud558\uc758, \ud6c4\ubc30\uc758",def:"younger or less experienced",unit:17,opts:["expense", "junior", "mechanic", "height"]},
    {w:"height",m:"\ub192\uc774, \ud0a4",def:"how tall someone or something is",unit:17,opts:["commute", "shift", "labor", "height"]},
    {w:"confirm",m:"\ud655\uc778\ud558\ub2e4, \ud655\uc778\ud574\uc8fc\ub2e4",def:"to make sure something is correct",unit:17,opts:["prime", "classic", "commute", "confirm"]},
    {w:"aim",m:"\ubaa9\ud45c, \ubaa9\uc801",def:"a goal someone wants to make happen",unit:17,opts:["shift", "commute", "aim", "confirm"]},
    {w:"labor",m:"\ub178\ub3d9",def:"the act of doing or making something",unit:17,opts:["carriage", "aim", "labor", "height"]},
    {w:"classic",m:"\uace0\uc804\uc758, \uc804\ud1b5\uc801\uc778, \uc804\ud615\uc801\uc778",def:"that is common from the past",unit:17,opts:["height", "classic", "aim", "carriage"]},
    {w:"formal",m:"\uacf5\uc2dd\uc801\uc778, \uc815\uc2dd\uc758, \uaca9\uc2dd\uc788\ub294",def:"official or serious",unit:17,opts:["confirm", "formal", "mechanic", "expense"]},
    {w:"expense",m:"\ube44\uc6a9",def:"the money that people spend on something",unit:17,opts:["aim", "confirm", "formal", "expense"]},
    {w:"mechanic",m:"\uc815\ube44\uacf5, \uae30\uacc4\uacf5",def:"someone who fixes vehicles or machines",unit:17,opts:["mechanic", "carriage", "attach", "aim"]},
    {w:"prime",m:"\uc8fc\uc694\ud55c",def:"something is the most important one",unit:17,opts:["confirm", "prime", "shift", "aim"]},
    {w:"carriage",m:"\ub9c8\ucc28",def:"a vehicle pulled by a horse",unit:17,opts:["aim", "carriage", "expense", "labor"]},
    {w:"commute",m:"\ud1b5\uadfc\ud558\ub2e4",def:"to travel a long distance to get to work",unit:17,opts:["expense", "shift", "labor", "commute"]},
  ],
  "eew2_18": [
    {w:"greet",m:"\ub9de\uc774\ud558\ub2e4, \ud658\uc601\ud558\ub2e4",def:"to meet and welcome that person",unit:18,opts:["curious", "profession", "greet", "investigate"]},
    {w:"investigate",m:"\uba74\ubc00\ud788 \uc870\uc0ac\ud558\ub2e4, \uc5f0\uad6c\ud558\ub2e4",def:"to search for something or learn about it",unit:18,opts:["investigate", "odd", "faith", "greet"]},
    {w:"curious",m:"\ud638\uae30\uc2ec \ub9ce\uc740, \uad81\uae08\ud55c",def:"to want to know about something",unit:18,opts:["element", "curious", "greet", "profession"]},
    {w:"profession",m:"\uc9c1\uc5c5, \uc804\ubb38\uc9c1",def:"a person\u2019s job",unit:18,opts:["element", "profession", "cartoon", "priest"]},
    {w:"convince",m:"\uc124\ub4dd\ud558\ub2e4, \ub0a9\ub4dd\uc2dc\ud0a4\ub2e4",def:"to make that person sure of something",unit:18,opts:["cartoon", "element", "convince", "curious"]},
    {w:"odd",m:"\uc774\uc0c1\ud55c, \uae30\ubb18\ud55c",def:"unusual",unit:18,opts:["odd", "faith", "greet", "curious"]},
    {w:"ceiling",m:"\ucc9c\uc7a5",def:"the top of a room",unit:18,opts:["ceiling", "delay", "curious", "element"]},
    {w:"priest",m:"\uc2e0\ubd80",def:"a person trained to perform religious duties",unit:18,opts:["ceiling", "priest", "pause", "greet"]},
    {w:"element",m:"\uc694\uc18c, \uc131\ubd84",def:"a particular part of it",unit:18,opts:["element", "priest", "convince", "delay"]},
    {w:"delay",m:"\uc9c0\uc5f0\uc2dc\ud0a4\ub2e4, \ubbf8\ub8e8\ub2e4, \uc5f0\uae30\ud558\ub2e4",def:"to wait to do something",unit:18,opts:["profession", "convince", "cartoon", "delay"]},
    {w:"faith",m:"\uc2e0\ub150",def:"trust or belief without proof",unit:18,opts:["faith", "ceiling", "profession", "priest"]},
    {w:"cartoon",m:"\ub9cc\ud654",def:"a funny drawing",unit:18,opts:["priest", "investigate", "cartoon", "curious"]},
    {w:"pause",m:"\uc77c\uc2dc\uc815\uc9c0\ud558\ub2e4",def:"to stop doing something for a while",unit:18,opts:["convince", "faith", "pause", "odd"]},
  ],
  "eew2_19": [
    {w:"responsible",m:"~\uc5d0 \ub300\ud574 \ucc45\uc784\uc774 \uc788\ub294",def:"in charge of someone or something",unit:19,opts:["few", "responsible", "snake", "they"]},
    {w:"line",m:"\uc904, \uc120",def:"a row of people or things",unit:19,opts:["responsible", "line", "bottom", "they"]},
    {w:"bottom",m:"(\ubc11)\ubc14\ub2e5",def:"the lowest part, point, or level of something",unit:19,opts:["bottom", "line", "very", "snake"]},
    {w:"snake",m:"\ubc40",def:"an animal with a long, thin body and no legs",unit:19,opts:["few", "snake", "they", "responsible"]},
    {w:"type",m:"\uc720\ud615, \uc885\ub958",def:"a particular kind or group of things or people",unit:19,opts:["line", "few", "type", "very"]},
    {w:"few",m:"\uc801\uc740, \uc57d\uac04\uc758",def:"a small number of them",unit:19,opts:["line", "few", "very", "responsible"]},
    {w:"strange",m:"\uc774\uc0c1\ud55c",def:"unusual or surprising",unit:19,opts:["responsible", "strange", "very", "they"]},
    {w:"they",m:"\uadf8\ub4e4",def:"two or more people or things",unit:19,opts:["they", "bottom", "type", "very"]},
    {w:"very",m:"\ub9e4\uc6b0",def:"to emphasize an adjective or adverb",unit:19,opts:["very", "responsible", "type", "line"]},
  ],
  "eew2_20": [
    {w:"gradual",m:"\uc810\uc9c4\uc801\uc778",def:"happens slowly",unit:20,opts:["gradual", "failure", "poverty", "recognition"]},
    {w:"accomplish",m:"\ub2ec\uc131\ud558\ub2e4, \ub3c4\ub2ec\ud558\ub2e4, \uc131\ucde8\ud558\ub2e4",def:"to finish it",unit:20,opts:["accomplish", "recognition", "approve", "statistic"]},
    {w:"approve",m:"\ucc2c\uc131\ud558\ub2e4, \uad1c\ucc2e\ub2e4\uace0 \uc0dd\uac01\ud558\ub2e4",def:"you like or agree with that thing",unit:20,opts:["gradual", "approve", "pretend", "elementary"]},
    {w:"insert",m:"\uc8fc\uc785\ud558\ub2e4, \uc0bd\uc785\ud558\ub2e4",def:"to put it in something else",unit:20,opts:["insert", "failure", "approve", "statistic"]},
    {w:"refrigerate",m:"\ub0c9\uc7a5\ud558\ub2e4, \ub0c9\uc7a5\uace0\uc5d0 \ubcf4\uad00\ud558\ub2e4",def:"to make it cold",unit:20,opts:["pretend", "refrigerate", "elementary", "rank"]},
    {w:"elementary",m:"\ucd08\ubcf4\uc758, \ucd08\uae09\uc758, \uae30\ucd08\uc801\uc778",def:"the first or most simple thing",unit:20,opts:["elementary", "pretend", "poverty", "instant"]},
    {w:"barrier",m:"\uc7a5\ubcbd, \uc7a5\uc560\ubb3c, \ubc29\ud574\ubb3c",def:"blocks a path or way",unit:20,opts:["barrier", "approve", "failure", "instant"]},
    {w:"poverty",m:"\uac00\ub09c, \ube48\uace4, \uad81\ud54d",def:"the state of being poor",unit:20,opts:["instant", "pretend", "barrier", "poverty"]},
    {w:"rank",m:"\ub4f1\uae09, \uacc4\uae09, \uc9c0\uc704",def:"a person\u2019s place in an order of people",unit:20,opts:["detect", "pretend", "elementary", "rank"]},
    {w:"detect",m:"\uac10\uc9c0\ud558\ub2e4, \ubc1c\uacac\ud558\ub2e4",def:"to notice or find something",unit:20,opts:["insert", "recognition", "detect", "approve"]},
    {w:"statistic",m:"\ud1b5\uacc4",def:"we did just as well this year as last year",unit:20,opts:["insert", "statistic", "poverty", "elementary"]},
    {w:"recognition",m:"\uc778\uc815, \ud45c\ucc3d",def:"the act of getting praise from other people",unit:20,opts:["recognition", "detect", "immigrant", "instant"]},
    {w:"pretend",m:"~\uc778 \ucc99\ud558\ub2e4, \uac00\uc7a5\ud558\ub2e4",def:"to make believe something is real",unit:20,opts:["statistic", "approve", "pretend", "instant"]},
    {w:"failure",m:"\uc2e4\ud328",def:"when something is not done right",unit:20,opts:["elementary", "insert", "failure", "gradual"]},
    {w:"immigrant",m:"\uc774\ubbfc\uc790, \uc774\uc8fc\ubbfc",def:"a person who moves to a different country",unit:20,opts:["detect", "immigrant", "refrigerate", "poverty"]},
    {w:"instant",m:"\uc21c\uac04, \ucc30\ub098",def:"a very short amount of time",unit:20,opts:["failure", "statistic", "instant", "immigrant"]},
  ],
  "eew2_21": [
    {w:"scale",m:"\uaddc\ubaa8",def:"its size, especially when it is very large",unit:21,opts:["scale", "jewel", "telescope", "participate"]},
    {w:"raw",m:"\ub0a0\uac83\uc758, \uc0dd\uc758, \uac00\uacf5\ub418\uc9c0 \uc54a\uc740",def:"natural and not processed",unit:21,opts:["mineral", "stretch", "raw", "courage"]},
    {w:"satellite",m:"\uc704\uc131",def:"a machine sent into space to get information",unit:21,opts:["mineral", "scale", "satellite", "gravity"]},
    {w:"miner",m:"\uad11\ubd80",def:"a person who works in a mine",unit:21,opts:["pour", "grant", "satellite", "miner"]},
    {w:"stretch",m:"\ubed7\ub2e4, \ub298\ub9ac\ub2e4, \uae30\uc9c0\uac1c\ub97c \ucf1c\ub2e4",def:"to make your arms or legs reach out",unit:21,opts:["stretch", "telescope", "mineral", "astronaut"]},
    {w:"telescope",m:"\ub9dd\uc6d0\uacbd",def:"a tool people use to look at the stars",unit:21,opts:["telescope", "float", "courage", "participate"]},
    {w:"awake",m:"\uae68\uc5b4 \uc788\ub294, \uc7a0\ub4e4\uc9c0 \uc54a\uc740",def:"who is awake is not asleep",unit:21,opts:["astronaut", "underground", "awake", "float"]},
    {w:"grant",m:"\uc218\uc5ec\ud558\ub2e4, \uc8fc\ub2e4, \ud5c8\ub77d\ud558\ub2e4",def:"to allow someone to have it",unit:21,opts:["gravity", "grant", "telescope", "underground"]},
    {w:"permission",m:"\ud5c8\ub77d, \ud5c8\uac00",def:"the act of allowing some action",unit:21,opts:["gravity", "scale", "skip", "permission"]},
    {w:"underground",m:"\uc9c0\ud558\uc758",def:"below the surface of the Earth",unit:21,opts:["underground", "stretch", "satellite", "jewel"]},
    {w:"float",m:"\ubb3c\uc5d0 \ub5a0\ub2e4\ub2c8\ub2e4",def:"to move on top of water without sinking",unit:21,opts:["underground", "satellite", "float", "astronaut"]},
    {w:"pour",m:"\ubd93\ub2e4, \ub530\ub974\ub2e4, \uc3df\ub2e4",def:"to make something come out of a container",unit:21,opts:["stretch", "float", "pour", "satellite"]},
    {w:"courage",m:"\uc6a9\uae30",def:"the feeling of not being afraid",unit:21,opts:["courage", "astronaut", "miner", "awake"]},
    {w:"jewel",m:"\ubcf4\uc11d, \uc7a5\uc2e0\uad6c",def:"a beautiful stone that is worth a lot of money",unit:21,opts:["gravity", "jewel", "skip", "underground"]},
    {w:"gravity",m:"\uc911\ub825",def:"the force that makes things fall to Earth",unit:21,opts:["grant", "gravity", "courage", "underground"]},
    {w:"mineral",m:"\uad11\ubb3c, \ubb34\uae30\ubb3c",def:"a type of substance found in the Earth",unit:21,opts:["underground", "mineral", "permission", "pour"]},
    {w:"participate",m:"\ucc38\uac00\ud558\ub2e4, \ucc38\uc5ec\ud558\ub2e4",def:"to be active and do something",unit:21,opts:["gravity", "raw", "miner", "participate"]},
    {w:"astronaut",m:"\uc6b0\uc8fc\ube44\ud589\uc0ac",def:"a person who goes into outer space",unit:21,opts:["skip", "float", "astronaut", "satellite"]},
    {w:"skip",m:"\uac74\ub108\ub6f0\ub2e4, \uac70\ub974\ub2e4",def:"to not do it",unit:21,opts:["pour", "skip", "grant", "mineral"]},
  ],
  "eew2_22": [
    {w:"bucket",m:"\uc591\ub3d9\uc774",def:"a round container to put things in",unit:22,opts:["award", "bucket", "convict", "journalist"]},
    {w:"slip",m:"\ubbf8\ub044\ub7ec\uc9c0\ub2e4",def:"to slide and fall down",unit:22,opts:["journalist", "slip", "rob", "stable"]},
    {w:"repair",m:"\uc218\ub9ac\ud558\ub2e4, \uace0\uce58\ub2e4",def:"to fix it",unit:22,opts:["repair", "yard", "breed", "alarm"]},
    {w:"yard",m:"\ub9c8\ub2f9, \uc6b4\ub3d9\uc7a5",def:"the ground just outside of a house",unit:22,opts:["contest", "yard", "journalist", "slip"]},
    {w:"stable",m:"\uace0\uc815\ub41c, \uc548\uc815\ub41c",def:"not move, change, or fall over",unit:22,opts:["journalist", "pup", "stable", "award"]},
    {w:"resume",m:"\uc7ac\uac1c\ud558\ub2e4",def:"to start it again after taking a break",unit:22,opts:["breed", "resume", "stable", "award"]},
    {w:"breed",m:"\ud488\uc885",def:"a group of animals within a species",unit:22,opts:["yard", "rob", "contest", "breed"]},
    {w:"rob",m:"\uac15\ud0c8\ud558\ub2e4",def:"to take property by using force",unit:22,opts:["alarm", "rob", "bucket", "yard"]},
    {w:"alarm",m:"\uacbd\ubcf4",def:"warns people of danger",unit:22,opts:["bucket", "pup", "alarm", "award"]},
    {w:"award",m:"\uc0c1, \uc218\uc5ec",def:"a prize for doing something well",unit:22,opts:["convict", "rob", "stable", "award"]},
    {w:"journalist",m:"\uae30\uc790, \uc5b8\ub860\uc778",def:"a person who writes news stories",unit:22,opts:["rob", "journalist", "contest", "somewhat"]},
    {w:"pup",m:"\uac15\uc544\uc9c0",def:"a young dog",unit:22,opts:["repair", "yard", "slip", "pup"]},
    {w:"somewhat",m:"\ub2e4\uc18c, \uc5b4\ub290\uc815\ub3c4",def:"to some degree, but not to a large degree",unit:22,opts:["journalist", "somewhat", "rob", "repair"]},
    {w:"convict",m:"\uc720\uc8c4\ub97c \uc120\uace0\ud558\ub2e4",def:"to prove that someone did a bad thing",unit:22,opts:["award", "convict", "bucket", "contest"]},
    {w:"contest",m:"\ub300\ud68c, \uacbd\uc5f0",def:"a game or a race",unit:22,opts:["alarm", "stable", "convict", "contest"]},
  ],
  "eew2_23": [
    {w:"surprise",m:"\ub180\ub77c\uac8c \ud558\ub2e4",def:"to cause something that is unexpected",unit:23,opts:["surprise", "station", "market", "hour"]},
    {w:"station",m:"\uc815\uac70\uc7a5, \uc5ed",def:"a place where buses and trains stop",unit:23,opts:["station", "day", "surprise", "short"]},
    {w:"hour",m:"\uc2dc, \uc2dc\uac04",def:"sixty minutes",unit:23,opts:["two", "day", "station", "hour"]},
    {w:"best",m:"\ucd5c\uace0\uc758",def:"better than all the others",unit:23,opts:["best", "two", "station", "short"]},
    {w:"two",m:"\ub458\uc758",def:"the word for the number 2",unit:23,opts:["easy", "short", "two", "hour"]},
    {w:"short",m:"\uc9e7\uc740",def:"not long or not tall",unit:23,opts:["two", "short", "easy", "market"]},
    {w:"easy",m:"\uc26c\uc6b4",def:"not difficult to do",unit:23,opts:["short", "hour", "easy", "market"]},
    {w:"market",m:"\uc2dc\uc7a5",def:"a place where people buy and sell products",unit:23,opts:["two", "market", "short", "hour"]},
    {w:"day",m:"\ub0a0, \ud558\ub8e8",def:"a period of twenty-four hours",unit:23,opts:["best", "day", "easy", "short"]},
  ],
  "eew2_24": [
    {w:"value",m:"\uac00\uce58",def:"what it is worth",unit:24,opts:["value", "inspect", "regret", "tough"]},
    {w:"liquid",m:"\uc561\uccb4",def:"a substance that is neither solid nor gas",unit:24,opts:["bend", "liquid", "marvel", "fantastic"]},
    {w:"bend",m:"\uad6c\ubd80\ub9ac\ub2e4, \uc811\ub2e4",def:"to move something so it is not straight",unit:24,opts:["value", "bend", "liquid", "marvel"]},
    {w:"overcome",m:"\uadf9\ubcf5\ud558\ub2e4",def:"a problem is to successfully fix it",unit:24,opts:["value", "overcome", "marvel", "recall"]},
    {w:"sufficient",m:"\ucda9\ubd84\ud55c",def:"something is enough, in quality or quantity",unit:24,opts:["sufficient", "inspect", "tube", "tough"]},
    {w:"fantastic",m:"\ud658\uc0c1\uc801\uc778",def:"really good",unit:24,opts:["bend", "sufficient", "tube", "fantastic"]},
    {w:"tube",m:"(\uae30\uccb4\u00b7\uc561\uccb4\ub97c \uc2e4\uc5b4 \ub098\ub974\ub294) \uad00",def:"a pipe through which water or air passes",unit:24,opts:["fiction", "liquid", "tube", "soul"]},
    {w:"marvel",m:"\uacbd\ud0c4\ud558\ub2e4",def:"to feel surprise and interest in it.",unit:24,opts:["fantastic", "tough", "soul", "marvel"]},
    {w:"recall",m:"\ud68c\uc0c1\ud558\ub2e4",def:"to remember it",unit:24,opts:["fiction", "recall", "tube", "overcome"]},
    {w:"regret",m:"\ud6c4\ud68c\ud558\ub2e4, \uc720\uac10\uc2a4\ub7fd\uac8c \uc0dd\uac01\ud558\ub2e4",def:"to wish that it hadn\u2019t happened",unit:24,opts:["recall", "liquid", "inspect", "regret"]},
    {w:"fiction",m:"\uc18c\uc124, \ud5c8\uad6c",def:"a story that is not true",unit:24,opts:["fiction", "soul", "inspect", "overcome"]},
    {w:"tough",m:"\uac70\uce5c, \ud798\ub4e0, \uc5b4\ub824\uc6b4",def:"difficult",unit:24,opts:["sufficient", "fiction", "liquid", "tough"]},
    {w:"inspect",m:"\uac80\uc0ac\ud558\ub2e4, \uc870\uc0ac\ud558\ub2e4",def:"to look at something carefully",unit:24,opts:["bend", "fiction", "fantastic", "inspect"]},
    {w:"soul",m:"\uc601\ud63c",def:"a person\u2019s spirit",unit:24,opts:["tough", "fiction", "value", "soul"]},
  ],
  "eew2_25": [
    {w:"solitary",m:"\uace0\ub3c5\ud55c, \uc678\ub534, \ud640\ub85c\uc758",def:"lonely or only",unit:25,opts:["ugly", "cover", "solitary", "moon"]},
    {w:"radiate",m:"\ubc29\ucd9c\ud558\ub2e4, \ub0b4\ubfdc\ub2e4",def:"to send out energy or heat",unit:25,opts:["galaxy", "radiate", "solitary", "form"]},
    {w:"galaxy",m:"\uc740\ud558",def:"an extremely large collection of star systems",unit:25,opts:["galaxy", "moon", "form", "solitary"]},
    {w:"star",m:"\ubcc4",def:"a bright shining thing in the night sky",unit:25,opts:["atom", "moon", "sphere", "star"]},
    {w:"fragment",m:"\ud30c\ud3b8",def:"a small part of something",unit:25,opts:["cover", "roam", "fragment", "moon"]},
    {w:"large",m:"\ud070, \uac70\ub300\ud55c",def:"very big",unit:25,opts:["radiate", "large", "galaxy", "moon"]},
    {w:"form",m:"\ud615\uc131\ud558\ub2e4",def:"to make or to shape something",unit:25,opts:["ugly", "roam", "form", "moon"]},
    {w:"sphere",m:"\uad6c\uccb4",def:"a three-dimensional round shape, like a ball",unit:25,opts:["form", "cover", "large", "sphere"]},
    {w:"cover",m:"\ub36e\ub2e4",def:"to put things over it",unit:25,opts:["star", "beautiful", "form", "cover"]},
    {w:"atom",m:"\uc6d0\uc790",def:"the smallest unit of a substance",unit:25,opts:["roam", "moon", "form", "atom"]},
    {w:"ugly",m:"\ubabb\uc0dd\uae34, \ucd94\ud55c, \ubd88\ucf8c\ud55c",def:"not good to look at",unit:25,opts:["cover", "form", "solitary", "ugly"]},
    {w:"moon",m:"\ub2ec",def:"an object that travels around our Earth",unit:25,opts:["cover", "beautiful", "form", "moon"]},
    {w:"beautiful",m:"\uc544\ub984\ub2e4\uc6b4",def:"good to look at",unit:25,opts:["radiate", "beautiful", "star", "large"]},
    {w:"roam",m:"\ubc30\ud68c\ud558\ub2e4",def:"to move around without a plan or purpose",unit:25,opts:["cover", "roam", "beautiful", "moon"]},
  ],
  "eew2_26": [
    {w:"plain",m:"\ud3c9\ubc94\ud55c, \uc218\uc218\ud55c, \ubbfc\ubb34\ub2ac\uc758",def:"simple and not decorated",unit:26,opts:["plain", "accuse", "hurricane", "engage"]},
    {w:"amuse",m:"\uc990\uac81\uac8c \ud574\uc8fc\ub2e4",def:"to do something that is funny or entertaining",unit:26,opts:["amuse", "loss", "shut", "firm"]},
    {w:"shut",m:"\ub2eb\ub2e4",def:"to close it tightly",unit:26,opts:["firm", "fuel", "shut", "adjust"]},
    {w:"crash",m:"\ucda9\ub3cc\ud558\ub2e4, \ubd80\ub52a\uce58\ub2e4",def:"to hit and break something",unit:26,opts:["crash", "hurricane", "adjust", "grand"]},
    {w:"grand",m:"\uc6c5\uc7a5\ud55c, \uac70\ub300\ud55c",def:"big and liked by people",unit:26,opts:["fuel", "crash", "engage", "grand"]},
    {w:"adjust",m:"\uc801\uc751\ud558\ub2e4, \uc870\uc815\ud558\ub2e4",def:"to change it so it is better",unit:26,opts:["firm", "shut", "adjust", "loss"]},
    {w:"loss",m:"\uc190\uc2e4, \uc190\ud574",def:"the act or instance of losing something",unit:26,opts:["engage", "hurricane", "grand", "loss"]},
    {w:"strict",m:"\uc5c4\uaca9\ud55c",def:"makes sure others follow rules",unit:26,opts:["strict", "accuse", "plain", "engage"]},
    {w:"fuel",m:"\uc5f0\ub8cc",def:"something that creates heat or energy",unit:26,opts:["grand", "hurricane", "fuel", "shut"]},
    {w:"hurricane",m:"\ud5c8\ub9ac\ucf00\uc778, \ud3ed\ud48d",def:"a bad storm that happens over the ocean",unit:26,opts:["hurricane", "crash", "plain", "strict"]},
    {w:"engage",m:"\uad00\uc5ec\ud558\ub2e4, \uc885\uc0ac\ud558\ub2e4",def:"do it",unit:26,opts:["engage", "amuse", "firm", "fuel"]},
    {w:"accuse",m:"\uace0\uc18c\ud558\ub2e4, \uace0\ubc1c\ud558\ub2e4, \uae30\uc18c\ud558\ub2e4",def:"to blame them for doing it",unit:26,opts:["fuel", "adjust", "loss", "accuse"]},
    {w:"firm",m:"\ub2e8\ub2e8\ud55c",def:"solid but not too hard",unit:26,opts:["adjust", "firm", "plain", "accuse"]},
  ],
  "eew2_27": [
    {w:"witch",m:"\ub9c8\ub140",def:"a woman with magical powers",unit:27,opts:["bug", "witch", "symptom", "pronounce"]},
    {w:"permanent",m:"\uc601\uad6c\uc801\uc778",def:"a long time or forever",unit:27,opts:["expose", "hire", "guilty", "permanent"]},
    {w:"resemble",m:"\ub2ee\ub2e4",def:"to look like that person",unit:27,opts:["resemble", "ordinary", "hire", "witch"]},
    {w:"apology",m:"\uc0ac\uacfc",def:"what people say to show that they are sorry",unit:27,opts:["preserve", "capture", "bug", "apology"]},
    {w:"capture",m:"\ud3ec\ud68d\ud558\ub2e4, \uc0ac\ub85c\uc7a1\ub2e4",def:"to catch and hold it",unit:27,opts:["language", "resemble", "capture", "permanent"]},
    {w:"bold",m:"\ub2f4\ub300\ud55c, \ub300\ub2f4\ud55c, \uc6a9\uac10\ud55c",def:"not afraid of doing something",unit:27,opts:["resemble", "bold", "ordinary", "expose"]},
    {w:"ordinary",m:"\ud3c9\ubc94\ud55c, \ubb34\ub09c\ud55c",def:"normal, or not special in any way",unit:27,opts:["apology", "symptom", "ordinary", "capture"]},
    {w:"twin",m:"\uc30d\ub465\uc774",def:"two children born at the same time",unit:27,opts:["resemble", "innocent", "hire", "twin"]},
    {w:"pronounce",m:"\ubc1c\uc74c\ud558\ub2e4",def:"to say the sounds of letters or words",unit:27,opts:["capture", "hire", "bold", "pronounce"]},
    {w:"hire",m:"\uace0\uc6a9\ud558\ub2e4",def:"to pay that person money to work for you",unit:27,opts:["hire", "resemble", "preserve", "language"]},
    {w:"innocent",m:"\ubb34\uc8c4\uc758, \uc21c\uc218\ud55c, \uc21c\uc9c4\ubb34\uad6c\ud55c",def:"not guilty of a crime",unit:27,opts:["bug", "innocent", "symptom", "resemble"]},
    {w:"preserve",m:"\ubcf4\uc874\ud558\ub2e4, \ubcf4\ud638\ud558\ub2e4, \uc720\uc9c0\ud558\ub2e4",def:"to protect something from harm",unit:27,opts:["innocent", "preserve", "pronounce", "ordinary"]},
    {w:"symptom",m:"\uc99d\uc0c1",def:"a sign that it is happening",unit:27,opts:["symptom", "bold", "innocent", "twin"]},
    {w:"language",m:"\uc5b8\uc5b4",def:"a system of communication",unit:27,opts:["capture", "preserve", "language", "bold"]},
    {w:"bug",m:"\ubc8c\ub808",def:"a small insect",unit:27,opts:["hire", "permanent", "bug", "apology"]},
    {w:"expose",m:"\ub178\ucd9c\uc2dc\ud0a4\ub2e4, \ub4dc\ub7ec\ub0b4\ub2e4",def:"to make known something that is hidden",unit:27,opts:["bug", "capture", "expose", "twin"]},
    {w:"guilty",m:"\uc720\uc8c4\uc758",def:"To feel bad for something one did",unit:27,opts:["guilty", "symptom", "witch", "expose"]},
  ],
  "eew2_28": [
    {w:"virtual",m:"\uc2e4\uc9c8\uc801\uc778, \uc0ac\uc2e4\uc0c1\uc758",def:"very close to being true or accurate",unit:28,opts:["accompany", "electronic", "virtual", "bare"]},
    {w:"bare",m:"\ud5d0\ubc97\uc740, \ub178\ucd9c\ub41c",def:"plain and not covered",unit:28,opts:["inn", "philosophy", "branch", "bare"]},
    {w:"dare",m:"\uac10\ud788 ~\ud558\ub2e4, \uc6a9\uac10\ud558\uac8c ~\ud558\ub2e4",def:"to be brave enough to try something",unit:28,opts:["dare", "virtual", "whisper", "sharp"]},
    {w:"electronic",m:"\uc804\uc790\uc758",def:"electricity to work",unit:28,opts:["bare", "electronic", "whisper", "cast"]},
    {w:"breath",m:"\uc228",def:"the air that goes into and out of one\u2019s lungs",unit:28,opts:["bare", "subtract", "virtual", "breath"]},
    {w:"accompany",m:"\ub3d9\ubc18\ud558\ub2e4, \ub3d9\ud589\ud558\ub2e4, \uc218\ubc18\ud558\ub2e4",def:"to join them or go with them",unit:28,opts:["weigh", "whisper", "accompany", "dare"]},
    {w:"sort",m:"\uc885\ub958",def:"a type of it",unit:28,opts:["cast", "sharp", "philosophy", "sort"]},
    {w:"sharp",m:"\ub0a0\uce74\ub85c\uc6b4, \uc608\ub9ac\ud55c",def:"a thin edge that cuts things easily",unit:28,opts:["inn", "sharp", "breath", "subtract"]},
    {w:"branch",m:"\ub098\ubb47\uac00\uc9c0",def:"the part of a tree with leaves",unit:28,opts:["inn", "weigh", "branch", "cast"]},
    {w:"philosophy",m:"\ucca0\ud559",def:"a way to think about truth and life",unit:28,opts:["philosophy", "dare", "inn", "breath"]},
    {w:"cast",m:"\ub358\uc9c0\ub2e4",def:"to throw it",unit:28,opts:["sharp", "breath", "accompany", "cast"]},
    {w:"weigh",m:"\ubb34\uac8c\uac00 \ub098\uac00\ub2e4",def:"to measure how heavy it is",unit:28,opts:["inn", "dare", "breath", "weigh"]},
    {w:"inn",m:"\uc5ec\uad00",def:"a place where travelers can rest and eat",unit:28,opts:["virtual", "cast", "inn", "weigh"]},
    {w:"whisper",m:"\uc18d\uc0ad\uc774\ub2e4",def:"to say very quietly",unit:28,opts:["branch", "whisper", "sort", "weigh"]},
    {w:"subtract",m:"\ube7c\ub2e4, \ub35c\ub2e4, \uacf5\uc81c\ud558\ub2e4",def:"to take something away",unit:28,opts:["whisper", "subtract", "philosophy", "weigh"]},
  ],
  "eew2_29": [
    {w:"obtain",m:"\uc2b5\ub4dd\ud558\ub2e4, \uc5bb\ub2e4",def:"to get something you want or need",unit:29,opts:["obtain", "feather", "intelligence", "shore"]},
    {w:"religious",m:"\uc885\uad50\uc801\uc778",def:"related to or about religion",unit:29,opts:["shore", "grave", "religious", "abstract"]},
    {w:"shore",m:"\ud574\uc548, \ud574\ubcc0",def:"the edge of a large body of water",unit:29,opts:["shore", "ideal", "grave", "obtain"]},
    {w:"grave",m:"\ubb34\ub364",def:"the place where a dead person is buried",unit:29,opts:["religious", "cloth", "annual", "grave"]},
    {w:"fertile",m:"\ube44\uc625\ud55c, \ud48d\ubd80\ud55c",def:"to produce good crops and plants",unit:29,opts:["fertile", "intelligence", "annual", "grave"]},
    {w:"wooden",m:"\ub098\ubb34\uc758, \ub098\ubb34\ub85c \ub41c",def:"made of wood",unit:29,opts:["grave", "feather", "religious", "wooden"]},
    {w:"annual",m:"\ub9e4\ub144\uc758, \uc5f0\ub840\uc758",def:"once a year",unit:29,opts:["obtain", "religious", "annual", "intelligence"]},
    {w:"feather",m:"\uae43\ud138",def:"the things covering a bird\u2019s bodies",unit:29,opts:["shore", "feather", "religious", "annual"]},
    {w:"cloth",m:"\uc9c1\ubb3c, \uc637\uac10, \ucc9c",def:"material used to make clothes",unit:29,opts:["obtain", "clay", "cloth", "intelligence"]},
    {w:"clay",m:"\uc810\ud1a0",def:"a type of heavy, wet soil used to make pots",unit:29,opts:["obtain", "feather", "clay", "fertile"]},
    {w:"intelligence",m:"\uc9c0\ub2a5, \uc9c0\ub825",def:"the ability to learn and understand things",unit:29,opts:["ideal", "obtain", "shore", "intelligence"]},
    {w:"ideal",m:"\uc774\uc0c1\uc801\uc778",def:"the best that it can possibly be",unit:29,opts:["clay", "ideal", "religious", "abstract"]},
    {w:"abstract",m:"\ucd94\uc0c1\uc801\uc778",def:"an idea or thought, not a physical thing",unit:29,opts:["ideal", "grave", "abstract", "religious"]},
  ],
  "eew2_30": [
    {w:"pursue",m:"\ucd94\uad6c\ud558\ub2e4, \ucd94\uc801\ud558\ub2e4, \ub4a4\ucad3\ub2e4",def:"to chase or follow someone or something",unit:30,opts:["stain", "pursue", "swear", "strip"]},
    {w:"hole",m:"\uad6c\uba4d",def:"a hollow space in something solid",unit:30,opts:["hole", "strip", "stain", "laundry"]},
    {w:"basin",m:"\uc591\ud47c, \ub300\uc57c, \uc138\uba74\ub300",def:"a large bowl for washing things",unit:30,opts:["sleeve", "hop", "basin", "laundry"]},
    {w:"hop",m:"\uaed1\ucda9 \ub6f0\ub2e4",def:"to jump a short distance",unit:30,opts:["hop", "pursue", "sleeve", "reluctant"]},
    {w:"swear",m:"\ub9f9\uc138\ud558\ub2e4",def:"to promise to do something",unit:30,opts:["laundry", "strip", "swear", "hop"]},
    {w:"reluctant",m:"\ub9c8\uc9c0\ubabb\ud55c, \uaebc\ub9ac\ub294, \ub0b4\ud0a4\uc9c0 \uc54a\uc740",def:"not wanting to do something",unit:30,opts:["emerge", "basin", "swear", "reluctant"]},
    {w:"strip",m:"\uac00\ub290\ub2e4\ub780 \uc870\uac01",def:"a long, narrow piece of material or land",unit:30,opts:["stain", "basin", "delicate", "strip"]},
    {w:"emerge",m:"\ubd80\uc0c1\ud558\ub2e4, \ub5a0\uc624\ub974\ub2e4",def:"to come out of it",unit:30,opts:["emerge", "stain", "strip", "pursue"]},
    {w:"stain",m:"\uc5bc\ub8e9",def:"a dirty mark that is difficult to clean",unit:30,opts:["basin", "hole", "pursue", "stain"]},
    {w:"sleeve",m:"\uc18c\ub9e4",def:"the part of a shirt in which arms go",unit:30,opts:["swear", "emerge", "sleeve", "delicate"]},
    {w:"delicate",m:"\uc5f0\uc57d\ud55c",def:"easy to break or harm",unit:30,opts:["pursue", "delicate", "laundry", "swear"]},
    {w:"laundry",m:"\uc138\ud0c1\ubb3c",def:"clothes that have been or need to be washed",unit:30,opts:["strip", "pursue", "swear", "laundry"]},
  ],
  "eew3_1": [
    {w:"archaeology",m:"\uace0\uace0\ud559",def:"the study of the remains left by ancient societies",unit:1,opts:["afterlife", "archaeology", "distinct", "chamber"]},
    {w:"stairs",m:"\uacc4\ub2e8",def:"a set of steps built to go from one level of a building to another",unit:1,opts:["acre", "stairs", "distinct", "surface"]},
    {w:"core",m:"(\uacfc\uc77c\uc758) \uc18d, (\uc0ac\ubb3c\uc758) \uc911\uc2ec\ubd80",def:"the main or central part of something",unit:1,opts:["stairs", "core", "royal", "glory"]},
    {w:"engineer",m:"\uae30\uc220\uc790, \uc218\ub9ac\uacf5",def:"to skillfully plan out how to make that thing",unit:1,opts:["royal", "engineer", "distinct", "acre"]},
    {w:"royal",m:"\uad6d\uc655\uc758",def:"related to a king or queen",unit:1,opts:["lion", "royal", "afterlife", "surface"]},
    {w:"glory",m:"\uc601\uad11",def:"the importance, magnificence, or specialness of something",unit:1,opts:["elite", "glory", "afterlife", "core"]},
    {w:"chamber",m:"\ud68c\uc758\uc2e4",def:"a closed space or room used for a special purpose",unit:1,opts:["surface", "role", "royal", "chamber"]},
    {w:"role",m:"(\uc870\uc9c1, \uc0ac\ud68c \ub0b4\uc5d0\uc11c\uc758) \uc5ed\ud560",def:"a job, position, or part in something",unit:1,opts:["acre", "royal", "role", "gap"]},
    {w:"acre",m:"\uc5d0\uc774\ucee4 (\uc57d 4,050\ud3c9\ubc29\ubbf8\ud130\uc5d0 \ud574\ub2f9\ud558\ub294 \ud06c\uae30\uc758 \ub545)",def:"a unit for measuring area",unit:1,opts:["acre", "sole", "engineer", "glory"]},
    {w:"gap",m:"\ud2c8, \uacf5\ubc31",def:"a space between two things",unit:1,opts:["afterlife", "found", "gap", "royal"]},
    {w:"interior",m:"\ub0b4\ubd80",def:"the inside of something",unit:1,opts:["glory", "engineer", "interior", "surface"]},
    {w:"elite",m:"\uc815\uc608\uc758, \uc0c1\ub958\uc758",def:"a high-level group",unit:1,opts:["archaeology", "found", "sole", "elite"]},
    {w:"channel",m:"\ud1b5\ub85c",def:"a long, deep space between two edges",unit:1,opts:["distinct", "interior", "afterlife", "channel"]},
    {w:"distinct",m:"\ub69c\ub837\ud55c, \ubd84\uba85\ud55c",def:"different or stands out",unit:1,opts:["glory", "engineer", "distinct", "chamber"]},
    {w:"sole",m:"\uc720\uc77c\ud55c, \ub2e8 \ud558\ub098\uc758",def:"the only one",unit:1,opts:["chamber", "afterlife", "archaeology", "sole"]},
    {w:"corridor",m:"\ubcf5\ub3c4",def:"a narrow passage",unit:1,opts:["corridor", "engineer", "elite", "royal"]},
    {w:"found",m:"\uc124\ub9bd\ud558\ub2e4, \uc138\uc6b0\ub2e4",def:"to start, organize, or establish that thing",unit:1,opts:["channel", "corridor", "found", "glory"]},
    {w:"lion",m:"\uc0ac\uc790",def:"a large animal in the cat family",unit:1,opts:["engineer", "distinct", "corridor", "lion"]},
    {w:"surface",m:"\ud45c\uba74",def:"the top layer of something",unit:1,opts:["corridor", "afterlife", "elite", "surface"]},
    {w:"afterlife",m:"\ub0b4\uc138, \uc0ac\ud6c4\uc138\uacc4",def:"a life that begins when a person dies",unit:1,opts:["sole", "afterlife", "channel", "chamber"]},
  ],
  "eew3_2": [
    {w:"sustain",m:"\uc720\uc9c0\ud558\ub2e4",def:"to keep it going",unit:2,opts:["humble", "sustain", "satisfaction", "penny"]},
    {w:"iron",m:"\ucca0",def:"a strong metal that is used to make many objects",unit:2,opts:["province", "penny", "humble", "iron"]},
    {w:"forge",m:"\uad6c\ucd95\ud558\ub2e4",def:"to make or produce, especially with difficulty",unit:2,opts:["modest", "blacksmith", "forge", "province"]},
    {w:"encounter",m:"\ub9cc\ub098\ub2e4, \ub9c8\uc8fc\uce58\ub2e4",def:"to find or meet a person or thing",unit:2,opts:["prosper", "compensate", "encounter", "humble"]},
    {w:"blacksmith",m:"\ub300\uc7a5\uc7a5\uc774",def:"a person who makes things out of metal",unit:2,opts:["satisfaction", "modest", "arise", "blacksmith"]},
    {w:"penny",m:"\uc601\uad6d\uc758 \uc791\uc740 \ub3d9\uc804",def:"a coin worth one cent",unit:2,opts:["sustain", "penny", "iron", "prosper"]},
    {w:"preach",m:"\uc124\uad50\ud558\ub2e4",def:"to talk about and promote a religious idea",unit:2,opts:["province", "forge", "compensate", "preach"]},
    {w:"modest",m:"\uacb8\uc190\ud55c",def:"If people are modest, they do not think that they are too important",unit:2,opts:["modest", "preach", "compensate", "province"]},
    {w:"satisfaction",m:"\ub9cc\uc871",def:"the feeling of having done or received something good",unit:2,opts:["encounter", "forge", "satisfaction", "preach"]},
    {w:"benefactor",m:"\ud6c4\uc6d0\uc790",def:"a person who gives money to help someone",unit:2,opts:["agreement", "benefactor", "compensate", "sustain"]},
    {w:"ladder",m:"\uc0ac\ub2e4\ub9ac",def:"an object that is used to climb up and down",unit:2,opts:["sustain", "ladder", "exceed", "compensate"]},
    {w:"exceed",m:"(\ud2b9\uc815\ud55c \uc218, \uc591\uc744) \ub118\ub2e4, \ub118\uc5b4\uc11c\ub2e4",def:"to be more than something",unit:2,opts:["exceed", "preach", "chimney", "satisfaction"]},
    {w:"chimney",m:"\uad74\ub69d",def:"a tall pipe used to carry smoke out of a building",unit:2,opts:["chimney", "benefactor", "exceed", "arise"]},
    {w:"compensate",m:"\ubcf4\uc0c1\ud558\ub2e4, \ubcf4\uc0c1\uae08\uc744 \uc8fc\ub2e4",def:"to pay someone for the time they spent doing something",unit:2,opts:["exceed", "sustain", "compensate", "encounter"]},
    {w:"agreement",m:"\ud611\uc815, \ud569\uc758, \ub3d9\uc758",def:"a formal decision about future action",unit:2,opts:["agreement", "encounter", "chimney", "benefactor"]},
    {w:"occupy",m:"\ucc28\uc9c0\ud558\ub2e4",def:"to live, work, or be there",unit:2,opts:["benefactor", "preach", "exceed", "occupy"]},
    {w:"province",m:"(\ud589\uc815 \ub2e8\uc704\uc778) \uc8fc",def:"an area that is controlled by a country",unit:2,opts:["compensate", "humble", "province", "forge"]},
    {w:"arise",m:"\uc0dd\uae30\ub2e4, \ubc1c\uc0dd\ud558\ub2e4",def:"to arise is to happen",unit:2,opts:["arise", "satisfaction", "humble", "blacksmith"]},
    {w:"prosper",m:"\ubc88\uc601\ud558\ub2e4",def:"to be successful or make a lot of money",unit:2,opts:["blacksmith", "ladder", "prosper", "forge"]},
    {w:"humble",m:"\uacb8\uc190\ud55c",def:"People who are humble do not believe that they are better than other people",unit:2,opts:["agreement", "chimney", "humble", "satisfaction"]},
  ],
  "eew3_3": [
    {w:"repay",m:"\uac1a\ub2e4, \ubcf4\ub2f5\ud558\ub2e4",def:"to pay back or to reward someone or something",unit:3,opts:["repay", "acquire", "satisfactory", "venture"]},
    {w:"fake",m:"\uac00\uc9dc\uc758, \uac70\uc9d3\ub41c",def:"made to look real in order to trick people",unit:3,opts:["caretaker", "fake", "offense", "acquire"]},
    {w:"discourage",m:"\ub9c9\ub2e4, \uc88c\uc808\uc2dc\ud0a4\ub2e4",def:"to make someone feel less excited about something",unit:3,opts:["fake", "shepherd", "discourage", "inferior"]},
    {w:"shepherd",m:"\uc591\uce58\uae30",def:"a person who protects and cares for sheep",unit:3,opts:["ridiculous", "hut", "shepherd", "satisfactory"]},
    {w:"caretaker",m:"\uad00\ub9ac\uc778, \ub3cc\ubcf4\ub294 \uc0ac\ub78c",def:"a person who takes care of very young, old, or sick people",unit:3,opts:["deceive", "caretaker", "hatred", "lodge"]},
    {w:"deceive",m:"\uc18d\uc774\ub2e4, \uae30\ub9cc\ud558\ub2e4",def:"to make someone believe something that is not true",unit:3,opts:["hatred", "deceive", "awkward", "offense"]},
    {w:"awkward",m:"\uc5b4\uc0c9\ud55c, \uace4\ub780\ud55c",def:"embarrassing and uncomfortable",unit:3,opts:["acquire", "repay", "awkward", "shepherd"]},
    {w:"satisfactory",m:"\ub9cc\uc871\uc2a4\ub7ec\uc6b4",def:"good enough",unit:3,opts:["hatred", "satisfactory", "inferior", "neglect"]},
    {w:"venture",m:"(\uc704\ud5d8\uc744 \ubb34\ub985\uc4f0\uace0) \uac00\ub2e4",def:"to go to a place that may be dangerous",unit:3,opts:["venture", "fake", "repay", "inferior"]},
    {w:"overlook",m:"\uac04\uacfc\ud558\ub2e4",def:"to not notice it or to not realize that it is important",unit:3,opts:["overlook", "lodge", "hut", "fake"]},
    {w:"hatred",m:"\uc99d\uc624",def:"a strong feeling of not liking someone or something",unit:3,opts:["wheat", "newcomer", "lodge", "hatred"]},
    {w:"wheat",m:"\ubc00",def:"a plant from which we get the grain used to make bread",unit:3,opts:["wheat", "inferior", "neglect", "shepherd"]},
    {w:"ridiculous",m:"\ud130\ubb34\ub2c8\uc5c6\ub294",def:"silly or strange",unit:3,opts:["shepherd", "acquire", "ridiculous", "discourage"]},
    {w:"inferior",m:"(~\ubcf4\ub2e4) \ubabb\ud55c, \ud558\uc704\uc758",def:"not as good as something else",unit:3,opts:["venture", "acquire", "inferior", "overlook"]},
    {w:"newcomer",m:"\uc2e0\uc785\uc790, \uc2e0\ucc38\uc790",def:"a person who has recently arrived at a place or a group",unit:3,opts:["hatred", "overlook", "newcomer", "hut"]},
    {w:"acquire",m:"\uc2b5\ub4dd\ud558\ub2e4, \ud68d\ub4dd\ud558\ub2e4",def:"to get or gain possession of that thing",unit:3,opts:["acquire", "caretaker", "shepherd", "lodge"]},
    {w:"neglect",m:"\ubc29\uce58\ud558\ub2e4",def:"to not take care of it properly",unit:3,opts:["neglect", "ridiculous", "lodge", "offense"]},
    {w:"hut",m:"\uc624\ub450\ub9c9",def:"a house made of wood, grass, or mud that has only one or two rooms",unit:3,opts:["hatred", "wheat", "fake", "hut"]},
    {w:"lodge",m:"\uc624\ub450\ub9c9",def:"a house in the mountains used by people who hunt or fish",unit:3,opts:["lodge", "venture", "overlook", "repay"]},
    {w:"offense",m:"\uc704\ubc95, \ubc94\uc8c4, \ubaa8\uc695",def:"behavior that is wrong or breaks a law",unit:3,opts:["shepherd", "offense", "repay", "awkward"]},
  ],
  "eew3_4": [
    {w:"tease",m:"\ub180\ub9ac\ub2e4",def:"to laugh at or make fun of someone",unit:4,opts:["sled", "tease", "grateful", "chore"]},
    {w:"loose",m:"\ud5d0\uac70\uc6cc\uc9c4",def:"not held in place tightly",unit:4,opts:["sensation", "offend", "irritate", "loose"]},
    {w:"valentine",m:"\uc560\uc778",def:"someone loved or admired with great affection",unit:4,opts:["tease", "valentine", "kid", "chore"]},
    {w:"pine",m:"\uc18c\ub098\ubb34",def:"a type of tall, thin tree with needles instead of leaves",unit:4,opts:["ax", "irritate", "pine", "tease"]},
    {w:"bunch",m:"\ub2e4\ubc1c, \uc1a1\uc774",def:"a group of the same things",unit:4,opts:["loose", "tease", "sled", "bunch"]},
    {w:"persist",m:"\uacc4\uc18d\ub418\ub2e4",def:"to keep doing something even when it is hard",unit:4,opts:["persist", "disgraceful", "scar", "sensation"]},
    {w:"alley",m:"\uace8\ubaa9",def:"a narrow road between houses or buildings",unit:4,opts:["valentine", "alley", "sensation", "scar"]},
    {w:"disgraceful",m:"\ubd80\ub044\ub7ec\uc6b4, \uc218\uce58\uc2a4\ub7ec\uc6b4",def:"behavior that is very bad",unit:4,opts:["tease", "disgraceful", "overnight", "kid"]},
    {w:"overnight",m:"\ud558\ub8fb\ubc24 \ub3d9\uc548",def:"happens during the night",unit:4,opts:["overnight", "pine", "tease", "chore"]},
    {w:"ax",m:"\ub3c4\ub07c",def:"a tool used to cut wood",unit:4,opts:["ax", "elbow", "irritate", "valentine"]},
    {w:"scar",m:"\ud749\ud130",def:"a mark on the skin after a wound heals",unit:4,opts:["scar", "overnight", "grateful", "ax"]},
    {w:"sensation",m:"\ub290\ub08c, \uac10\uac01",def:"a feeling that people get from their senses",unit:4,opts:["scar", "overnight", "kid", "sensation"]},
    {w:"chore",m:"\ud558\uae30 \uc2eb\uc740 \uc77c, \ud5c8\ub4dc\ub81b\uc77c",def:"an unpleasant job that must be done",unit:4,opts:["loose", "offend", "chore", "overnight"]},
    {w:"elbow",m:"\ud314\uafc8\uce58",def:"the middle part of an arm, where it bends",unit:4,opts:["elbow", "pine", "scar", "chore"]},
    {w:"decent",m:"(\uc218\uc900, \uc9c8\uc774) \uad1c\ucc2e\uc740, \ud488\uc704\uc788\ub294",def:"OK or good enough",unit:4,opts:["decent", "scar", "alley", "grateful"]},
    {w:"sled",m:"\uc370\ub9e4",def:"a small vehicle used on snow",unit:4,opts:["sled", "overnight", "irritate", "pine"]},
    {w:"offend",m:"\uae30\ubd84\uc744 \uc0c1\ud558\uac8c \ud558\ub2e4",def:"to make someone angry or upset",unit:4,opts:["decent", "tease", "ax", "offend"]},
    {w:"irritate",m:"\uc9dc\uc99d\ub098\uac8c \ud558\ub2e4, \ud654\ub098\uac8c \ud558\ub2e4",def:"to annoy someone",unit:4,opts:["bunch", "chore", "irritate", "valentine"]},
    {w:"kid",m:"\ub18d\ub2f4\ud558\ub2e4",def:"to say something that is not true as a joke",unit:4,opts:["kid", "loose", "decent", "valentine"]},
    {w:"grateful",m:"\uace0\ub9c8\uc6cc\ud558\ub294",def:"feels thankful about something",unit:4,opts:["sled", "decent", "irritate", "grateful"]},
  ],
  "eew3_5": [
    {w:"pirate",m:"\ud574\uc801",def:"a sailor who steals things from other boats",unit:5,opts:["hood", "flashlight", "cemetery", "pirate"]},
    {w:"rot",m:"\uc369\ub2e4",def:"to slowly get softer and become destroyed",unit:5,opts:["rot", "pirate", "spoil", "starve"]},
    {w:"riddle",m:"\uc218\uc218\uaed8\ub07c",def:"a question that is difficult to answer but meant to be funny",unit:5,opts:["riddle", "shortly", "skeleton", "cemetery"]},
    {w:"cemetery",m:"\ubb18\uc9c0",def:"a place where people are buried when they die",unit:5,opts:["shortly", "flashlight", "cemetery", "wicked"]},
    {w:"starve",m:"\uad76\uc8fc\ub9ac\ub2e4",def:"to not get enough food for a long period of time",unit:5,opts:["thrill", "starve", "inhabitant", "curse"]},
    {w:"fancy",m:"\ud658\uc0c1\uc801\uc778",def:"nicer or more detailed than normal",unit:5,opts:["thrill", "nourish", "fancy", "inhabitant"]},
    {w:"acquaint",m:"\uc775\ud788\ub2e4, \uc219\uc9c0\ud558\ub2e4",def:"to get to know something or someone",unit:5,opts:["publication", "skeleton", "acquaint", "curse"]},
    {w:"curse",m:"\uc800\uc8fc",def:"to hope that bad things happen to that person",unit:5,opts:["thrill", "acquaint", "cemetery", "curse"]},
    {w:"spoil",m:"\ub9dd\uce58\ub2e4, \uc0c1\ud558\ub2e4",def:"to rot or to make bad",unit:5,opts:["spoil", "riddle", "fancy", "starve"]},
    {w:"skeleton",m:"\ud574\uace8",def:"all the bones of a body",unit:5,opts:["creature", "publication", "riddle", "skeleton"]},
    {w:"disguise",m:"\ubcc0\uc7a5\ud558\ub2e4",def:"something you wear so people cannot tell who you are",unit:5,opts:["skeleton", "hood", "disguise", "creature"]},
    {w:"creature",m:"\uc0dd\ubb3c, \uc0dd\uba85\uccb4, \ucc3d\uc870\ubb3c",def:"an animal or person",unit:5,opts:["nourish", "creature", "rot", "shortly"]},
    {w:"hood",m:"\ubaa8\uc790",def:"part of a coat that goes over a person\u2019s head",unit:5,opts:["nourish", "inhabitant", "hood", "creature"]},
    {w:"nourish",m:"\uc601\uc591\ubd84\uc744 \uacf5\uae09\ud558\ub2e4",def:"to give someone or something the food needed to live",unit:5,opts:["wicked", "disguise", "nourish", "pirate"]},
    {w:"thrill",m:"\ud669\ud640\uac10, \ud765\ubd84",def:"an exciting feeling",unit:5,opts:["spoil", "wicked", "thrill", "hood"]},
    {w:"flashlight",m:"\uc190\uc804\ub4f1",def:"a small electric light that people carry in their hands",unit:5,opts:["flashlight", "creature", "pirate", "cemetery"]},
    {w:"wicked",m:"\ubabb\ub41c, \uc0ac\uc545\ud55c",def:"very bad or evil",unit:5,opts:["spoil", "wicked", "thrill", "shortly"]},
    {w:"publication",m:"\ucd9c\ud310",def:"something printed, like a newspaper or book",unit:5,opts:["skeleton", "cemetery", "publication", "pirate"]},
    {w:"shortly",m:"\uc5bc\ub9c8 \uc548\ub418\uc5b4",def:"happens very soon",unit:5,opts:["shortly", "spoil", "inhabitant", "wicked"]},
    {w:"inhabitant",m:"\uc8fc\ubbfc",def:"a person who lives in a certain place",unit:5,opts:["flashlight", "inhabitant", "shortly", "spoil"]},
  ],
  "eew3_6": [
    {w:"tap",m:"\ud1a1\ud1a1 \ub450\ub4dc\ub9ac\ub2e4",def:"to hit it lightly",unit:6,opts:["endure", "underneath", "tap", "stir"]},
    {w:"underneath",m:"~\uc758 \ubc11\uc5d0",def:"below or under",unit:6,opts:["endure", "bump", "alert", "underneath"]},
    {w:"closet",m:"\ubcbd\uc7a5",def:"a small room used to store things",unit:6,opts:["bulletin", "closet", "senator", "tap"]},
    {w:"drawer",m:"\uc11c\ub78d",def:"a small part in furniture that is used to store things",unit:6,opts:["bulletin", "execute", "drawer", "bump"]},
    {w:"worm",m:"\uc9c0\ub801\uc774",def:"a small animal with a long, thin body",unit:6,opts:["tap", "worm", "execute", "chop"]},
    {w:"chop",m:"\uc370\ub2e4",def:"to cut it into pieces with a tool",unit:6,opts:["chop", "rear", "underneath", "execute"]},
    {w:"district",m:"\uad6c\uc5ed",def:"a small part of a city, county, state, or country",unit:6,opts:["district", "drawer", "tap", "chop"]},
    {w:"bulletin",m:"(\uc911\uc694\ud55c) \uace0\uc2dc, \uacf5\uace0",def:"a news report about very recent and important events",unit:6,opts:["broadcast", "rear", "bulletin", "skull"]},
    {w:"bump",m:"\ud639",def:"a small raised area on a surface",unit:6,opts:["bump", "broadcast", "tremendous", "endure"]},
    {w:"alert",m:"\uc54c\ub9ac\ub2e4",def:"to tell or warn that person about something",unit:6,opts:["drawer", "rear", "alert", "execute"]},
    {w:"broadcast",m:"\ubc29\uc1a1",def:"a television or radio show",unit:6,opts:["broadcast", "tap", "console", "worm"]},
    {w:"endure",m:"\uacac\ub514\ub2e4, \ucc38\ub2e4",def:"to experience and survive something difficult",unit:6,opts:["underneath", "rear", "endure", "bump"]},
    {w:"tremendous",m:"\uc5c4\uccad\ub09c, \uad49\uc7a5\ud55c",def:"very large or very good",unit:6,opts:["drawer", "underneath", "tremendous", "console"]},
    {w:"senator",m:"\uc0c1\uc6d0\uc758\uc6d0",def:"someone who makes laws for a state",unit:6,opts:["senator", "district", "skull", "underneath"]},
    {w:"rear",m:"\ub4a4\ucabd",def:"the back part of that thing",unit:6,opts:["endure", "rear", "worm", "stir"]},
    {w:"execute",m:"\ucc98\ud615\ud558\ub2e4, \uc0ac\ud615\ud558\ub2e4",def:"to kill someone as a legal punishment",unit:6,opts:["district", "senator", "execute", "alert"]},
    {w:"stir",m:"\uc813\ub2e4, \uc11e\ub2e4",def:"to mix it using something small, like a spoon",unit:6,opts:["endure", "senator", "stir", "execute"]},
    {w:"console",m:"\uc704\ub85c\ud558\ub2e4",def:"to give comfort to a person who feels sad",unit:6,opts:["bump", "bulletin", "grasp", "console"]},
    {w:"skull",m:"\ub450\uac1c\uace8",def:"the hard head bone that protects the brain",unit:6,opts:["stir", "drawer", "rear", "skull"]},
    {w:"grasp",m:"\uaf49 \uc7a1\ub2e4, \uc6c0\ucf1c\uc7a1\ub2e4",def:"to hold it",unit:6,opts:["worm", "grasp", "console", "rear"]},
  ],
  "eew3_7": [
    {w:"senses",m:"\uac10\uac01",def:"how living things experience the world: sight, taste, smell, hearing and touch",unit:7,opts:["enthusiastic", "senses", "ambitious", "complaint"]},
    {w:"complaint",m:"\ubd88\ud3c9",def:"an expression of unhappiness about something.",unit:7,opts:["bay", "bark", "mayor", "complaint"]},
    {w:"overweight",m:"\ube44\ub9cc\uc758",def:"heavier than is healthy",unit:7,opts:["overweight", "abandon", "loyal", "chin"]},
    {w:"mutual",m:"\uc0c1\ud638\uac04\uc758, \uc11c\ub85c\uc758",def:"felt in the same way by two or more people",unit:7,opts:["veterinarian", "mutual", "complaint", "enthusiastic"]},
    {w:"deaf",m:"\uccad\uac01 \uc7a5\uc560\uac00 \uc788\ub294",def:"cannot hear",unit:7,opts:["abandon", "bay", "deaf", "expedition"]},
    {w:"bark",m:"(\uac1c, \uc5ec\uc6b0 \ub4f1\uc774) \uc9d6\ub2e4",def:"to make a short, loud noise, like a dog",unit:7,opts:["senses", "complaint", "bark", "deaf"]},
    {w:"chin",m:"\ud131",def:"the hard part at the bottom of a person\u2019s face",unit:7,opts:["chin", "veterinarian", "brilliant", "bark"]},
    {w:"refuge",m:"\ud53c\ub09c\ucc98",def:"a place of safety",unit:7,opts:["rub", "bay", "refuge", "bark"]},
    {w:"rub",m:"\ubb38\uc9c0\ub974\ub2e4",def:"to push on it and move your hand back and forth",unit:7,opts:["rub", "expedition", "veterinarian", "senses"]},
    {w:"veterinarian",m:"\uc218\uc758\uc0ac",def:"a doctor who takes care of animals",unit:7,opts:["senses", "expedition", "veterinarian", "loyal"]},
    {w:"restore",m:"\ubcf5\uc6d0\ud558\ub2e4",def:"to put it back the way it was",unit:7,opts:["refuge", "restore", "rub", "veterinarian"]},
    {w:"horizon",m:"\uc218\ud3c9\uc120",def:"where the sky looks like it meets the ground",unit:7,opts:["brilliant", "expedition", "horizon", "deaf"]},
    {w:"loyal",m:"\ucda9\uc2e4\ud55c",def:"always help or support a certain person or thing",unit:7,opts:["mutual", "senses", "loyal", "abandon"]},
    {w:"brilliant",m:"\ud6cc\ub96d\ud55c, \uba4b\uc9c4",def:"very bright or smart",unit:7,opts:["brilliant", "senses", "chin", "deaf"]},
    {w:"bay",m:"\ub9cc",def:"an area near the ocean where the land goes inward",unit:7,opts:["rub", "bay", "ambitious", "overweight"]},
    {w:"expedition",m:"\uc6d0\uc815, \ud0d0\ud5d8",def:"a long trip, usually to a place very far away",unit:7,opts:["enthusiastic", "expedition", "loyal", "rub"]},
    {w:"abandon",m:"\ubc84\ub9ac\ub2e4",def:"to leave it forever or for a long time",unit:7,opts:["deaf", "expedition", "abandon", "ambitious"]},
    {w:"enthusiastic",m:"\uc5f4\ub82c\ud55c, \uc5f4\uad11\uc801\uc778",def:"excited by or interested in something",unit:7,opts:["deaf", "bay", "enthusiastic", "complaint"]},
    {w:"mayor",m:"\uc2dc\uc7a5, \uad6c\uccad\uc7a5",def:"the person in charge of a city",unit:7,opts:["mayor", "mutual", "complaint", "bark"]},
    {w:"ambitious",m:"\uc57c\ub9dd \uc788\ub294",def:"person wants to be rich or successful",unit:7,opts:["rub", "chin", "enthusiastic", "ambitious"]},
  ],
  "eew3_8": [
    {w:"drip",m:"\ubc29\uc6b8\ubc29\uc6b8 \ud750\ub974\ub2e4",def:"to fall a little bit at a time",unit:8,opts:["drip", "couch", "highlands", "fabric"]},
    {w:"burst",m:"\ud130\uc9c0\ub2e4, \ud30c\uc5f4\ud558\ub2e4",def:"to suddenly break open or apart",unit:8,opts:["shed", "highlands", "upwards", "burst"]},
    {w:"ivory",m:"\uc0c1\uc544",def:"a hard, white substance that comes from elephants",unit:8,opts:["ivory", "needle", "couch", "carpenter"]},
    {w:"anniversary",m:"\uae30\ub150\uc77c",def:"a day that celebrates something from the past",unit:8,opts:["anniversary", "arithmetic", "drip", "carpenter"]},
    {w:"sew",m:"\ubc14\ub290\uc9c8\ud558\ub2e4",def:"to put pieces of cloth together using string or thread",unit:8,opts:["anniversary", "needle", "trim", "sew"]},
    {w:"shed",m:"\ud5db\uac04",def:"a small building in which people store things like tools",unit:8,opts:["ashamed", "fabric", "burst", "shed"]},
    {w:"highlands",m:"\uc0b0\uc545 \uc9c0\ub300",def:"high areas of land, usually with mountains",unit:8,opts:["drip", "trim", "polish", "highlands"]},
    {w:"coal",m:"\uc11d\ud0c4",def:"hard black material that people burn for heat",unit:8,opts:["polish", "carpenter", "fabric", "coal"]},
    {w:"elegant",m:"\uc6b0\uc544\ud55c",def:"very fancy and pleasing",unit:8,opts:["highlands", "upwards", "elegant", "burst"]},
    {w:"ashamed",m:"\ubd80\ub044\ub7ec\uc6b4",def:"feeling upset and embarrassed because of a bad action",unit:8,opts:["highlands", "ivory", "ashamed", "couch"]},
    {w:"carpenter",m:"\ubaa9\uc218",def:"a person who builds things with wood",unit:8,opts:["thread", "shed", "carpenter", "couch"]},
    {w:"couch",m:"\uae34 \uc758\uc790, \uc18c\ud30c",def:"a long, soft seat that many people can sit on",unit:8,opts:["thread", "elegant", "couch", "arithmetic"]},
    {w:"polish",m:"(\uad11\ud0dd\uc774 \ub098\ub3c4\ub85d) \ub2e6\uae30",def:"to rub it in order to make it shiny",unit:8,opts:["drip", "trim", "polish", "upwards"]},
    {w:"trim",m:"\ub2e4\ub4ec\ub2e4, \uc190\uc9c8\ud558\ub2e4",def:"to cut it a little bit",unit:8,opts:["highlands", "carpenter", "coal", "trim"]},
    {w:"upwards",m:"\uc704\ucabd\uc73c\ub85c",def:"moves vertically towards the direction above",unit:8,opts:["drip", "needle", "couch", "upwards"]},
    {w:"arithmetic",m:"\uc0b0\uc218",def:"ath",unit:8,opts:["ashamed", "sew", "arithmetic", "shed"]},
    {w:"needle",m:"\ubc14\ub298",def:"a small, sharp piece of metal used to make or fix clothes",unit:8,opts:["ivory", "ashamed", "polish", "needle"]},
    {w:"thread",m:"\uc2e4",def:"a thin piece of string",unit:8,opts:["anniversary", "arithmetic", "carpenter", "thread"]},
    {w:"fabric",m:"\uc9c1\ubb3c, \ucc9c",def:"cloth used to make clothes, furniture, etc.",unit:8,opts:["anniversary", "highlands", "fabric", "thread"]},
    {w:"mill",m:"\ubc29\uc557\uac04",def:"a building in which wheat is ground into flour",unit:8,opts:["polish", "mill", "couch", "needle"]},
  ],
  "eew3_9": [
    {w:"nod",m:"(\uace0\uac1c\ub97c) \ub044\ub355\uc774\ub2e4",def:"to move your head up and down",unit:9,opts:["opponent", "nod", "carbohydrate", "defeat"]},
    {w:"entire",m:"\uc804\uccb4\uc758",def:"the whole thing or group",unit:9,opts:["sting", "entire", "opponent", "strain"]},
    {w:"opponent",m:"\uc0c1\ub300",def:"a person or group trying to defeat another person or group",unit:9,opts:["mercy", "opponent", "bounce", "boast"]},
    {w:"mercy",m:"\uc790\ube44, \uace0\ub9c8\uc6b4 \uc77c",def:"a feeling or act of kindness",unit:9,opts:["mercy", "rival", "nod", "dial"]},
    {w:"bully",m:"\uc57d\uc790\ub97c \uad34\ub86d\ud788\ub294 \uc0ac\ub78c",def:"a person who is mean to others",unit:9,opts:["bounce", "torture", "quarrel", "bully"]},
    {w:"dominant",m:"\uc6b0\uc138\ud55c, \uc9c0\ubc30\uc801\uc778",def:"stronger than others",unit:9,opts:["boast", "dominant", "defeat", "wrestle"]},
    {w:"rival",m:"\uacbd\uc7c1\uc790",def:"someone trying to achieve the same thing as another",unit:9,opts:["sting", "bully", "mercy", "rival"]},
    {w:"sting",m:"(~\uc73c\ub85c) \ucc0c\ub974\ub4ef \uc544\ud504\ub2e4",def:"to cause pain by pushing a sharp part into the skin",unit:9,opts:["opponent", "sore", "torture", "sting"]},
    {w:"boast",m:"\uc790\ub791\ud558\ub2e4",def:"to talk about how great one is",unit:9,opts:["torture", "boast", "bounce", "bully"]},
    {w:"ally",m:"\ud611\ub825\uc790",def:"someone who agrees to help or support another person or group",unit:9,opts:["dial", "opponent", "ally", "mercy"]},
    {w:"strain",m:"\uc548\uac04\ud798\uc744 \uc4f0\ub2e4",def:"to try very hard",unit:9,opts:["defeat", "strain", "bully", "boast"]},
    {w:"sore",m:"\uc544\ud508",def:"feeling or causing pain",unit:9,opts:["sore", "ally", "nod", "defeat"]},
    {w:"dial",m:"(\uc2dc\uacc4 \ub4f1\uc758) \ubb38\uc790\ubc18",def:"a circular tool, like the front of a clock",unit:9,opts:["mercy", "torture", "dial", "nod"]},
    {w:"carbohydrate",m:"\ud0c4\uc218\ud654\ubb3c",def:"substances in foods like bread that give energy",unit:9,opts:["quarrel", "strain", "carbohydrate", "ally"]},
    {w:"wrestle",m:"\ubab8\uc2f8\uc6c0\uc744 \ubc8c\uc774\ub2e4",def:"to try to push another competitor to the floor",unit:9,opts:["ally", "wrestle", "opponent", "nod"]},
    {w:"torture",m:"\uace0\ubb38",def:"action that causes physical or mental pain",unit:9,opts:["torture", "dominant", "sore", "strain"]},
    {w:"defeat",m:"(\uc804\uc7c1, \uc2dc\ud569\ub4f1\uc5d0\uc11c \uc0c1\ub300\ub97c) \ud328\ubc30\uc2dc\ud0a4\ub2e4",def:"to beat that person in a game or battle",unit:9,opts:["defeat", "torture", "opponent", "quarrel"]},
    {w:"crawl",m:"(\uc5ce\ub4dc\ub824) \uae30\ub2e4",def:"to move slowly on hands and knees",unit:9,opts:["dominant", "wrestle", "mercy", "crawl"]},
    {w:"bounce",m:"\ud280\ub2e4",def:"to move up and away from a surface after hitting it",unit:9,opts:["bounce", "boast", "entire", "dial"]},
    {w:"quarrel",m:"\ub9d0\ub2e4\ud23c",def:"to argue or fight",unit:9,opts:["sore", "quarrel", "carbohydrate", "ally"]},
  ],
  "eew3_10": [
    {w:"wagon",m:"\uc218\ub808",def:"a cart used to carry heavy things",unit:10,opts:["wagon", "blanket", "wrinkle", "imitate"]},
    {w:"absence",m:"\uacb0\uc11d, \uacb0\uadfc, \ubd80\uc7ac",def:"the state of something being away",unit:10,opts:["absence", "nowhere", "blanket", "suck"]},
    {w:"rhyme",m:"\uc6b4 (\uc74c\uc870\uac00 \ube44\uc2b7\ud55c \uae00\uc790)",def:"writing or speech that has words with the same ending sounds",unit:10,opts:["urgent", "imitate", "rhyme", "blanket"]},
    {w:"suck",m:"\ube68\uc544\uba39\ub2e4",def:"to put something in your mouth and try to get something out of it",unit:10,opts:["rhyme", "suck", "blanket", "absence"]},
    {w:"relief",m:"\uc548\ub3c4, \uc548\uc2ec",def:"a good feeling after something bad or challenging ends",unit:10,opts:["suck", "rhyme", "relief", "nowhere"]},
    {w:"pat",m:"\uc4f0\ub2e4\ub4ec\ub2e4",def:"to hit it softly with your hand",unit:10,opts:["pat", "imitate", "aloud", "kidnap"]},
    {w:"kidnap",m:"\ub0a9\uce58\ud558\ub2e4",def:"to take that person illegally",unit:10,opts:["aloud", "wrinkle", "blanket", "kidnap"]},
    {w:"vanish",m:"\uc0ac\ub77c\uc9c0\ub2e4",def:"to go away suddenly",unit:10,opts:["divorce", "nap", "pat", "vanish"]},
    {w:"aloud",m:"\ud070\uc18c\ub9ac\ub85c",def:"done so that people can hear it",unit:10,opts:["aloud", "infant", "imitate", "suck"]},
    {w:"bald",m:"\ub300\uba38\ub9ac\uc758",def:"has no hair",unit:10,opts:["bald", "nap", "rhyme", "relief"]},
    {w:"creep",m:"\uc0b4\uae08\uc0b4\uae08 \uc6c0\uc9c1\uc774\ub2e4",def:"to move quietly and slowly",unit:10,opts:["nowhere", "creep", "suck", "absence"]},
    {w:"blanket",m:"\ub2f4\uc694",def:"a piece of cloth that people use to keep warm or to sit upon",unit:10,opts:["wagon", "kidnap", "vanish", "blanket"]},
    {w:"nap",m:"\ub0ae\uc7a0",def:"a short sleep, usually during the day",unit:10,opts:["kidnap", "nowhere", "infant", "nap"]},
    {w:"wrinkle",m:"\uc8fc\ub984",def:"a line on a person\u2019s face that appears as they get old",unit:10,opts:["divorce", "wrinkle", "nowhere", "blanket"]},
    {w:"divorce",m:"\uc774\ud63c",def:"the process of ending a marriage",unit:10,opts:["blanket", "divorce", "relief", "reproduce"]},
    {w:"nowhere",m:"\uc544\ubb34\ub370\ub3c4 (\uc5c6\ub2e4)",def:"no place or not existing",unit:10,opts:["nowhere", "pat", "creep", "kidnap"]},
    {w:"infant",m:"\uc720\uc544",def:"a baby",unit:10,opts:["wagon", "relief", "bald", "infant"]},
    {w:"urgent",m:"\uae34\uae09\ud55c",def:"important and needs to be done now",unit:10,opts:["urgent", "creep", "aloud", "divorce"]},
    {w:"reproduce",m:"\ubcf5\uc0ac\ud558\ub2e4, \ubcf5\uc81c\ud558\ub2e4",def:"to make something exactly how someone else did it",unit:10,opts:["absence", "reproduce", "suck", "relief"]},
    {w:"imitate",m:"\ubaa8\ubc29\ud558\ub2e4",def:"to act in the exact same way",unit:10,opts:["imitate", "pat", "aloud", "divorce"]},
  ],
  "eew3_11": [
    {w:"guest",m:"\uc190\ub2d8",def:"someone who is invited to an event, occasion, or location",unit:11,opts:["gallery", "theater", "july", "guest"]},
    {w:"desk",m:"\ucc45\uc0c1",def:"a piece of furniture that people sit at to do work",unit:11,opts:["pink", "welcome", "host", "desk"]},
    {w:"cousin",m:"\uc0ac\ucd0c",def:"the child of one\u2019s aunt and uncle",unit:11,opts:["pink", "upper", "temperature", "cousin"]},
    {w:"carpet",m:"\uce74\ud398\ud2b8",def:"a thick, heavy, woven fabric used to cover the floor",unit:11,opts:["desk", "carpet", "cousin", "museum"]},
    {w:"temperature",m:"\uc628\ub3c4, \uae30\uc628",def:"a measure of how hot or cold something is",unit:11,opts:["museum", "temperature", "carpet", "host"]},
    {w:"host",m:"\uc8fc\uc778",def:"someone who invites a guest someplace",unit:11,opts:["welcome", "host", "theater", "bloom"]},
    {w:"pink",m:"\ubd84\ud64d\uc0c9\uc758",def:"a pale shade of red",unit:11,opts:["architecture", "pink", "host", "modern"]},
    {w:"theater",m:"\uc601\ud654\uad00, \uadf9\uc7a5",def:"a place where people can watch movies or live shows",unit:11,opts:["pink", "architecture", "museum", "theater"]},
    {w:"basket",m:"\ubc14\uad6c\ub2c8",def:"a container made of woven materials that is used to carry things",unit:11,opts:["bloom", "basket", "canoe", "guest"]},
    {w:"architecture",m:"\uac74\ucd95\ud559",def:"the design and form of a building",unit:11,opts:["host", "desk", "architecture", "carpet"]},
    {w:"gallery",m:"\ubbf8\uc220\uad00",def:"a large space where people can see works of art",unit:11,opts:["gallery", "architecture", "modern", "desk"]},
    {w:"upper",m:"\ub354 \uc704\uc5d0 \uc788\ub294",def:"a higher position",unit:11,opts:["canoe", "upper", "pink", "museum"]},
    {w:"museum",m:"\ubc15\ubb3c\uad00",def:"a building that displays cultural, social, and scientific objects",unit:11,opts:["carpet", "refrigerator", "museum", "bloom"]},
    {w:"bloom",m:"\uaf43\uc774 \ud53c\ub2e4",def:"to produce an open flower",unit:11,opts:["bloom", "temperature", "welcome", "plane"]},
    {w:"plane",m:"\ube44\ud589\uae30",def:"a vehicle that has an engine and wings and flies in the air",unit:11,opts:["plane", "gallery", "museum", "welcome"]},
    {w:"welcome",m:"\ud658\uc601\ud558\ub2e4",def:"to greet someone or something with pleasure",unit:11,opts:["canoe", "welcome", "upper", "july"]},
    {w:"refrigerator",m:"\ub0c9\uc7a5\uace0",def:"a large electrical machine used to keep food cold",unit:11,opts:["refrigerator", "desk", "temperature", "canoe"]},
    {w:"modern",m:"\ud604\ub300\uc2dd\uc758",def:"belongs to the current time",unit:11,opts:["modern", "architecture", "canoe", "temperature"]},
    {w:"july",m:"7\uc6d4",def:"The seventh month of the year",unit:11,opts:["upper", "july", "gallery", "host"]},
    {w:"canoe",m:"\uce74\ub204",def:"a long, light boat with pointed ends",unit:11,opts:["canoe", "modern", "plane", "temperature"]},
  ],
  "eew3_12": [
    {w:"scatter",m:"\ud769\ubfcc\ub9ac\ub2e4",def:"to make it go in many places",unit:12,opts:["scatter", "anticipate", "triumph", "germ"]},
    {w:"toss",m:"(\uac00\ubccd\uac8c) \ub358\uc9c0\ub2e4",def:"to throw it softly",unit:12,opts:["toss", "anticipate", "germ", "contrary"]},
    {w:"anticipate",m:"\uae30\ub300\ud558\ub2e4",def:"to think that it will happen",unit:12,opts:["triumph", "contrary", "rag", "anticipate"]},
    {w:"steel",m:"\uac15\ucca0",def:"a strong gray metal",unit:12,opts:["caution", "contrary", "explode", "steel"]},
    {w:"explode",m:"\ud130\uc9c0\ub2e4, \ud3ed\ubc1c\ud558\ub2e4",def:"to suddenly move apart in many smaller pieces",unit:12,opts:["deliberate", "explode", "germ", "anticipate"]},
    {w:"fasten",m:"\ub9e4\ub2e4",def:"to close it or attach it to something",unit:12,opts:["fasten", "dissolve", "kit", "triumph"]},
    {w:"rag",m:"\ud589\uc8fc",def:"a small towel",unit:12,opts:["rag", "casual", "kit", "scatter"]},
    {w:"contrary",m:"~\uc640\ub294 \ub2e4\ub978",def:"the opposite to another thing",unit:12,opts:["casual", "kit", "contrary", "scatter"]},
    {w:"deliberate",m:"\uace0\uc758\uc758, \uc758\ub3c4\uc801\uc778",def:"one done on purpose, not by accident",unit:12,opts:["deliberate", "kit", "barrel", "fasten"]},
    {w:"barrel",m:"(\ubaa9\uc7ac, \uae08\uc18d\uc73c\ub85c \ub41c \ub300\ud615) \ud1b5",def:"a round thing that you can keep liquids in",unit:12,opts:["barrel", "explode", "rag", "germ"]},
    {w:"beam",m:"\uae30\ub465",def:"a heavy bar",unit:12,opts:["fasten", "anticipate", "beam", "dissolve"]},
    {w:"caution",m:"\uacbd\uace0(\ubb38)",def:"care and attention in order to avoid danger",unit:12,opts:["anticipate", "triumph", "caution", "scatter"]},
    {w:"triumph",m:"\uc5c5\uc801, \ub300\uc131\uacf5",def:"the act or feeling of winning",unit:12,opts:["contrary", "rag", "triumph", "swift"]},
    {w:"casual",m:"\uaca9\uc2dd\uc744 \ucc28\ub9ac\uc9c0 \uc54a\ub294, \ud3c9\uc0c1\uc2dc\uc758",def:"relaxed or simple",unit:12,opts:["swift", "steel", "barrel", "casual"]},
    {w:"puff",m:"(\ubc14\ub78c, \uc5f0\uae30 \ub4f1\uc758) \ud55c \ubaa8\uae08",def:"a little bit of smoke or steam",unit:12,opts:["toss", "swift", "casual", "puff"]},
    {w:"scent",m:"\ud5a5\uae30",def:"a smell",unit:12,opts:["scent", "swift", "caution", "beam"]},
    {w:"dissolve",m:"\ub179\ub2e4, \uc6a9\ud574\ub418\ub2e4",def:"to mix it into a liquid until it disappears",unit:12,opts:["puff", "contrary", "beam", "dissolve"]},
    {w:"swift",m:"\uc2e0\uc18d\ud55c, \ube60\ub978",def:"fast",unit:12,opts:["scent", "explode", "swift", "deliberate"]},
    {w:"kit",m:"(\ub3c4\uad6c, \uc7a5\ube44) \uc138\ud2b8",def:"a set of all the things needed to do something",unit:12,opts:["deliberate", "kit", "scent", "germ"]},
    {w:"germ",m:"\uc138\uade0, \ubbf8\uc0dd\ubb3c",def:"a very small living thing that can make people sick",unit:12,opts:["scatter", "swift", "germ", "anticipate"]},
  ],
  "eew3_13": [
    {w:"sheriff",m:"\ubcf4\uc548\uad00",def:"a police officer who is in charge of a large area",unit:13,opts:["voyage", "sheriff", "march", "vessel"]},
    {w:"unify",m:"\ud1b5\ud569\ud558\ub2e4, \ud1b5\uc77c\ud558\ub2e4",def:"to bring people or things together",unit:13,opts:["vessel", "unify", "worship", "inhabit"]},
    {w:"millionaire",m:"\ubc31\ub9cc\uc7a5\uc790",def:"a person who has at least a million dollars",unit:13,opts:["millionaire", "fountain", "sweat", "aboard"]},
    {w:"worship",m:"\uc608\ubc30\ud558\ub2e4, \uc22d\ubc30\ud558\ub2e4",def:"to like and honor a person, thing, or religious figure",unit:13,opts:["bitter", "sweat", "drift", "worship"]},
    {w:"startle",m:"\uae5c\uc9dd \ub180\ub77c\uac8c \ud558\ub2e4",def:"to scare someone suddenly",unit:13,opts:["millionaire", "startle", "march", "voyage"]},
    {w:"fountain",m:"\ubd84\uc218",def:"a source of water made by people",unit:13,opts:["fountain", "devil", "enforce", "bullet"]},
    {w:"port",m:"\ud56d\uad6c",def:"a place where ships stop to load and unload things",unit:13,opts:["vessel", "sheriff", "millionaire", "port"]},
    {w:"vessel",m:"\uc120\ubc15",def:"a large ship or boat",unit:13,opts:["worship", "fountain", "march", "vessel"]},
    {w:"march",m:"\ud589\uad70\ud558\ub2e4",def:"to walk at a steady pace together with others",unit:13,opts:["startle", "march", "aboard", "port"]},
    {w:"voyage",m:"\uc5ec\ud589",def:"a long journey made on a boat or an aircraft",unit:13,opts:["millionaire", "inhabit", "enforce", "voyage"]},
    {w:"bitter",m:"\uaca9\ub82c\ud55c, \ubd84\uac1c\ud558\ub294",def:"feels upset or angry about something",unit:13,opts:["drift", "enforce", "millionaire", "bitter"]},
    {w:"devil",m:"\uc545\ub9c8",def:"a powerful evil spirit in some religions",unit:13,opts:["vessel", "enforce", "devil", "bitter"]},
    {w:"inhabit",m:"\uac70\uc8fc\ud558\ub2e4, \uc0b4\ub2e4",def:"to live in a certain place",unit:13,opts:["worship", "vessel", "inhabit", "aboard"]},
    {w:"drift",m:"\ub5a0\uac00\ub2e4, \ud45c\ub958\ud558\ub2e4",def:"to be moved slowly by wind or water",unit:13,opts:["drift", "sheriff", "enforce", "fountain"]},
    {w:"sweat",m:"\ub540\uc744 \ud758\ub9ac\ub2e4",def:"to lose liquid from the body through the skin",unit:13,opts:["trigger", "worship", "inhabit", "sweat"]},
    {w:"aboard",m:"\ud0d1\uc2b9\ud55c",def:"aboard a ship or plane is in or on it",unit:13,opts:["sweat", "harbor", "voyage", "aboard"]},
    {w:"bullet",m:"\ucd1d\uc54c",def:"a small metal object that is shot out of a gun",unit:13,opts:["bullet", "enforce", "port", "voyage"]},
    {w:"enforce",m:"\uc9d1\ud589\ud558\ub2e4, \uc2e4\uc2dc\ud558\ub2e4",def:"to make a person follow a rule",unit:13,opts:["sweat", "enforce", "fountain", "unify"]},
    {w:"trigger",m:"\ubc29\uc544\uc1e0",def:"the part of a gun that a person pulls to make it fire",unit:13,opts:["devil", "sweat", "trigger", "bitter"]},
    {w:"harbor",m:"\ud56d\uad6c",def:"an area of water along a shore where boats land",unit:13,opts:["march", "harbor", "enforce", "bitter"]},
  ],
  "eew3_14": [
    {w:"crown",m:"\uc655\uad00",def:"the hat worn by a king or queen",unit:14,opts:["robe", "bond", "crown", "emperor"]},
    {w:"luxury",m:"\uc0ac\uce58",def:"an expensive thing that is nice but not needed",unit:14,opts:["fiber", "luxury", "assure", "massive"]},
    {w:"bandage",m:"\ubd95\ub300",def:"a piece of cloth used to stop bleeding",unit:14,opts:["bandage", "crown", "horrible", "assure"]},
    {w:"departure",m:"\ucd9c\ubc1c",def:"the act of leaving a place",unit:14,opts:["priority", "departure", "crown", "diligent"]},
    {w:"impolite",m:"\ubb34\ub840\ud55c",def:"rude, or not polite",unit:14,opts:["assure", "bleed", "impolite", "departure"]},
    {w:"assure",m:"\ubcf4\uc7a5\ud558\ub2e4, \uc7a5\ub2f4\ud558\ub2e4",def:"to tell them something is true to make them less worried",unit:14,opts:["assure", "diligent", "departure", "scold"]},
    {w:"apprentice",m:"\uacac\uc2b5\uc0dd",def:"a person who learns how to do a job from a skilled person",unit:14,opts:["crown", "apprentice", "emperor", "impolite"]},
    {w:"bond",m:"\uc720\ub300\uac10\uc744 \ud615\uc131\ud558\ub2e4",def:"to become friends with person",unit:14,opts:["robe", "bandage", "bond", "panic"]},
    {w:"emperor",m:"\ud669\uc81c",def:"he leader of a group of countries",unit:14,opts:["chef", "emperor", "bleed", "luxury"]},
    {w:"chef",m:"\uc694\ub9ac\uc0ac",def:"a person who cooks in a restaurant",unit:14,opts:["kneel", "chef", "bleed", "impolite"]},
    {w:"kneel",m:"\ubb34\ub98e\uc744 \uafc7\ub2e4",def:"to put one or both knees on the ground",unit:14,opts:["kneel", "crown", "panic", "departure"]},
    {w:"robe",m:"\uc608\ubcf5",def:"a long, loose piece of clothing",unit:14,opts:["crown", "robe", "diligent", "impolite"]},
    {w:"bleed",m:"\ud53c\ub97c \ud758\ub9ac\ub2e4",def:"to lose blood",unit:14,opts:["massive", "impolite", "bleed", "emperor"]},
    {w:"panic",m:"\uac81\uc5d0 \uc9c8\ub824 \uc5b4\uca54 \uc904 \ubaa8\ub974\ub2e4",def:"to feel so nervous or afraid that one cannot think clearly",unit:14,opts:["scold", "crown", "luxury", "panic"]},
    {w:"fiber",m:"\uc12c\uc720",def:"a thread of a substance used to make clothes or rope",unit:14,opts:["impolite", "diligent", "fiber", "priority"]},
    {w:"massive",m:"\uac70\ub300\ud55c",def:"very big",unit:14,opts:["luxury", "emperor", "massive", "panic"]},
    {w:"diligent",m:"\uadfc\uba74\ud55c",def:"works hard and is careful",unit:14,opts:["diligent", "massive", "chef", "fiber"]},
    {w:"scold",m:"\uc57c\ub2e8\uce58\ub2e4, \uafb8\uc9d6\ub2e4",def:"to criticize someone angrily for doing something wrong",unit:14,opts:["kneel", "apprentice", "impolite", "scold"]},
    {w:"priority",m:"\uc6b0\uc120\uc21c\uc704",def:"something that is more important than other things",unit:14,opts:["scold", "impolite", "priority", "bandage"]},
    {w:"horrible",m:"\ub054\ucc0d\ud55c, \uc9c0\uae0b\uc9c0\uae0b\ud55c",def:"very bad",unit:14,opts:["robe", "priority", "horrible", "kneel"]},
  ],
  "eew3_15": [
    {w:"stove",m:"\uc2a4\ud1a0\ube0c, \uac00\uc2a4 \ub808\uc778\uc9c0",def:"device used to cook food",unit:15,opts:["affair", "ripe", "scheme", "stove"]},
    {w:"slim",m:"\ub0a0\uc52c\ud55c",def:"thin, not thick",unit:15,opts:["pardon", "theft", "diameter", "slim"]},
    {w:"diameter",m:"\uc9c0\ub984",def:"diameter of a round thing is the length across its center",unit:15,opts:["cheerful", "theft", "assembly", "diameter"]},
    {w:"nut",m:"\uacac\uacfc\ub958",def:"a hard seed or fruit that comes from some trees and bushes",unit:15,opts:["famine", "nut", "bless", "pardon"]},
    {w:"cereal",m:"\uc2dc\ub9ac\uc5bc",def:"a breakfast food made from grains that is eaten with milk",unit:15,opts:["roast", "merry", "nut", "cereal"]},
    {w:"theft",m:"\uc808\ub3c4",def:"a criminal act that involves someone stealing something",unit:15,opts:["cheerful", "theft", "pharaoh", "ripe"]},
    {w:"scheme",m:"\uacc4\ud68d",def:"a plan or design",unit:15,opts:["affair", "bless", "theft", "scheme"]},
    {w:"roast",m:"\uad7d\ub2e4",def:"to cook it in an oven or over a fire",unit:15,opts:["routine", "roast", "bless", "famine"]},
    {w:"bless",m:"(\uc2e0\uc758) \uac00\ud638\ub97c \ube4c\ub2e4",def:"to ask God for protection or help",unit:15,opts:["bless", "pardon", "merry", "ripe"]},
    {w:"harvest",m:"\uc218\ud655, \ucd94\uc218",def:"the act of collecting food from farming",unit:15,opts:["roast", "scheme", "harvest", "cheerful"]},
    {w:"assembly",m:"\uc9d1\ud68c",def:"a group gathered together for the same reason",unit:15,opts:["stove", "harvest", "pharaoh", "assembly"]},
    {w:"cheerful",m:"\ubc1c\ub784\ud55c, \ucf8c\ud65c\ud55c",def:"happy and pleasant",unit:15,opts:["pharaoh", "routine", "cheerful", "roast"]},
    {w:"affair",m:"\uc77c, \uc0ac\uac74",def:"an event or a thing that happened",unit:15,opts:["roast", "affair", "slim", "famine"]},
    {w:"famine",m:"\uae30\uadfc",def:"a long time with little or no food",unit:15,opts:["famine", "cereal", "exploit", "cheerful"]},
    {w:"exploit",m:"\ucc29\ucde8\ud558\ub2e4",def:"to use it for greedy reasons rather than good reasons",unit:15,opts:["scheme", "slim", "exploit", "nut"]},
    {w:"pharaoh",m:"\ud30c\ub77c\uc624",def:"a king in ancient Egypt",unit:15,opts:["pharaoh", "nut", "routine", "harvest"]},
    {w:"ripe",m:"\uc775\uc740",def:"ready to be eaten",unit:15,opts:["nut", "harvest", "routine", "ripe"]},
    {w:"merry",m:"\uc990\uac70\uc6b4, \uba85\ub791\ud55c",def:"happy and pleasant",unit:15,opts:["merry", "nut", "exploit", "assembly"]},
    {w:"routine",m:"\uaddc\uce59\uc801\uc73c\ub85c \ud558\ub294 \uc77c",def:"a way of doing things that is the same every time",unit:15,opts:["harvest", "affair", "assembly", "routine"]},
    {w:"pardon",m:"\uc6a9\uc11c\ud558\ub2e4",def:"to not be angry at someone for asking a question or for making a mistake",unit:15,opts:["cheerful", "pardon", "harvest", "bless"]},
  ],
  "eew3_16": [
    {w:"justice",m:"\uacf5\ud3c9\uc131",def:"fairness in the way that people are treated",unit:16,opts:["pharmacy", "privacy", "justice", "literary"]},
    {w:"hinder",m:"\ubc29\ud574\ud558\ub2e4",def:"to stop someone or something from doing something",unit:16,opts:["hinder", "aptitude", "jury", "pill"]},
    {w:"jury",m:"\ubc30\uc2ec\uc6d0\ub2e8",def:"a group of people that listen to a trial and say if someone is guilty",unit:16,opts:["pill", "jury", "hinder", "punishment"]},
    {w:"sensible",m:"\ud604\uba85\ud55c",def:"good and smart",unit:16,opts:["sensible", "presume", "aptitude", "straw"]},
    {w:"aptitude",m:"\uc801\uc131, \uc18c\uc9c8",def:"a natural ability or skill",unit:16,opts:["liberty", "pill", "aptitude", "sensible"]},
    {w:"slice",m:"\uc870\uac01, \ubd80\ubd84",def:"a piece from something larger, such as a cake",unit:16,opts:["presume", "sensible", "slice", "tidy"]},
    {w:"swell",m:"\ubd93\ub2e4, \ubd80\ud480\uc5b4\uc624\ub974\ub2e4",def:"to become larger and rounder",unit:16,opts:["swell", "sensible", "slice", "journalism"]},
    {w:"journalism",m:"\uc800\ub110\ub9ac\uc998",def:"the work of collecting the news to put in newspapers or on TV",unit:16,opts:["presume", "journalism", "swell", "jury"]},
    {w:"liberty",m:"\uc790\uc720",def:"freedom to do what one wants",unit:16,opts:["liberty", "pharmacy", "presume", "sorrow"]},
    {w:"pill",m:"\uc54c\uc57d",def:"a small object that has medicine inside",unit:16,opts:["presume", "straw", "pill", "privacy"]},
    {w:"straw",m:"\ube68\ub300",def:"a thin tube that is used to suck liquid into the mouth",unit:16,opts:["justice", "jury", "journalism", "straw"]},
    {w:"compliment",m:"\uce6d\ucc2c",def:"to say a nice thing about someone or something",unit:16,opts:["journalism", "compliment", "liberty", "adolescent"]},
    {w:"presume",m:"\ucd94\uc815\ud558\ub2e4",def:"to believe something is true without being certain",unit:16,opts:["presume", "compliment", "justice", "jury"]},
    {w:"tidy",m:"\uae54\ub054\ud55c",def:"clean and in order",unit:16,opts:["sensible", "punishment", "tidy", "hinder"]},
    {w:"pharmacy",m:"\uc57d\uad6d",def:"a place where medicine is sold",unit:16,opts:["pharmacy", "liberty", "privacy", "presume"]},
    {w:"sorrow",m:"\uc2ac\ud514",def:"a very sad feeling",unit:16,opts:["compliment", "presume", "straw", "sorrow"]},
    {w:"privacy",m:"\uc0ac\uc0dd\ud65c",def:"the state of being happily away from other people",unit:16,opts:["tidy", "pharmacy", "straw", "privacy"]},
    {w:"literary",m:"\ubb38\ud559\uc758, \ubb38\ud559\uc801\uc778",def:"involved with literature in some way",unit:16,opts:["journalism", "hinder", "liberty", "literary"]},
    {w:"punishment",m:"\ubc8c, \ucc98\ubc8c",def:"something that one must endure for any wrongdoing",unit:16,opts:["punishment", "privacy", "jury", "presume"]},
    {w:"adolescent",m:"\uccad\uc18c\ub144",def:"a young person or a teenager",unit:16,opts:["literary", "pill", "adolescent", "swell"]},
  ],
  "eew3_17": [
    {w:"remainder",m:"\ub098\uba38\uc9c0",def:"what is left",unit:17,opts:["slope", "erupt", "superstition", "remainder"]},
    {w:"erupt",m:"\ubd84\ucd9c\ud558\ub2e4",def:"to explode or blow apart, especially a volcano",unit:17,opts:["sympathy", "confine", "dismiss", "erupt"]},
    {w:"ash",m:"\uc7ac, \uc7bf\ub354\ubbf8",def:"the grey or black powder created when something is burned",unit:17,opts:["remainder", "retrieve", "dismiss", "ash"]},
    {w:"vibrate",m:"\ub5a8\ub2e4, \uc9c4\ub3d9\ud558\ub2e4",def:"to shake very hard",unit:17,opts:["fate", "vibrate", "navigate", "remainder"]},
    {w:"fate",m:"\uc6b4\uba85",def:"a power that causes things to happen",unit:17,opts:["fate", "ash", "wander", "slope"]},
    {w:"confine",m:"\uac00\ub450\ub2e4",def:"to keep it in one place",unit:17,opts:["ash", "lava", "confine", "span"]},
    {w:"lava",m:"\uc6a9\uc554",def:"the hot substance made of melted rock that comes out of volcanoes",unit:17,opts:["erupt", "miserable", "affection", "lava"]},
    {w:"sympathy",m:"\ub3d9\uc815, \uc5f0\ubbfc",def:"a feeling of sadness for another person who feels bad",unit:17,opts:["span", "fate", "wander", "sympathy"]},
    {w:"agency",m:"\ub300\ub9ac\uc810, \ub300\ud589\uc0ac",def:"a business or service set up to act for others",unit:17,opts:["agency", "dismiss", "wander", "vibrate"]},
    {w:"slope",m:"\uacbd\uc0ac\uc9c0",def:"ground that is not flat",unit:17,opts:["slope", "retrieve", "originate", "dismiss"]},
    {w:"wander",m:"\uac70\ub2d0\ub2e4, \ub3cc\uc544\ub2e4\ub2c8\ub2e4",def:"to walk without going to a certain place",unit:17,opts:["agency", "fate", "affection", "wander"]},
    {w:"superstition",m:"\ubbf8\uc2e0",def:"something magical that people believe is real",unit:17,opts:["superstition", "affection", "agency", "sympathy"]},
    {w:"originate",m:"\ube44\ub86f\ub418\ub2e4, \uc720\ub798\ud558\ub2e4",def:"to start there",unit:17,opts:["dismiss", "originate", "span", "slope"]},
    {w:"miserable",m:"\ube44\ucc38\ud55c",def:"very unhappy",unit:17,opts:["originate", "erupt", "wander", "miserable"]},
    {w:"shallow",m:"\uc595\uc740",def:"not deep",unit:17,opts:["sympathy", "navigate", "retrieve", "shallow"]},
    {w:"span",m:"(\uc5bc\ub9c8\uc758 \uae30\uac04\uc5d0) \uac78\uce58\ub2e4",def:"to spread across an amount of time or space",unit:17,opts:["remainder", "span", "fate", "confine"]},
    {w:"affection",m:"\uc560\ucc29, \uc560\uc815",def:"a feeling of liking someone or something",unit:17,opts:["wander", "shallow", "affection", "slope"]},
    {w:"retrieve",m:"\ub418\ucc3e\uc544\uc624\ub2e4",def:"to find it and get it back",unit:17,opts:["ash", "retrieve", "shallow", "sympathy"]},
    {w:"navigate",m:"\uc870\uc885\ud558\ub2e4",def:"to control the way it moves or goes",unit:17,opts:["erupt", "affection", "navigate", "slope"]},
    {w:"dismiss",m:"\ubb35\uc0b4\ud558\ub2e4",def:"to say it is not important",unit:17,opts:["dismiss", "agency", "ash", "originate"]},
  ],
  "eew3_18": [
    {w:"boom",m:"\ucf85\ud558\ub294 \uc18c\ub9ac\ub97c \ub0b4\ub2e4",def:"to make a loud, deep sound",unit:18,opts:["knight", "boom", "spear", "thunder"]},
    {w:"yield",m:"\ud56d\ubcf5\ud558\ub2e4, \uad74\ubcf5\ud558\ub2e4",def:"to give up control of it or to give it away",unit:18,opts:["summit", "rebel", "boom", "yield"]},
    {w:"lightning",m:"\ubc88\uac1c",def:"the bright light seen during a storm",unit:18,opts:["knight", "retreat", "lightning", "warrior"]},
    {w:"rebel",m:"\ubc18\uc5ed\uc790",def:"a person who fights the government in order to change it",unit:18,opts:["rebel", "armor", "flame", "steep"]},
    {w:"revolution",m:"\ud601\uba85",def:"a change to the political system by a group of people",unit:18,opts:["armor", "revolution", "independence", "blaze"]},
    {w:"blaze",m:"\ud65c\ud65c \ud0c0\ub2e4",def:"to burn brightly or powerfully",unit:18,opts:["spear", "withdraw", "blaze", "boom"]},
    {w:"retreat",m:"\ud6c4\ud1f4\ud558\ub2e4",def:"to run away because of losing a fight",unit:18,opts:["yield", "armor", "steep", "retreat"]},
    {w:"knight",m:"\uae30\uc0ac",def:"a soldier of high rank and skill who usually serves a king",unit:18,opts:["retreat", "knight", "summit", "boom"]},
    {w:"steep",m:"\uac00\ud30c\ub978, \ube44\ud0c8\uc9c4",def:"a slope or angle that rises or falls sharply",unit:18,opts:["rebel", "spear", "knight", "steep"]},
    {w:"warrior",m:"\uc804\uc0ac",def:"a brave soldier or fighter",unit:18,opts:["warrior", "independence", "spear", "retreat"]},
    {w:"thunder",m:"\ucc9c\ub465",def:"the loud noise heard during a storm",unit:18,opts:["steep", "thunder", "flame", "withdraw"]},
    {w:"troops",m:"\ubcd1\ub825, \uad70\ub300",def:"soldiers that fight in groups in a battle",unit:18,opts:["troops", "spear", "steep", "yield"]},
    {w:"flame",m:"\ubd88\uae38, \ubd88\uaf43",def:"part of a fire",unit:18,opts:["thunder", "troops", "flame", "spear"]},
    {w:"independence",m:"\ub3c5\ub9bd",def:"the state of being free from the control of others",unit:18,opts:["invasion", "independence", "withdraw", "flame"]},
    {w:"armor",m:"\uac11\uc637",def:"metal worn by soldiers to protect the body",unit:18,opts:["armor", "spear", "cliff", "revolution"]},
    {w:"summit",m:"\uc815\uc0c1, \uc0b0\uaf2d\ub300\uae30",def:"the highest part of a hill or mountain",unit:18,opts:["lightning", "spear", "summit", "steep"]},
    {w:"spear",m:"\ucc3d",def:"a long stick with a blade on one end that is used as a weapon",unit:18,opts:["flame", "cliff", "knight", "spear"]},
    {w:"invasion",m:"\uce68\ub7b5, \uce68\uc785",def:"an attack by a group from another country",unit:18,opts:["invasion", "steep", "summit", "knight"]},
    {w:"withdraw",m:"\ubb3c\ub7ec\ub098\ub2e4, \ucca0\uc218\ud558\ub2e4",def:"to leave a place, usually during war",unit:18,opts:["revolution", "yield", "warrior", "withdraw"]},
    {w:"cliff",m:"\uc808\ubcbd",def:"a high and often flat wall of rock",unit:18,opts:["cliff", "armor", "thunder", "invasion"]},
  ],
  "eew3_19": [
    {w:"horror",m:"\uacf5\ud3ec, \uacbd\uc545",def:"a feeling of being very afraid or shocked",unit:19,opts:["plot", "sigh", "revenge", "horror"]},
    {w:"orphan",m:"\uace0\uc544",def:"a child who does not have parents",unit:19,opts:["rage", "orphan", "spare", "empty"]},
    {w:"pregnant",m:"\uc784\uc2e0\ud55c",def:"have a baby",unit:19,opts:["sigh", "daisy", "pregnant", "rage"]},
    {w:"bench",m:"\ubca4\uce58",def:"a long seat for two or more people",unit:19,opts:["bench", "revenge", "spare", "plot"]},
    {w:"rage",m:"\ubd84\ub178",def:"a very angry feeling",unit:19,opts:["mist", "rage", "pregnant", "shame"]},
    {w:"shame",m:"\uc218\uce58\uc2ec, \ucc3d\ud53c",def:"a bad feeling about things one has done wrong",unit:19,opts:["shame", "object", "revenge", "horror"]},
    {w:"incident",m:"\uc0ac\uac74",def:"an event that is usually not pleasant",unit:19,opts:["shame", "incident", "orphan", "pregnant"]},
    {w:"revenge",m:"\ubcf5\uc218, \ubcf4\ubcf5",def:"the act of hurting someone who has hurt you",unit:19,opts:["revenge", "orphan", "spare", "daisy"]},
    {w:"supper",m:"\uc800\ub141",def:"a meal that is eaten in the evening",unit:19,opts:["mist", "dispute", "supper", "shame"]},
    {w:"sneak",m:"\uc0b4\uae08\uc0b4\uae08 \uac00\ub2e4",def:"to move quietly in order not to be seen or heard",unit:19,opts:["empty", "mist", "daisy", "sneak"]},
    {w:"daisy",m:"\ub370\uc774\uc9c0 \uaf43",def:"a small flower with white petals and a yellow center",unit:19,opts:["pregnant", "horror", "daisy", "sneak"]},
    {w:"stem",m:"\uc904\uae30",def:"the stick that grows leaves or flowers",unit:19,opts:["bench", "empty", "horror", "stem"]},
    {w:"object",m:"\ubb3c\uac74, \ubb3c\uccb4",def:"a non-living thing that you can see or touch",unit:19,opts:["plot", "object", "mist", "horror"]},
    {w:"spare",m:"\ub0b4\uc5b4\uc8fc\ub2e4",def:"to give it away because it is not needed",unit:19,opts:["pregnant", "tender", "plot", "spare"]},
    {w:"empty",m:"\ube44\uc5b4 \uc788\ub294",def:"one that has no things in it",unit:19,opts:["empty", "mist", "plot", "sneak"]},
    {w:"dispute",m:"\ubd84\uc7c1, \ubd84\uaddc",def:"an argument or disagreement that people have",unit:19,opts:["dispute", "revenge", "incident", "stem"]},
    {w:"mist",m:"\uc5f7\uc740 \uc548\uac1c",def:"water that can be seen in the air or on a surface",unit:19,opts:["mist", "plot", "supper", "sneak"]},
    {w:"plot",m:"\uc74c\ubaa8(\ubaa8\uc758)\ud558\ub2e4",def:"to make a secret plan to do something that is wrong or mean",unit:19,opts:["plot", "horror", "daisy", "tender"]},
    {w:"sigh",m:"\ud55c\uc228\uc744 \uc26c\ub2e4",def:"to breathe out loudly to show tiredness, boredom, or sadness",unit:19,opts:["incident", "sigh", "plot", "object"]},
    {w:"tender",m:"\ubd80\ub4dc\ub7ec\uc6b4",def:"soft and easy to chew",unit:19,opts:["tender", "horror", "pregnant", "rage"]},
  ],
  "eew3_20": [
    {w:"magnificent",m:"\ucc38\uc73c\ub85c \uc544\ub984\ub2e4\uc6b4",def:"beautiful and grand",unit:20,opts:["magnificent", "ease", "outcome", "terrific"]},
    {w:"pile",m:"\ud3ec\uac1c\ub193\uc740\uac83, \ub354\ubbf8",def:"a large group of things on top of one another",unit:20,opts:["profound", "vital", "pile", "evident"]},
    {w:"ease",m:"\uc26c\uc6c0, \uc6a9\uc774\ud568",def:"a condition without difficulty or hard work",unit:20,opts:["ease", "seize", "evident", "terrific"]},
    {w:"trait",m:"\ud2b9\uc131",def:"part of someone\u2019s personality",unit:20,opts:["evident", "leap", "trait", "pile"]},
    {w:"seize",m:"\uaf49 \ubd99\uc7a1\ub2e4",def:"to grab it quickly or strongly",unit:20,opts:["dissatisfied", "seize", "leap", "cub"]},
    {w:"terrific",m:"\uc544\uc8fc \uc88b\uc740, \uba4b\uc9c4",def:"very good",unit:20,opts:["terrific", "outcome", "dissatisfied", "seize"]},
    {w:"hail",m:"\uc6b0\ubc15",def:"ice that falls from the sky when rain freezes",unit:20,opts:["dissatisfied", "hail", "necessity", "profound"]},
    {w:"vital",m:"\ud544\uc218\uc801\uc778",def:"necessary for life",unit:20,opts:["hail", "vital", "ease", "seize"]},
    {w:"beneath",m:"\uc544\ub798\uc5d0",def:"under or lower than",unit:20,opts:["supreme", "necessity", "beneath", "evident"]},
    {w:"outcome",m:"\uacb0\uacfc",def:"the end result of an action or event",unit:20,opts:["ease", "dissatisfied", "outcome", "magnificent"]},
    {w:"necessity",m:"\ud544\uc694, \ud544\uc218\ud488",def:"something that is needed",unit:20,opts:["ease", "outcome", "necessity", "dissatisfied"]},
    {w:"squeeze",m:"\uc9dc\ub2e4",def:"to press it together and hold it tightly",unit:20,opts:["hail", "squeeze", "ease", "outcome"]},
    {w:"howl",m:"(\uae38\uac8c) \uc6b8\ub2e4, \uc6b8\ubd80\uc9d6\ub2e4",def:"to make a long, loud sound like a wolf or a dog",unit:20,opts:["pile", "necessity", "howl", "beneath"]},
    {w:"supreme",m:"\ucd5c\uace0\uc758",def:"the highest level or best quality",unit:20,opts:["vital", "supreme", "dawn", "ease"]},
    {w:"dawn",m:"\uc0c8\ubcbd",def:"the time of day when the sun rises",unit:20,opts:["supreme", "trait", "leap", "dawn"]},
    {w:"profound",m:"\uc2ec\uc624\ud55c",def:"deep or very intelligent",unit:20,opts:["ease", "howl", "profound", "pile"]},
    {w:"cub",m:"\uc0c8\ub07c",def:"a baby animal, such as a bear or lion",unit:20,opts:["trait", "profound", "cub", "squeeze"]},
    {w:"evident",m:"\ubd84\uba85\ud55c",def:"easy to see or understand",unit:20,opts:["ease", "evident", "beneath", "hail"]},
    {w:"leap",m:"\ub6f0\ub2e4",def:"to jump a long distance",unit:20,opts:["vital", "dawn", "leap", "squeeze"]},
    {w:"dissatisfied",m:"\ubd88\ub9cc\uc2a4\ub7ec\uc6cc\ud558\ub294",def:"not happy with something",unit:20,opts:["necessity", "howl", "dissatisfied", "leap"]},
  ],
  "eew3_21": [
    {w:"cancerous",m:"\uc554\uc758",def:"cells are the result of cancer",unit:21,opts:["destruction", "result", "cancerous", "male"]},
    {w:"male",m:"\ub0a8\uc131\uc758",def:"men or boys",unit:21,opts:["population", "male", "cure", "cancerous"]},
    {w:"cigarette",m:"\ub2f4\ubc30",def:"a thinly wrapped paper tube filled with tobacco that is smoked",unit:21,opts:["dna", "cigarette", "cure", "male"]},
    {w:"extensive",m:"\uc544\uc8fc \ub113\uc740, \ub300\uaddc\ubaa8\uc758",def:"large in size or amount",unit:21,opts:["extensive", "breast", "cigarette", "code"]},
    {w:"cancer",m:"\uc554",def:"a serious disease that causes cells to grow abnormally",unit:21,opts:["dna", "sugar", "cancer", "extensive"]},
    {w:"code",m:"\uc554\ud638",def:"a set of symbols used to hide or read a message",unit:21,opts:["dna", "attack", "code", "cigarette"]},
    {w:"furthermore",m:"\ubfd0\ub9cc \uc544\ub2c8\ub77c",def:"more information will be added",unit:21,opts:["result", "dna", "sugar", "furthermore"]},
    {w:"population",m:"\uc778\uad6c",def:"all the people living in an area",unit:21,opts:["population", "cancer", "sugar", "cigarette"]},
    {w:"cell",m:"\uc138\ud3ec",def:"the smallest part of a living thing that can live by itself",unit:21,opts:["code", "furthermore", "male", "cell"]},
    {w:"link",m:"\uad00\ub828, \uad00\uacc4",def:"a connection to something else",unit:21,opts:["result", "cure", "link", "destruction"]},
    {w:"sugar",m:"\uc124\ud0d5",def:"used to make food taste sweet",unit:21,opts:["cigarette", "sugar", "dna", "female"]},
    {w:"result",m:"\uacb0\uacfc",def:"happens because of something else",unit:21,opts:["dna", "link", "cigarette", "result"]},
    {w:"dna",m:"DNA",def:"the short form of deoxyribonucleic acid",unit:21,opts:["dna", "sugar", "cure", "cancerous"]},
    {w:"breast",m:"\uc720\ubc29, \uac00\uc2b4",def:"one of the two soft parts on a woman\u2019s chest",unit:21,opts:["cancerous", "cure", "cigarette", "breast"]},
    {w:"gene",m:"\uc720\uc804\uc790",def:"controls what it looks like, how an organism grows, and how it develops",unit:21,opts:["gene", "result", "link", "cell"]},
    {w:"cure",m:"\uce58\ub8cc\ubc95",def:"a medical treatment to make a sickness go away",unit:21,opts:["gene", "destruction", "code", "cure"]},
    {w:"destruction",m:"\ud30c\uad34",def:"to cause its destruction",unit:21,opts:["dna", "inherit", "destruction", "furthermore"]},
    {w:"female",m:"\uc5ec\uc131\uc758",def:"women or girls",unit:21,opts:["male", "breast", "female", "sugar"]},
    {w:"inherit",m:"\ubb3c\ub824\ubc1b\ub2e4",def:"to receive something that is passed down from a relative",unit:21,opts:["attack", "destruction", "gene", "inherit"]},
    {w:"attack",m:"\uacf5\uaca9\ud558\ub2e4",def:"to hurt or damage it",unit:21,opts:["breast", "furthermore", "attack", "extensive"]},
  ],
  "eew3_22": [
    {w:"tame",m:"\uae38\ub4e4\uc5ec\uc9c4",def:"not afraid to be near people",unit:22,opts:["gender", "headline", "pose", "tame"]},
    {w:"extent",m:"\uc815\ub3c4, \ud06c\uae30",def:"how large, important, or serious it is",unit:22,opts:["steer", "coincide", "extent", "stripe"]},
    {w:"pose",m:"\ud3ec\uc988\ub97c \uc7a1\ub2e4",def:"to stay in one place without moving",unit:22,opts:["extent", "commission", "dose", "pose"]},
    {w:"headline",m:"\ud45c\uc81c",def:"the title of a newspaper story",unit:22,opts:["headline", "stripe", "portrait", "tempt"]},
    {w:"inquire",m:"\ubb3b\ub2e4",def:"to ask about it",unit:22,opts:["inquire", "dose", "tame", "extent"]},
    {w:"dose",m:"\ubcf5\uc6a9\ub7c9",def:"a certain amount of medicine taken at one time",unit:22,opts:["dose", "coincide", "tame", "commission"]},
    {w:"gender",m:"\uc131, \uc131\ubcc4",def:"a category that describes being either a boy or a girl",unit:22,opts:["headline", "steer", "commission", "gender"]},
    {w:"commission",m:"\uc758\ub8b0\ud558\ub2e4, \uc8fc\ubb38\ud558\ub2e4",def:"to pay that person to do some job",unit:22,opts:["gender", "extent", "tempt", "commission"]},
    {w:"circus",m:"\uc11c\ucee4\uc2a4",def:"a traveling show with animals and people",unit:22,opts:["circus", "inquire", "dose", "accommodate"]},
    {w:"dye",m:"\uc5fc\uc0c9\ud558\ub2e4",def:"to make it a certain color by using a special chemical",unit:22,opts:["messenger", "stripe", "peer", "dye"]},
    {w:"messenger",m:"\uc804\ub2ec\uc790, \ubc30\ub2ec\uc6d0",def:"one who carries information from one place to another",unit:22,opts:["inquire", "messenger", "pose", "steer"]},
    {w:"informal",m:"\ube44\uacf5\uc2dd\uc801\uc778",def:"casual and relaxed, not official",unit:22,opts:["informal", "peer", "portrait", "tame"]},
    {w:"stripe",m:"\uc904\ubb34\ub2ac",def:"a thick line",unit:22,opts:["dose", "portrait", "accommodate", "stripe"]},
    {w:"peer",m:"\uc790\uc138\ud788 \ub4e4\uc5ec\ub2e4\ubcf4\ub2e4",def:"to watch it carefully",unit:22,opts:["dose", "ranch", "coincide", "peer"]},
    {w:"steer",m:"\uc870\uc885\ud558\ub2e4, \ub3cc\ub9ac\ub2e4, \uc774\ub04c\ub2e4",def:"to control where it goes",unit:22,opts:["coincide", "peer", "commission", "steer"]},
    {w:"tempt",m:"\uc720\ud639\ud558\ub2e4",def:"to offer them something they want but shouldn\u2019t have",unit:22,opts:["dye", "circus", "coincide", "tempt"]},
    {w:"portrait",m:"\ucd08\uc0c1\ud654",def:"a painting or photograph of someone",unit:22,opts:["headline", "dye", "accommodate", "portrait"]},
    {w:"accommodate",m:"(\uc0b4\uac70\ub098 \uc9c0\ub0bc \uacf5\uac04\uc744) \uc81c\uacf5\ud558\ub2e4, \uc218\uc6a9\ud558\ub2e4",def:"to have enough room",unit:22,opts:["tame", "circus", "accommodate", "pose"]},
    {w:"coincide",m:"\ub3d9\uc2dc\uc5d0 \uc77c\uc5b4\ub098\ub2e4",def:"to happen at the same time",unit:22,opts:["gender", "headline", "coincide", "stripe"]},
    {w:"ranch",m:"\ubaa9\uc7a5",def:"a large farm where animals are kept",unit:22,opts:["coincide", "messenger", "tame", "ranch"]},
  ],
  "eew3_23": [
    {w:"seldom",m:"\uc880\ucc98\ub7fc \uac70\uc758 ~\uc54a\ub294",def:"n action doesn\u2019t happen very often",unit:23,opts:["seldom", "confess", "purse", "daytime"]},
    {w:"cottage",m:"\uc624\ub450\ub9c9",def:"a small, old house in the countryside",unit:23,opts:["shave", "cautious", "purse", "cottage"]},
    {w:"daytime",m:"\ub0ae, \uc8fc\uac04",def:"the time of the day when the sky is light",unit:23,opts:["daytime", "fade", "fierce", "seldom"]},
    {w:"rod",m:"\ub9c9\ub300",def:"a thin stick made of wood or metal",unit:23,opts:["cautious", "shave", "outlaw", "rod"]},
    {w:"outlaw",m:"\ubc94\uc8c4\uc790, \ub3c4\ub9dd\uc790",def:"a criminal who hides from the police",unit:23,opts:["outlaw", "lawn", "wizard", "prospect"]},
    {w:"terrified",m:"\ubb34\uc11c\uc6cc\ud558\ub294",def:"extremely scared",unit:23,opts:["terrified", "exhausting", "mow", "shave"]},
    {w:"fierce",m:"\uc0ac\ub098\uc6b4, \ud5d8\uc545\ud55c",def:"angry or violent",unit:23,opts:["exhausting", "fierce", "prospect", "seldom"]},
    {w:"shave",m:"\uba74\ub3c4\ud558\ub2e4",def:"to cut the hairs on one\u2019s face with a sharp tool",unit:23,opts:["gamble", "shave", "outlaw", "confess"]},
    {w:"cautious",m:"\uc870\uc2ec\uc2a4\ub7ec\uc6b4, \uc2e0\uc911\ud55c",def:"careful to avoid danger",unit:23,opts:["desperate", "cautious", "shave", "mow"]},
    {w:"confess",m:"\uc790\ubc31\ud558\ub2e4",def:"to admit a bad or embarrassing truth",unit:23,opts:["confess", "fierce", "lawn", "cautious"]},
    {w:"prospect",m:"\uc608\uc0c1, \uc804\ub9dd",def:"a possibility that something will happen",unit:23,opts:["prospect", "wizard", "exhausting", "gamble"]},
    {w:"exhausting",m:"\uae30\uc9c4\ub9e5\uc9c4\ud558\uac8c",def:"very tiring",unit:23,opts:["seldom", "cottage", "mow", "exhausting"]},
    {w:"mow",m:"\uae4e\ub2e4, \ubca0\ub2e4",def:"to cut it to make it short",unit:23,opts:["mow", "terrified", "cottage", "fierce"]},
    {w:"gamble",m:"\ub3c4\ubc15\uc744\ud558\ub2e4",def:"to play a game that involves winning or losing money",unit:23,opts:["terrified", "gamble", "lawn", "daytime"]},
    {w:"purse",m:"(\uc5ec\uc131\uc6a9\uc758 \uc791\uc740) \uac00\ubc29, \uc9c0\uac11",def:"a bag in which women keep money, makeup, keys, etc.",unit:23,opts:["purse", "mow", "exhausting", "seldom"]},
    {w:"lawn",m:"\uc794\ub514\ubc2d",def:"an area covered in grass",unit:23,opts:["prospect", "terrified", "lawn", "shave"]},
    {w:"fade",m:"\ubc14\ub798\ub2e4, \ud76c\ubbf8\ud574\uc9c0\ub2e4",def:"to become quieter or less bright",unit:23,opts:["exhausting", "fade", "cautious", "rod"]},
    {w:"desperate",m:"\uc790\ud3ec\uc790\uae30\ud55c",def:"person will try anything to do or change something",unit:23,opts:["rod", "shave", "desperate", "fade"]},
    {w:"wizard",m:"\ub9c8\ubc95\uc0ac",def:"a man who can do magic",unit:23,opts:["wizard", "shave", "cautious", "fade"]},
  ],
  "eew3_24": [
    {w:"currency",m:"\ud1b5\ud654",def:"the type of money used in that country",unit:24,opts:["volume", "currency", "remote", "draft"]},
    {w:"brief",m:"\uc9e7\uc740",def:"lasts a short time",unit:24,opts:["refer", "brief", "official", "jet"]},
    {w:"airline",m:"\ud56d\uacf5\uc0ac",def:"a company that takes people to different places by plane",unit:24,opts:["data", "airline", "currency", "recommend"]},
    {w:"remote",m:"\uc678\uc9c4, \uc678\ub534",def:"distant or far away",unit:24,opts:["abroad", "income", "gather", "remote"]},
    {w:"data",m:"\uc815\ubcf4, \ub370\uc774\ud130",def:"a collection of information and facts",unit:24,opts:["brief", "income", "remote", "data"]},
    {w:"hobby",m:"\ucde8\ubbf8",def:"a fun and creative activity people do in their free time",unit:24,opts:["brief", "income", "domestic", "hobby"]},
    {w:"recommend",m:"\ucd94\ucc9c\ud558\ub2e4",def:"to give advice based on experience",unit:24,opts:["data", "recommend", "gather", "abroad"]},
    {w:"sleepless",m:"\ubd88\uba74\uc758",def:"a time period in which someone does not sleep",unit:24,opts:["sleepless", "audience", "airline", "currency"]},
    {w:"refer",m:"\uc54c\uc544\ubcf4\ub3c4\ub85d \ud558\ub2e4",def:"to mention or call attention to it",unit:24,opts:["draft", "refer", "maximum", "jet"]},
    {w:"draft",m:"\ucd08\uc548",def:"a piece of written work that is not in its final form",unit:24,opts:["draft", "sleepless", "maximum", "refer"]},
    {w:"gather",m:"\ubaa8\uc774\ub2e4, \ubaa8\uc73c\ub2e4",def:"to form a group or bring together",unit:24,opts:["hobby", "draft", "gather", "maximum"]},
    {w:"income",m:"\uc18c\ub4dd, \uc218\uc785",def:"the money you earned from work",unit:24,opts:["data", "brief", "income", "hobby"]},
    {w:"volume",m:"\uc6a9\ub7c9, \uc6a9\uc801",def:"the total amount of something",unit:24,opts:["volume", "data", "brief", "draft"]},
    {w:"abroad",m:"\ud574\uc678\uc5d0, \ud574\uc678\ub85c",def:"done in a different country",unit:24,opts:["abroad", "volume", "recommend", "official"]},
    {w:"jet",m:"\uc81c\ud2b8\uae30",def:"a fast plane with a big engine",unit:24,opts:["audience", "draft", "jet", "refer"]},
    {w:"maximum",m:"\ucd5c\ub300\uc758",def:"the highest amount of anything allowed",unit:24,opts:["domestic", "recommend", "bargain", "maximum"]},
    {w:"audience",m:"\uccad\uc911, \uad00\uc911",def:"a group of people who gather to watch someone do something",unit:24,opts:["bargain", "data", "audience", "refer"]},
    {w:"bargain",m:"\uc2f8\uac8c \uc0ac\ub294 \ubb3c\uac74",def:"a very good price paid for a product",unit:24,opts:["bargain", "airline", "brief", "official"]},
    {w:"domestic",m:"\uad6d\ub0b4\uc758",def:"something that happens within a particular country",unit:24,opts:["domestic", "official", "refer", "gather"]},
    {w:"official",m:"\uacf5\ubb34\uc0c1\uc758",def:"approved by someone in authority",unit:24,opts:["domestic", "draft", "official", "abroad"]},
  ],
  "eew3_25": [
    {w:"suicide",m:"\uc790\uc0b4",def:"the act of killing oneself",unit:25,opts:["dynasty", "illusion", "lieutenant", "suicide"]},
    {w:"resign",m:"\uc0ac\uc9c1\ud558\ub2e4, \uc0ac\uc784\ud558\ub2e4",def:"to quit a job",unit:25,opts:["dynasty", "resign", "illusion", "ray"]},
    {w:"polar",m:"\ubd81\uadf9\uc758",def:"the cold places on Earth\u2019s north and south ends",unit:25,opts:["suicide", "drown", "polar", "lieutenant"]},
    {w:"fraction",m:"\ubd80\ubd84",def:"a small part of something",unit:25,opts:["navy", "illusion", "fraction", "polar"]},
    {w:"via",m:"~\uc5d0 \uc758\ud574",def:"introduces a route or means of travel",unit:25,opts:["consequent", "resign", "via", "tremble"]},
    {w:"consequent",m:"~\uc758 \uacb0\uacfc\ub85c \uc77c\uc5b4\ub098\ub294",def:"happening because of a different situation",unit:25,opts:["consequent", "frost", "navy", "tremble"]},
    {w:"circulate",m:"\uc21c\ud658\ud558\ub2e4",def:"to spread something around, especially in a circular way",unit:25,opts:["polar", "merit", "suicide", "circulate"]},
    {w:"invade",m:"\uce68\uc785\ud558\ub2e4",def:"to take over a place by force",unit:25,opts:["circulate", "merit", "navy", "invade"]},
    {w:"tremble",m:"\ub5a8\ub2e4",def:"to shake as a result of excitement or cold weather",unit:25,opts:["tremble", "circulate", "navy", "fraction"]},
    {w:"underlying",m:"\uc740\uc5f0\ud55c",def:"a hidden cause or reason",unit:25,opts:["tremble", "dynasty", "fraction", "underlying"]},
    {w:"frost",m:"\uc11c\ub9ac",def:"a white layer of ice that forms during very cold weather",unit:25,opts:["navy", "frost", "marine", "consequent"]},
    {w:"navy",m:"\ud574\uad70",def:"the part of a country\u2019s military that fights at sea",unit:25,opts:["resign", "navy", "derive", "via"]},
    {w:"dynasty",m:"\uc655\uc870, \uc2dc\ub300, \ub098\ub77c",def:"a series of rulers who are all from the same family",unit:25,opts:["dynasty", "polar", "resign", "merit"]},
    {w:"derive",m:"\ube44\ub86f\ub418\ub2e4",def:"to come, or originate, from a thing or place",unit:25,opts:["dynasty", "fraction", "illusion", "derive"]},
    {w:"drown",m:"\uc775\uc0ac\ud558\ub2e4",def:"to die from not being able to breathe underwater",unit:25,opts:["drown", "ray", "frost", "fraction"]},
    {w:"illusion",m:"\ud658\uc0c1, \ud658\uac01",def:"something that looks real, but doesn\u2019t actually exist",unit:25,opts:["frost", "consequent", "tremble", "illusion"]},
    {w:"lieutenant",m:"\uc911\uc704, \ub300\uc704",def:"a rank in the military or police, or a person with that rank",unit:25,opts:["lieutenant", "drown", "polar", "illusion"]},
    {w:"merit",m:"\uac00\uce58",def:"a positive or good quality",unit:25,opts:["derive", "circulate", "merit", "dynasty"]},
    {w:"ray",m:"\uad11\uc120",def:"a line of light that comes from a bright object",unit:25,opts:["fraction", "dynasty", "drown", "ray"]},
    {w:"marine",m:"\ubc14\ub2e4\uc758, \ud574\uc591\uc758",def:"something related to the sea",unit:25,opts:["circulate", "underlying", "marine", "fraction"]},
  ],
  "eew3_26": [
    {w:"blend",m:"\uc11e\ub2e4, \ud63c\ud569\ud558\ub2e4",def:"to mix two or more things together",unit:26,opts:["disgusting", "fireworks", "blend", "collapse"]},
    {w:"drain",m:"\ubc30\uc218\uad00",def:"a pipe that carries away water from a building, such as in a kitchen",unit:26,opts:["embrace", "drain", "blend", "fireworks"]},
    {w:"wipe",m:"\ub2e6\ub2e4",def:"to slide a piece of cloth over it to clean it",unit:26,opts:["wipe", "drain", "embrace", "paste"]},
    {w:"embrace",m:"\uc548\ub2e4, \ud3ec\uc639\ud558\ub2e4",def:"to hug",unit:26,opts:["paste", "wire", "collapse", "embrace"]},
    {w:"aside",m:"\ud55c\ucabd\uc73c\ub85c",def:"done toward the side of something or someplace",unit:26,opts:["paste", "aside", "envy", "crush"]},
    {w:"wire",m:"\ucca0\uc0ac, \uc804\uc120",def:"a thin string made out of metal",unit:26,opts:["autumn", "fireworks", "ginger", "wire"]},
    {w:"envy",m:"\ubd80\ub7ec\uc6cc\ud558\ub2e4",def:"to wish that you had something that other person has",unit:26,opts:["envy", "autumn", "flour", "drain"]},
    {w:"collapse",m:"\ubd95\uad34\ub418\ub2e4",def:"to fall down suddenly",unit:26,opts:["embrace", "receipt", "fuse", "collapse"]},
    {w:"receipt",m:"\uc601\uc218\uc99d",def:"a paper that proves that something was received or bought",unit:26,opts:["envy", "paste", "receipt", "fireworks"]},
    {w:"ginger",m:"\uc0dd\uac15",def:"a root of a plant that is used to make food spicy and sweet",unit:26,opts:["drain", "embrace", "ginger", "flour"]},
    {w:"flour",m:"\ubc00\uac00\ub8e8",def:"a powder that is used to make foods like bread",unit:26,opts:["flour", "curve", "crush", "wire"]},
    {w:"paste",m:"\ubc18\uc8fd",def:"a thick and smooth substance",unit:26,opts:["paste", "crush", "embrace", "wipe"]},
    {w:"crush",m:"\uc73c\uc2a4\ub7ec\ub728\ub9ac\ub2e4",def:"to press it together so its shape is destroyed",unit:26,opts:["envy", "crush", "alter", "wipe"]},
    {w:"fuse",m:"(\ud3ed\uc57d\uc758) \ub3c4\ud654\uc120",def:"a string on fireworks that burns to make them explode",unit:26,opts:["embrace", "drain", "fireworks", "fuse"]},
    {w:"jealous",m:"\uc9c8\ud22c\ud558\ub294",def:"might take something from you",unit:26,opts:["receipt", "paste", "autumn", "jealous"]},
    {w:"alter",m:"\ubcc0\ud558\ub2e4, \ubc14\uafb8\ub2e4",def:"to change it",unit:26,opts:["curve", "alter", "embrace", "paste"]},
    {w:"disgusting",m:"\uc5ed\uaca8\uc6b4",def:"very unpleasant.",unit:26,opts:["disgusting", "embrace", "collapse", "fireworks"]},
    {w:"fireworks",m:"\ubd88\uaf43\ub180\uc774",def:"objects that create colored lights when they are lit",unit:26,opts:["paste", "wipe", "receipt", "fireworks"]},
    {w:"autumn",m:"\uac00\uc744",def:"the season of the year between summer and winter",unit:26,opts:["drain", "collapse", "autumn", "blend"]},
    {w:"curve",m:"\uace1\uc120\uc73c\ub85c \ub098\uc544\uac00\ub2e4",def:"to move in a line that bends and does not go straight",unit:26,opts:["curve", "aside", "wire", "alter"]},
  ],
  "eew3_27": [
    {w:"acknowledge",m:"\uc778\uc815\ud558\ub2e4",def:"to accept that it is true or that it exists",unit:27,opts:["acknowledge", "necklace", "heritage", "prejudice"]},
    {w:"meanwhile",m:"\uadf8\ub3d9\uc548\uc5d0",def:"happens at the same time as another action",unit:27,opts:["rumor", "spectacle", "meanwhile", "drag"]},
    {w:"spectacle",m:"\uad6c\uacbd\uac70\ub9ac, \uc7a5\uad00",def:"an amazing sight",unit:27,opts:["spectacle", "rumor", "suspicious", "conquer"]},
    {w:"drag",m:"\ub04c\ub2e4",def:"to pull it across the ground",unit:27,opts:["meanwhile", "heritage", "drag", "suspicious"]},
    {w:"prejudice",m:"\ud3b8\uacac",def:"an unfair opinion about people based on the group they belong to",unit:27,opts:["exaggerate", "prejudice", "spectacle", "vase"]},
    {w:"vase",m:"\uaf43\ubcd1",def:"an attractive container in which people keep flowers",unit:27,opts:["heritage", "insult", "vase", "precious"]},
    {w:"conquer",m:"\uc815\ubcf5\ud558\ub2e4",def:"to attack and take control of it",unit:27,opts:["suspicious", "precious", "conquer", "blonde"]},
    {w:"heritage",m:"(\uad6d\uac00, \uc0ac\ud68c\uc758) \uc720\uc0b0",def:"the collection of features of a society, such as language and religion",unit:27,opts:["heritage", "blonde", "sin", "insult"]},
    {w:"suspicious",m:"\uc758\uc2ec\uc2a4\ub7ec\uc6b4",def:"does not trust others, or is not trusted by others",unit:27,opts:["suspicious", "stack", "drag", "heritage"]},
    {w:"noble",m:"\uadc0\uc871",def:"a rich and powerful person",unit:27,opts:["insult", "noble", "vase", "necklace"]},
    {w:"necklace",m:"\ubaa9\uac78\uc774",def:"a piece of jewelry that people wear around their necks",unit:27,opts:["necklace", "tin", "exaggerate", "prejudice"]},
    {w:"ambassador",m:"\ub300\uc0ac",def:"a government worker who works in another country",unit:27,opts:["ambassador", "blonde", "exaggerate", "necklace"]},
    {w:"precious",m:"\uadc0\uc911\ud55c",def:"valuable and important",unit:27,opts:["ambassador", "precious", "heritage", "meanwhile"]},
    {w:"sin",m:"\uc8c4",def:"something that is wrong for religious reasons",unit:27,opts:["sin", "vase", "acknowledge", "insult"]},
    {w:"tin",m:"\ud1b5, \uae61\ud1b5",def:"an inexpensive metal",unit:27,opts:["rumor", "tin", "heritage", "spectacle"]},
    {w:"stack",m:"\ubb34\ub354\uae30",def:"a pile of different things",unit:27,opts:["spectacle", "exaggerate", "sin", "stack"]},
    {w:"insult",m:"\ubaa8\uc695\ud558\ub2e4",def:"to say things that will hurt the person\u2019s feelings",unit:27,opts:["meanwhile", "blonde", "insult", "exaggerate"]},
    {w:"blonde",m:"\uae08\ubc1c",def:"a person with light-colored hair",unit:27,opts:["blonde", "suspicious", "prejudice", "spectacle"]},
    {w:"exaggerate",m:"\uacfc\uc7a5\ud558\ub2e4",def:"to say that something is bigger or better than it really is",unit:27,opts:["blonde", "exaggerate", "insult", "necklace"]},
    {w:"rumor",m:"\uc18c\ubb38",def:"a story that may not be true",unit:27,opts:["heritage", "rumor", "ambassador", "necklace"]},
  ],
  "eew3_28": [
    {w:"canal",m:"\uc218\ub85c",def:"a path for water to travel through",unit:28,opts:["canal", "institution", "descend", "chill"]},
    {w:"dairy",m:"\uc720\uc81c\ud488\uc758",def:"something is made from milk",unit:28,opts:["dairy", "congress", "grocer", "descend"]},
    {w:"stubborn",m:"\uace0\uc9d1\uc2a4\ub7ec\uc6b4",def:"don\u2019t change their minds easily",unit:28,opts:["ache", "dairy", "stubborn", "hesitate"]},
    {w:"postpone",m:"\uc5f0\uae30\ud558\ub2e4, \ubbf8\ub8e8\ub2e4",def:"to make it happen later than planned",unit:28,opts:["postpone", "descend", "ache", "stubborn"]},
    {w:"chemist",m:"\ud654\ud559\uc790",def:"a scientist who works with chemicals",unit:28,opts:["stubborn", "chemist", "institution", "suburb"]},
    {w:"descend",m:"\ub0b4\ub824\uac00\ub2e4",def:"to go downward",unit:28,opts:["institution", "descend", "tragedy", "canal"]},
    {w:"hesitate",m:"\ub9dd\uc124\uc774\ub2e4",def:"to wait for a short time before doing something",unit:28,opts:["hesitate", "ache", "postpone", "dairy"]},
    {w:"splash",m:"(\ubb3c, \ud759\ud0d5\ubb3c\uc744) \ud280\uae30\ub2e4, \ub07c\uc5b9\ub2e4",def:"to crash into something so that liquid spreads out",unit:28,opts:["jog", "splash", "chemist", "hesitate"]},
    {w:"congress",m:"\uc758\ud68c",def:"a group of leaders in a government",unit:28,opts:["tide", "tragedy", "congress", "stubborn"]},
    {w:"merchant",m:"\uc0c1\uc778",def:"a person who sells things",unit:28,opts:["splash", "merchant", "poke", "descend"]},
    {w:"grocer",m:"\uc2dd\ub8cc\ud488 \uc7a1\ud654\uc0c1 (\uadf8 \uc8fc\uc778\uc774\ub098 \uc9c1\uc6d0)",def:"a person who sells food",unit:28,opts:["institution", "hesitate", "grocer", "poke"]},
    {w:"chill",m:"\ub0c9\uae30, \ud55c\uae30",def:"a feeling of cold",unit:28,opts:["chill", "tide", "dairy", "arctic"]},
    {w:"institution",m:"\uae30\uad00",def:"an organization that works to help a city or group of people",unit:28,opts:["institution", "canal", "hesitate", "descend"]},
    {w:"tide",m:"\uc870\uc218, \ubc00\ubb3c\uacfc \uc370\ubb3c",def:"the level of the water in the sea",unit:28,opts:["arctic", "tide", "chemist", "postpone"]},
    {w:"poke",m:"(\uc190\uac00\ub77d \ub4f1\uc73c\ub85c) \ucfe1 \ucc0c\ub974\ub2e4",def:"to push something quickly with your finger or a pointed object",unit:28,opts:["stubborn", "poke", "merchant", "jog"]},
    {w:"arctic",m:"\ubd81\uadf9 \uc9c0\ubc29\uc758",def:"something is of or from the cold, far-north part of the Earth",unit:28,opts:["descend", "postpone", "arctic", "dairy"]},
    {w:"tragedy",m:"\ube44\uadf9",def:"a very sad event",unit:28,opts:["grocer", "chemist", "tragedy", "descend"]},
    {w:"ache",m:"\uc544\ud504\ub2e4",def:"to hurt, or cause pain",unit:28,opts:["descend", "tragedy", "ache", "grocer"]},
    {w:"suburb",m:"\uad50\uc678",def:"a small part of a large city",unit:28,opts:["jog", "suburb", "tide", "ache"]},
    {w:"jog",m:"\uc870\uae45\ud558\ub2e4",def:"to run slowly",unit:28,opts:["institution", "stubborn", "jog", "merchant"]},
  ],
  "eew3_29": [
    {w:"cope",m:"\ub300\ucc98\ud558\ub2e4",def:"cope with a difficult or stressful situation means to deal with it",unit:29,opts:["cope", "license", "gaze", "submarine"]},
    {w:"devastate",m:"\uc644\uc804\ud788 \ud30c\uad34\ud558\ub2e4",def:"to cause great damage or pain to that thing",unit:29,opts:["groom", "frown", "submarine", "devastate"]},
    {w:"frown",m:"\uc5bc\uad74(\ub208\uc0b4)\uc744 \ucc0c\ud478\ub9ac\ub2e4",def:"to make an unhappy look with one\u2019s face",unit:29,opts:["cope", "frown", "devastate", "groom"]},
    {w:"circumstance",m:"\uc0c1\ud669",def:"an event that makes a situation what it is",unit:29,opts:["circumstance", "coffin", "portray", "submarine"]},
    {w:"grief",m:"\ube44\ud0c4",def:"the feeling of deep sadness, usually when a person dies",unit:29,opts:["grief", "microscope", "trace", "bomb"]},
    {w:"criticism",m:"\ube44\ud310, \ube44\ub09c",def:"the act of saying that something is not correct or good",unit:29,opts:["criticism", "circumstance", "gaze", "nuclear"]},
    {w:"license",m:"\uba74\ud5c8",def:"an official document that gives one permission to do something",unit:29,opts:["rotate", "cope", "license", "trace"]},
    {w:"groom",m:"\uc2e0\ub791",def:"a man who is going to be married",unit:29,opts:["frown", "groom", "circumstance", "rotate"]},
    {w:"rotate",m:"\ud68c\uc804\ud558\ub2e4",def:"to turn it around in a circle",unit:29,opts:["devastate", "trace", "rotate", "glance"]},
    {w:"coffin",m:"\uad00",def:"a box used to bury dead people",unit:29,opts:["souvenir", "cope", "coffin", "rotate"]},
    {w:"portray",m:"\ubb18\uc0ac\ud558\ub2e4",def:"to describe it or show it in a picture",unit:29,opts:["portray", "bomb", "cope", "groom"]},
    {w:"trace",m:"\ucd94\uc801\ud558\ub2e4",def:"to follow over it with the eyes or a finger",unit:29,opts:["trace", "microscope", "nuclear", "criticism"]},
    {w:"bomb",m:"\ud3ed\ud0c4",def:"an object that explodes and destroys large areas",unit:29,opts:["cope", "bomb", "submarine", "circumstance"]},
    {w:"glance",m:"\ud758\ub08f \ubcf4\ub2e4",def:"to look at it quickly",unit:29,opts:["coffin", "certificate", "glance", "criticism"]},
    {w:"submarine",m:"\uc7a0\uc218\ud568",def:"a boat that can go underwater for long periods of time",unit:29,opts:["nuclear", "submarine", "portray", "souvenir"]},
    {w:"nuclear",m:"\uc6d0\uc790\ub825\uc758",def:"relates to the division or joining of atoms",unit:29,opts:["circumstance", "devastate", "nuclear", "grief"]},
    {w:"certificate",m:"\uc99d\uc11c, \uc790\uaca9\uc99d",def:"a document that says that something is true or happened",unit:29,opts:["glance", "certificate", "frown", "nuclear"]},
    {w:"microscope",m:"\ud604\ubbf8\uacbd",def:"a device that makes small objects look bigger",unit:29,opts:["glance", "grief", "microscope", "nuclear"]},
    {w:"gaze",m:"\uc751\uc2dc\ud558\ub2e4",def:"to look at it for a long time",unit:29,opts:["license", "microscope", "souvenir", "gaze"]},
    {w:"souvenir",m:"\uae30\ub150\ud488",def:"something bought to remember of a place or event",unit:29,opts:["souvenir", "glance", "rotate", "trace"]},
  ],
  "eew3_30": [
    {w:"devise",m:"\uace0\uc548\ud558\ub2e4",def:"to come up with an idea or plan about it",unit:30,opts:["expertise", "devise", "shoulder", "fracture"]},
    {w:"distance",m:"\uac70\ub9ac",def:"how far it is between two points",unit:30,opts:["distance", "fracture", "ridge", "tolerate"]},
    {w:"implement",m:"\uc2dc\ud589\ud558\ub2e4",def:"to ensure that what has been planned is done",unit:30,opts:["optimism", "implement", "coastline", "proficient"]},
    {w:"spouse",m:"\ubc30\uc6b0\uc790",def:"the person to whom someone is married",unit:30,opts:["spouse", "raft", "ridge", "fracture"]},
    {w:"proficient",m:"\ub2a5\uc219\ud55c",def:"able to do something well",unit:30,opts:["limb", "tolerate", "expertise", "proficient"]},
    {w:"might",m:"(\uac15\ub825\ud55c) \ud798",def:"strength or power",unit:30,opts:["might", "distance", "deter", "fracture"]},
    {w:"tolerate",m:"\uacac\ub514\ub2e4",def:"to be able to accept it even when it is unpleasant",unit:30,opts:["tolerate", "devise", "insight", "raft"]},
    {w:"optimism",m:"\ub099\uad00\uc8fc\uc758",def:"the state of being hopeful about the future",unit:30,opts:["deter", "optimism", "might", "raft"]},
    {w:"expertise",m:"\uc804\ubb38 \uc9c0\uc2dd",def:"the knowledge and skills to do something well",unit:30,opts:["distance", "expertise", "fracture", "might"]},
    {w:"shove",m:"\ubc00\uce58\ub2e4",def:"to push it with a lot of power",unit:30,opts:["raft", "tolerate", "thrust", "shove"]},
    {w:"coastline",m:"\ud574\uc548\uc9c0\ub300",def:"the outline of a country\u2019s coast",unit:30,opts:["distance", "coastline", "deter", "headache"]},
    {w:"ridge",m:"\uc0b0\ub4f1\uc131\uc774",def:"a long, narrow piece of raised land",unit:30,opts:["expertise", "ridge", "shoulder", "devise"]},
    {w:"limb",m:"(\ud070) \ub098\ubb47\uac00\uc9c0",def:"a large branch on a tree",unit:30,opts:["shove", "limb", "thrust", "proficient"]},
    {w:"headache",m:"\ub450\ud1b5",def:"a pain in one\u2019s head",unit:30,opts:["might", "raft", "headache", "proficient"]},
    {w:"raft",m:"\ub5cf\ubaa9",def:"a flat kind of boat",unit:30,opts:["ridge", "raft", "tolerate", "optimism"]},
    {w:"deter",m:"\ub2e8\ub150\uc2dc\ud0a4\ub2e4",def:"to prevent or discourage someone from doing something",unit:30,opts:["deter", "devise", "implement", "might"]},
    {w:"thrust",m:"(\uac70\uce60\uac8c) \ubc00\ub2e4",def:"to push or move something quickly with a lot of force",unit:30,opts:["optimism", "thrust", "expertise", "proficient"]},
    {w:"fracture",m:"\uade0\uc5f4",def:"a crack or break in something",unit:30,opts:["proficient", "optimism", "fracture", "ridge"]},
    {w:"insight",m:"\ud1b5\ucc30\ub825",def:"a deep and accurate understanding of something",unit:30,opts:["fracture", "limb", "insight", "headache"]},
    {w:"shoulder",m:"\uc5b4\uae68",def:"the body part between the top of the arm and the neck",unit:30,opts:["coastline", "raft", "shoulder", "limb"]},
  ],
  "eew4_1": [
    {w:"addictive",m:"\uc911\ub3c5\uc131\uc758",def:"it is hard to stop doing",unit:1,opts:["keyboard", "platform", "addictive", "surge"]},
    {w:"surge",m:"\uae09\uc0c1\uc2b9",def:"a sudden, large increase in something",unit:1,opts:["addictive", "platform", "surge", "digital"]},
    {w:"survey",m:"\uc870\uc0ac",def:"a set of questions",unit:1,opts:["survey", "digital", "platform", "correlate"]},
    {w:"keyboard",m:"\ud0a4\ubcf4\ub4dc",def:"that are pressed to put information into a",unit:1,opts:["survey", "keyboard", "trend", "surge"]},
    {w:"target",m:"\ubaa9\ud45c",def:"to aim an attack at someone or something",unit:1,opts:["survey", "target", "poor", "trend"]},
    {w:"trend",m:"\ub3d9\ud5a5, \ucd94\uc138",def:"a general tendency",unit:1,opts:["addictive", "trend", "poor", "surge"]},
    {w:"digital",m:"\ub514\uc9c0\ud138\uc758",def:"it is characterized by computer technology",unit:1,opts:["addictive", "survey", "digital", "coin"]},
    {w:"coin",m:"(\uc0c8\ub85c\uc6b4 \ub0b1\ub9d0\uc744) \ub9cc\ub4e4\uc5b4\ub0b4\ub2e4",def:"to create a new word or phrase",unit:1,opts:["survey", "coin", "trend", "digital"]},
    {w:"platform",m:"\ud50c\ub7ab\ud3fc, \uac15\ub2e8",def:"large number of people about an idea,",unit:1,opts:["platform", "coin", "surge", "target"]},
    {w:"poor",m:"\uac00\ub09c\ud55c, \ube48\uace4\ud55c",def:"it is not as good as it could or should be",unit:1,opts:["platform", "poor", "addictive", "correlate"]},
    {w:"correlate",m:"\uc5f0\uad00\uc131\uc774 \uc788\ub2e4",def:"to have a close connection to something",unit:1,opts:["correlate", "poor", "target", "surge"]},
  ],
  "eew4_2": [
    {w:"leading",m:"\uac00\uc7a5 \uc911\uc694\ud55c",def:"it is the most advanced or best",unit:2,opts:["heal", "carbon", "enable", "leading"]},
    {w:"dust",m:"\uba3c\uc9c0",def:"dry particles of earth or sand.",unit:2,opts:["carbon", "enable", "dust", "heal"]},
    {w:"heal",m:"\uce58\uc720\ub418\ub2e4",def:"to become healthy or well again",unit:2,opts:["carbon", "heal", "dust", "emit"]},
    {w:"substance",m:"\ubb3c\uc9c8",def:"a particular type of solid, liquid, or gas",unit:2,opts:["substantially", "enable", "grind", "substance"]},
    {w:"prompt",m:"\uc989\uac01\uc801\uc778",def:"to cause someone to do something",unit:2,opts:["prompt", "carbon", "leading", "heal"]},
    {w:"substantially",m:"\uc0c1\ub2f9\ud788",def:"it changes a lot",unit:2,opts:["enable", "substantially", "carbon", "heal"]},
    {w:"carbon",m:"\ud0c4\uc18c",def:"a chemical element",unit:2,opts:["grind", "substance", "carbon", "leading"]},
    {w:"enable",m:"~\uc744 \ud560 \uc218 \uc788\uac8c \ud558\ub2e4",def:"to make it possible for something to happen.",unit:2,opts:["enable", "carbon", "substantially", "substance"]},
    {w:"grind",m:"\uac08\ub2e4",def:"to break something into small pieces or powder",unit:2,opts:["leading", "grind", "dust", "substantially"]},
    {w:"emit",m:"\ubc29\ucd9c\ud558\ub2e4",def:"to send out gas, heat, light, sound, etc.",unit:2,opts:["prompt", "emit", "grind", "dust"]},
  ],
  "eew4_3": [
    {w:"raid",m:"\uae09\uc2b5\ud558\ub2e4, \uce68\uc785\ud558\ub2e4",def:"to attack a place in a short time",unit:3,opts:["network", "raid", "barn", "rail"]},
    {w:"pastor",m:"\ubaa9\uc0ac",def:"a minister in charge of a parish or church.",unit:3,opts:["exceptional", "raid", "pastor", "detain"]},
    {w:"detain",m:"\uad6c\uae08\ud558\ub2e4",def:"to prevent someone from leaving a place",unit:3,opts:["tunnel", "exit", "detain", "network"]},
    {w:"passage",m:"\ud1b5\ub85c",def:"a narrow space that people can move through",unit:3,opts:["patrol", "raid", "passage", "outrage"]},
    {w:"rail",m:"\ucca0\ub3c4, \ub808\uc77c",def:"a system of tracks on which trains travel",unit:3,opts:["betray", "detain", "rail", "exit"]},
    {w:"authority",m:"\uc9c0\ud718\uad8c, \ub2f9\uad6d",def:"someone who has the power",unit:3,opts:["barn", "exit", "authority", "exceptional"]},
    {w:"tunnel",m:"\ud130\ub110",def:"an underground passage",unit:3,opts:["pastor", "tunnel", "exit", "outrage"]},
    {w:"exit",m:"\ucd9c\uad6c",def:"a way to get out of a place",unit:3,opts:["patrol", "network", "barn", "exit"]},
    {w:"network",m:"\ub9dd",def:"in some way connected to",unit:3,opts:["barn", "rail", "network", "betray"]},
    {w:"patrol",m:"\uc21c\ucc30, \uacbd\ucc30, \uacbd\ube44",def:"through an area to make sure that it is",unit:3,opts:["authority", "passage", "outrage", "patrol"]},
    {w:"outrage",m:"~\uc744 \ud654\ub098\uac8c \ud558\ub2e4",def:"to make someone feel very angry",unit:3,opts:["raid", "exceptional", "outrage", "betray"]},
    {w:"betray",m:"\ubc30\uc2e0\ud558\ub2e4, \ubc30\ubc18\ud558\ub2e4",def:"to be disloyal to someone who trusts you",unit:3,opts:["barn", "exceptional", "betray", "raid"]},
    {w:"exceptional",m:"\ud2b9\ucd9c\ud55c",def:"outstanding",unit:3,opts:["exit", "patrol", "raid", "exceptional"]},
    {w:"barn",m:"\ud5db\uac04",def:"a large farm building",unit:3,opts:["betray", "exit", "tunnel", "barn"]},
  ],
  "eew4_4": [
    {w:"vocal",m:"\uac70\uce68\uc5c6\uc774 \ub9c8\uad6c \uc758\uacac\uc744 \ub9d0\ud558\ub294",def:"he or she expresses a strong opinion publicly",unit:4,opts:["vocal", "soar", "hold", "power"]},
    {w:"position",m:"\uc704\uce58",def:"a rank or role",unit:4,opts:["inspire", "workplace", "comfortable", "position"]},
    {w:"field",m:"\ub4e4\ud310",def:"a subject that people study",unit:4,opts:["field", "soar", "guidance", "comfortable"]},
    {w:"guidance",m:"\uc9c0\ub3c4, \uc548\ub0b4",def:"about their work, education, or",unit:4,opts:["face", "guidance", "comfortable", "encouragement"]},
    {w:"endorse",m:"\uc9c0\uc9c0\ud558\ub2e4",def:"to express formal support",unit:4,opts:["power", "mere", "endorse", "guidance"]},
    {w:"soar",m:"\uae09\uc99d\ud558\ub2e4",def:"to increase quickly to a high level",unit:4,opts:["hold", "soar", "position", "workplace"]},
    {w:"power",m:"\ud798",def:"the ability to influence people",unit:4,opts:["responsibility", "mere", "power", "position"]},
    {w:"encouragement",m:"\uaca9\ub824",def:"determined, hopeful, or",unit:4,opts:["encouragement", "mere", "responsibility", "workplace"]},
    {w:"workplace",m:"\uc9c1\uc7a5",def:"the room or building where you work",unit:4,opts:["soar", "face", "workplace", "guidance"]},
    {w:"mere",m:"\uaca8\uc6b0 ~\uc758",def:"how small or unimportant something or someone is",unit:4,opts:["comfortable", "mere", "responsibility", "power"]},
    {w:"inspire",m:"\uaca9\ub824\ud558\ub2e4, \uc601\uac10\uc744 \uc8fc\ub2e4, \uace0\ucde8\ud558\ub2e4",def:"to encourage someone",unit:4,opts:["comfortable", "education", "inspire", "soar"]},
    {w:"hold",m:"\ubcf4\uc720\ud558\ub2e4",def:"to have a particular degree",unit:4,opts:["education", "soar", "inspire", "hold"]},
    {w:"face",m:"\uc9c1\uba74\ud558\ub2e4",def:"to deal with something in a direct way",unit:4,opts:["face", "endorse", "inspire", "power"]},
    {w:"responsibility",m:"\ucc45\uc784",def:"a task or duty",unit:4,opts:["guidance", "inspire", "responsibility", "comfortable"]},
    {w:"education",m:"\uad50\uc721",def:"usually at a school, college, or",unit:4,opts:["inspire", "education", "guidance", "endorse"]},
    {w:"comfortable",m:"\ud3b8\uc548\ud55c",def:"feel relaxed",unit:4,opts:["face", "guidance", "responsibility", "comfortable"]},
  ],
  "eew4_5": [
    {w:"canvas",m:"\uce94\ubc84\uc2a4 \ucc9c",def:"a thick piece of cloth",unit:5,opts:["practice", "stroke", "academic", "canvas"]},
    {w:"academic",m:"\ud559\uc5c5\uc758",def:"it relates to schools and education",unit:5,opts:["sunlight", "cinema", "academic", "realistic"]},
    {w:"realistic",m:"\ud604\uc2e4\uc801\uc778",def:"it is shown as it is in real life",unit:5,opts:["realistic", "blur", "sunlight", "array"]},
    {w:"key",m:"\uc911\uc694\ud55c, \uc8fc\uc694\ud55c",def:"it is extremely important.",unit:5,opts:["key", "practice", "canvas", "realistic"]},
    {w:"cinema",m:"\uc601\ud654\uad00",def:"a building in which films are shown",unit:5,opts:["sunlight", "realistic", "array", "cinema"]},
    {w:"array",m:"\uc9d1\ud569\uccb4",def:"a large group or number of things",unit:5,opts:["array", "stroke", "academic", "traditional"]},
    {w:"practice",m:"\uc2b5\uad00",def:"something that is done often or regularly",unit:5,opts:["cinema", "traditional", "realistic", "practice"]},
    {w:"sunlight",m:"\ud587\ube5b",def:"the natural light that comes from the sun.",unit:5,opts:["array", "academic", "blur", "sunlight"]},
    {w:"stroke",m:"\ubd93\ub180\ub9bc",def:"a single movement of a pen",unit:5,opts:["stroke", "realistic", "cinema", "practice"]},
    {w:"traditional",m:"\uc804\ud1b5\uc758, \uace0\ud48d\uc758",def:"it is based on old-fashioned ideas",unit:5,opts:["sunlight", "traditional", "academic", "realistic"]},
    {w:"movement",m:"\uc6b4\ub3d9",def:"a series of organized activities",unit:5,opts:["realistic", "cinema", "array", "movement"]},
    {w:"blur",m:"\ud750\ub9bf\ud574\uc9c0\ub2e4",def:"to make something unclear",unit:5,opts:["traditional", "sunlight", "blur", "academic"]},
  ],
  "eew4_6": [
    {w:"originally",m:"\uc6d0\ub798",def:"when something first happened or began",unit:6,opts:["beyond", "originally", "silence", "outbreak"]},
    {w:"wild",m:"\uc57c\uc0dd\uc758",def:"without control",unit:6,opts:["originally", "mark", "wild", "mobilize"]},
    {w:"mark",m:"\uae30\ub150\ud558\ub2e4",def:"to celebrate an important event",unit:6,opts:["outbreak", "wild", "mark", "beyond"]},
    {w:"anthem",m:"\uc131\uac00, \uc1a1\uac00",def:"a formal or religious song",unit:6,opts:["mark", "mobilize", "originally", "anthem"]},
    {w:"mobilize",m:"\ub3d9\uc6d0\ub418\ub2e4",def:"to prepare an army to fight in a war",unit:6,opts:["outbreak", "wild", "mark", "mobilize"]},
    {w:"thus",m:"\uc774\ub807\uac8c \ud558\uc5ec",def:"as a result of something that was just mentioned",unit:6,opts:["originally", "wild", "anthem", "thus"]},
    {w:"silence",m:"\uace0\uc694",def:"the complete absence of sound or noise",unit:6,opts:["silence", "mark", "mobilize", "thus"]},
    {w:"beyond",m:"~\uc744 \ub118\uc5b4\uc11c",def:"used to say that one thing is more than another",unit:6,opts:["outbreak", "thus", "mark", "beyond"]},
    {w:"outbreak",m:"\ubc1c\uc0dd",def:"a sudden start",unit:6,opts:["outbreak", "mark", "originally", "beyond"]},
  ],
  "eew4_7": [
    {w:"cease",m:"\uc911\ub2e8\ub418\ub2e4",def:"to stop doing something",unit:7,opts:["cease", "native", "reference", "forever"]},
    {w:"endangered",m:"\uba78\uc885 \uc704\uae30\uc5d0 \ucc98\ud55c",def:"very rare",unit:7,opts:["case", "endangered", "native", "generally"]},
    {w:"reference",m:"\ucc38\uace0, \uae30\uc900, \ud45c\uc900, \uc790\ub8cc",def:"the act of referring to something or someone",unit:7,opts:["case", "endangered", "reference", "native"]},
    {w:"urban",m:"\ub3c4\uc2dc\uc758",def:"it is related to towns and cities",unit:7,opts:["urban", "generally", "native", "devastating"]},
    {w:"generally",m:"\uc77c\ubc18\uc801\uc73c\ub85c",def:"in most cases",unit:7,opts:["generally", "endangered", "native", "forever"]},
    {w:"forever",m:"\uc601\uc6d0\ud788",def:"for all future time",unit:7,opts:["generally", "reference", "endangered", "forever"]},
    {w:"assimilate",m:"\ub3d9\ud654\ud558\ub2e4, \ud761\uc218\ud558\ub2e4",def:"to adopt the ways of a new culture",unit:7,opts:["case", "forever", "reference", "assimilate"]},
    {w:"case",m:"\uacbd\uc6b0",def:"an example of a particular situation",unit:7,opts:["urban", "forever", "assimilate", "case"]},
    {w:"native",m:"\ud0dc\uc5b4\ub09c \uacf3\uc758",def:"it refers to the place someone was born and raised",unit:7,opts:["cease", "native", "devastating", "forever"]},
    {w:"devastating",m:"\ub300\ub2e8\ud788 \ud30c\uad34\uc801\uc778",def:"it causes great harm",unit:7,opts:["devastating", "cease", "case", "assimilate"]},
  ],
  "eew4_8": [
    {w:"epilepsy",m:"\ub1cc\uc804\uc99d, \uac04\uc9c8",def:"and can make someone become",unit:8,opts:["keep", "metabolic", "powerful", "epilepsy"]},
    {w:"olive",m:"\uc62c\ub9ac\ube0c",def:"a small egg-shaped black or green fruit",unit:8,opts:["performance", "olive", "starch", "oil"]},
    {w:"starch",m:"\ud0c4\uc218\ud654\ubb3c",def:"energy and is found in foods such as",unit:8,opts:["coconut", "glucose", "starch", "metabolic"]},
    {w:"fat",m:"\uc9c0\ubc29",def:"an oily solid or liquid substance in food",unit:8,opts:["high", "starch", "performance", "fat"]},
    {w:"oil",m:"(\uc694\ub9ac\uc6a9) \uae30\ub984, \uc2dd\uc6a9\ub958",def:"thick liquid made from plants or some animals",unit:8,opts:["metabolic", "keep", "oil", "powerful"]},
    {w:"powerful",m:"\uc601\ud5a5\ub825 \uc788\ub294",def:"it has a strong effect",unit:8,opts:["oil", "olive", "powerful", "performance"]},
    {w:"metabolic",m:"\uc2e0\uc9c4\ub300\uc0ac\uc758",def:"it relates to the chemical",unit:8,opts:["metabolic", "low", "high", "keep"]},
    {w:"keep",m:"\uc720\uc9c0\ud558\ub2e4",def:"to stay in a particular state",unit:8,opts:["epilepsy", "performance", "keep", "high"]},
    {w:"low",m:"\ub0ae\uc740",def:"it is smaller than usual in amount",unit:8,opts:["fat", "burn", "low", "olive"]},
    {w:"glucose",m:"\ud3ec\ub3c4\ub2f9",def:"a natural form of sugar",unit:8,opts:["fat", "powerful", "glucose", "epilepsy"]},
    {w:"coconut",m:"\ucf54\ucf54\ub11b \uc5f4\ub9e4",def:"a large brown fruit",unit:8,opts:["coconut", "low", "metabolic", "fat"]},
    {w:"high",m:"\ub192\uc740",def:"it is greater than usual in amount, number, or degree",unit:8,opts:["starch", "high", "olive", "glucose"]},
    {w:"performance",m:"\uacf5\uc5f0",def:"how well someone or something functions",unit:8,opts:["coconut", "performance", "high", "starch"]},
    {w:"burn",m:"\ud0c0\uc624\ub974\ub2e4, \ud0c0\ub2e4, \uc5f0\uc18c\ud558\ub2e4",def:"to use something as a source of energy",unit:8,opts:["high", "keep", "burn", "low"]},
  ],
  "eew4_9": [
    {w:"cognitive",m:"\uc778\uc2dd\uc758",def:"it is related to learning and knowing things",unit:9,opts:["competent", "area", "cognitive", "bachelor"]},
    {w:"bachelor",m:"\ubbf8\ud63c\ub0a8",def:"an unmarried man",unit:9,opts:["theoretical", "job", "minimum", "bachelor"]},
    {w:"integral",m:"\ud544\uc218\uc801\uc778, \ud544\uc694\ubd88\uac00\uacb0\ud55c",def:"an important part of the whole",unit:9,opts:["integral", "cognitive", "bachelor", "area"]},
    {w:"theoretical",m:"\uc774\ub860\uc758",def:"based on theory rather than experience",unit:9,opts:["competent", "theoretical", "area", "cognitive"]},
    {w:"job",m:"\uc77c, \uc9c1\uc7a5",def:"the work you do to earn money",unit:9,opts:["integral", "cognitive", "theoretical", "job"]},
    {w:"area",m:"\uc9c0\uc5ed",def:"a reasonably large place",unit:9,opts:["job", "theoretical", "area", "integral"]},
    {w:"analytic",m:"\ubd84\uc11d\uc801\uc778",def:"it is related to logic and reasoning",unit:9,opts:["bachelor", "weak", "analytic", "area"]},
    {w:"minimum",m:"\ucd5c\uc800\uc758",def:"the smallest amount",unit:9,opts:["radioactive", "minimum", "job", "weak"]},
    {w:"competent",m:"\ub2a5\uc219\ud55c",def:"they are able to think or act successfully",unit:9,opts:["theoretical", "weak", "radioactive", "competent"]},
    {w:"weak",m:"\uc57d\ud55c",def:"not strong and healthy",unit:9,opts:["cognitive", "weak", "analytic", "area"]},
    {w:"radioactive",m:"\ubc29\uc0ac\ub2a5\uc758",def:"then it lets out, or is related to, radiation",unit:9,opts:["bachelor", "cognitive", "job", "radioactive"]},
  ],
  "eew4_10": [
    {w:"automate",m:"\uc790\ub3d9\ud654\ud558\ub2e4",def:"to have machines or computers do the work",unit:10,opts:["automate", "incentive", "rubbish", "dispose"]},
    {w:"transaction",m:"\uac70\ub798, \ub9e4\ub9e4",def:"an act of buying or selling something",unit:10,opts:["corrupt", "manipulate", "transaction", "revenue"]},
    {w:"legitimate",m:"\uc815\ub2f9\ud55c",def:"then it is acceptable according to the law",unit:10,opts:["violate", "revenue", "legitimate", "incentive"]},
    {w:"manipulate",m:"\uc870\uc885\ud558\ub2e4, \uc870\uc791\ud558\ub2e4, \uc18d\uc774\ub2e4",def:"to skillfully or unfairly control or affect it",unit:10,opts:["manipulate", "merchandise", "violate", "dispose"]},
    {w:"affluent",m:"\ubd80\uc720\ud55c",def:"wealthy",unit:10,opts:["affluent", "corrupt", "revenue", "rubbish"]},
    {w:"merchandise",m:"\ubb3c\ud488",def:"goods ready to be purchased or sold",unit:10,opts:["rubbish", "merchandise", "violate", "legitimate"]},
    {w:"corrupt",m:"\ubd80\ud328\ud55c",def:"they break the law for money or fame",unit:10,opts:["transaction", "corrupt", "legislate", "automate"]},
    {w:"rubbish",m:"\uc4f0\ub808\uae30",def:"trash or waste",unit:10,opts:["rubbish", "violate", "incentive", "transaction"]},
    {w:"revenue",m:"\uc218\uc775",def:"the income made by a company",unit:10,opts:["violate", "legitimate", "transaction", "revenue"]},
    {w:"incentive",m:"\uc7a5\ub824\ucc45",def:"what makes a person want to do something",unit:10,opts:["incentive", "corrupt", "revenue", "affluent"]},
    {w:"legislate",m:"\ubc95\ub960\uc744 \uc81c\uc815\ud558\ub2e4",def:"to make laws",unit:10,opts:["transaction", "affluent", "manipulate", "legislate"]},
    {w:"violate",m:"(\ubc95\uc744) \uc704\ubc18\ud558\ub2e4",def:"a law, rule, or agreement means to break it",unit:10,opts:["automate", "violate", "legislate", "corrupt"]},
    {w:"dispose",m:"\ucc98\ubd84\ud558\ub2e4",def:"something means to get rid of it",unit:10,opts:["corrupt", "dispose", "incentive", "revenue"]},
  ],
  "eew4_11": [
    {w:"proximity",m:"\uac00\uae4c\uc6c0",def:"closeness in time, space, or relationships",unit:11,opts:["fabulous", "subsequent", "proximity", "impulse"]},
    {w:"remedy",m:"\uc694\ubc95",def:"a cure for a disease, argument, or problem",unit:11,opts:["remedy", "commence", "haste", "inhibit"]},
    {w:"inhibit",m:"\uc5b5\uc81c\ud558\ub2e4",def:"you stop it from developing",unit:11,opts:["proximity", "inhibit", "fabulous", "synthetic"]},
    {w:"astonish",m:"\uae5c\uc9dd \ub180\ub77c\uac8c \ud558\ub2e4",def:"to greatly surprise them",unit:11,opts:["synthetic", "terminal", "subsequent", "astonish"]},
    {w:"commence",m:"\uc2dc\uc791\ub418\ub2e4",def:"to begin it",unit:11,opts:["ongoing", "astonish", "inhibit", "commence"]},
    {w:"ongoing",m:"\uacc4\uc18d \uc9c4\ud589 \uc911\uc778",def:"then it is still happening or still growing",unit:11,opts:["ongoing", "proximity", "haste", "fabulous"]},
    {w:"haste",m:"\uc11c\ub450\ub984, \uae09\ud568",def:"speed in movement or action",unit:11,opts:["subsequent", "proximity", "haste", "precise"]},
    {w:"subsequent",m:"\uadf8 \ub2e4\uc74c\uc758",def:"then it comes after something else in time",unit:11,opts:["subsequent", "astonish", "inhibit", "proximity"]},
    {w:"synthetic",m:"\uc778\uc870\uc758",def:"then it is made to be like something natural",unit:11,opts:["subsequent", "impulse", "synthetic", "terminal"]},
    {w:"precise",m:"\uc815\ud655\ud55c, \uc815\ubc00\ud55c",def:"exact and careful about their work",unit:11,opts:["impulse", "subsequent", "haste", "precise"]},
    {w:"fabulous",m:"\uae30\ub9c9\ud788\uac8c \uc88b\uc740",def:"extremely good",unit:11,opts:["fabulous", "ongoing", "remedy", "inhibit"]},
    {w:"terminal",m:"\ubd88\uce58\uc758, \ub9d0\uae30\uc758",def:"then it causes or results in death",unit:11,opts:["terminal", "haste", "ongoing", "remedy"]},
    {w:"impulse",m:"\ucda9\ub3d9",def:"a sudden thoughtless urge to do something",unit:11,opts:["impulse", "haste", "fabulous", "precise"]},
    {w:"significance",m:"\uc911\uc694\uc131",def:"the quality that makes it important",unit:11,opts:["impulse", "remedy", "inhibit", "significance"]},
  ],
  "eew4_12": [
    {w:"multiple",m:"\ub9ce\uc740, \ub2e4\uc591\ud55c",def:"many of them",unit:12,opts:["overall", "classical", "acute", "multiple"]},
    {w:"acute",m:"\uadf9\uc2ec\ud55c",def:"very severe and intense",unit:12,opts:["acute", "creation", "notorious", "gorgeous"]},
    {w:"boost",m:"\ub298\ub9ac\ub2e4",def:"to increase or improve it",unit:12,opts:["inevitable", "aggression", "spontaneous", "boost"]},
    {w:"classical",m:"\uace0\uc804\uc758, \ud074\ub798\uc2dd\uc758 \uc804\ud1b5\uc801\uc778",def:"more formal and serious than popular music",unit:12,opts:["classical", "aggression", "inevitable", "compel"]},
    {w:"compel",m:"\uac15\uc694\ud558\ub2e4",def:"to force them to do it",unit:12,opts:["multiple", "compel", "creation", "partiality"]},
    {w:"creation",m:"\ucc3d\uc870, \uc2e0\uc124",def:"something original that is made",unit:12,opts:["virtue", "boost", "creation", "aggression"]},
    {w:"partiality",m:"\ud3b8\uc560",def:"a tendency to prefer one thing to another",unit:12,opts:["partiality", "virtue", "classical", "spontaneous"]},
    {w:"notorious",m:"\uc545\uba85 \ub192\uc740",def:"it is well known because of something bad",unit:12,opts:["notorious", "multiple", "aggression", "overall"]},
    {w:"virtue",m:"\uc120\ud589, \ubbf8\ub355, \ub355\ubaa9",def:"a good quality or way of behaving",unit:12,opts:["overall", "creation", "virtue", "multiple"]},
    {w:"overall",m:"\uc885\ud569\uc801\uc778, \uc804\uccb4\uc758",def:"the whole thing is considered",unit:12,opts:["gorgeous", "aggression", "overall", "acute"]},
    {w:"narrate",m:"\uc774\uc57c\uae30\ub97c \ub4e4\ub824\uc8fc\ub2e4",def:"to write about it or read it aloud",unit:12,opts:["compel", "boost", "acute", "narrate"]},
    {w:"inevitable",m:"\ubd88\uac00\ud53c\ud55c",def:"certain to happen or cannot be avoided.",unit:12,opts:["compel", "inevitable", "narrate", "partiality"]},
    {w:"spontaneous",m:"\uc989\ud765\uc801\uc778",def:"not planned",unit:12,opts:["spontaneous", "classical", "acute", "gorgeous"]},
    {w:"gorgeous",m:"\uc544\uc8fc \uba4b\uc9c4",def:"very pleasing and attractive",unit:12,opts:["gorgeous", "classical", "boost", "inevitable"]},
    {w:"aggression",m:"\uacf5\uaca9\uc131",def:"behavior that is mean or violent to others",unit:12,opts:["virtue", "inevitable", "gorgeous", "aggression"]},
  ],
  "eew4_13": [
    {w:"premise",m:"\uc804\uc81c",def:"an idea on which something is based",unit:13,opts:["premise", "disprove", "optic", "spatial"]},
    {w:"specify",m:"\uba85\uc2dc\ud558\ub2e4",def:"to describe something clearly",unit:13,opts:["aspect", "specify", "spatial", "awareness"]},
    {w:"undertake",m:"\ucc29\uc218\ud558\ub2e4",def:"to take on the responsibility of doing it",unit:13,opts:["undertake", "asset", "rack", "humanitarian"]},
    {w:"assignment",m:"\uacfc\uc81c, \uc784\ubb34",def:"task that is given to you to do",unit:13,opts:["awareness", "assignment", "humanitarian", "asset"]},
    {w:"credit",m:"\uc2e0\uc6a9",def:"money available for a client to borrow",unit:13,opts:["informative", "credit", "awareness", "assignment"]},
    {w:"awareness",m:"\uc758\uc2dd",def:"knowledge or perception",unit:13,opts:["undertake", "humanitarian", "awareness", "optic"]},
    {w:"disprove",m:"\ud2c0\ub838\uc74c\uc744 \uc785\uc99d\ud558\ub2e4",def:"to show that it is not true",unit:13,opts:["assignment", "rack", "disprove", "informative"]},
    {w:"rack",m:"\ubc1b\uce68\ub300",def:"an object with shelves that holds things",unit:13,opts:["rack", "optic", "spatial", "awareness"]},
    {w:"aspect",m:"\uce21\uba74",def:"one part or feature of something.",unit:13,opts:["awareness", "informative", "rack", "aspect"]},
    {w:"spatial",m:"\uacf5\uac04\uc758",def:"it relates to the position and size of things",unit:13,opts:["spatial", "credit", "optic", "premise"]},
    {w:"optic",m:"\ub208\uc758",def:"it relates to the eyes or light",unit:13,opts:["premise", "assignment", "optic", "disprove"]},
    {w:"informative",m:"\uc720\uc6a9\ud55c \uc815\ubcf4\ub97c \uc8fc\ub294, \uc720\uc775\ud55c",def:"it provides a lot of information",unit:13,opts:["informative", "asset", "undertake", "aspect"]},
    {w:"coordinate",m:"\uc870\uc9c1\ud654\ud558\ub2e4",def:"to make different parts work together",unit:13,opts:["awareness", "coordinate", "assignment", "asset"]},
    {w:"humanitarian",m:"\uc778\ub3c4\uc8fc\uc758\uc801\uc778",def:"it is connected to helping people\u2019s lives",unit:13,opts:["premise", "humanitarian", "coordinate", "credit"]},
    {w:"asset",m:"\uc790\uc0b0",def:"a skill or quality that is useful or valuable",unit:13,opts:["disprove", "spatial", "rack", "asset"]},
  ],
  "eew4_14": [
    {w:"proponent",m:"\uc9c0\uc9c0\uc790",def:"a person who supports an idea or a plan",unit:14,opts:["chaotic", "proponent", "refine", "brainstorm"]},
    {w:"restrict",m:"\uc81c\ud55c\ud558\ub2e4",def:"to limit it and prevent it from getting bigger",unit:14,opts:["archeological", "restrict", "proponent", "prehistoric"]},
    {w:"addict",m:"\uc911\ub3c5\uc790",def:"a person who cannot stop doing something",unit:14,opts:["correspond", "addict", "refine", "integrity"]},
    {w:"refine",m:"\uc815\uc81c\ud558\ub2e4, \uc81c\ub828\ud558\ub2e4",def:"to make it better by making changes",unit:14,opts:["prehistoric", "refine", "team", "proponent"]},
    {w:"brainstorm",m:"\ube0c\ub808\uc778\uc2a4\ud1a0\ubc0d\ud558\ub2e4",def:"to have a lot of ideas about a certain topic",unit:14,opts:["chaotic", "proponent", "brainstorm", "archeological"]},
    {w:"team",m:"\ub2e8\uccb4",def:"a group of people who work closely together",unit:14,opts:["hydrogen", "restrict", "addict", "team"]},
    {w:"correspond",m:"\uc77c\uce58\ud558\ub2e4",def:"to match or to be similar to something",unit:14,opts:["addict", "correspond", "proponent", "hydrogen"]},
    {w:"prehistoric",m:"\uc120\uc0ac \uc2dc\ub300\uc758",def:"from a time before written history",unit:14,opts:["archeological", "prehistoric", "integrity", "proponent"]},
    {w:"hydrogen",m:"\uc218\uc18c",def:"a gas that has no taste, color, or smell",unit:14,opts:["chaotic", "refine", "correspond", "hydrogen"]},
    {w:"integrity",m:"\uc9c4\uc2e4\uc131",def:"honesty and good morals",unit:14,opts:["proponent", "prehistoric", "team", "integrity"]},
    {w:"archeological",m:"\uace0\uace0\ud559\uc758",def:"it relates to archeology",unit:14,opts:["prehistoric", "archeological", "correspond", "team"]},
    {w:"chaotic",m:"\ud63c\ub3c8\uc0c1\ud0dc\uc778",def:"crazy, confused, and hectic",unit:14,opts:["hydrogen", "chaotic", "correspond", "addict"]},
  ],
  "eew4_15": [
    {w:"input",m:"\uc785\ub825",def:"information that is put into a computer",unit:15,opts:["quantum", "input", "prevalent", "immune"]},
    {w:"quantum",m:"\uc591\uc790",def:"it relates to the behavior of atomic particles",unit:15,opts:["magnet", "input", "quantum", "prevalent"]},
    {w:"prevalent",m:"\ub110\ub9ac \ud37c\uc9c4, \ub9cc\uc5f0\ud55c",def:"common",unit:15,opts:["prevalent", "immune", "quantum", "input"]},
    {w:"magnet",m:"\uc790\uc11d",def:"a piece of iron or other material",unit:15,opts:["quantum", "prevalent", "input", "magnet"]},
    {w:"intimate",m:"\uce5c\ubc00\ud55c",def:"the two things are very closely connected",unit:15,opts:["input", "quantum", "complement", "intimate"]},
    {w:"database",m:"\ub370\uc774\ud130\ubca0\uc774\uc2a4",def:"a collection of data",unit:15,opts:["immune", "quantum", "database", "intimate"]},
    {w:"complement",m:"\ub098\ubb34\ub784 \ub370 \uc5c6\uac8c \ud558\ub2e4",def:"to make them better",unit:15,opts:["complement", "prevalent", "database", "magnet"]},
    {w:"immune",m:"\uba74\uc5ed\uc131\uc774 \uc788\ub294",def:"they cannot be affected by it",unit:15,opts:["immune", "intimate", "prevalent", "database"]},
  ],
  "eew4_16": [
    {w:"deceptive",m:"\uae30\ub9cc\uc801\uc778",def:"it encourages one to believe something that is false",unit:16,opts:["ethics", "regime", "deceptive", "eliminate"]},
    {w:"nectar",m:"(\uaf43, \uacfc\uc77c\uc758) \uafc0, \uacfc\uc999",def:"a sweet liquid produced by flowers",unit:16,opts:["ethics", "nectar", "eliminate", "explicit"]},
    {w:"eliminate",m:"\uc5c6\uc560\ub2e4",def:"to completely remove it",unit:16,opts:["erosion", "nectar", "straightforward", "eliminate"]},
    {w:"ethics",m:"\uc724\ub9ac\ud559",def:"moral beliefs or rules about right or wrong",unit:16,opts:["ethics", "manufacture", "deceptive", "eliminate"]},
    {w:"regime",m:"\uc815\uad8c",def:"a system of government or management",unit:16,opts:["explicit", "ethics", "regime", "diabetes"]},
    {w:"explicit",m:"\ubd84\uba85\ud55c, \uc194\uc9c1\ud55c",def:"it is very clear, open, and truthful",unit:16,opts:["erosion", "nectar", "explicit", "straightforward"]},
    {w:"notion",m:"\uac1c\ub150, \uad00\ub150",def:"an idea or belief about something",unit:16,opts:["diabetes", "notion", "cholesterol", "manufacture"]},
    {w:"cholesterol",m:"\ucf5c\ub808\uc2a4\ud14c\ub864",def:"a substance in fat, tissues, and blood of all animals",unit:16,opts:["straightforward", "nectar", "cholesterol", "manufacture"]},
    {w:"straightforward",m:"\uc9c1\uc811\uc758, \uc194\uc9c1\ud55c, \ub611\ubc14\ub85c",def:"it is easy to understand",unit:16,opts:["deceptive", "regime", "straightforward", "eliminate"]},
    {w:"diabetes",m:"\ub2f9\ub1e8\ubcd1",def:"body cannot control the level of",unit:16,opts:["cholesterol", "diabetes", "straightforward", "erosion"]},
    {w:"erosion",m:"\ubd80\uc2dd",def:"the destruction of rock",unit:16,opts:["erosion", "nectar", "straightforward", "notion"]},
    {w:"manufacture",m:"\uc0dd\uc0b0\ud558\ub2e4",def:"to make it in a factory",unit:16,opts:["explicit", "straightforward", "manufacture", "eliminate"]},
  ],
  "eew4_17": [
    {w:"furnish",m:"\ube44\uce58\ud558\ub2e4, \uc81c\uacf5\ud558\ub2e4, \uac16\ucd94\ub2e4",def:"to put furniture in a house or room",unit:17,opts:["furnish", "bankrupt", "employ", "forthcoming"]},
    {w:"employ",m:"\uace0\uc6a9\ud558\ub2e4",def:"to give work to them",unit:17,opts:["whereby", "furnish", "employ", "tenant"]},
    {w:"forthcoming",m:"\ub2e4\uac00\uc624\ub294",def:"then it is about to happen in the future",unit:17,opts:["bankrupt", "forthcoming", "hygienic", "personnel"]},
    {w:"expel",m:"\ucad3\uc544\ub0b4\ub2e4",def:"to force them to leave a place",unit:17,opts:["expel", "lease", "mend", "furnish"]},
    {w:"personnel",m:"\uc9c1\uc6d0",def:"employees in a business.",unit:17,opts:["expel", "forthcoming", "personnel", "bankrupt"]},
    {w:"whereby",m:"\ubb34\uc5c7\uc5d0 \uc758\ud558\uc5ec, \uadf8\ub9ac\uace0 \uadf8\uac83\uc73c\ub85c \uc778\ud558\uc5ec",def:"by which or through which",unit:17,opts:["conform", "whereby", "furnish", "lease"]},
    {w:"conform",m:"\ub530\ub974\ub2e4",def:"to rules or laws is to obey them",unit:17,opts:["conform", "bankrupt", "landlord", "personnel"]},
    {w:"lease",m:"\uc784\ub300\ud558\ub2e4",def:"to rent property",unit:17,opts:["mend", "lease", "expel", "tenant"]},
    {w:"landlord",m:"\uc8fc\uc778",def:"a man who rents property to a person",unit:17,opts:["hygienic", "mend", "landlord", "tenant"]},
    {w:"mandatory",m:"\uc758\ubb34\uc801\uc778",def:"it is required by law",unit:17,opts:["whereby", "mend", "bankrupt", "mandatory"]},
    {w:"hygienic",m:"\uc704\uc0dd\uc801\uc778",def:"clean and unlikely to cause disease",unit:17,opts:["employ", "mend", "hygienic", "lease"]},
    {w:"bankrupt",m:"\ud30c\uc0b0\ud55c",def:"then they are unable to pay their debts",unit:17,opts:["bankrupt", "forthcoming", "furnish", "mend"]},
    {w:"mend",m:"\uc218\ub9ac\ud558\ub2e4",def:"to fix it when it is broken or damaged",unit:17,opts:["furnish", "mend", "personnel", "employ"]},
    {w:"tenant",m:"\uc138\uc785\uc790",def:"a person who rents property from a landlord",unit:17,opts:["whereby", "tenant", "bankrupt", "mend"]},
  ],
  "eew4_18": [
    {w:"transfer",m:"\uc774\ub3d9\ud558\ub2e4",def:"to move it from one place to another",unit:18,opts:["prescribe", "dynamic", "cellular", "transfer"]},
    {w:"rigid",m:"\uc5c4\uaca9\ud55c",def:"they cannot be changed",unit:18,opts:["minimal", "pioneer", "rigid", "cellular"]},
    {w:"similar",m:"\ube44\uc2b7\ud55c",def:"almost the same",unit:18,opts:["rigid", "surgeon", "similar", "cellular"]},
    {w:"minimal",m:"\uc544\uc8fc \uc801\uc740",def:"very small",unit:18,opts:["surgeon", "cellular", "minimal", "transfer"]},
    {w:"surgeon",m:"\uc678\uacfc\uc758",def:"a doctor who is trained to do surgery",unit:18,opts:["rigid", "dynamic", "cellular", "surgeon"]},
    {w:"pioneer",m:"\uac1c\ucc99\uc790",def:"a person who is the first to discover",unit:18,opts:["dynamic", "minimal", "rigid", "pioneer"]},
    {w:"cellular",m:"\uc138\ud3ec\uc758",def:"it relates to the cells of animals or plants",unit:18,opts:["cellular", "rigid", "surgeon", "prescribe"]},
    {w:"dynamic",m:"\ud65c\ubc1c\ud55c",def:"lively and have creative ideas",unit:18,opts:["prescribe", "surgeon", "rigid", "dynamic"]},
    {w:"prescribe",m:"\ucc98\ubc29\ud558\ub2e4",def:"to tell someone to take it",unit:18,opts:["cellular", "minimal", "prescribe", "pioneer"]},
  ],
  "eew4_19": [
    {w:"mariner",m:"\uc120\uc6d0",def:"a sailor",unit:19,opts:["permanence", "mariner", "stranded", "deviate"]},
    {w:"couple",m:"2\uac1c, \ud55c \uc30d",def:"made of two things that go together",unit:19,opts:["mariner", "couple", "multitude", "erroneous"]},
    {w:"soothe",m:"\ub2ec\ub798\ub2e4",def:"to calm someone who is angry or upset",unit:19,opts:["deviate", "err", "soothe", "multitude"]},
    {w:"technique",m:"\uae30\ubc95",def:"a way of doing something",unit:19,opts:["erroneous", "couple", "technique", "differentiate"]},
    {w:"revolve",m:"\uc804\uac1c\ub418\ub2e4",def:"to keep it as the main feature or focus",unit:19,opts:["latitude", "soothe", "multitude", "revolve"]},
    {w:"permanence",m:"\uc601\uad6c\uc131",def:"something is its ability to last forever",unit:19,opts:["err", "stranded", "technique", "permanence"]},
    {w:"erroneous",m:"\uc798\ubabb\ub41c",def:"it is incorrect or only partly correct.",unit:19,opts:["latitude", "erroneous", "revolve", "technique"]},
    {w:"deviate",m:"\ubc97\uc5b4\ub098\ub2e4",def:"to move away from your proper course",unit:19,opts:["multitude", "stranded", "err", "deviate"]},
    {w:"latitude",m:"\uc704\ub3c4",def:"place is its distance from the equator",unit:19,opts:["latitude", "mariner", "couple", "revolve"]},
    {w:"stranded",m:"\ubb36\uc778, \uc624\ub3c4\uac00\ub3c4 \ubabb\ud558\ub294, \uc88c\ucd08\ub41c",def:"they are prevented from leaving a place",unit:19,opts:["mariner", "permanence", "stranded", "technique"]},
    {w:"multitude",m:"\ub2e4\uc218",def:"a very large number of them",unit:19,opts:["technique", "multitude", "soothe", "permanence"]},
    {w:"differentiate",m:"\uad6c\ubcc4\ud558\ub2e4",def:"to show the difference between them",unit:19,opts:["permanence", "multitude", "latitude", "differentiate"]},
    {w:"err",m:"\uc2e4\uc218\ub97c \ubc94\ud558\ub2e4",def:"to make a mistake",unit:19,opts:["permanence", "err", "revolve", "deviate"]},
  ],
  "eew4_20": [
    {w:"craze",m:"\ub300\uc720\ud589",def:"a brief and popular activity or object",unit:20,opts:["tangle", "absurd", "reputable", "craze"]},
    {w:"absurd",m:"\uc6b0\uc2a4\uaf5d\uc2a4\ub7ec\uc6b4",def:"ridiculous",unit:20,opts:["denote", "vanity", "enlarge", "absurd"]},
    {w:"reputable",m:"\ud3c9\ud310\uc774 \uc88b\uc740",def:"then they have a good reputation",unit:20,opts:["tangle", "reputable", "enlarge", "vanity"]},
    {w:"attire",m:"\uc758\ubcf5",def:"nice or special clothing",unit:20,opts:["style", "craze", "tangle", "attire"]},
    {w:"tangle",m:"\uc5bd\ud78c\uac83",def:"something or many things twisted together",unit:20,opts:["attire", "signify", "vanity", "tangle"]},
    {w:"signify",m:"\uc758\ubbf8\ud558\ub2e4",def:"to be a symbol of something",unit:20,opts:["absurd", "signify", "attire", "reputable"]},
    {w:"denote",m:"~\uc758 \uba85\uce6d\uc774\ub2e4, \ud45c\uc2dc\ud558\ub2e4",def:"to make known",unit:20,opts:["style", "denote", "enlarge", "attire"]},
    {w:"style",m:"\ubc29\uc2dd, \uc591\uc2dd, \uc2a4\ud0c0\uc77c",def:"the way you do things",unit:20,opts:["signify", "style", "enlarge", "tangle"]},
    {w:"enlarge",m:"\ud655\uc7a5\ud558\ub2e4, \ub298\ub9ac\ub2e4",def:"to make it bigger",unit:20,opts:["enlarge", "tangle", "denote", "signify"]},
    {w:"vanity",m:"\uc790\ub9cc\uc2ec",def:"excessive pride",unit:20,opts:["craze", "enlarge", "tangle", "vanity"]},
  ],
  "eew4_21": [
    {w:"individual",m:"\uac1c\uc778",def:"a single member of a group",unit:21,opts:["theorize", "vigorous", "individual", "obstruct"]},
    {w:"surplus",m:"\uacfc\uc789",def:"an extra amount of something",unit:21,opts:["surplus", "plunge", "theorize", "obstruct"]},
    {w:"gazette",m:"\uc2e0\ubb38, \uad00\ubcf4",def:"a newspaper",unit:21,opts:["gazette", "finally", "vigorous", "theorize"]},
    {w:"finally",m:"\ub9c8\uce68\ub0b4",def:"at the end of a series of events",unit:21,opts:["individual", "finally", "prolong", "devoid"]},
    {w:"plunge",m:"\ub6f0\uc5b4\ub4e4\ub2e4, \ub5a8\uc5b4\uc9c0\ub2e4",def:"to move down into something very quickly",unit:21,opts:["theorize", "finally", "verify", "plunge"]},
    {w:"vigorous",m:"\ud65c\ubc1c\ud55c",def:"they use a lot of energy",unit:21,opts:["vigorous", "theorize", "ashore", "devoid"]},
    {w:"obstruct",m:"\ub9c9\ub2e4",def:"to get in its way",unit:21,opts:["obstruct", "gazette", "major", "finally"]},
    {w:"publicize",m:"\uc54c\ub9ac\ub2e4",def:"to make something get a lot of attention",unit:21,opts:["surplus", "publicize", "plunge", "vigorous"]},
    {w:"devoid",m:"~\uc774 \uc804\ud600 \uc5c6\ub294",def:"devoid of a thing, they are missing it",unit:21,opts:["theorize", "devoid", "finally", "gazette"]},
    {w:"major",m:"\uc8fc\uc694\ud55c",def:"a very important event",unit:21,opts:["gazette", "individual", "major", "prolong"]},
    {w:"ashore",m:"\ud574\uc548\uc73c\ub85c",def:"it goes from the water to the land",unit:21,opts:["vigorous", "gazette", "ashore", "major"]},
    {w:"theorize",m:"\uc774\ub860\uc744 \uc81c\uc2dc\ud558\ub2e4",def:"to develop ideas about something",unit:21,opts:["gazette", "theorize", "ashore", "finally"]},
    {w:"verify",m:"\ud655\uc778\ud558\ub2e4",def:"to find out if something is true",unit:21,opts:["devoid", "verify", "obstruct", "ashore"]},
    {w:"prolong",m:"\uc5f0\uc7a5\uc2dc\ud0a4\ub2e4",def:"to make something last for a longer time",unit:21,opts:["prolong", "surplus", "finally", "vigorous"]},
  ],
  "eew4_22": [
    {w:"interpret",m:"\uc124\uba85\ud558\ub2e4, \ud574\uc11d\ud558\ub2e4",def:"to find its meaning",unit:22,opts:["motive", "dung", "deception", "interpret"]},
    {w:"gratify",m:"\uae30\uc058\uac8c\ud558\ub2e4",def:"to please them",unit:22,opts:["deceased", "psychotic", "gratify", "dung"]},
    {w:"deceased",m:"\uc0ac\ub9dd\ud55c",def:"dead",unit:22,opts:["psychotic", "deceased", "altar", "credible"]},
    {w:"altar",m:"\uc81c\ub2e8",def:"a table used in churches",unit:22,opts:["deception", "altar", "dung", "credible"]},
    {w:"credible",m:"\ubbff\uc744\uc218 \uc788\ub294",def:"they can be believed or trusted",unit:22,opts:["interpret", "altar", "credible", "psychotic"]},
    {w:"motive",m:"\ub3d9\uae30, \uc774\uc720",def:"your reason for doing something",unit:22,opts:["botany", "text", "deception", "motive"]},
    {w:"dung",m:"\ub625",def:"solid waste material produced by animals",unit:22,opts:["altar", "hone", "dung", "deception"]},
    {w:"sinister",m:"\uc0ac\uc545\ud55c",def:"they are evil",unit:22,opts:["credible", "sinister", "gratify", "altar"]},
    {w:"botany",m:"\uc2dd\ubb3c\ud559",def:"the study of plants",unit:22,opts:["deceased", "botany", "text", "motive"]},
    {w:"text",m:"\uae00, \ubb38\uc11c",def:"language used in communicating messages",unit:22,opts:["text", "motive", "psychotic", "deception"]},
    {w:"hone",m:"\uc5f0\ub9c8\ud558\ub2e4",def:"to improve it and make it very good",unit:22,opts:["interpret", "text", "dung", "hone"]},
    {w:"deception",m:"\uc18d\uc784, \uae30\ub9cc",def:"the act of lying or tricking someone",unit:22,opts:["text", "motive", "botany", "deception"]},
    {w:"psychotic",m:"\uc815\uc2e0\ubcd1\uc758",def:"they have a very serious mental illness",unit:22,opts:["psychotic", "interpret", "deception", "altar"]},
  ],
  "eew4_23": [
    {w:"rupture",m:"\ud130\uc9c0\ub2e4, \ud30c\uc5f4\ud558\ub2e4",def:"to tear or burst open",unit:23,opts:["magnify", "invalid", "savage", "rupture"]},
    {w:"elusive",m:"\ucc3e\uae30 \uc5b4\ub824\uc6b4",def:"they are hard to find",unit:23,opts:["susceptible", "elusive", "ensure", "savage"]},
    {w:"minor",m:"\uc791\uc740, \uc18c\uc218\uc758",def:"a very small and unimportant problem",unit:23,opts:["inseparable", "invalid", "prevail", "minor"]},
    {w:"ensure",m:"\ubcf4\uc7a5\ud558\ub2e4, \ud655\uc2e4\ud558\uac8c \ud558\ub2e4",def:"to make sure it happens",unit:23,opts:["inseparable", "pursuit", "ensure", "microbe"]},
    {w:"prevail",m:"\ub9cc\uc5f0\ud558\ub2e4",def:"to be accepted or very common",unit:23,opts:["susceptible", "invalid", "negligible", "prevail"]},
    {w:"negligible",m:"\ud558\ucc2e\uc740, \uc5c6\ub294 \uac70\ub098 \ub2e4\ub984\uc5c6\ub294",def:"it is extremely small and not important",unit:23,opts:["microbe", "magnify", "elusive", "negligible"]},
    {w:"invalid",m:"\uadfc\uac70 \uc5c6\ub294",def:"not correct",unit:23,opts:["pursuit", "magnify", "ensure", "invalid"]},
    {w:"magnify",m:"\ud655\ub300\ud558\ub2e4",def:"to make it look bigger than it really is",unit:23,opts:["prevail", "susceptible", "inseparable", "magnify"]},
    {w:"microbe",m:"\ubbf8\uc0dd\ubb3c",def:"a very small living thing",unit:23,opts:["microbe", "invalid", "savage", "induce"]},
    {w:"susceptible",m:"\uc601\ud5a5\uc744 \ubc1b\uae30 \uc26c\uc6b4",def:"easily harmed by it",unit:23,opts:["susceptible", "microbe", "pursuit", "minor"]},
    {w:"pest",m:"\ud574\ucda9",def:"an animal or insect that hurts plants or food",unit:23,opts:["deterioration", "magnify", "ensure", "pest"]},
    {w:"deterioration",m:"\uc545\ud654",def:"the act of becoming worse",unit:23,opts:["deterioration", "induce", "magnify", "savage"]},
    {w:"induce",m:"\uc720\ub3c4\ud558\ub2e4, \uc720\ubc1c\ud558\ub2e4",def:"to make it happen",unit:23,opts:["savage", "induce", "negligible", "ensure"]},
    {w:"inseparable",m:"\ub5bc\uc5b4\ub193\uc744 \uc218 \uc5c6\ub294",def:"they can\u2019t be separated",unit:23,opts:["prevail", "inseparable", "rupture", "pest"]},
    {w:"pursuit",m:"\ucd94\uad6c",def:"you are chasing it",unit:23,opts:["magnify", "savage", "susceptible", "pursuit"]},
    {w:"savage",m:"\uc57c\ub9cc\uc801\uc778",def:"very violent or cruel",unit:23,opts:["savage", "pursuit", "susceptible", "negligible"]},
  ],
  "eew4_24": [
    {w:"marshal",m:"\ubaa8\uc73c\ub2e4",def:"to assemble them in order",unit:24,opts:["communicate", "senate", "indicate", "marshal"]},
    {w:"authorize",m:"\uc2b9\uc778\ud558\ub2e4",def:"to give permission for it",unit:24,opts:["indicate", "communicate", "disclose", "authorize"]},
    {w:"albeit",m:"\ube44\ub85d ~\uc77c\uc9c0\ub77c\ub3c4",def:"although",unit:24,opts:["albeit", "authorize", "mood", "communicate"]},
    {w:"senate",m:"\uc0c1\uc6d0, \uc758\ud68c",def:"a part of the government in some countries",unit:24,opts:["disclose", "mood", "senate", "civilian"]},
    {w:"communicate",m:"\uc758\uc0ac\uc18c\ud1b5\uc744 \ud558\ub2e4",def:"to talk or write to them",unit:24,opts:["civilian", "mood", "marshal", "communicate"]},
    {w:"disclose",m:"\ubc1d\ud788\ub2e4",def:"to tell it to someone else",unit:24,opts:["albeit", "indicate", "disclose", "communicate"]},
    {w:"civilian",m:"\ubbfc\uac04\uc778",def:"someone who is not in the military",unit:24,opts:["lentil", "mood", "civilian", "senate"]},
    {w:"indicate",m:"\ub098\ud0c0\ub0b4\ub2e4",def:"we show or point out our thoughts or plans",unit:24,opts:["indicate", "disclose", "commodity", "communicate"]},
    {w:"commodity",m:"\uc0c1\ud488, \ubb3c\ud488",def:"something that can be bought or sold",unit:24,opts:["indicate", "commodity", "authorize", "communicate"]},
    {w:"lentil",m:"\ub80c\uc988\ucf69",def:"very small beans that people cook and eat",unit:24,opts:["authorize", "communicate", "lentil", "marshal"]},
    {w:"mood",m:"\uae30\ubd84",def:"the way you are feeling",unit:24,opts:["communicate", "civilian", "albeit", "mood"]},
  ],
  "eew4_25": [
    {w:"pledge",m:"\uc57d\uc18d\ud558\ub2e4",def:"to make a promise to do something",unit:25,opts:["humane", "collaborate", "pledge", "curb"]},
    {w:"humane",m:"\uc778\ub3c4\uc801\uc778",def:"good and kind",unit:25,opts:["needy", "enact", "humane", "compile"]},
    {w:"compile",m:"\uc218\uc9d1\ud558\ub2e4, \ubaa8\uc73c\ub2e4",def:"to collect a variety of them into a group",unit:25,opts:["prohibit", "certify", "humane", "compile"]},
    {w:"transform",m:"\ubcc0\ud615\uc2dc\ud0a4\ub2e4",def:"to change it in a very significant way",unit:25,opts:["diagnose", "widespread", "certify", "transform"]},
    {w:"render",m:"\ub9cc\ub4e4\ub2e4",def:"to make it become something else",unit:25,opts:["render", "curb", "onset", "needy"]},
    {w:"coherent",m:"\uc77c\uad00\uc131 \uc788\ub294",def:"sticking together",unit:25,opts:["render", "pledge", "gross", "coherent"]},
    {w:"needy",m:"\uc5b4\ub824\uc6b4, \uad81\ud54d\ud55c",def:"very poor",unit:25,opts:["curb", "prohibit", "needy", "compile"]},
    {w:"widespread",m:"\uad11\ubc94\uc704\ud55c, \ub110\ub9ac\ud37c\uc9c4",def:"spread widely across the world",unit:25,opts:["prohibit", "render", "transform", "widespread"]},
    {w:"curb",m:"\uc5b5\uc81c\ud558\ub2e4, \ub9c9\ub2e4",def:"to prevent it from happening or increasing",unit:25,opts:["needy", "diagnose", "curb", "enact"]},
    {w:"collaborate",m:"\ud611\ub825\ud558\ub2e4",def:"to work together on something",unit:25,opts:["pledge", "collaborate", "coherent", "needy"]},
    {w:"prohibit",m:"\uae08\uc9c0\ud558\ub2e4",def:"to not allow it",unit:25,opts:["prohibit", "transform", "needy", "widespread"]},
    {w:"vow",m:"\ub9f9\uc138\ud558\ub2e4, \uc11c\uc57d\ud558\ub2e4",def:"to make a promise to do something",unit:25,opts:["vow", "prohibit", "render", "widespread"]},
    {w:"enact",m:"\uc81c\uc815\ud558\ub2e4",def:"to make it into a law",unit:25,opts:["certify", "transform", "enact", "needy"]},
    {w:"gross",m:"\uc5ed\uaca8\uc6b4",def:"disgusting",unit:25,opts:["gross", "diagnose", "curb", "vow"]},
    {w:"onset",m:"\uc2dc\uc791",def:"something unpleasant is the beginning of it",unit:25,opts:["humane", "onset", "pledge", "collaborate"]},
    {w:"certify",m:"\uc99d\uba85\ud558\ub2e4",def:"to confirm that its results are true",unit:25,opts:["vow", "transform", "certify", "widespread"]},
    {w:"diagnose",m:"\uc9c4\ub2e8\ud558\ub2e4",def:"to identify the medical condition they have",unit:25,opts:["widespread", "render", "diagnose", "prohibit"]},
  ],
  "eew4_26": [
    {w:"sterile",m:"\uc0b4\uade0\ud55c, \uc18c\ub3c5\ud55c",def:"completely clean and free from germs",unit:26,opts:["sterile", "voluntary", "practitioner", "overcrowded"]},
    {w:"provision",m:"\uacf5\uae09, \uc81c\uacf5",def:"the act of giving it to people in need or want",unit:26,opts:["provision", "reverse", "compassionate", "replenish"]},
    {w:"reverse",m:"\uac70\uafb8\ub85c\ub41c",def:"to go backwards",unit:26,opts:["reverse", "compassionate", "replenish", "practitioner"]},
    {w:"compassionate",m:"\uc778\uc815 \ub9ce\uc740",def:"feel pity and sympathy for others",unit:26,opts:["contaminate", "replenish", "reverse", "compassionate"]},
    {w:"voluntary",m:"\uc790\ubc1c\uc801\uc778",def:"it is done by choice but is not required",unit:26,opts:["contaminate", "emphasis", "imperative", "voluntary"]},
    {w:"upgrade",m:"\uac1c\uc120\ud558\ub2e4",def:"to improve it or make it more efficient.",unit:26,opts:["upgrade", "practitioner", "reverse", "sterile"]},
    {w:"manifest",m:"\ub098\ud0c0\ub0b4\ub2e4",def:"to make something visible or obvious",unit:26,opts:["provision", "manifest", "replenish", "sterile"]},
    {w:"contaminate",m:"\uc624\uc5fc\uc2dc\ud0a4\ub2e4",def:"to put dirty or harmful chemicals into it",unit:26,opts:["voluntary", "compassionate", "contaminate", "sterile"]},
    {w:"practitioner",m:"\uac1c\uc5c5 \uc758\uc0ac",def:"a doctor",unit:26,opts:["practitioner", "replenish", "reverse", "overcrowded"]},
    {w:"emphasis",m:"\uac15\uc870",def:"you give special attention to prevention",unit:26,opts:["emphasis", "overcrowded", "contaminate", "manifest"]},
    {w:"imperative",m:"\ubc18\ub4dc\uc2dc \ud574\uc57c \ud558\ub294",def:"extremely important and must be done",unit:26,opts:["imperative", "voluntary", "provision", "contaminate"]},
    {w:"replenish",m:"\ubcf4\ucda9\ud558\ub2e4",def:"to make it full or complete again",unit:26,opts:["replenish", "manifest", "emphasis", "practitioner"]},
    {w:"overcrowded",m:"\ub108\ubb34 \ubd90\ube44\ub294",def:"it has too many people or things in it",unit:26,opts:["manifest", "overcrowded", "upgrade", "imperative"]},
  ],
  "eew4_27": [
    {w:"novelty",m:"\uc0c8\ub85c\uc6c0",def:"something that is new, original, or strange",unit:27,opts:["outmoded", "novelty", "utensil", "lunar"]},
    {w:"lunar",m:"\ub2ec\uc758",def:"it is related to the moon",unit:27,opts:["lunar", "outmoded", "definitive", "personalize"]},
    {w:"definitive",m:"\ucd5c\uc885\uc801\uc778, \ud655\uc815\uc801\uc778",def:"the most official",unit:27,opts:["personalize", "novelty", "lunar", "definitive"]},
    {w:"ideology",m:"\uc774\ub370\uc62c\ub85c\uae30, \uc774\ub150",def:"a system of belief",unit:27,opts:["definitive", "novelty", "psychiatry", "ideology"]},
    {w:"inhale",m:"\ud761\uc785\ud558\ub2e4, \uc0bc\ud0a4\ub2e4",def:"to take air or a smell into the lungs",unit:27,opts:["personalize", "found", "inhale", "almighty"]},
    {w:"almighty",m:"\uc804\ub2a5\ud558\uc2e0 \uc2e0",def:"a name for a god in a religion",unit:27,opts:["almighty", "outmoded", "personalize", "lunar"]},
    {w:"personalize",m:"(\uac1c\uc778\uc758 \ud544\uc694\uc5d0) \ub9de\ucd94\ub2e4",def:"to design it to meet a person\u2019s unique needs",unit:27,opts:["personalize", "definitive", "found", "ideology"]},
    {w:"found",m:"~\uc5d0 \uae30\ubc18\uc744 \ub450\ub2e4",def:"to base it on that idea",unit:27,opts:["novelty", "found", "ideology", "psychiatry"]},
    {w:"outmoded",m:"\uad6c\ud615\uc758, \ub354 \uc774\uc0c1 \uc4f8\ubaa8\uc5c6\ub294",def:"then it is no longer in fashion or use",unit:27,opts:["utensil", "outmoded", "personalize", "found"]},
    {w:"utensil",m:"\uae30\uad6c, \ub3c4\uad6c, \uc2dd\uae30",def:"a common tool or container",unit:27,opts:["definitive", "novelty", "almighty", "utensil"]},
    {w:"psychiatry",m:"\uc815\uc2e0 \uc758\ud559",def:"the study and treatment of mental illness",unit:27,opts:["inhale", "psychiatry", "lunar", "definitive"]},
  ],
  "eew4_28": [
    {w:"concentric",m:"\uc911\uc2ec\uc774 \uac19\uc740, \ub3d9\uc2ec\uc6d0\uc758",def:"they have the same center",unit:28,opts:["oversee", "assign", "visual", "concentric"]},
    {w:"courtesy",m:"\uc608\uc758",def:"the excellence of manners or social conduct",unit:28,opts:["omission", "concentric", "courtesy", "wavy"]},
    {w:"appetizing",m:"\uc2dd\uc695\uc744 \ub3cb\uc6b0\ub294",def:"looks and smells very good",unit:28,opts:["item", "courtesy", "appetizing", "oversee"]},
    {w:"cavity",m:"\uad6c\uba4d, \ube48 \uacf5\uac04",def:"a hole or space in something",unit:28,opts:["omission", "generate", "cavity", "oversee"]},
    {w:"assign",m:"\ubd80\uc5ec\ud558\ub2e4",def:"you give that work to particular people",unit:28,opts:["assign", "multicultural", "wavy", "pierce"]},
    {w:"oversee",m:"\uac10\ub3c5\ud558\ub2e4, \uac10\uc2dc\ud558\ub2e4",def:"to make sure that it is being done properly",unit:28,opts:["courtesy", "multicultural", "oversee", "concentric"]},
    {w:"omission",m:"\ub204\ub77d, \uc0dd\ub7b5",def:"something that has been left out or not done",unit:28,opts:["pierce", "visual", "cavity", "omission"]},
    {w:"item",m:"\ud56d\ubaa9, \ubb3c\ud488",def:"a single separate piece",unit:28,opts:["cavity", "item", "assign", "oversee"]},
    {w:"pierce",m:"\ub6ab\ub2e4",def:"to make a hole in it using a sharp object",unit:28,opts:["discord", "oversee", "multicultural", "pierce"]},
    {w:"discord",m:"\ubd88\ud654, \ub2e4\ud23c",def:"disagreement or fighting",unit:28,opts:["omission", "discord", "multicultural", "generate"]},
    {w:"generate",m:"\ubc1c\uc0dd\uc2dc\ud0a4\ub2e4",def:"to cause it to develop or begin",unit:28,opts:["generate", "pierce", "wavy", "concentric"]},
    {w:"select",m:"\uc120\ud0dd\ud558\ub2e4",def:"to carefully choose it",unit:28,opts:["select", "courtesy", "multicultural", "omission"]},
    {w:"multicultural",m:"\ub2e4\ubb38\ud654\uc758",def:"many different cultures",unit:28,opts:["appetizing", "multicultural", "courtesy", "select"]},
    {w:"visual",m:"\uc2dc\uac01\uc758",def:"relates to seeing",unit:28,opts:["cavity", "oversee", "concentric", "visual"]},
    {w:"wavy",m:"\ubb3c\uacb0 \ubaa8\uc591\uc758",def:"not straight",unit:28,opts:["multicultural", "omission", "courtesy", "wavy"]},
  ],
  "eew4_29": [
    {w:"synthesis",m:"\uc885\ud569, \ud1b5\ud569",def:"a combination of different ideas or styles",unit:29,opts:["synthesis", "export", "scrap", "habitual"]},
    {w:"notwithstanding",m:"~\uc5d0\ub3c4 \ubd88\uad6c\ud558\uace0",def:"in spite of",unit:29,opts:["fume", "export", "notwithstanding", "subscribe"]},
    {w:"scrap",m:"\uc870\uac01",def:"a small amount of it",unit:29,opts:["fume", "synthesis", "scrap", "penalize"]},
    {w:"penalize",m:"\ucc98\ubc8c\ud558\ub2e4",def:"to punish him or her",unit:29,opts:["synthesis", "penalize", "justify", "scrap"]},
    {w:"subscribe",m:"\uac00\uc785\ud558\ub2e4",def:"to agree with it",unit:29,opts:["scrap", "penalize", "subscribe", "export"]},
    {w:"justify",m:"\uc815\ub2f9\ud654\ud558\ub2e4",def:"to show or prove that it is necessary",unit:29,opts:["subscribe", "notwithstanding", "penalize", "justify"]},
    {w:"fume",m:"\uc5f0\uae30",def:"unhealthy smoke and gases",unit:29,opts:["fume", "habitual", "penalize", "notwithstanding"]},
    {w:"export",m:"\uc218\ucd9c\ud558\ub2e4",def:"to sell them to other countries",unit:29,opts:["justify", "notwithstanding", "scrap", "export"]},
    {w:"habitual",m:"\uc2b5\uad00\uc801\uc778, \uc2b5\uad00\uc758, \uc2b5\uad00\uc5d0 \uc758\ud55c",def:"it is a behavior that a person usually does",unit:29,opts:["export", "scrap", "habitual", "subscribe"]},
  ],
  "eew4_30": [
    {w:"scorn",m:"\uc5c5\uc2e0\uc5ec\uae30\ub2e4",def:"to behave without respect toward them",unit:30,opts:["scorn", "inventive", "metropolitan", "resourceful"]},
    {w:"mandarin",m:"\ud45c\uc900 \uc911\uad6d\uc5b4",def:"one of the two main Chinese languages",unit:30,opts:["metropolitan", "sensory", "mandarin", "technical"]},
    {w:"harmonize",m:"\uc5b4\uc6b8\ub9ac\ub2e4",def:"to make different things go well together",unit:30,opts:["industrious", "fluid", "harmonize", "misguided"]},
    {w:"industrious",m:"\uadfc\uba74\ud55c, \ubd80\uc9c0\ub7f0\ud55c",def:"they work hard",unit:30,opts:["industrious", "mandarin", "scorn", "harmonize"]},
    {w:"inventive",m:"\ucc3d\uc758\uc801\uc778",def:"they are good at creating new things",unit:30,opts:["sensory", "industrious", "inventive", "misguided"]},
    {w:"sensory",m:"\uac10\uac01\uc758",def:"it is related to the senses",unit:30,opts:["industrious", "metropolitan", "harmonize", "sensory"]},
    {w:"resourceful",m:"\uc7ac\uce58 \uc788\ub294, \uae30\ub7b5 \uc788\ub294",def:"having inner resources",unit:30,opts:["mandarin", "resourceful", "metropolitan", "inventive"]},
    {w:"metropolitan",m:"\ub300\ub3c4\uc2dc\uc758",def:"it relates to a large city",unit:30,opts:["metropolitan", "harmonize", "technical", "communal"]},
    {w:"technical",m:"\uacfc\ud559 \uae30\uc220\uc758, \uae30\uc220\uc801\uc778",def:"skill requires good control of technique",unit:30,opts:["technical", "scorn", "harmonize", "fluid"]},
    {w:"misguided",m:"\uc798\ubabb \uc774\ud574\ud55c",def:"it is based on bad judgment or wrong beliefs",unit:30,opts:["fluid", "communal", "misguided", "mandarin"]},
    {w:"fluid",m:"\ubd80\ub4dc\ub7ec\uc6b4",def:"it is smooth and moves gracefully",unit:30,opts:["scorn", "fluid", "mandarin", "technical"]},
    {w:"communal",m:"\uacf5\ub3d9\uc758",def:"a group of people",unit:30,opts:["communal", "resourceful", "technical", "sensory"]},
  ],
  "eew5_1": [
    {w:"beverage",m:"\uc74c\ub8cc, \ub9c8\uc2e4 \uac83",def:"a drink",unit:1,opts:["divine", "toxic", "cluster", "beverage"]},
    {w:"condensed",m:"\uc555\ucd95\ub41c, \uc751\ucd95\ub41c",def:"made thicker",unit:1,opts:["soothing", "condensed", "subtle", "aroma"]},
    {w:"aroma",m:"\ud5a5\uae30",def:"a scent or smell",unit:1,opts:["cluster", "rapid", "rate", "aroma"]},
    {w:"odor",m:"\uc545\ucde8, \ub0c4\uc0c8",def:"a very distinct smell",unit:1,opts:["contemporary", "cultivate", "palate", "odor"]},
    {w:"cultivate",m:"\uc7ac\ubc30\ud558\ub2e4, \uacbd\uc791\ud558\ub2e4",def:"to care for plants and help them grow",unit:1,opts:["cultivate", "palate", "condensed", "rapid"]},
    {w:"soothing",m:"\uc9c4\uc815\uc2dc\ud0a4\ub294, \ub2ec\ub798\ub294",def:"making you calm or relaxed",unit:1,opts:["beverage", "soothing", "rapid", "cluster"]},
    {w:"subtle",m:"\ubbf8\ubb18\ud55c, \uac10\uc9c0\ud558\uae30 \ud798\ub4e0, \uc12c\uc138\ud55c",def:"not easy to see or notice",unit:1,opts:["soothing", "contemporary", "subtle", "cultivate"]},
    {w:"texture",m:"\uc9c8\uac10",def:"the way its surface looks and feels",unit:1,opts:["odor", "beverage", "cultivate", "texture"]},
    {w:"toxic",m:"\uc720\ub3c5\ud55c, \uc720\ub3c5\uc131\uc758",def:"poisonous and very dangerous",unit:1,opts:["aroma", "rapid", "cluster", "toxic"]},
    {w:"cluster",m:"\ubb34\ub9ac, \uc1a1\uc774",def:"a small group of them placed close together",unit:1,opts:["texture", "humid", "cluster", "subtle"]},
    {w:"palate",m:"\uc785\ucc9c\uc7a5",def:"the top part of the mouth",unit:1,opts:["soothing", "palate", "cluster", "cultivate"]},
    {w:"rate",m:"\uc18d\ub3c4",def:"the speed at which something happens",unit:1,opts:["cluster", "soothing", "rate", "odor"]},
    {w:"rapid",m:"\uae09\uc18d\ud55c, \ube60\ub978",def:"moving or changing very quickly",unit:1,opts:["soothing", "rapid", "condensed", "rate"]},
    {w:"contemporary",m:"\ud604\ub300\uc758, \ub3d9\uc2dc\ub300\uc758",def:"related to the present time",unit:1,opts:["toxic", "beverage", "contemporary", "palate"]},
    {w:"humid",m:"\uc2b5\ud55c",def:"there is a lot of water in the air",unit:1,opts:["condensed", "rapid", "humid", "aroma"]},
    {w:"divine",m:"\uc2e0\uc758, \uc2e0\uc131\ud55c",def:"related to gods",unit:1,opts:["divine", "toxic", "humid", "condensed"]},
  ],
  "eew5_2": [
    {w:"loop",m:"\uace0\ub9ac",def:"a line made into the shape of a circle",unit:2,opts:["conscience", "admiral", "loop", "flesh"]},
    {w:"string",m:"\uc904, \ub048",def:"a thin piece of fabric or rope",unit:2,opts:["admiral", "string", "character", "thorn"]},
    {w:"admiral",m:"\ud574\uad70 \uc7a5\uc131, \uc81c\ub3c5",def:"someone who controls many military ships",unit:2,opts:["kerosene", "escape", "arc", "admiral"]},
    {w:"fiery",m:"\ubd88 \uac19\uc740, \uaca9\ud55c",def:"burning strongly",unit:2,opts:["string", "fiery", "kerosene", "loop"]},
    {w:"conscience",m:"\uc591\uc2ec, \uc758\uc2dd",def:"inner sense of what is right and wrong",unit:2,opts:["escape", "sour", "kerosene", "conscience"]},
    {w:"sour",m:"\uc2e0, \uc2dc\ud07c\ud55c",def:"having a sharp and unpleasant taste",unit:2,opts:["sour", "string", "thorn", "escape"]},
    {w:"thorn",m:"\uac00\uc2dc",def:"a sharp part of a plant",unit:2,opts:["loop", "escape", "thorn", "admiral"]},
    {w:"arc",m:"\ud638, \uc6d0\ud638, \uc544\uce58",def:"a curved shape",unit:2,opts:["escape", "sour", "arc", "flesh"]},
    {w:"kerosene",m:"\ub4f1\uc720",def:"a type of oil used in some lamps and stoves",unit:2,opts:["fiery", "kerosene", "sour", "admiral"]},
    {w:"escape",m:"\ud0c8\ucd9c\ud558\ub2e4, \ubc97\uc5b4\ub098\ub2e4",def:"to succeed in getting away from something",unit:2,opts:["escape", "loop", "string", "fiery"]},
    {w:"flesh",m:"\uc0b4",def:"the muscle and fat on your body",unit:2,opts:["flesh", "thorn", "admiral", "conscience"]},
    {w:"horrified",m:"\uacf5\ud3ec\uc5d0 \ud729\uc2f8\uc778, \ucda9\uaca9\uc744 \ubc1b\uc740",def:"very shocked and feel upset",unit:2,opts:["flesh", "loop", "horrified", "sour"]},
    {w:"character",m:"\uc131\uaca9",def:"personality",unit:2,opts:["kerosene", "character", "string", "thorn"]},
    {w:"wreck",m:"\ub9dd\uac00\ub728\ub9ac\ub2e4",def:"to destroy or ruin it",unit:2,opts:["flesh", "wreck", "fiery", "horrified"]},
  ],
  "eew5_3": [
    {w:"pinpoint",m:"\uc815\ud655\ud788 \ucc3e\uc544\ub0b4\ub2e4",def:"to locate it exactly",unit:3,opts:["torment", "pinpoint", "switch", "conscious"]},
    {w:"eventual",m:"\ucd5c\ud6c4\uc758, \uad81\uadf9\uc801\uc778",def:"it will happen at the end of a series of events",unit:3,opts:["awesome", "conscious", "eventual", "immense"]},
    {w:"indirect",m:"\uac04\uc811\uc801\uc778",def:"it is not the easiest or straightest way",unit:3,opts:["thorough", "indirect", "torment", "option"]},
    {w:"disagree",m:"\ub3d9\uc758\ud558\uc9c0 \uc54a\ub2e4",def:"to have a different opinion from someone",unit:3,opts:["torment", "switch", "perfect", "disagree"]},
    {w:"torment",m:"\uad34\ub86d\ud788\ub2e4",def:"to cause them to suffer on purpose",unit:3,opts:["immense", "eventual", "perfect", "torment"]},
    {w:"perfect",m:"\uc644\ubcbd\ud55c, \uc644\uc804\ud55c",def:"without any mistakes",unit:3,opts:["indirect", "perfect", "pastime", "immense"]},
    {w:"conscious",m:"\uc758\uc2dd\ud558\ub294",def:"aware of it",unit:3,opts:["awesome", "disagree", "conscious", "option"]},
    {w:"switch",m:"\uc804\ud658\ud558\ub2e4",def:"to change it to something else",unit:3,opts:["perfect", "option", "switch", "disagree"]},
    {w:"thorough",m:"\ucca0\uc800\ud55c, \ube48\ud2c8\uc5c6\ub294",def:"complete or done carefully",unit:3,opts:["thorough", "disagree", "audible", "option"]},
    {w:"audible",m:"\ub4e4\ub9ac\ub294, \ub4e4\uc744 \uc218 \uc788\ub294",def:"able to be heard",unit:3,opts:["immense", "audible", "thorough", "torment"]},
    {w:"awesome",m:"\uba4b\uc9c4, \uad49\uc7a5\ud55c, \ub300\ub2e8\ud55c",def:"impressive or frightening",unit:3,opts:["conscious", "torment", "awesome", "pastime"]},
    {w:"immense",m:"\uad49\uc7a5\ud55c, \ub9c9\ub300\ud55c",def:"very large",unit:3,opts:["thorough", "indirect", "immense", "awesome"]},
    {w:"pastime",m:"\uc624\ub77d, \ucde8\ubbf8, \uc5ec\uac00",def:"an activity that you do often for fun",unit:3,opts:["pastime", "disagree", "thorough", "switch"]},
    {w:"option",m:"\uc120\ud0dd",def:"a choice between two or more things",unit:3,opts:["conscious", "option", "awesome", "perfect"]},
  ],
  "eew5_4": [
    {w:"abrupt",m:"\uac11\uc791\uc2a4\ub7ec\uc6b4, \ud241\uba85\uc2a4\ub7ec\uc6b4",def:"sudden or unexpected",unit:4,opts:["abrupt", "agony", "beard", "inflame"]},
    {w:"dome",m:"\ub465\uadfc(\ubc18\uad6c\ud615) \uc9c0\ubd95",def:"a curved roof of a building",unit:4,opts:["dome", "inflame", "abrupt", "harass"]},
    {w:"inflame",m:"\uc790\uadf9\ud558\ub2e4, \ubd88\ubd99\uc774\ub2e4",def:"to provoke or intensify something",unit:4,opts:["illuminate", "inflame", "assassin", "harass"]},
    {w:"assassin",m:"\uc554\uc0b4\uc790, \uc790\uac1d",def:"someone who murders an important person",unit:4,opts:["inflame", "abrupt", "beard", "assassin"]},
    {w:"agony",m:"\uace0\ud1b5, \uace0\ub1cc",def:"severe pain or suffering",unit:4,opts:["abrupt", "assassin", "harass", "agony"]},
    {w:"harass",m:"\uad34\ub86d\ud788\ub2e4",def:"to bother or attack them repeatedly",unit:4,opts:["inflame", "harass", "agony", "illuminate"]},
    {w:"beard",m:"\ud131\uc218\uc5fc",def:"hair that grows on a man\u2019s chin and cheeks",unit:4,opts:["inflame", "harass", "beard", "illuminate"]},
    {w:"illuminate",m:"\ubc1d\ud788\ub2e4, \ubd80\uac01\ud558\ub2e4",def:"to shine light on or brighten something",unit:4,opts:["agony", "harass", "illuminate", "beast"]},
    {w:"beast",m:"\uc9d0\uc2b9, \uc57c\uc218",def:"a large and dangerous animal",unit:4,opts:["beard", "beast", "inflame", "abrupt"]},
  ],
  "eew5_5": [
    {w:"essay",m:"\uc18c\ub860, \uc218\ud544",def:"a short piece of writing on a certain subject",unit:5,opts:["private", "typewritten", "essay", "weird"]},
    {w:"faint",m:"\uc878\ub3c4\ud558\ub2e4, \uae30\uc808\ud558\ub2e4",def:"to go unconscious and fall down",unit:5,opts:["typewritten", "operate", "faint", "essay"]},
    {w:"awhile",m:"\uc7a0\uae50, \uc7a0\uc2dc",def:"for a short time",unit:5,opts:["global", "faint", "operate", "awhile"]},
    {w:"global",m:"\uc138\uacc4\uc801\uc778, \uc9c0\uad6c\uc758",def:"happening all around the world",unit:5,opts:["awhile", "faint", "essay", "global"]},
    {w:"resolution",m:"\uacb0\uc2ec, \uacb0\uc815",def:"a personal decision",unit:5,opts:["essay", "resolution", "weird", "global"]},
    {w:"operate",m:"\uc6b4\uc601\ud558\ub2e4, \uc601\uc5c5\ud558\ub2e4",def:"to work or function",unit:5,opts:["ignorant", "recent", "resolution", "operate"]},
    {w:"lecture",m:"\uac15\uc758, \uac15\uc5f0, \uc5f0\uc124",def:"a long, educational speech",unit:5,opts:["operate", "faint", "lecture", "awhile"]},
    {w:"private",m:"\ubbfc\uac04\uc758, \uc0ac\ub9bd\uc758",def:"only used by one person or group",unit:5,opts:["private", "weird", "awhile", "essay"]},
    {w:"weird",m:"\uc774\uc0c1\ud55c, \uae30\ubb18\ud55c, \uc218\uc0c1\ud55c",def:"very strange",unit:5,opts:["essay", "typewritten", "weird", "global"]},
    {w:"recent",m:"\ucd5c\uadfc\uc758",def:"happened a short time ago",unit:5,opts:["lecture", "recent", "weird", "awhile"]},
    {w:"ignorant",m:"\ubb34\uc9c0\ud55c, \ubb34\uc2dd\ud55c",def:"having no knowledge about something",unit:5,opts:["private", "typewritten", "ignorant", "lecture"]},
    {w:"typewritten",m:"\ud0c0\uc790\ub85c \uce5c",def:"it is written on a computer or typewriter",unit:5,opts:["lecture", "typewritten", "operate", "ignorant"]},
  ],
  "eew5_6": [
    {w:"jungle",m:"\ubc00\ub9bc",def:"a type of forest in a warm, rainy tropical area",unit:6,opts:["accustom", "exclusion", "jungle", "congregate"]},
    {w:"congregate",m:"\ubaa8\uc73c\ub2e4",def:"to gather in one place",unit:6,opts:["graze", "cling", "jungle", "congregate"]},
    {w:"embody",m:"\uad6c\ud604\ud558\ub2e4, \uc0c1\uc9d5\ud558\ub2e4",def:"to symbolize or represent something",unit:6,opts:["clash", "comprehend", "flock", "embody"]},
    {w:"empirical",m:"\uc2e4\uc99d\uc801\uc778, \uacbd\ud5d8\uc801\uc778",def:"involving scientific proof and evidence",unit:6,opts:["flock", "empirical", "cling", "exclusion"]},
    {w:"intelligent",m:"\uc9c0\uc801\uc778, \ub611\ub611\ud55c",def:"very smart",unit:6,opts:["arouse", "comprehend", "intelligent", "congregate"]},
    {w:"disperse",m:"\ud769\ub2e4, \ud37c\ub728\ub9ac\ub2e4, \ud574\uc0b0\uc2dc\ud0a4\ub2e4",def:"to scatter everywhere",unit:6,opts:["cling", "flock", "graze", "disperse"]},
    {w:"buzz",m:"\ub5a0\ub4e4\uc369\ud558\ub2e4",def:"to show excitement about something",unit:6,opts:["buzz", "intelligent", "clash", "disperse"]},
    {w:"comprehend",m:"\uc774\ud574\ud558\ub2e4",def:"to understand something",unit:6,opts:["comprehend", "graze", "clash", "jungle"]},
    {w:"exclusion",m:"\ubc30\uc81c, \uc81c\uc678",def:"the act of keeping someone out of a group",unit:6,opts:["embody", "empirical", "comprehend", "exclusion"]},
    {w:"graze",m:"\ud480\uc744 \ub72f\ub2e4",def:"to feed on plants",unit:6,opts:["graze", "buzz", "clash", "flock"]},
    {w:"clash",m:"\ucda9\ub3cc\ud558\ub2e4, \ub300\ub9bd\ud558\ub2e4",def:"to fight or argue over something",unit:6,opts:["clash", "arouse", "jungle", "buzz"]},
    {w:"flock",m:"\ubaa8\uc774\ub2e4",def:"to gather in one place",unit:6,opts:["accustom", "disperse", "comprehend", "flock"]},
    {w:"accustom",m:"\uc775\uc219\ud574\uc9c0\ub2e4, \uc801\uc751\ud558\ub2e4",def:"to get used to something",unit:6,opts:["comprehend", "accustom", "embody", "exclusion"]},
    {w:"cling",m:"\ub9e4\ub2ec\ub9ac\ub2e4, \uc9d1\ucc29\ud558\ub2e4, \uace0\uc218\ud558\ub2e4",def:"to hold onto it tightly",unit:6,opts:["embody", "exclusion", "cling", "empirical"]},
    {w:"arouse",m:"(\uad00\uc2ec\uc744) \uc720\ubc1c\ud558\ub2e4",def:"to awaken interest or attention in someone",unit:6,opts:["congregate", "flock", "clash", "arouse"]},
  ],
  "eew5_7": [
    {w:"conceal",m:"\uac10\ucd94\ub2e4, \uc228\uae30\ub2e4",def:"to hide something",unit:7,opts:["architect", "proclaim", "gratitude", "conceal"]},
    {w:"resolve",m:"\ud574\uacb0\ud558\ub2e4",def:"to find a solution",unit:7,opts:["legal", "architect", "volunteer", "resolve"]},
    {w:"crime",m:"\ubc94\uc8c4",def:"something bad that can be punished by law",unit:7,opts:["architect", "account", "resolve", "crime"]},
    {w:"gratitude",m:"\uac10\uc0ac, \uc0ac\uc758",def:"a feeling of being thankful",unit:7,opts:["gratitude", "witness", "architect", "volunteer"]},
    {w:"witness",m:"\ubaa9\uaca9\uc790",def:"someone who sees or hears a crime",unit:7,opts:["volunteer", "gratitude", "witness", "oblige"]},
    {w:"proclaim",m:"\uc120\ud3ec\ud558\ub2e4, \uc120\uc5b8\ud558\ub2e4",def:"to say something in public",unit:7,opts:["conceal", "resolve", "proclaim", "witness"]},
    {w:"account",m:"\uacc4\uc88c",def:"an arrangement to keep one\u2019s money there",unit:7,opts:["architect", "gratitude", "proclaim", "account"]},
    {w:"architect",m:"\uac74\ucd95\uac00",def:"a person who designs buildings",unit:7,opts:["architect", "account", "habitat", "memorable"]},
    {w:"oblige",m:"\uac15\uc694\ud558\ub2e4, \uc758\ubb34\uc801\uc73c\ub85c \ud558\ub2e4",def:"to require someone to do something",unit:7,opts:["oblige", "memorable", "account", "proclaim"]},
    {w:"habitat",m:"\uc11c\uc2dd\uc9c0, \uc6d0\uc0b0\uc9c0",def:"the natural home of animals or plants",unit:7,opts:["gratitude", "conceal", "habitat", "witness"]},
    {w:"legal",m:"\ubc95\uc801\uc778, \uc801\ubc95\ud55c",def:"related to the law or allowed by the law",unit:7,opts:["account", "volunteer", "proclaim", "legal"]},
    {w:"memorable",m:"\uc778\uc0c1\uc801\uc778",def:"remembered for a special reason",unit:7,opts:["memorable", "conceal", "legal", "witness"]},
    {w:"volunteer",m:"\ubd09\uc0ac\ud558\ub2e4, \uc790\uc6d0\ud558\ub2e4",def:"to offer to do something for free",unit:7,opts:["habitat", "witness", "oblige", "volunteer"]},
  ],
  "eew5_8": [
    {w:"tend",m:"~\ud558\ub294 \uacbd\ud5a5\uc774 \uc788\ub2e4",def:"to be likely to do something or to do it often",unit:8,opts:["grip", "constant", "tend", "valid"]},
    {w:"impending",m:"\uc784\ubc15\ud55c",def:"it is going to happen soon",unit:8,opts:["grip", "impending", "sly", "tend"]},
    {w:"halt",m:"\uc911\ub2e8\ud558\ub2e4, \uba48\ucd94\ub2e4",def:"to stop moving",unit:8,opts:["influence", "replace", "sly", "halt"]},
    {w:"influence",m:"\uc601\ud5a5\uc744 \ub07c\uce58\ub2e4, \uc88c\uc6b0\ud558\ub2e4",def:"to have an effect on someone or something",unit:8,opts:["tend", "conduct", "valid", "influence"]},
    {w:"valid",m:"\ud0c0\ub2f9\ud55c, \uc720\ud6a8\ud55c",def:"correct or based on good reasoning",unit:8,opts:["enclose", "valid", "tend", "sly"]},
    {w:"sly",m:"\uad50\ud65c\ud55c, \uc74c\ud749\ud55c",def:"sneaky or good at tricking people",unit:8,opts:["influence", "conduct", "sly", "halt"]},
    {w:"replace",m:"\ub300\uccb4\ud558\ub2e4",def:"to put it in the place of something else",unit:8,opts:["influence", "access", "replace", "impending"]},
    {w:"access",m:"\uc811\uadfc, \uc774\uc6a9",def:"the right to enter or use something",unit:8,opts:["device", "access", "impending", "law"]},
    {w:"perspire",m:"\ub540\uc744 \ud758\ub9ac\ub2e4",def:"to sweat",unit:8,opts:["impending", "perspire", "grip", "whatsoever"]},
    {w:"device",m:"\uc7a5\uce58, \uae30\uae30",def:"an object or a machine",unit:8,opts:["constant", "device", "law", "tend"]},
    {w:"grip",m:"\ub2e8\ub2e8\ud788 \ubd99\ub4e4\ub2e4",def:"to hold something very tightly",unit:8,opts:["sly", "valid", "grip", "tend"]},
    {w:"conduct",m:"\ud589\uc704, \ucc98\uc2e0, \uc9c0\ub3c4",def:"the way that someone acts",unit:8,opts:["whatsoever", "perspire", "conduct", "tend"]},
    {w:"mode",m:"\ubaa8\ub4dc, \ud615\ud0dc, \uc0c1\ud0dc",def:"a setting or condition on a machine",unit:8,opts:["access", "whatsoever", "influence", "mode"]},
    {w:"whatsoever",m:"\uc870\uae08\uc758 ~\ub3c4",def:"there is nothing of that thing",unit:8,opts:["mode", "halt", "whatsoever", "device"]},
    {w:"constant",m:"\uc77c\uc815\ud55c, \ub04a\uc784\uc5c6\ub294, \ubd80\ub2e8\ud55c",def:"it happens a lot or all of the time",unit:8,opts:["influence", "mode", "constant", "whatsoever"]},
    {w:"law",m:"\ubc95, \ubc95\ub960",def:"a rule made by the legislative body",unit:8,opts:["perspire", "whatsoever", "law", "tend"]},
    {w:"enclose",m:"\uc5d0\uc6cc\uc2f8\ub2e4, \ub3d9\ubd09\ud558\ub2e4",def:"to contain something",unit:8,opts:["sly", "impending", "enclose", "device"]},
  ],
  "eew5_9": [
    {w:"nor",m:"~\ub3c4 ~\uac00 \uc544\ub2c8\ub2e4",def:"connecting two negative ideas",unit:9,opts:["efficient", "nor", "appetite", "smash"]},
    {w:"lively",m:"\ud65c\uae30\ucc2c, \uc0dd\uae30\uc788\ub294",def:"having a lot of energy",unit:9,opts:["lively", "assist", "pessimistic", "slap"]},
    {w:"successful",m:"\uc131\uacf5\ud55c, \uc131\uacf5\uc801\uc778",def:"intended to achieve",unit:9,opts:["breeze", "successful", "outraged", "whereas"]},
    {w:"whereas",m:"\ubc18\uba74\uc5d0, ~\uc778\ub370\ub3c4",def:"showing how two things are different",unit:9,opts:["whereas", "breeze", "smash", "slap"]},
    {w:"smash",m:"\uae68\ub2e4, \ubd80\uc11c\ub728\ub9ac\ub2e4",def:"to break something into many small pieces",unit:9,opts:["majestic", "lively", "breeze", "smash"]},
    {w:"alongside",m:"\uc606\uc5d0, \ub098\ub780\ud788",def:"next to something",unit:9,opts:["whereas", "alongside", "forgive", "assist"]},
    {w:"appetite",m:"\uc2dd\uc695",def:"hunger for food",unit:9,opts:["efficient", "appetite", "smash", "successful"]},
    {w:"outraged",m:"\uaca9\ubd84\ud55c",def:"very angry",unit:9,opts:["assist", "smash", "outraged", "forgive"]},
    {w:"wage",m:"\uc784\uae08, \uae09\uc5ec, \uc18c\ub4dd",def:"the money that a person gets for doing a job",unit:9,opts:["whereas", "wage", "feeble", "nor"]},
    {w:"efficient",m:"\ud6a8\uc728\uc801\uc778",def:"not wasting energy",unit:9,opts:["alongside", "outraged", "feeble", "efficient"]},
    {w:"breeze",m:"\uc21c\ud48d",def:"a soft wind",unit:9,opts:["majestic", "breeze", "pessimistic", "whereas"]},
    {w:"feeble",m:"\uc57d\ud55c, \ubd80\uc9c4\ud55c",def:"small or weak",unit:9,opts:["efficient", "assist", "successful", "feeble"]},
    {w:"pessimistic",m:"\ube44\uad00\uc801\uc778, \ud68c\uc758\uc801\uc778",def:"believing that the worst will happen",unit:9,opts:["efficient", "pessimistic", "nor", "slap"]},
    {w:"forgive",m:"\uc6a9\uc11c\ud558\ub2e4",def:"to stop being angry with someone",unit:9,opts:["feeble", "forgive", "wage", "successful"]},
    {w:"assist",m:"\ub3d5\ub2e4, \uc9c0\uc6d0\ud558\ub2e4",def:"to help something",unit:9,opts:["slap", "forgive", "assist", "outraged"]},
    {w:"majestic",m:"\uc7a5\uc5c4\ud55c, \uc704\uc5c4 \uc788\ub294",def:"large and impressive",unit:9,opts:["outraged", "slap", "alongside", "majestic"]},
    {w:"slap",m:"\ucc30\uc2f9 \ub54c\ub9ac\ub2e4",def:"to hit someone with the palm of the hand",unit:9,opts:["smash", "alongside", "slap", "successful"]},
  ],
  "eew5_10": [
    {w:"handy",m:"\ud3b8\ub9ac\ud55c, \ub3c4\uc6c0\uc774 \ub418\ub294",def:"useful",unit:10,opts:["worthwhile", "plea", "handy", "classify"]},
    {w:"plea",m:"\ud0c4\uc6d0, \ud638\uc18c, \uc560\uc6d0",def:"a request that is urgent or emotional",unit:10,opts:["decade", "animate", "numerous", "plea"]},
    {w:"decade",m:"10\ub144",def:"a period of ten years",unit:10,opts:["numerous", "construct", "decade", "animate"]},
    {w:"refrain",m:"\uc790\uc81c\ud558\ub2e4, \uc0bc\uac00\ub2e4",def:"to avoid doing something",unit:10,opts:["concept", "handy", "refrain", "construct"]},
    {w:"sophisticated",m:"\uc138\ub828\ub41c, \uc218\uc900 \ub192\uc740",def:"knowing many things about the world",unit:10,opts:["decade", "classify", "upright", "sophisticated"]},
    {w:"surrender",m:"\ud56d\ubcf5\ud558\ub2e4, \ud3ec\uae30\ud558\ub2e4",def:"to give up something",unit:10,opts:["surrender", "decade", "worthwhile", "refrain"]},
    {w:"construct",m:"\ud615\uc131\ud558\ub2e4, \ub9cc\ub4e4\ub2e4",def:"to make or build something",unit:10,opts:["animate", "upright", "handy", "construct"]},
    {w:"particle",m:"\uc785\uc790, \uc791\uc740 \uc870\uac01",def:"a very small piece of something",unit:10,opts:["construct", "worthwhile", "particle", "surrender"]},
    {w:"longing",m:"\uc5f4\ub9dd, \ub3d9\uacbd, \uac08\ub9dd",def:"a strong feeling of wanting",unit:10,opts:["longing", "sophisticated", "particle", "concept"]},
    {w:"animate",m:"\uc6c0\uc9c1\uc774\ub294, \uc0b4\uc544\uc788\ub294",def:"having life",unit:10,opts:["animate", "longing", "surrender", "decade"]},
    {w:"worthwhile",m:"\uac00\uce58\uc788\ub294, ~\ud560 \ub9cc\ud55c",def:"important or useful",unit:10,opts:["concept", "sophisticated", "worthwhile", "longing"]},
    {w:"classify",m:"\ubd84\ub958\ud558\ub2e4",def:"to put things into groups based on their type",unit:10,opts:["particle", "classify", "worthwhile", "refrain"]},
    {w:"concept",m:"\uac1c\ub150, \uc0dd\uac01",def:"an idea about something",unit:10,opts:["construct", "concept", "animate", "upright"]},
    {w:"upright",m:"\ub611\ubc14\ub978, \uc9c1\ub9bd\ud55c",def:"standing up straight",unit:10,opts:["upright", "longing", "particle", "plea"]},
    {w:"numerous",m:"\ub9ce\uc740",def:"there are many of those things",unit:10,opts:["longing", "upright", "handy", "numerous"]},
  ],
  "eew5_11": [
    {w:"ceremony",m:"\uc758\uc2dd, \uc758\ub840",def:"an event that happens on special occasions",unit:11,opts:["diverse", "armed", "ceremony", "impact"]},
    {w:"alliance",m:"\ub3d9\ub9f9, \ud611\ub825, \uc5f0\ud569",def:"a group of people who work together",unit:11,opts:["vain", "authoritative", "diverse", "alliance"]},
    {w:"impact",m:"\uc601\ud5a5",def:"the effect someone or something has",unit:11,opts:["alliance", "impact", "bravery", "detail"]},
    {w:"authoritative",m:"\ubbff\uc744 \ub9cc\ud55c",def:"using the best information available",unit:11,opts:["diverse", "ceremony", "authoritative", "supply"]},
    {w:"detail",m:"\uc138\ubd80, \uc0c1\uc138, \uad6c\uccb4\uc801 \ub0b4\uc6a9",def:"a small piece of information",unit:11,opts:["authoritative", "alliance", "ceremony", "detail"]},
    {w:"armed",m:"\ubb34\uc7a5\ud55c",def:"carrying a weapon",unit:11,opts:["vain", "diverse", "detail", "armed"]},
    {w:"bravery",m:"\uc6a9\uae30, \uc6a9\ub9f9",def:"brave behavior",unit:11,opts:["supply", "bravery", "armed", "ceremony"]},
    {w:"vain",m:"\uc790\ub9cc\uc2ec\uc774 \uac15\ud55c",def:"being only concerned with how they look",unit:11,opts:["ceremony", "vain", "supply", "detail"]},
    {w:"diverse",m:"\ub2e4\uc591\ud55c",def:"made up of a wide variety of things",unit:11,opts:["alliance", "armed", "diverse", "ceremony"]},
    {w:"supply",m:"\uacf5\uae09\ud558\ub2e4",def:"to give people what they need or want",unit:11,opts:["supply", "detail", "vain", "authoritative"]},
  ],
  "eew5_12": [
    {w:"rescue",m:"\uad6c\uc870\ud558\ub2e4, \uad6c\uc81c\ud558\ub2e4",def:"to remove someone from danger",unit:12,opts:["lean", "enthusiasm", "bid", "rescue"]},
    {w:"belly",m:"\ubc30, \ubcf5\ubd80",def:"the stomach of a person or animal",unit:12,opts:["belly", "conflict", "rescue", "enthusiasm"]},
    {w:"meantime",m:"\uadf8 \ub3d9\uc548, \uc9ec",def:"the time between two events",unit:12,opts:["belly", "harsh", "meantime", "bid"]},
    {w:"conflict",m:"\uac08\ub4f1, \ubd84\uc7c1, \ub300\ub9bd",def:"a fight between different people or groups",unit:12,opts:["lean", "conflict", "timid", "enthusiasm"]},
    {w:"bid",m:"\uc2dc\ub3c4",def:"an attempt to do something",unit:12,opts:["timid", "enthusiasm", "bid", "harsh"]},
    {w:"harsh",m:"\uac00\ud639\ud55c, \uac70\uce5c, \uac15\uacbd\ud55c",def:"very unpleasant",unit:12,opts:["lean", "bid", "conflict", "harsh"]},
    {w:"timid",m:"\uc18c\uc2ec\ud55c, \ub0b4\uc131\uc801\uc778, \uac81 \ub9ce\uc740",def:"afraid, shy, or nervous",unit:12,opts:["rescue", "lean", "meantime", "timid"]},
    {w:"lean",m:"\uae30\ub300\ub2e4, \uc219\uc774\ub2e4",def:"to bend in a particular direction",unit:12,opts:["bid", "lean", "enthusiasm", "belly"]},
    {w:"enthusiasm",m:"\uc5f4\uc815",def:"a very strong good feeling about something",unit:12,opts:["lean", "conflict", "belly", "enthusiasm"]},
  ],
  "eew5_13": [
    {w:"nutritious",m:"\uc601\uc591\ubd84\uc774 \ud48d\ubd80\ud55c, \uac74\uac15\uc5d0 \uc88b\uc740",def:"helping the body stay healthy",unit:13,opts:["nutritious", "horn", "lag", "brew"]},
    {w:"horn",m:"\uacbd\uc801",def:"a device that makes a loud noise",unit:13,opts:["brew", "nutritious", "irritable", "horn"]},
    {w:"brew",m:"\ub053\uc774\ub2e4, \uc6b0\ub9ac\ub2e4",def:"to pour hot water over coffee or tea",unit:13,opts:["horn", "bead", "lag", "brew"]},
    {w:"charm",m:"\ud669\ud640\ud558\uac8c \ud558\ub2e4, \ub9e4\ud639\ud558\ub2e4",def:"to please someone with your personality",unit:13,opts:["nutritious", "brew", "zoom", "charm"]},
    {w:"bead",m:"\ubb3c\ubc29\uc6b8",def:"a drop of liquid",unit:13,opts:["charm", "bead", "brew", "irritable"]},
    {w:"zoom",m:"\uae09\ud558\uac8c \uc6c0\uc9c1\uc774\ub2e4",def:"to move quickly",unit:13,opts:["nutritious", "charm", "zoom", "brew"]},
    {w:"lag",m:"\ucc98\uc9c0\ub2e4, \uc9c0\uc5f0\uc2dc\ud0a4\ub2e4",def:"to move slowly behind other moving objects",unit:13,opts:["irritable", "zoom", "lag", "nutritious"]},
    {w:"autograph",m:"(\uc720\uba85\uc778\uc0ac\uc758) \uc2f8\uc778",def:"the written name of a famous person",unit:13,opts:["irritable", "autograph", "horn", "zoom"]},
    {w:"subconscious",m:"\uc7a0\uc7ac \uc758\uc2dd\uc758, \uc5b4\ub834\ud48b\uc774 \uc758\uc2dd\ud558\ub294",def:"done without thinking about something",unit:13,opts:["subconscious", "nutritious", "horn", "brew"]},
    {w:"irritable",m:"\ud654\ub97c \uace7\uc798 \ub0b4\ub294",def:"becoming annoyed or angry very easily",unit:13,opts:["irritable", "zoom", "nightmare", "brew"]},
    {w:"nightmare",m:"\uc545\ubabd",def:"a bad or scary dream",unit:13,opts:["horn", "nightmare", "nutritious", "lag"]},
  ],
  "eew5_14": [
    {w:"slight",m:"\uc57d\uac04\uc758, \uc791\uc740, \uc0ac\uc18c\ud55c",def:"small or minor",unit:14,opts:["slight", "sparkle", "stale", "crumble"]},
    {w:"shutter",m:"\uc154\ud130, \ub367\ubb38",def:"wooden or metal covers in front of a window",unit:14,opts:["sprinkle", "fist", "crumble", "shutter"]},
    {w:"ruin",m:"\ub9dd\uce58\ub2e4, \ud30c\uad34\ud558\ub2e4",def:"to harm or damage something greatly",unit:14,opts:["reconcile", "ruin", "express", "flexible"]},
    {w:"crumble",m:"\ubd80\uc218\ub2e4, \uac00\ub8e8 \ub0b4\ub2e4",def:"to break or fall apart into small pieces",unit:14,opts:["fist", "crumble", "slight", "flexible"]},
    {w:"flexible",m:"\uc720\uc5f0\ud55c, \ud0c4\ub825\uc801\uc778",def:"able to bend easily without breaking",unit:14,opts:["crumble", "sift", "flexible", "shutter"]},
    {w:"utter",m:"\ub9d0\ud558\ub2e4",def:"to say a word or a sound",unit:14,opts:["utter", "stale", "crumble", "reconcile"]},
    {w:"reconcile",m:"\ud654\ud574\ud558\ub2e4",def:"to return to a friendly relationship",unit:14,opts:["sift", "reconcile", "utter", "stale"]},
    {w:"express",m:"\ud45c\ud604\ud558\ub2e4, \ubc1c\ud45c\ud558\ub2e4",def:"to show others how one thinks or feels",unit:14,opts:["sprinkle", "express", "sparkle", "reconcile"]},
    {w:"fist",m:"\uc8fc\uba39",def:"a hand with fingers bent in toward the palm",unit:14,opts:["shutter", "reconcile", "fist", "slight"]},
    {w:"stale",m:"\ub531\ub531\ud55c, \uc0c1\ud55c",def:"not fresh but dry, hard, and not good to eat",unit:14,opts:["flexible", "fist", "stale", "slight"]},
    {w:"sparkle",m:"\ubc18\uc9dd\uc774\ub2e4, \ube5b\ub098\ub2e4",def:"to shine brightly with quick flashes of light",unit:14,opts:["reconcile", "sparkle", "stale", "express"]},
    {w:"sift",m:"\uccb4\ub85c \uce58\ub2e4",def:"to remove all the large pieces",unit:14,opts:["crumble", "utter", "sift", "fist"]},
    {w:"injure",m:"\ubd80\uc0c1\uc744 \uc785\ud788\ub2e4, \uc0c1\ucc98\ub97c \uc785\ud788\ub2e4",def:"to damage a part of someone\u2019s body",unit:14,opts:["utter", "slight", "injure", "lump"]},
    {w:"sprinkle",m:"\ubfcc\ub9ac\ub2e4",def:"to scatter something all over something else",unit:14,opts:["lump", "sprinkle", "sparkle", "stale"]},
    {w:"lump",m:"\ub369\uc5b4\ub9ac",def:"a small piece of something that is solid",unit:14,opts:["crumble", "reconcile", "lump", "shutter"]},
  ],
  "eew5_15": [
    {w:"although",m:"\ube44\ub85d ~\ub77c\ub3c4, ~\uc5d0\ub3c4 \ubd88\uad6c\ud558\uace0",def:"one thing is contrasted by another",unit:15,opts:["mature", "although", "furnace", "spaceship"]},
    {w:"confuse",m:"\ud63c\ub780\uc2dc\ud0a4\ub2e4",def:"to make someone feel like they are unsure",unit:15,opts:["confuse", "spaceship", "mature", "due"]},
    {w:"misery",m:"\uace0\ud1b5, \ube44\ucc38",def:"extreme suffering",unit:15,opts:["await", "prior", "misery", "beloved"]},
    {w:"establish",m:"\uc124\ub9bd\ud558\ub2e4, \uc138\uc6b0\ub2e4, \uc218\ub9bd\ud558\ub2e4",def:"to create something",unit:15,opts:["midst", "powerless", "establish", "climate"]},
    {w:"powerless",m:"\ubb34\ud6a8\uc758, \ubb34\ub2a5\ud55c",def:"without power or authority",unit:15,opts:["powerless", "climate", "although", "await"]},
    {w:"mature",m:"\uc5b4\ub978\uc774 \ub418\ub2e4, \uc131\uc219\ud558\ub2e4",def:"to grow up to become an adult",unit:15,opts:["mature", "spaceship", "beloved", "powerless"]},
    {w:"furnace",m:"\uc6a9\uad11\ub85c, \uc544\uad81\uc774, \ubcf4\uc77c\ub7ec",def:"a place where heat is made",unit:15,opts:["confuse", "due", "apply", "furnace"]},
    {w:"spaceship",m:"\uc6b0\uc8fc\uc120",def:"a craft designed for spaceflight",unit:15,opts:["await", "misery", "due", "spaceship"]},
    {w:"beloved",m:"\uac00\uc7a5 \uc0ac\ub791\ud558\ub294, \uc18c\uc911\ud55c",def:"it is very special and you like it very much",unit:15,opts:["await", "climate", "beloved", "due"]},
    {w:"await",m:"\uae30\ub2e4\ub9ac\uace0 \uc788\ub2e4, \uae30\ub300\ud558\ub2e4",def:"to wait for something",unit:15,opts:["misery", "beloved", "confuse", "await"]},
    {w:"apply",m:"\uc801\uc6a9\ud558\ub2e4, \uc9c0\uc6d0\ud558\ub2e4, \uc2e0\uccad\ud558\ub2e4",def:"to put on something",unit:15,opts:["midst", "await", "apply", "spaceship"]},
    {w:"due",m:"\uc608\uc815\uc778",def:"expected to happen or be done at that time",unit:15,opts:["due", "await", "powerless", "although"]},
    {w:"climate",m:"\uae30\ud6c4",def:"the usual weather in a place",unit:15,opts:["prior", "beloved", "confuse", "climate"]},
    {w:"prior",m:"\uc804\uc758, \uae30\uc874\uc758",def:"happened earlier",unit:15,opts:["apply", "prior", "establish", "confuse"]},
    {w:"midst",m:"\ud55c\uac00\uc6b4\ub370, \uc911\uc559",def:"the middle of something",unit:15,opts:["midst", "furnace", "spaceship", "apply"]},
  ],
  "eew5_16": [
    {w:"source",m:"\uc6d0\ucc9c, \uacf5\uae09\uc6d0, \uadfc\uc6d0",def:"the place that something comes from",unit:16,opts:["negative", "sake", "source", "bind"]},
    {w:"disobedient",m:"\ubc18\ud56d\uc801\uc778, \ubcf5\uc885\ud558\uc9c0 \uc54a\ub294",def:"not following the rules or instructions",unit:16,opts:["per", "stern", "rip", "disobedient"]},
    {w:"hoop",m:"(\uae08\uc18d\u00b7\ub098\ubb34\u00b7\ud50c\ub77c\uc2a4\ud2f1\uc73c\ub85c \ub9cc\ub4e0) \ud14c,\uace0\ub9ac",def:"a ring that is made of plastic, metal, or wood",unit:16,opts:["negative", "vehement", "hoop", "plead"]},
    {w:"stern",m:"\uc5c4\uc911\ud55c, \uac15\uacbd\ud55c",def:"very serious",unit:16,opts:["vehement", "glimpse", "stern", "per"]},
    {w:"glimpse",m:"\ud758\ub057 \ubcf4\ub2e4",def:"to see something for a short time",unit:16,opts:["source", "plead", "bind", "glimpse"]},
    {w:"misfortune",m:"\ubd88\uc6b4",def:"bad luck or an unlucky event",unit:16,opts:["sake", "hoop", "misfortune", "rip"]},
    {w:"altogether",m:"\uc804\uc801\uc73c\ub85c, \uc544\uc8fc, \uc804\uccb4\uc801\uc73c\ub85c",def:"it happens completely",unit:16,opts:["disobedient", "source", "altogether", "hoop"]},
    {w:"bind",m:"\uacb0\ud569\ud558\ub2e4, \uad6c\uc18d\ud558\ub2e4",def:"to make people feel united together",unit:16,opts:["disobedient", "stern", "foresee", "bind"]},
    {w:"plead",m:"\uc560\uc6d0\ud558\ub2e4, \ud638\uc18c\ud558\ub2e4, \uac04\uccad\ud558\ub2e4",def:"to ask for something you want very badly",unit:16,opts:["altogether", "plead", "foresee", "rip"]},
    {w:"rip",m:"\ucc22\ub2e4",def:"to pull something apart",unit:16,opts:["stern", "rip", "vehement", "sake"]},
    {w:"per",m:"~\ub2f9, \ub9e4 ~, ~\ub9c8\ub2e4",def:"each",unit:16,opts:["hoop", "plead", "bind", "per"]},
    {w:"negative",m:"\ubd80\uc815\uc801\uc778",def:"unpleasant or sad",unit:16,opts:["foresee", "negative", "source", "per"]},
    {w:"foresee",m:"\uc608\uacac\ud558\ub2e4",def:"to know about something before it happens",unit:16,opts:["sake", "foresee", "misfortune", "vehement"]},
    {w:"sake",m:"\uc704\ud568, \ub3d9\uae30",def:"the reason for doing something",unit:16,opts:["negative", "altogether", "sake", "foresee"]},
    {w:"vehement",m:"\uaca9\ub82c\ud55c, \ub9f9\ub82c\ud55c",def:"angry and emotional",unit:16,opts:["vehement", "source", "foresee", "stern"]},
  ],
  "eew5_17": [
    {w:"grim",m:"\uc6b0\uc6b8\ud55c, \ub0c9\ud639\ud55c",def:"worrying, serious, and scary",unit:17,opts:["herb", "bounds", "appall", "grim"]},
    {w:"alike",m:"\ub2ee\uc740, \ube44\uc2b7\ud55c",def:"similar to each other",unit:17,opts:["ailing", "alike", "demography", "bathe"]},
    {w:"distress",m:"\uace0\ud1b5, \uace4\ub780",def:"a feeling of sadness and anxiousness",unit:17,opts:["physician", "demography", "appall", "distress"]},
    {w:"dip",m:"\uc21c\uac04\uc801 \uac15\ud558, \uae09\uac15\ud558",def:"a decline or a worsening in condition",unit:17,opts:["grim", "dip", "bounds", "demography"]},
    {w:"appall",m:"\uc9c8\ub9ac\uac8c \ud558\ub2e4",def:"to disgust someone",unit:17,opts:["grim", "dip", "physician", "appall"]},
    {w:"nonsense",m:"\ubb34\uc758\ubbf8, \ud5c8\ud2bc\uc18c\ub9ac",def:"words or ideas that are silly or foolish",unit:17,opts:["distress", "nonsense", "bathe", "ailing"]},
    {w:"physician",m:"\uc758\uc0ac, \ub0b4\uacfc \uc758\uc0ac",def:"a doctor",unit:17,opts:["distress", "appall", "bounds", "physician"]},
    {w:"ailing",m:"\ubcd1\ub4e0, \ud3b8\ucc2e\uc740",def:"sickly or not doing well",unit:17,opts:["demography", "nonsense", "ailing", "herb"]},
    {w:"helmet",m:"\uc548\uc804\ubaa8, \ud22c\uad6c",def:"a type of hard hat that protects your head",unit:17,opts:["alike", "herb", "bathe", "helmet"]},
    {w:"bathe",m:"\ubaa9\uc695\ud558\ub2e4",def:"to wash oneself with water",unit:17,opts:["bathe", "dip", "nonsense", "bounds"]},
    {w:"demography",m:"\uc778\uad6c \ud1b5\uacc4\ud559, \uc778\uad6c\ud559",def:"the study of people and populations",unit:17,opts:["demography", "ailing", "bounds", "herb"]},
    {w:"herb",m:"\ud5c8\ube0c, \uc57d\ucd08",def:"a plant used for cooking or medicine",unit:17,opts:["physician", "herb", "grim", "bathe"]},
    {w:"bounds",m:"\ubc94\uc704, \uad6c\uc5ed, \uacbd\uacc4",def:"the area in a game in which plays are legal",unit:17,opts:["demography", "bounds", "alike", "nonsense"]},
  ],
  "eew5_18": [
    {w:"comic",m:"\ud76c\uadf9\uc758, \uc775\uc0b4\uc2a4\ub7ec\uc6b4",def:"funny",unit:18,opts:["complicate", "comic", "search", "blank"]},
    {w:"barber",m:"\uc774\ubc1c\uc0ac",def:"a person whose job is to cut men\u2019s hair",unit:18,opts:["basement", "staircase", "barber", "choir"]},
    {w:"search",m:"\ucc3e\ub2e4, \uc218\uc0c9\ud558\ub2e4, \uac80\uc0c9\ud558\ub2e4",def:"to look for something or someone carefully",unit:18,opts:["ponder", "decline", "search", "comic"]},
    {w:"ponder",m:"\uc219\uace0\ud558\ub2e4",def:"to think about something carefully",unit:18,opts:["blank", "ponder", "justly", "search"]},
    {w:"choir",m:"\ud569\ucc3d\ub2e8",def:"a group of people who sing together",unit:18,opts:["complicate", "slam", "search", "choir"]},
    {w:"decline",m:"\uac70\ubd80\ud558\ub2e4",def:"to say no to an offer or invitation",unit:18,opts:["staircase", "decline", "comic", "basement"]},
    {w:"errand",m:"\uc2ec\ubd80\ub984, \uc6a9\uac74",def:"a trip taken to do a specific activity",unit:18,opts:["search", "errand", "ponder", "basement"]},
    {w:"justly",m:"\uc815\ub2f9\ud558\uac8c, \uc62c\ubc14\ub974\uac8c",def:"fair",unit:18,opts:["justly", "blank", "choir", "staircase"]},
    {w:"complicate",m:"\ubcf5\uc7a1\ud558\uac8c \ud558\ub2e4",def:"to make something harder than necessary",unit:18,opts:["complicate", "basement", "comic", "errand"]},
    {w:"staircase",m:"(\ub09c\uac04\uc744 \ud3ec\ud568\ud55c \ud55c \uc904\uc758) \uacc4\ub2e8",def:"a set of stairs found inside a building",unit:18,opts:["search", "slam", "complicate", "staircase"]},
    {w:"script",m:"\uadf9\ubcf8, \ub300\ubcf8",def:"the words of a film or play",unit:18,opts:["slam", "comic", "complicate", "script"]},
    {w:"basement",m:"\uc9c0\ud558\uc2e4",def:"a room that is built underground",unit:18,opts:["slam", "barber", "basement", "script"]},
    {w:"blank",m:"\ube48, \ubc31\uc9c0\uc758",def:"not having anything on something",unit:18,opts:["slam", "comic", "blank", "errand"]},
    {w:"slam",m:"\ucf85 \ub2eb\ub2e4",def:"to close something hard",unit:18,opts:["complicate", "slam", "justly", "barber"]},
  ],
  "eew5_19": [
    {w:"cargo",m:"\ud654\ubb3c, \uc9d0",def:"the items carried by a ship or an airplane",unit:19,opts:["notify", "breakdown", "cargo", "unfortunate"]},
    {w:"flip",m:"(\uae30\uacc4\uc758 \ubc84\ud2bc \ub4f1\uc744) \ud0c1 \ub204\ub974\ub2e4",def:"to press a switch quickly to turn it on or off",unit:19,opts:["pea", "flip", "vivid", "notify"]},
    {w:"notify",m:"\ud1b5\ubcf4\ud558\ub2e4, \uc54c\ub9ac\ub2e4",def:"to tell someone about something",unit:19,opts:["cargo", "connect", "idle", "notify"]},
    {w:"retain",m:"\uc720\uc9c0\ud558\ub2e4, \ubcf4\uc720\ud558\ub2e4",def:"to keep something",unit:19,opts:["vomit", "retain", "tray", "author"]},
    {w:"raisin",m:"\uac74\ud3ec\ub3c4",def:"a dried grape",unit:19,opts:["vomit", "raisin", "state", "tray"]},
    {w:"breakdown",m:"\ubd95\uad34, \uace0\uc7a5, \uc2e4\ucc45",def:"a failure to work correctly",unit:19,opts:["breakdown", "connect", "vomit", "afflicted"]},
    {w:"pea",m:"\uc644\ub450\ucf69",def:"a vegetable that is small, round, and green",unit:19,opts:["connect", "afflicted", "state", "pea"]},
    {w:"state",m:"\ubd84\uba85\ud788 \ub9d0\ud558\ub2e4, \uc9c4\uc220\ud558\ub2e4",def:"to say something in a definite way",unit:19,opts:["retain", "cargo", "state", "notify"]},
    {w:"vivid",m:"\uc0dd\uc0dd\ud55c, \uc120\uba85\ud55c",def:"bright and colorful",unit:19,opts:["notify", "retain", "vivid", "flip"]},
    {w:"afflicted",m:"\uad34\ub85c\uc6cc\ud558\ub294, \uace0\ud1b5\ubc1b\ub294, \uace0\ubbfc\ud558\ub294",def:"to suffer physically or mentally",unit:19,opts:["notify", "vomit", "afflicted", "retain"]},
    {w:"idle",m:"\uac8c\uc73c\ub978, \ub098\ud0dc\ud55c",def:"not doing anything",unit:19,opts:["raisin", "retain", "state", "idle"]},
    {w:"connect",m:"\uc5f0\uacb0\ud558\ub2e4, \uc811\ubaa9\ud558\ub2e4",def:"to join two things together",unit:19,opts:["unfortunate", "tray", "connect", "flip"]},
    {w:"author",m:"\uc791\uac00, \uc800\uc790",def:"a person who wrote a certain piece of writing",unit:19,opts:["flip", "afflicted", "author", "tray"]},
    {w:"tray",m:"\uc7c1\ubc18",def:"a flat plate used to hold food",unit:19,opts:["flip", "raisin", "tray", "connect"]},
    {w:"vomit",m:"\ud1a0\ud558\ub2e4, \uac8c\uc6cc\ub0b4\ub2e4",def:"to have food come up from one\u2019s stomach",unit:19,opts:["author", "tray", "vomit", "cargo"]},
    {w:"unfortunate",m:"\ubd88\uc6b4\ud55c",def:"bad or unlucky",unit:19,opts:["unfortunate", "cargo", "state", "vivid"]},
  ],
  "eew5_20": [
    {w:"impair",m:"\uc190\uc0c1\uc2dc\ud0a4\ub2e4, \ud574\uce58\ub2e4",def:"to make something weaker or worse",unit:20,opts:["impair", "forbid", "fond", "constantly"]},
    {w:"fond",m:"\uc88b\uc544\ud558\ub294",def:"to cherish or like something",unit:20,opts:["constantly", "contingent", "fond", "haul"]},
    {w:"exert",m:"\ubc1c\ud718\ud558\ub2e4, \ud589\uc0ac\ud558\ub2e4",def:"to use strength or ability to do something",unit:20,opts:["fond", "constantly", "exert", "forbid"]},
    {w:"forbid",m:"\uae08\uc9c0\ud558\ub2e4",def:"to order someone not to do something",unit:20,opts:["ankle", "haul", "mid", "forbid"]},
    {w:"ankle",m:"\ubc1c\ubaa9",def:"a part connecting your leg to your foot",unit:20,opts:["constantly", "impair", "mid", "ankle"]},
    {w:"haul",m:"\uc6b4\ubc18\ud558\ub2e4",def:"to carry something from place to place",unit:20,opts:["haul", "fond", "forbid", "exert"]},
    {w:"contingent",m:"\ud30c\uacac\ub2e8",def:"a set of people that are part of a larger group",unit:20,opts:["impair", "contingent", "forbid", "constantly"]},
    {w:"constantly",m:"\ub04a\uc784\uc5c6\uc774, \uacc4\uc18d",def:"doing something on a continuous basis",unit:20,opts:["fond", "constantly", "impair", "ankle"]},
    {w:"mid",m:"\uc911\uc559\uc758, \ud55c\uac00\uc6b4\ub370\uc758",def:"in the middle or center of something",unit:20,opts:["exert", "fond", "mid", "forbid"]},
  ],
  "eew5_21": [
    {w:"millennium",m:"1000\ub144",def:"1000 years",unit:21,opts:["religion", "update", "background", "millennium"]},
    {w:"chronicle",m:"\uc5ed\uc0ac\uc5d0 \ub0a8\uae30\ub2e4, \uc5f0\ub300\uc21c\uc73c\ub85c \uae30\ub85d\ud558\ub2e4",def:"to record an event",unit:21,opts:["infect", "millennium", "chronicle", "relate"]},
    {w:"literature",m:"\ubb38\ud559",def:"books, plays, and poetry",unit:21,opts:["literature", "chronicle", "religion", "infect"]},
    {w:"infect",m:"\uac10\uc5fc\uc2dc\ud0a4\ub2e4",def:"to give someone an illness",unit:21,opts:["trustworthy", "background", "infect", "disease"]},
    {w:"update",m:"\ucd5c\uc2e0\uc2dd\uc758 \uac83\uc73c\ub85c \ud558\ub2e4",def:"to make something more modern",unit:21,opts:["sum", "disease", "literature", "update"]},
    {w:"trustworthy",m:"\ubbff\uc744 \ub9cc\ud55c",def:"honest and truthful",unit:21,opts:["religion", "literature", "trustworthy", "chronicle"]},
    {w:"religion",m:"\uc885\uad50",def:"a belief in a god or gods",unit:21,opts:["sum", "religion", "millennium", "relate"]},
    {w:"relate",m:"\uc5f0\uad00\ub418\ub2e4, \uc5f0\uad00\uc2dc\ud0a4\ub2e4",def:"to have a connection with something",unit:21,opts:["update", "infect", "sum", "relate"]},
    {w:"background",m:"\ubc30\uacbd",def:"a person\u2019s education, family, and experience",unit:21,opts:["infect", "update", "background", "religion"]},
    {w:"disease",m:"\uc9c8\ubcd1",def:"an illness that causes specific problems",unit:21,opts:["literature", "disease", "infect", "trustworthy"]},
    {w:"sum",m:"\ud569, \ucd1d\uacc4",def:"a specific amount of money",unit:21,opts:["sum", "millennium", "disease", "infect"]},
  ],
  "eew5_22": [
    {w:"neutral",m:"\uc911\ub9bd\uc801\uc778",def:"not helping either of the two fighting sides",unit:22,opts:["deplete", "goods", "neutral", "condemn"]},
    {w:"commerce",m:"\uc0c1\uc5c5, \ubb34\uc5ed",def:"the activity of buying and selling things",unit:22,opts:["condemn", "commerce", "victor", "throne"]},
    {w:"goods",m:"\uc0c1\ud488",def:"anything that can be bought or sold",unit:22,opts:["commerce", "heed", "goods", "deplete"]},
    {w:"heed",m:"\uc720\uc758\ud558\ub2e4, \ubc1b\uc544\ub4e4\uc774\ub2e4",def:"to obey or follow something",unit:22,opts:["victor", "condemn", "mock", "heed"]},
    {w:"condemn",m:"\ucc45\ub9dd\ud558\ub2e4, \ube44\ub09c\ud558\ub2e4, \uc720\uc8c4 \ud310\uacb0\uc744 \ub0b4\ub9ac\ub2e4",def:"to give someone a specific punishment",unit:22,opts:["mock", "condemn", "throne", "persecute"]},
    {w:"cozy",m:"\uc544\ub291\ud55c",def:"comfortable, warm, and relaxing",unit:22,opts:["neutral", "cozy", "throne", "goods"]},
    {w:"deplete",m:"\uace0\uac08\uc2dc\ud0a4\ub2e4",def:"to use up all of something",unit:22,opts:["commerce", "deplete", "goods", "cozy"]},
    {w:"victor",m:"\uc2b9\uc790, \uc815\ubcf5\uc790",def:"a group or person that wins in a contest",unit:22,opts:["persecute", "victor", "commerce", "goods"]},
    {w:"persecute",m:"\ubc15\ud574\ud558\ub2e4, \uace0\ud1b5\ubc1b\ub2e4",def:"to treat someone badly",unit:22,opts:["commerce", "cozy", "throne", "persecute"]},
    {w:"throne",m:"\uc625\uc88c, \uc655\uc704",def:"the special chair in which a ruler sits",unit:22,opts:["neutral", "throne", "commerce", "condemn"]},
    {w:"mock",m:"\uc870\ub871\ud558\ub2e4",def:"to tease someone in a cruel way",unit:22,opts:["condemn", "mock", "cozy", "commerce"]},
  ],
  "eew5_23": [
    {w:"multiply",m:"\uacf1\ud558\ub2e4, \uc99d\uac00\uc2dc\ud0a4\ub2e4",def:"to increase in number",unit:23,opts:["vast", "multiply", "intellectual", "analyze"]},
    {w:"genetic",m:"\uc720\uc804\uc801\uc778",def:"related to the genes in one\u2019s body",unit:23,opts:["multiply", "intellectual", "genetic", "accurate"]},
    {w:"regulate",m:"\uaddc\uc81c\ud558\ub2e4, \uc870\uc808\ud558\ub2e4",def:"to control how something happens",unit:23,opts:["stricken", "vast", "regulate", "pesticide"]},
    {w:"analyze",m:"\ubd84\uc11d\ud558\ub2e4",def:"to study something",unit:23,opts:["asteroid", "analyze", "multiply", "accurate"]},
    {w:"accurate",m:"\uc815\ud655\ud55c, \uc815\ubc00\ud55c",def:"completely correct",unit:23,opts:["stricken", "asteroid", "accurate", "genetic"]},
    {w:"stricken",m:"(\ud53c\ud574\u00b7\uc9c8\ubcd1 \ub4f1\uc5d0) \uac78\ub9b0, \ub2f9\ud55c",def:"badly affected by a disease or problem",unit:23,opts:["vast", "stricken", "asteroid", "pesticide"]},
    {w:"reinforce",m:"\ubcf4\uac15\ud558\ub2e4",def:"to make something stronger.",unit:23,opts:["reinforce", "accurate", "intellectual", "evolve"]},
    {w:"pesticide",m:"\ub18d\uc57d, \uc0b4\ucda9\uc81c",def:"a substance used to kill insects",unit:23,opts:["vast", "intellectual", "analyze", "pesticide"]},
    {w:"evolve",m:"\uc9c4\ud654\ud558\ub2e4, \ubc1c\uc804\ud558\ub2e4, \ubcc0\ud558\ub2e4",def:"to change over time",unit:23,opts:["reinforce", "evolve", "multiply", "stricken"]},
    {w:"intellectual",m:"\uc9c0\uc131\uc778",def:"a very smart person",unit:23,opts:["intellectual", "stricken", "genetic", "regulate"]},
    {w:"vast",m:"\uad11\ub300\ud55c, \ubc29\ub300\ud55c",def:"very large",unit:23,opts:["vast", "analyze", "reinforce", "intellectual"]},
    {w:"asteroid",m:"\uc18c\ud589\uc131",def:"a giant rock from outer space",unit:23,opts:["intellectual", "regulate", "pesticide", "asteroid"]},
  ],
  "eew5_24": [
    {w:"dominate",m:"\uc9c0\ubc30\ud558\ub2e4",def:"to control someone or something",unit:24,opts:["cooking", "hostile", "prescription", "dominate"]},
    {w:"peel",m:"(\uaecd\uc9c8\uc744) \ubc97\uae30\ub2e4",def:"to remove skin of fruits or vegetables",unit:24,opts:["likewise", "cooking", "progress", "peel"]},
    {w:"sandy",m:"\ubaa8\ub798\uc758, \ubaa8\ub798\ud22c\uc131\uc774\uc778",def:"covered with sand",unit:24,opts:["dense", "intake", "likewise", "sandy"]},
    {w:"dense",m:"\ubc00\uc9d1\ud55c, \ubb34\uc131\ud55c",def:"having a lot of things close together",unit:24,opts:["dense", "dominate", "hostile", "cooking"]},
    {w:"incorrect",m:"\ud2c0\ub9b0, \ubd80\uc815\ud655\ud55c",def:"wrong",unit:24,opts:["incorrect", "sandy", "earthen", "dense"]},
    {w:"prescription",m:"\ucc98\ubc29\uc804",def:"permission from a doctor to get medicine",unit:24,opts:["prescription", "skillful", "progress", "sandy"]},
    {w:"earthen",m:"\ud759\uc73c\ub85c \ub9cc\ub4e0",def:"made of clay",unit:24,opts:["dominate", "peel", "bowl", "earthen"]},
    {w:"bowl",m:"\uadf8\ub987",def:"a dish with a round deep shape",unit:24,opts:["incorrect", "bowl", "progress", "earthen"]},
    {w:"hostile",m:"\uc801\ub300\uc801\uc778, \ud638\uc804\uc801\uc778",def:"angry and unfriendly",unit:24,opts:["intake", "progress", "prescription", "hostile"]},
    {w:"likewise",m:"\ub9c8\ucc2c\uac00\uc9c0\ub85c, \ub611\uac19\uc774",def:"doing the same thing as someone else",unit:24,opts:["sandy", "likewise", "bowl", "dense"]},
    {w:"obscure",m:"\ubd88\ubd84\uba85\ud55c",def:"not well known",unit:24,opts:["intake", "dense", "obscure", "earthen"]},
    {w:"skillful",m:"\ub2a5\uc219\ud55c, \uc19c\uc528 \uc788\ub294",def:"very good at doing something",unit:24,opts:["skillful", "cooking", "sandy", "obscure"]},
    {w:"progress",m:"\ubc1c\uc804, \uc9c4\ubcf4",def:"getting better at what you are doing",unit:24,opts:["skillful", "progress", "peel", "sandy"]},
    {w:"intake",m:"\uc12d\ucde8",def:"the amount of food you take into your body",unit:24,opts:["dignity", "intake", "progress", "dense"]},
    {w:"dignity",m:"\uc874\uc5c4, \ud488\uc704",def:"the ability to be calm and worthy of respect",unit:24,opts:["earthen", "obscure", "dignity", "intake"]},
    {w:"cooking",m:"\uc694\ub9ac, \uc870\ub9ac",def:"making food ready to eat",unit:24,opts:["peel", "hostile", "intake", "cooking"]},
  ],
  "eew5_25": [
    {w:"swamp",m:"\ub2aa",def:"a very wet area of land",unit:25,opts:["rural", "secluded", "extinct", "swamp"]},
    {w:"extinct",m:"\uba78\uc885\ud55c, \uc0ac\ub77c\uc9c4",def:"none left",unit:25,opts:["extinct", "zoology", "concrete", "rural"]},
    {w:"species",m:"\uc885, \uc885\ub958, \uc885\uc871",def:"a type of plant or animal",unit:25,opts:["ethical", "rural", "species", "celebrity"]},
    {w:"ethical",m:"\uc724\ub9ac\uc801\uc778, \uc724\ub9ac\uc758",def:"it is the right thing to do",unit:25,opts:["swamp", "zoology", "extinct", "ethical"]},
    {w:"celebrity",m:"\uc720\uba85\uc778, \uc720\uba85\uc778\uc0ac",def:"someone who is famous",unit:25,opts:["celebrity", "concrete", "swamp", "ethical"]},
    {w:"overhead",m:"\uba38\ub9ac \uc704\uc5d0",def:"located above you",unit:25,opts:["secluded", "overhead", "rural", "extinct"]},
    {w:"esteemed",m:"\uc874\uacbd\ubc1b\ub294",def:"liked or respected by many people",unit:25,opts:["secluded", "ethical", "esteemed", "celebrity"]},
    {w:"decisive",m:"\uacb0\ub2e8\ub825 \uc788\ub294",def:"making decisions quickly",unit:25,opts:["principle", "rural", "decisive", "concrete"]},
    {w:"migrate",m:"\uc774\ub3d9\ud558\ub2e4, \uc774\uc8fc\ud558\ub2e4",def:"to move from one place to another",unit:25,opts:["rural", "extinct", "migrate", "swamp"]},
    {w:"traverse",m:"\ud6a1\ub2e8\ud558\ub2e4",def:"to move or travel through an area",unit:25,opts:["traverse", "concrete", "decisive", "rural"]},
    {w:"zoology",m:"\ub3d9\ubb3c\ud559",def:"a subject in which people study animals",unit:25,opts:["decisive", "celebrity", "zoology", "esteemed"]},
    {w:"principle",m:"\uc2e0\ub150, \uc6d0\uce59",def:"a belief about the correct way to behave",unit:25,opts:["principle", "zoology", "species", "esteemed"]},
    {w:"secluded",m:"\uaca9\ub9ac\ub41c, \uc678\ub534",def:"far away from any other place",unit:25,opts:["celebrity", "overhead", "ethical", "secluded"]},
    {w:"rural",m:"\uc2dc\uace8\uc758, \uc804\uc6d0\uc758",def:"in the countryside instead of the city",unit:25,opts:["rural", "decisive", "concrete", "esteemed"]},
    {w:"concrete",m:"\ucf58\ud06c\ub9ac\ud2b8",def:"a substance made from stones",unit:25,opts:["rural", "ethical", "concrete", "esteemed"]},
  ],
  "eew5_26": [
    {w:"omit",m:"\ub204\ub77d\uc2dc\ud0a4\ub2e4, \uc81c\uc678\ud558\ub2e4",def:"to leave out something or do not do it",unit:26,opts:["omit", "slot", "energy", "tactic"]},
    {w:"tactic",m:"\uc804\uc220, \uc804\ub7b5",def:"a careful plan to achieve something",unit:26,opts:["tactic", "slot", "accordingly", "cause"]},
    {w:"gears",m:"\uae30\uc5b4(\uc18d\ub3c4 \ubcc0\ud658 \uc7a5\uce58)",def:"the part of a motor that controls the speed",unit:26,opts:["genuine", "gears", "tactic", "slot"]},
    {w:"genuine",m:"\uc9c4\uc2e4\ub41c, \uc21c\uc218\ud55c",def:"true or real",unit:26,opts:["accordingly", "tactic", "overlap", "genuine"]},
    {w:"energy",m:"\ud798, \ub2a5\ub825, \ud65c\uae30",def:"strength to do lots of things",unit:26,opts:["knowledge", "energy", "genuine", "omit"]},
    {w:"secondhand",m:"\uc911\uace0\uc758, \uac04\uc811\uc801\uc778",def:"it has been owned by someone else",unit:26,opts:["secondhand", "cause", "omit", "skill"]},
    {w:"knowledge",m:"\uc9c0\uc2dd",def:"what you know",unit:26,opts:["omit", "tactic", "energy", "knowledge"]},
    {w:"frequent",m:"\uc7a6\uc740, \ube48\ubc88\ud55c",def:"happening or done often",unit:26,opts:["frequent", "skill", "energy", "accordingly"]},
    {w:"skill",m:"\uae30\uc220, \uae30\ub2a5",def:"something makes you good at doing a job",unit:26,opts:["cause", "energy", "genuine", "skill"]},
    {w:"overlap",m:"\uacb9\uce58\ub2e4",def:"to cover a piece of something",unit:26,opts:["gears", "cause", "tactic", "overlap"]},
    {w:"accordingly",m:"\uc801\uc808\ud788",def:"in a way that is suitable",unit:26,opts:["omit", "gears", "accordingly", "tactic"]},
    {w:"cause",m:"\ucd08\ub798\ud558\ub2e4, \uc77c\uc73c\ud0a4\ub2e4",def:"to make something happen",unit:26,opts:["omit", "cause", "knowledge", "overlap"]},
    {w:"slot",m:"\uc790\ub9ac, \ud648",def:"a narrow opening in a machine or container",unit:26,opts:["knowledge", "accordingly", "slot", "genuine"]},
  ],
  "eew5_27": [
    {w:"strategy",m:"\uc804\ub7b5",def:"a plan for how to do something",unit:27,opts:["strategy", "crucial", "oxygen", "comprehensive"]},
    {w:"comprehensive",m:"\uc885\ud569\uc801\uc778, \ud3ec\uad04\uc801\uc778",def:"having all the details about something else",unit:27,opts:["federal", "formation", "comprehensive", "strategy"]},
    {w:"cumulative",m:"\ub204\uc801\ud558\ub294, \ub204\uc9c4\uc801\uc778, \uc810\uc99d\uc801\uc778",def:"an increase by adding one after another",unit:27,opts:["beneficial", "formation", "cumulative", "comprehensive"]},
    {w:"federal",m:"\uc5f0\ubc29\uc758, \uc5f0\ubc29 \uc815\ubd80\uc758",def:"it relates to the government of a country",unit:27,opts:["federal", "cumulative", "exotic", "distribute"]},
    {w:"crucial",m:"\uacb0\uc815\uc801\uc778, \ud575\uc2ec\uc801\uc778",def:"extremely important to another thing",unit:27,opts:["crucial", "comparative", "strategy", "distribute"]},
    {w:"wooded",m:"\ub098\ubb34\ub85c \ub36e\uc778, \ub098\ubb34\uc758",def:"covered with trees",unit:27,opts:["strategy", "exotic", "oxygen", "wooded"]},
    {w:"objective",m:"\ubaa9\ud45c, \ubaa9\uc801",def:"a goal or plan that someone has",unit:27,opts:["oxygen", "strategy", "objective", "wooded"]},
    {w:"comparative",m:"\ube44\uad50\uc758, \uc0c1\ub300\uc801\uc778",def:"being judged based on something else",unit:27,opts:["crucial", "exotic", "cumulative", "comparative"]},
    {w:"formation",m:"\ud615\uc131",def:"the way that something is made",unit:27,opts:["formation", "wooded", "cumulative", "federal"]},
    {w:"distribute",m:"\ubc30\ud3ec\ud558\ub2e4, \ubd84\ubc30\ud558\ub2e4",def:"to give something to a number of people",unit:27,opts:["distribute", "comparative", "strategy", "cumulative"]},
    {w:"beneficial",m:"\uc774\uc775\uc774 \ub418\ub294",def:"good for you",unit:27,opts:["wooded", "comprehensive", "beneficial", "cumulative"]},
    {w:"exotic",m:"\uc774\uad6d\uc801\uc778, \uc774\uad6d\uc758",def:"unusual because it is from far away",unit:27,opts:["exotic", "cumulative", "distribute", "formation"]},
    {w:"oxygen",m:"\uc0b0\uc18c",def:"a gas that all living things need to breathe",unit:27,opts:["distribute", "oxygen", "comprehensive", "exotic"]},
  ],
  "eew5_28": [
    {w:"random",m:"\ubb34\uc791\uc704\uc758, \uc784\uc758\uc758",def:"happening without any pattern or reason",unit:28,opts:["random", "avail", "linger", "worsen"]},
    {w:"presently",m:"\ud604\uc7ac, \uace7, \ucd5c\uadfc",def:"happening right now",unit:28,opts:["organism", "avail", "solitude", "presently"]},
    {w:"worsen",m:"\uc545\ud654\ub418\ub2e4",def:"to get worse",unit:28,opts:["organism", "worsen", "expand", "summon"]},
    {w:"summon",m:"\uc18c\ud658\ud558\ub2e4, \ubd88\ub7ec\ub0b4\ub2e4",def:"to ask a person to come to you",unit:28,opts:["presently", "organism", "incredulous", "summon"]},
    {w:"fundamental",m:"\uae30\ubcf8\uc801\uc778, \uadfc\ubcf8\uc801\uc778",def:"being a basic part of something",unit:28,opts:["summon", "stark", "fundamental", "expand"]},
    {w:"solitude",m:"\uace0\ub3c5, \uc678\ub85c\uc6c0",def:"the state of being totally alone",unit:28,opts:["fundamental", "solitude", "expand", "stark"]},
    {w:"stark",m:"\uc644\uc804\ud55c, \uadf9\uba85\ud55c",def:"severe or clear in appearance or outline",unit:28,opts:["organism", "incredulous", "linger", "stark"]},
    {w:"linger",m:"\uc9c0\uc18d\ub418\ub2e4, \uc794\uc870\ud558\ub2e4",def:"to last for a long time",unit:28,opts:["expand", "avail", "solitude", "linger"]},
    {w:"expand",m:"\ud655\uc7a5\ud558\ub2e4",def:"to become bigger in size",unit:28,opts:["worsen", "avail", "random", "expand"]},
    {w:"organism",m:"\uc720\uae30\uccb4",def:"a living thing, especially a very small one",unit:28,opts:["fundamental", "avail", "incredulous", "organism"]},
    {w:"incredulous",m:"\ubbff\uc9c0 \uc54a\ub294",def:"not believing that it is true",unit:28,opts:["expand", "fundamental", "organism", "incredulous"]},
    {w:"avail",m:"\ud6a8\uc6a9, \uc774\uc775, \ud6a8\ub825",def:"help or benefit",unit:28,opts:["incredulous", "avail", "expand", "fundamental"]},
    {w:"horrifying",m:"\ubb34\uc11c\uc6b4, \uc18c\ub984\ub07c\uce58\ub294",def:"frightening and very unpleasant",unit:28,opts:["stark", "expand", "incredulous", "horrifying"]},
  ],
  "eew5_29": [
    {w:"confidential",m:"\ube44\ubc00\uc758, \uae30\ubc00\uc758",def:"it must be kept secret",unit:29,opts:["automobile", "guideline", "confidential", "interval"]},
    {w:"ridicule",m:"\uc870\ub871\ud558\ub2e4, \ub180\ub9ac\ub2e4",def:"to make fun of something in a mean way",unit:29,opts:["interval", "corporate", "ridicule", "guideline"]},
    {w:"solar",m:"\ud0dc\uc591\uc758",def:"related to the sun",unit:29,opts:["automobile", "incorporate", "solar", "corporate"]},
    {w:"modify",m:"\ubcc0\uacbd\ud558\ub2e4, \uc870\uc808\ud558\ub2e4",def:"to change something a little bit",unit:29,opts:["modify", "confidential", "guideline", "mobile"]},
    {w:"enhance",m:"\uac15\ud654\ud558\ub2e4, \uac1c\uc120\ud558\ub2e4",def:"to make something better",unit:29,opts:["mobile", "enhance", "automobile", "ridicule"]},
    {w:"corporate",m:"\uae30\uc5c5\uc758, \ud68c\uc0ac\uc758",def:"related to a large business",unit:29,opts:["modify", "corporate", "guideline", "ridicule"]},
    {w:"interval",m:"\uae30\uac04, \uad6c\uac04",def:"the time between two things happening",unit:29,opts:["modify", "confidential", "interval", "solar"]},
    {w:"guideline",m:"\uc9c0\uce68",def:"a rule about how to do something",unit:29,opts:["ridicule", "guideline", "modify", "incorporate"]},
    {w:"automobile",m:"\ucc28\ub7c9, \uc790\ub3d9\ucc28",def:"a car",unit:29,opts:["automobile", "confidential", "solar", "modify"]},
    {w:"incorporate",m:"\ud3ec\ud568\ud558\ub2e4, \uacb0\ud569\ud558\ub2e4",def:"to add something to another thing",unit:29,opts:["interval", "confidential", "incorporate", "mobile"]},
    {w:"mobile",m:"\uc774\ub3d9\uc2dd\uc758",def:"it can be moved easily",unit:29,opts:["guideline", "mobile", "modify", "ridicule"]},
  ],
  "eew5_30": [
    {w:"consistent",m:"\uc77c\uad00\ub41c, \uc9c0\uc18d\uc801\uc778",def:"always having the same behavior or attitude",unit:30,opts:["wardrobe", "consistent", "textile", "scramble"]},
    {w:"doomed",m:"\ud76c\ub9dd \uc5c6\ub294, \uc2e4\ud328\ud55c",def:"going to fail or be destroyed",unit:30,opts:["wardrobe", "doomed", "scramble", "chaos"]},
    {w:"wardrobe",m:"\uc758\uc0c1, \uc637\uc7a5",def:"the collection of all of a person\u2019s clothing",unit:30,opts:["wail", "doomed", "wardrobe", "textile"]},
    {w:"wail",m:"\uc6b8\ubd80\uc9d6\ub2e4, \ud1b5\uace1\ud558\ub2e4",def:"to show sadness by crying loudly",unit:30,opts:["martial", "scramble", "wail", "doomed"]},
    {w:"typhoon",m:"\ud0dc\ud48d",def:"a large tropical storm that moves in circles",unit:30,opts:["wardrobe", "typhoon", "sheer", "scramble"]},
    {w:"sergeant",m:"\uacbd\uc0ac, \ud558\uc0ac\uad00",def:"a soldier or police officer of middle rank",unit:30,opts:["wail", "sergeant", "textile", "doomed"]},
    {w:"martial",m:"\ubb34\uc220\uc758",def:"grown without adding chemicals to it",unit:30,opts:["martial", "textile", "wardrobe", "consistent"]},
    {w:"chaos",m:"\ud63c\ub780, \ud63c\ub3c8",def:"a situation that is confusing and not ordered",unit:30,opts:["chaos", "martial", "doomed", "wail"]},
    {w:"sheer",m:"\uc644\uc804\ud55c, \uc21c\uc218\ud55c",def:"complete and total",unit:30,opts:["wail", "wardrobe", "chaos", "sheer"]},
    {w:"scramble",m:"\uac11\uc790\uae30 \uc774\ub3d9\ud558\ub2e4",def:"to move somewhere quickly and desperately",unit:30,opts:["typhoon", "consistent", "scramble", "sergeant"]},
    {w:"textile",m:"\uc9c1\ubb3c, \uc12c\uc720",def:"cloth that has been woven or knitted",unit:30,opts:["wardrobe", "typhoon", "scramble", "textile"]},
  ],
  "eew6_1": [
    {w:"choke",m:"\uc228\uc774 \ub9c9\ud788\ub2e4",def:"stops you from breathing",unit:1,opts:["alternate", "choke", "reusable", "stuffed"]},
    {w:"boxed",m:"\uc0c1\uc790 \ud3ec\uc7a5\ub41c",def:"inside a package",unit:1,opts:["choke", "boxed", "convenient", "overuse"]},
    {w:"recycle",m:"\uc7ac\ud65c\uc6a9\ud558\ub2e4",def:"use its parts to make something else",unit:1,opts:["choke", "fatal", "recycle", "pond"]},
    {w:"adverse",m:"\ubd80\uc815\uc801\uc778, \ubd88\ub9ac\ud55c",def:"can be harmful, dangerous, or unfavorable",unit:1,opts:["adverse", "utilize", "pond", "fatal"]},
    {w:"whale",m:"\uace0\ub798",def:"a very large mammal that lives in the ocean",unit:1,opts:["utilize", "incidence", "fatal", "whale"]},
    {w:"pond",m:"\uc5f0\ubabb",def:"a freshwater body that is smaller than a lake",unit:1,opts:["pond", "stuffed", "recycle", "whale"]},
    {w:"fatal",m:"\uce58\uba85\uc801\uc778",def:"results in someone\u2019s death",unit:1,opts:["overuse", "pond", "recycle", "fatal"]},
    {w:"stuffed",m:"\uaf49 \ucc44\uc6cc\uc9c4",def:"pushed into a small space",unit:1,opts:["fatal", "boxed", "stuffed", "convenient"]},
    {w:"discard",m:"\ubc84\ub9ac\ub2e4, \ud3d0\uae30\ud558\ub2e4",def:"to throw it away",unit:1,opts:["convenient", "discard", "reusable", "boxed"]},
    {w:"reusable",m:"\ub2e4\uc2dc \uc0ac\uc6a9\ud560\ub9cc\ud55c",def:"can be utilized over and over again",unit:1,opts:["fatal", "choke", "reusable", "boxed"]},
    {w:"convenient",m:"\ud3b8\ub9ac\ud55c",def:"saves you time or effort",unit:1,opts:["pond", "convenient", "incidence", "boxed"]},
    {w:"incidence",m:"(\uc0ac\uac74 \ub4f1\uc758) \ubc1c\uc0dd\ub960",def:"the number of times something happens",unit:1,opts:["alternate", "incidence", "utilize", "convenient"]},
    {w:"utilize",m:"\ud65c\uc6a9\ud558\ub2e4",def:"to use it for a specific purpose",unit:1,opts:["choke", "utilize", "adverse", "stuffed"]},
    {w:"dolphin",m:"\ub3cc\uace0\ub798",def:"a large sea mammal that breathes air",unit:1,opts:["recycle", "dolphin", "discard", "overuse"]},
    {w:"alternate",m:"\ub300\uc548\uc758",def:"a different option",unit:1,opts:["recycle", "alternate", "stuffed", "dolphin"]},
    {w:"overuse",m:"\ub0a8\uc6a9\ud558\ub2e4",def:"when something is utilized too many times",unit:1,opts:["convenient", "stuffed", "recycle", "overuse"]},
  ],
  "eew6_2": [
    {w:"autonomy",m:"\uc790\uce58\uad8c",def:"freedom or independence",unit:2,opts:["dwell", "enlighten", "autonomy", "flourish"]},
    {w:"anonymous",m:"\uc775\uba85\uc778",def:"no one knows who he or she is",unit:2,opts:["virgin", "anonymous", "autonomy", "ambiguous"]},
    {w:"dwell",m:"(~\uc5d0) \uc0b4\ub2e4",def:"to live there",unit:2,opts:["anonymous", "gleam", "dwell", "flourish"]},
    {w:"flourish",m:"\ubc88\ucc3d\ud558\ub2e4",def:"to do very well",unit:2,opts:["virgin", "attain", "ambiguous", "flourish"]},
    {w:"virgin",m:"\uc22b\ucc98\ub140, \uc22b\ucd1d\uac01",def:"someone who has never had sex",unit:2,opts:["ambiguous", "gleam", "virgin", "flourish"]},
    {w:"enlighten",m:"\uc774\ud574\uc2dc\ud0a4\ub2e4",def:"to teach them about something",unit:2,opts:["gleam", "enlighten", "virgin", "attain"]},
    {w:"ambiguous",m:"\uc560\ub9e4\ubaa8\ud638\ud55c",def:"not entirely clear",unit:2,opts:["flourish", "ambiguous", "attain", "autonomy"]},
    {w:"gleam",m:"\uc5b4\uc2b4\ud478\ub808 \ube5b\ub098\ub2e4, \ud658\ud558\ub2e4",def:"to sparkle and shine",unit:2,opts:["virgin", "gleam", "autonomy", "flourish"]},
    {w:"attain",m:"\ud68d\ub4dd\ud558\ub2e4",def:"to succeed at something",unit:2,opts:["anonymous", "gleam", "enlighten", "attain"]},
  ],
  "eew6_3": [
    {w:"ideological",m:"\uc774\ub150\uc801\uc778",def:"based on a system of beliefs or ideals",unit:3,opts:["ideological", "applicable", "robot", "configure"]},
    {w:"consolidate",m:"\ud1b5\ud569\ud558\ub2e4",def:"to join or bring together into one thing",unit:3,opts:["convenience", "consolidate", "applicable", "deduct"]},
    {w:"deduct",m:"\uacf5\uc81c\ud558\ub2e4",def:"to subtract something",unit:3,opts:["deduct", "abnormal", "bicycle", "configure"]},
    {w:"robot",m:"\ub85c\ubd07",def:"a machine that can do the work of a person",unit:3,opts:["robot", "abnormal", "ideological", "deduct"]},
    {w:"configure",m:"\ud615\uc131\ud558\ub2e4, (\ucef4\ud4e8\ud130\uc758) \ud658\uacbd\uc744 \uc124\uc815\ud558\ub2e4",def:"to set it up and arrange it",unit:3,opts:["configure", "consolidate", "adjacent", "abnormal"]},
    {w:"adjacent",m:"\uc778\uc811\ud55c, \uac00\uae4c\uc6b4",def:"next to or adjoining something else.",unit:3,opts:["convenience", "deem", "adjacent", "consolidate"]},
    {w:"convenience",m:"\ud3b8\ub9ac\ud568",def:"to do something easily",unit:3,opts:["ideological", "adjacent", "convenience", "deduct"]},
    {w:"deem",m:"(~\ub85c) \uc5ec\uae30\ub2e4",def:"to consider something",unit:3,opts:["bicycle", "deduct", "deem", "abnormal"]},
    {w:"abnormal",m:"\ube44\uc815\uc0c1\uc801\uc778",def:"different from normal or average",unit:3,opts:["robot", "bicycle", "configure", "abnormal"]},
    {w:"artificial",m:"\uc778\uacf5\uc801\uc778",def:"at any time",unit:3,opts:["artificial", "bicycle", "configure", "abnormal"]},
    {w:"bicycle",m:"\uc790\uc804\uac70",def:"a two-wheeled vehicle powered by pedaling",unit:3,opts:["deduct", "bicycle", "convenience", "abnormal"]},
    {w:"applicable",m:"\ud574\ub2f9\ub418\ub294",def:"relevant to them",unit:3,opts:["ideological", "consolidate", "deem", "applicable"]},
  ],
  "eew6_4": [
    {w:"arid",m:"\ub9e4\uc6b0 \uac74\uc870\ud55c",def:"it is hot and dry and gets very little or no rain",unit:4,opts:["arid", "ample", "speculate", "oath"]},
    {w:"deprive",m:"\ube7c\uc557\ub2e4, \ubc15\ud0c8\ud558\ub2e4",def:"to not let them have it",unit:4,opts:["deprive", "arid", "rugged", "scarce"]},
    {w:"adjoin",m:"\uc778\uc811\ud558\ub2e4, \ubd99\uc5b4 \uc788\ub2e4",def:"be next to or attached to something else",unit:4,opts:["adjoin", "deprive", "oath", "ample"]},
    {w:"grumble",m:"\ud22c\ub35c\uac70\ub9ac\ub2e4",def:"to complain",unit:4,opts:["speculate", "grumble", "arid", "nonetheless"]},
    {w:"scarce",m:"\ubd80\uc871\ud55c, \ub4dc\ubb38",def:"a very small amount of it",unit:4,opts:["scarce", "eligible", "adjoin", "speculate"]},
    {w:"inland",m:"\ub0b4\ub959\uc73c\ub85c",def:"into the center of a country or land",unit:4,opts:["inland", "deprive", "speculate", "scarce"]},
    {w:"abundant",m:"\ud48d\uc871\ud55c",def:"it is available in large quantities",unit:4,opts:["deprive", "scarce", "oath", "abundant"]},
    {w:"ample",m:"\ucda9\ubd84\ud55c",def:"it is enough or more than enough",unit:4,opts:["inland", "ample", "abundant", "nonetheless"]},
    {w:"oath",m:"\ub9f9\uc138, \uc120\uc11c",def:"a formal, often public, promise",unit:4,opts:["deprive", "abundant", "scarce", "oath"]},
    {w:"nonetheless",m:"\uadf8\ub7fc\uc5d0\ub3c4 \ubd88\uad6c\ud558\uace0",def:"occurs despite some other thing.",unit:4,opts:["inland", "grumble", "scarce", "nonetheless"]},
    {w:"speculate",m:"\ucd94\uce21\ud558\ub2e4",def:"to guess about something",unit:4,opts:["deprive", "oath", "abundant", "speculate"]},
    {w:"eligible",m:"~\uc744 \uac00\uc9c8 \uc218 \uc788\ub294, \ud560 \uc218 \uc788\ub294",def:"permitted to do or have something",unit:4,opts:["grumble", "scarce", "deprive", "eligible"]},
    {w:"rugged",m:"\ubc14\uc704\ud22c\uc131\uc774\uc758",def:"rocky and difficult to travel through",unit:4,opts:["speculate", "scarce", "rugged", "arid"]},
  ],
  "eew6_5": [
    {w:"coarse",m:"\uac70\uce5c",def:"a rough texture.",unit:5,opts:["repetitive", "coarse", "nucleus", "tolerance"]},
    {w:"celsius",m:"\uc12d\uc528",def:"a scale for measuring temperature.",unit:5,opts:["nucleus", "bizarre", "celsius", "aquatic"]},
    {w:"prominent",m:"\uc911\uc694\ud55c, \uc720\uba85\ud55c",def:"important and well known",unit:5,opts:["prominent", "digest", "coarse", "duration"]},
    {w:"repetitive",m:"\ubc18\ubcf5\uc801\uc778",def:"repeated many times and becomes boring",unit:5,opts:["bizarre", "reproductive", "repetitive", "prominent"]},
    {w:"vulnerable",m:"(~\uc5d0) \ucde8\uc57d\ud55c",def:"weak and without protection",unit:5,opts:["companion", "aquatic", "bizarre", "vulnerable"]},
    {w:"companion",m:"\ub3d9\ubc18\uc790",def:"someone spends a lot of time with.",unit:5,opts:["duration", "companion", "undergo", "reproductive"]},
    {w:"temperate",m:"\uc628\ud654\ud55c",def:"never gets too hot or cold",unit:5,opts:["tolerance", "nucleus", "temperate", "celsius"]},
    {w:"reproductive",m:"\uc0dd\uc2dd\uc758",def:"a living thing which can produce young",unit:5,opts:["prominent", "aquatic", "repetitive", "reproductive"]},
    {w:"duration",m:"\uc9c0\uc18d, (\uc9c0\uc18d\ub418\ub294) \uae30\uac04",def:"time during which it happens.",unit:5,opts:["temperate", "tolerance", "duration", "nucleus"]},
    {w:"digest",m:"\uc18c\ud654\ud558\ub2e4",def:"swallow food and pass it through the body.",unit:5,opts:["undergo", "companion", "digest", "repetitive"]},
    {w:"infinite",m:"\ubb34\ud55c\ud55c",def:"no limit or end",unit:5,opts:["undergo", "temperate", "infinite", "prominent"]},
    {w:"aquatic",m:"\ubb3c\uc18d\uc5d0\uc11c \uc790\ub77c\ub294, \uc218\uc911\uc758",def:"lives or grows in water",unit:5,opts:["repetitive", "vulnerable", "temperate", "aquatic"]},
    {w:"tolerance",m:"\uad00\uc6a9",def:"the ability to accept something unfavorable",unit:5,opts:["nucleus", "bizarre", "prominent", "tolerance"]},
    {w:"nucleus",m:"(\uc6d0\uc790, \uc138\ud3ec)\ud575",def:"the central part of an atom or cell",unit:5,opts:["vulnerable", "duration", "nucleus", "infinite"]},
    {w:"bizarre",m:"\uae30\uc774\ud55c, \ud2b9\uc774\ud55c",def:"very strange",unit:5,opts:["digest", "celsius", "bizarre", "coarse"]},
    {w:"undergo",m:"\uacaa\ub2e4",def:"to have it happen to you",unit:5,opts:["undergo", "nucleus", "companion", "vulnerable"]},
  ],
  "eew6_6": [
    {w:"component",m:"(\uad6c\uc131)\uc694\uc18c, \ubd80\ud488",def:"part of a larger machine",unit:6,opts:["medieval", "component", "spectacular", "impose"]},
    {w:"diminish",m:"\uac10\uc18c\ud558\ub2e4",def:"reduce or get smaller",unit:6,opts:["medieval", "diminish", "prestige", "impose"]},
    {w:"oriented",m:"~\uc744 \uc9c0\ud5a5\ud558\ub294",def:"faced in that direction.",unit:6,opts:["radical", "drawback", "oriented", "archaic"]},
    {w:"spectacular",m:"\uc7a5\uad00\uc744 \uc774\ub8e8\ub294, \uadf9\uc801\uc778",def:"very impressive",unit:6,opts:["component", "prestige", "impose", "spectacular"]},
    {w:"impose",m:"\ubd80\uacfc\ud558\ub2e4",def:"interrupt or force your ideas on other people",unit:6,opts:["impose", "dependence", "diminish", "component"]},
    {w:"drawback",m:"\uacb0\uc810, \ubb38\uc81c\uc810",def:"a disadvantage",unit:6,opts:["prestige", "impose", "radical", "drawback"]},
    {w:"prestige",m:"\uc704\uc2e0",def:"people admire or respect them",unit:6,opts:["drawback", "impose", "oriented", "prestige"]},
    {w:"archaic",m:"\ub0a1\uc740, \ud3d0\ubb3c\uc774 \ub41c",def:"very old or outdated",unit:6,opts:["radical", "archaic", "refute", "diminish"]},
    {w:"radical",m:"\uae09\uc9c4\uc801\uc778",def:"very new or different",unit:6,opts:["component", "radical", "prestige", "oriented"]},
    {w:"medieval",m:"\uc911\uc138\uc758",def:"the period between 650 and 1500 CE",unit:6,opts:["spectacular", "component", "refute", "medieval"]},
    {w:"dependence",m:"\uc758\uc874",def:"somebody relies on something else",unit:6,opts:["archaic", "dependence", "spectacular", "prestige"]},
    {w:"refute",m:"\ubc18\ubc15\ud558\ub2e4",def:"false or incorrect",unit:6,opts:["component", "drawback", "prestige", "refute"]},
  ],
  "eew6_7": [
    {w:"preliminary",m:"\uc608\ube44\uc758",def:"happens before a more important event",unit:7,opts:["saturate", "sow", "monetary", "preliminary"]},
    {w:"sow",m:"(\uc528\ub97c) \ubfcc\ub9ac\ub2e4",def:"to plant them in the ground",unit:7,opts:["precaution", "sow", "finance", "preliminary"]},
    {w:"monetary",m:"\uae08\uc735\uc758",def:"relates to money",unit:7,opts:["sow", "precaution", "enterprise", "monetary"]},
    {w:"precaution",m:"\uc608\ubc29\ucc45",def:"stop something bad from happening",unit:7,opts:["indifferent", "enterprise", "precaution", "irrigate"]},
    {w:"saturate",m:"\ud760\ubed1 \uc801\uc2dc\ub2e4, \ud3ec\ud654\uc2dc\ud0a4\ub2e4",def:"completely soak it with a liquid",unit:7,opts:["finance", "spade", "saturate", "simplicity"]},
    {w:"spade",m:"\uc0bd",def:"a tool used for digging",unit:7,opts:["spade", "saturate", "irrigate", "crop"]},
    {w:"simplicity",m:"\uac04\ub2e8\ud568",def:"easy to do or understand",unit:7,opts:["preliminary", "crop", "indifferent", "simplicity"]},
    {w:"finance",m:"\uc790\uae08\uc744 \ub300\ub2e4",def:"to provide money for them",unit:7,opts:["precaution", "upcoming", "finance", "saturate"]},
    {w:"indifferent",m:"\ubb34\uad00\uc2ec\ud55c",def:"a lack of interest in it",unit:7,opts:["crop", "indifferent", "spade", "simplicity"]},
    {w:"upcoming",m:"\ub2e4\uac00\uc624\ub294, \uc55e\uc73c\ub85c\uc758",def:"will happen in the near future",unit:7,opts:["monetary", "upcoming", "saturate", "indifferent"]},
    {w:"crop",m:"\uc791\ubb3c",def:"something produced by the land",unit:7,opts:["crop", "irrigate", "upcoming", "precaution"]},
    {w:"dedicate",m:"\ud5cc\uc2e0\ud558\ub2e4",def:"to put a lot of time and effort into it",unit:7,opts:["enterprise", "crop", "dedicate", "sow"]},
    {w:"irrigate",m:"(\ub545\uc5d0) \ubb3c\uc744 \ub300\ub2e4",def:"to supply water to land",unit:7,opts:["indifferent", "irrigate", "preliminary", "simplicity"]},
    {w:"enterprise",m:"\uae30\uc5c5",def:"a company or business",unit:7,opts:["enterprise", "precaution", "crop", "simplicity"]},
  ],
  "eew6_8": [
    {w:"competence",m:"\ub2a5\uc219\ud568",def:"the ability to do something well or effectively",unit:8,opts:["situate", "competence", "muscular", "appoint"]},
    {w:"muscular",m:"\uadfc\uc721\uc758",def:"very fit and strong",unit:8,opts:["muscular", "compatible", "appoint", "crude"]},
    {w:"crude",m:"\ud5c8\uc220\ud55c",def:"not exact or detailed but can still be useful",unit:8,opts:["competence", "crude", "anthropology", "appoint"]},
    {w:"supervise",m:"\uac10\ub3c5\ud558\ub2e4",def:"to make sure that it is done correctly",unit:8,opts:["situate", "supervise", "masculine", "posture"]},
    {w:"ignorance",m:"\ubb34\uc9c0",def:"lack of knowledge about it",unit:8,opts:["applaud", "ignorance", "muscular", "crude"]},
    {w:"appoint",m:"\uc784\uba85\ud558\ub2e4",def:"to give the job to them",unit:8,opts:["appoint", "muscular", "masculine", "compatible"]},
    {w:"situate",m:"\uc704\uce58\uc2dc\ud0a4\ub2e4",def:"to place or build it in a certain place",unit:8,opts:["situate", "anthropology", "masculine", "muscular"]},
    {w:"applaud",m:"\ubc15\uc218\uac08\ucc44\ub97c \ubcf4\ub0b4\ub2e4",def:"to clap in order to show approval",unit:8,opts:["applaud", "competence", "compatible", "posture"]},
    {w:"compatible",m:"\ud654\ud569\ud560 \uc218 \uc788\ub294",def:"work well or exist together successfully",unit:8,opts:["muscular", "crude", "supervise", "compatible"]},
    {w:"posture",m:"\uc790\uc138",def:"the manner in which they stand or sit",unit:8,opts:["compatible", "supervise", "posture", "masculine"]},
    {w:"masculine",m:"\ub0a8\uc790 \uac19\uc740, \uc0ac\ub0b4\ub2e4\uc6b4",def:"a quality or thing related to men",unit:8,opts:["posture", "anthropology", "masculine", "compatible"]},
    {w:"anthropology",m:"\uc778\ub958\ud559",def:"the study of people, society, and culture",unit:8,opts:["muscular", "appoint", "ignorance", "anthropology"]},
  ],
  "eew6_9": [
    {w:"consumption",m:"\uc18c\ube44",def:"act of eating or drinking it",unit:9,opts:["pedestrian", "consumption", "escort", "external"]},
    {w:"crust",m:"\uaecd\uc9c8, \ud45c\uba74",def:"tough outer part of a loaf of bread",unit:9,opts:["escort", "lick", "crust", "considerate"]},
    {w:"heap",m:"(\uc544\ubb34\ub807\uac8c\ub098 \uc313\uc544 \ub193\uc740) \ub354\ubbf8",def:"a large pile of them",unit:9,opts:["pedestrian", "heap", "hemisphere", "escort"]},
    {w:"escort",m:"\ud638\uc704\ud558\ub2e4",def:"safely accompany them to a place",unit:9,opts:["pedestrian", "escort", "lick", "external"]},
    {w:"faculty",m:"\ub2a5\ub825",def:"a mental or physical ability",unit:9,opts:["pedestrian", "faculty", "external", "escort"]},
    {w:"external",m:"\uc678\ubd80\uc758",def:"connected to an outer part",unit:9,opts:["crust", "consumption", "yell", "external"]},
    {w:"pedestrian",m:"\ubcf4\ud589\uc790",def:"a person who is walking on a street",unit:9,opts:["pedestrian", "hemisphere", "considerate", "crust"]},
    {w:"lick",m:"\ud565\ub2e4",def:"to pass your tongue over it",unit:9,opts:["external", "considerate", "lick", "hemisphere"]},
    {w:"considerate",m:"\uc0ac\ub824 \uae4a\uc740, (\ub0a8\uc744) \ubc30\ub824\ud558\ub294",def:"pay attention to the needs of others",unit:9,opts:["heap", "hemisphere", "external", "considerate"]},
    {w:"hemisphere",m:"(\uc9c0\uad6c\uc758)\ubc18\uad6c",def:"one half of the Earth",unit:9,opts:["hemisphere", "escort", "considerate", "consumption"]},
    {w:"yell",m:"\uc18c\ub9ac\uce58\ub2e4",def:"to shout at them",unit:9,opts:["lick", "external", "yell", "pedestrian"]},
  ],
  "eew6_10": [
    {w:"saturated",m:"\ud760\ubed1 \uc816\uc740",def:"completely wet",unit:10,opts:["inflate", "exact", "cardboard", "saturated"]},
    {w:"import",m:"\uc218\uc785\ud558\ub2e4",def:"to bring in a product from another country",unit:10,opts:["import", "inflate", "cardboard", "exact"]},
    {w:"elaborate",m:"\uc815\uad50\ud55c",def:"contains a lot of details",unit:10,opts:["saturated", "facilitate", "elaborate", "mast"]},
    {w:"cardboard",m:"\ud310\uc9c0",def:"a material made out of stiff paper",unit:10,opts:["elaborate", "cardboard", "mast", "import"]},
    {w:"exact",m:"\uc815\ud655\ud55c",def:"correct in every detail",unit:10,opts:["inflate", "exact", "elaborate", "fleet"]},
    {w:"naval",m:"\ud574\uad70\uc758",def:"a country\u2019s navy or military ships",unit:10,opts:["naval", "saturated", "cardboard", "mast"]},
    {w:"facilitate",m:"\ucd09\uc9c4\ud558\ub2e4",def:"to make it easier",unit:10,opts:["elaborate", "facilitate", "saturated", "nausea"]},
    {w:"nausea",m:"\uc695\uc9c0\uae30, \uba54\uc2a4\uaebc\uc6c0",def:"the feeling of being sick to your stomach",unit:10,opts:["import", "facilitate", "elaborate", "nausea"]},
    {w:"fleet",m:"\ud568\ub300",def:"a group of ships",unit:10,opts:["fleet", "inflate", "elaborate", "naval"]},
    {w:"mast",m:"(\ubc30\uc758) \ub3db\ub300",def:"a long pole on a ship that holds the sail",unit:10,opts:["exact", "mast", "inflate", "facilitate"]},
    {w:"inflate",m:"(\uacf5\uae30\ub098 \uac00\uc2a4\ub85c) \ubd80\ud480\ub9ac\ub2e4",def:"to fill it up with air",unit:10,opts:["fleet", "nausea", "facilitate", "inflate"]},
  ],
  "eew6_11": [
    {w:"attorney",m:"\ubcc0\ud638\uc0ac",def:"who gives others advice about the law",unit:11,opts:["attorney", "shaft", "tuition", "theme"]},
    {w:"tuition",m:"\ub4f1\ub85d\uae08, \uc218\uc5c5\ub8cc",def:"the amount of money paid to go to a school",unit:11,opts:["attorney", "graduate", "tuition", "chronic"]},
    {w:"graffiti",m:"\uadf8\ub798\ud53c\ud2f0, \ubcbd\ud654",def:"words or drawings in public places",unit:11,opts:["discipline", "attorney", "graffiti", "chronic"]},
    {w:"sever",m:"(\ub450 \uc870\uac01\uc73c\ub85c) \uc790\ub974\ub2e4, \uc798\ub77c\ub0b4\ub2e4",def:"to cut through it completely",unit:11,opts:["graffiti", "discipline", "sever", "stimulus"]},
    {w:"chronic",m:"\ub9cc\uc131\uc801\uc778",def:"happens over and over again for a long time",unit:11,opts:["terminate", "discipline", "chronic", "stimulus"]},
    {w:"discipline",m:"\uaddc\uc728, \ud6c8\uc721",def:"training that helps people follow the rules",unit:11,opts:["sever", "stimulus", "chronic", "discipline"]},
    {w:"theme",m:"\uc8fc\uc81c",def:"the main subject of a book, movie, or painting",unit:11,opts:["graffiti", "stimulus", "theme", "graduate"]},
    {w:"stimulus",m:"\uc790\uadf9",def:"something that causes growth or activity",unit:11,opts:["sever", "stimulus", "graffiti", "graduate"]},
    {w:"kin",m:"\uce5c\uc871, \uce5c\ucc99",def:"a person\u2019s family and relatives",unit:11,opts:["attorney", "terminate", "kin", "theme"]},
    {w:"terminate",m:"\ub05d\ub098\ub2e4, \uc885\ub8cc\ub418\ub2e4",def:"to stop or end it",unit:11,opts:["graduate", "sever", "terminate", "chronic"]},
    {w:"graduate",m:"\uc878\uc5c5\ud558\ub2e4",def:"to complete and pass all courses of study there",unit:11,opts:["discipline", "graduate", "terminate", "shaft"]},
    {w:"shaft",m:"\uc190\uc7a1\uc774",def:"a handle of a tool or weapon",unit:11,opts:["shaft", "graduate", "kin", "sever"]},
  ],
  "eew6_12": [
    {w:"nick",m:"(\uce7c\ub85c) \uc790\uad6d\uc744 \ub0b4\ub2e4",def:"to cut them slightly with a sharp object",unit:12,opts:["dumb", "aggressive", "foe", "nick"]},
    {w:"provoke",m:"\uc720\ubc1c\ud558\ub2e4",def:"to annoy them on purpose to cause violence",unit:12,opts:["sacred", "provoke", "corps", "hack"]},
    {w:"captive",m:"\ud3ec\ub85c",def:"a prisoner",unit:12,opts:["realm", "meditate", "corps", "captive"]},
    {w:"aggressive",m:"\uacf5\uaca9\uc801\uc778",def:"constantly want to fight or argue",unit:12,opts:["amnesty", "aggressive", "realm", "corps"]},
    {w:"auditorium",m:"\uac15\ub2f9",def:"a large building used for public events",unit:12,opts:["meditate", "auditorium", "provoke", "aggressive"]},
    {w:"compound",m:"\uc218\uc6a9\uc18c, \ubcbd \ub4f1\uc73c\ub85c \ub458\ub7ec\uc2f8\uc778 \uc9c0\uc5ed",def:"an enclosed area such as a prison or factory",unit:12,opts:["compound", "sacred", "auditorium", "meditate"]},
    {w:"sacred",m:"\uc131\uc2a4\ub7ec\uc6b4, \uc885\uad50\uc801\uc778",def:"worshipped and respected",unit:12,opts:["sacred", "corps", "commonplace", "meditate"]},
    {w:"combat",m:"\uc804\ud22c, \uc2f8\uc6c0",def:"fighting between two people or groups",unit:12,opts:["combat", "nick", "meditate", "compound"]},
    {w:"dumb",m:"\ubc99\uc5b4\ub9ac\uc758",def:"unable to speak",unit:12,opts:["commonplace", "corps", "dumb", "nick"]},
    {w:"corps",m:"\uad70\ub2e8, \ub2e8",def:"a division of a military force",unit:12,opts:["reign", "compound", "corps", "auditorium"]},
    {w:"commonplace",m:"\uc544\uc8fc \ud754\ud55c",def:"ordinary",unit:12,opts:["meditate", "combat", "hack", "commonplace"]},
    {w:"meditate",m:"\uba85\uc0c1\ud558\ub2e4",def:"to focus or think deeply in silence",unit:12,opts:["auditorium", "meditate", "realm", "aggressive"]},
    {w:"reign",m:"\ud1b5\uce58 \uae30\uac04, \uce58\uc138",def:"the period of time in which a ruler rules",unit:12,opts:["provoke", "sacred", "corps", "reign"]},
    {w:"realm",m:"\uc601\uc5ed",def:"any area of activity or interest",unit:12,opts:["realm", "hack", "amnesty", "commonplace"]},
    {w:"amnesty",m:"\uc0ac\uba74",def:"a pardon given to prisoners of war",unit:12,opts:["amnesty", "combat", "sacred", "dumb"]},
    {w:"hack",m:"(\ub9c8\uad6c,\uac70\uce60\uac8c) \uc790\ub974\ub2e4, \ub09c\ub3c4\uc9c8\ud558\ub2e4",def:"to cut it into uneven pieces",unit:12,opts:["corps", "meditate", "hack", "auditorium"]},
    {w:"foe",m:"\uc801",def:"an enemy or opponent.",unit:12,opts:["foe", "sacred", "hack", "reign"]},
  ],
  "eew6_13": [
    {w:"executive",m:"\uacbd\uc601\uc9c4",def:"the top manager of a business",unit:13,opts:["nasty", "executive", "twig", "perceive"]},
    {w:"primitive",m:"\ucd08\uae30\uc758",def:"simple, basic, and not very developed",unit:13,opts:["thereby", "aesthetic", "executive", "primitive"]},
    {w:"twig",m:"(\ub098\ubb34\uc758) \uc794\uac00\uc9c0",def:"a short and thin branch from a tree or bush",unit:13,opts:["aesthetic", "thereby", "twig", "sticky"]},
    {w:"fatigue",m:"\ud53c\ub85c",def:"a feeling of extreme tiredness",unit:13,opts:["fatigue", "perceive", "twig", "thereby"]},
    {w:"perceive",m:"\uc778\uc9c0\ud558\ub2e4, \uc778\uc2dd\ud558\ub2e4",def:"to be aware of it",unit:13,opts:["perceive", "thereby", "primitive", "aesthetic"]},
    {w:"aesthetic",m:"\uc2ec\ubbf8\uc801, \ubbf8\ud559\uc801",def:"concerned with a love of beauty",unit:13,opts:["primitive", "aesthetic", "twig", "fatigue"]},
    {w:"creek",m:"\uc791\uc740 \ub9cc, \uac1c\uc6b8",def:"a stream or small river",unit:13,opts:["twig", "sticky", "creek", "primitive"]},
    {w:"thereby",m:"\uadf8\ub7ec\ubbc0\ub85c",def:"a result of something else",unit:13,opts:["primitive", "thereby", "fatigue", "aesthetic"]},
    {w:"nasty",m:"\ub054\ucc0d\ud55c, \ud615\ud3b8\uc5c6\ub294",def:"not nice or pleasant",unit:13,opts:["thereby", "creek", "nasty", "executive"]},
    {w:"sticky",m:"\ub048\uc801\uac70\ub9ac\ub294",def:"covered with a substance that things stick to",unit:13,opts:["executive", "primitive", "sticky", "aesthetic"]},
  ],
  "eew6_14": [
    {w:"relevant",m:"\uad00\ub828\ub41c",def:"important to a certain person or situation",unit:14,opts:["inventory", "relevant", "glacier", "globe"]},
    {w:"recur",m:"\uc7ac\ubc1c\ud558\ub2e4, \ubc18\ubcf5\ub418\ub2e4",def:"to happen more than once.",unit:14,opts:["horizontal", "behalf", "glacier", "recur"]},
    {w:"overview",m:"\uac1c\uad00, \uac1c\uc694",def:"a general description of a situation",unit:14,opts:["glacier", "overview", "behalf", "previous"]},
    {w:"glacier",m:"\ube59\ud558",def:"a large piece of ice that moves very slowly",unit:14,opts:["horizontal", "overview", "previous", "glacier"]},
    {w:"hum",m:"\ucf67\ub178\ub798\ub97c \ubd80\ub974\ub2e4",def:"to make a low, continuous noise",unit:14,opts:["horizontal", "globe", "loaf", "hum"]},
    {w:"inventory",m:"\ubb3c\ud488 \ubaa9\ub85d",def:"a supply of something",unit:14,opts:["relevant", "overview", "inventory", "loaf"]},
    {w:"supernatural",m:"\ucd08\uc790\uc5f0\uc801\uc778",def:"not real or explainable by laws of nature",unit:14,opts:["provide", "glacier", "inventory", "supernatural"]},
    {w:"inward",m:"\ub9c8\uc74c\uc18d\uc758, \ub0b4\uc2ec\uc758",def:"not expressed or shown to others",unit:14,opts:["relevant", "globe", "recur", "inward"]},
    {w:"previous",m:"\uc774\uc804\uc758",def:"happened earlier in time or order",unit:14,opts:["relevant", "inward", "inventory", "previous"]},
    {w:"horizontal",m:"\uc218\ud3c9\uc758",def:"flat and level with the ground",unit:14,opts:["inward", "recur", "horizontal", "hum"]},
    {w:"provide",m:"\uc81c\uacf5\ud558\ub2e4",def:"to supply it",unit:14,opts:["behalf", "relevant", "provide", "inward"]},
    {w:"loaf",m:"\ube75 \ud55c \ub369\uc774",def:"shaped and baked in one piece",unit:14,opts:["globe", "behalf", "hum", "loaf"]},
    {w:"globe",m:"\uc9c0\uad6c\ubcf8, \uc9c0\uad6c\uc758",def:"the Earth",unit:14,opts:["loaf", "globe", "horizontal", "recur"]},
    {w:"behalf",m:"\ub300\uc2e0",def:"done for that person by another",unit:14,opts:["recur", "horizontal", "behalf", "overview"]},
  ],
  "eew6_15": [
    {w:"autobiography",m:"\uc790\uc11c\uc804",def:"a true story of a person\u2019s life written",unit:15,opts:["autobiography", "gracious", "insulate", "recipient"]},
    {w:"misplace",m:"\uc5b4\ub514\uc5d0 \ub450\uace0 \uc78a\uc5b4\ubc84\ub9ac\ub2e4",def:"to lose it",unit:15,opts:["autobiography", "misplace", "naughty", "recipient"]},
    {w:"gracious",m:"\uc790\uc560\ub85c\uc6b4, \ud488\uc704\uc788\ub294",def:"kind and helpful to those who need it",unit:15,opts:["insulate", "gracious", "misplace", "improve"]},
    {w:"probe",m:"\uce90\ubb3b\ub2e4, \uce90\ub2e4",def:"to ask questions to discover facts about it",unit:15,opts:["probe", "improve", "gracious", "naughty"]},
    {w:"recipient",m:"\ubc1b\ub294 \uc0ac\ub78c",def:"the person who receives it",unit:15,opts:["autobiography", "recipient", "naughty", "misplace"]},
    {w:"insulate",m:"\uc808\uc5f0 \ucc98\ub9ac\ub97c \ud558\ub2e4",def:"to protect it from heat, cold, or noise",unit:15,opts:["insulate", "longevity", "autobiography", "improve"]},
    {w:"naughty",m:"\ubc84\ub987\uc5c6\ub294, \ub9d0\uc744 \uc548 \ub4e3\ub294",def:"behave badly or do not do what they are told",unit:15,opts:["gracious", "naughty", "misplace", "insulate"]},
    {w:"improve",m:"\ub098\uc544\uc9c0\ub2e4, \ud5a5\uc0c1\ub418\ub2e4",def:"to make it better",unit:15,opts:["gracious", "longevity", "probe", "improve"]},
    {w:"longevity",m:"\uc7a5\uc218, \uc624\ub798 \uc9c0\uc18d\ub428",def:"the ability to live for a long time",unit:15,opts:["naughty", "insulate", "recipient", "longevity"]},
  ],
  "eew6_16": [
    {w:"authentic",m:"\uc9c4\uc9dc\uc778",def:"not false or a copy of the original",unit:16,opts:["fossil", "antique", "authentic", "chronology"]},
    {w:"register",m:"\ub4f1\ub85d",def:"an official list or record of people or things",unit:16,opts:["recruit", "register", "authentic", "precede"]},
    {w:"antique",m:"\uace8\ub3d9\ud488\uc778",def:"very old and rare, and therefore valuable",unit:16,opts:["fossil", "antique", "recruit", "precede"]},
    {w:"precede",m:"\uc120\ud589\ud558\ub2e4",def:"to come before it",unit:16,opts:["majesty", "authentic", "precede", "chronology"]},
    {w:"fossil",m:"\ud654\uc11d",def:"the hard remains of a prehistoric animal or plant",unit:16,opts:["lyric", "fossil", "chronology", "recruit"]},
    {w:"punctual",m:"\uc2dc\uac04\uc744 \uc9c0\ud0a4\ub294",def:"do something or arrive at the right time.",unit:16,opts:["punctual", "majesty", "chronology", "lyric"]},
    {w:"humiliate",m:"\uad74\uc695\uac10\uc744 \uc8fc\ub2e4",def:"to make them feel ashamed and embarrassed",unit:16,opts:["chronology", "humiliate", "recruit", "fossil"]},
    {w:"majesty",m:"\uc7a5\uc5c4\ud568",def:"supreme greatness or authority",unit:16,opts:["majesty", "lyric", "chronology", "antique"]},
    {w:"chronology",m:"\uc5f0\ub300\uc21c, \uc5f0\ub300\ud45c",def:"a series of past events is when they happened",unit:16,opts:["lyric", "chronology", "recruit", "precede"]},
    {w:"lyric",m:"\uc11c\uc815\uc2dc\uc758",def:"expresses a lot of emotion",unit:16,opts:["lyric", "precede", "majesty", "chronology"]},
    {w:"recruit",m:"\ubaa8\uc9d1\ud558\ub2e4",def:"select them to join or work.",unit:16,opts:["chronology", "recruit", "precede", "fossil"]},
  ],
  "eew6_17": [
    {w:"jagged",m:"\uc090\uc8fd\uc090\uc8fd\ud55c",def:"a tough, uneven shape or edge",unit:17,opts:["periphery", "plaster", "jagged", "thigh"]},
    {w:"periphery",m:"\uc8fc\ubcc0",def:"the edge of it",unit:17,opts:["ego", "jagged", "periphery", "plaster"]},
    {w:"outright",m:"\uba85\ubc31\ud55c, \ub178\uace8\uc801\uc778",def:"open and direct",unit:17,opts:["plaster", "elastic", "outright", "conceive"]},
    {w:"ego",m:"\uc790\uc544",def:"a person\u2019s sense of their own worth",unit:17,opts:["elastic", "outright", "ego", "skeletal"]},
    {w:"stumble",m:"\ubc1c\uc774 \uac78\ub9ac\ub2e4",def:"to move in an awkward, unplanned way",unit:17,opts:["stumble", "ego", "thigh", "periphery"]},
    {w:"elastic",m:"\uace0\ubb34\ub85c \ub41c, \ud0c4\ub825 \uc788\ub294",def:"a rubber that stretches when it is pulled",unit:17,opts:["elastic", "plaster", "dubious", "ego"]},
    {w:"thigh",m:"\ud5c8\ubc85\uc9c0",def:"the upper half of your leg",unit:17,opts:["stumble", "thigh", "outright", "jagged"]},
    {w:"dubious",m:"\uc758\uc2ec\ud558\ub294",def:"not considered honest",unit:17,opts:["skeletal", "stumble", "dubious", "jagged"]},
    {w:"conceive",m:"\uc0dd\uac01\ud558\ub2e4, \uc0c1\uc0c1\ud558\ub2e4",def:"to be able to imagine or believe it",unit:17,opts:["dubious", "plaster", "ego", "conceive"]},
    {w:"vicious",m:"\uc794\uc778\ud55c",def:"violent and cruel",unit:17,opts:["plaster", "vicious", "coexist", "magnitude"]},
    {w:"plaster",m:"\ud68c\ubc18\uc8fd",def:"a smooth paste that gets hard when it dries",unit:17,opts:["dubious", "vicious", "plaster", "skeletal"]},
    {w:"skeletal",m:"\ubf08\ub300\uc758",def:"bones in the body",unit:17,opts:["ego", "conceive", "jagged", "skeletal"]},
    {w:"coexist",m:"\uacf5\uc874\ud558\ub2e4",def:"to exist with it in the same time and place",unit:17,opts:["jagged", "coexist", "vicious", "ego"]},
    {w:"magnitude",m:"\uaddc\ubaa8",def:"large size",unit:17,opts:["conceive", "elastic", "magnitude", "vicious"]},
  ],
  "eew6_18": [
    {w:"gourmet",m:"\ubbf8\uc2dd\uac00\uc758, \ubbf8\uc2dd\uac00\ub97c \uc704\ud55c",def:"nicer and more expensive than regular food",unit:18,opts:["soundly", "chunk", "overwork", "gourmet"]},
    {w:"hence",m:"\uc774\ub7f0 \uc774\uc720\ub85c",def:"a result of something else",unit:18,opts:["chunk", "hence", "attic", "ordeal"]},
    {w:"outspoken",m:"\ub178\uace8\uc801\uc73c\ub85c \ub9d0\ud558\ub294",def:"not afraid to say what they think",unit:18,opts:["outspoken", "chunk", "hence", "ordeal"]},
    {w:"chunk",m:"\ub369\uc5b4\ub9ac",def:"a thick, solid piece of something",unit:18,opts:["attic", "chunk", "ordeal", "soundly"]},
    {w:"glamorous",m:"\ud654\ub824\ud55c, \ub9e4\ub825\uc774 \ub118\uce58\ub294",def:"one full of beauty and excitement",unit:18,opts:["glamorous", "civic", "ministry", "overwork"]},
    {w:"overwork",m:"\uacfc\ub85c\ud558\ub2e4",def:"to make them tired with too much work",unit:18,opts:["civic", "overwork", "intrinsic", "particular"]},
    {w:"attic",m:"\ub2e4\ub77d(\ubc29)",def:"a room just below a house\u2019s roof",unit:18,opts:["dissatisfy", "attic", "din", "gourmet"]},
    {w:"ministry",m:"(\uc815\ubd80\uc758 \uac01)\ubd80\ucc98",def:"a government department",unit:18,opts:["hence", "particular", "ministry", "outspoken"]},
    {w:"din",m:"\uc18c\uc74c",def:"loud, unpleasant, and extended noise",unit:18,opts:["ministry", "din", "chunk", "civic"]},
    {w:"soundly",m:"\ub4e0\ub4e0\ud558\uac8c, \ud655\uc2e4\ud788",def:"done in the best or most complete way",unit:18,opts:["overwork", "attic", "soundly", "intrinsic"]},
    {w:"descent",m:"\ub0b4\ub824\uc624\uae30, \ud558\uac15",def:"a movement downwards",unit:18,opts:["din", "soundly", "glamorous", "descent"]},
    {w:"ordeal",m:"\uc2dc\ub828",def:"a bad experience",unit:18,opts:["ordeal", "dissatisfy", "overwork", "particular"]},
    {w:"dissatisfy",m:"\ubd88\ub9cc\uc871\ud558\ub2e4",def:"to fail to please them",unit:18,opts:["hence", "gourmet", "dissatisfy", "overwork"]},
    {w:"intrinsic",m:"\uace0\uc720\ud55c, \ubcf8\uc9c8\uc801\uc778",def:"the basic nature of that thing",unit:18,opts:["chunk", "intrinsic", "glamorous", "descent"]},
    {w:"particular",m:"\ud2b9\uc815\ud55c",def:"a single, important part of a group of things",unit:18,opts:["civic", "overwork", "gourmet", "particular"]},
    {w:"civic",m:"\uc2dc\ubbfc\uc758, \ub3c4\uc2dc\uc758",def:"a town or city, in particular to its government",unit:18,opts:["civic", "overwork", "dissatisfy", "chunk"]},
  ],
  "eew6_19": [
    {w:"congested",m:"\ubd90\ube44\ub294, \ud63c\uc7a1\ud55c",def:"full or blocked",unit:19,opts:["congested", "propel", "etiquette", "premium"]},
    {w:"suppress",m:"\uc9c4\uc555\ud558\ub2e4",def:"to prevent it from happening",unit:19,opts:["unsettle", "overboard", "congested", "suppress"]},
    {w:"premium",m:"\ud560\uc99d\uae08",def:"a payment that is higher than average",unit:19,opts:["suppress", "warp", "premium", "exclusive"]},
    {w:"etiquette",m:"\uc608\uc758",def:"the group of rules about how to be polite",unit:19,opts:["overboard", "etiquette", "liable", "garment"]},
    {w:"obsess",m:"\uc0ac\ub85c\uc7a1\ub2e4",def:"to think about it all of the time",unit:19,opts:["exclusive", "obsess", "warp", "garment"]},
    {w:"garment",m:"\uc758\ubcf5, \uc637",def:"a piece of clothing",unit:19,opts:["liable", "exclusive", "propel", "garment"]},
    {w:"socialize",m:"(\uc0ac\ub78c\ub4e4\uacfc) \uc0ac\uadc0\ub2e4, \uc5b4\uc6b8\ub9ac\ub2e4",def:"to have a good time with people",unit:19,opts:["garment", "etiquette", "socialize", "liable"]},
    {w:"unsettle",m:"\ubd88\uc548\ud558\uac8c \ud558\ub2e4",def:"to make them anxious or worried",unit:19,opts:["unsettle", "congested", "premium", "exclusive"]},
    {w:"propel",m:"\ub098\uc544\uac00\uac8c \ud558\ub2e4",def:"to push or move it somewhere",unit:19,opts:["exclusive", "etiquette", "congested", "propel"]},
    {w:"overboard",m:"\ubc30 \ubc16\uc73c\ub85c",def:"over the side of a boat and in the water",unit:19,opts:["exclusive", "propel", "overboard", "garment"]},
    {w:"liable",m:"~\ud558\uae30 \uc26c\uc6b4, \ubc95\uc801 \ucc45\uc784\uc774 \uc788\ub294",def:"very likely that it will happen",unit:19,opts:["obsess", "liable", "unsettle", "congested"]},
    {w:"warp",m:"\ud718\ub2e4",def:"to become bent into the wrong shape",unit:19,opts:["warp", "propel", "etiquette", "congested"]},
    {w:"exclusive",m:"\ub3c5\uc810\uc801\uc778, \ubc30\ud0c0\uc801\uc778",def:"expensive and only for rich people",unit:19,opts:["overboard", "garment", "exclusive", "premium"]},
  ],
  "eew6_20": [
    {w:"upbringing",m:"\uc591\uc721, \ud6c8\uc721",def:"taught to behave by their parents",unit:20,opts:["mortal", "overcast", "upbringing", "sob"]},
    {w:"speck",m:"\uc791\uc740 \uc5bc\ub8e9",def:"a very small mark or amount",unit:20,opts:["ranger", "speck", "mortal", "episode"]},
    {w:"aerial",m:"\uacf5\uc911\uc758",def:"to being in the air or flying",unit:20,opts:["sob", "intact", "aerial", "overcast"]},
    {w:"sob",m:"\ud750\ub290\ub07c\ub2e4",def:"to cry loudly",unit:20,opts:["seclude", "mortal", "sober", "sob"]},
    {w:"apparatus",m:"\uae30\uad6c, \uc7a5\uce58",def:"a device used for a particular purpose",unit:20,opts:["sober", "overcast", "apparatus", "mortal"]},
    {w:"mortal",m:"\ubd88\uba78\ud558\uc9c0 \uc54a\uc740",def:"cannot live forever",unit:20,opts:["sideways", "mortal", "overcast", "intact"]},
    {w:"accumulate",m:"\ubaa8\uc73c\ub2e4, \ucd95\uc801\ud558\ub2e4",def:"to collect a lot of it over time",unit:20,opts:["ranger", "accumulate", "sob", "omen"]},
    {w:"episode",m:"\uc77c\ud654",def:"happens as part of a series of events",unit:20,opts:["apparatus", "sob", "overcast", "episode"]},
    {w:"seclude",m:"\uc740\ub454\ud558\ub2e4, \uace0\ub9bd\uc2dc\ud0a4\ub2e4",def:"to keep them away from other people",unit:20,opts:["sob", "intact", "apparatus", "seclude"]},
    {w:"poignant",m:"\uac00\uc2b4 \uc544\ud508",def:"a very strong feeling of sadness",unit:20,opts:["overcast", "seclude", "sob", "poignant"]},
    {w:"omen",m:"\uc9d5\uc870, \uc870\uc9d0",def:"a sign of what will happen in the future",unit:20,opts:["omen", "poignant", "overcast", "sober"]},
    {w:"overcast",m:"\uad6c\ub984\uc774 \ub4a4\ub36e\uc778",def:"full of clouds and is not sunny",unit:20,opts:["overcast", "episode", "intact", "upbringing"]},
    {w:"sober",m:"\ub0c9\ucca0\ud55c, \uc9c4\uc9c0\ud55c",def:"serious and calm",unit:20,opts:["aerial", "episode", "sober", "mortal"]},
    {w:"ranger",m:"\uacf5\uc6d0 \uad00\ub9ac\uc6d0",def:"a person who protects forests or parks",unit:20,opts:["upbringing", "ranger", "sober", "accumulate"]},
    {w:"intact",m:"\uc628\uc804\ud55c",def:"complete and not damaged",unit:20,opts:["sober", "intact", "poignant", "mortal"]},
    {w:"sideways",m:"\uc606\uc73c\ub85c, \uc606\uc5d0\uc11c",def:"moves to or from the side",unit:20,opts:["seclude", "sideways", "aerial", "ranger"]},
  ],
  "eew6_21": [
    {w:"reckless",m:"\ubb34\ubaa8\ud55c, \uc2e0\uc911\ud558\uc9c0 \ubabb\ud55c",def:"act in an unsafe way",unit:21,opts:["mound", "filth", "testament", "reckless"]},
    {w:"dilapidated",m:"\ub2e4 \ud5c8\ubb3c\uc5b4\uc838 \uac00\ub294",def:"old and in bad condition",unit:21,opts:["bliss", "evoke", "grin", "dilapidated"]},
    {w:"numb",m:"\uac10\uac01\uc774 \uc5c6\ub294",def:"does not have any feeling",unit:21,opts:["dilapidated", "testament", "numb", "grin"]},
    {w:"bliss",m:"\ub354\uc5c6\ub294 \ud589\ubcf5",def:"a state of complete happiness",unit:21,opts:["testament", "numb", "evoke", "bliss"]},
    {w:"mound",m:"\ub354\ubbf8, \uc5b8\ub355",def:"a large pile of it",unit:21,opts:["grin", "testament", "filth", "mound"]},
    {w:"filth",m:"\uc624\ubb3c",def:"dirt or dirty things that disgust you",unit:21,opts:["filth", "grin", "testament", "bliss"]},
    {w:"testament",m:"\uc99d\uac70",def:"something shows that it exists or is true",unit:21,opts:["testament", "dilapidated", "bliss", "mound"]},
    {w:"evoke",m:"(\uac10\uc815, \uae30\uc5b5\uc744) \ub5a0\uc62c\ub824\uc8fc\ub2e4",def:"to make it occur",unit:21,opts:["testament", "numb", "evoke", "mound"]},
    {w:"grin",m:"(\uc18c\ub9ac \uc5c6\uc774) \ud65c\uc9dd \uc6c3\ub2e4",def:"to smile broadly",unit:21,opts:["bliss", "grin", "numb", "mound"]},
  ],
  "eew6_22": [
    {w:"frontier",m:"\uad6d\uacbd",def:"a border between two regions or countries",unit:22,opts:["frontier", "weary", "contemplate", "stray"]},
    {w:"cot",m:"\uac04\uc774 \uce68\ub300",def:"a small portable bed",unit:22,opts:["paw", "enlist", "contemplate", "cot"]},
    {w:"contemplate",m:"\uace0\ub824\ud558\ub2e4",def:"to think about it",unit:22,opts:["contend", "paw", "weary", "contemplate"]},
    {w:"splendid",m:"\ud6cc\ub96d\ud568, \ube5b\ub0a8",def:"very good",unit:22,opts:["tract", "lush", "splendid", "weary"]},
    {w:"lush",m:"\ubb34\uc131\ud55c",def:"full of a variety of large, healthy plants",unit:22,opts:["lush", "contemplate", "enlist", "substantial"]},
    {w:"paw",m:"(\ub3d9\ubb3c\uc758 \ubc1c\ud1b1\uc774 \ub2ec\ub9b0) \ubc1c",def:"an animal\u2019s foot that has claws or soft pads",unit:22,opts:["contend", "tract", "weary", "paw"]},
    {w:"tract",m:"\uc9c0\uc5ed",def:"a large area of land",unit:22,opts:["tract", "lush", "contend", "paw"]},
    {w:"camouflage",m:"\uc704\uc7a5",def:"something used to hide people and things",unit:22,opts:["lush", "enlist", "frontier", "camouflage"]},
    {w:"hesitant",m:"\uc8fc\uc800\ud558\ub294, \ub9dd\uc124\uc774\ub294",def:"not sure or are slow to act or speak",unit:22,opts:["stray", "hesitant", "contemplate", "frontier"]},
    {w:"enlist",m:"\uc785\ub300\ud558\ub2e4",def:"to join the military",unit:22,opts:["contend", "enlist", "tract", "camouflage"]},
    {w:"weary",m:"(\ubab9\uc2dc)\uc9c0\uce5c, \ud53c\uace4\ud55c",def:"tired",unit:22,opts:["camouflage", "paw", "stray", "weary"]},
    {w:"stray",m:"\uc81c \uc704\uce58\ub97c \ubc97\uc5b4\ub098\ub2e4",def:"to go in a wrong direction and become lost",unit:22,opts:["stray", "tract", "splendid", "substantial"]},
    {w:"contend",m:"(~\uc744 \uc5bb\uc73c\ub824\uace0) \uc528\ub984\ud558\ub2e4",def:"to struggle to overcome it",unit:22,opts:["contend", "camouflage", "substantial", "contemplate"]},
    {w:"substantial",m:"\uc0c1\ub2f9\ud55c",def:"great importance, size, or value",unit:22,opts:["frontier", "hesitant", "cot", "substantial"]},
  ],
  "eew6_23": [
    {w:"collide",m:"\ucda9\ub3cc\ud558\ub2e4, \ubd80\ub52a\uce58\ub2e4",def:"to hit it while moving",unit:23,opts:["collide", "underestimate", "scrutiny", "subject"]},
    {w:"subject",m:"~\uc744 \ub2f9\ud558\uac8c \ub9cc\ub4e4\ub2e4",def:"to force them to do or experience it",unit:23,opts:["segregate", "backstage", "collide", "subject"]},
    {w:"testify",m:"\uc99d\uc5b8\ud558\ub2e4",def:"to give evidence as a witness",unit:23,opts:["testify", "backstage", "clumsy", "flammable"]},
    {w:"underestimate",m:"\uacfc\uc18c\ud3c9\uac00\ud558\ub2e4",def:"to think less of them than they really are",unit:23,opts:["scrutiny", "segregate", "backstage", "underestimate"]},
    {w:"backstage",m:"\ubb34\ub300 \ub4a4\uc5d0\uc11c",def:"occurs behind a theater\u2019s stage",unit:23,opts:["premature", "subject", "collide", "backstage"]},
    {w:"segregate",m:"\ubd84\ub9ac\ud558\ub2e4",def:"to place it in a group apart from other things",unit:23,opts:["billionaire", "scrutiny", "premature", "segregate"]},
    {w:"premature",m:"\uc608\uc0c1\ubcf4\ub2e4 \uc774\ub978",def:"done too early or before the proper time",unit:23,opts:["testify", "clumsy", "segregate", "premature"]},
    {w:"scrutiny",m:"\uc815\ubc00 \uc870\uc0ac",def:"the careful examination of something",unit:23,opts:["segregate", "collide", "scrutiny", "amid"]},
    {w:"flammable",m:"\uac00\uc5f0\uc131\uc758, \ubd88\uc5d0 \uc798 \ud0c0\ub294",def:"able to catch on fire",unit:23,opts:["collide", "flammable", "backstage", "testify"]},
    {w:"resent",m:"\ubd84\ud558\uac8c \uc5ec\uae30\ub2e4",def:"have bad feelings about it",unit:23,opts:["collide", "clumsy", "resent", "premature"]},
    {w:"amid",m:"\uac00\uc6b4\ub370\uc5d0",def:"in the middle of it",unit:23,opts:["amid", "premature", "clumsy", "flammable"]},
    {w:"billionaire",m:"\ubc31\ub9cc\uc7a5\uc790",def:"someone who has at least one billion dollars",unit:23,opts:["billionaire", "underestimate", "backstage", "subject"]},
    {w:"clumsy",m:"\uc5b4\uc124\ud508",def:"awkward in handling things",unit:23,opts:["amid", "clumsy", "resent", "segregate"]},
  ],
  "eew6_24": [
    {w:"stimulate",m:"\ucd09\uc9c4\ud558\ub2e4",def:"to cause or to increase activity in it",unit:24,opts:["stimulate", "accelerate", "meteorological", "ingenious"]},
    {w:"spur",m:"\ubc15\ucc28\ub97c \uac00\ud558\ub2e4",def:"to urge them into action",unit:24,opts:["spur", "propulsion", "ingenious", "accelerate"]},
    {w:"innovative",m:"\ud601\uc2e0\uc801\uc778",def:"think in creative ways",unit:24,opts:["innovative", "launch", "meteorology", "simulate"]},
    {w:"defect",m:"\uacb0\ud568",def:"a part of something that is wrong or missing",unit:24,opts:["electromagnetic", "meteorological", "defect", "persistent"]},
    {w:"duplicate",m:"\ubcf5\uc0ac\ud558\ub2e4",def:"to copy it",unit:24,opts:["electromagnetic", "duplicate", "launch", "innovative"]},
    {w:"meteorological",m:"\uae30\uc0c1\uc758, \uae30\uc0c1\ud559\uc0c1\uc758",def:"concerned with the science of weather",unit:24,opts:["penetrate", "meteorological", "dreary", "electromagnetic"]},
    {w:"dreary",m:"\uc74c\uc6b8\ud55c, \ub530\ubd84\ud55c",def:"dull, dark, and lifeless",unit:24,opts:["simulate", "innovative", "persistent", "dreary"]},
    {w:"persistent",m:"\uc9c0\uc18d",def:"does not give up and keeps on working",unit:24,opts:["persistent", "innovative", "accelerate", "duplicate"]},
    {w:"anew",m:"\ub2e4\uc2dc, \uc0c8\ub85c",def:"do it again, possibly in a different way",unit:24,opts:["simulate", "penetrate", "anew", "meteorology"]},
    {w:"penetrate",m:"\uad00\ud1b5\ud558\ub2e4",def:"to enter into it",unit:24,opts:["penetrate", "meteorology", "simulate", "accelerate"]},
    {w:"launch",m:"\uc2dc\uc791\ud558\ub2e4, \ucd9c\uc2dc\ud558\ub2e4",def:"to make it go into motion",unit:24,opts:["accelerate", "launch", "dreary", "propulsion"]},
    {w:"electromagnetic",m:"\uc804\uc790\uae30\uc801\uc778",def:"related to electricity and magnetic fields",unit:24,opts:["launch", "stimulate", "innovative", "electromagnetic"]},
    {w:"simulate",m:"~\ud55c \uccb4\ud558\ub2e4, \ud749\ub0b4\ub0b4\ub2e4",def:"to copy its actions or characteristics",unit:24,opts:["defect", "simulate", "meteorology", "penetrate"]},
    {w:"propulsion",m:"\ucd94\uc9c4, \ucd94\uc9c4\ub825",def:"the force that moves something forward",unit:24,opts:["innovative", "electromagnetic", "propulsion", "penetrate"]},
    {w:"accelerate",m:"\uac00\uc18d\ud558\ub2e4",def:"to increase in speed",unit:24,opts:["accelerate", "anew", "spur", "defect"]},
    {w:"meteorology",m:"\uae30\uc0c1\ud559",def:"the science that studies the weather",unit:24,opts:["anew", "simulate", "meteorological", "meteorology"]},
    {w:"ingenious",m:"\uae30\ubc1c\ud55c",def:"very smart",unit:24,opts:["ingenious", "propulsion", "launch", "stimulate"]},
  ],
  "eew6_25": [
    {w:"zip",m:"~\uc744 \uc9c0\ud37c\ub85c \uc7a0\uadf8\ub2e4",def:"to close it with a zipper",unit:25,opts:["beforehand", "deteriorate", "zip", "centigrade"]},
    {w:"manor",m:"\uc601\uc8fc\uc758 \uc800\ud0dd",def:"a large house with many rooms",unit:25,opts:["beforehand", "manor", "exterior", "hearty"]},
    {w:"exterior",m:"\uc678\ubd80",def:"the outside surface of something",unit:25,opts:["exterior", "centigrade", "monastery", "degree"]},
    {w:"centigrade",m:"\ubc31\ubd84\ub3c4\uc758, \uc12d\uc528\uc758",def:"same as the temperature in Celsius",unit:25,opts:["outstretched", "centigrade", "zip", "monastery"]},
    {w:"outstretched",m:"\uc8fd \ubed7\uc740",def:"extended to its full length",unit:25,opts:["hospitable", "outstretched", "hearty", "monastery"]},
    {w:"deteriorate",m:"\uc545\ud654\ub418\ub2e4",def:"to become steadily worse",unit:25,opts:["degree", "deteriorate", "blurred", "outstretched"]},
    {w:"blurred",m:"\ud750\ub9bf\ud55c",def:"not seen clearly",unit:25,opts:["beforehand", "condense", "zip", "blurred"]},
    {w:"beforehand",m:"\uc0ac\uc804\uc5d0",def:"done in advance",unit:25,opts:["monastery", "beforehand", "hospitable", "deteriorate"]},
    {w:"hospitable",m:"\ud638\uc758\uc801\uc778",def:"friendly to strangers",unit:25,opts:["monastery", "beforehand", "zip", "hospitable"]},
    {w:"degree",m:"(\uc628\ub3c4 \ub2e8\uc704\uc778) \ub3c4",def:"a unit for measuring temperature",unit:25,opts:["degree", "hospitable", "blurred", "manor"]},
    {w:"chatter",m:"\uc218\ub2e4\ub97c \ub5a8\ub2e4",def:"to talk quickly about unimportant things",unit:25,opts:["chatter", "manor", "exterior", "blurred"]},
    {w:"monastery",m:"\uc218\ub3c4\uc6d0",def:"a building in which monks live",unit:25,opts:["zip", "monastery", "hearty", "condense"]},
    {w:"hearty",m:"(\ub9c8\uc74c\uc774) \ub530\ub73b\ud55c",def:"loud and happy",unit:25,opts:["exterior", "hearty", "zip", "blurred"]},
    {w:"condense",m:"(\uae30\uccb4\uac00) \uc751\uacb0\ub418\ub2e4",def:"to make it a liquid",unit:25,opts:["hearty", "chatter", "condense", "blurred"]},
  ],
  "eew6_26": [
    {w:"secrecy",m:"\ube44\ubc00 \uc720\uc9c0",def:"the behavior of keeping things secret",unit:26,opts:["secrecy", "disseminate", "phenomenal", "outburst"]},
    {w:"phenomenal",m:"\uacbd\uc774\uc801\uc778, \uacbd\ud0c4\uc2a4\ub7ec\uc6b4",def:"unusually great",unit:26,opts:["infamous", "disseminate", "phenomenal", "secrecy"]},
    {w:"remorse",m:"\ud68c\ud55c",def:"a strong feeling of sadness and regret",unit:26,opts:["amend", "remorse", "infamous", "outburst"]},
    {w:"cosmopolitan",m:"\uc138\uacc4\uc801\uc778",def:"full of people from many different places.",unit:26,opts:["flatter", "secrecy", "cosmopolitan", "constitution"]},
    {w:"constitution",m:"\ud5cc\ubc95",def:"a document of principles for a government.",unit:26,opts:["secrecy", "abolish", "constitution", "infamous"]},
    {w:"outburst",m:"(\uac10\uc815\uc758) \ud3ed\ubc1c",def:"a sudden, strong expression of an emotion",unit:26,opts:["constitution", "outburst", "amend", "phenomenal"]},
    {w:"flatter",m:"\uc544\ucca8\ud558\ub2e4",def:"to praise them in an effort to please them.",unit:26,opts:["abolish", "secrecy", "cosmopolitan", "flatter"]},
    {w:"amend",m:"\uc218\uc815\ud558\ub2e4",def:"to change it to improve or make it accurate",unit:26,opts:["amend", "cosmopolitan", "constitution", "secrecy"]},
    {w:"disseminate",m:"(\uc815\ubcf4, \uc9c0\uc2dd \ub4f1\uc744) \ud37c\ub728\ub9ac\ub2e4",def:"to distribute it",unit:26,opts:["cosmopolitan", "disseminate", "constitution", "outburst"]},
    {w:"infamous",m:"\uc545\uba85 \ub192\uc740",def:"well known for something bad.",unit:26,opts:["outburst", "cosmopolitan", "disseminate", "infamous"]},
    {w:"abolish",m:"\ud3d0\uc9c0\ud558\ub2e4",def:"to put an end to it, such as a system or law",unit:26,opts:["abolish", "phenomenal", "remorse", "amend"]},
  ],
  "eew6_27": [
    {w:"inclusive",m:"\ud3ed\ub113\uc740, \ud3ec\uad04\uc801\uc778",def:"open to all groups and people in society",unit:27,opts:["prosecute", "delete", "ethnic", "inclusive"]},
    {w:"exclude",m:"\uc81c\uc678\ud558\ub2e4",def:"to not accept them into a group",unit:27,opts:["linguistic", "ethnic", "monolingual", "exclude"]},
    {w:"ethnic",m:"\ubbfc\uc871\uc758",def:"related to a group with a similar culture",unit:27,opts:["earnest", "solemn", "prosecute", "ethnic"]},
    {w:"imperial",m:"\uc81c\uad6d\uc758, \ud669\uc81c\uc758",def:"related to an empire",unit:27,opts:["imperial", "legislature", "ethnic", "monolingual"]},
    {w:"delete",m:"\uc0ad\uc81c\ud558\ub2e4",def:"to remove or erase written material",unit:27,opts:["solemn", "delete", "ethnic", "earnest"]},
    {w:"prosecute",m:"\uae30\uc18c\ud558\ub2e4",def:"to take legal action against them",unit:27,opts:["imperial", "prosecute", "ethnic", "earnest"]},
    {w:"firsthand",m:"\uc9c1\uc811, \ubc14\ub85c",def:"from an original source",unit:27,opts:["delete", "fluent", "firsthand", "solemn"]},
    {w:"legislature",m:"\uc785\ubc95\ubd80",def:"the section of a government that makes laws",unit:27,opts:["exclude", "legislature", "inclusive", "fluent"]},
    {w:"fluent",m:"\uc720\ucc3d\ud55c",def:"able to speak it very well",unit:27,opts:["monolingual", "imperial", "legislature", "fluent"]},
    {w:"earnest",m:"\uc131\uc2e4\ud55c",def:"honest",unit:27,opts:["earnest", "legislature", "solemn", "monolingual"]},
    {w:"monolingual",m:"\ud558\ub098\uc758 \uc5b8\uc5b4\ub97c \uc0ac\uc6a9\ud558\ub294",def:"speak only one language",unit:27,opts:["inclusive", "solemn", "exclude", "monolingual"]},
    {w:"linguistic",m:"\uc5b8\uc5b4\uc801\uc778",def:"concerned with language",unit:27,opts:["imperial", "linguistic", "exclude", "prosecute"]},
    {w:"solemn",m:"\uce68\ud1b5\ud55c, \uadfc\uc5c4\ud55c",def:"serious and honest",unit:27,opts:["legislature", "solemn", "monolingual", "fluent"]},
  ],
  "eew6_28": [
    {w:"depot",m:"(\ub300\uaddc\ubaa8) \ucc3d\uace0",def:"a bus or train station",unit:28,opts:["inherent", "intimidate", "depot", "spit"]},
    {w:"moist",m:"\ucd09\ucd09\ud55c",def:"slightly wet",unit:28,opts:["sprint", "moist", "constrain", "depot"]},
    {w:"sprint",m:"\uc804\ub825 \uc9c8\uc8fc\ud558\ub2e4",def:"to run very fast over a short distance",unit:28,opts:["sprint", "depot", "intimidate", "guts"]},
    {w:"spit",m:"\ubc49\ub2e4",def:"to force liquid from one\u2019s mouth",unit:28,opts:["intimidate", "spit", "inherent", "moist"]},
    {w:"nope",m:"\uc544\ub2c8",def:"an informal way of saying \u201cno.\u201d",unit:28,opts:["stunt", "nope", "yawn", "moist"]},
    {w:"constrain",m:"\uc81c\uc57d\ud558\ub2e4",def:"to limit its development",unit:28,opts:["spit", "sprint", "yawn", "constrain"]},
    {w:"intimidate",m:"(\uc2dc\ud0a4\ub294 \ub300\ub85c \ud558\ub3c4\ub85d) \uac81\uc744 \uc8fc\ub2e4",def:"to frighten others",unit:28,opts:["stunt", "sprint", "intimidate", "nope"]},
    {w:"guts",m:"\ub0b4\uc7a5",def:"all the organs inside a person or animal",unit:28,opts:["nope", "guts", "moist", "spit"]},
    {w:"stunt",m:"\uace1\uc608, \ubb18\uae30",def:"respectful of others\u2019 rights and beliefs",unit:28,opts:["guts", "depot", "yawn", "stunt"]},
    {w:"yawn",m:"\ud558\ud488\ud558\ub2e4",def:"to open one\u2019s mouth wide and breathe in air",unit:28,opts:["yawn", "sprint", "moist", "depot"]},
    {w:"inherent",m:"\ub0b4\uc7ac\ud558\ub294",def:"a natural part of something else",unit:28,opts:["inherent", "stunt", "nope", "guts"]},
    {w:"restrain",m:"(\ubb3c\ub9ac\ub825\uc744 \ub3d9\uc6d0\ud558\uc5ec) \uc800\uc9c0\ud558\ub2e4",def:"to use physical strength to stop them",unit:28,opts:["intimidate", "yawn", "restrain", "guts"]},
  ],
  "eew6_29": [
    {w:"foul",m:"\ub354\ub7ec\uc6b4, \uc545\ucde8 \ub098\ub294",def:"very unpleasant",unit:29,opts:["erect", "allege", "mansion", "foul"]},
    {w:"assemble",m:"\ubaa8\uc73c\ub2e4",def:"to get together in one place.",unit:29,opts:["renovate", "mansion", "assemble", "adjoining"]},
    {w:"allege",m:"(\uc99d\uac70 \uc5c6\uc774) \ud610\uc758\ub97c \uc81c\uae30\ud558\ub2e4",def:"to say that it is true without offering proof",unit:29,opts:["outnumber", "allege", "assemble", "foul"]},
    {w:"heighten",m:"(\uac10\uc815, \ud6a8\uacfc\uac00) \uace0\uc870\ub418\ub2e4",def:"to increase the intensity of it",unit:29,opts:["adjoining", "allege", "renovate", "heighten"]},
    {w:"revise",m:"\uac1c\uc815\ud558\ub2e4",def:"to change it, or update it to make it better",unit:29,opts:["revise", "outnumber", "foul", "heighten"]},
    {w:"adjoining",m:"\uc11c\ub85c \uc811\ud55c",def:"next to or joined with a building or room",unit:29,opts:["allege", "erect", "outnumber", "adjoining"]},
    {w:"outnumber",m:"\uc218\uc801\uc73c\ub85c \uc6b0\uc138\ud558\ub2e4",def:"to have a greater number than it",unit:29,opts:["renovate", "mansion", "outnumber", "erect"]},
    {w:"erect",m:"\uac74\ub9bd\ud558\ub2e4",def:"to build it",unit:29,opts:["foul", "erect", "revise", "heighten"]},
    {w:"overjoyed",m:"\ub9e4\uc6b0 \uae30\ubed0\ud558\ub294",def:"extremely happy",unit:29,opts:["foul", "outnumber", "assemble", "overjoyed"]},
    {w:"renovate",m:"\uac1c\uc870\ud558\ub2e4",def:"to build new structures on it",unit:29,opts:["renovate", "outnumber", "erect", "overjoyed"]},
    {w:"mansion",m:"\ub300\uc800\ud0dd",def:"a large and expensive home",unit:29,opts:["outnumber", "mansion", "overjoyed", "foul"]},
  ],
  "eew6_30": [
    {w:"fulfill",m:"\ucda9\uc871\ud558\ub2e4",def:"to achieve or finish it.",unit:30,opts:["shortcut", "pier", "bulk", "fulfill"]},
    {w:"dual",m:"\uc774\uc911\uc758",def:"two parts",unit:30,opts:["comprise", "fulfill", "tilt", "dual"]},
    {w:"bulk",m:"\ud070 \uaddc\ubaa8, \uc591",def:"its size",unit:30,opts:["dual", "bulk", "grove", "tilt"]},
    {w:"shortcut",m:"\uc9c0\ub984\uae38",def:"a route that is shorter than the main route.",unit:30,opts:["grove", "bulk", "thermometer", "shortcut"]},
    {w:"pier",m:"\ubd80\ub450",def:"a structure that extends into a body of water.",unit:30,opts:["pier", "outweigh", "comprise", "shortcut"]},
    {w:"analogous",m:"\uc720\uc0ac\ud55c",def:"like it in certain ways",unit:30,opts:["tilt", "depict", "analogous", "bulk"]},
    {w:"grove",m:"(\uc791\uc740) \uc232, \uc218\ud480",def:"a small group of trees",unit:30,opts:["bulk", "depict", "pier", "grove"]},
    {w:"thermometer",m:"\uc628\ub3c4\uacc4",def:"a device that measures temperature",unit:30,opts:["thermometer", "tilt", "shortcut", "outweigh"]},
    {w:"tilt",m:"\uae30\uc6b8\ub2e4",def:"to tip it into a sloping position",unit:30,opts:["analogous", "tilt", "comprise", "whereabouts"]},
    {w:"comprise",m:"~\ub85c \uad6c\uc131\ub418\ub2e4",def:"to consists of or is made up of it",unit:30,opts:["dual", "comprise", "depict", "pier"]},
    {w:"outweigh",m:"~\ubcf4\ub2e4 \ub6f0\uc5b4\ub098\ub2e4",def:"to exceed it in value, amount, or importance",unit:30,opts:["outweigh", "analogous", "shortcut", "whereabouts"]},
    {w:"depict",m:"(\uadf8\ub9bc\uc73c\ub85c) \uadf8\ub9ac\ub2e4, \ubb18\uc0ac\ud558\ub2e4",def:"to show or portray it",unit:30,opts:["depict", "dual", "grove", "whereabouts"]},
    {w:"whereabouts",m:"\uc18c\uc7ac, \ud589\ubc29",def:"the place where they are",unit:30,opts:["shortcut", "bulk", "analogous", "whereabouts"]},
  ],
};

// Wonderful World Prime L1/L2/L3
const WWP_WORDS_DB = {
  "wwp1_1": [
    {w:"same",m:"\uac19\uc740",def:"not different; exactly like something",unit:1,opts:["same", "tell", "technology", "different"]},
    {w:"tell",m:"\uad6c\ubcc4\ud558\ub2e4",def:"to see the difference between two people or things",unit:1,opts:["tell", "different", "same", "technology"]},
    {w:"different",m:"\ub2e4\ub978",def:"not the same; unlike",unit:1,opts:["crazy", "same", "different", "quiet"]},
    {w:"loud",m:"\uc2dc\ub044\ub7ec\uc6b4",def:"making a lot of noise",unit:1,opts:["different", "technology", "tell", "loud"]},
    {w:"silly",m:"\uc5c9\ub6b1\ud55c",def:"playful and funny",unit:1,opts:["quiet", "silly", "crazy", "technology"]},
    {w:"quiet",m:"\uc870\uc6a9\ud55c",def:"making no noise",unit:1,opts:["quiet", "tell", "loud", "same"]},
    {w:"crazy",m:"\uc5f4\uad11\ud558\ub294",def:"very interested in something or someone",unit:1,opts:["technology", "quiet", "crazy", "different"]},
    {w:"technology",m:"\uacfc\ud559 \uae30\uc220",def:"advanced scientific knowledge",unit:1,opts:["technology", "different", "quiet", "crazy"]},
  ],
  "wwp1_2": [
    {w:"amazing",m:"\ub180\ub77c\uc6b4",def:"causing great surprise",unit:2,opts:["parent", "the antarctic", "amazing", "come out"]},
    {w:"the antarctic",m:"\ub0a8\uadf9",def:"the land near the South Pole",unit:2,opts:["keep warm", "parent", "chick", "the antarctic"]},
    {w:"parent",m:"\uc544\ubc84\uc9c0 \ub610\ub294 \uc5b4\uba38\ub2c8",def:"a mother or a father",unit:2,opts:["amazing", "come out", "keep warm", "parent"]},
    {w:"keep warm",m:"\ub530\ub73b\uc774 \uac04\uc9c1\ud558\ub2e4",def:"to not lose heat",unit:2,opts:["keep warm", "stay", "amazing", "the antarctic"]},
    {w:"stay",m:"\uba38\ubb34\ub974\ub2e4",def:"to continue to be in the same place",unit:2,opts:["stay", "keep warm", "come out", "leave"]},
    {w:"chick",m:"\uc0c8\ub07c \uc0c8",def:"a baby bird",unit:2,opts:["parent", "leave", "chick", "come out"]},
    {w:"come out",m:"\ub098\uc624\ub2e4",def:"to appear in the open",unit:2,opts:["parent", "chick", "keep warm", "come out"]},
    {w:"leave",m:"\ub5a0\ub098\ub2e4",def:"to go away from",unit:2,opts:["leave", "chick", "keep warm", "stay"]},
  ],
  "wwp1_3": [
    {w:"cool",m:"\uba4b\uc9c4",def:"very interesting or attractive",unit:3,opts:["funny", "cool", "stupid", "beautiful"]},
    {w:"together",m:"\ud568\uaed8",def:"with each other",unit:3,opts:["stupid", "beautiful", "funny", "together"]},
    {w:"clever",m:"\ub611\ub611\ud55c",def:"intelligent; smart",unit:3,opts:["funny", "beautiful", "stupid", "clever"]},
    {w:"funny",m:"\uc6c3\uae30\ub294",def:"causing laughter",unit:3,opts:["funny", "stupid", "clever", "birthday"]},
    {w:"birthday",m:"\uc0dd\uc77c",def:"the day of the year when someone was born",unit:3,opts:["stupid", "cool", "birthday", "clever"]},
    {w:"blond",m:"(\ubaa8\ubc1c\uc774) \uae08\ubc1c\uc778",def:"(of hair) yellow or golden colored",unit:3,opts:["blond", "birthday", "together", "stupid"]},
    {w:"beautiful",m:"\uc544\ub984\ub2e4\uc6b4",def:"having beauty",unit:3,opts:["blond", "cool", "beautiful", "clever"]},
    {w:"stupid",m:"\uc5b4\ub9ac\uc11d\uc740",def:"showing a lack of good sense",unit:3,opts:["stupid", "together", "birthday", "funny"]},
  ],
  "wwp1_4": [
    {w:"thing",m:"\ubb3c\uac74",def:"an object",unit:4,opts:["thing", "typewriter", "video game", "scared"]},
    {w:"puzzle",m:"\ud37c\uc990",def:"a game made of many pieces that can be fit together",unit:4,opts:["video game", "piece", "puzzle", "touch"]},
    {w:"piece",m:"\uc870\uac01",def:"a part separated from a larger part",unit:4,opts:["piece", "thing", "touch", "strange"]},
    {w:"video game",m:"\ube44\ub514\uc624 \uac8c\uc784",def:"an electronic game played on a screen",unit:4,opts:["strange", "touch", "video game", "typewriter"]},
    {w:"typewriter",m:"\ud0c0\uc790\uae30",def:"a machine for typing letters",unit:4,opts:["scared", "puzzle", "touch", "typewriter"]},
    {w:"strange",m:"\ub0af\uc120",def:"unusual; surprising",unit:4,opts:["thing", "typewriter", "strange", "scared"]},
    {w:"touch",m:"\ub9cc\uc9c0\ub2e4",def:"to put your hand on something",unit:4,opts:["touch", "thing", "video game", "strange"]},
    {w:"scared",m:"\ubb34\uc11c\uc6cc\ud558\ub294",def:"nervous or frightened",unit:4,opts:["thing", "scared", "video game", "typewriter"]},
  ],
  "wwp1_5": [
    {w:"present",m:"\uc120\ubb3c",def:"a gift",unit:5,opts:["moving", "present", "globe", "surfboard"]},
    {w:"spider",m:"\uac70\ubbf8",def:"a small creature that has eight legs",unit:5,opts:["surfboard", "present", "globe", "spider"]},
    {w:"moving",m:"\uc6c0\uc9c1\uc774\ub294",def:"changing position or place",unit:5,opts:["country", "moving", "surfboard", "coding"]},
    {w:"globe",m:"\uc9c0\uad6c\ubcf8",def:"a round ball with a map of the world on it",unit:5,opts:["coding", "surfboard", "present", "globe"]},
    {w:"country",m:"\uad6d\uac00",def:"an area of land that has its own government",unit:5,opts:["exciting", "coding", "country", "spider"]},
    {w:"coding",m:"\ucf54\ub529",def:"the process of using a programming language to tell a computer what to do",unit:5,opts:["country", "present", "globe", "coding"]},
    {w:"exciting",m:"\ud765\ubbf8\uc9c4\uc9c4\ud55c",def:"causing a feeling of interest and happiness",unit:5,opts:["country", "globe", "coding", "exciting"]},
    {w:"surfboard",m:"\uc11c\ud551 \ubcf4\ub4dc",def:"a long, light, narrow board for surfing",unit:5,opts:["present", "surfboard", "spider", "country"]},
  ],
  "wwp1_6": [
    {w:"comic book",m:"\ub9cc\ud654\ucc45",def:"a magazine that tells stories using pictures",unit:6,opts:["lesson", "violin", "have fun", "comic book"]},
    {w:"drawing",m:"\uadf8\ub9bc",def:"a picture drawn with a pencil, pen, etc.",unit:6,opts:["boat", "have fun", "drawing", "comic book"]},
    {w:"favorite",m:"\ub9e4\uc6b0 \uc88b\uc544\ud558\ub294",def:"most liked",unit:6,opts:["favorite", "boat", "have fun", "drawing"]},
    {w:"violin",m:"\ubc14\uc774\uc62c\ub9b0",def:"a musical instrument with strings",unit:6,opts:["boat", "violin", "drawing", "lesson"]},
    {w:"lesson",m:"\uc218\uc5c5",def:"a part of a course of instruction",unit:6,opts:["puppet", "lesson", "favorite", "drawing"]},
    {w:"boat",m:"\ubc30",def:"a vehicle that travels on water",unit:6,opts:["drawing", "violin", "favorite", "boat"]},
    {w:"puppet",m:"\uc190\uac00\ub77d \uc778\ud615",def:"a doll that is moved by putting a hand inside it",unit:6,opts:["lesson", "puppet", "violin", "favorite"]},
    {w:"have fun",m:"\uc990\uae30\ub2e4",def:"to have an enjoyable or amusing time",unit:6,opts:["violin", "lesson", "drawing", "have fun"]},
  ],
  "wwp1_7": [
    {w:"prize",m:"\uc0c1",def:"something given to the winner of a contest",unit:7,opts:["the arctic", "prize", "fitness center", "ceremony"]},
    {w:"ceremony",m:"\uc758\uc2dd",def:"an important social or religious event",unit:7,opts:["exercise", "school subject", "problem", "ceremony"]},
    {w:"the arctic",m:"\ubd81\uadf9",def:"the land near the North Pole",unit:7,opts:["prize", "solution", "the arctic", "ceremony"]},
    {w:"school subject",m:"\uad50\uacfc",def:"an area of knowledge studied in school",unit:7,opts:["fitness center", "ceremony", "solution", "school subject"]},
    {w:"solution",m:"\ud574\uacb0\ucc45",def:"a way of solving a problem; answer",unit:7,opts:["solution", "problem", "ceremony", "exercise"]},
    {w:"problem",m:"\ubb38\uc81c",def:"something difficult to deal with",unit:7,opts:["fitness center", "problem", "the arctic", "prize"]},
    {w:"fitness center",m:"\ud5ec\uc2a4\uc7a5",def:"a place in a building that people can exercise",unit:7,opts:["prize", "ceremony", "solution", "fitness center"]},
    {w:"exercise",m:"\uc6b4\ub3d9\ud558\ub2e4",def:"to do sports in order to become healthy",unit:7,opts:["fitness center", "solution", "exercise", "the arctic"]},
  ],
  "wwp1_8": [
    {w:"cap",m:"(\uc55e\ubd80\ubd84\uc5d0 \ucc59\uc774 \ub2ec\ub9b0) \ubaa8\uc790",def:"a small, soft hat that often has a hard curved part",unit:8,opts:["language", "uniform", "cap", "spaghetti"]},
    {w:"hat",m:"\ubaa8\uc790",def:"a head covering, often with a brim",unit:8,opts:["musical instrument", "helmet", "hat", "language"]},
    {w:"helmet",m:"\ud5ec\uba67",def:"a strong, hard hat that protects the head",unit:8,opts:["spaghetti", "language", "helmet", "musical instrument"]},
    {w:"wear",m:"\uc785\uace0 \uc788\ub2e4",def:"to have something on your body",unit:8,opts:["cap", "musical instrument", "wear", "language"]},
    {w:"uniform",m:"\uad50\ubcf5",def:"a special set of clothes worn by all the members of a group",unit:8,opts:["helmet", "hat", "uniform", "cap"]},
    {w:"spaghetti",m:"\uc2a4\ud30c\uac8c\ud2f0",def:"pasta in the shape of long, thin strings",unit:8,opts:["cap", "uniform", "hat", "spaghetti"]},
    {w:"musical instrument",m:"\uc545\uae30",def:"something that you use for playing music",unit:8,opts:["language", "musical instrument", "uniform", "cap"]},
    {w:"language",m:"\uc5b8\uc5b4",def:"the system of words that people use to express thoughts",unit:8,opts:["cap", "musical instrument", "uniform", "language"]},
  ],
  "wwp1_9": [
    {w:"boarding school",m:"\uae30\uc219\ud559\uad50",def:"a school where students live and study",unit:9,opts:["take care of", "arts and crafts", "break", "boarding school"]},
    {w:"learn",m:"\ubc30\uc6b0\ub2e4",def:"to gain knowledge by studying",unit:9,opts:["vegetable", "learn", "shower", "take care of"]},
    {w:"vegetable",m:"\ucc44\uc18c",def:"a plant that is eaten as food",unit:9,opts:["take care of", "vegetable", "jewelry", "learn"]},
    {w:"take care of",m:"~\uc744 \ub3cc\ubcf4\ub2e4",def:"to look after something or someone",unit:9,opts:["take care of", "break", "shower", "learn"]},
    {w:"jewelry",m:"\uc7a5\uc2e0\uad6c",def:"decorative things such as rings and necklaces",unit:9,opts:["take care of", "boarding school", "jewelry", "arts and crafts"]},
    {w:"arts and crafts",m:"\uacf5\uc608",def:"the activity of making useful and beautiful things",unit:9,opts:["arts and crafts", "take care of", "break", "vegetable"]},
    {w:"shower",m:"\uc0e4\uc6cc\ub97c \ud558\ub2e4",def:"to wash your body in a shower",unit:9,opts:["shower", "break", "boarding school", "jewelry"]},
    {w:"break",m:"\uc26c\ub294 \uc2dc\uac04",def:"the time for students to take a rest",unit:9,opts:["arts and crafts", "jewelry", "take care of", "break"]},
  ],
  "wwp1_10": [
    {w:"hall",m:"\ubcf5\ub3c4",def:"a narrow passageway in a building",unit:10,opts:["wait", "hall", "festival", "kite"]},
    {w:"kite",m:"\uc5f0",def:"a toy that is flown in the air",unit:10,opts:["winner", "kite", "wait", "competition"]},
    {w:"colorful",m:"(\uc0c9\uc774) \ub2e4\ucc44\ub85c\uc6b4",def:"having a lot of different colors",unit:10,opts:["colorful", "kite", "winner", "festival"]},
    {w:"festival",m:"\ucd95\uc81c",def:"a special time when people celebrate something",unit:10,opts:["colorful", "winner", "wait", "festival"]},
    {w:"wait",m:"\uae30\ub2e4\ub9ac\ub2e4",def:"to stay in a place until something happens",unit:10,opts:["kite", "colorful", "competition", "wait"]},
    {w:"competition",m:"\ub300\ud68c",def:"a contest in which people compete with each other",unit:10,opts:["wait", "winner", "competition", "colorful"]},
    {w:"winner",m:"\uc6b0\uc2b9\uc790",def:"someone that wins a contest",unit:10,opts:["colorful", "wait", "congratulations", "winner"]},
    {w:"congratulations",m:"\ucd95\ud558(\uc778\uc0ac)",def:"a message congratulating someone",unit:10,opts:["colorful", "congratulations", "kite", "festival"]},
  ],
  "wwp1_11": [
    {w:"popular",m:"\uc778\uae30 \uc788\ub294",def:"liked by many people",unit:11,opts:["mirror", "amusement\npark", "roller coaster", "popular"]},
    {w:"amusement\npark",m:"\ub180\uc774\uacf5\uc6d0",def:"a place with many games and rides",unit:11,opts:["popular", "amusement\npark", "tourist", "huge"]},
    {w:"tourist",m:"\uad00\uad11\uac1d",def:"someone who travels to a place for pleasure",unit:11,opts:["tourist", "ride", "popular", "entrance"]},
    {w:"entrance",m:"\uc785\uad6c",def:"a door or gate",unit:11,opts:["ride", "tourist", "huge", "entrance"]},
    {w:"huge",m:"\uac70\ub300\ud55c",def:"very great in size",unit:11,opts:["amusement\npark", "tourist", "huge", "ride"]},
    {w:"ride",m:"\ub180\uc774\uae30\uad6c",def:"a large machine at an amusement park people ride for fun",unit:11,opts:["popular", "ride", "huge", "mirror"]},
    {w:"roller coaster",m:"\ub864\ub7ec\ucf54\uc2a4\ud130",def:"a fast ride that is like a small train at an amusement park",unit:11,opts:["roller coaster", "popular", "entrance", "ride"]},
    {w:"mirror",m:"\uac70\uc6b8",def:"a piece of glass that you can see yourself in",unit:11,opts:["roller coaster", "ride", "tourist", "mirror"]},
  ],
  "wwp1_12": [
    {w:"meal",m:"\uc2dd\uc0ac",def:"the food eaten at one time",unit:12,opts:["go bowling", "contest", "visit", "meal"]},
    {w:"bookstore",m:"\uc11c\uc810",def:"a store that sells books",unit:12,opts:["bookstore", "meal", "contest", "fantastic"]},
    {w:"help",m:"\ub3d5\ub2e4",def:"to assist someone",unit:12,opts:["help", "meal", "visit", "contest"]},
    {w:"go bowling",m:"\ubcfc\ub9c1\uc744 \uce58\ub7ec \uac00\ub2e4",def:"to go to play a bowling game",unit:12,opts:["bookstore", "meal", "go bowling", "water park"]},
    {w:"contest",m:"\ub300\ud68c",def:"an event in which people try to win",unit:12,opts:["water park", "visit", "contest", "help"]},
    {w:"fantastic",m:"\ud658\uc0c1\uc801\uc778",def:"extremely good",unit:12,opts:["water park", "meal", "help", "fantastic"]},
    {w:"water park",m:"\uc6cc\ud130\ud30c\ud06c",def:"a place where people have fun or swim in water",unit:12,opts:["help", "contest", "water park", "visit"]},
    {w:"visit",m:"\ubc29\ubb38\ud558\ub2e4",def:"to go and spend time in a place",unit:12,opts:["visit", "fantastic", "water park", "go bowling"]},
  ],
  "wwp2_1": [
    {w:"celebration",m:"\uae30\ub150 \ud589\uc0ac",def:"a party or a special event",unit:1,opts:["share", "bright", "celebration", "cover"]},
    {w:"stall",m:"\uac00\ud310\ub300",def:"a small shop with an open front",unit:1,opts:["celebration", "stall", "share", "cover"]},
    {w:"powder",m:"\uac00\ub8e8",def:"a soft, dry substance that looks like dust or sand",unit:1,opts:["powder", "throw", "stall", "share"]},
    {w:"bonfire",m:"\ubaa8\ub2e5\ubd88",def:"a large outdoor fire",unit:1,opts:["throw", "bonfire", "share", "celebration"]},
    {w:"throw",m:"\ub358\uc9c0\ub2e4",def:"to use your hand to send something through the air",unit:1,opts:["cover", "throw", "bright", "celebration"]},
    {w:"cover",m:"\ub36e\ub2e4",def:"to be all over the surface of something",unit:1,opts:["cover", "bright", "powder", "throw"]},
    {w:"bright",m:"\ubc1d\uc740",def:"having very light and strong colors",unit:1,opts:["stall", "cover", "bright", "powder"]},
    {w:"share",m:"\ub098\ub204\ub2e4",def:"to have something with other people",unit:1,opts:["bright", "share", "throw", "celebration"]},
  ],
  "wwp2_2": [
    {w:"carnival",m:"\ucd95\uc81c",def:"a public festival",unit:2,opts:["lucky", "parade", "carnival", "costume"]},
    {w:"parade",m:"\ud37c\ub808\uc774\ub4dc",def:"a group of people going in the same direction to celebrate an event",unit:2,opts:["parade", "lucky", "mascot", "sculpture"]},
    {w:"costume",m:"\uc758\uc0c1",def:"a set of clothes worn to look like someone else",unit:2,opts:["fireworks", "costume", "lucky", "preparation"]},
    {w:"fireworks",m:"\ubd88\uaf43\ub180\uc774",def:"a display of colored lights and noise in the sky",unit:2,opts:["carnival", "lucky", "costume", "fireworks"]},
    {w:"preparation",m:"\uc900\ube44",def:"things to make something ready",unit:2,opts:["preparation", "sculpture", "costume", "mascot"]},
    {w:"sculpture",m:"\uc870\uac01\ud488",def:"an artwork made by carving or shaping ice, clay, stone, etc.",unit:2,opts:["lucky", "costume", "parade", "sculpture"]},
    {w:"mascot",m:"\ub9c8\uc2a4\ucf54\ud2b8",def:"an animal or an object used as a symbol",unit:2,opts:["mascot", "costume", "preparation", "parade"]},
    {w:"lucky",m:"\uc6b4\uc774 \uc88b\uc740",def:"having good luck",unit:2,opts:["mascot", "lucky", "carnival", "fireworks"]},
  ],
  "wwp2_3": [
    {w:"tradition",m:"\uc804\ud1b5",def:"an old belief and custom",unit:3,opts:["tradition", "wish", "drop", "scoop"]},
    {w:"midnight",m:"\uc790\uc815",def:"twelve o\u2019clock at night",unit:3,opts:["suitcase", "tradition", "drop", "midnight"]},
    {w:"wish",m:"\uc18c\ub9dd",def:"a desire for something to happen",unit:3,opts:["suitcase", "scoop", "block", "wish"]},
    {w:"block",m:"(\ub3c4\uc2dc\uc758) \ube14\ub85d",def:"an area surrounded by four streets",unit:3,opts:["tradition", "scoop", "block", "drop"]},
    {w:"empty",m:"\ube44\uc5b4 \uc788\ub294",def:"containing nothing",unit:3,opts:["block", "wish", "empty", "midnight"]},
    {w:"suitcase",m:"\uc5ec\ud589 \uac00\ubc29",def:"a large case used for carrying clothes and other things",unit:3,opts:["tradition", "wish", "suitcase", "drop"]},
    {w:"drop",m:"\ub5a8\uc5b4\ub728\ub9ac\ub2e4",def:"to make something fall",unit:3,opts:["wish", "empty", "midnight", "drop"]},
    {w:"scoop",m:"\ud55c \uc21f\uac08",def:"an amount of food picked up by a scoop",unit:3,opts:["suitcase", "drop", "scoop", "tradition"]},
  ],
  "wwp2_4": [
    {w:"serve",m:"\uc81c\uacf5\ud558\ub2e4",def:"to give food or drink to someone",unit:4,opts:["order", "check", "serve", "waiter"]},
    {w:"order",m:"\uc8fc\ubb38\ud558\ub2e4",def:"to request food or drink",unit:4,opts:["check", "menu", "serve", "order"]},
    {w:"menu",m:"\uba54\ub274",def:"a list of food served at a restaurant",unit:4,opts:["check", "menu", "serve", "waiter"]},
    {w:"waiter",m:"\uc885\uc5c5\uc6d0",def:"a man who serves food or drink to someone",unit:4,opts:["menu", "waiter", "serve", "favorite"]},
    {w:"check",m:"\uacc4\uc0b0\uc11c",def:"a bill for the food at a restaurant",unit:4,opts:["plate", "check", "order", "serve"]},
    {w:"plate",m:"\uc811\uc2dc",def:"a flat dish that is used for eating",unit:4,opts:["favorite", "menu", "serve", "plate"]},
    {w:"favorite",m:"\uac00\uc7a5 \uc88b\uc544\ud558\ub294",def:"most liked",unit:4,opts:["favorite", "check", "fast food", "order"]},
    {w:"fast food",m:"\ud328\uc2a4\ud2b8\ud478\ub4dc",def:"food that is quickly made and served",unit:4,opts:["waiter", "serve", "menu", "fast food"]},
  ],
  "wwp2_5": [
    {w:"knife",m:"\uce7c",def:"a tool with a sharp blade for cutting food",unit:5,opts:["skill", "pick up", "knife", "noodle"]},
    {w:"chopsticks",m:"\uc813\uac00\ub77d",def:"two thin sticks that you use to eat food",unit:5,opts:["chopsticks", "horn", "shell", "pick up"]},
    {w:"shell",m:"\uaecd\ub370\uae30",def:"the hard outer covering of an animal",unit:5,opts:["skill", "shell", "noodle", "horn"]},
    {w:"horn",m:"\ubfd4",def:"a hard pointed part that grows on the head of some animals",unit:5,opts:["bowl", "knife", "horn", "noodle"]},
    {w:"pick up",m:"\ub4e4\uc5b4\uc62c\ub9ac\ub2e4",def:"to lift something up",unit:5,opts:["horn", "skill", "chopsticks", "pick up"]},
    {w:"noodle",m:"\uba74",def:"a thin, long strip made from flour",unit:5,opts:["knife", "noodle", "shell", "pick up"]},
    {w:"bowl",m:"(\uc6b0\ubb35\ud55c) \uadf8\ub987",def:"a deep, round dish",unit:5,opts:["horn", "skill", "shell", "bowl"]},
    {w:"skill",m:"\uae30\uc220",def:"an ability to do something well",unit:5,opts:["chopsticks", "pick up", "skill", "knife"]},
  ],
  "wwp2_6": [
    {w:"national",m:"\uad6d\uac00\uc758; \uc804 \uad6d\ubbfc\uc758",def:"related to a country",unit:6,opts:["tasty", "national", "filling", "dish"]},
    {w:"dish",m:"\uc694\ub9ac",def:"a type of food cooked in a particular way",unit:6,opts:["dumpling", "fresh", "dish", "filling"]},
    {w:"dumpling",m:"\ub9cc\ub450",def:"a piece of food that is wrapped in dough and cooked",unit:6,opts:["dumpling", "national", "stick", "tasty"]},
    {w:"filling",m:"(\uc694\ub9ac\uc758) \uc18c",def:"a food mixture that is used to fill something",unit:6,opts:["spicy", "filling", "fresh", "tasty"]},
    {w:"stick",m:"\ub9c9\ub300\uae30",def:"a thin piece of wood",unit:6,opts:["spicy", "stick", "fresh", "tasty"]},
    {w:"spicy",m:"\ub9e4\uc6b4",def:"having a strong taste from spices",unit:6,opts:["dish", "national", "spicy", "filling"]},
    {w:"tasty",m:"\ub9db\uc788\ub294",def:"having a good flavor",unit:6,opts:["dumpling", "stick", "tasty", "fresh"]},
    {w:"fresh",m:"\uc2e0\uc120\ud55c",def:"newly made; not old",unit:6,opts:["national", "fresh", "tasty", "dumpling"]},
  ],
  "wwp2_7": [
    {w:"during",m:"~\ub3d9\uc548",def:"throughout the entire time of an event, period, etc.",unit:7,opts:["finish line", "cross", "during", "racer"]},
    {w:"enter",m:"\ucc38\uac00\ud558\ub2e4",def:"to take part in a race, competition, etc.",unit:7,opts:["racer", "enter", "impossible", "simultaneously"]},
    {w:"mass",m:"\ub300\uaddc\ubaa8\uc758",def:"involving a large number of people",unit:7,opts:["mass", "finish line", "racer", "during"]},
    {w:"racer",m:"\uacbd\uc8fc \ucc38\uac00\uc790",def:"a person that races",unit:7,opts:["enter", "cross", "during", "racer"]},
    {w:"simultaneously",m:"\ub3d9\uc2dc\uc5d0",def:"happening at the same time",unit:7,opts:["mass", "simultaneously", "during", "impossible"]},
    {w:"impossible",m:"\ubd88\uac00\ub2a5\ud55c",def:"unable to be done or to happen",unit:7,opts:["racer", "simultaneously", "cross", "impossible"]},
    {w:"cross",m:"\uac74\ub108\ub2e4",def:"to go from one side to the other",unit:7,opts:["during", "simultaneously", "cross", "racer"]},
    {w:"finish line",m:"\uacb0\uc2b9\uc120",def:"a line that marks the end of a race",unit:7,opts:["impossible", "during", "enter", "finish line"]},
  ],
  "wwp2_8": [
    {w:"mind",m:"\uc815\uc2e0",def:"the part of a person that thinks and understands",unit:8,opts:["mind", "fight", "confident", "movement"]},
    {w:"movement",m:"\uc6c0\uc9c1\uc784",def:"an act of moving the body",unit:8,opts:["get ready", "train", "confident", "movement"]},
    {w:"fight",m:"\uaca8\ub8e8\ub2e4",def:"to participate in a match",unit:8,opts:["confident", "get ready", "give up", "fight"]},
    {w:"train",m:"\ud6c8\ub828\ud558\ub2e4",def:"to practice a sport regularly before a match",unit:8,opts:["train", "confident", "give up", "movement"]},
    {w:"get ready",m:"\uc900\ube44\ub97c \ud558\ub2e4",def:"to prepare for something",unit:8,opts:["confident", "mind", "get ready", "champion"]},
    {w:"champion",m:"\ucc54\ud53c\uc5b8",def:"someone that has won a contest",unit:8,opts:["get ready", "movement", "champion", "mind"]},
    {w:"give up",m:"\ud3ec\uae30\ud558\ub2e4",def:"to stop trying to do something",unit:8,opts:["mind", "train", "confident", "give up"]},
    {w:"confident",m:"\uc790\uc2e0\uac10 \uc788\ub294",def:"being certain of your abilities",unit:8,opts:["movement", "confident", "give up", "train"]},
  ],
  "wwp2_9": [
    {w:"junior",m:"\uc8fc\ub2c8\uc5b4\uc758",def:"younger in age",unit:9,opts:["competition", "skate", "difficult", "junior"]},
    {w:"moment",m:"\uc9c0\uae08",def:"the present time",unit:9,opts:["difficult", "moment", "skate", "practice"]},
    {w:"practice",m:"\uc5f0\uc2b5\ud558\ub2e4",def:"to do something repeatedly to improve your skill",unit:9,opts:["difficult", "practice", "competition", "skate"]},
    {w:"competition",m:"\ub300\ud68c",def:"an organized event that people try to win a prize",unit:9,opts:["difficult", "skate", "competition", "practice"]},
    {w:"coach",m:"\ucf54\uce58",def:"a person who teaches athletes",unit:9,opts:["competition", "junior", "good luck", "coach"]},
    {w:"difficult",m:"\uc5b4\ub824\uc6b4",def:"not easy",unit:9,opts:["difficult", "moment", "competition", "junior"]},
    {w:"skate",m:"\uc2a4\ucf00\uc774\ud2b8\ub97c \ud0c0\ub2e4",def:"to move on skates",unit:9,opts:["skate", "good luck", "junior", "competition"]},
    {w:"good luck",m:"\ud589\uc6b4\uc744 \ube4c\ub2e4",def:"used to say that you hope someone will succeed",unit:9,opts:["good luck", "competition", "difficult", "practice"]},
  ],
  "wwp2_10": [
    {w:"cottage",m:"\uc791\uc740 \uc9d1",def:"a small house in the country",unit:10,opts:["balcony", "basement", "cottage", "lie"]},
    {w:"earthquake",m:"\uc9c0\uc9c4",def:"a shaking of the Earth\u2019s surface",unit:10,opts:["earthquake", "ladder", "floor", "balcony"]},
    {w:"flood",m:"\ud64d\uc218",def:"a large amount of water covering dry land",unit:10,opts:["flood", "cottage", "ladder", "earthquake"]},
    {w:"floor",m:"\uce35",def:"a level in a building",unit:10,opts:["flood", "earthquake", "basement", "floor"]},
    {w:"ladder",m:"\uc0ac\ub2e4\ub9ac",def:"a device used for climbing",unit:10,opts:["balcony", "ladder", "basement", "earthquake"]},
    {w:"basement",m:"\uc9c0\ud558\uce35",def:"the part of a building that is below the ground",unit:10,opts:["ladder", "cottage", "flood", "basement"]},
    {w:"balcony",m:"\ubc1c\ucf54\ub2c8",def:"a platform that is connected to the side of a building",unit:10,opts:["cottage", "flood", "ladder", "balcony"]},
    {w:"lie",m:"\ub215\ub2e4",def:"to be in a flat position on a surface",unit:10,opts:["basement", "cottage", "lie", "floor"]},
  ],
  "wwp2_11": [
    {w:"routine",m:"\uc77c\uacfc",def:"a regular way of doing things in a particular order",unit:11,opts:["space shuttle", "routine", "take a bath", "machine"]},
    {w:"relax",m:"\ud734\uc2dd\uc744 \ucde8\ud558\ub2e4",def:"to rest",unit:11,opts:["space shuttle", "machine", "relax", "package"]},
    {w:"take a bath",m:"\ubaa9\uc695\ud558\ub2e4",def:"to wash the body usually by sitting in a bathtub",unit:11,opts:["fasten", "take a bath", "package", "routine"]},
    {w:"float",m:"\ub5a0\ub2e4\ub2c8\ub2e4",def:"to move slowly in the air",unit:11,opts:["space shuttle", "relax", "float", "take a bath"]},
    {w:"package",m:"(\ud3ec\uc7a5\uc6a9) \uc0c1\uc790",def:"a wrapper or container that holds something",unit:11,opts:["take a bath", "space shuttle", "machine", "package"]},
    {w:"space shuttle",m:"\uc6b0\uc8fc \uc655\ubcf5\uc120",def:"a vehicle that goes into space and back to Earth",unit:11,opts:["fasten", "space shuttle", "float", "relax"]},
    {w:"machine",m:"\uae30\uacc4",def:"a device that uses electronic power to work",unit:11,opts:["float", "routine", "machine", "space shuttle"]},
    {w:"fasten",m:"\uace0\uc815\uc2dc\ud0a4\ub2e4",def:"to attach something firmly to another surface",unit:11,opts:["package", "routine", "fasten", "float"]},
  ],
  "wwp2_12": [
    {w:"lively",m:"\ud65c\uae30 \ub118\uce58\ub294",def:"full of movement or activity",unit:12,opts:["downtown", "lively", "attraction", "fantastic"]},
    {w:"fantastic",m:"\ud658\uc0c1\uc801\uc778",def:"extremely good",unit:12,opts:["ride", "lively", "church", "fantastic"]},
    {w:"downtown",m:"\uc2dc\ub0b4",def:"the main or central part of a city or town",unit:12,opts:["downtown", "indoor", "lively", "church"]},
    {w:"church",m:"\uad50\ud68c",def:"a building that Christians use for religious services",unit:12,opts:["church", "ride", "lively", "indoor"]},
    {w:"finished",m:"\uc644\uc131\ub41c",def:"entirely done or completed",unit:12,opts:["finished", "indoor", "ride", "church"]},
    {w:"attraction",m:"\uba85\uc18c",def:"a place that people visit for pleasure and interest",unit:12,opts:["fantastic", "ride", "indoor", "attraction"]},
    {w:"ride",m:"\uc5ec\uc815",def:"a usually short journey in or on a vehicle",unit:12,opts:["lively", "ride", "finished", "indoor"]},
    {w:"indoor",m:"\uc2e4\ub0b4\uc758",def:"inside a building",unit:12,opts:["attraction", "church", "lively", "indoor"]},
  ],
  "wwp3_1": [
    {w:"village",m:"\ub9c8\uc744",def:"a small town in the country",unit:1,opts:["town hall", "village", "ordinary", "crime"]},
    {w:"ordinary",m:"\ud3c9\ubc94\ud55c",def:"not different; usual",unit:1,opts:["bank", "bridge", "ordinary", "canal"]},
    {w:"town hall",m:"\uc2dc\uccad",def:"a public building used for a town\u2019s local government",unit:1,opts:["town hall", "crime", "ordinary", "bank"]},
    {w:"bank",m:"\uc740\ud589",def:"a place where people can keep or borrow money",unit:1,opts:["bank", "ordinary", "town hall", "village"]},
    {w:"lock",m:"\uc790\ubb3c\uc1e0",def:"a device that keeps a door fastened",unit:1,opts:["crime", "ordinary", "canal", "lock"]},
    {w:"crime",m:"\ubc94\uc8c4",def:"activity that is against the law",unit:1,opts:["lock", "bank", "bridge", "crime"]},
    {w:"canal",m:"\uc6b4\ud558",def:"a long stretch of water made by people",unit:1,opts:["village", "bank", "canal", "ordinary"]},
    {w:"bridge",m:"\ub2e4\ub9ac",def:"a structure that allows people to cross a river",unit:1,opts:["canal", "bridge", "ordinary", "town hall"]},
  ],
  "wwp3_2": [
    {w:"inventor",m:"\ubc1c\uba85\uac00",def:"someone who designs and makes new things",unit:2,opts:["tie", "hot-air balloon", "inventor", "smoke"]},
    {w:"hot-air balloon",m:"\uc5f4\uae30\uad6c",def:"a large balloon filled with hot air, used for carrying people up into the sky",unit:2,opts:["smoke", "hot-air balloon", "basket", "flight"]},
    {w:"smoke",m:"\uc5f0\uae30",def:"the gray gas that is produced by burning something",unit:2,opts:["land", "smoke", "inventor", "hot-air balloon"]},
    {w:"silk",m:"\ube44\ub2e8",def:"a soft and shiny cloth",unit:2,opts:["silk", "basket", "smoke", "inventor"]},
    {w:"tie",m:"\ubb36\ub2e4",def:"to fasten with a string",unit:2,opts:["silk", "tie", "flight", "inventor"]},
    {w:"basket",m:"\ubc14\uad6c\ub2c8",def:"a container for carrying things",unit:2,opts:["land", "inventor", "tie", "basket"]},
    {w:"flight",m:"\ube44\ud589",def:"the act of flying",unit:2,opts:["flight", "land", "tie", "smoke"]},
    {w:"land",m:"\ucc29\ub959\ud558\ub2e4",def:"to move down to the ground",unit:2,opts:["flight", "land", "hot-air balloon", "inventor"]},
  ],
  "wwp3_3": [
    {w:"vacation",m:"\ud734\uac00",def:"a period of time spent traveling or resting",unit:3,opts:["cycling", "cheap", "vacation", "expensive"]},
    {w:"travel",m:"\uc5ec\ud589\ud558\ub2e4",def:"to go on a trip",unit:3,opts:["delicious", "travel", "cheap", "temple"]},
    {w:"cycling",m:"\uc790\uc804\uac70 \ud0c0\uae30",def:"the activity of riding a bicycle",unit:3,opts:["cycling", "travel", "temple", "vacation"]},
    {w:"temple",m:"\uc0ac\uc6d0",def:"a building for worship",unit:3,opts:["delicious", "expensive", "travel", "temple"]},
    {w:"delicious",m:"\uc544\uc8fc \ub9db\uc788\ub294",def:"very good to eat or drink",unit:3,opts:["cheap", "play", "delicious", "expensive"]},
    {w:"expensive",m:"\ube44\uc2fc",def:"costing a lot of money",unit:3,opts:["cheap", "play", "delicious", "expensive"]},
    {w:"cheap",m:"\uc2fc",def:"costing little money",unit:3,opts:["play", "cheap", "delicious", "temple"]},
    {w:"play",m:"\uc5f0\uadf9, \ud76c\uace1",def:"a story to be performed by actors on a stage",unit:3,opts:["cheap", "play", "delicious", "vacation"]},
  ],
  "wwp3_4": [
    {w:"film studio",m:"\uc601\ud654 \uc81c\uc791\uc18c",def:"a place where movies are made",unit:4,opts:["film studio", "director", "advertisement", "refugee"]},
    {w:"advertisement",m:"\uad11\uace0",def:"a short film to help sell a product",unit:4,opts:["stage", "set", "autograph", "advertisement"]},
    {w:"stage",m:"\ubb34\ub300",def:"a raised area in a theater where the actors perform",unit:4,opts:["makeup", "advertisement", "stage", "refugee"]},
    {w:"makeup",m:"\ubd84\uc7a5 \ub3c4\uad6c",def:"materials used to change the appearances of an actor",unit:4,opts:["film studio", "advertisement", "makeup", "autograph"]},
    {w:"director",m:"\uac10\ub3c5",def:"someone who tells the actors in a movie what to do",unit:4,opts:["advertisement", "makeup", "director", "autograph"]},
    {w:"refugee",m:"\ub09c\ubbfc",def:"someone who has been forced to leave their country because of a war",unit:4,opts:["stage", "set", "director", "refugee"]},
    {w:"set",m:"\ucd2c\uc601\uc7a5",def:"a place where a movie is filmed",unit:4,opts:["set", "director", "refugee", "autograph"]},
    {w:"autograph",m:"\uc0ac\uc778",def:"a famous person\u2019s signature",unit:4,opts:["autograph", "makeup", "refugee", "set"]},
  ],
  "wwp3_5": [
    {w:"animated",m:"\ub9cc\ud654 \uc601\ud654\ub85c \ub41c",def:"produced by the creation of a series of drawings, pictures, etc.",unit:5,opts:["award", "adventurous", "company", "animated"]},
    {w:"company",m:"\ud68c\uc0ac",def:"a business organization that makes money",unit:5,opts:["company", "artist", "animated", "adventurous"]},
    {w:"adventurous",m:"\ubaa8\ud5d8\uc2ec\uc774 \uac15\ud55c",def:"willing to take risks and find excitement",unit:5,opts:["award", "company", "character", "adventurous"]},
    {w:"character",m:"\ub4f1\uc7a5\uc778\ubb3c",def:"a person or an animal in a story, movie, etc.",unit:5,opts:["character", "adventurous", "animated", "cartoon"]},
    {w:"creative",m:"\ucc3d\uc758\uc801\uc778",def:"involving the use of imagination to make new ideas",unit:5,opts:["company", "cartoon", "creative", "adventurous"]},
    {w:"cartoon",m:"\ub9cc\ud654 \uc601\ud654",def:"an animated film or TV show",unit:5,opts:["character", "company", "cartoon", "animated"]},
    {w:"award",m:"\uc0c1",def:"a prize for being excellent",unit:5,opts:["award", "artist", "cartoon", "creative"]},
    {w:"artist",m:"\ud654\uac00, \uc608\uc220\uac00",def:"someone who creates art",unit:5,opts:["cartoon", "animated", "artist", "creative"]},
  ],
  "wwp3_6": [
    {w:"singer",m:"\uac00\uc218",def:"someone who sings for a living",unit:6,opts:["improve", "musical", "singer", "drama school"]},
    {w:"actor",m:"\ubc30\uc6b0",def:"someone who acts in a play, movie, etc.",unit:6,opts:["actor", "musical", "improve", "singer"]},
    {w:"drama school",m:"\uc5f0\uadf9 \ud559\uad50",def:"a school where students learn how to act",unit:6,opts:["drama school", "role", "nervous", "actor"]},
    {w:"audition",m:"\uc624\ub514\uc158",def:"a short performance to show one\u2019s talents",unit:6,opts:["audition", "musical", "actor", "role"]},
    {w:"nervous",m:"\uae34\uc7a5\ub418\ub294",def:"worried about something",unit:6,opts:["actor", "nervous", "audition", "improve"]},
    {w:"musical",m:"\ubba4\uc9c0\uceec",def:"a movie or play that tells a story with songs",unit:6,opts:["musical", "actor", "singer", "audition"]},
    {w:"improve",m:"\ud5a5\uc0c1\ud558\ub2e4",def:"to become better",unit:6,opts:["drama school", "role", "improve", "nervous"]},
    {w:"role",m:"\uc5ed\ud560",def:"the character played by an actor",unit:6,opts:["musical", "role", "drama school", "actor"]},
  ],
  "wwp3_7": [
    {w:"spend",m:"(\uc2dc\uac04\uc744) \ubcf4\ub0b4\ub2e4",def:"to use time for a particular purpose",unit:7,opts:["insect", "macaw", "spend", "species"]},
    {w:"insect",m:"\uace4\ucda9",def:"a small animal with six legs and three body parts",unit:7,opts:["coatimundi", "macaw", "insect", "binoculars"]},
    {w:"single",m:"\ub2e8 \ud558\ub098\uc758",def:"only one; not having another",unit:7,opts:["single", "south", "insect", "macaw"]},
    {w:"south",m:"\ub0a8\ucabd",def:"the direction that is the opposite of north",unit:7,opts:["coatimundi", "south", "species", "spend"]},
    {w:"species",m:"\uc885",def:"a group of animals or plants that are similar",unit:7,opts:["macaw", "species", "insect", "binoculars"]},
    {w:"macaw",m:"\ub9c8\ucf54\uc575\ubb34\uc0c8",def:"a large, long-tailed parrot",unit:7,opts:["insect", "macaw", "binoculars", "spend"]},
    {w:"binoculars",m:"\uc30d\uc548\uacbd",def:"a device with two lenses for viewing distant objects",unit:7,opts:["binoculars", "south", "species", "macaw"]},
    {w:"coatimundi",m:"\ucf54\uc544\ud2f0; \uae34\ucf54\ub108\uad6c\ub9ac",def:"a relative of the raccoon with a long nose",unit:7,opts:["coatimundi", "macaw", "spend", "single"]},
  ],
  "wwp3_8": [
    {w:"friendship",m:"\uc6b0\uc815",def:"a relationship between friends",unit:8,opts:["at first sight", "friendship", "cheetah", "unusual"]},
    {w:"cheetah",m:"\uce58\ud0c0",def:"a large wild cat that can run very fast",unit:8,opts:["friendship", "unusual", "cub", "cheetah"]},
    {w:"care for",m:"~\uc744 \ub3cc\ubcf4\ub2e4",def:"to look after someone or something",unit:8,opts:["unusual", "puppy", "friendship", "care for"]},
    {w:"puppy",m:"\uac15\uc544\uc9c0",def:"a young dog",unit:8,opts:["friendship", "puppy", "unusual", "relax"]},
    {w:"cub",m:"(\uacf0\u00b7\uc0ac\uc790\u00b7\uc5ec\uc6b0 \ub4f1\uc758) \uc0c8\ub07c",def:"the baby of a wild animal, such as a lion or a bear",unit:8,opts:["relax", "cheetah", "cub", "care for"]},
    {w:"at first sight",m:"\uccab\ub208\uc5d0",def:"when first seen",unit:8,opts:["cub", "unusual", "care for", "at first sight"]},
    {w:"unusual",m:"\ud2b9\ubcc4\ud55c, \ud2b9\uc774\ud55c",def:"not normal",unit:8,opts:["unusual", "care for", "cheetah", "cub"]},
    {w:"relax",m:"\uc548\uc2ec\ud558\ub2e4",def:"to become less tense",unit:8,opts:["cub", "at first sight", "relax", "puppy"]},
  ],
  "wwp3_9": [
    {w:"count",m:"(\uc218\ub97c) \uc138\ub2e4",def:"to say numbers in order",unit:9,opts:["count", "brilliant", "bark", "understand"]},
    {w:"shelter",m:"\ubcf4\ud638\uc18c",def:"a place that provides food and protection for animals",unit:9,opts:["command", "brilliant", "shelter", "understand"]},
    {w:"understand",m:"\uc774\ud574\ud558\ub2e4",def:"to know the meaning of what someone says",unit:9,opts:["understand", "shelter", "brilliant", "chase"]},
    {w:"trick",m:"\uc7ac\uc8fc, \ubb18\uae30",def:"a clever and skillful action to entertain people",unit:9,opts:["bark", "understand", "chase", "trick"]},
    {w:"bark",m:"\uc9d6\ub2e4",def:"to make a short loud sound",unit:9,opts:["shelter", "bark", "command", "trick"]},
    {w:"command",m:"\uba85\ub839",def:"an order given to a person or an animal",unit:9,opts:["bark", "trick", "understand", "command"]},
    {w:"brilliant",m:"\ub6f0\uc5b4\ub09c",def:"smart; intelligent",unit:9,opts:["chase", "shelter", "brilliant", "command"]},
    {w:"chase",m:"\ub4a4\ucad3\ub2e4",def:"to follow and try to catch someone or something",unit:9,opts:["chase", "command", "understand", "count"]},
  ],
  "wwp3_10": [
    {w:"look for",m:"\ucc3e\ub2e4",def:"to try to find",unit:10,opts:["forest", "look for", "near", "hidden"]},
    {w:"treasure",m:"\ubcf4\ubb3c",def:"something valuable that is hidden in a safe place",unit:10,opts:["hidden", "treasure", "look for", "app"]},
    {w:"app",m:"\uc751\uc6a9 \ud504\ub85c\uadf8\ub7a8",def:"a program designed to do a special job; application",unit:10,opts:["near", "app", "hidden", "object"]},
    {w:"gps",m:"\uc704\uc131 \uc704\uce58 \ud655\uc778 \uc2dc\uc2a4\ud15c",def:"a navigation system that shows an exact location",unit:10,opts:["gps", "near", "forest", "object"]},
    {w:"object",m:"\ubb3c\uccb4",def:"a thing that you can see and touch",unit:10,opts:["near", "gps", "forest", "object"]},
    {w:"near",m:"\uac00\uae4c\uc6b4",def:"close to someone or something",unit:10,opts:["look for", "near", "object", "forest"]},
    {w:"hidden",m:"\uc228\uaca8\uc9c4",def:"difficult to see or find",unit:10,opts:["near", "look for", "hidden", "treasure"]},
    {w:"forest",m:"\uc232",def:"a large area of land covered with trees",unit:10,opts:["forest", "object", "app", "gps"]},
  ],
  "wwp3_11": [
    {w:"heat",m:"\uc5f4",def:"warmth or the quality of being hot",unit:11,opts:["cut down", "heat", "measure", "survive"]},
    {w:"energy",m:"\uc5d0\ub108\uc9c0",def:"usable power that comes from heat, electricity, etc.",unit:11,opts:["heat", "energy", "destroy", "measure"]},
    {w:"measure",m:"\uce21\uc815\ud558\ub2e4",def:"to find the size, length, or degree of something",unit:11,opts:["survive", "measure", "energy", "heat"]},
    {w:"temperature",m:"\uc628\ub3c4",def:"a measurement of how hot or cold something is",unit:11,opts:["cut down", "heat", "rain forest", "temperature"]},
    {w:"survive",m:"\uc0b4\uc544\ub0a8\ub2e4",def:"to continue to live",unit:11,opts:["rain forest", "survive", "heat", "measure"]},
    {w:"cut down",m:"\ubca0\uc5b4 \uc4f0\ub7ec\ub728\ub9ac\ub2e4",def:"to cut something to make it fall down",unit:11,opts:["heat", "rain forest", "survive", "cut down"]},
    {w:"destroy",m:"\ud30c\uad34\ud558\ub2e4",def:"to damage something badly",unit:11,opts:["temperature", "energy", "rain forest", "destroy"]},
    {w:"rain forest",m:"\uc5f4\ub300 \uc6b0\ub9bc",def:"a tropical forest with tall trees and lots of rain",unit:11,opts:["temperature", "measure", "rain forest", "cut down"]},
  ],
  "wwp3_12": [
    {w:"hobby",m:"\ucde8\ubbf8",def:"an activity that someone does for pleasure",unit:12,opts:["ground", "follow", "lift", "hobby"]},
    {w:"tornado",m:"\ud1a0\ub124\uc774\ub3c4",def:"a violent storm in which winds spin around",unit:12,opts:["ground", "lift", "hobby", "tornado"]},
    {w:"rotate",m:"\ud68c\uc804\ud558\ub2e4",def:"to turn around a central point",unit:12,opts:["follow", "reach", "hobby", "rotate"]},
    {w:"reach",m:"\ub2ff\ub2e4",def:"to grow or increase to a certain point",unit:12,opts:["hobby", "reach", "ground", "careful"]},
    {w:"ground",m:"\ub545",def:"an area of land",unit:12,opts:["hobby", "ground", "follow", "tornado"]},
    {w:"lift",m:"\ub4e4\uc5b4 \uc62c\ub9ac\ub2e4",def:"to move something or someone to a higher position",unit:12,opts:["lift", "tornado", "ground", "careful"]},
    {w:"follow",m:"\ub530\ub77c\uac00\ub2e4",def:"to go after something or someone",unit:12,opts:["tornado", "hobby", "follow", "careful"]},
    {w:"careful",m:"\uc870\uc2ec\ud558\ub294",def:"trying to avoid anything bad",unit:12,opts:["careful", "follow", "ground", "reach"]},
  ],
};
function getWordsForUnit(bookId, unitNum) {
  if(bookId==='ww5') return WW5_WORDS.filter(w=>w.unit===unitNum);
  if(bookId.startsWith('wwp')) return WWP_WORDS_DB[`${bookId}_${unitNum}`]||[];
  if(bookId.startsWith('bew')) return BEW_WORDS_DB[`${bookId}_${unitNum}`]||[];
  return NEW_BOOKS_DB[`${bookId}_${unitNum}`]||[];
}
const rng       = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const calcDmg   = (atk,def)=>Math.max(4,Math.floor(atk-def*0.4+rng(-3,5)));
const getEnemy  = uid=>ENEMIES[Math.min(Math.floor((uid-1)/3),ENEMIES.length-1)];
const shuffle   = a=>[...a].sort(()=>Math.random()-0.5);
const getOpts   = w=>shuffle(w.opts);
const hpColor   = pct=>pct>50?"#44CC77":pct>25?"#EE9920":"#EE2222";

// get all flat mons for easy lookup
const ALL_PLAYER_MONS = EVO_LINES.flatMap(l=>l.stages);

// star unlock thresholds for each first-stage mon
const MON_UNLOCK_STARS = { ink:0, rune:8, echo:16 };
const EVO_UNLOCK_STARS = { 0:0, 1:4, 2:12 }; // stage index → stars needed to evolve (plus lv)

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CSS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

  /* ── Attack animations ── */

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

// ── VOC-103: 단계 진행바 ──────────────────────────────
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

// ── VOC-105: 정오답 피드백 오버레이 ──────────────────
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

// ── VOC-106: 저장 토스트 ─────────────────────────────
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
      ✅ {msg}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function VocabMon() {
  // ── 로그인 상태 ──
  const [player, setPlayer] = useState(null); // { name, classCode }

  // ── Core state ──
  const [screen,  setScreen]  = useState("title");
  const [curBook, setCurBook] = useState(null);
  const [lineId,  setLineId]  = useState(null);
  const [activeGroup, setActiveGroup] = useState("ww"); // book select tab
  const [stageIdx,setStageIdx]= useState(0);
  const [monLv,   setMonLv]   = useState(1);
  const [monExp,  setMonExp]  = useState(0);
  const [coins,   setCoins]   = useState(120);

  // Stars per unit per stage: { "1_0": 2, "1_1": 1, ... }
  const [unitStars, setUnitStars] = useState({});
  // Total stars (sum of all best stars per unit, max 3 each × 12 units = 36)
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

  // VOC-105: 정오답 피드백 오버레이
  const [feedback, setFeedback] = useState(null); // {type:"correct"|"wrong", msg:string}
  // VOC-106: 저장 토스트
  const [toast, setToast] = useState(null); // string | null

  // ── 몬스터 수집 시스템 ──
  const [caughtMons,    setCaughtMons]    = useState([]); // 잡은 몬스터 ID 배열
  const [pendingEggs,   setPendingEggs]   = useState([]); // [{id,rarity,lineId,answersLeft}]
  const [eggHatch,      setEggHatch]      = useState(null); // {mon,lineId} 부화 연출
  const [wrongWords,    setWrongWords]    = useState([]); // 영구 오답 단어
  const [eggAnswers,    setEggAnswers]    = useState(0);  // 현재 알 진행 정답 수 (UI용)

  // ── Duolingo 시스템 ──
  const [dailyMissions, setDailyMissions] = useState([]); // [{id,label,emoji,target,progress,done}]
  const [dailyEggDate,  setDailyEggDate]  = useState(""); // 오늘 무료 알 받은 날짜
  const [streakShields, setStreakShields] = useState(0);  // 실드 개수

  // PWA 설치 배너
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // 서비스 워커 등록 + 설치 이벤트 캐치
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

  const logRef = useRef(null);

  // ── 미션 생성 헬퍼 ──
  function makeDailyMissions() {
    const pool = [
      { id:"correct10", emoji:"✅", label:"정답 10개 맞추기",    target:10, progress:0, done:false },
      { id:"correct20", emoji:"✅", label:"정답 20개 맞추기",    target:20, progress:0, done:false },
      { id:"unit1",     emoji:"⚔️", label:"유닛 1개 완주하기",   target:1,  progress:0, done:false },
      { id:"combo5",    emoji:"🔥", label:"5연속 정답 달성",     target:5,  progress:0, done:false },
      { id:"revenge",   emoji:"👾", label:"Revenge Land 클리어", target:1,  progress:0, done:false },
      { id:"words15",   emoji:"📖", label:"단어 15개 학습",      target:15, progress:0, done:false },
    ];
    // 매일 날짜 기반으로 3개 선택 (같은 날은 같은 미션)
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

  // ── 로그인 처리: Supabase에서 진행사항 불러오기 ──
  async function handleLogin(name, classCode) {
    const saved = await loadProgress(name, classCode);
    const today = new Date().toDateString();
    let restoredStreak = 0, restoredLoginDays = 0, restoredLastLogin = "";
    let restoredEggDate = "", restoredShields = 0;

    if (saved) {
      if (saved.unitStars)    setUnitStars(saved.unitStars);
      if (saved.monLv)        setMonLv(saved.monLv);
      if (saved.monExp)       setMonExp(saved.monExp);
      if (saved.coins)        setCoins(saved.coins);
      if (saved.lineId)       setLineId(saved.lineId);
      if (saved.stageIdx !== undefined) setStageIdx(saved.stageIdx);
      if (saved.curBook)      setCurBook(saved.curBook);
      if (saved.caughtMons)   setCaughtMons(saved.caughtMons);
      if (saved.pendingEggs)  setPendingEggs(saved.pendingEggs);
      if (saved.wrongWords)   setWrongWords(saved.wrongWords);
      if (saved.streakShields) { setStreakShields(saved.streakShields); restoredShields = saved.streakShields; }
      restoredStreak    = saved.streak    || 0;
      restoredLoginDays = saved.loginDays || 0;
      restoredLastLogin = saved.lastLogin || "";
      restoredEggDate   = saved.dailyEggDate || "";
    }

    // ── 스트릭 업데이트 ──
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak = restoredStreak;
    if (restoredLastLogin !== today) {
      if (restoredLastLogin === yesterday) {
        newStreak = restoredStreak + 1;
      } else if (restoredLastLogin !== "") {
        // 하루 빠짐 → 실드 사용 or 리셋
        if (restoredShields > 0) {
          newStreak = restoredStreak; // 실드로 유지
          setStreakShields(s => s - 1);
        } else {
          newStreak = 1; // 리셋
        }
      } else {
        newStreak = 1; // 첫 로그인
      }
      setLoginDays(d => restoredLoginDays + 1);
      setLastLogin(today);
    }
    setStreak(newStreak);

    // ── 데일리 미션 생성 (오늘 날짜 기준) ──
    const savedMissionDate = saved?.dailyMissionDate || "";
    if (savedMissionDate !== today) {
      setDailyMissions(makeDailyMissions());
    } else {
      setDailyMissions(saved?.dailyMissions || makeDailyMissions());
    }

    // ── 데일리 무료 알 지급 ──
    setDailyEggDate(restoredEggDate);

    setPlayer({ name, classCode });

    // ── 진행 있으면 바로 월드맵으로 점프 ──
    const hasProgress = !!(saved?.lineId && saved?.curBook);
    if (hasProgress) {
      setScreen("world");
      // 무료 알 있으면 토스트로 알림
      const todayStr = new Date().toDateString();
      if ((saved?.dailyEggDate || "") !== todayStr) {
        setTimeout(() => setToast("🥚 오늘의 무료 알이 기다려요! 홈에서 받아봐"), 800);
      }
      // 스트릭 축하
      if (newStreak > 1) {
        setTimeout(() => setToast(`🔥 ${newStreak}일 연속! 오늘도 파이팅`), 200);
      }
    }
  }

  // ── 자동 저장: 주요 상태 바뀔 때마다 Supabase에 저장 ──
  useEffect(() => {
    if (!player) return;
    const timeout = setTimeout(() => {
      saveProgress(player.name, player.classCode, {
        unitStars, monLv, monExp, coins,
        lineId, stageIdx, curBook,
        streak, loginDays, lastLogin,
        caughtMons, pendingEggs, wrongWords,
        dailyMissions, dailyEggDate, streakShields,
        dailyMissionDate: new Date().toDateString(),
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [player, unitStars, monLv, monExp, coins, lineId, stageIdx, curBook, streak, loginDays, caughtMons, pendingEggs, wrongWords, dailyMissions, dailyEggDate, streakShields]);

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

  const mon = lineId ? EVO_LINES.find(l=>l.lineId===lineId).stages[stageIdx] : null;
  const unlockLine = lid => totalStars >= MON_UNLOCK_STARS[lid];
  const evoReady = mon && mon.evoLv && monLv>=mon.evoLv && totalStars>=EVO_UNLOCK_STARS[stageIdx+1] && stageIdx<2;

  function tryEvolve() {
    if(!evoReady) return;
    setEvoAnim(true);
    setTimeout(()=>{
      setStageIdx(s=>s+1);
      setNewMonName(EVO_LINES.find(l=>l.lineId===lineId).stages[stageIdx+1].name);
      setEvoAnim(false);
      setShowEvoModal(true);
    },1800);
  }

  // Get stars for a unit+stage key
  const getUnitStars = (uid,stg) => unitStars[`${curBook||"ww5"}_${uid}_${stg}`] || 0;

  // Calc stars from battle result
  function calcStars(wc,total) {
    if(!won) return 0;
    if(wc===0) return 3;
    if(wc<=Math.ceil(total*0.25)) return 2;
    return 1;
  }

  // Build recall opts (Korean → English: distractors from same unit)
  function getRecallOpts(word) {
    const others = getWordsForUnit(curBook||"ww5", parseInt(word.unit)).filter(w=>w.w!==word.w);
    const shuffled = shuffle(others).slice(0,3);
    return shuffle([word.w, ...shuffled.map(w=>w.w)]);
  }

  // Build master opts (English word shown → pick Korean meaning)
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
    const effMon = EVO_LINES.find(l=>l.lineId===lineId).stages[stageIdx];
    if(bookId) setCurBook(bookId);
    setCurUnit(uid); setBattleStage(stg); setCurEnemy(enemy);
    setQueue(words); setWrongQueue([]); setQIdx(0);
    setCurOpts(stg===2 ? getMasterOpts(words[0]) : getOpts(words[0]));
    setPHp(effMon.hp); setEHp(enemy.hp);
    setWrongCount(0); setCorrectCount(0);
    const stgLabel=["EXPLORE","RECALL","MASTER"][stg];
    setLog([`A wild ${enemy.name} appeared!`,`Stage: ${stgLabel} mode`,stg===0?"영영 정의 → 영어 단어":stg===1?"한국어 뜻 → 영어 단어":"영어 단어 → 한국어 뜻"]);
    setPhase("question"); setSel(null); setComboStr(0); setDmgVal(null);
    setScreen("battle");
  }

  function answer(opt) {
    if(phase!=="question"||sel) return;
    setSel(opt); setPhase("anim");
    const word=queue[qIdx];
    // correct answer depends on stage
    const correctAns = battleStage===2 ? word.m : word.w;
    const correct = opt===correctAns;
    const effMon = EVO_LINES.find(l=>l.lineId===lineId).stages[stageIdx];
    const eff = {...effMon, atk:effMon.atk+monLv*2};

    if(correct) {
      const ns=comboStr+1; setComboStr(ns);
      const base=calcDmg(eff.atk,curEnemy.def);
      const final=ns>=3?Math.floor(base*1.65):base;
      const newE=Math.max(0,eHp-final);
      setCorrectCount(c=>c+1);
      setLog(p=>[...p,`${ns>=3?`🔥COMBO×${ns}! `:""}✅ "${battleStage===2?word.m:word.w}" → -${final}HP`]);
      // VOC-105: 정답 피드백
      const expGain = 12 + (ns>=3?6:0);
      setFeedback({type:"correct", msg:`정답! +${expGain} EXP${ns>=3?` 🔥×${ns}`:""}`});
      setTimeout(()=>setFeedback(null), 800);

      // ── 알 진행도 +1 (정답마다) ──
      setPendingEggs(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = { ...updated[0], answersLeft: (updated[0].answersLeft ?? 10) - 1 };
        if (updated[0].answersLeft <= 0) {
          const egg = updated[0];
          setCaughtMons(owned => {
            const caught = rollMonsterFromLine(egg.lineId, owned);
            if (!caught) return owned;
            setTimeout(() => setEggHatch({ mon: caught, lineId: egg.lineId }), 400);
            return owned.includes(caught.id) ? owned : [...owned, caught.id];
          });
          return updated.slice(1);
        }
        return updated;
      });
      setEggAnswers(a => a + 1);

      // ── 미션 진행도 업데이트 ──
      setDailyMissions(prev => prev.map(m => {
        if (m.done) return m;
        let np = m.progress;
        if (m.id === "correct10" || m.id === "correct20" || m.id === "words15") np = Math.min(m.target, np + 1);
        if (m.id === "combo5" && ns >= m.target) np = m.target;
        const done = np >= m.target;
        return { ...m, progress: np, done };
      }));

      // ── 정답: 플레이어가 적에게 돌진 ──
      setAttackP(true);                          // 플레이어 출발
      setTimeout(()=>{
        // 충돌 순간 (약 35% 지점)
        setShakeE(true);
        setEHp(newE);
        setDmgVal({val:final,correct:true});
      }, 350);
      setTimeout(()=>{ setShakeE(false); }, 750);
      setTimeout(()=>{ setAttackP(false); }, 850); // 플레이어 복귀 완료
      setTimeout(()=>{ setDmgVal(null); }, 1200);
      setTimeout(()=>{ newE<=0?endBattle(true):nextWord(); }, 1050);

    } else {
      setComboStr(0);
      const ed=calcDmg(curEnemy.atk,8);
      const newP=Math.max(0,pHp-ed);
      setWrongCount(c=>c+1);
      setWrongQueue(q=>[...q,word]);
      // 영구 오답 저장 (Revenge Land용)
      setWrongWords(prev => {
        if (prev.some(x=>x.w===word.w && x.m===word.m)) return prev;
        return [...prev, {w:word.w, m:word.m, def:word.def||"", opts:word.opts||[]}];
      });
      setLog(p=>[...p,`❌ "${battleStage===2?word.m:word.w}" — -${ed}HP`]);
      // VOC-105: 오답 피드백
      setFeedback({type:"wrong", msg:"괜찮아, 이 단어는 다시 나와요"});
      setTimeout(()=>setFeedback(null), 1000);

      // ── 오답: 적이 플레이어에게 돌진 ──
      setAttackE(true);                          // 적 출발
      setTimeout(()=>{
        // 충돌 순간
        setShakeP(true);
        setPHp(newP);
        setDmgVal({val:ed,correct:false});
      }, 350);
      setTimeout(()=>{ setShakeP(false); }, 750);
      setTimeout(()=>{ setAttackE(false); }, 850); // 적 복귀 완료
      setTimeout(()=>{ setDmgVal(null); }, 1200);
      setTimeout(()=>{ newP<=0?endBattle(false):nextWord(); }, 1050);
    }
  }

  function nextWord() {
    let ni,nq=queue;
    const nxt=qIdx+1;
    if(nxt>=queue.length){nq=shuffle(queue);setQueue(nq);ni=0;setQIdx(0);}
    else{ni=nxt;setQIdx(nxt);}
    const w=nq[ni];
    setCurOpts(battleStage===2?getMasterOpts(w):getOpts(w));
    setSel(null); setPhase("question");
  }

  function endBattle(didWin) {
    setPhase("end"); setWon(didWin);
    if(didWin){
      const total=queue.length;
      const stars=calcStars(wrongCount,total);
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
        // check evo: mon.evoLv and new level qualifies
        if(mon && mon.evoLv && newLv>=mon.evoLv && stageIdx<2 && totalStars>=EVO_UNLOCK_STARS[stageIdx+1]){
          setTimeout(()=>tryEvolve(),800);
        }
      } else { setMonExp(newExp); }
      setLog(p=>[...p,`🏆 Victory! +${ec}G +${ex}EXP · ${stars}★`]);

      // ── 알 드롭 + 부화 시스템 ──
      const totalQ = queue.length;
      const accuracy = totalQ > 0 ? (totalQ - wrongCount) / totalQ : 0;
      const eggRarity = rollEggRarity(accuracy);
      const possLines = EGG_DROP[eggRarity] || EGG_DROP.common;
      const pickedLine = possLines[Math.floor(Math.random() * possLines.length)];
      // 새 알 추가 (정답 10개로 부화 — answer()에서 처리)
      const newEgg = { id: Date.now(), rarity: eggRarity, lineId: pickedLine, answersLeft: 10 };
      setPendingEggs(prev => [...prev, newEgg]);

      // 유닛 완주 미션 업데이트
      setDailyMissions(prev => prev.map(m => {
        if (m.done) return m;
        if (m.id === "unit1") {
          const np = Math.min(m.target, m.progress + 1);
          return { ...m, progress: np, done: np >= m.target };
        }
        return m;
      }));
    } else {
      setLog(p=>[...p,`💀 ${mon.name} fainted...`]);
    }
    setTimeout(()=>setScreen("result"),1400);
  }

  // ── SCREENS ──────────────────────────────────────────

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
      <div className="crt page slide-up" style={{
        padding:"clamp(10px,2.5vw,16px)",gap:"clamp(8px,2vh,12px)",
        background:"radial-gradient(ellipse at 50% -10%,#1A0E2E,#0C0A18)"
      }}>
        <style>{CSS}</style>

        {/* Header */}
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>📚 교재 선택</div>
          <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:4}}>
            공부할 책을 골라봐!
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
                  ★{groupStars}
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
                      background:book.color+"22",padding:"2px 6px",borderRadius:6}}>현재</span>}
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
                      color:"#F5C842",flexShrink:0,minWidth:40}}>★{bookStars}/{maxStars}</span>
                  </div>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",
                    color:"#4A3A60"}}>
                    Unit 1~{book.units} · {book.units*20}단어 · {pct}% 완료
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}
          style={{padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612",flexShrink:0}}>
          ← BACK
        </button>
      </div>
    );
  }

  // 로그인 안 됐으면 로그인 화면 먼저
  if (!player) return <LoginScreen onLogin={handleLogin} />;

  // Toast wrapper helper — renders on top of any screen
  const ToastLayer = () => toast ? <Toast msg={toast} onDone={()=>setToast(null)}/> : null;

  // PWA 설치 배너
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
          홈 화면에 추가할래요? 🐉
        </div>
        <div style={{color:"#C77DFF",fontSize:12,marginTop:2}}>
          앱처럼 바로 실행돼요!
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
      }}>✕</button>
    </div>
  ) : null;

  // TITLE
  if(screen==="title") {
    const today = new Date().toDateString();
    const hasFreeEgg = dailyEggDate !== today;
    const doneMissions = dailyMissions.filter(m=>m.done).length;
    const allMissionsDone = doneMissions >= dailyMissions.length && dailyMissions.length > 0;
    const firstEgg = pendingEggs[0];
    const eggPct = firstEgg ? Math.round(((10 - (firstEgg.answersLeft ?? 10)) / 10) * 100) : 0;
    const eggLine = firstEgg ? CATCH_MON_LINES.find(l=>l.lineId===firstEgg.lineId) : null;

    function claimDailyEgg() {
      if (!hasFreeEgg) return;
      const possLines = EGG_DROP.common;
      const lineId2 = possLines[Math.floor(Math.random() * possLines.length)];
      const newEgg = { id: Date.now(), rarity:"common", lineId: lineId2, answersLeft: 10 };
      setPendingEggs(prev => [...prev, newEgg]);
      setDailyEggDate(today);
      setToast("🥚 오늘의 알 받기 완료! 정답 10개로 부화해봐");
    }

    return (
      <div className="crt page-y slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.2vh,14px)",
        background:"radial-gradient(ellipse at 40% 0%,#1A0E2E,#0C0A18)"
      }}>
        <style>{CSS}</style>
        <ToastLayer/>
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

        {/* ── 상단: 로고 + 스트릭 ── */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(20px,5vmin,32px)",color:"#F5C842",
              lineHeight:1,letterSpacing:2}}>VOCAB<span style={{color:"#FF5533"}}>MON</span>
            </div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:2}}>
              {player?.name} 님
            </div>
          </div>
          <div style={{textAlign:"center",background:"#1A1400",borderRadius:14,
            padding:"8px 14px",border:`2px solid ${streak>=7?"#FF9933":"#2A2000"}`}}>
            <div style={{fontSize:"clamp(20px,5vmin,28px)"}}>{streak>=7?"🔥":"🕯️"}</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(14px,4vmin,20px)",
              color:streak>=7?"#FF9933":"#886633",lineHeight:1}}>{streak}</div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:"#6A5888"}}>일 연속</div>
          </div>
        </div>

        {/* ── 이어하기 버튼 ── */}
        <button className="big-btn" onClick={()=>setScreen(mon?"world":"bookselect")}
          style={{padding:"clamp(13px,3vmin,18px)",fontSize:"clamp(15px,4vmin,18px)",
            color:"#fff",background:"linear-gradient(135deg,#3C7020,#5AA030)",
            boxShadow:"0 5px 0 #1E3A10",flexShrink:0,letterSpacing:1}}>
          {(lineId && totalStars > 0) ? "▶  이어하기" : "▶  게임 시작"}
        </button>

        {/* ── 오늘의 알 ── */}
        <div style={{background:"#16122A",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
          border:`2px solid ${hasFreeEgg?"#7B2FBE88":"#2A2440"}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:"clamp(28px,7vmin,36px)",animation:hasFreeEgg?"floatBob 2s ease-in-out infinite":"none"}}>
              🥚
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",
                color:hasFreeEgg?"#C77DFF":"#4A3A60"}}>
                {hasFreeEgg ? "오늘의 무료 알!" : "오늘 알 받음 ✓"}
              </div>
              {firstEgg && (
                <div style={{marginTop:4}}>
                  <div style={{display:"flex",justifyContent:"space-between",
                    fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#6A5888",marginBottom:3}}>
                    <span>{eggLine?.eggEmoji} {eggLine?.rarityLabel}</span>
                    <span>{10-(firstEgg.answersLeft??10)}/10 정답</span>
                  </div>
                  <div style={{height:8,background:"#0E0C1A",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,transition:"width 0.4s",
                      background:`linear-gradient(90deg,${eggLine?.typeClr||"#7B2FBE"},${eggLine?.eggColor||"#C77DFF"})`,
                      width:`${eggPct}%`}}/>
                  </div>
                </div>
              )}
            </div>
            {hasFreeEgg && (
              <button onClick={claimDailyEgg} style={{
                background:"linear-gradient(135deg,#7B2FBE,#C77DFF)",color:"#fff",
                border:"none",borderRadius:10,padding:"8px 14px",fontWeight:700,
                fontSize:"clamp(12px,3vw,14px)",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0
              }}>받기!</button>
            )}
          </div>
          {pendingEggs.length > 1 && (
            <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#4A3A60",marginTop:6}}>
              +{pendingEggs.length-1}개 알 대기 중
            </div>
          )}
        </div>

        {/* ── 오늘의 미션 ── */}
        <div style={{background:"#16122A",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
          border:`2px solid ${allMissionsDone?"#44BB4488":"#2A2440"}`,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",
              color:allMissionsDone?"#44FF88":"#F5C842"}}>
              {allMissionsDone?"✅ 오늘 미션 완료!":"📋 오늘의 미션"}
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
                  {m.done?"완료!!":`${m.progress}/${m.target}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 하단 버튼 그리드 ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,flexShrink:0}}>
          {[
            {l:"📖 도감", fn:()=>setScreen("collection"), bg:"linear-gradient(135deg,#2A1880,#4A2AAA)"},
            {l:`⚔️${wrongWords.length>0?" 🔴":""}`, fn:()=>setScreen("revenge"), bg:wrongWords.length>0?"linear-gradient(135deg,#3A0800,#660A00)":"#16122A"},
            {l:"🏆 랭킹", fn:()=>setScreen("leaderboard"), bg:"linear-gradient(135deg,#1A1400,#2A2200)"},
            {l:`🛒 ${caughtMons.length>0?coins+"G":"샵"}`, fn:()=>setScreen("shop"), bg:"linear-gradient(135deg,#0A2A1A,#0A4A2A)"},
            {l:"👤 파트너", fn:()=>setScreen("select"), bg:"#16122A"},
            {l:"📚 교재", fn:()=>setScreen("bookselect"), bg:"#16122A"},
          ].map((b,i)=>(
            <button key={i} className="big-btn" onClick={b.fn}
              style={{padding:"clamp(9px,2.2vmin,12px) 4px",fontSize:"clamp(11px,3vw,13px)",
                color:"#E0D8FF",background:b.bg,boxShadow:"0 3px 0 #080612"}}>
              {b.l}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // SELECT LINE
  if(screen==="select") return (
    <div className="crt page slide-up" style={{
      alignItems:"center",padding:"clamp(10px,2.5vw,18px)",gap:"clamp(8px,2vh,14px)",
      background:"radial-gradient(ellipse at 50% -10%,#1A0E2E,#0C0A18)"
    }}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",flexShrink:0}}>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>CHOOSE YOUR LINE</div>
        <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:4}}>
          파트너 계열을 선택하라
        </div>
      </div>

      <div style={{width:"100%",maxWidth:520,flex:1,display:"flex",flexDirection:"column",gap:"clamp(8px,2vh,12px)",justifyContent:"center"}}>
        {EVO_LINES.map((line,li)=>{
          const s0=line.stages[0];
          const locked=!unlockLine(line.lineId);
          const needStars=MON_UNLOCK_STARS[line.lineId];
          return (
            <div key={line.lineId}
              onClick={()=>{if(!locked){setLineId(line.lineId);setStageIdx(0);setMonLv(1);setMonExp(0);setScreen("world");}}}
              style={{
                borderRadius:14,padding:"clamp(10px,2.2vh,16px)",
                background:locked?"#0E0C1A":`linear-gradient(135deg,#12101E,${s0.color}18)`,
                border:`2px solid ${locked?"#1A1828":s0.color+"55"}`,
                boxShadow:locked?"none":`0 0 20px ${s0.glow}22,0 4px 0 rgba(0,0,0,.6)`,
                cursor:locked?"not-allowed":"pointer",opacity:locked?.4:1,
                display:"flex",alignItems:"center",gap:"clamp(10px,2.5vw,16px)",
                transition:"all .15s"
              }}>
              {/* 3-stage preview */}
              <div style={{display:"flex",alignItems:"flex-end",gap:4,flexShrink:0}}>
                {line.stages.map((st,si)=>(
                  <div key={si} style={{opacity:.4+si*.3,animation:`floatBob ${2.2+si*.4}s ease-in-out infinite`}}>
                    <st.Sprite w={Math.min(32+si*14,Math.max(22+si*10,Math.floor(window.innerWidth*(0.05+si*.02))))}/>
                  </div>
                ))}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:s0.color}}>{locked?"??????":line.stages[0].name}</span>
                  <span style={{fontSize:"clamp(7px,1.8vmin,9px)",background:s0.typeClr,color:"#fff",
                    padding:"2px 6px",borderRadius:6,fontFamily:"var(--f-ui)",fontWeight:900}}>{s0.type}</span>
                </div>
                <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888",marginBottom:4}}>
                  {locked?`🔒 UNLOCK AT ★${needStars}`:`→ ${line.stages[1].name} → ${line.stages[2].name}`}
                </div>
                {!locked&&(
                  <div style={{display:"flex",gap:10}}>
                    {[["HP",s0.hp,"#44CC77"],["ATK",s0.atk,"#FF8844"],["DEF",s0.def,"#4488FF"]].map(([k,v,c])=>(
                      <div key={k} style={{textAlign:"center"}}>
                        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",color:"#6A5888"}}>{k}</div>
                        <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"var(--fs-sm)",color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {locked&&<div style={{fontSize:"clamp(20px,5vmin,28px)"}}>🔒</div>}
            </div>
          );
        })}

        {/* Hidden mon teaser */}
        <div style={{borderRadius:14,padding:"clamp(8px,2vh,12px)",
          background:"linear-gradient(135deg,#0A0818,#1A0844)",
          border:`2px solid ${totalStars>=30?"#BB66FF55":"#2A0888"}`,
          display:"flex",alignItems:"center",gap:12,opacity:totalStars>=30?1:0.5}}>
          <div style={{animation:"floatBob 3s ease-in-out infinite",flexShrink:0}}>
            <LexivoreSprite w={Math.min(62,Math.max(42,Math.floor(window.innerWidth*.13)))}/>
          </div>
          <div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#BB66FF"}}>
              {totalStars>=30?"LEXIVORE":"???"}
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888",marginTop:4}}>
              {totalStars>=30?"HIDDEN UNLOCKED! 🎉":`🔒 ★30 needed · you have ★${totalStars}`}
            </div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:8,flexShrink:0,width:"100%",maxWidth:520}}>
        <button className="big-btn" onClick={()=>setScreen("title")}
          style={{flex:1,padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
          ← BACK
        </button>
      </div>
    </div>
  );

  // WORLD MAP
  if(screen==="world"&&mon) {
    const bookInfo = BOOK_SERIES.find(b=>b.id===(curBook||"ww5"));
    const expPct=Math.min(100,(monExp/(monLv*80))*100);
    return (
      <div className="crt page slide-up" style={{
        padding:"clamp(7px,2vmin,12px)",gap:"clamp(5px,1.5vmin,9px)",
        background:"radial-gradient(ellipse at 50% 0%,#14102A,#0C0A18)"
      }}>
        <style>{CSS}</style>
        <ToastLayer/>

        {/* Evolution animation overlay */}
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

        {/* Book header bar */}
        <div onClick={()=>setScreen("bookselect")} style={{
          display:"flex",alignItems:"center",gap:8,
          background:"linear-gradient(135deg,#1C182E,#241E3A)",
          borderRadius:10,padding:"7px 12px",border:`1px solid ${bookInfo?.color||"#F5C842"}33`,
          cursor:"pointer",flexShrink:0
        }}>
          <span style={{fontSize:"clamp(18px,4vmin,24px)"}}>{bookInfo?.emoji}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",
              color:bookInfo?.color||"#F5C842"}}>{bookInfo?.title}</div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",
              color:"#6A5888"}}>{bookInfo?.subtitle}</div>
          </div>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#4A3A60"}}>
            교재 변경 →
          </div>
        </div>

        {/* Evolution modal */}
        {showEvoModal&&(
          <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.85)",
            display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"var(--panel)",border:"3px solid #BB66FF",borderRadius:16,
              padding:"clamp(20px,5vmin,32px)",textAlign:"center",maxWidth:340,
              boxShadow:"0 0 40px rgba(160,80,255,.5)"}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#BB66FF",marginBottom:12}}>
                ✨ EVOLUTION!
              </div>
              <div style={{animation:"floatBob 2s ease-in-out infinite",marginBottom:12}}>
                {(() => { const S=EVO_LINES.find(l=>l.lineId===lineId).stages[stageIdx].Sprite; const w=Math.min(96,Math.max(60,Math.floor(window.innerWidth*.2))); return <S w={w}/>; })()}
              </div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842",marginBottom:6}}>
                {newMonName}
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginBottom:16}}>
                {EVO_LINES.find(l=>l.lineId===lineId).stages[stageIdx].desc}
              </div>
              <button className="big-btn" onClick={()=>setShowEvoModal(false)}
                style={{padding:"clamp(10px,2.5vmin,14px) 28px",fontSize:"var(--fs-sm)",
                  color:"#fff",background:"linear-gradient(135deg,#6600CC,#AA44FF)",
                  boxShadow:"0 4px 0 #330066"}}>
                AWESOME! ✨
              </button>
            </div>
          </div>
        )}

        {/* Status bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          background:"#1C182E",borderRadius:10,padding:"8px 12px",border:"1px solid var(--rim)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{animation:"floatBob 2.5s ease-in-out infinite"}}>
              <mon.Sprite w={Math.min(40,Math.max(28,Math.floor(window.innerWidth*.08)))}/>
            </div>
            <div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:mon.color}}>{mon.name}</span>
                <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",color:"#6A5888"}}>Lv.{monLv}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.4vmin,8px)",color:"#9966CC"}}>EXP</span>
                <div style={{width:"clamp(48px,12vw,88px)",height:5,background:"#0E0A18",
                  borderRadius:3,overflow:"hidden",border:"1px solid var(--rim)"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#7733EE,#BB77FF)",
                    borderRadius:3,width:`${expPct}%`,transition:"width .4s ease"}}/>
                </div>
              </div>
              {evoReady&&(
                <div style={{fontFamily:"var(--f-ui)",fontWeight:900,fontSize:"clamp(8px,2vmin,10px)",
                  color:"#BB66FF",animation:"pulse .8s ease-in-out infinite",marginTop:2}}>
                  ✨ EVO READY!
                </div>
              )}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842"}}>💰{coins}G</div>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#F5C842"}}>★{totalStars}</div>
          </div>
        </div>

        {/* Daily banner */}
        {!dailyDone&&(
          <div style={{background:"linear-gradient(135deg,#1A1000,#2A1A00)",borderRadius:10,
            padding:"7px 12px",border:"1px solid #443300",flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#FF9933"}}>🔥 TODAY'S MISSION</div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#AA7722",marginTop:2}}>
                아무 유닛이나 클리어하면 보너스 EXP!
              </div>
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#FF9933"}}>🎁</div>
          </div>
        )}

        <div style={{textAlign:"center",fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#4A3A60",flexShrink:0}}>
          ── SELECT UNIT ──
        </div>

        {/* Unit grid */}
        <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",
          gap:"clamp(5px,1.5vmin,8px)",overflow:"hidden",minHeight:0}}>
          {[...Array(bookInfo?.units||12)].map((_,i)=>{
            const uid=i+1;
            const u=getUnitInfo(curBook||"ww5", uid);
            const ok=uid===1||Object.keys(unitStars).some(k=>{
              const [bk,un,_s]=k.split("_"); return bk===(curBook||"ww5")&&parseInt(un)===uid-1&&unitStars[k]>=1;
            });
            const bestStars=Math.max(0,...[0,1,2].map(s=>getUnitStars(uid,s)));
            return (
              <div key={uid}
                role="button"
                tabIndex={ok ? 0 : -1}
                aria-disabled={!ok}
                aria-label={`Unit ${uid}${ok?"":" (잠금)"}`}
                onClick={()=>ok&&setScreen(`unitdetail_${uid}`)}
                onKeyDown={e=>{if(ok&&(e.key==="Enter"||e.key===" ")){e.preventDefault();setScreen(`unitdetail_${uid}`);}}}
                className="card-btn"
                style={{
                  borderRadius:10,cursor:ok?"pointer":"not-allowed",
                  opacity:ok?1:.35,
                  background:bestStars===3?"linear-gradient(135deg,#0A1A08,#0A2A0A)":
                             bestStars>0?"#16122A":"#110F1E",
                  border:`2px solid ${bestStars===3?"#44CC7755":bestStars>0?"var(--rim)":"#1A1828"}`,
                  boxShadow:bestStars===3?"0 0 10px rgba(68,204,119,.2),0 3px 0 rgba(0,0,0,.5)":"0 3px 0 rgba(0,0,0,.5)",
                  display:"flex",alignItems:"center",gap:"clamp(5px,1.3vw,9px)",
                  padding:"clamp(7px,1.5vmin,11px) clamp(8px,1.8vw,12px)",
                }}>
                <span style={{fontSize:"clamp(20px,5vmin,28px)",flexShrink:0,
                  filter:ok?`drop-shadow(0 0 5px ${bestStars>0?"#F5C842":"rgba(255,255,255,.1)"})`:"none"}}>
                  {ok?u.emoji:"🔒"}
                </span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(8px,2.2vmin,10px)",
                    color:bestStars===3?"#44CC77":"#E8E0F0",marginBottom:2}}>Unit {uid}</div>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:800,
                    fontSize:"clamp(10px,2.6vmin,12px)",color:"#9080B0",
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.short}</div>
                  {bestStars>0&&<Stars count={bestStars} size="sm"/>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom nav */}
        <div style={{display:"flex",gap:7,flexShrink:0}}>
          {[
            {l:"📚", fn:()=>setScreen("bookselect"), bg:"linear-gradient(135deg,#1A3020,#2A5030)",sh:"#0A1810"},
            {l:"📖", fn:()=>setScreen("collection"), bg:"linear-gradient(135deg,#3A1880,#5A28B8)",sh:"#18083A"},
            {l:wrongWords.length>0?"⚔️🔴":"⚔️", fn:()=>setScreen("revenge"), bg:wrongWords.length>0?"linear-gradient(135deg,#3A0800,#660A00)":"#1C182E",sh:wrongWords.length>0?"#1A0000":"#080612"},
            {l:"🏆", fn:()=>setScreen("leaderboard"), bg:"linear-gradient(135deg,#1A1400,#2A2000)",sh:"#0A0800"},
            {l:"✨",  fn:tryEvolve, bg:evoReady?"linear-gradient(135deg,#6600CC,#AA44FF)":"#1C182E",sh:evoReady?"#330066":"#080612",disabled:!evoReady},
            {l:"🏠", fn:()=>setScreen("title"), bg:"#1C182E",sh:"#080612"},
          ].map((b,i)=>(
            <button key={i} className="big-btn" onClick={b.fn} disabled={b.disabled}
              style={{flex:1,padding:"clamp(9px,2vmin,12px) 4px",fontSize:"var(--fs-sm)",
                color:b.disabled?"#4A3A60":"#fff",background:b.bg,
                boxShadow:`0 4px 0 ${b.sh}`,opacity:b.disabled?.4:1}}>
              {b.l}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // UNIT DETAIL (stage select for a unit)
  if(screen&&screen.startsWith("unitdetail_")&&mon) {
    const uid=parseInt(screen.split("_")[1]);
    const u=getUnitInfo(curBook||"ww5", uid);
    const wordCount=getWordsForUnit(curBook||"ww5", uid).length;
    const STAGE_INFO=[
      {stg:0,label:"EXPLORE",desc:"영영 정의 → 영어 단어",color:"#44CC77",icon:"🔍"},
      {stg:1,label:"RECALL", desc:"한국어 뜻 → 영어 단어",color:"#FF9933",icon:"🧠",req:1},
      {stg:2,label:"MASTER", desc:"영어 단어 → 한국어 뜻",color:"#CC66FF",icon:"⭐",req:2},
    ];
    return (
      <div className="crt page slide-up" style={{
        background:"radial-gradient(ellipse at 50% 0%,#14102A,#0C0A18)"
      }}>
        <style>{CSS}</style>
        {/* VOC-103: 단계 진행바 */}
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
                role="button"
                tabIndex={locked ? -1 : 0}
                aria-disabled={locked}
                aria-label={`${label}${locked?" (잠금)":""}`}
                onClick={()=>!locked&&startBattle(uid,stg)}
                onKeyDown={e=>{if(!locked&&(e.key==="Enter"||e.key===" ")){e.preventDefault();startBattle(uid,stg);}}}
                className="card-btn"
                style={{
                  borderRadius:12,padding:"clamp(12px,2.5vh,16px)",
                  background:locked?"#0E0C1A":`linear-gradient(135deg,#14121E,${color}18)`,
                  border:`2px solid ${locked?"#1A1828":stars>0?color+"55":"var(--rim)"}`,
                  cursor:locked?"not-allowed":"pointer",opacity:locked?.4:1,
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
                    전 단계를 먼저 클리어하세요
                  </div>}
                  {!locked&&wrongQueue.length>0&&curUnit===uid&&battleStage===stg&&(
                    <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",
                      color:"#EE4444",marginTop:4,animation:"pulse .8s ease-in-out infinite"}}>
                      ⚠️ 오답 {wrongQueue.length}개 복습 필요!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Retry with wrong words */}
        {wrongQueue.length>0&&curUnit===uid&&(
          <button className="big-btn" onClick={()=>{
            setQueue(shuffle(wrongQueue)); setWrongQueue([]); setQIdx(0);
            setCurOpts(battleStage===2?getMasterOpts(wrongQueue[0]):getOpts(wrongQueue[0]));
            setPHp(mon.hp); setEHp(getEnemy(uid).hp);
            setWrongCount(0); setCorrectCount(0);
            setPhase("question"); setSel(null); setComboStr(0);
            setLog(["📝 오답 재도전!", "틀린 단어들만 출제됩니다."]);
            setScreen("battle");
          }} style={{width:"100%",maxWidth:400,padding:"clamp(12px,2.5vmin,16px)",
            fontSize:"var(--fs-sm)",color:"#fff",
            background:"linear-gradient(135deg,#881A1A,#BB2222)",boxShadow:"0 4px 0 #440000"}}>
            📝 오답 재도전 ({wrongQueue.length}개)
          </button>
        )}

        <button className="big-btn" onClick={()=>setScreen("world")}
          style={{width:"100%",maxWidth:400,padding:"clamp(10px,2.2vmin,13px)",
            fontSize:"var(--fs-sm)",color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612"}}>
          ← BACK
        </button>
        </div>{/* inner flex */}
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
                  : battleStage===1 ? `🇰🇷 ${word?.m}`
                  : `🔤 ${word?.w}`;
    const qHint   = battleStage===0 ? `🇰🇷 ${word?.m}` : battleStage===1 ? word?.def : word?.def;

    return (
      <div className="crt page slide-up" style={{background:"#0C0A18"}}>
        <style>{CSS}</style>
        <ToastLayer/>
        {/* VOC-103: 단계 진행바 */}
        <StepBar
          steps={[BOOK_SERIES.find(b=>b.id===(curBook||"ww5"))?.subtitle||"교재", `Unit ${curUnit}`, stgLabel]}
          current={2}
        />

        {/* Battle field */}
        <div style={{position:"relative",flex:"0 0 auto",height:"clamp(160px,30vh,240px)",overflow:"hidden"}}>
          {bgSvg}

          {/* Enemy nameplate – top left */}
          <div style={{position:"absolute",top:8,left:8,zIndex:3}}>
            <Nameplate name={curEnemy.name} typeName={curEnemy.type} typeClr={curEnemy.typeClr}
              hp={eHp} maxHp={curEnemy.hp} isEnemy/>
          </div>

          {/* Enemy sprite – top right
              z-index 높이면 attackE 때 플레이어 위에 렌더됨 */}
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

          {/* Damage pop – appears at receiver location */}
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

          {/* Player sprite – bottom left
              z-index 높이면 attackP 때 적 위에 렌더됨 */}
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

          {/* Player nameplate – bottom right */}
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
              animation:"comboZoom .5s ease-in-out infinite"}}>🔥×{comboStr}</div>
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
          {/* VOC-105: 정오답 피드백 오버레이 */}
          <FeedbackOverlay feedback={feedback}/>

          {/* VOC-103: Q n/8 + Unit label */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-xs)",color:"#9080B0"}}>
              {u?.emoji} Unit {curUnit}: {u?.name}
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",
              background:"#1C182E",padding:"3px 8px",borderRadius:6,color:"#F5C842",
              border:"1px solid #2E2848"}}>Q{qIdx+1}/{queue.length}</div>
          </div>

          {/* Question card */}
          {word&&(
            <div className="battle-panel" style={{padding:"clamp(9px,2vmin,13px) clamp(10px,2.5vw,15px)",flexShrink:0}}>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",
                color:"#888",marginBottom:5,textTransform:"uppercase",letterSpacing:".04em"}}>
                {battleStage===0?"▶ Definition → Word":battleStage===1?"▶ Korean → Word":"▶ Word → Korean"}
              </div>
              <div style={{fontFamily:"var(--f-ui)",fontWeight:800,
                fontSize:"clamp(14px,3.8vmin,17px)",
                color:"#18100E",lineHeight:1.65,wordBreak:"break-word"}}>
                {qPrompt}
              </div>
              <div style={{marginTop:6,paddingTop:6,borderTop:"2px solid #C8C0B0",
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
                  <button key={i} className={cls}
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
          <div ref={logRef} style={{flex:1,minHeight:0,overflowY:"auto",
            background:"#0A0818",borderRadius:8,border:"1px solid var(--rim)",
            padding:"clamp(5px,1.2vmin,8px) 12px"}}>
            {log.slice(-4).map((l,i,a)=>(
              <div key={i} style={{fontFamily:"var(--f-ui)",fontWeight:700,
                fontSize:"clamp(11px,2.8vmin,13px)",
                color:i===a.length-1?"#E8E0FF":"#5A4A78",marginBottom:3,lineHeight:1.5}}>{l}</div>
            ))}
          </div>

          {/* VOC-106: RUN AWAY + 저장 안내 */}
          <button className="big-btn" onClick={()=>{
            setToast("진행 상태 저장됨");
            setScreen("world");
          }}
            style={{flexShrink:0,padding:"clamp(10px,2.2vmin,13px)",
              fontSize:"var(--fs-xs)",color:"#8878AA",background:"#1C182E",boxShadow:"0 3px 0 #080612"}}>
            ← 중단하고 나가기
          </button>
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
      <div className="crt page slide-up" style={{
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
              {stars===3?"PERFECT! 전체 정답!":stars===2?"GOOD! 거의 다 맞혔어":"CLEAR! 다시 도전해봐"}
            </div>
          </div>
        )}

        {hasWrong&&won&&(
          <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-sm)",
            color:"#FF8844",marginBottom:16,
            background:"#1A0E08",padding:"8px 16px",borderRadius:10,border:"1px solid #442200"}}>
            ⚠️ 오답 {wrongQueue.length}개 — 복습 추천!
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300}}>
          {hasWrong&&won&&(
            <button className="big-btn" onClick={()=>{
              setScreen(`unitdetail_${curUnit}`);
            }} style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
              background:"linear-gradient(135deg,#881A1A,#BB2222)",boxShadow:"0 4px 0 #440000"}}>
              📝 오답 복습
            </button>
          )}
          <button className="big-btn" onClick={()=>setScreen("world")}
            style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
              background:"linear-gradient(135deg,#3C7020,#5AA030)",boxShadow:"0 4px 0 #1E3A10"}}>
            ▶ UNIT SELECT
          </button>
          {curUnit&&(
            <button className="big-btn" onClick={()=>startBattle(curUnit,battleStage,curBook)}
              style={{padding:"clamp(12px,2.5vmin,16px)",fontSize:"var(--fs-sm)",color:"#fff",
                background:"linear-gradient(135deg,#2A1880,#4A2AAA)",boxShadow:"0 4px 0 #0A0838"}}>
              🔄 RETRY
            </button>
          )}
        </div>
      </div>
    );
  }

  // COLLECTION
  // ── 알 부화 모달 ──────────────────────────────────
  if(eggHatch) {
    const line = CATCH_MON_LINES.find(l=>l.lineId===eggHatch.lineId);
    const Sp = eggHatch.mon.Sprite;
    return (
      <div style={{
        position:"fixed",inset:0,background:"#000",zIndex:9999,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        gap:20
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
          {line?.rarityLabel||"★★★★ Legendary"}
        </div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(20px,6vw,36px)",color:"#FFFFFF",textShadow:`0 0 30px ${line?.eggColor}`,textAlign:"center"}}>
          알이 부화했어!
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
        <button className="big-btn" onClick={()=>setEggHatch(null)} style={{
          marginTop:12,background:`linear-gradient(135deg,${line?.typeClr||"#7B2FBE"},${line?.eggColor||"#5533AA"})`,
          color:"#fff",fontSize:"clamp(14px,4vw,18px)"
        }}>
          도감에 추가! 🎉
        </button>
      </div>
    );
  }

  // ── 코인 샵 화면 ──────────────────────────────────
  if(screen==="shop") {
    const ITEMS = [
      { id:"egg_common",   emoji:"🥚",   name:"일반 알",        desc:"Common 몬스터 알",         price:50,  rarity:"common" },
      { id:"egg_rare",     emoji:"🥚✨",  name:"레어 알",        desc:"Rare 이상 확정",            price:150, rarity:"rare" },
      { id:"egg_sr",       emoji:"🌟",   name:"슈퍼레어 알",    desc:"Shadow/Bolt 확정",          price:350, rarity:"superrare" },
      { id:"hatch_now",    emoji:"💊",   name:"즉시 부화권",    desc:"첫 번째 알 바로 부화!",     price:80,  action:"hatch" },
      { id:"shield",       emoji:"🛡️",  name:"스트릭 실드",    desc:"하루 빠져도 스트릭 유지",   price:100, action:"shield" },
      { id:"title_warrior",emoji:"⚔️",  name:"칭호: 단어전사", desc:"이름 앞에 칭호 표시",       price:200, action:"title_warrior" },
    ];

    function buyItem(item) {
      if (coins < item.price) { setToast("코인이 부족해요!"); return; }
      setCoins(c => c - item.price);
      if (item.action === "hatch") {
        if (pendingEggs.length === 0) { setToast("부화할 알이 없어요!"); setCoins(c=>c+item.price); return; }
        const egg = pendingEggs[0];
        setCaughtMons(owned => {
          const caught = rollMonsterFromLine(egg.lineId, owned);
          if (!caught) return owned;
          setTimeout(() => setEggHatch({ mon: caught, lineId: egg.lineId }), 200);
          return owned.includes(caught.id) ? owned : [...owned, caught.id];
        });
        setPendingEggs(prev => prev.slice(1));
        setToast("💊 즉시 부화!");
      } else if (item.action === "shield") {
        setStreakShields(s => s + 1);
        setToast("🛡️ 실드 +1! 하루 빠져도 스트릭 유지");
      } else if (item.rarity) {
        const possLines = EGG_DROP[item.rarity] || EGG_DROP.common;
        const lineId2 = possLines[Math.floor(Math.random() * possLines.length)];
        setPendingEggs(prev => [...prev, { id: Date.now(), rarity: item.rarity, lineId: lineId2, answersLeft: 10 }]);
        setToast(`${item.emoji} ${item.name} 구매 완료! 정답 10개로 부화`);
      } else {
        setToast(`${item.emoji} ${item.name} 구매 완료!`);
      }
    }

    return (
      <div className="crt page-y slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.2vh,14px)",
        background:"radial-gradient(ellipse at top,#001A0A,#0C0A18)"}}>
        <style>{CSS}</style>
        <ToastLayer/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#44FF88"}}>🛒 SHOP</div>
          <div style={{background:"#1A2A1A",borderRadius:20,padding:"6px 14px",
            border:"1px solid #226633",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:16}}>🪙</span>
            <span style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#F5C842",fontWeight:800}}>{coins}G</span>
          </div>
        </div>

        {/* 실드 현황 */}
        {streakShields > 0 && (
          <div style={{background:"#0A1A0A",borderRadius:10,padding:"8px 14px",border:"1px solid #33664433",
            fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#44AA66",flexShrink:0}}>
            🛡️ 스트릭 실드 {streakShields}개 보유 중
          </div>
        )}

        {/* 아이템 목록 */}
        <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
          {ITEMS.map(item => {
            const canBuy = coins >= item.price;
            const isHatchDisabled = item.action==="hatch" && pendingEggs.length===0;
            return (
              <div key={item.id} style={{
                background:"#16122A",borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
                border:"1px solid #2A2440",display:"flex",alignItems:"center",gap:12,
                opacity: isHatchDisabled ? 0.4 : 1
              }}>
                <div style={{fontSize:"clamp(28px,7vmin,36px)",flexShrink:0}}>{item.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"var(--f-ui)",fontWeight:800,
                    fontSize:"clamp(13px,3.5vw,15px)",color:"#E0D8FF"}}>{item.name}</div>
                  <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",
                    color:"#6A5888",marginTop:2}}>{item.desc}</div>
                </div>
                <button onClick={()=>!isHatchDisabled&&buyItem(item)} style={{
                  background:canBuy&&!isHatchDisabled
                    ?"linear-gradient(135deg,#226633,#44AA55)"
                    :"#1A1A2A",
                  color:canBuy&&!isHatchDisabled?"#fff":"#4A3A60",
                  border:`1px solid ${canBuy&&!isHatchDisabled?"#44AA5544":"#2A2440"}`,
                  borderRadius:10,padding:"8px 14px",fontWeight:700,
                  fontSize:"clamp(12px,3vw,14px)",cursor:canBuy&&!isHatchDisabled?"pointer":"default",
                  whiteSpace:"nowrap",flexShrink:0
                }}>
                  🪙{item.price}G
                </button>
              </div>
            );
          })}
        </div>

        <button className="big-btn" onClick={()=>setScreen("title")} style={{
          padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
          color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612",flexShrink:0}}>
          ← BACK
        </button>
      </div>
    );
  }

  // ── REVENGE LAND 화면 ─────────────────────────────
  if(screen==="revenge") {
    const [rIdx, setRIdx] = React.useState(0);
    const [rSel, setRSel] = React.useState(null);
    const [rCorrect, setRCorrect] = React.useState(0);
    const [rDone, setRDone] = React.useState(false);
    const words = wrongWords.slice(0, 10);
    const cur = words[rIdx];
    if(words.length === 0) return (
      <div className="crt page slide-up" style={{alignItems:"center",justifyContent:"center",gap:20,
        background:"radial-gradient(ellipse at top,#0A1A0A,#0C0A18)"}}>
        <style>{CSS}</style>
        <div style={{fontSize:"clamp(48px,14vw,80px)"}}>🎉</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-lg)",color:"#44FF88",textAlign:"center"}}>
          모든 단어 복습 완료!
        </div>
        <div style={{fontFamily:"var(--f-ui)",color:"#6A5888",fontSize:"var(--fs-sm)"}}>
          틀린 단어가 없어요
        </div>
        <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}>← BACK</button>
      </div>
    );
    if(rDone) return (
      <div className="crt page slide-up" style={{alignItems:"center",justifyContent:"center",gap:20,
        background:"radial-gradient(ellipse at top,#0A0A2A,#0C0A18)"}}>
        <style>{CSS}</style>
        <div style={{fontSize:"clamp(48px,14vw,80px)"}}>⚔️</div>
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-lg)",color:"#FFD700",textAlign:"center"}}>
          Revenge 완료!
        </div>
        <div style={{fontFamily:"var(--f-ui)",color:"#9988CC",fontSize:"var(--fs-sm)",textAlign:"center"}}>
          {rCorrect}/{words.length} 정답<br/>
          {rCorrect===words.length?"완벽! 단어 해방 +200 EXP 🎉":"다시 도전해봐!"}
        </div>
        <button className="big-btn" style={{background:"linear-gradient(135deg,#AA2200,#CC4400)"}}
          onClick={()=>{
            if(rCorrect===words.length){
              setWrongWords(prev=>prev.slice(words.length));
              setMonExp(e=>{const ne=e+200;const th=monLv*80;if(ne>=th){setMonLv(l=>l+1);return ne-th;}return ne;});
              setToast("⚔️ Revenge 완료! 단어 해방 +200 EXP");
            }
            setScreen(mon?"world":"title");
          }}>
          {rCorrect===words.length?"단어 해방! ✨":"← BACK"}
        </button>
      </div>
    );
    // 선택지 생성 (4지선다)
    const allMs = words.map(x=>x.m);
    const opts = cur ? shuffle([cur.m,...allMs.filter(m=>m!==cur.m).sort(()=>Math.random()-0.5).slice(0,3)]) : [];
    return (
      <div className="crt page slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2.5vh,16px)",
        background:"radial-gradient(ellipse at top,#0A0118,#0C0A18)"}}>
        <style>{CSS}</style>
        {/* 헤더 */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#FF4444"}}>
            ⚔️ REVENGE LAND
          </div>
          <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-sm)",color:"#FF8888"}}>
            {rIdx+1}/{words.length}
          </div>
        </div>
        {/* 진행 바 */}
        <div style={{height:6,background:"#2A1A1A",borderRadius:3,flexShrink:0}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#FF4444,#FF8800)",
            borderRadius:3,width:`${((rIdx)/(words.length))*100}%`,transition:"width 0.5s"}}/>
        </div>
        {/* 고블린 보스 */}
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:"clamp(48px,14vw,72px)",animation:"floatBob 2s ease-in-out infinite"}}>👾</div>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#FF6644",marginTop:4}}>
            이 단어를 훔쳐간 고블린을 잡아라!
          </div>
        </div>
        {/* 문제 카드 */}
        <div style={{background:"linear-gradient(135deg,#1A0010,#2A0518)",borderRadius:16,
          padding:"clamp(16px,4vw,24px)",border:"2px solid #FF444466",textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(22px,6vw,36px)",color:"#FF8888",marginBottom:8}}>
            {cur?.w}
          </div>
          {cur?.def && <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#886688",lineHeight:1.5}}>
            {cur.def}
          </div>}
        </div>
        {/* 선택지 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(8px,2vw,12px)",flex:1}}>
          {opts.map(opt=>{
            const isCorrect = opt===cur?.m;
            const selected = rSel!==null;
            let bg = "linear-gradient(135deg,#1C0A28,#28103A)";
            let border = "2px solid #4A2060";
            if(selected && opt===rSel) {
              bg = isCorrect?"linear-gradient(135deg,#0A3A1A,#0A5A22)":"linear-gradient(135deg,#3A0A0A,#5A0A0A)";
              border = isCorrect?"2px solid #44FF66":"2px solid #FF4444";
            } else if(selected && isCorrect) {
              bg = "linear-gradient(135deg,#0A3A1A,#0A5A22)";
              border = "2px solid #44FF66";
            }
            return (
              <button key={opt} onClick={()=>{
                if(rSel!==null)return;
                setRSel(opt);
                if(opt===cur?.m) setRCorrect(c=>c+1);
                setTimeout(()=>{
                  if(rIdx+1>=words.length) setRDone(true);
                  else { setRIdx(i=>i+1); setRSel(null); }
                },900);
              }} style={{
                background:bg,border,borderRadius:14,
                padding:"clamp(12px,3vw,18px) clamp(8px,2vw,12px)",
                fontFamily:"var(--f-ui)",fontWeight:700,
                fontSize:"clamp(13px,3.5vw,17px)",color:"#E0D8FF",
                cursor:selected?"default":"pointer",
                textAlign:"center",lineHeight:1.3,
              }}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── LEADERBOARD 화면 ──────────────────────────────
  if(screen==="leaderboard") {
    const [lbData, setLbData] = React.useState(null);
    React.useEffect(()=>{
      import("./supabase.js").then(({supabase})=>{
        if(!supabase){setLbData([]);return;}
        supabase.from("progress")
          .select("name,data")
          .eq("class_code", player.classCode)
          .then(({data})=>{
            if(!data){setLbData([]);return;}
            const rows = data.map(r=>({
              name:r.name,
              caught:(r.data?.caughtMons||[]).length,
              stars: Object.values(r.data?.unitStars||{}).reduce((a,b)=>a+b,0),
              monLv: r.data?.monLv||1,
            })).sort((a,b)=>b.caught-a.caught||b.stars-a.stars);
            setLbData(rows);
          });
      });
    },[]);
    const medals = ["🥇","🥈","🥉"];
    return (
      <div className="crt page-y slide-up" style={{
        padding:"clamp(12px,3vw,20px)",gap:"clamp(10px,2vh,14px)",
        background:"radial-gradient(ellipse at top,#1A1400,#0C0A18)"}}>
        <style>{CSS}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#FFD700"}}>
            🏆 RANKING
          </div>
          <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888"}}>
            {player?.classCode}반
          </div>
        </div>
        <div style={{fontFamily:"var(--f-ui)",fontSize:"var(--fs-xs)",color:"#6A5888",textAlign:"center",flexShrink:0}}>
          몬스터 많이 모은 순서
        </div>
        {lbData===null?(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"var(--f-pk)",color:"#4A3A60",fontSize:"var(--fs-sm)"}}>불러오는 중...</div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
            {lbData.length===0&&(
              <div style={{textAlign:"center",fontFamily:"var(--f-pk)",color:"#4A3A60",
                fontSize:"var(--fs-sm)",marginTop:40}}>아직 데이터가 없어요</div>
            )}
            {lbData.map((row,i)=>{
              const isMe = row.name===player?.name;
              return (
                <div key={i} style={{
                  background:isMe?"linear-gradient(135deg,#1A0838,#280A50)":"#16122A",
                  border:isMe?"2px solid #7B2FBE":"1px solid #2A2440",
                  borderRadius:14,padding:"clamp(10px,2.5vw,14px)",
                  display:"flex",alignItems:"center",gap:12,
                }}>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,5vw,24px)",minWidth:36,textAlign:"center"}}>
                    {i<3?medals[i]:i+1}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"var(--f-ui)",fontWeight:800,
                      fontSize:"clamp(13px,3.5vw,16px)",color:isMe?"#C77DFF":"#E0D8FF",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {row.name}{isMe?" (나)":""}
                    </div>
                    <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:2}}>
                      Lv.{row.monLv} · ★{row.stars}
                    </div>
                  </div>
                  <div style={{textAlign:"center",flexShrink:0}}>
                    <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(18px,5vw,24px)",color:"#FFD700"}}>
                      {row.caught}
                    </div>
                    <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888"}}>
                      마리
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")} style={{
          padding:"clamp(10px,2.2vmin,13px)",fontSize:"var(--fs-sm)",
          color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612",flexShrink:0}}>
          ← BACK
        </button>
      </div>
    );
  }

  // ── COLLECTION 화면 (새 버전) ─────────────────────
  if(screen==="collection") {
    // A monster is "owned/seen" if its line is unlocked (partner system)
    const isOwned = (lineId2, si) => {
      if(!unlockLine(lineId2)) return false;
      if(lineId===lineId2) return si<=stageIdx;
      return si===0;
    };

    // 총 catch 몬스터 수
    const totalCatch = CATCH_MON_LINES.flatMap(l=>l.stages).length; // 18
    const ownedCount = caughtMons.length;
    return (
      <div className="crt page-y slide-up" style={{
        padding:"clamp(10px,2.5vw,16px)",gap:10,
        background:"radial-gradient(ellipse at top,#1A0A2E,#0C0A18)"}}>
        <style>{CSS}</style>
        {/* 헤더 */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-md)",color:"#F5C842"}}>📖 MONSTER DEX</div>
          <div style={{fontFamily:"var(--f-ui)",fontWeight:800,fontSize:"var(--fs-sm)",color:"#F5C842"}}>
            {ownedCount}/{totalCatch}마리
          </div>
        </div>

        {/* ── 새 수집 몬스터 도감 ── */}
        <div style={{background:"#16122A",borderRadius:12,padding:12,border:"1px solid #7B2FBE44",flexShrink:0}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#C77DFF",marginBottom:10}}>
            ✨ 수집한 몬스터
          </div>
          {CATCH_MON_LINES.map(line=>{
            const ownedInLine = line.stages.filter(s=>caughtMons.includes(s.id));
            return (
              <div key={line.lineId} style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <span style={{fontSize:14}}>{line.eggEmoji}</span>
                  <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(7px,1.8vmin,9px)",color:line.typeClr}}>
                    {line.type} TYPE
                  </span>
                  <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:line.rarityClr,marginLeft:4}}>
                    {line.rarityLabel}
                  </span>
                  <span style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888",marginLeft:"auto"}}>
                    {ownedInLine.length}/{line.stages.length}
                  </span>
                </div>
                <div style={{display:"flex",gap:"clamp(4px,1.5vw,10px)"}}>
                  {line.stages.map((st,si)=>{
                    const owned = caughtMons.includes(st.id);
                    const Sp = st.Sprite;
                    return (
                      <div key={st.id} style={{flex:1,textAlign:"center",
                        background:owned?`${line.typeBg}`:"#0E0C1A",
                        borderRadius:10,padding:"8px 4px",
                        border:`1px solid ${owned?line.typeClr+"44":"#2A2440"}`,
                        opacity:owned?1:0.35}}>
                        {owned ? (
                          <div style={{animation:`floatBob ${2+si*.4}s ease-in-out infinite`}}>
                            <Sp w={Math.min(48,Math.max(28,Math.floor(window.innerWidth*0.1)))}/>
                          </div>
                        ) : (
                          <div style={{filter:"brightness(0)",opacity:0.3}}>
                            <Sp w={Math.min(48,Math.max(28,Math.floor(window.innerWidth*0.1)))}/>
                          </div>
                        )}
                        <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.3vmin,7px)",
                          color:owned?line.typeClr:"#2A2440",marginTop:4}}>
                          {owned?st.name:"???"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 알 현황 */}
        {pendingEggs.length>0&&(
          <div style={{background:"#16122A",borderRadius:12,padding:12,border:"1px solid #3A2060",flexShrink:0}}>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#9966CC",marginBottom:8}}>
              🥚 알 부화 중
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {pendingEggs.map((egg,i)=>{
                const line=CATCH_MON_LINES.find(l=>l.lineId===egg.lineId);
                return (
                  <div key={i} style={{background:"#0E0C1A",borderRadius:10,padding:"8px 12px",
                    border:`1px solid ${line?.eggColor||"#7B2FBE"}44`,textAlign:"center"}}>
                    <div style={{fontSize:"clamp(20px,5vmin,28px)"}}>{line?.eggEmoji||"🥚"}</div>
                    <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",
                      color:line?.rarityClr||"#AAAAAA",marginTop:2}}>{line?.rarityLabel||"Common"}</div>
                    <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"clamp(7px,1.8vmin,10px)",
                      color:"#6A5888",marginTop:2}}>
                      {egg.unitsLeft}유닛 후 부화
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 파트너 몬스터 섹션 */}
        <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#F5C842",flexShrink:0,marginTop:4}}>
          🤝 파트너 몬스터 (★별로 해금)
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
        {EVO_LINES.map(line=>{
          const locked=!unlockLine(line.lineId);
          return (
            <div key={line.lineId} style={{background:"#16122A",borderRadius:12,padding:12,border:"1px solid var(--rim)"}}>
              <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",
                color:line.stages[0].color,marginBottom:10}}>
                {line.lineId.toUpperCase()} LINE {locked?"🔒":`(★${MON_UNLOCK_STARS[line.lineId]} to unlock)`}
              </div>
              <div style={{display:"flex",gap:"clamp(6px,2vw,14px)",justifyContent:"center",alignItems:"flex-end"}}>
                {line.stages.map((st,si)=>{
                  const owned2=isOwned(line.lineId,si);
                  return (
                    <div key={si} style={{textAlign:"center",flex:1,opacity:owned2?1:.25}}>
                      <div style={{animation:owned2?`floatBob ${2+si*.4}s ease-in-out infinite`:"none"}}>
                        <st.Sprite w={Math.min(52+si*10,Math.max(34+si*8,Math.floor(window.innerWidth*(0.09+si*.02))))}/>
                      </div>
                      <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",
                        color:owned2?st.color:"#2A2440",marginTop:4}}>
                        {owned2?st.name:`Lv.${st.evoLv||36}+`}
                      </div>
                      <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.2vmin,6px)",
                        color:"#4A3A60",marginTop:2}}>
                        {owned2?`HP${st.hp} ATK${st.atk}`:"???"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Hidden */}
        <div style={{background:totalStars>=30?"linear-gradient(135deg,#1A0838,#280A50)":"#0E0C1A",
          borderRadius:12,padding:12,border:`1px solid ${totalStars>=30?"#BB66FF44":"var(--rim)"}`,
          display:"flex",alignItems:"center",gap:12}}>
          <div style={{opacity:totalStars>=30?1:.2,animation:totalStars>=30?"floatBob 2.5s ease-in-out infinite":"none"}}>
            <LexivoreSprite w={Math.min(70,Math.max(48,Math.floor(window.innerWidth*.14)))}/>
          </div>
          <div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-sm)",color:"#BB66FF"}}>
              {totalStars>=30?"LEXIVORE":"???"}
            </div>
            <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(6px,1.5vmin,8px)",color:"#6A5888",marginTop:4}}>
              {totalStars>=30?"VOID TYPE · The ultimate partner":"🔒 Collect ★30 to reveal"}
            </div>
            {totalStars>=30&&<div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#9966CC",marginTop:4}}>HP{HIDDEN_MON.hp} ATK{HIDDEN_MON.atk} DEF{HIDDEN_MON.def}</div>}
            {totalStars<30&&(
              <div style={{marginTop:6}}>
                <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
                  {[...Array(30)].map((_,i)=>(
                    <span key={i} style={{fontSize:"clamp(8px,2vmin,11px)",
                      color:i<totalStars?"#F5C842":"#2A2440"}}>★</span>
                  ))}
                </div>
                <div style={{fontFamily:"var(--f-ui)",fontWeight:700,fontSize:"var(--fs-xs)",color:"#6A5888",marginTop:4}}>
                  {totalStars}/30 ★
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unit progress grid */}
        <div style={{background:"#16122A",borderRadius:12,padding:12,border:"1px solid var(--rim)"}}>
          <div style={{fontFamily:"var(--f-pk)",fontSize:"var(--fs-xs)",color:"#F5C842",marginBottom:10}}>
            UNIT PROGRESS · {BOOK_SERIES.find(b=>b.id===(curBook||"ww5"))?.subtitle}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>
            {[...Array(12)].map((_,i)=>{
              const uid=i+1;
              const u=getUnitInfo(curBook||"ww5", uid);
              const best=Math.max(0,...[0,1,2].map(s=>getUnitStars(uid,s)));
              return (
                <div key={uid} style={{textAlign:"center"}}>
                  <div style={{fontSize:"clamp(16px,4vmin,22px)"}}>{u.emoji}</div>
                  <div style={{fontFamily:"var(--f-pk)",fontSize:"clamp(5px,1.2vmin,6px)",
                    color:"#6A5888",marginBottom:2}}>U{uid}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:1}}>
                    {[0,1,2].map(j=>(
                      <span key={j} style={{fontSize:"clamp(8px,2vmin,10px)",
                        color:j<best?"#F5C842":"#2A2440"}}>★</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        </div>{/* end EVO_LINES outer div */}

        <button className="big-btn" onClick={()=>setScreen(mon?"world":"title")}
          style={{padding:"clamp(10px,2.2vmin,14px)",fontSize:"var(--fs-sm)",
            color:"#8878AA",background:"#1C182E",boxShadow:"0 4px 0 #080612",marginBottom:8}}>
          ← BACK
        </button>
      </div>
    );
  }

  // VOC-106: 전역 저장 토스트 (screen이 null일 때 fallback 포함)
  return toast ? <Toast msg={toast} onDone={()=>setToast(null)}/> : null;
}
