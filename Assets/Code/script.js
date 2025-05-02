document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Function to add a new message to the chat
    function addMessage(message, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.textContent = message;
      
      messageDiv.appendChild(messageContent);
      chatMessages.appendChild(messageDiv);
      
      // Auto scroll to the bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to handle user sending a message
    function handleSendMessage() {
        const query = userInput.value.trim();
        if (!query) return;
    
        addMessage(query, 'user'); 
        userInput.value = '';
        typingIndicator.style.display = 'block';
    
        // Send the query to the back
        fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })
        .then(response => response.json())
        .then(data => {
            typingIndicator.style.display = 'none';
    
            if (data.error) {
                addMessage('Error: ' + data.error, 'bot');
            } else {
                addMessage(data.response, 'bot'); 
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            addMessage('An error occurred while processing your request.', 'bot');
            typingIndicator.style.display = 'none';
        });
    }

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);
    
    userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleSendMessage();
      }
    });
    
    // Focus the input field when the page loads
    userInput.focus();
  });