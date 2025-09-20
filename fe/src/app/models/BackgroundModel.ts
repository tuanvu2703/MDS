export type BackgroundInfor = {
    _id?: string;
    name: string;
    type: 'video' | 'gradient' | 'image' | 'solid';
    src?: string;
    srcPublicId?: string;
    style?: string;
    thumbnail?: string;
}

export type BackgroundType = 'video' | 'gradient' | 'image' | 'solid';