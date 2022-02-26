let defaultSettings = {language: "Spanish", enabled: true, highlight: true, wordchance: 20};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({autoSave: defaultSettings})
});