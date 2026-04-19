/**
 * Paginate mongoose results
 * @param {Object} model - Mongoose Model
 * @param {Object} query - Mongoose Query
 * @param {Object} options - Pagination options (page, limit, sort)
 * @returns {Object} Paginated result with metadata
 */
const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };

  const [total, data] = await Promise.all([
    model.countDocuments(query),
    model.find(query).skip(skip).limit(limit).sort(sort),
  ]);

  return {
    data,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

module.exports = paginate;
