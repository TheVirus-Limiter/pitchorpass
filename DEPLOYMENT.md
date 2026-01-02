# Deploying Pitch or Pass to GitHub Pages

This guide explains how to deploy the static demo version of Pitch or Pass to GitHub Pages.

## What You Get

The static version includes:
- 10 pre-generated startup pitches (5 Early Stage + 5 Later Stage)
- Full gameplay experience with reveal screens and outcome graphs
- All visual features (hand-drawn graphs, archetype badges, etc.)
- No server or API keys required

## Quick Deploy (Download ZIP Method)

### Step 1: Build the Static Version

In the Replit shell, run:

```bash
chmod +x scripts/build-static.sh
./scripts/build-static.sh
```

This creates a `dist-static` folder with everything you need.

### Step 2: Download the Build

1. In Replit's file panel, right-click on `dist-static`
2. Select "Download as ZIP"
3. Save to your computer

### Step 3: Upload to GitHub

1. Create a new GitHub repository (or use an existing one)
2. Extract the ZIP contents
3. Upload all files from inside `dist-static` to your repo's root or a `docs` folder

### Step 4: Enable GitHub Pages

1. Go to your repository's **Settings** > **Pages**
2. Under "Source", select:
   - Branch: `main` (or your default branch)
   - Folder: `/` (root) or `/docs` depending on where you uploaded
3. Click **Save**

Your game will be live at: `https://[your-username].github.io/[repo-name]/`

## Alternative: Using gh-pages Branch

If you prefer the traditional gh-pages branch approach:

```bash
# After building
cd dist-static
git init
git add .
git commit -m "Deploy Pitch or Pass"
git branch -M gh-pages
git remote add origin https://github.com/[your-username]/[repo-name].git
git push -f origin gh-pages
```

Then in repository Settings > Pages, select the `gh-pages` branch.

## Troubleshooting

### Blank Page or 404 Errors

The build uses relative paths (`./`) so it should work in any subfolder. If you see issues:

1. Make sure `404.html` is present (it's created automatically)
2. Check that `.nojekyll` file exists (prevents Jekyll processing)
3. Wait a few minutes for GitHub Pages to update

### Assets Not Loading

If images or fonts don't load:

1. Clear your browser cache
2. Check browser console for path errors
3. Ensure all files from `dist-static` were uploaded

## File Structure

After building, `dist-static` contains:

```
dist-static/
├── index.html          # Main app entry
├── 404.html           # SPA fallback (copy of index.html)
├── .nojekyll          # Tells GitHub not to use Jekyll
└── assets/
    ├── index-*.js     # App bundle
    ├── index-*.css    # Styles
    └── ...            # Other assets
```

## Demo Mode

The static build automatically uses pre-generated demo data instead of calling OpenAI. The 10 startup pitches showcase different outcome types:

- **Big wins** (8x-15x returns)
- **Modest exits** (2-5x returns)  
- **Acqui-hires** (talent acquisitions)
- **Shutdowns** (total losses)
- **Missed opportunities** (when you pass on winners)

Each playthrough uses the same companies but your investment decisions determine your final score and investor archetype.
