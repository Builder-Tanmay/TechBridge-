import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import ContactUs from './Pages/ContactUs';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Cart from './Pages/Cart';
import ForgotPassword from './Pages/ForgotPassword';
import UserDashboard from './Pages/UserDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import Products from './Pages/Products';
import Wishlist from './Pages/Wishlist';
import AccountSettings from './Pages/AccountSettings';
import OrderSummary from './Pages/OrderSummery';
import CreateTicketModal from './Pages/CreateTicketModal';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Blog from './Pages/Blog';
import MyOrders from './Pages/MyOrders';

// Layout component to selectively render Header and Footer
const MainLayout = ({ children }) => {
  const location = useLocation();
  // Hide Header and Footer on Admin Dashboard
  const isAdminDashboard = location.pathname.toLowerCase() === '/admindashboard';

  return (
    <>
      {!isAdminDashboard && <Header />}
      {children}
      {!isAdminDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/product" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ordersummary" element={<OrderSummary />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/createticketmodal" element={<CreateTicketModal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;