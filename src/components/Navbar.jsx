import { Coffee, Home, Package, Users, BarChart, Settings, Bell, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ currentUser, theme, toggleTheme, onLogout, isWorkingHours }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigationLinks = [
        { icon: Home, label: 'Dashboard', href: '#dashboard' },
        { icon: Package, label: 'Orders', href: '#orders' },
        { icon: Coffee, label: 'Stock', href: '#stock' },
        ...(currentUser?.role === 'admin' ? [
            { icon: Users, label: 'Users', href: '#users' },
            { icon: BarChart, label: 'Reports', href: '#reports' },
        ] : []),
    ];

    return (
        <nav className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${theme === 'dark'
                ? 'bg-neutral-900/90 border-b border-neutral-800'
                : 'bg-white/90 border-b border-neutral-200'
            } shadow-lg`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 animate-float">
                            <Coffee className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                                Office <span className="gradient-text">Orders</span>
                            </h1>
                            {currentUser && (
                                <p className="text-xs text-neutral-500">
                                    Welcome, {currentUser.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    {currentUser && (
                        <div className="hidden md:flex items-center gap-6">
                            {navigationLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover-scale ${theme === 'dark'
                                                ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{link.label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Working Hours Indicator */}
                        {currentUser && (
                            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isWorkingHours
                                    ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                                    : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${isWorkingHours ? 'bg-success-500 animate-pulse' : 'bg-warning-500'}`} />
                                {isWorkingHours ? 'Working Hours' : 'Outside Hours'}
                            </div>
                        )}

                        {/* Notifications */}
                        {currentUser && (
                            <button className={`p-2 rounded-lg transition-all hover-scale relative ${theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                                }`}>
                                <Bell size={20} className={theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </button>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-all hover-scale ${theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                                }`}
                        >
                            {theme === 'dark' ? (
                                <Sun size={20} className="text-yellow-400" />
                            ) : (
                                <Moon size={20} className="text-primary-500" />
                            )}
                        </button>

                        {/* Logout */}
                        {currentUser && (
                            <>
                                <button
                                    onClick={onLogout}
                                    className="hidden md:flex items-center gap-2 btn btn-primary px-4 py-2"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>

                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                                        }`}
                                >
                                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {currentUser && mobileMenuOpen && (
                    <div className={`md:hidden py-4 border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
                        }`}>
                        <div className="flex flex-col gap-2">
                            {navigationLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${theme === 'dark'
                                                ? 'text-neutral-300 hover:bg-neutral-800'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{link.label}</span>
                                    </a>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onLogout();
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
