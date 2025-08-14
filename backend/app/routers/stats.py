
from fastapi import APIRouter
from ..db import SessionLocal
from .. import models
router = APIRouter(tags=['stats'])
@router.get("/stats/summary")
def summary():
    db = SessionLocal()
    total_reports = db.query(models.Report).count()
    total_detections = db.query(models.Detection).count()
    total_violations = db.query(models.Violation).count()
    by_type = {}
    for v in db.query(models.Violation).all():
        by_type[v.type] = by_type.get(v.type, 0) + 1
    return {"reports": total_reports, "detections": total_detections, "violations": total_violations, "violations_by_type": by_type}
