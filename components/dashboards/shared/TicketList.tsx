
import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { ServiceTicket, TicketStatus, Role, TicketPriority } from '../../../types';
import Modal from '../../common/Modal';
import { useAppContext } from '../../../hooks/useAppContext';
import { ExportIcon } from '../../../constants';

interface TicketListProps {
    tickets: ServiceTicket[];
    actionButtons?: (ticketId: string) => ReactNode;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, actionButtons }) => {
    const { currentUser, updateTicketStatus, addNotification, users, assignTicket } = useAppContext();
    const [filter, setFilter] = useState<string>('All');
    const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (selectedTicket) {
            setSelectedAssignees(selectedTicket.assignedTo || []);
        }
    }, [selectedTicket]);

    const filteredTickets = useMemo(() => {
        return tickets
            .filter(t => filter === 'All' || t.status === filter)
            .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [tickets, filter, searchTerm]);

    const canAssign = currentUser && [Role.ADMIN, Role.SUPERVISOR, Role.EMPLOYER].includes(currentUser.role);

    const availableEmployees = useMemo(() => {
        if (!selectedTicket) return [];
        return users.filter(u => u.role === Role.EMPLOYEE && u.organizationId === selectedTicket.organizationId);
    }, [users, selectedTicket]);

    const getStatusInfo = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.COMPLETED: case TicketStatus.SOLVED: return { color: 'bg-green-500', text: 'Completed' };
            case TicketStatus.IN_PROGRESS: return { color: 'bg-blue-500', text: 'In Progress' };
            case TicketStatus.ASSIGNED: return { color: 'bg-yellow-500', text: 'Assigned' };
            case TicketStatus.REJECTED: return { color: 'bg-red-500', text: 'Rejected' };
            default: return { color: 'bg-gray-500', text: 'Pending' };
        }
    };
    
    const handleEmployeeAction = (e: React.MouseEvent, ticketId: string, status: TicketStatus) => {
        e.stopPropagation();
        updateTicketStatus(ticketId, status, currentUser?.id);
    };

    const handleAssigneeCheckboxChange = (employeeId: string) => {
        setSelectedAssignees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleSaveAssignment = () => {
        if (selectedTicket) {
            assignTicket(selectedTicket.id, selectedAssignees);
            addNotification(`Ticket ${selectedTicket.id} assignment updated.`, 'success');
            setSelectedTicket(null);
        }
    };

    const employeeActionButtons = (ticket: ServiceTicket) => {
        const canTakeAction = ![TicketStatus.COMPLETED, TicketStatus.SOLVED, TicketStatus.REJECTED].includes(ticket.status);
        if (!canTakeAction) return null;

        return (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-dark">
                {ticket.status === TicketStatus.ASSIGNED && (
                    <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.IN_PROGRESS)} className="text-xs px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700">Accept</button>
                )}
                 <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.IN_PROGRESS)} className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">In Process</button>
                 <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.SOLVED)} className="text-xs px-3 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700">Solved</button>
                 <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.REJECTED)} className="text-xs px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700">Reject</button>
            </div>
        );
    };

    return (
        <div className="space-y-4">
             <div className="relative">
                <input 
                    type="text"
                    placeholder="Search tickets by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-input border border-border-dark rounded-full text-text-primary-dark placeholder-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-accent-orange"
                />
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-text-secondary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>
            
            <div className="space-y-3">
                {filteredTickets.map(ticket => (
                    <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="bg-dark-card p-4 rounded-2xl cursor-pointer transition-all hover:bg-border-dark">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-text-primary-dark">{ticket.title}</p>
                            <svg className="h-5 w-5 text-text-secondary-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </div>
                        <div className="flex items-center space-x-2 text-xs mt-1 text-text-secondary-dark">
                             <div className={`w-2 h-2 rounded-full ${getStatusInfo(ticket.status).color}`}></div>
                            <span>{getStatusInfo(ticket.status).text}</span>
                            <span>&bull;</span>
                            <span>{ticket.id}</span>
                             <span>&bull;</span>
                            <span>Priority: {ticket.priority}</span>
                        </div>
                         {currentUser?.role === Role.EMPLOYEE && (ticket.status === TicketStatus.PENDING || ticket.status === TicketStatus.ASSIGNED) && !ticket.assignedTo.includes(currentUser.id) && (
                             <div className="mt-3 text-right">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (currentUser) assignTicket(ticket.id, [currentUser.id]);
                                    }}
                                    className="text-xs px-3 py-1 bg-accent-orange text-white font-semibold rounded-full hover:bg-accent-orange-hover"
                                >
                                    Assign to Me
                                </button>
                             </div>
                         )}
                         {actionButtons && <div className="mt-2">{actionButtons(ticket.id)}</div>}
                    </div>
                ))}
            </div>

            {filteredTickets.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-text-secondary-dark">No tickets found.</p>
                </div>
            )}

             <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={selectedTicket?.title || 'Ticket Details'}>
                {selectedTicket && (
                    <>
                        <div className="space-y-4 text-sm text-text-primary-dark">
                            <div className="p-3 bg-dark-input rounded-lg">
                                <p className="font-semibold text-text-secondary-dark">Description</p>
                                <p>{selectedTicket.description}</p>
                            </div>
                            
                            <div className="border-t border-border-dark pt-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><strong className="text-text-secondary-dark block">Status</strong> {selectedTicket.status}</div>
                                    <div><strong className="text-text-secondary-dark block">Priority</strong> {selectedTicket.priority}</div>
                                    <div><strong className="text-text-secondary-dark block">Category</strong> {selectedTicket.category}</div>
                                    <div><strong className="text-text-secondary-dark block">Dates</strong> {selectedTicket.startDate.split('T')[0]} - {selectedTicket.endDate.split('T')[0]}</div>
                                    <div><strong className="text-text-secondary-dark block">Assigned To</strong> {users.filter(u => selectedTicket.assignedTo.includes(u.id)).map(u => u.name).join(', ') || 'N/A'}</div>
                                </div>
                            </div>

                            {currentUser?.role === Role.EMPLOYEE && (
                                employeeActionButtons(selectedTicket)
                            )}
                        </div>
                        {canAssign && (
                            <div className="pt-4 mt-4 border-t border-border-dark">
                                <h4 className="text-md font-bold mb-2 text-text-primary-dark">Manage Assignment</h4>
                                <div className="mt-1 block w-full bg-dark-input rounded-md h-32 overflow-y-auto p-2 border border-border-dark">
                                    {availableEmployees.length > 0 ? availableEmployees.map(emp => (
                                        <div key={emp.id} className="flex items-center space-x-3 p-1 rounded hover:bg-border-dark">
                                            <input
                                                type="checkbox"
                                                id={`assignee-${emp.id}`}
                                                value={emp.id}
                                                checked={selectedAssignees.includes(emp.id)}
                                                onChange={() => handleAssigneeCheckboxChange(emp.id)}
                                                disabled={!emp.isAvailable}
                                                className="h-4 w-4 rounded bg-dark-input border-text-secondary-dark text-accent-orange focus:ring-accent-orange cursor-pointer disabled:cursor-not-allowed"
                                            />
                                            <label htmlFor={`assignee-${emp.id}`} className={`text-sm ${!emp.isAvailable ? 'text-text-secondary-dark line-through cursor-not-allowed' : 'text-text-primary-dark cursor-pointer'}`}>
                                                {emp.name}
                                            </label>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-text-secondary-dark text-center pt-10">No available employees.</p>
                                    )}
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleSaveAssignment}
                                        className="px-4 py-2 bg-accent-orange text-white font-semibold rounded-full shadow-md hover:bg-accent-orange-hover transition-colors"
                                    >
                                        Update Assignment
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};

export default TicketList;
