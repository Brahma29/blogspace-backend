const bcrypt = require("bcryptjs");

const hash = async (payload) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(payload, salt);
};

const compareHash = (hashedPayload, payload) =>
  bcrypt.compare(payload, hashedPayload);

module.exports = {
  hash,
  compareHash,
};
