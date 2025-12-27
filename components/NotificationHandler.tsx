
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

const NotificationHandler: React.FC = () => {
    const { notifications } = useAppContext();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'error':
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            default:
                return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        }
    };
    
    const getBorderColor = (type: string) => {
        switch(type) {
            case 'success': return 'border-green-500';
            case 'error': return 'border-red-500';
            default: return 'border-blue-500';
        }
    }

    return (
        <div className="fixed top-5 inset-x-0 z-50 flex flex-col items-center space-y-3">
            {notifications.map(notification => (
                <div key={notification.id} className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${getBorderColor(notification.type)}`}>
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationHandler;
