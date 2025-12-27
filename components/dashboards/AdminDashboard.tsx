
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
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <h1 className="text-3xl font-bold">Admin Overview</h1>
                        <button
                            onClick={onOpenCreateUserModal}
                            className="px-3 py-2 bg-accent-blue text-white font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition-colors text-sm flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" />
                            </svg>
                            <span>Add User</span>
                        </button>
                    </div>
                    <PieChartComponent data={ticketStats} title="Ticket Status Overview" />
                    <div className="bg-secondary-dark p-4 rounded-lg">
                       <h2 className="text-xl font-semibold mb-2">Recent Tickets</h2>
                       <TicketList tickets={tickets.slice(0, 3)} />
                    </div>
                </>
            )}

            {activeView === 'tickets' && (
                 <div>
                    <h1 className="text-3xl font-bold mb-4">Service Requests</h1>
                    <TicketList tickets={tickets} />
                </div>
            )}

            {activeView === 'users' && (
                 <UserManagement />
            )}
        </div>
    );
};

export default AdminDashboard;
