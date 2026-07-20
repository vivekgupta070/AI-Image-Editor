import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, uploadImage } from '../services/api';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setError('');
        try {
            const data = await uploadImage(file);
            setProfileImage(data.url);
        } catch (err) {
            console.error(err);
            setError('Failed to upload profile image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);
        try {
            await register(email, password, fullName, profileImage);
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            let errorMessage = 'Registration failed. Please try again.';

            if (err.response) {
                errorMessage = err.response.data.detail || errorMessage;
            } else if (err.request) {
                errorMessage = 'Cannot connect to server. Is the backend running?';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>

                <div className="flex justify-center mb-6">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                        <div className={`w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 flex items-center justify-center bg-dark/50 ${uploadingImage ? 'animate-pulse' : ''}`}>
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl text-gray-400">👤</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs">Upload</span>
                        </div>
                        <input
                            type="file"
                            id="profile-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    {uploadingImage && <div className="absolute mt-24 text-xs text-primary">Uploading...</div>}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4">
                        <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 rounded bg-dark/50 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder-gray-600"
                            placeholder="John Doe"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-dark/50 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder-gray-600"
                            placeholder="name@example.com"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-dark/50 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder-gray-600"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || uploadingImage}
                        className="w-full py-3 rounded bg-primary font-semibold text-white hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
