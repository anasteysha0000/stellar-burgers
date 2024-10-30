import { configureStore } from '@reduxjs/toolkit';
import {
  ingredientsReducer,
  loadIngredients,
  selectIngredientList,
  selectLoadingState
} from '@slices';
import { getIngredientsApi } from '@api';
import { initialIngredientsState } from '@slices';
import { mockIngredients } from '../mockData/mockData';

jest.mock('@api');

type RootState = {
  ingredients: typeof initialIngredientsState;
};

describe('Тесты для проверки ingredients reducer', () => {
  let store = configureStore({
    reducer: { ingredients: ingredientsReducer }
  });

  beforeEach(() => {
    store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });
    jest.clearAllMocks();
  });

  test('Должен устанавливать isLoading в true и очищать ошибку при начале загрузки ингредиентов', async () => {
    (getIngredientsApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(loadIngredients());
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Должен обновлять состояние с данными и завершать загрузку при успешной загрузке ингредиентов', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValueOnce(mockIngredients);

    await store.dispatch(loadIngredients());
    const state = store.getState().ingredients;

    expect(state.ingredientList).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Должен сохранять сообщение об ошибке и завершать загрузку при ошибке загрузки ингредиентов', async () => {
    const errorMessage = 'Ошибка загрузки';
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await store.dispatch(loadIngredients());
    const state = store.getState().ingredients;

    expect(state.ingredientList).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('Селектор selectLoadingState должен возвращать текущее состояние загрузки', () => {
    const state: RootState = {
      ingredients: { ...initialIngredientsState, isLoading: true }
    };
    expect(selectLoadingState(state)).toBe(true);
  });

  test('Селектор selectIngredientList должен возвращать список ингредиентов', () => {
    const state: RootState = {
      ingredients: {
        ...initialIngredientsState,
        ingredientList: mockIngredients
      }
    };
    expect(selectIngredientList(state)).toEqual(mockIngredients);
  });
});
