
import { User, Role, ServiceTicket, TicketStatus, TicketCategory, EmployeeHierarchy, RequestType, EmployeeType, TicketPriority } from './types';

// In a real backend, this would be a database.
let users: User[] = [
    { id: 'admin-001', email: 'admin@turnkey.com', password: 'Password1!', role: Role.ADMIN, name: 'Admin User', contactNumber: '1234567890', address: '1 Admin Way', pan: 'ABCDE1234F' },
    { id: 'sup-000001', email: 'supervisor@turnkey.com', password: 'Password1!', role: Role.SUPERVISOR, name: 'Supervisor Sam', contactNumber: '2345678901', address: '2 Supervisor St', pan: 'BCDEF2345G', aadhaar: '123456789012', organizationId: 'Org-000001' },
    { id: 'emplr-000001', email: 'employer@turnkey.com', password: 'Password1!', role: Role.EMPLOYER, name: 'Employer Emily', contactNumber: '3456789012', address: '3 Employer Ave', pan: 'CDEFG3456H', companyName: 'Emily\'s Enterprises', organizationId: 'Org-000001'},
    { id: 'emp-000001', email: 'employee@turnkey.com', password: 'Password1!', role: Role.EMPLOYEE, name: 'Employee Eric', contactNumber: '4567890123', address: '4 Employee Ct', pan: 'DEFG H4567I', isAvailable: true, organizationId: 'Org-000001' },
    { id: 'emp-000002', email: 'employee2@turnkey.com', password: 'Password1!', role: Role.EMPLOYEE, name: 'Employee Eve', contactNumber: '5678901234', address: '5 Employee Ln', pan: 'EFGHI5678J', isAvailable: false, organizationId: 'Org-000001' },
];

let tickets: ServiceTicket[] = [
    { id: 'SR-00001', title: 'Fix Leaky Faucet', status: TicketStatus.ASSIGNED, category: TicketCategory.PLUMBING, hierarchy: EmployeeHierarchy.JUNIOR_TECHNICIAN, issueType: 'Leak', description: 'Kitchen sink faucet is dripping constantly.', details: 'Started last night.', startDate: '2024-07-20', endDate: '2024-07-20', days: 1, employeesNeeded: 1, assignedTo: ['emp-000001'], createdBy: 'emplr-000001', organizationId: 'Org-000001', requestType: RequestType.SERVICE, employeeType: EmployeeType.SKILLED, tenure: 5, priority: TicketPriority.MEDIUM },
    { id: 'SR-00002', title: 'Rewire Main Panel', status: TicketStatus.PENDING, category: TicketCategory.ELECTRICAL, hierarchy: EmployeeHierarchy.SENIOR_TECHNICIAN, issueType: 'Power Outage', description: 'Main electrical panel needs rewiring.', details: 'Safety concern.', startDate: '2024-07-22', endDate: '2024-07-24', days: 3, employeesNeeded: 2, assignedTo: [], createdBy: 'sup-000001', organizationId: 'Org-000001', requestType: RequestType.NEW_INSTALLATION, employeeType: EmployeeType.SKILLED, tenure: 10, priority: TicketPriority.HIGH },
];

let userCounters = { admin: 1, supervisor: 1, employer: 1, employee: 2 };

const FAKE_LATENCY = 300; // ms

// --- API Functions ---

export const apiLogin = (email: string, password: string): Promise<User | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const user = users.find(u => u.email === email && u.password === password);
            resolve(user || null);
        }, FAKE_LATENCY);
    });
};

export const apiSignup = (userData: Omit<User, 'id'>): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (users.some(u => u.email === userData.email)) {
                return reject(new Error('Email already exists.'));
            }

            let newId = '';
            let organizationId: string | undefined;

            switch (userData.role) {
                 case Role.ADMIN:
                    newId = `Org-${String(userCounters.admin).padStart(6, '0')}`;
                    userCounters.admin++;
                    organizationId = newId;
                    break;
                case Role.SUPERVISOR:
                    newId = `Sup-${String(userCounters.supervisor).padStart(6, '0')}`;
                    userCounters.supervisor++;
                    break;
                case Role.EMPLOYER:
                    newId = `Emplr-${String(userCounters.employer).padStart(6, '0')}`;
                    userCounters.employer++;
                    organizationId = `Org-${String(userCounters.admin-1).padStart(6, '0')}`;
                    break;
                case Role.EMPLOYEE:
                    newId = `Emp-${String(userCounters.employee).padStart(6, '0')}`;
                    userCounters.employee++;
                    break;
            }

            const newUser: User = { ...userData, id: newId, organizationId };
            users.push(newUser);
            resolve(newUser);
        }, FAKE_LATENCY);
    });
};

export const apiGetUsers = (): Promise<User[]> => new Promise(resolve => setTimeout(() => resolve([...users]), FAKE_LATENCY));
export const apiGetTickets = (): Promise<ServiceTicket[]> => new Promise(resolve => setTimeout(() => resolve([...tickets]), FAKE_LATENCY));

export const apiAddTicket = (ticketData: Omit<ServiceTicket, 'id'>): Promise<ServiceTicket> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newId = `SR-${String(tickets.length + 1).padStart(5, '0')}`;
            const newTicket: ServiceTicket = { ...ticketData, id: newId };
            tickets = [...tickets, newTicket];
            resolve(newTicket);
        }, FAKE_LATENCY);
    });
};

export const apiUpdateTicketStatus = (ticketId: string, status: TicketStatus): Promise<ServiceTicket> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            let updatedTicket: ServiceTicket | null = null;
            tickets = tickets.map(t => {
                if (t.id === ticketId) {
                    updatedTicket = { ...t, status };
                    return updatedTicket;
                }
                return t;
            });
            if (updatedTicket) {
                resolve(updatedTicket);
            } else {
                reject(new Error('Ticket not found'));
            }
        }, FAKE_LATENCY);
    });
};

export const apiAssignTicket = (ticketId: string, employeeIds: string[]): Promise<ServiceTicket> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let updatedTicket: ServiceTicket | null = null;
            tickets = tickets.map(t => {
                if (t.id === ticketId) {
                    updatedTicket = { ...t, assignedTo: employeeIds, status: TicketStatus.ASSIGNED };
                    return updatedTicket;
                }
                return t;
            });
            if (updatedTicket) {
                resolve(updatedTicket);
            } else {
                reject(new Error('Ticket not found'));
            }
        }, FAKE_LATENCY);
    });
};

export const apiUpdateUser = (updatedUser: User): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let found = false;
            users = users.map(u => {
                if (u.id === updatedUser.id) {
                    found = true;
                    return updatedUser;
                }
                return u;
            });
            if (found) {
                resolve(updatedUser);
            } else {
                reject(new Error('User not found'));
            }
        }, FAKE_LATENCY);
    });
};

export const apiDeleteUser = (userId: string): Promise<string> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = users.length;
            users = users.filter(u => u.id !== userId);
            if (users.length < initialLength) {
                resolve(userId);
            } else {
                reject(new Error('User not found'));
            }
        }, FAKE_LATENCY);
    });
};
