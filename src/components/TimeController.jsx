import { Clock, Save, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TimeController({ onSave, theme }) {
    const [workingHours, setWorkingHours] = useState({
        startHour: 8,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    });

    const [saved, setSaved] = useState(false);

    const days = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
    ];

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('workingHours', JSON.stringify(workingHours));
        if (onSave) {
            onSave(workingHours);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const toggleDay = (dayValue) => {
        setWorkingHours(prev => ({
            ...prev,
            workingDays: prev.workingDays.includes(dayValue)
                ? prev.workingDays.filter(d => d !== dayValue)
                : [...prev.workingDays, dayValue].sort()
        }));
    };

    const resetToDefault = () => {
        setWorkingHours({
            startHour: 8,
            startMinute: 0,
            endHour: 17,
            endMinute: 0,
            workingDays: [1, 2, 3, 4, 5],
        });
    };

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('workingHours');
        if (saved) {
            setWorkingHours(JSON.parse(saved));
        }
    }, []);

    const formatTime = (hour, minute) => {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                    <Clock className="inline mr-2" size={28} />
                    Working Hours Configuration
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Set office working hours and days for order placement
                </p>
            </div>

            {/* Configuration Card */}
            <div className={`card p-6 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-white'}`}>
                <div className="space-y-6">
                    {/* Time Range */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                            Operating Hours
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Time */}
                            <div>
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    Start Time
                                </label>
                                <div className="flex gap-3">
                                    <select
                                        value={workingHours.startHour}
                                        onChange={(e) => setWorkingHours({ ...workingHours, startHour: parseInt(e.target.value) })}
                                        className="input flex-1"
                                    >
                                        {[...Array(24)].map((_, i) => (
                                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                    <span className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>:</span>
                                    <select
                                        value={workingHours.startMinute}
                                        onChange={(e) => setWorkingHours({ ...workingHours, startMinute: parseInt(e.target.value) })}
                                        className="input flex-1"
                                    >
                                        {[0, 15, 30, 45].map(m => (
                                            <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                    Current: {formatTime(workingHours.startHour, workingHours.startMinute)}
                                </p>
                            </div>

                            {/* End Time */}
                            <div>
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    End Time
                                </label>
                                <div className="flex gap-3">
                                    <select
                                        value={workingHours.endHour}
                                        onChange={(e) => setWorkingHours({ ...workingHours, endHour: parseInt(e.target.value) })}
                                        className="input flex-1"
                                    >
                                        {[...Array(24)].map((_, i) => (
                                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                    <span className={`flex items-center ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>:</span>
                                    <select
                                        value={workingHours.endMinute}
                                        onChange={(e) => setWorkingHours({ ...workingHours, endMinute: parseInt(e.target.value) })}
                                        className="input flex-1"
                                    >
                                        {[0, 15, 30, 45].map(m => (
                                            <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                    Current: {formatTime(workingHours.endHour, workingHours.endMinute)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Working Days */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-neutral-800'}`}>
                            Working Days
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {days.map(day => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(day.value)}
                                    className={`p-3 rounded-lg font-semibold transition-all ${workingHours.workingDays.includes(day.value)
                                            ? 'bg-primary-500 text-white shadow-lg scale-105'
                                            : theme === 'dark'
                                                ? 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                        <p className={`text-sm mt-3 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            Selected: {workingHours.workingDays.length} day(s)
                        </p>
                    </div>

                    <div className="divider"></div>

                    {/* Preview */}
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-primary-900/30' : 'bg-primary-50'}`}>
                        <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-primary-300' : 'text-primary-700'}`}>
                            Current Configuration
                        </h4>
                        <p className={theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}>
                            <strong>Hours:</strong> {formatTime(workingHours.startHour, workingHours.startMinute)} - {formatTime(workingHours.endHour, workingHours.endMinute)}
                        </p>
                        <p className={theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}>
                            <strong>Days:</strong> {workingHours.workingDays.map(d => days.find(day => day.value === d)?.label).join(', ')}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            {saved ? 'Saved!' : 'Save Configuration'}
                        </button>
                        <button
                            onClick={resetToDefault}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Reset to Default
                        </button>
                    </div>

                    {saved && (
                        <div className="p-3 rounded-lg bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-700 text-success-700 dark:text-success-400 animate-slideDown">
                            ✅ Configuration saved successfully!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
