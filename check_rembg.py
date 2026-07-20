import sys
print(f"Python executable: {sys.executable}")
print(f"Python path: {sys.path}")

try:
    import onnxruntime
    print(f"onnxruntime version: {onnxruntime.__version__}")
    print(f"onnxruntime device: {onnxruntime.get_device()}")
except ImportError as e:
    print(f"Failed to import onnxruntime: {e}")

try:
    from rembg import remove
    print("rembg imported successfully")
except Exception as e:
    print(f"Failed to import rembg: {e}")
