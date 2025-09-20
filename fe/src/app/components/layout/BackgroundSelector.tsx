'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { BackgroundInfor, BackgroundType } from '@/app/models/BackgroundModel';
import Button from '@/app/components/ui/Button';

interface BackgroundSelectorProps {
    options: BackgroundInfor[];
    currentBackground: string;
    onBackgroundChange: (backgroundId: string) => void;
}

export default function BackgroundSelector({
    options,
    currentBackground,
    onBackgroundChange,
}: BackgroundSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tabIndex, setTabIndex] = useState<BackgroundType>('video');

    const filteredOptions = options.filter((option) => option.type === tabIndex);

    const tabs: { key: BackgroundType; label: string; icon: React.ReactNode }[] = [
        {
            key: 'video',
            label: 'Video',
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
        },
        {
            key: 'image',
            label: 'Ảnh',
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>

        },
        { key: 'gradient', label: 'Gradient', icon: <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div> },
        { key: 'solid', label: 'Màu sắc', icon: <div className="w-4 h-4 rounded-full bg-gray-500"></div> },
    ];

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white bg-opacity-50 text-black p-3 rounded-full hover:bg-opacity-70 transition-all duration-300 backdrop-blur-sm"
                title="Chọn background"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21,15 16,10 5,21" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-4 min-w-[500px] border border-white border-opacity-20">
                    <div className="flex space-x-1 mb-4 rounded-lg p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setTabIndex(tab.key)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm transition-all duration-200 ${tabIndex === tab.key ? 'border-b-4 border-blue-500 text-black' : 'text-gray-600 hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto w-full">
                        {filteredOptions.map((option) => (
                            <Button
                                key={option._id}
                                onClick={() => option._id && onBackgroundChange(option._id)}
                                className={`rounded-md transition duration-200 ${currentBackground === option._id
                                    ? 'text-black'
                                    : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                                    }`}
                            >
                                <div className="grid gap-2 items-center justify-center">
                                    <div className="relative w-40 h-28 rounded-2xl overflow-hidden bg-white bg-opacity-20">
                                        {(option.type === 'video') && option.thumbnail && (
                                            <Image src={option?.thumbnail} alt={option?.name} fill className="object-cover" />
                                        )}
                                        {(option.type === 'image') && option.src && (
                                            <Image src={option?.src} alt={option?.name} fill className="object-cover" />
                                        )}
                                        {(option.type === 'gradient' || option.type === 'solid') && (
                                            <div className={`w-full h-full ${option.thumbnail}`}></div>
                                        )}
                                    </div>
                                    <div className="text-sm font-medium text-center">{option.name}</div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
