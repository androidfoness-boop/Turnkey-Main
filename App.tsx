
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import IntroScreen from './components/IntroScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import Dashboard from './components/Dashboard';
import GuestScreen from './components/GuestScreen';
import NotificationHandler from './components/NotificationHandler';

const App: React.FC = () => {
    return (
        <AppProvider>
            <NotificationHandler />
            <AppContent />
        </AppProvider>
    );
};

const LoadingIndicator: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-full bg-primary-dark text-light-text">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4">Loading...</p>
    </div>
);


const AppContent: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [showIntro, setShowIntro] = useState(false);
    const { isLoading } = useAppContext();

    const handleSplashFinish = () => {
        setShowSplash(false);
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) {
            setShowIntro(true);
        }
    };

    const handleIntroFinish = () => {
        setShowIntro(false);
        localStorage.setItem('hasSeenIntro', 'true');
    };

    if (showSplash) {
        return <SplashScreen onFinish={handleSplashFinish} />;
    }

    if (showIntro) {
        return <IntroScreen onFinish={handleIntroFinish} />;
    }

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <HashRouter>
            <MainRouter />
        </HashRouter>
    );
};

const MainRouter: React.FC = () => {
    const { currentUser } = useAppContext();

    return (
        <Routes>
            <Route path="/login" element={!currentUser ? <LoginScreen /> : <Navigate to="/" />} />
            <Route path="/signup" element={!currentUser ? <SignupScreen /> : <Navigate to="/" />} />
            <Route path="/guest" element={<GuestScreen />} />
            <Route path="/" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;
