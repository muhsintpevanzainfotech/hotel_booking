import { all } from 'redux-saga/effects';
import { watchRoomSagas } from './roomSaga';

export default function* rootSaga() {
  yield all([
    watchRoomSagas()
  ]);
}
