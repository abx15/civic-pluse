import { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logosos.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const containerRef = useRef(null);

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
    <div
      ref={containerRef}
      className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE – IMAGE / SVG */}
        <div className="hidden md:flex items-center justify-center bg-black p-10">
          <div className="text-white text-center space-y-6">
            <img
              src={logo}   // yahan apni image / svg ka path do
              alt="Login Illustration"
              className="w-80 mx-auto"
            />
            <h2 className="text-3xl font-bold">CivicPulse</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Report issues, stay informed, and help build a safer community.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – LOGIN FORM */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              Sign in to continue
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              New here?{' '}
              <Link
                to="/register"
                className="text-black font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
