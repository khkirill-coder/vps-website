from PIL import Image

try:
    img = Image.open('public/bird-logo.png').convert("RGBA")
    # Resize to 512x512
    img = img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Create a solid black background
    bg = Image.new("RGBA", img.size, (10, 10, 10, 255))
    
    # Paste the transparent logo onto the background
    bg.paste(img, (0, 0), img)
    
    # Save as apple-touch-icon.png without transparency
    bg_rgb = bg.convert("RGB")
    bg_rgb.save('public/apple-touch-icon.png')
    bg_rgb.save('public/icon-192.png')
    bg_rgb.save('public/icon-512.png')
    print("Icons generated successfully.")
except Exception as e:
    print(f"Error: {e}")
