---
title: "Climate Data Platform"
description: "A climate data platform that collects, processes and exposes climate data through a decoupled multi-backend architecture, using multiprocessing to handle large volumes in parallel."
startDate: 2026-01-08
# endDate: required by the current schema — this project is still in progress.
skills: ["Python", "Flask", "Node.js", "NestJS", "PostgreSQL"]
---

## The problem

Climate data comes from many sources — external APIs and weather stations — and in large volumes. It has to be collected, processed and exposed quickly enough for frontend applications and third parties to consume it, in an environment that behaves like a scalable production system.

## The solution

A decoupled platform with two independent backend services, each with a clear responsibility.

- Collection from multiple sources, including external APIs and weather stations.
- Parallel processing of large data volumes with multiprocessing to optimize response times.
- Storage in PostgreSQL and an API layer that exposes the data to frontends or third parties.
- Backend 1 in Python and Flask; backend 2 in Node.js and NestJS. The frontend is not defined yet.

## Results

In progress — results will be added once the platform is running.
