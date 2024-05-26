import {createContext, useState } from "react";

export const UserProgressContext = createContext({
  userProgress: "", // 'cart' or 'checkout'
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
});

export default function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState("");

  function showCart() {
    setUserProgress("cart");
  }
  function showCheckout() {
    setUserProgress("checkout");
  }
  function hideCart() {
    setUserProgress("");
  }
  function hideCheckout() {
    setUserProgress("");
  }

  const userProgressCtx = {
    userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout
  }



  return (
    <UserProgressContext.Provider value={userProgressCtx}>{children}</UserProgressContext.Provider>
  );
}
