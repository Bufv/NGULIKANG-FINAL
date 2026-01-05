import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';

const NguliPremium = () => {
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [currentStep, setCurrentStep] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('step')) || 1;
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const consultationPackages = [
        {
            id: 1,
            name: "Basic Consultation",
            price: "Rp 2.500.000",
            duration: "2 Jam",
            features: [
                "Konsultasi desain dasar",
                "Estimasi biaya proyek",
                "Rekomendasi material",
                "1x Revisi konsep"
            ],
            badge: "01",
            popular: false
        },
        {
            id: 2,
            name: "Professional Package",
            price: "Rp 7.500.000",
            duration: "1 Minggu",
            features: [
                "Desain lengkap 3D",
                "RAB detail & tender",
                "Site visit & analisa",
                "Pengawasan tahap awal",
                "3x Revisi desain",
                "Koordinasi kontraktor"
            ],
            badge: "02",
            popular: true
        },
        {
            id: 3,
            name: "Expert Full Service",
            price: "Rp 25.000.000",
            duration: "Full Project",
            features: [
                "Semua fitur Professional",
                "Pengawasan proyek penuh",
                "Quality control harian",
                "Legal & perizinan",
                "Unlimited revisi",
                "After-sales support 1 tahun"
            ],
            badge: "03",
            popular: false
        }
    ];

    const consultants = [
        {
            id: 1,
            name: "Ir. Ahmad Hidayat, IAI",
            title: "Senior Architect",
            specialization: "Residential & Commercial Design",
            experience: "15+ Tahun",
            projects: "200+ Proyek",
            rating: 4.9,
            reviews: 87,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            achievements: ["IAI Certified", "Green Building Expert", "LEED AP"],
            bio: "Spesialis desain modern minimalis dengan fokus pada efisiensi ruang dan keberlanjutan."
        },
        {
            id: 2,
            name: "Arch. Maya Kusuma, S.Ars",
            title: "Creative Director",
            specialization: "Luxury Interior & Facade",
            experience: "12+ Tahun",
            projects: "150+ Proyek",
            rating: 5.0,
            reviews: 64,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
            achievements: ["Best Designer 2023", "International Award Winner", "IAI Member"],
            bio: "Ahli dalam menciptakan ruang mewah yang fungsional dengan sentuhan artistik kontemporer."
        },
        {
            id: 3,
            name: "Ir. Budi Santoso, M.T.",
            title: "Structural Consultant",
            specialization: "Engineering & Safety Analysis",
            experience: "20+ Tahun",
            projects: "300+ Proyek",
            rating: 4.8,
            reviews: 103,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
            achievements: ["PII Certified", "Earthquake Expert", "High-Rise Specialist"],
            bio: "Konsultan struktur berpengalaman untuk bangunan bertingkat dan area rawan gempa."
        },
        {
            id: 4,
            name: "Siti Nurhaliza, S.T., M.Sc.",
            title: "Interior Designer",
            specialization: "Residential & Hospitality",
            experience: "10+ Tahun",
            projects: "120+ Proyek",
            rating: 4.9,
            reviews: 76,
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
            achievements: ["HDII Member", "Hospitality Design Expert", "Top 10 Designer"],
            bio: "Kreator interior yang mengutamakan kenyamanan dan estetika dengan budget yang efisien."
        },
        {
            id: 5,
            name: "Arch. Rizky Pratama, IAI",
            title: "Landscape Architect",
            specialization: "Garden & Outdoor Space",
            experience: "8+ Tahun",
            projects: "90+ Proyek",
            rating: 4.7,
            reviews: 52,
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
            achievements: ["IALI Certified", "Sustainable Landscape", "Urban Garden Specialist"],
            bio: "Spesialis landscape tropis dan urban farming dengan pendekatan ramah lingkungan."
        },
        {
            id: 6,
            name: "Ir. Dian Puspita, M.Eng.",
            title: "MEP Consultant",
            specialization: "Mechanical, Electrical & Plumbing",
            experience: "14+ Tahun",
            projects: "180+ Proyek",
            rating: 4.8,
            reviews: 69,
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
            achievements: ["PII Certified", "Energy Efficiency Expert", "Smart Building"],
            bio: "Ahli MEP dengan fokus pada sistem hemat energi dan teknologi smart home."
        },
        {
            id: 7,
            name: "Andi Wijaya, S.T., QS",
            title: "Quantity Surveyor",
            specialization: "Cost Estimation & Budget Control",
            experience: "11+ Tahun",
            projects: "160+ Proyek",
            rating: 4.9,
            reviews: 81,
            image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80",
            achievements: ["RICS Member", "Cost Management Expert", "Value Engineering"],
            bio: "Quantity surveyor berpengalaman dalam optimasi budget dan cost control proyek."
        },
        {
            id: 8,
            name: "Dr. Ir. Rini Setyowati",
            title: "Building Physics Expert",
            specialization: "Thermal & Acoustic Design",
            experience: "18+ Tahun",
            projects: "140+ Proyek",
            rating: 5.0,
            reviews: 45,
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
            achievements: ["PhD Building Science", "Thermal Comfort Specialist", "Acoustic Expert"],
            bio: "Pakar building physics untuk kenyamanan termal dan akustik pada bangunan tropis."
        },
        {
            id: 9,
            name: "Faisal Rahman, PMP",
            title: "Project Manager",
            specialization: "Construction Management",
            experience: "16+ Tahun",
            projects: "220+ Proyek",
            rating: 4.8,
            reviews: 94,
            image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80",
            achievements: ["PMP Certified", "Agile Construction", "Risk Management"],
            bio: "Project manager profesional dengan track record sukses dalam deliver proyek tepat waktu."
        }
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: 'white', overflow: 'hidden' }}>

            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Particles count={50} color="#FF8C42" size={2} speed={0.2} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '180px 20px 80px' }}>

                {/* STEP 1: PACKAGES & CONSULTANTS */}
                {currentStep === 1 && (
                    <>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}
                            >
                                <span style={{ color: '#FF8C42' }}>Premium</span> Consultation
                            </motion.h1>
                            <p style={{ color: '#aaa', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                                Konsultasi langsung dengan arsitek & kontraktor terbaik untuk proyek impian Anda
                            </p>
                        </div>

                        {/* Consultation Packages */}
                        <div style={{ marginBottom: '100px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
                                Pilih Paket Konsultasi
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                                {consultationPackages.map((pkg) => (
                                    <motion.div
                                        key={pkg.id}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        onClick={() => setSelectedPackage(pkg.id)}
                                        style={{
                                            background: selectedPackage === pkg.id
                                                ? 'rgba(255, 140, 66, 0.08)'
                                                : 'rgba(26, 26, 26, 0.4)',
                                            backdropFilter: 'blur(12px)',
                                            border: selectedPackage === pkg.id ? '2px solid #FF8C42' : '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '20px',
                                            padding: '35px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: pkg.popular ? '0 15px 40px rgba(255, 140, 66, 0.15)' : '0 8px 25px rgba(0,0,0,0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {pkg.popular && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '16px',
                                                right: '-35px',
                                                background: 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                                color: 'white',
                                                padding: '6px 45px',
                                                transform: 'rotate(45deg)',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 10px rgba(255, 140, 66, 0.3)'
                                            }}>
                                                TERPOPULER
                                            </div>
                                        )}

                                        <div style={{
                                            width: '70px',
                                            height: '70px',
                                            background: selectedPackage === pkg.id
                                                ? 'linear-gradient(135deg, #FF8C42, #FF6B00)'
                                                : 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '24px',
                                            fontSize: '1.8rem',
                                            fontWeight: '800',
                                            color: selectedPackage === pkg.id ? 'white' : '#666',
                                            boxShadow: selectedPackage === pkg.id
                                                ? '0 8px 20px rgba(255, 140, 66, 0.3)'
                                                : '0 4px 10px rgba(0,0,0,0.2)',
                                            transition: 'all 0.3s ease',
                                            border: selectedPackage === pkg.id ? 'none' : '2px solid #333'
                                        }}>
                                            {pkg.badge}
                                        </div>

                                        <h3 style={{
                                            fontSize: '1.4rem',
                                            fontWeight: 'bold',
                                            marginBottom: '12px',
                                            color: 'white'
                                        }}>
                                            {pkg.name}
                                        </h3>

                                        <div style={{
                                            color: selectedPackage === pkg.id ? '#FF8C42' : '#FF8C42',
                                            fontSize: '1.8rem',
                                            fontWeight: '800',
                                            marginBottom: '8px',
                                            fontFamily: 'system-ui'
                                        }}>
                                            {pkg.price}
                                        </div>

                                        <div style={{
                                            color: '#888',
                                            fontSize: '0.85rem',
                                            marginBottom: '24px',
                                            paddingBottom: '24px',
                                            borderBottom: '1px solid #2a2a2a'
                                        }}>
                                            ⏱️ {pkg.duration}
                                        </div>

                                        <div>
                                            {pkg.features.map((feature, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '10px',
                                                    marginBottom: '10px',
                                                    color: '#ccc',
                                                    fontSize: '0.9rem',
                                                    lineHeight: '1.5'
                                                }}>
                                                    <span style={{
                                                        color: '#FF8C42',
                                                        fontSize: '1.1rem',
                                                        marginTop: '2px'
                                                    }}>✓</span>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Consultants Selection */}
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
                                Pilih Konsultan Terbaik
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                                {consultants.map((consultant) => (
                                    <motion.div
                                        key={consultant.id}
                                        whileHover={{ y: -8 }}
                                        onClick={() => setSelectedConsultant(consultant.id)}
                                        style={{
                                            background: selectedConsultant === consultant.id ? 'rgba(255, 140, 66, 0.08)' : 'rgba(26, 26, 26, 0.4)',
                                            backdropFilter: 'blur(12px)',
                                            border: selectedConsultant === consultant.id ? '2px solid #FF8C42' : '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: selectedConsultant === consultant.id ? '0 10px 30px rgba(255, 140, 66, 0.2)' : '0 8px 25px rgba(0,0,0,0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ height: '250px', overflow: 'hidden' }}>
                                            <img src={consultant.image} alt={consultant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        <div style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>{consultant.name}</h3>
                                            <div style={{ color: '#FF8C42', fontSize: '0.9rem', marginBottom: '15px' }}>{consultant.title}</div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                                                <div style={{ display: 'flex' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} style={{ color: '#FF8C42', fontSize: '0.9rem' }}>★</span>
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '0.85rem', color: '#888' }}>{consultant.rating} ({consultant.reviews} reviews)</span>
                                            </div>

                                            <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px' }}>
                                                {consultant.specialization}
                                            </div>

                                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.8rem', color: '#888' }}>
                                                <div>📅 {consultant.experience}</div>
                                                <div>🏗️ {consultant.projects}</div>
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
                                                {consultant.achievements.map((ach, idx) => (
                                                    <span key={idx} style={{
                                                        background: 'rgba(255, 140, 66, 0.2)',
                                                        color: '#FF8C42',
                                                        padding: '3px 8px',
                                                        borderRadius: '100px',
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        {ach}
                                                    </span>
                                                ))}
                                            </div>

                                            <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: '1.5', marginBottom: '20px' }}>
                                                {consultant.bio}
                                            </p>

                                            <button style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: selectedConsultant === consultant.id ? 'linear-gradient(45deg, #FF8C42, #FF6B00)' : 'transparent',
                                                border: selectedConsultant === consultant.id ? 'none' : '1px solid #FF8C42',
                                                borderRadius: '12px',
                                                color: selectedConsultant === consultant.id ? 'white' : '#FF8C42',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: selectedConsultant === consultant.id ? '0 4px 15px rgba(255, 140, 66, 0.3)' : 'none'
                                            }}>
                                                {selectedConsultant === consultant.id ? 'Terpilih ✓' : 'Pilih Konsultan'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ textAlign: 'center', marginTop: '60px' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (!selectedPackage || !selectedConsultant) {
                                        setAlertTitle('Pilihan Belum Lengkap');
                                        setAlertMessage('Silakan pilih Paket Konsultasi dan Konsultan terlebih dahulu untuk melanjutkan.');
                                        setShowAlert(true);
                                        return;
                                    }
                                    navigateToStep(2);
                                }}
                                disabled={!selectedPackage || !selectedConsultant}
                                style={{
                                    background: (!selectedPackage || !selectedConsultant) ? '#555' : 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                    color: (!selectedPackage || !selectedConsultant) ? '#888' : 'white',
                                    border: 'none',
                                    padding: '20px 60px',
                                    borderRadius: '100px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: (!selectedPackage || !selectedConsultant) ? 'not-allowed' : 'pointer',
                                    boxShadow: (!selectedPackage || !selectedConsultant) ? 'none' : '0 10px 30px rgba(255, 140, 66, 0.3)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                Lanjut ke Pembayaran
                            </motion.button>
                        </div>
                    </>
                )}

                {/* STEP 2: PAYMENT */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
                                Pembayaran Konsultasi
                            </h2>
                            <p style={{ color: '#888', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                                Selesaikan pembayaran untuk memulai konsultasi dengan ahli pilihan Anda
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '50px', maxWidth: '1300px', margin: '0 auto' }}>
                            {/* Left: Payment Methods */}
                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '25px', color: 'white' }}>Metode Pembayaran</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { name: 'Bank Transfer', icon: '🏦', desc: 'Transfer via BCA, Mandiri, BNI' },
                                        { name: 'E-Wallet', icon: '💳', desc: 'GoPay, OVO, Dana, LinkAja' },
                                        { name: 'Virtual Account', icon: '🏧', desc: 'Bayar via ATM atau m-banking' },
                                        { name: 'Credit Card', icon: '💰', desc: 'Visa, Mastercard, JCB' }
                                    ].map((method, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.01, y: -2 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setSelectedPaymentMethod(idx)}
                                            style={{
                                                background: selectedPaymentMethod === idx
                                                    ? 'rgba(255, 140, 66, 0.1)'
                                                    : 'rgba(26, 26, 26, 0.4)',
                                                backdropFilter: 'blur(12px)',
                                                border: selectedPaymentMethod === idx
                                                    ? '2px solid #FF8C42'
                                                    : '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: '16px',
                                                padding: '22px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '18px',
                                                transition: 'all 0.2s ease',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '20px',
                                                transform: 'translateY(-50%)',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: selectedPaymentMethod === idx ? '2px solid #FF8C42' : '2px solid #666',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                {selectedPaymentMethod === idx && (
                                                    <div style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#FF8C42'
                                                    }} />
                                                )}
                                            </div>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                background: selectedPaymentMethod === idx
                                                    ? 'linear-gradient(135deg, #FF8C42, #FF6B00)'
                                                    : 'rgba(255, 140, 66, 0.2)',
                                                borderRadius: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.6rem',
                                                flexShrink: 0
                                            }}>
                                                {method.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontWeight: 'bold',
                                                    marginBottom: '5px',
                                                    fontSize: '1.05rem',
                                                    color: selectedPaymentMethod === idx ? '#FF8C42' : 'white'
                                                }}>
                                                    {method.name}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.4' }}>
                                                    {method.desc}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div style={{
                                    marginTop: '30px',
                                    padding: '20px',
                                    background: 'rgba(66, 133, 244, 0.1)',
                                    border: '1px solid rgba(66, 133, 244, 0.3)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px'
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>🔒</span>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '0.9rem' }}>
                                            Transaksi Aman & Terenkripsi
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: '1.5' }}>
                                            Data pembayaran Anda dilindungi dengan enkripsi SSL 256-bit
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div style={{
                                background: 'rgba(26, 26, 26, 0.4)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '20px',
                                padding: '32px',
                                height: 'fit-content',
                                position: 'sticky',
                                top: '120px'
                            }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '25px' }}>Ringkasan Pesanan</h3>

                                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>Paket Dipilih:</div>
                                    <div style={{ fontWeight: 'bold', color: '#FF8C42' }}>
                                        {consultationPackages.find(p => p.id === selectedPackage)?.name}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '4px' }}>
                                        {consultationPackages.find(p => p.id === selectedPackage)?.duration}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>Konsultan:</div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {consultants.find(c => c.id === selectedConsultant)?.name}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#FF8C42', marginTop: '4px' }}>
                                        {consultants.find(c => c.id === selectedConsultant)?.title}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#aaa' }}>Subtotal:</span>
                                        <span>{consultationPackages.find(p => p.id === selectedPackage)?.price}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#aaa' }}>Biaya Admin:</span>
                                        <span>Gratis</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total:</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#FF8C42' }}>
                                            {consultationPackages.find(p => p.id === selectedPackage)?.price}
                                        </span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (selectedPaymentMethod === null) {
                                            setAlertTitle('Pilih Pembayaran');
                                            setAlertMessage('Silakan pilih metode pembayaran terlebih dahulu untuk menyelesaikan pesanan.');
                                            setShowAlert(true);
                                            return;
                                        }
                                        setIsSubmitting(true);
                                        setTimeout(() => {
                                            setIsSubmitting(false);
                                            navigateToStep(3);
                                        }, 2000);
                                    }}
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        background: isSubmitting ? '#555' : 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 5px 20px rgba(255, 140, 66, 0.3)'
                                    }}
                                >
                                    {isSubmitting ? 'Memproses Pembayaran...' : 'Bayar Sekarang'}
                                </motion.button>

                                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => navigateToStep(1)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#888',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        ← Kembali ke Pemilihan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: CONSULTATION ROOM */}
                {currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
                                Pembayaran Berhasil!
                            </h2>
                            <p style={{ color: '#888', fontSize: '1rem' }}>
                                Selamat datang di ruang konsultasi Anda dengan <span style={{ color: '#FF8C42', fontWeight: 'bold' }}>
                                    {consultants.find(c => c.id === selectedConsultant)?.name}
                                </span>
                            </p>
                        </div>

                        {/* Consultation Dashboard */}
                        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', maxWidth: '1400px', margin: '0 auto' }}>

                            {/* Left Sidebar - Consultant Info & Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Consultant Card */}
                                <div style={{
                                    background: 'rgba(26, 26, 26, 0.4)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '20px',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={consultants.find(c => c.id === selectedConsultant)?.image}
                                        alt="Consultant"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>
                                            {consultants.find(c => c.id === selectedConsultant)?.name}
                                        </h3>
                                        <div style={{ color: '#FF8C42', fontSize: '0.9rem', marginBottom: '15px' }}>
                                            {consultants.find(c => c.id === selectedConsultant)?.title}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                                            <span style={{ color: '#FF8C42' }}>●</span>
                                            <span style={{ fontSize: '0.9rem', color: '#4CAF50' }}>Online</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div style={{
                                    background: 'rgba(26, 26, 26, 0.4)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '20px',
                                    padding: '20px'
                                }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px' }}>Quick Actions</h4>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(45deg, #4285F4, #34A853)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '14px',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>📹</span>
                                        Mulai Video Call Zoom
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255, 140, 66, 0.2)',
                                            color: '#FF8C42',
                                            border: '1px solid #FF8C42',
                                            padding: '14px',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>📅</span>
                                        Jadwalkan Meeting
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            color: '#888',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '14px',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>📎</span>
                                        Upload Dokumen
                                    </motion.button>
                                </div>

                                {/* Package Info */}
                                <div style={{
                                    background: 'rgba(26, 26, 26, 0.4)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '20px',
                                    padding: '20px'
                                }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px' }}>Paket Anda</h4>
                                    <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '8px' }}>
                                        {consultationPackages.find(p => p.id === selectedPackage)?.name}
                                    </div>
                                    <div style={{ color: '#FF8C42', fontWeight: 'bold', marginBottom: '15px' }}>
                                        {consultationPackages.find(p => p.id === selectedPackage)?.duration}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6' }}>
                                        {consultationPackages.find(p => p.id === selectedPackage)?.features.map((f, i) => (
                                            <div key={i} style={{ marginBottom: '6px', display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#FF8C42' }}>✓</span>
                                                <span>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right - Chat Interface */}
                            <div style={{
                                background: 'rgba(26, 26, 26, 0.4)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '700px'
                            }}>
                                {/* Chat Header */}
                                <div style={{
                                    padding: '20px 25px',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2px' }}>Chat Konsultasi</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>Diskusikan proyek Anda</p>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span>●</span> Active
                                    </div>
                                </div>

                                {/* Chat Messages Area */}
                                <div style={{
                                    flex: 1,
                                    padding: '25px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px'
                                }}>
                                    {/* System Message */}
                                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                        <div style={{
                                            display: 'inline-block',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            padding: '8px 16px',
                                            borderRadius: '100px',
                                            fontSize: '0.85rem',
                                            color: '#888'
                                        }}>
                                            Konsultasi dimulai - {new Date().toLocaleDateString('id-ID')}
                                        </div>
                                    </div>

                                    {/* Consultant Welcome Message */}
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <img
                                            src={consultants.find(c => c.id === selectedConsultant)?.image}
                                            alt="Consultant"
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>
                                                {consultants.find(c => c.id === selectedConsultant)?.name}
                                            </div>
                                            <div style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                padding: '12px 16px',
                                                borderRadius: '12px 12px 12px 4px',
                                                maxWidth: '500px',
                                                lineHeight: '1.5'
                                            }}>
                                                <p style={{ margin: 0, marginBottom: '8px' }}>
                                                    Halo! Selamat datang di sesi konsultasi. Saya siap membantu mewujudkan proyek impian Anda.
                                                </p>
                                                <p style={{ margin: 0 }}>
                                                    Silakan ceritakan detail proyek yang ingin Anda konsultasikan! 🏗️
                                                </p>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
                                                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Input */}
                                <div style={{
                                    padding: '20px 25px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                                }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <button style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem'
                                        }}>
                                            📎
                                        </button>
                                        <input
                                            type="text"
                                            placeholder="Ketik pesan Anda..."
                                            style={{
                                                flex: 1,
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '12px',
                                                padding: '12px 16px',
                                                color: 'white',
                                                fontSize: '0.95rem',
                                                outline: 'none'
                                            }}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)'
                                            }}
                                        >
                                            ➤
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Success Modal - removed, now using step 3 instead */}
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

export default NguliPremium;
