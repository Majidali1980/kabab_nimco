import React, { useState } from 'react';
import { Lock, Mail, Key, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Target credentials: alimajid03021980@gmail.com / 12345678
    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (trimmedEmail === 'alimajid03021980@gmail.com' && trimmedPassword === '12345678') {
        // Save session
        const authData = {
          email: trimmedEmail,
          authenticated: true,
          timestamp: Date.now()
        };
        
        if (rememberMe) {
          localStorage.setItem('nk_admin_auth', JSON.stringify(authData));
        } else {
          sessionStorage.setItem('nk_admin_auth', JSON.stringify(authData));
        }
        
        setIsLoading(false);
        onSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials. Please enter the authorized administrator email and password.');
      }
    }, 400);
  };

  const handleFillCredentials = () => {
    setEmail('alimajid03021980@gmail.com');
    setPassword('12345678');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF7F0] border border-[#DDD4CA] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#801414] via-[#6B1111] to-[#4A0A0A] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white font-display">
                  Administrator Portal
                </h3>
                <p className="text-xs text-amber-200/80 font-medium">
                  Authentication & Access Verification
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A70]" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-white border border-[#DDD4CA] focus:border-[#801414] focus:ring-2 focus:ring-[#801414]/10 text-xs font-medium text-[#2D1A16] pl-10 pr-3 py-3 rounded-2xl outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#3D2821]">
                Master Password
              </label>
            </div>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A70]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#DDD4CA] focus:border-[#801414] focus:ring-2 focus:ring-[#801414]/10 text-xs font-medium text-[#2D1A16] pl-10 pr-10 py-3 rounded-2xl outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#3D2821]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-[#5A453D] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#DDD4CA] text-[#801414] focus:ring-[#801414]"
              />
              <span>Remember session on this device</span>
            </label>

            <button
              type="button"
              onClick={handleFillCredentials}
              className="text-[11px] text-[#801414] hover:underline font-bold"
            >
              Fill Credentials
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#801414] hover:bg-[#681010] text-white font-bold text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Authenticate & Enter Admin Panel</span>
                </>
              )}
            </button>
          </div>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-transparent hover:bg-stone-200/50 text-[#7A6860] font-bold text-xs py-2 rounded-2xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
        </form>

        {/* Security Notice Footer */}
        <div className="bg-[#F2EBDC] px-6 py-3 border-t border-[#E8DFC8] flex items-center justify-between text-[11px] text-[#7A6860]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Protected Administrator Session
          </span>
          <span className="font-mono text-[10px] text-stone-500">v2.4 ERP</span>
        </div>
      </div>
    </div>
  );
};
