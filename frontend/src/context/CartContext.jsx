import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  // Get JWT access token
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  // ==========================================
  // GET CART
  // ==========================================

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.log("JWT token expired or invalid");

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        setCart(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Cart request failed: ${response.status}`);
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Cart error:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (productId) => {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Please login first");
    }

    try {
      const response = await fetch(`${BASEURL}/store/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.error ||
            `Failed to add product: ${response.status}`
        );
      }

      const data = await response.json();
      setCart(data.cart);

      return data;
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = async (itemId) => {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Please login first");
    }

    try {
      const response = await fetch(`${BASEURL}/store/cart/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: itemId,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.error ||
            `Failed to remove item: ${response.status}`
        );
      }

      await getCart();
    } catch (error) {
      console.error("Remove from cart error:", error);
      throw error;
    }
  };

  // ==========================================
  // UPDATE CART QUANTITY
  // ==========================================

  const updateCartQuantity = async (itemId, quantity) => {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Please login first");
    }

    try {
      const response = await fetch(`${BASEURL}/store/cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: itemId,
          quantity: quantity,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.error ||
            `Failed to update cart: ${response.status}`
        );
      }

      await getCart();
    } catch (error) {
      console.error("Update cart error:", error);
      throw error;
    }
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    getCart();
  }, []);

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        getCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useCart() {
  return useContext(CartContext);
}