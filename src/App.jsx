import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import VocabMon from "./components/VocabMon";
import { useProgress } from "./hooks/useProgress";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

function Splash() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        background: "#0C0A18",
      }}
    >
      <div style={{ fontSize: 52, animation: "spin 1s linear infinite" }}>⏳</div>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 12,
          color: "#8C83B0",
        }}
      >
        LOADING...
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function SetupNotice() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "radial-gradient(ellipse at top, #1C1233, #0C0A18)",
        color: "#F4EEFF",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          background: "#16122A",
          border: "1px solid #2F2A49",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, color: "#F5C842" }}>VocabMon Setup</h1>
        <p style={{ margin: "14px 0 0", lineHeight: 1.6, color: "#D8D1F0" }}>
          Supabase 환경 변수가 아직 비어 있습니다. 먼저
          <code style={{ margin: "0 6px" }}>.env.local</code>
          에
          <code style={{ margin: "0 6px" }}>VITE_SUPABASE_URL</code>
          과
          <code style={{ marginLeft: 6 }}>VITE_SUPABASE_ANON_KEY</code>
          를 넣어주세요.
        </p>
        <p style={{ margin: "14px 0 0", lineHeight: 1.6, color: "#A79CC8" }}>
          SQL 테이블 생성과 배포 절차는
          <code style={{ marginLeft: 6 }}>README.md</code>
          와
          <code style={{ marginLeft: 6 }}>supabase/migrations/20260319_init.sql</code>
          에 정리해 두었습니다.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setSession(null);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;
  const progress = useProgress(user);

  if (!isSupabaseConfigured) {
    return <SetupNotice />;
  }

  if (session === undefined || (session && !progress.synced)) {
    return <Splash />;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <VocabMon
      user={user}
      progress={progress}
      onSignOut={() => supabase.auth.signOut()}
    />
  );
}
