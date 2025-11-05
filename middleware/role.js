module.exports = function(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ msg: 'Недостаточно прав для этого действия' });
    }
    next();
  };
};
