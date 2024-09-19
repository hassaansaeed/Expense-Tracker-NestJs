import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category, CategorySchema } from 'src/category/category.schema';
import { v4 as uuid } from 'uuid';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ default: uuid, unique: true })
  uuid: string;

  @Prop()
  name: string;

  @Prop()
  amount: string;

  @Prop({ type: String, ref: 'Category' })
  category_id: string;

  @Prop({ type: String })
  budget_id: string;

  @Prop({ type: String, required: true })
  user_id: string;

  @Prop()
  company_uuid: string;

  // @Prop({ type: CategorySchema })
  // category: Category;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
