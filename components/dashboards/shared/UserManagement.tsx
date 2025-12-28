
import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { User, Role } from '../../../types';
import Modal from '../../common/Modal';
import { ExportIcon, ImportIcon, DownloadIcon } from '../../../constants';

interface UserManagementProps {
    title?: string;
    specificRoles?: Role[];
}

const UserManagement: React.FC<UserManagementProps> = ({ title = "User Management", specificRoles }) => {
    const { users, currentUser, updateUser, deleteUser, addNotification, signup } = useAppContext();
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const managedUsers = useMemo(() => {
        let filteredUsers = users;
        if (currentUser?.role === Role.SUPERVISOR || currentUser?.role === Role.EMPLOYER) {
            filteredUsers = users.filter(u => u.organizationId === currentUser.organizationId);
        }
        if (specificRoles) {
            filteredUsers = filteredUsers.filter(u => specificRoles.includes(u.role));
        }
        return filteredUsers;
    }, [users, currentUser, specificRoles]);

    const handleAvailabilityToggle = (user: User) => {
        if (user.role === Role.EMPLOYEE) {
            updateUser({ ...user, isAvailable: !user.isAvailable });
        }
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            if (userToDelete.id === currentUser?.id) {
                addNotification("You cannot delete yourself.", "error");
                setUserToDelete(null);
                return;
            }
            deleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const handleDownloadSampleCSV = () => {
        const headers = ["Full Name", "Email ID", "Contact Number", "Address", "PAN Card", "Aadhaar Card", "Role"];
        const sampleRow = ["Jane Doe", "jane.doe@example.com", "9876543210", "456 Oak Ave, Townsville", "FGHIJ5678K", "987654321098", "Employee"];
        const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sample_user_import.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addNotification("Sample CSV downloaded.", "success");
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                addNotification("Could not read file.", "error");
                return;
            }
            
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const headers = rows.shift()?.split(',').map(h => h.trim()) || [];
            
            // Basic header validation
            const requiredHeaders = ["Full Name", "Email ID", "Role"];
            if (!requiredHeaders.every(h => headers.includes(h))) {
                addNotification(`CSV must contain the following headers: ${requiredHeaders.join(', ')}`, "error");
                return;
            }

            let successCount = 0;
            let errorCount = 0;

            const promises = rows.map(async (row) => {
                const values = row.split(',');
                const data = headers.reduce((obj, header, index) => {
                    obj[header] = values[index]?.trim();
                    return obj;
                }, {} as {[key: string]: string});

                const role = Object.values(Role).find(r => r.toLowerCase() === data['Role']?.toLowerCase());

                if (!data['Email ID'] || !role) {
                    errorCount++;
                    return;
                }

                try {
                    await signup({
                        email: data['Email ID'],
                        password: 'Qwerty@123', // Default password
                        role,
                        name: data['Full Name'] || 'N/A',
                        contactNumber: data['Contact Number'] || '',
                        address: data['Address'] || '',
                        pan: data['PAN Card'] || '',
                        aadhaar: data['Aadhaar Card'] || undefined,
                        organizationId: currentUser?.organizationId,
                        isAvailable: role === Role.EMPLOYEE ? true : undefined,
                    });
                    successCount++;
                } catch {
                    errorCount++;
                }
            });

            await Promise.all(promises);

            if (successCount > 0) addNotification(`${successCount} users imported successfully.`, "success");
            if (errorCount > 0) addNotification(`${errorCount} user imports failed (e.g., duplicate email or invalid data).`, "error");
        };

        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };
    
    const handleExportCSV = () => {
        if (managedUsers.length === 0) {
            addNotification("No user data to export.", "info");
            return;
        }

        const headers = ["ID", "Name", "Email", "Role", "Contact Number", "Address", "Organization ID", "Availability"];
        const csvRows = [headers.join(',')];

        managedUsers.forEach(user => {
            const row = [
                user.id,
                `"${user.name.replace(/"/g, '""')}"`,
                user.email,
                user.role,
                user.contactNumber,
                `"${user.address.replace(/"/g, '""')}"`,
                user.organizationId || 'N/A',
                user.role === Role.EMPLOYEE ? (user.isAvailable ? "Available" : "Unavailable") : 'N/A'
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "turnkey_users.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addNotification("User data exported successfully.", "success");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                 <div className="flex items-center space-x-2">
                    <button onClick={handleDownloadSampleCSV} className="flex items-center space-x-2 px-3 py-2 bg-secondary-dark text-subtle-text font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors text-sm">
                        <DownloadIcon />
                        <span>Sample</span>
                    </button>
                    <button onClick={handleImportClick} className="flex items-center space-x-2 px-3 py-2 bg-accent-blue text-white font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition-colors text-sm">
                        <ImportIcon />
                        <span>Import</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".csv" className="hidden" />
                    <button onClick={handleExportCSV} className="flex items-center space-x-2 px-3 py-2 bg-accent-green text-primary-dark font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition-colors text-sm">
                        <ExportIcon />
                        <span>Export</span>
                    </button>
                </div>
            </div>
            <div className="bg-secondary-dark p-4 rounded-lg shadow-md">
                <div className="space-y-4">
                     {managedUsers.map(user => (
                        <div key={user.id} className="bg-primary-dark p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary-dark text-lg overflow-hidden ${!user.profilePhoto ? (user.isAvailable ? 'bg-accent-green' : 'bg-yellow-500') : ''}`}>
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{user.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-light-text">{user.name}</p>
                                    <p className="text-xs text-subtle-text">{user.role} - {user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {user.role === Role.EMPLOYEE && (
                                    <label htmlFor={`avail-${user.id}`} className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" id={`avail-${user.id}`} className="sr-only" checked={user.isAvailable} onChange={() => handleAvailabilityToggle(user)} />
                                            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${user.isAvailable ? 'transform translate-x-full bg-accent-green' : ''}`}></div>
                                        </div>
                                    </label>
                                )}
                                 <button onClick={() => setUserToDelete(user)} className="text-red-500 hover:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Confirm Deletion">
                    <p className="text-light-text">Are you sure you want to delete the user: <strong className="font-semibold">{userToDelete?.name}</strong>?</p>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => setUserToDelete(null)} className="px-4 py-2 bg-secondary-dark text-light-text rounded-md hover:bg-opacity-80">Cancel</button>
                        <button onClick={confirmDeleteUser} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default UserManagement;