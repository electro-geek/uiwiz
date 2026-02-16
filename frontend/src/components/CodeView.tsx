import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewProps {
    code: string | null;
}

export default function CodeView({ code }: CodeViewProps) {
    if (!code) {
        return (
            <div className="code-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="empty-preview">
                    <div className="empty-preview-icon">
                        <span style={{ fontSize: 28 }}>{'</>'}</span>
                    </div>
                    <h3>No code yet</h3>
                    <p>Generate a component to see the code here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="code-view">
            <SyntaxHighlighter
                language="jsx"
                style={oneDark}
                customStyle={{
                    margin: 0,
                    padding: 24,
                    borderRadius: 16,
                    fontSize: 13,
                    lineHeight: 1.7,
                    background: '#14141e',
                    border: '1px solid rgba(255,255,255,0.06)',
                    height: '100%',
                    overflow: 'auto',
                }}
                showLineNumbers
                wrapLines
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
