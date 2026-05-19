import React, { useState, useEffect, useCallback } from "react";
import "./HomePage.css"; // Dùng chung CSS với trang chủ
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchCourses } from "../services/courseAPI";

const FILTERS = ["Tất cả", "Zoom Live", "Video", "C++", "Web", "Backend", "Java", "Python"];

const SORTS = [
  { label: "Mới nhất",     value: "newest"     },
  { label: "Giá tăng dần", value: "price_asc"  },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Đánh giá cao", value: "rating_desc"},
  { label: "Phổ biến",     value: "popular"    },
];

const COURSE_STYLES = [
  { headerClass: "navy", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-55%", class: "home-badge-sale" }] },
  { headerClass: "blue", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-57%", class: "home-badge-sale" }] },
  { headerClass: "green", badges: [{ text: "VIDEO", class: "home-badge-video" }, { text: "-41%", class: "home-badge-sale" }] },
  { headerClass: "purple", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-50%", class: "home-badge-sale" }] },
  { headerClass: "teal", badges: [{ text: "VIDEO", class: "home-badge-video" }, { text: "-45%", class: "home-badge-sale" }] },
  { headerClass: "navy", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-48%", class: "home-badge-sale" }] },
  { headerClass: "blue", badges: [{ text: "VIDEO", class: "home-badge-video" }, { text: "-38%", class: "home-badge-sale" }] },
  { headerClass: "green", badges: [{ text: "ZOOM", class: "home-badge-zoom" }, { text: "-52%", class: "home-badge-sale" }] }
];

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

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

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

  // Reset về trang 1 khi filter/search thay đổi
  useEffect(() => { 
    setPage(1); 
  }, [search, category, sort]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCourses({ search, category, sort, page, limit: 8 });
      if (res.data && res.data.data) {
        const { courses: list, total: tot } = res.data.data;
        
        const formattedCourses = list.map((c, index) => {
          const style = COURSE_STYLES[index % COURSE_STYLES.length];
          return {
            id: c.id,
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

        setCourses(formattedCourses);
        setTotalCourses(tot);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => { 
    loadCourses(); 
  }, [loadCourses]);

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
          <Link to="/">Trang chủ</Link>
          <Link to="/courses" className="active">Khóa học</Link>
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

      {/* HEADER KHÓA HỌC */}
      <div style={{ padding: '120px 5% 40px', background: '#F8F9FA', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#1B2A4E', marginBottom: '16px', fontWeight: '800' }}>Khám Phá Khóa Học</h1>
        <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Nâng cao kỹ năng lập trình của bạn với các khóa học thực chiến từ đội ngũ giảng viên UTE Tech.
        </p>
      </div>

      <section className="home-section" style={{ paddingTop: '20px' }}>
        
        {/* COURSE CONTROLS: Search & Sort */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginBottom: '20px', padding: '0 5%' }}>
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Tìm theo tên khoá học..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '12px 16px 12px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', width: '100%', fontSize: '15px', outline: 'none' }}
            />
            <svg style={{ position: 'absolute', left: '12px', top: '14px', color: '#94A3B8' }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <select 
            value={sort} 
            onChange={e => setSort(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '15px', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* FILTER BAR: Categories */}
        <div className="home-filter-bar" style={{ justifyContent: 'center', marginBottom: '40px' }}>
          <span className="home-filter-label">Danh mục:</span>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`home-pill ${category === f ? 'active' : 'default'}`}
              onClick={() => setCategory(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* COURSE GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#85B7EB', fontSize: '18px' }}>Đang tải khóa học...</div>
        ) : courses.length > 0 ? (
          <>
            <div className="home-course-grid">
              {courses.map((course) => (
                <div key={course.id} className="home-course-card">
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

            {/* PAGINATION */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '50px' }}>
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className={page === 1 ? "home-btn-outline" : "home-btn-primary"}
                style={page === 1 ? { opacity: 0.5, cursor: 'not-allowed', padding: '10px 24px' } : { padding: '10px 24px' }}
              >
                ← Trang trước
              </button>
              <button 
                disabled={courses.length < 8} 
                onClick={() => setPage(p => p + 1)}
                className={courses.length < 8 ? "home-btn-outline" : "home-btn-primary"}
                style={courses.length < 8 ? { opacity: 0.5, cursor: 'not-allowed', padding: '10px 24px' } : { padding: '10px 24px' }}
              >
                Trang tiếp →
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontSize: '18px' }}>
            Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn.
          </div>
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

export default CoursesPage;