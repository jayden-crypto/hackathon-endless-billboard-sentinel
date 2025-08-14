
from fastapi import APIRouter
from ..db import SessionLocal
from .. import models
router = APIRouter(tags=['review'])
@router.post("/review/{detection_id}")
def review_detection(detection_id: str, status: str, notes: str = ""):
    db = SessionLocal()
    det = db.query(models.Detection).filter(models.Detection.id==detection_id).first()
    if not det: return {"error":"not found"}
    vio = models.Violation(id=str(__import__('uuid').uuid4()), detection_id=detection_id, type=f"review:{status}", reason=notes, severity=0)
    db.add(vio); db.commit()
    return {"ok": True}
