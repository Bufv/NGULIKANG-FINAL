const errorHandler = (err, req, res, next) => {
  if (err && err.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation error', errors: err.issues });
  }

  if (err && err.code === 'P2002') {
    return res.status(409).json({ message: 'Unique constraint violation' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(status).json({ message });
};

const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

module.exports = {
  errorHandler,
  notFound
};
