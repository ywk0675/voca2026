import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  ?? "";
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON ?? "";

const isConfigured = SUPABASE_URL.startsWith("https://");

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

// 진행사항 불러오기
export async function loadProgress(name, classCode) {
  const key = `voca_${classCode}_${name}`;
  if (!isConfigured) {
    // Supabase 미연결 시 localStorage 사용
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("data")
      .eq("name", name)
      .eq("class_code", classCode)
      .single();
    if (error || !data) return null;
    return data.data;
  } catch { return null; }
}

// 진행사항 저장하기
export async function saveProgress(name, classCode, gameData) {
  const key = `voca_${classCode}_${name}`;
  if (!isConfigured) {
    localStorage.setItem(key, JSON.stringify(gameData));
    return true;
  }
  try {
    const { error } = await supabase
      .from("progress")
      .upsert(
        { name, class_code: classCode, data: gameData, updated_at: new Date().toISOString() },
        { onConflict: "name,class_code" }
      );
    return !error;
  } catch { return false; }
}
