import { configureStore } from '@reduxjs/toolkit';
import {
  feedReducer,
  getFeedsApiThunk,
  selectFeedOrders,
  selectFeedRequest,
  selectTotal,
  selectTotalToday
} from '@slices';
import { getFeedsApi } from '@api';
import { initialFeedState } from '@slices';
import { mockFeedData } from '../mockData/mockData';

jest.mock('@api');

type RootState = {
  feed: typeof initialFeedState;
};

describe('Тесты для проверки feed reducer', () => {
  let store = configureStore({
    reducer: { feed: feedReducer }
  });

  beforeEach(() => {
    store = configureStore({
      reducer: { feed: feedReducer }
    });
    jest.clearAllMocks();
  });

  test('Должен устанавливать feedRequest в true и очищать ошибку при начале загрузки фидов', async () => {
    (getFeedsApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(getFeedsApiThunk());
    const state = store.getState().feed;

    expect(state.feedRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Должен обновлять состояние с данными и завершать загрузку при успешной загрузке фидов', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValueOnce(mockFeedData);

    await store.dispatch(getFeedsApiThunk());
    const state = store.getState().feed;

    expect(state.feedData).toEqual(mockFeedData);
    expect(state.feedRequest).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Должен сохранять сообщение об ошибке и завершать загрузку при ошибке загрузки фидов', async () => {
    const errorMessage = 'Ошибка загрузки';
    (getFeedsApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(getFeedsApiThunk());
    const state = store.getState().feed;

    expect(state.feedData).toEqual({ orders: [], total: 0, totalToday: 0 });
    expect(state.feedRequest).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('Селектор selectFeedRequest должен возвращать текущее состояние запроса фидов', () => {
    const state: RootState = {
      feed: { ...initialFeedState, feedRequest: true }
    };
    expect(selectFeedRequest(state)).toBe(true);
  });

  test('Селектор selectFeedOrders должен возвращать список заказов фида', () => {
    const state: RootState = {
      feed: {
        ...initialFeedState,
        feedData: mockFeedData
      }
    };
    expect(selectFeedOrders(state)).toEqual(mockFeedData.orders);
  });

  test('Селектор selectTotal должен возвращать общее количество заказов', () => {
    const state: RootState = {
      feed: {
        ...initialFeedState,
        feedData: mockFeedData
      }
    };
    expect(selectTotal(state)).toBe(mockFeedData.total);
  });

  test('Селектор selectTotalToday должен возвращать количество заказов за сегодня', () => {
    const state: RootState = {
      feed: {
        ...initialFeedState,
        feedData: mockFeedData
      }
    };
    expect(selectTotalToday(state)).toBe(mockFeedData.totalToday);
  });
});
