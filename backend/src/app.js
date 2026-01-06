const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const teamRoutes = require('./routes/teamRoutes');
<<<<<<< HEAD
const negotiationRoutes = require('./routes/negotiationRoutes');
=======
const lamaranRoutes = require('./routes/lamaranRoutes');
>>>>>>> b3fbbba0047a499f9e1f718a13bf5099cf26414d
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins.length ? env.corsOrigins : true,
    credentials: true
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/uploads', express.static(uploadDir));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', teamRoutes);
<<<<<<< HEAD
app.use('/api/negotiation', negotiationRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));
=======
app.use('/api', lamaranRoutes);
>>>>>>> b3fbbba0047a499f9e1f718a13bf5099cf26414d

app.use(notFound);
app.use(errorHandler);

module.exports = app;
