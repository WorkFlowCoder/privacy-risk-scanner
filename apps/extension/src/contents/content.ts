export {}

console.log("✅ CONTENT SCRIPT LOADED")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_CONTENT") {
    const content = document.body?.innerText || ""

    sendResponse({
      content,
      title: document.title,
      url: window.location.href,
    })
  }

  return true
})