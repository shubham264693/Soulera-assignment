const jwt = require('jsonwebtoken');
const { User } = require('../model');

const checkAuth = async (req) => {
  const auth = req.headers.authorization;
  if (!auth) throw new Error('Authorization header missing');
  const token = auth.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error('User not found');
  req.user = user;
};

module.exports = checkAuth;