export interface BlogPost {
    slug: string;
    titleKey: string;
    excerptKey: string;
    date: string;
    file: string;
    series?: {
        nameKey: string;
        part: number;
    };
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'sciorex-beta-launch-part-1-why-ai-workflows-break',
        titleKey: 'blog.posts.why-ai-workflows-break.title',
        excerptKey: 'blog.posts.why-ai-workflows-break.excerpt',
        date: '2025-12-26',
        file: 'sciorex_beta_launch_part_1_why_ai_workflows_break.md',
        series: { nameKey: 'blog.series.launch.name', part: 1 }
    },
    {
        slug: 'sciorex-vision-part-2-the-future-of-ai-work',
        titleKey: 'blog.posts.future-of-ai-work.title',
        excerptKey: 'blog.posts.future-of-ai-work.excerpt',
        date: '2025-12-26',
        file: 'sciorex_vision_part_2_the_future_of_ai_work.md',
        series: { nameKey: 'blog.series.launch.name', part: 2 }
    },
    {
        slug: 'sciorex-in-practice-part-3-how-orchestrated-ai-work-actually-works',
        titleKey: 'blog.posts.feature-showcase.title',
        excerptKey: 'blog.posts.feature-showcase.excerpt',
        date: '2025-12-26',
        file: 'sciorex_in_practice_part_3_how_orchestrated_ai_work_actually_works.md',
        series: { nameKey: 'blog.series.launch.name', part: 3 }
    }
];
