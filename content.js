(() => {
  "use strict";

  /* =========================================================
     1. TITLE SCANNER
  ========================================================= */
  let memoryVault = "";
  let currentUrl = window.location.href;

  function scanForTitle() {
    if (!window.location.href.includes('/watch/')) {
      memoryVault = "";
      chrome.runtime.sendMessage({ type: 'CLEAR_TITLE' });
      return; 
    }

    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      memoryVault = "";
      chrome.runtime.sendMessage({ type: 'CLEAR_TITLE' });
    }

    const uia = document.querySelector('[data-uia="video-title"]');
    const fallbackClass = document.querySelector('.video-title');
    let rawTitle = "";
    if (uia && uia.innerText) {
      rawTitle = uia.innerText;
    } else if (fallbackClass && fallbackClass.innerText) {
      rawTitle = fallbackClass.innerText;
    }
    if (!rawTitle) return;

    let cleanTitle = rawTitle.replace(' | Netflix', '').replace('Watch ', '').replace('Netflix', '').trim();
    const genericStrings = ['tv shows', 'movies', 'netflix', 'please wait...', ''];
    let isGeneric = false;
    for (const generic of genericStrings) {
      if (cleanTitle.toLowerCase() === generic.toLowerCase()) {
        isGeneric = true; break;
      }
    }
    if (isGeneric) return;

    if (cleanTitle !== memoryVault) {
      memoryVault = cleanTitle;
      chrome.runtime.sendMessage({ type: 'TITLE_UPDATE', title: memoryVault });
    }
  }
  setInterval(scanForTitle, 500);

  /* =========================================================
     2. GLOBAL VIBE DICTIONARY
  ========================================================= */
  const atmosphereDictionary = {
      "rain":       { color: "#4A6FA5", speed: 4.0,  density: 180 },
      "snow":       { color: "#F0F8FF", speed: 0.8,  density: 160 },
      "wind":       { color: "#B0C4DE", speed: 6.5,  density: 90  },
      "hail":       { color: "#D6E4F0", speed: 8.0,  density: 140 },
      "thunder":    { color: "#2C2C54", speed: 9.0,  density: 60  },
      "lightning":  { color: "#FFFFAA", speed: 15.0, density: 20  },
      "frost":      { color: "#C9E4F5", speed: 0.3,  density: 70  },
      "mist":       { color: "#D8D8D8", speed: 0.4,  density: 110 },
      "fog":        { color: "#BFC9CA", speed: 0.3,  density: 130 },
      "breeze":     { color: "#CDEAC0", speed: 2.0,  density: 60  },
      "tornado":    { color: "#5D6D7E", speed: 12.0, density: 220 },
      "hurricane":  { color: "#34495E", speed: 11.0, density: 210 },
      "drizzle":    { color: "#A9C9D6", speed: 1.5,  density: 100 },
      "monsoon":    { color: "#1B4F72", speed: 6.0,  density: 200 },
      "ice":        { color: "#AEEEEE", speed: 0.1,  density: 50  },
      "flame":      { color: "#FF6B1A", speed: 3.5,  density: 140 },
      "smoke":      { color: "#5A5A5A", speed: 0.6,  density: 100 },
      "ash":        { color: "#707070", speed: 0.5,  density: 60  },
      "ember":      { color: "#FF7F11", speed: 1.2,  density: 40  },
      "lava":       { color: "#E25822", speed: 0.4,  density: 170 },
      "dawn":       { color: "#FFD9A0", speed: 0.5,  density: 90  },
      "dusk":       { color: "#6A5ACD", speed: 0.6,  density: 100 },
      "twilight":   { color: "#4B3B6E", speed: 0.4,  density: 110 },
      "midnight":   { color: "#0B0B2A", speed: 0.2,  density: 40  },
      "sunrise":    { color: "#FFA552", speed: 0.7,  density: 120 },
      "sunset":     { color: "#FF6F61", speed: 0.6,  density: 130 },
      "moon":       { color: "#D6D6F5", speed: 0.2,  density: 50  },
      "star":       { color: "#FFF7CC", speed: 0.3,  density: 30  },
      "comet":      { color: "#B3E5FC", speed: 9.5,  density: 25  },
      "galaxy":     { color: "#2E1A47", speed: 1.0,  density: 200 },
      "eclipse":    { color: "#1A1A2E", speed: 0.1,  density: 20  },
      "aurora":     { color: "#7FFFD4", speed: 1.8,  density: 150 },
      "nebula":     { color: "#6A0DAD", speed: 0.8,  density: 190 },
      "nova":       { color: "#FFEFA1", speed: 13.0, density: 80  },
      "meteor":     { color: "#FF8C42", speed: 14.0, density: 30  },
      "love":       { color: "#E63960", speed: 1.0,  density: 110 },
      "joy":        { color: "#FFD23F", speed: 4.5,  density: 150 },
      "sorrow":     { color: "#4A5A6A", speed: 0.3,  density: 70  },
      "rage":       { color: "#B22222", speed: 9.0,  density: 180 },
      "fear":       { color: "#2F2F3F", speed: 7.0,  density: 50  },
      "calm":       { color: "#A8D8EA", speed: 0.4,  density: 60  },
      "hope":       { color: "#FFEAA7", speed: 1.2,  density: 100 },
      "dream":      { color: "#C9A9DD", speed: 0.6,  density: 90  },
      "despair":    { color: "#1C1C28", speed: 0.2,  density: 30  },
      "bliss":      { color: "#FFF1B8", speed: 1.0,  density: 120 },
      "longing":    { color: "#8E7CC3", speed: 0.5,  density: 80  },
      "grief":      { color: "#2B2B3D", speed: 0.2,  density: 40  },
      "passion":    { color: "#D7263D", speed: 5.0,  density: 160 },
      "serenity":   { color: "#B5EAD7", speed: 0.3,  density: 70  },
      "anxiety":    { color: "#6E6E6E", speed: 8.5,  density: 100 },
      "euphoria":   { color: "#FF61D2", speed: 6.0,  density: 170 },
      "melancholy": { color: "#5C6B73", speed: 0.3,  density: 60  },
      "wonder":     { color: "#9DD9D2", speed: 0.9,  density: 110 },
      "lust":       { color: "#C9184A", speed: 3.0,  density: 140 },
      "wrath":      { color: "#8B0000", speed: 10.0, density: 190 },
      "ocean":      { color: "#006994", speed: 2.5,  density: 200 },
      "forest":     { color: "#228B22", speed: 0.6,  density: 180 },
      "mountain":   { color: "#6E7B8B", speed: 0.1,  density: 50  },
      "desert":     { color: "#EDC9AF", speed: 1.5,  density: 70  },
      "river":      { color: "#5DADE2", speed: 3.0,  density: 150 },
      "leaf":       { color: "#7CB518", speed: 1.0,  density: 90  },
      "petal":      { color: "#FFB7C5", speed: 0.7,  density: 60  },
      "thorn":      { color: "#4B5320", speed: 2.0,  density: 40  },
      "vine":       { color: "#2E5339", speed: 0.3,  density: 70  },
      "blossom":    { color: "#FFD1DC", speed: 0.8,  density: 110 },
      "meadow":     { color: "#A3C586", speed: 0.5,  density: 130 },
      "tide":       { color: "#1A659E", speed: 4.0,  density: 170 },
      "wave":       { color: "#157FA3", speed: 5.5,  density: 190 },
      "jungle":     { color: "#145A32", speed: 1.4,  density: 200 },
      "canyon":     { color: "#B5651D", speed: 0.2,  density: 40  },
      "gold":       { color: "#FFD700", speed: 0.5,  density: 60  },
      "silver":     { color: "#C0C0C0", speed: 0.6,  density: 70  },
      "crystal":    { color: "#E0FFFF", speed: 0.4,  density: 50  },
      "obsidian":   { color: "#0B0B0B", speed: 0.3,  density: 30  },
      "pearl":      { color: "#F0EAD6", speed: 0.3,  density: 40  },
      "velvet":     { color: "#5D3FD3", speed: 0.2,  density: 90  },
      "rust":       { color: "#B7410E", speed: 0.4,  density: 60  },
      "marble":     { color: "#E8E8E8", speed: 0.1,  density: 30  },
      "crimson":    { color: "#990000", speed: 2.0,  density: 100 },
      "emerald":    { color: "#50C878", speed: 0.5,  density: 80  },
      "glitch":     { color: "#00FF9C", speed: 14.0, density: 50  },
      "neon":       { color: "#FF00FF", speed: 7.0,  density: 130 },
      "pulse":      { color: "#00FFFF", speed: 6.0,  density: 100 },
      "static":     { color: "#BFBFBF", speed: 12.0, density: 80  },
      "signal":     { color: "#39FF14", speed: 5.0,  density: 60  },
      "echo":       { color: "#6A8EAE", speed: 0.5,  density: 40  },
      "vortex":     { color: "#4B0082", speed: 9.0,  density: 200 },
      "quantum":    { color: "#00BFFF", speed: 11.0, density: 90  },
      "plasma":     { color: "#FF3CAC", speed: 8.5,  density: 150 },
      "circuit":    { color: "#00FF7F", speed: 4.0,  density: 70  },
      "venom":      { color: "#228B22", speed: 2.5,  density: 50  },
      "scream":     { color: "#FF0033", speed: 13.0, density: 60  },
      "shadow":     { color: "#14141E", speed: 0.3,  density: 80  },
      "war":        { color: "#4A0E0E", speed: 7.5,  density: 200 },
      "poison":     { color: "#6B8E23", speed: 1.5,  density: 70  },
      "ghost":      { color: "#E6E6FA", speed: 0.4,  density: 30  },
      "wolf":       { color: "#4F4F4F", speed: 5.5,  density: 90  },
      "raven":      { color: "#1B1B1B", speed: 2.0,  density: 40  },
      "whisper":    { color: "#C7C7C7", speed: 0.2,  density: 20  },
      "abyss":      { color: "#000000", speed: 0.1,  density: 10  },
      "fight":      { color: "#FF3B30", speed: 11.0, density: 130 },
      "prison":     { color: "#FF0000", speed: 10.0, density: 200 } 
  };

  /* =========================================================
     3. TIMELINE PARSER & TIMECODE UTILITY
  ========================================================= */
  function timecodeToSeconds(timecode) {
      if (!timecode) return 0;
      const parts = timecode.split(':');
      let seconds = 0;
      if (parts.length === 3) {
          seconds = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]); 
      } else if (parts.length === 2) {
          seconds = (+parts[0]) * 60 + (+parts[1]); 
      }
      return seconds;
  }

  let emotionTimeline = []; 
  let currentTimelineIndex = 0; 

  window.addEventListener("message", (event) => {
      if (event.source !== window || !event.data) return;

      if (event.data.type === 'ATMOS_TIMELINE_PAYLOAD') {
          console.log("📦 AtmosSync: Received the Raw Script!");
          const rawXML = event.data.data;
          
          emotionTimeline = [];
          currentTimelineIndex = 0;

          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(rawXML, "text/xml");
          const textNodes = xmlDoc.getElementsByTagName("p");

          for (let i = 0; i < textNodes.length; i++) {
              const node = textNodes[i];
              const beginAttr = node.getAttribute("begin");
              const endAttr = node.getAttribute("end");
              const textContent = node.textContent.trim();

              if (beginAttr && textContent) {
                  let assignedVibe = null;
                  const lowerText = textContent.toLowerCase();
                  
                  // Scans against the globally scoped dictionary above
                  for (const keyword in atmosphereDictionary) {
                      const regex = new RegExp(`\\b${keyword}\\b`, "i");
                      if (regex.test(lowerText)) {
                          assignedVibe = atmosphereDictionary[keyword];
                          break;
                      }
                  }

                  emotionTimeline.push({
                      start: timecodeToSeconds(beginAttr),
                      end: timecodeToSeconds(endAttr || beginAttr),
                      text: textContent,
                      vibe: assignedVibe 
                  });
              }
          }
          console.log(`🗺️ Emotion Timeline Built! Total Keyframes: ${emotionTimeline.length}`);
      }
  });

  /* =========================================================
     4. MASTER CLOCK ENGINE (With AI Look-Ahead Buffering)
  ========================================================= */
  let isAnalyzing = false;

  function syncWithVideo() {
      const videoElement = document.querySelector('video');
      if (!videoElement || emotionTimeline.length === 0) {
          requestAnimationFrame(syncWithVideo);
          return;
      }

      const currentTime = videoElement.currentTime;

      if (currentTimelineIndex < emotionTimeline.length) {
          const nextEvent = emotionTimeline[currentTimelineIndex];

          // 1. THE LOOK-AHEAD BUFFER: If the event is 2 seconds away, send it to the AI!
          if (nextEvent.start - currentTime <= 2.0 && !nextEvent.vibe && !isAnalyzing) {
              isAnalyzing = true;
              console.log(`🧠 Sending to AI: "${nextEvent.text}"`);
              
              chrome.runtime.sendMessage({ type: 'ANALYZE_EMOTION', text: nextEvent.text }, (response) => {
                  
                  // THE FIX: If the channel closes or errors out, unlock the buffer immediately
                  if (chrome.runtime.lastError) {
                      isAnalyzing = false;
                      return; 
                  }

                  if (response && response.vibe) {
                      nextEvent.vibe = response.vibe;
                      console.log(`🤖 AI Decided Emotion: [${response.emotion.toUpperCase()}]`);
                  }
                  
                  // Unlock the buffer for the next line of dialogue
                  isAnalyzing = false;
              });
          }

          // 2. THE TRIGGER: When the clock hits the exact millisecond!
          if (currentTime >= nextEvent.start) {
              if (nextEvent.vibe) {
                  console.log(`🎬 AI Vibe Triggered at ${currentTime}s`);
                  try {
                      chrome.runtime.sendMessage({ type: 'VIBE_UPDATE', payload: nextEvent.vibe }, () => {
                          if (chrome.runtime.lastError) {} 
                      });
                  } catch(e) {}
              }
              currentTimelineIndex++;
          }
          
          // Handle Seeking (fast forward/rewind)
          if (currentTime < nextEvent.start - 5 || currentTime > nextEvent.start + 5) {
              currentTimelineIndex = emotionTimeline.findIndex(event => event.start >= currentTime);
              if (currentTimelineIndex === -1) currentTimelineIndex = emotionTimeline.length;
          }
      }
      requestAnimationFrame(syncWithVideo);
  }

  // Boot up the engine
  syncWithVideo();
  console.log("🚀 AtmosSync Master Engine is LIVE! (V3 - AI Neural Mode)");

})();