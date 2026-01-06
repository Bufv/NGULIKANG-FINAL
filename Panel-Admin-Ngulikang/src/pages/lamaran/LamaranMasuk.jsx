
import { useEffect, useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Chip,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
    TextField,
    Card,
    CardContent,
    Avatar,
    Divider,
    MenuItem,
    useTheme
} from '@mui/material';

import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';

// project imports
import MainCard from 'components/MainCard';
import { adminApi } from 'lib/api';

// assets
import {
    EyeOutlined,
    UserAddOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    UserOutlined,
    SaveOutlined,
    DeleteOutlined
} from '@ant-design/icons';

// ==============================|| LAMARAN MASUK PAGE ||============================== //

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Diterima' },
    { value: 'rejected', label: 'Ditolak' }
];

const statusLabels = statusOptions.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
}, {});

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const buildFileUrl = (path) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

function StatusChip({ status }) {
    let color;
    let icon;

    switch (status) {
        case 'pending':
            color = 'warning';
            icon = <ClockCircleOutlined />;
            break;
        case 'approved':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
        case 'rejected':
            color = 'error';
            icon = <CloseCircleOutlined />;
            break;
        default:
            color = 'default';
    }

    return (
        <Chip
            icon={icon}
            label={statusLabels[status] || 'Pending'}
            color={color}
            size="small"
            variant="outlined"
            sx={{ borderColor: 'transparent', bgcolor: `${color}.lighter` }}
        />
    );
}

// Info Card Component
const InfoCard = ({ title, value }) => (
    <Card sx={{ bgcolor: 'secondary.lighter', border: 'none', mb: 2 }}>
        <CardContent sx={{ p: '16px !important' }}>
            <Typography variant="caption" color="textSecondary">
                {title}
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

export default function LamaranMasuk() {
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [note, setNote] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [newTimeline, setNewTimeline] = useState({ title: '', desc: '', status: 'completed' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadLamaran = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await adminApi.getLamaran();
            const mapped = (data.data || []).map((item) => ({
                id: item.id,
                name: item.fullName || item.user?.name || '-',
                role: (item.jobRoles || []).join(', ') || '-',
                location: item.domicile || '-',
                date: formatDate(item.submittedAt),
                status: item.status || 'pending',
                department: item.department || '',
                recruiter: item.recruiter || '',
                lastUpdate: formatDate(item.updatedAt || item.submittedAt),
                note: item.note || '',
                photo: item.avatar || '',
                email: item.email || '-',
                phone: item.phone || '-',
                ktp: item.ktp || '-',
                address: item.address || '-',
                maritalStatus: item.maritalStatus || '-',
                relocate: item.relocate,
                vehicle: item.vehicle || '-',
                experienceYears: item.experienceYears || '-',
                projectTypes: item.projectTypes || '-',
                documents: item.documents || [],
                timeline: (item.timeline || []).map((entry) => ({
                    title: entry.title,
                    status: entry.status,
                    desc: entry.description || '',
                    eventDate: entry.eventDate
                }))
            }));
            setRows(mapped);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data lamaran.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLamaran();
    }, []);

    const handleOpen = (app) => {
        setSelectedApp(app);
        setNote(app.note);
        setEditStatus(app.status || 'pending');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedApp(null);
        setNewTimeline({ title: '', desc: '', status: 'completed' });
    };

    const handleDeleteTimeline = (index) => {
        const updatedTimeline = selectedApp.timeline.filter((_, i) => i !== index);
        const updatedApp = { ...selectedApp, timeline: updatedTimeline };
        setSelectedApp(updatedApp);
        // Don't update 'rows' yet until saved, OR update rows immediately? 
        // Usually immediate updates in modal state, need to save to persist generally, 
        // but here we are in "local edit" mode.
        // Let's allow immediate effect for the modal view, but "Save Changes" commits it?
        // Actually, let's keep it simple: everything is local until "Save Changes" BUT 
        // handleDeleteTimeline modifies 'selectedApp' directly in the previous logic.
        // To make it persistent, must update 'rows' too if we consider this a "live" edit.
        // BUT, 'handleSaveChanges' also applies changes. 
        // Let's make "Add/Delete" timeline items require "Save Changes" generally, or be immediate.
        // Immediate is better user experience for lists.
        setRows(rows.map(r => r.id === selectedApp.id ? updatedApp : r));
    };

    const handleAddTimeline = () => {
        if (!newTimeline.title) return;
        const newItem = {
            ...newTimeline,
            eventDate: new Date().toISOString()
        };

        const updatedTimeline = [...selectedApp.timeline, newItem];
        const updatedApp = { ...selectedApp, timeline: updatedTimeline };

        setSelectedApp(updatedApp);
        setRows(rows.map(r => r.id === selectedApp.id ? updatedApp : r));
        setNewTimeline({ title: '', desc: '', status: 'completed' }); // Reset form
    };

    const handleSaveChanges = async () => {
        if (!selectedApp) return;

        setError('');
        const now = new Date().toISOString();
        let updatedTimeline = [...selectedApp.timeline];

        if (editStatus !== selectedApp.status) {
            const lastIdx = updatedTimeline.length - 1;
            if (updatedTimeline[lastIdx] && updatedTimeline[lastIdx].status === 'current') {
                updatedTimeline[lastIdx] = { ...updatedTimeline[lastIdx], status: 'completed' };
            }

            if (editStatus === 'approved') {
                updatedTimeline.push({
                    title: 'Diterima',
                    status: 'completed',
                    desc: 'Selamat! Anda diterima menjadi mitra Tukang.',
                    eventDate: now
                });
            } else if (editStatus === 'rejected') {
                updatedTimeline.push({
                    title: 'Ditolak',
                    status: 'rejected',
                    desc: 'Lamaran tidak dilanjutkan.',
                    eventDate: now
                });
            }
        }

        const payload = {
            status: editStatus,
            note,
            department: selectedApp.department,
            recruiter: selectedApp.recruiter,
            timeline: updatedTimeline.map((item) => ({
                title: item.title,
                description: item.desc,
                status: item.status,
                eventDate: item.eventDate
            }))
        };

        try {
            await adminApi.updateLamaran(selectedApp.id, payload);
            await loadLamaran();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan perubahan.');
        }
    };

    const handleCreateAccount = () => {
        alert("Akun tukang berhasil dibuat!");
        handleClose();
    };


    return (
        <MainCard title="Daftar Lamaran Masuk">
            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            {loading && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Memuat data lamaran...
                </Typography>
            )}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Lamaran</TableCell>
                            <TableCell>Posisi</TableCell>
                            <TableCell>Pelamar</TableCell>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 && !loading ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Belum ada lamaran masuk.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2">{row.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{row.role}</Typography>
                                        <Typography variant="caption" color="textSecondary">{row.department}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Avatar alt={row.name} src={row.photo} sx={{ width: 32, height: 32 }} />
                                            <Box>
                                                <Typography variant="body2">{row.name}</Typography>
                                                <Typography variant="caption" color="textSecondary">{row.location}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>
                                        <StatusChip status={row.status} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Lihat Detail">
                                            <IconButton color="primary" onClick={() => handleOpen(row)}>
                                                <EyeOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Detail Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
                {selectedApp && (
                    <>
                        <DialogTitle sx={{ p: 3, pb: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        ID Lamaran: {selectedApp.id}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {selectedApp.role}
                                    </Typography>
                                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <EnvironmentOutlined style={{ color: theme.palette.text.secondary }} />
                                            <Typography variant="body2" color="textSecondary">{selectedApp.location}</Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <UserOutlined style={{ color: theme.palette.text.secondary }} />
                                            <Typography variant="body2" color="textSecondary">{selectedApp.name}</Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                                <StatusChip status={selectedApp.status} />
                            </Stack>
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Left Side - Info */}
                                <Grid item xs={12} md={5}>
                                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Informasi Rekrutmen</Typography>

                                    {/* UPDATE CONTROLS */}
                                    <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom>Update Status Lamaran</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                            sx={{ mb: 2, bgcolor: 'background.paper' }}
                                        >
                                        {statusOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                        <Typography variant="subtitle2" gutterBottom>Catatan Internal</Typography>
                                        <TextField
                                            multiline
                                            rows={3}
                                            fullWidth
                                            size="small"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Tambahkan catatan untuk pelamar ini..."
                                            sx={{ bgcolor: 'background.paper' }}
                                        />
                                    </Box>


                                    <Box sx={{ mb: 3, p: 2, bgcolor: 'secondary.lighter', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom>Data Pelamar</Typography>
                                        <Stack spacing={1}>
                                            <Typography variant="body2"><strong>Nama:</strong> {selectedApp.name}</Typography>
                                            <Typography variant="body2"><strong>Email:</strong> {selectedApp.email}</Typography>
                                            <Typography variant="body2"><strong>Telepon:</strong> {selectedApp.phone}</Typography>
                                            <Typography variant="body2"><strong>NIK:</strong> {selectedApp.ktp}</Typography>
                                            <Typography variant="body2"><strong>Alamat:</strong> {selectedApp.address}</Typography>
                                            <Typography variant="body2"><strong>Status Nikah:</strong> {selectedApp.maritalStatus}</Typography>
                                            <Typography variant="body2"><strong>Domisili:</strong> {selectedApp.location}</Typography>
                                            <Typography variant="body2">
                                                <strong>Bersedia Relokasi:</strong>{' '}
                                                {selectedApp.relocate === true ? 'Ya' : selectedApp.relocate === false ? 'Tidak' : '-'}
                                            </Typography>
                                            <Typography variant="body2"><strong>Kendaraan:</strong> {selectedApp.vehicle}</Typography>
                                            <Typography variant="body2"><strong>Pengalaman:</strong> {selectedApp.experienceYears}</Typography>
                                            <Typography variant="body2"><strong>Jenis Proyek:</strong> {selectedApp.projectTypes}</Typography>
                                            <Typography variant="body2"><strong>Posisi Dilamar:</strong> {selectedApp.role}</Typography>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ mb: 3, p: 2, bgcolor: 'secondary.lighter', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom>Dokumen Pendukung</Typography>
                                        {selectedApp.documents.length === 0 ? (
                                            <Typography variant="body2" color="textSecondary">Tidak ada dokumen.</Typography>
                                        ) : (
                                            <Stack spacing={1}>
                                                {selectedApp.documents.map((doc, index) => (
                                                    <Typography key={`${doc}-${index}`} variant="body2">
                                                        <a href={buildFileUrl(doc)} target="_blank" rel="noreferrer">
                                                            Dokumen {index + 1}
                                                        </a>
                                                    </Typography>
                                                ))}
                                            </Stack>
                                        )}
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <InfoCard title="Departemen" value={selectedApp.department || '-'} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InfoCard title="Recruiter" value={selectedApp.recruiter || '-'} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InfoCard title="Tanggal Update" value={selectedApp.lastUpdate} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Right Side - Timeline */}
                                <Grid item xs={12} md={7}>
                                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Timeline Seleksi</Typography>
                                    <Timeline position="right" sx={{ mb: 2 }}>
                                        {selectedApp.timeline.map((item, index) => (
                                            <TimelineItem key={index}>
                                                <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                                                    {formatDate(item.eventDate)}
                                                    {/* DELETE BUTTON FOR TIMELINE */}
                                                    <Box sx={{ mt: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteTimeline(index)}
                                                            sx={{ opacity: 0.4, '&:hover': { opacity: 1 } }}
                                                        >
                                                            <DeleteOutlined style={{ fontSize: '10px' }} />
                                                        </IconButton>
                                                    </Box>
                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <TimelineDot color={item.status === 'completed' ? 'success' : item.status === 'rejected' ? 'error' : 'primary'} variant={item.status === 'current' ? 'outlined' : 'filled'} />
                                                    {index < selectedApp.timeline.length - 1 && <TimelineConnector />}
                                                </TimelineSeparator>
                                                <TimelineContent>
                                                    <Typography variant="subtitle1" component="span">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {item.desc}
                                                    </Typography>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>

                                    {/* Add Custom Timeline Item */}
                                    <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom color="primary">+ Tambah Event Manual</Typography>
                                        <Stack spacing={2}>
                                            <TextField
                                                placeholder="Judul Event (mis: Psikotes)"
                                                size="small"
                                                fullWidth
                                                value={newTimeline.title}
                                                onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                                            />
                                            <TextField
                                                placeholder="Keterangan"
                                                size="small"
                                                fullWidth
                                                value={newTimeline.desc}
                                                onChange={(e) => setNewTimeline({ ...newTimeline, desc: e.target.value })}
                                            />
                                            <Stack direction="row" spacing={1}>
                                                <TextField
                                                    select
                                                    size="small"
                                                    label="Tipe"
                                                    value={newTimeline.status}
                                                    onChange={(e) => setNewTimeline({ ...newTimeline, status: e.target.value })}
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    <MenuItem value="completed">Sukses</MenuItem>
                                                    <MenuItem value="current">Proses</MenuItem>
                                                    <MenuItem value="rejected">Gagal</MenuItem>
                                                    <MenuItem value="primary">Info</MenuItem>
                                                </TextField>
                                                <Button variant="contained" size="small" onClick={handleAddTimeline} disabled={!newTimeline.title}>
                                                    Tambah
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={handleClose} color="secondary">Tutup</Button>

                            {selectedApp.status === 'approved' && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<UserAddOutlined />}
                                    onClick={handleCreateAccount}
                                    sx={{ mr: 1 }}
                                >
                                    Buat Akun Tukang
                                </Button>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveOutlined />}
                                onClick={handleSaveChanges}
                            >
                                Simpan Perubahan
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </MainCard>
    );
}
