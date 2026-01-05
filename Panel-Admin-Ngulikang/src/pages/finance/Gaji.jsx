
import { useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';

// assets
import {
    BankOutlined,
    WalletOutlined,
    CheckCircleOutlined,
    HistoryOutlined,
    DollarOutlined
} from '@ant-design/icons';

// ==============================|| GAJI / FINANCE PAGE ||============================== //

const initialIncome = [
    { id: 'INV-001', project: 'Renovasi Dapur', user: 'Bpk. Ahmad', amount: 5000000, date: '2024-01-01', status: 'Received' },
    { id: 'INV-002', project: 'Perbaikan Atap', user: 'Ibu Susi', amount: 1500000, date: '2024-01-02', status: 'Received' },
    { id: 'INV-003', project: 'Instalasi Listrik', user: 'Pak Budi', amount: 750000, date: '2024-01-03', status: 'Pending' }
];

const initialPayouts = [
    { id: 'PAY-001', tukang: 'Budi Santoso', project: 'Renovasi Dapur', amount: 4500000, status: 'Pending', date: '-' },
    { id: 'PAY-002', tukang: 'Asep Saepul', project: 'Perbaikan Atap', amount: 1350000, status: 'Completed', date: '2024-01-03' }
];

function StatusChip({ status }) {
    let color;
    if (status === 'Received' || status === 'Completed' || status === 'paid') color = 'success';
    else if (status === 'Pending') color = 'warning';
    else color = 'error';

    return <Chip label={status} color={color} size="small" variant="outlined" />;
}

export default function GajiPage() {
    const [tabValue, setTabValue] = useState(0);
    const [incomeData, setIncomeData] = useState(initialIncome);
    const [payoutData, setPayoutData] = useState(initialPayouts);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenTransfer = (row) => {
        setSelectedPayout(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPayout(null);
    };

    const handleTransferProcess = () => {
        if (!selectedPayout) return;

        // Update payout status
        const updatedPayouts = payoutData.map(item =>
            item.id === selectedPayout.id
                ? { ...item, status: 'Completed', date: new Date().toISOString().split('T')[0] }
                : item
        );
        setPayoutData(updatedPayouts);

        alert(`Transfer sebesar Rp${selectedPayout.amount.toLocaleString()} berhasil dikirim ke dompet ${selectedPayout.tukang}.`);
        handleCloseDialog();
    };

    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    return (
        <MainCard title="Manajemen Keuangan & Gaji Tukang">
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="finance tabs">
                    <Tab label="Pemasukan (Dari User)" icon={<BankOutlined />} iconPosition="start" />
                    <Tab label="Penggajian (Ke Tukang)" icon={<WalletOutlined />} iconPosition="start" />
                </Tabs>
            </Box>

            {/* TAB 0: PEMASUKAN */}
            <div role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID Invoice</TableCell>
                                    <TableCell>Proyek</TableCell>
                                    <TableCell>Dari User</TableCell>
                                    <TableCell>Total Masuk</TableCell>
                                    <TableCell>Tanggal</TableCell>
                                    <TableCell>Status Rekening</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {incomeData.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.project}</TableCell>
                                        <TableCell>{row.user}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                            + {formatCurrency(row.amount)}
                                        </TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell><StatusChip status={row.status} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {/* TAB 1: PENGGAJIAN */}
            <div role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID Transaksi</TableCell>
                                    <TableCell>Penerima (Tukang)</TableCell>
                                    <TableCell>Sumber Proyek</TableCell>
                                    <TableCell>Nominal Gaji</TableCell>
                                    <TableCell>Tanggal Transfer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payoutData.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">{row.tukang}</Typography>
                                        </TableCell>
                                        <TableCell>{row.project}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(row.amount)}
                                        </TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell><StatusChip status={row.status} /></TableCell>
                                        <TableCell align="right">
                                            {row.status === 'Pending' ? (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    startIcon={<DollarOutlined />}
                                                    onClick={() => handleOpenTransfer(row)}
                                                >
                                                    Transfer Gaji
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    disabled
                                                    startIcon={<CheckCircleOutlined />}
                                                >
                                                    Terkirim
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {/* TRANSFER DIALOG */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Konfirmasi Transfer Gaji</DialogTitle>
                <DialogContent>
                    {selectedPayout && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Typography variant="body1">
                                Anda akan mengirimkan gaji kepada <b>{selectedPayout.tukang}</b> untuk proyek <b>{selectedPayout.project}</b>.
                            </Typography>
                            <TextField
                                label="Nominal Transfer"
                                value={selectedPayout.amount}
                                disabled
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                            />
                            <Typography variant="caption" color="textSecondary">
                                Dana akan dipotong dari saldo Rekening Perusahaan dan masuk ke Dompet Aplikasi Tukang.
                            </Typography>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Batal</Button>
                    <Button onClick={handleTransferProcess} variant="contained" color="primary">
                        Kirim Sekarang
                    </Button>
                </DialogActions>
            </Dialog>

        </MainCard>
    );
}
