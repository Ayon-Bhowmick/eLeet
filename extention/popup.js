document.getElementById("butt").addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    	chrome.scripting.executeScript({
      		target: { tabId: tabs[0].id },
      		function: scrapeData,
    	});
  	});
});
