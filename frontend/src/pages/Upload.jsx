import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../services/api';

const Upload = () => {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) handleUpload(file);
    };

    const handleUpload = async (file) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const result = await uploadImage(file);
            // Navigate to editor with the uploaded image URL
            navigate('/editor', { state: { imageUrl: result.url } });
        } catch (err) {
            console.error(err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div
                className={`w-full max-w-2xl p-12 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[400px]
                    ${dragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/20 bg-white/5 hover:border-white/40'}
                    ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                <div className="bg-dark p-6 rounded-full mb-6 relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all"></div>
                    <span className="text-4xl relative z-10 transition-transform group-hover:scale-110 block">☁️</span>
                </div>

                <h1 className="text-3xl font-bold mb-3">Upload your Photo</h1>
                <p className="text-gray-400 mb-8 max-w-sm">
                    Drag and drop your image here, or click anywhere to browse your files.
                </p>

                {uploading && (
                    <div className="flex items-center gap-3 text-primary animate-pulse">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading to secure cloud...</span>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4 bg-red-500/10 px-4 py-2 rounded">{error}</p>}
            </div>
        </div>
    );
};

export default Upload;
