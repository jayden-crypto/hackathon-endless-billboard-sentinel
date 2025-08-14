
from pydantic import BaseModel
from typing import Any, Optional, List
class DetectionIn(BaseModel):
    bbox: Any; corners: Any; est_width_m: float; est_height_m: float
    qr_text: Optional[str] = None; ocr_text: Optional[str] = None; license_id: Optional[str] = None; confidence: float
class ReportIn(BaseModel):
    lat: float; lon: float; device_heading: float | None = None; detections: List[DetectionIn]
class ViolationOut(BaseModel):
    type: str; reason: str; severity: int
class DetectionOut(BaseModel):
    id: str; violations: List[ViolationOut]; confidence: float
class ReportOut(BaseModel):
    id: str; detections: List[DetectionOut]
