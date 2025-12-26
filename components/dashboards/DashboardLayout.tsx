
import React, { ReactNode, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Role } from '../../types';

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

// Icons for navigation
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97m5.176 5.97h.01" /></svg>;

const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const ICONS: { [key: string]: React.FC } = {
    overview: HomeIcon,
    tickets: TicketIcon,
    users: UsersIcon,
};


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

    const showFab = currentUser?.role !== Role.EMPLOYEE;

    return (
        <div className="flex flex-col h-full bg-primary-dark text-light-text relative">
            {/* Header */}
            <header className="flex items-center justify-between p-4 flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-primary-dark text-lg overflow-hidden">
                        {currentUser?.profilePhoto ? (
                            <img src={currentUser.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{currentUser?.name.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold">{currentUser?.name}</p>
                        <p className="text-xs text-subtle-text">{currentUser?.role}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                     <button onClick={onOpenProfile} className="text-subtle-text hover:text-light-text transition-colors p-2 rounded-full hover:bg-secondary-dark">
                        <SettingsIcon />
                    </button>
                    {/* Could add a logout button here later */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4 overflow-y-auto pb-24">
                {children}
            </main>

            {/* Floating Action Button */}
            {showFab && (
                <button 
                    onClick={onCreateTicket}
                    className="absolute z-20 bottom-20 right-4 w-14 h-14 bg-accent-blue rounded-full flex items-center justify-center text-white shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            )}

            {/* Bottom Navigation */}
            <footer className="absolute bottom-0 left-0 right-0 h-16 bg-secondary-dark flex justify-around items-center rounded-t-xl z-10">
                {navigationItems.map(item => {
                    const Icon = ICONS[item.id] || HomeIcon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex flex-col items-center justify-center w-full transition-colors ${isActive ? 'text-accent-blue' : 'text-subtle-text hover:text-light-text'}`}
                        >
                            <Icon />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    )
                })}
            </footer>
        </div>
    );
};

export default DashboardLayout;