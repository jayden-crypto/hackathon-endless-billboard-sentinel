
Face & Plate Redaction
----------------------
This folder contains helper scripts to anonymize faces and license plates using OpenCV Haar cascades.
You must download the cascade XMLs from OpenCV (or use your preferred models) and place them as:

- face cascade: face_cascade.xml (e.g. haarcascade_frontalface_default.xml)
- plate cascade: plate_cascade.xml (e.g. haarcascade_russian_plate_number.xml)

Usage:
    python blur_faces.py input.jpg output.jpg --face face_cascade.xml --plate plate_cascade.xml
