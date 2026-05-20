import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure } from '../slices/roomSlice';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function* fetchRoomsSaga() {
  try {
    const response = yield call(fetch, `${API_BASE}/rooms`);
    const data = yield call([response, 'json']);
    yield put(fetchRoomsSuccess(data));
  } catch (error) {
    yield put(fetchRoomsFailure(error.message));
  }
}

export function* watchRoomSagas() {
  yield takeLatest(fetchRoomsRequest.type, fetchRoomsSaga);
}
