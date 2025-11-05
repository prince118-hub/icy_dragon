# Icy Dragon 🐉❄️

Icy Dragon is a student-built, hands-on demo that illustrates how to create an interactive 3D web scene using Three.js, Vite, and Electron. The repository provides a compact example that is easy to run and modify, aimed at teaching key WebGL concepts without overwhelming detail.

**What you'll find in this project:**

- A GLTF/GLB dragon model loaded from `public/` and placed into a simple scene
- A lightweight particle-based snow system and subtle atmospheric lighting to add depth
- Camera modes and simple controls for cinematic presentation and focused "hero" views
- Raycasting-enabled interactions (hover and click) plus basic keyboard toggles
- **Desktop application** built with Electron for cross-platform deployment

**Design goals:**

- **Be educational:** clear code and a small surface area for learners to explore
- **Be portable:** run on typical student laptops without heavy GPU requirements
- **Be extensible:** provide a foundation you can fork and build upon for experiments or assignments
- **Be distributable:** package as a standalone desktop application

**Intended audience:** students learning Three.js, instructors looking for a demo to demonstrate concepts, or hobbyists exploring web 3D basics.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)
- [Authors](#authors)
- [License](#license)

## ✨ Features

- 🎨 Interactive 3D dragon model with animations
- ❄️ Realistic snow particle system
- 🎥 Multiple camera modes (cinematic & hero views)
- 🖱️ Mouse interactions with raycasting
- ⌨️ Keyboard controls and toggles
- 🖥️ Desktop application with Electron
- 📦 Standalone executable for Windows
- 🎮 Responsive controls and smooth animations

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

## 🚀 Installation

1. **Clone the repository:**

```powershell
git clone https://github.com/prince118-hub/icy_dragon.git
cd icy_dragon
```

2. **Install dependencies:**

```powershell
npm install
```

This will install all required packages including Three.js, Vite, Electron, and build tools.

## 💻 Development

### Web Development Mode

Run the development server with hot-reload:

```powershell
npm run dev
```

Open your browser at `http://127.0.0.1:5173` to see the app.

### Electron Development Mode

Run the app in Electron (desktop application):

```powershell
# First, build the web assets
npm run build

# Then run in Electron
npm run dev:electron
```

Or use the combined command:

```powershell
npm run build:electron
```

### Making Changes

- **Source files** are in `src/`

  - `src/script.js` - Main Three.js scene logic
  - `src/style.css` - Styling and layout
  - `src/index.html` - HTML structure

- **Static assets** (models, images) are in `public/`

  - `public/model/icy_dragon.glb` - 3D dragon model

- **Electron files** are in `electron/`
  - `electron/main.js` - Electron main process
  - `electron/preload.js` - Preload script for security

## 🏗️ Building for Production

### Web Build

Build the web version for deployment:

```powershell
npm run build
```

Output will be in the `dist/` folder.

### Desktop Application Build

#### Build Standalone Portable .exe (Recommended)

Creates a single executable file that can run on any Windows computer without installation:

```powershell
npm run dist:portable
```

**Output:** `release/IcyDragon-Portable.exe` (~85 MB)

- ✅ No installation required
- ✅ No dependencies needed (includes Node.js, Electron, and all assets)
- ✅ Just copy and run on any Windows PC
- ✅ Perfect for sharing with others

#### Build Installer + Portable

Build both NSIS installer and portable executable:

```powershell
npm run dist
```

**Output:**

- `release/IcyDragon-Portable.exe` - Standalone portable executable
- `release/Icy Dragon Setup X.X.X.exe` - Windows installer

The installer version creates:

- Start menu shortcuts
- Desktop shortcut
- Proper uninstall support
- Installation directory selection

### Distribution

After building, you can find your executables in the `release/` folder:

- **For quick sharing:** Use `IcyDragon-Portable.exe`
- **For formal distribution:** Use the installer `.exe` file

**Note:** These files are excluded from Git via `.gitignore`. You can upload them to GitHub Releases for distribution.

## 📁 Project Structure

```
Icy_Dragon/
├── electron/                    # Electron app files
│   ├── main.js                 # Main process (window creation)
│   └── preload.js              # Preload script (security bridge)
├── public/                      # Static assets (not processed by Vite)
│   └── model/
│       └── icy_dragon.glb      # 3D dragon model
├── src/                         # Source files (processed by Vite)
│   ├── index.html              # Main HTML file
│   ├── script.js               # Three.js scene and logic
│   └── style.css               # Styles
├── .gitignore                   # Git ignore rules
├── IcyDragon-Portable.exe       # Standalone executable
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── README.md                    # This file
└── vite.config.js              # Vite configuration
```

## 🛠️ Available Scripts

| Command                  | Description                                |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Start Vite dev server for web development  |
| `npm run dev:electron`   | Run app in Electron (requires build first) |
| `npm run build`          | Build web version for production           |
| `npm run build:electron` | Build and run in Electron                  |
| `npm run dist`           | Build Windows installer + portable .exe    |
| `npm run dist:portable`  | Build portable .exe only                   |
| `npm run preview`        | Preview production build locally           |
| `npm start`              | Start Electron app (requires build first)  |

## 🔧 Technologies Used

- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Electron](https://www.electronjs.org/)** - Desktop application framework
- **[electron-builder](https://www.electron.build/)** - Package and build Electron apps
- **[GSAP](https://greensock.com/gsap/)** - Animation library
- **[lil-gui](https://lil-gui.georgealways.com/)** - Lightweight UI controls

## 👥 Authors

- **Jay Anit**
- **Kent Harvey Savedra**
- **Prince Charles Aniñon**

**Course:** BSCS-3rd Year | ITE-18  
**Repository:** [github.com/prince118-hub/icy_dragon](https://github.com/prince118-hub/icy_dragon)

## 📄 License

This project is provided under the MIT License. Feel free to use, modify, and distribute this project for educational purposes.

## 🙏 Acknowledgments

- Built using Three.js and Vite
- Dragon model created for educational purposes
- Inspired by interactive web 3D demos

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```powershell
# Change port in vite.config.js or kill the process using port 5173
```

**Electron won't start:**

```powershell
# Make sure you build first
npm run build
npm run dev:electron
```

**Build fails:**

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

## 🚀 Deployment

### GitHub Releases

1. Build your executables:

```powershell
npm run dist
```

2. Create a new release on GitHub
3. Upload the files from `release/` folder:
   - `IcyDragon-Portable.exe`
   - `Icy Dragon Setup X.X.X.exe`

### Web Deployment

Deploy the `dist/` folder to:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Push `dist/` to `gh-pages` branch

## 📝 Git Workflow

### Initial Push to GitHub

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Icy Dragon 3D interactive app with Electron"

# Add remote repository
git remote add origin https://github.com/prince118-hub/icy_dragon.git

# Push to GitHub
git push -u origin main
```

### Updating Repository

```powershell
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Push to GitHub
git push
```

### What's Ignored by Git

The `.gitignore` file excludes:

- `node_modules/` - Dependencies (others will run `npm install`)
- `dist/` - Build output (others will run `npm run build`)
- `release/` - Electron executables (too large for Git)
- `.env` files - Environment variables (for security)
- Build artifacts (`.exe`, `.blockmap`, etc.)

**Note:** Users who clone your repo will need to:

1. Run `npm install` to get dependencies
2. Run `npm run build` to build the web version
3. Run `npm run dist:portable` to create the executable

---

**Enjoy exploring 3D web development! 🐉❄️**

If you have questions or suggestions, feel free to open an issue on GitHub.
