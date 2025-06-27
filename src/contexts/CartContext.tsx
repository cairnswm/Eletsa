import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType } from '../types/cart.types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';
import { getCurrentTimestamp } from '../utils/dateUtils';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadFromLocalStorage<CartItem[]>('eventCart');
    if (savedCart) {
      setCartItems(savedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('eventCart', cartItems);
  }, [cartItems]);

  const addToCart = (eventId: string, quantity: number) => {
    // Import events data here to avoid circular dependency
    import('../data/events').then(({ events }) => {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const existingItem = cartItems.find(item => item.eventId === eventId);
      
      if (existingItem) {
        // Update quantity if item already exists
        setCartItems(prev => prev.map(item =>
          item.eventId === eventId
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.price
              }
            : item
        ));
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `cart-${eventId}-${getCurrentTimestamp()}`,
          eventId,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          eventImage: event.image,
          quantity,
          price: event.price,
          totalPrice: event.price * quantity
        };
        setCartItems(prev => [...prev, newItem]);
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => prev.map(item =>
      item.id === itemId
        ? { 
            ...item, 
            quantity,
            totalPrice: quantity * item.price
          }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (eventId: string) => {
    return cartItems.some(item => item.eventId === eventId);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };