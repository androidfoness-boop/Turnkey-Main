
import React, { ReactNode, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Role } from '../../types';
import { LogoutIcon, BackIcon } from '../../constants';

interface NavItem {
    id: string;
    label: string;
}

interface DashboardLayoutProps {
    children: ReactNode;
    activeView: string;
    setActiveView: (view: string) => void;
    onCreateTicket: () => void;
    onOpenProfile: () => void;
}

const MoreOptionsIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>
);


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeView, setActiveView, onCreateTicket, onOpenProfile }) => {
    const { currentUser } = useAppContext();

    const navigationItems = useMemo(() => {
        if (!currentUser) return [];

        const items: NavItem[] = [
            { id: 'overview', label: 'Overview' },
            { id: 'tickets', label: 'Tickets' },
        ];

        if (currentUser.role === Role.ADMIN || currentUser.role === Role.SUPERVISOR) {
            items.push({ id: 'users', label: 'Users' });
        }
        
        return items;
    }, [currentUser]);

    const showCreateButton = currentUser?.role !== Role.EMPLOYEE;

    return (
        <div className="flex flex-col h-full bg-dark-bg text-text-primary-dark relative">
            {/* Header */}
            <header className="flex items-center justify-between p-4 pt-6 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold">Hi, {currentUser?.name.split(' ')[0]}</h1>
                    <p className="text-text-secondary-dark text-sm">Monitor and manage your tasks</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={onOpenProfile} className="text-text-secondary-dark hover:text-text-primary-dark transition-colors p-2 rounded-full">
                         <MoreOptionsIcon />
                    </button>
                </div>
            </header>
            
            {/* Sub-header navigation */}
            <nav className="flex items-center space-x-6 px-4 py-3">
                {navigationItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`text-md font-semibold transition-colors ${activeView === item.id ? 'text-accent-orange' : 'text-text-secondary-dark hover:text-text-primary-dark'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-grow p-4 overflow-y-auto">
                {children}
            </main>

            {/* Floating Action Button */}
            {showCreateButton && (
                <button 
                    onClick={onCreateTicket}
                    className="absolute z-20 bottom-6 right-4 w-14 h-14 bg-accent-orange rounded-full flex items-center justify-center text-white shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            )}
        </div>
    );
};

export default DashboardLayout;
