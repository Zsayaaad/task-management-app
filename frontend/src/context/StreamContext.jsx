import { createContext, useContext } from "react";

export const StreamContext = createContext(null);

export const useStream = () => useContext(StreamContext);
