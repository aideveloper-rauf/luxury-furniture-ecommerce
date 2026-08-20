import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <FaTruck />,
      title: 'Free Shipping',
      description: 'Complimentary white glove delivery on orders over $500'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Lifetime Warranty',
      description: 'Every piece backed by our comprehensive lifetime warranty'
    },
    {
      icon: <FaUndo />,
      title: '30-Day Returns',
      description: 'Love it or return it within 30 days, no questions asked'
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Support',
      description: 'Dedicated concierge service for all your needs'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>ELEVATE YOUR SPACE</h1>
          <p>Discover handcrafted luxury furniture that transforms houses into homes</p>
          <Link to="/products" className="btn-primary">Shop Collection</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/categories/living-room" className="category-card">
              <div className="category-image living-room"></div>
              <h3>Living Room</h3>
              <p>Sofas, Chairs & Tables</p>
            </Link>
            <Link to="/categories/bedroom" className="category-card">
              <div className="category-image bedroom"></div>
              <h3>Bedroom</h3>
              <p>Beds & Dressers</p>
            </Link>
            <Link to="/categories/dining" className="category-card">
              <div className="category-image dining"></div>
              <h3>Dining Room</h3>
              <p>Tables & Chairs</p>
            </Link>
            <Link to="/categories/office" className="category-card">
              <div className="category-image office"></div>
              <h3>Office</h3>
              <p>Desks & Storage</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-subtitle">Our most coveted pieces, curated for discerning tastes</p>
          <div className="products-grid">
            {/* Product cards would be dynamically loaded here */}
            <div className="product-placeholder">
              <p>Featured products will load from the API</p>
            </div>
          </div>
          <div className="view-all-container">
            <Link to="/products" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>CRAFTING LUXURY SINCE 1985</h2>
              <p>
                For over three decades, we've been dedicated to creating exceptional 
                furniture that combines timeless design with uncompromising quality. 
                Each piece is meticulously crafted by master artisans using the finest 
                materials sourced from around the world.
              </p>
              <p>
                Our commitment to excellence extends beyond craftsmanship. We believe 
                in sustainable practices, ethical sourcing, and creating furniture 
                that lasts generations.
              </p>
              <Link to="/about" className="btn-primary">Learn More</Link>
            </div>
            <div className="about-image"></div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <h2>JOIN OUR EXCLUSIVE LIST</h2>
          <p>Be the first to know about new collections, special offers, and design inspiration</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
