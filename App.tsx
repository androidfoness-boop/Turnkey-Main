
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

const AppContent: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [showIntro, setShowIntro] = useState(false);

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
