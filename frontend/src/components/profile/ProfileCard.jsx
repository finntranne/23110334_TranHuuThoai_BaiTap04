import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEditing } from '../../redux/slices/profileSlice';
import Button from '../common/Button';
import Loading from '../common/Loading';

/**
 * Component hiển thị thông tin profile
 */
const ProfileCard = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.profile);

  if (loading && !user) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Không có thông tin profile</p>
      </div>
    );
  }

  const handleEditClick = () => {
    dispatch(setIsEditing(true));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h2>
        <Button
          variant="primary"
          onClick={handleEditClick}
        >
          Chỉnh sửa
        </Button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>

      {/* Profile Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Họ và tên
          </label>
          <p className="text-lg text-gray-900 font-semibold">
            {user.full_name || 'Chưa cập nhật'}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <p className="text-lg text-gray-900 font-semibold">
            {user.email}
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Số điện thoại
          </label>
          <p className="text-lg text-gray-900 font-semibold">
            {user.phone || 'Chưa cập nhật'}
          </p>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Vai trò
          </label>
          <p className="text-lg text-gray-900 font-semibold">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {user.role_id === 1 ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </p>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Địa chỉ
          </label>
          <p className="text-lg text-gray-900 font-semibold">
            {user.address || 'Chưa cập nhật'}
          </p>
        </div>

        {/* Joined Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Ngày đăng ký
          </label>
          <p className="text-lg text-gray-900 font-semibold">
            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Trạng thái
          </label>
          <p className="text-lg text-gray-900 font-semibold">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
