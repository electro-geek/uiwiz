import {
    SandpackProvider,
    SandpackPreview,
    SandpackLayout,
} from '@codesandbox/sandpack-react';
import { motion } from 'framer-motion';
import { Layout, MessageSquare, Code, MousePointer, Layers, Clock, Wand2 } from 'lucide-react';
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
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)', 
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)',
            animation: 'wand-pulse 3s ease-in-out infinite'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3L20 12L6 21V3Z" fill="white" />
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
                            background: 'var(--accent-gradient)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 50px rgba(124, 58, 237, 0.3)',
                        }}
                    >
                        <Wand2 size={40} color="white" />
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
                    <Wand2 size={24} color="#f59e0b" />
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

            {/* Bottom Button Badge */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '99px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#666',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                <Clock size={14} />
                VIEW VERSIONS
            </div>
        </div>
    );
};


export default function PreviewPanel({ code, deviceMode, isGenerating }: PreviewPanelProps) {
    if (!code && !isGenerating) {
        return (
            <div className="preview-content">
                <div className={`preview-frame ${deviceMode}`}>
                    <SplashContent />
                </div>
            </div>
        );
    }

    // Attempt to parse multi-file structure
    let files: Record<string, { code: string; active?: boolean }> = {};

    if (code) {
        let jsonStr = code.trim();

        // Try to locate JSON if it's wrapped in text
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
                // It's a multi-file object
                Object.entries(parsed).forEach(([path, content]) => {
                    files[path] = { code: content as string };
                });

                // Ensure /App.tsx is present and active
                if (files['/App.tsx']) {
                    files['/App.tsx'].active = true;
                } else if (Object.keys(files).length > 0) {
                    // Fallback to the first file if /App.tsx is missing
                    const firstFile = Object.keys(files)[0];
                    files[firstFile].active = true;
                }
            } else {
                throw new Error('Not an object');
            }
        } catch (e) {
            // Fallback to single-file mode (especially during streaming)
            files = {
                '/App.tsx': {
                    code: code || DEFAULT_CODE,
                    active: true,
                },
            };
        }
    } else {
        files = {
            '/App.tsx': {
                code: DEFAULT_CODE,
                active: true,
            }
        };
    }

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
                    files={files}
                    customSetup={{
                        dependencies: {
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
