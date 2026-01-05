const { z } = require('zod');
const { Prisma } = require('@prisma/client');
const prisma = require('../config/prisma');

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});

const imageSchema = z.object({
  url: z.string().min(1)
});

const specSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1)
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  category: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  condition: z.string().optional(),
  weight: z.coerce.number().positive().optional(),
  weightUnit: z.string().optional(),
  images: z.array(imageSchema).optional(),
  specs: z.array(specSchema).optional(),
  stock: z.coerce.number().int().min(0)
});

const buildWhere = ({ search, category, minPrice, maxPrice }) => {
  const where = {};
  if (category) {
    where.category = { contains: category, mode: 'insensitive' };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = new Prisma.Decimal(minPrice);
    }
    if (maxPrice !== undefined) {
      where.price.lte = new Prisma.Decimal(maxPrice);
    }
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } }
    ];
  }
  return where;
};

const fetchProductDetail = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      productImages: { orderBy: { sortOrder: 'asc' } },
      productSpecs: { orderBy: { sortOrder: 'asc' } },
      reviews: { orderBy: { createdAt: 'desc' } }
    }
  });
};

const buildProductDetailPayload = (product) => {
  const reviews = product.reviews || [];
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let ratingSum = 0;
  for (const review of reviews) {
    const rating = Math.max(1, Math.min(5, Number(review.rating || 0)));
    ratingCounts[rating] += 1;
    ratingSum += rating;
  }

  const totalRatings = reviews.length;
  const averageRating = totalRatings ? Number((ratingSum / totalRatings).toFixed(1)) : 0;
  const satisfaction = totalRatings
    ? Math.round((reviews.filter((review) => Number(review.rating || 0) >= 4).length / totalRatings) * 100)
    : 0;

  return {
    ...product,
    images: product.productImages.map((image) => image.url),
    specs: product.productSpecs.map((spec) => ({ label: spec.label, value: spec.value })),
    reviews,
    ratingStats: {
      average: averageRating,
      total: totalRatings,
      satisfaction,
      counts: ratingCounts
    }
  };
};

const listPublicProducts = async (req, res, next) => {
  try {
    const query = listSchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;
    const where = buildWhere(query);

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit
      })
    ]);

    return res.json({
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getPublicProduct = async (req, res, next) => {
  try {
    const product = await fetchProductDetail(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ data: buildProductDetailPayload(product) });
  } catch (error) {
    return next(error);
  }
};

const listAdminProducts = async (req, res, next) => {
  try {
    const query = listSchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;
    const where = buildWhere(query);

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit
      })
    ]);

    return res.json({
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminProduct = async (req, res, next) => {
  try {
    const product = await fetchProductDetail(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ data: buildProductDetailPayload(product) });
  } catch (error) {
    return next(error);
  }
};
const createProduct = async (req, res, next) => {
  try {
    const payload = productSchema.parse(req.body);
    const images = payload.images || [];
    const specs = payload.specs || [];
    const product = await prisma.product.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: new Prisma.Decimal(payload.price),
        category: payload.category,
        location: payload.location,
        imageUrl: payload.imageUrl,
        condition: payload.condition,
        weight: payload.weight !== undefined ? new Prisma.Decimal(payload.weight) : undefined,
        weightUnit: payload.weightUnit,
        stock: payload.stock,
        productImages: images.length
          ? {
              create: images.map((image, index) => ({
                url: image.url,
                sortOrder: index
              }))
            }
          : undefined,
        productSpecs: specs.length
          ? {
              create: specs.map((spec, index) => ({
                label: spec.label,
                value: spec.value,
                sortOrder: index
              }))
            }
          : undefined
      }
    });

    return res.status(201).json({ data: product });
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const payload = productSchema.partial().parse(req.body);
    const images = payload.images || [];
    const specs = payload.specs || [];
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price !== undefined ? new Prisma.Decimal(payload.price) : undefined,
        category: payload.category,
        location: payload.location,
        imageUrl: payload.imageUrl,
        condition: payload.condition,
        weight: payload.weight !== undefined ? new Prisma.Decimal(payload.weight) : undefined,
        weightUnit: payload.weightUnit,
        stock: payload.stock,
        productImages: payload.images
          ? {
              deleteMany: {},
              create: images.map((image, index) => ({
                url: image.url,
                sortOrder: index
              }))
            }
          : undefined,
        productSpecs: payload.specs
          ? {
              deleteMany: {},
              create: specs.map((spec, index) => ({
                label: spec.label,
                value: spec.value,
                sortOrder: index
              }))
            }
          : undefined
      }
    });

    return res.json({ data: product });
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listPublicProducts,
  getPublicProduct,
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
