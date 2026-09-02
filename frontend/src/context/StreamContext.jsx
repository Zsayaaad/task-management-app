import { createContext, useContext } from "react";

export const StreamContext = createContext({
  chatClient: null,
  videoClient: null,
});

export const useStream = () => useContext(StreamContext);
