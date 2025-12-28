import { Coffee, Home, Package, Settings, Users, Bell, BarChart } from 'lucide-react';
import HellBackground from './components/HellBackground';
import Dock from './components/Dock';

/**
 * Example Demo Component showing HellBackground and Dock usage
 */
export default function ComponentsDemo() {
    // Define dock items
    const dockItems = [
        {
            icon: <Home size={24} />,
            label: 'Home',
            onClick: () => console.log('Home clicked'),
        },
        {
            icon: <Coffee size={24} />,
            label: 'Orders',
            onClick: () => console.log('Orders clicked'),
            badgeCount: 5, // Shows notification badge
        },
        {
            icon: <Package size={24} />,
            label: 'Stock',
            onClick: () => console.log('Stock clicked'),
        },
        {
            icon: <Users size={24} />,
            label: 'Users',
            onClick: () => console.log('Users clicked'),
            badgeCount: 12,
        },
        {
            icon: <BarChart size={24} />,
            label: 'Analytics',
            onClick: () => console.log('Analytics clicked'),
        },
        {
            icon: <Bell size={24} />,
            label: 'Notifications',
            onClick: () => console.log('Notifications clicked'),
            badgeCount: 3,
        },
        {
            icon: <Settings size={24} />,
            label: 'Settings',
            onClick: () => console.log('Settings clicked'),
        },
    ];

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* HellBackground - WebGL animated background */}
            <HellBackground
                color="#667eea" // Purple color for the animation
                backdropBlurAmount="md" // Options: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
                className="fixed inset-0 z-0"
            />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-4 mb-20">
                    <h1 className="text-6xl font-bold text-white drop-shadow-2xl">
                        Office Order System
                    </h1>
                    <p className="text-2xl text-white/90 drop-shadow-lg">
                        Premium UI Components Demo
                    </p>
                </div>
            </div>

            {/* Dock at the bottom */}
            <Dock
                items={dockItems}
                magnification={80} // How big items get on hover
                distance={150} // Distance at which magnification starts
                baseItemSize={50} // Default item size
            />
        </div>
    );
}
