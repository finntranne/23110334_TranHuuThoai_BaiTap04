import api from "./api";

export const profileAPI = {
  // Get profile
  getProfile: async () => {
    const response = await api.get("/profile");

    return response.data;
  },

  // Update full profile
  updateProfile: async (data) => {
    const response = await api.put("/profile", data);

    return response.data;
  },

  // Update name
  updateName: async (fullName) => {
    const response = await api.patch(
      "/profile/name",
      {
        full_name: fullName,
      }
    );

    return response.data;
  },

  // Update phone
  updatePhone: async (phone) => {
    const response = await api.patch(
      "/profile/phone",
      {
        phone,
      }
    );

    return response.data;
  },

  // Update address
  updateAddress: async (address) => {
    const response = await api.patch(
      "/profile/address",
      {
        address,
      }
    );

    return response.data;
  },

  // Update avatar
  updateProfileImage: async (
    profileImage
  ) => {
    const response = await api.patch(
      "/profile/image",
      {
        profile_image: profileImage,
      }
    );

    return response.data;
  },
};

export default profileAPI;