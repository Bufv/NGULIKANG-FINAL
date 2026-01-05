const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

const durationToMs = (value) => {
  if (!value) {
    return 0;
  }
  if (typeof value === 'number') {
    return value * 1000;
  }
  const match = /^([0-9]+)([smhd])$/.exec(value);
  if (!match) {
    return 0;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const createAccessToken = (user) => {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtAccessExpires
  });
};

const createRefreshToken = (user) => {
  return jwt.sign({ sub: user.id, role: user.role, type: 'refresh' }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires
  });
};

const getRefreshExpiryDate = () => {
  const ms = durationToMs(env.jwtRefreshExpires);
  return new Date(Date.now() + ms);
};

module.exports = {
  hashToken,
  createAccessToken,
  createRefreshToken,
  getRefreshExpiryDate
};
