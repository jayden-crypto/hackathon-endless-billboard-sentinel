
from sqlalchemy import Column, String, Integer, DateTime, Text, Float, ForeignKey
from datetime import datetime
from .db import Base
class User(Base):
    __tablename__ = "app_user"
    id = Column(String, primary_key=True)
    phone_hash = Column(String, nullable=True)
    role = Column(String, default="citizen")
    trust_score = Column(Integer, default=0)
class RegistryBillboard(Base):
    __tablename__ = "registry_billboard"
    id = Column(String, primary_key=True)
    license_id = Column(String, unique=True, index=True)
    owner = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    width_m = Column(Float)
    height_m = Column(Float)
    valid_from = Column(DateTime)
    valid_to = Column(DateTime)
class Report(Base):
    __tablename__ = "report"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("app_user.id"), nullable=True)
    captured_at = Column(DateTime, default=datetime.utcnow)
    lat = Column(Float); lon = Column(Float)
    img_uri = Column(Text); img_uri_redacted = Column(Text, nullable=True)
    device_heading = Column(Float, nullable=True)
    model_version = Column(String, default="ondevice-0.1")
    status = Column(String, default="pending")
class Detection(Base):
    __tablename__ = "detection"
    id = Column(String, primary_key=True)
    report_id = Column(String, ForeignKey("report.id"))
    bbox = Column(Text)
    corners = Column(Text)
    est_width_m = Column(Float)
    est_height_m = Column(Float)
    qr_text = Column(Text, nullable=True)
    ocr_text = Column(Text, nullable=True)
    license_id = Column(Text, nullable=True)
    confidence = Column(Float)
class Violation(Base):
    __tablename__ = "violation"
    id = Column(String, primary_key=True)
    detection_id = Column(String, ForeignKey("detection.id"))
    type = Column(String)
    reason = Column(Text)
    severity = Column(Integer, default=3)
