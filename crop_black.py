from PIL import Image, ImageChops
import sys

def crop_and_save(input_path, output_path):
    # Open the image preserving RGB
    img = Image.open(input_path).convert("RGB")
    
    # Create black background identical to the image size
    bg = Image.new(img.mode, img.size, (0, 0, 0))
    # Get the difference
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    # Get bounding box of the non-black content
    bbox = diff.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print("Cropped black background successfully")

if __name__ == "__main__":
    crop_and_save(sys.argv[1], sys.argv[2])
