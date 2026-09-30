# Polaris Master Build Prompt

You are extending POLARIS, an immersive AI-powered Polar Science Knowledge Intelligence Platform for Antarctica, the Arctic, and the Southern Ocean.

## Product direction

Build a credible institutional science platform with a cinematic public experience and fast operational workspaces. Use the existing React, Vite, TypeScript, Tailwind, React Router, Three.js/R3F, Firebase, Express, Recharts, Leaflet, and Zustand stack already present in this repository.

The visual language is original: deep polar blue, ice white, glacier cyan, restrained glass surfaces, scientific data overlays, strong editorial typography, subtle atmospheric motion, and responsive fallback modes. Take only high-level inspiration from premium immersive websites. Do not copy Montfort branding, assets, typography, layout, source code, or distinctive compositions.

## Non-negotiable behavior

- Every visible button and link must perform a real action or navigate to a real route.
- Never invent a scientific citation, statistic, dataset, expedition, or source.
- Clearly label demo or mocked scientific values.
- AI scientific claims must be grounded in approved repository content and expose citations or an insufficient-evidence response.
- Roles are PUBLIC_USER, RESEARCHER, SCIENTIFIC_REVIEWER, MEDIA_MANAGER, and PLATFORM_ADMIN.
- Roles, approval states, audit logs, API keys, and private workspaces are server-authorized; never trust frontend role state.
- Protect Firebase and API secrets with environment variables.
- Preserve keyboard access, visible focus, alt text, captions/transcripts, reduced-motion behavior, and mobile usability.
- When WebGL is unavailable or the device is low power, preserve the content and CTA with a cinematic image or CSS fallback.

## Feature contract

Maintain and complete these product surfaces: cinematic home storytelling, polar map and layers, time machine, knowledge graph, expedition explorer and digital twin, dataset library and visualizer, publications and ask-the-paper tools, evidence-backed Polar AI, research-to-media approval flow, education and virtual expedition, media gallery, researcher/reviewer/media/admin dashboards, authentication, Firestore/Storage workflows, search, collections, workspaces, notifications, analytics, provenance, versioning, data quality labels, API access, offline field capture, and accessibility/PWA support.

## Delivery rules

Work in vertical slices. For each slice:

1. Start from the owning route, component, service, or data model.
2. Implement the smallest complete behavior, including loading, empty, error, and permission states.
3. Wire every CTA to a real route or tested event.
4. Add or update focused tests where the repository has a test harness.
5. Run the narrowest relevant validation, then the client/server build.
6. Keep 3D focused on places where it improves understanding: home, globe, expedition playback, graph, virtual expedition, and time comparison.
7. Prefer route-level lazy loading and paginated Firestore/API reads before adding visual polish.

## Acceptance check

Before calling a slice complete, verify that its routes render, its buttons work, its role boundaries hold, its demo data is labeled, its responsive layout does not overlap, its no-WebGL/reduced-motion path works, and its build/typecheck passes. Report any unavailable production dependency or credential instead of masking it with fake success.
