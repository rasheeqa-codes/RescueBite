import { useState, useEffect } from 'react';
import API from '../../services/api.js';
import {
  Search,
  Filter,
  History,
  CheckCircle2,
  CalendarDays,
  MapPin,
  Package,
  Building2
} from 'lucide-react';

function CollectionHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [collections, setCollections] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchCollections = async () => {
    try {
      setLoading(true);

      const response = await API.get('/requests/incoming');

      const requestData = response.data.requests || [];

      const completedCollections = requestData.filter(
        (item) => item.status === 'Collected'
      );

      setCollections(
        completedCollections.map((item) => ({
          id: item._id,
          organisation:
            item.ngo?.organizationName ||
            item.ngo?.fullName ||
            'NGO',
          food: item.donation?.foodName || 'Food Donation',
          quantity: `${item.requestedQuantity} ${
            item.donation?.unit || ''
          }`.trim(),
          date: item.createdAt
  ? new Date(item.createdAt).toLocaleDateString('en-IN')
  : 'Not available',
          location:
  item.donation?.pickupAddress ||
  item.donation?.address ||
  item.donation?.location ||
  'Location unavailable',
          status: item.status
        }))
      );

    } catch (error) {
      console.error('Failed to fetch collection history:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCollections();
}, []);

  const filteredCollections = collections.filter((item) => {
    const matchesSearch =
      item.organisation.toLowerCase().includes(search.toLowerCase()) ||
      item.food.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="collection-history-page">

      <div className="history-header">
        <div>
          <p className="form-eyebrow">DONATION RECORDS</p>
          <h1>Collection History</h1>
          <p>Track your completed food donations and collections.</p>
        </div>

        <div className="history-icon">
          <History size={25} />
        </div>
      </div>

      <div className="history-summary">
        <div>
          <span>Total Collections</span>
          <strong>{collections.length}</strong>
        </div>

        <div>
          <span>Successful Collections</span>
          <strong>{collections.filter(c => c.status === 'Collected').length}</strong>
        </div>

        <div>
          <span>Food Distributed</span>
          <strong>
  {collections.reduce(
    (total, item) => total + Number(item.quantity.split(' ')[0] || 0),
    0
  )} Items
</strong>
        </div>
      </div>

      <div className="history-management-card">

        <div className="history-toolbar">

          <div className="history-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search NGO, food or collection ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="history-filter">
            <Filter size={17} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Collections</option>
              <option value="Collected">Collected</option>
            </select>
          </div>

        </div>

        <div className="history-list">
          {loading ? (

  <div className="history-empty">
    <p>Loading collection history...</p>
  </div>

) : filteredCollections.length > 0 ? (

            filteredCollections.map((item) => (

              <div className="history-card" key={item.id}>

                <div className="history-card-top">

                  <div className="history-ngo">
                    <div className="history-avatar">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <h3>{item.organisation}</h3>
                      <small>Collection ID: {item.id}</small>
                    </div>
                  </div>

                  <span className="history-status">
                    <CheckCircle2 size={15} />
                    {item.status}
                  </span>

                </div>

                <div className="history-details">

                  <div>
                    <Package size={17} />
                    <span>
                      <small>Food Item</small>
                      <strong>{item.food}</strong>
                    </span>
                  </div>

                  <div>
                    <Package size={17} />
                    <span>
                      <small>Quantity</small>
                      <strong>{item.quantity}</strong>
                    </span>
                  </div>

                  <div>
                    <CalendarDays size={17} />
                    <span>
                      <small>Request Date</small>
                      <strong>{item.date}</strong>
                    </span>
                  </div>

                  <div>
                    <MapPin size={17} />
                    <span>
                      <small>Location</small>
                      <strong>{item.location}</strong>
                    </span>
                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="history-empty">
              <History size={35} />
              <h3>No collection records found</h3>
              <p>Try searching with another NGO name or food item.</p>
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default CollectionHistory;