import {
    SandpackProvider,
    SandpackPreview,
    SandpackLayout,
} from '@codesandbox/sandpack-react';
import { motion } from 'framer-motion';
import { Layout, MessageSquare, Code, MousePointer, Layers, Wand2 } from 'lucide-react';
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
      background: '#050505',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'white',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(145deg, #2a2a2a, #fff)', 
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(255,255,255,0.06)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round">
              <path d="M6 18 L18 6" />
              <circle cx="18" cy="6" r="2.5" fill="#0a0a0a" />
            </svg>
          </div>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
          UIWiz
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', fontWeight: 500 }}>
          Your AI-generated component will appear here
        </p>
      </div>
    </div>
  );
}`;

const FloatingIcon = ({ icon: Icon, delay, x, y, size = 20 }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
            x: [x, x + 10, x],
            y: [y, y - 10, y]
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            color: 'white',
            background: 'rgba(255,255,255,0.03)',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            zIndex: 0
        }}
    >
        <Icon size={size} strokeWidth={1.5} />
    </motion.div>
);

const SplashContent = () => {
    return (
        <div className="preview-splash" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Animations */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '500px',
                        height: '500px',
                        border: '1px dashed rgba(255,255,255,0.05)',
                        borderRadius: '50%',
                        marginLeft: '-250px',
                        marginTop: '-250px'
                    }}
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '350px',
                        height: '350px',
                        border: '1px dashed rgba(255,255,255,0.03)',
                        borderRadius: '50%',
                        marginLeft: '-175px',
                        marginTop: '-175px'
                    }}
                />
            </div>

            <FloatingIcon icon={Layout} delay={0} x={-180} y={-120} />
            <FloatingIcon icon={MessageSquare} delay={1} x={150} y={-100} />
            <FloatingIcon icon={Code} delay={2} x={120} y={140} />
            <FloatingIcon icon={MousePointer} delay={0.5} x={-160} y={100} />
            <FloatingIcon icon={Layers} delay={1.5} x={0} y={-180} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    <motion.div
                        className="animate-magic"
                        style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(145deg, #2a2a2a, #fff)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(255,255,255,0.08)',
                        }}
                    >
                        <Wand2 size={40} color="#0a0a0a" strokeWidth={2} />
                    </motion.div>
                </div>

                <h2 style={{
                    fontSize: '42px',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '12px',
                    letterSpacing: '-0.03em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                }}>
                    <Wand2 size={24} color="white" />
                    UIWiz
                </h2>
                <p style={{ fontSize: '18px', color: '#555', fontWeight: 500 }}>
                    Your AI-generated component will appear here
                </p>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '40px' }}>
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }}
                        />
                    ))}
                </div>
            </motion.div>

        </div>
    );
};


// Helper to extract imports from code
const extractDependencies = (files: Record<string, { code: string }>) => {
    const dependencies: Record<string, string> = {
        'lucide-react': 'latest',
        'framer-motion': 'latest',
        'clsx': 'latest',
        'recharts': 'latest',
        'date-fns': 'latest',
        'react-router-dom': 'latest',
        're-resizable': 'latest',
        'react-is': 'latest',
        'prop-types': 'latest',
        'tailwind-merge': 'latest',
        'axios': 'latest',
        'class-variance-authority': 'latest',
        '@radix-ui/react-slot': 'latest',
        '@radix-ui/react-avatar': 'latest',
        '@radix-ui/react-dialog': 'latest',
        '@radix-ui/react-dropdown-menu': 'latest',
        '@radix-ui/react-label': 'latest',
        '@radix-ui/react-separator': 'latest',
        '@radix-ui/react-tooltip': 'latest',
        '@radix-ui/react-switch': 'latest',
        '@radix-ui/react-checkbox': 'latest',
        '@radix-ui/react-tabs': 'latest',
    };

    const importRegex = /import\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"]([^'"]+)['"]/g;

    Object.values(files).forEach(file => {
        let match;
        while ((match = importRegex.exec(file.code)) !== null) {
            const pkg = match[1];
            // Skip relative imports and internal modules
            if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
                // Handle scoped packages (e.g. @radix-ui/react-slot) vs normal (react)
                const parts = pkg.split('/');
                const pkgName = pkg.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];

                if (!dependencies[pkgName]) {
                    dependencies[pkgName] = 'latest';
                }
            }
        }
    });

    return dependencies;
};

export default function PreviewPanel({ code, deviceMode, isGenerating }: PreviewPanelProps) {
    // ... [existing parsing logic remains the same] ...

    if (!code && !isGenerating) {
        return (
            <div className="preview-content">
                <div className={`preview-frame ${deviceMode}`}>
                    <SplashContent />
                </div>
            </div>
        );
    }

    // ... logic for parsing files (lines 214-264 in original) ...
    // Note: I am rewriting the component to include the dependency extraction logic correctly.

    // Re-implement parsing logic here to ensure 'files' is available for extractDependencies
    let filesState: Record<string, { code: string; active?: boolean }> = {};

    if (code) {
        let jsonStr = code.trim();
        if (!jsonStr.startsWith('{')) {
            const firstBrace = jsonStr.indexOf('{');
            const lastBrace = jsonStr.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
            }
        }
        try {
            const parsed = JSON.parse(jsonStr);
            if (typeof parsed === 'object' && parsed !== null) {
                Object.entries(parsed).forEach(([path, content]) => {
                    filesState[path] = { code: content as string };
                });
                if (filesState['/App.tsx']) {
                    filesState['/App.tsx'].active = true;
                } else if (Object.keys(filesState).length > 0) {
                    filesState[Object.keys(filesState)[0]].active = true;
                }
            } else {
                throw new Error('Not an object');
            }
        } catch (e) {
            filesState = { '/App.tsx': { code: code || DEFAULT_CODE, active: true } };
        }
    } else {
        filesState = { '/App.tsx': { code: DEFAULT_CODE, active: true } };
    }

    // Recalculate dependencies with the parsed files
    const calculatedDependencies = extractDependencies(filesState);

    return (
        <div className="preview-content">
            <div className={`preview-frame ${deviceMode}`}>
                {isGenerating && (
                    <div className="generating-overlay">
                        <div className="generating-spinner" />
                        <div className="generating-text">Magically crafting your code...</div>
                    </div>
                )}
                <SandpackProvider
                    template="react-ts"
                    files={filesState}
                    customSetup={{
                        dependencies: calculatedDependencies,
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
