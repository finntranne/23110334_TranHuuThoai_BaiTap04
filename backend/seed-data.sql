-- Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'Admin'),
(2, 'User');

-- Insert Users (Password: Learning@2026 -> Hash: $2a$10$N9qo8uLOickgx2ZMRZoMye4k0Dy8KVvJ6H7F1H6Fxqd4mHlP9e0vO)
INSERT INTO users (email, password, firstName, lastName, address, phoneNumber, gender, image, roleId, positionId, createdAt, updatedAt) VALUES
('ntha91.nvt@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye4k0Dy8KVvJ6H7F1H6Fxqd4mHlP9e0vO', 'Trường', 'Nguyễn', '123 Main Street, Ho Chi Minh City, Vietnam', '0912345678', 1, NULL, 1, 'admin', NOW(), NOW()),
('user1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye4k0Dy8KVvJ6H7F1H6Fxqd4mHlP9e0vO', 'John', 'Doe', '456 Oak Avenue, Ha Noi, Vietnam', '0987654321', 1, NULL, 2, 'developer', NOW(), NOW()),
('user2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye4k0Dy8KVvJ6H7F1H6Fxqd4mHlP9e0vO', 'Jane', 'Smith', '789 Pine Road, Da Nang, Vietnam', '0901234567', 0, NULL, 2, 'designer', NOW(), NOW()),
('user3@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye4k0Dy8KVvJ6H7F1H6Fxqd4mHlP9e0vO', 'Michael', 'Johnson', '321 Elm Street, Can Tho, Vietnam', '0923456789', 1, NULL, 2, 'tester', NOW(), NOW()),
('user4@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye4k0Dy8KVvJ6H7F1H6Fxqd4mHlP9e0vO', 'Sarah', 'Williams', '654 Maple Drive, Hai Phong, Vietnam', '0934567890', 0, NULL, 2, 'manager', NOW(), NOW());

-- Insert OTPs
INSERT INTO otps (code, userId, type, isUsed, expiresAt, createdAt) VALUES
('123456', 1, 'forgot_password', 0, DATE_ADD(NOW(), INTERVAL 15 MINUTE), NOW()),
('654321', 2, 'forgot_password', 0, DATE_ADD(NOW(), INTERVAL 15 MINUTE), NOW()),
('111111', 3, 'register', 0, DATE_ADD(NOW(), INTERVAL 15 MINUTE), NOW()),
('222222', 4, 'forgot_password', 0, DATE_ADD(NOW(), INTERVAL 15 MINUTE), NOW()),
('333333', 5, 'forgot_password', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- Insert Courses
INSERT INTO courses (id, title, description, price, slug, thumbnail, status, createdAt, updatedAt) VALUES
(1, 'Backend NodeJS 2026', '54 bài · Khai giảng 22/05/2026. Lịch học: T2, T4, T6 · 21h – 23h.', 7200000.00, 'backend-nodejs-2026', 'thumbnail1.png', 'published', NOW(), NOW()),
(2, 'Fullstack Web 2026', '92 bài · Khai giảng 04/04/2026. Lịch học: T3, T5, T7 · 19h – 21h.', 12800000.00, 'fullstack-web-2026', 'thumbnail2.png', 'published', NOW(), NOW()),
(3, 'C++ Cơ bản → Nâng cao', '40 bài · Tự học · Có OJ. Học bất cứ lúc nào.', 2850000.00, 'cpp-co-ban-nang-cao', 'thumbnail3.png', 'published', NOW(), NOW()),
(4, 'Java Hướng Đối Tượng', '40 bài · Khai giảng 25/05/2026. Lịch học: T3, T5, T6 · 21h – 23h.', 3000000.00, 'java-huong-doi-tuong', 'thumbnail4.png', 'published', NOW(), NOW()),
(5, 'Cơ Sở Dữ Liệu & SQL', '26 bài · Tự học · Có OJ. Học bất cứ lúc nào.', 2700000.00, 'co-so-du-lieu-sql', 'thumbnail5.png', 'published', NOW(), NOW()),
(6, 'Lập Trình Python AI/ML', '48 bài · Khai giảng 10/06/2026. Lịch học: T2, T4, T6 · 19h – 21h.', 5200000.00, 'lap-trinh-python-ai-ml', 'thumbnail6.png', 'published', NOW(), NOW()),
(7, 'ReactJS Từ Đầu', '35 bài · Tự học · Có bài tập. Học bất cứ lúc nào.', 3100000.00, 'reactjs-tu-dau', 'thumbnail7.png', 'published', NOW(), NOW()),
(8, 'DevOps & Docker', '30 bài · Khai giảng 15/06/2026. Lịch học: T3, T6 · 20h – 22h.', 4800000.00, 'devops-docker', 'thumbnail8.png', 'published', NOW(), NOW());

-- Insert Reviews
INSERT INTO reviews (id, courseId, userId, rating, comment, createdAt, updatedAt) VALUES
(1, 2, 2, 5, 'Khóa Fullstack Web của UTE Tech cực kỳ chất lượng. Thầy dạy chi tiết, có hỗ trợ 24/7 trên group. Sau 3 tháng mình đã làm được dự án thực tế.', NOW(), NOW()),
(2, 3, 3, 5, 'Mình học C++ ở đây từ zero, giờ đã pass được các bài thi OLP cấp trường. Hệ thống OJ rất tiện, submit bài là biết kết quả ngay.', NOW(), NOW()),
(3, 1, 4, 5, 'Học Backend NodeJS xong mình xin được intern ngay. Kiến thức rất thực chiến, không học lý thuyết suông. Cộng đồng UTE Tech cũng rất support.', NOW(), NOW());
