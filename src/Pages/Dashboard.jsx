import React, { useState } from 'react';
import { DollarSign, Users, ShoppingBag, Percent,  TrendingUp,  TrendingDown,  Download,  ArrowUpRight, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import './Dashboard.css';
import avatar2 from '../assets/images/avatar2.png';
import avatar3 from '../assets/images/avatar3.png';
import avatar4 from '../assets/images/avatar4.png';
import avatar6 from '../assets/images/avatar6.png';

// Mock Data
const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 5500, expenses: 3000 },
  { month: 'Mar', revenue: 7800, expenses: 4500 },
  { month: 'Apr', revenue: 7200, expenses: 4000 },
  { month: 'May', revenue: 9500, expenses: 5800 },
  { month: 'Jun', revenue: 12000, expenses: 6200 },
];

const categoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Fashion', value: 25 },
  { name: 'Home & Kitchen', value: 15 },
  { name: 'Beauty', value: 10 },
  { name: 'Sports', value: 5 },
];

const salesData = [
  { name: 'Mon', sales: 120 },
  { name: 'Tue', sales: 190 },
  { name: 'Wed', sales: 320 },
  { name: 'Thu', sales: 250 },
  { name: 'Fri', sales: 410 },
  { name: 'Sat', sales: 380 },
  { name: 'Sun', sales: 220 },
];

const PIE_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

const recentTransactions = [
  {
    id: 'TX8921',
    user: {
      name: 'Yara Ali',
      email: 'yara@example.com',
      avatar: avatar2
    },
    date: 'May 24, 2026',
    amount: '$350.00',
    status: 'Completed'
  },
  {
    id: 'TX8922',
    user: {
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      avatar: avatar4
    },
    date: 'May 23, 2026',
    amount: '$1,200.50',
    status: 'Pending'
  },
  {
    id: 'TX8923',
    user: {
      name: 'Sarah yaser',
      email: 'sarah@example.com',
      avatar: avatar3
    },
    date: 'May 22, 2026',
    amount: '$89.90',
    status: 'Completed'
  },
  {
    id: 'TX8924',
    user: {
      name: 'Moustafa Samir',
      email: 'moustafa@example.com',
      avatar: avatar6
    },
    date: 'May 21, 2026',
    amount: '$450.00',
    status: 'Failed'
  }
];

export default function Dashboard({ theme }) {
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeIndex, setActiveIndex] = useState(null);

  // Chart styling colors based on theme
  const isLight = theme === 'light';
  const gridColor = isLight ? '#e2e8f0' : '#1e293b';
  const axisColor = '#64748b';
  
  // Custom Tooltip component for Area and Bar Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-label">{label}</div>
          {payload.map((item, index) => (
            <div key={index} className="tooltip-value-item">
              <span 
                className="tooltip-indicator" 
                style={{ backgroundColor: item.color || item.fill }}
              />
              <span>{item.name}: {item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-page-header">
        <div className="header-text">
          <h1>Dashboard Overview</h1>
          <p>Real-time analytics and system metrics summary.</p>
        </div>
        <div className="header-actions-btn">
          <button className="btn-primary">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        {/* KPI 1 */}
        <div className="kpi-card animate-fade-in-up delay-1">
          <div className="kpi-card-header">
            <span className="kpi-title">Total Revenue</span>
            <div className="kpi-icon-wrapper">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-value">$48,259.50</div>
            <div className="kpi-trend upward">
              <TrendingUp size={14} />
              <span>+12.5%</span>
              <span className="kpi-trend-period">from last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="kpi-card animate-fade-in-up delay-2">
          <div className="kpi-card-header">
            <span className="kpi-title">Active Users</span>
            <div className="kpi-icon-wrapper">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-value">10,249</div>
            <div className="kpi-trend upward">
              <TrendingUp size={14} />
              <span>+8.2%</span>
              <span className="kpi-trend-period">from last month</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="kpi-card animate-fade-in-up delay-3">
          <div className="kpi-card-header">
            <span className="kpi-title">Active Orders</span>
            <div className="kpi-icon-wrapper">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-value">1,482</div>
            <div className="kpi-trend downward">
              <TrendingDown size={14} />
              <span>-2.1%</span>
              <span className="kpi-trend-period">from last month</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="kpi-card animate-fade-in-up delay-4">
          <div className="kpi-card-header">
            <span className="kpi-title">Conversion Rate</span>
            <div className="kpi-icon-wrapper">
              <Percent size={20} />
            </div>
          </div>
          <div className="kpi-card-body">
            <div className="kpi-value">3.42%</div>
            <div className="kpi-trend upward">
              <TrendingUp size={14} />
              <span>+4.8%</span>
              <span className="kpi-trend-period">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Layout */}
      <div className="charts-grid-main animate-fade-in-up delay-3">
        {/* Revenue Area Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Revenue vs Expenses</h3>
              <p>Performance analytics over time</p>
            </div>
            <select 
              className="chart-select"
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke={axisColor} 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke={axisColor} 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={20} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
                />
                <Area 
                  type="monotone" 
                  name="Revenue" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  name="Expenses" 
                  dataKey="expenses" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut/Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Sales by Category</h3>
              <p>Top performing sectors</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={1500}
                  stroke="none"
                  onClick={(_, index) =>
                    setActiveIndex(prev => prev === index ? null : index)
                  }
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      outerRadius={activeIndex === index ? 102 : 90}
                      fill={
                        activeIndex === null || activeIndex === index
                          ? PIE_COLORS[index % PIE_COLORS.length]
                          : '#d1d5db'
                      }
                      stroke="none"
                      style={{ outline: 'none', transition: 'outerRadius 0.3s ease' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: isLight ? '#e2e8f0' : '#1e293b',
                    borderRadius: 10,
                    color: isLight ? '#0f172a' : '#f8fafc'
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Row: Weekly Sales & Recent Activity */}
      <div className="secondary-charts-grid animate-fade-in-up delay-4">
        {/* Weekly Sales (Bar Chart) */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Weekly Order Activity</h3>
              <p>Volume of incoming orders</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke={axisColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke={axisColor} 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sales" 
                  name="Orders"
                  fill="#a855f7" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1500}
                >
                  {salesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? '#a855f7' : '#6366f1'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="dashboard-table-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Recent Transactions</h3>
              <p>Latest payments and orders received</p>
            </div>
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <ArrowUpRight size={16} />
              <span>View All</span>
            </button>
          </div>

          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="user-cell">
                        <img src={tx.user.avatar} alt={tx.user.name} className="user-cell-img" />
                        <div className="user-cell-info">
                          <span className="user-cell-name">{tx.user.name}</span>
                          <span className="user-cell-email">{tx.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{tx.date}</td>
                    <td><strong style={{ fontWeight: 600 }}>{tx.amount}</strong></td>
                    <td>
                      <span className={`status-badge ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
