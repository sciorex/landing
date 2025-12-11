<p align="center">
  <img src="public/logo.png" alt="Sciorex Logo" width="120" />
</p>

<h1 align="center">Sciorex Landing Page</h1>

<p align="center">
  Official landing page for <a href="https://sciorex.com">Sciorex</a> — The King of Knowledge
</p>

<p align="center">
  <a href="https://sciorex.com">View Website</a> •
  <a href="https://github.com/sciorex/sciorex">Main Repository</a> •
  <a href="https://docs.sciorex.com">Documentation</a>
</p>

---

## About

This repository contains the source for the Sciorex landing page, built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/).

**Live site**: [sciorex.com](https://sciorex.com)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Structure

```
landing/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment
├── public/
│   ├── logo.png
│   ├── favicon.ico
│   └── screenshots/          # App screenshots
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Showcase.tsx
│   │   ├── Pricing.tsx
│   │   ├── Blog.tsx
│   │   └── ...
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

## Deployment

The site is automatically deployed to GitHub Pages via the `public` branch when changes are pushed to `main`.

## Contributing

By submitting a contribution, you agree to the [Contributor License Agreement](https://github.com/sciorex/sciorex/blob/main/CLA.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-update`)
3. Commit your changes (`git commit -m 'feat: update hero section'`)
4. Push to the branch (`git push origin feature/my-update`)
5. Open a Pull Request

## Links

- **Website**: [sciorex.com](https://sciorex.com)
- **Documentation**: [docs.sciorex.com](https://docs.sciorex.com)
- **Main Repo**: [github.com/sciorex/sciorex](https://github.com/sciorex/sciorex)
- **Twitter**: [@sciorex](https://x.com/sciorex)
- **Discord**: [discord.gg/sciorex](https://discord.gg/sciorex)

## License

Source code is licensed under [MIT](https://opensource.org/licenses/MIT).
