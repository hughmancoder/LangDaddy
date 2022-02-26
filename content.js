const url = chrome.runtime.getURL('words.json');
let jsonData;

fetch(url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
        jsonData = data
        translateRandomWords("Chinese")
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });


function translateRandomWords(lang){
    const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, caption, span')

    for (let i = 0; i < text.length; i++) {
        var random = getRndInteger(0,1)
        if (random == 2){
            continue
        } else {
            Object.keys(jsonData).forEach(x => {
                if (text[i].innerHTML.includes(" " + x + " " || " " + x + ".")){
                    console.log("matched word: " + x)
                    console.log(jsonData[x][lang])
                    text[i].innerHTML = text[i].innerHTML.replace(x, jsonData[x][lang])
                }
            });
        }
        text[i].innerHTML = text[i].innerHTML.replace(/\b(car)\b/i, `<span class="translated">auto</span>`)
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}