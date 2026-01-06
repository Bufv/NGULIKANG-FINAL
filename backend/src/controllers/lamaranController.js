const { z } = require('zod');
const prisma = require('../config/prisma');

const createLamaranSchema = z.object({
  fullName: z.string().min(2),
  ktp: z.string().min(8),
  address: z.string().min(5),
  phone: z.string().min(6),
  email: z.string().email(),
  maritalStatus: z.string().min(1),
  domicile: z.string().min(1),
  relocate: z.string().optional(),
  vehicle: z.string().optional(),
  experienceYears: z.string().min(1),
  projectTypes: z.string().min(1),
  jobRoles: z.array(z.string()).min(1)
});

const updateLamaranSchema = z
  .object({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    note: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    recruiter: z.string().optional().nullable(),
    timeline: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().optional().nullable(),
          status: z.string().min(1),
          eventDate: z.string().datetime().optional()
        })
      )
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required'
  });

const parseJobRoles = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      // fall back to comma-separated values
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const toBoolean = (value) => {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  const normalized = String(value).toLowerCase();
  if (['yes', 'true', 'ya', '1'].includes(normalized)) {
    return true;
  }
  if (['no', 'false', 'tidak', '0'].includes(normalized)) {
    return false;
  }
  return null;
};

const mapLamaranResponse = (lamaran) => ({
  ...lamaran,
  timeline: (lamaran.timeline || []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    eventDate: item.eventDate
  }))
});

const createLamaran = async (req, res, next) => {
  try {
    const existing = await prisma.lamaran.findFirst({
      where: { userId: req.user.id }
    });

    if (existing) {
      return res.status(409).json({ message: 'Lamaran sudah ada untuk akun ini.' });
    }

    const jobRoles = parseJobRoles(req.body.jobRoles);
    const payload = createLamaranSchema.parse({
      fullName: req.body.fullName,
      ktp: req.body.ktp,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      maritalStatus: req.body.maritalStatus,
      domicile: req.body.domicile,
      relocate: req.body.relocate,
      vehicle: req.body.vehicle,
      experienceYears: req.body.experienceYears,
      projectTypes: req.body.projectTypes,
      jobRoles
    });

    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: 'Dokumen wajib diunggah.' });
    }

    const documents = files.map((file) => `/uploads/${file.filename}`);
    const relocateValue = toBoolean(payload.relocate);

    const now = new Date();
    const lamaran = await prisma.$transaction(async (tx) => {
      const created = await tx.lamaran.create({
        data: {
          userId: req.user.id,
          fullName: payload.fullName,
          ktp: payload.ktp,
          address: payload.address,
          phone: payload.phone,
          email: payload.email,
          maritalStatus: payload.maritalStatus,
          domicile: payload.domicile,
          relocate: relocateValue,
          vehicle: payload.vehicle,
          experienceYears: payload.experienceYears,
          projectTypes: payload.projectTypes,
          jobRoles: payload.jobRoles,
          skills: payload.jobRoles,
          documents,
          status: 'pending'
        }
      });

      await tx.lamaranTimeline.createMany({
        data: [
          {
            lamaranId: created.id,
            title: 'Pendaftaran',
            description: 'Lamaran masuk.',
            status: 'completed',
            eventDate: now
          },
          {
            lamaranId: created.id,
            title: 'Review Admin',
            description: 'Menunggu review admin.',
            status: 'current',
            eventDate: now
          }
        ]
      });

      return created;
    });

    const withTimeline = await prisma.lamaran.findUnique({
      where: { id: lamaran.id },
      include: { timeline: { orderBy: { createdAt: 'asc' } } }
    });

    return res.status(201).json({ data: mapLamaranResponse(withTimeline) });
  } catch (error) {
    return next(error);
  }
};

const getMyLamaran = async (req, res, next) => {
  try {
    const lamaran = await prisma.lamaran.findFirst({
      where: { userId: req.user.id },
      orderBy: { submittedAt: 'desc' },
      include: { timeline: { orderBy: { createdAt: 'asc' } } }
    });

    if (!lamaran) {
      return res.status(404).json({ message: 'Lamaran belum tersedia.' });
    }

    return res.json({ data: mapLamaranResponse(lamaran) });
  } catch (error) {
    return next(error);
  }
};

const listLamaran = async (req, res, next) => {
  try {
    const lamaran = await prisma.lamaran.findMany({
      orderBy: { submittedAt: 'desc' },
      include: { timeline: { orderBy: { createdAt: 'asc' } } }
    });

    return res.json({ data: lamaran.map(mapLamaranResponse) });
  } catch (error) {
    return next(error);
  }
};

const updateLamaran = async (req, res, next) => {
  try {
    const payload = updateLamaranSchema.parse(req.body);
    const lamaranId = req.params.id;

    const existing = await prisma.lamaran.findUnique({
      where: { id: lamaranId },
      include: { timeline: true }
    });
    if (!existing) {
      return res.status(404).json({ message: 'Lamaran tidak ditemukan.' });
    }

    const timelineData = payload.timeline || null;
    const data = {
      status: payload.status ?? existing.status,
      note: payload.note ?? existing.note,
      department: payload.department ?? existing.department,
      recruiter: payload.recruiter ?? existing.recruiter
    };

    const updated = await prisma.$transaction(async (tx) => {
      const updatedLamaran = await tx.lamaran.update({
        where: { id: lamaranId },
        data
      });

      if (timelineData) {
        await tx.lamaranTimeline.deleteMany({ where: { lamaranId } });
        await tx.lamaranTimeline.createMany({
          data: timelineData.map((item) => ({
            lamaranId,
            title: item.title,
            description: item.description || null,
            status: item.status,
            eventDate: item.eventDate ? new Date(item.eventDate) : new Date()
          }))
        });
      }

      return updatedLamaran;
    });

    const withTimeline = await prisma.lamaran.findUnique({
      where: { id: updated.id },
      include: { timeline: { orderBy: { createdAt: 'asc' } } }
    });

    return res.json({ data: mapLamaranResponse(withTimeline) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createLamaran,
  getMyLamaran,
  listLamaran,
  updateLamaran
};
