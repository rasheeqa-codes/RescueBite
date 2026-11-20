import { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  MapPin,
  Mail,
  Phone,
  Building2
} from 'lucide-react';

function ManageDonors() {
  const [donors, setDonors] = useState([
    {
      id: 'DON001',
      name: 'Green Harvest Foundation',
      email: 'greenharvest@gmail.com',
      phone: '9876543210',
      location: 'Coimbatore',
      type: 'Restaurant',
      status: 'Verified',
      joined: '12 Nov 2026'
    },
    {
      id: 'DON002',
      name: 'Sunrise Bakery',
      email: 'sunrise@gmail.com',
      phone: '9876543211',
      location: 'Kuniyamuthur',
      type: 'Bakery',
      status: 'Pending',
      joined: '14 Nov 2026'
    },
    {
      id: 'DON003',
      name: 'Fresh Farm Suppliers',
      email: 'freshfarm@gmail.com',
      phone: '9876543212',
      location: 'Ukkadam',
      type: 'Food Supplier',
      status: 'Verified',
      joined: '15 Nov 2026'
    },
    {
      id: 'DON004',
      name: 'Royal Feast Restaurant',
      email: 'royalfeast@gmail.com',
      phone: '9876543213',
      location: 'RS Puram',
      type: 'Restaurant',
      status: 'Pending',
      joined: '16 Nov 2026'
    },
    {
      id: 'DON005',
      name: 'Daily Fresh Foods',
      email: 'dailyfresh@gmail.com',
      phone: '9876543214',
      location: 'Gandhipuram',
      type: 'Food Supplier',
      status: 'Rejected',
      joined: '17 Nov 2026'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDonor, setSelectedDonor] = useState(null);

  const updateStatus = (id, newStatus) => {
    setDonors((previous) =>
      previous.map((donor) =>
        donor.id === id
          ? { ...donor, status: newStatus }
          : donor
      )
    );

    setSelectedDonor(null);
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || donor.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const verifiedCount = donors.filter(
    (donor) => donor.status === 'Verified'
  ).length;

  const pendingCount = donors.filter(
    (donor) => donor.status === 'Pending'
  ).length;

  const rejectedCount = donors.filter(
    (donor) => donor.status === 'Rejected'
  ).length;

  return (
    <div className="manage-donors-page">

      <div className="manage-donors-heading">
        <div>
          <p className="form-eyebrow">ADMINISTRATION</p>
          <h1>Manage Donors</h1>
          <p>Review and manage registered food donor accounts.</p>
        </div>
      </div>

      {/* Statistics */}

      <div className="donor-management-stats">

        <div className="donor-management-stat">
          <Users size={22} />
          <div>
            <span>Total Donors</span>
            <h2>{donors.length}</h2>
          </div>
        </div>

        <div className="donor-management-stat">
          <CheckCircle2 size={22} />
          <div>
            <span>Verified</span>
            <h2>{verifiedCount}</h2>
          </div>
        </div>

        <div className="donor-management-stat">
          <Clock size={22} />
          <div>
            <span>Pending</span>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="donor-management-stat">
          <XCircle size={22} />
          <div>
            <span>Rejected</span>
            <h2>{rejectedCount}</h2>
          </div>
        </div>

      </div>

      {/* Search and Filter */}

      <div className="donor-management-toolbar">

        <div className="donor-management-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by donor name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="donor-management-filter">
          <Filter size={17} />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

      </div>

      {/* Donor List */}

      <div className="donor-management-list">

        <div className="donor-management-list-heading">
          <h2>Registered Donors</h2>
          <span>{filteredDonors.length} donors found</span>
        </div>

        {filteredDonors.length === 0 ? (

          <div className="donor-management-empty">
            <Users size={35} />
            <h3>No donors found</h3>
            <p>Try changing your search or filter.</p>
          </div>

        ) : (

          filteredDonors.map((donor) => (

            <div className="donor-management-card" key={donor.id}>

              <div className="donor-management-avatar">
                <Building2 size={22} />
              </div>

              <div className="donor-management-info">
                <h3>{donor.name}</h3>
                <p>{donor.id} · {donor.type}</p>

                <div className="donor-management-meta">
                  <span>
                    <Mail size={13} />
                    {donor.email}
                  </span>

                  <span>
                    <MapPin size={13} />
                    {donor.location}
                  </span>
                </div>
              </div>

              <div className="donor-management-actions">

                <span className={`donor-status ${donor.status.toLowerCase()}`}>
                  {donor.status}
                </span>

                <button
                  className="donor-view-button"
                  onClick={() => setSelectedDonor(donor)}
                >
                  <Eye size={16} />
                  View
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* Donor Details Modal */}

      {selectedDonor && (

        <div
          className="donor-modal-overlay"
          onClick={() => setSelectedDonor(null)}
        >

          <div
            className="donor-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="donor-modal-header">
              <div>
                <h2>Donor Details</h2>
                <p>Review donor account information.</p>
              </div>

              <button onClick={() => setSelectedDonor(null)}>
                <X size={21} />
              </button>
            </div>

            <div className="donor-modal-profile">
              <div className="donor-management-avatar">
                <Building2 size={25} />
              </div>

              <div>
                <h3>{selectedDonor.name}</h3>
                <span>{selectedDonor.id}</span>
              </div>
            </div>

            <div className="donor-modal-details">

              <div>
                <Mail size={17} />
                <section>
                  <small>Email</small>
                  <p>{selectedDonor.email}</p>
                </section>
              </div>

              <div>
                <Phone size={17} />
                <section>
                  <small>Phone</small>
                  <p>{selectedDonor.phone}</p>
                </section>
              </div>

              <div>
                <MapPin size={17} />
                <section>
                  <small>Location</small>
                  <p>{selectedDonor.location}</p>
                </section>
              </div>

              <div>
                <Building2 size={17} />
                <section>
                  <small>Organisation Type</small>
                  <p>{selectedDonor.type}</p>
                </section>
              </div>

            </div>

            <div className="donor-modal-status">
              <span>Account Status</span>
              <strong>{selectedDonor.status}</strong>
            </div>

            <div className="donor-modal-actions">

              {selectedDonor.status !== 'Verified' && (
                <button
                  className="donor-approve-button"
                  onClick={() =>
                    updateStatus(selectedDonor.id, 'Verified')
                  }
                >
                  <CheckCircle2 size={16} />
                  Approve Donor
                </button>
              )}

              {selectedDonor.status !== 'Rejected' && (
                <button
                  className="donor-reject-button"
                  onClick={() =>
                    updateStatus(selectedDonor.id, 'Rejected')
                  }
                >
                  <XCircle size={16} />
                  Reject Donor
                </button>
              )}

              {selectedDonor.status !== 'Inactive' && (
                <button
                  className="donor-inactive-button"
                  onClick={() =>
                    updateStatus(selectedDonor.id, 'Inactive')
                  }
                >
                  Deactivate
                </button>
              )}

              {selectedDonor.status === 'Inactive' && (
                <button
                  className="donor-approve-button"
                  onClick={() =>
                    updateStatus(selectedDonor.id, 'Verified')
                  }
                >
                  Reactivate
                </button>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageDonors;