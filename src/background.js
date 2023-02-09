chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    files: ["stripe.js", "app.js"],
    target: { tabId: tab.id },
  });
});
