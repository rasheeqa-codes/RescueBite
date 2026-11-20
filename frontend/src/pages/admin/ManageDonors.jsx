import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import {
  Search,
  Filter,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  X,
  MapPin,
  Mail,
  Phone,
  Building2
} from 'lucide-react';

import API from '../../services/api';

function ManageDonors() {
  const { showToast } = useToast();
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDonor, setSelectedDonor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  // ==========================================
  // FETCH DONORS FROM DATABASE
  // ==========================================

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/admin/donors');

        setDonors(response.data.donors || []);
      } catch (error) {
        console.error('Error fetching donors:', error);

        setError(
          error.response?.data?.message ||
          'Unable to load donor information.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // ==========================================
  // FORMAT DONOR INFORMATION
  // ==========================================
const handleVerifyDonor = async (donor) => {
  try {
    setVerifyingId(donor._id);

    const response = await API.patch(
      `/admin/verify/donor/${donor._id}`
    );

    const updatedDonor = response.data.user;

    // Update donor list with the saved database record
    setDonors((previousDonors) =>
      previousDonors.map((item) =>
        item._id === updatedDonor._id ? updatedDonor : item
      )
    );

    // Update the details modal if it is open
    setSelectedDonor((previous) =>
      previous?._id === updatedDonor._id ? updatedDonor : previous
    );

  } catch (error) {
    console.error('Donor verification error:', error);

    showToast(
  error.response?.data?.message ||
  'Unable to verify donor. Please try again.',
  'error'
);
  } finally {
    setVerifyingId(null);
  }
};
  const getDonorStatus = (donor) => {
    return donor.isVerified ? 'Verified' : 'Pending';
  };

  const getDonorId = (donor) => {
    return `DON-${donor._id.slice(-6).toUpperCase()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // ==========================================
  // SEARCH AND FILTER
  // ==========================================

  const filteredDonors = donors.filter((donor) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (donor.fullName || '').toLowerCase().includes(search) ||
      (donor.email || '').toLowerCase().includes(search) ||
      getDonorId(donor).toLowerCase().includes(search) ||
      (donor.organizationName || '').toLowerCase().includes(search);

    const status = getDonorStatus(donor);

    const matchesStatus =
      filterStatus === 'All' || status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // STATISTICS
  // ==========================================

  const verifiedCount = donors.filter(
    (donor) => donor.isVerified
  ).length;

  const pendingCount = donors.filter(
    (donor) => !donor.isVerified
  ).length;

  // ==========================================
  // PAGE UI
  // ==========================================

  return (
    <div className="manage-donors-page">

      <div className="manage-donors-heading">
        <div>
          <p className="form-eyebrow">ADMINISTRATION</p>
          <h1>Manage Donors</h1>
          <p>Review registered food donor accounts.</p>
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
          </select>
        </div>

      </div>

      {/* Donor List */}

      <div className="donor-management-list">

        <div className="donor-management-list-heading">
          <h2>Registered Donors</h2>
          <span>{filteredDonors.length} donors found</span>
        </div>

        {loading ? (

          <div className="donor-management-empty">
            <p>Loading donor information...</p>
          </div>

        ) : error ? (

          <div className="donor-management-empty">
            <h3>Unable to load donors</h3>
            <p>{error}</p>
          </div>

        ) : filteredDonors.length === 0 ? (

          <div className="donor-management-empty">
            <Users size={35} />
            <h3>No donors found</h3>
            <p>Try changing your search or filter.</p>
          </div>

        ) : (

          filteredDonors.map((donor) => (

            <div
              className="donor-management-card"
              key={donor._id}
            >

              <div className="donor-management-avatar">
                <Building2 size={22} />
              </div>

              <div className="donor-management-info">

                <h3>{donor.fullName}</h3>

                <p>
                  {getDonorId(donor)} ·{' '}
                  {donor.organizationName || 'Individual Donor'}
                </p>

                <div className="donor-management-meta">

                  <span>
                    <Mail size={13} />
                    {donor.email}
                  </span>

                  <span>
                    <MapPin size={13} />
                    {donor.organizationAddress || 'Location not provided'}
                  </span>

                </div>

              </div>

              <div className="donor-management-actions">
  <span className={`donor-status ${getDonorStatus(donor).toLowerCase()}`}>
    {getDonorStatus(donor)}
  </span>

  <button
    className="donor-view-button"
    onClick={() => setSelectedDonor(donor)}
  >
    <Eye size={16} />
    View
  </button>

  {!donor.isVerified && (
    <button
      className="donor-view-button"
      onClick={() => handleVerifyDonor(donor)}
      disabled={verifyingId === donor._id}
    >
      <CheckCircle2 size={16} />
      {verifyingId === donor._id ? 'Verifying...' : 'Approve'}
    </button>
  )}
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
                <p>Registered donor account information.</p>
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
                <h3>{selectedDonor.fullName}</h3>
                <span>{getDonorId(selectedDonor)}</span>
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
                  <p>{selectedDonor.phone || 'Not provided'}</p>
                </section>
              </div>

              <div>
                <MapPin size={17} />
                <section>
                  <small>Address</small>
                  <p>
                    {selectedDonor.organizationAddress || 'Not provided'}
                  </p>
                </section>
              </div>

              <div>
                <Building2 size={17} />
                <section>
                  <small>Organisation</small>
                  <p>
                    {selectedDonor.organizationName || 'Individual Donor'}
                  </p>
                </section>
              </div>

            </div>

            <div className="donor-modal-status">
              <span>Account Status</span>

              <strong>
                {getDonorStatus(selectedDonor)}
              </strong>
            </div>

            <div className="donor-modal-status">
              <span>Registration Date</span>

              <strong>
                {formatDate(selectedDonor.createdAt)}
              </strong>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageDonors;