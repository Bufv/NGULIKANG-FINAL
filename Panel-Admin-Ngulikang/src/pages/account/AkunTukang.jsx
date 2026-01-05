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
    Typography,
    Tooltip,
    Rating
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import { adminApi } from 'lib/api';

// assets
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

// ==============================|| AKUN TUKANG PAGE ||============================== //

const emptyForm = {
    name: '',
    email: '',
    password: '',
    skills: '',
    rating: 0,
    verified: false
};

function StatusCell({ verified }) {
    const color = verified ? 'success' : 'error';
    const title = verified ? 'Verified' : 'Unverified';

    return (
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
}

export default function AkunTukang() {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadTukang = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await adminApi.getTukang();
            const normalized = (data.tukang || []).map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                skills: user.tukangProfile?.skills || [],
                rating: user.tukangProfile?.rating || 0,
                verified: Boolean(user.tukangProfile?.verified)
            }));
            setRows(normalized);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load tukang');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTukang();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditId(null);
        setFormData(emptyForm);
    };

    const handleSave = async () => {
        setError('');
        const skills = formData.skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);

        const payload = {
            name: formData.name,
            email: formData.email,
            role: 'tukang',
            tukangProfile: {
                skills,
                rating: Number(formData.rating) || 0,
                verified: Boolean(formData.verified)
            }
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            if (editId) {
                await adminApi.updateUser(editId, payload);
            } else {
                if (!formData.password) {
                    setError('Password is required for new tukang');
                    return;
                }
                await adminApi.createUser(payload);
            }

            await loadTukang();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save tukang');
        }
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setFormData({
            name: row.name || '',
            email: row.email || '',
            password: '',
            skills: (row.skills || []).join(', '),
            rating: Number(row.rating) || 0,
            verified: Boolean(row.verified)
        });
        setOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tukang?')) {
            return;
        }

        try {
            await adminApi.deleteUser(id);
            setRows((prev) => prev.filter((row) => row.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete tukang');
        }
    };

    const handleVerify = async (id) => {
        try {
            await adminApi.verifyTukang(id);
            await loadTukang();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify tukang');
        }
    };

    return (
        <MainCard title="Akun Tukang">
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpen}>
                    Add Tukang
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Skills</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Status</TableCell>
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
                                <TableCell colSpan={5}>No tukang found.</TableCell>
                            </TableRow>
                        )}
                        {!loading &&
                            rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.skills.length ? row.skills.join(', ') : '-'}</TableCell>
                                    <TableCell>
                                        <Rating value={Number(row.rating)} readOnly precision={0.5} size="small" />
                                    </TableCell>
                                    <TableCell><StatusCell verified={row.verified} /></TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {!row.verified && (
                                                <Button size="small" onClick={() => handleVerify(row.id)}>
                                                    Verify
                                                </Button>
                                            )}
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
                <DialogTitle>{editId ? 'Edit Tukang' : 'Add Tukang'}</DialogTitle>
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
                            label="Skills (comma-separated)"
                            fullWidth
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                        <Box>
                            <Typography component="legend">Rating</Typography>
                            <Rating
                                name="rating"
                                value={Number(formData.rating)}
                                precision={0.5}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, rating: newValue });
                                }}
                            />
                        </Box>
                        <TextField
                            label="Status"
                            select
                            fullWidth
                            value={formData.verified ? 'verified' : 'unverified'}
                            onChange={(e) => setFormData({ ...formData, verified: e.target.value === 'verified' })}
                            SelectProps={{ native: true }}
                        >
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                        </TextField>
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
