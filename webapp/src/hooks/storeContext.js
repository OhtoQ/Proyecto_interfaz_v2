import { createContext, useContext } from "react";

const StoreContext = createContext("");

export default function useStoreContext() {
  return useContext(StoreContext);
}

export { StoreContext };
