import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '../components/ui/Particles';

const ChatTukang = ({ onNavigate }) => {
    // --- STATE ---
    const [activeContact, setActiveContact] = useState(1);
    const [messages, setMessages] = useState({
        1: [
            { id: 1, text: 'Halo Pak, bisa minta info untuk renovasi dapur?', sender: 'user', time: '09:00' },
            { id: 2, text: 'Siap Pak, bisa. Rencananya ukuran berapa meter?', sender: 'agent', time: '09:05' },
        ],
        2: [
            { id: 1, text: 'Permisi, apakah tersedia tukang cat untuk hari ini?', sender: 'user', time: 'Yesterday' },
            { id: 2, text: 'Maaf Pak, untuk hari ini jadwal penuh. Besok pagi bagaimana?', sender: 'agent', time: 'Yesterday' }
        ],
        3: [
            { id: 1, text: 'Terima kasih, pekerjaannya sangat rapi!', sender: 'user', time: '2 days ago' }
        ]
    });

    const [contacts] = useState([
        { id: 1, name: 'Budi Santoso', role: 'Mandor Bangunan', avatar: 'https://i.pravatar.cc/150?img=12', online: true, unread: 0, lastMsg: 'Siap Pak, bisa. Rencananya u...' },
        { id: 2, name: 'CS NguliKang', role: 'Customer Service', avatar: 'https://i.pravatar.cc/150?img=68', online: true, unread: 2, lastMsg: 'Maaf Pak, untuk hari ini...' },
        { id: 3, name: 'Ahmad Yani', role: 'Tukang Kayu', avatar: 'https://i.pravatar.cc/150?img=13', online: false, unread: 0, lastMsg: 'Terima kasih, pekerjaannya...' },
    ]);

    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // CHANGED: Use a ref for the SCROLLABLE CONTAINER, not a dummy div at the end
    const messagesContainerRef = useRef(null);

    // --- EFFECTS ---
    useEffect(() => {
        // Instant scroll to bottom when switching contacts
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [activeContact]);

    useEffect(() => {
        // Smooth scroll to bottom when new message is added
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // --- HANDLERS ---
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => ({
            ...prev,
            [activeContact]: [...(prev[activeContact] || []), newMsg]
        }));
        setInputText('');

        // Simulate reply
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replyMsg = {
                id: Date.now() + 1,
                text: getRandomReply(),
                sender: 'agent',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => ({
                ...prev,
                [activeContact]: [...(prev[activeContact] || []), replyMsg]
            }));
        }, 2000);
    };

    const getRandomReply = () => {
        const replies = [
            "Baik Pak, akan kami sampaikan ke tim lapangan.",
            "Bisa dikirimkan foto lokasinya Pak?",
            "Oke Pak, kami cek jadwal dulu ya.",
            "Terima kasih infonya.",
            "Siap laksanakan!",
            "Mohon ditunggu sebentar ya Pak."
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    };

    const currentContact = contacts.find(c => c.id === activeContact);
    const currentMessages = messages[activeContact] || [];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: '#e4e4e7', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <Particles count={30} color="#FF8C42" />
            </div>

            <div style={{
                paddingTop: '180px',
                paddingBottom: '40px',
                maxWidth: '1200px',
                margin: '0 auto',
                paddingLeft: '20px',
                paddingRight: '20px',
                height: '100vh',
                boxSizing: 'border-box',
                display: 'flex',
                gap: '20px'
            }}>

                {/* --- SIDEBAR --- */}
                <div style={{
                    width: '350px',
                    background: 'rgba(24, 24, 27, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Pesan</h2>
                        <div style={{ marginTop: '15px', position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Cari kontak..."
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '12px 40px 12px 16px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <svg
                                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>

                    {/* Contact List */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                        {contacts.map(contact => (
                            <motion.div
                                key={contact.id}
                                onClick={() => setActiveContact(contact.id)}
                                whileHover={{ backgroundColor: 'rgba(255, 140, 66, 0.1)' }}
                                style={{
                                    padding: '12px',
                                    borderRadius: '16px',
                                    marginBottom: '8px',
                                    cursor: 'pointer',
                                    background: activeContact === contact.id ? 'rgba(255, 140, 66, 0.15)' : 'transparent',
                                    border: activeContact === contact.id ? '1px solid rgba(255, 140, 66, 0.3)' : '1px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
                                        <img src={contact.avatar} alt={contact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    {contact.online && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            width: '12px',
                                            height: '12px',
                                            background: '#22c55e',
                                            borderRadius: '50%',
                                            border: '2px solid #18181b'
                                        }} />
                                    )}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontWeight: '600', color: 'white' }}>{contact.name}</div>
                                        {contact.unread > 0 && (
                                            <div style={{
                                                background: '#FF8C42',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                padding: '2px 6px',
                                                borderRadius: '10px'
                                            }}>
                                                {contact.unread}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {contact.lastMsg}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- CHAT AREA --- */}
                <div style={{
                    flex: 1,
                    background: 'rgba(24, 24, 27, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Chat Header */}
                    <div style={{
                        padding: '20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(24, 24, 27, 0.6)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
                                <img src={currentContact.avatar} alt={currentContact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 4px 0', color: 'white' }}>{currentContact.name}</h3>
                                <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                                    {currentContact.role} • {currentContact.online ? <span style={{ color: '#22c55e' }}>Online</span> : 'Offline'}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Messages */}
                    <div
                        ref={messagesContainerRef}
                        style={{
                            flex: 1,
                            padding: '30px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            background: 'radial-gradient(circle at center, rgba(255,140,66,0.03) 0%, transparent 70%)'
                        }}
                    >
                        {currentMessages.map(msg => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%'
                                }}
                            >
                                <div style={{
                                    padding: '16px 24px',
                                    borderRadius: msg.sender === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                                    background: msg.sender === 'user'
                                        ? 'linear-gradient(135deg, #FF8C42, #FF6B00)'
                                        : 'rgba(255, 255, 255, 0.08)',
                                    color: 'white', // msg.sender === 'user' ? 'white' : '#e4e4e7',
                                    boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(255, 140, 66, 0.2)' : 'none',
                                    fontSize: '1rem',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                </div>
                                <div style={{
                                    marginTop: '6px',
                                    fontSize: '0.75rem',
                                    color: '#71717a',
                                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                                    padding: '0 4px'
                                }}>
                                    {msg.time}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '24px 24px 24px 4px' }}
                            >
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '8px', height: '8px', background: '#a1a1aa', borderRadius: '50%' }} />
                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '8px', height: '8px', background: '#a1a1aa', borderRadius: '50%' }} />
                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '8px', height: '8px', background: '#a1a1aa', borderRadius: '50%' }} />
                                </div>
                            </motion.div>
                        )}
                        {/* NO DUMMY DIV NEEDED for scroll */}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '20px', background: 'rgba(24, 24, 27, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <button type="button" style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '1.2rem' }}>📎</button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ketik pesan Anda..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50px',
                                    padding: '16px 24px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    background: '#FF8C42',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(255, 140, 66, 0.3)'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </motion.button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChatTukang;
