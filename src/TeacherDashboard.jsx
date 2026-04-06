import React, { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import { BOOK_SERIES } from "./wordCatalog.js";

export default function TeacherDashboard({ onExit }) {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState("updated_at");
  const [selected, setSelected] = useState(new Set()); // 선택된 row id들
  const [confirm, setConfirm]   = useState(null); // { type, ids, names }
  const [msg, setMsg]           = useState("");

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    setSelected(new Set());
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("progress").select("*").order("updated_at", { ascending: false });
    if (!error && data) setRows(data);
    setLoading(false);
  }

  // ── 단일 액션 ──
  async function doKick(ids) {
    if (!supabase) return;
    await supabase.from("progress").delete().in("id", ids);
    setRows(r => r.filter(x => !ids.includes(x.id)));
    setSelected(new Set());
    flash(`${ids.length}명 킥 완료`);
    setConfirm(null);
  }

  async function doBan(ids) {
    if (!supabase) return;
    for (const id of ids) {
      const row = rows.find(r => r.id === id);
      if (!row) continue;
      const newData = { ...(row.data || {}), banned: true };
      await supabase.from("progress").update({ data: newData }).eq("id", id);
      setRows(r => r.map(x => x.id === id ? { ...x, data: newData } : x));
    }
    setSelected(new Set());
    flash(`${ids.length}명 밴 완료`);
    setConfirm(null);
  }

  async function doUnban(ids) {
    if (!supabase) return;
    for (const id of ids) {
      const row = rows.find(r => r.id === id);
      if (!row) continue;
      const newData = { ...(row.data || {}), banned: false };
      await supabase.from("progress").update({ data: newData }).eq("id", id);
      setRows(r => r.map(x => x.id === id ? { ...x, data: newData } : x));
    }
    setSelected(new Set());
    flash(`${ids.length}명 밴 해제 완료`);
  }

  function flash(text) {
    setMsg(text);
    setTimeout(() => setMsg(""), 2500);
  }

  function getStats(d = {}) {
    const stars = Object.values(d.unitStars || {});
    const totalStars = stars.reduce((a, b) => a + b, 0);
    const unitsCompleted = [...new Set(
      Object.keys(d.unitStars || {}).map(k => k.split("_")[1])
    )].filter(Boolean).length;
    const book = BOOK_SERIES?.find(b => b.id === d.curBook);
    return {
      totalStars, unitsCompleted,
      bookName: book ? book.subtitle : d.curBook || "-",
      monLv: d.monLv || 1,
      banned: !!d.banned,
    };
  }

  function formatDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d) / 86400000);
    if (diff === 0) return "오늘";
    if (diff === 1) return "어제";
    if (diff < 7) return `${diff}일 전`;
    return d.toLocaleDateString("ko-KR");
  }

  const filtered = rows
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "updated_at") return new Date(b.updated_at) - new Date(a.updated_at);
      if (sortBy === "stars") return getStats(b.data).totalStars - getStats(a.data).totalStars;
      if (sortBy === "name") return a.name.localeCompare(b.name, "ko");
      return 0;
    });

  const allChecked = filtered.length > 0 && filtered.every(r => selected.has(r.id));
  const someChecked = filtered.some(r => selected.has(r.id));

  function toggleAll() {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  }

  function toggleOne(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selRows = filtered.filter(r => selected.has(r.id));
  const selNames = selRows.map(r => r.name);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg,#0D0A1A 0%,#1A1030 100%)",
      fontFamily: "'Nunito',sans-serif", color: "#fff",
    }}>
      {/* 헤더 */}
      <div style={{
        background: "#12101E", borderBottom: "2px solid #2A2448",
        padding: "16px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#F5C842" }}>📊 관리자 대시보드</div>
          <div style={{ fontSize: 12, color: "#8878AA", marginTop: 2 }}>
            전체 {rows.length}명 · 밴 {rows.filter(r => r.data?.banned).length}명
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={fetchAll} style={btn("#2A2448")}>🔄 새로고침</button>
          <button onClick={onExit} style={btn("#3A1428")}>← 나가기</button>
        </div>
      </div>

      {/* 플래시 메시지 */}
      {msg && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          background: "#2A4A2A", border: "1px solid #44CC77", borderRadius: 10,
          padding: "10px 20px", color: "#44CC77", fontWeight: 700, zIndex: 999, fontSize: 14,
        }}>{msg}</div>
      )}

      {/* 검색 + 정렬 */}
      <div style={{ padding: "16px 20px", display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="🔍 이름 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 140, padding: "9px 14px",
            borderRadius: 10, border: "2px solid #2E2848",
            background: "#13102A", color: "#fff", fontSize: 14, outline: "none",
          }}
        />
        {[["updated_at","최근접속순"],["stars","별점순"],["name","이름순"]].map(([k,l]) => (
          <button key={k} onClick={() => setSortBy(k)}
            style={btn(sortBy === k ? "#5533AA" : "#2A2448")}>{l}
          </button>
        ))}
      </div>

      {/* 일괄 액션 바 */}
      {someChecked && (
        <div style={{
          margin: "0 20px 12px", padding: "12px 16px",
          background: "#1E1840", border: "2px solid #5533AA",
          borderRadius: 12, display: "flex", alignItems: "center",
          gap: 12, flexWrap: "wrap",
        }}>
          <span style={{ fontWeight: 700, color: "#C0A8FF", fontSize: 14 }}>
            {selected.size}명 선택됨
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => setConfirm({ type: "ban", ids: [...selected], names: selNames })}
              style={actionBtn("#2A1400","#FF9933")}>
              🚫 선택 밴
            </button>
            <button
              onClick={() => doUnban([...selected])}
              style={actionBtn("#1A3A1A","#44CC77")}>
              ✅ 선택 밴해제
            </button>
            <button
              onClick={() => setConfirm({ type: "kick", ids: [...selected], names: selNames })}
              style={actionBtn("#3A0808","#FF4444")}>
              👢 선택 킥
            </button>
          </div>
          <button onClick={() => setSelected(new Set())}
            style={{ marginLeft: "auto", ...actionBtn("#2A2448","#8878AA") }}>
            선택 해제
          </button>
        </div>
      )}

      {/* Supabase 미연결 안내 */}
      {!supabase && (
        <div style={{ margin: "20px", padding: 20, background: "#2A1010",
          borderRadius: 12, border: "1px solid #FF4444", color: "#FF8888", textAlign: "center" }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>⚠️ Supabase 미연결</div>
          <div style={{ fontSize: 13 }}>Vercel 환경변수에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON을 설정해주세요.</div>
        </div>
      )}

      {/* 테이블 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8878AA" }}>불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8878AA" }}>학생 데이터 없음</div>
      ) : (
        <div style={{ overflowX: "auto", padding: "0 20px 40px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#1C182E" }}>
                <th style={{ ...thStyle, width: 40 }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll}
                    style={{ cursor: "pointer", width: 16, height: 16, accentColor: "#7744FF" }} />
                </th>
                {["이름","교재","유닛","별점","Lv","마지막 접속","상태","액션"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const s = getStats(row.data);
                const isSelected = selected.has(row.id);
                return (
                  <tr key={row.id} style={{
                    background: isSelected ? "#1E1840" : s.banned ? "#1A0A0A" : i % 2 === 0 ? "#13102A" : "#16132E",
                    outline: isSelected ? "1px solid #5533AA" : "none",
                  }}>
                    <td style={{ ...td, textAlign: "center" }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleOne(row.id)}
                        style={{ cursor: "pointer", width: 16, height: 16, accentColor: "#7744FF" }} />
                    </td>
                    <td style={td}>
                      <span style={{ fontWeight: 700, color: s.banned ? "#FF6666" : "#E0D0FF" }}>
                        {s.banned ? "🚫 " : ""}{row.name}
                      </span>
                    </td>
                    <td style={td}><span style={{ color: "#F5C842" }}>{s.bookName}</span></td>
                    <td style={td}>{s.unitsCompleted}유닛</td>
                    <td style={td}><span style={{ color: "#F5C842" }}>{s.totalStars}★</span></td>
                    <td style={td}>Lv.{s.monLv}</td>
                    <td style={{ ...td, color: "#8878AA" }}>{formatDate(row.updated_at)}</td>
                    <td style={td}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                        background: s.banned ? "#3A0A0A" : "#0A2A0A",
                        color: s.banned ? "#FF6666" : "#44CC77",
                        border: `1px solid ${s.banned ? "#FF444444" : "#44CC7744"}`,
                      }}>
                        {s.banned ? "밴" : "정상"}
                      </span>
                    </td>
                    <td style={{ ...td, whiteSpace: "nowrap" }}>
                      {s.banned ? (
                        <button onClick={() => doUnban([row.id])} style={actionBtn("#1A3A1A","#44CC77")}>
                          밴 해제
                        </button>
                      ) : (
                        <>
                          <button onClick={() => setConfirm({ type:"ban", ids:[row.id], names:[row.name] })}
                            style={actionBtn("#2A1A0A","#FF9933")}>밴</button>
                          <button onClick={() => setConfirm({ type:"kick", ids:[row.id], names:[row.name] })}
                            style={{ ...actionBtn("#2A0A0A","#FF4444"), marginLeft: 6 }}>킥</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 확인 모달 */}
      {confirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 20,
        }} onClick={() => setConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#1A1630", border: "2px solid #3A2A50",
            borderRadius: 16, padding: 28, maxWidth: 360, width: "100%", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              {confirm.type === "kick" ? "👢" : "🚫"}
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
              {confirm.type === "kick" ? "킥 확인" : "밴 확인"}
            </div>
            {/* 선택된 이름 목록 */}
            <div style={{
              background: "#12101E", borderRadius: 10, padding: "10px 14px",
              marginBottom: 14, maxHeight: 120, overflowY: "auto", textAlign: "left",
            }}>
              {confirm.names.map(n => (
                <div key={n} style={{ color: "#F5C842", fontSize: 13, padding: "2px 0" }}>• {n}</div>
              ))}
            </div>
            <div style={{ color: "#A090CC", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              {confirm.ids.length}명을{" "}
              {confirm.type === "kick"
                ? "킥하면 모든 진행 데이터가 삭제됩니다."
                : "밴하면 로그인이 차단됩니다. 언제든 해제 가능합니다."}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirm(null)}
                style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none",
                  background: "#2A2448", color: "#8878AA", cursor: "pointer", fontWeight: 700 }}>
                취소
              </button>
              <button
                onClick={() => confirm.type === "kick" ? doKick(confirm.ids) : doBan(confirm.ids)}
                style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", fontWeight: 700,
                  cursor: "pointer", color: "#fff",
                  background: confirm.type === "kick"
                    ? "linear-gradient(135deg,#881010,#CC2222)"
                    : "linear-gradient(135deg,#7A4000,#CC6600)",
                  boxShadow: confirm.type === "kick" ? "0 4px 0 #440000" : "0 4px 0 #3A2000",
                }}>
                {confirm.type === "kick" ? "👢 킥" : "🚫 밴"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const td = { padding: "11px 12px", borderBottom: "1px solid #1E1A30" };
const thStyle = {
  padding: "12px 12px", textAlign: "left", color: "#A090CC",
  fontWeight: 700, borderBottom: "2px solid #2E2848", whiteSpace: "nowrap",
};
function btn(bg) {
  return {
    padding: "8px 14px", borderRadius: 10, border: "none",
    background: bg, color: "#C0B0E0", fontSize: 13,
    cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap",
  };
}
function actionBtn(bg, color) {
  return {
    padding: "5px 12px", borderRadius: 8, border: `1px solid ${color}44`,
    background: bg, color, fontSize: 12, cursor: "pointer", fontWeight: 700,
  };
}
