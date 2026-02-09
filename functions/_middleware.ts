// Cloudflare Pages Middleware
// Serves markdown content to AI crawlers and tools that request it via Accept header.
// This solves the fundamental CSR SPA problem: when an LLM curls the page, the HTML
// body is empty (<div id="root"></div>). This middleware serves the full markdown
// version instead, so AI systems get rich, structured content.

const AI_CRAWLERS =
  /GPTBot|ChatGPT-User|ClaudeBot|Claude-Web|Anthropic-AI|PerplexityBot|Google-Extended|Applebot-Extended|CCBot|Bytespider|cohere-ai|meta-externalagent/i;

// File extensions that should never be intercepted
const ASSET_PATTERN =
  /\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|eot|webp|avif|gif|mp4|webm|json|xml|txt|pdf|zip|map)$/;

export const onRequest: PagesFunction = async (context) => {
  const request = context.request;
  const url = new URL(request.url);

  // Never intercept static asset requests
  if (ASSET_PATTERN.test(url.pathname)) {
    return context.next();
  }

  const accept = request.headers.get('accept') || '';
  const userAgent = request.headers.get('user-agent') || '';

  // Content negotiation: if the client explicitly asks for markdown, serve it.
  // This is the key mechanism — AI tools like Claude's WebFetch, ChatGPT browse,
  // and Perplexity can request `Accept: text/markdown` to get clean content.
  if (accept.includes('text/markdown') && !accept.includes('text/html')) {
    try {
      const llmsResponse = await context.env.ASSETS.fetch(
        new URL('/llms-full.txt', request.url),
      );
      const body = await llmsResponse.text();

      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Content-Source': 'llms-full',
          'Vary': 'Accept',
        },
      });
    } catch {
      // Fall through to normal response if llms-full.txt isn't available
    }
  }

  // For all other requests, pass through and add headers
  const response = await context.next();
  const newHeaders = new Headers(response.headers);

  // Add Vary header so caches distinguish between markdown and HTML requests
  newHeaders.set('Vary', 'Accept');

  // For AI crawlers hitting page routes, add a hint header
  if (AI_CRAWLERS.test(userAgent)) {
    newHeaders.set('X-AI-Content', '/llms-full.txt');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};
