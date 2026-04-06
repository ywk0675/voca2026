import React, { useState } from "react";

const CLASS_CODE = "THANKYOUDAVIDT"; // ← 선생님이 원하는 코드로 바꾸세요

export default function LoginScreen({ onLogin }) {
  const [name, setName]       = useState("");
  const [code, setCode]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  async function handleStart() {
    const trimName = name.trim();
    const trimCode = code.trim().toUpperCase();

    if (!trimName) { setError("이름을 입력해줘!"); return; }
    if (trimCode !== CLASS_CODE) { setError("반 코드가 틀렸어요 😅"); return; }

    setLoading(true);
    setError("");
    await onLogin(trimName, trimCode);
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
    </div>
  );
}
