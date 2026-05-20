const { Op } = require("sequelize");
const db = require("../models");

/**
 * Xây dựng điều kiện WHERE từ query params
 */
const buildWhereClause = ({ search, categoryId, minPrice, maxPrice, minRating, inStock }) => {
  const where = {};

  // Tìm theo tên quần áo
  if (search && search.trim()) {
    where.name = { [Op.like]: `%${search.trim()}%` };
  }

  // Lọc theo danh mục
  if (categoryId && categoryId !== "Tất cả") {
    where.categoryId = Number(categoryId);
  }

  // Lọc theo khoảng giá thực tế (dùng salePrice nếu có, ngược lại dùng price)
  if (minPrice !== undefined || maxPrice !== undefined) {
    const min = minPrice !== undefined ? Number(minPrice) : 0;
    const max = maxPrice !== undefined ? Number(maxPrice) : 999999999;
    
    where[Op.and] = [
      db.sequelize.literal(`
        CASE 
          WHEN salePrice IS NOT NULL THEN salePrice 
          ELSE price 
        END BETWEEN ${min} AND ${max}
      `)
    ];
  }

  // Lọc theo rating tối thiểu
  if (minRating !== undefined && minRating > 0) {
    where.rating = { [Op.gte]: Number(minRating) };
  }

  // Lọc theo trạng thái tồn kho
  if (inStock !== undefined && inStock !== "all") {
    if (inStock === "true" || inStock === "1") {
      where.stock = { [Op.gt]: 0 };
    } else if (inStock === "false" || inStock === "0") {
      where.stock = 0;
    }
  }

  return where;
};

/**
 * Xây dựng ORDER từ query param sort
 */
const buildOrderClause = (sort) => {
  const orderMap = {
    newest:       [["createdAt", "DESC"]],
    best_selling: [["sold", "DESC"]],
    rating_desc:  [["rating", "DESC"]],
    price_asc:    [[db.sequelize.literal("CASE WHEN salePrice IS NOT NULL THEN salePrice ELSE price END"), "ASC"]],
    price_desc:   [[db.sequelize.literal("CASE WHEN salePrice IS NOT NULL THEN salePrice ELSE price END"), "DESC"]],
  };
  return orderMap[sort] || [["id", "ASC"]];
};

/**
 * Service chính: Tìm kiếm, lọc và phân trang sản phẩm
 */
const searchProducts = async (query) => {
  const {
    search      = "",
    categoryId  = "Tất cả",
    sort        = "newest",
    page        = 1,
    limit       = 8,
    minPrice,
    maxPrice,
    minRating,
    inStock     = "all",
  } = query;

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const offset   = (pageNum - 1) * limitNum;

  const where = buildWhereClause({ search, categoryId, minPrice, maxPrice, minRating, inStock });
  const order = buildOrderClause(sort);

  const { count, rows } = await db.Product.findAndCountAll({
    where,
    order,
    limit:  limitNum,
    offset,
    distinct: true,
    include: [
      {
        model: db.Category,
        as: "category",
        attributes: ["id", "name", "slug"],
      }
    ]
  });

  return {
    products:   rows,
    total:      count,
    page:       pageNum,
    limit:      limitNum,
    totalPages: Math.ceil(count / limitNum),
    hasNext:    pageNum < Math.ceil(count / limitNum),
    hasPrev:    pageNum > 1,
  };
};

/**
 * Chi tiết sản phẩm kèm theo danh mục, hình ảnh swiper và sản phẩm tương tự
 */
const getProductDetails = async (id) => {
  const product = await db.Product.findOne({
    where: { id },
    include: [
      {
        model: db.Category,
        as: "category",
        attributes: ["id", "name", "slug"],
      },
      {
        model: db.ProductImage,
        as: "images",
        attributes: ["id", "imageUrl"],
      },
      {
        model: db.Review,
        as: "reviews",
        include: [
          {
            model: db.User,
            attributes: ["id", "fullName", "email", "image"]
          }
        ]
      }
    ]
  });

  if (!product) {
    throw new Error("Sản phẩm không tồn tại");
  }

  // Lấy các sản phẩm tương tự cùng danh mục (loại trừ chính nó)
  const similarProducts = await db.Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [Op.ne]: product.id },
    },
    limit: 4,
    order: [["sold", "DESC"]],
  });

  return {
    product,
    similarProducts
  };
};

/**
 * Lấy danh sách tất cả các danh mục
 */
const getCategories = async () => {
  return await db.Category.findAll({
    order: [["id", "ASC"]],
  });
};

module.exports = {
  searchProducts,
  getProductDetails,
  getCategories,
};
