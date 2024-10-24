import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

interface IFeedState {
  feedRequest: boolean;
  feedData: TOrdersData;
}

const initialFeedState: IFeedState = {
  feedRequest: false,
  feedData: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

export const getFeedsApiThunk = createAsyncThunk(
  'feed/getFeedsApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: initialFeedState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsApiThunk.pending, (state) => {
        state.feedRequest = true;
      })
      .addCase(getFeedsApiThunk.rejected, (state) => {})
      .addCase(
        getFeedsApiThunk.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.feedRequest = false;
          state.feedData = action.payload;
        }
      );
  }
});

export default feedSlice.reducer;

export const selectFeedRequest = (state: { feed: IFeedState }) =>
  state.feed.feedRequest;

export const selectFeedOrders = (state: { feed: IFeedState }) =>
  state.feed.feedData.orders;
export const selectTotal = (state: { feed: IFeedState }) =>
  state.feed.feedData.total;
export const selectTotalToday = (state: { feed: IFeedState }) =>
  state.feed.feedData.totalToday;
