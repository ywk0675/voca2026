# VocaMon 게임성 개선 마스터 플랜

> 목표: 초등학생이 지루해하지 않고 계속 플레이하게 만들기
> 핵심 원칙: **짧은 보상 루프 + 눈에 보이는 성장 + 도전 욕구 자극**

---

## 🔥 현재 문제점 요약

| 문제 | 원인 | 영향 |
|------|------|------|
| 배틀이 너무 길다 | 20단어 한 판에 전부 | 집중력 저하, 포기 |
| 레벨업이 느리다 | EXP 역치 = monLv × 80 누적 | 성장감 없음 |
| 진화가 요원하다 | Lv.12 + LineExp 100 + 별 4개 | 목표감 없음 |
| 알 부화가 너무 오래 걸린다 | common 30분, legendary 12시간 | 보상 단절 |
| 진화 후 다음 목표가 없다 | 3단계 진화가 끝 | 동기 소멸 |

---

## 📦 PLAN A: 배틀 서브스테이지 시스템

### 구조
```
Unit 1 (20단어)
 ├─ EXPLORE 🧭
 │   ├─ 1-1전 (단어 1~5)   ← 5문제, 빠르게 클리어
 │   ├─ 1-2전 (단어 6~10)
 │   ├─ 1-3전 (단어 11~15)
 │   ├─ 1-4전 (단어 16~20)
 │   └─ 💀 BOSS전 (전체 20단어, 강화 적)  ← 1-4 클리어 후 해금
 ├─ RECALL 🗣️
 └─ MASTER 🏆
```

- WW5/WWP (7~8단어): 분할 없이 기존 유지 (단어 15개 이상일 때만 서브스테이지)
- 서브스테이지당 단어 수: `WORDS_PER_SUB = 5`

### 데이터 구조 변경
```
unitStars 키 변경:
  기존: "bew2_1_0_easy"
  변경: "bew2_1_0_easy_s0", "bew2_1_0_easy_s1", ..., "bew2_1_0_easy_boss"

totalStars 계산: _s*, _boss 접미사 키 제외하고 레거시 키만 합산 (중복 방지)
```

### 신규 함수 (wordData.js)
```js
export function getSubStages(bookId, unitNum) {
  const words = getWordsForUnit(bookId, unitNum);
  const WORDS_PER_SUB = 5;
  const subs = [];
  for (let i = 0; i < words.length; i += WORDS_PER_SUB) {
    subs.push(words.slice(i, i + WORDS_PER_SUB));
  }
  return { subs, hasBoss: subs.length >= 3, totalWords: words.length };
}
```

### 보스전 특수 규칙
- 적 ATK/DEF 1.5배, 전체 단어 랜덤 출제
- 클리어 보상: 코인/EXP 2.5배, 알 등급 무조건 rare 이상
- 배틀 화면에 "BOSS BATTLE" 빨간 배너 + 적 스프라이트 1.3배

### 결과 화면 UX
- 승리 후 "다음 서브스테이지 바로 시작" 버튼 표시 (연속 플레이 유도)
- 연속 클리어 보너스: 중간에 나가지 않고 연속 클리어시 +20% → +40% → +100%

### 구현 파일
- `src/wordData.js`: `getSubStages()` 추가
- `src/App.jsx`:
  - `subStage` state 추가 (925줄)
  - `startBattle(uid, stg, bookId, diff, sub)` sub 파라미터 추가 (1464줄)
  - `endBattle` 서브스테이지 키 저장 (1614줄)
  - 유닛 디테일 UI 서브스테이지 목록 렌더링 (2460줄)
  - 결과 화면 "다음 서브스테이지" 버튼 (2880줄)

---

## 🐣 PLAN B: 몬스터 성장 시스템 개선

### B-1. EXP 역치 조정 (핵심)

**현재**: `threshold = monLv × 80` → Lv.12까지 총 6,240 EXP 필요
**변경**: `threshold = 60 + monLv × 20` → Lv.12까지 총 1,650 EXP

```js
// App.jsx 1629줄 근처
const threshold = 60 + monLv * 20; // 기존: monLv * 80
```

| Lv | 현재 역치 | 변경 역치 |
|----|---------|---------|
| 1  | 80      | 80      |
| 5  | 400     | 160     |
| 10 | 800     | 260     |
| 12 | 960     | 300     |
| 25 | 2000    | 560     |

→ **진화까지 걸리는 시간 약 4배 단축**

### B-2. 배틀 EXP 보상 상향

**현재**: `ex = 40 + curUnit * 12` (유닛1 기준 52 EXP)
**변경**: `ex = 80 + curUnit * 15` (유닛1 기준 95 EXP)

서브스테이지 도입 시 판당 단어 수가 줄어들므로 판당 EXP 상향 필요.

```js
// endBattle 내
const ex = Math.round((80 + curUnit * 15) * diffMult);
```

### B-3. 레벨업 시각화 강화

레벨업 발생 시 현재는 조용히 처리됨. 개선:

```
레벨업 시 결과 화면에 팝업:
  ✨ LEVEL UP! Lv.5 → Lv.6
  [몬스터 스프라이트 bounce 애니메이션]
  진화까지 X레벨 남음!
```

```js
// endBattle에서 레벨업 감지
const levelsBefore = monLv;
// ... exp 처리 ...
const levelsGained = newLv - levelsBefore;
if (levelsGained > 0) setLevelUpPopup({ from: levelsBefore, to: newLv });
```

### B-4. EXP 바 항상 표시

월드 화면 몬스터 패널에 EXP 바가 있지만 너무 작음.
배틀 화면 플레이어 네임플레이트에도 EXP 수치 실시간 반영 추가.

---

## 🔮 PLAN C: 진화 시스템 개선

### C-1. 진화 조건 완화

**현재 진화 조건** (stageIdx 0→1):
- `monLv >= 12` (evoLv)
- `totalStars >= 4` (EVO_UNLOCK_STARS)
- `lineExp >= 100`
- `evolutionCores >= 0`

**변경 제안**:
```js
// monsterMeta.js
export const EVOLUTION_REQUIREMENTS = {
  0: { lineExp: 50,  evolutionCores: 0 },  // 기존 100 → 50
  1: { lineExp: 100, evolutionCores: 1 },  // 기존 180 → 100
};

// App.jsx EVO_UNLOCK_STARS
const EVO_UNLOCK_STARS = { 0:0, 1:2, 2:8 }; // 기존 { 0:0, 1:4, 2:12 }
```

### C-2. LineExp 획득량 상향

**현재 LineExp 획득 경로**:
- 배틀 승리: 간접적으로 (duplicate reward 때만)
- 중복 알 부화: 40/90/120 lineExp

**추가 획득 경로**:
```js
// endBattle 승리 시 lineExp 직접 지급
const lineExpGain = Math.round((5 + curUnit * 2) * diffMult);
// ex) 유닛1 easy: 7 lineExp, hell: 14 lineExp

setMonsterCollection(prev => {
  const entry = prev[mon.id] || {};
  return {
    ...prev,
    [mon.id]: {
      ...entry,
      lineExp: (entry.lineExp || 0) + lineExpGain,
    }
  };
});
```

→ 유닛 10개 클리어하면 lineExp ~70 획득 → lineExp 50 요건 달성 가능

### C-3. 진화 연출 강화

현재: 흰 화면 플래시 + "EVOLVING!" 텍스트만
개선:
- 진화 전/후 몬스터 비교 화면 (Before → After)
- 스탯 증가 표시 (HP +26, ATK +6, DEF +4)
- 진화 완료 후 3초간 풀스크린 연출
- 효과음 강화 (현재 `sfxEvolveDone` 활용)

### C-4. 진화 예고 시스템

진화 3레벨 전부터 월드 화면에 예고 표시:
```
⚡ 진화가 가까워졌다! Lv.9/12
[반짝이는 아우라 애니메이션]
```

---

## ⏰ PLAN D: 알 부화 시간 단축

### 현재 부화 시간
| 등급 | 현재 | 변경 |
|------|------|------|
| common | 30분 | **5분** |
| rare | 2시간 | **20분** |
| superrare | 6시간 | **1시간** |
| legendary | 12시간 | **3시간** |

```js
// monsterMeta.js
export const HATCH_DURATIONS_MS = {
  common:    5 * 60 * 1000,       // 5분
  rare:      20 * 60 * 1000,      // 20분
  superrare: 60 * 60 * 1000,      // 1시간
  legendary: 3 * 60 * 60 * 1000,  // 3시간
};
```

### 수업 시간 맞춤 설계
- 5분 알: 수업 시작 → 끝날 때 부화 완료 (동기 유발)
- 20분 알: 쉬는 시간 부화 완료
- 1시간 알: 점심 시간 부화 완료

---

## 🎮 PLAN E: 추가 게임성 개선

### E-1. 레벨별 칭호 시스템

레벨에 따라 몬스터 앞에 칭호 표시:

```js
const TITLES = [
  { minLv: 1,  label: "🌱 새싹",    color: "#88CC44" },
  { minLv: 5,  label: "⚡ 견습사",   color: "#FFCC00" },
  { minLv: 10, label: "🔥 전사",    color: "#FF8844" },
  { minLv: 15, label: "💎 정예",    color: "#44AAFF" },
  { minLv: 20, label: "👑 챔피언",  color: "#FF44AA" },
  { minLv: 30, label: "🌟 전설",    color: "#FFD700" },
];
```

월드 화면 몬스터 패널, 리더보드에 칭호 표시.

### E-2. 오늘의 미션 강화

현재 3개 고정 미션 → 7개 풀에서 3개 랜덤 선택. 서브스테이지 도입 후 미션 내용 추가:

```js
{ id:"substage3", emoji:"⚡", label:"서브스테이지 3개 클리어", target:3 },
{ id:"boss1",     emoji:"💀", label:"보스전 클리어",           target:1 },
{ id:"combo8",    emoji:"🔥", label:"8연속 정답",              target:8 },
{ id:"hell1",     emoji:"💀", label:"HELL 모드 클리어",        target:1 },
{ id:"perfect2",  emoji:"⭐", label:"2판 연속 퍼펙트 클리어",  target:2 },
```

미션 완료 시 보상 강화: 현재 EXP만 → EXP + 코인 + 알 1개

### E-3. 연속 클리어 콤보 보너스 (서브스테이지 연계)

```
1-1전 클리어 → 기본 보상
1-2전 연속 → +20% 코인
1-3전 연속 → +40% 코인
1-4전 연속 → +60% 코인
BOSS 연속  → +100% 코인 + 희귀 알 보장
```

중간에 월드로 나가면 연속 콤보 리셋.

### E-4. 도전 랭킹 리더보드 항목 추가

현재: 총 별 개수만
추가:
- 🏆 최고 연속 클리어 수
- ⚡ 이번 주 획득 EXP
- 💀 보스전 클리어 수
- 🔥 HELL 모드 클리어 수

### E-5. 퍼펙트 클리어 특별 보상

3성 클리어 시:
- 금색 ✨ 이펙트
- 코인 +20% 추가 보너스
- 재도전 시에도 코인 1.5배 (복습 유도)

### E-6. 스트릭 보너스 강화

현재: 연속 출석 스트릭만 추적
추가:
- 3일 연속: 알 인벤토리 +1 여분 슬롯 임시 해금
- 7일 연속: rare 알 자동 지급
- 14일 연속: superrare 알 자동 지급

---

## 📊 구현 우선순위

| 우선도 | 항목 | 예상 효과 | 난이도 |
|--------|------|----------|--------|
| ⭐⭐⭐ | PLAN A: 서브스테이지 배틀 | 지루함 즉시 해소 | 상 |
| ⭐⭐⭐ | PLAN B-1: EXP 역치 조정 | 레벨업 체감 개선 | 하 |
| ⭐⭐⭐ | PLAN D: 알 부화 시간 단축 | 보상 즉시성 | 하 |
| ⭐⭐  | PLAN C-1: 진화 조건 완화 | 진화 달성 가능성 | 하 |
| ⭐⭐  | PLAN C-2: LineExp 직접 지급 | 진화 루트 명확화 | 중 |
| ⭐⭐  | PLAN B-3: 레벨업 팝업 | 성취감 강화 | 중 |
| ⭐⭐  | PLAN C-4: 진화 예고 | 목표감 제공 | 중 |
| ⭐   | PLAN E-1: 칭호 시스템 | 자랑 요소 | 중 |
| ⭐   | PLAN E-3: 연속 클리어 보너스 | 연속 플레이 유도 | 중 |
| ⭐   | PLAN C-3: 진화 연출 강화 | 감동 포인트 | 중 |

---

## 🎯 빠른 시작 추천 순서

1. **지금 당장 (코드 3줄)**:
   - EXP 역치 변경: `monLv * 80` → `60 + monLv * 20`
   - 부화 시간 단축: common 30분 → 5분
   - 진화 lineExp 요건: 100 → 50

2. **이번 주 (중간 작업)**:
   - 배틀 EXP 상향 + LineExp 직접 지급
   - 진화 예고 UI
   - 레벨업 팝업

3. **다음 단계 (큰 작업)**:
   - 서브스테이지 배틀 시스템 (Plan A 전체)
   - 칭호 시스템
   - 연속 클리어 보너스

---

## 📁 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/monsterMeta.js` | HATCH_DURATIONS_MS 단축, EVOLUTION_REQUIREMENTS 완화 |
| `src/App.jsx` | EXP 역치, 배틀 EXP/LineExp 상향, 레벨업 팝업, 진화 예고, 서브스테이지 전체 |
| `src/wordData.js` | getSubStages() 함수 추가 |
| `src/catchMons.jsx` | evoLv 값 조정 검토 (선택) |
