import { useState, useEffect } from 'react';
import API from '../../services/api.js';
import {
  UserRound,
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  Pencil,
  Save,
  X
} from 'lucide-react';

function DonorProfile({ onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
  organisation: '',
  contactPerson: '',
  email: '',
  address: '',
  isVerified: false
});

const [editedProfile, setEditedProfile] = useState(profile);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await API.get('/auth/me');
      
      const user = response.data.user;

      const profileData = {
        organisation: user.organizationName || '',
        contactPerson: user.fullName || '',
        email: user.email || '',
        address: user.organizationAddress || '',
        isVerified: user.isVerified || false
      };

      setProfile(profileData);
      setEditedProfile(profileData);

    } catch (error) {
      console.error('Failed to fetch donor profile:', error);
      alert(
        error.response?.data?.message ||
        'Unable to load your profile.'
      );
    } finally {
      setLoading(false);
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

  const handleSave = async () => {

  try {
    
    const response = await API.put('/auth/profile', {
      fullName: editedProfile.contactPerson,
      organizationName: editedProfile.organisation,
      organizationAddress: editedProfile.address
    });

    const user = response.data.user;

    const updatedProfile = {
      organisation: user.organizationName || '',
      contactPerson: user.fullName || '',
      email: user.email || '',
      address: user.organizationAddress || '',
      isVerified: user.isVerified || false
    };

    setProfile(updatedProfile);
    setEditedProfile(updatedProfile);
    setIsEditing(false);

    alert('Profile updated successfully.');
    if (onSave) {
  onSave();
}

  } catch (error) {
    console.error('Failed to update profile:', error);

    alert(
      error.response?.data?.message ||
      'Unable to update your profile.'
    );
  }
};

  const handleCancel = () => {
  setEditedProfile(profile);
  setIsEditing(false);
};

if (loading) {
  return (
    <div className="profile-container">
      <p>Loading profile...</p>
    </div>
  );
}

return (
  <div className="donor-profile-page">

    <div className="profile-page-header">
        <div>
          <p className="form-eyebrow">ACCOUNT SETTINGS</p>
          <h1>My Profile</h1>
          <p>Manage your organisation and contact information.</p>
        </div>
      </div>

      <div className="profile-main-card">

        <div className="profile-banner">
          <div className="profile-avatar-large">
            <Building2 size={34} />
          </div>

          <div className="profile-banner-info">
            <h2>{profile.organisation}</h2>
            <p>Food Donor Account</p>

            <span className="profile-verified">
  <ShieldCheck size={15} />
  {profile.isVerified ? 'Verified' : 'Verification Pending'}
</span>
          </div>
        </div>

        <div className="profile-content">

          <div className="profile-section-heading">
            <div>
              <h3>Organisation Information</h3>
              <p>Your registered organisation details.</p>
            </div>

            {!isEditing && (
              <button
                className="profile-edit-button"
                onClick={() => {
                  setEditedProfile(profile);
                  setIsEditing(true);
                }}
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-fields">

  {/* Organisation Name */}
  <div className="profile-field">
    <label>Organisation Name</label>
    {isEditing ? (
      <input
        name="organisation"
        value={editedProfile.organisation || ''}
        onChange={handleChange}
      />
    ) : (
      <div className="profile-field-value">
        <Building2 size={17} />
        {profile.organisation || 'Not provided'}
      </div>
    )}
  </div>

  {/* Contact Person */}
  <div className="profile-field">
    <label>Contact Person</label>
    {isEditing ? (
      <input
        name="contactPerson"
        value={editedProfile.contactPerson || ''}
        onChange={handleChange}
      />
    ) : (
      <div className="profile-field-value">
        <UserRound size={17} />
        {profile.contactPerson || 'Not provided'}
      </div>
    )}
  </div>

  {/* Email Address */}
  <div className="profile-field">
    <label>Email Address</label>
    <div className="profile-field-value">
      <Mail size={17} />
      {profile.email || 'Not provided'}
    </div>
  </div>

  {/* Address */}
  <div className="profile-field">
    <label>Address</label>
    {isEditing ? (
      <input
        name="address"
        value={editedProfile.address || ''}
        onChange={handleChange}
      />
    ) : (
      <div className="profile-field-value">
        <MapPin size={17} />
        {profile.address || 'Not provided'}
      </div>
    )}
  </div>

</div>

          {isEditing && (
            <div className="profile-actions">
              <button
                className="profile-cancel-button"
                onClick={handleCancel}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                className="profile-save-button"
                onClick={handleSave}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}

        </div>
      </div>

            </div>
  );
}

export default DonorProfile;