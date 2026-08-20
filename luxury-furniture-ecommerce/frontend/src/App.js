import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';

// Placeholder components for routes not yet implemented
const Products = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Products Page</h1></div>;
const ProductDetail = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Product Detail</h1></div>;
const Cart = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Shopping Cart</h1></div>;
const Login = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Login</h1></div>;
const Register = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Register</h1></div>;
const Profile = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>User Profile</h1></div>;
const Orders = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>My Orders</h1></div>;
const About = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>About Us</h1></div>;
const Contact = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Contact Us</h1></div>;
const NotFound = () => <div style={{padding: '100px 20px', textAlign: 'center'}}><h1>404 - Page Not Found</h1></div>;

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer style={{background: '#1a1a1a', color: '#fff', padding: '60px 20px', marginTop: '80px'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px'}}>
            <div>
              <h3 style={{color: '#d4af37', marginBottom: '20px'}}>LUXURY FURNITURE</h3>
              <p style={{opacity: 0.8, lineHeight: 1.8}}>
                Crafting exceptional furniture since 1985. Quality, elegance, and timeless design.
              </p>
            </div>
            <div>
              <h4 style={{marginBottom: '20px'}}>Quick Links</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '10px'}}><a href="/products" style={{color: '#fff', textDecoration: 'none'}}>Shop</a></li>
                <li style={{marginBottom: '10px'}}><a href="/about" style={{color: '#fff', textDecoration: 'none'}}>About Us</a></li>
                <li style={{marginBottom: '10px'}}><a href="/contact" style={{color: '#fff', textDecoration: 'none'}}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{marginBottom: '20px'}}>Customer Service</h4>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '10px'}}>Shipping & Returns</li>
                <li style={{marginBottom: '10px'}}>FAQ</li>
                <li style={{marginBottom: '10px'}}>Privacy Policy</li>
                <li style={{marginBottom: '10px'}}>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 style={{marginBottom: '20px'}}>Contact</h4>
              <p style={{opacity: 0.8, marginBottom: '10px'}}>1-800-LUXURY-FURN</p>
              <p style={{opacity: 0.8}}>support@luxuryfurniture.com</p>
            </div>
          </div>
          <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', paddingTop: '30px', textAlign: 'center', opacity: 0.6}}>
            <p>&copy; 2024 Luxury Furniture. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
