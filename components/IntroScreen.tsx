
import React, { useState } from 'react';

interface IntroScreenProps {
    onFinish: () => void;
}

const introSlides = [
    {
        title: "Welcome to TurnKey",
        description: "The all-in-one solution for managing service requests, teams, and operations efficiently.",
        image: "https://picsum.photos/seed/intro1/400/300"
    },
    {
        title: "Role-Based Dashboards",
        description: "Customized views for Admins, Supervisors, Employers, and Employees to streamline workflows.",
        image: "https://picsum.photos/seed/intro2/400/300"
    },
    {
        title: "Effortless Ticket Management",
        description: "Create, assign, and track service requests with just a few clicks. Stay updated in real-time.",
        image: "https://picsum.photos/seed/intro3/400/300"
    },
    {
        title: "Powerful Analytics",
        description: "Gain insights into your operations with visual dashboards and comprehensive data reports.",
        image: "https://picsum.photos/seed/intro4/400/300"
    },
    {
        title: "Ready to Get Started?",
        description: "Let's simplify your service management and boost productivity together.",
        image: "https://picsum.photos/seed/intro5/400/300"
    }
];

const IntroScreen: React.FC<IntroScreenProps> = ({ onFinish }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < introSlides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onFinish();
        }
    };

    const slide = introSlides[currentSlide];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800 p-4 text-center">
            <div className="max-w-md w-full">
                <img src={slide.image} alt={slide.title} className="rounded-lg shadow-xl mx-auto mb-8 w-full h-64 object-cover" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{slide.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">{slide.description}</p>
                
                <div className="flex justify-center space-x-2 mb-8">
                    {introSlides.map((_, index) => (
                        <div key={index} className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    ))}
                </div>

                {currentSlide === introSlides.length - 1 ? (
                    <button
                        onClick={onFinish}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                    >
                        Proceed
                    </button>
                ) : (
                     <button
                        onClick={handleNext}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default IntroScreen;
