import { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE – REGISTER FORM */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Join CivicPulse
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              Empowering citizens for a safer city
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-black font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – IMAGE / SVG */}
        <div className="hidden md:flex items-center justify-center bg-black p-10">
          <div className="text-center text-white space-y-6">
            <img
              src="/register-illustration.svg"   // yahan apni image ya svg
              alt="Register Illustration"
              className="w-80 mx-auto"
            />
            <h3 className="text-2xl font-bold">Be a Responsible Citizen</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Create an account and help improve your city by reporting real
              issues.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
