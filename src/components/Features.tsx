import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Workflow,
  Kanban,
  MessageSquare,
  GitBranch,
  Settings2,
  Zap,
  Shield,
  History,
  Layers,
  Puzzle,
  Bell,
  Sparkles,
  Code2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Users,
  PanelLeftClose,
  GitGraph,
  Terminal,
  Unlock,
  FileDiff,
  Bug,
  X,
  Maximize2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Sparkles,
  Workflow,
  Kanban,
  Bot,
  Puzzle,
  Code2,
  MessageSquare,
  GitBranch,
  Layers,
  History,
  Zap,
  Settings2,
  Bell,
  Users,
  PanelLeftClose,
  GitGraph,
  Terminal,
  Unlock,
  FileDiff,
  Bug,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

interface FeatureGroup {
  id: string;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  features: {
    icon: string;
    color: string;
    title: string;
    description: string;
  }[];
  images: string[];
}

export default function Features() {
  const { t } = useTranslation('features');
  const { theme } = useTheme();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [carouselIndexes, setCarouselIndexes] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<{ groupId: string; index: number } | null>(null);

  const getImagePath = (name: string) => `/screenshots/${theme}/${name}`;

  // Image descriptions for captions
  const imageDescriptions: Record<string, string> = {
    'chat-view.png': 'Chat interface with AI assistant',
    'start-chat.png': 'Start a new conversation',
    'settings-clis.png': 'CLI providers configuration',
    'kanban-view.png': 'Kanban board for task management',
    'tickets-list.png': 'Ticket list with filters and search',
    'ticket-description.png': 'Detailed ticket view with history',
    'agents-view.png': 'Custom AI agents configuration',
    'epics-view.png': 'Epic organization for large projects',
    'chat-council.png': 'Agent Council multi-persona collaboration',
    'browser-preview.png': 'Split panel with browser preview',
    'agentic-preview.png': 'Agentic file review with diffs',
    'flow-view.png': 'Visual flow editor overview',
    'flow-edition-view.png': 'Node-based flow designer',
    'editor-view.png': 'Integrated code editor',
    'editor-git-view.png': 'Git graph visualization',
    'flow-run-view.png': 'Flow execution monitoring',
    'agent-run-view.png': 'Agent execution details',
    'worktree-view.png': 'Git worktree management',
    'worktree-view-2.png': 'Multiple worktrees view',
  };

  const getImageDescription = (name: string) => imageDescriptions[name] || name.replace('.png', '').replace(/-/g, ' ');

  // Get groups from translations
  const groupsData = t('groups', { returnObjects: true }) as FeatureGroup[];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getCarouselIndex = (groupId: string) => carouselIndexes[groupId] ?? 0;

  const nextSlide = (groupId: string, total: number) => {
    setCarouselIndexes(prev => ({
      ...prev,
      [groupId]: ((prev[groupId] ?? 0) + 1) % total
    }));
  };

  const prevSlide = (groupId: string, total: number) => {
    setCarouselIndexes(prev => ({
      ...prev,
      [groupId]: ((prev[groupId] ?? 0) - 1 + total) % total
    }));
  };

  const goToSlide = (groupId: string, index: number) => {
    setCarouselIndexes(prev => ({
      ...prev,
      [groupId]: index
    }));
  };

  // Lightbox helpers
  const openLightbox = (groupId: string, index: number) => {
    setLightbox({ groupId, index });
  };

  const closeLightbox = () => setLightbox(null);

  const lightboxNext = () => {
    if (!lightbox) return;
    const group = groupsData.find(g => g.id === lightbox.groupId);
    if (!group) return;
    setLightbox({
      groupId: lightbox.groupId,
      index: (lightbox.index + 1) % group.images.length
    });
  };

  const lightboxPrev = () => {
    if (!lightbox) return;
    const group = groupsData.find(g => g.id === lightbox.groupId);
    if (!group) return;
    setLightbox({
      groupId: lightbox.groupId,
      index: (lightbox.index - 1 + group.images.length) % group.images.length
    });
  };

  const getLightboxImage = () => {
    if (!lightbox) return null;
    const group = groupsData.find(g => g.id === lightbox.groupId);
    if (!group) return null;
    return group.images[lightbox.index];
  };

  const getLightboxGroup = () => {
    if (!lightbox) return null;
    return groupsData.find(g => g.id === lightbox.groupId) || null;
  };

  return (
    <section id="features" className="relative overflow-hidden">
      {groupsData.map((group, groupIndex) => {
        const isExpanded = expandedGroups[group.id] ?? true;
        const visibleFeatures = isExpanded ? group.features : group.features.slice(0, 3);
        const hasMoreFeatures = group.features.length > 3;

        return (
          <div key={group.id} className={groupIndex % 2 === 0 ? 'bg-section' : ''}>
            {/* Feature Group */}
            <div className="section relative">
              <div className="absolute inset-0 mesh-bg" />

              <div className="max-w-7xl mx-auto relative z-10">
                {/* Group Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-400 mb-4">
                    {group.badge}
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                    {group.title}
                    <span className="text-gradient"> {group.titleHighlight}</span>
                  </h2>
                  <p className="text-xl text-muted max-w-2xl mx-auto">
                    {group.subtitle}
                  </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {visibleFeatures.map((feature) => {
                      const Icon = iconMap[feature.icon] || Shield;
                      return (
                        <motion.div
                          key={feature.title}
                          variants={itemVariants}
                          className="glass-dark rounded-2xl p-6 card-hover group"
                        >
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-heading mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Mobile expand/collapse button */}
                {hasMoreFeatures && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center sm:hidden"
                  >
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full text-primary-400 hover:bg-white/10 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          {t('showLess')}
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          {t('showMore', { count: group.features.length - 3 })}
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Images Carousel */}
            {group.images.length > 0 && (
              <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    {/* Carousel Container */}
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-xl" />
                      <div className="image-frame relative">
                        <div
                          className="relative overflow-hidden cursor-pointer group/image"
                          style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : '#101113' }}
                          onClick={() => openLightbox(group.id, getCarouselIndex(group.id))}
                        >
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={`${group.id}-${getCarouselIndex(group.id)}`}
                              src={getImagePath(group.images[getCarouselIndex(group.id)])}
                              alt={getImageDescription(group.images[getCarouselIndex(group.id)])}
                              className="w-full aspect-video object-contain"
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ duration: 0.3 }}
                            />
                          </AnimatePresence>
                          {/* Maximize hint */}
                          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="w-10 h-10 text-white opacity-0 group-hover/image:opacity-100 transition-opacity" />
                          </div>
                          {/* Caption bar */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                            <p className="text-white text-sm font-medium">
                              {getImageDescription(group.images[getCarouselIndex(group.id)])}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {group.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevSlide(group.id, group.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-heading hover:bg-black/20 dark:hover:bg-white/20 transition-colors z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextSlide(group.id, group.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-heading hover:bg-black/20 dark:hover:bg-white/20 transition-colors z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Dots Indicator */}
                    {group.images.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {group.images.map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            onClick={() => goToSlide(group.id, dotIndex)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              dotIndex === getCarouselIndex(group.id)
                                ? 'bg-primary-400 w-6'
                                : 'bg-black/30 hover:bg-black/50 dark:bg-white/30 dark:hover:bg-white/50'
                            }`}
                            aria-label={`Go to image ${dotIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && getLightboxImage() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous button */}
            {getLightboxGroup() && getLightboxGroup()!.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {getLightboxGroup() && getLightboxGroup()!.images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <div className="flex flex-col items-center max-w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={`lightbox-${lightbox.groupId}-${lightbox.index}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={getImagePath(getLightboxImage()!)}
                  alt={getImageDescription(getLightboxImage()!)}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
              </AnimatePresence>
              {/* Caption */}
              <p className="mt-4 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                {getImageDescription(getLightboxImage()!)} ({lightbox.index + 1}/{getLightboxGroup()!.images.length})
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
