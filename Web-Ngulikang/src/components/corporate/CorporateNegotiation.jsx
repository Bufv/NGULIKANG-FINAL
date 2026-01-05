import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CorporateNegotiation = ({ onProceed }) => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'agent', name: 'Ahmad Rizky', role: 'Senior AM • PT. Nguli Karya', text: 'Selamat pagi Pak, berikut saya update penawaran revisi ke-3. Sudah saya tambahkan 15 titik stop kontak lantai sesuai request.', file: 'Quotation_Rev3.pdf', time: '10:30 AM' },
        { id: 2, sender: 'user', text: 'Oke Pak Ahmad, saya cek dulu ya. Untuk carpet tile-nya pakai merek apa ya di RAB ini?', time: '10:35 AM' },
        { id: 3, sender: 'agent', name: 'Ahmad Rizky', role: 'Senior AM • PT. Nguli Karya', text: 'Kita pakai merek Voxflor atau setara Pak, standard untuk office grade A yang tahan penggunaan kursi roda.', time: '10:36 AM' }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [revisionText, setRevisionText] = useState("");

    const quotationItems = [
        { desc: 'A. PERSIAPAN & PEMBONGKARAN', isHeader: true },
        { desc: 'Bongkar partisi lama & pembersihan area', qty: '1', unit: 'Ls', total: '3.500.000' },
        { desc: 'Proteksi lantai existing', qty: '80', unit: 'm2', total: '1.200.000' },
        { desc: 'B. PEKERJAAN INTERIOR & FIT-OUT', isHeader: true },
        { desc: 'Partisi Gypsum 2 Muka (Rangka Hollow Galv)', qty: '65', unit: 'm2', total: '14.300.000' },
        { desc: 'Pintu Kaca Frameless 12mm Patch Fitting', qty: '2', unit: 'Unit', total: '9.000.000' },
        { desc: 'Carpet Tile (Standard Office)', qty: '80', unit: 'm2', total: '28.000.000' },
        { desc: 'C. MEKANIKAL & ELEKTRIKAL', isHeader: true },
        { desc: 'Titik Stop Kontak Lantai', qty: '15', unit: 'Titik', total: '4.500.000' },
        { desc: 'Lampu LED Panel 60x60', qty: '12', unit: 'Titik', total: '3.600.000' },
    ];

    const handleRevisionSubmit = () => {
        if (revisionText.trim()) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setMessages([...messages, {
                id: messages.length + 1,
                sender: 'user',
                text: `📝 Request Revisi: ${revisionText}`,
                time: timeStr
            }]);
            setRevisionText("");
            setShowRevisionModal(false);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setMessages([...messages, {
                id: messages.length + 1,
                sender: 'user',
                text: newMessage,
                time: timeStr
            }]);
            setNewMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '20px', height: '75vh', maxWidth: '1400px', margin: '0 auto' }}>

                {/* LEFT: QUOTATION DOCUMENT */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ background: '#1E1E1E', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', color: '#888', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📄 Penawaran Harga (V3) - Renovasi Lantai 2</span>
                        </div>
                        <div>Download PDF • Print</div>
                    </div>

                    {/* PAPER */}
                    <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        color: '#333',
                        flex: 1,
                        overflowY: 'auto',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <div>
                                <h2 style={{ color: '#FF8C42', margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>NGULIKANG</h2>
                                <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.8rem' }}>PT. Nguli Karya Semesta</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>QUOTATION</h2>
                                <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.8rem' }}>#Q-2024-882</p>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: '#f5f7fa', color: '#666', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #eee' }}>DESKRIPSI PEKERJAAN</th>
                                    <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #eee' }}>QTY</th>
                                    <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid #eee' }}>UNIT</th>
                                    <th style={{ padding: '10px 8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>TOTAL (IDR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotationItems.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        {item.isHeader ? (
                                            <td colSpan="4" style={{ padding: '12px 8px 5px', fontWeight: 'bold', color: '#333', fontSize: '0.85rem' }}>{item.desc}</td>
                                        ) : (
                                            <>
                                                <td style={{ padding: '8px', color: '#555' }}>{item.desc}</td>
                                                <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>{item.qty}</td>
                                                <td style={{ padding: '8px', textAlign: 'center', color: '#555' }}>{item.unit}</td>
                                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: '500' }}>{item.total}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: '30px', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Estimasi</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Rp 73.038.000</div>
                            <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', marginTop: '5px' }}>*Harga sudah termasuk PPN 11%</div>
                        </div>
                    </div>

                    {/* ACTION BAR FLOAT */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-30px', position: 'relative', zIndex: 10 }}>
                        <div style={{
                            background: '#333',
                            padding: '10px 20px',
                            borderRadius: '100px',
                            display: 'flex',
                            gap: '15px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                            <button
                                onClick={() => setShowRevisionModal(true)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #888',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '100px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => { e.target.style.borderColor = '#FF8C42'; e.target.style.color = '#FF8C42'; }}
                                onMouseOut={(e) => { e.target.style.borderColor = '#888'; e.target.style.color = 'white'; }}
                            >
                                Ajukan Revisi
                            </button>
                            <button
                                onClick={onProceed}
                                style={{
                                    background: 'linear-gradient(45deg, #FF8C42, #FF6B00)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '10px 30px',
                                    borderRadius: '100px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 5px 15px rgba(255,140,66,0.3)'
                                }}
                            >
                                Setujui & Bayar DP
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: CHAT */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ background: '#1E1E1E', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    {/* Header */}
                    <div style={{ padding: '16px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" alt="AM" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                            <div style={{ fontWeight: 'bold', color: 'white', fontSize: '0.95rem' }}>Ahmad Rizky</div>
                            <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                Senior AM • PT. Nguli Karya <span style={{ width: '6px', height: '6px', background: '#4CAF50', borderRadius: '50%', display: 'inline-block' }}></span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#555', margin: '10px 0' }}>
                            <span style={{ background: '#2c2c2c', padding: '4px 12px', borderRadius: '100px' }}>Hari Ini</span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                {msg.sender === 'agent' && (
                                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '5px', marginLeft: '5px' }}>{msg.name}</div>
                                )}
                                <div style={{
                                    background: msg.sender === 'user' ? '#FF8C42' : '#333',
                                    color: msg.sender === 'user' ? 'white' : '#ddd',
                                    padding: '12px',
                                    borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '0 16px 16px 16px',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                    {msg.file && (
                                        <div style={{
                                            marginTop: '10px',
                                            background: 'rgba(0,0,0,0.2)',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', color: '#FF5252' }}>📄</div>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{msg.file}</div>
                                                <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>1.4 MB</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                                    {msg.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '16px', borderTop: '1px solid #333' }}>
                        <div style={{
                            background: '#2c2c2c',
                            borderRadius: '24px',
                            padding: '12px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <input
                                type="text"
                                placeholder="Tulis pesan negosiasi..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                style={{
                                    background: newMessage.trim() ? '#FF8C42' : '#666',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    color: 'white',
                                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* REVISION MODAL */}
            <AnimatePresence>
                {showRevisionModal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 10003,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                background: 'rgba(25, 25, 25, 0.65)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '30px',
                                borderRadius: '24px',
                                maxWidth: '500px',
                                width: '100%',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <h3 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '1.3rem' }}>Ajukan Revisi Penawaran</h3>
                            <p style={{ margin: '0 0 20px 0', color: '#aaa', fontSize: '0.9rem' }}>Tuliskan detail revisi yang Anda inginkan, kami akan memproses dan mengirimkan quotation terbaru.</p>

                            <textarea
                                value={revisionText}
                                onChange={(e) => setRevisionText(e.target.value)}
                                placeholder="Contoh: Tolong ganti carpet tile menjadi merek Shaw Contract, dan tambahkan 5 titik lampu LED di area meeting room."
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    background: '#2c2c2c',
                                    border: '1px solid #444',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button
                                    onClick={() => { setShowRevisionModal(false); setRevisionText(""); }}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'transparent',
                                        border: '1px solid #666',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleRevisionSubmit}
                                    disabled={!revisionText.trim()}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: revisionText.trim() ? 'linear-gradient(45deg, #FF8C42, #FF6B00)' : '#555',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: revisionText.trim() ? 'pointer' : 'not-allowed',
                                        boxShadow: revisionText.trim() ? '0 5px 15px rgba(255,140,66,0.3)' : 'none'
                                    }}
                                >
                                    Kirim Request
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CorporateNegotiation;
