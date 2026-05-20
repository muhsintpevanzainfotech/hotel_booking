import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import roomReducer from './slices/roomSlice';
import uiReducer from './slices/uiSlice';
import statsReducer from './slices/statsSlice';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    ui: uiReducer,
    stats: statsReducer,
    theme: themeReducer,
    users: userReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
