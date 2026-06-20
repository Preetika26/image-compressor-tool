# OptiPress | Premium Client-Side Image Compressor & WebP Converter

OptiPress is a secure, high-performance, and fully client-side image compression tool. Operating entirely within the browser, it allows users to optimize multiple files simultaneously and convert them to the modern WebP format without uploading files to any external servers.

---

## ⚡ Key Features

- **Private & Safe Processing:** All compression, calculations, and format conversions are performed locally in the user's browser via Web Workers and HTML Canvas. No backend is required, and no data is ever uploaded.
- **Single & Batch Compression:** 
  - **Single Mode:** Side-by-side or sliding visualizers, detailed quality adjustments, granular format conversions, and dimension analytics.
  - **Batch Mode:** Add multiple files, adjust settings globally or individually, track live progress per file, and download all compressed images in a single ZIP.
- **Sleek Custom Slider controls:** Quality sliders ranging from 10% to 100% to control size reduction vs. visual fidelity.
- **WebP Output support:** Convert original JPEG, JPG, and PNG files to highly optimized WebP format with a single click.
- **Impact Statistics Dashboard:** View real-time calculations showing total bytes saved, overall storage impact, and history logged securely to `localStorage`.
- **Delightful Micro-animations:** Premium look and feel incorporating CSS hover states, sliding transitions, dark/light mode states, and confetti animations on successful compressions.

---

## 📁 Project Directory Structure

```text
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Vector images and media assets
│   ├── components/         # High-fidelity visual components
│   │   ├── Header.jsx             # Top bar branding & dark mode toggle
│   │   ├── DropZone.jsx           # Drag-and-drop file uploader with validation
│   │   ├── SingleCompressor.jsx   # Single image preview, stats, & adjustments
│   │   ├── BatchCompressor.jsx    # Batch processing list & zip download triggers
│   │   └── CompressionHistory.jsx # Historical logs & impact analytics panel
│   ├── hooks/              # Custom reusable hooks
│   │   └── useLocalStorage.js     # State hook syncing to local storage
│   ├── utils/              # Utility helpers
│   │   └── helpers.js             # Byte formatters, dimensions, WebP converters
│   ├── App.jsx             # Root layout controller & state orchestrator
│   ├── favicon.svg         # SVG favicon
│   ├── index.css           # Tailwind base styles and theme customizations
│   └── main.jsx            # Entry react application bootstrap
├── index.html              # Entry HTML file configured for SEO
├── package.json            # Configuration, script tasks, & package dependencies
├── postcss.config.js       # Basic PostCSS configuration
├── tailwind.config.js      # Tailwind theme configuration
└── vite.config.js          # Vite config using @tailwindcss/vite compiler plugin
```

---

## 🛠️ Required Packages & Dependencies

### Main Dependencies
- `browser-image-compression` (`^2.0.2`): Quick, light Web-Worker compression algorithms.
- `jszip` (`^3.10.1`): ZIP archiving utility for batch downloads.
- `canvas-confetti` (`^1.9.4`): Visual completion celebration animations.
- `lucide-react` (`^1.21.0`): Premium, clean SVG visual indicators and icons.

### Development Dependencies
- `vite` & `@vitejs/plugin-react`: Native build-tool pipeline.
- `tailwindcss` & `@tailwindcss/vite` (v4): High-performance native utility classes compiled directly in Vite.

---

## 🚀 Setup and Local Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18 or higher recommended) installed.

### 1. Clone or Copy the Workspace
Navigate into the project directory:
```bash
cd Image-compressor-Frontend
```

### 2. Install Project Dependencies
Use your preferred package manager:
```bash
npm install
```

### 3. Run Local Development Server
Launch the local Hot-Module-Replacement development server:
```bash
npm run dev
```
Open your browser and visit `http://localhost:5173`.

### 4. Build Production Bundle
To create a production-ready compressed build:
```bash
npm run build
```
This outputs compiled static files in the `/dist` directory.

---

## 🌐 Step-by-Step Vercel Deployment Instructions

Since OptiPress requires zero backend databases or APIs, it can be deployed on the Vercel Hobby plan for free in under two minutes:

### Option A: Using Vercel Git Integration (Recommended)
1. Commit and push your local repository to GitHub, GitLab, or Bitbucket.
2. Sign in to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your git repository.
5. In the configuration settings, Vercel will automatically detect **Vite** as the framework preset:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **Deploy**. Vercel will build the project and assign a custom sub-domain.

### Option B: Using Vercel CLI (Command Line)
1. Install Vercel CLI globally if you haven't already:
   ```bash
   npm install -g vercel
   ```
2. Run the deployment command in the root folder:
   ```bash
   vercel
   ```
3. Follow the CLI login prompts.
4. Confirm project name and settings (keep default Vite configurations).
5. To deploy directly to production, run:
   ```bash
   vercel --prod
   ```
