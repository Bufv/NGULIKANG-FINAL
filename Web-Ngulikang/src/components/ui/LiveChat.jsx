import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getAccessToken } from '../../lib/api';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: 'Halo! Ada yang bisa kami bantu seputar kebutuhan tukang atau konstruksi Anda hari ini? 👷‍♂️', sender: 'agent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const [socket, setSocket] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [user, setUser] = useState(null);
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    // 1. Connect to Socket.io and Load Chat when Open
    useEffect(() => {
        // Decode user from token to know "who am I"
        const token = getAccessToken();
        let myId = null;
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Adjust this depending on your JWT structure. Usually 'sub' or 'id'
                myId = payload.sub || payload.id;
                setUser({ id: myId });
            } catch (e) { }
        }

        if (isOpen && !socket) {
            import('socket.io-client').then(({ io }) => {
                const newSocket = io(socketUrl);
                setSocket(newSocket);

                newSocket.on('connect', () => {
                    console.log('Connected to socket server');
                });

                newSocket.on('receive_message', (msg) => {
                    setMessages(prev => {
                        // 1. Avoid duplicates by ID
                        if (prev.some(m => m.id === msg.id)) return prev;

                        // 2. Avoid duplicates from Self (Optimistic UI already showed it)
                        // If the message sender is ME, ignore it (since we added it optimistically)
                        if (myId && msg.senderId === myId) return prev;

                        return [...prev, {
                            id: msg.id,
                            text: msg.content,
                            sender: msg.senderId === myId ? 'user' : 'agent',
                            time: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }];
                    });
                });

                // Initialize Chat Room via API
                initializeChat(newSocket);
            });
        }
    }, [isOpen]);

    const initializeChat = async (activeSocket) => {
        const token = getAccessToken();
        if (!token) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: 'Silakan login terlebih dahulu untuk memulai chat dengan admin. 🙏',
                sender: 'agent',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            return;
        }

        try {
            // Use axios instance api to handle headers
            const { data } = await api.post('/chat/admin/start');

            if (data.id) {
                setRoomId(data.id);
                // Join socket room
                activeSocket.emit('join_room', data.id);

                // Fetch previous messages
                fetchMessages(data.id);
            }
        } catch (error) {
            console.error('Failed to init chat', error);
        }
    };

    const fetchMessages = async (id) => {
        try {
            const { data } = await api.get(`/chat/${id}/messages`);

            // Format messages
            const formatted = data.map(m => ({
                id: m.id,
                text: m.content,
                sender: m.sender.role === 'admin' ? 'agent' : 'user',
                time: new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

            // Merge with initial greeting if needed
            setMessages(prev => {
                // Keep the first welcome message if it exists and hasn't been added yet
                const existingIds = new Set(prev.map(p => p.id));
                const newMsgs = formatted.filter(f => !existingIds.has(f.id));
                return [...prev, ...newMsgs];
            });
        } catch (e) { console.error(e); }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Optimistic UI update
        const tempId = Date.now();
        const newUserMsg = {
            id: tempId,
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(false);

        if (socket && roomId) {
            const token = getAccessToken();
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const senderId = payload.sub;

                    socket.emit('send_message', {
                        roomId,
                        senderId,
                        content: newUserMsg.text
                    });
                } catch (e) { console.error("Token parse error", e); }
            }
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
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
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

                            {messages.map((msg) => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%'
                                }}>
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
                                    <div style={{
                                        fontSize: '0.65rem',
                                        color: '#666',
                                        marginTop: '4px',
                                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                                        padding: '0 4px'
                                    }}>
                                        {msg.time}
                                    </div>
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
