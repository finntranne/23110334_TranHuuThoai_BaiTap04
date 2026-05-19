import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchCourses } from "../services/courseAPI";

// === STATIC UI DATA ===
const MOCK_STATS = [
  { id: 1, num: "3,000+", label: "Học viên" },
  { id: 2, num: "12+", label: "Khóa học" },
  { id: 3, num: "4.9 ★", label: "Đánh giá" },
  { id: 4, num: "UTE", label: "Đại học" },
];

const MOCK_REASONS = [
  {
    id: 1,
    icon: "🎓",
    iconClass: "blue",
    title: "Từ trường Đại học UTE",
    desc: "Giảng viên là thầy cô chính thức của Đại học Công nghệ Kỹ thuật TP.HCM, nhiều năm kinh nghiệm giảng dạy."
  },
  {
    id: 2,
    icon: "💻",
    iconClass: "green",
    title: "Thực hành OJ tự động",
    desc: "Hệ thống chấm bài tự động Online Judge giúp học viên luyện code và nhận phản hồi tức thì mọi lúc."
  },
  {
    id: 3,
    icon: "👥",
    iconClass: "purple",
    title: "Cộng đồng UTE lớn mạnh",
    desc: "Group Zalo, Discord kết nối 3,000+ học viên và alumni UTE hỗ trợ nhau trong học tập và việc làm."
  }
];

const COURSE_STYLES = [
  { headerClass: "navy", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-55%", class: "home-badge-sale" }] },
  { headerClass: "blue", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-57%", class: "home-badge-sale" }] },
  { headerClass: "green", badges: [{ text: "VIDEO", class: "home-badge-video" }, { text: "-41%", class: "home-badge-sale" }] },
  { headerClass: "purple", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-50%", class: "home-badge-sale" }] },
];

const AVATAR_COLORS = ["#185FA5", "#3B6D11", "#534AB7"];

const renderStars = (rating) => {
  let count = 5;
  if (typeof rating === 'number') {
    count = rating;
  } else if (typeof rating === 'string') {
    count = (rating.match(/★/g) || []).length;
  }
  return (
    <div className="home-star-rating-container" style={{ display: 'inline-flex', gap: '2px', color: '#EF9F27' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < count ? "#EF9F27" : "none"} stroke="#EF9F27" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // User Auth State
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.home-user-nav')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch Featured Courses (Lấy 4 khoá nổi bật)
  useEffect(() => {
    const loadFeaturedCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await fetchCourses({ page: 1, limit: 4, sort: "popular" });
        if (res.data && res.data.data && res.data.data.courses) {
          const list = res.data.data.courses;
          const formatted = list.map((c, index) => {
            const style = COURSE_STYLES[index % COURSE_STYLES.length];
            return {
              id: c.id,
              featured: index === 1,
              featuredLabel: index === 1 ? "⭐ Phổ biến nhất" : "",
              headerClass: style.headerClass,
              badges: style.badges,
              title: c.title,
              price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.price || 0),
              meta: c.description ? c.description.split('.')[0] : "",
              schedule: c.description ? c.description.split('.').slice(1).join('.').trim() : "",
              thumbnail: c.thumbnail,
              rating: "★★★★★",
              reviews: Math.floor(Math.random() * 200) + 50,
              oldPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((c.price || 0) * 2)
            };
          });
          setFeaturedCourses(formatted);
        }
      } catch (err) {
        console.error("Error fetching featured courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadFeaturedCourses();
  }, []);

  // Fetch Reviews
  useEffect(() => {
    const fetchReviewsData = async () => {
      setLoadingReviews(true);
      try {
        const response = await axios.get("http://localhost:3000/api/home-data");
        if (response.data.success) {
          const dbReviews = response.data.data.reviews;
          if (dbReviews && dbReviews.length > 0) {
            setReviews(dbReviews.map((r, index) => {
              const userObj = r.User || {};
              let name = "Học viên UTE";
              if (userObj.firstName && userObj.lastName) {
                name = `${userObj.lastName} ${userObj.firstName}`;
              } else if (userObj.fullName) {
                name = userObj.fullName;
              } else if (userObj.email) {
                const emailName = userObj.email.split('@')[0];
                name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
              }
              const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

              return {
                id: r.id,
                text: `"${r.comment}"`,
                stars: "★".repeat(r.rating || 5) + "☆".repeat(5 - (r.rating || 5)),
                name: name,
                avatar: avatar,
                avatarBg: AVATAR_COLORS[index % AVATAR_COLORS.length],
                role: "Sinh viên CNTT — UTE"
              };
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching reviews data:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviewsData();
  }, []);

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <nav className="home-navbar">
        <Link to="/" className="home-navbar-logo" style={{ textDecoration: 'none' }}>
          <div className="home-logo-box">UTE</div>
          <div>
            <div className="home-logo-text">UTE Tech</div>
            <div className="home-logo-sub">Learn. Build. Grow.</div>
          </div>
        </Link>

        <div className="home-navbar-links">
          <Link to="/" className="active">Trang chủ</Link>
          <Link to="/courses">Khóa học</Link>
          <a href="#blog">Blog</a>
          <a href="#tutorial">Tutorial</a>
        </div>

        <div className="home-user-nav" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <div className="home-nav-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span className="home-nav-badge">24</span>
              </div>
              <div className="home-nav-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  className="home-user-avatar-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <div className="home-user-avatar">
                    {user?.image ? (
                      <img src={user.image} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      (user?.fullName || user?.email || "User").substring(0, 1).toUpperCase()
                    )}
                  </div>
                  <svg className="home-user-chevron" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>

                {isDropdownOpen && (
                  <div className="home-dropdown-menu">
                    <Link to="/profile" className="home-dropdown-item">Thông tin cá nhân</Link>
                    <div className="home-dropdown-divider"></div>
                    <button onClick={handleLogout} className="home-dropdown-item">Đăng xuất</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="home-btn-outline" style={{ textDecoration: 'none', padding: '7px 18px', fontSize: '13px', fontWeight: '500' }}>
                Đăng nhập
              </Link>
              <Link to="/register" className="home-btn-contact" style={{ textDecoration: 'none' }}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-label">Đại học Công nghệ Kỹ thuật TP.HCM</div>
          <h1 className="home-hero-title">
            UTE Tech — Học lập trình<br />
            <span>chất lượng cao</span><br />
            cùng cộng đồng UTE
          </h1>
          <p className="home-hero-desc">
            Nền tảng khóa học lập trình dành cho sinh viên Đại học Công nghệ Kỹ thuật và cộng đồng lập trình viên Việt Nam. Học với giảng viên thực chiến, chấm bài tự động OJ.
          </p>
          <div className="home-hero-cta">
            <Link to="/courses" className="home-btn-primary" style={{ textDecoration: 'none' }}>Xem Khóa Học</Link>
            <button className="home-btn-outline">Liên hệ Zalo</button>
          </div>

          <div className="home-hero-stats">
            {MOCK_STATS.map((stat) => (
              <div key={stat.id}>
                <div className="home-stat-num">{stat.num}</div>
                <div className="home-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-hero-icon">🎓</div>
          <div className="home-hero-icon-label">UTE Tech Platform</div>
        </div>
      </section>

      {/* COURSES SECTION (Featured only) */}
      <section className="home-section">
        <h2 className="home-section-title">Khóa Học Nổi Bật</h2>
        
        {loadingCourses ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#85B7EB' }}>Đang tải khóa học...</div>
        ) : featuredCourses.length > 0 ? (
          <>
            <div className="home-course-grid">
              {featuredCourses.map((course) => (
                <div key={course.id} className={`home-course-card ${course.featured ? 'featured' : ''}`}>
                  {course.featured && (
                    <div className="home-featured-label">{course.featuredLabel}</div>
                  )}

                  <div
                    className={`home-card-header ${course.headerClass}`}
                    style={course.thumbnail ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(/images/courses/${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  >
                    <div className="home-card-badges">
                      {course.badges.map((badge, index) => (
                        <span key={index} className={`home-badge ${badge.class}`}>
                          {badge.text}
                        </span>
                      ))}
                    </div>
                    <div className="home-card-title-text">{course.title}</div>
                  </div>

                  <div className="home-card-body">
                    <div className="home-card-meta">{course.meta}</div>
                    <div className="home-card-schedule">{course.schedule}</div>
                    <div className="home-card-rating">
                      {renderStars(course.rating)} <span>({course.reviews})</span>
                    </div>
                    <div className="home-card-price">
                      {course.price}
                      <span className="home-card-price-old">{course.oldPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/courses" className="home-btn-outline" style={{ textDecoration: 'none', padding: '12px 32px', fontSize: '15px' }}>
                Xem tất cả khóa học →
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#85B7EB' }}>Chưa có khóa học nào.</div>
        )}
      </section>

      {/* WHY */}
      <section className="home-why-section">
        <h2 className="home-section-title">Tại sao chọn UTE Tech?</h2>
        <div className="home-why-grid">
          {MOCK_REASONS.map((reason) => (
            <div key={reason.id} className="home-why-card">
              <div className={`home-why-icon ${reason.iconClass}`}>{reason.icon}</div>
              <div className="home-why-title">{reason.title}</div>
              <div className="home-why-desc">{reason.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="home-testimonial-section">
        <h2 className="home-section-title">Học viên nói gì về UTE Tech?</h2>
        {loadingReviews ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#85B7EB' }}>Đang tải đánh giá...</div>
        ) : reviews.length > 0 ? (
          <div className="home-testimonial-grid">
            {reviews.map((testi) => (
              <div key={testi.id} className="home-testi-card">
                <div className="home-testi-stars">{renderStars(testi.stars)}</div>
                <p className="home-testi-text">{testi.text}</p>
                <div className="home-testi-author">
                  <div className="home-testi-avatar" style={{ background: testi.avatarBg }}>
                    {testi.avatar}
                  </div>
                  <div>
                    <div className="home-testi-name">{testi.name}</div>
                    <div className="home-testi-role">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#85B7EB' }}>Chưa có đánh giá nào.</div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer-left">
          <div className="home-footer-logo">
            <div className="home-logo-box">UTE</div>
            <div className="home-logo-text">UTE Tech</div>
          </div>
          <div className="home-footer-desc">Nền tảng học lập trình của cộng đồng Đại học Công nghệ Kỹ thuật TP.HCM.</div>
          <div className="home-footer-social">
            <div className="home-social-icon">YT</div>
            <div className="home-social-icon">FB</div>
            <div className="home-social-icon">DC</div>
            <div className="home-social-icon">ZL</div>
          </div>
          <div className="home-footer-copy">© 2026 UTE Tech. All rights reserved.</div>
        </div>
        <div className="home-footer-links-container">
          <div className="home-footer-links-col">
            <h4>Khóa Học</h4>
            <Link to="/courses">Khóa học Zoom</Link>
            <Link to="/courses">Khóa học Video</Link>
            <a href="#blog">Blog</a>
            <a href="#tutorial">Tutorial</a>
          </div>
          <div className="home-footer-links-col">
            <h4>Hỗ Trợ</h4>
            <a href="#about">Về chúng tôi</a>
            <a href="#policy">Chính sách</a>
            <a href="#support">Hỗ trợ</a>
            <a href="#contact">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;