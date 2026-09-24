# Kevin Garita Portfolio — PRD

## 1. Overview
This project is Kevin Garita's personal portfolio: a single-page website that presents him as a Software Engineer to recruiters, potential clients, and collaborators. It replaces an earlier version of the portfolio with a new visual design (created in Claude Design) and a content architecture based on markdown files instead of a database, keeping the site simple to maintain and free of any admin panel or backend.

There is only one side to this project (no public/admin split): a single landing page plus individual detail pages for each project.

## 2. Problem and context
Kevin needs an online presence that summarizes his professional profile (experience, education, certificates, and projects) in a format he can update himself, without touching a database or building an admin interface. The previous version of the portfolio already solved this with markdown content files; this project carries that same approach forward while giving the site a new, more professional and distinctive visual design.

## 3. Objectives
- Present Kevin's professional profile (bio, skills, education, work experience, and projects) in a single scrollable landing page.
- Let visitors reach more detail on any project through a dedicated project page with its own shareable URL (this is about having a link to share, not about search visibility — SEO is not a priority for this project).
- Make it easy for Kevin to add or update content (a new job, certificate, or project) by adding or editing a markdown file, without code changes to the page templates.
- Deliver a fast, professional-looking site that follows the approved Claude Design design exactly.

**Non-objectives:**
- No contact form.
- No blog, testimonials, or other sections beyond the ones listed below.
- No admin panel, authentication, or database.

## 4. Success metrics
No numeric KPIs were defined for this project. Success is qualitative: the deployed site matches the Claude Design design, all content sections render correctly from markdown files, and Kevin can add a new project/job/certificate by only creating a new markdown file.

## 5. Users and profiles
- **Visitor (recruiter, client, or collaborator):** Browses the landing page to learn about Kevin's background, skills, and experience, and may open an individual project page for more detail. Main actions: read the bio, scan skills/experience/education, browse projects, open a project's detail page, download the CV, or reach out via social links/email.
- **Kevin (content owner):** Not a runtime user of the site — he maintains content by editing markdown files directly in the codebase (no in-browser editing, no login).

## 6. Usage scenarios
- A recruiter opens the portfolio link from a CV or LinkedIn profile, scrolls through the anchor-navigated sections to get a full picture of Kevin's background, and clicks into a project to see more detail before reaching out by email.
- A potential client lands on the site, checks the Projects section for relevant past work, opens the demo link of a project, and downloads the CV.
- Kevin finishes a new freelance job and adds a new markdown file under the work collection; the Work Experience section picks it up automatically on the next build/deploy.

## 7. Scope — features and requirements

### Navigation
- Single landing page with a sticky/fixed nav bar.
- Anchor-based navigation with smooth scroll to: Home (Hero), About, Skills, Education & Certificates, Work Experience, Projects, Contact.
- The nav highlights the section currently in view (scrollspy).

### Hero
- Displays name, professional title, and a short tagline.
- CTA buttons: social links, email, and CV download/view.
- A subtle infinite-scroll marquee strip of technology logos.

### About
- Dedicated section (separate from the Hero) for Kevin's personal bio/introduction.

### Skills
- Skills are grouped by category (e.g., Frontend, Backend, Tools/DevOps), not a flat list.

### Education & Certificates
- Single collection covering both academic degrees and courses/certificates (as in the previous version of the portfolio).
- Each entry shows an institution/platform name, a subtitle (degree or course name), a logo, a date range, and free-form markdown content (credential ID, description, duration, etc.) rendered as a list.

### Work Experience
- Timeline of jobs, each with company name, role, logo, date range, and markdown content rendered as achievement bullets.

### Projects
- Grid/list of project cards on the landing page: title, short description, image, date range, technology tags, and optional demo/source links.
- Each project also has its own individual detail page with a real, shareable URL (e.g. `/projects/[slug]`), showing the full project content. Visually this follows the Claude Design "case study" layout; the design shows this opening as an in-page overlay, but it is implemented as a real page instead so it has its own link to share.

### Contact
- Final section with no contact form.
- Shows social links, an email button (mailto), and a CV download/view button.

## 8. Out of scope
- Contact form of any kind.
- Testimonials/recommendations section (no content available for this yet).
- Blog or articles section.
- Admin panel, authentication, or database-backed content management.
- Multi-language support (the site is English-only).

## 9. Assumptions and dependencies
- The visual design is already finalized in Claude Design and is the source of truth for layout, styling, and visual effects; this PRD does not redefine design details already decided there.
- The Astro project has already been initialized and Biome has already been installed; this is an existing codebase to build on, not a project bootstrapped from scratch.
- Content (bios, real project descriptions, real experience/education entries) will be added later by Kevin directly as markdown files; this PRD does not include real content.
- The Claude Design mockup includes a few mockup-only affordances that do not carry over to the real site: a drag-and-drop image upload placeholder for the About portrait (the real site uses a fixed image Kevin configures), decorative placeholder blocks standing in for real institution/company logos (the real site uses actual logo images), and some interface copy shown in Spanish as placeholder/lorem text (the real site's content is written in English, per the language constraint below).
- The design has no light mode or theme toggle; the site is dark-only.

## 10. Constraints
- English-only content; no i18n.
- No database and no admin panel — all structured content lives in markdown files inside the codebase.
- No contact form under any circumstance.
- The approved Claude Design design takes priority over any other design interpretation.

## 11. Milestones/phases
Not applicable — no phased delivery was defined for this project.
