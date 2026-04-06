import React, { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import { BOOK_SERIES } from "./wordCatalog.js";

export default function TeacherDashboard({ onExit }) {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState("updated_at");
  const [confirm, setConfirm] = useState(null); // { type:"kick"|"ban", row }
  const [msg, setMsg]         = useState("");

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) setRows(data);
    setLoading(false);
  }

  async function doKick(row) {
    if (!supabase) return;
    await supabase.from("progress").delete().eq("id", row.id);
    setRows(r => r.filter(x => x.id !== row.id));
    flash(`${row.name} 킥 완료`);
    setConfirm(null);
  }

  async function doBan(row) {
    if (!supabase) return;
    const newData = { ...(row.data || {}), banned: true };
    await supabase.from("progress").update({ data: newData }).eq("id", row.id);
    setRows(r => r.map(x => x.id === row.id ? { ...x, data: newData } : x));
    flash(`${row.name} 밴 완료`);
    setConfirm(null);
  }

  async function doUnban(row) {
    if (!supabase) return;
    const newData = { ...(row.data || {}), banned: false };
    await supabase.from("progress").update({ data: newData }).eq("id", row.id);
    setRows(r => r.map(x => x.id === row.id ? { ...x, data: newData } : x));
    flash(`${row.name} 밴 해제`);
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
      totalStars,
      unitsCompleted,
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

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg,#0D0A1A 0%,#1A1030 100%)",
      fontFamily: "'Nunito',sans-serif",
      color: "#fff",
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
            전체 {rows.length}명 등록 · 밴 {rows.filter(r => r.data?.banned).length}명
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
          padding: "10px 20px", color: "#44CC77", fontWeight: 700, zIndex: 999,
          fontSize: 14,
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
            style={btn(sortBy === k ? "#5533AA" : "#2A2448")}>
            {l}
          </button>
        ))}
      </div>

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
                {["이름","교재","유닛","별점","Lv","마지막 접속","상태","액션"].map(h => (
                  <th key={h} style={{
                    padding: "12px 12px", textAlign: "left", color: "#A090CC",
                    fontWeight: 700, borderBottom: "2px solid #2E2848", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const s = getStats(row.data);
                return (
                  <tr key={row.id} style={{
                    background: s.banned ? "#1A0A0A" : i % 2 === 0 ? "#13102A" : "#16132E",
                  }}>
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
                        <button onClick={() => doUnban(row)} style={actionBtn("#1A3A1A","#44CC77")}>
                          밴 해제
                        </button>
                      ) : (
                        <>
                          <button onClick={() => setConfirm({ type: "ban", row })}
                            style={actionBtn("#2A1A0A","#FF9933")}>
                            밴
                          </button>
                          <button onClick={() => setConfirm({ type: "kick", row })}
                            style={{ ...actionBtn("#2A0A0A","#FF4444"), marginLeft: 6 }}>
                            킥
                          </button>
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
            borderRadius: 16, padding: 28, maxWidth: 320, width: "100%", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              {confirm.type === "kick" ? "👢" : "🚫"}
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
              {confirm.type === "kick" ? "킥 확인" : "밴 확인"}
            </div>
            <div style={{ color: "#A090CC", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              <strong style={{ color: "#F5C842" }}>{confirm.row.name}</strong>을(를){" "}
              {confirm.type === "kick"
                ? "킥하면 모든 진행 데이터가 삭제됩니다."
                : "밴하면 로그인이 차단됩니다. 언제든 해제 가능합니다."}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirm(null)}
                style={{ flex: 1, ...actionBtn("#2A2448","#8878AA") }}>
                취소
              </button>
              <button
                onClick={() => confirm.type === "kick" ? doKick(confirm.row) : doBan(confirm.row)}
                style={{ flex: 1, ...actionBtn(confirm.type === "kick" ? "#3A0808" : "#2A1400",
                  confirm.type === "kick" ? "#FF4444" : "#FF9933") }}>
                {confirm.type === "kick" ? "킥" : "밴"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const td = { padding: "11px 12px", borderBottom: "1px solid #1E1A30" };
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
