import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API request
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-slate-600">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">{t('contact.breadcrumbs')}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Call/Write Info */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded p-8 space-y-6 shadow-xs dark:bg-[#131316] dark:border-zinc-800">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[#DB4444] flex items-center justify-center text-white shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('contact.callToUs')}</h2>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-normal leading-relaxed">
              <p>{t('contact.available')}</p>
              <p>{t('contact.phone')}</p>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-zinc-800" />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[#DB4444] flex items-center justify-center text-white shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('contact.writeToUs')}</h2>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-normal leading-relaxed">
              <p>{t('contact.formDesc')}</p>
              <p>{t('contact.customerEmail')}</p>
              <p>{t('contact.supportEmail')}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded p-8 shadow-xs dark:bg-[#131316] dark:border-zinc-800 relative">
          {isSent && (
            <div className="absolute inset-0 bg-white/95 dark:bg-[#131316]/95 rounded flex flex-col items-center justify-center space-y-3 z-10 transition-all duration-300">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('contact.successTitle')}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{t('contact.successDesc')}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('contact.namePlaceholder')}
                className="w-full rounded bg-slate-50 dark:bg-zinc-900 py-3 px-4 text-xs text-slate-800 outline-none border border-transparent focus:border-[#DB4444] dark:text-zinc-100"
              />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.emailPlaceholder')}
                className="w-full rounded bg-slate-50 dark:bg-zinc-900 py-3 px-4 text-xs text-slate-800 outline-none border border-transparent focus:border-[#DB4444] dark:text-zinc-100"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('contact.phonePlaceholder')}
                className="w-full rounded bg-slate-50 dark:bg-zinc-900 py-3 px-4 text-xs text-slate-800 outline-none border border-transparent focus:border-[#DB4444] dark:text-zinc-100"
              />
            </div>

            {/* Message Textarea */}
            <textarea
              required
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('contact.messagePlaceholder')}
              rows={6}
              className="w-full rounded bg-slate-50 dark:bg-zinc-900 py-3 px-4 text-xs text-slate-800 outline-none border border-transparent focus:border-[#DB4444] dark:text-zinc-100 resize-none h-40"
            ></textarea>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded bg-[#DB4444] hover:bg-[#C33B3B] px-8 py-3 text-xs font-bold text-white transition-colors duration-200 cursor-pointer shadow-xs"
              >
                {t('contact.sendButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
