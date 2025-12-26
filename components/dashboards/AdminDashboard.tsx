
import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import PieChartComponent from '../common/PieChartComponent';
import { TicketStatus } from '../../types';
import UserManagement from './shared/UserManagement';
import TicketList from './shared/TicketList';

interface AdminDashboardProps {
    activeView: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeView }) => {
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
                    <h1 className="text-3xl font-bold">Admin Overview</h1>
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
