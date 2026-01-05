import { useState, useEffect, useRef } from 'react';

// material-ui
import {
    Box,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Divider,
    Badge
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import io from 'socket.io-client';
import { api, getAccessToken } from 'lib/api';

// assets
import { SendOutlined, UserOutlined } from '@ant-design/icons';

// ==============================|| LIVE CHAT PAGE ||============================== //

export default function LiveChat() {
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    useEffect(() => {
        // Init Socket
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Admin connected to socket');
        });

        newSocket.on('receive_message', (msg) => {
            // If message belongs to selected room, append it
            // Also update last message in chatRooms list

            // 1. Update Messages if current room
            setMessages(prev => {
                // Check if it belongs to current room
                // Since we don't have easy access to selectedRoom inside this closure easily without ref or dependency, 
                // we rely on setState functional update which is tricky with conditional logic based on other state.
                // A common pattern is checking msg.roomId === selectedRoom?.id (but selectedRoom is stale here)
                // We will handle this by simple addition and filtering on render or improved effect.
                // Actually easier: just append. When switching rooms we refetch.
                // But for live update we need to know if it matches the ID.
                return prev; // We will use a separate effect or ref to handle live updates correctly
            });

            // For simplicity, we trigger a refetch or manual update
            // Better:
            handleIncomingMessage(msg);
        });

        return () => newSocket.close();
    }, []);

    const handleIncomingMessage = (msg) => {
        setMessages(prev => {
            // We can't easily check selectedRoom here due to closure staleness unless we use a ref.
            // Let's rely on a Ref for selectedRoom
            if (activeRoomRef.current && activeRoomRef.current.id === msg.roomId) {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, formatMessage(msg)];
            }
            return prev;
        });

        // Update room list preview
        fetchRooms();
    };

    // Ref to track active room for socket handler
    const activeRoomRef = useRef(null);
    useEffect(() => {
        activeRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            fetchMessages(selectedRoom.id);
            if (socket) socket.emit('join_room', selectedRoom.id);
        }
    }, [selectedRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/chat/rooms');

            if (Array.isArray(data)) {
                setChatRooms(data);
                // Select first room if none selected
                if (!selectedRoom && data.length > 0) {
                    setSelectedRoom(data[0]);
                }
            } else {
                console.error("Failed to fetch rooms", data);
                setChatRooms([]);
            }
        } catch (err) {
            console.error("Failed to fetch rooms", err);
            setChatRooms([]); // Fallback to empty array on error
        }
    };

    const fetchMessages = async (roomId) => {
        try {
            const { data } = await api.get(`/chat/${roomId}/messages`);
            setMessages(data.map(formatMessage));
        } catch (err) { console.error("Failed to fetch messages", err); }
    };

    const formatMessage = (m) => ({
        id: m.id,
        sender: m.sender.role === 'admin' ? 'admin' : 'user',
        text: m.content,
        time: new Date(m.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        roomId: m.roomId
    });

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedRoom || !socket) return;

        const payload = {
            roomId: selectedRoom.id,
            // We need our own ID, assume admin ID from token or context
            // For now socket event in backend handles creation success but broadcast needs sender details
            // Backend endpoint saves it.
            // Let's use socket emit directly as per user implementation, 
            // BUT we need senderId.
            // Ideally backend infers senderId from socket session (if auth) or we explicitly send.
            // We need to parse token for ID.
            senderId: parseJwt(getAccessToken()).sub,
            content: newMessage
        };

        socket.emit('send_message', payload);

        // Optimistic update
        const tempMsg = {
            id: Date.now(),
            sender: 'admin',
            text: newMessage,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');

        // Refresh rooms to update last message snippet (optional)
        // fetchRooms();
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) { return {}; }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <MainCard title="Live Chat Support">
            <Grid container spacing={2} sx={{ height: '600px' }}>
                {/* Chat Users List */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ height: '100%', overflow: 'auto' }}>
                        <List sx={{ p: 0 }}>
                            {chatRooms.map((room, index) => {
                                const otherUser = room.user; // For admin support, user is the 'other'
                                const lastMsg = room.messages?.[0];

                                return (
                                    <Box key={room.id}>
                                        <ListItemButton
                                            selected={selectedRoom?.id === room.id}
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            <ListItemAvatar>
                                                <Badge
                                                    color="success"
                                                    variant="dot"
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    invisible={true} // Implement online status later
                                                >
                                                    <Avatar src={otherUser?.avatar || ''}>
                                                        {!otherUser?.avatar && <UserOutlined />}
                                                    </Avatar>
                                                </Badge>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="subtitle1">{otherUser?.name || 'Guest User'}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {lastMsg ? new Date(lastMsg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </Typography>
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                maxWidth: '200px'
                                                            }}
                                                        >
                                                            {lastMsg?.content || 'No messages yet'}
                                                        </Typography>
                                                    </Stack>
                                                }
                                            />
                                        </ListItemButton>
                                        <Divider />
                                    </Box>
                                )
                            })}
                            {chatRooms.length === 0 && (
                                <Box p={2} textAlign="center">
                                    <Typography color="textSecondary">No active chats</Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Chat Messages */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {selectedRoom ? (
                            <>
                                {/* Chat Header */}
                                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar src={selectedRoom.user?.avatar}>
                                            <UserOutlined />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6">{selectedRoom.user?.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                User ID: {selectedRoom.user?.id}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                {/* Messages Area */}
                                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                                    <Stack spacing={2}>
                                        {messages.map((message) => (
                                            <Box
                                                key={message.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: message.sender === 'admin' ? 'flex-end' : 'flex-start'
                                                }}
                                            >
                                                <Paper
                                                    sx={{
                                                        p: 1.5,
                                                        maxWidth: '70%',
                                                        bgcolor: message.sender === 'admin' ? 'primary.main' : 'grey.100',
                                                        color: message.sender === 'admin' ? 'white' : 'text.primary',
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    <Typography variant="body2">{message.text}</Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: 'block',
                                                            mt: 0.5,
                                                            opacity: 0.7,
                                                            textAlign: 'right',
                                                            color: message.sender === 'admin' ? 'grey.200' : 'text.secondary'
                                                        }}
                                                    >
                                                        {message.time}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </Stack>
                                </Box>

                                {/* Message Input */}
                                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            fullWidth
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            size="small"
                                        />
                                        <IconButton color="primary" onClick={handleSendMessage}>
                                            <SendOutlined />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography color="textSecondary">Select a chat to start messaging</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </MainCard>
    );
}
