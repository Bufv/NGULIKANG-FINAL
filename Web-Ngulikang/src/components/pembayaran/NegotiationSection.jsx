import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { api, getAccessToken } from '../../lib/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const NegotiationSection = ({ team, onProceed, initialOffer = 150000000, roomId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentTotal, setCurrentTotal] = useState(initialOffer);
    const [negoAmount, setNegoAmount] = useState("");
    const messagesEndRef = useRef(null);
    const [socket, setSocket] = useState(null);

    // Fetch messages and setup socket - EXACTLY like ChatTukang.jsx
    useEffect(() => {
        if (!roomId) return;

        const fetchMessages = async () => {
            try {
                const res = await api.get(`/negotiation/messages/${roomId}`);
                const formatted = res.data.map(msg => ({
                    id: msg.id,
                    text: msg.content,
                    sender: msg.sender.role === 'tukang' ? 'team' : 'user',
                    time: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setMessages(formatted);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        const token = getAccessToken();
        if (token) {
            const newSocket = io(SOCKET_URL, {
                auth: { token: `Bearer ${token}` },
                transports: ['websocket', 'polling']
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
                newSocket.emit('join_room', roomId);
            });

            newSocket.on('receive_message', (message) => {
                const formattedMsg = {
                    id: message.id,
                    text: message.content,
                    sender: message.sender.role === 'tukang' ? 'team' : 'user',
                    time: new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                setMessages(prev => {
                    if (prev.find(m => m.id === message.id)) return prev;
                    return [...prev, formattedMsg];
                });
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const data = {
            roomId: roomId,
            content: newMessage
        };

        socket.emit('send_message', data);
        setNewMessage('');
    };

    const handleSubmitNego = async () => {
        if (!negoAmount || !roomId) return;

        let numericAmount = parseInt(negoAmount.replace(/\./g, ''));
        if (isNaN(numericAmount)) return;

        if (numericAmount < 1000) {
            numericAmount = numericAmount * 1000000;
        }

        const negoText = `Saya mengajukan penawaran baru sebesar Rp ${numericAmount.toLocaleString('id-ID')}`;

        if (socket) {
            socket.emit('send_message', {
                roomId: roomId,
                content: negoText
            });
            setCurrentTotal(numericAmount);
            setNegoAmount("");
        }
    };

    const handleNegoChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        if (rawValue === "") {
            setNegoAmount("");
            return;
        }
        const formattedValue = new Intl.NumberFormat('id-ID').format(rawValue);
        setNegoAmount(formattedValue);
    };

    if (!roomId) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '2px solid rgba(255, 0, 0, 0.3)',
                    borderRadius: '24px',
                    padding: '40px',
                    textAlign: 'center'
                }}
            >
                <h2 style={{ color: '#ff5555', marginBottom: '16px' }}>⚠️ Error: Room ID Tidak Ditemukan</h2>
                <p style={{ color: '#ccc', marginBottom: '20px' }}>
                    Chat room belum dibuat. Silakan kembali ke langkah sebelumnya dan coba lagi.
                </p>
            </motion.div>
        );
    }

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
                        <div style={{ color: '#888', fontSize: '0.85rem' }}>Sedang Online</div>
                    </div>
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {messages.length === 0 && <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Mulai negosiasi...</div>}
                    {messages.map((msg) => (
                        <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            <div style={{
                                background: msg.sender === 'user' ? 'linear-gradient(135deg, #FF8C42, #F76B1C)' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                padding: '12px 18px',
                                borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                fontSize: '0.95rem',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.text}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Ketik pesan..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', color: 'white', outline: 'none' }}
                        />
                        <button
                            type="submit"
                            style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#FF8C42', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            ➤
                        </button>
                    </form>
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
