
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import PasswordInput from './PasswordInput';
import { BackIcon } from '../constants';


const SignupScreen: React.FC = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role | ''>('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        contactNumber: '',
        address: '',
        pan: '',
        aadhaar: '',
        companyName: '',
        agreePolicy: false,
    });
    const { signup, addNotification } = useAppContext();
    const navigate = useNavigate();

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreePolicy) {
            addNotification("You must agree to the Privacy Policy.", "error");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            addNotification("Passwords do not match.", "error");
            return;
        }
        if (!role) {
            addNotification("Please select a role.", "error");
            return;
        }

        const newUser = signup({
            email: formData.email,
            password: formData.password,
            role,
            name: formData.name,
            contactNumber: formData.contactNumber,
            address: formData.address,
            pan: formData.pan,
            aadhaar: role === Role.SUPERVISOR || role === Role.EMPLOYER ? formData.aadhaar : undefined,
            companyName: role === Role.ADMIN || role === Role.EMPLOYER ? formData.companyName : undefined,
            isAvailable: role === Role.EMPLOYEE ? true : undefined,
        });

        if (newUser) {
            navigate('/login');
        }
    };
    
    const goBack = () => {
        if(step === 2) {
            setStep(1);
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="min-h-full flex flex-col text-text-primary-dark p-4 relative overflow-hidden auth-bg">
            <div className="z-10 w-full flex flex-col justify-start flex-grow">
                 <div className="mb-4 text-left">
                    <button onClick={goBack} className="text-text-secondary-dark hover:text-text-primary-dark p-2">
                         <BackIcon />
                    </button>
                </div>
                 <h2 className="text-3xl font-bold text-center">Create Account</h2>
                 <p className="text-center text-text-secondary-dark mt-1 mb-6 text-sm">
                    {step === 2 ? `Enter details for your ${role} account` : 'First, select your role.'}
                 </p>

                {step === 1 && (
                    <div className="space-y-3 p-2">
                        {(Object.values(Role) as Role[]).map(r => (
                            <button key={r} onClick={() => handleRoleSelect(r)}
                                className="w-full text-center p-3 bg-dark-input rounded-lg hover:bg-border-dark transition-colors">
                                <span className="font-semibold text-text-primary-dark">{r}</span>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && role && (
                    <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            { (role === Role.ADMIN || role === Role.EMPLOYER) && <InputField name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required /> }
                            <InputField name="name" placeholder={role === Role.ADMIN || role === Role.EMPLOYER ? "Contact Name" : "Full Name"} value={formData.name} onChange={handleChange} required />
                            <InputField name="email" placeholder="Email ID" type="email" value={formData.email} onChange={handleChange} required />
                            <InputField name="contactNumber" placeholder="Contact Number" type="tel" value={formData.contactNumber} onChange={handleChange} required />
                            <InputField name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                            <InputField name="pan" placeholder={role === Role.ADMIN || role === Role.EMPLOYER ? "Company PAN Card" : "PAN Card"} value={formData.pan} onChange={handleChange} required />
                            { (role === Role.SUPERVISOR || role === Role.EMPLOYER || role === Role.EMPLOYEE) && <InputField name="aadhaar" placeholder="Aadhaar Card" value={formData.aadhaar} onChange={handleChange} /> }
                            
                            <PasswordInput value={formData.password} onChange={(val) => setFormData(p => ({...p, password: val}))} id="password-signup" label="Password" />
                            <PasswordInput value={formData.confirmPassword} onChange={(val) => setFormData(p => ({...p, confirmPassword: val}))} id="confirm-password-signup" label="Confirm Password"/>
                            
                            <div className="flex items-center space-x-2 text-xs pt-2">
                                <input type="checkbox" id="agreePolicy" name="agreePolicy" checked={formData.agreePolicy} onChange={handleChange} className="h-4 w-4 rounded bg-dark-input border-border-dark text-accent-orange focus:ring-accent-orange" />
                                <label htmlFor="agreePolicy" className="text-text-secondary-dark">I agree with <a href="#" className="font-bold text-text-primary-dark hover:underline">Private Policy</a></label>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full py-3 px-4 bg-accent-orange text-white font-bold rounded-full hover:bg-accent-orange-hover transition-opacity shadow-md">
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                 <p className="mt-6 text-center text-sm text-text-secondary-dark">
                    Already have an account? <Link to="/login" className="font-bold text-accent-orange hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

const InputField: React.FC<{name: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = ({ name, placeholder, value, onChange, type = 'text', required = false}) => (
    <input
        id={name} name={name} type={type} value={value}
        onChange={onChange} required={required} placeholder={placeholder}
        className="w-full bg-dark-input rounded-lg py-3 px-4 text-text-primary-dark placeholder-text-secondary-dark outline-none focus:ring-2 focus:ring-accent-orange transition-all border border-transparent focus:border-accent-orange"
    />
);


export default SignupScreen;
