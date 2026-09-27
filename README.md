# Bhanu Vamshi — The Other Side of Me

A responsive portfolio recreated with Vite and React. It includes seven navigable chapters, interactive career and skill sections, a cinematic trailer, and a searchable Field Notes archive of ServiceNow Community posts.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The article archive is available at `/articles`.

## Build

```sh
npm run lint
npm run build
npm run preview
```

## Content and assets

Update profile, professional history, interests, and article metadata in `src/content.json`. Article links open their full posts on ServiceNow Community. Site images and the `favicon.png` source are in `public/asset/`; Vite copies them into `dist/asset/` during production builds.
