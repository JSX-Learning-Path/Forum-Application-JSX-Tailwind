import { createContext, useContext } from "react";
// undefined...
export const AppContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}
