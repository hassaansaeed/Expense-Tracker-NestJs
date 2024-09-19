export class PopulateUtils {
  static populateCategory() {
    return {
      path: 'categoryUuid',
      model: 'Category',
      select: 'name uuid',
      match: { uuid: { $exists: true } },
      localField: 'categoryUuid',
      foreignField: 'uuid',
    };
  }

  static populateBudget() {
    return {
      path: 'budgetUuid',
      model: 'Budget',
      select: 'name uuid',
      match: { uuid: { $exists: true } },
      localField: 'budgetUuid',
      foreignField: 'uuid',
    };
  }

  static lookupCategory() {
    return {
      $lookup: {
        from: 'categories',
        localField: 'categoryUuid',
        foreignField: 'uuid',
        as: 'categoryDetails',
      },
    };
  }
}
