
export enum Role {
    ADMIN = 'Admin',
    SUPERVISOR = 'Supervisor',
    EMPLOYER = 'Employer',
    EMPLOYEE = 'Employee'
}

export enum TicketStatus {
    PENDING = 'Pending',
    ASSIGNED = 'Assigned',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    REJECTED = 'Rejected',
    SOLVED = 'Solved'
}

export interface User {
    id: string;
    email: string;
    password?: string;
    role: Role;
    name: string;
    contactNumber: string;
    address: string;
    pan: string;
    aadhaar?: string;
    companyName?: string;
    organizationId?: string; // Links employers and their employees
    isAvailable?: boolean;
    profilePhoto?: string; // To store base64 image data URL
}

export enum TicketCategory {
    WELDING = 'Welding',
    PLUMBING = 'Plumbing',
    ELECTRICAL = 'Electrical Works',
    HVAC = 'HT and LT line works',
    MACHINERY = 'Machinery Service',
    CIVIL = 'Civil Works',
    CABLING = 'Cable Laying',
    TRAY = 'Tray Laying'
}

export enum EmployeeHierarchy {
    SUPERVISOR = 'Supervisor',
    SENIOR_TECHNICIAN = 'Senior Technician',
    JUNIOR_TECHNICIAN = 'Junior Technician',
    HELPER = 'Helper'
}

export enum RequestType {
    MAINTENANCE = 'Maintenance',
    NEW_INSTALLATION = 'New Installation',
    SERVICE = 'Service',
    INTEGRATION = 'Integration',
    DISMANTLE = 'Dismantle'
}

export enum EmployeeType {
    SKILLED = 'Skilled',
    UNSKILLED = 'Unskilled'
}

export enum TicketPriority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low'
}


export interface ServiceTicket {
    id: string;
    title: string;
    status: TicketStatus;
    category: TicketCategory;
    hierarchy: EmployeeHierarchy;
    issueType: string;
    description: string;
    details: string;
    startDate: string;
    endDate: string;
    days: number;
    employeesNeeded: number;
    assignedTo: string[]; // User IDs
    createdBy: string; // User ID
    organizationId: string;
    requestType: RequestType;
    employeeType: EmployeeType;
    tenure: number;
    priority: TicketPriority;
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}