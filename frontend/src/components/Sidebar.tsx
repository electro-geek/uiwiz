import { Plus, Clock, Sparkles, Zap, MessageSquare, LogOut, Settings } from 'lucide-react';
import type { Version } from '../types';
import type { ChatSession } from '../lib/api';

interface SidebarProps {
    versions: Version[];
    activeVersionId: string | null;
    onSelectVersion: (id: string) => void;
    onNewChat: () => void;
    sessions: ChatSession[];
    currentSessionId?: number;
    onSelectSession: (id: number) => void;
    onLogout: () => void;
    onSettingsClick: () => void;
}

export default function Sidebar({
    versions,
    activeVersionId,
    onSelectVersion,
    onNewChat,
    sessions,
    currentSessionId,
    onSelectSession,
    onLogout,
    onSettingsClick
}: SidebarProps) {
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
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <Sparkles size={20} />
                </div>
                <span className="sidebar-title">Lumina</span>
            </div>

            <button className="sidebar-new-chat" onClick={onNewChat}>
                <Plus size={16} />
                New Generation
            </button>

            <div className="sidebar-versions">
                <div className="sidebar-section-title">
                    <MessageSquare size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    Recent Chats
                </div>
                <div style={{ marginBottom: 16 }}>
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`version-item ${session.id === currentSessionId ? 'active' : ''}`}
                            onClick={() => onSelectSession(session.id)}
                        >
                            <div className="version-item-title">{session.title}</div>
                            <div className="version-item-time">{formatTime(new Date(session.updated_at))}</div>
                        </div>
                    ))}
                </div>

                {versions.length > 0 && (
                    <>
                        <div className="sidebar-section-title">
                            <Clock size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            Version History
                        </div>
                        {versions.map((version) => (
                            <div
                                key={version.id}
                                className={`version-item ${version.id === activeVersionId ? 'active' : ''}`}
                                onClick={() => onSelectVersion(version.id)}
                            >
                                <div className="version-item-title">{version.prompt}</div>
                                <div className="version-item-time">{formatTime(version.timestamp)}</div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="sidebar-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Zap size={14} color="var(--accent-primary)" />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gemini 2.0</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button
                            onClick={onSettingsClick}
                            className="chat-action-btn"
                            style={{ width: 'auto', padding: '4px 8px', fontSize: 11, gap: 4 }}
                        >
                            <Settings size={12} />
                            Settings
                        </button>
                        <button
                            onClick={onLogout}
                            className="chat-action-btn"
                            style={{ width: 'auto', padding: '4px 8px', fontSize: 11, gap: 4 }}
                        >
                            <LogOut size={12} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
