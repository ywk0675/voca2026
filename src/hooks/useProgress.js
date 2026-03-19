import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const LS_STATE = "vocabmon_state";
const LS_PROGRESS = "vocabmon_progress";

const DEFAULT_STATE = {
  lineId: null,
  stageIdx: 0,
  monLv: 1,
  monExp: 0,
  coins: 120,
  streak: 0,
  loginDays: 0,
  dailyDone: false,
  lastLogin: null,
};

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function samePlayerState(a, b) {
  return (
    a.lineId === b.lineId &&
    a.stageIdx === b.stageIdx &&
    a.monLv === b.monLv &&
    a.monExp === b.monExp &&
    a.coins === b.coins &&
    a.streak === b.streak &&
    a.loginDays === b.loginDays &&
    a.dailyDone === b.dailyDone &&
    a.lastLogin === b.lastLogin
  );
}

export function useProgress(user) {
  const [playerState, setPlayerStateRaw] = useState(() => ({
    ...DEFAULT_STATE,
    ...readLocalJson(LS_STATE, {}),
  }));
  const [unitStars, setUnitStarsRaw] = useState(() => readLocalJson(LS_PROGRESS, {}));
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!user || !supabase) {
      setSynced(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setSynced(false);

    (async () => {
      const [{ data: monsterRow, error: monsterError }, { data: progressRows, error: progressError }] =
        await Promise.all([
          supabase.from("monsters").select("*").eq("user_id", user.id).maybeSingle(),
          supabase.from("progress").select("unit_id, stage, stars").eq("user_id", user.id),
        ]);

      if (monsterError) {
        console.error("monsters select:", monsterError.message);
      }
      if (progressError) {
        console.error("progress select:", progressError.message);
      }
      if (cancelled) {
        return;
      }

      if (monsterRow) {
        const nextState = {
          lineId: monsterRow.line_id,
          stageIdx: monsterRow.stage_idx ?? 0,
          monLv: monsterRow.mon_lv ?? 1,
          monExp: monsterRow.mon_exp ?? 0,
          coins: monsterRow.coins ?? 120,
          streak: monsterRow.streak ?? 0,
          loginDays: monsterRow.login_days ?? 0,
          dailyDone: monsterRow.daily_done ?? false,
          lastLogin: monsterRow.last_login ?? null,
        };
        setPlayerStateRaw(nextState);
        localStorage.setItem(LS_STATE, JSON.stringify(nextState));
      }

      if (progressRows?.length) {
        const nextProgress = {};
        for (const row of progressRows) {
          nextProgress[`${row.unit_id}_${row.stage}`] = row.stars ?? 0;
        }
        setUnitStarsRaw(nextProgress);
        localStorage.setItem(LS_PROGRESS, JSON.stringify(nextProgress));
      }

      setLoading(false);
      setSynced(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const setPlayerState = useCallback(
    (updater) => {
      setPlayerStateRaw((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const merged = { ...DEFAULT_STATE, ...next };
        localStorage.setItem(LS_STATE, JSON.stringify(merged));

        if (user && supabase && !samePlayerState(prev, merged)) {
          supabase
            .from("monsters")
            .upsert(
              {
                user_id: user.id,
                line_id: merged.lineId,
                stage_idx: merged.stageIdx,
                mon_lv: merged.monLv,
                mon_exp: merged.monExp,
                coins: merged.coins,
                streak: merged.streak,
                login_days: merged.loginDays,
                daily_done: merged.dailyDone,
                last_login: merged.lastLogin,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" },
            )
            .then(({ error }) => {
              if (error) {
                console.error("monsters upsert:", error.message);
              }
            });
        }

        return merged;
      });
    },
    [user],
  );

  const setUnitStars = useCallback(
    (updater) => {
      setUnitStarsRaw((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        localStorage.setItem(LS_PROGRESS, JSON.stringify(next));

        if (user && supabase) {
          const rows = Object.entries(next).map(([key, stars]) => {
            const [unit_id, stage] = key.split("_").map(Number);
            return {
              user_id: user.id,
              unit_id,
              stage,
              stars,
              updated_at: new Date().toISOString(),
            };
          });

          if (rows.length) {
            supabase
              .from("progress")
              .upsert(rows, { onConflict: "user_id,unit_id,stage" })
              .then(({ error }) => {
                if (error) {
                  console.error("progress upsert:", error.message);
                }
              });
          }
        }

        return next;
      });
    },
    [user],
  );

  return { playerState, setPlayerState, unitStars, setUnitStars, loading, synced };
}
