import { useEffect, useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { adminApi } from 'lib/api';

// assets
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

// ==============================|| ACCOUNT USER PAGE ||============================== //

const emptyForm = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: ''
};

export default function AccountUser() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await adminApi.getUsers();
            setRows(data.users || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditId(null);
        setFormData(emptyForm);
    };

    const handleSave = async () => {
        setError('');
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                phone: formData.phone
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            if (editId) {
                await adminApi.updateUser(editId, payload);
            } else {
                await adminApi.createUser(payload);
            }

            await loadUsers();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user');
        }
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setFormData({
            name: row.name || '',
            email: row.email || '',
            password: '',
            role: row.role || 'user',
            phone: row.phone || ''
        });
        setOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await adminApi.deleteUser(id);
            setRows((prev) => prev.filter((row) => row.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <MainCard title="Akun User">
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpen}>
                    Add User
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5}>Loading...</TableCell>
                            </TableRow>
                        )}
                        {!loading && rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5}>No users found.</TableCell>
                            </TableRow>
                        )}
                        {!loading &&
                            rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>{row.phone || '-'}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Edit">
                                                <IconButton color="primary" onClick={() => handleEdit(row)}>
                                                    <EditOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editId ? 'Edit User' : 'Add User'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            label={editId ? 'New Password (optional)' : 'Password'}
                            fullWidth
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            type="password"
                        />
                        <TextField
                            label="Role"
                            select
                            fullWidth
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            SelectProps={{ native: true }}
                        >
                            <option value="user">User</option>
                            <option value="tukang">Tukang</option>
                            <option value="admin">Admin</option>
                        </TextField>
                        <TextField
                            label="Phone"
                            fullWidth
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}
