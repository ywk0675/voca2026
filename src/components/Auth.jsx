import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@700;800;900&display=swap');
  .auth-root{
    min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at 40% 20%,#1A0E2E,#0C0A18);
    padding:24px;font-family:'Nunito',sans-serif;
  }
  .auth-card{
    background:#16122A;border:2px solid #2A2440;border-radius:20px;
    padding:clamp(28px,7vmin,48px) clamp(24px,6vw,40px);
    text-align:center;max-width:420px;width:100%;
    box-shadow:0 20px 60px rgba(0,0,0,.6);
  }
  .auth-title{
    font-family:'Press Start 2P',monospace;
    font-size:clamp(24px,6vmin,36px);color:#F5C842;
    text-shadow:0 0 24px rgba(245,200,66,.5),3px 3px 0 #6A3A00;
    margin-bottom:6px;letter-spacing:2px;
  }
  .auth-sub{
    font-family:'Press Start 2P',monospace;
    font-size:clamp(10px,2.5vmin,13px);color:#FF5533;
    text-shadow:2px 2px 0 #880000;margin-bottom:8px;
  }
  .auth-tagline{
    font-size:clamp(12px,3vmin,14px);color:#B3A7D9;font-weight:700;
    margin-bottom:clamp(24px,6vmin,36px);line-height:1.6;
  }
  .google-btn{
    display:flex;align-items:center;justify-content:center;gap:12px;
    width:100%;padding:clamp(14px,3.5vmin,18px) 20px;
    background:#fff;color:#3C3C3C;border:none;border-radius:12px;
    font-family:'Nunito',sans-serif;font-weight:900;
    font-size:clamp(14px,3.5vmin,17px);cursor:pointer;
    box-shadow:0 4px 0 #ccc;transition:all .1s;letter-spacing:.01em;
  }
  .google-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 #ccc;}
  .google-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #ccc;}
  .google-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
  .auth-note{font-size:clamp(10px,2.5vmin,12px);color:#8C83B0;margin-top:16px;font-weight:700;line-height:1.6;}
  .auth-error{
    color:#FFB3B3;font-size:13px;font-weight:700;margin-top:12px;background:#2A1116;
    padding:10px 14px;border-radius:8px;border:1px solid #5A1D24;line-height:1.5;
  }
  @keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes titleGlow{0%,100%{text-shadow:0 0 20px #F5C842,0 0 60px #F5C84244}50%{text-shadow:0 0 30px #F5C842,0 0 80px #F5C842AA}}
`;

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 16 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.2C9.5 36.6 16.3 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37.1 39 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

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
    <div className="auth-root">
      <style>{CSS}</style>
      <div className="auth-card">
        <div style={{ animation: "floatBob 2.8s ease-in-out infinite", marginBottom: 16 }}>
          <div style={{ fontSize: "clamp(52px,13vmin,72px)" }}>📚</div>
        </div>
        <div className="auth-title" style={{ animation: "titleGlow 3s ease-in-out infinite" }}>
          VOCAB
        </div>
        <div className="auth-sub">MON</div>
        <div className="auth-tagline">
          학생이 구글 계정으로 로그인하고
          <br />
          별, 레벨, 몬스터 진화 상태를 저장합니다.
        </div>

        <button className="google-btn" onClick={signInWithGoogle} disabled={loading}>
          <GoogleLogo />
          {loading ? "로그인 중..." : "Google로 시작하기"}
        </button>

        {error ? <div className="auth-error">오류: {error}</div> : null}

        <div className="auth-note">
          50명 정도의 학생이 같은 앱에 접속해도
          <br />
          각자 진행 상황이 사용자별로 분리되어 저장됩니다.
        </div>
      </div>
    </div>
  );
}
