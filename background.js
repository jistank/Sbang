/*
  THIS SCRIPT RECEIVES  EVERY  STARTPAGE CALL
  AND REDIRECT THE USER TO THE SPECIFIED SITE
*/

let g_bangs = {};

async function loadBangs() {
  let data = await browser.storage.local.get("bangs");
  g_bangs = {}; // reset dictionary before reloading from storage
  if (data.bangs) {
    for (let i = 0; i < data.bangs.length; i++) {
      let element = data.bangs[i];
      g_bangs[element.shortcut.toLowerCase()] = element.url;
    }
  }
}

loadBangs();

browser.storage.onChanged.addListener(loadBangs);
browser.webRequest.onBeforeRequest.addListener(
  function(request) {
    let url = new URL(request.url);
    let searchedText = url.searchParams.get("query") || url.searchParams.get("q");
    if (!searchedText) return;
    let words = searchedText.trim().split(/\s+/);
    let foundBang = null;
    let researchTerms = [];
    for (let i = 0; i < words.length; i++) {
      if (words[i].startsWith("!") && !foundBang) {
        foundBang = words[i].toLowerCase();
      } else {
        researchTerms.push(words[i]);
      }
    }
    if (foundBang && g_bangs[foundBang]) {
      let goal = g_bangs[foundBang].replace("{query}", encodeURIComponent(researchTerms.join(" ")));
      return { redirectUrl: goal };
    }
  },
  { urls: ["https://*.startpage.com/*"] },
  ["blocking"]
);
