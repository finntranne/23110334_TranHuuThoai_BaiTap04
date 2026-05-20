import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
        
        {/* About & Contact */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 text-white">
            <span className="font-black text-2xl tracking-widest text-white uppercase font-mono">
              UTE<span className="text-white">STYLE</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-neutral-400">
            UTESTYLE - Giải pháp mua sắm thời trang tiện lợi trực tuyến dành cho mọi người. Tự hào mang đến dòng sản phẩm 100% Cotton chất lượng cao, bền bỉ và thoải mái.
          </p>
          <div className="space-y-1 text-xs text-neutral-400">
            <p>📞 Hotline: <span className="text-white font-bold hover:underline cursor-pointer">1900 2703</span> (8:30 - 22:00)</p>
            <p>✉️ Email: <span className="text-white font-bold hover:underline cursor-pointer">support@utestyle.vn</span></p>
          </div>
          <div className="flex space-x-3 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xs font-bold transition-all">FB</a>
            <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xs font-bold transition-all">IG</a>
            <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xs font-bold transition-all">YT</a>
            <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-xs font-bold transition-all">ZL</a>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-sm tracking-wider uppercase">Khám phá</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products" className="hover:text-white transition-colors">Áo Thun Năng Động</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Áo Polo Nam & Nữ</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Quần Shorts & Thể Thao</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Bộ Sưu Tập Mới Nhất</Link></li>
          </ul>
        </div>

        {/* Support Services */}
        <div className="space-y-4">
          <h4 className="text-white font-extrabold text-sm tracking-wider uppercase">Dịch vụ khách hàng</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật thanh toán</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách 60 ngày đổi trả miễn phí</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển siêu tốc</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Liên hệ bộ phận chăm sóc khách hàng</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-4">
        <p>© 2026 UTESTYLE. Trải nghiệm mua sắm đáng tin cậy.</p>
        <p>Thiết kế theo chuẩn phong cách tối giản và hiện đại.</p>
      </div>
    </footer>
  );
};

export default Footer;
