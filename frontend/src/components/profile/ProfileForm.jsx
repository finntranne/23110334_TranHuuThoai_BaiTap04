import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateProfile,
  clearSuccessMessage,
  clearError
} from '../../redux/slices/profileSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector(state => state.profile);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    gender: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.full_name || '',
        phone: user.phoneNumber || user.phone || '',
        address: user.address || '',
        gender: user.gender === true || user.gender === 1 || user.gender === '1' ? '1' : user.gender === false || user.gender === 0 || user.gender === '0' ? '0' : ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    if (formData.address && formData.address.length < 5) {
      errors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    dispatch(updateProfile({
      full_name: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      gender: formData.gender === '1' ? true : formData.gender === '0' ? false : null
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-black text-neutral-900 border-b border-neutral-100 pb-3 uppercase tracking-wide">Chỉnh sửa hồ sơ cá nhân</h2>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => dispatch(clearError())}
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => dispatch(clearSuccessMessage())}
        />
      )}

      {/* Name */}
      <div>
        <Input
          label="Họ và tên"
          type="text"
          name="fullName"
          placeholder="Nhập họ và tên"
          value={formData.fullName}
          onChange={handleChange}
          error={validationErrors.fullName}
          required
        />
      </div>

      {/* Phone */}
      <div>
        <Input
          label="Số điện thoại"
          type="tel"
          name="phone"
          placeholder="Nhập số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          error={validationErrors.phone}
        />
        <p className="text-[11px] text-neutral-450 mt-1 font-semibold">Định dạng: 10 chữ số liên tục</p>
      </div>

      {/* Gender */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-neutral-455 uppercase tracking-wider mb-2">Giới tính</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-neutral-800 font-bold cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="1"
              checked={formData.gender === '1'}
              onChange={handleChange}
              className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300"
            />
            <span>Nam</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-800 font-bold cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="0"
              checked={formData.gender === '0'}
              onChange={handleChange}
              className="w-4 h-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300"
            />
            <span>Nữ</span>
          </label>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Địa chỉ giao hàng
        </label>
        <textarea
          name="address"
          placeholder="Nhập địa chỉ nhận hàng chi tiết"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className={`
            w-full px-4 py-2 border rounded text-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900
            transition-colors duration-200
            ${validationErrors.address ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:border-neutral-900'}
          `}
        />
        {validationErrors.address && (
          <p className="mt-1 text-xs text-red-500 font-semibold">{validationErrors.address}</p>
        )}
        <p className="text-[11px] text-neutral-450 mt-1 font-semibold">Tối thiểu 5 ký tự để đảm bảo giao hàng chính xác</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100">
        <Button
          type="submit"
          variant="primary"
          className="rounded px-5 py-2 text-xs font-bold uppercase tracking-wider"
          isLoading={loading}
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
