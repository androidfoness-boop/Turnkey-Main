
import React, { useState, useMemo } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '../constants';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    id: string;
    label?: string;
}

const PasswordPolicy = {
    minLength: 8,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, id, label = "Password" }) => {
    const [showPassword, setShowPassword] = useState(false);

    const validation = useMemo(() => {
        return {
            minLength: value.length >= PasswordPolicy.minLength,
            uppercase: PasswordPolicy.uppercase.test(value),
            lowercase: PasswordPolicy.lowercase.test(value),
            number: PasswordPolicy.number.test(value),
            specialChar: PasswordPolicy.specialChar.test(value),
        };
    }, [value]);

    const strengthScore = useMemo(() => Object.values(validation).filter(Boolean).length, [validation]);

    const strengthColor = useMemo(() => {
        if (strengthScore <= 2) return 'bg-red-500';
        if (strengthScore <= 4) return 'bg-brand-orange';
        return 'bg-brand-cyan';
    }, [strengthScore]);
    
    return (
        <div className="space-y-2">
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    placeholder={label}
                    className="w-full bg-input-bg rounded-full py-3 px-6 text-text-light placeholder-text-subtle outline-none focus:ring-2 focus:ring-brand-pink transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-sm leading-5 text-text-subtle">
                    {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                </button>
            </div>
            
            {value.length > 0 && (
                 <div className="space-y-1 text-xs text-text-subtle px-4">
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: `${(strengthScore / 5) * 100}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
