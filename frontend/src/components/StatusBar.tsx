interface StatusBarProps {
    isGenerating: boolean;
    isConnected: boolean;
    currentCode: string | null;
}

export default function StatusBar({ isGenerating, isConnected, currentCode }: StatusBarProps) {
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
                {currentCode && <span style={{ color: '#333' }}>PREMIUM LICENSE</span>}
            </div>
        </div>
    );
}
