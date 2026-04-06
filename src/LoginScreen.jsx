import React, { useState } from "react";

const CLASS_CODE    = "THANKYOUDAVIDT"; // ← 선생님이 원하는 코드로 바꾸세요
const TEACHER_PW    = "pegasus20262026"; // ← 관리자 비밀번호

export default function LoginScreen({ onLogin, onTeacher }) {
  const [name, setName]           = useState("");
  const [code, setCode]           = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showCode, setShowCode]   = useState(false);
  const [teacherModal, setTeacherModal] = useState(false);
  const [tpw, setTpw]             = useState("");
  const [showTpw, setShowTpw]     = useState(false);
  const [tpwError, setTpwError]   = useState("");

  async function handleStart() {
    const trimName = name.trim();
    const trimCode = code.trim().toUpperCase();

    if (!trimName) { setError("이름을 입력해줘!"); return; }
    if (trimCode !== CLASS_CODE) { setError("반 코드가 틀렸어요 😅"); return; }

    setLoading(true);
    setError("");
    const err = await onLogin(trimName, trimCode);
    if (err) setError(err);
    setLoading(false);
  }

  return (
    <div data-testid="login-screen" style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0D0A1A 0%, #1A1030 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Nunito', sans-serif",
      padding: "24px",
    }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>🐉</div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(14px, 4vw, 22px)",
          color: "#F5C842",
          letterSpacing: 2,
          marginTop: 8,
        }}>VOCA MONSTER</div>
        <div style={{ color: "#8878AA", fontSize: 14, marginTop: 6 }}>
          귀여운 몬스터를 키워봐!
        </div>
      </div>

      <div style={{
        background: "#1C182E",
        borderRadius: 20,
        padding: "28px 24px",
        width: "100%",
        maxWidth: 340,
        boxShadow: "0 8px 32px #00000088",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        <div>
          <label style={{ color: "#A090CC", fontSize: 13, marginBottom: 6, display: "block" }}>
            내 이름
          </label>
          <input
            data-testid="login-name-input"
            type="text"
            placeholder="예) 김민준"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleStart()}
            style={{
              width: "100%", padding: "12px 14px",
              borderRadius: 12, border: "2px solid #2E2848",
              background: "#13102A", color: "#fff",
              fontSize: 16, outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ color: "#A090CC", fontSize: 13, marginBottom: 6, display: "block" }}>
            반 코드
          </label>
          <div style={{ position: "relative" }}>
            <input
              data-testid="login-code-input"
              type={showCode ? "text" : "password"}
              placeholder="선생님한테 받은 코드"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleStart()}
              style={{
                width: "100%", padding: "12px 44px 12px 14px",
                borderRadius: 12, border: "2px solid #2E2848",
                background: "#13102A", color: "#fff",
                fontSize: 16, outline: "none", letterSpacing: 2,
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowCode(v => !v)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                cursor: "pointer", fontSize: 18, padding: 0,
                color: showCode ? "#A090CC" : "#4A3A60",
                lineHeight: 1,
              }}
              aria-label={showCode ? "코드 숨기기" : "코드 보기"}
            >
              {showCode ? "👁️" : "🙈"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            color: "#FF6677", fontSize: 13, textAlign: "center",
            background: "#2A1020", borderRadius: 8, padding: "8px 12px",
          }}>
            {error}
          </div>
        )}

        <button
          data-testid="login-start-button"
          onClick={handleStart}
          disabled={loading}
          style={{
            marginTop: 4,
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: loading ? "#2E2848" : "linear-gradient(135deg, #7744FF, #AA44FF)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 0 #4422AA",
            transition: "all 0.1s",
          }}
        >
          {loading ? "불러오는 중..." : "🎮 게임 시작!"}
        </button>
      </div>

      <div style={{ color: "#3A3060", fontSize: 11, marginTop: 20, textAlign: "center" }}>
        반 코드는 선생님한테 물어봐요
      </div>

      {/* 관리자 버튼 */}
      <button
        onClick={() => { setTeacherModal(true); setTpw(""); setTpwError(""); }}
        style={{
          marginTop: 12, background: "none", border: "1px solid #2A2040",
          color: "#4A3A60", fontSize: 11, borderRadius: 8,
          padding: "6px 14px", cursor: "pointer",
        }}>
        🔐 관리자
      </button>

      {/* 관리자 비밀번호 모달 */}
      {teacherModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20,
        }} onClick={() => setTeacherModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#1C182E", border: "2px solid #3A2A50",
            borderRadius: 20, padding: "28px 24px", maxWidth: 320, width: "100%",
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#F5C842", marginBottom: 16, textAlign: "center" }}>
              🔐 관리자 로그인
            </div>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                type={showTpw ? "text" : "password"}
                placeholder="관리자 비밀번호"
                value={tpw}
                onChange={e => setTpw(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    if (tpw === TEACHER_PW) { setTeacherModal(false); onTeacher(); }
                    else setTpwError("비밀번호가 틀렸습니다.");
                  }
                }}
                autoFocus
                style={{
                  width: "100%", padding: "12px 44px 12px 14px",
                  borderRadius: 12, border: "2px solid #2E2848",
                  background: "#13102A", color: "#fff",
                  fontSize: 16, outline: "none", boxSizing: "border-box",
                }}
              />
              <button type="button" onClick={() => setShowTpw(v => !v)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0,
                color: showTpw ? "#A090CC" : "#4A3A60",
              }}>
                {showTpw ? "👁️" : "🙈"}
              </button>
            </div>
            {tpwError && (
              <div style={{ color: "#FF6677", fontSize: 13, marginBottom: 10, textAlign: "center" }}>
                {tpwError}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setTeacherModal(false)} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "none",
                background: "#2A2448", color: "#8878AA", fontSize: 15, cursor: "pointer", fontWeight: 700,
              }}>취소</button>
              <button onClick={() => {
                if (tpw === TEACHER_PW) { setTeacherModal(false); onTeacher(); }
                else setTpwError("비밀번호가 틀렸습니다.");
              }} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#7744FF,#AA44FF)",
                color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 700,
                boxShadow: "0 4px 0 #4422AA",
              }}>입장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
