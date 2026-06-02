import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Package, LayoutGrid, List, Tag, DollarSign, Archive, TrendingUp, Upload} from 'lucide-react';
import './Products.css';
import camera from '../assets/images/camera.avif';
import headphones from '../assets/images/headphones.avif';
import laptop from '../assets/images/laptop.avif';
import watch from '../assets/images/watch.avif';
import sneakers from '../assets/images/sneakers.avif';
import runningshoes from '../assets/images/running-shoes.avif';

/* ─── Preset product images ─────────────────────────────── */
const PRODUCT_IMAGES = [headphones,watch, sneakers, camera, runningshoes, laptop, ];

const CATEGORIES = ['Electronics', 'Clothing', 'Sports', 'Accessories', 'Home', 'Books'];

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Pro Wireless Headphones', category: 'Electronics', price: 129.99, stock: 54, image: PRODUCT_IMAGES[0] },
  { id: 2, name: 'Minimalist Wrist Watch', category: 'Accessories', price: 89.50, stock: 18, image: PRODUCT_IMAGES[1] },
  { id: 3, name: 'Urban Runner Sneakers', category: 'Sports', price: 74.00, stock: 3, image: PRODUCT_IMAGES[2] },
  { id: 4, name: 'Mirrorless Camera Kit', category: 'Electronics', price: 699.00, stock: 0, image: PRODUCT_IMAGES[3] },
  { id: 5, name: 'Trail Running Shoes', category: 'Sports', price: 95.00, stock: 31, image: PRODUCT_IMAGES[4] },
  { id: 6, name: 'UltraBook Pro 14"', category: 'Electronics', price: 1299.00, stock: 7, image: PRODUCT_IMAGES[5] },
];

/* ─── Stock helpers ──────────────────────────────────────── */
function getStockStatus(stock) {
  if (stock === 0) return 'out';
  if (stock <= 10) return 'low';
  return 'in';
}
function getStockLabel(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 10) return 'Low Stock';
  return 'In Stock';
}
function getStockPct(stock) {
  if (stock === 0) return 0;
  return Math.min(100, Math.round((stock / 60) * 100));
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Products() {
  /* ── State ── */
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('dashboard_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate every image URL: must match a current imported asset,
        // OR be a user-uploaded blob/data URL.
        // Stale paths (from a different build or host) won't be in PRODUCT_IMAGES.
        const isValid = parsed.every(p =>
          PRODUCT_IMAGES.includes(p.image) ||
          p.image?.startsWith('blob:') ||
          p.image?.startsWith('data:')
        );
        if (isValid) return parsed;
      } catch {}
      // Stale / corrupt data → clear and fall back to seed data
      localStorage.removeItem('dashboard_products');
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('dashboard_products', JSON.stringify(products));
  }, [products]);

  const [searchTerm, setSearchTerm]     = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter]   = useState('All');
  const [viewMode, setViewMode]         = useState('grid'); // 'grid' | 'table'

  /* Modal */
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [modalMode, setModalMode]       = useState('add');
  const [editingId, setEditingId]       = useState(null);
  const [formData, setFormData]         = useState({
    name: '', category: 'Electronics', price: '', stock: '', image: PRODUCT_IMAGES[0]
  });
  const [formErrors, setFormErrors]     = useState({});

  // Ref for hidden product image file input
  const imageInputRef = useRef(null);

  // Handle local product image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: objectUrl }));
  };

  /* ── Filtering ── */
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStock  =
      stockFilter === 'All' ||
      (stockFilter === 'In Stock'    && p.stock > 10) ||
      (stockFilter === 'Low Stock'   && p.stock > 0 && p.stock <= 10) ||
      (stockFilter === 'Out of Stock'&& p.stock === 0);
    return matchSearch && matchCat && matchStock;
  });

  /* ── Stats ── */
  const totalProducts  = products.length;
  const inStockCount   = products.filter(p => p.stock > 10).length;
  const lowStockCount  = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outStockCount  = products.filter(p => p.stock === 0).length;

  /* ── Modal helpers ── */
  const openAdd = () => {
    setModalMode('add');
    setFormData({ name: '', category: 'Electronics', price: '', stock: '', image: PRODUCT_IMAGES[0] });
    setFormErrors({});
    setIsModalOpen(true);
  };
  const openEdit = (p) => {
    setModalMode('edit');
    setEditingId(p.id);
    setFormData({ name: p.name, category: p.category, price: p.price, stock: p.stock, image: p.image });
    setFormErrors({});
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())              e.name  = 'Product name is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0)
                                            e.price = 'Enter a valid price';
    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0)
                                            e.stock = 'Enter a valid stock quantity';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };
    if (modalMode === 'add') {
      setProducts([{ id: Date.now(), ...payload }, ...products]);
    } else {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...payload } : p));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="products-container">

        {/* ── Header ── */}
        <div className="products-header">
          <div>
            <h1>Products</h1>
            <p>Manage your inventory, prices and stock levels.</p>
          </div>
          <button className="prod-btn-primary" onClick={openAdd}>
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>

        {/* ── Stats row ── */}
        <div className="prod-stats-grid">
          <div className="prod-stat-card stat-indigo">
            <div className="stat-icon-wrap"><Package size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">{totalProducts}</span>
              <span className="stat-label">Total Products</span>
            </div>
          </div>
          <div className="prod-stat-card stat-green">
            <div className="stat-icon-wrap"><TrendingUp size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">{inStockCount}</span>
              <span className="stat-label">In Stock</span>
            </div>
          </div>
          <div className="prod-stat-card stat-amber">
            <div className="stat-icon-wrap"><Archive size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">{lowStockCount}</span>
              <span className="stat-label">Low Stock</span>
            </div>
          </div>
          <div className="prod-stat-card stat-red">
            <div className="stat-icon-wrap"><Tag size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">{outStockCount}</span>
              <span className="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="prod-filter-bar">
          <div className="prod-search-wrapper">
            <Search size={17} className="prod-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="prod-filter-right">
            <select className="prod-dropdown" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select className="prod-dropdown" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* View toggle */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={17} />
              </button>
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <List size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          <div className="prod-empty-state">
            <Package size={52} />
            <h3>No products found</h3>
            <p>Try adjusting your filters or add a new product.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* ─── Grid view ─── */
          <div className="prod-grid">
            {filtered.map(product => {
              const status = getStockStatus(product.stock);
              return (
                <div className="prod-card" key={product.id}>
                  {/* Image */}
                  <div className="prod-card-image-wrap">
                    <img src={product.image} alt={product.name} className="prod-card-image" />
                    <span className="prod-category-badge">{product.category}</span>
                  </div>

                  {/* Info */}
                  <div className="prod-card-body">
                    <h3 className="prod-card-name">{product.name}</h3>

                    <div className="prod-card-price">
                      <DollarSign size={14} />
                      {product.price.toFixed(2)}
                    </div>

                    {/* Stock bar */}
                    <div className="prod-stock-section">
                      <div className="prod-stock-meta">
                        <span className={`prod-stock-label stock-${status}`}>
                          {getStockLabel(product.stock)}
                        </span>
                        <span className="prod-stock-units">{product.stock} units</span>
                      </div>
                      <div className="prod-stock-bar-bg">
                        <div
                          className={`prod-stock-bar-fill fill-${status}`}
                          style={{ width: `${getStockPct(product.stock)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="prod-card-actions">
                      <button className="prod-action-btn edit-btn" onClick={() => openEdit(product)} title="Edit">
                        <Edit2 size={15} />
                        <span>Edit</span>
                      </button>
                      <button className="prod-action-btn delete-btn" onClick={() => handleDelete(product.id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ─── Table view ─── */
          <div className="prod-table-card">
            <table className="prod-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  const status = getStockStatus(product.stock);
                  return (
                    <tr key={product.id}>
                      <td data-label="Product">
                        <div className="prod-table-identity">
                          <img src={product.image} alt={product.name} className="prod-table-thumb" />
                          <span className="prod-table-name">{product.name}</span>
                        </div>
                      </td>
                      <td data-label="Category"><span className="prod-table-category">{product.category}</span></td>
                      <td data-label="Price"><span className="prod-table-price">${product.price.toFixed(2)}</span></td>
                      <td data-label="Stock"><span className="prod-table-stock-num">{product.stock}</span></td>
                      <td data-label="Status">
                        <span className={`prod-status-badge status-${status}`}>
                          {getStockLabel(product.stock)}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <div className="prod-table-actions">
                          <button className="prod-icon-btn edit-icon-btn" onClick={() => openEdit(product)} title="Edit">
                            <Edit2 size={15} />
                          </button>
                          <button className="prod-icon-btn delete-icon-btn" onClick={() => handleDelete(product.id)} title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="prod-modal-overlay" onClick={closeModal}>
          <div className="prod-modal-card" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="prod-modal-header">
              <h2>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
              <button className="prod-modal-close" onClick={closeModal}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="prod-modal-body">

                {/* Image picker */}
                <div className="prod-form-field">
                  <label>Product Image</label>
                  <div className="prod-image-picker">
                    {PRODUCT_IMAGES.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`option ${i + 1}`}
                        className={`prod-image-option ${formData.image === url ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, image: url })}
                      />
                    ))}
                    {/* Show uploaded image if it's a blob URL */}
                    {formData.image && formData.image.startsWith('blob:') && (
                      <img
                        src={formData.image}
                        alt="Uploaded"
                        className="prod-image-option selected"
                      />
                    )}
                  </div>

                  {/* Upload from device */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    className="upload-local-btn"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Upload from device</span>
                  </button>
                </div>

                {/* Name */}
                <div className="prod-form-field">
                  <label htmlFor="prod-name">Product Name</label>
                  <input
                    id="prod-name"
                    type="text"
                    className="prod-input"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && <span className="prod-error">{formErrors.name}</span>}
                </div>

                {/* Category */}
                <div className="prod-form-field">
                  <label htmlFor="prod-cat">Category</label>
                  <select
                    id="prod-cat"
                    className="prod-input"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Price + Stock side by side */}
                <div className="prod-form-grid">
                  <div className="prod-form-field">
                    <label htmlFor="prod-price">Price ($)</label>
                    <input
                      id="prod-price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="prod-input"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                    {formErrors.price && <span className="prod-error">{formErrors.price}</span>}
                  </div>
                  <div className="prod-form-field">
                    <label htmlFor="prod-stock">Stock Qty</label>
                    <input
                      id="prod-stock"
                      type="number"
                      min="0"
                      className="prod-input"
                      placeholder="0"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    />
                    {formErrors.stock && <span className="prod-error">{formErrors.stock}</span>}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="prod-modal-footer">
                <button type="button" className="prod-btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="prod-btn-primary">
                  {modalMode === 'add' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
