
import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import PieChartComponent from '../common/PieChartComponent';
import { TicketStatus } from '../../types';
import TicketList from './shared/TicketList';

interface EmployeeDashboardProps {
    activeView: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ activeView }) => {
    const { currentUser, tickets, updateUser } = useAppContext();

    // Tickets assigned to me for stats
    const myTickets = useMemo(() => 
        tickets.filter(t => t.assignedTo.includes(currentUser?.id || '')),
    [tickets, currentUser]);

    // All tickets in my organization for the list view
    const orgTickets = useMemo(() =>
        tickets.filter(t => t.organizationId === currentUser?.organizationId),
    [tickets, currentUser]);

    const ticketStats = useMemo(() => {
        const stats = {
            [TicketStatus.ASSIGNED]: 0,
            [TicketStatus.IN_PROGRESS]: 0,
            [TicketStatus.COMPLETED]: 0,
            [TicketStatus.SOLVED]: 0,
        };
        myTickets.forEach(ticket => {
            if (stats.hasOwnProperty(ticket.status)) {
                stats[ticket.status as keyof typeof stats]++;
            }
        });
        return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }, [myTickets]);

    const handleAvailabilityToggle = () => {
        if (currentUser) {
            updateUser({ ...currentUser, isAvailable: !currentUser.isAvailable });
        }
    };

    const ticketsComponent = (
        <div className="bg-dark-card p-4 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-text-primary-dark">Service Tickets</h2>
            <TicketList tickets={orgTickets} />
        </div>
    );

    return (
        <div className="space-y-6">
            {activeView === 'overview' && (
                <>
                    <div className="flex justify-between items-center bg-dark-card p-4 rounded-2xl">
                        <h1 className="text-lg font-bold">My Availability</h1>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${currentUser?.isAvailable ? 'text-green-400' : 'text-yellow-400'}`}>
                                {currentUser?.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                            <label htmlFor="availability-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="availability-toggle" className="sr-only" checked={currentUser?.isAvailable} onChange={handleAvailabilityToggle} />
                                    <div className="block bg-dark-input w-12 h-6 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${currentUser?.isAvailable ? 'transform translate-x-6 bg-accent-orange' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-dark-card p-4 rounded-2xl">
                        <PieChartComponent data={ticketStats} title="My Ticket Status" />
                    </div>
                    
                    {ticketsComponent}
                </>
            )}

            {activeView === 'tickets' && (
                <div className="space-y-6">
                    {ticketsComponent}
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
