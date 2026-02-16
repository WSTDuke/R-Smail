import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ASSETS } from '../../constants/assets';
import { User, Mail, Lock, ChevronRight } from 'lucide-react';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f8fc]">
      <div className="w-full max-w-[448px] p-8 sm:p-12 bg-white border border-[#e1e3e1] rounded-[24px] shadow-sm">
        <div className="flex flex-col items-center mb-8">
           <img src={ASSETS.GMAIL_LOGO_2X} alt="Gmail" className="h-10 mb-6" />
           <h2 className="text-2xl font-normal text-[#1f1f1f]">Tạo tài khoản</h2>
           <p className="mt-2 text-[16px] text-[#444746]">Đăng ký Tài khoản To Do Mail của bạn</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#fdeded] border border-[#f8bbbb] text-[#d32f2f] text-[14px] rounded-lg flex items-center gap-3">
            <div className="flex-shrink-0 animate-pulse text-[18px]">⚠️</div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0b57d0] transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ và Tên"
              className="w-full pl-12 pr-4 py-3.5 border border-[#747775] rounded-lg focus:ring-2 focus:ring-[#0b57d0] focus:border-transparent outline-none transition-all text-[16px]"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0b57d0] transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3.5 border border-[#747775] rounded-lg focus:ring-2 focus:ring-[#0b57d0] focus:border-transparent outline-none transition-all text-[16px]"
              disabled={loading}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0b57d0] transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-full pl-12 pr-4 py-3.5 border border-[#747775] rounded-lg focus:ring-2 focus:ring-[#0b57d0] focus:border-transparent outline-none transition-all text-[16px]"
              disabled={loading}
            />
            <p className="mt-1.5 text-[11px] text-[#444746] ml-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-[#444746] rounded-full"></span>
              Sử dụng ít nhất 6 ký tự.
            </p>
          </div>

          <div className="flex items-center justify-between pt-8">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#0b57d0] font-semibold text-[14px] hover:bg-[#ebf2fc] px-4 py-2 rounded-lg transition-colors"
            >
              Đăng nhập thay thế
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Đang xử lý...' : (
                <>
                  Tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 flex gap-6 text-[12px] text-[#444746] font-medium">
        <span className="hover:underline cursor-pointer">Tiếng Việt</span>
        <span className="hover:underline cursor-pointer">Trợ giúp</span>
        <span className="hover:underline cursor-pointer">Bảo mật</span>
        <span className="hover:underline cursor-pointer">Điều khoản</span>
      </div>
    </div>
  );
};

export default Register;

