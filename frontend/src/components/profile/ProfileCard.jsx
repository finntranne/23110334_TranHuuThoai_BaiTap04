import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEditing } from '../../redux/slices/profileSlice';
import Button from '../common/Button';
import Loading from '../common/Loading';

const ProfileCard = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.profile);

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
        <p className="text-slate-500 font-medium">Không có thông tin profile</p>
      </div>
    );
  }

  const handleEditClick = () => {
    dispatch(setIsEditing(true));
  };

  const displayName = user.fullName || user.full_name || 'Chưa cập nhật';
  const displayEmail = user.email || 'Chưa cập nhật';
  const displayPhone = user.phoneNumber || user.phone || 'Chưa cập nhật';
  const displayAddress = user.address || 'Chưa cập nhật';
  const isUserAdmin = (user.roleId === 1 || user.role_id === 1);
  const isUserActive = (user.isVerified || user.is_active || user.isActive);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-neutral-100">
        <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wide">Hồ sơ cá nhân</h2>
        <Button
          variant="primary"
          onClick={handleEditClick}
          className="rounded px-5 py-2 text-xs font-bold uppercase tracking-wider"
        >
          Chỉnh sửa hồ sơ
        </Button>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center text-white text-4xl font-black shadow-inner overflow-hidden">
          {user.image ? (
            <img src={user.image} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.substring(0, 1).toUpperCase()
          )}
        </div>
        <p className="text-lg font-black text-neutral-800">{displayName}</p>
        <span className="inline-flex items-center px-3 py-1 rounded text-xs font-bold bg-neutral-100 text-neutral-900 border border-neutral-200">
          {isUserAdmin ? 'Quản trị viên' : 'Thành viên'}
        </span>
      </div>

      {/* Profile Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-450 uppercase tracking-wider">Họ và tên</label>
          <p className="text-sm text-neutral-800 font-bold">{displayName}</p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-455 uppercase tracking-wider">Email liên hệ</label>
          <p className="text-sm text-neutral-800 font-bold">{displayEmail}</p>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-455 uppercase tracking-wider">Số điện thoại</label>
          <p className="text-sm text-neutral-800 font-bold">{displayPhone}</p>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-455 uppercase tracking-wider">Trạng thái xác minh</label>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${
              isUserActive 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {isUserActive ? 'Đã xác minh' : 'Chưa xác minh'}
            </span>
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-455 uppercase tracking-wider">Giới tính</label>
          <p className="text-sm text-neutral-800 font-bold">
            {user.gender === true || user.gender === 1 || user.gender === '1' ? 'Nam' : user.gender === false || user.gender === 0 || user.gender === '0' ? 'Nữ' : 'Chưa cập nhật'}
          </p>
        </div>

        {/* Address */}
        <div className="md:col-span-2 space-y-1">
          <label className="block text-xs font-bold text-neutral-455 uppercase tracking-wider">Địa chỉ giao hàng</label>
          <p className="text-sm text-neutral-800 font-bold">{displayAddress}</p>
        </div>

        {/* Joined Date */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-455 uppercase tracking-wider">Ngày tham gia</label>
          <p className="text-sm text-neutral-800 font-bold">
            {user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
