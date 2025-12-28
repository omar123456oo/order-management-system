import React, { useState, useEffect } from 'react';
import { Coffee, Package, Users, TrendingUp, Moon, Sun, LogOut, Clock, CheckCircle, XCircle, Bell, AlertCircle, Home, Settings, BarChart3, Sparkles, ShoppingBag, Timer, Activity, UserPlus, Mail, Phone, Building } from 'lucide-react';
import './index.css';

// Configuration
const API_URL = 'http://localhost:3000/api';

// Constants
const WORKING_HOURS_START = 9;
const WORKING_HOURS_END = 17;
const WORKDAY_DURATION = 8;

// Initial Data
const initialUsers = [
  { id: 1, username: 'john.doe', password: 'emp123', role: 'employee', name: 'John Doe', department: 'IT', email: 'john@company.com' },
  { id: 2, username: 'jane.smith', password: 'emp123', role: 'employee', name: 'Jane Smith', department: 'HR', email: 'jane@company.com' },
  { id: 3, username: 'mike.jones', password: 'emp123', role: 'employee', name: 'Mike Jones', department: 'Marketing', email: 'mike@company.com' },
  { id: 4, username: 'office.boy', password: 'boy123', role: 'officeBoy', name: 'Ahmed Ali', email: 'ahmed@company.com' },
  { id: 5, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', email: 'admin@company.com' }
];

const initialStock = [
  { id: 1, name: 'Coffee', quantity: 100, minLevel: 20, icon: '☕', category: 'Hot Drinks' },
  { id: 2, name: 'Tea', quantity: 80, minLevel: 15, icon: '🍵', category: 'Hot Drinks' },
  { id: 3, name: 'Water', quantity: 150, minLevel: 30, icon: '💧', category: 'Drinks' },
  { id: 4, name: 'Juice', quantity: 50, minLevel: 10, icon: '🧃', category: 'Drinks' },
  { id: 5, name: 'Snacks', quantity: 75, minLevel: 15, icon: '🍿', category: 'Food' },
  { id: 6, name: 'Cookies', quantity: 60, minLevel: 12, icon: '🍪', category: 'Food' }
];

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Bell size={20} />
  };

  return (
    <div className={`toast toast-${type} animate-slideInRight`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {icons[type]}
        <span style={{ fontWeight: '500' }}>{message}</span>
      </div>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users] = useState(initialUsers);
  const [stock, setStock] = useState(initialStock);
  const [orders, setOrders] = useState([]);
  const [theme, setTheme] = useState('light');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem('lastReset');
      if (lastReset !== today) {
        setOrders(prev => prev.map(order => ({ ...order, canOrderToday: true })));
        localStorage.setItem('lastReset', today);
      }
    };
    checkDailyReset();
  }, []);

  const isWorkingHours = () => {
    const hour = currentTime.getHours();
    return hour >= WORKING_HOURS_START && hour < WORKING_HOURS_END;
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      showToast(`Welcome back, ${user.name}! 🎉`, 'success');
      return true;
    }
    showToast('Invalid credentials. Please try again.', 'error');
    return false;
  };

  const handleLogout = () => {
    showToast(`Goodbye, ${currentUser.name}! 👋`, 'info');
    setTimeout(() => setCurrentUser(null), 300);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (showRegister) {
    return <RegisterScreen onBack={() => setShowRegister(false)} theme={theme} showToast={showToast} />;
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} onRegister={() => setShowRegister(true)} />;
  }

  const props = {
    currentUser,
    users,
    stock,
    setStock,
    orders,
    setOrders,
    theme,
    toggleTheme,
    handleLogout,
    isWorkingHours: isWorkingHours(),
    currentTime,
    showToast
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <Header {...props} />
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {currentUser.role === 'employee' && <EmployeeDashboard {...props} />}
          {currentUser.role === 'officeBoy' && <OfficeBoyDashboard {...props} />}
          {currentUser.role === 'admin' && <AdminDashboard {...props} />}
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
};

// Registration Screen Component
const RegisterScreen = ({ onBack, theme, showToast }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    department: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.name) newErrors.name = 'Full name is required';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Registration successful! Please login.', 'success');
        setTimeout(() => onBack(), 1500);
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      showToast('Server error. Please make sure the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`register-container transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`relative w-full max-w-2xl p-8 rounded-2xl shadow-2xl backdrop-blur-sm animate-scaleIn ${theme === 'dark' ? 'bg-neutral-800 bg-opacity-90' : 'bg-white bg-opacity-90'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
            <UserPlus className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
              Employee <span className="text-gradient">Registration</span>
            </h1>
            <p className="text-sm text-neutral-500">Join our office order system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="form-group">
              <label className={`form-label ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                placeholder="john.doe"
                disabled={isLoading}
              />
              {errors.username && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.username}
                </div>
              )}
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className={`form-label ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.name}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className={`form-label ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
              <Mail size={16} className="inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="john.doe@company.com"
              disabled={isLoading}
            />
            {errors.email && (
              <div className="form-error">
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div className="form-group">
              <label className={`form-label ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <Building size={16} className="inline mr-1" />
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-control"
                disabled={isLoading}
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.department}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className={`form-label ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <Phone size={16} className="inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="0123456789"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="form-group">
              <label className={`form-label ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className={`form-label ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="btn btn-outline flex-1"
            >
              Back to Login
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  Registering...
                </span>
              ) : (
                <>
                  <UserPlus size={18} />
                  Register
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, theme, onToggleTheme, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (onLogin(username, password)) {
      setError('');
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left Side - System Brief */}
          <div className="space-y-6 animate-slideInLeft">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 animate-float">
                <Coffee className="text-white" size={40} />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                  Office <span className="gradient-text">Order System</span>
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Streamline Your Office Refreshments
                </p>
              </div>
            </div>

            {/* System Description */}
            <div className={`p-6 rounded-2xl backdrop-blur-sm ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-white/50'} shadow-xl`}>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                Welcome to Your Digital Office Café ☕
              </h2>
              <p className={`text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Say goodbye to manual order taking! Our intelligent system revolutionizes how your office handles daily refreshment orders, making it easier, faster, and more efficient than ever.
              </p>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Whether you're an employee ordering your morning coffee, an office boy managing deliveries, or an admin tracking inventory - we've got you covered!
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🚀', title: 'Quick Orders', desc: 'Place orders in seconds' },
                { icon: '📊', title: 'Real-time Tracking', desc: 'Monitor order status live' },
                { icon: '🎯', title: 'Smart Inventory', desc: 'Auto stock management' },
                { icon: '⏰', title: 'Working Hours', desc: 'Automated scheduling' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl backdrop-blur-sm transition-all hover-lift ${theme === 'dark' ? 'bg-neutral-800/50 hover:bg-neutral-700/50' : 'bg-white/50 hover:bg-white/70'
                    } shadow-lg`}
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-primary-900/50 to-secondary-900/50' : 'bg-gradient-to-r from-primary-100 to-secondary-100'} shadow-xl`}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-3xl font-bold gradient-text`}>19+</div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Items Available</p>
                </div>
                <div>
                  <div className={`text-3xl font-bold gradient-text`}>4</div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Categories</p>
                </div>
                <div>
                  <div className={`text-3xl font-bold gradient-text`}>24/7</div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>Access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center animate-slideInRight">
            <div className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm ${theme === 'dark' ? 'bg-neutral-800 bg-opacity-90' : 'bg-white bg-opacity-90'}`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                    Sign In
                  </h2>
                  <p className="text-sm text-neutral-500">Access your account</p>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`p-2 rounded-lg transition-all hover-scale ${theme === 'dark' ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                >
                  {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-primary-500" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-error-50 border border-error-200 text-error-700 flex items-center gap-2 animate-slideDown">
                    <XCircle size={18} />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn btn-primary w-full py-3 text-base font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                      Logging in...
                    </span>
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="divider"></div>

                <button
                  onClick={onRegister}
                  className="btn btn-outline w-full py-3 text-base font-semibold"
                >
                  <UserPlus size={18} />
                  Register as Employee
                </button>
              </div>

              <div className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-neutral-700' : 'bg-primary-50'}`}>
                <p className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  🔑 Demo Credentials:
                </p>
                <div className="space-y-1 text-xs">
                  <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
                    👤 <strong>Employee:</strong> john.doe / emp123
                  </p>
                  <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
                    🚀 <strong>Office Boy:</strong> office.boy / boy123
                  </p>
                  <p className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
                    ⚡ <strong>Admin:</strong> admin / admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ currentUser, theme, toggleTheme, handleLogout, isWorkingHours, currentTime }) => {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-800 bg-opacity-90 shadow-xl' : 'bg-white bg-opacity-90 shadow-md'}`}>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
              <Coffee className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Office Order System</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
                  {currentUser.name}
                </span>
                <span className="badge badge-primary">{currentUser.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${isWorkingHours ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'}`}>
              <Clock size={16} />
              <span className="text-sm font-semibold">
                {isWorkingHours ? 'Working Hours' : 'Off Hours'}
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all hover-scale ${theme === 'dark' ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-primary flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const EmployeeDashboard = ({ currentUser, stock, orders, setOrders, theme, isWorkingHours, showToast }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const hasOrderedToday = orders.some(
    order => order.userId === currentUser.id &&
      new Date(order.date).toDateString() === new Date().toDateString()
  );

  const handlePlaceOrder = () => {
    if (!isWorkingHours) {
      showToast('Orders can only be placed during working hours (9 AM - 5 PM)', 'warning');
      return;
    }

    if (hasOrderedToday) {
      showToast('You have already placed an order today', 'warning');
      return;
    }

    if (selectedItem.quantity <= 0) {
      showToast('This item is out of stock', 'error');
      return;
    }

    const newOrder = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemIcon: selectedItem.icon,
      date: new Date().toISOString(),
      status: 'pending'
    };

    setOrders(prev => [...prev, newOrder]);
    setShowConfirmation(true);
    showToast(`Order placed successfully! ${selectedItem.icon} ${selectedItem.name}`, 'success');

    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedItem(null);
    }, 3000);
  };

  const myOrders = orders.filter(order => order.userId === currentUser.id);
  const todayOrders = myOrders.filter(order =>
    new Date(order.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-primary-900 to-primary-800' : 'bg-gradient-to-br from-primary-50 to-primary-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-500 text-white">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-primary-300' : 'text-primary-700'}`}>Total Orders</p>
              <p className="text-3xl font-bold">{myOrders.length}</p>
            </div>
          </div>
        </div>

        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-success-900 to-success-800' : 'bg-gradient-to-br from-success-50 to-success-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success-500 text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-success-300' : 'text-success-700'}`}>Delivered</p>
              <p className="text-3xl font-bold">{myOrders.filter(o => o.status === 'delivered').length}</p>
            </div>
          </div>
        </div>

        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-warning-900 to-warning-800' : 'bg-gradient-to-br from-warning-50 to-warning-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning-500 text-white">
              <Timer size={24} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-warning-300' : 'text-warning-700'}`}>Today's Orders</p>
              <p className="text-3xl font-bold">{todayOrders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Placement Section */}
      <div className={`card animate-slideUp ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-primary-500" size={28} />
          <h2 className="text-2xl font-bold">Place Your Order</h2>
        </div>

        {!isWorkingHours && (
          <div className="mb-4 p-4 rounded-xl bg-warning-50 border-l-4 border-warning-500 text-warning-800 flex items-center gap-3 animate-slideDown">
            <AlertCircle size={20} />
            <span className="font-medium">Orders are only available during working hours (9 AM - 5 PM)</span>
          </div>
        )}

        {hasOrderedToday ? (
          <div className="p-8 bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-200 rounded-2xl text-center animate-scaleIn">
            <CheckCircle size={64} className="mx-auto mb-4 text-success-500" />
            <h3 className="text-2xl font-bold mb-2 text-success-900">Order Placed Today! ✨</h3>
            <p className="text-success-700">You can place your next order tomorrow.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {stock.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  disabled={!isWorkingHours || item.quantity <= 0}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover-lift animate-fadeIn ${selectedItem?.id === item.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 shadow-lg scale-105'
                    : theme === 'dark'
                      ? 'border-neutral-700 hover:border-neutral-600 bg-neutral-700'
                      : 'border-neutral-200 hover:border-primary-300 bg-white'
                    } ${!isWorkingHours || item.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className={`text-sm ${item.quantity <= item.minLevel ? 'text-error-500 font-semibold' : 'text-neutral-500'}`}>
                    {item.quantity > 0 ? `Stock: ${item.quantity}` : 'Out of Stock'}
                  </p>
                </button>
              ))}
            </div>

            {selectedItem && (
              <button
                onClick={handlePlaceOrder}
                disabled={!isWorkingHours}
                className="btn btn-primary w-full py-4 text-lg font-bold animate-slideUp"
              >
                <CheckCircle size={20} />
                Confirm Order: {selectedItem.icon} {selectedItem.name}
              </button>
            )}
          </>
        )}
      </div>

      {/* Order History */}
      <div className={`card animate-slideUp ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`} style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <Activity className="text-secondary-500" size={28} />
          <h2 className="text-2xl font-bold">My Order History</h2>
        </div>

        <div className="space-y-3">
          {myOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-neutral-500 text-lg">No orders yet</p>
              <p className="text-neutral-400 text-sm mt-2">Place your first order to get started!</p>
            </div>
          ) : (
            myOrders.slice().reverse().map((order, index) => (
              <div
                key={order.id}
                className={`p-4 rounded-xl border transition-all hover-lift animate-slideInLeft ${theme === 'dark' ? 'border-neutral-700 bg-neutral-700' : 'border-neutral-200 bg-neutral-50'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{order.itemIcon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{order.itemName}</h3>
                      <p className="text-sm text-neutral-500">
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${order.status === 'delivered'
                    ? 'bg-success-100 text-success-800'
                    : 'bg-warning-100 text-warning-800'
                    }`}>
                    {order.status === 'delivered' ? <CheckCircle size={16} /> : <Clock size={16} />}
                    {order.status === 'delivered' ? 'Delivered' : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const OfficeBoyDashboard = ({ orders, setOrders, stock, setStock, theme, showToast }) => {
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const deliveredToday = orders.filter(order =>
    order.status === 'delivered' &&
    new Date(order.deliveredAt).toDateString() === new Date().toDateString()
  );

  const handleDeliver = (order) => {
    // Decrease stock when delivering
    setStock(prev => prev.map(item =>
      item.id === order.itemId ? { ...item, quantity: item.quantity - 1 } : item
    ));

    setOrders(prev => prev.map(o =>
      o.id === order.id ? { ...o, status: 'delivered', deliveredAt: new Date().toISOString() } : o
    ));

    showToast(`Order delivered to ${order.userName}! 🎉`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-error-900 to-error-800' : 'bg-gradient-to-br from-error-50 to-error-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-error-500 text-white">
              <Bell size={24} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-error-300' : 'text-error-700'}`}>Pending Orders</p>
              <p className="text-3xl font-bold">{pendingOrders.length}</p>
            </div>
          </div>
        </div>

        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-success-900 to-success-800' : 'bg-gradient-to-br from-success-50 to-success-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success-500 text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-success-300' : 'text-success-700'}`}>Delivered Today</p>
              <p className="text-3xl font-bold">{deliveredToday.length}</p>
            </div>
          </div>
        </div>

        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-primary-900 to-primary-800' : 'bg-gradient-to-br from-primary-50 to-primary-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-500 text-white">
              <Package size={24} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-primary-300' : 'text-primary-700'}`}>Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className={`card animate-slideUp ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Bell className="text-primary-500" size={28} />
            <h2 className="text-2xl font-bold">Pending Orders</h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-800 rounded-xl font-bold">
            <Bell size={20} />
            <span>{pendingOrders.length} Orders</span>
          </div>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={80} className="mx-auto mb-4 opacity-20" />
            <p className="text-neutral-500 text-xl font-semibold">No pending orders</p>
            <p className="text-neutral-400 mt-2">All caught up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map((order, index) => (
              <div
                key={order.id}
                className={`p-6 rounded-2xl border-2 transition-all hover-lift animate-slideInLeft ${theme === 'dark' ? 'border-primary-700 bg-gradient-to-r from-primary-900 to-neutral-800' : 'border-primary-200 bg-gradient-to-r from-primary-50 to-white'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{order.itemIcon}</span>
                    <div>
                      <h3 className="text-2xl font-bold">{order.itemName}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Ordered by: <strong>{order.userName}</strong>
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(order.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeliver(order)}
                    className="btn btn-success px-6 py-3 font-bold"
                  >
                    <CheckCircle size={18} />
                    Mark Delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivered Today */}
      <div className={`card animate-slideUp ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`} style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="text-success-500" size={28} />
          <h2 className="text-2xl font-bold">Delivered Today</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deliveredToday.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-neutral-500">
              No deliveries yet today
            </div>
          ) : (
            deliveredToday.map((order, index) => (
              <div
                key={order.id}
                className={`p-4 rounded-xl transition-all hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-success-900 border border-success-700' : 'bg-success-50 border border-success-200'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{order.itemIcon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold">{order.itemName}</h3>
                    <p className="text-sm text-neutral-500">{order.userName}</p>
                  </div>
                  <CheckCircle className="text-success-500" size={24} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ users, stock, setStock, orders, theme, showToast }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingStock, setEditingStock] = useState(null);
  const [editValue, setEditValue] = useState('');

  const todayOrders = orders.filter(order =>
    new Date(order.date).toDateString() === new Date().toDateString()
  );

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockItems = stock.filter(item => item.quantity <= item.minLevel);

  const handleUpdateStock = (itemId) => {
    const newQuantity = parseInt(editValue);
    if (isNaN(newQuantity) || newQuantity < 0) {
      showToast('Please enter a valid quantity', 'error');
      return;
    }

    setStock(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
    setEditingStock(null);
    setEditValue('');
    showToast('Stock updated successfully! 📦', 'success');
  };

  const startEditing = (item) => {
    setEditingStock(item.id);
    setEditValue(item.quantity.toString());
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
    { id: 'stock', label: 'Stock Management', icon: <Package size={18} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-primary-900 to-primary-800' : 'bg-gradient-to-br from-primary-50 to-primary-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-500 text-white">
              <Package size={28} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-primary-300' : 'text-primary-700'}`}>Total Orders</p>
              <p className="text-4xl font-bold">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-success-900 to-success-800' : 'bg-gradient-to-br from-success-50 to-success-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success-500 text-white">
              <CheckCircle size={28} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-success-300' : 'text-success-700'}`}>Delivered</p>
              <p className="text-4xl font-bold">{deliveredOrders}</p>
            </div>
          </div>
        </div>

        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-warning-900 to-warning-800' : 'bg-gradient-to-br from-warning-50 to-warning-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning-500 text-white">
              <Clock size={28} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-warning-300' : 'text-warning-700'}`}>Today's Orders</p>
              <p className="text-4xl font-bold">{todayOrders.length}</p>
            </div>
          </div>
        </div>

        <div className={`card hover-lift animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-error-900 to-error-800' : 'bg-gradient-to-br from-error-50 to-error-100'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-error-500 text-white">
              <AlertCircle size={28} />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-error-300' : 'text-error-700'}`}>Low Stock</p>
              <p className="text-4xl font-bold">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`card ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`}>
        <div className="flex gap-2 mb-6 border-b border-neutral-300 dark:border-neutral-700 pb-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : theme === 'dark'
                  ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary-500" size={24} />
              Recent Orders
            </h3>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <Package size={64} className="mx-auto mb-4 opacity-30" />
                <p>No orders yet</p>
              </div>
            ) : (
              orders.slice(-10).reverse().map((order, index) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-xl border transition-all hover-lift animate-fadeIn ${theme === 'dark' ? 'border-neutral-700 bg-neutral-700' : 'border-neutral-200 bg-neutral-50'
                    }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{order.itemIcon}</span>
                      <div>
                        <h4 className="font-bold text-lg">{order.itemName}</h4>
                        <p className="text-sm text-neutral-500">
                          {order.userName} • {new Date(order.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'delivered'
                      ? 'bg-success-100 text-success-800'
                      : 'bg-warning-100 text-warning-800'
                      }`}>
                      {order.status === 'delivered' ? '✓ Delivered' : '⏱ Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package className="text-secondary-500" size={24} />
                Stock Inventory
              </h3>
              {lowStockItems.length > 0 && (
                <div className="badge badge-error flex items-center gap-1">
                  <AlertCircle size={14} />
                  {lowStockItems.length} Low Stock Items
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stock.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border-2 transition-all hover-lift animate-fadeIn ${item.quantity <= item.minLevel
                    ? theme === 'dark'
                      ? 'border-error-700 bg-error-900'
                      : 'border-error-300 bg-error-50'
                    : theme === 'dark'
                      ? 'border-neutral-700 bg-neutral-700'
                      : 'border-neutral-200 bg-neutral-50'
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{item.icon}</span>
                      <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-xs text-neutral-500">{item.category}</p>
                        <p className="text-xs text-neutral-400">Min Level: {item.minLevel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {editingStock === item.id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateStock(item.id);
                              }
                            }}
                            className={`w-20 px-2 py-1 rounded border text-center ${theme === 'dark' ? 'bg-neutral-600 border-neutral-500' : 'border-neutral-300'
                              }`}
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id)}
                            className="btn btn-success px-3 py-1"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingStock(null);
                              setEditValue('');
                            }}
                            className="btn btn-outline px-3 py-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className={`text-3xl font-bold block mb-2 ${item.quantity <= item.minLevel ? 'text-error-500' : 'text-success-500'
                            }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => startEditing(item)}
                            className="btn btn-primary px-4 py-1 text-sm"
                          >
                            <Settings size={14} />
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {item.quantity <= item.minLevel && (
                    <div className="mt-3 p-2 bg-error-100 text-error-800 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <AlertCircle size={16} />
                      ⚠️ Low stock alert! Please restock soon.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="text-success-500" size={24} />
              Employee Usage Report
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.filter(u => u.role === 'employee').map((user, index) => {
                const userOrders = orders.filter(o => o.userId === user.id);
                const userDelivered = userOrders.filter(o => o.status === 'delivered').length;
                const userPending = userOrders.filter(o => o.status === 'pending').length;

                return (
                  <div
                    key={user.id}
                    className={`p-5 rounded-2xl border transition-all hover-lift animate-fadeIn ${theme === 'dark' ? 'border-neutral-700 bg-neutral-700' : 'border-neutral-200 bg-neutral-50'
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{user.name}</h4>
                        <p className="text-sm text-neutral-500">{user.department}</p>
                        <p className="text-xs text-neutral-400">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary-500">{userOrders.length}</p>
                        <p className="text-xs text-neutral-500">Total Orders</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 p-3 rounded-lg bg-success-100 text-success-800">
                        <p className="text-xs font-semibold">Delivered</p>
                        <p className="text-xl font-bold">{userDelivered}</p>
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-warning-100 text-warning-800">
                        <p className="text-xs font-semibold">Pending</p>
                        <p className="text-xl font-bold">{userPending}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Most Popular Items */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-warning-500" size={24} />
                Most Popular Items
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stock.map((item, index) => {
                  const itemOrders = orders.filter(o => o.itemId === item.id).length;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all hover-lift animate-fadeIn ${theme === 'dark' ? 'border-neutral-700 bg-neutral-700' : 'border-neutral-200 bg-neutral-50'
                        }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{item.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-sm text-neutral-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-secondary-500">{itemOrders}</p>
                          <p className="text-xs text-neutral-500">orders</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-primary-500" size={24} />
              User Management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className={`p-5 rounded-2xl border transition-all hover-lift animate-fadeIn ${theme === 'dark' ? 'border-neutral-700 bg-neutral-700' : 'border-neutral-200 bg-neutral-50'
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${user.role === 'admin' ? 'bg-error-500' :
                      user.role === 'officeBoy' ? 'bg-warning-500' :
                        'bg-primary-500'
                      } text-white`}>
                      <Users size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{user.name}</h4>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="badge badge-primary">{user.role}</span>
                        {user.department && (
                          <span className="badge badge-success">{user.department}</span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-2">
                        Username: <code className="font-mono">{user.username}</code>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
