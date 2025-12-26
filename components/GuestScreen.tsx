
import React from 'react';
import { Link } from 'react-router-dom';

const GuestScreen: React.FC = () => {
    const steps = [
        {
            role: "Employer/Supervisor/Admin",
            action: "Raise a Service Request",
            details: "Fills out a detailed form to create a new ticket for a required job."
        },
        {
            role: "System",
            action: "Assign Ticket",
            details: "The ticket is assigned to available and qualified employees based on the job requirements."
        },
        {
            role: "Employee",
            action: "Accept & Work",
            details: "The assigned employee receives a notification, accepts the ticket, and updates the status as they work."
        },
        {
            role: "Employee",
            action: "Complete & Submit",
            details: "Once the job is done, the employee marks the ticket as 'Solved' or 'Completed'."
        },
        {
            role: "Employer/Supervisor/Admin",
            action: "Verify & Close",
            details: "The ticket creator verifies the work and formally closes the request."
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">TurnKey Process Flow</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">A simplified overview of how service requests are managed.</p>
                </div>
                
                <div className="relative">
                    {/* Vertical line */}
                    <div className="hidden sm:block absolute w-0.5 h-full bg-gray-300 dark:bg-gray-600 top-0 left-1/2 transform -translate-x-1/2"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="sm:flex items-center w-full mb-8">
                            <div className={`sm:w-1/2 ${index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8 sm:text-right'}`}>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                    <div className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mb-1">{step.role}</div>
                                    <h3 className="text-xl font-bold mb-2">{step.action}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{step.details}</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full text-white font-bold text-xl absolute left-1/2 transform -translate-x-1/2 z-10">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/login" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GuestScreen;
