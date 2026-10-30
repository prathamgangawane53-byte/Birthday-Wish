import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const COLORS = ["#ff4d6d", "#ffd166", "#06d6a0", "#4cc9f0", "#b388ff", "#ff9f1c"];
const GRADS = [
  "linear-gradient(135deg,#f6d365,#fda085)", "linear-gradient(135deg,#84fab0,#8fd3f4)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)", "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)", "linear-gradient(135deg,#30cfd0,#330867)",
  "linear-gradient(135deg,#667eea,#764ba2)", "linear-gradient(135deg,#f093fb,#f5576c)",
];
const EMOJI = ["🎤", "🌿", "🎧", "📸", "🌅", "🎸", "💃", "✨"];
/* ====== EDIT THESE ====== */
const VIDEO_SRC = "";            // e.g. "/my-video.mp4" (file inside /public) or a full URL
const TOP_PHOTO = "/photos/photo3.jpg";   // photo on the top "I love you" card
const TOP_POS = "50% 40%";                // which part of the photo to show (x y)
// Photos for the 8 background polaroids (files live in /public/photos)
const PHOTOS = [
  { src: "/photos/photo1.jpg", pos: "50% 22%" },
  { src: "/photos/photo2.jpg", pos: "70% 40%" },
  { src: "/photos/photo4.jpg", pos: "50% 25%" },
  { src: "/photos/photo5.jpg", pos: "55% 22%" },
  { src: "/photos/photo6.jpg", pos: "50% 30%" },
  { src: "/photos/photo7.jpg", pos: "50% 30%" },
  { src: "/photos/photo8.jpg", pos: "55% 35%" },
  { src: "/photos/photo9.jpg", pos: "50% 55%" },
];
const BIRTHDAY_TITLE = "Happy Birthday Khushi!";
const HANDLE = "pratham_gangawane_2056";
/* ======================== */

const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- Confetti (canvas) ---------- */
let parts = [], raf = 0;
function fireConfetti(canvas) {
  const ctx = canvas.getContext("2d");
  const W = (canvas.width = window.innerWidth), H = (canvas.height = window.innerHeight);
  const origins = [[0.15, 1, 1], [0.85, 1, -1], [0.5, 0.45, 0]];
  origins.forEach(([ox, oy, dir]) => {
    for (let i = 0; i < 90; i++) {
      const a = dir === 0 ? rand(0, Math.PI * 2) : -Math.PI / 2 + dir * rand(0.05, 0.6) * -1;
      const s = dir === 0 ? rand(4, 12) : rand(12, 24);
      parts.push({ x: ox * W, y: oy * H, vx: Math.cos(a) * s, vy: Math.sin(a) * s, size: rand(6, 12),
        color: COLORS[(Math.random() * COLORS.length) | 0], rot: rand(0, 6), vr: rand(-0.3, 0.3),
        shape: ["rect", "circle", "star"][(Math.random() * 3) | 0] });
    }
  });
  cancelAnimationFrame(raf);
  const star = (r) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const rr = i % 2 ? r / 2.2 : r; const t = (i * Math.PI) / 5; ctx.lineTo(Math.cos(t) * rr, Math.sin(t) * rr); }
    ctx.closePath(); ctx.fill();
  };
  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    parts = parts.filter((p) => p.y < H + 30);
    parts.forEach((p) => {
      p.vy += 0.35; p.vx *= 0.985; p.vy *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, 7); ctx.fill(); }
      else star(p.size / 1.5);
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop); else ctx.clearRect(0, 0, W, H);
  };
  loop();
}

/* ---------- Draggable polaroid ---------- */
function Polaroid({ p, cls, onMove, onFront, children }) {
  const [drag, setDrag] = useState(false);
  const start = useRef(null);
  const inner = useRef(null);
  const down = (e) => {
    if (e.target.tagName === "VIDEO") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { px: e.clientX, py: e.clientY, x: p.x, y: p.y };
    setDrag(true); onFront(p.id);
  };
  const move = (e) => {
    if (!start.current) return;
    onMove(p.id,
      start.current.x + ((e.clientX - start.current.px) / window.innerWidth) * 100,
      start.current.y + ((e.clientY - start.current.py) / window.innerHeight) * 100);
  };
  const up = () => {
    if (!start.current) return;
    start.current = null; setDrag(false);
    gsap.fromTo(inner.current, { rotation: -6 }, { rotation: 0, duration: 1, ease: "elastic.out(1,.25)" });
  };
  return (
    <div className={`pol ${cls}` + (drag ? " drag" : "")}
      style={{ left: p.x + "%", top: p.y + "%", width: p.w, zIndex: p.z, transform: `rotate(${p.r}deg)` }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="in" ref={inner}>{children}</div>
    </div>
  );
}

const initialBg = [
  { x: -12, y: -4, w: 130, h: 150, r: -8 }, { x: -16, y: 30, w: 130, h: 150, r: -10 },
  { x: -14, y: 62, w: 150, h: 170, r: 7 }, { x: 62, y: -6, w: 130, h: 150, r: 9 },
  { x: 70, y: 24, w: 120, h: 140, r: 6 }, { x: 66, y: 56, w: 140, h: 160, r: -7 },
  { x: 4, y: 82, w: 120, h: 130, r: 5 }, { x: 62, y: 84, w: 120, h: 130, r: -5 },
].map((p, i) => ({ ...p, id: "bg" + i, bg: GRADS[i], emoji: EMOJI[i], photo: PHOTOS[i], z: i + 1 }));

export default function App() {
  const root = useRef(null);
  const canvas = useRef(null);
  const [items, setItems] = useState(initialBg);
  const [top, setTop] = useState({ id: "top", x: 32, y: 22, w: 230, h: 210, r: 6, z: 50, src: TOP_PHOTO || null });
  const [video, setVideo] = useState({ id: "video", x: 14, y: 12, w: 250, h: 330, r: 0, z: 40, src: VIDEO_SRC || null });
  const [handle, setHandle] = useState(HANDLE);
  const title = BIRTHDAY_TITLE;
  const zc = useRef(60);
  const [sparks] = useState(() => Array.from({ length: 22 }, () => ({ l: rand(2, 96), t: rand(2, 94), s: rand(10, 24) })));
  const [balloons] = useState(() => Array.from({ length: 8 }, (_, i) => ({ l: 4 + i * 12, e: ["🎈", "🎈", "🎉", "🎈"][i % 4] })));

  const celebrate = () => fireConfetti(canvas.current);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".bg .in", { x: () => rand(-400, 400), y: () => rand(-700, 700), rotation: () => rand(-180, 180),
          scale: 0, opacity: 0, duration: 1.1, ease: "back.out(1.4)", stagger: 0.08 })
        .from(".vid .in", { y: -800, opacity: 0, duration: 1, ease: "bounce.out" }, "-=0.4")
        .from(".topc .in", { scale: 0, rotation: -120, opacity: 0, duration: 0.9, ease: "elastic.out(1,.6)" }, "-=0.2")
        .add(() => gsap.to(".pol .in", { y: "+=8", duration: () => rand(1.6, 2.8), yoyo: true, repeat: -1, ease: "sine.inOut" }));
      gsap.delayedCall(0.5, celebrate);
      gsap.delayedCall(2.2, celebrate);

      gsap.timeline({ delay: 0.3 })
        .from(".ch", { y: 90, opacity: 0, rotation: () => rand(-35, 35), stagger: 0.045, duration: 0.7, ease: "back.out(2.2)" })
        .to(".banner", { top: "1.5%", scale: 0.55, duration: 1, ease: "power3.inOut" }, "+=1.3");

      gsap.utils.toArray(".spark").forEach((el) =>
        gsap.fromTo(el, { scale: 0, opacity: 0, rotation: 0 },
          { scale: 1, opacity: 1, rotation: 180, duration: rand(0.6, 1.4), delay: rand(0, 3), yoyo: true, repeat: -1, repeatDelay: rand(0.2, 1.5), ease: "sine.inOut" }));
      gsap.utils.toArray(".balloon").forEach((el) =>
        gsap.fromTo(el, { y: 0, x: 0 }, { y: -(window.innerHeight + 200), x: () => rand(-40, 40), duration: rand(6, 10),
          delay: rand(0.5, 4), repeat: -1, repeatDelay: rand(1, 4), ease: "none" }));
      gsap.to(".cake", { rotation: 12, yoyo: true, repeat: -1, duration: 0.6, ease: "sine.inOut" });
    }, root);
    return () => ctx.revert();
  }, []);

  const front = (id) => {
    zc.current++;
    const z = zc.current;
    if (id === "top") setTop((t) => ({ ...t, z }));
    else if (id === "video") setVideo((v) => ({ ...v, z }));
    else setItems((a) => a.map((i) => (i.id === id ? { ...i, z } : i)));
  };
  const move = (id, x, y) => {
    if (id === "top") setTop((t) => ({ ...t, x, y }));
    else if (id === "video") setVideo((v) => ({ ...v, x, y }));
    else setItems((a) => a.map((i) => (i.id === id ? { ...i, x, y } : i)));
  };
  const shuffle = () => {
    setItems((a) => a.map((i) => ({ ...i, r: Math.round(rand(-12, 12)) })));
    gsap.fromTo(".bg .in", { scale: 0.7 }, { scale: 1, duration: 0.8, ease: "elastic.out(1,.4)", stagger: 0.05 });
  };

  return (
    <div ref={root} className="stage">
      <style>{css}</style>
      {balloons.map((b, i) => <span key={i} className="balloon" style={{ left: b.l + "%" }}>{b.e}</span>)}
      {sparks.map((s, i) => <span key={i} className="spark" style={{ left: s.l + "%", top: s.t + "%", fontSize: s.s }}>✦</span>)}

      {items.map((p) => (
        <Polaroid key={p.id} p={p} cls="bg" onMove={move} onFront={front}>
          <div className="ph" style={{ height: p.h - 50, background: p.bg }}>{p.photo ? <img src={p.photo.src} alt="" draggable={false} style={{ objectPosition: p.photo.pos }} /> : p.emoji}</div>
          <div style={{ height: 30 }} />
        </Polaroid>
      ))}

      <Polaroid p={video} cls="vid" onMove={move} onFront={front}>
        <div className="ph" style={{ height: video.h - 60, background: "#0d0d12" }}>
         <img src="/photos/photo2.jpg" alt="memery"/> 
            <span className="hint">Enjoy Your Special Day</span>
        </div>
        <div className="cap" onDoubleClick={() => { const n = prompt("Handle", handle); if (n) setHandle(n); }}>
          <span>{handle}</span><span style={{ fontSize: 16 }}>⌨️ 🐦</span>
        </div>
      </Polaroid>

      <Polaroid p={top} cls="topc" onMove={move} onFront={front}>
        <div className="ph" style={{ height: top.h - 50, background: "linear-gradient(135deg,#1b1b3a,#b5179e)" }}>
          {top.src ? <img src={top.src} alt="" draggable={false} style={{ objectPosition: TOP_POS }} /> : "🎙️"}
        </div>
        <div className="cap" style={{ fontSize: 26 }}>Wishing You Sister</div>
      </Polaroid>

      <div className="banner">
        <span className="cake">🎂</span>{" "}
        {title.split("").map((c, i) => <span key={i} className="ch">{c === " " ? "\u00A0" : c}</span>)}
        {" "}<span className="cake">🎉</span>
      </div>

      <canvas ref={canvas} className="confetti" />
      <div className="bar">
        <button onClick={celebrate}>🎊 Celebrate</button>
        <button onClick={shuffle}>Shuffle</button>
      </div>
    </div>
  );
}

const css = `
:root{--bg:#fff;--card:#fff;--ink:#222;--shadow:rgba(0,0,0,.28);--btn:#222;--btnfg:#fff;--title:#d6336c}
@media (prefers-color-scheme:dark){:root{--bg:#15151a;--card:#f4f1ea;--shadow:rgba(0,0,0,.7);--btn:#f4f1ea;--btnfg:#15151a;--title:#ff8fab}}
html,body,#root{height:100%;margin:0}
body{background:var(--bg);overflow:hidden;font-family:'Caveat',cursive;touch-action:none}
.stage{position:relative;height:100%;width:100%;overflow:hidden;padding-top:env(safe-area-inset-top,0px);box-sizing:border-box}
.pol{position:absolute;cursor:grab;user-select:none;-webkit-user-select:none}
.pol .in{background:var(--card);padding:10px 10px 0;box-shadow:0 6px 18px var(--shadow);transition:box-shadow .2s}
.pol.drag{cursor:grabbing}.pol.drag .in{box-shadow:0 18px 38px var(--shadow)}
.ph{width:100%;display:flex;align-items:center;justify-content:center;font-size:42px;color:#fff;overflow:hidden}
.ph img,.ph video{width:100%;height:100%;object-fit:cover;display:block}
.hint{font:500 18px system-ui,sans-serif;text-align:center;padding:16px;opacity:.8}
.cap{height:46px;display:flex;align-items:center;justify-content:center;gap:10px;color:var(--ink);font-size:22px;font-weight:600}
.banner{position:fixed;left:0;right:0;top:36%;text-align:center;font-size:54px;font-weight:700;color:var(--title);
  z-index:9000;pointer-events:none;transform-origin:50% 0;text-shadow:0 3px 0 rgba(0,0,0,.12);line-height:1.1;padding:0 8px}
.ch,.cake{display:inline-block}
.confetti{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9500}
.spark{position:absolute;color:#ffc53d;pointer-events:none;z-index:8000;text-shadow:0 0 8px #ffd166}
.balloon{position:fixed;bottom:-90px;font-size:56px;pointer-events:none;z-index:0}
.bar{position:fixed;left:0;right:0;bottom:calc(12px + env(safe-area-inset-bottom,0px));display:flex;flex-wrap:wrap;gap:8px;justify-content:center;z-index:9999;padding:0 8px}
.bar button,.bar label{font:600 14px system-ui,sans-serif;background:var(--btn);color:var(--btnfg);border:0;border-radius:99px;padding:8px 14px;cursor:pointer}
.bar input{display:none}
`;
