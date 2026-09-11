import React, { useState, useEffect } from 'react';
import FlickerText from './FlickerText';
import CustomDropdown from './CustomDropdown';

// Dropdown options for sorting and stock filtering
const SORT_OPTIONS = [
  { value: 'none', label: 'Sort: Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

const STOCK_OPTIONS = [
  { value: 'all', label: 'Status: All Inventory' },
  { value: 'in_stock', label: 'Status: In Stock' },
  { value: 'low_stock', label: 'Status: Low Stock' },
];

// Centralized API Base URL from .env (with fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  // Main Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Search & Sort (Query string parameters)
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('none');
  const [stockFilter, setStockFilter] = useState('all');

  // Modals & Forms State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', quantity: 1 });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', quantity: 1 });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

// fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (sort !== 'none') params.append('sort', sort);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/products${queryString}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(`Cannot connect to Express API at ${API_BASE_URL}. Ensure server is running with 'node --watch index.js'.`);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // fetch on search or sort change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, sort]);

  // add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (formData.price === '' || Number(formData.price) < 0) {
      setFormError('Please enter a valid non-negative price.');
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Number(formData.price),
          quantity: Number(formData.quantity) || 1
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || 'Failed to add product.');
        return;
      }

      setProducts((prev) => [...prev, result]);
      setFormData({ name: '', price: '', quantity: 1 });
      setIsAddModalOpen(false);
      showToast(`Added "${result.name}" to inventory!`);
    } catch (err) {
      setFormError('Network error connecting to API.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // edit product
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity
    });
    setEditError(null);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditError(null);

    if (!editFormData.name.trim()) {
      setEditError('Product name cannot be empty.');
      return;
    }

    setEditSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFormData.name.trim(),
          price: Number(editFormData.price),
          quantity: Number(editFormData.quantity)
        })
      });

      const updated = await response.json();

      if (!response.ok) {
        setEditError(updated.error || 'Failed to update product.');
        return;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingProduct(null);
      showToast(`Updated "${updated.name}" successfully!`);
    } catch (err) {
      setEditError('Network error connecting to API.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // delete product
  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleteSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${deletingProduct.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        showToast(err.error || 'Failed to delete product', 'error');
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      showToast(`Deleted "${deletingProduct.name}"`, 'success');
      setDeletingProduct(null);
    } catch (err) {
      showToast('Network error while deleting product', 'error');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const totalUnits = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const inventoryValue = products.reduce((acc, p) => acc + (Number(p.price) * (Number(p.quantity) || 0)), 0);
  const lowStockCount = products.filter((p) => (Number(p.quantity) || 0) <= 1).length;

  const displayedProducts = products.filter((p) => {
    if (stockFilter === 'in_stock') return (Number(p.quantity) || 0) > 1;
    if (stockFilter === 'low_stock') return (Number(p.quantity) || 0) <= 1;
    return true;
  });

  // Dynamic Chart Calculations based on real inventory data
  const maxProductValue = Math.max(...products.map((p) => (Number(p.price) || 0) * (Number(p.quantity) || 0)), 100);
  const maxProductQty = Math.max(...products.map((p) => Number(p.quantity) || 0), 5);
  const highestValuedProduct = products.reduce((prev, curr) => {
    const prevSub = (Number(prev?.price) || 0) * (Number(prev?.quantity) || 0);
    const currSub = (Number(curr?.price) || 0) * (Number(curr?.quantity) || 0);
    return currSub > prevSub ? curr : prev;
  }, products[0] || null);

  const chartPoints = products.map((p, idx) => {
    const subtotal = (Number(p.price) || 0) * (Number(p.quantity) || 0);
    const x = products.length > 1 ? 52 + (idx / (products.length - 1)) * 345 : 225;
    const yVal = 138 - (subtotal / (maxProductValue || 1)) * 105;
    const yQty = 138 - ((Number(p.quantity) || 0) / (maxProductQty || 1)) * 85;
    return {
      ...p,
      subtotal,
      x,
      yVal: Math.max(25, Math.min(138, yVal)),
      yQty: Math.max(35, Math.min(138, yQty)),
    };
  });

  const valuePathD = chartPoints.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.yVal}`, '');
  const qtyPathD = chartPoints.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.yQty}`, '');

  return (
    <div className="dashboard-layout">
      {/* ====================================================================
          LEFT SIDEBAR
          ==================================================================== */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <FlickerText text="Admin" />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Menu</div>
          <ul className="sidebar-menu">
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Dashboard
                </span>
              </button>
            </li>
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="m16 12-4-4-4 4M12 16V8"></path></svg>
                  Analytics
                </span>
              </button>
            </li>
            <li>
              <button className="sidebar-link active">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  Orders & Items
                </span>
              </button>
            </li>
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Customers
                </span>
              </button>
            </li>
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  Sales
                </span>
              </button>
            </li>
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Messages
                </span>
              </button>
            </li>
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  Notification
                </span>
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Account</div>
          <ul className="sidebar-menu">
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="13" y2="16"></line></svg>
                  Credit Report
                </span>
              </button>
            </li>
            <li>
              <button className="sidebar-link">
                <span className="sidebar-link-content">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  Settings
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Sidebar Status / Pro Card */}
        <div className="sidebar-footer">
          <div className="server-status-card">
            <div className={`status-indicator ${isConnected ? '' : 'offline'}`}>
              <span className="status-indicator-dot"></span>
              <span>{isConnected ? 'API Connected' : 'API Offline'}</span>
            </div>
            <button className="btn-sidebar-pro" onClick={fetchProducts}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Refresh API
            </button>
          </div>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="top-navbar">
          <div className="top-search-box">
            <span className="top-search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              className="top-search-input"
              placeholder="Search Anything (filter products)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="top-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="top-user-profile">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-email">Admin@gmail.com</div>
            </div>
          </div>
        </header>

        {/* Global Connection Error Alert */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#991b1b', fontSize: '0.875rem' }}>
            <span>⚠️ <strong>Server Connection Failed:</strong> {error}</span>
            <button style={{ background: '#991b1b', color: 'white', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={fetchProducts}>
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Title & Dropdown Controls */}
        <section className="dashboard-header">
          <div>
            <h1 className="dashboard-heading">Orders & Inventory</h1>
            <p className="dashboard-subheading">Your buying and selling catalog transactions</p>
          </div>

          <div className="header-actions">
            <CustomDropdown
              value={sort}
              options={SORT_OPTIONS}
              onChange={setSort}
              ariaLabel="Sort products"
              align="left"
              minWidth="175px"
            />

            <CustomDropdown
              value={stockFilter}
              options={STOCK_OPTIONS}
              onChange={setStockFilter}
              ariaLabel="Filter by stock status"
              align="right"
              minWidth="185px"
            />
          </div>
        </section>

        {/* Upper Grid: 4 Metric Cards + Ventory SVG Chart */}
        <section className="metrics-row">
          {/* 2x2 Metric Cards */}
          <div className="kpi-cards-grid">
            {/* Card 1: Total Orders / Products */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                </div>
                <button className="kpi-pill-btn">Report</button>
              </div>
              <div>
                <div className="kpi-label">Total Products</div>
                <div className="kpi-value-row">
                  <span className="kpi-value">{products.length}</span>
                  <span className="kpi-trend">↗ 5.4%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Pending Orders / Units */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <button className="kpi-pill-btn">Report</button>
              </div>
              <div>
                <div className="kpi-label">Total Units in Stock</div>
                <div className="kpi-value-row">
                  <span className="kpi-value">{totalUnits}</span>
                  <span className="kpi-trend">↗ 3%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Dispatched / Low Stock */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                </div>
                <button className="kpi-pill-btn">Report</button>
              </div>
              <div>
                <div className="kpi-label">Low Stock Alerts</div>
                <div className="kpi-value-row">
                  <span className="kpi-value">{lowStockCount}</span>
                  <span className="kpi-trend" style={{ color: lowStockCount > 0 ? '#f59e0b' : '#10b981' }}>
                    {lowStockCount > 0 ? '⚠ Needs Restock' : '✓ Good'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Revenue / Inventory Value */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <button className="kpi-pill-btn">Report</button>
              </div>
              <div>
                <div className="kpi-label">Inventory Valuation</div>
                <div className="kpi-value-row">
                  <span className="kpi-value">${inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="kpi-trend">↗ 2.7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Inventory Valuation & Stock Chart */}
          <div className="chart-card">
            <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 className="chart-title">Inventory Valuation & Stock</h3>
                <p className="chart-subtitle">Asset value ($) vs. In-stock units (pcs) across catalog</p>
              </div>

              {/* Top Value Item Indicator */}
              {highestValuedProduct && (
                <div
                  className="chart-tag"
                  style={{ position: 'static', maxWidth: '100%', cursor: 'default' }}
                  title={`Highest Value: ${highestValuedProduct.name} ($${Number(highestValuedProduct.price).toFixed(2)} × ${highestValuedProduct.quantity} pcs = $${((Number(highestValuedProduct.price) || 0) * (Number(highestValuedProduct.quantity) || 0)).toFixed(2)})`}
                >
                  <span className="chart-tag-dot"></span>
                  <span>
                    Highest Value: <strong>{highestValuedProduct.name.length > 20 ? highestValuedProduct.name.substring(0, 18) + '…' : highestValuedProduct.name}</strong> (${((Number(highestValuedProduct.price) || 0) * (Number(highestValuedProduct.quantity) || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })})
                  </span>
                </div>
              )}
            </div>

            <div className="svg-chart-container">
              {products.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2.5rem 0', fontSize: '0.85rem' }}>
                  No inventory data to graph. Add products to view trends.
                </div>
              ) : (
                <svg viewBox="0 0 450 160">
                  <defs>
                    <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#18181b" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#18181b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="48" y1="30" x2="402" y2="30" stroke="#f1f2f5" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="48" y1="80" x2="402" y2="80" stroke="#f1f2f5" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="48" y1="138" x2="402" y2="138" stroke="#e5e7eb" strokeWidth="1" />

                  {/* Left Y-Axis: Valuation ($) */}
                  <text x="5" y="34" fontSize="9.5" fill="#18181b" fontWeight="700" fontFamily="inherit">${Math.round(maxProductValue)}</text>
                  <text x="5" y="84" fontSize="9.5" fill="#9ca3af" fontFamily="inherit">${Math.round(maxProductValue * 0.5)}</text>
                  <text x="5" y="142" fontSize="9.5" fill="#9ca3af" fontFamily="inherit">$0</text>

                  {/* Right Y-Axis: In-Stock Quantity (pcs) */}
                  <text x="445" y="34" fontSize="9.5" fill="#64748b" fontWeight="600" textAnchor="end" fontFamily="inherit">{maxProductQty} pcs</text>
                  <text x="445" y="84" fontSize="9.5" fill="#9ca3af" textAnchor="end" fontFamily="inherit">{Math.round(maxProductQty * 0.5)} pcs</text>
                  <text x="445" y="142" fontSize="9.5" fill="#9ca3af" textAnchor="end" fontFamily="inherit">0 pcs</text>

                  {/* Secondary Dashed Trend Line: Quantity (pcs) */}
                  {chartPoints.length > 1 && (
                    <path
                      d={qtyPathD}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.6"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Primary Solid Trend Line: Inventory Value ($) */}
                  {chartPoints.length > 1 && (
                    <path
                      d={valuePathD}
                      fill="none"
                      stroke="#18181b"
                      strokeWidth="2.4"
                    />
                  )}

                  {/* Secondary Quantity Dots */}
                  {chartPoints.map((pt, i) => (
                    <g key={`qty-${pt.id || i}`}>
                      <circle cx={pt.x} cy={pt.yQty} r="3.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.8" />
                    </g>
                  ))}

                  {/* Primary Valuation Data Points with Direct Calculated Values */}
                  {chartPoints.map((pt, i) => (
                    <g key={pt.id || i} style={{ cursor: 'pointer' }}>
                      <title>{`${pt.name}\n• Total Valuation: $${pt.subtotal.toFixed(2)} ($${Number(pt.price).toFixed(2)} × ${pt.quantity} pcs)\n• In-Stock: ${pt.quantity} pcs`}</title>
                      {/* Outer pulse */}
                      <circle cx={pt.x} cy={pt.yVal} r="5" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
                      
                      {/* Direct Calculated Valuation Value Label */}
                      <text
                        x={pt.x}
                        y={Math.max(16, pt.yVal - 8)}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill="#18181b"
                        fontFamily="inherit"
                      >
                        ${Math.round(pt.subtotal)}
                      </text>

                      {/* X-Axis Product Name */}
                      <text
                        x={pt.x}
                        y="155"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="600"
                        fill="#64748b"
                        fontFamily="inherit"
                      >
                        {pt.name.length > 10 ? pt.name.substring(0, 8) + '…' : pt.name}
                      </text>
                    </g>
                  ))}
                </svg>
              )}
            </div>

            {/* Bottom Legend with Directly Calculated Total Values */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', justifyContent: 'center', marginTop: '0.65rem', fontSize: '0.8rem', color: '#475569', fontWeight: 600, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '2.5px', background: '#18181b', borderRadius: '2px' }}></span>
                Valuation: <strong style={{ color: '#0f172a', fontWeight: 800 }}>${inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '0', borderTop: '2px dashed #94a3b8' }}></span>
                Quantity: <strong style={{ color: '#0f172a', fontWeight: 800 }}>{totalUnits} pcs</strong>
              </span>
            </div>
          </div>

        </section>

        {/* Lower Grid: Category Stats + Products List + Right Add Action Panel */}
        <section className="dashboard-bottom-grid">
          {/* 1. Left Card: Categories / Distribution */}
          <div className="category-stats-card">
            <div className="card-title-row">
              <h3 className="card-title">Categories</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </div>

            <div className="category-row">
              <div className="category-header">
                <span className="category-name">Keyboards & Mice</span>
                <span className="category-count">{products.filter(p => p.name.toLowerCase().includes('keyboard') || p.name.toLowerCase().includes('mouse')).length}</span>
              </div>
              <div className="category-bar-bg">
                <div className="category-bar-fill" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="category-row">
              <div className="category-header">
                <span className="category-name">Displays & Monitors</span>
                <span className="category-count">{products.filter(p => p.name.toLowerCase().includes('monitor') || p.name.toLowerCase().includes('screen')).length}</span>
              </div>
              <div className="category-bar-bg">
                <div className="category-bar-fill" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="category-row">
              <div className="category-header">
                <span className="category-name">Cables & Accessories</span>
                <span className="category-count">{products.filter(p => p.name.toLowerCase().includes('cable') || p.name.toLowerCase().includes('usb')).length}</span>
              </div>
              <div className="category-bar-bg">
                <div className="category-bar-fill" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="category-row">
              <div className="category-header">
                <span className="category-name">Other Audio / Tech</span>
                <span className="category-count">{products.length > 0 ? 1 : 0}</span>
              </div>
              <div className="category-bar-bg">
                <div className="category-bar-fill" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>

          {/* 2. Center Card: Best Selling Products Inventory */}
          <div className="products-card">
            <div className="products-card-header">
              <h3 className="card-title">Best Selling Products</h3>
              <button className="filter-pill-btn" onClick={fetchProducts}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                Refresh Filter
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTopColor: '#18181b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }}></div>
                <p style={{ fontSize: '0.875rem' }}>Fetching products from Express API...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
                <div style={{ width: '36px', height: '36px', margin: '0 auto 0.75rem', color: '#9ca3af' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <p style={{ fontWeight: 700, color: '#1f2937' }}>No products found</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  {search ? `No items match "${search}"` : stockFilter !== 'all' ? 'No items match the selected stock filter.' : 'Click "+ Add Product" to create your first item.'}
                </p>
              </div>
            ) : (
              <div className="product-items-list">
                {displayedProducts.map((p) => {
                  const isLow = Number(p.quantity) <= 1;
                  return (
                    <div key={p.id} className="product-item-row">
                      <div className="product-item-left">
                        <div className="product-thumb-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        </div>
                        <div className="product-details">
                          <div className="product-title-text">{p.name}</div>
                          <div className="product-price-qty">
                            ${Number(p.price).toFixed(2)} × {p.quantity} pcs
                          </div>
                        </div>
                      </div>

                      <div className="product-item-right">
                        <span className={`status-badge-pill ${isLow ? 'low-stock' : 'in-stock'}`}>
                          <span className="badge-dot"></span>
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </span>

                        <div className="item-action-btns">
                          <button
                            className="action-icon-btn"
                            title="Edit Product"
                            onClick={() => openEditModal(p)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button
                            className="action-icon-btn delete"
                            title="Delete Product"
                            onClick={() => setDeletingProduct(p)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Right Action Panel: "+ Add Product" Button & Calendar Widget */}
          <div className="right-action-panel">
            <button className="btn-add-primary" onClick={() => setIsAddModalOpen(true)}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Add Product
            </button>

            {/* Calendar Widget directly from Dribbble design */}
            <div className="calendar-card">
              <div className="calendar-header">
                <span className="calendar-date-title">Dec 2, 2026</span>
                <div className="calendar-nav-arrows">
                  <span>‹</span>
                  <span>›</span>
                </div>
              </div>

              <div className="calendar-weekdays">
                <span>S</span><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
              </div>

              <div className="calendar-days-grid">
                <span className="calendar-day-cell muted">29</span>
                <span className="calendar-day-cell muted">30</span>
                <span className="calendar-day-cell">1</span>
                <span className="calendar-day-cell">2</span>
                <span className="calendar-day-cell active">3</span>
                <span className="calendar-day-cell">4</span>
                <span className="calendar-day-cell">5</span>
                <span className="calendar-day-cell">6</span>
                <span className="calendar-day-cell">7</span>
                <span className="calendar-day-cell">8</span>
                <span className="calendar-day-cell">9</span>
                <span className="calendar-day-cell">10</span>
                <span className="calendar-day-cell">11</span>
                <span className="calendar-day-cell">12</span>
                <span className="calendar-day-cell">13</span>
                <span className="calendar-day-cell">14</span>
                <span className="calendar-day-cell">15</span>
                <span className="calendar-day-cell">16</span>
                <span className="calendar-day-cell">17</span>
                <span className="calendar-day-cell">18</span>
                <span className="calendar-day-cell">19</span>
                <span className="calendar-day-cell">20</span>
                <span className="calendar-day-cell">21</span>
                <span className="calendar-day-cell">22</span>
                <span className="calendar-day-cell">23</span>
                <span className="calendar-day-cell">24</span>
                <span className="calendar-day-cell">25</span>
                <span className="calendar-day-cell">26</span>
                <span className="calendar-day-cell">27</span>
                <span className="calendar-day-cell">28</span>
                <span className="calendar-day-cell">29</span>
                <span className="calendar-day-cell">30</span>
                <span className="calendar-day-cell">31</span>
                <span className="calendar-day-cell muted">1</span>
                <span className="calendar-day-cell muted">2</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* add modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-heading">Add New Product</h3>
              <button className="btn-close-modal" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div className="form-field-group">
                <label className="form-field-label">Product Name</label>
                <input
                  type="text"
                  className="form-field-input"
                  placeholder="e.g. iPhone 15 Pro Max"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={formSubmitting}
                  required
                />
              </div>

              <div className="form-fields-split">
                <div className="form-field-group">
                  <label className="form-field-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-field-input"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    disabled={formSubmitting}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-field-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    disabled={formSubmitting}
                    required
                  />
                </div>
              </div>

              {formError && (
                <div className="form-field-error">⚠️ {formError}</div>
              )}

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit" disabled={formSubmitting}>
                  {formSubmitting ? 'Creating...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* edit modal */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-heading">Edit Product</h3>
              <button className="btn-close-modal" onClick={() => setEditingProduct(null)}>✕</button>
            </div>

            <form onSubmit={handleUpdateProduct}>
              <div className="form-field-group">
                <label className="form-field-label">Product Name</label>
                <input
                  type="text"
                  className="form-field-input"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  disabled={editSubmitting}
                  required
                />
              </div>

              <div className="form-fields-split">
                <div className="form-field-group">
                  <label className="form-field-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-field-input"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    disabled={editSubmitting}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-field-input"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                    disabled={editSubmitting}
                    required
                  />
                </div>
              </div>

              {editError && (
                <div className="form-field-error">⚠️ {editError}</div>
              )}

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit" disabled={editSubmitting}>
                  {editSubmitting ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete modal */}
      {deletingProduct && (
        <div className="modal-backdrop" onClick={() => setDeletingProduct(null)}>
          <div className="modal-dialog danger" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </div>
            <h3 className="modal-heading" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Delete "{deletingProduct.name}"?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              This will remove the item from the inventory. This action calls the Express API DELETE route.
            </p>

            <div className="modal-footer-actions" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn-modal-cancel" onClick={() => setDeletingProduct(null)}>
                Keep Product
              </button>
              <button type="button" className="btn-modal-danger" onClick={confirmDelete} disabled={deleteSubmitting}>
                {deleteSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className={`toast-floating ${toast.type === 'error' ? 'error' : ''}`}>
          <span>{toast.type === 'error' ? '✕' : '✓'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
