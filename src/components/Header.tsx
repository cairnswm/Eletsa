import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Search, Ticket, Calendar, Menu, X, MessageCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { useMessaging } from '../contexts/MessagingContext';
import { useCart } from '../contexts/CartContext'; 
import { useTenant } from '../contexts/TenantContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getOrganizerByUserId } = useOrganizer();
  const { unreadCount } = useMessaging();
  const { cart, updateCartItem, removeCartItem } = useCart(); 
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is an organizer
  const userOrganizer = user ? getOrganizerByUserId(user.id) : null;
  const isOrganizer = !!userOrganizer;

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getDisplayName = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    if (user?.username) {
      return user.username;
    }
    return user?.email || 'User';
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeCartItem(itemId);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(num);
  };

  const getTotalItems = () => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  if (!user) return null;

  const navigationItems = [
    {
      name: 'Discover',
      href: '/home',
      icon: Search,
      description: 'Find amazing events',
    },
    {
      name: 'My Tickets',
      href: '/tickets',
      icon: Ticket,
      description: 'View your tickets',
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      description: 'Chat with others',
    },
    ...(isOrganizer ? [{
      name: 'My Events',
      href: '/my-events',
      icon: Calendar,
      description: 'Manage your events',
    }] : []),
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-lg flex items-center justify-center">
                <img src="/eletsa.svg" alt="Eletsa Logo" className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] bg-clip-text text-transparent">
                {tenant?.name || 'Eletsa'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-[#1E30FF] hover:bg-gray-50 transition-all duration-200 group relative"
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{item.name}</span>
                {item.name === 'Messages' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <div className="relative">
              <button
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 relative"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {getTotalItems() > 99 ? '99+' : getTotalItems()}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {cartDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                  </div>
                  
                  {cart && cart.items.length > 0 ? (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {cart.items?.map((item, index) => (
                          <div key={`${item.id}-${index}`} className="px-4 py-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">{item.event_name}</h4>
                                <p className="text-xs text-gray-600">{item.ticket_name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatCurrency(item.price)} each
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.id);
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-2"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(item.id, item.quantity - 1);
                                  }}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <span className="text-sm">−</span>
                                </button>
                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(item.id, item.quantity + 1);
                                  }}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <span className="text-sm">+</span>
                                </button>
                              </div>
                              <span className="font-medium text-sm text-gray-900">
                                {formatCurrency(item.total_price_per_item)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-gray-900">Total:</span>
                          <span className="font-bold text-lg text-[#1E30FF]">
                            {formatCurrency(cart.cart_total)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setCartDropdownOpen(false);
                            // TODO: Navigate to checkout page
                            console.log('Navigate to checkout');
                          }}
                          className="w-full bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                        >
                          Checkout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">Your cart is empty</p>
                      <p className="text-gray-500 text-xs">Add some tickets to get started!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {getDisplayName()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Desktop Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-[#1E30FF] hover:bg-gray-50 transition-all duration-200 relative"
                >
                  <item.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  {item.name === 'Messages' && unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Cart Section (Mobile) */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Cart</span>
                    {getTotalItems() > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </div>
                  {cart && (
                    <span className="font-semibold text-[#1E30FF]">
                      {formatCurrency(cart.cart_total)}
                    </span>
                  )}
                </div>
                
                {cart && cart.items.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cart.items?.slice(0, 3).map((item, index) => (
                      <div key={`mobile-${item.id}-${index}`} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900">{item.event_name}</div>
                            <div className="text-xs text-gray-600">{item.ticket_name}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(item.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item.id, item.quantity - 1);
                              }}
                              className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                            >
                              <span className="text-xs">−</span>
                            </button>
                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item.id, item.quantity + 1);
                              }}
                              className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                            >
                              <span className="text-xs">+</span>
                            </button>
                          </div>
                          <div className="text-xs font-medium text-[#1E30FF]">
                            {formatCurrency(item.total_price_per_item)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {cart.items && cart.items.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{cart.items.length - 3} more items
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-xs">Your cart is empty</p>
                  </div>
                )}
                
                {cart && cart.items && cart.items.length > 0 && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      // TODO: Navigate to checkout page
                      console.log('Navigate to checkout');
                    }}
                    className="w-full mt-3 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] text-white py-2 px-4 rounded-lg font-medium text-sm"
                  >
                    Checkout
                  </button>
                )}
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              {/* User Section */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#1E30FF] to-[#FF2D95] rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{getDisplayName()}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    {isOrganizer && (
                      <div className="text-xs text-[#489707] font-medium">Event Organizer</div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={handleNavClick}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Backdrop */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
      
      {/* Cart Dropdown Backdrop */}
      {cartDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCartDropdownOpen(false)}
        />
      )}
    </header>
  );
};