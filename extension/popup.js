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
	const code = document.querySelector("code").textContent.trim();

	// would also be good to get problem difficulty and language used
	// maybe have a problem table that would have the info for the any problem that has a submitted solution with info about it
	// could trigger api to get prob info if a solution is added for a new problem

	// const capabilities = await ai.summarizer.capabilities();
	// if (capabilities.available !== "readily") {
	// 		console.error("no ai", capabilities);
	// 		return;
	// }
	// console.log("got ai");

    console.log("Title:", title);
    console.log("Time:", dateTime);
	console.log("Runtime:", runtime);
	console.log("Runtime Percent:", runtimePercent);
	console.log("Memory:", memory);
	console.log("Memory Percent:", memoryPercent);
	console.log("Code:", code);
}
