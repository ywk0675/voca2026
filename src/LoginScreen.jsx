import React, { useState } from "react";

const CLASS_CODE = "THANKYOUDAVIDT";
const TEACHER_PW = "pegasus20262026";

const STARTERS = [
  {
    name: "GLYPHIN",
    type: "CORE",
    img: "/monsters/vocabmon/glyphin.png",
    color: "#35D6FF",
    glow: "rgba(53,214,255,.48)",
  },
  {
    name: "EMBERPUFF",
    type: "FLAME",
    img: "/monsters/flame/emberpuff.png",
    color: "#FF8247",
    glow: "rgba(255,130,71,.5)",
  },
  {
    name: "BUBBLET",
    type: "WAVE",
    img: "/monsters/wave/bubblet.png",
    color: "#58BDFF",
    glow: "rgba(88,189,255,.45)",
  },
  {
    name: "SPROUTLING",
    type: "LEAF",
    img: "/monsters/leaf/sproutling.png",
    color: "#68D95A",
    glow: "rgba(104,217,90,.42)",
  },
];

const LEGENDS = [
  {
    name: "GALAXION",
    img: "/monsters/star/galaxion.png",
    className: "legend legend--galaxion",
  },
  {
    name: "VOLCANIX",
    img: "/monsters/lava/volcanix.png",
    className: "legend legend--volcanix",
  },
  {
    name: "TITANWREX",
    img: "/monsters/ancient/titanwrex.png",
    className: "legend legend--titanwrex",
  },
  {
    name: "DIAMONDRA",
    img: "/monsters/crystal2/diamondra.png",
    className: "legend legend--diamondra",
  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nunito:wght@700;800;900&display=swap');

  .login-opening {
    --gold: #FFD84C;
    --ink: #090713;
    --cyan: #51E4FF;
    --pink: #FF72BC;
    min-height: 100dvh;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(18px, 4vw, 44px);
    background:
      radial-gradient(circle at 52% 20%, rgba(255,216,76,.2) 0 9%, transparent 26%),
      radial-gradient(circle at 16% 78%, rgba(81,228,255,.2), transparent 32%),
      radial-gradient(circle at 88% 74%, rgba(255,114,188,.18), transparent 30%),
      linear-gradient(180deg, #10173B 0%, #151034 48%, #090713 100%);
    color: #fff;
    font-family: 'Nunito', sans-serif;
  }

  .login-opening * {
    box-sizing: border-box;
  }

  .login-opening::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -5;
    background-image:
      radial-gradient(circle, rgba(255,255,255,.95) 0 1px, transparent 1.8px),
      radial-gradient(circle, rgba(255,216,76,.85) 0 1px, transparent 1.7px);
    background-size: 82px 82px, 137px 137px;
    background-position: 8px 12px, 40px 28px;
    opacity: .5;
  }

  .login-opening::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 9;
    pointer-events: none;
    background:
      linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
      radial-gradient(ellipse at 50% 52%, transparent 0 54%, rgba(0,0,0,.45) 100%);
    background-size: 100% 4px, 100% 100%;
    mix-blend-mode: screen;
    opacity: .45;
  }

  .sky-ribbon {
    position: absolute;
    left: -8%;
    right: -8%;
    top: 8%;
    height: 36%;
    z-index: -4;
    transform: rotate(-4deg);
    background:
      linear-gradient(90deg, transparent 0%, rgba(81,228,255,.16) 18%, rgba(255,216,76,.18) 52%, rgba(255,114,188,.14) 82%, transparent 100%);
    border-top: 1px solid rgba(255,255,255,.12);
    border-bottom: 1px solid rgba(255,255,255,.08);
    filter: blur(.2px);
  }

  .moon-gate {
    position: absolute;
    width: min(72vw, 860px);
    aspect-ratio: 1;
    top: 48%;
    left: 50%;
    z-index: -3;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background:
      radial-gradient(circle at 50% 46%, rgba(255,216,76,.13), transparent 38%),
      radial-gradient(circle, transparent 0 57%, rgba(255,216,76,.28) 58% 59%, transparent 61%),
      radial-gradient(circle, transparent 0 70%, rgba(81,228,255,.16) 71% 72%, transparent 74%);
    opacity: .95;
  }

  .legend {
    position: absolute;
    z-index: -2;
    pointer-events: none;
    user-select: none;
    object-fit: contain;
    opacity: .28;
    filter: saturate(1.12) drop-shadow(0 26px 42px rgba(0,0,0,.58));
    animation: legendDrift 8s ease-in-out infinite;
  }

  .legend--galaxion {
    width: clamp(190px, 23vw, 390px);
    top: 4%;
    left: 8%;
    opacity: .32;
  }

  .legend--volcanix {
    width: clamp(170px, 21vw, 340px);
    top: 7%;
    right: 8%;
    animation-delay: -1.8s;
    opacity: .24;
  }

  .legend--titanwrex {
    width: clamp(190px, 25vw, 420px);
    left: -2%;
    bottom: 15%;
    animation-delay: -3.2s;
    opacity: .2;
  }

  .legend--diamondra {
    width: clamp(190px, 24vw, 410px);
    right: -1%;
    bottom: 13%;
    animation-delay: -4.4s;
    opacity: .22;
  }

  .opening-stage {
    width: min(1160px, 100%);
    min-height: min(760px, calc(100dvh - 42px));
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, .98fr) minmax(320px, 430px);
    align-items: center;
    gap: clamp(26px, 4vw, 52px);
  }

  .opening-copy {
    min-width: 0;
    padding: clamp(2px, 2vw, 20px) 0;
  }

  .opening-kicker {
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 11px;
    border: 1px solid rgba(255,216,76,.38);
    border-radius: 999px;
    background: rgba(13,13,35,.48);
    color: #FFE98C;
    font-size: clamp(11px, 1.5vw, 13px);
    font-weight: 900;
    letter-spacing: .04em;
    box-shadow: 0 0 24px rgba(255,216,76,.13);
  }

  .opening-title {
    margin: 18px 0 10px;
    font-family: 'Black Han Sans', 'Nunito', sans-serif;
    font-size: clamp(54px, 7.5vw, 108px);
    line-height: .82;
    letter-spacing: 0;
    color: #FFE66A;
    text-shadow:
      0 5px 0 #B64A22,
      0 11px 0 #31205E,
      0 22px 48px rgba(0,0,0,.58);
  }

  .opening-subtitle {
    max-width: 610px;
    margin: 0;
    color: #EADFFF;
    font-size: clamp(16px, 2.25vw, 22px);
    line-height: 1.48;
    font-weight: 900;
    text-shadow: 0 2px 14px rgba(0,0,0,.72);
  }

  .starter-parade {
    display: grid;
    grid-template-columns: repeat(4, minmax(94px, 1fr));
    gap: clamp(10px, 1.7vw, 18px);
    width: min(660px, 100%);
    margin-top: clamp(24px, 5vw, 46px);
  }

  .starter-card {
    min-width: 0;
    height: clamp(154px, 17vw, 196px);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 14px 8px 13px;
    border: 1px solid color-mix(in srgb, var(--starter-color) 54%, rgba(255,255,255,.1));
    border-radius: 8px;
    background:
      radial-gradient(circle at 50% 26%, var(--starter-glow), transparent 54%),
      linear-gradient(180deg, rgba(255,255,255,.08), rgba(8,8,25,.6));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.2),
      0 10px 0 rgba(0,0,0,.24),
      0 26px 45px rgba(0,0,0,.28);
    animation: starterRise .72s cubic-bezier(.2,.8,.2,1) both;
    animation-delay: var(--delay);
  }

  .starter-card::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px dashed rgba(255,255,255,.16);
    border-radius: 6px;
    pointer-events: none;
  }

  .starter-card img {
    width: clamp(94px, 12vw, 142px);
    height: clamp(94px, 12vw, 142px);
    object-fit: contain;
    margin-bottom: 5px;
    filter: drop-shadow(0 18px 18px rgba(0,0,0,.42)) drop-shadow(0 0 18px var(--starter-glow));
    animation: mascotBob 3.2s ease-in-out infinite;
    animation-delay: calc(var(--delay) + .2s);
  }

  .starter-name {
    color: #fff;
    font-size: clamp(10px, 1.45vw, 13px);
    line-height: 1;
    font-weight: 900;
    text-shadow: 0 2px 0 rgba(0,0,0,.55);
  }

  .starter-type {
    margin-top: 5px;
    color: var(--starter-color);
    font-size: clamp(9px, 1.25vw, 11px);
    font-weight: 900;
    letter-spacing: .08em;
  }

  .login-panel {
    width: min(100%, 430px);
    position: relative;
    padding: clamp(20px, 3.2vw, 28px);
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 10px;
    background:
      linear-gradient(180deg, rgba(24,20,55,.78), rgba(10,9,28,.84)),
      radial-gradient(circle at 50% 0%, rgba(255,216,76,.18), transparent 50%);
    box-shadow:
      0 24px 70px rgba(0,0,0,.52),
      inset 0 1px 0 rgba(255,255,255,.16);
    backdrop-filter: blur(12px);
  }

  .login-panel::before {
    content: "";
    position: absolute;
    inset: -4px;
    z-index: -1;
    border-radius: 13px;
    background: linear-gradient(135deg, rgba(81,228,255,.62), rgba(255,216,76,.38), rgba(255,114,188,.54));
    opacity: .6;
    filter: blur(7px);
  }

  .login-panel__badge {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    color: #FFE98C;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: .06em;
  }

  .login-panel__badge span:last-child {
    color: #77EDFF;
  }

  .field-stack {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .login-field label {
    display: block;
    margin-bottom: 7px;
    color: #D9CCFF;
    font-size: 13px;
    font-weight: 900;
  }

  .input-wrap {
    position: relative;
  }

  .login-input {
    width: 100%;
    min-height: 50px;
    padding: 13px 46px 13px 14px;
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 7px;
    background: rgba(5,5,18,.66);
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    outline: none;
    box-shadow: inset 0 2px 10px rgba(0,0,0,.26);
  }

  .login-input:focus {
    border-color: rgba(255,216,76,.82);
    box-shadow: 0 0 0 3px rgba(255,216,76,.14), inset 0 2px 10px rgba(0,0,0,.26);
  }

  .login-input::placeholder {
    color: rgba(226,217,255,.5);
  }

  .show-button {
    position: absolute;
    right: 10px;
    top: 50%;
    width: 30px;
    height: 30px;
    transform: translateY(-50%);
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 6px;
    background: rgba(255,255,255,.06);
    color: #D9CCFF;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
  }

  .login-error {
    color: #FFE9EE;
    font-size: 13px;
    font-weight: 900;
    text-align: center;
    background: rgba(255,58,94,.22);
    border: 1px solid rgba(255,105,130,.42);
    border-radius: 7px;
    padding: 9px 12px;
  }

  .start-button {
    width: 100%;
    min-height: 54px;
    margin-top: 2px;
    border: 0;
    border-radius: 8px;
    background: linear-gradient(135deg, #FFD84C 0%, #FF8A3C 48%, #FF5EA8 100%);
    color: #160B20;
    font-size: 17px;
    font-weight: 900;
    cursor: pointer;
    box-shadow: 0 5px 0 #8B2B38, 0 18px 34px rgba(255,94,168,.22);
    transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
  }

  .start-button:hover {
    transform: translateY(-1px);
    filter: saturate(1.1);
  }

  .start-button:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 #8B2B38, 0 10px 24px rgba(255,94,168,.18);
  }

  .start-button:disabled {
    cursor: not-allowed;
    filter: grayscale(.55) brightness(.7);
  }

  .teacher-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    color: rgba(226,217,255,.68);
    font-size: 12px;
    font-weight: 800;
  }

  .teacher-button,
  .ghost-button,
  .modal-confirm {
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 7px;
    background: rgba(255,255,255,.06);
    color: #D9CCFF;
    padding: 8px 12px;
    font-weight: 900;
    cursor: pointer;
  }

  .teacher-button {
    flex: 0 0 auto;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(4,3,12,.84);
    backdrop-filter: blur(8px);
  }

  .teacher-modal {
    width: min(100%, 360px);
    padding: 24px;
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(28,24,62,.96), rgba(10,9,28,.98));
    box-shadow: 0 24px 70px rgba(0,0,0,.6);
  }

  .teacher-modal h2 {
    margin: 0 0 16px;
    color: #FFE66A;
    font-size: 21px;
    font-weight: 900;
    text-align: center;
  }

  .modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 12px;
  }

  .modal-confirm {
    color: #190C21;
    background: linear-gradient(135deg, #FFD84C, #51E4FF);
  }

  @keyframes legendDrift {
    0%, 100% { transform: translate3d(0, 0, 0) rotate(-1deg); }
    50% { transform: translate3d(0, -12px, 0) rotate(1deg); }
  }

  @keyframes starterRise {
    from { opacity: 0; transform: translateY(24px) scale(.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes mascotBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @media (max-width: 860px) {
    .login-opening {
      align-items: flex-start;
      padding: 18px 14px 20px;
      overflow-y: auto;
    }

    .opening-stage {
      min-height: auto;
      grid-template-columns: 1fr;
      gap: 18px;
      padding-bottom: 8px;
    }

    .opening-copy {
      text-align: center;
      padding-top: 8px;
    }

    .opening-kicker {
      margin-inline: auto;
    }

    .opening-title {
      margin-top: 14px;
      font-size: clamp(42px, 13vw, 54px);
      text-shadow:
        0 4px 0 #B64A22,
        0 9px 0 #31205E,
        0 18px 34px rgba(0,0,0,.58);
    }

    .opening-subtitle {
      margin-inline: auto;
      font-size: 15px;
      max-width: 360px;
    }

    .starter-parade {
      grid-template-columns: repeat(4, minmax(72px, 1fr));
      gap: 8px;
      margin: 16px auto 0;
    }

    .starter-card {
      height: 126px;
      padding: 10px 5px 9px;
    }

    .starter-card img {
      width: 78px;
      height: 78px;
    }

    .starter-name {
      font-size: 8px;
    }

    .starter-type {
      font-size: 8px;
      margin-top: 4px;
    }

    .login-panel {
      justify-self: center;
      padding: 18px;
    }

    .teacher-row {
      align-items: flex-start;
      flex-direction: column;
    }

    .legend--galaxion,
    .legend--volcanix {
      top: 2%;
      opacity: .18;
    }

    .legend--titanwrex,
    .legend--diamondra {
      bottom: 29%;
      opacity: .13;
    }
  }

  @media (max-width: 420px) {
    .starter-parade {
      grid-template-columns: repeat(2, minmax(118px, 1fr));
    }

    .starter-card {
      height: 132px;
    }

    .starter-card img {
      width: 84px;
      height: 84px;
    }
  }
`;

export default function LoginScreen({ onLogin, onTeacher }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [teacherModal, setTeacherModal] = useState(false);
  const [tpw, setTpw] = useState("");
  const [showTpw, setShowTpw] = useState(false);
  const [tpwError, setTpwError] = useState("");

  async function handleStart() {
    const trimName = name.trim();
    const trimCode = code.trim().toUpperCase();

    if (!trimName) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (trimCode !== CLASS_CODE) {
      setError("반 코드가 맞지 않아요.");
      return;
    }

    setLoading(true);
    setError("");
    const err = await onLogin(trimName, trimCode);
    if (err) setError(err);
    setLoading(false);
  }

  function handleTeacherLogin() {
    if (tpw === TEACHER_PW) {
      setTeacherModal(false);
      setTpwError("");
      onTeacher();
      return;
    }
    setTpwError("관리자 비밀번호가 맞지 않아요.");
  }

  return (
    <div data-testid="login-screen" className="login-opening">
      <style>{CSS}</style>
      <div className="sky-ribbon" />
      <div className="moon-gate" />
      {LEGENDS.map((legend) => (
        <img key={legend.name} className={legend.className} src={legend.img} alt="" aria-hidden="true" />
      ))}

      <main className="opening-stage">
        <section className="opening-copy" aria-label="VocabMon opening">
          <div className="opening-kicker">
            <span>MONSTER DEX ONLINE</span>
            <span>99 MONS</span>
          </div>
          <h1 className="opening-title">VOCABMON</h1>
          <p className="opening-subtitle">
            단어를 맞히고 알을 부화시켜 나만의 몬스터 팀을 키워보세요.
          </p>

          <div className="starter-parade" aria-label="스타팅 몬스터">
            {STARTERS.map((starter, index) => (
              <article
                key={starter.name}
                className="starter-card"
                style={{
                  "--starter-color": starter.color,
                  "--starter-glow": starter.glow,
                  "--delay": `${index * 90}ms`,
                }}
              >
                <img src={starter.img} alt={starter.name} draggable={false} />
                <div className="starter-name">{starter.name}</div>
                <div className="starter-type">{starter.type}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="login-panel" aria-label="로그인">
          <div className="login-panel__badge">
            <span>TRAINER PASS</span>
            <span>READY</span>
          </div>

          <div className="field-stack">
            <div className="login-field">
              <label htmlFor="login-name">이름</label>
              <input
                id="login-name"
                data-testid="login-name-input"
                className="login-input"
                type="text"
                placeholder="예: 김민준"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                autoComplete="name"
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-code">반 코드</label>
              <div className="input-wrap">
                <input
                  id="login-code"
                  data-testid="login-code-input"
                  className="login-input"
                  type={showCode ? "text" : "password"}
                  placeholder="선생님께 받은 코드를 입력하세요"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="show-button"
                  onClick={() => setShowCode((v) => !v)}
                  aria-label={showCode ? "코드 숨기기" : "코드 보기"}
                >
                  {showCode ? "숨" : "봄"}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              data-testid="login-start-button"
              className="start-button"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? "불러오는 중..." : "게임 시작"}
            </button>
          </div>

          <div className="teacher-row">
            <span>반 코드는 선생님께 물어보세요.</span>
            <button
              type="button"
              className="teacher-button"
              onClick={() => {
                setTeacherModal(true);
                setTpw("");
                setTpwError("");
              }}
            >
              관리자
            </button>
          </div>
        </section>
      </main>

      {teacherModal && (
        <div className="modal-backdrop" onClick={() => setTeacherModal(false)}>
          <div className="teacher-modal" onClick={(e) => e.stopPropagation()}>
            <h2>관리자 로그인</h2>
            <div className="login-field">
              <label htmlFor="teacher-password">비밀번호</label>
              <div className="input-wrap">
                <input
                  id="teacher-password"
                  className="login-input"
                  type={showTpw ? "text" : "password"}
                  placeholder="관리자 비밀번호"
                  value={tpw}
                  onChange={(e) => setTpw(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTeacherLogin()}
                  autoFocus
                />
                <button
                  type="button"
                  className="show-button"
                  onClick={() => setShowTpw((v) => !v)}
                  aria-label={showTpw ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showTpw ? "숨" : "봄"}
                </button>
              </div>
            </div>
            {tpwError && <div className="login-error" style={{ marginTop: 10 }}>{tpwError}</div>}
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setTeacherModal(false)}>
                취소
              </button>
              <button type="button" className="modal-confirm" onClick={handleTeacherLogin}>
                입장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
