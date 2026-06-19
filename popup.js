document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     1. GLOBAL VIBE VARIABLES (The Reactive State)
  ========================================================= */
  // These are the defaults. The Bridge will overwrite these!
  let currentRGB = "255, 214, 130"; 
  let currentSpeedMult = 1.0;
  let currentDensity = 14;

  /* =========================================================
     2. FIREFLY CANVAS — Brownian drift + cursor easing
  ========================================================= */
  const canvas = document.getElementById("fireflies");
  const ctx = canvas.getContext("2d");
  const W = 350, H = 500;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();

  const mouse = { x: -999, y: -999, active: false };
  let attract = false;

  const flies = [];
  
  // Function to dynamically add/remove flies based on the Vibe Dictionary
  function adjustFlies(targetCount) {
    while (flies.length < targetCount) {
      flies.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 2.2, baseAlpha: 0.35 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2, pulse: 0.012 + Math.random() * 0.02
      });
    }
    if (flies.length > targetCount) {
      flies.length = targetCount; // Instantly deletes excess flies
    }
  }
  
  // Initialize default flies
  adjustFlies(currentDensity);

  let raf;
  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const f of flies) {
      // Speed multiplier applied here!
      f.vx += (Math.random() - 0.5) * 0.06 * currentSpeedMult;
      f.vy += (Math.random() - 0.5) * 0.06 * currentSpeedMult;

      if (mouse.active) {
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 0.1) {
          const force = (110 - dist) / 110 * 0.12;
          const dir = attract ? -1 : 1;
          f.vx += (dx / dist) * force * dir;
          f.vy += (dy / dist) * force * dir;
        }
      }

      f.vx *= 0.94;
      f.vy *= 0.94;
      
      const speed = Math.hypot(f.vx, f.vy);
      if (speed < 0.15) {
        f.vx += (Math.random() - 0.5) * 0.12 * currentSpeedMult;
        f.vy += (Math.random() - 0.5) * 0.12 * currentSpeedMult;
      }

      f.x += f.vx;
      f.y += f.vy;

      if (f.x < -10) f.x = W + 10;
      if (f.x > W + 10) f.x = -10;
      if (f.y < -10) f.y = H + 10;
      if (f.y > H + 10) f.y = -10;

      f.phase += f.pulse;
      const a = f.baseAlpha * (0.55 + 0.45 * Math.sin(f.phase));

      // Dynamic Color applied here!
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
      grad.addColorStop(0, `rgba(${currentRGB}, ${a})`);
      grad.addColorStop(0.4, `rgba(${currentRGB}, ${a * 0.4})`);
      grad.addColorStop(1, `rgba(${currentRGB}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
      ctx.fill();

      // Core of the firefly (slightly brighter white/yellow)
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, a + 0.2)})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  tick();

  setInterval(() => { attract = Math.random() > 0.5; }, 4000);

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", () => { mouse.active = false; mouse.x = -999; mouse.y = -999; });

  /* =========================================================
     3. WEB AUDIO & TOGGLE & CLOSE (Unchanged)
  ========================================================= */
  let audioCtx = null;
  function snap() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) {}
  }

  const toggle = document.getElementById("toggle");
  const statusEl = document.getElementById("status");
  const statusText = document.getElementById("statusText");
  const caret = document.getElementById("caret");
  let isOn = false;
  let typeTimer = null;
  const ON_MSG = "Igniting the Aura...";
  const OFF_MSG = "Aura at rest";

  function typewrite(msg, glow) {
    clearTimeout(typeTimer);
    statusText.textContent = "";
    caret.classList.add("blink");
    statusEl.style.color = glow ? "rgba(252, 217, 140, 0.95)" : "rgba(255,255,255,0.4)";
    statusEl.style.textShadow = glow ? "0 0 14px rgba(252,217,140,0.5)" : "none";

    let i = 0;
    (function step() {
      if (i <= msg.length) {
        statusText.textContent = msg.slice(0, i);
        i++;
        typeTimer = setTimeout(step, 45 + Math.random() * 35);
      } else {
        setTimeout(() => caret.classList.remove("blink"), 600);
      }
    })();
  }

  function setState(on) {
    isOn = on;
    toggle.classList.toggle("on", on);
    toggle.setAttribute("aria-checked", String(on));
    snap();
    typewrite(on ? ON_MSG : OFF_MSG, on);
  }

  toggle.addEventListener("click", () => setState(!isOn));

  const closeBtn = document.getElementById("closeBtn");
  const app = document.getElementById("app");

  function blast() {
    const particles = [];
    const cx = W / 2, cy = H / 2;
    for (let i = 0; i < 60; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 4;
      particles.push({
        x: cx + (Math.random() - 0.5) * 120, y: cy + (Math.random() - 0.5) * 200,
        vx: Math.cos(ang) * sp, vy: -Math.abs(Math.sin(ang) * sp) - 1.5,
        r: 1 + Math.random() * 2.5, life: 1
      });
    }
    cancelAnimationFrame(raf);
    (function burst() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.vx *= 0.99; p.life -= 0.018;
        const a = Math.max(0, p.life);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grad.addColorStop(0, `rgba(${currentRGB}, ${a})`);
        grad.addColorStop(1, `rgba(${currentRGB}, 0)`);
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
      }
      if (alive) requestAnimationFrame(burst);
    })();
  }

  closeBtn.addEventListener("click", () => {
    snap(); app.classList.add("dissolving"); blast();
    setTimeout(() => { try { window.close(); } catch (e) {} }, 650);
  });

  const movieTitleEl = document.getElementById("movieTitle");
  if (movieTitleEl) {
    chrome.storage.local.get(['currentNetflixTitle'], (result) => {
      if (result && result.currentNetflixTitle) {
        movieTitleEl.textContent = result.currentNetflixTitle;
      }
    });
  }

  /* =========================================================
     4. THE BRIDGE RECEIVER (Reacting to the Brain)
  ========================================================= */
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'VIBE_UPDATE') {
        const newVibe = message.payload;
        console.log("🌌 Popup received new vibe from Netflix:", newVibe);

        // Convert the Hex color (e.g., "#FF0000") to RGB string ("255, 0, 0") for the Canvas
        const hex = newVibe.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Update the global state!
        currentRGB = `${r}, ${g}, ${b}`;
        currentSpeedMult = newVibe.speed;
        adjustFlies(newVibe.density); // Instantly spawns or kills particles

        // Optional UI Feedback in the popup menu
        if(statusText) {
            statusText.textContent = "Vibe Shifted...";
        }
    }
  });

});