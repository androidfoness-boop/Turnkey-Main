
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { TicketCategory, EmployeeHierarchy, Role, TicketStatus, RequestType, EmployeeType, TicketPriority } from '../../../types';

interface CreateTicketFormProps {
    onFormSubmit: () => void;
}

const getFormattedDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onFormSubmit }) => {
    const { addTicket, users, currentUser, addNotification } = useAppContext();
    const [formData, setFormData] = useState({
        title: '',
        category: TicketCategory.WELDING,
        hierarchy: EmployeeHierarchy.HELPER,
        issueType: '',
        description: '',
        details: '',
        startDate: getFormattedDateTime(new Date()),
        endDate: '',
        employeesNeeded: 1,
        assignedTo: [] as string[],
        requestType: RequestType.SERVICE,
        employeeType: EmployeeType.SKILLED,
        tenure: 0,
        priority: TicketPriority.MEDIUM,
    });

    const [days, setDays] = useState(0);

    const availableEmployees = users.filter(u => u.role === Role.EMPLOYEE && u.isAvailable && u.organizationId === currentUser?.organizationId);

    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (end >= start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDays(diffDays);
            } else {
                setDays(0);
            }
        }
    }, [formData.startDate, formData.endDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormData(prev => ({ ...prev, assignedTo: values }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (days <= 0 && !(new Date(formData.startDate).toDateString() === new Date(formData.endDate).toDateString())) {
            addNotification('End date must be on or after the start date.', 'error');
            return;
        }
        
        const status = formData.assignedTo.length > 0 ? TicketStatus.ASSIGNED : TicketStatus.PENDING;
        addTicket({ ...formData, employeesNeeded: Number(formData.employeesNeeded), tenure: Number(formData.tenure), days: days || 1, status });
        onFormSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-text-primary-dark">
            <div className="space-y-4">
                <InputField name="title" label="Issue Title" value={formData.title} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                    <SelectField name="priority" label="Priority" value={formData.priority} onChange={handleChange} options={Object.values(TicketPriority)} />
                    <SelectField name="requestType" label="Request Type" value={formData.requestType} onChange={handleChange} options={Object.values(RequestType)} />
                    <SelectField name="category" label="Category" value={formData.category} onChange={handleChange} options={Object.values(TicketCategory)} />
                    <SelectField name="hierarchy" label="Required Hierarchy" value={formData.hierarchy} onChange={handleChange} options={Object.values(EmployeeHierarchy)} />
                </div>
                <InputField name="issueType" label="Issue Type (e.g., Leak)" value={formData.issueType} onChange={handleChange} />
                <TextAreaField name="description" label="Description" value={formData.description} onChange={handleChange} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <InputField name="startDate" label="Start Date" type="datetime-local" value={formData.startDate} onChange={handleChange} required />
                <InputField name="endDate" label="End Date" type="datetime-local" value={formData.endDate} onChange={handleChange} required />
            </div>
            
             <div className="grid grid-cols-2 gap-4">
                <InputField name="employeesNeeded" label="# of Employees" type="number" value={String(formData.employeesNeeded)} onChange={handleChange} required />
                <SelectField name="employeeType" label="Staff Type" value={formData.employeeType} onChange={handleChange} options={Object.values(EmployeeType)} />
            </div>
            
            <div className="pt-4 flex justify-end">
                <button type="submit" className="px-5 py-2.5 bg-accent-orange text-white font-semibold rounded-full shadow-md hover:bg-accent-orange-hover transition-colors">Submit Request</button>
            </div>
        </form>
    );
};

const baseInputClasses = "w-full bg-dark-input rounded-lg py-2 px-3 text-text-primary-dark placeholder-text-secondary-dark outline-none focus:ring-2 focus:ring-accent-orange transition-all border border-border-dark focus:border-accent-orange";

const InputField: React.FC<{name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = ({ name, label, value, onChange, type = 'text', required = false}) => (
    <div>
        <label htmlFor={name} className="block font-medium text-text-secondary-dark mb-1">{label}</label>
        <input 
            id={name} name={name} type={type} value={value} 
            onChange={onChange} required={required} 
            className={baseInputClasses}
            style={type === 'datetime-local' ? { colorScheme: 'dark' } : {}}
        />
    </div>
);
const TextAreaField: React.FC<{name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean}> = ({ name, label, value, onChange, required = false}) => (
    <div>
        <label htmlFor={name} className="block font-medium text-text-secondary-dark mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={3} className={baseInputClasses}/>
    </div>
);
const SelectField: React.FC<{name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]}> = ({ name, label, value, onChange, options}) => (
    <div>
        <label htmlFor={name} className="block font-medium text-text-secondary-dark mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className={baseInputClasses}>
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

export default CreateTicketForm;
