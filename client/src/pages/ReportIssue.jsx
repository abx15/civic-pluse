import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import issueService from '../services/issueService';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ReportIssue = () => {
    const navigate = useNavigate();
    const containerRef = useRef();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Road',
        lat: '',
        lng: '',
        address: ''
    });
    const [file, setFile] = useState(null);

    useGSAP(() => {
        gsap.from('.report-content', { duration: 0.6, y: 20, opacity: 0, ease: 'power2.out' });
    }, { scope: containerRef });

    const handleLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prev) => ({ ...prev, lat: latitude, lng: longitude }));

                    // Reverse geocoding to get address (Optional polish)
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        if (data && data.display_name) {
                            setFormData((prev) => ({ ...prev, address: data.display_name }));
                            toast.success('Location retrieved!');
                        } else {
                            setFormData((prev) => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                        }
                    } catch (error) {
                        setFormData((prev) => ({ ...prev, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    toast.error('Failed to get location. Please allow permissions.');
                    setLoading(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            toast.error('Geolocation is not supported by your browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('lat', formData.lat || 0);
        data.append('lng', formData.lng || 0);
        data.append('address', formData.address);
        if (file) {
            data.append('media', file);
        }

        try {
            await issueService.createIssue(data);
            toast.success('Issue reported successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Failed to report issue. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="max-w-2xl mx-auto report-content">
            <h1 className="text-3xl font-bold mb-8">Report an Issue</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                        placeholder="e.g. Large Pothole on Main St"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="Road">Road & Traffic</option>
                        <option value="Water">Water Supply</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Garbage">Garbage / Sanitation</option>
                        <option value="Streetlight">Streetlights</option>
                        <option value="Crime">Crime / Safety</option>
                        <option value="Fire">Fire / Emergency</option>
                        <option value="Medical">Medical / Ambulance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        required
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                        placeholder="Describe the issue in detail..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            readOnly
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600"
                            placeholder="Click 'Get GPS' ->"
                            value={formData.address}
                        />
                        <button
                            type="button"
                            onClick={handleLocation}
                            className="bg-blue-50 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition whitespace-nowrap"
                        >
                            Get GPS
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo/Video</label>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportIssue;
