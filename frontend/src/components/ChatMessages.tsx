import { useRef, useEffect } from 'react';
import { Sparkles, User, CheckCircle } from 'lucide-react';
import type { ChatMessage } from '../types';

interface ChatMessagesProps {
    messages: ChatMessage[];
    isGenerating: boolean;
    onSuggestionClick: (prompt: string) => void;
}

const SUGGESTIONS = [
    '🎨 A modern pricing page with 3 tiers and a toggle for monthly/yearly billing',
    '📊 A dashboard with charts, stats cards, and a sidebar navigation',
    '🔐 A beautiful login form with social auth buttons and animations',
    '🛒 An e-commerce product card grid with filters and cart button',
];

export default function ChatMessages({ messages, isGenerating, onSuggestionClick }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isGenerating]);

    if (messages.length === 0 && !isGenerating) {
        return (
            <div className="chat-messages">
                <div className="welcome-screen">
                    <div className="welcome-icon">
                        <Sparkles size={32} color="white" />
                    </div>
                    <h2 className="welcome-title">What would you like to build?</h2>
                    <p className="welcome-subtitle">
                        Describe any UI component and I'll generate it instantly with React & Tailwind CSS.
                    </p>
                    <div className="welcome-suggestions">
                        {SUGGESTIONS.map((suggestion, i) => (
                            <button
                                key={i}
                                className="suggestion-btn"
                                onClick={() => onSuggestionClick(suggestion)}
                            >
                                {suggestion}
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
                    <div className={`message-avatar ${msg.role}`}>
                        {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div className="message-body">
                        <div className="message-role">{msg.role === 'user' ? 'You' : 'Lumina'}</div>
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
                        <Sparkles size={16} />
                    </div>
                    <div className="message-body">
                        <div className="message-role">Lumina</div>
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
