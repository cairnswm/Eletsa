import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { messages as messagesData } from '../data/messages';
import { CartDropdown } from './CartDropdown';
import { Calendar, User, LogOut, Menu, X, MessageCircle, Ticket, TrendingUp, Settings } from 'lucide-react';

export function Header() {
  const { user, logout } = useUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = () => {
    // Count messages where current user is the recipient and message is "unread"
    // For demo purposes, we'll count messages to the current user from the last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const unread = messagesData.filter((msg: any) => 
      msg.toUserId === user?.id && 
      new Date(msg.timestamp) > yesterday
    ).length;
    
    setUnreadCount(unread);
  };

  const navigation = [
    { name: 'Discover', href: '/discover' },
    { name: 'What\'s Up', href: '/whats-up', protected: true },
    { name: 'My Tickets', href: '/my-tickets', protected: true },
  ];

  const organizerNavigation = [
    { name: 'My Events', href: '/my-events', roles: ['organizer', 'admin'] }
  ];

  const adminNavigation = [
    { name: 'Admin', href: '/admin' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Eletsa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.protected && !user) return null;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {user && (user.role === 'organizer' || user.role === 'admin') && organizerNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user?.role === 'admin' && adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Cart Icon */}
                <CartDropdown />

                {/* Messages Icon with Badge */}
                <Link
                  to="/messages"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                if (item.protected && !user) return null;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name === 'What\'s Up' && <TrendingUp className="h-4 w-4 mr-2" />}
                    {item.name === 'My Tickets' && <Ticket className="h-4 w-4 mr-2" />}
                    {item.name}
                  </Link>
                );
              })}

              {user && (user.role === 'organizer' || user.role === 'admin') && organizerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}

              {user && (
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/messages')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              
              {user?.role === 'admin' && adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}