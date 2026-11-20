import { useState, useEffect } from 'react';
import API from '../../services/api';

import ManageDonors from './ManageDonors.jsx';
import ManageNGOs from './ManageNGOs.jsx';
import ManageDonations from './ManageDonations.jsx';
import ManageRequests from './ManageRequests.jsx';
import ReportsAnalytics from './ReportsAnalytics.jsx';

import {
  Leaf,
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ClipboardList,
  ChartNoAxesCombined,
  LogOut,
  Bell,
  Menu,
  X,
  Clock,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

function AdminDashboard({ onLogout }) {

  const [activePage, setActivePage] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Manage Donors', icon: Users },
    { name: 'Manage NGOs', icon: Building2 },
    { name: 'Manage Donations', icon: Package },
    { name: 'Manage Requests', icon: ClipboardList },
    { name: 'Reports & Analytics', icon: ChartNoAxesCombined },
  ];

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/admin/stats');

      setStats(response.data.stats);

      // Recent activities will be connected separately
      setActivities([]);

    } catch (err) {
      console.error('Admin dashboard error:', err);

      setError(
        err.response?.data?.message ||
        'Unable to load dashboard statistics.'
      );

    } finally {
      setLoading(false);
    }
  };

  // Dashboard statistic cards
  const statCards = stats ? [
    {
      title: 'Total Donors',
      value: stats.totalDonors,
      description: 'Registered food donors',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Registered NGOs',
      value: stats.totalNGOs,
      description: 'Partner organisations',
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Total Donations',
      value: stats.totalDonations,
      description: 'Food donations listed',
      icon: Package,
      color: 'orange'
    },
    {
      title: 'Completed Collections',
      value: stats.completedCollections,
      description: 'Successful collections',
      icon: CheckCircle2,
      color: 'purple'
    }
  ] : [];

  return (
    <div className="admin-dashboard">

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Leaf size={23} />
          </div>

          <div>
            <h2>RescueBite</h2>
            <span>Administration Portal</span>
          </div>

          <button
            className="admin-close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-account">
          <div className="admin-account-avatar">AD</div>
          <div>
            <strong>Platform Admin</strong>
            <span>Administrator</span>
          </div>
        </div>

        <p className="admin-menu-label">ADMIN MENU</p>

        <nav className="admin-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`admin-nav-item ${
                  activePage === item.name ? 'active' : ''
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-logout-button"
            onClick={onLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      <main className="admin-main">

        <header className="admin-topbar">

          <button
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="admin-breadcrumb">
            <span>Admin Portal</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="admin-topbar-actions">
            <button className="admin-notification-button">
              <Bell size={19} />
              <span></span>
            </button>

            <div className="admin-topbar-avatar">AD</div>
          </div>

        </header>

        <div className="admin-content">

          {activePage === 'Overview' ? (

            <>

              <div className="admin-welcome-section">
                <div>
                  <p className="form-eyebrow">ADMINISTRATION PORTAL</p>
                  <h1>Welcome, Administrator!</h1>
                  <p>
                    Monitor platform activities and manage the
                    RescueBite food redistribution network.
                  </p>
                </div>

                <div className="admin-welcome-icon">
                  <HeartHandshake size={34} />
                </div>
              </div>

              {/* Statistics */}

              {loading ? (

                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <p>Loading dashboard statistics...</p>
                  </div>
                </div>

              ) : error ? (

                <div className="admin-stat-card">
                  <div>
                    <p style={{ color: '#ef4444' }}>{error}</p>

                    <button
                      onClick={fetchDashboardData}
                      style={{
                        marginTop: '12px',
                        padding: '8px 14px',
                        border: 'none',
                        borderRadius: '7px',
                        background: '#2563eb',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Retry
                    </button>
                  </div>
                </div>

              ) : (

                <div className="admin-stats-grid">

                  {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div className="admin-stat-card" key={stat.title}>
                        <div className={`admin-stat-icon ${stat.color}`}>
                          <Icon size={21} />
                        </div>

                        <div>
                          <span>{stat.title}</span>
                          <h2>{stat.value}</h2>
                          <small>{stat.description}</small>
                        </div>
                      </div>
                    );
                  })}

                </div>

              )}

              {/* Recent Activity */}

              <div className="admin-section-heading">
                <div>
                  <h2>Recent Platform Activity</h2>
                  <p>Latest activities across RescueBite.</p>
                </div>
              </div>

              <div className="admin-activity-list">

                {activities.length > 0 ? (

                  activities.map((activity, index) => (

                    <div className="admin-activity-card" key={index}>

                      <div className="admin-activity-icon">
                        <Clock size={19} />
                      </div>

                      <div className="admin-activity-info">
                        <h3>{activity.title}</h3>
                        <p>{activity.description}</p>
                      </div>

                      <span>{activity.time}</span>

                    </div>

                  ))

                ) : (

                  <div className="admin-activity-card">
                    <div className="admin-activity-icon">
                      <Clock size={19} />
                    </div>

                    <div className="admin-activity-info">
                      <h3>No recent activity available</h3>
                      <p>Platform activities will appear here.</p>
                    </div>
                  </div>

                )}

              </div>

            </>

          ) : activePage === 'Manage Donors' ? (

            <ManageDonors />

          ) : activePage === 'Manage NGOs' ? (

            <ManageNGOs />

          ) : activePage === 'Manage Donations' ? (

            <ManageDonations />

          ) : activePage === 'Manage Requests' ? (

            <ManageRequests />

          ) : activePage === 'Reports & Analytics' ? (

            <ReportsAnalytics />

          ) : (

            <div className="admin-coming-soon">
              <div>
                <Package size={32} />
              </div>

              <h2>{activePage}</h2>

              <p>
                This module will be developed next.
              </p>
            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;