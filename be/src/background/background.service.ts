import { CreateBackgroundDto } from './dto/createbackground.dto';
import { UpdateBackgroundDto } from './dto/updatebackground.dto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Background, BackgroundDocument } from './schema/background.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BackgroundService {
    constructor(
        @InjectModel(Background.name) private backgroundModel: Model<BackgroundDocument>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async create(
        createBackgroundDto: CreateBackgroundDto,
        file?: Express.Multer.File,
        thumbnail?: Express.Multer.File
    ): Promise<Background> {

        if (!createBackgroundDto) {
            throw new BadRequestException('CreateBackgroundDto is required');
        }
        const { type } = createBackgroundDto;

        // 1. Kiểm tra file có bắt buộc không
        if ((type === 'image' || type === 'video') && !file) {
            throw new BadRequestException('File is required for image or video types.');
        }

        // 1.1. Kiểm tra thumbnail bắt buộc cho video
        if (type === 'video' && !thumbnail) {
            throw new BadRequestException('Thumbnail is required for video types.');
        }

        const backgroundPayload: Partial<Background> = { ...createBackgroundDto };

        // 2. Upload file lên Cloudinary nếu có
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file);
            backgroundPayload.src = uploadResult.secure_url;
            backgroundPayload.srcPublicId = uploadResult.public_id; // Lưu lại public_id
        }

        // 2.1. Upload thumbnail lên Cloudinary nếu có
        if (thumbnail) {
            const thumbnailUploadResult = await this.cloudinaryService.uploadImage(thumbnail);
            backgroundPayload.thumbnail = thumbnailUploadResult.secure_url;
            backgroundPayload.thumbnailPublicId = thumbnailUploadResult.public_id;
        }

        // 3. Tạo và lưu document mới
        const createdBackground = new this.backgroundModel(backgroundPayload);
        return createdBackground.save();
    }

    async findAll(): Promise<Background[]> {
        return this.backgroundModel.find().exec();
    }

    async update(
        id: string,
        updateBackgroundDto: UpdateBackgroundDto,
        file?: Express.Multer.File,
        thumbnail?: Express.Multer.File,
    ): Promise<Background> {
        const existingBackground = await this.backgroundModel.findById(id).exec();
        if (!existingBackground) {
            throw new NotFoundException(`Background with ID ${id} not found`);
        }

        const updatePayload: Partial<Background> = { ...updateBackgroundDto };

        // 4. Nếu có file mới, upload file mới và xóa file cũ
        if (file) {
            // Xóa file cũ trên Cloudinary nếu có
            if (existingBackground.srcPublicId) {
                await this.cloudinaryService.deleteImage(existingBackground.srcPublicId);
            }

            // Upload file mới
            const uploadResult = await this.cloudinaryService.uploadImage(file);
            updatePayload.src = uploadResult.secure_url;
            updatePayload.srcPublicId = uploadResult.public_id;
        }

        // 4.1. Nếu có thumbnail mới, upload thumbnail mới và xóa thumbnail cũ
        if (thumbnail) {
            // Xóa thumbnail cũ trên Cloudinary nếu có
            if (existingBackground.thumbnailPublicId) {
                await this.cloudinaryService.deleteImage(existingBackground.thumbnailPublicId);
            }

            // Upload thumbnail mới
            const thumbnailUploadResult = await this.cloudinaryService.uploadImage(thumbnail);
            updatePayload.thumbnail = thumbnailUploadResult.secure_url;
            updatePayload.thumbnailPublicId = thumbnailUploadResult.public_id;
        }

        // 5. Cập nhật document trong DB
        const update = await this.backgroundModel.findByIdAndUpdate(id, updatePayload, { new: true }).exec();
        if (!update) {
            throw new NotFoundException(`Background with ID ${id} not found after update`);
        }
        return update;
    }

    async remove(id: string): Promise<{ deleted: boolean; message: string }> {
        const deletedBackground = await this.backgroundModel.findByIdAndDelete(id).exec();

        if (!deletedBackground) {
            throw new NotFoundException(`Background with ID ${id} not found`);
        }

        // 6. Xóa file tương ứng trên Cloudinary
        if (deletedBackground.srcPublicId) {
            await this.cloudinaryService.deleteImage(deletedBackground.srcPublicId);
        }

        // 6.1. Xóa thumbnail tương ứng trên Cloudinary
        if (deletedBackground.thumbnailPublicId) {
            await this.cloudinaryService.deleteImage(deletedBackground.thumbnailPublicId);
        }

        return { deleted: true, message: `Background with ID ${id} has been deleted.` };
    }
}