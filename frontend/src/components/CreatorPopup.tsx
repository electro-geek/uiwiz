import React from 'react';
import { Github } from 'lucide-react';

interface CreatorPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatorPopup: React.FC<CreatorPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content creator-popup" style={{ maxWidth: '400px' }}>
                <div className="modal-header" style={{
                    justifyContent: 'center',
                    borderBottom: 'none',
                    paddingTop: '32px',
                    paddingBottom: '0px',
                    display: 'flex'
                }}>
                    <div className="header-title" style={{
                        flexDirection: 'column',
                        gap: '8px',
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <Github className="header-icon" size={24} color="#e0e0e0" />
                        <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800, color: 'white' }}>Meet the Creator</h2>
                    </div>
                </div>

                <div className="modal-body" style={{ textAlign: 'center', padding: '24px 32px' }}>
                    <div className="creator-avatar-glow">
                        <img
                            src="https://github.com/electro-geek.png"
                            alt="electro-geek"
                            className="creator-img"
                        />
                    </div>
                    <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>electro-geek</h3>
                    <p className="description" style={{ marginBottom: '32px', fontSize: '14px', lineHeight: '1.6', color: '#999' }}>
                        I hope you're enjoying UIWiz! Check out my other projects on GitHub.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                        <a
                            href="https://github.com/electro-geek/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="primary-button"
                            onClick={onClose}
                            style={{
                                width: '100%',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px',
                                fontSize: '14px',
                                borderRadius: '8px',
                                background: 'linear-gradient(145deg, #2a2a2a, #fff)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#0a0a0a',
                                fontWeight: 700
                            }}
                        >
                            <Github size={18} />
                            Visit GitHub Profile
                        </a>
                        <button
                            onClick={onClose}
                            className="secondary-button"
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '12px',
                                fontSize: '14px',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                background: 'transparent',
                                color: '#999'
                            }}
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .creator-popup {
                    animation: modalSpin 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.2s ease-out;
                }

                .creator-avatar-glow {
                    width: 90px;
                    height: 90px;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    padding: 3px;
                    background: linear-gradient(145deg, #2a2a2a, #fff);
                    box-shadow: 0 0 24px rgba(255, 255, 255, 0.08);
                }

                .creator-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 3px solid #1a1a1a;
                    object-fit: cover;
                }

                @keyframes modalSpin {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default CreatorPopup;
