// Journey Inside a Computer — A-Frame scrollytelling.
// Scroll drives the camera rig along -z. Everything else is atmosphere.

const STOPS = [
  { z: 12,  num: "01", title: "Journey Inside a Computer", text: "Scroll down to fly from the motherboard, into the CPU, down to the transistors, and into the stream of binary itself." },
  { z: -22, num: "02", title: "The Motherboard", text: "Every component talks through this board. Copper traces carry signals between the CPU, memory, and everything plugged in. Watch the pulses travel." },
  { z: -56, num: "03", title: "The CPU", text: "The brain of the machine. Billions of times per second: fetch an instruction, decode it, execute it, repeat." },
  { z: -90, num: "04", title: "Transistors", text: "Zoom in far enough and the chip dissolves into switches. Each transistor is either on or off. That is all a computer ever is." },
  { z: -124, num: "05", title: "Binary", text: "On and off become 1 and 0. Every photo, song, and game you have ever seen is just a very long arrangement of these two digits." },
];

const scene = document.getElementById("scene");
const rig = document.getElementById("rig");
const overlay = document.getElementById("overlay");
const stationNum = document.getElementById("station-num");
const progressFill = document.getElementById("progress-fill");
const scrollHint = document.getElementById("scroll-hint");
const loader = document.getElementById("loader");

// ---------------------------------------------------------------- helpers
function el(tag, attrs = {}, parent = scene) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent.appendChild(e);
  return e;
}

// Soft radial glow texture (additive) for faking bloom cheaply.
function glowTexture(r, g, b) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d");
  const grad = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.35, `rgba(${r},${g},${b},0.45)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = grad;
  x.fillRect(0, 0, 128, 128);
  return c.toDataURL();
}
const TEX = {
  cyan: glowTexture(0, 229, 255),
  amber: glowTexture(255, 157, 0),
  magenta: glowTexture(255, 45, 120),
  violet: glowTexture(179, 102, 255),
  green: glowTexture(60, 255, 150),
};

function addGlow(parent, tex, size, pos) {
  return el("a-plane", {
    position: pos,
    width: size,
    height: size,
    "look-at": "#cam",
    material: `src: url(${tex}); transparent: true; blending: additive; depthWrite: false`,
  }, parent);
}

// ------------------------------------------------------------ STATION 1: motherboard
(function motherboard() {
  const s = document.getElementById("st-mobo");
  el("a-box", { width: 18, height: 0.35, depth: 12, color: "#0b4d27", metalness: 0.25, roughness: 0.65 }, s);

  // copper traces
  for (let i = 0; i < 14; i++) {
    const horiz = i % 2 === 0;
    el("a-box", {
      width: horiz ? 5 + Math.random() * 4 : 0.14,
      height: 0.05, depth: horiz ? 0.14 : 5 + Math.random() * 3,
      color: "#d4a017", metalness: 0.85, roughness: 0.3,
      emissive: "#d4a017", emissiveIntensity: 0.35,
      position: `${(Math.random() - 0.5) * 12} 0.2 ${(Math.random() - 0.5) * 8}`,
    }, s);
  }

  // CPU socket
  el("a-box", { width: 3.6, height: 1, depth: 3.6, color: "#141a28", metalness: 0.5, roughness: 0.4, position: "-3.5 0.65 0" }, s);
  addGlow(s, TEX.cyan, 7, "-3.5 1.4 0");

  // RAM sticks
  for (let i = -1; i <= 1; i++) {
    el("a-box", { width: 0.5, height: 1.6, depth: 5, color: "#1f6feb", metalness: 0.4, roughness: 0.4, emissive: "#1f6feb", emissiveIntensity: 0.3, position: `2.8 0.95 ${i * 2.2}` }, s);
  }

  // chipset + capacitors
  el("a-cylinder", { radius: 1, height: 0.55, color: "#243044", metalness: 0.6, roughness: 0.4, position: "-6 0.45 -3.4" }, s);
  for (let i = 0; i < 8; i++) {
    const bx = (Math.random() - 0.5) * 13, bz = (Math.random() - 0.5) * 8;
    el("a-cylinder", { radius: 0.16, height: 0.7, color: "#334155", metalness: 0.7, roughness: 0.35, position: `${bx.toFixed(1)} 0.5 ${bz.toFixed(1)}` }, s);
  }

  // blinking LEDs
  for (let i = 0; i < 6; i++) {
    const led = el("a-sphere", { radius: 0.12, color: "#3cff96", emissive: "#3cff96", emissiveIntensity: 2, position: `${(Math.random() - 0.5) * 12} 0.35 ${(Math.random() - 0.5) * 8}` }, s);
    led.setAttribute("animation", `property: material.emissiveIntensity; to: 0.1; dur: ${600 + Math.random() * 900}; dir: alternate; loop: true; easing: easeInOutSine`);
  }

  // data pulses racing along traces
  const pulses = [];
  for (let i = 0; i < 10; i++) {
    const p = el("a-sphere", { radius: 0.16, color: "#00e5ff", emissive: "#00e5ff", emissiveIntensity: 2.5 }, s);
    pulses.push({ m: p, x0: -6 + Math.random() * 4, x1: 2 + Math.random() * 5, z: (Math.random() - 0.5) * 8, speed: 0.25 + Math.random() * 0.4, t: Math.random() });
  }
  s.pulses = pulses;

  const label = el("a-text", { value: "MOTHERBOARD", color: "#9fb3c8", width: 6, align: "center", position: "0 3.4 -6.5" }, s);
  label.setAttribute("look-at", "#cam");
})();

// ------------------------------------------------------------ STATION 2: CPU
(function cpu() {
  const s = document.getElementById("st-cpu");
  el("a-box", { width: 8, height: 0.8, depth: 8, color: "#0e1420", metalness: 0.75, roughness: 0.3, position: "0 0 0" }, s);
  el("a-box", { width: 5, height: 0.6, depth: 5, color: "#123a6d", metalness: 0.35, roughness: 0.35, emissive: "#1f6feb", emissiveIntensity: 0.55, position: "0 0.7 0" }, s);
  addGlow(s, TEX.cyan, 14, "0 1.2 0");

  const label = el("a-text", { value: "CPU", color: "#ffffff", width: 9, align: "center", position: "0 2.2 0" }, s);
  label.setAttribute("look-at", "#cam");
  const sub = el("a-text", { value: "fetch  ·  decode  ·  execute", color: "#8b949e", width: 6, align: "center", position: "0 -1.2 4.4" }, s);
  sub.setAttribute("look-at", "#cam");

  // gold pins
  for (let x = -3.4; x <= 3.4; x += 0.62) {
    for (let z = -3.4; z <= 3.4; z += 0.62) {
      if (Math.abs(x) > 2.7 || Math.abs(z) > 2.7) {
        el("a-box", { width: 0.13, height: 0.55, depth: 0.13, color: "#d4a017", metalness: 0.9, roughness: 0.25, position: `${x.toFixed(2)} -0.5 ${z.toFixed(2)}` }, s);
      }
    }
  }

  // orbiting signal orbs
  const orbs = [];
  for (let i = 0; i < 12; i++) {
    const o = el("a-sphere", { radius: 0.16, color: "#00e5ff", emissive: "#00e5ff", emissiveIntensity: 2.2 }, s);
    orbs.push({ m: o, r: 5.6 + (i % 3) * 0.9, a: (i / 12) * Math.PI * 2, speed: 0.5 + (i % 4) * 0.14, y: 0.9 + (i % 3) * 0.5 });
  }
  s.orbs = orbs;

  // rotating halo ring
  const ring = el("a-torus", { radius: 6.4, tube: 0.07, color: "#00e5ff", emissive: "#00e5ff", emissiveIntensity: 1.4, position: "0 0.9 0", rotation: "90 0 0", opacity: 0.8, transparent: true }, s);
  ring.setAttribute("animation", "property: rotation; to: 90 360 0; dur: 14000; loop: true; easing: linear");
})();

// ------------------------------------------------------------ STATION 3: transistors
const transSwitches = [];
(function transistors() {
  const s = document.getElementById("st-trans");
  const label = el("a-text", { value: "1 transistor = 1 switch", color: "#ffb300", width: 8, align: "center", position: "0 5.2 0" }, s);
  label.setAttribute("look-at", "#cam");
  addGlow(s, TEX.amber, 16, "0 2 0");

  // silicon wafer base
  el("a-cylinder", { radius: 9, height: 0.4, color: "#1a2233", metalness: 0.6, roughness: 0.4, position: "0 -0.2 0" }, s);

  let n = 0;
  for (let x = -6.5; x <= 6.5; x += 1.45) {
    for (let z = -6.5; z <= 6.5; z += 1.45) {
      const on = (n++ % 3) !== 0;
      const t = el("a-box", {
        width: 1, depth: 1, color: on ? "#b36a00" : "#2b2118",
        emissive: on ? "#ff9d00" : "#000000", emissiveIntensity: on ? 0.9 : 0,
        position: `${x.toFixed(2)} 0 ${z.toFixed(2)}`,
      }, s);
      transSwitches.push({ m: t, x, z, on, phase: Math.random() * Math.PI * 2 });
    }
  }
})();

// ------------------------------------------------------------ STATION 4: binary
const bits = [];
(function binary() {
  const s = document.getElementById("st-binary");
  const label = el("a-text", { value: "everything is 1s and 0s", color: "#00e5ff", width: 9, align: "center", position: "0 5.4 0" }, s);
  label.setAttribute("look-at", "#cam");

  for (let i = 0; i < 90; i++) {
    const one = Math.random() > 0.5;
    const b = el("a-text", {
      value: one ? "1" : "0",
      color: one ? "#00e5ff" : "#ff2d78",
      width: 2.6, align: "center",
      opacity: 0.9, transparent: true,
      position: `${((Math.random() - 0.5) * 20).toFixed(1)} ${(Math.random() * 9 - 1.5).toFixed(1)} ${((Math.random() - 0.5) * 18).toFixed(1)}`,
    }, s);
    b.setAttribute("look-at", "#cam");
    bits.push({ m: b, y0: parseFloat(b.getAttribute("position").y), speed: 0.4 + Math.random() * 0.9, phase: Math.random() * Math.PI * 2 });
  }
})();

// ------------------------------------------------------------ STATION 5: finale
(function finale() {
  const s = document.getElementById("st-finale");
  const core = el("a-sphere", { radius: 2.2, color: "#2a1650", emissive: "#b366ff", emissiveIntensity: 1.1, metalness: 0.3, roughness: 0.3, position: "0 2.4 0" }, s);
  core.setAttribute("animation", "property: rotation; to: 0 360 0; dur: 20000; loop: true; easing: linear");
  addGlow(s, TEX.violet, 22, "0 2.4 0");

  for (let i = 0; i < 3; i++) {
    const ring = el("a-torus", { radius: 4 + i * 1.6, tube: 0.06, color: "#b366ff", emissive: "#b366ff", emissiveIntensity: 1.2, transparent: true, opacity: 0.7, position: "0 2.4 0", rotation: `${i * 30} ${i * 45} 0` }, s);
    ring.setAttribute("animation", `property: rotation; to: ${i * 30} ${i * 45 + 360} 0; dur: ${16000 + i * 5000}; loop: true; easing: linear`);
  }

  const label = el("a-text", { value: "thanks for flying", color: "#e6edf3", width: 8, align: "center", position: "0 6.4 0" }, s);
  label.setAttribute("look-at", "#cam");
  const sub = el("a-text", { value: "scroll back up to return", color: "#8b949e", width: 5, align: "center", position: "0 5.4 0" }, s);
  sub.setAttribute("look-at", "#cam");
})();

// ------------------------------------------------------------ dust particles (whole journey)
(function dust() {
  const wrap = document.getElementById("dust");
  const geo = new THREE.BufferGeometry();
  const N = 700;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = Math.random() * 12 - 2;
    pos[i * 3 + 2] = 14 - Math.random() * 165;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x88ccff, size: 0.09, transparent: true, opacity: 0.55, sizeAttenuation: true });
  wrap.setObject3D("mesh", new THREE.Points(geo, mat));
})();

// ------------------------------------------------------------ scroll → camera
let targetZ = STOPS[0].z;
let currentZ = STOPS[0].z;
let currentCard = -1;

const cards = STOPS.map((st, i) => {
  const d = document.createElement("div");
  d.className = "card";
  d.innerHTML = `<div class="card-num">${st.num}</div><h1>${st.title}</h1><p>${st.text}</p>`;
  overlay.appendChild(d);
  return d;
});

function onScroll() {
  const max = document.body.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

  const seg = p * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(seg));
  const t = seg - i;
  // smoothstep easing between waypoints
  const e = t * t * (3 - 2 * t);
  targetZ = STOPS[i].z + (STOPS[i + 1].z - STOPS[i].z) * e;

  const nearest = Math.round(seg);
  if (nearest !== currentCard) {
    currentCard = nearest;
    cards.forEach((c, ci) => c.classList.toggle("active", ci === nearest));
    stationNum.textContent = STOPS[nearest].num;
  }
  progressFill.style.width = `${p * 100}%`;

  if (window.scrollY > 60) scrollHint.classList.add("gone");
  else scrollHint.classList.remove("gone");
}
window.addEventListener("scroll", onScroll, { passive: true });

// ------------------------------------------------------------ main loop
const clock = new THREE.Clock();
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;

  // glide camera toward scroll target + gentle bob and sway
  currentZ += (targetZ - currentZ) * 0.055;
  const y = 3.4 + Math.sin(time * 0.7) * 0.22;
  const x = Math.sin(time * 0.23) * 0.55;
  rig.setAttribute("position", `${x.toFixed(3)} ${y.toFixed(3)} ${currentZ.toFixed(3)}`);

  // motherboard data pulses
  const mobo = document.getElementById("st-mobo");
  if (mobo.pulses) {
    for (const p of mobo.pulses) {
      p.t += dt * p.speed;
      if (p.t > 1) p.t = 0;
      p.m.setAttribute("position", `${(p.x0 + (p.x1 - p.x0) * p.t).toFixed(2)} 0.35 ${p.z.toFixed(2)}`);
    }
  }

  // CPU orbiting orbs
  const cpu = document.getElementById("st-cpu");
  if (cpu.orbs) {
    for (const o of cpu.orbs) {
      o.a += dt * o.speed;
      o.m.setAttribute("position", `${(Math.cos(o.a) * o.r).toFixed(2)} ${o.y.toFixed(2)} ${(Math.sin(o.a) * o.r).toFixed(2)}`);
    }
  }

  // transistor wave: on-switches breathe in a traveling wave
  for (const s of transSwitches) {
    if (!s.on) continue;
    const wave = Math.sin(time * 2.2 + s.x * 0.7 + s.z * 0.5 + s.phase);
    const h = 0.9 + wave * 0.55;
    s.m.setAttribute("height", h.toFixed(3));
    s.m.setAttribute("position", `${s.x.toFixed(2)} ${(h / 2).toFixed(3)} ${s.z.toFixed(2)}`);
  }

  // binary drift
  for (const b of bits) {
    const yb = b.y0 + Math.sin(time * b.speed + b.phase) * 1.1;
    const pos = b.m.getAttribute("position");
    b.m.setAttribute("position", `${pos.x} ${yb.toFixed(2)} ${pos.z}`);
  }

  requestAnimationFrame(tick);
}

scene.addEventListener("loaded", () => {
  loader.classList.add("done");
  onScroll();
  tick();
});
// Fallback in case the event already fired
if (scene.hasLoaded) {
  loader.classList.add("done");
  onScroll();
  tick();
}
