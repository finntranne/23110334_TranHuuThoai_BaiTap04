import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchHomeData } from "../services/productAPI";
import { toast } from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const HomePage = () => {
  const [promoProducts, setPromoProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
      tag: "BST MÙA HÈ 2026 • HOT TREND",
      title: "Phong Cách Tự Tin",
      highlightTitle: "Định Hình Cá Tính",
      subtitle: "Khám phá bộ sưu tập thời trang thiết kế độc quyền tại UTESTYLE. Chất liệu cotton cao cấp, thoáng mát, giúp bạn tỏa sáng mỗi ngày.",
      promoCode: "UTE10",
      promoDesc: "Ưu đãi thành viên mới",
      promoHeading: "Giảm thêm 10% cho đơn hàng đầu tiên!",
      btnLink: "/products",
      btnText: "Mua Ngay BST Mới"
    },
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600",
      tag: "BST THU ĐÔNG • NEW ARRIVALS",
      title: "Thanh Lịch Tự Nhiên",
      highlightTitle: "Tỏa Sáng Khí Chất",
      subtitle: "Sự kết hợp hoàn hảo giữa thiết kế tối giản hiện đại và chất liệu len dệt cao cấp mềm mại cho những ngày se lạnh.",
      promoCode: "WINTER15",
      promoDesc: "Bộ sưu tập mùa lạnh",
      promoHeading: "Giảm ngay 15% cho tất cả dòng áo khoác!",
      btnLink: "/products",
      btnText: "Khám Phá Áo Ấm"
    },
    {
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600",
      tag: "SẢN PHẨM BÁN CHẠY • BEST SELLERS",
      title: "Khẳng Định Vẻ Đẹp",
      highlightTitle: "Thời Thượng Độc Bản",
      subtitle: "Được săn đón nhiều nhất bởi các tín đồ thời trang. Đặt mua hôm nay để nhận thêm nhiều quà tặng đi kèm.",
      promoCode: "FREESHIP",
      promoDesc: "Ưu đãi vận chuyển",
      promoHeading: "Miễn phí vận chuyển toàn quốc cho đơn từ 500k!",
      btnLink: "/products",
      btnText: "Xem Ngay Best Sellers"
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const res = await fetchHomeData();
        if (res.data && res.data.success) {
          const { promoProducts, newestProducts, bestSellingProducts, reviews } = res.data.data;
          setPromoProducts(promoProducts || []);
          setNewestProducts(newestProducts || []);
          setBestSellingProducts(bestSellingProducts || []);
          setReviews(reviews || []);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        toast.error("Không thể kết nối máy chủ để tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderStars = (rating) => {
    const starsCount = Math.round(rating);
    return (
      <div className="flex gap-1 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < starsCount ? "fill-current" : "stroke-current fill-none"}`}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans antialiased flex flex-col justify-between">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO BANNER SECTION - FULL BLEED SLIDER */}
      <section className="relative w-full overflow-hidden h-[480px] sm:h-[560px] md:h-[620px] bg-neutral-900 select-none">
        
        {/* Slides */}
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Scale Animation */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-[center_35%] transform transition-transform duration-[6000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-900/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent"></div>
              </div>

              {/* Slide Content Container */}
              <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-20 flex items-center">
                <div className="w-full py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  
                  {/* Text Content */}
                  <div className={`space-y-5 sm:space-y-6 max-w-2xl text-left transition-all duration-700 delay-300 transform ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold bg-white/10 text-white backdrop-blur-md border border-white/15 tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-550 animate-ping"></span>
                      {slide.tag}
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                      {slide.title}<br />
                      <span className="text-white">
                        {slide.highlightTitle}
                      </span>
                    </h1>
                    
                    <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-lg font-medium">
                      {slide.subtitle}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        to={slide.btnLink}
                        className="px-8 py-3.5 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded transition-all text-sm text-center"
                      >
                        {slide.btnText}
                      </Link>
                      <a
                        href="#promo"
                        className="px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded border border-white/20 hover:border-white/30 backdrop-blur-md transition-all text-sm text-center"
                      >
                        Săn Deal Hot
                      </a>
                    </div>
                  </div>

                  {/* Promo Badge */}
                  <div className={`relative self-stretch md:self-auto flex items-end md:items-center justify-start md:justify-center transition-all duration-700 delay-500 transform ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}>
                    <div className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-xs space-y-4 text-white hover:border-white/30 transition-all group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center text-lg">
                          🏷️
                        </div>
                        <span className="px-2.5 py-0.5 rounded bg-red-650 text-[10px] font-black tracking-wider uppercase">
                          Mã: {slide.promoCode}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider">{slide.promoDesc}</p>
                        <p className="text-lg font-extrabold text-white leading-tight group-hover:text-white transition-colors">
                          {slide.promoHeading}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-neutral-300 font-semibold">
                        <span>Hạn dùng: 31/12</span>
                        <span className="text-white hover:underline cursor-pointer flex items-center gap-1">
                          Nhận mã
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 border border-white/10 text-white flex items-center justify-center backdrop-blur-sm transition-all active:scale-95 group"
          aria-label="Previous Slide"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 border border-white/10 text-white flex items-center justify-center backdrop-blur-sm transition-all active:scale-95 group"
          aria-label="Next Slide"
        >
          <svg className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Navigation Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeSlide ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </section>

      {/* BODY CONTENT */}
      {loading ? (
        <div className="max-w-7xl mx-auto py-24 px-4 flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-400 font-medium animate-pulse">Đang tải sản phẩm thời trang...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 flex-1">
          
          {/* SECTION 1: PROMOTIONS */}
          <section id="promo" className="space-y-6 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-red-650 text-xs font-bold uppercase tracking-widest">Ưu đãi độc quyền</span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase mt-1 flex items-center gap-2">
                  Khuyến Mãi Hot 🔥
                </h2>
              </div>
              <Link to="/products" className="text-sm font-bold text-neutral-900 hover:text-black flex items-center group">
                Xem tất cả ưu đãi 
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map(product => {
                const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
                      <img
                        src={product.thumbnail || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-black bg-red-600 text-white rounded">
                        -{discount}%
                      </span>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-800 rounded">Hết Hàng</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase">{product.category?.name}</p>
                        <h3 className="font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors line-clamp-1 mt-1">
                          {product.name}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-red-650 font-black text-base">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-100">
                          <div className="flex items-center gap-1">
                            {renderStars(product.rating)}
                            <span className="text-[10px] font-semibold text-neutral-500">({product.reviewCount})</span>
                          </div>
                          <span>Đã bán {product.sold}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: NEW ARRIVALS */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-neutral-900 text-xs font-bold uppercase tracking-widest">Bắt kịp xu hướng</span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase mt-1 flex items-center gap-2">
                  Bộ Sưu Tập Mới Nhất ✨
                </h2>
              </div>
              <Link to="/products" className="text-sm font-bold text-neutral-900 hover:text-black flex items-center group">
                Xem tất cả hàng mới
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newestProducts.map(product => {
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
                      <img
                        src={product.thumbnail || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold bg-neutral-900 text-white rounded">
                        MỚI
                      </span>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-800 rounded">Hết Hàng</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase">{product.category?.name}</p>
                        <h3 className="font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors line-clamp-1 mt-1">
                          {product.name}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          {product.salePrice ? (
                            <>
                              <span className="text-red-650 font-black text-base">
                                {formatPrice(product.salePrice)}
                              </span>
                              <span className="text-xs text-neutral-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-neutral-800 font-black text-base">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-100">
                          <div className="flex items-center gap-1">
                            {renderStars(product.rating)}
                            <span className="text-[10px] font-semibold text-neutral-500">({product.reviewCount})</span>
                          </div>
                          <span>Đã bán {product.sold}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: BEST SELLERS */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Được yêu thích nhất</span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase mt-1 flex items-center gap-2">
                  Bán Chạy Nhất 🏆
                </h2>
              </div>
              <Link to="/products" className="text-sm font-bold text-neutral-900 hover:text-black flex items-center group">
                Xem tất cả bán chạy
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellingProducts.map(product => {
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-lg border border-neutral-200 hover:border-neutral-350 shadow-sm hover:shadow-md transition-all duration-350 overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
                      <img
                        src={product.thumbnail || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded">
                        BEST
                      </span>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-800 rounded">Hết Hàng</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-xs text-neutral-400 font-semibold uppercase">{product.category?.name}</p>
                        <h3 className="font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors line-clamp-1 mt-1">
                          {product.name}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          {product.salePrice ? (
                            <>
                              <span className="text-red-650 font-black text-base">
                                {formatPrice(product.salePrice)}
                              </span>
                              <span className="text-xs text-neutral-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-neutral-800 font-black text-base">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-100">
                          <div className="flex items-center gap-1">
                            {renderStars(product.rating)}
                            <span className="text-[10px] font-semibold text-neutral-500">({product.reviewCount})</span>
                          </div>
                          <span>Đã bán {product.sold}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: TESTIMONIALS */}
          <section className="space-y-6 bg-neutral-50 py-12 px-6 rounded-xl border border-neutral-200">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-neutral-900 text-xs font-bold uppercase tracking-widest">Khách hàng tin tưởng</span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase">Phản Hồi Từ Khách Hàng ❤️</h2>
              <p className="text-sm text-neutral-500">Chúng tôi luôn nỗ lực mang đến những trải nghiệm chất lượng nhất cho bạn.</p>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map(review => {
                  const reviewerName = review.User?.fullName || review.User?.email?.split('@')[0] || "Khách hàng";
                  const avatarLetter = reviewerName.substring(0, 1).toUpperCase();
                  return (
                    <div key={review.id} className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        {renderStars(review.rating)}
                        <p className="text-neutral-650 text-sm italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 pt-2 border-t border-neutral-100">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold overflow-hidden shadow-inner flex-shrink-0">
                          {review.User?.image ? (
                            <img src={review.User.image} alt={reviewerName} className="w-full h-full object-cover" />
                          ) : (
                            avatarLetter
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-800 text-sm">{reviewerName}</p>
                          <p className="text-[11px] text-neutral-900 font-semibold truncate max-w-[180px]">Mua sản phẩm: {review.product?.name}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-neutral-450 py-12">Chưa có đánh giá nào từ khách hàng.</div>
            )}
          </section>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default HomePage;