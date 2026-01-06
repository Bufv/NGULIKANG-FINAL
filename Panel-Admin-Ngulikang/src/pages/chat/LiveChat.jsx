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
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Divider,
    Badge,
    CircularProgress,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { api, getAccessToken } from 'lib/api';

// assets
import { SendOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';

// socket
import { io } from 'socket.io-client';

// ==============================|| LIVE CHAT PAGE ||============================== //

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost';

export default function LiveChat() {
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // This is actually the ChatRoom object
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [tabValue, setTabValue] = useState(0); // 0: Active, 1: Archived

    const messagesEndRef = useRef(null);
    const selectedUserRef = useRef(null); // Ref to track selected user without re-binding socket

    // Initialize Socket
    useEffect(() => {
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
            const currentSelected = selectedUserRef.current;

            // 1. Update Messages if viewing the room
            if (currentSelected && message.roomId === currentSelected.id) {
                setMessages((prev) => {
                    if (prev.find(m => m.id === message.id)) return prev;
                    return [...prev, formatMessage(message)];
                });
                setTimeout(scrollToBottom, 100);
            }

            // 2. Update Chat List (Move to top, update preview)
            setChatUsers((prev) => {
                const roomExists = prev.find(r => r.id === message.roomId);

                // If room exists but we are in Archive tab and message is new, it technically becomes "active" again?
                // For now, let's just stick to the current list.
                // Or if it's a new room.

                if (!roomExists) {
                    // New room detected! Fetch updated list if we are in Active tab.
                    // If we are in Archive tab, we probably shouldn't see it pop up unless we switch.
                    // Simple logic: just refresh the current list if it matches criteria.
                    // Actually, simpler: just polling updates the list. 
                    // But for real-time snapiness:
                    return prev;
                }

                // Update existing room and move to top
                const updatedRoom = {
                    ...roomExists,
                    messages: [{ content: message.content, sentAt: message.sentAt }],
                    updatedAt: new Date().toISOString()
                };
                const otherRooms = prev.filter(r => r.id !== message.roomId);
                return [updatedRoom, ...otherRooms];
            });
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    // Sync selectedUser state with ref
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // Handle Tab Change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Effect: Fetch rooms when Tab changes
    useEffect(() => {
        setChatUsers([]);
        setSelectedUser(null);
        setMessages([]);
        fetchRooms();
    }, [tabValue]);

    // Effect: Polling
    useEffect(() => {
        const interval = setInterval(() => {
            // Poll based on current tab
            fetchRooms(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [tabValue]);

    // Fetch Messages when room selected
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
            if (socket) {
                socket.emit('join_room', selectedUser.id);
            }
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchRooms = async (isPolling = false) => {
        try {
            if (!isPolling) setLoading(true);

            const status = tabValue === 0 ? 'OPEN' : 'CLOSED';
            const res = await api.get(`/chat/rooms?status=${status}`);

            setChatUsers(res.data);

            // Auto select logic on initial load could go here if desired
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    const fetchMessages = async (roomId) => {
        try {
            const res = await api.get(`/chat/rooms/${roomId}/messages`);
            setMessages(res.data.map(formatMessage));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const formatMessage = (msg) => {
        let content = msg.content;
        let type = 'TEXT';
        try {
            if (content && content.trim().startsWith('{')) {
                const parsed = JSON.parse(content);
                if (parsed.type === 'ACTION_CLOSE') {
                    content = parsed.text;
                    type = parsed.type;
                }
            }
        } catch (e) { }

        return {
            id: msg.id,
            sender: msg.sender.role,
            text: content,
            time: new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            roomId: msg.roomId,
            type
        };
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && socket && selectedUser) {
            const data = {
                roomId: selectedUser.id,
                content: newMessage
            };
            socket.emit('send_message', data);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };


    // Confirm Dialog State
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    const handleSendCloseRequest = () => {
        setConfirmDialogOpen(true);
        setActionToConfirm(() => () => {
            const data = {
                roomId: selectedUser.id,
                content: JSON.stringify({
                    type: 'ACTION_CLOSE',
                    text: 'Laporan sudah selesai, apakah Anda ingin menutup live chat?'
                })
            };
            socket.emit('send_message', data);
            setConfirmDialogOpen(false);
        });
    };

    const handleConfirmAction = () => {
        if (actionToConfirm) actionToConfirm();
        setConfirmDialogOpen(false);
    };

    return (
        <MainCard title="Live Chat & Support">
            {/* Confirm Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                PaperProps={{
                    style: { borderRadius: 16 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Konfirmasi Request Close</DialogTitle>
                <DialogContent>
                    <Typography>
                        Apakah Anda yakin ingin mengirim permintaan "Laporan Selesai" kepada user?
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        User akan menerima tombol konfirmasi untuk menutup sesi chat ini.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">Batal</Button>
                    <Button onClick={handleConfirmAction} variant="contained" color="warning" autoFocus>
                        Kirim Request
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={2} sx={{ height: '600px' }}>
                {/* Chat Users List */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0' }}>

                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Active" />
                            <Tab label="Archived" />
                        </Tabs>

                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            {loading && <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress /></Box>}
                            {!loading && chatUsers.length === 0 && (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography color="textSecondary">
                                        No {tabValue === 0 ? 'active' : 'archived'} chats found.
                                    </Typography>
                                </Box>
                            )}
                            <List sx={{ p: 0 }}>
                                {chatUsers.map((room, index) => {
                                    const otherUser = room.user || { name: 'Unknown', avatar: null };
                                    const lastMsg = room.messages?.[0];
                                    return (
                                        <Box key={room.id}>
                                            <ListItemButton
                                                selected={selectedUser?.id === room.id}
                                                onClick={() => setSelectedUser(room)}
                                            >
                                                <ListItemAvatar>
                                                    <Badge
                                                        color={tabValue === 0 ? "success" : "default"} // Green for active, default for archived
                                                        variant="dot"
                                                        overlap="circular"
                                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    >
                                                        <Avatar src={otherUser.avatar || undefined}>
                                                            {!otherUser.avatar && <UserOutlined />}
                                                        </Avatar>
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="subtitle1">{otherUser.name}</Typography>
                                                            {lastMsg && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {new Date(lastMsg.sentAt || room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                    }
                                                    secondary={
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
                                                            {lastMsg ? lastMsg.content : 'No messages'}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
                                            {index < chatUsers.length - 1 && <Divider />}
                                        </Box>
                                    );
                                })}
                            </List>
                        </Box>
                    </Paper>
                </Grid>

                {/* Chat Messages */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar src={selectedUser.user?.avatar}>
                                            <UserOutlined />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6">{selectedUser.user?.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedUser.user?.email}
                                            </Typography>
                                            {tabValue === 1 && (
                                                <Typography variant="caption" sx={{ ml: 1, color: 'text.disabled', fontStyle: 'italic' }}>
                                                    (Archived)
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </Box>

                                {/* Messages Area */}
                                <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
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
                                                    elevation={0}
                                                    sx={{
                                                        p: 1.5,
                                                        maxWidth: '70%',
                                                        bgcolor: message.sender === 'admin' ? 'primary.main' : 'white',
                                                        color: message.sender === 'admin' ? 'white' : 'text.primary',
                                                        borderRadius: 2,
                                                        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
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
                                                            fontSize: '0.7rem'
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
                                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            fullWidth
                                            placeholder={tabValue === 1 ? "Chat is archived" : "Type a message..."}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            size="small"
                                            autoComplete="off"
                                            disabled={tabValue === 1} // Disable input for archived chats
                                        />
                                        <abbr title="Request to close chat">
                                            <IconButton
                                                color="warning"
                                                onClick={handleSendCloseRequest}
                                                disabled={tabValue === 1}
                                            >
                                                <CheckCircleOutlined />
                                            </IconButton>
                                        </abbr>
                                        <IconButton
                                            color="primary"
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || tabValue === 1}
                                        >
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
