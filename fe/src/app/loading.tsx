"use client"

export default function loading() {
    return (
        <div className="flex flex-col h-screen w-screen items-center gap-4 p-8 rounded-2xl bg-gray-800 bg-opacity-50 shadow-lg backdrop-blur-md">
            <div className="loading-animation">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}
