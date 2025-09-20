import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BackgroundModule } from './background/background.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './common/multer.config';


@Module({
  imports: [UserModule,
    BackgroundModule,
    CloudinaryModule,

    // Cấu hình Multer toàn cục cho upload file
    MulterModule.register(multerConfig),

    // 1. Tải các biến môi trường từ file .env
    ConfigModule.forRoot({
      isGlobal: true, // Giúp ConfigModule có sẵn trong toàn bộ ứng dụng
    }),
    // 2. Cấu hình Mongoose một cách động
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'), // Lấy giá trị từ biến môi trường
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule { }
