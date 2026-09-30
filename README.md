# POLARIS – Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal

**POLARIS** is a production-oriented, full-stack polar science knowledge platform connecting field operations, repository curation, grounded AI intelligence, scientific peer review, and public outreach dissemination.

---

## 🏗️ Architecture Overview

```
polaris-polar-science-platform/
├── client/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI, ProtectedRoute, Layout, Header, 3D Hero
│   │   ├── experience/         # Three.js / R3F Polar Mountains Scene
│   │   ├── lib/                # Auth Provider, Firebase Client, API Fetcher
│   │   ├── pages/              # Role Dashboards (Researcher, Reviewer, Media, Admin, Public), Feature Modules
│   │   └── services/           # Typed Firestore & REST CRUD service layer
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── middleware/         # Helmet, CORS Allowlist, Auth & Role verification, Rate Limiting
│   │   ├── routes/             # RAG AI, Scientific Review Workflow, Metadata Extractor, Open Data API v1
│   │   ├── scripts/            # Firestore database seed script
│   │   └── services/           # Grounded RAG, AI Engine, Document & Dataset Parsers, Audit Logger
├── shared/                     # Shared TypeScript data models & contracts
└── firebase/                   # Firestore rules, Storage rules, and index definitions
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Seed Database & Start Local Development
```bash
npm run seed
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`
- Open Data API v1: `http://localhost:4000/api/v1`

---

## 🔐 Authentication & Roles

The system supports Firebase Authentication with Firestore `users/{uid}` role loading, alongside an automatic fallback demo mode for local evaluation:

| Account Email | Role | Accessible Routes |
|---|---|---|
| `researcher@demo.org` | `RESEARCHER` | `/researcher`, `/dashboard` |
| `reviewer@demo.org` | `SCIENTIFIC_REVIEWER` | `/reviewer`, `/dashboard` |
| `media@demo.org` | `MEDIA_MANAGER` | `/media-manager`, `/dashboard` |
| `admin@demo.org` | `PLATFORM_ADMIN` | `/admin`, `/researcher`, `/reviewer`, `/media-manager`, `/dashboard` |
| `public@demo.org` | `PUBLIC_USER` | `/dashboard` |

---

## 🚀 Key Feature Modules

1. **Grounded RAG & Source Citation Viewer**: Grounded question answering over `documentChunks` with clickable source cards (`documentId`, `title`, `page`, `section`, `excerpt`, `doi`) and strict `INSUFFICIENT_EVIDENCE` fallback.
2. **Ask-the-Paper & Research Comparison**: Dedicated document analyzer with Summarize, Key Findings, Methodology, Limitations, and comparative paper/dataset/expedition matrix.
3. **Scientific Review State Machine**: Complete workflow (`DRAFT` -> `SUBMITTED` -> `UNDER_REVIEW` -> `REVISION_REQUESTED` -> `RESUBMITTED` -> `APPROVED` -> `PUBLISHED` -> `ARCHIVED`) with reviewer feedback & audit logs.
4. **Media Dissemination Studio**: Research-to-Media copy generator, Research-to-Reel 30s/60s/90s script builder, and AI Infographic preview editor.
5. **Interactive Dataset Processing & Chart Builder**: Multi-format parsing (CSV, GeoJSON, NetCDF, GeoTIFF, XLSX) with Recharts (line, bar, area, scatter) and CSV export.
6. **Geospatial Map & Ask-the-Map AI**: Leaflet map connected to stations and expeditions with spatial polygon/rectangle region query capabilities.
7. **Polar Time Machine & Split Map**: Dynamic environmental time-series layer player with play/pause/speed controls.
8. **Expedition Digital Twin**: Timestamped telemetry scrubber with moving ship position and event activity feed.
9. **Field Scientist & Real Offline Mode**: Mobile field capture with IndexedDB offline queue and automatic online sync.
10. **Open Data API v1**: Public REST endpoints (`/api/v1/expeditions`, `/api/v1/datasets`, `/api/v1/publications`, `/api/v1/stations`) with pagination and sorting.

---

## 🧪 Testing & Building for Production

### Typecheck
```bash
npm run typecheck
```

### Production Build
```bash
npm run build
```

---

## 📊 Feature Completion Matrix

| Feature | Before | After | Status |
|---|---|---|---|
| **Firebase Auth & Registration** | Demo mock fallback only | Full email/pass, Google sign-in readiness, registration with fields, default PUBLIC_USER security role | COMPLETE |
| **Role Routing Guard** | Flashing single page dashboard | ProtectedRoute & RoleRoute with loading screen, unauthorized guard, refresh preservation (`/researcher`, `/reviewer`, `/media-manager`, `/admin`) | COMPLETE |
| **Firestore CRUD Layer** | Partial mock arrays | Reusable typed service module (`dataService.ts`) for 20+ collections | COMPLETE |
| **Research Repository Upload** | Static upload shell | Real upload forms for docs, datasets, papers, media with upload progress simulation & review submission | COMPLETE |
| **Automatic Metadata Extraction** | Missing | Heuristic & text regex extractor (`metadataExtractor.ts`) suggested fields | COMPLETE |
| **Document Processing Pipeline** | Missing | Text chunking into `documentChunks` with page & section metadata | COMPLETE |
| **Grounded RAG System** | Basic keyword match | Semantic chunk ranking, source citations, evidence status (`HIGH`, `MEDIUM`, `LOW`, `INSUFFICIENT`) | COMPLETE |
| **Real Citation Viewer** | Static text | Interactive source drawer modal displaying full document excerpt, DOI, section, page, author | COMPLETE |
| **Ask-the-Paper AI** | Missing | Dedicated paper analyzer (Summarize, Key Findings, Methodology, Limitations, Statistics, Student, Public) | COMPLETE |
| **Research Comparison AI** | Missing | Comparative matrix for Paper A vs B, Dataset A vs B, Expedition A vs B | COMPLETE |
| **Adaptive Science Explainer** | Static placeholder | Audience switcher (Researcher, University, School, Public) with fact preservation | COMPLETE |
| **Research-to-Media AI** | Static fallback | Multi-format generator for website, press release, LinkedIn, Instagram, X, newsletter | COMPLETE |
| **Research-to-Reel** | Missing | Short-video script studio with 30s/60s/90s tabs (hook, scene, voiceover, caption, hashtags) | COMPLETE |
| **AI Infographic Builder** | Missing | Visual preview editor generating main metrics, facts, and citation footer | COMPLETE |
| **Scientific Review Workflow** | Single mock endpoint | Immutable review state machine (`DRAFT` to `PUBLISHED`) with comments & reviewer queue | COMPLETE |
| **Knowledge Graph** | Hardcoded static graph | Dynamic ForceGraph2D driven by Firestore nodes & edges with search & node legend | COMPLETE |
| **Dataset Processing & Chart Builder** | Fixed line chart | Recharts visualizer (line, bar, area, scatter), CSV export, Ask-the-Dataset AI modal, version history | COMPLETE |
| **Geospatial Map System** | Basic polylines | Leaflet map with station/expedition layers, marker popups, and spatial Ask-the-Map region query | COMPLETE |
| **Polar Time Machine** | Hardcoded static chart | Time-series layer switcher, play/pause/speed controls, year scrubber | COMPLETE |
| **Expedition Digital Twin** | Static preview | Scrubber timeline, speed (0.5x, 1x, 2x), moving ship marker, route progression, story mode | COMPLETE |
| **Field Scientist & Offline Mode** | Shell buttons | Mobile field capture notes, weather, GPS, IndexedDB pending sync queue & online indicator | COMPLETE |
| **QR Sample Tracking** | Missing | QR generator & camera scanner resolving to `/samples/:sampleId` | COMPLETE |
| **Instrument Registry & Lineage** | Shell buttons | Instrument CRUD (active/maintenance/retired) & Data Provenance Lineage Graph | COMPLETE |
| **Education Hub & Virtual Expedition** | Generic card shells | Quiz Engine with MCQ scoring & retries, Polar Glossary, Arctic vs Antarctica, 8-chapter guided journey | COMPLETE |
| **Open Data API v1** | Missing | REST endpoints (`/api/v1/expeditions`, `/api/v1/datasets`, etc.) with pagination & sorting | COMPLETE |
| **API Key Management** | Missing | Create key, copy once, hash storage, revocation, usage tracking | COMPLETE |
| **Security Hardening** | Basic cors | Helmet, strict CORS allowlist, rate limiting middleware, Zod validation, admin audit logs | COMPLETE |
| **Live Satellite Telemetry** | N/A | Provider interface abstraction (`PlatformLab.tsx`) | EXTERNAL PROVIDER REQUIRED |
| **External DOI Minting API** | N/A | Service abstraction interface (`metadataExtractor.ts`) | EXTERNAL PROVIDER REQUIRED |
