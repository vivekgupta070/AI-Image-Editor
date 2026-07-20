from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import time
import os
import uuid
import requests
from PIL import Image, ImageEnhance, ImageOps, ImageDraw, ImageFont, ImageChops, ImageFilter
from io import BytesIO
from sqlalchemy.orm import Session
import base64
# Force reload to detect new dependencies
try:
    import numpy as np
    import cv2
except ImportError:
    np = None
    cv2 = None
from .. import auth, database, crud, models, schemas

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

class AIRequest(BaseModel):
    image_url: str
    prompt: str
    operation: str
    text_top: str | None = None
    text_bottom: str | None = None

class AIResponse(BaseModel):
    processed_image_url: str
    message: str

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_base_url(request):
    """Dynamic base URL for uploads."""
    host = request.headers.get("host", "localhost:8000")
    protocol = "https" if request.scope.get("type") == "https" else "http"
    return f"{protocol}://{host}/uploads"

def load_image(image_url):
    """Load image from a local path or URL."""
    try:
        print(f"Loading image from: {image_url}")
        if "/uploads/" in image_url:
            filename = image_url.split("/")[-1]
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(file_path):
                return Image.open(file_path).convert("RGBA")
        
        if image_url.startswith("http"):
            response = requests.get(image_url)
            response.raise_for_status()
            return Image.open(BytesIO(response.content)).convert("RGBA")
        else:
            raise ValueError("Invalid Image URL")
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

def save_image(image, request):
    """Save processed image to uploads dir and return URL."""
    unique_filename = f"processed_{uuid.uuid4()}.png"
    save_path = os.path.join(UPLOAD_DIR, unique_filename)
    image.save(save_path, "PNG")
    print(f"Saved processed image to: {save_path}")
    return f"{get_base_url(request)}/{unique_filename}"

@router.post("/process", response_model=AIResponse)
def process_image(
    request: AIRequest, 
    fastapi_request: Request,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    print(f"User {current_user.email} requested {request.operation} on {request.image_url}")
    
    img = load_image(request.image_url)
    if not img and request.operation != "generate":
        raise HTTPException(status_code=400, detail="Could not load source image")

    try:
        processed_img = None
        message = "Operation successful"

        op = request.operation.lower()

        if op == "remove_bg":
            from rembg import remove
            processed_img = remove(img)
            message = "Background removed successfully"

        elif op == "add_bg":
            from rembg import remove
            img_no_bg = remove(img)
            color_map = {
                "red": (255, 0, 0, 255),
                "green": (0, 255, 0, 255),
                "blue": (0, 0, 255, 255),
                "white": (255, 255, 255, 255),
                "black": (0, 0, 0, 255),
                "yellow": (255, 255, 0, 255),
                "orange": (255, 165, 0, 255),
                "purple": (128, 0, 128, 255),
                "pink": (255, 192, 203, 255),
            }
            target_color = color_map.get(request.prompt.lower(), (255, 255, 255, 255))
            bg_layer = Image.new("RGBA", img_no_bg.size, target_color)
            bg_layer.alpha_composite(img_no_bg)
            processed_img = bg_layer
            message = f"Background changed to {request.prompt or 'white'}"

        elif op == "style_transfer":
            img_rgb = img.convert("RGB")
            processed_img = ImageOps.solarize(img_rgb, threshold=128).convert("RGBA")
            message = "Style transfer applied"

        elif op == "enhance":
            img_rgb = img.convert("RGB")
            img_rgb = ImageEnhance.Color(img_rgb).enhance(1.2)
            img_rgb = ImageEnhance.Contrast(img_rgb).enhance(1.1)
            img_rgb = ImageEnhance.Sharpness(img_rgb).enhance(1.2)
            processed_img = img_rgb.convert("RGBA")
            message = "Image enhanced"

        elif op == "grayscale":
            processed_img = ImageOps.grayscale(img).convert("RGBA")
            message = "Converted to Grayscale"

        elif op == "blur":
            processed_img = img.filter(ImageFilter.GaussianBlur(5))
            message = "Image blurred"

        elif op == "sepia":
            img_rgb = img.convert("RGB")
            sepia_data = []
            for r, g, b in img_rgb.getdata():
                tr = int(0.393 * r + 0.769 * g + 0.189 * b)
                tg = int(0.349 * r + 0.686 * g + 0.168 * b)
                tb = int(0.272 * r + 0.534 * g + 0.131 * b)
                sepia_data.append((min(255, tr), min(255, tg), min(255, tb)))
            processed_img = Image.new('RGB', img_rgb.size)
            processed_img.putdata(sepia_data)
            processed_img = processed_img.convert("RGBA")
            message = "Sepia filter applied"

        elif op == "flip":
            processed_img = ImageOps.mirror(img)
            message = "Image flipped"

        elif op == "contour":
            processed_img = img.filter(ImageFilter.CONTOUR)
            message = "Edges highlighted"

        elif op == "solarize":
            img_rgb = img.convert("RGB")
            processed_img = ImageOps.solarize(img_rgb, threshold=128).convert("RGBA")
            message = "Solarize effect applied"

        elif op == "invert":
            img_rgb = img.convert("RGB")
            processed_img = ImageOps.invert(img_rgb).convert("RGBA")
            message = "Colors inverted"

        elif op == "rotate":
            processed_img = img.rotate(-90, expand=True)
            message = "Image rotated 90°"

        elif op == "sharpen":
            processed_img = img.filter(ImageFilter.SHARPEN)
            message = "Image sharpened"

        elif op == "posterize":
            img_rgb = img.convert("RGB")
            processed_img = ImageOps.posterize(img_rgb, bits=2).convert("RGBA")
            message = "Posterize effect applied"

        elif op == "equalize":
            img_rgb = img.convert("RGB")
            processed_img = ImageOps.equalize(img_rgb).convert("RGBA")
            message = "Histogram Equalized"

        elif op == "vignette":
            width, height = img.size
            vignette_layer = Image.new("RGBA", (width, height), (0, 0, 0, 255))
            mask = Image.new("L", (width, height), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0, width, height), fill=255)
            blur_radius = min(width, height) // 3
            mask = mask.filter(ImageFilter.GaussianBlur(blur_radius))
            mask = ImageOps.invert(mask)
            vignette_layer.putalpha(mask)
            processed_img = Image.alpha_composite(img, vignette_layer)
            message = "Vignette applied"

        elif op == "glitch":
            img_rgb = img.convert("RGB")
            r, g, b = img_rgb.split()
            r = ImageChops.offset(r, 10, 0)
            b = ImageChops.offset(b, -10, 0)
            processed_img = Image.merge("RGB", (r, g, b)).convert("RGBA")
            message = "Glitch effect applied"

        elif op == "sticker":
            from rembg import remove
            img_no_bg = remove(img)
            alpha = img_no_bg.getchannel("A")
            stroke_size = 15
            dilated_alpha = alpha.filter(ImageFilter.GaussianBlur(stroke_size / 2))
            dilated_alpha = dilated_alpha.point(lambda p: 255 if p > 10 else 0)
            stroke_img = Image.new("RGBA", img_no_bg.size, (255, 255, 255, 255))
            stroke_img.putalpha(dilated_alpha)
            canvas = Image.new("RGBA", (img.width + 40, img.height + 40), (0,0,0,0))
            offset = (20, 20)
            canvas.paste(stroke_img, offset, stroke_img)
            canvas.paste(img_no_bg, offset, img_no_bg)
            processed_img = canvas
            message = "Sticker created!"

        elif op == "eraser":
            if not cv2 or not np:
                raise HTTPException(status_code=500, detail="OpenCV or Numpy not installed on server")
            
            mask_data = request.prompt
            if not mask_data.startswith("data:image"):
                raise HTTPException(status_code=400, detail="Mask data missing or invalid")
            
            try:
                # Decode base64 mask
                header, encoded = mask_data.split(",", 1)
                mask_bytes = base64.b64decode(encoded)
                mask_pil = Image.open(BytesIO(mask_bytes)).convert("L")
                
                # Resize mask to match image
                mask_pil = mask_pil.resize(img.size, Image.Resampling.LANCZOS)
                
                # Convert PIL images to openCV format
                img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGBA2BGR)
                mask_cv = np.array(mask_pil)
                
                # Apply Inpainting
                # Threshold mask to ensure it's binary
                _, mask_cv = cv2.threshold(mask_cv, 10, 255, cv2.THRESH_BINARY)
                
                res_cv = cv2.inpaint(img_cv, mask_cv, 3, cv2.INPAINT_TELEA)
                
                # Convert back to PIL
                processed_img = Image.fromarray(cv2.cvtColor(res_cv, cv2.COLOR_BGR2RGBA))
                message = "Object removed via Inpainting"
            except Exception as e:
                print(f"Eraser error: {e}")
                raise HTTPException(status_code=500, detail=f"Eraser failed: {str(e)}")

        elif op == "generate":
            # Smart Generation Logic
            p_lower = request.prompt.lower()
            if any(x in p_lower for x in ["remove background", "remove bg", "transparent"]):
                from rembg import remove
                processed_img = remove(img)
                message = "Background removed"
            elif any(x in p_lower for x in ["change background", "replace background", "new background"]):
                from rembg import remove
                img_subject = remove(img)
                import re
                bg_prompt = re.sub(r"(change|replace|new) background (to|with)?", "", p_lower).strip()
                if not bg_prompt: bg_prompt = "beautiful landscape"
                encoded_prompt = requests.utils.quote(bg_prompt)
                p_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={img.width}&height={img.height}"
                bg_res = requests.get(p_url, timeout=30)
                bg_res.raise_for_status()
                bg_img = Image.open(BytesIO(bg_res.content)).convert("RGBA").resize(img.size, Image.Resampling.LANCZOS)
                bg_img.alpha_composite(img_subject)
                processed_img = bg_img
                message = f"Background changed to {bg_prompt}"
            else:
                # Default Generation
                encoded_prompt = requests.utils.quote(request.prompt)
                p_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"
                p_res = requests.get(p_url, timeout=60)
                p_res.raise_for_status()
                processed_img = Image.open(BytesIO(p_res.content)).convert("RGBA")
                message = "Generated via Pollinations.ai"

        if not processed_img:
            processed_img = img
            message = "No changes applied"

        final_url = save_image(processed_img, fastapi_request)
        
        # Save to History
        try:
            image_schema = schemas.ImageCreate(
                url=final_url,
                prompt=request.prompt or request.operation
            )
            crud.create_image(db, image_schema, owner_id=current_user.id)
        except Exception as db_err:
            print(f"Error saving to DB: {db_err}")

        return {"processed_image_url": final_url, "message": message}

    except Exception as e:
        print(f"Error processing image: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=list[schemas.Image])
def get_ai_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_user_images(db, user_id=current_user.id)
