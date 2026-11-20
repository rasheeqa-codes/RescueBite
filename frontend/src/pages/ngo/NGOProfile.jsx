import { useToast } from '../../context/ToastContext.jsx';
import { useEffect, useState } from 'react';
import MapPicker from '../../components/MapPicker.jsx';
import API from '../../services/api.js';
import {
  Building2,
  UserRound,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  X,
  Camera
} from 'lucide-react';

function NGOProfile({ onSave }) {
  const { showToast } = useToast();
  const [profile, setProfile] = useState({
  organisationName: '',
  registrationNumber: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  organizationLocation: {
    latitude: null,
    longitude: null
  }
});
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await API.get('/auth/me');
      const user = response.data.user;

      const loadedProfile = {
        organisationName: user.organizationName || '',
        registrationNumber: user.registrationNumber || '',
        contactPerson: user.contactPerson || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.organizationAddress || '',
        description: user.description || '',
        organizationLocation: user.organizationLocation || {
          latitude: null,
          longitude: null
        }
      };

      setProfile(loadedProfile);
      setEditedProfile(loadedProfile);

    } catch (error) {
      console.error('Error fetching NGO profile:', error);
      showToast('Unable to load organisation profile.', 'error');
    }
  };

  fetchProfile();
}, []);

  const handleChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };
  const handleLocationSelect = (location) => {
  setEditedProfile((prev) => ({
    ...prev,
    organizationLocation: location
  }));
};

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    const response = await API.put('/auth/profile', {
      fullName: editedProfile.contactPerson,
      organizationName: editedProfile.organisationName,
      organizationAddress: editedProfile.address,
      registrationNumber: editedProfile.registrationNumber,
      contactPerson: editedProfile.contactPerson,
      phone: editedProfile.phone,
      description: editedProfile.description,
      organizationLocation: editedProfile.organizationLocation
      
    });

    const updatedUser = {
      ...JSON.parse(localStorage.getItem('user') || '{}'),
      ...response.data.user
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    setProfile(editedProfile);
    setEditMode(false);

    showToast('Organisation profile updated successfully!', 'success');

    if (onSave) {
      onSave();
    }

  } catch (error) {
    console.error('Error updating NGO profile:', error);

    showToast(
  error.response?.data?.message ||
  'Unable to update organisation profile.',
  'error'
);
  }
};

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditMode(false);
  };

  return (
    <div className="ngo-profile-page">

      <div className="ngo-page-heading">
        <div>
          <h2>Organisation Profile</h2>
          <p>Manage your organisation information and contact details.</p>
        </div>

        {!editMode && (
          <button
            className="ngo-profile-edit-button"
            onClick={() => {
              setEditedProfile(profile);
              setEditMode(true);
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Organisation Header */}

      <div className="ngo-profile-header">

        <div className="ngo-profile-avatar">
          <Building2 size={34} />
          <span className="ngo-profile-camera">
            <Camera size={15} />
          </span>
        </div>

        <div className="ngo-profile-header-info">
          <h3>{profile.organisationName}</h3>
          <p>Verified Organisation</p>
          <span>Member of RescueBite</span>
        </div>

      </div>

      {/* Profile Form */}

      <form className="ngo-profile-form" onSubmit={handleSave}>

        <div className="ngo-profile-section-heading">
          <h3>Organisation Information</h3>
          <p>Basic details about your organisation.</p>
        </div>

        <div className="ngo-profile-fields">

          <div className="ngo-profile-field">
            <label>
              <Building2 size={16} />
              Organisation Name
            </label>

            <input
              type="text"
              name="organisationName"
              value={editMode ? editedProfile.organisationName : profile.organisationName}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>

          <div className="ngo-profile-field">
            <label>
              <FileText size={16} />
              Registration Number
            </label>

            <input
              type="text"
              name="registrationNumber"
              value={editMode ? editedProfile.registrationNumber : profile.registrationNumber}
              disabled
            />
          </div>

          <div className="ngo-profile-field">
            <label>
              <UserRound size={16} />
              Contact Person
            </label>

            <input
              type="text"
              name="contactPerson"
              value={editMode ? editedProfile.contactPerson : profile.contactPerson}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>

          <div className="ngo-profile-field">
            <label>
              <Mail size={16} />
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={editMode ? editedProfile.email : profile.email}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>

          <div className="ngo-profile-field">
            <label>
              <Phone size={16} />
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={editMode ? editedProfile.phone : profile.phone}
              onChange={handleChange}
              disabled={!editMode}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>

          <div className="ngo-profile-field">
            <label>
              <MapPin size={16} />
              Organisation Address
            </label>

            <input
              type="text"
              name="address"
              value={editMode ? editedProfile.address : profile.address}
              onChange={handleChange}
              disabled={!editMode}
              required
            />
          </div>

          {editMode && (
            <div className="ngo-profile-field">
              <label>
                <MapPin size={16} />
                Select Organisation Location
              </label>

              <p>Click on the map to select your organisation's exact location.</p>

              <MapPicker
                initialPosition={
                  editedProfile.organizationLocation?.latitude != null &&
                  editedProfile.organizationLocation?.longitude != null
                    ? [
                        editedProfile.organizationLocation.latitude,
                        editedProfile.organizationLocation.longitude
                      ]
                    : null
                }
                onLocationSelect={handleLocationSelect}
              />

              {editedProfile.organizationLocation?.latitude != null && (
                <p>
                  Selected: {editedProfile.organizationLocation.latitude.toFixed(5)},
                  {' '}{editedProfile.organizationLocation.longitude.toFixed(5)}
                </p>
              )}
            </div>
          )}

        </div>

        <div className="ngo-profile-section-heading ngo-description-heading">
          <h3>About Organisation</h3>
          <p>Tell donors about your organisation and its activities.</p>
        </div>

        <div className="ngo-profile-field ngo-profile-description">
          <label>
            <FileText size={16} />
            Organisation Description
          </label>

          <textarea
            name="description"
            value={editMode ? editedProfile.description : profile.description}
            onChange={handleChange}
            disabled={!editMode}
            rows="5"
          />
        </div>

        {editMode && (

          <div className="ngo-profile-actions">

            <button type="button" onClick={handleCancel}>
              <X size={17} />
              Cancel
            </button>

            <button type="submit">
              <Save size={17} />
              Save Changes
            </button>

          </div>

        )}

      </form>

    </div>
  );
}

export default NGOProfile;