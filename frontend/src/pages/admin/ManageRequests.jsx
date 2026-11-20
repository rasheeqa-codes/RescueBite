import { useState } from 'react';
import {
  Search, Filter, Eye, X, ClipboardList,
  CheckCircle2, XCircle, Clock, PackageCheck
} from 'lucide-react';

function ManageRequests() {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-1001',
      food: 'Vegetable Rice',
      ngo: 'Helping Hands Foundation',
      donor: 'Green Leaf Restaurant',
      quantity: '15 servings',
      date: '18 Nov 2026',
      status: 'Pending',
      location: 'RS Puram, Coimbatore',
      phone: '9876543210',
      notes: 'Required for evening food distribution.'
    },
    {
      id: 'REQ-1002',
      food: 'Fresh Apples',
      ngo: 'Hope Trust',
      donor: 'Fresh Mart',
      quantity: '5 kg',
      date: '17 Nov 2026',
      status: 'Approved',
      location: 'Gandhipuram, Coimbatore',
      phone: '9876543211',
      notes: 'For children at our care centre.'
    },
    {
      id: 'REQ-1003',
      food: 'Chapati and Dal',
      ngo: 'Care and Share NGO',
      donor: 'Annapoorna Hotel',
      quantity: '25 servings',
      date: '16 Nov 2026',
      status: 'Collected',
      location: 'Peelamedu, Coimbatore',
      phone: '9876543212',
      notes: 'Food collected successfully.'
    },
    {
      id: 'REQ-1004',
      food: 'Bread Packets',
      ngo: 'Helping Hearts',
      donor: 'Daily Bake Bakery',
      quantity: '20 packets',
      date: '15 Nov 2026',
      status: 'Rejected',
      location: 'Singanallur, Coimbatore',
      phone: '9876543213',
      notes: 'Request could not be fulfilled.'
    },
    {
      id: 'REQ-1005',
      food: 'Fresh Vegetables',
      ngo: 'Hope Trust',
      donor: 'Organic Farm',
      quantity: '8 kg',
      date: '18 Nov 2026',
      status: 'Pending',
      location: 'Saibaba Colony, Coimbatore',
      phone: '9876543214',
      notes: 'Needed for community kitchen.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const updateStatus = (id, newStatus) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    );

    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: newStatus }));
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.food.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const collectedCount = requests.filter(r => r.status === 'Collected').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  return (
    <div className="manage-requests-page">

      <div className="admin-page-heading">
        <div>
          <h2>Manage Requests</h2>
          <p>Monitor and manage food requests submitted by NGOs.</p>
        </div>
      </div>

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

      <div className="admin-table-card">

        <div className="admin-table-toolbar">

          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search food, NGO or request ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-filter-box">
            <Filter size={17} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Collected">Collected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>

        <div className="admin-table-wrapper">
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
              {filteredRequests.map(request => (
                <tr key={request.id}>
                  <td className="admin-id-cell">{request.id}</td>
                  <td className="admin-name-cell">{request.food}</td>
                  <td>{request.ngo}</td>
                  <td>{request.quantity}</td>
                  <td>{request.date}</td>
                  <td>
                    <span className={`admin-status-badge ${request.status.toLowerCase()}`}>
                      {request.status}
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
              <p>Try changing your search or status filter.</p>
            </div>
          )}
        </div>

      </div>

      <div className="admin-request-summary">
        <span>Rejected Requests</span>
        <strong>{rejectedCount}</strong>
      </div>

      {selectedRequest && (
        <div className="admin-modal-overlay">
          <div className="admin-details-modal">

            <div className="admin-modal-header">
              <div>
                <h3>Request Details</h3>
                <p>{selectedRequest.id}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)}>
                <X size={21} />
              </button>
            </div>

            <div className="admin-modal-content">

              <div className="admin-detail-row">
                <span>Food Item</span>
                <strong>{selectedRequest.food}</strong>
              </div>

              <div className="admin-detail-row">
                <span>NGO Name</span>
                <strong>{selectedRequest.ngo}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Food Donor</span>
                <strong>{selectedRequest.donor}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Requested Quantity</span>
                <strong>{selectedRequest.quantity}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Request Date</span>
                <strong>{selectedRequest.date}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Contact Number</span>
                <strong>{selectedRequest.phone}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Location</span>
                <strong>{selectedRequest.location}</strong>
              </div>

              <div className="admin-detail-row">
                <span>Current Status</span>
                <strong>{selectedRequest.status}</strong>
              </div>

              <div className="admin-detail-notes">
                <span>Additional Notes</span>
                <p>{selectedRequest.notes}</p>
              </div>

            </div>

            <div className="admin-modal-actions">

              {selectedRequest.status === 'Pending' && (
                <>
                  <button
                    className="admin-approve-btn"
                    onClick={() => updateStatus(selectedRequest.id, 'Approved')}
                  >
                    <CheckCircle2 size={17} />
                    Approve
                  </button>

                  <button
                    className="admin-reject-btn"
                    onClick={() => updateStatus(selectedRequest.id, 'Rejected')}
                  >
                    <XCircle size={17} />
                    Reject
                  </button>
                </>
              )}

              {selectedRequest.status === 'Approved' && (
                <button
                  className="admin-approve-btn"
                  onClick={() => updateStatus(selectedRequest.id, 'Collected')}
                >
                  <PackageCheck size={17} />
                  Mark as Collected
                </button>
              )}

              <button
                className="admin-cancel-btn"
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