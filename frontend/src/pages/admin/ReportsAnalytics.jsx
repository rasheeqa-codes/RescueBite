import { useEffect, useState } from 'react';
import API from '../../services/api';

import {
  ChartNoAxesCombined,
  Users,
  Building2,
  Package,
  Heart,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Utensils
} from 'lucide-react';

function ReportsAnalytics() {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/admin/reports');

      setAnalytics(response.data.analytics);

    } catch (err) {
      console.error('Reports analytics error:', err);

      setError(
        err.response?.data?.message ||
        'Unable to load reports and analytics.'
      );

    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="reports-analytics-page">
        <div className="admin-page-heading">
          <div>
            <h2>Reports & Analytics</h2>
            <p>Track platform performance and food redistribution impact.</p>
          </div>
        </div>

        <div className="reports-chart-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading analytics from database...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !analytics) {
    return (
      <div className="reports-analytics-page">
        <div className="admin-page-heading">
          <div>
            <h2>Reports & Analytics</h2>
            <p>Track platform performance and food redistribution impact.</p>
          </div>
        </div>

        <div className="reports-chart-card" style={{ padding: '30px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '15px' }}>
            {error || 'Analytics data unavailable.'}
          </p>

          <button
            onClick={fetchReports}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              background: '#2563eb',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    stats,
    monthlyDonations,
    donationStatuses,
    topNGOs,
    year
  } = analytics;

  // Monthly chart maximum
  const maxMonthlyDonations = Math.max(
    ...monthlyDonations.map(item => item.count),
    1
  );

  // Donation status colors
  const getStatusColor = (status) => {
    const colors = {
      'Collected': '#16a34a',
      'Available': '#3b82f6',
      'Partially Requested': '#f59e0b',
      'Requested': '#8b5cf6',
      'Expired': '#ef4444'
    };

    return colors[status] || '#64748b';
  };

  return (
    <div className="reports-analytics-page">

      <div className="admin-page-heading">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Track platform performance and food redistribution impact.</p>
        </div>
      </div>

      {/* Main Statistics */}

      <div className="admin-stats-grid reports-stats-grid">

        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <Package size={22} />
          </div>
          <div>
            <p>Total Donations</p>
            <h3>{stats.totalDonations}</h3>
            <span className="report-neutral">
              Total food donation records
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p>Completed Collections</p>
            <h3>{stats.completedCollections}</h3>
            <span className="report-neutral">
              Successfully collected donations
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Users size={22} />
          </div>
          <div>
            <p>Registered Donors</p>
            <h3>{stats.totalDonors}</h3>
            <span className="report-neutral">
              Registered platform donors
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <Building2 size={22} />
          </div>
          <div>
            <p>Registered NGOs</p>
            <h3>{stats.totalNGOs}</h3>
            <span className="report-neutral">
              Registered organisations
            </span>
          </div>
        </div>

      </div>

      {/* Impact Banner */}

      <div className="reports-impact-banner">

        <div className="reports-impact-icon">
          <Heart size={27} />
        </div>

        <div>
          <p>Our Community Impact</p>
          <h2>
            {stats.completedCollections}
            <span> Completed Collections</span>
          </h2>
          <small>
            Successfully completed food collection records across the platform.
          </small>
        </div>

        <div className="reports-impact-food">
          <Utensils size={25} />
          <div>
            <h3>{stats.totalDonations}</h3>
            <span>Total Donations</span>
          </div>
        </div>

      </div>

      {/* Monthly Chart */}

      <div className="reports-chart-card">

        <div className="reports-section-heading">
          <div>
            <h3>Monthly Donation Activity</h3>
            <p>Donation activity during {year}</p>
          </div>

          <span className="reports-chart-label">
            <span></span> Donations
          </span>
        </div>

        <div className="reports-bar-chart">

          {monthlyDonations.map((item, index) => (
            <div className="reports-bar-column" key={index}>

              <div className="reports-bar-value">
                {item.count}
              </div>

              <div className="reports-bar-track">
                <div
                  className="reports-bar"
                  style={{
                    height: `${(item.count / maxMonthlyDonations) * 100}%`
                  }}
                ></div>
              </div>

              <span>{item.month}</span>

            </div>
          ))}

        </div>

      </div>

      {/* Lower Analytics */}

      <div className="reports-bottom-grid">

        {/* Donation Status */}

        <div className="reports-chart-card">

          <div className="reports-section-heading">
            <div>
              <h3>Donation Status Overview</h3>
              <p>Distribution by current status</p>
            </div>
          </div>

          <div className="reports-status-list">

            {donationStatuses.map((item, index) => (
              <div className="reports-status-item" key={index}>

                <div className="reports-status-top">
                  <div>
                    <span
                      className="reports-status-dot"
                      style={{ background: getStatusColor(item.name) }}
                    ></span>

                    <span>{item.name}</span>
                  </div>

                  <strong>{item.value}</strong>
                </div>

                <div className="reports-progress-track">
                  <div
                    className="reports-progress-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: getStatusColor(item.name)
                    }}
                  ></div>
                </div>

              </div>
            ))}

            {donationStatuses.length === 0 && (
              <p>No donation status data available.</p>
            )}

          </div>

        </div>

        {/* Top NGOs */}

        <div className="reports-chart-card">

          <div className="reports-section-heading">
            <div>
              <h3>Top Performing NGOs</h3>
              <p>Based on completed collections</p>
            </div>
          </div>

          <div className="reports-ngo-list">

            {topNGOs.map((ngo, index) => (
              <div className="reports-ngo-item" key={ngo._id || index}>

                <div className="reports-ngo-rank">
                  {index + 1}
                </div>

                <div className="reports-ngo-info">
                  <h4>{ngo.ngoName}</h4>
                  <span>{ngo.totalCollected} collections</span>
                </div>

                <CheckCircle2 size={19} />

              </div>
            ))}

            {topNGOs.length === 0 && (
              <p>No completed NGO collections yet.</p>
            )}

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="reports-footer-note">
        <Clock size={15} />
        <span>
          Live analytics from RescueBite database. Monthly donation
          activity for {year}.
        </span>
      </div>

    </div>
  );
}

export default ReportsAnalytics;