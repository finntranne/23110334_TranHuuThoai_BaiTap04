const { Op } = require("sequelize");
const db = require("../models");

/**
 * Xây dựng điều kiện WHERE từ query params
 */
const buildWhereClause = ({ search, type, category, minPrice, maxPrice, minRating }) => {
  const where = { status: "published" };

  // Tìm theo tên khoá học
  if (search && search.trim()) {
    where.title = { [Op.like]: `%${search.trim()}%` };
  }

  // Lọc theo loại: zoom | video
  if (type && type !== "Tất cả") {
    where.type = type.toLowerCase();
  }

  // Lọc theo danh mục: C++, Python, Web, ...
  if (category && category !== "Tất cả") {
    // Map tên hiển thị → giá trị trong DB
    const categoryMap = {
      "Zoom Live": null,   // xử lý bằng type=zoom
      "Video":     null,   // xử lý bằng type=video
      "C++":       "C++",
      "Web":       "Web",
      "Backend":   "Backend",
      "Java":      "Java",
      "Python":    "Python",
    };

    if (category === "Zoom Live") {
      where.type = "zoom";
    } else if (category === "Video") {
      where.type = "video";
    } else if (categoryMap[category]) {
      where.category = categoryMap[category];
    }
  }

  // Lọc theo khoảng giá
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price[Op.gte] = Number(minPrice);
    if (maxPrice !== undefined) where.price[Op.lte] = Number(maxPrice);
  }

  // Lọc theo rating tối thiểu
  if (minRating !== undefined) {
    where.rating = { [Op.gte]: Number(minRating) };
  }

  return where;
};

/**
 * Xây dựng ORDER từ query param sort
 */
const buildOrderClause = (sort) => {
  const orderMap = {
    newest:       [["createdAt", "DESC"]],
    oldest:       [["createdAt", "ASC"]],
    price_asc:    [["price", "ASC"]],
    price_desc:   [["price", "DESC"]],
    rating_desc:  [["rating", "DESC"]],
    popular:      [["reviewCount", "DESC"]],
  };
  return orderMap[sort] || [["id", "ASC"]];
};

/**
 * Service chính: tìm kiếm + lọc + phân trang
 */
const searchCourses = async (query) => {
  const {
    search   = "",
    type     = "Tất cả",
    category = "Tất cả",
    sort     = "newest",
    page     = 1,
    limit    = 8,
    minPrice,
    maxPrice,
    minRating,
  } = query;

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const offset   = (pageNum - 1) * limitNum;

  const where = buildWhereClause({ search, type, category, minPrice, maxPrice, minRating });
  const order = buildOrderClause(sort);

  const { count, rows } = await db.Course.findAndCountAll({
    where,
    order,
    limit:  limitNum,
    offset,
    distinct: true,
  });

  return {
    courses:    rows,
    total:      count,
    page:       pageNum,
    limit:      limitNum,
    totalPages: Math.ceil(count / limitNum),
    hasNext:    pageNum < Math.ceil(count / limitNum),
    hasPrev:    pageNum > 1,
  };
};

module.exports = { searchCourses };