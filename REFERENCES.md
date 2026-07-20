# Project References

This document lists the technologies, libraries, APIs, and learning resources used in the AI Image Editor project.

## 1. Core Technologies

### Backend Framework
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints.
  - *Documentation*: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
  - *Source*: [https://github.com/fastapi/fastapi](https://github.com/fastapi/fastapi)

- **Uvicorn**: An ASGI web server implementation for Python.
  - *Documentation*: [https://www.uvicorn.org/](https://www.uvicorn.org/)

### Frontend Framework
- **React**: A JavaScript library for building user interfaces.
  - *Documentation*: [https://react.dev/](https://react.dev/)
  
- **Vite**: Next Generation Frontend Tooling.
  - *Documentation*: [https://vitejs.dev/](https://vitejs.dev/)

- **Tailwind CSS**: A utility-first CSS framework.
  - *Documentation*: [https://tailwindcss.com/](https://tailwindcss.com/)

## 2. AI & Image Processing Libraries

### Image Manipulation
- **Pillow (PIL Fork)**: The friendly Python Image Library. Used for basic image operations (crop, resize, enhance, filters).
  - *Documentation*: [https://pillow.readthedocs.io/](https://pillow.readthedocs.io/)
  - *Source*: [https://github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)

- **rembg**: A tool to remove images background. Used for the "Remove Background" and "Sticker" features.
  - *Source*: [https://github.com/danielgatis/rembg](https://github.com/danielgatis/rembg)
  - *Model*: U^2-Net (u2net)

### Generative AI APIs
- **Pollinations.ai**: Used for free, unlimited AI image generation using Stable Diffusion models.
  - *Website*: [https://pollinations.ai/](https://pollinations.ai/)
  - *API Endpoint*: `https://image.pollinations.ai/prompt/{prompt}`

- **LoremFlickr**: Used as a fallback for stock photos when AI generation fails.
  - *Website*: [https://loremflickr.com/](https://loremflickr.com/)

- **Google Gemini API** (Integrated): Used for natural language understanding and prompt enhancement.
  - *Documentation*: [https://ai.google.dev/](https://ai.google.dev/)

## 3. Version Control & Open Source Tools

### Version Control
- **Git**: Distributed version control system used for tracking changes in the source code.
  - *Documentation*: [https://git-scm.com/doc](https://git-scm.com/doc)
- **GitHub**: Platform for hosting and collaborating on the project repository.
  - *Website*: [https://github.com/](https://github.com/)

### Open Source Models
- **U^2-Net**: The underlying model used by `rembg` for background removal.
  - *Paper*: [https://arxiv.org/abs/2005.09007](https://arxiv.org/abs/2005.09007)
  - *Repository*: [https://github.com/xuebinqin/U-2-Net](https://github.com/xuebinqin/U-2-Net)

- **Stable Diffusion**: The latent text-to-image diffusion model accessed via Pollinations.ai.
  - *Paper*: [https://arxiv.org/abs/2112.10752](https://arxiv.org/abs/2112.10752)
  - *Repository*: [https://github.com/CompVis/stable-diffusion](https://github.com/CompVis/stable-diffusion)

## 4. Learning Resources & References

### YouTube Tutorials & Guides
- **FastAPI / Python Backend Development**:
  - *Channel*: [Tiangolo (FastAPI Creator)](https://www.youtube.com/@tiangolo)
  - *Channel*: [ArjanCodes (Python Design Patterns)](https://www.youtube.com/@ArjanCodes)
  - *Topic*: Building AI Wrappers and Image Processing APIs.

- **React / Frontend Development**:
  - *Channel*: [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified)
  - *Channel*: [Traversy Media](https://www.youtube.com/@TraversyMedia)
  - *Topic*: React Hooks, State Management, and Tailwind CSS implementation.

- **AI Integration**:
  - *Channel*: [Prompt Engineering Guide](https://www.youtube.com/@PromptEngineering)
  - *Topic*: Integrating LLMs (Gemini) and Image Gen APIs into web apps.

### Documentation & Community
- **Stack Overflow**: For debugging specific error messages and implementation details.
- **MDN Web Docs**: Standard reference for HTML, CSS, and JavaScript.
- **Python Package Index (PyPI)**: Source for library documentation and installation instructions.
