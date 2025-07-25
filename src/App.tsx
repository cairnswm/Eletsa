import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider } from './contexts/TenantContext';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { UserProvider } from './contexts/UserContext';
import { OrganizerProvider } from './contexts/OrganizerContext';
import { MessagingProvider } from './contexts/MessagingContext';
import { CartProvider } from './contexts/CartContext';
import { TicketProvider } from './contexts/TicketContext';
import { Header } from './components/Header';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Tickets } from './pages/Tickets';
import { MyEvents } from './pages/MyEvents';
import { Messages } from './pages/Messages';
import { CreateEvent } from './pages/CreateEvent';
import { EditEvent } from './pages/EditEvent';
import { EventPage } from './pages/EventPage';
import { Checkout } from './pages/Checkout';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { Discovery } from './pages/Discovery';
import { Ticketing } from './pages/Ticketing';
import { OrganizerTools } from './pages/OrganizerTools';
import { Community } from './pages/Community';
import { HelpCenter } from './pages/HelpCenter';
import { ContactUs } from './pages/ContactUs';
import { TermsPrivacy } from './pages/TermsPrivacy';
import { Pricing } from './pages/Pricing';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E30FF]/10 via-white to-[#FF2D95]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E30FF]"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {user && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/ticketing" element={<Ticketing />} />
        <Route path="/organizer-tools" element={<OrganizerTools />} />
        <Route path="/community" element={<Community />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/terms-privacy" element={<TermsPrivacy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-event/:eventId"
          element={
            <ProtectedRoute>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:eventId"
          element={
            <ProtectedRoute>
              <EventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <TenantProvider>
        <AuthProvider>
          <UserProvider>
            <MessagingProvider>
              <OrganizerProvider>
                <EventProvider>
                  <TicketProvider>
                    <CartProvider>
                      <AppContent />
                    </CartProvider>
                  </TicketProvider>
                </EventProvider>
              </OrganizerProvider>
            </MessagingProvider>
          </UserProvider>
        </AuthProvider>
      </TenantProvider>
    </Router>
  );
}

export default App;