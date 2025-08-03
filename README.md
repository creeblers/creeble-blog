# Creeble Blog

A modern, static blog built with **Astro** and powered by **Notion** via the **Creeble SDK**. This blog automatically fetches content from your Notion database and generates a fast, static website with pagination and individual post pages.

## ✨ Features

- 📝 **Notion-powered content** - Write posts in Notion, publish automatically
- ⚡ **Static generation** - Lightning-fast loading with pre-built HTML
- 📱 **Responsive design** - Works perfectly on all devices
- 🔄 **Smart pagination** - Navigate between pages with proper back-button support
- 🎨 **GSAP animations** - Smooth card animations on page load
- 🚀 **GitHub Pages deployment** - Automatic deployment via GitHub Actions
- 🔗 **Webhook support** - Rebuild site when content changes
- 🔍 **SEO optimized** - Structured data and meta tags included

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static site generator
- **[Creeble SDK](https://creeble.com)** - Notion API integration
- **[GSAP](https://gsap.com)** - Animations
- **[Sass](https://sass-lang.com)** - CSS preprocessing
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm
- A Notion database with blog posts
- Creeble API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd creeble-blog
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PUBLIC_CREEBLE_API_KEY=your_creeble_api_key
   PROJECT_ENDPOINT=your_project_endpoint
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

   Your site will be available at `http://localhost:4321`

## 📊 Notion Database Setup

Your Notion database should have these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | Title | ✅ | Post title |
| `slug` | Rich Text | ✅ | URL slug (e.g., "my-post-title") |
| `excerpt` | Rich Text | ❌ | Short description for SEO |
| `featured_image` | Files | ❌ | Featured image for post |
| `published_date` | Date | ❌ | Publication date |

## 🔧 Configuration

### Pagination Settings

Modify pagination in `src/pages/[...page].astro`:

```javascript
return paginate(sortedPosts, { 
  pageSize: 3  // Change this number
});
```

And update the corresponding value in `src/pages/posts/[slug].astro`:

```javascript
const pageSize = 3; // Keep this in sync
```

### Creeble SDK Usage

The main integration is in `src/lib/creeble.ts`:

```typescript
import { Creeble } from 'creeble-js';

const creebleClient = new Creeble(apiKey);

// Get all posts with pagination support
export async function getPosts() {
  const response = await creebleClient.data.paginate(endpoint, 1, 25, {
    type: 'rows',
    database: 'Posts'
  });
  
  return response.data.filter(post => post.properties?.slug?.value);
}

// Get single post by slug
export async function getPostBySlug(slug: string) {
  return await creebleClient.getRowByField(endpoint, 'Posts', 'slug', slug);
}
```

## 🚀 Deployment

### GitHub Pages (Automatic)

The repository includes a GitHub Actions workflow that automatically:

1. **Builds the site** when you push to `master`
2. **Fetches latest content** from Notion during build
3. **Deploys to GitHub Pages** automatically

#### Setup:

1. **Enable GitHub Pages** in your repository settings
2. **Add secrets** to your repository:
   - `PUBLIC_CREEBLE_API_KEY`
   - `PROJECT_ENDPOINT`
3. **Push to master branch** to trigger deployment

### Manual Rebuild

You can manually trigger a rebuild without code changes:

1. Go to **Actions** tab in your GitHub repository
2. Click **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** button

## 🔗 Webhook Integration

To automatically rebuild when your Notion content changes:

### Setup Webhook

1. **Create a GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with `repo` permissions

2. **Webhook Endpoint**:
   ```
   POST https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/dispatches
   ```

3. **Headers**:
   ```json
   {
     "Authorization": "Bearer YOUR_GITHUB_TOKEN",
     "Accept": "application/vnd.github.v3+json",
     "Content-Type": "application/json"
   }
   ```

4. **Body**:
   ```json
   {
     "event_type": "content-update"
   }
   ```

### Example cURL Command

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  -d '{"event_type": "content-update"}' \
  https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/dispatches
```

### Integration Options

- **Zapier/Make.com**: Connect Notion webhooks to GitHub API
- **Custom webhook service**: Build your own trigger endpoint
- **Scheduled builds**: Automatic rebuilds every 2 hours (see below)

## ⏰ Scheduled Rebuilds

The blog includes an automatic rebuild system that fetches fresh content from Notion every 2 hours:

### How it works:
- **GitHub Actions cron job** runs every 2 hours
- **Rebuilds the entire site** with latest Notion content
- **Redeploys to GitHub Pages** automatically
- **No code changes needed** - content updates automatically

### Configuration:
The scheduled rebuild is configured in `.github/workflows/scheduled-rebuild.yml`:

```yaml
on:
  schedule:
    - cron: '0 */2 * * *'  # Every 2 hours
```

### Manual trigger:
You can also trigger a rebuild manually:
1. Go to **Actions** tab in your GitHub repository
2. Click **"Scheduled Rebuild"** workflow  
3. Click **"Run workflow"** button

### Requirements:
Ensure these repository secrets are set:
- `PUBLIC_CREEBLE_API_KEY` - Your Creeble API key
- `PROJECT_ENDPOINT` - Your project endpoint (optional if using default)

## 📁 Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── PostCard.astro      # Individual post card
│   │   └── StructuredData.astro # SEO structured data
│   ├── layouts/
│   │   └── Layout.astro        # Base page layout
│   ├── lib/
│   │   └── creeble.ts          # Creeble SDK integration
│   └── pages/
│       ├── [...page].astro     # Paginated post listing
│       ├── [slug].astro        # Generic pages (like /about)
│       └── posts/
│           └── [slug].astro    # Individual post pages
├── astro.config.mjs            # Astro configuration
├── package.json
└── README.md
```

## 🎨 Styling

The project uses **Sass** for styling with a component-based approach. Key style files:

- Global styles in `src/layouts/Layout.astro`
- Component-specific styles in each `.astro` component
- Responsive design with mobile-first approach

## 🔍 SEO Features

- **Structured data** for blog posts and website
- **Meta tags** with dynamic content
- **Open Graph** tags for social sharing
- **Twitter Card** support
- **Semantic HTML** structure

## 🧞 Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally |
| `pnpm astro check` | Run Astro diagnostics |

## 🐛 Troubleshooting

### Common Issues

1. **Missing posts**: Check that all posts have `slug` values in Notion
2. **Build fails**: Verify environment variables are set correctly
3. **Pagination issues**: Ensure `pageSize` matches between files
4. **API errors**: Check your Creeble API key and project endpoint

### Debug Mode

Add debug logging to `src/lib/creeble.ts`:

```typescript
console.log(`Total posts fetched: ${response.data?.length}`);
```

## 📝 Content Workflow

1. **Write posts** in your Notion database
2. **Add required fields** (title, slug)
3. **Push code changes** or trigger webhook
4. **Site rebuilds** automatically with new content
5. **Changes go live** on GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [Your GitHub Pages URL]
- **Creeble SDK**: https://creeble.com
- **Astro Documentation**: https://docs.astro.build
- **GitHub Repository**: [Your Repository URL]

## 💡 Need Help?

- Check the [Astro documentation](https://docs.astro.build)
- Visit the [Creeble documentation](https://docs.creeble.com)
- Open an issue in this repository
- Join the [Astro Discord](https://astro.build/chat)

---

**Built with ❤️ using Astro and Creeble**