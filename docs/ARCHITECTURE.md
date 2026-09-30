# POLARIS Architecture

## Layers
1. **Experience layer:** React/Vite, cinematic 3D/WebGL, maps, charts, dashboards.
2. **Identity/data layer:** Firebase Auth, Firestore, Storage, rules, indexes.
3. **API layer:** Node/Express, token verification, role authorization, validated REST endpoints.
4. **Intelligence layer:** retrieval → evidence ranking → optional OpenAI-compatible LLM → citations.
5. **Governance layer:** scientific review, outreach approval, provenance, versioning, audit-ready actions.

## Production upgrades
- Replace demo retrieval with a vector database or Firestore vector search.
- Add PDF ingestion/chunking workers and page-level citation metadata.
- Replace illustrative datasets with validated institutional datasets.
- Store role claims server-side and mirror approved roles to custom auth claims if required.
- Add malware scanning and signed-download policies for controlled datasets.
- Add queue workers for heavy NetCDF/GeoTIFF preprocessing and media jobs.
