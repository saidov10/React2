import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { axiosRequest, saveToken } from '../utils/token';

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

function getPasswordStrength(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: '', color: '' };
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 1) return { score: 1, label: 'Poor',   color: 'bg-red-500' };
  if (s === 2) return { score: 2, label: 'Fair',   color: 'bg-amber-500' };
  if (s === 3) return { score: 3, label: 'Good',   color: 'bg-blue-500' };
  return         { score: 4, label: 'Strong', color: 'bg-emerald-500' };
}

/* ── Shared input className — single input, dark: variants handle theming ── */
const input = (err?: boolean) => `
  w-full px-4 py-3 rounded-xl text-sm border
  focus:outline-none focus:ring-2 transition-all duration-200
  bg-white border-slate-200 text-slate-900 placeholder-slate-400
  focus:ring-blue-400/40 focus:border-blue-400
  dark:bg-[#232c40] dark:border-[#2f3d58] dark:text-white dark:placeholder-slate-500
  dark:focus:ring-blue-500/50 dark:focus:border-blue-500/60
  ${err ? 'border-red-500 focus:ring-red-400/40 focus:border-red-400 dark:border-red-500' : ''}
`.trim();

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  /* watch password for strength bar — no external useState needed */
  const passwordValue = watch('password', '');
  const strength = getPasswordStrength(passwordValue ?? '');

  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await axiosRequest.post('auth/register', {
        name:     data.name,
        email:    data.email,
        password: data.password,
      });

      const token = res.data?.accessToken;

      if (token) {
        saveToken(token);
        if (res.data?.user) {
          localStorage.setItem('user_info', JSON.stringify(res.data.user));
        }
        toast.success(t('signup.successToast', 'Account created successfully! 🎉'));
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(t('signup.errorToast', 'Registration failed. Please try again.'));
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t('signup.errorToast', 'Registration failed. Please try again.');
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-8">

      {/* ── DARK background orbs ── */}
      <div className="absolute inset-0 z-0 hidden dark:block bg-[#0d1117]">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #134e4a 0%, #065f46 40%, transparent 70%)', filter: 'blur(90px)', opacity: 0.5 }} />
        <div className="absolute -bottom-32 -right-16 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #92400e 0%, #b45309 40%, transparent 70%)', filter: 'blur(90px)', opacity: 0.5 }} />
      </div>

      {/* ── LIGHT background orbs ── */}
      <div className="absolute inset-0 z-0 block dark:hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #bfdbfe 0%, #c7d2fe 40%, transparent 70%)', filter: 'blur(80px)', opacity: 0.8 }} />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fed7aa 0%, #fde8d8 40%, transparent 70%)', filter: 'blur(80px)', opacity: 0.9 }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fecdd3 0%, transparent 70%)', filter: 'blur(70px)', opacity: 0.7 }} />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-sm mx-4 sm:mx-auto">
        <div className="rounded-2xl px-8 py-10 backdrop-blur-xl bg-white/90 border border-slate-200/80 shadow-xl dark:bg-[#1c2233]/90 dark:border-[#2a3347] dark:shadow-2xl">

          {/* Logo */}
          <div className="flex flex-col items-center mb-7 gap-1">
            <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-md bg-white border-slate-200 dark:border-slate-600/60 dark:bg-[#1e2738]">
              <Scale className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-300">Adl 5:8</span>
          </div>

          {/* Title row */}
          <div className="flex items-baseline justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('signup.title', 'Sign up')}
            </h1>
            <NavLink to="/login" className="text-sm text-blue-500 hover:text-blue-400 transition-colors font-medium">
              {t('signup.haveAccount', 'Already have an account?')}
            </NavLink>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('signup.fullName', 'Full Name')}*
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                placeholder={t('signup.fullNamePlaceholder', 'Enter full name')}
                className={input(!!errors.name)}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('signup.email', 'Email')}*
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                })}
                type="email"
                placeholder={t('signup.emailPlaceholder', 'Enter email address')}
                className={input(!!errors.email)}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                {t('login.password', 'Password')}*
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  className={`${input(!!errors.password)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}

              {/* Password strength bar — driven by watch(), no external state */}
              {(passwordValue?.length ?? 0) > 0 && (
                <div className="flex items-center gap-3 pt-1.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-semibold w-10 text-right ${
                    strength.score === 1 ? 'text-red-500' :
                    strength.score === 2 ? 'text-amber-500' :
                    strength.score === 3 ? 'text-blue-500' : 'text-emerald-500'
                  }`}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 pt-1">
              {t('signup.termsPrefix', 'By Signing up, you agree to our')}{' '}
              <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
                {t('signup.termsOfService', 'Terms of Service')}
              </a>{' '}
              {t('signup.termsAnd', 'and')}{' '}
              <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
                {t('signup.privacyPolicy', 'Privacy Policy')}
              </a>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isSubmitting
                ? t('signup.creating', 'Creating...')
                : t('signup.createAccount', 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
