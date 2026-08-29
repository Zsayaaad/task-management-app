import { useState, useEffect } from "react";
import customFetch from "../utils/customFetch";
import { StreamChat } from "stream-chat";
import Loading from "../components/Loading";
import { StreamContext } from "./StreamContext";

export const StreamProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let chat;
    let cancelled = false;

    const initClients = async () => {
      try {
        // Fetch API Key and User ID to initialize the client
        const { data: initData } = await customFetch.get(`/stream/token`);
        const { apikey, userId } = initData;

        // Define the Token Provider (SDK calls this when it needs a fresh token)
        const tokenProvider = async () => {
          const { data } = await customFetch.get(`/stream/token`);
          return data.token;
        };

        // Initialize and Connect
        chat = StreamChat.getInstance(apikey);
        await chat.connectUser({ id: userId }, tokenProvider);

        if (cancelled) return;
        setChatClient(chat);
        setIsReady(true);
      } catch (error) {
        console.error("Stream connection failed:", error);
      }
    };

    initClients();

    // Cleanup on unmount (e.g. logout)
    return () => {
      if (chat) chat.disconnectUser();
    };
  }, []);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <StreamContext.Provider value={{ chatClient }}>
      {children}
    </StreamContext.Provider>
  );
};
