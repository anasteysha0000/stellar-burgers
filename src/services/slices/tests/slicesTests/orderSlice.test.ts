import { configureStore } from '@reduxjs/toolkit';
import {
  orderReducer,
  orderBurgerApiThunk,
  deleteOrderModal,
  selectOrderRequest,
  selectOrderModalData,
  initialOrderState
} from '@slices';
import { orderBurgerApi } from '@api';
import { mockOrderData } from '../mockData/mockData';

jest.mock('@api');

type RootState = {
  order: typeof initialOrderState;
};

describe('Тесты для проверки order reducer', () => {
  let store = configureStore({
    reducer: { order: orderReducer }
  });

  beforeEach(() => {
    store = configureStore({
      reducer: { order: orderReducer }
    });
    jest.clearAllMocks();
  });

  test('Должен устанавливать orderRequest в true при начале заказа', async () => {
    (orderBurgerApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(orderBurgerApiThunk([]));
    const state = store.getState().order;

    expect(state.orderRequest).toBe(true);
  });

  test('Должен обновлять состояние с данными заказа и завершать загрузку при успешном заказе', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValueOnce({
      order: mockOrderData
    });

    await store.dispatch(orderBurgerApiThunk([]));
    const state = store.getState().order;

    expect(state.orderModalData).toEqual(mockOrderData);
    expect(state.orderRequest).toBe(false);
  });

  test('Должен сбрасывать orderRequest и сохранять сообщение об ошибке при ошибке заказа', async () => {
    const errorMessage = 'Ошибка заказа';
    (orderBurgerApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await store.dispatch(orderBurgerApiThunk([]));
    const state = store.getState().order;

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBe(errorMessage);
  });

  test('Должен очищать данные модального окна заказа при вызове deleteOrderModal', () => {
    store.dispatch(deleteOrderModal());
    const state = store.getState().order;

    expect(state.orderModalData).toBeNull();
  });

  test('Селектор selectOrderRequest должен возвращать текущее состояние запроса заказа', () => {
    const state: RootState = {
      order: { ...initialOrderState, orderRequest: true }
    };
    expect(selectOrderRequest(state)).toBe(true);
  });

  test('Селектор selectOrderModalData должен возвращать данные модального окна заказа', () => {
    const state: RootState = {
      order: { ...initialOrderState, orderModalData: mockOrderData }
    };
    expect(selectOrderModalData(state)).toEqual(mockOrderData);
  });
});
