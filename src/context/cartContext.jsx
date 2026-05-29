import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../api/cartApi";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) fetchCart();
    else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCartItems(data);
      setCartCount(data.reduce((sum, i) => sum + i.quantity, 0));
    } catch {}
  };

  const addItem = async (productId, quantity = 1) => {
    await addToCart({ productId, quantity });
    await fetchCart();
    toast.success("Added to cart");
  };

  const updateItem = async (productId, quantity) => {
    await updateCart(productId, quantity);
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await removeFromCart(productId);
    await fetchCart();
    toast.success("Removed from cart");
  };

  const emptyCart = async () => {
    await clearCart();
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
