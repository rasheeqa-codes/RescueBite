import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Mail,
  MapPin,
  Phone,
  X,
  ShieldCheck,
  Users
} from 'lucide-react';

import API from '../../services/api';

function ManageNGOs() {
  const { showToast } = useToast();
  const [ngos, setNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  // Fetch actual NGO records from the backend
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/admin/ngos');

        setNgos(response.data.ngos || []);
      } catch (error) {
        console.error('Error fetching NGOs:', error);

        setError(
          error.response?.data?.message ||
          'Unable to load NGO information.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  // Generate an NGO ID using its MongoDB ID
  const getNGOId = (ngo) => {
    return `NGO-${ngo._id.slice(-6).toUpperCase()}`;
  };

  // Use the actual verification status from MongoDB
  const getNGOStatus = (ngo) => {
    return ngo.isVerified ? 'Verified' : 'Pending';
  };
  // Verify an NGO account through the backend
const handleVerifyNGO = async (ngo) => {
  try {
    setVerifyingId(ngo._id);

    const response = await API.patch(
      `/admin/verify/ngo/${ngo._id}`
    );

    const updatedNGO = response.data.user;

    // Update NGO list
    setNgos((previousNGOs) =>
      previousNGOs.map((item) =>
        item._id === updatedNGO._id ? updatedNGO : item
      )
    );

    // Update modal if this NGO is currently selected
    setSelectedNGO((previous) =>
      previous?._id === updatedNGO._id ? updatedNGO : previous
    );

  } catch (error) {
    console.error('NGO verification error:', error);

    showToast(
  error.response?.data?.message ||
  'Unable to verify NGO. Please try again.',
  'error'
);
  } finally {
    setVerifyingId(null);
  }
};

  // Get organisation name
  const getNGOName = (ngo) => {
    return ngo.organizationName || ngo.fullName || 'Unnamed Organisation';
  };

  // Format registration date
  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Search and filter NGOs
  const filteredNGOs = ngos.filter((ngo) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      getNGOName(ngo).toLowerCase().includes(search) ||
      (ngo.fullName || '').toLowerCase().includes(search) ||
      (ngo.email || '').toLowerCase().includes(search) ||
      getNGOId(ngo).toLowerCase().includes(search) ||
      (ngo.registrationNumber || '').toLowerCase().includes(search);

    const status = getNGOStatus(ngo);

    const matchesStatus =
      statusFilter === 'All' ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics based on actual database records
  const verifiedCount = ngos.filter(
    (ngo) => ngo.isVerified
  ).length;

  const pendingCount = ngos.filter(
    (ngo) => !ngo.isVerified
  ).length;

  const registrationProvidedCount = ngos.filter(
    (ngo) => ngo.registrationNumber?.trim()
  ).length;

  const contactProvidedCount = ngos.filter(
    (ngo) => ngo.phone?.trim()
  ).length;

  return (
    <div className="manage-ngos-page">

      {/* Page Heading */}
      <div className="manage-ngos-heading">
        <div>
          <p className="form-eyebrow">ORGANISATION MANAGEMENT</p>
          <h1>Manage NGOs</h1>
          <p>Review registered NGO accounts and their information.</p>
        </div>

        <div className="manage-ngos-heading-icon">
          <Building2 size={28} />
        </div>
      </div>

      {/* Statistics */}
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
            <ShieldCheck size={21} />
          </div>
          <div>
            <span>Registration Provided</span>
            <h2>{registrationProvidedCount}</h2>
          </div>
        </div>

        <div className="manage-ngos-stat-card">
          <div className="manage-ngos-stat-icon inactive">
            <Phone size={21} />
          </div>
          <div>
            <span>Contact Provided</span>
            <h2>{contactProvidedCount}</h2>
          </div>
        </div>

      </div>

      {/* Search and Filter */}
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
          </select>
        </div>

      </div>

      {/* NGO List Heading */}
      <div className="manage-ngos-list-heading">
        <div>
          <h2>Registered Organisations</h2>
          <p>{filteredNGOs.length} organisations found</p>
        </div>
      </div>

      {/* NGO List */}
      <div className="manage-ngos-list">

        {loading ? (

          <div className="manage-ngos-empty">
            <p>Loading NGO information...</p>
          </div>

        ) : error ? (

          <div className="manage-ngos-empty">
            <h3>Unable to load NGOs</h3>
            <p>{error}</p>
          </div>

        ) : filteredNGOs.length > 0 ? (

          filteredNGOs.map((ngo) => (

            <div className="manage-ngo-card" key={ngo._id}>

              <div className="manage-ngo-main">

                <div className="manage-ngo-avatar">
                  <Building2 size={23} />
                </div>

                <div className="manage-ngo-info">
                  <h3>{getNGOName(ngo)}</h3>
                  <p>{ngo.email}</p>

                  <div className="manage-ngo-meta">
                    <span>
                      <MapPin size={14} />
                      {ngo.organizationAddress || 'Location not provided'}
                    </span>

                    <span>{getNGOId(ngo)}</span>
                  </div>
                </div>

              </div>

              <div className="manage-ngo-status-area">

                <span
                  className={`manage-ngo-status ${getNGOStatus(ngo).toLowerCase()}`}
                >
                  {getNGOStatus(ngo)}
                </span>

                <div className="manage-ngo-actions">

  <button
    className="manage-ngo-view"
    onClick={() => setSelectedNGO(ngo)}
  >
    <Eye size={16} />
    View
  </button>

  {!ngo.isVerified && (
    <button
      className="manage-ngo-approve"
      onClick={() => handleVerifyNGO(ngo)}
      disabled={verifyingId === ngo._id}
    >
      <CheckCircle2 size={16} />
      {verifyingId === ngo._id ? 'Verifying...' : 'Approve'}
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

      {/* NGO Details Modal */}
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

              <h3>{getNGOName(selectedNGO)}</h3>

              <span
                className={`manage-ngo-status ${getNGOStatus(selectedNGO).toLowerCase()}`}
              >
                {getNGOStatus(selectedNGO)}
              </span>

            </div>

            <div className="manage-ngos-details">

              <div>
                <Mail size={18} />
                <section>
                  <span>Email Address</span>
                  <strong>{selectedNGO.email || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <Phone size={18} />
                <section>
                  <span>Contact Number</span>
                  <strong>{selectedNGO.phone || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <Users size={18} />
                <section>
                  <span>Contact Person</span>
                  <strong>{selectedNGO.contactPerson || selectedNGO.fullName || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <MapPin size={18} />
                <section>
                  <span>Address</span>
                  <strong>{selectedNGO.organizationAddress || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <Building2 size={18} />
                <section>
                  <span>Organisation Name</span>
                  <strong>{selectedNGO.organizationName || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <ShieldCheck size={18} />
                <section>
                  <span>Registration Number</span>
                  <strong>{selectedNGO.registrationNumber || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <Clock size={18} />
                <section>
                  <span>Joined Date</span>
                  <strong>{formatDate(selectedNGO.createdAt)}</strong>
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