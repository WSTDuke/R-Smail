import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      await login(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)] font-hand">
      <div className="w-full max-w-[550px] p-10 sm:p-14 bg-[var(--bg-content)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] shadow-xl animate-fade-in">
        <div className="flex flex-col items-center mb-10">
           <span className="text-6xl font-bold text-[var(--accent-blue)] font-logo mb-6 tracking-tight">R-Smail</span>
           <h2 className="text-4xl font-bold text-[var(--text-main)] font-logo">Xin chào!</h2>
           <p className="mt-4 text-2xl text-[var(--text-soft)] italic">Mở hòm thư tay của bạn</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 text-xl rounded-[var(--radius-lg)] flex items-center gap-4 animate-shake">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[var(--text-soft)] group-focus-within:text-[var(--accent-blue)] transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Địa chỉ hòm thư"
              className="w-full pl-14 pr-6 py-4 bg-black/5 border-2 border-transparent rounded-[var(--radius-lg)] focus:bg-white focus:border-[var(--border-subtle)] outline-none transition-all text-2xl placeholder-[var(--text-soft)]/50"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[var(--text-soft)] group-focus-within:text-[var(--accent-blue)] transition-colors">
              <Lock className="w-6 h-6" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật mã bí mật"
              className="w-full pl-14 pr-6 py-4 bg-black/5 border-2 border-transparent rounded-[var(--radius-lg)] focus:bg-white focus:border-[var(--border-subtle)] outline-none transition-all text-2xl placeholder-[var(--text-soft)]/50"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between pt-10">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[var(--accent-blue)] font-bold text-xl hover:bg-black/5 px-6 py-3 rounded-full transition-all active:scale-95"
            >
              Chưa có tài khoản?
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90 text-white font-bold rounded-full shadow-lg shadow-[var(--accent-blue)]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 text-2xl font-logo"
            >
              {loading ? 'Đang mở cửa...' : (
                <>
                  Đăng nhập
                  <ChevronRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-lg text-[var(--text-soft)] font-bold italic">
        <span className="hover:text-[var(--accent-blue)] cursor-pointer transition-colors underline decoration-dotted">Hỏi đáp</span>
        <span className="hover:text-[var(--accent-blue)] cursor-pointer transition-colors underline decoration-dotted">Bảo mật</span>
        <span className="hover:text-[var(--accent-blue)] cursor-pointer transition-colors underline decoration-dotted">Luật lệ</span>
        <span className="text-[var(--border-medium)]">© 2026 R-Smail</span>
      </div>
    </div>
  );
};

export default Login;
