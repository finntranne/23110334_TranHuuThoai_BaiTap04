import api from "./api"; // axios instance đã có của bạn

/**
 * @param {Object} params
 * @param {string}  params.search    - từ khoá tìm kiếm
 * @param {string}  params.category  - "Tất cả" | "C++" | "Python" | ...
 * @param {string}  params.type      - "Tất cả" | "zoom" | "video"
 * @param {string}  params.sort      - "newest" | "price_asc" | "rating_desc" | ...
 * @param {number}  params.page
 * @param {number}  params.limit
 */
export const fetchCourses = (params = {}) => {
  // Lọc bỏ các param rỗng để URL sạch hơn
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined)
  );
  return api.get("/courses", { params: cleanParams });
};