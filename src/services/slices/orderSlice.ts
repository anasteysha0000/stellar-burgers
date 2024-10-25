import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface IInitialState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IInitialState = {
  orderRequest: false,
  orderModalData: null
};

export const orderBurgerApiThunk = createAsyncThunk(
  'order/orderBurgerApi',
  async (data: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    deleteOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerApiThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurgerApiThunk.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(
        orderBurgerApiThunk.fulfilled,
        (state, action: PayloadAction<{ order: TOrder }>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload.order;
        }
      );
  }
});

export const { deleteOrderModal } = orderSlice.actions;
export default orderSlice.reducer;

export const selectOrderRequest = (state: { order: IInitialState }) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: { order: IInitialState }) =>
  state.order.orderModalData;
