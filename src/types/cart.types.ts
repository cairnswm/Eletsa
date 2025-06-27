export interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (eventId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (eventId: string) => boolean;
}
