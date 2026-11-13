---
title: "Laura Monge Real Estate — Platform Rebuild"
description: "A from-scratch rebuild of the admin panel and database behind a bilingual luxury real estate website in Costa Rica: PostgreSQL on Supabase, scheduled Google and Central Bank data, Gemini-powered features and a tested CI/CD pipeline."
image: "/projects/laura-monge-platform-rebuild/dashboard.webp"
startDate: 2026-09-01
endDate: 2026-11-08
skills: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Google Cloud", "Gemini", "GitHub Actions", "Playwright", "Tailwind CSS", "shadcn/ui"]
demoLink: "https://lauramongerealestate.com"
featured: true
---

## The problem

Laura Monge Luxury Real Estate already had a website and an admin panel [built on Firebase](/projects/laura-monge-real-estate/). As the business grew, that first version reached its limits.

The panel was missing features the client kept asking for, such as prices in two currencies, photo ordering, control over URLs, real traffic statistics, and saving a property or post in progress so it isn't lost when leaving the form halfway. It also had bugs, and its design needed work.

The code was a limitation too. Long files mixed a lot of logic, few components were reusable and there was little documentation, both in the code and for the project. There were no tests either, so any change could break something else without anyone noticing. Loading indicators and success or error notices didn't cover every action.

The other issue was the data. Real estate is relational: a property has a type, an operation, a place in a location hierarchy, features and an ordered set of photos. Firestore stores documents, so every search filter was a hand-maintained list saved as documents. Those lists could show options with no listings behind them or miss new ones, and querying across them took workarounds. On top of that:

- deleting a listing left a 404 behind and lost its Google ranking;
- the slug was generated once and couldn't be edited, so the URL went stale when the title changed;
- a property couldn't be marked as sold without deleting it;
- `lastmod` dates for the sitemap weren't reliable;
- photos had no order and no alt text.

Because of how the code was built, we decided to rebuild the panel from scratch; because of the data, we moved it to a relational database.

## The solution

A private admin panel where the agent and her team manage all of the website's bilingual content (properties, blog posts, reviews, specialization zones, the agent profile and contact data) on a new PostgreSQL database in Supabase. The public website reads from the same database.

The database keeps the site's SEO correct by itself: redirects, indexable filter pages, `noindex` dates and `lastmod`. The panel adds a read-only dashboard with the portfolio, client interest and website traffic, plus two AI features: translating Spanish content to English and writing alt texts for every photo.

The panel's code is split into small components, hooks and helpers, each with one responsibility and shared across modules where it applies, and documented with JSDoc. Every action has loading, success and error states.

My role was full-stack developer for the panel and the database: requirements, UI design, database design, implementation, Google Cloud setup, tests and CI/CD. The public website was built by another developer, so this case study covers the panel, the database and the infrastructure around them.

## Architecture

The browser talks to Supabase directly for reads and simple writes, and Row Level Security decides what each user can see or change. The Next.js server is used only where it has to be: the `service_role` key, image processing with Sharp, and the calls to Google and the Central Bank.

![Architecture: admin panel and public website sharing one Supabase database, with Vercel Cron, Google Cloud, the Central Bank API and GitHub Actions; the panel tells the website which cached pages to refresh](/projects/laura-monge-platform-rebuild/architecture.webp)

Photos are uploaded from the browser straight to Storage with resumable (TUS) uploads. They never go through the server, which avoids Vercel's 4.5 MB request limit and lets 100 MB originals through.

Access is checked in three places: the Next.js proxy refreshes the session and protects the panel's routes (`/panel`), RLS checks on every query, through the database function `is_admin()`, that the user making it is an active admin, and every server action checks it again before doing anything.

### Keeping the public site fresh

Testing on a Vercel preview before launch showed a gap between the two apps. The public site caches its pages (ISR) for up to an hour, so a change saved in the panel reached the database at once but took up to an hour to appear on the site.

- The site now exposes a revalidation endpoint protected with a shared secret. After each change, the panel sends it tags that name kinds of data, not pages: `properties`, `articles`, `site-info`, `reviews`, `catalogs`, `exchange-rate`. The site decides which pages use each tag and expires only those, so the next visit already gets the new data.
- In the panel, each mutation declares its tags, and TanStack Query's global mutation cache sends them to a server action that sends the notice in Next.js `after()`, so a save never waits for the site. The daily exchange-rate and alt-text jobs send their own tags.
- It fails silently on purpose: the change is already in the database, and the site would show it at its next hourly regeneration anyway, so the admin never sees an error for it. On preview deployments the notice also carries Vercel's protection bypass header.

### The sitemap that never updated

On the same preview I noticed that the sitemap index showed the new `lastmod` dates, but the pages sitemap (`sitemap.xml`) kept the old ones. Since the public website was built by another developer, I flagged it and we investigated together. Finding the cause took several rounds, because at first everything pointed to the code:

1. **The code.** We compared that sitemap with the index, which did work: both were built the same way and used the same revalidation. We tried changes to the revalidation and nothing changed.
2. **The network headers.** With the code ruled out, we checked each sitemap's responses in the browser. Vercel's cache headers and the status codes showed that `sitemap.xml` was always served from the cache and never regenerated, while the index did revalidate.
3. **The deployment summary.** If Vercel never regenerated it, the question was how it was publishing it. I thought of checking the deployment summary, and it was obvious right away: `sitemap.xml` landed in Static Assets, next to `robots.txt` and the manifest, while every other sitemap ran as a Function. A static file has no function behind it, so no revalidation could ever update it.
4. **The name.** Since the route's code matched the other sitemaps, the only difference left was the name. We searched the docs and forums without finding anything to confirm it, so we decided to try another name: as `sitemap-pages.xml` it moved to Functions with the others, and it has revalidated like the rest ever since.

The reason was confirmed later in the Next.js source: any route ending in `/sitemap.xml` is treated as a metadata route, in the same group as `robots.txt` and the manifest, and those are cached by default. The lesson: when the code doesn't explain a behavior, check what the framework did with it at build time.

![Before: sitemap.xml under Static Assets in the Vercel deployment summary](/projects/laura-monge-platform-rebuild/vercel-deploy-sitemap-before.webp) ![After: sitemap-pages.xml under Functions with the other sitemaps](/projects/laura-monge-platform-rebuild/vercel-deploy-sitemap-after.webp)

## How I worked with AI

I built this project with Claude as a coding assistant (Claude Code). I defined what to build, how it had to behave and when it was correct; the AI wrote most of the code under those rules.

- Specs came first. Before any code I wrote the project description, requirements, user stories, a PRD, a technical specification and an `AGENTS.md` with the stack, conventions and rules, using reusable skills I built for that workflow. Every document was reviewed and corrected by me.
- I designed every screen of the panel in Claude Design. Those boards were the visual source of truth for the build.
- The work was split into small phases with a definition of done: lint and build clean, browser tests in three engines, a manual test list, code and security reviews, and my approval before the next phase started. Nothing was committed without that approval.
- I set guardrails: the AI works only on the local database and never touches the cloud projects. Database changes and new dependencies need my approval first. I set up Supabase, Google Cloud, Vercel and the GitHub secrets myself, by hand.
- During development the AI worked with skills for the stack's tools and with their current documentation instead of relying on what it already knew, and every phase went through a code review skill, plus a security review skill when it applied.
- The AI proposed options with their trade-offs and I made the decisions. Often I questioned a proposal, asked for the alternatives and their cost, or caught a gap it hadn't seen, like a missing redirect when flattening redirect chains (more on it under “Database design”).

## Database design

This was my favorite part of the project. I planned the database in a long back-and-forth with the AI, thinking about both apps at once: the public website needs fast filters and correct SEO, and the panel needs safe writes and admin-only data.

- Bilingual fields are `jsonb` `{ es, en }`, validated inside the database with `pg_jsonschema` in `CHECK` constraints.
- Locations follow a generic four-level hierarchy (countries → regions → municipalities → localities), seeded with Costa Rica's 494 official districts and 20 well-known beaches. The names match schema.org, and the model could take other countries later.
- The operation (for sale or for rent) is separate from availability (available, sold, rented, unavailable). A sold property stays published with a label, because it still has SEO value. A monthly job sets `noindex` six months after it went off the market.
- Prices are stored in the currency the admin chose, USD or CRC, and are never rewritten. A daily Central Bank rate and two computed columns, `price_usd` and `price_crc`, let the site filter and sort across both currencies.
- I dropped the view and like counters of the old version. That data already lives in Google Analytics, and dropping them saved triggers, a table and a job.
- `updated_at` (each record's last-edited date) is the sitemap's `lastmod`, and Google stops trusting a site's `lastmod` when it changes without the content changing. So it moves only when a value really changes. Columns that only change where an item is listed (featured, pinned, `noindex`, a zone's order) and images don't move it. A property's features coming in or going out do, and the panel can't write the timestamps at all.

![Supabase schema visualizer with the 22 tables grouped by domain: properties, catalogs, locations, blog and site content](/projects/laura-monge-platform-rebuild/supabase-schema.webp)

### SEO inside the database

- When a property or post slug changes, a trigger creates a permanent redirect. It flattens chains (A → B plus B → C becomes A → C and B → C, since Google may have indexed the middle URL B) and resolves collisions with reused slugs. A deleted property redirects to its locality's listing page.
- Catalog slugs (types, localities, features) can change freely until they appear in an indexable page. After that a trigger freezes them, so they never need a redirect.
- Indexable filter pages live in an insert-only table filled weekly by `pg_cron`. A combination of type, operation and location qualifies once it has at least three published properties, to avoid thin content. The site indexes only the combinations in this table; it serves the rest with `noindex, follow`.

### Filters from views

On Firebase, filter options were documents someone had to keep up to date. Now eight database views start from the published properties and return only the options in use, each with its name, slug and count, in one query. A locality appears in the filters as soon as it has a published property, and a bedroom count no listing has never shows up. The views run as `security_invoker`, so they respect RLS. Land stores `NULL` instead of `0` for bedrooms, so the views leave it out naturally.

### Hard problems

- Website clients and admins sign in with the same Google auth, so a session alone never means admin. `is_admin()` is checked live on every query, the role can't be changed through the API, and disabling an admin ends their sessions through a trigger. Supabase writes the role to `app_metadata` only after the insert trigger runs, so every profile now starts as a client and is promoted afterwards from the server.
- Storage doesn't cascade deletes. The save and delete functions run in one transaction, lock the row so two saves take turns, and return the file paths the panel has to remove. A deferred `UNIQUE` lets photo positions be rewritten from 1 to n in one statement.
- Testing against a real local Postgres caught bugs a review wouldn't have, like a coordinates `CHECK` that accepted a single coordinate because comparisons with `NULL` pass a `CHECK`.

## Sign-in & access

Sign-in is Google only. Website clients also sign in with Google to save favorites, so they get a clear "no access" screen here.

The Access screen adds admins by email, turns their access off or removes them. An admin can't turn off their own access, and turning someone's off ends their sessions right away.

![Google-only sign-in screen](/projects/laura-monge-platform-rebuild/login.webp) ![Access screen with active and disabled admins](/projects/laura-monge-platform-rebuild/access.webp)

## Dashboard

A read-only snapshot of the business:

- KPIs: listings on the website, available now, closed this year, registered clients, average rating and blog activity.
- The portfolio by status, type, operation, region and locality, and the sales and rentals closed this year.
- Prices by area in USD, with colón prices converted at today's rate. It shows four budget bands built from the quartiles, and a table with each area's average and range on a logarithmic scale, so very different prices stay readable.
- Client interest: favorites and sign-ups per month, and the most saved properties.

![Dashboard overview with KPIs and portfolio](/projects/laura-monge-platform-rebuild/dashboard.webp)

![Prices by area with budget bands and a logarithmic range chart](/projects/laura-monge-platform-rebuild/dashboard-prices.webp)

### Website traffic

Three cards built from Google Analytics 4 and Search Console data: visitors, Google search, and the most viewed properties and posts. A daily job refreshes the data, so the dashboard never waits on Google when it loads.

Fixed rules, not AI, turn the numbers into plain sentences, like "About 1 in 4 visitors had been here before." or "Usually on Google's second page." They also warn when a big percentage comes from small numbers, and pick up to three highlights per card. Contact clicks (WhatsApp, email, form) come from tracking events on the public site. They are matched to each property or post by page path, so no custom dimensions were needed.

![Visitors card with highlights, KPIs and visitors per day](/projects/laura-monge-platform-rebuild/dashboard-traffic.webp)

![Google search card and most viewed content](/projects/laura-monge-platform-rebuild/dashboard-search.webp) ![Most visited properties and most read blog posts](/projects/laura-monge-platform-rebuild/dashboard-content.webp)

## Properties

The list has status tabs, search and filters, and quick changes (status, published, featured) that update instantly and roll back if the save fails. Each price shows its approximate equivalent in the other currency.

![Properties list with filters and quick actions](/projects/laura-monge-platform-rebuild/properties.webp)

The editor is split into sections, each with a pill that shows whether it's complete. The title is composed automatically for SEO from the type, operation, locality, bedrooms and one indexable feature, for example "Luxury house for sale in Santa Teresa, with 4 bedrooms and ocean view – Villa Teresa Jungle". The admin only types the name. The URL is fixed when the property is created: changing it asks for confirmation, and the database creates the redirect. The editor also has a Google Maps pin with place search and a rich-text description in both languages.

![Property editor with the generated title, URLs and status](/projects/laura-monge-platform-rebuild/property-editor.webp)

The location uses the official region and municipality lists, a locality the admin can create, and an optional map pin. The pin can be dragged, placed with a click, found with Places search or set by pasting coordinates.

![Location section with the region, municipality and locality, and the Google Maps pin](/projects/laura-monge-platform-rebuild/property-location.webp)

Photos go in a drag-to-reorder gallery that takes photos of up to 100 MB each.

![Photo gallery with the drop zone, cover and drag handles](/projects/laura-monge-platform-rebuild/property-photos.webp)

Saving runs as visible steps:

1. Save the details.
2. Upload each new photo and optimize it on the server with Sharp (EXIF rotation, at most 2560 px, WebP).
3. Save the photo order through a database function.
4. Delete the files that were removed.

The dialog shows each step and a progress bar fed by the resumable uploads, so a slow connection still shows movement, and it asks the admin to keep the tab open until it finishes. A failed photo doesn't stop the others. "Try again" repeats only what failed, with two retries, and the flow never leaves orphan files in Storage.

![Save dialog uploading and optimizing photos, with a progress bar](/projects/laura-monge-platform-rebuild/property-save-progress.webp) ![Save dialog with every step completed](/projects/laura-monge-platform-rebuild/property-save-done.webp)

## Blog

The list has Published and Draft tabs, search, a pinned filter and quick changes like the properties list.

![Blog list filtered to pinned posts](/projects/laura-monge-platform-rebuild/blog.webp)

Posts use the same editor pattern: one cover shared by both languages and, per language, a title, URL, excerpt and rich text with its own images. Each field gives SEO tips as the admin types, such as the ideal title length. Tiptap stores Storage paths, not URLs, so the content survives a domain change. Next to every English field there is a "Translate from Spanish" button that translates with Gemini.

![Blog post editor with bilingual title fields and an SEO tip](/projects/laura-monge-platform-rebuild/blog-editor.webp) ![English content in the rich-text editor with Translate from Spanish](/projects/laura-monge-platform-rebuild/blog-content.webp)

## Site content

Reviews (rating, visibility, pinned, kept in the language they were written in) and specialization zones (drag to reorder, tied to a locality, optionally linked to that area's listing page) are edited side by side with their list. The agent profile, contact data and a read-only list of registered clients complete the panel. Every save shows a success or failure dialog with retries.

![Reviews with the edit panel](/projects/laura-monge-platform-rebuild/reviews.webp) ![Specialization zones with drag to reorder](/projects/laura-monge-platform-rebuild/zones.webp)

## Scheduled jobs

Three Vercel Cron routes, each protected with a secret token:

- Exchange rate (6:00 Costa Rica time): reads the Central Bank of Costa Rica's official sell rate from its public API, validates it and updates a single row. If the bank fails or hasn't published a rate, the previous rate stays and its date shows how old it is.
- Website traffic (6:30): four parallel Search Console queries and two GA4 batch requests of five reports each. Each source is validated with a Zod schema the dashboard shares, and the two are independent: a failed source keeps its last data.
- AI alt texts (7:00): completes any photo a save couldn't describe, up to 50 per run.

Two more jobs run inside the database with `pg_cron`: indexable filter pages every week and `noindex` every month. The Vercel jobs live in the panel because they need internet access and secrets; the database jobs only need data.

![Vercel Cron Jobs with the alt-text, exchange-rate and site-traffic routes and their daily triggers](/projects/laura-monge-platform-rebuild/vercel-cron-jobs.webp)

## Gemini in the panel

Gemini Flash on Google Cloud's Agent Platform, called through REST with the project's service account.

- Translation from Spanish to English for every English content field. The server takes each field's format and character limit from its own table, never from the request. Rich text goes as HTML and comes back through the editor's own extensions, which drop anything not allowed and any link the Spanish text didn't have. It asks before replacing English text, and each admin is limited to 20 calls per minute.
- Alt texts in both languages for every property photo and post cover. They are generated after the save without slowing it down (Next.js `after()`), and the daily job picks up anything left. The prompt gets its context from the database (property type, whether it's land) and describes only what's visible, with no sales adjectives.
- I compared Gemini's `MEDIUM` and `HIGH` image resolution on real photos. `MEDIUM` described them just as well for about 30% less, around US$0.0009 per photo.
- Errors are classified: an image error counts an attempt (three at most), while a service error (quota, billing, rate limit) stops the run without spending attempts, so an outage doesn't burn through the queue.

![Agent Platform traffic for the Gemini calls, with the requests, errors and latency per method](/projects/laura-monge-platform-rebuild/agent-platform-traffic.webp)

## Google Cloud setup

I'm learning cloud engineering, and this was my first real setup:

- One project and one service account with least privilege: a restricted user in Search Console, Viewer in GA4 and the Agent Platform User role for Gemini.
- The key is a sensitive environment variable, with separate keys for development and production so one can be revoked without touching the other. I evaluated Workload Identity Federation with Vercel's OIDC and documented why a key was enough for this project.
- One module authenticates and each Google API has its own module, so moving to keyless auth later would change a single file.
- A budget with a spend cap pauses Gemini if costs go over it, and a general budget alerts when spending across all services nears its amount. The Maps keys only work on each environment's domains and only for the two APIs the panel uses, with limited daily quotas and the methods it doesn't use set to zero.
- The Google Cloud OAuth client only accepts each environment's authorized origins and redirect URIs.

![Google Cloud budgets: a spend cap for Agent Platform and a general alert](/projects/laura-monge-platform-rebuild/google-cloud-budget.webp)

## Testing & CI/CD

This was my first time writing automated tests and a deployment pipeline.

- Vitest unit tests cover the pure logic: titles and slugs, prices and dates, form rules and dashboard figures.
- Playwright browser tests cover what an admin does on every screen, in Chromium, Firefox and WebKit, against a local Supabase. No test calls a real external API: the requests are faked. Failures are forced at the exact request to test every error and retry path. The test admin signs in with a magic link from the local admin client, so the app has no login backdoor.
- pgTAP tests check RLS, grants and database functions: who can read, write or call what.
- GitHub Actions runs the whole suite before every production deploy. A first job runs lint, unit and database tests and builds once. Then three jobs run in parallel, one per browser, each on its own machine with its own local database, and reuse the first job's build. Production deploys only if everything passes. Third-party actions are pinned to their commit SHA instead of a version tag, so a change in their repository can't alter what the pipeline runs.
- GitHub Actions deploys with a token from the Vercel account that owns the project, scoped to that project and with an expiry date. That way deploys don't fail when the commit author isn't a member of the Vercel team: write access to the GitHub repository decides who can deploy.
- Each phase that touched authentication, the database or server actions went through a security review before I approved it.

![GitHub Actions run of the production deploy: lint, unit and database tests, then the browser tests in three engines in parallel, then the deploy](/projects/laura-monge-platform-rebuild/github-actions-pipeline.webp)

## Results

There are no business metrics yet, since the new version was being prepared for launch. The engineering numbers:

- **22** tables, 9 views, 34 functions and 61 RLS policies
- **440+** automated tests: 225 unit, 135 browser tests run in 3 engines, 85 database checks
- **3** daily jobs for the exchange rate, website traffic and AI alt texts
- **~30%** lower AI cost per photo after comparing image resolutions
- **ES / EN** in every content field, with one-click translation

## What I learned

Designing the database for two applications at once taught me to think about the whole product: how the public site filters and ranks, and how the panel writes safely. Scheduled jobs that pull data from external APIs, and putting AI to work inside a real product, were the parts I enjoyed most after the database. Google Cloud showed me IAM, service accounts and budgets in practice, and writing tests and a pipeline for the first time changed how I think about "done".

Working with AI taught me that the quality of the result depends on the direction: clear context and specs, firm rules, small phases and careful review are what make AI-written code reliable. It also taught me not to accept a proposal just because it sounds right: questioning it when it doesn't convince me, I spot a possible gap or there's a better path led to several of the project's best decisions.

## Live demo

The [live site](https://lauramongerealestate.com) is the client-facing website. The admin panel is private, so the screenshots above were taken from a local copy with sample data.

## Team

Admin panel, database and cloud setup: Kevin Garita Monge. Public website: Cristopher Soto Calderón.
