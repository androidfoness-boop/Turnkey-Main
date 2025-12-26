
import React, { useState, useMemo, ReactNode } from 'react';
import { ServiceTicket, TicketStatus, Role, TicketPriority } from '../../../types';
import Modal from '../../common/Modal';
import { useAppContext } from '../../../hooks/useAppContext';
import { ExportIcon } from '../../../constants';

interface TicketListProps {
    tickets: ServiceTicket[];
    actionButtons?: (ticketId: string) => ReactNode;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, actionButtons }) => {
    const { currentUser, updateTicketStatus, addNotification, users } = useAppContext();
    const [filter, setFilter] = useState<string>('All');
    const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);

    const filteredTickets = useMemo(() => {
        if (filter === 'All') return tickets;
        return tickets.filter(t => t.status === filter);
    }, [tickets, filter]);

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.COMPLETED: case TicketStatus.SOLVED: return 'bg-accent-green';
            case TicketStatus.IN_PROGRESS: return 'bg-blue-500';
            case TicketStatus.ASSIGNED: return 'bg-yellow-500';
            case TicketStatus.REJECTED: return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
    
    const handleEmployeeAction = (e: React.MouseEvent, ticketId: string, status: TicketStatus) => {
        e.stopPropagation();
        updateTicketStatus(ticketId, status, currentUser?.id);
    };

    const handleExportCSV = () => {
        if (filteredTickets.length === 0) {
            addNotification("No ticket data to export.", "info");
            return;
        }

        const headers = ["ID", "Title", "Status", "Priority", "Category", "Hierarchy", "Request Type", "Start Date", "End Date", "Days", "Employees Needed", "Assigned To", "Created By", "Organization ID"];
        
        const escapeCsvField = (field: any): string => {
            const stringField = String(field ?? '');
            if (/[",\n]/.test(stringField)) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const csvRows = [headers.join(',')];
        filteredTickets.forEach(ticket => {
            const row = [
                escapeCsvField(ticket.id),
                escapeCsvField(ticket.title),
                escapeCsvField(ticket.status),
                escapeCsvField(ticket.priority),
                escapeCsvField(ticket.category),
                escapeCsvField(ticket.hierarchy),
                escapeCsvField(ticket.requestType),
                escapeCsvField(ticket.startDate),
                escapeCsvField(ticket.endDate),
                escapeCsvField(ticket.days),
                escapeCsvField(ticket.employeesNeeded),
                escapeCsvField(ticket.assignedTo.join('; ')), // Join array
                escapeCsvField(ticket.createdBy),
                escapeCsvField(ticket.organizationId),
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `turnkey_tickets_${filter}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addNotification("Ticket data exported successfully.", "success");
    };

    const employeeActionButtons = (ticket: ServiceTicket) => {
        const canTakeAction = ![TicketStatus.COMPLETED, TicketStatus.SOLVED, TicketStatus.REJECTED].includes(ticket.status);
        if (!canTakeAction) return null;

        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {ticket.status === TicketStatus.ASSIGNED && (
                    <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.IN_PROGRESS)} className="text-xs px-2 py-1 bg-green-500 text-white rounded-full hover:bg-green-600">Accept</button>
                )}
                <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.IN_PROGRESS)} className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">In Process</button>
                <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.SOLVED)} className="text-xs px-2 py-1 bg-purple-500 text-white rounded-full hover:bg-purple-600">Solved</button>
                <button onClick={(e) => handleEmployeeAction(e, ticket.id, TicketStatus.REJECTED)} className="text-xs px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-600">Reject</button>
            </div>
        );
    };

    return (
        <div className="space-y-3">
             <div className="flex justify-between items-center flex-wrap gap-2">
                 <div className="flex space-x-2 overflow-x-auto pb-2">
                    {['All', ...Object.values(TicketStatus)].map(status => (
                        <button 
                            key={status} 
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${filter === status ? 'bg-accent-green text-primary-dark' : 'bg-secondary-dark text-subtle-text hover:bg-gray-600'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                {(currentUser?.role === Role.ADMIN || currentUser?.role === Role.SUPERVISOR) && (
                     <button onClick={handleExportCSV} className="flex items-center space-x-1.5 px-3 py-1.5 bg-accent-green text-primary-dark font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition-colors text-xs">
                        <ExportIcon className="h-4 w-4" />
                        <span>Export</span>
                    </button>
                )}
            </div>
            
            <div className="space-y-3">
                {filteredTickets.map(ticket => (
                    <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="p-4 rounded-xl bg-secondary-dark cursor-pointer transition-transform hover:scale-105 hover:bg-gray-700">
                        <div className="flex items-start space-x-3">
                             <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${getStatusColor(ticket.status)}`}></div>
                            <div className="flex-grow">
                                <p className="font-semibold text-light-text">{ticket.title}</p>
                                <p className="text-xs text-subtle-text">{ticket.id} - {ticket.priority} - {ticket.category}</p>
                                {actionButtons && <div>{actionButtons(ticket.id)}</div>}
                                {currentUser?.role === Role.EMPLOYEE && employeeActionButtons(ticket)}
                            </div>
                            <span className="text-xs text-subtle-text">{ticket.startDate.split('T')[0]}</span>
                        </div>
                    </div>
                ))}
                 {filteredTickets.length === 0 && (
                    <p className="text-center text-subtle-text py-4">No tickets found.</p>
                )}
            </div>

             <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket Details: ${selectedTicket?.id}`}>
                {selectedTicket && (
                     <div className="space-y-3 text-sm text-light-text">
                        <h4 className="text-lg font-bold">{selectedTicket.title}</h4>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <p><strong>Status:</strong> <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span></p>
                            <p><strong>Priority:</strong> <span className="font-semibold" style={{ color: selectedTicket.priority === TicketPriority.HIGH ? '#D0021B' : selectedTicket.priority === TicketPriority.MEDIUM ? '#F5A623' : '#50E3C2' }}>{selectedTicket.priority}</span></p>
                            <p><strong>Category:</strong> <span className="text-subtle-text">{selectedTicket.category}</span></p>
                            <p><strong>Request Type:</strong> <span className="text-subtle-text">{selectedTicket.requestType}</span></p>
                            <p><strong>Issue Type:</strong> <span className="text-subtle-text">{selectedTicket.issueType}</span></p>
                             <p><strong>Hierarchy Level:</strong> <span className="text-subtle-text">{selectedTicket.hierarchy}</span></p>
                        </div>

                        <div className="pt-2">
                             <p><strong>Description:</strong></p>
                             <p className="text-subtle-text p-2 bg-primary-dark rounded-md mt-1">{selectedTicket.description}</p>
                        </div>
                         {selectedTicket.details && (
                            <div>
                                <p><strong>More Details:</strong></p>
                                <p className="text-subtle-text p-2 bg-primary-dark rounded-md mt-1">{selectedTicket.details}</p>
                            </div>
                         )}

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                             <p><strong>Dates:</strong> <span className="text-subtle-text">{selectedTicket.startDate.replace('T', ' ')} to {selectedTicket.endDate.replace('T', ' ')} ({selectedTicket.days} days)</span></p>
                            <p><strong>Tenure:</strong> <span className="text-subtle-text">{selectedTicket.tenure} days</span></p>
                            <p><strong>Employees Needed:</strong> <span className="text-subtle-text">{selectedTicket.employeesNeeded}</span></p>
                             <p><strong>Required Staff:</strong> <span className="text-subtle-text">{selectedTicket.employeeType}</span></p>
                        </div>
                        
                         <div className="pt-2">
                            <p><strong>Created By:</strong> <span className="text-subtle-text">{users.find(u => u.id === selectedTicket.createdBy)?.name || 'Unknown'}</span></p>
                            <p><strong>Assigned To:</strong> <span className="text-subtle-text">{
                                selectedTicket.assignedTo.length > 0 
                                ? users.filter(u => selectedTicket.assignedTo.includes(u.id)).map(u => u.name).join(', ') 
                                : 'N/A'
                            }</span></p>
                         </div>
                     </div>
                )}
            </Modal>
        </div>
    );
};

export default TicketList;
