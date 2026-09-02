import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { getEnv } from "./env.js";

const env = getEnv();

// Chat Client (Existing)
export const chatClient = StreamChat.getInstance(
  env.STREAM_API_KEY,
  env.STREAM_API_SECRET,
);

// Video/Feeds Client (NEW)
export const videoClient = new StreamClient(
  env.STREAM_API_KEY,
  env.STREAM_API_SECRET,
);

// Export chatClient as streamClient to keep Phase 2/4 code working without refactoring
export const streamClient = chatClient;
