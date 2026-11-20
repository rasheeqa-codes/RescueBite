import { useEffect, useState } from 'react';

import {
  Search,
  Filter,
  Eye,
  X,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  PackageCheck,
  MapPin
} from 'lucide-react';

import API from '../../services/api';

function ManageRequests() {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch actual requests from MongoDB
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/admin/requests');

        if (response.data.success) {
          setRequests(response.data.requests || []);
        } else {
          setError('Unable to load requests.');
        }

      } catch (err) {
        console.error('Error fetching requests:', err);

        setError(
          err.response?.data?.message ||
          'Unable to load requests. Please try again.'
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Generate readable request ID
  const getRequestId = (id) => {
    if (!id) return 'N/A';

    return `REQ-${id.slice(-6).toUpperCase()}`;
  };

  // Get food name
  const getFoodName = (request) => {
    return request.donation?.foodName || 'Food information unavailable';
  };

  // Get NGO name
  const getNGOName = (request) => {
    return (
      request.ngo?.organizationName ||
      request.ngo?.fullName ||
      'NGO information unavailable'
    );
  };

  // Get donor name
  const getDonorName = (request) => {
    return (
      request.donor?.organizationName ||
      request.donor?.fullName ||
      'Donor information unavailable'
    );
  };

  // Get requested quantity
  const getQuantity = (request) => {
    const quantity = request.requestedQuantity;
    const unit = request.donation?.unit || '';

    if (quantity === undefined || quantity === null) {
      return 'N/A';
    }

    return `${quantity} ${unit}`.trim();
  };

  // Format request date
  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Search and status filtering
  const filteredRequests = requests.filter((request) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      getFoodName(request).toLowerCase().includes(search) ||
      getNGOName(request).toLowerCase().includes(search) ||
      getDonorName(request).toLowerCase().includes(search) ||
      getRequestId(request._id).toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'All' ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const pendingCount = requests.filter(
    (r) => r.status === 'Pending'
  ).length;

  const approvedCount = requests.filter(
    (r) => r.status === 'Approved'
  ).length;

  const collectedCount = requests.filter(
    (r) => r.status === 'Collected'
  ).length;

  const rejectedCount = requests.filter(
    (r) => r.status === 'Rejected'
  ).length;

  const cancelledCount = requests.filter(
    (r) => r.status === 'Cancelled'
  ).length;

  return (
    <div className="manage-requests-page">

      {/* Page Heading */}

      <div className="admin-page-heading">
        <div>
          <h2>Manage Requests</h2>
          <p>
            Monitor food requests submitted by NGOs.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <ClipboardList size={22} />
          </div>

          <div>
            <p>Total Requests</p>
            <h3>{requests.length}</h3>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Clock size={22} />
          </div>

          <div>
            <p>Pending</p>
            <h3>{pendingCount}</h3>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>Approved</p>
            <h3>{approvedCount}</h3>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <PackageCheck size={22} />
          </div>

          <div>
            <p>Collected</p>
            <h3>{collectedCount}</h3>
          </div>
        </div>

      </div>

      {/* Requests Table */}

      <div className="admin-table-card">

        <div className="admin-table-toolbar">

          <div className="admin-search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search food, NGO, donor or request ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-filter-box">
            <Filter size={17} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Collected">Collected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

        </div>

        <div className="admin-table-wrapper">

          {loading ? (

            <div className="admin-empty-state">
              <Clock size={35} />
              <h3>Loading requests...</h3>
              <p>Please wait while we fetch the records.</p>
            </div>

          ) : error ? (

            <div className="admin-empty-state">
              <XCircle size={35} />
              <h3>Unable to load requests</h3>
              <p>{error}</p>
            </div>

          ) : (

            <>
              <table className="admin-data-table">

                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Food Item</th>
                    <th>NGO</th>
                    <th>Quantity</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredRequests.map((request) => (

                    <tr key={request._id}>

                      <td className="admin-id-cell">
                        {getRequestId(request._id)}
                      </td>

                      <td className="admin-name-cell">
                        {getFoodName(request)}
                      </td>

                      <td>
                        {getNGOName(request)}
                      </td>

                      <td>
                        {getQuantity(request)}
                      </td>

                      <td>
                        {formatDate(request.createdAt)}
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${
                            (request.status || 'unknown')
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                          }`}
                        >
                          {request.status || 'Unknown'}
                        </span>
                      </td>

                      <td>
                        <button
                          className="admin-view-btn"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              {filteredRequests.length === 0 && (

                <div className="admin-empty-state">
                  <ClipboardList size={35} />

                  <h3>No requests found</h3>

                  <p>
                    Try changing your search or status filter.
                  </p>
                </div>

              )}

            </>

          )}

        </div>

      </div>

      {/* Request Summary */}

      {!loading && !error && (

        <div className="admin-request-summary">
          <span>
            Rejected: {rejectedCount} | Cancelled: {cancelledCount}
          </span>

          <strong>
            {rejectedCount + cancelledCount}
          </strong>
        </div>

      )}

      {/* Request Details Modal */}

      {/* Request Details Modal */}

{selectedRequest && (
  <div
    className="admin-modal-overlay"
    onClick={() => setSelectedRequest(null)}
  >
    <div
      className="admin-details-modal request-details-redesigned"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Header */}
      <div className="request-details-header">
        <div className="request-details-heading">
          <span className="request-details-label">REQUEST DETAILS</span>
          <h3>{getRequestId(selectedRequest._id)}</h3>
          <p>Food request information and participants</p>
        </div>

        <button
          className="request-details-close-icon"
          onClick={() => setSelectedRequest(null)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Food Hero */}
      <div className="request-food-hero">
        <div className="request-food-icon">
          <ClipboardList size={25} />
        </div>

        <div className="request-food-title">
          <span>REQUESTED FOOD</span>
          <h2>{getFoodName(selectedRequest)}</h2>
        </div>

        <span
          className={`admin-status-badge ${
            (selectedRequest.status || 'unknown')
              .toLowerCase()
              .replace(/\s+/g, '-')
        }`}
        >
          {selectedRequest.status || 'Unknown'}
        </span>
      </div>

      {/* Food Information */}
      <div className="request-details-section">

        <h4 className="request-section-title">Food Information</h4>

        <div className="request-info-grid">

          <div className="request-info-card">
            <span>Requested Quantity</span>
            <strong>{getQuantity(selectedRequest)}</strong>
          </div>

          <div className="request-info-card">
            <span>Food Category</span>
            <strong>
              {selectedRequest.donation?.category || 'Not provided'}
            </strong>
          </div>

          <div className="request-info-card request-date-card">
            <span>Request Date</span>
            <strong>{formatDate(selectedRequest.createdAt)}</strong>
          </div>

        </div>
      </div>

      {/* Participants */}
      <div className="request-details-section">

        <h4 className="request-section-title">Participants</h4>

        <div className="request-participant-grid">

          {/* NGO */}
          <div className="request-participant-card">

            <div className="request-participant-top">
              <div className="request-participant-avatar ngo-avatar">
                NGO
              </div>

              <span className="request-participant-role">
                RECEIVER
              </span>
            </div>

            <h3>{getNGOName(selectedRequest)}</h3>

            <div className="request-contact-row">
              <span>Contact Number</span>
              <strong>
                {selectedRequest.ngo?.phone || 'Not provided'}
              </strong>
            </div>

          </div>

          {/* Donor */}
          <div className="request-participant-card">

            <div className="request-participant-top">
              <div className="request-participant-avatar donor-avatar">
                DONOR
              </div>

              <span className="request-participant-role">
                FOOD PROVIDER
              </span>
            </div>

            <h3>{getDonorName(selectedRequest)}</h3>

            <div className="request-contact-row">
              <span>Contact Number</span>
              <strong>
                {selectedRequest.donor?.phone || 'Not provided'}
              </strong>
            </div>

          </div>

        </div>
      </div>

      {/* Location */}
      <div className="request-details-section">

        <h4 className="request-section-title">Pickup Location</h4>

        <div className="request-location-card">
          <div className="request-location-icon">
            <MapPin size={20} />
          </div>

          <div>
            <span>Food pickup address</span>
            <strong>
              {selectedRequest.donation?.address || 'Location not provided'}
            </strong>
          </div>
        </div>

      </div>

      {/* Notes */}
      <div className="request-details-section">

        <h4 className="request-section-title">Additional Notes</h4>

        <div className="request-notes-card">
          {selectedRequest.donation?.notes || 'No additional notes provided.'}
        </div>

      </div>

      {/* Footer */}
      <div className="request-details-footer">

        <button
          className="request-details-close-button"
          onClick={() => setSelectedRequest(null)}
        >
          Close
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
}


export default ManageRequests;