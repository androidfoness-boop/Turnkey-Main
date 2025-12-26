
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import PasswordInput from './PasswordInput';

const GradientBackground: React.FC = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <svg width="100%" height="100%" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#fe8c69', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#f75c8e', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#78ffd6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#4A90E2', stopOpacity: 1 }} />
                </linearGradient>
                 <linearGradient id="grad3" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#c451c4', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#f75c8e', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <path d="M-100 -50 C 150 300, 200 -100, 450 150 L 450 -50 Z" fill="url(#grad1)" />
            <path d="M-50 850 C 250 500, 450 900, 400 600 L -50 850 Z" fill="url(#grad2)" />
            <path d="M-50 200 C 100 500, 300 100, 450 450 L 450 812 L -50 812 Z" fill="url(#grad3)" opacity="0.8" />
        </svg>
    </div>
);


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
        });

        if (newUser) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-full flex flex-col text-text-light p-8 relative overflow-hidden">
            <GradientBackground />
            <div className="z-10 w-full flex flex-col justify-start flex-grow">
                 <div className="mb-8 text-left">
                    <Link to="/login" className="text-text-light hover:text-opacity-80">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                </div>
                 <h2 className="text-3xl font-bold text-center">Sign Up</h2>
                 <p className="text-center text-text-subtle mt-2 mb-6 text-sm">
                    {step === 2 ? `Create your ${role} account` : 'First, select your role.'}
                 </p>

                {step === 1 && (
                    <div className="space-y-4">
                        {(Object.values(Role) as Role[]).map(r => (
                            <button key={r} onClick={() => handleRoleSelect(r)}
                                className="w-full text-center p-4 bg-input-bg rounded-full border border-transparent hover:border-brand-pink transition-colors">
                                <span className="font-semibold text-text-light">{r}</span>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && role && (
                     <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
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
                            
                             <div className="flex items-center space-x-2 text-sm pl-2">
                                 <input type="checkbox" id="agreePolicy" name="agreePolicy" checked={formData.agreePolicy} onChange={handleChange} className="h-4 w-4 rounded bg-input-bg border-subtle-text text-brand-pink focus:ring-brand-pink" />
                                <label htmlFor="agreePolicy" className="text-text-subtle">I agree with <a href="#" className="font-bold text-text-light hover:underline">Private Policy</a></label>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="w-full py-3 px-4 bg-input-bg text-text-light font-bold rounded-full hover:bg-white/30 transition-colors">
                                    Back
                                </button>
                                <button type="submit" className="w-full py-3 px-4 bg-brand-pink text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg">
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                 <p className="mt-8 text-center text-sm text-text-subtle">
                    Already have an account? <Link to="/login" className="font-bold text-text-light hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

const InputField: React.FC<{name: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = ({ name, placeholder, value, onChange, type = 'text', required = false}) => (
    <input
        id={name} name={name} type={type} value={value}
        onChange={onChange} required={required} placeholder={placeholder}
        className="w-full bg-input-bg rounded-full py-3 px-6 text-text-light placeholder-text-subtle outline-none focus:ring-2 focus:ring-brand-pink transition-all"
    />
);


export default SignupScreen;
