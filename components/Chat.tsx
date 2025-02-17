"use client";
import React, { useState } from "react";

interface ChatProps {
  projectId: string;
  chatHistory: Array<{ role: string; content: string }>;
  setChatHistory: (history: Array<{ role: string; content: string }>) => void;
}

export default function Chat({ projectId, chatHistory, setChatHistory }: ChatProps) {
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newHistory = [...chatHistory, { role: "user", content: input }];
    setChatHistory(newHistory);
    setInput("");

    const response = await fetch("/api/manual-j/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, history: newHistory }),
    });
    const data = await response.json();
    if (data.message) {
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.message }]);
    }
  };

  return (
    <div className="border p-4 rounded">
      <div className="h-64 overflow-y-auto mb-4">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <p className="px-2 py-1 inline-block bg-gray-200 rounded">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question, e.g. 'What if we insulated the slab?'"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
