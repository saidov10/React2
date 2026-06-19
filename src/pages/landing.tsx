import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../components/theme-provider';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  WifiOff, 
  BarChart3, 
  ShieldCheck, 
  Globe,
  UserPlus,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Menu,
  X,
  Lock,
  Scale,
  LogIn,
  Sun,
  Moon,
  Monitor,
  Languages
} from 'lucide-react';

function AnimatedNetworkLight() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const count = 40;
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    return [pos, pos.slice()];
  }, []);

  const lineIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (Math.random() > 0.93) {
          indices.push(i, j);
        }
      }
    }
    return new Uint16Array(indices);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current && linesRef.current) {
      pointsRef.current.rotation.y = time * 0.03;
      pointsRef.current.rotation.x = time * 0.01;
      linesRef.current.rotation.y = time * 0.03;
      linesRef.current.rotation.x = time * 0.01;
    }

    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        posAttr.array[i3] = initialPositions[i3] + Math.sin(time * 0.3 + i) * 0.1;
        posAttr.array[i3 + 1] = initialPositions[i3 + 1] + Math.cos(time * 0.3 + i) * 0.1;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -1]}> 
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#3b82f6" size={0.18} sizeAttenuation={true} transparent opacity={0.6} />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="index" args={[lineIndices, 1]} />
        </bufferGeometry>
        <lineBasicMaterial color="#1d4ed8" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const langs = ['en', 'ru', 'tg'];
    const currentLang = i18n.language ? i18n.language.substring(0, 2) : 'en';
    const currentIndex = langs.includes(currentLang) ? langs.indexOf(currentLang) : 0;
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const featuresData = [
    {
      icon: <BookOpen size={20} />,
      title: t('pages.landing.features.debtBook.title'),
      desc: t('pages.landing.features.debtBook.desc'),
    },
    {
      icon: <Users size={20} />,
      title: t('pages.landing.features.contactsManager.title'),
      desc: t('pages.landing.features.contactsManager.desc'),
    },
    {
      icon: <WifiOff size={20} />,
      title: t('pages.landing.features.offlineMode.title'),
      desc: t('pages.landing.features.offlineMode.desc'),
    },
    {
      icon: <BarChart3 size={20} />,
      title: t('pages.landing.features.analytics.title'),
      desc: t('pages.landing.features.analytics.desc'),
    },
    {
      icon: <ShieldCheck size={20} />,
      title: t('pages.landing.features.securePrivate.title'),
      desc: t('pages.landing.features.securePrivate.desc'),
    },
    {
      icon: <Globe size={20} />,
      title: t('pages.landing.features.multilanguage.title'),
      desc: t('pages.landing.features.multilanguage.desc'),
    },
  ];

  const stepsData = [
    {
      num: '01',
      icon: <UserPlus size={18} />,
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-t-blue-500',
      title: t('pages.landing.steps.step1.title'),
      desc: t('pages.landing.steps.step1.desc'),
    },
    {
      num: '02',
      icon: <PlusCircle size={18} />,
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-t-amber-500',
      title: t('pages.landing.steps.step2.title'),
      desc: t('pages.landing.steps.step2.desc'),
    },
    {
      num: '03',
      icon: <TrendingUp size={18} />,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-t-indigo-500',
      title: t('pages.landing.steps.step3.title'),
      desc: t('pages.landing.steps.step3.desc'),
    },
    {
      num: '04',
      icon: <CheckCircle2 size={18} />,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-t-emerald-500',
      title: t('pages.landing.steps.step4.title'),
      desc: t('pages.landing.steps.step4.desc'),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/20 overflow-x-hidden transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col justify-between bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-slate-50 to-slate-50 dark:from-blue-950/30 dark:via-[#030712] dark:to-[#030712]">
        
        {/* 3D background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={1.5} />
            <AnimatedNetworkLight />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:via-[#030712]/50 dark:to-[#030712]" />
        </div>

        {/* Header */}
        <header className="relative z-50 flex items-center justify-between px-6 py-5 md:px-16 max-w-7xl w-full mx-auto border-b border-slate-200/50 dark:border-slate-900/50">
          
          {/* Logo with emerald scale icon inside white circle */}
          <div className="flex items-center space-x-2 text-xl font-bold tracking-wider text-slate-950 dark:text-white">
            <NavLink to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white flex items-center justify-center shadow-sm">
                <Scale className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-slate-900 dark:text-white font-extrabold text-lg">Adl 5:8</span>
            </NavLink>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.features')}</a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.howItWorks')}</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.feedback')}</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.pricing')}</a>
          </nav>

          {/* Right actions: Language, Theme toggle, Sign Up link, Login button */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            
            {/* Language Toggler (Translate Icon + EN/RU/TG) */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Languages className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span>{i18n.language ? i18n.language.substring(0, 2).toUpperCase() : 'EN'}</span>
            </button>

            {/* Circular Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#0b0f19] hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm transition-all"
              title={t('theme.toggle')}
            >
              {theme === 'light' && <Sun className="h-4 w-4 text-amber-500 fill-amber-500/10" />}
              {theme === 'dark' && <Moon className="h-4 w-4 text-blue-400 fill-blue-400/10" />}
              {theme === 'system' && <Monitor className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
            </button>

            <NavLink to="/signup" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white text-sm font-semibold transition-colors">
              {t('nav.signup')}
            </NavLink>

            <NavLink 
              to="/login" 
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all"
            >
              <LogIn className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              {t('nav.login')}
            </NavLink>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition z-50 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-lg z-40 flex flex-col justify-between p-6 pt-24 md:hidden">
            <nav className="flex flex-col space-y-6 text-lg font-semibold text-slate-800 dark:text-slate-200">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="border-b pb-2 border-slate-200 dark:border-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.features')}</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="border-b pb-2 border-slate-200 dark:border-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.howItWorks')}</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="border-b pb-2 border-slate-200 dark:border-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.feedback')}</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="border-b pb-2 border-slate-200 dark:border-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.pricing')}</a>
            </nav>
            <div className="flex flex-col space-y-3 pb-8">
              <button onClick={toggleLanguage} className="w-full py-2.5 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-700 dark:text-slate-300">
                <Languages size={16} /> {t('language.toggle')}: {i18n.language ? i18n.language.substring(0, 2).toUpperCase() : 'EN'}
              </button>
              <button onClick={toggleTheme} className="w-full py-2.5 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-700 dark:text-slate-300">
                {theme === 'light' && <Sun size={16} />}
                {theme === 'dark' && <Moon size={16} />}
                {theme === 'system' && <Monitor size={16} />}
                {t('theme.' + theme)}
              </button>
              <NavLink to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg">{t('nav.signup')}</NavLink>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 font-semibold bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/15">{t('nav.login')}</NavLink>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 max-w-7xl w-full mx-auto py-12 md:py-20">
          <div className="max-w-2xl space-y-6 text-left">
            
            <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-blue-600 dark:text-blue-400 backdrop-blur-md">
              <Lock size={12} className="text-blue-600 dark:text-blue-400" />
              {t('pages.landing.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
              {t('pages.landing.heroTitle1')} <br />
              <span className="text-slate-950 dark:text-white">{t('pages.landing.heroTitle2')}</span> <br />
              <span className="text-blue-600 dark:text-blue-500 font-serif italic font-normal">
                {t('pages.landing.heroTitleAccent')}
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-md leading-relaxed">
              {t('pages.landing.heroDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-full transition shadow-lg shadow-blue-600/20 cursor-pointer">
                {t('pages.landing.heroBtnPrimary')} <ArrowRight size={16} />
              </button>
              <button className="w-full sm:w-auto bg-white hover:bg-slate-100 dark:bg-[#0a0f24]/80 dark:hover:bg-[#11183c]/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold px-6 py-3 rounded-full transition cursor-pointer">
                {t('pages.landing.heroBtnSecondary')}
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:block"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 md:px-16 max-w-7xl w-full mx-auto py-16 md:py-24">
        <div className="text-center space-y-2 mb-12 md:mb-16">
          <span className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-500 uppercase">{t('nav.features')}</span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('pages.landing.featuresHeading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featuresData.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0a0f24]/50 border border-slate-200/60 dark:border-slate-900 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md dark:hover:border-slate-800 transition duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-105 transition">
                {item.icon}
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 pt-12 border-t border-slate-200 dark:border-slate-900 text-center">
          <div>
            <div className="text-2xl md:text-5xl font-black text-blue-600 dark:text-blue-500">10K+</div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-bold mt-1 text-slate-850 dark:text-slate-300">{t('pages.landing.stats.activeUsers.label')}</div>
            <p className="text-slate-500 text-[11px] mt-0.5">{t('pages.landing.stats.activeUsers.desc')}</p>
          </div>
          <div>
            <div className="text-2xl md:text-5xl font-black text-blue-600 dark:text-blue-500">50K+</div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-bold mt-1 text-slate-850 dark:text-slate-300">{t('pages.landing.stats.trackedDebts.label')}</div>
            <p className="text-slate-500 text-[11px] mt-0.5">{t('pages.landing.stats.trackedDebts.desc')}</p>
          </div>
          <div>
            <div className="text-2xl md:text-5xl font-black text-blue-600 dark:text-blue-500">99.9%</div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-bold mt-1 text-slate-850 dark:text-slate-300">{t('pages.landing.stats.uptime.label')}</div>
            <p className="text-slate-500 text-[11px] mt-0.5">{t('pages.landing.stats.uptime.desc')}</p>
          </div>
          <div>
            <div className="text-2xl md:text-5xl font-black text-blue-600 dark:text-blue-500">3</div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-bold mt-1 text-slate-855 dark:text-slate-300">{t('pages.landing.stats.languages.label')}</div>
            <p className="text-slate-500 text-[11px] mt-0.5">{t('pages.landing.stats.languages.desc')}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-16 max-w-7xl w-full mx-auto py-16 md:py-24">
        <div className="text-center space-y-2 mb-12 md:mb-16">
          <span className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-500 uppercase">{t('nav.howItWorks')}</span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('pages.landing.howItWorksHeading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stepsData.map((step, idx) => (
            <div key={idx} className={`relative bg-white dark:bg-[#0b0f19]/70 backdrop-blur-md border border-slate-200 dark:border-slate-900 rounded-xl p-5 md:p-6 flex flex-col justify-between min-h-[190px] md:min-h-[210px] shadow-sm transition-all duration-300 hover:shadow-md dark:hover:border-slate-800 ${step.borderColor}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 ${step.iconColor}`}>
                    {step.icon}
                  </div>
                  <span className="text-3xl md:text-4xl font-black text-slate-200 dark:text-white dark:opacity-10 select-none">{step.num}</span>
                </div>
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-1">{step.title}</h3>
                <p className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-16 max-w-5xl w-full mx-auto py-12 md:py-16">
        <div className="bg-gradient-to-b from-blue-50/50 to-slate-50 border border-blue-100 dark:from-[#0a0f24] dark:to-[#04060d] dark:border-blue-950/60 rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-xl dark:shadow-2xl">
          <h2 className="text-xl md:text-3xl font-extrabold max-w-xl mx-auto text-slate-900 dark:text-white leading-snug">
            {t('pages.landing.cta.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm max-w-md mx-auto">
            {t('pages.landing.cta.desc', { appName: 'Adl 5:8' })}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg shadow-blue-600/20 cursor-pointer">
              {t('pages.landing.cta.btnPrimary')}
            </button>
            <button className="w-full sm:w-auto bg-white hover:bg-slate-55 dark:bg-[#0a0f24] dark:hover:bg-[#11183c] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-full text-sm font-semibold transition cursor-pointer">
              {t('pages.landing.cta.btnSecondary')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-900/60 bg-white dark:bg-[#02040a] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-3">
            <div className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-1.5">
              <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs shadow-md shadow-blue-500/10">Adl 5:8</span>
            </div>
            <p className="max-w-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {t('pages.landing.footer.desc')}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-950 dark:text-white font-bold uppercase tracking-wider text-[10px]">{t('pages.landing.footer.product')}</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('nav.features')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('nav.dashboard')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('nav.pricing')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('nav.contacts')}</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-950 dark:text-white font-bold uppercase tracking-wider text-[10px]">{t('pages.landing.footer.company')}</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.aboutUs')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.blog')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.jobs')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.press')}</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-950 dark:text-white font-bold uppercase tracking-wider text-[10px]">{t('pages.landing.footer.support')}</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.docs')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.contact')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.announcements')}</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 border-t border-slate-200 dark:border-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <div className="text-center sm:text-left text-slate-500">© 2024 Adl 5:8 Financial Management. All rights reserved.</div>
          <div className="flex space-x-6 text-slate-500">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.privacy')}</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">{t('pages.landing.footer.terms')}</a>
            <a href="#" className="hover:text-blue-500 transition-colors">{t('pages.landing.footer.cookies')}</a>
          </div>
        </div>
      </footer>

    </div>
  );
}