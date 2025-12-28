
import React, { useState } from 'react';

interface IntroScreenProps {
    onFinish: () => void;
}

const introPages = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: 'Create Service Requests',
        description: 'Easily draft and submit detailed service requests for any job, ensuring all requirements are clearly communicated.'
    },
    {
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: 'Track Real-Time Progress',
        description: 'Monitor the status of your requests in real-time, from pending and in-progress to completion.'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        title: 'Manage Your Team',
        description: 'Assign tasks to available employees, manage staff roles, and ensure the right person is on the job.'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Ensure Quality Maintenance',
        description: 'Streamline your maintenance workflow to verify completed tasks and maintain high standards of service.'
    },
    {
        icon: (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        title: 'Gain Actionable Insights',
        description: 'Use the dashboard analytics to understand your operations and make data-driven decisions. Let\'s get started!'
    },
];

const IntroScreen: React.FC<IntroScreenProps> = ({ onFinish }) => {
    const [currentPage, setCurrentPage] = useState(0);
    
    const isLastPage = currentPage === introPages.length - 1;

    const goToNext = () => {
        if (!isLastPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="flex flex-col min-h-screen auth-bg p-6 text-text-primary-dark text-center relative overflow-hidden">
            
            {/* Top Navigation */}
            <div className="flex justify-between items-center h-10">
                 {currentPage > 0 && (
                    <button onClick={goToPrev} className="text-text-secondary-dark hover:text-text-primary-dark">Back</button>
                )}
                {!isLastPage && (
                    <button onClick={onFinish} className="ml-auto text-text-secondary-dark hover:text-text-primary-dark">Skip</button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <div className="mb-8">
                    {introPages[currentPage].icon}
                </div>
                <h2 className="text-3xl font-bold leading-tight mb-4">{introPages[currentPage].title}</h2>
                <p className="text-text-secondary-dark max-w-xs">
                    {introPages[currentPage].description}
                </p>
            </div>
            
            {/* Bottom Controls */}
            <div className="h-24 flex flex-col justify-end">
                 <div className="flex justify-center items-center gap-2 mb-6">
                    {introPages.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${currentPage === index ? 'w-6 bg-accent-orange' : 'w-2 bg-border-dark'}`}
                        />
                    ))}
                </div>

                {isLastPage ? (
                    <button
                        onClick={onFinish}
                        className="w-full bg-accent-orange text-white font-bold py-4 px-4 rounded-full shadow-lg hover:bg-accent-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange transition-all"
                    >
                        Proceed
                    </button>
                ) : (
                    <button
                        onClick={goToNext}
                        className="w-full bg-dark-card text-text-primary-dark font-bold py-4 px-4 rounded-full shadow-lg hover:bg-border-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-card transition-all"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default IntroScreen;
    