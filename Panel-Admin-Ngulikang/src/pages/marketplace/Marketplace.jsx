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
    IconButton,
    MenuItem,
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
    CardMedia,
    InputAdornment,
    TablePagination
} from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { adminApi } from 'lib/api';

// assets
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    ShopOutlined,
    CloudUploadOutlined,
    EnvironmentTwoTone
} from '@ant-design/icons';

// ==============================|| MARKETPLACE PAGE ||============================== //

const CATEGORY_OPTIONS = [
    'Bahan Bangunan',
    'Peralatan',
    'Listrik',
    'Pipa & Sanitasi',
    'Cat & Finishing',
    'Kayu & Furnitur',
    'Atap & Plafon',
    'Lainnya'
];

const CONDITION_OPTIONS = ['Baru', 'Bekas', 'Rekondisi'];

const WEIGHT_UNITS = ['kg', 'g', 'ton'];

const createEmptyForm = () => ({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    location: '',
    imageUrl: '',
    condition: '',
    weight: '',
    weightUnit: 'kg',
    specs: [{ label: '', value: '' }],
    images: ['']
});

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(createEmptyForm());
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchProducts = async (targetPage = page, limit = rowsPerPage) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await adminApi.getProducts({
                page: targetPage + 1,
                limit
            });
            setProducts(data.data || []);
            setTotal(data.pagination?.total || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat produk marketplace');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, rowsPerPage]);

    const handleOpen = () => {
        setOpen(true);
        setEditingId(null);
        setFormData(createEmptyForm());
        setPreviewImage(null);
    };

    const handleEdit = async (product) => {
        setEditingId(product.id);
        setFormData({
            ...createEmptyForm(),
            name: product.name || '',
            price: product.price || '',
            category: product.category || '',
            stock: product.stock ?? '',
            description: product.description || '',
            location: product.location || '',
            imageUrl: product.imageUrl || ''
        });
        setPreviewImage(product.imageUrl || null);
        setOpen(true);

        setEditLoading(true);
        try {
            const { data } = await adminApi.getProduct(product.id);
            const detail = data?.data;
            if (detail) {
                setFormData({
                    ...createEmptyForm(),
                    name: detail.name || '',
                    price: detail.price || '',
                    category: detail.category || '',
                    stock: detail.stock ?? '',
                    description: detail.description || '',
                    location: detail.location || '',
                    imageUrl: detail.imageUrl || '',
                    condition: detail.condition || '',
                    weight: detail.weight || '',
                    weightUnit: detail.weightUnit || 'kg',
                    specs: detail.specs?.length
                        ? detail.specs.map((spec) => ({ label: spec.label || '', value: spec.value || '' }))
                        : [{ label: '', value: '' }],
                    images: detail.images?.length ? detail.images : ['']
                });
                setPreviewImage(detail.imageUrl || null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat detail produk');
        } finally {
            setEditLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        setFormData(createEmptyForm());
        setPreviewImage(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus produk ini?')) {
            return;
        }
        try {
            await adminApi.deleteProduct(id);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menghapus produk');
        }
    };

    const updateSpec = (index, field, value) => {
        const nextSpecs = [...(formData.specs || [])];
        nextSpecs[index] = { ...nextSpecs[index], [field]: value };
        setFormData({ ...formData, specs: nextSpecs });
    };

    const addSpec = () => {
        setFormData({ ...formData, specs: [...(formData.specs || []), { label: '', value: '' }] });
    };

    const removeSpec = (index) => {
        const nextSpecs = (formData.specs || []).filter((_, idx) => idx !== index);
        setFormData({ ...formData, specs: nextSpecs.length ? nextSpecs : [{ label: '', value: '' }] });
    };

    const updateGalleryImage = (index, value) => {
        const nextImages = [...(formData.images || [])];
        nextImages[index] = value;
        setFormData({ ...formData, images: nextImages });
    };

    const addGalleryImage = () => {
        setFormData({ ...formData, images: [...(formData.images || []), ''] });
    };

    const removeGalleryImage = (index) => {
        const nextImages = (formData.images || []).filter((_, idx) => idx !== index);
        setFormData({ ...formData, images: nextImages.length ? nextImages : [''] });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) {
            setError('Nama dan Harga wajib diisi!');
            return;
        }

        setError('');
        try {
            const payload = {
                name: formData.name,
                price: Number(formData.price),
                category: formData.category,
                stock: Number(formData.stock || 0),
                description: formData.description,
                location: formData.location,
                imageUrl: formData.imageUrl,
                condition: formData.condition,
                weight: formData.weight !== '' ? Number(formData.weight) : undefined,
                weightUnit: formData.weightUnit,
                images: (formData.images || [])
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .map((url) => ({ url })),
                specs: (formData.specs || [])
                    .map((spec) => ({ label: spec.label?.trim(), value: spec.value?.trim() }))
                    .filter((spec) => spec.label && spec.value)
            };

            let productResponse;
            if (editingId) {
                productResponse = await adminApi.updateProduct(editingId, payload);
            } else {
                productResponse = await adminApi.createProduct(payload);
            }

            await fetchProducts();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan produk');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value || 0));
    };

    return (
        <MainCard title="Manajemen Produk Marketplace">
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpen}>
                    Tambah Produk
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produk</TableCell>
                            <TableCell>Kategori</TableCell>
                            <TableCell>Harga</TableCell>
                            <TableCell>Stok</TableCell>
                            <TableCell align="right">Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5}>Memuat...</TableCell>
                            </TableRow>
                        )}
                        {!loading && products.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                                            image={row.imageUrl || 'https://via.placeholder.com/60'}
                                            alt={row.name}
                                        />
                                        <Box>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Typography variant="subtitle1">{row.name}</Typography>
                                            </Stack>

                                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                                                <EnvironmentTwoTone twoToneColor="#eb2f96" style={{ fontSize: '10px' }} />
                                                <Typography variant="caption" color="textSecondary">{row.location || 'Lokasi tidak tersedia'}</Typography>
                                            </Stack>

                                            <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                sx={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                            >
                                                {row.description}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.category || '-'}</TableCell>
                                <TableCell>{formatCurrency(row.price)}</TableCell>
                                <TableCell>
                                    <Typography color={row.stock < 10 ? 'error' : 'inherit'}>
                                        {row.stock} Unit
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" onClick={() => handleEdit(row)}>
                                                <EditOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Hapus">
                                            <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                <DeleteOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!loading && products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Box sx={{ py: 3 }}>
                                        <ShopOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                                        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                            Belum ada produk. Silakan tambahkan produk baru.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
            />

            {/* Form Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
                <DialogContent dividers>
                    {editLoading && (
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Memuat detail produk...
                        </Typography>
                    )}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={2}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 250,
                                        border: '2px dashed',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        bgcolor: 'grey.50'
                                    }}
                                >
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <>
                                            <CloudUploadOutlined style={{ fontSize: '32px', color: '#aaa' }} />
                                            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                                                Masukkan link gambar produk
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                                <TextField
                                    label="Link Gambar"
                                    placeholder="https://example.com/produk.jpg"
                                    fullWidth
                                    value={formData.imageUrl}
                                    onChange={(e) => {
                                        const nextValue = e.target.value;
                                        setFormData({ ...formData, imageUrl: nextValue });
                                        setPreviewImage(nextValue || null);
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Nama Produk"
                                    fullWidth
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <TextField
                                    label="Lokasi / Kota"
                                    fullWidth
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><EnvironmentTwoTone twoToneColor="#eb2f96" /></InputAdornment>,
                                    }}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Harga (Rp)"
                                            type="number"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                            }}
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Stok"
                                            type="number"
                                            fullWidth
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    label="Kategori"
                                    fullWidth
                                    select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <MenuItem value="">Pilih kategori</MenuItem>
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Deskripsi Produk"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={2}>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <TextField
                                        label="Kondisi"
                                        select
                                        fullWidth
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                    >
                                        <MenuItem value="">Pilih kondisi</MenuItem>
                                        {CONDITION_OPTIONS.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        label="Berat"
                                        type="number"
                                        fullWidth
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                    <TextField
                                        label="Satuan Berat"
                                        select
                                        fullWidth
                                        value={formData.weightUnit}
                                        onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                                    >
                                        {WEIGHT_UNITS.map((unit) => (
                                            <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>

                                <Box>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                        <Typography variant="subtitle1">Spesifikasi Produk</Typography>
                                        <Button size="small" onClick={addSpec} startIcon={<PlusOutlined />}>Tambah</Button>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {(formData.specs || []).map((spec, index) => (
                                            <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                                                <TextField
                                                    label="Label"
                                                    fullWidth
                                                    value={spec.label}
                                                    onChange={(e) => updateSpec(index, 'label', e.target.value)}
                                                />
                                                <TextField
                                                    label="Nilai"
                                                    fullWidth
                                                    value={spec.value}
                                                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                                />
                                                <IconButton color="error" onClick={() => removeSpec(index)}>
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Box>

                                <Box>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                        <Typography variant="subtitle1">Galeri Foto (URL)</Typography>
                                        <Button size="small" onClick={addGalleryImage} startIcon={<PlusOutlined />}>Tambah</Button>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {(formData.images || []).map((url, index) => (
                                            <Stack key={index} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                                                <TextField
                                                    label={`Foto ${index + 1}`}
                                                    fullWidth
                                                    value={url}
                                                    onChange={(e) => updateGalleryImage(index, e.target.value)}
                                                />
                                                <IconButton color="error" onClick={() => removeGalleryImage(index)}>
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Batal</Button>
                    <Button onClick={handleSave} variant="contained" color="primary" disabled={editLoading}>Simpan Produk</Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}
