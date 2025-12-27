
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Role } from '../types';
import AdminDashboard from './dashboards/AdminDashboard';
import SupervisorDashboard from './dashboards/SupervisorDashboard';
import EmployerDashboard from './dashboards/EmployerDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import DashboardLayout from './dashboards/DashboardLayout';
import Modal from './common/Modal';
import CreateTicketForm from './dashboards/shared/CreateTicketForm';
import ProfileModal from './ProfileModal';
import CreateUserForm from './dashboards/shared/CreateUserForm';

const Dashboard: React.FC = () => {
    const { currentUser } = useAppContext();
    const [activeView, setActiveView] = useState('overview');
    const [isCreateTicketModalOpen, setCreateTicketModalOpen] = useState(false);
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    const renderDashboard = () => {
        switch (currentUser?.role) {
            case Role.ADMIN:
                return <AdminDashboard activeView={activeView} onOpenCreateUserModal={() => setCreateUserModalOpen(true)} />;
            case Role.SUPERVISOR:
                return <SupervisorDashboard activeView={activeView} />;
            case Role.EMPLOYER:
                return <EmployerDashboard activeView={activeView} />;
            case Role.EMPLOYEE:
                return <EmployeeDashboard activeView={activeView} />;
            default:
                return <div className="text-red-500">Error: User role not found.</div>;
        }
    };

    if (!currentUser) return null;

    return (
        <>
            <DashboardLayout
                activeView={activeView}
                setActiveView={setActiveView}
                onCreateTicket={() => setCreateTicketModalOpen(true)}
                onOpenProfile={() => setProfileModalOpen(true)}
            >
                {renderDashboard()}
            </DashboardLayout>
            <Modal isOpen={isCreateTicketModalOpen} onClose={() => setCreateTicketModalOpen(false)} title="Create New Service Request">
                <CreateTicketForm onFormSubmit={() => setCreateTicketModalOpen(false)} />
            </Modal>
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
             <Modal isOpen={isCreateUserModalOpen} onClose={() => setCreateUserModalOpen(false)} title="Create New User">
                <CreateUserForm onFormSubmit={() => setCreateUserModalOpen(false)} />
            </Modal>
        </>
    );
};

export default Dashboard;
