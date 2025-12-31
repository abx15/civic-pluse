import { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import sosService from '../services/sosService';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SOSScreen = () => {
    const socket = useContext(SocketContext);
    const [activeAlert, setActiveAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusLog, setStatusLog] = useState([]);

    useGSAP(() => {
        gsap.to('.sos-pulse-ring', {
            scale: 2,
            opacity: 0,
            duration: 2,
            repeat: -1,
            ease: "circ.out"
        });
    });

    useEffect(() => {
        if (!socket) return;

        socket.on('sos-resolved', (updatedSOS) => {
            if (activeAlert && activeAlert._id === updatedSOS._id) {
                setActiveAlert(updatedSOS);
                setStatusLog(prev => [...prev, { time: new Date(), msg: 'Emergency Resolved by Authority' }]);
            }
        });

        socket.on('authority-accepted', (updatedSOS) => {
            if (activeAlert && activeAlert._id === updatedSOS._id) {
                setActiveAlert(updatedSOS);
                setStatusLog(prev => [...prev, { time: new Date(), msg: `Authority Assigned: ${updatedSOS.assignedTo?.name}` }]);
            }
        });

        return () => {
            socket.off('sos-resolved');
            socket.off('authority-accepted');
        };
    }, [socket, activeAlert]);

    const handleSOS = async (type) => {
        if (!confirm(`Are you sure you want to report a ${type} emergency?`)) return;

        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const data = await sosService.createSOS({
                    type,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: "GPS Location"
                });
                setActiveAlert(data);
                setStatusLog([{ time: new Date(), msg: 'SOS Alert Sent to High Command' }]);
            } catch (error) {
                alert('Failed to send SOS');
            } finally {
                setLoading(false);
            }
        }, () => {
            alert('Location permission required for SOS');
            setLoading(false);
        });
    };

    if (activeAlert && activeAlert.status !== 'resolved') {
        return (
            <div className="max-w-md mx-auto mt-10 text-center">
                <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>

                    <h2 className="text-3xl font-black text-red-700 mb-2">SOS ACTIVE</h2>
                    <p className="text-red-600 font-medium mb-8 animate-pulse">Help is on the way</p>

                    <div className="w-32 h-32 bg-red-600 rounded-full mx-auto flex items-center justify-center mb-8 shadow-red-300 shadow-xl relative">
                        <div className="sos-pulse-ring absolute w-full h-full bg-red-600 rounded-full z-0"></div>
                        <span className="text-white font-bold text-4xl relative z-10">{activeAlert.type === 'medical' ? '🚑' : activeAlert.type === 'fire' ? '🚒' : '🚓'}</span>
                    </div>

                    <div className="text-left space-y-4 bg-white p-4 rounded-xl border border-red-100 min-h-[150px]">
                        {statusLog.map((log, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                                <span className="text-gray-400 font-mono text-xs">{log.time.toLocaleTimeString()}</span>
                                <span className="font-medium text-gray-800">{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-4xl font-black text-center mb-4">EMERGENCY SOS</h1>
            <p className="text-center text-gray-500 mb-12">Pressing any button below will instantly alert authorities with your live location.</p>

            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                    onClick={() => handleSOS('accident')}
                    className="aspect-square bg-red-100 rounded-3xl flex flex-col items-center justify-center hover:bg-red-600 hover:text-white transition-all group shadow-sm hover:shadow-red-200 hover:shadow-2xl border-2 border-transparent hover:border-red-700"
                >
                    <span className="text-6xl mb-4 grayscale group-hover:grayscale-0 transition">🚗</span>
                    <span className="font-bold text-xl uppercase tracking-wider">Accident</span>
                </button>

                <button
                    onClick={() => handleSOS('medical')}
                    className="aspect-square bg-blue-50 rounded-3xl flex flex-col items-center justify-center hover:bg-blue-600 hover:text-white transition-all group shadow-sm hover:shadow-blue-200 hover:shadow-2xl border-2 border-transparent hover:border-blue-700"
                >
                    <span className="text-6xl mb-4 grayscale group-hover:grayscale-0 transition">🚑</span>
                    <span className="font-bold text-xl uppercase tracking-wider">Medical</span>
                </button>

                <button
                    onClick={() => handleSOS('fire')}
                    className="aspect-square bg-orange-50 rounded-3xl flex flex-col items-center justify-center hover:bg-orange-600 hover:text-white transition-all group shadow-sm hover:shadow-orange-200 hover:shadow-2xl border-2 border-transparent hover:border-orange-700"
                >
                    <span className="text-6xl mb-4 grayscale group-hover:grayscale-0 transition">🔥</span>
                    <span className="font-bold text-xl uppercase tracking-wider">Fire</span>
                </button>

                <button
                    onClick={() => handleSOS('crime')}
                    className="aspect-square bg-gray-100 rounded-3xl flex flex-col items-center justify-center hover:bg-gray-800 hover:text-white transition-all group shadow-sm hover:shadow-gray-300 hover:shadow-2xl border-2 border-transparent hover:border-black"
                >
                    <span className="text-6xl mb-4 grayscale group-hover:grayscale-0 transition">👮</span>
                    <span className="font-bold text-xl uppercase tracking-wider">Crime</span>
                </button>
            </div>
        </div>
    );
};

export default SOSScreen;
