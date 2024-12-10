import React, { useEffect, useState } from "react";

interface SSEClientProps {
  url: string; // URL of the SSE endpoint
  title?: string; // Optional title for the message list
}

const SSEClient: React.FC<SSEClientProps> = ({ url, title = "Server-Sent Events" }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Create a new EventSource instance
    const eventSource = new EventSource(url);

    // Listen for incoming messages
    eventSource.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    // Handle connection errors
    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close(); // Close the connection if there's an error
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, [url]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>{title}</h2>
      <ul>
        {messages.map((message, index) => {
          const parsedMessage = JSON.parse(message); // Assuming JSON format from server
          return (
            <li key={index}>
              <strong>Message:</strong> {parsedMessage.message}, <strong>Time:</strong> {parsedMessage.timestamp}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SSEClient;
