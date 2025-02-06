import Scene from './components/Background/Scene'
import Navbar from './components/UI/Navbar'
import Hero from './components/Sections/Hero'
import About from './components/Sections/About'
import Experience from './components/Experience/Experience'
import Skills from './components/Sections/Skills'
import Contact from './components/Sections/Contact'

function App() {
  return (
    <main className="w-full min-h-screen relative">
      <Scene />
      <div className="absolute inset-0 z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </div>
    </main>
  )
}

export default App 