import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async categories(): Promise<Category[]> {
    const categories = await this.categoryModel.find();
    if (!categories) {
      throw new NotFoundException('No category found');
    } else {
      return categories;
    }
  }

  async category(userUuid, id): Promise<Category[]> {
    if (id) {
      return this.categoryModel.findOne({
        uuid: id,
        userUuid: userUuid,
      });
    } else {
      return await this.categoryModel.find({
        userUuid,
      });
    }
  }
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, userUuid } = createCategoryDto;
    const find = await this.categoryModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });
    if (find) {
      throw new BadRequestException('Name already exists');
    }
    return this.categoryModel.create({ name: name, userUuid: userUuid });
  }

  async update(id: string, updateCategoryDto: any): Promise<Category> {
    const category = await this.categoryModel.findOne({ uuid: id });
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    const { name, userUuid } = updateCategoryDto;

    const existingCategory = await this.categoryModel.findOne({
      name,
      uuid: { $ne: id },
    });

    if (existingCategory) {
      if (existingCategory.userUuid != userUuid) {
        throw new ForbiddenException(
          'You do not have permission to update this category',
        );
      }
      throw new ConflictException('Category name must be unique');
    }

    category.name = name;
    return category.save();
  }

  async delete(id, userUuid) {
    const category = await this.categoryModel.findOne({ uuid: id });
    if (!category) {
      throw new BadRequestException('Category Not Found');
    }
    if (category.userUuid !== userUuid) {
      throw new ForbiddenException(
        'You do not have permission to delete this category',
      );
    }
    return category.deleteOne();
  }
}
