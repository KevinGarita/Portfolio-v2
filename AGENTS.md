# AGENTS.md

<!-- BEGIN:context -->
## Context
This is Kevin Garita's personal portfolio: a single-page Astro site presenting him as a Software Engineer to recruiters and potential clients. It has anchor-navigated sections (Hero, About, Skills, Education & Certificates, Work Experience, Projects, Contact) plus an individual detail page per project. There is no admin/backend side to this project — all structured content (education, work, projects) lives as markdown files in the codebase, not a database.
<!-- END:context -->

<!-- BEGIN:design-priority -->
## Design priority
The approved **Claude Design** design (mockup/artifact provided by the user) is the primary source of truth for this project. Match it as closely as possible: layout, spacing, typography, color palette, component styling, and animation/effect behavior. Do not reinterpret or improve on the design on your own judgment — if something in the design is ambiguous or missing, ask before improvising.
<!-- END:design-priority -->

<!-- BEGIN:stack -->
## Stack
- Framework: Astro (latest stable), static output
- Language: TypeScript
- Styles: TailwindCSS
- UI components: Tailwind only — no component library (the approved design is fully achievable with plain Tailwind); do not add shadcn/ui
- Fonts: Geist (sans, body/UI) + Instrument Serif (headings/italic accents), set as Tailwind theme font families
- Theme: dark only — no light mode, no theme toggle
- Content/data: Astro Content Collections (`astro:content`) with Zod schemas — no database, no CMS
- Package manager: **pnpm** (never npm or yarn)
- Lint/format: Biome (already installed)
- Deployment target: Vercel (Astro Vercel adapter)
- Auth / backend: none
<!-- END:stack -->

<!-- BEGIN:folder-structure -->
## Folder structure
- `src/content/education/` — one `.md` per academic degree or certificate/course (schema: `title`, `subtitle`, `logo`, `startDate`, `endDate` + markdown body)
- `src/content/work/` — one `.md` per job (schema: `title`, `subtitle`, `logo`, `startDate`, `endDate` + markdown body)
- `src/content/projects/` — one `.md` per project (schema: `title`, `description`, `image`, `startDate`, `endDate`, `skills[]`, `demoLink?`, `sourceLink?` + markdown body used on the project's detail page)
- `src/content/config.ts` — Zod schema definitions for the three collections above
- `src/pages/` — routes, including the dynamic project detail route (e.g. `projects/[slug].astro`). This is a real statically generated route with its own URL (for sharing) — not the in-page JS overlay shown in the Claude Design mockup; the mockup's overlay behavior is a mockup-only interaction, replace it with real navigation.
- `src/components/` — one component per landing-page section/UI piece; reuse before creating new ones
- `src/layouts/` — shared page layout(s)
- `src/styles/` — global styles/Tailwind config entry point
- `public/` — static assets (logos, project images, CV-related files if not externally hosted)
<!-- END:folder-structure -->

<!-- BEGIN:commands -->
## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Preview build: `pnpm preview`
- Lint: `pnpm exec biome lint .`
- Format: `pnpm exec biome format --write .`
(Adjust the exact Biome invocation to match whatever scripts already exist in `package.json`; if a `pnpm lint` / `pnpm format` script exists, prefer that over calling `biome` directly.)
<!-- END:commands -->

<!-- BEGIN:conventions -->
## Conventions
- New content (a project, job, or education/certificate entry) is added as a new `.md` file in the matching `src/content/*` folder — never by editing page templates or hardcoding entries in components.
- All three collections are schema-validated with Zod in `src/content/config.ts`; do not read markdown files manually or bypass `getCollection()`.
- Styles: use Tailwind utility classes and this project's Tailwind theme/tokens (colors, spacing, font sizes); avoid one-off inline styles or magic values. If a new global token is needed to match the design, add it to the Tailwind config/theme, not inline.
- Logos/images: `education`/`work` entries render their real `logo` image (Kevin supplies the file/path); use the design's decorative placeholder pattern only as a fallback when an entry has no logo, never as the default. The About portrait is a fixed static asset configured by Kevin, not an uploadable/draggable image field — do not build any upload UI for it.
- Components: keep one component per section (Hero, About, Skills, Education, WorkExperience, Projects, Contact) plus shared UI pieces (nav, cards, marquee, section-reveal wrapper); reuse shared UI pieces instead of duplicating markup.
- Animations/effects: implement scroll-reveal and the logo marquee with CSS transitions/animations and minimal vanilla JS (`IntersectionObserver` for reveal, scrollspy for the active nav item). Do not add animation libraries (no GSAP, no Framer Motion, etc.).
- All animated/motion effects must respect `prefers-reduced-motion`.
<!-- END:conventions -->

<!-- BEGIN:rules -->
## Rules
### Always
- Follow the Claude Design design as the primary visual reference (see Design priority above).
- Use `pnpm` for every install/run command.
- Validate new/edited content collection entries against their Zod schema (a failing build means the entry is wrong, not the schema).
- Respect `prefers-reduced-motion` in any animation work.

### Ask before
- Changing a content collection's schema (adding/removing/renaming a field) — this affects every existing `.md` file in that collection.
- Adding a new top-level folder under `src/`.
- Adding a contact form, multi-language support, a light mode/theme toggle, or any other feature explicitly marked out of scope in the PRD/SDD.

### Never
- Never commit secrets or `.env` files.
- Never introduce a database, CMS, or admin panel — content stays in markdown files.
- Never add a contact form.
- Never add shadcn/ui or any other UI/animation library.
- Never build an image upload/drag-and-drop UI (the About portrait and all logos are fixed static assets Kevin configures directly).
- Never bypass Biome (no manual formatting that conflicts with it, no disabling lint rules to avoid fixing an issue).
<!-- END:rules -->

<!-- BEGIN:tests -->
## Tests
No automated test suite is defined for this project. Before considering a change complete: run `pnpm build` to confirm the site builds cleanly (including Zod validation of all content collections), and visually verify the affected section/page against the Claude Design design.
<!-- END:tests -->

<!-- BEGIN:doc-sources -->
## Documentation source priority
- Before consulting Context7, always check whether a local skill is installed for that specific tool or library.
- If a local skill exists for the topic, use it as the primary source.
- If no local skill exists for that tool or library, use Context7 for up-to-date documentation.
<!-- END:doc-sources -->
