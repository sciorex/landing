import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

const showcaseItems = [
  {
    id: 1,
    title: 'Agent Kanban Dashboard',
    description:
      'Track all your agent tasks with a powerful drag-and-drop Kanban board. Organize by status, priority, and agent assignments.',
    category: 'Task Management',
    image: '/screenshots/showcase-kanban.png',
  },
  {
    id: 2,
    title: 'Visual Flow Editor',
    description:
      'Design complex multi-agent workflows with our node-based editor. Chain agents, add conditions, and run parallel tasks.',
    category: 'Workflow Design',
    image: '/screenshots/showcase-flow.png',
  },
  {
    id: 3,
    title: 'Real-Time Flow Execution',
    description:
      'Watch your workflows execute in real-time. See each node light up as agents process, track progress, and monitor results as they complete.',
    category: 'Execution',
    image: '/screenshots/showcase-execution.png',
  },
  {
    id: 4,
    title: 'Agent Configuration',
    description:
      'Create specialized agents with custom prompts, tool permissions, and MCP configurations tailored to specific tasks.',
    category: 'Agent Setup',
    image: '/screenshots/showcase-config.png',
  },
  {
    id: 5,
    title: 'Multi-Session Chat',
    description:
      'Run multiple conversations in parallel, fork any session, and link discussions directly to tickets for tracking.',
    category: 'Chat Interface',
    image: '/screenshots/showcase-chat.png',
  },
  {
    id: 6,
    title: 'Git Worktree Management',
    description:
      'Manage multiple git worktrees seamlessly. Work on different branches simultaneously without switching contexts.',
    category: 'Version Control',
    image: '/screenshots/showcase-worktree.png',
  },
];

export default function Showcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
  };

  const currentItem = showcaseItems[currentIndex];

  return (
    <section className="section relative overflow-hidden bg-dark-800/30">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 mb-4">
            See It In Action
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Powerful Interface,
            <span className="text-gradient"> Intuitive Design</span>
          </h2>
          <p className="text-xl text-dark-100 max-w-2xl mx-auto">
            Every feature designed to help you orchestrate AI agents efficiently
          </p>
        </motion.div>

        {/* Showcase Carousel */}
        <div className="relative">
          {/* Main Display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-accent-500/10 to-primary-500/20 rounded-3xl blur-3xl" />
              
              {/* Main Screenshot Frame */}
              <div className="image-frame relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-[16/9] bg-dark-700 relative overflow-hidden"
                  >
                    {/* Screenshot Image */}
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-primary-500/20 backdrop-blur-sm text-xs font-medium text-primary-300">
                        {currentItem.category}
                      </span>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute top-4 right-4 w-10 h-10 glass rounded-lg flex items-center justify-center text-dark-100 hover:text-white transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          {/* Navigation and Info */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Info */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {currentItem.title}
                  </h3>
                  <p className="text-dark-100 max-w-lg">
                    {currentItem.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-4">
              {/* Dots */}
              <div className="flex gap-2">
                {showcaseItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary-500 w-8'
                        : 'bg-dark-400 hover:bg-dark-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 glass rounded-xl flex items-center justify-center text-dark-100 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 glass rounded-xl flex items-center justify-center text-dark-100 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute -top-12 right-0 w-10 h-10 glass rounded-lg flex items-center justify-center text-dark-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-auto rounded-xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-display font-bold text-white">
                  {currentItem.title}
                </h3>
                <p className="text-dark-200 text-sm mt-1">
                  {currentItem.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
