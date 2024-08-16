import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Currency } from './currence-enum';

@Schema({ timestamps: true })
export class Income extends Document {
  @Prop({ default: uuid, unique: true })
  uuid: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  source: string;

  @Prop({ type: String, enum: Currency, default: Currency.PKR })
  currency: Currency;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: String, required: true })
  user_id: string;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);
