# Multilingual Landing Page Implementation Plan

## Executive Summary

Transform the Sciorex landing page into a multilingual site supporting English and Spanish with SEO optimization, using path-based URLs (`/en/`, `/es/`) and automatic language detection.

## Architecture Decisions

### 1. URL Structure: Path-based (RECOMMENDED)
**Choice**: `/en/`, `/es/` path prefixes

**Rationale**:
- Google's recommended approach for multilingual sites
- Works perfectly with GitHub Pages (no DNS/subdomain complexity)
- Clean, user-friendly URLs
- Easy to scale to additional languages
- Better crawlability and indexing

**Examples**:
- English: `https://sciorex.com/en/`, `https://sciorex.com/en/about`
- Spanish: `https://sciorex.com/es/`, `https://sciorex.com/es/about`

### 2. i18n Library: react-i18next
**Dependencies**: `react-i18next` + `i18next` + `i18next-browser-languagedetector`

**Rationale**:
- Industry standard for React SPAs (9.3M weekly downloads)
- Excellent TypeScript support
- Lazy loading support (important for performance)
- Browser language detection built-in
- Namespace support for organizing translations
- Works seamlessly with Vite

### 3. Translation Strategy
**Approach**: Auto-translation placeholders initially, manual refinement later

**Process**:
1. Extract all hardcoded strings into English translation files
2. Generate Spanish translations using automated tools
3. Provide structured translation files for future manual refinement

## Implementation Steps

### Phase 1: Setup i18n Infrastructure

#### 1.1 Install Dependencies
```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

#### 1.2 Create Translation File Structure
```
src/
├── locales/
│   ├── en/
│   │   ├── common.json          # Navigation, buttons, labels
│   │   ├── hero.json            # Hero section messages
│   │   ├── features.json        # Features content
│   │   ├── pricing.json         # Pricing plans
│   │   ├── footer.json          # Footer content
│   │   ├── about.json           # About page
│   │   ├── contact.json         # Contact page
│   │   ├── privacy.json         # Privacy policy
│   │   └── terms.json           # Terms of service
│   └── es/
│       ├── common.json
│       ├── hero.json
│       ├── features.json
│       ├── pricing.json
│       ├── footer.json
│       ├── about.json
│       ├── contact.json
│       ├── privacy.json
│       └── terms.json
└── i18n/
    └── config.ts                # i18next configuration
```

#### 1.3 Configure i18next
Create `src/i18n/config.ts`:
- Set up language detection (browser preferences)
- Configure fallback language (English)
- Set up namespace loading
- Enable React suspense for async loading

### Phase 2: Extract Content to Translation Files

#### 2.1 Content Extraction Map
**Components to update** (11 files):

1. **Navbar.tsx** → `common.json`
   - Navigation links: Features, How It Works, Pricing, Blog, Download
   - CTA button: "Get Started"

2. **Hero.tsx** → `hero.json`
   - 5 rotating messages (main + sub text each)
   - CTA buttons: "Download", "Learn More"
   - Subheading text

3. **Features.tsx** → `features.json`
   - Section heading: "Everything you need..."
   - 14 features (each with title + description)
   - Feature categories

4. **Showcase.tsx** → `common.json`
   - Section content

5. **HowItWorks.tsx** → `common.json`
   - Section heading
   - Step descriptions

6. **Pricing.tsx** → `pricing.json`
   - Section heading: "Simple, transparent pricing"
   - 3 pricing plans (each with name, price, description, 10+ features)
   - CTA buttons per plan

7. **Blog.tsx** → `common.json`
   - Section heading
   - Blog post previews (if any)

8. **Download.tsx** → `common.json`
   - Section heading
   - Platform-specific text
   - Download buttons

9. **CTA.tsx** → `common.json`
   - Call-to-action text
   - Button labels

10. **Footer.tsx** → `footer.json`
    - Footer link categories (Product, Resources, Company)
    - All footer links
    - Copyright text
    - Social links (if text-based)

11. **Pages** (About, Contact, Privacy, Terms) → respective JSON files
    - Full page content extraction

#### 2.2 Auto-generate Spanish Translations
- Use translation service/tool to create initial Spanish versions
- Maintain same JSON structure for consistency
- Mark as "auto-translated" for future review

### Phase 3: Routing Updates

#### 3.1 Update App.tsx Routing
**Current**: Direct routes (`/`, `/about`, `/contact`, etc.)
**New**: Locale-prefixed routes (`/:locale/`, `/:locale/about`, etc.)

```typescript
Routes structure:
- / → redirect to detected language (/en/ or /es/)
- /en/ → Home (English)
- /es/ → Home (Spanish)
- /en/about → About (English)
- /es/about → About (Spanish)
- /en/contact → Contact (English)
- /es/contact → Contact (Spanish)
- /en/privacy → Privacy (English)
- /es/privacy → Privacy (Spanish)
- /en/terms → Terms (English)
- /es/terms → Terms (Spanish)
```

#### 3.2 Add Language Detection Route
Create root route handler:
- Detect browser language on `/`
- Redirect to `/en/` or `/es/` based on detection
- Default to `/en/` for unsupported languages

#### 3.3 Update Hash-based Navigation
Ensure hash links work with locale prefix:
- `#features` → `/en/#features` or `/es/#features`
- Update all anchor href attributes in Navbar

### Phase 4: Component Updates

#### 4.1 Replace Hardcoded Strings
**Pattern**: Replace all hardcoded text with `useTranslation` hook

**Example transformation** (Features.tsx):
```typescript
// BEFORE
const features = [
  {
    title: 'Multi-Provider AI',
    description: 'Use Claude, Gemini, Codex...',
  },
];

// AFTER
const { t } = useTranslation('features');
const features = [
  {
    title: t('features.0.title'),
    description: t('features.0.description'),
  },
];
```

**Apply to**: All 11 components listed in Phase 2.1

#### 4.2 Update Navigation Links
Add locale awareness to all navigation:
- Internal links include current locale
- Language switcher updates all routes

### Phase 5: Language Switcher UI

#### 5.1 Create LanguageSelector Component
**Location**: `src/components/LanguageSelector.tsx`

**Features**:
- Dropdown or flag-based selector
- Show current language
- List available languages (English, Spanish)
- Smooth transition on language change
- Persist selection in localStorage
- Update URL on language change

**Design considerations**:
- Mobile-responsive
- Accessible (ARIA labels)
- Matches existing Navbar styling
- Icons: Use flag emojis or text (EN/ES)

#### 5.2 Integrate into Navbar
Add LanguageSelector component to Navbar.tsx:
- Position: Top-right, before "Get Started" button
- Desktop: Dropdown menu
- Mobile: In hamburger menu

### Phase 6: SEO Optimization

#### 6.1 Dynamic HTML lang Attribute
Update `index.html` and add runtime update:
- Change from hardcoded `<html lang="en">` to dynamic
- Update based on current route locale
- Use i18next language change callback

#### 6.2 Implement hreflang Tags
**Critical for SEO**: Add alternate language links

**In index.html** or dynamically via React Helmet:
```html
<link rel="alternate" hreflang="en" href="https://sciorex.com/en/" />
<link rel="alternate" hreflang="es" href="https://sciorex.com/es/" />
<link rel="alternate" hreflang="x-default" href="https://sciorex.com/en/" />
```

**For each page**:
- Home: `/en/` ↔ `/es/`
- About: `/en/about` ↔ `/es/about`
- Contact: `/en/contact` ↔ `/es/contact`
- Privacy: `/en/privacy` ↔ `/es/privacy`
- Terms: `/en/terms` ↔ `/es/terms`

#### 6.3 Localized Meta Tags
Create separate meta tags per language:

**English** (`/en/`):
```html
<title>Sciorex - AI Agent Orchestration Platform</title>
<meta name="description" content="Create AI agents, chain them into workflows..." />
```

**Spanish** (`/es/`):
```html
<title>Sciorex - Plataforma de Orquestación de Agentes IA</title>
<meta name="description" content="Crea agentes de IA, encadénalos en flujos de trabajo..." />
```

**Implementation**: Use react-helmet-async library
- Install: `npm install react-helmet-async`
- Create per-page meta component
- Translate all Open Graph and Twitter Card tags

#### 6.4 Sitemap Updates
Create language-specific sitemaps:
- `sitemap-en.xml` - All English URLs
- `sitemap-es.xml` - All Spanish URLs
- `sitemap.xml` - Combined sitemap index

Include hreflang annotations in sitemap:
```xml
<url>
  <loc>https://sciorex.com/en/</loc>
  <xhtml:link rel="alternate" hreflang="es" href="https://sciorex.com/es/" />
  <xhtml:link rel="alternate" hreflang="en" href="https://sciorex.com/en/" />
</url>
```

#### 6.5 robots.txt
Ensure both language versions are crawlable:
```
User-agent: *
Allow: /en/
Allow: /es/
Sitemap: https://sciorex.com/sitemap.xml
```

### Phase 7: GitHub Pages Deployment

#### 7.1 No Separate Branches Needed
**Clarification**: Single-branch deployment is better than 2 branches

**Reason**:
- Path-based routing works with single repo
- Vite builds SPA with client-side routing
- All languages served from same deployment
- Easier to maintain and deploy

#### 7.2 Vite Configuration
Update `vite.config.ts`:
- Ensure proper base path for GitHub Pages
- Handle SPA routing (404 → index.html)

#### 7.3 404.html for Client-side Routing
GitHub Pages needs special handling for SPA routes:
- Create `public/404.html` that redirects to `index.html`
- Preserves path/hash for React Router

### Phase 8: Testing & Validation

#### 8.1 Functional Testing
- [ ] Language detection works on first visit
- [ ] Language switcher changes language + URL
- [ ] All routes work in both languages
- [ ] Hash navigation works (`#features`, etc.)
- [ ] Browser back/forward maintains language
- [ ] Language preference persists across sessions
- [ ] All content displays correctly (no missing translations)

#### 8.2 SEO Validation
- [ ] HTML lang attribute updates correctly
- [ ] hreflang tags present on all pages
- [ ] Meta tags localized properly
- [ ] Sitemap includes all language versions
- [ ] Google Search Console validation
- [ ] Rich results test (schema.org markup if any)

#### 8.3 Performance Testing
- [ ] Translation files lazy-loaded
- [ ] No layout shift on language change
- [ ] Bundle size acceptable (<50KB increase)

#### 8.4 Accessibility Testing
- [ ] Language switcher keyboard accessible
- [ ] Screen reader announces language changes
- [ ] ARIA labels in correct language

## File Changes Summary

### New Files (13)
1. `src/i18n/config.ts` - i18next configuration
2. `src/locales/en/common.json` - English common translations
3. `src/locales/en/hero.json` - English hero translations
4. `src/locales/en/features.json` - English features
5. `src/locales/en/pricing.json` - English pricing
6. `src/locales/en/footer.json` - English footer
7. `src/locales/en/about.json` - English about page
8. `src/locales/en/contact.json` - English contact
9. `src/locales/en/privacy.json` - English privacy
10. `src/locales/en/terms.json` - English terms
11. `src/locales/es/*` - Spanish versions of all above (9 files)
12. `src/components/LanguageSelector.tsx` - Language switcher
13. `public/404.html` - SPA routing fallback

### Modified Files (15)
1. `package.json` - Add i18n dependencies
2. `src/main.tsx` - Initialize i18next
3. `src/App.tsx` - Add locale routing
4. `index.html` - Dynamic lang attribute, hreflang tags
5. `src/components/Navbar.tsx` - Translations + LanguageSelector
6. `src/components/Hero.tsx` - Translations
7. `src/components/Features.tsx` - Translations
8. `src/components/Showcase.tsx` - Translations
9. `src/components/HowItWorks.tsx` - Translations
10. `src/components/Pricing.tsx` - Translations
11. `src/components/Blog.tsx` - Translations
12. `src/components/Download.tsx` - Translations
13. `src/components/CTA.tsx` - Translations
14. `src/components/Footer.tsx` - Translations
15. `vite.config.ts` - GitHub Pages config

### Pages to Update (4)
1. `src/pages/About.tsx`
2. `src/pages/Contact.tsx`
3. `src/pages/Privacy.tsx`
4. `src/pages/Terms.tsx`

## SEO Best Practices Implementation

### 1. hreflang Implementation
- Bidirectional links on every page
- x-default points to English version
- Consistent URL structure across languages

### 2. Content Guidelines
- Avoid auto-translated "Spanglish" - review quality
- Maintain brand names in original language (Sciorex)
- Adapt cultural references where needed
- Keep technical terms consistent

### 3. URL Canonicalization
Each language version canonical to itself:
```html
<!-- On /en/about -->
<link rel="canonical" href="https://sciorex.com/en/about" />

<!-- On /es/about -->
<link rel="canonical" href="https://sciorex.com/es/about" />
```

### 4. Structured Data
Localize schema.org markup if present:
- Organization name
- Descriptions
- Contact information

## Scalability Considerations

### Adding Future Languages
1. Create new folder: `src/locales/[lang-code]/`
2. Copy English JSON files
3. Translate content
4. Add language to i18next config
5. Update LanguageSelector component
6. Add hreflang tags
7. Update sitemap

**Estimated effort**: 2-4 hours per language (after Spanish implementation)

### Content Management
Future enhancement: Consider headless CMS integration
- Contentful, Strapi, or Sanity
- Non-technical translation workflow
- Translation memory for consistency

## Implementation Timeline Estimate

**Not providing time estimates per your guidelines** - tasks are broken into phases that can be completed sequentially:

1. Setup i18n (Phase 1)
2. Extract & translate content (Phase 2)
3. Update routing (Phase 3)
4. Update components (Phase 4)
5. Add language switcher (Phase 5)
6. Implement SEO (Phase 6)
7. Configure deployment (Phase 7)
8. Test & validate (Phase 8)

## Success Metrics

### Technical
- [ ] All pages accessible in both languages
- [ ] Zero translation errors in console
- [ ] Page load time increase <200ms
- [ ] Lighthouse SEO score maintained/improved

### SEO
- [ ] Google Search Console shows both language versions
- [ ] hreflang tags validated (no errors)
- [ ] Both versions indexed within 1-2 weeks
- [ ] Localized search results appear correctly

### User Experience
- [ ] Language switcher intuitive
- [ ] Language preference remembered
- [ ] Smooth transitions (no flashing)
- [ ] Mobile-friendly language selection

## Risk Mitigation

### Risk 1: Breaking Existing URLs
**Mitigation**: Add redirects from old paths to `/en/` equivalents
```
/ → /en/
/about → /en/about
/contact → /en/contact
etc.
```

### Risk 2: Translation Quality
**Mitigation**:
- Provide JSON files for manual review
- Use professional translation service for final version
- Community feedback mechanism

### Risk 3: SEO Dilution
**Mitigation**:
- Proper hreflang prevents duplicate content issues
- Canonical tags point to correct versions
- Maintain single authority per language

### Risk 4: GitHub Pages Routing
**Mitigation**:
- Thorough testing of 404.html redirect
- Fallback to hash-based routing if needed
- Document deployment process

## Notes & Recommendations

1. **Translation Review**: Auto-translations are a starting point. Budget for professional review of customer-facing content (especially pricing, legal pages).

2. **Analytics**: Add language dimension to Google Analytics to track user preferences and engagement per language.

3. **A/B Testing**: Consider testing language detection accuracy - some users may prefer manual selection.

4. **Progressive Enhancement**: Consider adding more languages based on user demand (French, German, Portuguese common next steps).

5. **Content Parity**: Ensure Spanish version stays updated when English content changes. Consider translation workflow/alerts.

6. **Legal Compliance**: Privacy Policy and Terms must be accurately translated (legal review recommended).

## Questions for Clarification

Before implementation, confirm:
1. ✅ Path-based URLs approved (/en/, /es/)
2. ✅ Auto-translation placeholders acceptable initially
3. ✅ Auto-detect browser language approved
4. Do you have existing Spanish brand voice/guidelines?
5. Priority pages to translate first (all vs. phased rollout)?
6. Should blog content also be multilingual?

## Conclusion

This plan delivers a production-ready multilingual landing page with:
- ✅ SEO-optimized path-based URLs
- ✅ Automatic language detection
- ✅ Clean, maintainable codebase
- ✅ Scalable to additional languages
- ✅ GitHub Pages compatible
- ✅ Professional translation-ready structure

The implementation uses industry-standard tools (react-i18next) and follows Google's multilingual SEO best practices. The architecture supports easy addition of future languages with minimal effort.
