import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="text-white text-2xl font-bold hover:text-purple-400 transition-colors">
              BBX821
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#about" text="关于" />
            <NavLink href="#skills" text="技能" />
            <NavLink href="#experience" text="经历" />
            <NavLink href="#contact" text="联系" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-purple-500/20 transition-colors"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-64 opacity-100 mt-4' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 rounded-lg">
            <MobileNavLink href="#about" text="关于" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink href="#skills" text="技能" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink href="#experience" text="经历" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink href="#contact" text="联系" setIsMenuOpen={setIsMenuOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
};

// NavLink 组件 - 桌面端导航链接
const NavLink = ({ href, text }) => {
  return (
    <a
      href={href}
      className="text-white hover:text-purple-400 px-3 py-2 text-sm font-medium relative group"
    >
      {text}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
    </a>
  );
};

// MobileNavLink 组件 - 移动端导航链接
const MobileNavLink = ({ href, text, setIsMenuOpen }) => {
  return (
    <a
      href={href}
      onClick={() => setIsMenuOpen(false)}
      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-500/20 transition-colors"
    >
      {text}
    </a>
  );
};

export default Navbar; 