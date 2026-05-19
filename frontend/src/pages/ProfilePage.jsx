import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/slices/profileSlice';
import ProfileCard from '../components/profile/ProfileCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import Loading from '../components/common/Loading';

/**
 * Page Profile
 */
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {loading && !user ? (
          <Loading />
        ) : (
          <>
            <ProfileCard />
            <EditProfileModal />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
