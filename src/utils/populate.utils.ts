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

  static populateBudget() {
    return {
      path: 'budget_id',
      model: 'Budget',
      select: 'name uuid',
      match: { uuid: { $exists: true } },
      localField: 'budget_id',
      foreignField: 'uuid',
    };
  }

  static lookupCategory() {
    return {
      $lookup: {
        from: 'categories', // The name of the categories collection
        localField: 'category_id', // The field in the expense collection
        foreignField: 'uuid', // The field in the categories collection
        as: 'categoryDetails', // Output array field that will contain category details
      },
    };
  }
}
