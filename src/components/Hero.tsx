import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const messages = [
  {
    main: 'Create AI agents, chain them into workflows, and let them handle your coding, research, and documentation tasks.',
    sub: 'You define what each agent does. Sciorex runs them, tracks progress with tickets, and keeps everything on your machine. No cloud, no subscriptions.',
  },
  {
    main: 'Plan entire solutions with your AI agents. Control every decision, track every change, and steer the AI to follow your best practices.',
    sub: 'Build applications from the ground up. Define architecture with specialized agents, break work into trackable tickets, and watch your agents deliver.',
  },
  {
    main: 'Stop context-switching between tools. One workspace for AI chat, task tracking, and code execution.',
    sub: 'Your agents share context, remember decisions, and build on each other\'s work. Like a team that never forgets.',
  },
  {
    main: 'Turn hours of research into minutes. Agents fetch papers, extract insights, and synthesize knowledge automatically.',
    sub: 'Feed it sources, get structured summaries. Perfect for literature reviews, competitive analysis, or learning new domains.',
  },
  {
    main: 'AI that follows your rules. Define coding standards, review criteria, and workflows your agents must follow.',
    sub: 'Every change tracked, every decision logged. Full visibility into what your agents did and why.',
  },
];

export default function Hero() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 grid-bg" />

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 particle" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 right-1/4 particle" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/3 particle" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 right-1/3 particle" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-dark-100">Now available for Windows, macOS & Linux</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
              The King of
              <span className="block text-gradient">Knowledge</span>
            </h1>

            <div
              className="h-[240px] sm:h-[220px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xl text-dark-100 mb-4 max-w-lg">
                    {messages[messageIndex].main}
                    <span className="text-white font-medium"> AI agents that actually get things done.</span>
                  </p>

                  <p className="text-dark-200 max-w-lg">
                    {messages[messageIndex].sub}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2 mt-6">
                {messages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setMessageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === messageIndex
                      ? 'bg-primary-400 w-6'
                      : 'bg-white/20 hover:bg-white/40'
                      }`}
                    aria-label={`Go to message ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <a href="#download" className="btn-primary flex items-center gap-2 group">
                Download Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="btn-secondary flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-dark-200">Local & Private</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">∞</div>
                <div className="text-sm text-dark-200">Agent Workflows</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">MCP</div>
                <div className="text-sm text-dark-200">Tool Protocol</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - App Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-3xl" />

              {/* Main app screenshot */}
              <div className="image-frame relative">
                <img
                  src="/screenshots/hero-dashboard.png"
                  alt="Sciorex Dashboard"
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-6 top-[10%] glass p-4 rounded-xl shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Agent Completed</div>
                    <div className="text-xs text-dark-200">Paper analysis done</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -right-4 top-[5%] glass p-4 rounded-xl shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Chat Active</div>
                    <div className="text-xs text-dark-200">Discussing architecture</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -right-6 bottom-[10%] glass p-4 rounded-xl shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Flow Triggered</div>
                    <div className="text-xs text-dark-200">Research pipeline active</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity }}
                className="absolute -left-4 bottom-[5%] glass p-4 rounded-xl shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Ticket Created</div>
                    <div className="text-xs text-dark-200">Implement auth system</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
