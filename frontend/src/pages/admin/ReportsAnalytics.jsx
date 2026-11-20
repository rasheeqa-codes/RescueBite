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

  const monthlyData = [
    { month: 'Jan', donations: 35 },
    { month: 'Feb', donations: 48 },
    { month: 'Mar', donations: 42 },
    { month: 'Apr', donations: 65 },
    { month: 'May', donations: 55 },
    { month: 'Jun', donations: 78 },
    { month: 'Jul', donations: 62 },
    { month: 'Aug', donations: 85 },
    { month: 'Sep', donations: 72 },
    { month: 'Oct', donations: 95 },
    { month: 'Nov', donations: 88 },
    { month: 'Dec', donations: 100 }
  ];

  const statusData = [
    { label: 'Completed', count: 98, color: '#16a34a', percentage: 63 },
    { label: 'Available', count: 32, color: '#3b82f6', percentage: 21 },
    { label: 'Requested', count: 18, color: '#f59e0b', percentage: 12 },
    { label: 'Expired', count: 8, color: '#ef4444', percentage: 4 }
  ];

  const topNGOs = [
    { name: 'Helping Hands Foundation', collections: 28 },
    { name: 'Hope Trust', collections: 23 },
    { name: 'Care and Share NGO', collections: 19 },
    { name: 'Helping Hearts', collections: 15 }
  ];

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
            <h3>156</h3>
            <span className="report-growth">
              <TrendingUp size={13} /> 12% increase
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p>Completed Collections</p>
            <h3>98</h3>
            <span className="report-growth">
              <TrendingUp size={13} /> 8% increase
            </span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Users size={22} />
          </div>
          <div>
            <p>Registered Donors</p>
            <h3>48</h3>
            <span className="report-neutral">Active platform donors</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <Building2 size={22} />
          </div>
          <div>
            <p>Registered NGOs</p>
            <h3>32</h3>
            <span className="report-neutral">Registered organisations</span>
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
          <h2>2,450 <span>People Reached</span></h2>
          <small>Estimated beneficiaries reached through completed collections.</small>
        </div>

        <div className="reports-impact-food">
          <Utensils size={25} />
          <div>
            <h3>1,850 kg</h3>
            <span>Food Redistributed</span>
          </div>
        </div>

      </div>

      {/* Monthly Chart */}

      <div className="reports-chart-card">

        <div className="reports-section-heading">
          <div>
            <h3>Monthly Donation Activity</h3>
            <p>Donation activity across the year</p>
          </div>

          <span className="reports-chart-label">
            <span></span> Donations
          </span>
        </div>

        <div className="reports-bar-chart">

          {monthlyData.map((item, index) => (
            <div className="reports-bar-column" key={index}>

              <div className="reports-bar-value">
                {item.donations}
              </div>

              <div className="reports-bar-track">
                <div
                  className="reports-bar"
                  style={{ height: `${item.donations}%` }}
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

            {statusData.map((item, index) => (
              <div className="reports-status-item" key={index}>

                <div className="reports-status-top">
                  <div>
                    <span
                      className="reports-status-dot"
                      style={{ background: item.color }}
                    ></span>
                    <span>{item.label}</span>
                  </div>

                  <strong>{item.count}</strong>
                </div>

                <div className="reports-progress-track">
                  <div
                    className="reports-progress-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: item.color
                    }}
                  ></div>
                </div>

              </div>
            ))}

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
              <div className="reports-ngo-item" key={index}>

                <div className="reports-ngo-rank">
                  {index + 1}
                </div>

                <div className="reports-ngo-info">
                  <h4>{ngo.name}</h4>
                  <span>{ngo.collections} collections</span>
                </div>

                <CheckCircle2 size={19} />

              </div>
            ))}

          </div>

        </div>

      </div>

      <div className="reports-footer-note">
        <Clock size={15} />
        <span>
          Analytics currently display demonstration data. Live reports
          will be connected to the database during backend development.
        </span>
      </div>

    </div>
  );
}

export default ReportsAnalytics;