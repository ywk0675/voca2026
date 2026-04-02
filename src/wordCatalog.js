// Book metadata and small helpers split out of wordData.js.
export const BOOK_SERIES = [
  // ?? Wonderful World ??????????????????????????????????
  { id:"wwp1", title:"Wonderful World Prime", subtitle:"Prime Lv.1", color:"#FFD700", emoji:"📘", units:12, group:"ww" },
  { id:"wwp2", title:"Wonderful World Prime", subtitle:"Prime Lv.2", color:"#FFC000", emoji:"📘", units:12, group:"ww" },
  { id:"wwp3", title:"Wonderful World Prime", subtitle:"Prime Lv.3", color:"#FFB000", emoji:"📘", units:12, group:"ww" },
  { id:"ww5",  title:"Wonderful World",       subtitle:"Basic Lv.5", color:"#F5C842", emoji:"📙", units:12, group:"ww" },
  // ?? 1000 Basic English Words ?????????????????????????
  { id:"bew2", title:"1000 Basic English Words", subtitle:"Book 2", color:"#44CC77", emoji:"📗", units:12, group:"bew" },
  { id:"bew3", title:"1000 Basic English Words", subtitle:"Book 3", color:"#4488FF", emoji:"📘", units:12, group:"bew" },
  { id:"bew4", title:"1000 Basic English Words", subtitle:"Book 4", color:"#FF8844", emoji:"📕", units:12, group:"bew" },
  // ?? 2000 Core English Words ??????????????????????????
  { id:"cew1", title:"2000 Core English Words", subtitle:"Book 1", color:"#22DDAA", emoji:"📚", units:16, group:"cew" },
  { id:"cew2", title:"2000 Core English Words", subtitle:"Book 2", color:"#11CCBB", emoji:"📚", units:16, group:"cew" },
  { id:"cew3", title:"2000 Core English Words", subtitle:"Book 3", color:"#00BBCC", emoji:"📚", units:16, group:"cew" },
  { id:"cew4", title:"2000 Core English Words", subtitle:"Book 4", color:"#0099CC", emoji:"📚", units:16, group:"cew" },
  // ?? 4000 Essential English Words ?????????????????????
  { id:"eew1", title:"4000 Essential English Words", subtitle:"Book 1", color:"#FF6644", emoji:"📒", units:30, group:"eew" },
  { id:"eew2", title:"4000 Essential English Words", subtitle:"Book 2", color:"#FF4466", emoji:"📒", units:30, group:"eew" },
  { id:"eew3", title:"4000 Essential English Words", subtitle:"Book 3", color:"#EE2255", emoji:"📒", units:30, group:"eew" },
  { id:"eew4", title:"4000 Essential English Words", subtitle:"Book 4", color:"#CC1144", emoji:"📒", units:30, group:"eew" },
  { id:"eew5", title:"4000 Essential English Words", subtitle:"Book 5", color:"#BB0033", emoji:"📒", units:30, group:"eew" },
  { id:"eew6", title:"4000 Essential English Words", subtitle:"Book 6", color:"#990022", emoji:"📒", units:30, group:"eew" },
];

const UNIT_EMOJIS = ["🌟","🔥","💧","🌿","⚡","🪄","🧠","🌀","🎯","🛡️","🏆","📘"];

export function getUnitInfo(bookId, unitNum) {
  const book = BOOK_SERIES.find(b=>b.id===bookId);
  return { id:unitNum, name:`Unit ${unitNum}`, short:`Unit ${unitNum}`,
    emoji: UNIT_EMOJIS[(unitNum-1)%12], color: book?.color||'#F5C842' };
}

// Wonderful World Basic Lv.5 ??original 87 words

