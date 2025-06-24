import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { EventProvider } from './contexts/EventContext';
import { CartProvider } from './contexts/CartContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { Header } from './components/Header';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Discover } from './pages/Discover';
import { EventDetails } from './pages/EventDetails';
import { OrganizerProfile } from './pages/OrganizerProfile';
import { MyTickets } from './pages/MyTickets';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';
import { WhatsUp } from './pages/WhatsUp';
import { Checkout } from './pages/Checkout';
import { MyEvents } from './pages/MyEvents';
import { EventForm } from './pages/EventForm';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <UserProvider>
      <EventProvider>
        <CartProvider>
          <TransactionProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/event/new" element={<EventForm />} />
                  <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/event/:id/edit" element={<EventForm />} />
                  <Route path="/organizer/:id" element={<OrganizerProfile />} />
                  <Route path="/my-events" element={<MyEvents />} />
                  <Route path="/my-tickets" element={<MyTickets />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/whats-up" element={<WhatsUp />} />
                  <Route path="/checkout" element={<Checkout />} />
                </Routes>
              </div>
            </Router>
          </TransactionProvider>
        </CartProvider>
      </EventProvider>
    </UserProvider>
  );
}

export default App;