import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/slices/profileSlice';
import ProfileCard from '../components/profile/ProfileCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import Loading from '../components/common/Loading';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans antialiased flex flex-col justify-between">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HEADER */}
      <div className="bg-neutral-50 py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wide">Hồ Sơ Thành Viên</h1>
          <p className="text-xs text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Xem và chỉnh sửa thông tin cá nhân, cập nhật thông tin tài khoản thành viên của bạn.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {loading && !user ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-coolmateBlue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-neutral-500 text-xs font-bold uppercase tracking-wider animate-pulse">Đang tải hồ sơ thành viên...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <ProfileCard />
            <EditProfileModal />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
