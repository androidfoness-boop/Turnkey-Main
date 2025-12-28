
import React, { useEffect } from 'react';

interface SplashScreenProps {
    onFinish: () => void;
}

const TurnKeyLogo: React.FC = () => (
    <div className="flex items-center justify-center space-x-3">
         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5V13H8v-2h3V9.5c0-1.28.69-2.35 1.7-2.82l.8-.38v2.1l-.4.2c-.3.12-.4.43-.4.7v1.2h2.5l-.5 2H13v3.5h-2z" fill="#FF9500"/>
        </svg>
        <h1 className="text-5xl font-bold text-text-primary-dark tracking-wider">TurnKey</h1>
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
        <div className="flex flex-col items-center justify-center min-h-full auth-bg">
            <div className="z-10 animate-pulse">
                <TurnKeyLogo />
            </div>
        </div>
    );
};

export default SplashScreen;
