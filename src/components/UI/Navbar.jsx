import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollToSection } = useSmoothScroll()

  // 监听滚动事件来改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }

      // 检测当前活动section
      const sections = navItems.map(item => item.href.substring(1))
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  const navItems = [
    { title: '首页', href: '#home' },
    { title: '关于我', href: '#about' },
    { title: '工作经历', href: '#experience' },
    { title: '专业技能', href: '#skills' },
    { title: '联系我', href: '#contact' },
  ]

  const handleClick = (e, href) => {
    e.preventDefault()
    scrollToSection(href)
    setIsMenuOpen(false)
  }

  // 汉堡菜单按钮
  const MenuButton = () => (
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="md:hidden p-2 text-white hover:text-purple-300 transition-colors"
    >
      <motion.div
        className="w-6 h-5 flex flex-col justify-between"
        animate={isMenuOpen ? "open" : "closed"}
      >
        <motion.span
          className="w-full h-0.5 bg-current transform origin-left"
          variants={{
            closed: { rotate: 0 },
            open: { rotate: 45, y: -2 }
          }}
        />
        <motion.span
          className="w-full h-0.5 bg-current"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 }
          }}
        />
        <motion.span
          className="w-full h-0.5 bg-current transform origin-left"
          variants={{
            closed: { rotate: 0 },
            open: { rotate: -45, y: 2 }
          }}
        />
      </motion.div>
    </button>
  )

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 py-4 ${
          scrolled ? 'bg-primary/80 backdrop-blur-sm' : ''
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center md:justify-center">
            {/* 桌面端导航 */}
            <ul className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <li key={item.title}>
                  <button
                    onClick={(e) => handleClick(e, item.href)}
                    className={`text-white hover:text-purple-300 transition-colors ${
                      activeSection === item.href.substring(1) ? 'font-bold' : ''
                    }`}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* 移动端菜单按钮 */}
            <MenuButton />
          </div>
        </div>
      </motion.nav>

      {/* 移动端侧边栏菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            
            {/* 侧边栏 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-64 h-full bg-primary/95 backdrop-blur-md z-50 md:hidden"
            >
              <div className="p-6">
                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <motion.li
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <button
                        onClick={(e) => handleClick(e, item.href)}
                        className={`text-lg text-white hover:text-purple-300 transition-colors ${
                          activeSection === item.href.substring(1)
                            ? 'font-bold text-purple-300'
                            : ''
                        }`}
                      >
                        {item.title}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 