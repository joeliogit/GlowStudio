import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

// Public pages
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Services from '../pages/Services.jsx';
import Stylists from '../pages/Stylists.jsx';
import StylistDetail from '../pages/StylistDetail.jsx';

// Client pages
import Booking from '../pages/client/Booking.jsx';
import MyBookings from '../pages/client/MyBookings.jsx';
import Shop from '../pages/client/Shop.jsx';
import CartPage from '../pages/client/Cart.jsx';
import Checkout from '../pages/client/Checkout.jsx';

// Receptionist pages
import ReceptionDashboard from '../pages/receptionist/ReceptionDashboard.jsx';
import AllBookings from '../pages/receptionist/AllBookings.jsx';
import BookingDetail from '../pages/receptionist/BookingDetail.jsx';
import PaymentValidation from '../pages/receptionist/PaymentValidation.jsx';
import StockManagement from '../pages/receptionist/StockManagement.jsx';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';

// Common layout
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

// Error pages
const NotFound = () => (
  <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-center px-4">
    <h1 className="font-serif text-8xl text-pink-500 font-bold mb-4">404</h1>
    <p className="text-2xl font-serif text-gray-700 mb-2">Página no encontrada</p>
    <p className="text-gray-500 mb-8">La página que buscas no existe o fue movida.</p>
    <a href="/" className="bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600 transition-colors">
      Volver al inicio
    </a>
  </div>
);

const Forbidden = () => (
  <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-center px-4">
    <h1 className="font-serif text-8xl text-pink-500 font-bold mb-4">403</h1>
    <p className="text-2xl font-serif text-gray-700 mb-2">Acceso denegado</p>
    <p className="text-gray-500 mb-8">No tienes permisos para ver esta página.</p>
    <a href="/" className="bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600 transition-colors">
      Volver al inicio
    </a>
  </div>
);

const Layout = ({ children, hideFooter = false }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!hideFooter && <Footer />}
  </>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public ─────────────────────────────────────────────────────── */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/stylists" element={<Layout><Stylists /></Layout>} />
        <Route path="/stylists/:id" element={<Layout><StylistDetail /></Layout>} />

        {/* ─── Client (role: client) ──────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['client']} />}>
            <Route path="/booking" element={<Layout><Booking /></Layout>} />
            <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
            <Route path="/shop" element={<Layout><Shop /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout hideFooter><Checkout /></Layout>} />
          </Route>
        </Route>

        {/* ─── Receptionist ───────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['receptionist', 'admin']} />}>
            <Route path="/reception" element={<Layout><ReceptionDashboard /></Layout>} />
            <Route path="/reception/bookings" element={<Layout><AllBookings /></Layout>} />
            <Route path="/reception/bookings/:id" element={<Layout><BookingDetail /></Layout>} />
            <Route path="/reception/payments" element={<Layout><PaymentValidation /></Layout>} />
            <Route path="/reception/stock" element={<Layout><StockManagement /></Layout>} />
          </Route>
        </Route>

        {/* ─── Admin ──────────────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/stylists" element={<Layout><AdminDashboard section="stylists" /></Layout>} />
            <Route path="/admin/products" element={<Layout><AdminDashboard section="products" /></Layout>} />
            <Route path="/admin/users" element={<Layout><AdminDashboard section="users" /></Layout>} />
            <Route path="/admin/notifications" element={<Layout><AdminDashboard section="notifications" /></Layout>} />
          </Route>
        </Route>

        {/* ─── Error pages ────────────────────────────────────────────────── */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
