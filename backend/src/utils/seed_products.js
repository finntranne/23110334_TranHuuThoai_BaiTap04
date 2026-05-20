const db = require("../models");

const seedProducts = async () => {
  try {
    console.log("◇ Starting to seed database with clothing store data...");

    // 1. Seed Roles if they don't exist
    const rolesCount = await db.Role.count();
    if (rolesCount === 0) {
      console.log("◇ Seeding roles...");
      await db.Role.bulkCreate([
        { id: 1, name: "Admin" },
        { id: 2, name: "User" }
      ]);
      console.log("✓ Roles seeded.");
    }

    // 2. Seed Users if they don't exist
    const usersCount = await db.User.count();
    if (usersCount === 0) {
      console.log("◇ Seeding users...");
      const bcrypt = require("bcryptjs");
      const defaultPasswordHash = await bcrypt.hash("Learning@2026", 10);
      
      await db.User.bulkCreate([
        {
          id: 1,
          email: "ntha91.nvt@gmail.com",
          password: defaultPasswordHash,
          fullName: "Nguyễn Trường",
          address: "123 Main Street, Ho Chi Minh City, Vietnam",
          phoneNumber: "0912345678",
          gender: true,
          image: null,
          roleId: 1,
          positionId: "admin",
          isVerified: true
        },
        {
          id: 2,
          email: "user1@example.com",
          password: defaultPasswordHash,
          fullName: "John Doe",
          address: "456 Oak Avenue, Ha Noi, Vietnam",
          phoneNumber: "0987654321",
          gender: true,
          image: null,
          roleId: 2,
          positionId: "developer",
          isVerified: true
        },
        {
          id: 3,
          email: "user2@example.com",
          password: defaultPasswordHash,
          fullName: "Jane Smith",
          address: "789 Pine Road, Da Nang, Vietnam",
          phoneNumber: "0901234567",
          gender: false,
          image: null,
          roleId: 2,
          positionId: "designer",
          isVerified: true
        },
        {
          id: 4,
          email: "user3@example.com",
          password: defaultPasswordHash,
          fullName: "Michael Johnson",
          address: "321 Elm Street, Can Tho, Vietnam",
          phoneNumber: "0923456789",
          gender: true,
          image: null,
          roleId: 2,
          positionId: "tester",
          isVerified: true
        },
        {
          id: 5,
          email: "user4@example.com",
          password: defaultPasswordHash,
          fullName: "Sarah Williams",
          address: "654 Maple Drive, Hai Phong, Vietnam",
          phoneNumber: "0934567890",
          gender: false,
          image: null,
          roleId: 2,
          positionId: "manager",
          isVerified: true
        }
      ]);
      console.log("✓ Users seeded.");
    }

    // 3. Seed Categories
    const categoriesCount = await db.Category.count();
    if (categoriesCount === 0) {
      console.log("◇ Seeding categories...");
      await db.Category.bulkCreate([
        { id: 1, name: "Áo Thun", slug: "ao-thun" },
        { id: 2, name: "Áo Hoodie & Sweater", slug: "ao-hoodie-sweater" },
        { id: 3, name: "Quần Jeans & Kaki", slug: "quan-jeans-kaki" },
        { id: 4, name: "Áo Khoác", slug: "ao-khoac" }
      ]);
      console.log("✓ Categories seeded.");
    }

    // 4. Seed Products (Clothing)
    const productsCount = await db.Product.count();
    if (productsCount === 0) {
      console.log("◇ Seeding products...");
      const productsData = [
        {
          id: 1,
          name: "Áo Thun Unisex Cotton Basic Cổ Tròn",
          slug: "ao-thun-unisex-cotton-basic-co-tron",
          description: "Áo thun chất liệu 100% cotton co giãn 4 chiều cực mát, thiết kế form rộng unisex trẻ trung thích hợp cho cả nam và nữ. Đường may tỉ mỉ, không bai nhão khi giặt máy.",
          price: 180000.00,
          salePrice: 120000.00,
          stock: 150,
          sold: 1240,
          rating: 4.8,
          reviewCount: 3,
          thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
          categoryId: 1,
          isFeatured: true,
          isPromo: true
        },
        {
          id: 2,
          name: "Áo Hoodie Nỉ Bông Trơn Form Rộng Oversize",
          slug: "ao-hoodie-ni-bong-tron-form-rong-oversize",
          description: "Áo hoodie vải nỉ bông dày dặn siêu ấm áp cho mùa đông, form rộng unisex chuẩn phong cách Hàn Quốc. Mũ áo được thiết kế 2 lớp dày dặn, đứng form cực đẹp.",
          price: 350000.00,
          salePrice: 249000.00,
          stock: 85,
          sold: 850,
          rating: 4.9,
          reviewCount: 0,
          thumbnail: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
          categoryId: 2,
          isFeatured: true,
          isPromo: true
        },
        {
          id: 3,
          name: "Quần Jeans Nam Slimfit Co Giãn Cao Cấp",
          slug: "quan-jeans-nam-slimfit-co-gian-cao-cap",
          description: "Quần jeans nam kiểu dáng slimfit ôm chân gọn gàng, chất liệu denim dày dặn có pha sợi co giãn nhẹ giúp bạn thoải mái vận động cả ngày. Thiết kế bền màu không ra màu khi giặt.",
          price: 420000.00,
          salePrice: 299000.00,
          stock: 5,
          sold: 430,
          rating: 4.7,
          reviewCount: 1,
          thumbnail: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
          categoryId: 3,
          isFeatured: false,
          isPromo: true
        },
        {
          id: 4,
          name: "Áo Khoác Bomber Varsity Dạ Phối Tay Da",
          slug: "ao-khoac-bomber-varsity-da-phoi-tay-da",
          description: "Áo khoác bomber chất dạ cao cấp phối tay da PU thời trang. Thiết kế cúc bấm tiện lợi, thêu hoạ tiết chữ trước ngực nổi bật phong cách retro học đường năng động.",
          price: 480000.00,
          salePrice: 380000.00,
          stock: 30,
          sold: 120,
          rating: 4.6,
          reviewCount: 0,
          categoryId: 4,
          isFeatured: true,
          isPromo: true
        },
        {
          id: 5,
          name: "Áo Thun Polo Premium Cá Sấu Cotton",
          slug: "ao-thun-polo-premium-ca-sau-cotton",
          description: "Áo thun polo nam cổ bẻ thun cá sấu cotton cao cấp. Chất vải thông thoáng, co giãn tốt, thấm hút mồ hôi hiệu quả, mang lại vẻ ngoài lịch lãm nhưng vẫn rất năng động.",
          price: 220000.00,
          salePrice: 180000.00,
          stock: 200,
          sold: 560,
          rating: 4.9,
          reviewCount: 0,
          thumbnail: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800",
          categoryId: 1,
          isFeatured: true,
          isPromo: false
        },
        {
          id: 6,
          name: "Quần Short Kaki Casual Dáng Lửng Tây",
          slug: "quan-short-kaki-casual-dang-lung-tay",
          description: "Quần short kaki nam dáng lửng trẻ trung năng động. Chất kaki Hàn Quốc dày dặn đứng dáng, không xù lông và cực kỳ mát mẻ cho những ngày hè dạo phố.",
          price: 190000.00,
          salePrice: 140000.00,
          stock: 0,
          sold: 620,
          rating: 4.5,
          reviewCount: 0,
          thumbnail: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800",
          categoryId: 3,
          isFeatured: false,
          isPromo: false
        },
        {
          id: 7,
          name: "Áo Sweater Dệt Kim Phong Cách Hàn Quốc",
          slug: "ao-sweater-det-kim-phong-cach-han-quoc",
          description: "Áo len sweater dệt kim cổ tròn basic phong cách tối giản. Sợi len acrylic mềm mại, giữ ấm tốt và không gây ngứa da, thích hợp mặc ngoài áo sơ mi rất thanh lịch.",
          price: 290000.00,
          salePrice: 210000.00,
          stock: 45,
          sold: 80,
          rating: 4.8,
          reviewCount: 0,
          thumbnail: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800",
          categoryId: 2,
          isFeatured: false,
          isPromo: false
        },
        {
          id: 8,
          name: "Áo Khoác Gió Chống Nước 2 Lớp Có Mũ",
          slug: "ao-khoac-gio-chong-nuoc-2-lop-co-mu",
          description: "Áo khoác dù gió 2 lớp cản gió và chống nước mưa nhẹ cực tốt. Mũ áo có thể tháo rời linh hoạt, túi khoá kéo bảo vệ điện thoại, đồ dùng cá nhân an toàn.",
          price: 300000.00,
          salePrice: 230000.00,
          stock: 90,
          sold: 980,
          rating: 4.7,
          reviewCount: 0,
          thumbnail: "https://images.unsplash.com/photo-1608063615781-e5ef7bf042c1?w=800",
          categoryId: 4,
          isFeatured: false,
          isPromo: false
        }
      ];

      await db.Product.bulkCreate(productsData);
      console.log("✓ Products seeded.");

      // 5. Seed Product Images (for swiper gallery)
      console.log("◇ Seeding product images...");
      await db.ProductImage.bulkCreate([
        // Product 1
        { productId: 1, imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800" },
        { productId: 1, imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800" },
        { productId: 1, imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800" },
        
        // Product 2
        { productId: 2, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" },
        { productId: 2, imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800" },
        { productId: 2, imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800" },

        // Product 3
        { productId: 3, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800" },
        { productId: 3, imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800" },

        // Product 4
        { productId: 4, imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800" },
        { productId: 4, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800" },

        // Product 5
        { productId: 5, imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800" },
        { productId: 5, imageUrl: "https://images.unsplash.com/photo-1625910513397-a400c7776b0b?w=800" },

        // Product 6
        { productId: 6, imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800" },

        // Product 7
        { productId: 7, imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800" },

        // Product 8
        { productId: 8, imageUrl: "https://images.unsplash.com/photo-1608063615781-e5ef7bf042c1?w=800" },
        { productId: 8, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800" }
      ]);
      console.log("✓ Product images seeded.");

      // 6. Seed Reviews
      console.log("◇ Seeding product reviews...");
      const users = await db.User.findAll();
      if (users && users.length > 0) {
        const u1 = users[0].id;
        const u2 = users[1] ? users[1].id : u1;
        const u3 = users[2] ? users[2].id : u1;

        await db.Review.bulkCreate([
          {
            productId: 1,
            userId: u2,
            rating: 5,
            comment: "Áo thun mặc rất mát, cotton xịn, giặt máy 3 lần rồi không thấy xù lông hay giãn cổ. Rất ưng ý!",
            createdAt: new Date()
          },
          {
            productId: 1,
            userId: u3,
            rating: 4,
            comment: "Form áo thun rộng rãi thoải mái. Mình nặng 65kg mặc size L hơi dài tí nhưng phong cách oversize vẫn đẹp.",
            createdAt: new Date()
          },
          {
            productId: 1,
            userId: u1,
            rating: 5,
            comment: "Giao hàng nhanh, đóng gói cẩn thận. Shop tư vấn nhiệt tình, áo đẹp đúng mô tả.",
            createdAt: new Date()
          },
          {
            productId: 3,
            userId: u2,
            rating: 5,
            comment: "Quần jean ôm vừa chân, co giãn nhẹ nên ngồi thoải mái, màu xanh chàm bền đẹp không bị phai khi giặt.",
            createdAt: new Date()
          }
        ]);
        console.log("✓ Product reviews seeded.");
      } else {
        console.log("⚠️ No users found. Skipping reviews seeding.");
      }
    }

    console.log("✓ Seeding database completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding clothing store data:", error);
  }
};

module.exports = { seedProducts };
