import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: uuid, unique: true })
  uuid: string;

  @Prop()
  user_uuid: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
