import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export interface IConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
}

export const constructorInitialState: IConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: constructorInitialState,
  reducers: {
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (
        fromIndex >= 0 &&
        toIndex >= 0 &&
        fromIndex < ingredients.length &&
        toIndex < ingredients.length
      ) {
        const [movedItem] = ingredients.splice(fromIndex, 1);
        ingredients.splice(toIndex, 0, movedItem);
      }
    },
    addConstructorItem: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      switch (action.payload.type) {
        case 'bun': {
          state.constructorItems.bun = action.payload;
          break;
        }
        case 'main':
        case 'sauce': {
          state.constructorItems.ingredients.push(action.payload);
          break;
        }
      }
    },
    removeConstructorItem: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    deleteConstructorItems: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  }
});

export const selectConstructorItems = (state: {
  burgerConstructor: IConstructorState;
}) => state.burgerConstructor.constructorItems;

export const {
  addConstructorItem,
  removeConstructorItem,
  moveIngredient,
  deleteConstructorItems
} = constructorSlice.actions;

export default constructorSlice.reducer;
