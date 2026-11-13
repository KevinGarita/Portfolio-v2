---
title: "Websites Classifier by Naive Bayes"
description: "A Bayesian classifier that combines web scraping and multithreading to sort a list of web page links into three categories, with the results shown in charts and tables."
image: "/projects/websites-classifier-by-naive-bayes/cover.png"
startDate: 2022-08-08
endDate: 2022-11-08
skills: ["Python", "Flask", "React", "JavaScript", "BeautifulSoup"]
sourceLink: "https://github.com/KevinGarita/Websites-classifier-by-Naive-Bayes"
---

## The problem

Classify a list of more than 7,000 web page links into three different categories automatically, based on the text each page contains — and present the results in a way that is easy to read.

## The solution

A Bayesian classifier that uses Bayesian methods, web scraping and multithreading. Data processing, scraping and multithreading are implemented in Python with a Flask backend, and the results are presented with charts and tables built in React.

## Frontend

The React app has two pages: one that shows the results of classifying an array of links, and one that classifies a single link.

They are built from reusable components — column and pie chart templates for the results, a form to enter a link, and a paginated table for the data — with app navigation handled by a router.

![Classifier results with charts and tables](https://user-images.githubusercontent.com/61397177/199617663-6dbb2f5e-558c-47f7-b6c7-7caa7f83337e.png)
![Single link classification](https://user-images.githubusercontent.com/61397177/199617882-9c485564-636d-47a9-b5ab-b364e8773f61.png)

## Web scraping

The `requests` library fetches the source code of each page, and BeautifulSoup turns it into a soup object to work with its elements.

From there, all the text on the page is extracted from this list of tags: `h1`–`h6`, `p`, `pre`, `span`, `title`, `b`, `i`, `strong`, `em` and `cite`.

## Multithreading

Parallelism is implemented at two levels using multithreading:

1. The list of more than 7,000 links is split into 4 parts, each assigned to its own thread.
2. Inside the scraping step, 2 threads extract all the text from the page with BeautifulSoup and 4 threads count the words found.

Threads are created and managed with Python's `threading` library. Since functions run in a thread can't return data directly, each thread receives a `queue` instance and inserts its results there — the safest way to share data between multiple threads — so they can be read back whenever they're needed.

## Results

- **7,000+** links from the built-in dataset scraped and classified end-to-end in a single run
- **3** categories, with low-confidence pages left unrated instead of forced into the wrong one
- **4** threads scraping the link list in parallel, noticeably cutting the time to analyze it

## Team

Kevin Garita Monge & Cristopher Soto Calderón.
