
Contributing & finishing checklist:
- Replace detector stub with a real TFLite model (training & export steps included in /training)
- Download Haar cascades & place into /face_blur for selective redaction
- For scale, move to Postgres + PostGIS and update DATABASE_URL in .env
- Add authentication for officials in the Dashboard
- Add CI (GitHub Actions) for linting & tests
