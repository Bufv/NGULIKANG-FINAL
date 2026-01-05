import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentSection = ({ team, finalPrice, onPaymentComplete, projectType = "Paket Borongan" }) => {
    const [selectedMethod, setSelectedMethod] = useState('bca');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        { id: 'bca', name: 'Bank BCA', icon: '🏦', account: '8830-1234-5678', holder: 'PT Nguli Kang Indonesia' },
        { id: 'mandiri', name: 'Bank Mandiri', icon: '🏦', account: '123-00-9876543-2', holder: 'PT Nguli Kang Indonesia' },
        { id: 'gopay', name: 'GoPay', icon: '💳', account: '0812-3456-7890', holder: 'NguliKang Admin' },
        { id: 'qris', name: 'QRIS', icon: '📱', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png' } // Placeholder QR
    ];

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment process
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentComplete();
        }, 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}
        >
            {/* LEFT COLUMN: PAYMENT METHODS */}
            <div style={{
                background: 'rgba(30,30,30,0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '30px'
            }}>
                <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '1.5rem' }}>Pilih Metode Pembayaran</h2>

                <div style={{ display: 'grid', gap: '15px' }}>
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '20px',
                                borderRadius: '16px',
                                border: selectedMethod === method.id ? '2px solid #FF8C42' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedMethod === method.id ? 'rgba(255, 140, 66, 0.1)' : 'rgba(255,255,255,0.03)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem' }}>{method.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'white', fontWeight: 'bold' }}>{method.name}</div>
                                {method.account && <div style={{ color: '#888', fontSize: '0.9rem' }}>{method.account}</div>}
                            </div>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: selectedMethod === method.id ? '5px solid #FF8C42' : '2px solid #666',
                                background: 'transparent'
                            }}></div>
                        </div>
                    ))}
                </div>

                {/* QRIS DISPLAY */}
                {selectedMethod === 'qris' && (
                    <div style={{ marginTop: '30px', textAlign: 'center', background: 'white', padding: '20px', borderRadius: '16px' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" style={{ width: '200px', height: '200px' }} />
                        <p style={{ color: '#333', marginTop: '10px', fontWeight: 'bold' }}>Scan untuk membayar</p>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: SUMMARY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                    background: 'rgba(30,30,30,0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '25px'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Ringkasan Pembayaran</h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <img src={team?.image} alt={team?.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                            <div style={{ color: 'white', fontWeight: 'bold' }}>{team?.name}</div>
                            <div style={{ color: '#888', fontSize: '0.8rem' }}>{projectType}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
                        <span>Total Pembayaran</span>
                        <span style={{ color: '#FF8C42', fontWeight: 'bold', fontSize: '1.2rem' }}>{finalPrice}</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
                        *Pembayaran aman melalui Rekening Bersama NguliKang. Dana baru diteruskan ke tukang setelah progress tervalidasi.
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    style={{
                        width: '100%',
                        background: isProcessing ? '#333' : '#FF8C42',
                        border: 'none',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        fontSize: '1.1rem',
                        boxShadow: '0 10px 30px rgba(255, 140, 66, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    {isProcessing ? (
                        <>
                            <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                            Memproses...
                        </>
                    ) : (
                        <>
                            🔒 Bayar Sekarang
                        </>
                    )}
                </button>
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        </motion.div >
    );
};

export default PaymentSection;
