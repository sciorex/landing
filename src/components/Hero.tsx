import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
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
            
            <p className="text-xl text-dark-100 mb-8 max-w-lg">
              Orchestrate AI agent swarms, design research workflows, 
              and track everything with a powerful Kanban interface. 
              <span className="text-white font-medium"> Not an IDE — a mission control for AI.</span>
            </p>
            
            <div className="flex flex-wrap gap-4">
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
                className="absolute -left-6 top-1/4 glass p-4 rounded-xl shadow-2xl"
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
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -right-6 bottom-1/4 glass p-4 rounded-xl shadow-2xl"
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
