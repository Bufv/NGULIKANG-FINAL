import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';


const LoadingSpinner = () => (
    <motion.div
        style={{
            width: '24px',
            height: '24px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            marginRight: '12px'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
);

const CustomDropdown = ({ options, value, onChange, placeholder, isOpen, onToggle }) => {
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div style={{ position: 'relative', flex: 1 }}>
            <div
                onClick={onToggle}
                style={{
                    padding: '12px',
                    background: '#27272a',
                    border: isOpen ? '1px solid #FF8C42' : '1px solid #3f3f46',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    userSelect: 'none'
                }}
            >
                <span style={{ fontWeight: '500' }}>{selectedOption ? selectedOption.label : placeholder}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    ▼
                </motion.span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '110%',
                            left: 0,
                            right: 0,
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: '8px',
                            zIndex: 100,
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            transformOrigin: 'top'
                        }}
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    onToggle();
                                }}
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    background: option.value === value ? '#FF8C42' : 'transparent',
                                    color: option.value === value ? 'white' : '#e4e4e7',
                                    transition: 'background 0.2s',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    if (option.value !== value) e.currentTarget.style.background = '#27272a';
                                }}
                                onMouseLeave={(e) => {
                                    if (option.value !== value) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {option.label}
                                {option.value === value && <span>✓</span>}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Checkout = ({ onNavigate }) => {
    const { cartItems, getCartTotal, promo } = useCart();
    const { showNotification } = useNotification();

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            onNavigate('marketplace');
        }
    }, [cartItems, onNavigate]);

    // State for Address
    const [address, setAddress] = useState({
        label: "Rumah • UTAMA",
        recipient: "Budi Santoso",
        phone: "0812-3456-7890",
        detail: "Jl. Mawar No. 123, RT 01/RW 02, Kel. Menteng, Kec. Menteng, Jakarta Pusat, DKI Jakarta, 10310"
    });

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressStep, setAddressStep] = useState(1); // 1: Search, 2: Pinpoint, 3: Details
    const [tempAddress, setTempAddress] = useState({ ...address });
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleOpenAddressModal = () => {
        setTempAddress({ ...address });
        setAddressStep(1); // Reset to step 1
        setSearchKeyword('');
        setSearchResults([]);
        setShowAddressModal(true);
    };

    const handleSaveAddress = () => {
        setAddress({ ...tempAddress });
        setShowAddressModal(false);
        showNotification('Alamat berhasil diperbarui!', 'success');
    };

    // Mock Search (Simulating Google Places Autocomplete)
    useEffect(() => {
        if (searchKeyword.length > 2) {
            // Simulate API delay
            const timer = setTimeout(() => {
                setSearchResults([
                    { id: 1, main: searchKeyword, secondary: "Jakarta Pusat, DKI Jakarta" },
                    { id: 2, main: "Jalan " + searchKeyword, secondary: "Kebayoran Baru, Jakarta Selatan" },
                    { id: 3, main: "Gedung " + searchKeyword, secondary: "Tanah Abang, Jakarta Pusat" },
                ]);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [searchKeyword]);

    const handleSelectLocation = (loc) => {
        setTempAddress(prev => ({ ...prev, detail: `${loc.main}, ${loc.secondary}` }));
        setAddressStep(2); // Go to Pinpoint
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => {
                setAddressStep(2); // Go to Pinpoint
                setTempAddress(prev => ({ ...prev, detail: "Lokasi Saat Ini (Detected)" }));
            }, (err) => {
                showNotification('Gagal mendeteksi lokasi: ' + err.message, 'error');
            });
        }
    };

    // States
    const [selectedDuration, setSelectedDuration] = useState('reguler');
    const [selectedCourier, setSelectedCourier] = useState('sicepat');
    const [useInsurance, setUseInsurance] = useState(false);
    const [protection, setProtection] = useState(false);
    const [note, setNote] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('bca');
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'duration' or 'courier'

    // Costs
    const subtotal = getCartTotal();
    const protectionCost = protection ? 500 * cartItems.length : 0;

    const shippingOptions = {
        reguler: { price: 15000, etd: '2 - 4 Hari' },
        nextday: { price: 30000, etd: '1 Hari' },
        cargo: { price: 50000, etd: '5 - 7 Hari' }
    };

    const shippingCost = shippingOptions[selectedDuration].price;
    const insuranceCost = useInsurance ? Math.ceil(subtotal * 0.002) : 0; // 0.2% insurance
    const totalPayment = subtotal + shippingCost + insuranceCost + protectionCost - promo.discount;

    const handlePay = () => {
        setIsProcessing(true);
        // Simulate API
        setTimeout(() => {
            setIsProcessing(false);
            showNotification('Pembayaran Berhasil! Pesanan diproses.', 'success');
            // Navigate to success or history page (mock)
            onNavigate('order-tracker');
        }, 2000);
    };

    return (
        <div style={{ padding: '120px 5% 80px', minHeight: '100vh', color: '#e4e4e7', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>

                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* ADDRESS SECTION */}
                    <div style={{ background: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ALAMAT PENGIRIMAN
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '10px', borderBottom: '1px solid #3f3f46' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 'bold', color: 'white' }}>{address.label}</span>
                                    <span style={{ fontSize: '0.8rem', background: '#FF8C42', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Utama</span>
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{address.recipient} ({address.phone})</div>
                                <div style={{ fontSize: '0.9rem', color: '#a1a1aa', lineHeight: '1.5' }}>{address.detail}</div>
                            </div>
                            <button
                                onClick={handleOpenAddressModal}
                                style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#FF8C42', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                            >
                                Ganti
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '40px', marginTop: '16px' }}>
                            <button style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.9rem' }}>Kirim ke Alamat Lain</button>
                            <button style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.9rem' }}>Lengkapi Detail Alamat</button>
                        </div>
                    </div>

                    {/* ORDER DETAILS SECTION */}
                    <div style={{ background: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '20px' }}>Pesanan 1</h3>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '15px' }}>TB. JAYA ABADI SENTOSA</div>

                            {/* Product List */}
                            {cartItems.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #3f3f46' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'white', fontSize: '1rem', marginBottom: '4px' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px' }}>Variant: Standard</div>
                                        <div style={{ fontWeight: 'bold' }}>{item.quantity} x Rp{item.price.toLocaleString('id-ID')}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Protection Checkbox */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255,140,66,0.05)', borderRadius: '8px', border: '1px solid rgba(255,140,66,0.2)' }}>
                                <input
                                    type="checkbox"
                                    checked={protection}
                                    onChange={(e) => setProtection(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: '#FF8C42' }}
                                />
                                <div style={{ fontSize: '0.9rem' }}>
                                    <span style={{ color: '#FF8C42', fontWeight: 'bold' }}>Proteksi Kerusakan</span>
                                    <span style={{ color: '#a1a1aa', marginLeft: '5px' }}>Rp500/barang</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Section */}
                        <div style={{ borderTop: '1px solid #3f3f46', paddingTop: '20px', marginTop: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px' }}>Pilih Pengiriman</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <CustomDropdown
                                        options={[
                                            { value: 'reguler', label: 'Reguler (2-4 Hari)' },
                                            { value: 'nextday', label: 'Next Day (1 Hari)' },
                                            { value: 'cargo', label: 'Kargo (5-7 Hari)' }
                                        ]}
                                        value={selectedDuration}
                                        onChange={setSelectedDuration}
                                        placeholder="Pilih Durasi"
                                        isOpen={activeDropdown === 'duration'}
                                        onToggle={() => setActiveDropdown(activeDropdown === 'duration' ? null : 'duration')}
                                    />
                                    <CustomDropdown
                                        options={[
                                            { value: 'sicepat', label: 'SiCepat' },
                                            { value: 'jnt', label: 'J&T Express' },
                                            { value: 'jne', label: 'JNE' }
                                        ]}
                                        value={selectedCourier}
                                        onChange={setSelectedCourier}
                                        placeholder="Pilih Kurir"
                                        isOpen={activeDropdown === 'courier'}
                                        onToggle={() => setActiveDropdown(activeDropdown === 'courier' ? null : 'courier')}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#27272a', padding: '12px 16px', borderRadius: '8px', marginBottom: '15px' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Rp{shippingCost.toLocaleString('id-ID')}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Estimasi tiba {shippingOptions[selectedDuration].etd}</div>
                                </div>
                                <span style={{ color: '#FF8C42', fontWeight: 'bold', fontSize: '0.9rem' }}>Ubah Kurir</span>
                            </div>

                            {/* Shipping Insurance */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <input
                                    type="checkbox"
                                    checked={useInsurance}
                                    onChange={(e) => setUseInsurance(e.target.checked)}
                                    style={{ width: '18px', height: '18px', accentColor: '#FF8C42' }}
                                />
                                <div style={{ fontSize: '0.9rem' }}>
                                    <span>Pakai Asuransi Pengiriman</span>
                                    <span style={{ color: '#a1a1aa', marginLeft: '5px' }}>(Rp{Math.ceil(subtotal * 0.002).toLocaleString('id-ID')})</span>
                                </div>
                            </div>

                            {/* Note */}
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Tulis catatan untuk toko..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', borderBottom: '1px solid #3f3f46', color: 'white', outline: 'none' }}
                                />
                                <span style={{ position: 'absolute', right: 0, bottom: '12px', fontSize: '0.8rem', color: '#555' }}>{note.length}/144</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (STICKY) */}
                <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>

                    {/* PAYMENT METHOD */}
                    <div style={{ background: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Metode Pembayaran</h3>
                            <span style={{ color: '#FF8C42', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}>Lihat Semua</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: selectedPayment === 'bca' ? '1px solid #FF8C42' : '1px solid transparent', background: selectedPayment === 'bca' ? 'rgba(255,140,66,0.1)' : 'transparent' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ color: '#0057ae', fontWeight: 'bold', fontSize: '0.9rem' }}>BCA</div>
                                    <span>BCA Virtual Account</span>
                                </div>
                                <input type="radio" name="payment" checked={selectedPayment === 'bca'} onChange={() => setSelectedPayment('bca')} style={{ accentColor: '#FF8C42' }} />
                            </label>

                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: selectedPayment === 'alfamart' ? '1px solid #FF8C42' : '1px solid transparent', background: selectedPayment === 'alfamart' ? 'rgba(255,140,66,0.1)' : 'transparent' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ color: '#e41d2d', fontWeight: 'bold', fontSize: '0.9rem' }}>Alfamart</div>
                                    <span>Alfamart / Indomaret</span>
                                </div>
                                <input type="radio" name="payment" checked={selectedPayment === 'alfamart'} onChange={() => setSelectedPayment('alfamart')} style={{ accentColor: '#FF8C42' }} />
                            </label>

                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: selectedPayment === 'bri' ? '1px solid #FF8C42' : '1px solid transparent', background: selectedPayment === 'bri' ? 'rgba(255,140,66,0.1)' : 'transparent' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ color: '#0065b2', fontWeight: 'bold', fontSize: '0.9rem' }}>BRI</div>
                                    <span>BRIVA</span>
                                </div>
                                <input type="radio" name="payment" checked={selectedPayment === 'bri'} onChange={() => setSelectedPayment('bri')} style={{ accentColor: '#FF8C42' }} />
                            </label>
                        </div>
                    </div>

                    {/* PROMO */}
                    <div style={{ background: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ display: 'block', width: '24px', height: '24px', background: '#3f3f46', borderRadius: '50%', textAlign: 'center', lineHeight: '24px', fontSize: '0.8rem' }}>%</span>
                            {promo.code ? (
                                <div>
                                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem', display: 'block', color: '#4ade80' }}>Promo Terpasang!</span>
                                    <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Kode: {promo.code}</span>
                                </div>
                            ) : (
                                <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Makin hemat pakai promo</span>
                            )}
                        </div>
                        <span style={{ color: '#a1a1aa' }}>&gt;</span>
                    </div>

                    {/* SUMMARY */}
                    <div style={{ background: '#18181b', borderRadius: '12px', border: '1px solid #27272a', padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '20px' }}>Ringkasan Belanja</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem', color: '#a1a1aa' }}>
                            <span>Total Harga ({cartItems.length} Barang)</span>
                            <span>Rp{subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem', color: '#a1a1aa' }}>
                            <span>Total Ongkos Kirim</span>
                            <span>Rp{shippingCost.toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem', color: '#a1a1aa' }}>
                            <span>Asuransi Pengiriman</span>
                            <span>Rp{insuranceCost.toLocaleString('id-ID')}</span>
                        </div>
                        {protection && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem', color: '#a1a1aa' }}>
                                <span>Proteksi Produk</span>
                                <span>Rp{protectionCost.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        {promo.discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem', color: '#4ade80' }}>
                                <span>Total Diskon</span>
                                <span>-Rp{promo.discount.toLocaleString('id-ID')}</span>
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid #3f3f46', margin: '15px 0' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total Tagihan</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FF8C42' }}>Rp{totalPayment.toLocaleString('id-ID')}</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePay}
                            disabled={isProcessing}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: '#FF8C42',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                boxShadow: '0 10px 30px -5px rgba(255, 140, 66, 0.4)',
                                opacity: isProcessing ? 0.7 : 1
                            }}
                        >
                            {isProcessing ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <LoadingSpinner />
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                'Bayar Sekarang'
                            )}
                        </motion.button>

                        <div style={{ marginTop: '15px', fontSize: '0.75rem', color: '#777', textAlign: 'center', lineHeight: '1.4' }}>
                            Dengan melanjutkan pembayaran, kamu menyetujui <span style={{ color: '#FF8C42' }}>S&K</span> NguliKang.
                        </div>
                    </div>

                </div>

            </div>

            {/* ADDRESS MODAL (3 STEPS) */}
            <AnimatePresence>
                {showAddressModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                        }}
                        onClick={() => setShowAddressModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                background: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px',
                                width: '100%', maxWidth: '700px', height: '600px', display: 'flex', flexDirection: 'column',
                                overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* HEADER STEPS */}
                            <div style={{ padding: '20px', borderBottom: '1px solid #3f3f46', background: '#1f1f23' }}>
                                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px', color: 'white' }}>
                                    {addressStep === 1 && "Cari Lokasi"}
                                    {addressStep === 2 && "Tentukan Titik Lokasi"}
                                    {addressStep === 3 && "Lengkapi Detail Alamat"}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                    {[1, 2, 3].map(step => (
                                        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '30px', height: '30px', borderRadius: '50%',
                                                background: addressStep >= step ? '#FF8C42' : '#3f3f46',
                                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', fontSize: '0.9rem',
                                                border: addressStep === step ? '2px solid white' : 'none'
                                            }}>
                                                {step}
                                            </div>
                                            {step < 3 && <div style={{ width: '60px', height: '2px', background: addressStep > step ? '#FF8C42' : '#3f3f46' }} />}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setShowAddressModal(false)}
                                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* BODY CONTENT */}
                            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

                                {/* STEP 1: SEARCH */}
                                {addressStep === 1 && (
                                    <div style={{ padding: '24px' }}>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Di mana lokasi tujuan pengirimanmu?</h3>

                                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                                            <input
                                                type="text"
                                                placeholder="Tulis nama jalan / gedung / perumahan"
                                                autoFocus
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}
                                                style={{ width: '100%', padding: '16px 20px', paddingLeft: '50px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                                            />
                                            <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
                                        </div>

                                        <div
                                            onClick={handleUseCurrentLocation}
                                            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', cursor: 'pointer', borderRadius: '12px', border: '1px solid #3f3f46', marginBottom: '20px', background: 'rgba(255, 140, 66, 0.1)' }}
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>📍</span>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#FF8C42' }}>Gunakan Lokasi Saat Ini</div>
                                                <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Aktifkan lokasi untuk akurasi lebih baik</div>
                                            </div>
                                        </div>

                                        {/* Search Results Mock */}
                                        {searchResults.length > 0 && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {searchResults.map(res => (
                                                    <div
                                                        key={res.id}
                                                        onClick={() => handleSelectLocation(res)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', cursor: 'pointer', borderRadius: '12px', borderBottom: '1px solid #27272a', transition: 'background 0.2s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = '#27272a'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <span style={{ fontSize: '1.2rem', color: '#a1a1aa' }}>🏢</span>
                                                        <div>
                                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>{res.main}</div>
                                                            <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{res.secondary}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STEP 2: PINPOINT (MAP) */}
                                {addressStep === 2 && (
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ flex: 1, position: 'relative', background: '#18181b' }}>
                                            {/* Fake Interactive Map */}
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                scrolling="no"
                                                marginHeight="0"
                                                marginWidth="0"
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(tempAddress.detail || 'Jakarta')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                                style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
                                            ></iframe>

                                            {/* Center Pin Overlay */}
                                            <div style={{
                                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)',
                                                zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    background: '#FF8C42', color: 'white', padding: '8px 12px', borderRadius: '8px',
                                                    fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'
                                                }}>
                                                    Lokasi Terpilih
                                                </div>
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="#FF8C42" stroke="white" strokeWidth="2">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                    <circle cx="12" cy="10" r="3" fill="white"></circle>
                                                </svg>
                                            </div>

                                            {/* Instructions Overlay */}
                                            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '30px', color: 'white', fontSize: '0.9rem', backdropFilter: 'blur(5px)' }}>
                                                Geser peta untuk menyesuaikan titik
                                            </div>
                                        </div>

                                        <div style={{ padding: '24px', borderTop: '1px solid #3f3f46', background: '#1f1f23' }}>
                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Alamat terpilih:</div>
                                                <div style={{ fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>{tempAddress.detail || "Jakarta Pusat"}</div>
                                            </div>
                                            <button
                                                onClick={() => setAddressStep(3)}
                                                style={{ width: '100%', padding: '16px', background: '#FF8C42', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                                            >
                                                Pilih Lokasi Ini
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: DETAILS */}
                                {addressStep === 3 && (
                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px' }}>Label Alamat (Contoh: Rumah, Kantor)</label>
                                            <input
                                                type="text"
                                                value={tempAddress.label}
                                                onChange={e => setTempAddress({ ...tempAddress, label: e.target.value })}
                                                style={{ width: '100%', padding: '14px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: 'white', outline: 'none' }}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px' }}>Nama Penerima</label>
                                                <input
                                                    type="text"
                                                    value={tempAddress.recipient}
                                                    onChange={e => setTempAddress({ ...tempAddress, recipient: e.target.value })}
                                                    style={{ width: '100%', padding: '14px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px' }}>Nomor HP</label>
                                                <input
                                                    type="text"
                                                    value={tempAddress.phone}
                                                    onChange={e => setTempAddress({ ...tempAddress, phone: e.target.value })}
                                                    style={{ width: '100%', padding: '14px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: 'white', outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px' }}>Alamat Lengkap</label>
                                            <textarea
                                                rows="4"
                                                value={tempAddress.detail}
                                                onChange={e => setTempAddress({ ...tempAddress, detail: e.target.value })}
                                                style={{ width: '100%', padding: '14px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: 'white', outline: 'none', resize: 'vertical' }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
                                            <button
                                                onClick={() => setAddressStep(2)}
                                                style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid #3f3f46', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Kembali
                                            </button>
                                            <button
                                                onClick={handleSaveAddress}
                                                style={{ flex: 2, padding: '16px', background: '#FF8C42', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Simpan Alamat
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;
