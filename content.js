// Context Craft Content Script

const CHARS_PER_TOKEN = 4;
const EXTENSION_ID = 'context-craft-sidebar';

let conversationState = {};
let currentConversationId = null;

/**
 * Detects which AI chat platform is currently loaded
 * @returns {'chatgpt' | 'claude' | null}
 */
function detectPlatform() {
  const hostname = window.location.hostname;
  if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) {
    return 'chatgpt';
  }
  if (hostname.includes('claude.ai')) {
    return 'claude';
  }
  return null;
}

/**
 * Generates a stable conversation ID from URL
 */
function generateConversationId() {
  const platform = detectPlatform();
  const pathSegments = window.location.pathname.split('/').filter(s => s);
  
  if (platform === 'chatgpt') {
    // ChatGPT URL format: /c/conversation-id
    const chatId = pathSegments[pathSegments.indexOf('c') + 1] || 'default';
    return `chatgpt-${chatId}`;
  }
  
  if (platform === 'claude') {
    // Claude URL format: /chat/conversation-id
    const chatId = pathSegments[pathSegments.indexOf('chat') + 1] || 'default';
    return `claude-${chatId}`;
  }
  
  return `${platform}-default`;
}

/**
 * Extracts messages from the current conversation
 */
function extractMessages() {
  const platform = detectPlatform();
  const messages = [];
  
  if (platform === 'chatgpt') {
    // ChatGPT structure: div[data-message-id] or article elements
    const messageElements = document.querySelectorAll('article[data-testid^="conversation-turn"]');
    
    messageElements.forEach((el, index) => {
      const contentEl = el.querySelector('[data-message-author-role]');
      const role = contentEl?.getAttribute('data-message-author-role') || 'unknown';
      const textContent = el.innerText || '';
      
      messages.push({
        id: `msg-${index}`,
        role: role === 'user' ? 'user' : 'assistant',
        content: textContent,
        element: el
      });
    });
  }
  
  if (platform === 'claude') {
    // Claude structure: different DOM
    const messageElements = document.querySelectorAll('[data-test-render-count]');
    
    messageElements.forEach((el, index) => {
      const textContent = el.innerText || '';
      // Alternate user/assistant based on position
      const role = index % 2 === 0 ? 'user' : 'assistant';
      
      messages.push({
        id: `msg-${index}`,
        role: role,
        content: textContent,
        element: el
      });
    });
  }
  
  return messages;
}

/**
 * Loads conversation state from storage
 */
async function loadConversationState() {
  try {
    const result = await chrome.storage.local.get(['contextState']);
    conversationState = result.contextState || {};
    
    if (!conversationState[currentConversationId]) {
      conversationState[currentConversationId] = {};
    }
  } catch (error) {
    console.error('Failed to load conversation state:', error);
  }
}

/**
 * Saves conversation state to storage
 */
async function saveConversationState() {
  try {
    await chrome.storage.local.set({ contextState: conversationState });
  } catch (error) {
    console.error('Failed to save conversation state:', error);
  }
}

/**
 * Calculates total active tokens for display
 */
function calculateActiveTokens() {
  const convState = conversationState[currentConversationId] || {};
  let totalChars = 0;
  
  for (const messageId in convState) {
    const message = convState[messageId];
    if (message.enabled) {
      totalChars += (message.content || '').length;
    }
  }
  
  return Math.ceil(totalChars / CHARS_PER_TOKEN);
}

/**
 * Creates the Context Craft sidebar UI
 */
function createSidebar() {
  // Check if sidebar already exists
  if (document.getElementById(EXTENSION_ID)) {
    return;
  }
  
  const sidebar = document.createElement('div');
  sidebar.id = EXTENSION_ID;
  sidebar.innerHTML = `
    <div class="cc-header">
      <h2 class="cc-title">Context Craft</h2>
      <div class="cc-token-count">
        <span class="cc-token-label">Active tokens:</span>
        <span class="cc-token-value" id="cc-token-display">0</span>
      </div>
    </div>
    <div class="cc-empty-state" id="cc-empty-state">
      <div class="cc-empty-icon">💬</div>
      <p class="cc-empty-text">No conversation loaded</p>
      <p class="cc-empty-hint">Start chatting to see messages here</p>
    </div>
    <div class="cc-message-list" id="cc-message-list"></div>
  `;
  
  document.body.appendChild(sidebar);
  updateSidebar();
}

/**
 * Updates sidebar content with current messages
 */
function updateSidebar() {
  const messages = extractMessages();
  const messageList = document.getElementById('cc-message-list');
  const emptyState = document.getElementById('cc-empty-state');
  const tokenDisplay = document.getElementById('cc-token-display');
  
  if (!messageList) return;
  
  if (messages.length === 0) {
    emptyState.style.display = 'flex';
    messageList.style.display = 'none';
    tokenDisplay.textContent = '0';
    return;
  }
  
  emptyState.style.display = 'none';
  messageList.style.display = 'block';
  
  // Get current state
  const convState = conversationState[currentConversationId] || {};
  
  messageList.innerHTML = messages.map(msg => {
    const savedState = convState[msg.id];
    const isEnabled = savedState ? savedState.enabled : true;
    const roleLabel = msg.role === 'user' ? 'You' : 'AI';
    const preview = msg.content.slice(0, 100) + (msg.content.length > 100 ? '...' : '');
    
    return `
      <div class="cc-message-item ${isEnabled ? 'cc-active' : 'cc-archived'}" data-message-id="${msg.id}">
        <div class="cc-message-header">
          <span class="cc-message-role">${roleLabel}</span>
          <button class="cc-toggle-btn" data-message-id="${msg.id}" aria-label="Toggle message in context">
            ${isEnabled ? '✓' : '✕'}
          </button>
        </div>
        <div class="cc-message-preview">${preview}</div>
      </div>
    `;
  }).join('');
  
  // Attach toggle event listeners
  messageList.querySelectorAll('.cc-toggle-btn').forEach(btn => {
    btn.addEventListener('click', handleToggle);
  });
  
  // Update token count
  tokenDisplay.textContent = calculateActiveTokens().toLocaleString();
}

/**
 * Handles toggle button click
 */
async function handleToggle(event) {
  const messageId = event.target.dataset.messageId;
  const messages = extractMessages();
  const message = messages.find(m => m.id === messageId);
  
  if (!message) return;
  
  const convState = conversationState[currentConversationId] || {};
  const currentState = convState[messageId] || { enabled: true };
  
  // Toggle state
  conversationState[currentConversationId][messageId] = {
    enabled: !currentState.enabled,
    content: message.content,
    role: message.role
  };
  
  await saveConversationState();
  updateSidebar();
}

/**
 * Observes DOM changes to detect new messages
 */
function observeConversation() {
  const observer = new MutationObserver(() => {
    updateSidebar();
  });
  
  // Observe the main conversation container
  const platform = detectPlatform();
  let targetNode = null;
  
  if (platform === 'chatgpt') {
    targetNode = document.querySelector('main') || document.body;
  } else if (platform === 'claude') {
    targetNode = document.querySelector('main') || document.body;
  } else {
    targetNode = document.body;
  }
  
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
}

/**
 * Initializes Context Craft
 */
async function initializeContextCraft() {
  const platform = detectPlatform();
  
  if (!platform) {
    console.log('Context Craft: Not on a supported AI chat platform');
    return;
  }
  
  currentConversationId = generateConversationId();
  await loadConversationState();
  
  createSidebar();
  observeConversation();
  
  console.log('Context Craft initialized on', platform);
}

// Run initialization when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContextCraft);
} else {
  initializeContextCraft();
}
