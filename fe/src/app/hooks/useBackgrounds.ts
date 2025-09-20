'use client';

import { useState, useEffect } from 'react';
import { BackgroundInfor } from '@/app/models/BackgroundModel';
import { getBackgrounds } from '@/app/repositories/BackgroundRepository';

interface UseBackgroundsReturn {
    backgrounds: BackgroundInfor[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useBackgrounds(): UseBackgroundsReturn {
    const [backgrounds, setBackgrounds] = useState<BackgroundInfor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBackgrounds = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getBackgrounds();
            setBackgrounds(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch backgrounds');
            console.error('Error fetching backgrounds:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBackgrounds();
    }, []);

    return {
        backgrounds,
        loading,
        error,
        refetch: fetchBackgrounds
    };
}