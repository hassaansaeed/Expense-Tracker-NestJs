import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: uuid, unique: true })
  uuid: string;

  @Prop({ type: String, enum: ['admin', 'user', 'company'], default: 'user' })
  role: string;

  @Prop({ default: null })
  company_uuid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export interface User extends Document {
  email: string;
  password: string;
  role: string; // User has an array of roles
}
