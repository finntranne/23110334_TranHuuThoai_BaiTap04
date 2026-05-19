const db = require("../models");

const seedMoreCourses = async () => {
  try {
    const count = await db.Course.count();
    if (count < 10) {
      console.log(`◇ Database has ${count} courses. Seeding additional courses...`);
      
      const newCourses = [
        {
          id: 9,
          title: "Frontend VueJS 2026",
          description: "32 bài · Khai giảng 28/05/2026. Lịch học: T3, T5 · 19h – 21h.",
          price: 4500000.00,
          slug: "frontend-vuejs-2026",
          thumbnail: "thumbnail1.png",
          status: "published",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 10,
          title: "Lập Trình Go Cơ Bản",
          description: "30 bài · Tự học · Có OJ. Học bất cứ lúc nào.",
          price: 2900000.00,
          slug: "lap-trinh-go-co-ban",
          thumbnail: "thumbnail3.png",
          status: "published",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 11,
          title: "Cấu Trúc Dữ Liệu & Giải Thuật",
          description: "60 bài · Khai giảng 02/06/2026. Lịch học: T2, T4, T6 · 18h – 20h.",
          price: 5500000.00,
          slug: "cau-truc-du-lieu-giai-thuat",
          thumbnail: "thumbnail5.png",
          status: "published",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 12,
          title: "UI/UX Design Figma",
          description: "24 bài · Tự học · Có bài tập. Học bất cứ lúc nào.",
          price: 3200000.00,
          slug: "ui-ux-design-figma",
          thumbnail: "thumbnail7.png",
          status: "published",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      for (const course of newCourses) {
        // Use findOrCreate to avoid primary key conflicts
        await db.Course.findOrCreate({
          where: { id: course.id },
          defaults: course
        });
      }
      console.log("✓ Seeding additional courses completed successfully!");
    } else {
      console.log(`◇ Database already has ${count} courses. No extra seeding required.`);
    }
  } catch (error) {
    console.error("❌ Error seeding additional courses:", error);
  }
};

module.exports = { seedMoreCourses };
