const db = require("../models");

const getHomePageData = async (req, res) => {
  try {
    const courses = await db.Course.findAll({
      where: { status: 'published' },
      limit: 8
    });

    const reviews = await db.Review.findAll({
      include: [
        {
          model: db.User,
          attributes: { exclude: ['password'] }
        }
      ],
      limit: 6
    });

    return res.status(200).json({
      success: true,
      data: {
        courses,
        reviews
      }
    });
  } catch (error) {
    console.error("Error getting homepage data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const category = req.query.category || "Tất cả";
    
    let whereClause = { status: 'published' };
    
    if (category !== "Tất cả") {
      const { Op } = require("sequelize");
      if (category === "Zoom Live") {
        whereClause.description = { [Op.like]: "%Lịch học%" };
      } else if (category === "Video") {
        whereClause.description = { [Op.like]: "%Tự học%" };
      } else if (category === "C++") {
        whereClause.title = { [Op.like]: "%C++%" };
      } else if (category === "Web") {
        whereClause[Op.or] = [
          { title: { [Op.like]: "%Web%" } },
          { title: { [Op.like]: "%React%" } }
        ];
      } else if (category === "Backend") {
        whereClause[Op.or] = [
          { title: { [Op.like]: "%Backend%" } },
          { title: { [Op.like]: "%DevOps%" } }
        ];
      } else if (category === "Java") {
        whereClause.title = { [Op.like]: "%Java%" };
      } else if (category === "Python") {
        whereClause.title = { [Op.like]: "%Python%" };
      }
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await db.Course.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['id', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      data: {
        courses: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error getting courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getFeaturedCourses = async (req, res) => {
  try {
    const allCourses = await db.Course.findAll({
      where: { status: 'published' }
    });

    // Map deterministic mock views and sales
    const mapped = allCourses.map(course => {
      const sales = (15 - (course.id % 12)) * 18 + (course.id * 5) % 25;
      const views = (course.id % 7 + 1) * 142 + (course.id * 8) % 45;
      return {
        ...course.toJSON(),
        sales,
        views
      };
    });

    // Sort by sales descending for best selling
    const bestSelling = [...mapped].sort((a, b) => b.sales - a.sales).slice(0, 10);

    // Sort by views descending for most viewed
    const mostViewed = [...mapped].sort((a, b) => b.views - a.views).slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        bestSelling,
        mostViewed
      }
    });
  } catch (error) {
    console.error("Error getting featured courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getHomePageData,
  getCourses,
  getFeaturedCourses
};
