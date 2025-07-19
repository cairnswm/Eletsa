import { createHeaders, handleApiResponse } from './api';
import { Cart, AddToCartRequest } from '../types/cart';

const CART_API = 'https://eletsa.cairns.co.za/php/cart';

export const cartApi = {
  async fetchUserCart(userId: number): Promise<Cart> {
    const response = await fetch(`${CART_API}/api.php/user/${userId}/cart`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    
    // Convert cart_total to number and ensure items have proper number types
    return {
      ...data,
      cart_total: data.cart_total ? data.cart_total.toString() : '0',
      items: data.items.map((item: any) => ({
        ...item,
        ticket_id: Number(item.ticket_id),
        event_id: Number(item.event_id),
        price: Number(item.price),
        quantity: Number(item.quantity),
        total_price_per_item: Number(item.total_price_per_item),
      })),
    };
  },

  async addToCart(item: AddToCartRequest): Promise<void> {
    const response = await fetch(`${CART_API}/api.php/item`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(item),
    });

    await handleApiResponse(response);
  },
};