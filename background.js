// let color = '#3aa757';
let color = '#FFBF00'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %camber', `color: ${color}`);
});


// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ amber });
//   console.log('Default background color set to %camber', `color: ${amber}`);
// });