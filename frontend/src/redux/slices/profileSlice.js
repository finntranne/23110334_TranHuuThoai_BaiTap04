import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileAPI from '../../services/profileAPI';

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getProfile();
      // profileAPI.getProfile() trả về response.data của axios = { success, data: user }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy thông tin profile'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Cập nhật profile thất bại'
      );
    }
  }
);

export const updateName = createAsyncThunk(
  'profile/updateName',
  async (fullName, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateName(fullName);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Cập nhật tên thất bại'
      );
    }
  }
);

export const updatePhone = createAsyncThunk(
  'profile/updatePhone',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updatePhone(phone);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Cập nhật số điện thoại thất bại'
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  'profile/updateAddress',
  async (address, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateAddress(address);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Cập nhật địa chỉ thất bại'
      );
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
  isEditing: false
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Cập nhật profile thành công';
        state.isEditing = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Name
    builder
      .addCase(updateName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateName.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Cập nhật tên thành công';
      })
      .addCase(updateName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Phone
    builder
      .addCase(updatePhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Cập nhật số điện thoại thành công';
      })
      .addCase(updatePhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Address
    builder
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Cập nhật địa chỉ thành công';
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setIsEditing, clearError, clearSuccessMessage } = profileSlice.actions;
export default profileSlice.reducer;
