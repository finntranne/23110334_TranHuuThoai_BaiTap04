import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    toast.success("Đăng xuất thành công!");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/products`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full z-50 relative bg-white">
      {/* Top Banner (Promo Bar) */}
      <div className="bg-neutral-900 text-white text-[10px] sm:text-xs py-2 px-4 text-center font-semibold tracking-wide flex justify-center items-center gap-6 overflow-hidden select-none">
        <span className="flex items-center gap-1.5 uppercase font-bold text-coolmateBlue animate-pulse">
          ⚡ FREESHIP ĐƠN TỪ 200K
        </span>
        <span className="hidden sm:inline text-neutral-600">|</span>
        <span className="hidden sm:inline uppercase">
          60 NGÀY ĐỔI TRẢ MIỄN PHÍ VÌ BẤT KỲ LÝ DO GÌ
        </span>
      </div>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <span className="font-black text-xl sm:text-2xl tracking-widest text-black uppercase font-mono">
              UTE<span className="text-neutral-900">STYLE</span>
            </span>
          </Link>

          {/* Links (Centered) */}
          <div className="hidden lg:flex items-center space-x-8 font-bold text-sm tracking-wide text-neutral-800 uppercase">
            <Link
              to="/"
              className={`relative py-2 transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 hover:before:w-full before:bg-coolmateBlue before:transition-all before:duration-300 ${
                isActive("/") ? "text-coolmateBlue before:w-full" : "hover:text-black"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className={`relative py-2 transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 hover:before:w-full before:bg-coolmateBlue before:transition-all before:duration-300 ${
                isActive("/products") || location.pathname.startsWith("/products/")
                  ? "text-coolmateBlue before:w-full"
                  : "hover:text-black"
              }`}
            >
              Sản phẩm
            </Link>
            <Link
              to="/profile"
              className={`relative py-2 transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 hover:before:w-full before:bg-coolmateBlue before:transition-all before:duration-300 ${
                isActive("/profile") ? "text-coolmateBlue before:w-full" : "hover:text-black"
              }`}
            >
              Hồ sơ cá nhân
            </Link>
          </div>

          {/* Search bar inside navbar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-100 focus:bg-white text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 rounded-full pl-5 pr-10 py-2 sm:py-2.5 border border-transparent focus:border-neutral-200 focus:outline-none transition-all"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
              <svg className="w-4 h-4 sm:w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.3-4.3"></path>
              </svg>
            </button>
          </form>

          {/* User Nav / Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 user-dropdown-container flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-50">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1.5 focus:outline-none rounded-full p-1 transition-all border border-transparent hover:border-neutral-200 bg-neutral-50/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm overflow-hidden">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (user?.fullName || user?.email || "U")
                          .substring(0, 1)
                          .toUpperCase()
                      )}
                    </div>
                    <span className="hidden sm:inline text-xs sm:text-sm font-bold text-neutral-800 max-w-[100px] truncate">
                      {user?.fullName || "Thành viên"}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-[9px] text-neutral-450 font-black uppercase tracking-wider">
                          Tài khoản thành viên
                        </p>
                        <p className="text-sm font-extrabold text-neutral-800 truncate">
                          {user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-coolmateBlue font-semibold mt-1">
                          Vai trò: {user?.roleId === 1 ? "Admin" : "Thành viên"}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-neutral-750 hover:bg-neutral-50 hover:text-coolmateBlue transition-colors font-medium"
                      >
                        Thông tin cá nhân
                      </Link>
                      <div className="border-t border-neutral-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-bold"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-3">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-neutral-750 hover:text-black transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-black hover:bg-neutral-800 rounded-full transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
