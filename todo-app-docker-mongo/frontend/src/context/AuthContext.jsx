// src/context/AuthContext.js
// Context để quản lý authentication state toàn app

import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/api';

/**
 * TẠO CONTEXT
 *
 * Context cho phép share state giữa các components mà không cần prop drilling
 * (pass props qua nhiều tầng components)
 */
const AuthContext = createContext();

/**
 * CUSTOM HOOK: useAuth
 *
 * Hook để dễ dàng access AuthContext trong components
 *
 * Cách dùng:
 * const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
};

/**
 * AUTH PROVIDER COMPONENT
 *
 * Component này wrap toàn bộ app để cung cấp auth state
 *
 * @param {Object} props - { children }
 */
export const AuthProvider = ({ children }) => {
  /**
   * STATE
   *
   * - user: Thông tin user hiện tại (null nếu chưa login)
   * - loading: Trạng thái đang load (check auth khi mount)
   * - error: Thông báo lỗi (nếu có)
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect - KIỂM TRA AUTH KHI COMPONENT MOUNT
   *
   * Chạy 1 lần khi app load
   * Check xem có token trong localStorage không
   * Nếu có → gọi API để lấy user info
   */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        // Không có token → chưa login
        setLoading(false);
        return;
      }

      try {
        // Gọi API để verify token và lấy user info
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Token không hợp lệ hoặc hết hạn
        console.error('Auth check failed:', error.message);
        localStorage.removeItem('token'); // Xóa token không hợp lệ
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Empty deps → chỉ chạy 1 lần khi mount

  /**
   * FUNCTION: register
   *
   * Đăng ký user mới
   *
   * @param {Object} userData - { name, email, password }
   */
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      // Gọi API đăng ký
      const data = await api.register(userData);

      // Set user state (trigger re-render)
      setUser(data);

      return data;
    } catch (error) {
      setError(error.message);
      throw error; // Re-throw để component handle
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNCTION: login
   *
   * Đăng nhập
   *
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      // Gọi API đăng nhập
      const data = await api.login(credentials);

      // Set user state
      setUser(data);

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNCTION: logout
   *
   * Đăng xuất
   */
  const logout = () => {
    api.logout(); // Xóa token
    setUser(null); // Clear user state
  };

  /**
   * CONTEXT VALUE
   *
   * Các giá trị này sẽ được access từ components con
   */
  const value = {
    user,        // User object hoặc null
    loading,     // Boolean
    error,       // String hoặc null
    register,    // Function
    login,       // Function
    logout,      // Function
    isAuthenticated: !!user // Boolean: có user hay không
  };

  /**
   * RENDER
   *
   * Hiển thị loading spinner khi đang check auth
   * Sau đó render children với context value
   */
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * CÁCH SỬ DỤNG:
 *
 * 1. Wrap app với AuthProvider (trong index.js):
 *
 * import { AuthProvider } from './context/AuthContext';
 *
 * ReactDOM.render(
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>,
 *   document.getElementById('root')
 * );
 *
 *
 * 2. Sử dụng trong component:
 *
 * import { useAuth } from './context/AuthContext';
 *
 * function MyComponent() {
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <Login />;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Xin chào, {user.name}!</p>
 *       <button onClick={logout}>Đăng xuất</button>
 *     </div>
 *   );
 * }
 *
 *
 * FLOW HOẠT ĐỘNG:
 *
 * 1. App load → AuthProvider mount
 * 2. useEffect chạy → check localStorage có token không
 * 3. Nếu có token → gọi API /api/auth/me
 * 4. Nếu token hợp lệ → set user state
 * 5. setLoading(false) → hiển thị app
 * 6. User click login → gọi login()
 * 7. login() gọi API → nhận token + user data
 * 8. Lưu token vào localStorage
 * 9. Set user state → trigger re-render
 * 10. Components con nhìn thấy isAuthenticated = true
 */
