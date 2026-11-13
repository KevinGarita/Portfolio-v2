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
- Below 900px width, the nav collapses into a full-screen mobile menu overlay; the collapsed nav bar shows the currently active section's label in place of the full link list. Opening/closing the overlay respects `prefers-reduced-motion`.

### Hero
- The system displays an "open to opportunities" availability indicator, name/title, a short row of role tags (e.g. Software Engineer / SEO & Web Performance / Cloud Engineering — the ongoing one suffixed "— in progress"), a tagline, and CTA buttons.
- CTAs: an email action using a `mailto:` link with a pre-filled subject, and circular icon buttons for LinkedIn ("in") and GitHub ("gh"). No X/Twitter or Dribbble links (present in the original Claude Design mockup but dropped for the real site).
- The system displays a decorative, animated "live / build" code-style panel, matching the Claude Design layout, as a non-functional visual element (no real code execution). The name ("Kevin Garita") animates in with a scramble/decode-style text effect on load.
- The system displays a continuously auto-scrolling (marquee) strip of technology names, per the Claude Design layout (plain text, not logo images, matching that design).
- All motion effects (name scramble, animated panel, marquee) respect `prefers-reduced-motion`.

### About
- The system displays a dedicated bio/introduction section, visually distinct from the Hero, including a personal portrait image with small caption labels (e.g. location, "Est. <year>") that reveal via a scramble/decode text effect on hover (respecting `prefers-reduced-motion`).
- The portrait image is a fixed static asset configured by Kevin in code (`src/assets/portrait.jpg`, imported and optimized via `astro:assets`), not user-uploadable — the Claude Design mockup's drag-and-drop image placeholder is a mockup-only editing affordance and is not part of the real site. Kevin replaces this file directly to change the photo.

### Skills
- The system displays skills grouped into categories (e.g. Frontend, Backend, Tools/DevOps), under the heading "Toolbox".

### Education & Certificates
- The system reads all entries from the `education` content collection and renders them (timeline or cards), ordered by date, under the heading "Education & credentials".
- Each entry displays title, subtitle, logo (if provided — see Data model), and a date display. Dates show years only: a range like "2014 — 2018", or a single year (e.g. "2021") when start and end fall in the same year.
- The entry's markdown body is rendered as-is (whatever the author wrote — a paragraph, a list, or both), not forced into a specific list format.

### Work Experience
- The system reads all entries from the `work` content collection and renders them as a timeline, ordered by date, under the heading "Career path".
- Each entry displays title (company), subtitle (role), logo (if provided), and a date/status line: a year range with an optional location/mode tag (e.g. "2019 — 2022 · Hybrid"), or, for an entry with no `endDate`, "<startYear> — Present" (optionally with a location tag, e.g. "2022 — Present · Remote").
- The entry's markdown body is rendered as achievement bullets.

### Projects
- The system reads all entries from the `projects` content collection and renders them on the landing page under the heading "Selected work": the featured project (see Data model) as one large, full-width card, and the remaining projects in a grid of smaller cards.
- If no project is explicitly marked `featured`, the most recently dated project (by `startDate`) is featured automatically.
- Each card displays title, description, image (if provided — see Data model), a discreet monospace date line (e.g. "Featured · 2025" for the featured card, or the project's year for others), skill tags, and (if present) demo/source links.
- A "All repositories →" link near the section heading points to Kevin's GitHub profile.
- The user can navigate from a project card to that project's individual detail page.
- Each project has a statically generated detail page (dynamic route) showing its full content, with a shareable URL (e.g. `/projects/[slug]`). This is a real route, not the in-page JS overlay shown in the Claude Design mockup — see the note under User flows below.
- The detail page derives its layout from the project's markdown body using these conventions: each `## Heading` starts a full-width section in a single reading column (also listed in a sticky "On this page" index on wide screens); a paragraph containing only image(s) renders as full-width screenshot(s); a list whose items follow a `**value** description` pattern renders as a row of result/metric cards (value emphasized, description below it). A meta row above the content is derived from the entry's frontmatter (Timeline, Duration, Year, Stack, as applicable). The page's kicker label reads "Featured case study" for the featured project and "Case study" for others.
- "Next project" navigation at the bottom of the detail page follows the same order used on the landing page (featured project first, then the rest in their grid order).

### Contact
- The system displays, under the heading "Let's talk about your next project": an email action (`mailto:` with a pre-filled subject) and a CV download/view action, plus social links limited to LinkedIn and GitHub (no other networks).
- The footer shows "© <current year> Kevin Garita".
- No contact form exists anywhere on the site.

## 4. User flows

### Browsing the landing page
Happy path:
1. The user opens the site root URL.
2. Astro serves the statically generated landing page with all sections rendered from the content collections at build time.
3. The user clicks a nav link (or scrolls manually); the page smooth-scrolls to the target section and the nav updates to reflect the active section. Below 900px, the user instead opens the full-screen mobile menu to navigate.

Error flows:
- If a content collection has zero entries (e.g. an empty `projects` folder), that section renders its container/heading without items rather than breaking the page.
- If an image referenced by a markdown entry (logo or project image) fails to load, or the entry has no image at all (`logo`/`image` are optional — see Data model), the layout falls back to the design's decorative placeholder pattern rather than breaking or shifting unpredictably.
- If JavaScript fails to load (scrollspy/marquee/reveal animations, mobile menu, scramble effects), anchor navigation must still work via native browser `#hash` links and native CSS `scroll-behavior: smooth`, since these are progressive enhancements, not hard dependencies.

### Opening a project's detail page
Happy path:
1. The user clicks a project card (or its "Details"/"Case study" link) on the landing page.
2. The browser navigates to the project's static detail route (e.g. `/projects/websites-classifier-by-naive-bayes`).
3. Astro serves the pre-rendered detail page, with its meta row, kicker, and body content laid out per the markdown conventions described in Features → Projects.
4. The user can navigate back to the landing page (browser back, or a link back to `#projects`), or continue to the next project via the "Next project" link, which follows the same order as the landing page.

Error flows:
- If the user requests a project slug that does not exist, the site returns a 404 page (Astro's default 404 handling for unmatched static routes).
- If a project entry is missing a required field at build time (schema validation failure), the build fails with a clear Zod validation error rather than shipping broken content to production.

Note: the Claude Design mockup shows the project "case study" opening as a full-screen JS-driven overlay with no URL change (a `detailOpen` state toggle). This has been resolved as a real, statically generated route per project (see Architecture and Data model below) — a shareable URL is required even though SEO is not a concern for this site. The detail page's visual layout should still match the Claude Design case-study layout as closely as possible; only the navigation mechanism (real route vs. in-page overlay) differs from the literal mockup.

### Downloading the CV / following a social link / emailing
Happy path:
1. The user clicks the CV button; the browser opens or downloads the linked file (e.g. a hosted PDF, such as a Google Drive link, as in the previous version).
2. The user clicks the LinkedIn or GitHub icon button; the browser opens the external profile in a new tab.
3. The user clicks the email action; the browser opens the default mail client via a `mailto:` link with a pre-filled subject.

Error flows:
- If the external CV link is broken or unreachable, this is outside the system's control (external hosting); the link itself must still be a valid, direct URL configured in one place (`src/data/site.ts` — see Architecture) so it's easy to update.
- If the user has no configured mail client, the `mailto:` link simply fails to open an app — this is expected browser/OS behavior, not a bug to handle in-app.

## 5. Technical architecture

- **Role:** Single-side static site (no public/admin split, no backend service).
- **Frontend framework:** Astro (latest stable version, Astro 6+), using Astro's static rendering (no SSR needed for this content).
- **Language:** TypeScript.
- **Styling:** TailwindCSS v4, configured via a `@theme` block in `src/styles/global.css` — there is no `tailwind.config.*` file (Tailwind v4's CSS-first configuration).
- **UI components:** Tailwind only — no component library. The approved Claude Design mockup is fully reproducible with plain Tailwind (custom-styled buttons, pills, cards, borders); shadcn/ui is not introduced.
- **Typography:** Two font families, per the Claude Design mockup — **Geist** (sans-serif, body text and UI elements), **Geist Mono** (monospace, used throughout for labels, nav items, tags, and small uppercase captions), and **Instrument Serif** for headings and italic accents. Loaded via Google Fonts and set as Tailwind theme font families in the `@theme` block, not ad-hoc per component.
- **Color palette:** Dark theme only, per the Claude Design mockup — no light mode, no theme toggle. Defined as definitive Tailwind v4 `@theme` tokens in `src/styles/global.css` (not inline hex values): background `#0a0b0c`, surface (cards/panels) `#0b0c0d`, portrait/media background `#141412`, primary text `#eceae6`, muted text scale `#a3a29e` / `#8c8b87` / `#7a7975` / `#6f6e6a`, `ink-soft` `#c9c7c2`, `ghost` `#5c5b58`, `code` `#34332f` (decorative code-panel text color), accent `#e3b778` (hover `#f0cf9c`), success/status dot `#7fbf8e`.
- **Icons:** Real institution/company logo images for `education`/`work` entries when provided (via the optional `logo` field — see Data model), served as static assets; the design's decorative placeholder pattern is the fallback when an entry has no logo, not the default. The technology marquee in the Hero uses plain text names (matching the mockup), not logo icons.
- **Content/data layer:** Astro Content Collections defined in **`src/content.config.ts`** (Astro 6+ requires this file at `src/content.config.ts`, not the older `src/content/config.ts`), using the `glob()` loader (`loader: glob({ pattern: '**/*.md', base: './src/content/<collection>' })`) and Zod schemas built with the `z` export from `astro:content`. No database, no CMS, no admin panel.
- **Data fetching:** `getCollection()` from `astro:content`, called at build time; sorting and formatting (e.g. year-only date display, "Present" fallback, featured-project selection) live in shared helpers in `src/data/queries.ts` rather than being repeated per page/component.
- **Site-wide content data:** Non-collection content (name, email, social links, CV link, hero/about/contact copy, portrait reference) lives in `src/data/site.ts`, not hardcoded inline in components. The Skills section's categorized data lives in `src/data/skills.ts`.
- **Validation:** Zod schemas on each collection enforce required/optional fields and types at build time. Optional URL fields use `z.url()` (Zod 4 syntax), not the deprecated `z.string().url()`.
- **Package manager:** **pnpm** (not npm/yarn) for all install/dev/build/lint commands.
- **Linting/formatting:** Biome (already installed), configured via `biome.json` with `html.experimentalFullSupportEnabled` (for real `.astro` file support), `css.parser.tailwindDirectives` enabled, and the `design-reference/` folder excluded from linting/formatting.
- **Deployment:** Vercel. The site is fully static (no server-rendered routes), so **no Astro Vercel adapter is installed** — Vercel serves the `dist/` build output directly.
- **Image optimization:** The portrait (and any other locally-imported images processed through `astro:assets`) requires the `sharp` package as a build dependency.
- **Authentication:** None — the entire site is public and read-only.
- **Third-party integrations:** None beyond Google Fonts, static asset hosting (logos/images), and the external CV file link.
- **Folder structure:** The project already exists (Astro already initialized, Biome already installed). Content collections live under `src/content/`, one subfolder per collection, each containing that collection's `.md` files, with the collection config file at the project's content root (not inside `src/content/`):
  - `src/content.config.ts` — Zod schema/loader definitions for all collections
  - `src/content/education/*.md`
  - `src/content/work/*.md`
  - `src/content/projects/*.md`
  - `src/data/site.ts`, `src/data/skills.ts`, `src/data/queries.ts` — site-wide content and content-collection query/formatting helpers
  - `src/assets/portrait.jpg` — the About portrait, imported through `astro:assets`
  Beyond this confirmed content structure, the rest of the folder layout (components, layouts, pages, styles) follows whatever structure Claude Code recommends for an Astro project of this shape, kept consistent with Astro conventions (`src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `public/`).

### 5.1 Data model

All three collections are defined in `src/content.config.ts` using `defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/<collection>' }), schema: z.object({...}) })`, matching the fields already used in the previous version of the portfolio, with the adjustments below approved during implementation.

- **`education`** (folder: `src/content/education/`) — covers both academic degrees and courses/certificates in a single collection.
  - `title: z.string()` — institution or platform name (e.g. "Udemy", "Tecnológico de Costa Rica").
  - `subtitle: z.string()` — degree or course name (e.g. "Master Python Course").
  - `logo: z.string().optional()` — path or URL to the logo image. When omitted, the entry renders with the design's decorative placeholder pattern instead of a logo.
  - `startDate: z.coerce.date()`
  - `endDate: z.coerce.date()`
  - Markdown body: free-form content (paragraph and/or list — credential ID, description, duration, etc.), rendered as-is.
  - Rules: `title`, `subtitle`, `startDate`, `endDate` required; `logo` optional. Entries sorted by `startDate` (descending) when listed. Displayed dates show years only (see Features → Education & Certificates).

- **`work`** (folder: `src/content/work/`)
  - `title: z.string()` — company name.
  - `subtitle: z.string()` — role/position.
  - `logo: z.string().optional()` — path or URL to the logo image. When omitted, falls back to the decorative placeholder pattern.
  - `startDate: z.coerce.date()`
  - `endDate: z.coerce.date().optional()` — omitted for the current role, which displays as "<startYear> — Present".
  - `location: z.string().optional()` — a short work-mode/location tag (e.g. "Remote", "Hybrid", "Presencial"/"On-site"), shown alongside the date line when present.
  - Markdown body: free-form bullet content (achievements), rendered as-is.
  - Rules: `title`, `subtitle`, `startDate` required; `logo`, `endDate`, `location` optional. Entries sorted by `startDate` (descending) when listed.

- **`projects`** (folder: `src/content/projects/`)
  - `title: z.string()`
  - `description: z.string()`
  - `image: z.string().optional()` — path or URL to the project's cover image. When omitted, falls back to the decorative placeholder pattern.
  - `startDate: z.coerce.date()`
  - `endDate: z.coerce.date()`
  - `skills: z.array(z.string())` — technology tags.
  - `featured: z.boolean().optional()` — marks the project shown as the large, full-width card on the landing page. If no project has `featured: true`, the most recently dated project (by `startDate`) is treated as featured automatically.
  - `demoLink: z.url().optional()`
  - `sourceLink: z.url().optional()`
  - Markdown body: extended project description shown on the individual detail page, following the heading/image/results-list conventions described in Features → Projects.
  - Rules: `title`, `description`, `startDate`, `endDate`, and `skills` required; `image`, `featured`, `demoLink`, `sourceLink` optional (a project may have none, some, or all of these). Each entry's filename/slug is used to generate its detail route (`/projects/[slug]`). Entries sorted by `startDate` (descending) when listed; the featured project is pulled out and shown first regardless of that order, and "Next project" on the detail page follows this same featured-first order.

## 6. Non-functional requirements
- **Performance:** The site must load fast; avoid heavy animation libraries (no GSAP, no Framer Motion). Scroll-reveal, marquee, and scramble-text effects use CSS transitions/animations plus minimal vanilla JS (`IntersectionObserver`). Images (logos, project covers, the portrait) are optimized via `astro:assets` where they are local files (requires the `sharp` package).
- **Accessibility:** Respect `prefers-reduced-motion` for all animations/effects (scroll-reveal, marquee, name/caption scramble, animated code panel, mobile menu transitions). Meaningful `alt` text on all images. Sufficient color contrast against the dark theme's background/text colors.
- **SEO:** Not a priority for this project — the individual project detail pages exist to provide a shareable URL, not for search visibility. Basic page `<title>` and description are still set for usability (browser tabs, link previews), but no dedicated SEO work (structured data, sitemaps, meta tag optimization) is in scope.
- **Language:** English only; no i18n/multi-language support. (Section headings and UI copy are written in English — e.g. "Toolbox", "Education & credentials", "Career path", "Selected work", "Let's talk about your next project" — even though the Claude Design mockup itself used Spanish placeholder copy in places; see PRD § Assumptions.)
- **Maintainability:** Adding a new project/job/certificate must require only adding a new `.md` file to the corresponding collection folder — no code changes to templates or components.
- **Fidelity to design:** The Claude Design design in `design-reference/` is the primary source of truth for visual implementation (layout, spacing, typography, color, effects, and responsive/mobile behavior) and takes priority over any other design interpretation during implementation.
- **Availability:** Static site hosted on Vercel (serving the `dist/` output directly, no adapter); no custom uptime requirements beyond Vercel's standard hosting guarantees.
