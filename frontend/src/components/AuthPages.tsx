import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { login, register } from '../lib/api';

interface AuthProps {
    onSuccess: () => void;
}

export const LoginPage: React.FC<AuthProps> = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(username, password);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="welcome-icon">
                        <Sparkles size={32} color="white" />
                    </div>
                    <h2 className="welcome-title">Welcome Back</h2>
                    <p className="welcome-subtitle">Sign in to continue building with Lumina</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label>Username</label>
                        <div className="auth-input-wrapper">
                            <User size={18} className="auth-input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export const SignupPage: React.FC<AuthProps> = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register({ username, email, password });
            await login(username, password);
            onSuccess();
        } catch (err: any) {
            setError(Object.values(err.response?.data || {}).join(' ') || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="welcome-icon">
                        <Sparkles size={32} color="white" />
                    </div>
                    <h2 className="welcome-title">Join Lumina</h2>
                    <p className="welcome-subtitle">Start generating beautiful UIs today</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label>Username</label>
                        <div className="auth-input-wrapper">
                            <User size={18} className="auth-input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Email</label>
                        <div className="auth-input-wrapper">
                            <Mail size={18} className="auth-input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
};
