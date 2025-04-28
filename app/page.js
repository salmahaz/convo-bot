'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from local storage on component mount
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/generate", {
        prompt: input,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.response?.data?.error || "Failed to get a response from the chatbot.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Store messages in local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-full font-poppins px-4 py-4">
      <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white text-center mb-2">
        Convo Bot: Your Personal Assistant
      </h1>

      <div className="w-full max-w-md h-[calc(100vh-220px)] sm:h-[calc(100vh-240px)] bg-transparent rounded-lg p-2 sm:p-4 overflow-y-auto shadow-md flex flex-col gap-2 sm:gap-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.role === "user"
                ? "self-end bg-blue-500 text-white"
                : "self-start bg-blue-100 text-gray-800"
            } p-2 sm:p-3 rounded-lg shadow-md max-w-[85%] sm:max-w-[75%] text-xs sm:text-sm break-words`}
          >
            <strong className="text-xs sm:text-sm">{msg.role === "user" ? "You" : "Bot"}:</strong>
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  return !inline ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language="javascript"
                      PreTag="div"
                      customStyle={{
                        margin: '0.5rem 0',
                        padding: '0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-gray-200 text-xs sm:text-sm px-1 rounded"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="self-start bg-blue-100 text-gray-800 p-2 sm:p-3 rounded-lg shadow-md max-w-[85%] sm:max-w-[75%] text-xs sm:text-sm">
            <strong>Bot:</strong> Thinking...
          </div>
        )}
      </div>

      <div className="flex items-center mt-2 w-full max-w-md gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 sm:p-3 bg-white border rounded-lg border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) handleSend();
          }}
          disabled={isLoading}
        />
        <div
          onClick={handleSend}
          className={`p-2 sm:p-3 rounded-full cursor-pointer transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            size="sm"
            className="text-white"
          />
        </div>
      </div>

      <div className="mt-2 text-center text-white">
        <p className="text-[10px] sm:text-xs bg-gray-800 w-full sm:w-[80%] md:w-[60%] lg:w-[50%] p-2 sm:p-4 rounded-lg mx-auto">
          Messages are stored in your browser's local storage. If you open this
          page from a different device, old messages will disappear and new ones
          will be saved. Note that this bot cannot save chat history in its
          model, so the conversation history is not preserved after closing the
          session.
        </p>

        <p className="mt-2 text-[10px] sm:text-xs text-white">
          &copy; {new Date().getFullYear()} Convo Bot. All rights reserved.
        </p>
      </div>
    </div>
  );
}