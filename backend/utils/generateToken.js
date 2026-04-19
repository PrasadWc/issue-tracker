const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token
 * @param {string} id - User ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = generateToken;
