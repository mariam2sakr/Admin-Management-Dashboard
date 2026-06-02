import React, { useState, useEffect, useRef } from 'react';
import {  Plus,  Search,  Edit2,  Trash2,  X,  UserCheck,  UserPlus, Filter, Upload, Users as UsersIcon} from 'lucide-react';
import './Users.css';
import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';
import avatar4 from '../assets/images/avatar4.png';
import avatar5 from '../assets/images/avatar5.png';
import avatar6 from '../assets/images/avatar6.png';


// Preset Avatars for selection
const AVATAR_PRESETS = [ avatar1 ,avatar2,avatar3,avatar4,avatar5,avatar6];

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Menna Mohamed',
    email: 'menna@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: AVATAR_PRESETS[0]
  },
  {
    id: 2,
    name: 'Yara Ali',
    email: 'yara@example.com',
    role: 'Editor',
    status: 'Inactive',
    avatar: AVATAR_PRESETS[1]
  },
  {
    id: 3,
    name: 'Sarah Yaser',
    email: 'sarah@example.com',
    role: 'User',
    status: 'Active',
    avatar: AVATAR_PRESETS[2]
  },
  {
    id: 4,
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    role: 'User',
    status: 'Suspended',
    avatar: AVATAR_PRESETS[3]
  },
  {
    id: 5,
    name: 'Yasin Adel',
    email: 'yasin@example.com',
    role: 'Editor',
    status: 'Active',
    avatar: AVATAR_PRESETS[4]
  },
  {
    id: 6,
    name: 'Moustafa Samir',
    email: 'moustafa@example.com',
    role: 'Editor',
    status: 'Active',
    avatar: AVATAR_PRESETS[5]
  }
];


export default function Users() {
  // Load users from localStorage, fallback to initial mock data
const USERS_VERSION = 'v2'; // غيّر الرقم كل ما تغير البيانات

const [users, setUsers] = useState(() => {
  const savedVersion = localStorage.getItem('dashboard_users_version');
  const saved = localStorage.getItem('dashboard_users');

  if (saved && savedVersion === USERS_VERSION) {
    return JSON.parse(saved);
  }
  return INITIAL_USERS;
});

useEffect(() => {
  localStorage.setItem('dashboard_users', JSON.stringify(users));
  localStorage.setItem('dashboard_users_version', USERS_VERSION);
}, [users]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingUserId, setEditingUserId] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
    avatar: AVATAR_PRESETS[0]
  });

  const [formErrors, setFormErrors] = useState({});

  // Ref for hidden avatar file input
  const avatarInputRef = useRef(null);

  // Handle local avatar image upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatar: objectUrl }));
  };

  // Search and Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Open modal for adding a new user
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      role: 'User',
      status: 'Active',
      avatar: AVATAR_PRESETS[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing an existing user
  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Username is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === 'add') {
      const newUser = {
        id: Date.now(), // Generate a unique numerical ID
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar
      };
      setUsers([newUser, ...users]);
    } else if (modalMode === 'edit') {
      setUsers(
        users.map((user) => 
          user.id === editingUserId 
            ? { ...user, ...formData } 
            : user
        )
      );
    }
    handleCloseModal();
  };

  // Delete User
  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <>
      <div className="users-container">
      {/* Header section */}
      <div className="users-page-header">
        <div>
          <h1>User Management</h1>
          <p>Add, edit, filter, or delete users in your system.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters and search panel */}
      <div className="users-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-input-icon" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-selects">
          {/* Role Filter */}
          <select 
            className="filter-dropdown"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="User">User</option>
          </select>
          {/* Status Filter */}
          <select 
            className="filter-dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users table card */}
      <div className="users-table-card">
        {filteredUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  {/* Avatar and name */}
                  <td>
                    <div className="user-identity">
                      <img src={user.avatar} alt={user.name} className="user-avatar-circle" />
                      <div className="user-details">
                        <span className="user-name-text">{user.name}</span>
                        <span className="user-email-text">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>
                  {/* Status badge */}
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  {/* Action buttons */}
                  <td>
                    <div className="table-actions-wrapper">
                      <button 
                        className="action-icon-btn edit-btn"
                        onClick={() => handleOpenEditModal(user)}
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-icon-btn delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-table-state">
            <UsersIcon size={48} />
            <h3>No users found</h3>
            <p>Try adjusting your search criteria or add a new user.</p>
          </div>
        )}
      </div>

      </div>

      {/* Add / Edit modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header-section">
              <h2>{modalMode === 'add' ? 'Add New User' : 'Edit User Info'}</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div className="modal-form-body">
                {/* Name */}
                <div className="form-group-field">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    className="form-input-field" 
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group-field">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    className="form-input-field" 
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {formErrors.email && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.email}</span>
                  )}
                </div>

                {/* Role and Status (grid side-by-side) */}
                <div className="form-grid-two-col">
                  <div className="form-group-field">
                    <label htmlFor="role">System Role</label>
                    <select 
                      id="role"
                      className="form-input-field"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div className="form-group-field">
                    <label htmlFor="status">Account Status</label>
                    <select 
                      id="status"
                      className="form-input-field"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Avatar presets selection */}
                <div className="form-group-field">
                  <label>Profile Photo</label>
                  <div className="avatar-preset-selector">
                    {AVATAR_PRESETS.map((avatarUrl, idx) => (
                      <img 
                        key={idx}
                        src={avatarUrl}
                        alt={`Preset ${idx + 1}`}
                        className={`avatar-preset-option ${formData.avatar === avatarUrl ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, avatar: avatarUrl })}
                      />
                    ))}
                    {/* Show uploaded image as selectable option if it's a blob URL */}
                    {formData.avatar && formData.avatar.startsWith('blob:') && (
                      <img
                        src={formData.avatar}
                        alt="Uploaded"
                        className="avatar-preset-option selected"
                      />
                    )}
                  </div>

                  {/* Upload from device button */}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                  />
                  <button
                    type="button"
                    className="upload-local-btn"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Upload from device</span>
                  </button>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="modal-actions-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
