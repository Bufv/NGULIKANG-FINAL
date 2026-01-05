const { z } = require('zod');
const prisma = require('../config/prisma');
const { hashPassword } = require('../utils/password');

const memberSchema = z
  .object({
    name: z.string().min(1),
    role: z.string().optional()
  })
  .passthrough();

const reviewSchema = z
  .object({
    name: z.string().min(1),
    rating: z.number().optional(),
    date: z.string().optional(),
    comment: z.string().optional()
  })
  .passthrough();

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'tukang', 'admin']).default('user'),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  tukangProfile: z
    .object({
      skills: z.array(z.string()).optional(),
      experience: z.string().optional(),
      rating: z.number().optional(),
      verified: z.boolean().optional(),
      bankAccount: z.string().optional(),
      saldo: z.number().optional(),
      priceHarian: z.coerce.number().optional(),
      priceBorongan: z.coerce.number().optional(),
      projectsCount: z.coerce.number().int().optional(),
      reviewCount: z.coerce.number().int().optional(),
      isPopular: z.boolean().optional(),
      photoUrl: z.string().optional(),
      members: z.array(memberSchema).optional(),
      reviewSamples: z.array(reviewSchema).optional()
    })
    .optional()
});

const updateUserSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(['user', 'tukang', 'admin']).optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    tukangProfile: z
      .object({
        skills: z.array(z.string()).optional(),
        experience: z.string().optional(),
        rating: z.number().optional(),
        verified: z.boolean().optional(),
        bankAccount: z.string().optional(),
        saldo: z.number().optional(),
        priceHarian: z.coerce.number().optional(),
        priceBorongan: z.coerce.number().optional(),
        projectsCount: z.coerce.number().int().optional(),
        reviewCount: z.coerce.number().int().optional(),
        isPopular: z.boolean().optional(),
        photoUrl: z.string().optional(),
        members: z.array(memberSchema).optional(),
        reviewSamples: z.array(reviewSchema).optional()
      })
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required'
  });

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ users: users.map(sanitizeUser) });
  } catch (error) {
    return next(error);
  }
};

const listTukang = async (req, res, next) => {
  try {
    const tukang = await prisma.user.findMany({
      where: { role: 'tukang' },
      include: { tukangProfile: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ tukang: tukang.map(sanitizeUser) });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const payload = createUserSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(payload.password);

    if (payload.role !== 'tukang' && payload.tukangProfile) {
      return res.status(400).json({ message: 'Tukang profile requires role tukang' });
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
        phone: payload.phone,
        avatar: payload.avatar,
        tukangProfile:
          payload.role === 'tukang'
            ? {
                create: {
                  skills: payload.tukangProfile?.skills || [],
                  experience: payload.tukangProfile?.experience,
                  rating: payload.tukangProfile?.rating || 0,
                  verified: payload.tukangProfile?.verified || false,
                  bankAccount: payload.tukangProfile?.bankAccount,
                  saldo: payload.tukangProfile?.saldo || 0,
                  priceHarian: payload.tukangProfile?.priceHarian,
                  priceBorongan: payload.tukangProfile?.priceBorongan,
                  projectsCount: payload.tukangProfile?.projectsCount,
                  reviewCount: payload.tukangProfile?.reviewCount,
                  isPopular: payload.tukangProfile?.isPopular,
                  photoUrl: payload.tukangProfile?.photoUrl,
                  members: payload.tukangProfile?.members,
                  reviewSamples: payload.tukangProfile?.reviewSamples
                }
              }
            : undefined
      }
    });

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const payload = updateUserSchema.parse(req.body);
    const userId = req.params.id;

    const existing = await prisma.user.findUnique({ where: { id: userId }, include: { tukangProfile: true } });
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { tukangProfile, ...userData } = payload;
    const data = { ...userData };
    if (payload.password) {
      data.password = await hashPassword(payload.password);
    }

    let user = existing;
    if (Object.keys(data).length > 0) {
      user = await prisma.user.update({
        where: { id: userId },
        data
      });
    }

    const roleToApply = payload.role || existing.role;
    if (roleToApply === 'tukang') {
      const profileData = tukangProfile || {};
      await prisma.tukangProfile.upsert({
        where: { userId },
        update: {
          skills: profileData.skills,
          experience: profileData.experience,
          rating: profileData.rating,
          verified: profileData.verified,
          bankAccount: profileData.bankAccount,
          saldo: profileData.saldo,
          priceHarian: profileData.priceHarian,
          priceBorongan: profileData.priceBorongan,
          projectsCount: profileData.projectsCount,
          reviewCount: profileData.reviewCount,
          isPopular: profileData.isPopular,
          photoUrl: profileData.photoUrl,
          members: profileData.members,
          reviewSamples: profileData.reviewSamples
        },
        create: {
          userId,
          skills: profileData.skills || [],
          experience: profileData.experience,
          rating: profileData.rating || 0,
          verified: profileData.verified || false,
          bankAccount: profileData.bankAccount,
          saldo: profileData.saldo || 0,
          priceHarian: profileData.priceHarian,
          priceBorongan: profileData.priceBorongan,
          projectsCount: profileData.projectsCount,
          reviewCount: profileData.reviewCount,
          isPopular: profileData.isPopular,
          photoUrl: profileData.photoUrl,
          members: profileData.members,
          reviewSamples: profileData.reviewSamples
        }
      });
    } else if (tukangProfile) {
      return res.status(400).json({ message: 'Tukang profile requires role tukang' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await prisma.user.delete({ where: { id: userId } });
    return res.json({ message: 'User deleted' });
  } catch (error) {
    return next(error);
  }
};

const verifyTukang = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const profile = await prisma.tukangProfile.upsert({
      where: { userId },
      update: { verified: true },
      create: { userId, skills: [], verified: true, saldo: 0 }
    });

    return res.json({ tukangProfile: profile });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listUsers,
  listTukang,
  createUser,
  updateUser,
  deleteUser,
  verifyTukang
};
