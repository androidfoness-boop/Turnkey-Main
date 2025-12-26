
import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import PieChartComponent from '../common/PieChartComponent';
import { TicketStatus } from '../../types';
import TicketList from './shared/TicketList';

interface EmployerDashboardProps {
    activeView: string;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ activeView }) => {
    const { currentUser, tickets, updateTicketStatus } = useAppContext();

    const orgTickets = tickets.filter(t => t.organizationId === currentUser?.organizationId);
    
    const ticketStats = useMemo(() => {
        const stats = {
            [TicketStatus.PENDING]: 0,
            [TicketStatus.COMPLETED]: 0,
            [TicketStatus.IN_PROGRESS]: 0,
            'Not Assigned': 0,
        };
        orgTickets.forEach(ticket => {
             if (ticket.status === TicketStatus.PENDING && ticket.assignedTo.length === 0) {
                stats['Not Assigned']++;
            } else if (stats.hasOwnProperty(ticket.status)) {
                stats[ticket.status as keyof typeof stats]++;
            }
        });
        return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }, [orgTickets]);

    const handleTicketAction = (e: React.MouseEvent, ticketId: string, status: TicketStatus) => {
        e.stopPropagation(); // Prevent modal from opening
        updateTicketStatus(ticketId, status);
    };

    const actionButtons = (ticketId: string) => (
        <div className="flex space-x-2 mt-2">
            <button onClick={(e) => handleTicketAction(e, ticketId, TicketStatus.IN_PROGRESS)} className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">In Progress</button>
            <button onClick={(e) => handleTicketAction(e, ticketId, TicketStatus.SOLVED)} className="text-xs px-2 py-1 bg-green-500 text-white rounded-full hover:bg-green-600">Resolve</button>
        </div>
    );

    return (
        <div className="space-y-6">
            {activeView === 'overview' && (
                <>
                    <h1 className="text-3xl font-bold">Employer Overview</h1>
                    <PieChartComponent data={ticketStats} title="My Ticket Status" />
                    <div className="bg-secondary-dark p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Recent Tickets</h2>
                        <TicketList tickets={orgTickets.slice(0, 3)} actionButtons={actionButtons} />
                    </div>
                </>
            )}

            {activeView === 'tickets' && (
                <div>
                    <h1 className="text-3xl font-bold mb-4">My Service Requests</h1>
                    <TicketList tickets={orgTickets} actionButtons={actionButtons} />
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;
