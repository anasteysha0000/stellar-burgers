import { combineReducers, configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import constructorReducer from './slices/constructorSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const store = configureStore({
  reducer: {
    feed: feedReducer,
    ingredients: ingredientsReducer,
    user: userReducer,
    order: orderReducer,
    burgerConstructor: constructorReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
