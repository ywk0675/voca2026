// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUDIO — Web Audio API (no external files needed)
//  BGM: chiptune battle theme  |  SFX: hit, correct, wrong, victory
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _ctx = null;
let _muted = false;
let _bgmRunning = false;
let _bgmTimerId = null;
let _bgmVol = 0.055; // master BGM volume (quiet enough not to distract)

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function osc(ac, type, freq, startT, dur, vol, freqEnd = null) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.connect(g); g.connect(ac.destination);
  o.type = type;
  o.frequency.setValueAtTime(freq, startT);
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, startT + dur);
  g.gain.setValueAtTime(vol, startT);
  g.gain.exponentialRampToValueAtTime(0.0001, startT + dur);
  o.start(startT);
  o.stop(startT + dur + 0.01);
}

function noise(ac, startT, dur, vol) {
  const sz = Math.ceil(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, sz, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  src.connect(g); g.connect(ac.destination);
  g.gain.setValueAtTime(vol, startT);
  g.gain.exponentialRampToValueAtTime(0.0001, startT + dur);
  src.start(startT); src.stop(startT + dur + 0.01);
}

// ─── SFX ────────────────────────────────────────────────────────────────────

export function sfxCorrect() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  // 밝은 상승 아르페지오 (C5 → E5 → G5)
  [[523, 0], [659, 0.08], [784, 0.16]].forEach(([f, dt]) => {
    osc(ac, "square", f, t + dt, 0.18, 0.13);
  });
}

export function sfxWrong() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  // 하강 buzz
  osc(ac, "sawtooth", 220, t, 0.28, 0.18, 100);
  osc(ac, "square",   180, t + 0.05, 0.22, 0.10, 80);
}

export function sfxHitEnemy() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  // 짧은 펀치 소리 (noise + 톤)
  noise(ac, t, 0.06, 0.3);
  osc(ac, "square", 440, t, 0.12, 0.18, 200);
}

export function sfxHitPlayer() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  // 둔탁한 피격음
  osc(ac, "square",   160, t, 0.20, 0.22, 60);
  noise(ac, t, 0.09, 0.15);
}

export function sfxVictory() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  // 짧은 승리 팡파레
  [[523,0],[659,0.10],[784,0.20],[1047,0.32]].forEach(([f, dt]) => {
    osc(ac, "square", f, t + dt, 0.22, 0.16);
  });
}

export function sfxDefeat() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  // 슬픈 하강
  [[392,0],[330,0.14],[262,0.28],[196,0.44]].forEach(([f, dt]) => {
    osc(ac, "square", f, t + dt, 0.22, 0.14);
  });
}

export function sfxBattleStart() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  // 드라마틱 등장음
  osc(ac, "square", 220, t,       0.10, 0.20);
  osc(ac, "square", 330, t + 0.12, 0.10, 0.20);
  osc(ac, "square", 440, t + 0.24, 0.14, 0.20);
}

export function sfxHatch(rarity = "common") {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  const profiles = {
    common: [[523, 0, 0.12], [659, 0.08, 0.12], [784, 0.16, 0.16]],
    rare: [[659, 0, 0.12], [784, 0.08, 0.14], [988, 0.18, 0.18]],
    superrare: [[392, 0, 0.16], [523, 0.1, 0.16], [784, 0.22, 0.22]],
    legendary: [[523, 0, 0.14], [784, 0.1, 0.18], [1047, 0.22, 0.24], [1319, 0.38, 0.3]],
  };
  const notes = profiles[rarity] || profiles.common;
  noise(ac, t, 0.05, 0.12);
  notes.forEach(([freq, dt, dur], index) => {
    osc(ac, index >= 2 ? "triangle" : "square", freq, t + dt, dur, 0.15);
  });
}

export function sfxEvolveStart() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  osc(ac, "triangle", 220, t, 0.3, 0.1, 660);
  osc(ac, "triangle", 330, t + 0.18, 0.32, 0.11, 988);
  noise(ac, t + 0.08, 0.14, 0.05);
}

export function sfxEvolveDone() {
  if (_muted) return;
  const ac = ctx();
  const t = ac.currentTime;
  [[659, 0], [880, 0.08], [1047, 0.18], [1319, 0.32]].forEach(([f, dt], idx) => {
    osc(ac, idx < 2 ? "square" : "triangle", f, t + dt, 0.2 + idx * 0.02, 0.16);
  });
}

// ─── BGM ────────────────────────────────────────────────────────────────────
// 포켓몬 배틀 스타일 8비트 BGM (루프)

// 음표 주파수 (Hz)
const N = {
  C4:262,D4:294,E4:330,F4:349,G4:392,A4:440,Bb4:466,B4:494,
  C5:523,Db5:554,D5:587,Eb5:622,E5:659,F5:698,Gb5:740,G5:784,Ab5:831,A5:880,Bb5:932,B5:988,
  C6:1047,D6:1175,E6:1319,
  r:0,
};

// Main melody — Red/Blue 배틀 감성
const MELODY = [
  // 인트로 riff
  {n:"E5",d:.09},{n:"r",d:.04},{n:"E5",d:.09},{n:"r",d:.04},{n:"E5",d:.09},{n:"r",d:.07},
  {n:"C5",d:.09},{n:"E5",d:.13},{n:"G5",d:.28},{n:"r",d:.09},
  {n:"G4",d:.28},{n:"r",d:.18},
  // phrase 2
  {n:"C5",d:.18},{n:"r",d:.07},{n:"G4",d:.18},{n:"r",d:.07},
  {n:"E4",d:.18},{n:"r",d:.07},{n:"A4",d:.13},{n:"B4",d:.13},
  {n:"Bb4",d:.13},{n:"A4",d:.18},
  // phrase 3
  {n:"G4",d:.12},{n:"E5",d:.13},{n:"G5",d:.13},{n:"A5",d:.18},
  {n:"F5",d:.13},{n:"G5",d:.09},{n:"r",d:.04},
  {n:"E5",d:.13},{n:"C5",d:.09},{n:"D5",d:.09},{n:"B4",d:.18},
  {n:"r",d:.09},
  // phrase 4 (bridge)
  {n:"C5",d:.09},{n:"r",d:.04},{n:"C5",d:.09},{n:"r",d:.04},{n:"C5",d:.09},{n:"r",d:.07},
  {n:"Ab5",d:.09},{n:"G5",d:.13},{n:"Eb5",d:.28},{n:"r",d:.09},
  {n:"Bb4",d:.18},{n:"r",d:.07},{n:"G4",d:.18},
  {n:"E5",d:.09},{n:"r",d:.04},{n:"E5",d:.09},{n:"E5",d:.09},{n:"r",d:.04},
  {n:"C5",d:.09},{n:"E5",d:.13},{n:"G5",d:.28},
];

// Bass line (plays simultaneously at octave below)
const BASS = [
  {n:"C4",d:.28},{n:"r",d:.09},{n:"G4",d:.28},{n:"r",d:.37},
  {n:"C4",d:.18},{n:"r",d:.07},{n:"G4",d:.18},{n:"r",d:.07},
  {n:"E4",d:.18},{n:"r",d:.44},{n:"r",d:.56},
  {n:"G4",d:.18},{n:"r",d:.07},{n:"G4",d:.18},{n:"r",d:.07},
  {n:"A4",d:.46},{n:"r",d:.20},
  {n:"C4",d:.28},{n:"r",d:.09},{n:"F4",d:.28},{n:"r",d:.09},
  {n:"Bb4",d:.18},{n:"r",d:.10},{n:"G4",d:.28},
  {n:"E4",d:.28},{n:"r",d:.37},
];

function scheduleTrack(ac, track, startT, vol) {
  let t = startT;
  track.forEach(({ n, d }) => {
    const freq = N[n] || 0;
    if (freq > 0) osc(ac, "square", freq, t, d * 0.85, vol);
    t += d;
  });
  return t - startT; // total duration
}

function loopBGM() {
  if (!_bgmRunning) return;
  const ac = ctx();
  const startT = ac.currentTime + 0.05;
  const melodyDur = scheduleTrack(ac, MELODY, startT, _bgmVol);
  scheduleTrack(ac, BASS, startT, _bgmVol * 0.55);

  // 루프: melody 끝나기 0.1초 전에 다음 스케줄
  _bgmTimerId = setTimeout(() => {
    if (_bgmRunning) loopBGM();
  }, (melodyDur - 0.1) * 1000);
}

export function startBGM() {
  if (_muted || _bgmRunning) return;
  _bgmRunning = true;
  loopBGM();
}

export function stopBGM() {
  _bgmRunning = false;
  if (_bgmTimerId) { clearTimeout(_bgmTimerId); _bgmTimerId = null; }
}

export function setMuted(val) {
  _muted = val;
  if (_muted) stopBGM();
}

export function isMuted() { return _muted; }
