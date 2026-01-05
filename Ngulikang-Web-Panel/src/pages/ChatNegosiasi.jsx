import { useState, useEffect } from 'react';
import '../styles/ChatNegosiasi.css';
import logo from '../assets/LOGO/TERANG.png';

function ChatNegosiasi({ onLogout, onNavigate }) {
    const [activeMenu, setActiveMenu] = useState('chat');
    const [selectedChat, setSelectedChat] = useState(0);
    const [messageInput, setMessageInput] = useState('');

    // Initial conversations data
    const [conversations, setConversations] = useState([
        {
            id: 1,
            nama: 'Budi Santoso',
            proyek: 'Renovasi Kamar Mandi',
            lastMessage: 'Oke deal, kita mulai besok ya',
            harga: 'Rp 4.500.000',
            status: 'Deal',
            time: '10:30',
            unread: 0,
            avatar: 'B'
        },
        {
            id: 2,
            nama: 'Siti Aminah',
            proyek: 'Perbaikan Atap',
            lastMessage: 'Bagaimana kalau 3 juta?',
            harga: 'Rp 3.500.000',
            status: 'Negosiasi',
            time: '09:15',
            unread: 2,
            avatar: 'S'
        },
        {
            id: 3,
            nama: 'Joko Widodo',
            proyek: 'Pengecatan Rumah',
            lastMessage: 'Berapa estimasi biayanya?',
            harga: 'Menunggu',
            status: null,
            time: 'Kemarin',
            unread: 1,
            avatar: 'J'
        },
        {
            id: 4,
            nama: 'Rina Susanti',
            proyek: 'Instalasi Listrik',
            lastMessage: 'Terima kasih pak!',
            harga: 'Rp 2.800.000',
            status: 'Deal',
            time: '2 hari lalu',
            unread: 0,
            avatar: 'R'
        }
    ]);

    // Chat messages state
    const [chatMessages, setChatMessages] = useState({
        1: [
            { sender: 'client', message: 'Pak, untuk renovasi kamar mandi berapa biayanya?', time: '09:00' },
            { sender: 'tukang', message: 'Selamat pagi Pak Budi. Untuk renovasi kamar mandi ukuran standar sekitar 4.5 juta. Sudah termasuk material dan biaya kerja.', time: '09:05' },
            { sender: 'client', message: 'Itu sudah termasuk keramik juga?', time: '09:14' },
            { sender: 'tukang', message: 'Belum termasuk keramik Pak. Kalau termasuk keramik standar bisa sekitar 6 juta. Tapi kalau Bapak sediakan sendiri keramiknya, tetap 4.5 juta.', time: '09:20' },
            { sender: 'client', message: 'Baik pak, saya sediakan keramiknya sendiri. Deal 4.5 juta ya?', time: '10:20' },
            { sender: 'tukang', message: 'Siap Pak Budi, deal 4.5 juta. Kapan mau mulai kerja? Oke.', time: '10:25' },
            { sender: 'client', message: 'Oke deal, kita mulai besok ya', time: '10:30' }
        ],
        2: [
            { sender: 'client', message: 'Pak untuk perbaikan atap rumah bisa?', time: '08:30' },
            { sender: 'tukang', message: 'Bisa Bu. Atapnya berapa meter dan masalahnya apa?', time: '08:35' },
            { sender: 'client', message: 'Sekitar 50 meter pak, ada yang bocor', time: '09:00' },
            { sender: 'tukang', message: 'Untuk perbaikan atap 50 meter sekitar 4 juta Bu, sudah termasuk material.', time: '09:10' },
            { sender: 'client', message: 'Bagaimana kalau 3 juta?', time: '09:15' }
        ],
        3: [],
        4: []
    });

    const currentChat = conversations[selectedChat];
    const messages = chatMessages[currentChat.id] || [];

    // Get current time in HH:MM format
    const getCurrentTime = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            const newMessage = {
                sender: 'tukang',
                message: messageInput.trim(),
                time: getCurrentTime()
            };

            // Add message to chat
            setChatMessages(prev => ({
                ...prev,
                [currentChat.id]: [...(prev[currentChat.id] || []), newMessage]
            }));

            // Update last message in conversation list
            setConversations(prev => prev.map((conv, idx) =>
                idx === selectedChat
                    ? { ...conv, lastMessage: messageInput.trim(), time: 'Baru saja' }
                    : conv
            ));

            setMessageInput('');

            // Auto scroll to bottom
            setTimeout(() => {
                const messagesContainer = document.querySelector('.messages-container');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 100);
        }
    };

    // Auto scroll to bottom when messages change or chat changes
    useEffect(() => {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages, selectedChat]);

    return (
        <div className="dashboard-container">
            {/* Sidebar - Same as Dashboard */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Ngulikang" className="logo-img" />
                    <p className="logo-subtitle">Portal Tukang</p>
                </div>

                <div className="user-profile">
                    <div className="avatar">AR</div>
                    <div className="user-info">
                        <h3>Ahmad Rizki</h3>
                        <p>demo@tukang.ngulikang.com</p>
                    </div>
                </div>

                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
                        onClick={() => onNavigate && onNavigate('dashboard')}
                    >

                        Dashboard
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('chat')}
                    >

                        Chat & Negosiasi
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'tracker' ? 'active' : ''}`}
                        onClick={() => onNavigate && onNavigate('tracker')}
                    >

                        Tracker Proyek
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'gaji' ? 'active' : ''}`}
                        onClick={() => onNavigate && onNavigate('gaji')}
                    >

                        Ambil Gaji
                    </button>
                </nav>

                <button className="logout-btn" onClick={onLogout}>

                    Keluar
                </button>
            </aside>

            {/* Main Content - Chat */}
            <main className="main-content">
                <header className="dashboard-header">
                    <h2>Chat & Negosiasi</h2>
                </header>

                <div className="chat-container">
                    {/* Conversations List */}
                    <div className="conversations-panel">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Cari client atau proyek..."
                                className="search-input"
                            />
                        </div>

                        <div className="conversations-list">
                            {conversations.map((conv, index) => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${selectedChat === index ? 'active' : ''}`}
                                    onClick={() => setSelectedChat(index)}
                                >
                                    <div className="conv-avatar">{conv.avatar}</div>
                                    <div className="conv-content">
                                        <div className="conv-header">
                                            <h4 className="conv-name">{conv.nama}</h4>
                                            <span className="conv-time">{conv.time}</span>
                                        </div>
                                        <p className="conv-proyek">{conv.proyek}</p>
                                        <div className="conv-footer">
                                            <p className="conv-preview">{conv.lastMessage}</p>
                                            {conv.unread > 0 && (
                                                <span className="unread-badge">{conv.unread}</span>
                                            )}
                                        </div>
                                        <div className="conv-meta">
                                            {conv.status && (
                                                <span className={`status-badge ${conv.status.toLowerCase()}`}>
                                                    {conv.status}
                                                </span>
                                            )}
                                            <span className="conv-price">{conv.harga}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="chat-panel">
                        {/* Chat Header */}
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-avatar-large">{currentChat.avatar}</div>
                                <div>
                                    <h3 className="chat-client-name">{currentChat.nama}</h3>
                                    <p className="chat-project-name">{currentChat.proyek}</p>
                                </div>
                            </div>
                            <div className="chat-header-price">
                                <span className="price-label">Harga Nego</span>
                                <span className="price-value">{currentChat.harga}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="messages-container">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.sender === 'tukang' ? 'message-sent' : 'message-received'}`}
                                >
                                    <div className="message-bubble">
                                        <p className="message-text">{msg.message}</p>
                                        <span className="message-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
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
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ChatNegosiasi;
