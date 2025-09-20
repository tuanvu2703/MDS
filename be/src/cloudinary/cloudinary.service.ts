import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<{ secure_url: string; public_id: string }> {
        try {
            let uploadResult;

            if (file.buffer) {
                // Memory storage - use buffer
                uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto', // Tự động detect loại file
                            folder: 'backgrounds', // Tạo folder để tổ chức file
                        },
                        (error, result) => {
                            if (error) {
                                reject(new Error(`Upload failed: ${error.message}`));
                            } else if (result) {
                                resolve(result);
                            } else {
                                reject(new Error('Upload failed: No result returned'));
                            }
                        }
                    ).end(file.buffer);
                });
            } else if (file.path) {
                // Disk storage - use file path
                uploadResult = await cloudinary.uploader.upload(file.path, {
                    resource_type: 'auto',
                    folder: 'backgrounds',
                });

                // Clean up the temporary file
                try {
                    await unlinkAsync(file.path);
                } catch (unlinkError) {
                    console.warn(`Failed to delete temporary file: ${file.path}`, unlinkError);
                }
            } else {
                throw new Error('No file buffer or path available');
            }

            return {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };
        } catch (error) {
            // Clean up file if upload fails and file exists on disk
            if (file.path) {
                try {
                    await unlinkAsync(file.path);
                } catch (unlinkError) {
                    console.warn(`Failed to delete temporary file after upload error: ${file.path}`, unlinkError);
                }
            }
            throw error;
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error(`Failed to delete image: ${error.message}`);
            // Không throw error để không làm gián đoạn quá trình xóa record
        }
    }
}