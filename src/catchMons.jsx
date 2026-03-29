// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CATCH MONSTERS — 6 lines × 3 stages = 18 catchable mons
//  Egg system: complete units → eggs → hatch → collect!
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import React from "react";

/* ── FLAME LINE ─────────────────────────────────── */
// EMBERPUFF — tiny fire marshmallow with a flame tuft
export const EmberpuffSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* body */}
    <ellipse cx="24" cy="30" rx="15" ry="13" fill="#FF6B35" />
    <ellipse cx="24" cy="28" rx="13" ry="11" fill="#FF8C5A" />
    {/* belly */}
    <ellipse cx="24" cy="32" rx="8" ry="6" fill="#FFBB88" />
    {/* flame tuft */}
    <ellipse cx="24" cy="17" rx="5" ry="7" fill="#FF4400" />
    <ellipse cx="22" cy="14" rx="3" ry="5" fill="#FF6600" />
    <ellipse cx="26" cy="13" rx="2" ry="4" fill="#FFAA00" />
    <ellipse cx="24" cy="11" rx="2" ry="3" fill="#FFD700" />
    {/* eyes */}
    <ellipse cx="19" cy="27" rx="4" ry="4.5" fill="white" />
    <ellipse cx="29" cy="27" rx="4" ry="4.5" fill="white" />
    <ellipse cx="20" cy="28" rx="2.5" ry="3" fill="#1A0A00" />
    <ellipse cx="30" cy="28" rx="2.5" ry="3" fill="#1A0A00" />
    <circle cx="19.5" cy="27" r="1" fill="white" />
    <circle cx="29.5" cy="27" r="1" fill="white" />
    {/* blush */}
    <ellipse cx="14" cy="31" rx="3" ry="2" fill="#FF9999" opacity="0.6" />
    <ellipse cx="34" cy="31" rx="3" ry="2" fill="#FF9999" opacity="0.6" />
    {/* tiny feet */}
    <ellipse cx="18" cy="42" rx="5" ry="3" fill="#FF5522" />
    <ellipse cx="30" cy="42" rx="5" ry="3" fill="#FF5522" />
  </svg>
);

// SCORCHCUB — fire bear cub with flame mane
export const ScorchcubSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* flame mane */}
    <ellipse cx="24" cy="14" rx="12" ry="10" fill="#FF4400" opacity="0.9" />
    <ellipse cx="14" cy="18" rx="6" ry="9" fill="#FF6600" opacity="0.8" />
    <ellipse cx="34" cy="18" rx="6" ry="9" fill="#FF6600" opacity="0.8" />
    <ellipse cx="24" cy="10" rx="7" ry="8" fill="#FFAA00" />
    <ellipse cx="24" cy="7" rx="4" ry="5" fill="#FFD700" />
    {/* body */}
    <ellipse cx="24" cy="31" rx="14" ry="13" fill="#CC4400" />
    <ellipse cx="24" cy="29" rx="12" ry="11" fill="#DD5511" />
    {/* belly */}
    <ellipse cx="24" cy="33" rx="8" ry="7" fill="#FFAA66" />
    {/* ears */}
    <ellipse cx="13" cy="17" rx="5" ry="5" fill="#CC4400" />
    <ellipse cx="35" cy="17" rx="5" ry="5" fill="#CC4400" />
    <ellipse cx="13" cy="17" rx="3" ry="3" fill="#FF9944" />
    <ellipse cx="35" cy="17" rx="3" ry="3" fill="#FF9944" />
    {/* face */}
    <ellipse cx="18" cy="27" rx="4.5" ry="5" fill="white" />
    <ellipse cx="30" cy="27" rx="4.5" ry="5" fill="white" />
    <ellipse cx="19" cy="28" rx="3" ry="3.5" fill="#1A0500" />
    <ellipse cx="31" cy="28" rx="3" ry="3.5" fill="#1A0500" />
    <circle cx="18.5" cy="27" r="1.2" fill="white" />
    <circle cx="30.5" cy="27" r="1.2" fill="white" />
    <ellipse cx="24" cy="33" rx="3" ry="2" fill="#CC4422" />
    {/* blush */}
    <ellipse cx="13" cy="31" rx="3.5" ry="2" fill="#FF8888" opacity="0.6" />
    <ellipse cx="35" cy="31" rx="3.5" ry="2" fill="#FF8888" opacity="0.6" />
    {/* paws */}
    <ellipse cx="12" cy="42" rx="6" ry="4" fill="#CC4400" />
    <ellipse cx="36" cy="42" rx="6" ry="4" fill="#CC4400" />
  </svg>
);

// BLAZEKING — majestic fire lion with epic flame crown
export const BlazeKingSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* crown flames */}
    <ellipse cx="24" cy="5" rx="3" ry="6" fill="#FFD700" />
    <ellipse cx="16" cy="8" rx="2.5" ry="5" fill="#FFAA00" />
    <ellipse cx="32" cy="8" rx="2.5" ry="5" fill="#FFAA00" />
    <ellipse cx="10" cy="13" rx="2" ry="4" fill="#FF6600" />
    <ellipse cx="38" cy="13" rx="2" ry="4" fill="#FF6600" />
    {/* epic mane */}
    <ellipse cx="24" cy="19" rx="18" ry="15" fill="#FF4400" />
    <ellipse cx="24" cy="17" rx="14" ry="12" fill="#FF6600" />
    <ellipse cx="24" cy="15" rx="10" ry="9" fill="#FFAA00" />
    {/* body */}
    <ellipse cx="24" cy="34" rx="13" ry="12" fill="#AA2200" />
    <ellipse cx="24" cy="32" rx="11" ry="10" fill="#CC3311" />
    {/* belly */}
    <ellipse cx="24" cy="35" rx="7" ry="6" fill="#FF9944" />
    {/* face */}
    <ellipse cx="17" cy="22" rx="5" ry="5.5" fill="white" />
    <ellipse cx="31" cy="22" rx="5" ry="5.5" fill="white" />
    <ellipse cx="18" cy="23" rx="3.5" ry="4" fill="#FF2200" />
    <ellipse cx="32" cy="23" rx="3.5" ry="4" fill="#FF2200" />
    <ellipse cx="18.5" cy="22.5" rx="1.5" ry="2" fill="#1A0000" />
    <ellipse cx="32.5" cy="22.5" rx="1.5" ry="2" fill="#1A0000" />
    <circle cx="17.5" cy="21.5" r="1.5" fill="white" />
    <circle cx="31.5" cy="21.5" r="1.5" fill="white" />
    {/* snout */}
    <ellipse cx="24" cy="28" rx="4" ry="3" fill="#FFAA66" />
    <ellipse cx="24" cy="27" rx="2" ry="1.5" fill="#FF6644" />
    {/* paws */}
    <ellipse cx="11" cy="43" rx="7" ry="4" fill="#AA2200" />
    <ellipse cx="37" cy="43" rx="7" ry="4" fill="#AA2200" />
    {/* tail flame */}
    <ellipse cx="40" cy="30" rx="4" ry="7" fill="#FF6600" transform="rotate(30 40 30)" />
    <ellipse cx="41" cy="27" rx="2" ry="4" fill="#FFD700" transform="rotate(30 41 27)" />
  </svg>
);

/* ── WAVE LINE ──────────────────────────────────── */
// BUBBLET — tiny water bubble with fish fins
export const BubbletSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* body bubble */}
    <ellipse cx="24" cy="27" rx="14" ry="14" fill="#44AAFF" opacity="0.85" />
    <ellipse cx="24" cy="25" rx="12" ry="12" fill="#66CCFF" opacity="0.9" />
    {/* shine */}
    <ellipse cx="18" cy="20" rx="4" ry="3" fill="white" opacity="0.5" />
    {/* fins */}
    <ellipse cx="9" cy="27" rx="5" ry="4" fill="#22AAFF" transform="rotate(-20 9 27)" />
    <ellipse cx="39" cy="27" rx="5" ry="4" fill="#22AAFF" transform="rotate(20 39 27)" />
    {/* tail */}
    <ellipse cx="24" cy="42" rx="8" ry="4" fill="#22AAFF" />
    <ellipse cx="24" cy="42" rx="5" ry="2.5" fill="#44CCFF" />
    {/* eyes */}
    <ellipse cx="18" cy="25" rx="4" ry="4.5" fill="white" />
    <ellipse cx="30" cy="25" rx="4" ry="4.5" fill="white" />
    <ellipse cx="19" cy="26" rx="2.5" ry="3" fill="#003388" />
    <ellipse cx="31" cy="26" rx="2.5" ry="3" fill="#003388" />
    <circle cx="18.5" cy="25" r="1" fill="white" />
    <circle cx="30.5" cy="25" r="1" fill="white" />
    {/* blush */}
    <ellipse cx="13" cy="29" rx="2.5" ry="1.5" fill="#AADDFF" opacity="0.7" />
    <ellipse cx="35" cy="29" rx="2.5" ry="1.5" fill="#AADDFF" opacity="0.7" />
    {/* bubbles */}
    <circle cx="8" cy="16" r="2" fill="#88DDFF" opacity="0.5" />
    <circle cx="38" cy="13" r="1.5" fill="#88DDFF" opacity="0.5" />
    <circle cx="5" cy="24" r="1" fill="#88DDFF" opacity="0.4" />
  </svg>
);

// CORALIA — coral mermaid creature
export const CoraliaSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* coral crown */}
    <ellipse cx="24" cy="7" rx="2" ry="6" fill="#FF6699" />
    <ellipse cx="18" cy="9" rx="1.5" ry="5" fill="#FF4477" />
    <ellipse cx="30" cy="9" rx="1.5" ry="5" fill="#FF4477" />
    <ellipse cx="13" cy="13" rx="1.5" ry="4" fill="#FF88AA" />
    <ellipse cx="35" cy="13" rx="1.5" ry="4" fill="#FF88AA" />
    {/* body */}
    <ellipse cx="24" cy="26" rx="13" ry="14" fill="#0088CC" />
    <ellipse cx="24" cy="24" rx="11" ry="12" fill="#00AAEE" />
    {/* belly/pattern */}
    <ellipse cx="24" cy="28" rx="7" ry="8" fill="#44CCFF" opacity="0.6" />
    {/* scales pattern */}
    <ellipse cx="20" cy="25" rx="2.5" ry="1.5" fill="#0099DD" opacity="0.5" />
    <ellipse cx="28" cy="25" rx="2.5" ry="1.5" fill="#0099DD" opacity="0.5" />
    <ellipse cx="24" cy="28" rx="2.5" ry="1.5" fill="#0099DD" opacity="0.5" />
    {/* fins/arms */}
    <ellipse cx="9" cy="23" rx="5" ry="7" fill="#0077BB" transform="rotate(-15 9 23)" />
    <ellipse cx="39" cy="23" rx="5" ry="7" fill="#0077BB" transform="rotate(15 39 23)" />
    {/* tail */}
    <ellipse cx="18" cy="41" rx="7" ry="4" fill="#0077BB" transform="rotate(-10 18 41)" />
    <ellipse cx="30" cy="41" rx="7" ry="4" fill="#0077BB" transform="rotate(10 30 41)" />
    {/* face */}
    <ellipse cx="18" cy="21" rx="4.5" ry="5" fill="white" />
    <ellipse cx="30" cy="21" rx="4.5" ry="5" fill="white" />
    <ellipse cx="19" cy="22" rx="3" ry="3.5" fill="#004488" />
    <ellipse cx="31" cy="22" rx="3" ry="3.5" fill="#004488" />
    <circle cx="18.5" cy="21" r="1.2" fill="white" />
    <circle cx="30.5" cy="21" r="1.2" fill="white" />
    {/* blush */}
    <ellipse cx="13" cy="25" rx="3" ry="2" fill="#FF99BB" opacity="0.6" />
    <ellipse cx="35" cy="25" rx="3" ry="2" fill="#FF99BB" opacity="0.6" />
    {/* smile */}
    <path d="M 20 29 Q 24 32 28 29" stroke="#0055AA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

// TIDALON — majestic sea dragon
export const TidalonSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* back fin */}
    <ellipse cx="24" cy="8" rx="6" ry="10" fill="#0055AA" />
    <ellipse cx="24" cy="8" rx="4" ry="7" fill="#0077CC" />
    {/* body */}
    <ellipse cx="24" cy="27" rx="15" ry="16" fill="#005599" />
    <ellipse cx="24" cy="25" rx="13" ry="14" fill="#0077BB" />
    {/* belly */}
    <ellipse cx="24" cy="29" rx="8" ry="9" fill="#44AADD" opacity="0.8" />
    {/* scales */}
    <ellipse cx="18" cy="22" rx="3" ry="2" fill="#0066AA" opacity="0.6" />
    <ellipse cx="30" cy="22" rx="3" ry="2" fill="#0066AA" opacity="0.6" />
    <ellipse cx="24" cy="20" rx="3" ry="2" fill="#0066AA" opacity="0.6" />
    <ellipse cx="18" cy="27" rx="3" ry="2" fill="#0066AA" opacity="0.5" />
    <ellipse cx="30" cy="27" rx="3" ry="2" fill="#0066AA" opacity="0.5" />
    {/* side fins */}
    <ellipse cx="7" cy="25" rx="6" ry="8" fill="#0055AA" transform="rotate(-20 7 25)" />
    <ellipse cx="41" cy="25" rx="6" ry="8" fill="#0055AA" transform="rotate(20 41 25)" />
    {/* tail */}
    <ellipse cx="16" cy="43" rx="9" ry="4" fill="#0044AA" transform="rotate(-15 16 43)" />
    <ellipse cx="32" cy="43" rx="9" ry="4" fill="#0044AA" transform="rotate(15 32 43)" />
    {/* horns */}
    <ellipse cx="17" cy="12" rx="2" ry="6" fill="#0044AA" transform="rotate(-15 17 12)" />
    <ellipse cx="31" cy="12" rx="2" ry="6" fill="#0044AA" transform="rotate(15 31 12)" />
    {/* face */}
    <ellipse cx="17" cy="21" rx="5" ry="5.5" fill="white" />
    <ellipse cx="31" cy="21" rx="5" ry="5.5" fill="white" />
    <ellipse cx="18" cy="22" rx="3.5" ry="4" fill="#0033AA" />
    <ellipse cx="32" cy="22" rx="3.5" ry="4" fill="#0033AA" />
    <circle cx="17.5" cy="21" r="1.5" fill="white" />
    <circle cx="31.5" cy="21" r="1.5" fill="white" />
    {/* nostrils */}
    <ellipse cx="24" cy="28" rx="3" ry="2" fill="#0077BB" />
  </svg>
);

/* ── LEAF LINE ──────────────────────────────────── */
// SPROUTLING — tiny plant sprout with cute face
export const SproutlingSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* leaf hat */}
    <ellipse cx="24" cy="12" rx="12" ry="8" fill="#44BB44" />
    <ellipse cx="24" cy="10" rx="10" ry="6" fill="#66DD55" />
    <ellipse cx="24" cy="8" rx="6" ry="4" fill="#88FF66" />
    {/* stem */}
    <rect x="22" y="16" width="4" height="6" rx="2" fill="#33AA33" />
    {/* body */}
    <ellipse cx="24" cy="31" rx="13" ry="12" fill="#55BB33" />
    <ellipse cx="24" cy="29" rx="11" ry="10" fill="#77CC44" />
    {/* belly */}
    <ellipse cx="24" cy="33" rx="7" ry="6" fill="#AAEEBB" />
    {/* tiny buds */}
    <ellipse cx="11" cy="23" rx="4" ry="5" fill="#55BB33" />
    <ellipse cx="11" cy="22" rx="3" ry="3.5" fill="#99EE55" />
    <ellipse cx="37" cy="23" rx="4" ry="5" fill="#55BB33" />
    <ellipse cx="37" cy="22" rx="3" ry="3.5" fill="#99EE55" />
    {/* eyes */}
    <ellipse cx="19" cy="27" rx="4" ry="4.5" fill="white" />
    <ellipse cx="29" cy="27" rx="4" ry="4.5" fill="white" />
    <ellipse cx="20" cy="28" rx="2.5" ry="3" fill="#1A3300" />
    <ellipse cx="30" cy="28" rx="2.5" ry="3" fill="#1A3300" />
    <circle cx="19.5" cy="27" r="1" fill="white" />
    <circle cx="29.5" cy="27" r="1" fill="white" />
    {/* blush */}
    <ellipse cx="14" cy="31" rx="3" ry="2" fill="#AAFFAA" opacity="0.7" />
    <ellipse cx="34" cy="31" rx="3" ry="2" fill="#AAFFAA" opacity="0.7" />
    {/* tiny feet */}
    <ellipse cx="18" cy="42" rx="5" ry="3" fill="#44AA33" />
    <ellipse cx="30" cy="42" rx="5" ry="3" fill="#44AA33" />
  </svg>
);

// BLOOMHOG — flower hedgehog
export const BloomhogSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* spines (flower petals) */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
      <ellipse key={a} cx={24 + 14 * Math.cos((a - 90) * Math.PI / 180)}
        cy={22 + 14 * Math.sin((a - 90) * Math.PI / 180)}
        rx="3" ry="5"
        fill={a % 60 === 0 ? "#FF88AA" : "#FFCC44"}
        transform={`rotate(${a} ${24 + 14 * Math.cos((a - 90) * Math.PI / 180)} ${22 + 14 * Math.sin((a - 90) * Math.PI / 180)})`}
      />
    ))}
    {/* body */}
    <ellipse cx="24" cy="28" rx="13" ry="12" fill="#33AA44" />
    <ellipse cx="24" cy="26" rx="11" ry="10" fill="#55CC55" />
    {/* belly */}
    <ellipse cx="24" cy="30" rx="7" ry="6" fill="#BBEECC" />
    {/* face */}
    <ellipse cx="18" cy="25" rx="4.5" ry="5" fill="white" />
    <ellipse cx="30" cy="25" rx="4.5" ry="5" fill="white" />
    <ellipse cx="19" cy="26" rx="3" ry="3.5" fill="#1A3300" />
    <ellipse cx="31" cy="26" rx="3" ry="3.5" fill="#1A3300" />
    <circle cx="18.5" cy="25" r="1.2" fill="white" />
    <circle cx="30.5" cy="25" r="1.2" fill="white" />
    {/* snout */}
    <ellipse cx="24" cy="31" rx="3.5" ry="2.5" fill="#BBEEAA" />
    <ellipse cx="24" cy="30" rx="1.5" ry="1" fill="#88BB66" />
    {/* blush */}
    <ellipse cx="13" cy="28" rx="3" ry="2" fill="#FFAACC" opacity="0.7" />
    <ellipse cx="35" cy="28" rx="3" ry="2" fill="#FFAACC" opacity="0.7" />
    {/* feet */}
    <ellipse cx="17" cy="40" rx="5" ry="3.5" fill="#33AA44" />
    <ellipse cx="31" cy="40" rx="5" ry="3.5" fill="#33AA44" />
  </svg>
);

// TREANT — ancient tree creature
export const TreantSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* canopy */}
    <ellipse cx="24" cy="10" rx="18" ry="12" fill="#228833" />
    <ellipse cx="14" cy="13" rx="10" ry="9" fill="#33AA44" />
    <ellipse cx="34" cy="13" rx="10" ry="9" fill="#33AA44" />
    <ellipse cx="24" cy="8" rx="12" ry="9" fill="#44CC55" />
    {/* fruits/flowers */}
    <circle cx="16" cy="8" r="2.5" fill="#FF4444" />
    <circle cx="32" cy="7" r="2" fill="#FF4444" />
    <circle cx="24" cy="5" r="2" fill="#FFAA00" />
    <circle cx="10" cy="14" r="1.5" fill="#FF8800" />
    <circle cx="38" cy="12" r="1.5" fill="#FF4444" />
    {/* trunk body */}
    <ellipse cx="24" cy="33" rx="11" ry="13" fill="#664422" />
    <ellipse cx="24" cy="31" rx="9" ry="11" fill="#885533" />
    {/* bark texture */}
    <path d="M 18 24 Q 20 28 18 32" stroke="#664422" strokeWidth="1.5" fill="none" />
    <path d="M 30 26 Q 28 30 30 34" stroke="#664422" strokeWidth="1.5" fill="none" />
    <path d="M 22 28 Q 24 32 23 36" stroke="#664422" strokeWidth="1" fill="none" />
    {/* branch arms */}
    <ellipse cx="8" cy="24" rx="7" ry="4" fill="#664422" transform="rotate(-30 8 24)" />
    <ellipse cx="40" cy="24" rx="7" ry="4" fill="#664422" transform="rotate(30 40 24)" />
    {/* leaf tufts on arms */}
    <ellipse cx="5" cy="19" rx="5" ry="4" fill="#44CC55" />
    <ellipse cx="43" cy="19" rx="5" ry="4" fill="#44CC55" />
    {/* glowing eyes */}
    <ellipse cx="18" cy="28" rx="4" ry="4.5" fill="#AAFF66" />
    <ellipse cx="30" cy="28" rx="4" ry="4.5" fill="#AAFF66" />
    <ellipse cx="18.5" cy="28.5" rx="2.5" ry="3" fill="#004400" />
    <ellipse cx="30.5" cy="28.5" rx="2.5" ry="3" fill="#004400" />
    <circle cx="18" cy="27.5" r="1" fill="#AAFFAA" />
    <circle cx="30" cy="27.5" r="1" fill="#AAFFAA" />
    {/* roots/feet */}
    <ellipse cx="15" cy="44" rx="7" ry="3" fill="#553311" transform="rotate(-10 15 44)" />
    <ellipse cx="33" cy="44" rx="7" ry="3" fill="#553311" transform="rotate(10 33 44)" />
  </svg>
);

/* ── BOLT LINE ──────────────────────────────────── */
// ZAPLET — electric kitten
export const ZapletSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* electric sparks around body */}
    <text x="5" y="14" fontSize="8" fill="#FFEE00" opacity="0.8">⚡</text>
    <text x="34" y="12" fontSize="6" fill="#FFCC00" opacity="0.7">⚡</text>
    {/* ears */}
    <ellipse cx="14" cy="16" rx="5" ry="6" fill="#DDAA00" />
    <ellipse cx="34" cy="16" rx="5" ry="6" fill="#DDAA00" />
    <ellipse cx="14" cy="16" rx="3" ry="4" fill="#FFD700" />
    <ellipse cx="34" cy="16" rx="3" ry="4" fill="#FFD700" />
    {/* lightning bolt ears tips */}
    <polygon points="13,11 15,11 14,13" fill="#FFFFFF" />
    <polygon points="33,11 35,11 34,13" fill="#FFFFFF" />
    {/* body */}
    <ellipse cx="24" cy="30" rx="13" ry="13" fill="#CCAA00" />
    <ellipse cx="24" cy="28" rx="11" ry="11" fill="#FFCC00" />
    {/* belly */}
    <ellipse cx="24" cy="32" rx="7" ry="6" fill="#FFFFAA" />
    {/* stripes */}
    <ellipse cx="18" cy="26" rx="2" ry="4" fill="#DDAA00" opacity="0.5" />
    <ellipse cx="30" cy="26" rx="2" ry="4" fill="#DDAA00" opacity="0.5" />
    {/* eyes */}
    <ellipse cx="18" cy="26" rx="4.5" ry="5" fill="white" />
    <ellipse cx="30" cy="26" rx="4.5" ry="5" fill="white" />
    <ellipse cx="19" cy="27" rx="3" ry="3.5" fill="#1A1000" />
    <ellipse cx="31" cy="27" rx="3" ry="3.5" fill="#1A1000" />
    <circle cx="18.5" cy="26" r="1.2" fill="white" />
    <circle cx="30.5" cy="26" r="1.2" fill="white" />
    {/* glow eyes */}
    <ellipse cx="18" cy="26" rx="5" ry="5.5" fill="#FFEE00" opacity="0.15" />
    <ellipse cx="30" cy="26" rx="5" ry="5.5" fill="#FFEE00" opacity="0.15" />
    {/* tiny nose */}
    <ellipse cx="24" cy="31" rx="1.5" ry="1" fill="#CC8800" />
    {/* blush */}
    <ellipse cx="13" cy="30" rx="3" ry="2" fill="#FFEE88" opacity="0.6" />
    <ellipse cx="35" cy="30" rx="3" ry="2" fill="#FFEE88" opacity="0.6" />
    {/* tail with lightning */}
    <path d="M 37 38 Q 44 30 40 22 Q 38 18 42 14" stroke="#FFCC00" strokeWidth="3" fill="none" strokeLinecap="round" />
    <polygon points="40,18 43,14 38,16" fill="#FFFFFF" />
    {/* paws */}
    <ellipse cx="16" cy="42" rx="5" ry="3.5" fill="#CCAA00" />
    <ellipse cx="30" cy="42" rx="5" ry="3.5" fill="#CCAA00" />
  </svg>
);

// THUNDERMEW — thunder cat
export const ThundermewSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* lightning halo */}
    <ellipse cx="24" cy="14" rx="16" ry="6" fill="#FFEE00" opacity="0.2" />
    {/* ears */}
    <ellipse cx="12" cy="14" rx="6" ry="7" fill="#CC9900" />
    <ellipse cx="36" cy="14" rx="6" ry="7" fill="#CC9900" />
    <ellipse cx="12" cy="14" rx="4" ry="5" fill="#FFDD00" />
    <ellipse cx="36" cy="14" rx="4" ry="5" fill="#FFDD00" />
    {/* big lightning bolt on chest */}
    <polygon points="24,19 21,27 25,26 22,35 28,25 23,26" fill="#FFFFFF" opacity="0.9" />
    {/* body */}
    <ellipse cx="24" cy="30" rx="15" ry="14" fill="#BB8800" />
    <ellipse cx="24" cy="28" rx="13" ry="12" fill="#DDAA00" />
    {/* belly */}
    <ellipse cx="24" cy="32" rx="8" ry="7" fill="#FFEE88" />
    {/* face */}
    <ellipse cx="17" cy="24" rx="5" ry="5.5" fill="white" />
    <ellipse cx="31" cy="24" rx="5" ry="5.5" fill="white" />
    <ellipse cx="18" cy="25" rx="3.5" ry="4" fill="#FFCC00" />
    <ellipse cx="32" cy="25" rx="3.5" ry="4" fill="#FFCC00" />
    <ellipse cx="18.5" cy="24.5" rx="2" ry="2.5" fill="#1A0F00" />
    <ellipse cx="32.5" cy="24.5" rx="2" ry="2.5" fill="#1A0F00" />
    <circle cx="18" cy="23.5" r="1.2" fill="white" />
    <circle cx="32" cy="23.5" r="1.2" fill="white" />
    {/* nose */}
    <ellipse cx="24" cy="30" rx="2" ry="1.5" fill="#BB8800" />
    {/* whiskers */}
    <line x1="10" y1="30" x2="20" y2="31" stroke="#886600" strokeWidth="1" />
    <line x1="28" y1="31" x2="38" y2="30" stroke="#886600" strokeWidth="1" />
    <line x1="10" y1="32" x2="19" y2="32" stroke="#886600" strokeWidth="1" />
    <line x1="29" y1="32" x2="38" y2="32" stroke="#886600" strokeWidth="1" />
    {/* paws */}
    <ellipse cx="12" cy="43" rx="6.5" ry="4" fill="#BB8800" />
    <ellipse cx="36" cy="43" rx="6.5" ry="4" fill="#BB8800" />
    {/* tail */}
    <path d="M 39 37 Q 46 30 43 20" stroke="#CC9900" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <ellipse cx="43" cy="20" rx="3" ry="4" fill="#FFEE00" />
  </svg>
);

// VOLTIGER — electric tiger with lightning wings
export const VoltigerSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* lightning wings */}
    <ellipse cx="6" cy="20" rx="8" ry="14" fill="#FFEE00" opacity="0.7" transform="rotate(-20 6 20)" />
    <ellipse cx="42" cy="20" rx="8" ry="14" fill="#FFEE00" opacity="0.7" transform="rotate(20 42 20)" />
    <ellipse cx="6" cy="20" rx="5" ry="10" fill="#FFD700" opacity="0.9" transform="rotate(-20 6 20)" />
    <ellipse cx="42" cy="20" rx="5" ry="10" fill="#FFD700" opacity="0.9" transform="rotate(20 42 20)" />
    {/* body */}
    <ellipse cx="24" cy="30" rx="15" ry="14" fill="#886600" />
    <ellipse cx="24" cy="28" rx="13" ry="12" fill="#AAAA00" />
    {/* tiger stripes */}
    <ellipse cx="17" cy="24" rx="2.5" ry="5" fill="#555500" opacity="0.6" transform="rotate(-10 17 24)" />
    <ellipse cx="31" cy="24" rx="2.5" ry="5" fill="#555500" opacity="0.6" transform="rotate(10 31 24)" />
    <ellipse cx="24" cy="22" rx="2" ry="4" fill="#555500" opacity="0.5" />
    {/* belly */}
    <ellipse cx="24" cy="32" rx="8" ry="7" fill="#EEDD88" />
    {/* ears */}
    <ellipse cx="12" cy="14" rx="6" ry="7" fill="#887700" />
    <ellipse cx="36" cy="14" rx="6" ry="7" fill="#887700" />
    <ellipse cx="12" cy="14" rx="4" ry="5" fill="#FFDD00" />
    <ellipse cx="36" cy="14" rx="4" ry="5" fill="#FFDD00" />
    {/* face */}
    <ellipse cx="17" cy="23" rx="5" ry="5.5" fill="white" />
    <ellipse cx="31" cy="23" rx="5" ry="5.5" fill="white" />
    <ellipse cx="18" cy="24" rx="3.5" ry="4" fill="#DDBB00" />
    <ellipse cx="32" cy="24" rx="3.5" ry="4" fill="#DDBB00" />
    <ellipse cx="18.5" cy="23.5" rx="2" ry="2.5" fill="#1A1000" />
    <ellipse cx="32.5" cy="23.5" rx="2" ry="2.5" fill="#1A1000" />
    <circle cx="18" cy="22.5" r="1.5" fill="white" />
    <circle cx="32" cy="22.5" r="1.5" fill="white" />
    {/* snout */}
    <ellipse cx="24" cy="30" rx="4" ry="3" fill="#CCAA44" />
    <ellipse cx="24" cy="29" rx="2" ry="1.5" fill="#AA7700" />
    {/* paws */}
    <ellipse cx="11" cy="43" rx="7" ry="4" fill="#886600" />
    <ellipse cx="37" cy="43" rx="7" ry="4" fill="#886600" />
    {/* lightning tail */}
    <path d="M 39 38 L 44 30 L 40 28 L 46 18 L 42 16" stroke="#FFEE00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

/* ── SHADOW LINE (RARE) ─────────────────────────── */
// SHADELING — shadow wisp with glowing eyes
export const ShadelingSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* glow aura */}
    <ellipse cx="24" cy="28" rx="17" ry="16" fill="#330066" opacity="0.4" />
    {/* wispy body */}
    <ellipse cx="24" cy="27" rx="13" ry="15" fill="#220044" />
    <ellipse cx="24" cy="25" rx="11" ry="13" fill="#330055" />
    {/* wisp tails */}
    <ellipse cx="16" cy="40" rx="4" ry="6" fill="#220044" transform="rotate(-20 16 40)" />
    <ellipse cx="24" cy="43" rx="4" ry="5" fill="#220044" />
    <ellipse cx="32" cy="40" rx="4" ry="6" fill="#220044" transform="rotate(20 32 40)" />
    {/* arms wispy */}
    <ellipse cx="8" cy="24" rx="5" ry="7" fill="#220044" transform="rotate(-15 8 24)" />
    <ellipse cx="40" cy="24" rx="5" ry="7" fill="#220044" transform="rotate(15 40 24)" />
    {/* glowing eyes */}
    <ellipse cx="18" cy="22" rx="5" ry="5.5" fill="#9900FF" />
    <ellipse cx="30" cy="22" rx="5" ry="5.5" fill="#9900FF" />
    <ellipse cx="18" cy="22" rx="3.5" ry="4" fill="#CC44FF" />
    <ellipse cx="30" cy="22" rx="3.5" ry="4" fill="#CC44FF" />
    <ellipse cx="18.5" cy="22" rx="2" ry="2.5" fill="#FF99FF" />
    <ellipse cx="30.5" cy="22" rx="2" ry="2.5" fill="#FF99FF" />
    <circle cx="18" cy="21" r="1.2" fill="white" />
    <circle cx="30" cy="21" r="1.2" fill="white" />
    {/* evil smile */}
    <path d="M 19 31 Q 24 35 29 31" stroke="#9900FF" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="21" cy="32" r="1" fill="#CC44FF" />
    <circle cx="27" cy="32" r="1" fill="#CC44FF" />
    {/* floating particles */}
    <circle cx="9" cy="14" r="2" fill="#9900FF" opacity="0.6" />
    <circle cx="38" cy="11" r="1.5" fill="#CC44FF" opacity="0.5" />
    <circle cx="5" cy="33" r="1.5" fill="#6600BB" opacity="0.4" />
  </svg>
);

// GLOOMWING — dark moth creature
export const GloomwingSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* wings */}
    <ellipse cx="8" cy="18" rx="10" ry="16" fill="#220044" transform="rotate(-15 8 18)" />
    <ellipse cx="40" cy="18" rx="10" ry="16" fill="#220044" transform="rotate(15 40 18)" />
    <ellipse cx="8" cy="18" rx="7" ry="12" fill="#440066" transform="rotate(-15 8 18)" />
    <ellipse cx="40" cy="18" rx="7" ry="12" fill="#440066" transform="rotate(15 40 18)" />
    {/* wing pattern */}
    <ellipse cx="8" cy="15" rx="3" ry="5" fill="#CC44FF" opacity="0.4" transform="rotate(-15 8 15)" />
    <ellipse cx="40" cy="15" rx="3" ry="5" fill="#CC44FF" opacity="0.4" transform="rotate(15 40 15)" />
    <circle cx="8" cy="12" r="2" fill="#FF99FF" opacity="0.5" />
    <circle cx="40" cy="12" r="2" fill="#FF99FF" opacity="0.5" />
    {/* lower wings */}
    <ellipse cx="11" cy="30" rx="8" ry="10" fill="#330055" transform="rotate(10 11 30)" />
    <ellipse cx="37" cy="30" rx="8" ry="10" fill="#330055" transform="rotate(-10 37 30)" />
    {/* body */}
    <ellipse cx="24" cy="28" rx="9" ry="14" fill="#1A0033" />
    <ellipse cx="24" cy="26" rx="7" ry="12" fill="#330055" />
    {/* fuzzy chest */}
    <ellipse cx="24" cy="24" rx="6" ry="6" fill="#550077" opacity="0.6" />
    {/* antennae */}
    <path d="M 20 12 Q 15 5 12 2" stroke="#550077" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 28 12 Q 33 5 36 2" stroke="#550077" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="12" cy="2" r="2.5" fill="#CC44FF" />
    <circle cx="36" cy="2" r="2.5" fill="#CC44FF" />
    {/* glowing eyes */}
    <ellipse cx="19" cy="21" rx="4.5" ry="5" fill="#FF44FF" />
    <ellipse cx="29" cy="21" rx="4.5" ry="5" fill="#FF44FF" />
    <ellipse cx="19.5" cy="21.5" rx="3" ry="3.5" fill="#FF99FF" />
    <ellipse cx="29.5" cy="21.5" rx="3" ry="3.5" fill="#FF99FF" />
    <circle cx="19" cy="20.5" r="1.2" fill="white" />
    <circle cx="29" cy="20.5" r="1.2" fill="white" />
  </svg>
);

// VOIDREX — shadow dragon
export const VoidrexSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* aura */}
    <ellipse cx="24" cy="26" rx="22" ry="20" fill="#1A0033" opacity="0.5" />
    {/* dark wings */}
    <ellipse cx="5" cy="20" rx="9" ry="18" fill="#110022" transform="rotate(-10 5 20)" />
    <ellipse cx="43" cy="20" rx="9" ry="18" fill="#110022" transform="rotate(10 43 20)" />
    <ellipse cx="5" cy="18" rx="6" ry="13" fill="#220044" transform="rotate(-10 5 18)" />
    <ellipse cx="43" cy="18" rx="6" ry="13" fill="#220044" transform="rotate(10 43 18)" />
    {/* wing claws */}
    <ellipse cx="2" cy="30" rx="2" ry="4" fill="#330055" transform="rotate(-20 2 30)" />
    <ellipse cx="46" cy="30" rx="2" ry="4" fill="#330055" transform="rotate(20 46 30)" />
    {/* body */}
    <ellipse cx="24" cy="30" rx="13" ry="15" fill="#110022" />
    <ellipse cx="24" cy="28" rx="11" ry="13" fill="#220033" />
    {/* chest plate */}
    <ellipse cx="24" cy="30" rx="7" ry="8" fill="#330055" opacity="0.7" />
    {/* glowing chest gem */}
    <ellipse cx="24" cy="30" rx="3" ry="3.5" fill="#FF00FF" opacity="0.8" />
    <ellipse cx="24" cy="30" rx="2" ry="2.5" fill="#FFFFFF" opacity="0.4" />
    {/* horns */}
    <ellipse cx="16" cy="10" rx="2.5" ry="8" fill="#220044" transform="rotate(-15 16 10)" />
    <ellipse cx="32" cy="10" rx="2.5" ry="8" fill="#220044" transform="rotate(15 32 10)" />
    <ellipse cx="16" cy="8" rx="1.5" ry="5" fill="#9900FF" transform="rotate(-15 16 8)" />
    <ellipse cx="32" cy="8" rx="1.5" ry="5" fill="#9900FF" transform="rotate(15 32 8)" />
    {/* face */}
    <ellipse cx="17" cy="22" rx="5.5" ry="6" fill="#9900FF" />
    <ellipse cx="31" cy="22" rx="5.5" ry="6" fill="#9900FF" />
    <ellipse cx="17.5" cy="22.5" rx="4" ry="4.5" fill="#CC44FF" />
    <ellipse cx="31.5" cy="22.5" rx="4" ry="4.5" fill="#CC44FF" />
    <ellipse cx="18" cy="22.5" rx="2.5" ry="3" fill="#FF99FF" />
    <ellipse cx="32" cy="22.5" rx="2.5" ry="3" fill="#FF99FF" />
    <circle cx="17.5" cy="21.5" r="1.5" fill="white" />
    <circle cx="31.5" cy="21.5" r="1.5" fill="white" />
    {/* jaws */}
    <ellipse cx="24" cy="33" rx="5" ry="3" fill="#220033" />
    <ellipse cx="21" cy="33" rx="1.5" ry="2" fill="white" />
    <ellipse cx="24" cy="33" rx="1.5" ry="2" fill="white" />
    <ellipse cx="27" cy="33" rx="1.5" ry="2" fill="white" />
    {/* claws */}
    <ellipse cx="10" cy="43" rx="7" ry="3.5" fill="#110022" />
    <ellipse cx="38" cy="43" rx="7" ry="3.5" fill="#110022" />
  </svg>
);

/* ── STAR LINE (LEGENDARY) ──────────────────────── */
// STARDUST — tiny star sprite
export const StardustSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* glow */}
    <ellipse cx="24" cy="26" rx="16" ry="15" fill="#FFEE00" opacity="0.15" />
    {/* star body */}
    <polygon points="24,8 27,19 38,19 29,26 32,37 24,30 16,37 19,26 10,19 21,19" fill="#FFD700" />
    <polygon points="24,11 26.5,20 35,20 28,25.5 30.5,34 24,29 17.5,34 20,25.5 13,20 21.5,20" fill="#FFEE44" />
    {/* inner star */}
    <polygon points="24,15 25.5,21 31,21 27,24 28.5,30 24,27 19.5,30 21,24 17,21 22.5,21" fill="#FFFFAA" />
    {/* face */}
    <ellipse cx="21" cy="22" rx="2.5" ry="3" fill="white" />
    <ellipse cx="27" cy="22" rx="2.5" ry="3" fill="white" />
    <ellipse cx="21.5" cy="22.5" rx="1.5" ry="2" fill="#1A1000" />
    <ellipse cx="27.5" cy="22.5" rx="1.5" ry="2" fill="#1A1000" />
    <circle cx="21" cy="22" r="0.8" fill="white" />
    <circle cx="27" cy="22" r="0.8" fill="white" />
    {/* cute smile */}
    <path d="M 21 26 Q 24 29 27 26" stroke="#CC8800" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* blush */}
    <ellipse cx="17" cy="25" rx="2.5" ry="1.5" fill="#FFAAAA" opacity="0.7" />
    <ellipse cx="31" cy="25" rx="2.5" ry="1.5" fill="#FFAAAA" opacity="0.7" />
    {/* sparkles */}
    <text x="3" y="12" fontSize="8" fill="#FFEE00" opacity="0.9">✦</text>
    <text x="36" y="10" fontSize="6" fill="#FFD700" opacity="0.8">✦</text>
    <text x="2" y="36" fontSize="5" fill="#FFEE44" opacity="0.7">✦</text>
    <text x="39" y="38" fontSize="7" fill="#FFDD00" opacity="0.8">✦</text>
  </svg>
);

// COSMELING — cosmic bunny
export const CosmelingSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* star trail aura */}
    <ellipse cx="24" cy="28" rx="18" ry="16" fill="#221144" opacity="0.4" />
    {/* long cosmic ears */}
    <ellipse cx="16" cy="9" rx="4" ry="12" fill="#4433AA" />
    <ellipse cx="32" cy="9" rx="4" ry="12" fill="#4433AA" />
    <ellipse cx="16" cy="9" rx="2.5" ry="9" fill="#8866FF" />
    <ellipse cx="32" cy="9" rx="2.5" ry="9" fill="#8866FF" />
    {/* stars on ears */}
    <text x="12" y="7" fontSize="5" fill="#FFD700">★</text>
    <text x="29" y="7" fontSize="5" fill="#FFD700">★</text>
    {/* body */}
    <ellipse cx="24" cy="31" rx="14" ry="13" fill="#332288" />
    <ellipse cx="24" cy="29" rx="12" ry="11" fill="#5544BB" />
    {/* cosmic belly */}
    <ellipse cx="24" cy="32" rx="8" ry="7" fill="#221144" />
    {/* stars on belly */}
    <text x="19" y="31" fontSize="6" fill="#FFD700" opacity="0.9">★</text>
    <text x="25" y="35" fontSize="5" fill="#AAAAFF" opacity="0.8">✦</text>
    <text x="16" y="36" fontSize="4" fill="#FFAAFF" opacity="0.7">✦</text>
    {/* face */}
    <ellipse cx="18" cy="26" rx="4.5" ry="5" fill="white" />
    <ellipse cx="30" cy="26" rx="4.5" ry="5" fill="white" />
    <ellipse cx="19" cy="27" rx="3" ry="3.5" fill="#330099" />
    <ellipse cx="31" cy="27" rx="3" ry="3.5" fill="#330099" />
    {/* galaxy swirl in eyes */}
    <ellipse cx="19.5" cy="27" rx="2" ry="2.5" fill="#8866FF" />
    <ellipse cx="31.5" cy="27" rx="2" ry="2.5" fill="#8866FF" />
    <circle cx="19" cy="26.5" r="1" fill="white" />
    <circle cx="31" cy="26.5" r="1" fill="white" />
    {/* cute nose */}
    <ellipse cx="24" cy="32" rx="2" ry="1.5" fill="#FF66FF" />
    {/* blush */}
    <ellipse cx="13" cy="29" rx="3" ry="2" fill="#AAAAFF" opacity="0.5" />
    <ellipse cx="35" cy="29" rx="3" ry="2" fill="#AAAAFF" opacity="0.5" />
    {/* tail */}
    <ellipse cx="36" cy="38" rx="5" ry="5" fill="#5544BB" />
    <ellipse cx="36" cy="38" rx="3.5" ry="3.5" fill="#8866FF" />
    <text x="33" y="40" fontSize="6" fill="#FFD700">★</text>
    {/* feet */}
    <ellipse cx="17" cy="43" rx="6" ry="3.5" fill="#332288" />
    <ellipse cx="31" cy="43" rx="6" ry="3.5" fill="#332288" />
  </svg>
);

// GALAXION — galaxy phoenix (legendary final form)
export const GalaxionSprite = ({ w = 64, flipped = false }) => (
  <svg width={w} height={w} viewBox="0 0 48 48" style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* galaxy aura */}
    <ellipse cx="24" cy="24" rx="23" ry="22" fill="#110033" opacity="0.5" />
    {/* cosmic tail feathers */}
    <ellipse cx="12" cy="38" rx="5" ry="14" fill="#220066" transform="rotate(-30 12 38)" />
    <ellipse cx="24" cy="42" rx="5" ry="12" fill="#330077" />
    <ellipse cx="36" cy="38" rx="5" ry="14" fill="#220066" transform="rotate(30 36 38)" />
    <ellipse cx="12" cy="36" rx="3" ry="10" fill="#8833FF" opacity="0.6" transform="rotate(-30 12 36)" />
    <ellipse cx="36" cy="36" rx="3" ry="10" fill="#8833FF" opacity="0.6" transform="rotate(30 36 36)" />
    {/* tail star tips */}
    <text x="6" y="28" fontSize="8" fill="#FFD700" opacity="0.9">★</text>
    <text x="34" y="27" fontSize="8" fill="#FFD700" opacity="0.9">★</text>
    <text x="19" y="46" fontSize="7" fill="#AAAAFF" opacity="0.8">★</text>
    {/* wings */}
    <ellipse cx="5" cy="18" rx="9" ry="16" fill="#330066" transform="rotate(-15 5 18)" />
    <ellipse cx="43" cy="18" rx="9" ry="16" fill="#330066" transform="rotate(15 43 18)" />
    <ellipse cx="5" cy="16" rx="6" ry="11" fill="#5533AA" transform="rotate(-15 5 16)" />
    <ellipse cx="43" cy="16" rx="6" ry="11" fill="#5533AA" transform="rotate(15 43 16)" />
    {/* wing stars */}
    <text x="1" y="13" fontSize="7" fill="#FFD700" opacity="0.9">✦</text>
    <text x="36" y="11" fontSize="7" fill="#FFD700" opacity="0.9">✦</text>
    {/* body */}
    <ellipse cx="24" cy="26" rx="13" ry="15" fill="#220055" />
    <ellipse cx="24" cy="24" rx="11" ry="13" fill="#440088" />
    {/* galaxy chest */}
    <ellipse cx="24" cy="26" rx="7" ry="8" fill="#110033" />
    <text x="19" y="25" fontSize="7" fill="#FFD700" opacity="0.9">★</text>
    <text x="23" y="30" fontSize="5" fill="#AAAAFF" opacity="0.8">✦</text>
    <text x="17" y="30" fontSize="4" fill="#FF99FF" opacity="0.7">✦</text>
    {/* crest */}
    <ellipse cx="24" cy="9" rx="4" ry="7" fill="#330066" />
    <ellipse cx="24" cy="7" rx="2.5" ry="5" fill="#9933FF" />
    <text x="21" y="8" fontSize="6" fill="#FFD700">★</text>
    {/* face */}
    <ellipse cx="17" cy="19" rx="5.5" ry="6" fill="#9933FF" />
    <ellipse cx="31" cy="19" rx="5.5" ry="6" fill="#9933FF" />
    <ellipse cx="17.5" cy="19.5" rx="4" ry="4.5" fill="#CC66FF" />
    <ellipse cx="31.5" cy="19.5" rx="4" ry="4.5" fill="#CC66FF" />
    <ellipse cx="18" cy="19.5" rx="2.5" ry="3" fill="#FFFFFF" />
    <ellipse cx="32" cy="19.5" rx="2.5" ry="3" fill="#FFFFFF" />
    <ellipse cx="18.5" cy="20" rx="1.5" ry="2" fill="#330066" />
    <ellipse cx="32.5" cy="20" rx="1.5" ry="2" fill="#330066" />
    {/* beak */}
    <ellipse cx="24" cy="24" rx="3" ry="2" fill="#FFD700" />
    <ellipse cx="24" cy="25" rx="2" ry="1" fill="#CC8800" />
  </svg>
);

/* ══════════════════════════════════════════════════
   CATCH MONSTER LINES DATA
══════════════════════════════════════════════════ */
export const CATCH_MON_LINES = [
  {
    lineId: "flame",
    type: "FLAME",
    typeClr: "#FF6B35",
    typeBg: "#2A0E00",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#AAAAAA",
    eggColor: "#FF6B35",
    eggEmoji: "🔥",
    stages: [
      { id: "emberpuff",  name: "EMBERPUFF",  Sprite: EmberpuffSprite,  evoLv: 12, desc: "Tiny fire marshmallow.\nAlways warm to hug." },
      { id: "scorchcub",  name: "SCORCHCUB",  Sprite: ScorchcubSprite,  evoLv: 25, desc: "Flame-maned bear cub.\nFierce but cuddle-able." },
      { id: "blazeking",  name: "BLAZEKING",  Sprite: BlazeKingSprite,  evoLv: null, desc: "Legendary fire lion king.\nCommands all flame." },
    ],
  },
  {
    lineId: "wave",
    type: "WAVE",
    typeClr: "#44AAFF",
    typeBg: "#001A33",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#AAAAAA",
    eggColor: "#44AAFF",
    eggEmoji: "💧",
    stages: [
      { id: "bubblet",  name: "BUBBLET",  Sprite: BubbletSprite,  evoLv: 12, desc: "Floating water bubble.\nAlways cheerful." },
      { id: "coralia",  name: "CORALIA",  Sprite: CoraliaSprite,  evoLv: 25, desc: "Coral reef guardian.\nProtects ocean friends." },
      { id: "tidalon",  name: "TIDALON",  Sprite: TidalonSprite,  evoLv: null, desc: "Majestic sea dragon.\nCommands the tides." },
    ],
  },
  {
    lineId: "leaf",
    type: "LEAF",
    typeClr: "#44CC44",
    typeBg: "#001A00",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#AAAAAA",
    eggColor: "#44CC44",
    eggEmoji: "🌿",
    stages: [
      { id: "sproutling", name: "SPROUTLING", Sprite: SproutlingSprite, evoLv: 12, desc: "Tiny plant sprout.\nGrows a little every day." },
      { id: "bloomhog",   name: "BLOOMHOG",   Sprite: BloomhogSprite,   evoLv: 25, desc: "Flower hedgehog.\nPetals protect friends." },
      { id: "treant",     name: "TREANT",     Sprite: TreantSprite,     evoLv: null, desc: "Ancient forest giant.\nOldest living being." },
    ],
  },
  {
    lineId: "bolt",
    type: "BOLT",
    typeClr: "#FFCC00",
    typeBg: "#1A1400",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#44BBFF",
    eggColor: "#FFCC00",
    eggEmoji: "⚡",
    stages: [
      { id: "zaplet",     name: "ZAPLET",     Sprite: ZapletSprite,     evoLv: 14, desc: "Electric kitten.\nStatic shock guaranteed." },
      { id: "thundermew", name: "THUNDERMEW", Sprite: ThundermewSprite, evoLv: 28, desc: "Thunder cat warrior.\nRoars shake the sky." },
      { id: "voltiger",   name: "VOLTIGER",   Sprite: VoltigerSprite,   evoLv: null, desc: "Lightning tiger king.\nFlies at light speed." },
    ],
  },
  {
    lineId: "shadow",
    type: "SHADOW",
    typeClr: "#CC44FF",
    typeBg: "#0A001A",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF44FF",
    eggColor: "#9900FF",
    eggEmoji: "🌙",
    stages: [
      { id: "shadeling",  name: "SHADELING",  Sprite: ShadelingSprite,  evoLv: 16, desc: "Shadow wisp child.\nLoves the dark." },
      { id: "gloomwing",  name: "GLOOMWING",  Sprite: GloomwingSprite,  evoLv: 30, desc: "Dark moth phantom.\nSilent and mysterious." },
      { id: "voidrex",    name: "VOIDREX",    Sprite: VoidrexSprite,    evoLv: null, desc: "Dragon of the void.\nDevours light itself." },
    ],
  },
  {
    lineId: "star",
    type: "STAR",
    typeClr: "#FFD700",
    typeBg: "#1A1400",
    rarity: "legendary",
    rarityLabel: "★★★★ Legendary",
    rarityClr: "#FFD700",
    eggColor: "#FFD700",
    eggEmoji: "✨",
    stages: [
      { id: "stardust",  name: "STARDUST",  Sprite: StardustSprite,  evoLv: 20, desc: "Newborn star spirit.\nBorn from shooting stars." },
      { id: "cosmeling", name: "COSMELING", Sprite: CosmelingSprite, evoLv: 35, desc: "Cosmic bunny explorer.\nTravels all galaxies." },
      { id: "galaxion",  name: "GALAXION",  Sprite: GalaxionSprite,  evoLv: null, desc: "Galaxy phoenix lord.\nRarest of all monsters." },
    ],
  },
];

// Flat list of all 18 catchable monster IDs
export const ALL_CATCH_IDS = CATCH_MON_LINES.flatMap(l => l.stages.map(s => s.id));

// Egg drop table: rarity → which lineIds can drop
export const EGG_DROP = {
  common:    ["flame", "wave", "leaf"],
  rare:      ["bolt", "flame", "wave"],
  superrare: ["shadow", "bolt"],
  legendary: ["star"],
};

// Get random monster from a catch line (weighted to lower stages for new players)
export function rollMonsterFromLine(lineId, ownedIds) {
  const line = CATCH_MON_LINES.find(l => l.lineId === lineId);
  if (!line) return null;
  // Try to give unowned ones first
  const unowned = line.stages.filter(s => !ownedIds.includes(s.id));
  if (unowned.length === 0) return line.stages[Math.floor(Math.random() * line.stages.length)];
  // Weighted: stage 0 = 60%, stage 1 = 30%, stage 2 = 10%
  const weights = unowned.map(s => {
    const idx = line.stages.indexOf(s);
    return idx === 0 ? 6 : idx === 1 ? 3 : 1;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < unowned.length; i++) {
    r -= weights[i];
    if (r <= 0) return unowned[i];
  }
  return unowned[unowned.length - 1];
}

// Roll egg rarity based on correct answer rate (0-1)
export function rollEggRarity(accuracy) {
  const r = Math.random();
  if (accuracy === 1.0 && r < 0.05) return "legendary";
  if (accuracy >= 0.9 && r < 0.15) return "superrare";
  if (accuracy >= 0.7 && r < 0.40) return "rare";
  return "common";
}
