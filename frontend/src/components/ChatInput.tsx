import { useState, useRef, useCallback } from 'react';
import { Send, ImagePlus, X } from 'lucide-react';

interface ChatInputProps {
    onSend: (prompt: string, image?: string) => void;
    disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [text, setText] = useState('');
    const [imageData, setImageData] = useState<string | null>(null);
    const [imageName, setImageName] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = useCallback(() => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed, imageData || undefined);
        setText('');
        setImageData(null);
        setImageName('');
    }, [text, imageData, disabled, onSend]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            setImageData(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTextareaInput = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    };

    return (
        <div className="chat-input-container">
            <div className="chat-input-wrapper">
                <div className="chat-input-top">
                    <textarea
                        ref={textareaRef}
                        className="chat-textarea"
                        placeholder="Describe a UI component to generate..."
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            handleTextareaInput();
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        rows={1}
                    />
                    <div className="chat-input-actions">
                        <button
                            className="chat-action-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload image"
                            disabled={disabled}
                        >
                            <ImagePlus size={18} />
                        </button>
                        <button
                            className={`chat-send-btn ${text.trim() ? 'has-text' : ''}`}
                            onClick={handleSend}
                            disabled={disabled || !text.trim()}
                            title="Send"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>

                {imageData && (
                    <div className="image-preview-bar">
                        <img src={imageData} alt="Upload" className="image-preview-thumb" />
                        <span className="image-preview-name">{imageName}</span>
                        <button
                            className="image-preview-remove"
                            onClick={() => {
                                setImageData(null);
                                setImageName('');
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
        </div>
    );
}
