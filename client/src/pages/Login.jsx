import { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const containerRef = useRef();
    // Removed GSAP animation to prevent blank screen issues

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const data = await login(email, password);

            if (data.role === 'admin' || data.role === 'authority') {
                navigate('/authority');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div ref={containerRef} className="flex items-center justify-center min-h-[80vh]">
            <div className="login-container w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Sign in to report issues & stay safe</p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    New here?{' '}
                    <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
