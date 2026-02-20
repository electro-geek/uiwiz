import { useState, useCallback, useEffect, useRef } from 'react';
import { MessageSquare, Eye } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import PreviewPanel from './components/PreviewPanel';
import CodeView from './components/CodeView';
import StatusBar from './components/StatusBar';
import { LoginPage, SignupPage } from './components/AuthPages';
import ApiKeyModal from './components/ApiKeyModal';
import ConfirmModal from './components/ConfirmModal';
import CreatorPopup from './components/CreatorPopup';
import {
  generateCodeStream,
  checkHealth,
  getSessions,
  createSession,
  getSessionDetail,
  getProfile,
  deleteSession as apiDeleteSession,
  logout as apiLogout
} from './lib/api';
import type { ChatMessage, ViewMode, DeviceMode } from './types';
import type { ChatSession, UserProfile } from './lib/api';

function cleanCodeResponse(text: string): string {
  let cleaned = text.trim();

  // Handle markdown blocks (supports partial streaming)
  const codeBlockRegex = /```(?:json|jsx|javascript|tsx|js|react)?\s*\n?/i;
  const match = cleaned.match(codeBlockRegex);

  if (match) {
    const startIndex = (match.index || 0) + match[0].length;
    cleaned = cleaned.substring(startIndex);

    // Remove closing backticks if they exist
    const closingIndex = cleaned.lastIndexOf('```');
    if (closingIndex !== -1) {
      cleaned = cleaned.substring(0, closingIndex);
    }
  } else {
    // If no markdown block yet, try to find the first import or a JSON object start
    const importIndex = cleaned.indexOf('import ');
    const jsonIndex = cleaned.indexOf('{');

    const firstIndex = [importIndex, jsonIndex].filter(i => i >= 0).sort((a, b) => a - b)[0];

    if (firstIndex !== undefined && firstIndex > 0) {
      cleaned = cleaned.substring(firstIndex);
    }
  }

  // If we ended up with nothing but the input had content, return the input
  // This helps during early streaming
  if (!cleaned && text.trim()) {
    return text.trim();
  }

  return cleaned.trim();
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyAlertMode, setApiKeyAlertMode] = useState(false);
  const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sessionId: number | null }>({
    isOpen: false,
    sessionId: null
  });
  const [isCreatorPopupOpen, setIsCreatorPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'chat' | 'preview'>('chat');
  const codeAccumulatorRef = useRef('');

  // Authentication check on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);

    // Initial health check
    checkHealth()
      .then((res) => {
        setIsConnected(res.gemini_configured);
      })
      .catch(() => setIsConnected(false));
  }, []);

  // Load sessions and profile when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
      loadProfile();

      // Show creator popup once per session if not already shown
      const sessionSeen = sessionStorage.getItem('session_seen_creator');
      if (!sessionSeen) {
        setTimeout(() => setIsCreatorPopupOpen(true), 1200);
        sessionStorage.setItem('session_seen_creator', 'true');
      }
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      setIsConnected(!!profile.gemini_api_key);
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
      if (data.length > 0 && !currentSession) {
        handleSelectSession(data[0].id);
      } else if (data.length === 0) {
        handleNewChat();
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const handleSelectSession = async (id: number) => {
    try {
      const data = await getSessionDetail(id);
      setCurrentSession(data);

      // Update the sessions list with the newly fetched data (to reflect title changes)
      setSessions(prev => prev.map(s => s.id === data.id ? { ...s, title: data.title } : s));

      setViewMode('preview');

      // Transform backend messages to frontend format
      const transformedMessages: ChatMessage[] = data.messages.map(m => ({
        id: m.id.toString(),
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp)
      }));
      setMessages(transformedMessages);

      if (data.versions && data.versions.length > 0) {
        const lastVersion = data.versions[data.versions.length - 1];
        setCurrentCode(lastVersion.code);
      } else {
        setCurrentCode(null);
      }
    } catch (err) {
      showToast('Failed to load session history', 'error');
    }
  };

  const handleNewChat = async () => {
    try {
      const newSess = await createSession();
      setSessions(prev => [newSess, ...prev]);
      setCurrentSession(newSess);
      setMessages([]);
      setCurrentCode(null);
    } catch (err) {
      showToast('Failed to create new session', 'error');
    }
  };

  const handleLogout = () => {
    apiLogout();
    setIsAuthenticated(false);
    setCurrentSession(null);
    setSessions([]);
  };

  const handleDeleteSession = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, sessionId: id });
  };

  const confirmDeleteSession = async () => {
    const id = deleteConfirm.sessionId;
    if (id === null) return;

    try {
      await apiDeleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSession?.id === id) {
        setMessages([]);
        setCurrentCode(null);
        setCurrentSession(null);
      }
      showToast('Chat deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete chat', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, sessionId: null });
    }
  };

  // Toast handling
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleSend = useCallback(
    async (prompt: string, image?: string) => {
      if (!currentSession) return;

      // Check if API key is missing
      if (!user?.gemini_api_key) {
        setApiKeyAlertMode(true);
        setIsApiKeyModalOpen(true);
        return;
      }

      // Add user message locally for instant feedback
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: prompt,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsGenerating(true);
      codeAccumulatorRef.current = '';

      try {
        await generateCodeStream(
          {
            prompt,
            image,
            previousCode: currentCode || undefined,
            stream: true,
            sessionId: currentSession.id
          },
          (chunk) => {
            codeAccumulatorRef.current += chunk;
            const cleaned = cleanCodeResponse(codeAccumulatorRef.current);
            setCurrentCode(cleaned);
          },
          () => {
            // Re-load session to get formal messages and version IDs from backend
            handleSelectSession(currentSession.id);
            setIsGenerating(false);
          },
          (error) => {
            setIsGenerating(false);
            if (error.toLowerCase().includes('limit') || error.includes('429')) {
              setIsRateLimitModalOpen(true);
            } else if (error.toLowerCase().includes('api key') || error.includes('401')) {
              setApiKeyAlertMode(true);
              setIsApiKeyModalOpen(true);
            } else {
              showToast(error, 'error');
            }
          }
        );
      } catch (error: any) {
        setIsGenerating(false);
        showToast(error.message || 'Error generating code', 'error');
      }
    },
    [currentSession, currentCode, user]
  );

  const handleCopy = useCallback(() => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode).then(() => {
      setCopied(true);
      showToast('Code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentCode]);

  // Handle routing
  const path = window.location.pathname;
  if (isAuthenticated === null) return null; // Loading state

  if (!isAuthenticated) {
    if (path === '/signup') {
      return (
        <SignupPage
          onSuccess={() => {
            setIsAuthenticated(true);
            setIsCreatorPopupOpen(true);
            window.history.pushState({}, '', '/');
          }}
        />
      );
    }
    return (
      <LoginPage
        onSuccess={() => {
          setIsAuthenticated(true);
          setIsCreatorPopupOpen(true);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Mobile sidebar overlay backdrop */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        onNewChat={() => {
          handleNewChat();
          setIsSidebarOpen(false);
        }}
        sessions={sessions}
        currentSessionId={currentSession?.id}
        onSelectSession={(id) => {
          handleSelectSession(id);
          setIsSidebarOpen(false);
        }}
        onDeleteSession={handleDeleteSession}
        onLogout={handleLogout}
        onSettingsClick={() => {
          setApiKeyAlertMode(false);
          setIsApiKeyModalOpen(true);
        }}
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <TopBar
          viewMode={viewMode}
          deviceMode={deviceMode}
          onViewModeChange={setViewMode}
          onDeviceModeChange={setDeviceMode}
          onCopy={handleCopy}
          copied={copied}
          hasCode={!!currentCode}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Mobile panel switcher tabs */}
        <div className="mobile-panel-tabs">
          <button
            className={`mobile-panel-tab ${mobilePanel === 'chat' ? 'active' : ''}`}
            onClick={() => setMobilePanel('chat')}
          >
            <MessageSquare size={14} />
            Chat
          </button>
          <button
            className={`mobile-panel-tab ${mobilePanel === 'preview' ? 'active' : ''}`}
            onClick={() => setMobilePanel('preview')}
          >
            <Eye size={14} />
            Preview
          </button>
        </div>

        <div className="split-container">
          <div className={`chat-panel ${mobilePanel === 'chat' ? 'mobile-active' : 'mobile-hidden'}`}>
            <ChatMessages
              messages={messages}
              isGenerating={isGenerating}
              onSuggestionClick={(p) => handleSend(p)}
              user={user}
            />
            <ChatInput onSend={handleSend} disabled={isGenerating} />
          </div>

          <div className={`preview-panel ${mobilePanel === 'preview' ? 'mobile-active' : 'mobile-hidden'}`}>
            {viewMode === 'preview' ? (
              <PreviewPanel
                code={currentCode}
                deviceMode={deviceMode}
                isGenerating={isGenerating}
              />
            ) : (
              <CodeView code={currentCode} />
            )}
          </div>
        </div>

        <StatusBar
          isGenerating={isGenerating}
          isConnected={isConnected}
          currentCode={currentCode}
        />
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        alertMode={apiKeyAlertMode}
        onClose={() => {
          setIsApiKeyModalOpen(false);
          setApiKeyAlertMode(false);
        }}
        onSuccess={() => {
          setApiKeyAlertMode(false);
          checkHealth()
            .then((res) => setIsConnected(res.gemini_configured))
            .catch(() => setIsConnected(false));
          loadProfile(); // Refresh profile to get the new key
        }}
      />

      <ConfirmModal
        isOpen={isRateLimitModalOpen}
        title="Rate Limit Exceeded"
        message="Your Gemini API key has reached its usage limit or the service is overloaded. Please try again in a few minutes or provide a different API key in settings."
        confirmLabel="Close"
        onConfirm={() => setIsRateLimitModalOpen(false)}
        onCancel={() => setIsRateLimitModalOpen(false)}
        isDanger={true}
      />

      <CreatorPopup
        isOpen={isCreatorPopupOpen}
        onClose={() => {
          setIsCreatorPopupOpen(false);
          // Chain to API key modal if they don't have one yet
          if (!user?.gemini_api_key) {
            setTimeout(() => {
              setApiKeyAlertMode(true);
              setIsApiKeyModalOpen(true);
            }, 300);
          }
        }}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={confirmDeleteSession}
        onCancel={() => setDeleteConfirm({ isOpen: false, sessionId: null })}
      />
    </div>
  );
}
