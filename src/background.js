chrome.browserAction.onClicked.addListener(function (e) {
  // chrome.scripting.executeScript({
  //   files: ["stripe.js", "app.js"],
  //   target: { tabId: tab.id },
  // }); // V3

  console.log("⚡️Loading Stripe Remix...", e);
  fetch("https://js.stripe.com/v3").then((resp) => {
    resp.text().then((sjs) => {
      chrome.tabs.executeScript({ code: sjs });
      chrome.tabs.executeScript({ file: "app.js" });
    });
  });
});
