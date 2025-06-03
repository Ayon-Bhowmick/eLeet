//auto retrieve data when popup opens
document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup opened, attempting to retrieve data...');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('Found active tab:', tabs[0].url);
        //check on LeetCode problem page
        if (!tabs[0].url.includes('leetcode.com/problems/')) {
            const dataContainer = document.getElementById('dataContainer');
            if (dataContainer) {
                dataContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h2>Please use this extension in LeetCode/problems</h2>
                        <p>https://leetcode.com/problems</p>
                    </div>
                `;
                dataContainer.style.display = 'block';
            }
            return;
        }
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: scrapeData,
        });
    });
});

async function scrapeData() {
    console.log('Starting data scraping...');
    const title = document.title.split(" - LeetCode")[0];
    const dateTime = document.querySelectorAll(".max-w-full.truncate")[1]?.textContent.trim();
    const elements = document.querySelectorAll(".text-sd-foreground.text-lg.font-semibold");
    const [runtime, runtimePercent, memory, memoryPercent] = Array.from(elements).map(el => el.textContent.trim());
    
    //difficulty
    let difficulty = 'Unknown';
    const difficultySelectors = [
        '[diff]',
        '.text-difficulty-easy',
        '.text-difficulty-medium',
        '.text-difficulty-hard',
        '[data-difficulty]',
        '.difficulty-label'
    ];

    for (const selector of difficultySelectors) {
        const element = document.querySelector(selector);
        if (element) {
            difficulty = element.textContent.trim();
            console.log('Found difficulty using selector:', selector, difficulty);
            break;
        }
    }


    let fullCode = '';
    try {
        const codeSelectors = [
            '.view-lines .view-line',
            'code',                   
            '.monaco-editor .view-line', 
            '.CodeMirror-line'        
        ];

        for (const selector of codeSelectors) {
            const codeElements = document.querySelectorAll(selector);
            if (codeElements.length > 0) {
                console.log(`Found code using selector: ${selector}`);
                fullCode = Array.from(codeElements)
                    .map(line => line.textContent)
                    .join('\n')
                    .trim();
                break;
            }
        }

        if (!fullCode) {
            const editor = document.querySelector('.monaco-editor');
            if (editor) {
                const lines = editor.querySelectorAll('.view-line');
                fullCode = Array.from(lines)
                    .map(line => line.textContent)
                    .join('\n')
                    .trim();
            }
        }

        console.log('Code length:', fullCode.length);
        console.log('First 100 chars:', fullCode.substring(0, 100));
    } catch (error) {
        console.log('Error getting code:', error);
    }

    console.log('=== Data Retrieved from Page ===');
    console.log('Title:', title);
    console.log('DateTime:', dateTime);
    console.log('Runtime:', runtime);
    console.log('Runtime Percent:', runtimePercent);
    console.log('Memory:', memory);
    console.log('Memory Percent:', memoryPercent);
    console.log('Difficulty:', difficulty);
    console.log('Code Length:', fullCode.length);

    //create data object with all fields
    const data = {
        problemName: title || 'Unknown',
        runtime: runtime || 'N/A',
        runtimePercent: runtimePercent || 'N/A',
        memory: memory || 'N/A',
        memoryPercent: memoryPercent || 'N/A',
        code: fullCode || '',
        difficulty: difficulty || 'Unknown',
        date_time: dateTime || new Date().toISOString()
    };

    //send data to popup
    console.log('Sending data to popup...');
    chrome.runtime.sendMessage({
        type: 'DISPLAY_DATA',
        data: data
    });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in popup:', message.type);
    if (message.type === 'DISPLAY_DATA') {
        const data = message.data;
        console.log('=== Data Received in Popup ===');
        console.log('Problem Name:', data.problemName);
        console.log('Runtime:', data.runtime);
        console.log('Runtime Percent:', data.runtimePercent);
        console.log('Memory:', data.memory);
        console.log('Memory Percent:', data.memoryPercent);
        console.log('Difficulty:', data.difficulty);
        console.log('Date Time:', data.date_time);
        console.log('Code Length:', data.code.length);
        
        //show the data container
        const dataContainer = document.getElementById('dataContainer');
        console.log('Data container found:', !!dataContainer);
        if (dataContainer) {
            dataContainer.style.display = 'block';
            console.log('Data container displayed');
        }
        
        //helper function to set element content
        const setElementContent = (id, content) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
                console.log(`Set content for ${id}:`, content);
            } else {
                console.log(`Element not found: ${id}`);
            }
        };

        //set values for all possible elements
        setElementContent('problemName', data.problemName);
        setElementContent('difficulty', data.difficulty);
        setElementContent('date', new Date(data.date_time).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }));
        setElementContent('runtime', data.runtime);
        setElementContent('runtimePercent', data.runtimePercent);
        setElementContent('memory', data.memory);
        setElementContent('memoryPercent', data.memoryPercent);
        setElementContent('codePreview', data.code);
        
        //submit button
        document.getElementById('submitToDb').addEventListener('click', async () => {
            try {
                console.log('=== Preparing Data for DB Submission ===');
                const dbData = {
                    prob_name: data.problemName,
                    date_time: data.date_time,
                    runtime: data.runtime === 'N/A' ? null : parseFloat(data.runtime),
                    runtime_percent: data.runtimePercent === 'N/A' ? null : parseFloat(data.runtimePercent),
                    memory: data.memory === 'N/A' ? null : parseFloat(data.memory),
                    memory_percent: data.memoryPercent === 'N/A' ? null : parseFloat(data.memoryPercent),
                    code: data.code,
                    difficulty: data.difficulty
                };
                console.log('Data being sent to DB:', dbData);

                const response = await fetch('API_Holder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dbData)
                });

                if (response.ok) {
                    console.log('=== DB Submission Successful ===');
                    alert('Solution submitted successfully!');
                } else {
                    console.error('=== DB Submission Failed ===');
                    throw new Error('Failed to submit solution');
                }
            } catch (error) {
                console.error('Error submitting solution:', error);
                alert('Failed to submit solution. Please try again.');
            }
        });
    }
});

//resize handling
document.addEventListener('DOMContentLoaded', () => {
    const resizeHandle = document.querySelector('.resize-handle');
    const body = document.body;
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(body).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(body).height, 10);
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const width = startWidth + (e.clientX - startX);
        const height = startHeight + (e.clientY - startY);

        // Set minimum dimensions
        body.style.width = Math.max(300, width) + 'px';
        body.style.height = Math.max(200, height) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
});
