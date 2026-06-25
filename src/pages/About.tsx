import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Store, DollarSign, ShoppingBag, Coins, Truck, Headphones, ShieldCheck } from 'lucide-react';

interface TeamMember {
  name: string;
  roleKey: string;
  image: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function About() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  const stats = [
    {
      id: 1,
      icon: Store,
      value: "10.5k",
      labelKey: "about.activeSellers",
      highlight: false
    },
    {
      id: 2,
      icon: DollarSign,
      value: "33k",
      labelKey: "about.monthlySale",
      highlight: true
    },
    {
      id: 3,
      icon: ShoppingBag,
      value: "45.5k",
      labelKey: "about.activeCustomers",
      highlight: false
    },
    {
      id: 4,
      icon: Coins,
      value: "25k",
      labelKey: "about.grossSale",
      highlight: false
    }
  ];

  const team: TeamMember[] = [
    {
      name: "Tom Cruise",
      roleKey: "about.founder",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    },
    {
      name: "Emma Watson",
      roleKey: "about.managingDirector",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    },
    {
      name: "Will Smith",
      roleKey: "about.productDesigner",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-16">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400 py-4 flex gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-slate-600">{t('nav.home')}</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-zinc-200">{t('about.breadcrumbs')}</span>
      </div>

      {/* Our Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-normal">
            {t('about.ourStory')}
          </h1>
          <div className="space-y-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
            <p>{t('about.storyP1')}</p>
            <p>{t('about.storyP2')}</p>
          </div>
        </div>
        <div className="lg:col-span-7 bg-[#E07575]/10 rounded-lg overflow-hidden flex justify-center items-center">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80" 
            alt="Exclusive Shopping Story" 
            className="w-full h-auto max-h-[480px] object-cover"
          />
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={stat.id} 
              className={`flex flex-col items-center justify-center p-8 rounded border transition-all duration-300 group hover:-translate-y-1 ${
                stat.highlight 
                  ? 'bg-[#DB4444] border-[#DB4444] text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-[#DB4444] hover:border-[#DB4444] hover:text-white hover:shadow-lg dark:bg-[#131316] dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-[#DB4444]'
              }`}
            >
              <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors duration-300 ${
                stat.highlight 
                  ? 'bg-white/20 border-8 border-white/10' 
                  : 'bg-slate-100 group-hover:bg-white/20 group-hover:border-8 group-hover:border-white/10 dark:bg-zinc-800'
              }`}>
                <IconComponent className={`h-8 w-8 transition-colors duration-300 ${
                  stat.highlight 
                    ? 'text-white' 
                    : 'text-slate-800 group-hover:text-white dark:text-zinc-200'
                }`} />
              </div>
              <span className="text-3xl font-bold mt-4 tracking-tight">{stat.value}</span>
              <span className="text-xs text-center mt-2 opacity-90">{t(stat.labelKey)}</span>
            </div>
          );
        })}
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        {/* Desktop Team View */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="space-y-4">
              <div className="aspect-[3/4] bg-slate-50 dark:bg-zinc-900 rounded overflow-hidden flex items-end justify-center pt-8 px-4">
                <img src={member.image} alt={member.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">{t(member.roleKey)}</p>
                <div className="flex gap-4 pt-1">
                  <a href={member.twitter} className="text-slate-700 hover:text-[#DB4444] dark:text-zinc-300 dark:hover:text-[#DB4444]" aria-label="Twitter">
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                  <a href={member.instagram} className="text-slate-700 hover:text-[#DB4444] dark:text-zinc-300 dark:hover:text-[#DB4444]" aria-label="Instagram">
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                  <a href={member.linkedin} className="text-slate-700 hover:text-[#DB4444] dark:text-zinc-300 dark:hover:text-[#DB4444]" aria-label="LinkedIn">
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Team Slider */}
        <div className="md:hidden space-y-6">
          <div className="aspect-[3/4] bg-slate-50 dark:bg-zinc-900 rounded overflow-hidden flex items-end justify-center pt-8 px-4">
            <img src={team[activeSlide].image} alt={team[activeSlide].name} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="space-y-2 text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{team[activeSlide].name}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">{t(team[activeSlide].roleKey)}</p>
            <div className="flex gap-4 pt-2 justify-center">
              <a href={team[activeSlide].twitter} className="text-slate-700 hover:text-[#DB4444] dark:text-zinc-300 dark:hover:text-[#DB4444]" aria-label="Twitter">
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a href={team[activeSlide].instagram} className="text-slate-700 hover:text-[#DB4444] dark:text-zinc-300 dark:hover:text-[#DB4444]" aria-label="Instagram">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href={team[activeSlide].linkedin} className="text-slate-700 hover:text-[#DB4444] dark:text-zinc-300 dark:hover:text-[#DB4444]" aria-label="LinkedIn">
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          {team.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-3 w-3 rounded-full border-2 transition-all ${
                activeSlide === idx 
                  ? 'bg-[#DB4444] border-[#DB4444] scale-110' 
                  : 'bg-slate-300 border-transparent dark:bg-zinc-700'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <Truck className="h-7 w-7 text-white dark:text-black" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t('about.freeDeliveryTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {t('about.freeDeliveryDesc')}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <Headphones className="h-7 w-7 text-white dark:text-black" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t('about.customerServiceTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {t('about.customerServiceDesc')}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-white dark:text-black" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t('about.moneyBackTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {t('about.moneyBackDesc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
