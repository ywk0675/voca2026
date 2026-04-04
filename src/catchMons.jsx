import React from "react";

const spriteStyle = (flipped) => ({
  transform: flipped ? "scaleX(-1)" : "none",
  overflow: "visible",
});

function SpriteFrame({ w = 64, flipped = false, shadow = "#0000001A", children }) {
  return (
    <svg width={w} height={w} viewBox="0 0 48 48" style={spriteStyle(flipped)}>
      <ellipse cx="24" cy="42.5" rx="13" ry="3.5" fill={shadow} />
      {children}
    </svg>
  );
}

function Face({
  eyeY = 24,
  eyeDx = 5.5,
  eyeRx = 3.6,
  eyeRy = 4.2,
  iris = "#23161B",
  blush = "#FF9AB1",
  mouth = "smile",
  nose = "#7A4A4A",
}) {
  return (
    <>
      <ellipse cx={24 - eyeDx} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#FFFFFF" />
      <ellipse cx={24 + eyeDx} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#FFFFFF" />
      <ellipse cx={24 - eyeDx + 0.5} cy={eyeY + 0.8} rx={eyeRx - 1.2} ry={eyeRy - 1.1} fill={iris} />
      <ellipse cx={24 + eyeDx + 0.5} cy={eyeY + 0.8} rx={eyeRx - 1.2} ry={eyeRy - 1.1} fill={iris} />
      <circle cx={24 - eyeDx - 0.6} cy={eyeY - 1} r="1.15" fill="#FFFFFF" />
      <circle cx={24 + eyeDx - 0.6} cy={eyeY - 1} r="1.15" fill="#FFFFFF" />
      <ellipse cx="24" cy={eyeY + 4.8} rx="1.5" ry="1.05" fill={nose} opacity="0.9" />
      {mouth === "smile" && (
        <path
          d={`M ${24 - 3.3} ${eyeY + 7.2} Q 24 ${eyeY + 9.7} ${24 + 3.3} ${eyeY + 7.2}`}
          stroke={nose}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mouth === "serious" && (
        <path
          d={`M ${24 - 3} ${eyeY + 8} L ${24 + 3} ${eyeY + 8}`}
          stroke={nose}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mouth === "fang" && (
        <>
          <path
            d={`M ${24 - 3} ${eyeY + 7.4} Q 24 ${eyeY + 9.5} ${24 + 3} ${eyeY + 7.4}`}
            stroke={nose}
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <path d={`M ${24 - 1} ${eyeY + 8.1} L ${24 - 0.2} ${eyeY + 9.7} L ${24 + 0.7} ${eyeY + 8.1}`} fill="#FFFFFF" />
        </>
      )}
      <ellipse cx="14" cy={eyeY + 4.2} rx="2.6" ry="1.4" fill={blush} opacity="0.45" />
      <ellipse cx="34" cy={eyeY + 4.2} rx="2.6" ry="1.4" fill={blush} opacity="0.45" />
    </>
  );
}

function Sparkle({ x, y, size = 4, color = "#FFF1A8", opacity = 1 }) {
  const s = size / 2;
  return (
    <g opacity={opacity}>
      <path d={`M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z`} fill={color} />
      <circle cx={x} cy={y} r={s / 3} fill="#FFFFFF" />
    </g>
  );
}

export function EmberpuffSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      <path d="M24 8 C19 12 18 17 20 21 C15 21 10 24 10 31 C10 38 16 42 24 42 C32 42 38 38 38 31 C38 24 33 21 28 21 C31 17 29 12 24 8 Z" fill="#F36B31" />
      <path d="M24 11 C20 15 20 18 22 21 C17 22 13 25 13 31 C13 36 17 39 24 39 C31 39 35 36 35 31 C35 25 31 22 26 21 C28 18 28 15 24 11 Z" fill="#FF9358" />
      <path d="M24 9 C22 12 22 15 24 18 C26 15 26 12 24 9 Z" fill="#FFE37A" />
      <ellipse cx="24" cy="32.5" rx="8.5" ry="6.3" fill="#FFD4A6" />
      <ellipse cx="16" cy="40" rx="4.8" ry="2.2" fill="#D44C19" />
      <ellipse cx="32" cy="40" rx="4.8" ry="2.2" fill="#D44C19" />
      <Face eyeY={26} iris="#2A1610" blush="#FFB49F" />
    </SpriteFrame>
  );
}

export function ScorchcubSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      <path d="M13 16 C14 9 20 6 24 6 C29 6 35 10 35 16 C39 19 40 23 39 28 C38 36 32 41 24 41 C16 41 10 36 9 28 C8 23 9 19 13 16 Z" fill="#C85521" />
      <path d="M24 7 C20 8 16 11 15 16 C11 19 11 23 12 28 C13 34 17 38 24 38 C31 38 35 34 36 28 C37 23 37 19 33 16 C32 11 28 8 24 7 Z" fill="#EA7632" />
      <path d="M24 4 L28 11 L35 13 L31 18 L33 25 L24 22 L15 25 L17 18 L13 13 L20 11 Z" fill="#FFB239" opacity="0.95" />
      <ellipse cx="14" cy="16" rx="4.5" ry="5.5" fill="#9F3B12" />
      <ellipse cx="34" cy="16" rx="4.5" ry="5.5" fill="#9F3B12" />
      <ellipse cx="14" cy="16.5" rx="2.4" ry="3" fill="#FFB07C" />
      <ellipse cx="34" cy="16.5" rx="2.4" ry="3" fill="#FFB07C" />
      <ellipse cx="24" cy="31.5" rx="8.5" ry="6.8" fill="#FFD2A8" />
      <ellipse cx="15.5" cy="40" rx="5.5" ry="2.4" fill="#9F3B12" />
      <ellipse cx="32.5" cy="40" rx="5.5" ry="2.4" fill="#9F3B12" />
      <Face eyeY={24.5} iris="#2F190F" blush="#FFB59B" />
    </SpriteFrame>
  );
}

export function BlazeKingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      <path d="M9 21 C9 10 17 5 24 5 C31 5 39 10 39 21 C39 34 33 41 24 41 C15 41 9 34 9 21 Z" fill="#A73A17" />
      <path d="M24 2 L29 10 L38 12 L32 18 L34 27 L24 22 L14 27 L16 18 L10 12 L19 10 Z" fill="#FFBE45" />
      <path d="M24 4 L28 10 L35 12 L30 17 L31 24 L24 20 L17 24 L18 17 L13 12 L20 10 Z" fill="#FF8F2F" />
      <path d="M13 18 C13 10 18 7 24 7 C30 7 35 10 35 18 C35 31 30 38 24 38 C18 38 13 31 13 18 Z" fill="#D95A24" />
      <ellipse cx="24" cy="31.5" rx="8" ry="6.3" fill="#FFD6A8" />
      <path d="M35 30 Q41 26 42 20 Q43 17 40 14" stroke="#D94A17" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M39 11 C42 13 43 17 41 19 C39 18 38 15 39 11 Z" fill="#FFD36B" />
      <ellipse cx="14" cy="40" rx="6.5" ry="2.7" fill="#8B2F11" />
      <ellipse cx="34" cy="40" rx="6.5" ry="2.7" fill="#8B2F11" />
      <Face eyeY={22} eyeDx={6.2} eyeRx={4.2} eyeRy={4.8} iris="#A01610" blush="#FFB699" mouth="serious" nose="#6B2F20" />
    </SpriteFrame>
  );
}

export function BubbletSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      <ellipse cx="24" cy="27" rx="13.5" ry="13.5" fill="#57B8FF" opacity="0.92" />
      <ellipse cx="24" cy="25.5" rx="11" ry="11.5" fill="#8ED9FF" opacity="0.92" />
      <ellipse cx="18.5" cy="18.5" rx="4.2" ry="2.5" fill="#FFFFFF" opacity="0.55" />
      <path d="M12 24 Q5 27 8 34 Q13 33 15 28 Z" fill="#31A6F3" />
      <path d="M36 28 Q38 33 43 34 Q45 28 38 24 Z" fill="#31A6F3" />
      <path d="M20 38 Q24 45 28 38" stroke="#2A9BE8" strokeWidth="4.4" fill="none" strokeLinecap="round" />
      <Face eyeY={24} iris="#17498D" blush="#B8E8FF" nose="#4C8DBA" />
      <circle cx="9" cy="17" r="2.2" fill="#B7E7FF" opacity="0.7" />
      <circle cx="38" cy="13" r="1.6" fill="#B7E7FF" opacity="0.6" />
      <circle cx="6" cy="25" r="1" fill="#B7E7FF" opacity="0.55" />
    </SpriteFrame>
  );
}

export function CoraliaSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      <path d="M24 8 L27 15 L34 17 L29 22 L30 29 L24 26 L18 29 L19 22 L14 17 L21 15 Z" fill="#FF86B1" opacity="0.8" />
      <path d="M14 20 C14 12 19 9 24 9 C29 9 34 12 34 20 L34 29 C34 36 30 40 24 40 C18 40 14 36 14 29 Z" fill="#1389CF" />
      <path d="M16.5 19 C16.5 14 20 12 24 12 C28 12 31.5 14 31.5 19 L31.5 28 C31.5 34 28 37.5 24 37.5 C20 37.5 16.5 34 16.5 28 Z" fill="#33B7F0" />
      <ellipse cx="24" cy="29" rx="6.5" ry="7.5" fill="#94E8FF" opacity="0.75" />
      <path d="M14 25 Q8 23 7 18 Q12 17 16 21 Z" fill="#0B6FAE" />
      <path d="M34 21 Q38 17 41 18 Q40 23 34 25 Z" fill="#0B6FAE" />
      <path d="M21 37 Q16 44 13 42 Q14 37 20 34 Z" fill="#0B6FAE" />
      <path d="M28 34 Q34 37 35 42 Q32 44 27 37 Z" fill="#0B6FAE" />
      <Face eyeY={21.5} iris="#17548A" blush="#FFBCD2" nose="#4A86B3" />
    </SpriteFrame>
  );
}

export function TidalonSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      <path d="M24 7 C29 9 32 14 32 18 C36 21 38 26 37 31 C36 38 31 42 24 42 C17 42 12 38 11 31 C10 26 12 21 16 18 C16 13 19 9 24 7 Z" fill="#0A5E9E" />
      <path d="M24 10 C28 12 29 16 29 20 C33 22 34 26 34 31 C33 36 30 39 24 39 C18 39 15 36 14 31 C14 26 15 22 19 20 C19 16 20 12 24 10 Z" fill="#1783C5" />
      <path d="M24 6 Q20 10 20 16 L24 19 L28 16 Q28 10 24 6 Z" fill="#76D8FF" opacity="0.7" />
      <ellipse cx="24" cy="30" rx="7.5" ry="8.2" fill="#9FE5FF" opacity="0.75" />
      <path d="M14 22 Q7 24 5 31 Q11 33 16 28 Z" fill="#084B80" />
      <path d="M32 28 Q37 33 43 31 Q41 24 34 22 Z" fill="#084B80" />
      <path d="M19 38 Q13 45 10 42 Q11 37 18 34 Z" fill="#0B4F8A" />
      <path d="M30 34 Q37 37 38 42 Q35 45 29 38 Z" fill="#0B4F8A" />
      <path d="M18 13 Q15 9 14 5" stroke="#084B80" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M30 13 Q33 9 34 5" stroke="#084B80" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Face eyeY={21.5} eyeDx={6.2} eyeRx={4.1} eyeRy={4.6} iris="#0D3F73" blush="#B8E8FF" mouth="serious" nose="#4B7DA1" />
    </SpriteFrame>
  );
}

export function SproutlingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      <path d="M24 10 Q14 7 11 15 Q18 18 24 15 Q30 18 37 15 Q34 7 24 10 Z" fill="#6FD658" />
      <rect x="22.5" y="14.5" width="3" height="5.5" rx="1.5" fill="#499B35" />
      <path d="M13 22 C13 15 18 12 24 12 C30 12 35 15 35 22 L35 30 C35 37 30 40 24 40 C18 40 13 37 13 30 Z" fill="#63B93F" />
      <path d="M16 22 C16 18 19 15 24 15 C29 15 32 18 32 22 L32 29 C32 34 29 37 24 37 C19 37 16 34 16 29 Z" fill="#8AD75D" />
      <ellipse cx="24" cy="31" rx="7.2" ry="6.1" fill="#D7F5BE" />
      <path d="M12 25 Q7 22 7 17 Q13 18 16 22 Z" fill="#4EAB35" />
      <path d="M32 22 Q35 18 41 17 Q41 22 36 25 Z" fill="#4EAB35" />
      <ellipse cx="16" cy="39.5" rx="4.8" ry="2.1" fill="#469A31" />
      <ellipse cx="32" cy="39.5" rx="4.8" ry="2.1" fill="#469A31" />
      <Face eyeY={24.5} iris="#224C17" blush="#C9F4B8" nose="#679252" />
    </SpriteFrame>
  );
}

export function BloomhogSprite({ w = 64, flipped = false }) {
  const petals = Array.from({ length: 10 }, (_, i) => {
    const angle = (-90 + i * 36) * (Math.PI / 180);
    return {
      x: 24 + Math.cos(angle) * 11.5,
      y: 20 + Math.sin(angle) * 11.5,
      rotate: -90 + i * 36,
      color: i % 2 === 0 ? "#FF8CB2" : "#FFD769",
    };
  });

  return (
    <SpriteFrame w={w} flipped={flipped}>
      {petals.map((petal, index) => (
        <ellipse
          key={index}
          cx={petal.x}
          cy={petal.y}
          rx="3.4"
          ry="6.2"
          fill={petal.color}
          transform={`rotate(${petal.rotate} ${petal.x} ${petal.y})`}
        />
      ))}
      <path d="M13 24 C13 17 18 14 24 14 C30 14 35 17 35 24 L35 30 C35 37 30 40 24 40 C18 40 13 37 13 30 Z" fill="#43A34D" />
      <path d="M16 24 C16 19 19 17 24 17 C29 17 32 19 32 24 L32 29 C32 34 29 37 24 37 C19 37 16 34 16 29 Z" fill="#68C869" />
      <ellipse cx="24" cy="31" rx="7" ry="6.2" fill="#D7F2D0" />
      <ellipse cx="16" cy="39.8" rx="5.5" ry="2.3" fill="#2F8638" />
      <ellipse cx="32" cy="39.8" rx="5.5" ry="2.3" fill="#2F8638" />
      <Face eyeY={24.5} iris="#294B1E" blush="#FFB3CA" nose="#6E9157" />
    </SpriteFrame>
  );
}

export function TreantSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000024">
      <ellipse cx="24" cy="12" rx="15" ry="10" fill="#2F9B46" />
      <ellipse cx="14" cy="15" rx="9" ry="7" fill="#46B85B" />
      <ellipse cx="34" cy="15" rx="9" ry="7" fill="#46B85B" />
      <ellipse cx="24" cy="9.5" rx="10" ry="7" fill="#79DA72" />
      <circle cx="17" cy="9" r="1.8" fill="#FF835B" />
      <circle cx="31" cy="8" r="1.6" fill="#FFD063" />
      <circle cx="11" cy="16" r="1.4" fill="#FF835B" />
      <circle cx="37" cy="14" r="1.4" fill="#FF835B" />
      <path d="M15 24 C15 17 19 14 24 14 C29 14 33 17 33 24 L33 31 C33 38 29 41 24 41 C19 41 15 38 15 31 Z" fill="#7D5330" />
      <path d="M17.5 24 C17.5 19 20 17 24 17 C28 17 30.5 19 30.5 24 L30.5 30 C30.5 35 28 38 24 38 C20 38 17.5 35 17.5 30 Z" fill="#9D6A43" />
      <path d="M17 23 Q11 23 7 18" stroke="#6C4426" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M31 23 Q37 23 41 18" stroke="#6C4426" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="6" cy="17.5" rx="4.4" ry="3.3" fill="#4DBB59" />
      <ellipse cx="42" cy="17.5" rx="4.4" ry="3.3" fill="#4DBB59" />
      <path d="M19 38 Q14 44 11 41" stroke="#6B4629" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M29 38 Q34 44 37 41" stroke="#6B4629" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <Face eyeY={25.5} eyeDx={6} eyeRx={4} eyeRy={4.6} iris="#27561F" blush="#C8F0B7" mouth="serious" nose="#6D4B31" />
    </SpriteFrame>
  );
}

export function ZapletSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      <path d="M14 15 L18 7 L22 15" fill="#F7D53C" />
      <path d="M26 15 L30 7 L34 15" fill="#F7D53C" />
      <path d="M11 20 C11 13 17 10 24 10 C31 10 37 13 37 20 L37 30 C37 37 31 40 24 40 C17 40 11 37 11 30 Z" fill="#C9A313" />
      <path d="M14 20 C14 15 18 13 24 13 C30 13 34 15 34 20 L34 29 C34 34 30 37 24 37 C18 37 14 34 14 29 Z" fill="#F5C931" />
      <ellipse cx="24" cy="31" rx="8" ry="6.2" fill="#FFF0AA" />
      <path d="M17 22 Q19 27 17 31" stroke="#E1AD12" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M31 22 Q29 27 31 31" stroke="#E1AD12" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M35 29 Q42 25 40 18 Q45 20 42 12" stroke="#F4DE59" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Sparkle x={8} y={13} size={4} color="#FFF1A0" opacity={0.85} />
      <Sparkle x={39} y={10} size={3.4} color="#FFF1A0" opacity={0.75} />
      <ellipse cx="16" cy="39.7" rx="5.3" ry="2.3" fill="#AD850E" />
      <ellipse cx="32" cy="39.7" rx="5.3" ry="2.3" fill="#AD850E" />
      <Face eyeY={24.5} iris="#2E250D" blush="#F8E58A" nose="#A98218" />
    </SpriteFrame>
  );
}

export function ThundermewSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      <ellipse cx="24" cy="13" rx="15.5" ry="4.5" fill="#FFF299" opacity="0.35" />
      <path d="M12 17 L16 7 L22 15" fill="#EAC730" />
      <path d="M26 15 L32 7 L36 17" fill="#EAC730" />
      <path d="M11 20 C11 12 17 8 24 8 C31 8 37 12 37 20 L37 30 C37 38 31 41 24 41 C17 41 11 38 11 30 Z" fill="#B28711" />
      <path d="M14 20 C14 14 18 11.5 24 11.5 C30 11.5 34 14 34 20 L34 29 C34 35 30 38 24 38 C18 38 14 35 14 29 Z" fill="#E0B722" />
      <polygon points="24,19 21,26 25,25 22,33 28,24 24,24" fill="#FFF6CC" opacity="0.95" />
      <ellipse cx="24" cy="31.5" rx="8.5" ry="6.5" fill="#FFEEA2" />
      <path d="M14 30 L7 30" stroke="#9F7B16" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 33 L8 34" stroke="#9F7B16" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M34 30 L41 30" stroke="#9F7B16" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M34 33 L40 34" stroke="#9F7B16" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M35 31 Q42 28 42 20" stroke="#C79A17" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 18 L43 12 L45 18" fill="#FFF0A3" />
      <ellipse cx="15" cy="40.3" rx="6" ry="2.5" fill="#98710D" />
      <ellipse cx="33" cy="40.3" rx="6" ry="2.5" fill="#98710D" />
      <Face eyeY={23.5} eyeDx={6.2} eyeRx={4.1} eyeRy={4.6} iris="#8C6D00" blush="#F4E18C" mouth="serious" nose="#8E6B17" />
    </SpriteFrame>
  );
}

export function VoltigerSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000025">
      <path d="M11 23 C4 20 2 13 7 8 C10 12 13 17 16 21 Z" fill="#FFF197" opacity="0.9" />
      <path d="M37 21 C40 17 43 12 41 8 C46 13 44 20 37 23 Z" fill="#FFF197" opacity="0.9" />
      <path d="M10 20 C10 12 16 8 24 8 C32 8 38 12 38 20 L38 30 C38 38 32 42 24 42 C16 42 10 38 10 30 Z" fill="#7A6312" />
      <path d="M13 20 C13 14 18 11 24 11 C30 11 35 14 35 20 L35 29 C35 36 30 39 24 39 C18 39 13 36 13 29 Z" fill="#B6A11A" />
      <path d="M17 20 L14 12 L18 10 L20 18 Z" fill="#6A5610" />
      <path d="M31 20 L28 10 L32 12 L30 18 Z" fill="#6A5610" />
      <path d="M24 18 L22 11 L26 11 L24 18 Z" fill="#6A5610" />
      <ellipse cx="24" cy="31.5" rx="8.7" ry="6.6" fill="#E9D994" />
      <path d="M35 31 L42 26 L39 24 L45 17 L41 16" stroke="#FFF197" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="14" cy="40.4" rx="6.5" ry="2.6" fill="#665310" />
      <ellipse cx="34" cy="40.4" rx="6.5" ry="2.6" fill="#665310" />
      <Face eyeY={22.8} eyeDx={6.3} eyeRx={4.3} eyeRy={4.9} iris="#3B3009" blush="#F0DD8D" mouth="serious" nose="#886B20" />
    </SpriteFrame>
  );
}

export function ShadelingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      <ellipse cx="24" cy="27" rx="17" ry="15" fill="#40216F" opacity="0.35" />
      <path d="M24 10 C16 12 11 18 11 26 C11 31 13 35 16 37 C18 39 17 42 14 44 C19 44 21 42 24 39 C27 42 29 44 34 44 C31 42 30 39 32 37 C35 35 37 31 37 26 C37 18 32 12 24 10 Z" fill="#24103D" />
      <path d="M24 13 C18 15 14 20 14 26 C14 31 17 35 24 38 C31 35 34 31 34 26 C34 20 30 15 24 13 Z" fill="#3A195F" />
      <ellipse cx="15" cy="24" rx="4.5" ry="6" fill="#281246" transform="rotate(-18 15 24)" />
      <ellipse cx="33" cy="24" rx="4.5" ry="6" fill="#281246" transform="rotate(18 33 24)" />
      <Face eyeY={22.5} iris="#D992FF" blush="#B166FF" mouth="fang" nose="#8A5EB2" />
      <Sparkle x={10} y={15} size={3.6} color="#C984FF" opacity={0.75} />
      <Sparkle x={38} y={11} size={3} color="#E0AAFF" opacity={0.65} />
      <Sparkle x={6} y={32} size={2.6} color="#9A55FF" opacity={0.55} />
    </SpriteFrame>
  );
}

export function GloomwingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      <ellipse cx="10" cy="18" rx="9" ry="13" fill="#2B1447" transform="rotate(-18 10 18)" />
      <ellipse cx="38" cy="18" rx="9" ry="13" fill="#2B1447" transform="rotate(18 38 18)" />
      <ellipse cx="10" cy="18" rx="6" ry="10" fill="#4A2377" transform="rotate(-18 10 18)" />
      <ellipse cx="38" cy="18" rx="6" ry="10" fill="#4A2377" transform="rotate(18 38 18)" />
      <ellipse cx="11" cy="29" rx="7" ry="8" fill="#33195A" transform="rotate(10 11 29)" />
      <ellipse cx="37" cy="29" rx="7" ry="8" fill="#33195A" transform="rotate(-10 37 29)" />
      <circle cx="10" cy="14" r="2.3" fill="#F2A6FF" opacity="0.65" />
      <circle cx="38" cy="14" r="2.3" fill="#F2A6FF" opacity="0.65" />
      <path d="M17 25 C17 16 20 12 24 12 C28 12 31 16 31 25 L31 32 C31 37 28 40 24 40 C20 40 17 37 17 32 Z" fill="#1D0C31" />
      <path d="M19 25 C19 18 21 15 24 15 C27 15 29 18 29 25 L29 31 C29 35 27 38 24 38 C21 38 19 35 19 31 Z" fill="#442162" />
      <path d="M20 12 Q16 6 12 3" stroke="#6F2FA9" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M28 12 Q32 6 36 3" stroke="#6F2FA9" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="3" r="2.3" fill="#D87DFF" />
      <circle cx="36" cy="3" r="2.3" fill="#D87DFF" />
      <Face eyeY={21.5} iris="#F6D3FF" blush="#CA8DFF" nose="#9365B0" mouth="fang" />
    </SpriteFrame>
  );
}

export function VoidrexSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002E">
      <ellipse cx="24" cy="24" rx="20.5" ry="18" fill="#180829" opacity="0.42" />
      <path d="M11 23 C6 21 3 13 7 8 C10 12 13 17 16 21 Z" fill="#1E0B34" />
      <path d="M32 21 C35 17 38 12 41 8 C45 13 42 21 37 23 Z" fill="#1E0B34" />
      <path d="M12 20 C12 11 18 7 24 7 C30 7 36 11 36 20 L36 30 C36 39 30 42 24 42 C18 42 12 39 12 30 Z" fill="#130721" />
      <path d="M15 20 C15 14 19 10 24 10 C29 10 33 14 33 20 L33 29 C33 36 29 39 24 39 C19 39 15 36 15 29 Z" fill="#291040" />
      <path d="M17 11 Q15 5 13 3" stroke="#2A1043" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M31 11 Q33 5 35 3" stroke="#2A1043" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M17 9 Q15 5 14 2" stroke="#B25CFF" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M31 9 Q33 5 34 2" stroke="#B25CFF" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="30.5" rx="7" ry="7.8" fill="#3B1959" opacity="0.85" />
      <ellipse cx="24" cy="30.5" rx="3" ry="3.6" fill="#FF66F5" opacity="0.95" />
      <Face eyeY={21.5} eyeDx={6.5} eyeRx={4.8} eyeRy={5.3} iris="#FFD8FF" blush="#B470FF" mouth="fang" nose="#9367B5" />
      <ellipse cx="14" cy="40.5" rx="6.5" ry="2.5" fill="#12061E" />
      <ellipse cx="34" cy="40.5" rx="6.5" ry="2.5" fill="#12061E" />
    </SpriteFrame>
  );
}

export function StardustSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      <ellipse cx="24" cy="25" rx="15" ry="13" fill="#FFE56B" opacity="0.2" />
      <path d="M24 9 L27.4 18.5 L37.5 18.5 L29.4 24.3 L32.6 34 L24 28.2 L15.4 34 L18.6 24.3 L10.5 18.5 L20.6 18.5 Z" fill="#FFD64A" />
      <path d="M24 12.2 L26.5 19.4 L34 19.4 L27.9 23.7 L30.3 31 L24 26.7 L17.7 31 L20.1 23.7 L14 19.4 L21.5 19.4 Z" fill="#FFF0A3" />
      <Face eyeY={22.2} eyeDx={3.2} eyeRx={2.2} eyeRy={2.8} iris="#3F3210" blush="#FFB8B8" nose="#B7861D" />
      <Sparkle x={7} y={12} size={3.6} color="#FFF4B8" opacity={0.9} />
      <Sparkle x={39} y={10} size={3} color="#FFE070" opacity={0.85} />
      <Sparkle x={8} y={35} size={2.6} color="#FFF4B8" opacity={0.75} />
      <Sparkle x={39} y={37} size={3.4} color="#FFE070" opacity={0.8} />
    </SpriteFrame>
  );
}

export function CosmelingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      <ellipse cx="24" cy="27" rx="17" ry="15" fill="#261347" opacity="0.4" />
      <ellipse cx="16" cy="10" rx="4.5" ry="11.5" fill="#4631A5" />
      <ellipse cx="32" cy="10" rx="4.5" ry="11.5" fill="#4631A5" />
      <ellipse cx="16" cy="10" rx="2.4" ry="8.8" fill="#A89AFF" />
      <ellipse cx="32" cy="10" rx="2.4" ry="8.8" fill="#A89AFF" />
      <path d="M12 21 C12 13 17 9 24 9 C31 9 36 13 36 21 L36 30 C36 38 31 41 24 41 C17 41 12 38 12 30 Z" fill="#3D2A89" />
      <path d="M15 21 C15 15 19 12 24 12 C29 12 33 15 33 21 L33 29 C33 35 29 38 24 38 C19 38 15 35 15 29 Z" fill="#6451C8" />
      <ellipse cx="24" cy="31.2" rx="8" ry="6.5" fill="#2A1848" />
      <Sparkle x={16} y={6} size={2.6} color="#FFD86B" opacity={0.95} />
      <Sparkle x={32} y={6} size={2.6} color="#FFD86B" opacity={0.95} />
      <Sparkle x={20} y={30} size={2.8} color="#FFD86B" opacity={0.9} />
      <Sparkle x={27} y={34} size={2.3} color="#A8C1FF" opacity={0.85} />
      <Sparkle x={17} y={35} size={1.9} color="#FFB7F4" opacity={0.75} />
      <ellipse cx="36.2" cy="37.5" rx="4.5" ry="4.5" fill="#6C5ADB" />
      <ellipse cx="36.2" cy="37.5" rx="2.6" ry="2.6" fill="#A89AFF" />
      <Face eyeY={24.5} iris="#3C2EAA" blush="#BFC7FF" nose="#B66DCA" />
      <ellipse cx="16.5" cy="40.6" rx="5.6" ry="2.3" fill="#34246F" />
      <ellipse cx="31.5" cy="40.6" rx="5.6" ry="2.3" fill="#34246F" />
    </SpriteFrame>
  );
}

export function GalaxionSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000030">
      <ellipse cx="24" cy="24" rx="21.5" ry="20" fill="#14072B" opacity="0.45" />
      <path d="M10 21 C5 18 3 11 7 7 C10 10 13 15 16 19 Z" fill="#2D1160" />
      <path d="M32 19 C35 15 38 10 41 7 C45 11 43 18 38 21 Z" fill="#2D1160" />
      <path d="M14 38 Q9 45 7 41 Q8 35 14 31 Z" fill="#2C0F5E" />
      <path d="M24 39 Q24 46 20 44 Q20 38 24 32 Z" fill="#3B177A" />
      <path d="M34 31 Q40 35 41 41 Q39 45 34 38 Z" fill="#2C0F5E" />
      <path d="M12 20 C12 11 18 7 24 7 C30 7 36 11 36 20 L36 28 C36 37 30 41 24 41 C18 41 12 37 12 28 Z" fill="#24084C" />
      <path d="M15 20 C15 14 19 10.5 24 10.5 C29 10.5 33 14 33 20 L33 27 C33 35 29 38 24 38 C19 38 15 35 15 27 Z" fill="#5B2FB8" />
      <ellipse cx="24" cy="27.5" rx="7.5" ry="8.5" fill="#1B0B39" />
      <Sparkle x={20} y={25} size={2.8} color="#FFD96B" opacity={0.95} />
      <Sparkle x={24} y={29.5} size={2.3} color="#A8C1FF" opacity={0.85} />
      <Sparkle x={18} y={30} size={1.9} color="#FFB7F4" opacity={0.75} />
      <path d="M24 6 L27 12 L24 15 L21 12 Z" fill="#A35DFF" />
      <Sparkle x={24} y={8.5} size={2.7} color="#FFD96B" opacity={1} />
      <Sparkle x={7} y={13} size={3} color="#FFD96B" opacity={0.9} />
      <Sparkle x={39} y={11} size={3} color="#FFD96B" opacity={0.9} />
      <Sparkle x={9} y={29} size={3.1} color="#FFD96B" opacity={0.9} />
      <Sparkle x={37} y={28} size={3.1} color="#FFD96B" opacity={0.9} />
      <Face eyeY={19.5} eyeDx={6.5} eyeRx={4.8} eyeRy={5.1} iris="#3E1274" blush="#C8A7FF" mouth="serious" nose="#D48F3A" />
      <path d="M21.2 24.5 Q24 27 26.8 24.5" stroke="#D48F3A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// ─── ICE LINE ────────────────────────────────────────────────────────────────

export function FrostpupSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* ice-tip tail */}
      <path d="M34 34 Q42 30 44 24 Q43 21 41 22 Q40 26 36 30 Z" fill="#9DD8F5" />
      <path d="M42 22 L44 19 L45 22 Z" fill="#D4F2FF" />
      {/* body */}
      <path d="M13 26 C13 17 18 13 24 13 C30 13 35 17 35 26 L35 33 C35 39 30 42 24 42 C18 42 13 39 13 33 Z" fill="#D4F2FF" />
      <path d="M16 27 C16 21 19 18 24 18 C29 18 32 21 32 27 L32 33 C32 37 29 40 24 40 C19 40 16 37 16 33 Z" fill="#B4E6FA" />
      {/* belly */}
      <ellipse cx="24" cy="32" rx="6.5" ry="5.5" fill="#EEFAFF" />
      {/* crystal spike ears */}
      <path d="M15 16 L12 7 L17 5 L18 14 Z" fill="#9DD8F5" />
      <path d="M13 8 L15 5 L17 7 Z" fill="#D4F2FF" />
      <path d="M33 16 L36 7 L31 5 L30 14 Z" fill="#9DD8F5" />
      <path d="M35 8 L33 5 L31 7 Z" fill="#D4F2FF" />
      {/* inner ear */}
      <path d="M15.5 15 L13.5 8.5 L16.5 7.5 L17 13 Z" fill="#B4E6FA" />
      <path d="M32.5 15 L34.5 8.5 L31.5 7.5 L31 13 Z" fill="#B4E6FA" />
      {/* paws */}
      <ellipse cx="17" cy="40.5" rx="4.5" ry="2" fill="#9DD8F5" />
      <ellipse cx="31" cy="40.5" rx="4.5" ry="2" fill="#9DD8F5" />
      {/* ice sparkle */}
      <Sparkle x={8} y={20} size={2.8} color="#D4F2FF" opacity={0.8} />
      <Sparkle x={40} y={16} size={2.2} color="#9DD8F5" opacity={0.7} />
      <Face eyeY={24} eyeDx={5} eyeRx={3.2} eyeRy={3.8} iris="#2A5A7A" blush="#9DD8F5" nose="#6AAAC8" />
    </SpriteFrame>
  );
}

export function GlacuffSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* bushy tail */}
      <path d="M34 32 Q44 26 46 18 Q44 14 41 16 Q40 22 36 27 Q35 29 33 31 Z" fill="#7BBEE0" />
      <ellipse cx="41" cy="16" rx="3" ry="2.5" fill="#C2E8F8" />
      {/* fur ruff around neck */}
      <ellipse cx="24" cy="23" rx="12" ry="6" fill="#C2E8F8" />
      {/* body */}
      <path d="M12 24 C12 15 17 10 24 10 C31 10 36 15 36 24 L36 33 C36 40 31 43 24 43 C17 43 12 40 12 33 Z" fill="#7BBEE0" />
      <path d="M15 25 C15 18 18 14 24 14 C30 14 33 18 33 25 L33 33 C33 38 30 41 24 41 C18 41 15 38 15 33 Z" fill="#C2E8F8" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="7" ry="6" fill="#EAF6FF" />
      {/* shoulder ice plates */}
      <path d="M11 22 L6 16 L9 13 L14 18 Z" fill="#7BBEE0" />
      <path d="M8 14 L10 10 L12 13 Z" fill="#C2E8F8" />
      <path d="M37 22 L42 16 L39 13 L34 18 Z" fill="#7BBEE0" />
      <path d="M40 14 L38 10 L36 13 Z" fill="#C2E8F8" />
      {/* ears */}
      <path d="M14 14 L11 5 L17 6 L18 13 Z" fill="#7BBEE0" />
      <path d="M34 14 L37 5 L31 6 L30 13 Z" fill="#7BBEE0" />
      {/* inner ear */}
      <path d="M14.5 13 L12.5 7 L16 7.5 L16.5 12 Z" fill="#C2E8F8" />
      <path d="M33.5 13 L35.5 7 L32 7.5 L31.5 12 Z" fill="#C2E8F8" />
      {/* paws */}
      <ellipse cx="16" cy="41" rx="5" ry="2.2" fill="#5A9EC0" />
      <ellipse cx="32" cy="41" rx="5" ry="2.2" fill="#5A9EC0" />
      <Face eyeY={22} eyeDx={5.5} eyeRx={3.6} eyeRy={4} iris="#1A4A6A" blush="#9DD8F5" mouth="serious" nose="#5A96B4" />
      <Sparkle x={7} y={10} size={2.6} color="#D4F2FF" opacity={0.75} />
    </SpriteFrame>
  );
}

export function BlizzaronSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* ice fin on back */}
      <path d="M27 10 L30 4 L33 6 L31 11 Z" fill="#C2EAFF" />
      <path d="M22 9 L24 2 L27 4 L26 10 Z" fill="#8DC8E4" />
      <path d="M17 11 L18 5 L21 6 L20 11 Z" fill="#C2EAFF" />
      {/* wings implied — large side ice fins */}
      <path d="M10 20 L4 14 L7 11 L14 18 L13 25 Z" fill="#5E9EBF" />
      <path d="M38 20 L44 14 L41 11 L34 18 L35 25 Z" fill="#5E9EBF" />
      <path d="M11 21 L6 16 L8 13 L13 19 Z" fill="#8DC8E4" opacity="0.7" />
      <path d="M37 21 L42 16 L40 13 L35 19 Z" fill="#8DC8E4" opacity="0.7" />
      {/* body */}
      <path d="M11 24 C11 14 17 9 24 9 C31 9 37 14 37 24 L37 33 C37 40 31 43 24 43 C17 43 11 40 11 33 Z" fill="#5E9EBF" />
      <path d="M14 24 C14 17 18 13 24 13 C30 13 34 17 34 24 L34 32 C34 38 30 41 24 41 C18 41 14 38 14 32 Z" fill="#8DC8E4" />
      {/* belly */}
      <ellipse cx="24" cy="32" rx="8" ry="7" fill="#C2EAFF" />
      {/* ice crown — jagged spikes */}
      <path d="M16 12 L14 5 L18 8 L20 3 L22 8 L24 4 L26 8 L28 3 L30 8 L34 5 L32 12 Z" fill="#5E9EBF" />
      <path d="M18 11 L17 6 L20 8.5 L22 5 L24 8 L26 5 L28 8.5 L31 6 L30 11 Z" fill="#C2EAFF" />
      {/* legs */}
      <ellipse cx="17" cy="41" rx="5" ry="2.2" fill="#3A7E9E" />
      <ellipse cx="31" cy="41" rx="5" ry="2.2" fill="#3A7E9E" />
      <Face eyeY={23} eyeDx={6} eyeRx={4} eyeRy={4.5} iris="#1A3A5A" blush="#8DC8E4" mouth="serious" nose="#4A88A8" />
      <Sparkle x={7} y={9} size={3} color="#C2EAFF" opacity={0.85} />
      <Sparkle x={41} y={7} size={2.6} color="#D4F2FF" opacity={0.75} />
    </SpriteFrame>
  );
}

// ─── ROCK LINE ───────────────────────────────────────────────────────────────

export function PebblumpSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* rocky nubs on head */}
      <path d="M18 14 L16 9 L20 10 Z" fill="#8C7A6B" />
      <path d="M24 12 L23 7 L27 9 Z" fill="#8C7A6B" />
      <path d="M30 14 L32 9 L28 10 Z" fill="#8C7A6B" />
      {/* body — round animated rock */}
      <path d="M10 26 C10 15 16 10 24 10 C32 10 38 15 38 26 C38 35 33 42 24 42 C15 42 10 35 10 26 Z" fill="#A8967F" />
      <path d="M13 26 C13 17 18 13 24 13 C30 13 35 17 35 26 C35 33 30 39 24 39 C18 39 13 33 13 26 Z" fill="#C4AF9A" />
      {/* belly */}
      <ellipse cx="24" cy="30" rx="8" ry="6.5" fill="#D8C8B4" />
      {/* stubby arms */}
      <path d="M12 28 Q6 26 6 31 Q9 34 14 32 Z" fill="#A8967F" />
      <path d="M36 28 Q42 26 42 31 Q39 34 34 32 Z" fill="#A8967F" />
      {/* rock texture crack lines */}
      <path d="M17 20 Q19 24 17 27" stroke="#8C7A6B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M30 22 Q28 26 30 28" stroke="#8C7A6B" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* feet */}
      <ellipse cx="18" cy="41" rx="4.5" ry="2" fill="#8C7A6B" />
      <ellipse cx="30" cy="41" rx="4.5" ry="2" fill="#8C7A6B" />
      <Face eyeY={23} eyeDx={4.8} eyeRx={3} eyeRy={3.5} iris="#3A2A1A" blush="#C4AF9A" nose="#7A6A5A" />
    </SpriteFrame>
  );
}

export function BoulDugSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* rocky shell on back */}
      <path d="M11 18 L12 10 L24 8 L36 10 L37 18 L36 25 L24 27 L12 25 Z" fill="#6B5A49" />
      {/* embedded crystal gems */}
      <ellipse cx="19" cy="16" rx="2.2" ry="2.8" fill="#00C8E0" opacity="0.9" />
      <ellipse cx="24" cy="13" rx="2.2" ry="2.8" fill="#00B8CC" opacity="0.9" />
      <ellipse cx="29" cy="16" rx="2.2" ry="2.8" fill="#00C8E0" opacity="0.9" />
      <ellipse cx="19" cy="16" rx="1" ry="1.4" fill="#AAFAFF" opacity="0.7" />
      <ellipse cx="24" cy="13" rx="1" ry="1.4" fill="#AAFAFF" opacity="0.7" />
      <ellipse cx="29" cy="16" rx="1" ry="1.4" fill="#AAFAFF" opacity="0.7" />
      {/* body — bulldog wide low stance */}
      <path d="M10 28 C10 20 15 16 24 16 C33 16 38 20 38 28 L38 36 C38 41 33 44 24 44 C15 44 10 41 10 36 Z" fill="#A08878" />
      <path d="M13 28 C13 22 17 18 24 18 C31 18 35 22 35 28 L35 36 C35 40 31 43 24 43 C17 43 13 40 13 36 Z" fill="#C4B0A0" />
      {/* belly */}
      <ellipse cx="24" cy="35" rx="8.5" ry="6.5" fill="#D8C8B8" />
      {/* wide stubby legs */}
      <path d="M12 36 L8 36 L7 40 L14 41 Z" fill="#A08878" />
      <path d="M36 36 L40 36 L41 40 L34 41 Z" fill="#A08878" />
      <ellipse cx="11" cy="41" rx="4" ry="1.8" fill="#6B5A49" />
      <ellipse cx="37" cy="41" rx="4" ry="1.8" fill="#6B5A49" />
      <Face eyeY={26} eyeDx={6} eyeRx={3.8} eyeRy={4.2} iris="#2A1A0A" blush="#C4B0A0" mouth="serious" nose="#7A6050" />
    </SpriteFrame>
  );
}

export function GranothSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000030">
      {/* moss on arms */}
      <path d="M7 28 Q3 24 4 19 Q8 21 10 26 Z" fill="#4A7A44" />
      <path d="M41 28 Q45 24 44 19 Q40 21 38 26 Z" fill="#4A7A44" />
      <ellipse cx="5" cy="22" rx="3" ry="2" fill="#5A8A54" />
      <ellipse cx="43" cy="22" rx="3" ry="2" fill="#5A8A54" />
      {/* massive square-ish body */}
      <path d="M10 24 C10 14 16 8 24 8 C32 8 38 14 38 24 L38 34 C38 41 32 44 24 44 C16 44 10 41 10 34 Z" fill="#54463A" />
      <path d="M13 24 C13 16 18 11 24 11 C30 11 35 16 35 24 L35 33 C35 39 30 42 24 42 C18 42 13 39 13 33 Z" fill="#7A6A5C" />
      {/* jagged crown of rock spikes */}
      <path d="M12 12 L10 4 L14 7 L16 2 L19 6 L22 1 L24 6 L26 1 L29 6 L32 2 L34 7 L38 4 L36 12 Z" fill="#54463A" />
      <path d="M14 11 L12.5 6 L15.5 8 L17.5 4 L20 7.5 L22.5 3 L24 7.5 L25.5 3 L28 7.5 L30.5 4 L32.5 8 L35.5 6 L34 11 Z" fill="#7A6A5C" />
      {/* LARGE glowing cyan gem eyes — custom, no Face component */}
      <ellipse cx="18" cy="24" rx="4.5" ry="5" fill="#003A44" />
      <ellipse cx="30" cy="24" rx="4.5" ry="5" fill="#003A44" />
      <ellipse cx="18" cy="24" rx="3" ry="3.5" fill="#00E8FF" opacity="0.95" />
      <ellipse cx="30" cy="24" rx="3" ry="3.5" fill="#00E8FF" opacity="0.95" />
      <ellipse cx="17" cy="22.5" rx="1.2" ry="1.2" fill="#AAFFFF" opacity="0.8" />
      <ellipse cx="29" cy="22.5" rx="1.2" ry="1.2" fill="#AAFFFF" opacity="0.8" />
      {/* glow */}
      <ellipse cx="18" cy="24" rx="4" ry="4.5" fill="#00E8FF" opacity="0.18" />
      <ellipse cx="30" cy="24" rx="4" ry="4.5" fill="#00E8FF" opacity="0.18" />
      {/* mouth line */}
      <path d="M20 32 L28 32" stroke="#3A2A1E" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* arms */}
      <path d="M9 26 L5 28 L6 33 L12 31 Z" fill="#7A6A5C" />
      <path d="M39 26 L43 28 L42 33 L36 31 Z" fill="#7A6A5C" />
      {/* feet */}
      <ellipse cx="16" cy="42.5" rx="5.5" ry="2.2" fill="#3A2E25" />
      <ellipse cx="32" cy="42.5" rx="5.5" ry="2.2" fill="#3A2E25" />
    </SpriteFrame>
  );
}

// ─── WIND LINE ───────────────────────────────────────────────────────────────

export function BreezeLSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* large swirling wings */}
      <path d="M17 22 Q4 14 4 6 Q10 8 15 14 Q12 18 17 22 Z" fill="#7DD8B8" />
      <path d="M14 20 Q5 10 8 4 Q13 6 16 13 Z" fill="#D4F5E8" opacity="0.8" />
      {/* swirl marks on wing */}
      <path d="M8 10 Q11 14 13 18" stroke="#7DD8B8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M31 22 Q44 14 44 6 Q38 8 33 14 Q36 18 31 22 Z" fill="#7DD8B8" />
      <path d="M34 20 Q43 10 40 4 Q35 6 32 13 Z" fill="#D4F5E8" opacity="0.8" />
      <path d="M40 10 Q37 14 35 18" stroke="#7DD8B8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* round body */}
      <ellipse cx="24" cy="28" rx="10" ry="12" fill="#D4F5E8" />
      <ellipse cx="24" cy="30" rx="7.5" ry="8.5" fill="#FFFFFF" opacity="0.6" />
      {/* pointed beak */}
      <path d="M24 25 L22 28 L26 28 Z" fill="#7DD8B8" />
      {/* forked tail */}
      <path d="M20 38 Q18 44 15 46 L14 43 Q17 41 18 38 Z" fill="#7DD8B8" />
      <path d="M28 38 Q30 44 33 46 L34 43 Q31 41 30 38 Z" fill="#7DD8B8" />
      {/* head */}
      <ellipse cx="24" cy="20" rx="7" ry="7" fill="#D4F5E8" />
      <ellipse cx="24" cy="20" rx="5.5" ry="5.5" fill="#EEFDF7" />
      <Face eyeY={19} eyeDx={3.5} eyeRx={2.4} eyeRy={2.8} iris="#1A6A4A" blush="#B0ECDA" nose="#4AB898" />
      <Sparkle x={7} y={5} size={2.4} color="#FFFFFF" opacity={0.85} />
      <Sparkle x={41} y={5} size={2.4} color="#FFFFFF" opacity={0.85} />
    </SpriteFrame>
  );
}

export function CycLairSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* large concentric wind-ring chest */}
      <ellipse cx="24" cy="30" rx="10" ry="9" fill="#1E8878" opacity="0.4" />
      <ellipse cx="24" cy="30" rx="7.5" ry="6.5" fill="#3ABBA8" opacity="0.5" />
      <ellipse cx="24" cy="30" rx="5" ry="4.2" fill="#C8FFF0" opacity="0.6" />
      <ellipse cx="24" cy="30" rx="2.5" ry="2" fill="#3ABBA8" />
      {/* wing-like ear tufts */}
      <path d="M10 16 L7 8 L13 10 L15 17 Z" fill="#1E8878" />
      <path d="M38 16 L41 8 L35 10 L33 17 Z" fill="#1E8878" />
      <path d="M10.5 15.5 L8.5 9.5 L12 11 L13.5 16 Z" fill="#C8FFF0" opacity="0.7" />
      <path d="M37.5 15.5 L39.5 9.5 L36 11 L34.5 16 Z" fill="#C8FFF0" opacity="0.7" />
      {/* owl body */}
      <path d="M11 22 C11 13 17 9 24 9 C31 9 37 13 37 22 L37 34 C37 40 31 43 24 43 C17 43 11 40 11 34 Z" fill="#1E8878" />
      <path d="M14 22 C14 15 18 12 24 12 C30 12 34 15 34 22 L34 34 C34 38 30 41 24 41 C18 41 14 38 14 34 Z" fill="#3ABBA8" />
      {/* diamond face */}
      <path d="M24 13 L30 20 L24 24 L18 20 Z" fill="#C8FFF0" />
      {/* vortex tail feathers */}
      <path d="M19 41 Q16 47 13 46 Q14 43 18 41 Z" fill="#1E8878" />
      <path d="M24 42 Q24 48 21 47 Q22 44 24 42 Z" fill="#1E8878" />
      <path d="M29 41 Q32 47 35 46 Q34 43 30 41 Z" fill="#1E8878" />
      {/* big owl eyes */}
      <Face eyeY={20} eyeDx={4.5} eyeRx={3.8} eyeRy={4.2} iris="#0A4438" blush="#80DDCC" nose="#2A9988" />
    </SpriteFrame>
  );
}

export function TempestrossSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002C">
      {/* massive swept-back wings */}
      <path d="M18 22 Q4 18 2 10 Q8 8 13 12 Q10 16 14 20 Q10 22 12 26 L18 24 Z" fill="#2A4A6A" />
      <path d="M15 20 Q6 14 5 8 Q10 9 14 15 Z" fill="#4A88CC" opacity="0.5" />
      <path d="M30 22 Q44 18 46 10 Q40 8 35 12 Q38 16 34 20 Q38 22 36 26 L30 24 Z" fill="#2A4A6A" />
      <path d="M33 20 Q42 14 43 8 Q38 9 34 15 Z" fill="#4A88CC" opacity="0.5" />
      {/* white wingtips */}
      <path d="M3 11 Q5 8 8 9 Q7 13 4 14 Z" fill="#E8F4FF" opacity="0.8" />
      <path d="M45 11 Q43 8 40 9 Q41 13 44 14 Z" fill="#E8F4FF" opacity="0.8" />
      {/* electric blue streaks on wings */}
      <path d="M7 12 Q11 16 14 20" stroke="#4A88CC" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M41 12 Q37 16 34 20" stroke="#4A88CC" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* body */}
      <path d="M14 22 C14 14 18 9 24 9 C30 9 34 14 34 22 L34 33 C34 40 30 43 24 43 C18 43 14 40 14 33 Z" fill="#2A4A6A" />
      <path d="M17 22 C17 16 20 12 24 12 C28 12 31 16 31 22 L31 32 C31 37 28 40 24 40 C20 40 17 37 17 32 Z" fill="#3A6080" />
      {/* eye-of-storm circle marking on chest */}
      <ellipse cx="24" cy="29" rx="5.5" ry="5.5" fill="#2A4A6A" />
      <ellipse cx="24" cy="29" rx="3.5" ry="3.5" fill="#4A88CC" opacity="0.6" />
      <ellipse cx="24" cy="29" rx="1.5" ry="1.5" fill="#E8F4FF" opacity="0.9" />
      {/* head */}
      <ellipse cx="24" cy="16" rx="7.5" ry="7" fill="#2A4A6A" />
      {/* tail/rear */}
      <ellipse cx="16" cy="41.5" rx="5" ry="2" fill="#1A3050" />
      <ellipse cx="32" cy="41.5" rx="5" ry="2" fill="#1A3050" />
      <Face eyeY={15} eyeDx={4.5} eyeRx={3.5} eyeRy={3.8} iris="#0A2840" blush="#6AAAE8" mouth="serious" nose="#3A6898" />
    </SpriteFrame>
  );
}

// ─── TOXIC LINE ──────────────────────────────────────────────────────────────

export function SlimletSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* bubbles floating around */}
      <circle cx="9" cy="18" r="2.4" fill="#88EE66" opacity="0.45" stroke="#44CC22" strokeWidth="0.8" />
      <circle cx="38" cy="14" r="1.8" fill="#88EE66" opacity="0.4" stroke="#44CC22" strokeWidth="0.7" />
      <circle cx="6" cy="30" r="1.4" fill="#88EE66" opacity="0.35" stroke="#44CC22" strokeWidth="0.6" />
      <circle cx="42" cy="26" r="2" fill="#88EE66" opacity="0.4" stroke="#44CC22" strokeWidth="0.7" />
      {/* drip at bottom */}
      <path d="M22 40 Q22 45 24 46 Q26 45 26 40 Z" fill="#88EE66" opacity="0.85" />
      {/* wavy blob body */}
      <path d="M13 28 C12 20 14 14 18 11 C20 9 22 8 24 8 C26 8 28 9 30 11 C34 14 36 20 35 28 C34 33 31 38 28 40 C26 41.5 22 41.5 20 40 C17 38 14 33 13 28 Z" fill="#88EE66" opacity="0.88" stroke="#44CC22" strokeWidth="1.2" />
      {/* highlight bubbles inside */}
      <ellipse cx="19" cy="16" rx="3" ry="2" fill="#CCFF99" opacity="0.6" />
      <ellipse cx="29" cy="20" rx="2" ry="1.5" fill="#CCFF99" opacity="0.5" />
      <circle cx="17" cy="22" r="1.5" fill="#CCFF99" opacity="0.45" />
      {/* derpy face */}
      <ellipse cx="19" cy="25" rx="3.2" ry="3.6" fill="#FFFFFF" />
      <ellipse cx="29" cy="25" rx="3.2" ry="3.6" fill="#FFFFFF" />
      <ellipse cx="19.5" cy="25.8" rx="2" ry="2.2" fill="#44CC22" />
      <ellipse cx="29.5" cy="25.8" rx="2" ry="2.2" fill="#44CC22" />
      <circle cx="19" cy="24.8" r="0.9" fill="#FFFFFF" />
      <circle cx="29" cy="24.8" r="0.9" fill="#FFFFFF" />
      {/* derpy smile — asymmetric */}
      <path d="M20 30.5 Q24 34 28 30.5" stroke="#3AAA18" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

export function VenomiteSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* purple tail */}
      <path d="M30 38 Q38 36 42 30 Q43 26 40 25 Q38 28 36 33 Q33 36 30 37 Z" fill="#AA44CC" />
      <path d="M40 24 L42 21 L43 25 Z" fill="#CC66EE" opacity="0.7" />
      {/* wide flat frog-lizard body */}
      <path d="M9 27 C9 18 14 13 24 13 C34 13 39 18 39 27 L39 35 C39 41 33 44 24 44 C15 44 9 41 9 35 Z" fill="#44882A" />
      <path d="M12 27 C12 20 16 16 24 16 C32 16 36 20 36 27 L36 34 C36 39 31 42 24 42 C17 42 12 39 12 34 Z" fill="#5A9E38" />
      {/* toxic purple spots */}
      <circle cx="16" cy="24" r="2.5" fill="#AA44CC" opacity="0.85" />
      <circle cx="32" cy="22" r="2" fill="#AA44CC" opacity="0.8" />
      <circle cx="24" cy="20" r="1.8" fill="#CC55EE" opacity="0.75" />
      <circle cx="20" cy="32" r="2.2" fill="#AA44CC" opacity="0.8" />
      <circle cx="31" cy="33" r="1.8" fill="#CC55EE" opacity="0.75" />
      {/* webbed spiky hands */}
      <path d="M9 29 L5 26 L7 31 L4 33 L8 34 L9 32 Z" fill="#226614" />
      <path d="M39 29 L43 26 L41 31 L44 33 L40 34 L39 32 Z" fill="#226614" />
      {/* long tongue */}
      <path d="M24 36 Q20 41 20 44" stroke="#AA44CC" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="44" r="1.5" fill="#CC66EE" />
      {/* feet */}
      <ellipse cx="15" cy="42" rx="5.5" ry="2" fill="#226614" />
      <ellipse cx="33" cy="42" rx="5.5" ry="2" fill="#226614" />
      <Face eyeY={23} eyeDx={6} eyeRx={3.8} eyeRy={4.2} iris="#1A4A0A" blush="#88CC44" mouth="fang" nose="#3A7A22" />
    </SpriteFrame>
  );
}

export function ToxigoreSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000030">
      {/* toxic smoke wisps */}
      <path d="M8 14 Q6 10 8 7 Q10 10 9 14 Z" fill="#88FF22" opacity="0.35" />
      <path d="M40 12 Q42 8 40 5 Q38 8 39 12 Z" fill="#88FF22" opacity="0.3" />
      <path d="M5 22 Q3 18 5 15 Q7 18 6 22 Z" fill="#88FF22" opacity="0.25" />
      {/* spiky tail */}
      <path d="M32 36 Q40 32 44 26 L42 24 Q39 28 35 33 L33 35 Z" fill="#1A4A0A" />
      <path d="M43 24 L45 21 L46 25 Z" fill="#88FF22" opacity="0.8" />
      <path d="M40 29 L42 26 L43 30 Z" fill="#88FF22" opacity="0.7" />
      {/* armor plates with corrosion */}
      <path d="M11 18 L13 11 L24 9 L35 11 L37 18 L35 24 L24 26 L13 24 Z" fill="#336622" />
      <path d="M14 18 L15 13 L24 11 L33 13 L34 18 L33 22 L24 24 L15 22 Z" fill="#1A4A0A" />
      {/* corrosion marks */}
      <path d="M16 16 Q17 19 16 21" stroke="#88FF22" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M30 14 Q31 17 30 20" stroke="#88FF22" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* muscular body */}
      <path d="M11 24 C11 16 16 12 24 12 C32 12 37 16 37 24 L37 35 C37 41 32 44 24 44 C16 44 11 41 11 35 Z" fill="#336622" />
      <path d="M14 25 C14 19 18 15 24 15 C30 15 34 19 34 25 L34 34 C34 39 30 42 24 42 C18 42 14 39 14 34 Z" fill="#1A4A0A" />
      {/* acid drips from claws */}
      <path d="M10 30 L7 33 L9 36 L7 39" stroke="#88FF22" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M38 30 L41 33 L39 36 L41 39" stroke="#88FF22" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* acid drip from mouth */}
      <path d="M22 40 Q22 45 24 46" stroke="#88FF22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* legs */}
      <ellipse cx="15" cy="42.5" rx="5.5" ry="2" fill="#1A4A0A" />
      <ellipse cx="33" cy="42.5" rx="5.5" ry="2" fill="#1A4A0A" />
      <Face eyeY={22} eyeDx={6} eyeRx={4} eyeRy={4.5} iris="#88FF22" blush="#336622" mouth="fang" nose="#5A9A22" />
    </SpriteFrame>
  );
}

// ─── METAL LINE ──────────────────────────────────────────────────────────────

export function CoglingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* antenna */}
      <path d="M24 10 L24 5" stroke="#8A7A6A" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="4.5" r="2" fill="#C8B89A" />
      <circle cx="24" cy="4.5" r="1" fill="#E8D8C0" />
      {/* round body */}
      <path d="M12 24 C12 15 17 10 24 10 C31 10 36 15 36 24 L36 32 C36 38 31 42 24 42 C17 42 12 38 12 32 Z" fill="#C8B89A" />
      <path d="M14 24 C14 17 18 13 24 13 C30 13 34 17 34 24 L34 32 C34 37 30 40 24 40 C18 40 14 37 14 32 Z" fill="#E8D8C0" />
      {/* metal seam lines */}
      <path d="M24 13 L24 40" stroke="#8A7A6A" strokeWidth="0.9" fill="none" opacity="0.5" />
      <path d="M14 26 L34 26" stroke="#8A7A6A" strokeWidth="0.9" fill="none" opacity="0.5" />
      {/* gear/cog on chest */}
      <circle cx="24" cy="28" r="6" fill="#8A7A6A" />
      <circle cx="24" cy="28" r="4.2" fill="#C8B89A" />
      <circle cx="24" cy="28" r="2.5" fill="#8A7A6A" />
      {/* gear teeth */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = angle * Math.PI / 180;
        return <rect key={i} x={24 + Math.cos(rad)*5.5 - 1} y={28 + Math.sin(rad)*5.5 - 1} width="2" height="2" fill="#8A7A6A" transform={`rotate(${angle} ${24 + Math.cos(rad)*5.5} ${28 + Math.sin(rad)*5.5})`} />;
      })}
      {/* stubby arms with claw tips */}
      <path d="M11 26 Q6 25 6 30 Q8 33 12 31 Z" fill="#C8B89A" />
      <path d="M7 30 L5 32 L7 34" stroke="#8A7A6A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M37 26 Q42 25 42 30 Q40 33 36 31 Z" fill="#C8B89A" />
      <path d="M41 30 L43 32 L41 34" stroke="#8A7A6A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* feet */}
      <ellipse cx="18" cy="41" rx="4.5" ry="2" fill="#8A7A6A" />
      <ellipse cx="30" cy="41" rx="4.5" ry="2" fill="#8A7A6A" />
      <Face eyeY={20} eyeDx={4.8} eyeRx={3.2} eyeRy={3.6} iris="#4A3A2A" blush="#E8D8C0" nose="#8A7A6A" />
    </SpriteFrame>
  );
}

export function IronaxSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002A">
      {/* armor plates on shoulders */}
      <path d="M9 20 L6 14 L11 13 L14 20 Z" fill="#4A5860" />
      <path d="M10 19 L7.5 15 L11.5 14 L13.5 19 Z" fill="#7A8890" />
      <path d="M39 20 L42 14 L37 13 L34 20 Z" fill="#4A5860" />
      <path d="M38 19 L40.5 15 L36.5 14 L34.5 19 Z" fill="#7A8890" />
      {/* back armor */}
      <path d="M13 17 L14 10 L24 8 L34 10 L35 17 L34 22 L24 24 L14 22 Z" fill="#4A5860" />
      <path d="M15 16 L16 12 L24 10 L32 12 L33 16 L32 21 L24 22 L16 21 Z" fill="#7A8890" />
      {/* heavy body */}
      <path d="M11 24 C11 16 16 12 24 12 C32 12 37 16 37 24 L37 35 C37 41 32 44 24 44 C16 44 11 41 11 35 Z" fill="#4A5860" />
      <path d="M14 24 C14 18 18 15 24 15 C30 15 34 18 34 24 L34 34 C34 39 30 42 24 42 C18 42 14 39 14 34 Z" fill="#7A8890" />
      {/* metal-capped tusks */}
      <path d="M18 35 L14 40 L16 41 L20 37 Z" fill="#4A5860" />
      <path d="M30 35 L34 40 L32 41 L28 37 Z" fill="#4A5860" />
      <path d="M14 40 L13 42 L16 42 L16 41 Z" fill="#7A8890" />
      <path d="M34 40 L35 42 L32 42 L32 41 Z" fill="#7A8890" />
      {/* claws */}
      <path d="M11 32 L7 34 L8 37 L12 35 Z" fill="#4A5860" />
      <path d="M37 32 L41 34 L40 37 L36 35 Z" fill="#4A5860" />
      {/* feet */}
      <ellipse cx="16" cy="42.5" rx="5" ry="2" fill="#3A4848" />
      <ellipse cx="32" cy="42.5" rx="5" ry="2" fill="#3A4848" />
      {/* glowing red eyes — custom */}
      <ellipse cx="18" cy="22" rx="4" ry="4.5" fill="#1A1E22" />
      <ellipse cx="30" cy="22" rx="4" ry="4.5" fill="#1A1E22" />
      <ellipse cx="18" cy="22" rx="2.5" ry="2.8" fill="#CC3322" opacity="0.95" />
      <ellipse cx="30" cy="22" rx="2.5" ry="2.8" fill="#CC3322" opacity="0.95" />
      <ellipse cx="17.5" cy="21" rx="0.9" ry="0.9" fill="#FF8877" opacity="0.7" />
      <ellipse cx="29.5" cy="21" rx="0.9" ry="0.9" fill="#FF8877" opacity="0.7" />
      {/* glow */}
      <ellipse cx="18" cy="22" rx="3.5" ry="4" fill="#CC3322" opacity="0.2" />
      <ellipse cx="30" cy="22" rx="3.5" ry="4" fill="#CC3322" opacity="0.2" />
      {/* mouth */}
      <path d="M20 29 L28 29" stroke="#3A4848" strokeWidth="2" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

export function SteelwyrmSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002C">
      {/* swept-back metallic horns */}
      <path d="M18 10 L14 3 L20 6 Z" fill="#D4AA33" />
      <path d="M30 10 L34 3 L28 6 Z" fill="#D4AA33" />
      <path d="M15 9 L13 4 L18 7 Z" fill="#B8C8D4" opacity="0.6" />
      <path d="M33 9 L35 4 L30 7 Z" fill="#B8C8D4" opacity="0.6" />
      {/* sleek dragon body */}
      <path d="M12 22 C12 13 17 8 24 8 C31 8 36 13 36 22 L36 33 C36 40 31 43 24 43 C17 43 12 40 12 33 Z" fill="#788A98" />
      <path d="M15 23 C15 16 18 12 24 12 C30 12 33 16 33 23 L33 32 C33 38 30 41 24 41 C18 41 15 38 15 32 Z" fill="#B8C8D4" />
      {/* chrome-shine reflections on body */}
      <ellipse cx="20" cy="20" rx="3.5" ry="2" fill="#DDEAEE" opacity="0.7" transform="rotate(-20 20 20)" />
      <ellipse cx="28" cy="18" rx="2.5" ry="1.4" fill="#DDEAEE" opacity="0.55" transform="rotate(10 28 18)" />
      <ellipse cx="22" cy="30" rx="4" ry="1.8" fill="#DDEAEE" opacity="0.5" transform="rotate(-10 22 30)" />
      {/* gold trim details */}
      <path d="M15 23 L33 23" stroke="#D4AA33" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M15 31 L33 31" stroke="#D4AA33" strokeWidth="1" fill="none" opacity="0.5" />
      {/* tail */}
      <path d="M32 37 Q40 34 44 28 Q42 26 40 28 Q38 32 34 36 Z" fill="#788A98" />
      <path d="M44 27 L46 24 L47 28 Z" fill="#D4AA33" />
      {/* wing stubs */}
      <path d="M12 24 L6 18 L10 16 L14 22 Z" fill="#788A98" />
      <path d="M36 24 L42 18 L38 16 L34 22 Z" fill="#788A98" />
      {/* feet */}
      <ellipse cx="16" cy="41.5" rx="5" ry="2" fill="#5A6A78" />
      <ellipse cx="32" cy="41.5" rx="5" ry="2" fill="#5A6A78" />
      <Face eyeY={21} eyeDx={5.5} eyeRx={3.6} eyeRy={4} iris="#2A3A48" blush="#B8C8D4" mouth="serious" nose="#6A8090" />
    </SpriteFrame>
  );
}

// ─── PSYCHIC LINE ────────────────────────────────────────────────────────────

export function PsykitSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* psychic rings floating around */}
      <ellipse cx="24" cy="22" rx="18" ry="5" fill="none" stroke="#9878C8" strokeWidth="1.2" opacity="0.45" />
      <ellipse cx="24" cy="22" rx="13" ry="3.5" fill="none" stroke="#C8A8E8" strokeWidth="0.9" opacity="0.35" />
      {/* slender cat body */}
      <path d="M14 24 C14 16 18 11 24 11 C30 11 34 16 34 24 L34 33 C34 39 30 42 24 42 C18 42 14 39 14 33 Z" fill="#9878C8" />
      <path d="M17 25 C17 19 20 15 24 15 C28 15 31 19 31 25 L31 33 C31 37 28 40 24 40 C20 40 17 37 17 33 Z" fill="#C8A8E8" />
      {/* belly */}
      <ellipse cx="24" cy="32" rx="6.5" ry="5.5" fill="#EAD8FF" />
      {/* cat ears */}
      <path d="M14 15 L11 6 L18 9 L17 15 Z" fill="#9878C8" />
      <path d="M34 15 L37 6 L30 9 L31 15 Z" fill="#9878C8" />
      <path d="M14.5 14 L12.5 8 L16.5 10.5 L16 14 Z" fill="#C8A8E8" />
      <path d="M33.5 14 L35.5 8 L31.5 10.5 L32 14 Z" fill="#C8A8E8" />
      {/* third eye on forehead */}
      <ellipse cx="24" cy="17" rx="3" ry="2.5" fill="#FFD870" opacity="0.9" />
      <ellipse cx="24" cy="17" rx="1.8" ry="1.5" fill="#FF88FF" opacity="0.95" />
      <ellipse cx="23.5" cy="16.5" rx="0.7" ry="0.7" fill="#FFFFFF" opacity="0.8" />
      {/* glow */}
      <ellipse cx="24" cy="17" rx="4" ry="3.5" fill="#FF88FF" opacity="0.2" />
      {/* floating curled tail */}
      <path d="M32 35 Q38 32 40 27 Q40 23 37 23 Q36 26 36 29 Q35 32 32 34 Z" fill="#9878C8" />
      <ellipse cx="37" cy="23" rx="2.5" ry="2.5" fill="#C8A8E8" />
      {/* paws */}
      <ellipse cx="18" cy="41" rx="4" ry="1.8" fill="#7858A8" />
      <ellipse cx="30" cy="41" rx="4" ry="1.8" fill="#7858A8" />
      <Face eyeY={24} eyeDx={5} eyeRx={3.2} eyeRy={3.8} iris="#5838A8" blush="#C8A8E8" nose="#9878C8" />
    </SpriteFrame>
  );
}

export function MindraSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* three floating/splayed tails */}
      <path d="M28 36 Q36 32 40 24 Q40 20 37 20 Q36 24 34 28 Q31 33 28 36 Z" fill="#A880C8" />
      <path d="M28 37 Q38 38 42 34 Q43 30 40 30 Q38 33 35 36 Q31 38 28 37 Z" fill="#7A58A8" />
      <path d="M26 38 Q30 46 28 49 Q24 47 26 43 Q27 40 26 38 Z" fill="#A880C8" />
      {/* orbiting sparkle orbs */}
      <Sparkle x={10} y={16} size={3.2} color="#FFD870" opacity={0.9} />
      <Sparkle x={38} y={12} size={3} color="#FFD870" opacity={0.85} />
      <Sparkle x={8} y={32} size={2.8} color="#FFD870" opacity={0.8} />
      {/* elegant fox body */}
      <path d="M13 24 C13 15 18 10 24 10 C30 10 35 15 35 24 L35 34 C35 40 30 43 24 43 C18 43 13 40 13 34 Z" fill="#7A58A8" />
      <path d="M16 25 C16 18 19 14 24 14 C29 14 32 18 32 25 L32 33 C32 38 29 41 24 41 C19 41 16 38 16 33 Z" fill="#A880C8" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="7" ry="6" fill="#D4B8EE" />
      {/* fox ears */}
      <path d="M15 14 L12 5 L19 8 L18 14 Z" fill="#7A58A8" />
      <path d="M33 14 L36 5 L29 8 L30 14 Z" fill="#7A58A8" />
      <path d="M15.5 13 L13.5 7 L17.5 9.5 L17 13 Z" fill="#A880C8" />
      <path d="M32.5 13 L34.5 7 L30.5 9.5 L31 13 Z" fill="#A880C8" />
      {/* crescent moon forehead marking */}
      <path d="M21 16 Q24 13 27 16 Q25 18 24 18 Q23 18 21 16 Z" fill="#FFD870" />
      {/* paws */}
      <ellipse cx="17" cy="41.5" rx="4.5" ry="1.9" fill="#5A3888" />
      <ellipse cx="31" cy="41.5" rx="4.5" ry="1.9" fill="#5A3888" />
      <Face eyeY={23} eyeDx={5.5} eyeRx={3.5} eyeRy={4} iris="#3A1888" blush="#C8A8E8" nose="#8A68B8" />
    </SpriteFrame>
  );
}

export function CerebronSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002E">
      {/* floating geometric shapes in background */}
      <path d="M7 14 L9 10 L11 14 L9 18 Z" fill="#FFD870" opacity="0.35" />
      <path d="M37 8 L40 5 L43 8 L40 11 Z" fill="#A888D0" opacity="0.3" />
      <path d="M5 30 L7 27 L9 30 L7 33 Z" fill="#FFD870" opacity="0.3" />
      {/* folded wings */}
      <path d="M10 22 L5 16 L8 12 L15 19 L14 26 Z" fill="#7A5AA8" />
      <path d="M38 22 L43 16 L40 12 L33 19 L34 26 Z" fill="#7A5AA8" />
      <path d="M11 21 L7 17 L9 14 L14 20 Z" fill="#A888D0" opacity="0.6" />
      <path d="M37 21 L41 17 L39 14 L34 20 Z" fill="#A888D0" opacity="0.6" />
      {/* regal lion-cat body */}
      <path d="M12 23 C12 13 17 8 24 8 C31 8 36 13 36 23 L36 34 C36 41 31 44 24 44 C17 44 12 41 12 34 Z" fill="#7A5AA8" />
      <path d="M15 24 C15 16 19 12 24 12 C29 12 33 16 33 24 L33 33 C33 39 29 42 24 42 C19 42 15 39 15 33 Z" fill="#A888D0" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="8" ry="7" fill="#D0B8EE" />
      {/* ornate gold crown / halo */}
      <circle cx="24" cy="11" r="9" fill="none" stroke="#FFD870" strokeWidth="2" opacity="0.7" />
      <circle cx="24" cy="11" r="7" fill="none" stroke="#FFD870" strokeWidth="1" opacity="0.5" />
      {/* crown gems */}
      <circle cx="24" cy="3" r="2" fill="#FFD870" />
      <circle cx="17.5" cy="5.5" r="1.5" fill="#A888D0" />
      <circle cx="30.5" cy="5.5" r="1.5" fill="#A888D0" />
      {/* third eye */}
      <ellipse cx="24" cy="18" rx="3.2" ry="2.6" fill="#FFD870" opacity="0.9" />
      <ellipse cx="24" cy="18" rx="2" ry="1.6" fill="#FF88FF" opacity="0.95" />
      {/* ears */}
      <path d="M14 14 L12 7 L18 10 L17 14 Z" fill="#7A5AA8" />
      <path d="M34 14 L36 7 L30 10 L31 14 Z" fill="#7A5AA8" />
      {/* feet/paws */}
      <ellipse cx="16" cy="42.5" rx="5.5" ry="2.2" fill="#5A3A88" />
      <ellipse cx="32" cy="42.5" rx="5.5" ry="2.2" fill="#5A3A88" />
      <Sparkle x={24} y={8} size={2.8} color="#FFD870" opacity={0.9} />
      <Face eyeY={23} eyeDx={6} eyeRx={4} eyeRy={4.5} iris="#3A1A68" blush="#C8A8E8" mouth="serious" nose="#9878C8" />
    </SpriteFrame>
  );
}

// ─── CRYSTAL LINE ────────────────────────────────────────────────────────────

export function ShimlitSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000015">
      {/* sparkles everywhere */}
      <Sparkle x={8} y={20} size={2.6} color="#FF99CC" opacity={0.8} />
      <Sparkle x={40} y={15} size={2.2} color="#FFEE88" opacity={0.75} />
      <Sparkle x={7} y={34} size={2} color="#88DDFF" opacity={0.7} />
      <Sparkle x={41} y={32} size={2.4} color="#AAFFCC" opacity={0.75} />
      <Sparkle x={14} y={10} size={1.8} color="#FFBBEE" opacity={0.65} />
      <Sparkle x={34} y={8} size={1.6} color="#CCFFEE" opacity={0.6} />
      {/* delicate wing outlines */}
      <path d="M18 22 Q8 18 7 10 Q12 11 16 17 Z" fill="#88CCFF" opacity="0.25" stroke="#88CCFF" strokeWidth="0.8" />
      <path d="M30 22 Q40 18 41 10 Q36 11 32 17 Z" fill="#88CCFF" opacity="0.25" stroke="#88CCFF" strokeWidth="0.8" />
      <path d="M18 26 Q9 28 9 36 Q14 35 17 30 Z" fill="#B8ECFF" opacity="0.2" stroke="#88CCFF" strokeWidth="0.7" />
      <path d="M30 26 Q39 28 39 36 Q34 35 31 30 Z" fill="#B8ECFF" opacity="0.2" stroke="#88CCFF" strokeWidth="0.7" />
      {/* faceted gem/diamond body */}
      <path d="M24 10 L32 20 L30 32 L24 36 L18 32 L16 20 Z" fill="#B8ECFF" opacity="0.85" stroke="#88CCFF" strokeWidth="1" />
      <path d="M24 10 L32 20 L24 18 Z" fill="#88CCFF" opacity="0.6" />
      <path d="M32 20 L30 32 L24 18 Z" fill="#B8ECFF" opacity="0.5" />
      <path d="M30 32 L24 36 L24 18 Z" fill="#DDF8FF" opacity="0.55" />
      <path d="M24 36 L18 32 L24 18 Z" fill="#88CCFF" opacity="0.45" />
      <path d="M18 32 L16 20 L24 18 Z" fill="#B8ECFF" opacity="0.5" />
      <path d="M16 20 L24 10 L24 18 Z" fill="#DDF8FF" opacity="0.6" />
      {/* tiny face */}
      <Face eyeY={24} eyeDx={3} eyeRx={2} eyeRy={2.5} iris="#2A6898" blush="#AADDFF" nose="#6AACCC" />
    </SpriteFrame>
  );
}

export function PrismiteSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* large prismatic crystal wings — geometric hexagon/facet shapes */}
      <path d="M18 20 L8 12 L6 20 L10 28 L18 26 Z" fill="#DDF5FF" opacity="0.8" stroke="#4A8BAC" strokeWidth="0.8" />
      <path d="M18 20 L10 14 L9 20 L12 26 L18 24 Z" fill="#FF99CC" opacity="0.5" />
      <path d="M18 20 L12 10 L8 12 Z" fill="#4A8BAC" opacity="0.5" />
      <path d="M30 20 L40 12 L42 20 L38 28 L30 26 Z" fill="#DDF5FF" opacity="0.8" stroke="#4A8BAC" strokeWidth="0.8" />
      <path d="M30 20 L38 14 L39 20 L36 26 L30 24 Z" fill="#FF99CC" opacity="0.5" />
      <path d="M30 20 L36 10 L40 12 Z" fill="#4A8BAC" opacity="0.5" />
      {/* fox body */}
      <path d="M13 24 C13 16 17 11 24 11 C31 11 35 16 35 24 L35 33 C35 39 31 42 24 42 C17 42 13 39 13 33 Z" fill="#6AABCC" />
      <path d="M16 25 C16 19 19 15 24 15 C29 15 32 19 32 25 L32 32 C32 37 29 40 24 40 C19 40 16 37 16 32 Z" fill="#4A8BAC" />
      {/* crystal horn */}
      <path d="M24 10 L22 4 L24 6 L26 4 L24 10 Z" fill="#DDF5FF" stroke="#4A8BAC" strokeWidth="0.7" />
      {/* gem in chest */}
      <path d="M24 26 L27 29 L24 33 L21 29 Z" fill="#DDF5FF" opacity="0.9" />
      <path d="M24 26 L27 29 L24 29 Z" fill="#FF99CC" opacity="0.7" />
      <path d="M24 33 L21 29 L24 29 Z" fill="#88CCFF" opacity="0.7" />
      {/* fox tail */}
      <path d="M32 36 Q40 32 42 26 Q40 24 38 26 Q37 30 33 35 Z" fill="#6AABCC" />
      {/* fox ears */}
      <path d="M15 15 L12 6 L19 9 L18 15 Z" fill="#6AABCC" />
      <path d="M33 15 L36 6 L29 9 L30 15 Z" fill="#6AABCC" />
      <path d="M15.5 14 L13.5 8 L17 10 L16.5 14 Z" fill="#DDF5FF" opacity="0.8" />
      <path d="M32.5 14 L34.5 8 L31 10 L31.5 14 Z" fill="#DDF5FF" opacity="0.8" />
      {/* paws */}
      <ellipse cx="17" cy="41" rx="4.5" ry="1.9" fill="#3A6B8C" />
      <ellipse cx="31" cy="41" rx="4.5" ry="1.9" fill="#3A6B8C" />
      <Sparkle x={7} y={12} size={2.4} color="#DDF5FF" opacity={0.8} />
      <Sparkle x={41} y={12} size={2.4} color="#FF99CC" opacity={0.75} />
      <Face eyeY={23} eyeDx={5} eyeRx={3.2} eyeRy={3.8} iris="#2A5A78" blush="#AADDFF" nose="#5A9ABB" />
    </SpriteFrame>
  );
}

export function CrystalithSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002E">
      {/* crown of tall crystal spires */}
      <path d="M16 12 L14 4 L17 7 L18 3 L20 7 L22 2 L24 6 L26 2 L28 7 L30 3 L31 7 L34 4 L32 12 Z" fill="#2A5A7A" stroke="#4A8AAA" strokeWidth="0.8" />
      <path d="M18 11 L17 6 L18.5 8 L20 4 L21.5 8 L23 3 L24 7 L25 3 L26.5 8 L28 4 L29.5 8 L31 6 L30 11 Z" fill="#A8E0FF" opacity="0.5" />
      {/* stacked crystal formations body */}
      <path d="M11 22 L13 14 L24 11 L35 14 L37 22 L35 30 L24 33 L13 30 Z" fill="#2A5A7A" stroke="#4A8AAA" strokeWidth="0.9" />
      <path d="M14 22 L15.5 16 L24 14 L32.5 16 L34 22 L32.5 28 L24 31 L15.5 28 Z" fill="#4A8AAA" />
      {/* lower body crystal */}
      <path d="M13 30 L15 26 L24 29 L33 26 L35 30 L33 37 L24 40 L15 37 Z" fill="#2A5A7A" stroke="#4A8AAA" strokeWidth="0.8" />
      <path d="M16 30 L17 27 L24 30 L31 27 L32 30 L31 36 L24 39 L17 36 Z" fill="#4A8AAA" />
      {/* glowing core in chest */}
      <ellipse cx="24" cy="22" rx="5" ry="5" fill="#2A5A7A" />
      <ellipse cx="24" cy="22" rx="3.5" ry="3.5" fill="#A8E0FF" opacity="0.8" />
      <ellipse cx="24" cy="22" rx="2" ry="2" fill="#7FFFFF" opacity="0.95" />
      <ellipse cx="24" cy="22" rx="5.5" ry="5.5" fill="#7FFFFF" opacity="0.15" />
      {/* gem-encrusted side crystals */}
      <path d="M10 22 L6 18 L8 26 L12 26 Z" fill="#4A8AAA" />
      <path d="M38 22 L42 18 L40 26 L36 26 Z" fill="#4A8AAA" />
      <ellipse cx="9" cy="22" rx="1.5" ry="2" fill="#A8E0FF" opacity="0.8" />
      <ellipse cx="39" cy="22" rx="1.5" ry="2" fill="#A8E0FF" opacity="0.8" />
      {/* custom imposing eyes */}
      <ellipse cx="19" cy="20" rx="3.5" ry="4" fill="#0A2A3A" />
      <ellipse cx="29" cy="20" rx="3.5" ry="4" fill="#0A2A3A" />
      <ellipse cx="19" cy="20" rx="2" ry="2.5" fill="#7FFFFF" opacity="0.9" />
      <ellipse cx="29" cy="20" rx="2" ry="2.5" fill="#7FFFFF" opacity="0.9" />
      <ellipse cx="18.5" cy="18.8" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="28.5" cy="18.8" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.8" />
      {/* mouth */}
      <path d="M21 27 L27 27" stroke="#4A8AAA" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Sparkle x={7} y={14} size={2.8} color="#A8E0FF" opacity={0.8} />
      <Sparkle x={41} y={14} size={2.8} color="#A8E0FF" opacity={0.8} />
    </SpriteFrame>
  );
}

// ─── DRAGON LINE ─────────────────────────────────────────────────────────────

export function DrakelingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* small stubby wings */}
      <path d="M15 22 Q8 18 8 12 Q12 13 15 18 Z" fill="#EE6633" opacity="0.85" />
      <path d="M33 22 Q40 18 40 12 Q36 13 33 18 Z" fill="#EE6633" opacity="0.85" />
      {/* oversized round head */}
      <ellipse cx="24" cy="18" rx="12" ry="11" fill="#CC4422" />
      <ellipse cx="24" cy="19" rx="10" ry="9" fill="#EE6633" />
      {/* belly/head highlight */}
      <ellipse cx="24" cy="22" rx="7" ry="5.5" fill="#FFD870" opacity="0.55" />
      {/* tiny horn */}
      <path d="M24 8 L22 3 L25 5 Z" fill="#FFD870" />
      {/* dragon ear-flaps */}
      <path d="M13 14 L10 8 L16 11 Z" fill="#AA2A08" />
      <path d="M35 14 L38 8 L32 11 Z" fill="#AA2A08" />
      {/* cute short body */}
      <path d="M16 27 C16 22 19 19 24 19 C29 19 32 22 32 27 L32 35 C32 40 29 43 24 43 C19 43 16 40 16 35 Z" fill="#CC4422" />
      <path d="M19 28 C19 25 21 23 24 23 C27 23 29 25 29 28 L29 35 C29 38 27 40 24 40 C21 40 19 38 19 35 Z" fill="#EE6633" />
      {/* belly gold */}
      <ellipse cx="24" cy="34" rx="6" ry="5.5" fill="#FFD870" opacity="0.8" />
      {/* short round tail */}
      <path d="M29 38 Q34 36 35 32 Q33 31 31 33 Q30 36 29 38 Z" fill="#CC4422" />
      {/* stubby legs */}
      <ellipse cx="19" cy="41.5" rx="4" ry="2" fill="#AA2A08" />
      <ellipse cx="29" cy="41.5" rx="4" ry="2" fill="#AA2A08" />
      <Face eyeY={18} eyeDx={5.2} eyeRx={3.8} eyeRy={4.2} iris="#2A0A04" blush="#FFD870" nose="#AA2A08" />
    </SpriteFrame>
  );
}

export function ScalefangSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000024">
      {/* proper wings */}
      <path d="M14 22 Q5 16 4 8 Q9 9 13 15 Q11 18 13 22 Z" fill="#AA2A18" />
      <path d="M11 16 Q6 10 7 6 Q11 8 12 14 Z" fill="#FF8833" opacity="0.5" />
      <path d="M34 22 Q43 16 44 8 Q39 9 35 15 Q37 18 35 22 Z" fill="#AA2A18" />
      <path d="M37 16 Q42 10 41 6 Q37 8 36 14 Z" fill="#FF8833" opacity="0.5" />
      {/* longer tail */}
      <path d="M31 37 Q40 33 44 26 L42 24 Q40 28 36 33 L32 36 Z" fill="#AA2A18" />
      <path d="M44 24 L46 20 L47 25 Z" fill="#FFD870" />
      {/* horns */}
      <path d="M18 12 L15 4 L20 8 Z" fill="#FFD870" />
      <path d="M30 12 L33 4 L28 8 Z" fill="#FFD870" />
      {/* body */}
      <path d="M12 23 C12 14 17 9 24 9 C31 9 36 14 36 23 L36 34 C36 41 31 44 24 44 C17 44 12 41 12 34 Z" fill="#AA2A18" />
      <path d="M15 24 C15 17 18 13 24 13 C30 13 33 17 33 24 L33 33 C33 39 30 42 24 42 C18 42 15 39 15 33 Z" fill="#CC3322" />
      {/* scale diamond pattern marks */}
      <path d="M19 20 L21 18 L23 20 L21 22 Z" fill="#AA2A18" opacity="0.7" />
      <path d="M23 18 L25 16 L27 18 L25 20 Z" fill="#AA2A18" opacity="0.7" />
      <path d="M27 20 L29 18 L31 20 L29 22 Z" fill="#AA2A18" opacity="0.7" />
      <path d="M21 24 L23 22 L25 24 L23 26 Z" fill="#AA2A18" opacity="0.65" />
      <path d="M25 24 L27 22 L29 24 L27 26 Z" fill="#AA2A18" opacity="0.65" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="7.5" ry="6.5" fill="#FF8833" opacity="0.7" />
      {/* fangs visible */}
      <ellipse cx="16" cy="42" rx="5" ry="2.2" fill="#8A1A08" />
      <ellipse cx="32" cy="42" rx="5" ry="2.2" fill="#8A1A08" />
      <Face eyeY={22} eyeDx={6} eyeRx={4} eyeRy={4.5} iris="#1A0A04" blush="#FF8833" mouth="fang" nose="#882218" />
    </SpriteFrame>
  );
}

export function WyrmkingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000032">
      {/* fire aura */}
      <ellipse cx="24" cy="25" rx="21" ry="19" fill="#FF6622" opacity="0.1" />
      {/* massive folded wings */}
      <path d="M10 22 L3 14 L6 9 L13 17 L12 26 Z" fill="#880E04" />
      <path d="M8 16 L4 10 L7 8 L11 14 Z" fill="#FF6622" opacity="0.45" />
      <path d="M38 22 L45 14 L42 9 L35 17 L36 26 Z" fill="#880E04" />
      <path d="M40 16 L44 10 L41 8 L37 14 Z" fill="#FF6622" opacity="0.45" />
      {/* gold crown of horns */}
      <path d="M14 12 L11 3 L16 7 L18 2 L20 7 L24 3 L28 7 L30 2 L32 7 L37 3 L34 12 Z" fill="#FFD700" />
      <path d="M16 11 L14 5 L17.5 8 L19.5 4 L21 8 L24 5 L27 8 L28.5 4 L30.5 8 L34 5 L32 11 Z" fill="#AA1A10" />
      {/* body */}
      <path d="M11 22 C11 12 16 7 24 7 C32 7 37 12 37 22 L37 34 C37 42 32 45 24 45 C16 45 11 42 11 34 Z" fill="#AA1A10" />
      <path d="M14 23 C14 15 18 11 24 11 C30 11 34 15 34 23 L34 33 C34 40 30 43 24 43 C18 43 14 40 14 33 Z" fill="#880E04" />
      {/* ancient rune-like markings */}
      <path d="M19 22 L21 19 L21 26" stroke="#FF6622" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M19 19 L21 19" stroke="#FF6622" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M19 22 L21 22" stroke="#FF6622" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M27 18 L29 18 L29 26 L27 26" stroke="#FF6622" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M27 22 L29 22" stroke="#FF6622" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="9" ry="7.5" fill="#CC2A10" opacity="0.8" />
      {/* tail */}
      <path d="M32 40 Q42 36 46 28 L44 26 Q42 31 37 37 L33 40 Z" fill="#AA1A10" />
      {/* legs */}
      <ellipse cx="16" cy="43" rx="5.5" ry="2.2" fill="#6A0A02" />
      <ellipse cx="32" cy="43" rx="5.5" ry="2.2" fill="#6A0A02" />
      <Face eyeY={21} eyeDx={6.5} eyeRx={4.5} eyeRy={5} iris="#AA0000" blush="#FF6622" mouth="fang" nose="#880E04" />
      <Sparkle x={7} y={8} size={3} color="#FFD700" opacity={0.8} />
      <Sparkle x={41} y={8} size={3} color="#FFD700" opacity={0.8} />
    </SpriteFrame>
  );
}

// ─── NATURE LINE ─────────────────────────────────────────────────────────────

export function LarvixSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* leaf shield */}
      <path d="M8 24 Q4 16 10 10 Q16 14 14 22 Q12 26 10 28 Z" fill="#88CC44" />
      <path d="M9 23 Q6 17 10 12 Q15 15 13 21 Z" fill="#AAEE66" opacity="0.7" />
      <path d="M9 12 Q10 18 8 24" stroke="#66AA22" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* segmented caterpillar body */}
      <ellipse cx="32" cy="33" rx="5" ry="4.5" fill="#88CC44" />
      <ellipse cx="26" cy="36" rx="5" ry="4.5" fill="#AAEE66" />
      <ellipse cx="20" cy="35" rx="4.5" ry="4" fill="#88CC44" />
      {/* segment dividers */}
      <path d="M23 32 Q22 36 23 39" stroke="#66AA22" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M29 31 Q28 35 29 38" stroke="#66AA22" strokeWidth="1.2" fill="none" opacity="0.6" />
      {/* oversized head */}
      <ellipse cx="30" cy="23" rx="10" ry="10" fill="#AAEE66" />
      <ellipse cx="30" cy="24" rx="8.5" ry="8.5" fill="#CCFF88" />
      {/* yellow markings */}
      <ellipse cx="30" cy="26" rx="5.5" ry="4" fill="#FFDD44" opacity="0.5" />
      {/* antennae */}
      <path d="M25 14 Q22 8 20 6" stroke="#88CC44" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="6" r="1.8" fill="#FFDD44" />
      <path d="M35 14 Q38 8 40 6" stroke="#88CC44" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="6" r="1.8" fill="#FFDD44" />
      {/* legs — small nubs */}
      <path d="M19 37 L16 40" stroke="#66AA22" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23 39 L22 43" stroke="#66AA22" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 38 L28 42" stroke="#66AA22" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M33 36 L34 40" stroke="#66AA22" strokeWidth="1.8" strokeLinecap="round" />
      <Face eyeY={22} eyeDx={4.5} eyeRx={3.2} eyeRy={3.6} iris="#2A5A0A" blush="#CCFF88" nose="#66AA22" />
    </SpriteFrame>
  );
}

export function ChrysamingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* LARGE ornate butterfly wings */}
      {/* upper wings */}
      <path d="M20 22 Q8 14 5 6 Q12 6 18 12 Q16 16 18 20 Z" fill="#CC66AA" />
      <path d="M18 18 Q10 12 8 7 Q13 8 16 14 Z" fill="#FFAA44" opacity="0.6" />
      {/* eyespot upper left */}
      <ellipse cx="11" cy="10" rx="3.5" ry="3.5" fill="#44AACC" />
      <ellipse cx="11" cy="10" rx="2" ry="2" fill="#FFAA44" />
      <ellipse cx="11" cy="10" rx="1" ry="1" fill="#FFFFFF" />
      <path d="M28 22 Q40 14 43 6 Q36 6 30 12 Q32 16 30 20 Z" fill="#CC66AA" />
      <path d="M30 18 Q38 12 40 7 Q35 8 32 14 Z" fill="#FFAA44" opacity="0.6" />
      {/* eyespot upper right */}
      <ellipse cx="37" cy="10" rx="3.5" ry="3.5" fill="#44AACC" />
      <ellipse cx="37" cy="10" rx="2" ry="2" fill="#FFAA44" />
      <ellipse cx="37" cy="10" rx="1" ry="1" fill="#FFFFFF" />
      {/* lower wings */}
      <path d="M20 26 Q9 30 8 40 Q15 40 19 34 Z" fill="#EE88CC" />
      <path d="M28 26 Q39 30 40 40 Q33 40 29 34 Z" fill="#EE88CC" />
      {/* small humanoid-ish body */}
      <path d="M18 22 C18 16 20 13 24 13 C28 13 30 16 30 22 L30 32 C30 37 28 40 24 40 C20 40 18 37 18 32 Z" fill="#EE88CC" />
      <ellipse cx="24" cy="30" rx="5" ry="5" fill="#FFCCE8" />
      {/* antennae with heart tips */}
      <path d="M21 13 Q18 7 16 5" stroke="#CC66AA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M27 13 Q30 7 32 5" stroke="#CC66AA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* heart tips */}
      <path d="M14 4 Q15 2 16 4 Q17 2 18 4 Q17 6 16 7 Q15 6 14 4 Z" fill="#CC66AA" />
      <path d="M30 4 Q31 2 32 4 Q33 2 34 4 Q33 6 32 7 Q31 6 30 4 Z" fill="#CC66AA" />
      {/* legs */}
      <ellipse cx="20" cy="40.5" rx="3.5" ry="1.8" fill="#CC66AA" />
      <ellipse cx="28" cy="40.5" rx="3.5" ry="1.8" fill="#CC66AA" />
      <Face eyeY={22} eyeDx={4} eyeRx={3} eyeRy={3.4} iris="#2A0A4A" blush="#FFCCE8" nose="#CC66AA" />
    </SpriteFrame>
  );
}

export function MoTheronSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000030">
      {/* galaxy wings — dark with sparkle dots */}
      <path d="M18 24 Q4 18 2 8 Q10 8 16 16 Q14 20 17 24 Z" fill="#2A1A4A" />
      <path d="M14 18 Q6 11 7 6 Q12 8 14 15 Z" fill="#6633AA" opacity="0.6" />
      <path d="M30 24 Q44 18 46 8 Q38 8 32 16 Q34 20 31 24 Z" fill="#2A1A4A" />
      <path d="M34 18 Q42 11 41 6 Q36 8 34 15 Z" fill="#6633AA" opacity="0.6" />
      {/* lower wings */}
      <path d="M17 27 Q5 32 4 42 Q12 42 17 35 Z" fill="#3D2260" />
      <path d="M31 27 Q43 32 44 42 Q36 42 31 35 Z" fill="#3D2260" />
      {/* wing sparkles — galaxy stars */}
      <Sparkle x={8} y={12} size={2} color="#FFFFFF" opacity={0.85} />
      <Sparkle x={12} y={17} size={1.6} color="#FFD870" opacity={0.75} />
      <Sparkle x={6} y={22} size={1.8} color="#FFFFFF" opacity={0.7} />
      <Sparkle x={40} y={12} size={2} color="#FFFFFF" opacity={0.85} />
      <Sparkle x={36} y={17} size={1.6} color="#FFD870" opacity={0.75} />
      <Sparkle x={42} y={22} size={1.8} color="#FFFFFF" opacity={0.7} />
      <Sparkle x={7} y={35} size={1.6} color="#FFFFFF" opacity={0.65} />
      <Sparkle x={41} y={35} size={1.6} color="#FFFFFF" opacity={0.65} />
      {/* gold eyespots on wings */}
      <ellipse cx="10" cy="14" rx="3.5" ry="3.5" fill="#FFD870" opacity="0.8" />
      <ellipse cx="10" cy="14" rx="2" ry="2" fill="#2A1A4A" />
      <ellipse cx="38" cy="14" rx="3.5" ry="3.5" fill="#FFD870" opacity="0.8" />
      <ellipse cx="38" cy="14" rx="2" ry="2" fill="#2A1A4A" />
      {/* fluffy body */}
      <ellipse cx="24" cy="25" rx="9" ry="10" fill="#3D2260" />
      <ellipse cx="24" cy="25" rx="7" ry="8" fill="#6633AA" opacity="0.6" />
      {/* large compound eyes */}
      <ellipse cx="19" cy="21" rx="4.5" ry="5" fill="#1A0A30" />
      <ellipse cx="29" cy="21" rx="4.5" ry="5" fill="#1A0A30" />
      <ellipse cx="19" cy="21" rx="3" ry="3.5" fill="#6633AA" />
      <ellipse cx="29" cy="21" rx="3" ry="3.5" fill="#6633AA" />
      <ellipse cx="18.5" cy="19.8" rx="1.2" ry="1.2" fill="#FFFFFF" opacity="0.6" />
      <ellipse cx="28.5" cy="19.8" rx="1.2" ry="1.2" fill="#FFFFFF" opacity="0.6" />
      {/* long flowing antennae */}
      <path d="M20 16 Q16 10 14 6 Q11 4 10 6" stroke="#6633AA" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M28 16 Q32 10 34 6 Q37 4 38 6" stroke="#6633AA" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="6" r="2" fill="#FFD870" />
      <circle cx="38" cy="6" r="2" fill="#FFD870" />
      {/* mouth */}
      <path d="M21 30 Q24 33 27 30" stroke="#3D2260" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* feet */}
      <ellipse cx="19" cy="34" rx="4" ry="1.8" fill="#2A1A4A" />
      <ellipse cx="29" cy="34" rx="4" ry="1.8" fill="#2A1A4A" />
    </SpriteFrame>
  );
}

// ─── LAVA LINE ───────────────────────────────────────────────────────────────

export function MagmiteSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* molten drips at bottom */}
      <path d="M19 40 Q18 45 19 47 Q21 46 21 40 Z" fill="#FF4400" opacity="0.8" />
      <path d="M27 41 Q27 46 29 47 Q30 45 29 41 Z" fill="#FF8833" opacity="0.7" />
      {/* slug-like body with lava crack patterns */}
      <path d="M10 28 C10 18 15 12 24 12 C33 12 38 18 38 28 C38 36 34 42 24 42 C14 42 10 36 10 28 Z" fill="#220800" />
      {/* lava crack network */}
      <path d="M18 20 Q20 24 19 28 Q22 30 24 28 Q26 30 29 28 Q28 24 30 20" stroke="#FF4400" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M14 26 Q17 26 19 28" stroke="#FF4400" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M34 26 Q31 26 29 28" stroke="#FF4400" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M19 28 Q20 32 20 36" stroke="#FF8833" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M29 28 Q28 32 28 36" stroke="#FF8833" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* brightest cracks */}
      <path d="M22 22 Q23 25 22 27" stroke="#FFCC44" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M26 23 Q25 26 26 28" stroke="#FFCC44" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.85" />
      {/* inner glow orbs */}
      <ellipse cx="20" cy="26" rx="2.5" ry="2" fill="#FF8833" opacity="0.5" />
      <ellipse cx="28" cy="26" rx="2.5" ry="2" fill="#FF8833" opacity="0.5" />
      <ellipse cx="24" cy="30" rx="2" ry="1.5" fill="#FFCC44" opacity="0.55" />
      {/* simple glowing eyes */}
      <ellipse cx="19" cy="21" rx="3.2" ry="3.5" fill="#FF4400" opacity="0.9" />
      <ellipse cx="29" cy="21" rx="3.2" ry="3.5" fill="#FF4400" opacity="0.9" />
      <ellipse cx="18.5" cy="20" rx="1.2" ry="1.2" fill="#FFCC44" opacity="0.8" />
      <ellipse cx="28.5" cy="20" rx="1.2" ry="1.2" fill="#FFCC44" opacity="0.8" />
      {/* no legs — slug-like, just base */}
    </SpriteFrame>
  );
}

export function InferiteSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* flame tail tip */}
      <path d="M32 36 Q38 32 41 26 Q38 22 36 25 Q35 30 31 35 Z" fill="#3A1000" />
      <path d="M39 25 Q42 20 41 16 Q38 19 38 24 Z" fill="#FF5500" opacity="0.9" />
      <path d="M40 17 L42 13 L43 18 Z" fill="#FFAA00" opacity="0.85" />
      {/* fire crown on head */}
      <path d="M19 12 L17 6 L20 9 L22 5 L24 9 L26 5 L28 9 L31 6 L29 12 Z" fill="#CC2200" />
      <path d="M20 11 L18.5 7 L21 9.5 L23 6.5 L24 9 L25 6.5 L27 9.5 L29.5 7 L28 11 Z" fill="#FF5500" />
      <path d="M22 10 L22.5 7 L24 9 L25.5 7 L26 10 Z" fill="#FFAA00" opacity="0.9" />
      {/* sleek salamander body */}
      <path d="M13 24 C13 15 17 10 24 10 C31 10 35 15 35 24 L35 34 C35 40 31 43 24 43 C17 43 13 40 13 34 Z" fill="#3A1000" />
      <path d="M15 25 C15 18 18 14 24 14 C30 14 33 18 33 25 L33 33 C33 38 30 41 24 41 C18 41 15 38 15 33 Z" fill="#CC2200" />
      {/* glowing lava network all over */}
      <path d="M19 20 Q21 24 20 28 Q22 31 24 29 Q26 31 28 28 Q27 24 29 20" stroke="#FF5500" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M16 26 Q18 26 20 28" stroke="#FF5500" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M32 26 Q30 26 28 28" stroke="#FF5500" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M20 28 Q20 33 19 37" stroke="#FFAA00" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M28 28 Q28 33 29 37" stroke="#FFAA00" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* bright crack highlights */}
      <path d="M22 22 Q22 25 22 27" stroke="#FFAA00" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M26 23 Q26 26 26 28" stroke="#FFAA00" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* limbs */}
      <path d="M13 28 Q8 26 7 31 Q9 34 13 32 Z" fill="#3A1000" />
      <path d="M35 28 Q40 26 41 31 Q39 34 35 32 Z" fill="#3A1000" />
      {/* lava network on arms */}
      <path d="M9 29 Q10 31 9 33" stroke="#FF5500" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M39 29 Q38 31 39 33" stroke="#FF5500" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* feet */}
      <ellipse cx="17" cy="41.5" rx="4.5" ry="2" fill="#2A0A00" />
      <ellipse cx="31" cy="41.5" rx="4.5" ry="2" fill="#2A0A00" />
      {/* glowing eyes */}
      <ellipse cx="19" cy="20" rx="3.8" ry="4.2" fill="#220800" />
      <ellipse cx="29" cy="20" rx="3.8" ry="4.2" fill="#220800" />
      <ellipse cx="19" cy="20" rx="2.2" ry="2.6" fill="#FF5500" opacity="0.95" />
      <ellipse cx="29" cy="20" rx="2.2" ry="2.6" fill="#FF5500" opacity="0.95" />
      <ellipse cx="18.5" cy="18.8" rx="0.9" ry="0.9" fill="#FFAA00" opacity="0.8" />
      <ellipse cx="28.5" cy="18.8" rx="0.9" ry="0.9" fill="#FFAA00" opacity="0.8" />
      {/* mouth lava drip */}
      <path d="M22 29 Q22 32 23 33" stroke="#FF5500" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

export function VolcanixSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000035">
      {/* lava/fire aura glow */}
      <ellipse cx="24" cy="24" rx="22" ry="20" fill="#FF3300" opacity="0.08" />
      {/* orbiting ember sparks */}
      <Sparkle x={6} y={16} size={2.8} color="#FFEE88" opacity={0.9} />
      <Sparkle x={42} y={12} size={2.4} color="#FFB300" opacity={0.85} />
      <Sparkle x={4} y={30} size={2} color="#FFEE88" opacity={0.75} />
      <Sparkle x={44} y={30} size={2.2} color="#FFB300" opacity={0.8} />
      <Sparkle x={10} y={6} size={1.8} color="#FF6622" opacity={0.7} />
      <Sparkle x={38} y={5} size={2} color="#FF6622" opacity={0.7} />
      {/* wings made of lava streams — flowing magma paths */}
      <path d="M18 22 Q8 16 4 8 Q8 6 13 10 Q11 14 14 18 Q10 20 12 24 L18 22 Z" fill="#AA1A00" />
      <path d="M14 16 Q8 10 7 6 Q11 8 13 14 Z" fill="#FF3300" opacity="0.7" />
      <path d="M12 22 Q7 20 8 26 Q10 28 14 26 Z" fill="#FF3300" opacity="0.5" />
      {/* lava streams on left wing */}
      <path d="M7 8 Q10 12 12 16" stroke="#FFB300" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M9 14 Q11 18 10 22" stroke="#FFEE88" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M30 22 Q40 16 44 8 Q40 6 35 10 Q37 14 34 18 Q38 20 36 24 L30 22 Z" fill="#AA1A00" />
      <path d="M34 16 Q40 10 41 6 Q37 8 35 14 Z" fill="#FF3300" opacity="0.7" />
      <path d="M36 22 Q41 20 40 26 Q38 28 34 26 Z" fill="#FF3300" opacity="0.5" />
      {/* lava streams on right wing */}
      <path d="M41 8 Q38 12 36 16" stroke="#FFB300" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M39 14 Q37 18 38 22" stroke="#FFEE88" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* molten body */}
      <path d="M13 23 C13 13 17 8 24 8 C31 8 35 13 35 23 L35 34 C35 42 31 45 24 45 C17 45 13 42 13 34 Z" fill="#1A0500" />
      <path d="M16 24 C16 16 19 12 24 12 C29 12 32 16 32 24 L32 33 C32 40 29 43 24 43 C19 43 16 40 16 33 Z" fill="#AA1A00" />
      {/* volcano eruption lava network */}
      <path d="M20 18 Q22 22 21 26 Q23 29 24 27 Q25 29 27 26 Q26 22 28 18" stroke="#FF3300" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M16 25 Q18 25 21 26" stroke="#FF3300" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M32 25 Q30 25 27 26" stroke="#FF3300" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M21 26 Q21 31 20 36" stroke="#FFB300" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M27 26 Q27 31 28 36" stroke="#FFB300" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* brightest inner cracks */}
      <path d="M22 20 Q23 23 22 25" stroke="#FFEE88" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M26 21 Q25 24 26 26" stroke="#FFEE88" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* volcano eruption silhouette top */}
      <path d="M18 12 L16 6 L20 9 L22 4 L24 8 L26 4 L28 9 L32 6 L30 12 Z" fill="#1A0500" />
      <path d="M19 11 L18 7 L21 9.5 L23 6 L24 9 L25 6 L27 9.5 L30 7 L29 11 Z" fill="#AA1A00" />
      <path d="M21 10 L22 7 L24 9 L26 7 L27 10 Z" fill="#FF3300" opacity="0.9" />
      <path d="M23 9 L24 7 L25 9 Z" fill="#FFEE88" opacity="0.9" />
      {/* legs */}
      <ellipse cx="16" cy="43" rx="5" ry="2" fill="#0A0200" />
      <ellipse cx="32" cy="43" rx="5" ry="2" fill="#0A0200" />
      {/* fierce eyes */}
      <ellipse cx="19" cy="21" rx="4" ry="4.5" fill="#0A0200" />
      <ellipse cx="29" cy="21" rx="4" ry="4.5" fill="#0A0200" />
      <ellipse cx="19" cy="21" rx="2.5" ry="3" fill="#FF3300" opacity="0.95" />
      <ellipse cx="29" cy="21" rx="2.5" ry="3" fill="#FF3300" opacity="0.95" />
      <ellipse cx="18.5" cy="19.5" rx="1" ry="1" fill="#FFEE88" opacity="0.9" />
      <ellipse cx="28.5" cy="19.5" rx="1" ry="1" fill="#FFEE88" opacity="0.9" />
      {/* mouth */}
      <path d="M21 28 Q24 31 27 28" stroke="#FF3300" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// ─── FAIRY LINE ──────────────────────────────────────────────────────────────

export function PinkpuffSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* big floppy rabbit ears */}
      <ellipse cx="16" cy="10" rx="4" ry="10" fill="#FFB3DD" />
      <ellipse cx="32" cy="10" rx="4" ry="10" fill="#FFB3DD" />
      <ellipse cx="16" cy="10" rx="2.2" ry="7.5" fill="#FFD6EE" />
      <ellipse cx="32" cy="10" rx="2.2" ry="7.5" fill="#FFD6EE" />
      {/* round pink body */}
      <ellipse cx="24" cy="30" rx="13" ry="12" fill="#FF99DD" />
      <ellipse cx="24" cy="31" rx="10" ry="9.5" fill="#FFBBEE" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="6.5" ry="5.5" fill="#FFD6EE" />
      {/* tiny paws */}
      <ellipse cx="14" cy="40" rx="4.5" ry="2.2" fill="#FF88CC" />
      <ellipse cx="34" cy="40" rx="4.5" ry="2.2" fill="#FF88CC" />
      {/* cute little tail */}
      <circle cx="34" cy="30" r="3" fill="#FFFFFF" />
      <Face eyeY={26} eyeDx={5} eyeRx={3.2} eyeRy={3.8} iris="#5A1A3A" blush="#FF88CC" nose="#CC66AA" />
    </SpriteFrame>
  );
}

export function FloppearSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* long floppy ears */}
      <ellipse cx="15" cy="11" rx="4.5" ry="12" fill="#FF88CC" />
      <ellipse cx="33" cy="11" rx="4.5" ry="12" fill="#FF88CC" />
      <ellipse cx="15" cy="11" rx="2.5" ry="9" fill="#FFBBEE" />
      <ellipse cx="33" cy="11" rx="2.5" ry="9" fill="#FFBBEE" />
      {/* flower crown */}
      <circle cx="18" cy="4" r="2.5" fill="#FFAACC" />
      <circle cx="24" cy="2" r="3" fill="#FFD6EE" />
      <circle cx="30" cy="4" r="2.5" fill="#FF88BB" />
      <circle cx="18" cy="4" r="1.2" fill="#FFD700" />
      <circle cx="24" cy="2" r="1.4" fill="#FFD700" />
      <circle cx="30" cy="4" r="1.2" fill="#FFD700" />
      {/* body */}
      <ellipse cx="24" cy="30" rx="13.5" ry="12.5" fill="#FFAADD" />
      <ellipse cx="24" cy="31" rx="10.5" ry="10" fill="#FFD6EE" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="7" ry="6" fill="#FFF0F7" />
      {/* paws */}
      <ellipse cx="13" cy="41" rx="5" ry="2.3" fill="#FF88CC" />
      <ellipse cx="35" cy="41" rx="5" ry="2.3" fill="#FF88CC" />
      {/* fluffy tail */}
      <circle cx="35" cy="29" r="4" fill="#FFFFFF" />
      <Face eyeY={26} eyeDx={5.2} eyeRx={3.5} eyeRy={4} iris="#4A1830" blush="#FF99CC" nose="#CC5599" />
    </SpriteFrame>
  );
}

export function LunabunSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000025">
      {/* elegant wings */}
      <path d="M17 24 Q6 18 5 10 Q11 12 16 18 Z" fill="#FFBBEE" opacity="0.8" />
      <path d="M31 24 Q42 18 43 10 Q37 12 32 18 Z" fill="#FFBBEE" opacity="0.8" />
      {/* royal tall ears */}
      <ellipse cx="15" cy="9" rx="4.5" ry="13" fill="#FF88CC" />
      <ellipse cx="33" cy="9" rx="4.5" ry="13" fill="#FF88CC" />
      <ellipse cx="15" cy="9" rx="2.4" ry="10" fill="#FFD6EE" />
      <ellipse cx="33" cy="9" rx="2.4" ry="10" fill="#FFD6EE" />
      {/* moon horn */}
      <path d="M24 8 Q21 2 24 0 Q27 2 24 8 Z" fill="#FFD700" />
      <Sparkle x={24} y={4} size={2.4} color="#FFF0A0" opacity={0.95} />
      {/* body */}
      <ellipse cx="24" cy="30" rx="13" ry="12" fill="#FFBBEE" />
      <ellipse cx="24" cy="31" rx="10.5" ry="9.5" fill="#FFD6EE" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="7" ry="5.8" fill="#FFF0FA" />
      {/* star markings */}
      <Sparkle x={18} y={28} size={2.2} color="#FFD700" opacity={0.85} />
      <Sparkle x={30} y={26} size={2} color="#FFD700" opacity={0.8} />
      {/* paws */}
      <ellipse cx="13" cy="41" rx="5.5" ry="2.3" fill="#FF88CC" />
      <ellipse cx="35" cy="41" rx="5.5" ry="2.3" fill="#FF88CC" />
      {/* fluffy tail */}
      <circle cx="35" cy="28" r="4.5" fill="#FFFFFF" />
      <Face eyeY={25} eyeDx={5.5} eyeRx={3.8} eyeRy={4.3} iris="#3A1020" blush="#FF99CC" nose="#BB4488" />
    </SpriteFrame>
  );
}

// ─── GHOST LINE ──────────────────────────────────────────────────────────────

export function SpookaSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000010">
      {/* tiny ghost sheet */}
      <path d="M16 22 C16 12 20 8 24 8 C28 8 32 12 32 22 L32 36 Q32 40 28 40 Q26 44 24 44 Q22 44 20 40 Q16 40 16 36 Z" fill="#EEFBFF" opacity="0.95" />
      {/* wavy bottom */}
      <path d="M16 36 Q18 33 20 36 Q22 39 24 36 Q26 33 28 36 Q30 39 32 36 L32 38 Q30 42 28 40 Q26 44 24 44 Q22 44 20 40 Q18 42 16 38 Z" fill="#CCF0FF" opacity="0.8" />
      {/* stubby arms */}
      <path d="M15 24 Q9 22 9 28 Q12 30 15 28 Z" fill="#EEFBFF" opacity="0.9" />
      <path d="M33 24 Q39 22 39 28 Q36 30 33 28 Z" fill="#EEFBFF" opacity="0.9" />
      {/* tiny dot eyes */}
      <circle cx="20" cy="22" r="2.5" fill="#44AABB" />
      <circle cx="28" cy="22" r="2.5" fill="#44AABB" />
      <circle cx="19.5" cy="21.5" r="0.9" fill="#FFFFFF" opacity="0.7" />
      <circle cx="27.5" cy="21.5" r="0.9" fill="#FFFFFF" opacity="0.7" />
      {/* tiny smile */}
      <path d="M22 27 Q24 29 26 27" stroke="#6AABB8" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="17" cy="25.5" rx="2.3" ry="1.2" fill="#AADDEE" opacity="0.5" />
      <ellipse cx="31" cy="25.5" rx="2.3" ry="1.2" fill="#AADDEE" opacity="0.5" />
    </SpriteFrame>
  );
}

export function PhantletSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000018">
      {/* larger ghost with glowing eyes */}
      <path d="M13 22 C13 12 18 7 24 7 C30 7 35 12 35 22 L35 37 Q33 42 30 40 Q27 45 24 45 Q21 45 18 40 Q15 42 13 37 Z" fill="#D8F8FF" opacity="0.95" />
      {/* wavy bottom multi-lobe */}
      <path d="M13 37 Q15 33 17 37 Q19 40 21 37 Q23 33 25 37 Q27 40 29 37 Q31 33 33 37 Q33 40 30 40 Q27 45 24 45 Q21 45 18 40 Q15 42 13 40 Z" fill="#AADEF0" opacity="0.85" />
      {/* glowing teal eyes */}
      <ellipse cx="19" cy="20" rx="4" ry="4.5" fill="#003040" />
      <ellipse cx="29" cy="20" rx="4" ry="4.5" fill="#003040" />
      <ellipse cx="19" cy="20" rx="2.4" ry="3" fill="#33DDEE" opacity="0.95" />
      <ellipse cx="29" cy="20" rx="2.4" ry="3" fill="#33DDEE" opacity="0.95" />
      <ellipse cx="18.5" cy="18.8" rx="0.9" ry="0.9" fill="#AAFFFF" opacity="0.8" />
      <ellipse cx="28.5" cy="18.8" rx="0.9" ry="0.9" fill="#AAFFFF" opacity="0.8" />
      {/* glow */}
      <ellipse cx="19" cy="20" rx="4.5" ry="5" fill="#33DDEE" opacity="0.18" />
      <ellipse cx="29" cy="20" rx="4.5" ry="5" fill="#33DDEE" opacity="0.18" />
      {/* mouth */}
      <path d="M21 28 Q24 31 27 28" stroke="#55B8CC" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* floating arms */}
      <path d="M12 24 Q6 22 6 29 Q10 31 13 29 Z" fill="#D8F8FF" opacity="0.9" />
      <path d="M36 24 Q42 22 42 29 Q38 31 35 29 Z" fill="#D8F8FF" opacity="0.9" />
      {/* blush */}
      <ellipse cx="15" cy="26" rx="2.6" ry="1.3" fill="#88CCDD" opacity="0.45" />
      <ellipse cx="33" cy="26" rx="2.6" ry="1.3" fill="#88CCDD" opacity="0.45" />
    </SpriteFrame>
  );
}

export function HauntlordSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000001A">
      {/* dramatic cape-like ghost form */}
      <path d="M10 22 C10 11 16 6 24 6 C32 6 38 11 38 22 L38 40 Q35 46 30 43 Q27 48 24 48 Q21 48 18 43 Q13 46 10 40 Z" fill="#C4EEFF" opacity="0.95" />
      {/* robe wave bottom */}
      <path d="M10 40 Q12 35 14 40 Q16 44 18 40 Q20 36 22 40 Q24 44 26 40 Q28 36 30 40 Q32 44 34 40 Q36 35 38 40 Q36 45 30 43 Q27 48 24 48 Q21 48 18 43 Q12 45 10 40 Z" fill="#88CCEE" opacity="0.9" />
      {/* crown */}
      <path d="M16 11 L14 5 L18 8 L20 3 L24 7 L28 3 L30 8 L34 5 L32 11 Z" fill="#FFD700" />
      <path d="M18 10 L17 7 L20 9 L22 5 L24 8 L26 5 L28 9 L31 7 L30 10 Z" fill="#FFF0A0" opacity="0.8" />
      {/* crown gem */}
      <circle cx="24" cy="7" r="2.5" fill="#55DDFF" opacity="0.9" />
      <circle cx="24" cy="7" r="1.2" fill="#FFFFFF" opacity="0.8" />
      {/* large glowing eyes */}
      <ellipse cx="18" cy="22" rx="4.5" ry="5" fill="#002030" />
      <ellipse cx="30" cy="22" rx="4.5" ry="5" fill="#002030" />
      <ellipse cx="18" cy="22" rx="3" ry="3.5" fill="#44DDFF" opacity="0.95" />
      <ellipse cx="30" cy="22" rx="3" ry="3.5" fill="#44DDFF" opacity="0.95" />
      <ellipse cx="17.5" cy="20.8" rx="1.1" ry="1.1" fill="#AAFFFF" opacity="0.85" />
      <ellipse cx="29.5" cy="20.8" rx="1.1" ry="1.1" fill="#AAFFFF" opacity="0.85" />
      {/* glow */}
      <ellipse cx="18" cy="22" rx="5" ry="5.5" fill="#44DDFF" opacity="0.2" />
      <ellipse cx="30" cy="22" rx="5" ry="5.5" fill="#44DDFF" opacity="0.2" />
      {/* regal frown/serious mouth */}
      <path d="M21 30 L27 30" stroke="#44AABB" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* floating hands */}
      <path d="M9 26 Q3 24 3 32 Q7 34 10 31 Z" fill="#C4EEFF" opacity="0.9" />
      <path d="M39 26 Q45 24 45 32 Q41 34 38 31 Z" fill="#C4EEFF" opacity="0.9" />
      <Sparkle x={7} y={14} size={2.8} color="#AAFFFF" opacity={0.8} />
      <Sparkle x={41} y={12} size={2.4} color="#FFD700" opacity={0.75} />
    </SpriteFrame>
  );
}

// ─── SAND LINE ───────────────────────────────────────────────────────────────

export function DustkitSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* round sand mouse body */}
      <ellipse cx="24" cy="29" rx="13" ry="12" fill="#D4A86A" />
      <ellipse cx="24" cy="30" rx="10" ry="9.5" fill="#EEC88A" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="6.5" ry="5.5" fill="#F5DFB0" />
      {/* round ears */}
      <circle cx="14" cy="17" r="5.5" fill="#D4A86A" />
      <circle cx="34" cy="17" r="5.5" fill="#D4A86A" />
      <circle cx="14" cy="17" r="3.5" fill="#EE9977" />
      <circle cx="34" cy="17" r="3.5" fill="#EE9977" />
      {/* curled tail */}
      <path d="M34 36 Q42 32 42 26 Q42 22 39 23 Q38 27 37 31 Q36 34 34 36 Z" fill="#C49A5A" />
      <circle cx="39" cy="23" r="2.2" fill="#EEC88A" />
      {/* tiny paws */}
      <ellipse cx="15" cy="40" rx="4.5" ry="2" fill="#C49A5A" />
      <ellipse cx="33" cy="40" rx="4.5" ry="2" fill="#C49A5A" />
      <Face eyeY={26} eyeDx={4.8} eyeRx={3.2} eyeRy={3.8} iris="#3A2010" blush="#E8B070" nose="#AA7040" />
    </SpriteFrame>
  );
}

export function SandrollSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* armadillo shell on back */}
      <path d="M11 20 L13 12 L24 10 L35 12 L37 20 L35 28 L24 30 L13 28 Z" fill="#A87840" />
      {/* shell segments */}
      <path d="M12 20 L36 20" stroke="#8A6030" strokeWidth="1.2" fill="none" opacity="0.7" />
      <path d="M13 24 L35 24" stroke="#8A6030" strokeWidth="1" fill="none" opacity="0.6" />
      {/* shell highlights */}
      <path d="M15 13 L33 13" stroke="#C8A060" strokeWidth="1" fill="none" opacity="0.5" />
      {/* body */}
      <ellipse cx="24" cy="33" rx="13" ry="11" fill="#C8983C" />
      <ellipse cx="24" cy="34" rx="10" ry="8.5" fill="#E8B84C" />
      {/* belly */}
      <ellipse cx="24" cy="36" rx="6.5" ry="5.5" fill="#F5D898" />
      {/* stubby legs */}
      <path d="M12 34 Q8 34 7 39 Q11 41 13 38 Z" fill="#A87840" />
      <path d="M36 34 Q40 34 41 39 Q37 41 35 38 Z" fill="#A87840" />
      <ellipse cx="11" cy="41" rx="4" ry="1.8" fill="#8A6030" />
      <ellipse cx="37" cy="41" rx="4" ry="1.8" fill="#8A6030" />
      <Face eyeY={28} eyeDx={5} eyeRx={3.3} eyeRy={3.8} iris="#2E1808" blush="#D4A060" nose="#8A5828" />
    </SpriteFrame>
  );
}

export function TerradonSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002A">
      {/* sand spine fin row */}
      <path d="M16 11 L14 5 L19 9 Z" fill="#B8883A" />
      <path d="M21 9 L20 3 L25 7 Z" fill="#D4A850" />
      <path d="M27 9 L27 2 L31 7 Z" fill="#B8883A" />
      <path d="M32 11 L34 5 L29 9 Z" fill="#D4A850" />
      {/* wide lizard body */}
      <path d="M10 25 C10 15 15 10 24 10 C33 10 38 15 38 25 L38 36 C38 42 33 45 24 45 C15 45 10 42 10 36 Z" fill="#A87830" />
      <path d="M13 26 C13 18 17 14 24 14 C31 14 35 18 35 26 L35 35 C35 40 31 43 24 43 C17 43 13 40 13 35 Z" fill="#C8A050" />
      {/* belly scales */}
      <ellipse cx="24" cy="35" rx="9" ry="7.5" fill="#E8CC88" />
      {/* thick tail */}
      <path d="M34 40 Q44 36 46 28 Q44 25 42 27 Q40 33 36 38 L34 41 Z" fill="#A87830" />
      {/* sandy texture marks */}
      <path d="M16 24 Q17 28 16 31" stroke="#8A6020" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M32 23 Q31 27 32 30" stroke="#8A6020" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* clawed feet */}
      <path d="M11 36 L7 38 L8 42 L13 41 Z" fill="#A87830" />
      <path d="M37 36 L41 38 L40 42 L35 41 Z" fill="#A87830" />
      <ellipse cx="10" cy="42.5" rx="4" ry="1.8" fill="#6A4A18" />
      <ellipse cx="38" cy="42.5" rx="4" ry="1.8" fill="#6A4A18" />
      <Face eyeY={22} eyeDx={6} eyeRx={3.8} eyeRy={4.2} iris="#2A1808" blush="#D4A860" mouth="serious" nose="#7A5020" />
    </SpriteFrame>
  );
}

// ─── SPEED LINE ──────────────────────────────────────────────────────────────

export function DashpupSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* wind streaks behind */}
      <path d="M8 24 Q3 22 2 26 Q5 28 9 26 Z" fill="#33DDFF" opacity="0.5" />
      <path d="M7 29 Q2 27 1 31 Q4 33 8 31 Z" fill="#33DDFF" opacity="0.4" />
      {/* fox body */}
      <ellipse cx="25" cy="29" rx="12.5" ry="11.5" fill="#FF7722" />
      <ellipse cx="25" cy="30" rx="10" ry="9.2" fill="#FF9944" />
      {/* belly */}
      <ellipse cx="25" cy="33" rx="6" ry="5.5" fill="#FFD4A0" />
      {/* fox ears */}
      <path d="M15 18 L12 9 L19 12 L18 18 Z" fill="#FF6611" />
      <path d="M33 18 L36 9 L29 12 L30 18 Z" fill="#FF6611" />
      <path d="M15.5 17 L13.5 10 L17.5 12.5 L17 17 Z" fill="#FFD4A0" />
      <path d="M32.5 17 L34.5 10 L30.5 12.5 L31 17 Z" fill="#FFD4A0" />
      {/* lightning bolt tail */}
      <path d="M34 35 Q38 30 40 28 Q36 28 35 31 Q38 28 40 26 L36 26 Q35 29 33 34 Z" fill="#FF7722" />
      <path d="M37 26 L40 22 L42 26 L39 26 L41 23 Z" fill="#33DDFF" opacity="0.85" />
      {/* paws */}
      <ellipse cx="16" cy="40" rx="4.5" ry="2" fill="#CC5511" />
      <ellipse cx="34" cy="40" rx="4.5" ry="2" fill="#CC5511" />
      <Face eyeY={25} eyeDx={5} eyeRx={3.2} eyeRy={3.8} iris="#2A1008" blush="#FF9944" nose="#CC5511" />
    </SpriteFrame>
  );
}

export function ZoomfoxSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* multiple speed streaks */}
      <path d="M7 22 Q1 20 0 25 Q4 27 8 24 Z" fill="#33DDFF" opacity="0.55" />
      <path d="M6 28 Q0 26 0 31 Q4 34 7 31 Z" fill="#33DDFF" opacity="0.45" />
      <path d="M7 33 Q2 31 2 36 Q5 38 8 35 Z" fill="#33DDFF" opacity="0.35" />
      {/* sleek fox body */}
      <path d="M12 24 C12 15 17 10 24 10 C31 10 36 15 36 24 L36 34 C36 40 31 43 24 43 C17 43 12 40 12 34 Z" fill="#EE6611" />
      <path d="M15 25 C15 18 18 14 24 14 C30 14 33 18 33 25 L33 33 C33 38 30 41 24 41 C18 41 15 38 15 33 Z" fill="#FF8833" />
      {/* speed line fur pattern */}
      <path d="M16 22 Q18 26 16 30" stroke="#CC4400" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M20 20 Q22 24 20 28" stroke="#CC4400" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M28 20 Q26 24 28 28" stroke="#CC4400" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="7" ry="6" fill="#FFCC88" />
      {/* fox ears */}
      <path d="M14 14 L11 5 L18 8 L17 14 Z" fill="#EE6611" />
      <path d="M34 14 L37 5 L30 8 L31 14 Z" fill="#EE6611" />
      <path d="M14.5 13 L12.5 7 L16.5 9.5 L16 13 Z" fill="#FFCC88" />
      <path d="M33.5 13 L35.5 7 L31.5 9.5 L32 13 Z" fill="#FFCC88" />
      {/* cyan lightning bolt tail */}
      <path d="M32 37 Q38 32 42 28 Q38 28 36 31 Q40 27 42 24 L37 24 Q35 28 32 36 Z" fill="#EE6611" />
      <path d="M40 23 L43 19 L45 23 Z" fill="#33DDFF" opacity="0.9" />
      {/* paws */}
      <ellipse cx="16" cy="41.5" rx="5" ry="2.2" fill="#BB4400" />
      <ellipse cx="32" cy="41.5" rx="5" ry="2.2" fill="#BB4400" />
      <Face eyeY={22} eyeDx={5.5} eyeRx={3.5} eyeRy={4} iris="#1A0804" blush="#FF9944" mouth="serious" nose="#BB4400" />
    </SpriteFrame>
  );
}

export function BlazedashSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002C">
      {/* afterimage trails — fading fox shapes */}
      <ellipse cx="8" cy="30" rx="6" ry="9" fill="#FF6611" opacity="0.25" />
      <ellipse cx="4" cy="31" rx="4" ry="6" fill="#33DDFF" opacity="0.18" />
      {/* speed streaks */}
      <path d="M5 21 Q0 19 0 24 Q3 27 6 24 Z" fill="#33DDFF" opacity="0.6" />
      <path d="M4 28 Q0 26 0 31 Q3 34 5 31 Z" fill="#33DDFF" opacity="0.5" />
      <path d="M5 34 Q1 32 1 37 Q4 39 6 36 Z" fill="#33DDFF" opacity="0.4" />
      {/* big body */}
      <path d="M12 23 C12 13 17 8 24 8 C31 8 36 13 36 23 L36 34 C36 41 31 44 24 44 C17 44 12 41 12 34 Z" fill="#CC4400" />
      <path d="M15 24 C15 16 18 12 24 12 C30 12 33 16 33 24 L33 33 C33 39 30 42 24 42 C18 42 15 39 15 33 Z" fill="#EE6611" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="8" ry="6.5" fill="#FFBB66" />
      {/* large swept ears */}
      <path d="M13 13 L10 3 L18 7 L17 14 Z" fill="#CC4400" />
      <path d="M35 13 L38 3 L30 7 L31 14 Z" fill="#CC4400" />
      <path d="M13.5 12 L11.5 5 L17 8 L16 12 Z" fill="#FFBB66" />
      <path d="M34.5 12 L36.5 5 L31 8 L32 12 Z" fill="#FFBB66" />
      {/* dramatic lightning bolt tail */}
      <path d="M32 38 Q40 32 44 26 Q40 26 38 29 Q42 24 44 20 L39 21 Q36 26 32 37 Z" fill="#CC4400" />
      <path d="M42 20 L45 15 L47 21 Z" fill="#33DDFF" opacity="0.95" />
      {/* cyan lightning stripes on body */}
      <path d="M20 18 Q21 22 20 26" stroke="#33DDFF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M27 17 Q26 21 27 25" stroke="#33DDFF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* paws */}
      <ellipse cx="16" cy="42" rx="5.5" ry="2.2" fill="#992200" />
      <ellipse cx="32" cy="42" rx="5.5" ry="2.2" fill="#992200" />
      <Face eyeY={21} eyeDx={6} eyeRx={4} eyeRy={4.5} iris="#1A0800" blush="#FF9944" mouth="serious" nose="#992200" />
      <Sparkle x={7} y={10} size={2.6} color="#33DDFF" opacity={0.85} />
      <Sparkle x={41} y={8} size={2.2} color="#FFCC44" opacity={0.8} />
    </SpriteFrame>
  );
}

// ─── COSMIC LINE ─────────────────────────────────────────────────────────────

export function VoidpupSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* small alien blob body */}
      <ellipse cx="24" cy="30" rx="13" ry="12" fill="#7744BB" />
      <ellipse cx="24" cy="31" rx="10.5" ry="9.5" fill="#9966CC" />
      {/* belly glow */}
      <ellipse cx="24" cy="34" rx="6" ry="5" fill="#BB88EE" opacity="0.8" />
      {/* single antenna */}
      <path d="M24 18 L24 10" stroke="#AA66DD" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="9.5" r="2.5" fill="#CC88FF" />
      <circle cx="24" cy="9.5" r="1.2" fill="#FFFFFF" opacity="0.7" />
      {/* single big curious eye */}
      <ellipse cx="24" cy="26" rx="5.5" ry="6" fill="#110022" />
      <ellipse cx="24" cy="26" rx="3.5" ry="4" fill="#AA55EE" opacity="0.95" />
      <ellipse cx="22.8" cy="24.5" rx="1.3" ry="1.3" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="24" cy="26" rx="5.8" ry="6.2" fill="#AA55EE" opacity="0.2" />
      {/* stubby arms */}
      <path d="M12 30 Q7 28 7 33 Q10 35 13 33 Z" fill="#7744BB" />
      <path d="M36 30 Q41 28 41 33 Q38 35 35 33 Z" fill="#7744BB" />
      {/* base */}
      <ellipse cx="17" cy="41" rx="4" ry="1.8" fill="#5533AA" />
      <ellipse cx="31" cy="41" rx="4" ry="1.8" fill="#5533AA" />
      {/* tiny stars around */}
      <Sparkle x={8} y={20} size={2} color="#DD99FF" opacity={0.75} />
      <Sparkle x={40} y={18} size={1.8} color="#99BBFF" opacity={0.7} />
    </SpriteFrame>
  );
}

export function NebularkSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* galaxy pattern aura */}
      <ellipse cx="24" cy="28" rx="18" ry="16" fill="#3311AA" opacity="0.3" />
      {/* body with galaxy swirl */}
      <path d="M11 25 C11 15 16 10 24 10 C32 10 37 15 37 25 L37 35 C37 41 32 44 24 44 C16 44 11 41 11 35 Z" fill="#4422AA" />
      <path d="M14 26 C14 18 18 14 24 14 C30 14 34 18 34 26 L34 34 C34 39 30 42 24 42 C18 42 14 39 14 34 Z" fill="#6644BB" />
      {/* galaxy swirl marks */}
      <path d="M19 26 Q24 22 29 26 Q26 30 24 32 Q22 30 19 26 Z" fill="#AA77EE" opacity="0.5" />
      <path d="M17 30 Q20 27 24 29" stroke="#CC99FF" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* two antennae */}
      <path d="M19 12 Q16 6 14 4" stroke="#8855CC" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="4" r="2.5" fill="#CC88FF" />
      <path d="M29 12 Q32 6 34 4" stroke="#8855CC" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="4" r="2.5" fill="#AA66EE" />
      {/* multiple small eyes */}
      <ellipse cx="17" cy="22" rx="3.2" ry="3.5" fill="#110033" />
      <ellipse cx="17" cy="22" rx="1.9" ry="2.2" fill="#8855EE" opacity="0.95" />
      <ellipse cx="31" cy="22" rx="3.2" ry="3.5" fill="#110033" />
      <ellipse cx="31" cy="22" rx="1.9" ry="2.2" fill="#6633DD" opacity="0.95" />
      <ellipse cx="24" cy="20" rx="2.8" ry="3" fill="#110033" />
      <ellipse cx="24" cy="20" rx="1.6" ry="1.9" fill="#9966FF" opacity="0.95" />
      <ellipse cx="16.5" cy="21" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="30.5" cy="21" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.7" />
      {/* tentacle stubs */}
      <path d="M11 29 Q6 27 5 33 Q9 35 12 32 Z" fill="#4422AA" />
      <path d="M37 29 Q42 27 43 33 Q39 35 36 32 Z" fill="#4422AA" />
      {/* paws */}
      <ellipse cx="15" cy="42" rx="5" ry="2.2" fill="#331188" />
      <ellipse cx="33" cy="42" rx="5" ry="2.2" fill="#331188" />
      <Sparkle x={8} y={16} size={2.4} color="#CC99FF" opacity={0.85} />
      <Sparkle x={40} y={12} size={2} color="#AABBFF" opacity={0.8} />
    </SpriteFrame>
  );
}

export function CosmodrakeSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000030">
      {/* cosmic dragon aura */}
      <ellipse cx="24" cy="25" rx="22" ry="20" fill="#220055" opacity="0.3" />
      {/* wings */}
      <path d="M14 22 Q4 14 3 6 Q9 8 14 16 L13 22 Z" fill="#3311AA" />
      <path d="M10 14 Q5 8 6 5 Q10 7 12 13 Z" fill="#6644CC" opacity="0.5" />
      <path d="M34 22 Q44 14 45 6 Q39 8 34 16 L35 22 Z" fill="#3311AA" />
      <path d="M38 14 Q43 8 42 5 Q38 7 36 13 Z" fill="#6644CC" opacity="0.5" />
      {/* star map body */}
      <path d="M13 23 C13 13 17 8 24 8 C31 8 35 13 35 23 L35 34 C35 41 31 44 24 44 C17 44 13 41 13 34 Z" fill="#220055" />
      <path d="M16 24 C16 16 19 12 24 12 C29 12 32 16 32 24 L32 33 C32 39 29 42 24 42 C19 42 16 39 16 33 Z" fill="#4422AA" />
      {/* star map constellations on body */}
      <Sparkle x={19} y={22} size={2.2} color="#FFD870" opacity={0.9} />
      <Sparkle x={29} y={20} size={1.8} color="#AABBFF" opacity={0.85} />
      <Sparkle x={24} y={28} size={2.4} color="#FFD870" opacity={0.9} />
      <Sparkle x={17} y={32} size={1.6} color="#CC99FF" opacity={0.8} />
      <Sparkle x={31} y={31} size={1.8} color="#FFD870" opacity={0.85} />
      <path d="M19 22 L24 28 L29 20" stroke="#8866DD" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M24 28 L17 32 L31 31" stroke="#8866DD" strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* horns */}
      <path d="M18 10 L15 3 L20 7 Z" fill="#7744CC" />
      <path d="M30 10 L33 3 L28 7 Z" fill="#7744CC" />
      {/* cosmic tail */}
      <path d="M32 38 Q40 34 44 26 Q42 24 40 26 Q39 32 34 37 Z" fill="#3311AA" />
      <Sparkle x={40} y={26} size={2} color="#FFD870" opacity={0.85} />
      {/* paws */}
      <ellipse cx="16" cy="42" rx="5.5" ry="2.2" fill="#1A0044" />
      <ellipse cx="32" cy="42" rx="5.5" ry="2.2" fill="#1A0044" />
      {/* big glowing eyes */}
      <ellipse cx="18" cy="21" rx="4" ry="4.5" fill="#0A001A" />
      <ellipse cx="30" cy="21" rx="4" ry="4.5" fill="#0A001A" />
      <ellipse cx="18" cy="21" rx="2.5" ry="3" fill="#BB77FF" opacity="0.95" />
      <ellipse cx="30" cy="21" rx="2.5" ry="3" fill="#9966FF" opacity="0.95" />
      <ellipse cx="17.5" cy="19.8" rx="1" ry="1" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="29.5" cy="19.8" rx="1" ry="1" fill="#FFFFFF" opacity="0.8" />
      <path d="M21 29 Q24 32 27 29" stroke="#7744CC" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Sparkle x={7} y={10} size={2.8} color="#AABBFF" opacity={0.8} />
      <Sparkle x={41} y={9} size={2.4} color="#FFD870" opacity={0.75} />
    </SpriteFrame>
  );
}

// ─── DREAM LINE ──────────────────────────────────────────────────────────────

export function DrowzeeSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* soft cloud puff body */}
      <ellipse cx="24" cy="28" rx="14" ry="11" fill="#D8C8F8" />
      <ellipse cx="17" cy="26" rx="7" ry="6" fill="#E8DCFC" />
      <ellipse cx="31" cy="26" rx="7" ry="6" fill="#E8DCFC" />
      <ellipse cx="24" cy="22" rx="9" ry="7" fill="#EDE4FE" />
      {/* sleepy half-closed eyes */}
      <ellipse cx="20" cy="24" rx="3.2" ry="2.5" fill="#111133" />
      <path d="M17 22.5 Q20 22 23 22.5" stroke="#D8C8F8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="28" cy="24" rx="3.2" ry="2.5" fill="#111133" />
      <path d="M25 22.5 Q28 22 31 22.5" stroke="#D8C8F8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="19.5" cy="23.5" rx="1" ry="0.9" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="27.5" cy="23.5" rx="1" ry="0.9" fill="#FFFFFF" opacity="0.7" />
      {/* zzz floating above */}
      <text x="33" y="14" fontSize="5" fill="#B0A0E8" opacity="0.9" fontFamily="Arial" fontWeight="bold">Z</text>
      <text x="36" y="10" fontSize="4" fill="#B0A0E8" opacity="0.7" fontFamily="Arial" fontWeight="bold">z</text>
      <text x="38" y="7" fontSize="3" fill="#B0A0E8" opacity="0.5" fontFamily="Arial" fontWeight="bold">z</text>
      {/* blush */}
      <ellipse cx="14.5" cy="27.5" rx="2.5" ry="1.3" fill="#C8AAEE" opacity="0.5" />
      <ellipse cx="33.5" cy="27.5" rx="2.5" ry="1.3" fill="#C8AAEE" opacity="0.5" />
      {/* tiny smile */}
      <path d="M21 28.5 Q24 31 27 28.5" stroke="#9988BB" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* base */}
      <ellipse cx="18" cy="38" rx="4.5" ry="2" fill="#B8A8E8" />
      <ellipse cx="30" cy="38" rx="4.5" ry="2" fill="#B8A8E8" />
    </SpriteFrame>
  );
}

export function SlumbearSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* cloud bear body */}
      <ellipse cx="24" cy="30" rx="14" ry="12" fill="#C8B8F0" />
      <ellipse cx="16" cy="27" rx="7.5" ry="7" fill="#D8CCFE" />
      <ellipse cx="32" cy="27" rx="7.5" ry="7" fill="#D8CCFE" />
      <ellipse cx="24" cy="22" rx="9.5" ry="8" fill="#DDD4FF" />
      {/* bear ears (cloud puffs) */}
      <circle cx="15" cy="14" r="5.5" fill="#C8B8F0" />
      <circle cx="33" cy="14" r="5.5" fill="#C8B8F0" />
      <circle cx="15" cy="14" r="3.5" fill="#DDD4FF" />
      <circle cx="33" cy="14" r="3.5" fill="#DDD4FF" />
      {/* belly cloud */}
      <ellipse cx="24" cy="33" rx="8" ry="6.5" fill="#EDE8FF" />
      {/* Zzz floating */}
      <text x="30" y="10" fontSize="6" fill="#9988CC" opacity="0.9" fontFamily="Arial" fontWeight="bold">Z</text>
      <text x="34" y="6" fontSize="5" fill="#9988CC" opacity="0.7" fontFamily="Arial" fontWeight="bold">z</text>
      <text x="37" y="3" fontSize="4" fill="#9988CC" opacity="0.5" fontFamily="Arial" fontWeight="bold">z</text>
      {/* sleepy face */}
      <ellipse cx="19" cy="24" rx="3.5" ry="2.8" fill="#221144" />
      <path d="M15.8 22 Q19 21.5 22.2 22" stroke="#DDD4FF" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <ellipse cx="29" cy="24" rx="3.5" ry="2.8" fill="#221144" />
      <path d="M25.8 22 Q29 21.5 32.2 22" stroke="#DDD4FF" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <ellipse cx="18.5" cy="23.2" rx="1" ry="1" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="28.5" cy="23.2" rx="1" ry="1" fill="#FFFFFF" opacity="0.7" />
      {/* nose */}
      <ellipse cx="24" cy="27" rx="2.5" ry="1.8" fill="#9977BB" opacity="0.9" />
      {/* soft smile */}
      <path d="M21 30 Q24 32.5 27 30" stroke="#9977BB" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="14" cy="27" rx="2.8" ry="1.4" fill="#C0A8EE" opacity="0.5" />
      <ellipse cx="34" cy="27" rx="2.8" ry="1.4" fill="#C0A8EE" opacity="0.5" />
      {/* paws */}
      <ellipse cx="15" cy="41" rx="5.5" ry="2.2" fill="#9977CC" />
      <ellipse cx="33" cy="41" rx="5.5" ry="2.2" fill="#9977CC" />
    </SpriteFrame>
  );
}

export function DreamonSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* celestial glow aura */}
      <ellipse cx="24" cy="26" rx="21" ry="18" fill="#6644BB" opacity="0.15" />
      {/* moon accessory */}
      <path d="M38 8 Q34 6 34 10 Q36 14 40 12 Q44 8 38 8 Z" fill="#FFD870" />
      {/* star accessories floating */}
      <Sparkle x={8} y={10} size={2.6} color="#FFD870" opacity={0.85} />
      <Sparkle x={40} y={15} size={2.2} color="#C8B0FF" opacity={0.8} />
      <Sparkle x={6} y={24} size={2} color="#FFD870" opacity={0.75} />
      {/* large cloud bear body */}
      <ellipse cx="24" cy="30" rx="15" ry="13" fill="#8866CC" />
      <ellipse cx="15" cy="27" rx="8.5" ry="8" fill="#9977DD" />
      <ellipse cx="33" cy="27" rx="8.5" ry="8" fill="#9977DD" />
      <ellipse cx="24" cy="22" rx="11" ry="9" fill="#AA88EE" />
      {/* cloud bear ears */}
      <circle cx="14" cy="12" r="6" fill="#8866CC" />
      <circle cx="34" cy="12" r="6" fill="#8866CC" />
      <circle cx="14" cy="12" r="4" fill="#AA88EE" />
      <circle cx="34" cy="12" r="4" fill="#AA88EE" />
      {/* dream star pattern on body */}
      <Sparkle x={20} y={28} size={2} color="#FFD870" opacity={0.8} />
      <Sparkle x={28} y={26} size={1.8} color="#FFD870" opacity={0.75} />
      <Sparkle x={24} y={33} size={2.2} color="#C8B0FF" opacity={0.85} />
      {/* belly glow */}
      <ellipse cx="24" cy="34" rx="9" ry="7.5" fill="#CCB8FF" opacity="0.6" />
      {/* large expressive eyes */}
      <Face eyeY={22} eyeDx={6} eyeRx={4} eyeRy={4.5} iris="#220044" blush="#C8B0FF" nose="#8855CC" />
      {/* paws */}
      <ellipse cx="14" cy="42" rx="6" ry="2.4" fill="#5533AA" />
      <ellipse cx="34" cy="42" rx="6" ry="2.4" fill="#5533AA" />
    </SpriteFrame>
  );
}

// ─── DINO LINE ───────────────────────────────────────────────────────────────

export function DinkitSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* chubby baby dino body */}
      <ellipse cx="24" cy="30" rx="13" ry="12" fill="#55AA44" />
      <ellipse cx="24" cy="31" rx="10.5" ry="9.5" fill="#77CC55" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="6.5" ry="5.5" fill="#BBEEAA" />
      {/* stubby spines on head */}
      <path d="M19 17 L17 11 L21 14 Z" fill="#33883A" />
      <path d="M24 16 L23 10 L27 13 Z" fill="#55AA44" />
      <path d="M29 17 L31 11 L27 14 Z" fill="#33883A" />
      {/* round head */}
      <ellipse cx="24" cy="20" rx="11" ry="10" fill="#55AA44" />
      <ellipse cx="24" cy="21" rx="9" ry="8.5" fill="#77CC55" />
      {/* stubby tiny arms */}
      <path d="M12 29 Q7 27 7 32 Q10 34 13 32 Z" fill="#55AA44" />
      <path d="M36 29 Q41 27 41 32 Q38 34 35 32 Z" fill="#55AA44" />
      {/* stub tail */}
      <path d="M33 36 Q38 33 39 29 Q37 28 35 30 Q34 33 33 36 Z" fill="#44993A" />
      {/* feet */}
      <ellipse cx="17" cy="41" rx="4.5" ry="2" fill="#33883A" />
      <ellipse cx="31" cy="41" rx="4.5" ry="2" fill="#33883A" />
      <Face eyeY={19} eyeDx={4.8} eyeRx={3.2} eyeRy={3.8} iris="#1A3A10" blush="#99DD77" nose="#336A2A" />
    </SpriteFrame>
  );
}

export function RoarexSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* tiny wings (teen dino) */}
      <path d="M14 20 Q8 16 8 10 Q12 12 14 18 Z" fill="#3A9930" opacity="0.85" />
      <path d="M34 20 Q40 16 40 10 Q36 12 34 18 Z" fill="#3A9930" opacity="0.85" />
      {/* spine row on back */}
      <path d="M16 12 L14 6 L19 10 Z" fill="#2A7722" />
      <path d="M21 10 L20 4 L25 8 Z" fill="#3A9930" />
      <path d="M27 10 L27 3 L31 8 Z" fill="#2A7722" />
      <path d="M32 12 L34 6 L29 10 Z" fill="#3A9930" />
      {/* body */}
      <path d="M11 24 C11 14 16 9 24 9 C32 9 37 14 37 24 L37 34 C37 41 32 44 24 44 C16 44 11 41 11 34 Z" fill="#3A9930" />
      <path d="M14 25 C14 17 18 13 24 13 C30 13 34 17 34 25 L34 33 C34 39 30 42 24 42 C18 42 14 39 14 33 Z" fill="#5ABB44" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="8.5" ry="7" fill="#AADDAA" />
      {/* tail */}
      <path d="M33 38 Q42 34 44 26 L42 24 Q40 30 36 37 L33 40 Z" fill="#3A9930" />
      {/* feet */}
      <ellipse cx="16" cy="42.5" rx="5" ry="2.2" fill="#2A7722" />
      <ellipse cx="32" cy="42.5" rx="5" ry="2.2" fill="#2A7722" />
      <Face eyeY={21} eyeDx={5.8} eyeRx={3.8} eyeRy={4.2} iris="#152808" blush="#88CC66" mouth="fang" nose="#2A6622" />
    </SpriteFrame>
  );
}

export function TerrexSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000030">
      {/* massive spine fins */}
      <path d="M14 12 L12 3 L17 7 L19 2 L22 7 L24 3 L26 7 L29 2 L31 7 L35 3 L33 12 Z" fill="#2A7722" />
      <path d="M16 11 L15 5 L18.5 8 L20.5 4 L22.5 8 L24 5 L25.5 8 L27.5 4 L29.5 8 L33 5 L31 11 Z" fill="#5ABB44" opacity="0.6" />
      {/* powerful body */}
      <path d="M11 23 C11 12 16 7 24 7 C32 7 37 12 37 23 L37 35 C37 43 32 46 24 46 C16 46 11 43 11 35 Z" fill="#2A7722" />
      <path d="M14 24 C14 15 18 11 24 11 C30 11 34 15 34 24 L34 34 C34 41 30 44 24 44 C18 44 14 41 14 34 Z" fill="#3A9930" />
      {/* belly */}
      <ellipse cx="24" cy="35" rx="9.5" ry="8" fill="#99CC88" />
      {/* tiny arms */}
      <path d="M13 22 Q8 18 7 12 Q11 13 13 18 Z" fill="#2A7722" />
      <path d="M8 12 L7 9 L10 11 Z" fill="#AADDAA" opacity="0.6" />
      {/* powerful legs and tail */}
      <path d="M32 40 Q42 36 46 26 L44 24 Q42 30 38 37 L33 41 Z" fill="#2A7722" />
      <ellipse cx="15" cy="44" rx="6" ry="2.5" fill="#1A5514" />
      <ellipse cx="33" cy="44" rx="6" ry="2.5" fill="#1A5514" />
      <Face eyeY={21} eyeDx={6.5} eyeRx={4.5} eyeRy={5} iris="#0E2208" blush="#88CC66" mouth="fang" nose="#1A5514" />
      <Sparkle x={6} y={8} size={2.4} color="#AADDAA" opacity={0.7} />
    </SpriteFrame>
  );
}

// ─── ANGEL LINE ──────────────────────────────────────────────────────────────

export function HalowingSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* halo */}
      <ellipse cx="24" cy="10" rx="9" ry="3" fill="none" stroke="#FFD700" strokeWidth="2.2" opacity="0.9" />
      <ellipse cx="24" cy="10" rx="9" ry="3" fill="none" stroke="#FFF0A0" strokeWidth="1" opacity="0.7" />
      {/* tiny wings */}
      <path d="M17 24 Q8 20 8 12 Q13 14 16 20 Z" fill="#F8F8FF" opacity="0.9" />
      <path d="M31 24 Q40 20 40 12 Q35 14 32 20 Z" fill="#F8F8FF" opacity="0.9" />
      <path d="M15 22 Q9 16 10 12 Q13 15 14 20 Z" fill="#FFD700" opacity="0.3" />
      <path d="M33 22 Q39 16 38 12 Q35 15 34 20 Z" fill="#FFD700" opacity="0.3" />
      {/* white bird body */}
      <ellipse cx="24" cy="30" rx="12" ry="11" fill="#F0F0FF" />
      <ellipse cx="24" cy="31" rx="9.5" ry="9" fill="#FFFFFF" />
      {/* belly gold tint */}
      <ellipse cx="24" cy="34" rx="6" ry="5" fill="#FFF8E0" />
      {/* beak */}
      <path d="M24 26 L22 29 L26 29 Z" fill="#FFB844" />
      {/* tiny feet */}
      <ellipse cx="19" cy="41" rx="4" ry="1.8" fill="#FFD700" opacity="0.9" />
      <ellipse cx="29" cy="41" rx="4" ry="1.8" fill="#FFD700" opacity="0.9" />
      <Face eyeY={25} eyeDx={4.5} eyeRx={3} eyeRy={3.5} iris="#2A2A5A" blush="#FFD9A0" nose="#CC9922" />
      <Sparkle x={7} y={8} size={2.2} color="#FFD700" opacity={0.8} />
      <Sparkle x={41} y={8} size={2} color="#FFD700" opacity={0.75} />
    </SpriteFrame>
  );
}

export function WingardSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* halo — larger */}
      <ellipse cx="24" cy="9" rx="12" ry="3.5" fill="none" stroke="#FFD700" strokeWidth="2.5" opacity="0.9" />
      <ellipse cx="24" cy="9" rx="12" ry="3.5" fill="none" stroke="#FFF0A0" strokeWidth="1.2" opacity="0.65" />
      <Sparkle x={16} y={9} size={1.8} color="#FFD700" opacity={0.8} />
      <Sparkle x={32} y={9} size={1.8} color="#FFD700" opacity={0.8} />
      {/* full wings spread */}
      <path d="M17 22 Q6 16 5 7 Q11 9 16 17 Z" fill="#E8E8FF" opacity="0.92" />
      <path d="M14 18 Q7 12 8 8 Q12 10 13 16 Z" fill="#FFD700" opacity="0.3" />
      <path d="M31 22 Q42 16 43 7 Q37 9 32 17 Z" fill="#E8E8FF" opacity="0.92" />
      <path d="M34 18 Q41 12 40 8 Q36 10 35 16 Z" fill="#FFD700" opacity="0.3" />
      {/* body */}
      <path d="M13 24 C13 15 17 10 24 10 C31 10 35 15 35 24 L35 34 C35 40 31 43 24 43 C17 43 13 40 13 34 Z" fill="#E8E8FF" />
      <path d="M16 25 C16 18 19 14 24 14 C29 14 32 18 32 25 L32 33 C32 38 29 41 24 41 C19 41 16 38 16 33 Z" fill="#FFFFFF" />
      {/* belly gold tint */}
      <ellipse cx="24" cy="34" rx="7" ry="6" fill="#FFF4CC" />
      {/* beak */}
      <path d="M24 24 L22 27 L26 27 Z" fill="#FFB844" />
      {/* feet */}
      <ellipse cx="17" cy="42" rx="5" ry="2.2" fill="#FFD700" opacity="0.9" />
      <ellipse cx="31" cy="42" rx="5" ry="2.2" fill="#FFD700" opacity="0.9" />
      <Face eyeY={22} eyeDx={5} eyeRx={3.4} eyeRy={4} iris="#1A1A4A" blush="#FFD9A0" nose="#CC9922" />
    </SpriteFrame>
  );
}

export function SeraphonSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* massive golden halo */}
      <ellipse cx="24" cy="8" rx="17" ry="4.5" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.9" />
      <ellipse cx="24" cy="8" rx="17" ry="4.5" fill="none" stroke="#FFF0A0" strokeWidth="1.5" opacity="0.7" />
      <Sparkle x={8} y={8} size={2.4} color="#FFD700" opacity={0.9} />
      <Sparkle x={40} y={8} size={2.4} color="#FFD700" opacity={0.9} />
      <Sparkle x={24} y={4} size={2} color="#FFFFFF" opacity={0.85} />
      {/* multiple wings — three pairs */}
      <path d="M15 22 Q3 14 2 5 Q9 8 14 18 Z" fill="#D8D8FF" opacity="0.88" />
      <path d="M17 28 Q5 26 4 36 Q10 34 16 30 Z" fill="#E8E8FF" opacity="0.85" />
      <path d="M33 22 Q45 14 46 5 Q39 8 34 18 Z" fill="#D8D8FF" opacity="0.88" />
      <path d="M31 28 Q43 26 44 36 Q38 34 32 30 Z" fill="#E8E8FF" opacity="0.85" />
      {/* gold trim on wings */}
      <path d="M15 22 Q7 15 6 9 Q10 12 14 19 Z" fill="#FFD700" opacity="0.25" />
      <path d="M33 22 Q41 15 42 9 Q38 12 34 19 Z" fill="#FFD700" opacity="0.25" />
      {/* body */}
      <path d="M14 23 C14 14 18 9 24 9 C30 9 34 14 34 23 L34 34 C34 41 30 44 24 44 C18 44 14 41 14 34 Z" fill="#D8D8FF" />
      <path d="M17 24 C17 17 20 13 24 13 C28 13 31 17 31 24 L31 33 C31 38 28 41 24 41 C20 41 17 38 17 33 Z" fill="#F5F5FF" />
      {/* belly gold */}
      <ellipse cx="24" cy="34" rx="7.5" ry="6.5" fill="#FFF4CC" />
      {/* gold chest emblem */}
      <Sparkle x={24} y={25} size={3.2} color="#FFD700" opacity={0.9} />
      {/* beak */}
      <path d="M24 22 L22 25 L26 25 Z" fill="#FFB844" />
      {/* feet */}
      <ellipse cx="16" cy="42.5" rx="5.5" ry="2.2" fill="#FFD700" opacity="0.9" />
      <ellipse cx="32" cy="42.5" rx="5.5" ry="2.2" fill="#FFD700" opacity="0.9" />
      <Face eyeY={20} eyeDx={5} eyeRx={3.5} eyeRy={4} iris="#0A0A2A" blush="#FFD9A0" mouth="serious" nose="#BB8811" />
    </SpriteFrame>
  );
}

// ─── CANDY LINE ──────────────────────────────────────────────────────────────

export function SweetletSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* candy swirl blob */}
      <ellipse cx="24" cy="29" rx="13.5" ry="12.5" fill="#FF99CC" />
      <ellipse cx="24" cy="30" rx="11" ry="10.5" fill="#FFBBDD" />
      {/* candy swirl pattern */}
      <path d="M20 24 Q24 21 28 24 Q26 28 24 30 Q22 28 20 24 Z" fill="#FF77AA" opacity="0.5" />
      <path d="M21 25 Q24 23 27 25" stroke="#FF55AA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M21 27 Q24 26 27 27" stroke="#FF55AA" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* candy swirl on top */}
      <path d="M24 16 Q20 12 22 8 Q26 7 27 11 Q25 14 24 16 Z" fill="#FF77AA" opacity="0.8" />
      <path d="M24 16 Q28 12 26 8" stroke="#FF55AA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* tiny candy sprinkles */}
      <rect x="16" y="24" width="2.5" height="1" rx="0.5" fill="#FF4488" opacity="0.8" transform="rotate(-20 16 24)" />
      <rect x="30" y="22" width="2.5" height="1" rx="0.5" fill="#55AAFF" opacity="0.8" transform="rotate(15 30 22)" />
      <rect x="19" y="34" width="2.5" height="1" rx="0.5" fill="#FFEE44" opacity="0.8" transform="rotate(-10 19 34)" />
      <rect x="29" y="33" width="2.5" height="1" rx="0.5" fill="#44DDAA" opacity="0.8" transform="rotate(25 29 33)" />
      {/* nubby arms */}
      <ellipse cx="12" cy="31" rx="4" ry="3" fill="#FF99CC" />
      <ellipse cx="36" cy="31" rx="4" ry="3" fill="#FF99CC" />
      {/* base */}
      <ellipse cx="18" cy="41" rx="4.5" ry="2" fill="#FF77AA" />
      <ellipse cx="30" cy="41" rx="4.5" ry="2" fill="#FF77AA" />
      <Face eyeY={26} eyeDx={4.5} eyeRx={3} eyeRy={3.5} iris="#552233" blush="#FFBBCC" nose="#CC4488" />
    </SpriteFrame>
  );
}

export function SugarpawSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* lollipop tail */}
      <path d="M33 35 Q40 30 42 24" stroke="#FF5599" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="23" r="4.5" fill="#FF77BB" />
      <circle cx="42" cy="23" r="3" fill="#FF99CC" />
      <path d="M40 21 Q42 23 44 21" stroke="#FF5599" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* candy cat body */}
      <path d="M12 24 C12 15 17 10 24 10 C31 10 36 15 36 24 L36 33 C36 39 31 42 24 42 C17 42 12 39 12 33 Z" fill="#FF99CC" />
      <path d="M15 25 C15 18 18 14 24 14 C30 14 33 18 33 25 L33 32 C33 37 30 40 24 40 C18 40 15 37 15 32 Z" fill="#FFBBDD" />
      {/* rainbow pastel belly */}
      <ellipse cx="24" cy="32" rx="7.5" ry="6.5" fill="#FFE8F4" />
      {/* candy stripe pattern on body */}
      <path d="M16 24 Q17 28 16 32" stroke="#FF5599" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M32 24 Q31 28 32 32" stroke="#FF5599" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* cat ears */}
      <path d="M14 14 L11 5 L18 8 L17 14 Z" fill="#FF88BB" />
      <path d="M34 14 L37 5 L30 8 L31 14 Z" fill="#FF88BB" />
      <path d="M14.5 13 L12.5 7 L16.5 9.5 L16 13 Z" fill="#FFD0E8" />
      <path d="M33.5 13 L35.5 7 L31.5 9.5 L32 13 Z" fill="#FFD0E8" />
      {/* sprinkle marks */}
      <rect x="18" y="26" width="2" height="0.9" rx="0.45" fill="#55AAFF" opacity="0.8" transform="rotate(-15 18 26)" />
      <rect x="28" y="24" width="2" height="0.9" rx="0.45" fill="#FFEE44" opacity="0.8" transform="rotate(20 28 24)" />
      <rect x="22" y="31" width="2" height="0.9" rx="0.45" fill="#44DDAA" opacity="0.8" transform="rotate(-5 22 31)" />
      {/* paws */}
      <ellipse cx="16" cy="41" rx="5" ry="2.2" fill="#FF66AA" />
      <ellipse cx="32" cy="41" rx="5" ry="2.2" fill="#FF66AA" />
      <Face eyeY={22} eyeDx={5.2} eyeRx={3.4} eyeRy={4} iris="#441122" blush="#FFCCDD" nose="#CC3377" />
    </SpriteFrame>
  );
}

export function CandrixSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* rainbow scale aura */}
      <ellipse cx="24" cy="26" rx="21" ry="18" fill="#FF88CC" opacity="0.1" />
      {/* candy wings */}
      <path d="M16 22 Q5 14 4 6 Q10 8 15 16 Z" fill="#FF99CC" opacity="0.85" />
      <path d="M12 16 Q6 10 7 6 Q11 9 12 14 Z" fill="#FF55AA" opacity="0.5" />
      <path d="M32 22 Q43 14 44 6 Q38 8 33 16 Z" fill="#FF99CC" opacity="0.85" />
      <path d="M36 16 Q42 10 41 6 Q37 9 36 14 Z" fill="#55BBFF" opacity="0.5" />
      {/* rainbow wing highlights */}
      <path d="M8 8 Q11 12 13 16" stroke="#FFEE44" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M40 8 Q37 12 35 16" stroke="#44DDAA" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* dragon body — candy rainbow scales */}
      <path d="M12 23 C12 13 17 8 24 8 C31 8 36 13 36 23 L36 34 C36 41 31 44 24 44 C17 44 12 41 12 34 Z" fill="#CC2277" />
      <path d="M15 24 C15 16 18 12 24 12 C30 12 33 16 33 24 L33 33 C33 39 30 42 24 42 C18 42 15 39 15 33 Z" fill="#FF66AA" />
      {/* rainbow scale pattern */}
      <path d="M18 20 L21 17 L24 20 L21 23 Z" fill="#FF5599" opacity="0.7" />
      <path d="M22 18 L25 15 L28 18 L25 21 Z" fill="#55BBFF" opacity="0.6" />
      <path d="M26 20 L29 17 L32 20 L29 23 Z" fill="#FFEE44" opacity="0.6" />
      <path d="M19 24 L22 21 L25 24 L22 27 Z" fill="#44DDAA" opacity="0.6" />
      <path d="M25 24 L28 21 L31 24 L28 27 Z" fill="#CC88FF" opacity="0.6" />
      {/* belly — rainbow */}
      <ellipse cx="24" cy="34" rx="8.5" ry="7" fill="#FFE0F0" />
      {/* horns */}
      <path d="M18 10 L15 3 L20 7 Z" fill="#FFEE44" />
      <path d="M30 10 L33 3 L28 7 Z" fill="#55BBFF" />
      {/* candy tail */}
      <path d="M32 38 Q40 33 44 26 Q42 24 40 26 Q38 32 34 37 Z" fill="#CC2277" />
      <path d="M42 25 L44 21 L46 26 Z" fill="#FF99CC" opacity="0.8" />
      {/* paws */}
      <ellipse cx="15" cy="42" rx="5.5" ry="2.2" fill="#991155" />
      <ellipse cx="33" cy="42" rx="5.5" ry="2.2" fill="#991155" />
      <Face eyeY={21} eyeDx={5.8} eyeRx={3.8} eyeRy={4.3} iris="#330011" blush="#FFBBCC" mouth="fang" nose="#992255" />
      <Sparkle x={7} y={10} size={2.4} color="#FFEE44" opacity={0.85} />
      <Sparkle x={41} y={10} size={2.4} color="#55BBFF" opacity={0.8} />
    </SpriteFrame>
  );
}

// ─── MUSIC LINE ──────────────────────────────────────────────────────────────

export function LyritoSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* note-shaped body */}
      <ellipse cx="22" cy="30" rx="11" ry="10" fill="#5588FF" />
      <ellipse cx="22" cy="31" rx="8.5" ry="8" fill="#77AAFF" />
      {/* note stem */}
      <rect x="31.5" y="12" width="2.5" height="18" rx="1.2" fill="#4466DD" />
      {/* note flag */}
      <path d="M34 12 Q40 14 38 20 Q36 18 34 20 Z" fill="#4466DD" />
      {/* note head */}
      <ellipse cx="32" cy="30" rx="5" ry="4" fill="#5588FF" transform="rotate(-15 32 30)" />
      <ellipse cx="32" cy="30" rx="3.5" ry="2.8" fill="#77AAFF" opacity="0.7" transform="rotate(-15 32 30)" />
      {/* round ear nubs */}
      <circle cx="13" cy="22" r="4" fill="#5588FF" />
      <circle cx="13" cy="22" r="2.5" fill="#99CCFF" />
      {/* belly glow */}
      <ellipse cx="22" cy="33" rx="5.5" ry="4.5" fill="#C0D8FF" />
      {/* tiny musical notes floating */}
      <text x="7" y="14" fontSize="5" fill="#7799EE" opacity="0.75" fontFamily="Arial">♪</text>
      <text x="39" y="10" fontSize="4" fill="#7799EE" opacity="0.65" fontFamily="Arial">♩</text>
      {/* paws */}
      <ellipse cx="16" cy="40" rx="4.5" ry="2" fill="#3355CC" />
      <ellipse cx="28" cy="40" rx="4.5" ry="2" fill="#3355CC" />
      <Face eyeY={26} eyeDx={4.5} eyeRx={3} eyeRy={3.5} iris="#1A224A" blush="#99CCFF" nose="#3355CC" />
    </SpriteFrame>
  );
}

export function MelodewSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* musical note wings */}
      <path d="M17 22 Q7 15 7 7 Q12 10 16 18 Z" fill="#4466DD" opacity="0.85" />
      <path d="M12 14 Q8 9 9 6 Q12 9 13 14 Z" fill="#99CCFF" opacity="0.6" />
      <path d="M31 22 Q41 15 41 7 Q36 10 32 18 Z" fill="#4466DD" opacity="0.85" />
      <path d="M36 14 Q40 9 39 6 Q36 9 35 14 Z" fill="#99CCFF" opacity="0.6" />
      {/* note pattern on wings */}
      <text x="7" y="13" fontSize="4" fill="#99CCFF" opacity="0.7" fontFamily="Arial">♪</text>
      <text x="36" y="13" fontSize="4" fill="#99CCFF" opacity="0.7" fontFamily="Arial">♩</text>
      {/* bird body */}
      <path d="M13 24 C13 15 17 10 24 10 C31 10 35 15 35 24 L35 33 C35 39 31 42 24 42 C17 42 13 39 13 33 Z" fill="#3355BB" />
      <path d="M16 25 C16 18 19 14 24 14 C29 14 32 18 32 25 L32 32 C32 37 29 40 24 40 C19 40 16 37 16 32 Z" fill="#5588FF" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="7" ry="6" fill="#AACCFF" />
      {/* beak */}
      <path d="M24 23 L22 26 L26 26 Z" fill="#FFB844" />
      {/* tail feathers with note shapes */}
      <path d="M19 40 Q16 46 14 45 Q15 42 18 40 Z" fill="#4466DD" />
      <path d="M24 41 Q24 47 21 46 Q22 43 24 41 Z" fill="#3355BB" />
      <path d="M29 40 Q32 46 34 45 Q33 42 30 40 Z" fill="#4466DD" />
      {/* floating notes around body */}
      <text x="8" y="26" fontSize="5" fill="#7799EE" opacity="0.7" fontFamily="Arial">♫</text>
      <text x="39" y="30" fontSize="4" fill="#7799EE" opacity="0.65" fontFamily="Arial">♪</text>
      {/* feet */}
      <ellipse cx="17" cy="42" rx="4.5" ry="2" fill="#2244AA" />
      <ellipse cx="31" cy="42" rx="4.5" ry="2" fill="#2244AA" />
      <Face eyeY={22} eyeDx={5} eyeRx={3.3} eyeRy={3.8} iris="#0A1A3A" blush="#AACCFF" nose="#3355BB" />
    </SpriteFrame>
  );
}

export function SymphoxSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002C">
      {/* sound wave mane rings */}
      <ellipse cx="24" cy="20" rx="18" ry="6" fill="none" stroke="#7799FF" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="24" cy="20" rx="14" ry="4.5" fill="none" stroke="#AACCFF" strokeWidth="1.2" opacity="0.4" />
      {/* large wings */}
      <path d="M15 22 Q3 14 2 5 Q9 8 14 18 Z" fill="#2244AA" opacity="0.9" />
      <path d="M11 15 Q5 9 5 5 Q9 8 11 14 Z" fill="#7799FF" opacity="0.5" />
      <path d="M33 22 Q45 14 46 5 Q39 8 34 18 Z" fill="#2244AA" opacity="0.9" />
      <path d="M37 15 Q43 9 43 5 Q39 8 37 14 Z" fill="#7799FF" opacity="0.5" />
      {/* majestic fox body */}
      <path d="M13 23 C13 13 17 8 24 8 C31 8 35 13 35 23 L35 34 C35 41 31 44 24 44 C17 44 13 41 13 34 Z" fill="#2244AA" />
      <path d="M16 24 C16 16 19 12 24 12 C29 12 32 16 32 24 L32 33 C32 39 29 42 24 42 C18 42 16 39 16 33 Z" fill="#5588EE" />
      {/* sound wave mane on chest */}
      <ellipse cx="24" cy="28" rx="8" ry="4" fill="none" stroke="#AACCFF" strokeWidth="1.3" opacity="0.6" />
      <ellipse cx="24" cy="28" rx="5.5" ry="2.5" fill="none" stroke="#7799FF" strokeWidth="1" opacity="0.5" />
      <ellipse cx="24" cy="28" rx="3" ry="1.5" fill="#CCDDFF" opacity="0.7" />
      {/* belly */}
      <ellipse cx="24" cy="34" rx="8" ry="6.5" fill="#AACCFF" opacity="0.7" />
      {/* fox ears with note tips */}
      <path d="M14 13 L11 4 L18 7 L17 13 Z" fill="#2244AA" />
      <path d="M34 13 L37 4 L30 7 L31 13 Z" fill="#2244AA" />
      <path d="M14.5 12 L12.5 6 L16.5 8.5 L16 12 Z" fill="#7799FF" opacity="0.7" />
      <path d="M33.5 12 L35.5 6 L31.5 8.5 L32 12 Z" fill="#7799FF" opacity="0.7" />
      {/* musical tail — multi-note */}
      <path d="M32 38 Q40 33 44 25 Q42 23 40 25 Q39 31 35 37 Z" fill="#2244AA" />
      <text x="39" y="23" fontSize="4.5" fill="#AACCFF" opacity="0.85" fontFamily="Arial">♫</text>
      {/* floating notes */}
      <text x="5" y="15" fontSize="5" fill="#7799FF" opacity="0.75" fontFamily="Arial">♪</text>
      <text x="42" y="19" fontSize="4" fill="#7799FF" opacity="0.7" fontFamily="Arial">♩</text>
      {/* paws */}
      <ellipse cx="16" cy="42.5" rx="5.5" ry="2.2" fill="#1A3388" />
      <ellipse cx="32" cy="42.5" rx="5.5" ry="2.2" fill="#1A3388" />
      <Face eyeY={22} eyeDx={5.8} eyeRx={3.8} eyeRy={4.3} iris="#0A1830" blush="#AACCFF" mouth="serious" nose="#3366BB" />
    </SpriteFrame>
  );
}

// ─── DARK LINE ───────────────────────────────────────────────────────────────

export function ShadaowolfSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* small black wolf pup body */}
      <ellipse cx="24" cy="30" rx="13" ry="12" fill="#1A1A2A" />
      <ellipse cx="24" cy="31" rx="10.5" ry="9.5" fill="#2A2A3A" />
      {/* belly — dark gray */}
      <ellipse cx="24" cy="34" rx="6.5" ry="5.5" fill="#3A3A4A" />
      {/* wolf ears */}
      <path d="M14 17 L11 8 L18 11 L17 17 Z" fill="#1A1A2A" />
      <path d="M34 17 L37 8 L30 11 L31 17 Z" fill="#1A1A2A" />
      <path d="M14.5 16 L12.5 10 L16.5 12 L16 16 Z" fill="#2A2A3A" />
      <path d="M33.5 16 L35.5 10 L31.5 12 L32 16 Z" fill="#2A2A3A" />
      {/* silver eyes */}
      <ellipse cx="19" cy="26" rx="3.2" ry="3.6" fill="#050510" />
      <ellipse cx="29" cy="26" rx="3.2" ry="3.6" fill="#050510" />
      <ellipse cx="19" cy="26" rx="2" ry="2.3" fill="#CCCCFF" opacity="0.95" />
      <ellipse cx="29" cy="26" rx="2" ry="2.3" fill="#CCCCFF" opacity="0.95" />
      <ellipse cx="18.5" cy="25" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="28.5" cy="25" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.8" />
      {/* pup snout */}
      <ellipse cx="24" cy="30.5" rx="2.2" ry="1.5" fill="#111120" opacity="0.9" />
      {/* tiny smile */}
      <path d="M22 32.5 Q24 34.5 26 32.5" stroke="#444460" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* blush */}
      <ellipse cx="15" cy="29" rx="2.4" ry="1.2" fill="#6666AA" opacity="0.4" />
      <ellipse cx="33" cy="29" rx="2.4" ry="1.2" fill="#6666AA" opacity="0.4" />
      {/* paws */}
      <ellipse cx="16" cy="41" rx="4.5" ry="2" fill="#111120" />
      <ellipse cx="32" cy="41" rx="4.5" ry="2" fill="#111120" />
      {/* shadow tail */}
      <path d="M33 36 Q40 32 41 26 Q39 25 37 27 Q36 31 33 36 Z" fill="#1A1A2A" />
    </SpriteFrame>
  );
}

export function NightfangSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000025">
      {/* star pattern fur markings */}
      <Sparkle x={19} y={26} size={1.8} color="#8888CC" opacity={0.7} />
      <Sparkle x={29} y={24} size={1.5} color="#AAAADD" opacity={0.65} />
      <Sparkle x={24} y={30} size={1.6} color="#8888CC" opacity={0.65} />
      {/* body */}
      <path d="M12 25 C12 15 17 10 24 10 C31 10 36 15 36 25 L36 34 C36 40 31 43 24 43 C17 43 12 40 12 34 Z" fill="#111122" />
      <path d="M15 26 C15 18 18 14 24 14 C30 14 33 18 33 26 L33 33 C33 38 30 41 24 41 C18 41 15 38 15 33 Z" fill="#22223A" />
      {/* belly */}
      <ellipse cx="24" cy="33" rx="7.5" ry="6.5" fill="#333344" />
      {/* wolf ears */}
      <path d="M13 14 L10 4 L18 8 L17 14 Z" fill="#111122" />
      <path d="M35 14 L38 4 L30 8 L31 14 Z" fill="#111122" />
      <path d="M13.5 13 L11.5 6 L16.5 9 L16 13 Z" fill="#334488" opacity="0.7" />
      <path d="M34.5 13 L36.5 6 L31.5 9 L32 13 Z" fill="#334488" opacity="0.7" />
      {/* constellation body spots */}
      <circle cx="18" cy="24" r="1" fill="#8888CC" opacity="0.8" />
      <circle cx="30" cy="22" r="0.9" fill="#AAAAEE" opacity="0.75" />
      <circle cx="23" cy="20" r="0.8" fill="#8888CC" opacity="0.7" />
      <circle cx="26" cy="28" r="0.9" fill="#AAAAEE" opacity="0.7" />
      {/* star tail */}
      <path d="M33 37 Q41 33 44 26 Q42 24 40 26 Q38 32 34 37 Z" fill="#111122" />
      <Sparkle x={41} y={25} size={1.8} color="#8888CC" opacity={0.75} />
      {/* paws */}
      <ellipse cx="16" cy="41.5" rx="5" ry="2.2" fill="#0A0A18" />
      <ellipse cx="32" cy="41.5" rx="5" ry="2.2" fill="#0A0A18" />
      {/* silver glowing eyes */}
      <ellipse cx="18" cy="22" rx="3.8" ry="4.2" fill="#05050F" />
      <ellipse cx="30" cy="22" rx="3.8" ry="4.2" fill="#05050F" />
      <ellipse cx="18" cy="22" rx="2.3" ry="2.7" fill="#BBBBFF" opacity="0.95" />
      <ellipse cx="30" cy="22" rx="2.3" ry="2.7" fill="#BBBBFF" opacity="0.95" />
      <ellipse cx="17.5" cy="20.8" rx="0.9" ry="0.9" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="29.5" cy="20.8" rx="0.9" ry="0.9" fill="#FFFFFF" opacity="0.8" />
      <path d="M21 29 Q24 31 27 29" stroke="#445588" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

export function VoidhowlSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002E">
      {/* constellation body — stars connected by lines */}
      <Sparkle x={17} y={24} size={2.2} color="#AAAAFF" opacity={0.85} />
      <Sparkle x={31} y={22} size={2} color="#8888CC" opacity={0.8} />
      <Sparkle x={24} y={30} size={2.4} color="#CCCCFF" opacity={0.9} />
      <Sparkle x={15} y={31} size={1.8} color="#AAAAFF" opacity={0.75} />
      <Sparkle x={33} y={31} size={1.8} color="#8888CC" opacity={0.75} />
      <path d="M17 24 L24 30 L31 22" stroke="#6666AA" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M24 30 L15 31 L33 31" stroke="#6666AA" strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* crescent moon collar */}
      <path d="M18 22 Q24 18 30 22 Q28 25 24 26 Q20 25 18 22 Z" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
      <Sparkle x={24} y={22} size={1.8} color="#FFD700" opacity={0.9} />
      {/* wings of shadow */}
      <path d="M12 24 Q4 17 3 9 Q9 11 13 20 Z" fill="#0A0A1A" />
      <path d="M36 24 Q44 17 45 9 Q39 11 35 20 Z" fill="#0A0A1A" />
      {/* large body */}
      <path d="M12 23 C12 12 17 7 24 7 C31 7 36 12 36 23 L36 35 C36 42 31 45 24 45 C17 45 12 42 12 35 Z" fill="#0A0A1A" />
      <path d="M15 24 C15 15 18 11 24 11 C30 11 33 15 33 24 L33 34 C33 40 30 43 24 43 C18 43 15 40 15 34 Z" fill="#18183A" />
      {/* belly void */}
      <ellipse cx="24" cy="35" rx="8.5" ry="7" fill="#111128" />
      {/* large ears */}
      <path d="M13 13 L10 3 L18 7 L17 13 Z" fill="#0A0A1A" />
      <path d="M35 13 L38 3 L30 7 L31 13 Z" fill="#0A0A1A" />
      <path d="M13.5 12 L11.5 5 L16.5 8 L16 12 Z" fill="#3333AA" opacity="0.6" />
      <path d="M34.5 12 L36.5 5 L31.5 8 L32 12 Z" fill="#3333AA" opacity="0.6" />
      {/* constellation tail */}
      <path d="M32 39 Q42 35 46 25 L44 23 Q42 30 38 37 L32 41 Z" fill="#0A0A1A" />
      <Sparkle x={42} y={26} size={2} color="#AAAAFF" opacity={0.8} />
      {/* powerful legs */}
      <ellipse cx="16" cy="43.5" rx="6" ry="2.4" fill="#050510" />
      <ellipse cx="32" cy="43.5" rx="6" ry="2.4" fill="#050510" />
      {/* vivid glowing silver eyes */}
      <ellipse cx="18" cy="21" rx="4.5" ry="5" fill="#02020A" />
      <ellipse cx="30" cy="21" rx="4.5" ry="5" fill="#02020A" />
      <ellipse cx="18" cy="21" rx="3" ry="3.5" fill="#DDDDFF" opacity="0.95" />
      <ellipse cx="30" cy="21" rx="3" ry="3.5" fill="#DDDDFF" opacity="0.95" />
      <ellipse cx="17.5" cy="19.8" rx="1.1" ry="1.1" fill="#FFFFFF" opacity="0.85" />
      <ellipse cx="29.5" cy="19.8" rx="1.1" ry="1.1" fill="#FFFFFF" opacity="0.85" />
      <ellipse cx="18" cy="21" rx="5" ry="5.5" fill="#BBBBFF" opacity="0.18" />
      <ellipse cx="30" cy="21" rx="5" ry="5.5" fill="#BBBBFF" opacity="0.18" />
      <path d="M21 31 L27 31" stroke="#445588" strokeWidth="2" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// ─── MECH LINE ───────────────────────────────────────────────────────────────

export function BoltchickSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* small robot bird body */}
      <ellipse cx="24" cy="30" rx="12" ry="11" fill="#8899AA" />
      <ellipse cx="24" cy="31" rx="9.5" ry="8.5" fill="#AABBCC" />
      {/* belly panel */}
      <rect x="19" y="28" width="10" height="9" rx="2.5" fill="#778899" />
      <rect x="20" y="29" width="8" height="7" rx="2" fill="#99AABB" opacity="0.7" />
      {/* LED eyes */}
      <ellipse cx="20" cy="25" rx="3" ry="3" fill="#001122" />
      <ellipse cx="28" cy="25" rx="3" ry="3" fill="#001122" />
      <ellipse cx="20" cy="25" rx="2" ry="2" fill="#00FFCC" opacity="0.95" />
      <ellipse cx="28" cy="25" rx="2" ry="2" fill="#00FFCC" opacity="0.95" />
      <ellipse cx="19.5" cy="24.3" rx="0.7" ry="0.7" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="27.5" cy="24.3" rx="0.7" ry="0.7" fill="#FFFFFF" opacity="0.7" />
      {/* glow */}
      <ellipse cx="20" cy="25" rx="3.5" ry="3.5" fill="#00FFCC" opacity="0.2" />
      <ellipse cx="28" cy="25" rx="3.5" ry="3.5" fill="#00FFCC" opacity="0.2" />
      {/* beak */}
      <path d="M24 29 L22 32 L26 32 Z" fill="#FFCC44" />
      {/* robot ear-wings */}
      <rect x="10" y="22" width="6" height="4" rx="1.5" fill="#667788" />
      <rect x="38" y="22" width="6" height="4" rx="1.5" fill="#667788" />
      <rect x="11" y="23" width="4" height="2" rx="1" fill="#00FFCC" opacity="0.5" />
      <rect x="39" y="23" width="4" height="2" rx="1" fill="#00FFCC" opacity="0.5" />
      {/* tiny feet */}
      <rect x="18" y="40" width="5" height="2.5" rx="1" fill="#556677" />
      <rect x="27" y="40" width="5" height="2.5" rx="1" fill="#556677" />
    </SpriteFrame>
  );
}

export function GearbotSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* gear chest */}
      <circle cx="24" cy="29" r="8.5" fill="#556677" />
      <circle cx="24" cy="29" r="6.5" fill="#7A8890" />
      {/* gear teeth */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = angle * Math.PI / 180;
        return <rect key={i} x={24 + Math.cos(rad)*8 - 1.2} y={29 + Math.sin(rad)*8 - 1.2} width="2.4" height="2.4" fill="#556677" transform={`rotate(${angle} ${24 + Math.cos(rad)*8} ${29 + Math.sin(rad)*8})`} />;
      })}
      <circle cx="24" cy="29" r="4" fill="#445566" />
      <circle cx="24" cy="29" r="2.5" fill="#00FFCC" opacity="0.9" />
      <ellipse cx="24" cy="29" r="8.5" fill="#00FFCC" opacity="0.12" />
      {/* robot body */}
      <path d="M13 22 C13 13 17 8 24 8 C31 8 35 13 35 22 L35 32 C35 39 31 42 24 42 C17 42 13 39 13 32 Z" fill="#667788" />
      <path d="M16 23 C16 16 19 12 24 12 C29 12 32 16 32 23 L32 32 C32 37 29 40 24 40 C19 40 16 37 16 32 Z" fill="#8899AA" />
      {/* shoulder armor plates */}
      <rect x="9" y="20" width="7" height="5" rx="2" fill="#556677" />
      <rect x="38" y="20" width="7" height="5" rx="2" fill="#556677" />
      {/* forearm */}
      <rect x="8" y="24" width="5" height="8" rx="2" fill="#7A8890" />
      <rect x="41" y="24" width="5" height="8" rx="2" fill="#7A8890" />
      {/* claw fingers */}
      <path d="M8 31 L6 34" stroke="#445566" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 32 L9 35" stroke="#445566" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 31 L12 34" stroke="#445566" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 31 L42 34" stroke="#445566" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 32 L44 35" stroke="#445566" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 31 L44 34" stroke="#445566" strokeWidth="1.5" strokeLinecap="round" />
      {/* head */}
      <rect x="15" y="9" width="18" height="14" rx="4" fill="#667788" />
      <rect x="17" y="11" width="14" height="10" rx="3" fill="#8899AA" />
      {/* LED eyes */}
      <rect x="18" y="13" width="5" height="4" rx="1.5" fill="#001122" />
      <rect x="27" y="13" width="5" height="4" rx="1.5" fill="#001122" />
      <rect x="19" y="14" width="3" height="2.5" rx="0.8" fill="#00FFCC" opacity="0.95" />
      <rect x="28" y="14" width="3" height="2.5" rx="0.8" fill="#00FFCC" opacity="0.95" />
      {/* antenna */}
      <path d="M24 9 L24 5" stroke="#556677" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="4.5" r="1.8" fill="#00FFCC" opacity="0.9" />
      {/* feet */}
      <rect x="15" y="40" width="6" height="3.5" rx="1.5" fill="#445566" />
      <rect x="27" y="40" width="6" height="3.5" rx="1.5" fill="#445566" />
    </SpriteFrame>
  );
}

export function TitanmechSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002E">
      {/* propulsion jets */}
      <path d="M14 40 L10 46 L18 44 Z" fill="#FF7722" opacity="0.8" />
      <path d="M34 40 L38 46 L30 44 Z" fill="#FF7722" opacity="0.8" />
      <path d="M14 40 L11 45 L16 44 Z" fill="#FFCC44" opacity="0.6" />
      <path d="M34 40 L37 45 L32 44 Z" fill="#FFCC44" opacity="0.6" />
      {/* massive shoulder pauldrons */}
      <path d="M7 18 L5 12 L12 14 L14 22 Z" fill="#445566" />
      <path d="M8 18 L7 14 L12 15 L13 21 Z" fill="#6677AA" opacity="0.6" />
      <path d="M41 18 L43 12 L36 14 L34 22 Z" fill="#445566" />
      <path d="M40 18 L41 14 L36 15 L35 21 Z" fill="#6677AA" opacity="0.6" />
      {/* weapon arms */}
      <rect x="5" y="22" width="8" height="12" rx="2" fill="#556677" />
      <rect x="39" y="22" width="8" height="12" rx="2" fill="#556677" />
      {/* cannons on arms */}
      <rect x="3" y="25" width="5" height="4" rx="1.5" fill="#334455" />
      <rect x="3.5" y="26" width="3" height="2" rx="0.8" fill="#00FFCC" opacity="0.6" />
      <rect x="44" y="25" width="5" height="4" rx="1.5" fill="#334455" />
      <rect x="44.5" y="26" width="3" height="2" rx="0.8" fill="#00FFCC" opacity="0.6" />
      {/* massive body */}
      <path d="M13 22 C13 11 17 6 24 6 C31 6 35 11 35 22 L35 38 C35 44 31 47 24 47 C17 47 13 44 13 38 Z" fill="#445566" />
      <path d="M16 23 C16 14 19 10 24 10 C29 10 32 14 32 23 L32 37 C32 42 29 45 24 45 C19 45 16 42 16 37 Z" fill="#667788" />
      {/* chest reactor */}
      <ellipse cx="24" cy="29" rx="8" ry="7" fill="#334455" />
      <ellipse cx="24" cy="29" rx="5.5" ry="5" fill="#445566" />
      <ellipse cx="24" cy="29" rx="3.5" ry="3.2" fill="#00FFCC" opacity="0.85" />
      <ellipse cx="24" cy="29" rx="8.5" ry="7.5" fill="#00FFCC" opacity="0.15" />
      {/* head — visor */}
      <rect x="14" y="7" width="20" height="15" rx="4" fill="#445566" />
      <rect x="16" y="9" width="16" height="11" rx="3" fill="#334455" />
      {/* visor strip */}
      <rect x="15" y="12" width="18" height="5" rx="1.5" fill="#001122" />
      <rect x="16" y="12.5" width="16" height="4" rx="1" fill="#00FFCC" opacity="0.7" />
      <ellipse cx="24" cy="14.5" rx="8" ry="2" fill="#00FFCC" opacity="0.25" />
      {/* jet boots */}
      <rect x="14" y="42" width="8" height="4" rx="2" fill="#334455" />
      <rect x="30" y="42" width="8" height="4" rx="2" fill="#334455" />
      <Sparkle x={6} y={9} size={2.4} color="#00FFCC" opacity={0.8} />
      <Sparkle x={42} y={9} size={2.4} color="#00FFCC" opacity={0.8} />
    </SpriteFrame>
  );
}

// ─── CORAL LINE ──────────────────────────────────────────────────────────────

export function SpikletSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* spiny sea urchin body */}
      {/* spines radiating outward */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = angle * Math.PI / 180;
        const r1 = 12;
        const r2 = 17;
        return (
          <line key={i}
            x1={24 + Math.cos(rad) * r1}
            y1={29 + Math.sin(rad) * r1}
            x2={24 + Math.cos(rad) * r2}
            y2={29 + Math.sin(rad) * r2}
            stroke="#FF7744"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}
      {/* round body */}
      <circle cx="24" cy="29" r="11" fill="#FF8844" />
      <circle cx="24" cy="29" r="8.5" fill="#FFAA66" />
      {/* belly */}
      <ellipse cx="24" cy="31" rx="5.5" ry="5" fill="#FFCC99" />
      {/* tiny cute face */}
      <Face eyeY={27} eyeDx={3.5} eyeRx={2.4} eyeRy={2.8} iris="#441100" blush="#FFAA66" nose="#BB4422" />
    </SpriteFrame>
  );
}

export function StarfishSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* star-shaped body */}
      <path d="M24 10 L27 20 L37 17 L30 25 L36 34 L24 29 L12 34 L18 25 L11 17 L21 20 Z" fill="#FF7733" />
      <path d="M24 13 L26.5 21 L34 19 L28.5 25.5 L33 32 L24 28 L15 32 L19.5 25.5 L14 19 L21.5 21 Z" fill="#FF9955" />
      {/* center cute face */}
      <circle cx="24" cy="26" r="7.5" fill="#FFBB77" />
      <Face eyeY={24} eyeDx={3.2} eyeRx={2.2} eyeRy={2.6} iris="#3A1A00" blush="#FFAA55" nose="#CC5522" />
      {/* star tip spines */}
      {[0,72,144,216,288].map((angle, i) => {
        const rad = angle * Math.PI / 180;
        const r = 17;
        return <circle key={i} cx={24 + Math.cos(rad - Math.PI/2) * r} cy={26 + Math.sin(rad - Math.PI/2) * r} r="1.5" fill="#FF9955" />;
      })}
    </SpriteFrame>
  );
}

export function ReefqueenSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002A">
      {/* sea anemone mane tentacles */}
      <path d="M14 16 Q10 8 12 4 Q15 7 15 14 Z" fill="#FF5588" />
      <path d="M18 13 Q16 5 19 2 Q22 5 20 12 Z" fill="#FF7799" />
      <path d="M24 12 Q24 4 27 2 Q28 5 26 12 Z" fill="#FF5588" />
      <path d="M30 13 Q32 5 29 2 Q26 5 28 12 Z" fill="#FF7799" />
      <path d="M34 16 Q38 8 36 4 Q33 7 33 14 Z" fill="#FF5588" />
      {/* tentacle tips */}
      <circle cx="12" cy="4" r="2" fill="#FFAA33" />
      <circle cx="19" cy="2" r="2" fill="#FFCC44" />
      <circle cx="27" cy="2" r="2" fill="#FFAA33" />
      <circle cx="29" cy="2" r="2" fill="#FFCC44" />
      <circle cx="36" cy="4" r="2" fill="#FFAA33" />
      {/* crown gem */}
      <path d="M22 10 L24 6 L26 10 Z" fill="#FF99AA" />
      <circle cx="24" cy="6" r="2.2" fill="#FFFFFF" opacity="0.9" />
      {/* coral dragon body */}
      <path d="M12 24 C12 14 16 9 24 9 C32 9 36 14 36 24 L36 36 C36 42 32 45 24 45 C16 45 12 42 12 36 Z" fill="#CC3366" />
      <path d="M15 25 C15 17 18 13 24 13 C30 13 33 17 33 25 L33 35 C33 40 30 43 24 43 C18 43 15 40 15 35 Z" fill="#EE5588" />
      {/* belly scales */}
      <ellipse cx="24" cy="36" rx="9" ry="7.5" fill="#FFAABB" />
      {/* coral scale pattern */}
      <path d="M18 22 L21 19 L24 22 L21 25 Z" fill="#CC3366" opacity="0.7" />
      <path d="M24 20 L27 17 L30 20 L27 23 Z" fill="#AA2244" opacity="0.7" />
      <path d="M20 27 L23 24 L26 27 L23 30 Z" fill="#CC3366" opacity="0.6" />
      {/* coral fin tail */}
      <path d="M32 38 Q40 34 42 27 Q40 25 38 27 Q37 33 32 38 Z" fill="#CC3366" />
      {/* fins */}
      <path d="M11 26 Q5 22 5 27 Q8 31 12 29 Z" fill="#EE5588" opacity="0.85" />
      <path d="M37 26 Q43 22 43 27 Q40 31 36 29 Z" fill="#EE5588" opacity="0.85" />
      {/* feet */}
      <ellipse cx="16" cy="43.5" rx="5.5" ry="2.2" fill="#991144" />
      <ellipse cx="32" cy="43.5" rx="5.5" ry="2.2" fill="#991144" />
      <Face eyeY={22} eyeDx={5.8} eyeRx={3.8} eyeRy={4.3} iris="#220011" blush="#FFAABB" mouth="serious" nose="#AA2244" />
      <Sparkle x={7} y={12} size={2.4} color="#FFCC44" opacity={0.8} />
      <Sparkle x={41} y={12} size={2.4} color="#FFAA33" opacity={0.75} />
    </SpriteFrame>
  );
}

// ─── CLOUD LINE ──────────────────────────────────────────────────────────────

export function PuffletSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* tiny round cloud body */}
      <ellipse cx="24" cy="29" rx="13.5" ry="11.5" fill="#EEF4FF" />
      <ellipse cx="17" cy="27" rx="7" ry="6.5" fill="#F5F8FF" />
      <ellipse cx="31" cy="27" rx="7" ry="6.5" fill="#F5F8FF" />
      <ellipse cx="24" cy="23" rx="9" ry="7.5" fill="#FFFFFF" />
      {/* cloud puff top */}
      <circle cx="18" cy="22" r="5" fill="#F0F4FF" />
      <circle cx="24" cy="19" r="5.5" fill="#FFFFFF" />
      <circle cx="30" cy="22" r="5" fill="#F0F4FF" />
      {/* tiny cute face */}
      <Face eyeY={25} eyeDx={3.8} eyeRx={2.5} eyeRy={3} iris="#3355AA" blush="#CCDDFF" nose="#6688CC" />
      {/* base puff feet */}
      <ellipse cx="18" cy="40" rx="4.5" ry="2.2" fill="#D8E8FF" />
      <ellipse cx="30" cy="40" rx="4.5" ry="2.2" fill="#D8E8FF" />
    </SpriteFrame>
  );
}

export function NimbusSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000018">
      {/* storm cloud body — darker */}
      <ellipse cx="24" cy="30" rx="14.5" ry="12.5" fill="#C8D8F8" />
      <ellipse cx="16" cy="28" rx="8" ry="7.5" fill="#D8E8FF" />
      <ellipse cx="32" cy="28" rx="8" ry="7.5" fill="#D8E8FF" />
      <ellipse cx="24" cy="23" rx="10" ry="8.5" fill="#E4EEFF" />
      {/* lightning bolt ears */}
      <path d="M14 17 L12 10 L16 13 L15 9 L19 14 L16 14 L17 18 Z" fill="#FFDD33" />
      <path d="M34 17 L36 10 L32 13 L33 9 L29 14 L32 14 L31 18 Z" fill="#FFDD33" />
      {/* cloud puff top */}
      <circle cx="17" cy="21" r="5.5" fill="#C8D8F8" />
      <circle cx="24" cy="18" r="6" fill="#D8E8FF" />
      <circle cx="31" cy="21" r="5.5" fill="#C8D8F8" />
      {/* face */}
      <Face eyeY={26} eyeDx={4.5} eyeRx={3} eyeRy={3.5} iris="#1A2A5A" blush="#B8CCEE" nose="#5577AA" />
      {/* small lightning bolt on belly */}
      <path d="M23 30 L21 35 L25 34 L23 40 L27 34 L23 35 Z" fill="#FFDD33" opacity="0.8" />
      {/* puff feet */}
      <ellipse cx="17" cy="42" rx="5" ry="2.2" fill="#AABBD0" />
      <ellipse cx="31" cy="42" rx="5" ry="2.2" fill="#AABBD0" />
    </SpriteFrame>
  );
}

export function StormcloudSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000025">
      {/* lightning crown */}
      <path d="M14 13 L12 5 L17 9 L16 4 L21 10 L18 10 L20 14 Z" fill="#FFDD33" />
      <path d="M34 13 L36 5 L31 9 L32 4 L27 10 L30 10 L28 14 Z" fill="#FFDD33" />
      <path d="M24 10 L22 3 L27 7 L26 2 L24 8 Z" fill="#FFEE66" opacity="0.9" />
      {/* dramatic storm cloud body */}
      <ellipse cx="24" cy="30" rx="16" ry="14" fill="#8899BB" />
      <ellipse cx="14" cy="28" rx="9" ry="8.5" fill="#99AABB" />
      <ellipse cx="34" cy="28" rx="9" ry="8.5" fill="#99AABB" />
      <ellipse cx="24" cy="22" rx="12" ry="10" fill="#AABBCC" />
      {/* cloud top puffs — darker storm */}
      <circle cx="16" cy="20" r="7" fill="#8899BB" />
      <circle cx="24" cy="16" r="8" fill="#99AABB" />
      <circle cx="32" cy="20" r="7" fill="#8899BB" />
      {/* face — serious storm expression */}
      <Face eyeY={26} eyeDx={5.5} eyeRx={3.8} eyeRy={4.2} iris="#112233" blush="#88AACC" mouth="serious" nose="#445577" />
      {/* lightning bolts on body */}
      <path d="M17 29 L15 34 L19 33 L17 38 L21 33 L17 34 Z" fill="#FFDD33" opacity="0.85" />
      <path d="M30 28 L28 33 L32 32 L30 37 L34 32 L30 33 Z" fill="#FFDD33" opacity="0.8" />
      {/* cloud feet */}
      <ellipse cx="16" cy="44" rx="6" ry="2.5" fill="#667788" />
      <ellipse cx="32" cy="44" rx="6" ry="2.5" fill="#667788" />
      <Sparkle x={8} y={10} size={2.4} color="#FFDD33" opacity={0.85} />
      <Sparkle x={40} y={8} size={2} color="#FFEE66" opacity={0.8} />
    </SpriteFrame>
  );
}

// ─── LAVA2 LINE ──────────────────────────────────────────────────────────────

export function MagpupSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000028">
      {/* magma drip at base */}
      <path d="M20 41 Q19 46 21 47 Q22 45 22 41 Z" fill="#FF4400" opacity="0.8" />
      <path d="M27 41 Q27 46 29 47 Q30 44 29 41 Z" fill="#FF6611" opacity="0.7" />
      {/* cute puppy body — lava red */}
      <ellipse cx="24" cy="30" rx="13" ry="12" fill="#881100" />
      <ellipse cx="24" cy="31" rx="10.5" ry="9.5" fill="#AA2200" />
      {/* lava glow belly */}
      <ellipse cx="24" cy="34" rx="6.5" ry="5.5" fill="#FF4400" opacity="0.7" />
      {/* lava crack belly glow */}
      <path d="M21 31 Q24 29 27 31 Q26 34 24 35 Q22 34 21 31 Z" fill="#FFAA00" opacity="0.5" />
      {/* floppy puppy ears with lava drips */}
      <ellipse cx="13" cy="20" rx="5" ry="8" fill="#881100" transform="rotate(-10 13 20)" />
      <ellipse cx="35" cy="20" rx="5" ry="8" fill="#881100" transform="rotate(10 35 20)" />
      <path d="M10 25 Q9 29 11 31" stroke="#FF4400" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M38 25 Q39 29 37 31" stroke="#FF4400" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* tiny stub tail */}
      <path d="M34 36 Q40 32 40 27 Q38 27 36 30 Q35 33 34 36 Z" fill="#881100" />
      <circle cx="40" cy="27" r="2" fill="#FF4400" opacity="0.7" />
      {/* tiny paws */}
      <ellipse cx="16" cy="41" rx="4.5" ry="2" fill="#661100" />
      <ellipse cx="32" cy="41" rx="4.5" ry="2" fill="#661100" />
      {/* glowing lava eyes */}
      <ellipse cx="19" cy="26" rx="3.2" ry="3.6" fill="#330000" />
      <ellipse cx="29" cy="26" rx="3.2" ry="3.6" fill="#330000" />
      <ellipse cx="19" cy="26" rx="2" ry="2.3" fill="#FF4400" opacity="0.95" />
      <ellipse cx="29" cy="26" rx="2" ry="2.3" fill="#FF6611" opacity="0.95" />
      <ellipse cx="18.5" cy="25" rx="0.8" ry="0.8" fill="#FFCC44" opacity="0.8" />
      <ellipse cx="28.5" cy="25" rx="0.8" ry="0.8" fill="#FFCC44" opacity="0.8" />
      {/* blush — ember glow */}
      <ellipse cx="14" cy="29.5" rx="2.4" ry="1.3" fill="#FF4400" opacity="0.35" />
      <ellipse cx="34" cy="29.5" rx="2.4" ry="1.3" fill="#FF4400" opacity="0.35" />
      {/* nose */}
      <ellipse cx="24" cy="30.2" rx="2" ry="1.4" fill="#441100" opacity="0.9" />
      {/* smile */}
      <path d="M22 32.5 Q24 34.5 26 32.5" stroke="#662200" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

export function Moltenk9Sprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000030">
      {/* lava armor plates on shoulder */}
      <path d="M9 20 L6 14 L12 13 L14 22 Z" fill="#441100" />
      <path d="M10 19 L8 15 L12 14.5 L13.5 20 Z" fill="#FF4400" opacity="0.5" />
      <path d="M39 20 L42 14 L36 13 L34 22 Z" fill="#441100" />
      <path d="M38 19 L40 15 L36 14.5 L34.5 20 Z" fill="#FF4400" opacity="0.5" />
      {/* lava drips on legs */}
      <path d="M17 41 Q16 46 18 47 Q19 44 19 41 Z" fill="#FF4400" opacity="0.75" />
      <path d="M29 41 Q29 46 31 47 Q32 44 31 41 Z" fill="#FF6611" opacity="0.7" />
      {/* wolf body */}
      <path d="M11 24 C11 14 16 9 24 9 C32 9 37 14 37 24 L37 36 C37 42 32 45 24 45 C16 45 11 42 11 36 Z" fill="#661100" />
      <path d="M14 25 C14 17 17 13 24 13 C31 13 34 17 34 25 L34 35 C34 40 30 43 24 43 C18 43 14 40 14 35 Z" fill="#882200" />
      {/* lava crack network on body */}
      <path d="M18 22 Q20 26 19 30 Q22 32 24 30 Q26 32 28 30 Q27 26 29 22" stroke="#FF4400" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M15 28 Q17 28 19 30" stroke="#FF4400" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M33 28 Q31 28 29 30" stroke="#FF4400" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M22 22 Q23 25 22 27" stroke="#FFCC44" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M26 23 Q25 26 26 28" stroke="#FFCC44" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* belly lava glow */}
      <ellipse cx="24" cy="36" rx="9" ry="7.5" fill="#FF3300" opacity="0.45" />
      {/* wolf ears */}
      <path d="M13 14 L10 5 L18 8 L17 14 Z" fill="#661100" />
      <path d="M35 14 L38 5 L30 8 L31 14 Z" fill="#661100" />
      <path d="M13.5 13 L11.5 7 L16.5 9.5 L16 13 Z" fill="#FF4400" opacity="0.5" />
      <path d="M34.5 13 L36.5 7 L31.5 9.5 L32 13 Z" fill="#FF4400" opacity="0.5" />
      {/* lava tail */}
      <path d="M33 39 Q42 35 44 27 L42 25 Q40 31 36 38 L33 41 Z" fill="#661100" />
      <path d="M41 26 Q43 22 44 24" stroke="#FF4400" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* feet */}
      <ellipse cx="16" cy="43.5" rx="5.5" ry="2.2" fill="#330800" />
      <ellipse cx="32" cy="43.5" rx="5.5" ry="2.2" fill="#330800" />
      {/* fierce glowing eyes */}
      <ellipse cx="18" cy="21" rx="4" ry="4.5" fill="#220000" />
      <ellipse cx="30" cy="21" rx="4" ry="4.5" fill="#220000" />
      <ellipse cx="18" cy="21" rx="2.5" ry="2.8" fill="#FF4400" opacity="0.95" />
      <ellipse cx="30" cy="21" rx="2.5" ry="2.8" fill="#FF6611" opacity="0.95" />
      <ellipse cx="17.5" cy="19.8" rx="1" ry="1" fill="#FFCC44" opacity="0.9" />
      <ellipse cx="29.5" cy="19.8" rx="1" ry="1" fill="#FFCC44" opacity="0.9" />
      <path d="M21 29 Q24 32 27 29" stroke="#FF3300" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

export function VolcanovexSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000035">
      {/* eruption mane — fire aura */}
      <ellipse cx="24" cy="24" rx="23" ry="20" fill="#FF2200" opacity="0.1" />
      {/* orbiting ember sparkles */}
      <Sparkle x={5} y={16} size={3} color="#FFEE44" opacity={0.9} />
      <Sparkle x={43} y={12} size={2.6} color="#FFB300" opacity={0.85} />
      <Sparkle x={3} y={30} size={2.2} color="#FFEE44" opacity={0.75} />
      <Sparkle x={45} y={29} size={2.4} color="#FFB300" opacity={0.8} />
      <Sparkle x={8} y={6} size={2} color="#FF6622" opacity={0.75} />
      <Sparkle x={40} y={5} size={2.2} color="#FF6622" opacity={0.75} />
      {/* eruption mane — lava spikes */}
      <path d="M18 10 L16 4 L20 8 L22 3 L24 8 L26 3 L28 8 L32 4 L30 10 Z" fill="#AA1100" />
      <path d="M19 9 L18 5 L21 8 L23 5 L24 8.5 L25 5 L27 8 L30 5 L29 9 Z" fill="#FF3300" opacity="0.85" />
      <path d="M21 8 L22 5 L24 8 L26 5 L27 8 Z" fill="#FFAA00" opacity="0.9" />
      {/* wings — lava streams */}
      <path d="M16 22 Q5 16 3 8 Q8 7 13 13 Q10 17 13 21 Z" fill="#771100" />
      <path d="M12 16 Q7 10 7 7 Q11 9 12 14 Z" fill="#FF3300" opacity="0.6" />
      <path d="M36 22 Q43 16 45 8 Q40 7 35 13 Q38 17 35 21 Z" fill="#771100" />
      <path d="M36 16 Q41 10 41 7 Q37 9 36 14 Z" fill="#FF3300" opacity="0.6" />
      {/* lava stream veins on wings */}
      <path d="M7 9 Q10 13 11 17" stroke="#FFCC00" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M41 9 Q38 13 37 17" stroke="#FFCC00" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* giant dragon body */}
      <path d="M12 23 C12 11 16 6 24 6 C32 6 36 11 36 23 L36 36 C36 44 32 47 24 47 C16 47 12 44 12 36 Z" fill="#661100" />
      <path d="M15 24 C15 15 18 11 24 11 C30 11 33 15 33 24 L33 35 C33 42 30 45 24 45 C18 45 15 42 15 35 Z" fill="#882200" />
      {/* volcano eruption lava network */}
      <path d="M19 20 Q21 24 20 28 Q23 31 24 29 Q25 31 28 28 Q27 24 29 20" stroke="#FF3300" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M15 27 Q18 27 20 28" stroke="#FF3300" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M33 27 Q30 27 28 28" stroke="#FF3300" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M20 28 Q20 34 19 39" stroke="#FFAA00" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M28 28 Q28 34 29 39" stroke="#FFAA00" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M22 21 Q23 24 22 26" stroke="#FFEE44" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M26 22 Q25 25 26 27" stroke="#FFEE44" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* lava drips off tail */}
      <path d="M33 41 Q44 37 46 27 L44 25 Q42 31 38 38 L33 43 Z" fill="#661100" />
      <path d="M43 26 Q45 22 46 25" stroke="#FF4400" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9" />
      {/* legs */}
      <ellipse cx="16" cy="45" rx="5.5" ry="2.2" fill="#330800" />
      <ellipse cx="32" cy="45" rx="5.5" ry="2.2" fill="#330800" />
      {/* fierce glowing eyes */}
      <ellipse cx="18" cy="20" rx="4.5" ry="5" fill="#110000" />
      <ellipse cx="30" cy="20" rx="4.5" ry="5" fill="#110000" />
      <ellipse cx="18" cy="20" rx="3" ry="3.5" fill="#FF2200" opacity="0.95" />
      <ellipse cx="30" cy="20" rx="3" ry="3.5" fill="#FF4400" opacity="0.95" />
      <ellipse cx="17.5" cy="18.8" rx="1.2" ry="1.2" fill="#FFEE44" opacity="0.9" />
      <ellipse cx="29.5" cy="18.8" rx="1.2" ry="1.2" fill="#FFEE44" opacity="0.9" />
      <ellipse cx="18" cy="20" rx="5" ry="5.5" fill="#FF2200" opacity="0.2" />
      <ellipse cx="30" cy="20" rx="5" ry="5.5" fill="#FF2200" opacity="0.2" />
      <path d="M21 29 Q24 32 27 29" stroke="#FF2200" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// ─── CRYSTAL2 LINE ───────────────────────────────────────────────────────────

export function GemkitSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* tiny faceted crystal body */}
      <path d="M24 12 L32 22 L30 34 L24 38 L18 34 L16 22 Z" fill="#AAEEFF" opacity="0.9" stroke="#66CCEE" strokeWidth="0.8" />
      {/* crystal facets */}
      <path d="M24 12 L32 22 L24 18 Z" fill="#66CCEE" opacity="0.6" />
      <path d="M32 22 L30 34 L24 18 Z" fill="#AAEEFF" opacity="0.5" />
      <path d="M30 34 L24 38 L24 18 Z" fill="#DDFEFF" opacity="0.55" />
      <path d="M24 38 L18 34 L24 18 Z" fill="#66CCEE" opacity="0.45" />
      <path d="M18 34 L16 22 L24 18 Z" fill="#AAEEFF" opacity="0.5" />
      <path d="M16 22 L24 12 L24 18 Z" fill="#DDFEFF" opacity="0.6" />
      {/* tiny bright eyes */}
      <Face eyeY={26} eyeDx={3} eyeRx={2} eyeRy={2.5} iris="#1A5A7A" blush="#88DDFF" nose="#4499BB" />
      {/* sparkle on tips */}
      <Sparkle x={24} y={12} size={2} color="#FFFFFF" opacity={0.9} />
      <Sparkle x={8} y={22} size={1.6} color="#AAEEFF" opacity={0.8} />
      <Sparkle x={40} y={22} size={1.6} color="#88CCFF" opacity={0.75} />
    </SpriteFrame>
  );
}

export function PrismarkSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000020">
      {/* crystal golem body — prism shaped */}
      <path d="M16 12 L24 7 L32 12 L34 24 L32 36 L24 40 L16 36 L14 24 Z" fill="#55AABB" stroke="#33889A" strokeWidth="0.9" />
      <path d="M16 12 L24 7 L24 18 Z" fill="#33AABB" opacity="0.6" />
      <path d="M24 7 L32 12 L24 18 Z" fill="#99EEFF" opacity="0.55" />
      <path d="M32 12 L34 24 L24 18 Z" fill="#55AABB" opacity="0.5" />
      <path d="M34 24 L32 36 L24 18 Z" fill="#AAEEFF" opacity="0.55" />
      <path d="M32 36 L24 40 L24 18 Z" fill="#33AABB" opacity="0.45" />
      <path d="M24 40 L16 36 L24 18 Z" fill="#99EEFF" opacity="0.5" />
      <path d="M16 36 L14 24 L24 18 Z" fill="#55AABB" opacity="0.5" />
      <path d="M14 24 L16 12 L24 18 Z" fill="#AAEEFF" opacity="0.6" />
      {/* glowing crystal core in chest */}
      <ellipse cx="24" cy="24" rx="5.5" ry="5" fill="#22667A" />
      <ellipse cx="24" cy="24" rx="3.5" ry="3.2" fill="#88EEFF" opacity="0.85" />
      <ellipse cx="24" cy="24" rx="2" ry="1.8" fill="#DDFEFF" opacity="0.95" />
      <ellipse cx="24" cy="24" rx="6" ry="5.5" fill="#88EEFF" opacity="0.2" />
      {/* crystal arm extensions */}
      <path d="M13 24 L8 20 L10 28 L14 26 Z" fill="#44AABB" stroke="#33889A" strokeWidth="0.7" />
      <path d="M35 24 L40 20 L38 28 L34 26 Z" fill="#44AABB" stroke="#33889A" strokeWidth="0.7" />
      {/* crystal eyes */}
      <ellipse cx="20" cy="20" rx="3.2" ry="3.5" fill="#0A1A22" />
      <ellipse cx="28" cy="20" rx="3.2" ry="3.5" fill="#0A1A22" />
      <ellipse cx="20" cy="20" rx="2" ry="2.2" fill="#55EEFF" opacity="0.95" />
      <ellipse cx="28" cy="20" rx="2" ry="2.2" fill="#55EEFF" opacity="0.95" />
      <ellipse cx="19.5" cy="19" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="27.5" cy="19" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.8" />
      {/* mouth */}
      <path d="M21 28 L27 28" stroke="#44AABB" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* crystal legs */}
      <path d="M19 38 L18 44 L22 44 L21 38 Z" fill="#44AABB" stroke="#33889A" strokeWidth="0.7" />
      <path d="M27 38 L26 44 L30 44 L29 38 Z" fill="#44AABB" stroke="#33889A" strokeWidth="0.7" />
      <Sparkle x={8} y={14} size={2.4} color="#AAEEFF" opacity={0.85} />
      <Sparkle x={40} y={14} size={2.4} color="#DDFEFF" opacity={0.8} />
    </SpriteFrame>
  );
}

export function DiamondraSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#0000002E">
      {/* rainbow light effects */}
      <Sparkle x={6} y={14} size={3} color="#FF99CC" opacity={0.85} />
      <Sparkle x={42} y={10} size={2.8} color="#FFEE44" opacity={0.85} />
      <Sparkle x={4} y={28} size={2.4} color="#44DDFF" opacity={0.8} />
      <Sparkle x={44} y={28} size={2.4} color="#AAFFCC" opacity={0.8} />
      <Sparkle x={8} y={40} size={2} color="#FF99CC" opacity={0.75} />
      <Sparkle x={40} y={40} size={2} color="#FFEE44" opacity={0.75} />
      <Sparkle x={24} y={4} size={2.8} color="#FFFFFF" opacity={0.9} />
      {/* crystal empress wings — geometric */}
      <path d="M16 22 L6 12 L8 24 L14 28 Z" fill="#99EEFF" opacity="0.85" stroke="#55CCDD" strokeWidth="0.8" />
      <path d="M8 12 L6 6 L12 10 Z" fill="#FFCCEE" opacity="0.75" />
      <path d="M32 22 L42 12 L40 24 L34 28 Z" fill="#99EEFF" opacity="0.85" stroke="#55CCDD" strokeWidth="0.8" />
      <path d="M40 12 L42 6 L36 10 Z" fill="#AAFFCC" opacity="0.75" />
      {/* lower crystal wings */}
      <path d="M15 28 L6 36 L12 38 L17 32 Z" fill="#CCEEFF" opacity="0.8" stroke="#55CCDD" strokeWidth="0.7" />
      <path d="M33 28 L42 36 L36 38 L31 32 Z" fill="#CCEEFF" opacity="0.8" stroke="#55CCDD" strokeWidth="0.7" />
      {/* crown of tall crystal spires */}
      <path d="M16 12 L14 4 L18 7 L20 2 L22 7 L24 3 L26 7 L28 2 L30 7 L34 4 L32 12 Z" fill="#2A6888" stroke="#44AABB" strokeWidth="0.7" />
      <path d="M18 11 L17 6 L19.5 8 L21.5 4 L23 7.5 L24 4 L25 7.5 L26.5 4 L28.5 8 L31 6 L30 11 Z" fill="#AAEEFF" opacity="0.55" />
      {/* empress body */}
      <path d="M13 23 C13 12 17 7 24 7 C31 7 35 12 35 23 L35 35 C35 43 31 46 24 46 C17 46 13 43 13 35 Z" fill="#2A6888" stroke="#44AABB" strokeWidth="0.9" />
      <path d="M16 24 C16 15 19 11 24 11 C29 11 32 15 32 24 L32 34 C32 41 29 44 24 44 C19 44 16 41 16 34 Z" fill="#55AABB" />
      {/* facet body highlights */}
      <path d="M16 24 L32 24" stroke="#99EEFF" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M15 30 L33 30" stroke="#99EEFF" strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* rainbow core in chest */}
      <ellipse cx="24" cy="28" rx="6" ry="5.5" fill="#1A4A5A" />
      <ellipse cx="24" cy="28" rx="4" ry="3.8" fill="#99EEFF" opacity="0.85" />
      <ellipse cx="24" cy="28" rx="2.2" ry="2" fill="#FFFFFF" opacity="0.95" />
      <ellipse cx="24" cy="28" rx="6.5" ry="6" fill="#99EEFF" opacity="0.2" />
      {/* prism rainbow rays */}
      <path d="M24 28 L14 38" stroke="#FF99CC" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M24 28 L34 38" stroke="#AAFFCC" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M24 28 L10 25" stroke="#FFEE44" strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M24 28 L38 25" stroke="#44DDFF" strokeWidth="0.8" fill="none" opacity="0.35" />
      {/* tail */}
      <path d="M32 38 Q40 34 44 26 Q42 24 40 26 Q39 32 34 37 Z" fill="#2A6888" stroke="#44AABB" strokeWidth="0.7" />
      <Sparkle x={39} y={26} size={2.2} color="#AAEEFF" opacity={0.85} />
      {/* legs */}
      <ellipse cx="16" cy="44.5" rx="5.5" ry="2.2" fill="#1A3A4A" />
      <ellipse cx="32" cy="44.5" rx="5.5" ry="2.2" fill="#1A3A4A" />
      {/* empress eyes */}
      <ellipse cx="18" cy="21" rx="4" ry="4.5" fill="#08181E" />
      <ellipse cx="30" cy="21" rx="4" ry="4.5" fill="#08181E" />
      <ellipse cx="18" cy="21" rx="2.5" ry="3" fill="#88FFFF" opacity="0.95" />
      <ellipse cx="30" cy="21" rx="2.5" ry="3" fill="#88FFFF" opacity="0.95" />
      <ellipse cx="17.5" cy="19.8" rx="1" ry="1" fill="#FFFFFF" opacity="0.9" />
      <ellipse cx="29.5" cy="19.8" rx="1" ry="1" fill="#FFFFFF" opacity="0.9" />
      <ellipse cx="18" cy="21" rx="4.5" ry="5" fill="#88FFFF" opacity="0.2" />
      <ellipse cx="30" cy="21" rx="4.5" ry="5" fill="#88FFFF" opacity="0.2" />
      <path d="M21 29 L27 29" stroke="#44AABB" strokeWidth="2" fill="none" strokeLinecap="round" />
    </SpriteFrame>
  );
}

// ─── ANCIENT LINE ────────────────────────────────────────────────────────────

export function FossiltSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped}>
      {/* pterodactyl head crest */}
      <path d="M24 12 L21 6 L28 8 Z" fill="#C8A878" />
      <path d="M22 11 L20 7 L26 8.5 Z" fill="#EED8B8" opacity="0.7" />
      {/* small pterodactyl beak */}
      <path d="M32 22 L38 20 L36 24 Z" fill="#C8A878" />
      {/* head */}
      <ellipse cx="26" cy="18" rx="10" ry="9" fill="#C8A878" />
      <ellipse cx="26" cy="19" rx="8.5" ry="7.5" fill="#EED8B8" />
      {/* amber glow patches */}
      <ellipse cx="26" cy="20" rx="5" ry="4" fill="#FFAA44" opacity="0.3" />
      {/* cute amber-glow body */}
      <path d="M15 26 C15 19 19 16 24 16 C29 16 32 19 32 26 L32 35 C32 40 29 43 24 43 C19 43 15 40 15 35 Z" fill="#C8A878" />
      <path d="M17 27 C17 22 20 19 24 19 C28 19 30 22 30 27 L30 35 C30 39 28 41 24 41 C20 41 17 39 17 35 Z" fill="#EED8B8" />
      {/* belly amber glow */}
      <ellipse cx="24" cy="33" rx="6.5" ry="5.5" fill="#FFAA44" opacity="0.35" />
      {/* bone texture marks */}
      <path d="M18 26 Q19 29 18 32" stroke="#C8A878" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M30 27 Q29 30 30 33" stroke="#C8A878" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* wing stubs */}
      <path d="M14 24 Q8 22 7 27 Q10 30 14 28 Z" fill="#C8A878" />
      <path d="M33 24 Q39 22 40 27 Q37 30 33 28 Z" fill="#C8A878" />
      {/* legs */}
      <ellipse cx="19" cy="42" rx="4" ry="1.8" fill="#A88858" />
      <ellipse cx="29" cy="42" rx="4" ry="1.8" fill="#A88858" />
      <Face eyeY={18} eyeDx={4.8} eyeRx={3.2} eyeRy={3.6} iris="#6A4A1A" blush="#FFDD99" nose="#A88858" />
    </SpriteFrame>
  );
}

export function ArchaeonSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000022">
      {/* ghostly teal energy outline/glow */}
      <path d="M12 22 C12 12 17 7 24 7 C31 7 36 12 36 22 L36 34 C36 41 31 45 24 45 C17 45 12 41 12 34 Z" fill="#AACC88" opacity="0.2" />
      {/* raised clawed hands — predator pose */}
      <path d="M12 20 Q7 16 6 10 Q10 11 12 16 Z" fill="#C8B89A" />
      <path d="M7 10 L6 7 L9 9 Z" fill="#AACC88" opacity="0.8" />
      <path d="M10 8 L9 5 L12 7 Z" fill="#AACC88" opacity="0.8" />
      <path d="M12 7 L11 4 L14 6 Z" fill="#AACC88" opacity="0.7" />
      <path d="M36 20 Q41 16 42 10 Q38 11 36 16 Z" fill="#C8B89A" />
      <path d="M41 10 L42 7 L39 9 Z" fill="#AACC88" opacity="0.8" />
      <path d="M38 8 L39 5 L36 7 Z" fill="#AACC88" opacity="0.8" />
      <path d="M36 7 L37 4 L34 6 Z" fill="#AACC88" opacity="0.7" />
      {/* raptor body */}
      <path d="M13 24 C13 14 17 9 24 9 C31 9 35 14 35 24 L35 35 C35 42 31 45 24 45 C17 45 13 42 13 35 Z" fill="#C8B89A" />
      <path d="M16 25 C16 17 19 13 24 13 C29 13 32 17 32 25 L32 34 C32 40 29 43 24 43 C19 43 16 40 16 34 Z" fill="#DDD0BC" />
      {/* teal ghost glow rimlight */}
      <path d="M13 24 C13 14 17 9 24 9 C31 9 35 14 35 24 L35 35 C35 42 31 45 24 45 C17 45 13 42 13 35 Z" fill="none" stroke="#AACC88" strokeWidth="1.5" opacity="0.6" />
      {/* visible rib-like markings */}
      <path d="M17 28 Q24 26 31 28" stroke="#AACC88" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M17 31 Q24 29 31 31" stroke="#AACC88" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M17 34 Q24 32 31 34" stroke="#AACC88" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* head and snout */}
      <ellipse cx="24" cy="18" rx="9" ry="8" fill="#C8B89A" />
      <path d="M28 22 L36 20 L34 24 Z" fill="#C8B89A" />
      {/* teal glow eyes */}
      <ellipse cx="19" cy="17" rx="3.5" ry="4" fill="#0A2A1A" />
      <ellipse cx="19" cy="17" rx="2" ry="2.5" fill="#8FBB77" opacity="0.95" />
      <ellipse cx="18.5" cy="16" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="29" cy="17" rx="3.5" ry="4" fill="#0A2A1A" />
      <ellipse cx="29" cy="17" rx="2" ry="2.5" fill="#8FBB77" opacity="0.95" />
      <ellipse cx="28.5" cy="16" rx="0.8" ry="0.8" fill="#FFFFFF" opacity="0.7" />
      {/* raptor tail */}
      <path d="M32 38 Q40 34 44 28 L42 26 Q40 30 36 36 L32 40 Z" fill="#C8B89A" />
      {/* alert open jaw */}
      <path d="M30 23 L36 21" stroke="#A89A80" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* feet */}
      <ellipse cx="18" cy="43.5" rx="4.5" ry="2" fill="#A89A80" />
      <ellipse cx="30" cy="43.5" rx="4.5" ry="2" fill="#A89A80" />
    </SpriteFrame>
  );
}

export function TitanwrexSprite({ w = 64, flipped = false }) {
  return (
    <SpriteFrame w={w} flipped={flipped} shadow="#00000035">
      {/* cosmic star markings on body — Sparkles */}
      <Sparkle x={18} y={26} size={2.4} color="#FFD870" opacity={0.85} />
      <Sparkle x={30} y={24} size={2} color="#9966FF" opacity={0.8} />
      <Sparkle x={24} y={30} size={2.8} color="#FFD870" opacity={0.9} />
      <Sparkle x={16} y={34} size={1.8} color="#9966FF" opacity={0.75} />
      <Sparkle x={32} y={33} size={2} color="#FFD870" opacity={0.8} />
      <Sparkle x={7} y={15} size={2.4} color="#FFD870" opacity={0.75} />
      <Sparkle x={41} y={13} size={2.2} color="#9966FF" opacity={0.7} />
      <Sparkle x={6} y={30} size={2} color="#FFFFFF" opacity={0.65} />
      <Sparkle x={42} y={29} size={2} color="#FFFFFF" opacity={0.65} />
      {/* massive T-rex silhouette */}
      {/* tiny arms raised */}
      <path d="M14 24 Q9 20 8 14 Q12 14 14 20 Z" fill="#2A2038" />
      <path d="M9 14 L8 11 L11 13 Z" fill="#C8B89A" opacity="0.6" />
      <path d="M11 12 L10 9 L13 11 Z" fill="#C8B89A" opacity="0.5" />
      {/* massive body */}
      <path d="M13 22 C13 11 17 6 24 6 C31 6 35 11 35 22 L35 35 C35 43 31 47 24 47 C17 47 13 43 13 35 Z" fill="#2A2038" />
      <path d="M16 23 C16 14 19 10 24 10 C29 10 32 14 32 23 L32 34 C32 41 29 44 24 44 C19 44 16 41 16 34 Z" fill="#C8B89A" opacity="0.7" />
      {/* cosmic rift pattern on chest */}
      <path d="M20 26 Q24 22 28 26 Q26 30 24 32 Q22 30 20 26 Z" fill="#9966FF" opacity="0.6" />
      <ellipse cx="24" cy="28" rx="3.5" ry="3.5" fill="#2A2038" />
      <ellipse cx="24" cy="28" rx="2" ry="2" fill="#9966FF" opacity="0.8" />
      {/* crown of ancient bone spikes */}
      <path d="M14 12 L12 4 L16 7 L18 2 L20 7 L24 3 L28 7 L30 2 L32 7 L36 4 L34 12 Z" fill="#C8B89A" />
      <path d="M16 11 L14.5 6 L17.5 8 L19.5 4 L21 8 L24 5 L27 8 L28.5 4 L30.5 8 L33.5 6 L32 11 Z" fill="#FFD870" opacity="0.6" />
      {/* gold bone sheen lines on body */}
      <path d="M18 28 Q20 26 22 28" stroke="#FFD870" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M26 27 Q28 25 30 27" stroke="#FFD870" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* one glowing purple eye — custom */}
      <ellipse cx="20" cy="20" rx="4.5" ry="5" fill="#1A1028" />
      <ellipse cx="28" cy="20" rx="4.5" ry="5" fill="#1A1028" />
      {/* left eye normal */}
      <ellipse cx="20" cy="20" rx="2.8" ry="3.2" fill="#C8B89A" opacity="0.5" />
      {/* one glowing purple right eye */}
      <ellipse cx="28" cy="20" rx="2.8" ry="3.2" fill="#9966FF" opacity="0.95" />
      <ellipse cx="27.5" cy="18.8" rx="1" ry="1" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="28" cy="20" rx="3.5" ry="4" fill="#9966FF" opacity="0.2" />
      {/* massive powerful legs */}
      <ellipse cx="18" cy="45" rx="6" ry="2.5" fill="#1A1028" />
      <ellipse cx="30" cy="45" rx="6" ry="2.5" fill="#1A1028" />
      {/* heavy tail */}
      <path d="M32 38 Q42 33 46 24 L44 22 Q42 28 38 34 L33 40 Z" fill="#2A2038" />
    </SpriteFrame>
  );
}

export const CATCH_MON_LINES = [
  {
    lineId: "flame",
    type: "FLAME",
    typeClr: "#FF6B35",
    typeBg: "#2A0E00",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#FF6B35",
    eggEmoji: "🔥",
    stages: [
      { id: "emberpuff", name: "EMBERPUFF", Sprite: EmberpuffSprite, type: "FLAME", typeClr: "#FF6B35", color: "#FF7A4D", glow: "#FF6B35", hp: 96, atk: 14, def: 8, evoLv: 12, desc: "Tiny ember cub.\nWarm, bright, and huggable." },
      { id: "scorchcub", name: "SCORCHCUB", Sprite: ScorchcubSprite, type: "FLAME", typeClr: "#FF6B35", color: "#FF8A38", glow: "#FF7A1A", hp: 122, atk: 20, def: 12, evoLv: 25, desc: "Flame mane cub.\nBrave when friends need help." },
      { id: "blazeking", name: "BLAZEKING", Sprite: BlazeKingSprite, type: "FLAME", typeClr: "#FF6B35", color: "#FFB347", glow: "#FF8C1A", hp: 150, atk: 28, def: 18, evoLv: null, desc: "Crown-flame guardian.\nLeads with heat and pride." },
    ],
  },
  {
    lineId: "wave",
    type: "WAVE",
    typeClr: "#44AAFF",
    typeBg: "#001A33",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#44AAFF",
    eggEmoji: "💧",
    stages: [
      { id: "bubblet", name: "BUBBLET", Sprite: BubbletSprite, type: "WAVE", typeClr: "#44AAFF", color: "#5BB9FF", glow: "#44AAFF", hp: 102, atk: 12, def: 11, evoLv: 12, desc: "Bouncy bubble fish.\nAlways drifting with a grin." },
      { id: "coralia", name: "CORALIA", Sprite: CoraliaSprite, type: "WAVE", typeClr: "#44AAFF", color: "#63C8FF", glow: "#5DAEFF", hp: 128, atk: 18, def: 16, evoLv: 25, desc: "Coral fin guardian.\nSings to calm the tide." },
      { id: "tidalon", name: "TIDALON", Sprite: TidalonSprite, type: "WAVE", typeClr: "#44AAFF", color: "#7FD7FF", glow: "#75C8FF", hp: 156, atk: 24, def: 22, evoLv: null, desc: "Ocean crest dragon.\nRules waves with quiet grace." },
    ],
  },
  {
    lineId: "leaf",
    type: "LEAF",
    typeClr: "#44CC44",
    typeBg: "#001A00",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#44CC44",
    eggEmoji: "🌿",
    stages: [
      { id: "sproutling", name: "SPROUTLING", Sprite: SproutlingSprite, type: "LEAF", typeClr: "#44CC44", color: "#52D652", glow: "#44CC44", hp: 108, atk: 11, def: 13, evoLv: 12, desc: "Sprout pup seedling.\nGrows from praise and play." },
      { id: "bloomhog", name: "BLOOMHOG", Sprite: BloomhogSprite, type: "LEAF", typeClr: "#44CC44", color: "#6DDB63", glow: "#60D050", hp: 136, atk: 17, def: 18, evoLv: 25, desc: "Petal-backed buddy.\nProtects friends with pollen fluff." },
      { id: "treant", name: "TREANT", Sprite: TreantSprite, type: "LEAF", typeClr: "#44CC44", color: "#8BE06B", glow: "#7AD35A", hp: 168, atk: 22, def: 26, evoLv: null, desc: "Ancient grove keeper.\nShelters the whole forest." },
    ],
  },
  {
    lineId: "bolt",
    type: "BOLT",
    typeClr: "#FFCC00",
    typeBg: "#1A1400",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#FFCC00",
    eggEmoji: "⚡",
    stages: [
      { id: "zaplet", name: "ZAPLET", Sprite: ZapletSprite, type: "BOLT", typeClr: "#FFCC00", color: "#FFD54D", glow: "#FFCC00", hp: 98, atk: 16, def: 8, evoLv: 14, desc: "Static kitten spark.\nZooms before you can blink." },
      { id: "thundermew", name: "THUNDERMEW", Sprite: ThundermewSprite, type: "BOLT", typeClr: "#FFCC00", color: "#FFE066", glow: "#FFD233", hp: 122, atk: 23, def: 12, evoLv: 28, desc: "Stormclaw prowler.\nCharges the field with roars." },
      { id: "voltiger", name: "VOLTIGER", Sprite: VoltigerSprite, type: "BOLT", typeClr: "#FFCC00", color: "#FFF08A", glow: "#FFE45C", hp: 148, atk: 31, def: 18, evoLv: null, desc: "Sky-strike tiger.\nTurns thunder into speed." },
    ],
  },
  {
    lineId: "shadow",
    type: "SHADOW",
    typeClr: "#CC44FF",
    typeBg: "#0A001A",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#9900FF",
    eggEmoji: "🌙",
    stages: [
      { id: "shadeling", name: "SHADELING", Sprite: ShadelingSprite, type: "SHADOW", typeClr: "#CC44FF", color: "#D96CFF", glow: "#B544FF", hp: 104, atk: 15, def: 10, evoLv: 16, desc: "Mischief wisp child.\nHides in moonlit corners." },
      { id: "gloomwing", name: "GLOOMWING", Sprite: GloomwingSprite, type: "SHADOW", typeClr: "#CC44FF", color: "#E087FF", glow: "#CC66FF", hp: 130, atk: 22, def: 15, evoLv: 30, desc: "Night silk phantom.\nFloats without a sound." },
      { id: "voidrex", name: "VOIDREX", Sprite: VoidrexSprite, type: "SHADOW", typeClr: "#CC44FF", color: "#F0A3FF", glow: "#E278FF", hp: 158, atk: 29, def: 21, evoLv: null, desc: "Abyssal wing drake.\nSwallows light with a stare." },
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
      { id: "stardust", name: "STARDUST", Sprite: StardustSprite, type: "STAR", typeClr: "#FFD700", color: "#FFE27A", glow: "#FFD700", hp: 112, atk: 17, def: 12, evoLv: 20, desc: "Tiny wish spark.\nBorn where comets fall." },
      { id: "cosmeling", name: "COSMELING", Sprite: CosmelingSprite, type: "STAR", typeClr: "#FFD700", color: "#FFE894", glow: "#FFDD55", hp: 140, atk: 24, def: 18, evoLv: 35, desc: "Star trail hopper.\nCollects dreams across space." },
      { id: "galaxion", name: "GALAXION", Sprite: GalaxionSprite, type: "STAR", typeClr: "#FFD700", color: "#FFF1B0", glow: "#FFE27A", hp: 172, atk: 32, def: 24, evoLv: null, desc: "Celestial phoenix lord.\nThe rarest skyfire of all." },
    ],
  },
  {
    lineId: "ice",
    type: "ICE",
    typeClr: "#88DDFF",
    typeBg: "#001A2A",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#88DDFF",
    eggEmoji: "❄️",
    stages: [
      { id: "frostpup", name: "FROSTPUP", Sprite: FrostpupSprite, type: "ICE", typeClr: "#88DDFF", color: "#9DD8F5", glow: "#88DDFF", hp: 100, atk: 11, def: 13, evoLv: 12, desc: "Ice fox pup.\nLeaves frost prints in the snow." },
      { id: "glacuff", name: "GLACUFF", Sprite: GlacuffSprite, type: "ICE", typeClr: "#88DDFF", color: "#7BBEE0", glow: "#66CCEE", hp: 128, atk: 17, def: 20, evoLv: 25, desc: "Ice wolf teen.\nArmored in ancient frost." },
      { id: "blizzaron", name: "BLIZZARON", Sprite: BlizzaronSprite, type: "ICE", typeClr: "#88DDFF", color: "#5E9EBF", glow: "#44AADD", hp: 160, atk: 23, def: 28, evoLv: null, desc: "Ice dragon sovereign.\nBreathes blizzards that freeze time." },
    ],
  },
  {
    lineId: "rock",
    type: "ROCK",
    typeClr: "#CCAA77",
    typeBg: "#1A1208",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#CCAA77",
    eggEmoji: "🪨",
    stages: [
      { id: "pebblump", name: "PEBBLUMP", Sprite: PebblumpSprite, type: "ROCK", typeClr: "#CCAA77", color: "#A8967F", glow: "#CCAA77", hp: 114, atk: 10, def: 16, evoLv: 12, desc: "Living pebble.\nRolls downhill for fun." },
      { id: "bouldug", name: "BOULDUG", Sprite: BoulDugSprite, type: "ROCK", typeClr: "#CCAA77", color: "#8C7A6B", glow: "#BBAA88", hp: 146, atk: 16, def: 24, evoLv: 25, desc: "Rock bulldog.\nShell cracks never — it just grows." },
      { id: "granoth", name: "GRANOTH", Sprite: GranothSprite, type: "ROCK", typeClr: "#CCAA77", color: "#7A6A5C", glow: "#00E8FF", hp: 180, atk: 21, def: 33, evoLv: null, desc: "Ancient stone golem.\nGems hold memories of old mountains." },
    ],
  },
  {
    lineId: "wind",
    type: "WIND",
    typeClr: "#88FFCC",
    typeBg: "#00180E",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#88FFCC",
    eggEmoji: "🌪️",
    stages: [
      { id: "breezel", name: "BREEZEL", Sprite: BreezeLSprite, type: "WIND", typeClr: "#88FFCC", color: "#7DD8B8", glow: "#88FFCC", hp: 96, atk: 14, def: 9, evoLv: 14, desc: "Swallow wind-rider.\nFaster than a whisper." },
      { id: "cyclair", name: "CYCLAIR", Sprite: CycLairSprite, type: "WIND", typeClr: "#88FFCC", color: "#3ABBA8", glow: "#44DDBB", hp: 120, atk: 21, def: 13, evoLv: 28, desc: "Vortex owl.\nSees the eye of every storm." },
      { id: "tempestross", name: "TEMPESTROSS", Sprite: TempestrossSprite, type: "WIND", typeClr: "#88FFCC", color: "#4A88CC", glow: "#88EEFF", hp: 150, atk: 29, def: 19, evoLv: null, desc: "Storm condor sovereign.\nIts wingspan spans the horizon." },
    ],
  },
  {
    lineId: "toxic",
    type: "TOXIC",
    typeClr: "#88FF44",
    typeBg: "#041200",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#66DD22",
    eggEmoji: "☠️",
    stages: [
      { id: "slimlet", name: "SLIMLET", Sprite: SlimletSprite, type: "TOXIC", typeClr: "#88FF44", color: "#88EE66", glow: "#88FF44", hp: 94, atk: 13, def: 7, evoLv: 13, desc: "Bubbly slime baby.\nHugs leave a sticky mark." },
      { id: "venomite", name: "VENOMITE", Sprite: VenomiteSprite, type: "TOXIC", typeClr: "#88FF44", color: "#44882A", glow: "#66CC22", hp: 118, atk: 20, def: 11, evoLv: 26, desc: "Poison frog-lizard.\nTongue melts through armor." },
      { id: "toxigore", name: "TOXIGORE", Sprite: ToxigoreSprite, type: "TOXIC", typeClr: "#88FF44", color: "#336622", glow: "#88FF22", hp: 146, atk: 28, def: 17, evoLv: null, desc: "Acid dragon.\nLeaves craters with every step." },
    ],
  },
  {
    lineId: "metal",
    type: "METAL",
    typeClr: "#AABBCC",
    typeBg: "#0A0E12",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#AABBCC",
    eggEmoji: "⚙️",
    stages: [
      { id: "cogling", name: "COGLING", Sprite: CoglingSprite, type: "METAL", typeClr: "#AABBCC", color: "#C8B89A", glow: "#AABBCC", hp: 98, atk: 15, def: 11, evoLv: 14, desc: "Gear creature.\nTicks in perfect time." },
      { id: "ironax", name: "IRONAX", Sprite: IronaxSprite, type: "METAL", typeClr: "#AABBCC", color: "#7A8890", glow: "#BBCCDD", hp: 124, atk: 22, def: 18, evoLv: 28, desc: "Iron war bear.\nArmor forged in magma pits." },
      { id: "steelwyrm", name: "STEELWYRM", Sprite: SteelwyrmSprite, type: "METAL", typeClr: "#AABBCC", color: "#788A98", glow: "#CCDDE8", hp: 152, atk: 30, def: 25, evoLv: null, desc: "Chrome dragon.\nIts scales deflect lightning." },
    ],
  },
  {
    lineId: "psychic",
    type: "PSYCHIC",
    typeClr: "#EE88FF",
    typeBg: "#150028",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#CC66FF",
    eggEmoji: "🔮",
    stages: [
      { id: "psykit", name: "PSYKIT", Sprite: PsykitSprite, type: "PSYCHIC", typeClr: "#EE88FF", color: "#C8A8E8", glow: "#EE88FF", hp: 100, atk: 16, def: 9, evoLv: 16, desc: "Psychic kitten.\nReads your thoughts before you think them." },
      { id: "mindra", name: "MINDRA", Sprite: MindraSprite, type: "PSYCHIC", typeClr: "#EE88FF", color: "#A880C8", glow: "#CC99FF", hp: 128, atk: 23, def: 14, evoLv: 30, desc: "Mind fox.\nThree tails weave illusions." },
      { id: "cerebron", name: "CEREBRON", Sprite: CerebronSprite, type: "PSYCHIC", typeClr: "#EE88FF", color: "#7A5AA8", glow: "#EE88FF", hp: 158, atk: 31, def: 20, evoLv: null, desc: "Psychic sphinx.\nRearranges reality on a whim." },
    ],
  },
  {
    lineId: "crystal",
    type: "CRYSTAL",
    typeClr: "#88EEFF",
    typeBg: "#001820",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#44CCEE",
    eggEmoji: "💎",
    stages: [
      { id: "shimlit", name: "SHIMLIT", Sprite: ShimlitSprite, type: "CRYSTAL", typeClr: "#88EEFF", color: "#B8ECFF", glow: "#88EEFF", hp: 104, atk: 15, def: 12, evoLv: 16, desc: "Crystal fairy spark.\nRefracts light into rainbows." },
      { id: "prismite", name: "PRISMITE", Sprite: PrismiteSprite, type: "CRYSTAL", typeClr: "#88EEFF", color: "#6AABCC", glow: "#AAEEFF", hp: 132, atk: 22, def: 18, evoLv: 30, desc: "Prism-winged fox.\nLeaves rainbow trails in its wake." },
      { id: "crystalith", name: "CRYSTALITH", Sprite: CrystalithSprite, type: "CRYSTAL", typeClr: "#88EEFF", color: "#4A8AAA", glow: "#7FFFFF", hp: 162, atk: 29, def: 26, evoLv: null, desc: "Crystal colossus.\nIts body refracts the whole sky." },
    ],
  },
  {
    lineId: "dragon",
    type: "DRAGON",
    typeClr: "#FF6644",
    typeBg: "#1A0600",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#CC2200",
    eggEmoji: "🐉",
    stages: [
      { id: "drakeling", name: "DRAKELING", Sprite: DrakelingSprite, type: "DRAGON", typeClr: "#FF6644", color: "#CC4422", glow: "#FF6644", hp: 108, atk: 17, def: 10, evoLv: 16, desc: "Baby dragon.\nBreathes more smoke than fire." },
      { id: "scalefang", name: "SCALEFANG", Sprite: ScalefangSprite, type: "DRAGON", typeClr: "#FF6644", color: "#AA2A18", glow: "#FF8833", hp: 136, atk: 25, def: 15, evoLv: 30, desc: "Dragon teen.\nClaws are sharp enough to cut stone." },
      { id: "wyrmking", name: "WYRMKING", Sprite: WyrmkingSprite, type: "DRAGON", typeClr: "#FF6644", color: "#880E04", glow: "#FFD700", hp: 166, atk: 34, def: 22, evoLv: null, desc: "Dragon lord.\nAll lesser dragons bow before it." },
    ],
  },
  {
    lineId: "nature",
    type: "NATURE",
    typeClr: "#FFCC44",
    typeBg: "#100800",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#AADD22",
    eggEmoji: "🦋",
    stages: [
      { id: "larvix", name: "LARVIX", Sprite: LarvixSprite, type: "NATURE", typeClr: "#FFCC44", color: "#88CC44", glow: "#FFCC44", hp: 102, atk: 12, def: 14, evoLv: 16, desc: "Leaf-shield larva.\nWears a leaf like a knight's buckler." },
      { id: "chrysaming", name: "CHRYSAMING", Sprite: ChrysamingSprite, type: "NATURE", typeClr: "#FFCC44", color: "#CC66AA", glow: "#FFAA44", hp: 130, atk: 20, def: 19, evoLv: 30, desc: "Crystal butterfly.\nWings carry ancient pollen." },
      { id: "motheron", name: "MOTHERON", Sprite: MoTheronSprite, type: "NATURE", typeClr: "#FFCC44", color: "#6633AA", glow: "#FFD870", hp: 160, atk: 27, def: 25, evoLv: null, desc: "Cosmic moth sovereign.\nIts wings hold the galaxy's map." },
    ],
  },
  {
    lineId: "lava",
    type: "LAVA",
    typeClr: "#FF4400",
    typeBg: "#200400",
    rarity: "legendary",
    rarityLabel: "★★★★ Legendary",
    rarityClr: "#FFD700",
    eggColor: "#FF2200",
    eggEmoji: "🌋",
    stages: [
      { id: "magmite", name: "MAGMITE", Sprite: MagmiteSprite, type: "LAVA", typeClr: "#FF4400", color: "#FF4400", glow: "#FF8833", hp: 114, atk: 18, def: 11, evoLv: 20, desc: "Magma slug.\nLeaves molten tracks on stone." },
      { id: "inferite", name: "INFERITE", Sprite: InferiteSprite, type: "LAVA", typeClr: "#FF4400", color: "#CC2200", glow: "#FF5500", hp: 144, atk: 27, def: 17, evoLv: 35, desc: "Lava salamander.\nBody temperature melts iron." },
      { id: "volcanix", name: "VOLCANIX", Sprite: VolcanixSprite, type: "LAVA", typeClr: "#FF4400", color: "#AA1A00", glow: "#FFB300", hp: 178, atk: 37, def: 23, evoLv: null, desc: "Lava phoenix lord.\nRises from eruptions, eternal." },
    ],
  },
  {
    lineId: "ancient",
    type: "ANCIENT",
    typeClr: "#EED8B8",
    typeBg: "#0E0B06",
    rarity: "legendary",
    rarityLabel: "★★★★ Legendary",
    rarityClr: "#FFD700",
    eggColor: "#C8A860",
    eggEmoji: "🦕",
    stages: [
      { id: "fossilt", name: "FOSSILT", Sprite: FossiltSprite, type: "ANCIENT", typeClr: "#EED8B8", color: "#EED8B8", glow: "#FFAA44", hp: 112, atk: 17, def: 13, evoLv: 20, desc: "Fossil hatchling.\nSleept in amber for a million years." },
      { id: "archaeon", name: "ARCHAEON", Sprite: ArchaeonSprite, type: "ANCIENT", typeClr: "#EED8B8", color: "#C8B89A", glow: "#AACC88", hp: 142, atk: 26, def: 19, evoLv: 35, desc: "Raptor spirit.\nGhost energy animates old bones." },
      { id: "titanwrex", name: "TITANWREX", Sprite: TitanwrexSprite, type: "ANCIENT", typeClr: "#EED8B8", color: "#9966FF", glow: "#9966FF", hp: 176, atk: 35, def: 26, evoLv: null, desc: "Ancient rex colossus.\nThe oldest known living creature." },
    ],
  },
  {
    lineId: "fairy",
    type: "FAIRY",
    typeClr: "#FF88CC",
    typeBg: "#1A0010",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#FF88CC",
    eggEmoji: "🌸",
    stages: [
      { id: "pinkpuff", name: "PINKPUFF", Sprite: PinkpuffSprite, type: "FAIRY", typeClr: "#FF88CC", color: "#FF99DD", glow: "#FF88CC", hp: 100, atk: 12, def: 10, evoLv: 12, desc: "Fluffy pink bunny.\nWarm hugs heal all worries." },
      { id: "floppear", name: "FLOPPEAR", Sprite: FloppearSprite, type: "FAIRY", typeClr: "#FF88CC", color: "#FFAADD", glow: "#FF99CC", hp: 128, atk: 18, def: 16, evoLv: 25, desc: "Flower-crowned rabbit.\nDances in moonlit meadows." },
      { id: "lunabun", name: "LUNABUN", Sprite: LunabunSprite, type: "FAIRY", typeClr: "#FF88CC", color: "#FFBBEE", glow: "#FFB3DD", hp: 160, atk: 25, def: 22, evoLv: null, desc: "Moon-horn rabbit queen.\nRules the night with grace." },
    ],
  },
  {
    lineId: "ghost",
    type: "GHOST",
    typeClr: "#66DDEE",
    typeBg: "#000A10",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#44CCDD",
    eggEmoji: "👻",
    stages: [
      { id: "spooka", name: "SPOOKA", Sprite: SpookaSprite, type: "GHOST", typeClr: "#66DDEE", color: "#CCEEEE", glow: "#66DDEE", hp: 98, atk: 15, def: 9, evoLv: 14, desc: "Tiny shy ghost.\nDisappears when you reach out." },
      { id: "phantlet", name: "PHANTLET", Sprite: PhantletSprite, type: "GHOST", typeClr: "#66DDEE", color: "#AADDEE", glow: "#55CCDD", hp: 124, atk: 22, def: 14, evoLv: 28, desc: "Glowing eyed ghost.\nFloats through walls humming." },
      { id: "hauntlord", name: "HAUNTLORD", Sprite: HauntlordSprite, type: "GHOST", typeClr: "#66DDEE", color: "#88CCDD", glow: "#44DDFF", hp: 152, atk: 30, def: 20, evoLv: null, desc: "Crowned ghost sovereign.\nRules all haunted places." },
    ],
  },
  {
    lineId: "sand",
    type: "SAND",
    typeClr: "#DDAA55",
    typeBg: "#140E00",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#DDAA55",
    eggEmoji: "🏜️",
    stages: [
      { id: "dustkit", name: "DUSTKIT", Sprite: DustkitSprite, type: "SAND", typeClr: "#DDAA55", color: "#EEC88A", glow: "#DDAA55", hp: 100, atk: 11, def: 11, evoLv: 12, desc: "Sand mouse pup.\nCurls its tail in the warmth." },
      { id: "sandroll", name: "SANDROLL", Sprite: SandrollSprite, type: "SAND", typeClr: "#DDAA55", color: "#C8983C", glow: "#CCAA44", hp: 128, atk: 17, def: 18, evoLv: 25, desc: "Armadillo roller.\nCurls into a ball to escape." },
      { id: "terradon", name: "TERRADON", Sprite: TerradonSprite, type: "SAND", typeClr: "#DDAA55", color: "#A87830", glow: "#CC8822", hp: 160, atk: 24, def: 26, evoLv: null, desc: "Desert king lizard.\nIts spines store heat all day." },
    ],
  },
  {
    lineId: "speed",
    type: "SPEED",
    typeClr: "#FF8833",
    typeBg: "#1A0A00",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#FF7722",
    eggEmoji: "💨",
    stages: [
      { id: "dashpup", name: "DASHPUP", Sprite: DashpupSprite, type: "SPEED", typeClr: "#FF8833", color: "#FF9944", glow: "#FF8833", hp: 98, atk: 15, def: 9, evoLv: 14, desc: "Speedy orange fox pup.\nLeaves wind streaks behind." },
      { id: "zoomfox", name: "ZOOMFOX", Sprite: ZoomfoxSprite, type: "SPEED", typeClr: "#FF8833", color: "#EE6611", glow: "#FF7722", hp: 124, atk: 23, def: 14, evoLv: 28, desc: "Speed-line fox teen.\nIts fur blurs at full sprint." },
      { id: "blazedash", name: "BLAZEDASH", Sprite: BlazedashSprite, type: "SPEED", typeClr: "#FF8833", color: "#CC4400", glow: "#FF8844", hp: 152, atk: 31, def: 20, evoLv: null, desc: "Afterimage fox racer.\nBreaks sound barriers mid-run." },
    ],
  },
  {
    lineId: "cosmic",
    type: "COSMIC",
    typeClr: "#AA66FF",
    typeBg: "#0A0018",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#8833FF",
    eggEmoji: "🌌",
    stages: [
      { id: "voidpup", name: "VOIDPUP", Sprite: VoidpupSprite, type: "COSMIC", typeClr: "#AA66FF", color: "#9966CC", glow: "#AA66FF", hp: 106, atk: 16, def: 11, evoLv: 16, desc: "Alien blob pup.\nCuriously pokes at everything." },
      { id: "nebulark", name: "NEBULARK", Sprite: NebularkSprite, type: "COSMIC", typeClr: "#AA66FF", color: "#6644BB", glow: "#BB77FF", hp: 134, atk: 24, def: 17, evoLv: 30, desc: "Galaxy pattern alien.\nSees with all its tiny eyes." },
      { id: "cosmodrake", name: "COSMODRAKE", Sprite: CosmodrakeSprite, type: "COSMIC", typeClr: "#AA66FF", color: "#3311AA", glow: "#9966FF", hp: 164, atk: 32, def: 23, evoLv: null, desc: "Cosmic star dragon.\nIts body maps the universe." },
    ],
  },
  {
    lineId: "dream",
    type: "DREAM",
    typeClr: "#C8A0FF",
    typeBg: "#100820",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#AA88EE",
    eggEmoji: "💤",
    stages: [
      { id: "drowzee", name: "DROWZEE", Sprite: DrowzeeSprite, type: "DREAM", typeClr: "#C8A0FF", color: "#D8C8F8", glow: "#C8A0FF", hp: 98, atk: 14, def: 11, evoLv: 14, desc: "Sleepy cloud puff.\nAlways dreaming of sweet things." },
      { id: "slumbear", name: "SLUMBEAR", Sprite: SlumbearSprite, type: "DREAM", typeClr: "#C8A0FF", color: "#C8B8F0", glow: "#BB99EE", hp: 124, atk: 21, def: 16, evoLv: 28, desc: "Dream cloud bear.\nZzz floats where it sleeps." },
      { id: "dreamon", name: "DREAMON", Sprite: DreamonSprite, type: "DREAM", typeClr: "#C8A0FF", color: "#8866CC", glow: "#CC99FF", hp: 152, atk: 29, def: 22, evoLv: null, desc: "Celestial dream guardian.\nProtects all sleeping minds." },
    ],
  },
  {
    lineId: "dino",
    type: "DINO",
    typeClr: "#44BB33",
    typeBg: "#001A00",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#44BB33",
    eggEmoji: "🦕",
    stages: [
      { id: "dinkit", name: "DINKIT", Sprite: DinkitSprite, type: "DINO", typeClr: "#44BB33", color: "#77CC55", glow: "#44BB33", hp: 100, atk: 12, def: 10, evoLv: 12, desc: "Baby dino hatchling.\nStubby arms, huge appetite." },
      { id: "roarex", name: "ROAREX", Sprite: RoarexSprite, type: "DINO", typeClr: "#44BB33", color: "#3A9930", glow: "#55CC44", hp: 128, atk: 18, def: 16, evoLv: 25, desc: "Teen dino with wings.\nRoar echoes through valleys." },
      { id: "terrex", name: "TERREX", Sprite: TerrexSprite, type: "DINO", typeClr: "#44BB33", color: "#2A7722", glow: "#44AA22", hp: 160, atk: 25, def: 22, evoLv: null, desc: "Dino apex predator.\nSpine fins radiate power." },
    ],
  },
  {
    lineId: "angel",
    type: "ANGEL",
    typeClr: "#FFE066",
    typeBg: "#1A1600",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#FFFFFF",
    eggEmoji: "😇",
    stages: [
      { id: "halowing", name: "HALOWING", Sprite: HalowingSprite, type: "ANGEL", typeClr: "#FFE066", color: "#F0F0FF", glow: "#FFD700", hp: 106, atk: 15, def: 13, evoLv: 16, desc: "Baby angel bird.\nHalo glows gold in sunlight." },
      { id: "wingard", name: "WINGARD", Sprite: WingardSprite, type: "ANGEL", typeClr: "#FFE066", color: "#E8E8FF", glow: "#FFEE88", hp: 134, atk: 22, def: 19, evoLv: 30, desc: "Guardian angel bird.\nWings carry warmth and hope." },
      { id: "seraphon", name: "SERAPHON", Sprite: SeraphonSprite, type: "ANGEL", typeClr: "#FFE066", color: "#D8D8FF", glow: "#FFD700", hp: 164, atk: 30, def: 26, evoLv: null, desc: "Six-winged seraph.\nIts halo lights the whole sky." },
    ],
  },
  {
    lineId: "candy",
    type: "CANDY",
    typeClr: "#FF66AA",
    typeBg: "#1A000E",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#FF66AA",
    eggEmoji: "🍬",
    stages: [
      { id: "sweetlet", name: "SWEETLET", Sprite: SweetletSprite, type: "CANDY", typeClr: "#FF66AA", color: "#FF99CC", glow: "#FF66AA", hp: 98, atk: 14, def: 11, evoLv: 14, desc: "Sweet candy blob.\nLeaves a sugary trail behind." },
      { id: "sugarpaw", name: "SUGARPAW", Sprite: SugarpawSprite, type: "CANDY", typeClr: "#FF66AA", color: "#FFAADD", glow: "#FF88BB", hp: 124, atk: 21, def: 16, evoLv: 28, desc: "Candy cat with lollipop.\nPurrs in rainbow flavors." },
      { id: "candrix", name: "CANDRIX", Sprite: CandrixSprite, type: "CANDY", typeClr: "#FF66AA", color: "#CC2277", glow: "#FF55AA", hp: 152, atk: 29, def: 22, evoLv: null, desc: "Rainbow candy dragon.\nScales taste like every flavor." },
    ],
  },
  {
    lineId: "music",
    type: "MUSIC",
    typeClr: "#7799FF",
    typeBg: "#000A1A",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#5577DD",
    eggEmoji: "🎵",
    stages: [
      { id: "lyrito", name: "LYRITO", Sprite: LyritoSprite, type: "MUSIC", typeClr: "#7799FF", color: "#5588FF", glow: "#7799FF", hp: 98, atk: 15, def: 9, evoLv: 14, desc: "Note-shaped creature.\nSings one pure tone always." },
      { id: "melodew", name: "MELODEW", Sprite: MelodewSprite, type: "MUSIC", typeClr: "#7799FF", color: "#3355BB", glow: "#6688EE", hp: 124, atk: 22, def: 14, evoLv: 28, desc: "Musical note bird.\nWings beat in perfect rhythm." },
      { id: "symphox", name: "SYMPHOX", Sprite: SymphoxSprite, type: "MUSIC", typeClr: "#7799FF", color: "#2244AA", glow: "#AACCFF", hp: 152, atk: 30, def: 20, evoLv: null, desc: "Sound wave fox-bird.\nMane resonates with all music." },
    ],
  },
  {
    lineId: "dark",
    type: "DARK",
    typeClr: "#AAAAFF",
    typeBg: "#030310",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#444488",
    eggEmoji: "🌑",
    stages: [
      { id: "shadaowolf", name: "SHADAOWOLF", Sprite: ShadaowolfSprite, type: "DARK", typeClr: "#AAAAFF", color: "#2A2A3A", glow: "#AAAAFF", hp: 98, atk: 15, def: 9, evoLv: 14, desc: "Shadow wolf pup.\nSilver eyes peer from the dark." },
      { id: "nightfang", name: "NIGHTFANG", Sprite: NightfangSprite, type: "DARK", typeClr: "#AAAAFF", color: "#22223A", glow: "#9999EE", hp: 124, atk: 22, def: 14, evoLv: 28, desc: "Star-pattern wolf teen.\nConstellations dot its fur." },
      { id: "voidhowl", name: "VOIDHOWL", Sprite: VoidhowlSprite, type: "DARK", typeClr: "#AAAAFF", color: "#18183A", glow: "#CCCCFF", hp: 152, atk: 30, def: 20, evoLv: null, desc: "Void wolf sovereign.\nHowls silence the cosmos." },
    ],
  },
  {
    lineId: "mech",
    type: "MECH",
    typeClr: "#00FFCC",
    typeBg: "#001A14",
    rarity: "rare",
    rarityLabel: "★★ Rare",
    rarityClr: "#63C0FF",
    eggColor: "#00CCAA",
    eggEmoji: "🤖",
    stages: [
      { id: "boltchick", name: "BOLTCHICK", Sprite: BoltchickSprite, type: "MECH", typeClr: "#00FFCC", color: "#8899AA", glow: "#00FFCC", hp: 98, atk: 14, def: 12, evoLv: 14, desc: "Robot bird hatchling.\nLED eyes blink in morse code." },
      { id: "gearbot", name: "GEARBOT", Sprite: GearbotSprite, type: "MECH", typeClr: "#00FFCC", color: "#667788", glow: "#00DDAA", hp: 124, atk: 21, def: 18, evoLv: 28, desc: "Gear-chest robot.\nChest core spins with power." },
      { id: "titanmech", name: "TITANMECH", Sprite: TitanmechSprite, type: "MECH", typeClr: "#00FFCC", color: "#445566", glow: "#00FFCC", hp: 152, atk: 29, def: 24, evoLv: null, desc: "Mega mech warrior.\nJet boots breach the sky." },
    ],
  },
  {
    lineId: "coral",
    type: "CORAL",
    typeClr: "#FF8855",
    typeBg: "#1A0800",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#FF7744",
    eggEmoji: "🪸",
    stages: [
      { id: "spiklet", name: "SPIKLET", Sprite: SpikletSprite, type: "CORAL", typeClr: "#FF8855", color: "#FFAA66", glow: "#FF8855", hp: 100, atk: 11, def: 11, evoLv: 12, desc: "Spiny sea urchin.\nSpines glow orange underwater." },
      { id: "starfish", name: "STARFISH", Sprite: StarfishSprite, type: "CORAL", typeClr: "#FF8855", color: "#FF7733", glow: "#FF9944", hp: 128, atk: 17, def: 17, evoLv: 25, desc: "Star creature.\nEach tip senses ocean currents." },
      { id: "reefqueen", name: "REEFQUEEN", Sprite: ReefqueenSprite, type: "CORAL", typeClr: "#FF8855", color: "#CC3366", glow: "#FF5588", hp: 160, atk: 24, def: 23, evoLv: null, desc: "Coral dragon queen.\nAnemone mane feeds the reef." },
    ],
  },
  {
    lineId: "cloud",
    type: "CLOUD",
    typeClr: "#AACCFF",
    typeBg: "#080E18",
    rarity: "common",
    rarityLabel: "★ Common",
    rarityClr: "#B9B9B9",
    eggColor: "#AACCFF",
    eggEmoji: "☁️",
    stages: [
      { id: "pufflet", name: "PUFFLET", Sprite: PuffletSprite, type: "CLOUD", typeClr: "#AACCFF", color: "#EEF4FF", glow: "#AACCFF", hp: 100, atk: 10, def: 13, evoLv: 12, desc: "Tiny cloud puff.\nDrifts on the gentlest breeze." },
      { id: "nimbus", name: "NIMBUS", Sprite: NimbusSprite, type: "CLOUD", typeClr: "#AACCFF", color: "#C8D8F8", glow: "#99BBEE", hp: 128, atk: 16, def: 19, evoLv: 25, desc: "Storm cloud with bolts.\nLightning ears crackle in drizzle." },
      { id: "stormcloud", name: "STORMCLOUD", Sprite: StormcloudSprite, type: "CLOUD", typeClr: "#AACCFF", color: "#8899BB", glow: "#FFDD33", hp: 160, atk: 22, def: 26, evoLv: null, desc: "Thunder cloud titan.\nLightning crown rules the skies." },
    ],
  },
  {
    lineId: "lava2",
    type: "LAVA2",
    typeClr: "#FF3300",
    typeBg: "#1A0200",
    rarity: "superrare",
    rarityLabel: "★★★ Super Rare",
    rarityClr: "#FF7DFF",
    eggColor: "#CC1100",
    eggEmoji: "🌋",
    stages: [
      { id: "magpup", name: "MAGPUP", Sprite: MagpupSprite, type: "LAVA2", typeClr: "#FF3300", color: "#AA2200", glow: "#FF4400", hp: 106, atk: 16, def: 10, evoLv: 16, desc: "Magma puppy.\nPaws leave lava prints on stone." },
      { id: "moltenk9", name: "MOLTENK9", Sprite: Moltenk9Sprite, type: "LAVA2", typeClr: "#FF3300", color: "#661100", glow: "#FF3300", hp: 134, atk: 24, def: 16, evoLv: 30, desc: "Magma wolf with armor.\nLava seeps from its joints." },
      { id: "volcanovex", name: "VOLCANOVEX", Sprite: VolcanovexSprite, type: "LAVA2", typeClr: "#FF3300", color: "#440800", glow: "#FF2200", hp: 164, atk: 32, def: 22, evoLv: null, desc: "Volcano overlord dragon.\nEruption mane burns forever." },
    ],
  },
  {
    lineId: "crystal2",
    type: "CRYSTAL2",
    typeClr: "#88FFFF",
    typeBg: "#001818",
    rarity: "legendary",
    rarityLabel: "★★★★ Legendary",
    rarityClr: "#FFD700",
    eggColor: "#44EEFF",
    eggEmoji: "💎",
    stages: [
      { id: "gemkit", name: "GEMKIT", Sprite: GemkitSprite, type: "CRYSTAL2", typeClr: "#88FFFF", color: "#AAEEFF", glow: "#88FFFF", hp: 110, atk: 18, def: 13, evoLv: 20, desc: "Crystal seed creature.\nRefracts light into tiny rainbows." },
      { id: "prismark", name: "PRISMARK", Sprite: PrismarkSprite, type: "CRYSTAL2", typeClr: "#88FFFF", color: "#55AABB", glow: "#88EEFF", hp: 142, atk: 26, def: 20, evoLv: 35, desc: "Crystal prism golem.\nBody bends light into power." },
      { id: "diamondra", name: "DIAMONDRA", Sprite: DiamondraSprite, type: "CRYSTAL2", typeClr: "#88FFFF", color: "#2A6888", glow: "#88FFFF", hp: 175, atk: 35, def: 27, evoLv: null, desc: "Crystal dragon empress.\nRainbow light pours from within." },
    ],
  },
];

export const ALL_CATCH_IDS = CATCH_MON_LINES.flatMap((line) => line.stages.map((stage) => stage.id));

export const EGG_DROP = {
  common: ["flame", "wave", "leaf", "ice", "rock", "wind", "fairy", "sand", "dino", "coral", "cloud"],
  rare: ["bolt", "wind", "toxic", "metal", "flame", "wave", "ghost", "speed", "dream", "candy", "music", "dark", "mech"],
  superrare: ["shadow", "psychic", "crystal", "dragon", "nature", "cosmic", "angel", "lava2"],
  legendary: ["star", "lava", "ancient", "crystal2"],
};

export const PARTNER_UNLOCK_STARS = {
  flame: 0,
  wave: 0,
  leaf: 0,
  ice: 0,
  rock: 0,
  fairy: 0,
  sand: 0,
  dino: 0,
  coral: 0,
  cloud: 0,
  wind: 8,
  bolt: 8,
  toxic: 8,
  ghost: 8,
  speed: 10,
  dream: 10,
  candy: 12,
  music: 12,
  dark: 12,
  mech: 14,
  metal: 12,
  psychic: 16,
  shadow: 16,
  angel: 18,
  crystal: 20,
  cosmic: 20,
  dragon: 24,
  nature: 24,
  lava2: 28,
  star: 30,
  lava: 36,
  ancient: 40,
  crystal2: 44,
};

export function getCatchLineById(lineId) {
  return CATCH_MON_LINES.find((entry) => entry.lineId === lineId) ?? null;
}

export function getCatchStage(lineId, stageIdx = 0) {
  return getCatchLineById(lineId)?.stages?.[stageIdx] ?? null;
}

export function rollMonsterFromLine(lineId, ownedIds) {
  const line = getCatchLineById(lineId);
  if (!line) return null;

  const unowned = line.stages.filter((stage) => !ownedIds.includes(stage.id));
  if (unowned.length === 0) {
    return line.stages[Math.floor(Math.random() * line.stages.length)];
  }

  const weights = unowned.map((stage) => {
    const index = line.stages.indexOf(stage);
    return index === 0 ? 6 : index === 1 ? 3 : 1;
  });

  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < unowned.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return unowned[i];
  }

  return unowned[unowned.length - 1];
}

export function rollEggRarity(accuracy) {
  const roll = Math.random();
  if (accuracy === 1 && roll < 0.05) return "legendary";
  if (accuracy >= 0.9 && roll < 0.15) return "superrare";
  if (accuracy >= 0.7 && roll < 0.4) return "rare";
  return "common";
}
