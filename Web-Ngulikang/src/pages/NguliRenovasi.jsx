import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card';
import NegotiationSection from '../components/pembayaran/NegotiationSection';
import PaymentSection from '../components/pembayaran/PaymentSection';
import { apiGet } from '../lib/api';


const NguliRenovasi = () => {
    const [currentStep, setCurrentStep] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('step')) || 1;
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [finalAgreedPrice, setFinalAgreedPrice] = useState(0);

    // Form Data
    const [projectName, setProjectName] = useState('');
    const [renovationType, setRenovationType] = useState('');
    const [buildingArea, setBuildingArea] = useState('');
    const [budget, setBudget] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Worker Selection
    const [numWorkersNeeded, setNumWorkersNeeded] = useState('');
    const [selectedWorkers, setSelectedWorkers] = useState([]);

    // Contact Information
    const [customerName, setCustomerName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');

    // Alert Modal
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

    // Handle navigation to other pages
    const handleNavigate = (page) => {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        url.searchParams.delete('step'); // Remove step when changing page
        window.location.href = url.toString(); // Full page reload to new page
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!projectName || !renovationType || !buildingArea || !location || !customerName || !whatsappNumber) {
            setAlertTitle('Data Belum Lengkap!');
            setAlertMessage('Mohon lengkapi semua form wajib (bertanda *) termasuk data pemesan agar kami dapat memproses permintaan Anda.');
            setShowAlert(true);
            return;
        }
        setShowSuccessModal(true);
    };

    const renovationTypes = [
        { id: 'total', name: 'Renovasi Total', icon: '🏗️', desc: 'Renovasi menyeluruh bangunan', price: 'Rp 80.000.000' },
        { id: 'partial', name: 'Renovasi Sebagian', icon: '🔨', desc: 'Renovasi area tertentu', price: 'Rp 30.000.000' },
        { id: 'interior', name: 'Interior Design', icon: '🎨', desc: 'Desain ulang interior', price: 'Rp 50.000.000' },
        { id: 'exterior', name: 'Eksterior & Facade', icon: '🏛️', desc: 'Pembaruan tampilan luar', price: 'Rp 40.000.000' },
        { id: 'kitchen', name: 'Kitchen Set', icon: '🍳', desc: 'Renovasi dapur', price: 'Rp 25.000.000' },
        { id: 'bathroom', name: 'Kamar Mandi', icon: '🚿', desc: 'Renovasi kamar mandi', price: 'Rp 15.000.000' }
    ];

    const [availableWorkers, setAvailableWorkers] = useState([]);

useEffect(() => {
  let alive = true;
  apiGet('/api/renovation-workers')
    .then((data) => { if (alive) setAvailableWorkers(data?.data || []); })
    .catch(console.error);
  return () => { alive = false; };
}, []);


    const handleWorkerSelection = (workerId) => {
        const maxWorkers = parseInt(numWorkersNeeded) || 0;

        if (selectedWorkers.includes(workerId)) {
            // Deselect worker
            setSelectedWorkers(selectedWorkers.filter(id => id !== workerId));
        } else {
            // Check if max limit reached
            if (selectedWorkers.length >= maxWorkers) {
                setAlertTitle('Batas Maksimal Tercapai!');
                setAlertMessage(`Maksimal hanya ${maxWorkers} tukang yang bisa dipilih sesuai kebutuhan Anda!`);
                setShowAlert(true);
                return;
            }
            // Select worker
            setSelectedWorkers([...selectedWorkers, workerId]);
        }
    };

    const commonInputStyle = {
        width: '100%',
        height: '52px',
        padding: '0 18px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease'
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: 'white', overflow: 'hidden' }}>

            {/* Background */}
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Particles count={50} color="#FF8C42" size={2} speed={0.2} />
            </div>

            <Header onNavigate={handleNavigate} activePage="nguli-renovasi" />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '180px 20px 80px' }}>

                {/* STEPPER */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
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
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#FF8C42',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                margin: '0 auto 8px',
                                boxShadow: '0 0 20px rgba(255,140,66,0.4)',
                                color: 'black'
                            }}>1</div>
                            <div style={{ fontSize: '0.8rem', color: '#FF8C42', fontWeight: 'bold' }}>Isi Data</div>
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
                                color: currentStep >= 3 ? 'black' : '#777',
                                boxShadow: currentStep >= 3 ? '0 0 20px rgba(255,140,66,0.4)' : 'none'
                            }}>3</div>
                            <div style={{ fontSize: '0.8rem', color: currentStep >= 3 ? '#FF8C42' : '#777', fontWeight: currentStep >= 3 ? 'bold' : 'normal' }}>Pembayaran</div>
                        </div>
                    </div>
                </div>

                {/* STEP 1: FORM INPUT */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}
                            >
                                Layanan <span style={{ color: '#FF8C42' }}>Renovasi</span> Profesional
                            </motion.h1>
                            <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                                Wujudkan hunian impian Anda bersama kontraktor dan arsitek berpengalaman
                            </p>
                        </div>

                        {/* Renovation Type Selection */}
                        <div style={{ marginBottom: '50px' }}>



                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '24px',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {renovationTypes.map((type) => (
                                    <CardContainer key={type.id}>
                                        <CardBody
                                            onClick={() => setRenovationType(type.id)}
                                            style={{
                                                background: renovationType === type.id
                                                    ? 'rgba(255, 140, 66, 0.15)'
                                                    : 'rgba(0, 0, 0, 0.6)',
                                                backdropFilter: 'blur(20px)',
                                                border: renovationType === type.id
                                                    ? '2px solid #FF8C42'
                                                    : '2px solid rgba(255, 255, 255, 0.2)',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: renovationType === type.id
                                                    ? '0 12px 40px rgba(255, 140, 66, 0.4)'
                                                    : '0 4px 16px rgba(0, 0, 0, 0.4)'
                                            }}
                                        >
                                            {/* Image Section */}
                                            <CardItem translateZ="50" style={{
                                                position: 'relative',
                                                height: '160px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: type.id === 'total'
                                                        ? 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80") center/cover'
                                                        : type.id === 'partial'
                                                            ? 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80") center/cover'
                                                            : type.id === 'interior'
                                                                ? 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80") center/cover'
                                                                : type.id === 'exterior'
                                                                    ? 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80") center/cover'
                                                                    : type.id === 'kitchen'
                                                                        ? 'url("https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=600&q=80") center/cover'
                                                                        : 'url("https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80") center/cover'
                                                }} />

                                                {/* Badge */}
                                                <CardItem translateZ="80" style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    background: renovationType === type.id ? '#FF8C42' : 'rgba(0, 0, 0, 0.7)',
                                                    backdropFilter: 'blur(8px)',
                                                    padding: '6px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: 'white',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {renovationType === type.id ? 'DIPILIH' : 'TERSEDIA'}
                                                </CardItem>



                                            </CardItem>

                                            {/* Content Section */}
                                            <div style={{ padding: '20px' }}>
                                                {/* Title */}
                                                <CardItem translateZ="60" as="h3" style={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: '700',
                                                    marginBottom: '8px',
                                                    color: 'white'
                                                }}>
                                                    {type.name}
                                                </CardItem>

                                                {/* Rating */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    marginBottom: '12px'
                                                }}>
                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span key={star} style={{ color: '#FFB800', fontSize: '0.9rem' }}>★</span>
                                                        ))}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: '4px' }}>4.8</span>
                                                </div>

                                                {/* Description */}
                                                <div as="p" style={{
                                                    fontSize: '0.9rem',
                                                    color: '#aaa',
                                                    lineHeight: '1.5',
                                                    marginBottom: '12px',
                                                    minHeight: '42px'
                                                }}>
                                                    {type.desc}
                                                </div>

                                                {/* Price */}
                                                <div style={{
                                                    fontSize: '0.95rem',
                                                    color: '#FF8C42',
                                                    fontWeight: '700',
                                                    marginBottom: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    <span style={{ fontSize: '1.1rem' }}>💰</span>
                                                    {type.price}
                                                </div>

                                                {/* Button */}
                                                <CardItem translateZ="70" as="div">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRenovationType(type.id);
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '12px',
                                                            background: renovationType === type.id
                                                                ? 'linear-gradient(135deg, #FF8C42, #FF6B00)'
                                                                : 'transparent',
                                                            border: renovationType === type.id
                                                                ? 'none'
                                                                : '2px solid #FF8C42',
                                                            borderRadius: '8px',
                                                            color: renovationType === type.id ? 'white' : '#FF8C42',
                                                            fontSize: '0.95rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        {renovationType === type.id ? '✓ Terpilih' : 'Pilih Layanan'}
                                                    </button>
                                                </CardItem>
                                            </div>
                                        </CardBody>
                                    </CardContainer>

                                ))}
                            </div>
                        </div>

                        {/* Form Detail - Now Separate */}
                        <div style={{
                            background: 'rgba(26, 26, 26, 0.4)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '24px',
                            padding: '40px',
                            marginBottom: '30px'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px', color: '#FF8C42' }}>
                                📋 Detail Proyek Renovasi
                            </h2>

                            {/* Project Name */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                    Nama Proyek <span style={{ color: '#FF8C42' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Contoh: Renovasi Rumah Minimalis Jakarta"
                                    style={commonInputStyle}
                                />
                            </div>

                            {/* Building Area & Budget */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                        Luas Area (m²) <span style={{ color: '#FF8C42' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={buildingArea}
                                        onChange={(e) => setBuildingArea(e.target.value)}
                                        placeholder="Contoh: 120"
                                        style={commonInputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                        Budget Estimasi (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={budget}
                                        onChange={(e) => {
                                            // Remove non-digits
                                            const rawValue = e.target.value.replace(/\D/g, '');
                                            // Format with dots
                                            const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                            // Update state with Rp prefix if value exists
                                            setBudget(rawValue ? `Rp ${formatted}` : '');
                                        }}
                                        placeholder="Contoh: Rp 200.000.000"
                                        style={commonInputStyle}
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                    Lokasi Proyek <span style={{ color: '#FF8C42' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                                    style={commonInputStyle}
                                />
                            </div>

                            {/* Number of Workers Needed */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                    Jumlah Tukang yang Dibutuhkan <span style={{ color: '#FF8C42' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={numWorkersNeeded}
                                    onChange={(e) => setNumWorkersNeeded(e.target.value)}
                                    placeholder="Contoh: 5"
                                    style={commonInputStyle}
                                />
                                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#888' }}>
                                    Maksimal 10 tukang
                                </div>
                            </div>

                            {/* Worker Selection - Conditional */}
                            {numWorkersNeeded > 0 && (
                                <div style={{ marginBottom: '30px', marginTop: '30px' }}>
                                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>
                                            👷 Pilih Tukang
                                        </h3>
                                        <p style={{ color: '#888', fontSize: '0.9rem' }}>
                                            Pilih {numWorkersNeeded} tukang ({selectedWorkers.length}/{numWorkersNeeded} dipilih)
                                        </p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
                                        {availableWorkers.map((worker) => (
                                            <motion.div
                                                key={worker.id}
                                                whileHover={{ y: -4 }}
                                                onClick={() => handleWorkerSelection(worker.id)}
                                                style={{
                                                    background: selectedWorkers.includes(worker.id)
                                                        ? 'rgba(255, 140, 66, 0.15)'
                                                        : 'rgba(0, 0, 0, 0.6)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: selectedWorkers.includes(worker.id)
                                                        ? '2px solid #FF8C42'
                                                        : '2px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: selectedWorkers.includes(worker.id)
                                                        ? '0 12px 40px rgba(255, 140, 66, 0.4)'
                                                        : '0 4px 16px rgba(0, 0, 0, 0.4)',
                                                    position: 'relative'
                                                }}
                                            >
                                                {/* Selected Badge */}
                                                {selectedWorkers.includes(worker.id) && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '10px',
                                                        right: '10px',
                                                        background: '#FF8C42',
                                                        borderRadius: '50%',
                                                        width: '26px',
                                                        height: '26px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.85rem',
                                                        zIndex: 2
                                                    }}>
                                                        ✓
                                                    </div>
                                                )}

                                                {/* Worker Image */}
                                                <div style={{
                                                    width: '100%',
                                                    height: '120px',
                                                    background: `url('${worker.image}') center/cover`,
                                                    position: 'relative'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                        padding: '15px 10px 8px'
                                                    }}>
                                                        <div style={{ fontSize: '0.7rem', color: '#FFB800', fontWeight: '600' }}>
                                                            ⭐ {worker.rating}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Worker Info */}
                                                <div style={{ padding: '12px' }}>
                                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '3px', color: 'white' }}>
                                                        {worker.name}
                                                    </h4>
                                                    <div style={{ fontSize: '0.8rem', color: '#FF8C42', marginBottom: '5px', fontWeight: '500' }}>
                                                        {worker.specialty}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: '#888' }}>
                                                        📅 {worker.experience}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                    Deskripsi Kebutuhan Renovasi
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Jelaskan detail renovasi yang Anda inginkan..."
                                    rows={5}
                                    style={{
                                        ...commonInputStyle,
                                        height: 'auto',
                                        padding: '14px 18px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {/* File Upload */}
                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    Foto Properti/Rumah <span style={{ color: '#888', fontSize: '0.9rem', fontWeight: 'normal' }}>(Opsional)</span>
                                </label>
                                <p style={{ color: '#888', marginBottom: '15px', fontSize: '0.9rem' }}>
                                    Upload foto rumah atau area yang akan dikerjakan (Maksimal 5 foto, Format: JPG, PNG)
                                </p>
                                <div style={{
                                    border: '2px dashed #ff8c42',
                                    borderRadius: '12px',
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    background: 'rgba(255, 140, 66, 0.02)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png"
                                        onChange={handleFileUpload}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 140, 66, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 15px',
                                        color: '#ff8c42'
                                    }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <div style={{ fontWeight: '600', marginBottom: '5px', fontSize: '1rem' }}>
                                        Klik atau drag foto ke area ini untuk upload
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        Ukuran maksimal 5MB per foto
                                    </div>
                                </div>

                                {/* Uploaded Files */}
                                {uploadedFiles.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ fontWeight: '500', marginBottom: '10px' }}>
                                            File Terupload ({uploadedFiles.length})
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {uploadedFiles.map((file, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '12px 16px',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    borderRadius: '10px',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>📄</span>
                                                        <div>
                                                            <div style={{ fontWeight: '500' }}>{file.name}</div>
                                                            <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        style={{
                                                            background: 'rgba(255, 68, 68, 0.2)',
                                                            border: '1px solid rgba(255, 68, 68, 0.4)',
                                                            borderRadius: '8px',
                                                            padding: '6px 12px',
                                                            color: '#ff4444',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Informasi Pemesanan Section */}
                            <div style={{ marginTop: '50px', marginBottom: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '30px',
                                    gap: '15px'
                                }}>
                                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, #FF8C42)' }}></div>
                                    <h3 style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '800',
                                        letterSpacing: '1px',
                                        color: '#FF8C42',
                                        textTransform: 'uppercase'
                                    }}>
                                        Informasi Pemesanan
                                    </h3>
                                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, #FF8C42, transparent)' }}></div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                                            Nama Pemesan
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Nama Lengkap Anda"
                                            style={commonInputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                                            Nomor WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            value={whatsappNumber}
                                            onChange={(e) => setWhatsappNumber(e.target.value)}
                                            placeholder="Contoh: 081234567890"
                                            style={commonInputStyle}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ textAlign: 'center' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                style={{
                                    background: 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '18px 60px',
                                    borderRadius: '100px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 30px rgba(255, 140, 66, 0.3)'
                                }}
                            >
                                Ajukan Penawaran Renovasi
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: NEGOTIATION & CHAT */}
                {currentStep === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <NegotiationSection
                            team={{
                                name: "Tim Renovasi Pilihan",
                                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&q=80",
                                rating: 4.8
                            }}
                            onProceed={(agreedPrice) => {
                                setFinalAgreedPrice(agreedPrice);
                                navigateToStep(3);
                            }}
                            initialOffer={(() => {
                                const val = parseInt((budget || "").replace(/[^0-9]/g, '')) || 50000000;
                                return val < 1000 ? val * 1000000 : val;
                            })()}
                        />
                    </motion.div>
                )}

                {/* STEP 3: PAYMENT */}
                {currentStep === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <PaymentSection
                            finalPrice={`Rp ${finalAgreedPrice.toLocaleString('id-ID')}`}
                            onPrev={() => navigateToStep(2)}
                            onPaymentComplete={() => {
                                setAlertTitle('Pembayaran Berhasil!');
                                setAlertMessage("Pembayaran diterima. Tim renovasi kami akan segera menghubungi Anda.");
                                setShowAlert(true);
                                setTimeout(() => {
                                    window.location.href = "/";
                                }, 3000);
                            }}
                        />
                    </motion.div>
                )}

            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 10002,
                        background: 'rgba(0,0,0,0.7)',
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
                                background: 'rgba(25, 25, 25, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 140, 66, 0.3)',
                                padding: '40px',
                                borderRadius: '24px',
                                textAlign: 'center',
                                maxWidth: '450px',
                                width: '100%',
                                boxShadow: '0 25px 50px -12px rgba(255, 140, 66, 0.25)'
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    fontSize: '2.5rem'
                                }}
                            >
                                ✓
                            </motion.div>

                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.6rem' }}>Pengajuan Berhasil!</h3>
                            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', marginBottom: '25px' }}>
                                Terima kasih! Tim renovasi kami akan segera menghubungi Anda untuk membahas detail proyek.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    navigateToStep(2);
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '100px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    width: '100%',
                                    boxShadow: '0 5px 20px rgba(255, 140, 66, 0.3)'
                                }}
                            >
                                Lanjut ke Negosiasi
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Alert Modal */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAlert(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999
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
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                fontSize: '4rem',
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}>
                                ⚠️
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                textAlign: 'center',
                                marginBottom: '15px'
                            }}>
                                {alertTitle || "Peringatan"}
                            </h3>

                            {/* Message */}
                            <p style={{
                                fontSize: '1rem',
                                color: '#aaa',
                                textAlign: 'center',
                                lineHeight: '1.6',
                                marginBottom: '30px'
                            }}>
                                {alertMessage}
                            </p>

                            {/* OK Button */}
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
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 140, 66, 0.3)'
                                }}
                            >
                                OK, Mengerti
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div >
    );
};

export default NguliRenovasi;
