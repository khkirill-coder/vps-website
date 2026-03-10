from PIL import Image
import sys

def refine_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # We want to keep ONLY the pure white silhouette and turn everything else transparent.
    newData = []
    for item in datas:
        r, g, b, a = item
        # Calculate brightness
        brightness = (r + g + b) / 3
        
        # If the pixel is very bright, it's the bird. Keep it white.
        # But factor in the brightness to make the alpha channel smooth (anti-aliasing).
        if brightness > 100:
            # Map brightness [100...255] to alpha [0...255]
            alpha = int((brightness - 100) / 155.0 * 255.0)
            newData.append((255, 255, 255, alpha))
        else:
            newData.append((255, 255, 255, 0))
            
    img.putdata(newData)
    
    # Let's also crop the transparency to remove extra space around it
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print("Masked successfully")

if __name__ == "__main__":
    refine_bg(sys.argv[1], sys.argv[2])
