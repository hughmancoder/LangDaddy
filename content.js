chrome.storage.sync.get(({ autoSave }) => {
  const url = chrome.runtime.getURL('words.json');
  let hoverTimer;
  let jsonData = {};

  if (autoSave.enabled) {
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
            jsonData = data
            translateRandomWords()
          });
        }
      )
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  }

  function translateRandomWords() {
    const text = document.querySelectorAll('p')
    let classes = autoSave.highlight ? "translatedhighlight translated" : "translated"
    for (let i = 0; i < text.length; i++) {
      Object.keys(jsonData).forEach(x => {
        let regex = new RegExp(`\\b${x}\\b`, "i")
        let lastIndex = 0
        let translatedText = text[i].innerHTML

        while (true) {
          let start = translatedText.substring(0, lastIndex)
          let end = translatedText.substring(lastIndex)
          let index = end.search(regex)
          if (index == -1) {
            break;
          }
          lastIndex = index
          if (Math.random() <= autoSave.wordchance / 100) {
            end = end.replace(regex, `<span class="${classes}">${jsonData[x][autoSave.language]}</span>`)
            lastIndex += `<span class="${classes}">${jsonData[x][autoSave.language]}</span>`.length
          } else {
            lastIndex += x.length
          }
          translatedText = start + end
        }
        text[i].innerHTML = translatedText
      });
    }
    for (element of document.getElementsByClassName("translated")) {
      let word = element.innerText
      element.addEventListener("mouseenter", ({ target }) => {
        hoverTimer = setTimeout(() => {
          const popup = document.createElement("div")
          popup.classList.add("langpopup")
          popup.innerText = getReverseTranslation(word)
          target.appendChild(popup)
        }, 500)
      })
      element.addEventListener("mouseleave", ({ target }) => {
        clearTimeout(hoverTimer)
        target.innerText = word
      })
    }
  }

  function getReverseTranslation(word) {
    return Object.keys(jsonData).find(key => jsonData[key][autoSave.language] === word);
  }
})
