
Mobile (Flutter) instructions
----------------------------
- Replace your Flutter project's lib/main.dart with the included `lib/main.dart` and add `lib/tflite_helper.dart`.
- Put quantized TFLite model at assets/models/yolov8n-billboard.tflite
- Update pubspec.yaml with tflite_flutter dependency and assets path.

The included helper implements image preprocessing and a YOLO-ish postprocessing (NMS). Model output layout may vary by export — adjust the helper constants accordingly.
