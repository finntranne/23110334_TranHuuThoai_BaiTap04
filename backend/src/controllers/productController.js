const productService = require("../services/productService");

/**
 * GET /api/products
 * Query params: search, categoryId, sort, page, limit, minPrice, maxPrice, minRating, inStock
 */
const getProducts = async (req, res) => {
  try {
    const result = await productService.searchProducts(req.query);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.getProductDetails(id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getProductById:", error);
    return res.status(error.message === "Sản phẩm không tồn tại" ? 404 : 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * GET /api/categories
 */
const getCategoriesList = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error in getCategoriesList:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategoriesList,
};
