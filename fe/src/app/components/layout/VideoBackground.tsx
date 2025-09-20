'use client';

import { useState, useEffect } from 'react';
import BackgroundSelector from './BackgroundSelector';
import { toggleFullscreen, isFullscreen, isFullscreenSupported } from '@/app/components/fullscreen';
import Clock from '@/app/components/Clock';
import Timer from '@/app/components/Timer';
import { BackgroundInfor } from '@/app/models/BackgroundModel';
import { useBackgrounds } from '@/app/hooks/useBackgrounds';

interface VideoBackgroundProps {
    children: React.ReactNode;
    defaultBackground?: string;
}

export default function VideoBackground({ children }: VideoBackgroundProps) {
    // Fetch backgrounds data
    const { backgrounds, loading, error } = useBackgrounds();

    const [currentBackground, setCurrentBackground] = useState('MDS'); // Start with gradient
    const [isFullscreenMode, setIsFullscreenMode] = useState(false);
    const [fullscreenSupported, setFullscreenSupported] = useState(false);
    const [showTimer, setShowTimer] = useState(false);

    // Set default background when backgrounds are loaded
    useEffect(() => {
        if (backgrounds.length > 0 && !backgrounds.find(bg => bg._id === currentBackground || bg.name === currentBackground)) {
            setCurrentBackground(backgrounds[0]._id || backgrounds[0].name);
        }
    }, [backgrounds, currentBackground]);


    // Check fullscreen support and listen for fullscreen changes
    useEffect(() => {
        // Check fullscreen support on client side
        setFullscreenSupported(isFullscreenSupported());

        const handleFullscreenChange = () => {
            setIsFullscreenMode(isFullscreen());
        };

        if (typeof document !== 'undefined') {
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.addEventListener('mozfullscreenchange', handleFullscreenChange);
            document.addEventListener('msfullscreenchange', handleFullscreenChange);

            return () => {
                document.removeEventListener('fullscreenchange', handleFullscreenChange);
                document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
                document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
                document.removeEventListener('msfullscreenchange', handleFullscreenChange);
            };
        }
    }, []);

    const handleFullscreenToggle = async () => {
        await toggleFullscreen();
    };

    const currentBg = backgrounds.find((bg: BackgroundInfor) => bg._id === currentBackground || bg.name === currentBackground);

    // Show loading spinner while fetching backgrounds
    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
                    <p>Đang tải backgrounds...</p>
                </div>
            </div>
        );
    }

    // Show error message if failed to fetch
    if (error) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
                <div className="text-white text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-xl mb-2">Lỗi tải backgrounds</p>
                    <p className="text-sm opacity-75">{error}</p>
                </div>
                {children}
            </div>
        );
    }

    const renderBackground = () => {
        if (!currentBg) {
            return null;
        }

        switch (currentBg.type) {
            case 'video':
                return (
                    <>
                        <video
                            key={currentBg._id || currentBg.name}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="fixed top-0 left-0 w-full h-full object-cover"
                            style={{
                                zIndex: -10,
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                objectFit: 'cover',
                                backgroundColor: 'transparent'
                            }}
                            onLoadStart={() => console.log('Video loading started:', currentBg.src)}
                            onLoadedData={() => console.log('Video data loaded:', currentBg.src)}
                            onCanPlay={() => console.log('Video can play:', currentBg.src)}
                            onPlay={() => console.log('Video started playing:', currentBg.src)}
                            onError={(e) => console.error('Video error:', e, currentBg.src)}
                        >
                            <source src={currentBg.src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {/* Overlay nhẹ chỉ cho video để text dễ đọc */}
                        <div
                            className="fixed top-0 left-0 w-full h-full"
                            style={{
                                zIndex: -8,
                                background: 'rgba(0, 0, 0, 0.1)'
                            }}
                        />
                    </>
                );
            case 'image':
                return (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-center bg-no-repeat bg-cover bg-black"
                        style={{
                            backgroundImage: `url(${currentBg.src})`,
                            zIndex: -10,
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh'
                        }}
                    />
                );
            case 'gradient':
            case 'solid':
                return (
                    <div
                        className={`fixed top-0 left-0 w-full h-full ${currentBg.style}`}
                        style={{
                            zIndex: -10,
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh'
                        }}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <div className="relative min-h-screen" style={{
            background: 'transparent',
            position: 'relative',
            zIndex: 1
        }}>
            {fullscreenSupported && (
                <div className="fixed top-4 right-4 z-50">
                    <button
                        onClick={handleFullscreenToggle}
                        className="bg-white bg-opacity-50 text-black p-3 rounded-full hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm"
                        title={isFullscreenMode ? "Thoát toàn màn hình" : "Chế độ toàn màn hình"}
                    >
                        {isFullscreenMode ? (
                            // Exit fullscreen thumbnail
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="4,14 10,14 10,20" />
                                <polyline points="20,10 14,10 14,4" />
                                <line x1="14" y1="10" x2="21" y2="3" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        ) : (
                            // Enter fullscreen thumbnail
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="15,3 21,3 21,9" />
                                <polyline points="9,21 3,21 3,15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        )}
                    </button>
                </div>
            )}
            {/* Debug info */}
            <div style={{
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                zIndex: 1000,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px',
                fontSize: '12px',
                borderRadius: '5px'
            }}>
                {currentBg?.name || 'None'}<br />
            </div>

            {/* Dynamic Background */}
            {renderBackground()}

            {/* Fallback background chỉ khi không có background nào */}
            {!currentBg && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
                    style={{ zIndex: -20 }}
                ></div>
            )}


            {/* Background Selector */}
            {backgrounds.length > 0 && (
                <div className="fixed flex justify-center justify-items-center top-4 left-4 z-50 gap-3">
                    <BackgroundSelector
                        options={backgrounds}
                        currentBackground={currentBackground}
                        onBackgroundChange={setCurrentBackground}
                    />
                    <button
                        onClick={() => setShowTimer((prev) => !prev)}
                        className=" bg-white bg-opacity-50 text-black  p-3 rounded-full hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm"
                        title={showTimer ? "Ẩn Timer" : "Hiện Timer"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
            )}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
                <Clock />
            </div>
            {showTimer && (
                <Timer draggable onClose={() => setShowTimer(false)} />
            )}


            <div className="relative" style={{ zIndex: 10 }}>
                {children}
            </div>
        </div>
    );
}
