import React, { useState } from 'react';
import { Users, Eye, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Analytics.css';

// ─── Mock Data ────────────────────────────────────────────
const sessionData7 = [
  { day: 'Mon', sessions: 1240, pageviews: 3800 },
  { day: 'Tue', sessions: 1800, pageviews: 5200 },
  { day: 'Wed', sessions: 1550, pageviews: 4600 },
  { day: 'Thu', sessions: 2100, pageviews: 6300 },
  { day: 'Fri', sessions: 2480, pageviews: 7400 },
  { day: 'Sat', sessions: 1950, pageviews: 5800 },
  { day: 'Sun', sessions: 1420, pageviews: 4100 },
];

const sessionData30 = [
  { day: 'W1', sessions: 8200, pageviews: 24000 },
  { day: 'W2', sessions: 9500, pageviews: 28000 },
  { day: 'W3', sessions: 11200, pageviews: 33000 },
  { day: 'W4', sessions: 13800, pageviews: 41000 },
];

const sessionDataYear = [
  { day: 'Jan', sessions: 32000, pageviews: 94000 },
  { day: 'Feb', sessions: 38000, pageviews: 112000 },
  { day: 'Mar', sessions: 45000, pageviews: 134000 },
  { day: 'Apr', sessions: 42000, pageviews: 126000 },
  { day: 'May', sessions: 58000, pageviews: 174000 },
  { day: 'Jun', sessions: 71000, pageviews: 213000 },
  { day: 'Jul', sessions: 68000, pageviews: 204000 },
  { day: 'Aug', sessions: 74000, pageviews: 222000 },
  { day: 'Sep', sessions: 82000, pageviews: 246000 },
  { day: 'Oct', sessions: 79000, pageviews: 237000 },
  { day: 'Nov', sessions: 91000, pageviews: 273000 },
  { day: 'Dec', sessions: 105000, pageviews: 315000 },
];

const channelData = [
  { name: 'Organic', value: 4820, fill: '#6366f1' },
  { name: 'Referral', value: 2940, fill: '#a855f7' },
  { name: 'Social', value: 2130, fill: '#ec4899' },
  { name: 'Direct', value: 1760, fill: '#10b981' },
  { name: 'Email', value: 920, fill: '#f59e0b' },
];

const deviceData = [
  { name: 'Mobile', value: 58 },
  { name: 'Desktop', value: 32 },
  { name: 'Tablet', value: 10 },
];

const DEVICE_COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const topPages = [
  { page: '/dashboard', views: 14820, bounce: '22%', time: '3m 48s' },
  { page: '/products', views: 9340, bounce: '35%', time: '2m 15s' },
  { page: '/orders', views: 7210, bounce: '28%', time: '4m 02s' },
  { page: '/users', views: 5680, bounce: '31%', time: '1m 55s' },
  { page: '/analytics', views: 4120, bounce: '18%', time: '5m 20s' },
];

const RANGES = ['7 Days', '30 Days', '1 Year'];

export default function Analytics({ theme }) {
  const [range, setRange] = useState('7 Days');
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(null);

  const data =
    range === '7 Days' ? sessionData7 :
    range === '30 Days' ? sessionData30 : sessionDataYear;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="a-tooltip">
          <div className="a-tooltip-label">{label}</div>
          {payload.map((item, i) => (
            <div key={i} className="a-tooltip-row">
              <span className="a-tooltip-dot" style={{ background: item.color }} />
              <span>{item.name}: <strong>{item.value.toLocaleString()}</strong></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Comprehensive performance insights and traffic analytics.</p>
        </div>
        <div className="a-range-tabs">
          {RANGES.map(r => (
            <button
              key={r}
              className={`a-range-btn ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="a-kpi-grid">
        <div className="a-kpi-card">
          <div className="a-kpi-inner">
            <div className="a-kpi-icon icon-indigo"><Users size={18} /></div>
            <div>
              <div className="a-kpi-value">84,291</div>
              <div className="a-kpi-label">Total Sessions</div>
            </div>
          </div>
          <div className="a-kpi-trend up"><TrendingUp size={13} /> +12.4%</div>
        </div>
        <div className="a-kpi-card">
          <div className="a-kpi-inner">
            <div className="a-kpi-icon icon-purple"><Eye size={18} /></div>
            <div>
              <div className="a-kpi-value">253,870</div>
              <div className="a-kpi-label">Total Pageviews</div>
            </div>
          </div>
          <div className="a-kpi-trend up"><TrendingUp size={13} /> +8.7%</div>
        </div>
        <div className="a-kpi-card">
          <div className="a-kpi-inner">
            <div className="a-kpi-icon icon-pink"><Globe size={18} /></div>
            <div>
              <div className="a-kpi-value">28.4%</div>
              <div className="a-kpi-label">Bounce Rate</div>
            </div>
          </div>
          <div className="a-kpi-trend down"><TrendingDown size={13} /> -3.1%</div>
        </div>
        <div className="a-kpi-card">
          <div className="a-kpi-inner">
            <div className="a-kpi-icon icon-green"><TrendingUp size={18} /></div>
            <div>
              <div className="a-kpi-value">3m 24s</div>
              <div className="a-kpi-label">Avg. Session Duration</div>
            </div>
          </div>
          <div className="a-kpi-trend up"><TrendingUp size={13} /> +0.8%</div>
        </div>
      </div>

      {/* Main Chart: Sessions & Pageviews */}
      <div className="a-chart-card a-chart-wide">
        <div className="a-chart-header">
          <div>
            <h3>Sessions & Pageviews</h3>
            <p>User engagement over {range.toLowerCase()}</p>
          </div>
        </div>
        <div className="a-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" name="Sessions" dataKey="sessions" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradSessions)" animationDuration={1500} />
              <Area type="monotone" name="Pageviews" dataKey="pageviews" stroke="#a855f7" strokeWidth={2.5} fill="url(#gradViews)" animationDuration={1800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: Channels + Device Pie */}
      <div className="a-bottom-grid">
        {/* Acquisition Channels Bar */}
        <div className="a-chart-card">
          <div className="a-chart-header">
            <div>
              <h3>Traffic Channels</h3>
              <p>Sessions by acquisition source</p>
            </div>
          </div>
          <div className="a-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Sessions" radius={[6, 6, 0, 0]} animationDuration={1400}>
                  {channelData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown Donut */}
        <div className="a-chart-card">
          <div className="a-chart-header">
            <div>
              <h3>Device Breakdown</h3>
              <p>Share of visits by device type</p>
            </div>
          </div>
          <div className="a-chart-wrapper a-pie-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={1500}
                  stroke="none"
                  onClick={(_, idx) =>
                    setActiveDeviceIndex(prev => prev === idx ? null : idx)
                  }
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  {deviceData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      outerRadius={activeDeviceIndex === idx ? 100 : 88}
                      fill={
                        activeDeviceIndex === null || activeDeviceIndex === idx
                          ? DEVICE_COLORS[idx]
                          : '#d1d5db'
                      }
                      stroke="none"
                      style={{ outline: 'none', transition: 'outerRadius 0.3s ease' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(v, n) => [`${v}%`, n]} 
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#ffffff' : '#0f172a',
                    borderColor: theme === 'light' ? '#e2e8f0' : '#1e293b',
                    borderRadius: 10,
                    color: theme === 'light' ? '#0f172a' : '#f8fafc'
                  }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="a-device-legend">
            {deviceData.map((d, i) => (
              <div key={i} className="a-device-row">
                <div className="a-device-dot" style={{ background: DEVICE_COLORS[i] }} />
                <span className="a-device-label">{d.name}</span>
                <span className="a-device-val">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="a-table-card">
        <div className="a-table-header">
          <div>
            <h3>Top Pages</h3>
            <p>Most visited pages during the selected period</p>
          </div>
        </div>
        <div className="a-table-responsive">
          <table className="a-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
                <th>Bounce Rate</th>
                <th>Avg. Time</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((row, i) => (
                <tr key={i}>
                  <td><span className="a-page-path">{row.page}</span></td>
                  <td><strong>{row.views.toLocaleString()}</strong></td>
                  <td>
                    <span className={`a-bounce-badge ${parseFloat(row.bounce) < 25 ? 'low' : parseFloat(row.bounce) > 32 ? 'high' : 'mid'}`}>
                      {row.bounce}
                    </span>
                  </td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
