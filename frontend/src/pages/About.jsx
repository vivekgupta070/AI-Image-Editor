
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto min-h-[90vh] flex flex-col relative px-4 py-6">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">About</h1>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center">

                {/* App Icon */}
                <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                </div>

                {/* App Name & Version */}
                <h2 className="text-2xl font-bold mb-1">AI Photo Editor</h2>
                <p className="text-gray-400 text-sm mb-8">Version 2.4.0 (Stable)</p>

                {/* Description Box */}
                <div className="w-full bg-[#11121F] rounded-2xl p-6 mb-8 text-center border border-white/5">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Powering your creativity with advanced Natural Language Processing. Simply describe your vision, and our AI transforms your photos instantly. Our models are trained on millions of artistic styles to provide professional results in seconds.
                    </p>
                </div>

                {/* Links Section */}
                <div className="w-full space-y-3 mb-8">
                    <a href="https://example.com/terms" target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-xl flex items-center justify-between transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-[#1a1b26] text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </span>
                            <span className="font-medium text-sm text-gray-200">Terms of Service</span>
                        </div>
                        <span className="text-gray-500 group-hover:text-white transition-colors">›</span>
                    </a>

                    <a href="https://example.com/privacy" target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-xl flex items-center justify-between transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-[#1a1b26] text-purple-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                            </span>
                            <span className="font-medium text-sm text-gray-200">Privacy Policy</span>
                        </div>
                        <span className="text-gray-500 group-hover:text-white transition-colors">›</span>
                    </a>

                    <a href="https://example.com/licenses" target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-xl flex items-center justify-between transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-[#1a1b26] text-yellow-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <span className="font-medium text-sm text-gray-200">Licenses</span>
                        </div>
                        <span className="text-gray-500 group-hover:text-white transition-colors">›</span>
                    </a>
                </div>

                {/* Rate Button */}
                <button
                    onClick={() => alert("Redirecting to App Store...")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-8 transition-colors shadow-lg shadow-blue-900/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    Rate Us on App Store
                </button>

                {/* Project Details (Technical) */}
                <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/5 mb-8">
                    <h3 className="font-bold text-sm text-gray-200 mb-4 flex items-center gap-2">
                        <span>🛠️</span> Project Details
                    </h3>
                    <div className="space-y-4">
                        {/* Tech Stack */}
                        <div className="space-y-2 text-xs text-gray-400">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Frontend</span>
                                <span className="text-gray-200 font-mono">React 18 + Vite + Tailwind CSS</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Backend</span>
                                <span className="text-gray-200 font-mono">FastAPI (Python 3.10+)</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Database</span>
                                <span className="text-gray-200 font-mono">SQLite (SQLAlchemy ORM)</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>AI Core</span>
                                <span className="text-gray-200 font-mono">Pollinations AI + Stable Diffusion</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Image Processing</span>
                                <span className="text-gray-200 font-mono">Pillow (PIL) + Rembg (U2NET)</span>
                            </div>
                        </div>

                        {/* Feature Tags */}
                        <div className="pt-2">
                            <span className="block text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Available Operations</span>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "BG Removal", "Object Generation", "Sticker Maker", "Cinematic Look",
                                    "Glitch Art", "Style Transfer", "4K Upscaling", "Auto Enhance",
                                    "Smart Filters", "Meme Generator", "Portrait retouch"
                                ].map((feature, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] text-gray-300 rounded-md">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-gray-600 text-xs">© 2024 AI Photo Editor Inc. All rights reserved.</p>
                </div>

            </div>
        </div>
    );
};

export default About;
