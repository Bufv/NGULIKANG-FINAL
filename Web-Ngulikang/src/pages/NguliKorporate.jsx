import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import CorporateNegotiation from '../components/corporate/CorporateNegotiation';
import CorporatePayment from '../components/corporate/CorporatePayment';

const NguliKorporate = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentStep, setCurrentStep] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('step')) || 1;
    });

    // Handle Browser Back Button & Initial Load
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const step = parseInt(params.get('step')) || 1;
            setCurrentStep(step);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigateToStep = (step) => {
        const url = new URL(window.location);
        url.searchParams.set('step', step);
        window.history.pushState({}, '', url);
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Form State
    const [companyName, setCompanyName] = useState('');
    const [picName, setPicName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [projectDetails, setProjectDetails] = useState('');

    // Alert Modal State
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    const services = [
        {
            id: 1,
            title: "Office Fit-Out",
            rating: 4.8,
            tag: "AVAILABLE",
            description: "Renovasi total interior kantor, partisi, flooring, dan furniture custom.",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Building Maintenance",
            rating: 4.9,
            tag: "24/7 SUPPORT",
            description: "Kontrak perawatan rutin gedung, HVAC, perbaikan atap, dan sanitasi.",
            image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Instalasi MEP",
            rating: 5.0,
            tag: "ISO 9001",
            description: "Sistem kelistrikan industrial, plumbing, panel surya, dan fire protection.",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Industrial HVAC",
            rating: 4.7,
            tag: "SPECIALIST",
            description: "Instalasi dan maintenance AC sentral, chiller, dan ventilasi pabrik.",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            title: "Fire Protection",
            rating: 4.9,
            tag: "VITAL",
            description: "Sistem sprinkler, hydrant, dan alarm kebakaran untuk gedung tinggi.",
            image: "https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 6,
            title: "Data Center Build",
            rating: 5.0,
            tag: "HIGH TECH",
            description: "Konstruksi ruang server, raised floor, dan sistem cooling presisi.",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 7,
            title: "Warehouse Const.",
            rating: 4.8,
            tag: "HEAVY DUTY",
            description: "Pembangunan gudang struktur baja, lantai beton heavy duty, dan loading dock.",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 8,
            title: "Corp. Landscape",
            rating: 4.6,
            tag: "MAINTENANCE",
            description: "Desain dan perawatan taman kantor, vertical garden, dan area hijau.",
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 9,
            title: "Facade Cleaning",
            rating: 4.7,
            tag: "SAFETY FIRST",
            description: "Pembersihan kaca gedung bertingkat, perbaikan sealant, dan alumunium composite panel.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', color: 'white' }}>

            {/* BACKGROUND */}
            {/* BACKGROUND */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Particles count={40} color="#FF8C42" size={2} speed={0.3} />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '180px 20px 80px' }}>

                {/* STEP 1: LAYANAN & FORM */}
                {currentStep === 1 && (
                    <>
                        {/* HEADLINE */}
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}>
                                Layanan Prioritas Korporat
                            </h1>
                            <p style={{ color: '#aaa', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                                Solusi konstruksi end-to-end dengan dukungan Account Manager dedikasi dan legalitas lengkap
                            </p>
                        </div>

                        {/* SERVICES GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '80px' }}>
                            {services.slice(0, isExpanded ? services.length : 3).map((service) => (
                                <motion.div
                                    key={service.id}
                                    whileHover={{ y: -10 }}
                                    style={{
                                        background: '#111',
                                        borderRadius: '20px',
                                        border: '1px solid #333',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSelectedService(service.id)}
                                >
                                    {/* Image */}
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '24px' }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'white' }}>{service.title}</h3>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} style={{ color: '#FFC107', fontSize: '0.9rem' }}>★</span>
                                                ))}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>{service.rating}</span>
                                        </div>

                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            background: '#FF8C42',
                                            color: 'white',
                                            borderRadius: '100px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            marginBottom: '16px'
                                        }}>
                                            {service.tag}
                                        </div>

                                        <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                                            {service.description}
                                        </p>

                                        <button style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: selectedService === service.id ? '#FF8C42' : 'transparent',
                                            border: selectedService === service.id ? 'none' : '1px solid #FF8C42',
                                            borderRadius: '12px',
                                            color: selectedService === service.id ? 'white' : '#FF8C42',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}>
                                            {selectedService === service.id ? 'Terpilih' : 'Pilih Layanan'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* VIEW MORE TOGGLE */}
                        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #444',
                                    color: '#aaa',
                                    padding: '12px 30px',
                                    borderRadius: '100px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    margin: '0 auto',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => { e.target.style.borderColor = '#FF8C42'; e.target.style.color = '#FF8C42'; }}
                                onMouseOut={(e) => { e.target.style.borderColor = '#444'; e.target.style.color = '#aaa'; }}
                            >
                                {isExpanded ? 'Lihat Lebih Sedikit' : 'Lihat Lebih Banyak'}
                                <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                            </button>
                        </div>

                        {/* REQUEST FORM SECTION */}
                        <div style={{
                            background: '#131313',
                            borderRadius: '30px',
                            border: '1px solid #333',
                            padding: '60px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Formulir Pengajuan Korporat</h2>
                                <p style={{ color: '#888' }}>Lengkapi data perusahaan Anda untuk mendapatkan penawaran resmi</p>
                            </div>

                            <form>
                                {/* Row 1 */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Nama Perusahaan (PT/CV)</label>
                                        <input
                                            type="text"
                                            placeholder="PT. Contoh Inovasi"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            style={{
                                                width: '100%', height: '56px', background: '#222', border: '1px solid #333', borderRadius: '12px', padding: '0 20px', color: 'white', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Nama Penanggung Jawab (PIC)</label>
                                        <input
                                            type="text"
                                            placeholder="Nama Lengkap"
                                            value={picName}
                                            onChange={(e) => setPicName(e.target.value)}
                                            style={{
                                                width: '100%', height: '56px', background: '#222', border: '1px solid #333', borderRadius: '12px', padding: '0 20px', color: 'white', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Email Korporat</label>
                                        <input
                                            type="email"
                                            placeholder="procurement@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{
                                                width: '100%', height: '56px', background: '#222', border: '1px solid #333', borderRadius: '12px', padding: '0 20px', color: 'white', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Nomor WhatsApp / Kantor</label>
                                        <input
                                            type="tel"
                                            placeholder="0812..."
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            style={{
                                                width: '100%', height: '56px', background: '#222', border: '1px solid #333', borderRadius: '12px', padding: '0 20px', color: 'white', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Textarea */}
                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Lingkup Proyek & Lokasi</label>
                                    <textarea
                                        placeholder="Jelaskan detail kebutuhan renovasi atau maintenance, alamat proyek, dan estimasi waktu pengerjaan..."
                                        value={projectDetails}
                                        onChange={(e) => setProjectDetails(e.target.value)}
                                        style={{
                                            width: '100%', height: '150px', background: '#222', border: '1px solid #333', borderRadius: '12px', padding: '20px', color: 'white', outline: 'none', resize: 'vertical'
                                        }}
                                    ></textarea>
                                </div>

                                {/* Checkbox */}
                                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: '#FF4500',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}>✓</div>
                                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>Saya membutuhkan Faktur Pajak & Penawaran Resmi (PDF)</span>
                                </div>

                                {/* Button with Loading & Shine */}
                                <motion.button
                                    onClick={(e) => {
                                        e.preventDefault();

                                        // Validation
                                        if (!selectedService) {
                                            setAlertTitle('Pilih Layanan');
                                            setAlertMessage("Mohon pilih jenis layanan yang Anda butuhkan terlebih dahulu.");
                                            setShowAlert(true);
                                            return;
                                        }

                                        if (!companyName || !picName || !email || !phone || !projectDetails) {
                                            setAlertTitle('Data Belum Lengkap');
                                            setAlertMessage("Mohon lengkapi semua data formulir pengajuan korporat.");
                                            setShowAlert(true);
                                            return;
                                        }

                                        setIsSubmitting(true);
                                        setTimeout(() => {
                                            setIsSubmitting(false);
                                            setShowSuccessModal(true);
                                        }, 1500);
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '20px',
                                        background: 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                        color: 'white',
                                        borderRadius: '16px',
                                        fontWeight: 'bold',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        boxShadow: '0 10px 30px rgba(255, 140, 66, 0.3)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        {isSubmitting ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                            >
                                                <div style={{ width: '20px', height: '20px', border: '3px solid white', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                <span>Memproses Pengajuan...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="text"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                Kirim Permintaan & Negosiasi
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Shine Effect */}
                                    {!isSubmitting && (
                                        <motion.div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                transform: 'skewX(-20deg) translateX(-150%)'
                                            }}
                                            animate={{ translateX: '150%' }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                        />
                                    )}
                                </motion.button>
                                <style>{`
                                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                                `}</style>

                            </form>
                        </div>
                    </>
                )}

                {/* STEP 2: NEGOTIATION */}
                {currentStep === 2 && (
                    <CorporateNegotiation
                        onProceed={() => {
                            navigateToStep(3);
                        }}
                    />
                )}

                {/* STEP 3: PAYMENT */}
                {currentStep === 3 && (
                    <CorporatePayment
                        onPaymentComplete={() => {
                            setAlertTitle('Pembayaran Berhasil!');
                            setAlertMessage("Pembayaran diterima. Tim Korporat akan segera menghubungi Anda.");
                            setShowAlert(true);
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 3000);
                        }}
                        onBackToNegotiation={() => {
                            navigateToStep(2);
                        }}
                    />
                )}

                {/* SUCCESS MODAL */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 10002,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                style={{
                                    background: 'rgba(25, 25, 25, 0.65)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '40px',
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    maxWidth: '400px',
                                    width: '100%',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        background: '#4CAF50',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 20px rgba(76, 175, 80, 0.3)'
                                    }}
                                >
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </motion.div>

                                <div>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'white' }}>Pengajuan Berhasil!</h3>
                                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                                        Data perusahaan Anda telah kami terima. Silakan lanjut diskusi dengan Account Manager kami.
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigateToStep(2);
                                    }}
                                    style={{
                                        background: '#FF8C42',
                                        color: 'white',
                                        border: 'none',
                                        padding: '14px 32px',
                                        borderRadius: '100px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%',
                                        marginTop: '10px',
                                        boxShadow: '0 5px 15px rgba(255, 140, 66, 0.2)'
                                    }}
                                >
                                    Lanjut ke Negosiasi
                                </motion.button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ALERT MODAL */}
                <AnimatePresence>
                    {showAlert && (
                        <div
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 99999,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: 'rgba(30, 30, 30, 0.6)',
                                    backdropFilter: 'blur(15px)',
                                    borderRadius: '24px',
                                    padding: '40px',
                                    maxWidth: '500px',
                                    width: '90%',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>
                                    {alertTitle || "Peringatan"}
                                </h3>
                                <p style={{ fontSize: '1rem', color: '#aaa', lineHeight: '1.6', marginBottom: '30px' }}>
                                    {alertMessage}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAlert(false)}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'linear-gradient(135deg, #FF8C42, #FF6B00)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(255, 140, 66, 0.3)'
                                    }}
                                >
                                    OK, Mengerti
                                </motion.button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default NguliKorporate;
