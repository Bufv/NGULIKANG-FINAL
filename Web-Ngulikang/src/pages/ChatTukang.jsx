import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles from '../components/ui/Particles';
import { api, getAccessToken } from '../lib/api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const ChatTukang = ({ onNavigate }) => {
    // --- STATE ---
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState({});
    const [contacts, setContacts] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);

    // CHANGED: Use a ref for the SCROLLABLE CONTAINER
    const messagesContainerRef = useRef(null);

    // --- EFFECTS ---

    // 1. Initialize User & Socket
    useEffect(() => {
        const fetchUserAndSocket = async () => {
            const userData = localStorage.getItem('ngulikang_user');
            if (userData) {
                setUser(JSON.parse(userData));
            }

            const token = getAccessToken();
            if (!token) return;

            const newSocket = io(SOCKET_URL, {
                auth: { token: `Bearer ${token}` },
                transports: ['websocket', 'polling']
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('receive_message', (message) => {
                setMessages((prev) => {
                    const roomId = message.roomId;
                    const existingMessages = prev[roomId] || [];
                    // Check for duplicates (real message already exists)
                    if (existingMessages.find(m => m.id === message.id && !m.id.startsWith('temp-'))) {
                        return prev;
                    }

                    // Remove temp message if this is the real version
                    const filteredMessages = existingMessages.filter(m => !m.id.startsWith('temp-'));

                    return {
                        ...prev,
                        [roomId]: [...filteredMessages, formatMessage(message)]
                    };
                });

                // Update contact preview
                setContacts((prev) => prev.map(c => {
                    if (c.id === message.roomId) {
                        return {
                            ...c,
                            lastMsg: message.content,
                            unread: message.roomId !== activeContact ? (c.unread || 0) + 1 : 0
                        };
                    }
                    return c;
                }));
            });

            setSocket(newSocket);

            return () => newSocket.disconnect();
        };

        fetchUserAndSocket();
    }, []);

    // 2. Fetch Rooms (Contacts)
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                // First get existing rooms
                const res = await api.get('/chat/rooms');
                // Filter logic:
                // We want ONLY NORMAL chats that are OPEN (chat with tukang).
                // We DO NOT want ADMIN chats (Customer Service) - those belong in LiveChat only.
                const filteredRooms = res.data.filter(room => {
                    return room.type === 'NORMAL' && room.status === 'OPEN';
                });

                console.log('[ChatTukang] Total rooms:', res.data.length, 'Filtered (NORMAL only):', filteredRooms.length);

                let formattedContacts = filteredRooms.map(room => {
                    const target = room.tukang;
                    const lastMsg = room.messages?.[0];
                    return {
                        id: room.id,
                        name: target?.name || 'Unknown',
                        role: target?.role || 'Tukang',
                        avatar: target?.avatar || `https://ui-avatars.com/api/?name=${target?.name || 'U'}&background=random`,
                        online: true, // Mock online status for now
                        unread: 0,
                        lastMsg: lastMsg ? lastMsg.content : 'Mulai percakapan',
                        type: room.type
                    };
                });

                // NO auto-creation of CS room here - that's only for LiveChat page

                setContacts(formattedContacts);
                if (formattedContacts.length > 0 && !activeContact) {
                    setActiveContact(formattedContacts[0].id);
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    // 3. Fetch Messages for Active Contact
    useEffect(() => {
        const fetchMessagesForRoom = async () => {
            if (!activeContact) return;

            // Join room
            if (socket) {
                socket.emit('join_room', activeContact);
            }

            // Check if we already have messages
            if (messages[activeContact]) return;

            try {
                const res = await api.get(`/chat/rooms/${activeContact}/messages`);
                const formatted = res.data.map(formatMessage);
                setMessages(prev => ({ ...prev, [activeContact]: formatted }));
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessagesForRoom();
    }, [activeContact, socket]);

    // 4. Scroll handling
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, activeContact]);

    // --- HELPERS ---
    const formatMessage = (msg) => {
        const isMe = msg.sender?.role === 'user' || msg.senderId === user?.id; // Robust check

        return {
            id: msg.id,
            text: msg.content,
            sender: isMe ? 'user' : 'agent',
            time: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: msg.sender?.role
        };
    };

    const isMyMessage = (msg) => {
        return msg.sender === 'user';
    }


    // --- HANDLERS ---
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeContact || !socket) return;

        const content = inputText.trim();
        const tempId = `temp-${Date.now()}`;

        // Optimistic update - immediately show message on right side
        const optimisticMessage = {
            id: tempId,
            text: content,
            sender: 'user', // This ensures it appears on the right
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: 'user'
        };

        setMessages(prev => ({
            ...prev,
            [activeContact]: [...(prev[activeContact] || []), optimisticMessage]
        }));

        setInputText(''); // Clear input immediately

        const data = {
            roomId: activeContact,
            content: content
        };

        socket.emit('send_message', data);
    };

    const currentContact = contacts.find(c => c.id === activeContact);
    const currentMessages = messages[activeContact] || [];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', color: '#e4e4e7', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <Particles count={30} color="#FF8C42" />
            </div>

            <div className="chat-page-container" style={{
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
                <div className="chat-sidebar" style={{
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
                        {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Memuat percakapan...</div>}
                        {!loading && contacts.length === 0 && <div style={{ textAlign: 'center', padding: '20px' }}>Belum ada percakapan. Hubungi CS untuk bantuan.</div>}

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
                <div className="chat-area" style={{
                    flex: 1,
                    background: 'rgba(24, 24, 27, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {currentContact ? (
                        <>
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
                                            alignSelf: isMyMessage(msg) ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%'
                                        }}
                                    >
                                        <div style={{
                                            padding: '16px 24px',
                                            borderRadius: isMyMessage(msg) ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                                            background: isMyMessage(msg)
                                                ? 'linear-gradient(135deg, #FF8C42, #FF6B00)'
                                                : 'rgba(255, 255, 255, 0.08)',
                                            color: 'white',
                                            boxShadow: isMyMessage(msg) ? '0 4px 15px rgba(255, 140, 66, 0.2)' : 'none',
                                            fontSize: '1rem',
                                            lineHeight: '1.5'
                                        }}>
                                            {msg.text}
                                        </div>
                                        <div style={{
                                            marginTop: '6px',
                                            fontSize: '0.75rem',
                                            color: '#71717a',
                                            textAlign: isMyMessage(msg) ? 'right' : 'left',
                                            padding: '0 4px'
                                        }}>
                                            {msg.time}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="chat-input-area" style={{ padding: '20px', background: 'rgba(24, 24, 27, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#a1a1aa' }}>
                            {loading ? 'Memuat...' : 'Pilih kontak untuk mulai chat'}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ChatTukang;
