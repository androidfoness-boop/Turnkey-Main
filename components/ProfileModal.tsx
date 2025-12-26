
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User } from '../types';
import Modal from './common/Modal';
import PasswordInput from './PasswordInput';

const InputField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = ({ label, name, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-subtle-text">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-secondary-dark border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-blue focus:border-accent-blue sm:text-sm text-light-text"
        />
    </div>
);

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { currentUser, updateUser, addNotification } = useAppContext();
    const [formData, setFormData] = useState({ name: '', contactNumber: '', address: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser && isOpen) {
            setFormData({
                name: currentUser.name,
                contactNumber: currentUser.contactNumber,
                address: currentUser.address,
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            setPhotoPreview(currentUser.profilePhoto || null);
        }
    }, [currentUser, isOpen]);

    if (!currentUser) return null;
    
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const userUpdates: Partial<User> = { ...formData };
        if (photoPreview !== currentUser.profilePhoto) {
            userUpdates.profilePhoto = photoPreview ? photoPreview : undefined;
        }

        const { currentPassword, newPassword, confirmNewPassword } = passwordData;

        if (currentPassword || newPassword || confirmNewPassword) {
            if (currentPassword !== currentUser.password) {
                addNotification('Current password is incorrect.', 'error');
                return;
            }
            if (!newPassword) {
                addNotification('New password cannot be empty.', 'error');
                return;
            }
            if (newPassword !== confirmNewPassword) {
                addNotification('New passwords do not match.', 'error');
                return;
            }

            const validation = {
                minLength: newPassword.length >= 8,
                uppercase: /[A-Z]/.test(newPassword),
                lowercase: /[a-z]/.test(newPassword),
                number: /[0-9]/.test(newPassword),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
            };
            if (Object.values(validation).some(v => !v)) {
                addNotification('New password does not meet all policy requirements.', 'error');
                return;
            }
            userUpdates.password = newPassword;
        }

        const updatedUser: User = { ...currentUser, ...userUpdates };
        updateUser(updatedUser);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit My Profile">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-24 h-24 rounded-full bg-secondary-dark flex items-center justify-center font-bold text-light-text text-3xl mb-2 overflow-hidden border-2 border-gray-600">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span>{currentUser.name.charAt(0)}</span>
                        )}
                    </div>
                     <label htmlFor="photo-upload" className="cursor-pointer text-sm text-accent-blue hover:underline font-semibold">
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    <p className="text-xs text-subtle-text text-center">Upload a clear, passport-style headshot.</p>
                </div>


                {/* Profile Information Section */}
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-light-text border-b border-gray-600 pb-2">Personal Information</h3>
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                    <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                    <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
                </div>
                
                {/* Change Password Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-light-text border-b border-gray-600 pb-2">Change Password</h3>
                    <p className="text-xs text-subtle-text">Leave these fields blank to keep your current password.</p>
                    <InputField label="Current Password" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                    <PasswordInput value={passwordData.newPassword} onChange={(val) => setPasswordData(p => ({...p, newPassword: val}))} id="new-password" label="New Password" />
                    <PasswordInput value={passwordData.confirmNewPassword} onChange={(val) => setPasswordData(p => ({...p, confirmNewPassword: val}))} id="confirm-new-password" label="Confirm New Password" />
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-accent-blue text-white font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProfileModal;