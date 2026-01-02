#!/bin/bash

echo "Building Pitch or Pass for GitHub Pages..."

# Build with static config
npx vite build --config vite.static.config.ts

# Copy index.html to 404.html for SPA routing
cp dist-static/index.html dist-static/404.html

# Create .nojekyll to prevent Jekyll processing
touch dist-static/.nojekyll

echo ""
echo "Build complete! The 'dist-static' folder is ready for GitHub Pages."
echo ""
echo "To deploy:"
echo "1. Download the dist-static folder as a ZIP"
echo "2. Extract and push to a GitHub repository"
echo "3. Enable GitHub Pages in repository settings"
echo ""
