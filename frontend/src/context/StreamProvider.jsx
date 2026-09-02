import { useState, useEffect, useRef } from "react";
import customFetch from "../utils/customFetch";
import { StreamChat } from "stream-chat";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { StreamContext } from "./StreamContext";

export const StreamProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [videoClient, setVideoClient] = useState(null);

  const chatRef = useRef(null);
  const videoRef = useRef(null); // NEW

  useEffect(() => {
    let cancelled = false;

    const initClients = async () => {
      try {
        // Fetch API Key and User ID
        const { data } = await customFetch.get("/stream/token");

        const { apiKey, userId, chatToken, videoToken } = data;

        if (!apiKey || !userId) return;

        // --- CHAT SETUP ---
        const chat = StreamChat.getInstance(apiKey);
        chatRef.current = chat;

        if (!chat.user) {
          await chat.connectUser({ id: userId }, chatToken);
        }

        // --- VIDEO SETUP ---
        const video = new StreamVideoClient({ apiKey });
        videoRef.current = video;

        // Connect video user (Stream fetches name/image from your backend upsert)
        await video.connectUser({ id: userId }, videoToken);

        if (cancelled) return;
        setChatClient(chat);
        setVideoClient(video);
      } catch (error) {
        console.error("Stream connection failed:", error);
      }
    };

    initClients();

    // Cleanup on unmount (e.g., logout)
    return () => {
      cancelled = true;
      if (chatRef.current?.user) chatRef.current.disconnectUser();
      if (videoRef.current?.user) videoRef.current.disconnectUser();
    };
  }, []);

  // NON-BLOCKING: We render children immediately.
  // chatClient is null for a split second, then updates.
  return (
    <StreamContext.Provider value={{ chatClient, videoClient }}>
      {children}
    </StreamContext.Provider>
  );
};
