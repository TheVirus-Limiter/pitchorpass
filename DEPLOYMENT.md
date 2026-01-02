# Deploying Pitch or Pass to GitHub Pages

This guide covers deploying Pitch or Pass to GitHub Pages with full AI functionality.

## Option 1: Automatic Deployment with GitHub Actions (Recommended)

This method automatically builds and deploys your app with AI features whenever you push to the main branch.

### Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (public or private)
3. Don't initialize with README

### Step 2: Add Your OpenAI API Key as a Secret

1. Go to your repository's **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `VITE_OPENAI_API_KEY`
4. Value: Your OpenAI API key (starts with `sk-`)
5. Click **Add secret**

### Step 3: Push Your Code

Download your code from Replit and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository's **Settings** > **Pages**
2. Under "Build and deployment", select **GitHub Actions** as the source
3. The workflow will automatically run on push

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## Option 2: Manual Deployment (Demo Mode)

If you don't want to use your API key, the static build falls back to pre-generated demo data.

### Step 1: Build the Static Version

In the Replit shell, run:

```bash
chmod +x scripts/build-static.sh
./scripts/build-static.sh
```

This creates a `dist-static` folder with everything you need.

### Step 2: Download and Upload

1. In Replit's file panel, right-click on `dist-static`
2. Select "Download as ZIP"
3. Create a new GitHub repository
4. Upload all files from inside `dist-static` to your repo

### Step 3: Enable GitHub Pages

1. Go to your repository's **Settings** > **Pages**
2. Under "Source", select branch `main` and folder `/` (root)
3. Click **Save**

---

## How It Works

| Mode | Startup Pitches | Outcome Narratives | Founder Q&A |
|------|-----------------|-------------------|-------------|
| **With API Key** | AI-generated unique startups | AI-written stories | Live AI responses |
| **Demo Mode** | 10 pre-built pitches | Pre-written narratives | Not available |

Demo mode showcases different outcome types:
- Big wins (8x-15x returns)
- Modest exits (2-5x returns)
- Acqui-hires (talent acquisitions)
- Shutdowns (total losses)
- Missed opportunities (when you pass on winners)

---

## Security Note

When using `VITE_OPENAI_API_KEY`, the key is embedded in the JavaScript bundle. This is acceptable for:
- Personal projects
- Demo/portfolio sites with low traffic
- Educational purposes

For production apps with many users, use Replit's built-in deployment which keeps API keys secure on the server.

---

## Troubleshooting

### App shows 404 on refresh
The `404.html` file handles SPA routing. Make sure it was copied during the build process.

### API calls failing
- Check that your `VITE_OPENAI_API_KEY` secret is correctly set
- Verify the key has available credits
- Check browser console for errors

### Build failing in GitHub Actions
- Ensure all dependencies are committed
- Check the Actions tab for detailed error logs

### Blank page
- Clear browser cache
- Check that `.nojekyll` file exists
- Wait a few minutes for GitHub Pages to update
