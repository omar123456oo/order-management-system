import React, { useState, useEffect } from 'react';
import { Coffee, Package, Users, TrendingUp, Moon, Sun, LogOut, Clock, CheckCircle, XCircle, Bell, AlertCircle, Home, Settings, BarChart3, Sparkles, ShoppingBag, Timer, Activity, UserPlus, Mail, Phone, Building } from 'lucide-react';
import './index.css';

// Configuration
const API_URL = 'http://localhost:3000/api';
const WORKING_HOURS_START = 9;
const WORKING_HOURS_END = 17;
const WORKDAY_DURATION = 8;

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

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [stock, setStock] = useState([]);
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
        // Load data from backend when user logs in
        if (currentUser) {
            fetchUsers();
            fetchStock();
            fetchOrders();
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchStock = async () => {
        try {
            const response = await fetch(`${API_URL}/stock`);
            const data = await response.json();
            setStock(data);
        } catch (error) {
            console.error('Error fetching stock:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const isWorkingHours = () => {
        const hour = currentTime.getHours();
        return hour >= WORKING_HOURS_START && hour < WORKING_HOURS_END;
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentUser(data.user);
                showToast(`Welcome back, ${data.user.name}! 🎉`, 'success');
                return true;
            } else {
                showToast(data.error || 'Invalid credentials. Please try again.', 'error');
                return false;
            }
        } catch (error) {
            showToast('Cannot connect to server. Please make sure the backend is running.', 'error');
            return false;
        }
    };

    const handleLogout = () => {
        showToast(`Goodbye, ${currentUser.name}! 👋`, 'info');
        setTimeout(() => setCurrentUser(null), 300);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

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
        showToast,
        fetchStock,
        fetchOrders
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

const LoginScreen = ({ onLogin, theme, onToggleTheme, onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        const success = await onLogin(username, password);
        if (!success) {
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
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm animate-scaleIn ${theme === 'dark' ? 'bg-neutral-800 bg-opacity-90 neon-border' : 'bg-white bg-opacity-90'}`}>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 animate-glow">
                            <Coffee className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white neon-glow' : 'text-neutral-800'}`}>
                                Office <span className="text-gradient">Orders</span>
                            </h1>
                            <p className="text-sm text-neutral-500">Management System</p>
                        </div>
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
    );
};

// Continue with the rest of the components...
// (I'll create a second part of the file due to length)
