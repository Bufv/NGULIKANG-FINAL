import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';

const CekLamaran = () => {
    const [appId, setAppId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Helper to get mock data
    const getMockData = (id) => {
        // Check if it matches recent
        const recentMatch = recentApplications.find(app => app.id === id);

        if (recentMatch) {
            return {
                id: recentMatch.id,
                jobTitle: recentMatch.name,
                applicantName: 'Budi Santoso',
                location: 'Jakarta',
                status: recentMatch.status,
                progress: recentMatch.status === 'Interview' ? 60 : recentMatch.status === 'Diterima' ? 100 : recentMatch.status === 'Ditolak' ? 100 : 30,
                applyDate: '28 Desember 2024',
                lastUpdate: recentMatch.lastUpdate,
                department: 'Operasional',
                recruiter: 'Tim HRD',
                steps: [
                    { title: 'Pendaftaran Berkas', date: '28 Des 2024', status: 'completed', desc: 'Berkas diterima.' },
                    { title: 'Verifikasi Admin', date: '30 Des 2024', status: 'completed', desc: 'Dokumen lengkap.' },
                    { title: 'Wawancara', date: '-', status: recentMatch.status === 'Interview' ? 'current' : recentMatch.status === 'Diterima' ? 'completed' : 'pending', desc: 'Sesi tanya jawab.' },
                    { title: 'Hasil Akhir', date: '-', status: recentMatch.status === 'Diterima' || recentMatch.status === 'Ditolak' ? 'completed' : 'pending', desc: `Status: ${recentMatch.status}` },
                ]
            };
        } else {
            return {
                id: id,
                jobTitle: 'Tukang Umum (Default)',
                applicantName: 'Pengguna Tamu',
                location: 'Lokasi Anda',
                status: 'Sedang Diproses',
                progress: 40,
                applyDate: 'Baru saja',
                lastUpdate: 'Hari ini',
                department: 'Umum',
                recruiter: 'Admin',
                steps: [
                    { title: 'Pendaftaran', date: 'Hari ini', status: 'completed', desc: 'Lamaran masuk.' },
                    { title: 'Review', date: 'Sedang berlangsung', status: 'current', desc: 'Sedang direview oleh tim.' },
                    { title: 'Keputusan', date: '-', status: 'pending', desc: 'Menunggu hasil.' }
                ]
            };
        }
    };

    // Handle URL Params & History
    React.useEffect(() => {
        const handleUrlChange = () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                setAppId(id);
                setSearchResult(getMockData(id));
            } else {
                setSearchResult(null);
                setAppId('');
            }
        };

        // Check on mount
        handleUrlChange();

        // Listen for popstate (Browser Back/Forward)
        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        const idToSearch = appId || 'APP-2024001';

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('id', idToSearch);
        window.history.pushState({}, '', url);

        // Simulate Delay then Show Data
        setTimeout(() => {
            setIsLoading(false);
            setSearchResult(getMockData(idToSearch));
        }, 1500);
    };

    const recentApplications = [
        { id: 'APP-2024001', name: 'Tukang Kayu Profesional', status: 'Interview', lastUpdate: '2 Jan 2025' },
        { id: 'APP-2023089', name: 'Mandor Lapangan', status: 'Ditolak', lastUpdate: '15 Nov 2024' },
        { id: 'APP-2024045', name: 'Tukang Cat Interior', status: 'Pending', lastUpdate: '10 Jan 2025' }
    ];

    const handleQuickSearch = (id) => {
        setAppId(id);
        // We can't just call handleSearch because state update (setAppId) might not be ready.
        // So we pass ID directly or use a timeout, but simpler to just trigger logic manually:
        setIsLoading(true);
        const url = new URL(window.location);
        url.searchParams.set('id', id);
        window.history.pushState({}, '', url);

        setTimeout(() => {
            setIsLoading(false);
            setSearchResult(getMockData(id));
        }, 1500);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: 'white', overflow: 'hidden' }}>

            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <img
                    src="https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=2070&auto=format&fit=crop"
                    alt="Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), #000)' }} />
                <Particles count={40} color="#FF8C42" size={2} speed={0.2} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '220px 20px 80px' }}>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '50px' }}
                >
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
                        Cek Status <span style={{ color: '#FF8C42' }}>Lamaran</span>
                    </h1>
                    <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto 30px' }}>
                        Pantau status seleksi karir Anda secara real-time. Masukkan ID Lamaran atau Email yang terdaftar.
                    </p>

                    <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Contoh: APP-2024001"
                            value={appId}
                            onChange={(e) => setAppId(e.target.value)}
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

                {/* Recent Applications Cards (Only show when no result is displayed) */}
                {!searchResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginTop: '60px' }}
                    >
                        <h3 style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888', marginBottom: '20px' }}>
                            Riwayat Pengecekan
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                            maxWidth: '900px',
                            margin: '0 auto'
                        }}>
                            {recentApplications.map((app, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleQuickSearch(app.id)}
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
                                        background: app.status === 'Interview' ? '#FF8C42' : app.status === 'Diterima' ? '#4CAF50' : app.status === 'Ditolak' ? '#EF4444' : '#888'
                                    }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>{app.id}</span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '100px',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: app.status === 'Interview' ? '#FF8C42' : app.status === 'Diterima' ? '#4CAF50' : app.status === 'Ditolak' ? '#EF4444' : '#ccc'
                                        }}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'white' }}>{app.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>
                                        Terakhir update: {app.lastUpdate}
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
                            {/* Application Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '4px' }}>ID Lamaran: {searchResult.id}</div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>{searchResult.jobTitle}</h2>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px', color: '#ccc', fontSize: '0.9rem' }}>
                                        <span>📍 {searchResult.location}</span>
                                        <span>👤 {searchResult.applicantName}</span>
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
                                        Melamar: {searchResult.applyDate}
                                    </div>
                                </div>
                            </div>

                            {/* Circular Progress & Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '40px', marginBottom: '50px' }}>
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
                                        Tahapan Seleksi
                                    </div>
                                </div>

                                {/* Right: Details */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Informasi Rekrutmen</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Departemen</div>
                                            <div style={{ fontWeight: 'bold' }}>{searchResult.department}</div>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Recruiter</div>
                                            <div style={{ fontWeight: 'bold' }}>{searchResult.recruiter}</div>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Tanggal Update</div>
                                            <div style={{ fontWeight: 'bold' }}>{searchResult.lastUpdate}</div>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Catatan</div>
                                            <div style={{ fontWeight: 'bold', color: '#FF8C42' }}>Cek email berkala</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                    Timeline Seleksi
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


            </div >
        </div >
    );
};

export default CekLamaran;
