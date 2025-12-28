import { Plus, Edit2, Trash2, Save, X, Package, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';

export default function StockManagement({ stock, onAddItem, onUpdateItem, onDeleteItem, theme }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        quantity: 0,
        min_level: 0,
        icon: '☕',
        category: 'Hot Drinks',
    });

    const categories = ['Hot Drinks', 'Cold Drinks', 'Snacks', 'Light Meals'];
    const iconOptions = ['☕', '🍵', '💧', '🍊', '🍎', '⚡', '🥤', '🥜', '🍫', '🍎', '🥛', '🥪', '🥗'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            onUpdateItem(editingItem.id, formData);
            setEditingItem(null);
        } else {
            onAddItem(formData);
            setShowAddForm(false);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            quantity: 0,
            min_level: 0,
            icon: '☕',
            category: 'Hot Drinks',
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            quantity: item.quantity,
            min_level: item.min_level || item.minLevel,
            icon: item.icon,
            category: item.category,
        });
        setShowAddForm(true);
    };

    const handleDelete = (item) => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            onDeleteItem(item.id);
        }
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingItem(null);
        resetForm();
    };

    const getStockStatus = (quantity, minLevel) => {
        const percentage = (quantity / (minLevel * 3)) * 100;
        if (percentage < 50) return { color: 'error', label: 'Critical' };
        if (percentage < 100) return { color: 'warning', label: 'Low' };
        return { color: 'success', label: 'Good' };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                        <Package className="inline mr-2" size={28} />
                        Stock Management
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        Add, edit, and manage inventory items
                    </p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add New Item
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className={`card p-6 animate-slideDown ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                        {editingItem ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Item Name */}
                            <div>
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Cappuccino"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input"
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    Initial Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    className="input"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Minimum Level */}
                            <div>
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    Minimum Level *
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_level}
                                    onChange={(e) => setFormData({ ...formData, min_level: parseInt(e.target.value) })}
                                    className="input"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Icon */}
                            <div className="md:col-span-2">
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    Icon
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`text-3xl p-3 rounded-lg border-2 transition-all ${formData.icon === icon
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-110'
                                                    : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-300'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-4">
                            <button type="submit" className="btn btn-primary flex items-center gap-2">
                                <Save size={18} />
                                {editingItem ? 'Update Item' : 'Add Item'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stock Items Table */}
            <div className={`card overflow-hidden ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-50'}>
                            <tr>
                                <th className="text-left p-4 font-semibold">Item</th>
                                <th className="text-left p-4 font-semibold">Category</th>
                                <th className="text-left p-4 font-semibold">Quantity</th>
                                <th className="text-left p-4 font-semibold">Min Level</th>
                                <th className="text-left p-4 font-semibold">Status</th>
                                <th className="text-right p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {stock.map((item, index) => {
                                const status = getStockStatus(item.quantity, item.min_level || item.minLevel);
                                return (
                                    <tr
                                        key={item.id || index}
                                        className={`transition-colors ${theme === 'dark' ? 'hover:bg-neutral-700/50' : 'hover:bg-neutral-50'
                                            }`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{item.icon}</span>
                                                <div>
                                                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge ${theme === 'dark' ? 'badge-neutral' : ''}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}>
                                                {item.min_level || item.minLevel}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge badge-${status.color} flex items-center gap-1 w-fit`}>
                                                {status.label === 'Critical' && <AlertTriangle size={14} />}
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className={`p-2 rounded-lg transition-all hover-scale ${theme === 'dark'
                                                            ? 'hover:bg-neutral-600 text-primary-400'
                                                            : 'hover:bg-primary-50 text-primary-600'
                                                        }`}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className={`p-2 rounded-lg transition-all hover-scale ${theme === 'dark'
                                                            ? 'hover:bg-neutral-600 text-red-4 00'
                                                            : 'hover:bg-red-50 text-red-600'
                                                        }`}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stock Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`card p-6 ${theme === 'dark' ? 'bg-success-900/30' : 'bg-success-50'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-success-400' : 'text-success-700'}`}>
                                Total Items
                            </p>
                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-success-300' : 'text-success-600'}`}>
                                {stock.length}
                            </p>
                        </div>
                        <Package size={40} className={theme === 'dark' ? 'text-success-400' : 'text-success-600'} />
                    </div>
                </div>

                <div className={`card p-6 ${theme === 'dark' ? 'bg-warning-900/30' : 'bg-warning-50'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-warning-400' : 'text-warning-700'}`}>
                                Low Stock Items
                            </p>
                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-warning-300' : 'text-warning-600'}`}>
                                {stock.filter(item => item.quantity < (item.min_level || item.minLevel) * 2).length}
                            </p>
                        </div>
                        <AlertTriangle size={40} className={theme === 'dark' ? 'text-warning-400' : 'text-warning-600'} />
                    </div>
                </div>

                <div className={`card p-6 ${theme === 'dark' ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-primary-400' : 'text-primary-700'}`}>
                                Total Quantity
                            </p>
                            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-primary-300' : 'text-primary-600'}`}>
                                {stock.reduce((sum, item) => sum + item.quantity, 0)}
                            </p>
                        </div>
                        <TrendingUp size={40} className={theme === 'dark' ? 'text-primary-400' : 'text-primary-600'} />
                    </div>
                </div>
            </div>
        </div>
    );
}
