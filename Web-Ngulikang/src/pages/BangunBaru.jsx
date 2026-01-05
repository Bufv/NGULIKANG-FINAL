import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card';
import NegotiationSection from '../components/pembayaran/NegotiationSection';
import PaymentSection from '../components/pembayaran/PaymentSection';

const BangunBaru = () => {
    const [currentStep, setCurrentStep] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('step')) || 1;
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Alert Modal State
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    // Form Data
    const [projectName, setProjectName] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [landArea, setLandArea] = useState('');
    const [buildingArea, setBuildingArea] = useState('');
    const [floors, setFloors] = useState('1');
    const [budget, setBudget] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [clientName, setClientName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [zoomedImage, setZoomedImage] = useState(null);
    const fileInputRef = useRef(null);

    const [finalAgreedPrice, setFinalAgreedPrice] = useState(0);

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

        if (uploadedFiles.length + files.length > 5) {
            setAlertTitle('Batas Foto Tercapai');
            setAlertMessage("Maksimal 5 foto yang diperbolehkan untuk diupload.");
            setShowAlert(true);
            return;
        }

        // Create preview URLs
        const newFiles = files.map(file => ({
            file,
            name: file.name,
            size: file.size,
            preview: URL.createObjectURL(file)
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };


    const handleSubmit = () => {
        if (!buildingType || !landArea || !buildingArea || !location || !budget || !clientName || !whatsappNumber) {
            setAlertTitle('Data Belum Lengkap');
            setAlertMessage('Mohon lengkapi semua data yang diperlukan (Tipe Bangunan, Luas, Lokasi, Budget, dan Kontak).');
            setShowAlert(true);
            return;
        }
        setShowSuccessModal(true);
    };

    const buildingTypes = [
        { id: 'rumah-tinggal', name: 'Rumah Tinggal', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80', desc: 'Hunian pribadi/keluarga', price: 'Mulai Rp 150 Juta' },
        { id: 'rumah-minimalis', name: 'Rumah Minimalis', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80', desc: 'Desain modern sederhana', price: 'Mulai Rp 200 Juta' },
        { id: 'ruko', name: 'Ruko / Rukan', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80', desc: 'Rumah toko komersial', price: 'Mulai Rp 450 Juta' },
        { id: 'villa', name: 'Villa & Resort', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&q=80', desc: 'Hunian mewah/liburan', price: 'Mulai Rp 500 Juta' },
        { id: 'gedung', name: 'Gedung Kantor', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80', desc: 'Bangunan komersial bertingkat', price: 'Mulai Rp 1.5 Miliar' },
        { id: 'warehouse', name: 'Gudang / Pabrik', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80', desc: 'Bangunan industri & logistik', price: 'Mulai Rp 250 Juta' }
    ];

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

            <Header onNavigate={handleNavigate} activePage="bangun-baru" />

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
                                Layanan <span style={{ color: '#FF8C42' }}>Bangun Baru</span> Profesional
                            </motion.h1>
                            <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                                Wujudkan hunian impian Anda dari nol bersama tim profesional kami
                            </p>
                        </div>

                        {/* Building Type Selection (Cards above form) */}
                        <div style={{ marginBottom: '50px' }}>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '24px',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {buildingTypes.map((type) => (
                                    <CardContainer key={type.id}>
                                        <CardBody
                                            onClick={() => setBuildingType(type.id)}
                                            style={{
                                                background: buildingType === type.id
                                                    ? 'rgba(255, 140, 66, 0.15)'
                                                    : 'rgba(30, 30, 30, 0.6)',
                                                backdropFilter: 'blur(20px)',
                                                border: buildingType === type.id
                                                    ? '2px solid #FF8C42'
                                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '24px',
                                                padding: '0',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                height: '320px', // Taller for image + price
                                                width: '100%',
                                                transition: 'all 0.3s ease'
                                            }}
                                            className="group/card"
                                        >
                                            {/* Image */}
                                            <div style={{ height: '180px', overflow: 'hidden' }}>
                                                <CardItem translateZ="50" style={{ width: '100%', height: '100%' }}>
                                                    <img
                                                        src={type.image}
                                                        alt={type.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.5s ease'
                                                        }}
                                                        className="group-hover/card:scale-110"
                                                    />
                                                </CardItem>
                                            </div>

                                            {/* Text Content */}
                                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                                <CardItem
                                                    translateZ="40"
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        fontWeight: 'bold',
                                                        color: buildingType === type.id ? '#FF8C42' : 'white',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    {type.name}
                                                </CardItem>
                                                <CardItem
                                                    as="p"
                                                    translateZ="30"
                                                    style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 10px 0' }}
                                                >
                                                    {type.desc}
                                                </CardItem>
                                                <CardItem
                                                    translateZ="20"
                                                    style={{
                                                        display: 'inline-block',
                                                        background: 'rgba(255, 140, 66, 0.2)',
                                                        color: '#FF8C42',
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {type.price}
                                                </CardItem>
                                            </div>

                                            {/* Selected Overlay */}
                                            {buildingType === type.id && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: '#FF8C42',
                                                    color: 'white',
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                                    zIndex: 10
                                                }}>
                                                    ✓
                                                </div>
                                            )}
                                        </CardBody>
                                    </CardContainer>
                                ))}
                            </div>
                        </div>

                        {/* Form Container */}
                        <div style={{
                            background: 'rgba(26, 26, 26, 0.4)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '24px',
                            padding: '40px',
                            marginBottom: '30px'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px', color: '#FF8C42' }}>
                                🏗️ Detail Proyek Pembangunan
                            </h2>


                            {/* Land Area, Building Area & Floors */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                        Luas Tanah (m²) <span style={{ color: '#FF8C42' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={landArea}
                                        onChange={(e) => setLandArea(e.target.value)}
                                        placeholder="Contoh: 200"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                        Luas Bangunan (m²) <span style={{ color: '#FF8C42' }}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={buildingArea}
                                        onChange={(e) => setBuildingArea(e.target.value)}
                                        placeholder="Contoh: 150"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                        Jumlah Lantai <span style={{ color: '#FF8C42' }}>*</span>
                                    </label>
                                    <select
                                        value={floors}
                                        onChange={(e) => setFloors(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num} style={{ background: '#1a1a1a' }}>
                                                {num} Lantai
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Budget & Location */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                        Budget Estimasi <span style={{ color: '#FF8C42' }}>*</span>
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
                                        placeholder="Contoh: Rp 500.000.000"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                        Lokasi Proyek <span style={{ color: '#FF8C42' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Contoh: Tangerang, Banten"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                                    Deskripsi & Kebutuhan Khusus
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Jelaskan spesifikasi, desain, atau kebutuhan khusus untuk proyek Anda..."
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '14px 18px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
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
                                    onChange={handleFileUpload}
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
                                    <input
                                        type="text"
                                        placeholder="Nama Lengkap Anda"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        style={{ width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Nomor WhatsApp</label>
                                    <input
                                        type="tel"
                                        placeholder="Contoh: 081234567890"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        style={{ width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none' }}
                                    />
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
                                Ajukan Penawaran Pembangunan
                            </motion.button>
                        </div>
                    </motion.div>
                )
                }


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
                                    cursor: 'default'
                                }}
                                onClick={(e) => e.stopPropagation()}
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

                {/* STEP 2: NEGOTIATION */}
                {
                    currentStep === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <NegotiationSection
                                team={{
                                    name: "Tim Konstruksi",
                                    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&q=80",
                                    rating: 5.0
                                }}
                                onProceed={(agreedPrice) => {
                                    setFinalAgreedPrice(agreedPrice);
                                    navigateToStep(3);
                                }}
                                initialOffer={(() => {
                                    const val = parseInt((budget || "").replace(/[^0-9]/g, '')) || 250000000;
                                    return val < 1000 ? val * 1000000 : val;
                                })()}
                            />
                        </motion.div>
                    )
                }

                {/* STEP 3: PAYMENT */}
                {
                    currentStep === 3 && (
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
                                    setAlertMessage("Pembayaran diterima. Tim Konstruksi Bangun Baru akan segera menghubungi Anda.");
                                    setShowAlert(true);
                                    setTimeout(() => {
                                        window.location.href = "/";
                                    }, 3000);
                                }}
                            />
                        </motion.div>
                    )
                }

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

            </div >

            {/* Success Modal */}
            < AnimatePresence >
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
                                Terima kasih! Tim konstruksi kami akan segera menghubungi Anda untuk survey lokasi dan konsultasi detail proyek.
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
                                Lanjut ke Konsultasi
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            <Footer />
        </div >
    );
};

export default BangunBaru;
