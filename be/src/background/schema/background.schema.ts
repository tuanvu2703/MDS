import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BackgroundDocument = Background & Document;

@Schema()
export class Background {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['video', 'gradient', 'image', 'solid'] })
  type: string;

  @Prop()
  src?: string;

  @Prop()
  srcPublicId?: string; // public_id của file trên Cloudinary

  @Prop()
  style?: string;

  @Prop()
  thumbnail?: string;

  @Prop()
  thumbnailPublicId?: string; // public_id của thumbnail trên Cloudinary

}

export const BackgroundSchema = SchemaFactory.createForClass(Background);