import { Controller, Get, Post, UseInterceptors, Body, Param, Put, Delete, UploadedFiles, UsePipes, ValidationPipe } from '@nestjs/common';
import { BackgroundService } from 'src/background/background.service';
import { CreateBackgroundDto } from 'src/background/dto/createbackground.dto';
import { UpdateBackgroundDto } from 'src/background/dto/updatebackground.dto';
import { Background } from 'src/background/schema/background.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/multer.config';

@Controller('background')
export class BackgroundController {
    constructor(private readonly backgroundService: BackgroundService) { }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'src', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ], multerConfig))
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false, // Allow extra fields for file uploads
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }))
    async create(
        @Body() createBackgroundDto: CreateBackgroundDto,
        @UploadedFiles() files: { src?: Express.Multer.File[], thumbnail?: Express.Multer.File[] }
    ) {
        const srcFile = files?.src?.[0];
        const thumbnailFile = files?.thumbnail?.[0];
        return this.backgroundService.create(createBackgroundDto, srcFile, thumbnailFile);
    }
    @Get()
    async findAll(): Promise<Background[]> {
        return this.backgroundService.findAll();
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateBackgroundDto: UpdateBackgroundDto): Promise<Background> {
        return this.backgroundService.update(id, updateBackgroundDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<any> {
        return this.backgroundService.remove(id);
    }
}