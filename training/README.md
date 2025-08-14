
Training & Export (local instructions)
------------------------------------
1. Prepare your dataset in YOLOv8 format:
   - images/train, images/val
   - labels/train, labels/val  (each txt: class x_center y_center width height normalized)
2. Create a data YAML (example below).
3. Train using Ultralytics (yolov8) on your machine (GPU recommended):

    pip install ultralytics
    yolo detect train model=yolov8n.pt data=data.yaml epochs=100 imgsz=640 project=runs/exp

4. Export to TFLite (Ultralytics supports export):

    yolo export model=runs/exp/weights/best.pt format=tflite

5. Copy the produced `*.tflite` to `mobile_flutter/assets/models/yolov8n-billboard.tflite`
