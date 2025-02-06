import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const skillCategories = [
  {
    title: "AI 助手",
    skills: [
      { name: "ChatGPT", level: 95 },
      { name: "Deepseek", level: 92 },
      { name: "Cursor", level: 90 }
    ]
  },
  {
    title: "AI 创意",
    skills: [
      { name: "Stable Diffusion", level: 88 },
      { name: "ComfyUI", level: 85 }
    ]
  },
  {
    title: "设计开发",
    skills: [
      { name: "Photoshop", level: 88 },
      { name: "Illustrator", level: 85 },
      { name: "Python", level: 90 }
    ]
  },
  {
    title: "办公软件",
    skills: [
      { name: "Word", level: 95 },
      { name: "Excel", level: 92 }
    ]
  }
]

function SkillBar({ skill, inView, index }) {
  return (
    <motion.div 
      className="mb-4"
      initial={{ x: -50, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div 
        className="flex justify-between mb-1"
        initial={{ y: -10, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
      >
        <span className="text-sm md:text-base text-purple-200">{skill.name}</span>
        <motion.span 
          className="text-sm text-purple-300"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
        >
          {skill.level}%
        </motion.span>
      </motion.div>
      <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
          initial={{ width: 0, opacity: 0 }}
          animate={inView ? { 
            width: `${skill.level}%`, 
            opacity: 1,
          } : { width: 0, opacity: 0 }}
          transition={{ 
            duration: 1, 
            delay: index * 0.1 + 0.3,
            ease: "easeOut" 
          }}
        />
      </div>
    </motion.div>
  )
}

function SkillCategory({ category, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.2,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-300
                hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <motion.h3 
        className="text-lg md:text-xl font-bold text-purple-300 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
      >
        {category.title}
      </motion.h3>
      <div className="space-y-3">
        {category.skills.map((skill, idx) => (
          <SkillBar key={idx} skill={skill} inView={inView} index={idx} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="skills" className="min-h-screen py-20 px-4" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
      >
        专业技能
      </motion.h2>

      <motion.div 
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {skillCategories.map((category, index) => (
          <SkillCategory key={index} category={category} index={index} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="max-w-2xl mx-auto mt-8 text-center text-gray-300 text-sm md:text-base"
      >
        <p>
          精通AI辅助工具与设计软件，擅长将AI与创意相结合，
          持续探索新技术应用，提升工作效率。
        </p>
      </motion.div>
    </section>
  )
} 