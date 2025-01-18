function validatePassword(password) {
  const isValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password);

  if (!isValid) {
    return "Password must be at least 8 characters long, with an uppercase, lowercase, number, and special character..";
  }

  return null;
}

module.exports = { validatePassword };
