
# Architecture (Mermaid)
```mermaid
flowchart LR
  Mobile[Mobile App\n(Camera + On-device AI)]
  Mobile -->|Report| Backend(API)
  Backend --> DB[Postgres/PostGIS]
  Backend --> Registry[License Registry CSV/DB]
  Backend --> Dashboard[React/Map]
  Admin[Municipal Official] --> Dashboard
```
