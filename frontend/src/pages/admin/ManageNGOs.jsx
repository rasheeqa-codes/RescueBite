import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Mail,
  MapPin,
  Phone,
  X,
  ShieldCheck,
  Ban
} from 'lucide-react';

function ManageNGOs() {
  const [ngos, setNgos] = useState([
    {
      id: 'NGO001',
      name: 'Helping Hands Foundation',
      email: 'helpinghands@gmail.com',
      phone: '+91 98765 43210',
      location: 'Coimbatore',
      registration: 'NGO/2024/001',
      joined: '12 Oct 2026',
      status: 'Verified'
    },
    {
      id: 'NGO002',
      name: 'Green Earth Welfare',
      email: 'greenearth@gmail.com',
      phone: '+91 98765 12345',
      location: 'Chennai',
      registration: 'NGO/2025/014',
      joined: '15 Oct 2026',
      status: 'Pending'
    },
    {
      id: 'NGO003',
      name: 'Hope for Everyone',
      email: 'hopeforeveryone@gmail.com',
      phone: '+91 98765 67890',
      location: 'Tiruppur',
      registration: 'NGO/2023/028',
      joined: '20 Oct 2026',
      status: 'Verified'
    },
    {
      id: 'NGO004',
      name: 'Care & Share Trust',
      email: 'careshare@gmail.com',
      phone: '+91 98765 24680',
      location: 'Erode',
      registration: 'NGO/2026/006',
      joined: '25 Oct 2026',
      status: 'Pending'
    },
    {
      id: 'NGO005',
      name: 'Hope Foundation',
      email: 'hopefoundation@gmail.com',
      phone: '+91 98765 13579',
      location: 'Salem',
      registration: 'NGO/2024/019',
      joined: '28 Oct 2026',
      status: 'Rejected'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedNGO, setSelectedNGO] = useState(null);

  const updateStatus = (id, newStatus) => {
    setNgos((previousNGOs) =>
      previousNGOs.map((ngo) =>
        ngo.id === id ? { ...ngo, status: newStatus } : ngo
      )
    );

    if (selectedNGO?.id === id) {
      setSelectedNGO((previous) => ({
        ...previous,
        status: newStatus
      }));
    }
  };

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      ngo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const verifiedCount = ngos.filter(
    (ngo) => ngo.status === 'Verified'
  ).length;

  const pendingCount = ngos.filter(
    (ngo) => ngo.status === 'Pending'
  ).length;

  const rejectedCount = ngos.filter(
    (ngo) => ngo.status === 'Rejected'
  ).length;

  const inactiveCount = ngos.filter(
    (ngo) => ngo.status === 'Inactive'
  ).length;

  return (
    <div className="manage-ngos-page">

      <div className="manage-ngos-heading">
        <div>
          <p className="form-eyebrow">ORGANISATION MANAGEMENT</p>
          <h1>Manage NGOs</h1>
          <p>Review registrations and manage NGO accounts.</p>
        </div>

        <div className="manage-ngos-heading-icon">
          <Building2 size={28} />
        </div>
      </div>

      <div className="manage-ngos-stats">

        <div className="manage-ngos-stat-card">
          <div className="manage-ngos-stat-icon total">
            <Building2 size={21} />
          </div>
          <div>
            <span>Total NGOs</span>
            <h2>{ngos.length}</h2>
          </div>
        </div>

        <div className="manage-ngos-stat-card">
          <div className="manage-ngos-stat-icon verified">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Verified</span>
            <h2>{verifiedCount}</h2>
          </div>
        </div>

        <div className="manage-ngos-stat-card">
          <div className="manage-ngos-stat-icon pending">
            <Clock size={21} />
          </div>
          <div>
            <span>Pending</span>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="manage-ngos-stat-card">
          <div className="manage-ngos-stat-icon rejected">
            <XCircle size={21} />
          </div>
          <div>
            <span>Rejected</span>
            <h2>{rejectedCount}</h2>
          </div>
        </div>

        <div className="manage-ngos-stat-card">
          <div className="manage-ngos-stat-icon inactive">
            <Ban size={21} />
          </div>
          <div>
            <span>Inactive</span>
            <h2>{inactiveCount}</h2>
          </div>
        </div>

      </div>

      <div className="manage-ngos-toolbar">

        <div className="manage-ngos-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search NGO name, email or ID..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="manage-ngos-filter">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

      </div>

      <div className="manage-ngos-list-heading">
        <div>
          <h2>Registered Organisations</h2>
          <p>{filteredNGOs.length} organisations found</p>
        </div>
      </div>

      <div className="manage-ngos-list">

        {filteredNGOs.length > 0 ? (

          filteredNGOs.map((ngo) => (

            <div className="manage-ngo-card" key={ngo.id}>

              <div className="manage-ngo-main">

                <div className="manage-ngo-avatar">
                  <Building2 size={23} />
                </div>

                <div className="manage-ngo-info">
                  <h3>{ngo.name}</h3>
                  <p>{ngo.email}</p>

                  <div className="manage-ngo-meta">
                    <span>
                      <MapPin size={14} />
                      {ngo.location}
                    </span>

                    <span>{ngo.id}</span>
                  </div>
                </div>

              </div>

              <div className="manage-ngo-status-area">

                <span className={`manage-ngo-status ${ngo.status.toLowerCase()}`}>
                  {ngo.status}
                </span>

                <div className="manage-ngo-actions">

                  <button
                    className="manage-ngo-view"
                    onClick={() => setSelectedNGO(ngo)}
                  >
                    <Eye size={16} />
                    View
                  </button>

                  {ngo.status === 'Pending' && (
                    <>
                      <button
                        className="manage-ngo-approve"
                        onClick={() => updateStatus(ngo.id, 'Verified')}
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>

                      <button
                        className="manage-ngo-reject"
                        onClick={() => updateStatus(ngo.id, 'Rejected')}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}

                  {ngo.status === 'Verified' && (
                    <button
                      className="manage-ngo-deactivate"
                      onClick={() => updateStatus(ngo.id, 'Inactive')}
                    >
                      <Ban size={16} />
                      Deactivate
                    </button>
                  )}

                  {(ngo.status === 'Inactive' || ngo.status === 'Rejected') && (
                    <button
                      className="manage-ngo-approve"
                      onClick={() => updateStatus(ngo.id, 'Verified')}
                    >
                      <ShieldCheck size={16} />
                      Reactivate
                    </button>
                  )}

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="manage-ngos-empty">
            <Building2 size={35} />
            <h3>No NGOs found</h3>
            <p>Try changing your search or filter.</p>
          </div>

        )}

      </div>

      {selectedNGO && (

        <div
          className="manage-ngos-modal-overlay"
          onClick={() => setSelectedNGO(null)}
        >

          <div
            className="manage-ngos-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="manage-ngos-modal-header">
              <div>
                <h2>NGO Details</h2>
                <p>Organisation registration information</p>
              </div>

              <button onClick={() => setSelectedNGO(null)}>
                <X size={21} />
              </button>
            </div>

            <div className="manage-ngos-modal-profile">
              <div className="manage-ngo-avatar large">
                <Building2 size={30} />
              </div>

              <h3>{selectedNGO.name}</h3>
              <span className={`manage-ngo-status ${selectedNGO.status.toLowerCase()}`}>
                {selectedNGO.status}
              </span>
            </div>

            <div className="manage-ngos-details">

              <div>
                <Mail size={18} />
                <section>
                  <span>Email Address</span>
                  <strong>{selectedNGO.email}</strong>
                </section>
              </div>

              <div>
                <Phone size={18} />
                <section>
                  <span>Contact Number</span>
                  <strong>{selectedNGO.phone}</strong>
                </section>
              </div>

              <div>
                <MapPin size={18} />
                <section>
                  <span>Location</span>
                  <strong>{selectedNGO.location}</strong>
                </section>
              </div>

              <div>
                <ShieldCheck size={18} />
                <section>
                  <span>Registration Number</span>
                  <strong>{selectedNGO.registration}</strong>
                </section>
              </div>

              <div>
                <Clock size={18} />
                <section>
                  <span>Joined Date</span>
                  <strong>{selectedNGO.joined}</strong>
                </section>
              </div>

            </div>

            <button
              className="manage-ngos-modal-close"
              onClick={() => setSelectedNGO(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageNGOs;