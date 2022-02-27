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

async function doSave() {
  await chrome.storage.sync.set({autoSave: collectData()});
  chrome.tabs.reload(function(){});
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

document.getElementById("wordchance").addEventListener("change", ({target}) => {
  if (target.value > 100) {
    target.value = 100
  } else if (target.value < 1) {
    target.value = 1
  }
})

const url = chrome.runtime.getURL('words.json');
  let hoverTimer;

    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          // Examine the text in the response
          response.json().then(function (data) {
            document.getElementById("words").value = Object.keys(data).join("\n")
          });
        }
      )
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });