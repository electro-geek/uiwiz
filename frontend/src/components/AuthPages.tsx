import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Wand2, Code, Eye } from 'lucide-react';
import { login, register, googleLogin } from '../lib/api';
import { signInWithGoogle } from '../lib/firebase';

interface AuthProps {
    onSuccess: () => void;
}

const FEATURE_TABS = [
    {
        id: 'describe',
        label: 'Describe',
        title: 'Describe in plain English',
        description: 'Tell UIWiz what you want—a landing page, a dashboard, a form—in a sentence. No design tools, no specs. Just your idea.',
        icon: Wand2,
    },
    {
        id: 'generate',
        label: 'Generate',
        title: 'Real React code, instantly',
        description: 'Our AI turns your words into production-ready React & Tailwind components. Edit the code, tweak the prompt, iterate in real time.',
        icon: Code,
    },
    {
        id: 'preview',
        label: 'Preview',
        title: 'See it live, ship it fast',
        description: 'Preview on desktop, tablet, and mobile. Copy the code or keep iterating. From idea to interface in minutes, not days.',
        icon: Eye,
    },
];

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tab = FEATURE_TABS[activeTab];
    const TabIcon = tab.icon;

    return (
        <div className="auth-container">
            <div className="landing-left">
                <div className="landing-logo">
                    <div className="landing-logo-icon animate-magic">
                        <Wand2 size={24} color="#0a0a0a" strokeWidth={2} />
                    </div>
                    <span className="landing-logo-text">UIWiz</span>
                </div>

                <h1 className="landing-headline landing-headline-full-gradient">
                    From idea to interface<br />
                    <span className="landing-headline-gradient">in seconds.</span>
                </h1>

                <p className="landing-description">
                    Describe what you want in plain English. Get real React components, live in your browser—no design tools, no handoff, no wait. Just you and the UI you imagined. Try it free.
                </p>

                <div className="feature-tabs">
                    <div className="feature-tabs-list" role="tablist">
                        {FEATURE_TABS.map((t, i) => (
                            <button
                                key={t.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === i}
                                className={`feature-tab-btn ${activeTab === i ? 'active' : ''}`}
                                onClick={() => setActiveTab(i)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className="feature-tab-panel" role="tabpanel">
                        <div className="feature-card">
                            <div className="feature-card-icon">
                                <TabIcon size={24} color="#e0e0e0" strokeWidth={2} />
                            </div>
                            <div className="feature-card-content">
                                <h4>{tab.title}</h4>
                                <p>{tab.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="peerlist-badge-wrapper">
                    <span className="peerlist-badge-label">Featured on</span>
                    <a
                        href="https://peerlist.io/electrogeek/project/uiwiz"
                        target="_blank"
                        rel="noreferrer"
                        className="peerlist-badge-link"
                    >
                        <img
                            src="https://peerlist.io/api/v1/projects/embed/PRJH9OBOODOARKDBMFG9JR7Q9RGM69?showUpvote=false&theme=dark"
                            alt="UIWiz on Peerlist"
                            className="peerlist-badge-img"
                        />
                    </a>
                </div>
            </div>

            <div className="landing-right">
                {children}
            </div>
        </div>
    );
};

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
            const detail = err.response?.data?.detail;
            const msg = Array.isArray(detail) ? detail[0] : detail;
            if (!err.response) {
                setError('Cannot reach server. Is the backend running at http://localhost:8000?');
            } else {
                setError(msg || 'Invalid credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { idToken } = await signInWithGoogle();
            await googleLogin(idToken);
            onSuccess();
        } catch (err: any) {
            const serverError = err.response?.data?.error;
            if (!err.response) {
                setError('Cannot reach server. Is the backend running at http://localhost:8000?');
            } else {
                setError(serverError || 'Google sign-in failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-welcome-icon animate-magic">
                        <Wand2 size={32} color="#0a0a0a" strokeWidth={2} />
                    </div>
                    <h2 className="welcome-title">Welcome Back</h2>
                    <p className="welcome-subtitle">Enter your credentials to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <User size={18} className="auth-input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>

                    <div className="forgot-password">
                        <a href="#">Forgot password?</a>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-buttons">
                    <button
                        onClick={handleGoogleLogin}
                        className="social-btn"
                        disabled={loading}
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </AuthLayout>
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

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { idToken } = await signInWithGoogle();
            await googleLogin(idToken);
            onSuccess();
        } catch (err: any) {
            const serverError = err.response?.data?.error;
            if (!err.response) {
                setError('Cannot reach server. Is the backend running at http://localhost:8000?');
            } else {
                setError(serverError || 'Google sign-in failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-welcome-icon animate-magic">
                        <Wand2 size={32} color="#0a0a0a" strokeWidth={2} />
                    </div>
                    <h2 className="welcome-title">Join UIWiz</h2>
                    <p className="welcome-subtitle">Start generating beautiful UIs today</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <User size={18} className="auth-input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <Mail size={18} className="auth-input-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
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

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-buttons">
                    <button
                        onClick={handleGoogleLogin}
                        className="social-btn"
                        disabled={loading}
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="auth-footer">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </AuthLayout>
    );
};
