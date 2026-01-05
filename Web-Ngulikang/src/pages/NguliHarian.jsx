import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import PaymentSection from '../components/pembayaran/PaymentSection';
import NegotiationSection from '../components/pembayaran/NegotiationSection';
import { apiGet } from '../lib/api';


const NguliHarian = () => {
    const [selectedPackage, setSelectedPackage] = useState(1);
    const [viewingReviews, setViewingReviews] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Form State (Adapted for Daily/Harian)
    const [jobType, setJobType] = useState('Pilih Jenis Pekerjaan');
    const [otherJobDetail, setOtherJobDetail] = useState(''); // New state for custom job input
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [duration, setDuration] = useState('Pilih Durasi');
    const [customDuration, setCustomDuration] = useState(''); // State to hold manual duration input
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const [workersCount, setWorkersCount] = useState('');

    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    // Steps & Flow State
    const [currentStep, setCurrentStep] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('step')) || 1;
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Alert Modal State
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

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

    // File Upload State
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [zoomedImage, setZoomedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            if (uploadedFiles.length + newFiles.length > 5) {
                setAlertTitle('Batas Foto Tercapai');
                setAlertMessage("Maksimal 5 foto yang diperbolehkan untuk diupload.");
                setShowAlert(true);
                return;
            }
            const filesWithPreviews = newFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setUploadedFiles(prev => [...prev, ...filesWithPreviews]);
        }
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const [teams, setTeams] = useState([]);

useEffect(() => {
  let alive = true;
  apiGet('/api/teams?service=harian')
    .then((data) => { if (alive) setTeams(data || []); })
    .catch(console.error);
  return () => { alive = false; };
}, []);


    const calculateTotalCost = () => {
        const team = teams.find(t => t.id === selectedPackage);
        if (!team) return 0;

        // Parse Price: "Rp 150rb/hari" -> 150000
        let pricePerDay = 0;
        if (team.price.toLowerCase().includes('rb')) {
            const num = parseInt(team.price.replace(/[^\d]/g, ''));
            pricePerDay = num * 1000;
        } else {
            pricePerDay = parseInt(team.price.replace(/[^\d]/g, ''));
        }

        // Parse Duration
        let days = 1;
        const dStr = duration === 'Lainnya' ? customDuration : duration;
        if (dStr && dStr !== 'Pilih Durasi') {
            const lower = dStr.toLowerCase();
            if (lower.includes('minggu')) days = (parseInt(lower) || 1) * 7;
            else if (lower.includes('bulan')) days = (parseInt(lower) || 1) * 30;
            else days = parseInt(lower) || 1;
        }

        return pricePerDay * days;
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', color: 'white' }}>

            {/* BACKGROUND: Particles + Image */}
            {/* BACKGROUND: Particles Only (Global BG) */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Particles count={60} color="#FF8C42" size={3} speed={0.5} />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '120px 20px 80px' }}>

                {/* 1. STEPPER */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px', marginTop: '40px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0',
                        background: 'rgba(30, 30, 30, 0.6)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '25px 50px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}>
                        {/* Step 1 */}
                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FF8C42', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto 8px', boxShadow: '0 0 20px rgba(255,140,66,0.4)' }}>1</div>
                            <div style={{ fontSize: '0.8rem', color: '#FF8C42', fontWeight: 'bold' }}>Pilih Tim</div>
                        </div>
                        <div style={{ width: '100px', height: '2px', background: '#444', margin: '0 15px', position: 'relative', top: '-14px' }}></div>

                        {/* Step 2 */}
                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: currentStep >= 2 ? '#FF8C42' : '#222',
                                border: currentStep >= 2 ? 'none' : '2px solid #444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                margin: '0 auto 8px',
                                color: currentStep >= 2 ? 'black' : '#777',
                                boxShadow: currentStep >= 2 ? '0 0 20px rgba(255,140,66,0.4)' : 'none'
                            }}>2</div>
                            <div style={{ fontSize: '0.8rem', color: currentStep >= 2 ? '#FF8C42' : '#777', fontWeight: currentStep >= 2 ? 'bold' : 'normal' }}>Negosiasi</div>
                        </div>
                        <div style={{ width: '100px', height: '2px', background: '#444', margin: '0 15px', position: 'relative', top: '-14px' }}></div>

                        {/* Step 3 */}
                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: currentStep >= 3 ? '#FF8C42' : '#222',
                                border: currentStep >= 3 ? 'none' : '2px solid #444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                margin: '0 auto 8px',
                                color: currentStep >= 3 ? 'black' : '#777'
                            }}>3</div>
                            <div style={{ fontSize: '0.8rem', color: '#777' }}>Pembangunan</div>
                        </div>
                    </div>
                </div>

                {/* CONDITIONAL RENDERING: Step 1 Content */}
                {currentStep === 1 && (
                    <>
                        {/* 2. HEADER TEXT */}
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>
                                Cari Tukang Harian Profesional
                            </h1>
                            <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
                                Temukan tukang spesialis untuk pekerjaan harian dengan tarif transparan dan hasil memuaskan.
                            </p>
                        </div>

                        {/* 3. CARDS SECTION */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                            {teams.slice(0, isExpanded ? teams.length : 3).map((team) => (
                                <motion.div
                                    key={team.id}
                                    whileHover={{ y: -10 }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        backdropFilter: 'blur(16px)',
                                        borderRadius: '24px',
                                        border: selectedPackage === team.id ? '2px solid #FF8C42' : '1px solid rgba(255, 255, 255, 0.08)',
                                        padding: '24px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        boxShadow: selectedPackage === team.id ? '0 20px 50px -10px rgba(255, 140, 66, 0.15)' : '0 4px 30px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {/* Header Card */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                        <img src={team.image} alt={team.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #333' }} />
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{team.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                <span style={{ color: '#FFC107' }}>★</span>
                                                <span style={{ color: '#eee', fontWeight: 'bold', fontSize: '0.9rem' }}>{team.rating}</span>
                                                <span style={{ color: '#666', fontSize: '0.8rem' }}>({team.reviews} Ulasan)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Member List */}
                                    <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Anggota Tim</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {team.members.map((m, idx) => (
                                                <div key={idx} style={{
                                                    fontSize: '0.8rem',
                                                    color: '#ccc',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedPackage === team.id ? '#FF8C42' : '#555' }}></span>
                                                    {m.name} <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>({m.role})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                        background: 'rgba(0,0,0,0.2)',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        marginBottom: '24px'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{team.projects}</div>
                                            <div style={{ color: '#666', fontSize: '0.75rem' }}>Proyek</div>
                                        </div>
                                        <div style={{ textAlign: 'center', borderLeft: '1px solid #333' }}>
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{team.price}</div>
                                            <div style={{ color: '#666', fontSize: '0.75rem' }}>Tarif Harian</div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setViewingReviews(team.id);
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: 'transparent',
                                                border: '1px solid #444',
                                                color: '#aaa',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseOut={(e) => e.target.style.background = 'transparent'}
                                        >
                                            Lihat Reviews
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPackage(team.id);
                                                setWorkersCount(team.members.length);
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: selectedPackage === team.id ? '#FF8C42' : '#333',
                                                border: 'none',
                                                color: selectedPackage === team.id ? 'white' : '#666',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontWeight: '700',
                                                boxShadow: selectedPackage === team.id ? '0 4px 15px rgba(255, 140, 66, 0.4)' : 'none'
                                            }}>
                                            Pilih Tim
                                        </button>
                                    </div>

                                    {team.isPopular && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: '#FF8C42',
                                            color: 'white',
                                            padding: '4px 16px',
                                            borderRadius: '100px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            boxShadow: '0 4px 10px rgba(255, 140, 66, 0.3)'
                                        }}>
                                            RECOMMENDED
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* SHOW MORE BUTTON */}
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #FF8C42',
                                    color: '#FF8C42',
                                    padding: '12px 32px',
                                    borderRadius: '100px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = '#FF8C42';
                                    e.target.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#FF8C42';
                                }}
                            >
                                {isExpanded ? 'Lihat Lebih Sedikit' : 'Lihat Tim Lainnya'}
                            </button>
                        </div>

                        {/* 4. FORM SECTION (DIFFERENT FOR HARIAN) */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: '30px',
                            padding: '40px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Detail Pekerjaan Harian</h2>
                                <p style={{ color: '#888' }}>Isi form untuk booking tim harian</p>
                            </div>

                            <form>
                                {/* Row 1: Jenis Pekerjaan & Durasi */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Jenis Pekerjaan</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                style={{
                                                    width: '100%',
                                                    height: '56px',
                                                    padding: '0 16px',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                {jobType}
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7, transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                            </div>

                                            <AnimatePresence>
                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '110%',
                                                            left: 0,
                                                            width: '100%',
                                                            background: 'rgba(20, 20, 20, 0.95)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            padding: '8px',
                                                            zIndex: 100
                                                        }}
                                                    >
                                                        {["Perbaikan Rumah Kecil", "Instalasi Listrik", "Mengecat Dinding", "Perbaikan Atap Bocor", "Pembersihan Taman", "Tukang Batu/Semen Harian", "Lainnya"].map((option) => (
                                                            <div
                                                                key={option}
                                                                onClick={() => {
                                                                    setJobType(option);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                style={{
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    color: jobType === option ? '#FF8C42' : '#ccc',
                                                                    background: jobType === option ? 'rgba(255, 140, 66, 0.1)' : 'transparent',
                                                                    marginBottom: '2px'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    if (jobType !== option) e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    if (jobType !== option) e.target.style.background = 'transparent';
                                                                }}
                                                            >
                                                                {option}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {/* Conditional Input for "Lainnya" */}
                                        <AnimatePresence>
                                            {jobType === 'Lainnya' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Sebutkan detail pekerjaan..."
                                                        value={otherJobDetail}
                                                        onChange={(e) => setOtherJobDetail(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            height: '56px',
                                                            padding: '0 16px',
                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            color: 'white',
                                                            outline: 'none',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Tenggat Waktu / Durasi</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                                style={{
                                                    width: '100%',
                                                    height: '56px',
                                                    padding: '0 16px',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                {duration}
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7, transform: isDurationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                            </div>

                                            <AnimatePresence>
                                                {isDurationDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '110%',
                                                            left: 0,
                                                            width: '100%',
                                                            background: 'rgba(20, 20, 20, 0.95)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            padding: '8px',
                                                            zIndex: 100
                                                        }}
                                                    >
                                                        {["1 Hari", "2 Hari", "3 Hari", "4 Hari", "5 Hari", "1 Minggu", "2 Minggu", "1 Bulan", "Lainnya"].map((option) => (
                                                            <div
                                                                key={option}
                                                                onClick={() => {
                                                                    setDuration(option);
                                                                    setIsDurationDropdownOpen(false);
                                                                }}
                                                                style={{
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    color: duration === option ? '#FF8C42' : '#ccc',
                                                                    background: duration === option ? 'rgba(255, 140, 66, 0.1)' : 'transparent',
                                                                    marginBottom: '2px'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    if (duration !== option) e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    if (duration !== option) e.target.style.background = 'transparent';
                                                                }}
                                                            >
                                                                {option}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {/* Conditional Input for "Lainnya" Duration */}
                                        <AnimatePresence>
                                            {duration === 'Lainnya' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Masukkan durasi (cth: 5 Hari)..."
                                                        value={customDuration}
                                                        onChange={(e) => setCustomDuration(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            height: '56px',
                                                            padding: '0 16px',
                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            color: 'white',
                                                            outline: 'none',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Row 2: Alamat */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Alamat Lokasi Pengerjaan</label>
                                    <input type="text" placeholder="Jl. Raya No. 123..." style={{ width: '100%', height: '56px', padding: '0 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                                </div>

                                {/* Row 3: Jumlah Pekerja & Tanggal Mulai */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>
                                            Jumlah Pekerja
                                            <span style={{ fontWeight: 'normal', color: '#666', marginLeft: '5px', fontSize: '0.8rem' }}>
                                                (Total: {teams.find(t => t.id === selectedPackage)?.members.length || 0} orang)
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            readOnly
                                            value={workersCount}
                                            style={{
                                                width: '100%',
                                                height: '56px',
                                                padding: '0 16px',
                                                background: '#222',
                                                border: '1px solid #333',
                                                borderRadius: '12px',
                                                color: '#888',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
                                            *Otomatis termasuk seluruh anggota tim {teams.find(t => t.id === selectedPackage)?.name}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Tanggal Mulai Pengerjaan</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setShowDatePicker(!showDatePicker)}
                                                style={{
                                                    width: '100%',
                                                    height: '56px',
                                                    padding: '0 16px',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    color: selectedDate ? 'white' : '#888',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                {selectedDate ? (() => {
                                                    const dStr = duration === 'Lainnya' ? customDuration : duration;
                                                    let days = 1;
                                                    if (dStr && dStr !== 'Pilih Durasi') {
                                                        const lower = dStr.toLowerCase();
                                                        if (lower.includes('minggu')) days = (parseInt(lower) || 1) * 7;
                                                        else if (lower.includes('bulan')) days = (parseInt(lower) || 1) * 30;
                                                        else days = parseInt(lower) || 1;
                                                    }
                                                    const end = new Date(selectedDate);
                                                    end.setDate(end.getDate() + days - 1);
                                                    return `${selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
                                                })() : 'Pilih Tanggal'}
                                                <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>📅</span>
                                            </div>

                                            <AnimatePresence>
                                                {showDatePicker && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '110%',
                                                            left: 0,
                                                            width: '320px',
                                                            background: '#1A1A1A',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '16px',
                                                            padding: '20px',
                                                            zIndex: 100,
                                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                                        }}
                                                    >
                                                        {/* Header */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); }}
                                                                style={{ background: 'transparent', border: '1px solid #333', color: '#ccc', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            >
                                                                ‹
                                                            </button>
                                                            <div style={{ fontWeight: 'bold', color: 'white' }}>
                                                                {viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); }}
                                                                style={{ background: 'transparent', border: '1px solid #333', color: '#ccc', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            >
                                                                ›
                                                            </button>
                                                        </div>

                                                        {/* Input Display & Today */}
                                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                                            <div style={{ flex: 1, padding: '8px 12px', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.9rem', background: '#222' }}>
                                                                {selectedDate ? selectedDate.toLocaleDateString() : 'DD / MM / YYYY'}
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); const now = new Date(); setSelectedDate(now); setViewDate(now); }}
                                                                style={{ padding: '8px 12px', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#ccc', fontSize: '0.8rem', cursor: 'pointer' }}
                                                            >
                                                                Today
                                                            </button>
                                                        </div>

                                                        {/* Days Grid */}
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                                <div key={d} style={{ color: '#666', fontSize: '0.75rem', paddingBottom: '8px' }}>{d}</div>
                                                            ))}

                                                            {/* Empty Slots */}
                                                            {Array(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay()).fill(null).map((_, i) => (
                                                                <div key={`empty-${i}`} />
                                                            ))}

                                                            {/* Days Logic */}
                                                            {Array(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()).fill(null).map((_, i) => {
                                                                const day = i + 1;
                                                                const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);

                                                                // CALCULATE DURATION & RANGE
                                                                let durationDays = 1;
                                                                const durationStr = duration === 'Lainnya' ? customDuration : duration;
                                                                if (durationStr) {
                                                                    const lower = durationStr.toLowerCase();
                                                                    if (lower.includes('minggu')) durationDays = (parseInt(lower) || 1) * 7;
                                                                    else if (lower.includes('bulan')) durationDays = (parseInt(lower) || 1) * 30;
                                                                    else durationDays = parseInt(lower) || 1;
                                                                }

                                                                let isInRange = false;
                                                                let isRangeStart = false;
                                                                let isRangeEnd = false;

                                                                if (selectedDate) {
                                                                    const start = new Date(selectedDate);
                                                                    start.setHours(0, 0, 0, 0);
                                                                    const current = new Date(date);
                                                                    current.setHours(0, 0, 0, 0);

                                                                    const end = new Date(start);
                                                                    end.setDate(start.getDate() + durationDays - 1);

                                                                    if (current.getTime() === start.getTime()) isRangeStart = true;
                                                                    if (current.getTime() === end.getTime()) isRangeEnd = true;
                                                                    if (current >= start && current <= end) isInRange = true;
                                                                }

                                                                return (
                                                                    <div
                                                                        key={day}
                                                                        onClick={() => {
                                                                            setSelectedDate(date);
                                                                        }}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '32px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            borderRadius: isRangeStart ? '50% 0 0 50%' : isRangeEnd ? '0 50% 50% 0' : isInRange ? '0' : '50%',
                                                                            cursor: 'pointer',
                                                                            background: (isRangeStart || isRangeEnd) ? '#FF8C42' : isInRange ? 'rgba(255, 140, 66, 0.3)' : 'transparent',
                                                                            color: (isRangeStart || isRangeEnd) ? 'white' : isInRange ? '#FFDBB5' : '#ccc',
                                                                            fontWeight: (isInRange) ? 'bold' : 'normal',
                                                                            fontSize: '0.9rem',
                                                                            transition: 'all 0.2s'
                                                                        }}
                                                                        onMouseOver={(e) => {
                                                                            if (!isInRange) e.target.style.background = '#333';
                                                                        }}
                                                                        onMouseOut={(e) => {
                                                                            if (!isInRange) e.target.style.background = 'transparent';
                                                                        }}
                                                                    >
                                                                        {day}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {selectedDate && (
                                                            <div style={{ marginTop: '4px', marginBottom: '8px', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                                                                Selesai: {(() => {
                                                                    const dStr = duration === 'Lainnya' ? customDuration : duration;
                                                                    let days = 1;
                                                                    if (dStr) {
                                                                        const lower = dStr.toLowerCase();
                                                                        if (lower.includes('minggu')) days = (parseInt(lower) || 1) * 7;
                                                                        else if (lower.includes('bulan')) days = (parseInt(lower) || 1) * 30;
                                                                        else days = parseInt(lower) || 1;
                                                                    }
                                                                    const end = new Date(selectedDate);
                                                                    end.setDate(end.getDate() + days - 1);
                                                                    return end.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                                                                })()}
                                                            </div>
                                                        )}

                                                        {/* Footer Buttons */}
                                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', borderTop: '1px solid #333', paddingTop: '16px' }}>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); setShowDatePicker(false); setSelectedDate(null); }}
                                                                style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#ccc', cursor: 'pointer', fontSize: '0.9rem' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); setShowDatePicker(false); }}
                                                                style={{ flex: 1, padding: '10px', background: '#FF8C42', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                                                            >
                                                                Apply
                                                            </button>
                                                        </div>

                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                {/* Catatan */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Catatan Tambahan untuk Tukang</label>
                                    <textarea rows="4" placeholder="Contoh: Tolong bawa tangga sendiri..." style={{ width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none', resize: 'vertical' }}></textarea>
                                </div>

                                {/* File Upload */}
                                {/* File Upload Section */}
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '4px' }}>
                                            Foto Properti/Rumah <span style={{ color: '#666', fontWeight: 'normal' }}>(Opsional)</span>
                                        </label>
                                        <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>
                                            Upload foto rumah atau area yang akan dikerjakan (Maksimal 5 foto, Format: JPG, PNG)
                                        </p>
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        multiple
                                        accept="image/png, image/jpeg, image/jpg"
                                    />

                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            border: '2px dashed rgba(255, 140, 66, 0.4)',
                                            borderRadius: '16px',
                                            padding: '40px',
                                            cursor: 'pointer',
                                            background: 'rgba(255, 140, 66, 0.02)',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 140, 66, 0.05)';
                                            e.currentTarget.style.borderColor = '#FF8C42';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 140, 66, 0.02)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.4)';
                                        }}
                                    >
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: 'rgba(255, 140, 66, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                        </div>
                                        <div style={{ fontWeight: '600', color: 'white' }}>Klik atau drag foto ke area ini untuk upload</div>
                                        <div style={{ color: '#666', fontSize: '0.8rem' }}>Ukuran maksimal 5MB per foto</div>
                                    </div>

                                    {/* File Previews */}
                                    {uploadedFiles.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                                            {uploadedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setZoomedImage(file.preview)}
                                                    style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'zoom-in' }}
                                                >
                                                    <img src={file.preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); removeFile(index); }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '2px',
                                                            right: '2px',
                                                            background: 'rgba(0,0,0,0.6)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '20px',
                                                            height: '20px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '12px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Order Information Section */}
                                <div style={{ marginBottom: '40px', position: 'relative' }}>
                                    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,140,66,0.3), transparent)', marginBottom: '30px' }}></div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: '#131313',
                                        padding: '0 15px',
                                        color: '#FF8C42',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}>
                                        INFORMASI PEMESANAN
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Nama Pemesan</label>
                                        <input type="text" placeholder="Nama Lengkap Anda" style={{ width: '100%', height: '56px', padding: '0 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Nomor WhatsApp</label>
                                        <input type="tel" placeholder="Contoh: 081234567890" style={{ width: '100%', height: '56px', padding: '0 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                </div>

                                <motion.button
                                    onClick={(e) => {
                                        e.preventDefault();

                                        // VALIDATION
                                        if (!jobType || jobType === 'Pilih Jenis Pekerjaan' || !duration || duration === 'Pilih Durasi' || !selectedDate) {
                                            setAlertTitle('Data Belum Lengkap!');
                                            setAlertMessage("Mohon lengkapi Jenis Pekerjaan, Durasi, dan Tanggal Mulai pengerjaan.");
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
                                    style={{
                                        width: '100%',
                                        padding: '20px',
                                        background: '#FF8C42',
                                        color: 'white',
                                        borderRadius: '16px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
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
                                                <span>Memproses...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="text"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                Kirim Permintaan Proyek
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
                {/* CONDITIONAL RENDERING: Step 2 Content (Negotiation) */}
                {currentStep === 2 && (
                    <NegotiationSection
                        team={teams.find(t => t.id === selectedPackage)}
                        initialOffer={calculateTotalCost()}
                        onProceed={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setCurrentStep(3);
                        }}
                    />
                )}

                {/* CONDITIONAL RENDERING: Step 3 Content (Payment) */}
                {currentStep === 3 && (
                    <PaymentSection
                        team={teams.find(t => t.id === selectedPackage)}
                        finalPrice={`Rp ${calculateTotalCost().toLocaleString('id-ID')}`}
                        projectType="Jasa Tukang Harian"
                        dpAmount={`Rp ${(calculateTotalCost() * 0.3).toLocaleString('id-ID')}`}
                        onPaymentComplete={() => {
                            setAlertTitle('Pembayaran Berhasil!');
                            setAlertMessage("Pembayaran diterima. Pekerja Harian akan segera datang sesuai jadwal.");
                            setShowAlert(true);
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 3000);
                        }}
                    />
                )}


                {/* SUCCESS MODAL */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 10002, // Highest z-index
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
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'white' }}>Berhasil!</h3>
                                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                                        Permintaan tukang harian Anda telah berhasil dikirim. Silakan lanjut ke tahap negosiasi.
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 140, 66, 0.3)' }}
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
            </div>
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
    );
};

export default NguliHarian;
