// Context Craft Popup Script

const CHARS_PER_TOKEN = 4;

// Load and display current stats
async function loadStats() {
  try {
    const result = await chrome.storage.local.get(['contextState']);
    const state = result.contextState || {};
    
    let activeCount = 0;
    let archivedCount = 0;
    let totalChars = 0;
    
    for (const conversationId in state) {
      for (const messageId in state[conversationId]) {
        const message = state[conversationId][messageId];
        if (message.enabled) {
          activeCount++;
          totalChars += (message.content || '').length;
        } else {
          archivedCount++;
        }
      }
    }
    
    const estimatedTokens = Math.ceil(totalChars / CHARS_PER_TOKEN);
    
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('archivedCount').textContent = archivedCount;
    document.getElementById('tokenCount').textContent = estimatedTokens.toLocaleString();
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Open ChatGPT in new tab
document.getElementById('openChatButton').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://chatgpt.com' });
});

// Load stats on popup open
loadStats();
