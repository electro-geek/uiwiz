import {
    SandpackProvider,
    SandpackPreview,
    SandpackLayout,
} from '@codesandbox/sandpack-react';
import type { DeviceMode } from '../types';

interface PreviewPanelProps {
    code: string | null;
    deviceMode: DeviceMode;
    isGenerating: boolean;
}

const DEFAULT_CODE = `export default function App() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          ✨ Lumina
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>
          Your AI-generated component will appear here
        </p>
      </div>
    </div>
  );
}`;

export default function PreviewPanel({ code, deviceMode, isGenerating }: PreviewPanelProps) {
    const displayCode = code || DEFAULT_CODE;

    return (
        <div className="preview-content">
            <div className={`preview-frame ${deviceMode}`}>
                {isGenerating && (
                    <div className="generating-overlay">
                        <div className="generating-spinner" />
                        <div className="generating-text">Generating component...</div>
                    </div>
                )}
                <SandpackProvider
                    template="react-ts"
                    files={{
                        '/App.tsx': {
                            code: displayCode,
                            active: true,
                        },
                    }}
                    customSetup={{
                        dependencies: {
                            'lucide-react': 'latest',
                            'framer-motion': 'latest',
                            'clsx': 'latest',
                            'recharts': 'latest',
                            'date-fns': 'latest',
                            're-resizable': 'latest',
                            'react-is': 'latest',
                            'prop-types': 'latest',
                            'tailwind-merge': 'latest',
                            'axios': 'latest',
                        },
                    }}
                    options={{
                        externalResources: [
                            'https://cdn.tailwindcss.com',
                            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
                        ],
                        classes: {
                            'sp-wrapper': 'sp-wrapper-custom',
                            'sp-layout': 'sp-layout-custom',
                        },
                    }}
                    theme="dark"
                >
                    <SandpackLayout>
                        <SandpackPreview
                            showOpenInCodeSandbox={false}
                            showRefreshButton={true}
                            style={{ height: '100%' }}
                        />
                    </SandpackLayout>
                </SandpackProvider>
            </div>
        </div>
    );
}
