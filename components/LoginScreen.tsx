
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { EyeIcon, EyeSlashIcon } from '../constants';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
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
        <div className="min-h-full flex flex-col items-center justify-center auth-bg p-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-text-primary-dark">Welcome Back</h1>
                    <p className="text-text-secondary-dark mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-dark-input rounded-lg py-3 px-4 text-text-primary-dark placeholder-text-secondary-dark outline-none focus:ring-2 focus:ring-accent-orange transition-all border border-transparent focus:border-accent-orange"
                        placeholder="Email"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-dark-input rounded-lg py-3 px-4 text-text-primary-dark placeholder-text-secondary-dark outline-none focus:ring-2 focus:ring-accent-orange transition-all border border-transparent focus:border-accent-orange"
                            placeholder="Password"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5 text-text-secondary-dark">
                            {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                        </button>
                    </div>
                    
                    <div className="text-right text-sm">
                        <button type="button" onClick={handleForgotPassword} className="font-medium text-text-secondary-dark hover:text-text-primary-dark">
                            Forgot password?
                        </button>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 bg-accent-orange text-white font-bold rounded-full hover:bg-accent-orange-hover transition-opacity shadow-md">
                        Sign In
                    </button>
                </form>

                <div className="text-center mt-8 text-sm text-text-secondary-dark">
                    <p>
                        New user? <Link to="/signup" className="font-bold text-accent-orange hover:underline">Sign Up</Link>
                    </p>
                    <p className="mt-2">
                        Or explore as a <Link to="/guest" className="font-bold text-accent-orange hover:underline">Guest</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
