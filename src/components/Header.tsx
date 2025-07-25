import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Search, Ticket, Calendar, Menu, X, MessageCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizer } from '../contexts/OrganizerContext';
import { useMessaging } from '../contexts/MessagingContext';
import { useCart } from '../contexts/useCart'; 
import { useTenant } from '../contexts/TenantContext';
import UserMenu from './header/UserMenu';
import Cart from './header/Cart';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getOrganizerByUserId } = useOrganizer();
  const { unreadCount } = useMessaging();
  const { cart } = useCart(); 
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
            <Cart cart={cart} getTotalItems={getTotalItems} formatCurrency={formatCurrency} />
            <UserMenu user={user} handleLogout={handleLogout} getDisplayName={getDisplayName} />
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};