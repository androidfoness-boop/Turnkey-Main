import React, { useEffect } from 'react';

// FIX: Define SplashScreenProps interface for the component's props.
interface SplashScreenProps {
    onFinish: () => void;
}

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


const CoooLogo = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-6xl font-bold text-text-light tracking-widest">TurnKey</h1>
    </div>
);

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="flex flex-col items-center justify-center min-h-full relative text-text-light">
            <GradientBackground />
            <div className="z-10 animate-pulse">
                <CoooLogo />
            </div>
        </div>
    );
};

export default SplashScreen;