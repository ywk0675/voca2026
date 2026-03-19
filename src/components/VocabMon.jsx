import React, { useState, useEffect, useRef, useCallback } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PLAYER MONSTERS — face RIGHT naturally (no flip needed)
//  Cute, round, big eyes. Original designs.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── INK LINE ─────────────────────────────────────────
// INKLET – pudgy ink ghost, big glossy eyes, tiny quill horn (faces right)
const InkletSprite = ({ w = 80, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 5px 10px #2244CC88)"
        }}>
        {/* quill horn */}
        <rect x="28" y="2" width="3" height="12" fill="#F0E8CC" />
        <rect x="27" y="4" width="2" height="8" fill="#DDD4AA" />
        <rect x="30" y="4" width="2" height="8" fill="#DDD4AA" />
        <rect x="28" y="12" width="3" height="3" fill="#1A1A88" />
        {/* ink drip tip */}
        <rect x="29" y="0" width="1" height="3" fill="#4455FF" />
        {/* body – big round blob */}
        <rect x="8" y="20" width="32" height="22" fill="#3344DD" />
        <rect x="6" y="22" width="36" height="18" fill="#3344DD" />
        <rect x="10" y="16" width="28" height="6" fill="#3344DD" />
        <rect x="14" y="13" width="20" height="5" fill="#3344DD" />
        {/* body shine top-left */}
        <rect x="10" y="17" width="10" height="7" fill="#6677FF" opacity="0.55" />
        <rect x="11" y="18" width="6" height="4" fill="#99AAFF" opacity="0.4" />
        {/* belly lighter patch */}
        <rect x="14" y="28" width="14" height="10" fill="#4A55EE" opacity="0.5" />
        {/* RIGHT-facing eyes (eyes on right side of face) */}
        <rect x="22" y="19" width="10" height="10" fill="#fff" />
        <rect x="32" y="21" width="8" height="8" fill="#fff" />
        <rect x="24" y="20" width="7" height="8" fill="#0A0A3A" />
        <rect x="33" y="22" width="5" height="6" fill="#0A0A3A" />
        <rect x="26" y="21" width="3" height="4" fill="#4466FF" />
        <rect x="34" y="23" width="2" height="3" fill="#4466FF" />
        {/* eye glints */}
        <rect x="24" y="21" width="2" height="2" fill="#fff" opacity="0.9" />
        <rect x="33" y="23" width="1" height="1" fill="#fff" opacity="0.9" />
        {/* tiny smile */}
        <rect x="28" y="30" width="8" height="2" fill="#2233BB" />
        <rect x="30" y="32" width="4" height="2" fill="#2233BB" />
        {/* ink drip legs */}
        <rect x="12" y="40" width="6" height="6" fill="#2233BB" />
        <rect x="22" y="42" width="5" height="5" fill="#2233BB" />
        <rect x="30" y="40" width="6" height="6" fill="#2233BB" />
        <rect x="12" y="44" width="6" height="3" fill="#1122AA" />
        <rect x="30" y="44" width="6" height="3" fill="#1122AA" />
        {/* tiny arms */}
        <rect x="4" y="28" width="5" height="4" fill="#3344DD" />
        <rect x="2" y="30" width="4" height="3" fill="#2233CC" />
    </svg>
);

// QUILLON – ink knight, rounded armor, big cute visor eyes (faces right)
const QuillonSprite = ({ w = 88, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 5px 12px #3355DD88)"
        }}>
        {/* feather sword (right side since facing right) */}
        <rect x="38" y="4" width="4" height="24" fill="#F0E8CC" />
        <rect x="37" y="6" width="3" height="18" fill="#DDD4AA" />
        <rect x="41" y="6" width="3" height="18" fill="#DDD4AA" />
        <rect x="38" y="2" width="4" height="4" fill="#4455FF" />
        <rect x="37" y="26" width="6" height="4" fill="#997700" />
        {/* cape (left side) */}
        <rect x="2" y="22" width="8" height="20" fill="#1A1A77" />
        <rect x="0" y="24" width="8" height="16" fill="#2222AA" />
        {/* body */}
        <rect x="10" y="18" width="26" height="22" fill="#3344DD" />
        <rect x="8" y="20" width="30" height="18" fill="#3344DD" />
        {/* chest plate */}
        <rect x="12" y="20" width="22" height="14" fill="#4455EE" />
        <rect x="14" y="22" width="18" height="10" fill="#5566FF" />
        {/* ink emblem on chest */}
        <rect x="19" y="24" width="8" height="2" fill="#AABBFF" opacity="0.7" />
        <rect x="21" y="27" width="4" height="3" fill="#AABBFF" opacity="0.5" />
        {/* round helmet */}
        <rect x="12" y="4" width="24" height="16" fill="#3344DD" />
        <rect x="10" y="6" width="28" height="12" fill="#3344DD" />
        <rect x="14" y="2" width="20" height="4" fill="#4455EE" />
        {/* visor — cute wide eye slit, right-side weighted */}
        <rect x="10" y="9" width="28" height="6" fill="#0A1177" />
        <rect x="12" y="10" width="24" height="4" fill="#0D1499" />
        {/* glowing eyes through visor */}
        <rect x="20" y="10" width="8" height="4" fill="#5588FF" />
        <rect x="28" y="10" width="8" height="3" fill="#7799FF" />
        <rect x="22" y="10" width="4" height="3" fill="#AACCFF" />
        <rect x="30" y="10" width="4" height="2" fill="#AACCFF" />
        {/* helmet crest */}
        <rect x="20" y="0" width="8" height="4" fill="#4455EE" />
        <rect x="22" y="0" width="4" height="2" fill="#6677FF" />
        {/* legs */}
        <rect x="12" y="38" width="9" height="8" fill="#2233CC" />
        <rect x="24" y="38" width="9" height="8" fill="#2233CC" />
        <rect x="11" y="44" width="11" height="3" fill="#1122BB" />
        <rect x="23" y="44" width="11" height="3" fill="#1122BB" />
        {/* sword arm */}
        <rect x="36" y="20" width="6" height="8" fill="#3344DD" />
    </svg>
);

// SCRIPTAR – majestic scroll mage, billowy robe, big wise eyes (faces right)
const ScriptarSprite = ({ w = 96, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 6px 16px #2255FF99)"
        }}>
        {/* orbiting mini scrolls */}
        <rect x="0" y="8" width="9" height="6" fill="#F0E8CC" />
        <rect x="0" y="8" width="9" height="2" fill="#DDD4AA" />
        <rect x="0" y="12" width="9" height="2" fill="#DDD4AA" />
        <rect x="1" y="10" width="7" height="2" fill="#5566FF" opacity="0.5" />
        <rect x="38" y="14" width="9" height="6" fill="#F0E8CC" />
        <rect x="38" y="14" width="9" height="2" fill="#DDD4AA" />
        <rect x="38" y="18" width="9" height="2" fill="#DDD4AA" />
        <rect x="39" y="16" width="7" height="2" fill="#5566FF" opacity="0.5" />
        {/* big flowing robe */}
        <rect x="6" y="22" width="36" height="24" fill="#2233BB" />
        <rect x="4" y="24" width="40" height="20" fill="#2233BB" />
        <rect x="2" y="28" width="10" height="16" fill="#1A2299" />
        <rect x="36" y="28" width="10" height="16" fill="#1A2299" />
        {/* robe star pattern */}
        <rect x="18" y="28" width="12" height="10" fill="#3344CC" />
        <rect x="20" y="30" width="8" height="6" fill="#5566EE" />
        <rect x="22" y="31" width="4" height="4" fill="#8899FF" />
        <rect x="23" y="32" width="2" height="2" fill="#CCddFF" />
        {/* body under robe */}
        <rect x="10" y="12" width="28" height="12" fill="#3344DD" />
        <rect x="8" y="14" width="32" height="10" fill="#3344DD" />
        {/* big round head */}
        <rect x="10" y="2" width="28" height="14" fill="#2233CC" />
        <rect x="8" y="4" width="32" height="12" fill="#3344DD" />
        {/* wizard hat */}
        <rect x="14" y="0" width="20" height="4" fill="#2233BB" />
        <rect x="8" y="2" width="32" height="4" fill="#1A2299" />
        <rect x="18" y="0" width="12" height="2" fill="#3344CC" />
        {/* hat star */}
        <rect x="22" y="0" width="4" height="2" fill="#AABBFF" />
        {/* ink beard */}
        <rect x="12" y="13" width="8" height="5" fill="#3355EE" />
        <rect x="14" y="16" width="6" height="4" fill="#4466FF" />
        {/* big right-weighted eyes */}
        <rect x="20" y="6" width="10" height="8" fill="#fff" />
        <rect x="30" y="6" width="8" height="8" fill="#fff" />
        <rect x="22" y="7" width="7" height="6" fill="#0A0A3A" />
        <rect x="31" y="7" width="5" height="6" fill="#0A0A3A" />
        <rect x="24" y="8" width="3" height="3" fill="#5588FF" />
        <rect x="32" y="8" width="2" height="3" fill="#5588FF" />
        <rect x="22" y="7" width="2" height="2" fill="#fff" opacity="0.9" />
        <rect x="31" y="7" width="1" height="1" fill="#fff" opacity="0.9" />
        {/* staff (right hand) */}
        <rect x="40" y="8" width="4" height="36" fill="#885522" />
        <rect x="38" y="6" width="8" height="8" fill="#4455FF" />
        <rect x="40" y="4" width="4" height="4" fill="#8899FF" />
        <rect x="41" y="3" width="2" height="3" fill="#CCDDFF" />
        {/* hands */}
        <rect x="2" y="26" width="6" height="5" fill="#2233BB" />
        <rect x="40" y="26" width="6" height="5" fill="#2233BB" />
    </svg>
);

// ── RUNE LINE ─────────────────────────────────────────
// RUNIX – chubby pebble creature, amber eyes, rune glow (faces right)
const RunixSprite = ({ w = 80, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 5px 10px #CC880044)"
        }}>
        {/* floating pebble chips */}
        <rect x="2" y="12" width="5" height="5" fill="#998877" opacity="0.7" />
        <rect x="40" y="18" width="4" height="4" fill="#887766" opacity="0.6" />
        <rect x="4" y="22" width="3" height="3" fill="#AA9988" opacity="0.5" />
        {/* chubby round stone body */}
        <rect x="8" y="20" width="32" height="22" fill="#AA9988" />
        <rect x="6" y="22" width="36" height="18" fill="#BBAA99" />
        <rect x="10" y="16" width="28" height="6" fill="#AA9988" />
        <rect x="14" y="13" width="20" height="5" fill="#BBAA99" />
        {/* stone texture */}
        <rect x="8" y="24" width="6" height="3" fill="#998877" opacity="0.5" />
        <rect x="30" y="28" width="8" height="3" fill="#998877" opacity="0.4" />
        {/* carved rune on chest */}
        <rect x="16" y="26" width="14" height="2" fill="#FF9900" />
        <rect x="20" y="28" width="6" height="5" fill="#FF9900" />
        <rect x="16" y="33" width="14" height="2" fill="#FF9900" />
        {/* rune glow */}
        <rect x="17" y="27" width="12" height="8" fill="#FFAA00" opacity="0.2" />
        <rect x="19" y="29" width="8" height="4" fill="#FFCC44" opacity="0.25" />
        {/* big right-facing eyes */}
        <rect x="22" y="18" width="10" height="10" fill="#FF9900" />
        <rect x="32" y="20" width="8" height="8" fill="#FF9900" />
        <rect x="24" y="19" width="7" height="8" fill="#FFCC44" />
        <rect x="33" y="21" width="5" height="6" fill="#FFCC44" />
        <rect x="26" y="21" width="3" height="4" fill="#1A0A00" />
        <rect x="34" y="22" width="2" height="3" fill="#1A0A00" />
        <rect x="24" y="19" width="2" height="2" fill="#fff" opacity="0.8" />
        <rect x="33" y="21" width="1" height="1" fill="#fff" opacity="0.8" />
        {/* stubby cute legs */}
        <rect x="12" y="40" width="8" height="7" fill="#998877" />
        <rect x="26" y="40" width="8" height="7" fill="#998877" />
        <rect x="11" y="45" width="10" height="3" fill="#887766" />
        <rect x="25" y="45" width="10" height="3" fill="#887766" />
        {/* tiny arms */}
        <rect x="2" y="28" width="6" height="5" fill="#AA9988" />
        <rect x="40" y="28" width="6" height="5" fill="#AA9988" />
    </svg>
);

// GLYPHON – beefy stone warrior, cute determined face (faces right)
const GlyphonSprite = ({ w = 88, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 5px 14px #BB660044)"
        }}>
        {/* chunky horns */}
        <rect x="10" y="2" width="8" height="10" fill="#998877" />
        <rect x="30" y="2" width="8" height="10" fill="#998877" />
        <rect x="12" y="0" width="5" height="6" fill="#BBAA99" />
        <rect x="31" y="0" width="5" height="6" fill="#BBAA99" />
        {/* big round head */}
        <rect x="8" y="8" width="32" height="16" fill="#BBAA99" />
        <rect x="6" y="10" width="36" height="12" fill="#BBAA99" />
        {/* forehead rune */}
        <rect x="18" y="8" width="12" height="2" fill="#FF9900" opacity="0.8" />
        <rect x="22" y="10" width="4" height="2" fill="#FFBB44" opacity="0.7" />
        {/* big cute right-facing eyes */}
        <rect x="22" y="12" width="10" height="9" fill="#FF9900" />
        <rect x="32" y="13" width="8" height="8" fill="#FF9900" />
        <rect x="24" y="13" width="7" height="7" fill="#FFCC44" />
        <rect x="33" y="14" width="5" height="6" fill="#FFCC44" />
        <rect x="26" y="15" width="3" height="3" fill="#1A0A00" />
        <rect x="34" y="15" width="2" height="3" fill="#1A0A00" />
        <rect x="24" y="13" width="2" height="2" fill="#fff" opacity="0.8" />
        <rect x="33" y="14" width="1" height="1" fill="#fff" opacity="0.8" />
        {/* determined brow */}
        <rect x="22" y="11" width="10" height="2" fill="#887766" />
        <rect x="32" y="12" width="7" height="2" fill="#887766" />
        {/* body */}
        <rect x="8" y="22" width="32" height="22" fill="#BBAA99" />
        <rect x="6" y="24" width="36" height="18" fill="#BBAA99" />
        {/* chest rune gem */}
        <rect x="16" y="26" width="16" height="12" fill="#AA9988" />
        <rect x="18" y="28" width="12" height="8" fill="#CC9966" />
        <rect x="20" y="30" width="8" height="4" fill="#FFAA00" />
        <rect x="21" y="31" width="6" height="2" fill="#FFCC44" />
        <rect x="22" y="32" width="4" height="1" fill="#FFE880" />
        {/* rune lines */}
        <rect x="16" y="25" width="16" height="2" fill="#FF9900" opacity="0.6" />
        <rect x="16" y="37" width="16" height="2" fill="#FF9900" opacity="0.6" />
        {/* big chunky arms */}
        <rect x="0" y="22" width="8" height="16" fill="#BBAA99" />
        <rect x="40" y="22" width="8" height="16" fill="#BBAA99" />
        <rect x="0" y="36" width="10" height="8" fill="#AA9988" />
        <rect x="38" y="36" width="10" height="8" fill="#AA9988" />
        {/* legs */}
        <rect x="10" y="42" width="11" height="5" fill="#998877" />
        <rect x="26" y="42" width="11" height="5" fill="#998877" />
    </svg>
);

// RUNEKAI – elegant rune wyvern, sleek wings, big eyes (faces right)
const RunekaiSprite = ({ w = 96, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 6px 18px #DD770044)"
        }}>
        {/* sweeping tail */}
        <rect x="0" y="26" width="6" height="14" fill="#AA9977" />
        <rect x="2" y="22" width="6" height="8" fill="#BBAA88" />
        <rect x="0" y="38" width="8" height="4" fill="#997755" />
        {/* wings */}
        <rect x="0" y="10" width="14" height="22" fill="#CC9966" />
        <rect x="2" y="8" width="12" height="6" fill="#DDAA77" />
        <rect x="34" y="10" width="14" height="22" fill="#CC9966" />
        <rect x="34" y="8" width="12" height="6" fill="#DDAA77" />
        {/* wing rune marks */}
        <rect x="2" y="14" width="10" height="2" fill="#FF9900" opacity="0.5" />
        <rect x="2" y="20" width="10" height="2" fill="#FF9900" opacity="0.5" />
        <rect x="36" y="14" width="10" height="2" fill="#FF9900" opacity="0.5" />
        <rect x="36" y="20" width="10" height="2" fill="#FF9900" opacity="0.5" />
        {/* body */}
        <rect x="10" y="18" width="28" height="24" fill="#BBAA88" />
        <rect x="8" y="20" width="32" height="20" fill="#CCBB99" />
        {/* belly */}
        <rect x="14" y="24" width="18" height="14" fill="#DDBBA0" />
        {/* chest rune array */}
        <rect x="16" y="26" width="14" height="2" fill="#FF9900" />
        <rect x="18" y="29" width="10" height="2" fill="#FFAA00" />
        <rect x="16" y="32" width="14" height="2" fill="#FF9900" />
        <rect x="22" y="28" width="2" height="2" fill="#FFCC44" opacity="0.8" />
        {/* big round head */}
        <rect x="12" y="4" width="24" height="16" fill="#CCBB99" />
        <rect x="10" y="6" width="28" height="14" fill="#DDCCAA" />
        {/* snout (right-facing) */}
        <rect x="32" y="12" width="12" height="6" fill="#CCBB99" />
        <rect x="36" y="10" width="10" height="5" fill="#DDCCAA" />
        {/* nostrils */}
        <rect x="38" y="12" width="3" height="2" fill="#CC6600" opacity="0.6" />
        {/* big adorable eyes right-weighted */}
        <rect x="22" y="7" width="10" height="9" fill="#FF9900" />
        <rect x="32" y="8" width="8" height="8" fill="#FF9900" />
        <rect x="24" y="8" width="7" height="7" fill="#FFCC44" />
        <rect x="33" y="9" width="5" height="6" fill="#FFCC44" />
        <rect x="26" y="10" width="3" height="3" fill="#1A0800" />
        <rect x="34" y="10" width="2" height="3" fill="#1A0800" />
        <rect x="24" y="8" width="2" height="2" fill="#fff" opacity="0.9" />
        <rect x="33" y="9" width="1" height="1" fill="#fff" opacity="0.9" />
        {/* rune crown */}
        <rect x="14" y="2" width="5" height="6" fill="#AA9977" />
        <rect x="20" y="0" width="8" height="6" fill="#BBAA88" />
        <rect x="22" y="0" width="4" height="3" fill="#FFAA00" />
        {/* legs */}
        <rect x="12" y="40" width="9" height="6" fill="#AA9977" />
        <rect x="26" y="40" width="9" height="6" fill="#AA9977" />
    </svg>
);

// ── ECHO LINE ─────────────────────────────────────────
// ECHOBIT – tiny round bell-bird, teal, massive cute eyes (faces right)
const EchobitSprite = ({ w = 80, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 5px 10px #00BB8844)"
        }}>
        {/* sound rings (right side, direction of facing) */}
        <rect x="38" y="18" width="4" height="10" fill="#00CC88" opacity="0.35" />
        <rect x="42" y="20" width="4" height="6" fill="#00DDAA" opacity="0.25" />
        {/* round body */}
        <rect x="8" y="18" width="32" height="24" fill="#00BB88" />
        <rect x="6" y="20" width="36" height="20" fill="#00CC99" />
        <rect x="10" y="14" width="28" height="6" fill="#00BB88" />
        <rect x="14" y="11" width="20" height="5" fill="#00CC99" />
        {/* body shine */}
        <rect x="8" y="18" width="12" height="8" fill="#44DDAA" opacity="0.5" />
        <rect x="9" y="19" width="7" height="5" fill="#88FFCC" opacity="0.4" />
        {/* speaker grill (cute dots) */}
        <rect x="14" y="28" width="3" height="3" fill="#009966" opacity="0.6" />
        <rect x="19" y="28" width="3" height="3" fill="#009966" opacity="0.6" />
        <rect x="14" y="33" width="3" height="3" fill="#009966" opacity="0.5" />
        <rect x="19" y="33" width="3" height="3" fill="#009966" opacity="0.5" />
        {/* big right-facing eyes */}
        <rect x="22" y="16" width="12" height="11" fill="#fff" />
        <rect x="33" y="18" width="8" height="9" fill="#fff" />
        <rect x="24" y="17" width="9" height="9" fill="#003322" />
        <rect x="34" y="19" width="5" height="7" fill="#003322" />
        <rect x="26" y="19" width="4" height="5" fill="#00FFAA" />
        <rect x="35" y="20" width="2" height="4" fill="#00FFAA" />
        <rect x="24" y="17" width="3" height="3" fill="#fff" opacity="0.8" />
        <rect x="34" y="19" width="2" height="2" fill="#fff" opacity="0.8" />
        {/* tiny beak */}
        <rect x="36" y="24" width="8" height="4" fill="#FFCC00" />
        <rect x="38" y="22" width="5" height="4" fill="#FFAA00" />
        {/* little wings */}
        <rect x="2" y="24" width="8" height="12" fill="#009977" />
        <rect x="2" y="22" width="6" height="6" fill="#00BB88" />
        {/* stubby legs */}
        <rect x="14" y="40" width="7" height="6" fill="#009977" />
        <rect x="26" y="40" width="7" height="6" fill="#009977" />
        <rect x="13" y="44" width="9" height="3" fill="#007755" />
        <rect x="25" y="44" width="9" height="3" fill="#007755" />
    </svg>
);

// SONARIX – elegant sound phoenix, sleek feathers (faces right)
const SonarixSprite = ({ w = 88, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 5px 14px #00EE9944)"
        }}>
        {/* tail feathers (left since facing right) */}
        <rect x="0" y="28" width="5" height="16" fill="#009977" />
        <rect x="4" y="24" width="5" height="18" fill="#00BB88" />
        <rect x="8" y="20" width="5" height="16" fill="#00CC99" />
        {/* wings */}
        <rect x="2" y="10" width="16" height="20" fill="#00AA77" />
        <rect x="2" y="8" width="14" height="8" fill="#00CC99" />
        <rect x="4" y="6" width="10" height="6" fill="#44DDAA" />
        <rect x="30" y="10" width="16" height="20" fill="#00AA77" />
        <rect x="34" y="8" width="14" height="8" fill="#00CC99" />
        <rect x="36" y="6" width="10" height="6" fill="#44DDAA" />
        {/* wing wave marks */}
        <rect x="4" y="14" width="12" height="2" fill="#88FFCC" opacity="0.5" />
        <rect x="4" y="20" width="12" height="2" fill="#88FFCC" opacity="0.5" />
        <rect x="32" y="14" width="12" height="2" fill="#88FFCC" opacity="0.5" />
        <rect x="32" y="20" width="12" height="2" fill="#88FFCC" opacity="0.5" />
        {/* body */}
        <rect x="14" y="16" width="20" height="22" fill="#00BB88" />
        <rect x="12" y="18" width="24" height="18" fill="#00CC99" />
        {/* chest wave pattern */}
        <rect x="16" y="20" width="16" height="12" fill="#44DDAA" />
        <rect x="18" y="22" width="12" height="8" fill="#88FFCC" />
        <rect x="16" y="23" width="16" height="1" fill="#00AA77" />
        <rect x="16" y="26" width="16" height="1" fill="#00AA77" />
        <rect x="16" y="29" width="16" height="1" fill="#00AA77" />
        {/* round head */}
        <rect x="14" y="4" width="22" height="14" fill="#00CC99" />
        <rect x="12" y="6" width="26" height="12" fill="#00DDAA" />
        {/* crest feathers (right-side) */}
        <rect x="26" y="0" width="5" height="8" fill="#00BB88" />
        <rect x="32" y="0" width="5" height="6" fill="#00CC99" />
        <rect x="28" y="0" width="3" height="5" fill="#88FFCC" />
        {/* big cute right-facing eyes */}
        <rect x="22" y="7" width="10" height="9" fill="#fff" />
        <rect x="32" y="8" width="8" height="8" fill="#fff" />
        <rect x="24" y="8" width="7" height="7" fill="#003322" />
        <rect x="33" y="9" width="5" height="6" fill="#003322" />
        <rect x="26" y="10" width="3" height="3" fill="#00FFAA" />
        <rect x="34" y="10" width="2" height="3" fill="#00FFAA" />
        <rect x="24" y="8" width="2" height="2" fill="#fff" opacity="0.9" />
        <rect x="33" y="9" width="1" height="1" fill="#fff" opacity="0.9" />
        {/* beak (right) */}
        <rect x="36" y="12" width="9" height="5" fill="#FFCC00" />
        <rect x="38" y="10" width="6" height="4" fill="#FFAA00" />
        {/* talons */}
        <rect x="14" y="36" width="8" height="8" fill="#009977" />
        <rect x="26" y="36" width="8" height="8" fill="#009977" />
        <rect x="12" y="42" width="6" height="4" fill="#007755" />
        <rect x="30" y="42" width="6" height="4" fill="#007755" />
    </svg>
);

// VOXMAJOR – majestic resonance titan, huge presence (faces right)
const VoxmajorSprite = ({ w = 96, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 6px 20px #00FFAA88)"
        }}>
        {/* outer sound rings (right) */}
        <rect x="42" y="14" width="5" height="22" fill="#00CC99" opacity="0.3" />
        {/* massive wings */}
        <rect x="0" y="6" width="16" height="30" fill="#00AA77" />
        <rect x="0" y="4" width="14" height="10" fill="#00CC99" />
        <rect x="2" y="2" width="10" height="6" fill="#44DDAA" />
        <rect x="30" y="6" width="16" height="30" fill="#00AA77" />
        <rect x="34" y="4" width="14" height="10" fill="#00CC99" />
        <rect x="36" y="2" width="10" height="6" fill="#44DDAA" />
        {/* wing glyphs */}
        <rect x="2" y="12" width="12" height="2" fill="#88FFCC" opacity="0.6" />
        <rect x="2" y="18" width="12" height="2" fill="#88FFCC" opacity="0.6" />
        <rect x="2" y="24" width="12" height="2" fill="#88FFCC" opacity="0.6" />
        <rect x="34" y="12" width="12" height="2" fill="#88FFCC" opacity="0.6" />
        <rect x="34" y="18" width="12" height="2" fill="#88FFCC" opacity="0.6" />
        <rect x="34" y="24" width="12" height="2" fill="#88FFCC" opacity="0.6" />
        {/* body */}
        <rect x="10" y="16" width="28" height="28" fill="#00BB88" />
        <rect x="8" y="18" width="32" height="24" fill="#00CC99" />
        {/* resonance crystal chest */}
        <rect x="14" y="20" width="18" height="16" fill="#44DDAA" />
        <rect x="16" y="22" width="14" height="12" fill="#88FFCC" />
        <rect x="18" y="24" width="10" height="8" fill="#CCFFEE" />
        <rect x="20" y="26" width="6" height="4" fill="#fff" opacity="0.7" />
        {/* sound waves from chest */}
        <rect x="12" y="26" width="4" height="2" fill="#00FFAA" opacity="0.5" />
        <rect x="32" y="26" width="4" height="2" fill="#00FFAA" opacity="0.5" />
        {/* big round head */}
        <rect x="10" y="2" width="28" height="16" fill="#00CC99" />
        <rect x="8" y="4" width="32" height="14" fill="#00DDAA" />
        {/* crown spikes */}
        <rect x="12" y="0" width="5" height="6" fill="#00BB88" />
        <rect x="20" y="0" width="8" height="8" fill="#00DDAA" />
        <rect x="30" y="0" width="5" height="6" fill="#00BB88" />
        <rect x="22" y="0" width="4" height="4" fill="#88FFCC" />
        {/* giant right-facing eyes */}
        <rect x="20" y="6" width="12" height="10" fill="#fff" />
        <rect x="32" y="7" width="8" height="9" fill="#fff" />
        <rect x="22" y="7" width="9" height="8" fill="#003322" />
        <rect x="33" y="8" width="5" height="7" fill="#003322" />
        <rect x="24" y="9" width="4" height="4" fill="#00FFAA" />
        <rect x="34" y="10" width="2" height="3" fill="#00FFAA" />
        <rect x="22" y="7" width="3" height="3" fill="#fff" opacity="0.9" />
        <rect x="33" y="8" width="2" height="2" fill="#fff" opacity="0.9" />
        {/* big beak (right) */}
        <rect x="36" y="12" width="10" height="6" fill="#FFCC00" />
        <rect x="38" y="10" width="7" height="5" fill="#FFAA00" />
        {/* legs */}
        <rect x="12" y="42" width="10" height="5" fill="#009977" />
        <rect x="26" y="42" width="10" height="5" fill="#009977" />
        <rect x="10" y="45" width="8" height="3" fill="#007755" />
        <rect x="28" y="45" width="8" height="3" fill="#007755" />
    </svg>
);

// ── HIDDEN MONSTER ─────────────────────────────────────
// LEXIVORE – tri-element ancient, faces right, 3 eyes, majestic
const LexivoreSprite = ({ w = 96, flipped = false, fainted = false, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            transform: flipped ? "scaleX(-1)" : "none",
            opacity: fainted ? 0.3 : 1,
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 8px 24px rgba(180,80,255,0.8))"
        }}>
        {/* INK wing (left) */}
        <rect x="0" y="8" width="14" height="22" fill="#2233CC" />
        <rect x="2" y="6" width="12" height="6" fill="#4455EE" />
        <rect x="4" y="4" width="8" height="4" fill="#8899FF" />
        <rect x="2" y="12" width="10" height="2" fill="#AABBFF" opacity="0.5" />
        <rect x="2" y="18" width="10" height="2" fill="#AABBFF" opacity="0.5" />
        {/* ECHO wing (right) */}
        <rect x="34" y="8" width="14" height="22" fill="#00BB88" />
        <rect x="34" y="6" width="12" height="6" fill="#00DDAA" />
        <rect x="36" y="4" width="8" height="4" fill="#88FFCC" />
        <rect x="36" y="12" width="10" height="2" fill="#CCFFEE" opacity="0.5" />
        <rect x="36" y="18" width="10" height="2" fill="#CCFFEE" opacity="0.5" />
        {/* RUNE shoulder pads */}
        <rect x="8" y="18" width="10" height="8" fill="#AA9988" />
        <rect x="30" y="18" width="10" height="8" fill="#AA9988" />
        <rect x="9" y="20" width="8" height="2" fill="#FF9900" opacity="0.7" />
        <rect x="31" y="20" width="8" height="2" fill="#FF9900" opacity="0.7" />
        {/* body */}
        <rect x="10" y="16" width="28" height="28" fill="#330066" />
        <rect x="8" y="18" width="32" height="24" fill="#440088" />
        {/* tri-element core */}
        <rect x="14" y="22" width="20" height="14" fill="#5500AA" />
        <rect x="16" y="24" width="16" height="10" fill="#7722CC" />
        {/* INK section */}
        <rect x="16" y="24" width="5" height="10" fill="#2233CC" opacity="0.8" />
        <rect x="17" y="26" width="3" height="3" fill="#AABBFF" opacity="0.7" />
        {/* RUNE section */}
        <rect x="21" y="24" width="6" height="10" fill="#AA9988" opacity="0.8" />
        <rect x="22" y="27" width="4" height="3" fill="#FF9900" opacity="0.8" />
        {/* ECHO section */}
        <rect x="27" y="24" width="5" height="10" fill="#00BB88" opacity="0.8" />
        <rect x="28" y="29" width="3" height="3" fill="#88FFCC" opacity="0.8" />
        {/* big round head */}
        <rect x="10" y="2" width="28" height="16" fill="#330066" />
        <rect x="8" y="4" width="32" height="14" fill="#440088" />
        {/* tri-crown */}
        <rect x="10" y="0" width="5" height="6" fill="#2233CC" />
        <rect x="21" y="0" width="6" height="8" fill="#FFAA00" />
        <rect x="33" y="0" width="5" height="6" fill="#00BB88" />
        <rect x="12" y="0" width="3" height="4" fill="#8899FF" />
        <rect x="22" y="0" width="4" height="5" fill="#FFEE44" />
        <rect x="34" y="0" width="3" height="4" fill="#88FFCC" />
        {/* THREE adorable big eyes (right-weighted) */}
        <rect x="14" y="6" width="8" height="8" fill="#2233CC" />
        <rect x="15" y="7" width="6" height="6" fill="#8899FF" />
        <rect x="16" y="8" width="3" height="4" fill="#fff" />
        <rect x="16" y="8" width="2" height="2" fill="#AABBFF" />
        <rect x="22" y="5" width="9" height="9" fill="#FFAA00" />
        <rect x="23" y="6" width="7" height="7" fill="#FFEE44" />
        <rect x="25" y="7" width="3" height="5" fill="#fff" />
        <rect x="25" y="7" width="2" height="2" fill="#FFE880" />
        <rect x="32" y="6" width="8" height="8" fill="#00BB88" />
        <rect x="33" y="7" width="6" height="6" fill="#88FFCC" />
        <rect x="34" y="8" width="3" height="4" fill="#fff" />
        <rect x="34" y="8" width="2" height="2" fill="#CCFFEE" />
        {/* mouth with floating letters */}
        <rect x="14" y="14" width="22" height="4" fill="#220044" />
        <rect x="16" y="13" width="4" height="3" fill="#AABBFF" opacity="0.5" />
        <rect x="22" y="13" width="4" height="2" fill="#FFCC44" opacity="0.5" />
        <rect x="28" y="13" width="4" height="3" fill="#88FFCC" opacity="0.5" />
        {/* legs */}
        <rect x="12" y="42" width="10" height="5" fill="#330066" />
        <rect x="26" y="42" width="10" height="5" fill="#330066" />
        <rect x="10" y="45" width="8" height="3" fill="#8800FF" opacity="0.5" />
        <rect x="28" y="45" width="8" height="3" fill="#8800FF" opacity="0.5" />
    </svg>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENEMY MONSTERS — face LEFT naturally (no transform)
//  All pixel-art drawn facing left direction
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// FORGEX – eraser ghost, chubby, evil cute (faces left)
const ForgexSprite = ({ w = 80, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 4px 10px #BB224488)"
        }}>
        {/* eraser body – chubby rectangle */}
        <rect x="6" y="14" width="36" height="24" fill="#FFDDCC" />
        <rect x="4" y="16" width="40" height="20" fill="#FFE8D8" />
        <rect x="8" y="12" width="32" height="4" fill="#FFDDCC" />
        {/* eraser band */}
        <rect x="4" y="22" width="40" height="7" fill="#EE9988" />
        {/* scuff marks */}
        <rect x="8" y="16" width="10" height="2" fill="#EECCBB" opacity="0.7" />
        <rect x="26" y="18" width="8" height="2" fill="#EECCBB" opacity="0.6" />
        {/* LEFT-facing evil eyes */}
        <rect x="6" y="15" width="12" height="9" fill="#880000" />
        <rect x="20" y="15" width="10" height="9" fill="#880000" />
        <rect x="7" y="16" width="10" height="7" fill="#CC0000" />
        <rect x="21" y="16" width="8" height="7" fill="#CC0000" />
        <rect x="8" y="18" width="4" height="3" fill="#1A0000" />
        <rect x="22" y="18" width="3" height="3" fill="#1A0000" />
        <rect x="8" y="16" width="2" height="2" fill="#FF8888" opacity="0.7" />
        <rect x="22" y="16" width="2" height="2" fill="#FF8888" opacity="0.7" />
        {/* angry brows */}
        <rect x="6" y="14" width="13" height="2" fill="#661100" />
        <rect x="20" y="14" width="11" height="2" fill="#661100" />
        {/* eraser crumb mouth */}
        <rect x="10" y="31" width="22" height="4" fill="#EECCBB" />
        <rect x="12" y="30" width="5" height="3" fill="#FFDDCC" />
        <rect x="22" y="30" width="5" height="3" fill="#FFDDCC" />
        {/* eraser crumb legs */}
        <rect x="8" y="37" width="10" height="7" fill="#FFDDCC" />
        <rect x="28" y="37" width="10" height="7" fill="#FFDDCC" />
        <rect x="6" y="42" width="8" height="4" fill="#EECCBB" />
        <rect x="30" y="42" width="8" height="4" fill="#EECCBB" />
        {/* little arms */}
        <rect x="0" y="26" width="5" height="6" fill="#FFDDCC" />
        <rect x="43" y="26" width="5" height="6" fill="#FFDDCC" />
    </svg>
);

// BLANKUS – empty page ghost, hollow eyes, unsettling cute (faces left)
const BlankusSprite = ({ w = 80, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 4px 10px #88888866)"
        }}>
        {/* page body */}
        <rect x="8" y="6" width="32" height="38" fill="#F4F2EC" />
        <rect x="6" y="8" width="36" height="34" fill="#F4F2EC" />
        <rect x="10" y="4" width="28" height="4" fill="#E8E6E0" />
        {/* folded corner top-left */}
        <rect x="6" y="8" width="8" height="8" fill="#E0DED8" />
        <rect x="6" y="8" width="4" height="4" fill="#D8D4CC" />
        {/* page lines (empty = eerie) */}
        <rect x="12" y="28" width="24" height="2" fill="#E4E0D8" />
        <rect x="12" y="32" width="24" height="2" fill="#E4E0D8" />
        <rect x="12" y="36" width="18" height="2" fill="#E4E0D8" />
        {/* LEFT-facing hollow eyes */}
        <rect x="8" y="12" width="10" height="9" fill="#222" />
        <rect x="20" y="12" width="9" height="9" fill="#222" />
        <rect x="9" y="13" width="8" height="7" fill="#000" />
        <rect x="21" y="13" width="7" height="7" fill="#000" />
        {/* ghostly iris */}
        <rect x="10" y="15" width="3" height="3" fill="#BBBBDD" opacity="0.5" />
        <rect x="22" y="15" width="3" height="3" fill="#BBBBDD" opacity="0.5" />
        {/* unsettling smile */}
        <rect x="12" y="24" width="18" height="3" fill="#E4E0D8" />
        <rect x="10" y="25" width="5" height="2" fill="#D8D4CC" />
        <rect x="26" y="25" width="5" height="2" fill="#D8D4CC" />
        {/* ghost wisps */}
        <rect x="2" y="16" width="5" height="12" fill="#F4F2EC" opacity="0.7" />
        <rect x="42" y="20" width="4" height="10" fill="#F4F2EC" opacity="0.6" />
        {/* paper feet */}
        <rect x="12" y="42" width="10" height="5" fill="#EAE8E2" />
        <rect x="26" y="42" width="10" height="5" fill="#EAE8E2" />
    </svg>
);

// CONFUZOR – chaotic letter beast, swirly eyes, chunky (faces left)
const ConfuzorSprite = ({ w = 80, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 4px 10px #CC660044)"
        }}>
        {/* chaotic body */}
        <rect x="6" y="12" width="36" height="30" fill="#AA5522" />
        <rect x="4" y="14" width="40" height="26" fill="#CC6633" />
        <rect x="8" y="10" width="32" height="4" fill="#AA5522" />
        {/* scrambled letters */}
        <rect x="8" y="18" width="5" height="7" fill="#FFBB44" opacity="0.7" />
        <rect x="16" y="16" width="7" height="5" fill="#FFCC66" opacity="0.6" />
        <rect x="28" y="18" width="5" height="7" fill="#FFBB44" opacity="0.7" />
        <rect x="10" y="27" width="7" height="5" fill="#FFCC66" opacity="0.6" />
        <rect x="26" y="25" width="7" height="5" fill="#FFBB44" opacity="0.6" />
        <rect x="18" y="30" width="5" height="5" fill="#FFAA44" opacity="0.5" />
        {/* LEFT-facing swirly eyes */}
        <rect x="6" y="13" width="12" height="10" fill="#FF7700" />
        <rect x="20" y="13" width="10" height="10" fill="#FF7700" />
        <rect x="7" y="14" width="10" height="8" fill="#FF9900" />
        <rect x="21" y="14" width="8" height="8" fill="#FF9900" />
        <rect x="8" y="16" width="4" height="4" fill="#1A0500" />
        <rect x="22" y="16" width="3" height="4" fill="#1A0500" />
        <rect x="8" y="14" width="2" height="2" fill="#FFDDAA" opacity="0.8" />
        <rect x="22" y="14" width="2" height="2" fill="#FFDDAA" opacity="0.8" />
        {/* jumbled mouth */}
        <rect x="8" y="30" width="28" height="5" fill="#882200" />
        <rect x="10" y="29" width="5" height="3" fill="#FFBB44" opacity="0.5" />
        <rect x="18" y="29" width="5" height="3" fill="#FFCC66" opacity="0.5" />
        <rect x="26" y="29" width="5" height="3" fill="#FFBB44" opacity="0.5" />
        {/* tentacle legs */}
        <rect x="8" y="40" width="8" height="8" fill="#AA5522" />
        <rect x="18" y="42" width="6" height="6" fill="#CC6633" />
        <rect x="28" y="40" width="8" height="8" fill="#AA5522" />
        {/* little arms */}
        <rect x="0" y="20" width="5" height="8" fill="#AA5522" />
        <rect x="43" y="20" width="5" height="8" fill="#AA5522" />
    </svg>
);

// NULLVOID – void king, dark and majestic, three eyes (faces left)
const NullvoidSprite = ({ w = 88, hurt = false }) => (
    <svg width={w} height={w} viewBox="0 0 48 48"
        style={{
            imageRendering: "pixelated",
            filter: hurt ? "brightness(8) saturate(0)" : "drop-shadow(0 8px 20px #33006699)"
        }}>
        {/* void aura */}
        <rect x="0" y="10" width="6" height="28" fill="#110033" opacity="0.5" />
        <rect x="42" y="10" width="6" height="28" fill="#110033" opacity="0.5" />
        {/* dark cloak */}
        <rect x="4" y="18" width="40" height="28" fill="#110033" />
        <rect x="2" y="20" width="44" height="24" fill="#1A0044" />
        <rect x="0" y="26" width="8" height="18" fill="#110033" />
        <rect x="40" y="26" width="8" height="18" fill="#110033" />
        {/* void tears */}
        <rect x="10" y="26" width="6" height="10" fill="#220066" opacity="0.7" />
        <rect x="28" y="28" width="6" height="8" fill="#220066" opacity="0.7" />
        <rect x="20" y="32" width="5" height="7" fill="#330077" opacity="0.6" />
        {/* body */}
        <rect x="8" y="10" width="32" height="12" fill="#1A0044" />
        <rect x="6" y="12" width="36" height="10" fill="#220055" />
        {/* absorbed letters */}
        <rect x="10" y="24" width="4" height="4" fill="#4455FF" opacity="0.4" />
        <rect x="20" y="26" width="4" height="4" fill="#00AA88" opacity="0.4" />
        <rect x="30" y="22" width="4" height="4" fill="#FF9900" opacity="0.4" />
        <rect x="14" y="32" width="4" height="4" fill="#CC66FF" opacity="0.4" />
        {/* big round head */}
        <rect x="8" y="0" width="32" height="14" fill="#1A0044" />
        <rect x="6" y="2" width="36" height="12" fill="#220055" />
        {/* void crown */}
        <rect x="6" y="0" width="5" height="6" fill="#5500AA" />
        <rect x="14" y="0" width="5" height="4" fill="#7722CC" />
        <rect x="20" y="0" width="8" height="8" fill="#9944FF" />
        <rect x="30" y="0" width="5" height="4" fill="#7722CC" />
        <rect x="36" y="0" width="6" height="6" fill="#5500AA" />
        <rect x="22" y="0" width="4" height="4" fill="#DDAAFF" />
        {/* LEFT-facing THREE big eyes */}
        <rect x="6" y="4" width="10" height="8" fill="#5500AA" />
        <rect x="7" y="5" width="8" height="6" fill="#8833CC" />
        <rect x="8" y="6" width="4" height="4" fill="#CC88FF" />
        <rect x="8" y="5" width="2" height="2" fill="#fff" opacity="0.7" />
        <rect x="18" y="3" width="10" height="9" fill="#7700CC" />
        <rect x="19" y="4" width="8" height="7" fill="#AA44EE" />
        <rect x="21" y="5" width="4" height="5" fill="#fff" />
        <rect x="22" y="5" width="2" height="2" fill="#DDAAFF" />
        <rect x="30" y="4" width="10" height="8" fill="#5500AA" />
        <rect x="31" y="5" width="8" height="6" fill="#8833CC" />
        <rect x="32" y="6" width="4" height="4" fill="#CC88FF" />
        <rect x="32" y="5" width="2" height="2" fill="#fff" opacity="0.7" />
        {/* consuming mouth */}
        <rect x="8" y="11" width="28" height="5" fill="#000000" />
        <rect x="10" y="10" width="5" height="3" fill="#330066" opacity="0.7" />
        <rect x="20" y="10" width="5" height="3" fill="#330066" opacity="0.7" />
        <rect x="30" y="10" width="5" height="3" fill="#330066" opacity="0.7" />
        {/* ghost tendrils */}
        <rect x="10" y="44" width="8" height="4" fill="#1A0044" />
        <rect x="22" y="46" width="6" height="2" fill="#220055" />
        <rect x="30" y="44" width="8" height="4" fill="#1A0044" />
    </svg>
);
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVOLUTION DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const EVO_LINES = [
    {
        lineId: "ink",
        stages: [
            {
                id: "inklet", name: "INKLET", Sprite: InkletSprite, type: "INK", typeClr: "#4466FF", color: "#2244DD", glow: "#4466FF",
                hp: 90, atk: 14, def: 8, evoLv: 16, desc: "Tiny ink spirit.\nLearns fast, grows quick."
            },
            {
                id: "quillon", name: "QUILLON", Sprite: QuillonSprite, type: "INK", typeClr: "#5577FF", color: "#3355EE", glow: "#5577FF",
                hp: 115, atk: 20, def: 14, evoLv: 36, desc: "Ink knight. Slices through\nconfusion with its quill."
            },
            {
                id: "scriptar", name: "SCRIPTAR", Sprite: ScriptarSprite, type: "INK", typeClr: "#6688FF", color: "#4466EE", glow: "#8899FF",
                hp: 145, atk: 28, def: 18, evoLv: null, desc: "Ancient scroll archmage.\nMaster of all written words."
            },
        ]
    },
    {
        lineId: "rune",
        stages: [
            {
                id: "runix", name: "RUNIX", Sprite: RunixSprite, type: "RUNE", typeClr: "#FFAA00", color: "#CC8800", glow: "#FFAA00",
                hp: 105, atk: 12, def: 14, evoLv: 16, desc: "Stone rune fragment.\nRough around the edges."
            },
            {
                id: "glyphon", name: "GLYPHON", Sprite: GlyphonSprite, type: "RUNE", typeClr: "#FFBB22", color: "#DD9900", glow: "#FFBB22",
                hp: 130, atk: 18, def: 20, evoLv: 36, desc: "Rune golem warrior.\nUnbreakable defense."
            },
            {
                id: "runekai", name: "RUNEKAI", Sprite: RunekaiSprite, type: "RUNE", typeClr: "#FFCC44", color: "#EE9900", glow: "#FFCC44",
                hp: 160, atk: 24, def: 26, evoLv: null, desc: "Dragon sage of ancient runes.\nWisdom made flesh."
            },
        ]
    },
    {
        lineId: "echo",
        stages: [
            {
                id: "echobit", name: "ECHOBIT", Sprite: EchobitSprite, type: "ECHO", typeClr: "#00CC88", color: "#009966", glow: "#00CC88",
                hp: 85, atk: 16, def: 10, evoLv: 16, desc: "Sound wave creature.\nHigh speed, sharp ears."
            },
            {
                id: "sonarix", name: "SONARIX", Sprite: SonarixSprite, type: "ECHO", typeClr: "#00DDAA", color: "#00BB88", glow: "#00DDAA",
                hp: 110, atk: 24, def: 14, evoLv: 36, desc: "Resonance phoenix.\nAttacks with pure sound."
            },
            {
                id: "voxmajor", name: "VOXMAJOR", Sprite: VoxmajorSprite, type: "ECHO", typeClr: "#44FFCC", color: "#00CCAA", glow: "#44FFCC",
                hp: 140, atk: 32, def: 18, evoLv: null, desc: "Titan of resonance.\nVoice that shakes the world."
            },
        ]
    },
];

const HIDDEN_MON = {
    id: "lexivore", name: "LEXIVORE", Sprite: LexivoreSprite, type: "VOID", typeClr: "#BB66FF",
    color: "#9944EE", glow: "#BB66FF", hp: 180, atk: 35, def: 22, evoLv: null,
    desc: "Devourer of forgotten words.\nUnlocked at ★30. Truly legendary.",
    unlockStars: 30,
};

const ENEMIES = [
    { id: "forgex", name: "FORGEX", Sprite: ForgexSprite, type: "ERASE", typeClr: "#CC4444", color: "#FF4444", hp: 70, atk: 8, def: 4, bgKey: "plains" },
    { id: "blankus", name: "BLANKUS", Sprite: BlankusSprite, type: "BLANK", typeClr: "#888888", color: "#AAAAAA", hp: 95, atk: 11, def: 7, bgKey: "library" },
    { id: "confuzor", name: "CONFUZOR", Sprite: ConfuzorSprite, type: "CHAOS", typeClr: "#CC7700", color: "#FF9900", hp: 125, atk: 15, def: 10, bgKey: "cave" },
    { id: "nullvoid", name: "NULLVOID", Sprite: NullvoidSprite, type: "VOID", typeClr: "#7700CC", color: "#9944FF", hp: 160, atk: 18, def: 12, bgKey: "void" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UNIT + WORD DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const UNIT_INFO = [
    { id: 1, name: "A Supermoon", short: "Supermoon", emoji: "🌕" },
    { id: 2, name: "Seasons", short: "Seasons", emoji: "🍂" },
    { id: 3, name: "Rainy Day", short: "Rainy Day", emoji: "🌧️" },
    { id: 4, name: "Winter Sports", short: "Winter", emoji: "⛷️" },
    { id: 5, name: "Baja California", short: "Baja CA", emoji: "🏕️" },
    { id: 6, name: "Go Outside!", short: "Outside", emoji: "🚴" },
    { id: 7, name: "Interesting Jobs", short: "Jobs", emoji: "👷" },
    { id: 8, name: "Unusual Job", short: "Unusual", emoji: "🤖" },
    { id: 9, name: "Dream Jobs", short: "Dreams", emoji: "✈️" },
    { id: 10, name: "Technology", short: "Tech", emoji: "💻" },
    { id: 11, name: "Homework Apps", short: "Apps", emoji: "📱" },
    { id: 12, name: "My New Tablet", short: "Tablet", emoji: "🔒" },
];

const ALL_WORDS = [
    { w: "sky", m: "하늘", def: "the space over the Earth", unit: 1, opts: ["sky", "wind", "cloud", "moon"] },
    { w: "wind", m: "바람", def: "a natural movement of air outside", unit: 1, opts: ["sky", "wind", "bright", "watch"] },
    { w: "cloud", m: "구름", def: "a white or gray mass in the sky made of tiny water drops", unit: 1, opts: ["moon", "cloud", "wind", "sky"] },
    { w: "moon", m: "달", def: "the round object moving around Earth, seen at night", unit: 1, opts: ["moon", "cloud", "east", "west"] },
    { w: "bright", m: "밝은", def: "having very light and strong colors", unit: 1, opts: ["bright", "watch", "east", "west"] },
    { w: "watch", m: "보다", def: "to look at someone or something for a period of time", unit: 1, opts: ["sky", "watch", "bright", "wind"] },
    { w: "east", m: "동쪽", def: "the direction where the sun rises", unit: 1, opts: ["east", "west", "cloud", "moon"] },
    { w: "west", m: "서쪽", def: "the direction where the sun sets", unit: 1, opts: ["east", "west", "bright", "sky"] },
    { w: "ride", m: "타다", def: "to sit on and control the movements of", unit: 2, opts: ["ride", "school", "vacation", "cold"] },
    { w: "school", m: "학교", def: "a place where children go to learn", unit: 2, opts: ["school", "vacation", "month", "start"] },
    { w: "vacation", m: "방학", def: "a time when schools and universities are closed", unit: 2, opts: ["ride", "vacation", "cold", "January"] },
    { w: "cold", m: "추운", def: "having a very low temperature", unit: 2, opts: ["cold", "month", "start", "school"] },
    { w: "month", m: "달", def: "any one of the 12 parts into which the year is divided", unit: 2, opts: ["month", "ride", "January", "June"] },
    { w: "start", m: "시작하다", def: "to begin to happen, to exist, or to be done", unit: 2, opts: ["start", "cold", "school", "vacation"] },
    { w: "January", m: "1월", def: "the first month of the year", unit: 2, opts: ["January", "June", "month", "start"] },
    { w: "June", m: "6월", def: "the sixth month of the year", unit: 2, opts: ["June", "January", "cold", "ride"] },
    { w: "watch TV", m: "TV를 시청하다", def: "to look at programs broadcast on television", unit: 3, opts: ["watch TV", "watch a movie", "study", "think"] },
    { w: "watch a movie", m: "영화를 보다", def: "to look at a movie on TV or using a computer", unit: 3, opts: ["watch a movie", "watch TV", "arcade game", "mobile game"] },
    { w: "study", m: "공부하다", def: "the activity of learning or gaining knowledge", unit: 3, opts: ["study", "rainy", "think", "watch TV"] },
    { w: "rainy", m: "비가 오는", def: "having a lot of rain", unit: 3, opts: ["rainy", "study", "think", "arcade game"] },
    { w: "think", m: "생각하다", def: "to have an opinion about someone or something", unit: 3, opts: ["think", "rainy", "study", "mobile game"] },
    { w: "arcade game", m: "아케이드 게임", def: "an electronic or coin-operated game", unit: 3, opts: ["arcade game", "mobile game", "watch TV", "study"] },
    { w: "mobile game", m: "모바일 게임", def: "a game designed for mobile devices", unit: 3, opts: ["mobile game", "arcade game", "rainy", "think"] },
    { w: "ski", m: "스키", def: "a long narrow runner for gliding over snow", unit: 4, opts: ["ski", "jump", "mountain", "snowboard"] },
    { w: "jump", m: "뛰다", def: "to push yourself off the ground into the air", unit: 4, opts: ["jump", "ski", "snowboard", "helmet"] },
    { w: "mountain", m: "산", def: "a large steep hill", unit: 4, opts: ["mountain", "ski", "snowboard", "stick"] },
    { w: "snowboard", m: "스노보드", def: "a board for gliding on snow", unit: 4, opts: ["snowboard", "ski", "mountain", "jump"] },
    { w: "play ice hockey", m: "아이스 하키를 하다", def: "to participate in ice hockey", unit: 4, opts: ["play ice hockey", "ice skate", "jump", "ski"] },
    { w: "ice skate", m: "스케이트를 타다", def: "to skate on ice", unit: 4, opts: ["ice skate", "play ice hockey", "snowboard", "mountain"] },
    { w: "helmet", m: "헬멧", def: "a strong hard hat that protects the head", unit: 4, opts: ["helmet", "stick", "jump", "ski"] },
    { w: "stick", m: "스틱", def: "a long thin object used to hit or direct a puck", unit: 4, opts: ["stick", "helmet", "mountain", "snowboard"] },
    { w: "go camping", m: "캠핑 가다", def: "to stay in a tent usually for enjoyment", unit: 5, opts: ["go camping", "tent", "fire", "bring"] },
    { w: "tent", m: "텐트", def: "a portable shelter used outdoors", unit: 5, opts: ["tent", "go camping", "sleeping bag", "flashlight"] },
    { w: "fire", m: "불", def: "the light, heat, and flame produced by burning", unit: 5, opts: ["fire", "bring", "sea", "forest"] },
    { w: "bring", m: "가져오다", def: "to come with something or someone to a place", unit: 5, opts: ["bring", "fire", "tent", "flashlight"] },
    { w: "flashlight", m: "손전등", def: "a small electric light carried in your hand", unit: 5, opts: ["flashlight", "sleeping bag", "bring", "go camping"] },
    { w: "sleeping bag", m: "침낭", def: "a warm long bag used for sleeping outdoors", unit: 5, opts: ["sleeping bag", "flashlight", "tent", "fire"] },
    { w: "sea", m: "바다", def: "the salt water that covers much of the Earth's surface", unit: 5, opts: ["sea", "forest", "fire", "bring"] },
    { w: "forest", m: "숲", def: "a thick growth of trees covering a large area", unit: 5, opts: ["forest", "sea", "go camping", "tent"] },
    { w: "go hiking", m: "하이킹하러 가다", def: "to walk a long distance for pleasure", unit: 6, opts: ["go hiking", "beach", "have a picnic", "ride a bike"] },
    { w: "beach", m: "해변", def: "an area of sand next to an ocean", unit: 6, opts: ["beach", "backyard", "go hiking", "forest"] },
    { w: "have a picnic", m: "소풍 가다", def: "to take food and eat it outdoors", unit: 6, opts: ["have a picnic", "go hiking", "ride a bike", "backyard"] },
    { w: "backyard", m: "뒷마당", def: "an area in back of a house", unit: 6, opts: ["backyard", "beach", "inside", "outside"] },
    { w: "ride a bike", m: "자전거를 타다", def: "to sit on a bike and travel along on it", unit: 6, opts: ["ride a bike", "go hiking", "have a picnic", "beach"] },
    { w: "inside", m: "안에", def: "in or into the inner part of a building", unit: 6, opts: ["inside", "outside", "backyard", "beach"] },
    { w: "outside", m: "밖에", def: "in or near a building, not inside it", unit: 6, opts: ["outside", "inside", "forest", "beach"] },
    { w: "job", m: "직업", def: "the work a person does regularly to earn money", unit: 7, opts: ["job", "photographer", "chef", "doctor"] },
    { w: "photographer", m: "사진작가", def: "a person who takes photographs as a job", unit: 7, opts: ["photographer", "chef", "deliveryman", "scientist"] },
    { w: "chef", m: "요리사", def: "a person who prepares food for people to eat", unit: 7, opts: ["chef", "doctor", "photographer", "scientist"] },
    { w: "doctor", m: "의사", def: "a person skilled in the science of medicine", unit: 7, opts: ["doctor", "chef", "deliveryman", "job"] },
    { w: "deliveryman", m: "배달원", def: "a man who delivers goods to customers", unit: 7, opts: ["deliveryman", "scientist", "photographer", "chef"] },
    { w: "scientist", m: "과학자", def: "a person who studies one or more natural sciences", unit: 7, opts: ["scientist", "doctor", "deliveryman", "photographer"] },
    { w: "take pictures", m: "사진을 찍다", def: "to create images with a camera", unit: 7, opts: ["take pictures", "help sick people", "job", "chef"] },
    { w: "help sick people", m: "아픈 사람들을 돕다", def: "to aid sick people", unit: 7, opts: ["help sick people", "take pictures", "deliveryman", "scientist"] },
    { w: "unusual", m: "특이한", def: "not normal or usual", unit: 8, opts: ["unusual", "famous", "robot", "money"] },
    { w: "famous", m: "유명한", def: "known or recognized by very many people", unit: 8, opts: ["famous", "unusual", "excited", "love"] },
    { w: "robot", m: "로봇", def: "a machine that looks like a human, controlled by computer", unit: 8, opts: ["robot", "money", "river", "ocean"] },
    { w: "money", m: "돈", def: "something used to pay for goods and services", unit: 8, opts: ["money", "robot", "unusual", "excited"] },
    { w: "excited", m: "신이 난", def: "very enthusiastic and eager about something", unit: 8, opts: ["excited", "love", "famous", "unusual"] },
    { w: "love", m: "사랑하다", def: "to feel great affection for someone", unit: 8, opts: ["love", "excited", "money", "robot"] },
    { w: "river", m: "강", def: "a natural flow of water flowing in a channel to the sea", unit: 8, opts: ["river", "ocean", "unusual", "famous"] },
    { w: "ocean", m: "바다", def: "the salt water covering much of Earth's surface", unit: 8, opts: ["ocean", "river", "robot", "money"] },
    { w: "pilot", m: "조종사", def: "a person who flies an airplane or helicopter", unit: 9, opts: ["pilot", "astronaut", "nurse", "vet"] },
    { w: "astronaut", m: "우주 비행사", def: "a person who travels in a spacecraft into outer space", unit: 9, opts: ["astronaut", "pilot", "firefighter", "actor"] },
    { w: "nurse", m: "간호사", def: "a person who takes care of sick or injured people", unit: 9, opts: ["nurse", "vet", "doctor", "pilot"] },
    { w: "vet", m: "수의사", def: "an animal doctor", unit: 9, opts: ["vet", "nurse", "pilot", "astronaut"] },
    { w: "actor", m: "배우", def: "a person who acts in a play or movie", unit: 9, opts: ["actor", "firefighter", "cool", "awesome"] },
    { w: "firefighter", m: "소방관", def: "a member of a group that works to put out fires", unit: 9, opts: ["firefighter", "actor", "nurse", "vet"] },
    { w: "cool", m: "멋진", def: "often used to show approval in a general way", unit: 9, opts: ["cool", "awesome", "actor", "pilot"] },
    { w: "awesome", m: "대단한", def: "used to show that something is very good or great fun", unit: 9, opts: ["awesome", "cool", "firefighter", "astronaut"] },
    { w: "laptop", m: "노트북", def: "a small computer designed to be easily carried", unit: 10, opts: ["laptop", "screen", "keyboard", "email"] },
    { w: "screen", m: "화면", def: "the flat part of a TV showing images or text", unit: 10, opts: ["screen", "laptop", "smartphone", "tablet"] },
    { w: "keyboard", m: "키보드", def: "the set of keys used for a computer or typewriter", unit: 10, opts: ["keyboard", "screen", "email", "mobile devices"] },
    { w: "email", m: "이메일", def: "an electronic mail message", unit: 10, opts: ["email", "laptop", "keyboard", "screen"] },
    { w: "smartphone", m: "스마트폰", def: "a mobile phone that works as a computer", unit: 10, opts: ["smartphone", "tablet", "laptop", "email"] },
    { w: "tablet", m: "태블릿", def: "a portable computer with a large touch screen", unit: 10, opts: ["tablet", "smartphone", "screen", "keyboard"] },
    { w: "mobile devices", m: "모바일 기기", def: "any types of handheld and portable computers", unit: 10, opts: ["mobile devices", "laptop", "email", "screen"] },
    { w: "busy", m: "바쁜", def: "full of activity or work", unit: 11, opts: ["busy", "easy", "app", "math"] },
    { w: "easy", m: "쉬운", def: "not hard to do", unit: 11, opts: ["easy", "difficult", "busy", "slow"] },
    { w: "app", m: "앱", def: "a computer program that performs a special function", unit: 11, opts: ["app", "math", "teach", "learn"] },
    { w: "math", m: "수학", def: "mathematics, especially as a subject in school", unit: 11, opts: ["math", "app", "difficult", "easy"] },
    { w: "difficult", m: "어려운", def: "not easy", unit: 11, opts: ["difficult", "easy", "slow", "busy"] },
    { w: "slow", m: "느린", def: "not moving quickly", unit: 11, opts: ["slow", "difficult", "busy", "app"] },
    { w: "teach", m: "가르치다", def: "to help a person learn how to do something", unit: 11, opts: ["teach", "learn", "busy", "app"] },
    { w: "learn", m: "배우다", def: "to gain knowledge by studying", unit: 11, opts: ["learn", "teach", "slow", "difficult"] },
    { w: "touch", m: "만지다", def: "to put your hand or fingers on someone or something", unit: 12, opts: ["touch", "password", "need", "safe"] },
    { w: "password", m: "비밀번호", def: "a secret code that allows you to use a computer system", unit: 12, opts: ["password", "touch", "login", "download"] },
    { w: "need", m: "필요하다", def: "to require something", unit: 12, opts: ["need", "safe", "send", "share"] },
    { w: "safe", m: "안전한", def: "not in danger", unit: 12, opts: ["safe", "need", "touch", "password"] },
    { w: "send", m: "보내다", def: "to make something go to a place, especially by email", unit: 12, opts: ["send", "share", "login", "download"] },
    { w: "share", m: "공유하다", def: "to have or use something with others", unit: 12, opts: ["share", "send", "need", "safe"] },
    { w: "login", m: "로그인", def: "an act of logging in to a computer or online account", unit: 12, opts: ["login", "download", "password", "touch"] },
    { w: "download", m: "다운로드하다", def: "to get data from another computer via the internet", unit: 12, opts: ["download", "login", "send", "share"] },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const rng = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const calcDmg = (atk, def) => Math.max(4, Math.floor(atk - def * 0.4 + rng(-3, 5)));
const getWords = id => ALL_WORDS.filter(w => w.unit === id);
const getEnemy = uid => ENEMIES[Math.min(Math.floor((uid - 1) / 3), ENEMIES.length - 1)];
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const getOpts = w => shuffle(w.opts);
const hpColor = pct => pct > 50 ? "#44CC77" : pct > 25 ? "#EE9920" : "#EE2222";

// get all flat mons for easy lookup
const ALL_PLAYER_MONS = EVO_LINES.flatMap(l => l.stages);

// star unlock thresholds for each first-stage mon
const MON_UNLOCK_STARS = { ink: 0, rune: 8, echo: 16 };
const EVO_UNLOCK_STARS = { 0: 0, 1: 4, 2: 12 }; // stage index → stars needed to evolve (plus lv)

// Battle backgrounds
const BG_PLAINS = (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
        <rect width="320" height="200" fill="#4A8ADE" />
        <rect x="20" y="18" width="60" height="16" rx="8" fill="#fff" opacity="0.85" />
        <rect x="10" y="22" width="30" height="12" rx="6" fill="#fff" opacity="0.85" />
        <rect x="180" y="24" width="80" height="16" rx="8" fill="#fff" opacity="0.75" />
        <rect x="250" y="22" width="30" height="14" rx="7" fill="#fff" opacity="0.75" />
        <ellipse cx="80" cy="130" rx="80" ry="40" fill="#4A9A40" />
        <ellipse cx="230" cy="135" rx="100" ry="45" fill="#3A8A30" />
        <rect y="140" width="320" height="60" fill="#4AA830" />
        <rect y="148" width="320" height="52" fill="#3A9820" />
    </svg>
);
const BG_LIBRARY = (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
        <rect width="320" height="200" fill="#2A1A10" />
        {[0, 40, 80, 120, 160, 200, 240, 280].map(x => (
            <g key={x}>
                <rect x={x + 2} y="0" width="34" height="140" fill={["#3A1A08", "#2A1408", "#442010"][Math.floor(x / 40) % 3]} />
                <rect x={x + 4} y="10" width="6" height="120" fill="#DDBB88" opacity="0.15" />
                <rect x={x + 12} y="20" width="6" height="100" fill="#CCAA77" opacity="0.12" />
                <rect x={x + 20} y="15" width="6" height="110" fill="#DDBB88" opacity="0.1" />
            </g>
        ))}
        <rect y="138" width="320" height="62" fill="#1A0E08" />
        <rect y="142" width="320" height="58" fill="#221408" />
        <rect y="138" width="320" height="5" fill="#AA7744" opacity="0.5" />
    </svg>
);
const BG_CAVE = (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
        <rect width="320" height="200" fill="#1A1020" />
        {[10, 40, 80, 130, 170, 210, 255, 290].map((x, i) => (
            <polygon key={x} points={`${x},0 ${x + 14},0 ${x + 7},${30 + i % 3 * 18}`} fill={i % 2 === 0 ? "#2A1A30" : "#221628"} />
        ))}
        <polygon points="50,80 58,100 42,100" fill="#4400AA" opacity="0.7" />
        <polygon points="200,60 210,85 190,85" fill="#0044AA" opacity="0.7" />
        <rect y="145" width="320" height="55" fill="#2A1A2A" />
        <rect y="149" width="320" height="51" fill="#221422" />
    </svg>
);
const BG_VOID = (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 200">
        <rect width="320" height="200" fill="#06040E" />
        {[[15, 10], [45, 25], [90, 8], [140, 18], [200, 5], [250, 22], [300, 12], [30, 45], [80, 38], [160, 42], [220, 35], [280, 48]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={i % 3 === 0 ? 2 : 1} height={i % 3 === 0 ? 2 : 1} fill="#fff" opacity={0.3 + i % 5 * 0.14} />
        ))}
        <rect y="138" width="320" height="62" fill="#08040E" />
        <rect y="140" width="320" height="60" fill="#0A0618" />
        <rect y="138" width="320" height="3" fill="#3300AA" opacity="0.5" />
    </svg>
);
const BG_MAP = { plains: BG_PLAINS, library: BG_LIBRARY, cave: BG_CAVE, void: BG_VOID };

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
function HPBar({ cur, max }) {
    const pct = Math.max(0, (cur / max) * 100);
    const c = hpColor(pct);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(8px,2vmin,10px)", color: "#555", minWidth: 18 }}>HP</span>
            <div style={{
                flex: 1, height: 8, background: "#B8B0A0", borderRadius: 4, overflow: "hidden",
                border: "1.5px solid #888", boxShadow: "inset 0 1px 2px rgba(0,0,0,.4)"
            }}>
                <div style={{
                    height: "100%", width: `${pct}%`, background: `linear-gradient(180deg,${c}CC,${c})`,
                    borderRadius: 3, transition: "width .4s ease", boxShadow: "inset 0 1px 0 rgba(255,255,255,.4)"
                }} />
            </div>
        </div>
    );
}

// Nameplate (Pokemon DS style)
function Nameplate({ name, typeName, typeClr, hp, maxHp, lv, isEnemy = false }) {
    return (
        <div style={{
            background: "#F5F0E8", border: "3px solid #A09888", borderRadius: 8,
            padding: "6px 10px 8px", boxShadow: "3px 3px 0 rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.8)",
            minWidth: 148, maxWidth: 210, fontFamily: "var(--f-pk)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 4 }}>
                <span style={{ fontSize: "clamp(9px,2.4vmin,11px)", color: "#1A1A1A", letterSpacing: .3, lineHeight: 1.3 }}>{name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    {lv !== undefined && <span style={{ fontSize: "clamp(8px,2vmin,10px)", color: "#555" }}>Lv{lv}</span>}
                    <span style={{
                        fontSize: "clamp(7px,1.8vmin,9px)", background: typeClr, color: "#fff",
                        padding: "2px 5px", borderRadius: 4, fontWeight: 900
                    }}>{typeName}</span>
                </div>
            </div>
            <HPBar cur={hp} max={maxHp} />
            {!isEnemy && <div style={{ textAlign: "right", fontSize: "clamp(8px,2vmin,10px)", color: "#666", marginTop: 3 }}>{hp}/{maxHp}</div>}
        </div>
    );
}

// Stars display
function Stars({ count, max = 3, size = "md" }) {
    const sz = size === "sm" ? "clamp(12px,3vmin,16px)" : "clamp(16px,4vmin,22px)";
    return (
        <div style={{ display: "flex", gap: 2 }}>
            {[...Array(max)].map((_, i) => (
                <span key={i} style={{ fontSize: sz }} className={i < count ? "star-filled" : "star-empty"}>★</span>
            ))}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function VocabMon({ user, progress, onSignOut }) {
    const remotePlayerState = progress?.playerState || {};
    const remoteUnitStars = progress?.unitStars || {};

    // ── Core state ──
    const [screen, setScreen] = useState("title");
    const [lineId, setLineId] = useState(remotePlayerState.lineId ?? null);   // chosen evo line
    const [stageIdx, setStageIdx] = useState(remotePlayerState.stageIdx ?? 0);       // 0,1,2
    const [monLv, setMonLv] = useState(remotePlayerState.monLv ?? 1);
    const [monExp, setMonExp] = useState(remotePlayerState.monExp ?? 0);
    const [coins, setCoins] = useState(remotePlayerState.coins ?? 120);

    // Stars per unit per stage: { "1_0": 2, "1_1": 1, ... }
    const [unitStars, setUnitStars] = useState(remoteUnitStars);
    // Total stars (sum of all best stars per unit, max 3 each × 12 units = 36)
    const totalStars = Object.values(unitStars).reduce((a, b) => a + b, 0);

    // Streak tracking
    const [streak, setStreak] = useState(remotePlayerState.streak ?? 0);
    const [lastLogin, setLastLogin] = useState(remotePlayerState.lastLogin ?? null);
    const [loginDays, setLoginDays] = useState(remotePlayerState.loginDays ?? 0);
    const [dailyDone, setDailyDone] = useState(remotePlayerState.dailyDone ?? false);

    // Battle state
    const [curUnit, setCurUnit] = useState(null);
    const [battleStage, setBattleStage] = useState(0); // 0=EXPLORE 1=RECALL 2=MASTER
    const [curEnemy, setCurEnemy] = useState(null);
    const [queue, setQueue] = useState([]);
    const [wrongQueue, setWrongQueue] = useState([]);
    const [qIdx, setQIdx] = useState(0);
    const [pHp, setPHp] = useState(0);
    const [eHp, setEHp] = useState(0);
    const [log, setLog] = useState([]);
    const [phase, setPhase] = useState("idle");
    const [sel, setSel] = useState(null);
    const [shakeP, setShakeP] = useState(false);
    const [shakeE, setShakeE] = useState(false);
    const [attackP, setAttackP] = useState(false); // player charges enemy
    const [attackE, setAttackE] = useState(false); // enemy charges player
    const [comboStr, setComboStr] = useState(0);
    const [dmgVal, setDmgVal] = useState(null);
    const [curOpts, setCurOpts] = useState([]);
    const [wrongCount, setWrongCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [won, setWon] = useState(false);
    const [evoAnim, setEvoAnim] = useState(false);
    const [showEvoModal, setShowEvoModal] = useState(false);
    const [newMonName, setNewMonName] = useState("");

    const logRef = useRef(null);

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = 9999; }, [log]);

    useEffect(() => {
        if (!progress?.synced) return;

        setLineId(prev => prev === (remotePlayerState.lineId ?? null) ? prev : (remotePlayerState.lineId ?? null));
        setStageIdx(prev => prev === (remotePlayerState.stageIdx ?? 0) ? prev : (remotePlayerState.stageIdx ?? 0));
        setMonLv(prev => prev === (remotePlayerState.monLv ?? 1) ? prev : (remotePlayerState.monLv ?? 1));
        setMonExp(prev => prev === (remotePlayerState.monExp ?? 0) ? prev : (remotePlayerState.monExp ?? 0));
        setCoins(prev => prev === (remotePlayerState.coins ?? 120) ? prev : (remotePlayerState.coins ?? 120));
        setStreak(prev => prev === (remotePlayerState.streak ?? 0) ? prev : (remotePlayerState.streak ?? 0));
        setLastLogin(prev => prev === (remotePlayerState.lastLogin ?? null) ? prev : (remotePlayerState.lastLogin ?? null));
        setLoginDays(prev => prev === (remotePlayerState.loginDays ?? 0) ? prev : (remotePlayerState.loginDays ?? 0));
        setDailyDone(prev => prev === (remotePlayerState.dailyDone ?? false) ? prev : (remotePlayerState.dailyDone ?? false));
        setUnitStars(prev => {
            const prevKeys = Object.keys(prev);
            const nextKeys = Object.keys(remoteUnitStars);
            if (prevKeys.length === nextKeys.length && nextKeys.every(key => prev[key] === remoteUnitStars[key])) {
                return prev;
            }
            return remoteUnitStars;
        });
    }, [
        progress?.synced,
        remotePlayerState.lineId,
        remotePlayerState.stageIdx,
        remotePlayerState.monLv,
        remotePlayerState.monExp,
        remotePlayerState.coins,
        remotePlayerState.streak,
        remotePlayerState.lastLogin,
        remotePlayerState.loginDays,
        remotePlayerState.dailyDone,
        remoteUnitStars,
    ]);

    useEffect(() => {
        if (!progress?.setPlayerState) return;

        progress.setPlayerState(prev => {
            const next = {
                ...prev,
                lineId,
                stageIdx,
                monLv,
                monExp,
                coins,
                streak,
                loginDays,
                dailyDone,
                lastLogin,
            };

            if (
                prev?.lineId === next.lineId &&
                prev?.stageIdx === next.stageIdx &&
                prev?.monLv === next.monLv &&
                prev?.monExp === next.monExp &&
                prev?.coins === next.coins &&
                prev?.streak === next.streak &&
                prev?.loginDays === next.loginDays &&
                prev?.dailyDone === next.dailyDone &&
                prev?.lastLogin === next.lastLogin
            ) {
                return prev;
            }

            return next;
        });
    }, [coins, dailyDone, lastLogin, lineId, loginDays, monExp, monLv, progress, stageIdx, streak]);

    useEffect(() => {
        if (!progress?.setUnitStars) return;

        progress.setUnitStars(prev => {
            const prevKeys = Object.keys(prev || {});
            const nextKeys = Object.keys(unitStars || {});
            if (prevKeys.length === nextKeys.length && nextKeys.every(key => prev[key] === unitStars[key])) {
                return prev;
            }
            return unitStars;
        });
    }, [progress, unitStars]);

    // Check daily login
    useEffect(() => {
        const today = new Date().toDateString();
        if (lastLogin !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            setLoginDays(d => lastLogin === yesterday ? d + 1 : 1);
            setLastLogin(today); setDailyDone(false);
        }
    }, []);

    const mon = lineId ? EVO_LINES.find(l => l.lineId === lineId).stages[stageIdx] : null;
    const unlockLine = lid => totalStars >= MON_UNLOCK_STARS[lid];
    const evoReady = mon && mon.evoLv && monLv >= mon.evoLv && totalStars >= EVO_UNLOCK_STARS[stageIdx + 1] && stageIdx < 2;

    function tryEvolve() {
        if (!evoReady) return;
        setEvoAnim(true);
        setTimeout(() => {
            setStageIdx(s => s + 1);
            setNewMonName(EVO_LINES.find(l => l.lineId === lineId).stages[stageIdx + 1].name);
            setEvoAnim(false);
            setShowEvoModal(true);
        }, 1800);
    }

    // Get stars for a unit+stage key
    const getUnitStars = (uid, stg) => unitStars[`${uid}_${stg}`] || 0;

    // Calc stars from battle result
    function calcStars(wc, total) {
        if (!won) return 0;
        if (wc === 0) return 3;
        if (wc <= Math.ceil(total * 0.25)) return 2;
        return 1;
    }

    // Build recall opts for a word (shuffled Korean meanings as distractors)
    function getRecallOpts(word) {
        const others = ALL_WORDS.filter(w => w.unit === word.unit && w.w !== word.w);
        const shuffled = shuffle(others).slice(0, 3);
        return shuffle([word.w, ...shuffled.map(w => w.w)]);
    }

    // Build master opts (show English word, pick Korean meaning)
    function getMasterOpts(word) {
        const others = ALL_WORDS.filter(w => w.unit === word.unit && w.w !== word.w);
        const shuffled = shuffle(others).slice(0, 3);
        return shuffle([word.m, ...shuffled.map(w => w.m)]);
    }

    function startBattle(uid, stg = 0) {
        const words = shuffle(getWords(uid));
        const enemy = getEnemy(uid);
        const effMon = EVO_LINES.find(l => l.lineId === lineId).stages[stageIdx];
        setCurUnit(uid); setBattleStage(stg); setCurEnemy(enemy);
        setQueue(words); setWrongQueue([]); setQIdx(0);
        setCurOpts(stg === 2 ? getMasterOpts(words[0]) : getOpts(words[0]));
        setPHp(effMon.hp); setEHp(enemy.hp);
        setWrongCount(0); setCorrectCount(0);
        const stgLabel = ["EXPLORE", "RECALL", "MASTER"][stg];
        setLog([`A wild ${enemy.name} appeared!`, `Stage: ${stgLabel} mode`, stg === 0 ? "영영 정의 → 영어 단어" : stg === 1 ? "한국어 뜻 → 영어 단어" : "영어 단어 → 한국어 뜻"]);
        setPhase("question"); setSel(null); setComboStr(0); setDmgVal(null);
        setScreen("battle");
    }

    function answer(opt) {
        if (phase !== "question" || sel) return;
        setSel(opt); setPhase("anim");
        const word = queue[qIdx];
        // correct answer depends on stage
        const correctAns = battleStage === 2 ? word.m : word.w;
        const correct = opt === correctAns;
        const effMon = EVO_LINES.find(l => l.lineId === lineId).stages[stageIdx];
        const eff = { ...effMon, atk: effMon.atk + monLv * 2 };

        if (correct) {
            const ns = comboStr + 1; setComboStr(ns);
            const base = calcDmg(eff.atk, curEnemy.def);
            const final = ns >= 3 ? Math.floor(base * 1.65) : base;
            const newE = Math.max(0, eHp - final);
            setCorrectCount(c => c + 1);
            setLog(p => [...p, `${ns >= 3 ? `🔥COMBO×${ns}! ` : ""}✅ "${battleStage === 2 ? word.m : word.w}" → -${final}HP`]);

            // ── 정답: 플레이어가 적에게 돌진 ──
            setAttackP(true);                          // 플레이어 출발
            setTimeout(() => {
                // 충돌 순간 (약 35% 지점)
                setShakeE(true);
                setEHp(newE);
                setDmgVal({ val: final, correct: true });
            }, 350);
            setTimeout(() => { setShakeE(false); }, 750);
            setTimeout(() => { setAttackP(false); }, 850); // 플레이어 복귀 완료
            setTimeout(() => { setDmgVal(null); }, 1200);
            setTimeout(() => { newE <= 0 ? endBattle(true) : nextWord(); }, 1050);

        } else {
            setComboStr(0);
            const ed = calcDmg(curEnemy.atk, 8);
            const newP = Math.max(0, pHp - ed);
            setWrongCount(c => c + 1);
            setWrongQueue(q => [...q, word]);
            setLog(p => [...p, `❌ "${battleStage === 2 ? word.m : word.w}" — -${ed}HP`]);

            // ── 오답: 적이 플레이어에게 돌진 ──
            setAttackE(true);                          // 적 출발
            setTimeout(() => {
                // 충돌 순간
                setShakeP(true);
                setPHp(newP);
                setDmgVal({ val: ed, correct: false });
            }, 350);
            setTimeout(() => { setShakeP(false); }, 750);
            setTimeout(() => { setAttackE(false); }, 850); // 적 복귀 완료
            setTimeout(() => { setDmgVal(null); }, 1200);
            setTimeout(() => { newP <= 0 ? endBattle(false) : nextWord(); }, 1050);
        }
    }

    function nextWord() {
        let ni, nq = queue;
        const nxt = qIdx + 1;
        if (nxt >= queue.length) { nq = shuffle(queue); setQueue(nq); ni = 0; setQIdx(0); }
        else { ni = nxt; setQIdx(nxt); }
        const w = nq[ni];
        setCurOpts(battleStage === 2 ? getMasterOpts(w) : getOpts(w));
        setSel(null); setPhase("question");
    }

    function endBattle(didWin) {
        setPhase("end"); setWon(didWin);
        if (didWin) {
            const total = queue.length;
            const stars = calcStars(wrongCount, total);
            const key = `${curUnit}_${battleStage}`;
            setUnitStars(prev => ({ ...prev, [key]: Math.max(prev[key] || 0, stars) }));
            const ec = 20 + curUnit * 8; const ex = 40 + curUnit * 12;
            setCoins(c => c + ec);
            if (!dailyDone) { setDailyDone(true); }
            // Level up check
            const newExp = monExp + ex;
            const threshold = monLv * 80;
            if (newExp >= threshold) {
                const newLv = monLv + 1;
                setMonLv(newLv); setMonExp(newExp - threshold);
                // check evo: mon.evoLv and new level qualifies
                if (mon && mon.evoLv && newLv >= mon.evoLv && stageIdx < 2 && totalStars >= EVO_UNLOCK_STARS[stageIdx + 1]) {
                    setTimeout(() => tryEvolve(), 800);
                }
            } else { setMonExp(newExp); }
            setLog(p => [...p, `🏆 Victory! +${ec}G +${ex}EXP · ${stars}★`]);
        } else {
            setLog(p => [...p, `💀 ${mon.name} fainted...`]);
        }
        setTimeout(() => setScreen("result"), 1400);
    }

    // ── SCREENS ──────────────────────────────────────────

    // TITLE
    if (screen === "title") return (
        <div className="crt page slide-up" style={{
            alignItems: "center", justifyContent: "center",
            padding: "clamp(16px,4vw,32px)", gap: "clamp(14px,3.5vh,26px)",
            background: "radial-gradient(ellipse at 40% 20%,#1A0E2E,#0C0A18)"
        }}>
            <style>{CSS}</style>
            {/* Stars bg */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
                {[...Array(35)].map((_, i) => (
                    <div key={i} style={{
                        position: "absolute", width: i % 4 === 0 ? 3 : 1, height: i % 4 === 0 ? 3 : 1,
                        background: "#fff", left: `${(i * 37 + 13) % 100}%`, top: `${(i * 29 + 7) % 100}%`,
                        opacity: .08 + i % 7 * .12, borderRadius: "50%",
                        animation: `pulse ${1.5 + i % 4 * .7}s ease-in-out infinite`, animationDelay: `${i * .15}s`
                    }} />
                ))}
            </div>

            {/* Logo */}
            <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(8px,1.8vmin,10px)", color: "#6A5888", letterSpacing: 3, marginBottom: 6 }}>
                    WONDERFUL WORLD · BASIC LV.5
                </div>
                <div style={{
                    fontFamily: "var(--f-pk)", fontSize: "clamp(26px,6.5vmin,46px)", color: "#F5C842",
                    animation: "titleGlow 3s ease-in-out infinite", letterSpacing: 2
                }}>VOCAB</div>
                <div style={{
                    fontFamily: "var(--f-pk)", fontSize: "clamp(26px,6.5vmin,46px)", color: "#FF5533",
                    textShadow: "3px 3px 0 #880000", letterSpacing: 2, marginTop: -4
                }}>MON</div>
                <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#F5C842,transparent)", margin: "6px 0" }} />
                <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#6A5888" }}>
                    Learn Words · Battle Monsters
                </div>
            </div>

            {/* Monster parade */}
            <div style={{ display: "flex", gap: "clamp(8px,2.5vw,20px)", alignItems: "flex-end", justifyContent: "center" }}>
                {EVO_LINES.map((line, i) => {
                    const s = line.stages[0];
                    const locked = !unlockLine(line.lineId);
                    return (
                        <div key={line.lineId} style={{
                            textAlign: "center",
                            animation: `floatBob ${2 + i * .4}s ease-in-out infinite`, animationDelay: `${i * .55}s`,
                            opacity: locked ? .35 : 1
                        }}>
                            <s.Sprite w={Math.min(60, Math.max(36, Math.floor(window.innerWidth * .12)))} />
                            <div style={{
                                fontFamily: "var(--f-pk)", fontSize: "clamp(5px,1.2vmin,7px)",
                                color: s.color, marginTop: 3
                            }}>{locked ? "??" : s.name}</div>
                            {locked && <div style={{ fontSize: "clamp(10px,2.5vmin,13px)" }}>🔒</div>}
                        </div>
                    );
                })}
                {/* hint at hidden */}
                <div style={{ textAlign: "center", animation: "floatBob 2.8s ease-in-out infinite", opacity: .2 }}>
                    <LexivoreSprite w={Math.min(60, Math.max(36, Math.floor(window.innerWidth * .12)))} />
                    <div style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(5px,1.2vmin,7px)", color: "#9944EE", marginTop: 3 }}>???</div>
                </div>
            </div>

            {/* Star counter */}
            {totalStars > 0 && (
                <div style={{ fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-sm)", color: "#F5C842" }}>
                    ★ {totalStars} stars collected
                </div>
            )}

            {/* Daily streak */}
            {loginDays > 1 && (
                <div style={{
                    fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-xs)", color: "#FF9933",
                    background: "#1E1A10", padding: "4px 12px", borderRadius: 20, border: "1px solid #443300"
                }}>
                    🔥 {loginDays}일 연속 출석!
                </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
                <button className="big-btn" onClick={() => setScreen(mon ? "world" : "select")}
                    style={{
                        padding: "clamp(12px,2.5vmin,18px)", fontSize: "var(--fs-sm)", color: "#fff",
                        background: "linear-gradient(135deg,#3C7020,#5AA030)", boxShadow: "0 4px 0 #1E3A10"
                    }}>
                    {mon ? "▶  CONTINUE" : "▶  START GAME"}
                </button>
                <button className="big-btn" onClick={() => setScreen("collection")}
                    style={{
                        padding: "clamp(10px,2.2vmin,14px)", fontSize: "var(--fs-sm)", color: "#fff",
                        background: "linear-gradient(135deg,#2A1880,#4A2AAA)", boxShadow: "0 4px 0 #0A0838"
                    }}>
                    📖  COLLECTION
                </button>
            </div>

            <div style={{ animation: "blink 1.5s step-end infinite", fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)", color: "#4A3A60" }}>
                PRESS START
            </div>
        </div>
    );

    // SELECT LINE
    if (screen === "select") return (
        <div className="crt page slide-up" style={{
            alignItems: "center", padding: "clamp(10px,2.5vw,18px)", gap: "clamp(8px,2vh,14px)",
            background: "radial-gradient(ellipse at 50% -10%,#1A0E2E,#0C0A18)"
        }}>
            <style>{CSS}</style>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-md)", color: "#F5C842" }}>CHOOSE YOUR LINE</div>
                <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#6A5888", marginTop: 4 }}>
                    파트너 계열을 선택하라
                </div>
            </div>

            <div style={{ width: "100%", maxWidth: 520, flex: 1, display: "flex", flexDirection: "column", gap: "clamp(8px,2vh,12px)", justifyContent: "center" }}>
                {EVO_LINES.map((line, li) => {
                    const s0 = line.stages[0];
                    const locked = !unlockLine(line.lineId);
                    const needStars = MON_UNLOCK_STARS[line.lineId];
                    return (
                        <div key={line.lineId}
                            onClick={() => { if (!locked) { setLineId(line.lineId); setStageIdx(0); setMonLv(1); setMonExp(0); setScreen("world"); } }}
                            style={{
                                borderRadius: 14, padding: "clamp(10px,2.2vh,16px)",
                                background: locked ? "#0E0C1A" : `linear-gradient(135deg,#12101E,${s0.color}18)`,
                                border: `2px solid ${locked ? "#1A1828" : s0.color + "55"}`,
                                boxShadow: locked ? "none" : `0 0 20px ${s0.glow}22,0 4px 0 rgba(0,0,0,.6)`,
                                cursor: locked ? "not-allowed" : "pointer", opacity: locked ? .4 : 1,
                                display: "flex", alignItems: "center", gap: "clamp(10px,2.5vw,16px)",
                                transition: "all .15s"
                            }}>
                            {/* 3-stage preview */}
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                                {line.stages.map((st, si) => (
                                    <div key={si} style={{ opacity: .4 + si * .3, animation: `floatBob ${2.2 + si * .4}s ease-in-out infinite` }}>
                                        <st.Sprite w={Math.min(32 + si * 14, Math.max(22 + si * 10, Math.floor(window.innerWidth * (0.05 + si * .02))))} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                    <span style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-sm)", color: s0.color }}>{locked ? "??????" : line.stages[0].name}</span>
                                    <span style={{
                                        fontSize: "clamp(7px,1.8vmin,9px)", background: s0.typeClr, color: "#fff",
                                        padding: "2px 6px", borderRadius: 6, fontFamily: "var(--f-ui)", fontWeight: 900
                                    }}>{s0.type}</span>
                                </div>
                                <div style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(6px,1.5vmin,8px)", color: "#6A5888", marginBottom: 4 }}>
                                    {locked ? `🔒 UNLOCK AT ★${needStars}` : `→ ${line.stages[1].name} → ${line.stages[2].name}`}
                                </div>
                                {!locked && (
                                    <div style={{ display: "flex", gap: 10 }}>
                                        {[["HP", s0.hp, "#44CC77"], ["ATK", s0.atk, "#FF8844"], ["DEF", s0.def, "#4488FF"]].map(([k, v, c]) => (
                                            <div key={k} style={{ textAlign: "center" }}>
                                                <div style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(5px,1.3vmin,7px)", color: "#6A5888" }}>{k}</div>
                                                <div style={{ fontFamily: "var(--f-ui)", fontWeight: 900, fontSize: "var(--fs-sm)", color: c }}>{v}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {locked && <div style={{ fontSize: "clamp(20px,5vmin,28px)" }}>🔒</div>}
                        </div>
                    );
                })}

                {/* Hidden mon teaser */}
                <div style={{
                    borderRadius: 14, padding: "clamp(8px,2vh,12px)",
                    background: "linear-gradient(135deg,#0A0818,#1A0844)",
                    border: `2px solid ${totalStars >= 30 ? "#BB66FF55" : "#2A0888"}`,
                    display: "flex", alignItems: "center", gap: 12, opacity: totalStars >= 30 ? 1 : 0.5
                }}>
                    <div style={{ animation: "floatBob 3s ease-in-out infinite", flexShrink: 0 }}>
                        <LexivoreSprite w={Math.min(62, Math.max(42, Math.floor(window.innerWidth * .13)))} />
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-sm)", color: "#BB66FF" }}>
                            {totalStars >= 30 ? "LEXIVORE" : "???"}
                        </div>
                        <div style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(6px,1.5vmin,8px)", color: "#6A5888", marginTop: 4 }}>
                            {totalStars >= 30 ? "HIDDEN UNLOCKED! 🎉" : `🔒 ★30 needed · you have ★${totalStars}`}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0, width: "100%", maxWidth: 520 }}>
                <button className="big-btn" onClick={() => setScreen("title")}
                    style={{
                        flex: 1, padding: "clamp(10px,2.2vmin,13px)", fontSize: "var(--fs-sm)",
                        color: "#8878AA", background: "#1C182E", boxShadow: "0 4px 0 #080612"
                    }}>
                    ← BACK
                </button>
            </div>
        </div>
    );

    // WORLD MAP
    if (screen === "world" && mon) {
        const expPct = Math.min(100, (monExp / (monLv * 80)) * 100);
        return (
            <div className="crt page slide-up" style={{
                padding: "clamp(7px,2vmin,12px)", gap: "clamp(5px,1.5vmin,9px)",
                background: "radial-gradient(ellipse at 50% 0%,#14102A,#0C0A18)"
            }}>
                <style>{CSS}</style>

                {/* Evolution animation overlay */}
                {evoAnim && (
                    <div style={{
                        position: "fixed", inset: 0, zIndex: 1000,
                        background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        animation: "evoFlash 1.8s ease"
                    }}>
                        <div style={{
                            fontFamily: "var(--f-pk)", fontSize: "var(--fs-lg)", color: "#330088",
                            textAlign: "center", animation: "pulse .3s ease-in-out infinite"
                        }}>
                            EVOLVING!
                        </div>
                    </div>
                )}

                {/* Evolution modal */}
                {showEvoModal && (
                    <div style={{
                        position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,.85)",
                        display: "flex", alignItems: "center", justifyContent: "center", padding: 20
                    }}>
                        <div style={{
                            background: "var(--panel)", border: "3px solid #BB66FF", borderRadius: 16,
                            padding: "clamp(20px,5vmin,32px)", textAlign: "center", maxWidth: 340,
                            boxShadow: "0 0 40px rgba(160,80,255,.5)"
                        }}>
                            <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-md)", color: "#BB66FF", marginBottom: 12 }}>
                                ✨ EVOLUTION!
                            </div>
                            <div style={{ animation: "floatBob 2s ease-in-out infinite", marginBottom: 12 }}>
                                {(() => { const S = EVO_LINES.find(l => l.lineId === lineId).stages[stageIdx].Sprite; const w = Math.min(96, Math.max(60, Math.floor(window.innerWidth * .2))); return <S w={w} />; })()}
                            </div>
                            <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-sm)", color: "#F5C842", marginBottom: 6 }}>
                                {newMonName}
                            </div>
                            <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#6A5888", marginBottom: 16 }}>
                                {EVO_LINES.find(l => l.lineId === lineId).stages[stageIdx].desc}
                            </div>
                            <button className="big-btn" onClick={() => setShowEvoModal(false)}
                                style={{
                                    padding: "clamp(10px,2.5vmin,14px) 28px", fontSize: "var(--fs-sm)",
                                    color: "#fff", background: "linear-gradient(135deg,#6600CC,#AA44FF)",
                                    boxShadow: "0 4px 0 #330066"
                                }}>
                                AWESOME! ✨
                            </button>
                        </div>
                    </div>
                )}

                {/* Status bar */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#1C182E", borderRadius: 10, padding: "8px 12px", border: "1px solid var(--rim)", flexShrink: 0
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ animation: "floatBob 2.5s ease-in-out infinite" }}>
                            <mon.Sprite w={Math.min(40, Math.max(28, Math.floor(window.innerWidth * .08)))} />
                        </div>
                        <div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                                <span style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)", color: mon.color }}>{mon.name}</span>
                                <span style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(7px,1.8vmin,9px)", color: "#6A5888" }}>Lv.{monLv}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(6px,1.4vmin,8px)", color: "#9966CC" }}>EXP</span>
                                <div style={{
                                    width: "clamp(48px,12vw,88px)", height: 5, background: "#0E0A18",
                                    borderRadius: 3, overflow: "hidden", border: "1px solid var(--rim)"
                                }}>
                                    <div style={{
                                        height: "100%", background: "linear-gradient(90deg,#7733EE,#BB77FF)",
                                        borderRadius: 3, width: `${expPct}%`, transition: "width .4s ease"
                                    }} />
                                </div>
                            </div>
                            {evoReady && (
                                <div style={{
                                    fontFamily: "var(--f-ui)", fontWeight: 900, fontSize: "clamp(8px,2vmin,10px)",
                                    color: "#BB66FF", animation: "pulse .8s ease-in-out infinite", marginTop: 2
                                }}>
                                    ✨ EVO READY!
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-sm)", color: "#F5C842" }}>💰{coins}G</div>
                        <div style={{ fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-xs)", color: "#F5C842" }}>★{totalStars}</div>
                    </div>
                </div>

                {/* Daily banner */}
                {!dailyDone && (
                    <div style={{
                        background: "linear-gradient(135deg,#1A1000,#2A1A00)", borderRadius: 10,
                        padding: "7px 12px", border: "1px solid #443300", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}>
                        <div>
                            <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)", color: "#FF9933" }}>🔥 TODAY'S MISSION</div>
                            <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#AA7722", marginTop: 2 }}>
                                아무 유닛이나 클리어하면 보너스 EXP!
                            </div>
                        </div>
                        <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)", color: "#FF9933" }}>🎁</div>
                    </div>
                )}

                <div style={{ textAlign: "center", fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)", color: "#4A3A60", flexShrink: 0 }}>
                    ── SELECT UNIT ──
                </div>

                {/* Unit grid */}
                <div style={{
                    flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "clamp(5px,1.5vmin,8px)", overflow: "hidden", minHeight: 0
                }}>
                    {UNIT_INFO.map(u => {
                        const ok = u.id === 1 || Object.keys(unitStars).some(k => parseInt(k) === u.id - 1 && unitStars[k] >= 1);
                        const bestStars = Math.max(0, ...[0, 1, 2].map(s => getUnitStars(u.id, s)));
                        return (
                            <div key={u.id}
                                onClick={() => ok && setScreen(`unitdetail_${u.id}`)}
                                style={{
                                    borderRadius: 10, cursor: ok ? "pointer" : "not-allowed",
                                    opacity: ok ? 1 : .35,
                                    background: bestStars === 3 ? "linear-gradient(135deg,#0A1A08,#0A2A0A)" :
                                        bestStars > 0 ? "#16122A" : "#110F1E",
                                    border: `2px solid ${bestStars === 3 ? "#44CC7755" : bestStars > 0 ? "var(--rim)" : "#1A1828"}`,
                                    boxShadow: bestStars === 3 ? "0 0 10px rgba(68,204,119,.2),0 3px 0 rgba(0,0,0,.5)" : "0 3px 0 rgba(0,0,0,.5)",
                                    display: "flex", alignItems: "center", gap: "clamp(5px,1.3vw,9px)",
                                    padding: "clamp(7px,1.5vmin,11px) clamp(8px,1.8vw,12px)",
                                    transition: "all .12s"
                                }}>
                                <span style={{
                                    fontSize: "clamp(20px,5vmin,28px)", flexShrink: 0,
                                    filter: ok ? `drop-shadow(0 0 5px ${bestStars > 0 ? "#F5C842" : "rgba(255,255,255,.1)"})` : "none"
                                }}>
                                    {ok ? u.emoji : "🔒"}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontFamily: "var(--f-pk)", fontSize: "clamp(8px,2.2vmin,10px)",
                                        color: bestStars === 3 ? "#44CC77" : "#E8E0F0", marginBottom: 2
                                    }}>U{u.id}</div>
                                    <div style={{
                                        fontFamily: "var(--f-ui)", fontWeight: 800,
                                        fontSize: "clamp(10px,2.6vmin,12px)", color: "#9080B0",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                    }}>{u.short}</div>
                                    {bestStars > 0 && <Stars count={bestStars} size="sm" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom nav */}
                <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                    {[
                        { l: "📖", fn: () => setScreen("collection"), bg: "linear-gradient(135deg,#3A1880,#5A28B8)", sh: "#18083A" },
                        { l: "✨ EVO", fn: tryEvolve, bg: evoReady ? "linear-gradient(135deg,#6600CC,#AA44FF)" : "#1C182E", sh: evoReady ? "#330066" : "#080612", disabled: !evoReady },
                        { l: "🏠", fn: () => setScreen("title"), bg: "#1C182E", sh: "#080612" },
                    ].map((b, i) => (
                        <button key={i} className="big-btn" onClick={b.fn} disabled={b.disabled}
                            style={{
                                flex: 1, padding: "clamp(9px,2vmin,12px) 4px", fontSize: "var(--fs-sm)",
                                color: b.disabled ? "#4A3A60" : "#fff", background: b.bg,
                                boxShadow: `0 4px 0 ${b.sh}`, opacity: b.disabled ? .4 : 1
                            }}>
                            {b.l}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // UNIT DETAIL (stage select for a unit)
    if (screen && screen.startsWith("unitdetail_") && mon) {
        const uid = parseInt(screen.split("_")[1]);
        const u = UNIT_INFO.find(x => x.id === uid);
        const STAGE_INFO = [
            { stg: 0, label: "EXPLORE", desc: "영영 정의 → 영어 단어", color: "#44CC77", icon: "🔍" },
            { stg: 1, label: "RECALL", desc: "한국어 뜻 → 영어 단어", color: "#FF9933", icon: "🧠", req: 1 },
            { stg: 2, label: "MASTER", desc: "영어 단어 → 한국어 뜻", color: "#CC66FF", icon: "⭐", req: 2 },
        ];
        return (
            <div className="crt page slide-up" style={{
                alignItems: "center", padding: "clamp(12px,3vw,20px)", gap: "clamp(10px,2.5vh,16px)",
                background: "radial-gradient(ellipse at 50% 0%,#14102A,#0C0A18)"
            }}>
                <style>{CSS}</style>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "clamp(28px,7vmin,40px)", marginBottom: 4 }}>{u.emoji}</div>
                    <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-md)", color: "#F5C842" }}>Unit {uid}</div>
                    <div style={{ fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-sm)", color: "#9080B0", marginTop: 2 }}>{u.name}</div>
                    <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#6A5888", marginTop: 4 }}>
                        {getWords(uid).length}개 단어
                    </div>
                </div>

                <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
                    {STAGE_INFO.map(({ stg, label, desc, color, icon, req }) => {
                        const stars = getUnitStars(uid, stg);
                        const locked = req && getUnitStars(uid, req - 1) < 1;
                        return (
                            <div key={stg}
                                onClick={() => !locked && startBattle(uid, stg)}
                                style={{
                                    borderRadius: 12, padding: "clamp(12px,2.5vh,16px)",
                                    background: locked ? "#0E0C1A" : `linear-gradient(135deg,#14121E,${color}18)`,
                                    border: `2px solid ${locked ? "#1A1828" : stars > 0 ? color + "55" : "var(--rim)"}`,
                                    cursor: locked ? "not-allowed" : "pointer", opacity: locked ? .4 : 1,
                                    display: "flex", alignItems: "center", gap: 12,
                                    boxShadow: locked ? "none" : "0 3px 0 rgba(0,0,0,.5)", transition: "all .12s"
                                }}>
                                <div style={{ fontSize: "clamp(24px,5.5vmin,32px)", flexShrink: 0 }}>{locked ? "🔒" : icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                        <span style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-sm)", color: locked ? "#444" : color }}>{label}</span>
                                        <Stars count={stars} size="sm" />
                                    </div>
                                    <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#6A5888" }}>{desc}</div>
                                    {locked && <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#4A3A60", marginTop: 4 }}>
                                        전 단계를 먼저 클리어하세요
                                    </div>}
                                    {!locked && wrongQueue.length > 0 && curUnit === uid && battleStage === stg && (
                                        <div style={{
                                            fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-xs)",
                                            color: "#EE4444", marginTop: 4, animation: "pulse .8s ease-in-out infinite"
                                        }}>
                                            ⚠️ 오답 {wrongQueue.length}개 복습 필요!
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Retry with wrong words */}
                {wrongQueue.length > 0 && curUnit === uid && (
                    <button className="big-btn" onClick={() => {
                        setQueue(shuffle(wrongQueue)); setWrongQueue([]); setQIdx(0);
                        setCurOpts(battleStage === 2 ? getMasterOpts(wrongQueue[0]) : getOpts(wrongQueue[0]));
                        setPHp(mon.hp); setEHp(getEnemy(uid).hp);
                        setWrongCount(0); setCorrectCount(0);
                        setPhase("question"); setSel(null); setComboStr(0);
                        setLog(["📝 오답 재도전!", "틀린 단어들만 출제됩니다."]);
                        setScreen("battle");
                    }} style={{
                        width: "100%", maxWidth: 400, padding: "clamp(12px,2.5vmin,16px)",
                        fontSize: "var(--fs-sm)", color: "#fff",
                        background: "linear-gradient(135deg,#881A1A,#BB2222)", boxShadow: "0 4px 0 #440000"
                    }}>
                        📝 오답 재도전 ({wrongQueue.length}개)
                    </button>
                )}

                <button className="big-btn" onClick={() => setScreen("world")}
                    style={{
                        width: "100%", maxWidth: 400, padding: "clamp(10px,2.2vmin,13px)",
                        fontSize: "var(--fs-sm)", color: "#8878AA", background: "#1C182E", boxShadow: "0 4px 0 #080612"
                    }}>
                    ← BACK
                </button>
            </div>
        );
    }

    // BATTLE
    if (screen === "battle" && curEnemy && mon) {
        const word = queue[qIdx];
        const u = UNIT_INFO.find(x => x.id === curUnit);
        const stgColor = ["#44CC77", "#FF9933", "#CC66FF"][battleStage];
        const stgLabel = ["EXPLORE", "RECALL", "MASTER"][battleStage];
        const bgSvg = BG_MAP[curEnemy.bgKey] || BG_PLAINS;

        // What to show in the question panel
        const qPrompt = battleStage === 0 ? word?.def
            : battleStage === 1 ? `🇰🇷 ${word?.m}`
                : `🔤 ${word?.w}`;
        const qHint = battleStage === 0 ? `🇰🇷 ${word?.m}` : battleStage === 1 ? word?.def : word?.def;

        return (
            <div className="crt page slide-up" style={{ background: "#0C0A18" }}>
                <style>{CSS}</style>

                {/* Battle field */}
                <div style={{ position: "relative", flex: "0 0 auto", height: "clamp(160px,30vh,240px)", overflow: "hidden" }}>
                    {bgSvg}

                    {/* Enemy nameplate – top left */}
                    <div style={{ position: "absolute", top: 8, left: 8, zIndex: 3 }}>
                        <Nameplate name={curEnemy.name} typeName={curEnemy.type} typeClr={curEnemy.typeClr}
                            hp={eHp} maxHp={curEnemy.hp} isEnemy />
                    </div>

                    {/* Enemy sprite – top right
              z-index 높이면 attackE 때 플레이어 위에 렌더됨 */}
                    <div style={{
                        position: "absolute", right: "5%", top: "4%",
                        zIndex: attackE ? 6 : 2,
                        transformOrigin: "center bottom",
                        animation: attackE
                            ? "enemyCharge .8s cubic-bezier(.3,.7,.4,1) forwards"
                            : shakeE
                                ? "hitRecoil .4s ease"
                                : "floatBob 3s ease-in-out infinite"
                    }}>
                        <curEnemy.Sprite
                            w={Math.min(86, Math.max(52, Math.floor(window.innerHeight * .14)))}
                            hurt={shakeE} />
                    </div>

                    {/* Damage pop – appears at receiver location */}
                    {dmgVal && (
                        <div style={{
                            position: "absolute", zIndex: 10, pointerEvents: "none",
                            right: dmgVal.correct ? "8%" : "auto",
                            left: dmgVal.correct ? "auto" : "8%",
                            top: "10%",
                            fontFamily: "var(--f-pk)", fontSize: "clamp(13px,3.2vmin,19px)",
                            color: dmgVal.correct ? "#44FF88" : "#FF5544",
                            textShadow: "2px 2px 0 #000", animation: "dmgPop 1s ease forwards"
                        }}>
                            -{dmgVal.val}
                        </div>
                    )}

                    {/* Screen flash on impact */}
                    {shakeE && (
                        <div style={{
                            position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none",
                            background: "#ffffff", animation: "screenFlash .45s ease forwards"
                        }} />
                    )}
                    {shakeP && (
                        <div style={{
                            position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none",
                            background: "#FF2200", animation: "screenFlash .45s ease forwards"
                        }} />
                    )}

                    {/* Player sprite – bottom left
              z-index 높이면 attackP 때 적 위에 렌더됨 */}
                    <div style={{
                        position: "absolute", left: "4%", bottom: "24%",
                        zIndex: attackP ? 6 : 2,
                        transformOrigin: "center bottom",
                        animation: attackP
                            ? "playerCharge .8s cubic-bezier(.3,.7,.4,1) forwards"
                            : shakeP
                                ? "hitRecoil .4s ease"
                                : "floatBob 2.6s ease-in-out infinite .4s"
                    }}>
                        <mon.Sprite
                            w={Math.min(96, Math.max(58, Math.floor(window.innerHeight * .16)))}
                            hurt={shakeP} />
                    </div>

                    {/* Player nameplate – bottom right */}
                    <div style={{ position: "absolute", bottom: 6, right: 8, zIndex: 3 }}>
                        <Nameplate name={mon.name} typeName={mon.type} typeClr={mon.typeClr}
                            hp={pHp} maxHp={mon.hp} lv={monLv} />
                    </div>

                    {/* Combo badge */}
                    {comboStr >= 2 && (
                        <div style={{
                            position: "absolute", top: 8, right: 8, zIndex: 5,
                            fontFamily: "var(--f-ui)", fontWeight: 900, fontSize: "var(--fs-xs)",
                            background: "linear-gradient(135deg,#FF6600,#FFCC00)",
                            borderRadius: 20, padding: "3px 10px", color: "#fff",
                            boxShadow: "0 0 14px rgba(255,140,0,.7)",
                            animation: "comboZoom .5s ease-in-out infinite"
                        }}>🔥×{comboStr}</div>
                    )}

                    {/* Stage badge */}
                    <div style={{
                        position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", zIndex: 4,
                        fontFamily: "var(--f-pk)", fontSize: "clamp(6px,1.5vmin,8px)",
                        background: stgColor, color: "#fff", padding: "2px 10px", borderRadius: 10,
                        boxShadow: "0 2px 0 rgba(0,0,0,.4)"
                    }}>
                        {stgLabel}
                    </div>
                </div>

                {/* Battle panel */}
                <div style={{
                    flex: 1, display: "flex", flexDirection: "column", minHeight: 0,
                    background: "#0C0A18", padding: "clamp(7px,2vmin,11px)", gap: "clamp(5px,1.5vmin,8px)"
                }}>

                    {/* Unit label */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-xs)", color: "#9080B0" }}>
                            {u?.emoji} Unit {curUnit}: {u?.name}
                        </div>
                        <div style={{
                            fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)",
                            background: "#1C182E", padding: "3px 8px", borderRadius: 6, color: "#6A5888"
                        }}>Q{qIdx + 1}</div>
                    </div>

                    {/* Question card */}
                    {word && (
                        <div className="battle-panel" style={{ padding: "clamp(9px,2vmin,13px) clamp(10px,2.5vw,15px)", flexShrink: 0 }}>
                            <div style={{
                                fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)",
                                color: "#888", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".04em"
                            }}>
                                {battleStage === 0 ? "▶ Definition → Word" : battleStage === 1 ? "▶ Korean → Word" : "▶ Word → Korean"}
                            </div>
                            <div style={{
                                fontFamily: "var(--f-ui)", fontWeight: 800,
                                fontSize: "clamp(14px,3.8vmin,17px)",
                                color: "#18100E", lineHeight: 1.65, wordBreak: "break-word"
                            }}>
                                {qPrompt}
                            </div>
                            <div style={{
                                marginTop: 6, paddingTop: 6, borderTop: "2px solid #C8C0B0",
                                fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "clamp(11px,2.8vmin,13px)", color: "#7A5A30"
                            }}>
                                {qHint}
                            </div>
                        </div>
                    )}

                    {/* Answer options */}
                    {word && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(5px,1.5vmin,8px)", flexShrink: 0 }}>
                            {curOpts.map((opt, i) => {
                                const correctAns = battleStage === 2 ? word.m : word.w;
                                let cls = "move-btn";
                                if (sel === opt) cls += opt === correctAns ? " correct" : " wrong";
                                else if (sel && opt === correctAns) cls += " reveal";
                                return (
                                    <button key={i} className={cls}
                                        disabled={phase !== "question" || !!sel}
                                        onClick={() => answer(opt)}>
                                        <span style={{
                                            color: "#F5C842", marginRight: 6, fontFamily: "var(--f-pk)",
                                            fontSize: "clamp(8px,2vmin,10px)"
                                        }}>{["A", "B", "C", "D"][i]}.</span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Log */}
                    <div ref={logRef} style={{
                        flex: 1, minHeight: 0, overflowY: "auto",
                        background: "#0A0818", borderRadius: 8, border: "1px solid var(--rim)",
                        padding: "clamp(5px,1.2vmin,8px) 12px"
                    }}>
                        {log.slice(-4).map((l, i, a) => (
                            <div key={i} style={{
                                fontFamily: "var(--f-ui)", fontWeight: 700,
                                fontSize: "clamp(11px,2.8vmin,13px)",
                                color: i === a.length - 1 ? "#E8E0FF" : "#5A4A78", marginBottom: 3, lineHeight: 1.5
                            }}>{l}</div>
                        ))}
                    </div>

                    <button className="big-btn" onClick={() => setScreen("world")}
                        style={{
                            flexShrink: 0, padding: "clamp(10px,2.2vmin,13px)",
                            fontSize: "var(--fs-xs)", color: "#8878AA", background: "#1C182E", boxShadow: "0 3px 0 #080612"
                        }}>
                        ← RUN AWAY
                    </button>
                </div>
            </div>
        );
    }

    // RESULT
    if (screen === "result" && mon) {
        const total = queue.length;
        const stars = won ? calcStars(wrongCount, total) : 0;
        const hasWrong = wrongQueue.length > 0;
        return (
            <div className="crt page slide-up" style={{
                alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center",
                background: won ? "radial-gradient(ellipse at 50% 30%,#0A2814,#0C0A18)" :
                    "radial-gradient(ellipse at 50% 30%,#280808,#0C0A18)"
            }}>
                <style>{CSS}</style>
                <div style={{ marginBottom: 12, animation: "floatBob 2.5s ease-in-out infinite" }}>
                    <mon.Sprite w={Math.min(100, Math.max(64, Math.floor(window.innerWidth * .2)))}
                        fainted={!won} />
                </div>
                <div style={{
                    fontFamily: "var(--f-pk)", fontSize: "clamp(18px,4.5vmin,28px)", letterSpacing: 2,
                    color: won ? "#F5C842" : "#EE3322",
                    textShadow: won ? "0 0 28px rgba(245,200,66,.6),3px 3px 0 #6A3A00" : "0 0 28px rgba(220,30,10,.6),3px 3px 0 #600000",
                    marginBottom: 8
                }}>{won ? "VICTORY!" : "DEFEAT..."}</div>

                {won && (
                    <div style={{ marginBottom: 12 }}>
                        <Stars count={stars} max={3} />
                        <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#6A5888", marginTop: 6 }}>
                            {stars === 3 ? "PERFECT! 전체 정답!" : stars === 2 ? "GOOD! 거의 다 맞혔어" : "CLEAR! 다시 도전해봐"}
                        </div>
                    </div>
                )}

                {hasWrong && won && (
                    <div style={{
                        fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-sm)",
                        color: "#FF8844", marginBottom: 16,
                        background: "#1A0E08", padding: "8px 16px", borderRadius: 10, border: "1px solid #442200"
                    }}>
                        ⚠️ 오답 {wrongQueue.length}개 — 복습 추천!
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
                    {hasWrong && won && (
                        <button className="big-btn" onClick={() => {
                            setScreen(`unitdetail_${curUnit}`);
                        }} style={{
                            padding: "clamp(12px,2.5vmin,16px)", fontSize: "var(--fs-sm)", color: "#fff",
                            background: "linear-gradient(135deg,#881A1A,#BB2222)", boxShadow: "0 4px 0 #440000"
                        }}>
                            📝 오답 복습
                        </button>
                    )}
                    <button className="big-btn" onClick={() => setScreen("world")}
                        style={{
                            padding: "clamp(12px,2.5vmin,16px)", fontSize: "var(--fs-sm)", color: "#fff",
                            background: "linear-gradient(135deg,#3C7020,#5AA030)", boxShadow: "0 4px 0 #1E3A10"
                        }}>
                        ▶ UNIT SELECT
                    </button>
                    {curUnit && (
                        <button className="big-btn" onClick={() => startBattle(curUnit, battleStage)}
                            style={{
                                padding: "clamp(12px,2.5vmin,16px)", fontSize: "var(--fs-sm)", color: "#fff",
                                background: "linear-gradient(135deg,#2A1880,#4A2AAA)", boxShadow: "0 4px 0 #0A0838"
                            }}>
                            🔄 RETRY
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // COLLECTION
    if (screen === "collection") {
        // A monster is "owned/seen" if its line is unlocked
        // Current partner: show up to current stageIdx; other lines: show stage 0 only
        const isOwned = (lineId2, si) => {
            if (!unlockLine(lineId2)) return false;
            if (lineId === lineId2) return si <= stageIdx;
            return si === 0; // other lines show base form only
        };

        return (
            <div className="crt page-y slide-up" style={{
                padding: "clamp(10px,2.5vw,16px)", gap: 10,
                background: "radial-gradient(ellipse at top,#1A0A2E,#0C0A18)"
            }}>
                <style>{CSS}</style>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-md)", color: "#F5C842" }}>📖 COLLECTION</div>
                    <div style={{ fontFamily: "var(--f-ui)", fontWeight: 800, fontSize: "var(--fs-sm)", color: "#F5C842" }}>
                        ★{totalStars}
                    </div>
                </div>

                {/* Evo lines */}
                {EVO_LINES.map(line => {
                    const locked = !unlockLine(line.lineId);
                    return (
                        <div key={line.lineId} style={{ background: "#16122A", borderRadius: 12, padding: 12, border: "1px solid var(--rim)" }}>
                            <div style={{
                                fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)",
                                color: line.stages[0].color, marginBottom: 10
                            }}>
                                {line.lineId.toUpperCase()} LINE {locked ? "🔒" : `(★${MON_UNLOCK_STARS[line.lineId]} to unlock)`}
                            </div>
                            <div style={{ display: "flex", gap: "clamp(6px,2vw,14px)", justifyContent: "center", alignItems: "flex-end" }}>
                                {line.stages.map((st, si) => {
                                    const owned2 = isOwned(line.lineId, si);
                                    return (
                                        <div key={si} style={{ textAlign: "center", flex: 1, opacity: owned2 ? 1 : .25 }}>
                                            <div style={{ animation: owned2 ? `floatBob ${2 + si * .4}s ease-in-out infinite` : "none" }}>
                                                <st.Sprite w={Math.min(52 + si * 10, Math.max(34 + si * 8, Math.floor(window.innerWidth * (0.09 + si * .02))))} />
                                            </div>
                                            <div style={{
                                                fontFamily: "var(--f-pk)", fontSize: "clamp(6px,1.5vmin,8px)",
                                                color: owned2 ? st.color : "#2A2440", marginTop: 4
                                            }}>
                                                {owned2 ? st.name : `Lv.${st.evoLv || 36}+`}
                                            </div>
                                            <div style={{
                                                fontFamily: "var(--f-pk)", fontSize: "clamp(5px,1.2vmin,6px)",
                                                color: "#4A3A60", marginTop: 2
                                            }}>
                                                {owned2 ? `HP${st.hp} ATK${st.atk}` : "???"}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Hidden */}
                <div style={{
                    background: totalStars >= 30 ? "linear-gradient(135deg,#1A0838,#280A50)" : "#0E0C1A",
                    borderRadius: 12, padding: 12, border: `1px solid ${totalStars >= 30 ? "#BB66FF44" : "var(--rim)"}`,
                    display: "flex", alignItems: "center", gap: 12
                }}>
                    <div style={{ opacity: totalStars >= 30 ? 1 : .2, animation: totalStars >= 30 ? "floatBob 2.5s ease-in-out infinite" : "none" }}>
                        <LexivoreSprite w={Math.min(70, Math.max(48, Math.floor(window.innerWidth * .14)))} />
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-sm)", color: "#BB66FF" }}>
                            {totalStars >= 30 ? "LEXIVORE" : "???"}
                        </div>
                        <div style={{ fontFamily: "var(--f-pk)", fontSize: "clamp(6px,1.5vmin,8px)", color: "#6A5888", marginTop: 4 }}>
                            {totalStars >= 30 ? "VOID TYPE · The ultimate partner" : "🔒 Collect ★30 to reveal"}
                        </div>
                        {totalStars >= 30 && <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#9966CC", marginTop: 4 }}>HP{HIDDEN_MON.hp} ATK{HIDDEN_MON.atk} DEF{HIDDEN_MON.def}</div>}
                        {totalStars < 30 && (
                            <div style={{ marginTop: 6 }}>
                                <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                    {[...Array(30)].map((_, i) => (
                                        <span key={i} style={{
                                            fontSize: "clamp(8px,2vmin,11px)",
                                            color: i < totalStars ? "#F5C842" : "#2A2440"
                                        }}>★</span>
                                    ))}
                                </div>
                                <div style={{ fontFamily: "var(--f-ui)", fontWeight: 700, fontSize: "var(--fs-xs)", color: "#6A5888", marginTop: 4 }}>
                                    {totalStars}/30 ★
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Unit progress grid */}
                <div style={{ background: "#16122A", borderRadius: 12, padding: 12, border: "1px solid var(--rim)" }}>
                    <div style={{ fontFamily: "var(--f-pk)", fontSize: "var(--fs-xs)", color: "#F5C842", marginBottom: 10 }}>
                        UNIT PROGRESS
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 4 }}>
                        {UNIT_INFO.map(u => {
                            const best = Math.max(0, ...[0, 1, 2].map(s => getUnitStars(u.id, s)));
                            return (
                                <div key={u.id} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "clamp(16px,4vmin,22px)" }}>{u.emoji}</div>
                                    <div style={{
                                        fontFamily: "var(--f-pk)", fontSize: "clamp(5px,1.2vmin,6px)",
                                        color: "#6A5888", marginBottom: 2
                                    }}>U{u.id}</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                        {[0, 1, 2].map(i => (
                                            <span key={i} style={{
                                                fontSize: "clamp(8px,2vmin,10px)",
                                                color: i < best ? "#F5C842" : "#2A2440"
                                            }}>★</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="big-btn" onClick={() => setScreen(mon ? "world" : "title")}
                    style={{
                        padding: "clamp(10px,2.2vmin,14px)", fontSize: "var(--fs-sm)",
                        color: "#8878AA", background: "#1C182E", boxShadow: "0 4px 0 #080612", marginBottom: 8
                    }}>
                    ← BACK
                </button>
            </div>
        );
    }

    return null;
}
