import { call, put, takeEvery, all, select } from 'redux-saga/effects';
import { loginRequest, loginSuccess, loginFailure, checkAuth, logout } from '../slices/authSlice';
import { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure } from '../slices/roomSlice';
import { fetchStatsRequest, fetchStatsSuccess, fetchStatsFailure, fetchAnalyticsRequest, fetchAnalyticsSuccess, fetchAnalyticsFailure } from '../slices/statsSlice';
import { 
  fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure,
  addUserRequest, addUserSuccess, addUserFailure,
  updateUserRequest, updateUserSuccess, updateUserFailure,
  deleteUserRequest, deleteUserSuccess, deleteUserFailure
} from '../slices/userSlice';
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  markNotificationsReadRequest,
  markNotificationsReadSuccess,
  deleteNotificationRequest,
  deleteNotificationSuccess,
  deleteNotificationFailure
} from '../slices/notificationSlice';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:6000/api';

// Selector to get token from state
const getToken = (state) => state.auth.token;

// Auth Workers
function* handleLogin(action) {
  try {
    const response = yield call(() => fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload)
    }));
    const data = yield response.json();
    if (response.ok) {
      yield put(loginSuccess({ user: data.user, token: data.token }));
    } else {
      yield put(loginFailure(data.message || 'Invalid credentials'));
    }
  } catch (e) {
    yield put(loginFailure(e.message));
  }
}

function* handleCheckAuth() {
  try {
    const token = yield select(getToken);
    if (!token) {
      yield put(loginFailure(null)); // Reset loading state
      return;
    }

    const response = yield call(() => fetch(`${API_BASE}/auth-status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }));
    const data = yield response.json();
    if (data.isAuthenticated && (data.user.role === 'admin' || data.user.role === 'super_admin')) {
      yield put(loginSuccess({ user: data.user, token }));
    } else {
      yield put(loginFailure('Unauthorized Access'));
    }
  } catch (e) {
    yield put(loginFailure(e.message));
  }
}

function* handleFetchRooms() {
  try {
    const response = yield call(() => fetch(`${API_BASE}/rooms`));
    if (!response.ok) throw new Error('Failed to fetch rooms');
    const data = yield response.json();
    yield put(fetchRoomsSuccess(data));
  } catch (e) {
    yield put(fetchRoomsFailure(e.message));
  }
}

function* handleFetchStats() {
  try {
    const token = yield select(getToken);
    if (!token) throw new Error('Authentication token missing');
    
    const response = yield call(() => fetch(`${API_BASE}/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }));
    
    if (response.status === 401) {
       yield put(logout());
       throw new Error('Session expired');
    }
    
    const data = yield response.json();
    yield put(fetchStatsSuccess(data));
  } catch (e) {
    yield put(fetchStatsFailure(e.message));
  }
}

function* handleFetchAnalytics() {
  try {
    const token = yield select(getToken);
    const response = yield call(() => fetch(`${API_BASE}/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }));
    const data = yield response.json();
    if (response.ok) {
      yield put(fetchAnalyticsSuccess(data));
    } else {
      yield put(fetchAnalyticsFailure(data.message));
    }
  } catch (e) {
    yield put(fetchAnalyticsFailure(e.message));
  }
}

// User Workers
function* handleFetchUsers() {
  try {
    const token = yield select(getToken);
    const response = yield call(() => fetch(`${API_BASE}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }));
    const data = yield response.json();
    if (response.ok) {
      yield put(fetchUsersSuccess(data));
    } else {
      yield put(fetchUsersFailure(data.message || 'Failed to fetch users'));
    }
  } catch (e) {
    yield put(fetchUsersFailure(e.message));
  }
}

function* handleAddUser(action) {
  try {
    const token = yield select(getToken);
    const response = yield call(() => fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(action.payload)
    }));
    const data = yield response.json();
    if (response.ok) {
      yield put(addUserSuccess(data.user));
    } else {
      yield put(addUserFailure(data.message || 'Failed to add user'));
    }
  } catch (e) {
    yield put(addUserFailure(e.message));
  }
}

function* handleUpdateUser(action) {
  try {
    const token = yield select(getToken);
    const { id, data } = action.payload;
    
    if (!id || id === 'undefined') {
      throw new Error('Invalid User ID provided for update');
    }

    const response = yield call(() => fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    }));
    const responseData = yield response.json();
    if (response.ok) {
      yield put(updateUserSuccess(responseData.user));
    } else {
      yield put(updateUserFailure(responseData.message || 'Failed to update user'));
    }
  } catch (e) {
    yield put(updateUserFailure(e.message));
  }
}

function* handleDeleteUser(action) {
  try {
    const id = action.payload;
    if (!id || id === 'undefined') {
      throw new Error('Invalid User ID provided for deletion');
    }

    const token = yield select(getToken);
    const response = yield call(() => fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }));
    if (response.ok) {
      yield put(deleteUserSuccess(action.payload));
    } else {
      const data = yield response.json();
      yield put(deleteUserFailure(data.message || 'Failed to delete user'));
    }
  } catch (e) {
    yield put(deleteUserFailure(e.message));
  }
}

function* handleFetchNotifications() {
  try {
    const token = yield select(getToken);
    const response = yield call(() => fetch(`${API_BASE}/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }));
    const data = yield response.json();
    if (response.ok) {
      yield put(fetchNotificationsSuccess(data));
    } else {
      yield put(fetchNotificationsFailure(data.message));
    }
  } catch (e) {
    yield put(fetchNotificationsFailure(e.message));
  }
}

function* handleMarkNotificationsRead(action) {
  try {
    const id = action.payload;
    const token = yield select(getToken);
    const response = yield call(() => fetch(`${API_BASE}/notifications/read`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: id ? JSON.stringify({ id }) : undefined
    }));
    if (response.ok) {
      yield put(markNotificationsReadSuccess(id));
    }
  } catch (e) {}
}

function* handleDeleteNotification(action) {
  try {
    const id = action.payload;
    const token = yield select(getToken);
    const response = yield call(() => fetch(`${API_BASE}/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }));
    if (response.ok) {
      yield put(deleteNotificationSuccess(id));
    } else {
      const data = yield response.json();
      yield put(deleteNotificationFailure(data.message));
    }
  } catch (e) {
    yield put(deleteNotificationFailure(e.message));
  }
}

// Watchers
function* watchAuth() {
  yield takeEvery('auth/loginRequest', handleLogin);
  yield takeEvery('auth/checkAuth', handleCheckAuth);
}

// Watchers
function* watchRooms() {
  yield takeEvery('rooms/fetchRoomsRequest', handleFetchRooms);
}

function* watchStats() {
  yield takeEvery('stats/fetchStatsRequest', handleFetchStats);
  yield takeEvery('stats/fetchAnalyticsRequest', handleFetchAnalytics);
}

function* watchUsers() {
  yield takeEvery('users/fetchUsersRequest', handleFetchUsers);
  yield takeEvery('users/addUserRequest', handleAddUser);
  yield takeEvery('users/updateUserRequest', handleUpdateUser);
  yield takeEvery('users/deleteUserRequest', handleDeleteUser);
}

function* watchNotifications() {
  yield takeEvery('notifications/fetchNotificationsRequest', handleFetchNotifications);
  yield takeEvery('notifications/markNotificationsReadRequest', handleMarkNotificationsRead);
  yield takeEvery('notifications/deleteNotificationRequest', handleDeleteNotification);
}

export default function* rootSaga() {
  yield all([
    watchAuth(),
    watchRooms(),
    watchStats(),
    watchUsers(),
    watchNotifications()
  ]);
}
