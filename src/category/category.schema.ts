import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ default: uuid, unique: true })
  uuid: string;

  @Prop({ type: String, required: true })
  userUuid: string;

  @Prop({ required: true })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
