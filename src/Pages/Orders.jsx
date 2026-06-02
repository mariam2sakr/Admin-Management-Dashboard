import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Trash2, X, Clock, CheckCircle, AlertTriangle, AlertCircle, TrendingUp, DollarSign, ArrowUpRight, ShieldCheck, Truck, User, MapPin, Phone, Mail, Calendar, CreditCard, FileText, ChevronRight} from 'lucide-react';
import './Orders.css';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';
import avatar4 from '../assets/images/avatar4.png';
import avatar5 from '../assets/images/avatar5.png';
import avatar6 from '../assets/images/avatar6.png';
import camera from '../assets/images/camera.avif';
import headphones from '../assets/images/headphones.avif';
import laptop from '../assets/images/laptop.avif';
import watch from '../assets/images/watch.avif';
import sneakers from '../assets/images/sneakers.avif';
import runningshoes from '../assets/images/running-shoes.avif';

// Initial Mock Orders
const INITIAL_ORDERS = [
  {
    id: 'ORD-8921',
    customer: {
      name: 'Menna Mohamed',
      email: 'menna@example.com',
      avatar: avatar1,
      phone: '+1 (555) 234-5678',
      address: '15 El Tahrir Street, Downtown, Cairo, Egypt'
    },
    date: 'May 24, 2026',
    items: [
      { name: 'Pro Wireless Headphones', price: 129.99, quantity: 2, image: headphones },
      { name: 'Minimalist Wrist Watch', price: 89.50, quantity: 1, image: watch }
    ],
    shippingFee: 15.00,
    tax: 27.96,
    total: 377.44,
    paymentStatus: 'Paid', // Paid, Unpaid, Refunded
    paymentMethod: 'Credit Card',
    orderStatus: 'Completed', // Completed, Processing, Pending, Cancelled
    timeline: [
      { status: 'Ordered', date: 'May 24, 2026 10:14 AM', completed: true },
      { status: 'Paid', date: 'May 24, 2026 10:15 AM', completed: true },
      { status: 'Processing', date: 'May 24, 2026 11:30 AM', completed: true },
      { status: 'Shipped', date: 'May 24, 2026 02:45 PM', completed: true },
      { status: 'Delivered', date: 'May 25, 2026 01:20 PM', completed: true }
    ]
  },
  {
    id: 'ORD-8922',
    customer: {
      name: 'Yara Ali',
      email: 'yara@example.com',
      avatar: avatar2,
      phone: '+1 (555) 876-5432',
      address: '42 Abbas El Akkad Street, Nasr City, Cairo, Egypt'
    },
    date: 'May 23, 2026',
    items: [
      { name: 'UltraBook Pro 14"', price: 1299.00, quantity: 1, image: laptop }
    ],
    shippingFee: 0.00,
    tax: 103.92,
    total: 1402.92,
    paymentStatus: 'Unpaid',
    paymentMethod: 'PayPal',
    orderStatus: 'Pending',
    timeline: [
      { status: 'Ordered', date: 'May 23, 2026 04:12 PM', completed: true },
      { status: 'Paid', date: 'Pending', completed: false },
      { status: 'Processing', date: 'Pending', completed: false },
      { status: 'Shipped', date: 'Pending', completed: false },
      { status: 'Delivered', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'ORD-8923',
    customer: {
      name: 'Sarah Yaser',
      email: 'sarah@example.com',
      avatar: avatar3,
      phone: '+1 (555) 345-6789',
      address: '54 Saad Zaghloul Street, Port Said, Egypt'
    },
    date: 'May 22, 2026',
    items: [
      { name: 'Urban Runner Sneakers', price: 74.00, quantity: 1, image: sneakers },
      { name: 'Trail Running Shoes', price: 95.00, quantity: 1, image: runningshoes }
    ],
    shippingFee: 10.00,
    tax: 13.52,
    total: 192.52,
    paymentStatus: 'Paid',
    paymentMethod: 'Apple Pay',
    orderStatus: 'Completed',
    timeline: [
      { status: 'Ordered', date: 'May 22, 2026 09:30 AM', completed: true },
      { status: 'Paid', date: 'May 22, 2026 09:32 AM', completed: true },
      { status: 'Processing', date: 'May 22, 2026 11:00 AM', completed: true },
      { status: 'Shipped', date: 'May 22, 2026 03:00 PM', completed: true },
      { status: 'Delivered', date: 'May 23, 2026 10:15 AM', completed: true }
    ]
  },
  {
    id: 'ORD-8924',
    customer: {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      avatar: avatar4,
      phone: '+1 (555) 456-7890',
      address: '35 Ahmed Orabi Street, Dokki, Giza, Egypt'
    },
    date: 'May 21, 2026',
    items: [
      { name: 'Mirrorless Camera Kit', price: 699.00, quantity: 1, image: camera }
    ],
    shippingFee: 15.00,
    tax: 55.92,
    total: 769.92,
    paymentStatus: 'Refunded',
    paymentMethod: 'Credit Card',
    orderStatus: 'Cancelled',
    timeline: [
      { status: 'Ordered', date: 'May 21, 2026 01:15 PM', completed: true },
      { status: 'Paid', date: 'May 21, 2026 01:17 PM', completed: true },
      { status: 'Cancelled', date: 'May 21, 2026 03:40 PM', completed: true },
      { status: 'Refunded', date: 'May 22, 2026 11:00 AM', completed: true }
    ]
  },
  {
    id: 'ORD-8925',
    customer: {
      name: 'Yasin Adel',
      email: 'yasin@example.com',
      avatar: avatar5,
      phone: '+1 (555) 567-8901',
      address: '67 Al Horreya Road, Alexandria, Egypt'
    },
    date: 'May 25, 2026',
    items: [
      { name: 'Pro Wireless Headphones', price: 129.99, quantity: 1, image: headphones }
    ],
    shippingFee: 5.00,
    tax: 10.40,
    total: 145.39,
    paymentStatus: 'Paid',
    paymentMethod: 'Google Pay',
    orderStatus: 'Processing',
    timeline: [
      { status: 'Ordered', date: 'May 25, 2026 08:20 AM', completed: true },
      { status: 'Paid', date: 'May 25, 2026 08:21 AM', completed: true },
      { status: 'Processing', date: 'May 25, 2026 10:00 AM', completed: true },
      { status: 'Shipped', date: 'Pending', completed: false },
      { status: 'Delivered', date: 'Pending', completed: false }
    ]
  }
];

export default function Orders() {
  const ORDERS_VERSION = 'v2'; // غير الرقم كل ما تغير البيانات

const [orders, setOrders] = useState(() => {
  const savedVersion = localStorage.getItem('dashboard_orders_version');
  const saved = localStorage.getItem('dashboard_orders');
  
  if (saved && savedVersion === ORDERS_VERSION) {
    return JSON.parse(saved);
  }
  return INITIAL_ORDERS; // يرجع للجديد تلقائي
});

useEffect(() => {
  localStorage.setItem('dashboard_orders', JSON.stringify(orders));
  localStorage.setItem('dashboard_orders_version', ORDERS_VERSION);
}, [orders]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Selected Order for details modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status values for updating in modal
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState('');
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState('');

  // Handle opening order details
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setUpdatedOrderStatus(order.orderStatus);
    setUpdatedPaymentStatus(order.paymentStatus);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Update order status & payment status
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        // Build new timeline depending on orderStatus changes
        let newTimeline = [...order.timeline];
        
        // Simple logic to adjust timeline checkmarks based on selected status
        if (updatedOrderStatus === 'Completed') {
          newTimeline = newTimeline.map(step => {
            if (step.status === 'Ordered' || step.status === 'Paid' || step.status === 'Processing' || step.status === 'Shipped' || step.status === 'Delivered') {
              return { ...step, completed: true, date: step.date === 'Pending' ? nowStr : step.date };
            }
            return step;
          });
        } else if (updatedOrderStatus === 'Processing') {
          newTimeline = newTimeline.map(step => {
            if (step.status === 'Ordered' || step.status === 'Paid' || step.status === 'Processing') {
              return { ...step, completed: true, date: step.date === 'Pending' ? nowStr : step.date };
            }
            if (step.status === 'Shipped' || step.status === 'Delivered') {
              return { ...step, completed: false, date: 'Pending' };
            }
            return step;
          });
        } else if (updatedOrderStatus === 'Pending') {
          newTimeline = newTimeline.map(step => {
            if (step.status === 'Ordered') return { ...step, completed: true };
            return { ...step, completed: false, date: 'Pending' };
          });
        } else if (updatedOrderStatus === 'Cancelled') {
          // Add Cancelled step if not exists
          const hasCancel = newTimeline.some(step => step.status === 'Cancelled');
          if (!hasCancel) {
            newTimeline.push({ status: 'Cancelled', date: nowStr, completed: true });
          }
        }

        return {
          ...order,
          orderStatus: updatedOrderStatus,
          paymentStatus: updatedPaymentStatus,
          timeline: newTimeline
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    
    // Update local modal data too
    const updatedLocal = updatedOrders.find(o => o.id === selectedOrder.id);
    setSelectedOrder(updatedLocal);
    
    alert(`Order ${selectedOrder.id} status updated successfully!`);
  };

  // Delete Order
  const handleDeleteOrder = (id) => {
    if (window.confirm(`Are you sure you want to delete order ${id}?`)) {
      setOrders(orders.filter(order => order.id !== id));
      if (selectedOrder && selectedOrder.id === id) {
        handleCloseModal();
      }
    }
  };

  // Search & Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Stats calculation
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid' || o.orderStatus === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
  const completedCount = orders.filter(o => o.orderStatus === 'Completed').length;
  const totalCount = orders.length;

  return (
    <>
      <div className="orders-container">
        {/* Header */}
        <div className="orders-page-header">
          <div>
            <h1>Orders Management</h1>
            <p>Track e-commerce sales, process packages and update delivery status.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="orders-stats-grid">
          <div className="order-stat-card stat-indigo">
            <div className="stat-icon-wrap"><ShoppingBag size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="order-stat-card stat-amber">
            <div className="stat-icon-wrap"><Clock size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">Active / Pending</span>
            </div>
          </div>
          <div className="order-stat-card stat-green">
            <div className="stat-icon-wrap"><CheckCircle size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed Orders</span>
            </div>
          </div>
          <div className="order-stat-card stat-purple">
            <div className="stat-icon-wrap"><DollarSign size={20} /></div>
            <div className="stat-info">
              <span className="stat-value">${totalRevenue.toFixed(2)}</span>
              <span className="stat-label">Estimated Revenue</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              placeholder="Search by Order ID, name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-selects">
            <select
              className="filter-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Order Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              className="filter-dropdown"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-card">
          {filteredOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id-badge">{order.id}</span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <img src={order.customer.avatar} alt={order.customer.name} className="customer-avatar" />
                          <div className="customer-info">
                            <span className="customer-name">{order.customer.name}</span>
                            <span className="customer-email">{order.customer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="order-date-text">{order.date}</span>
                      </td>
                      <td>
                        <strong className="order-total-text">${order.total.toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`payment-badge badge-${order.paymentStatus.toLowerCase()}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge badge-${order.orderStatus.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => handleOpenDetails(order)}
                            title="View Details"
                          >
                            <Eye size={16} />
                            <span>Details</span>
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-table-state">
              <ShoppingBag size={48} />
              <h3>No orders found</h3>
              <p>Try adjusting your search filters or clear inputs.</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Slide-out Drawer / Modal */}
      {isModalOpen && selectedOrder && (
        <div className="order-modal-overlay" onClick={handleCloseModal}>
          <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-area">
                <h2>Order Details</h2>
                <span className="order-id-highlight">{selectedOrder.id}</span>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-scrollable">
              {/* Status Update Form */}
              <div className="details-section status-editor-section">
                <h3><ShieldCheck size={16} /> Update Status</h3>
                <form onSubmit={handleUpdateStatus} className="status-update-form">
                  <div className="status-form-grid">
                    <div className="input-group">
                      <label htmlFor="order-status-select">Order Status</label>
                      <select
                        id="order-status-select"
                        value={updatedOrderStatus}
                        onChange={(e) => setUpdatedOrderStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label htmlFor="payment-status-select">Payment Status</label>
                      <select
                        id="payment-status-select"
                        value={updatedPaymentStatus}
                        onChange={(e) => setUpdatedPaymentStatus(e.target.value)}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="save-status-btn">Save Changes</button>
                </form>
              </div>

              {/* Customer details section */}
              <div className="details-section customer-details-box">
                <h3><User size={16} /> Customer Information</h3>
                <div className="customer-summary">
                  <img src={selectedOrder.customer.avatar} alt={selectedOrder.customer.name} className="cust-avatar-large" />
                  <div className="cust-info-large">
                    <h4>{selectedOrder.customer.name}</h4>
                    <p className="cust-email"><Mail size={13} /> {selectedOrder.customer.email}</p>
                    <p className="cust-phone"><Phone size={13} /> {selectedOrder.customer.phone}</p>
                  </div>
                </div>
                <div className="shipping-address-box">
                  <span className="address-label"><MapPin size={14} /> Shipping Address:</span>
                  <p className="address-text">{selectedOrder.customer.address}</p>
                </div>
              </div>

              {/* Order items section */}
              <div className="details-section items-details-box">
                <h3><ShoppingBag size={16} /> Order Items</h3>
                <div className="items-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img src={item.image} alt={item.name} className="item-thumb" />
                      <div className="item-meta">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price-quantity">${item.price.toFixed(2)} x {item.quantity}</span>
                      </div>
                      <span className="item-row-total">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-pricing-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping Fee:</span>
                    <span>${selectedOrder.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-row grand-total-row">
                    <span>Total Amount:</span>
                    <strong>${selectedOrder.total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="payment-method-box">
                  <span>Payment Method: <strong>{selectedOrder.paymentMethod}</strong></span>
                  <span className="payment-status-label">
                    Status: <span className={`payment-badge badge-${selectedOrder.paymentStatus.toLowerCase()}`}>{selectedOrder.paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Order Shipment Timeline */}
              <div className="details-section timeline-box">
                <h3><Truck size={16} /> Fulfillment Timeline</h3>
                <div className="timeline-track">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className={`timeline-step ${step.completed ? 'completed' : 'pending'} ${step.status === 'Cancelled' ? 'cancelled' : ''}`}>
                      <div className="timeline-marker">
                        <div className="marker-inner"></div>
                      </div>
                      <div className="timeline-details">
                        <span className="timeline-status-name">{step.status}</span>
                        <span className="timeline-status-date">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer-sticky">
              <button className="btn-secondary close-details-btn" onClick={handleCloseModal}>Close Details</button>
              <button 
                className="btn-danger delete-order-btn" 
                onClick={() => handleDeleteOrder(selectedOrder.id)}
              >
                <Trash2 size={15} /> Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
