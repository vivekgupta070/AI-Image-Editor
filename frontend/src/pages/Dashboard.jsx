
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUser, getProjects } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, projectsData] = await Promise.all([
                    getUser(),
                    getProjects()
                ]);
                setUser(userData);
                setProjects(projectsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const stats = [
        { label: 'Total Projects', value: projects.length, icon: '📂', color: 'from-blue-500 to-cyan-400' },
        { label: 'Cloud Space', value: '85%', icon: '☁️', color: 'from-purple-500 to-pink-500' },
        { label: 'Storage Used', value: '1.2 GB', icon: '💾', color: 'from-orange-400 to-red-500' },
        { label: 'Credits Left', value: '850', icon: '🪙', color: 'from-green-400 to-emerald-600' },
    ];

    const quickActions = [
        { title: 'New Project', desc: 'Start with a fresh canvas', icon: '➕', path: '/upload', color: 'bg-primary/20' },
        { title: 'AI Retouch', desc: 'Auto-enhance your portraits', icon: '✨', path: '/editor', color: 'bg-secondary/20' },
        { title: 'Remove BG', desc: 'Instant background removal', icon: '✂️', path: '/editor', color: 'bg-purple-500/20' },
        { title: 'Style Transfer', desc: 'Apply artistic styles', icon: '🎨', path: '/editor', color: 'bg-orange-500/20' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user?.full_name || 'Creator'}</span>!
                    </h1>
                    <p className="text-gray-400">Ready to transform your next masterpiece?</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-purple-600 overflow-hidden">
                        {user?.profile_image ? (
                            <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                        )}
                    </div>
                    <div className="pr-4">
                        <p className="font-bold text-sm leading-tight">{user?.full_name}</p>
                        <p className="text-xs text-primary font-medium">Pro Member</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="relative group overflow-hidden bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Recent Projects */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Recent Projects</h2>
                        <Link to="/projects" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            {projects.slice(0, 4).map((project) => (
                                <div key={project.id} className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate(`/editor?project=${project.id}`)}>
                                    <div className="aspect-video bg-darker relative overflow-hidden">
                                        {project.images && project.images.length > 0 ? (
                                            <img src={project.images[0].url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 italic">No Preview</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <button className="w-full py-2 bg-primary rounded-xl font-bold text-sm">Open in Editor</button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold mb-1 truncate">{project.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-400">{new Date(project.created_at).toLocaleDateString()}</p>
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                                                {project.images?.length || 0} images
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center mb-12">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📁</div>
                            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                            <p className="text-gray-400 mb-6">Start your first AI-powered editing journey today.</p>
                            <Link to="/upload" className="px-6 py-3 bg-primary rounded-full font-bold inline-block hover:scale-105 transition-transform">
                                Create New Project
                            </Link>
                        </div>
                    )}


                </div>

                {/* Quick Actions & Tools */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Quick Tools</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {quickActions.map((action, i) => (
                                <Link
                                    key={i}
                                    to={action.path}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                                >
                                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm">{action.title}</h3>
                                        <p className="text-xs text-gray-500">{action.desc}</p>
                                    </div>
                                    <span className="text-gray-600 group-hover:text-primary transition-colors">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Subscription Card */}
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2">Upgrade to Ultra</h3>
                            <p className="text-sm text-gray-400 mb-4">Get unlimited AI generations and 4K exports.</p>
                            <button className="w-full py-3 bg-white text-darker font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                View Plans
                            </button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary blur-3xl opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
