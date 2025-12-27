
import React, { useState } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { Role } from '../../../types';
import PasswordInput from '../../PasswordInput';

interface CreateUserFormProps {
    onFormSubmit: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onFormSubmit }) => {
    const { signup, currentUser, addNotification } = useAppContext();
    const [role, setRole] = useState<Role.SUPERVISOR | Role.EMPLOYER | Role.EMPLOYEE>(Role.EMPLOYEE);
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '', name: '',
        contactNumber: '', address: '', pan: '', aadhaar: '', companyName: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "role") {
            setRole(value as Role.SUPERVISOR | Role.EMPLOYER | Role.EMPLOYEE);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            addNotification("Passwords do not match.", "error");
            return;
        }
        if (!currentUser?.organizationId) {
            addNotification("Cannot create user: Admin organization is not defined.", "error");
            return;
        }

        const newUser = await signup({
            email: formData.email,
            password: formData.password,
            role,
            name: formData.name,
            contactNumber: formData.contactNumber,
            address: formData.address,
            pan: formData.pan,
            // FIX: This comparison appears to be unintentional because the types 'Role.SUPERVISOR | Role.EMPLOYER | Role.EMPLOYEE' and 'Role.ADMIN' have no overlap.
            // Replaced with an explicit check against allowed roles to fix the error.
            aadhaar: (role === Role.SUPERVISOR || role === Role.EMPLOYER || role === Role.EMPLOYEE) ? formData.aadhaar : undefined,
            companyName: role === Role.EMPLOYER ? formData.companyName : undefined,
            organizationId: currentUser.organizationId,
            isAvailable: role === Role.EMPLOYEE ? true : undefined,
        });

        if (newUser) {
            addNotification(`User ${newUser.name} created successfully.`, "success");
            onFormSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-light-text">
            <SelectField name="role" label="User Role" value={role} onChange={handleChange} options={[Role.EMPLOYEE, Role.SUPERVISOR, Role.EMPLOYER]} />
            
            {role === Role.EMPLOYER && <InputField name="companyName" label="Company Name" value={formData.companyName} onChange={handleChange} required />}
            <InputField name="name" label={role === Role.EMPLOYER ? "Contact Name" : "Full Name"} value={formData.name} onChange={handleChange} required />
            <InputField name="email" label="Email ID" type="email" value={formData.email} onChange={handleChange} required />
            <InputField name="contactNumber" label="Contact Number" type="tel" value={formData.contactNumber} onChange={handleChange} required />
            <InputField name="address" label="Address" value={formData.address} onChange={handleChange} required />
            <InputField name="pan" label={role === Role.EMPLOYER ? "Company PAN Card" : "PAN Card"} value={formData.pan} onChange={handleChange} required />
            {(role === Role.SUPERVISOR || role === Role.EMPLOYER || role === Role.EMPLOYEE) && <InputField name="aadhaar" label="Aadhaar Card" value={formData.aadhaar} onChange={handleChange} />}

            <PasswordInput value={formData.password} onChange={(val) => setFormData(p => ({...p, password: val}))} id="password-create" label="Password" />
            <PasswordInput value={formData.confirmPassword} onChange={(val) => setFormData(p => ({...p, confirmPassword: val}))} id="confirm-password-create" label="Confirm Password"/>
            
            <div className="flex justify-end pt-4">
                <button type="submit" className="px-4 py-2 bg-accent-blue text-white font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition-colors">Create User</button>
            </div>
        </form>
    );
};

// Helper components for form fields to keep the main component clean
const InputField: React.FC<{name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = ({ name, label, value, onChange, type = 'text', required = false}) => (
    <div>
        <label htmlFor={name} className="block font-medium text-subtle-text">{label}</label>
        <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} className="mt-1 block w-full h-10 px-3 py-2 bg-secondary-dark border border-gray-600 rounded-md shadow-sm focus:ring-accent-blue focus:border-accent-blue text-light-text" />
    </div>
);

const SelectField: React.FC<{name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]}> = ({ name, label, value, onChange, options}) => (
    <div>
        <label htmlFor={name} className="block font-medium text-subtle-text">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full h-10 pl-3 pr-10 py-2 text-base border-gray-600 bg-secondary-dark focus:outline-none focus:ring-accent-blue focus:border-accent-blue sm:text-sm rounded-md">
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

export default CreateUserForm;
