---
title: "Laura Monge Real Estate"
description: "A real estate platform made of two separate applications: a public website where clients browse and review properties, and a private admin panel to manage the whole catalog."
image: "/projects/laura-monge-real-estate/login.png"
startDate: 2025-05-08
endDate: 2025-09-08
skills: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "shadcn/ui"]
demoLink: "https://lauramongerealestate.com"
---

## The problem

Laura Monge Real Estate needed a website where clients could browse property listings, see the details of each one, interact with them and leave reviews — with a clean, intuitive and responsive experience.

Behind it, the team needed a private place to manage properties, moderate reviews, publish news, configure search filters and understand which listings were getting attention, restricted to authorized users only.

## The solution

A platform made of two separate applications: a public website for clients and a private administrative panel for internal management. This clear separation between the public and administrative systems improves security, scalability and maintainability.

Both are built with Next.js and TypeScript, styled with Tailwind CSS and [shadcn/ui](https://ui.shadcn.com) components, with Firebase as the backend. The sections below walk through some of the modules of the administrative application.

## Login

The login screen supports email and password authentication as well as Google sign-in.

The design is clean and minimal, focused on usability and security, and restricts access to the administrative panel to authorized users only.

![Admin panel login screen](/projects/laura-monge-real-estate/login.png)

## Statistics

The statistics module shows key metrics such as the most and least visited properties and the most and least liked ones.

The information is presented through dynamic charts and lists, so the administrator can identify trends, spot the properties with the most interest and find opportunities to improve the publishing strategy.

![Statistics module with visit and like charts](/projects/laura-monge-real-estate/statistics.png)

## Reviews

This section manages the reviews left by users. The table shows the client's name, email, date, rating and status of each review.

Administrators can highlight featured reviews, control their visibility on the public site, and review or delete them — giving full control over the site's reputation and feedback.

![Reviews moderation table](/projects/laura-monge-real-estate/reviews.png)

## Properties

The properties module lists every registered property with its title, type, price, number of likes, views and visibility status. From here, administrators can mark properties as featured, control their visibility on the public website, and view, edit or delete records.

![Properties management table](/projects/laura-monge-real-estate/properties.png)

Properties are created and edited through a form organized into sections: general information, descriptions in both Spanish and English, location data, multimedia content and additional features. This modular design simplifies building well-structured, multilingual listings and improves the quality of the information clients see.

![Add or edit property form](/projects/laura-monge-real-estate/add-properties.png)

## Filters

The filters section is divided into subsections, one per filter type: locations, amenities, areas, price ranges, property statuses, property types and features. Administrators configure them, and the public website uses them to make property search faster and more accurate.

![Location filter management](/projects/laura-monge-real-estate/ubication-filter.png)

The location filter manages countries, states or provinces, regions and cities in a hierarchical structure, which is later used in the public property search. Each level can be shown or hidden while keeping a consistent geographic hierarchy across all filters.

## Roles & permissions

The database defines two main user roles: admin and user.

Firebase security rules restrict access to and changes in the data, so only administrators can create, edit or delete sensitive content such as properties, filters and news. The same rules restrict access to the administrative panel itself, reinforcing data security and the integrity of the whole system.

## Results

- **100%** of the catalog (properties, reviews, news and search filters) managed from the admin panel, with no code changes
- **ES / EN** listings published in Spanish and English from a single form, reaching both local and international buyers
- **Per listing** visit and like tracking, so the team can see which properties draw interest and adjust what they publish

## Live demo

The [live demo](https://lauramongerealestate.com) is the client-facing website. The administrative panel is restricted to authorized users and can't be exposed publicly, but the public site gives an indirect view of much of the functionality and logic implemented behind it.

## Team

Kevin Garita Monge & Cristopher Soto Calderón.

## What came next

This platform was later rebuilt on PostgreSQL — see [Laura Monge Real Estate — Platform Rebuild](/projects/laura-monge-platform-rebuild/).
