// components/Timer.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TimerProps {
    initialTimes?: { pomodoro: number; shortBreak: number; longBreak: number };
    draggable?: boolean;
    onClose?: () => void;
}

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const DEFAULT_TIMES = { pomodoro: 25, shortBreak: 5, longBreak: 15 };

const Timer: React.FC<TimerProps> = ({ initialTimes = DEFAULT_TIMES, draggable = false, onClose }) => {
    const [mode, setMode] = useState<Mode>('pomodoro');
    const [secondsLeft, setSecondsLeft] = useState(initialTimes.pomodoro * 60);
    const [isActive, setIsActive] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [editTimes, setEditTimes] = useState({ ...initialTimes });

    // Drag state - khởi tạo với giá trị mặc định để tránh hydration error
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const timerRef = useRef<HTMLDivElement>(null);

    // Khởi tạo position sau khi component mount
    useEffect(() => {
        setMounted(true);
        if (draggable && typeof window !== 'undefined') {
            setPosition({
                x: window.innerWidth - 900,
                y: window.innerHeight / 2 - 300
            });
        }
    }, [draggable]);

    useEffect(() => {
        setSecondsLeft(initialTimes[mode] * 60);
        setIsActive(false);
    }, [mode, initialTimes]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setIsActive(false);
            if (mode === 'pomodoro') {
                alert('Hết giờ Pomodoro! Bắt đầu nghỉ ngắn.');
                setMode('shortBreak');
            } else {
                alert('Hết giờ nghỉ!');
                setMode('pomodoro');
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, secondsLeft, mode]);

    // Drag logic
    useEffect(() => {
        if (!draggable || !mounted) return;
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        };
        const handleMouseUp = () => setDragging(false);

        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, draggable, mounted]);

    useEffect(() => {
        if (!draggable || !mounted) return;
        const handleResize = () => {
            setPosition(pos => ({
                x: Math.min(Math.max(0, pos.x), window.innerWidth - 360),
                y: Math.min(Math.max(0, pos.y), window.innerHeight - 220),
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [draggable, mounted]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const restartTimer = useCallback(() => {
        setIsActive(false);
        setSecondsLeft(initialTimes[mode] * 60);
    }, [initialTimes, mode]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSaveSettings = () => {
        setShowSettings(false);
        setIsActive(false);
        setSecondsLeft(editTimes[mode] * 60);
    };

    const handleChangeTime = (key: keyof typeof editTimes, value: number) => {
        setEditTimes(prev => ({
            ...prev,
            [key]: Math.max(1, value)
        }));
    };

    useEffect(() => {
        if (!showSettings) {
            setSecondsLeft(editTimes[mode] * 60);
        }
        // eslint-disable-next-line
    }, [showSettings]);

    const modeButtons = [
        { mode: 'pomodoro', label: 'Pomodoro' },
        { mode: 'shortBreak', label: 'Nghỉ Ngắn' },
        { mode: 'longBreak', label: 'Nghỉ Dài' },
    ];


    // Không render cho đến khi mounted để tránh hydration error
    if (!mounted) {
        return null;
    }

    return (
        <div
            ref={timerRef}
            className={`p-8 rounded-lg shadow-xl text-white transition-colors duration-500 ${draggable ? 'cursor-move select-none' : ''}`}
            style={
                draggable && mounted
                    ? {
                        position: 'fixed',
                        left: position.x,
                        top: position.y,
                        zIndex: 9999,
                        minWidth: 320,
                        maxWidth: 390,
                        userSelect: dragging ? 'none' : undefined,
                        opacity: dragging ? 0.95 : 1,
                    }
                    : {}
            }
            onMouseDown={draggable && mounted ? (e) => {
                if (e.button !== 0) return;
                setDragging(true);
                const rect = timerRef.current?.getBoundingClientRect();
                dragOffset.current = {
                    x: e.clientX - (rect?.left ?? 0),
                    y: e.clientY - (rect?.top ?? 0),
                };
            } : undefined}
        >
            {/* Close button */}
            {draggable && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 border-2 bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-100 transition"
                    style={{ zIndex: 10000 }}
                    tabIndex={-1}
                >
                    x
                </button>
            )}
            {/* Setting button */}
            <button
                onClick={() => setShowSettings(s => !s)}
                className="absolute top-2 left-2 border-2 bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-100 transition"
                style={{ zIndex: 10000 }}
                tabIndex={-1}
                title="Cài đặt thời gian"
            >
                ⚙️
            </button>
            {showSettings ? (
                <div className="bg-white p-6 rounded-lg shadow-inner max-w-xs mx-auto my-4 text-gray-800">
                    <h2 className="text-xl font-semibold mb-4 text-center">Cài Đặt Thời Gian (phút)</h2>
                    <div className="flex flex-col space-y-4">
                        <label>
                            Pomodoro:
                            <input
                                type="number"
                                min={1}
                                value={editTimes.pomodoro}
                                onChange={e => handleChangeTime('pomodoro', parseInt(e.target.value) || 1)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </label>
                        <label>
                            Nghỉ Ngắn:
                            <input
                                type="number"
                                min={1}
                                value={editTimes.shortBreak}
                                onChange={e => handleChangeTime('shortBreak', parseInt(e.target.value) || 1)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </label>
                        <label>
                            Nghỉ Dài:
                            <input
                                type="number"
                                min={1}
                                value={editTimes.longBreak}
                                onChange={e => handleChangeTime('longBreak', parseInt(e.target.value) || 1)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        className="mt-6 w-full px-4 py-2 font-bold rounded-lg transition-colors duration-200 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Lưu
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-center space-x-4 mb-6 mt-5">
                        {modeButtons.map((btn) => (
                            <button
                                key={btn.mode}
                                onClick={() => {
                                    setMode(btn.mode as Mode);
                                    setIsActive(false);
                                    setSecondsLeft(editTimes[btn.mode as Mode] * 60);
                                }}
                                className={`px-4 py-2 font-bold rounded-lg transition-colors duration-200 text-sm ${mode === btn.mode
                                    ? 'bg-white text-gray-800'
                                    : 'bg-transparent text-white opacity-70 hover:opacity-100'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                    <h1 className="text-8xl font-light text-center mb-8">
                        {formatTime(secondsLeft)}
                    </h1>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={toggleTimer}
                            className="px-6 py-2 font-bold text-lg rounded-full transition-colors duration-200 bg-white text-gray-800 hover:bg-gray-100"
                        >
                            {isActive ? 'Tạm Dừng' : 'Bắt Đầu'}
                        </button>
                        <button
                            onClick={restartTimer}
                            className="px-6 py-2 font-bold text-lg rounded-full transition-colors duration-200 bg-white text-gray-800 hover:bg-gray-100"
                        >
                            Đặt Lại
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Timer;