# Bookleaf

**For the lines you'll remember.**

A free online tool to turn book excerpts and words into clean, editorial-style visuals. Create beautiful text posters with customizable styles, fonts, and layouts. Perfect for quotes, poems, and memorable lines.

## Features

- ✨ **Free to Use** - No signup required, completely free
- 🎨 **Multiple Presets** - Editorial, Classic, and Modern styles
- 📝 **Customizable** - Adjust text alignment, style intensity, and aspect ratio
- 💾 **Export as JPG** - High-resolution image export
- 🌐 **Privacy First** - All processing happens in your browser
- 📱 **Responsive** - Works on desktop and mobile devices

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4000)
npm run dev
```

### Production Build

```bash
# For Tina's deployment (baseURL: /bookleaf/)
npm run generate:prod

# For Vercel/standard deployment (baseURL: /)
npm run generate
```

**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

## Project Structure

```
bookleaf/
├── app/                      # Application source code
│   ├── assets/              # Fonts, CSS
│   ├── components/          # Vue components
│   ├── composables/         # Composition API utilities
│   ├── pages/               # Page components
│   ├── plugins/             # Nuxt plugins (GTM, Umami)
│   ├── stores/              # Pinia stores
│   └── utils/               # Utility functions
├── public/                  # Static assets
│   ├── images/              # Images (presets, backgrounds)
│   ├── fonts/               # Font files
│   └── content/             # JSON data
├── doc/                     # Design references
├── DEPLOYMENT.md            # Deployment guide
└── nuxt.config.ts          # Nuxt configuration
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Analytics
NUXT_PUBLIC_UMAMI_HOST=https://umami-rose-delta.vercel.app
NUXT_PUBLIC_UMAMI_ID=your-website-id

# GTM (production only)
NUXT_PUBLIC_GTM_ID=TM-WMJSMTWF

# Base URL (production only)
NUXT_APP_BASE_URL=/bookleaf/
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (SSR)
- `npm run generate` - Generate static site (baseURL: `/`)
- `npm run generate:prod` - Generate static site for production (baseURL: `/bookleaf/`)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (SSG mode)
- **UI**: [Vue 3](https://vuejs.org/)
- **Styling**: [UnoCSS](https://unocss.dev/)
- **State**: [Pinia](https://pinia.vuejs.org/)
- **SEO**: [@nuxtjs/seo](https://nuxtseo.com/)
- **Analytics**: Umami + Google Tag Manager

## Deployment Targets

- **Vercel** - Preview/staging environment
- **Spring Boot** - Production environment (Tina's server)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

Private project.

---

Made with ❤️ for book lovers
