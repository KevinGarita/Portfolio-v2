import portrait from "../assets/portrait.jpg";

/**
 * Site-wide profile data. Everything that isn't a content collection entry
 * (education, work, projects) is configured here, in one place.
 */

const email = "k.garita2001@proton.me";
const linkedin = "https://www.linkedin.com/in/kevingaritamonge";
const github = "https://github.com/KevinGarita";
const cv =
	"https://drive.google.com/file/d/1yLFHqZ_vCrbsidPfKacE8IvmzcNorjhV/view?usp=sharing";

export const site = {
	name: "Kevin Garita",
	shortName: "K. Garita",
	initials: "kg",
	title: "Kevin Garita — Software Engineer",
	description:
		"Kevin Garita is a Software Engineer from Costa Rica building full-stack web applications with Angular, Next.js, .NET and PostgreSQL. Open to full-time roles and freelance projects.",
	email,
	mailto: `mailto:${email}?subject=${encodeURIComponent("Hey Kevin!")}`,
	cv,
	repositories: `${github}?tab=repositories`,
	socials: [
		{ label: "LinkedIn", short: "in", href: linkedin },
		{ label: "GitHub", short: "gh", href: github },
	],
};

export const hero = {
	available: true,
	availability: "Open to new opportunities",
	roles: [
		{ label: "Software Engineer" },
		{ label: "SEO & Web Performance" },
		{ label: "Cloud Engineering", note: "— in progress" },
	],
	tagline:
		"I build full-stack web applications with Next.js, Angular, .NET and PostgreSQL — from database design with SEO built in to the interface, tested and shipped through CI/CD — and I'm now expanding into cloud architecture.",
	// Technologies scrolling in the Hero marquee.
	tech: [
		"Astro",
		"Angular",
		"React",
		"TypeScript",
		"Tailwind CSS",
		"Next.js",
		"Git",
		"Node.js",
		".NET",
		"PostgreSQL",
		"Python",
		"Supabase",
		"Gemini",
		"Google Cloud",
		"Docker",
		"Vercel",
		"GitHub Actions",
		"Playwright",
		"Google Search Console",
		"Google Analytics",
		"Google Tag Manager",
	],
};

export const about = {
	// Swap `src/assets/portrait.jpg` (or this import) to change the portrait.
	portrait,
	portraitAlt: "Portrait of Kevin Garita",
	location: "Costa Rica",
	role: "Software Engineer",
	headline:
		"I build web software that is simple on the outside and rigorous on the inside.",
	paragraphs: [
		"I'm a Software Engineer with a degree in Computer Engineering from the Tecnológico de Costa Rica. I build web applications end to end: Angular and Next.js on the frontend, .NET, Node.js and Python services on the backend, PostgreSQL (Supabase) underneath, and external services such as Google Cloud APIs, Gemini or Google Maps wired in where they're needed. I also care about how they're found: technical SEO, analytics and tracking with Search Console, GA4 and GTM.",
		"I've shipped features inside a Scrum product team, volunteered on a climate-action platform for farmers across Latin America, and delivered freelance projects directly for clients — most recently rebuilding a real estate platform end to end, from the database to tests and CI/CD, while directing AI-assisted development. I was also a regional finalist for Latin America in Call for Code 2021. Today I'm growing toward cloud engineering, with a focus on cloud architecture and security.",
	],
	focus: [
		{
			title: "Full-stack development",
			text: "From database design and access rules to the interface, backed by automated tests and CI/CD.",
		},
		{
			title: "SEO & web performance",
			text: "Technical and on-page SEO, keyword research and search intent, plus analytics and tracking with GSC, GA4 and GTM.",
		},
		{
			title: "Cloud engineering",
			text: "Hands-on with Google Cloud — IAM, service accounts and budgets — while studying cloud architecture and cloud security.",
		},
	],
};

export const contact = {
	// Heading reads: "<before> <em>accent</em>".
	heading: { before: "Let’s build something", accent: "together" },
	lead: "Whether you're hiring for your team or need someone to build your next product, I'd be glad to hear from you. I usually reply within a couple of days.",
};
