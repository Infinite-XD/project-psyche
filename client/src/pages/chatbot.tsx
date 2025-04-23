import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatboxRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;

    const newMessage: Message = { role: 'user', content: userInput };
    setMessages([...messages, newMessage]);
    setUserInput('');

    // Simulate bot response (replace with actual AI integration)
    setTimeout(() => {
      const botResponse: Message = { role: 'bot', content: getBotResponse(userInput) };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 500);
  };

  const getBotResponse = (userMessage: string): string => {
    // Replace with actual AI logic
    if (userMessage.toLowerCase().includes('hello')) {
      return 'Hello there! How can I assist you today?';
    } else if (userMessage.toLowerCase().includes('stress')) {
      return 'I understand that you might be feeling stressed. Let\'s explore some ways to manage it together.';
    } else {
      return 'I\'m still learning. Can you rephrase your question?';
    }
  };

  useEffect(() => {
    chatboxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chat-messages" style={{ overflowY: 'scroll', maxHeight: '300px' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.content}
          </div>
        ))}
        <div ref={chatboxRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatbotPage;