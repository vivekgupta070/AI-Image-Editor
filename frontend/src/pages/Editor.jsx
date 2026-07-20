import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { processImage, getProject } from '../services/api';
import BeforeAfterSlider from '../components/BeforeAfterSlider';


const Editor = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('project');

    // Initial image priority: Uploaded > Default
    const [previewUrl, setPreviewUrl] = useState(
        location.state?.imageUrl || null
    );
    const [originalUrl, setOriginalUrl] = useState(
        location.state?.imageUrl || null
    );

    // Eraser State
    const [eraserMode, setEraserMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const containerRef = useRef(null);
    const [lineWidth, setLineWidth] = useState(20);


    // Update if location state changes (e.g. fresh navigation)
    useEffect(() => {
        const loadInitialImage = async () => {
            // Only load from state/projectId if we don't already have a previewUrl
            // or if the component just mounted.
            if (!previewUrl) {
                if (location.state?.imageUrl) {
                    setPreviewUrl(location.state.imageUrl);
                    setOriginalUrl(location.state.imageUrl);
                } else if (projectId) {
                    setLoading(true);
                    try {
                        const project = await getProject(projectId);
                        if (project.images && project.images.length > 0) {
                            setPreviewUrl(project.images[0].url);
                            setOriginalUrl(project.images[0].url);
                        }
                    } catch (error) {
                        console.error("Failed to load project image", error);
                    } finally {
                        setLoading(false);
                    }
                }
            }
        };
        loadInitialImage();
    }, [location.state, projectId, previewUrl]);

    const [error, setError] = useState(null);

    useEffect(() => {
        if (eraserMode && canvasRef.current) {
            const canvas = canvasRef.current;
            // Match canvas size to container/image
            const container = containerRef.current;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;

                const ctx = canvas.getContext('2d');
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Transparent red for mask visibility
                ctx.lineWidth = lineWidth;
                contextRef.current = ctx;
            }
        }
    }, [eraserMode, lineWidth]);

    const startDrawing = ({ nativeEvent }) => {
        if (!eraserMode) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing || !eraserMode) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (!eraserMode) return;
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const clearMask = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const handleProcess = async (operation, prompt = "", textTop = null, textBottom = null) => {
        console.log(`Processing: ${operation}, URL: ${previewUrl}`);
        if (!previewUrl) {
            console.warn("No preview URL");
            return;
        }

        let maskData = null;
        if (operation === 'eraser' && canvasRef.current) {
            // Create a black/white mask for the backend
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvasRef.current.width;
            tempCanvas.height = canvasRef.current.height;
            const tempCtx = tempCanvas.getContext('2d');

            // Fill background with black
            tempCtx.fillStyle = 'black';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Draw the current mask in white
            tempCtx.strokeStyle = 'white';
            tempCtx.lineWidth = lineWidth;
            tempCtx.lineCap = 'round';
            tempCtx.drawImage(canvasRef.current, 0, 0);

            // Note: Canvas.drawImage won't work as expected if we used rgba(255,0,0,0.5) 
            // Better: Redraw the paths onto tempCtx or handle pixel conversion
            // Simplified: for this demo, we'll just send the current canvas data 
            // and the backend will treat non-transparent pixels as mask.
            maskData = canvasRef.current.toDataURL('image/png');
        }

        setLoading(true);
        setError(null);
        try {
            // Include maskData if it exists (for eraser)
            const result = await processImage(previewUrl, maskData || prompt, operation, textTop, textBottom);
            setPreviewUrl(result.processed_image_url);
            if (operation === 'eraser') {
                setEraserMode(false);
                clearMask();
            }
        } catch (error) {
            console.error("Processing failed", error);
            setError(error.response?.data?.detail || "Processing failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = () => {
        if (!previewUrl) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = previewUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');

            // Fill with white background (JPEG doesn't support transparency)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 0, 0);

            // Convert canvas to JPEG data URL
            const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);

            const link = document.createElement('a');
            link.href = jpegUrl;
            link.download = `ai-edited-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        img.onerror = () => {
            console.error("Image load failed for download");
            // Fallback
            const link = document.createElement('a');
            link.href = previewUrl;
            link.download = `ai-edited-${Date.now()}.jpg`;
            link.target = "_blank";
            link.click();
        };
    };

    return (
        <div className="flex flex-col h-[85vh] gap-4">
            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* Sidebar Tools */}
                <div className="w-64 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-3">Smart Edits</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('remove_bg')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>✂️</span> Remove Background
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => setEraserMode(!eraserMode)}
                                className={`p-3 rounded transition-all text-left flex items-center gap-2 ${eraserMode ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-dark'} ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>🧽</span> Object Remover (Eraser)
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => {
                                    const color = prompt("Enter a color name (e.g., red, blue, white, black):", "white");
                                    if (color) handleProcess('add_bg', color);
                                }}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>➕</span> Change Background
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('style_transfer')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>🎨</span> Style Transfer
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('enhance')}
                                className={`p-3 rounded bg-blue-600 transition-all text-white font-semibold text-left flex items-center gap-2 shadow-lg mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 active:scale-95'}`}
                            >
                                <span>✨</span> Auto Enhance
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => handleProcess('grayscale')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>⚫</span> Grayscale
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('blur')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>💧</span> Blur
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('sepia')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>📜</span> Sepia
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('contour')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>✏️</span> Sketch
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('solarize')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>🌞</span> Solarize
                            </button>
                        </div>


                    </div>





                </div>

                {/* Main Canvas */}
                <div
                    ref={containerRef}
                    className="flex-1 bg-darker rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group"
                >
                    {loading && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-md">
                            {/* Scanner Effect */}
                            <div className="relative w-64 h-64 border-2 border-primary/30 rounded-lg overflow-hidden mb-8 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                {previewUrl && (
                                    <img src={previewUrl} className="w-full h-full object-cover opacity-30 grayscale" alt="scanning" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-transparent h-[20%] w-full animate-scan"></div>

                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                            </div>

                            {/* Text Animation */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-widest uppercase animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    Generating AI Art
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                </div>
                                <p className="text-gray-400 text-sm font-mono">Transforming pixels...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-fadeIn">
                            <span>⚠️</span> {error}
                            <button onClick={() => setError(null)} className="ml-2 hover:opacity-70">✕</button>
                        </div>
                    )}

                    {previewUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            <button
                                onClick={handleDownload}
                                className="absolute top-4 right-16 z-20 p-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all"
                                title="Download Image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m0 0l3-3m-3 3l-3-3" />
                                </svg>
                            </button>

                            <button
                                onClick={() => navigate('/upload')}
                                className="absolute top-4 right-4 z-20 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
                                title="Cancel and Upload New"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {eraserMode && (
                                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Size</span>
                                    <input
                                        type="range"
                                        min="5" max="100"
                                        value={lineWidth}
                                        onChange={(e) => setLineWidth(parseInt(e.target.value))}
                                        className="w-24 accent-primary"
                                    />
                                    <button
                                        onClick={clearMask}
                                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => handleProcess('eraser')}
                                        className="px-4 py-1 bg-primary hover:bg-primary/80 rounded text-xs font-bold transition-all"
                                    >
                                        Apply Eraser
                                    </button>
                                    <button
                                        onClick={() => setEraserMode(false)}
                                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black/20 relative">
                                {eraserMode && (
                                    <canvas
                                        ref={canvasRef}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        className="absolute inset-0 z-10 cursor-crosshair touch-none"
                                    />
                                )}
                                <img
                                    src={previewUrl}
                                    alt="Canvas"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/600x400?text=Image+Load+Error";
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <p className="mb-4">No image selected</p>
                            <button
                                onClick={() => navigate('/upload')}
                                className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
                            >
                                Upload Image
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Filters */}
                <div className="w-64 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-3">Filters & Adjustments</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('cinematic')}
                                className={`p-3 rounded bg-purple-600 transition-all text-white font-semibold text-left flex items-center gap-2 shadow-lg mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 active:scale-95'}`}
                            >
                                <span>🎬</span> Cinematic Look
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => handleProcess('glitch')}
                                className={`p-3 rounded bg-pink-600 transition-all text-white font-semibold text-left flex items-center gap-2 shadow-lg mb-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-500 active:scale-95'}`}
                            >
                                <span>📺</span> Glitch Effect
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => handleProcess('sticker')}
                                className={`p-3 rounded bg-yellow-500 transition-all text-white font-semibold text-left flex items-center gap-2 shadow-lg mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 active:scale-95'}`}
                            >
                                <span>⭐</span> Sticker Maker
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => handleProcess('vignette')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>🌑</span> Vignette
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => handleProcess('invert')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>🔄</span> Invert Colors
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('flip')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>↔️</span> Flip Image
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('rotate')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>⤵️</span> Rotate 90°
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('posterize')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>🎨</span> Posterize
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => handleProcess('equalize')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>⚖️</span> Auto Contrast
                            </button>

                            <button
                                disabled={loading}
                                onClick={() => handleProcess('sharpen')}
                                className={`p-3 rounded bg-dark transition-all text-left flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary active:scale-95'}`}
                            >
                                <span>👓</span> Sharpen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Editor;
