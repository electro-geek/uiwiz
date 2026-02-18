interface StatusBarProps {
    isGenerating: boolean;
    isConnected: boolean;
    versionCount: number;
    currentCode: string | null;
}

export default function StatusBar({ isGenerating, isConnected, versionCount, currentCode }: StatusBarProps) {
    return (
        <div className="status-bar">
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <div className="status-indicator">
                    <span className={`status-dot ${isGenerating ? 'loading' : isConnected ? '' : 'error'}`} />
                    <span style={{ color: isGenerating ? 'var(--text-secondary)' : isConnected ? '#555' : 'var(--error)' }}>
                        {isGenerating ? 'Generating...' : isConnected ? 'Connected to Gemini' : 'API Key Required'}
                    </span>
                </div>
                {isConnected && !isGenerating && (
                    <span style={{ color: '#333' }}>Memory: 2.4 GB / 8 GB</span>
                )}
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ color: '#333' }}>{versionCount} version{versionCount !== 1 ? 's' : ''}</span>
                {currentCode && <span style={{ color: '#333' }}>PREMIUM LICENSE</span>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#111', padding: '2px 8px', borderRadius: '4px', color: '#555' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#555' }} />
                    V2.4.0
                </div>
            </div>
        </div>
    );
}
