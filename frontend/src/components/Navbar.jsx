import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const userData = await getUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                    // Optionally clear token if invalid
                    // localStorage.removeItem('token');
                }
            } else {
                setUser(null);
            }
        };

        fetchUserData();
    }, [token, location.pathname]);

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setShowLogoutConfirm(false);
        navigate('/login', { state: { message: 'You have been successfully logged out' } });
    };

    return (
        <>
            <nav className="bg-darker border-b border-white/10 p-4 relative z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        AI Editor
                    </Link>
                    <div className="flex gap-4 items-center">
                        {token ? (
                            <>
                                <Link to="/upload" className="hover:text-primary transition-colors">New Project</Link>
                                <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                    {user?.profile_image ? (
                                        <img
                                            src={user.profile_image}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-primary transition-colors"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-primary transition-colors">
                                            <span className="text-sm">👤</span>
                                        </div>
                                    )}
                                    <span className="hidden sm:block">{user?.full_name || 'Profile'}</span>
                                </Link>
                                <button onClick={handleLogoutClick} className="text-sm px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
                                <Link to="/register" className="px-4 py-2 rounded bg-primary hover:bg-primary/90 transition-colors">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-darker border border-white/10 p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 animate-fadeIn">
                        <h3 className="text-xl font-bold mb-2 text-white">Log Out?</h3>
                        <p className="text-gray-400 mb-6">Are you sure you want to log out of your account?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 rounded bg-red-500/80 hover:bg-red-500 transition-colors text-white font-medium shadow-lg shadow-red-500/20"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
