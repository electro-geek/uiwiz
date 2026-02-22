import { useState } from 'react';
import { AlertCircle, X, Save, Trash2 } from 'lucide-react';
import type { UserProfile } from '../lib/api';

const GOOGLE_AI_STUDIO_URL = 'https://aistudio.google.com/app/apikey';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  user: UserProfile | null;
  hasExistingKey: boolean;
  saveApiKey: (key: string) => Promise<void | UserProfile>;
  deleteApiKey: () => Promise<void>;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSaved,
  user,
  hasExistingKey,
  saveApiKey,
  deleteApiKey,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    const key = apiKey.trim();
    if (!key) {
      setError('Please enter your Gemini API key.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await saveApiKey(key);
      setSuccess(true);
      setApiKey('');
      setTimeout(() => {
        setSuccess(false);
        onSaved();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setDeleting(true);
    try {
      await deleteApiKey();
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key.');
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 2000,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '440px',
          width: '100%',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ padding: '24px', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertCircle size={22} color="#ef4444" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                API Key Required
              </h3>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.5 }}>
                A valid Gemini API key is required to generate code. You won&apos;t be able to use UIWiz without
                providing it.
              </p>
            </div>
          </div>

          {/* User info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a0a0a',
                fontWeight: 700,
                fontSize: '14px',
                overflow: 'hidden',
              }}
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                (user?.username || '?').slice(0, 2).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{user?.username || 'User'}</div>
              <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '12px' }}>
            To use UIWiz, you need to provide your own Google Gemini API key. Your key is stored securely and used only
            for your requests.
          </p>

          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <a
              href={GOOGLE_AI_STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '13px', color: '#60a5fa', textDecoration: 'underline' }}
            >
              Don&apos;t have a key? Get one for free at Google AI Studio.
            </a>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#ccc', marginBottom: '6px' }}>
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            autoComplete="off"
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#0d0d0d',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              marginBottom: '8px',
            }}
          />

          {success && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '8px',
                marginBottom: '12px',
                fontSize: '13px',
                color: '#10b981',
              }}
            >
              <span style={{ color: '#10b981' }}>✓</span>
              API key saved successfully!
            </div>
          )}

          {error && (
            <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '12px' }}>{error}</p>
          )}
        </div>

        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(255,255,255,0.02)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            {hasExistingKey && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                title="Remove saved API key"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  padding: '8px',
                  display: 'flex',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                background: 'var(--accent-primary)',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Save size={16} />
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
