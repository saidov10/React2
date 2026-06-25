import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black py-16 text-xs text-white dark:bg-zinc-950 dark:border-t dark:border-zinc-800">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-wider">Exclusive</h3>
          <p className="font-semibold text-sm">Subscribe</p>
          <p className="text-slate-400">Get 10% off your first order</p>
          <div className="relative max-w-[200px]">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded border border-white bg-transparent py-2.5 pl-3 pr-10 text-xs text-white outline-none placeholder:text-slate-500"
            />
            <button className="absolute right-3 top-3" aria-label="Subscribe email">
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-100">Support</h3>
          <p className="text-slate-400 leading-relaxed">
            111 Bijoy sarani, Dhaka,
            <br />
            DH 1515, Bangladesh.
          </p>
          <p className="text-slate-400">exclusive@gmail.com</p>
          <p className="text-slate-400">+88015-88888-9999</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-100">Account</h3>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <Link to="/checkout" className="hover:text-white transition-colors">My Account</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors">Shop</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-100">Quick Link</h3>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">Terms Of Use</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">FAQ</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4 sm:col-span-2 md:col-span-4 lg:col-span-1">
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-100">Social</h3>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-zinc-900 pt-6 text-center text-zinc-600 dark:border-zinc-800">
        <p>&copy; Copyright Rintel 2026. All rights reserved.</p>
      </div>
    </footer>
  );
}
