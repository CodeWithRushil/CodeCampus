// chatbot.js - Handles interaction with the deepseek r1 model
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    
    // Toggle chatbot visibility
    function toggleChatbot() {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    }
    
    // Add a message to the chat (from user or bot)
    function addMessage(content, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = isUser ? 'chatbot-message user-message' : 'chatbot-message bot-message';
        
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-avatar';
        avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'chatbot-message-content';
        messageContent.textContent = content;
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Show typing indicator while waiting for bot response
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'chatbot-message bot-message typing-indicator';
        typingElement.innerHTML = `
            <div class="chatbot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chatbot-message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        chatbotMessages.appendChild(typingElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingElement;
    }
    
    // Send message to the deepseek r1 model via Ollama API
    async function sendToChatbot(message) {
        const typingIndicator = showTypingIndicator();
        
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-r1:1.5b',
                    prompt: message,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            const botReply = data.response;

            // Remove typing indicator and add bot response
            typingIndicator.remove();
            
            addMessage(botReply.replace("<think>",  "").replace("</think>", ""), false);
            
        } catch (error) {
            console.error('Error communicating with deepseek model:', error);
            
            // Remove typing indicator and add error message
            typingIndicator.remove();
            addMessage('Sorry, I encountered an error connecting to my brain. Please try again later.', false);
        }
    }
    
    // Handle form submission
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        
        if (userMessage) {
            addMessage(userMessage, true);
            chatbotInput.value = '';
            sendToChatbot(userMessage);
        }
    });
    
    // Event listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    closeChatbot.addEventListener('click', toggleChatbot);
    
    // Initial greeting
    addMessage('Hi there! I\'m your CodeCampus AI assistant powered by deepseek. How can I help you today?', false);
});