import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

/* ── Inline monster SVGs (subset — all 9 player monsters) ── */

const InkletSVG = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="28" y="2" width="3" height="12" fill="#F0E8CC" /><rect x="27" y="4" width="2" height="8" fill="#DDD4AA" />
    <rect x="30" y="4" width="2" height="8" fill="#DDD4AA" /><rect x="28" y="12" width="3" height="3" fill="#1A1A88" />
    <rect x="29" y="0" width="1" height="3" fill="#4455FF" />
    <rect x="8" y="20" width="32" height="22" fill="#3344DD" /><rect x="6" y="22" width="36" height="18" fill="#3344DD" />
    <rect x="10" y="16" width="28" height="6" fill="#3344DD" /><rect x="14" y="13" width="20" height="5" fill="#3344DD" />
    <rect x="10" y="17" width="10" height="7" fill="#6677FF" opacity="0.55" /><rect x="11" y="18" width="6" height="4" fill="#99AAFF" opacity="0.4" />
    <rect x="14" y="28" width="14" height="10" fill="#4A55EE" opacity="0.5" />
    <rect x="22" y="19" width="10" height="10" fill="#fff" /><rect x="32" y="21" width="8" height="8" fill="#fff" />
    <rect x="24" y="20" width="7" height="8" fill="#0A0A3A" /><rect x="33" y="22" width="5" height="6" fill="#0A0A3A" />
    <rect x="26" y="21" width="3" height="4" fill="#4466FF" /><rect x="34" y="23" width="2" height="3" fill="#4466FF" />
    <rect x="24" y="21" width="2" height="2" fill="#fff" opacity="0.9" /><rect x="33" y="23" width="1" height="1" fill="#fff" opacity="0.9" />
    <rect x="28" y="30" width="8" height="2" fill="#2233BB" /><rect x="30" y="32" width="4" height="2" fill="#2233BB" />
    <rect x="12" y="40" width="6" height="6" fill="#2233BB" /><rect x="22" y="42" width="5" height="5" fill="#2233BB" />
    <rect x="30" y="40" width="6" height="6" fill="#2233BB" />
    <rect x="4" y="28" width="5" height="4" fill="#3344DD" /><rect x="2" y="30" width="4" height="3" fill="#2233CC" />
  </svg>
);

const QuillonSVG = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="38" y="4" width="4" height="24" fill="#F0E8CC" /><rect x="37" y="6" width="3" height="18" fill="#DDD4AA" />
    <rect x="41" y="6" width="3" height="18" fill="#DDD4AA" /><rect x="38" y="2" width="4" height="4" fill="#4455FF" />
    <rect x="37" y="26" width="6" height="4" fill="#997700" />
    <rect x="2" y="22" width="8" height="20" fill="#1A1A77" /><rect x="0" y="24" width="8" height="16" fill="#2222AA" />
    <rect x="10" y="18" width="26" height="22" fill="#3344DD" /><rect x="8" y="20" width="30" height="18" fill="#3344DD" />
    <rect x="12" y="20" width="22" height="14" fill="#4455EE" /><rect x="14" y="22" width="18" height="10" fill="#5566FF" />
    <rect x="19" y="24" width="8" height="2" fill="#AABBFF" opacity="0.7" /><rect x="21" y="27" width="4" height="3" fill="#AABBFF" opacity="0.5" />
    <rect x="12" y="4" width="24" height="16" fill="#3344DD" /><rect x="10" y="6" width="28" height="12" fill="#3344DD" />
    <rect x="14" y="2" width="20" height="4" fill="#4455EE" />
    <rect x="10" y="9" width="28" height="6" fill="#0A1177" /><rect x="12" y="10" width="24" height="4" fill="#0D1499" />
    <rect x="20" y="10" width="8" height="4" fill="#5588FF" /><rect x="28" y="10" width="8" height="3" fill="#7799FF" />
    <rect x="22" y="10" width="4" height="3" fill="#AACCFF" /><rect x="30" y="10" width="4" height="2" fill="#AACCFF" />
    <rect x="20" y="0" width="8" height="4" fill="#4455EE" /><rect x="22" y="0" width="4" height="2" fill="#6677FF" />
    <rect x="12" y="38" width="9" height="8" fill="#2233CC" /><rect x="24" y="38" width="9" height="8" fill="#2233CC" />
    <rect x="36" y="20" width="6" height="8" fill="#3344DD" />
  </svg>
);

const ScriptarSVG = () => (
  <svg width="72" height="72" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="8" width="9" height="6" fill="#F0E8CC" /><rect x="0" y="8" width="9" height="2" fill="#DDD4AA" />
    <rect x="0" y="12" width="9" height="2" fill="#DDD4AA" /><rect x="1" y="10" width="7" height="2" fill="#5566FF" opacity="0.5" />
    <rect x="38" y="14" width="9" height="6" fill="#F0E8CC" /><rect x="38" y="14" width="9" height="2" fill="#DDD4AA" />
    <rect x="38" y="18" width="9" height="2" fill="#DDD4AA" /><rect x="39" y="16" width="7" height="2" fill="#5566FF" opacity="0.5" />
    <rect x="6" y="22" width="36" height="24" fill="#2233BB" /><rect x="4" y="24" width="40" height="20" fill="#2233BB" />
    <rect x="18" y="28" width="12" height="10" fill="#3344CC" /><rect x="20" y="30" width="8" height="6" fill="#5566EE" />
    <rect x="22" y="31" width="4" height="4" fill="#8899FF" /><rect x="23" y="32" width="2" height="2" fill="#CCddFF" />
    <rect x="10" y="12" width="28" height="12" fill="#3344DD" /><rect x="8" y="14" width="32" height="10" fill="#3344DD" />
    <rect x="10" y="2" width="28" height="14" fill="#2233CC" /><rect x="8" y="4" width="32" height="12" fill="#3344DD" />
    <rect x="14" y="0" width="20" height="4" fill="#2233BB" /><rect x="8" y="2" width="32" height="4" fill="#1A2299" />
    <rect x="22" y="0" width="4" height="2" fill="#AABBFF" />
    <rect x="20" y="6" width="10" height="8" fill="#fff" /><rect x="30" y="6" width="8" height="8" fill="#fff" />
    <rect x="22" y="7" width="7" height="6" fill="#0A0A3A" /><rect x="31" y="7" width="5" height="6" fill="#0A0A3A" />
    <rect x="24" y="8" width="3" height="3" fill="#5588FF" /><rect x="32" y="8" width="2" height="3" fill="#5588FF" />
    <rect x="22" y="7" width="2" height="2" fill="#fff" opacity="0.9" /><rect x="31" y="7" width="1" height="1" fill="#fff" opacity="0.9" />
    <rect x="40" y="8" width="4" height="36" fill="#885522" /><rect x="38" y="6" width="8" height="8" fill="#4455FF" />
    <rect x="40" y="4" width="4" height="4" fill="#8899FF" /><rect x="41" y="3" width="2" height="3" fill="#CCDDFF" />
    <rect x="2" y="26" width="6" height="5" fill="#2233BB" /><rect x="40" y="26" width="6" height="5" fill="#2233BB" />
  </svg>
);

const RunixSVG = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="2" y="12" width="5" height="5" fill="#998877" opacity="0.7" /><rect x="40" y="18" width="4" height="4" fill="#887766" opacity="0.6" />
    <rect x="8" y="20" width="32" height="22" fill="#AA9988" /><rect x="6" y="22" width="36" height="18" fill="#BBAA99" />
    <rect x="10" y="16" width="28" height="6" fill="#AA9988" /><rect x="14" y="13" width="20" height="5" fill="#BBAA99" />
    <rect x="16" y="26" width="14" height="2" fill="#FF9900" /><rect x="20" y="28" width="6" height="5" fill="#FF9900" />
    <rect x="16" y="33" width="14" height="2" fill="#FF9900" />
    <rect x="22" y="18" width="10" height="10" fill="#FF9900" /><rect x="32" y="20" width="8" height="8" fill="#FF9900" />
    <rect x="24" y="19" width="7" height="8" fill="#FFCC44" /><rect x="33" y="21" width="5" height="6" fill="#FFCC44" />
    <rect x="26" y="21" width="3" height="4" fill="#1A0A00" /><rect x="34" y="22" width="2" height="3" fill="#1A0A00" />
    <rect x="24" y="19" width="2" height="2" fill="#fff" opacity="0.8" /><rect x="33" y="21" width="1" height="1" fill="#fff" opacity="0.8" />
    <rect x="12" y="40" width="8" height="7" fill="#998877" /><rect x="26" y="40" width="8" height="7" fill="#998877" />
    <rect x="2" y="28" width="6" height="5" fill="#AA9988" /><rect x="40" y="28" width="6" height="5" fill="#AA9988" />
  </svg>
);

const GlyphonSVG = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="10" y="2" width="8" height="10" fill="#998877" /><rect x="30" y="2" width="8" height="10" fill="#998877" />
    <rect x="8" y="8" width="32" height="16" fill="#BBAA99" /><rect x="6" y="10" width="36" height="12" fill="#BBAA99" />
    <rect x="18" y="8" width="12" height="2" fill="#FF9900" opacity="0.8" />
    <rect x="22" y="12" width="10" height="9" fill="#FF9900" /><rect x="32" y="13" width="8" height="8" fill="#FF9900" />
    <rect x="24" y="13" width="7" height="7" fill="#FFCC44" /><rect x="33" y="14" width="5" height="6" fill="#FFCC44" />
    <rect x="26" y="15" width="3" height="3" fill="#1A0A00" /><rect x="34" y="15" width="2" height="3" fill="#1A0A00" />
    <rect x="8" y="22" width="32" height="22" fill="#BBAA99" /><rect x="6" y="24" width="36" height="18" fill="#BBAA99" />
    <rect x="16" y="26" width="16" height="12" fill="#AA9988" /><rect x="18" y="28" width="12" height="8" fill="#CC9966" />
    <rect x="20" y="30" width="8" height="4" fill="#FFAA00" /><rect x="21" y="31" width="6" height="2" fill="#FFCC44" />
    <rect x="0" y="22" width="8" height="16" fill="#BBAA99" /><rect x="40" y="22" width="8" height="16" fill="#BBAA99" />
    <rect x="10" y="42" width="11" height="5" fill="#998877" /><rect x="26" y="42" width="11" height="5" fill="#998877" />
  </svg>
);

const RunekaiSVG = () => (
  <svg width="72" height="72" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="10" width="14" height="22" fill="#CC9966" /><rect x="34" y="10" width="14" height="22" fill="#CC9966" />
    <rect x="2" y="14" width="10" height="2" fill="#FF9900" opacity="0.5" /><rect x="36" y="14" width="10" height="2" fill="#FF9900" opacity="0.5" />
    <rect x="10" y="18" width="28" height="24" fill="#BBAA88" /><rect x="8" y="20" width="32" height="20" fill="#CCBB99" />
    <rect x="14" y="24" width="18" height="14" fill="#DDBBA0" />
    <rect x="16" y="26" width="14" height="2" fill="#FF9900" /><rect x="18" y="29" width="10" height="2" fill="#FFAA00" />
    <rect x="16" y="32" width="14" height="2" fill="#FF9900" />
    <rect x="12" y="4" width="24" height="16" fill="#CCBB99" /><rect x="10" y="6" width="28" height="14" fill="#DDCCAA" />
    <rect x="32" y="12" width="12" height="6" fill="#CCBB99" />
    <rect x="22" y="7" width="10" height="9" fill="#FF9900" /><rect x="32" y="8" width="8" height="8" fill="#FF9900" />
    <rect x="24" y="8" width="7" height="7" fill="#FFCC44" /><rect x="33" y="9" width="5" height="6" fill="#FFCC44" />
    <rect x="26" y="10" width="3" height="3" fill="#1A0800" /><rect x="34" y="10" width="2" height="3" fill="#1A0800" />
    <rect x="20" y="0" width="8" height="6" fill="#BBAA88" /><rect x="22" y="0" width="4" height="3" fill="#FFAA00" />
    <rect x="12" y="40" width="9" height="6" fill="#AA9977" /><rect x="26" y="40" width="9" height="6" fill="#AA9977" />
  </svg>
);

const EchobitSVG = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="8" y="18" width="32" height="24" fill="#00BB88" /><rect x="6" y="20" width="36" height="20" fill="#00CC99" />
    <rect x="10" y="14" width="28" height="6" fill="#00BB88" /><rect x="14" y="11" width="20" height="5" fill="#00CC99" />
    <rect x="8" y="18" width="12" height="8" fill="#44DDAA" opacity="0.5" />
    <rect x="22" y="16" width="12" height="11" fill="#fff" /><rect x="33" y="18" width="8" height="9" fill="#fff" />
    <rect x="24" y="17" width="9" height="9" fill="#003322" /><rect x="34" y="19" width="5" height="7" fill="#003322" />
    <rect x="26" y="19" width="4" height="5" fill="#00FFAA" /><rect x="35" y="20" width="2" height="4" fill="#00FFAA" />
    <rect x="24" y="17" width="3" height="3" fill="#fff" opacity="0.8" /><rect x="34" y="19" width="2" height="2" fill="#fff" opacity="0.8" />
    <rect x="36" y="24" width="8" height="4" fill="#FFCC00" /><rect x="38" y="22" width="5" height="4" fill="#FFAA00" />
    <rect x="2" y="24" width="8" height="12" fill="#009977" />
    <rect x="14" y="40" width="7" height="6" fill="#009977" /><rect x="26" y="40" width="7" height="6" fill="#009977" />
  </svg>
);

const SonarixSVG = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="28" width="5" height="16" fill="#009977" /><rect x="4" y="24" width="5" height="18" fill="#00BB88" />
    <rect x="2" y="10" width="16" height="20" fill="#00AA77" /><rect x="30" y="10" width="16" height="20" fill="#00AA77" />
    <rect x="4" y="6" width="10" height="6" fill="#44DDAA" /><rect x="36" y="6" width="10" height="6" fill="#44DDAA" />
    <rect x="14" y="16" width="20" height="22" fill="#00BB88" /><rect x="12" y="18" width="24" height="18" fill="#00CC99" />
    <rect x="16" y="20" width="16" height="12" fill="#44DDAA" /><rect x="18" y="22" width="12" height="8" fill="#88FFCC" />
    <rect x="14" y="4" width="22" height="14" fill="#00CC99" /><rect x="12" y="6" width="26" height="12" fill="#00DDAA" />
    <rect x="26" y="0" width="5" height="8" fill="#00BB88" /><rect x="32" y="0" width="5" height="6" fill="#00CC99" />
    <rect x="22" y="7" width="10" height="9" fill="#fff" /><rect x="32" y="8" width="8" height="8" fill="#fff" />
    <rect x="24" y="8" width="7" height="7" fill="#003322" /><rect x="33" y="9" width="5" height="6" fill="#003322" />
    <rect x="26" y="10" width="3" height="3" fill="#00FFAA" /><rect x="34" y="10" width="2" height="3" fill="#00FFAA" />
    <rect x="36" y="12" width="9" height="5" fill="#FFCC00" />
    <rect x="14" y="36" width="8" height="8" fill="#009977" /><rect x="26" y="36" width="8" height="8" fill="#009977" />
  </svg>
);

const LexivoreSVG = () => (
  <svg width="76" height="76" viewBox="0 0 48 48" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="8" width="14" height="22" fill="#2233CC" /><rect x="34" y="8" width="14" height="22" fill="#00BB88" />
    <rect x="2" y="12" width="10" height="2" fill="#AABBFF" opacity="0.5" /><rect x="36" y="12" width="10" height="2" fill="#CCFFEE" opacity="0.5" />
    <rect x="10" y="16" width="28" height="28" fill="#330066" /><rect x="8" y="18" width="32" height="24" fill="#440088" />
    <rect x="14" y="22" width="20" height="14" fill="#5500AA" /><rect x="16" y="24" width="16" height="10" fill="#7722CC" />
    <rect x="16" y="24" width="5" height="10" fill="#2233CC" opacity="0.8" />
    <rect x="21" y="24" width="6" height="10" fill="#AA9988" opacity="0.8" /><rect x="22" y="27" width="4" height="3" fill="#FF9900" opacity="0.8" />
    <rect x="27" y="24" width="5" height="10" fill="#00BB88" opacity="0.8" />
    <rect x="10" y="2" width="28" height="16" fill="#330066" /><rect x="8" y="4" width="32" height="14" fill="#440088" />
    <rect x="10" y="0" width="5" height="6" fill="#2233CC" /><rect x="21" y="0" width="6" height="8" fill="#FFAA00" />
    <rect x="33" y="0" width="5" height="6" fill="#00BB88" />
    <rect x="14" y="6" width="8" height="8" fill="#2233CC" /><rect x="15" y="7" width="6" height="6" fill="#8899FF" />
    <rect x="16" y="8" width="3" height="4" fill="#fff" />
    <rect x="22" y="5" width="9" height="9" fill="#FFAA00" /><rect x="23" y="6" width="7" height="7" fill="#FFEE44" />
    <rect x="25" y="7" width="3" height="5" fill="#fff" />
    <rect x="32" y="6" width="8" height="8" fill="#00BB88" /><rect x="33" y="7" width="6" height="6" fill="#88FFCC" />
    <rect x="34" y="8" width="3" height="4" fill="#fff" />
    <rect x="14" y="14" width="22" height="4" fill="#220044" />
    <rect x="12" y="42" width="10" height="5" fill="#330066" /><rect x="26" y="42" width="10" height="5" fill="#330066" />
    <rect x="10" y="45" width="8" height="3" fill="#8800FF" opacity="0.5" /><rect x="28" y="45" width="8" height="3" fill="#8800FF" opacity="0.5" />
  </svg>
);

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 16 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.2C9.5 36.6 16.3 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37.1 39 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@700;800;900&display=swap');

  *{box-sizing:border-box;margin:0;padding:0;}

  .auth-bg {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 50% 0%, #1E0B3A 0%, #0C0A18 55%, #050310 100%);
    overflow: hidden;
    position: relative;
    padding: 16px;
    gap: 0;
  }

  /* ── stars bg ── */
  .auth-bg::before {
    content:'';position:absolute;inset:0;
    background-image:
      radial-gradient(1px 1px at 15% 20%, #ffffff55, transparent),
      radial-gradient(1px 1px at 35% 70%, #ffffff44, transparent),
      radial-gradient(1px 1px at 60% 15%, #ffffff66, transparent),
      radial-gradient(1px 1px at 80% 55%, #ffffff33, transparent),
      radial-gradient(1px 1px at 90% 30%, #ffffff55, transparent),
      radial-gradient(1px 1px at 5%  80%, #ffffff44, transparent),
      radial-gradient(2px 2px at 25% 45%, #8899ff44, transparent),
      radial-gradient(2px 2px at 72% 85%, #00ffaa33, transparent);
    pointer-events:none;
  }

  /* ── title ── */
  .auth-title {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(32px, 8vw, 56px);
    color: #F5C842;
    text-shadow: 0 0 30px #F5C84299, 4px 4px 0 #6A3A00, 0 0 80px #F5C84255;
    letter-spacing: 4px;
    animation: titlePulse 3s ease-in-out infinite;
    line-height: 1;
  }
  .auth-sub {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(12px, 3vw, 18px);
    color: #FF5533;
    text-shadow: 2px 2px 0 #880000, 0 0 20px #FF553366;
    letter-spacing: 8px;
    margin-bottom: 4px;
  }

  /* ── monster parade ── */
  .monster-row {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: clamp(4px, 2vw, 18px);
    width: 100%;
    max-width: 900px;
    padding: 0 8px;
    margin: 28px 0 12px;
    position: relative;
  }

  .monster-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: default;
    position: relative;
    animation: floatUp var(--delay, 2.8s) ease-in-out infinite;
    animation-delay: var(--offset, 0s);
    transition: transform .2s;
  }
  .monster-slot:hover { transform: translateY(-8px) scale(1.15); z-index: 10; }

  .monster-name {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(4px, 1.2vw, 8px);
    color: #8C83B0;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .monster-shadow {
    width: 60%;
    height: 6px;
    background: radial-gradient(ellipse, rgba(0,0,0,.6) 0%, transparent 70%);
    border-radius: 50%;
    animation: shadowPulse var(--delay, 2.8s) ease-in-out infinite;
    animation-delay: var(--offset, 0s);
  }

  /* ── ground line ── */
  .ground-line {
    width: 90%;
    max-width: 860px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #2F2A4988, #5566FF44, #2F2A4988, transparent);
    margin-bottom: 32px;
    box-shadow: 0 0 12px #5566FF33;
  }

  /* ── login card ── */
  .auth-card {
    background: rgba(22, 18, 42, 0.85);
    border: 1.5px solid #3A3060;
    border-radius: 20px;
    padding: 24px 32px;
    text-align: center;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 0 60px rgba(85,102,255,.15), 0 20px 40px rgba(0,0,0,.5);
    backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 2;
  }

  .google-btn {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    width: 100%; padding: clamp(13px, 3.5vmin, 17px) 20px;
    background: #fff; color: #3C3C3C; border: none; border-radius: 12px;
    font-family: 'Nunito', sans-serif; font-weight: 900;
    font-size: clamp(14px, 3.5vmin, 16px); cursor: pointer;
    box-shadow: 0 4px 0 #ccc, 0 0 20px rgba(255,255,255,.08);
    transition: all .12s; letter-spacing: .01em;
  }
  .google-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #ccc, 0 0 30px rgba(255,255,255,.12); }
  .google-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #ccc; }
  .google-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .auth-error {
    color: #FFB3B3; font-size: 12px; font-weight: 700;
    background: #2A1116; padding: 8px 12px; border-radius: 8px;
    border: 1px solid #5A1D24; line-height: 1.5; width: 100%;
  }

  /* ── type badges ── */
  .type-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .type-badge {
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(5px, 1.5vw, 7px);
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 1px;
    opacity: .85;
  }

  /* ── animations ── */
  @keyframes titlePulse {
    0%,100% { text-shadow: 0 0 20px #F5C84299, 4px 4px 0 #6A3A00, 0 0 60px #F5C84244; }
    50%      { text-shadow: 0 0 40px #F5C842CC, 4px 4px 0 #6A3A00, 0 0 100px #F5C84288; }
  }
  @keyframes floatUp {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes shadowPulse {
    0%,100% { transform: scaleX(1); opacity: .5; }
    50%     { transform: scaleX(.65); opacity: .25; }
  }
  @keyframes scanLine {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(200vh); }
  }
  .scan-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #5566FF22, #5566FF44, #5566FF22, transparent);
    animation: scanLine 6s linear infinite;
    pointer-events: none;
    z-index: 1;
  }
`;

const MONSTERS = [
  { SVG: InkletSVG,   name: "INKLET",   color: "#4466FF", bg: "rgba(68,102,255,.18)", delay: "3.2s", offset: "0s"    },
  { SVG: RunixSVG,    name: "RUNIX",    color: "#FF9900", bg: "rgba(255,153,0,.18)",  delay: "2.9s", offset: "0.3s"  },
  { SVG: EchobitSVG,  name: "ECHOBIT",  color: "#00CC88", bg: "rgba(0,204,136,.18)", delay: "3.5s", offset: "0.6s"  },
  { SVG: QuillonSVG,  name: "QUILLON",  color: "#5577FF", bg: "rgba(85,119,255,.18)",delay: "2.7s", offset: "0.15s" },
  { SVG: LexivoreSVG, name: "LEXIVORE", color: "#AA44FF", bg: "rgba(170,68,255,.22)",delay: "3.8s", offset: "0.9s"  },
  { SVG: GlyphonSVG,  name: "GLYPHON",  color: "#FFAA00", bg: "rgba(255,170,0,.18)", delay: "3.0s", offset: "0.45s" },
  { SVG: SonarixSVG,  name: "SONARIX",  color: "#00DDAA", bg: "rgba(0,221,170,.18)", delay: "3.3s", offset: "0.75s" },
  { SVG: RunekaiSVG,  name: "RUNEKAI",  color: "#DDAA44", bg: "rgba(221,170,68,.18)",delay: "2.6s", offset: "0.2s"  },
  { SVG: ScriptarSVG, name: "SCRIPTAR", color: "#7799FF", bg: "rgba(119,153,255,.18)",delay:"3.6s", offset: "1.0s"  },
];

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase 환경 변수가 아직 설정되지 않았습니다.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg">
      <style>{CSS}</style>
      <div className="scan-line" />

      {/* Title */}
      <div style={{ textAlign: "center", zIndex: 2 }}>
        <div className="auth-title">VOCAB</div>
        <div className="auth-sub">MON</div>
      </div>

      {/* Monster parade */}
      <div className="monster-row">
        {MONSTERS.map((m, i) => (
          <div
            key={m.name}
            className="monster-slot"
            style={{
              "--delay": m.delay,
              "--offset": m.offset,
              filter: `drop-shadow(0 0 12px ${m.color}88)`,
            }}
            title={m.name}
          >
            <m.SVG />
            <div className="monster-shadow" style={{ "--delay": m.delay, "--offset": m.offset }} />
            <div className="monster-name" style={{ color: m.color }}>{m.name}</div>
          </div>
        ))}
      </div>

      <div className="ground-line" />

      {/* Login card */}
      <div className="auth-card">
        <button
          id="google-signin-btn"
          className="google-btn"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <GoogleLogo />
          {loading ? "로그인 중..." : "Google로 시작하기"}
        </button>
        {error && <div className="auth-error">오류: {error}</div>}
      </div>
    </div>
  );
}
