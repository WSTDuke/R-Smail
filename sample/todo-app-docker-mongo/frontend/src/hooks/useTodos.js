import { useState, useEffect } from 'react';
import * as api from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title, description) => {
    try {
      // Backend current support might only be title
      const newTodo = await api.createTodo(title);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      console.error('Error creating todo:', err);
      throw new Error('Không thể tạo mới: ' + err.message);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updatedTodo = await api.toggleTodo(id);
      setTodos(prev => prev.map(todo =>
        todo._id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      console.error('Error toggling todo:', err);
      throw new Error('Không thể cập nhật: ' + err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw new Error('Không thể xóa: ' + err.message);
    }
  };

  return {
    todos,
    loading,
    error,
    refreshTodos: fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
};
