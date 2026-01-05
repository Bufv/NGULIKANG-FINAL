import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NegotiationSection = ({ team, onProceed, initialOffer = 150000000 }) => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'team', text: 'Halo! Terima kasih telah memilih tim kami. Ada yang bisa kami bantu untuk detail proyeknya?', time: '10:00' },
        { id: 2, sender: 'system', text: `Negosiasi dimulai. Estimasi awal: Rp ${initialOffer.toLocaleString('id-ID')}`, time: '10:00' }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [initialEstimate] = useState(initialOffer);
    const [currentTotal, setCurrentTotal] = useState(initialOffer);

    const [negoAmount, setNegoAmount] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, {
                id: Date.now(),
                sender: 'user',
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setNewMessage("");

            // Simulate auto-reply if needed
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'team',
                    text: 'Terima kasih atas pesannya. Kami akan segera merespons.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 2000);
        }
    };

    const handleSubmitNego = () => {
        if (!negoAmount) return;

        let numericAmount = parseInt(negoAmount.replace(/\./g, ''));
        if (isNaN(numericAmount)) return;

        // Auto-correct: If value is small (< 1000), assume it's in Millions
        if (numericAmount < 1000) {
            numericAmount = numericAmount * 1000000;
        }

        // 1. Add User Message
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: `Saya mengajukan penawaran baru sebesar Rp ${numericAmount.toLocaleString('id-ID')}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // 2. Set new Total immediately (or could wait for approval)
        setCurrentTotal(numericAmount);
        setNegoAmount("");

        // 3. Add System Response
        const systemMsg = {
            id: Date.now() + 1,
            sender: 'system',
            text: `Penawaran baru diterima: Rp ${numericAmount.toLocaleString('id-ID')}. Menunggu konfirmasi tim.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg, systemMsg]);
    };

    const handleNegoChange = (e) => {
        // Remove non-numeric characters
        const rawValue = e.target.value.replace(/\D/g, '');
        if (rawValue === "") {
            setNegoAmount("");
            return;
        }
        // Format with dots
        const formattedValue = new Intl.NumberFormat('id-ID').format(rawValue);
        setNegoAmount(formattedValue);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}
        >
            {/* LEFT COLUMN: CHAT INTERFACE */}
            <div style={{
                background: 'rgba(30,30,30,0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                height: '700px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Chat Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={team?.image} alt={team?.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#4CAF50', borderRadius: '50%', border: '2px solid #222' }}></div>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{team?.name}</h3>
                        <div style={{ color: '#888', fontSize: '0.85rem' }}>Sedang Online • Biasanya membalas dalam 5 menit</div>
                    </div>
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            {msg.sender === 'system' ? (
                                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', margin: '10px 0', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '100px', alignSelf: 'center', width: 'fit-content', margin: '0 auto' }}> {msg.text} </div>
                            ) : (
                                <div style={{
                                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #FF8C42, #F76B1C)' : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    padding: '12px 18px',
                                    borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}>
                                    {msg.text}
                                </div>
                            )}
                            {msg.sender !== 'system' && <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Ketik pesan untuk negosiasi..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', outline: 'none' }}
                        />
                        <button
                            onClick={handleSendMessage}
                            style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FF8C42', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: COST BREAKDOWN & ACTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Cost Detail Card */}
                <div style={{
                    background: 'rgba(30,30,30,0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '25px'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Rincian Biaya</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
                        <span>Estimasi Material (55%)</span>
                        <span>Rp {(currentTotal * 0.55).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#ccc' }}>
                        <span>Jasa Tukang (40%)</span>
                        <span>Rp {(currentTotal * 0.40).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#ccc' }}>
                        <span>Biaya Platform (5%)</span>
                        <span>Rp {(currentTotal * 0.05).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total Saat Ini</span>
                        <span style={{ color: '#FF8C42' }}>Rp {currentTotal.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Negotiation Action Card */}
                <div style={{
                    background: 'rgba(30,30,30,0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '25px'
                }}>
                    <h4 style={{ margin: '0 0 15px 0', color: 'white' }}>Ajukan Penawaran Baru</h4>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>Rp</span>
                        <input
                            type="text"
                            placeholder="Contoh: 140.000.000"
                            value={negoAmount}
                            onChange={handleNegoChange}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px 15px 15px 45px', color: 'white', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>
                    <button
                        onClick={handleSubmitNego}
                        style={{ width: '100%', background: 'transparent', border: '1px solid #FF8C42', color: '#FF8C42', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.target.style.background = '#FF8C42'; e.target.style.color = 'white'; }}
                        onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#FF8C42'; }}
                    >
                        Ajukan Nego
                    </button>
                </div>

                <button
                    onClick={() => onProceed(currentTotal)}
                    style={{ width: '100%', background: '#4CAF50', border: 'none', color: 'white', padding: '20px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)' }}
                >
                    <span>✓</span> Sepakati & Lanjut Bayar
                </button>

            </div>
        </motion.div>
    );
};

export default NegotiationSection;
