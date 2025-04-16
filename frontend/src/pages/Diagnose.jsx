import { useState } from 'react';

function Diagnose() {
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Send user message to backend and update chat
  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { type: 'user', text: userInput };
    setChat(prev => [...prev, userMessage]);

    const loadingMessage = { type: 'bot', text: "I'm analyzing your symptoms...", isLoading: true };
    setChat(prev => [...prev, loadingMessage]);

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setChat(prev => prev.filter(msg => !msg.isLoading));
      setChat(prev => [...prev, { type: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setChat(prev => prev.filter(msg => !msg.isLoading));
      setChat(prev => [...prev, {
        type: 'bot',
        text: "Sorry, I encountered an error processing your symptoms. Please try again."
      }]);
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  // Render each line with line breaks
  const formatMessageText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 drop-shadow">Health Chatbot</h1>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* Chat box */}
        <div className="h-[500px] overflow-y-auto p-5 space-y-4 bg-gray-50">
          {chat.length === 0 ? (
            <div className="text-center text-gray-500 italic">Describe your symptoms to get started.</div>
          ) : (
            chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-lg shadow ${
                    msg.type === 'user'
                      ? 'bg-blue-200 text-right rounded-br-none'
                      : 'bg-green-200 text-left rounded-bl-none'
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">
                    {msg.type === 'user' ? 'You' : 'Dr. Bot'}
                  </p>
                  <p className="text-sm">
                    {msg.isLoading ? (
                      <span className="animate-pulse text-gray-500">Typing...</span>
                    ) : (
                      formatMessageText(msg.text)
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="flex border-t border-gray-300 bg-white p-3">
          <input
            type="text"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe your symptoms..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            disabled={isLoading}
          />
          <button
            className={`px-4 py-2 rounded-r-md text-white font-medium transition ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Diagnose;
