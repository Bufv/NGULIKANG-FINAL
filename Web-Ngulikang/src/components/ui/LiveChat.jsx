import { api, getAccessToken } from '../../lib/api';
import { io } from 'socket.io-client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [userId, setUserId] = useState(null);

    const [isConnecting, setIsConnecting] = useState(false);
    const [alertConfig, setAlertConfig] = useState(null); // { type: 'success'|'error'|'confirm', message: '', onConfirm: () => {} }
    const messagesEndRef = useRef(null);

    const showAlert = (message, type = 'error') => {
        setAlertConfig({ type, message });
        if (type !== 'confirm') {
            setTimeout(() => setAlertConfig(null), 3000);
        }
    };

    const showConfirm = (message, onConfirm) => {
        setAlertConfig({ type: 'confirm', message, onConfirm });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-live-chat', handleOpenChat);
        return () => window.removeEventListener('open-live-chat', handleOpenChat);
    }, []);

    // Initialize Chat
    useEffect(() => {
        const initChat = async () => {
            const userData = localStorage.getItem('ngulikang_user');
            if (userData) {
                const u = JSON.parse(userData);
                setUserId(u.id);
            }

            const token = getAccessToken();
            if (!token) return;

            setIsConnecting(true);

            // 1. Get Support Room
            try {
                // Try create/get support room
                const res = await api.post('/chat/support');
                const room = res.data;
                setRoomId(room.id);

                // 2. Fetch Messages
                const msgRes = await api.get(`/chat/rooms/${room.id}/messages`);
                setMessages(msgRes.data.map(formatMessage));

                // 3. Connect Socket
                const newSocket = io(SOCKET_URL, {
                    auth: { token: `Bearer ${token}` },
                    transports: ['websocket', 'polling']
                });

                newSocket.on('connect', () => {
                    console.log('Widget Socket connected');
                    newSocket.emit('join_room', room.id);
                });

                newSocket.on('receive_message', (msg) => {
                    if (msg.roomId === room.id) {
                        setMessages(prev => {
                            if (prev.find(m => m.id === msg.id)) return prev;

                            // Check for temp message with same content from 'user'
                            // This is a naive check but works for optimistic updates
                            const isUser = msg.sender.role === 'user';
                            const formatted = formatMessage(msg);

                            if (isUser) {
                                // Find if we have a temp message with same text sent recently
                                const tempMatch = prev.find(m =>
                                    m.id.toString().startsWith('temp-') &&
                                    m.text === formatted.text &&
                                    m.sender === 'user'
                                );
                                if (tempMatch) {
                                    // Replace temp with real
                                    return prev.map(m => m.id === tempMatch.id ? formatted : m);
                                }
                            }

                            return [...prev, formatted];
                        });
                    }
                });

                setSocket(newSocket);
                setIsConnecting(false);

                return () => newSocket.disconnect();
            } catch (err) {
                console.error("Failed to init chat widget", err);
                setIsConnecting(false);
            }
        };

        if (isOpen && !socket && !isConnecting) {
            initChat();
        }
    }, [isOpen]);

    const formatMessage = (msg) => {
        let text = msg.content;
        let type = msg.type || 'TEXT';

        try {
            if (text && text.trim().startsWith('{')) {
                const parsed = JSON.parse(text);
                if (parsed.type === 'ACTION_CLOSE') {
                    text = parsed.text;
                    type = parsed.type;
                }
            }
        } catch (e) { }

        return {
            id: msg.id,
            text,
            sender: msg.sender.role === 'admin' ? 'agent' : 'user',
            time: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type
        };
    };

    const handleCloseChat = async () => {
        try {
            await api.put(`/chat/rooms/${roomId}/close`);
            setMessages([]);
            setRoomId(null);
            setIsOpen(false);
            showAlert("Chat telah ditutup.", "success");
        } catch (err) {
            console.error("Gagal menutup chat", err);
            showAlert("Gagal menutup chat.");
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        if (isConnecting) {
            return;
        }

        if (!socket || !roomId) {
            console.error("Chat not initialized. Not logged in or connecting...");
            showAlert("Gagal terhubung ke layanan chat. Silakan refresh halaman.");
            return;
        }

        const contentToSend = inputValue;
        setInputValue('');

        // Optimistic Update
        const tempId = 'temp-' + Date.now();
        const optimisticMsg = {
            id: tempId,
            text: contentToSend,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'TEXT'
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const data = {
            roomId,
            content: contentToSend
        };

        socket.emit('send_message', data, (response) => {
            if (response && response.status === 'error') {
                console.error("Failed to send message:", response.error);
                showAlert("Gagal mengirim pesan. Silakan coba lagi.");
                // Remove the optimistic message if failed
                setMessages(prev => prev.filter(m => m.id !== tempId));
            } else {
                // Success: The real message will come via 'receive_message' event.
                // We could replace the temp message here, but simpler is to let receive_message deduplicate
                // logic handle it (but IDs won't match).
                // Ideally, receive_message should replace the temp message.
                // For now, let's just keep strict: if we get a receive_message with same content/time?
                // Or just depend on `receive_message` and remove temp one? 

                // Let's rely on the fact that `receive_message` will come.
                // We'll filter out the temp message when we get the real one? 
                // Currently receive_message appends.
                // So we might get duplicates: 1 temp, 1 real.
                // To fix: In receive_message, check if we have a temp message with same text sent recently and replace it.
            }
        });

        // Auto-reply logic for first message
        if (messages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                const autoReply = {
                    id: Date.now() + 1,
                    text: 'Mohon tunggu sebentar, admin sedang menghubungkan...',
                    sender: 'agent', // Display as agent/system
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'TEXT'
                };
                setMessages(prev => [...prev, autoReply]);
                setIsTyping(false);
            }, 1000);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: '"Inter", sans-serif' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: '0',
                            width: '350px',
                            height: '500px',
                            background: 'rgba(26, 26, 26, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 140, 66, 0.3)',
                            borderRadius: '24px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Custom Alert Overlay */}
                        <AnimatePresence>
                            {alertConfig && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 50,
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '20px'
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0.8, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.8, y: 20 }}
                                        style={{
                                            background: 'rgba(26, 26, 26, 0.9)',
                                            border: '1px solid rgba(255, 140, 66, 0.5)',
                                            borderRadius: '16px',
                                            padding: '24px',
                                            textAlign: 'center',
                                            maxWidth: '280px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        <div style={{
                                            marginBottom: '16px',
                                            color: alertConfig.type === 'error' ? '#ef4444' :
                                                alertConfig.type === 'success' ? '#10b981' : '#FF8C42'
                                        }}>
                                            {alertConfig.type === 'confirm' ? (
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                            ) : alertConfig.type === 'success' ? (
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            ) : (
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                            )}
                                        </div>
                                        <p style={{ color: '#e4e4e7', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                            {alertConfig.message}
                                        </p>

                                        {alertConfig.type === 'confirm' ? (
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => setAlertConfig(null)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        alertConfig.onConfirm();
                                                        setAlertConfig(null);
                                                    }}
                                                    style={{
                                                        background: '#FF8C42',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Ya, Tutup
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAlertConfig(null)}
                                                style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '8px 20px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    width: '100%'
                                                }}
                                            >
                                                Tutup
                                            </button>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, #FF8C42, #FF6B00)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: 'white'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FF8C42'
                                    }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        right: '0',
                                        width: '10px',
                                        height: '10px',
                                        background: '#4ade80',
                                        borderRadius: '50%',
                                        border: '2px solid #FF8C42'
                                    }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>CS NguliKang</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Online • Siap Membantu</div>
                                </div>
                            </div>
                            <div style={{ padding: '0 10px' }}>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div style={{
                            flex: 1,
                            padding: '20px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#666', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px' }}>Hari ini</span>
                            </div>

                            {/* Welcome Message if empty */}
                            {messages.length === 0 && (
                                <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#e4e4e7',
                                        padding: '12px 16px',
                                        borderRadius: '20px 20px 20px 0',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.4'
                                    }}>
                                        Halo! Ada yang bisa kami bantu? Apa keluhan atau pertanyaan Anda hari ini?
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '4px', padding: '0 4px' }}>System</div>
                                </div>
                            )}

                            {messages.map((msg) => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    width: msg.type === 'ACTION_CLOSE' ? '100%' : 'auto'
                                }}>
                                    {msg.type === 'ACTION_CLOSE' ? (
                                        <div style={{
                                            background: 'rgba(255, 140, 66, 0.15)',
                                            border: '1px solid rgba(255, 140, 66, 0.5)',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '12px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ color: '#e4e4e7', fontSize: '0.95rem' }}>{msg.text}</div>
                                            <button
                                                onClick={handleCloseChat}
                                                style={{
                                                    background: '#FF8C42',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 20px',
                                                    borderRadius: '50px',
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Ya, Saya Ingin Menutup Chat
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{
                                            background: msg.sender === 'user' ? '#FF8C42' : 'rgba(255,255,255,0.1)',
                                            color: msg.sender === 'user' ? 'white' : '#e4e4e7',
                                            padding: '12px 16px',
                                            borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            fontSize: '0.95rem',
                                            lineHeight: '1.4'
                                        }}>
                                            {msg.text}
                                        </div>
                                    )}

                                    {msg.type !== 'ACTION_CLOSE' && (
                                        <div style={{
                                            fontSize: '0.65rem',
                                            color: '#666',
                                            marginTop: '4px',
                                            textAlign: msg.sender === 'user' ? 'right' : 'left',
                                            padding: '0 4px'
                                        }}>
                                            {msg.time}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '20px 20px 20px 0' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} style={{
                            padding: '16px',
                            background: 'rgba(0,0,0,0.2)',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            gap: '10px'
                        }}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ketik pesan..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '50px',
                                    padding: '12px 20px',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                style={{
                                    background: '#FF8C42',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '46px',
                                    height: '46px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF8C42, #FF6B00)',
                    border: 'none',
                    boxShadow: isOpen
                        ? '0 0 0 0 rgba(255, 140, 66, 0)'
                        : '0 8px 30px rgba(255, 140, 66, 0.4), 0 0 0 4px rgba(255, 140, 66, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    position: 'relative'
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notification Dot */}
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            width: '18px',
                            height: '18px',
                            background: '#ef4444',
                            borderRadius: '50%',
                            border: '2px solid #1a1a1a'
                        }}
                    />
                )}
            </motion.button>
        </div>
    );
};

export default LiveChat;
