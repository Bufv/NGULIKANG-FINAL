import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Particles from '../components/ui/Particles';
import { lamaranApi } from '../lib/api';

const DaftarKerja = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        ktp: '',
        address: '',
        phone: '',
        email: '',
        maritalStatus: '',
        domicile: '',
        relocate: '',
        vehicle: '',
        experienceYears: '',
        projectTypes: '',
        jobRoles: []
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [agreements, setAgreements] = useState({
        dataValid: false,
        locationReady: false,
        termsAccepted: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleJobRole = (role) => {
        setFormData(prev => {
            const exists = prev.jobRoles.includes(role);
            return {
                ...prev,
                jobRoles: exists ? prev.jobRoles.filter(item => item !== role) : [...prev.jobRoles, role]
            };
        });
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitError('');
        const allAgreed = Object.values(agreements).every(v => v);
        if (!allAgreed) {
            alert("Harap setujui semua pernyataan sebelum mengirim lamaran.");
            return;
        }

        if (!formData.jobRoles.length) {
            setSubmitError('Pilih minimal satu posisi yang dilamar.');
            return;
        }

        if (uploadedFiles.length === 0) {
            setSubmitError('Dokumen pendukung wajib diunggah.');
            return;
        }

        setIsSubmitting(true);
        const payload = new FormData();
        payload.append('fullName', formData.fullName);
        payload.append('ktp', formData.ktp);
        payload.append('address', formData.address);
        payload.append('phone', formData.phone);
        payload.append('email', formData.email);
        payload.append('maritalStatus', formData.maritalStatus);
        payload.append('domicile', formData.domicile);
        payload.append('relocate', formData.relocate);
        payload.append('vehicle', formData.vehicle);
        payload.append('experienceYears', formData.experienceYears);
        payload.append('projectTypes', formData.projectTypes);
        payload.append('jobRoles', JSON.stringify(formData.jobRoles));
        uploadedFiles.forEach((file) => payload.append('documents', file));

        lamaranApi
            .createLamaran(payload, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                setShowSuccess(true);
            })
            .catch((error) => {
                const responseData = error.response?.data;
                const issues = responseData?.errors;
                const detail = Array.isArray(issues) && issues.length
                    ? `${issues[0].path?.join('.') || 'field'}: ${issues[0].message}`
                    : null;
                const message = detail || responseData?.message || 'Gagal mengirim lamaran. Coba lagi.';
                setSubmitError(message);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const jobRoles = [
        "Nguli All in One", "Nguli Cat",
        "Nguli Listrik", "Nguli Bangunan",
        "Nguli Pipa/Ledeng", "Nguli Besi",
        "Nguli Gypsum", "Nguli Keramik",
        "Nguli Atap", "Nguli Paving",
        "Nguli AC", "Nguli Bor Sumur",
        "Nguli Kayu"
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: '#e4e4e7', fontFamily: '"Inter", sans-serif', paddingBottom: '40px' }}>
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <Particles count={40} color="#FF8C42" />
            </div>

            {/* Custom Styles for Animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
            `}</style>

            {/* Success Modal */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="success-modal"
                        style={{
                            background: 'rgba(20, 20, 20, 0.3)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,140,66,0.3)',
                            borderRadius: '24px',
                            padding: '40px',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(76, 175, 80, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Lamaran Terkirim!</h3>
                        <p style={{ color: '#aaa', marginBottom: '30px', lineHeight: '1.6' }}>
                            Terima kasih telah mendaftar. Data Anda telah kami terima dan sedang diproses oleh tim HRD kami.
                        </p>
                        <button
                            onClick={() => onNavigate('cek-status-lamaran')}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                background: '#FF8C42',
                                border: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: '0.2s',
                                boxShadow: '0 10px 20px rgba(255, 140, 66, 0.2)'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#e67329'}
                            onMouseOut={(e) => e.target.style.background = '#FF8C42'}
                        >
                            Cek Status Lamaran
                        </button>
                    </motion.div>
                </div>
            )}

            <div style={{ paddingTop: '160px', maxWidth: '800px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: 'rgba(24, 24, 27, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '50px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        zIndex: 10
                    }}
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '10px' }}>Formulir Pendaftaran</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Bergabunglah dengan ribuan mitra <span style={{ color: '#FF8C42', fontWeight: 'bold' }}>NguliKang</span> lainnya.</p>
                    </div>

                    {/* Progress Bar - 4 STEPS */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} style={{
                                flex: 1, height: '6px', borderRadius: '3px',
                                background: s <= step ? '#FF8C42' : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s'
                            }} />
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <style>{`
                            .form-group { margin-bottom: 24px; }
                            .form-label { display: block; margin-bottom: 8px; color: rgba(255,255,255,0.9); font-weight: 600; font-size: 0.95rem; }
                            .form-input { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none; transition: 0.3s; font-size: 1rem; }
                            .form-input:focus { border-color: #FF8C42; background: rgba(255,255,255,0.1); }
                            .section-title { color: #FF8C42; font-weight: 800; font-size: 0.9rem; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 25px; border-bottom: 1px solid rgba(255,140,66,0.2); padding-bottom: 15px; }
                            .radio-group { display: flex; gap: 20px; flex-wrap: wrap; }
                            .radio-label { display: flex; alignItems: center; gap: 10px; color: rgba(255,255,255,0.8); cursor: pointer; font-size: 0.95rem; }
                            .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
                            .radio-input { accent-color: #FF8C42; width: 18px; height: 18px; cursor: pointer; }
                        `}</style>

                        {/* STEP 1: BIODATA & IDENTITAS */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="section-title" style={{ marginTop: 0 }}>Biodata Diri & Identitas</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Nama Lengkap (Sesuai KTP)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Nama Depan"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nomor KTP / NIK</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="16 Digit NIK"
                                            name="ktp"
                                            value={formData.ktp}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tempat Tinggal saat ini (Alamat Lengkap)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Jln. Contoh No. 123, Kel. Apa, Kec. Dimana"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Nomor WhatsApp</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="08xxxxxxxxxx"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="user@gmail.com"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status Pernikahan</label>
                                    <div style={{ position: 'relative' }}>
                                        <div
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="form-input"
                                            style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                color: formData.maritalStatus ? 'white' : '#a1a1aa'
                                            }}
                                        >
                                            {formData.maritalStatus || "Pilih Status..."}
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#FF8C42"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}
                                            >
                                                <path d="M6 9l6 6 6-6" />
                                            </svg>
                                        </div>

                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    marginTop: '8px',
                                                    background: '#27272a',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px',
                                                    zIndex: 50,
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {["Belum Menikah", "Menikah", "Cerai Hidup", "Cerai Mati"].map((status) => (
                                                    <div
                                                        key={status}
                                                        onClick={() => {
                                                            handleChange({ target: { name: 'maritalStatus', value: status } });
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        style={{
                                                            padding: '12px 16px',
                                                            cursor: 'pointer',
                                                            color: 'white',
                                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                            transition: '0.2s'
                                                        }}
                                                        onMouseOver={(e) => e.currentTarget.style.background = '#FF8C42'}
                                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        {status}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <button type="button" onClick={handleNext} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#FF8C42', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
                                    Lanjut
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2: PENGALAMAN & LOKASI */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="section-title" style={{ marginTop: 0 }}>Pengalaman Kerja & Lokasi</div>

                                <div className="form-group">
                                    <label className="form-label">Posisi yang dilamar (Boleh lebih dari satu)</label>
                                    <div className="checkbox-grid">
                                        {jobRoles.map((role, idx) => (
                                            <label key={idx} className="radio-label">
                                                <input
                                                    type="checkbox"
                                                    className="radio-input"
                                                    checked={formData.jobRoles.includes(role)}
                                                    onChange={() => toggleJobRole(role)}
                                                />{' '}
                                                {role}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Lama Pengalaman</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Contoh: 3 Tahun"
                                            name="experienceYears"
                                            value={formData.experienceYears}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Jenis Proyek yg dikerjakan</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Perumahan, Gedung, dll"
                                            name="projectTypes"
                                            value={formData.projectTypes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Lokasi Domisili Saat Ini (Kota/Kab)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Jakarta Selatan"
                                        name="domicile"
                                        value={formData.domicile}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Bersedia Pindah Lokasi?</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="relocate"
                                                    className="radio-input"
                                                    value="yes"
                                                    checked={formData.relocate === 'yes'}
                                                    onChange={handleChange}
                                                />{' '}
                                                Ya
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="relocate"
                                                    className="radio-input"
                                                    value="no"
                                                    checked={formData.relocate === 'no'}
                                                    onChange={handleChange}
                                                />{' '}
                                                Tidak
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Kendaraan Pribadi</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="vehicle"
                                                    className="radio-input"
                                                    value="motor"
                                                    checked={formData.vehicle === 'motor'}
                                                    onChange={handleChange}
                                                />{' '}
                                                Motor
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="vehicle"
                                                    className="radio-input"
                                                    value="mobil"
                                                    checked={formData.vehicle === 'mobil'}
                                                    onChange={handleChange}
                                                />{' '}
                                                Mobil
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="vehicle"
                                                    className="radio-input"
                                                    value="none"
                                                    checked={formData.vehicle === 'none'}
                                                    onChange={handleChange}
                                                />{' '}
                                                Tidak Ada
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button type="button" onClick={handleBack} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Kembali</button>
                                    <button type="button" onClick={handleNext} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#FF8C42', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Lanjut</button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: DOKUMEN PENDUKUNG */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="section-title" style={{ marginTop: 0 }}>Dokumen Pendukung</div>

                                <div style={{ marginBottom: '30px' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.6' }}>
                                        Silakan unggah dokumen yang diperlukan untuk mempermudah proses verifikasi.
                                        Pastikan foto atau hasil scan terlihat jelas.
                                    </p>

                                    <div className="form-group">
                                        <label className="form-label">Upload Foto KTP, KK, & Sertifikat Keahlian (Jika ada)</label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            multiple
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current.click()}
                                            style={{
                                                border: '2px dashed ' + (uploadedFiles.length > 0 ? '#FF8C42' : 'rgba(255,255,255,0.2)'),
                                                borderRadius: '16px',
                                                padding: '40px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: '0.3s',
                                                background: uploadedFiles.length > 0 ? 'rgba(255,140,66,0.05)' : 'rgba(255,255,255,0.02)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#FF8C42';
                                                e.currentTarget.style.background = 'rgba(255,140,66,0.05)';
                                            }}
                                            onMouseOut={(e) => {
                                                if (uploadedFiles.length === 0) {
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                }
                                            }}
                                        >
                                            <div style={{
                                                width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,140,66,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
                                            }}>
                                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    {uploadedFiles.length > 0 ? (
                                                        <>
                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                            <polyline points="17 8 12 3 7 8" />
                                                            <line x1="12" y1="3" x2="12" y2="15" />
                                                        </>
                                                    )}
                                                </svg>
                                            </div>

                                            {uploadedFiles.length > 0 ? (
                                                <div style={{ width: '100%' }}>
                                                    <p style={{ color: '#FF8C42', marginBottom: '10px', fontWeight: 'bold' }}>{uploadedFiles.length} File Dipilih</p>
                                                    <div style={{ maxHeight: '150px', overflowY: 'auto', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                                                        {uploadedFiles.map((file, idx) => (
                                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                                <span style={{ fontSize: '0.9rem', color: '#eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                                                                    {file.name}
                                                                </span>
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeFile(idx);
                                                                    }}
                                                                    style={{ cursor: 'pointer', color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}
                                                                >
                                                                    ✕
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p style={{ marginTop: '12px', fontSize: '0.8rem', color: '#aaa' }}>+ Klik untuk tambah file lain</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p style={{ color: 'white', marginBottom: '8px', fontWeight: '600', fontSize: '1.1rem' }}>Klik atau drop file di sini</p>
                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Bisa upload banyak foto sekaligus</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button type="button" onClick={handleBack} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Kembali</button>
                                    <button type="button" onClick={handleNext} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#FF8C42', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Lanjut</button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: KONFIRMASI */}
                        {step === 4 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="section-title" style={{ marginTop: 0 }}>Konfirmasi & Persetujuan</div>
                                <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(255,140,66,0.1)', borderRadius: '16px', border: '1px solid rgba(255,140,66,0.2)' }}>
                                    <p style={{ marginBottom: '10px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                        Konfirmasi Data
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>Harap pastikan semua data yang Anda masukkan, termasuk biodata, info pengalaman, dan dokumen pendukung sudah benar.</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
                                    <label className="radio-label">
                                        <input
                                            type="checkbox"
                                            className="radio-input"
                                            checked={agreements.dataValid}
                                            onChange={(e) => setAgreements(prev => ({ ...prev, dataValid: e.target.checked }))}
                                        />
                                        Saya menyatakan data yang diisi adalah benar dan dapat dipertanggungjawabkan.
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="checkbox"
                                            className="radio-input"
                                            checked={agreements.locationReady}
                                            onChange={(e) => setAgreements(prev => ({ ...prev, locationReady: e.target.checked }))}
                                        />
                                        Saya bersedia ditempatkan di lokasi kerja yang ditentukan (jika memilih bersedia).
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="checkbox"
                                            className="radio-input"
                                            checked={agreements.termsAccepted}
                                            onChange={(e) => setAgreements(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                                        />
                                        Saya menyetujui semua Syarat & Ketentuan yang berlaku di NguliKang.
                                    </label>
                                </div>

                                {submitError && (
                                    <div style={{ marginBottom: '20px', color: '#ef4444', fontWeight: '600', fontSize: '0.95rem' }}>
                                        {submitError}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="button" onClick={handleBack} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Kembali</button>
                                    <button
                                        type="submit"
                                        disabled={!Object.values(agreements).every(v => v) || isSubmitting}
                                        style={{
                                            flex: 1,
                                            padding: '16px',
                                            borderRadius: '12px',
                                            background: Object.values(agreements).every(v => v) && !isSubmitting ? 'linear-gradient(135deg, #FF8C42 0%, #f97316 100%)' : 'rgba(255, 140, 66, 0.3)',
                                            border: 'none',
                                            color: Object.values(agreements).every(v => v) && !isSubmitting ? 'white' : 'rgba(255,255,255,0.5)',
                                            fontWeight: 'bold',
                                            cursor: Object.values(agreements).every(v => v) && !isSubmitting ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            transition: '0.3s'
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                                                </svg>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                Kirim Lamaran
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default DaftarKerja;
