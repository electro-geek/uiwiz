import { Plus, MessageSquare, Wand2, LogOut, Trash2, X, Key } from 'lucide-react';
import type { ChatSession, UserProfile } from '../lib/api';

interface SidebarProps {
    onNewChat: () => void;
    sessions: ChatSession[];
    currentSessionId?: number;
    onSelectSession: (id: number) => void;
    onDeleteSession: (id: number, e: React.MouseEvent) => void;
    onLogout: () => void;
    user: UserProfile | null;
    isOpen?: boolean;
    onClose?: () => void;
    onOpenApiKeySettings?: () => void;
}

export default function Sidebar({
    onNewChat,
    sessions,
    currentSessionId,
    onSelectSession,
    onDeleteSession,
    onLogout,
    user,
    isOpen,
    onClose,
    onOpenApiKeySettings
}: SidebarProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header" style={{ borderBottom: 'none' }}>
                <div className="sidebar-logo animate-magic" style={{
                    borderRadius: '10px',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                }}>
                    <Wand2 size={18} color="#0a0a0a" strokeWidth={2} />
                </div>
                <span className="sidebar-title" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'white', flex: 1 }}>UIWiz</span>
                {onClose && (
                    <button
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <button className="sidebar-new-chat" onClick={onNewChat} style={{ margin: '0 16px 16px' }}>
                <Plus size={16} strokeWidth={3} />
                New Chat
            </button>

            <div className="sidebar-versions">
                <div className="sidebar-section-title" style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>
                    RECENT CHATS
                </div>
                <div style={{ marginBottom: 24 }}>
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`version-item ${session.id === currentSessionId ? 'active' : ''}`}
                            onClick={() => onSelectSession(session.id)}
                            style={{ padding: '12px', marginBottom: '4px' }}
                        >
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', position: 'relative' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: session.id === currentSessionId ? 'var(--accent-secondary)' : '#1a1a1a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <MessageSquare size={14} color={session.id === currentSessionId ? 'white' : '#666'} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="version-item-title" style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>{session.title}</div>
                                    <div className="version-item-time" style={{ fontSize: '11px', color: '#444' }}>{formatTime(new Date(session.updated_at))}</div>
                                </div>
                                <button
                                    className="delete-session-btn"
                                    onClick={(e) => onDeleteSession(session.id, e)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#444',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        opacity: session.id === currentSessionId ? 1 : 0,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Peerlist Launchpad Badge */}
            <div style={{ padding: '0 16px 12px' }}>
                <a
                    href="https://peerlist.io/electrogeek/project/uiwiz"
                    target="_blank"
                    rel="noreferrer"
                    className="sidebar-peerlist-badge"
                >
                    <div className="sidebar-peerlist-icon">
                        <Wand2 size={16} strokeWidth={2} color="#c8c8c8" />
                    </div>
                    <div className="sidebar-peerlist-text">
                        <span className="sidebar-peerlist-live">Live on</span>
                        <span className="sidebar-peerlist-name">Peerlist</span>
                        <span className="sidebar-peerlist-divider">|</span>
                        <span className="sidebar-peerlist-launchpad">Launchpad</span>
                    </div>
                </a>
            </div>

            <div className="sidebar-footer" style={{
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '12px',
                        overflow: 'hidden'
                    }}>
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.username || 'User'}
                                referrerPolicy="no-referrer"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            user?.username ? getInitials(user.username) : '??'
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.username || 'Guest'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#555' }}>Pro Plan</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {onOpenApiKeySettings && (
                            <button
                                onClick={onOpenApiKeySettings}
                                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                                title="API key settings"
                            >
                                <Key size={16} color="#444" className="hover-white" />
                            </button>
                        )}
                        <button
                            onClick={onLogout}
                            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                            title="Logout"
                        >
                            <LogOut size={16} color="#444" className="hover-white" />
                        </button>
                    </div>
                </div>
            </div>
        </aside >
    );
}
