import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  getOrdersApi
} from '@api';
import type { TRegisterData, TLoginData } from '@api';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface IInitialState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | undefined;
  userOrders: TOrder[];
}

const initialState: IInitialState = {
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false,
  isLoading: false,
  user: null,
  error: undefined,
  userOrders: []
};

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(registerData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(user);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      return await resetPasswordApi(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserApiThunk = createAsyncThunk(
  'user/getUserApi',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'user/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthChecked = true;
    },
    clearUserData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    },
    clearUserError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(loginUserThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error =
          typeof payload === 'string' ? payload : 'Неизвестная ошибка';
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(registerUserThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error =
          typeof payload === 'string' ? payload : 'Неизвестная ошибка';
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUserThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error =
          typeof payload === 'string' ? payload : 'Неизвестная ошибка';
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
      })
      .addCase(updateUserThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error =
          typeof payload === 'string' ? payload : 'Неизвестная ошибка';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.userOrders = payload;
      })
      .addCase(getUserOrders.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error =
          typeof payload === 'string' ? payload : 'Неизвестная ошибка';
      })
      .addCase(getUserApiThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUserApiThunk.rejected, (state) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(getUserApiThunk.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      });
  }
});

export default userSlice.reducer;

export const { setUserData, clearUserData, clearUserError } = userSlice.actions;

export const selectIsAuthenticated = (state: { user: IInitialState }) =>
  state.user.isAuthenticated;
export const selectUser = (state: { user: IInitialState }) => state.user.user;
export const selectUserError = (state: { user: IInitialState }) =>
  state.user.error;
export const selectIsLoading = (state: { user: IInitialState }) =>
  state.user.isLoading;
export const selectUserOrders = (state: { user: IInitialState }) =>
  state.user.userOrders;
