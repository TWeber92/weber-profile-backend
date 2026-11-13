# weber-profile-backend

The backend service for [portfolio-v2](https://tweber92.github.io/). A Cloudflare Worker that manages database provisioning, schema synchronization, and rate limiting for the frontend carousel.

---

## What this is

The frontend portfolio treats the DOM as a database and orchestrates multiple live backends. For that runtime to work, it needs a fast, reliable way to bootstrap the schema for each project without waiting for cold starts on Render.

This Worker serves two roles:
1. **Schema Delivery:** Reads the current state of the live Postgres databases and caches the table schemas as JSON files in OORT (IPFS).
2. **Database Management:** Executes SQL scripts to seed or reset the databases when needed.

Because Cloudflare Workers have zero cold-start, the frontend gets instant schema definitions even when the underlying Render applications are asleep.

---

## Architecture at a glance

The backend follows the same layered architecture as the frontend:

```text
Worker (index.js)
 └── Proxy (functions/)
      ├── getProject   → ProjectController
      ├── postProject  → ProjectController
      ├── putProject   → ProjectController
      └── reset        → Resets DBs
           ↓
      ProjectService (Business Logic)
           ↓
      ProjectRepository (Reads DB, Writes OORT)
           ↓
      OORTStorageClient (S3-Compatible API)
```

---

## Key Components

### `src/weber-profile-service`
The service layer coordinates the flow:
1. Looks up the table config for a given project name.
2. Connects to the Hyperdrive-backed Postgres instance.
3. Runs `SELECT` queries to get the live data.
4. Wraps the data into schema objects (matching the frontend DTO shapes).
5. Pushes the schema to OORT for the frontend to consume.

### `src/resources/schemas`
Contains the raw SQL scripts used to initialize and seed the databases. These run via the `reset.js` proxy function and set up the `author_novel`, `cab_booking`, `maven_library`, and `spring_security` schemas.

### `src/weber-profile-client/OORTStorageClient.js`
An S3-compatible client wrapper for OORT storage. It handles `PutObject` and `GetObject` commands, ensuring schemas are stored with `ContentType: "application/json"` so the frontend can parse them directly.

### Rate Limiting
The Worker includes a `RateLimitController` and `RateLimitRepository` to prevent abuse of the database provisioning endpoints, ensuring the backend doesn't inadvertently hammer the Render databases during heavy traffic.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/project?projectName=<name>` | Fetch the current schema JSON for a project from OORT. |
| `PUT` | `/api/v1/project` | Reads live data from Postgres, writes the updated schema to OORT. (Idempotent) |
| `POST` | `/api/v1/project` | Accepts a schema payload, writes it directly to OORT. |
| `PUT` | `/api/v1/reset` | Drops and recreates the database tables, then re-syncs the OORT schemas. |

*(Note: The PUT `/api/v1/project` endpoint is intentionally unauthenticated because it is idempotent — calling it repeatedly will never change the state, it only syncs the cache).*

---

## Why it's built this way

> **Warm cache for cold starts.**
> Render applications sleep. Cloudflare Workers don't. By storing the schema shapes in OORT via a Worker, the frontend can build the UI frame instantly while waiting for the Render API to wake up.

> **Hyperdrive for connection pooling.**
> The Worker uses Cloudflare Hyperdrive to connect to Postgres. This avoids exhausting database connections from edge isolates and keeps query latency low.

> **SQL as a first-class citizen.**
> The schema files (`authors-novels.sql`, etc.) live in the repo alongside the code. The reset flow is reproducible, and the schema is the single source of truth for both Postgres and the OORT cache.

---

## Run locally

```bash
# Install dependencies
npm install

# Start the local dev server
npx wrangler dev

# Deploy to Cloudflare
npx wrangler deploy
```

---

## Repository Layout

```text
weber-profile-backend/
├── src/
│   ├── resources/schemas/       # SQL seeding scripts
│   ├── weber-profile-client/    # OORT S3 client
│   ├── weber-profile-controller/# Request orchestrators
│   ├── weber-profile-entity/    # Data models
│   ├── weber-profile-enum/      # Project configs
│   ├── weber-profile-exception/ # Error handling
│   ├── weber-profile-repository/# DB reads, OORT writes
│   ├── weber-profile-service/   # Business logic
│   ├── weber-profile-utilities/ # Logger
│   └── Main.js                  # Dependency injection root
├── weber-profile-proxy/
│   └── functions/               # Route handlers (get, put, reset)
├── tests/
│   └── ProjectService.test.js
├── local-server.js              # Local proxy for dev
├── wrangler.toml                # Worker config
└── package.json
```

---

<p align="center"><em>Instant schema delivery, even when the backend is asleep.</em></p>