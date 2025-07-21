export interface CartItem {
  cart_item_id: number; 
  ticket_id: number;
  event_id: number;
  event_name: string;
  ticket_name: string;
  price: number;
  quantity: number;
  total_price_per_item: number;
}

export interface Cart {
  items: CartItem[];
  cart_total: string;
}

export interface AddToCartRequest {
  ticket_type_id: number;
  user_id: number;
  price: number;
  quantity: number;
}

export interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (item: AddToCartRequest) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearError: () => void;
  cartToOrder: () => Promise<void>;
}