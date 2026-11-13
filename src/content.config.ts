import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const education = defineCollection({
	loader: glob({ base: "./src/content/education", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string(), // institution or platform
		subtitle: z.string(), // degree or course
		logo: z.string().optional(), // falls back to the decorative pattern
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
	}),
});

const work = defineCollection({
	loader: glob({ base: "./src/content/work", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string(), // company
		subtitle: z.string(), // role
		logo: z.string().optional(), // falls back to the decorative pattern
		startDate: z.coerce.date(),
		endDate: z.coerce.date().optional(), // omitted = current job ("Present")
		location: z.string().optional(), // e.g. "Remote", "Hybrid"
	}),
});

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.string().optional(), // falls back to the decorative pattern
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
		skills: z.array(z.string()),
		demoLink: z.url().optional(),
		sourceLink: z.url().optional(),
		featured: z.boolean().optional(), // shown as the large card; else the most recent
	}),
});

export const collections = { education, work, projects };
