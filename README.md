# Lokanath Panda's Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and TailwindCSS, showcasing my projects, skills, and experience.

## 🌟 Features

- **Modern UI/UX**: Built with a sleek, dark theme and smooth animations using Framer Motion
- **Responsive Design**: Fully responsive layout that works on all devices
- **Project Showcase**: Interactive project gallery with parallax effects
- **Skills Section**: Categorized display of technical skills
- **Experience Timeline**: Professional journey with detailed timeline
- **Ask LP**: AI career assistant for recruiters — explore experience through AI (Google Gemini, server-side)
- **Social Links**: Easy access to professional profiles and resume

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **AI Assistant**: Google Gemini (AI Studio) via `/api/ask-lp` (streaming)
- **Deployment**: Netlify

## 🔐 Environment variables

Create a `.env` or `.env.local` file in the project root (see `.env.example`):

```bash
GEMINI_API_KEY=your_key_here
# Optional (default gemini-3.5-flash-lite — better free-tier quota than gemini-3.6-flash):
# GEMINI_MODEL=gemini-3.5-flash-lite
```

Get a free key at [Google AI Studio](https://aistudio.google.com/apikey).

Before deploying to **Netlify**, add `GEMINI_API_KEY` in **Site settings → Environment variables**. Never commit API keys.

Ask LP is lazy-loaded so it does not slow the initial portfolio page load.

## 🧪 Testing Ask LP

With the dev server running (`npm run dev`):

```bash
# Validation / edge cases only (no Gemini quota)
npm run test:ask-lp

# Full suite including live model use cases
npm run test:ask-lp:live
```

Add `ASK_LP_TEST_BYPASS=dev-test-bypass` to `.env` (see `.env.example`) so the live suite can skip the API rate limiter. Restart `npm run dev` after changing env.

Optional: `ASK_LP_BASE_URL=http://localhost:3000` (default).
## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/portfolio_lokanath.git
   ```

2. Install dependencies:

   ```bash
   cd portfolio_lokanath
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔗 Live Demo

Visit my portfolio at: [https://lokanathpanda.netlify.app](https://lokanathpanda.netlify.app)


## 🤝 Contact

Feel free to reach out to me:

- GitHub: [@iamlokanath](https://github.com/iamlokanath)
- LinkedIn: [Lokanath Panda](https://linkedin.com/in/lokanath-panda)
