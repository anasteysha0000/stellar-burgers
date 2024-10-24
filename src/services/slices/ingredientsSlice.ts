import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  isLoading: boolean;
  ingredientList: TIngredient[];
  error: string | null;
}

const initialState: IIngredientsState = {
  isLoading: false,
  ingredientList: [],
  error: null
};

export const loadIngredients = createAsyncThunk(
  'ingredients/get',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loadIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredientList = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(loadIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});
export default ingredientSlice.reducer;

export const selectLoadingState = (state: { ingredients: IIngredientsState }) =>
  state.ingredients.isLoading;
export const selectIngredientList = (state: {
  ingredients: IIngredientsState;
}) => state.ingredients.ingredientList;
