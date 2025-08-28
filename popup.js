// A mapping of the site names to their respective HTML element IDs.
const SITE_MAPPING = {
  "ChatGPT": "chatgptCount",
  "Gemini": "geminiCount",
  "Deepseek":"deepseekCount",
  "Copilot":"copilotCount",
};

document.addEventListener('DOMContentLoaded', async () => {
  // Get the current visit counts object from storage.
  const { siteCounts } = await chrome.storage.local.get("siteCounts");

  // Iterate over the site mapping to update each count in the popup.
  for (const siteName in SITE_MAPPING) {
    if (SITE_MAPPING.hasOwnProperty(siteName)) {
      const elementId = SITE_MAPPING[siteName];
      const count = (siteCounts && siteCounts[siteName]) || 0;
      
      const countDisplay = document.getElementById(elementId);
      if (countDisplay) {
        countDisplay.textContent = count;
      }
    }
  }
});