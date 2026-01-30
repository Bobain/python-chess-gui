# Asset Generation Guide

The app requires PNG image assets. SVG source files are provided in `/assets/`.

## Required Assets

1. **icon.png** (1024x1024) - App icon
2. **splash.png** (1284x2778) - Splash screen
3. **adaptive-icon.png** (1024x1024) - Android adaptive icon foreground
4. **favicon.png** (48x48) - Web favicon

## Generate PNGs from SVGs

You can use various tools to convert the SVG files to PNG:

### Using ImageMagick (CLI)
```bash
convert assets/icon.svg -resize 1024x1024 assets/icon.png
convert assets/splash.svg -resize 1284x2778 assets/splash.png
convert assets/adaptive-icon.svg -resize 1024x1024 assets/adaptive-icon.png
convert assets/favicon.svg -resize 48x48 assets/favicon.png
```

### Using sharp (Node.js)
```bash
npx sharp-cli assets/icon.svg -o assets/icon.png -w 1024 -h 1024
```

### Online Tools
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

## Quick Start (Placeholder)

For development, you can create simple placeholder PNGs or skip asset validation:

```bash
# Skip asset validation during development
npx expo start --clear
```

The app will work without custom icons during development.
