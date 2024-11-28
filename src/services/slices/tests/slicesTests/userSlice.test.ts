import { configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  getUserApiThunk,
  getUserOrders,
  initialUserState,
  selectIsAuthenticated,
  selectUser,
  selectUserError,
  selectIsLoading,
  selectUserOrders,
  setUserData,
  clearUserData,
  clearUserError
} from '@slices';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  getOrdersApi
} from '@api';
import {
  mockAuthResponse,
  mockFeedData,
  mockLoginData,
  mockUser
} from '../mockData/mockData';

jest.mock('@api');

describe('Тесты для проверки user reducer', () => {
  let store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: initialUserState }
  });

  beforeEach(() => {
    store = configureStore({
      reducer: { user: userReducer },
      preloadedState: { user: initialUserState }
    });
    jest.clearAllMocks();
  });

  test('Должен устанавливать данные пользователя и авторизовать пользователя при вызове setUserData', () => {
    store.dispatch(setUserData(mockUser));
    const state = store.getState().user;

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('Селектор selectIsAuthenticated должен возвращать текущее состояние авторизации', () => {
    expect(selectIsAuthenticated(store.getState())).toBe(false);

    store.dispatch(setUserData(mockUser));
    expect(selectIsAuthenticated(store.getState())).toBe(true);
  });

  test('Селектор selectUser должен возвращать данные пользователя', () => {
    store.dispatch(setUserData(mockUser));
    expect(selectUser(store.getState())).toEqual(mockUser);
  });

  test('Селектор selectUserError должен возвращать сообщение об ошибке', async () => {
    await store.dispatch(clearUserError());
    expect(selectUserError(store.getState())).toBeUndefined();

    const errorMessage = 'Ошибка входа';
    (loginUserApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    await store.dispatch(loginUserThunk(mockLoginData));

    expect(selectUserError(store.getState())).toBe(errorMessage);
  });

  test('Селектор selectIsLoading должен возвращать текущее состояние загрузки', async () => {
    (loginUserApi as jest.Mock).mockReturnValue(new Promise(() => {}));
    store.dispatch(loginUserThunk(mockLoginData));
    expect(selectIsLoading(store.getState())).toBe(true);

    (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);
    await store.dispatch(loginUserThunk(mockLoginData));
    expect(selectIsLoading(store.getState())).toBe(false);
  });

  test('Селектор selectUserOrders должен возвращать список заказов пользователя', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockFeedData.orders);
    await store.dispatch(getUserOrders());
    expect(selectUserOrders(store.getState())).toEqual(mockFeedData.orders);
  });

  test('Должен очищать данные пользователя и сбрасывать авторизацию при вызове clearUserData', () => {
    store.dispatch(setUserData(mockUser));
    store.dispatch(clearUserData());
    const state = store.getState().user;

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  test('Должен очищать сообщение об ошибке при вызове clearUserError', () => {
    store.dispatch(clearUserError());
    const state = store.getState().user;

    expect(state.error).toBeUndefined();
  });

  test('Должен устанавливать isLoading в true и очищать ошибку при начале загрузки во время входа', async () => {
    (loginUserApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(loginUserThunk(mockLoginData));
    const state = store.getState().user;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('Должен очищать данные пользователя и завершать загрузку при успешном выходе', async () => {
    store.dispatch(setUserData(mockUser));
    (logoutApi as jest.Mock).mockResolvedValueOnce({});

    await store.dispatch(logoutUserThunk());
    const state = store.getState().user;

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(selectIsAuthenticated({ user: state })).toBe(false);
  });

  test('Должен сохранять данные пользователя при ошибке выхода', async () => {
    store.dispatch(setUserData(mockUser));
    (logoutApi as jest.Mock).mockRejectedValueOnce(new Error('Ошибка выхода'));

    await store.dispatch(logoutUserThunk());
    const state = store.getState().user;

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  test('Должен обновлять данные пользователя и завершать загрузку при успешном входе', async () => {
    (loginUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    await store.dispatch(loginUserThunk(mockLoginData));
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  test('Должен сохранять сообщение об ошибке и завершать загрузку при ошибке входа', async () => {
    const errorMessage = 'Ошибка входа';
    (loginUserApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(loginUserThunk(mockLoginData));
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isAuthenticated).toBe(false);
  });

  test('Должен обновлять данные пользователя и завершать загрузку при успешной регистрации', async () => {
    (registerUserApi as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    await store.dispatch(registerUserThunk({ ...mockLoginData, name: 'Саша' }));
    const state = store.getState().user;

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  test('Должен успешно обновлять данные пользователя при вызове getUserApiThunk', async () => {
    (getUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    await store.dispatch(getUserApiThunk());
    const state = store.getState().user;

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('Должен успешно обновлять заказы пользователя при вызове getUserOrders', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockFeedData.orders);

    await store.dispatch(getUserOrders());
    const state = store.getState().user;

    expect(state.userOrders).toEqual(mockFeedData.orders);
    expect(state.isLoading).toBe(false);
  });
});
