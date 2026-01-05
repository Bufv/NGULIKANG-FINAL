import { useState } from 'react';

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

// assets
import { SendOutlined, UserOutlined } from '@ant-design/icons';

// ==============================|| LIVE CHAT PAGE ||============================== //

const chatUsers = [
    { id: 1, name: 'John Doe', lastMessage: 'Hello, I need help with...', time: '2m ago', unread: 2, online: true },
    { id: 2, name: 'Jane Smith', lastMessage: 'Thank you for your help!', time: '15m ago', unread: 0, online: true },
    { id: 3, name: 'Bob Johnson', lastMessage: 'When will my order arrive?', time: '1h ago', unread: 1, online: false },
    { id: 4, name: 'Alice Brown', lastMessage: 'Great service!', time: '2h ago', unread: 0, online: false },
];

const initialMessages = [
    { id: 1, sender: 'user', text: 'Hello, I need help with my account', time: '10:30 AM' },
    { id: 2, sender: 'admin', text: 'Hi! I\'d be happy to help. What seems to be the issue?', time: '10:31 AM' },
    { id: 3, sender: 'user', text: 'I can\'t login to my account', time: '10:32 AM' },
    { id: 4, sender: 'admin', text: 'Let me check that for you. Can you provide your email?', time: '10:33 AM' },
];

export default function LiveChat() {
    const [selectedUser, setSelectedUser] = useState(chatUsers[0]);
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: messages.length + 1,
                sender: 'admin',
                text: newMessage,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <MainCard title="Live Chat">
            <Grid container spacing={2} sx={{ height: '600px' }}>
                {/* Chat Users List */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ height: '100%', overflow: 'auto' }}>
                        <List sx={{ p: 0 }}>
                            {chatUsers.map((user, index) => (
                                <Box key={user.id}>
                                    <ListItemButton
                                        selected={selectedUser.id === user.id}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                color={user.online ? 'success' : 'default'}
                                                variant="dot"
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            >
                                                <Avatar>
                                                    <UserOutlined />
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle1">{user.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {user.time}
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
                                                        {user.lastMessage}
                                                    </Typography>
                                                    {user.unread > 0 && (
                                                        <Badge badgeContent={user.unread} color="primary" />
                                                    )}
                                                </Stack>
                                            }
                                        />
                                    </ListItemButton>
                                    {index < chatUsers.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Chat Messages */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Chat Header */}
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Badge
                                    color={selectedUser.online ? 'success' : 'default'}
                                    variant="dot"
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                >
                                    <Avatar>
                                        <UserOutlined />
                                    </Avatar>
                                </Badge>
                                <Box>
                                    <Typography variant="h6">{selectedUser.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedUser.online ? 'Online' : 'Offline'}
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
                                                color: message.sender === 'admin' ? 'white' : 'text.primary'
                                            }}
                                        >
                                            <Typography variant="body2">{message.text}</Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'block',
                                                    mt: 0.5,
                                                    opacity: 0.7,
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {message.time}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))}
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
                    </Paper>
                </Grid>
            </Grid>
        </MainCard>
    );
}
