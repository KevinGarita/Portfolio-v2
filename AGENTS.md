# AGENTS.md

<!-- BEGIN:context -->
## Context
This is Kevin Garita's personal portfolio: a single-page Astro site presenting him as a Software Engineer to recruiters and potential clients. It has anchor-navigated sections (Hero, About, Skills, Education & Certificates, Work Experience, Projects, Contact) plus an individual detail page per project. There is no admin/backend side to this project — all structured content (education, work, projects) lives as markdown files in the codebase, not a database.
<!-- END:context -->

<!-- BEGIN:design-priority -->
## Design priority
The approved **Claude Design** design in `design-reference/` is the primary source of truth for this project. Match it as closely as possible: layout, spacing, typography, color palette, component styling, animation/effect behavior, and responsive/mobile behavior (the reference design also covers small-screen layout — replicate it, don't redesign it). `design-reference/` is reference material only, not the target code architecture: it ships as a single bundled HTML/JS mockup (how Claude Design exports), and it must be adapted into idiomatic Astro components/pages, not copied as-is. Do not reinterpret or improve on the visual design on your own judgment — if something in it is ambiguous or missing, ask before improvising.
<!-- END:design-priority -->

<!-- BEGIN:stack -->
## Stack
- Framework: Astro 6+, static output (no adapter — Vercel serves `dist/` directly)
- Language: TypeScript
- Styles: TailwindCSS v4, configured via a `@theme` block in `src/styles/global.css` (no `tailwind.config.*` file — Tailwind v4 is CSS-first)
- UI components: Tailwind only — no component library (the approved design is fully achievable with plain Tailwind); do not add shadcn/ui
- Fonts: Geist (sans, body/UI) + Geist Mono (labels, nav, tags, small uppercase captions) + Instrument Serif (headings/italic accents) — loaded via Google Fonts, set as Tailwind theme font families in `@theme`
- Theme: dark only — no light mode, no theme toggle
- Content/data: Astro Content Collections defined in `src/content.config.ts` (Astro 6+ path, not `src/content/config.ts`), using the `glob()` loader and Zod (`z` from `astro:content`) — no database, no CMS. Optional URL fields use `z.url()` (Zod 4), not the deprecated `z.string().url()`.
- Site-wide content (name, email, links, CV, hero/about/contact copy, portrait reference): `src/data/site.ts`. Skills data: `src/data/skills.ts`. Collection query/formatting helpers (sorting, year-only dates, "Present" fallback, featured-project selection): `src/data/queries.ts`.
- Images: `astro:assets` for locally-imported images (portrait, etc.) — requires the `sharp` package.
- Package manager: **pnpm** (never npm or yarn)
- Lint/format: Biome (already installed), configured in `biome.json` with `html.experimentalFullSupportEnabled` and `css.parser.tailwindDirectives` enabled, and `design-reference/` excluded
- Deployment target: Vercel, static `dist/` output — no Astro adapter installed
- Auth / backend: none
<!-- END:stack -->

<!-- BEGIN:folder-structure -->
## Folder structure
- `src/content.config.ts` — Zod schema + `glob()` loader definitions for all three collections (Astro 6+ location — do not create `src/content/config.ts`)
- `src/content/education/` — one `.md` per academic degree or certificate/course (schema: `title`, `subtitle`, `logo?`, `startDate`, `endDate` + markdown body)
- `src/content/work/` — one `.md` per job (schema: `title`, `subtitle`, `logo?`, `startDate`, `endDate?`, `location?` + markdown body)
- `src/content/projects/` — one `.md` per project (schema: `title`, `description`, `image?`, `startDate`, `endDate`, `skills[]`, `featured?`, `demoLink?`, `sourceLink?` + markdown body used on the project's detail page)
- `src/data/site.ts` — site-wide content: name, email, social links, CV link, hero/about/contact copy, portrait reference
- `src/data/skills.ts` — categorized skills data for the Skills ("Toolbox") section
- `src/data/queries.ts` — shared helpers for reading/sorting content collections and formatting dates/featured selection
- `src/assets/portrait.jpg` — the About portrait; imported in `src/data/site.ts` and rendered via `astro:assets`. This is a fixed file Kevin replaces directly — never build an upload UI for it.
- `src/pages/` — routes, including the dynamic project detail route (e.g. `projects/[slug].astro`). This is a real statically generated route with its own URL (for sharing) — not the in-page JS overlay shown in the Claude Design mockup; the mockup's overlay behavior is a mockup-only interaction, replace it with real navigation.
- `src/components/` — one component per landing-page section/UI piece; reuse before creating new ones
- `src/layouts/` — shared page layout(s)
- `src/styles/global.css` — global styles and the Tailwind v4 `@theme` block (all design tokens: colors, fonts) — this is the single source for theme tokens, there is no `tailwind.config.*`
- `public/` — static assets (project images, CV-related files if not externally hosted)
- `design-reference/` — the Claude Design mockup export plus the temporary About portrait image; reference-only, excluded from Biome, never imported as code
<!-- END:folder-structure -->

<!-- BEGIN:commands -->
## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Preview build: `pnpm preview`
- Lint: `pnpm exec biome lint .`
- Format: `pnpm exec biome format --write .`
(Adjust the exact Biome invocation to match whatever scripts already exist in `package.json`; if a `pnpm lint` / `pnpm format` script exists, prefer that over calling `biome` directly. `biome.json` excludes `design-reference/` and enables `html.experimentalFullSupportEnabled` plus `css.parser.tailwindDirectives` — do not remove these settings.)
<!-- END:commands -->

<!-- BEGIN:conventions -->
## Conventions
- New content (a project, job, or education/certificate entry) is added as a new `.md` file in the matching `src/content/*` folder — never by editing page templates or hardcoding entries in components.
- All three collections are schema-validated with Zod in `src/content.config.ts`; do not read markdown files manually or bypass `getCollection()`. Use `src/data/queries.ts` for sorting/formatting logic instead of duplicating it per page.
- Optional Zod fields use `.optional()`; optional URL fields use `z.url().optional()`, never the deprecated `z.string().url()`.
- Styles: use Tailwind utility classes and this project's `@theme` tokens in `src/styles/global.css` (colors, spacing, font sizes); avoid one-off inline styles or magic hex/px values. If a new global token is needed to match the design, add it to `@theme`, not inline. Current color tokens: background, surface, portrait, ink (primary text), ink-soft, muted grays (`#a3a29e`/`#8c8b87`/`#7a7975`/`#6f6e6a`), ghost, code, accent (+ hover), success/status.
- Logos/images: `education`/`work` entries render their real `logo` image when provided (Kevin supplies the file/path); render the design's decorative placeholder pattern when `logo`/`image` is absent — that is the fallback, never the default. The About portrait is the fixed `src/assets/portrait.jpg` asset imported in `src/data/site.ts`, not an uploadable/draggable image field — do not build any upload UI for it. For now, use the placeholder image found in `design-reference/` as the actual portrait file, until Kevin replaces it.
- Components: keep one component per section (Hero, About, Skills, Education, WorkExperience, Projects, Contact) plus shared UI pieces (nav incl. the mobile full-screen menu, cards, marquee, section-reveal wrapper, scramble-text effect); reuse shared UI pieces instead of duplicating markup.
- Animations/effects: implement scroll-reveal, the logo/tech marquee, the name/caption scramble effect, and the animated "live / build" panel with CSS transitions/animations and minimal vanilla JS (`IntersectionObserver` for reveal, scrollspy for the active nav item). Do not add animation libraries (no GSAP, no Framer Motion, etc.).
- All animated/motion effects (including scramble effects and the mobile menu open/close) must respect `prefers-reduced-motion`.
- Project detail pages derive their layout from the project's markdown body: `## Heading` → a full-width section (ruled off from the previous one, listed in the sticky "On this page" index on wide screens); an image-only paragraph → full-width screenshot; a `**value** description` list → result/metric cards. Don't hardcode this structure per project — parse/render it generically from the body.
<!-- END:conventions -->

<!-- BEGIN:rules -->
## Rules
### Always
- Follow the Claude Design reference in `design-reference/` as the primary visual guide, including its mobile/responsive behavior — but adapt it into real Astro components and Tailwind styles, never copy its HTML/JS structure directly.
- Use `pnpm` for every install/run command.
- Validate new/edited content collection entries against their Zod schema in `src/content.config.ts` (a failing build means the entry is wrong, not the schema).
- Respect `prefers-reduced-motion` in any animation work.
- Install `sharp` when using `astro:assets` for local images (required for the portrait and any other locally-imported image).

### Ask before
- Changing a content collection's schema (adding/removing/renaming a field) — this affects every existing `.md` file in that collection. (The optional fields and `featured`/`location` additions described here are already approved — no need to re-ask about those specifically.)
- Adding a new top-level folder under `src/`.
- Adding a contact form, multi-language support, a light mode/theme toggle, an Astro deployment adapter, or any other feature explicitly marked out of scope in the PRD/SDD.

### Never
- Never commit secrets or `.env` files.
- Never introduce a database, CMS, or admin panel — content stays in markdown files.
- Never add a contact form.
- Never add shadcn/ui or any other UI/animation library.
- Never build an image upload/drag-and-drop UI (the About portrait and all logos are fixed static assets Kevin configures directly).
- Never create `src/content/config.ts` (the old Astro path) — the collections config lives at `src/content.config.ts`.
- Never install/reintroduce the Astro Vercel adapter — this is a fully static site.
- Never bypass Biome (no manual formatting that conflicts with it, no disabling lint rules to avoid fixing an issue, no removing the `design-reference/` exclusion).
<!-- END:rules -->

<!-- BEGIN:tests -->
## Tests
No automated test suite is defined for this project. Before considering a change complete: run `pnpm build` to confirm the site builds cleanly (including Zod validation of all content collections), and visually verify the affected section/page — including at a mobile width (<900px) — against the Claude Design reference in `design-reference/`.
<!-- END:tests -->

<!-- BEGIN:doc-sources -->
## Documentation source priority
- Before consulting Context7, always check whether a local skill is installed for that specific tool or library.
- If a local skill exists for the topic, use it as the primary source.
- If no local skill exists for that tool or library, use Context7 for up-to-date documentation.
<!-- END:doc-sources -->
