// offscreen.js (Bulletproof V3 - Anti-Freeze)
import { pipeline, env } from './transformers.min.js';

env.allowLocalModels = false; 

// THE FIX: Tell the AI to NOT spawn illegal Web Workers. 
env.backends.onnx.wasm.numThreads = 1; 

let emotionClassifier = null;

const aiVibes = {
    "POSITIVE": { color: "#FFD700", speed: 2.0,  density: 150 }, 
    "NEGATIVE": { color: "#FF0000", speed: 10.0, density: 200 }  
};

async function loadModel() {
    if (!emotionClassifier) {
        console.log("🧠 Downloading AI Model (SST-2 Sentiment)...");
        emotionClassifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
        console.log("🧠 AI Model Loaded and Ready!");
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'RUN_INFERENCE') {
        
        loadModel().then(async () => {
            const output = await emotionClassifier(message.text);
            const topEmotion = output[0].label; 
            
            console.log(`🧠 AI Analyzed: "${message.text}" -> Emotion: ${topEmotion}`);
            
            // Send the success response
            sendResponse({ vibe: aiVibes[topEmotion], emotion: topEmotion });
            
        }).catch(err => {
            console.error("🚨 AI Crash:", err);
            // THE FIX: Even if it crashes, send a blank response to unlock content.js!
            sendResponse({ error: true }); 
        });
        
        return true; 
    }
});