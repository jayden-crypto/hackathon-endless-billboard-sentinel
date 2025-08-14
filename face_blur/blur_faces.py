
import cv2, sys, argparse
def mosaic_region(img, x,y,w,h, scale=0.05):
    roi = img[y:y+h, x:x+w]
    small = cv2.resize(roi, (max(1,int(w*scale)), max(1,int(h*scale))), interpolation=cv2.INTER_LINEAR)
    big = cv2.resize(small, (w,h), interpolation=cv2.INTER_NEAREST)
    img[y:y+h, x:x+w] = big
def blur_file(infile, outfile, face_xml=None, plate_xml=None):
    img = cv2.imread(infile)
    if img is None: raise SystemExit("failed to open image")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if face_xml:
        face_cascade = cv2.CascadeClassifier(face_xml)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        for (x,y,w,h) in faces: mosaic_region(img,x,y,w,h)
    if plate_xml:
        plate_cascade = cv2.CascadeClassifier(plate_xml)
        plates = plate_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)
        for (x,y,w,h) in plates: mosaic_region(img,x,y,w,h)
    cv2.imwrite(outfile, img)
if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('infile'); p.add_argument('outfile')
    p.add_argument('--face', default=None); p.add_argument('--plate', default=None)
    args = p.parse_args()
    blur_file(args.infile, args.outfile, args.face, args.plate)
