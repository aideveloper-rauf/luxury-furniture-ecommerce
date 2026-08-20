import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaTruck, FaCog, FaBars, FaTimes } from 'react-icons/fa';

// Placeholder page components
const Dashboard = () => (
  <div className="page-content">
    <h1>Dashboard</h1>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Orders</h3>
        <p className="stat-number">1,247</p>
        <span className="stat-change positive">+12.5%</span>
      </div>
      <div className="stat-card">
        <h3>Revenue</h3>
        <p className="stat-number">$89,432</p>
        <span className="stat-change positive">+8.2%</span>
      </div>
      <div className="stat-card">
        <h3>Products</h3>
        <p className="stat-number">328</p>
        <span className="stat-change">This month</span>
      </div>
      <div className="stat-card">
        <h3>Customers</h3>
        <p className="stat-number">2,891</p>
        <span className="stat-change positive">+15.3%</span>
      </div>
    </div>
    
    <div className="recent-orders">
      <h2>Recent Orders</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>LF-001247</td>
            <td>John Smith</td>
            <td><span className="status-badge delivered">Delivered</span></td>
            <td>$4,999.99</td>
            <td>Dec 20, 2024</td>
          </tr>
          <tr>
            <td>LF-001246</td>
            <td>Sarah Johnson</td>
            <td><span className="status-badge shipped">Shipped</span></td>
            <td>$2,499.99</td>
            <td>Dec 19, 2024</td>
          </tr>
          <tr>
            <td>LF-001245</td>
            <td>Michael Brown</td>
            <td><span className="status-badge processing">Processing</span></td>
            <td>$7,499.98</td>
            <td>Dec 18, 2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Products = () => (
  <div className="page-content">
    <div className="page-header">
      <h1>Products</h1>
      <button className="btn-primary">+ Add Product</button>
    </div>
    <table className="data-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><div className="product-thumb"></div></td>
          <td>Milano Leather Sofa</td>
          <td>LFS-001</td>
          <td>Living Room</td>
          <td>$4,999.99</td>
          <td>15</td>
          <td><span className="status-badge active">Active</span></td>
          <td>
            <button className="btn-sm">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Orders = () => (
  <div className="page-content">
    <div className="page-header">
      <h1>Orders</h1>
      <div className="filters">
        <select>
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>
    </div>
    <table className="data-table">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Customer</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>LF-001247</td>
          <td>John Smith</td>
          <td>1 item</td>
          <td>$4,999.99</td>
          <td><span className="status-badge delivered">Delivered</span></td>
          <td>Dec 20, 2024</td>
          <td>
            <button className="btn-sm">View</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DeliveryManagement = () => (
  <div className="page-content">
    <div className="page-header">
      <h1>Delivery Management</h1>
    </div>
    <div className="delivery-grid">
      <div className="delivery-card">
        <h3>Assigned Deliveries</h3>
        <p className="number">12</p>
      </div>
      <div className="delivery-card">
        <h3>In Transit</h3>
        <p className="number">8</p>
      </div>
      <div className="delivery-card">
        <h3>Delivered Today</h3>
        <p className="number">5</p>
      </div>
    </div>
    <h2>Active Deliveries</h2>
    <table className="data-table">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Delivery Person</th>
          <th>Customer</th>
          <th>Address</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>LF-001245</td>
          <td>Mike Wilson</td>
          <td>Michael Brown</td>
          <td>123 Main St, NYC</td>
          <td><span className="status-badge in-transit">In Transit</span></td>
          <td>
            <button className="btn-sm">Track</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Customers = () => (
  <div className="page-content">
    <h1>Customers</h1>
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Orders</th>
          <th>Total Spent</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Smith</td>
          <td>john@email.com</td>
          <td>5</td>
          <td>$12,499.95</td>
          <td>Jan 15, 2024</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Settings = () => (
  <div className="page-content">
    <h1>Settings</h1>
    <p>Admin settings and configuration options would go here.</p>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Products' },
    { path: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/delivery', icon: <FaTruck />, label: 'Delivery' },
    { path: '/customers', icon: <FaUsers />, label: 'Customers' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' }
  ];

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>LUXURY<span>FURNITURE</span></h2>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          <div className="user-menu">
            <span>Admin User</span>
            <button className="btn-logout">Logout</button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/delivery" element={<DeliveryManagement />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
