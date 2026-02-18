import React, { useState, useEffect, useMemo } from 'react';
import { Lock, X, CheckCircle2, ShieldCheck } from 'lucide-react';

const SnoozeAuthModal = ({ isOpen, onClose, onAuthenticated, mode = 'verify' }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSetup, setIsSetup] = useState(mode === 'setup');
  const inputRefs = useMemo(() => [
    React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef()
  ], []);

  useEffect(() => {
    if (isOpen) {
      const savedPin = localStorage.getItem('snooze_pin');
      if (!savedPin && mode === 'verify') {
        setIsSetup(true);
      } else if (savedPin && mode === 'setup') {
        setIsSetup(false);
      }
      // Focus first input
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } else {
      setPin(['', '', '', '', '', '']);
      setError('');
    }
  }, [isOpen, mode, inputRefs]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    // Auto focus next
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pinString = pin.join('');
    
    if (pinString.length !== 6) {
      setError('Vui lòng nhập đủ 6 số');
      return;
    }

    if (isSetup) {
      localStorage.setItem('snooze_pin', pinString);
      onAuthenticated();
    } else {
      const savedPin = localStorage.getItem('snooze_pin');
      if (pinString === savedPin) {
        onAuthenticated();
      } else {
        setError('Mã PIN không chính xác');
        setPin(['', '', '', '', '', '']);
        inputRefs[0].current.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in font-hand">
      <div className="parchment-modal w-full max-w-md p-8 transform transition-all animate-slide-up relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-all text-[var(--text-soft)]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-6 ${isSetup ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
            {isSetup ? <ShieldCheck className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
          </div>

          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-2 font-logo">
            {isSetup ? 'Thiết lập bảo trì' : 'Xác thực hòm thư'}
          </h3>
          <p className="text-lg text-[var(--text-soft)] mb-8 italic">
            {isSetup 
              ? 'Tạo mã PIN 6 số để bảo vệ những bức thư đang tạm ẩn.' 
              : 'Vui lòng nhập mã PIN để mở hòm thư tạm ẩn.'}
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex justify-between gap-2 mb-8">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all outline-none ${
                    error ? 'border-red-300 bg-red-50 text-red-600' : 'border-[var(--border-medium)] focus:border-[var(--accent-blue)] bg-white'
                  }`}
                />
              ))}
            </div>

            {error && <p className="text-red-500 mb-6 font-bold">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[var(--accent-blue)] text-white font-bold text-xl font-logo hover:bg-[var(--accent-blue)]/90 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6" />
              {isSetup ? 'Xác nhận mã PIN' : 'Mở hòm thư'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SnoozeAuthModal;
