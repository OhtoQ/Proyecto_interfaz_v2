import { createContext, useContext, useReducer } from "react";
import storeReducer from "./storeReducer";

const StoreContext = createContext("");

export function useStoreContext() {
  return useContext(StoreContext);
}

const StoreProvider = () => {
  const [state, dispatch] = useReducer(storeReducer, {});

  return [state, dispatch];
};

export { StoreContext };
export default StoreProvider;
