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
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ type: String, ref: 'Category' })
  category_id: string;

  @Prop({ type: String, required: true })
  user_id: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
