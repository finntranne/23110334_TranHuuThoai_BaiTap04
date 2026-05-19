const courseService = require("../services/courseService");

/**
 * GET /api/courses
 * Query params: search, type, category, sort, page, limit, minPrice, maxPrice, minRating
 */
const getCourses = async (req, res) => {
  try {
    const result = await courseService.searchCourses(req.query);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getCourses };