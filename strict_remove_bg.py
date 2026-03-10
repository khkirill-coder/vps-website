from PIL import Image
import sys

def strict_remove_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        r, g, b, a = item
        # Only keep strictly white pixels (the bird itself)
        if r > 200 and g > 200 and b > 200:
            # Smooth the edges slightly
            alpha = min(255, int(((r+g+b)/3 - 200) * (255.0/55.0)))
            newData.append((255, 255, 255, alpha))
        else:
            newData.append((255, 255, 255, 0))
            
    img.putdata(newData)
    
    bbox = img.getbbox()
    if bbox:
        # Add 10px padding around the bird
        padding = 10
        bbox = (
            max(0, bbox[0] - padding),
            max(0, bbox[1] - padding),
            min(img.width, bbox[2] + padding),
            min(img.height, bbox[3] + padding)
        )
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print("Strictly removed background successfully")

if __name__ == "__main__":
    strict_remove_bg(sys.argv[1], sys.argv[2])
