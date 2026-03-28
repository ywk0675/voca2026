import React, { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import { BOOK_SERIES } from "./bookData.js";

const TEACHER_PW = "pegasus20262026";

export default function TeacherDashboard({ onExit }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error && data) setRows(data);
    setLoading(false);
  }

  function getStats(d = {}) {
    const stars = Object.values(d.unitStars || {});
    const totalStars = stars.reduce((a, b) => a + b, 0);
    const unitsCompleted = [...new Set(
      Object.keys(d.unitStars || {}).map(k => k.split("_").slice(-2, -1)[0])
    )].filter(Boolean).length;
    const book = BOOK_SERIES?.find(b => b.id === d.curBook);
    const bookName = book ? book.subtitle : d.curBook || "-";
    const monLv = d.monLv || 1;
    const loginDays = d.loginDays || 0;
    return { totalStars, unitsCompleted, bookName, monLv, loginDays };
  }

  function formatDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return "오늘";
    if (diff === 1) return "어제";
    if (diff < 7) return `${diff}일 전`;
    return d.toLocaleDateString("ko-KR");
  }

  const filtered = rows
    .filter(r => r.name.includes(search))
    .sort((a, b) => {
      if (sortBy === "updated_at") return new Date(b.updated_at) - new Date(a.updated_at);
      if (sortBy === "stars") return getStats(b.data).totalStars - getStats(a.data).totalStars;
      if (sortBy === "name") return a.name.localeCompare(b.name, "ko");
      return 0;
    });

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0D0A1A 0%, #1A1030 100%)",
      fontFamily: "'Nunito', sans-serif",
      padding: "20px",
      color: "#fff",
    }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F5C842" }}>📊 선생님 대시보드</div>
          <div style={{ fontSize: 13, color: "#8878AA", marginTop: 2 }}>
            전체 {rows.length}명 · 마지막 업데이트: 방금
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchAll} style={btnStyle("#2A2448", "#3A3468")}>🔄 새로고침</button>
          <button onClick={onExit} style={btnStyle("#2A1428", "#4A1438")}>← 나가기</button>
        </div>
      </div>

      {/* 검색 + 정렬 */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="🔍 이름 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 10, border: "2px solid #2E2848",
            background: "#13102A", color: "#fff", fontSize: 14, flex: 1, minWidth: 160,
          }}
        />
        {["updated_at", "stars", "name"].map(k => (
          <button key={k} onClick={() => setSortBy(k)}
            style={btnStyle(sortBy === k ? "#5533AA" : "#2A2448", sortBy === k ? "#7744CC" : "#3A3468")}>
            {k === "updated_at" ? "최근접속순" : k === "stars" ? "별점순" : "이름순"}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8878AA" }}>불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8878AA" }}>학생 데이터 없음</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1C182E" }}>
                {["이름", "현재 교재", "완료 유닛", "총 별점", "몬스터 Lv", "출석일", "마지막 접속"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#A090CC",
                    fontWeight: 700, borderBottom: "2px solid #2E2848", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const s = getStats(row.data);
                return (
                  <tr key={row.id} style={{
                    background: i % 2 === 0 ? "#13102A" : "#16132E",
                    transition: "background 0.1s",
                  }}>
                    <td style={td}><span style={{ fontWeight: 700, color: "#E0D0FF" }}>{row.name}</span></td>
                    <td style={td}><span style={{ color: "#F5C842" }}>{s.bookName}</span></td>
                    <td style={td}>{s.unitsCompleted} 유닛</td>
                    <td style={td}>
                      <span style={{ color: "#F5C842" }}>{"★".repeat(Math.min(s.totalStars, 5))}</span>
                      <span style={{ color: "#3A3060", marginLeft: 4 }}>{s.totalStars}점</span>
                    </td>
                    <td style={td}>Lv.{s.monLv}</td>
                    <td style={td}>{s.loginDays}일</td>
                    <td style={{ ...td, color: "#8878AA" }}>{formatDate(row.updated_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const td = { padding: "11px 14px", borderBottom: "1px solid #1E1A30" };
function btnStyle(bg, hover) {
  return {
    padding: "8px 14px", borderRadius: 10, border: "none",
    background: bg, color: "#C0B0E0", fontSize: 13,
    cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap",
  };
}
