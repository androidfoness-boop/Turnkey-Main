
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, ServiceTicket, TicketStatus, Notification, TicketPriority } from '../types';
import { 
    apiLogin, apiSignup, apiGetUsers, apiGetTickets, apiAddTicket, 
    apiUpdateTicketStatus, apiAssignTicket, apiUpdateUser, apiDeleteUser 
} from '../api';

interface AppContextType {
    currentUser: User | null;
    users: User[];
    tickets: ServiceTicket[];
    notifications: Notification[];
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    signup: (userData: Omit<User, 'id'>) => Promise<User | null>;
    addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
    addTicket: (ticket: Omit<ServiceTicket, 'id' | 'createdBy' | 'organizationId'>) => Promise<void>;
    updateTicketStatus: (ticketId: string, status: TicketStatus, employeeId?: string) => Promise<void>;
    assignTicket: (ticketId: string, employeeIds: string[]) => Promise<void>;
    updateUser: (updatedUser: User) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<ServiceTicket[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [loadedUsers, loadedTickets] = await Promise.all([apiGetUsers(), apiGetTickets()]);
                setUsers(loadedUsers);
                setTickets(loadedTickets);
            } catch (error) {
                addNotification("Failed to load initial app data.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const sendEmailNotification = useCallback((user: User, subject: string, body: string) => {
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

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const user = await apiLogin(email, password);
            if (user) {
                setCurrentUser(user);
                addNotification(`Welcome back, ${user.name}!`, 'success');
                return true;
            }
            addNotification('Invalid email or password.', 'error');
            return false;
        } catch (error) {
            addNotification('Login failed. Please try again.', 'error');
            return false;
        }
    };
    
    const logout = () => {
        setCurrentUser(null);
        addNotification('You have been logged out.');
    };
    
    const signup = async (userData: Omit<User, 'id'>): Promise<User | null> => {
        try {
            const newUser = await apiSignup(userData);
            setUsers(prev => [...prev, newUser]);
            addNotification('Signup successful! Please log in.', 'success');
            return newUser;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            addNotification(message, 'error');
            return null;
        }
    };

    const addTicket = async (ticketData: Omit<ServiceTicket, 'id' | 'createdBy' | 'organizationId'>) => {
        if (!currentUser) return;
        
        const newTicketData = {
            ...ticketData,
            createdBy: currentUser.id,
            organizationId: currentUser.organizationId!,
        };

        try {
            const newTicket = await apiAddTicket(newTicketData);
            setTickets(prev => [...prev, newTicket]);
            addNotification(`Ticket ${newTicket.id} created successfully.`, 'success');

            if (newTicket.priority === TicketPriority.HIGH) {
                const managers = users.filter(u =>
                    u.organizationId === newTicket.organizationId && (u.role === 'Supervisor' || u.role === 'Admin')
                );
                managers.forEach(manager => {
                    sendEmailNotification(
                        manager,
                        `High Priority Ticket Created: ${newTicket.id}`,
                        `A new high-priority ticket "${newTicket.title}" has been created.`
                    );
                });
            }
        } catch (error) {
            addNotification('Failed to create ticket.', 'error');
        }
    };

    const updateTicketStatus = async (ticketId: string, status: TicketStatus, actorId?: string) => {
        try {
            const updatedTicket = await apiUpdateTicketStatus(ticketId, status);
            setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
            addNotification(`Ticket ${ticketId} status updated to ${status}.`, 'info');

            const creator = users.find(u => u.id === updatedTicket.createdBy);
            const assignees = users.filter(u => updatedTicket.assignedTo.includes(u.id));
            const subject = `Ticket Status Update: ${updatedTicket.id} is now ${status}`;
            const body = `The status of ticket "${updatedTicket.title}" is now "${status}".`;
            
            if (creator && creator.id !== actorId) sendEmailNotification(creator, subject, body);
            assignees.forEach(assignee => {
                if (assignee.id !== actorId) sendEmailNotification(assignee, subject, body);
            });

        } catch (error) {
            addNotification('Failed to update ticket status.', 'error');
        }
    };
    
    const assignTicket = async (ticketId: string, employeeIds: string[]) => {
        try {
            const updatedTicket = await apiAssignTicket(ticketId, employeeIds);
            setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
            addNotification(`Ticket ${ticketId} assigned.`, 'success');

            const assignedUsers = users.filter(u => employeeIds.includes(u.id));
            assignedUsers.forEach(user => {
                sendEmailNotification(
                    user,
                    `New Ticket Assignment: ${ticketId}`,
                    `You have been assigned to a new ticket: "${updatedTicket.title}".`
                );
            });
        } catch (error) {
            addNotification('Failed to assign ticket.', 'error');
        }
    };

    const updateUser = async (updatedUser: User) => {
        try {
            const user = await apiUpdateUser(updatedUser);
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
            if (currentUser && currentUser.id === user.id) {
                setCurrentUser(user);
            }
            addNotification(`User ${user.name} updated.`, 'success');
        } catch (error) {
            addNotification('Failed to update user.', 'error');
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            await apiDeleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            addNotification('User deleted.', 'success');
        } catch (error) {
            addNotification('Failed to delete user.', 'error');
        }
    };

    const value = {
        currentUser, users, tickets, notifications, isLoading,
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
