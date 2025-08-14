
import os, json, math
from PIL import Image, ImageFilter
CITY_MAX_W = float(os.getenv("CITY_MAX_W", "12.0"))
CITY_MAX_H = float(os.getenv("CITY_MAX_H", "4.0"))
CITY_MIN_DIST = float(os.getenv("CITY_MIN_DIST", "50.0"))
def distance_m(lat1, lon1, lat2, lon2):
    R = 6371000
    p1 = math.radians(lat1); p2 = math.radians(lat2)
    dp = math.radians(lat2-lat1); dl = math.radians(lon2-lon1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(a))
def nearest_junction(lat, lon, junctions_geojson):
    best = None; bd = 1e12
    for f in junctions_geojson.get("features", []):
        jlon, jlat = f["geometry"]["coordinates"]
        d = distance_m(lat, lon, jlat, jlon)
        if d < bd:
            bd = d; best = f
    return best, bd
def redact_image(path, out_path, mode="mosaic"):
    img = Image.open(path).convert("RGB")
    if mode == "mosaic":
        small = img.resize((max(1,img.width//20), max(1,img.height//20)), resample=Image.BILINEAR)
        big = small.resize((img.width, img.height), Image.NEAREST)
        big.save(out_path)
    else:
        img.filter(ImageFilter.GaussianBlur(8)).save(out_path)
