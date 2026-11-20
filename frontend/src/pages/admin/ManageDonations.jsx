import { useState } from 'react';
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
  Trash2,
  CheckCircle2
} from 'lucide-react';

function ManageDonations() {
  const [donations, setDonations] = useState([
    {
      id: 'DON001',
      food: 'Vegetable Rice',
      donor: 'Green Harvest Restaurant',
      category: 'Cooked Food',
      quantity: '25 servings',
      location: 'Coimbatore',
      date: '18 Nov 2026',
      expiry: '18 Nov 2026',
      status: 'Available',
      storage: 'Refrigerated',
      description: 'Freshly prepared vegetable rice.'
    },
    {
      id: 'DON002',
      food: 'Fresh Apples',
      donor: 'Fresh Mart',
      category: 'Fruits',
      quantity: '10 kg',
      location: 'Chennai',
      date: '17 Nov 2026',
      expiry: '20 Nov 2026',
      status: 'Requested',
      storage: 'Room Temperature',
      description: 'Fresh apples suitable for distribution.'
    },
    {
      id: 'DON003',
      food: 'Chapati and Dal',
      donor: 'Daily Meals Kitchen',
      category: 'Cooked Food',
      quantity: '40 servings',
      location: 'Tiruppur',
      date: '16 Nov 2026',
      expiry: '16 Nov 2026',
      status: 'Collected',
      storage: 'Insulated Container',
      description: 'Chapati with freshly prepared dal.'
    },
    {
      id: 'DON004',
      food: 'Bread Packets',
      donor: 'Sunrise Bakery',
      category: 'Bakery',
      quantity: '30 packets',
      location: 'Erode',
      date: '14 Nov 2026',
      expiry: '15 Nov 2026',
      status: 'Expired',
      storage: 'Room Temperature',
      description: 'Packaged bread available for collection.'
    },
    {
      id: 'DON005',
      food: 'Fresh Vegetables',
      donor: 'Organic Farm',
      category: 'Vegetables',
      quantity: '15 kg',
      location: 'Salem',
      date: '18 Nov 2026',
      expiry: '21 Nov 2026',
      status: 'Available',
      storage: 'Room Temperature',
      description: 'Freshly harvested seasonal vegetables.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDonation, setSelectedDonation] = useState(null);

  const filteredDonations = donations.filter((donation) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      donation.food.toLowerCase().includes(search) ||
      donation.donor.toLowerCase().includes(search) ||
      donation.id.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'All' ||
      donation.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'All' ||
      donation.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const updateStatus = (id, newStatus) => {
    setDonations((previous) =>
      previous.map((donation) =>
        donation.id === id
          ? { ...donation, status: newStatus }
          : donation
      )
    );

    setSelectedDonation((previous) =>
      previous?.id === id
        ? { ...previous, status: newStatus }
        : previous
    );
  };

  const removeDonation = (id) => {
    setDonations((previous) =>
      previous.filter((donation) => donation.id !== id)
    );

    setSelectedDonation(null);
  };

  const availableCount = donations.filter(
    (item) => item.status === 'Available'
  ).length;

  const requestedCount = donations.filter(
    (item) => item.status === 'Requested'
  ).length;

  const collectedCount = donations.filter(
    (item) => item.status === 'Collected'
  ).length;

  const expiredCount = donations.filter(
    (item) => item.status === 'Expired'
  ).length;

  return (
    <div className="manage-donations-page">

      <div className="manage-donations-heading">
        <div>
          <p className="form-eyebrow">FOOD MANAGEMENT</p>
          <h1>Manage Donations</h1>
          <p>Monitor and manage all food donation listings.</p>
        </div>

        <div className="manage-donations-heading-icon">
          <Package size={28} />
        </div>
      </div>

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

      <div className="manage-donations-list-heading">
        <div>
          <h2>Food Donation Listings</h2>
          <p>{filteredDonations.length} donations found</p>
        </div>
      </div>

      <div className="manage-donations-list">

        {filteredDonations.length > 0 ? (

          filteredDonations.map((donation) => (

            <div className="manage-donation-card" key={donation.id}>

              <div className="manage-donation-main">

                <div className="manage-donation-avatar">
                  <Utensils size={23} />
                </div>

                <div className="manage-donation-info">
                  <h3>{donation.food}</h3>
                  <p>{donation.donor}</p>

                  <div className="manage-donation-meta">
                    <span>{donation.id}</span>
                    <span>
                      <MapPin size={13} />
                      {donation.location}
                    </span>
                    <span>{donation.quantity}</span>
                  </div>
                </div>

              </div>

              <div className="manage-donation-status-area">

                <span className={`manage-donation-status ${donation.status.toLowerCase()}`}>
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

                  {donation.status !== 'Collected' &&
                    donation.status !== 'Expired' && (
                      <button
                        className="manage-donation-remove"
                        onClick={() => removeDonation(donation.id)}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}

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

              <h3>{selectedDonation.food}</h3>

              <span className={`manage-donation-status ${selectedDonation.status.toLowerCase()}`}>
                {selectedDonation.status}
              </span>
            </div>

            <div className="manage-donations-details">

              <div>
                <Package size={18} />
                <section>
                  <span>Donation ID</span>
                  <strong>{selectedDonation.id}</strong>
                </section>
              </div>

              <div>
                <Building2 size={18} />
                <section>
                  <span>Donor</span>
                  <strong>{selectedDonation.donor}</strong>
                </section>
              </div>

              <div>
                <Utensils size={18} />
                <section>
                  <span>Category</span>
                  <strong>{selectedDonation.category}</strong>
                </section>
              </div>

              <div>
                <Package size={18} />
                <section>
                  <span>Quantity</span>
                  <strong>{selectedDonation.quantity}</strong>
                </section>
              </div>

              <div>
                <MapPin size={18} />
                <section>
                  <span>Location</span>
                  <strong>{selectedDonation.location}</strong>
                </section>
              </div>

              <div>
                <CalendarDays size={18} />
                <section>
                  <span>Listed Date</span>
                  <strong>{selectedDonation.date}</strong>
                </section>
              </div>

              <div>
                <Clock size={18} />
                <section>
                  <span>Pickup Deadline</span>
                  <strong>{selectedDonation.expiry}</strong>
                </section>
              </div>

              <div>
                <Package size={18} />
                <section>
                  <span>Storage</span>
                  <strong>{selectedDonation.storage}</strong>
                </section>
              </div>

              <div>
                <Utensils size={18} />
                <section>
                  <span>Description</span>
                  <strong>{selectedDonation.description}</strong>
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