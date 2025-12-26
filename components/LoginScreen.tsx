
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { EyeIcon, EyeSlashIcon } from '../constants';

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

const Avatar = () => (
    <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    </div>
);

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(email, password)) {
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            navigate('/');
        }
    };

    const handleForgotPassword = () => {
        alert("A password reset link has been sent to your email address (simulation).");
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center text-text-light p-8 relative overflow-hidden">
            <GradientBackground />
            <div className="z-10 w-full flex flex-col justify-center flex-grow text-center">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-wider">TurnKey</h1>
                </div>
                
                <Avatar />
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-text-subtle text-sm mb-8">Login to your account</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-input-bg rounded-full py-3 px-6 text-text-light placeholder-text-subtle outline-none focus:ring-2 focus:ring-brand-pink transition-all"
                        placeholder="Your Email"
                    />
                    <div className="relative">
                         <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                             className="w-full bg-input-bg rounded-full py-3 px-6 text-text-light placeholder-text-subtle outline-none focus:ring-2 focus:ring-brand-pink transition-all"
                            placeholder="Password"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-sm leading-5 text-text-subtle">
                            {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        </button>
                    </div>
                    
                    <div className="text-right text-sm px-2">
                         <button type="button" onClick={handleForgotPassword} className="font-medium text-text-subtle hover:text-text-light">
                            Forgot password?
                        </button>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 bg-brand-pink text-white font-bold rounded-full hover:opacity-90 transition-opacity shadow-lg">
                        Sign In
                    </button>
                </form>

                 <div className="text-center mt-12 text-sm text-text-subtle">
                    <p>
                        New user? <Link to="/signup" className="font-bold text-text-light hover:underline">Sign Up</Link>
                    </p>
                     <p className="mt-4">
                        Or explore as a <Link to="/guest" className="font-bold text-text-light hover:underline">Guest</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
