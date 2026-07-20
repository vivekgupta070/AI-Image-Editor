import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMsg(location.state.message);
            // Clear state so it doesn't reappear on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);
        try {
            const data = await login(email, password);
            localStorage.setItem('token', data.access_token);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            let errorMessage = 'Login failed. Please try again.';

            if (err.response) {
                // Server responded with a status code
                errorMessage = err.response.data.detail || errorMessage;
            } else if (err.request) {
                // Request made but no response (Network Error)
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
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h2>

                {successMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <p className="text-emerald-400 text-sm text-center font-bold flex items-center justify-center gap-2">
                            <span className="text-lg">✅</span> {successMsg}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                        <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={loading}
                        className="w-full py-3 rounded bg-primary font-semibold text-white hover:bg-primary/90 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
