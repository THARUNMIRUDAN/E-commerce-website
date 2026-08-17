import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'revibe_secret_jwt_key_fallback_2026', {
    expiresIn: '30d',
  });
};

export default generateToken;
