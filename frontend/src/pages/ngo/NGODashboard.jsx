import { useState } from 'react';
import BrowseFood from './BrowseFood.jsx';
import MyRequests from './MyRequests.jsx';
import NGOCollectionHistory from './CollectionHistory.jsx';
import NGOProfile from './NGOProfile.jsx';
import {
  Leaf,
  LayoutDashboard,
  Search,
  ClipboardList,
  History,
  UserRound,
  LogOut,
  Bell,
  Menu,
  X,
  Package,
  Clock,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  ArrowUpRight
} from 'lucide-react';

function NGODashboard({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const organizationName = user.organizationName || user.fullName || 'NGO';
  const initials = organizationName.substring(0, 2).toUpperCase();

  const [activePage, setActivePage] = useState('Overview');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Browse Food', icon: Search },
    { name: 'My Requests', icon: ClipboardList },
    { name: 'Collection History', icon: History },
    { name: 'My Profile', icon: UserRound },
  ];

  const stats = [
    {
      title: 'Available Donations',
      value: '24',
      description: 'Food donations listed',
      icon: Package,
      color: 'green'
    },
    {
      title: 'Active Requests',
      value: '08',
      description: 'Requests awaiting updates',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Approved Requests',
      value: '12',
      description: 'Ready for collection',
      icon: CheckCircle2,
      color: 'blue'
    },
    {
      title: 'Food Collected',
      value: '156',
      description: 'Total food items collected',
      icon: HeartHandshake,
      color: 'purple'
    }
  ];

  const recentDonations = [
    {
      id: 'DON001',
      food: 'Vegetable Rice',
      donor: 'Green Harvest Foundation',
      quantity: '20 Packs',
      location: 'Coimbatore',
      status: 'Available'
    },
    {
      id: 'DON002',
      food: 'Fresh Bread',
      donor: 'Sunrise Bakery',
      quantity: '30 Pieces',
      location: 'Kuniyamuthur',
      status: 'Available'
    },
    {
      id: 'DON003',
      food: 'Fresh Vegetables',
      donor: 'Farm Fresh Suppliers',
      quantity: '15 Kg',
      location: 'Ukkadam',
      status: 'Available'
    }
  ];

  return (
    <div className="ngo-dashboard">

      {sidebarOpen && (
        <div
          className="ngo-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`ngo-sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="ngo-brand">
          <div className="ngo-brand-icon">
            <Leaf size={23} />
          </div>

          <div>
            <h2>RescueBite</h2>
            <span>Food Rescue Platform</span>
          </div>

          <button
            className="ngo-close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="ngo-account">
          <div className="ngo-account-avatar">{initials}</div>
<div>
  <strong>{organizationName}</strong>
            <span>NGO / Receiver</span>
          </div>
        </div>

        <p className="ngo-menu-label">MAIN MENU</p>

        <nav className="ngo-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`ngo-nav-item ${
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

        <div className="ngo-sidebar-bottom">
          <button
            className="ngo-logout-button"
            onClick={onLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      <main className="ngo-main">

        <header className="ngo-topbar">

          <button
            className="ngo-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="ngo-breadcrumb">
            <span>NGO Portal</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="ngo-topbar-actions">
            <button className="ngo-notification-button">
              <Bell size={19} />
              <span></span>
            </button>

            <div className="ngo-topbar-avatar">{initials}</div>
          </div>

        </header>

        <div className="ngo-content">

          {activePage === 'Overview' ? (

            <>

              <div className="ngo-welcome-section">
                <div>
                  <p className="form-eyebrow">NGO / RECEIVER PORTAL</p>
                  <h1>Welcome back, {organizationName}!</h1>
                  <p>
                    Discover surplus food and help reduce food waste
                    in your community.
                  </p>
                </div>

                <div className="ngo-welcome-icon">
                  <HeartHandshake size={34} />
                </div>
              </div>

              <div className="ngo-stats-grid">

                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div className="ngo-stat-card" key={stat.title}>
                      <div className={`ngo-stat-icon ${stat.color}`}>
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

              <div className="ngo-section-heading">
                <div>
                  <h2>Recently Available Donations</h2>
                  <p>Explore food donations available for collection.</p>
                </div>

                <button
                  onClick={() => setActivePage('Browse Food')}
                >
                  Browse All <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="ngo-donation-list">

                {recentDonations.map((donation) => (

                  <div className="ngo-donation-card" key={donation.id}>

                    <div className="ngo-donation-icon">
                      <Package size={23} />
                    </div>

                    <div className="ngo-donation-info">
                      <h3>{donation.food}</h3>
                      <p>{donation.donor}</p>

                      <div className="ngo-donation-meta">
                        <span>
                          <Package size={14} />
                          {donation.quantity}
                        </span>

                        <span>
                          <MapPin size={14} />
                          {donation.location}
                        </span>
                      </div>
                    </div>

                    <span className="ngo-available-status">
                      {donation.status}
                    </span>

                  </div>

                ))}

              </div>

              <div className="ngo-impact-banner">
                <div>
                  <HeartHandshake size={27} />
                </div>

                <section>
                  <h3>Every Meal Makes a Difference!</h3>
                  <p>
                    Your organisation is helping redirect surplus food
                    to people who need it.
                  </p>
                </section>
              </div>

            </>

                    ) : activePage === 'Browse Food' ? (

            <BrowseFood />

          ) : activePage === 'My Requests' ? (

            <MyRequests />

          ) : activePage === 'Collection History' ? (

            <NGOCollectionHistory />

          ) : activePage === 'My Profile' ? (

  <NGOProfile onSave={() => setActivePage('Overview')} />

) : null}
        </div>

      </main>

    </div>
  );
}

export default NGODashboard;