import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import { lamaranApi } from '../lib/api';

const statusLabels = {
    pending: 'Pending',
    approved: 'Diterima',
    rejected: 'Ditolak'
};

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const CekLamaran = () => {
    const [lamaran, setLamaran] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadLamaran = async () => {
            setIsLoading(true);
            setError('');
            try {
                const { data } = await lamaranApi.getMyLamaran();
                if (!active) return;
                setLamaran(data.data);
            } catch (err) {
                if (!active) return;
                if (err.response?.status === 404) {
                    setError('Belum ada lamaran yang tersimpan untuk akun ini.');
                } else {
                    setError(err.response?.data?.message || 'Gagal memuat status lamaran.');
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadLamaran();
        return () => {
            active = false;
        };
    }, []);

    const statusLabel = statusLabels[lamaran?.status] || 'Pending';

    const progress = useMemo(() => {
        if (!lamaran) return 0;
        if (lamaran.status === 'approved' || lamaran.status === 'rejected') {
            return 100;
        }
        const steps = lamaran.timeline || [];
        if (!steps.length) return 30;
        const completed = steps.filter((step) => step.status === 'completed').length;
        return Math.min(90, Math.max(30, Math.round((completed / steps.length) * 100)));
    }, [lamaran]);

    const timelineSteps = useMemo(() => {
        return (lamaran?.timeline || []).map((item) => ({
            title: item.title,
            date: formatDate(item.eventDate),
            status: item.status,
            desc: item.description || ''
        }));
    }, [lamaran]);

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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '50px' }}
                >
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
                        Status <span style={{ color: '#FF8C42' }}>Lamaran</span>
                    </h1>
                    <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
                        Pantau proses seleksi karir Anda secara real-time berdasarkan akun yang sedang login.
                    </p>
                </motion.div>

                {isLoading && (
                    <div style={{ textAlign: 'center', color: '#aaa', fontSize: '1rem' }}>Memuat status lamaran...</div>
                )}

                {!isLoading && error && (
                    <div style={{ textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>{error}</div>
                )}

                <AnimatePresence>
                    {!isLoading && !error && lamaran && (
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
                                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '4px' }}>
                                        ID Lamaran: {lamaran.id}
                                    </div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>
                                        {lamaran.jobRoles?.join(', ') || 'Lamaran Tukang'}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px', color: '#ccc', fontSize: '0.9rem' }}>
                                        <span>📍 {lamaran.domicile || '-'}</span>
                                        <span>👤 {lamaran.fullName || '-'}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            padding: '8px 16px',
                                            borderRadius: '100px',
                                            background: 'rgba(255, 140, 66, 0.15)',
                                            color: '#FF8C42',
                                            fontWeight: 'bold',
                                            border: '1px solid rgba(255, 140, 66, 0.3)',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        {statusLabel}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                        Melamar: {formatDate(lamaran.submittedAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Circular Progress & Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '40px', marginBottom: '50px' }}>
                                {/* Left: Progress Circle */}
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '20px',
                                        padding: '30px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '20px' }}>
                                        <svg width="150" height="150" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                                            <motion.circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="#FF8C42"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: progress / 100 }}
                                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                            />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                                            {progress}%
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>Tahapan Seleksi</div>
                                </div>

                                {/* Right: Details */}
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Informasi Rekrutmen</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Departemen</div>
                                            <div style={{ fontWeight: 'bold' }}>{lamaran.department || '-'}</div>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Recruiter</div>
                                            <div style={{ fontWeight: 'bold' }}>{lamaran.recruiter || '-'}</div>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Tanggal Update</div>
                                            <div style={{ fontWeight: 'bold' }}>{formatDate(lamaran.updatedAt || lamaran.submittedAt)}</div>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Catatan</div>
                                            <div style={{ fontWeight: 'bold', color: '#FF8C42' }}>{lamaran.note || 'Cek email berkala'}</div>
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
                                    {timelineSteps.map((step, index) => (
                                        <div key={`${step.title}-${index}`} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                                            {/* Line */}
                                            {index !== timelineSteps.length - 1 && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        left: '15px',
                                                        top: '35px',
                                                        bottom: '-25px',
                                                        width: '2px',
                                                        background: step.status === 'completed' ? '#FF8C42' : '#333'
                                                    }}
                                                />
                                            )}

                                            {/* Icon */}
                                            <div
                                                style={{
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
                                                }}
                                            >
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
        </div>
    );
};

export default CekLamaran;
