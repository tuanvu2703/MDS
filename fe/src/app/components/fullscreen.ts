// Define interfaces for browser-specific fullscreen APIs
interface DocumentWithFullscreen extends Document {
    webkitFullscreenEnabled?: boolean;
    mozFullScreenEnabled?: boolean;
    msFullscreenEnabled?: boolean;
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
}

interface ElementWithFullscreen extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Check if fullscreen is supported
export const isFullscreenSupported = (): boolean => {
    if (!isBrowser) return false;

    const doc = document as DocumentWithFullscreen;
    return !!(
        document.fullscreenEnabled ||
        doc.webkitFullscreenEnabled ||
        doc.mozFullScreenEnabled ||
        doc.msFullscreenEnabled
    );
};

// Check if currently in fullscreen
export const isFullscreen = (): boolean => {
    if (!isBrowser) return false;

    const doc = document as DocumentWithFullscreen;
    return !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
    );
};

// Enter fullscreen
export const enterFullscreen = async (element?: HTMLElement): Promise<void> => {
    if (!isBrowser) return;

    const targetElement = element || document.documentElement;
    const el = targetElement as ElementWithFullscreen;

    try {
        if (targetElement.requestFullscreen) {
            await targetElement.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            await el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            await el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            await el.msRequestFullscreen();
        }
    } catch (error) {
        console.error('Error entering fullscreen:', error);
    }
};

// Exit fullscreen
export const exitFullscreen = async (): Promise<void> => {
    if (!isBrowser) return;

    const doc = document as DocumentWithFullscreen;
    try {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
            await doc.msExitFullscreen();
        }
    } catch (error) {
        console.error('Error exiting fullscreen:', error);
    }
};

// Toggle fullscreen
export const toggleFullscreen = async (element?: HTMLElement): Promise<void> => {
    if (!isBrowser) return;

    if (isFullscreen()) {
        await exitFullscreen();
    } else {
        await enterFullscreen(element);
    }
};
