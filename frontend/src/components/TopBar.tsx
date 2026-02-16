import { Eye, Code, Monitor, Tablet, Smartphone, Copy, Check, RefreshCw } from 'lucide-react';
import type { ViewMode, DeviceMode } from '../types';

interface TopBarProps {
    viewMode: ViewMode;
    deviceMode: DeviceMode;
    onViewModeChange: (mode: ViewMode) => void;
    onDeviceModeChange: (mode: DeviceMode) => void;
    onCopy: () => void;
    copied: boolean;
    hasCode: boolean;
}

export default function TopBar({
    viewMode,
    deviceMode,
    onViewModeChange,
    onDeviceModeChange,
    onCopy,
    copied,
    hasCode,
}: TopBarProps) {
    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <div className="top-bar-tabs">
                    <button
                        className={`top-bar-tab ${viewMode === 'preview' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('preview')}
                    >
                        <Eye size={14} />
                        Preview
                    </button>
                    <button
                        className={`top-bar-tab ${viewMode === 'code' ? 'active' : ''}`}
                        onClick={() => onViewModeChange('code')}
                    >
                        <Code size={14} />
                        Code
                    </button>
                </div>
            </div>

            <div className="top-bar-right">
                {viewMode === 'preview' && (
                    <div className="device-toggles">
                        <button
                            className={`device-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
                            onClick={() => onDeviceModeChange('desktop')}
                            title="Desktop"
                        >
                            <Monitor size={15} />
                        </button>
                        <button
                            className={`device-btn ${deviceMode === 'tablet' ? 'active' : ''}`}
                            onClick={() => onDeviceModeChange('tablet')}
                            title="Tablet"
                        >
                            <Tablet size={15} />
                        </button>
                        <button
                            className={`device-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
                            onClick={() => onDeviceModeChange('mobile')}
                            title="Mobile"
                        >
                            <Smartphone size={15} />
                        </button>
                    </div>
                )}

                {hasCode && (
                    <button
                        className={`icon-btn ${copied ? 'success' : ''}`}
                        onClick={onCopy}
                        title="Copy code"
                    >
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                )}
            </div>
        </div>
    );
}
