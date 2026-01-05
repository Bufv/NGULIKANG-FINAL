
import { useState } from 'react';

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
import Dot from 'components/@extended/Dot';

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

const initialApplications = [
    {
        id: 'APP-2024001',
        name: 'Budi Santoso',
        role: 'Mandor Lapangan',
        location: 'Jakarta',
        date: '28 Desember 2024',
        status: 'Ditolak',
        department: 'Operasional',
        recruiter: 'Tim HRD',
        lastUpdate: '28 Dec 2024',
        note: 'Tidak memenuhi kualifikasi pengalaman minimal.',
        photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        timeline: [
            { title: 'Pendaftaran Berkas', date: '28 Dec 2023', status: 'completed', desc: 'Berkas diterima sistem.' },
            { title: 'Verifikasi Admin', date: '28 Dec 2023', status: 'completed', desc: 'Admin memverifikasi kelengkapan.' },
            { title: 'Seleksi CV', date: '28 Dec 2023', status: 'rejected', desc: 'Pengalaman kurang dari 5 tahun.' }
        ]
    },
    {
        id: 'APP-2024045',
        name: 'Asep Saepul',
        role: 'Tukang Cat Interior',
        location: 'Bandung',
        date: '10 Januari 2025',
        status: 'Pending',
        department: 'Produksi',
        recruiter: 'Tim HRD',
        lastUpdate: '10 Jan 2025',
        note: 'Menunggu review portofolio.',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        timeline: [
            { title: 'Pendaftaran Berkas', date: '10 Jan 2025', status: 'completed', desc: 'Berkas diterima sistem.' },
            { title: 'Verifikasi Admin', date: '10 Jan 2025', status: 'current', desc: 'Sedang diverifikasi...' }
        ]
    },
    {
        id: 'APP-2024002',
        name: 'Joko Widodo',
        role: 'Tukang Kayu Profesional',
        location: 'Surabaya',
        date: '02 Januari 2025',
        status: 'Interview',
        department: 'Produksi',
        recruiter: 'Pak Hartono',
        lastUpdate: '12 Jan 2025',
        note: 'Perlu tes praktek pembuatan kursi.',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        timeline: [
            { title: 'Pendaftaran Berkas', date: '02 Jan 2025', status: 'completed', desc: 'Berkas lengkap.' },
            { title: 'Verifikasi Admin', date: '03 Jan 2025', status: 'completed', desc: 'Lolos verifikasi.' },
            { title: 'Interview User', date: '12 Jan 2025', status: 'current', desc: 'Jadwal interview Senin depan.' }
        ]
    }
];

const statusOptions = ['Pending', 'Interview', 'Diterima', 'Ditolak'];

function StatusChip({ status }) {
    let color;
    let icon;

    switch (status) {
        case 'Pending':
            color = 'warning';
            icon = <ClockCircleOutlined />;
            break;
        case 'Interview':
            color = 'info';
            icon = <UserOutlined />;
            break;
        case 'Diterima':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
        case 'Ditolak':
            color = 'error';
            icon = <CloseCircleOutlined />;
            break;
        default:
            color = 'default';
    }

    return (
        <Chip
            icon={icon}
            label={status}
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
    const [rows, setRows] = useState(initialApplications);
    const [open, setOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [note, setNote] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [newTimeline, setNewTimeline] = useState({ title: '', desc: '', status: 'completed' });

    const handleOpen = (app) => {
        setSelectedApp(app);
        setNote(app.note);
        setEditStatus(app.status);
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
        const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const newItem = {
            ...newTimeline,
            date: today
        }; // Status is already in newTimeline

        const updatedTimeline = [...selectedApp.timeline, newItem];
        const updatedApp = { ...selectedApp, timeline: updatedTimeline };

        setSelectedApp(updatedApp);
        setRows(rows.map(r => r.id === selectedApp.id ? updatedApp : r));
        setNewTimeline({ title: '', desc: '', status: 'completed' }); // Reset form
    };

    const handleSaveChanges = () => {
        if (!selectedApp) return;

        const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        let updatedTimeline = [...selectedApp.timeline];

        // If status changed to a final state, add to timeline AUTOMATICALLY
        if (editStatus !== selectedApp.status) {
            // Mark previous last step as completed if it wasn't
            const lastIdx = updatedTimeline.length - 1;
            if (updatedTimeline[lastIdx] && updatedTimeline[lastIdx].status === 'current') {
                updatedTimeline[lastIdx].status = 'completed';
            }

            if (editStatus === 'Diterima') {
                updatedTimeline.push({
                    title: 'Diterima',
                    date: today,
                    status: 'completed',
                    desc: 'Selamat! Anda diterima menjadi mitra Tukang.'
                });
            } else if (editStatus === 'Ditolak') {
                updatedTimeline.push({
                    title: 'Ditolak',
                    date: today,
                    status: 'rejected',
                    desc: 'Lamaran tidak dilanjutkan.'
                });
            } else if (editStatus === 'Interview') {
                updatedTimeline.push({
                    title: 'Interview',
                    date: today,
                    status: 'current',
                    desc: 'Proses interview dijadwalkan.'
                });
            }
        }

        const updatedApp = {
            ...selectedApp,
            status: editStatus,
            timeline: updatedTimeline,
            note: note,
            lastUpdate: today
        };

        setRows(rows.map(r => r.id === selectedApp.id ? updatedApp : r));
        setSelectedApp(updatedApp);

        alert('Perubahan berhasil disimpan.');
        handleClose();
    };

    const handleCreateAccount = () => {
        alert("Akun tukang berhasil dibuat!");
        handleClose();
    };


    return (
        <MainCard title="Daftar Lamaran Masuk">
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
                        {rows.map((row) => (
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
                        ))}
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
                                                <MenuItem key={option} value={option}>
                                                    {option}
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


                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <InfoCard title="Departemen" value={selectedApp.department} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InfoCard title="Recruiter" value={selectedApp.recruiter} />
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
                                                    {item.date}
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

                            {selectedApp.status === 'Diterima' && (
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
