import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';

const translations = {
  en: {
    breadcrumbsHome: "Home",
    breadcrumbsAccount: "My Account",
    title: "Profile",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    streetAddress: "Street address",
    passwordChanges: "Password Changes",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    successMsg: "Profile updated successfully!",
    errorMsg: "Failed to update profile",
    manageAccount: "Manage My Account",
    myProfile: "My Profile",
    addressBook: "Address Book",
    paymentOptions: "My Payment Options",
    myOrders: "My Orders",
    myReturns: "My Returns",
    myCancellations: "My Cancellations",
    myWishlist: "My WishList",
    uploadPhoto: "Upload Photo",
    loading: "Loading profile...",
    saving: "Saving changes...",
  },
  ru: {
    breadcrumbsHome: "Главная",
    breadcrumbsAccount: "Мой аккаунт",
    title: "Профиль",
    firstName: "Имя",
    lastName: "Фамилия",
    email: "Адрес электронной почты",
    streetAddress: "Адрес проживания (улица)",
    passwordChanges: "Изменение пароля",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmNewPassword: "Подтвердите новый пароль",
    cancel: "Отмена",
    saveChanges: "Сохранить изменения",
    successMsg: "Профиль успешно обновлен!",
    errorMsg: "Не удалось обновить профиль",
    manageAccount: "Управление аккаунтом",
    myProfile: "Мой профиль",
    addressBook: "Адресная книга",
    paymentOptions: "Способы оплаты",
    myOrders: "Мои заказы",
    myReturns: "Мои возвраты",
    myCancellations: "Мои отмены",
    myWishlist: "Мой список желаний",
    uploadPhoto: "Загрузить фото",
    loading: "Загрузка профиля...",
    saving: "Сохранение изменений...",
  },
  tg: {
    breadcrumbsHome: "Асосӣ",
    breadcrumbsAccount: "Аккаунти ман",
    title: "Маълумоти шахсӣ",
    firstName: "Ном",
    lastName: "Насаб",
    email: "Суроғаи электронӣ",
    streetAddress: "Суроғаи истиқомат (кӯча)",
    passwordChanges: "Ивази парол",
    currentPassword: "Пароли ҷорӣ",
    newPassword: "Пароли нав",
    confirmNewPassword: "Тасдиқи пароли нав",
    cancel: "Инкор кардан",
    saveChanges: "Ҳифзи тағйирот",
    successMsg: "Маълумот бомуваффақият нав карда шуд!",
    errorMsg: "Навсозии маълумот ноком шуд",
    manageAccount: "Идоракунии аккаунт",
    myProfile: "Профили ман",
    addressBook: "Дафтари суроғаҳо",
    paymentOptions: "Имконоти пардохт",
    myOrders: "Фармоишҳои ман",
    myReturns: "Бозгаштҳо",
    myCancellations: "Лағви фармоишҳо",
    myWishlist: "Рӯйхати хоҳишҳо",
    uploadPhoto: "Боргузории акс",
    loading: "Боркунии профил...",
    saving: "Ҳифзи тағйирот...",
  }
};

export default function Account() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isAuthenticated,
    userProfile,
    fetchUserProfile,
    updateUserProfile,
    loading: storeLoading,
    error: storeError,
    language
  } = useStore();

  const activeLang = language === 'ru' ? 'ru' : language === 'tg' ? 'tg' : 'en';
  const t = translations[activeLang];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dob: '2000-01-01',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        dob: userProfile.dob ? userProfile.dob.split('T')[0] : '2000-01-01',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (userProfile?.image) {
      if (userProfile.image.startsWith('http')) return userProfile.image;
      const apiBase = import.meta.env.VITE_API_URL || 'https://store-api.softclub.tj';
      return `${apiBase}/${userProfile.image.replace(/^\/+/, '')}`;
    }
    return null;
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        dob: userProfile.dob ? userProfile.dob.split('T')[0] : '2000-01-01',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setSuccessAlert(null);
      setErrorAlert(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessAlert(null);
    setErrorAlert(null);

    if (formData.newPassword || formData.confirmNewPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        setErrorAlert(activeLang === 'ru' ? 'Пароли не совпадают!' : activeLang === 'tg' ? 'Паролҳо мувофиқат намекунанд!' : 'Passwords do not match!');
        return;
      }
    }

    setIsSaving(true);
    const success = await updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dob: formData.dob,
      imageFile: imageFile
    });

    setIsSaving(false);

    if (success) {
      setSuccessAlert(t.successMsg);
      // clear password inputs
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
      setTimeout(() => setSuccessAlert(null), 5000);
    } else {
      setErrorAlert(storeError || t.errorMsg);
    }
  };

  if (storeLoading && !userProfile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader className="h-10 w-10 animate-spin text-[#DB4444]" />
        <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">{t.loading}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 text-slate-800 dark:text-zinc-200 transition-colors duration-200">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5 items-center">
        <Link to="/" className="hover:text-slate-600 transition-colors">{t.breadcrumbsHome}</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">{t.breadcrumbsAccount}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Sidebar Nav */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {t.manageAccount}
            </h3>
            <ul className="space-y-2 pl-4 text-xs font-semibold">
              <li>
                <Link to="/account" className="text-[#DB4444] transition-colors">
                  {t.myProfile}
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-zinc-500 cursor-not-allowed">
                  {t.addressBook}
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-zinc-500 cursor-not-allowed">
                  {t.paymentOptions}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {t.myOrders}
            </h3>
            <ul className="space-y-2 pl-4 text-xs font-semibold">
              <li>
                <span className="text-slate-400 dark:text-zinc-500 cursor-not-allowed">
                  {t.myReturns}
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-zinc-500 cursor-not-allowed">
                  {t.myCancellations}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <Link to="/wishlist" className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider hover:text-[#DB4444] transition-colors">
              {t.myWishlist}
            </Link>
          </div>
        </div>

        {/* Profile Card Form */}
        <div className="md:col-span-3">
          <div className="rounded-sm bg-white p-6 shadow-sm border border-slate-100 dark:bg-[#131316] dark:border-zinc-800/80 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 dark:border-zinc-800/50 pb-6 mb-6 gap-4">
              <h2 className="text-lg font-bold text-[#DB4444] uppercase tracking-wide">
                {t.title}
              </h2>

              {/* Profile Image Upload Component */}
              <div className="flex items-center gap-3">
                <div
                  onClick={triggerFileInput}
                  className="relative group h-14 w-14 rounded-full border-2 border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-850 overflow-hidden cursor-pointer shadow-xs hover:border-[#DB4444] dark:hover:border-[#DB4444] transition-all"
                >
                  {getImageUrl() ? (
                    <img
                      src={getImageUrl()!}
                      alt="Avatar"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-zinc-500">
                      <Camera className="h-5 w-5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="text-xs font-semibold text-[#DB4444] hover:text-[#C33B3B] transition-colors cursor-pointer"
                  >
                    {t.uploadPhoto}
                  </button>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">JPG, PNG, GIF</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Notification Alerts */}
            {successAlert && (
              <div className="mb-6 flex items-center gap-2 rounded bg-emerald-50 p-3.5 text-xs text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 font-medium animate-fade-in">
                <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{successAlert}</span>
              </div>
            )}

            {errorAlert && (
              <div className="mb-6 flex items-center gap-2 rounded bg-red-50 p-3.5 text-xs text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/30 font-medium animate-fade-in">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{errorAlert}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fields Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">
                    {t.firstName}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded bg-slate-50 border border-slate-200 dark:bg-zinc-800/40 dark:border-zinc-800 dark:text-zinc-150 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">
                    {t.lastName}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded bg-slate-50 border border-slate-200 dark:bg-zinc-800/40 dark:border-zinc-800 dark:text-zinc-150 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded bg-slate-50 border border-slate-200 dark:bg-zinc-800/40 dark:border-zinc-800 dark:text-zinc-150 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">
                    {t.streetAddress}
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded bg-slate-50 border border-slate-200 dark:bg-[#1f1f23] dark:border-zinc-800 dark:text-zinc-150 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] transition-colors"
                  />
                </div>
              </div>

              {/* Password Changes Section */}
              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-zinc-800/30">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.passwordChanges}
                </h3>

                <div className="space-y-1.5">
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder={t.currentPassword}
                    className="w-full rounded bg-slate-50 border border-slate-200 dark:bg-[#1f1f23] dark:border-zinc-800 dark:text-zinc-150 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder={t.newPassword}
                      className="w-full rounded bg-slate-50 border border-slate-200 dark:bg-[#1f1f23] dark:border-zinc-800 dark:text-zinc-150 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      placeholder={t.confirmNewPassword}
                      className="w-full rounded bg-slate-50 border border-slate-200 dark:bg-[#1f1f23] dark:border-zinc-800 dark:text-zinc-150 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full sm:w-auto text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer py-2.5 text-center disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto rounded bg-[#DB4444] hover:bg-[#C33B3B] py-2.5 px-8 text-xs font-semibold text-white transition-colors duration-200 cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader className="h-3 w-3 animate-spin" />
                      <span>{t.saving}</span>
                    </>
                  ) : (
                    <span>{t.saveChanges}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
