const crypto = require('crypto');

exports.generateToken2 = () => {
  return crypto.randomBytes(20).toString('hex');
};
