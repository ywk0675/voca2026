import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outRoot = join(root, "public", "monsters");

const lines = [
  { lineId: "bolt", kind: "cat", glow: "#FFE55A", palette: ["#FFD84A", "#FFF09A", "#2F3B50", "#3EDBFF"], stages: [["zaplet", "ZAPLET"], ["thundermew", "THUNDERMEW"], ["voltiger", "VOLTIGER"]] },
  { lineId: "star", kind: "phoenix", glow: "#FFF2A6", palette: ["#FFD84D", "#FFF2B0", "#FF9F38", "#5A3BC7"], stages: [["stardust", "STARDUST"], ["cosmeling", "COSMELING"], ["galaxion", "GALAXION"]] },
  { lineId: "psychic", kind: "sphinx", glow: "#F2A8FF", palette: ["#D98BFF", "#F4CBFF", "#7B56B8", "#FFE484"], stages: [["psykit", "PSYKIT"], ["mindra", "MINDRA"], ["cerebron", "CEREBRON"]] },
  { lineId: "crystal", kind: "crystal", glow: "#BDF7FF", palette: ["#8FEFFF", "#E1FBFF", "#4AA8D0", "#F7CFFF"], stages: [["shimlit", "SHIMLIT"], ["prismite", "PRISMITE"], ["crystalith", "CRYSTALITH"]] },
  { lineId: "dragon", kind: "dragon", glow: "#FF9A6C", palette: ["#F25A3D", "#FFB08A", "#92231C", "#FFE084"], stages: [["drakeling", "DRAKELING"], ["scalefang", "SCALEFANG"], ["wyrmking", "WYRMKING"]] },
  { lineId: "nature", kind: "bug", glow: "#E7FF72", palette: ["#86D948", "#FFF06A", "#6840A8", "#FF82BE"], stages: [["larvix", "LARVIX"], ["chrysaming", "CHRYSAMING"], ["motheron", "MOTHERON"]] },
  { lineId: "lava", kind: "lava", glow: "#FF6A2A", palette: ["#FF4B1F", "#FFBA42", "#581108", "#2A0906"], stages: [["magmite", "MAGMITE"], ["inferite", "INFERITE"], ["volcanix", "VOLCANIX"]] },
  { lineId: "ancient", kind: "fossil", glow: "#D2B4FF", palette: ["#E9D4B5", "#FFF1D3", "#875CFF", "#C78342"], stages: [["fossilt", "FOSSILT"], ["archaeon", "ARCHAEON"], ["titanwrex", "TITANWREX"]] },
  { lineId: "cosmic", kind: "cosmic", glow: "#B785FF", palette: ["#8A5CFF", "#C7A5FF", "#23105D", "#63F4FF"], stages: [["voidpup", "VOIDPUP"], ["nebulark", "NEBULARK"], ["cosmodrake", "COSMODRAKE"]] },
  { lineId: "dream", kind: "dream", glow: "#DFC7FF", palette: ["#CBA7FF", "#F0E5FF", "#8063C7", "#FFE4A8"], stages: [["drowzee", "DROWZEE"], ["slumbear", "SLUMBEAR"], ["dreamon", "DREAMON"]] },
  { lineId: "dino", kind: "dino", glow: "#93EA62", palette: ["#58C447", "#AAE66A", "#226B2C", "#FFE08A"], stages: [["dinkit", "DINKIT"], ["roarex", "ROAREX"], ["terrex", "TERREX"]] },
  { lineId: "angel", kind: "angel", glow: "#FFF0A8", palette: ["#F7F4FF", "#FFE77A", "#D9E0FF", "#83C8FF"], stages: [["halowing", "HALOWING"], ["wingard", "WINGARD"], ["seraphon", "SERAPHON"]] },
  { lineId: "music", kind: "music", glow: "#8FB2FF", palette: ["#668CFF", "#C7D5FF", "#1F3DA2", "#FFE36D"], stages: [["lyrito", "LYRITO"], ["melodew", "MELODEW"], ["symphox", "SYMPHOX"]] },
  { lineId: "dark", kind: "wolf", glow: "#A7A8FF", palette: ["#2D2D55", "#8E91FF", "#111228", "#D8DBFF"], stages: [["shadaowolf", "SHADAOWOLF"], ["nightfang", "NIGHTFANG"], ["voidhowl", "VOIDHOWL"]] },
  { lineId: "mech", kind: "robot", glow: "#46FFE0", palette: ["#7C8A9C", "#D4E3EA", "#303C4C", "#00E8C8"], stages: [["boltchick", "BOLTCHICK"], ["gearbot", "GEARBOT"], ["titanmech", "TITANMECH"]] },
  { lineId: "cloud", kind: "cloud", glow: "#C7D8FF", palette: ["#DDE8FF", "#FFFFFF", "#7E91C5", "#FFE25B"], stages: [["pufflet", "PUFFLET"], ["nimbus", "NIMBUS"], ["stormcloud", "STORMCLOUD"]] },
  { lineId: "lava2", kind: "hound", glow: "#FF5B24", palette: ["#D73418", "#FF9B48", "#3C0C08", "#FFD16A"], stages: [["magpup", "MAGPUP"], ["moltenk9", "MOLTENK9"], ["volcanovex", "VOLCANOVEX"]] },
  { lineId: "crystal2", kind: "crystalDragon", glow: "#A6FCFF", palette: ["#84F3FF", "#E7FFFF", "#2F86AA", "#C9A7FF"], stages: [["gemkit", "GEMKIT"], ["prismark", "PRISMARK"], ["diamondra", "DIAMONDRA"]] },
  { lineId: "grovehart", kind: "deer", glow: "#D7FF7A", palette: ["#88CC55", "#F1E3B7", "#4E7A36", "#FFD870"], stages: [["budhoof", "BUDHOOF"], ["thornhart", "THORNHART"], ["eldercrown", "ELDERCROWN"]] },
  { lineId: "flutterbug", kind: "bug", glow: "#F4FF7A", palette: ["#BEEB5A", "#FFF06A", "#151820", "#79F7FF"], stages: [["nibblet", "NIBBLET"], ["glomoth", "GLOMOTH"], ["prismarip", "PRISMARIP"]] },
  { lineId: "cactusaur", kind: "dino", glow: "#9FF7FF", palette: ["#63BF55", "#F6B1C8", "#2E733A", "#FFC36B"], stages: [["prickletot", "PRICKLETOT"], ["saguaromp", "SAGUAROMP"], ["oasisaur", "OASISAUR"]] },
  { lineId: "frogspell", kind: "frog", glow: "#A8FFE0", palette: ["#55C790", "#F3E7B7", "#246D5E", "#C8A0FF"], stages: [["ribblet", "RIBBLET"], ["bogglyph", "BOGGLYPH"], ["chantoad", "CHANTOAD"]] },
  { lineId: "ramcloud", kind: "ram", glow: "#FFE25B", palette: ["#C9D8FF", "#FFFFFF", "#5F7199", "#FFD94A"], stages: [["woolwisp", "WOOLWISP"], ["galegrove", "GALEGROVE"], ["tempestag", "TEMPESTAG"]] },
  { lineId: "crystowl", kind: "owl", glow: "#DAB7FF", palette: ["#A880D8", "#F4F8FF", "#4A2F78", "#BDF7FF"], stages: [["glimhoot", "GLIMHOOT"], ["oracrix", "ORACRIX"], ["luminoracle", "LUMINORACLE"]] },
];

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char]));
const idSafe = (value) => value.replace(/[^a-z0-9_-]/gi, "_");
const e = (name, attrs = {}, body = "") => `<${name} ${Object.entries(attrs).map(([key, val]) => `${key}="${esc(val)}"`).join(" ")}>${body}</${name}>`;
const tag = (name, attrs = {}) => `<${name} ${Object.entries(attrs).map(([key, val]) => `${key}="${esc(val)}"`).join(" ")} />`;

function defs(line, stage) {
  const id = idSafe(`${line.lineId}_${stage}`);
  const [base, light, dark, accent] = line.palette;
  return `
    <defs>
      <radialGradient id="body_${id}" cx="35%" cy="24%" r="74%">
        <stop offset="0%" stop-color="${light}" />
        <stop offset="48%" stop-color="${base}" />
        <stop offset="100%" stop-color="${dark}" />
      </radialGradient>
      <linearGradient id="accent_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accent}" />
        <stop offset="100%" stop-color="${light}" />
      </linearGradient>
      <filter id="softShadow_${id}" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#101424" flood-opacity="0.34"/>
        <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="${line.glow}" flood-opacity="0.58"/>
      </filter>
    </defs>`;
}

function eyes(x, y, scale = 1, color = "#172032", fierce = false) {
  const brow = fierce
    ? `${tag("path", { d: `M ${x - 58 * scale} ${y - 44 * scale} L ${x - 16 * scale} ${y - 58 * scale}`, stroke: color, "stroke-width": 13 * scale, "stroke-linecap": "round" })}
       ${tag("path", { d: `M ${x + 16 * scale} ${y - 58 * scale} L ${x + 58 * scale} ${y - 44 * scale}`, stroke: color, "stroke-width": 13 * scale, "stroke-linecap": "round" })}`
    : "";
  return `
    ${tag("ellipse", { cx: x - 42 * scale, cy: y, rx: 34 * scale, ry: 43 * scale, fill: "#fff" })}
    ${tag("ellipse", { cx: x + 42 * scale, cy: y, rx: 34 * scale, ry: 43 * scale, fill: "#fff" })}
    ${tag("ellipse", { cx: x - 36 * scale, cy: y + 7 * scale, rx: 20 * scale, ry: 27 * scale, fill: color })}
    ${tag("ellipse", { cx: x + 48 * scale, cy: y + 7 * scale, rx: 20 * scale, ry: 27 * scale, fill: color })}
    ${tag("circle", { cx: x - 48 * scale, cy: y - 14 * scale, r: 8 * scale, fill: "#fff" })}
    ${tag("circle", { cx: x + 36 * scale, cy: y - 14 * scale, r: 8 * scale, fill: "#fff" })}
    ${brow}`;
}

function smile(x, y, scale = 1, color = "#172032") {
  return `${tag("path", { d: `M ${x - 34 * scale} ${y} Q ${x} ${y + 32 * scale} ${x + 34 * scale} ${y}`, fill: "none", stroke: color, "stroke-width": 12 * scale, "stroke-linecap": "round" })}`;
}

function sparkles(glow, stage) {
  const count = stage + 5;
  return Array.from({ length: count }, (_, i) => {
    const x = 138 + ((i * 167) % 760);
    const y = 112 + ((i * 223) % 690);
    const s = 15 + ((i + stage) % 4) * 8;
    return e("g", { opacity: 0.46 + (i % 3) * 0.14 }, `${tag("path", { d: `M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z`, fill: glow })}${tag("circle", { cx: x, cy: y, r: Math.max(4, s / 4), fill: "#fff" })}`);
  }).join("");
}

function appendStageMotifs(kind, stage, line, id) {
  const [base, light, dark, accent] = line.palette;
  const big = stage >= 2;
  const mid = stage >= 1;
  if (kind.includes("crystal")) {
    return `${[260, 760, 505, 610].map((x, i) => tag("path", { d: `M ${x} ${160 + i * 34} L ${x + 54} ${250 + i * 16} L ${x} ${350 + i * 10} L ${x - 54} ${250 + i * 16} Z`, fill: i % 2 ? accent : light, opacity: 0.78 })).join("")}`;
  }
  if (kind === "deer") {
    return `${tag("path", { d: "M416 310 C372 234 356 176 372 126 C414 166 436 222 446 298 Z", fill: accent, opacity: 0.9 })}
      ${tag("path", { d: "M600 310 C652 242 678 182 668 126 C616 162 588 222 570 298 Z", fill: accent, opacity: 0.9 })}
      ${stage >= 1 ? tag("path", { d: "M378 176 L318 128 M408 210 L346 186 M638 176 L700 128 M610 210 L672 186", stroke: accent, "stroke-width": 24, "stroke-linecap": "round", opacity: 0.85 }) : ""}
      ${stage >= 2 ? tag("path", { d: "M512 260 L544 176 L584 260 Z", fill: light, opacity: 0.82 }) : ""}`;
  }
  if (kind === "ram") {
    return `${tag("path", { d: "M380 362 C276 348 278 210 394 218 C344 250 340 320 404 328 Z", fill: light, opacity: 0.94 })}
      ${tag("path", { d: "M634 362 C738 348 736 210 620 218 C670 250 674 320 610 328 Z", fill: light, opacity: 0.94 })}
      ${stage >= 1 ? tag("path", { d: "M212 522 C284 456 356 448 430 502", fill: "none", stroke: accent, "stroke-width": 32, "stroke-linecap": "round", opacity: 0.7 }) : ""}
      ${stage >= 2 ? tag("path", { d: "M610 204 C754 260 820 378 790 536", fill: "none", stroke: accent, "stroke-width": 34, "stroke-linecap": "round", opacity: 0.62 }) : ""}`;
  }
  if (kind === "frog") {
    return `${[250, 766, 354, 668].map((x, i) => tag("circle", { cx: x, cy: 236 + i * 78, r: 30 + i * 4, fill: i % 2 ? light : accent, opacity: 0.56 })).join("")}
      ${stage >= 1 ? tag("path", { d: "M360 646 C452 590 582 590 674 646", fill: "none", stroke: accent, "stroke-width": 24, "stroke-linecap": "round", opacity: 0.86 }) : ""}
      ${stage >= 2 ? tag("circle", { cx: 512, cy: 720, r: 108, fill: accent, opacity: 0.16 }) : ""}`;
  }
  if (kind === "owl") {
    return `${tag("path", { d: "M408 288 L356 152 L488 246 Z", fill: accent, opacity: 0.9 })}
      ${tag("path", { d: "M610 288 L674 152 L706 322 Z", fill: accent, opacity: 0.9 })}
      ${stage >= 1 ? [360, 670, 508].map((x, i) => tag("path", { d: `M ${x} ${530 + i * 32} L ${x + 36} ${590 + i * 18} L ${x} ${660 + i * 12} L ${x - 36} ${590 + i * 18} Z`, fill: i % 2 ? light : accent, opacity: 0.78 })).join("") : ""}
      ${stage >= 2 ? tag("ellipse", { cx: 512, cy: 206, rx: 150, ry: 28, fill: accent, opacity: 0.56 }) : ""}`;
  }
  if (kind === "music") {
    return `${tag("path", { d: "M718 190 L718 445 Q676 418 628 437 Q580 456 592 496 Q604 538 660 530 Q720 520 741 469 L741 266 L845 304 L845 232 Z", fill: accent, opacity: 0.92 })}`;
  }
  if (kind === "cloud" || kind === "dream") {
    return `${mid ? tag("path", { d: "M655 308 L728 308 L675 414 L742 414 L606 604 L656 460 L596 460 Z", fill: accent, opacity: 0.9 }) : ""}
      ${big ? tag("ellipse", { cx: 520, cy: 180, rx: 146, ry: 30, fill: accent, opacity: 0.62 }) : ""}`;
  }
  if (["cat", "wolf", "hound", "sphinx", "deer", "ram"].includes(kind)) {
    return `${tag("path", { d: "M732 566 C842 546 872 436 824 350 C812 470 742 494 674 510 Z", fill: `url(#body_${id})` })}
      ${big ? tag("path", { d: "M210 500 C142 484 96 428 90 352 C178 354 232 410 256 486 Z", fill: accent, opacity: 0.9 }) : ""}`;
  }
  if (kind === "robot") {
    return `${tag("path", { d: "M482 142 L548 244 L416 244 Z", fill: accent })}${big ? tag("rect", { x: 222, y: 426, width: 134, height: 160, rx: 34, fill: dark, opacity: 0.92 }) : ""}`;
  }
  return "";
}

function body(line, stageIndex) {
  const id = idSafe(`${line.lineId}_${stageIndex}`);
  const [base, light, dark, accent] = line.palette;
  const kind = line.kind;
  const scale = 1 + stageIndex * 0.13;
  const fierce = stageIndex >= 2;

  if (["dragon", "cosmic", "crystalDragon"].includes(kind)) {
    return `
      ${tag("ellipse", { cx: 512, cy: 834, rx: 280, ry: 46, fill: "#101424", opacity: 0.18 })}
      <g filter="url(#softShadow_${id})" transform="translate(${stageIndex * -10} ${stageIndex * -18}) scale(${scale}) translate(${-512 * (scale - 1) / scale} ${-512 * (scale - 1) / scale})">
        ${tag("path", { d: "M270 690 C220 506 310 340 486 322 C654 306 782 430 742 620 C710 770 540 842 386 790 C326 770 288 736 270 690 Z", fill: `url(#body_${id})` })}
        ${tag("path", { d: "M308 416 C214 386 156 310 154 206 C262 220 332 292 366 406 Z", fill: dark, opacity: 0.88 })}
        ${tag("path", { d: "M650 420 C746 372 816 296 842 194 C728 208 650 288 614 408 Z", fill: dark, opacity: 0.88 })}
        ${tag("path", { d: "M402 318 L334 156 L486 254 Z", fill: accent })}
        ${tag("path", { d: "M612 328 L724 158 L748 364 Z", fill: accent })}
        ${tag("path", { d: "M716 618 C844 604 908 520 922 398 C952 560 852 718 704 740 Z", fill: dark })}
        ${tag("ellipse", { cx: 502, cy: 628, rx: 142, ry: 106, fill: light, opacity: 0.48 })}
        ${appendStageMotifs(kind, stageIndex, line, id)}
        ${eyes(514, 452, 1.04, kind === "cosmic" ? "#25105E" : "#172032", fierce)}
        ${smile(534, 552, 1.04)}
      </g>`;
  }

  if (["phoenix", "angel", "music", "bug", "owl"].includes(kind)) {
    return `
      ${tag("ellipse", { cx: 512, cy: 842, rx: 242, ry: 42, fill: "#101424", opacity: 0.16 })}
      <g filter="url(#softShadow_${id})" transform="scale(${scale}) translate(${(1 - scale) * 392} ${(1 - scale) * 390})">
        ${tag("path", { d: "M354 604 C230 566 150 436 160 250 C324 292 438 412 478 600 Z", fill: dark, opacity: 0.88 })}
        ${tag("path", { d: "M668 606 C796 552 872 420 860 244 C702 292 584 416 548 602 Z", fill: dark, opacity: 0.88 })}
        ${tag("path", { d: "M362 660 C342 482 420 310 532 298 C646 286 720 470 676 658 C642 794 478 822 404 744 C380 720 366 692 362 660 Z", fill: `url(#body_${id})` })}
        ${tag("path", { d: "M502 314 L578 198 L606 342 Z", fill: accent })}
        ${tag("path", { d: "M460 334 L390 230 L402 370 Z", fill: accent, opacity: 0.72 })}
        ${appendStageMotifs(kind, stageIndex, line, id)}
        ${eyes(520, 466, 1, "#172032", fierce)}
        ${kind === "angel" ? tag("ellipse", { cx: 520, cy: 206, rx: 142, ry: 32, fill: accent, opacity: 0.82 }) : ""}
        ${smile(524, 560, 0.92)}
      </g>`;
  }

  if (["cat", "wolf", "hound", "sphinx", "deer", "ram", "dino", "fossil", "lava"].includes(kind)) {
    const dinoHead = kind === "dino" || kind === "fossil" || kind === "lava";
    return `
      ${tag("ellipse", { cx: 512, cy: 842, rx: 250, ry: 44, fill: "#101424", opacity: 0.17 })}
      <g filter="url(#softShadow_${id})" transform="scale(${scale}) translate(${(1 - scale) * 410} ${(1 - scale) * 450})">
        ${tag("path", { d: "M268 660 C250 500 354 370 520 370 C690 370 782 510 730 670 C684 808 488 842 354 760 C304 730 276 700 268 660 Z", fill: `url(#body_${id})` })}
        ${tag("path", { d: dinoHead ? "M548 302 C672 264 792 322 820 438 C724 452 640 434 580 380 Z" : "M352 368 L274 198 L440 318 Z", fill: dark })}
        ${!dinoHead ? tag("path", { d: "M598 350 L720 202 L718 408 Z", fill: dark }) : ""}
        ${appendStageMotifs(kind, stageIndex, line, id)}
        ${stageIndex >= 1 ? tag("path", { d: "M402 374 L454 252 L500 378 Z", fill: accent, opacity: 0.9 }) : ""}
        ${stageIndex >= 2 ? tag("path", { d: "M540 370 L602 226 L654 384 Z", fill: accent, opacity: 0.9 }) : ""}
        ${tag("ellipse", { cx: 516, cy: 654, rx: 132, ry: 96, fill: light, opacity: 0.48 })}
        ${eyes(dinoHead ? 630 : 520, dinoHead ? 412 : 496, 1, "#172032", fierce)}
        ${smile(dinoHead ? 650 : 530, dinoHead ? 508 : 588, 0.92)}
      </g>`;
  }

  if (["cloud", "dream"].includes(kind)) {
    return `
      ${tag("ellipse", { cx: 512, cy: 840, rx: 252, ry: 44, fill: "#101424", opacity: 0.14 })}
      <g filter="url(#softShadow_${id})" transform="scale(${scale}) translate(${(1 - scale) * 408} ${(1 - scale) * 438})">
        ${tag("ellipse", { cx: 382, cy: 596, rx: 152, ry: 128, fill: `url(#body_${id})` })}
        ${tag("ellipse", { cx: 514, cy: 516, rx: 180, ry: 154, fill: light })}
        ${tag("ellipse", { cx: 648, cy: 606, rx: 170, ry: 132, fill: `url(#body_${id})` })}
        ${tag("ellipse", { cx: 512, cy: 676, rx: 262, ry: 112, fill: base })}
        ${appendStageMotifs(kind, stageIndex, line, id)}
        ${eyes(520, 590, 0.96, "#172032", false)}
        ${smile(522, 674, 0.9)}
      </g>`;
  }

  if (kind === "frog") {
    return `
      ${tag("ellipse", { cx: 512, cy: 842, rx: 250, ry: 44, fill: "#101424", opacity: 0.15 })}
      <g filter="url(#softShadow_${id})" transform="scale(${scale}) translate(${(1 - scale) * 400} ${(1 - scale) * 438})">
        ${tag("ellipse", { cx: 382, cy: 396, rx: 82, ry: 74, fill: `url(#body_${id})` })}
        ${tag("ellipse", { cx: 642, cy: 396, rx: 82, ry: 74, fill: `url(#body_${id})` })}
        ${tag("path", { d: "M268 640 C244 470 350 346 512 346 C674 346 780 470 756 640 C732 792 564 846 408 790 C324 758 282 704 268 640 Z", fill: `url(#body_${id})` })}
        ${tag("ellipse", { cx: 510, cy: 666, rx: 158, ry: 108, fill: light, opacity: 0.54 })}
        ${appendStageMotifs(kind, stageIndex, line, id)}
        ${eyes(512, 406, 1.04, "#172032", fierce)}
        ${smile(518, 552, 1)}
      </g>`;
  }

  if (["robot", "crystal"].includes(kind)) {
    return `
      ${tag("ellipse", { cx: 512, cy: 840, rx: 252, ry: 44, fill: "#101424", opacity: 0.17 })}
      <g filter="url(#softShadow_${id})" transform="scale(${scale}) translate(${(1 - scale) * 410} ${(1 - scale) * 440})">
        ${tag("path", { d: "M300 704 L284 442 L410 300 L626 300 L746 446 L724 704 L614 804 L414 804 Z", fill: `url(#body_${id})` })}
        ${tag("path", { d: "M342 466 L216 390 L236 628 L332 584 Z", fill: dark })}
        ${tag("path", { d: "M690 466 L822 390 L790 628 L700 584 Z", fill: dark })}
        ${appendStageMotifs(kind, stageIndex, line, id)}
        ${tag("rect", { x: 420, y: 468, width: 86, height: 76, rx: 24, fill: "#F5FFFF" })}
        ${tag("rect", { x: 548, y: 468, width: 86, height: 76, rx: 24, fill: "#F5FFFF" })}
        ${tag("rect", { x: 444, y: 492, width: 38, height: 34, rx: 10, fill: "#172032" })}
        ${tag("rect", { x: 572, y: 492, width: 38, height: 34, rx: 10, fill: "#172032" })}
        ${tag("path", { d: "M464 634 L594 634", stroke: "#172032", "stroke-width": 16, "stroke-linecap": "round" })}
      </g>`;
  }

  return "";
}

function svgFor(line, stageIndex, name, chroma = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${chroma ? tag("rect", { width: 1024, height: 1024, fill: "#00ff00" }) : ""}
    ${defs(line, stageIndex)}
    ${sparkles(line.glow, stageIndex)}
    ${body(line, stageIndex)}
    <title>${esc(name)}</title>
  </svg>`;
}

async function renderPng(svg, outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1024 },
    background: "rgba(0, 0, 0, 0)",
  });
  const pngData = resvg.render().asPng();
  await writeFile(outputPath, pngData);
}

let count = 0;
for (const line of lines) {
  for (const [stageIndex, [stageId, name]] of line.stages.entries()) {
    const finalPath = join(outRoot, line.lineId, `${stageId}.png`);
    const sourcePath = join(outRoot, line.lineId, "_source", `${stageId}-chroma.png`);
    await renderPng(svgFor(line, stageIndex, name, false), finalPath);
    await renderPng(svgFor(line, stageIndex, name, true), sourcePath);
    count += 1;
    console.log(`generated ${line.lineId}/${stageId}`);
  }
}

console.log(`done ${count} monster stages`);
