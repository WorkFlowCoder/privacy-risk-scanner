import { cleanPageContent } from "./cleanPageContent"

export const extractPageContent = async (): Promise<{
  content: string
  title: string
  url: string
}> => {
  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    if (!activeTab?.id) {
      throw new Error("No active tab")
    }

    console.log("📤 Sending message to tab:", activeTab.id)

    const response = await chrome.tabs.sendMessage(activeTab.id, {
      type: "GET_PAGE_CONTENT",
    })

    console.log("📥 Response:", response)

    return {
      content: cleanPageContent(response?.content) || "",
      title: response?.title || "",
      url: response?.url || "",
    }
  } catch (error) {
    console.error("❌ extractPageContent error:", error)

    return {
      content: "",
      title: "",
      url: "",
    }
  }
}