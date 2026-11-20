import { useToast } from '../../context/ToastContext.jsx';
import { useState, useEffect } from 'react';
import API from '../../services/api.js';
import {
  Search, Filter, CheckCircle2, XCircle, Clock,
  Building2, Utensils, CalendarDays, Eye, X,
  ClipboardList
} from 'lucide-react';

function IncomingRequests() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
const [statusFilter, setStatusFilter] = useState('All');
const [selectedRequest, setSelectedRequest] = useState(null);
const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await API.get('/requests/incoming');

      const requestData = response.data.requests || [];

      setRequests(
        requestData.map((item) => ({
          id: item._id,
          organisation:
            item.ngo?.organizationName ||
            item.ngo?.fullName ||
            'NGO',

          initials: (
            item.ngo?.organizationName ||
            item.ngo?.fullName ||
            'NG'
          )
            .substring(0, 2)
            .toUpperCase(),

          food: item.donation?.foodName || 'Food Donation',

          quantity: `${item.requestedQuantity} ${
            item.donation?.unit || ''
          }`.trim(),

          date: new Date(item.createdAt).toLocaleDateString('en-IN'),

          status: item.status,

          location:
            item.ngo?.organizationAddress ||
            'Location unavailable',

          message: item.message || 'No message provided.'
        }))
      );

    } catch (error) {
      console.error('Failed to fetch incoming requests:', error);

    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, []);
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.organisation.toLowerCase().includes(search.toLowerCase()) ||
      request.food.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id, newStatus) => {
  try {
    const response = await API.patch(
      `/requests/${id}/status`,
      { status: newStatus }
    );

    // Update donor dashboard after backend confirms success
    setRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? { ...request, status: response.data.request.status }
          : request
      )
    );

    // Update details modal if it is open
    setSelectedRequest((previous) =>
      previous?.id === id
        ? { ...previous, status: response.data.request.status }
        : previous
    );

    showToast(
  response.data.message || 'Request updated successfully!',
  'success'
);

  } catch (error) {
    console.error('Update Request Error:', error);

    showToast(
  error.response?.data?.message ||
  'Unable to update request status.',
  'error'
);
  }
};
  return (
    <div className="incoming-requests-page">

      <div className="incoming-header">
        <div>
          <p className="form-eyebrow">DONATION COORDINATION</p>
          <h1>Incoming Requests</h1>
          <p>Review and manage food collection requests from NGOs.</p>
        </div>
      </div>

      <div className="request-summary">
        <div>
          <span>Total Requests</span>
          <strong>{requests.length}</strong>
        </div>
        <div>
          <span>Pending</span>
          <strong>{requests.filter(r => r.status === 'Pending').length}</strong>
        </div>
        <div>
          <span>Approved</span>
          <strong>{requests.filter(r => r.status === 'Approved').length}</strong>
        </div>
        <div>
          <span>Rejected</span>
          <strong>{requests.filter(r => r.status === 'Rejected').length}</strong>
        </div>
      </div>

      <div className="requests-management-card">

        <div className="requests-toolbar">
          <div className="requests-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search NGO, food or request ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="requests-filter">
            <Filter size={17} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="requests-list">
          {loading && (
  <div className="no-requests">
    <p>Loading incoming requests...</p>
  </div>
)}

          {filteredRequests.map((request) => (
            <div className="incoming-request-card" key={request.id}>

              <div className="incoming-request-top">
                <div className="ngo-identity">
                  <div className="ngo-avatar">{request.initials}</div>
                  <div>
                    <h3>{request.organisation}</h3>
                    <small>Request ID: {request.id}</small>
                  </div>
                </div>

                <span className={`request-status ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>

              <div className="incoming-request-details">

                <div>
                  <Utensils size={17} />
                  <span>
                    <small>Food Item</small>
                    <strong>{request.food}</strong>
                  </span>
                </div>

                <div>
                  <ClipboardList size={17} />
                  <span>
                    <small>Requested Quantity</small>
                    <strong>{request.quantity}</strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={17} />
                  <span>
                    <small>Request Date</small>
                    <strong>{request.date}</strong>
                  </span>
                </div>

                <div>
                  <Building2 size={17} />
                  <span>
                    <small>Collection Area</small>
                    <strong>{request.location}</strong>
                  </span>
                </div>

              </div>

              <div className="incoming-request-bottom">

                <button
                  className="request-view-button"
                  onClick={() => setSelectedRequest(request)}
                >
                  <Eye size={16} /> View Details
                </button>

                {request.status === 'Pending' && (
                  <div className="request-decision-buttons">
                    <button
                      className="request-reject-button"
                      onClick={() => updateStatus(request.id, 'Rejected')}
                    >
                      <XCircle size={16} /> Reject
                    </button>

                    <button
                      className="request-approve-button"
                      onClick={() => updateStatus(request.id, 'Approved')}
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}

          {!loading && filteredRequests.length === 0 && (
            <div className="no-requests">
              <ClipboardList size={36} />
              <h3>No requests found</h3>
              <p>Try changing your search or filter.</p>
            </div>
          )}

        </div>
      </div>

      {selectedRequest && (
        <div
          className="request-modal-overlay"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="request-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="request-modal-heading">
              <div>
                <p className="form-eyebrow">REQUEST INFORMATION</p>
                <h2>{selectedRequest.organisation}</h2>
              </div>

              <button onClick={() => setSelectedRequest(null)}>
                <X size={21} />
              </button>
            </div>

            <span className={`request-status ${selectedRequest.status.toLowerCase()}`}>
              {selectedRequest.status}
            </span>

            <div className="request-modal-info">
              <div>
                <small>Request ID</small>
                <strong>{selectedRequest.id}</strong>
              </div>

              <div>
                <small>Food Requested</small>
                <strong>{selectedRequest.food}</strong>
              </div>

              <div>
                <small>Quantity</small>
                <strong>{selectedRequest.quantity}</strong>
              </div>

              <div>
                <small>Collection Area</small>
                <strong>{selectedRequest.location}</strong>
              </div>

              <div>
                <small>Request Date</small>
                <strong>{selectedRequest.date}</strong>
              </div>
            </div>

            <div className="ngo-message">
              <small>Message from NGO</small>
              <p>{selectedRequest.message}</p>
            </div>

            {selectedRequest.status === 'Pending' && (
              <div className="request-modal-actions">
                <button
                  className="request-reject-button"
                  onClick={() => updateStatus(selectedRequest.id, 'Rejected')}
                >
                  Reject Request
                </button>

                <button
                  className="request-approve-button"
                  onClick={() => updateStatus(selectedRequest.id, 'Approved')}
                >
                  Approve Request
                </button>
              </div>
            )}

            <button
              className="request-modal-close"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default IncomingRequests;