import { useState, useEffect } from 'react';
import API from '../../services/api.js';
import {
  Search, Filter, Package, CalendarDays, Clock,
  MapPin, Eye, Pencil, Trash2, PlusCircle,
  ChevronDown, Utensils, X
} from 'lucide-react';

function MyDonations({ onAddDonation }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [donations, setDonations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
useEffect(() => {
  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/donations/my-donations');

      const donationData = response.data.donations || [];

setDonations(
  donationData.map((item) => ({
    id: item._id,
    name: item.foodName,
    category: item.category,
    quantity: `${item.quantity} ${item.unit}`,
    date: new Date(item.createdAt).toLocaleDateString('en-IN'),
    deadline: new Date(item.pickupDeadline).toLocaleString('en-IN'),
    status: item.status,
    location: item.address,
    type: item.foodType,
    images: item.images || []
  }))
);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load your donations.'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDonations();
}, []);

  const filteredDonations = donations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this donation?'
  );

  if (!confirmed) return;

  try {
    const response = await API.delete(`/donations/${id}`);

    setDonations((previous) =>
      previous.filter((item) => item.id !== id)
    );

    alert(response.data.message || 'Donation deleted successfully!');
  } catch (err) {
    alert(
      err.response?.data?.message ||
      'Unable to delete donation.'
    );
  }
};

  return (
    <div className="my-donations-page">

      <div className="my-donations-header">
        <div>
          <p className="form-eyebrow">DONATION MANAGEMENT</p>
          <h1>My Donations</h1>
          <p>Manage and track all the food you have shared.</p>
        </div>

        <button className="add-donation-button" onClick={onAddDonation}>
          <PlusCircle size={19} /> Add New Donation
        </button>
      </div>

      <div className="donation-summary">
        <div>
          <span>Total Donations</span>
          <strong>{donations.length}</strong>
        </div>
        <div>
          <span>Available</span>
          <strong>{donations.filter(d => d.status === 'Available').length}</strong>
        </div>
        <div>
          <span>In Progress</span>
          <strong>{donations.filter(d => ['Requested', 'Approved'].includes(d.status)).length}</strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>{donations.filter(d => d.status === 'Collected').length}</strong>
        </div>
      </div>

      <div className="donation-management-card">

        <div className="donation-toolbar">
          <div className="donation-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by food name or donation ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="donation-filter">
            <Filter size={17} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Requested">Requested</option>
              <option value="Approved">Approved</option>
              <option value="Collected">Collected</option>
              <option value="Expired">Expired</option>
            </select>
            <ChevronDown size={15} />
          </div>
        </div>

        <div className="my-donations-table-wrapper">
          {loading && (
  <div className="no-donations">
    <p>Loading your donations...</p>
  </div>
)}

{!loading && error && (
  <div className="no-donations">
    <p>{error}</p>
  </div>
)}
          <table className="my-donations-table">
            <thead>
              <tr>
                <th>FOOD ITEM</th>
                <th>QUANTITY</th>
                <th>LISTED DATE</th>
                <th>PICKUP DEADLINE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredDonations.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="my-food-item">
                      <div className="my-food-icon">
                        <Utensils size={19} />
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        <small>{item.id} · {item.category}</small>
                      </div>
                    </div>
                  </td>

                  <td>{item.quantity}</td>

                  <td>
                    <div className="date-cell">
                      <CalendarDays size={15} />
                      {item.date}
                    </div>
                  </td>

                  <td>
                    <div className="date-cell">
                      <Clock size={15} />
                      {item.deadline}
                    </div>
                  </td>

                  <td>
                    <span className={`donation-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="donation-actions">
                      <button
                        title="View details"
                        onClick={() => setSelectedDonation(item)}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Delete donation"
                        onClick={() => handleDelete(item.id)}
                        disabled={['Collected', 'Expired'].includes(item.status)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && !error && filteredDonations.length === 0 && (
            <div className="no-donations">
              <Package size={35} />
              <h3>No donations found</h3>
              <p>Try changing your search or status filter.</p>
            </div>
          )}
        </div>

        <div className="donation-table-footer">
          Showing {filteredDonations.length} of {donations.length} donations
        </div>
      </div>

      {selectedDonation && (
        <div className="donation-modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="donation-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <p className="form-eyebrow">DONATION DETAILS</p>
                <h2>{selectedDonation.name}</h2>
              </div>
              <button onClick={() => setSelectedDonation(null)}>
                <X size={21} />
              </button>
            </div>

            <span className={`donation-status ${selectedDonation.status.toLowerCase()}`}>
              {selectedDonation.status}
            </span>

            <div className="donation-detail-grid">
              <div>
                <small>Donation ID</small>
                <strong>{selectedDonation.id}</strong>
              </div>
              <div>
                <small>Category</small>
                <strong>{selectedDonation.category}</strong>
              </div>
              <div>
                <small>Quantity</small>
                <strong>{selectedDonation.quantity}</strong>
              </div>
              <div>
                <small>Food Type</small>
                <strong>{selectedDonation.type}</strong>
              </div>
              <div>
                <small>Listed Date</small>
                <strong>{selectedDonation.date}</strong>
              </div>
              <div>
                <small>Pickup Deadline</small>
                <strong>{selectedDonation.deadline}</strong>
              </div>
              <div>
                <small>Pickup Location</small>
                <strong><MapPin size={14} /> {selectedDonation.location}</strong>
              </div>
            </div>

            <button className="modal-close-button" onClick={() => setSelectedDonation(null)}>
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default MyDonations;