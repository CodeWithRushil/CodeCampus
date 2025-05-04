
  document.addEventListener('DOMContentLoaded', () => {
    const messagesNav = document.querySelector('.messages-nav');
    const messagesContainer = document.getElementById('messagesContainer');
    const closeMessagesBtn = document.getElementById('closeMessages');
    const messagesList = document.getElementById('messagesList');
    const messageBadge = document.querySelector('.message-badge');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');

    const messages = [
        {
            id: 1,
            sender: 'Dr. Deepak Gupta',
            avatar: 'assets/images/message_avatar2.jpg',
            preview: 'Assignment due today.',
            time: '10 min ago',
            unread: true
        },
        {
            id: 2,
            sender: 'Akshay Kumar',
            avatar: 'assets/images/message_avatar2.jpg',
            preview: 'P1 Quiz on Friday.',
            time: '8 hour ago',
            unread: true
        },
        {
            id: 3,
            sender: 'Kuntal Sarkar',
            avatar: 'assets/images/message_avatar5.jpg',
            preview: 'Short meeting today.',
            time: '2 hour ago',
            unread: true
        },
        {
            id: 4,
            sender: 'Faisal Firdous',
            avatar: 'assets/images/message_avatar3.jpg',
            preview: 'Test coming up on Friday.',
            time: '50 min ago',
            unread: true
        },
        {
            id: 6,
            sender: 'Dr. Aman Sharma',
            avatar: 'assets/images/message_avatar5.jpg',
            preview: 'Reminder! Team meeting at 3 PM.',
            time: '2 Days ago',
            unread: false
        }
    ];

    function renderMessages() {
        messagesList.innerHTML = messages.map(message => `
            <div class="message-item ${message.unread ? 'unread' : ''}" data-message-id="${message.id}">
                <img src="${message.avatar}" alt="${message.sender}" class="message-avatar">
                <div class="message-content">
                    <div class="message-sender">${message.sender}</div>
                    <div class="message-preview">${message.preview}</div>
                </div>
                <div class="message-time">${message.time}</div>
                ${message.unread ? '<span class="unread-indicator"></span>' : ''}
            </div>
        `).join('');

        updateUnreadCount();
    }

    function updateUnreadCount() {
        const unreadMessages = messages.filter(msg => msg.unread);
        const unreadCount = unreadMessages.length;

        if (unreadCount > 0) {
            messageBadge.textContent = unreadCount;
            messageBadge.style.display = 'inline-block';
        } else {
            messageBadge.style.display = 'none';
        }
    }

    function fadeOutContent() {
        document.querySelectorAll('.dashboard-card, .stat-card').forEach(element => {
            element.style.opacity = '0.3';
            element.style.transform = 'scale(0.95)';
        });
    }

    function restoreContent() {
        document.querySelectorAll('.dashboard-card, .stat-card').forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    function markMessageAsRead(messageId) {
        const message = messages.find(msg => msg.id === messageId);
        if (message) {
            message.unread = false;
            renderMessages();
        }
    }

    function openMessagesSidebar() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            document.body.style.overflow = 'hidden';
            
            sidebar.classList.remove('active');
            menuToggle.style.display = 'flex';
        }

        messagesContainer.classList.add('active');
        fadeOutContent();
        messageBadge.style.display = 'none';
    }

    function closeMessagesSidebar() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            document.body.style.overflow = '';
        }

        messagesContainer.classList.remove('active');
        restoreContent();
        updateUnreadCount();
    }

    messagesNav.addEventListener('click', openMessagesSidebar);
    closeMessagesBtn.addEventListener('click', closeMessagesSidebar);

    messagesList.addEventListener('click', (event) => {
        const messageItem = event.target.closest('.message-item');
        if (messageItem) {
            const messageId = parseInt(messageItem.dataset.messageId);
            markMessageAsRead(messageId);
        }
    });

    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            messagesContainer.classList.remove('active');
        }
    });

    renderMessages();
});