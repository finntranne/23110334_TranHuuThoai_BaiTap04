import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../services/productAPI";
import { toast } from "react-hot-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const SORTS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Bán chạy nhất", value: "best_selling" },
  { label: "Đánh giá cao nhất", value: "rating_desc" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
];

const RATINGS = [
  { label: "Tất cả đánh giá", value: 0 },
  { label: "4 sao trở lên (4.0+ ★)", value: 4 },
  { label: "3 sao trở lên (3.0+ ★)", value: 3 },
];

const STOCK_STATUSES = [
  { label: "Tất cả", value: "all" },
  { label: "Còn hàng", value: "true" },
  { label: "Hết hàng", value: "false" },
];

const ProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("Tất cả");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 9; // Coolmate standard grid works better with multiples of 3 (9 items)

  // Temporary Price Inputs
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");

  // Sync Search query from URL params (e.g. from Navbar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q !== null) {
      setSearch(q);
    }
  }, [location.search]);

  // Fetch Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res.data && res.data.success) {
          setCategories(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Fetch Products when filters or page changes
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search,
        categoryId,
        sort,
        page,
        limit,
        minRating: minRating > 0 ? minRating : undefined,
        inStock,
      };
      if (minPrice !== "") params.minPrice = minPrice;
      if (maxPrice !== "") params.maxPrice = maxPrice;

      const res = await fetchProducts(params);
      if (res.data && res.data.success) {
        const { products: list, total: tot } = res.data.data;
        setProducts(list || []);
        setTotalProducts(tot || 0);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, sort, page, minPrice, maxPrice, minRating, inStock]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryId, sort, minPrice, maxPrice, minRating, inStock]);

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("Tất cả");
    setTempMinPrice("");
    setTempMaxPrice("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setInStock("all");
    setSort("newest");
    setPage(1);
    toast.success("Đã xoá các bộ lọc!");
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
            className={`w-3.5 h-3.5 ${i < starsCount ? "fill-current" : "stroke-current fill-none"}`}
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

      {/* HEADER SECTION */}
      <div className="bg-neutral-50 py-10 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-wide">Bộ Sưu Tập Thời Trang</h1>
          <p className="text-sm text-neutral-550 max-w-xl mx-auto leading-relaxed">
            Thiết kế tối giản, chất liệu cotton organic co giãn bền bỉ mang lại sự thoáng mát tối đa.
          </p>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR: FILTERS */}
          <aside className="lg:col-span-1 space-y-6 bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="font-extrabold text-neutral-900 text-sm uppercase tracking-wide">Bộ lọc</h3>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-coolmateBlue hover:text-blue-700 transition-all uppercase"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Filter by Category */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-widest">Danh mục</label>
              <div className="space-y-1">
                <button
                  onClick={() => setCategoryId("Tất cả")}
                  className={`w-full text-left px-3 py-2 text-xs rounded font-bold transition-all flex items-center justify-between border ${
                    categoryId === "Tất cả"
                      ? "bg-neutral-100 text-coolmateBlue border-neutral-350"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-transparent"
                  }`}
                >
                  <span>Tất cả quần áo</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`w-full text-left px-3 py-2 text-xs rounded font-bold transition-all flex items-center justify-between border ${
                      Number(categoryId) === cat.id
                        ? "bg-neutral-100 text-coolmateBlue border-neutral-350"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-transparent"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Price Range */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-widest">Khoảng giá (VND)</label>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-neutral-50 focus:bg-white focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-neutral-50 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded text-xs transition-colors"
                >
                  Áp dụng
                </button>
              </form>
            </div>

            {/* Filter by Rating */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-widest">Đánh giá sao</label>
              <div className="space-y-1">
                {RATINGS.map((rat) => (
                  <button
                    key={rat.value}
                    onClick={() => setMinRating(rat.value)}
                    className={`w-full text-left px-3 py-2 text-xs rounded font-bold transition-colors border ${
                      minRating === rat.value
                        ? "text-coolmateBlue bg-neutral-100 border-neutral-350"
                        : "text-neutral-600 hover:bg-neutral-50 border-transparent"
                    }`}
                  >
                    {rat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Stock Status */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-neutral-800 uppercase tracking-widest">Trạng thái tồn kho</label>
              <div className="space-y-1">
                {STOCK_STATUSES.map((stk) => (
                  <button
                    key={stk.value}
                    onClick={() => setInStock(stk.value)}
                    className={`w-full text-left px-3 py-2 text-xs rounded font-bold transition-colors border ${
                      inStock === stk.value
                        ? "text-coolmateBlue bg-neutral-100 border-neutral-350"
                        : "text-neutral-600 hover:bg-neutral-50 border-transparent"
                    }`}
                  >
                    {stk.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* LIST & SEARCH CONTROLS */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Bar Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white p-4 rounded-lg border border-neutral-200">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhanh..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-neutral-250 bg-neutral-50 focus:bg-white focus:outline-none transition-all"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs text-neutral-500 font-bold uppercase tracking-wide">
                  {totalProducts} sản phẩm
                </span>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-450 font-bold hidden sm:inline uppercase">Sắp xếp:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold rounded border border-neutral-250 bg-neutral-50 text-neutral-700 outline-none cursor-pointer focus:bg-white transition-all"
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-coolmateBlue border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-neutral-500 font-medium animate-pulse">Đang tìm sản phẩm...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
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
                          {discount > 0 && (
                            <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-black bg-red-650 text-white rounded">
                              -{discount}%
                            </span>
                          )}
                          {product.isFeatured && discount === 0 && (
                            <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded">
                              HOT
                            </span>
                          )}
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-800 rounded">Hết Hàng</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <p className="text-xs text-neutral-400 font-semibold uppercase">{product.category?.name}</p>
                            <h3 className="font-bold text-neutral-800 group-hover:text-coolmateBlue transition-colors line-clamp-1 mt-1">
                              {product.name}
                            </h3>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              {product.salePrice ? (
                                <>
                                  <span className="text-red-655 font-black text-base">
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

                {/* PAGINATION */}
                <div className="flex items-center justify-center space-x-4 pt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border border-neutral-250 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Trang trước
                  </button>
                  <span className="text-xs font-bold text-neutral-500">
                    Trang {page} / {Math.ceil(totalProducts / limit) || 1}
                  </span>
                  <button
                    disabled={products.length < limit || page >= Math.ceil(totalProducts / limit)}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border border-neutral-250 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trang sau →
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-neutral-200 p-16 text-center text-neutral-450 space-y-3">
                <svg className="w-12 h-12 text-neutral-300 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p className="text-base font-bold text-neutral-800">Không tìm thấy sản phẩm nào!</p>
                <p className="text-xs text-neutral-400">Vui lòng điều chỉnh lại từ khóa hoặc các bộ lọc của bạn.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
