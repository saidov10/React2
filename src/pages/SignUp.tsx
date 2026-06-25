import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, error: apiError, loading, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const success = await register(formData);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-[#0A0A0B] py-12 md:py-20 px-4 transition-colors duration-200">
      <div className="w-full max-w-[370px] space-y-8">
        {/* Header Section */}
        <div className="space-y-2 text-left">
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white">
            {t('auth.createAccount')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal">
            {t('auth.enterDetails')}
          </p>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="rounded bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400 font-medium">
            {typeof apiError === 'object' ? JSON.stringify(apiError) : apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder={t('auth.name') + ' *'}
              className={`w-full rounded border bg-transparent px-4 py-3 text-sm outline-none transition-colors dark:text-white
                ${errors.userName 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-300 focus:border-[#DB4444] dark:border-zinc-800 dark:focus:border-[#DB4444]'
                }`}
            />
            {errors.userName && (
              <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.userName}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email *"
              className={`w-full rounded border bg-transparent px-4 py-3 text-sm outline-none transition-colors dark:text-white
                ${errors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-300 focus:border-[#DB4444] dark:border-zinc-800 dark:focus:border-[#DB4444]'
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="relative">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number *"
              className={`w-full rounded border bg-transparent px-4 py-3 text-sm outline-none transition-colors dark:text-white
                ${errors.phoneNumber 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-300 focus:border-[#DB4444] dark:border-zinc-800 dark:focus:border-[#DB4444]'
                }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.password') + ' *'}
              className={`w-full rounded border bg-transparent pl-4 pr-10 py-3 text-sm outline-none transition-colors dark:text-white
                ${errors.password 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-300 focus:border-[#DB4444] dark:border-zinc-800 dark:focus:border-[#DB4444]'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
            {errors.password && (
              <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password *"
              className={`w-full rounded border bg-transparent pl-4 pr-10 py-3 text-sm outline-none transition-colors dark:text-white
                ${errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-300 focus:border-[#DB4444] dark:border-zinc-800 dark:focus:border-[#DB4444]'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#DB4444] hover:bg-[#C33B3B] py-3.5 text-sm font-semibold text-white transition-colors duration-200 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? 'Registering...' : t('auth.createAccountBtn')}
          </button>
        </form>

        {/* Footer Redirect Link */}
        <div className="text-center text-xs text-slate-500 dark:text-zinc-400 font-normal">
          <span>{t('auth.alreadyHaveAccount')}{' '}</span>
          <Link
            to="/login"
            className="text-slate-800 dark:text-zinc-200 underline font-medium hover:text-[#DB4444] dark:hover:text-[#DB4444] transition-colors"
          >
            {t('auth.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
