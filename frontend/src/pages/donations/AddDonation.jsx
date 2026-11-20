import { useToast } from '../../context/ToastContext.jsx';
import { useState } from 'react';
import MapPicker from '../../components/MapPicker.jsx';
import {
  ArrowLeft, Leaf, Utensils, Clock, MapPin,
  Package, CalendarDays, Info, CheckCircle2
} from 'lucide-react';

function AddDonation({ onBack, onSubmit }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    foodName: '',
    category: '',
    quantity: '',
    unit: 'Packs',
    foodType: 'Vegetarian',
    preparedAt: '',
    pickupDeadline: '',
    storage: '',
    allergens: [],
    address: '',
pickupLatitude: '',
pickupLongitude: '',
distributionRadiusKm: '5',
notes: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const [message, setMessage] = useState('');

  const allergenOptions = [
    'Milk', 'Peanuts', 'Tree nuts', 'Wheat/Gluten',
    'Soy', 'Eggs', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };
  const handleLocationSelect = (location) => {
  setFormData((previous) => ({
    ...previous,
    pickupLatitude: location.latitude,
    pickupLongitude: location.longitude
  }));
};
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  if (files.length > 5) {
    showToast('You can upload a maximum of 5 images.', 'warning');
    e.target.value = '';
    return;
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  const invalidFile = files.find(
    (file) =>
      !allowedTypes.includes(file.type) ||
      file.size > 5 * 1024 * 1024
  );

  if (invalidFile) {
    showToast(
  'Only JPG, PNG and WEBP images up to 5 MB each are allowed.',
  'error'
);
    e.target.value = '';
    return;
  }

  setSelectedImages(files);
};
  const handleAllergen = (allergen) => {
    setFormData((previous) => ({
      ...previous,
      allergens: previous.allergens.includes(allergen)
        ? previous.allergens.filter((item) => item !== allergen)
        : [...previous.allergens, allergen]
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const preparedTime = new Date(formData.preparedAt);
  const deadline = new Date(formData.pickupDeadline);

  if (deadline <= preparedTime) {
    setMessage('Pickup deadline must be after preparation time.');
    return;
  }

  if (preparedTime > new Date()) {
    setMessage('Preparation time cannot be in the future.');
    return;
  }

  if (
    formData.pickupLatitude === '' ||
    formData.pickupLongitude === ''
  ) {
    setMessage('Please select a pickup location on the map.');
    return;
  }

  if (onSubmit) {
    try {
      const success = await onSubmit({
        ...formData,
        images: selectedImages
      });

      if (success) {
        onBack();
      } else {
        setMessage('Failed to save donation. Please try again.');
      }
    } catch (error) {
      console.error('Donation submission error:', error);
      setMessage('Failed to save donation. Please try again.');
    }
  }
};

  return (
    <div className="add-donation-page">

      <div className="donation-page-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div>
          <span className="form-eyebrow">FOOD RESCUE PROGRAM</span>
          <h1>Create a Food Donation</h1>
          <p>Share surplus food with organisations that need it.</p>
        </div>
      </div>

      <form className="donation-form" onSubmit={handleSubmit}>

        <div className="form-section-heading">
          <div className="form-section-icon"><Utensils size={20} /></div>
          <div>
            <h2>Food Information</h2>
            <p>Tell us about the food you want to donate.</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Food Name *</label>
            <input
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="e.g. Vegetable Rice"
              required
            />
          </div>

          <div className="form-group">
            <label>Food Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option>Cooked Meals</option>
              <option>Bakery Items</option>
              <option>Fruits</option>
              <option>Vegetables</option>
              <option>Dairy Products</option>
              <option>Packaged Food</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <div className="quantity-input">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                placeholder="Enter quantity"
                required
              />

              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option>Packs</option>
                <option>Kg</option>
                <option>Litres</option>
                <option>Pieces</option>
                <option>Boxes</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Food Type *</label>
            <select name="foodType" value={formData.foodType} onChange={handleChange}>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Vegan</option>
            </select>
          </div>

        </div>

        <div className="form-divider" />

        <div className="form-section-heading">
          <div className="form-section-icon"><Clock size={20} /></div>
          <div>
            <h2>Preparation & Pickup Details</h2>
            <p>Provide accurate timing and storage information.</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Preparation Date & Time *</label>
            <input
              type="datetime-local"
              name="preparedAt"
              value={formData.preparedAt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Pickup Deadline *</label>
            <input
              type="datetime-local"
              name="pickupDeadline"
              value={formData.pickupDeadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Storage Condition *</label>
            <select name="storage" value={formData.storage} onChange={handleChange} required>
              <option value="">Select storage condition</option>
              <option>Room Temperature</option>
              <option>Refrigerated</option>
              <option>Frozen</option>
              <option>Other - See Notes</option>
            </select>
          </div>

        </div>

        <div className="form-divider" />

        <div className="form-section-heading">
          <div className="form-section-icon"><Info size={20} /></div>
          <div>
            <h2>Allergen Information</h2>
            <p>Select any known allergens present in the food.</p>
          </div>
        </div>

        <div className="allergen-options">
          {allergenOptions.map((allergen) => (
            <label className="allergen-option" key={allergen}>
              <input
                type="checkbox"
                checked={formData.allergens.includes(allergen)}
                onChange={() => handleAllergen(allergen)}
              />
              {allergen}
            </label>
          ))}
        </div>

        <div className="form-divider" />

        <div className="form-section-heading">
          <div className="form-section-icon"><MapPin size={20} /></div>
          <div>
            <h2>Collection Location</h2>
            <p>Where should the NGO collect the donation?</p>
          </div>
        </div>
        

        <div className="form-group full-width">
  <label>Select Pickup Location on Map *</label>
  <div className="form-group full-width">
  <label>Pickup Address *</label>

  <textarea
    name="address"
    value={formData.address}
    onChange={handleChange}
    placeholder="Enter the complete pickup address..."
    rows="2"
    required
  />
</div>
  <p>Click on the map to mark where the NGO should collect the food.</p>

  <MapPicker
    onLocationSelect={handleLocationSelect}
  />

  {formData.pickupLatitude !== '' && (
    <p className="location-coordinates">
      Selected: {Number(formData.pickupLatitude).toFixed(5)},
      {' '}{Number(formData.pickupLongitude).toFixed(5)}
    </p>
  )}
</div>
<div className="form-group full-width">
  <label>Food Distribution Radius *</label>

  <select
    name="distributionRadiusKm"
    value={formData.distributionRadiusKm}
    onChange={handleChange}
    required
  >
    <option value="1">Within 1 km</option>
    <option value="3">Within 3 km</option>
    <option value="5">Within 5 km</option>
    <option value="10">Within 10 km</option>
    <option value="15">Within 15 km</option>
    <option value="20">Within 20 km</option>
    <option value="30">Within 30 km</option>
    <option value="50">Within 50 km</option>
  </select>

  <p>Only NGOs within this distance can discover your donation.</p>
</div>
<div className="form-group full-width">
  <label>Upload Food Photos</label>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    multiple
    onChange={handleImageChange}
  />

  <p>You can upload up to 5 food images (maximum 5 MB each).</p>

  {selectedImages.length > 0 && (
    <p>
      {selectedImages.length} image(s) selected.
    </p>
  )}
</div>

        <div className="form-group full-width notes-field">
          <label>Additional Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional information about this donation..."
            rows="3"
          />
        </div>

        <div className="food-safety-note">
          <Info size={19} />
          <p>
            Please provide accurate preparation, storage and allergen details.
            Food safety must be checked by the donor and receiving organisation.
            Listing food does not certify that it is safe to consume.
          </p>
        </div>

        {message && (
          <div className="form-message">
            {message.includes('successfully') && <CheckCircle2 size={18} />}
            {message}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onBack}>
            Cancel
          </button>

          <button type="submit" className="submit-donation-button">
            <Leaf size={18} /> Submit Donation
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddDonation;