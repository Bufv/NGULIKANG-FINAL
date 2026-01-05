import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Particles from '../components/ui/Particles';
import PaymentSection from '../components/pembayaran/PaymentSection';
import NegotiationSection from '../components/pembayaran/NegotiationSection';
import { apiGet } from '../lib/api';

const NguliBorongan = ({ onNavigate }) => {
    const [selectedPackage, setSelectedPackage] = useState(1); // Default ke tengah (id 2) atau 1
    const [viewingReviews, setViewingReviews] = useState(null); // ID team yang sedang dilihat reviewnya
    const [isExpanded, setIsExpanded] = useState(false); // State untuk toggle lihat lainnya
    const [projectType, setProjectType] = useState("");
    const [customProjectType, setCustomProjectType] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [propertyType, setPropertyType] = useState("");
    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

    const [budgetRange, setBudgetRange] = useState("");
    const [isBudgetDropdownOpen, setIsBudgetDropdownOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    // File Upload State
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [zoomedImage, setZoomedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
    const [calculatedCost, setCalculatedCost] = useState(0);
    const [finalAgreedPrice, setFinalAgreedPrice] = useState(0);

    // Alert Modal State
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    // Step & Negotiation State
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

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // Limit to 5 files total
            if (uploadedFiles.length + newFiles.length > 5) {
                if (uploadedFiles.length + newFiles.length > 5) {
                    setAlertTitle('Batas Foto Tercapai');
                    setAlertMessage("Maksimal 5 foto yang diperbolehkan untuk diupload.");
                    setShowAlert(true);
                    return;
                }
            }
            // Generate preview URLs
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
        apiGet('/api/teams?service=borongan')
            .then((data) => { if (alive) setTeams(data || []); })
            .catch(console.error);
        return () => { alive = false; };
    }, []);


    const commonInputBase = {
        width: '100%',
        height: '52px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        outline: 'none'
    };

    const inputStyle = {
        ...commonInputBase,
        padding: '0 16px'
    };

    const dropdownStyle = {
        ...commonInputBase,
        padding: '0 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    // --- COST CALCULATION LOGIC ---
    const calculateEstimatedCost = () => {
        let baseCost = 0;
        // Base cost from budget range (taking average/conservative estimate)
        switch (budgetRange) {
            case "Kurang dari 50 Juta": baseCost = 35000000; break;
            case "50 Juta - 100 Juta": baseCost = 75000000; break;
            case "100 Juta - 300 Juta": baseCost = 185000000; break;
            case "300 Juta - 500 Juta": baseCost = 400000000; break;
            case "Di atas 500 Juta": baseCost = 750000000; break;
            default: baseCost = 0;
        }

        // Multipliers based on Project Type
        let multiplier = 1.0;
        switch (projectType) {
            case "Finishing & Penyelesaian (Cat, Keramik, Plafon)": multiplier = 0.8; break;
            case "Perbaikan Atap / Atasi Bocor": multiplier = 0.6; break;
            case "Pekerjaan Struktural (Cor Dak, Fondasi)": multiplier = 1.2; break; // More expensive
            case "Instalasi Sistem (Listrik, Plumbing, AC)": multiplier = 0.7; break;
            case "Perluasan / Tambah Ruangan": multiplier = 1.1; break;
            case "Upgrade Fasad / Eksterior Rumah": multiplier = 0.9; break;
            case "Lainnya": multiplier = 1.0; break;
            default: multiplier = 1.0;
        }

        // If baseCost is 0 (not selected), return 0
        if (baseCost === 0) return 0;

        return Math.round(baseCost * multiplier);
    };

    const handleProceedToStep2 = () => {
        // Validate Inputs
        if (!projectType || !propertyType || !budgetRange) {
            setAlertTitle('Data Belum Lengkap!');
            setAlertMessage("Harap lengkapi Jenis Proyek, Tipe Properti, dan Rencana Budget terlebih dahulu untuk melanjutkan.");
            setShowAlert(true);
            return;
        }

        const cost = calculateEstimatedCost();
        setCalculatedCost(cost);

        setIsSubmitting(true);
        // Simulate loading
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
        }, 2000);
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
                                Pilih Tim Tukang Terbaik untuk Proyek Anda
                            </h1>
                            <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
                                Bandingkan profil, lihat portofolio, dan pilih tim yang paling sesuai dengan kebutuhan proyek Anda. Transparan dan Profesional.
                            </p>
                        </div>

                        {/* 3. CARDS SECTION */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                            {teams.slice(0, isExpanded ? teams.length : 3).map((team) => (
                                <motion.div
                                    key={team.id}
                                    // onClick handler removed from here
                                    whileHover={{ y: -10 }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)', // MORE TRANSPARENT
                                        backdropFilter: 'blur(16px)', // Increased blur for better glass effect
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
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{team.experience}</div>
                                            <div style={{ color: '#666', fontSize: '0.75rem' }}>Pengalaman</div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card selection when clicking review
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
                                            onClick={() => setSelectedPackage(team.id)}
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

                                    {/* Popular Badge */}
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

                        {/* 4. FORM SECTION */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: '30px',
                            padding: '40px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                        }}>
                            {/* Global Scrollbar Style for Dropdowns */}
                            <style>{`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 6px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: rgba(0, 0, 0, 0.2);
                                    border-radius: 8px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: rgba(255, 140, 66, 0.5);
                                    border-radius: 8px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: rgba(255, 140, 66, 0.8);
                                }
                            `}</style>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Lengkapi Detail Proyek</h2>
                                <p style={{ color: '#888' }}>Informasi ini akan diteruskan langsung ke tim pilihan Anda.</p>
                            </div>

                            <form>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>Jenis Proyek Borongan</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                style={dropdownStyle}
                                            >
                                                {projectType || <span style={{ color: '#888' }}>Pilih jenis proyek borongan</span>}
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7, transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                            </div>

                                            <AnimatePresence>
                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '110%',
                                                            left: 0,
                                                            width: '100%',
                                                            maxHeight: '300px', // Limit height for long list
                                                            overflowY: 'auto',
                                                            background: 'rgba(20, 20, 20, 0.95)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            padding: '8px',
                                                            zIndex: 100,
                                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                                        }}
                                                        className="custom-scrollbar"
                                                    >
                                                        {[
                                                            "Finishing & Penyelesaian (Cat, Keramik, Plafon)",
                                                            "Perbaikan Atap / Atasi Bocor",
                                                            "Pekerjaan Struktural (Cor Dak, Fondasi)",
                                                            "Instalasi Sistem (Listrik, Plumbing, AC)",
                                                            "Perluasan / Tambah Ruangan",
                                                            "Upgrade Fasad / Eksterior Rumah",
                                                            "Lainnya"
                                                        ].map((option) => (
                                                            <motion.div
                                                                key={option}
                                                                layout
                                                                onClick={() => {
                                                                    setProjectType(option);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                whileHover={{ x: 5, backgroundColor: 'rgba(255, 140, 66, 0.15)', color: 'white' }}
                                                                whileTap={{ scale: 0.95 }}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                style={{
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    background: projectType === option ? 'rgba(255, 140, 66, 0.1)' : 'transparent',
                                                                    color: projectType === option ? '#FF8C42' : '#ccc',
                                                                    fontSize: '0.95rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between'
                                                                }}
                                                            >
                                                                {option}
                                                                {projectType === option && (
                                                                    <motion.span
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        style={{ color: '#FF8C42', fontWeight: 'bold' }}
                                                                    >
                                                                        ✓
                                                                    </motion.span>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {projectType === "Lainnya" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{ marginTop: '10px' }}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Tuliskan jenis pekerjaan yang Anda butuhkan..."
                                                    value={customProjectType}
                                                    onChange={(e) => setCustomProjectType(e.target.value)}
                                                    style={inputStyle}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>Tipe Properti</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                                                style={dropdownStyle}
                                            >
                                                {propertyType || <span style={{ color: '#888' }}>Pilih tipe properti</span>}
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7, transform: isPropertyDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                            </div>

                                            <AnimatePresence>
                                                {isPropertyDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '110%',
                                                            left: 0,
                                                            width: '100%',
                                                            maxHeight: '300px',
                                                            overflowY: 'auto',
                                                            background: 'rgba(20, 20, 20, 0.95)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            padding: '8px',
                                                            zIndex: 100,
                                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                                        }}
                                                        className="custom-scrollbar"
                                                    >
                                                        {["Rumah", "Ruko / Rukan", "Apartemen", "Kantor", "Gudang", "Kost-kostan"].map((option) => (
                                                            <motion.div
                                                                key={option}
                                                                layout
                                                                onClick={() => {
                                                                    setPropertyType(option);
                                                                    setIsPropertyDropdownOpen(false);
                                                                }}
                                                                whileHover={{ x: 5, backgroundColor: 'rgba(255, 140, 66, 0.15)', color: 'white' }}
                                                                whileTap={{ scale: 0.95 }}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                style={{
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    background: propertyType === option ? 'rgba(255, 140, 66, 0.1)' : 'transparent',
                                                                    color: propertyType === option ? '#FF8C42' : '#ccc',
                                                                    fontSize: '0.95rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between'
                                                                }}
                                                            >
                                                                {option}
                                                                {propertyType === option && (
                                                                    <motion.span
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        style={{ color: '#FF8C42', fontWeight: 'bold' }}
                                                                    >
                                                                        ✓
                                                                    </motion.span>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>Alamat Lengkap Proyek</label>
                                    <input type="text" placeholder="Jl. Mawar No. 123, Kel. Suka Maju..." style={inputStyle} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>Rencana Budget</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setIsBudgetDropdownOpen(!isBudgetDropdownOpen)}
                                                style={dropdownStyle}
                                            >
                                                {budgetRange || <span style={{ color: '#888' }}>Pilih range budget</span>}
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7, transform: isBudgetDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                            </div>

                                            <AnimatePresence>
                                                {isBudgetDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '110%',
                                                            left: 0,
                                                            width: '100%',
                                                            maxHeight: '300px',
                                                            overflowY: 'auto',
                                                            background: 'rgba(20, 20, 20, 0.95)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '12px',
                                                            padding: '8px',
                                                            zIndex: 100,
                                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                                        }}
                                                        className="custom-scrollbar"
                                                    >
                                                        {["Kurang dari 50 Juta", "50 Juta - 100 Juta", "100 Juta - 300 Juta", "300 Juta - 500 Juta", "Di atas 500 Juta"].map((option) => (
                                                            <motion.div
                                                                key={option}
                                                                layout
                                                                onClick={() => {
                                                                    setBudgetRange(option);
                                                                    setIsBudgetDropdownOpen(false);
                                                                }}
                                                                whileHover={{ x: 5, backgroundColor: 'rgba(255, 140, 66, 0.15)', color: 'white' }}
                                                                whileTap={{ scale: 0.95 }}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                style={{
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    background: budgetRange === option ? 'rgba(255, 140, 66, 0.1)' : 'transparent',
                                                                    color: budgetRange === option ? '#FF8C42' : '#ccc',
                                                                    fontSize: '0.95rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between'
                                                                }}
                                                            >
                                                                {option}
                                                                {budgetRange === option && (
                                                                    <motion.span
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        style={{ color: '#FF8C42', fontWeight: 'bold' }}
                                                                    >
                                                                        ✓
                                                                    </motion.span>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>Estimasi Mulai</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setShowDatePicker(!showDatePicker)}
                                                style={dropdownStyle}
                                            >
                                                {selectedDate ? selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih Tanggal'}
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

                                                            {/* Days */}
                                                            {Array(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()).fill(null).map((_, i) => {
                                                                const day = i + 1;
                                                                const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                                                                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

                                                                return (
                                                                    <div
                                                                        key={day}
                                                                        onClick={() => setSelectedDate(date)}
                                                                        style={{
                                                                            width: '32px',
                                                                            height: '32px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            borderRadius: '50%',
                                                                            cursor: 'pointer',
                                                                            background: isSelected ? '#FF8C42' : 'transparent',
                                                                            color: isSelected ? 'white' : '#ccc',
                                                                            fontSize: '0.9rem',
                                                                            transition: 'background 0.2s'
                                                                        }}
                                                                        onMouseOver={(e) => !isSelected && (e.target.style.background = '#333')}
                                                                        onMouseOut={(e) => !isSelected && (e.target.style.background = 'transparent')}
                                                                    >
                                                                        {day}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Footer */}
                                                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #333', paddingTop: '16px' }}>
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

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>Detail / Catatan Tambahan</label>
                                    <textarea rows="4" placeholder="Jelaskan keinginan spesifik Anda..." style={{ width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none', resize: 'vertical' }}></textarea>
                                </div>

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
                                            textAlign: 'center',
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
                                        background: '#131313', // Matches approximate background
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
                                        <input type="text" placeholder="Nama Lengkap Anda" style={{ width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Nomor WhatsApp</label>
                                        <input type="tel" placeholder="Contoh: 081234567890" style={{ width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none' }} />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleProceedToStep2();
                                    }}
                                    disabled={isSubmitting}
                                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 10px 30px rgba(255, 140, 66, 0.4)' } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                    style={{
                                        width: '100%',
                                        padding: '20px',
                                        background: isSubmitting ? '#333' : '#FF8C42',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '16px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'background 0.3s'
                                    }}
                                >
                                    <AnimatePresence mode='wait'>
                                        {isSubmitting ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                            >
                                                <motion.div
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        border: '3px solid rgba(255,255,255,0.3)',
                                                        borderTop: '3px solid white',
                                                        borderRadius: '50%'
                                                    }}
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                                <span>Mengirim...</span>
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
                            </form>
                        </div>
                    </>
                )}

                {/* CONDITIONAL RENDERING: Step 2 Content (Negotiation) */}
                {currentStep === 2 && (
                    <NegotiationSection
                        team={teams.find(t => t.id === selectedPackage)}
                        initialOffer={calculatedCost}
                        onProceed={(agreedPrice) => {
                            setFinalAgreedPrice(agreedPrice);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setCurrentStep(3);
                        }}
                    />
                )}

                {/* CONDITIONAL RENDERING: Step 3 Content (Payment) */}
                {currentStep === 3 && (
                    <PaymentSection
                        team={teams.find(t => t.id === selectedPackage)}
                        finalPrice={`Rp ${finalAgreedPrice.toLocaleString('id-ID')}`}
                        onPaymentComplete={() => {
                            setShowPaymentSuccessModal(true);
                        }}
                    />
                )}

                {/* REVIEWS MODAL */}
                {viewingReviews && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 10000, // Increased z-index to be above everything including header
                        background: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 20px 20px' // Added top padding
                    }} onClick={() => setViewingReviews(null)}>



                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="custom-scrollbar"
                            style={{
                                background: '#121212',
                                border: '1px solid #333',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '600px',
                                maxHeight: '85vh',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                position: 'relative',
                                overflow: 'hidden' // Hide default scroll on container, scroll content instead
                            }}
                        >
                            {/* Sticky Header */}
                            <div style={{
                                padding: '24px',
                                borderBottom: '1px solid #222',
                                background: 'rgba(18, 18, 18, 0.95)',
                                zIndex: 10,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: '800' }}>
                                        Ulasan: {teams.find(t => t.id === viewingReviews)?.name}
                                    </h3>
                                    <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ color: '#FFC107', fontSize: '1.1rem' }}>★</span>
                                        <span style={{ color: 'white', fontWeight: 'bold' }}>{teams.find(t => t.id === viewingReviews)?.rating}</span>
                                        <span>• {teams.find(t => t.id === viewingReviews)?.reviews} Total Ulasan</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingReviews(null)}
                                    style={{
                                        background: '#222',
                                        border: 'none',
                                        color: '#888',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => { e.target.style.background = '#333'; e.target.style.color = 'white'; }}
                                    onMouseOut={(e) => { e.target.style.background = '#222'; e.target.style.color = '#888'; }}
                                >&times;</button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="custom-scrollbar" style={{
                                padding: '24px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                {teams.find(t => t.id === viewingReviews)?.reviewsList.map((review, idx) => (
                                    <div key={idx} style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.03)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: `hsl(${Math.random() * 360}, 70%, 20%)`,
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {review.user.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: 'bold', color: '#e0e0e0' }}>{review.user}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} style={{ color: i < review.rating ? '#FFC107' : '#444', fontSize: '0.9rem' }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, color: '#aaa', lineHeight: '1.5', fontSize: '0.95rem' }}>"{review.comment}"</p>

                                        {/* REVIEW IMAGE */}
                                        {
                                            review.image && (
                                                <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <img src={review.image} alt="Hasil Proyek" style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover', display: 'block' }} />
                                                    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.4)', color: '#bbb', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                                        Lampiran Foto Proyek
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>


                        </motion.div>
                    </div >
                )}

                {/* ZOOMED IMAGE MODAL */}
                <AnimatePresence>
                    {zoomedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setZoomedImage(null)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 10001, // Highest z-index
                                background: 'rgba(0,0,0,0.95)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'zoom-out',
                                padding: '40px'
                            }}
                        >
                            <motion.img
                                src={zoomedImage}
                                alt="Zoomed"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                style={{
                                    maxWidth: '90vw',
                                    maxHeight: '90vh',
                                    borderRadius: '12px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                    cursor: 'default' // Prevent closing if clicking on image itself? Actually user usually expects to close on image too or just background. Let's make background close it, image doesn't need specific handler but we can stop propagation if we want image to NOT close it. But common lightbox behavior involves close buttons or background click. I will let background click close it.
                                }}
                                onClick={(e) => e.stopPropagation()} // Optional: click image to NOT close? Or maybe allow toggle. User asked for zoom.
                            />
                            <button
                                onClick={() => setZoomedImage(null)}
                                style={{
                                    position: 'absolute',
                                    top: '30px',
                                    right: '30px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                ✕
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                                        Permintaan proyek Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda.
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

                {/* PAYMENT SUCCESS MODAL */}
                <AnimatePresence>
                    {showPaymentSuccessModal && (
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
                                    background: 'rgba(20, 20, 20, 0.2)',
                                    backdropFilter: 'blur(25px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '40px',
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    maxWidth: '450px',
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
                                        background: 'rgba(76, 175, 80, 0.1)',
                                        border: '2px solid #4CAF50',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 30px rgba(76, 175, 80, 0.2)'
                                    }}
                                >
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </motion.div>

                                <div>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>Pembayaran Berhasil!</h3>
                                    <p style={{ margin: 0, color: '#a1a1aa', lineHeight: '1.6' }}>
                                        Terima kasih telah mempercayakan proyek Anda kepada kami. Dana Anda aman di Rekening Bersama.
                                    </p>
                                </div>

                                <div style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#71717a', marginBottom: '5px' }}>ID Transaksi</div>
                                    <div style={{ color: 'white', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px' }}>TRX-8829-PRO-2026</div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowPaymentSuccessModal(false);
                                        onNavigate('check-progress');
                                    }}
                                    style={{
                                        background: '#FF8C42',
                                        color: 'white',
                                        border: 'none',
                                        padding: '16px 32px',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%',
                                        marginTop: '10px',
                                        boxShadow: '0 10px 30px -5px rgba(255, 140, 66, 0.3)'
                                    }}
                                >
                                    Pantau Progres Proyek
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

export default NguliBorongan;
