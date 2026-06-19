(() => {
  "use strict";

  // Auto-Reloader for development - reloads Netflix tabs on extension install/reload
  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ url: "*://*.netflix.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    });
  });

  // Background script for Manifest V3
  // Simple listener for Memory Vault updates from content script
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TITLE_UPDATE') {
      chrome.storage.local.set({ currentNetflixTitle: msg.title });
    } else if (msg.type === 'CLEAR_TITLE') {
      chrome.storage.local.set({ currentNetflixTitle: 'Browsing Netflix...' });
    }
    return true; // Keep message channel open for async response
  });
})();
/* =========================================================
   ATMOSSYNC: AI TRAFFIC CONTROLLER (Phase 1)
========================================================= */

let creatingOffscreenDocument; 

async function setupOffscreenDocument(path) {
    // Check if the hidden AI room already exists
    if (await chrome.offscreen.hasDocument()) return;
    
    // Check if we are currently in the middle of building it
    if (creatingOffscreenDocument) {
        await creatingOffscreenDocument;
    } else {
        // Build the hidden room
        creatingOffscreenDocument = chrome.offscreen.createDocument({
            url: path,
            reasons: ['WORKERS'],
            justification: 'Running local Transformers.js ML model for emotion analysis'
        });
        await creatingOffscreenDocument;
        creatingOffscreenDocument = null;
    }
}

// Listen for text from Netflix (content.js) and route it to the AI (offscreen.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    // We only care about messages asking for Emotion Analysis
    if (message.type === 'ANALYZE_EMOTION') {
        
        // Ensure the AI room is built, then send the text to it
        setupOffscreenDocument('offscreen.html').then(() => {
            chrome.runtime.sendMessage({
                type: 'RUN_INFERENCE',
                text: message.text
            }, (response) => {
                // Take the AI's answer and send it back to Netflix
                sendResponse(response); 
            });
        });
        
        // CRITICAL: This tells Chrome to keep the radio channel open 
        // while we wait for the AI to finish thinking.
        return true; 
    }
    
    // (If your original background.js has its own onMessage listener, 
    // it will still run perfectly alongside this one!)
});