
import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import PieChartComponent from '../common/PieChartComponent';
import { TicketStatus } from '../../types';
import UserManagement from './shared/UserManagement';
import TicketList from './shared/TicketList';

interface AdminDashboardProps {
    activeView: string;
    onOpenCreateUserModal: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeView, onOpenCreateUserModal }) => {
    const { tickets } = useAppContext();

    const ticketStats = useMemo(() => {
        const stats = {
            [TicketStatus.PENDING]: 0,
            [TicketStatus.COMPLETED]: 0,
            [TicketStatus.IN_PROGRESS]: 0,
            'Not Assigned': 0,
        };
        tickets.forEach(ticket => {
            if (ticket.status === TicketStatus.PENDING && ticket.assignedTo.length === 0) {
                stats['Not Assigned']++;
            } else if (stats.hasOwnProperty(ticket.status)) {
                stats[ticket.status as keyof typeof stats]++;
            }
        });
        return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }, [tickets]);

    return (
        <div className="space-y-6">
            {activeView === 'overview' && (
                <>
                    <div className="bg-dark-card p-4 rounded-2xl">
                        <PieChartComponent data={ticketStats} title="Ticket Status Overview" />
                    </div>
                    <div className="bg-dark-card p-4 rounded-2xl">
                       <h2 className="text-xl font-semibold mb-3 text-text-primary-dark">Recent Tickets</h2>
                       <TicketList tickets={tickets.slice(0, 5)} />
                    </div>
                </>
            )}

            {activeView === 'tickets' && (
                 <div>
                    <TicketList tickets={tickets} />
                </div>
            )}

            {activeView === 'users' && (
                 <>
                    <div className="text-right mb-4">
                        <button
                            onClick={onOpenCreateUserModal}
                            className="px-4 py-2 bg-accent-orange text-white font-semibold rounded-full shadow-md hover:bg-accent-orange-hover transition-colors text-sm flex items-center gap-2 ml-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" />
                            </svg>
                            <span>Add User</span>
                        </button>
                    </div>
                    <UserManagement />
                 </>
            )}
        </div>
    );
};

export default AdminDashboard;
