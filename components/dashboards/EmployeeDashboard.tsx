
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

    const myTickets = tickets.filter(t => t.assignedTo.includes(currentUser?.id || ''));

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
        <div className="bg-secondary-dark p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-light-text">Assigned Tickets</h2>
            <TicketList tickets={myTickets} />
        </div>
    );

    return (
        <div className="space-y-6">
            {activeView === 'overview' && (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">My Overview</h1>
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">Availability:</span>
                            <label htmlFor="availability-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="availability-toggle" className="sr-only" checked={currentUser?.isAvailable} onChange={handleAvailabilityToggle} />
                                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${currentUser?.isAvailable ? 'transform translate-x-full bg-accent-green' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <PieChartComponent data={ticketStats} title="My Ticket Status" />
                        </div>
                        <div className="lg:col-span-2">
                           {ticketsComponent}
                        </div>
                    </div>
                </>
            )}

            {activeView === 'tickets' && (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">My Service Requests</h1>
                    {ticketsComponent}
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
