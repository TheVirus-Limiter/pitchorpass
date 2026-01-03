#!/bin/bash

echo "Building Pitch or Pass for GitHub Pages..."

# Debug: show if API key is available (masked)
if [ -n "$VITE_OPENAI_API_KEY" ]; then
  echo "VITE_OPENAI_API_KEY is set (${#VITE_OPENAI_API_KEY} chars)"
else
  echo "WARNING: VITE_OPENAI_API_KEY is not set - will use demo mode"
fi

# Build with static config, ensuring env vars are passed to Vite
VITE_OPENAI_API_KEY="$VITE_OPENAI_API_KEY" \
GITHUB_REPOSITORY="$GITHUB_REPOSITORY" \
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
