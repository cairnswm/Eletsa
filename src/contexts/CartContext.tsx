import React, { createContext, useState, useEffect } from 'react';
import { Cart, CartContextType, AddToCartRequest } from '../types/cart';
import { cartApi } from '../services/cart';
import { useAuth } from './AuthContext';
import { useTenant } from './TenantContext';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const { tenant } = useTenant();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const fetchCart = React.useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cartData = await cartApi.fetchUserCart(user.id);
      setCart(cartData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (item: AddToCartRequest) => {
    if (!user) {
      throw new Error('User must be logged in to add items to cart');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add item to cart via API
      await cartApi.addToCart(item);
      
      // Refresh cart data after adding item
      await fetchCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
      console.error('Failed to add item to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!user) {
      throw new Error('User must be logged in to update cart items');
    }

    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item instead
      return removeCartItem(itemId);
    }

    try {
      setError(null);
      
      console.log('Updating cart item:', itemId, 'to quantity:', quantity);
      
      // Update item quantity via API
      await cartApi.updateCartItem(itemId, quantity);
      
      // Refresh cart data after updating item
      await fetchCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cart item';
      setError(errorMessage);
      console.error('Failed to update cart item:', err);
      throw err;
    }
  };

  const removeCartItem = async (itemId: number) => {
    if (!user) {
      throw new Error('User must be logged in to remove cart items');
    }

    try {
      setError(null);
      
      console.log('Removing cart item:', itemId);
      
      // Remove item via API
      await cartApi.removeCartItem(itemId);
      
      // Refresh cart data after removing item
      await fetchCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove cart item';
      setError(errorMessage);
      console.error('Failed to remove cart item:', err);
      throw err;
    }
  };

  const cartToOrder = async () => {
    if (!user) {
      throw new Error('User must be logged in to convert cart to order');
    }

    try {
      setLoading(true);
      setError(null);

      if (tenant) {
        const result = await cartApi.cartToOrder(token!, tenant.uuid);
        await fetchCart();
        return result;
      } else {
        throw new Error('Tenant is required to convert cart to order');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert cart to order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    } else {
      setCart(null);
      setError(null);
    }
  }, [user?.id, fetchCart]);

  const value: CartContextType = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearError,
    cartToOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};