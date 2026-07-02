# Project Detail Pages Design

**Date:** 2026-07-02  
**Feature:** Individual project pages for portfolio  
**Status:** Design phase

## Overview

Transform the portfolio from linking directly to GitHub projects to serving individual project detail pages at `/project/[slug]`. Each page displays project metadata (tech stack, links, media) alongside a longer-form description/write-up.

## Requirements

- Add project detail pages accessible at `/project/[slug]`
- Each page includes: hero media (video or screenshot), full-width description, tech stack, GitHub link, optional live demo link
- Homepage project links now navigate to detail pages instead of GitHub
- Reuse existing header for navigation (user can click logo to return home)
- Smart media handling: show video if available, otherwise screenshot

## Data Structure

Projects are defined in a single JSON file: `content/projects.json`

### Schema

```json
{
  "projects": [
    {
      "slug": "project-identifier",
      "title": "namespace/project-name",
      "shortDescription": "One-liner for homepage display",
      "description": "Longer form description/write-up for detail page (supports markdown or plain text)",
      "tech": ["React", "TypeScript", "Next.js"],
      "github": "https://github.com/user/repo",
      "demo": "https://example.com",
      "media": {
        "video": null,
        "screenshot": "/projects/screenshot.png"
      }
    }
  ]
}
```

**Fields:**

- `slug` (required): URL-safe project identifier
- `title` (required): Display name (e.g., "neiforfaen/neiforfaen")
- `shortDescription` (required): Used on homepage
- `description` (required): Full description for detail page
- `tech` (required): Array of technology names
- `github` (required): GitHub repository URL
- `demo` (optional): Live demo URL
- `media.video` (optional): Video URL or local path
- `media.screenshot` (optional): Image URL or local path

## File Structure

```
app/
  page.tsx                      # Update to use projects.json
  project/
    [slug]/
      page.tsx                  # Dynamic project detail route
components/
  project.tsx                   # Update ProjectList to link to /project/[slug]
  project/
    detail.tsx                  # Project detail page layout
content/
  projects.json                 # Project metadata
  projects/                     # Media assets (screenshots, videos)
    neiforfaen-screenshot.png
    kosei-demo.mp4
    (etc.)
```

## Page Layout

### Project Detail Page (`/project/[slug]`)

**Visual hierarchy:**

1. **Header** (full width)
   - Existing header component with logo/nav
   - Logo clickable to return to homepage

2. **Hero Media** (full width)
   - Responsive container with aspect ratio control
   - Displays video if available, else screenshot
   - Video: embedded with controls
   - Screenshot: img with alt text

3. **Description** (full width)
   - Prose content
   - Markdown rendering if description contains markup

4. **Meta Section** (two-column split on desktop, stacked on mobile)
   - **Left column (50%):** Tech Stack
     - Display as pills/badges
     - Simple visual list
   - **Right column (50%):** Links
     - GitHub link (required)
     - Demo link (conditional)
     - Open in new tab

## Implementation Details

### Components

**`app/project/[slug]/page.tsx`** (new)

- Fetch project data from `projects.json` by slug
- Handle 404 for invalid slugs
- Generate metadata (title, og:image, etc.)
- Render detail layout

**`components/project/detail.tsx`** (new)

- Layout component combining hero, description, meta sections
- Reusable for consistent styling across projects

**`components/project.tsx`** (update)

- Change project links from direct GitHub URLs to `/project/[slug]`
- Update click handler to track navigation to detail page instead

**`lib/projects.ts`** (new)

- Helper to load and parse `projects.json`
- Type-safe project data access
- Slug validation

### Metadata & SEO

- Generate page `<title>` from project title
- Generate description from `shortDescription`
- Set `og:image` to screenshot/video thumbnail
- Add canonical URL

### Mobile Responsiveness

- Hero media: full width, maintain aspect ratio
- Description: full width
- Meta section: stack to single column on mobile (<lg breakpoint)

## Data Migration

Current `components/project.tsx` has 4 hardcoded projects. Migrate to `projects.json`:

```
neiforfaen/neiforfaen
neiforfaen/braglist-llm
neiforfaen/kosei
neiforfaen/raiu
```

Extract existing titles and descriptions; add media/tech/links from each repo.

## Edge Cases & Assumptions

- **Missing media:** If neither video nor screenshot provided, show placeholder or graceful fallback
- **Invalid slug:** 404 page (already exists)
- **Demo URL missing:** GitHub link is always required; demo is optional
- **Markdown in description:** Support basic markdown or plain text; scope: bold, italic, links, line breaks

## Success Criteria

- [ ] Project detail pages render at `/project/[slug]`
- [ ] Homepage project links navigate to detail pages
- [ ] Media displays correctly (video or screenshot fallback)
- [ ] Tech stack and links display in split columns (desktop) / stacked (mobile)
- [ ] Metadata/SEO tags generated correctly
- [ ] All 4 existing projects have detail pages with metadata
- [ ] Can click logo to return to homepage
