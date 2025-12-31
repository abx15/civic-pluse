import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import Footer from './Footer';
import Logo from '../../assets/logosos.png';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src={Logo}
                                alt="CivicPulse Logo"
                                className="h-40 w-auto object-contain"
                            />
                        </Link>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm text-gray-500 hidden sm:block">
                                        Welcome, {user.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
                <Outlet />
            </main>

            <Footer />

            {/* SOS Floating Button */}
            {user && (
                <div className="fixed bottom-6 right-6 z-40">
                    <Link to="/sos">
                        <div className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 hover:scale-105 transition transform animate-pulse border-4 border-red-200">
                            <span className="font-bold text-xl px-2">SOS</span>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Layout;
