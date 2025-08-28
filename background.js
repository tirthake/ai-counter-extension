// A list of the websites you want to count visits for, mapped to their display names.
const TARGET_URLS = {
  "https://chat.openai.com/": "ChatGPT",
  "https://chatgpt.com/": "ChatGPT",
  "https://gemini.google.com/": "Gemini",
  "https://chat.deepseek.com/":"Deepseek",
  "https://copilot.microsoft.com/":"Copilot",
  // You can add other AI sites here. The key is the URL, the value is the display name.
};

// Use an asynchronous function to get the current visit counts from storage.
async function getVisitCounts() {
  const { siteCounts } = await chrome.storage.local.get("siteCounts");
  return siteCounts || {};
}

// Use an asynchronous function to save the new visit counts to storage.
async function saveVisitCounts(counts) {
  await chrome.storage.local.set({ "siteCounts": counts });
}

// Add a listener for the webNavigation.onCommitted event.
chrome.webNavigation.onCommitted.addListener(async (details) => {
  // The frameId of 0 indicates a main frame navigation.
  if (details.frameId === 0) {
    // Find the URL that matches a target site.
    const urlKey = Object.keys(TARGET_URLS).find(url => details.url.startsWith(url));
    
    if (urlKey) {
      // Get the current counts from storage.
      let counts = await getVisitCounts();
      
      // Increment the count for the specific site.
      const siteName = TARGET_URLS[urlKey];
      counts[siteName] = (counts[siteName] || 0) + 1;
      
      // Save the new counts back to storage.
      await saveVisitCounts(counts);
      
      // Log the new count to the console for debugging purposes.
      console.log(`Visit to ${siteName} detected. Total visits: ${counts[siteName]}`);
    }
  }
});
chrome.runtime.onStartup.addListener(async () => {
  console.log("Browser starting up. Resetting visit counts.");
  await chrome.storage.local.remove("siteCounts");
});