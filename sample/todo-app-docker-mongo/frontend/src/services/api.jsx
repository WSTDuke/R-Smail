// src/services/api.js
// Service để gọi API từ backend

/**
 * BASE URL của API
 *
 * Vì đã config proxy trong package.json:
 * "proxy": "http://localhost:5000"
 *
 * → Có thể dùng relative path '/api/...' thay vì 'http://localhost:5000/api/...'
 */
const API_URL = '/api';

/**
 * HELPER FUNCTION: getAuthHeader
 *
 * Tạo Authorization header với token từ localStorage
 *
 * @returns {Object} - Headers object với Authorization
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/**
 * HELPER FUNCTION: handleResponse
 *
 * Xử lý response từ API
 * - Check status code
 * - Parse JSON
 * - Throw error nếu có lỗi
 *
 * @param {Response} response - Fetch response object
 * @returns {Promise} - Parsed JSON data
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Nếu status code không phải 2xx → có lỗi
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }

  return data;
};

/**
 * ============= AUTH API =============
 */

/**
 * Đăng ký user mới
 *
 * @param {Object} userData - { name, email, password }
 * @returns {Promise} - User data + token
 */
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await handleResponse(response);

  // Lưu token vào localStorage
  if (data.data.token) {
    localStorage.setItem('token', data.data.token);
  }

  return data.data; // { _id, name, email, token }
};

/**
 * Đăng nhập
 *
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - User data + token
 */
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  const data = await handleResponse(response);

  // Lưu token vào localStorage
  if (data.data.token) {
    localStorage.setItem('token', data.data.token);
  }

  return data.data;
};

/**
 * Đăng xuất
 *
 * Xóa token khỏi localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Lấy thông tin user hiện tại
 *
 * @returns {Promise} - User data
 */
export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * Lấy tất cả user
 * @returns {Promise<Array>} - Array of users
 */
export const getUsers = async () => {
  const response = await fetch(`${API_URL}/auth/users`, {
    headers: getAuthHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * ============= TODO API =============
 */

/**
 * Lấy tất cả todos theo thư mục
 *
 * @param {String} folder - 'inbox', 'sent', v.v.
 * @returns {Promise<Array>} - Array of todos
 */
export const getTodos = async (folder = 'inbox') => {
  const response = await fetch(`${API_URL}/todos?folder=${folder}`, {
    headers: getAuthHeader()
  });

  const data = await handleResponse(response);
  return data.data; // Array of todos
};

/**
 * Tạo todo mới hoặc gửi thư
 *
 * @param {String} title - Tiêu đề
 * @param {String} description - Mô tả
 * @param {String} recipientEmail - Email người nhận (tùy chọn)
 * @returns {Promise} - Todo object
 */
export const createTodo = async (title, description, recipientEmail) => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ title, description, recipientEmail })
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * Cập nhật todo
 *
 * @param {String} id - Todo ID
 * @param {Object} updates - { title, completed }
 * @returns {Promise} - Updated todo
 */
export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(updates)
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * Toggle trạng thái completed
 *
 * @param {String} id - Todo ID
 * @returns {Promise} - Updated todo
 */
export const toggleTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * Toggle trạng thái starred
 *
 * @param {String} id - Todo ID
 * @returns {Promise} - Updated todo
 */
export const toggleStar = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}/toggle-star`, {
    method: 'PATCH',
    headers: getAuthHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * Tạm ẩn todo
 *
 * @param {String} id - Todo ID
 * @returns {Promise} - Updated todo
 */
export const snoozeTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}/snooze`, {
    method: 'PATCH',
    headers: getAuthHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * Hoàn tác tạm ẩn todo
 *
 * @param {String} id - Todo ID
 * @returns {Promise} - Updated todo
 */
export const unsnoozeTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}/unsnooze`, {
    method: 'PATCH',
    headers: getAuthHeader()
  });

  const data = await handleResponse(response);
  return data.data;
};

/**
 * Xóa todo
 *
 * @param {String} id - Todo ID
 * @returns {Promise}
 */
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });

  return await handleResponse(response);
};

/**
 * Xóa nhiều todos theo IDs
 *
 * @param {Array} ids - List of Todo IDs
 * @returns {Promise}
 */
export const deleteBulkTodos = async (ids) => {
  const response = await fetch(`${API_URL}/todos/bulk`, {
    method: 'DELETE',
    headers: getAuthHeader(),
    body: JSON.stringify({ ids })
  });

  return await handleResponse(response);
};

/**
 * Xóa tất cả todos đã hoàn thành
 *
 * @returns {Promise}
 */
export const deleteCompletedTodos = async () => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });

  return await handleResponse(response);
};

/**
 * CÁCH SỬ DỤNG TRONG COMPONENT:
 *
 * import * as api from './services/api';
 *
 * // Đăng ký
 * try {
 *   const user = await api.register({ name, email, password });
 *   console.log('User:', user);
 * } catch (error) {
 *   console.error('Error:', error.message);
 * }
 *
 * // Lấy todos
 * const todos = await api.getTodos();
 *
 * // Tạo todo
 * const newTodo = await api.createTodo('Học React');
 *
 * // Toggle todo
 * await api.toggleTodo(todoId);
 *
 * // Xóa todo
 * await api.deleteTodo(todoId);
 */
