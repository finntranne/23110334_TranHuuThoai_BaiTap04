import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../services/productAPI";
import { toast } from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery Swiper State
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Quantity selector
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(id);
        if (res.data && res.data.success) {
          const { product: prod, similarProducts: similar } = res.data.data;
          setProduct(prod);
          setReviews(prod.reviews || []);
          setSimilarProducts(similar || []);
          
          // Setup Images for Swiper
          const gallery = [];
          if (prod.thumbnail) {
            gallery.push({ imageUrl: prod.thumbnail });
          }
          if (prod.images && prod.images.length > 0) {
            prod.images.forEach(img => {
              if (img.imageUrl !== prod.thumbnail) {
                gallery.push(img);
              }
            });
          }
          if (gallery.length === 0) {
            gallery.push({ imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800" });
          }
          setImages(gallery);
          setActiveImgIndex(0);
          setQuantity(1);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        toast.error("Không thể tải chi tiết sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [id]);

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handleIncreaseQty = () => {
    if (!product) return;
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    } else {
      toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
    }
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderStars = (rating) => {
    const starsCount = Math.round(rating);
    return (
      <div className="flex gap-0.5 text-amber-500">
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

  const getStockLabel = (stock) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-750 border border-rose-150">
          ❌ Hết hàng
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-750 border border-amber-150 animate-pulse">
          ⚠️ Sắp hết hàng (Chỉ còn {stock} sản phẩm)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-250">
        ✓ Còn hàng ({stock} sản phẩm)
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans antialiased flex flex-col justify-between">
      
      {/* NAVBAR */}
      <Navbar />

      {/* DETAILED CONTENT */}
      {loading ? (
        <div className="max-w-7xl mx-auto py-32 px-4 flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 border-4 border-coolmateBlue border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-neutral-450 font-medium animate-pulse">Đang tải chi tiết sản phẩm thời trang...</p>
        </div>
      ) : !product ? (
        <div className="max-w-7xl mx-auto py-32 px-4 text-center space-y-4 flex-1">
          <h2 className="text-xl font-bold text-neutral-900 uppercase">Không tìm thấy sản phẩm!</h2>
          <Link to="/products" className="inline-block px-6 py-2.5 bg-coolmateBlue text-white font-bold rounded">
            Quay lại trang sản phẩm
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 flex-1 animate-in fade-in duration-300">
          
          {/* Breadcrumbs */}
          <nav className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-2">
            <Link to="/" className="hover:text-coolmateBlue transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-coolmateBlue transition-colors">Sản phẩm</Link>
            <span>/</span>
            <span className="text-neutral-800 font-black max-w-[200px] truncate">{product.name}</span>
          </nav>

          {/* Product Detail Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 sm:p-8 rounded-lg border border-neutral-200">
            
            {/* 1. Custom Gallery Swiper */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              {/* Main Image View */}
              <div className="relative aspect-[4/5] bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center group shadow-inner">
                <img
                  src={images[activeImgIndex]?.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover select-none transition-all duration-300"
                />

                {images.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                )}

                {images.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-neutral-900/35 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImgIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          activeImgIndex === i ? "bg-white w-3" : "bg-white/50"
                        }`}
                      ></button>
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImgIndex(i)}
                      className={`aspect-[4/5] rounded overflow-hidden border bg-neutral-50 transition-all ${
                        activeImgIndex === i
                          ? "border-coolmateBlue shadow-sm scale-95"
                          : "border-neutral-200 hover:border-neutral-350"
                      }`}
                    >
                      <img src={img.imageUrl} alt={`thumbnail-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Product Info & Buy Controls */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-neutral-100 text-coolmateBlue text-[11px] font-bold rounded uppercase tracking-wider border border-neutral-200">
                    {product.category?.name}
                  </span>
                  <span className="text-xs text-neutral-400 font-semibold uppercase">
                    Mã sản phẩm: #{product.id}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight uppercase">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-6 text-sm py-1 border-y border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    {renderStars(product.rating)}
                    <span className="font-bold text-neutral-800">{product.rating}</span>
                    <span className="text-neutral-400">({product.reviewCount} đánh giá)</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-200"></div>
                  <div className="text-neutral-550 font-medium">
                    Số lượng đã bán: <span className="font-bold text-neutral-800">{product.sold}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-neutral-50 rounded border border-neutral-200 space-y-3">
                <div className="flex items-baseline space-x-4">
                  {product.salePrice ? (
                    <>
                      <span className="text-3xl font-black text-red-650">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-base text-neutral-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-neutral-800">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs pt-1">
                  <span className="text-neutral-500 font-bold uppercase">Tình trạng:</span>
                  {getStockLabel(product.stock)}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-neutral-850 text-xs uppercase tracking-wider">Mô tả sản phẩm:</h3>
                <p className="text-sm text-neutral-550 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-neutral-200 text-xs">
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-450 font-semibold">Chất liệu</span>
                  <span className="text-neutral-800 font-bold">100% Cotton Premium</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-450 font-semibold">Kiểu dáng</span>
                  <span className="text-neutral-800 font-bold">Regular Fit</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-450 font-semibold">Xuất xứ</span>
                  <span className="text-neutral-800 font-bold">Việt Nam</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span className="text-neutral-450 font-semibold">Thương hiệu</span>
                  <span className="text-neutral-800 font-bold">Coolmate Standard</span>
                </div>
              </div>

              {product.stock > 0 && (
                <div className="space-y-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-bold text-neutral-650 uppercase">Số lượng:</span>
                    
                    <div className="flex items-center border border-neutral-300 rounded overflow-hidden bg-white h-10">
                      <button
                        onClick={handleDecreaseQty}
                        className="px-3 h-full hover:bg-neutral-50 text-neutral-600 font-bold text-lg transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        readOnly
                        value={quantity}
                        className="w-12 text-center text-sm font-bold text-neutral-800 focus:outline-none"
                      />
                      <button
                        onClick={handleIncreaseQty}
                        className="px-3 h-full hover:bg-neutral-50 text-neutral-600 font-bold text-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold rounded transition-all text-center flex items-center justify-center gap-2 h-12 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 bg-coolmateBlue hover:bg-blue-750 text-white font-bold rounded shadow transition-all text-center flex items-center justify-center h-12 text-sm"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List Widget */}
          <div className="space-y-6 bg-white p-6 sm:p-8 rounded-lg border border-neutral-200">
            <h2 className="text-lg font-black text-neutral-900 border-b border-neutral-100 pb-4 uppercase">
              Đánh Giá Thực Tế ({reviews.length})
            </h2>

            {reviews.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {reviews.map(review => {
                  const reviewerName = review.User?.fullName || review.User?.email?.split('@')[0] || "Khách hàng";
                  const avatarLetter = reviewerName.substring(0, 1).toUpperCase();
                  return (
                    <div key={review.id} className="py-5 first:pt-0 last:pb-0 flex space-x-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold overflow-hidden shadow-inner flex-shrink-0">
                        {review.User?.image ? (
                          <img src={review.User.image} alt={reviewerName} className="w-full h-full object-cover" />
                        ) : (
                          avatarLetter
                        )}
                      </div>
                      
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-neutral-800 text-sm">{reviewerName}</p>
                          <span className="text-[10px] text-neutral-400 font-semibold">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        {renderStars(review.rating)}
                        <p className="text-neutral-600 text-sm leading-relaxed mt-1">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-neutral-450 py-10">Chưa có đánh giá nào cho sản phẩm này. Hãy mua hàng và để lại đánh giá đầu tiên!</div>
            )}
          </div>

          {/* SIMILAR PRODUCTS SECTION */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-neutral-900 uppercase">Sản phẩm tương tự cùng danh mục</h2>
            
            {similarProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map(product => {
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group bg-white rounded-lg border border-neutral-200 hover:border-neutral-350 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="aspect-[4/5] bg-neutral-50 relative overflow-hidden">
                        <img
                          src={product.thumbnail || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-850 rounded">Hết Hàng</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <h3 className="font-bold text-neutral-850 group-hover:text-coolmateBlue transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            {product.salePrice ? (
                              <>
                                <span className="text-red-650 font-black text-sm">
                                  {formatPrice(product.salePrice)}
                                </span>
                                <span className="text-[10px] text-neutral-400 line-through">
                                  {formatPrice(product.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-neutral-800 font-bold text-sm">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                            <div className="flex items-center gap-0.5">
                              {renderStars(product.rating)}
                            </div>
                            <span>Đã bán {product.sold}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-neutral-450 bg-white border border-neutral-200 py-10 rounded-lg">Không có sản phẩm tương tự.</div>
            )}
          </section>

        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
