document.getElementById("butt").addEventListener("click", async () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    	chrome.scripting.executeScript({
      		target: { tabId: tabs[0].id },
      		function: scrapeData,
    	});
  	});
});

async function scrapeData() {
    const title = document.title.split(" - LeetCode")[0];
	const dateTime = document.querySelectorAll(".max-w-full.truncate")[1]?.textContent.trim();
	const elements = document.querySelectorAll(".text-sd-foreground.text-lg.font-semibold");
	const [runtime, runtimePercent, memory, memoryPercent] = Array.from(elements).map(el => el.textContent.trim());

    console.log("Title:", title);
    console.log("Time:", dateTime);
	console.log("Runtime:", runtime);
	console.log("Runtime Percent:", runtimePercent);
	console.log("Memory:", memory);
	console.log("Memory Percent:", memoryPercent);
}
