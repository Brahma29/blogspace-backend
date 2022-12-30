function isEmail(email) {
  const validRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return validRegex.test(email);
}

function isAlphabetic(value) {
  const validRegex = /^[A-Za-z]*$/;
  return validRegex.test(value);
}

module.exports = {
  isEmail,
  isAlphabetic,
};
