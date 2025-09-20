import { Module } from '@nestjs/common';
import { BackgroundService } from './background.service';
import { BackgroundController } from './background.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Background, BackgroundSchema } from 'src/background/schema/background.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Background.name, schema: BackgroundSchema }
    ]),
    CloudinaryModule,
  ],
  providers: [BackgroundService],
  controllers: [BackgroundController]
})
export class BackgroundModule { }
