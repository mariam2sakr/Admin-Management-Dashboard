import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Mail, Phone, ChevronDown, ChevronUp, Plus, Check, Clock, CheckCircle, AlertCircle, X, Send, BookOpen, Headphones, Zap} from 'lucide-react';
import './Support.css';

// ─── FAQ Data ──────────────────────────────────────────
const FAQS = [
  {
    question: 'How do I add a new product to the inventory?',
    answer: 'Navigate to the Products page from the sidebar, then click the "Add Product" button in the top-right. Fill in the required fields including name, price, stock quantity, and select an image. Click "Create Product" to save.'
  },
  {
    question: 'How can I update an order status?',
    answer: 'Go to the Orders page, find the order you want to update, and click "Details". In the drawer that opens, you\'ll see the "Update Status" section at the top where you can change the Order Status and Payment Status, then click "Save Changes".'
  },
  {
    question: 'Can I export the analytics report?',
    answer: 'Currently, export functionality is available on the main Dashboard page via the "Export Report" button. Full analytics export with custom date ranges is on our roadmap and will be available in the next major release.'
  },
  {
    question: 'How do I add or remove a user from the system?',
    answer: 'Visit the Users page from the sidebar. Click "Add User" to create a new account, or click the edit/delete icons in the user table to modify or remove existing users. Changes are saved automatically.'
  },
  {
    question: 'What does "Low Stock" mean on the Products page?',
    answer: 'A product is flagged as "Low Stock" when its inventory quantity falls below 10 units. This threshold helps you proactively reorder before running out. "Out of Stock" means the quantity has reached 0.'
  },
  {
    question: 'How do I enable Two-Factor Authentication?',
    answer: 'Navigate to Settings → Security section. Toggle on the "Two-Factor Authentication" switch. Once enabled, you will receive a verification code via email each time you log in from a new device.'
  },
];

// ─── Initial Tickets ───────────────────────────────────
const INITIAL_TICKETS = [
  { id: 'TKT-001', subject: 'Unable to delete a product', priority: 'High', status: 'Open', date: 'May 24, 2026', category: 'Bug' },
  { id: 'TKT-002', subject: 'Export button not working on Safari', priority: 'Medium', status: 'In Progress', date: 'May 22, 2026', category: 'Bug' },
  { id: 'TKT-003', subject: 'Need help with user roles', priority: 'Low', status: 'Resolved', date: 'May 20, 2026', category: 'Question' },
];

const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['Bug', 'Question', 'Feature Request', 'Account', 'Billing'];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [form, setForm] = useState({ subject: '', category: 'Question', priority: 'Low', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Please describe your issue';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: form.subject,
      priority: form.priority,
      status: 'Open',
      date: dateStr,
      category: form.category,
    };
    setTickets([newTicket, ...tickets]);
    setForm({ subject: '', category: 'Question', priority: 'Low', message: '' });
    setFormErrors({});
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const statusMeta = (status) => {
    switch (status) {
      case 'Open':        return { cls: 'status-open',        icon: <Clock size={12} /> };
      case 'In Progress': return { cls: 'status-in-progress', icon: <Zap size={12} /> };
      case 'Resolved':    return { cls: 'status-resolved',    icon: <CheckCircle size={12} /> };
      default:            return { cls: '',                    icon: null };
    }
  };

  const priorityMeta = (p) => {
    switch (p) {
      case 'High':   return 'priority-high';
      case 'Medium': return 'priority-medium';
      default:       return 'priority-low';
    }
  };

  return (
    <div className="support-container">
      {/* Header */}
      <div className="support-header">
        <div>
          <h1>Support Center</h1>
          <p>Find answers, submit tickets, or reach our team directly.</p>
        </div>
      </div>

      {/* ── Contact Cards ── */}
      <div className="support-contact-grid">
        <div className="support-contact-card">
          <div className="contact-icon-wrap icon-indigo"><Mail size={20} /></div>
          <div>
            <h4>Email Support</h4>
            <p>support@admindash.com</p>
            <span className="contact-badge">Responds in 24h</span>
          </div>
        </div>
        <div className="support-contact-card">
          <div className="contact-icon-wrap icon-green"><Phone size={20} /></div>
          <div>
            <h4>Phone Support</h4>
            <p>+1 (800) 123-4567</p>
            <span className="contact-badge">Mon–Fri, 9am–6pm EST</span>
          </div>
        </div>
        <div className="support-contact-card">
          <div className="contact-icon-wrap icon-purple"><Headphones size={20} /></div>
          <div>
            <h4>Live Chat</h4>
            <p>Chat with our agents</p>
            <span className="contact-badge online">● Online Now</span>
          </div>
        </div>
        <div className="support-contact-card">
          <div className="contact-icon-wrap icon-amber"><BookOpen size={20} /></div>
          <div>
            <h4>Documentation</h4>
            <p>Full admin user guide</p>
            <span className="contact-badge">View Docs →</span>
          </div>
        </div>
      </div>

      {/* ── FAQ Accordion ── */}
      <div className="support-section-card">
        <div className="section-card-header">
          <div>
            <h3><HelpCircle size={16} /> Frequently Asked Questions</h3>
            <p>Quick answers to the most common questions.</p>
          </div>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(idx)}>
                <span>{faq.question}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === idx && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Ticket System ── */}
      <div className="support-section-card">
        <div className="section-card-header">
          <div>
            <h3><MessageSquare size={16} /> Support Tickets</h3>
            <p>Track and manage your submitted support requests.</p>
          </div>
          <button className="new-ticket-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Ticket'}
          </button>
        </div>

        {/* Success Banner */}
        {submitted && (
          <div className="ticket-success-banner">
            <Check size={16} /> Your ticket has been submitted! Our team will respond within 24 hours.
          </div>
        )}

        {/* New Ticket Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="tf-grid">
              <div className="tf-field">
                <label>Subject <span className="req">*</span></label>
                <input
                  type="text"
                  className={`tf-input ${formErrors.subject ? 'error' : ''}`}
                  placeholder="Brief description of your issue"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
                {formErrors.subject && <span className="tf-error">{formErrors.subject}</span>}
              </div>
              <div className="tf-field">
                <label>Category</label>
                <select className="tf-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="tf-field">
                <label>Priority</label>
                <select className="tf-input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="tf-field">
              <label>Description <span className="req">*</span></label>
              <textarea
                rows={4}
                className={`tf-input tf-textarea ${formErrors.message ? 'error' : ''}`}
                placeholder="Please describe your issue in detail, including steps to reproduce if applicable..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
              {formErrors.message && <span className="tf-error">{formErrors.message}</span>}
            </div>
            <button type="submit" className="tf-submit-btn">
              <Send size={16} /> Submit Ticket
            </button>
          </form>
        )}

        {/* Tickets Table */}
        {tickets.length > 0 ? (
          <div className="tickets-table-wrap">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => {
                  const sm = statusMeta(t.status);
                  return (
                    <tr key={t.id}>
                      <td data-label="Ticket ID"><span className="ticket-id-badge">{t.id}</span></td>
                      <td data-label="Subject"><span className="ticket-subject">{t.subject}</span></td>
                      <td data-label="Category"><span className="ticket-category">{t.category}</span></td>
                      <td data-label="Priority"><span className={`priority-badge ${priorityMeta(t.priority)}`}>{t.priority}</span></td>
                      <td data-label="Status">
                        <span className={`ticket-status-badge ${sm.cls}`}>
                          {sm.icon} {t.status}
                        </span>
                      </td>
                      <td data-label="Date" className="ticket-date">{t.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="tickets-empty">
            <MessageSquare size={40} />
            <p>No tickets yet. Submit one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
