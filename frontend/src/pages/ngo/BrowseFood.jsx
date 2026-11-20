import { useToast } from '../../context/ToastContext.jsx';
import { useEffect, useState } from 'react';
import API from '../../services/api.js';
import {
  Search,
  MapPin,
  Clock,
  Package,
  Utensils,
  CalendarDays,
  Heart,
  Filter,
  X,
  CheckCircle2
} from 'lucide-react';

function BrowseFood() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestedIds, setRequestedIds] = useState([]);

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch real available donations
  const fetchAvailableDonations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await API.get('/donations/available');

      setFoods(response.data.donations || []);
    } catch (error) {
      console.error('Fetch Donations Error:', error);

      setError(
        error.response?.data?.message ||
        'Unable to load available donations.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDonations();
  }, []);

  const categories = [
    'All',
    'Cooked Meals',
    'Bakery Items',
    'Fruits',
    'Vegetables',
    'Dairy Products',
    'Packaged Food'
  ];

  // Format date and time
  const formatDate = (date) => {
    if (!date) return 'Not specified';

    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Convert database donations into display values
  const getFoodDetails = (food) => ({
  id: food._id,
  name: food.foodName,
  category: food.category,
  quantity: food.quantity,
  unit: food.unit,

  images: food.images || [],

  location:
    food.pickupAddress ||
    food.address ||
    food.location ||
    (
      food.pickupLocation
        ? `${food.pickupLocation.latitude}, ${food.pickupLocation.longitude}`
        : 'Location unavailable'
    ),

  donor:
    food.donor?.organizationName ||
    food.donor?.fullName ||
    'Unknown Donor',

  preparedAt: formatDate(food.preparedAt),
  deadline: formatDate(food.pickupDeadline),
  foodType: food.foodType || 'Not specified',
  storage: food.storage || 'Not specified',
  allergens: food.allergens || 'Not specified',
  description: food.description || 'No description available.',
  distanceKm: food.distanceKm
});
  const filteredFoods = foods
    .map(getFoodDetails)
    .filter((food) => {
      const matchesSearch =
        food.name?.toLowerCase().includes(search.toLowerCase()) ||
        food.donor.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'All' || food.category === category;

      const matchesLocation =
        food.location.toLowerCase().includes(location.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });

  // Submit food request to backend
  const handleRequest = async () => {
    if (!requestQuantity || Number(requestQuantity) <= 0) {
      showToast('Please enter a valid quantity.', 'warning');
      return;
    }

    if (Number(requestQuantity) > selectedFood.quantity) {
      ashowToast(
  `Only ${selectedFood.quantity} ${selectedFood.unit} are available.`,
  'warning'
);
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post('/requests', {
        donationId: selectedFood.id,
        requestedQuantity: Number(requestQuantity)
      });

      setRequestedIds((previous) => [
        ...previous,
        selectedFood.id
      ]);

      showToast(
  response.data.message || 'Food request submitted successfully!',
  'success'
);

      setSelectedFood(null);
      setRequestQuantity('');

      fetchAvailableDonations();

    } catch (error) {
      console.error('Food Request Error:', error);

      showToast(
  error.response?.data?.message ||
  'Unable to submit food request. Please try again.',
  'error'
);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ngo-browse-page">

      <div className="ngo-page-heading">
        <div>
          <h2>Browse Available Food</h2>
          <p>Discover surplus food donations available for collection.</p>
        </div>

        <div className="ngo-available-count">
          <Package size={18} />
          {filteredFoods.length} Donations Available
        </div>
      </div>

      {/* Search and Filters */}

      <div className="ngo-food-filters">

        <div className="ngo-food-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search food or donor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ngo-food-search ngo-location-search">
          <MapPin size={19} />
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

      </div>

      <div className="ngo-category-filters">
        <Filter size={18} />

        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? 'active' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Food Donation Cards */}

      <div className="ngo-food-grid">

        {loading ? (

          <div className="ngo-no-food">
            <Package size={40} />
            <h3>Loading donations...</h3>
          </div>

        ) : error ? (

          <div className="ngo-no-food">
            <h3>Unable to load donations</h3>
            <p>{error}</p>
            <button onClick={fetchAvailableDonations}>
              Try Again
            </button>
          </div>

        ) : filteredFoods.length > 0 ? (

          filteredFoods.map((food) => (

            <div className="ngo-food-card" key={food.id}>
              {food.images.length > 0 ? (
  <img
    src={`http://localhost:5000${food.images[0]}`}
    alt={food.name}
    className="ngo-food-image"
  />
) : (
  <div className="ngo-food-image-placeholder">
    <Package size={40} />
    <span>No image available</span>
  </div>
)}

              <div className="ngo-food-card-top">
                <span className="ngo-food-category">
                  {food.category}
                </span>

                <Heart size={19} />
              </div>

              <h3>{food.name}</h3>

              <p className="ngo-food-donor">
                Donated by {food.donor}
              </p>

              <div className="ngo-food-details">

                <div>
                  <Package size={17} />
                  <span>
                    {food.quantity} {food.unit} available
                  </span>
                </div>

                <div>
                  <MapPin size={17} />
                  <span>{food.location}</span>
                </div>

                <div>
                  <MapPin size={17} />
                  <span>
                    Distance: {food.distanceKm ?? 'N/A'}
                    {food.distanceKm !== undefined ? ' km' : ''}
                  </span>
                </div>

                <div>
                  <Clock size={17} />
                  <span>Prepared at {food.preparedAt}</span>
                </div>

                <div>
                  <CalendarDays size={17} />
                  <span>Pickup: {food.deadline}</span>
                </div>

              </div>

              <div className="ngo-food-safety">
                <Utensils size={17} />
                <div>
                  <strong>{food.foodType}</strong>
                  <p>Storage: {food.storage}</p>
                  <p>Allergens: {food.allergens}</p>
                </div>
              </div>

              <p className="ngo-food-description">
                {food.description}
              </p>

              {requestedIds.includes(food.id) ? (

                <button className="ngo-requested-button" disabled>
                  <CheckCircle2 size={18} />
                  Request Submitted
                </button>

              ) : (

                <button
                  className="ngo-request-button"
                  onClick={() => setSelectedFood(food)}
                >
                  Request Food
                </button>

              )}

            </div>

          ))

        ) : (

          <div className="ngo-no-food">
            <Package size={40} />
            <h3>No donations found</h3>
            <p>Try changing your search or filters.</p>
          </div>

        )}

      </div>

      {/* Request Quantity Modal */}

      {selectedFood && (

        <div className="ngo-modal-overlay">

          <div className="ngo-request-modal">

            <button
              className="ngo-modal-close"
              onClick={() => {
                setSelectedFood(null);
                setRequestQuantity('');
              }}
              disabled={submitting}
            >
              <X size={21} />
            </button>

            <h2>Request Food</h2>
            <p>Enter the quantity your organisation needs.</p>

            <div className="ngo-modal-food-info">
              <h3>{selectedFood.name}</h3>
              <span>
                Available: {selectedFood.quantity} {selectedFood.unit}
              </span>
            </div>

            <label>Requested Quantity</label>

            <div className="ngo-quantity-input">
              <input
                type="number"
                min="1"
                max={selectedFood.quantity}
                value={requestQuantity}
                onChange={(e) => setRequestQuantity(e.target.value)}
                placeholder="Enter quantity"
                disabled={submitting}
              />

              <span>{selectedFood.unit}</span>
            </div>

            <button
              className="ngo-confirm-request"
              onClick={handleRequest}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>

            <button
              className="ngo-cancel-request"
              onClick={() => {
                setSelectedFood(null);
                setRequestQuantity('');
              }}
              disabled={submitting}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default BrowseFood;