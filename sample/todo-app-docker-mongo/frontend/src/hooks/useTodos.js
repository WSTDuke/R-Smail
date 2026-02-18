import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async (folder = 'inbox') => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos(folder);
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (title, description, recipientEmail) => {
    try {
      const newTodo = await api.createTodo(title, description, recipientEmail);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      console.error('Error creating todo:', err);
      throw new Error(err.message);
    }
  }, []);

  const toggleTodo = useCallback(async (id, currentFolder = 'inbox') => {
    try {
      const updatedTodo = await api.toggleTodo(id);
      setTodos(prev => {
        // Nếu ở thư mục nào đó mà update làm nó không còn thuộc thư mục đó (ví dụ logic folder thay đổi)
        // Hiện tại logic folder ít thay đổi khi toggle, chủ yếu là starred
        return prev.map(todo => todo._id === id ? updatedTodo : todo);
      });
      return updatedTodo;
    } catch (err) {
      console.error('Error toggling todo:', err);
      throw new Error('Không thể cập nhật: ' + err.message);
    }
  }, []);

  const toggleStar = useCallback(async (id, currentFolder = 'inbox') => {
    try {
      const updatedTodo = await api.toggleStar(id);
      setTodos(prev => {
        // Nếu đang ở tab 'starred' mà bỏ star -> xóa khỏi list
        if (currentFolder === 'starred' && !updatedTodo.starred) {
          return prev.filter(todo => todo._id !== id);
        }
        // Ngược lại thì update item trong list
        return prev.map(todo => todo._id === id ? updatedTodo : todo);
      });
      return updatedTodo;
    } catch (err) {
      console.error('Error toggling star:', err);
      throw new Error('Không thể cập nhật: ' + err.message);
    }
  }, []);

  const snoozeTodo = useCallback(async (id) => {
    try {
      await api.snoozeTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Error snoozing todo:', err);
      throw new Error('Không thể tạm ẩn: ' + err.message);
    }
  }, []);

  const unsnoozeTodo = useCallback(async (id) => {
    try {
      await api.unsnoozeTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Error unsnoozing todo:', err);
      throw new Error('Không thể hoàn tác tạm ẩn: ' + err.message);
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw new Error('Không thể xóa: ' + err.message);
    }
  }, []);

  const deleteBulkTodos = useCallback(async (ids) => {
    try {
      await api.deleteBulkTodos(ids);
      setTodos(prev => prev.filter(todo => !ids.includes(todo._id)));
    } catch (err) {
      console.error('Error deleting bulk todos:', err);
      throw new Error('Không thể xóa hàng loạt: ' + err.message);
    }
  }, []);

  return {
    todos,
    loading,
    error,
    refreshTodos: fetchTodos,
    addTodo,
    toggleTodo,
    toggleStar,
    snoozeTodo,
    unsnoozeTodo,
    deleteTodo,
    deleteBulkTodos,
  };
};
