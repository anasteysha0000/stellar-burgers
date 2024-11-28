import {
  addConstructorItem,
  IConstructorState,
  moveIngredient,
  removeConstructorItem,
  deleteConstructorItems,
  constructorReducer
} from '@slices';
import { TConstructorIngredient } from '@utils-types';
import {
  mockIngredients,
  mockInitialState,
  notEmptyState
} from '../mockData/mockData';

describe('Тесты для проверки constructor reducer', () => {
  let bunIngredient: TConstructorIngredient;
  let mainIngredient1: TConstructorIngredient;
  let mainIngredient2: TConstructorIngredient;
  let sauceIngredient: TConstructorIngredient;
  let initialState: IConstructorState;

  beforeEach(() => {
    bunIngredient = mockIngredients[0];
    mainIngredient1 = mockIngredients[1];
    mainIngredient2 = notEmptyState.ingredients[1];
    sauceIngredient = mockIngredients[2];

    initialState = {
      constructorItems: {
        bun: null,
        ingredients: [mainIngredient1, mainIngredient2]
      },
      orderRequest: false
    };
  });

  test('Должен добавлять булочку в конструктор, если ингредиенты не установлены', () => {
    const state = {
      ...mockInitialState,
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };

    const newState = constructorReducer(
      state,
      addConstructorItem(bunIngredient)
    );

    expect(newState.constructorItems.bun).toEqual(bunIngredient);
    expect(newState.constructorItems.ingredients).toEqual([]);
  });

  test('Должен заменять булочку в конструкторе, если уже установлена другая', () => {
    const state = {
      ...mockInitialState,
      constructorItems: {
        bun: bunIngredient,
        ingredients: []
      }
    };

    const newBunIngredient = {
      ...mockIngredients[0],
      type: 'bun'
    };

    const newState = constructorReducer(
      state,
      addConstructorItem(newBunIngredient)
    );

    expect(newState.constructorItems.bun).toEqual(newBunIngredient);
    expect(newState.constructorItems.ingredients).toEqual([]);
  });

  test('Должен добавлять основной ингредиент в конструктор, если булочка не установлена', () => {
    const state = { ...mockInitialState };

    const newState = constructorReducer(
      state,
      addConstructorItem(mainIngredient1)
    );

    expect(newState.constructorItems.ingredients).toEqual([mainIngredient1]);
    expect(newState.constructorItems.bun).toBeNull();
  });

  test('Должен добавлять ингредиент с типом "sauce" в конструктор', () => {
    const state = { ...mockInitialState };

    const newState = constructorReducer(
      state,
      addConstructorItem(sauceIngredient)
    );

    expect(newState.constructorItems.ingredients).toEqual([sauceIngredient]);
    expect(newState.constructorItems.bun).toBeNull();
  });

  test('Должен корректно удалять выбранный ингредиент из конструктора', () => {
    const state = {
      constructorItems: {
        bun: null,
        ingredients: [mainIngredient1, mainIngredient2]
      },
      orderRequest: false
    };

    let newState = constructorReducer(
      state,
      removeConstructorItem(mainIngredient1.id)
    );
    expect(newState.constructorItems.ingredients).toEqual([mainIngredient2]);

    newState = constructorReducer(
      newState,
      removeConstructorItem('nonExistingId')
    );
    expect(newState.constructorItems.ingredients).toEqual([mainIngredient2]);

    newState = constructorReducer(
      newState,
      removeConstructorItem(mainIngredient2.id)
    );
    expect(newState.constructorItems.ingredients).toEqual([]);
  });

  test('Должен очищать все ингредиенты из конструктора', () => {
    const state = {
      ...mockInitialState,
      constructorItems: {
        bun: bunIngredient,
        ingredients: [mainIngredient1, mainIngredient2]
      }
    };

    const newState = constructorReducer(state, deleteConstructorItems());
    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients).toEqual([]);
  });

  test('Должен изменять порядок ингредиентов в начинке согласно указанным индексам', () => {
    const state = { ...initialState };

    const newState = constructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(newState.constructorItems.ingredients).toEqual([
      mainIngredient2,
      mainIngredient1
    ]);
  });

  test('Не должен изменять порядок ингредиентов, если индексы вне диапазона', () => {
    const state = { ...initialState };

    const newState = constructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 5 })
    );

    expect(newState.constructorItems.ingredients).toEqual([
      mainIngredient1,
      mainIngredient2
    ]);
  });

  test('Не должен изменять порядок ингредиентов, если fromIndex и toIndex равны', () => {
    const state = { ...initialState };

    const newState = constructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 0 })
    );

    expect(newState.constructorItems.ingredients).toEqual([
      mainIngredient1,
      mainIngredient2
    ]);
  });

  test('Должен оставлять конструктор неизменным, если добавляется ингредиент с неподдерживаемым типом', () => {
    const state = { ...mockInitialState };
    const unsupportedIngredient = { ...mainIngredient1, type: 'unsupported' };

    const newState = constructorReducer(
      state,
      addConstructorItem(unsupportedIngredient)
    );

    expect(newState).toEqual(state);
  });
});
