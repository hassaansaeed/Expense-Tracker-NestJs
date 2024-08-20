export class PopulateUtils {
  static populateCategory() {
    return {
      path: 'category_id',
      model: 'Category',
      select: 'name uuid',
      match: { uuid: { $exists: true } },
      localField: 'category_id',
      foreignField: 'uuid',
    };
  }
}
