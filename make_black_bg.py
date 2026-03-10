from PIL import Image
import sys

def make_black_bg(input_path, output_path):
    # Open the image preserving RGB
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # We want to keep the white bird and turn everything else SOLID BLACK.
    newData = []
    for item in datas:
        r, g, b, a = item
        brightness = (r + g + b) / 3
        
        # If it's bright, keep it as white (or original pixel)
        # But to be clean, if it's the bird, let's just make it white with anti-aliasing against black.
        
        if brightness > 100:
            # map brightness [100...255] to a blend between black and white
            # ratio = 0 at brightness 100, 1 at brightness 255
            ratio = (brightness - 100) / 155.0
            val = int(255 * ratio)
            newData.append((val, val, val, 255))
        else:
            newData.append((0, 0, 0, 255)) # Solid black
            
    img.putdata(newData)
    
    # Crop to bounding box of non-black pixels? No, let's keep it as is, or crop it based on white.
    # Actually, it's a solid background now, so getbbox() won't work standardly. Let's just save.
    img = img.convert("RGB") # Save as RGB solid
    img.save(output_path, "PNG")
    print("Masked successfully to black background")

if __name__ == "__main__":
    make_black_bg(sys.argv[1], sys.argv[2])
