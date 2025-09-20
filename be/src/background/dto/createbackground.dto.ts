import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';


export class CreateBackgroundDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(['video', 'gradient', 'image', 'solid'])
    type: string;

    @IsOptional()
    @IsString()
    src?: string;

    @IsOptional()
    @IsString()
    srcPublicId?: string;

    @IsOptional()
    @IsString()
    style?: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsOptional()
    @IsString()
    thumbnailPublicId?: string;
}