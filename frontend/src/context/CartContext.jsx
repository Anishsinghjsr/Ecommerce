import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  // ===========================
  // GET CART
  // ===========================

  const getCart = async () => {
    const token = getAccessToken();

    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/store/cart/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setCart(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load cart");
      }

      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error(err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // ADD TO CART
  // ===========================

  const addToCart = async (productId) => {
    const token = getAccessToken();

    const response = await fetch(`${BASEURL}/store/cart/add/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add cart");
    }

    await getCart();
  };

  // ===========================
  // REMOVE ITEM
  // ===========================

  const removeFromCart = async (itemId) => {
    const token = getAccessToken();

    const response = await fetch(`${BASEURL}/store/cart/remove/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_id: itemId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove item");
    }

    await getCart();
  };

  // ===========================
  // UPDATE QUANTITY
  // ===========================

  const updateCartQuantity = async (itemId, quantity) => {
    const token = getAccessToken();

    const response = await fetch(`${BASEURL}/store/cart/update/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_id: itemId,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart");
    }

    await getCart();
  };

  // ===========================
  // CLEAR CART (NEW)
  // ===========================

  const clearCart = () => {
    setCart(null);
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        getCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}