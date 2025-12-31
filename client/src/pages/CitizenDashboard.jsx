import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import issueService from '../services/issueService';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CitizenDashboard = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useGSAP(() => {
        gsap.from('.dashboard-header', { duration: 0.8, y: -20, opacity: 0, ease: 'power3.out' });
        gsap.from('.issue-card', {
            duration: 0.5,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    });

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const data = await issueService.getIssues();
                setIssues(data);
            } catch (error) {
                console.error("Error loading issues", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('issue-updated', (updatedIssue) => {
            setIssues((prev) => prev.map(issue => issue._id === updatedIssue._id ? updatedIssue : issue));
            // Optional: visual notification
        });

        socket.on('new-issue', (newIssue) => {
            // Citizens typically see all issues or just their own. 
            // If we want a public feed, we append.
            setIssues((prev) => [newIssue, ...prev]);
        });

        return () => {
            socket.off('issue-updated');
            socket.off('new-issue');
        };
    }, [socket]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const [stats, setStats] = useState({ total: 0, resolved: 0, active: 0 });

    useEffect(() => {
        const resolved = issues.filter(i => i.status === 'resolved').length;
        setStats({
            total: issues.length,
            resolved,
            active: issues.length - resolved
        });
    }, [issues]);

    return (
        <div className="container mx-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 mb-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        Make Your City <br />
                        <span className="text-blue-400">Safer & Smarter</span>
                    </h1>
                    <p className="text-gray-300 text-lg mb-8 max-w-lg">
                        Empowering citizens to report issues instantly. Join thousands of neighbors making a difference today.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/report"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                            <span>📷</span> Report Issue
                        </Link>
                        <Link
                            to="/sos"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                            <span>🚨</span> SOS Emergency
                        </Link>
                    </div>
                </div>

                {/* Abstract Visual Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl text-blue-600 text-2xl">📊</div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Reports</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-50 rounded-xl text-green-600 text-2xl">✅</div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Resolved Cases</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.resolved}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-orange-50 rounded-xl text-orange-600 text-2xl">⚡</div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Active Issues</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.active}</h3>
                    </div>
                </div>
            </div>

            <div className="dashboard-header flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                    <p className="text-gray-500 mt-1">Real-time updates from your community</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map((issue) => (
                        <div key={issue._id} className="issue-card group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {issue.image ? (
                                    <img src={issue.image} alt={issue.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-slate-100 text-gray-400">
                                        <span className="text-4xl opacity-20">📷</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/90 shadow-sm ${issue.status === 'resolved' ? 'text-green-600' :
                                            issue.status === 'in_progress' ? 'text-yellow-600' : 'text-gray-600'
                                        }`}>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-black/50 text-white backdrop-blur-sm">
                                        {issue.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${issue.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                                            issue.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {issue.priority || 'MEDIUM'}
                                    </span>
                                    <span className="text-gray-400 text-xs">{new Date(issue.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{issue.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{issue.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                            {issue.user ? issue.user.name[0] : 'A'}
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{issue.user ? issue.user.name : 'Anonymous'}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        👍 {issue.upvotes?.length || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CitizenDashboard;
