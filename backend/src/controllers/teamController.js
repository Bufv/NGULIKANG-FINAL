const prisma = require('../config/prisma');

const formatPriceLabel = (value, suffix) => {
  if (value === null || value === undefined) {
    return '-';
  }
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return '-';
  }
  if (numberValue >= 1000000) {
    const rounded = (numberValue / 1000000).toFixed(1).replace(/\.0$/, '');
    return `Rp ${rounded}jt/${suffix}`;
  }
  if (numberValue >= 1000) {
    const rounded = Math.round(numberValue / 1000);
    return `Rp ${rounded}rb/${suffix}`;
  }
  return `Rp ${Math.round(numberValue)}/${suffix}`;
};

const buildDefaultMembers = (user, profile) => {
  const skill = profile?.skills?.[0] || 'Tukang';
  return [{ name: user.name, role: skill }];
};

const buildDefaultReviews = (user, rating) => {
  const safeRating = Number.isFinite(rating) ? Math.max(1, Math.min(5, Math.round(rating))) : 5;
  return [
    {
      name: user.name,
      rating: safeRating,
      date: 'Baru saja',
      comment: 'Pelayanan cepat dan hasil rapi.'
    }
  ];
};

const listTeams = async (req, res, next) => {
  try {
    const service = req.query.service === 'borongan' ? 'borongan' : 'harian';
    const suffix = service === 'borongan' ? 'proyek' : 'hari';

    const users = await prisma.user.findMany({
      where: {
        role: 'tukang',
        tukangProfile: {
          verified: true
        }
      },
      include: {
        tukangProfile: true
      }
    });

    // Get active/busy tukangs (those in OPEN chat rooms)
    const activeChats = await prisma.chatRoom.findMany({
      where: {
        status: 'OPEN',
        type: 'NORMAL',
        tukangId: { not: null }
      },
      select: { tukangId: true }
    });

    const busyTukangIds = new Set(activeChats.map(c => c.tukangId));

    const teams = users
      .filter(user => !busyTukangIds.has(user.id)) // Filter out busy tukangs
      .map((user, index) => {
        const profile = user.tukangProfile || {};
        const priceValue = service === 'borongan' ? profile.priceBorongan : profile.priceHarian;
        const priceLabel = priceValue
          ? formatPriceLabel(priceValue, suffix)
          : formatPriceLabel(150000 + index * 25000, suffix);
        const members = Array.isArray(profile.members) && profile.members.length
          ? profile.members
          : buildDefaultMembers(user, profile);
        const reviewsList = Array.isArray(profile.reviewSamples) && profile.reviewSamples.length
          ? profile.reviewSamples
          : buildDefaultReviews(user, profile.rating);
        const reviewCount = profile.reviewCount || reviewsList.length;

        return {
          id: user.id,
          name: user.name,
          image: profile.photoUrl || user.avatar || 'https://via.placeholder.com/60',
          rating: Number(profile.rating || 0),
          reviews: reviewCount,
          members,
          projects: profile.projectsCount || 0,
          experience: profile.experience || '-',
          price: priceLabel,
          isPopular: profile.isPopular || Number(profile.rating || 0) >= 4.7,
          reviewsList
        };
      });

    return res.json({ data: teams });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTeams
};
