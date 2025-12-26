
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Role, ServiceTicket, TicketStatus, Notification, TicketCategory, EmployeeHierarchy, RequestType, EmployeeType, TicketPriority } from '../types';

// Initial Mock Data
const initialUsers: User[] = [
    { id: 'admin-001', email: 'admin@turnkey.com', password: 'Password1!', role: Role.ADMIN, name: 'Admin User', contactNumber: '1234567890', address: '1 Admin Way', pan: 'ABCDE1234F' },
    { id: 'sup-000001', email: 'supervisor@turnkey.com', password: 'Password1!', role: Role.SUPERVISOR, name: 'Supervisor Sam', contactNumber: '2345678901', address: '2 Supervisor St', pan: 'BCDEF2345G', aadhaar: '123456789012', organizationId: 'Org-000001' },
    { id: 'emplr-000001', email: 'employer@turnkey.com', password: 'Password1!', role: Role.EMPLOYER, name: 'Employer Emily', contactNumber: '3456789012', address: '3 Employer Ave', pan: 'CDEFG3456H', companyName: 'Emily\'s Enterprises', organizationId: 'Org-000001'},
    { id: 'emp-000001', email: 'employee@turnkey.com', password: 'Password1!', role: Role.EMPLOYEE, name: 'Employee Eric', contactNumber: '4567890123', address: '4 Employee Ct', pan: 'DEFG H4567I', isAvailable: true, organizationId: 'Org-000001' },
    { id: 'emp-000002', email: 'employee2@turnkey.com', password: 'Password1!', role: Role.EMPLOYEE, name: 'Employee Eve', contactNumber: '5678901234', address: '5 Employee Ln', pan: 'EFGHI5678J', isAvailable: false, organizationId: 'Org-000001' },
];

const initialTickets: ServiceTicket[] = [
    { id: 'SR-00001', title: 'Fix Leaky Faucet', status: TicketStatus.ASSIGNED, category: TicketCategory.PLUMBING, hierarchy: EmployeeHierarchy.JUNIOR_TECHNICIAN, issueType: 'Leak', description: 'Kitchen sink faucet is dripping constantly.', details: 'Started last night.', startDate: '2024-07-20', endDate: '2024-07-20', days: 1, employeesNeeded: 1, assignedTo: ['emp-000001'], createdBy: 'emplr-000001', organizationId: 'Org-000001', requestType: RequestType.SERVICE, employeeType: EmployeeType.SKILLED, tenure: 5, priority: TicketPriority.MEDIUM },
    { id: 'SR-00002', title: 'Rewire Main Panel', status: TicketStatus.PENDING, category: TicketCategory.ELECTRICAL, hierarchy: EmployeeHierarchy.SENIOR_TECHNICIAN, issueType: 'Power Outage', description: 'Main electrical panel needs rewiring.', details: 'Safety concern.', startDate: '2024-07-22', endDate: '2024-07-24', days: 3, employeesNeeded: 2, assignedTo: [], createdBy: 'sup-000001', organizationId: 'Org-000001', requestType: RequestType.NEW_INSTALLATION, employeeType: EmployeeType.SKILLED, tenure: 10, priority: TicketPriority.HIGH },
];

interface AppContextType {
    currentUser: User | null;
    users: User[];
    tickets: ServiceTicket[];
    notifications: Notification[];
    login: (email: string, password: string) => boolean;
    logout: () => void;
    signup: (userData: Omit<User, 'id'>) => User | null;
    addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
    addTicket: (ticket: Omit<ServiceTicket, 'id' | 'createdBy' | 'organizationId'>) => void;
    updateTicketStatus: (ticketId: string, status: TicketStatus, employeeId?: string) => void;
    assignTicket: (ticketId: string, employeeIds: string[]) => void;
    updateUser: (updatedUser: User) => void;
    deleteUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [tickets, setTickets] = useState<ServiceTicket[]>(initialTickets);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userCounters, setUserCounters] = useState({ admin: 1, supervisor: 1, employer: 1, employee: 2 });

    // Email Notification Simulation
    const sendEmailNotification = useCallback((user: User, subject: string, body: string) => {
        // In a real app, this would use an email service API
        console.log(`
            --- SIMULATING EMAIL ---
            To: ${user.email} (${user.name})
            Subject: ${subject}
            
            Body:
            ${body}
            --------------------------
        `);
    }, []);


    const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const newNotification: Notification = { id: Date.now(), message, type };
        setNotifications(prev => [...prev, newNotification]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
    };

    const login = (email: string, password: string): boolean => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            addNotification(`Welcome back, ${user.name}!`, 'success');
            return true;
        }
        addNotification('Invalid email or password.', 'error');
        return false;
    };
    
    const logout = () => {
        setCurrentUser(null);
        addNotification('You have been logged out.');
    };
    
    const signup = (userData: Omit<User, 'id'>): User | null => {
        if (users.some(u => u.email === userData.email)) {
            addNotification('Email already exists.', 'error');
            return null;
        }

        let newId = '';
        const newCounters = { ...userCounters };
        let organizationId = currentUser?.organizationId;

        switch (userData.role) {
            case Role.ADMIN:
                newId = `Org-${String(newCounters.admin).padStart(6, '0')}`;
                newCounters.admin++;
                organizationId = newId;
                break;
            case Role.SUPERVISOR:
                newId = `Sup-${String(newCounters.supervisor).padStart(6, '0')}`;
                newCounters.supervisor++;
                break;
            case Role.EMPLOYER:
                newId = `Emplr-${String(newCounters.employer).padStart(6, '0')}`;
                newCounters.employer++;
                 organizationId = `Org-${String(newCounters.admin-1).padStart(6, '0')}`;
                break;
            case Role.EMPLOYEE:
                newId = `Emp-${String(newCounters.employee).padStart(6, '0')}`;
                newCounters.employee++;
                break;
        }

        const newUser: User = { ...userData, id: newId, organizationId };
        setUsers(prev => [...prev, newUser]);
        setUserCounters(newCounters);
        addNotification('Signup successful! Please log in.', 'success');
        return newUser;
    };

    const addTicket = (ticketData: Omit<ServiceTicket, 'id' | 'createdBy' | 'organizationId'>) => {
        if (!currentUser) return;
        const newId = `SR-${String(tickets.length + 1).padStart(5, '0')}`;
        const newTicket: ServiceTicket = {
            ...ticketData,
            id: newId,
            createdBy: currentUser.id,
            organizationId: currentUser.organizationId!,
        };
        setTickets(prev => [...prev, newTicket]);
        addNotification(`Ticket ${newId} created successfully.`, 'success');

        // High-priority ticket notification
        if (newTicket.priority === TicketPriority.HIGH) {
            const managers = users.filter(u =>
                u.organizationId === newTicket.organizationId && (u.role === Role.SUPERVISOR || u.role === Role.ADMIN)
            );
            managers.forEach(manager => {
                sendEmailNotification(
                    manager,
                    `High Priority Ticket Created: ${newTicket.id}`,
                    `A new high-priority ticket "${newTicket.title}" has been created for your organization and requires attention.`
                );
            });
        }
    };

    const updateTicketStatus = (ticketId: string, status: TicketStatus, actorId?: string) => {
        setTickets(prevTickets => {
            const newTickets = [...prevTickets];
            const ticketIndex = newTickets.findIndex(t => t.id === ticketId);
            if (ticketIndex === -1) return prevTickets;

            const ticket = newTickets[ticketIndex];
            newTickets[ticketIndex] = { ...ticket, status };

            addNotification(`Ticket ${ticketId} status updated to ${status}.`, 'info');
            
            // Email notifications
            const creator = users.find(u => u.id === ticket.createdBy);
            const assignees = users.filter(u => ticket.assignedTo.includes(u.id));

            const subject = `Ticket Status Update: ${ticket.id} is now ${status}`;
            const body = `The status of the ticket "${ticket.title}" has been updated to "${status}" by ${users.find(u => u.id === actorId)?.name || 'the system'}.`;
            
            // Notify creator
            if (creator && creator.id !== actorId) {
                sendEmailNotification(creator, subject, body);
            }

            // Notify assignees
            assignees.forEach(assignee => {
                if (assignee.id !== actorId) {
                    sendEmailNotification(assignee, subject, body);
                }
            });

            return newTickets;
        });
    };
    
    const assignTicket = (ticketId: string, employeeIds: string[]) => {
         setTickets(prevTickets =>
            prevTickets.map(ticket => {
                if (ticket.id === ticketId) {
                    addNotification(`Ticket ${ticketId} assigned.`, 'success');
                    
                    const assignedUsers = users.filter(u => employeeIds.includes(u.id));
                    assignedUsers.forEach(user => {
                        sendEmailNotification(
                            user,
                            `New Ticket Assignment: ${ticket.id}`,
                            `You have been assigned to a new ticket: "${ticket.title}". Please log in to TurnKey to view details.`
                        );
                    });
                    
                    return { ...ticket, assignedTo: employeeIds, status: TicketStatus.ASSIGNED };
                }
                return ticket;
            })
        );
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser && currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
        addNotification(`User ${updatedUser.name} updated.`, 'success');
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        addNotification('User deleted.', 'success');
    };

    const value = {
        currentUser, users, tickets, notifications,
        login, logout, signup, addNotification,
        addTicket, updateTicketStatus, assignTicket,
        updateUser, deleteUser
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};