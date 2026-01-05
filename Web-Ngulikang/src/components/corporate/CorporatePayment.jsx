import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CorporatePayment = ({ onPaymentComplete, onBackToNegotiation }) => {

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', alignItems: 'start', padding: '20px 0' }}>

            {/* LEFT: SUMMARY CARD & MENU */}
            <div>
                {/* Gradient Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        background: 'linear-gradient(135deg, #FFAA6E 0%, #FF6B35 100%)',
                        borderRadius: '24px',
                        padding: '30px',
                        color: 'white',
                        boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)',
                        marginBottom: '30px'
                    }}
                >
                    <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '5px' }}>Sisa Tagihan Kontrak</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '20px' }}>Rp 51.126.600</div>

                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem' }}>Total Proyek</span>
                        <span style={{ fontWeight: 'bold' }}>Rp 73.038.000</span>
                    </div>
                </motion.div>

                {/* Sidebar Menu */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                        style={{
                            background: 'rgba(255, 140, 66, 0.15)',
                            padding: '16px 24px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            color: '#FF8C42',
                            border: '1px solid #FF8C42',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                background: '#FF8C42',
                                borderRadius: '0 4px 4px 0'
                            }}
                        />
                        <span style={{ fontSize: '1.2rem' }}>💳</span>
                        <span style={{ fontWeight: 'bold' }}>Invoice & Pembayaran</span>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBackToNegotiation}
                        style={{
                            background: 'transparent',
                            padding: '16px 24px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            color: '#888',
                            border: '1px solid #333',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>💬</span>
                        <span>Negosiasi & Chat</span>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT: INVOICE LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>Pembayaran & Invoice</h2>

                {/* Item 1: LUNAS */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ background: '#181818', borderRadius: '20px', padding: '24px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '50px', height: '50px', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontWeight: 'bold' }}>01</div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>Down Payment (30%)</div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>#INV-2024-001 • 15 Des 2024</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#ccc', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>Rp 21.911.400</div>
                        <span style={{ background: '#1b3e20', color: '#4CAF50', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold' }}>LUNAS</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ background: 'transparent', border: '1px solid #444', color: '#aaa', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>⬇</button>
                    </div>
                </motion.div>

                {/* Item 2: ACTIVE */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        background: '#1E140F',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid #FF8C42',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 0 30px rgba(255, 140, 66, 0.05)'
                    }}
                >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '50px', height: '50px', background: 'rgba(255, 140, 66, 0.2)', color: '#FF8C42', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>02</div>
                        <div>
                            <div style={{ color: '#FF8C42', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>Termin Progress (40%)</div>
                            <div style={{ color: '#888', fontSize: '0.85rem' }}>#INV-2024-002 • Jatuh Tempo Hari Ini</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#FF8C42', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>Rp 29.215.200</div>
                        <div style={{ color: '#c62828', fontSize: '0.75rem' }}>Bayar sebelum 23 Des</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>⬇</button>
                        <button
                            onClick={onPaymentComplete}
                            style={{ background: '#FF8C42', border: 'none', color: 'white', padding: '12px 24px', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                </motion.div>

                {/* Item 3: LOCKED */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ background: '#121212', borderRadius: '20px', padding: '24px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}
                >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '50px', height: '50px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontWeight: 'bold' }}>03</div>
                        <div>
                            <div style={{ color: '#888', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>Pelunasan + Retensi (30%)</div>
                            <div style={{ color: '#555', fontSize: '0.85rem' }}>Menunggu Handover (BAST 1)</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#666', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>Rp 21.911.400</div>
                        <span style={{ background: '#333', color: '#666', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold' }}>LOCKED</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ background: 'transparent', border: '1px solid #333', color: '#444', width: '40px', height: '40px', borderRadius: '50%', cursor: 'not-allowed' }}>🔒</button>
                    </div>
                </motion.div>

                {/* INFO BOX */}
                <div style={{ background: 'rgba(30, 40, 60, 0.4)', border: '1px solid rgba(80, 120, 200, 0.2)', padding: '20px', borderRadius: '16px', marginTop: '10px', display: 'flex', gap: '15px' }}>
                    <div style={{ fontSize: '1.2rem', color: '#4285F4' }}>ℹ</div>
                    <div>
                        <h4 style={{ color: '#4285F4', margin: '0 0 5px 0' }}>Informasi Pajak</h4>
                        <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                            Faktur Pajak akan diterbitkan otomatis 3 hari kerja setelah pembayaran diverifikasi. Bukti potong PPh 23 dapat diupload setelah pelunasan.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CorporatePayment;
