import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Bikin Poster', path: '/generate' },
    { name: 'Tembok Warga', path: '/pinboard' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-brand-paper border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brand-red border-2 border-black shadow-hard-sm flex items-center justify-center text-white font-display font-bold text-2xl transform group-hover:rotate-3 transition-transform">
                !
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl tracking-tighter text-black leading-none uppercase">
                  Anti-Judol
                </span>
                <span className="font-mono text-xs font-bold bg-black text-white px-1 w-fit">INDONESIA</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 font-mono font-bold text-sm uppercase tracking-wide border-2 transition-all duration-150 ${
                    isActive(link.path) 
                      ? 'bg-brand-yellow border-black text-black shadow-hard-sm transform -translate-y-1' 
                      : 'border-transparent text-neutral-600 hover:text-black hover:underline decoration-2 underline-offset-4'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* GitHub Link */}
            <a 
              href="https://github.com/yellowduk/antidol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-black hover:text-brand-red transition-colors"
              aria-label="GitHub Repo"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black border-2 border-black p-1 shadow-hard-sm active:translate-y-1 active:shadow-none focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-paper border-b-4 border-black">
          <div className="px-2 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 border-2 font-mono font-bold uppercase ${
                   isActive(link.path)
                    ? 'bg-brand-yellow border-black text-black shadow-hard-sm'
                    : 'bg-white border-black text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <a 
              href="https://github.com/yellowduk/antidol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block px-4 py-3 border-2 border-black bg-black text-white font-mono font-bold uppercase hover:bg-neutral-800"
            >
              GitHub Repo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};