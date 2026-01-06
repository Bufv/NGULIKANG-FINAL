const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../config/prisma');
const env = require('../config/env');
const { hashPassword, comparePassword } = require('../utils/password');
const { hashToken, createAccessToken, createRefreshToken, getRefreshExpiryDate } = require('../utils/tokens');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(['user', 'tukang', 'admin']).optional(),
  adminSecret: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1)
});

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const issueTokens = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  const tokenHash = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: getRefreshExpiryDate()
    }
  });

  return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const role = payload.role || 'user';

    if (role === 'admin' && payload.adminSecret !== env.adminRegisterSecret) {
      return res.status(403).json({ message: 'Admin registration is not allowed' });
    }

    if (role !== 'admin' && payload.adminSecret) {
      return res.status(400).json({ message: 'Admin secret is only for admin registration' });
    }

    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        phone: payload.phone,
        role,
        tukangProfile:
          role === 'tukang'
            ? {
              create: {
                skills: [],
                verified: false,
                saldo: 0
              }
            }
            : undefined
      }
    });

    const tokens = await issueTokens(user);

    return res.status(201).json({
      user: sanitizeUser(user),
      ...tokens
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await comparePassword(payload.password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokens = await issueTokens(user);

    return res.json({
      user: sanitizeUser(user),
      ...tokens
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const payload = refreshSchema.parse(req.body);
    const decoded = jwt.verify(payload.refreshToken, env.jwtRefreshSecret);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const tokenHash = hashToken(payload.refreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!tokenRecord || tokenRecord.revokedAt) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    if (tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    if (tokenRecord.userId !== decoded.sub) {
      return res.status(401).json({ message: 'Refresh token mismatch' });
    }

    await prisma.refreshToken.update({
      where: { tokenHash },
      data: { revokedAt: new Date() }
    });

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tokens = await issueTokens(user);

    return res.json({
      user: sanitizeUser(user),
      ...tokens
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const payload = logoutSchema.parse(req.body);
    const tokenHash = hashToken(payload.refreshToken);

    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() }
    });

    return res.json({ message: 'Logged out' });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    // Note: address is not in User schema currently, so we can't save it to DB 
    // unless we add it to schema. For now we ignore it to prevent errors.

    if (req.file) {
      // Nginx serves /uploads/ mapped to the uploads folder
      const avatarUrl = `/uploads/${req.file.filename}`;
      updateData.avatar = avatarUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return res.json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  updateProfile
};
