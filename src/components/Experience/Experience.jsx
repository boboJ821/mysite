import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const experiences = [
  {
    date: "2024.03 - 2025.01",
    company: "福州致合电子商务有限公司",
    title: "平台运营 | 福州运营部",
    description: "负责美团便利超市（福州区域）运营优化项目，管理12家门店的运营优化与业绩提升，实现单店月均营业额17万-20万。",
    skills: ["Python", "NLP", "RPA", "数据分析", "运营优化"],
    highlights: [
      "基于AI文本相似度算法（Python+NLP）搭建本地竞品匹配模型，实现商品自动对齐，匹配准确率达85%",
      "设计影刀RPA程序，减少数据采集时间50%",
      "分析库存周转、订单时效等核心指标，提升异常问题响应速度",
      "优化用户购买关联分析和商品关键词，提升客单价",
      "建立营销素材模板库，优化商品主图与展示效果，提升点击率",
      '构建"高频商品实时比价+长尾商品动态定价"机制，核心商品曝光量提升15%，访购率提升8%'
    ]
  },
  {
    date: "2023.01 - 2024.02",
    company: "福州卫易网络科技有限公司",
    title: "运营主管 | 福州运营部 | 下属人数3人",
    description: "负责小程序抽卡平台运营项目，上线3个月实现单月流水破百万。",
    skills: ["Python", "数据分析", "A/B测试", "自动化运营", "用户体验优化"],
    highlights: [
      '建立"市场占有率+社交传播度+IP热度"三维选品模型，精准引进Pokemon、卡游、数码宝贝等3款爆款卡池，首月流水增长20%',
      "设计A/B测试机制验证卡池吸引力",
      "基于Python搭建自动化上架系统，实现卡池配置/素材上传/价格校准一键化操作",
      "优化商品上架从纯人工到自动化，耗时从8小时缩短至2小时，配置错误率降低90%",
      "根据三维选品模型，建立自有卡池",
      "通过蒙特卡洛模拟测试50+种爆率组合，确定最优概率分布",
      "与美术团队分析动效，提升用户体验感、优化卡池UI细节"
    ]
  },
  {
    date: "2022.03 - 2022.12",
    company: "盟盟搭（福建）物联网技术集团有限公司",
    title: "福州平台负责人",
    description: "负责微信小程序自营商城体系搭建与运营，上线6个月累计GMV 210万元，用户复购率37%。",
    skills: ["小程序开发", "商城运营", "数据分析", "Power BI", "用户增长"],
    highlights: [
      '标准化商品运营，建立「商品标题-关键词-属性标签」三级优化体系',
      '设计SKU动态组合策略（基础款/套餐款/礼品款），提升连带率',
      '从0到1系统搭建，主导「极简轻奢」风格定位，制定《视觉规范手册》（含配色方案/字体系统/图标库）',
      '开发「智能推荐+人工精选」双轨商品陈列模块',
      "搭建会员成长体系",
      '爆款打造计划，策划「超级单品日」活动',
      "智能决策系统，搭建Power BI数据看板，实时监控18项核心指标"
    ]
  }
  // 可以继续添加更多经历
]

function CurvedPath() {
  return (
    <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block">
      <svg
        className="h-full w-40"
        viewBox="0 0 100 800"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M50,0 C60,200 40,400 50,600 C60,800 40,1000 50,1200"
          fill="none"
          stroke="url(#gradientPath)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradientPath" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0" />
            <stop offset="50%" stopColor="#9333EA" stopOpacity="1" />
            <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function TimelinePoint({ index, inView }) {
  return (
    <motion.div
      className={`absolute w-4 h-4 -translate-y-1/2 hidden md:block ${
        index % 2 === 0 ? 'right-[-2rem]' : 'left-[-2rem]'
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-purple-600 rounded-full" />
      <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-30" />
      <motion.div
        className="absolute inset-0 bg-purple-300 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  )
}

function ExperienceCard({ experience, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  })

  const cardVariants = {
    hidden: { 
      opacity: 0,
      x: 0,
      y: 50,
      '@media (min-width: 768px)': {
        x: index % 2 === 0 ? -50 : 50,
        y: 20
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`relative flex w-full md:w-auto
        ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
    >
      <div 
        className={`
          w-full md:w-[calc(50%-2rem)] 
          bg-opacity-10 bg-white backdrop-blur-sm rounded-lg p-6 shadow-xl
          hover:bg-opacity-20 transition-all duration-300
          mx-4 md:mx-0
        `}
      >
        <TimelinePoint index={index} inView={inView} />
        <div className="text-purple-300 text-sm mb-2">{experience.date}</div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{experience.company}</h3>
        <h4 className="text-lg md:text-xl text-purple-300 mb-4">{experience.title}</h4>
        <p className="text-sm md:text-base text-gray-300 mb-4">{experience.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.skills.map((skill, i) => (
            <motion.span 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="px-2 md:px-3 py-1 bg-purple-900 bg-opacity-50 rounded-full 
                text-purple-200 text-xs md:text-sm
                hover:bg-opacity-70 transition-all duration-300"
            >
              {skill}
            </motion.span>
          ))}
        </div>
        
        <ul className="list-disc list-inside text-gray-300 text-sm md:text-base">
          {experience.highlights.map((highlight, i) => (
            <motion.li 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="mb-1"
            >
              {highlight}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <div id="experience" className="relative min-h-screen py-20 px-0 md:px-4">
      <CurvedPath />
      
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center text-white mb-12 md:mb-16 px-4"
      >
        工作经历
      </motion.h2>
      
      <div className="relative max-w-6xl mx-auto space-y-12 md:space-y-24">
        {experiences.map((exp, index) => (
          <ExperienceCard key={index} experience={exp} index={index} />
        ))}
      </div>
    </div>
  )
} 