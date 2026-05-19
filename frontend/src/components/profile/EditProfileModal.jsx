import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEditing } from '../../redux/slices/profileSlice';
import Modal from '../common/Modal';
import ProfileForm from './ProfileForm';

/**
 * Component Modal để chỉnh sửa profile
 */
const EditProfileModal = () => {
  const dispatch = useDispatch();
  const { isEditing } = useSelector(state => state.profile);

  const handleClose = () => {
    dispatch(setIsEditing(false));
  };

  return (
    <Modal
      isOpen={isEditing}
      onClose={handleClose}
      title="Chỉnh sửa hồ sơ cá nhân"
      size="lg"
    >
      <ProfileForm />
    </Modal>
  );
};

export default EditProfileModal;
