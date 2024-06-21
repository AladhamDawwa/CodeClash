// src/store/index.ts
import {
  Action,
  ThunkAction,
  UnknownAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import userReducer from './reducers/userReducer';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
};

const userPresistConfig = {
  key: 'user',
  storage: storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPresistConfig, userReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  Action<string>,
  UnknownAction
>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
