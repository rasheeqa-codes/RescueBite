import DonorProfile from './DonorProfile.jsx';
import CollectionHistory from './CollectionHistory.jsx';
import AddDonation from '../donations/AddDonation.jsx';
import MyDonations from './MyDonations.jsx';
import IncomingRequests from './IncomingRequests.jsx';
import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import API from '../../services/api.js';
import {
  Leaf, LayoutDashboard, PlusCircle, Package, ClipboardList,
  History, UserRound, LogOut, Bell, Search, Clock,
  CheckCircle2, Menu, X, Utensils, CalendarDays, ArrowUpRight,
  HeartHandshake
} from 'lucide-react';

function DonorDashboard({ onLogout }) {
  const { showToast } = useToast();
  const [dashboardStats, setDashboardStats] = useState({
    totalDonations: 0,
    availableFood: 0,
    pendingRequests: 0,
    completed: 0
  });

  const [recentDonations, setRecentDonations] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [donationsResponse, requestsResponse] = await Promise.all([
          API.get('/donations/my-donations'),
          API.get('/requests/incoming')
        ]);

        const donations = donationsResponse.data.donations || [];
        const requests = requestsResponse.data.requests || [];

        // Calculate dashboard statistics
        setDashboardStats({
          totalDonations: donations.length,

          availableFood: donations.filter(
            (item) => item.status === 'Available'
          ).length,

          pendingRequests: requests.filter(
            (item) => item.status === 'Pending'
          ).length,

          completed: donations.filter(
            (item) => item.status === 'Collected'
          ).length
        });
                // Get the three most recent donations
        const sortedDonations = [...donations].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRecentDonations(
          sortedDonations.slice(0, 3).map((item) => ({
            id: item._id,
            name: item.foodName,
            quantity: `${item.quantity} ${item.unit}`,
            date: new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            status: item.status
          }))
        );
                // Get the three most recent incoming requests
        const sortedRequests = [...requests].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setIncomingRequests(
          sortedRequests.slice(0, 3).map((item) => {
            const ngoName =
              item.ngo?.organizationName ||
              item.ngo?.fullName ||
              'NGO';

            return {
              id: item._id,
              organisation: ngoName,
              food: item.donation?.foodName || 'Food Donation',
              quantity: `${item.requestedQuantity} ${
                item.donation?.unit || ''
              }`.trim(),
              initials: ngoName.substring(0, 2).toUpperCase(),
              status: item.status
            };
          })
        );

      } catch (err) {
        console.error('Dashboard Fetch Error:', err);

        setError(
          err.response?.data?.message ||
          'Unable to load dashboard data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const [activePage, setActivePage] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const today = new Date();

const formattedDate = today
  .toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  .toUpperCase();
  const handleAddDonation = async (data) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value ?? '');
      }
    });

    const response = await API.post('/donations', formData);

    showToast(
  response.data.message || 'Food donation added successfully!',
  'success'
);

    setActivePage('Overview');

    return true;

  } catch (error) {
    showToast(
  error.response?.data?.message ||
  'Failed to add donation. Please try again.',
  'error'
);

    return false;
  }
};
  const navigation = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Add Food Donation', icon: PlusCircle },
    { name: 'My Donations', icon: Package },
    { name: 'Incoming Requests', icon: ClipboardList },
    { name: 'Collection History', icon: History },
    { name: 'My Profile', icon: UserRound },
  ];

  const stats = [
  {
    title: 'Total Donations',
    value: dashboardStats.totalDonations,
    icon: Package,
    color: 'green'
  },
  {
    title: 'Available Food',
    value: dashboardStats.availableFood,
    icon: Utensils,
    color: 'orange'
  },
  {
    title: 'Pending Requests',
    value: dashboardStats.pendingRequests,
    icon: Clock,
    color: 'blue'
  },
  {
    title: 'Completed',
    value: dashboardStats.completed,
    icon: CheckCircle2,
    color: 'purple'
  },
];

  const donations = recentDonations;

 const requests = incomingRequests;

  return (
    <div className="donor-layout">

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`donor-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

        <div className="donor-brand">
          <div className="donor-brand-icon"><Leaf size={23} /></div>
          <span>Rescue<span>Bite</span></span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="donor-account">
          <div className="account-avatar">FD</div>
          <div>
            <strong>Food Donor</strong>
            <small>Donor Account</small>
          </div>
        </div>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="donor-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`donor-nav-item ${activePage === item.name ? 'active' : ''}`}
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

        <div className="sidebar-bottom">
          <div className="sidebar-message">
            <HeartHandshake size={23} />
            <strong>Make every meal count!</strong>
            <p>Your contribution can make someone's day better.</p>
          </div>

          <button className="donor-logout" onClick={onLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="donor-main">

        <header className="donor-topbar">
          <button className="mobile-menu-button" onClick={() => setSidebarOpen(true)}>
            <Menu size={23} />
          </button>

          <div className="topbar-search">
            <Search size={18} />
            <input type="text" placeholder="Search donations..." />
          </div>

          <div className="topbar-right">
            <button className="notification-button">
              <Bell size={20} />
              <span />
            </button>

            <div className="topbar-profile">
              <div className="small-avatar">FD</div>
              <div>
                <strong>Food Donor</strong>
                <small>Donor</small>
              </div>
            </div>
          </div>
        </header>

        <div className="donor-content">
          {activePage === 'Add Food Donation' ? (
  <AddDonation
  onBack={() => setActivePage('Overview')}
  onSubmit={handleAddDonation}
/>
) : activePage === 'My Donations' ? (
  <MyDonations
    onAddDonation={() => setActivePage('Add Food Donation')}
  />
) : activePage === 'Incoming Requests' ? (
  <IncomingRequests />
) : activePage === 'Collection History' ? (
  <CollectionHistory />
) : activePage === 'My Profile' ? (
  <DonorProfile onSave={() => setActivePage('Overview')} />
) : (
  <>

          <div className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">{formattedDate}</p>
              <h1>Welcome back, Food Donor! 👋</h1>
              <p>Here's what's happening with your food donations today.</p>
            </div>

            <button
              className="add-donation-button"
              onClick={() => setActivePage('Add Food Donation')}
            >
              <PlusCircle size={19} /> Add New Donation
            </button>
          </div>

          <section className="donor-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div className="donor-stat-card" key={stat.title}>
                  <div className={`stat-icon ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                  <small>Donation overview</small>
                </div>
              );
            })}
          </section>

          <section className="donor-section">
            <div className="section-top">
              <div>
                <h2>Recent Donations</h2>
                <p>Track the food you have shared.</p>
              </div>

              <button onClick={() => setActivePage('My Donations')}>
                View All <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="donation-table-wrapper">
              <table className="donation-table">
  <thead>
    <tr>
      <th>Food Item</th>
      <th>Quantity</th>
      <th>Listed Date</th>
      <th>Status</th>
    </tr>
  </thead>

  <tbody>
    {loading && (
      <tr>
        <td colSpan="4">Loading donations...</td>
      </tr>
    )}

    {!loading && error && (
      <tr>
        <td colSpan="4">{error}</td>
      </tr>
    )}

    {!loading && !error && donations.map((item) => (
      <tr key={item.id}>
        <td>
          <div className="food-name">
            <div className="food-icon">
              <Utensils size={17} />
            </div>
            {item.name}
          </div>
        </td>

        <td>{item.quantity}</td>

        <td>
          <CalendarDays size={15} /> {item.date}
        </td>

        <td>
          <span className={`donation-status ${item.status.toLowerCase()}`}>
            {item.status}
          </span>
        </td>
      </tr>
    ))}

    {!loading && !error && donations.length === 0 && (
      <tr>
        <td colSpan="4">No donations available.</td>
      </tr>
    )}
  </tbody>
</table>
            </div>
          </section>

          <section className="donor-section">
            <div className="section-top">
              <div>
                <h2>Incoming Requests</h2>
                <p>NGOs interested in your food donations.</p>
              </div>

              <button onClick={() => setActivePage('Incoming Requests')}>
                View All <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="request-list">

  {loading && <p>Loading incoming requests...</p>}

  {!loading && error && <p>{error}</p>}

  {!loading && !error && requests.length === 0 && (
    <p>No incoming requests yet.</p>
  )}

  {!loading && !error && requests.map((request) => (
  <div className="request-card" key={request.id}>
                  <div className="request-avatar">{request.initials}</div>

                  <div className="request-details">
                    <strong>{request.organisation}</strong>
                    <p>{request.food} · {request.quantity}</p>
                  </div>

                  <button
                    className="review-request"
                    onClick={() => setActivePage('Incoming Requests')}
                  >
                    Review Request
                  </button>
                </div>
              ))}
            </div>
          </section>

          <footer className="donor-footer">
            <p>© 2026 RescueBite. Reducing food waste, one meal at a time.</p>
          </footer>
            </>
)}

        </div>
      </main>
    </div>
  );
}

export default DonorDashboard;