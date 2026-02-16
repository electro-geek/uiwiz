export interface Version {
    id: string;
    code: string;
    prompt: string;
    timestamp: Date;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    code?: string;
}

export type ViewMode = 'preview' | 'code';
export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
