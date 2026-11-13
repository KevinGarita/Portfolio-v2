import { type CollectionEntry, getCollection } from "astro:content";

type Dated = { data: { startDate: Date } };

const byStartDesc = (a: Dated, b: Dated) =>
	b.data.startDate.getTime() - a.data.startDate.getTime();

export async function getEducation() {
	return (await getCollection("education")).sort(byStartDesc);
}

export async function getWork() {
	return (await getCollection("work")).sort(byStartDesc);
}

/**
 * Projects in landing-page order: the featured project first (the one flagged
 * `featured`, or the most recent), then the rest by start date.
 */
export async function getProjects(): Promise<CollectionEntry<"projects">[]> {
	const sorted = (await getCollection("projects")).sort(byStartDesc);
	const featured = sorted.find((p) => p.data.featured) ?? sorted[0];
	if (!featured) return [];
	return [featured, ...sorted.filter((p) => p !== featured)];
}

const year = (d: Date) => d.getUTCFullYear();

/** "2014 — 2018", or "2021" when both dates fall in the same year. */
export function yearRange(start: Date, end?: Date) {
	if (!end) return `${year(start)} — Present`;
	return year(start) === year(end)
		? `${year(start)}`
		: `${year(start)} — ${year(end)}`;
}

const monthYear = (d: Date) =>
	d.toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});

/** "Jan 2024 — Jun 2024" */
export function monthRange(start: Date, end: Date) {
	return `${monthYear(start)} — ${monthYear(end)}`;
}

/**
 * Elapsed time between two exact dates, rounded to the nearest month, as
 * "6 months" / "1 year 2 months" (e.g. Aug 8 → Nov 8 is 3 months).
 */
export function duration(start: Date, end: Date) {
	const months = Math.max(
		1,
		Math.round(
			(year(end) - year(start)) * 12 +
				(end.getUTCMonth() - start.getUTCMonth()) +
				(end.getUTCDate() - start.getUTCDate()) / 30,
		),
	);
	const y = Math.floor(months / 12);
	const m = months % 12;
	const plural = (n: number, unit: string) =>
		`${n} ${unit}${n === 1 ? "" : "s"}`;
	return [y && plural(y, "year"), m && plural(m, "month")]
		.filter(Boolean)
		.join(" ");
}
