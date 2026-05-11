import "./style.css"

import { useEffect, useState } from "react"

function IndexPopup() {
  const [url, setUrl] = useState("Loading...")

  useEffect(() => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => {
        const currentTab = tabs[0]

        if (currentTab?.url) {
          setUrl(currentTab.url)
        }
      }
    )
  }, [])

  return (
    <div className="w-[350px] p-4 flex flex-col gap-3">
      <h1 className="text-xl font-bold">
        Privacy Risk Scanner
      </h1>

      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">
          Current website
        </span>

        <span className="break-all text-sm font-medium">
          {url}
        </span>
      </div>
    </div>
  )
}

export default IndexPopup