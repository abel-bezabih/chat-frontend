import { useState, useEffect, useRef } from "react";

function ChatRoom({ username, onLogout, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => socket.close();
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msg = { sender: username, content: message };
    socket.send(JSON.stringify(msg));
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">💬 Web Chat</h1>
        <button
          onClick={onLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit max-w-[70%] ${
              msg.sender === username
                ? "bg-green-200 self-end ml-auto"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="text-xs font-bold text-gray-600">{msg.sender}</div>
            <div>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </main>

      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t flex gap-2"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;
    