import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import roomReducer from './slices/roomSlice';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    rooms: roomReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export default store;
