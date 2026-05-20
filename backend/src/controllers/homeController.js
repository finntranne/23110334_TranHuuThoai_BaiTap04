const db = require("../models");

/**
 * Lấy dữ liệu hiển thị trang chủ thời trang
 * Bao gồm:
 * 1. promoProducts: Sản phẩm đang khuyến mãi (isPromo: true)
 * 2. newestProducts: Sản phẩm mới nhất (sắp xếp theo createdAt DESC)
 * 3. bestSellingProducts: Sản phẩm bán chạy nhất (sắp xếp theo sold DESC)
 * 4. reviews: Đánh giá tiêu biểu từ khách hàng
 */
const getHomePageData = async (req, res) => {
  try {
    // 1. Sản phẩm khuyến mãi
    const promoProducts = await db.Product.findAll({
      where: { isPromo: true },
      limit: 4,
      order: [["id", "ASC"]],
      include: [{ model: db.Category, as: "category", attributes: ["name"] }]
    });

    // 2. Sản phẩm mới nhất
    const newestProducts = await db.Product.findAll({
      limit: 4,
      order: [["createdAt", "DESC"]],
      include: [{ model: db.Category, as: "category", attributes: ["name"] }]
    });

    // 3. Sản phẩm bán chạy nhất
    const bestSellingProducts = await db.Product.findAll({
      limit: 4,
      order: [["sold", "DESC"]],
      include: [{ model: db.Category, as: "category", attributes: ["name"] }]
    });

    // 4. Các đánh giá tiêu biểu
    const reviews = await db.Review.findAll({
      include: [
        {
          model: db.User,
          attributes: ["id", "fullName", "email", "image"]
        },
        {
          model: db.Product,
          as: "product",
          attributes: ["id", "name"]
        }
      ],
      limit: 6,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      data: {
        promoProducts,
        newestProducts,
        bestSellingProducts,
        reviews
      }
    });
  } catch (error) {
    console.error("Error in getHomePageData:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server nội bộ khi lấy dữ liệu trang chủ"
    });
  }
};

module.exports = {
  getHomePageData
};
