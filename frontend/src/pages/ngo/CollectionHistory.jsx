import { useEffect, useState } from 'react';
import API from '../../services/api.js';
import {
  Search,
  Package,
  CheckCircle2,
  CalendarDays,
  MapPin,
  Eye,
  X
} from 'lucide-react';

function NGOCollectionHistory() {
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);

  const [collections, setCollections] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/requests/my-requests');

      const collectedRequests = (response.data.requests || [])
        .filter((item) => item.status === 'Collected')
        .map((item) => {
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
            status: item.status
          };
        });

      setCollections(collectedRequests);
    } catch (err) {
      console.error('Fetch Collection History Error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to load collection history.'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchCollections();
}, []);
  const filteredCollections = collections.filter((item) =>
    item.food.toLowerCase().includes(search.toLowerCase()) ||
    item.donor.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalQuantity = collections.reduce(
  (total, item) => total + (Number(item.quantity) || 0),
  0
);

  return (
    <div className="ngo-collection-page">

      <div className="ngo-page-heading">
        <div>
          <h2>Collection History</h2>
          <p>View all food donations successfully collected by your organisation.</p>
        </div>
      </div>

      {/* Summary */}

      <div className="ngo-collection-summary">

        <div className="ngo-collection-summary-card">
          <div className="ngo-collection-icon">
            <Package size={21} />
          </div>
          <div>
            <span>Total Collections</span>
            <h3>{collections.length}</h3>
          </div>
        </div>

        <div className="ngo-collection-summary-card">
          <div className="ngo-collection-icon">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Successful Collections</span>
            <h3>{collections.length}</h3>
          </div>
        </div>

        <div className="ngo-collection-summary-card">
          <div className="ngo-collection-icon">
            <Package size={21} />
          </div>
          <div>
            <span>Total Quantity</span>
            <h3>{totalQuantity}</h3>
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="ngo-collection-toolbar">

        <div className="ngo-food-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search food, donor or collection ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Collection Cards */}

      {/* Collection Cards */}

<div className="ngo-collection-list">

  {loading ? (

    <div className="ngo-no-food">
      <Package size={40} />
      <h3>Loading collection history...</h3>
    </div>

  ) : error ? (

    <div className="ngo-no-food">
      <Package size={40} />
      <h3>{error}</h3>
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>

  ) : filteredCollections.length > 0 ? (

    filteredCollections.map((item) => (

      <div className="ngo-collection-card" key={item.id}>

        <div className="ngo-collection-card-header">

          <div>
            <span className="ngo-collection-id">{item.id}</span>
            <h3>{item.food}</h3>
            <p>Donated by {item.donor}</p>
          </div>

          <span className="ngo-collected-badge">
            <CheckCircle2 size={15} />
            Collected
          </span>

        </div>

        <div className="ngo-collection-card-details">

          <div>
            <Package size={17} />
            <span>{item.quantity} {item.unit}</span>
          </div>

          <div>
            <MapPin size={17} />
            <span>{item.location}</span>
          </div>

          <div>
            <CalendarDays size={17} />
            <span>{item.date}</span>
          </div>

        </div>

        <button
          className="ngo-collection-view"
          onClick={() => setSelectedCollection(item)}
        >
          <Eye size={16} />
          View Details
        </button>

      </div>

    ))

  ) : (

    <div className="ngo-no-food">
      <Package size={40} />
      <h3>No collection records found</h3>
      <p>Try searching with another food name or donor.</p>
    </div>

  )}

</div>

      {/* Details Modal */}

      {selectedCollection && (

        <div className="ngo-modal-overlay">

          <div className="ngo-request-modal">

            <button
              className="ngo-modal-close"
              onClick={() => setSelectedCollection(null)}
            >
              <X size={21} />
            </button>

            <h2>Collection Details</h2>

            <p>Collection ID: {selectedCollection.id}</p>

            <div className="ngo-request-detail-list">

              <div>
                <span>Food Item</span>
                <strong>{selectedCollection.food}</strong>
              </div>

              <div>
                <span>Donor</span>
                <strong>{selectedCollection.donor}</strong>
              </div>

              <div>
                <span>Quantity</span>
                <strong>
                  {selectedCollection.quantity} {selectedCollection.unit}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedCollection.location}</strong>
              </div>

              <div>
                <span>Request Date</span>
                <strong>{selectedCollection.date}</strong>
              </div>

              <div>
                <span>Collection Time</span>
                <strong>{selectedCollection.time}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong className="ngo-detail-success">Collected</strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default NGOCollectionHistory;