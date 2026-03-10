from PIL import Image
import sys

def remove_background(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        newData = []
        for item in datas:
            # The bird is white (>200 on RGB)
            # Anything else (black, grey checkerboard) becomes transparent
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append(item)
            else:
                newData.append((255, 255, 255, 0))
        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_background(sys.argv[1], sys.argv[2])
