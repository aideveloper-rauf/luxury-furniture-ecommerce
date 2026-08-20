import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <p>Free Shipping on Orders Over $500 | Luxury Quality Guaranteed</p>
        </div>
      </div>
      
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo">
            <h1>LUXURY<span>FURNITURE</span></h1>
          </Link>

          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link></li>
            <li><Link to="/categories/living-room" onClick={() => setMenuOpen(false)}>Living Room</Link></li>
            <li><Link to="/categories/bedroom" onClick={() => setMenuOpen(false)}>Bedroom</Link></li>
            <li><Link to="/categories/dining" onClick={() => setMenuOpen(false)}>Dining</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>

          <div className="nav-icons">
            <Link to="/search" className="nav-icon">
              <FaSearch />
            </Link>
            
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button 
                  className="nav-icon user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <FaUser />
                </button>
                {userMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">My Orders</Link>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-icon">
                <FaUser />
              </Link>
            )}
            
            <Link to="/cart" className="nav-icon cart-icon">
              <FaShoppingCart />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>

            <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
