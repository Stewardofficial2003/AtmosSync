// interceptor.js (The Dragnet Upgrade - Bug Free)
console.log("🕵️ AtmosSync Network Interceptor Deployed (V2 - Dragnet)");

// --- 1. HIJACK FETCH ---
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
    
    // Clone and read safely
    const clone = response.clone();
    clone.text().then(textPayload => {
        checkAndSmuggle(url, textPayload);
    }).catch(e => {}); // Silently ignore binary data

    return response;
};

// --- 2. HIJACK XHR (XMLHttpRequest) ---
const originalXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    this.addEventListener('load', function() {
        let textPayload = null;
        
        // THE FIX: Try reading immediately inside the safety block
        try {
            textPayload = this.responseText;
        } catch (e) {
            return; // It's an arraybuffer/video. Exit silently.
        }
        
        if (textPayload) {
            checkAndSmuggle(this._url, textPayload);
        }
    });
    return originalXhrOpen.apply(this, arguments);
};

// --- 3. THE INSPECTOR ---
function checkAndSmuggle(url, textPayload) {
    if (!url || !textPayload) return;

    const isLikelySubtitle = url.includes('?o=') || url.includes('.xml') || url.includes('.vtt') || url.includes('timedtext');

    if (isLikelySubtitle) {
        if (textPayload.includes('<?xml') || textPayload.includes('<tt') || textPayload.includes('begin=')) {
            console.log("🔥 TARGET ACQUIRED! Smuggling payload to content.js...");
            
            window.postMessage({
                type: 'ATMOS_TIMELINE_PAYLOAD',
                data: textPayload
            }, '*');
        }
    }
}