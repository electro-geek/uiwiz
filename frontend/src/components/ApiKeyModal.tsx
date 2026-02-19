import { useState, useEffect } from 'react';
import { X, Key, Shield, AlertCircle, Save, Trash2, CheckCircle } from 'lucide-react';
import { getProfile, updateProfile } from '../lib/api';
import ConfirmModal from './ConfirmModal';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  alertMode?: boolean;
}

export default function ApiKeyModal({ isOpen, onClose, onSuccess, alertMode }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadApiKey();
    }
  }, [isOpen]);

  const loadApiKey = async () => {
    setIsLoading(true);
    try {
      const profileData = await getProfile();
      setProfile(profileData);
      if (profileData.gemini_api_key) {
        setApiKey(profileData.gemini_api_key);
      }
    } catch (err) {
      console.error('Failed to load API key', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setStatus({ message: 'Please enter an API key', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatus({ message: '', type: null });
    try {
      await updateProfile({ gemini_api_key: apiKey });
      setStatus({ message: 'API key saved successfully!', type: 'success' });
      if (onSuccess) onSuccess();
      setTimeout(onClose, 1500);
    } catch (err) {
      setStatus({ message: 'Failed to save API key', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setIsConfirmOpen(false);
    try {
      await updateProfile({ gemini_api_key: null });
      setApiKey('');
      setStatus({ message: 'API key deleted', type: 'success' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus({ message: 'Failed to delete API key', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content api-key-modal" style={{ maxWidth: '440px' }}>
        <div className="modal-header" style={{ position: 'relative', padding: '24px 24px 12px' }}>
          <div className="header-title" style={{ gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: alertMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {alertMode ? <AlertCircle size={20} color="#ef4444" /> : <Key size={20} color="#3b82f6" />}
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', margin: 0 }}>
                {alertMode ? 'API Key Required' : 'Gemini API Configuration'}
              </h2>
              {alertMode && <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>A valid Gemini API key is required to generate code.</p>}
            </div>
          </div>
          <button onClick={onClose} className="close-button" style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {profile && (
            <div className="user-profile-summary">
              <div className="summary-avatar">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username} referrerPolicy="no-referrer" />
                ) : (
                  <div className="summary-initials">{profile.username?.[0].toUpperCase()}</div>
                )}
              </div>
              <div className="summary-info">
                <h3>{profile.username}</h3>
                <span>{profile.email}</span>
              </div>
            </div>
          )}

          <p className="description">
            To use UIWiz, you need to provide your own Google Gemini API key.
            Your key is stored securely and used only for your requests.
          </p>

          <div className="info-box">
            <Shield size={16} />
            <span>Don't have a key? Get one for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.</span>
          </div>

          <div className="input-group">
            <label htmlFor="apiKey">Gemini API Key</label>
            <div className="input-wrapper">
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key here..."
                disabled={isLoading}
              />
            </div>
          </div>

          {status.type && (
            <div className={`status-message ${status.type}`}>
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{status.message}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="delete-button"
            disabled={isLoading || !apiKey}
            title="Delete API key"
          >
            <Trash2 size={18} />
          </button>

          <div className="footer-actions">
            <button onClick={onClose} className="secondary-button" disabled={isLoading}>
              Cancel
            </button>
            <button onClick={handleSave} className="primary-button" disabled={isLoading}>
              {isLoading ? 'Saving...' : (
                <>
                  <Save size={18} />
                  Save Key
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          color: #3b82f6;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #f3f4f6;
        }

        .close-button {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-button:hover {
          color: #f3f4f6;
          background: #333;
        }

        .modal-body {
          padding: 20px;
        }

        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .summary-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--accent-gradient);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .summary-initials {
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .summary-info h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: white;
        }

        .summary-info span {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .description {
          color: #9ca3af;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .info-box {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 20px;
          color: #93c5fd;
          font-size: 0.85rem;
        }

        .info-box a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.85rem;
          color: #d1d5db;
          font-weight: 500;
        }

        .input-wrapper input {
          width: 100%;
          background: #262626;
          border: 1px solid #404040;
          border-radius: 8px;
          padding: 10px 12px;
          color: #fff;
          font-family: monospace;
          font-size: 0.9rem;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .status-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-top: 10px;
        }

        .status-message.success {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }

        .modal-footer {
          padding: 16px 20px;
          background: #262626;
          border-top: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-actions {
          display: flex;
          gap: 12px;
        }

        .primary-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .primary-button:hover {
          background: #2563eb;
        }

        .secondary-button {
          background: transparent;
          color: #d1d5db;
          border: 1px solid #404040;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-button:hover {
          background: #333;
          color: #fff;
        }

        .delete-button {
          background: transparent;
          color: #ef4444;
          border: 1px solid transparent;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-button:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .delete-button:disabled {
          color: #525252;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete API Key"
        message="Are you sure you want to delete your Gemini API key? This will prevent UIWiz from generating new code until a new key is provided."
        confirmLabel="Delete Key"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div >
  );
}
