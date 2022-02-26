// Initialize button with user's preferred color
//let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//     changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: setPageBackgroundColor,
//     });
// });

// The body of this function will be executed as a content script inside the
// current page
// function setPageBackgroundColor() {
//     chrome.storage.sync.get("color", ({ color }) => {
//         document.body.style.backgroundColor = color;
//     });
// }

const STORAGE_SELECTOR = '.storage[id]';
let debounceTimer;

document.addEventListener('change', saveOnChange);
document.addEventListener('input', saveOnChange);


function saveOnChange(e) {
  if (e.target.closest(STORAGE_SELECTOR)) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSave, 100);
  }
}

function collectData() {
  const data = {};
  for (const el of document.querySelectorAll(STORAGE_SELECTOR))
    data[el.id] = el.type === 'checkbox' ? el.checked : el.value; 
  return data;
}

function doSave() {
  chrome.storage.sync.set({autoSave: collectData()});
}

function loadFromStorage() {
  chrome.storage.sync.get(data => {
    if (data.autoSave) data = data.autoSave;
    for (const [id, value] of Object.entries(data)) {
      const el = document.getElementById(id);
      if (el) el[el.type === 'checkbox' ? 'checked' : 'value'] = value;
    }
  });
}

loadFromStorage();

document.getElementById("wordchance").addEventListener("input", ({target}) => {
  if (target.value > 100) {
    target.value = 100
  } else if (target.value < 1) {
    target.value = 1
  }
})