import { useState } from 'react';
import API from '../services/api.js';
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Building2,
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';

function Login({ onBack, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('donor');
  
  const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
  fullName: '',
  organizationName: '',
  email: '',
  password: ''
});
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage('');
  setLoading(true);

  try {
    if (isRegister) {
  const response = await API.post('/auth/register', {
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
    role: role,
    organizationName: formData.organizationName
  });

  setMessage(response.data.message || 'Account created successfully! Please sign in.');

  setIsRegister(false);

  setFormData((previous) => ({
    ...previous,
    password: ''
  }));

  return;
}

    const response = await API.post('/auth/login', {
      email: formData.email,
      password: formData.password
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    if (onLogin) {
  onLogin(response.data.user.role);
}

  } catch (error) {
    setMessage(
      error.response?.data?.message || 'Something went wrong. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">

      {/* LEFT BRANDING SECTION */}
      <div className="auth-brand">

        <button className="auth-back" onClick={() => onBack?.()}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="auth-brand-content">

          <div className="auth-logo">
            <Leaf size={25} />
            RescueBite
          </div>

          <h1>
            Together, we can make
            <span> every meal matter.</span>
          </h1>

          <p>
            Join a community that believes good food
            should nourish people, not end up in landfills.
          </p>

          <div className="auth-highlight">
            <HeartHandshake size={25} />

            <div>
              <strong>One platform. One purpose.</strong>
              <p>Connecting surplus food with people in need.</p>
            </div>
          </div>

        </div>

        <p className="auth-footer-text">
          © 2026 RescueBite. Making food rescue meaningful.
        </p>

      </div>

      {/* RIGHT FORM SECTION */}
      <div className="auth-form-section">

        <div className="auth-form-container">

          <div className="auth-mobile-logo">
            <Leaf size={22} />
            RescueBite
          </div>

          <div className="auth-heading">

            <span className="auth-eyebrow">
              {isRegister ? 'JOIN OUR COMMUNITY' : 'WELCOME BACK'}
            </span>

            <h2>
              {isRegister ? 'Create your account' : 'Sign in to RescueBite'}
            </h2>

            <p>
              {isRegister
                ? 'Start making a difference with us.'
                : 'Continue your food rescue journey.'}
            </p>

          </div>

          {/* LOGIN / REGISTER SWITCH */}
          <div className="auth-tabs">

            <button
              type="button"
              className={!isRegister ? 'active' : ''}
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>

            <button
              type="button"
              className={isRegister ? 'active' : ''}
              onClick={() => setIsRegister(true)}
            >
              Register
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            {isRegister && (
              <div className="auth-field">

                <label>Full Name</label>

<div className="input-wrapper">
  <Building2 size={19} />

  <input
    type="text"
    name="fullName"
    placeholder="Enter your full name"
    value={formData.fullName}
    onChange={handleChange}
    required
  />
</div>
{role === 'ngo' && (
  <>
    <label>Organisation Name</label>

    <div className="input-wrapper">
      <Building2 size={19} />

      <input
        type="text"
        name="organizationName"
        placeholder="Enter organisation name"
        value={formData.organizationName}
        onChange={handleChange}
        required
      />
    </div>
  </>
)}

              </div>
            )}

            <div className="auth-field">

              <label>Email Address</label>

              <div className="input-wrapper">
                <Mail size={19} />

                <input
                  type="email"
                  name="email"
                  placeholder="name@organisation.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="auth-field">

              <label>Password</label>

              <div className="input-wrapper">
                <Lock size={19} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>

              </div>

            </div>

            {/* ROLE SELECTION */}
<div className="auth-field">

  <label>{isRegister ? 'Register As' : 'Demo Login As'}</label>

  <div className="role-selection">

    <button
      type="button"
      className={`role-option ${role === 'donor' ? 'selected' : ''}`}
      onClick={() => setRole('donor')}
    >
      <Building2 size={22} />
      <span>Food Donor</span>
    </button>

    <button
      type="button"
      className={`role-option ${role === 'ngo' ? 'selected' : ''}`}
      onClick={() => setRole('ngo')}
    >
      <HeartHandshake size={22} />
      <span>NGO / Receiver</span>
    </button>

    {!isRegister && (
      <button
        type="button"
        className={`role-option ${role === 'admin' ? 'selected' : ''}`}
        onClick={() => setRole('admin')}
      >
        <ShieldCheck size={22} />
        <span>Administrator</span>
      </button>
    )}

  </div>

</div>
{message && (
  <p className="auth-message">
    {message}
  </p>
)}
<button
  type="submit"
  className="auth-submit"
  disabled={loading}
>
  {loading
    ? 'Please wait...'
    : isRegister
      ? 'Create Account'
      : 'Sign In'}
</button>
            

          </form>

          <p className="auth-switch-text">

            {isRegister
              ? 'Already have an account? '
              : "Don't have an account? "}

            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>

          </p>

          <div className="auth-security">
            <Lock size={14} />
            Your organisation deserves a trusted platform.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;