
import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import PieChartComponent from '../common/PieChartComponent';
import { TicketStatus, Role } from '../../types';
import TicketList from './shared/TicketList';
import UserManagement from './shared/UserManagement';

interface SupervisorDashboardProps {
    activeView: string;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ activeView }) => {
    const { currentUser, tickets } = useAppContext();

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

    return (
        <div className="space-y-6">
            {activeView === 'overview' && (
                 <>
                    <h1 className="text-3xl font-bold">Supervisor Overview</h1>
                    <PieChartComponent data={ticketStats} title="Organization Ticket Status" />
                    <div className="bg-secondary-dark p-4 rounded-lg">
                       <h2 className="text-xl font-semibold mb-2">Recent Tickets</h2>
                       <TicketList tickets={orgTickets.slice(0, 3)} />
                    </div>
                </>
            )}

            {activeView === 'tickets' && (
                <div>
                    <h1 className="text-3xl font-bold mb-4">Service Requests</h1>
                    <TicketList tickets={orgTickets} />
                </div>
            )}
            
            {activeView === 'users' && (
                <UserManagement 
                    title="Manage Staff"
                    specificRoles={[Role.EMPLOYER, Role.EMPLOYEE]}
                />
            )}
        </div>
    );
};

export default SupervisorDashboard;
