import { useRef, useEffect } from 'react';
import { User, CheckCircle, Wand2 } from 'lucide-react';
import type { ChatMessage } from '../types';
import type { UserProfile } from '../lib/api';

interface ChatMessagesProps {
    messages: ChatMessage[];
    isGenerating: boolean;
    onSuggestionClick: (prompt: string) => void;
    user: UserProfile | null;
}

export default function ChatMessages({ messages, isGenerating, onSuggestionClick, user }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isGenerating]);

    if (messages.length === 0 && !isGenerating) {
        return (
            <div className="chat-messages" style={{ padding: '0 40px' }}>
                <div className="welcome-screen" style={{ alignItems: 'flex-start', textAlign: 'left', padding: '60px 0' }}>
                    <div className="welcome-icon animate-magic" style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'var(--accent-gradient)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Wand2 size={28} color="#0a0a0a" strokeWidth={2} />
                    </div>
                    <h2 className="welcome-title" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
                        What would you like to <br />build?
                    </h2>
                    <p className="welcome-subtitle" style={{ fontSize: '15px', color: '#666', marginBottom: '40px', maxWidth: '100%' }}>
                        Describe any UI component and I'll generate it instantly with React & Tailwind CSS.
                    </p>

                    <div className="welcome-suggestions" style={{ gap: '12px', maxWidth: '100%' }}>
                        {[
                            {
                                title: 'Modern SaaS Landing',
                                desc: 'Hero section, features, and pricing table.',
                                icon: '🖥️'
                            },
                            {
                                title: 'Analytics Dashboard',
                                desc: 'Sidebar navigation with complex charts.',
                                icon: '📊'
                            },
                            {
                                title: 'AI Chat Interface',
                                desc: 'Sidebar with message history and input.',
                                icon: '⚡'
                            }
                        ].map((s, i) => (
                            <button
                                key={i}
                                className="suggestion-btn"
                                onClick={() => onSuggestionClick(s.title)}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '16px',
                                    background: '#111',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: '#1a1a1a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px'
                                }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'white', marginBottom: '2px' }}>{s.title}</div>
                                    <div style={{ fontSize: '12px', color: '#444' }}>{s.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-messages">
            {messages.map((msg) => (
                <div key={msg.id} className="message">
                    <div className={`message-avatar ${msg.role}`} style={{ overflow: 'hidden' }}>
                        {msg.role === 'user' ? (
                            user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="You"
                                    referrerPolicy="no-referrer"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <User size={16} />
                            )
                        ) : (
                            <Wand2 size={16} color="white" />
                        )}
                    </div>
                    <div className="message-body">
                        <div className="message-role">{msg.role === 'user' ? 'You' : 'UIWiz'}</div>
                        <div className={`message-content ${msg.role}`}>
                            {msg.content}
                        </div>
                        {msg.role === 'assistant' && msg.code && (
                            <div className="message-code-badge">
                                <CheckCircle size={12} />
                                Component generated
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {isGenerating && (
                <div className="message">
                    <div className="message-avatar assistant">
                        <Wand2 size={16} color="white" />
                    </div>
                    <div className="message-body">
                        <div className="message-role">UIWiz</div>
                        <div className="loading-dots">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
