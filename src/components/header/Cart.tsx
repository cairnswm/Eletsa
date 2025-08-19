import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types/cart';
import { useCart } from '../../contexts/useCart';

const Cart: React.FC<{ cart: { items: CartItem[]; cart_total: string }; getTotalItems: () => number; formatCurrency: (amount: string | number) => string }> = ({ cart, getTotalItems, formatCurrency }) => {
  const { updateCartItem, removeCartItem } = useCart();
  const navigate = useNavigate();
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.cart-dropdown')) {
        setCartDropdownOpen(false);
      }
    };

    if (cartDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [cartDropdownOpen]);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeCartItem(cartItemId);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCartDropdownOpen(!cartDropdownOpen);
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 relative"
      >
        <ShoppingCart className="w-5 h-5 text-gray-700" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {getTotalItems() > 99 ? '99+' : getTotalItems()}
          </span>
        )}
      </button>

      {cartDropdownOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-80 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 cart-dropdown
                        fixed sm:absolute left-4 sm:left-auto right-4 sm:right-0 bottom-4 sm:bottom-auto top-auto sm:top-auto sm:mt-2
                        max-h-[calc(100vh-8rem)] sm:max-h-96 flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
          </div>

          {cart && cart.items.length > 0 ? (
            <>
              <div className="flex-1 overflow-y-auto min-h-0">
                {cart.items.map((item, index) => (
                  <div key={index} className="px-4 py-2 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700 font-bold">{item.event_name}</span>
                        <span className="text-xs text-gray-500">{item.ticket_name}</span>
                      </div>
                      <span className="text-sm text-gray-700">x{item.quantity}</span>
                      <span className="text-sm text-gray-700">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.cart_item_id);
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item.cart_item_id, item.quantity - 1);
                          }}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          -
                        </button>
                        <span className="text-xs text-gray-700">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item.cart_item_id, item.quantity + 1);
                          }}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-sm font-medium text-gray-700">{formatCurrency(cart.cart_total)}</span>
                </div>
                <button
                  className="flex items-center space-x-2 px-6 mt-3 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white hover:opacity-90 shadow-md hover:shadow-lg"
                  onClick={() => {
                    setCartDropdownOpen(false);
                    navigate('/checkout');
                  }}
                  disabled={cart.items.length === 0}
                >
                  <span>Checkout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center flex-shrink-0">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Your cart is empty</p>
              <p className="text-gray-500 text-xs">Add some tickets to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
