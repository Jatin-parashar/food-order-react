import { useReducer, useState } from "react";
import { createContext } from "react";

export const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

// action will have the item to add or remove
function reducer(state, action) {
  if (action.type == "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id == action.item.id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }
  if (action.type == "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id == action.id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];

      // two things to do -  decrease quantity if it is greater than 1 or just remove item

      if (existingItem.quantity === 1) {
        // updatedItems = delete updatedItems[existingCartItemIndex];
        updatedItems.splice(existingCartItemIndex, 1);
        // console.log(updatedItems);
      } else {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity - 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      }
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}
const CartContextProvider = ({ children }) => {
  const [cartState, dispatchCartAction] = useReducer(reducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item });
  }
  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }
  const cartContext = {
    items: cartState.items,
    addItem,
    removeItem,
    clearCart,
  };

  // console.log(cartContext.items.length);

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
