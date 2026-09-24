# Kevin Garita Portfolio — Technical Specification (SDD)

## 1. Product vision
A single-page personal portfolio for Kevin Garita, a Software Engineer, built with Astro. It presents his profile to recruiters and potential clients through anchor-navigated sections and links out to individual project detail pages, with all structured content authored as markdown files instead of stored in a database.

## 2. Users and use cases
- **Visitor:** Scroll through anchor sections, open a project's detail page, download the CV, follow a social link, send an email.
- **Kevin (maintainer):** Add a new markdown file to a content collection (`education`, `work`, or `projects`) to publish a new entry; edit an existing `.md` file to update content. No in-app editing UI.

## 3. Features (by module)

### Navigation
- The system displays a sticky/fixed nav bar with links to each section.
- The user can click a nav link to smooth-scroll to the corresponding section.
- The system highlights the nav item matching the section currently in the viewport (scrollspy).

### Hero
- The system displays an "open to opportunities" availability indicator, name/title, a short row of role tags (e.g. Software Engineer / SEO & Web Performance / Cloud Engineering), a tagline, and CTA buttons (social links, email, CV).
- The system displays a decorative code-style visual panel, matching the Claude Design layout, as a non-functional visual element (no real code execution).
- The system displays a continuously auto-scrolling (marquee) strip of technology names, per the Claude Design layout (plain text, not logo images, matching that design).

### About
- The system displays a dedicated bio/introduction section, visually distinct from the Hero, including a personal portrait image.
- The portrait image path is fixed in code/config by Kevin (a static asset reference), not user-uploadable — the Claude Design mockup's drag-and-drop image placeholder is a mockup-only editing affordance and is not part of the real site.

### Skills
- The system displays skills grouped into categories (e.g. Frontend, Backend, Tools/DevOps).

### Education & Certificates
- The system reads all entries from the `education` content collection and renders them (timeline or cards), ordered by date.
- Each entry displays title, subtitle, logo, date range, and its markdown body (credential ID, description, duration, etc.) as rendered content.

### Work Experience
- The system reads all entries from the `work` content collection and renders them as a timeline, ordered by date.
- Each entry displays title (company), subtitle (role), logo, date range, and its markdown body rendered as achievement bullets.

### Projects
- The system reads all entries from the `projects` content collection and renders them as cards on the landing page, ordered by date.
- Each card displays title, description, image, date range, skill tags, and (if present) demo/source links.
- The user can navigate from a project card to that project's individual detail page.
- Each project has a statically generated detail page (dynamic route) showing its full content, with a shareable URL (e.g. `/projects/[slug]`). This is a real route, not the in-page JS overlay shown in the Claude Design mockup — see the note under User flows below.

### Contact
- The system displays social links, an email action (`mailto:`), and a CV download/view action.
- No contact form exists anywhere on the site.

## 4. User flows

### Browsing the landing page
Happy path:
1. The user opens the site root URL.
2. Astro serves the statically generated landing page with all sections rendered from the content collections at build time.
3. The user clicks a nav link (or scrolls manually); the page smooth-scrolls to the target section and the nav updates to reflect the active section.

Error flows:
- If a content collection has zero entries (e.g. an empty `projects` folder), that section renders its container/heading without items rather than breaking the page.
- If an image referenced by a markdown entry (logo or project image) fails to load, the browser falls back to the image's `alt` text; the layout must not break or shift unpredictably.
- If JavaScript fails to load (scrollspy/marquee/reveal animations), anchor navigation must still work via native browser `#hash` links and native CSS `scroll-behavior: smooth`, since these are progressive enhancements, not hard dependencies.

### Opening a project's detail page
Happy path:
1. The user clicks a project card (or its "Details" link) on the landing page.
2. The browser navigates to the project's static detail route (e.g. `/projects/websites-classifier-by-naive-bayes`).
3. Astro serves the pre-rendered detail page with the project's full markdown content.
4. The user can navigate back to the landing page (browser back, or a link back to `#projects`).

Error flows:
- If the user requests a project slug that does not exist, the site returns a 404 page (Astro's default 404 handling for unmatched static routes).
- If a project entry is missing a required field at build time (schema validation failure), the build fails with a clear Zod validation error rather than shipping broken content to production.

Note: the Claude Design mockup shows the project "case study" opening as a full-screen JS-driven overlay with no URL change (a `detailOpen` state toggle). This has been resolved as a real, statically generated route per project (see Architecture and Data model below) — a shareable URL is required even though SEO is not a concern for this site. The detail page's visual layout (back link, title, tags, image, content) should still match the Claude Design case-study layout as closely as possible; only the navigation mechanism (real route vs. in-page overlay) differs from the literal mockup.

### Downloading the CV / following a social link / emailing
Happy path:
1. The user clicks the CV button; the browser opens or downloads the linked file (e.g. a hosted PDF, such as a Google Drive link, as in the previous version).
2. The user clicks a social icon/link; the browser opens the external profile in a new tab.
3. The user clicks the email action; the browser opens the default mail client via a `mailto:` link (optionally pre-filled subject, as in the previous version).

Error flows:
- If the external CV link is broken or unreachable, this is outside the system's control (external hosting); the link itself must still be a valid, direct URL configured in one place (see Architecture) so it's easy to update.
- If the user has no configured mail client, the `mailto:` link simply fails to open an app — this is expected browser/OS behavior, not a bug to handle in-app.

## 5. Technical architecture

- **Role:** Single-side static site (no public/admin split, no backend service).
- **Frontend framework:** Astro (latest stable version), using Astro's static rendering (no SSR needed for this content).
- **Language:** TypeScript.
- **Styling:** TailwindCSS.
- **UI components:** Tailwind only — no component library. The approved Claude Design mockup is fully reproducible with plain Tailwind (custom-styled buttons, pills, cards, borders); shadcn/ui is not introduced.
- **Typography:** Two font families, per the Claude Design mockup — **Geist** (sans-serif) for body text and UI elements, and **Instrument Serif** for headings and italic accents. Loaded as webfonts (e.g. self-hosted or via Google Fonts) and set as Tailwind theme font families, not ad-hoc per component.
- **Color palette:** Dark theme only, per the Claude Design mockup — no light mode, no theme toggle. Approximate reference values: background `#0a0b0c` (cards/panels `#0b0c0d`), primary text `#eceae6`, muted text scale `#a3a29e` / `#8c8b87` / `#7a7975` / `#6f6e6a`, accent `#e3b778` (hover `#f0cf9c`), success/status dot `#7fbf8e`. Defined as Tailwind theme tokens, not inline hex values.
- **Icons:** Real institution/company logo images for `education`/`work` entries (via the `logo` field — see Data model), served as static assets. The Claude Design mockup shows generic decorative placeholder blocks in these spots; that is a mockup-only stand-in — the real site uses actual logo images supplied by Kevin, with the decorative block as a fallback only when an entry has no logo. The technology marquee in the Hero uses plain text names (matching the mockup), not logo icons.
- **Content/data layer:** Astro Content Collections (`astro:content`), with schemas defined using **Zod** in `src/content/config.ts`. No database, no CMS, no admin panel.
- **Data fetching:** `getCollection()` from `astro:content`, called at build time in the relevant `.astro` pages/components; entries are sorted by date in the calling code.
- **Validation:** Zod schemas on each collection enforce required fields and types at build time.
- **Package manager:** **pnpm** (not npm/yarn) for all install/dev/build/lint commands.
- **Linting/formatting:** Biome (already installed in the project), replacing ESLint/Prettier.
- **Deployment:** Vercel, via Astro's official Vercel adapter (static output).
- **Authentication:** None — the entire site is public and read-only.
- **Third-party integrations:** None beyond static asset hosting (logos/images) and the external CV file link.
- **Folder structure:** The project already exists (Astro already initialized, Biome already installed). Content collections live under `src/content/`, one subfolder per collection, each containing that collection's `.md` files:
  - `src/content/education/*.md`
  - `src/content/work/*.md`
  - `src/content/projects/*.md`
  Beyond this confirmed content structure, the rest of the folder layout (components, layouts, pages, styles) follows whatever structure Claude Code recommends for an Astro project of this shape, kept consistent with Astro conventions (`src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `public/`).

### 5.1 Data model

All three collections are defined in `src/content/config.ts` using `defineCollection({ type: 'content', schema: z.object({...}) })`, matching the fields already used in the previous version of the portfolio.

- **`education`** (folder: `src/content/education/`) — covers both academic degrees and courses/certificates in a single collection.
  - `title: z.string()` — institution or platform name (e.g. "Udemy", "Tecnológico de Costa Rica").
  - `subtitle: z.string()` — degree or course name (e.g. "Master Python Course").
  - `logo: z.string()` — path or URL to the logo image.
  - `startDate: z.coerce.date()`
  - `endDate: z.coerce.date()`
  - Markdown body: free-form bullet content (credential ID, description, duration, etc.), rendered as-is.
  - Rules: all fields required; entries sorted by `startDate` (descending) when listed.

- **`work`** (folder: `src/content/work/`)
  - `title: z.string()` — company name.
  - `subtitle: z.string()` — role/position.
  - `logo: z.string()` — path or URL to the logo image.
  - `startDate: z.coerce.date()`
  - `endDate: z.coerce.date()`
  - Markdown body: free-form bullet content (achievements), rendered as-is.
  - Rules: all fields required; entries sorted by `startDate` (descending) when listed.

- **`projects`** (folder: `src/content/projects/`)
  - `title: z.string()`
  - `description: z.string()`
  - `image: z.string()` — path or URL to the project's cover image.
  - `startDate: z.coerce.date()`
  - `endDate: z.coerce.date()`
  - `skills: z.array(z.string())` — technology tags.
  - `demoLink: z.string().url().optional()`
  - `sourceLink: z.string().url().optional()`
  - Markdown body: extended project description shown on the individual detail page.
  - Rules: `title`, `description`, `image`, `startDate`, `endDate`, and `skills` required; `demoLink` and `sourceLink` optional (a project may have neither, either, or both). Each entry's filename/slug is used to generate its detail route (`/projects/[slug]`). Entries sorted by `startDate` (descending) when listed on the landing page.

## 6. Non-functional requirements
- **Performance:** The site must load fast; avoid heavy animation libraries (no GSAP, no Framer Motion). Scroll-reveal and marquee effects use CSS transitions/animations plus minimal vanilla JS (`IntersectionObserver`). Images (logos, project covers) should be reasonably optimized (Astro's built-in image handling where applicable).
- **Accessibility:** Respect `prefers-reduced-motion` for all animations/effects. Meaningful `alt` text on all images. Sufficient color contrast against the dark theme's background/text colors.
- **SEO:** Not a priority for this project — the individual project detail pages exist to provide a shareable URL, not for search visibility. Basic page `<title>` and description are still set for usability (browser tabs, link previews), but no dedicated SEO work (structured data, sitemaps, meta tag optimization) is in scope.
- **Language:** English only; no i18n/multi-language support.
- **Maintainability:** Adding a new project/job/certificate must require only adding a new `.md` file to the corresponding collection folder — no code changes to templates or components.
- **Fidelity to design:** The Claude Design design is the primary source of truth for visual implementation (layout, spacing, typography, color, effects) and takes priority over any other design interpretation during implementation.
- **Availability:** Static site hosted on Vercel; no custom uptime requirements beyond Vercel's standard hosting guarantees.
