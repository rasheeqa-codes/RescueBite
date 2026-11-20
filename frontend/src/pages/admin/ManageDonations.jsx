import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Building2,
  Package,
  MapPin,
  CalendarDays,
  Utensils,
  Clock,
  X,
  CheckCircle2
} from 'lucide-react';

import API from '../../services/api';

function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Fetch actual donations from MongoDB
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/admin/donations');

        setDonations(response.data.donations || []);
      } catch (error) {
        console.error('Error fetching donations:', error);

        setError(
          error.response?.data?.message ||
          'Unable to load donation information.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Generate donation ID
  const getDonationId = (donation) => {
    return donation._id
      ? `DON-${donation._id.slice(-6).toUpperCase()}`
      : 'Not available';
  };

  // Get donor name from populated donor information
  const getDonorName = (donation) => {
    return (
      donation.donor?.organizationName ||
      donation.donor?.fullName ||
      'Unknown Donor'
    );
  };

  // Format quantity
  const getQuantity = (donation) => {
    if (donation.quantity === undefined || donation.quantity === null) {
      return 'Not available';
    }

    return `${donation.quantity} ${donation.unit || ''}`.trim();
  };

  // Format dates
  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Search and filter donations
  const filteredDonations = donations.filter((donation) => {
    const search = searchTerm.toLowerCase();

    const foodName = (donation.foodName || '').toLowerCase();
    const donorName = getDonorName(donation).toLowerCase();
    const donorEmail = (donation.donor?.email || '').toLowerCase();
    const donationId = getDonationId(donation).toLowerCase();

    const matchesSearch =
      foodName.includes(search) ||
      donorName.includes(search) ||
      donorEmail.includes(search) ||
      donationId.includes(search);

    const matchesStatus =
      statusFilter === 'All' ||
      donation.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'All' ||
      donation.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Statistics from actual database records
  const availableCount = donations.filter(
    (item) => item.status === 'Available'
  ).length;

  const requestedCount = donations.filter(
    (item) =>
      item.status === 'Requested' ||
      item.status === 'Partially Requested'
  ).length;

  const collectedCount = donations.filter(
    (item) => item.status === 'Collected'
  ).length;

  const expiredCount = donations.filter(
    (item) => item.status === 'Expired'
  ).length;

  return (
    <div className="manage-donations-page">

      {/* Page Heading */}
      <div className="manage-donations-heading">
        <div>
          <p className="form-eyebrow">FOOD MANAGEMENT</p>
          <h1>Manage Donations</h1>
          <p>Monitor all registered food donation listings.</p>
        </div>

        <div className="manage-donations-heading-icon">
          <Package size={28} />
        </div>
      </div>

      {/* Statistics */}
      <div className="manage-donations-stats">

        <div className="manage-donation-stat">
          <div className="manage-donation-stat-icon total">
            <Package size={21} />
          </div>
          <div>
            <span>Total Donations</span>
            <h2>{donations.length}</h2>
          </div>
        </div>

        <div className="manage-donation-stat">
          <div className="manage-donation-stat-icon available">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Available</span>
            <h2>{availableCount}</h2>
          </div>
        </div>

        <div className="manage-donation-stat">
          <div className="manage-donation-stat-icon requested">
            <Clock size={21} />
          </div>
          <div>
            <span>Requested</span>
            <h2>{requestedCount}</h2>
          </div>
        </div>

        <div className="manage-donation-stat">
          <div className="manage-donation-stat-icon collected">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Collected</span>
            <h2>{collectedCount}</h2>
          </div>
        </div>

        <div className="manage-donation-stat">
          <div className="manage-donation-stat-icon expired">
            <CalendarDays size={21} />
          </div>
          <div>
            <span>Expired</span>
            <h2>{expiredCount}</h2>
          </div>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="manage-donations-toolbar">

        <div className="manage-donations-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search food, donor or donation ID..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="manage-donations-filter">
          <Filter size={17} />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Partially Requested">Partially Requested</option>
            <option value="Requested">Requested</option>
            <option value="Collected">Collected</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="manage-donations-filter">
          <Utensils size={17} />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Cooked Food">Cooked Food</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Bakery">Bakery</option>
          </select>
        </div>

      </div>

      {/* Donation List Heading */}
      <div className="manage-donations-list-heading">
        <div>
          <h2>Food Donation Listings</h2>
          <p>{filteredDonations.length} donations found</p>
        </div>
      </div>

      {/* Donation List */}
      <div className="manage-donations-list">

        {loading ? (

          <div className="manage-donations-empty">
            <p>Loading donation information...</p>
          </div>

        ) : error ? (

          <div className="manage-donations-empty">
            <h3>Unable to load donations</h3>
            <p>{error}</p>
          </div>

        ) : filteredDonations.length > 0 ? (

          filteredDonations.map((donation) => (

            <div className="manage-donation-card" key={donation._id}>

              <div className="manage-donation-main">

                <div className="manage-donation-avatar">
                  <Utensils size={23} />
                </div>

                <div className="manage-donation-info">
                  <h3>{donation.foodName || 'Unnamed Food Donation'}</h3>
                  <p>{getDonorName(donation)}</p>

                  <div className="manage-donation-meta">
                    <span>{getDonationId(donation)}</span>

                    <span>
                      <MapPin size={13} />
                      {donation.address || 'Location not provided'}
                    </span>

                    <span>{getQuantity(donation)}</span>
                  </div>
                </div>

              </div>

              <div className="manage-donation-status-area">

                <span
                  className={`manage-donation-status ${(donation.status || '').toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {donation.status}
                </span>

                <div className="manage-donation-actions">

                  <button
                    className="manage-donation-view"
                    onClick={() => setSelectedDonation(donation)}
                  >
                    <Eye size={16} />
                    View
                  </button>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="manage-donations-empty">
            <Package size={35} />
            <h3>No donations found</h3>
            <p>Try changing your search or filters.</p>
          </div>

        )}

      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (

        <div
          className="manage-donations-modal-overlay"
          onClick={() => setSelectedDonation(null)}
        >

          <div
            className="manage-donations-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="manage-donations-modal-header">
              <div>
                <h2>Donation Details</h2>
                <p>Complete food donation information</p>
              </div>

              <button onClick={() => setSelectedDonation(null)}>
                <X size={21} />
              </button>
            </div>

            <div className="manage-donations-modal-profile">

              <div className="manage-donation-avatar large">
                <Utensils size={30} />
              </div>

              <h3>{selectedDonation.foodName || 'Unnamed Food Donation'}</h3>

              <span
                className={`manage-donation-status ${(selectedDonation.status || '').toLowerCase().replace(/\s+/g, '-')}`}
              >
                {selectedDonation.status}
              </span>

            </div>

            <div className="manage-donations-details">

              <div>
                <Package size={18} />
                <section>
                  <span>Donation ID</span>
                  <strong>{getDonationId(selectedDonation)}</strong>
                </section>
              </div>

              <div>
                <Building2 size={18} />
                <section>
                  <span>Donor</span>
                  <strong>{getDonorName(selectedDonation)}</strong>
                </section>
              </div>

              <div>
                <Utensils size={18} />
                <section>
                  <span>Category</span>
                  <strong>{selectedDonation.category || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <Package size={18} />
                <section>
                  <span>Quantity</span>
                  <strong>{getQuantity(selectedDonation)}</strong>
                </section>
              </div>

              <div>
                <MapPin size={18} />
                <section>
                  <span>Location</span>
                  <strong>{selectedDonation.address || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <CalendarDays size={18} />
                <section>
                  <span>Listed Date</span>
                  <strong>{formatDate(selectedDonation.createdAt)}</strong>
                </section>
              </div>

              <div>
                <Clock size={18} />
                <section>
                  <span>Pickup Deadline</span>
                  <strong>{formatDate(selectedDonation.pickupDeadline)}</strong>
                </section>
              </div>

              <div>
                <Package size={18} />
                <section>
                  <span>Storage</span>
                  <strong>{selectedDonation.storage || 'Not provided'}</strong>
                </section>
              </div>

              <div>
                <Utensils size={18} />
                <section>
                  <span>Description</span>
                  <strong>{selectedDonation.notes || 'No description provided'}</strong>
                </section>
              </div>

            </div>

            <button
              className="manage-donations-modal-close"
              onClick={() => setSelectedDonation(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageDonations;