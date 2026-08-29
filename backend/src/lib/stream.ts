import { StreamChat } from "stream-chat";
import { getEnv } from "./env.js";

const env = getEnv();

// Create a singleton client that controllers will use
export const streamClient = StreamChat.getInstance(
  env.STREAM_API_KEY,
  env.STREAM_API_SECRET,
);
