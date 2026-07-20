
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword, deleteUser, getUser, uploadImage, updateUser } from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [highQuality, setHighQuality] = useState(true);

    // Password Change State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUserData();
    }, []);

    // Image Upload Handler
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // 1. Upload the image
            const data = await uploadImage(file);
            const newImageUrl = data.url;

            // 2. Update user profile with new image URL
            await updateUser({ profile_image: newImageUrl });

            // 3. Update local state
            setUser(prev => ({ ...prev, profile_image: newImageUrl }));

            // Optional: Show success message/toast
            console.log("Profile image updated");
        } catch (error) {
            console.error("Failed to update profile image", error);
            // Optional: Show error message
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { state: { message: 'You have been successfully logged out' } });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            await updatePassword(passwords.current, passwords.new);

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => setShowPasswordModal(false), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update password' });
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteUser();
            localStorage.removeItem('token');
            navigate('/register');
        } catch (error) {
            console.error("Failed to delete account:", error);
            setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">Settings</h1>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-600 p-[2px]">
                        {user?.profile_image ? (
                            <img
                                src={user.profile_image}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-dark"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-dark flex items-center justify-center border-2 border-dark">
                                <span className="text-2xl">👤</span>
                            </div>
                        )}
                    </div>
                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Edit</span>
                    </div>
                    <input
                        type="file"
                        id="profile-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <h2 className="text-lg font-bold">{user?.full_name || 'User'}</h2>
                    <p className="text-gray-400 text-xs mb-1">{user?.email}</p>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                            Member
                        </span>
                    </div>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6 flex-1">

                {/* General */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-3 ml-1">General</h3>
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-gray-300">
                                    🔔
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Push Notifications</p>
                                    <p className="text-xs text-gray-500">Alerts for AI processing and updates</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${pushNotifications ? 'bg-primary' : 'bg-gray-600'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pushNotifications ? 'left-7' : 'left-1'}`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editor Preferences */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-3 ml-1">Editor Preferences</h3>
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-gray-300">
                                    💾
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Auto-Save</p>
                                    <p className="text-xs text-gray-500">Save to Camera Roll automatically</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAutoSave(!autoSave)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${autoSave ? 'bg-primary' : 'bg-gray-600'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoSave ? 'left-7' : 'left-1'}`}></span>
                            </button>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-gray-300">
                                    ᴴᵠ
                                </div>
                                <div>
                                    <p className="font-medium text-sm">High-Quality Exports</p>
                                    <p className="text-xs text-gray-500">Export images in full 4K resolution</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setHighQuality(!highQuality)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${highQuality ? 'bg-primary' : 'bg-gray-600'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${highQuality ? 'left-7' : 'left-1'}`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Management */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-3 ml-1">Account Management</h3>
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-gray-300">
                                    💳
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Manage Subscription</p>
                                    <p className="text-xs text-gray-500">Update billing and plan details</p>
                                </div>
                            </div>
                            <span className="text-gray-400">›</span>
                        </button>

                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-gray-300">
                                    🔒
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Change Password</p>
                                    <p className="text-xs text-gray-500">Ensure your account stays secure</p>
                                </div>
                            </div>
                            <span className="text-gray-400">›</span>
                        </button>
                    </div>
                </div>

                {/* Support & About */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-3 ml-1">Support & About</h3>
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                        <button
                            onClick={() => navigate('/about')}
                            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center text-gray-300">
                                    ℹ️
                                </div>
                                <div>
                                    <p className="font-medium text-sm">About App</p>
                                    <p className="text-xs text-gray-500">Version, Terms & Privacy</p>
                                </div>
                            </div>
                            <span className="text-gray-400">›</span>
                        </button>
                    </div>
                </div>

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#1a1b26] p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-xl">
                            <h3 className="text-lg font-bold mb-4">Change Password</h3>

                            {message.text && (
                                <div className={`mb-4 p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full bg-darker border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full bg-darker border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full bg-darker border border-white/10 rounded p-2 text-white focus:border-primary outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded text-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 bg-primary hover:bg-primary/90 rounded text-white transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#1a1b26] p-6 rounded-2xl w-full max-w-sm border border-red-500/20 shadow-xl">
                            <h3 className="text-lg font-bold mb-2 text-red-500">Delete Account</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded text-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded text-white transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors mb-4"
                    >
                        Log Out
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full text-red-500 text-sm hover:underline"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-600 text-xs pb-4">
                <p className="mb-4">Lumina AI Editor v2.4.0</p>
                <div className="flex justify-center gap-6">
                    <span>🌐</span>
                    <span>❓</span>
                    <span>🛡️</span>
                </div>
            </div>
        </div >
    );
};

export default Profile;
