import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (eventId: number, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (eventId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('eventCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eventCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (eventId: number, quantity: number) => {
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
          id: `${eventId}-${Date.now()}`,
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

  const isInCart = (eventId: number) => {
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

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}