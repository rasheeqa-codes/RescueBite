import { useEffect, useState } from 'react';
import API from '../../services/api.js';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  MapPin,
  Eye,
  X,
  Trash2
} from 'lucide-react';

function MyRequests() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch actual NGO requests
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/requests/my-requests');

      const formattedRequests = (response.data.requests || []).map((item) => {
        const food = item.donation || {};

        return {
          id: item._id,
          food: food.foodName || 'Food unavailable',
          donor:
            item.donor?.organizationName ||
            item.donor?.fullName ||
            'Unknown Donor',
          quantity: item.requestedQuantity,
          unit: food.unit || '',
          location:
            food.pickupAddress ||
            food.address ||
            food.location ||
            'Location unavailable',
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('en-IN')
            : 'Not available',
          status: item.status,
          deadline: food.pickupDeadline
            ? new Date(food.pickupDeadline).toLocaleString('en-IN')
            : 'Not specified'
        };
      });

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Fetch My Requests Error:', error);

      setError(
        error.response?.data?.message ||
        'Unable to load your requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.food.toLowerCase().includes(search.toLowerCase()) ||
      request.donor.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Cancel a pending request
  const cancelRequest = async (id) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this request?'
    );

    if (!confirmCancel) return;

    try {
      await API.patch(`/requests/${id}/cancel`);

      setSelectedRequest(null);

      alert('Request cancelled successfully!');

      fetchMyRequests();
    } catch (error) {
      console.error('Cancel Request Error:', error);

      alert(
        error.response?.data?.message ||
        'Unable to cancel request.'
      );
    }
  };
    // Confirm food collection
  const confirmCollection = async (id) => {
    const confirmCollect = window.confirm(
      'Has your organisation physically received this food donation?'
    );

    if (!confirmCollect) return;

    try {
      const response = await API.patch(`/requests/${id}/collect`);

      const updatedStatus = response.data.request.status;

      setRequests((previous) =>
        previous.map((request) =>
          request.id === id
            ? { ...request, status: updatedStatus }
            : request
        )
      );

      setSelectedRequest((previous) =>
        previous?.id === id
          ? { ...previous, status: updatedStatus }
          : previous
      );

      alert(response.data.message || 'Food collection confirmed successfully!');

    } catch (error) {
      console.error('Confirm Collection Error:', error);

      alert(
        error.response?.data?.message ||
        'Unable to confirm food collection.'
      );
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Approved') return <CheckCircle2 size={15} />;
    if (status === 'Rejected') return <XCircle size={15} />;
    if (status === 'Collected') return <Package size={15} />;
    return <Clock size={15} />;
  };

  return (
    <div className="ngo-requests-page">

      <div className="ngo-page-heading">
        <div>
          <h2>My Requests</h2>
          <p>Track and manage your food donation requests.</p>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="ngo-request-stats">

        <div className="ngo-request-stat">
          <span>Total Requests</span>
          <h3>{requests.length}</h3>
        </div>

        <div className="ngo-request-stat">
          <span>Pending</span>
          <h3>{requests.filter(r => r.status === 'Pending').length}</h3>
        </div>

        <div className="ngo-request-stat">
          <span>Approved</span>
          <h3>{requests.filter(r => r.status === 'Approved').length}</h3>
        </div>

        <div className="ngo-request-stat">
          <span>Collected</span>
          <h3>{requests.filter(r => r.status === 'Collected').length}</h3>
        </div>

      </div>

      {/* Search and Filter */}

      <div className="ngo-requests-toolbar">

        <div className="ngo-food-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search food, donor or request ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Collected">Collected</option>
        </select>

      </div>

      {/* Requests Table */}

      <div className="ngo-requests-table-wrapper">

        <table className="ngo-requests-table">

          <thead>
            <tr>
              <th>Request ID</th>
              <th>Food Item</th>
              <th>Donor</th>
              <th>Quantity</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="7" className="ngo-empty-requests">
                  Loading your requests...
                </td>
              </tr>

            ) : error ? (

              <tr>
                <td colSpan="7" className="ngo-empty-requests">
                  {error}
                  <button onClick={fetchMyRequests}>Try Again</button>
                </td>
              </tr>

            ) : filteredRequests.length > 0 ? (

              filteredRequests.map((request) => (

                <tr key={request.id}>

                  <td>{request.id.slice(-8)}</td>

                  <td className="ngo-request-food-name">
                    {request.food}
                  </td>

                  <td>{request.donor}</td>

                  <td>
                    {request.quantity} {request.unit}
                  </td>

                  <td>{request.date}</td>

                  <td>
                    <span className={`ngo-request-status ${request.status.toLowerCase()}`}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="ngo-view-request"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="7" className="ngo-empty-requests">
                  No requests found.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Request Details Modal */}

      {selectedRequest && (

        <div className="ngo-modal-overlay">

          <div className="ngo-request-modal">

            <button
              className="ngo-modal-close"
              onClick={() => setSelectedRequest(null)}
            >
              <X size={21} />
            </button>

            <h2>Request Details</h2>

            <p>Request ID: {selectedRequest.id}</p>

            <div className="ngo-request-detail-list">

              <div>
                <span>Food Item</span>
                <strong>{selectedRequest.food}</strong>
              </div>

              <div>
                <span>Donor</span>
                <strong>{selectedRequest.donor}</strong>
              </div>

              <div>
                <span>Requested Quantity</span>
                <strong>
                  {selectedRequest.quantity} {selectedRequest.unit}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  <MapPin size={14} />
                  {selectedRequest.location}
                </strong>
              </div>

              <div>
                <span>Request Date</span>
                <strong>
                  <CalendarDays size={14} />
                  {selectedRequest.date}
                </strong>
              </div>

              <div>
                <span>Pickup Deadline</span>
                <strong>{selectedRequest.deadline}</strong>
              </div>

              <div>
                <span>Current Status</span>
                <strong>{selectedRequest.status}</strong>
              </div>

            </div>

            {selectedRequest.status === 'Pending' && (

              <button
                className="ngo-cancel-request"
                onClick={() => cancelRequest(selectedRequest.id)}
              >
                <Trash2 size={16} />
                Cancel Request
              </button>

            )}
            {selectedRequest.status === 'Approved' && (

  <button
    className="ngo-cancel-request"
    onClick={() => confirmCollection(selectedRequest.id)}
  >
    <CheckCircle2 size={16} />
    Confirm Collection
  </button>

)}

          </div>

        </div>

      )}

    </div>
  );
}

export default MyRequests;