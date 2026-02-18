import { useState, useMemo, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    FileCode,
    ChevronRight,
    ChevronDown,
    Search,
    Files,
    Folder,
    FolderOpen,
    Globe,
    FileText,
    Settings,
    FileJson,
    X
} from 'lucide-react';

interface CodeViewProps {
    code: string | null;
}

interface FileTreeItem {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileTreeItem[];
}

export default function CodeView({ code }: CodeViewProps) {
    const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'files' | 'search'>('files');
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['public', 'src', 'src/components', 'src/pages', 'src/hooks', 'src/lib']));

    const files = useMemo(() => {
        if (!code) return {};
        try {
            const parsed = JSON.parse(code);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed as Record<string, string>;
            }
        } catch (e) {
            return { '/App.tsx': code || '' };
        }
        return { '/App.tsx': code || '' };
    }, [code]);

    const filePaths = useMemo(() => Object.keys(files), [files]);

    // Build tree structure
    const fileTree = useMemo(() => {
        const tree: FileTreeItem[] = [];

        filePaths.forEach(path => {
            const parts = path.split('/').filter(p => p);
            let currentLevel = tree;
            let currentPath = '';

            parts.forEach((part, index) => {
                currentPath += (currentPath ? '/' : '') + part;
                const isLast = index === parts.length - 1;

                let existing = currentLevel.find(item => item.name === part);

                if (!existing) {
                    existing = {
                        name: part,
                        path: currentPath,
                        type: isLast ? 'file' : 'directory',
                        children: isLast ? undefined : []
                    };
                    currentLevel.push(existing);
                    // Sort: directories first, then alphabetically
                    currentLevel.sort((a, b) => {
                        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                        return a.name.localeCompare(b.name);
                    });
                }

                if (!isLast && existing.children) {
                    currentLevel = existing.children;
                }
            });
        });

        return tree;
    }, [filePaths]);

    useEffect(() => {
        if (!activeFilePath || !filePaths.includes('/' + activeFilePath)) {
            if (filePaths.includes('/App.tsx')) {
                setActiveFilePath('/App.tsx');
            } else if (filePaths.length > 0) {
                setActiveFilePath(filePaths[0]);
            }
        }
    }, [filePaths]);

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };

    const getFileIcon = (name: string, isExpanded?: boolean, isDir?: boolean) => {
        if (isDir) {
            return isExpanded ? <FolderOpen size={14} color="#9ca3af" /> : <Folder size={14} color="#9ca3af" />;
        }
        const lower = name.toLowerCase();
        if (lower.endsWith('.html')) return <Globe size={14} color="#e34c26" />;
        if (lower.endsWith('.css')) return <Globe size={14} color="#264de4" />;
        if (lower.endsWith('.json')) return <FileJson size={14} color="#facc15" />;
        if (lower.endsWith('.md')) return <FileText size={14} color="#3b82f6" />;
        if (lower.includes('config')) return <Settings size={14} color="#6b7280" />;
        return <FileCode size={14} color="#8b5cf6" />;
    };

    const renderTree = (items: FileTreeItem[], depth = 0) => {
        return items.map(item => {
            const fullPath = '/' + item.path;
            const isExpanded = expandedFolders.has(item.path);
            const isSelected = activeFilePath === fullPath;

            // Search filter
            if (searchQuery && item.type === 'file' && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return null;
            }

            return (
                <div key={item.path}>
                    <button
                        onClick={() => item.type === 'directory' ? toggleFolder(item.path) : setActiveFilePath(fullPath)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            paddingLeft: `${12 + depth * 16}px`,
                            border: 'none',
                            background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            color: isSelected ? 'white' : '#9ca3af',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '13px',
                            transition: 'all 0.1s',
                            position: 'relative'
                        }}
                    >
                        {item.type === 'directory' ? (
                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        ) : <div style={{ width: 14 }} />}

                        {getFileIcon(item.name, isExpanded, item.type === 'directory')}

                        <span style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: isSelected ? 600 : 400
                        }}>
                            {item.name}
                        </span>
                    </button>

                    {item.type === 'directory' && isExpanded && item.children && (
                        renderTree(item.children, depth + 1)
                    )}
                </div>
            );
        });
    };

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

    const currentCode = activeFilePath ? files[activeFilePath] : '';

    return (
        <div className="code-view" style={{ display: 'flex', background: '#0a0a0f', height: '100%', overflow: 'hidden' }}>
            {/* Sidebar Explorer */}
            <div style={{
                width: '300px',
                background: '#0d0d12',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Explorer Tabs */}
                <div style={{ display: 'flex', padding: '8px', gap: '4px' }}>
                    <button
                        onClick={() => setActiveTab('files')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeTab === 'files' ? '#1a1a24' : 'transparent',
                            color: activeTab === 'files' ? '#fff' : '#666',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <Files size={16} /> Files
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeTab === 'search' ? '#1a1a24' : 'transparent',
                            color: activeTab === 'search' ? '#fff' : '#666',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <Search size={16} /> Search
                    </button>
                </div>

                {/* Search Inputs */}
                <div style={{ padding: '0 8px 12px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search files"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                background: '#14141d',
                                border: '1px solid #222',
                                borderRadius: '6px',
                                padding: '8px 32px 8px 12px',
                                color: 'white',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#444' }}>
                            {searchQuery ? <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} /> : <Search size={14} />}
                        </div>
                    </div>
                </div>

                {/* File Tree */}
                <div style={{ flex: 1, overflow: 'auto', padding: '0 0 20px' }}>
                    {renderTree(fileTree)}
                </div>
            </div>

            {/* Editor Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {activeFilePath && (
                    <div style={{
                        padding: '8px 16px',
                        background: '#111118',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#666'
                    }}>
                        {activeFilePath.split('/').map((part, i, arr) => (
                            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: i === arr.length - 1 ? '#a78bfa' : '#444' }}>{part || '/'}</span>
                                {i < arr.length - 1 && <ChevronRight size={10} />}
                            </span>
                        ))}
                    </div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <SyntaxHighlighter
                        language="typescript"
                        style={oneDark}
                        customStyle={{
                            margin: 0,
                            padding: 24,
                            fontSize: 13,
                            lineHeight: 1.7,
                            background: '#0a0a0f',
                            height: '100%',
                            overflow: 'auto',
                        }}
                        showLineNumbers
                        wrapLines
                    >
                        {currentCode}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}
