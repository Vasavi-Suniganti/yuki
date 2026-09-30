# Feature Matrix

## Implemented in this repository
- Cinematic 3D polar landing hero using React Three Fiber.
- Responsive public navigation and polar-science design system.
- Unified explorer/search across demo expedition, dataset, publication and media records.
- Expedition list/detail pages, mission timeline and digital-twin-style playback preview.
- Polar map with station points and expedition routes.
- Dataset catalogue, metadata, time-series visualizer and provenance display.
- Polar Time Machine interaction using selectable demo series.
- Interactive knowledge graph.
- Publications, media gallery, newsroom and education hub.
- Virtual expedition experience shell.
- Polar AI UI with Node RAG endpoint, lexical evidence retrieval and optional OpenAI-compatible LLM synthesis.
- Hallucination guard / insufficient-evidence response pattern.
- Adaptive-explainer UX concept and AI service hooks.
- Research-to-media workflow UX and protected content-generation API endpoint.
- Role-aware authentication architecture and local demo role fallback.
- Researcher, scientific reviewer, media manager, platform admin and public dashboards.
- Scientific approval endpoint and role authorization middleware.
- Firestore collections architecture, indexes, security rules and Firebase Storage rules.
- Seed script and REST API foundation.
- Advanced-module lab covering offline field mode, sample QR workflow, instruments, data quality, metadata, workspaces, campaigns, notifications, multilingual/voice/API/live-expedition/provider integrations.
- Accessibility-oriented responsive UI structure and reduced-complexity mobile design.

## Provider-ready / requires real institutional services or source data
The following are architected for integration but cannot be truthfully completed with fabricated data or credentials:
- Real PDF ingestion with page-level citations and OCR.
- Production vector embeddings / vector database indexing.
- Real NetCDF, GeoTIFF and shapefile processing workers.
- Real satellite imagery and historical map layers for the Time Machine.
- Real 360-degree station assets / photogrammetry.
- Live ship/field telemetry and weather feeds.
- Social-network publishing APIs and production scheduling.
- Malware scanning pipeline for uploaded files.
- DOI/citation provider integrations.
- Translation/TTS providers beyond browser capabilities.
- Production analytics warehouse and institutional citation metrics.
- Real push notifications and FCM credentials.

These are intentionally exposed through service/provider boundaries so they can be connected without rewriting the application.
