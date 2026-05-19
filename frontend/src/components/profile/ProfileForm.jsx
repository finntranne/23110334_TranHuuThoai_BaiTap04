import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateProfile,
  updateName,
  updatePhone,
  updateAddress,
  clearSuccessMessage,
  clearError
} from '../../redux/slices/profileSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

/**
 * Component form chỉnh sửa profile
 */
const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector(state => state.profile);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        phone: user.phone || '',
        address: user.address || ''
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
      address: formData.address
    }));
  };

  const handleQuickUpdate = (field, value) => {
    if (field === 'name') {
      dispatch(updateName(value));
    } else if (field === 'phone') {
      dispatch(updatePhone(value));
    } else if (field === 'address') {
      dispatch(updateAddress(value));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Chỉnh sửa hồ sơ</h2>

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
        <p className="text-xs text-gray-500 mt-1">Định dạng: 10 chữ số</p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ
        </label>
        <textarea
          name="address"
          placeholder="Nhập địa chỉ"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
            ${validationErrors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          `}
        />
        {validationErrors.address && (
          <p className="mt-1 text-sm text-red-500">{validationErrors.address}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Tối thiểu 5 ký tự</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          size="lg"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
