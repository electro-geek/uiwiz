import { useState, useCallback, useEffect, useRef } from 'react';
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
import type { Version, ChatMessage, ViewMode, DeviceMode } from './types';
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
  const [versions, setVersions] = useState<Version[]>([]);
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
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sessionId: number | null }>({
    isOpen: false,
    sessionId: null
  });
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
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
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

      // Transform versions
      const transformedVersions: Version[] = data.versions.map(v => ({
        id: v.id.toString(),
        code: v.code,
        prompt: v.prompt,
        timestamp: new Date(v.timestamp)
      }));
      setVersions(transformedVersions);

      if (transformedVersions.length > 0) {
        const lastVersion = transformedVersions[transformedVersions.length - 1];
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
      setVersions([]);
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
        setVersions([]);
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
            showToast(error, 'error');
            setIsGenerating(false);
            if (error.toLowerCase().includes('api key')) {
              setIsApiKeyModalOpen(true);
            }
          }
        );
      } catch (error: any) {
        setIsGenerating(false);
        showToast(error.message || 'Error generating code', 'error');
      }
    },
    [currentSession, currentCode]
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
      return <SignupPage onSuccess={() => { setIsAuthenticated(true); window.history.pushState({}, '', '/'); }} />;
    }
    return <LoginPage onSuccess={() => { setIsAuthenticated(true); window.history.pushState({}, '', '/'); }} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        onNewChat={handleNewChat}
        sessions={sessions}
        currentSessionId={currentSession?.id}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onLogout={handleLogout}
        onSettingsClick={() => setIsApiKeyModalOpen(true)}
        user={user}
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
        />

        <div className="split-container">
          <div className="chat-panel">
            <ChatMessages
              messages={messages}
              isGenerating={isGenerating}
              onSuggestionClick={(p) => handleSend(p)}
            />
            <ChatInput onSend={handleSend} disabled={isGenerating} />
          </div>

          <div className="preview-panel">
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
          versionCount={versions.length}
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
        onClose={() => setIsApiKeyModalOpen(false)}
        onSuccess={() => {
          checkHealth()
            .then((res) => setIsConnected(res.gemini_configured))
            .catch(() => setIsConnected(false));
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
