import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CheckProgress = () => {
    const [orderId, setOrderId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Mock Data Result
            setSearchResult({
                id: orderId || 'PRJ-2024001',
                projectName: 'Renovasi Rumah Type 45',
                client: 'Bapak Budi',
                location: 'Tangerang Selatan',
                status: 'On Progress',
                progress: 65,
                startDate: '20 Desember 2024',
                estimatedEnd: '20 Januari 2025',
                team: 'Tim Konstruksi A',
                mandor: 'Pak Slamet',
                steps: [
                    { title: 'Survey & Pengukuran', date: '18 Des 2024', status: 'completed', desc: 'Tim melakukan pengukuran ulang dan finalisasi desain.' },
                    { title: 'Pembelian Material', date: '21 Des 2024', status: 'completed', desc: 'Material utama (Semen, Pasir, Bata) telah tiba di lokasi.' },
                    { title: 'Pengerjaan Dinding', date: '25 Des 2024', status: 'completed', desc: 'Pemasangan dinding bata merah selesai 80%.' },
                    { title: 'Pemasangan Atap', date: '2 Jan 2025', status: 'current', desc: 'Persiapan rangka atap baja ringan.' },
                    { title: 'Finishing & Cat', date: '-', status: 'pending', desc: 'Pengecatan dinding dan pemasangan keramik.' },
                    { title: 'Serah Terima', date: '-', status: 'pending', desc: 'Pemeriksaan akhir dan penyerahan kunci.' },
                ],
                recentPhotos: [
                    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80',
                    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80',
                    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400&q=80'
                ]
            });
        }, 1500);
    };

    const recentProjects = [
        { id: 'PRJ-2024001', name: 'Renovasi Rumah Type 45', status: 'On Progress', lastUpdate: '2 Jan 2025' },
        { id: 'PRJ-2023089', name: 'Pembangunan Ruko 2 Lantai', status: 'Completed', lastUpdate: '15 Nov 2024' },
        { id: 'PRJ-2024045', name: 'Perbaikan Atap & Bocor', status: 'Pending', lastUpdate: '10 Jan 2025' }
    ];

    const handleQuickSearch = (id) => {
        setOrderId(id);
        handleSearch({ preventDefault: () => { } });
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: 'white', overflow: 'hidden' }}>

            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80"
                    alt="Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), #000)' }} />
                <Particles count={40} color="#FF8C42" size={2} speed={0.2} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '120px 20px 80px' }}>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '50px' }}
                >
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
                        Cek Progres <span style={{ color: '#FF8C42' }}>Proyek</span>
                    </h1>
                    <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto 30px' }}>
                        Pantau perkembangan proyek Anda secara real-time. Masukkan ID Proyek atau Nomor Handphone yang terdaftar.
                    </p>

                    <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Contoh: PRJ-2024001"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '16px 24px',
                                borderRadius: '100px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: '16px 32px',
                                borderRadius: '100px',
                                border: 'none',
                                background: isLoading ? '#333' : '#FF8C42',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isLoading ? 'Mencari...' : 'Cari'}
                        </button>
                    </form>
                </motion.div>

                {/* Recent Projects Cards (Only show when no result is displayed) */}
                {!searchResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginTop: '60px' }}
                    >
                        <h3 style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888', marginBottom: '20px' }}>
                            Riwayat Pencarian Anda
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                            maxWidth: '900px',
                            margin: '0 auto'
                        }}>
                            {recentProjects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleQuickSearch(project.id)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '4px',
                                        height: '100%',
                                        background: project.status === 'On Progress' ? '#FF8C42' : project.status === 'Completed' ? '#4CAF50' : '#888'
                                    }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>{project.id}</span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '100px',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: project.status === 'On Progress' ? '#FF8C42' : project.status === 'Completed' ? '#4CAF50' : '#ccc'
                                        }}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'white' }}>{project.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>
                                        Terakhir update: {project.lastUpdate}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Result Section */}
                <AnimatePresence>
                    {searchResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            style={{
                                background: 'rgba(20, 20, 20, 0.6)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '24px',
                                padding: '40px',
                                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
                            }}
                        >
                            {/* Project Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '4px' }}>ID Proyek: {searchResult.id}</div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>{searchResult.projectName}</h2>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px', color: '#ccc', fontSize: '0.9rem' }}>
                                        <span>📍 {searchResult.location}</span>
                                        <span>👷 {searchResult.team} ({searchResult.mandor})</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '8px 16px',
                                        borderRadius: '100px',
                                        background: 'rgba(255, 140, 66, 0.15)',
                                        color: '#FF8C42',
                                        fontWeight: 'bold',
                                        border: '1px solid rgba(255, 140, 66, 0.3)',
                                        marginBottom: '10px'
                                    }}>
                                        {searchResult.status}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                        Est. Selesai: {searchResult.estimatedEnd}
                                    </div>
                                </div>
                            </div>

                            {/* Circular Progress & Photos */}
                            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', marginBottom: '50px' }}>
                                {/* Left: Progress Circle */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '20px' }}>
                                        <svg width="150" height="150" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                                            <motion.circle
                                                cx="50" cy="50" r="45"
                                                fill="none"
                                                stroke="#FF8C42"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: searchResult.progress / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                            />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                                            {searchResult.progress}%
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>
                                        Progress Keseluruhan
                                    </div>
                                </div>

                                {/* Right: Recent Photos */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Dokumentasi Terkini</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                        {searchResult.recentPhotos.map((photo, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                style={{
                                                    aspectRatio: '16/9',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <img src={photo} alt="Progress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                    Timeline Pengerjaan
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    {searchResult.steps.map((step, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                                            {/* Line */}
                                            {index !== searchResult.steps.length - 1 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '15px',
                                                    top: '35px',
                                                    bottom: '-25px',
                                                    width: '2px',
                                                    background: step.status === 'completed' ? '#FF8C42' : '#333'
                                                }} />
                                            )}

                                            {/* Icon */}
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: step.status === 'completed' ? '#FF8C42' : step.status === 'current' ? '#FF8C42' : '#222',
                                                border: step.status === 'current' ? '4px solid rgba(255,140,66,0.3)' : 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                zIndex: 2,
                                                boxShadow: step.status === 'completed' || step.status === 'current' ? '0 0 15px rgba(255,140,66,0.4)' : 'none'
                                            }}>
                                                {step.status === 'completed' ? '✓' : step.status === 'current' ? '⚡' : '•'}
                                            </div>

                                            {/* Content */}
                                            <div style={{ paddingBottom: '30px', flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: step.status === 'pending' ? '#666' : 'white' }}>
                                                        {step.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: step.status === 'current' ? '#FF8C42' : '#666' }}>
                                                        {step.date}
                                                    </div>
                                                </div>
                                                <div style={{ color: step.status === 'pending' ? '#444' : '#aaa', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                    {step.desc}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <Footer />
        </div>
    );
};

export default CheckProgress;
