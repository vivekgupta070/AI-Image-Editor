import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadImage } from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setShowCamera(true);
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Could not access camera. Please check permissions.");
        }
    };

    useEffect(() => {
        if (showCamera && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [showCamera, stream]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const handleFile = async (file) => {
        if (!file) return;

        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            navigate('/editor', { state: { imageUrl: result.url } });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], "camera_capture.png", { type: "image/png" });
            stopCamera();
            handleFile(file);
        }, 'image/png');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-6xl font-bold mb-6">
                Edit Photos with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Natural Language</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
                Describe what you want, and let our AI handle the rest. Professional edits in seconds, not hours.
            </p>

            <div className="flex gap-4 mb-12">
                <Link to="/register" className="px-8 py-3 rounded-full bg-primary text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                    Start Creating Free
                </Link>
                <Link to="/login" className="px-8 py-3 rounded-full bg-white/10 text-lg font-semibold hover:bg-white/20 transition-all">
                    View Demo
                </Link>
            </div>

            {/* Upload Section */}
            <div
                className={`w-full max-w-2xl p-10 rounded-3xl border-2 border-dashed transition-all duration-300 backdrop-blur-sm
                    ${dragActive
                        ? 'border-primary bg-primary/10 scale-102'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }
                    ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center gap-4">
                    {isUploading ? (
                        <>
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-lg font-medium">Uploading your image...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Upload an Image to Start</h3>
                                <p className="text-gray-400 text-sm mb-4">Drag and drop or click to browse</p>

                                <div className="flex justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 z-10 relative"
                                    >
                                        <span>📷</span> Take Photo
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-md">
                    <div className="bg-dark p-4 rounded-2xl w-full max-w-lg border border-white/10">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={stopCamera}
                                className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={capturePhoto}
                                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors font-semibold"
                            >
                                Capture
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                {[
                    { title: "Natural Language", desc: "Just type 'Make it sunset' or 'Remove background'." },
                    { title: "Smart Tools", desc: "One-tap objects removal and style transfer." },
                    { title: "4K Export", desc: "Download high-resolution images ready for print." }
                ].map((feature, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
