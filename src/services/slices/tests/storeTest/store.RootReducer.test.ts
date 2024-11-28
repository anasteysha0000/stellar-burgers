import {
  initialConstructorState,
  initialFeedState,
  initialIngredientsState,
  initialOrderState,
  initialUserState
} from '@slices';
import store from '../../../store';

describe('Проверка правильной инициализации rootReducer', () => {
  test('Инициализация feed reducer с корректным начальными состоянием', () => {
    const state = store.getState();
    expect(state.feed).toEqual(initialFeedState);
  });

  test('Инициализация ingredients reducer с корректным начальными состоянием', () => {
    const state = store.getState();
    expect(state.ingredients).toEqual(initialIngredientsState);
  });

  test('Инициализация order reducer с корректным начальными состоянием', () => {
    const state = store.getState();
    expect(state.order).toEqual(initialOrderState);
  });

  test('Инициализация user reducer с корректным начальными состоянием', () => {
    const state = store.getState();
    expect(state.user).toEqual(initialUserState);
  });

  test('Инициализация constructor reducer с корректным начальными состоянием', () => {
    const state = store.getState();
    expect(state.burgerConstructor).toEqual(initialConstructorState);
  });
});
