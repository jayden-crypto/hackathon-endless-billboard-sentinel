
Demo & Judge script (quick)
---------------------------
1. Start backend:
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   ./run.sh
2. Seed registry:
   curl -X POST http://127.0.0.1:8000/api/registry/seed
3. Open dashboard:
   http://127.0.0.1:8000/static/dashboard/index.html
4. Use the provided Flutter app (or Postman) to POST a report to /api/reports.
   Example curl (replace image path):
   curl -F 'lat=30.354' -F 'lon=76.366' -F "detections_json=@detections.json;type=application/json" -F "image=@example.jpg" http://127.0.0.1:8000/api/reports
