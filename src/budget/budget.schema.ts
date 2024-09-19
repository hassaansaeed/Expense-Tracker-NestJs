import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ timestamps: true })
export class Budget extends Document {
  @Prop({ default: uuid, unique: true })
  uuid: uuid;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: String, ref: 'Category' })
  categoryUuid: string;

  @Prop({ type: String, required: true })
  userUuid: string;

  @Prop({ type: String })
  companyUuid: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
