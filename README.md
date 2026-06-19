<div align="center">
  
# 🌌 AtmosSync
*Turning ordinary screens into living atmospheres.*

[![Built for Netflix](https://img.shields.io/badge/Built_for-Netflix-E50914?style=for-the-badge&logo=netflix&logoColor=white)](https://netflix.com)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)]()

</div>

---

## 📖 The Story

We watch films to escape, to feel something deeper than our everyday reality. But the digital spaces where we consume them—our web browsers—are rigid, sterile, and cluttered with tabs. 

**AtmosSync was built to break the barrier of the screen.**

I wanted to engineer a tool that pulls the cinematic magic of a Netflix movie *out* of the video player and into your room. It’s not just a utility; it’s an interactive digital ambience. By blending tactile audio feedback, frosted-glass UI, and a reactive particle system, AtmosSync transforms your screen from a simple display into a living, breathing environment.

---

## ✨ The Experience

AtmosSync doesn't just sit in your browser; it interacts with you.

* 🪲 **Living Particle System:** A custom HTML5 Canvas renders a "Night Forest" of golden fireflies. They don't just float randomly—they use Brownian motion for natural drift and softly magnetize to your cursor as you move.
* 🎛️ **Tactile UI:** Inspired by premium hardware, the UI features a satisfying, animated toggle switch backed by synthesized Web Audio "snaps" (no external audio files needed).
* 📝 **Cinematic Typography:** A custom typewriter effect announces your aura state, complete with blinking carets and glowing text shadows.
* 🎬 **Context Aware:** Silently tracks your Netflix session, seamlessly updating its UI to display exactly what universe you are currently vibing to.

---

## 🛠️ Under the Hood

Beautiful design means nothing without robust engineering. AtmosSync was built to be lightning-fast and highly secure.

* **100% Vanilla:** No React, No Tailwind, No heavy dependencies. Just pure, optimized HTML, CSS, and JavaScript.
* **Manifest V3 Compliant:** Fully respects Google Chrome's strictest security protocols (CSP), utilizing `chrome.storage.local` and safe content scripts to bridge the gap between the browser popup and the Netflix DOM.
* **Memory Safe:** The particle system is deeply optimized with `requestAnimationFrame` and canvas boundary wrapping to ensure zero frame-rate drops while watching high-resolution movies.

---

## 🚀 Ignite the Aura (Installation)

Since AtmosSync is currently an independent developer build, you can install it directly from the source in under 60 seconds:

1. Download or clone this repository to your machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** (top right corner).
4. Click **Load unpacked** and select the `AtmosSync` folder.
5. Pin the 🌌 icon to your toolbar.
6. Open [Netflix](https://netflix.com), start your favorite film, and click the icon to set the vibe.

---

<div align="center">
  <p><i>"Engineering digital ambience. Bridging the gap between pixel-perfect design and immersive code."</i></p>
  <b>Built by Steward</b>
</div>
