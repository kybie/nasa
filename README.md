# NASA Space Explorer

> Fetch, display, and explore NASA's Astronomy Picture of the Day (APOD) gallery.

## Overview

This app uses NASA's APOD API to pull real space imagery and display it in a dynamic gallery. You'll learn how to work with APIs, handle authentication, debug fetch failures, and build interactive UI components like modals.

## What You'll Build

- A **9-day APOD gallery** with real NASA imagery
- A **modal window** that shows the full image, title, date, and explanation on click
- A **loading state** while data fetches
- **NASA-branded styling** (colors, fonts, and visual identity)
- Optional LevelUp features: video handling, hover zoom, and a random space fact

## Key Concepts

- **APIs** — Application Programming Interfaces let you fetch live data without building everything from scratch
- **API Keys** — Many APIs require authentication; you'll learn how to read documentation and handle your key securely
- **Fetch & Async** — Making HTTP requests to get data from an external source
- **Error Handling** — Debugging failed API calls and catching errors gracefully
- **DOM Manipulation** — Dynamically creating and updating page elements from API data
- **Modals** — Overlay windows for displaying detailed content without leaving the page

## API Setup

You'll need a **NASA API key** to fetch APOD data.

1. Get your free key at: https://api.nasa.gov/
2. Open `config.js` (or `.env`) and add your key:

```js
const NASA_API_KEY = 'YOUR_KEY_HERE';
```

For this project, the API base URL is:

```
https://api.nasa.gov/planetary/apod
```

## Features

### Required
- [x] Fetch APOD data for 9 consecutive days
- [x] Display gallery with image, title, and date
- [x] Modal view on click (full image, title, date, explanation)
- [x] NASA-branded styling
- [x] Loading message during fetch

### LevelUp (Optional)
- [ ] Handle video APOD entries (embed or link)
- [ ] Random "Did You Know?" space fact on load
- [x] Hover zoom effect on gallery images

### Reflections
- [ ] Reflection: Working with APIs
- [ ] Reflection: Debugging
- [ ] Reflection: LinkedIn Post

## Grading Rubric

| Criteria | Points |
|---|---|
| Fetches Correct Data (9 APOD images) | 15 |
| Displays the Gallery | 15 |
| Modal View | 10 |
| NASA-Branded Styling | 5 |
| Loading Message | 5 |
| LevelUp: Video Handling | 10 |
| LevelUp: Random Space Fact | 10 |
| LevelUp: Hover Zoom Effect | 5 |
| Reflection: Working with APIs | 10 |
| Reflection: Debugging | 10 |
| Reflection: LinkedIn Post | 10 |
| **Total** | **105** |

## Resources

- NASA APOD API: https://api.nasa.gov/
- OMDb API (movie search demo): https://www.omdbapi.com/
- Dr. Nika's API explanation — _referenced in course content_
- Guil's movie search & watchlist walkthrough — _referenced in course content_
- Modal implementation guide — _referenced in course content_
