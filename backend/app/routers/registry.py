
import csv, uuid, os
from datetime import datetime
from fastapi import APIRouter
from ..db import SessionLocal
from .. import models
router = APIRouter(tags=["registry"])
@router.post("/registry/seed")
def seed_registry():
    path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "registry.csv")
    db = SessionLocal()
    n = 0
    import csv
    with open(path, newline='') as f:
        for row in csv.DictReader(f):
            if db.query(models.RegistryBillboard).filter(models.RegistryBillboard.license_id == row['license_id']).first():
                continue
            item = models.RegistryBillboard(id=str(uuid.uuid4()), license_id=row['license_id'],
                owner=row['owner'], lat=float(row['lat']), lon=float(row['lon']),
                width_m=float(row['width_m']), height_m=float(row['height_m']),
                valid_from=datetime.fromisoformat(row['valid_from']), valid_to=datetime.fromisoformat(row['valid_to']))
            db.add(item)
            n += 1
    db.commit()
    return {'seeded': n}
@router.get("/registry/{license_id}")
def check(license_id: str):
    db = SessionLocal()
    r = db.query(models.RegistryBillboard).filter(models.RegistryBillboard.license_id == license_id).first()
    if not r:
        return {'exists': False}
    return {'exists': True, 'owner': r.owner, 'valid_to': r.valid_to.isoformat()}
