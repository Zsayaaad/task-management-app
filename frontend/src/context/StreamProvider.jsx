import { useState, useEffect, useRef } from "react";
import customFetch from "../utils/customFetch";
import { StreamChat } from "stream-chat";
import { StreamContext } from "./StreamContext";

export const StreamProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const connect = async () => {
      try {
        // 1. Fetch API Key and User ID
        const { data } = await customFetch.get("/stream/token");
        const { apiKey, userId } = data;

        if (!apiKey || !userId) {
          console.error("Missing Stream credentials");
          return;
        }

        // 2. Get or create the singleton instance
        const client = StreamChat.getInstance(apiKey);
        clientRef.current = client;

        // 3. Token provider for auto-refresh
        const tokenProvider = async () => {
          const { data: refreshData } = await customFetch.get("/stream/token");
          return refreshData.token;
        };

        // 4. Connect (Guard against React StrictMode double-mount)
        // prevents React from trying to connect the WebSocket twice in development mode.
        if (!client.user) {
          await client.connectUser({ id: userId }, tokenProvider);
        }

        if (isActive) {
          setChatClient(client);
        }
      } catch (error) {
        console.error("Stream connection failed:", error);
      }
    };

    connect();

    // Cleanup on unmount (e.g., logout)
    return () => {
      isActive = false;
      if (clientRef.current && clientRef.current.user) {
        clientRef.current.disconnectUser();
      }
    };
  }, []);

  // NON-BLOCKING: We render children immediately.
  // chatClient is null for a split second, then updates.
  return (
    <StreamContext.Provider value={{ chatClient }}>
      {children}
    </StreamContext.Provider>
  );
};
