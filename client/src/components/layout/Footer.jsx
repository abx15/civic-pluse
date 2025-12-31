import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Civic<span className="text-blue-600">Pulse</span>
                        </h2>
                        <p className="text-gray-500 leading-relaxed">
                            Empowering citizens to build safer, smarter communities through real-time reporting and rapid response.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-500 hover:text-blue-600 transition">Home</Link></li>
                            <li><Link to="/report" className="text-gray-500 hover:text-blue-600 transition">Report Issue</Link></li>
                            <li><Link to="/sos" className="text-gray-500 hover:text-red-600 transition">Emergency SOS</Link></li>
                            <li><Link to="/authority" className="text-gray-500 hover:text-blue-600 transition">Authority Login</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 transition">Community Guidelines</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 transition">Safety Tips</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 transition">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 transition">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-gray-500">
                                <span className="mr-2">📧</span> support@civicpulse.com
                            </li>
                            <li className="flex items-start text-gray-500">
                                <span className="mr-2">📞</span> 1-800-CIVIC-HELPLINE
                            </li>
                            <li className="text-sm text-gray-400 mt-4">
                                ⚠️ For life-threatening emergencies, always dial 911 (or 100/108) directly.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} CivicPulse. All rights reserved. Gov-Tech Initiative.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-600">Twitter</a>
                        <a href="#" className="text-gray-400 hover:text-gray-600">LinkedIn</a>
                        <a href="#" className="text-gray-400 hover:text-gray-600">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
