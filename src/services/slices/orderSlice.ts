import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IInitialState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

export const initialOrderState: IInitialState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const orderBurgerApiThunk = createAsyncThunk(
  'order/orderBurgerApi',
  async (data: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {
    deleteOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerApiThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurgerApiThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(
        orderBurgerApiThunk.fulfilled,
        (state, action: PayloadAction<{ order: TOrder }>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload.order;
          state.error = null;
        }
      );
  }
});

export const { deleteOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;

export const selectOrderRequest = (state: { order: IInitialState }) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: { order: IInitialState }) =>
  state.order.orderModalData;
