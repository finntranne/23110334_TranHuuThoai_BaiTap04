import api from "./api";

/**
 * Lấy danh sách sản phẩm thời trang có bộ lọc và phân trang
 * @param {Object} params
 * @param {string} params.search      - Từ khóa tìm kiếm tên sản phẩm
 * @param {string|number} params.categoryId - ID danh mục hoặc "Tất cả"
 * @param {string} params.sort        - Tiêu chí sắp xếp: "newest" | "best_selling" | "rating_desc" | "price_asc" | "price_desc"
 * @param {number} params.page        - Trang hiện tại
 * @param {number} params.limit       - Số sản phẩm mỗi trang
 * @param {number} params.minPrice    - Giá thấp nhất
 * @param {number} params.maxPrice    - Giá cao nhất
 * @param {number} params.minRating   - Đánh giá tối thiểu
 * @param {string} params.inStock     - Trạng thái tồn kho: "all" | "true" (còn hàng) | "false" (hết hàng)
 */
export const fetchProducts = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined)
  );
  return api.get("/products", { params: cleanParams });
};

/**
 * Lấy chi tiết sản phẩm theo ID
 * @param {number|string} id 
 */
export const fetchProductById = (id) => {
  return api.get(`/products/${id}`);
};

/**
 * Lấy danh sách tất cả các danh mục
 */
export const fetchCategories = () => {
  return api.get("/categories");
};

/**
 * Lấy dữ liệu trang chủ thời trang
 */
export const fetchHomeData = () => {
  return api.get("/home-data");
};
