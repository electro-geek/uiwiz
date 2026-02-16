interface StatusBarProps {
    isGenerating: boolean;
    isConnected: boolean;
    versionCount: number;
    currentCode: string | null;
}

export default function StatusBar({ isGenerating, isConnected, versionCount, currentCode }: StatusBarProps) {
    return (
        <div className="status-bar">
            <div className="status-indicator">
                <span className={`status-dot ${isGenerating ? 'loading' : isConnected ? '' : 'error'}`} />
                <span>
                    {isGenerating ? 'Generating...' : isConnected ? 'Connected to Gemini' : 'API Key Required'}
                </span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span>{versionCount} version{versionCount !== 1 ? 's' : ''}</span>
                {currentCode && <span>{currentCode.split('\n').length} lines</span>}
            </div>
        </div>
    );
}
