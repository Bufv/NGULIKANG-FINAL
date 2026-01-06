import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import '../styles/ChatNegosiasi.css';
import logo from '../assets/LOGO/TERANG.png';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function ChatNegosiasi({ onLogout, onNavigate }) {
    const [activeMenu, setActiveMenu] = useState('chat');
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const messagesContainerRef = useRef(null);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Socket initialization - EXACT SAME as ChatTukang.jsx
    useEffect(() => {
        const token = localStorage.getItem('tukang_token');
        if (!token) return;

        const newSocket = io(SOCKET_URL, {
            auth: { token: `Bearer ${token}` },
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('[ChatNegosiasi] Socket connected');
        });

        newSocket.on('receive_message', (message) => {
            console.log('[ChatNegosiasi] Received message:', message);

            if (selectedChat && message.roomId === selectedChat.id) {
                setMessages(prev => {
                    if (prev.find(m => m.id === message.id)) return prev;
                    return [...prev, {
                        id: message.id,
                        sender: message.sender.role === 'tukang' ? 'tukang' : 'client',
                        message: message.content,
                        time: new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }];
                });
            }
            fetchConversations();
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    const getAuthHeader = () => {
        const token = localStorage.getItem('tukang_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        const loadUserData = async () => {
            const userStored = localStorage.getItem('tukang_user');
            console.log('[ChatNegosiasi] Raw user data from localStorage:', userStored);

            if (userStored) {
                try {
                    const userData = JSON.parse(userStored);
                    console.log('[ChatNegosiasi] Parsed user data:', userData);
                    setCurrentUser(userData);
                } catch (error) {
                    console.error('[ChatNegosiasi] Error parsing user data:', error);
                    // If localStorage is corrupt, fetch from API
                    await fetchUserFromAPI();
                }
            } else {
                // If no data in localStorage, fetch from API
                await fetchUserFromAPI();
            }
        };

        const fetchUserFromAPI = async () => {
            try {
                const response = await fetch(`${apiUrl}/auth/me`, {
                    headers: getAuthHeader()
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('[ChatNegosiasi] User data from API:', data.user);
                    setCurrentUser(data.user);
                    localStorage.setItem('tukang_user', JSON.stringify(data.user));
                }
            } catch (error) {
                console.error('[ChatNegosiasi] Error fetching user from API:', error);
            }
        };

        loadUserData();
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);

            // Join room via socket
            if (socket) {
                socket.emit('join_room', selectedChat.id);
                console.log('[ChatNegosiasi] Joined room:', selectedChat.id);
            }

            const msgInterval = setInterval(() => fetchMessages(selectedChat.id), 3000);
            return () => clearInterval(msgInterval);
        }
    }, [selectedChat, socket]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${apiUrl}/chat/rooms`, {
                headers: getAuthHeader()
            });
            if (response.ok) {
                const data = await response.json();
                console.log('[fetchConversations] Raw data from backend:', data);
                console.log('[fetchConversations] Data types:', data.map(r => ({ id: r.id, type: r.type, tukangId: r.tukangId })));

                // Filter only NORMAL type rooms (negotiation rooms)
                const negotiationRooms = data.filter(room => room.type === 'NORMAL');
                console.log('[fetchConversations] After NORMAL filter:', negotiationRooms.length, 'rooms');

                const formatted = negotiationRooms.map(room => {
                    const lastMsg = room.messages?.[0];
                    const userName = room.user?.name || 'User';
                    let userAvatar = room.user?.avatar;

                    // Convert relative avatar path to full URL
                    if (userAvatar && !userAvatar.startsWith('http')) {
                        // If avatar starts with /uploads, prepend base URL
                        if (userAvatar.startsWith('/uploads')) {
                            userAvatar = `http://localhost${userAvatar}`;
                        } else if (!userAvatar.startsWith('/')) {
                            userAvatar = `http://localhost/uploads/${userAvatar}`;
                        }
                    }

                    // For avatar display: use first letter of name, not avatar path
                    const avatarInitial = userName.charAt(0).toUpperCase();

                    console.log('[fetchConversations] Room:', room.id, 'User:', userName, 'Avatar URL:', userAvatar);

                    return {
                        id: room.id,
                        nama: userName,
                        proyek: 'Proyek Borongan',
                        lastMessage: lastMsg?.content || 'Belum ada pesan',
                        harga: '-',
                        status: room.status === 'OPEN' ? 'Negosiasi' : 'Selesai',
                        time: new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        unread: 0,
                        avatar: avatarInitial, // Use initial letter as fallback
                        avatarUrl: userAvatar, // Full URL to avatar image
                        original: room
                    };
                });
                setConversations(formatted);
            }
        } catch (error) {
            console.error("Error fetching conversations", error);
        }
    };

    const fetchMessages = async (roomId) => {
        try {
            const response = await fetch(`${apiUrl}/chat/rooms/${roomId}/messages`, {
                headers: getAuthHeader()
            });
            if (response.ok) {
                const data = await response.json();
                const formattedParams = data.map(msg => ({
                    id: msg.id,
                    sender: msg.sender.role === 'tukang' ? 'tukang' : 'client',
                    message: msg.content,
                    time: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    original: msg
                }));
                setMessages(formattedParams);
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleCloseChat = async () => {
        if (!selectedChat) return;

        const confirm = window.confirm('Apakah Anda yakin ingin menyelesaikan chat ini? Chat akan ditandai sebagai selesai.');
        if (!confirm) return;

        try {
            const response = await fetch(`${apiUrl}/chat/rooms/${selectedChat.id}/close`, {
                method: 'PUT',
                headers: getAuthHeader()
            });

            if (response.ok) {
                alert('Chat berhasil diselesaikan!');
                // Refresh conversation list
                await fetchConversations();
                // Clear selected chat
                setSelectedChat(null);
                setMessages([]);
            } else {
                alert('Gagal menyelesaikan chat. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('[handleCloseChat] Error:', error);
            alert('Terjadi kesalahan saat menyelesaikan chat.');
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!messageInput.trim() || !selectedChat) return;

        const content = messageInput.trim();
        setMessageInput(''); // Clear immediately

        // Use socket.emit - EXACT SAME as Live Chat
        if (socket && socket.connected) {
            socket.emit('send_message', {
                roomId: selectedChat.id,
                content: content
            });
        } else {
            console.error('[ChatNegosiasi] Socket not connected');
            alert('Socket tidak terhubung. Refresh halaman.');
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Ngulikang" className="logo-img" />
                    <p className="logo-subtitle">Portal Tukang</p>
                </div>

                <div className="user-profile">
                    <div className="avatar">
                        {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                            currentUser?.name?.[0] || 'T'
                        )}
                    </div>
                    <div className="user-info">
                        <h3>{currentUser?.name || 'Tukang'}</h3>
                        <p>{currentUser?.email}</p>
                    </div>
                </div>

                <nav className="nav-menu">
                    <button className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('dashboard')}>
                        Dashboard
                    </button>
                    <button className={`nav-item ${activeMenu === 'chat' ? 'active' : ''}`} onClick={() => setActiveMenu('chat')}>
                        Chat & Negosiasi
                    </button>
                    <button className={`nav-item ${activeMenu === 'tracker' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('tracker')}>
                        Tracker Proyek
                    </button>
                    <button className={`nav-item ${activeMenu === 'gaji' ? 'active' : ''}`} onClick={() => onNavigate && onNavigate('gaji')}>
                        Ambil Gaji
                    </button>
                </nav>

                <button className="logout-btn" onClick={onLogout}>
                    Keluar
                </button>
            </aside>

            <main className="main-content">
                <header className="dashboard-header">
                    <h2>Chat & Negosiasi</h2>
                </header>

                <div className="chat-container">
                    <div className="conversations-panel">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Cari client atau proyek..." className="search-input" />
                        </div>

                        <div className="conversations-list">
                            {conversations.length === 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                    Belum ada negosiasi
                                </div>
                            )}
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${selectedChat?.id === conv.id ? 'active' : ''}`}
                                    onClick={() => setSelectedChat(conv)}
                                >
                                    <div className="conv-avatar">
                                        {conv.avatarUrl ? (
                                            <img
                                                src={conv.avatarUrl}
                                                alt={conv.nama}
                                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            conv.avatar
                                        )}
                                    </div>
                                    <div className="conv-content">
                                        <div className="conv-header">
                                            <h4 className="conv-name">{conv.nama}</h4>
                                            <span className="conv-time">{conv.time}</span>
                                        </div>
                                        <p className="conv-proyek">{conv.proyek}</p>
                                        <div className="conv-footer">
                                            <p className="conv-preview">{conv.lastMessage}</p>
                                            {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                                        </div>
                                        <div className="conv-meta">
                                            <span className={`status-badge ${conv.status.toLowerCase()}`}>{conv.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chat-panel">
                        {selectedChat ? (
                            <>
                                <div className="chat-header">
                                    <div className="chat-header-info">
                                        <div className="chat-avatar-large">
                                            {selectedChat.avatarUrl ? (
                                                <img
                                                    src={selectedChat.avatarUrl}
                                                    alt={selectedChat.nama}
                                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                selectedChat.avatar
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="chat-client-name">{selectedChat.nama}</h3>
                                            <p className="chat-project-name">{selectedChat.proyek}</p>
                                        </div>
                                    </div>
                                    <div className="chat-header-price">
                                        <span className="price-label">Status</span>
                                        <span className="price-value">{selectedChat.status}</span>
                                        {selectedChat.status === 'Negosiasi' && (
                                            <button
                                                onClick={handleCloseChat}
                                                style={{
                                                    marginLeft: '15px',
                                                    padding: '8px 16px',
                                                    background: '#22c55e',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.target.style.background = '#16a34a'}
                                                onMouseOut={(e) => e.target.style.background = '#22c55e'}
                                            >
                                                ✓ Selesaikan Chat
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="messages-container" ref={messagesContainerRef}>
                                    {messages.map((msg, index) => (
                                        <div
                                            key={msg.id || index}
                                            className={`message ${msg.sender === 'tukang' ? 'message-sent' : 'message-received'}`}
                                        >
                                            <div className="message-bubble">
                                                <p className="message-text">{msg.message}</p>
                                                <span className="message-time">{msg.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form className="message-input-container" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Ketik pesan..."
                                        className="message-input"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                    />
                                    <button type="submit" className="send-button">
                                        Kirim
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                Pilih percakapan untuk memulai chat
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ChatNegosiasi;
