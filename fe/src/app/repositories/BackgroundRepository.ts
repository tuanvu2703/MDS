'use client'
import { BackgroundInfor } from "@/app/models/BackgroundModel"

export async function getBackgrounds(): Promise<BackgroundInfor[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/background`,
        { cache: 'no-store' } // Đảm bảo luôn lấy dữ liệu mới nhất
    );
    if (!res.ok) {
        throw new Error('Failed to fetch backgrounds');
    }
    return res.json() as Promise<BackgroundInfor[]>;
}