# Wide Personality Quiz

A fun personality quiz that determines which "wide" character you are based on your answers.

## Features

- Interactive personality quiz with 10 questions
- 6 different personality types to discover
- Collection tracking with localStorage
- Floating background animations
- Responsive design
- Special "Golden Wide" achievement for completing all specific answers

## Personality Types

1. **Designerjandro** - Creative and chill artist
2. **Wideajandro** - Balanced and reliable
3. **Avengeajandro** - Warrior with a creative streak
4. **Guardianajandro** - Protective and watchful
5. **Schizo Government Agent** - Conspiracy theorist
6. **Golden Wide** - Legendary achievement (requires all golden answers)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run generate
```

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages via GitHub Actions.

### Setup Steps:

1. **Update Repository Name**: In `nuxt.config.ts`, change `baseURL: '/wide-test/'` to match your repository name
2. **Push to GitHub**: The workflow will automatically deploy when you push to the `main` branch
3. **Enable GitHub Pages**: 
   - Go to Repository Settings → Pages
   - Source: "GitHub Actions"

### Manual Deployment:

```bash
# Generate static files
npm run generate

# Deploy to gh-pages branch (if you have gh-pages installed)
npm run deploy
```

Your quiz will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Project Structure

```
├── app/
│   ├── app.vue           # Main component
│   └── data/
│       ├── questions.ts   # Quiz questions and weights
│       └── wideinfo.ts   # Personality type definitions
├── public/
│   └── wides/           # Character images
└── .github/workflows/
    └── deploy.yml       # GitHub Actions deployment
```

## Technologies Used

- Nuxt.js 4
- Vue.js 3
- TypeScript
- CSS Animations
- LocalStorage for collection tracking

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
