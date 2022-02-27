let defaultSettings = {language: "Spanish", enabled: true, highlight: true, wordchance: 20};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({autoSave: defaultSettings})
});

chrome.contextMenus.create({
  title: "Add to wordlist",
  contexts: ["selection"],
  id: "LangDaddy",
}, function(){})