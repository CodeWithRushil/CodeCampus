document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    
    // Configure Marked to handle LaTeX math expressions
    const renderer = new marked.Renderer();
    const originalParagraphRenderer = renderer.paragraph;
    
    // Setup marked options
    marked.setOptions({
        renderer: renderer,
        highlight: function(code, language) {
            return code;
        },
        pedantic: false,
        gfm: true,
        breaks: true,
        sanitize: false,
        smartypants: false,
        xhtml: false
    });
    
    function toggleChatbot() {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    }
    
    function addMessage(content, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = isUser ? 'chatbot-message user-message' : 'chatbot-message bot-message';
        
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-avatar';
        avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'chatbot-message-content';
        
        // Process markdown if not a user message
        if (!isUser) {
            try {
                // Use marked.js to parse markdown to HTML
                messageContent.innerHTML = marked.parse(content);
                
                // Render LaTeX expressions after markdown is processed
                renderMathInElement(messageContent, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            } catch (error) {
                console.error('Error parsing markdown or LaTeX:', error);
                messageContent.textContent = content;
            }
        } else {
            // For user messages, just display as plain text
            messageContent.textContent = content;
        }
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        chatbotMessages.appendChild(messageElement);
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
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

            typingIndicator.remove();
            
            addMessage(botReply.replace("<think>",  "").replace("</think>", ""), false);
            
        } catch (error) {
            console.error('Error communicating with deepseek model:', error);
            
            typingIndicator.remove();
            addMessage('Sorry, I encountered an error connecting to my brain. Please try again later.', false);
        }
    }
    
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        
        if (userMessage) {
            addMessage(userMessage, true);
            chatbotInput.value = '';
            sendToChatbot(userMessage);
        }
    });
    
    chatbotToggle.addEventListener('click', toggleChatbot);
    closeChatbot.addEventListener('click', toggleChatbot);
    
    addMessage('Hi there! I\'m your CodeCampus AI assistant powered by deepseek. How can I help you today?', false);
});